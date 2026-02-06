import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Bug, RefreshCw, Database, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { clearLegacyData } from '../services/auth';

export function DebugPanel() {
  const [showInfo, setShowInfo] = useState(false);

  const handleClearLegacyData = () => {
    if (confirm('⚠️ ¿Estás seguro de que quieres limpiar datos antiguos de localStorage?\n\nEsto eliminará:\n- Sesiones antiguas\n- Usuarios demo antiguos\n\nLos usuarios de Supabase Auth NO se verán afectados.')) {
      clearLegacyData();
      toast.success('✅ Datos antiguos limpiados correctamente');
    }
  };

  const handleShowSupabaseInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-orange-600" />
          Panel de Diagnóstico
        </CardTitle>
        <CardDescription>
          Herramientas de debugging para inspeccionar el estado del sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <strong>Sistema migrado a Supabase Auth</strong>
              <p className="mt-1 text-blue-700">
                El sistema ahora usa Supabase para autenticación. Los usuarios se gestionan desde el Dashboard de Supabase.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleShowSupabaseInfo}
            variant="outline"
            className="flex-1"
          >
            {showInfo ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showInfo ? 'Ocultar' : 'Ver'} Información del Sistema
          </Button>
        </div>

        {showInfo && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Estado del Sistema</h3>
                <Badge variant="default">Supabase Auth</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Autenticación:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Supabase Auth
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Backend:</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Edge Functions
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Base de datos:</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    PostgreSQL
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Sesión:</span>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    JWT Tokens
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Gestión de Usuarios</h3>
                <Badge variant="outline">Supabase Dashboard</Badge>
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  Para gestionar usuarios (crear, editar, eliminar), accede al Dashboard de Supabase:
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Ingresa a <code className="bg-gray-100 px-1 rounded">supabase.com</code></li>
                  <li>Selecciona tu proyecto</li>
                  <li>Ve a <strong>Authentication &gt; Users</strong></li>
                  <li>Gestiona usuarios desde ahí</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <Button
            onClick={handleClearLegacyData}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <Database className="w-4 h-4 mr-2" />
            Limpiar Datos Antiguos (localStorage)
          </Button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            ⚠️ Esto solo limpia datos antiguos de localStorage. No afecta usuarios de Supabase.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}