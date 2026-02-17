# 🔄 MIGRACIÓN DE DATOS A SUPABASE

## PROBLEMA ACTUAL

Los errores que ves son porque:
1. ✅ El servidor está desplegado correctamente
2. ❌ La tabla `kv_store_4909a0bc` NO EXISTE en Supabase
3. ❌ No hay datos migrados todavía

## SOLUCIÓN EN 2 PASOS

---

### PASO 1: CREAR LA TABLA KV STORE (SQL)

1. **Abre el SQL Editor de Supabase:**
   https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/sql/new

2. **Copia y pega este SQL:**

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

3. **Click en "RUN"** (botón abajo a la derecha)

4. **Deberías ver:** `Success. No rows returned`

---

### PASO 2: INICIALIZAR DATOS

Ahora vamos a crear un endpoint especial en el servidor para migrar todos tus datos actuales.

**YO VOY A CREAR UN SCRIPT DE MIGRACIÓN AUTOMÁTICO QUE:**
- Lee todos los datos de tu aplicación actual
- Los sube a Supabase en un solo click

---

## ✅ DESPUÉS DE CREAR LA TABLA

Una vez que hayas creado la tabla con el SQL del Paso 1:

1. Recarga tu aplicación (F5)
2. Ve a la pestaña "Análisis"
3. Click en "Ejecutar Tests" en el Diagnóstico
4. Deberías ver TODO en verde ✅

---

## 🆘 SI ALGO SALE MAL

**Error: "relation kv_store_4909a0bc does not exist"**
→ No ejecutaste el SQL del Paso 1. Ve al SQL Editor y ejecútalo.

**Error: "permission denied"**
→ Verifica que ejecutaste TODAS las líneas del SQL (incluyendo las políticas RLS)

**Error: "Missing authorization header"**
→ Esto debería desaparecer después de crear la tabla

---

## 📞 DIME CUANDO HAYAS EJECUTADO EL PASO 1

Una vez que hayas creado la tabla, avísame y crearemos el script de migración de datos.
