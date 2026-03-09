import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  Wifi,
  WifiOff,
  Power,
  ExternalLink
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { toast } from 'sonner';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc`;

export function OfflineModeChecker() {
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [offlineMode, setOfflineMode] = useState(false);
  const [checking, setChecking] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Verificar si está en modo offline al cargar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isOffline = localStorage.getItem('backend_offline_mode') === 'true';
      setOfflineMode(isOffline);
      if (isOffline) {
        console.log('⚠️ Modo offline detectado');
      }
    }
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    setChecking(true);
    setServerStatus('checking');
    setErrorMessage('');

    try {
      console.log('🔍 Verificando conexión al servidor...');
      console.log('📡 URL:', `${API_BASE_URL}/health`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('📊 Respuesta del servidor:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Datos recibidos:', data);
        
        setServerStatus('online');
        setLastCheckTime(new Date());
        
        // Si el servidor está OK, limpiar modo offline automáticamente
        if (typeof window !== 'undefined' && localStorage.getItem('backend_offline_mode') === 'true') {
          console.log('🔄 Servidor en línea detectado, limpiando modo offline...');
          localStorage.removeItem('backend_offline_mode');
          setOfflineMode(false);
          toast.success('¡Servidor conectado!', {
            description: 'El modo offline ha sido desactivado automáticamente',
            duration: 5000,
          });
        }
      } else {
        console.warn('⚠️ Servidor respondió con error:', response.status);
        const errorText = await response.text();
        console.warn('⚠️ Error response:', errorText);
        
        setServerStatus('offline');
        setErrorMessage(`Error ${response.status}: ${response.statusText || 'Servidor no disponible'}`);
        setLastCheckTime(new Date());
      }
    } catch (error) {
      console.error('❌ Error al verificar servidor:', error);
      
      setServerStatus('offline');
      setLastCheckTime(new Date());
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setErrorMessage('Timeout: El servidor no respondió en 10 segundos');
        } else {
          setErrorMessage(`Error de red: ${error.message}`);
        }
      } else {
        setErrorMessage('Error desconocido al conectar con el servidor');
      }
    } finally {
      setChecking(false);
    }
  };

  const exitOfflineModeAndReload = () => {
    if (typeof window !== 'undefined') {
      console.log('🔄 Saliendo del modo offline y recargando...');
      localStorage.removeItem('backend_offline_mode');
      setOfflineMode(false);
      
      toast.success('Modo offline desactivado', {
        description: 'Recargando la aplicación...',
        duration: 2000,
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const retryConnection = () => {
    toast.info('Verificando conexión...', {
      description: 'Comprobando estado del servidor',
    });
    checkServerConnection();
  };

  return (
    <Card className={`border-2 ${
      serverStatus === 'online' 
        ? 'border-green-200 bg-green-50' 
        : serverStatus === 'checking'
        ? 'border-blue-200 bg-blue-50'
        : 'border-red-200 bg-red-50'
    }`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {serverStatus === 'online' ? (
            <Wifi className="w-5 h-5 text-green-600" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-600" />
          )}
          Verificación de Conexión del Servidor
        </CardTitle>
        <CardDescription>
          Estado actual de la conexión a Supabase Edge Functions
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Estado del servidor */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {serverStatus === 'checking' && (
              <>
                <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="font-medium text-blue-900">Verificando...</span>
              </>
            )}
            {serverStatus === 'online' && (
              <>
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div>
                  <Badge className="bg-green-600 hover:bg-green-700">
                    ✅ Servidor en Línea
                  </Badge>
                  <p className="text-xs text-gray-600 mt-1">
                    Conexión establecida correctamente
                  </p>
                </div>
              </>
            )}
            {serverStatus === 'offline' && (
              <>
                <AlertCircle className="w-6 h-6 text-red-600" />
                <div>
                  <Badge variant="destructive">
                    ❌ Servidor Fuera de Línea
                  </Badge>
                  <p className="text-xs text-gray-600 mt-1">
                    No se pudo conectar al servidor
                  </p>
                </div>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={retryConnection}
            disabled={checking}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
            Verificar
          </Button>
        </div>

        {/* Mensaje de error */}
        {serverStatus === 'offline' && errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error de Conexión</AlertTitle>
            <AlertDescription className="text-sm">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Información de modo offline */}
        {offlineMode && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-900">
              Modo Offline Activado
            </AlertTitle>
            <AlertDescription className="text-yellow-800 space-y-3">
              <p className="text-sm">
                La aplicación está funcionando en modo offline porque no se pudo conectar al servidor.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exitOfflineModeAndReload}
                  className="bg-yellow-100 border-yellow-600 hover:bg-yellow-200"
                >
                  <Power className="w-4 h-4 mr-2" />
                  Salir del Modo Offline
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}/functions`, '_blank')}
                  className="bg-yellow-100 border-yellow-600 hover:bg-yellow-200"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir Dashboard Supabase
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Success message */}
        {serverStatus === 'online' && !offlineMode && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-900">
              ¡Conexión Exitosa!
            </AlertTitle>
            <AlertDescription className="text-green-800">
              El servidor está funcionando correctamente. Todas las funcionalidades están disponibles.
            </AlertDescription>
          </Alert>
        )}

        {/* Última verificación */}
        {lastCheckTime && (
          <p className="text-xs text-gray-600">
            Última verificación: {lastCheckTime.toLocaleTimeString('es-CL', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </p>
        )}

        {/* Información técnica */}
        <div className="bg-white/50 rounded-lg p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">URL del servidor:</span>
            <code className="bg-black/10 px-2 py-1 rounded text-xs">
              {API_BASE_URL}
            </code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Proyecto ID:</span>
            <code className="bg-black/10 px-2 py-1 rounded">{projectId}</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Endpoint de salud:</span>
            <code className="bg-black/10 px-2 py-1 rounded">/health</code>
          </div>
        </div>

        {/* Botones de acción */}
        {serverStatus === 'offline' && (
          <div className="pt-2 space-y-2">
            <p className="text-sm font-semibold text-gray-800">
              💡 Pasos para solucionar:
            </p>
            <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
              <li>Verifica que las Edge Functions estén desplegadas en Supabase</li>
              <li>Asegúrate de que las variables de entorno estén configuradas</li>
              <li>Revisa los logs en el Dashboard de Supabase</li>
              <li>Haz clic en "Salir del Modo Offline" y recarga la página</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
