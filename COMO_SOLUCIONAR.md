# 🆘 Cómo Solucionar Problemas - Club Natación Lo Prado

## 🎯 Guía Rápida de Soluciones

Dependiendo de tu situación, elige la opción más apropiada:

---

## Situación 1: "La app está cargando pero algo no funciona bien"

### ✅ Mejor solución: Botón de Emergencia en la App

1. **Busca el botón rojo pulsante ⚠️** en la esquina inferior derecha
2. Click en el botón
3. Click en **"Ejecutar Arreglo Rápido"**
4. Espera a que termine automáticamente

**Tiempo:** 30 segundos  
**Ventaja:** Mantiene tu sesión activa

---

## Situación 2: "Veo pantalla blanca o la app no carga nada"

### ✅ Mejor solución: Página de Troubleshooting

1. **Abre en tu navegador:** [`troubleshoot.html`](./troubleshoot.html)
2. Click en **"Arreglo Rápido"**
3. Espera a que recargue

**Tiempo:** 1 minuto  
**Ventaja:** Interfaz visual fácil de usar

---

## Situación 3: "Tengo acceso a la consola del navegador"

### ✅ Mejor solución: Comando rápido en consola

1. Presiona **F12** para abrir la consola
2. Ve a la pestaña **"Console"**
3. Pega este código y presiona Enter:

```javascript
navigator.serviceWorker.getRegistrations().then(r=>r.forEach(e=>e.unregister()));caches.keys().then(k=>k.forEach(n=>caches.delete(n)));localStorage.clear();sessionStorage.clear();location.reload();
```

**Tiempo:** 15 segundos  
**Ventaja:** Más rápido para usuarios técnicos

---

## Situación 4: "Soy desarrollador verificando el código"

### ✅ Mejor solución: Script de diagnóstico

```bash
npm run diagnose
```

Este comando verifica:
- ✅ Archivos críticos
- ✅ Dependencias instaladas
- ✅ Configuración correcta
- ✅ Estructura del código

**Tiempo:** 5 segundos  
**Ventaja:** Identifica problemas de código

---

## Situación 5: "Nada de lo anterior funciona"

### ✅ Solución definitiva: Reset Nuclear

**⚠️ ADVERTENCIA:** Perderás tu sesión y tendrás que volver a iniciar sesión.

#### Opción A: Desde troubleshoot.html
1. Abre [`troubleshoot.html`](./troubleshoot.html)
2. Click en **"Reset Nuclear"**
3. Confirma la acción

#### Opción B: Desde la consola (F12)
```javascript
(async()=>{if('serviceWorker'in navigator){const r=await navigator.serviceWorker.getRegistrations();for(let e of r)await e.unregister()}if('caches'in window){const k=await caches.keys();for(let n of k)await caches.delete(n)}localStorage.clear();sessionStorage.clear();document.cookie.split(";").forEach(c=>{document.cookie=c.replace(/^ +/,"").replace(/=.*/,"=;expires="+new Date().toUTCString()+";path=/")});location.reload()})();
```

**Tiempo:** 30 segundos  
**Efectividad:** 99.9%

---

## 📋 Checklist de Soluciones (Prueba en orden)

Marca lo que ya probaste:

- [ ] **1. Botón de emergencia ⚠️** en la app (30 seg)
- [ ] **2. troubleshoot.html** - Arreglo Rápido (1 min)
- [ ] **3. Recarga forzada** - Ctrl+Shift+R / Cmd+Shift+R (5 seg)
- [ ] **4. Modo incógnito** - Verificar si es problema de caché (1 min)
- [ ] **5. troubleshoot.html** - Reset Nuclear (1 min)
- [ ] **6. Cerrar y reabrir navegador** completamente (30 seg)
- [ ] **7. Limpiar datos del navegador** manualmente (2 min)
- [ ] **8. Probar en otro navegador** (2 min)

---

## 🔍 Diagnóstico: ¿Cuál es el Problema Real?

### Prueba de Modo Incógnito

Abre la app en modo incógnito:
- **Chrome/Edge:** Ctrl + Shift + N
- **Firefox:** Ctrl + Shift + P
- **Safari:** Cmd + Shift + N

**¿Funciona en incógnito?**

#### ✅ SÍ funciona en incógnito
→ **Problema:** Service Worker o caché corrupto  
→ **Solución:** Usa "Arreglo Rápido" o "Reset Nuclear"

#### ❌ NO funciona ni en incógnito
→ **Problema:** Puede ser del servidor o código  
→ **Solución:** Ver sección "Problemas del Servidor" abajo

---

## 🌐 Problemas del Servidor

Si NADA funciona (ni en incógnito), puede ser problema del servidor Supabase.

### Verificar servidor:

Abre consola (F12) y ejecuta:

```javascript
fetch('https://kxwwmnkcspfwfdqzvsnm.supabase.co/rest/v1/')
  .then(r => console.log('✅ Servidor OK:', r.status))
  .catch(e => console.error('❌ Servidor Error:', e));
```

**Resultado esperado:** `✅ Servidor OK: 200`

**Si ves error:**
1. Verifica tu conexión a internet
2. Espera 5 minutos (puede ser problema temporal)
3. Si persiste, contacta al administrador

---

## 📱 Problemas Específicos de Móvil

### Android (Chrome):
1. Menú (⋮) → **Configuración**
2. **Privacidad y seguridad**
3. **Borrar datos de navegación**
4. Selecciona: **Caché e imágenes**
5. **Borrar datos**

### iPhone (Safari):
1. Configuración → **Safari**
2. **Avanzado** → **Datos de sitios web**
3. Busca la app
4. **Eliminar**

### PWA Instalada No Funciona:
1. **Desinstala** la PWA (mantén presionado → Eliminar)
2. **Abre** en navegador normal
3. **Limpia** el caché (pasos arriba)
4. **Reinstala** la PWA si quieres

---

## 📚 Documentación Completa

Según tu nivel técnico:

### 👤 Usuario Normal:
- **[`SOLUCION_INMEDIATA.md`](./SOLUCION_INMEDIATA.md)** ⭐ Empieza aquí
- **[`troubleshoot.html`](./troubleshoot.html)** - Página interactiva

### 🔧 Usuario Técnico:
- **[`DIAGNOSTICO_RAPIDO.md`](./DIAGNOSTICO_RAPIDO.md)** - Diagnóstico detallado
- **`npm run diagnose`** - Verificación de código

### 👨‍💻 Desarrollador:
- **[`README.md`](./README.md)** - Información general
- **[`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md)** - Guía técnica completa
- **[`SOLUCION_SERVICE_WORKER.md`](./SOLUCION_SERVICE_WORKER.md)** - Detalles del SW

---

## ⚡ Comandos Útiles (Terminal)

```bash
# Diagnóstico completo
npm run diagnose

# Verificar servidor
npm run check-server

# Limpiar y reiniciar desarrollo
npm run dev:clean

# Ayuda general
npm run help
```

---

## 🆘 Si NADA Funciona

Recopila esta información:

1. **Navegador y versión** (ej: Chrome 120.0)
2. **Sistema operativo** (ej: Windows 11)
3. **Dispositivo** (ej: Desktop / iPhone 14)
4. **¿Funciona en incógnito?** Sí / No
5. **Errores de consola** (copia TODO el texto rojo de F12 → Console)
6. **Qué soluciones probaste** (marca el checklist arriba)
7. **Resultado del test de servidor** (ejecuta el comando de verificación)

---

## ✅ Verificación Post-Solución

Después de solucionar, verifica:

- [ ] Login funciona correctamente
- [ ] Pestañas principales cargan
- [ ] Puedes ver nadadores/entrenamientos
- [ ] Puedes guardar cambios
- [ ] No hay errores en consola (F12)
- [ ] La app se siente rápida

Si TODO funciona: **¡Listo! 🎉**

---

## 💡 Prevención

Para evitar problemas futuros:

1. **Cierra pestañas** de la app cuando no la uses
2. **Actualiza el navegador** regularmente
3. **No uses extensiones agresivas** (AdBlock extremo, etc.)
4. **Si instalaste PWA**, desinstálala antes de updates grandes
5. **Limpia caché** 1 vez al mes como mantenimiento

---

## 🎯 Resumen de 1 Minuto

**¿La app no funciona?**

1. **Click en botón ⚠️** (esquina inferior derecha) → "Arreglo Rápido"
   - Si no ves botón: Abre [`troubleshoot.html`](./troubleshoot.html)

2. **Si no funciona:** "Reset Nuclear" en troubleshoot.html

3. **Si NADA funciona:** Prueba en modo incógnito
   - ✅ Funciona → Era caché, repite paso 2
   - ❌ No funciona → Problema de servidor, verifica conexión

**Listo. En 99% de casos, esto lo soluciona. 🚀**
