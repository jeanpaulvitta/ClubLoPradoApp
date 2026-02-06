# 🚀 Guía de Deployment del Servidor en Supabase

## ⚠️ Problema Actual

Error: `Failed to fetch` - El servidor de Edge Functions no está desplegado en Supabase.

---

## ✅ Solución: Desplegar Edge Functions

### Prerequisitos

1. **Supabase CLI instalado**
2. **Cuenta en Supabase**
3. **Proyecto creado** (ya tienes: `tvkrvozifmbgkaztwxib`)

---

## 📦 Paso 1: Instalar Supabase CLI

### En Windows (PowerShell):
```powershell
# Usando npm
npm install -g supabase

# Verificar instalación
supabase --version
```

### En Mac:
```bash
# Usando Homebrew
brew install supabase/tap/supabase

# Verificar instalación
supabase --version
```

### En Linux:
```bash
# Usando npm
npm install -g supabase

# Verificar instalación
supabase --version
```

---

## 🔐 Paso 2: Login en Supabase

```bash
supabase login
```

Esto abrirá tu navegador para autenticarte. Si no se abre automáticamente, copia el link que aparece en la terminal.

---

## 🔗 Paso 3: Link al Proyecto

```bash
supabase link --project-ref tvkrvozifmbgkaztwxib
```

Cuando te pida la contraseña de la base de datos, usa la contraseña que configuraste cuando creaste el proyecto en Supabase.

---

## 🚀 Paso 4: Desplegar Edge Functions

```bash
# Desplegar todas las funciones
supabase functions deploy

# O solo desplegar la función específica
supabase functions deploy server
```

Verás un output similar a:
```
Deploying Functions...
  - server
✓ Deployed function server
  https://tvkrvozifmbgkaztwxib.supabase.co/functions/v1/server
```

---

## 🔑 Paso 5: Configurar Secrets (Variables de Entorno)

El servidor necesita estas variables de entorno:

```bash
# SUPABASE_URL
supabase secrets set SUPABASE_URL=https://tvkrvozifmbgkaztwxib.supabase.co

# SUPABASE_SERVICE_ROLE_KEY (la puedes obtener del dashboard)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# SUPABASE_ANON_KEY
supabase secrets set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2a3J2b3ppZm1iZ2thenR3eGliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NjY1MTIsImV4cCI6MjA4MzE0MjUxMn0.2cKgDYsSTn5I-Rpy_MPuvuvyY-_uzyIKkkO9qskzrro
```

### ¿Dónde obtener las keys?

1. Ve a: https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/settings/api
2. Copia:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (haz clic en "Reveal")

---

## ✅ Paso 6: Verificar Deployment

### Opción A: Desde el Dashboard

1. Ve a: https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/functions
2. Deberías ver la función `server` listada
3. Haz clic en ella para ver los logs

### Opción B: Desde la Terminal

```bash
# Ver logs en tiempo real
supabase functions logs server

# O probar el endpoint
curl https://tvkrvozifmbgkaztwxib.supabase.co/functions/v1/make-server-4909a0bc/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "timestamp": "2026-02-06T...",
  "version": "2.0.1"
}
```

---

## 🎯 Paso 7: Probar en tu Aplicación

1. Ve a tu aplicación local: http://localhost:5173
2. O a la de producción: https://clubnatacionloprado-bzxkjy9d9-jean-paul-vittas-projects.vercel.app/
3. Haz clic en **"Crear Usuario Administrador Ahora"**
4. Usa el **Panel de Diagnóstico** para verificar conectividad
5. Crea el administrador

---

## 🔄 Comandos Útiles

```bash
# Ver todas las funciones desplegadas
supabase functions list

# Ver logs en tiempo real
supabase functions logs server --follow

# Redesplegar después de cambios
supabase functions deploy server

# Ver secretos configurados
supabase secrets list

# Eliminar un secreto
supabase secrets unset SECRET_NAME
```

---

## 🆘 Troubleshooting

### Error: "No project linked"
```bash
supabase link --project-ref tvkrvozifmbgkaztwxib
```

### Error: "Missing secrets"
Verifica que hayas configurado todas las secrets:
```bash
supabase secrets list
```

Deberías ver:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`

### Error: "Deploy failed"
1. Verifica que el código no tenga errores de sintaxis
2. Revisa los logs:
   ```bash
   supabase functions logs server
   ```
3. Intenta redesplegar:
   ```bash
   supabase functions deploy server --no-verify-jwt
   ```

### La función está desplegada pero no responde
1. Verifica las secrets:
   ```bash
   supabase secrets list
   ```
2. Revisa los logs:
   ```bash
   supabase functions logs server --follow
   ```
3. Prueba el health endpoint:
   ```bash
   curl https://tvkrvozifmbgkaztwxib.supabase.co/functions/v1/make-server-4909a0bc/health
   ```

---

## 📝 Resumen de URLs

- **Dashboard:** https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib
- **Edge Functions:** https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/functions
- **API Settings:** https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/settings/api
- **Health Endpoint:** https://tvkrvozifmbgkaztwxib.supabase.co/functions/v1/make-server-4909a0bc/health
- **Init Admin Endpoint:** https://tvkrvozifmbgkaztwxib.supabase.co/functions/v1/make-server-4909a0bc/auth/init-admin

---

## ✨ Próximos Pasos

Después de desplegar:

1. ✅ Verifica que el health endpoint responda
2. ✅ Prueba el Panel de Diagnóstico en tu app
3. ✅ Crea el usuario administrador
4. ✅ Inicia sesión con las credenciales:
   - Email: `admin@loprado.cl`
   - Password: `admin123`

---

## 🎉 ¿Todo funcionando?

Si todo está OK, deberías poder:
- ✅ Crear el usuario administrador
- ✅ Iniciar sesión
- ✅ Acceder al dashboard completo
- ✅ Gestionar nadadores, entrenamientos, competencias, etc.
