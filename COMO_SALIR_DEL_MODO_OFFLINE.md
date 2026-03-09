# 🚀 ¿Cómo Salir del Modo Offline? - 3 Pasos Simples

## Ya configuraste las variables de entorno en Supabase. Ahora:

---

## ✅ OPCIÓN 1: Automático (Recomendado)

### Desde la aplicación:

1. **Si ves el banner amarillo** "MODO OFFLINE ACTIVADO":
   
   👉 Haz clic en **"🔄 Verificar Servidor y Salir"**
   
   ✅ El sistema verificará y saldrá automáticamente si todo está OK

2. **Si estás en la página de login**:
   
   👉 Haz clic en **"🔧 Diagnóstico del Sistema"** (abajo)
   
   👉 Click en **"Verificar"**
   
   ✅ Si muestra verde, el modo offline se desactivará solo

---

## ✅ OPCIÓN 2: Manual Rápido

### Desde la consola del navegador:

1. Presiona **F12** (DevTools)

2. Ve a la pestaña **"Console"**

3. Copia y pega esto:
   ```javascript
   localStorage.removeItem('backend_offline_mode');
   location.reload();
   ```

4. Presiona **Enter**

✅ Listo, la app se recargará sin modo offline

---

## ✅ OPCIÓN 3: Verificación Completa

### Paso 1: Verifica que el servidor responde

Abre en el navegador:
```
https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health
```

**Deberías ver:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "..."
}
```

### Paso 2: Si ves el JSON, el servidor está OK

Usa la **OPCIÓN 2** (manual rápido) para limpiar el modo offline

### Paso 3: Si ves un error

1. Ve a Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions
   ```

2. Verifica que la función **"server"** esté desplegada (verde)

3. Si no está desplegada, haz click en **"Deploy"**

4. Espera 2 minutos y vuelve al Paso 1

---

## 🎯 ¿Cómo sé que salí del modo offline?

### ✅ Señales de éxito:
- No ves el banner amarillo en la aplicación
- Puedes iniciar sesión normalmente
- Puedes crear/editar nadadores
- Los cambios se guardan en el servidor

### ❌ Si aún ves el banner amarillo:
1. Abre DevTools (F12)
2. Console:
   ```javascript
   localStorage.clear();
   location.reload();
   ```

---

## 🚨 Troubleshooting Rápido

### "No puedo abrir DevTools"
- Chrome/Edge: `F12` o `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- Firefox: `F12` o `Ctrl+Shift+K`

### "El health check da error 401"
Las variables de entorno no están configuradas correctamente.

**Solución:**
1. Ve a: `https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions/server`
2. Click en "Configuration" → "Secrets"
3. Verifica que estén las 3 variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Si falta alguna, agrégala
5. Haz un **"Redeploy"** de la función
6. Espera 2 minutos y prueba de nuevo

### "El health check da timeout"
El servidor no está desplegado o no responde.

**Solución:**
1. Ve a Edge Functions en Supabase
2. Busca la función "server"
3. Verifica que tenga un deployment "Active" (verde)
4. Si no, haz click en "Deploy"

---

## 📚 Documentación Completa

Si necesitas más detalles:
- **Guía paso a paso**: `/SALIR_MODO_OFFLINE.md`
- **Verificación rápida**: `/VERIFICACION_RAPIDA.md`
- **Resumen técnico**: `/RESUMEN_CAMBIOS_MODO_OFFLINE.md`

---

## ⚡ TL;DR (Muy Muy Rápido)

```javascript
// Copia esto en la consola del navegador (F12)
localStorage.removeItem('backend_offline_mode');
location.reload();
```

¡Eso es todo! 🎉
