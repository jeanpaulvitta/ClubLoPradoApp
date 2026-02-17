# ⚡ Comandos SQL Rápidos - Club Natación Lo Prado

## 🎯 Para copiar y pegar directamente en Supabase SQL Editor

---

## ✅ VERIFICACIÓN BÁSICA

### Ver todas las claves guardadas:
```sql
SELECT key
FROM kv_store_4909a0bc
ORDER BY key;
```

### Contar cuántos datos tienes:
```sql
SELECT COUNT(*) as total_keys,
       pg_size_pretty(SUM(pg_column_size(value))) as total_size
FROM kv_store_4909a0bc;
```

---

## 👥 NADADORES

### Ver todos los nadadores:
```sql
SELECT jsonb_pretty(value) 
FROM kv_store_4909a0bc
WHERE key = 'swimmers:list';
```

### Contar nadadores:
```sql
SELECT jsonb_array_length(value) as total_nadadores
FROM kv_store_4909a0bc
WHERE key = 'swimmers:list';
```

### Ver nombres de nadadores:
```sql
SELECT jsonb_array_elements(value)->>'name' as nombre
FROM kv_store_4909a0bc
WHERE key = 'swimmers:list'
ORDER BY nombre;
```

---

## 🏊 ENTRENAMIENTOS

### Ver todos los entrenamientos:
```sql
SELECT jsonb_pretty(value) 
FROM kv_store_4909a0bc
WHERE key = 'workouts:list';
```

### Contar entrenamientos:
```sql
SELECT jsonb_array_length(value) as total_entrenamientos
FROM kv_store_4909a0bc
WHERE key = 'workouts:list';
```

### Ver entrenamientos por grupo:
```sql
SELECT 
    jsonb_array_elements(value)->>'group' as grupo,
    COUNT(*) as cantidad
FROM kv_store_4909a0bc
WHERE key = 'workouts:list'
GROUP BY grupo;
```

---

## ✅ ASISTENCIA

### Ver registros de asistencia:
```sql
SELECT jsonb_pretty(value) 
FROM kv_store_4909a0bc
WHERE key = 'attendance:records';
```

### Contar registros de asistencia:
```sql
SELECT jsonb_array_length(value) as total_asistencias
FROM kv_store_4909a0bc
WHERE key = 'attendance:records';
```

---

## 🏆 COMPETENCIAS

### Ver todas las competencias:
```sql
SELECT jsonb_pretty(value) 
FROM kv_store_4909a0bc
WHERE key = 'competitions:list';
```

### Contar competencias:
```sql
SELECT jsonb_array_length(value) as total_competencias
FROM kv_store_4909a0bc
WHERE key = 'competitions:list';
```

---

## 📊 CONTROL DE TESTS

### Ver tests programados:
```sql
SELECT jsonb_pretty(value) 
FROM kv_store_4909a0bc
WHERE key = 'test-controls:list';
```

### Contar tests:
```sql
SELECT jsonb_array_length(value) as total_tests
FROM kv_store_4909a0bc
WHERE key = 'test-controls:list';
```

---

## 🔐 SOLICITUDES DE CONTRASEÑA

### Ver solicitudes pendientes:
```sql
SELECT jsonb_pretty(value) 
FROM kv_store_4909a0bc
WHERE key = 'password-requests:list';
```

### Contar solicitudes:
```sql
SELECT jsonb_array_length(value) as total_solicitudes
FROM kv_store_4909a0bc
WHERE key = 'password-requests:list';
```

---

## 🗑️ PAPELERA

### Ver elementos en papelera:
```sql
SELECT jsonb_pretty(value) 
FROM kv_store_4909a0bc
WHERE key = 'trash:items';
```

### Limpiar papelera (vaciarla):
```sql
UPDATE kv_store_4909a0bc
SET value = '[]'::jsonb
WHERE key = 'trash:items';
```

---

## 📈 ANÁLISIS Y ESTADÍSTICAS

### Ver tamaño de cada key:
```sql
SELECT key,
       pg_size_pretty(pg_column_size(value)) as tamaño,
       CASE 
         WHEN jsonb_typeof(value) = 'array' THEN jsonb_array_length(value) || ' elementos'
         ELSE 'Objeto JSON'
       END as contenido
FROM kv_store_4909a0bc
ORDER BY pg_column_size(value) DESC;
```

### Ver estructura de los datos:
```sql
SELECT key,
       jsonb_typeof(value) as tipo,
       CASE 
         WHEN jsonb_typeof(value) = 'array' THEN jsonb_array_length(value)
         ELSE NULL
       END as cantidad_elementos
FROM kv_store_4909a0bc
ORDER BY key;
```

---

## 🔍 BÚSQUEDAS ESPECÍFICAS

### Buscar nadador por nombre (ejemplo: "Juan"):
```sql
SELECT jsonb_array_elements(value)
FROM kv_store_4909a0bc
WHERE key = 'swimmers:list'
  AND value::text ILIKE '%Juan%';
```

### Ver entrenamientos de un grupo específico (ejemplo: "Grupo 1"):
```sql
SELECT jsonb_array_elements(value)
FROM kv_store_4909a0bc
WHERE key = 'workouts:list'
  AND value::text ILIKE '%Grupo 1%';
```

---

## 🚀 EXPORTAR DATOS (BACKUP)

### Exportar TODO como JSON:
```sql
SELECT jsonb_object_agg(key, value) as backup_completo
FROM kv_store_4909a0bc;
```

### Exportar solo nadadores como CSV:
```sql
SELECT 
    jsonb_array_elements(value)->>'name' as nombre,
    jsonb_array_elements(value)->>'email' as email,
    jsonb_array_elements(value)->>'group' as grupo
FROM kv_store_4909a0bc
WHERE key = 'swimmers:list';
```

---

## ⚠️ MANTENIMIENTO

### Ver permisos (RLS):
```sql
SELECT policyname, cmd, roles, permissive
FROM pg_policies 
WHERE tablename = 'kv_store_4909a0bc';
```

### Ver información de la tabla:
```sql
SELECT 
    schemaname,
    tablename,
    tableowner,
    tablespace
FROM pg_tables 
WHERE tablename = 'kv_store_4909a0bc';
```

### Ver índices:
```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'kv_store_4909a0bc';
```

---

## 🎉 COMANDOS MÁS USADOS

```sql
-- 1. Ver resumen general
SELECT 
    COUNT(*) as total_keys,
    pg_size_pretty(SUM(pg_column_size(value))) as tamaño_total
FROM kv_store_4909a0bc;

-- 2. Ver todas las keys
SELECT key FROM kv_store_4909a0bc ORDER BY key;

-- 3. Ver nadadores
SELECT jsonb_pretty(value) FROM kv_store_4909a0bc WHERE key = 'swimmers:list';

-- 4. Ver entrenamientos
SELECT jsonb_pretty(value) FROM kv_store_4909a0bc WHERE key = 'workouts:list';

-- 5. Ver competencias
SELECT jsonb_pretty(value) FROM kv_store_4909a0bc WHERE key = 'competitions:list';
```

---

**Club Natación Lo Prado** 🏊‍♂️  
Todos estos comandos funcionan con tu tabla: `kv_store_4909a0bc`
