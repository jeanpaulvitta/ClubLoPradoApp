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

async function getAuthToken(): Promise<string> {
  const { supabase } = await import('./supabaseClient');
  const { data: sessionData, error } = await supabase.auth.getSession();
  
  if (error || !sessionData.session) {
    throw new Error('No hay sesión activa. Por favor, inicia sesión.');
  }
  
  return sessionData.session.access_token;
}

// ==================== PASSWORD REQUESTS API ====================

/**
 * Obtener todas las solicitudes de contraseña (solo admin)
 */
export async function getPasswordRequests(): Promise<PasswordRequest[]> {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_URL}/password-requests`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al obtener solicitudes');
    }
    
    const { requests } = await response.json();
    return requests;
  } catch (error) {
    console.error('Error en getPasswordRequests:', error);
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
  try {
    console.log('📝 Creando solicitud de acceso:', { name, email, role });
    
    // Using explicit /create endpoint to avoid any routing conflicts with auth middleware
    const response = await fetch(`${API_URL}/password-requests/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
  } catch (error) {
    console.error('❌ Error en createPasswordRequest:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error desconocido al crear solicitud');
  }
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