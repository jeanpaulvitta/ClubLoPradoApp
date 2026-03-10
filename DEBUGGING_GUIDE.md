# 🔍 Guía de Debugging - Password Requests Error

## ❌ Error Actual

```
Error en createPasswordRequest: Error: Error al crear solicitud
❌ Error al enviar solicitud: Error: Error al crear solicitud
```

Este error genérico indica que la llamada a la API está fallando, pero no muestra detalles específicos.

---

## ✅ Mejoras Implementadas

### 1. **Mejor logging en el servicio frontend**

Archivo: `/src/app/services/passwordRequests.ts`

Ahora muestra:
- 📡 Status del servidor
- 📋 Datos recibidos
- ❌ Errores específicos del servidor
- 🔍 Detalles completos del error

### 2. **Mejor logging en el backend**

Archivo: `/supabase/functions/server/index.tsx`

Ahora la ruta POST `/password-requests` muestra:
- 📝 Inicio del proceso
- 📋 Datos recibidos
- ✅ Validaciones pasadas
- 📦 Solicitudes existentes
- 💾 Guardando en KV
- ✅ Éxito o ❌ Error detallado

### 3. **Nuevo endpoint de debug**

`GET /debug/password-requests-status` muestra el estado de las rutas

---

## 🧪 Pasos para Debuggear

### Paso 1: Verificar que el Backend esté Desplegado

1. Abre la consola del navegador (F12)
2. Ejecuta:

```javascript
const health = await fetch('https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health');
const data = await health.json();
console.log('Health:', data);
```

**Esperado:** 
```json
{
  "status": "ok" (o "misconfigured"),
  "configured": true,
  "valid": true
}
```

**Si falla:** La Edge Function no está desplegada. Ve al Paso 6.

---

### Paso 2: Verificar el Debug Endpoint

```javascript
const debug = await fetch('https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/debug/password-requests-status');
const data = await debug.json();
console.log('Routes Status:', data);
```

**Esperado:**
```json
{
  "message": "Password requests routes are registered",
  "routes": { ... },
  "serverConfigured": true,
  "supabaseReady": true
}
```

**Si falla:** Las rutas no están registradas. Ve al Paso 6.

---

### Paso 3: Probar la Creación de Solicitud Directamente

```javascript
const testData = {
  name: "Test Debug",
  email: "testdebug@ejemplo.com",
  role: "swimmer"
};

console.log('Enviando:', testData);

const response = await fetch('https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/password-requests/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
});

console.log('Status:', response.status);

const result = await response.json();
console.log('Resultado:', result);
```

**Posibles resultados:**

#### ✅ Success (Status 201)
```json
{
  "success": true,
  "request": {
    "id": "pr_...",
    "name": "Test Debug",
    "email": "testdebug@ejemplo.com",
    "role": "swimmer",
    "status": "pending"
  }
}
```
**Acción:** ¡Funcionó! El problema está en el componente frontend.

#### ❌ Error 400 - Campos faltantes
```json
{
  "error": "Nombre, email y rol son requeridos"
}
```
**Acción:** Los datos no llegan correctamente. Verificar serialización.

#### ❌ Error 400 - Email inválido
```json
{
  "error": "Email inválido"
}
```
**Acción:** Verificar formato del email.

#### ❌ Error 400 - Ya existe solicitud
```json
{
  "error": "Ya existe una solicitud pendiente para este correo electrónico"
}
```
**Acción:** Usa otro email o elimina la solicitud existente.

#### ❌ Error 500 - Error del servidor
```json
{
  "error": "Error message...",
  "details": "..."
}
```
**Acción:** Revisar logs en Supabase Dashboard (Paso 4).

#### ❌ Failed to fetch / CORS error
**Acción:** Problema de red o CORS. Verificar Edge Function desplegada.

---

### Paso 4: Revisar Logs del Servidor

1. Ve a **Supabase Dashboard**
2. **Edge Functions** → `make-server-4909a0bc`
3. Tab **"Logs"**
4. Busca logs de la última solicitud:
   - `📝 POST /password-requests - Iniciando`
   - `📋 Datos recibidos:`
   - `✅ Solicitud guardada` o `❌ Error`

**Si no ves logs:**
- La ruta no se está ejecutando
- La Edge Function no está desplegada
- Ve al Paso 6

**Si ves errores en los logs:**
- Anota el mensaje de error específico
- Probablemente sea un problema con el KV store o Supabase client

---

### Paso 5: Verificar que los Datos Llegan desde el Frontend

Abre `/src/app/components/LoginPage.tsx` y verifica la consola cuando intentas solicitar acceso.

Deberías ver:
```
📝 Enviando solicitud de acceso...
📝 Creando solicitud de acceso: {name: "...", email: "...", role: "..."}
📡 Respuesta del servidor: 201 Created
✅ Datos recibidos: {...}
✅ Solicitud creada exitosamente: pr_...
```

**Si NO ves estos logs:**
- El código del servicio no se está ejecutando
- Hay un error antes de llegar al fetch

**Si ves el error en este punto:**
- El problema está en la comunicación frontend-backend
- Continúa al Paso 6

---

### Paso 6: Redesplegar la Edge Function

Si los pasos anteriores fallan, probablemente necesites redesplegar:

#### Opción A: Desde Figma Make
1. Guarda los cambios actuales
2. Figma Make hará push automático a GitHub
3. Verifica que GitHub muestre los cambios
4. Supabase debería redesplegar automáticamente

#### Opción B: Manualmente desde Supabase Dashboard
1. Ve a **Supabase Dashboard**
2. **Edge Functions** → `make-server-4909a0bc`
3. Tab **"Details"**
4. Click **"Deploy"** o **"Redeploy"**
5. Espera a que el status sea "Active"

#### Opción C: Verificar que el código esté en GitHub
1. Ve a tu repositorio en GitHub
2. Navega a `/supabase/functions/server/index.tsx`
3. Busca la línea `app.post("/make-server-4909a0bc/password-requests"` cerca de línea 975
4. Si NO está → Haz push de nuevo
5. Si SÍ está → Redesplegar desde Supabase Dashboard

---

### Paso 7: Verificar Variables de Entorno

1. **Supabase Dashboard** → **Edge Functions** → `make-server-4909a0bc`
2. Tab **"Settings"** → **"Environment Variables"**
3. Verifica que existan:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

**NOTA:** Tu servidor tiene un workaround hardcodeado, así que funcionará incluso si estas variables están corruptas.

---

## 🎯 Diagnóstico Rápido

Ejecuta este script completo en la consola:

```javascript
async function diagnose() {
  console.log('🔍 DIAGNÓSTICO COMPLETO');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Test 1: Health Check
  try {
    const health = await fetch('https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health');
    if (health.ok) {
      const data = await health.json();
      console.log('✅ Health Check: OK');
      console.log('   Status:', data.status);
      console.log('   Configured:', data.configured);
    } else {
      console.error('❌ Health Check FAILED:', health.status);
    }
  } catch (e) {
    console.error('❌ Health Check ERROR:', e.message);
  }
  
  console.log('');
  
  // Test 2: Debug Endpoint
  try {
    const debug = await fetch('https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/debug/password-requests-status');
    if (debug.ok) {
      const data = await debug.json();
      console.log('✅ Debug Endpoint: OK');
      console.log('   Routes registered:', Object.keys(data.routes).length);
      console.log('   Server ready:', data.supabaseReady);
    } else {
      console.error('❌ Debug Endpoint FAILED:', debug.status);
    }
  } catch (e) {
    console.error('❌ Debug Endpoint ERROR:', e.message);
  }
  
  console.log('');
  
  // Test 3: Create Request
  try {
    const testData = {
      name: `Test ${Date.now()}`,
      email: `test${Date.now()}@ejemplo.com`,
      role: "swimmer"
    };
    
    console.log('📤 Probando crear solicitud...');
    console.log('   Datos:', testData);
    
    const response = await fetch('https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/password-requests/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    console.log('   Status:', response.status);
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Crear Solicitud: OK');
      console.log('   Request ID:', result.request?.id);
    } else {
      console.error('❌ Crear Solicitud FAILED');
      console.error('   Error:', result.error);
    }
  } catch (e) {
    console.error('❌ Crear Solicitud ERROR:', e.message);
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🏁 Diagnóstico completo');
}

diagnose();
```

---

## 📊 Interpretación de Resultados

### ✅ Todo OK
```
✅ Health Check: OK
✅ Debug Endpoint: OK
✅ Crear Solicitud: OK
```
**Conclusión:** El backend funciona. El problema está en el frontend (LoginPage o servicio).

### ❌ Health Check falla
```
❌ Health Check FAILED: 404
```
**Conclusión:** Edge Function no está desplegada. Redesplegar (Paso 6).

### ❌ Debug Endpoint falla
```
❌ Debug Endpoint FAILED: 404
```
**Conclusión:** Código nuevo no está desplegado. Redesplegar (Paso 6).

### ❌ Crear Solicitud falla con Error 500
```
❌ Crear Solicitud FAILED
   Error: Error message...
```
**Conclusión:** Error en el backend. Revisar logs en Supabase (Paso 4).

### ❌ Network Error / CORS
```
❌ Health Check ERROR: Failed to fetch
```
**Conclusión:** Problema de red o Edge Function inactiva.

---

## 🚀 Próximos Pasos

Ejecuta el diagnóstico completo y comparte los resultados. Con eso podré identificar exactamente dónde está el problema.

1. **Abre la consola** (F12)
2. **Copia y pega el script de diagnóstico**
3. **Ejecuta** (Enter)
4. **Comparte** los resultados

¡Con eso podremos arreglar el error! 🎯
