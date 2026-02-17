import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Copy, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export function DeployHelper() {
  const [copied, setCopied] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);
  const [showSqlText, setShowSqlText] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (step: number) => {
    setCompletedSteps(prev => 
      prev.includes(step) 
        ? prev.filter(s => s !== step)
        : [...prev, step]
    );
  };

  const isStepCompleted = (step: number) => completedSteps.includes(step);

  // Función de copia que siempre funciona (fallback para cuando Clipboard API está bloqueado)
  const copyToClipboard = (text: string) => {
    // NO usar navigator.clipboard porque está bloqueado en iframes
    // Usar directamente el método tradicional que SIEMPRE funciona
    
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    } catch (err) {
      document.body.removeChild(textarea);
      return false;
    }
  };

  const copyDeployCommand = () => {
    const success = copyToClipboard('supabase functions deploy make-server-4909a0bc');
    if (success) {
      setCopied(true);
      toast.success('Comando copiado al portapapeles');
      setTimeout(() => setCopied(false), 3000);
    } else {
      toast.error('No se pudo copiar. Por favor, copia manualmente.');
    }
  };

  const copySQL = () => {
    const sql = `-- Eliminar política existente (por si ya existe)
DROP POLICY IF EXISTS "Allow all operations" ON kv_store_4909a0bc;

-- Crear tabla si no existe
CREATE TABLE IF NOT EXISTS kv_store_4909a0bc (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índice si no existe
CREATE INDEX IF NOT EXISTS idx_kv_store_key_prefix 
ON kv_store_4909a0bc (key text_pattern_ops);

-- Habilitar RLS
ALTER TABLE kv_store_4909a0bc ENABLE ROW LEVEL SECURITY;

-- Crear política nueva
CREATE POLICY "Allow all operations" ON kv_store_4909a0bc
FOR ALL USING (true) WITH CHECK (true);`;
    
    const success = copyToClipboard(sql);
    if (success) {
      setSqlCopied(true);
      toast.success('SQL copiado al portapapeles');
      setTimeout(() => setSqlCopied(false), 3000);
    } else {
      // Si falla la copia, mostrar el textarea
      setShowSqlText(true);
      toast.error('Copia manual necesaria - mostrando SQL abajo');
    }
  };

  const getSQLText = () => {
    return `-- Eliminar política existente (por si ya existe)
DROP POLICY IF EXISTS "Allow all operations" ON kv_store_4909a0bc;

-- Crear tabla si no existe
CREATE TABLE IF NOT EXISTS kv_store_4909a0bc (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índice si no existe
CREATE INDEX IF NOT EXISTS idx_kv_store_key_prefix 
ON kv_store_4909a0bc (key text_pattern_ops);

-- Habilitar RLS
ALTER TABLE kv_store_4909a0bc ENABLE ROW LEVEL SECURITY;

-- Crear política nueva
CREATE POLICY "Allow all operations" ON kv_store_4909a0bc
FOR ALL USING (true) WITH CHECK (true);`;
  };

  const openSupabaseDashboard = () => {
    window.open('https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions', '_blank');
  };

  const openSQLEditor = () => {
    window.open('https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/sql/new', '_blank');
  };

  return (
    <Card className="border-2 border-orange-500">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500" />
          <CardTitle>⚠️ ACCIÓN REQUERIDA</CardTitle>
        </div>
        <CardDescription>
          El servidor necesita ser desplegado manualmente en Supabase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive" className="bg-red-50 border-red-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold text-red-900">
              El error "Invalid JWT" persiste porque el servidor no está actualizado
            </p>
            <p className="text-sm text-red-800 mt-1">
              El código correcto está listo en tu proyecto, pero Supabase está ejecutando la versión antigua.
            </p>
          </AlertDescription>
        </Alert>

        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
          <p className="font-bold text-yellow-900 mb-1 text-lg">
            🚀 MIGRACIÓN A SUPABASE
          </p>
          <p className="text-sm text-gray-700 mb-4">
            Actualmente funcionas en <strong>modo local</strong> (datos en navegador). 
            Sigue estos pasos para migrar a <strong>Supabase</strong> (sincronización en la nube):
          </p>
          
          <div className="space-y-3">
            {/* Paso 1 */}
            <div className={`bg-white rounded p-3 border-2 ${isStepCompleted(1) ? 'border-green-500' : 'border-yellow-300'}`}>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isStepCompleted(1)}
                  onChange={() => toggleStep(1)}
                  className="mt-1 w-5 h-5 cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-2">
                    ✅ PASO 1: Crear tabla en base de datos
                  </p>
                  <div className="flex gap-2 mb-2">
                    <Button
                      onClick={copySQL}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {sqlCopied ? '✓ Copiado' : '📋 Copiar SQL'}
                    </Button>
                    <Button
                      onClick={openSQLEditor}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      🔗 Abrir SQL Editor
                    </Button>
                  </div>
                  {!showSqlText && (
                    <Button
                      onClick={() => setShowSqlText(true)}
                      size="sm"
                      variant="outline"
                      className="text-xs mb-2 w-full"
                    >
                      📝 Ver SQL para copiar manualmente
                    </Button>
                  )}
                  <p className="text-xs text-gray-600">
                    Pega el SQL en Supabase y click en <strong>RUN</strong>. 
                    Debe decir "Success. No rows returned"
                  </p>
                </div>
              </div>
            </div>

            {/* Paso 2 */}
            <div className={`bg-white rounded p-3 border-2 ${isStepCompleted(2) ? 'border-green-500' : 'border-yellow-300'}`}>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isStepCompleted(2)}
                  onChange={() => toggleStep(2)}
                  className="mt-1 w-5 h-5 cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-2">
                    ✅ PASO 2: Desplegar servidor Edge Function
                  </p>
                  
                  <div className="bg-gray-50 border border-gray-300 rounded p-2 mb-2">
                    <p className="text-xs font-semibold mb-1">OPCIÓN A: CLI (recomendado)</p>
                    <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-xs mb-1">
                      supabase functions deploy make-server-4909a0bc
                    </div>
                    <Button
                      onClick={copyDeployCommand}
                      size="sm"
                      variant="outline"
                    >
                      {copied ? '✓ Copiado' : '📋 Copiar'}
                    </Button>
                  </div>

                  <details className="text-xs">
                    <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-semibold">
                      OPCIÓN B: Dashboard (sin CLI)
                    </summary>
                    <ol className="mt-2 space-y-1 list-decimal ml-4 text-gray-700">
                      <li>
                        <Button
                          onClick={openSupabaseDashboard}
                          size="sm"
                          variant="link"
                          className="p-0 h-auto text-blue-600"
                        >
                          Abrir Edge Functions →
                        </Button>
                      </li>
                      <li>Click en función <code className="bg-gray-200 px-1">make-server-4909a0bc</code></li>
                      <li>Pestaña "Editor" → Borrar código viejo</li>
                      <li>Copiar contenido de <code className="bg-gray-200 px-1">/supabase/functions/server/index.tsx</code></li>
                      <li>Pegar en editor → Click <strong>"Deploy"</strong></li>
                      <li>Esperar 30-60 segundos</li>
                    </ol>
                  </details>
                </div>
              </div>
            </div>

            {/* Paso 3 */}
            <div className={`bg-white rounded p-3 border-2 ${isStepCompleted(3) ? 'border-green-500' : 'border-yellow-300'}`}>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isStepCompleted(3)}
                  onChange={() => toggleStep(3)}
                  className="mt-1 w-5 h-5 cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-2">
                    ✅ PASO 3: Verificar y recargar
                  </p>
                  <p className="text-sm text-gray-700">
                    Recarga la página (F5). Si todo funcionó, esta tarjeta desaparecerá 
                    y verás los entrenamientos cargados desde Supabase.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progreso */}
          <div className="mt-4 pt-4 border-t border-yellow-400">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold">
                Progreso: {completedSteps.length}/3 pasos
              </span>
              <span className="text-gray-600">
                ⏱️ ~{5 - completedSteps.length * 1.5} min restantes
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedSteps.length / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <Alert className="bg-blue-50 border-blue-300">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <p className="font-semibold text-blue-900">💡 Tip</p>
            <p className="text-sm text-blue-800">
              Después de desplegar, recarga esta página (F5) y el error "Invalid JWT" desaparecerá.
              Verás entrenamientos sin necesidad de estar logueado.
            </p>
          </AlertDescription>
        </Alert>

        <div className="bg-gray-100 border border-gray-300 rounded p-3">
          <p className="text-xs font-semibold text-gray-700 mb-1">
            ⏱️ Tiempo estimado: 5 minutos
          </p>
          <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
            <li>Paso 1 (Crear tabla): 1 minuto</li>
            <li>Paso 2 (Abrir dashboard): 30 segundos</li>
            <li>Paso 3 (Desplegar): 3 minutos</li>
          </ul>
        </div>

        {/* Mostrar SQL si es necesario */}
        {showSqlText && (
          <div className="bg-white border-2 border-green-600 rounded p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-green-900">
                📋 Copia este SQL manualmente (selecciona todo con Ctrl+A, luego Ctrl+C):
              </p>
              <Button
                onClick={() => setShowSqlText(false)}
                size="sm"
                variant="outline"
              >
                Ocultar
              </Button>
            </div>
            <textarea
              readOnly
              value={getSQLText()}
              className="w-full h-48 bg-gray-900 text-green-400 p-3 rounded font-mono text-xs border-2 border-green-500"
              onClick={(e) => e.currentTarget.select()}
            />
            <p className="text-xs text-gray-600 mt-2 italic">
              💡 Click en el texto para seleccionarlo todo, luego Ctrl+C para copiar
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}