import { supabase } from './supabaseClient';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import type { User } from '../contexts/AuthContext';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc`;

// ==================== AUTHENTICATION ====================

export async function login(email: string, password: string): Promise<User> {
  try {
    console.log('🔐 LOGIN - Autenticando con Supabase Auth:', email);
    console.log('🔗 API URL:', API_URL);
    
    // Primero intentar con Supabase Auth directamente
    console.log('🔄 Intentando autenticación directa con Supabase...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ Supabase Auth error:', error);
      
      // Si el error es de email no confirmado, intentar con el backend para confirmar
      if (error.message.includes('Email not confirmed')) {
        console.log('📧 Email no confirmado, confirmando automáticamente...');
        
        try {
          // Llamar al utilitario para confirmar emails
          const confirmResponse = await fetch(`${API_URL}/util/confirm-emails`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (confirmResponse.ok) {
            console.log('✅ Email confirmado, reintentando login...');
            
            // Reintentar el login
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            
            if (retryError) {
              console.error('❌ Error en reintento:', retryError);
              throw new Error(retryError.message);
            }
            
            if (!retryData.user || !retryData.session) {
              throw new Error('Error de autenticación - no se recibió usuario o sesión');
            }
            
            // Guardar sesión en localStorage
            if (retryData.session) {
              localStorage.setItem('supabase.auth.token', JSON.stringify(retryData.session));
            }
            
            // Obtener swimmerId si es nadador
            let swimmerId = null;
            if (retryData.user.user_metadata.role === 'swimmer') {
              try {
                const swimmers = await fetchSwimmers();
                const swimmer = swimmers.find(s => s.userId === retryData.user.id || s.email === email);
                swimmerId = swimmer?.id || null;
              } catch (err) {
                console.warn('⚠️ No se pudo obtener perfil de nadador:', err);
              }
            }
            
            const user: User = {
              id: retryData.user.id,
              email: retryData.user.email!,
              name: retryData.user.user_metadata.name || email,
              role: retryData.user.user_metadata.role || 'swimmer',
              swimmerId,
            };
            
            console.log('✅ Login exitoso (después de confirmar email):', user.email);
            return user;
          }
        } catch (confirmError) {
          console.error('❌ Error al confirmar email:', confirmError);
        }
      }
      
      throw new Error(error.message);
    }
    
    if (!data.user || !data.session) {
      throw new Error('Error de autenticación - no se recibió usuario o sesión');
    }
    
    // Guardar sesión en localStorage
    if (data.session) {
      localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
    }
    
    // Obtener swimmerId si es nadador
    let swimmerId = null;
    if (data.user.user_metadata.role === 'swimmer') {
      try {
        const swimmers = await fetchSwimmers();
        const swimmer = swimmers.find(s => s.userId === data.user.id || s.email === email);
        swimmerId = swimmer?.id || null;
      } catch (err) {
        console.warn('⚠️ No se pudo obtener perfil de nadador:', err);
      }
    }
    
    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata.name || email,
      role: data.user.user_metadata.role || 'swimmer',
      swimmerId,
    };
    
    console.log('✅ Login exitoso (directo con Supabase):', user.email);
    return user;
    
  } catch (error) {
    console.error('❌ Login error técnico:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al iniciar sesión';
    console.log('ℹ️ Intento de login sin éxito:', errorMessage);
    throw new Error(errorMessage);
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

// ==================== HELPER FUNCTIONS ====================

async function fetchSwimmers() {
  const response = await fetch(`${API_URL}/swimmers`);
  
  if (!response.ok) {
    throw new Error('Error al obtener lista de nadadores');
  }
  
  const swimmers = await response.json();
  return swimmers;
}