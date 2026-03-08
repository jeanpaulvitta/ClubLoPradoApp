import { AlertCircle, CheckCircle, RefreshCw, Server } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc`;

interface ServerStatusProps {
  onRetry?: () => void;
}

export function ServerStatus({ onRetry }: ServerStatusProps) {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [errorDetails, setErrorDetails] = useState<string>('');

  const checkServer = async () => {
    setStatus('checking');
    setErrorDetails('');
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_BASE_URL}/health`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setStatus('online');
        setLastCheck(new Date());
      } else {
        setStatus('offline');
        setErrorDetails(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      setStatus('offline');
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setErrorDetails('Request timeout - Server not responding');
        } else {
          setErrorDetails(error.message);
        }
      } else {
        setErrorDetails('Unknown error');
      }
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkServer();
  }, []);

  return (
    <Card className="border-2 border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-900">
          <Server className="w-5 h-5" />
          Estado del Servidor Backend
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {status === 'checking' && (
              <>
                <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-sm font-medium">Verificando conexión...</span>
              </>
            )}
            {status === 'online' && (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <Badge variant="default" className="bg-green-600">En Línea</Badge>
              </>
            )}
            {status === 'offline' && (
              <>
                <AlertCircle className="w-5 h-5 text-red-600" />
                <Badge variant="destructive">Sin Conexión</Badge>
              </>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              checkServer();
              if (onRetry) onRetry();
            }}
            disabled={status === 'checking'}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${status === 'checking' ? 'animate-spin' : ''}`} />
            Reintentar
          </Button>
        </div>

        {status === 'offline' && (
          <div className="bg-white rounded p-3 border border-red-200">
            <p className="text-sm font-semibold text-red-900 mb-2">⚠️ Error de Conexión</p>
            <p className="text-xs text-gray-700 mb-2">{errorDetails}</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>URL del servidor:</strong> {API_BASE_URL}</p>
              <p><strong>Proyecto ID:</strong> {projectId}</p>
            </div>
          </div>
        )}

        {lastCheck && (
          <p className="text-xs text-gray-600">
            Última verificación: {lastCheck.toLocaleTimeString()}
          </p>
        )}

        {status === 'offline' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <p className="text-sm font-semibold text-yellow-900 mb-2">💡 Pasos para solucionar:</p>
            <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
              <li>Verifica que el proyecto de Supabase esté activo</li>
              <li>Asegúrate de que las Edge Functions estén desplegadas</li>
              <li>Revisa los logs en el dashboard de Supabase</li>
              <li>Verifica que las credenciales (API keys) sean correctas</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
}