-- ==========================================
-- SCRIPT SQL PARA TABLA KV_STORE
-- ==========================================
-- 
-- ⚠️ IMPORTANTE: Tu tabla YA EXISTE
-- Este script es solo de referencia
-- 
-- NO LO EJECUTES a menos que necesites recrear la tabla
-- ==========================================

-- Tu tabla actual (ESTRUCTURA SIMPLE)
-- Ya existe en: https://supabase.com/dashboard/project/rztiyofwhlwvofwhcgue/database/tables

/*
CREATE TABLE IF NOT EXISTS public.kv_store_4909a0bc (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
*/

-- ==========================================
-- VERIFICAR QUE LA TABLA EXISTE
-- ==========================================

SELECT 
  tablename, 
  schemaname,
  tableowner
FROM pg_tables 
WHERE tablename = 'kv_store_4909a0bc';

-- ==========================================
-- VER POLÍTICAS DE SEGURIDAD (RLS)
-- ==========================================

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'kv_store_4909a0bc';

-- ==========================================
-- VER TODAS LAS KEYS GUARDADAS
-- ==========================================

SELECT key
FROM kv_store_4909a0bc
ORDER BY key;

-- ==========================================
-- CONTAR REGISTROS Y TAMAÑO
-- ==========================================

SELECT 
  COUNT(*) as total_keys,
  pg_size_pretty(SUM(pg_column_size(value))) as total_size
FROM kv_store_4909a0bc;

-- ==========================================
-- ✅ SI NECESITAS RECREAR PERMISOS (RLS)
-- ==========================================

/*
ALTER TABLE public.kv_store_4909a0bc ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role has full access" ON public.kv_store_4909a0bc;

CREATE POLICY "Service role has full access" 
ON public.kv_store_4909a0bc
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);
*/

-- ==========================================
-- ✅ TABLA CONFIGURADA CORRECTAMENTE
-- ==========================================
