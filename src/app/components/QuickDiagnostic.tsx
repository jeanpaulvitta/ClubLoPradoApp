import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { AlertTriangle, RefreshCw, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

export function QuickDiagnostic() {
  const [logs, setLogs] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const runQuickTest = async () => {
    setTesting(true);
    setSuccess(null);
    const newLogs: string[] = [];

    try {
      // Test 1: Health check
      newLogs.push('🔍 Probando conexión al servidor...');
      const healthUrl = 'https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health';
      newLogs.push(`URL: ${healthUrl}`);
      
      const healthResponse = await fetch(healthUrl);
      newLogs.push(`Status: ${healthResponse.status}`);
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        newLogs.push(`✅ Servidor responde: ${JSON.stringify(healthData)}`);
        newLogs.push(`✅ Versión: ${healthData.version}`);
      } else {
        const errorText = await healthResponse.text();
        newLogs.push(`❌ Error del servidor: ${errorText}`);
        setSuccess(false);
        setLogs(newLogs);
        setTesting(false);
        return;
      }

      // Test 2: Workouts SIN autenticación (PÚBLICO)
      newLogs.push('');
      newLogs.push('🔍 Probando GET /workouts (SIN token, debería funcionar)...');
      
      const workoutsUrl = 'https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/workouts';
      newLogs.push(`URL: ${workoutsUrl}`);
      newLogs.push(`📝 Nota: NO estamos enviando token de autenticación`);
      
      const workoutsResponse = await fetch(workoutsUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      newLogs.push(`Status: ${workoutsResponse.status}`);
      
      const responseText = await workoutsResponse.text();
      newLogs.push(`Response length: ${responseText.length} chars`);
      
      if (workoutsResponse.ok) {
        try {
          const data = JSON.parse(responseText);
          const workouts = Array.isArray(data) ? data : (data.workouts || []);
          newLogs.push(`✅ ¡ÉXITO! Workouts recibidos: ${workouts.length}`);
          newLogs.push(`✅ El endpoint ahora es PÚBLICO (no requiere login)`);
          setSuccess(true);
        } catch (e) {
          newLogs.push(`❌ Error parseando JSON: ${e}`);
          newLogs.push(`Response: ${responseText.substring(0, 200)}`);
          setSuccess(false);
        }
      } else {
        newLogs.push(`❌ ERROR HTTP: ${workoutsResponse.status}`);
        newLogs.push(`❌ Response: ${responseText}`);
        newLogs.push('');
        newLogs.push('🔧 SOLUCIÓN:');
        newLogs.push('   El servidor todavía requiere autenticación.');
        newLogs.push('   Necesitas REDESPLEGAR el servidor con el código actualizado.');
        newLogs.push('   Ver instrucciones en: /DESPLEGAR_SERVIDOR.md');
        setSuccess(false);
      }

    } catch (error) {
      newLogs.push(`❌ Exception: ${error}`);
      if (error instanceof Error) {
        newLogs.push(`❌ Stack: ${error.stack}`);
      }
      setSuccess(false);
    } finally {
      setLogs(newLogs);
      setTesting(false);
    }
  };

  const openDashboard = () => {
    window.open('https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions/make-server-4909a0bc/details', '_blank');
  };

  return (
    <Alert className={`border-2 ${success === true ? 'border-green-500 bg-green-50' : success === false ? 'border-red-500 bg-red-50' : 'border-blue-500'}`}>
      <AlertTriangle className={`h-4 w-4 ${success === true ? 'text-green-600' : success === false ? 'text-red-600' : 'text-blue-600'}`} />
      <AlertDescription>
        <div className="space-y-3">
          <div>
            <p className="font-semibold">Diagnóstico Rápido - Estado del Servidor</p>
            <p className="text-xs text-gray-600 mt-1">
              Verifica que el servidor esté actualizado y funcione correctamente
            </p>
          </div>
          
          <Button
            onClick={runQuickTest}
            disabled={testing}
            size="sm"
            className="w-full"
            variant={success === true ? "default" : "outline"}
          >
            {testing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Ejecutando...
              </>
            ) : success === true ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                ✅ Test Exitoso - Volver a Verificar
              </>
            ) : success === false ? (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                ❌ Test Falló - Reintentar
              </>
            ) : (
              'Ejecutar Test Rápido'
            )}
          </Button>

          {logs.length > 0 && (
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto max-h-96 overflow-y-auto">
              {logs.map((log, idx) => (
                <div 
                  key={idx}
                  className={
                    log.includes('✅') ? 'text-green-400 font-semibold' :
                    log.includes('❌') ? 'text-red-400 font-semibold' :
                    log.includes('🔧') ? 'text-yellow-400 font-semibold' :
                    'text-gray-300'
                  }
                >
                  {log}
                </div>
              ))}
            </div>
          )}

          {success === false && (
            <div className="space-y-2">
              <Alert variant="destructive" className="bg-red-100 border-red-300">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold text-red-900">El servidor necesita ser desplegado</p>
                  <p className="text-sm text-red-800 mt-1">
                    El código actualizado está listo, pero necesitas desplegarlo en Supabase.
                  </p>
                </AlertDescription>
              </Alert>
              
              <Button
                onClick={openDashboard}
                size="sm"
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Abrir Dashboard de Supabase para Desplegar
              </Button>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-sm font-semibold text-yellow-900 mb-2">
                  📝 Pasos Rápidos:
                </p>
                <ol className="text-xs text-yellow-800 space-y-1 ml-4 list-decimal">
                  <li>Click en el botón de arriba para abrir Supabase</li>
                  <li>Ve a la pestaña "Editor" o "Code"</li>
                  <li>Copia el archivo <code>/supabase/functions/make-server-4909a0bc/index.tsx</code></li>
                  <li>Reemplaza todo el código en el editor</li>
                  <li>Click en "Deploy"</li>
                  <li>Espera 30-60 segundos</li>
                  <li>Vuelve aquí y click "Reintentar"</li>
                </ol>
              </div>
            </div>
          )}

          {success === true && (
            <Alert className="bg-green-100 border-green-300">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <p className="font-semibold text-green-900">
                  ✅ ¡Servidor funcionando correctamente!
                </p>
                <p className="text-sm text-green-800 mt-1">
                  El endpoint /workouts es público y está respondiendo sin errores.
                  Tu aplicación debería funcionar correctamente ahora.
                </p>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}