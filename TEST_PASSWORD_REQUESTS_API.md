# 🧪 Test de API de Password Requests

## Pruebas para Debuggear el Error

### 1. Verificar que el servidor esté funcionando

Abre la consola del navegador y ejecuta:

```javascript
// Test 1: Health Check
const health = await fetch('https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health');
const healthData = await health.json();
console.log('Health Check:', healthData);
// Esperado: { status: "ok", timestamp: "...", env: {...} }
```

### 2. Verificar CORS

```javascript
// Test 2: OPTIONS request (CORS preflight)
const options = await fetch('https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/password-requests/create', {
  method: 'OPTIONS'
});
console.log('CORS Status:', options.status);
console.log('CORS Headers:', Object.fromEntries(options.headers.entries()));
// Esperado: status 200, headers con Access-Control-Allow-Origin
```

### 3. Crear Solicitud (Versión Detallada)

```javascript
// Test 3: POST password-request con logs detallados
const testRequest = {
  name: "Test Usuario Debug",
  email: "testdebug@ejemplo.com",
  role: "swimmer"
};

console.log('📤 Enviando solicitud:', testRequest);

const response = await fetch('https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/password-requests/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testRequest)
});

console.log('📡 Status:', response.status, response.statusText);
console.log('📡 Headers:', Object.fromEntries(response.headers.entries()));

const responseText = await response.text();
console.log('📡 Response (raw):', responseText);

try {
  const responseJson = JSON.parse(responseText);
  console.log('📡 Response (JSON):', responseJson);
} catch (e) {
  console.error('❌ No es JSON válido');
}
```

### 4. Verificar Logs en Supabase

1. Ve a Supabase Dashboard
2. Edge Functions → `make-server-4909a0bc`
3. Tab "Logs"
4. Busca los logs que empiezan con:
   - `📝 POST /password-requests - Iniciando`
   - `📋 Datos recibidos:`
   - `✅ Solicitud guardada exitosamente:`
   - O cualquier error `❌`

### 5. Test Completo con Error Handling

```javascript
async function testPasswordRequest() {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🧪 TEST: Crear solicitud de contraseña');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const testData = {
      name: "Test User " + Date.now(),
      email: `test${Date.now()}@ejemplo.com`,
      role: "swimmer"
    };
    
    console.log('1️⃣ Datos a enviar:', testData);
    
    const url = 'https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/password-requests/create';
    console.log('2️⃣ URL:', url);
    
    console.log('3️⃣ Enviando request...');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('4️⃣ Status recibido:', response.status);
    console.log('5️⃣ Status text:', response.statusText);
    console.log('6️⃣ OK?:', response.ok);
    
    const responseText = await response.text();
    console.log('7️⃣ Response (texto):', responseText);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('8️⃣ Response (objeto):', responseData);
    } catch (e) {
      console.error('❌ Error parseando JSON:', e);
      console.error('   Respuesta no es JSON válido');
      return;
    }
    
    if (response.ok) {
      console.log('✅ SUCCESS!');
      console.log('   Request ID:', responseData.request?.id);
      console.log('   Email:', responseData.request?.email);
      console.log('   Status:', responseData.request?.status);
    } else {
      console.error('❌ FAILED!');
      console.error('   Error:', responseData.error);
      console.error('   Details:', responseData.details);
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
  } catch (error) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('💥 EXCEPTION THROWN!');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}

// Ejecutar test
testPasswordRequest();
```

## Casos de Error Comunes

### Error: "Failed to fetch"
**Causa:** CORS bloqueado o servidor caído
**Solución:** Verificar que la Edge Function esté desplegada y activa

### Error: HTTP 401
**Causa:** Endpoint requiere autenticación pero no debería
**Solución:** Verificar que la ruta POST /password-requests NO use `authMiddleware`

### Error: HTTP 400 "Campos faltantes"
**Causa:** Los datos no llegan correctamente al backend
**Solución:** Verificar que el body se esté serializando correctamente

### Error: HTTP 500
**Causa:** Error en el servidor
**Solución:** Revisar logs en Supabase Dashboard para ver el stack trace

### Error: "Not Found" o HTTP 404
**Causa:** La ruta no existe o no está desplegada
**Solución:** Redesplegar la Edge Function

## Checklist de Debugging

- [ ] La Edge Function está desplegada y "Active"
- [ ] El health check responde correctamente
- [ ] CORS permite POST desde el origen
- [ ] La ruta POST /password-requests existe en el código
- [ ] La ruta NO usa authMiddleware (es pública)
- [ ] Los logs del servidor muestran actividad
- [ ] El KV store está accesible
- [ ] No hay errores de sintaxis en el backend

## Próximos Pasos según el Error

### Si el test funciona en consola pero no en la app:
- Problema en el servicio frontend
- Revisar `/src/app/services/passwordRequests.ts`
- Revisar el `LoginPage.tsx`

### Si el test falla con CORS:
- Redesplegar Edge Function
- Verificar middleware de CORS en el servidor

### Si el test falla con 500:
- Revisar logs en Supabase
- Problema en el código del servidor
- Puede ser un error en el KV store

### Si el test devuelve 404:
- La ruta no existe
- Redesplegar Edge Function
- Verificar que la ruta esté registrada antes de `Deno.serve()`

---

Ejecuta estos tests y comparte los resultados para poder ayudarte mejor! 🔍
