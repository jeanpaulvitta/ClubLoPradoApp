# 🚀 Guía Paso a Paso: Desplegar Edge Functions

## ✅ Prerrequisitos

- Node.js instalado (ya lo tienes ✓)
- Terminal abierta en la carpeta del proyecto
- Acceso al proyecto de Supabase: `tvkrvozifmbgkaztwxib`

---

## 📋 PASO 1: Instalar Supabase CLI

Abre tu terminal en la carpeta del proyecto y ejecuta:

```bash
npm install -g supabase
```

**Verificar instalación:**
```bash
supabase --version
```

Deberías ver algo como: `supabase version 1.x.x`

---

## 🔐 PASO 2: Hacer Login en Supabase

```bash
supabase login
```

**¿Qué sucederá?**
- Se abrirá tu navegador automáticamente
- Te pedirá que autorices la CLI
- Si no se abre, copia el enlace que aparece en la terminal

**⚠️ Importante:** Asegúrate de iniciar sesión con la misma cuenta donde creaste el proyecto.

---

## 🔗 PASO 3: Conectar al Proyecto

```bash
supabase link --project-ref tvkrvozifmbgkaztwxib
```

**Te pedirá:**
- **Database password**: Ingresa la contraseña de tu base de datos de Supabase
  (Es la que configuraste cuando creaste el proyecto)

**Si no recuerdas la contraseña:**
1. Ve a: https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/settings/database
2. Haz clic en "Reset Database Password"
3. Guarda la nueva contraseña
4. Úsala en el comando `supabase link`

---

## 🎯 PASO 4: Obtener las Keys de Supabase

Antes de desplegar, necesitas obtener dos keys:

1. **Ve al Dashboard de API:**
   https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/settings/api

2. **Copia estas keys:**
   - **Project URL** (algo como: `https://tvkrvozifmbgkaztwxib.supabase.co`)
   - **anon public key** (ya la tienes, está abajo)
   - **service_role key** (haz clic en "Reveal" para verla)

**📝 Anota la `service_role` key en algún lugar seguro.**

---

## 🚀 PASO 5: Desplegar las Edge Functions

Ejecuta este comando:

```bash
supabase functions deploy
```

**Verás un output similar a:**
```
Deploying Functions...
  - server
✓ Deployed function server
  https://tvkrvozifmbgkaztwxib.supabase.co/functions/v1/server
```

**✅ ¡Ya está desplegado el código!** Pero aún falta configurar las variables de entorno.

---

## 🔑 PASO 6: Configurar Variables de Entorno (Secrets)

Ejecuta estos 3 comandos (reemplaza `TU_SERVICE_ROLE_KEY` con tu key real):

### 1. Configurar SUPABASE_URL:
```bash
supabase secrets set SUPABASE_URL=https://tvkrvozifmbgkaztwxib.supabase.co
```

### 2. Configurar SUPABASE_ANON_KEY:
```bash
supabase secrets set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2a3J2b3ppZm1iZ2thenR3eGliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NjY1MTIsImV4cCI6MjA4MzE0MjUxMn0.2cKgDYsSTn5I-Rpy_MPuvuvyY-_uzyIKkkO9qskzrro
```

### 3. Configurar SUPABASE_SERVICE_ROLE_KEY (⚠️ IMPORTANTE):
```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY_AQUI
```

**📍 Donde obtener `TU_SERVICE_ROLE_KEY_AQUI`:**
- Ve a: https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/settings/api
- Busca "service_role secret"
- Haz clic en "Reveal"
- Copia la key completa (empezará con `eyJ...`)

---

## ✅ PASO 7: Verificar que Todo Funciona

Ahora ejecuta el script de verificación:

```bash
npm run check-server
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

✨ El servidor está correctamente desplegado y funcionando.
```

---

## 🎉 PASO 8: Crear el Usuario Administrador

Ahora que el servidor funciona, crea tu usuario admin:

### Opción A: Desde la Aplicación Web

1. **Abre tu app local:**
   ```bash
   npm run dev
   ```
   
2. **Ve a:** http://localhost:5173

3. **Haz clic en:** "Crear Usuario Administrador Ahora"

4. **Se creará automáticamente con:**
   - Email: `admin@loprado.cl`
   - Password: `admin123`

5. **Inicia sesión** con esas credenciales

### Opción B: Desde la Terminal (curl)

```bash
curl -X POST https://tvkrvozifmbgkaztwxib.supabase.co/functions/v1/make-server-4909a0bc/auth/init-admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2a3J2b3ppZm1iZ2thenR3eGliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NjY1MTIsImV4cCI6MjA4MzE0MjUxMn0.2cKgDYsSTn5I-Rpy_MPuvuvyY-_uzyIKkkO9qskzrro"
```

---

## 🔄 Comandos Útiles para el Futuro

### Ver logs en tiempo real:
```bash
supabase functions logs server --follow
```

### Ver secrets configurados:
```bash
supabase secrets list
```

### Redesplegar después de hacer cambios:
```bash
supabase functions deploy server
```

### Ver todas las funciones:
```bash
supabase functions list
```

---

## 🆘 Solución de Problemas Comunes

### ❌ Error: "No project linked"
```bash
supabase link --project-ref tvkrvozifmbgkaztwxib
```

### ❌ Error: "Missing secrets"
Verifica que configuraste las 3 secrets:
```bash
supabase secrets list
```
Deberías ver:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### ❌ Error: "Invalid project ref"
- Verifica que estés usando la cuenta correcta de Supabase
- Intenta hacer logout y login de nuevo:
  ```bash
  supabase logout
  supabase login
  ```

### ❌ El servidor está desplegado pero no responde
1. Verifica las secrets:
   ```bash
   supabase secrets list
   ```
2. Revisa los logs:
   ```bash
   supabase functions logs server
   ```
3. Prueba redesplegar:
   ```bash
   supabase functions deploy server
   ```

---

## 📌 Resumen de Comandos en Orden

```bash
# 1. Instalar CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Conectar proyecto
supabase link --project-ref tvkrvozifmbgkaztwxib

# 4. Desplegar funciones
supabase functions deploy

# 5. Configurar secrets (reemplaza TU_SERVICE_ROLE_KEY)
supabase secrets set SUPABASE_URL=https://tvkrvozifmbgkaztwxib.supabase.co
supabase secrets set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2a3J2b3ppZm1iZ2thenR3eGliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NjY1MTIsImV4cCI6MjA4MzE0MjUxMn0.2cKgDYsSTn5I-Rpy_MPuvuvyY-_uzyIKkkO9qskzrro
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY_AQUI

# 6. Verificar
npm run check-server

# 7. Iniciar app
npm run dev
```

---

## 🎯 ¿Qué Sigue?

Una vez que el servidor esté funcionando y hayas creado el usuario admin:

✅ Inicia sesión con:
- Email: `admin@loprado.cl`
- Password: `admin123`

✅ Cambia la contraseña desde el perfil de usuario

✅ Empieza a usar la aplicación:
- Crear nadadores
- Programar entrenamientos
- Registrar asistencia
- Gestionar competencias
- Ver estadísticas

---

## 📞 ¿Necesitas Ayuda?

Si algo no funciona:

1. **Verifica el Dashboard de Supabase:**
   https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/functions

2. **Revisa los logs:**
   ```bash
   supabase functions logs server
   ```

3. **Ejecuta el diagnóstico:**
   ```bash
   npm run check-server
   ```

---

**🎉 ¡Éxito! Con estos pasos tu servidor estará 100% funcionando.**
