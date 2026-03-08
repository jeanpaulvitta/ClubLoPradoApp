# 🔧 Solución: Error "Invalid JWT" - Configuración del Servidor

## 🎯 Problema Identificado

El error `Invalid JWT` o "Missing authorization header" ocurre porque **las variables de entorno NO están configuradas** en Supabase Edge Functions.

### Síntomas:
- ❌ No puedes aprobar solicitudes de acceso
- ❌ Error: "Tu sesión ha expirado"
- ❌ Health check devuelve 401
- ❌ El botón "Aprobar" está deshabilitado

### Causa Raíz:
El servidor Edge Function `make-server-4909a0bc` no puede validar tokens JWT porque le faltan las credenciales de Supabase.

## ✅ Solución (5-10 minutos)

### Paso 1: Accede a Supabase Dashboard

1. **Abre tu navegador** y ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo
2. **Inicia sesión** con tu cuenta de Supabase (si no lo has hecho)

### Paso 2: Obtén las Claves API de Supabase

**PRIMERO** debes obtener las claves. **NO saltes este paso**.

1. En el dashboard de Supabase, en la parte **inferior izquierda**, haz clic en el ícono de **engranaje** (⚙️)
2. Selecciona **Project Settings**
3. En el menú izquierdo, haz clic en **API**
4. Verás una sección llamada **Project API keys**
5. **COPIA** estas dos claves (las necesitarás en el siguiente paso):

   **a) anon / public key** (aparece primero)
   ```
   Comienza con: eyJhbG...
   Es una cadena MUY larga (cientos de caracteres)
   ```
   👉 **Haz clic en el ícono de copiar** para copiarla al portapapeles
   👉 **Pégala en un archivo de texto temporal** por ahora
   
   **b) service_role key** (aparece abajo, puede decir "secret")
   ```
   Comienza con: eyJhbG...
   También es MUY larga
   ```
   👉 **Haz clic en "Reveal"** o el ícono de ojo para verla
   👉 **Haz clic en el ícono de copiar** para copiarla
   👉 **Pégala también en tu archivo de texto temporal**

⚠️ **IMPORTANTE**: La `service_role` key es **SECRETA** - nunca la compartas públicamente

### Paso 3: Configura las Variables de Entorno en Edge Functions

Ahora que tienes las claves copiadas:

1. En el menú izquierdo del dashboard, haz clic en **Edge Functions**
2. Busca y haz clic en la función **make-server-4909a0bc**
3. Dentro de la función, busca la pestaña **Secrets** o **Environment Variables** (puede estar arriba o en un menú)
4. Haz clic en **"Add new secret"** o **"New variable"**
5. Agrega estas 3 variables **EXACTAMENTE** como se indica:

#### Variable 1: SUPABASE_URL
```
Nombre (exacto):  SUPABASE_URL
Valor:            https://vrclozhgaacehojbnpuo.supabase.co
```
👉 Copia y pega exactamente como está arriba

#### Variable 2: SUPABASE_ANON_KEY
```
Nombre (exacto):  SUPABASE_ANON_KEY
Valor:            [PEGA AQUÍ la "anon/public" key que copiaste en el Paso 2]
```
👉 **NO escribas nada más** - solo pega la clave que copiaste
👉 Debe empezar con `eyJ` y ser MUY larga (300+ caracteres)
👉 **SIN espacios** al principio o al final

#### Variable 3: SUPABASE_SERVICE_ROLE_KEY
```
Nombre (exacto):  SUPABASE_SERVICE_ROLE_KEY
Valor:            [PEGA AQUÍ la "service_role" key que copiaste en el Paso 2]
```
👉 **NO escribas nada más** - solo pega la clave que copiaste
👉 Debe empezar con `eyJ` y ser MUY larga (300+ caracteres)
👉 **SIN espacios** al principio o al final
👉 ⚠️ Esta es SECRETA - nunca la compartas

### ✅ Verificación Rápida ANTES de continuar:
- [ ] Agregaste las 3 variables
- [ ] Los nombres están EXACTAMENTE como se indica (respetando mayúsculas)
- [ ] SUPABASE_URL tiene la URL completa
- [ ] SUPABASE_ANON_KEY empieza con "eyJ"
- [ ] SUPABASE_SERVICE_ROLE_KEY empieza con "eyJ"
- [ ] NO hay espacios extra en los valores

### Paso 4: Reinicia la Edge Function

**CRÍTICO**: Debes reiniciar la función para que tome las nuevas variables.

1. Asegúrate de estar en la página de la función **make-server-4909a0bc**
2. Busca un botón que diga **"Redeploy"**, **"Restart"**, o **"Deploy"**
   - Puede estar arriba a la derecha
   - O en un menú de acciones
3. **Haz clic** en ese botón
4. **Confirma** si te pide confirmación
5. **Espera 30-60 segundos** a que se reinicie
   - Verás un indicador de "Deploying..." o "Restarting..."
   - Espera a que diga "Active" o "Running"

### Paso 5: Verifica que Funciona

1. En tu aplicación, ve a **Usuarios → Solicitudes**
2. Haz clic en el botón **🧪 Probar Auth** (card azul arriba)
3. Abre la consola del navegador (F12)
4. Deberías ver:
   ```
   ✅ Health check: {status: "ok", ...}
   ✅ Sesión verificada: {...}
   ✅ Autenticación funcionando correctamente
   ```

## 🎯 Resultado Esperado

Después de configurar las variables, podrás:
- ✅ Aprobar solicitudes de acceso sin errores
- ✅ Crear usuarios desde el panel de administración
- ✅ El sistema funcionará completamente

## ❓ ¿Dónde Encuentro las Claves?

### Opción 1: Desde el Dashboard
```
1. https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo
2. Settings (engranaje abajo izquierda)
3. API
4. Project API keys
   - anon/public → SUPABASE_ANON_KEY
   - service_role → SUPABASE_SERVICE_ROLE_KEY (Reveal para ver)
```

### Opción 2: Las Claves Deberían Estar en `/utils/supabase/info.tsx`
Si tienes acceso al código, puedes copiarlas de ahí:
- `publicAnonKey` = SUPABASE_ANON_KEY
- La service_role key debería estar en tus notas o en el proyecto original

## 🚨 IMPORTANTE: Seguridad

⚠️ **NUNCA** compartas la `service_role` key públicamente
- No la subas a GitHub
- No la compartas en screenshots
- Solo agrégala en las variables de entorno de Supabase

## 📞 Si Persiste el Error

Si después de configurar las variables sigues viendo "Invalid JWT":

1. **Verifica que las 3 variables estén configuradas**
   - Revisa que no haya espacios extra
   - Verifica que las claves estén completas

2. **Reinicia la Edge Function**
   - A veces tarda un poco en actualizar
   - Espera 1-2 minutos después del restart

3. **Cierra sesión y vuelve a iniciar sesión**
   - Esto generará un token nuevo

4. **Revisa los logs de la Edge Function**
   - En Supabase Dashboard → Edge Functions → make-server-4909a0bc → Logs
   - Busca errores relacionados con las variables de entorno

## ✅ Checklist Final

- [ ] Agregué SUPABASE_URL
- [ ] Agregué SUPABASE_ANON_KEY (empieza con "eyJ...")
- [ ] Agregué SUPABASE_SERVICE_ROLE_KEY (empieza con "eyJ...")
- [ ] Reinicié la Edge Function
- [ ] Probé el botón de diagnóstico
- [ ] El health check devuelve status: "ok"
- [ ] Puedo aprobar solicitudes sin errores

---

## 🎉 Una Vez Configurado

Después de completar todos los pasos:

1. ✅ El banner rojo desaparecerá
2. ✅ Verás un card verde con "✅ Servidor Configurado"
3. ✅ Podrás hacer clic en "Aprobar" sin errores
4. ✅ El sistema creará usuarios automáticamente
5. ✅ Todo funcionará normalmente

## 🆘 ¿Todavía no Funciona?

Si después de seguir TODOS los pasos sigues viendo errores:

### Verifica CADA uno de estos puntos:

1. **Las 3 variables están agregadas** (en Supabase Dashboard → Edge Functions → make-server-4909a0bc → Secrets)
   - [ ] SUPABASE_URL
   - [ ] SUPABASE_ANON_KEY
   - [ ] SUPABASE_SERVICE_ROLE_KEY

2. **Los nombres son EXACTOS** (respetando mayúsculas)
   - ❌ SUPABASE_url (incorrecto)
   - ✅ SUPABASE_URL (correcto)

3. **Las claves son las correctas**
   - [ ] SUPABASE_ANON_KEY empieza con "eyJ"
   - [ ] SUPABASE_SERVICE_ROLE_KEY empieza con "eyJ"
   - [ ] No hay espacios extra al principio o al final

4. **La Edge Function se reinició**
   - [ ] Hiciste clic en "Redeploy" o "Restart"
   - [ ] Esperaste 30-60 segundos
   - [ ] El estado dice "Active" o "Running"

5. **En la aplicación**
   - [ ] Recargaste la página (F5)
   - [ ] Hiciste clic en "Verificar Configuración"
   - [ ] Revisaste la consola del navegador (F12) en busca de errores

### Revisa los Logs de la Edge Function

Si nada funciona:

1. Ve a Supabase Dashboard
2. Edge Functions → make-server-4909a0bc
3. Haz clic en **Logs** o **Invocations**
4. Busca errores recientes
5. Copia el error y revísalo

Errores comunes en logs:
- `ReferenceError: SUPABASE_URL is not defined` → Variable no agregada
- `Invalid JWT` → Las claves están mal o son incorrectas
- `Missing required environment variables` → Falta alguna variable

---

**Fecha**: 5 de Marzo de 2026  
**Proyecto**: Club Natación Lo Prado - Sistema de Gestión  
**Versión**: 2.0 - Configuración Simplificada
