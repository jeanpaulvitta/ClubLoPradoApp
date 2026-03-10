import { supabase } from './supabaseClient';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import type { User } from '../contexts/AuthContext';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc`;

// Exportar supabase client para uso en AuthContext
export { supabase };

// ==================== HELPER: GET FRESH TOKEN ====================

/**
 * Obtiene un token de acceso fresco, refrescándolo automáticamente si es necesario
 */
async function getFreshAccessToken(): Promise<string> {
  console.log('🔑 Obteniendo token de acceso fresco...');
  
  try {
    // Obtener sesión actual de Supabase
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Error obteniendo sesión de Supabase:', sessionError);
      console.error('   Error message:', sessionError.message);
      throw new Error('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.');
    }
    
    if (!sessionData.session) {
      console.error('❌ No hay sesión activa en Supabase');
      console.log('🔍 Intentando recuperar sesión local...');
      
      // Intentar recuperar de localStorage
      const localSession = getSession();
      if (localSession?.accessToken) {
        console.log('⚠️ Usando token de localStorage como último recurso');
        return localSession.accessToken;
      }
      
      throw new Error('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.');
    }
    
    let accessToken = sessionData.session.access_token;
    const expiresAt = sessionData.session.expires_at;
    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = expiresAt ? expiresAt - now : 0;
    
    console.log(`⏰ Token expira en ${timeUntilExpiry} segundos`);
    console.log('🔍 Token obtenido (longitud):', accessToken.length);
    console.log('🔍 Token preview:', accessToken.substring(0, 50) + '...');
    
    // Si expira en menos de 5 minutos o ya expiró, refrescar
    if (timeUntilExpiry < 300) {
      console.log('🔄 Token próximo a expirar o expirado, refrescando...');
      
      try {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error('❌ Error al refrescar token:', refreshError);
          console.error('   Error message:', refreshError.message);
          
          // Si el refresh falla, intentar usar el token actual de todos modos
          console.log('⚠️ Usando token actual a pesar del error de refresh');
        } else if (refreshData.session) {
          accessToken = refreshData.session.access_token;
          console.log('✅ Token refrescado exitosamente');
          console.log('🔍 Nuevo token (longitud):', accessToken.length);
          
          // Actualizar sesión local
          const localSession = getSession();
          if (localSession) {
            saveSession({
              ...localSession,
              accessToken: accessToken,
            });
          }
        }
      } catch (refreshError) {
        console.error('❌ Excepción al refrescar token:', refreshError);
        console.log('⚠️ Continuando con token actual');
      }
    }
    
    if (!accessToken || accessToken.trim() === '') {
      console.error('❌ Token vacío o inválido');
      throw new Error('No se pudo obtener un token válido. Por favor, vuelve a iniciar sesión.');
    }
    
    // Validar que el token tenga formato JWT válido
    const jwtParts = accessToken.split('.');
    if (jwtParts.length !== 3) {
      console.error('❌ Token con formato JWT inválido (no tiene 3 partes)');
      console.error('   Partes encontradas:', jwtParts.length);
      throw new Error('Token inválido. Por favor, vuelve a iniciar sesión.');
    }
    
    console.log('✅ Token válido obtenido y verificado, enviando al servidor...');
    return accessToken;
  } catch (error) {
    console.error('❌ Error en getFreshAccessToken:', error);
    console.error('   Error type:', error instanceof Error ? error.constructor.name : typeof error);
    
    // Re-lanzar el error con contexto adicional
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error al obtener token de acceso. Por favor, vuelve a iniciar sesión.');
  }
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
            console.error('❌ Error del servidor al crear admin:', errorData);
            
            // Si es un error de red/fetch, dar mensaje específico
            if (!errorData || typeof errorData !== 'object') {
              throw new Error(
                '🚨 Error de Conexión con el Servidor\\n\\n' +
                'No se puede conectar con la Edge Function. Posibles causas:\\n\\n' +
                '1. Las variables de entorno NO están configuradas correctamente\\n' +
                '2. La función NO ha sido desplegada\\n' +
                '3. Las keys son PLACEHOLDERS (sb_secret_xxx) en lugar de JWT reales\\n\\n' +
                '👉 Haz clic en el banner rojo arriba para ver la guía paso a paso'
              );
            }
            
            throw new Error(errorData.error || 'Error al crear usuario admin');
          }
          
          const { session, user: createdUser } = await createResponse.json();
          
          console.log('✅ Usuario admin creado y autenticado');
          
          // IMPORTANTE: Establecer la sesión en Supabase client para que getFreshAccessToken funcione
          if (session?.access_token && session?.refresh_token) {
            console.log('🔄 Estableciendo sesión en Supabase client...');
            await supabase.auth.setSession({
              access_token: session.access_token,
              refresh_token: session.refresh_token,
            });
            console.log('✅ Sesión establecida en Supabase client');
            
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
          
          // FALLBACK: Si el backend falla completamente (Failed to fetch),
          // crear admin local temporal en modo offline
          if (createError instanceof TypeError && createError.message.includes('fetch')) {
            console.log('🔧 MODO FALLBACK: Creando admin local temporal...');
            console.log('⚠️ El backend NO está disponible - usando modo offline');
            
            // Crear usuario admin local usando Supabase Auth directamente
            try {
              const { data: signupData, error: signupError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                  data: {
                    name: 'Administrador',
                    role: 'admin',
                  }
                }
              });
              
              if (signupError) {
                console.error('❌ Error al crear admin local:', signupError);
                throw new Error('No se pudo crear el usuario administrador. Por favor, configura el backend correctamente.');
              }
              
              if (!signupData.user || !signupData.session) {
                throw new Error('Error al crear admin local - no se recibió usuario o sesión');
              }
              
              console.log('✅ Admin local creado exitosamente');
              
              // Guardar sesión local
              const adminUser: User = {
                id: signupData.user.id,
                email: signupData.user.email!,
                name: 'Administrador',
                role: 'admin',
                swimmerId: null,
              };
              
              saveSession({
                ...adminUser,
                accessToken: signupData.session.access_token,
              });
              
              // Guardar flag indicando que está en modo offline
              localStorage.setItem('backend_offline_mode', 'true');
              
              console.log('⚠️ IMPORTANTE: La app está en MODO OFFLINE');
              console.log('⚠️ Debes configurar el backend para funcionalidad completa');
              
              return adminUser;
            } catch (fallbackError) {
              console.error('❌ Error en fallback:', fallbackError);
              throw new Error(
                '🚨 No se pudo crear el usuario administrador\n\n' +
                'El backend Edge Function NO está configurado correctamente.\n\n' +
                '👉 Necesitas configurar las variables de entorno en Supabase.\n' +
                'Consulta el banner rojo arriba para instrucciones paso a paso.'
              );
            }
          }
          
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
    
    // VERIFICAR SI EL USUARIO ESTÁ APROBADO
    const userStatus = data.user.user_metadata.status;
    if (userStatus === 'pending_approval') {
      console.warn('⚠️ Usuario pendiente de aprobación:', data.user.email);
      // Cerrar la sesión inmediatamente
      await supabase.auth.signOut();
      throw new Error(
        'Tu cuenta está pendiente de aprobación por un administrador.\n\n' +
        'Por favor, espera a que el administrador apruebe tu solicitud antes de iniciar sesión.'
      );
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
    
    // NO guardar sesión manualmente - Supabase lo hace automáticamente
    // El cliente de Supabase con persistSession: true guarda automáticamente
    console.log('✅ Sesión de Supabase guardada automáticamente');
    
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
    console.log('🔐 SIGNUP - Registrando usuario directamente con Supabase Auth:', { email, name, role });
    console.log('✨ NUEVO MÉTODO: Sin service role key - registro directo del cliente');
    
    // NUEVO MÉTODO: Usar signUp directo del cliente
    // Esto NO requiere service role key y funciona desde el frontend
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
          status: 'pending_approval', // Marcar como pendiente de aprobación
        }
      }
    });
    
    if (error) {
      console.error('❌ Error al registrar usuario:', error);
      
      // Mensajes de error más específicos
      if (error.message.includes('already') || error.message.includes('exists')) {
        throw new Error('Ya existe un usuario con este correo electrónico.');
      }
      
      throw new Error(error.message || 'Error al registrar usuario');
    }
    
    if (!data.user) {
      throw new Error('No se recibió información del usuario creado');
    }
    
    console.log('✅ Usuario registrado exitosamente en Supabase Auth:', {
      id: data.user.id,
      email: data.user.email,
      role: data.user.user_metadata.role,
      status: data.user.user_metadata.status
    });
    
    // Si es nadador, crear perfil automáticamente
    // (Solo si el admin lo está creando, no en auto-registro)
    if (role === 'swimmer' && swimmerId) {
      try {
        const accessToken = await getFreshAccessToken();
        await fetch(`${API_URL}/swimmers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            id: swimmerId,
            userId: data.user.id,
            name,
            email,
            rut: '00.000.000-0',
            gender: 'Masculino',
            dateOfBirth: new Date(Date.now() - 25 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            schedule: '7am',
            joinDate: new Date().toISOString().split('T')[0],
            personalBests: [],
            personalBestsHistory: [],
            goals: [],
          }),
        });
        console.log('✅ Perfil de nadador creado');
      } catch (err) {
        console.warn('⚠️ Error al crear perfil de nadador:', err);
      }
    }
    
    const user: User & { initialPassword?: string } = {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata.name || name,
      role: data.user.user_metadata.role || role,
      swimmerId: swimmerId || null,
      initialPassword: password,
    };
    
    console.log('✅ Usuario creado exitosamente (pendiente de aprobación)');
    return user;
    
  } catch (error) {
    console.error('❌ Signup error:', error);
    console.error('❌ Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('❌ Error details:', error instanceof Error ? error.message : String(error));
    
    // Si ya es un Error con mensaje útil, re-lanzarlo
    if (error instanceof Error) {
      throw error;
    }
    
    // Si no, crear un error genérico
    throw new Error('Error desconocido al crear usuario. Por favor, intenta nuevamente.');
  }
}

export async function logout(): Promise<void> {
  try {
    console.log('🚪 Cerrando sesión...');
    
    // PASO 1: Cerrar sesión en Supabase (esto limpia el localStorage automáticamente)
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('❌ Error al cerrar sesión en Supabase:', error);
    } else {
      console.log('✅ Sesión de Supabase cerrada');
    }
    
    // PASO 2: Intentar notificar al backend (opcional, no bloquear si falla)
    try {
      const session = getSession();
      if (session?.accessToken) {
        await fetch(`${API_URL}/auth/signout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });
        console.log('✅ Backend notificado del logout');
      }
    } catch (backendError) {
      console.warn('⚠️ No se pudo notificar al backend, pero sesión local cerrada');
    }
    
    // PASO 3: Limpiar sesión personalizada de localStorage
    clearSession();
    
    // PASO 4: Limpiar flag de modo offline
    localStorage.removeItem('backend_offline_mode');
    
    console.log('✅ Logout completado exitosamente');
    
  } catch (error) {
    console.error('❌ Logout error:', error);
    // Asegurar que la sesión local se limpie incluso si algo falla
    clearSession();
    localStorage.removeItem('backend_offline_mode');
    await supabase.auth.signOut(); // Intentar de nuevo
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

// Crear usuario con generación automática de contraseña (solo admin) - USA LA NUEVA RUTA
export async function createUserAccount(
  email: string,
  name: string,
  role: 'admin' | 'swimmer' | 'coach'
): Promise<{ email: string; password: string }> {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 createUserAccount - Llamando a /auth/create-user');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Datos:', { email, name, role });
    
    // Obtener token del admin
    const accessToken = await getFreshAccessToken();
    
    // Llamar a la nueva ruta /auth/create-user
    const response = await fetch(`${API_URL}/auth/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ email, name, role }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error del servidor:', error);
      throw new Error(error.error || 'Error al crear usuario');
    }
    
    const { user, password } = await response.json();
    
    console.log('✅ Usuario creado exitosamente');
    console.log('  - Email:', user.email);
    console.log('  - Password length:', password.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return {
      email: user.email,
      password,
    };
  } catch (error) {
    console.error('❌ Error en createUserAccount:', error);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    throw error;
  }
}

// Aprobar un usuario pendiente (solo para admins)
export async function approveUser(userId: string): Promise<void> {
  try {
    console.log('✅ Aprobando usuario:', userId);
    
    // Obtener token del admin
    const accessToken = await getFreshAccessToken();
    
    // Actualizar el usuario para marcar como aprobado
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { status: 'approved' }
    });
    
    if (error) {
      console.error('❌ Error al aprobar usuario:', error);
      throw new Error(error.message || 'Error al aprobar usuario');
    }
    
    console.log('✅ Usuario aprobado exitosamente');
  } catch (error) {
    console.error('❌ Error en approveUser:', error);
    throw error;
  }
}

// Obtener lista de usuarios pendientes de aprobación (solo para admins)
export async function getPendingUsers(): Promise<any[]> {
  try {
    console.log('📋 Obteniendo usuarios pendientes...');
    
    // Esto requiere obtener todos los usuarios desde Supabase Auth
    // Por limitaciones de la API, vamos a usar un enfoque diferente
    
    // La mejor opción es que el admin vea los usuarios desde el dashboard de Supabase
    // O crear una Cloud Function que consulte todos los usuarios
    
    // Por ahora, retornar array vacío y documentar la limitación
    console.warn('⚠️ La obtención de usuarios pendientes requiere acceso al dashboard de Supabase');
    return [];
  } catch (error) {
    console.error('❌ Error en getPendingUsers:', error);
    return [];
  }
}

async function fetchSwimmers() {
  const response = await fetch(`${API_URL}/swimmers`);
  
  if (!response.ok) {
    throw new Error('Error al obtener lista de nadadores');
  }
  
  const swimmers = await response.json();
  return swimmers;
}