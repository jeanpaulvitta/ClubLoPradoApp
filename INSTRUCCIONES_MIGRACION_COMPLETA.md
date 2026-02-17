# 🚀 INSTRUCCIONES COMPLETAS DE MIGRACIÓN A SUPABASE

## 📋 RESUMEN

Tu aplicación ahora tiene TODO listo para migrar a Supabase. Solo necesitas seguir estos pasos en orden.

---

## ✅ PASO 1: CREAR LA TABLA EN SUPABASE (5 minutos)

### 1.1 Abrir el SQL Editor

Abre este link en tu navegador:
**https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/sql/new**

### 1.2 Ejecutar el SQL

Copia y pega este código completo:

```sql
-- Crear la tabla KV Store
CREATE TABLE IF NOT EXISTS kv_store_4909a0bc (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índice para búsquedas por prefijo
CREATE INDEX IF NOT EXISTS idx_kv_store_key_prefix 
ON kv_store_4909a0bc (key text_pattern_ops);

-- Habilitar Row Level Security (RLS)
ALTER TABLE kv_store_4909a0bc ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir todo (la seguridad la maneja el servidor)
CREATE POLICY "Allow all operations" ON kv_store_4909a0bc
FOR ALL 
USING (true)
WITH CHECK (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_kv_store_updated_at ON kv_store_4909a0bc;
CREATE TRIGGER update_kv_store_updated_at 
BEFORE UPDATE ON kv_store_4909a0bc 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();
```

### 1.3 Ejecutar

Click en **"RUN"** (botón abajo a la derecha)

Deberías ver: **`Success. No rows returned`**

✅ **PASO 1 COMPLETO!**

---

## ✅ PASO 2: INICIAR SESIÓN COMO ADMIN (2 minutos)

### 2.1 Abrir tu aplicación

Ve a tu aplicación en el navegador.

### 2.2 Iniciar sesión

- **Email:** `admin@loprado.cl`
- **Contraseña:** La que configuraste (o `admin123` si es primera vez)

Si nunca has creado el admin, el sistema lo creará automáticamente la primera vez que intentes iniciar sesión.

✅ **PASO 2 COMPLETO!**

---

## ✅ PASO 3: MIGRAR LOS DATOS (5-10 minutos)

### 3.1 Ir a la pestaña "Análisis"

Una vez logueado como admin, ve a la pestaña **"Análisis"** en el menú principal.

### 3.2 Desplazarse hacia abajo

Baja hasta encontrar la sección **"Migración de Datos a Supabase"** (tiene un borde rojo).

### 3.3 Verificar los datos

Verás un resumen de todos los datos que tienes actualmente en LocalStorage:
- ✓ Nadadores
- ✓ Entrenamientos
- ✓ Competencias
- ✓ Asistencia
- ✓ Feriados
- ✓ Test Controls

### 3.4 Click en "Migrar Datos"

Click en el botón rojo grande: **"Migrar XXX Registros a Supabase"**

### 3.5 Esperar

Verás el progreso de la migración en tiempo real:
- 🔵 Azul = Migrando...
- ✅ Verde = Completado
- ❌ Rojo = Error

### 3.6 Resultado

Cuando termine, deberías ver:
```
✅ Nadadores migrados
✅ Entrenamientos migrados
✅ Competencias migradas
✅ Asistencia migrada
✅ Feriados migrados
✅ Test Controls migrados
```

✅ **PASO 3 COMPLETO!**

---

## ✅ PASO 4: VERIFICAR QUE TODO FUNCIONA (2 minutos)

### 4.1 Ejecutar tests de diagnóstico

En la misma pestaña "Análisis", busca **"Diagnóstico de Supabase"** y click en **"Ejecutar Tests"**.

Deberías ver:
```
✅ 1. Conexión API - OK
✅ 2. Edge Function Health - OK
✅ 3. Test de Registro - OK
```

### 4.2 Ver los datos

1. Ve a **"Nadadores"** - deberías ver todos tus nadadores
2. Ve a **"Competencias"** - deberías ver todas tus competencias
3. Ve a **"Entrenamientos"** - deberías ver todos los entrenamientos

### 4.3 Probar crear algo nuevo

Intenta agregar un nadador nuevo o un entrenamiento. Debería guardarse correctamente.

✅ **PASO 4 COMPLETO!**

---

## 🎉 ¡MIGRACIÓN COMPLETA!

Tu aplicación ahora está 100% conectada a Supabase. Todos los datos están en la nube y se sincronizan automáticamente.

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Error: "Missing authorization header"

**Causa:** La tabla `kv_store_4909a0bc` no existe aún.

**Solución:** Ejecuta el Paso 1 (crear la tabla SQL).

---

### Error: "Unauthorized - Invalid token"

**Causa:** No has iniciado sesión o tu sesión expiró.

**Solución:** 
1. Cierra sesión
2. Vuelve a iniciar sesión con `admin@loprado.cl`
3. Intenta de nuevo

---

### Error: "Failed to fetch workouts"

**Causa:** El servidor no tiene configuradas las variables de entorno.

**Solución:**
1. Ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions/make-server-4909a0bc
2. Click en "Secrets"
3. Verifica que existan estas 3 variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Si no existen, agrégalas (ver `/CODIGO_SERVIDOR_COMPLETO.txt` para instrucciones)

---

### La migración se completó pero con errores

**Es normal si:**
- Ya habías migrado algunos datos antes
- Tienes datos duplicados

**Qué hacer:**
- Verifica que los datos importantes estén en Supabase
- Si falta algo, puedes migrar manualmente o volver a intentar

---

## 📞 SIGUIENTE PASO

Una vez completada la migración, todo debería funcionar perfectamente. Si encuentras algún problema específico, avísame con:

1. En qué paso estás
2. Qué error exacto ves
3. Captura de pantalla si es posible

¡Éxito con la migración! 🚀
