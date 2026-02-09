import { Workout } from './workouts';

// BLOQUE 3: MEDIO FONDO (4 semanas, 24 entrenamientos)
export const workoutsBlock3: Workout[] = [
  // SEMANA 11 (20-25 Abr)
  {
    week: 11, date: "20 de abril", day: "Lunes", schedule: "PM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 4800, duration: 95,
    warmup: "800m (400 crol, 200 estilos, 200 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica 4 estilos: 12 x 75m (25 drill + 50 swim) descanso 20s - Z2",
      "Serie 2 - Umbral: 8 x 200m crol ritmo moderado descanso 25s - Z2-Z3",
      "Serie 3 - VO2max: 16 x 100m (75 fuerte + 25 fácil) descanso 20s - Z4",
      "Serie 4 - Resistencia: 1 x 1200m pull buoy - Z2",
      "Serie 5 - Patada: 10 x 75m patada descanso 25s - Z3"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Transición a medio fondo", group: 2
  },
  {
    week: 11, date: "21 de abril", day: "Martes", schedule: "PM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 5200, duration: 105,
    warmup: "900m (500 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Drills: 16 x 50m drills 4 estilos descanso 15s - Z2",
      "Serie 2 - Ritmo 400m: 5 x 400m ritmo carrera descanso 45s - Z3",
      "Serie 3 - Paletas: 12 x 100m paletas fuerte descanso 30s - Z4",
      "Serie 4 - Aeróbico: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Sprints: 10 x 50m sprint descanso 40s - Z5"
    ],
    cooldown: "500m (300 crol + 200 estilos) Z1",
    intensity: "Alta", focus: "Ritmo 400m, potencia", group: 2
  },
  {
    week: 11, date: "22 de abril", day: "Miércoles", schedule: "PM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 5000, duration: 100,
    warmup: "800m (400 crol, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 10 x 100m técnica perfecta descanso 20s - Z2",
      "Serie 2 - Broken 400m: 4 x (4 x 100m) ritmo 400m descanso 10s/40s - Z3-Z4",
      "Serie 3 - VO2max: 20 x 75m fuerte descanso 20s - Z4",
      "Serie 4 - Resistencia: 1 x 1200m crol - Z2",
      "Serie 5 - Patada: 12 x 50m patada sprint descanso 30s - Z4"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Broken 400m, VO2max", group: 2
  },
  {
    week: 11, date: "23 de abril", day: "Jueves", schedule: "PM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 5400, duration: 110,
    warmup: "1000m (600 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Drills: 12 x 75m técnica por estilo descanso 20s - Z2",
      "Serie 2 - Umbral: 6 x 300m ritmo fuerte descanso 35s - Z3",
      "Serie 3 - Velocidad: 10 x 100m (50 sprint + 50 fácil) descanso 25s - Z4-Z5",
      "Serie 4 - Aeróbico: 1 x 1500m pull buoy - Z2",
      "Serie 5 - Patada: 10 x 100m patada descanso 25s - Z2-Z3"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Umbral sostenido", group: 2
  },
  {
    week: 11, date: "24 de abril", day: "Viernes", schedule: "PM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 4500, duration: 90,
    warmup: "700m (400 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 10 x 75m drills descanso 20s - Z2",
      "Serie 2 - Ritmo 200m: 8 x 200m ritmo carrera descanso 30s - Z3",
      "Serie 3 - Velocidad: 12 x 100m fuerte descanso 30s - Z4",
      "Serie 4 - Resistencia: 1 x 1000m crol - Z2",
      "Serie 5 - Sprints: 8 x 50m máxima velocidad descanso 45s - Z5"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Ritmo 200m", group: 2
  },
  {
    week: 11, date: "25 de abril", day: "Sábado", schedule: "AM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 5500, duration: 110,
    warmup: "1000m (600 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 10 x 100m técnica perfecta descanso 20s - Z2",
      "Serie 2 - Test 400m: 4 x 400m máximo esfuerzo descanso 90s - Z4-Z5",
      "Serie 3 - Umbral: 12 x 150m ritmo fuerte descanso 25s - Z3",
      "Serie 4 - Aeróbico: 1 x 1200m pull buoy - Z2",
      "Serie 5 - Patada: 10 x 75m patada fuerte descanso 30s - Z4"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Test 400m", group: 2
  },

  // SEMANA 12 (27 Abr - 2 May)
  {
    week: 12, date: "27 de abril", day: "Lunes", schedule: "PM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 5000, duration: 100,
    warmup: "800m (500 crol, 300 estilos) Z1",
    mainSet: [
      "Serie 1 - Drills: 12 x 75m técnica avanzada descanso 20s - Z2",
      "Serie 2 - Ladder: 100-200-300-400-300-200-100m descanso 30s - Z3-Z4",
      "Serie 3 - Velocidad: 10 x 100m ritmo fuerte descanso 25s - Z4",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Patada: 8 x 100m patada descanso 25s - Z3"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Ladder progresivo", group: 2
  },
  {
    week: 12, date: "28 de abril", day: "Martes", schedule: "PM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 5400, duration: 110,
    warmup: "1000m (600 crol, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 16 x 50m técnica por estilo descanso 15s - Z2",
      "Serie 2 - Descensos: 6 x 200m descendente descanso 35s - Z3-Z4",
      "Serie 3 - VO2max: 16 x 100m muy fuerte descanso 20s - Z4",
      "Serie 4 - Aeróbico: 1 x 1200m crol - Z2",
      "Serie 5 - Velocidad: 10 x 50m sprint descanso 40s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Descensos 200m", group: 2
  },
  {
    week: 12, date: "29 de abril", day: "Miércoles", schedule: "PM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 5200, duration: 105,
    warmup: "900m (500 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Drills: 10 x 100m técnica perfecta descanso 20s - Z2",
      "Serie 2 - Broken 200m: 8 x (2 x 100m) ritmo 200m descanso 10s/30s - Z4",
      "Serie 3 - Umbral: 12 x 150m ritmo muy fuerte descanso 25s - Z3-Z4",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Patada: 10 x 75m patada fuerte descanso 30s - Z4"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Broken 200m", group: 2
  },
  {
    week: 12, date: "30 de abril", day: "Jueves", schedule: "PM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 5600, duration: 115,
    warmup: "1100m (700 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 12 x 100m drills perfectos descanso 20s - Z2",
      "Serie 2 - Serie 400-300-200-100: 2 series completas descanso 30s/60s - Z3-Z4",
      "Serie 3 - Paletas: 12 x 100m paletas fuerte descanso 30s - Z4",
      "Serie 4 - Aeróbico: 1 x 1500m crol - Z2",
      "Serie 5 - Patada: 10 x 100m patada descanso 25s - Z3"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Serie descendente", group: 2
  },
  {
    week: 12, date: "1 de mayo", day: "Viernes", schedule: "PM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 4600, duration: 95,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 10 x 75m técnica descanso 20s - Z2",
      "Serie 2 - Ritmo 100m: 12 x 100m ritmo carrera descanso 20s - Z3-Z4",
      "Serie 3 - Velocidad: 16 x 50m sprint fuerte descanso 30s - Z4-Z5",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Activación: 8 x 50m sprint máximo descanso 45s - Z5"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Ritmo 100m", group: 2
  },
  {
    week: 12, date: "2 de mayo", day: "Sábado", schedule: "AM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 5800, duration: 120,
    warmup: "1200m (800 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 16 x 75m drills 4 estilos descanso 20s - Z2",
      "Serie 2 - Test 200m: 6 x 200m máximo esfuerzo descanso 60s - Z5",
      "Serie 3 - Umbral: 10 x 200m ritmo fuerte descanso 30s - Z3",
      "Serie 4 - Aeróbico: 1 x 1500m pull buoy - Z2",
      "Serie 5 - Patada: 12 x 100m patada descanso 25s - Z3"
    ],
    cooldown: "700m (500 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Test 200m", group: 2
  },

  // SEMANA 13 (4-9 May)
  {
    week: 13, date: "4 de mayo", day: "Lunes", schedule: "PM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 5200, duration: 105,
    warmup: "900m (600 crol, 300 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 12 x 100m drills variados descanso 20s - Z2",
      "Serie 2 - IM: 4 x 400m medley individual descanso 50s - Z3",
      "Serie 3 - Velocidad: 12 x 100m fuerte descanso 25s - Z4",
      "Serie 4 - Resistencia: 1 x 1200m pull buoy - Z2",
      "Serie 5 - Patada: 12 x 75m patada por estilo descanso 25s - Z3"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Medley individual", group: 2
  },
  {
    week: 13, date: "5 de mayo", day: "Martes", schedule: "PM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 5400, duration: 110,
    warmup: "1000m (600 crol, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 16 x 50m técnica avanzada descanso 15s - Z2",
      "Serie 2 - Pirámide: 100-200-300-400-300-200-100m descanso 25s - Z3-Z4",
      "Serie 3 - VO2max: 20 x 75m muy fuerte descanso 20s - Z4",
      "Serie 4 - Aeróbico: 1 x 1000m crol - Z2",
      "Serie 5 - Sprints: 10 x 50m máxima velocidad descanso 45s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Pirámide completa", group: 2
  },
  {
    week: 13, date: "6 de mayo", day: "Miércoles", schedule: "PM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 5000, duration: 100,
    warmup: "800m (500 crol, 300 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 10 x 100m técnica perfecta descanso 20s - Z2",
      "Serie 2 - 300m ritmo: 8 x 300m ritmo carrera descanso 40s - Z3",
      "Serie 3 - Paracaídas: 10 x 100m con resistencia descanso 35s - Z4",
      "Serie 4 - Resistencia: 1 x 1200m pull buoy - Z2",
      "Serie 5 - Patada: 10 x 75m patada fuerte descanso 25s - Z4"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Alta", focus: "Ritmo 300m", group: 2
  },
  {
    week: 13, date: "7 de mayo", day: "Jueves", schedule: "PM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 5600, duration: 115,
    warmup: "1100m (700 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Drills: 12 x 100m técnica por estilo descanso 20s - Z2",
      "Serie 2 - Umbral: 10 x 300m ritmo muy fuerte descanso 35s - Z3-Z4",
      "Serie 3 - Velocidad: 16 x 75m sprint descanso 25s - Z4-Z5",
      "Serie 4 - Aeróbico: 1 x 1500m crol - Z2",
      "Serie 5 - Patada: 12 x 100m patada descanso 25s - Z3"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Umbral máximo", group: 2
  },
  {
    week: 13, date: "8 de mayo", day: "Viernes", schedule: "PM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 4400, duration: 90,
    warmup: "700m (400 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 10 x 75m drills descanso 20s - Z2",
      "Serie 2 - Ritmo mixto: 6 x 200m (odd: 100m, even: 400m pace) descanso 30s - Z3-Z4",
      "Serie 3 - Velocidad: 12 x 100m fuerte descanso 30s - Z4",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Sprints: 8 x 50m sprint descanso 40s - Z5"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Ritmo mixto", group: 2
  },
  {
    week: 13, date: "9 de mayo", day: "Sábado", schedule: "AM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 5700, duration: 115,
    warmup: "1100m (700 crol, 400 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 14 x 100m drills perfectos descanso 20s - Z2",
      "Serie 2 - Test 100m: 10 x 100m máximo esfuerzo descanso 90s - Z5",
      "Serie 3 - Umbral: 12 x 200m ritmo fuerte descanso 30s - Z3",
      "Serie 4 - Aeróbico: 1 x 1200m pull buoy - Z2",
      "Serie 5 - Patada: 10 x 100m patada fuerte descanso 25s - Z4"
    ],
    cooldown: "700m (500 crol + 200 espalda) Z1",
    intensity: "Muy Alta", focus: "Test 100m", group: 2
  },

  // SEMANA 14 (11-16 May) - TAPER
  {
    week: 14, date: "11 de mayo", day: "Lunes", schedule: "PM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 4800, duration: 95,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 12 x 75m drills económicos descanso 20s - Z2",
      "Serie 2 - Aeróbico: 6 x 400m crol ritmo moderado descanso 40s - Z2",
      "Serie 3 - Velocidad: 10 x 100m fuerte descanso 30s - Z4",
      "Serie 4 - Resistencia: 1 x 1000m pull buoy - Z2",
      "Serie 5 - Patada: 8 x 100m patada descanso 25s - Z2-Z3"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Media", focus: "Reducción volumen", group: 2
  },
  {
    week: 14, date: "12 de mayo", day: "Martes", schedule: "PM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 5000, duration: 100,
    warmup: "900m (600 crol, 300 estilos) Z1",
    mainSet: [
      "Serie 1 - Drills: 10 x 100m técnica impecable descanso 20s - Z2",
      "Serie 2 - Race pace: 4 x 400m ritmo competencia descanso 60s - Z3",
      "Serie 3 - Velocidad: 8 x 100m sprint controlado descanso 35s - Z4",
      "Serie 4 - Aeróbico: 1 x 1200m crol fácil - Z2",
      "Serie 5 - Activación: 8 x 50m sprint descanso 45s - Z4-Z5"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Ritmo competencia", group: 2
  },
  {
    week: 14, date: "13 de mayo", day: "Miércoles", schedule: "PM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 4400, duration: 90,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 10 x 75m drills descanso 20s - Z2",
      "Serie 2 - Aeróbico: 4 x 500m crol ritmo fácil descanso 40s - Z2",
      "Serie 3 - Velocidad: 12 x 75m fuerte descanso 30s - Z3-Z4",
      "Serie 4 - Resistencia: 1 x 800m pull buoy - Z2",
      "Serie 5 - Patada: 8 x 75m patada descanso 25s - Z2"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Media", focus: "Recuperación activa", group: 2
  },
  {
    week: 14, date: "14 de mayo", day: "Jueves", schedule: "PM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 4600, duration: 95,
    warmup: "800m (500 crol, 300 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica: 12 x 75m drills impecables descanso 20s - Z2",
      "Serie 2 - Simulación: 4 x 200m + 4 x 100m ritmo carrera descanso 45s/30s - Z3-Z4",
      "Serie 3 - Velocidad: 8 x 100m sprint controlado descanso 35s - Z4",
      "Serie 4 - Aeróbico: 1 x 1000m crol suave - Z2",
      "Serie 5 - Activación: 6 x 50m sprint descanso 60s - Z5"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Media-Alta", focus: "Simulación carrera", group: 2
  },
  {
    week: 14, date: "15 de mayo", day: "Viernes", schedule: "PM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 3500, duration: 70,
    warmup: "800m (500 crol muy suave, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Activación: 8 x 75m técnica perfecta descanso 25s - Z2",
      "Serie 2 - Velocidad: 4 x 200m ritmo moderado descanso 45s - Z3",
      "Serie 3 - Sprints: 6 x 50m sprint descanso 60s - Z4",
      "Serie 4 - Aeróbico: 1 x 600m crol muy suave - Z1",
      "Serie 5 - Activación: 4 x 50m sprint controlado descanso 90s - Z4"
    ],
    cooldown: "600m (400 crol + 200 espalda muy suave) Z1",
    intensity: "Media", focus: "Pre-competencia", group: 2
  },
  {
    week: 14, date: "16 de mayo", day: "Sábado", schedule: "AM",
    mesociclo: "Bloque 3", bloque: "Medio Fondo", distance: 0, duration: 0,
    warmup: "Competencia - Copa Chile 3 (Medio Fondo)",
    mainSet: ["DÍA DE COMPETENCIA - Copa Chile 3 - Pruebas de 100m, 200m y 400m"],
    cooldown: "Recuperación post-competencia",
    intensity: "Competencia", focus: "Copa Chile 3 - 100m, 200m y 400m",
    isChallenge: true, challengeName: "Copa Chile 3 - Medio Fondo", group: 2
  }
];
