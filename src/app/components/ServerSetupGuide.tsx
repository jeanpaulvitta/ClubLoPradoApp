import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, Circle, ExternalLink, Copy, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface ServerSetupGuideProps {
  projectId: string;
  onRecheck: () => void;
}

export function ServerSetupGuide({ projectId, onRecheck }: ServerSetupGuideProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const dashboardUrl = `https://supabase.com/dashboard/project/${projectId}`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`✅ ${label} copiada al portapapeles`);
  };

  return (
    <Card className="border-red-300 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          🚨 Configuración Requerida: Edge Function
        </CardTitle>
        <CardDescription className="text-red-800">
          El servidor necesita configuración antes de poder aprobar solicitudes. Sigue estos pasos:
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Paso 1 */}
        <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Accede a Supabase Dashboard</h3>
              <p className="text-sm text-gray-700 mb-3">
                Abre el panel de administración de Supabase:
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => window.open(dashboardUrl, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir Dashboard
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    copyToClipboard(dashboardUrl, 'URL');
                    setCopiedUrl(true);
                    setTimeout(() => setCopiedUrl(false), 2000);
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copiedUrl ? '✅ Copiado' : 'Copiar URL'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Paso 2 */}
        <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Obtén las Claves API</h3>
              <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                <li>En el dashboard, haz clic en el <strong>engranaje ⚙️</strong> (abajo izquierda)</li>
                <li>Selecciona <strong>Project Settings</strong></li>
                <li>Haz clic en <strong>API</strong> en el menú izquierdo</li>
                <li>Copia estas dos claves (las necesitarás en el siguiente paso):</li>
              </ol>
              <div className="mt-3 space-y-2">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-sm">
                    <strong>anon / public key:</strong> Copia usando el ícono de copiar
                  </AlertDescription>
                </Alert>
                <Alert className="bg-yellow-50 border-yellow-300">
                  <AlertDescription className="text-sm">
                    <strong>service_role key:</strong> Haz clic en "Reveal", luego copia
                    <br />
                    <span className="text-yellow-800">⚠️ Esta es SECRETA - no la compartas</span>
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </div>

        {/* Paso 3 */}
        <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Configura las Variables de Entorno</h3>
              <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                <li>En el menú izquierdo, haz clic en <strong>Edge Functions</strong></li>
                <li>Busca y haz clic en <strong>make-server-4909a0bc</strong></li>
                <li>Ve a la pestaña <strong>Secrets</strong> o <strong>Environment Variables</strong></li>
                <li>Agrega estas 3 variables:</li>
              </ol>
              
              <div className="mt-3 space-y-3">
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <code className="text-sm font-mono text-blue-600">SUPABASE_URL</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(`https://${projectId}.supabase.co`, 'SUPABASE_URL')}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <code className="text-xs text-gray-600 break-all">
                    https://{projectId}.supabase.co
                  </code>
                </div>

                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <code className="text-sm font-mono text-blue-600">SUPABASE_ANON_KEY</code>
                  <p className="text-xs text-gray-600 mt-1">
                    👉 Pega aquí la <strong>anon/public key</strong> que copiaste en el Paso 2
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <code className="text-sm font-mono text-blue-600">SUPABASE_SERVICE_ROLE_KEY</code>
                  <p className="text-xs text-gray-600 mt-1">
                    👉 Pega aquí la <strong>service_role key</strong> que copiaste en el Paso 2
                  </p>
                </div>
              </div>

              <Alert className="mt-3 bg-yellow-50 border-yellow-300">
                <AlertDescription className="text-xs">
                  ✅ <strong>Verifica</strong>: Los nombres deben estar EXACTAMENTE como se muestran (respetando mayúsculas)
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>

        {/* Paso 4 */}
        <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Reinicia la Edge Function</h3>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Busca el botón <strong>"Redeploy"</strong> o <strong>"Restart"</strong></li>
                <li>Haz clic y confirma</li>
                <li><strong>Espera 30-60 segundos</strong> a que se reinicie</li>
                <li>Verifica que diga "Active" o "Running"</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Paso 5 */}
        <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
              5
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Verifica que Funciona</h3>
              <p className="text-sm text-gray-700 mb-3">
                Una vez completados los pasos anteriores:
              </p>
              <Button
                onClick={onRecheck}
                className="bg-red-600 hover:bg-red-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Verificar Configuración
              </Button>
              <p className="text-xs text-gray-600 mt-2">
                Si está configurado correctamente, este banner desaparecerá y podrás aprobar solicitudes.
              </p>
            </div>
          </div>
        </div>

        {/* Enlace a documentación completa */}
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-900">
                📄 ¿Necesitas ayuda? Ver instrucciones detalladas
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open('/SOLUCION_INVALID_JWT.md', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir Guía
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
