import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { 
  Server, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  ChevronDown, 
  ChevronUp,
  Terminal,
  Settings,
  CloudUpload,
  Key,
  RefreshCw
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc`;

export function ServerConfigGuide() {
  const [serverStatus, setServerStatus] = useState<'checking' | 'configured' | 'not-configured' | 'error'>('checking');
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [showDetailedGuide, setShowDetailedGuide] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const checkServerConfig = async () => {
    setChecking(true);
    setServerStatus('checking');
    setErrorDetails(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(`${API_BASE_URL}/health`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setServerStatus('configured');
        console.log('✅ Servidor configurado correctamente:', data);
      } else {
        const errorData = await response.json().catch(() => null);
        setErrorDetails(errorData);
        
        if (response.status === 401) {
          setServerStatus('not-configured');
        } else {
          setServerStatus('error');
        }
      }
    } catch (error) {
      console.error('❌ Error checking server:', error);
      setServerStatus('not-configured');
      
      if (error instanceof Error) {
        setErrorDetails({
          code: 'NETWORK_ERROR',
          message: error.message,
          name: error.name
        });
      }
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkServerConfig();
  }, []);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <Card className={`border-2 ${
        serverStatus === 'configured' 
          ? 'border-green-200 bg-green-50' 
          : serverStatus === 'checking'
          ? 'border-blue-200 bg-blue-50'
          : 'border-red-200 bg-red-50'
      }`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            Estado del Servidor Backend
          </CardTitle>
          <CardDescription>
            Verifica que el servidor Edge Function esté desplegado y configurado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {serverStatus === 'checking' && (
                <>
                  <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="font-medium">Verificando configuración...</span>
                </>
              )}
              {serverStatus === 'configured' && (
                <>
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <div>
                    <Badge className="bg-green-600 hover:bg-green-700">✅ Configurado Correctamente</Badge>
                    <p className="text-xs text-gray-600 mt-1">El servidor está funcionando perfectamente</p>
                  </div>
                </>
              )}
              {(serverStatus === 'not-configured' || serverStatus === 'error') && (
                <>
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <div>
                    <Badge variant="destructive">❌ Servidor NO configurado</Badge>
                    <p className="text-xs text-gray-600 mt-1">
                      {errorDetails?.message || 'El servidor no está respondiendo'}
                    </p>
                  </div>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={checkServerConfig}
              disabled={checking}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
              Verificar
            </Button>
          </div>

          {/* Error Details */}
          {(serverStatus === 'not-configured' || serverStatus === 'error') && errorDetails && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error de Conexión</AlertTitle>
              <AlertDescription className="text-sm space-y-1">
                <p><strong>Código:</strong> {errorDetails.code}</p>
                <p><strong>Mensaje:</strong> {errorDetails.message}</p>
                {errorDetails.debug && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs">Ver detalles técnicos</summary>
                    <pre className="text-xs mt-2 bg-black/5 p-2 rounded overflow-auto">
                      {JSON.stringify(errorDetails.debug, null, 2)}
                    </pre>
                  </details>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Server Info */}
          <div className="bg-white/50 rounded-lg p-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">URL del servidor:</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => copyToClipboard(API_BASE_URL, 'url')}
              >
                {copied === 'url' ? (
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                ) : (
                  <Copy className="w-3 h-3 mr-1" />
                )}
                {API_BASE_URL.substring(0, 40)}...
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Proyecto ID:</span>
              <code className="bg-black/10 px-2 py-1 rounded">{projectId}</code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Guide (only show if not configured) */}
      {(serverStatus === 'not-configured' || serverStatus === 'error') && (
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <Settings className="w-5 h-5" />
                Guía de Configuración
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailedGuide(!showDetailedGuide)}
              >
                {showDetailedGuide ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
            <CardDescription>
              Sigue estos pasos para configurar el servidor correctamente
            </CardDescription>
          </CardHeader>
          
          {showDetailedGuide && (
            <CardContent className="space-y-6">
              {/* Step 1: Verify Deployment */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="font-semibold text-orange-900">Verificar Despliegue</h3>
                </div>
                <div className="ml-10 space-y-2">
                  <p className="text-sm text-gray-700">
                    Asegúrate de que el servidor esté desplegado en Supabase:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Ve al Dashboard de Supabase → Edge Functions</li>
                    <li>Verifica que exista una función llamada "server"</li>
                    <li>Verifica que tenga al menos un deployment "Active" (verde)</li>
                  </ul>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}/functions`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir Supabase Edge Functions
                  </Button>
                </div>
              </div>

              {/* Step 2: Configure Environment Variables */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="font-semibold text-orange-900">Configurar Variables de Entorno</h3>
                </div>
                <div className="ml-10 space-y-3">
                  <p className="text-sm text-gray-700">
                    Agrega estas 3 variables en la configuración de la función:
                  </p>
                  
                  {/* Variables */}
                  <div className="space-y-2">
                    {/* SUPABASE_URL */}
                    <div className="bg-white rounded-lg p-3 border border-orange-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-gray-600">SUPABASE_URL</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => copyToClipboard(`https://${projectId}.supabase.co`, 'url-env')}
                        >
                          {copied === 'url-env' ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
                        https://{projectId}.supabase.co
                      </code>
                    </div>

                    {/* SUPABASE_ANON_KEY */}
                    <div className="bg-white rounded-lg p-3 border border-orange-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-gray-600">SUPABASE_ANON_KEY</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => copyToClipboard(publicAnonKey, 'anon-key')}
                        >
                          {copied === 'anon-key' ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded block overflow-hidden text-ellipsis">
                        {publicAnonKey.substring(0, 50)}...
                      </code>
                    </div>

                    {/* SUPABASE_SERVICE_ROLE_KEY */}
                    <div className="bg-white rounded-lg p-3 border border-orange-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-gray-600">SUPABASE_SERVICE_ROLE_KEY</span>
                        <Badge variant="destructive" className="text-xs">Secreto</Badge>
                      </div>
                      <p className="text-xs text-gray-600">
                        Obtén esta key en: Dashboard → Settings → API → service_role
                      </p>
                      <Alert className="mt-2 bg-red-50 border-red-200">
                        <Key className="h-3 w-3" />
                        <AlertDescription className="text-xs">
                          ⚠️ NUNCA compartas esta key públicamente
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}/settings/api`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Obtener API Keys
                  </Button>
                </div>
              </div>

              {/* Step 3: Redeploy */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <h3 className="font-semibold text-orange-900">Redesplegar la Función</h3>
                </div>
                <div className="ml-10 space-y-2">
                  <p className="text-sm text-gray-700">
                    Después de configurar las variables, redesplega la función:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>En Supabase Dashboard → Edge Functions → server</li>
                    <li>Haz clic en "Deploy" o "Redeploy"</li>
                    <li>Espera 1-2 minutos a que termine</li>
                  </ul>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}/functions/server`, '_blank')}
                  >
                    <CloudUpload className="w-4 h-4 mr-2" />
                    Ir a Despliegues
                  </Button>
                </div>
              </div>

              {/* Step 4: Verify */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                    4
                  </div>
                  <h3 className="font-semibold text-orange-900">Verificar Configuración</h3>
                </div>
                <div className="ml-10 space-y-2">
                  <p className="text-sm text-gray-700">
                    Después del redespliegue, haz clic en el botón "Verificar" arriba.
                  </p>
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-sm text-green-900">
                      Si todo está correcto, verás el mensaje "✅ Configurado Correctamente"
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              {/* Documentation Link */}
              <div className="pt-4 border-t border-orange-200">
                <p className="text-sm text-gray-700 mb-2">
                  📚 Para instrucciones detalladas, consulta:
                </p>
                <code className="text-xs bg-black/10 px-2 py-1 rounded">
                  /SOLUCION_MISSING_AUTHORIZATION_HEADER.md
                </code>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Success Message */}
      {serverStatus === 'configured' && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-900">¡Configuración Exitosa!</AlertTitle>
          <AlertDescription className="text-green-800">
            El servidor Edge Function está desplegado y configurado correctamente. 
            Todas las funcionalidades del sistema están disponibles.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
