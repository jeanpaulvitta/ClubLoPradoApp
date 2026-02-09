import { Workout } from './workouts';

/**
 * ENTRENAMIENTOS GRUPO 2 (MAYORES) - TEMPORADA 2026-2027
 * 
 * Categorías: Inf B1 '14, Inf B2 '13, Juv A1 '12, Juv A2 '11, Juv B1 '10, Juv B2 '09, Juv B3 '08, Mayores '07
 * 
 * Características:
 * - Duración: 90-120 minutos por sesión
 * - Horario: Lunes a Viernes PM, Sábados AM
 * - Inicio: 9 de febrero 2026
 * - Zonas de entrenamiento: Z1 (Recuperación), Z2 (Aeróbico), Z3 (Umbral), Z4 (VO2max), Z5 (Velocidad/Sprint)
 * - Materiales: Pull buoy, aletas, paletas, paracaídas, tabla, snorkel
 * 
 * ESTRUCTURA DE 10 BLOQUES:
 * 1. Velocidad Inicial (6 sem) → Copa Chile 1 - 50m (21-22 Mar)
 * 2. Fondo (4 sem) → Copa Chile 2 - 800-1500m (17-19 Abr)
 * 3. Medio Fondo (4 sem) → Copa Chile 3 - 100-400m (15-17 May)
 * 4. Competitivo Mayor (6 sem) → Nacionales Jun-Jul (6 Jun - 5 Jul)
 * 5. Internacional (6 sem) → Brasil + Nacional Des. (20 Jul - 16 Ago)
 * 6. Velocidad 2 (4 sem) → Copa Chile 1 (12-13 Sep)
 * 7. Fondo 2 (4 sem) → Copa Chile 2 (2-4 Oct)
 * 8. Medio Fondo 2 (5 sem) → Copa Chile 3 (6-8 Nov)
 * 9. Preparación (9 sem) → Preparación Nacionales (Nov-Dic)
 * 10. Pico Competitivo (4 sem) → Nacionales Verano 2027 (9 Ene - 7 Feb)
 */

export const workoutsGroup2: Workout[] = [
  
  // ==================== BLOQUE 1: VELOCIDAD INICIAL ====================
  // Fecha Inicio: 9 Feb 2026 | Duración: 6 semanas | Objetivo: Preparación Copa Chile 50m
  // Enfoque: Desarrollo de potencia, explosividad y velocidad de reacción
  
  // SEMANA 1 (9-14 Feb)
  {
    week: 1,
    date: "9 de febrero",
    day: "Lunes",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 4500,
    duration: 90,
    warmup: "600m (300 crol, 200 técnica variada, 100 patada) Z1",
    mainSet: [
      "Serie 1 - Técnica: 8 x 50m (25 drill + 25 swim) descanso 15s - Z2",
      "Serie 2 - Activación: 4 x 100m crol progresivo (25 suave→25 fuerte) descanso 20s - Z2-Z3",
      "Serie 3 - Velocidad: 16 x 25m sprint (odd: crol, even: estilo) descanso 30s - Z5",
      "Serie 4 - Resistencia: 3 x 400m pull buoy ritmo constante descanso 40s - Z2",
      "Serie 5 - Patada: 8 x 50m patada con tabla (4 crol, 2 espalda, 2 mariposa) descanso 20s - Z3"
    ],
    cooldown: "300m (200 crol suave + 100 espalda) Z1",
    intensity: "Media",
    focus: "Técnica, velocidad explosiva, desarrollo aeróbico base",
    group: 2
  },
  {
    week: 1,
    date: "10 de febrero",
    day: "Martes",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 5000,
    duration: 100,
    warmup: "800m (400 crol, 200 espalda/pecho, 200 técnica mixta) Z1",
    mainSet: [
      "Serie 1 - Drills: 10 x 50m (25 drill crol + 25 swim) descanso 15s - Z2",
      "Serie 2 - Umbral: 5 x 200m (100 crol + 50 estilo + 50 crol) descanso 25s - Z3",
      "Serie 3 - Potencia con paletas: 12 x 50m paletas (odd: build, even: fuerte) descanso 25s - Z4",
      "Serie 4 - Resistencia: 4 x 300m pull buoy ritmo moderado descanso 35s - Z2",
      "Serie 5 - Velocidad: 8 x 25m salida de bloque máxima velocidad descanso 45s - Z5"
    ],
    cooldown: "300m (150 crol + 150 espalda suave) Z1",
    intensity: "Alta",
    focus: "Potencia con paletas, trabajo de umbral, salidas explosivas",
    group: 2
  },
  {
    week: 1,
    date: "11 de febrero",
    day: "Miércoles",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 4800,
    duration: 95,
    warmup: "600m (400 combinado, 200 patada variada) Z1",
    mainSet: [
      "Serie 1 - Técnica 4 estilos: 8 x 75m (25 drill + 50 swim) por estilo descanso 20s - Z2",
      "Serie 2 - VO2max: 10 x 100m (75 fuerte + 25 fácil) descanso 20s - Z4",
      "Serie 3 - Sprints con paracaídas: 10 x 50m con resistencia descanso 40s - Z4-Z5",
      "Serie 4 - Aeróbico: 1 x 1000m pull buoy ritmo constante - Z2",
      "Serie 5 - Patada: 6 x 75m patada (crol/espalda alternado) descanso 25s - Z3"
    ],
    cooldown: "400m (200 crol suave + 200 espalda) Z1",
    intensity: "Alta",
    focus: "VO2max, resistencia con paracaídas, volumen aeróbico",
    group: 2
  },
  {
    week: 1,
    date: "12 de febrero",
    day: "Jueves",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 5200,
    duration: 105,
    warmup: "800m (300 crol, 300 técnica mixta, 200 patada) Z1",
    mainSet: [
      "Serie 1 - Técnica progresiva: 12 x 50m drills variados descanso 15s - Z2",
      "Serie 2 - Ritmo: 6 x 200m descending (cada 200 más rápido) descanso 30s - Z2→Z4",
      "Serie 3 - Velocidad pura: 20 x 25m sprint máximo (alterna crol/estilo) descanso 30s - Z5",
      "Serie 4 - Fuerza: 8 x 100m paletas + pull (50 fuerte + 50 moderado) descanso 30s - Z3",
      "Serie 5 - Resistencia: 2 x 500m crol ritmo competencia descanso 60s - Z3"
    ],
    cooldown: "300m (100 cada estilo suave) Z1",
    intensity: "Muy alta",
    focus: "Velocidad máxima, fuerza con paletas, ritmo de carrera",
    group: 2
  },
  {
    week: 1,
    date: "13 de febrero",
    day: "Viernes",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 4600,
    duration: 95,
    warmup: "700m (400 crol variado, 300 técnica 4 estilos) Z1",
    mainSet: [
      "Serie 1 - Técnica fina: 10 x 50m (25 drill + 25 swim perfecto) descanso 20s - Z2",
      "Serie 2 - Velocidad sostenida: 12 x 75m (50 fuerte + 25 fácil) descanso 20s - Z3-Z4",
      "Serie 3 - Sprints: 16 x 25m máxima velocidad descanso 30s - Z5",
      "Serie 4 - Aeróbico: 1 x 800m pull buoy + 1 x 600m crol ritmo constante - Z2",
      "Serie 5 - Patada rápida: 8 x 50m patada (4 con aletas, 4 sin aletas) descanso 25s - Z3-Z4"
    ],
    cooldown: "350m (200 crol + 150 espalda suave) Z1",
    intensity: "Media-Alta",
    focus: "Velocidad repetida, técnica perfecta, trabajo con aletas",
    group: 2
  },
  {
    week: 1,
    date: "14 de febrero",
    day: "Sábado",
    schedule: "AM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 5500,
    duration: 110,
    warmup: "1000m (600 crol progresivo, 400 técnica + patada) Z1",
    mainSet: [
      "Serie 1 - Simulación competencia: 8 x 50m todos los estilos con salida de bloque descanso 45s - Z4",
      "Serie 2 - Potencia: 6 x 100m paletas máxima potencia descanso 60s - Z4-Z5",
      "Serie 3 - Velocidad resistida: 12 x 50m con paracaídas descanso 35s - Z4",
      "Serie 4 - Aeróbico extenso: 1 x 1500m crol ritmo constante (cada 500m medir tiempo) - Z2",
      "Serie 5 - Velocidad final: 10 x 25m sprint all-out descanso 40s - Z5"
    ],
    cooldown: "400m (200 cada estilo suave) Z1",
    intensity: "Muy alta",
    focus: "Simulación competencia, potencia máxima, volumen aeróbico",
    group: 2
  },

  // SEMANA 2 (16-21 Feb) - PROGRESIÓN
  {
    week: 2,
    date: "16 de febrero",
    day: "Lunes",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 4700,
    duration: 95,
    warmup: "700m (400 crol, 200 drills, 100 patada) Z1",
    mainSet: [
      "Serie 1 - Técnica: 12 x 50m (drills variados todos los estilos) descanso 15s - Z2",
      "Serie 2 - Umbral: 8 x 100m ritmo competencia 100m descanso 20s - Z3",
      "Serie 3 - Velocidad: 18 x 25m sprint (6 crol, 6 espalda, 6 mariposa) descanso 25s - Z5",
      "Serie 4 - Resistencia: 4 x 300m pull buoy descending descanso 35s - Z2-Z3",
      "Serie 5 - Patada: 10 x 50m patada alterna crol/estilo descanso 20s - Z3"
    ],
    cooldown: "350m (200 crol + 150 espalda) Z1",
    intensity: "Alta",
    focus: "Ritmo de competencia 100m, sprints específicos por estilo",
    group: 2
  },
  {
    week: 2,
    date: "17 de febrero",
    day: "Martes",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 5200,
    duration: 105,
    warmup: "800m (500 crol variado, 300 técnica mixta) Z1",
    mainSet: [
      "Serie 1 - Drills progresivos: 10 x 75m (25 drill + 50 swim build) descanso 20s - Z2",
      "Serie 2 - VO2max: 12 x 100m (80 fuerte + 20 fácil) descanso 15s - Z4",
      "Serie 3 - Potencia máxima: 8 x 50m paletas + pull sprint descanso 45s - Z5",
      "Serie 4 - Aeróbico: 3 x 500m crol ritmo constante descanso 45s - Z2",
      "Serie 5 - Velocidad: 12 x 25m salidas explosivas descanso 35s - Z5"
    ],
    cooldown: "400m (200 combinado + 200 crol) Z1",
    intensity: "Muy alta",
    focus: "VO2max intenso, potencia con paletas, salidas explosivas",
    group: 2
  },
  {
    week: 2,
    date: "18 de febrero",
    day: "Miércoles",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 4900,
    duration: 100,
    warmup: "700m (300 crol, 200 espalda, 200 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica 4 estilos: 16 x 25m drills (4 por estilo) descanso 15s - Z2",
      "Serie 2 - Resistencia velocidad: 10 x 100m (75 rápido + 25 fácil) descanso 20s - Z3-Z4",
      "Serie 3 - Sprints resistidos: 12 x 50m con paracaídas descanso 40s - Z4",
      "Serie 4 - Aeróbico: 1 x 1200m pull buoy ritmo moderado - Z2",
      "Serie 5 - Patada potente: 8 x 75m patada (4 con aletas fuerte, 4 sin aletas) descanso 30s - Z4"
    ],
    cooldown: "400m (100 cada estilo) Z1",
    intensity: "Alta",
    focus: "Resistencia con paracaídas, patada potente con aletas",
    group: 2
  },
  {
    week: 2,
    date: "19 de febrero",
    day: "Jueves",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 5400,
    duration: 110,
    warmup: "900m (500 crol progresivo, 400 técnica + patada) Z1",
    mainSet: [
      "Serie 1 - Técnica perfecta: 12 x 50m (25 drill perfecto + 25 aplicación) descanso 15s - Z2",
      "Serie 2 - Descending: 8 x 200m cada 200 más rápido descanso 30s - Z2→Z4",
      "Serie 3 - Velocidad máxima: 24 x 25m sprint all-out descanso 30s - Z5",
      "Serie 4 - Fuerza: 6 x 150m paletas ritmo fuerte descanso 35s - Z3",
      "Serie 5 - Resistencia: 2 x 600m crol ritmo competencia descanso 60s - Z3"
    ],
    cooldown: "350m (200 crol + 150 espalda) Z1",
    intensity: "Muy alta",
    focus: "Series descending, volumen de sprints, fuerza sostenida",
    group: 2
  },
  {
    week: 2,
    date: "20 de febrero",
    day: "Viernes",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 4800,
    duration: 95,
    warmup: "700m (400 crol, 300 técnica variada) Z1",
    mainSet: [
      "Serie 1 - Drills finos: 10 x 50m técnica perfecta descanso 20s - Z2",
      "Serie 2 - Velocidad sostenida: 15 x 75m (50 fuerte + 25 fácil) descanso 20s - Z3-Z4",
      "Serie 3 - Sprints: 20 x 25m máxima velocidad alternando estilos descanso 30s - Z5",
      "Serie 4 - Aeróbico: 1 x 1000m pull + 1 x 500m crol - Z2",
      "Serie 5 - Patada: 10 x 50m patada mixta con/sin aletas descanso 25s - Z3"
    ],
    cooldown: "400m (200 crol + 200 espalda) Z1",
    intensity: "Alta",
    focus: "Volumen de velocidad, resistencia aeróbica",
    group: 2
  },
  {
    week: 2,
    date: "21 de febrero",
    day: "Sábado",
    schedule: "AM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 5600,
    duration: 115,
    warmup: "1000m (600 crol, 400 técnica + drills) Z1",
    mainSet: [
      "Serie 1 - Competencia simulada: 8 x 50m todos estilos con salida + viraje descanso 50s - Z4",
      "Serie 2 - Potencia: 8 x 100m paletas + pull máxima potencia descanso 60s - Z4-Z5",
      "Serie 3 - Resistencia velocidad: 10 x 100m (75 rápido + 25 recuperación) descanso 25s - Z4",
      "Serie 4 - Volumen aeróbico: 1 x 1600m crol ritmo constante - Z2",
      "Serie 5 - Velocidad final: 12 x 25m sprint máximo descanso 40s - Z5"
    ],
    cooldown: "400m (100 cada estilo suave) Z1",
    intensity: "Muy alta",
    focus: "Simulación competencia completa, potencia máxima, volumen",
    group: 2
  },

  // SEMANA 3 (23-28 Feb) - INTENSIFICACIÓN
  {
    week: 3,
    date: "23 de febrero",
    day: "Lunes",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 4900,
    duration: 100,
    warmup: "800m (500 crol variado, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica específica: 16 x 50m drills (4 por estilo) descanso 15s - Z2",
      "Serie 2 - Umbral alto: 10 x 100m ritmo 100m competencia descanso 15s - Z3-Z4",
      "Serie 3 - Velocidad explosiva: 20 x 25m sprint (alternando estilos) descanso 25s - Z5",
      "Serie 4 - Resistencia: 3 x 400m pull descending descanso 40s - Z2-Z3",
      "Serie 5 - Patada potente: 12 x 50m patada (6 crol fuerte, 6 mariposa) descanso 20s - Z4"
    ],
    cooldown: "400m (200 crol + 200 espalda) Z1",
    intensity: "Muy alta",
    focus: "Ritmo competencia 100m, explosividad máxima",
    group: 2
  },
  {
    week: 3,
    date: "24 de febrero",
    day: "Martes",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 5400,
    duration: 110,
    warmup: "900m (500 crol, 400 técnica + patada) Z1",
    mainSet: [
      "Serie 1 - Drills avanzados: 12 x 75m (25 drill + 50 swim fuerte) descanso 20s - Z2-Z3",
      "Serie 2 - VO2max intenso: 15 x 100m (80 muy fuerte + 20 fácil) descanso 15s - Z4",
      "Serie 3 - Potencia: 10 x 50m paletas sprint máximo descanso 50s - Z5",
      "Serie 4 - Aeróbico: 2 x 600m + 1 x 800m crol ritmo constante descanso 45s - Z2",
      "Serie 5 - Velocidad pura: 16 x 25m salidas máxima velocidad descanso 35s - Z5"
    ],
    cooldown: "450m (250 crol + 200 espalda) Z1",
    intensity: "Muy alta",
    focus: "VO2max máximo, potencia con paletas",
    group: 2
  },
  {
    week: 3,
    date: "25 de febrero",
    day: "Miércoles",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 5100,
    duration: 105,
    warmup: "800m (400 crol, 400 mixto) Z1",
    mainSet: [
      "Serie 1 - Técnica 4 estilos: 12 x 50m (25 drill + 25 swim) descanso 15s - Z2",
      "Serie 2 - Broken swim: 4 x (4 x 25m) sprint con 10s descanso, 60s entre sets - Z5",
      "Serie 3 - Resistencia paracaídas: 15 x 50m con resistencia descanso 35s - Z4",
      "Serie 4 - Volumen aeróbico: 1 x 1400m pull ritmo moderado - Z2",
      "Serie 5 - Patada con aletas: 10 x 75m aletas (5 crol, 5 mariposa) descanso 25s - Z4"
    ],
    cooldown: "450m (200 crol + 250 espalda) Z1",
    intensity: "Alta",
    focus: "Broken swims para velocidad, resistencia con paracaídas",
    group: 2
  },
  {
    week: 3,
    date: "26 de febrero",
    day: "Jueves",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 5600,
    duration: 115,
    warmup: "1000m (600 crol progresivo, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica perfecta: 16 x 50m drills variados descanso 15s - Z2",
      "Serie 2 - Descending agresivo: 10 x 200m cada vez más rápido descanso 25s - Z2→Z4",
      "Serie 3 - Velocidad máxima: 28 x 25m sprint all-out descanso 30s - Z5",
      "Serie 4 - Fuerza sostenida: 8 x 150m paletas ritmo fuerte descanso 30s - Z3-Z4",
      "Serie 5 - Test: 4 x 100m crol máxima velocidad descanso 2min (simular competencia) - Z5"
    ],
    cooldown: "400m (200 crol + 200 espalda) Z1",
    intensity: "Muy alta",
    focus: "Test de velocidad, descending extremo, volumen sprints",
    group: 2
  },
  {
    week: 3,
    date: "27 de febrero",
    day: "Viernes",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 5000,
    duration: 100,
    warmup: "700m (400 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills finos: 12 x 50m técnica perfecta descanso 20s - Z2",
      "Serie 2 - Velocidad mantenida: 18 x 75m (50 fuerte + 25 fácil) descanso 20s - Z3-Z4",
      "Serie 3 - Sprints: 24 x 25m máxima velocidad (6 de cada estilo) descanso 30s - Z5",
      "Serie 4 - Aeróbico: 1 x 1200m pull + 1 x 600m crol - Z2",
      "Serie 5 - Patada: 12 x 50m patada variada descanso 25s - Z3"
    ],
    cooldown: "450m (250 crol + 200 espalda) Z1",
    intensity: "Alta",
    focus: "Volumen de velocidad, resistencia base",
    group: 2
  },
  {
    week: 3,
    date: "28 de febrero",
    day: "Sábado",
    schedule: "AM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 5800,
    duration: 120,
    warmup: "1200m (700 crol, 500 técnica + drills + patada) Z1",
    mainSet: [
      "Serie 1 - Race pace: 12 x 50m todos estilos ritmo competencia con salida descanso 45s - Z4",
      "Serie 2 - Potencia máxima: 10 x 100m paletas + pull sprint descanso 75s - Z5",
      "Serie 3 - Velocidad resistida: 12 x 75m con paracaídas descanso 40s - Z4",
      "Serie 4 - Volumen aeróbico: 1 x 1800m crol ritmo constante - Z2",
      "Serie 5 - Velocidad final: 16 x 25m sprint máximo descanso 40s - Z5"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Muy alta",
    focus: "Race pace todos estilos, máxima potencia, volumen",
    group: 2
  },

  // SEMANA 4 (2-7 Mar) - PRE-COMPETENCIA
  {
    week: 4,
    date: "2 de marzo",
    day: "Lunes",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 5000,
    duration: 100,
    warmup: "800m (500 crol variado, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Activación técnica: 12 x 50m drills específicos descanso 15s - Z2",
      "Serie 2 - Ritmo carrera: 12 x 100m ritmo 100m competencia descanso 20s - Z3-Z4",
      "Serie 3 - Velocidad explosiva: 24 x 25m sprint (6 de cada estilo) descanso 25s - Z5",
      "Serie 4 - Resistencia: 4 x 400m pull descending descanso 40s - Z2-Z3",
      "Serie 5 - Patada rápida: 10 x 50m patada fuerte descanso 20s - Z4"
    ],
    cooldown: "400m (200 crol + 200 espalda) Z1",
    intensity: "Alta",
    focus: "Ritmo de competencia, velocidad por estilo",
    group: 2
  },
  {
    week: 4,
    date: "3 de marzo",
    day: "Martes",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 5500,
    duration: 110,
    warmup: "900m (600 crol, 300 técnica + patada) Z1",
    mainSet: [
      "Serie 1 - Técnica fina: 16 x 50m drills perfectos descanso 15s - Z2",
      "Serie 2 - VO2max: 18 x 100m (75 fuerte + 25 fácil) descanso 15s - Z4",
      "Serie 3 - Potencia paletas: 12 x 50m paletas sprint descanso 45s - Z5",
      "Serie 4 - Aeróbico: 3 x 600m crol ritmo constante descanso 45s - Z2",
      "Serie 5 - Velocidad: 20 x 25m salidas explosivas descanso 35s - Z5"
    ],
    cooldown: "450m (250 crol + 200 espalda) Z1",
    intensity: "Muy alta",
    focus: "VO2max, potencia máxima con paletas",
    group: 2
  },
  {
    week: 4,
    date: "4 de marzo",
    day: "Miércoles",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 5200,
    duration: 105,
    warmup: "800m (400 crol, 400 mixto) Z1",
    mainSet: [
      "Serie 1 - Drills 4 estilos: 16 x 50m (25 drill + 25 swim) descanso 15s - Z2",
      "Serie 2 - Race simulation: 8 x 100m ritmo competencia con virajes descanso 60s - Z4",
      "Serie 3 - Sprints paracaídas: 16 x 50m con resistencia descanso 35s - Z4",
      "Serie 4 - Volumen: 1 x 1500m pull ritmo moderado - Z2",
      "Serie 5 - Patada aletas: 12 x 75m con aletas (6 crol, 6 mariposa) descanso 25s - Z4"
    ],
    cooldown: "450m (250 crol + 200 espalda) Z1",
    intensity: "Alta",
    focus: "Simulación de carrera, resistencia con paracaídas",
    group: 2
  },
  {
    week: 4,
    date: "5 de marzo",
    day: "Jueves",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 5700,
    duration: 115,
    warmup: "1000m (600 crol progresivo, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica perfecta: 20 x 50m drills variados descanso 15s - Z2",
      "Serie 2 - Descending extremo: 12 x 200m cada vez más rápido descanso 25s - Z2→Z5",
      "Serie 3 - Velocidad máxima: 32 x 25m sprint all-out descanso 30s - Z5",
      "Serie 4 - Fuerza: 10 x 150m paletas ritmo fuerte descanso 30s - Z3-Z4",
      "Serie 5 - Test final: 6 x 50m todos estilos máxima velocidad descanso 2min - Z5"
    ],
    cooldown: "450m (250 crol + 200 espalda) Z1",
    intensity: "Muy alta",
    focus: "Test pre-competencia, descending extremo",
    group: 2
  },
  {
    week: 4,
    date: "6 de marzo",
    day: "Viernes",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 4500,
    duration: 90,
    warmup: "700m (400 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Activación suave: 10 x 50m técnica perfecta descanso 20s - Z2",
      "Serie 2 - Velocidad controlada: 12 x 75m (50 fuerte + 25 fácil) descanso 25s - Z3",
      "Serie 3 - Sprints: 16 x 25m máxima velocidad descanso 35s - Z5",
      "Serie 4 - Aeróbico: 1 x 1000m crol ritmo fácil - Z2",
      "Serie 5 - Patada suave: 8 x 50m patada relajada descanso 25s - Z2"
    ],
    cooldown: "500m (300 crol + 200 espalda muy suave) Z1",
    intensity: "Media",
    focus: "Recuperación activa, mantener sensaciones",
    group: 2
  },
  {
    week: 4,
    date: "7 de marzo",
    day: "Sábado",
    schedule: "AM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 4000,
    duration: 80,
    warmup: "1000m (600 crol suave, 400 técnica muy suave) Z1",
    mainSet: [
      "Serie 1 - Activación: 8 x 50m técnica perfecta con salida descanso 30s - Z2",
      "Serie 2 - Race pace suave: 6 x 50m ritmo competencia descanso 60s - Z3",
      "Serie 3 - Sprints cortos: 8 x 25m sprint controlado descanso 45s - Z4",
      "Serie 4 - Aeróbico ligero: 1 x 800m crol ritmo cómodo - Z2",
      "Serie 5 - Velocidad final: 6 x 25m sprint máximo descanso 60s - Z5"
    ],
    cooldown: "600m (400 crol + 200 espalda muy suave) Z1",
    intensity: "Media",
    focus: "Taper week - mantener velocidad, recuperar energía",
    group: 2
  },

  // SEMANA 5 (9-14 Mar) - TAPER
  {
    week: 5,
    date: "9 de marzo",
    day: "Lunes",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 4200,
    duration: 85,
    warmup: "800m (500 crol suave, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica fina: 10 x 50m drills perfectos descanso 20s - Z2",
      "Serie 2 - Velocidad mantenida: 10 x 100m ritmo 100m descanso 25s - Z3",
      "Serie 3 - Sprints: 16 x 25m sprint (4 de cada estilo) descanso 30s - Z5",
      "Serie 4 - Aeróbico: 2 x 400m pull ritmo fácil descanso 45s - Z2",
      "Serie 5 - Patada: 8 x 50m patada suave descanso 25s - Z2"
    ],
    cooldown: "400m (200 crol + 200 espalda) Z1",
    intensity: "Media",
    focus: "Taper - mantener velocidad, reducir volumen",
    group: 2
  },
  {
    week: 5,
    date: "10 de marzo",
    day: "Martes",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 4500,
    duration: 90,
    warmup: "700m (400 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Activación: 12 x 50m técnica variada descanso 20s - Z2",
      "Serie 2 - Race pace: 8 x 75m ritmo competencia descanso 30s - Z4",
      "Serie 3 - Potencia: 8 x 50m paletas sprint descanso 50s - Z5",
      "Serie 4 - Aeróbico: 1 x 1000m crol ritmo cómodo - Z2",
      "Serie 5 - Velocidad: 12 x 25m salidas explosivas descanso 40s - Z5"
    ],
    cooldown: "450m (250 crol + 200 espalda) Z1",
    intensity: "Media-Alta",
    focus: "Mantener potencia y velocidad, bajo volumen",
    group: 2
  },
  {
    week: 5,
    date: "11 de marzo",
    day: "Miércoles",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 4000,
    duration: 80,
    warmup: "700m (400 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills suaves: 8 x 50m técnica perfecta descanso 20s - Z2",
      "Serie 2 - Velocidad: 12 x 50m (25 fuerte + 25 fácil) descanso 25s - Z3-Z4",
      "Serie 3 - Sprints: 12 x 25m sprint máximo descanso 35s - Z5",
      "Serie 4 - Aeróbico: 1 x 800m pull ritmo fácil - Z2",
      "Serie 5 - Patada: 8 x 50m patada variada descanso 25s - Z2"
    ],
    cooldown: "400m (200 crol + 200 espalda) Z1",
    intensity: "Media",
    focus: "Recuperación, mantener sensaciones de velocidad",
    group: 2
  },
  {
    week: 5,
    date: "12 de marzo",
    day: "Jueves",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 4300,
    duration: 85,
    warmup: "800m (500 crol suave, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 10 x 50m drills variados descanso 20s - Z2",
      "Serie 2 - Race simulation: 6 x 100m ritmo competencia con virajes descanso 60s - Z4",
      "Serie 3 - Velocidad: 20 x 25m sprint (5 de cada estilo) descanso 30s - Z5",
      "Serie 4 - Aeróbico: 1 x 600m crol ritmo moderado - Z2",
      "Serie 5 - Velocidad final: 8 x 25m sprint máximo descanso 45s - Z5"
    ],
    cooldown: "450m (250 crol + 200 espalda) Z1",
    intensity: "Media-Alta",
    focus: "Simulación de carrera, afinar técnica",
    group: 2
  },
  {
    week: 5,
    date: "13 de marzo",
    day: "Viernes",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 3500,
    duration: 70,
    warmup: "700m (400 crol, 300 técnica muy suave) Z1",
    mainSet: [
      "Serie 1 - Activación: 8 x 50m técnica perfecta descanso 25s - Z2",
      "Serie 2 - Velocidad: 8 x 50m ritmo competencia descanso 40s - Z3",
      "Serie 3 - Sprints: 12 x 25m sprint descanso 40s - Z5",
      "Serie 4 - Aeróbico: 1 x 600m crol muy suave - Z1-Z2",
      "Serie 5 - Velocidad final: 6 x 25m sprint máximo descanso 60s - Z5"
    ],
    cooldown: "500m (300 crol + 200 espalda muy suave) Z1",
    intensity: "Media",
    focus: "Pre-competencia, energía fresca",
    group: 2
  },
  {
    week: 5,
    date: "14 de marzo",
    day: "Sábado",
    schedule: "AM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 3000,
    duration: 60,
    warmup: "1000m (600 crol muy suave, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Activación: 6 x 50m técnica con salida descanso 30s - Z2",
      "Serie 2 - Race pace: 4 x 50m ritmo competencia todos estilos descanso 90s - Z3",
      "Serie 3 - Sprints: 8 x 25m sprint suave descanso 45s - Z4",
      "Serie 4 - Aeróbico: 1 x 400m crol muy suave - Z1",
      "Serie 5 - Activación final: 4 x 25m sprint controlado descanso 60s - Z4"
    ],
    cooldown: "600m (400 crol + 200 espalda muy suave) Z1",
    intensity: "Baja",
    focus: "Taper final, descanso activo, preparación mental",
    group: 2
  },

  // SEMANA 6 (16-21 Mar) - COMPETENCIA + RECUPERACIÓN
  {
    week: 6,
    date: "16 de marzo",
    day: "Lunes",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 3200,
    duration: 65,
    warmup: "800m (500 crol muy suave, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Activación técnica: 8 x 50m drills perfectos descanso 25s - Z2",
      "Serie 2 - Velocidad controlada: 6 x 75m ritmo moderado descanso 30s - Z3",
      "Serie 3 - Sprints suaves: 10 x 25m sprint controlado descanso 40s - Z4",
      "Serie 4 - Aeróbico: 1 x 600m crol ritmo fácil - Z2",
      "Serie 5 - Velocidad: 6 x 25m sprint descanso 60s - Z5"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Media",
    focus: "Pre-competencia, activación neuromuscular",
    group: 2
  },
  {
    week: 6,
    date: "17 de marzo",
    day: "Martes",
    schedule: "PM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 2500,
    duration: 50,
    warmup: "1000m (600 crol muy suave, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Activación: 6 x 50m técnica perfecta descanso 30s - Z2",
      "Serie 2 - Race pace: 4 x 50m ritmo competencia con salida descanso 90s - Z3",
      "Serie 3 - Sprints: 6 x 25m sprint máximo descanso 60s - Z5",
      "Serie 4 - Aeróbico suave: 1 x 400m crol muy suave - Z1"
    ],
    cooldown: "500m (300 crol + 200 espalda muy suave) Z1",
    intensity: "Baja",
    focus: "Día antes de competencia, mantener activación",
    group: 2
  },
  // 18-20 Marzo: Descanso o activación mínima pre-competencia
  // 21-22 Marzo: COPA CHILE 1 - 50m (COMPETENCIA)
  
  {
    week: 6,
    date: "21 de marzo",
    day: "Sábado",
    schedule: "AM",
    mesociclo: "Bloque 1",
    bloque: "Velocidad Inicial",
    distance: 0,
    duration: 0,
    warmup: "Competencia - Copa Chile 1 (50m)",
    mainSet: ["DÍA DE COMPETENCIA - Copa Chile 1 - Pruebas de 50m"],
    cooldown: "Recuperación post-competencia",
    intensity: "Competencia",
    focus: "Copa Chile 1 - 50m todos los estilos",
    isChallenge: true,
    challengeName: "Copa Chile 1 - 50m",
    group: 2
  },

  // ==================== BLOQUE 2: FONDO ====================
  // Fecha Inicio: 23 Mar 2026 | Duración: 4 semanas | Objetivo: Preparación Copa Chile 800-1500m
  // Enfoque: Desarrollo capacidad aeróbica, resistencia de larga distancia, economía de nado
  
  // SEMANA 7 (23-28 Mar) - TRANSICIÓN A FONDO
  {
    week: 7,
    date: "23 de marzo",
    day: "Lunes",
    schedule: "PM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 5000,
    duration: 105,
    warmup: "800m (400 crol, 400 técnica aeróbica) Z1",
    mainSet: [
      "Serie 1 - Técnica económica: 12 x 100m drills (25 drill + 75 swim) descanso 20s - Z2",
      "Serie 2 - Aeróbico base: 3 x 600m crol ritmo constante descanso 30s - Z2",
      "Serie 3 - Umbral: 8 x 200m ritmo moderado-fuerte descanso 25s - Z3",
      "Serie 4 - Resistencia pull: 1 x 1000m pull buoy ritmo constante - Z2",
      "Serie 5 - Patada aeróbica: 10 x 100m patada suave descanso 20s - Z2"
    ],
    cooldown: "400m (200 crol + 200 espalda) Z1",
    intensity: "Media",
    focus: "Transición a volumen, base aeróbica, economía de nado",
    group: 2
  },
  {
    week: 7,
    date: "24 de marzo",
    day: "Martes",
    schedule: "PM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 5500,
    duration: 115,
    warmup: "900m (500 crol variado, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills largos: 10 x 100m (50 drill + 50 swim) descanso 20s - Z2",
      "Serie 2 - Volumen aeróbico: 4 x 500m crol ritmo constante descanso 35s - Z2",
      "Serie 3 - Umbral sostenido: 6 x 300m ritmo fuerte descanso 30s - Z3",
      "Serie 4 - Resistencia: 1 x 1200m pull ritmo moderado - Z2",
      "Serie 5 - Patada larga: 8 x 100m patada con tabla descanso 25s - Z2"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Media",
    focus: "Volumen aeróbico, resistencia sostenida",
    group: 2
  },
  {
    week: 7,
    date: "25 de marzo",
    day: "Miércoles",
    schedule: "PM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 5200,
    duration: 110,
    warmup: "800m (400 crol, 400 mixto) Z1",
    mainSet: [
      "Serie 1 - Técnica 4 estilos: 16 x 75m drills (4 por estilo) descanso 20s - Z2",
      "Serie 2 - Resistencia progresiva: 5 x 400m descending descanso 35s - Z2→Z3",
      "Serie 3 - Umbral: 10 x 200m ritmo fuerte descanso 20s - Z3",
      "Serie 4 - Volumen: 1 x 1000m crol ritmo constante - Z2",
      "Serie 5 - Patada: 10 x 100m patada variada descanso 25s - Z2"
    ],
    cooldown: "500m (250 crol + 250 espalda) Z1",
    intensity: "Media-Alta",
    focus: "Resistencia progresiva, trabajo de umbral",
    group: 2
  },
  {
    week: 7,
    date: "26 de marzo",
    day: "Jueves",
    schedule: "PM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 5800,
    duration: 120,
    warmup: "1000m (600 crol progresivo, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica económica: 12 x 100m técnica perfecta descanso 20s - Z2",
      "Serie 2 - Volumen largo: 2 x 800m + 1 x 1000m crol ritmo constante descanso 45s - Z2",
      "Serie 3 - Umbral: 8 x 250m ritmo fuerte descanso 25s - Z3",
      "Serie 4 - Resistencia pull: 1 x 1200m pull buoy - Z2",
      "Serie 5 - Patada aeróbica: 12 x 75m patada descanso 20s - Z2"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Media-Alta",
    focus: "Volumen extenso, economía de nado",
    group: 2
  },
  {
    week: 7,
    date: "27 de marzo",
    day: "Viernes",
    schedule: "PM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 5400,
    duration: 110,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 16 x 50m técnica variada descanso 15s - Z2",
      "Serie 2 - Aeróbico: 6 x 400m crol ritmo constante descanso 30s - Z2",
      "Serie 3 - Umbral: 12 x 150m ritmo fuerte descanso 20s - Z3",
      "Serie 4 - Resistencia: 1 x 1000m pull ritmo moderado - Z2",
      "Serie 5 - Patada: 10 x 100m patada con aletas descanso 25s - Z2"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Media",
    focus: "Consolidación aeróbica, economía",
    group: 2
  },
  {
    week: 7,
    date: "28 de marzo",
    day: "Sábado",
    schedule: "AM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 6000,
    duration: 120,
    warmup: "1200m (700 crol, 500 técnica + drills) Z1",
    mainSet: [
      "Serie 1 - Activación: 10 x 100m técnica perfecta descanso 20s - Z2",
      "Serie 2 - Volumen largo: 1 x 2000m crol ritmo constante (split cada 500m) - Z2",
      "Serie 3 - Umbral: 10 x 200m ritmo fuerte descanso 25s - Z3",
      "Serie 4 - Resistencia: 1 x 1500m pull ritmo moderado - Z2",
      "Serie 5 - Patada aeróbica: 10 x 100m patada descanso 25s - Z2"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Alta",
    focus: "Test 2000m, volumen máximo semanal",
    group: 2
  },

  // SEMANA 8 (30 Mar - 4 Abr) - INTENSIFICACIÓN FONDO
  {
    week: 8,
    date: "30 de marzo",
    day: "Lunes",
    schedule: "PM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 5600,
    duration: 115,
    warmup: "900m (500 crol, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica sostenida: 12 x 100m drills económicos descanso 20s - Z2",
      "Serie 2 - Aeróbico extenso: 4 x 600m crol ritmo constante descanso 35s - Z2",
      "Serie 3 - Umbral sostenido: 8 x 300m ritmo fuerte descanso 30s - Z3",
      "Serie 4 - Resistencia pull: 1 x 1400m pull buoy - Z2",
      "Serie 5 - Patada: 12 x 100m patada mixta descanso 25s - Z2"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Media-Alta",
    focus: "Volumen sostenido, umbral aeróbico",
    group: 2
  },
  {
    week: 8,
    date: "31 de marzo",
    day: "Martes",
    schedule: "PM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 6000,
    duration: 120,
    warmup: "1000m (600 crol variado, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills largos: 10 x 150m (50 drill + 100 swim) descanso 25s - Z2",
      "Serie 2 - Volumen: 3 x 800m crol ritmo constante descanso 40s - Z2",
      "Serie 3 - Umbral alto: 10 x 250m ritmo fuerte descanso 25s - Z3",
      "Serie 4 - Resistencia: 1 x 1600m pull ritmo moderado - Z2",
      "Serie 5 - Patada larga: 10 x 125m patada descanso 30s - Z2"
    ],
    cooldown: "600m (350 crol + 250 espalda) Z1",
    intensity: "Alta",
    focus: "Mayor volumen, intensidad umbral",
    group: 2
  },
  {
    week: 8,
    date: "1 de abril",
    day: "Miércoles",
    schedule: "PM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 5800,
    duration: 115,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica 4 estilos: 20 x 75m drills descanso 20s - Z2",
      "Serie 2 - Descending largo: 6 x 500m cada vez más rápido descanso 40s - Z2→Z3",
      "Serie 3 - Umbral: 12 x 200m ritmo fuerte descanso 20s - Z3",
      "Serie 4 - Volumen: 1 x 1200m crol ritmo constante - Z2",
      "Serie 5 - Patada: 10 x 100m patada con aletas descanso 25s - Z2"
    ],
    cooldown: "550m (300 crol + 250 espalda) Z1",
    intensity: "Alta",
    focus: "Descending extenso, volumen umbral",
    group: 2
  },
  {
    week: 8,
    date: "2 de abril",
    day: "Jueves",
    schedule: "PM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 6200,
    duration: 120,
    warmup: "1100m (700 crol progresivo, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica perfecta: 16 x 100m drills variados descanso 20s - Z2",
      "Serie 2 - Volumen extenso: 2 x 1000m + 1 x 1200m crol ritmo constante descanso 50s - Z2",
      "Serie 3 - Umbral: 10 x 300m ritmo fuerte descanso 30s - Z3",
      "Serie 4 - Resistencia pull: 1 x 1500m pull buoy - Z2",
      "Serie 5 - Patada aeróbica: 12 x 100m patada descanso 25s - Z2"
    ],
    cooldown: "600m (400 crol + 200 espalda) Z1",
    intensity: "Muy alta",
    focus: "Máximo volumen, resistencia sostenida",
    group: 2
  },
  {
    week: 8,
    date: "3 de abril",
    day: "Viernes",
    schedule: "PM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 5700,
    duration: 115,
    warmup: "900m (500 crol, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 12 x 100m técnica económica descanso 20s - Z2",
      "Serie 2 - Aeróbico: 8 x 400m crol ritmo constante descanso 30s - Z2",
      "Serie 3 - Umbral: 15 x 150m ritmo fuerte descanso 20s - Z3",
      "Serie 4 - Resistencia: 1 x 1200m pull ritmo moderado - Z2",
      "Serie 5 - Patada: 10 x 100m patada variada descanso 25s - Z2"
    ],
    cooldown: "550m (300 crol + 250 espalda) Z1",
    intensity: "Alta",
    focus: "Consolidación volumen, umbral",
    group: 2
  },
  {
    week: 8,
    date: "4 de abril",
    day: "Sábado",
    schedule: "AM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 6500,
    duration: 120,
    warmup: "1200m (800 crol, 400 técnica + drills) Z1",
    mainSet: [
      "Serie 1 - Activación: 12 x 100m técnica perfecta descanso 20s - Z2",
      "Serie 2 - Test largo: 1 x 2500m crol ritmo constante (split cada 500m) - Z2",
      "Serie 3 - Umbral: 12 x 200m ritmo fuerte descanso 25s - Z3",
      "Serie 4 - Resistencia: 1 x 1800m pull ritmo moderado - Z2",
      "Serie 5 - Patada aeróbica: 12 x 100m patada descanso 25s - Z2"
    ],
    cooldown: "650m (400 crol + 250 espalda) Z1",
    intensity: "Muy alta",
    focus: "Test 2500m, máximo volumen semanal",
    group: 2
  },

  // SEMANA 9 (6-11 Abr) - PICO DE VOLUMEN FONDO
  {
    week: 9,
    date: "6 de abril",
    day: "Lunes",
    schedule: "PM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 5900,
    duration: 120,
    warmup: "1000m (600 crol, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica larga: 10 x 150m (50 drill + 100 swim) descanso 25s - Z2",
      "Serie 2 - Aeróbico extenso: 5 x 600m crol ritmo constante descanso 35s - Z2",
      "Serie 3 - Umbral sostenido: 10 x 300m ritmo fuerte descanso 30s - Z3",
      "Serie 4 - Resistencia pull: 1 x 1600m pull buoy - Z2",
      "Serie 5 - Patada: 12 x 100m patada mixta descanso 25s - Z2"
    ],
    cooldown: "600m (350 crol + 250 espalda) Z1",
    intensity: "Alta",
    focus: "Volumen máximo, resistencia aeróbica",
    group: 2
  },
  {
    week: 9,
    date: "7 de abril",
    day: "Martes",
    schedule: "PM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 6300,
    duration: 120,
    warmup: "1100m (700 crol variado, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills extensos: 12 x 150m drills económicos descanso 25s - Z2",
      "Serie 2 - Volumen: 4 x 800m crol ritmo constante descanso 40s - Z2",
      "Serie 3 - Umbral alto: 12 x 250m ritmo fuerte descanso 25s - Z3",
      "Serie 4 - Resistencia: 1 x 1800m pull ritmo moderado - Z2",
      "Serie 5 - Patada larga: 12 x 125m patada descanso 30s - Z2"
    ],
    cooldown: "650m (400 crol + 250 espalda) Z1",
    intensity: "Muy alta",
    focus: "Pico de volumen, máxima carga aeróbica",
    group: 2
  },
  {
    week: 9,
    date: "8 de abril",
    day: "Miércoles",
    schedule: "PM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 6100,
    duration: 120,
    warmup: "900m (600 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica 4 estilos: 24 x 75m drills descanso 20s - Z2",
      "Serie 2 - Descending extenso: 8 x 500m cada vez más rápido descanso 40s - Z2→Z3",
      "Serie 3 - Umbral: 15 x 200m ritmo fuerte descanso 20s - Z3",
      "Serie 4 - Volumen: 1 x 1400m crol ritmo constante - Z2",
      "Serie 5 - Patada: 12 x 100m patada con aletas descanso 25s - Z2"
    ],
    cooldown: "600m (350 crol + 250 espalda) Z1",
    intensity: "Muy alta",
    focus: "Descending largo, volumen umbral máximo",
    group: 2
  },
  {
    week: 9,
    date: "9 de abril",
    day: "Jueves",
    schedule: "PM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 6500,
    duration: 120,
    warmup: "1200m (800 crol progresivo, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica perfecta: 20 x 100m drills variados descanso 20s - Z2",
      "Serie 2 - Volumen máximo: 3 x 1000m crol ritmo constante descanso 50s - Z2",
      "Serie 3 - Umbral: 12 x 300m ritmo fuerte descanso 30s - Z3",
      "Serie 4 - Resistencia pull: 1 x 2000m pull buoy - Z2",
      "Serie 5 - Patada aeróbica: 15 x 100m patada descanso 25s - Z2"
    ],
    cooldown: "650m (400 crol + 250 espalda) Z1",
    intensity: "Muy alta",
    focus: "Máximo volumen absoluto, test 3x1000m",
    group: 2
  },
  {
    week: 9,
    date: "10 de abril",
    day: "Viernes",
    schedule: "PM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 6000,
    duration: 120,
    warmup: "1000m (600 crol, 400 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 16 x 100m técnica económica descanso 20s - Z2",
      "Serie 2 - Aeróbico: 10 x 400m crol ritmo constante descanso 30s - Z2",
      "Serie 3 - Umbral: 18 x 150m ritmo fuerte descanso 20s - Z3",
      "Serie 4 - Resistencia: 1 x 1500m pull ritmo moderado - Z2",
      "Serie 5 - Patada: 12 x 100m patada variada descanso 25s - Z2"
    ],
    cooldown: "600m (350 crol + 250 espalda) Z1",
    intensity: "Muy alta",
    focus: "Consolidación volumen máximo",
    group: 2
  },
  {
    week: 9,
    date: "11 de abril",
    day: "Sábado",
    schedule: "AM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 6800,
    duration: 120,
    warmup: "1300m (900 crol, 400 técnica + drills) Z1",
    mainSet: [
      "Serie 1 - Activación: 15 x 100m técnica perfecta descanso 20s - Z2",
      "Serie 2 - Test máximo: 1 x 3000m crol ritmo constante (split cada 500m) - Z2",
      "Serie 3 - Umbral: 15 x 200m ritmo fuerte descanso 25s - Z3",
      "Serie 4 - Resistencia: 1 x 2000m pull ritmo moderado - Z2",
      "Serie 5 - Patada aeróbica: 15 x 100m patada descanso 25s - Z2"
    ],
    cooldown: "700m (450 crol + 250 espalda) Z1",
    intensity: "Muy alta",
    focus: "Test 3000m, pico absoluto de volumen",
    group: 2
  },

  // SEMANA 10 (13-18 Abr) - TAPER FONDO
  {
    week: 10,
    date: "13 de abril",
    day: "Lunes",
    schedule: "PM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 5000,
    duration: 100,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 12 x 100m drills económicos descanso 20s - Z2",
      "Serie 2 - Aeróbico: 4 x 500m crol ritmo moderado descanso 35s - Z2",
      "Serie 3 - Umbral: 8 x 250m ritmo fuerte descanso 30s - Z3",
      "Serie 4 - Resistencia: 1 x 1200m pull buoy - Z2",
      "Serie 5 - Patada: 10 x 100m patada descanso 25s - Z2"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Media",
    focus: "Reducción volumen, mantener intensidad",
    group: 2
  },
  {
    week: 10,
    date: "14 de abril",
    day: "Martes",
    schedule: "PM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 5200,
    duration: 105,
    warmup: "900m (600 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Drills: 10 x 100m técnica perfecta descanso 20s - Z2",
      "Serie 2 - Ritmo carrera: 6 x 600m ritmo competencia descanso 45s - Z3",
      "Serie 3 - Umbral: 10 x 200m ritmo fuerte descanso 25s - Z3",
      "Serie 4 - Aeróbico: 1 x 1000m crol ritmo fácil - Z2",
      "Serie 5 - Velocidad: 10 x 50m sprint suave descanso 30s - Z4"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Media-Alta",
    focus: "Ritmo de carrera, afinar técnica",
    group: 2
  },
  {
    week: 10,
    date: "15 de abril",
    day: "Miércoles",
    schedule: "PM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 4500,
    duration: 90,
    warmup: "700m (400 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica suave: 10 x 75m drills descanso 20s - Z2",
      "Serie 2 - Aeróbico: 5 x 400m crol ritmo moderado descanso 35s - Z2",
      "Serie 3 - Velocidad: 12 x 100m (75 fuerte + 25 fácil) descanso 25s - Z3",
      "Serie 4 - Resistencia: 1 x 800m pull buoy - Z2",
      "Serie 5 - Patada: 8 x 100m patada descanso 25s - Z2"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Media",
    focus: "Recuperación activa, mantener sensaciones",
    group: 2
  },
  {
    week: 10,
    date: "16 de abril",
    day: "Jueves",
    schedule: "PM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 4800,
    duration: 95,
    warmup: "800m (500 crol, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Técnica: 12 x 75m drills perfectos descanso 20s - Z2",
      "Serie 2 - Race simulation: 4 x 800m ritmo competencia descanso 60s - Z3",
      "Serie 3 - Velocidad: 8 x 100m fuerte descanso 30s - Z4",
      "Serie 4 - Aeróbico: 1 x 1000m crol suave - Z2",
      "Serie 5 - Activación: 8 x 50m sprint controlado descanso 40s - Z4"
    ],
    cooldown: "500m (300 crol + 200 espalda) Z1",
    intensity: "Media-Alta",
    focus: "Simulación de carrera 800m",
    group: 2
  },
  {
    week: 10,
    date: "17 de abril",
    day: "Viernes",
    schedule: "PM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 3500,
    duration: 70,
    warmup: "800m (500 crol muy suave, 300 técnica) Z1",
    mainSet: [
      "Serie 1 - Activación: 8 x 75m técnica perfecta descanso 25s - Z2",
      "Serie 2 - Velocidad: 6 x 200m ritmo moderado descanso 40s - Z3",
      "Serie 3 - Sprints: 8 x 50m sprint descanso 45s - Z4",
      "Serie 4 - Aeróbico: 1 x 600m crol muy suave - Z1-Z2",
      "Serie 5 - Activación final: 6 x 50m sprint controlado descanso 60s - Z4"
    ],
    cooldown: "600m (400 crol + 200 espalda muy suave) Z1",
    intensity: "Media",
    focus: "Pre-competencia, energía fresca",
    group: 2
  },
  // 18-19 Abril: COPA CHILE 2 - 800-1500m (COMPETENCIA)
  {
    week: 10,
    date: "18 de abril",
    day: "Sábado",
    schedule: "AM",
    mesociclo: "Bloque 2",
    bloque: "Fondo",
    distance: 0,
    duration: 0,
    warmup: "Competencia - Copa Chile 2 (Fondo)",
    mainSet: ["DÍA DE COMPETENCIA - Copa Chile 2 - Pruebas de 800m y 1500m"],
    cooldown: "Recuperación post-competencia",
    intensity: "Competencia",
    focus: "Copa Chile 2 - 800m y 1500m",
    isChallenge: true,
    challengeName: "Copa Chile 2 - Fondo",
    group: 2
  },

  // ==================== NOTA IMPORTANTE ====================
  // Los bloques 3-10 han sido creados en un archivo separado debido a limitaciones de tamaño
  // Importar y combinar usando: import { workoutsGroup2Blocks3to10 } from './workoutsGroup2Blocks3to10';
  // Array completo: [...workoutsGroup2, ...workoutsGroup2Blocks3to10]
];

export default workoutsGroup2;
