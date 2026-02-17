# 🔐 Configuración JWT para Cambio de Contraseñas en Supabase

## Problema

Al intentar cambiar contraseñas, recibes errores como:
- `Invalid JWT`
- `JWT verification failed`
- `Unauthorized`

Esto ocurre porque el Edge Function no está configurado correctamente para validar tokens JWT.

## ✅ Solución: Configurar JWT Secret

### Paso 1: Obtener el JWT Secret de tu proyecto

1. Ve a **Supabase Dashboard**
2. Selecciona tu proyecto: `vrclozhgaacehojbnpuo`
3. Ve a **Settings** (Configuración) → **API**
4. Busca la sección **JWT Settings**
5. Copia el valor de **JWT Secret** (es un string largo como `your-super-secret-jwt-token-with-at-least-32-characters-long`)

### Paso 2: Configurar las Variables de Entorno

Tu Edge Function necesita estas variables de entorno:

```bash
# Variables requeridas (YA CONFIGURADAS)
SUPABASE_URL=https://vrclozhgaacehojbnpuo.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Variable NUEVA (agregar)
SUPABASE_JWT_SECRET=your-actual-jwt-secret-from-step-1
```

### Paso 3: Agregar el Secret al Edge Function

#### Opción A: Dashboard de Supabase (RECOMENDADO)

1. Ve a **Edge Functions** en el dashboard
2. Selecciona la función `make-server-4909a0bc`
3. Ve a **Settings** → **Secrets**
4. Haz clic en **Add Secret**
5. Nombre: `SUPABASE_JWT_SECRET`
6. Valor: [pega el JWT Secret del Paso 1]
7. Haz clic en **Save**

#### Opción B: CLI de Supabase

```bash
# Desde tu terminal
supabase secrets set SUPABASE_JWT_SECRET=your-actual-jwt-secret
```

### Paso 4: Verificar la Configuración

1. Redeploya el Edge Function (si usaste el dashboard, no es necesario):
   ```bash
   supabase functions deploy make-server-4909a0bc
   ```

2. Prueba el cambio de contraseña:
   - Inicia sesión en la app
   - Ve al menú de usuario (esquina superior derecha)
   - Selecciona "Cambiar Contraseña"
   - Ingresa la contraseña actual y la nueva
   - Haz clic en "Cambiar Contraseña"

## 🔍 Diagnóstico

### Ver logs del Edge Function

```bash
supabase functions logs make-server-4909a0bc
```

Busca mensajes como:
- `✅ JWT verified successfully`
- `❌ JWT verification failed`

### Verificar que las variables estén configuradas

En el dashboard:
1. Edge Functions → make-server-4909a0bc → Settings → Secrets
2. Verifica que estas variables existan:
   - ✅ SUPABASE_URL
   - ✅ SUPABASE_ANON_KEY
   - ✅ SUPABASE_SERVICE_ROLE_KEY
   - ✅ **SUPABASE_JWT_SECRET** ← Esta es la nueva

## ⚠️ Notas Importantes

### ¿Por qué necesitamos JWT_SECRET?

El Edge Function usa `supabase.auth.getUser(token)` para validar el token JWT del usuario. Para que esto funcione, Supabase necesita:

1. **SERVICE_ROLE_KEY** - Para operaciones administrativas (crear usuarios, etc.)
2. **JWT_SECRET** - Para validar tokens de usuarios (verificar que el token sea válido)

Sin el JWT_SECRET, el servidor no puede verificar que el token del usuario sea legítimo.

### ¿Qué hace el JWT_SECRET?

Cuando un usuario inicia sesión, Supabase genera un token JWT firmado con el JWT_SECRET. Cuando el usuario hace una petición al backend, el servidor:

1. Recibe el token JWT en el header `Authorization: Bearer <token>`
2. Usa el JWT_SECRET para verificar la firma
3. Decodifica el token y extrae el ID del usuario
4. Permite o rechaza la operación

## 🐛 Problemas Comunes

### Error: "JWT verification failed"

**Causa:** El JWT_SECRET no está configurado o es incorrecto

**Solución:** 
1. Verifica que el secret en el dashboard coincida con el de Settings → API → JWT Secret
2. No uses comillas al copiar el secret
3. Asegúrate de no tener espacios al inicio o final

### Error: "Invalid JWT"

**Causa:** El token del usuario expiró

**Solución:** 
- La app automáticamente refresca tokens cercanos a expirar
- Si persiste, cierra sesión y vuelve a iniciar sesión

### Error: "Missing authorization header"

**Causa:** El frontend no está enviando el token

**Solución:**
- Verifica que estés autenticado
- Revisa la consola del navegador para errores
- Intenta cerrar sesión y volver a iniciar sesión

## 📚 Recursos

- [Supabase Auth - JWT Tokens](https://supabase.com/docs/guides/auth/auth-deep-dive/auth-deep-dive-jwts)
- [Edge Functions - Environment Variables](https://supabase.com/docs/guides/functions/secrets)
- [Auth - Server-side rendering](https://supabase.com/docs/guides/auth/server-side-rendering)

## ✅ Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] SUPABASE_URL está configurado
- [ ] SUPABASE_ANON_KEY está configurado
- [ ] SUPABASE_SERVICE_ROLE_KEY está configurado
- [ ] **SUPABASE_JWT_SECRET está configurado** ← NUEVO
- [ ] El Edge Function está desplegado (deploy)
- [ ] El usuario tiene una sesión activa
- [ ] Los logs no muestran errores de variables de entorno

---

**Última actualización:** Febrero 2026  
**Para:** Club Natación Lo Prado
