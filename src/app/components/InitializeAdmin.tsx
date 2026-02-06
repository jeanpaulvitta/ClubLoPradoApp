import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Shield, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export function InitializeAdmin() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState<{ email: string; password: string } | null>(null);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const handleInitialize = async () => {
    setError('');
    setDebugInfo(null);
    setLoading(true);

    try {
      const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc/auth/init-admin`;
      
      console.log('🚀 Iniciando creación de admin...');
      console.log('🔗 URL:', apiUrl);
      console.log('🔑 Project ID:', projectId);
      
      // Llamar a la ruta de inicialización del backend
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      console.log('📡 Response status:', response.status);
      
      let data;
      try {
        data = await response.json();
        console.log('📦 Response data:', data);
        setDebugInfo({ status: response.status, data });
      } catch (parseError) {
        console.error('❌ Error parsing response:', parseError);
        throw new Error('Error al procesar la respuesta del servidor. Verifica que el backend esté funcionando.');
      }

      if (!response.ok) {
        console.error('❌ Error response:', data);
        
        // Mensaje de error específico según el tipo de problema
        if (response.status === 404) {
          throw new Error('Backend no encontrado. Verifica que el servidor de Supabase esté desplegado y funcionando.');
        } else if (response.status === 500) {
          throw new Error(`Error del servidor: ${data.error || 'Error interno'}. Verifica las variables de entorno SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.`);
        } else if (data.error) {
          throw new Error(data.error);
        } else {
          throw new Error('Error al crear administrador. Revisa la consola para más detalles.');
        }
      }

      // Verificar si el admin ya existía
      if (data.message && data.message.includes('already exists')) {
        console.log('ℹ️ Admin recreado con nueva contraseña');
        toast.success('Usuario administrador recreado con contraseña: admin123');
        setAdminCredentials({
          email: 'admin@loprado.cl',
          password: 'admin123',
        });
        setSuccess(true);
        return;
      }

      // Admin creado exitosamente
      setAdminCredentials({
        email: data.email,
        password: data.password,
      });
      setSuccess(true);
      toast.success('¡Administrador creado exitosamente!');
      
      console.log('✅ Administrador inicializado:', data.user?.id);
    } catch (err) {
      console.error('❌ Error creando admin:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al crear administrador';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Mostrar información adicional de debug en caso de error
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Error de conexión. Verifica que:\n1. Tengas conexión a internet\n2. El backend de Supabase esté desplegado\n3. La URL del proyecto sea correcta');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success && adminCredentials) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  ¡Administrador Creado!
                </h2>
                <p className="text-gray-300 mb-4">
                  El usuario administrador ha sido creado exitosamente.
                </p>
                <div className="bg-gray-800 rounded-lg p-4 text-left">
                  <p className="text-sm text-gray-400 mb-2">Credenciales:</p>
                  <p className="text-white font-mono text-sm">Email: {adminCredentials.email}</p>
                  <p className="text-white font-mono text-sm mt-1">Password: {adminCredentials.password}</p>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mt-4">
                  <p className="text-xs text-yellow-200">
                    ⚠️ Guarda estas credenciales en un lugar seguro. No se mostrarán nuevamente.
                  </p>
                </div>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-red-500 hover:bg-red-600"
                >
                  Ir a Login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-red-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Shield className="w-5 h-5" />
            Inicializar Administrador
          </CardTitle>
          <CardDescription>
            Crea el usuario administrador del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-100">
                <p className="font-semibold mb-2">Se creará el usuario administrador con:</p>
                <ul className="space-y-1 text-xs">
                  <li>📧 Email: <span className="font-mono text-white">admin@loprado.cl</span></li>
                  <li>🔑 Password: <span className="font-mono text-white">admin123</span></li>
                  <li>👤 Nombre: <span className="text-white">Administrador</span></li>
                  <li>🛡️ Rol: <span className="text-white">Administrador (acceso total)</span></li>
                </ul>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm mb-4 whitespace-pre-line">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Error al crear administrador:</p>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          {debugInfo && error && (
            <details className="mb-4 bg-gray-800 rounded-lg p-3 text-xs">
              <summary className="text-gray-400 cursor-pointer font-semibold mb-2">
                🔍 Ver información técnica
              </summary>
              <pre className="text-gray-300 overflow-x-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          )}

          <Button
            onClick={handleInitialize}
            className="w-full bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creando Administrador...
              </>
            ) : (
              'Crear Administrador'
            )}
          </Button>

          <p className="text-xs text-gray-400 text-center mt-4">
            Este botón solo funciona si no existe ya un usuario administrador
          </p>

          {/* Información adicional de troubleshooting */}
          <div className="mt-4 bg-gray-800/50 border border-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-2">
              <strong className="text-gray-300">💡 Si hay errores:</strong>
            </p>
            <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
              <li>Verifica que estés conectado a internet</li>
              <li>Asegúrate de que el backend de Supabase esté desplegado</li>
              <li>Revisa la consola del navegador (F12) para más detalles</li>
              <li>Verifica las variables de entorno SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}