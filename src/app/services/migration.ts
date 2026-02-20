/**
 * Servicio de migración de datos de localStorage a Supabase
 * 
 * NOTA: Este archivo ya no es necesario porque la aplicación
 * guarda todos los datos directamente en Supabase sin usar
 * localStorage como caché.
 * 
 * Se mantiene por compatibilidad con componentes existentes,
 * pero todas las funciones retornan valores vacíos o por defecto.
 */

interface MigrationResult {
  success: boolean;
  message: string;
  details?: any;
}

/**
 * Verifica si hay datos en localStorage que necesiten migración
 * DEPRECATED: Siempre retorna false porque ya no usamos localStorage para datos
 */
export function hasLegacyData(): boolean {
  return false;
}

/**
 * Obtiene estadísticas de localStorage
 * DEPRECATED: Siempre retorna objeto vacío
 */
export function getLocalStorageStats(): Record<string, number> {
  return {};
}

/**
 * Obtiene información de migración
 * DEPRECATED: Siempre retorna que no hay datos para migrar
 */
export function getMigrationInfo(): { hasLegacyData: boolean; stats: Record<string, number> } {
  return {
    hasLegacyData: false,
    stats: {}
  };
}

/**
 * Migra todos los datos de localStorage a Supabase
 * DEPRECATED: No hace nada porque ya no hay datos en localStorage
 */
export async function migrateAllDataToSupabase(accessToken: string): Promise<MigrationResult> {
  return {
    success: true,
    message: 'No hay datos para migrar. Todos los datos ya están en Supabase.',
    details: {
      migrated: 0,
      skipped: 0,
      errors: 0
    }
  };
}

/**
 * Limpia todos los datos antiguos de localStorage
 * DEPRECATED: No hace nada porque ya no hay datos en localStorage
 */
export function clearAllLegacyData(): void {
  console.log('✅ No hay datos antiguos para limpiar');
}

/**
 * Verifica la salud del backend
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || 
                     (window as any).__SUPABASE_PROJECT_ID__;
    
    if (!projectId) {
      console.warn('⚠️ Project ID no disponible');
      return false;
    }

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc/health`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.ok;
  } catch (error) {
    console.error('❌ Error checking backend health:', error);
    return false;
  }
}