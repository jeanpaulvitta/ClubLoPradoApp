import { supabase } from './supabaseClient';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import type { User } from '../contexts/AuthContext';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc`;

// ==================== HELPER: GET FRESH TOKEN ====================

/**
 * Obtiene un token de acceso fresco, refrescándolo automáticamente si es necesario
 */
async function getFreshAccessToken(): Promise<string> {
  console.log('🔑 Obteniendo token de acceso fresco...');
  
  // Obtener sesión actual
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !sessionData.session) {
    console.error('❌ Error obteniendo sesión:', sessionError);
    throw new Error('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.');
  }
  
  let accessToken = sessionData.session.access_token;
  const expiresAt = sessionData.session.expires_at;
  const now = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = expiresAt ? expiresAt - now : 0;
  
  console.log(`⏰ Token expira en ${timeUntilExpiry} segundos`);
  
  // Si expira en menos de 5 minutos o ya expiró, refrescar
  if (timeUntilExpiry < 300) {
    console.log('🔄 Token próximo a expirar o expirado, refrescando...');
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
    
    if (refreshError) {
      console.error('❌ Error al refrescar token:', refreshError);
      throw new Error('No se pudo refrescar la sesión. Por favor, vuelve a iniciar sesión.');
    }
    
    if (refreshData.session) {
      accessToken = refreshData.session.access_token;
      console.log('✅ Token refrescado exitosamente');
      
      // Actualizar sesión local
      const localSession = getSession();
      if (localSession) {
        saveSession({
          ...localSession,
          accessToken: accessToken,
        });
      }
    }
  }
  
  if (!accessToken || accessToken.trim() === '') {
    throw new Error('No se pudo obtener un token válido. Por favor, vuelve a iniciar sesión.');
  }
  
  return accessToken;
}

// ==================== AUTHENTICATION ====================

export async function login(email: string, password: string): Promise<User> {
  try {
    console.log('🔐 LOGIN - Autenticando:', email);
    console.log('🔗 API URL:', API_URL);
    
    // PASO 1: Intentar login con Supabase Auth
    console.log('🔄 Intentando autenticación con Supabase...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // PASO 2: Si hay error y es el admin, crear usuario automáticamente
    if (error) {
      console.error('❌ Error de autenticación:', error.message);
      
      // Auto-crear admin si es admin@loprado.cl y no existe
      if (error.message.includes('Invalid login credentials') && email === 'admin@loprado.cl') {
        console.log('👑 Usuario admin no existe, intentando crear automáticamente...');
        
        try {
          // Llamar al backend para crear admin (el backend maneja esto)
          const createResponse = await fetch(`${API_URL}/auth/signin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
          
          if (!createResponse.ok) {
            const errorData = await createResponse.json();
            throw new Error(errorData.error || 'Error al crear usuario admin');
          }
          
          const { session, user: createdUser } = await createResponse.json();
          
          console.log('✅ Usuario admin creado y autenticado');
          
          // Guardar sesión
          if (session?.access_token) {
            localStorage.setItem('supabase.auth.token', JSON.stringify(session));
            
            saveSession({
              id: createdUser.id,
              email: createdUser.email,
              name: createdUser.name,
              role: createdUser.role,
              swimmerId: createdUser.swimmerId,
              accessToken: session.access_token,
            });
          }
          
          return createdUser;
        } catch (createError) {
          console.error('❌ Error al crear admin:', createError);
          throw new Error('Credenciales inválidas. Verifica tu correo y contraseña.');
        }
      }
      
      // Para otros errores, lanzar mensaje claro
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Credenciales inválidas. Verifica tu correo y contraseña.');
      }
      
      throw new Error(error.message);
    }
    
    // PASO 3: Login exitoso, procesar sesión
    if (!data.user || !data.session) {
      throw new Error('Error de autenticación - no se recibió usuario o sesión');
    }
    
    console.log('✅ Autenticación exitosa:', data.user.email);
    
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
    localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
    
    // Guardar en formato de nuestra app
    const userRole = data.user.user_metadata.role || (email === 'admin@loprado.cl' ? 'admin' : 'swimmer');
    
    saveSession({
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata.name || email.split('@')[0],
      role: userRole,
      swimmerId: swimmerId,
      accessToken: data.session.access_token,
    });
    
    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata.name || email.split('@')[0],
      role: userRole,
      swimmerId,
    };
    
    console.log('✅ Login completado:', user.email, 'Rol:', user.role);
    return user;
    
  } catch (error) {
    console.error('❌ Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al iniciar sesión';
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
    console.log('🔄 Método: Cliente Supabase directo (sin backend)');
    
    // PASO 1: Verificar que hay una sesión activa
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.error('❌ No hay sesión activa:', sessionError);
      throw new Error('No hay sesión activa. Por favor, vuelve a iniciar sesión.');
    }
    
    const userEmail = sessionData.session.user.email;
    console.log('✅ Sesión activa para:', userEmail);
    
    // PASO 2: Verificar la contraseña actual intentando re-autenticar
    console.log('🔍 Verificando contraseña actual...');
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: userEmail!,
      password: currentPassword,
    });
    
    if (verifyError) {
      console.error('❌ Contraseña actual incorrecta:', verifyError.message);
      throw new Error('La contraseña actual es incorrecta');
    }
    
    console.log('✅ Contraseña actual verificada');
    
    // PASO 3: Cambiar a la nueva contraseña usando el cliente de Supabase
    console.log('🔄 Actualizando contraseña...');
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (updateError) {
      console.error('❌ Error al actualizar contraseña:', updateError.message);
      throw new Error(updateError.message || 'Error al actualizar contraseña');
    }
    
    console.log('✅ Contraseña actualizada exitosamente');
    
    // PASO 4: Refrescar la sesión para asegurar que esté actualizada
    console.log('🔄 Refrescando sesión...');
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
    
    if (refreshError) {
      console.warn('⚠️ Advertencia: No se pudo refrescar la sesión:', refreshError.message);
      console.warn('⚠️ La contraseña se cambió, pero deberías cerrar sesión y volver a entrar');
    } else if (refreshData?.session) {
      // Actualizar sesión local
      const localSession = getSession();
      if (localSession) {
        saveSession({
          ...localSession,
          accessToken: refreshData.session.access_token,
        });
        console.log('✅ Sesión actualizada correctamente');
      }
    }
    
    console.log('✅ Cambio de contraseña completado exitosamente');
    
  } catch (error) {
    console.error('❌ Error al cambiar contraseña:', error);
    console.error('❌ Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Mejorar mensaje de error
    if (error instanceof Error) {
      if (error.message.includes('incorrecta')) {
        throw error; // Ya tiene un mensaje claro
      }
      throw new Error(`Error al cambiar contraseña: ${error.message}`);
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