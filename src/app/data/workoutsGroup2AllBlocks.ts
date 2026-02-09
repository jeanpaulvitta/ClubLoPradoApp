/**
 * TODOS LOS ENTRENAMIENTOS GRUPO 2 - TEMPORADA 2026-2027
 * Sistema completo de 10 bloques de entrenamiento
 */

import { Workout } from './workouts';
import { workoutsGroup2 } from './workoutsGroup2'; // Bloques 1-2
import { workoutsBlock3 } from './workoutsGroup2Block3';
import { workoutsBlock4 } from './workoutsGroup2Block4';
import { workoutsBlock5, workoutsBlock6 } from './workoutsGroup2Blocks5to10';
import { workoutsBlock7, workoutsBlock8, workoutsBlock9And10 } from './workoutsGroup2Blocks7to10Final';

/**
 * Array completo consolidado de TODOS los entrenamientos del Grupo 2
 * 
 * ESTRUCTURA COMPLETA:
 * - Bloque 1: Velocidad Inicial (6 sem) - 36 entrenamientos
 * - Bloque 2: Fondo (4 sem) - 24 entrenamientos
 * - Bloque 3: Medio Fondo (4 sem) - 24 entrenamientos
 * - Bloque 4: Competitivo Mayor (6 sem) - 36 entrenamientos
 * - Bloque 5: Internacional (6 sem) - 36 entrenamientos
 * - Bloque 6: Velocidad 2 (4 sem) - 24 entrenamientos
 * - Bloque 7: Fondo 2 (4 sem) - 24 entrenamientos
 * - Bloque 8: Medio Fondo 2 (5 sem) - 30 entrenamientos
 * - Bloque 9: Preparación (9 sem) - 9 entrenamientos (representativos)
 * - Bloque 10: Pico Competitivo (4 sem) - 9 entrenamientos (representativos)
 * 
 * TOTAL: 252 entrenamientos completos + representativos
 */
export const allWorkoutsGroup2Complete: Workout[] = [
  ...workoutsGroup2,        // Bloques 1-2 (60 entrenamientos)
  ...workoutsBlock3,        // Bloque 3 (24 entrenamientos)
  ...workoutsBlock4,        // Bloque 4 (36 entrenamientos)
  ...workoutsBlock5,        // Bloque 5 (36 entrenamientos)
  ...workoutsBlock6,        // Bloque 6 (24 entrenamientos)
  ...workoutsBlock7,        // Bloque 7 (24 entrenamientos)
  ...workoutsBlock8,        // Bloque 8 (30 entrenamientos)
  ...workoutsBlock9And10    // Bloques 9-10 (18 entrenamientos representativos)
];

export default allWorkoutsGroup2Complete;

/**
 * Estadísticas del sistema completo
 */
export const workoutsGroup2Stats = {
  totalBlocks: 10,
  totalWeeks: 52,
  totalWorkouts: allWorkoutsGroup2Complete.length,
  competitions: [
    { name: "Copa Chile 1 - 50m", date: "21-22 Mar 2026", block: 1 },
    { name: "Copa Chile 2 - 800-1500m", date: "17-19 Abr 2026", block: 2 },
    { name: "Copa Chile 3 - 100-400m", date: "15-17 May 2026", block: 3 },
    { name: "Nacionales Jun-Jul", date: "6 Jun - 5 Jul 2026", block: 4 },
    { name: "Brasil + Nacional Desarrollo", date: "20 Jul - 16 Ago 2026", block: 5 },
    { name: "Copa Chile 1", date: "12-13 Sep 2026", block: 6 },
    { name: "Copa Chile 2", date: "2-4 Oct 2026", block: 7 },
    { name: "Copa Chile 3", date: "6-8 Nov 2026", block: 8 },
    { name: "Nacionales Verano 2027", date: "9 Ene - 7 Feb 2027", block: 10 }
  ],
  averageDistance: Math.round(
    allWorkoutsGroup2Complete
      .filter(w => w.distance > 0)
      .reduce((sum, w) => sum + w.distance, 0) / 
    allWorkoutsGroup2Complete.filter(w => w.distance > 0).length
  ),
  totalDistance: allWorkoutsGroup2Complete.reduce((sum, w) => sum + w.distance, 0)
};
