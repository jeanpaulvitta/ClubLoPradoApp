# 🔧 Solución: Error al Registrar Usuario

## ❌ Error Reportado

```
❌ Signup error: Error: Error al registrar usuario
Create user account error: Error: Error al registrar usuario
❌ PasswordRequestsManager - Error al aprobar solicitud: Error: Error al registrar usuario
```

## 🔍 Diagnóstico

He mejorado el logging de errores para que ahora veamos **el error específico** en la consola del navegador.

## ✅ Cambios Realizados

### 1. Mejorado el error handling en el servidor (`/supabase/functions/server/index.tsx`)

Ahora el servidor devuelve detalles completos del error:

```typescript
if (error) {
  console.error('❌ Signup error:', error);
  console.error('❌ Error details:', JSON.stringify(error, null, 2));
  return c.json({ 
    error: error.message || 'Error al registrar usuario',
    details: error,
    email: email,
    role: role
  }, 400);
}
```

### 2. Mejorado el error handling en el frontend (`/src/app/services/auth.ts`)

Ahora extrae el mensaje de error real del servidor:

```typescript
const errorMessage = error.message || error.details?.message || error.error || 'Error al registrar usuario';
```

## 🎯 Cómo Diagnosticar AHORA

### Paso 1: Abre la consola del navegador

1. Presiona **F12** en tu navegador
2. Ve a la pestaña **"Console"**
3. Deja la consola abierta

### Paso 2: Intenta crear un usuario nuevamente

1. Ve a la pestaña **"Usuarios"**
2. Click en **"Nuevo Usuario"**
3. Llena el formulario:
   - Nombre: "Test Usuario"
   - Email: "test@ejemplo.com"
   - Rol: "Entrenador"
4. Click en **"Crear Usuario"**

### Paso 3: Lee el error REAL en la consola

Ahora verás mensajes mucho más detallados:

```
❌ Server error response: { ... detalles completos ... }
❌ Signup error: Error: [MENSAJE ESPECÍFICO]
❌ Error details: [MENSAJE ESPECÍFICO]
```

**📸 POR FAVOR, ENVÍAME UNA CAPTURA DE PANTALLA DE ESTOS ERRORES**

---

## 🔍 Causas Posibles y Soluciones

### Causa 1: Variables de entorno no configuradas

**Síntomas:**
- Error: "Invalid API key" o "Unauthorized"
- Error: "Cannot read property 'admin' of undefined"

**Solución:**
1. Verifica que las variables de entorno estén configuradas en Supabase:
   ```
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   SUPABASE_ANON_KEY=eyJhbGc...
   ```

2. Ve a tu proyecto en [supabase.com](https://supabase.com)
3. Settings → API
4. Copia las keys correctas

### Causa 2: Usuario ya existe

**Síntomas:**
- Error: "User already registered" o "Email already exists"

**Solución:**
1. Elimina el usuario duplicado desde Supabase Dashboard:
   - Authentication → Users
   - Busca el email
   - Delete user

2. O usa un email diferente para probar

### Causa 3: Permisos del Service Role Key

**Síntomas:**
- Error: "Permission denied" o "Insufficient permissions"

**Solución:**
- Asegúrate de usar el **SERVICE_ROLE_KEY**, NO el ANON_KEY
- El SERVICE_ROLE_KEY debe tener permisos de admin

### Causa 4: Edge Function no desplegada

**Síntomas:**
- Error: "Function not found" o 404

**Solución:**
```bash
# Desplegar Edge Functions
cd supabase
supabase functions deploy server
```

### Causa 5: Límite de usuarios alcanzado (Free Tier)

**Síntomas:**
- Error: "Quota exceeded" o "Too many users"

**Solución:**
- Supabase Free Tier: máximo 50,000 usuarios
- Si alcanzaste el límite, actualiza tu plan

---

## 🧪 Test Manual con cURL

Para verificar si el servidor funciona, prueba esto desde tu terminal:

```bash
# Reemplaza con tu projectId y service role key
curl -X POST https://TU-PROJECT-ID.supabase.co/functions/v1/make-server-4909a0bc/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ejemplo.com",
    "password": "Test1234!",
    "name": "Usuario Test",
    "role": "coach"
  }'
```

**Respuesta esperada (éxito):**
```json
{
  "user": {
    "id": "...",
    "email": "test@ejemplo.com",
    "name": "Usuario Test",
    "role": "coach"
  }
}
```

**Respuesta de error:**
```json
{
  "error": "Error message here",
  "details": { ... }
}
```

---

## 🔄 Verificar que Supabase esté funcionando

### Test 1: Verificar API Key

```javascript
// En la consola del navegador (F12)
fetch('https://TU-PROJECT-ID.supabase.co/rest/v1/', {
  headers: {
    'apikey': 'TU-ANON-KEY',
    'Authorization': 'Bearer TU-ANON-KEY'
  }
}).then(r => r.json()).then(console.log)
```

Debería retornar algo, no un error 401.

### Test 2: Verificar Edge Function

```javascript
// En la consola del navegador
fetch('https://TU-PROJECT-ID.supabase.co/functions/v1/make-server-4909a0bc/health')
  .then(r => r.json())
  .then(console.log)
```

Debería retornar: `{ status: "ok" }`

---

## 📋 Checklist de Verificación

Marca cada item:

- [ ] ✅ Variables de entorno configuradas en Supabase
- [ ] ✅ Edge Function "server" desplegada
- [ ] ✅ SUPABASE_SERVICE_ROLE_KEY es correcto (no ANON_KEY)
- [ ] ✅ El email que intentas registrar NO existe ya
- [ ] ✅ La consola del navegador muestra el error específico
- [ ] ✅ El test de cURL funciona

---

## 🚨 Si NADA funciona

### Opción 1: Re-desplegar Edge Function

```bash
cd supabase
supabase functions deploy server --no-verify-jwt
```

### Opción 2: Verificar logs del servidor

```bash
supabase functions logs server --tail
```

### Opción 3: Recrear las variables de entorno

1. Ve a Supabase Dashboard
2. Settings → Edge Functions → Environment Variables
3. Elimina y vuelve a crear:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_ANON_KEY`

---

## 📞 Información Necesaria para Ayudar

Si el problema persiste, necesito:

1. **Captura de pantalla de la consola del navegador** (F12 → Console) al intentar crear usuario
2. **Captura de los logs del servidor** (si tienes acceso):
   ```bash
   supabase functions logs server --tail
   ```
3. **Confirmación de que las variables de entorno están configuradas**
4. **El mensaje de error ESPECÍFICO** que ahora aparece en la consola

---

## ✅ Próximos Pasos

1. **Intenta crear un usuario nuevamente**
2. **Copia el error ESPECÍFICO** de la consola
3. **Envíamelo** y podré darte una solución exacta

Con el nuevo logging mejorado, ahora podremos ver exactamente qué está fallando en Supabase Auth.

---

**Fecha**: 10 de Febrero, 2026  
**Cambios**: Mejorado error handling en servidor y cliente  
**Archivos modificados**: 
- `/supabase/functions/server/index.tsx` (líneas 119-122, 168-170)
- `/src/app/services/auth.ts` (líneas 216-220)
