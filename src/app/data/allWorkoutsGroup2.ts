/**
 * ENTRENAMIENTOS COMPLETOS GRUPO 2
 * 
 * Este archivo combina todos los entrenamientos del Grupo 2 (Bloques 1-10)
 * desde múltiples archivos fuente
 */

import allWorkoutsGroup2Complete, { workoutsGroup2Stats } from './workoutsGroup2AllBlocks';
import type { Workout } from './workouts';

/**
 * Array completo de entrenamientos del Grupo 2
 * Incluye todos los 10 bloques de la temporada 2026-2027
 * 
 * Total: 252+ entrenamientos
 * - Bloques 1-2: 60 entrenamientos
 * - Bloques 3-10: 192+ entrenamientos
 */
export const allWorkoutsGroup2: Workout[] = allWorkoutsGroup2Complete;

export { workoutsGroup2Stats };

export default allWorkoutsGroup2;