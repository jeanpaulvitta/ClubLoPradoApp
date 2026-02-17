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
            
            // Si es admin@loprado.cl, actualizar rol a admin
            if (email === 'admin@loprado.cl') {
              console.log('👑 Actualizando rol a administrador...');
              try {
                const roleResponse = await fetch(`${API_URL}/util/set-admin-role`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email }),
                });
                
                if (roleResponse.ok) {
                  console.log('✅ Rol actualizado a administrador');
                } else {
                  console.warn('⚠️ No se pudo actualizar el rol');
                }
              } catch (roleError) {
                console.warn('⚠️ Error al actualizar rol:', roleError);
              }
            }
            
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
            
            // Guardar sesión en localStorage
            if (retryData.session) {
              localStorage.setItem('supabase.auth.token', JSON.stringify(retryData.session));
              
              // Guardar también en el formato que usa nuestra app
              saveSession({
                id: retryData.user.id,
                email: retryData.user.email!,
                name: retryData.user.user_metadata.name || email,
                role: retryData.user.user_metadata.role || 'admin',
                swimmerId: swimmerId,
                accessToken: retryData.session.access_token,
              });
            }
            
            const user: User = {
              id: retryData.user.id,
              email: retryData.user.email!,
              name: retryData.user.user_metadata.name || email,
              role: retryData.user.user_metadata.role || 'admin', // Default a admin para admin@loprado.cl
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
    
    // Si es admin@loprado.cl y no tiene rol admin, actualizar
    if (email === 'admin@loprado.cl' && data.user.user_metadata.role !== 'admin') {
      console.log('👑 Detectado admin@loprado.cl sin rol admin, actualizando...');
      try {
        const roleResponse = await fetch(`${API_URL}/util/set-admin-role`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        
        if (roleResponse.ok) {
          console.log('✅ Rol actualizado a administrador');
          // Actualizar el rol localmente
          data.user.user_metadata.role = 'admin';
        } else {
          console.warn('⚠️ No se pudo actualizar el rol');
        }
      } catch (roleError) {
        console.warn('⚠️ Error al actualizar rol:', roleError);
      }
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
    
    // Guardar sesión en localStorage
    if (data.session) {
      localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
      
      // Guardar también en el formato que usa nuestra app
      saveSession({
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata.name || email,
        role: data.user.user_metadata.role || (email === 'admin@loprado.cl' ? 'admin' : 'swimmer'),
        swimmerId: swimmerId,
        accessToken: data.session.access_token,
      });
    }
    
    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata.name || email,
      role: data.user.user_metadata.role || (email === 'admin@loprado.cl' ? 'admin' : 'swimmer'),
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
      console.error('❌ Server error response:', error);
      
      // Extraer el mensaje de error más específico
      const errorMessage = error.message || error.details?.message || error.error || 'Error al registrar usuario';
      throw new Error(errorMessage);
    }
    
    const { user } = await response.json();
    
    console.log('✅ Usuario creado:', user);
    
    // Retornar con password inicial para mostrarlo al admin
    return { ...user, initialPassword: password };
  } catch (error) {
    console.error('❌ Signup error:', error);
    console.error('❌ Error details:', error instanceof Error ? error.message : String(error));
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

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  try {
    console.log('🔑 Cambiando contraseña...');
    
    // Intentar obtener una sesión válida refrescada
    let accessToken: string | null = null;
    
    // Primero intentar refrescar la sesión con Supabase
    console.log('🔄 Refrescando sesión de Supabase...');
    const { data: { session: supabaseSession }, error: refreshError } = await supabase.auth.refreshSession();
    
    if (refreshError) {
      console.error('⚠️ No se pudo refrescar sesión:', refreshError.message);
      
      // Si falla el refresh, intentar obtener la sesión actual
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !currentSession) {
        console.error('❌ No hay sesión válida:', sessionError);
        throw new Error('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.');
      }
      
      accessToken = currentSession.access_token;
      console.log('✅ Token obtenido de sesión actual');
    } else if (supabaseSession) {
      accessToken = supabaseSession.access_token;
      console.log('✅ Token obtenido de sesión refrescada');
      
      // Actualizar la sesión local con el token refrescado
      const localSession = getSession();
      if (localSession) {
        saveSession({
          ...localSession,
          accessToken: accessToken,
        });
        console.log('✅ Sesión local actualizada con token refrescado');
      }
    }
    
    if (!accessToken || accessToken.trim() === '') {
      throw new Error('No se pudo obtener un token válido. Por favor, vuelve a iniciar sesión.');
    }

    console.log('🔐 Enviando solicitud de cambio de contraseña...');
    
    // Usar el servidor backend para cambiar la contraseña
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error al cambiar contraseña' }));
      const errorMessage = errorData.error || errorData.message || 'Error al cambiar contraseña';
      
      // Si el error es de token inválido, dar un mensaje más claro
      if (errorMessage.includes('Invalid JWT') || errorMessage.includes('Unauthorized')) {
        throw new Error('Tu sesión ha expirado. Por favor, cierra sesión y vuelve a iniciar sesión.');
      }
      
      throw new Error(errorMessage);
    }

    console.log('✅ Contraseña cambiada exitosamente');
    return;
    
  } catch (error) {
    console.error('❌ Error al cambiar contraseña:', error);
    
    // Mejorar mensaje de error
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Error desconocido al cambiar contraseña');
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
        // Solo limpiar si es un error 401 (Unauthorized)
        if (response.status === 401) {
          console.log('⚠️ Sesión expirada (401), limpiando...');
          clearSession();
          return null;
        }
        
        // Para otros errores (500, 503, etc.), mantener la sesión local
        console.warn('⚠️ Error temporal del servidor, manteniendo sesión local');
        return {
          id: session.id,
          email: session.email,
          name: session.name,
          role: session.role,
          swimmerId: session.swimmerId,
        };
      }
      
      const { user, session: newSession } = await response.json();
      
      if (!user) {
        console.log('⚠️ No hay usuario en la respuesta, manteniendo sesión local');
        // NO limpiar sesión, mantenerla
        return {
          id: session.id,
          email: session.email,
          name: session.name,
          role: session.role,
          swimmerId: session.swimmerId,
        };
      }
      
      // Actualizar token si es necesario
      if (newSession?.access_token) {
        saveSession({ ...user, accessToken: newSession.access_token });
      }
      
      console.log('✅ Sesión verificada correctamente');
      return user;
    } catch (fetchError) {
      // Error de red (timeout, conexión perdida, etc.)
      console.warn('⚠️ Error de red al verificar sesión, manteniendo sesión local:', fetchError);
      
      // Mantener la sesión local en caso de error de red
      return {
        id: session.id,
        email: session.email,
        name: session.name,
        role: session.role,
        swimmerId: session.swimmerId,
      };
    }
  } catch (error) {
    console.error('❌ Error crítico en checkSession:', error);
    // NO limpiar sesión en caso de error crítico - mantener sesión local
    const session = getSession();
    if (session) {
      console.log('⚠️ Error crítico pero manteniendo sesión local existente');
      return {
        id: session.id,
        email: session.email,
        name: session.name,
        role: session.role,
        swimmerId: session.swimmerId,
      };
    }
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