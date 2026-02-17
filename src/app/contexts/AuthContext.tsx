import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authApi from '../services/auth';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'swimmer' | 'coach';
  swimmerId?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string, role: 'admin' | 'swimmer' | 'coach', swimmerId?: string) => Promise<{ email: string; password: string }>;
  createUserAccount: (email: string, name: string, role: 'admin' | 'swimmer' | 'coach') => Promise<{ email: string; password: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

// Valor por defecto para evitar errores de contexto undefined
const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  login: async () => { throw new Error('AuthProvider not initialized'); },
  logout: async () => { throw new Error('AuthProvider not initialized'); },
  signup: async () => { throw new Error('AuthProvider not initialized'); },
  createUserAccount: async () => { throw new Error('AuthProvider not initialized'); },
  changePassword: async () => { throw new Error('AuthProvider not initialized'); },
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

AuthContext.displayName = 'AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Cargar sesión desde localStorage INMEDIATAMENTE
    const savedSession = authApi.getSession();
    if (savedSession) {
      console.log('✅ Sesión restaurada desde localStorage:', savedSession.email);
      return {
        id: savedSession.id,
        email: savedSession.email,
        name: savedSession.name,
        role: savedSession.role,
        swimmerId: savedSession.swimmerId,
      };
    }
    return null;
  });
  const [loading, setLoading] = useState(() => {
    // Si hay sesión guardada, NO mostrar loading
    const savedSession = authApi.getSession();
    return !savedSession; // Solo loading si NO hay sesión
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Limpiar datos antiguos de localStorage
    authApi.clearLegacyData();
    
    // Verificar si hay una sesión guardada al cargar
    checkSession();
    
    // Verificar sesión cada 5 minutos para mantenerla activa
    const sessionCheckInterval = setInterval(() => {
      checkSession();
    }, 5 * 60 * 1000); // 5 minutos
    
    // NUEVO: Sincronización constante con localStorage cada 10 segundos
    // Esto previene pérdida de sesión por actualizaciones de estado
    const syncInterval = setInterval(() => {
      const savedSession = authApi.getSession();
      if (savedSession && !user) {
        console.log('🔄 Sincronizando usuario desde localStorage');
        setUser({
          id: savedSession.id,
          email: savedSession.email,
          name: savedSession.name,
          role: savedSession.role,
          swimmerId: savedSession.swimmerId,
        });
      }
    }, 10000); // 10 segundos
    
    return () => {
      setMounted(false);
      clearInterval(sessionCheckInterval);
      clearInterval(syncInterval);
    };
  }, []);

  const checkSession = async () => {
    try {
      const session = await authApi.checkSession();
      if (session) {
        setUser(session);
      } else {
        // Solo cerrar sesión si NO teníamos un usuario antes
        // Si teníamos usuario, mantenerlo (el servidor puede estar caído temporalmente)
        if (!user) {
          console.log('⚠️ No hay sesión guardada');
          setUser(null);
        } else {
          console.log('⚠️ No se pudo verificar sesión con servidor, manteniendo usuario actual:', user.email);
        }
      }
    } catch (error) {
      // No cerrar sesión en caso de error - checkSession ya maneja esto internamente
      console.warn('⚠️ Error en checkSession, manteniendo sesión actual:', error);
      // Mantener el usuario actual si existe
    } finally {
      if (loading) {
        setLoading(false);
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userData = await authApi.login(email, password);
      setUser(userData);
    } catch (error: any) {
      // Solo mostrar como error si NO es un caso esperado
      if (error?.message?.includes('Credenciales inválidas') || 
          error?.message?.includes('Invalid login credentials')) {
        // Estos son casos de uso normales, no errores técnicos
        // No mostrar en consola, el usuario ya ve el mensaje en la UI
      } else {
        // Error técnico real
        console.error('Login error técnico:', error);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    role: 'admin' | 'swimmer' | 'coach',
    swimmerId?: string
  ): Promise<{ email: string; password: string }> => {
    try {
      setLoading(true);
      const userData = await authApi.signup(email, password, name, role, swimmerId);
      const initialPassword = (userData as any).initialPassword || password;
      
      // NO iniciar sesión automáticamente - el admin sigue logueado
      return { email: userData.email, password: initialPassword };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createUserAccount = async (
    email: string, 
    name: string, 
    role: 'admin' | 'swimmer' | 'coach'
  ): Promise<{ email: string; password: string }> => {
    try {
      setLoading(true);
      
      // Generar contraseña temporal
      const tempPassword = `temp_${Date.now()}`;
      
      const userData = await authApi.signup(email, tempPassword, name, role, undefined);
      const initialPassword = (userData as any).initialPassword || tempPassword;
      
      // NO llamamos a setUser() ni saveSession() - el admin sigue logueado
      return { email: userData.email, password: initialPassword };
    } catch (error) {
      console.error('Create user account error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await authApi.changePassword(currentPassword, newPassword);
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup, createUserAccount, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  // Ya no necesitamos verificar si es undefined porque siempre tiene un valor por defecto
  return context;
}

// Hook alternativo que retorna el mismo resultado
export function useAuthSafe() {
  return useAuth();
}