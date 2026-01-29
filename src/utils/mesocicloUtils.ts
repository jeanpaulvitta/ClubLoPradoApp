// Utilidades para calcular mesociclos según estructura de temporada

export interface MesocicloPhase {
  name: string;
  weeks: number;
  description: string;
}

export const SEASON_STRUCTURE_GROUP1: MesocicloPhase[] = [
  { name: "Base", weeks: 6, description: "Construcción de resistencia aeróbica y técnica fundamental" },
  { name: "Desarrollo", weeks: 6, description: "Aumento progresivo de volumen e intensidad" },
  { name: "Pre-competitivo", weeks: 4, description: "Trabajo específico de competencia y velocidad" },
  { name: "Competitivo", weeks: 4, description: "Puesta a punto y campeonatos" },
];

export const SEASON_STRUCTURE_GROUP2: MesocicloPhase[] = [
  { name: "Base", weeks: 5, description: "Construcción de resistencia aeróbica y capacidad" },
  { name: "Desarrollo", weeks: 5, description: "Aumento de intensidad, velocidad y potencia" },
  { name: "Pre-competitivo", weeks: 5, description: "Trabajo específico de competencia y ritmo de carrera" },
  { name: "Competitivo", weeks: 5, description: "Puesta a punto, tapering y campeonato" },
];

/**
 * Determina el mesociclo correspondiente a una semana específica
 * @param week Número de semana (1-20)
 * @param structure Estructura de temporada (group1 o group2)
 * @returns Nombre del mesociclo
 */
export function getMesocicloFromWeek(week: number, structure: "group1" | "group2"): string {
  const phases = structure === "group1" ? SEASON_STRUCTURE_GROUP1 : SEASON_STRUCTURE_GROUP2;
  
  let accumulatedWeeks = 0;
  
  for (const phase of phases) {
    accumulatedWeeks += phase.weeks;
    if (week <= accumulatedWeeks) {
      return phase.name;
    }
  }
  
  // Si la semana está fuera del rango, devolver el último mesociclo
  return phases[phases.length - 1].name;
}

/**
 * Obtiene el rango de semanas para un mesociclo específico
 * @param mesocicloName Nombre del mesociclo
 * @param structure Estructura de temporada
 * @returns Objeto con startWeek y endWeek
 */
export function getMesocicloWeekRange(
  mesocicloName: string,
  structure: "group1" | "group2"
): { startWeek: number; endWeek: number } {
  const phases = structure === "group1" ? SEASON_STRUCTURE_GROUP1 : SEASON_STRUCTURE_GROUP2;
  
  let accumulatedWeeks = 0;
  
  for (const phase of phases) {
    const startWeek = accumulatedWeeks + 1;
    const endWeek = accumulatedWeeks + phase.weeks;
    
    if (phase.name === mesocicloName) {
      return { startWeek, endWeek };
    }
    
    accumulatedWeeks += phase.weeks;
  }
  
  // Si no se encuentra, devolver las primeras semanas
  return { startWeek: 1, endWeek: phases[0].weeks };
}

/**
 * Obtiene el total de semanas en la temporada
 * @param structure Estructura de temporada
 * @returns Número total de semanas
 */
export function getTotalWeeks(structure: "group1" | "group2"): number {
  const phases = structure === "group1" ? SEASON_STRUCTURE_GROUP1 : SEASON_STRUCTURE_GROUP2;
  return phases.reduce((sum, phase) => sum + phase.weeks, 0);
}

/**
 * Obtiene información completa de un mesociclo
 * @param mesocicloName Nombre del mesociclo
 * @param structure Estructura de temporada
 * @returns Información del mesociclo
 */
export function getMesocicloInfo(mesocicloName: string, structure: "group1" | "group2") {
  const phases = structure === "group1" ? SEASON_STRUCTURE_GROUP1 : SEASON_STRUCTURE_GROUP2;
  const phase = phases.find((p) => p.name === mesocicloName);
  
  if (!phase) {
    return phases[0]; // Default al primero si no se encuentra
  }
  
  const weekRange = getMesocicloWeekRange(mesocicloName, structure);
  
  return {
    ...phase,
    ...weekRange,
  };
}
