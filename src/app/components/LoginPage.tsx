import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Waves, Lock, Mail, User, Shield, AlertCircle, Copy, CheckCircle } from 'lucide-react';
import logo from "figma:asset/ef5b202caab93507d38c5dc837f143cfa0a3e82a.png";
import { createPasswordRequest } from './PasswordRequestsManager';
import { toast } from 'sonner';

export function LoginPage() {
  const { login, signup } = useAuth();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [requestName, setRequestName] = useState('');
  const [requestEmail, setRequestEmail] = useState('');
  const [requestRole, setRequestRole] = useState<'swimmer' | 'coach'>('swimmer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(loginEmail, loginPassword);
      setSuccessMessage('Inicio de sesión exitoso');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
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

  // Cuentas de demostración
  const demoAccounts = [
    { email: 'admin@loprado.cl', password: 'admin123', role: 'Administrador', description: 'Acceso completo' },
    { email: 'coach@loprado.cl', password: 'coach123', role: 'Entrenador', description: 'Ver y editar' },
    { email: 'nadador@loprado.cl', password: 'nadador123', role: 'Nadador', description: 'Ver personal' },
  ];

  const handleDemoLogin = async (email: string, password: string) => {
    setLoginEmail(email);
    setLoginPassword(password);
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      setSuccessMessage('Inicio de sesión exitoso');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
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

        <div className="grid md:grid-cols-3 gap-6">
          {/* Login/Signup Card */}
          <div className="md:col-span-2">
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
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Correo Electrónico</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="tu@correo.cl"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
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
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
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
          </div>

          {/* Demo Accounts Card */}
          <div className="md:col-span-1">
            <Card className="shadow-2xl bg-gradient-to-br from-red-50 to-gray-50 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-sm text-red-600">Cuentas de Demostración</CardTitle>
                <CardDescription className="text-xs">
                  Prueba el sistema con estas cuentas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {demoAccounts.map((account) => (
                  <Card
                    key={account.email}
                    className="cursor-pointer hover:shadow-md transition-shadow bg-white hover:border-red-500/30"
                    onClick={() => handleDemoLogin(account.email, account.password)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-red-600 truncate">
                            {account.role}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {account.email}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {account.description}
                          </p>
                        </div>
                        <Shield className="w-4 h-4 text-red-400 flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="mt-4 p-3 bg-red-100 rounded-lg">
                  <p className="text-xs text-red-800">
                    💡 <strong>Tip:</strong> Haz clic en cualquier cuenta para acceder instantáneamente
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>© 2026 Club Natación Lo Prado</p>
          <p className="mt-1 text-gray-500">Haz que todo sea posible</p>
        </div>
      </div>
    </div>
  );
}