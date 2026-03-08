# 🔑 CONFIGURAR VARIABLES DE ENTORNO (Paso Crítico)

## ✅ Ya desplegaste la función - ¡EXCELENTE!

Ahora el paso **MÁS IMPORTANTE**: Configurar las 3 variables de entorno.

**SIN ESTAS VARIABLES, LA FUNCIÓN NO FUNCIONARÁ** (seguirás viendo Error 401).

---

## 📋 Paso a Paso (3 minutos)

### 1️⃣ Ir a Settings de la función

En Supabase Dashboard:

```
Edge Functions → make-server-4909a0bc → Settings (pestaña arriba)
```

Busca la sección que dice:
- **"Environment Variables"** o
- **"Function Secrets"** o
- **"Secrets"**

Debería haber un botón que dice **"Add new secret"** o **"New variable"**.

---

### 2️⃣ Agregar Variable 1: SUPABASE_URL

Click en **"Add new secret"** y agrega:

```
Name:  SUPABASE_URL
Value: https://vrclozhgaacehojbnpuo.supabase.co
```

✅ **IMPORTANTE:**
- El nombre debe ser EXACTAMENTE `SUPABASE_URL` (mayúsculas)
- El valor debe ser EXACTAMENTE `https://vrclozhgaacehojbnpuo.supabase.co`
- SIN "/" al final
- SIN espacios

Click en **"Save"** o **"Add"**.

---

### 3️⃣ Agregar Variable 2: SUPABASE_ANON_KEY

Click en **"Add new secret"** de nuevo y agrega:

```
Name:  SUPABASE_ANON_KEY
Value: [tu anon key - instrucciones abajo]
```

#### ¿Dónde encontrar tu ANON_KEY?

**Opción A: Desde el mismo Dashboard**

1. En Supabase Dashboard → **Settings** ⚙️ (menú lateral izquierdo, abajo del todo)
2. Click en **"API"**
3. Busca la sección **"Project API keys"**
4. Verás una tabla con 2 filas:
   - `anon` • `public` ← **Esta es la que necesitas**
   - `service_role` • `secret` ← Esta la usaremos en el siguiente paso
5. Click en el icono de **"Copy"** 📋 al lado de `anon`
6. Pégala en el campo "Value"

**La key se ve así:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyY2xvemhnYWFjZWhvamJucHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5ODEyNjEsImV4cCI6MjA1MDU1NzI2MX0.xxx...
```
(Es muy larga, ~300 caracteres)

Click en **"Save"** o **"Add"**.

---

### 4️⃣ Agregar Variable 3: SUPABASE_SERVICE_ROLE_KEY ⚠️

Click en **"Add new secret"** de nuevo y agrega:

```
Name:  SUPABASE_SERVICE_ROLE_KEY
Value: [tu service_role key - instrucciones abajo]
```

#### ¿Dónde encontrar tu SERVICE_ROLE_KEY?

**IMPORTANTE: Esta es la key SECRETA. NUNCA la compartas.**

1. En el mismo lugar que la anterior: **Settings** → **API** → **"Project API keys"**
2. Ahora copia la key que dice:
   - `service_role` • `secret` ← **Esta es la que necesitas AHORA**
3. Click en el icono de **"Copy"** 📋 al lado de `service_role`
4. Pégala en el campo "Value"

**La key se ve así:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyY2xvemhnYWFjZWhvamJucHVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDk4MTI2MSwiZXhwIjoyMDUwNTU3MjYxfQ.xxx...
```
(Es muy larga, ~300 caracteres, DIFERENTE a la anon key)

⚠️ **ADVERTENCIA DE SEGURIDAD:**
- Esta key da acceso TOTAL a tu base de datos
- SOLO debe estar en la Edge Function (servidor)
- NUNCA la pongas en el frontend
- NUNCA la subas a GitHub en código
- NUNCA la compartas con nadie

Click en **"Save"** o **"Add"**.

---

### 5️⃣ Verificar que las 3 variables están configuradas

Después de agregar las 3, deberías ver algo así:

```
✅ SUPABASE_URL                    (https://vrclozhgaacehojbnpuo.supabase.co)
✅ SUPABASE_ANON_KEY               (eyJhbGc... ~300 chars)
✅ SUPABASE_SERVICE_ROLE_KEY       (eyJhbGc... ~300 chars) 🔒 secret
```

**Checklist:**
- [ ] Las 3 variables están agregadas
- [ ] Los nombres son EXACTOS (mayúsculas)
- [ ] La URL NO tiene "/" al final
- [ ] Las 2 keys son DIFERENTES entre sí
- [ ] Las 2 keys empiezan con `eyJ...`
- [ ] Las 2 keys tienen ~300 caracteres cada una

---

### 6️⃣ REDEPLOY (CRÍTICO) ⚡

**ESTO ES SÚPER IMPORTANTE:**

Las variables NO se aplican automáticamente. Debes hacer **REDEPLOY**.

1. **Opción A:** En la pestaña Settings, busca un botón que diga:
   - **"Redeploy"** o
   - **"Restart"** o
   - **"Apply changes"**

2. **Opción B:** Ve a la pestaña **"Code"** y:
   - Click en **"Deploy"** o **"Redeploy"**

3. **Espera 30-60 segundos** mientras se redespliega

4. Verifica que el status cambie a **"Active"** ✅

---

### 7️⃣ Verificar que funciona

1. **Espera 1-2 minutos** después del redeploy

2. **Prueba el health check** en tu navegador:
   ```
   https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health
   ```

3. **Deberías ver:**
   ```json
   {
     "status": "ok",
     "configured": true,
     "message": "✅ All environment variables configured correctly"
   }
   ```

4. **Si ves `"status": "misconfigured"`:**
   - Las variables NO se aplicaron
   - Verifica los nombres (case-sensitive)
   - Haz REDEPLOY de nuevo
   - Espera 2 minutos

5. **En tu aplicación:**
   - Regresa a la app
   - Pestaña **"Usuarios"**
   - Click en **"Verificar de Nuevo"**
   - Deberías ver: ✅ **"Servidor Configurado"** (verde)

---

## ✅ Confirmación de Éxito

Sabrás que TODO está bien cuando:

1. ✅ Las 3 variables están en Settings → Secrets
2. ✅ El status de la función es **"Active"**
3. ✅ El health check devuelve `"status": "ok"`
4. ✅ En la app ves **"✅ Servidor Configurado"** (verde)
5. ✅ Puedes aprobar solicitudes sin Error 401

---

## 🆘 Troubleshooting

### Problema: Sigo viendo Error 401 después de configurar

**Checklist:**
- [ ] ¿Agregaste las 3 variables con nombres EXACTOS?
- [ ] ¿Hiciste REDEPLOY después de agregar las variables?
- [ ] ¿Esperaste al menos 1 minuto después del redeploy?
- [ ] ¿El status de la función es "Active" (no "Failed")?
- [ ] ¿Las keys son las correctas (anon ≠ service_role)?

**Si TODO está ✅ y sigue fallando:**

1. **Borra las 3 variables y agrégalas de nuevo**
   - A veces hay caracteres invisibles
   - Copia directamente desde Settings → API

2. **Haz REDEPLOY de nuevo**
   - Espera 2 minutos

3. **Revisa los logs:**
   - Edge Functions → make-server-4909a0bc → **Logs**
   - Busca errores en rojo
   - Si ves "Environment variable ... is undefined" → No se aplicaron

### Problema: Health check dice "misconfigured"

**Solución:**

1. Ve a Settings → Secrets de la función
2. Verifica que las 3 variables estén ahí
3. Si faltan, agrégalas
4. **REDEPLOY** (no olvides esto)
5. Espera 2 minutos
6. Prueba de nuevo

### Problema: No encuentro dónde agregar variables

**Ubicación exacta:**

```
Supabase Dashboard
  → Edge Functions (menú lateral)
    → make-server-4909a0bc (click en el nombre)
      → Settings (pestaña arriba)
        → Environment Variables / Secrets (sección)
          → Add new secret (botón)
```

Si no ves "Settings", intenta:
- Hacer scroll en la página
- Buscar un icono de engranaje ⚙️
- Buscar una pestaña "Configuration"

---

## 📸 Referencia Visual

Deberías ver algo así en Settings → API:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Project API keys
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

anon • public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [📋 Copy]
↑ Esta es SUPABASE_ANON_KEY

service_role • secret
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [📋 Copy]
↑ Esta es SUPABASE_SERVICE_ROLE_KEY

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎯 Resumen Rápido

1. ✅ Settings → Secrets
2. ✅ Agregar `SUPABASE_URL`
3. ✅ Agregar `SUPABASE_ANON_KEY` (Settings → API → anon)
4. ✅ Agregar `SUPABASE_SERVICE_ROLE_KEY` (Settings → API → service_role)
5. ✅ REDEPLOY (importante!)
6. ✅ Esperar 1-2 minutos
7. ✅ Verificar en la app

**Tiempo total:** 3-5 minutos

---

## ✅ ¡Listo!

Cuando veas **"✅ Servidor Configurado"** en verde en tu app, podrás:
- Aprobar solicitudes de contraseña
- Crear cuentas para nadadores y entrenadores
- Todo el sistema funcionará correctamente

🚀 **¡Estás a 3 minutos de tener todo funcionando!** 🚀
