# Sistema Completo de Entrenamientos - Grupo 2 (Mayores)

## 📋 Descripción General

Sistema completo de entrenamientos para el **Grupo 2 (Mayores)** del **Club Natación Lo Prado** para la temporada **2026-2027**, diseñado con 10 bloques de entrenamiento estructurados hacia las competencias clave.

## 🏗️ Estructura de Archivos

### Archivos Principales:

1. **`workoutsGroup2.ts`** - Bloques 1-2 (Velocidad Inicial + Fondo)
2. **`workoutsGroup2Block3.ts`** - Bloque 3 (Medio Fondo)
3. **`workoutsGroup2Block4.ts`** - Bloque 4 (Competitivo Mayor)
4. **`workoutsGroup2Blocks5to10.ts`** - Bloques 5-6 (Internacional + Velocidad 2)
5. **`workoutsGroup2Blocks7to10Final.ts`** - Bloques 7-10 (Fondo 2, Medio Fondo 2, Preparación, Pico)
6. **`workoutsGroup2AllBlocks.ts`** - ⭐ Consolidador de todos los bloques
7. **`allWorkoutsGroup2.ts`** - ⭐ Exportador principal (usar este)

### Archivo de Uso:

```typescript
import allWorkoutsGroup2, { workoutsGroup2Stats } from './data/allWorkoutsGroup2';
```

## 📊 Estructura de 10 Bloques

| Bloque | Nombre | Semanas | Entrenamientos | Competencia Objetivo | Fechas |
|--------|--------|---------|----------------|----------------------|--------|
| **1** | Velocidad Inicial | 6 | 36 | Copa Chile 1 - 50m | 9 Feb - 22 Mar |
| **2** | Fondo | 4 | 24 | Copa Chile 2 - 800-1500m | 23 Mar - 19 Abr |
| **3** | Medio Fondo | 4 | 24 | Copa Chile 3 - 100-400m | 20 Abr - 17 May |
| **4** | Competitivo Mayor | 6 | 36 | Nacionales Jun-Jul | 19 May - 5 Jul |
| **5** | Internacional | 6 | 36 | Brasil + Nacional Des. | 7 Jul - 16 Ago |
| **6** | Velocidad 2 | 4 | 24 | Copa Chile 1 | 17 Ago - 13 Sep |
| **7** | Fondo 2 | 4 | 24 | Copa Chile 2 | 14 Sep - 4 Oct |
| **8** | Medio Fondo 2 | 5 | 30 | Copa Chile 3 | 5 Oct - 8 Nov |
| **9** | Preparación | 9 | 9* | Preparación Nacionales | 9 Nov - 7 Ene 2027 |
| **10** | Pico Competitivo | 4 | 9* | Nacionales Verano 2027 | 11 Ene - 7 Feb 2027 |

**Total: 252+ entrenamientos**

\* *Bloques 9 y 10 tienen entrenamientos representativos - expandir según necesidad*

## 🎯 Competencias Clave

1. **Copa Chile 1 - 50m** (21-22 Mar 2026)
2. **Copa Chile 2 - 800-1500m** (17-19 Abr 2026)
3. **Copa Chile 3 - 100-400m** (15-17 May 2026)
4. **Nacionales Jun-Jul** (6 Jun - 5 Jul 2026) ⭐
5. **Competencia Internacional Brasil** (20 Jul - 16 Ago 2026)
6. **Copa Chile 1** (12-13 Sep 2026)
7. **Copa Chile 2** (2-4 Oct 2026)
8. **Copa Chile 3** (6-8 Nov 2026)
9. **Nacionales Verano 2027** (9 Ene - 7 Feb 2027) 🏆

## 🔧 Cómo Importar Entrenamientos a la BD

### Opción 1: Usar la utilidad de importación

```typescript
import { 
  importGroup2Workouts, 
  checkGroup2WorkoutsExist,
  getGroup2WorkoutsStats 
} from '../utils/importGroup2Workouts';

// Verificar si ya existen
const exists = await checkGroup2WorkoutsExist();

// Importar todos los entrenamientos
const result = await importGroup2Workouts();
console.log(`✅ Importados: ${result.success}`);
console.log(`❌ Fallidos: ${result.failed}`);

// Obtener estadísticas
const stats = await getGroup2WorkoutsStats();
console.log(`📊 Total entrenamientos: ${stats.total}`);
```

### Opción 2: Importación manual

```typescript
import allWorkoutsGroup2 from './data/allWorkoutsGroup2';
import * as api from './services/apiWithFallback';

for (const workout of allWorkoutsGroup2) {
  const { id, ...workoutData } = workout;
  await api.addWorkout({ ...workoutData, group: 2 });
}
```

## 📈 Características de los Entrenamientos

### Intensidades:
- **Baja**: Recuperación y técnica
- **Media**: Construcción aeróbica
- **Media-Alta**: Trabajo de umbral
- **Alta**: VO2max y potencia
- **Muy Alta**: Picos de carga, tests
- **Competencia**: Días de competición

### Zonas de Entrenamiento:
- **Z1**: Recuperación (60-70% FCmax)
- **Z2**: Aeróbico (70-80% FCmax)
- **Z3**: Umbral (80-85% FCmax)
- **Z4**: VO2max (85-92% FCmax)
- **Z5**: Velocidad/Sprint (92-100% FCmax)

### Estructura de Cada Entrenamiento:
```typescript
{
  week: number,              // Semana del año (1-52)
  date: string,              // Fecha en español
  day: string,               // Día de la semana
  schedule: "PM" | "AM",     // Horario
  mesociclo: string,         // "Bloque X"
  bloque: string,            // Nombre del bloque
  distance: number,          // Metros totales
  duration: number,          // Minutos
  warmup: string,            // Calentamiento
  mainSet: string[],         // Series principales
  cooldown: string,          // Enfriamiento
  intensity: string,         // Nivel de intensidad
  focus: string,             // Enfoque del entrenamiento
  group: 2,                  // Siempre 2 para Grupo 2
  isChallenge?: boolean,     // true para competencias
  challengeName?: string     // Nombre de la competencia
}
```

## 🚀 Uso en la Aplicación

### En el componente de entrenamientos:

```typescript
import allWorkoutsGroup2, { workoutsGroup2Stats } from './data/allWorkoutsGroup2';

// Filtrar por semana
const week1Workouts = allWorkoutsGroup2.filter(w => w.week === 1);

// Filtrar por bloque
const block3Workouts = allWorkoutsGroup2.filter(w => w.mesociclo === "Bloque 3");

// Obtener competencias
const competitions = allWorkoutsGroup2.filter(w => w.isChallenge);

// Ver estadísticas
console.log(workoutsGroup2Stats);
// {
//   totalBlocks: 10,
//   totalWeeks: 52,
//   totalWorkouts: 252,
//   competitions: [...],
//   averageDistance: ~5200m,
//   totalDistance: ~1,300,000m
// }
```

## 🎨 Categorías del Grupo 2

- **Inf B1 '14** (Infantil B1, nacidos 2014)
- **Inf B2 '13** (Infantil B2, nacidos 2013)
- **Juv A1 '12** (Juvenil A1, nacidos 2012)
- **Juv A2 '11** (Juvenil A2, nacidos 2011)
- **Juv B1 '10** (Juvenil B1, nacidos 2010)
- **Juv B2 '09** (Juvenil B2, nacidos 2009)
- **Juv B3 '08** (Juvenil B3, nacidos 2008)
- **Mayores '07** (Mayores, nacidos 2007 o antes)

## ✅ Checklist de Implementación

- [x] Bloque 1: Velocidad Inicial (36 entrenamientos)
- [x] Bloque 2: Fondo (24 entrenamientos)
- [x] Bloque 3: Medio Fondo (24 entrenamientos)
- [x] Bloque 4: Competitivo Mayor (36 entrenamientos)
- [x] Bloque 5: Internacional (36 entrenamientos)
- [x] Bloque 6: Velocidad 2 (24 entrenamientos)
- [x] Bloque 7: Fondo 2 (24 entrenamientos)
- [x] Bloque 8: Medio Fondo 2 (30 entrenamientos)
- [x] Bloque 9: Preparación (9 entrenamientos representativos)
- [x] Bloque 10: Pico Competitivo (9 entrenamientos representativos)
- [x] Sistema de consolidación
- [x] Utilidades de importación
- [x] Documentación completa

## 📝 Notas Importantes

1. **Bloques 9 y 10**: Contienen entrenamientos representativos. Para una planificación detallada, expandir siguiendo los patrones establecidos.

2. **Días de Competencia**: Los entrenamientos marcados con `isChallenge: true` son días de competencia (distance: 0, duration: 0).

3. **Horarios**: 
   - Lunes a Viernes: `"PM"` (tarde)
   - Sábados: `"AM"` (mañana)

4. **Progresión**: Cada bloque sigue un patrón de 3-4 semanas de construcción + 1 semana de taper antes de competencia.

5. **Personalización**: Los entrenamientos pueden ajustarse según el nivel individual de cada nadador.

## 🔄 Actualización y Mantenimiento

Para agregar o modificar entrenamientos:

1. Editar el archivo del bloque correspondiente
2. El sistema de consolidación (`workoutsGroup2AllBlocks.ts`) combina automáticamente todos los archivos
3. Reimportar a la BD si es necesario

## 👥 Créditos

**Sistema diseñado para**: Club Natación Lo Prado  
**Temporada**: 2026-2027  
**Grupo**: Mayores (Grupo 2)  
**Lema**: "Haz que todo sea posible" 🏊‍♂️💪

---

*Última actualización: Febrero 2026*
