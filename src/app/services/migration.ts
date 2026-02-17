/**
 * Servicio de migración de datos de localStorage a Supabase
 * 
 * Este archivo maneja la migración de datos que puedan estar en localStorage
 * hacia el backend de Supabase, asegurando que toda la información esté
 * centralizada en el servidor.
 */

import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc`;

// Keys actuales de localStorage
const STORAGE_KEYS = {
  SWIMMERS: 'swimming_app_swimmers',
  COMPETITIONS: 'swimming_app_competitions',
  SWIMMER_COMPETITIONS: 'swimming_app_swimmer_competitions',
  WORKOUTS: 'swimming_app_workouts',
  CHALLENGES: 'swimming_app_challenges',
  HOLIDAYS: 'swimming_app_holidays',
  TEST_CONTROLS: 'swimming_app_test_controls',
  TEST_RESULTS: 'swimming_app_test_results',
  ATTENDANCE: 'swimming_app_attendance',
};

interface MigrationResult {
  success: boolean;
  message: string;
  details?: any;
}

/**
 * Verifica si hay datos en localStorage que necesiten migración
 */
export function hasLegacyData(): boolean {
  const allKeys = Object.values(STORAGE_KEYS);
  
  return allKeys.some(key => {
    const data = localStorage.getItem(key);
    if (!data) return false;
    
    try {
      const parsed = JSON.parse(data);
      // Verificar si hay datos reales (no solo arrays/objetos vacíos)
      if (Array.isArray(parsed)) return parsed.length > 0;
      if (typeof parsed === 'object') return Object.keys(parsed).length > 0;
      return true;
    } catch {
      return false;
    }
  });
}

/**
 * Obtiene estadísticas de datos en localStorage
 */
export function getLocalStorageStats() {
  const stats: Record<string, number> = {};
  
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        stats[name] = Array.isArray(parsed) ? parsed.length : (typeof parsed === 'object' ? Object.keys(parsed).length : 1);
      } catch {
        stats[name] = 0;
      }
    } else {
      stats[name] = 0;
    }
  });
  
  return stats;
}

/**
 * Migra todos los datos de localStorage al backend de Supabase
 */
export async function migrateAllDataToSupabase(accessToken: string): Promise<MigrationResult> {
  try {
    console.log('🔄 Iniciando migración de datos a Supabase...');
    
    const stats = getLocalStorageStats();
    console.log('📊 Datos encontrados en localStorage:', stats);
    
    if (!hasLegacyData()) {
      return {
        success: true,
        message: 'No hay datos para migrar',
        details: stats,
      };
    }
    
    const results = {
      swimmers: 0,
      competitions: 0,
      swimmerCompetitions: 0,
      workouts: 0,
      challenges: 0,
      holidays: 0,
      testControls: 0,
      testResults: 0,
      attendance: 0,
      errors: [] as string[],
    };
    
    // Migrar nadadores
    const swimmersData = localStorage.getItem(STORAGE_KEYS.SWIMMERS);
    if (swimmersData) {
      try {
        const swimmers = JSON.parse(swimmersData);
        if (Array.isArray(swimmers) && swimmers.length > 0) {
          console.log(`🏊 Migrando ${swimmers.length} nadadores...`);
          
          for (const swimmer of swimmers) {
            try {
              const response = await fetch(`${API_URL}/swimmers`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(swimmer),
              });
              
              if (response.ok) {
                results.swimmers++;
              } else {
                const error = await response.text();
                results.errors.push(`Error al migrar nadador ${swimmer.name}: ${error}`);
              }
            } catch (error) {
              results.errors.push(`Error al migrar nadador ${swimmer.name}: ${error}`);
            }
          }
        }
      } catch (error) {
        results.errors.push(`Error al procesar nadadores: ${error}`);
      }
    }
    
    // Migrar competencias
    const competitionsData = localStorage.getItem(STORAGE_KEYS.COMPETITIONS);
    if (competitionsData) {
      try {
        const competitions = JSON.parse(competitionsData);
        if (Array.isArray(competitions) && competitions.length > 0) {
          console.log(`🏆 Migrando ${competitions.length} competencias...`);
          
          for (const competition of competitions) {
            try {
              const response = await fetch(`${API_URL}/competitions`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(competition),
              });
              
              if (response.ok) {
                results.competitions++;
              } else {
                const error = await response.text();
                results.errors.push(`Error al migrar competencia ${competition.name}: ${error}`);
              }
            } catch (error) {
              results.errors.push(`Error al migrar competencia: ${error}`);
            }
          }
        }
      } catch (error) {
        results.errors.push(`Error al procesar competencias: ${error}`);
      }
    }
    
    // Migrar entrenamientos
    const workoutsData = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    if (workoutsData) {
      try {
        const workouts = JSON.parse(workoutsData);
        if (Array.isArray(workouts) && workouts.length > 0) {
          console.log(`💪 Migrando ${workouts.length} entrenamientos...`);
          
          for (const workout of workouts) {
            try {
              const response = await fetch(`${API_URL}/workouts`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(workout),
              });
              
              if (response.ok) {
                results.workouts++;
              } else {
                const error = await response.text();
                results.errors.push(`Error al migrar entrenamiento: ${error}`);
              }
            } catch (error) {
              results.errors.push(`Error al migrar entrenamiento: ${error}`);
            }
          }
        }
      } catch (error) {
        results.errors.push(`Error al procesar entrenamientos: ${error}`);
      }
    }
    
    // Migrar días feriados
    const holidaysData = localStorage.getItem(STORAGE_KEYS.HOLIDAYS);
    if (holidaysData) {
      try {
        const holidays = JSON.parse(holidaysData);
        if (Array.isArray(holidays) && holidays.length > 0) {
          console.log(`📅 Migrando ${holidays.length} días feriados...`);
          
          for (const holiday of holidays) {
            try {
              const response = await fetch(`${API_URL}/holidays`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(holiday),
              });
              
              if (response.ok) {
                results.holidays++;
              } else {
                const error = await response.text();
                results.errors.push(`Error al migrar feriado: ${error}`);
              }
            } catch (error) {
              results.errors.push(`Error al migrar feriado: ${error}`);
            }
          }
        }
      } catch (error) {
        results.errors.push(`Error al procesar feriados: ${error}`);
      }
    }
    
    // Migrar controles de prueba
    const testControlsData = localStorage.getItem(STORAGE_KEYS.TEST_CONTROLS);
    if (testControlsData) {
      try {
        const testControls = JSON.parse(testControlsData);
        if (Array.isArray(testControls) && testControls.length > 0) {
          console.log(`📝 Migrando ${testControls.length} controles de prueba...`);
          
          for (const control of testControls) {
            try {
              const response = await fetch(`${API_URL}/test-controls`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(control),
              });
              
              if (response.ok) {
                results.testControls++;
              } else {
                const error = await response.text();
                results.errors.push(`Error al migrar control de prueba: ${error}`);
              }
            } catch (error) {
              results.errors.push(`Error al migrar control de prueba: ${error}`);
            }
          }
        }
      } catch (error) {
        results.errors.push(`Error al procesar controles de prueba: ${error}`);
      }
    }
    
    // Migrar resultados de prueba
    const testResultsData = localStorage.getItem(STORAGE_KEYS.TEST_RESULTS);
    if (testResultsData) {
      try {
        const testResults = JSON.parse(testResultsData);
        if (Array.isArray(testResults) && testResults.length > 0) {
          console.log(`🎯 Migrando ${testResults.length} resultados de prueba...`);
          
          for (const result of testResults) {
            try {
              const response = await fetch(`${API_URL}/test-results`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(result),
              });
              
              if (response.ok) {
                results.testResults++;
              } else {
                const error = await response.text();
                results.errors.push(`Error al migrar resultado de prueba: ${error}`);
              }
            } catch (error) {
              results.errors.push(`Error al migrar resultado de prueba: ${error}`);
            }
          }
        }
      } catch (error) {
        results.errors.push(`Error al procesar resultados de prueba: ${error}`);
      }
    }
    
    // Migrar asistencia
    const attendanceData = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (attendanceData) {
      try {
        const attendance = JSON.parse(attendanceData);
        const attendanceArray = Array.isArray(attendance) ? attendance : Object.values(attendance);
        
        if (attendanceArray.length > 0) {
          console.log(`✅ Migrando ${attendanceArray.length} registros de asistencia...`);
          
          for (const record of attendanceArray) {
            try {
              const response = await fetch(`${API_URL}/attendance`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(record),
              });
              
              if (response.ok) {
                results.attendance++;
              } else {
                const error = await response.text();
                results.errors.push(`Error al migrar asistencia: ${error}`);
              }
            } catch (error) {
              results.errors.push(`Error al migrar asistencia: ${error}`);
            }
          }
        }
      } catch (error) {
        results.errors.push(`Error al procesar asistencia: ${error}`);
      }
    }
    
    console.log('✅ Migración completada:', results);
    
    const totalMigrated = results.swimmers + results.competitions + results.workouts + 
                          results.holidays + results.testControls + results.testResults + results.attendance;
    
    if (totalMigrated === 0) {
      return {
        success: false,
        message: 'No se pudo migrar ningún dato',
        details: results,
      };
    }
    
    return {
      success: true,
      message: `✅ Migración exitosa: ${totalMigrated} registros migrados`,
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
 * Limpia todos los datos de localStorage después de una migración exitosa
 */
export function clearAllLegacyData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log('✅ Todos los datos de localStorage han sido eliminados');
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