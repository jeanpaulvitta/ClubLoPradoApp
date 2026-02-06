# ⚡ Solución Rápida - Desplegar Servidor

## 🎯 Problema
```
❌ Servidor no alcanzable: TypeError: Failed to fetch
```

## ✅ Solución en 2 Comandos

### Opción 1: Asistente Automático (Recomendado)
```bash
npm run deploy
```
Este comando ejecuta un asistente interactivo que te guía paso a paso.

### Opción 2: Manual

```bash
# 1. Instalar CLI
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
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY_AQUI

# 6. Verificar
npm run check-server
```

## 🔑 Obtener service_role key

1. Ve a: https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/settings/api
2. Busca "service_role secret"
3. Haz clic en "Reveal"
4. Copia la key

## 📚 Guías Completas

- **Paso a Paso Detallado:** `DESPLIEGUE_PASO_A_PASO.md`
- **Deployment Completo:** `SUPABASE_DEPLOYMENT.md`

## 🆘 ¿Problemas?

```bash
# Ver logs del servidor
supabase functions logs server

# Ver secrets configurados
supabase secrets list

# Redesplegar
supabase functions deploy server
```

## ✅ Resultado Esperado

Después del deployment:

```bash
npm run check-server
```

Deberías ver:
```
✅ ¡SERVIDOR FUNCIONANDO!

📦 Respuesta:
{
  "status": "ok",
  "timestamp": "2026-02-06T...",
  "version": "2.0.1"
}
```

## 🎯 Próximos Pasos

Una vez funcionando:

1. **Inicia la app:**
   ```bash
   npm run dev
   ```

2. **Crea el usuario admin:**
   - Ve a: http://localhost:5173
   - Clic en "Crear Usuario Administrador Ahora"
   - O usa curl:
     ```bash
     curl -X POST https://tvkrvozifmbgkaztwxib.supabase.co/functions/v1/make-server-4909a0bc/auth/init-admin \
       -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2a3J2b3ppZm1iZ2thenR3eGliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NjY1MTIsImV4cCI6MjA4MzE0MjUxMn0.2cKgDYsSTn5I-Rpy_MPuvuvyY-_uzyIKkkO9qskzrro"
     ```

3. **Inicia sesión:**
   - Email: `admin@loprado.cl`
   - Password: `admin123`

---

**¿Aún tienes problemas?** Consulta `DESPLIEGUE_PASO_A_PASO.md` para más detalles.
