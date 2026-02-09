import { Workout } from './workouts';

/**
 * BLOQUES 5-10 DEL GRUPO 2
 * Este archivo contiene los entrenamientos de los bloques finales de la temporada
 */

// BLOQUE 5: INTERNACIONAL (6 semanas, 36 entrenamientos)
// Objetivo: Brasil + Nacional Desarrollo (20 Jul - 16 Ago 2026)
export const workoutsBlock5: Workout[] = [
  // SEMANA 21 (29 Jun - 4 Jul) - POST-NACIONALES
  {
    week: 21, date: "29 de junio", day: "Lunes", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 4500, duration: 90,
    warmup: "900m (600 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 14 x 75m drills suaves descanso 20s - Z2",
      "Serie 2 - Aeróbico: 8 x 300m crol ritmo fácil descanso 35s - Z2",
      "Serie 3 - Velocidad: 10 x 100m progresivo descanso 30s - Z3",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Patada: 10 x 75m patada descanso 25s - Z2"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media", focus: "Recuperación activa", group: 2
  },
  {
    week: 21, date: "30 de junio", day: "Martes", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 5000, duration: 100,
    warmup: "1000m (600 crol, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 16 x 50m técnica 4 estilos descanso 15s - Z2",
      "Serie 2 - Construcción: 6 x 400m ritmo progresivo descanso 45s - Z2-Z3",
      "Serie 3 - Velocidad: 12 x 100m fuerte descanso 30s - Z4",
      "Serie 4 - Aeróbico: 1 x 1200m crol - Z2",
      "Serie 5 - Patada: 10 x 100m patada descanso 25s - Z3"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Reconstrucción", group: 2
  },
  {
    week: 21, date: "1 de julio", day: "Miércoles", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 5200, duration: 105,
    warmup: "1000m (600 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 12 x 100m drills avanzados descanso 20s - Z2",
      "Serie 2 - Umbral: 8 x 300m ritmo fuerte descanso 35s - Z3",
      "Serie 3 - VO2max: 16 x 100m muy fuerte descanso 25s - Z4",
      "Serie 4 - Resistencia: 1 x 1200m pull buoy - Z2",
      "Serie 5 - Velocidad: 10 x 50m sprint descanso 40s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Umbral e intensidad", group: 2
  },
  {
    week: 21, date: "2 de julio", day: "Jueves", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 5400, duration: 110,
    warmup: "1100m (700 crol, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 14 x 75m técnica por estilo descanso 20s - Z2",
      "Serie 2 - Serie mixta: 4 x 500m ritmo progresivo descanso 50s - Z2-Z3",
      "Serie 3 - Velocidad: 12 x 100m sprint fuerte descanso 30s - Z4",
      "Serie 4 - Aeróbico: 1 x 1500m crol - Z2",
      "Serie 5 - Patada: 12 x 75m patada descanso 25s - Z3"
    ],
    cooldown: "700m (500 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Volumen y velocidad", group: 2
  },
  {
    week: 21, date: "3 de julio", day: "Viernes", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 4800, duration: 95,
    warmup: "900m (600 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 12 x 75m drills económicos descanso 20s - Z2",
      "Serie 2 - Race pace: 6 x 350m ritmo competencia descanso 40s - Z3",
      "Serie 3 - Velocidad: 12 x 75m sprint fuerte descanso 30s - Z4-Z5",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Sprints: 8 x 50m máxima velocidad descanso 45s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Ritmo de carrera", group: 2
  },
  {
    week: 21, date: "4 de julio", day: "Sábado", schedule: "AM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 5600, duration: 115,
    warmup: "1100m (700 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 16 x 75m drills 4 estilos descanso 20s - Z2",
      "Serie 2 - Test 400m: 4 x 400m máximo esfuerzo descanso 90s - Z5",
      "Serie 3 - Umbral: 12 x 200m ritmo fuerte descanso 30s - Z3",
      "Serie 4 - Aeróbico: 1 x 1500m pull buoy - Z2",
      "Serie 5 - Patada: 12 x 100m patada fuerte descanso 25s - Z4"
    ],
    cooldown: "700m (500 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Test 400m", group: 2
  },

  // SEMANA 22 (6-11 Jul) - INTENSIFICACIÓN
  {
    week: 22, date: "6 de julio", day: "Lunes", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 5200, duration: 105,
    warmup: "1000m (600 crol, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 14 x 100m técnica perfecta descanso 20s - Z2",
      "Serie 2 - Pirámide: 200-300-400-500-400-300-200m descanso 30s - Z3-Z4",
      "Serie 3 - Velocidad: 10 x 100m sprint fuerte descanso 30s - Z4",
      "Serie 4 - Resistencia: 1 x 1200m pull buoy - Z2",
      "Serie 5 - Patada: 10 x 100m patada descanso 25s - Z3"
    ],
    cooldown: "700m (500 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Pirámide progresiva", group: 2
  },
  {
    week: 22, date: "7 de julio", day: "Martes", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 5600, duration: 115,
    warmup: "1100m (700 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 16 x 50m drills 4 estilos descanso 15s - Z2",
      "Serie 2 - Umbral máximo: 10 x 350m ritmo muy fuerte descanso 40s - Z3-Z4",
      "Serie 3 - VO2max: 16 x 100m máxima intensidad descanso 25s - Z4",
      "Serie 4 - Aeróbico: 1 x 1500m crol - Z2",
      "Serie 5 - Velocidad: 10 x 50m sprint descanso 45s - Z5"
    ],
    cooldown: "700m (500 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Umbral máximo", group: 2
  },
  {
    week: 22, date: "8 de julio", day: "Miércoles", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 5400, duration: 110,
    warmup: "1000m (600 crol, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 12 x 100m técnica económica descanso 20s - Z2",
      "Serie 2 - Broken 400m: 6 x (4 x 100m) ritmo 400m descanso 10s/45s - Z3-Z4",
      "Serie 3 - Velocidad: 12 x 100m sprint fuerte descanso 30s - Z4",
      "Serie 4 - Resistencia: 1 x 1200m pull buoy - Z2",
      "Serie 5 - Patada: 10 x 100m patada fuerte descanso 25s - Z4"
    ],
    cooldown: "700m (500 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Broken 400m", group: 2
  },
  {
    week: 22, date: "9 de julio", day: "Jueves", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 5800, duration: 120,
    warmup: "1200m (800 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 16 x 75m drills por estilo descanso 20s - Z2",
      "Serie 2 - Serie larga: 3 x 800m ritmo fuerte descanso 60s - Z3",
      "Serie 3 - Descensos: 8 x 200m descendente descanso 30s - Z3-Z4",
      "Serie 4 - Aeróbico: 1 x 1500m crol - Z2",
      "Serie 5 - Patada: 12 x 100m patada descanso 25s - Z3"
    ],
    cooldown: "800m (600 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Series largas", group: 2
  },
  {
    week: 22, date: "10 de julio", day: "Viernes", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 5000, duration: 100,
    warmup: "900m (600 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 12 x 75m técnica perfecta descanso 20s - Z2",
      "Serie 2 - Race pace: 8 x 300m ritmo competencia descanso 40s - Z3",
      "Serie 3 - Velocidad: 12 x 100m fuerte descanso 30s - Z4",
      "Serie 4 - Resistencia: 1 x 1200m pull buoy - Z2",
      "Serie 5 - Sprints: 8 x 50m máxima velocidad descanso 45s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Ritmo de competencia", group: 2
  },
  {
    week: 22, date: "11 de julio", day: "Sábado", schedule: "AM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 6000, duration: 125,
    warmup: "1200m (800 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 16 x 100m drills perfectos descanso 20s - Z2",
      "Serie 2 - Test 200m: 8 x 200m máximo esfuerzo descanso 60s - Z5",
      "Serie 3 - Umbral: 12 x 200m ritmo fuerte descanso 30s - Z3",
      "Serie 4 - Aeróbico: 1 x 1500m pull buoy - Z2",
      "Serie 5 - Patada: 12 x 100m patada fuerte descanso 25s - Z4"
    ],
    cooldown: "800m (600 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Test 200m", group: 2
  },

  // SEMANA 23 (13-18 Jul) - MANTENIMIENTO ALTO
  {
    week: 23, date: "13 de julio", day: "Lunes", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 5400, duration: 110,
    warmup: "1000m (600 crol, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 14 x 100m drills variados descanso 20s - Z2",
      "Serie 2 - IM: 4 x 400m medley individual descanso 50s - Z3",
      "Serie 3 - Velocidad: 12 x 100m fuerte descanso 30s - Z4",
      "Serie 4 - Resistencia: 1 x 1500m pull buoy - Z2",
      "Serie 5 - Patada: 12 x 75m patada por estilo descanso 25s - Z3"
    ],
    cooldown: "700m (500 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Medley individual", group: 2
  },
  {
    week: 23, date: "14 de julio", day: "Martes", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 5600, duration: 115,
    warmup: "1100m (700 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Drills: 16 x 50m técnica avanzada descanso 15s - Z2",
      "Serie 2 - Ladder: 100-200-300-400-500-400-300-200-100m descanso 30s - Z3-Z4",
      "Serie 3 - VO2max: 20 x 75m muy fuerte descanso 20s - Z4",
      "Serie 4 - Aeróbico: 1 x 1200m crol - Z2",
      "Serie 5 - Sprints: 10 x 50m máxima velocidad descanso 45s - Z5"
    ],
    cooldown: "700m (500 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Ladder extendido", group: 2
  },
  {
    week: 23, date: "15 de julio", day: "Miércoles", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 5200, duration: 105,
    warmup: "1000m (600 crol, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 12 x 100m técnica perfecta descanso 20s - Z2",
      "Serie 2 - 300m ritmo: 8 x 300m ritmo carrera descanso 40s - Z3",
      "Serie 3 - Paracaídas: 10 x 100m con resistencia descanso 35s - Z4",
      "Serie 4 - Resistencia: 1 x 1200m pull buoy - Z2",
      "Serie 5 - Patada: 10 x 100m patada fuerte descanso 25s - Z4"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Ritmo 300m", group: 2
  },
  {
    week: 23, date: "16 de julio", day: "Jueves", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 5800, duration: 120,
    warmup: "1100m (700 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Drills: 14 x 100m técnica por estilo descanso 20s - Z2",
      "Serie 2 - Umbral: 10 x 350m ritmo muy fuerte descanso 40s - Z3-Z4",
      "Serie 3 - Velocidad: 16 x 75m sprint descanso 25s - Z4-Z5",
      "Serie 4 - Aeróbico: 1 x 1500m crol - Z2",
      "Serie 5 - Patada: 12 x 100m patada descanso 25s - Z3"
    ],
    cooldown: "700m (500 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Umbral máximo", group: 2
  },
  {
    week: 23, date: "17 de julio", day: "Viernes", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 4800, duration: 95,
    warmup: "900m (600 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 12 x 75m drills económicos descanso 20s - Z2",
      "Serie 2 - Ritmo mixto: 6 x 300m (odd: 100m, even: 400m pace) descanso 40s - Z3-Z4",
      "Serie 3 - Velocidad: 12 x 100m fuerte descanso 30s - Z4",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Sprints: 8 x 50m sprint descanso 45s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Ritmo mixto", group: 2
  },
  {
    week: 23, date: "18 de julio", day: "Sábado", schedule: "AM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 5800, duration: 120,
    warmup: "1100m (700 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 16 x 100m drills perfectos descanso 20s - Z2",
      "Serie 2 - Test 100m: 10 x 100m máximo esfuerzo descanso 90s - Z5",
      "Serie 3 - Umbral: 12 x 200m ritmo fuerte descanso 30s - Z3",
      "Serie 4 - Aeróbico: 1 x 1500m pull buoy - Z2",
      "Serie 5 - Patada: 12 x 100m patada fuerte descanso 25s - Z4"
    ],
    cooldown: "800m (600 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Test 100m", group: 2
  },

  // SEMANA 24 (20-25 Jul) - TAPER BRASIL
  {
    week: 24, date: "20 de julio", day: "Lunes", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 5000, duration: 100,
    warmup: "900m (600 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 12 x 100m drills económicos descanso 20s - Z2",
      "Serie 2 - Aeróbico: 6 x 400m crol ritmo moderado descanso 45s - Z2",
      "Serie 3 - Velocidad: 10 x 100m fuerte descanso 30s - Z4",
      "Serie 4 - Resistencia: 1 x 1200m pull buoy - Z2",
      "Serie 5 - Patada: 10 x 100m patada descanso 25s - Z2-Z3"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media", focus: "Reducción volumen", group: 2
  },
  {
    week: 24, date: "21 de julio", day: "Martes", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 5200, duration: 105,
    warmup: "1000m (600 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Drills: 14 x 75m técnica impecable descanso 20s - Z2",
      "Serie 2 - Race pace: 4 x 400m ritmo competencia descanso 60s - Z3",
      "Serie 3 - Velocidad: 10 x 100m sprint controlado descanso 35s - Z4",
      "Serie 4 - Aeróbico: 1 x 1200m crol fácil - Z2",
      "Serie 5 - Activación: 8 x 50m sprint descanso 45s - Z4-Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Ritmo competencia", group: 2
  },
  {
    week: 24, date: "22 de julio", day: "Miércoles", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 4600, duration: 90,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 10 x 100m drills suaves descanso 25s - Z2",
      "Serie 2 - Aeróbico: 5 x 400m crol ritmo fácil descanso 45s - Z2",
      "Serie 3 - Velocidad: 12 x 75m fuerte descanso 30s - Z3-Z4",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Patada: 8 x 100m patada descanso 25s - Z2"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media", focus: "Recuperación activa", group: 2
  },
  {
    week: 24, date: "23 de julio", day: "Jueves", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 4800, duration: 95,
    warmup: "900m (600 crol, 300 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 12 x 75m drills impecables descanso 20s - Z2",
      "Serie 2 - Simulación: 4 x 300m + 4 x 100m ritmo carrera descanso 45s/30s - Z3-Z4",
      "Serie 3 - Velocidad: 10 x 100m sprint controlado descanso 35s - Z4",
      "Serie 4 - Aeróbico: 1 x 1000m crol suave - Z2",
      "Serie 5 - Activación: 6 x 50m sprint descanso 60s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Simulación carrera", group: 2
  },
  {
    week: 24, date: "24 de julio", day: "Viernes", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 3800, duration: 75,
    warmup: "800m (500 crol muy suave, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Activación: 10 x 75m técnica perfecta descanso 25s - Z2",
      "Serie 2 - Velocidad: 4 x 200m ritmo moderado descanso 45s - Z3",
      "Serie 3 - Sprints: 8 x 50m sprint descanso 60s - Z4",
      "Serie 4 - Aeróbico: 1 x 800m crol muy suave - Z1",
      "Serie 5 - Activación: 6 x 50m sprint controlado descanso 90s - Z4"
    ],
    cooldown: "600m (400 crol + 200 espalda muy suave) Z1",
    intensity: "Media", focus: "Pre-competencia internacional", group: 2
  },
  // 25-31 Jul: COMPETENCIA BRASIL
  {
    week: 24, date: "25 de julio", day: "Sábado", schedule: "AM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 0, duration: 0,
    warmup: "Competencia Internacional - Brasil",
    mainSet: ["DÍA DE COMPETENCIA - Competencia Internacional Brasil"],
    cooldown: "Recuperación post-competencia",
    intensity: "Competencia", focus: "Competencia Brasil",
    isChallenge: true, challengeName: "Internacional Brasil", group: 2
  },

  // SEMANA 25 (27 Jul - 1 Ago) - COMPETENCIA ACTIVA BRASIL
  {
    week: 25, date: "27 de julio", day: "Lunes", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 3500, duration: 70,
    warmup: "800m (500 crol suave, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Recuperación: 10 x 75m técnica suave descanso 30s - Z1-Z2",
      "Serie 2 - Aeróbico: 6 x 250m crol ritmo fácil descanso 40s - Z2",
      "Serie 3 - Activación: 8 x 75m progresivo descanso 30s - Z3",
      "Serie 4 - Resistencia: 1 x 800m pull buoy - Z2",
      "Serie 5 - Velocidad: 6 x 50m sprint descanso 60s - Z4"
    ],
    cooldown: "600m (400 crol + 200 espalda muy suave) Z1",
    intensity: "Media", focus: "Recuperación entre competencias", group: 2
  },
  {
    week: 25, date: "28 de julio", day: "Martes", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 3800, duration: 75,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 10 x 100m drills suaves descanso 25s - Z2",
      "Serie 2 - Aeróbico: 6 x 250m crol ritmo fácil descanso 35s - Z2",
      "Serie 3 - Activación: 10 x 75m progresivo descanso 30s - Z3",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Velocidad: 8 x 50m sprint descanso 45s - Z4"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media", focus: "Mantenimiento activo", group: 2
  },
  {
    week: 25, date: "29 de julio", day: "Miércoles", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 4000, duration: 80,
    warmup: "900m (600 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 12 x 75m técnica perfecta descanso 20s - Z2",
      "Serie 2 - Race prep: 4 x 300m ritmo competencia descanso 50s - Z3",
      "Serie 3 - Velocidad: 10 x 75m fuerte descanso 30s - Z4",
      "Serie 4 - Aeróbico: 1 x 1000m crol - Z2",
      "Serie 5 - Sprints: 8 x 50m máxima velocidad descanso 60s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Preparación finales", group: 2
  },
  {
    week: 25, date: "30 de julio", day: "Jueves", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 3600, duration: 70,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 10 x 75m drills económicos descanso 25s - Z2",
      "Serie 2 - Aeróbico: 6 x 250m crol ritmo moderado descanso 35s - Z2",
      "Serie 3 - Activación: 8 x 100m progresivo descanso 30s - Z3",
      "Serie 4 - Resistencia: 1 x 800m pull buoy - Z2",
      "Serie 5 - Velocidad: 6 x 50m sprint descanso 60s - Z4"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media", focus: "Sesión ligera", group: 2
  },
  {
    week: 25, date: "31 de julio", day: "Viernes", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 3200, duration: 65,
    warmup: "700m (500 crol muy suave, 200 técnica) Z1",
    mainSet: [
      "Serie 1 - Activación: 8 x 75m técnica perfecta descanso 30s - Z2",
      "Serie 2 - Velocidad: 6 x 200m ritmo moderado descanso 45s - Z2-Z3",
      "Serie 3 - Sprints: 6 x 50m sprint descanso 60s - Z4",
      "Serie 4 - Aeróbico: 1 x 600m crol muy suave - Z1",
      "Serie 5 - Activación: 4 x 50m sprint controlado descanso 90s - Z4"
    ],
    cooldown: "600m (400 crol + 200 espalda muy suave) Z1",
    intensity: "Media", focus: "Pre-finales Brasil", group: 2
  },
  {
    week: 25, date: "1 de agosto", day: "Sábado", schedule: "AM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 0, duration: 0,
    warmup: "Competencia Internacional - Brasil (Finales)",
    mainSet: ["DÍA DE COMPETENCIA - Competencia Internacional Brasil - Finales"],
    cooldown: "Recuperación post-competencia",
    intensity: "Competencia", focus: "Brasil - Finales",
    isChallenge: true, challengeName: "Internacional Brasil", group: 2
  },

  // SEMANA 26 (3-8 Ago) - NACIONAL DESARROLLO + RECUPERACIÓN
  {
    week: 26, date: "3 de agosto", day: "Lunes", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 3600, duration: 70,
    warmup: "800m (500 crol suave, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Recuperación: 12 x 75m técnica muy suave descanso 30s - Z1-Z2",
      "Serie 2 - Aeróbico: 6 x 250m crol ritmo muy fácil descanso 40s - Z2",
      "Serie 3 - Activación: 8 x 75m progresivo descanso 30s - Z2-Z3",
      "Serie 4 - Resistencia: 1 x 800m pull buoy - Z2",
      "Serie 5 - Patada: 8 x 75m patada suave descanso 30s - Z2"
    ],
    cooldown: "600m (400 crol + 200 espalda muy suave) Z1",
    intensity: "Media", focus: "Recuperación post-Brasil", group: 2
  },
  {
    week: 26, date: "4 de agosto", day: "Martes", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 4000, duration: 80,
    warmup: "900m (600 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 12 x 75m drills suaves descanso 25s - Z2",
      "Serie 2 - Aeróbico: 6 x 300m crol ritmo fácil descanso 40s - Z2",
      "Serie 3 - Activación: 10 x 100m progresivo descanso 30s - Z2-Z3",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Patada: 8 x 100m patada descanso 25s - Z2"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media", focus: "Recuperación activa", group: 2
  },
  {
    week: 26, date: "5 de agosto", day: "Miércoles", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 4400, duration: 85,
    warmup: "900m (600 crol, 300 estilos) Z1",
    mainSet: [
      "Serie 1 - Drills: 12 x 100m técnica variada descanso 20s - Z2",
      "Serie 2 - Construcción: 6 x 350m ritmo progresivo descanso 40s - Z2-Z3",
      "Serie 3 - Velocidad: 10 x 100m fuerte descanso 30s - Z3-Z4",
      "Serie 4 - Aeróbico: 1 x 1000m crol - Z2",
      "Serie 5 - Patada: 10 x 75m patada descanso 25s - Z2-Z3"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Retorno gradual", group: 2
  },
  {
    week: 26, date: "6 de agosto", day: "Jueves", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 4600, duration: 90,
    warmup: "900m (600 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 14 x 75m drills por estilo descanso 20s - Z2",
      "Serie 2 - Aeróbico: 8 x 300m crol ritmo moderado descanso 35s - Z2",
      "Serie 3 - Velocidad: 12 x 75m fuerte descanso 30s - Z3-Z4",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Patada: 10 x 100m patada descanso 25s - Z2-Z3"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Reconstrucción", group: 2
  },
  {
    week: 26, date: "7 de agosto", day: "Viernes", schedule: "PM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 3800, duration: 75,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Activación: 10 x 75m técnica perfecta descanso 25s - Z2",
      "Serie 2 - Velocidad: 6 x 250m ritmo moderado descanso 40s - Z2-Z3",
      "Serie 3 - Sprints: 8 x 50m sprint descanso 45s - Z4",
      "Serie 4 - Aeróbico: 1 x 800m crol suave - Z2",
      "Serie 5 - Activación: 6 x 50m sprint controlado descanso 60s - Z4"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media", focus: "Pre-Nacional Desarrollo", group: 2
  },
  // 8-16 Agosto: NACIONAL DESARROLLO
  {
    week: 26, date: "8 de agosto", day: "Sábado", schedule: "AM",
    mesociclo: "Bloque 5", bloque: "Internacional", distance: 0, duration: 0,
    warmup: "Competencia - Nacional Desarrollo",
    mainSet: ["DÍA DE COMPETENCIA - Campeonato Nacional Desarrollo"],
    cooldown: "Recuperación post-competencia",
    intensity: "Competencia", focus: "Nacional Desarrollo",
    isChallenge: true, challengeName: "Nacional Desarrollo", group: 2
  }
];

// BLOQUE 6: VELOCIDAD 2 (4 semanas, 24 entrenamientos)
// Objetivo: Copa Chile 1 (12-13 Sep 2026)
export const workoutsBlock6: Workout[] = [
  // SEMANA 27 (17-22 Ago) - RETORNO VELOCIDAD
  {
    week: 27, date: "17 de agosto", day: "Lunes", schedule: "PM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 4500, duration: 90,
    warmup: "700m (400 crol, 200 técnica, 100 patada) Z1",
    mainSet: [
      "Serie 1 - Técnica: 10 x 50m (25 drill + 25 swim) descanso 15s - Z2",
      "Serie 2 - Activación: 6 x 100m crol progresivo descanso 20s - Z2-Z3",
      "Serie 3 - Velocidad: 16 x 25m sprint descanso 30s - Z5",
      "Serie 4 - Resistencia: 1 x 1200m pull buoy - Z2",
      "Serie 5 - Patada: 10 x 75m patada descanso 25s - Z3"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Retorno a velocidad explosiva", group: 2
  },
  {
    week: 27, date: "18 de agosto", day: "Martes", schedule: "PM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 5000, duration: 100,
    warmup: "800m (500 crol, 300 estilos) Z1",
    mainSet: [
      "Serie 1 - Drills: 12 x 50m técnica 4 estilos descanso 15s - Z2",
      "Serie 2 - Umbral: 6 x 200m ritmo fuerte descanso 25s - Z3",
      "Serie 3 - Paletas: 12 x 50m paletas máxima velocidad descanso 30s - Z5",
      "Serie 4 - Aeróbico: 1 x 1200m crol - Z2",
      "Serie 5 - Salidas: 10 x 25m salida de bloque descanso 45s - Z5"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Potencia y salidas", group: 2
  },
  {
    week: 27, date: "19 de agosto", day: "Miércoles", schedule: "PM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 4800, duration: 95,
    warmup: "700m (400 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 10 x 75m drills perfectos descanso 20s - Z2",
      "Serie 2 - VO2max: 12 x 100m muy fuerte descanso 20s - Z4",
      "Serie 3 - Paracaídas: 12 x 50m con resistencia descanso 40s - Z4-Z5",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Patada: 10 x 75m patada velocidad descanso 30s - Z4"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "VO2max y resistencia", group: 2
  },
  {
    week: 27, date: "20 de agosto", day: "Jueves", schedule: "PM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 5200, duration: 105,
    warmup: "900m (600 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 12 x 75m técnica por estilo descanso 20s - Z2",
      "Serie 2 - Serie 50m: 20 x 50m máxima velocidad descanso 35s - Z5",
      "Serie 3 - Umbral: 10 x 150m ritmo fuerte descanso 25s - Z3",
      "Serie 4 - Aeróbico: 1 x 1200m crol - Z2",
      "Serie 5 - Velocidad: 12 x 25m sprint descanso 45s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Serie 50m velocidad", group: 2
  },
  {
    week: 27, date: "21 de agosto", day: "Viernes", schedule: "PM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 4400, duration: 90,
    warmup: "700m (400 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 10 x 75m drills económicos descanso 20s - Z2",
      "Serie 2 - Velocidad: 16 x 50m sprint fuerte descanso 30s - Z4-Z5",
      "Serie 3 - Broken: 6 x (2 x 50m) ritmo 100m descanso 10s/30s - Z4-Z5",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Sprints: 8 x 25m máxima velocidad descanso 60s - Z5"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Broken 100m", group: 2
  },
  {
    week: 27, date: "22 de agosto", day: "Sábado", schedule: "AM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 5400, duration: 110,
    warmup: "1000m (600 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 14 x 75m drills 4 estilos descanso 20s - Z2",
      "Serie 2 - Test 50m: 12 x 50m máximo esfuerzo descanso 90s - Z5",
      "Serie 3 - Umbral: 10 x 200m ritmo fuerte descanso 30s - Z3",
      "Serie 4 - Aeróbico: 1 x 1200m pull buoy - Z2",
      "Serie 5 - Patada: 10 x 100m patada fuerte descanso 25s - Z4"
    ],
    cooldown: "700m (500 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Test 50m", group: 2
  },

  // SEMANA 28 (24-29 Ago) - INTENSIFICACIÓN VELOCIDAD
  {
    week: 28, date: "24 de agosto", day: "Lunes", schedule: "PM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 4800, duration: 95,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 12 x 50m técnica avanzada descanso 15s - Z2",
      "Serie 2 - Velocidad sostenida: 16 x 50m fuerte descanso 25s - Z4-Z5",
      "Serie 3 - Paletas: 12 x 75m paletas máxima potencia descanso 30s - Z5",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Salidas: 12 x 25m salida de bloque descanso 45s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Velocidad sostenida", group: 2
  },
  {
    week: 28, date: "25 de agosto", day: "Martes", schedule: "PM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 5200, duration: 105,
    warmup: "900m (600 crol, 300 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 14 x 50m drills por estilo descanso 15s - Z2",
      "Serie 2 - Descensos: 8 x 75m descendente descanso 30s - Z4-Z5",
      "Serie 3 - VO2max: 16 x 100m muy fuerte descanso 20s - Z4",
      "Serie 4 - Aeróbico: 1 x 1200m crol - Z2",
      "Serie 5 - Sprints: 12 x 25m máxima velocidad descanso 50s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Descensos y VO2max", group: 2
  },
  {
    week: 28, date: "26 de agosto", day: "Miércoles", schedule: "PM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 5000, duration: 100,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 10 x 100m técnica perfecta descanso 20s - Z2",
      "Serie 2 - Serie 50m: 20 x 50m máxima velocidad descanso 35s - Z5",
      "Serie 3 - Paracaídas: 10 x 75m con resistencia descanso 40s - Z4",
      "Serie 4 - Resistencia: 1 x 1200m pull buoy - Z2",
      "Serie 5 - Patada: 12 x 75m patada velocidad descanso 30s - Z4"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Serie 50m máxima", group: 2
  },
  {
    week: 28, date: "27 de agosto", day: "Jueves", schedule: "PM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 5400, duration: 110,
    warmup: "1000m (600 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 16 x 50m drills 4 estilos descanso 15s - Z2",
      "Serie 2 - Broken 50m: 12 x (2 x 25m) ritmo 50m descanso 10s/30s - Z5",
      "Serie 3 - Umbral: 12 x 150m ritmo fuerte descanso 25s - Z3",
      "Serie 4 - Aeróbico: 1 x 1500m crol - Z2",
      "Serie 5 - Velocidad: 16 x 25m sprint descanso 45s - Z5"
    ],
    cooldown: "700m (500 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Broken 50m", group: 2
  },
  {
    week: 28, date: "28 de agosto", day: "Viernes", schedule: "PM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 4600, duration: 90,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 10 x 75m técnica económica descanso 20s - Z2",
      "Serie 2 - Velocidad: 16 x 50m fuerte descanso 30s - Z4-Z5",
      "Serie 3 - Paletas: 10 x 75m paletas máxima potencia descanso 35s - Z5",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Salidas: 10 x 25m salida de bloque descanso 60s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Potencia y salidas", group: 2
  },
  {
    week: 28, date: "29 de agosto", day: "Sábado", schedule: "AM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 5600, duration: 115,
    warmup: "1000m (600 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 16 x 75m drills perfectos descanso 20s - Z2",
      "Serie 2 - Test 25m: 16 x 25m máximo esfuerzo descanso 60s - Z5",
      "Serie 3 - Umbral: 12 x 200m ritmo fuerte descanso 30s - Z3",
      "Serie 4 - Aeróbico: 1 x 1500m pull buoy - Z2",
      "Serie 5 - Patada: 12 x 100m patada fuerte descanso 25s - Z4"
    ],
    cooldown: "700m (500 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Test 25m", group: 2
  },

  // SEMANA 29 (31 Ago - 5 Sep) - MANTENIMIENTO
  {
    week: 29, date: "31 de agosto", day: "Lunes", schedule: "PM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 5000, duration: 100,
    warmup: "900m (600 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 14 x 50m drills variados descanso 15s - Z2",
      "Serie 2 - Velocidad: 18 x 50m máxima velocidad descanso 35s - Z5",
      "Serie 3 - VO2max: 12 x 100m muy fuerte descanso 25s - Z4",
      "Serie 4 - Resistencia: 1 x 1200m pull buoy - Z2",
      "Serie 5 - Sprints: 12 x 25m sprint descanso 45s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Pico velocidad", group: 2
  },
  {
    week: 29, date: "1 de septiembre", day: "Martes", schedule: "PM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 5200, duration: 105,
    warmup: "1000m (600 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Drills: 16 x 50m técnica perfecta descanso 15s - Z2",
      "Serie 2 - Serie mixta: 10 x 75m + 10 x 50m máxima velocidad descanso 30s - Z5",
      "Serie 3 - Umbral: 10 x 150m ritmo fuerte descanso 25s - Z3",
      "Serie 4 - Aeróbico: 1 x 1200m crol - Z2",
      "Serie 5 - Salidas: 12 x 25m salida de bloque descanso 50s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Serie mixta velocidad", group: 2
  },
  {
    week: 29, date: "2 de septiembre", day: "Miércoles", schedule: "PM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 4800, duration: 95,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 12 x 75m drills económicos descanso 20s - Z2",
      "Serie 2 - Velocidad: 16 x 50m sprint fuerte descanso 30s - Z4-Z5",
      "Serie 3 - Paletas: 12 x 50m paletas máxima potencia descanso 35s - Z5",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Patada: 10 x 75m patada velocidad descanso 30s - Z4"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Potencia máxima", group: 2
  },
  {
    week: 29, date: "3 de septiembre", day: "Jueves", schedule: "PM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 5400, duration: 110,
    warmup: "1000m (600 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Drills: 14 x 75m técnica por estilo descanso 20s - Z2",
      "Serie 2 - Test: 8 x 100m máximo esfuerzo descanso 90s - Z5",
      "Serie 3 - Velocidad: 20 x 50m fuerte descanso 30s - Z4-Z5",
      "Serie 4 - Aeróbico: 1 x 1500m crol - Z2",
      "Serie 5 - Sprints: 12 x 25m máxima velocidad descanso 50s - Z5"
    ],
    cooldown: "700m (500 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Test 100m velocidad", group: 2
  },
  {
    week: 29, date: "4 de septiembre", day: "Viernes", schedule: "PM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 4400, duration: 90,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 10 x 75m drills suaves descanso 20s - Z2",
      "Serie 2 - Velocidad: 14 x 50m sprint fuerte descanso 30s - Z4-Z5",
      "Serie 3 - Broken: 8 x (2 x 25m) ritmo 50m descanso 10s/30s - Z5",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Salidas: 10 x 25m salida de bloque descanso 60s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Velocidad y salidas", group: 2
  },
  {
    week: 29, date: "5 de septiembre", day: "Sábado", schedule: "AM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 5500, duration: 110,
    warmup: "1000m (600 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 16 x 75m drills 4 estilos descanso 20s - Z2",
      "Serie 2 - Serie final: 12 x 50m + 8 x 25m máxima velocidad descanso 35s/60s - Z5",
      "Serie 3 - Umbral: 10 x 200m ritmo fuerte descanso 30s - Z3",
      "Serie 4 - Aeróbico: 1 x 1500m pull buoy - Z2",
      "Serie 5 - Patada: 12 x 75m patada fuerte descanso 25s - Z4"
    ],
    cooldown: "700m (500 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Serie final velocidad", group: 2
  },

  // SEMANA 30 (7-12 Sep) - TAPER COPA CHILE 1
  {
    week: 30, date: "7 de septiembre", day: "Lunes", schedule: "PM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 4600, duration: 90,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 12 x 50m drills económicos descanso 20s - Z2",
      "Serie 2 - Aeróbico: 8 x 250m crol ritmo moderado descanso 35s - Z2",
      "Serie 3 - Velocidad: 12 x 50m fuerte descanso 30s - Z4",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Sprints: 8 x 25m sprint descanso 45s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media", focus: "Reducción volumen", group: 2
  },
  {
    week: 30, date: "8 de septiembre", day: "Martes", schedule: "PM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 4800, duration: 95,
    warmup: "900m (600 crol, 300 estilos) Z1",
    mainSet: [
      "Serie 1 - Drills: 14 x 50m técnica impecable descanso 15s - Z2",
      "Serie 2 - Race pace: 10 x 50m ritmo competencia descanso 40s - Z4-Z5",
      "Serie 3 - Velocidad: 8 x 50m sprint controlado descanso 45s - Z5",
      "Serie 4 - Aeróbico: 1 x 1000m crol fácil - Z2",
      "Serie 5 - Salidas: 8 x 25m salida de bloque descanso 60s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Ritmo competencia", group: 2
  },
  {
    week: 30, date: "9 de septiembre", day: "Miércoles", schedule: "PM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 4200, duration: 85,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 10 x 75m drills suaves descanso 25s - Z2",
      "Serie 2 - Aeróbico: 6 x 300m crol ritmo fácil descanso 40s - Z2",
      "Serie 3 - Velocidad: 10 x 50m fuerte descanso 35s - Z4",
      "Serie 4 - Resistencia: 1 x 800m pull buoy - Z2",
      "Serie 5 - Sprints: 6 x 25m sprint descanso 60s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media", focus: "Recuperación activa", group: 2
  },
  {
    week: 30, date: "10 de septiembre", day: "Jueves", schedule: "PM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 4400, duration: 85,
    warmup: "800m (500 crol, 300 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 12 x 50m drills perfectos descanso 20s - Z2",
      "Serie 2 - Simulación: 8 x 50m ritmo carrera descanso 60s - Z5",
      "Serie 3 - Velocidad: 8 x 50m sprint controlado descanso 45s - Z4-Z5",
      "Serie 4 - Aeróbico: 1 x 1000m crol suave - Z2",
      "Serie 5 - Activación: 6 x 25m sprint descanso 90s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Simulación 50m", group: 2
  },
  {
    week: 30, date: "11 de septiembre", day: "Viernes", schedule: "PM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 3400, duration: 70,
    warmup: "800m (500 crol muy suave, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Activación: 8 x 50m técnica perfecta descanso 25s - Z2",
      "Serie 2 - Velocidad: 6 x 50m ritmo moderado descanso 45s - Z3",
      "Serie 3 - Sprints: 6 x 25m sprint descanso 60s - Z4-Z5",
      "Serie 4 - Aeróbico: 1 x 600m crol muy suave - Z1",
      "Serie 5 - Activación: 4 x 25m salida de bloque descanso 90s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda muy suave) Z1",
    intensity: "Media", focus: "Pre-competencia 50m", group: 2
  },
  // 12-13 Septiembre: COPA CHILE 1 - 50m
  {
    week: 30, date: "12 de septiembre", day: "Sábado", schedule: "AM",
    mesociclo: "Bloque 6", bloque: "Velocidad 2", distance: 0, duration: 0,
    warmup: "Competencia - Copa Chile 1 (Velocidad 50m)",
    mainSet: ["DÍA DE COMPETENCIA - Copa Chile 1 - Pruebas de 50m"],
    cooldown: "Recuperación post-competencia",
    intensity: "Competencia", focus: "Copa Chile 1 - 50m",
    isChallenge: true, challengeName: "Copa Chile 1 - Velocidad", group: 2
  }
];

// ... (Continúa en el siguiente archivo con Bloques 7-10)
