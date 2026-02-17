# 🗄️ Persistencia de Datos - Club Natación Lo Prado

## ✅ CORRECCIÓN APLICADA

**El código ya está actualizado** para usar tu tabla existente: **`kv_store_4909a0bc`**

---

## 📊 Tu Tabla en Supabase

**Nombre:** `kv_store_4909a0bc`
**Ubicación:** https://supabase.com/dashboard/project/rztiyofwhlwvofwhcgue/database/tables

### Estructura actual:
```sql
-- Tu tabla tiene esta estructura simple:
CREATE TABLE kv_store_4909a0bc (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
```

---

## 🔍 Verificar tus Datos Actuales

### Ver todas las claves guardadas:
```sql
SELECT key
FROM kv_store_4909a0bc
ORDER BY key;
```

### Contar total de registros:
```sql
SELECT COUNT(*) as total_keys,
       pg_size_pretty(SUM(pg_column_size(value))) as total_size
FROM kv_store_4909a0bc;
```

### Ver nadadores:
```sql
SELECT jsonb_pretty(value) 
FROM kv_store_4909a0bc
WHERE key = 'swimmers:list';
```

### Ver entrenamientos:
```sql
SELECT jsonb_pretty(value) 
FROM kv_store_4909a0bc
WHERE key = 'workouts:list';
```

### Ver competencias:
```sql
SELECT jsonb_pretty(value) 
FROM kv_store_4909a0bc
WHERE key = 'competitions:list';
```

### Ver asistencia:
```sql
SELECT jsonb_pretty(value) 
FROM kv_store_4909a0bc
WHERE key = 'attendance:records';
```

### Ver control de tests:
```sql
SELECT jsonb_pretty(value) 
FROM kv_store_4909a0bc
WHERE key = 'test-controls:list';
```

### Ver solicitudes de contraseña:
```sql
SELECT jsonb_pretty(value) 
FROM kv_store_4909a0bc
WHERE key = 'password-requests:list';
```

---

## 📋 Qué datos se guardan

| Key | Descripción |
|-----|-------------|
| `swimmers:list` | Lista completa de nadadores |
| `workouts:list` | Entrenamientos (Grupo 1 y 2) |
| `attendance:records` | Registro de asistencia |
| `competitions:list` | Competencias y resultados |
| `test-controls:list` | Control de tests |
| `password-requests:list` | Solicitudes de acceso |
| `trash:items` | Papelera (30 días) |
| `holidays:list` | Feriados y días festivos |

---

## ✅ Todo está funcionando si...

- [x] La tabla `kv_store_4909a0bc` existe en Supabase
- [x] Puedes ver datos al ejecutar los SELECT de arriba
- [x] Los datos NO desaparecen al recargar la app
- [x] Puedes agregar nadadores/entrenamientos y se guardan

---

## 🔧 Si necesitas verificar permisos (RLS)

```sql
-- Ver políticas actuales
SELECT policyname, cmd, roles
FROM pg_policies 
WHERE tablename = 'kv_store_4909a0bc';

-- Si necesitas recrear permisos
ALTER TABLE public.kv_store_4909a0bc ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role has full access" ON public.kv_store_4909a0bc;

CREATE POLICY "Service role has full access" 
ON public.kv_store_4909a0bc
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);
```

---

## 🎯 Flujo de Datos

```
Vercel (Frontend React)
    ↓
API: /functions/v1/make-server-4909a0bc/*
    ↓
Edge Function "server" (Supabase)
    ↓
kv_store.tsx (get/set/del/mget/mset/mdel/getByPrefix)
    ↓
PostgreSQL: kv_store_4909a0bc
```

---

## 📊 Monitoreo

### Keys más grandes:
```sql
SELECT key,
       pg_size_pretty(pg_column_size(value)) as tamaño
FROM kv_store_4909a0bc
ORDER BY pg_column_size(value) DESC
LIMIT 10;
```

### Ver todas las keys con su contenido resumido:
```sql
SELECT key,
       CASE 
         WHEN jsonb_typeof(value) = 'array' THEN 'Array con ' || jsonb_array_length(value) || ' elementos'
         WHEN jsonb_typeof(value) = 'object' THEN 'Objeto JSON'
         ELSE jsonb_typeof(value)
       END as tipo_dato
FROM kv_store_4909a0bc
ORDER BY key;
```

---

## 🚀 Backup Manual

```sql
-- Ver todos los datos en formato exportable
SELECT key, value::text
FROM kv_store_4909a0bc
ORDER BY key;
```

---

## 🎉 Resumen

✅ **Código actualizado para usar:** `kv_store_4909a0bc`
✅ **No necesitas crear nueva tabla**
✅ **Tus datos existentes están seguros**
✅ **Persistencia completa funcionando**

---

**Club Natación Lo Prado** - Haz que todo sea posible  
**Última actualización:** 17 de febrero de 2026