# 📊 Sincronización de Tendencia de Volumen por Bloques

## 📝 Descripción

La funcionalidad de **Sincronización de Tendencia de Volumen** es un sistema inteligente que calcula automáticamente los volúmenes de entrenamiento óptimos para cada uno de los 10 bloques de la temporada 2026-2027, basándose en principios de periodización deportiva.

## 🎯 Objetivo

Mantener una progresión coherente y científica del volumen de entrenamiento a lo largo de toda la temporada, asegurando:

- **Incrementos graduales** durante fases de construcción
- **Picos controlados** antes de competencias importantes
- **Recuperación adecuada** en períodos estratégicos
- **Taper efectivo** para competencias principales

## 🔍 Cómo Funciona

### 1. Cálculo del Volumen Base

El sistema utiliza el **Bloque 1** como referencia base:
- Calcula el promedio de distancia de todos los entrenamientos del Bloque 1
- Si no hay entrenamientos en Bloque 1, usa 3000m como valor por defecto

### 2. Aplicación de Multiplicadores

Cada bloque tiene un **multiplicador de volumen** basado en su fase de entrenamiento:

| Bloque | Multiplicador | Fase | Descripción |
|--------|---------------|------|-------------|
| Bloque 1 | 1.00x | Base | Volumen inicial de referencia |
| Bloque 2 | 1.15x | Base | Incremento gradual (+15%) |
| Bloque 3 | 1.25x | Build | Acumulación de volumen (+25%) |
| Bloque 4 | 1.30x | Build | Pico pre-competencia (+30%) |
| Bloque 5 | 1.20x | Peak | Volumen competitivo (+20%) |
| Bloque 6 | 1.10x | Recovery | Recuperación activa (+10%) |
| Bloque 7 | 1.18x | Build | Segundo ciclo - Incremento (+18%) |
| Bloque 8 | 1.28x | Build | Acumulación competitiva (+28%) |
| Bloque 9 | 1.35x | Build | **Máximo volumen anual** (+35%) |
| Bloque 10 | 1.15x | Peak | Taper - Reducción para pico (+15%) |

### 3. Generación de Sugerencias

Para cada bloque, el sistema calcula:

- **Volumen Actual**: Promedio real de los entrenamientos existentes
- **Volumen Sugerido**: Base × Multiplicador
- **Diferencia**: Ajuste necesario (en metros y porcentaje)
- **Tendencia**: Aumentar ↗️ / Mantener → / Disminuir ↘️

## 📈 Fases de Entrenamiento

### 🏗️ Base (Bloques 1-2)
- **Objetivo**: Establecer fundamentos aeróbicos
- **Volumen**: Moderado y progresivo
- **Intensidad**: Baja a media

### 📈 Build (Bloques 3-4, 7-9)
- **Objetivo**: Desarrollar capacidad de trabajo
- **Volumen**: Alto y creciente
- **Intensidad**: Media a alta

### ⚡ Peak (Bloques 5, 10)
- **Objetivo**: Maximizar rendimiento competitivo
- **Volumen**: Moderado y controlado
- **Intensidad**: Alta y específica

### 🔄 Recovery (Bloque 6)
- **Objetivo**: Regeneración activa
- **Volumen**: Reducido estratégicamente
- **Intensidad**: Baja a media

## 💡 Interpretación de Resultados

### Tarjetas de Resumen

1. **Total Bloques (10)**: Cantidad total de bloques en la temporada
2. **Incrementar (verde)**: Bloques donde el volumen actual está más de 5% por debajo del sugerido
3. **Reducir (rojo)**: Bloques donde el volumen actual supera en más de 5% el sugerido
4. **En Objetivo (gris)**: Bloques con volumen dentro del rango ±5%

### Tabla Detallada

- **Vol. Actual**: Promedio de distancia de entrenamientos existentes
- **Vol. Sugerido**: Objetivo calculado según periodización
- **Diferencia**: Ajuste necesario en metros y porcentaje
- **Tendencia**: Indicador visual de acción recomendada

### Gráfico de Barras

Visualización de la progresión óptima de volumen:
- **Azul**: Fase Base 🏗️
- **Verde**: Fase Build 📈
- **Naranja**: Fase Peak ⚡
- **Morado**: Fase Recovery 🔄

## 🎓 Ejemplo Práctico

### Situación Inicial
- Bloque 1 tiene 5 entrenamientos de 3000m promedio
- Volumen base = 3000m

### Cálculos Automáticos
```
Bloque 1:  3000m × 1.00 = 3000m (Base)
Bloque 2:  3000m × 1.15 = 3450m (+15%)
Bloque 3:  3000m × 1.25 = 3750m (+25%)
Bloque 4:  3000m × 1.30 = 3900m (+30%)
Bloque 5:  3000m × 1.20 = 3600m (+20%)
Bloque 6:  3000m × 1.10 = 3300m (+10%)
Bloque 7:  3000m × 1.18 = 3540m (+18%)
Bloque 8:  3000m × 1.28 = 3840m (+28%)
Bloque 9:  3000m × 1.35 = 4050m (+35%) ← PICO
Bloque 10: 3000m × 1.15 = 3450m (+15%) ← TAPER
```

### Aplicación
Al crear un entrenamiento para el Bloque 9, el entrenador sabe que debe apuntar a aproximadamente **4050m** para mantener la progresión óptima.

## ⚠️ Alertas y Notificaciones

### Alerta Naranja (Sin datos en Bloque 1)
Si no hay entrenamientos en Bloque 1:
- El sistema usa 3000m como base por defecto
- Se recomienda crear entrenamientos en Bloque 1 para cálculos más precisos

## 🚀 Ventajas del Sistema

1. **Consistencia**: Mantiene progresión coherente entre bloques
2. **Científico**: Basado en principios de periodización deportiva
3. **Automático**: Cálculos instantáneos sin intervención manual
4. **Visual**: Gráficos claros de tendencias y objetivos
5. **Flexible**: Se ajusta automáticamente al cambiar el Bloque 1

## 📍 Ubicación en la Aplicación

**Ruta**: Pestaña "Entrenamientos" → Botón "Ver Estadísticas de Entrenamiento" → Primera sección

## 🔄 Actualización Dinámica

El sistema se actualiza automáticamente cuando:
- Se crean nuevos entrenamientos
- Se modifican entrenamientos existentes
- Se eliminan entrenamientos
- Se restauran entrenamientos de la papelera

## 📚 Fundamento Teórico

La periodización de volumen se basa en:

1. **Ley de Supercompensación**: Aumentos graduales permiten adaptación
2. **Principio de Sobrecarga Progresiva**: Incrementos controlados (10-35%)
3. **Ciclos de Carga-Descarga**: Períodos de alta carga seguidos de recuperación
4. **Taper Pre-Competitivo**: Reducción de volumen (30-40%) manteniendo intensidad

## ✅ Mejores Prácticas

1. **Crear entrenamientos en Bloque 1 primero** para establecer base real
2. **Revisar sugerencias regularmente** al planificar nuevas semanas
3. **Considerar características del grupo** (Menores vs Mayores)
4. **Ajustar según respuesta de nadadores** (no es una regla rígida)
5. **Combinar con análisis de intensidad** para planificación completa

## 🎯 Casos de Uso

### Caso 1: Planificación de Temporada
- Usar sugerencias para diseñar estructura macro de volumen
- Establecer objetivos de kilometraje por bloque
- Comunicar progresión a nadadores y padres

### Caso 2: Ajuste Mid-Season
- Detectar bloques con volumen insuficiente o excesivo
- Corregir desviaciones antes de competencias importantes
- Mantener trayectoria óptima hacia picos

### Caso 3: Evaluación Post-Temporada
- Analizar cumplimiento de progresión planificada
- Identificar bloques exitosos o problemáticos
- Planificar mejoras para siguiente temporada

---

**Versión**: 1.0  
**Fecha**: 10 de Febrero 2026  
**Sistema**: Club Natación Lo Prado - Gestión de Entrenamientos
