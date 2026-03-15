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
    
    // Verificar si hay una sesión guardada al cargar (solo una vez)
    const initialCheck = async () => {
      try {
        // Primero verificar con Supabase directamente
        const { data: { session } } = await authApi.supabase.auth.getSession();
        
        if (session?.user) {
          // Hay sesión en Supabase, sincronizar con nuestro estado
          const savedSession = authApi.getSession();
          if (savedSession) {
            console.log('✅ Sesión de Supabase válida, usuario ya cargado');
            // Usuario ya está cargado desde el estado inicial
          } else {
            // Hay sesión en Supabase pero no en nuestro localStorage
            console.log('🔄 Restaurando sesión desde Supabase');
            const userRole = session.user.user_metadata?.role || 'swimmer';
            const userData: User = {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
              role: userRole,
              swimmerId: session.user.user_metadata?.swimmerId,
            };
            
            // Guardar en nuestro localStorage
            authApi.saveSession({
              ...userData,
              accessToken: session.access_token,
            });
            
            setUser(userData);
          }
        } else {
          // No hay sesión en Supabase
          const savedSession = authApi.getSession();
          if (savedSession) {
            // Hay sesión en localStorage pero no en Supabase - limpiar
            console.log('⚠️ Sesión local sin sesión de Supabase - limpiando');
            authApi.clearSession();
            setUser(null);
          }
        }
      } catch (error) {
        console.warn('⚠️ Error verificando sesión inicial:', error);
        // En caso de error, mantener sesión local si existe
      } finally {
        setLoading(false);
      }
    };
    
    initialCheck();
    
    // Escuchar cambios de autenticación de Supabase
    const { data: { subscription } } = authApi.supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔔 Auth state change:', event);
      
      if (event === 'SIGNED_IN' && session) {
        // Usuario inició sesión
        const userRole = session.user.user_metadata?.role || 'swimmer';
        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
          role: userRole,
          swimmerId: session.user.user_metadata?.swimmerId,
        };
        
        authApi.saveSession({
          ...userData,
          accessToken: session.access_token,
        });
        
        setUser(userData);
      } else if (event === 'SIGNED_OUT') {
        // Usuario cerró sesión
        authApi.clearSession();
        setUser(null);
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Token refrescado - actualizar accessToken
        const savedSession = authApi.getSession();
        if (savedSession) {
          authApi.saveSession({
            ...savedSession,
            accessToken: session.access_token,
          });
        }
        console.log('✅ Token refrescado automáticamente');
      } else if (event === 'USER_UPDATED' && session) {
        // Usuario actualizado (ej: cambio de contraseña)
        const savedSession = authApi.getSession();
        if (savedSession) {
          authApi.saveSession({
            ...savedSession,
            accessToken: session.access_token,
          });
        }
        console.log('✅ Usuario actualizado');
      }
    });
    
    return () => {
      setMounted(false);
      subscription.unsubscribe();
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
      // Limpiar caché de tokens de passwordRequests
      const { clearTokenCache } = await import('../services/passwordRequests');
      clearTokenCache();
      
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
      
      // Generar contraseña temporal fuerte
      const tempPassword = `NP${Date.now()}!${Math.random().toString(36).substring(2, 10)}`;
      
      console.log('📝 Creando cuenta de usuario:', { email, name, role });
      
      const userData = await authApi.signup(email, tempPassword, name, role, undefined);
      const initialPassword = (userData as any).initialPassword || tempPassword;
      
      console.log('✅ Usuario creado exitosamente');
      console.log('⚠️ IMPORTANTE: El usuario tiene status "pending_approval"');
      console.log('📋 Para que pueda iniciar sesión, debes aprobar al usuario en el Dashboard de Supabase');
      console.log('📖 Ver guía: /GUIA_RAPIDA_APROBAR_USUARIOS.md');
      
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