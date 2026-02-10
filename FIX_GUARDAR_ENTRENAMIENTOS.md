# 🔧 FIX: Entrenamientos No se Guardan

## ❌ **PROBLEMA REPORTADO**

Los entrenamientos creados o editados no se guardaban en la base de datos.

---

## 🔍 **CAUSA DEL PROBLEMA**

El backend **NO tenía rutas implementadas para manejar entrenamientos (workouts)**:

### **Rutas faltantes:**
- ❌ `GET /workouts` - Obtener lista de entrenamientos
- ❌ `POST /workouts` - Crear nuevo entrenamiento
- ❌ `PUT /workouts/:id` - Actualizar entrenamiento
- ❌ `DELETE /workouts/:id` - Eliminar entrenamiento

### **Flujo del error:**

```
Usuario crea un entrenamiento
    ↓
Frontend llama: api.addWorkout(workout)
    ↓
apiWithFallback intenta: POST /workouts
    ↓
Backend responde: 404 Not Found ❌
    ↓
apiWithFallback hace fallback: localStorage.addWorkout()
    ↓
Entrenamiento se guarda SOLO en localStorage ⚠️
    ↓
Al refrescar la página se pierden los datos 😢
```

---

## ✅ **SOLUCIÓN IMPLEMENTADA**

He agregado **6 rutas completas de workouts** al servidor backend en `/supabase/functions/server/index.tsx`:

### **1. GET /workouts** - Obtener todos los entrenamientos

```typescript
app.get("/make-server-4909a0bc/workouts", async (c) => {
  try {
    const workouts = await kv.get("workouts:list");
    return c.json({ workouts: workouts || [] });
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return c.json({ error: "Failed to fetch workouts", details: String(error) }, 500);
  }
});
```

**Función:** Obtiene todos los entrenamientos guardados en la base de datos KV.

---

### **2. POST /workouts** - Crear nuevo entrenamiento

```typescript
app.post("/make-server-4909a0bc/workouts", async (c) => {
  try {
    const newWorkout = await c.req.json();
    console.log("📝 Creating new workout:", newWorkout.title || newWorkout.type);
    
    const workouts = await kv.get("workouts:list") || [];
    console.log("📋 Existing workouts before add:", workouts.length);
    
    // Generate unique ID
    const id = `w${Date.now()}`;
    const workoutWithId = { 
      ...newWorkout, 
      id,
      createdAt: new Date().toISOString()
    };
    
    console.log("🆕 New workout with ID:", { id, title: workoutWithId.title });
    
    // Add to list
    const updatedWorkouts = [...workouts, workoutWithId];
    await kv.set("workouts:list", updatedWorkouts);
    
    // Verify it was saved
    const verification = await kv.get("workouts:list") || [];
    console.log("✅ Workouts after save:", verification.length, "items");
    
    return c.json({ workout: workoutWithId }, 201);
  } catch (error) {
    console.error("Error adding workout:", error);
    return c.json({ error: "Failed to add workout", details: String(error) }, 500);
  }
});
```

**Función:** Crea un nuevo entrenamiento con ID único y lo guarda en la base de datos.

---

### **3. PUT /workouts/:id** - Actualizar entrenamiento

```typescript
app.put("/make-server-4909a0bc/workouts/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    const workouts = await kv.get("workouts:list") || [];
    
    const index = workouts.findIndex((w: any) => w.id === id);
    if (index === -1) {
      return c.json({ error: "Workout not found" }, 404);
    }
    
    workouts[index] = { 
      ...updatedData, 
      id, 
      createdAt: workouts[index].createdAt, 
      updatedAt: new Date().toISOString() 
    };
    await kv.set("workouts:list", workouts);
    
    console.log("✅ Workout updated:", id);
    
    return c.json({ workout: workouts[index] });
  } catch (error) {
    console.error("Error updating workout:", error);
    return c.json({ error: "Failed to update workout", details: String(error) }, 500);
  }
});
```

**Función:** Actualiza un entrenamiento existente manteniendo su ID y fecha de creación.

---

### **4. DELETE /workouts/:id** - Eliminar entrenamiento (soft delete)

```typescript
app.delete("/make-server-4909a0bc/workouts/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const workouts = await kv.get("workouts:list") || [];
    
    const index = workouts.findIndex((w: any) => w.id === id);
    if (index === -1) {
      return c.json({ error: "Workout not found" }, 404);
    }
    
    // Soft delete - mark as deleted instead of removing
    workouts[index] = { 
      ...workouts[index], 
      deleted: true, 
      deletedAt: new Date().toISOString() 
    };
    await kv.set("workouts:list", workouts);
    
    console.log("✅ Workout soft deleted:", id);
    
    return c.json({ message: "Workout deleted successfully" });
  } catch (error) {
    console.error("Error deleting workout:", error);
    return c.json({ error: "Failed to delete workout", details: String(error) }, 500);
  }
});
```

**Función:** Marca el entrenamiento como eliminado (soft delete) en lugar de borrarlo permanentemente. Esto permite recuperarlo desde la papelera.

---

### **5. POST /workouts/:id/restore** - Restaurar entrenamiento eliminado

```typescript
app.post("/make-server-4909a0bc/workouts/:id/restore", async (c) => {
  try {
    const id = c.req.param("id");
    const workouts = await kv.get("workouts:list") || [];
    
    const index = workouts.findIndex((w: any) => w.id === id);
    if (index === -1) {
      return c.json({ error: "Workout not found" }, 404);
    }
    
    // Remove deleted flag
    const { deleted, deletedAt, ...workoutData } = workouts[index];
    workouts[index] = { 
      ...workoutData, 
      restoredAt: new Date().toISOString() 
    };
    await kv.set("workouts:list", workouts);
    
    console.log("✅ Workout restored:", id);
    
    return c.json({ workout: workouts[index] });
  } catch (error) {
    console.error("Error restoring workout:", error);
    return c.json({ error: "Failed to restore workout", details: String(error) }, 500);
  }
});
```

**Función:** Restaura un entrenamiento que estaba marcado como eliminado.

---

### **6. DELETE /workouts/:id/permanent** - Eliminar permanentemente

```typescript
app.delete("/make-server-4909a0bc/workouts/:id/permanent", async (c) => {
  try {
    const id = c.req.param("id");
    const workouts = await kv.get("workouts:list") || [];
    
    const filteredWorkouts = workouts.filter((w: any) => w.id !== id);
    
    if (filteredWorkouts.length === workouts.length) {
      return c.json({ error: "Workout not found" }, 404);
    }
    
    await kv.set("workouts:list", filteredWorkouts);
    
    console.log("✅ Workout permanently deleted:", id);
    
    return c.json({ message: "Workout permanently deleted" });
  } catch (error) {
    console.error("Error permanently deleting workout:", error);
    return c.json({ error: "Failed to permanently delete workout", details: String(error) }, 500);
  }
});
```

**Función:** Elimina permanentemente un entrenamiento de la base de datos (no se puede recuperar).

---

## 🎯 **NUEVO FLUJO (CORREGIDO)**

```
Usuario crea un entrenamiento
    ↓
Frontend llama: api.addWorkout(workout)
    ↓
apiWithFallback intenta: POST /workouts
    ↓
Backend responde: 201 Created ✅
    ↓
Entrenamiento guardado en Supabase KV ✅
    ↓
Frontend actualiza estado con el nuevo entrenamiento ✅
    ↓
Al refrescar la página, los datos persisten 🎉
```

---

## 📊 **CARACTERÍSTICAS IMPLEMENTADAS**

### **✅ CRUD Completo**
- **C**reate - Crear nuevos entrenamientos
- **R**ead - Leer/Obtener entrenamientos
- **U**pdate - Actualizar entrenamientos existentes
- **D**elete - Eliminar entrenamientos

### **✅ Soft Delete**
- Los entrenamientos no se borran permanentemente de inmediato
- Se marcan como `deleted: true`
- Pueden recuperarse desde la papelera de reciclaje

### **✅ Timestamps**
- `createdAt` - Fecha de creación
- `updatedAt` - Fecha de última actualización
- `deletedAt` - Fecha de eliminación (soft delete)
- `restoredAt` - Fecha de restauración

### **✅ Logs de Depuración**
- Cada operación registra información en la consola
- Facilita el debugging de problemas
- Muestra el número de entrenamientos antes y después de operaciones

### **✅ Validación**
- Verifica que el entrenamiento existe antes de actualizar/eliminar
- Responde con códigos HTTP apropiados (200, 201, 404, 500)
- Manejo de errores con mensajes descriptivos

---

## 🔍 **LOGS DE DEPURACIÓN**

### **Crear entrenamiento:**
```
📝 Creating new workout: Velocidad - Series 50m
📋 Existing workouts before add: 25
🆕 New workout with ID: { id: 'w1707612345678', title: 'Velocidad - Series 50m' }
✅ Workouts after save: 26 items
```

### **Actualizar entrenamiento:**
```
✅ Workout updated: w1707612345678
```

### **Eliminar entrenamiento:**
```
✅ Workout soft deleted: w1707612345678
```

### **Restaurar entrenamiento:**
```
✅ Workout restored: w1707612345678
```

### **Eliminar permanentemente:**
```
✅ Workout permanently deleted: w1707612345678
```

---

## 🧪 **CÓMO VERIFICAR LA CORRECCIÓN**

### **Prueba 1: Crear entrenamiento**

```
1. Login como admin o coach
2. Ve a pestaña "Entrenamientos"
3. Click en "Agregar Entrenamiento"
4. Llena el formulario con los datos del entrenamiento
5. Click "Crear Entrenamiento"
6. Debería ver: ✅ "Entrenamiento agregado exitosamente"
7. Refresca la página (F5)
8. El entrenamiento debe seguir apareciendo ✅
```

### **Prueba 2: Editar entrenamiento**

```
1. Encuentra un entrenamiento en la lista
2. Click en "Editar"
3. Modifica algún campo (ej: distancia, título)
4. Click "Guardar Cambios"
5. Debería ver: ✅ "Entrenamiento actualizado"
6. Refresca la página (F5)
7. Los cambios deben persistir ✅
```

### **Prueba 3: Eliminar y restaurar**

```
1. Encuentra un entrenamiento en la lista
2. Click en "Eliminar"
3. Confirma la eliminación
4. Debería ver: ✅ "Entrenamiento eliminado"
5. Ve a "Papelera de Reciclaje"
6. Deberías ver el entrenamiento eliminado
7. Click "Restaurar"
8. Vuelve a la lista principal
9. El entrenamiento debe estar de vuelta ✅
```

### **Prueba 4: Verificar en consola del servidor**

```
1. Abre Supabase Dashboard → Edge Functions
2. Busca logs de "make-server-4909a0bc"
3. Deberías ver logs como:
   - "📝 Creating new workout: ..."
   - "✅ Workouts after save: X items"
```

---

## 📝 **ARCHIVO MODIFICADO**

- **Archivo:** `/supabase/functions/server/index.tsx`
- **Sección:** Nuevas rutas WORKOUT ROUTES agregadas antes de `Deno.serve(app.fetch)`
- **Líneas:** ~1525-1680 (aproximadamente)

---

## 🔒 **ALMACENAMIENTO**

Los entrenamientos se guardan en la tabla KV de Supabase con la clave:

```
"workouts:list"
```

**Estructura de datos:**

```typescript
{
  id: string;                    // Ej: "w1707612345678"
  title: string;                 // Ej: "Velocidad - Series 50m"
  description: string;           // Descripción detallada
  date: string;                  // Ej: "2026-02-15"
  day: string;                   // Ej: "Lunes"
  schedule: string;              // Ej: "PM"
  week: number;                  // Semana de temporada (1-52)
  mesociclo: string;             // Ej: "Bloque 1"
  bloque: string;                // Ej: "Velocidad"
  distance: number;              // Distancia en metros
  duration: number;              // Duración en minutos
  type: string;                  // Ej: "Velocidad", "Resistencia"
  intensity: string;             // Ej: "Alta", "Media"
  focus: string;                 // Objetivo del entrenamiento
  group: number | "Ambos";       // 1, 2, o "Ambos"
  warmup?: string;               // Calentamiento
  mainSet?: string;              // Serie principal
  cooldown?: string;             // Enfriamiento
  deleted?: boolean;             // Si está eliminado (soft delete)
  createdAt?: string;            // Timestamp de creación
  updatedAt?: string;            // Timestamp de actualización
  deletedAt?: string;            // Timestamp de eliminación
  restoredAt?: string;           // Timestamp de restauración
}
```

---

## 🎉 **RESULTADO**

✅ **Entrenamientos se guardan correctamente** en la base de datos Supabase  
✅ **Persisten al refrescar** la página  
✅ **Funcionan CRUD completos** (Crear, Leer, Actualizar, Eliminar)  
✅ **Soft delete implementado** - Se pueden recuperar desde la papelera  
✅ **Logs detallados** para debugging  
✅ **Compatible con sistema de importación** de Grupo 2  

---

## 📚 **ARCHIVOS RELACIONADOS**

- **Backend:** `/supabase/functions/server/index.tsx` (Rutas de workouts agregadas)
- **Frontend API:** `/src/app/services/api.ts` (Llamadas a las rutas)
- **Frontend API con Fallback:** `/src/app/services/apiWithFallback.ts` (Usada por App.tsx)
- **Componente:** `/src/app/components/WorkoutManager.tsx` (UI para gestionar entrenamientos)
- **App Principal:** `/src/app/App.tsx` (Integración de workouts)

---

## 💡 **NOTA IMPORTANTE**

Los entrenamientos creados **ANTES** de este fix solo existían en localStorage. Después de aplicar este fix:

- ✅ Los nuevos entrenamientos se guardarán en Supabase
- ⚠️ Los entrenamientos antiguos en localStorage NO se migrarán automáticamente
- 💡 Para migrar entrenamientos antiguos, usa el botón "Importar Grupo 2" (si es aplicable) o créalos nuevamente

---

**Club Natación Lo Prado**  
**"Haz que todo sea posible"** 🏊‍♂️💪🔴

---

**Status:** ✅ **RESUELTO**  
**Fecha:** Febrero 2026  
**Versión:** 2.0.2  
**Impacto:** CRÍTICO - Funcionalidad esencial restaurada
