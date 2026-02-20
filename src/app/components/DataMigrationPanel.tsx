/**
 * Panel de Migración de Datos
 * 
 * NOTA: La migración ya no es necesaria porque los datos se guardan
 * directamente en Supabase sin usar localStorage como caché.
 */

import { CheckCircle, Database, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

interface DataMigrationPanelProps {}

export function DataMigrationPanel({}: DataMigrationPanelProps) {
  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-green-600" />
            <CardTitle>Migración de Datos</CardTitle>
          </div>
          <CardDescription>
            Estado del almacenamiento de datos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 ml-2">
              <strong>✅ Sistema actualizado</strong>
              <br />
              Todos los datos se guardan automáticamente en Supabase (base de datos en la nube).
              No se usa localStorage para almacenar información de la aplicación.
            </AlertDescription>
          </Alert>

          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 ml-2">
              <strong>ℹ️ Información</strong>
              <br />
              El navegador solo guarda la sesión de usuario (autenticación).
              Todos los nadadores, entrenamientos, competencias, asistencia y marcas 
              están seguros en la nube de Supabase.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Almacenamiento Actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✅ Nadadores → Supabase</li>
                  <li>✅ Entrenamientos → Supabase</li>
                  <li>✅ Competencias → Supabase</li>
                  <li>✅ Asistencia → Supabase</li>
                  <li>✅ Marcas → Supabase</li>
                  <li>✅ Test Control → Supabase</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  Ventajas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>📱 Acceso desde cualquier dispositivo</li>
                  <li>🔄 Sincronización automática</li>
                  <li>💾 Respaldo en la nube</li>
                  <li>🚀 Sin datos desactualizados</li>
                  <li>👥 Colaboración en tiempo real</li>
                  <li>🔒 Seguridad profesional</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-xs text-gray-500 text-center pt-4 border-t">
            <p>
              <strong>Nota técnica:</strong> La migración de localStorage a Supabase ya fue completada.
              Este panel ahora solo muestra información del estado actual del sistema.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
