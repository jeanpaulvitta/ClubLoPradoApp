import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginPage } from './LoginPage';
import { Card, CardContent } from './ui/card';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'swimmer' | 'coach';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center">
        <Card className="bg-gray-800 border-red-500/20">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            <p className="text-gray-300">Cargando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center p-4">
        <Card className="max-w-md bg-gray-800 border-red-500/20">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold text-red-500 mb-2">Acceso Denegado</h2>
            <p className="text-gray-300">
              No tienes permisos para acceder a esta sección.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}