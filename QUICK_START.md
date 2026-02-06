# ⚡ Quick Start - Club Natación Lo Prado

## 🎯 Error: "Failed to fetch"

### Solución en 1 línea:
```bash
npm run deploy
```

Sigue las instrucciones del asistente.

---

## 📋 Si prefieres hacerlo manualmente:

```bash
# 1. Instalar CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Conectar
supabase link --project-ref tvkrvozifmbgkaztwxib

# 4. Desplegar
supabase functions deploy

# 5. Configurar (⚠️ obtén tu service_role_key del dashboard)
supabase secrets set SUPABASE_URL=https://tvkrvozifmbgkaztwxib.supabase.co
supabase secrets set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2a3J2b3ppZm1iZ2thenR3eGliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NjY1MTIsImV4cCI6MjA4MzE0MjUxMn0.2cKgDYsSTn5I-Rpy_MPuvuvyY-_uzyIKkkO9qskzrro
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=TU_KEY_AQUI

# 6. Verificar
npm run verify
```

---

## 🔑 Obtener service_role_key:

https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/settings/api

Haz clic en "Reveal" en "service_role secret"

---

## ✅ Después del deployment:

```bash
# Iniciar app
npm run dev

# Abrir navegador
http://localhost:5173
```

**Crear admin:** Clic en "Crear Usuario Administrador Ahora"

**Login:**
- Email: `admin@loprado.cl`
- Password: `admin123`

---

## 📚 Más ayuda:

- **Guía completa:** `LEEME_DEPLOYMENT.md`
- **Paso a paso:** `DESPLIEGUE_PASO_A_PASO.md`
- **Problemas:** `TROUBLESHOOTING.md`
- **Índice:** `INDICE_DOCUMENTACION.md`

---

## 🔍 Diagnóstico:

```bash
npm run verify      # Verificación completa
npm run check-server # Solo health check
```

---

**¡Eso es todo!** 🎉
