# 🔧 Solución: Missing authorization header (401)

> **Fecha:** 8 de Marzo de 2026  
> **Error:** `❌ Servidor NO configurado correctamente: { "code": 401, "message": "Missing authorization header" }`  
> **Causa:** El servidor Edge Function en Supabase no está configurado o no está desplegado

---

## 🎯 Diagnóstico del Problema

El error **"Missing authorization header"** indica que:

1. ✅ El frontend está funcionando correctamente
2. ✅ El código del servidor está correcto
3. ❌ **El servidor NO está desplegado en Supabase**, O
4. ❌ **Las variables de entorno NO están configuradas**

---

## 🚀 SOLUCIÓN PASO A PASO (Flujo Online)

### ✅ PASO 1: Verificar que el servidor esté desplegado en Supabase

#### 1.1 Acceder al Dashboard de Supabase
1. Ve a: https://supabase.com/dashboard
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto: **vrclozhgaacehojbnpuo**

#### 1.2 Verificar Edge Functions
1. En el menú lateral izquierdo, haz clic en **"Edge Functions"**
2. Deberías ver una función llamada **"server"** (o **"make-server-4909a0bc"**)
3. **Si NO ves ninguna función:**
   - ❌ El servidor NO está desplegado
   - 👉 Continúa con el **PASO 2** para desplegarlo

#### 1.3 Verificar estado del despliegue
Si ves la función "server":
1. Haz clic en el nombre de la función
2. Ve a la pestaña **"Deployments"**
3. Verifica que haya al menos un despliegue **"Active"** (verde)
4. **Si NO hay despliegues activos:**
   - 👉 Necesitas redesplegar (ve al PASO 2)

---

### ✅ PASO 2: Desplegar el servidor en Supabase (Usando GitHub Actions)

Como tu flujo es completamente online (Figma Make → GitHub → Supabase → Vercel), debes usar **GitHub Actions** para desplegar.

#### 2.1 Verificar que el código esté en GitHub
1. Ve a tu repositorio de GitHub
2. Verifica que exista la carpeta `/supabase/functions/server/`
3. Verifica que existan estos archivos:
   - `/supabase/functions/server/index.tsx`
   - `/supabase/functions/server/kv_store.tsx`
   - `/workflows/deploy-supabase.yml` (en la raíz)

#### 2.2 Configurar GitHub Actions (si no está configurado)

**Opción A: Si ya tienes GitHub Actions configurado**
1. Ve a tu repositorio en GitHub
2. Haz clic en la pestaña **"Actions"**
3. Busca el workflow **"Deploy to Supabase"**
4. Haz clic en **"Run workflow"** → **"Run workflow"**
5. Espera 2-3 minutos a que termine el despliegue
6. ✅ El servidor debería estar desplegado

**Opción B: Si NO tienes GitHub Actions configurado**
1. Ve a tu repositorio en GitHub
2. Haz clic en **"Settings"** → **"Secrets and variables"** → **"Actions"**
3. Agrega estos secretos:
   - `SUPABASE_ACCESS_TOKEN`: Tu token de acceso de Supabase
   - `SUPABASE_DB_PASSWORD`: Contraseña de la base de datos
   - `SUPABASE_PROJECT_ID`: vrclozhgaacehojbnpuo

Para obtener el **SUPABASE_ACCESS_TOKEN**:
1. Ve a: https://supabase.com/dashboard/account/tokens
2. Haz clic en **"Generate new token"**
3. Dale un nombre (ej: "GitHub Actions")
4. Copia el token
5. Pégalo en GitHub Secrets

#### 2.3 Despliegue Manual (Alternativa con Supabase CLI online)

Si GitHub Actions no funciona, puedes usar la **Supabase CLI Web**:

1. Ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions
2. Haz clic en el botón **"Deploy a new function"**
3. Selecciona **"From GitHub"** o **"Upload files"**
4. Si seleccionas "Upload files":
   - Descarga los archivos de `/supabase/functions/server/` desde tu repo
   - Sube `index.tsx` y `kv_store.tsx`
   - Nombra la función: **"server"**
5. Haz clic en **"Deploy"**
6. Espera 1-2 minutos

---

### ✅ PASO 3: Configurar Variables de Entorno en Edge Functions

**CRÍTICO:** Aunque el servidor esté desplegado, DEBE tener las variables de entorno configuradas.

#### 3.1 Acceder a la configuración de la función
1. Dashboard de Supabase → **Edge Functions**
2. Haz clic en la función **"server"**
3. Ve a la pestaña **"Settings"** o **"Secrets"**

#### 3.2 Agregar las 3 variables de entorno requeridas

Necesitas configurar exactamente estas 3 variables:

```
SUPABASE_URL=https://vrclozhgaacehojbnpuo.supabase.co
SUPABASE_ANON_KEY=[tu-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[tu-service-role-key]
```

**¿Dónde obtener los valores?**

1. **SUPABASE_URL:**
   - Dashboard → Settings → API
   - Copia el valor de **"Project URL"**
   - Debe ser: `https://vrclozhgaacehojbnpuo.supabase.co`

2. **SUPABASE_ANON_KEY:**
   - Dashboard → Settings → API
   - Busca **"Project API keys"**
   - Copia el valor de **"anon" / "public"**
   - Ejemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **SUPABASE_SERVICE_ROLE_KEY:**
   - Dashboard → Settings → API
   - Busca **"Project API keys"**
   - Copia el valor de **"service_role"**
   - ⚠️ **IMPORTANTE:** Esta key es secreta, NUNCA la compartas
   - Ejemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### 3.3 Configurar las variables en Supabase

**Método 1: Desde el Dashboard (Recomendado)**
1. Ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions
2. Haz clic en la función **"server"**
3. Haz clic en **"Settings"** (o el ícono de engranaje ⚙️)
4. Busca la sección **"Secrets"** o **"Environment Variables"**
5. Agrega cada variable:
   - Click en **"Add secret"** o **"+ New secret"**
   - Name: `SUPABASE_URL`
   - Value: `https://vrclozhgaacehojbnpuo.supabase.co`
   - Click **"Save"**
6. Repite para `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY`

**Método 2: Usando Supabase CLI (si tienes acceso a una terminal)**
```bash
supabase secrets set SUPABASE_URL=https://vrclozhgaacehojbnpuo.supabase.co --project-ref vrclozhgaacehojbnpuo
supabase secrets set SUPABASE_ANON_KEY=tu-anon-key --project-ref vrclozhgaacehojbnpuo
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key --project-ref vrclozhgaacehojbnpuo
```

#### 3.4 Verificar que las variables estén configuradas
1. En la página de la función en Supabase
2. Ve a **"Settings"** → **"Secrets"**
3. Deberías ver las 3 variables listadas:
   - ✅ SUPABASE_URL
   - ✅ SUPABASE_ANON_KEY
   - ✅ SUPABASE_SERVICE_ROLE_KEY

---

### ✅ PASO 4: Redesplegar la función (después de configurar variables)

**IMPORTANTE:** Después de agregar las variables de entorno, debes redesplegar la función.

#### 4.1 Redespliegue automático
1. En Dashboard → Edge Functions → server
2. Haz clic en el botón **"Deploy"** o **"Redeploy"**
3. Espera 1-2 minutos

#### 4.2 Redespliegue con GitHub Actions
1. Ve a tu repositorio en GitHub
2. Pestaña **"Actions"**
3. Click en **"Run workflow"**
4. Espera a que termine (2-3 minutos)

---

### ✅ PASO 5: Verificar que el servidor funcione

#### 5.1 Probar el endpoint de health
1. Abre una nueva pestaña del navegador
2. Ve a: https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health
3. **Si funciona correctamente, deberías ver:**
   ```json
   {
     "status": "ok",
     "message": "Server is running",
     "timestamp": "2026-03-08T..."
   }
   ```
4. **Si ves un error 401 o "Missing authorization header":**
   - ❌ Las variables de entorno NO están configuradas
   - 👉 Regresa al PASO 3

#### 5.2 Verificar desde la aplicación
1. Recarga tu aplicación (F5 o Ctrl+R)
2. Ve a la pestaña **"Usuarios"** (solo admin)
3. Busca el indicador de estado del servidor en la parte superior
4. Debería mostrar:
   - ✅ **"Servidor configurado correctamente"** (verde)

---

## 🔍 Verificación Final

### Checklist completo

- [ ] El servidor está desplegado en Supabase (visible en Edge Functions)
- [ ] Hay al menos un deployment "Active" (verde)
- [ ] Las 3 variables de entorno están configuradas:
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] La función fue redesplegada después de agregar las variables
- [ ] El endpoint /health responde correctamente
- [ ] La aplicación muestra "Servidor configurado correctamente"

---

## 🐛 Troubleshooting (Si aún no funciona)

### Error: "Missing authorization header" persiste

**Posibles causas:**

1. **Las variables de entorno no están configuradas correctamente**
   - Solución: Verifica que los nombres sean EXACTOS (case-sensitive)
   - Solución: Verifica que no haya espacios en blanco al inicio/final

2. **La función no fue redesplegada después de agregar las variables**
   - Solución: Fuerza un redespliegue manual en Supabase Dashboard

3. **El servidor está usando una función diferente**
   - Solución: Verifica que la URL sea exactamente: `https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health`

4. **Las API keys son incorrectas**
   - Solución: Regenera las keys en Dashboard → Settings → API → Reset

### Error: "Invalid JWT"

Este es un error diferente que indica que las keys del frontend NO coinciden con las del backend.

**Solución:**
1. Ve a `/utils/supabase/info.tsx`
2. Verifica que `projectId` sea: `vrclozhgaacehojbnpuo`
3. Verifica que `publicAnonKey` coincida con el ANON_KEY de Supabase
4. NO necesitas cambiar SERVICE_ROLE_KEY en el frontend (solo en el backend)

### Error: "Function not found" o 404

**Solución:**
1. El servidor NO está desplegado
2. Regresa al PASO 2
3. Asegúrate de que el nombre de la función sea exactamente **"server"** o **"make-server-4909a0bc"**

---

## 📊 Logs y Debugging

### Ver logs del servidor en tiempo real

1. Dashboard de Supabase → Edge Functions → server
2. Haz clic en **"Logs"** o **"Invocations"**
3. Deberías ver logs como:
   ```
   ✅ Bucket already exists: make-4909a0bc-competitions
   🔍 Auth middleware: Validating token...
   ✅ Auth middleware: User validated: admin@example.com
   ```

### Logs esperados al iniciar el servidor

Cuando el servidor se despliega correctamente, deberías ver:
```
📱 Club Natación Lo Prado - Edge Function Server
🔧 Versión: 2.0.4
✅ SUPABASE_URL configurada
✅ SUPABASE_SERVICE_ROLE_KEY configurada
✅ SUPABASE_ANON_KEY configurada
📦 Creating bucket: make-4909a0bc-competitions
✅ Bucket created successfully
🚀 Server is ready to accept requests
```

### Logs de error cuando faltan variables

Si las variables NO están configuradas, verás:
```
❌ CRITICAL ERROR: Missing required environment variables!
   Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY
   Configure them in: Supabase Dashboard → Edge Functions → server → Environment Variables
```

---

## 🎯 Resumen Ejecutivo

### Causa del problema
El error **"Missing authorization header"** ocurre porque:
1. El servidor Edge Function NO está desplegado en Supabase, O
2. Las variables de entorno NO están configuradas en la función

### Solución rápida (5 pasos)
1. ✅ Desplegar servidor en Supabase (vía GitHub Actions o Dashboard)
2. ✅ Configurar 3 variables de entorno (URL, ANON_KEY, SERVICE_ROLE_KEY)
3. ✅ Redesplegar la función
4. ✅ Verificar endpoint /health
5. ✅ Recargar la aplicación

### Tiempo estimado
- Con GitHub Actions: **5-10 minutos**
- Despliegue manual: **10-15 minutos**

---

## 📞 Siguiente Paso

Una vez que el servidor esté configurado correctamente:
1. ✅ El error **"Missing authorization header"** desaparecerá
2. ✅ Podrás aprobar solicitudes de acceso
3. ✅ El sistema de usuarios funcionará correctamente
4. ✅ Todos los endpoints del servidor estarán disponibles

Si sigues teniendo problemas después de completar todos los pasos:
- Revisa `/SOLUCION_INVALID_JWT.md` (error diferente)
- Contacta al equipo de soporte de Supabase
- Revisa los logs detallados en Supabase Dashboard

---

**Última actualización:** 8 de Marzo de 2026  
**Autor:** Club Natación Lo Prado  
**Versión:** 1.0
