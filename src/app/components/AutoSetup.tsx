import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Loader2, Database, CheckCircle, XCircle, AlertTriangle, Wrench } from 'lucide-react';
import { toast } from 'sonner';

export function AutoSetup() {
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<{
    tableExists?: boolean;
    serverConfigured?: boolean;
    canAutoFix?: boolean;
    error?: string;
  }>({});

  const checkAndFix = async () => {
    setChecking(true);
    setStatus({});
    
    try {
      // 1. Verificar si el servidor responde
      const healthResponse = await fetch('https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health');
      
      if (!healthResponse.ok) {
        setStatus({
          serverConfigured: false,
          error: 'El servidor no está desplegado o configurado correctamente',
        });
        toast.error('Servidor no disponible');
        setChecking(false);
        return;
      }

      const healthData = await healthResponse.json();
      console.log('Health check:', healthData);

      setStatus(prev => ({ ...prev, serverConfigured: true }));

      // 2. Verificar si la tabla existe intentando hacer un signup de prueba
      const testEmail = `test-${Date.now()}@setup.com`;
      const signupResponse = await fetch('https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/auth/signup', {
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

      const signupData = await signupResponse.text();
      console.log('Signup test response:', signupData);

      if (signupResponse.status === 401) {
        // 401 significa que la tabla probablemente no existe
        setStatus(prev => ({ 
          ...prev, 
          tableExists: false,
          canAutoFix: true,
          error: 'La tabla kv_store_4909a0bc no existe. Necesitas crearla manualmente.',
        }));
        toast.error('Tabla KV Store no encontrada');
      } else if (signupResponse.ok) {
        setStatus(prev => ({ 
          ...prev, 
          tableExists: true,
          canAutoFix: false,
        }));
        toast.success('✅ Sistema configurado correctamente');
      } else {
        // Otro error
        setStatus(prev => ({ 
          ...prev, 
          tableExists: false,
          error: `Error inesperado: ${signupData}`,
        }));
        toast.error('Error verificando configuración');
      }

    } catch (error) {
      console.error('Error en verificación:', error);
      setStatus({
        serverConfigured: false,
        error: error instanceof Error ? error.message : String(error),
      });
      toast.error('Error verificando configuración');
    } finally {
      setChecking(false);
    }
  };

  const openSQLEditor = () => {
    window.open('https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/sql/new', '_blank');
  };

  return (
    <Card className="border-2 border-yellow-500">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wrench className="w-6 h-6 text-yellow-500" />
          <CardTitle>Configuración Automática</CardTitle>
        </div>
        <CardDescription>
          Verifica y corrige problemas de configuración
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={checkAndFix}
          disabled={checking}
          className="w-full"
          variant="outline"
        >
          {checking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Verificar Configuración
            </>
          )}
        </Button>

        {status.serverConfigured !== undefined && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                {status.serverConfigured ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium">Servidor Edge Function</span>
              </div>
              <Badge className={status.serverConfigured ? 'bg-green-600' : 'bg-red-600'}>
                {status.serverConfigured ? 'OK' : 'Error'}
              </Badge>
            </div>

            {status.tableExists !== undefined && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  {status.tableExists ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-medium">Tabla KV Store</span>
                </div>
                <Badge className={status.tableExists ? 'bg-green-600' : 'bg-red-600'}>
                  {status.tableExists ? 'Existe' : 'No existe'}
                </Badge>
              </div>
            )}

            {status.error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Error:</strong> {status.error}
                </AlertDescription>
              </Alert>
            )}

            {status.canAutoFix && (
              <Alert className="border-yellow-500 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription>
                  <div className="space-y-3">
                    <p className="font-semibold text-yellow-900">
                      🔧 Solución: Crear la tabla manualmente
                    </p>
                    <p className="text-sm text-yellow-800">
                      Necesitas ejecutar un script SQL en Supabase para crear la tabla.
                    </p>
                    <Button
                      onClick={openSQLEditor}
                      className="w-full bg-yellow-500 hover:bg-yellow-600"
                    >
                      Abrir SQL Editor de Supabase
                    </Button>
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
                      <pre>{`-- Copia y pega este SQL en el editor:

CREATE TABLE IF NOT EXISTS kv_store_4909a0bc (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kv_store_key_prefix 
ON kv_store_4909a0bc (key text_pattern_ops);

ALTER TABLE kv_store_4909a0bc ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON kv_store_4909a0bc
FOR ALL USING (true) WITH CHECK (true);`}</pre>
                    </div>
                    <p className="text-xs text-yellow-700">
                      ℹ️ Después de ejecutar el SQL, vuelve aquí y click en "Verificar Configuración" nuevamente.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {status.tableExists && (
              <Alert className="border-green-500 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-900">
                  <strong>✅ Todo configurado correctamente!</strong>
                  <br />
                  Tu aplicación está lista para usar Supabase.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
