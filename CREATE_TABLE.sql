-- ==========================================
-- SCRIPT SQL PARA CREAR TABLA KV_STORE
-- ==========================================
-- 
-- INSTRUCCIONES:
-- 1. Ve a: https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/sql/new
-- 2. Copia y pega este script completo
-- 3. Haz clic en "Run" (o presiona Ctrl+Enter)
-- 4. Verifica que se creó correctamente
--
-- ==========================================

-- Crear la tabla kv_store_000a47d9
CREATE TABLE IF NOT EXISTS public.kv_store_000a47d9 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índice para búsquedas por prefijo (optimiza getByPrefix)
CREATE INDEX IF NOT EXISTS kv_store_000a47d9_key_prefix_idx 
ON public.kv_store_000a47d9 (key text_pattern_ops);

-- Crear índice GIN para búsquedas en JSON (opcional, útil para búsquedas complejas)
CREATE INDEX IF NOT EXISTS kv_store_000a47d9_value_idx 
ON public.kv_store_000a47d9 USING GIN (value);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_kv_store_000a47d9_updated_at ON public.kv_store_000a47d9;
CREATE TRIGGER update_kv_store_000a47d9_updated_at
    BEFORE UPDATE ON public.kv_store_000a47d9
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.kv_store_000a47d9 ENABLE ROW LEVEL SECURITY;

-- Política: Permitir todas las operaciones al service_role
CREATE POLICY "Service role has full access" 
ON public.kv_store_000a47d9
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- Política: Permitir lectura a usuarios autenticados (opcional)
CREATE POLICY "Authenticated users can read" 
ON public.kv_store_000a47d9
FOR SELECT 
TO authenticated
USING (true);

-- Verificar que la tabla se creó correctamente
SELECT 
  tablename, 
  schemaname,
  tableowner
FROM pg_tables 
WHERE tablename = 'kv_store_000a47d9';

-- Ver las políticas de RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'kv_store_000a47d9';

-- ==========================================
-- ✅ SCRIPT COMPLETADO
-- ==========================================
-- 
-- Si ves resultados en las consultas SELECT de arriba,
-- la tabla se creó correctamente.
--
-- Ahora puedes:
-- 1. Recargar tu aplicación (F5)
-- 2. El backend ahora podrá guardar datos en Supabase
-- 3. Los datos persisitirán incluso después de recargar
--
-- ==========================================
