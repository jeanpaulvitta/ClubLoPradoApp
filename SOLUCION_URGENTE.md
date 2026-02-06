# 🚨 SOLUCIÓN URGENTE - Servidor No Alcanzable

## ❌ Problema
```
Error: Failed to fetch
❌ Servidor no alcanzable
```

## ✅ Causa
El servidor de Edge Functions NO está desplegado en Supabase.

---

## 🎯 SOLUCIÓN MÁS RÁPIDA (Recomendado)

### Opción 1: Asistente Automático 🤖
```bash
npm run deploy
```

Este comando te guiará paso a paso automáticamente. **¡La forma más fácil!**

---

### Opción 2: Comandos Manuales ⚡
```bash
# 1. Instalar Supabase CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Conectar proyecto
supabase link --project-ref tvkrvozifmbgkaztwxib

# 4. Desplegar
supabase functions deploy

# 5. Configurar secrets (⚠️ Reemplaza TU_SERVICE_ROLE_KEY)
supabase secrets set SUPABASE_URL=https://tvkrvozifmbgkaztwxib.supabase.co
supabase secrets set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2a3J2b3ppZm1iZ2thenR3eGliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NjY1MTIsImV4cCI6MjA4MzE0MjUxMn0.2cKgDYsSTn5I-Rpy_MPuvuvyY-_uzyIKkkO9qskzrro
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY

# 6. Verificar
npm run check-server
```

**🔑 Obtener service_role_key:**
1. Ve a: https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/settings/api
2. Busca "service_role secret"
3. Haz clic en "Reveal"
4. Copia la key

---

## 🔍 Verificar el Deployment

```bash
# Verificación rápida
npm run check-server

# Verificación completa
npm run verify
```

**Resultado esperado:**
```
✅ ¡SERVIDOR FUNCIONANDO!

📦 Respuesta:
{
  "status": "ok",
  "timestamp": "2026-02-06T...",
  "version": "2.0.1"
}
```