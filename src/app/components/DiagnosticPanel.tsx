import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle2, XCircle, Loader2, RefreshCw, Server, Database, Shield } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export function DiagnosticPanel() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<{
    serverReachable: boolean | null;
    healthCheck: boolean | null;
    authEndpoint: boolean | null;
    errorDetails: string;
  }>({
    serverReachable: null,
    healthCheck: null,
    authEndpoint: null,
    errorDetails: '',
  });

  const runDiagnostics = async () => {
    setTesting(true);
    const newResults = {
      serverReachable: false,
      healthCheck: false,
      authEndpoint: false,
      errorDetails: '',
    };

    try {
      // Test 1: Server reachable
      console.log('🔍 Test 1: Verificando conectividad al servidor...');
      const baseUrl = `https://${projectId}.supabase.co`;
      try {
        const response = await fetch(baseUrl);
        newResults.serverReachable = true;
        console.log('✅ Servidor alcanzable');
      } catch (err) {
        newResults.errorDetails += `Error conectando al servidor: ${err}\n`;
        console.error('❌ Servidor no alcanzable:', err);
      }

      // Test 2: Health endpoint
      console.log('🔍 Test 2: Verificando endpoint de salud...');
      const healthUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc/health`;
      try {
        const response = await fetch(healthUrl, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        });
        if (response.ok) {
          newResults.healthCheck = true;
          console.log('✅ Health endpoint OK');
        } else {
          newResults.errorDetails += `Health endpoint retornó status ${response.status}\n`;
          console.error('❌ Health endpoint falló:', response.status);
        }
      } catch (err) {
        newResults.errorDetails += `Error en health check: ${err}\n`;
        console.error('❌ Health check error:', err);
      }

      // Test 3: Auth endpoint
      console.log('🔍 Test 3: Verificando endpoint de autenticación...');
      const authUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc/auth/init-admin`;
      try {
        const response = await fetch(authUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });
        
        // Si es 200 o 409 (already exists), consideramos que funciona
        if (response.ok || response.status === 409) {
          newResults.authEndpoint = true;
          const data = await response.json();
          console.log('✅ Auth endpoint OK:', data);
        } else {
          const data = await response.json().catch(() => ({}));
          newResults.errorDetails += `Auth endpoint retornó status ${response.status}: ${JSON.stringify(data)}\n`;
          console.error('❌ Auth endpoint falló:', response.status, data);
        }
      } catch (err) {
        newResults.errorDetails += `Error en auth endpoint: ${err}\n`;
        console.error('❌ Auth endpoint error:', err);
      }

    } catch (err) {
      newResults.errorDetails += `Error general: ${err}\n`;
      console.error('❌ Error general en diagnóstico:', err);
    } finally {
      setResults(newResults);
      setTesting(false);
    }
  };

  const TestStatus = ({ status }: { status: boolean | null }) => {
    if (status === null) return <div className="w-5 h-5 border-2 border-gray-400 rounded-full" />;
    return status ? (
      <CheckCircle2 className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  return (
    <Card className="border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600">
          <Server className="w-5 h-5" />
          Panel de Diagnóstico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-950/20 border border-blue-500/30 rounded-lg p-3 text-sm">
          <p className="text-blue-200 mb-2">
            Este panel verifica la conectividad con el servidor de Supabase.
          </p>
          <div className="text-xs text-blue-300/70 space-y-1">
            <p><strong>Project ID:</strong> {projectId}</p>
            <p><strong>Base URL:</strong> https://{projectId}.supabase.co</p>
          </div>
        </div>

        <Button
          onClick={runDiagnostics}
          disabled={testing}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          {testing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Ejecutando diagnóstico...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Ejecutar Diagnóstico
            </>
          )}
        </Button>

        {/* Resultados */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
            <Server className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300 flex-1">Servidor alcanzable</span>
            <TestStatus status={results.serverReachable} />
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
            <Database className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300 flex-1">Health endpoint</span>
            <TestStatus status={results.healthCheck} />
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300 flex-1">Auth endpoint</span>
            <TestStatus status={results.authEndpoint} />
          </div>
        </div>

        {/* Error details */}
        {results.errorDetails && (
          <details className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
            <summary className="text-sm text-red-200 cursor-pointer font-semibold">
              Ver detalles de errores
            </summary>
            <pre className="text-xs text-red-300 mt-2 overflow-x-auto whitespace-pre-wrap">
              {results.errorDetails}
            </pre>
          </details>
        )}

        {/* Recomendaciones */}
        {!testing && results.authEndpoint !== null && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-300 mb-2">
              💡 Interpretación de resultados:
            </p>
            <ul className="text-xs text-gray-400 space-y-1">
              {results.serverReachable === false && (
                <li className="text-red-300">❌ No hay conexión a Supabase. Verifica tu internet.</li>
              )}
              {results.healthCheck === false && (
                <li className="text-yellow-300">⚠️ El servidor Edge Function no responde. Verifica que esté desplegado.</li>
              )}
              {results.authEndpoint === false && (
                <li className="text-red-300">❌ El endpoint de autenticación falló. Revisa los logs del servidor.</li>
              )}
              {results.authEndpoint === true && (
                <li className="text-green-300">✅ Todo está funcionando correctamente. Puedes crear el administrador.</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
