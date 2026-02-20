/**
 * Utilidad para importar entrenamientos del Grupo 2 a la base de datos
 * 
 * Esta función permite cargar los entrenamientos predefinidos del archivo
 * workoutsGroup2.ts a la base de datos Supabase
 */

import allWorkoutsGroup2 from '../data/allWorkoutsGroup2';
import * as api from '../services/api';
import type { Workout } from '../data/swimmers';

/**
 * Importa todos los entrenamientos del Grupo 2 a la base de datos
 * 
 * IMPORTANTE: Esta función debe ejecutarse solo UNA VEZ por el administrador
 * para cargar los entrenamientos iniciales del Grupo 2
 * 
 * @returns Promise con el número de entrenamientos importados
 */
export async function importGroup2Workouts(): Promise<{
  success: number;
  failed: number;
  total: number;
  errors: string[];
}> {
  console.log('🏊‍♂️ Iniciando importación de entrenamientos Grupo 2...');
  console.log(`📊 Total de entrenamientos a importar: ${allWorkoutsGroup2.length}`);
  
  let successCount = 0;
  let failedCount = 0;
  const errors: string[] = [];
  
  // Verificar que todos los entrenamientos tengan el grupo correcto
  const invalidWorkouts = allWorkoutsGroup2.filter(w => w.group !== 2);
  if (invalidWorkouts.length > 0) {
    console.warn('⚠️ Advertencia: Algunos entrenamientos no tienen group: 2', invalidWorkouts.length);
  }
  
  // Importar entrenamientos uno por uno
  for (let i = 0; i < allWorkoutsGroup2.length; i++) {
    const workout = allWorkoutsGroup2[i];
    
    try {
      // Eliminar el ID para que la BD genere uno nuevo
      const { id, ...workoutData } = workout;
      
      // Asegurar que tenga group: 2
      const workoutToImport = {
        ...workoutData,
        group: 2 as 1 | 2 | "Ambos",
      };
      
      await api.addWorkout(workoutToImport);
      successCount++;
      
      // Log de progreso cada 10 entrenamientos
      if ((i + 1) % 10 === 0) {
        console.log(`✅ Progreso: ${i + 1}/${allWorkoutsGroup2.length} entrenamientos importados`);
      }
    } catch (error) {
      failedCount++;
      const errorMsg = `Fallo en entrenamiento ${i + 1} (${workout.date}): ${error instanceof Error ? error.message : 'Error desconocido'}`;
      errors.push(errorMsg);
      console.error(`❌ ${errorMsg}`);
    }
  }
  
  console.log('🎉 Importación completada!');
  console.log(`✅ Exitosos: ${successCount}`);
  console.log(`❌ Fallidos: ${failedCount}`);
  console.log(`📊 Total: ${allWorkoutsGroup2.length}`);
  
  return {
    success: successCount,
    failed: failedCount,
    total: allWorkoutsGroup2.length,
    errors,
  };
}

/**
 * Verifica si ya existen entrenamientos del Grupo 2 en la base de datos
 * 
 * @returns Promise con true si ya existen entrenamientos del Grupo 2
 */
export async function checkGroup2WorkoutsExist(): Promise<boolean> {
  try {
    const allWorkouts = await api.fetchWorkouts();
    const group2Workouts = allWorkouts.filter(w => w.group === 2);
    
    console.log(`📊 Entrenamientos Grupo 2 existentes en BD: ${group2Workouts.length}`);
    
    return group2Workouts.length > 0;
  } catch (error) {
    console.error('❌ Error verificando entrenamientos Grupo 2:', error);
    return false;
  }
}

/**
 * Elimina todos los entrenamientos del Grupo 2 de la base de datos
 * 
 * CUIDADO: Esta función es destructiva y eliminará TODOS los entrenamientos del Grupo 2
 * 
 * @returns Promise con el número de entrenamientos eliminados
 */
export async function deleteAllGroup2Workouts(): Promise<number> {
  console.log('⚠️ Eliminando todos los entrenamientos del Grupo 2...');
  
  try {
    const allWorkouts = await api.fetchWorkouts();
    const group2Workouts = allWorkouts.filter(w => w.group === 2);
    
    console.log(`📊 Entrenamientos Grupo 2 a eliminar: ${group2Workouts.length}`);
    
    let deletedCount = 0;
    
    for (const workout of group2Workouts) {
      if (workout.id) {
        try {
          await api.deleteWorkout(workout.id);
          deletedCount++;
        } catch (error) {
          console.error(`❌ Error eliminando entrenamiento ${workout.id}:`, error);
        }
      }
    }
    
    console.log(`✅ Eliminados ${deletedCount} entrenamientos del Grupo 2`);
    
    return deletedCount;
  } catch (error) {
    console.error('❌ Error eliminando entrenamientos Grupo 2:', error);
    return 0;
  }
}

/**
 * Obtiene estadísticas de los entrenamientos del Grupo 2 en la BD
 */
export async function getGroup2WorkoutsStats(): Promise<{
  total: number;
  byBloque: Record<string, number>;
  byWeek: Record<number, number>;
  totalDistance: number;
  averageDistance: number;
  totalDuration: number;
  averageDuration: number;
}> {
  try {
    const allWorkouts = await api.fetchWorkouts();
    const group2Workouts = allWorkouts.filter(w => w.group === 2);
    
    const stats = {
      total: group2Workouts.length,
      byBloque: {} as Record<string, number>,
      byWeek: {} as Record<number, number>,
      totalDistance: 0,
      averageDistance: 0,
      totalDuration: 0,
      averageDuration: 0,
    };
    
    group2Workouts.forEach(w => {
      // Por bloque
      const bloque = (w as any).bloque || w.mesociclo;
      if (bloque) {
        stats.byBloque[bloque] = (stats.byBloque[bloque] || 0) + 1;
      }
      
      // Por semana
      if (w.week) {
        stats.byWeek[w.week] = (stats.byWeek[w.week] || 0) + 1;
      }
      
      // Distancias y duraciones
      stats.totalDistance += w.distance || 0;
      stats.totalDuration += w.duration || 0;
    });
    
    stats.averageDistance = stats.total > 0 ? Math.round(stats.totalDistance / stats.total) : 0;
    stats.averageDuration = stats.total > 0 ? Math.round(stats.totalDuration / stats.total) : 0;
    
    return stats;
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas Grupo 2:', error);
    return {
      total: 0,
      byBloque: {},
      byWeek: {},
      totalDistance: 0,
      averageDistance: 0,
      totalDuration: 0,
      averageDuration: 0,
    };
  }
}