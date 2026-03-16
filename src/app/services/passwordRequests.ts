import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc`;

export interface PasswordRequest {
  id: string;
  name: string;
  email: string;
  role: 'swimmer' | 'coach';
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  generatedPassword?: string;
}

// ==================== HELPER: GET AUTH TOKEN ====================

// Cache del token para evitar múltiples llamadas a getSession()
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getAuthToken(): Promise<string> {
  // Si tenemos un token cacheado y no ha expirado, usarlo
  const now = Date.now();
  if (cachedToken && tokenExpiry > now) {
    console.log('🔑 Usando token cacheado');
    return cachedToken;
  }
  
  console.log('🔑 Obteniendo nuevo token de sesión...');
  const { supabase } = await import('./supabaseClient');
  const { data: sessionData, error } = await supabase.auth.getSession();
  
  if (error) {
    console.log('ℹ️ Error obteniendo sesión:', error.message);
    // Limpiar caché de token
    cachedToken = null;
    tokenExpiry = 0;
    throw new Error('No hay sesión activa. Por favor, inicia sesión.');
  }
  
  if (!sessionData.session) {
    console.log('ℹ️ No hay sesión activa');
    // Limpiar caché de token
    cachedToken = null;
    tokenExpiry = 0;
    throw new Error('No hay sesión activa. Por favor, inicia sesión.');
  }
  
  // Verificar que el token sea válido (no esté expirado)
  const expiresAt = sessionData.session.expires_at;
  if (expiresAt && expiresAt * 1000 < now) {
    console.log('ℹ️ Token expirado');
    // Limpiar caché de token
    cachedToken = null;
    tokenExpiry = 0;
    throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
  }
  
  // Cachear el token por 50 minutos (los tokens de Supabase duran 1 hora)
  cachedToken = sessionData.session.access_token;
  tokenExpiry = now + (50 * 60 * 1000);
  
  console.log('✅ Token obtenido y cacheado');
  return cachedToken;
}

// Función para limpiar el caché cuando el usuario cierra sesión
export function clearTokenCache() {
  cachedToken = null;
  tokenExpiry = 0;
  console.log('🗑️ Token cache cleared');
}

// ==================== PASSWORD REQUESTS API ====================

/**
 * Obtener todas las solicitudes de contraseña (solo admin)
 */
export async function getPasswordRequests(): Promise<PasswordRequest[]> {
  try {
    console.log('📋 Obteniendo solicitudes de contraseña...');
    
    const token = await getAuthToken();
    console.log('✅ Token obtenido');
    
    const url = `${API_URL}/password-requests`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('📡 Respuesta:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }
      
      // Detectar si es un error de sesión/autenticación
      const isAuthError = errorData.message?.includes('JWT') || 
                          errorData.error?.includes('JWT') ||
                          errorData.code === 401;
      
      if (isAuthError) {
        // Error de sesión - log silencioso
        console.log('ℹ️ Sin sesión activa para cargar solicitudes');
        throw new Error('No hay sesión activa. Por favor, inicia sesión.');
      }
      
      // Error real - loguear detalles
      console.error('❌ Respuesta de error:', errorData);
      throw new Error(errorData.error || errorData.message || 'Error al obtener solicitudes');
    }
    
    const data = await response.json();
    const requests = data.requests || [];
    console.log(`✅ ${requests.length} solicitudes obtenidas`);
    
    return requests;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '';
    
    // Detectar si es un error de sesión
    const isSessionError = errorMessage.includes('No hay sesión') || 
                           errorMessage.includes('sesión ha expirado') ||
                           errorMessage.includes('inicia sesión');
    
    if (!isSessionError) {
      // Solo loguear errores reales, no de sesión
      console.error('❌ Error en getPasswordRequests:', error);
    }
    
    throw error;
  }
}

/**
 * Crear una nueva solicitud de contraseña (endpoint público)
 */
export async function createPasswordRequest(
  name: string,
  email: string,
  role: 'swimmer' | 'coach'
): Promise<PasswordRequest> {
    console.log('📝 Creando solicitud de acceso:', { name, email, role });
    
    // Usar la ruta PUBLIC que está confirmada en el servidor
    const publicAccessUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc/password-requests/create`;
    console.log('🌐 URL:', publicAccessUrl);
    
    const response = await fetch(publicAccessUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`, // ✅ Incluir auth header
      },
      body: JSON.stringify({ name, email, role }),
    });
    
    console.log('📡 Respuesta del servidor:', response.status, response.statusText);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `HTTP ${response.status}: ${response.statusText}` }));
      console.error('❌ Error del servidor:', error);
      throw new Error(error.error || `Error al crear solicitud (${response.status})`);
    }
    
    const data = await response.json();
    console.log('✅ Datos recibidos:', data);
    
    const request = data.request;
    console.log('✅ Solicitud creada exitosamente:', request.id);
    
    return request;
}

/**
 * Aprobar una solicitud de contraseña y crear cuenta de usuario (solo admin)
 */
export async function approvePasswordRequest(
  requestId: string
): Promise<{ email: string; password: string }> {
  try {
    const token = await getAuthToken();
    
    console.log('✅ Aprobando solicitud:', requestId);
    
    const response = await fetch(`${API_URL}/password-requests/${requestId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      
      // Si el usuario ya existe, lanzar error específico
      if (error.existingUser) {
        throw new Error('Ya existe un usuario con este correo electrónico.');
      }
      
      throw new Error(error.error || 'Error al aprobar solicitud');
    }
    
    const { credentials, message } = await response.json();
    
    console.log('✅ Solicitud aprobada exitosamente');
    console.log('⚠️ IMPORTANTE:', message);
    
    return credentials;
  } catch (error) {
    console.error('Error en approvePasswordRequest:', error);
    throw error;
  }
}

/**
 * Rechazar una solicitud de contraseña (solo admin)
 */
export async function rejectPasswordRequest(requestId: string): Promise<void> {
  try {
    const token = await getAuthToken();
    
    console.log('❌ Rechazando solicitud:', requestId);
    
    const response = await fetch(`${API_URL}/password-requests/${requestId}/reject`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al rechazar solicitud');
    }
    
    console.log('✅ Solicitud rechazada exitosamente');
  } catch (error) {
    console.error('Error en rejectPasswordRequest:', error);
    throw error;
  }
}

/**
 * Eliminar una solicitud de contraseña (solo admin)
 */
export async function deletePasswordRequest(requestId: string): Promise<void> {
  try {
    const token = await getAuthToken();
    
    console.log('🗑️ Eliminando solicitud:', requestId);
    
    const response = await fetch(`${API_URL}/password-requests/${requestId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al eliminar solicitud');
    }
    
    console.log('✅ Solicitud eliminada exitosamente');
  } catch (error) {
    console.error('Error en deletePasswordRequest:', error);
    throw error;
  }
}