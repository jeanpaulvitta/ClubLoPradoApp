# 🔍 Diagnóstico Rápido - App No Funciona

## ⚡ Soluciones Rápidas (Prueba en orden)

### 1️⃣ **SOLUCIÓN INMEDIATA - Limpiar Caché**

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Limpiar Service Worker y caché
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key));
});
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### 2️⃣ **Recargar con Caché Limpio**

1. **Chrome/Edge**: Presiona `Ctrl + Shift + Delete` (Windows) o `Cmd + Shift + Delete` (Mac)
2. Selecciona "Todo el tiempo"
3. Marca: "Caché e imágenes almacenadas"
4. Click en "Borrar datos"
5. Recarga la página con `Ctrl + F5` (Windows) o `Cmd + Shift + R` (Mac)

### 3️⃣ **Modo Incógnito**

Prueba abrir la app en una ventana de incógnito:
- **Chrome**: `Ctrl + Shift + N` (Windows) o `Cmd + Shift + N` (Mac)
- Si funciona en incógnito, el problema es el caché local

---

## 🔍 Diagnóstico del Problema

### Verifica en la Consola (F12)

Busca errores de estos tipos:

#### ❌ **Error: Failed to fetch**
- **Causa**: Service Worker bloqueando recursos
- **Solución**: Ejecutar solución 1️⃣

#### ❌ **Error: Cannot read properties of undefined**
- **Causa**: Error en el código JavaScript
- **Solución**: Ver error específico en consola

#### ❌ **Error: Failed to load resource: net::ERR_BLOCKED_BY_CLIENT**
- **Causa**: Extensión de navegador (AdBlock, etc.)
- **Solución**: Desactivar extensiones o usar incógnito

#### ❌ **Error: Unexpected token '<'**
- **Causa**: Servidor retorna HTML en vez de JavaScript
- **Solución**: Verificar que el servidor esté funcionando

---

## 🛠️ Pasos de Diagnóstico Detallado

### Paso 1: Abre la Consola del Navegador

1. Presiona `F12` o click derecho → "Inspeccionar"
2. Ve a la pestaña "Console"
3. **Copia TODOS los errores rojos que veas**

### Paso 2: Verifica el Network Tab

1. Ve a la pestaña "Network" (Red)
2. Recarga la página (`F5`)
3. Busca archivos con estado **rojo** o **404**
4. Anota cuáles archivos fallan

### Paso 3: Verifica Service Workers

1. Ve a la pestaña "Application" (Aplicación)
2. En el menú izquierdo, click en "Service Workers"
3. Si hay un Service Worker activo:
   - Click en "Unregister"
   - Recarga la página

### Paso 4: Limpia Storage

En la pestaña "Application":
1. Click en "Storage" → "Clear site data"
2. Marca todas las opciones
3. Click "Clear site data"
4. Recarga con `Ctrl + F5`

---

## 🚨 Problemas Comunes y Soluciones

### Problema: "Pantalla Blanca"
**Síntomas**: Solo se ve una pantalla en blanco

**Soluciones**:
1. Revisa la consola - debe haber un error JavaScript
2. Limpia el caché (Solución 1️⃣)
3. Verifica que `/src/app/App.tsx` tenga `export default`

### Problema: "No carga el login"
**Síntomas**: La página de login no aparece

**Soluciones**:
1. Limpia localStorage con Solución 1️⃣
2. Verifica en consola errores de Supabase
3. Revisa que las variables de entorno estén configuradas

### Problema: "Error de autenticación"
**Síntomas**: No puedes iniciar sesión

**Soluciones**:
1. Verifica las credenciales
2. Limpia localStorage y cookies
3. Revisa el estado del servidor Supabase

### Problema: "Service Worker bloqueando la app"
**Síntomas**: La app funciona en incógnito pero no en normal

**Soluciones**:
1. Ejecuta este código en consola:
```javascript
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => {
    reg.unregister();
    console.log('SW desregistrado:', reg.scope);
  });
});
```
2. Recarga con `Ctrl + Shift + R`

---

## 📱 Problemas Específicos de Móvil

### App no carga en móvil

1. **Abre en Safari/Chrome móvil**
2. **Menú → Configuración → Privacidad**
3. **Borra datos del sitio específico**
4. **Recarga la página**

### PWA instalada no funciona

1. **Desinstala la PWA** (toca y mantén el ícono → Eliminar)
2. **Abre en navegador normal**
3. **Limpia caché del navegador**
4. **Reinstala la PWA**

---

## 🔧 Verificación del Servidor

### Verifica que Supabase esté funcionando

Ejecuta en consola:

```javascript
// Verificar conexión a Supabase
fetch('https://kxwwmnkcspfwfdqzvsnm.supabase.co/rest/v1/', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4d3dtbmtjc3Bmd2ZkcXp2c25tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0MTIzNjIsImV4cCI6MjA1NDk4ODM2Mn0.LJrSqHF5ZOMH-fP_y3IWhvU3eZH8hg7Zw-cZYfCvnBE'
  }
})
  .then(r => console.log('✅ Supabase OK:', r.status))
  .catch(e => console.error('❌ Supabase Error:', e));
```

---

## 🆘 Si Nada Funciona

### Último Recurso: Reset Completo

**⚠️ ADVERTENCIA: Esto borrará TODOS los datos locales**

```javascript
// RESET TOTAL
(async () => {
  // 1. Desregistrar Service Workers
  const regs = await navigator.serviceWorker.getRegistrations();
  for (let reg of regs) {
    await reg.unregister();
  }
  
  // 2. Limpiar todos los cachés
  const keys = await caches.keys();
  for (let key of keys) {
    await caches.delete(key);
  }
  
  // 3. Limpiar storage
  localStorage.clear();
  sessionStorage.clear();
  
  // 4. Limpiar cookies
  document.cookie.split(";").forEach(c => {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  
  console.log('✅ Reset completo - recargando...');
  
  // 5. Recargar
  location.reload();
})();
```

---

## 📞 Información para Soporte

Si el problema persiste, proporciona esta información:

1. **Navegador y versión**: (ej: Chrome 120.0.6099.109)
2. **Sistema operativo**: (ej: Windows 11, macOS 14, Android 13)
3. **Dispositivo**: (ej: Desktop, iPhone 14, Samsung Galaxy S23)
4. **Errores en consola**: (copia y pega TODOS los errores rojos)
5. **¿Funciona en incógnito?**: Sí / No
6. **¿Cuándo empezó?**: (ej: "Después de instalar PWA", "Hoy por la mañana")
7. **¿Qué no funciona específicamente?**: (ej: "Pantalla blanca", "No carga login", "Error al guardar")

---

## ✅ Verificación Post-Solución

Después de aplicar las soluciones, verifica:

- [ ] La consola no muestra errores rojos
- [ ] El login aparece correctamente
- [ ] Puedes iniciar sesión
- [ ] Las pestañas principales cargan
- [ ] Los datos se guardan correctamente
- [ ] No hay mensajes de Service Worker en consola

---

## 🎯 Próximos Pasos

Si solucionaste el problema:
1. Anota qué solución funcionó
2. Si vuelve a pasar, sabrás cómo solucionarlo

Si NO solucionaste el problema:
1. Recopila la información de la sección "Información para Soporte"
2. Comparte los detalles específicos del error
3. Indica qué soluciones ya probaste
