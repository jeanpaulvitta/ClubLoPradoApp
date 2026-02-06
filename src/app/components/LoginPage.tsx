import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Waves, Lock, Mail, User, Shield, AlertCircle } from 'lucide-react';
import logo from "figma:asset/ef5b202caab93507d38c5dc837f143cfa0a3e82a.png";
import { createPasswordRequest } from './PasswordRequestsManager';
import { toast } from 'sonner';
import { InitializeAdmin } from './InitializeAdmin';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [requestName, setRequestName] = useState('');
  const [requestEmail, setRequestEmail] = useState('');
  const [requestRole, setRequestRole] = useState<'swimmer' | 'coach'>('swimmer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showInitializeAdmin, setShowInitializeAdmin] = useState(false);

  // Si se muestra el InitializeAdmin, renderizar solo ese componente
  if (showInitializeAdmin) {
    return <InitializeAdmin />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      await login(email, password);
      toast.success('¡Bienvenido!');
    } catch (err: any) {
      const errorMessage = err.message || 'Error al iniciar sesión';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Si el error es que el admin no existe, redirigir automáticamente después de 2 segundos
      if (errorMessage.includes('Usuario administrador no encontrado')) {
        toast.info('Redirigiendo a crear administrador...', { duration: 2000 });
        setTimeout(() => {
          setShowInitializeAdmin(true);
        }, 2000);
      }
    }
  };

  const handlePasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      createPasswordRequest(requestName, requestEmail, requestRole);
      toast.success('Solicitud enviada exitosamente');
      setSuccessMessage('Tu solicitud ha sido enviada. El administrador la revisará pronto.');
      // Limpiar formulario
      setRequestName('');
      setRequestEmail('');
      setRequestRole('swimmer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar solicitud');
      toast.error(err instanceof Error ? err.message : 'Error al enviar solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-4 shadow-2xl ring-4 ring-red-500/30">
              <img
                src={logo}
                alt="Club Natación Lo Prado"
                className="w-20 h-20 object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Club Natación Lo Prado
          </h1>
          <p className="text-gray-300 text-lg font-semibold">
            Haz que todo sea posible
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Waves className="w-5 h-5 text-red-400" />
            <span className="text-gray-400">Temporada 2026</span>
          </div>
        </div>

        {/* Banner de primer uso - MUY DESTACADO */}
        <div className="mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 p-1 rounded-xl shadow-2xl animate-pulse">
          <div className="bg-gray-900 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-full p-2 flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-2">
                  🎉 ¡Bienvenido! Primera vez usando el sistema
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  Si eres el <strong>primer usuario</strong>, necesitas crear el usuario administrador antes de poder iniciar sesión.
                </p>
                <Button
                  type="button"
                  onClick={() => setShowInitializeAdmin(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold shadow-lg"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Crear Usuario Administrador Ahora
                </Button>
                <p className="text-gray-400 text-xs mt-2 text-center">
                  Credenciales: <code className="text-purple-400">admin@loprado.cl</code>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Login/Signup Card */}
        <Card className="shadow-2xl border-red-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Lock className="w-5 h-5" />
              Acceso al Sistema
            </CardTitle>
            <CardDescription>
              Inicia sesión o solicita acceso si eres nuevo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="signup">Solicitar Acceso</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="tu@correo.cl"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                      {successMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                    disabled={loading}
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Primera vez</span>
                    </div>
                  </div>

                  {/* Botón de inicialización del admin */}
                  <Button
                    type="button"
                    onClick={() => setShowInitializeAdmin(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Crear Usuario Administrador
                  </Button>

                  {/* Nota informativa */}
                  <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                    <p className="text-xs text-gray-600 text-center">
                      💡 <strong>Administrador:</strong> admin@loprado.cl / admin123
                    </p>
                  </div>
                  
                  {/* Instrucciones para primer uso - ahora simplificado */}
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-blue-800">
                        <strong className="block mb-1">🔧 Primera vez usando el sistema:</strong>
                        <p className="mt-2">
                          Usa el botón <strong>"Crear Usuario Administrador"</strong> arriba para crear automáticamente el usuario admin con credenciales predefinidas. Una vez creado, podrás iniciar sesión inmediatamente.
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </TabsContent>

              {/* Request Access Tab */}
              <TabsContent value="signup">
                <form onSubmit={handlePasswordRequest} className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-red-800">
                        <strong>Solicitud de Acceso:</strong> Completa este formulario para solicitar acceso al sistema. 
                        El administrador revisará tu solicitud y te enviará tus credenciales de acceso.
                      </div>
                    </div>
                  </div>

                  {/* Botón de inicialización del admin también en signup tab */}
                  <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 mb-4">
                    <div className="flex flex-col items-center gap-3">
                      <Shield className="w-8 h-8 text-purple-600" />
                      <div className="text-center">
                        <p className="text-sm font-semibold text-purple-900 mb-1">
                          ¿Eres el primer usuario?
                        </p>
                        <p className="text-xs text-purple-800 mb-3">
                          Crea el usuario administrador primero
                        </p>
                        <Button
                          type="button"
                          onClick={() => setShowInitializeAdmin(true)}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Crear Usuario Administrador
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="request-name">Nombre Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="request-name"
                        type="text"
                        placeholder="Juan Pérez"
                        value={requestName}
                        onChange={(e) => setRequestName(e.target.value)}
                        className="pl-10 focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="request-email">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="request-email"
                        type="email"
                        placeholder="tu@correo.cl"
                        value={requestEmail}
                        onChange={(e) => setRequestEmail(e.target.value)}
                        className="pl-10 focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="request-role">Rol Solicitado</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <select
                        id="request-role"
                        value={requestRole}
                        onChange={(e) => setRequestRole(e.target.value as 'swimmer' | 'coach')}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="swimmer">Nadador</option>
                        <option value="coach">Entrenador</option>
                      </select>
                    </div>
                  </div>

                  {/* Nota informativa */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Lock className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-yellow-800">
                        <strong>Proceso de aprobación:</strong> Una vez enviada tu solicitud, el administrador 
                        la revisará y te enviará tus credenciales de acceso por correo electrónico.
                        {requestRole === 'swimmer' && (
                          <p className="mt-2">
                            ℹ️ También se creará automáticamente tu ficha de nadador con tus datos básicos.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                      {successMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                    disabled={loading}
                  >
                    {loading ? 'Enviando solicitud...' : 'Solicitar Acceso'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>© 2026 Club Natación Lo Prado</p>
          <p className="mt-1 text-gray-500">Haz que todo sea posible</p>
        </div>
      </div>
    </div>
  );
}