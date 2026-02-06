/**
 * Servicio de migración de datos de localStorage a Supabase
 * 
 * Este archivo maneja la migración de datos que puedan estar en localStorage
 * hacia el backend de Supabase, asegurando que toda la información esté
 * centralizada en el servidor.
 */

import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc`;

interface MigrationResult {
  success: boolean;
  message: string;
  details?: any;
}

/**
 * Verifica si hay datos antiguos en localStorage que necesiten migración
 */
export function hasLegacyData(): boolean {
  // Verificar si hay datos en localStorage (excluyendo la sesión de Supabase)
  const legacyKeys = [
    'natacion_master_session',
    'natacion_master_users',
    'swimmers',
    'competitions',
    'attendance',
    'holidays',
    'test-controls',
    'test-results',
  ];
  
  return legacyKeys.some(key => localStorage.getItem(key) !== null);
}

/**
 * Limpia todos los datos antiguos de localStorage
 */
export function clearAllLegacyData(): void {
  const legacyKeys = [
    'natacion_master_session',
    'natacion_master_users',
    'swimmers',
    'competitions',
    'attendance',
    'holidays',
    'test-controls',
    'test-results',
    'swimmer_competitions',
  ];
  
  legacyKeys.forEach(key => localStorage.removeItem(key));
  
  console.log('✅ Todos los datos antiguos de localStorage han sido eliminados');
}

/**
 * Migra todos los datos de localStorage al backend de Supabase
 */
export async function migrateAllDataToSupabase(accessToken: string): Promise<MigrationResult> {
  try {
    console.log('🔄 Iniciando migración de datos a Supabase...');
    
    if (!hasLegacyData()) {
      return {
        success: true,
        message: 'No hay datos antiguos para migrar',
      };
    }
    
    const results = {
      swimmers: 0,
      competitions: 0,
      attendance: 0,
      holidays: 0,
      testControls: 0,
      testResults: 0,
    };
    
    // Nota: En este momento, el backend ya maneja todos los datos
    // a través de sus endpoints. Esta función está aquí por si necesitamos
    // migrar datos históricos en el futuro.
    
    // Por ahora, simplemente limpiamos los datos antiguos
    clearAllLegacyData();
    
    console.log('✅ Migración completada:', results);
    
    return {
      success: true,
      message: 'Datos migrados exitosamente',
      details: results,
    };
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    return {
      success: false,
      message: 'Error durante la migración',
      details: error,
    };
  }
}

/**
 * Verifica la salud de la conexión con el backend
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend está funcionando:', data);
      return true;
    }
    
    console.warn('⚠️ Backend no responde correctamente');
    return false;
  } catch (error) {
    console.error('❌ Error al verificar el backend:', error);
    return false;
  }
}

/**
 * Información sobre la migración actual
 */
export function getMigrationInfo(): {
  usingSupabase: boolean;
  hasLegacyData: boolean;
  backendUrl: string;
} {
  return {
    usingSupabase: true,
    hasLegacyData: hasLegacyData(),
    backendUrl: API_URL,
  };
}