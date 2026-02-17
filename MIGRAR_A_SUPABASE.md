# 🚀 Migración: LocalStorage → Supabase

## 📊 Situación Actual

✅ Tabla `kv_store_4909a0bc` existe en Supabase (pero está vacía)
✅ Tus datos están guardados en **localStorage del navegador**
✅ La app funciona con fallback a localStorage

---

## 🎯 Objetivo

Migrar TODOS los datos de localStorage a Supabase para tener persistencia permanente.

---

## 📋 PASO 1: Verificar datos en localStorage

**Abre la consola del navegador** (F12) en tu app y ejecuta:

```javascript
// Ver TODOS los datos en localStorage
console.log('🔍 Datos en localStorage:');
console.log('Nadadores:', localStorage.getItem('swimmers:list'));
console.log('Entrenamientos:', localStorage.getItem('workouts:list'));
console.log('Competencias:', localStorage.getItem('competitions:list'));
console.log('Asistencia:', localStorage.getItem('attendance:records'));
console.log('Test Controls:', localStorage.getItem('test-controls:list'));
console.log('Feriados:', localStorage.getItem('holidays:list'));
```

**¿Qué esperar?**
- Si ves datos (arrays con objetos) → Tienes datos para migrar
- Si ves `null` → No hay datos guardados

---

## 🚀 PASO 2: Script de Migración Automática

Copia y pega este script en la consola del navegador (F12):

```javascript
async function migrarASupabase() {
  console.log('🚀 Iniciando migración a Supabase...');
  
  const API_URL = 'https://rztiyofwhlwvofwhcgue.supabase.co/functions/v1/make-server-4909a0bc';
  const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6dGl5b2Z3aGx3dm9md2hjZ3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1MTI1NDEsImV4cCI6MjA1MTA4ODU0MX0.HuVUPvtx_-k6bqnuq4wVvtjJvk4h3OWQXIUz9HLBgMM';
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ANON_KEY}`
  };
  
  let migrados = 0;
  let errores = 0;
  
  // 1. Migrar nadadores
  const swimmers = localStorage.getItem('swimmers:list');
  if (swimmers) {
    const data = JSON.parse(swimmers);
    console.log(`📊 Encontrados ${data.length} nadadores`);
    
    for (const swimmer of data) {
      try {
        const response = await fetch(`${API_URL}/swimmers`, {
          method: 'POST',
          headers,
          body: JSON.stringify(swimmer)
        });
        
        if (response.ok) {
          migrados++;
          console.log(`✅ Nadador migrado: ${swimmer.name}`);
        } else {
          errores++;
          console.error(`❌ Error migrando: ${swimmer.name}`);
        }
      } catch (error) {
        errores++;
        console.error(`❌ Error: ${error.message}`);
      }
    }
  }
  
  // 2. Migrar entrenamientos
  const workouts = localStorage.getItem('workouts:list');
  if (workouts) {
    const data = JSON.parse(workouts);
    console.log(`📊 Encontrados ${data.length} entrenamientos`);
    
    for (const workout of data) {
      try {
        const response = await fetch(`${API_URL}/workouts`, {
          method: 'POST',
          headers,
          body: JSON.stringify(workout)
        });
        
        if (response.ok) {
          migrados++;
          console.log(`✅ Entrenamiento migrado: ${workout.date}`);
        } else {
          errores++;
          console.error(`❌ Error migrando entrenamiento`);
        }
      } catch (error) {
        errores++;
        console.error(`❌ Error: ${error.message}`);
      }
    }
  }
  
  // 3. Migrar competencias
  const competitions = localStorage.getItem('competitions:list');
  if (competitions) {
    const data = JSON.parse(competitions);
    console.log(`📊 Encontradas ${data.length} competencias`);
    
    for (const competition of data) {
      try {
        const response = await fetch(`${API_URL}/competitions`, {
          method: 'POST',
          headers,
          body: JSON.stringify(competition)
        });
        
        if (response.ok) {
          migrados++;
          console.log(`✅ Competencia migrada: ${competition.name}`);
        } else {
          errores++;
          console.error(`❌ Error migrando competencia`);
        }
      } catch (error) {
        errores++;
        console.error(`❌ Error: ${error.message}`);
      }
    }
  }
  
  // 4. Migrar test controls
  const testControls = localStorage.getItem('test-controls:list');
  if (testControls) {
    const data = JSON.parse(testControls);
    console.log(`📊 Encontrados ${data.length} test controls`);
    
    for (const test of data) {
      try {
        const response = await fetch(`${API_URL}/test-controls`, {
          method: 'POST',
          headers,
          body: JSON.stringify(test)
        });
        
        if (response.ok) {
          migrados++;
          console.log(`✅ Test control migrado`);
        } else {
          errores++;
          console.error(`❌ Error migrando test control`);
        }
      } catch (error) {
        errores++;
        console.error(`❌ Error: ${error.message}`);
      }
    }
  }
  
  // 5. Migrar feriados
  const holidays = localStorage.getItem('holidays:list');
  if (holidays) {
    const data = JSON.parse(holidays);
    console.log(`📊 Encontrados ${data.length} feriados`);
    
    for (const holiday of data) {
      try {
        const response = await fetch(`${API_URL}/holidays`, {
          method: 'POST',
          headers,
          body: JSON.stringify(holiday)
        });
        
        if (response.ok) {
          migrados++;
          console.log(`✅ Feriado migrado: ${holiday.name}`);
        } else {
          errores++;
          console.error(`❌ Error migrando feriado`);
        }
      } catch (error) {
        errores++;
        console.error(`❌ Error: ${error.message}`);
      }
    }
  }
  
  console.log('\n🎉 MIGRACIÓN COMPLETADA');
  console.log(`✅ Migrados: ${migrados}`);
  console.log(`❌ Errores: ${errores}`);
  
  return { migrados, errores };
}

// Ejecutar migración
migrarASupabase();
```

---

## 📋 PASO 3: Verificar en Supabase

Después de ejecutar el script, verifica en Supabase:

```sql
-- Ver cuántos datos se migraron
SELECT COUNT(*) as total_keys
FROM kv_store_4909a0bc;

-- Ver todas las keys
SELECT key
FROM kv_store_4909a0bc
ORDER BY key;

-- Ver nadadores
SELECT jsonb_pretty(value) 
FROM kv_store_4909a0bc
WHERE key = 'swimmers:list';
```

---

## ⚠️ IMPORTANTE

**NO borres el localStorage** hasta confirmar que:
1. ✅ Los datos se migraron correctamente a Supabase
2. ✅ La app lee correctamente desde Supabase
3. ✅ Todo funciona como antes

---

## 🔍 Si el script falla...

1. **Verifica el servidor**:
```javascript
fetch('https://rztiyofwhlwvofwhcgue.supabase.co/functions/v1/make-server-4909a0bc/health')
  .then(r => r.json())
  .then(d => console.log('✅ Servidor:', d));
```

2. **Revisa errores en la consola** y compártelos conmigo

---

## 🎯 Próximo Paso

**Ejecuta PASO 1 primero** para ver qué datos tienes en localStorage, luego comparte los resultados.
