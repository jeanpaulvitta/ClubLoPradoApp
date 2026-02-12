import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

export function SupabaseHealthCheck() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<{
    apiConnection?: 'success' | 'error';
    edgeFunction?: 'success' | 'error';
    signupTest?: 'success' | 'error';
    errors?: {
      apiConnection?: string;
      edgeFunction?: string;
      signupTest?: string;
    };
    envConfig?: {
      SUPABASE_URL: boolean;
      SUPABASE_SERVICE_ROLE_KEY: boolean;
      SUPABASE_ANON_KEY: boolean;
    };
    serverMessage?: string;
  }>({});

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc`;

  const runTests = async () => {
    setTesting(true);
    const newResults: typeof results = { errors: {} };

    // Test 1: API Connection
    try {
      const response = await fetch(`https://${projectId}.supabase.co/rest/v1/`, {
        headers: {
          'apikey': publicAnonKey,
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (response.status === 200 || response.status === 404) {
        newResults.apiConnection = 'success';
      } else {
        newResults.apiConnection = 'error';
        newResults.errors!.apiConnection = `Status: ${response.status}`;
      }
    } catch (error) {
      newResults.apiConnection = 'error';
      newResults.errors!.apiConnection = error instanceof Error ? error.message : String(error);
    }

    // Test 2: Edge Function Health
    try {
      const response = await fetch(`${API_URL}/health`);
      
      if (response.ok) {
        const data = await response.json();
        
        // Guardar información de configuración del servidor
        if (data.environment) {
          newResults.envConfig = data.environment;
        }
        if (data.message) {
          newResults.serverMessage = data.message;
        }
        
        if (data.status === 'ok') {
          newResults.edgeFunction = 'success';
        } else if (data.status === 'misconfigured') {
          newResults.edgeFunction = 'error';
          newResults.errors!.edgeFunction = data.message || 'Server misconfigured';
        } else {
          newResults.edgeFunction = 'error';
          newResults.errors!.edgeFunction = 'Health check returned non-OK status';
        }
      } else {
        newResults.edgeFunction = 'error';
        const errorText = await response.text();
        newResults.errors!.edgeFunction = `Status: ${response.status} - ${errorText}`;
      }
    } catch (error) {
      newResults.edgeFunction = 'error';
      newResults.errors!.edgeFunction = error instanceof Error ? error.message : String(error);
    }

    // Test 3: Signup Test (con email temporal)
    try {
      const testEmail = `test-${Date.now()}@diagnostico.com`;
      console.log('🧪 Testing signup with email:', testEmail);
      
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          password: 'Test1234!@#',
          name: 'Test User',
          role: 'swimmer'
        }),
      });

      console.log('📥 Signup response status:', response.status);
      const responseText = await response.text();
      console.log('📥 Signup response body:', responseText);

      if (response.ok) {
        newResults.signupTest = 'success';
      } else {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { error: responseText };
        }
        
        newResults.signupTest = 'error';
        const errorMsg = errorData.error || errorData.message || errorData.details?.message || `Status: ${response.status}`;
        newResults.errors!.signupTest = errorMsg;
        
        console.error('❌ Signup test failed:', errorData);
      }
    } catch (error) {
      newResults.signupTest = 'error';
      newResults.errors!.signupTest = error instanceof Error ? error.message : String(error);
      console.error('❌ Signup test error:', error);
    }

    setResults(newResults);
    setTesting(false);
  };

  const getStatusIcon = (status?: 'success' | 'error') => {
    if (!status) return <AlertCircle className="w-5 h-5 text-gray-400" />;
    if (status === 'success') return <CheckCircle className="w-5 h-5 text-green-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const getStatusBadge = (status?: 'success' | 'error') => {
    if (!status) return <Badge variant="outline">No probado</Badge>;
    if (status === 'success') return <Badge className="bg-green-600">✓ OK</Badge>;
    return <Badge className="bg-red-600">✗ Error</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🔍 Diagnóstico de Supabase</span>
          <Button
            onClick={runTests}
            disabled={testing}
            size="sm"
          >
            {testing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Probando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Ejecutar Tests
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Configuración */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
          <p className="font-semibold text-gray-700">Configuración:</p>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Project ID:</span>
            <code className="bg-white px-2 py-1 rounded text-xs">{projectId}</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">API URL:</span>
            <code className="bg-white px-2 py-1 rounded text-xs break-all">
              {API_URL}
            </code>
          </div>
        </div>

        {/* Test Results */}
        {Object.keys(results).length > 0 && (
          <div className="space-y-3">
            {/* Test 1: API Connection */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(results.apiConnection)}
                  <span className="font-medium">1. Conexión API</span>
                </div>
                {getStatusBadge(results.apiConnection)}
              </div>
              {results.errors?.apiConnection && (
                <Alert className="mt-2 bg-red-50 border-red-200">
                  <AlertDescription className="text-xs text-red-800">
                    {results.errors.apiConnection}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Test 2: Edge Function */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(results.edgeFunction)}
                  <span className="font-medium">2. Edge Function Health</span>
                </div>
                {getStatusBadge(results.edgeFunction)}
              </div>
              {results.errors?.edgeFunction && (
                <Alert className="mt-2 bg-red-50 border-red-200">
                  <AlertDescription className="text-xs text-red-800">
                    {results.errors.edgeFunction}
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Mostrar estado de variables de entorno si están disponibles */}
              {results.envConfig && (
                <div className="mt-2 bg-gray-50 p-3 rounded text-xs space-y-1">
                  <p className="font-semibold mb-2">Variables de Entorno del Servidor:</p>
                  <div className="space-y-1">
                    {Object.entries(results.envConfig).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <code className="text-xs">{key}:</code>
                        {value ? (
                          <span className="text-green-700 font-semibold">✓ Configurada</span>
                        ) : (
                          <span className="text-red-700 font-semibold">✗ Falta</span>
                        )}
                      </div>
                    ))}
                  </div>
                  {results.serverMessage && (
                    <p className="mt-2 pt-2 border-t border-gray-300 text-gray-700">
                      {results.serverMessage}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Test 3: Signup Test */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(results.signupTest)}
                  <span className="font-medium">3. Test de Registro (Signup)</span>
                </div>
                {getStatusBadge(results.signupTest)}
              </div>
              {results.errors?.signupTest && (
                <>
                  <Alert className="mt-2 bg-red-50 border-red-200">
                    <AlertDescription className="text-xs text-red-800">
                      <strong>Error específico:</strong><br />
                      {results.errors.signupTest}
                    </AlertDescription>
                  </Alert>
                  
                  {results.errors.signupTest.includes('Missing authorization header') && (
                    <Alert className="mt-2 bg-red-50 border-red-400">
                      <AlertDescription className="text-xs text-red-900">
                        <p className="font-bold mb-3 text-base">🚨 EL SERVIDOR NO ESTÁ DESPLEGADO</p>
                        <p className="mb-3 font-semibold">
                          Este error significa que el código del servidor está sin desplegar o tiene el código de ejemplo.
                        </p>
                        
                        <div className="bg-white p-3 rounded border border-red-300 mb-3">
                          <p className="font-bold mb-2">✅ SOLUCIÓN RÁPIDA (5 minutos):</p>
                          <ol className="list-decimal ml-4 space-y-2">
                            <li>
                              <strong>Instalar CLI:</strong>
                              <div className="ml-2 mt-1 bg-gray-100 p-2 rounded text-xs font-mono">
                                Mac: brew install supabase/tap/supabase<br/>
                                Windows: <a href="https://github.com/supabase/cli/releases/latest/download/supabase_windows_amd64.msi" target="_blank" className="underline text-blue-700">Descargar MSI</a>
                              </div>
                            </li>
                            <li>
                              <strong>Abrir terminal en carpeta del proyecto</strong>
                            </li>
                            <li>
                              <strong>Ejecutar 3 comandos:</strong>
                              <div className="ml-2 mt-1 bg-gray-100 p-2 rounded text-xs font-mono">
                                supabase login<br/>
                                supabase link --project-ref vrclozhgaacehojbnpuo<br/>
                                supabase functions deploy make-server-4909a0bc
                              </div>
                            </li>
                            <li>
                              <strong>Configurar variables:</strong> Ve a <a href="https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions/make-server-4909a0bc" target="_blank" className="underline text-blue-700">Edge Functions → Secrets</a> y agrega:
                              <ul className="list-disc ml-4 mt-1">
                                <li><code className="bg-white px-1">SUPABASE_URL</code></li>
                                <li><code className="bg-white px-1">SUPABASE_ANON_KEY</code></li>
                                <li><code className="bg-white px-1">SUPABASE_SERVICE_ROLE_KEY</code></li>
                              </ul>
                            </li>
                          </ol>
                        </div>
                        
                        <p className="text-xs mt-3 bg-yellow-100 p-2 rounded border border-yellow-400">
                          📄 <strong>Instrucciones detalladas:</strong> Abre el archivo <code className="bg-white px-1">/DESPLIEGUE_EN_3_PASOS.md</code> en tu proyecto
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </div>

            {/* Resumen */}
            <Alert className={
              results.apiConnection === 'success' && 
              results.edgeFunction === 'success' && 
              results.signupTest === 'success'
                ? 'bg-green-50 border-green-300'
                : 'bg-yellow-50 border-yellow-300'
            }>
              <AlertDescription>
                {results.apiConnection === 'success' && 
                 results.edgeFunction === 'success' && 
                 results.signupTest === 'success' ? (
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">
                      ✅ Todos los tests pasaron. El sistema está funcionando correctamente.
                    </span>
                  </div>
                ) : (
                  <div className="text-yellow-800">
                    <p className="font-semibold mb-2">⚠️ Se encontraron problemas:</p>
                    <ul className="text-xs space-y-1 ml-4 list-disc">
                      {results.apiConnection === 'error' && (
                        <li>La conexión API a Supabase está fallando</li>
                      )}
                      {results.edgeFunction === 'error' && (
                        <li>La Edge Function no está respondiendo correctamente</li>
                      )}
                      {results.signupTest === 'error' && (
                        <li>El registro de usuarios está fallando</li>
                      )}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Instrucciones */}
        {Object.keys(results).length === 0 && (
          <Alert className="bg-blue-50 border-blue-300">
            <AlertDescription className="text-blue-800 text-sm">
              <p className="font-semibold mb-2">📋 ¿Cómo usar este diagnóstico?</p>
              <ol className="list-decimal ml-4 space-y-1 text-xs">
                <li>Haz clic en "Ejecutar Tests"</li>
                <li>Espera a que termine (10-15 segundos)</li>
                <li>Si algún test falla, verás el error específico</li>
                <li>Copia el mensaje de error y repórtalo</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}