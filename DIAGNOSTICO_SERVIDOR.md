# 🔧 Diagnóstico: "Servidor sin configurar"

## ❓ ¿Por qué aparece este mensaje?

El mensaje "**Servidor sin configurar**" aparece cuando el Edge Function `make-server-4909a0bc` en Supabase **NO tiene las 3 variables de entorno requeridas**.

El sistema hace un health check que verifica:
```javascript
✅ SUPABASE_URL          → Debe estar configurada
✅ SUPABASE_ANON_KEY     → Debe estar configurada  
✅ SUPABASE_SERVICE_ROLE_KEY → Debe estar configurada
```

Si **falta alguna**, el health check devuelve `status: "misconfigured"` y aparece el mensaje.

---

## 🔍 Paso 1: Verificar el Estado Actual

### Opción A: Desde la Consola del Navegador

1. Abre la pestaña **Usuarios** en tu aplicación
2. Abre la **Consola del Navegador** (F12 → Console)
3. Busca el log que dice:
   ```
   🔍 Health Check - Environment Status:
   ```
4. Verás algo como:
   ```javascript
   {
     SUPABASE_URL_length: 0,              // ❌ 0 = NO configurada
     SUPABASE_URL_preview: 'NOT SET',     // ❌ Falta!
     SUPABASE_SERVICE_ROLE_KEY_length: 0, // ❌ 0 = NO configurada
     SUPABASE_ANON_KEY_length: 0,         // ❌ 0 = NO configurada
     allConfigured: false                 // ❌ Resultado: NO OK
   }
   ```

5. Si todos tienen **0** o **'NOT SET'**, significa que **NINGUNA** variable está configurada

### Opción B: Verificar directamente el Endpoint

1. Abre una nueva pestaña del navegador
2. Ve a esta URL (reemplaza `vrclozhgaacehojbnpuo` con tu project ID):
   ```
   https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health
   ```
3. Verás una respuesta JSON:
   ```json
   {
     "status": "misconfigured",  // ❌ Problema!
     "message": "⚠️ Missing environment variables...",
     "environment": {
       "SUPABASE_URL": false,
       "SUPABASE_SERVICE_ROLE_KEY": false,
       "SUPABASE_ANON_KEY": false
     }
   }
   ```

---

## ✅ Paso 2: Configurar las Variables de Entorno

### 🎯 Ubicación: Supabase Dashboard

1. **Ve a Supabase Dashboard**:
   ```
   https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo
   ```
   _(Reemplaza `vrclozhgaacehojbnpuo` con tu Project ID)_

2. **Navega a Edge Functions**:
   ```
   Dashboard → Edge Functions (menú izquierdo)
   ```

3. **Selecciona la función**:
   - Busca y haz click en: `make-server-4909a0bc`

4. **Ve a Settings/Secrets**:
   - Click en la pestaña **"Settings"** o **"Secrets"** 
   - O click en el ícono de ⚙️ (configuración)

### 📝 Variables a Configurar

Debes agregar **exactamente estas 3 variables** (respetando mayúsculas):

#### 1️⃣ SUPABASE_URL
```
Nombre: SUPABASE_URL
Valor: https://vrclozhgaacehojbnpuo.supabase.co
```
**¿Dónde encontrar este valor?**
- Dashboard → Settings → API → Project URL

#### 2️⃣ SUPABASE_ANON_KEY
```
Nombre: SUPABASE_ANON_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**¿Dónde encontrar este valor?**
- Dashboard → Settings → API → Project API keys → `anon` `public`

#### 3️⃣ SUPABASE_SERVICE_ROLE_KEY
```
Nombre: SUPABASE_SERVICE_ROLE_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**¿Dónde encontrar este valor?**
- Dashboard → Settings → API → Project API keys → `service_role` `secret`
- ⚠️ **MUY IMPORTANTE**: Esta es una clave SECRETA, nunca la compartas

---

## 🖼️ Guía Visual Paso a Paso

### Paso A: Ir a Settings → API
```
Supabase Dashboard
  ↓
Settings (menú izquierdo)
  ↓
API
  ↓
Copiar los 3 valores
```

### Paso B: Ir a Edge Functions
```
Supabase Dashboard
  ↓
Edge Functions (menú izquierdo)
  ↓
Click en "make-server-4909a0bc"
  ↓
Click en "Settings" o "Secrets"
  ↓
Agregar las 3 variables
```

### Paso C: Agregar cada variable
```
1. Click en "+ New secret" o "Add secret"
2. Nombre: SUPABASE_URL
3. Valor: [pegar el valor copiado]
4. Click en "Save" o "Add"
5. Repetir para las otras 2 variables
```

---

## 🔄 Paso 3: Reiniciar la Edge Function

**MUY IMPORTANTE**: Después de agregar las variables, debes **reiniciar** la función:

### Opción 1: Redeploy desde Dashboard
```
Edge Functions → make-server-4909a0bc → "Redeploy" o "Deploy"
```

### Opción 2: Desde la terminal (si tienes acceso)
```bash
supabase functions deploy make-server-4909a0bc
```

### Opción 3: Esperar
- A veces Supabase reinicia automáticamente
- Espera 1-2 minutos

---

## ✅ Paso 4: Verificar que Funcione

### Desde la Aplicación:
1. Ve a la pestaña **Usuarios**
2. Deberías ver el card azul que dice:
   ```
   ✅ Servidor Configurado
   El servidor está funcionando correctamente
   ```
3. El botón **"Aprobar"** ya NO debería estar deshabilitado

### Desde la Consola:
1. Abre la consola del navegador (F12)
2. Click en el botón **"Verificar de Nuevo"**
3. Busca en la consola:
   ```
   🔍 Health Check - Environment Status:
   {
     SUPABASE_URL_length: 42,              // ✅ Tiene longitud!
     SUPABASE_URL_preview: 'https://vrcl...', // ✅ Configurada!
     SUPABASE_SERVICE_ROLE_KEY_length: 243,   // ✅ Configurada!
     SUPABASE_ANON_KEY_length: 243,          // ✅ Configurada!
     allConfigured: true                     // ✅ OK!
   }
   ```

### Desde el Endpoint:
1. Ve a: `https://TU_PROJECT_ID.supabase.co/functions/v1/make-server-4909a0bc/health`
2. Deberías ver:
   ```json
   {
     "status": "ok",  // ✅ Funcionando!
     "message": "✅ All environment variables configured correctly",
     "environment": {
       "SUPABASE_URL": true,
       "SUPABASE_SERVICE_ROLE_KEY": true,
       "SUPABASE_ANON_KEY": true
     }
   }
   ```

---

## ⚠️ Problemas Comunes

### ❌ Problema 1: "Las variables están configuradas pero sigue sin funcionar"

**Solución:**
- Asegúrate de haber **reiniciado** la Edge Function
- Espera 1-2 minutos después del reinicio
- Limpia la caché del navegador (Ctrl + Shift + R)
- Click en "Verificar de Nuevo"

### ❌ Problema 2: "No encuentro dónde agregar variables"

**Solución:**
- Supabase cambió la UI recientemente
- Busca en:
  1. Edge Functions → make-server-4909a0bc → **Settings**
  2. Edge Functions → make-server-4909a0bc → **Secrets**
  3. Edge Functions → make-server-4909a0bc → ⚙️ (ícono de configuración)

### ❌ Problema 3: "Dice 'Invalid JWT' al aprobar"

**Solución:**
- Esto significa que las variables están configuradas pero con valores incorrectos
- Verifica que copiaste los valores COMPLETOS (no cortados)
- Verifica que no haya espacios al inicio o final
- Copia de nuevo desde Settings → API

### ❌ Problema 4: "No puedo encontrar SUPABASE_SERVICE_ROLE_KEY"

**Solución:**
- En Settings → API → Project API keys
- Busca la clave que dice: **`service_role`** con tag **`secret`**
- Click en "Reveal" o el ícono de 👁️ para verla
- ⚠️ Esta clave es SECRETA, no la compartas

---

## 📋 Checklist Final

Antes de aprobar solicitudes, verifica:

- [ ] Las 3 variables están agregadas en Edge Functions → Secrets
- [ ] Los nombres son EXACTOS (respetan mayúsculas)
- [ ] Los valores están completos (no cortados)
- [ ] Reiniciaste la Edge Function después de agregar las variables
- [ ] El endpoint `/health` devuelve `"status": "ok"`
- [ ] En la app aparece "✅ Servidor Configurado"
- [ ] El botón "Aprobar" ya NO está deshabilitado

---

## 🎯 Resumen Rápido

```
PROBLEMA: "Servidor sin configurar"
   ↓
CAUSA: Faltan variables de entorno en Edge Function
   ↓
SOLUCIÓN:
   1. Ir a Supabase Dashboard
   2. Settings → API → Copiar los 3 valores
   3. Edge Functions → make-server-4909a0bc → Secrets
   4. Agregar SUPABASE_URL
   5. Agregar SUPABASE_ANON_KEY
   6. Agregar SUPABASE_SERVICE_ROLE_KEY
   7. Reiniciar la función (Redeploy)
   8. Verificar en la app
   ↓
RESULTADO: ✅ Servidor Configurado
```

---

## 🆘 ¿Aún no funciona?

Si después de seguir todos los pasos aún no funciona:

1. **Copia el mensaje de error completo** de la consola del navegador
2. **Verifica los logs** del Edge Function en Supabase Dashboard
3. **Comparte la respuesta** del endpoint `/health` (sin incluir claves secretas)

---

**Última actualización:** 8 de marzo de 2026  
**Sistema:** Club Natación Lo Prado - Gestión de Usuarios
