# Guía: Gestión de Entrenamientos por Grupos y Mesociclos

## 📋 Resumen

Se ha implementado un sistema completo de gestión de entrenamientos diferenciados por mesociclos para cada grupo de nadadores:

- **Grupo 1**: Menores hasta Inf A (Inf E 2018, Inf D 2017, Inf C 2016, Inf A 2015)
- **Grupo 2**: Inf B hasta Mayores (Inf B1 2014, Inf B2 2013, Juv A1 2012, Juv A2 2011, Juv B1 2010, Juv B2 2009, Juv B3 2008, Mayores 2007)

## 🎯 Características Principales

### 1. **Estructuras de Temporada Diferenciadas**

#### Grupo 1 (20 semanas total):
- **Base**: 6 semanas - Construcción de resistencia aeróbica y técnica fundamental
- **Desarrollo**: 6 semanas - Aumento progresivo de volumen e intensidad
- **Pre-competitivo**: 4 semanas - Trabajo específico de competencia y velocidad
- **Competitivo**: 4 semanas - Puesta a punto y campeonatos

#### Grupo 2 (20 semanas total):
- **Base**: 5 semanas - Construcción de resistencia aeróbica y capacidad
- **Desarrollo**: 5 semanas - Aumento de intensidad, velocidad y potencia
- **Pre-competitivo**: 5 semanas - Trabajo específico de competencia y ritmo de carrera
- **Competitivo**: 5 semanas - Puesta a punto, tapering y campeonato

### 2. **Gestión de Entrenamientos**

#### Crear Entrenamientos:
1. Ve a la pestaña **"Entrenamientos"**
2. En la sección **"Gestionar Entrenamientos"**, haz clic en **"Agregar"**
3. Completa el formulario:
   - Semana (1-20)
   - Fecha (ej: "2 de marzo")
   - Día de la semana
   - Horario (AM/PM)
   - Mesociclo (Base, Desarrollo, Pre-competitivo, Competitivo)
   - **Grupo de Entrenamiento**: 
     - 🏊 Ambos Grupos (para entrenamientos compartidos)
     - 👶 Grupo 1: Menores hasta Inf A
     - 🏅 Grupo 2: Inf B hasta Mayores
   - Distancia, duración e intensidad
   - Detalles del entrenamiento (calentamiento, series principales, enfriamiento)

4. **Funciones avanzadas**:
   - **Modo Multi-Día**: Crea el mismo entrenamiento para varios días a la vez
   - **Modo Multi-Horario**: Crea el entrenamiento para AM y PM simultáneamente

#### Filtrar Entrenamientos:
- En el **WorkoutManager**, usa el selector de filtro para ver:
  - Todos los grupos
  - Solo Grupo 1
  - Solo Grupo 2

### 3. **Resumen de Entrenamientos por Grupo y Mesociclo**

Nuevo componente visual que muestra:

#### Para cada Grupo:
- **Estadísticas Generales**:
  - Total de entrenamientos
  - Distancia total acumulada (en km)
  - Promedio por sesión
  - Estructura de temporada (20 semanas)

- **Distribución por Mesociclo**:
  - Cuántos entrenamientos hay en cada mesociclo
  - Badges de colores para identificación rápida

- **Tarjetas Detalladas por Mesociclo**:
  - Número de entrenamientos
  - Semanas cubiertas
  - Distancia total
  - Promedio por sesión

### 4. **Visualización en Entrenamientos**

Cada entrenamiento ahora muestra:
- Badge de grupo con colores diferenciados:
  - 👶 Grupo 1 (morado)
  - 🏅 Grupo 2 (verde)
  - 🏊 Todos (gris)

### 5. **Estructura de Temporada Interactiva**

- Selector de grupo para ver la planificación específica
- Los **MesocicloDialogs** filtran automáticamente los entrenamientos según:
  - El mesociclo seleccionado
  - El grupo activo
  - Entrenamientos marcados como "Ambos" se muestran para todos

## 🔧 Cómo Usar el Sistema

### Escenario 1: Crear entrenamientos específicos para cada grupo

**Ejemplo: Semana 1, Lunes - Mesociclo Base**

1. **Para Grupo 1** (menores):
   - Crear entrenamiento con distancia menor (ej: 1500m)
   - Enfoque en técnica fundamental
   - Intensidad: Baja-Media
   - Seleccionar: "Grupo 1: Menores hasta Inf A"

2. **Para Grupo 2** (mayores):
   - Crear entrenamiento con mayor distancia (ej: 2500m)
   - Enfoque en resistencia y capacidad
   - Intensidad: Media-Alta
   - Seleccionar: "Grupo 2: Inf B hasta Mayores"

### Escenario 2: Crear entrenamientos compartidos

Para días donde ambos grupos entrenan juntos:
- Seleccionar: "Ambos Grupos"
- El entrenamiento aparecerá en la planificación de ambos grupos

### Escenario 3: Visualizar y analizar la carga de entrenamiento

1. Ve a **"Resumen de Entrenamientos por Grupo y Mesociclo"**
2. Cambia entre pestañas:
   - Grupo 1: Menores hasta Inf A
   - Grupo 2: Inf B hasta Mayores
3. Revisa las estadísticas:
   - ¿Hay suficientes entrenamientos en cada mesociclo?
   - ¿La distribución de carga es apropiada?
   - ¿El volumen total está balanceado?

## 📊 Indicadores Visuales

### Colores de Mesociclos:
- 🔵 **Base**: Azul
- 🟣 **Desarrollo**: Morado
- 🟠 **Pre-competitivo**: Naranja
- 🔴 **Competitivo**: Rojo

### Colores de Grupos:
- 🟣 **Grupo 1**: Morado
- 🟢 **Grupo 2**: Verde
- ⚪ **Ambos**: Gris

## 💡 Mejores Prácticas

1. **Planificación Progresiva**:
   - Base: Mayor volumen, menor intensidad
   - Desarrollo: Incremento gradual de intensidad
   - Pre-competitivo: Trabajo específico de competencia
   - Competitivo: Tapering y puesta a punto

2. **Diferenciación por Grupo**:
   - Grupo 1: Enfoque en desarrollo técnico y aeróbico base
   - Grupo 2: Mayor énfasis en velocidad, potencia y trabajo anaeróbico

3. **Entrenamientos Compartidos**:
   - Usa "Ambos Grupos" para:
     - Pruebas de control
     - Entrenamientos técnicos generales
     - Actividades de equipo

4. **Monitoreo Continuo**:
   - Revisa regularmente el "Resumen de Entrenamientos"
   - Asegúrate de cubrir todas las semanas de cada mesociclo
   - Verifica que el volumen sea apropiado para cada grupo

## 🎓 Ejemplos Prácticos

### Entrenamientos ya creados en el sistema:

1. **Semana 1, Lunes** - Grupo 1
   - 1500m, Base, Intensidad Baja
   - Enfoque: Técnica fundamental

2. **Semana 1, Miércoles** - Grupo 2
   - 1600m, Base, Intensidad Media
   - Enfoque: Resistencia aeróbica

3. **Semana 1, Viernes** - Ambos Grupos
   - 1700m, Base, Intensidad Media
   - Enfoque: Trabajo compartido

## ✅ Próximos Pasos Sugeridos

1. **Completar la planificación**:
   - Asignar grupo a todos los entrenamientos existentes
   - Crear entrenamientos específicos donde hagan falta

2. **Revisar distribución**:
   - Usar el "Resumen de Entrenamientos" para verificar balance
   - Ajustar volúmenes según necesidades de cada grupo

3. **Implementar seguimiento**:
   - Monitorear progreso de cada grupo
   - Ajustar planificación según resultados

---

**Nota**: Este sistema permite una gestión profesional y diferenciada de los entrenamientos, respetando las necesidades específicas de desarrollo de cada grupo de edad mientras mantiene la flexibilidad para entrenamientos compartidos cuando sea apropiado.
