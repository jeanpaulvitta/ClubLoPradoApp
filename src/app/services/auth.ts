import { supabase } from './supabaseClient';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import type { User } from '../contexts/AuthContext';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc`;

// ==================== AUTHENTICATION ====================

export async function login(email: string, password: string): Promise<User> {
  try {
    console.log('🔐 LOGIN - Autenticando con Supabase Auth:', email);
    console.log('🔗 API URL:', API_URL);
    
    // Primero intentar con el servidor backend
    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        
        // Si es error 401, probablemente el usuario no existe o credenciales inválidas
        if (response.status === 401) {
          // Log informativo, no error
          console.log('ℹ️ Error de autenticación:', error);
          
          // Mensaje específico para el usuario admin que no existe
          if (email === 'admin@loprado.cl') {
            throw new Error('Usuario administrador no encontrado. Por favor, usa el botón "Crear Usuario Administrador" primero.');
          }
          throw new Error('Credenciales inválidas. Verifica tu email y contraseña.');
        }
        
        // Si el servidor no está disponible o tiene problemas, usar fallback
        if (response.status === 404 || response.status === 500) {
          console.log('⚠️ Backend no disponible, intentando autenticación directa con Supabase...');
          throw new Error('Backend unavailable');
        }
        
        // Para otros errores, mostrar como error técnico
        console.error('❌ Error response:', error);
        throw new Error(error.error || error.message || 'Error al iniciar sesión');
      }
      
      const { user, session } = await response.json();
      
      // Guardar sesión en localStorage
      if (session) {
        saveSession({ ...user, accessToken: session.access_token });
      }
      
      console.log('✅ Login exitoso (via backend):', user);
      return user;
    } catch (fetchError: any) {
      // Si ya es un mensaje de error específico, propagarlo
      if (fetchError.message.includes('Usuario administrador no encontrado') || 
          fetchError.message.includes('Credenciales inválidas')) {
        throw fetchError;
      }
      
      // Si el backend no está disponible, intentar directamente con Supabase
      if (fetchError.message === 'Backend unavailable' || fetchError.message === 'Failed to fetch') {
        console.log('🔄 Intentando autenticación directa con Supabase...');
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          // Mensaje específico para el usuario admin - NO mostrar como error sino como info
          if (email === 'admin@loprado.cl' && error.message.includes('Invalid login credentials')) {
            console.log('ℹ️ Admin no encontrado - necesita ser creado primero');
            throw new Error('Usuario administrador no encontrado. Por favor, usa el botón "Crear Usuario Administrador" primero.');
          }
          
          // Para otros errores de credenciales, log informativo
          if (error.message.includes('Invalid login credentials')) {
            console.log('ℹ️ Credenciales inválidas proporcionadas');
            throw new Error('Credenciales inválidas. Verifica tu email y contraseña.');
          }
          
          // Solo mostrar error real para problemas técnicos
          console.error('❌ Supabase Auth error técnico:', error);
          throw new Error(error.message);
        }
        
        if (!data.user || !data.session) {
          throw new Error('No se pudo obtener la sesión del usuario');
        }
        
        // Crear objeto de usuario compatible
        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
          role: data.user.user_metadata?.role || 'swimmer',
          swimmerId: data.user.user_metadata?.swimmerId || null,
        };
        
        // Guardar sesión
        saveSession({ ...user, accessToken: data.session.access_token });
        
        console.log('✅ Login exitoso (directo con Supabase):', user);
        return user;
      }
      
      throw fetchError;
    }
  } catch (error: any) {
    // Solo mostrar como error si NO es un caso esperado
    if (error?.message?.includes('Usuario administrador no encontrado') || 
        error?.message?.includes('Credenciales inválidas')) {
      // Estos son casos de uso normales, no errores técnicos
      console.log('ℹ️ Intento de login sin éxito:', error.message);
    } else {
      // Error técnico real
      console.error('❌ Login error técnico:', error);
    }
    throw error;
  }
}

export async function signup(
  email: string, 
  password: string, 
  name: string, 
  role: 'admin' | 'swimmer' | 'coach',
  swimmerId?: string
): Promise<User & { initialPassword?: string }> {
  try {
    console.log('🔐 SIGNUP - Creando usuario con Supabase Auth:', { email, name, role });
    
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name, role }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al registrar usuario');
    }
    
    const { user } = await response.json();
    
    console.log('✅ Usuario creado:', user);
    
    // Retornar con password inicial para mostrarlo al admin
    return { ...user, initialPassword: password };
  } catch (error) {
    console.error('❌ Signup error:', error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    const session = getSession();
    
    if (session?.accessToken) {
      await fetch(`${API_URL}/auth/signout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });
    }
    
    clearSession();
    console.log('✅ Logout exitoso');
  } catch (error) {
    console.error('❌ Logout error:', error);
    // Limpiar sesión local incluso si falla el logout en el servidor
    clearSession();
    throw error;
  }
}

export async function changePassword(newPassword: string): Promise<void> {
  try {
    const session = getSession();
    
    if (!session?.accessToken) {
      throw new Error('No hay sesión activa');
    }
    
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ newPassword }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al cambiar contraseña');
    }
    
    console.log('✅ Contraseña cambiada exitosamente');
  } catch (error) {
    console.error('❌ Error al cambiar contraseña:', error);
    throw error;
  }
}

export async function checkSession(): Promise<User | null> {
  try {
    const session = getSession();
    
    if (!session?.accessToken) {
      // No hay sesión local, no mostrar nada
      return null;
    }
    
    // Intentar verificar sesión con el backend
    try {
      const response = await fetch(`${API_URL}/auth/session`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });
      
      if (!response.ok) {
        // Sesión inválida, limpiar silenciosamente
        clearSession();
        return null;
      }
      
      const { user, session: newSession } = await response.json();
      
      if (!user) {
        clearSession();
        return null;
      }
      
      // Actualizar token si es necesario
      if (newSession?.access_token) {
        saveSession({ ...user, accessToken: newSession.access_token });
      }
      
      console.log('✅ Sesión verificada correctamente');
      return user;
    } catch (fetchError) {
      // Si hay error de red, intentar con Supabase directamente SOLO si tenemos un token
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
          clearSession();
          return null;
        }
        
        const supaUser = data.session.user;
        const user: User = {
          id: supaUser.id,
          email: supaUser.email!,
          name: supaUser.user_metadata?.name || supaUser.email!.split('@')[0],
          role: supaUser.user_metadata?.role || 'swimmer',
          swimmerId: supaUser.user_metadata?.swimmerId || null,
        };
        
        saveSession({ ...user, accessToken: data.session.access_token });
        console.log('✅ Sesión restaurada desde Supabase');
        return user;
      } catch (supabaseError) {
        // Error silencioso - no hay sesión
        clearSession();
        return null;
      }
    }
  } catch (error) {
    // Error silencioso - no hay sesión
    clearSession();
    return null;
  }
}

// ==================== SESSION MANAGEMENT ====================

const SESSION_KEY = 'supabase_session';

interface StoredSession extends User {
  accessToken: string;
}

export function saveSession(user: User & { accessToken?: string }): void {
  const session: StoredSession = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    swimmerId: user.swimmerId,
    accessToken: user.accessToken || '',
  };
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): (User & { accessToken: string }) | null {
  const sessionData = localStorage.getItem(SESSION_KEY);
  if (!sessionData) return null;
  
  try {
    const session = JSON.parse(sessionData) as StoredSession;
    return session;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// ==================== LEGACY SUPPORT ====================

// Limpiar datos antiguos de localStorage
export function clearLegacyData(): void {
  // Limpiar usuarios demo antiguos
  localStorage.removeItem('natacion_master_session');
  localStorage.removeItem('natacion_master_users');
  
  console.log('✅ Datos antiguos de localStorage limpiados');
}