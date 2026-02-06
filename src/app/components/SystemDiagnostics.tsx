import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { getMigrationInfo, checkBackendHealth } from '@/app/services/migration';
import { useAuth } from '@/app/contexts/AuthContext';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
}

export function SystemDiagnostics() {
  const { user } = useAuth();
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [checking, setChecking] = useState(false);

  const runDiagnostics = async () => {
    setChecking(true);
    const diagnosticResults: DiagnosticResult[] = [];

    // 1. Verificar configuración de Supabase
    try {
      if (projectId && publicAnonKey) {
        diagnosticResults.push({
          name: 'Configuración de Supabase',
          status: 'success',
          message: `Proyecto: ${projectId}`,
        });
      } else {
        diagnosticResults.push({
          name: 'Configuración de Supabase',
          status: 'error',
          message: 'Faltan credenciales de Supabase',
        });
      }
    } catch (error) {
      diagnosticResults.push({
        name: 'Configuración de Supabase',
        status: 'error',
        message: `Error: ${error}`,
      });
    }

    // 2. Verificar salud del backend
    try {
      const isHealthy = await checkBackendHealth();
      if (isHealthy) {
        diagnosticResults.push({
          name: 'Backend Server',
          status: 'success',
          message: 'Servidor funcionando correctamente',
        });
      } else {
        diagnosticResults.push({
          name: 'Backend Server',
          status: 'error',
          message: 'Servidor no responde',
        });
      }
    } catch (error) {
      diagnosticResults.push({
        name: 'Backend Server',
        status: 'error',
        message: `Error de conexión: ${error}`,
      });
    }

    // 3. Verificar autenticación
    try {
      if (user) {
        diagnosticResults.push({
          name: 'Autenticación',
          status: 'success',
          message: `Usuario: ${user.email} (${user.role})`,
        });
      } else {
        diagnosticResults.push({
          name: 'Autenticación',
          status: 'warning',
          message: 'No hay sesión activa',
        });
      }
    } catch (error) {
      diagnosticResults.push({
        name: 'Autenticación',
        status: 'error',
        message: `Error: ${error}`,
      });
    }

    // 4. Verificar localStorage
    try {
      const session = localStorage.getItem('supabase_session');
      if (session) {
        const sessionData = JSON.parse(session);
        diagnosticResults.push({
          name: 'Sesión Local',
          status: 'success',
          message: `Token almacenado (${sessionData.accessToken ? 'válido' : 'inválido'})`,
        });
      } else {
        diagnosticResults.push({
          name: 'Sesión Local',
          status: 'warning',
          message: 'No hay token guardado',
        });
      }
    } catch (error) {
      diagnosticResults.push({
        name: 'Sesión Local',
        status: 'error',
        message: `Error leyendo sesión: ${error}`,
      });
    }

    // 5. Verificar migración
    try {
      const migrationInfo = getMigrationInfo();
      diagnosticResults.push({
        name: 'Estado de Migración',
        status: migrationInfo.hasLegacyData ? 'warning' : 'success',
        message: migrationInfo.hasLegacyData 
          ? 'Hay datos antiguos en localStorage' 
          : 'Sistema migrado completamente',
      });
    } catch (error) {
      diagnosticResults.push({
        name: 'Estado de Migración',
        status: 'error',
        message: `Error: ${error}`,
      });
    }

    setResults(diagnosticResults);
    setChecking(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, [user]);

  const getIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Diagnóstico del Sistema</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={runDiagnostics}
          disabled={checking}
        >
          {checking ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Verificar
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {results.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Ejecuta el diagnóstico para verificar el estado del sistema
            </div>
          )}
          
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
            >
              <div className="flex items-start gap-3">
                {getIcon(result.status)}
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">
                    {result.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {result.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-sm mb-2 text-blue-900">
            📊 Información del Sistema
          </h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• <strong>Proyecto:</strong> Club Natación Lo Prado</p>
            <p>• <strong>Backend:</strong> Supabase Edge Functions</p>
            <p>• <strong>Autenticación:</strong> Supabase Auth (JWT)</p>
            <p>• <strong>Almacenamiento:</strong> KV Store + Supabase Storage</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}