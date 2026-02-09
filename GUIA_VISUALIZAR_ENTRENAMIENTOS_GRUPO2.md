# 🎯 Guía: Cómo Visualizar los Entrenamientos del Grupo 2 en los Bloques

## 📋 **PASOS PARA VISUALIZAR LOS ENTRENAMIENTOS**

---

### ✅ **PASO 1: Importar los Entrenamientos a la Base de Datos**

Los entrenamientos del Grupo 2 están **predefinidos en archivos de código**, pero para visualizarlos en la interfaz, primero debes **importarlos a la base de datos Supabase**.

#### Cómo importar:

1. **Inicia sesión como Administrador** 
   - Solo los administradores pueden importar entrenamientos

2. **Ve a la pestaña "Entrenamientos"** 
   - Es la primera pestaña (ícono de pesas 🏋️)

3. **Busca el botón "Importar Grupo 2"**
   - Está en la esquina superior derecha de la sección
   - Tiene un ícono de usuarios 👥

4. **Haz clic en "Importar Grupo 2"**
   - Se abrirá un diálogo con información detallada

5. **Revisa la información** del diálogo:
   - 📋 Temporada: 2026-2027 (52 semanas)
   - 👥 Categorías: Inf B, Juveniles, Mayores
   - 📅 Frecuencia: 6 días/semana
   - 🎯 Bloques: 10 bloques especializados
   - 📊 Total: 252+ entrenamientos

6. **Haz clic en "Importar Entrenamientos"**
   - Confirma la acción (puede tomar varios minutos)
   - Verás una notificación de progreso
   - Cuando termine, verás: "¡Importación exitosa! 252 entrenamientos importados"

---

### ✅ **PASO 2: Visualizar los Entrenamientos en los Bloques**

Una vez importados, los entrenamientos se mostrarán **automáticamente** en la interfaz.

#### Dónde verlos:

**Opción A: Panel de Bloques (Recomendado)** 🎨

1. **En la pestaña "Entrenamientos"**
2. **Desplázate hacia abajo** hasta encontrar la sección:
   ```
   📊 Resumen de Entrenamientos por Bloques
   Estructura de 10 bloques - Temporada 2026-2027 (52 semanas)
   ```

3. **Selecciona la pestaña "Grupo 2: Inf B hasta Mayores"**

4. **Verás una vista general con:**
   - 📊 **Estadísticas Generales:**
     - Total Entrenamientos: 252
     - Distancia Total: ~1,300 km
     - Promedio/Sesión: ~5,200m
     - Estructura: 10 bloques

   - 📋 **Distribución por Bloques:**
     - B1: 36 | B2: 24 | B3: 24 | B4: 36 | B5: 36
     - B6: 24 | B7: 24 | B8: 30 | B9: 54 | B10: 24

5. **Explora cada bloque individualmente:**
   
   Cada tarjeta de bloque muestra:
   
   ```
   🎯 Bloque 1
   9 Feb - 22 Mar 2026
   
   🏊 Velocidad
   🏆 Copa Chile 1 - 50m
   
   📊 Entrenamientos: 36
   📅 Semanas prog: 6/6
   📏 Distancia total: 180.0 km
   📈 Promedio/sesión: 5000m
   ```

**Opción B: Selector de Grupo de Temporada** 📅

1. **En la pestaña "Entrenamientos"**
2. **Encuentra el selector naranja** que dice:
   ```
   🔍 Selecciona Grupo de Temporada
   Ver entrenamientos por categorías de edad
   ```

3. **Selecciona "Grupo 2 - Mayores"** del dropdown

4. **Verás los entrenamientos filtrados por semanas**

**Opción C: Calendario Integrado** 📆

1. **Ve a la pestaña "Calendario"**
2. Los entrenamientos del Grupo 2 aparecerán automáticamente en sus fechas correspondientes
3. Cada día mostrará el entrenamiento programado

---

### ✅ **PASO 3: Verificar la Importación (Opcional)**

Para confirmar que todo se importó correctamente:

1. **Ve a la pestaña "Diagnóstico"** (última pestaña, solo admin)

2. **Haz clic en "Ejecutar Test Completo"**

3. **Verás un reporte detallado:**
   ```
   ✅ Total Entrenamientos: 252
   ✅ Total Bloques: 10
   ✅ Total Semanas: 52
   ✅ Validación: Todos los datos son válidos
   ```

4. **Usa los botones auxiliares:**
   - "Ver Semana 1" - Muestra entrenamientos de la primera semana
   - "Ver Bloque 3" - Muestra todos los entrenamientos del Bloque 3
   - "Ver Competencias" - Lista las 9 competencias programadas

---

## 🎨 **CÓMO SE VEN LOS BLOQUES EN LA INTERFAZ**

### Vista General (Grupo 2):

```
╔══════════════════════════════════════════════════════════╗
║   📊 RESUMEN GRUPO 2: INF B HASTA MAYORES              ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║   Total Entrenamientos: 252                             ║
║   Distancia Total: 1300.0 km                            ║
║   Promedio/Sesión: 5200m                                ║
║   Estructura: 10 bloques                                ║
║                                                          ║
║   Distribución por Bloques:                             ║
║   [B1: 36] [B2: 24] [B3: 24] [B4: 36] [B5: 36]        ║
║   [B6: 24] [B7: 24] [B8: 30] [B9: 54] [B10: 24]       ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

### Vista Individual de Bloque:

```
╔═══════════════════════════╗
║ 🎯 Bloque 3               ║
║ 20 Abr - 17 May 2026      ║
╟───────────────────────────╢
║ 🏊 Medio Fondo            ║
║ 🏆 Copa Chile 3           ║
║    100-400m               ║
╟───────────────────────────╢
║ Entrenamientos: 24        ║
║ Semanas prog: 4/4         ║
║ Distancia total: 124.8 km ║
║ Promedio/sesión: 5200m    ║
╚═══════════════════════════╝
```

---

## 🔍 **DETALLES DE LOS 10 BLOQUES**

| Bloque | Semanas | Fechas | Enfoque | Competencia | Entrenos |
|--------|---------|--------|---------|-------------|----------|
| **Bloque 1** | 6 | 9 Feb - 22 Mar | Velocidad | Copa Chile 1 - 50m | 36 |
| **Bloque 2** | 4 | 23 Mar - 19 Abr | Fondo | Copa Chile 2 - 800-1500m | 24 |
| **Bloque 3** | 4 | 20 Abr - 17 May | Medio Fondo | Copa Chile 3 - 100-400m | 24 |
| **Bloque 4** | 6 | 18 May - 5 Jul | Competitivo Mayor | Nacionales Jun-Jul | 36 |
| **Bloque 5** | 6 | 6 Jul - 16 Ago | Internacional | Brasil + Nac. Desarrollo | 36 |
| **Bloque 6** | 4 | 17 Ago - 13 Sep | Velocidad 2 | Copa Chile 1 - Velocidad | 24 |
| **Bloque 7** | 4 | 14 Sep - 4 Oct | Fondo 2 | Copa Chile 2 - Fondo | 24 |
| **Bloque 8** | 5 | 5 Oct - 8 Nov | Medio Fondo 2 | Copa Chile 3 - Medio Fondo | 30 |
| **Bloque 9** | 9 | 9 Nov - 9 Ene | Preparación | Prep. Campeonatos | 54 |
| **Bloque 10** | 4 | 10 Ene - 7 Feb | Pico Competitivo | Nacionales Verano | 24 |

**TOTAL: 52 semanas, 252 entrenamientos**

---

## 🎯 **QUÉ CONTIENE CADA ENTRENAMIENTO**

Cada entrenamiento incluye:

- ✅ **Título descriptivo** (ej: "Velocidad Reactiva - Series 50m")
- ✅ **Descripción detallada** del entrenamiento
- ✅ **Distancia total** en metros
- ✅ **Duración estimada** en minutos
- ✅ **Tipo de sesión** (Técnico, Velocidad, Resistencia, etc.)
- ✅ **Intensidad** (Baja, Media, Alta, Muy Alta)
- ✅ **Grupo asignado** (Grupo 2)
- ✅ **Bloque** (Bloque 1 - Bloque 10)
- ✅ **Semana** (1-52)
- ✅ **Día de entrenamiento**
- ✅ **Fecha específica**

---

## 🚀 **RESUMEN RÁPIDO**

### Para ver los entrenamientos:

1. ✅ **Importa** los entrenamientos (botón "Importar Grupo 2" en pestaña Entrenamientos)
2. ✅ **Espera** la confirmación de importación exitosa
3. ✅ **Navega** al panel de bloques en la misma pestaña
4. ✅ **Selecciona** "Grupo 2: Inf B hasta Mayores"
5. ✅ **Explora** los 10 bloques con todos sus detalles

### ⚡ Atajo rápido:

```
Login Admin → Entrenamientos → Importar Grupo 2 → 
Confirmar → Esperar → ¡Ver bloques automáticamente!
```

---

## 🆘 **SOLUCIÓN DE PROBLEMAS**

### ❌ No veo el botón "Importar Grupo 2"
**Solución:** Asegúrate de estar logueado como **administrador**. Solo los admins pueden importar.

### ❌ Los bloques del Grupo 2 muestran 0 entrenamientos
**Solución:** Aún no has importado los entrenamientos. Sigue el **Paso 1** de esta guía.

### ❌ La importación falla o se queda cargando
**Solución:** 
- Verifica tu conexión a internet
- Revisa la consola del navegador (F12) para ver errores
- Intenta refrescar la página y volver a intentar

### ❌ Importé pero no veo cambios
**Solución:** 
- Refresca la página (F5)
- Sal y vuelve a entrar a la pestaña Entrenamientos
- Verifica en la pestaña Diagnóstico que se importaron correctamente

---

## 🎉 **¡LISTO!**

Ahora puedes:
- ✅ Visualizar todos los 252 entrenamientos del Grupo 2
- ✅ Explorar los 10 bloques de entrenamiento
- ✅ Ver estadísticas detalladas por bloque
- ✅ Planificar la temporada completa 2026-2027
- ✅ Asignar entrenamientos a nadadores
- ✅ Hacer seguimiento del progreso

---

**Club Natación Lo Prado - "Haz que todo sea posible"** 🏊‍♂️💪🔴

---

## 📸 **SCREENSHOTS DE REFERENCIA**

### 1️⃣ Botón de Importación:
```
┌─────────────────────────────────────────┐
│  Entrenamientos                         │
├─────────────────────────────────────────┤
│                      [👥 Importar Grupo 2] │ ← AQUÍ
└─────────────────────────────────────────┘
```

### 2️⃣ Panel de Bloques:
```
┌─────────────────────────────────────────┐
│ 📊 Resumen de Entrenamientos por Bloques │
├─────────────────────────────────────────┤
│  [Grupo 1: Menores] [Grupo 2: Mayores] │ ← Selecciona Grupo 2
├─────────────────────────────────────────┤
│  Total: 252  |  1300km  |  5200m  |  10 bloques │
├─────────────────────────────────────────┤
│  [Bloque 1] [Bloque 2] [Bloque 3] ...  │ ← Explora bloques
└─────────────────────────────────────────┘
```

### 3️⃣ Verificación en Diagnóstico:
```
┌─────────────────────────────────────────┐
│ 🔧 Diagnóstico                          │
├─────────────────────────────────────────┤
│  [▶ Ejecutar Test Completo]            │
├─────────────────────────────────────────┤
│  ✅ Total Entrenamientos: 252           │
│  ✅ Total Bloques: 10                   │
│  ✅ Total Semanas: 52                   │
│  ✅ Validación: Todos válidos           │
└─────────────────────────────────────────┘
```
