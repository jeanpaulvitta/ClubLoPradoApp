# 🧪 Test Rápido - Verificar Fix del Error 401

## Ejecuta Este Test en la Consola del Navegador

Copia y pega este código completo en la consola (F12 → Console):

```javascript
async function quickTest() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🧪 QUICK TEST - Password Requests Fix');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  
  const baseUrl = 'https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc';
  
  // Test 1: Health Check
  console.log('1️⃣ Testing Health Check...');
  try {
    const health = await fetch(`${baseUrl}/health`);
    const healthData = await health.json();
    if (health.ok && healthData.status) {
      console.log('   ✅ Health Check OK - Server running');
    } else {
      console.log('   ⚠️ Health Check:', healthData);
    }
  } catch (e) {
    console.error('   ❌ Health Check FAILED:', e.message);
    return;
  }
  
  console.log('');
  
  // Test 2: Debug Routes
  console.log('2️⃣ Testing Debug Routes...');
  try {
    const debug = await fetch(`${baseUrl}/debug/password-requests-status`);
    const debugData = await debug.json();
    console.log('   Routes:', Object.keys(debugData.routes));
    if (debugData.routes['POST /password-requests/create']) {
      console.log('   ✅ Nueva ruta /create encontrada');
    } else {
      console.warn('   ⚠️ Ruta /create NO encontrada - puede necesitar redesplegar');
    }
  } catch (e) {
    console.error('   ❌ Debug FAILED:', e.message);
  }
  
  console.log('');
  
  // Test 3: Create Password Request (OLD ROUTE - should fail with 401)
  console.log('3️⃣ Testing OLD route (should fail with 401)...');
  try {
    const oldTest = await fetch(`${baseUrl}/password-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `Test OLD ${Date.now()}`,
        email: `testold${Date.now()}@ejemplo.com`,
        role: 'swimmer'
      })
    });
    const oldResult = await oldTest.json();
    if (oldTest.status === 401) {
      console.log('   ⚠️ OLD route returns 401 (expected - needs auth)');
    } else if (oldTest.ok) {
      console.log('   ✅ OLD route works (unexpected but OK)');
    } else {
      console.log('   ❓ OLD route status:', oldTest.status, oldResult);
    }
  } catch (e) {
    console.log('   ❌ OLD route error:', e.message);
  }
  
  console.log('');
  
  // Test 4: Create Password Request (NEW ROUTE - should work!)
  console.log('4️⃣ Testing NEW route /create (should work)...');
  try {
    const testData = {
      name: `Test NEW ${Date.now()}`,
      email: `testnew${Date.now()}@ejemplo.com`,
      role: 'swimmer'
    };
    
    console.log('   Sending:', testData);
    
    const newTest = await fetch(`${baseUrl}/password-requests/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    console.log('   Status:', newTest.status);
    
    const newResult = await newTest.json();
    
    if (newTest.ok && newResult.success) {
      console.log('   ✅✅✅ NEW ROUTE WORKS! ✅✅✅');
      console.log('   Request ID:', newResult.request.id);
      console.log('   Email:', newResult.request.email);
      console.log('   Status:', newResult.request.status);
    } else {
      console.error('   ❌ NEW ROUTE FAILED');
      console.error('   Status:', newTest.status);
      console.error('   Error:', newResult);
    }
  } catch (e) {
    console.error('   ❌ NEW route error:', e.message);
  }
  
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🏁 Test Complete');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// Run the test
quickTest();
```

## 📊 Interpretación de Resultados

### ✅ Todo Funciona
```
✅ Health Check OK - Server running
✅ Nueva ruta /create encontrada
⚠️ OLD route returns 401 (expected - needs auth)
✅✅✅ NEW ROUTE WORKS! ✅✅✅
   Request ID: pr_...
```
**Acción:** ¡Perfecto! El fix funciona. Prueba en la app.

### ⚠️ Ruta No Encontrada
```
✅ Health Check OK - Server running
⚠️ Ruta /create NO encontrada - puede necesitar redesplegar
```
**Acción:** El código no está desplegado. Espera 1-2 minutos y vuelve a probar, o redesplega manualmente.

### ❌ Server No Responde
```
❌ Health Check FAILED: Failed to fetch
```
**Acción:** La Edge Function no está activa. Ve a Supabase Dashboard y verifica el estado.

### ❌ NEW Route Falla con 401
```
❌ NEW ROUTE FAILED
   Status: 401
```
**Acción:** El código sigue sin estar desplegado o hay un cache. Redesplegar.

---

## 🚀 Si el Test Pasa

1. **Abre tu app**
2. **Intenta solicitar acceso** desde la página de login
3. **Verifica que funcione** sin error 401
4. **Comprueba en la consola** que veas logs de éxito

## 🔄 Si el Test Falla

1. **Espera 2 minutos** (tiempo de deploy)
2. **Vuelve a ejecutar el test**
3. Si sigue fallando:
   - Ve a Supabase Dashboard
   - Edge Functions → `make-server-4909a0bc`
   - Click "Deploy" o "Redeploy"
   - Espera a que status sea "Active"
   - Ejecuta el test de nuevo

---

**¡Ejecuta el test y comparte los resultados!** 🎯
