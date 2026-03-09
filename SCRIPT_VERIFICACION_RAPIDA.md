# 🔍 Script de Verificación Rápida

> Copia y pega estos scripts en la consola del navegador (F12) para diagnosticar y resolver problemas rápidamente.

---

## 🎯 Script Todo-en-Uno

Copia y pega esto en la consola del navegador:

```javascript
// ===== SCRIPT DE VERIFICACIÓN Y SOLUCIÓN COMPLETO =====
console.log('🔍 Iniciando verificación completa del sistema...\n');

const projectId = 'vrclozhgaacehojbnpuo';
const serverUrls = [
  `https://${projectId}.supabase.co/functions/v1/server/health`,
  `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc/health`
];

// 1. Verificar modo offline
console.log('📋 1. Verificando modo offline...');
const offlineMode = localStorage.getItem('backend_offline_mode');
if (offlineMode) {
  console.log('⚠️  MODO OFFLINE ACTIVADO');
  console.log('   Valor:', offlineMode);
} else {
  console.log('✅ No hay modo offline activado');
}

// 2. Verificar health checks
console.log('\n📋 2. Verificando conectividad del servidor...\n');

async function checkServer(url) {
  console.log(`   Probando: ${url}`);
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(`   ✅ Respuesta (${response.status}):`, data);
    return { success: true, url, data, status: response.status };
  } catch (error) {
    console.log(`   ❌ Error:`, error.message);
    return { success: false, url, error: error.message };
  }
}

Promise.all(serverUrls.map(checkServer)).then(results => {
  const working = results.find(r => r.success && r.data.status === 'ok');
  
  console.log('\n📊 RESUMEN:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (working) {
    console.log('✅ SERVIDOR FUNCIONANDO');
    console.log('   URL:', working.url);
    console.log('   Estado:', working.data.status);
    console.log('   Configurado:', working.data.configured);
    
    if (offlineMode) {
      console.log('\n🔧 ACCIÓN NECESARIA:');
      console.log('   El servidor funciona pero estás en modo offline.');
      console.log('   Ejecuta este comando para salir:\n');
      console.log('   localStorage.removeItem("backend_offline_mode");');
      console.log('   location.reload();\n');
    } else {
      console.log('\n🎉 TODO ESTÁ BIEN');
      console.log('   El sistema está conectado y funcionando correctamente.');
    }
  } else {
    console.log('❌ SERVIDOR NO DISPONIBLE');
    console.log('\n🔧 POSIBLES CAUSAS:');
    console.log('   1. La Edge Function no está desplegada');
    console.log('   2. Hay un error en el código del servidor');
    console.log('   3. Las variables de entorno no están configuradas\n');
    console.log('📋 SIGUIENTE PASO:');
    console.log('   1. Ve a: https://supabase.com/dashboard/project/' + projectId + '/functions');
    console.log('   2. Verifica que exista la función "server" con estado "Active"');
    console.log('   3. Si no existe, revisa GitHub Actions');
    console.log('   4. Si existe pero falla, revisa los logs de Edge Functions\n');
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // 3. Información adicional
  console.log('📋 3. Información adicional:\n');
  console.log('   Project ID:', projectId);
  console.log('   URLs probadas:', serverUrls.length);
  console.log('   localStorage keys:', Object.keys(localStorage).length);
  console.log('   sessionStorage keys:', Object.keys(sessionStorage).length);
  
  // 4. Mostrar datos relevantes de localStorage
  console.log('\n📋 4. Datos en localStorage:\n');
  const relevantKeys = ['backend_offline_mode', 'authToken', 'userRole', 'userId'];
  relevantKeys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      console.log(`   ${key}:`, value.substring(0, 50) + (value.length > 50 ? '...' : ''));
    }
  });
});

console.log('\n⏳ Verificando servidor... (esto puede tardar unos segundos)\n');
```

---

## 🚀 Scripts Individuales

### 1. Verificar Modo Offline

```javascript
const offlineMode = localStorage.getItem('backend_offline_mode');
console.log(offlineMode ? '⚠️ MODO OFFLINE ACTIVADO' : '✅ Modo offline desactivado');
```

### 2. Salir del Modo Offline

```javascript
localStorage.removeItem('backend_offline_mode');
console.log('✅ Modo offline removido. Recargando página...');
setTimeout(() => location.reload(), 1000);
```

### 3. Verificar Health Check (Simple)

```javascript
fetch('https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/server/health')
  .then(r => r.json())
  .then(data => {
    console.log('✅ Servidor responde:', data);
    if (data.configured) {
      console.log('🎉 Sistema configurado correctamente');
    } else {
      console.log('⚠️ Sistema NO configurado - faltan variables de entorno');
    }
  })
  .catch(e => console.log('❌ Error:', e.message));
```

### 4. Verificar Todas las URLs

```javascript
const urls = [
  'https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/server/health',
  'https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health'
];

urls.forEach(async (url) => {
  try {
    const r = await fetch(url);
    const data = await r.json();
    console.log(`✅ ${url}\n   Status: ${r.status}\n   Data:`, data);
  } catch (e) {
    console.log(`❌ ${url}\n   Error: ${e.message}`);
  }
});
```

### 5. Limpiar Todo y Reiniciar

```javascript
console.log('🧹 Limpiando todo...');
localStorage.clear();
sessionStorage.clear();
console.log('✅ Todo limpiado. Recargando en 2 segundos...');
setTimeout(() => location.reload(), 2000);
```

### 6. Ver Información del Sistema

```javascript
console.log('📊 INFORMACIÓN DEL SISTEMA\n');
console.log('Project ID:', 'vrclozhgaacehojbnpuo');
console.log('Server URL:', 'https://vrclozhgaacehojbnpuo.supabase.co');
console.log('Modo offline:', localStorage.getItem('backend_offline_mode') || 'No activado');
console.log('Usuario actual:', localStorage.getItem('userId') || 'No autenticado');
console.log('Rol:', localStorage.getItem('userRole') || 'N/A');
console.log('Token existe:', !!localStorage.getItem('authToken'));
console.log('\nLocalStorage keys:', Object.keys(localStorage));
```

### 7. Forzar Logout

```javascript
console.log('🚪 Cerrando sesión...');
localStorage.removeItem('authToken');
localStorage.removeItem('userId');
localStorage.removeItem('userRole');
console.log('✅ Sesión cerrada. Recargando...');
setTimeout(() => location.reload(), 1000);
```

---

## 🎯 Flujo de Uso Recomendado

### Paso 1: Ejecutar Script Todo-en-Uno
```javascript
// Copia y pega el script completo de arriba
```

### Paso 2: Interpretar Resultados

#### Si ves "✅ SERVIDOR FUNCIONANDO"
```javascript
// Sal del modo offline
localStorage.removeItem('backend_offline_mode');
location.reload();
```

#### Si ves "❌ SERVIDOR NO DISPONIBLE"
1. Ve al dashboard de Supabase
2. Verifica que la función esté desplegada
3. Revisa los logs
4. Sigue la guía en `/COMO_CONECTAR_SERVIDOR_AHORA.md`

---

## 📋 Checklist de Verificación Rápida

Ejecuta estos comandos uno por uno y anota los resultados:

```javascript
// 1. ¿Modo offline?
console.log('1. Modo offline:', localStorage.getItem('backend_offline_mode'));

// 2. ¿Servidor responde?
fetch('https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/server/health')
  .then(r => r.json())
  .then(d => console.log('2. Servidor:', d))
  .catch(e => console.log('2. Error servidor:', e.message));

// 3. ¿Usuario autenticado?
console.log('3. Usuario:', localStorage.getItem('userId'));
console.log('   Rol:', localStorage.getItem('userRole'));
console.log('   Token:', !!localStorage.getItem('authToken'));

// 4. Resumen
setTimeout(() => {
  const offline = !!localStorage.getItem('backend_offline_mode');
  const authenticated = !!localStorage.getItem('authToken');
  console.log('\n📊 RESUMEN:');
  console.log('   Modo offline:', offline ? '⚠️ SÍ' : '✅ NO');
  console.log('   Autenticado:', authenticated ? '✅ SÍ' : '❌ NO');
  console.log('\n' + (offline 
    ? '🔧 Acción: Sal del modo offline' 
    : authenticated 
      ? '🎉 Todo bien' 
      : '🔑 Acción: Inicia sesión'));
}, 2000);
```

---

## 🚨 Soluciones de Emergencia

### Si nada funciona:

```javascript
// RESET TOTAL - Úsalo solo como último recurso
console.warn('⚠️ RESET TOTAL DEL SISTEMA');
console.log('Esto borrará TODOS los datos locales.');
console.log('¿Estás seguro? Ejecuta el siguiente comando si quieres continuar:\n');
console.log('localStorage.clear(); sessionStorage.clear(); indexedDB.databases().then(dbs => dbs.forEach(db => indexedDB.deleteDatabase(db.name))); setTimeout(() => location.reload(), 1000);');
```

---

## 💡 Tips

1. **Abre la consola con F12** en Chrome/Edge/Firefox
2. **Pega el código completo** y presiona Enter
3. **Lee los resultados con calma** - te dirán exactamente qué hacer
4. **No ejecutes scripts que no entiendas** - todos estos son seguros

---

## 🎉 Script de Celebración

Una vez que todo funcione:

```javascript
console.log(`
🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉

    ¡SISTEMA CONECTADO Y FUNCIONANDO!
    
    Club Natación Lo Prado
    Sistema de Gestión v2.0
    
    ✅ Servidor: Online
    ✅ Base de datos: Conectada
    ✅ Autenticación: Activa
    ✅ PWA: Instalable
    
    ¡A nadar! 🏊‍♂️🏊‍♀️
    
🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉
`);
```

---

¡Usa estos scripts para diagnosticar y resolver problemas rápidamente! 🚀
