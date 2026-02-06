# 🔧 Guía de Troubleshooting - Club Natación Lo Prado

## Problema: No puedo crear mi administrador

### 📋 Checklist de Diagnóstico

Sigue estos pasos en orden para identificar el problema:

---

### 1️⃣ Verificar que la aplicación esté desplegada en Vercel

✅ **Paso:** Ve a https://vercel.com/dashboard y verifica que:
- El deployment haya terminado exitosamente (estado verde ✓)
- No haya errores en el build log
- La aplicación se cargue correctamente en el navegador

❌ **Si falla:** Revisa los logs de build en Vercel y asegúrate de que no haya errores de `figma:asset`

---

### 2️⃣ Verificar que el botón "Crear Administrador" aparezca

✅ **Paso:** En la página de login, deberías ver:
- Un banner morado/azul con animación pulsante
- Texto: "🎉 ¡Bienvenido! Primera vez usando el sistema"
- Botón grande: **"Crear Usuario Administrador Ahora"**

❌ **Si no aparece:** Refresca la página (Ctrl+R o Cmd+R)

---

### 3️⃣ Verificar la consola del navegador

✅ **Paso:** 
1. Abre la consola del navegador (F12 o Cmd+Option+I)
2. Ve a la pestaña "Console"
3. Haz clic en el botón "Crear Usuario Administrador Ahora"
4. Deberías ver estos mensajes:

```
🚀 Iniciando creación de admin...
🔗 URL: https://tvkrvozifmbgkaztwxib.supabase.co/functions/v1/make-server-4909a0bc/auth/init-admin
🔑 Project ID: tvkrvozifmbgkaztwxib
📡 Response status: 200
📦 Response data: { ... }
✅ Administrador inicializado: c749dd28-82cf-4d0c-a83a-e2ef1f2e9132
```

❌ **Errores posibles y soluciones:**

#### Error A: `Failed to fetch` o `Network Error`
**Causa:** No hay conexión al servidor de Supabase

**Soluciones:**
1. Verifica tu conexión a internet
2. Verifica que el servidor de Supabase esté funcionando:
   - Ve a https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib
   - Asegúrate de que el proyecto esté activo (no pausado)
   - Ve a Edge Functions y verifica que `make-server-4909a0bc` esté desplegada

#### Error B: `404 Not Found`
**Causa:** El servidor de Supabase no está desplegado

**Soluciones:**
1. Ve a Supabase Dashboard → Edge Functions
2. Busca la función `make-server-4909a0bc`
3. Si no existe, necesitas redesplegarla (contacta al desarrollador)

#### Error C: `500 Internal Server Error`
**Causa:** El servidor tiene un error interno

**Soluciones:**
1. Ve a Supabase Dashboard → Edge Functions → `make-server-4909a0bc`
2. Haz clic en "Logs" para ver los errores
3. Verifica que las variables de entorno estén configuradas:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_DB_URL`

#### Error D: `CORS Error`
**Causa:** Problema de configuración CORS

**Soluciones:**
1. Verifica que el servidor tenga configurado CORS correctamente
2. El servidor debe incluir estos headers:
   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: POST, GET, OPTIONS
   ```

#### Error E: `Admin already exists`
**Causa:** El administrador ya fue creado anteriormente

**Soluciones:**
1. ✅ Esto es NORMAL si ya creaste el admin antes
2. Simplemente ve a la pestaña "Iniciar Sesión"
3. Usa las credenciales:
   - Email: `admin@loprado.cl`
   - Password: `admin123`

---

### 4️⃣ Verificar el servidor de Supabase Edge Functions

✅ **Paso:**
1. Ve a: https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/functions
2. Busca la función `make-server-4909a0bc`
3. Verifica que esté desplegada y activa
4. Haz clic en "Logs" para ver si hay errores

---

### 5️⃣ Test manual del endpoint

✅ **Paso:** Puedes probar el endpoint directamente desde la consola del navegador:

```javascript
// Copia y pega esto en la consola del navegador (F12)
fetch('https://tvkrvozifmbgkaztwxib.supabase.co/functions/v1/make-server-4909a0bc/auth/init-admin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2a3J2b3ppZm1iZ2thenR3eGliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NjY1MTIsImV4cCI6MjA4MzE0MjUxMn0.2cKgDYsSTn5I-Rpy_MPuvuvyY-_uzyIKkkO9qskzrro'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**Respuesta esperada:**
```json
{
  "message": "Admin user initialized successfully",
  "user": {
    "id": "c749dd28-82cf-4d0c-a83a-e2ef1f2e9132",
    "email": "admin@loprado.cl"
  },
  "email": "admin@loprado.cl",
  "password": "admin123"
}
```

---

### 6️⃣ Si el admin YA existe pero no puedes hacer login

✅ **Pasos:**

1. Verifica que estés usando las credenciales correctas:
   - Email: `admin@loprado.cl`
   - Password: `admin123`

2. Si olvidaste la contraseña, puedes resetear el admin desde Supabase:
   - Ve a: https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/auth/users
   - Busca el usuario `admin@loprado.cl`
   - Haz clic en los 3 puntos → "Reset Password"

3. Alternativamente, puedes eliminar el admin y recrearlo:
   - En Supabase → Authentication → Users
   - Elimina el usuario `admin@loprado.cl`
   - Vuelve a la app y usa el botón "Crear Administrador"

---

## 🆘 Soporte Adicional

Si ninguna de las soluciones anteriores funciona:

1. **Revisa los logs en tiempo real:**
   - Supabase Dashboard → Edge Functions → Logs
   - Vercel Dashboard → Deployments → Runtime Logs

2. **Comparte estos datos en el chat:**
   - Screenshot del error en la consola del navegador
   - Screenshot de los logs de Supabase
   - El mensaje de error exacto que ves

3. **Información útil para debugging:**
   - URL de tu aplicación en Vercel
   - Navegador y versión (ej: Chrome 120)
   - Sistema operativo (Windows, Mac, Linux)
