# 🔄 Salir del Modo Offline

## Estado Actual

Ya has configurado las variables de entorno en Supabase Edge Functions. Ahora necesitas:

1. **Verificar que el servidor esté funcionando**
2. **Salir del modo offline**
3. **Confirmar que todo funciona correctamente**

---

## ✅ Pasos para Salir del Modo Offline

### Paso 1: Verificar las Edge Functions

1. Ve al Dashboard de Supabase:
   ```
   https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions
   ```

2. Verifica que exista una función llamada **"server"**

3. Asegúrate de que tenga un deployment **"Active"** (verde)

4. Si no ves ningún deployment activo:
   - Haz clic en la función "server"
   - Busca el botón "Deploy" o "Redeploy"
   - Espera 1-2 minutos a que termine

---

### Paso 2: Verificar las Variables de Entorno

1. Ve a la configuración de la función:
   ```
   https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions/server
   ```

2. Haz clic en "Configuration" o "Settings"

3. Verifica que estén configuradas las 3 variables:
   - ✅ `SUPABASE_URL`
   - ✅ `SUPABASE_ANON_KEY`
   - ✅ `SUPABASE_SERVICE_ROLE_KEY`

4. Si falta alguna, agrégala:
   - **SUPABASE_URL**: `https://vrclozhgaacehojbnpuo.supabase.co`
   - **SUPABASE_ANON_KEY**: (cópiala del archivo `/utils/supabase/info.tsx`)
   - **SUPABASE_SERVICE_ROLE_KEY**: (obtén esta key en Dashboard → Settings → API)

---

### Paso 3: Usar el Diagnóstico del Sistema

1. **En la pantalla de login**, haz clic en el botón:
   ```
   🔧 Diagnóstico del Sistema
   ```

2. Se abrirá una interfaz con 3 pestañas:
   - **Estado del Servidor**: Verifica la conexión
   - **Configuración**: Guía paso a paso
   - **Información**: Datos del sistema

3. En la pestaña **"Estado del Servidor"**:
   - Haz clic en el botón **"Verificar"**
   - Espera la respuesta del servidor

4. Si ves **"✅ Servidor en Línea"**:
   - El modo offline se desactivará automáticamente
   - Puedes cerrar el diagnóstico y iniciar sesión

5. Si ves **"Modo Offline Activado"**:
   - Haz clic en **"Salir del Modo Offline"**
   - La página se recargará automáticamente

---

### Paso 4: Verificar Manualmente (Alternativa)

Si prefieres hacerlo manualmente:

1. Abre la **Consola de Desarrollador** del navegador:
   - Chrome/Edge: `F12` o `Ctrl+Shift+I`
   - Mac: `Cmd+Option+I`

2. Ve a la pestaña **"Application"** (o "Aplicación")

3. En el menú izquierdo, busca **"Local Storage"**

4. Haz clic en tu dominio (por ejemplo: `https://tu-app.vercel.app`)

5. Busca la clave **`backend_offline_mode`**

6. Si existe, haz clic derecho sobre ella y selecciona **"Delete"**

7. Recarga la página (`F5` o `Ctrl+R`)

---

## 🧪 Verificar que Todo Funciona

### Prueba 1: Health Check

1. Abre una nueva pestaña del navegador

2. Visita esta URL:
   ```
   https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health
   ```

3. Deberías ver una respuesta JSON como:
   ```json
   {
     "status": "ok",
     "message": "Server is running",
     "timestamp": "2026-03-09T..."
   }
   ```

4. Si ves un error 401 o 404, revisa los pasos anteriores

---

### Prueba 2: Login

1. Vuelve a la aplicación

2. Verifica que **NO** veas el banner amarillo de "Modo Offline"

3. Intenta iniciar sesión con las credenciales del administrador:
   - Email: (el que configuraste)
   - Password: (la que configuraste)

4. Si el login funciona, ¡todo está correcto! ✅

---

## 🚨 Solución de Problemas

### Problema: "Request timeout - Server not responding"

**Causa**: El servidor no está desplegado o tarda mucho en responder

**Solución**:
1. Ve al Dashboard de Supabase → Edge Functions
2. Verifica que la función "server" esté desplegada
3. Haz un redeploy si es necesario
4. Espera 2-3 minutos y vuelve a verificar

---

### Problema: "Error 401: Unauthorized"

**Causa**: Faltan las variables de entorno

**Solución**:
1. Ve a la configuración de la función "server"
2. Agrega las 3 variables de entorno (ver Paso 2)
3. Haz un redeploy de la función
4. Espera 1-2 minutos y vuelve a verificar

---

### Problema: "CORS error"

**Causa**: Error en la configuración de CORS del servidor

**Solución**:
1. Este error no debería ocurrir, el servidor ya tiene CORS configurado
2. Si persiste, revisa los logs en Supabase Dashboard → Edge Functions → Logs
3. Busca errores relacionados con CORS

---

### Problema: El banner amarillo sigue apareciendo

**Causa**: El flag de modo offline no se limpió correctamente

**Solución**:
1. Usa el método manual (Paso 4) para eliminar `backend_offline_mode`
2. Cierra TODAS las pestañas de la aplicación
3. Abre una nueva pestaña y accede a la aplicación
4. Si persiste, limpia la caché del navegador

---

## 📞 Necesitas Más Ayuda?

Si después de seguir estos pasos aún tienes problemas:

1. **Revisa los logs del servidor**:
   ```
   https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/logs/edge-functions-logs
   ```

2. **Verifica la documentación completa**:
   - `/GUIA_CONEXION_SUPABASE.md` - Guía detallada de conexión
   - `/README_CONEXION_SUPABASE.md` - Referencia rápida

3. **Contacta al administrador del sistema**

---

## ✅ Checklist Final

Antes de continuar, asegúrate de que:

- [ ] Las 3 variables de entorno están configuradas en Supabase
- [ ] La función "server" está desplegada y activa
- [ ] El health check responde correctamente
- [ ] No hay flag `backend_offline_mode` en localStorage
- [ ] No ves el banner amarillo de modo offline
- [ ] Puedes iniciar sesión correctamente

¡Listo! Tu sistema debería estar funcionando completamente. 🎉
