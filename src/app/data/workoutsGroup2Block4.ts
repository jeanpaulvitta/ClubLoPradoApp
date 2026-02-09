import { Workout } from './workouts';

// BLOQUE 4: COMPETITIVO MAYOR (6 semanas, 36 entrenamientos)
// Objetivo: Nacionales Jun-Jul (6 Jun - 5 Jul 2026)
export const workoutsBlock4: Workout[] = [
  // SEMANA 15 (19-23 May)
  {
    week: 15, date: "19 de mayo", day: "Martes", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 5000, duration: 100,
    warmup: "900m (500 crol, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Recuperación: 12 x 100m técnica suave descanso 25s - Z1-Z2",
      "Serie 2 - Aeróbico: 8 x 300m crol ritmo fácil descanso 35s - Z2",
      "Serie 3 - Activación: 10 x 100m progresivo descanso 25s - Z2-Z3",
      "Serie 4 - Resistencia: 1 x 1200m pull buoy - Z2",
      "Serie 5 - Patada: 8 x 75m patada suave descanso 30s - Z2"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media", focus: "Recuperación post-competencia", group: 2
  },
  {
    week: 15, date: "20 de mayo", day: "Miércoles", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 5400, duration: 110,
    warmup: "1000m (600 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 16 x 50m drills 4 estilos descanso 15s - Z2",
      "Serie 2 - Construcción: 6 x 400m ritmo progresivo descanso 45s - Z2-Z3",
      "Serie 3 - Velocidad: 12 x 100m fuerte descanso 30s - Z4",
      "Serie 4 - Aeróbico: 1 x 1500m crol ritmo moderado - Z2",
      "Serie 5 - Patada: 10 x 75m patada descanso 25s - Z3"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Reconstrucción", group: 2
  },
  {
    week: 15, date: "21 de mayo", day: "Jueves", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 5600, duration: 115,
    warmup: "1100m (700 crol, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 12 x 100m técnica avanzada descanso 20s - Z2",
      "Serie 2 - Umbral: 8 x 400m ritmo fuerte descanso 50s - Z3",
      "Serie 3 - VO2max: 16 x 100m muy fuerte descanso 25s - Z4",
      "Serie 4 - Resistencia: 1 x 1200m pull buoy - Z2",
      "Serie 5 - Velocidad: 10 x 50m sprint descanso 40s - Z5"
    ],
    cooldown: "700m (500 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Umbral e intensidad", group: 2
  },
  {
    week: 15, date: "22 de mayo", day: "Viernes", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 4800, duration: 95,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 10 x 100m drills perfectos descanso 20s - Z2",
      "Serie 2 - Race pace: 6 x 300m ritmo competencia descanso 40s - Z3",
      "Serie 3 - Velocidad: 12 x 75m sprint fuerte descanso 30s - Z4-Z5",
      "Serie 4 - Aeróbico: 1 x 1000m crol - Z2",
      "Serie 5 - Patada: 8 x 100m patada descanso 25s - Z3"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Ritmo de carrera", group: 2
  },
  {
    week: 15, date: "23 de mayo", day: "Sábado", schedule: "AM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 5800, duration: 120,
    warmup: "1200m (800 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 16 x 75m drills por estilo descanso 20s - Z2",
      "Serie 2 - Medley: 4 x 400m IM ritmo fuerte descanso 60s - Z3",
      "Serie 3 - Broken: 8 x (2 x 100m) ritmo 200m descanso 10s/30s - Z4",
      "Serie 4 - Resistencia: 1 x 1500m pull buoy - Z2",
      "Serie 5 - Patada: 12 x 100m patada descanso 25s - Z3"
    ],
    cooldown: "700m (500 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Medley y broken sets", group: 2
  },

  // SEMANA 16 (26-30 May)
  {
    week: 16, date: "26 de mayo", day: "Martes", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 5600, duration: 115,
    warmup: "1000m (600 crol, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 14 x 100m técnica perfecta descanso 20s - Z2",
      "Serie 2 - Pirámide: 200-300-400-500-400-300-200m descanso 35s - Z3",
      "Serie 3 - Velocidad: 16 x 75m sprint fuerte descanso 25s - Z4",
      "Serie 4 - Aeróbico: 1 x 1200m crol - Z2",
      "Serie 5 - Patada: 10 x 100m patada descanso 25s - Z3"
    ],
    cooldown: "700m (500 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Pirámide extendida", group: 2
  },
  {
    week: 16, date: "27 de mayo", day: "Miércoles", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 5400, duration: 110,
    warmup: "1000m (600 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 12 x 100m drills avanzados descanso 20s - Z2",
      "Serie 2 - Umbral máximo: 10 x 300m ritmo muy fuerte descanso 35s - Z3-Z4",
      "Serie 3 - VO2max: 20 x 75m máxima intensidad descanso 20s - Z4",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Velocidad: 10 x 50m sprint descanso 45s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Umbral e intensidad máxima", group: 2
  },
  {
    week: 16, date: "28 de mayo", day: "Jueves", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 5800, duration: 120,
    warmup: "1100m (700 crol, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills largos: 16 x 75m técnica por estilo descanso 20s - Z2",
      "Serie 2 - Serie larga: 3 x 800m ritmo fuerte descanso 60s - Z3",
      "Serie 3 - Descensos: 8 x 200m descendente descanso 30s - Z3-Z4",
      "Serie 4 - Aeróbico: 1 x 1500m crol - Z2",
      "Serie 5 - Patada: 12 x 100m patada descanso 25s - Z3"
    ],
    cooldown: "700m (500 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Series largas", group: 2
  },
  {
    week: 16, date: "29 de mayo", day: "Viernes", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 5000, duration: 100,
    warmup: "900m (600 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 12 x 75m drills económicos descanso 20s - Z2",
      "Serie 2 - Race pace: 8 x 300m ritmo competencia descanso 40s - Z3",
      "Serie 3 - Velocidad: 12 x 100m fuerte descanso 30s - Z4",
      "Serie 4 - Resistencia: 1 x 1200m pull buoy - Z2",
      "Serie 5 - Sprints: 8 x 50m máxima velocidad descanso 45s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Ritmo de competencia", group: 2
  },
  {
    week: 16, date: "30 de mayo", day: "Sábado", schedule: "AM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 6000, duration: 125,
    warmup: "1200m (800 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 16 x 100m drills perfectos descanso 20s - Z2",
      "Serie 2 - Test mixto: 4 x 400m + 8 x 100m máximo esfuerzo descanso 60s/45s - Z5",
      "Serie 3 - Umbral: 12 x 200m ritmo fuerte descanso 30s - Z3",
      "Serie 4 - Aeróbico: 1 x 1500m pull buoy - Z2",
      "Serie 5 - Patada: 12 x 100m patada fuerte descanso 25s - Z4"
    ],
    cooldown: "800m (600 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Test mixto distancias", group: 2
  },

  // SEMANA 17 (2-6 Jun)
  {
    week: 17, date: "2 de junio", day: "Martes", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 5600, duration: 115,
    warmup: "1000m (600 crol, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 14 x 100m técnica impecable descanso 20s - Z2",
      "Serie 2 - Ladder: 100-200-300-400-500-400-300-200-100m descanso 30s - Z3-Z4",
      "Serie 3 - Velocidad: 12 x 100m sprint fuerte descanso 30s - Z4",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Patada: 10 x 100m patada descanso 25s - Z3"
    ],
    cooldown: "700m (500 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Ladder extendido", group: 2
  },
  {
    week: 17, date: "3 de junio", day: "Miércoles", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 5400, duration: 110,
    warmup: "1000m (600 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 16 x 50m drills 4 estilos descanso 15s - Z2",
      "Serie 2 - Competitivo: 6 x 400m ritmo carrera descanso 50s - Z3-Z4",
      "Serie 3 - VO2max: 16 x 100m muy fuerte descanso 25s - Z4",
      "Serie 4 - Aeróbico: 1 x 1200m crol - Z2",
      "Serie 5 - Velocidad: 10 x 50m sprint descanso 45s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Ritmo de carrera intenso", group: 2
  },
  {
    week: 17, date: "4 de junio", day: "Jueves", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 5200, duration: 105,
    warmup: "900m (600 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 12 x 100m técnica perfecta descanso 20s - Z2",
      "Serie 2 - Broken: 6 x (4 x 100m) ritmo 400m descanso 10s/45s - Z3-Z4",
      "Serie 3 - Velocidad: 12 x 75m sprint fuerte descanso 30s - Z4-Z5",
      "Serie 4 - Resistencia: 1 x 1200m pull buoy - Z2",
      "Serie 5 - Patada: 10 x 75m patada fuerte descanso 25s - Z4"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Broken 400m", group: 2
  },
  {
    week: 17, date: "5 de junio", day: "Viernes", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 4600, duration: 95,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 10 x 100m drills económicos descanso 20s - Z2",
      "Serie 2 - Simulación: 4 x 300m ritmo competencia descanso 45s - Z3",
      "Serie 3 - Velocidad: 10 x 100m fuerte descanso 35s - Z4",
      "Serie 4 - Aeróbico: 1 x 1000m crol suave - Z2",
      "Serie 5 - Activación: 8 x 50m sprint descanso 45s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Pre-taper, simulación", group: 2
  },

  // 6-7 Junio: COMPETENCIA NACIONALES (Inicio)
  {
    week: 17, date: "6 de junio", day: "Sábado", schedule: "AM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 0, duration: 0,
    warmup: "Competencia - Nacionales Jun-Jul (Día 1)",
    mainSet: ["DÍA DE COMPETENCIA - Campeonatos Nacionales - Sesión matinal y vespertina"],
    cooldown: "Recuperación entre sesiones",
    intensity: "Competencia", focus: "Nacionales - Día 1",
    isChallenge: true, challengeName: "Nacionales Jun-Jul", group: 2
  },

  // SEMANA 18 (8-13 Jun) - COMPETENCIA ACTIVA
  {
    week: 18, date: "8 de junio", day: "Lunes", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 3500, duration: 70,
    warmup: "800m (500 crol suave, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Recuperación: 10 x 75m técnica suave descanso 25s - Z1-Z2",
      "Serie 2 - Activación: 6 x 200m ritmo fácil descanso 40s - Z2",
      "Serie 3 - Velocidad: 8 x 50m sprint controlado descanso 45s - Z4",
      "Serie 4 - Aeróbico: 1 x 800m crol muy suave - Z1",
      "Serie 5 - Sprints: 6 x 25m máxima velocidad descanso 60s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda muy suave) Z1",
    intensity: "Media", focus: "Recuperación entre competencias", group: 2
  },
  {
    week: 18, date: "9 de junio", day: "Martes", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 3800, duration: 75,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 10 x 75m drills suaves descanso 25s - Z2",
      "Serie 2 - Aeróbico: 6 x 250m crol ritmo fácil descanso 35s - Z2",
      "Serie 3 - Activación: 8 x 75m progresivo descanso 30s - Z3",
      "Serie 4 - Resistencia: 1 x 800m pull buoy - Z2",
      "Serie 5 - Velocidad: 8 x 50m sprint descanso 45s - Z4"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media", focus: "Mantenimiento activo", group: 2
  },
  {
    week: 18, date: "10 de junio", day: "Miércoles", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 4000, duration: 80,
    warmup: "900m (600 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 12 x 75m técnica perfecta descanso 20s - Z2",
      "Serie 2 - Race prep: 4 x 300m ritmo competencia descanso 50s - Z3",
      "Serie 3 - Velocidad: 10 x 75m fuerte descanso 30s - Z4",
      "Serie 4 - Aeróbico: 1 x 1000m crol - Z2",
      "Serie 5 - Sprints: 8 x 50m máxima velocidad descanso 60s - Z5"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Preparación competencias", group: 2
  },
  {
    week: 18, date: "11 de junio", day: "Jueves", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 3600, duration: 70,
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
    week: 18, date: "12 de junio", day: "Viernes", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 3200, duration: 65,
    warmup: "700m (500 crol muy suave, 200 técnica) Z1",
    mainSet: [
      "Serie 1 - Activación: 8 x 75m técnica perfecta descanso 25s - Z2",
      "Serie 2 - Velocidad controlada: 6 x 200m ritmo moderado descanso 40s - Z2-Z3",
      "Serie 3 - Sprints: 8 x 50m sprint descanso 60s - Z4",
      "Serie 4 - Aeróbico: 1 x 600m crol muy suave - Z1",
      "Serie 5 - Activación final: 4 x 50m sprint controlado descanso 90s - Z4"
    ],
    cooldown: "600m (400 crol + 200 espalda muy suave) Z1",
    intensity: "Media", focus: "Pre-competencia continua", group: 2
  },
  {
    week: 18, date: "13 de junio", day: "Sábado", schedule: "AM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 0, duration: 0,
    warmup: "Competencia - Nacionales Jun-Jul (Continúa)",
    mainSet: ["DÍA DE COMPETENCIA - Campeonatos Nacionales - Sesión matinal y vespertina"],
    cooldown: "Recuperación entre sesiones",
    intensity: "Competencia", focus: "Nacionales - Día intermedio",
    isChallenge: true, challengeName: "Nacionales Jun-Jul", group: 2
  },

  // SEMANA 19 (15-20 Jun) - COMPETENCIA ACTIVA
  {
    week: 19, date: "15 de junio", day: "Lunes", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 3400, duration: 70,
    warmup: "800m (500 crol suave, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Recuperación: 10 x 75m técnica muy suave descanso 30s - Z1-Z2",
      "Serie 2 - Aeróbico: 6 x 200m crol ritmo fácil descanso 40s - Z2",
      "Serie 3 - Activación: 8 x 75m progresivo descanso 30s - Z2-Z3",
      "Serie 4 - Resistencia: 1 x 800m pull buoy - Z2",
      "Serie 5 - Velocidad: 6 x 50m sprint descanso 60s - Z4"
    ],
    cooldown: "600m (400 crol + 200 espalda muy suave) Z1",
    intensity: "Media", focus: "Recuperación activa", group: 2
  },
  {
    week: 19, date: "16 de junio", day: "Martes", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 3800, duration: 75,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 12 x 75m drills perfectos descanso 25s - Z2",
      "Serie 2 - Race pace: 4 x 300m ritmo competencia descanso 50s - Z3",
      "Serie 3 - Velocidad: 10 x 75m fuerte descanso 30s - Z4",
      "Serie 4 - Aeróbico: 1 x 1000m crol - Z2",
      "Serie 5 - Sprints: 8 x 50m máxima velocidad descanso 60s - Z5"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Mantenimiento ritmo", group: 2
  },
  {
    week: 19, date: "17 de junio", day: "Miércoles", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 3600, duration: 70,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 10 x 75m técnica económica descanso 25s - Z2",
      "Serie 2 - Aeróbico: 6 x 250m crol ritmo fácil descanso 35s - Z2",
      "Serie 3 - Activación: 10 x 75m progresivo descanso 30s - Z3",
      "Serie 4 - Resistencia: 1 x 800m pull buoy - Z2",
      "Serie 5 - Velocidad: 8 x 50m sprint descanso 45s - Z4"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media", focus: "Sesión ligera", group: 2
  },
  {
    week: 19, date: "18 de junio", day: "Jueves", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 4000, duration: 80,
    warmup: "900m (600 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 12 x 75m drills perfectos descanso 20s - Z2",
      "Serie 2 - Simulación: 4 x 300m ritmo carrera descanso 50s - Z3",
      "Serie 3 - Velocidad: 12 x 75m fuerte descanso 30s - Z4",
      "Serie 4 - Aeróbico: 1 x 1000m crol - Z2",
      "Serie 5 - Sprints: 8 x 50m máxima velocidad descanso 60s - Z5"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Preparación finales", group: 2
  },
  {
    week: 19, date: "19 de junio", day: "Viernes", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 3000, duration: 60,
    warmup: "700m (500 crol muy suave, 200 técnica) Z1",
    mainSet: [
      "Serie 1 - Activación: 8 x 75m técnica perfecta descanso 30s - Z2",
      "Serie 2 - Velocidad: 6 x 200m ritmo moderado descanso 45s - Z2-Z3",
      "Serie 3 - Sprints: 6 x 50m sprint descanso 60s - Z4",
      "Serie 4 - Aeróbico: 1 x 500m crol muy suave - Z1",
      "Serie 5 - Activación: 4 x 50m sprint controlado descanso 90s - Z4"
    ],
    cooldown: "600m (400 crol + 200 espalda muy suave) Z1",
    intensity: "Media", focus: "Pre-finales", group: 2
  },
  {
    week: 19, date: "20 de junio", day: "Sábado", schedule: "AM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 0, duration: 0,
    warmup: "Competencia - Nacionales Jun-Jul (Finales)",
    mainSet: ["DÍA DE COMPETENCIA - Campeonatos Nacionales - Finales"],
    cooldown: "Recuperación post-competencia",
    intensity: "Competencia", focus: "Nacionales - Finales",
    isChallenge: true, challengeName: "Nacionales Jun-Jul", group: 2
  },

  // SEMANA 20 (22-27 Jun) - RECUPERACIÓN POST-NACIONALES
  {
    week: 20, date: "22 de junio", day: "Lunes", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 3200, duration: 65,
    warmup: "800m (500 crol muy suave, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Recuperación: 12 x 75m técnica muy suave descanso 30s - Z1",
      "Serie 2 - Aeróbico: 8 x 200m crol ritmo muy fácil descanso 40s - Z1-Z2",
      "Serie 3 - Activación suave: 8 x 75m progresivo descanso 30s - Z2",
      "Serie 4 - Resistencia: 1 x 600m pull buoy muy suave - Z1",
      "Serie 5 - Patada: 6 x 75m patada suave descanso 30s - Z2"
    ],
    cooldown: "600m (400 crol + 200 espalda muy suave) Z1",
    intensity: "Baja", focus: "Recuperación post-Nacionales", group: 2
  },
  {
    week: 20, date: "23 de junio", day: "Martes", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 3500, duration: 70,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 10 x 100m drills suaves descanso 25s - Z2",
      "Serie 2 - Aeróbico: 6 x 250m crol ritmo fácil descanso 40s - Z2",
      "Serie 3 - Activación: 8 x 100m progresivo descanso 30s - Z2",
      "Serie 4 - Resistencia: 1 x 800m pull buoy - Z2",
      "Serie 5 - Patada: 8 x 75m patada descanso 30s - Z2"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media", focus: "Recuperación activa", group: 2
  },
  {
    week: 20, date: "24 de junio", day: "Miércoles", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 4000, duration: 80,
    warmup: "900m (600 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 12 x 75m técnica variada descanso 20s - Z2",
      "Serie 2 - Aeróbico: 6 x 300m crol ritmo moderado descanso 40s - Z2",
      "Serie 3 - Velocidad suave: 10 x 100m progresivo descanso 30s - Z2-Z3",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Patada: 10 x 75m patada descanso 25s - Z2"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media", focus: "Retorno gradual", group: 2
  },
  {
    week: 20, date: "25 de junio", day: "Jueves", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 4200, duration: 85,
    warmup: "900m (600 crol, 300 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 14 x 75m drills por estilo descanso 20s - Z2",
      "Serie 2 - Construcción: 8 x 250m ritmo progresivo descanso 35s - Z2-Z3",
      "Serie 3 - Velocidad: 10 x 75m fuerte descanso 30s - Z3-Z4",
      "Serie 4 - Aeróbico: 1 x 1000m crol - Z2",
      "Serie 5 - Patada: 10 x 100m patada descanso 25s - Z2-Z3"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Reconstrucción", group: 2
  },
  {
    week: 20, date: "26 de junio", day: "Viernes", schedule: "PM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 4500, duration: 90,
    warmup: "900m (600 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 12 x 100m técnica perfecta descanso 20s - Z2",
      "Serie 2 - Aeróbico: 6 x 350m crol ritmo moderado descanso 40s - Z2",
      "Serie 3 - Velocidad: 12 x 100m fuerte descanso 30s - Z3-Z4",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Patada: 10 x 100m patada descanso 25s - Z3"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Normalización", group: 2
  },
  {
    week: 20, date: "27 de junio", day: "Sábado", schedule: "AM",
    mesociclo: "Bloque 4", bloque: "Competitivo Mayor", distance: 4800, duration: 95,
    warmup: "1000m (600 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 16 x 75m drills 4 estilos descanso 20s - Z2",
      "Serie 2 - Aeróbico: 8 x 300m crol ritmo constante descanso 35s - Z2",
      "Serie 3 - Velocidad: 12 x 100m progresivo descanso 30s - Z3",
      "Serie 4 - Resistencia: 1 x 1200m pull buoy - Z2",
      "Serie 5 - Patada: 12 x 75m patada descanso 25s - Z2-Z3"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media", focus: "Cierre de bloque", group: 2
  }
];
