import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { getMigrationInfo, checkBackendHealth } from '@/app/services/migration';

export function MigrationBanner() {
  const [show, setShow] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      const info = getMigrationInfo();
      
      // Solo mostrar el banner si hay datos antiguos o queremos verificar la conexión
      if (info.hasLegacyData || sessionStorage.getItem('show_migration_banner') === 'true') {
        setShow(true);
        const isOnline = await checkBackendHealth();
        setBackendOnline(isOnline);
      }
      
      setChecking(false);
    };

    checkHealth();
  }, []);

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem('show_migration_banner', 'false');
  };

  if (!show || checking) {
    return null;
  }

  return (
    <div className={`fixed top-20 left-0 right-0 z-50 mx-auto max-w-4xl px-4`}>
      <div className={`rounded-lg p-4 shadow-lg ${
        backendOnline 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-yellow-50 border border-yellow-200'
      }`}>
        <div className="flex items-start gap-3">
          {backendOnline ? (
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          )}
          
          <div className="flex-1">
            <h3 className={`font-semibold mb-1 ${
              backendOnline ? 'text-green-900' : 'text-yellow-900'
            }`}>
              {backendOnline 
                ? '✅ Sistema Migrado a Supabase' 
                : '⚠️ Verificando Conexión con Supabase'}
            </h3>
            <p className={`text-sm ${
              backendOnline ? 'text-green-700' : 'text-yellow-700'
            }`}>
              {backendOnline ? (
                <>
                  Todos los datos ahora están almacenados de forma segura en el servidor de Supabase.
                  <br />
                  <strong>Beneficios:</strong> Autenticación real con JWT, persistencia de datos, mejor seguridad.
                </>
              ) : (
                <>
                  Verificando la conexión con el servidor backend de Supabase...
                  <br />
                  Si este mensaje persiste, verifica la configuración del servidor.
                </>
              )}
            </p>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded hover:bg-white/50 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
