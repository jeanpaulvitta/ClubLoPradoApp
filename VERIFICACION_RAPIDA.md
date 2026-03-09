# ✅ Verificación Rápida - Salir del Modo Offline

## 🎯 Objetivo
Ya configuraste las variables de entorno en Supabase. Ahora vamos a verificar y salir del modo offline.

---

## 🚀 Método Rápido (Recomendado)

### Opción 1: Desde el Banner Amarillo

Si ves el banner amarillo "MODO OFFLINE ACTIVADO" en la aplicación:

1. Haz clic en el botón **"🔄 Verificar Servidor y Salir"**
2. El sistema verificará automáticamente la conexión
3. Si está OK, se recargará y saldrás del modo offline
4. Si falla, recibirás un mensaje con instrucciones

### Opción 2: Desde el Diagnóstico del Sistema

En la página de login:

1. Haz clic en **"🔧 Diagnóstico del Sistema"**
2. Ve a la pestaña **"Estado del Servidor"**
3. Haz clic en **"Verificar"**
4. Si muestra **"✅ Servidor en Línea"**, el modo offline se desactivará automáticamente
5. Si muestra **"Modo Offline Activado"**, haz clic en **"Salir del Modo Offline"**

---

## 🔍 Verificación Manual

### Paso 1: Health Check del Servidor

Abre esta URL en tu navegador:

```
https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health
```

**Respuesta esperada (✅ OK):**
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2026-03-09T..."
}
```

**Si ves un error:**
- **401 Unauthorized**: Faltan variables de entorno
- **404 Not Found**: La función no está desplegada
- **Timeout**: El servidor no responde

---

### Paso 2: Limpiar el Modo Offline

#### Método A: Desde la Consola del Navegador

1. Presiona `F12` para abrir DevTools
2. Ve a la pestaña **"Console"**
3. Escribe y ejecuta:
   ```javascript
   localStorage.removeItem('backend_offline_mode');
   location.reload();
   ```

#### Método B: Desde Application/Storage

1. Presiona `F12` para abrir DevTools
2. Ve a la pestaña **"Application"** (o "Aplicación")
3. En el menú izquierdo: **"Local Storage"** → tu dominio
4. Busca la clave `backend_offline_mode`
5. Haz clic derecho → **"Delete"**
6. Recarga la página (`F5`)

---

## 🧪 Verificar que Todo Funciona

### ✅ Checklist

Después de salir del modo offline, verifica:

- [ ] NO ves el banner amarillo de "Modo Offline"
- [ ] Puedes iniciar sesión con las credenciales del admin
- [ ] Puedes crear/editar nadadores
- [ ] Puedes registrar asistencias
- [ ] Los datos se guardan correctamente

---

## 🚨 Si Algo No Funciona

### Problema: El banner amarillo sigue apareciendo

**Solución 1: Limpieza completa**
```javascript
// En la consola del navegador
localStorage.clear();
sessionStorage.clear();
location.reload();
```

**Solución 2: Modo incógnito**
1. Abre una ventana de incógnito
2. Accede a la aplicación
3. Si funciona ahí, el problema es la caché

---

### Problema: Error al hacer login

**Posibles causas:**
1. El servidor no está desplegado
2. Faltan variables de entorno
3. Las credenciales son incorrectas

**Solución:**
1. Verifica el health check (Paso 1)
2. Revisa las variables en Supabase Dashboard
3. Verifica los logs en Edge Functions

---

### Problema: "Missing authorization header"

**Causa:** Las variables de entorno no están configuradas

**Solución:**
1. Ve a Supabase Dashboard → Edge Functions → server
2. Click en "Configuration" o "Settings"
3. Agrega las 3 variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Haz un redeploy de la función

---

## 📊 Monitoreo del Servidor

### Ver Logs en Tiempo Real

1. Ve a Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/logs/edge-functions-logs
   ```

2. Filtra por la función "server"

3. Busca errores o warnings

---

## 🎓 Recursos Adicionales

- **Guía completa**: `/GUIA_CONEXION_SUPABASE.md`
- **Instrucciones detalladas**: `/SALIR_MODO_OFFLINE.md`
- **Documentación de referencia**: `/README_CONEXION_SUPABASE.md`

---

## 💡 Consejos

1. **Siempre usa "Verificar Servidor y Salir"** en lugar de "Salir Sin Verificar" para asegurarte de que todo funciona

2. **Revisa los logs** si algo falla para entender qué está pasando

3. **Mantén las variables de entorno seguras** - nunca las compartas públicamente

4. **Haz un redeploy** después de cambiar variables de entorno

---

¿Listo para continuar? ¡Usa los métodos anteriores y verifica que todo funcione correctamente! 🎉
