import { Alert, AlertDescription } from './ui/alert';
import { Info, Database, Cloud } from 'lucide-react';

export function LocalModeNotice() {
  return (
    <Alert className="bg-blue-50 border-blue-300">
      <Info className="h-5 w-5 text-blue-600" />
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-semibold text-blue-900 flex items-center gap-2">
            <Database className="h-4 w-4" />
            Modo Local Activado
          </p>
          <p className="text-sm text-blue-800">
            Tu aplicación está funcionando correctamente usando <strong>almacenamiento local</strong> (localStorage).
            Todos tus datos se guardan en tu navegador.
          </p>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-700 font-semibold mb-1">
              <Cloud className="h-3 w-3 inline mr-1" />
              ¿Quieres usar Supabase (nube)?
            </p>
            <p className="text-xs text-blue-600">
              Baja hasta la tarjeta <strong>"⚠️ ACCIÓN REQUERIDA"</strong> más abajo y sigue los 3 pasos para configurar el servidor.
              Es opcional - la app funciona perfectamente sin él.
            </p>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
