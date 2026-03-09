# 🔐 Valores para Edge Functions Secrets

> Copia estos valores EXACTAMENTE como están para configurar las Edge Functions Secrets en Supabase

---

## 📍 Dónde Configurarlas

1. Ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions/server
2. Click en pestaña **"Configuration"** (o "Secrets" según la interfaz)
3. Agrega/sobrescribe cada variable con estos valores:

---

## 🔑 Variables Requeridas

### 1. SUPABASE_URL
```
https://vrclozhgaacehojbnpuo.supabase.co
```

### 2. SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyY2xvemhnYWFjZWhvamJucHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MDc1OTEsImV4cCI6MjA4NTk4MzU5MX0.efL3mUq8zFgaqAY92FWiwGTBxlPmzkVq9kDjVXbjeVQ
```

### 3. SUPABASE_SERVICE_ROLE_KEY
```
⚠️ ESTE VALOR DEBES OBTENERLO DEL DASHBOARD DE SUPABASE

Dónde encontrarlo:
1. Ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/settings/api
2. Busca la sección "Project API keys"
3. Encuentra "service_role" (secret)
4. Click en el ícono del ojo 👁️ para revelar el valor
5. Copia el valor completo
```

---

## ✅ Cómo Sobrescribir Secrets Existentes

**No puedes editar secrets existentes, pero SÍ puedes sobrescribirlas:**

1. **En el dashboard de Edge Functions**:
   - Ve a la pestaña "Configuration" o "Secrets"
   - Verás las variables ya creadas (pero no podrás ver sus valores)

2. **Para sobrescribir**:
   - Simplemente agrega la MISMA variable con el NUEVO valor
   - El sistema automáticamente reemplaza el valor anterior
   - Ejemplo: Si existe `SUPABASE_URL`, al agregar `SUPABASE_URL` de nuevo, se sobrescribe

3. **Después de agregar/sobrescribir las 3 variables**:
   - Click en **"Redeploy"** o **"Save"**
   - Espera 1-2 minutos para que los cambios se apliquen

---

## 🎯 Proceso Paso a Paso

```bash
# Paso 1: Ve al dashboard
https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions/server

# Paso 2: Click en "Configuration" → "Secrets"

# Paso 3: Agrega cada variable (sobrescribe si ya existe)
Variable 1:
  Name: SUPABASE_URL
  Value: https://vrclozhgaacehojbnpuo.supabase.co

Variable 2:
  Name: SUPABASE_ANON_KEY
  Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyY2xvemhnYWFjZWhvamJucHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MDc1OTEsImV4cCI6MjA4NTk4MzU5MX0.efL3mUq8zFgaqAY92FWiwGTBxlPmzkVq9kDjVXbjeVQ

Variable 3:
  Name: SUPABASE_SERVICE_ROLE_KEY
  Value: [OBTENERLO DEL DASHBOARD → Settings → API → service_role key]

# Paso 4: Click en "Save" o "Redeploy"

# Paso 5: Espera 1-2 minutos
```

---

## 🔍 Verificar que Funcionó

Después de configurar las secrets:

### 1. Health Check
Abre en el navegador:
```
https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health
```

**Respuesta esperada (✅):**
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2026-03-09T...",
  "configured": true
}
```

**Si ves error (❌):**
```json
{
  "code": 503,
  "message": "Server not configured. Environment variables missing.",
  "configured": false
}
```
👉 Significa que las variables no se configuraron correctamente. Repite el proceso.

---

## 📱 Interfaz de Supabase

La interfaz puede verse de 2 formas:

### Opción A: Pestaña "Configuration"
```
Functions → server → Configuration → Secrets
  ┌─────────────────────────────────────┐
  │ Add new secret                      │
  ├─────────────────────────────────────┤
  │ Name:  [____________]               │
  │ Value: [____________]               │
  │        [Add Secret]                 │
  ├─────────────────────────────────────┤
  │ Existing secrets:                   │
  │ • SUPABASE_URL          [🗑️]       │
  │ • SUPABASE_ANON_KEY     [🗑️]       │
  │ • ...                               │
  └─────────────────────────────────────┘
```

### Opción B: Modal "Manage Secrets"
```
[Manage Secrets] botón
  ↓
  Modal con lista de secrets y botón "Add secret"
```

**En ambos casos**:
- Puedes agregar nuevas variables
- Puedes eliminar variables existentes (icono 🗑️)
- NO puedes ver el valor de variables existentes
- SI agregas una variable con el MISMO nombre, sobrescribe la anterior

---

## ⚠️ Notas Importantes

1. **Las secrets son de SOLO escritura**: Una vez creadas, NO puedes ver su valor
2. **Sobrescritura automática**: Si agregas una variable con el mismo nombre, reemplaza el valor anterior
3. **Redeploy necesario**: Después de cambiar secrets, DEBES redesplegar la función
4. **Sin CLI**: No necesitas el CLI de Supabase, todo se hace desde el dashboard
5. **service_role es secreto**: NUNCA expongas este valor en el código frontend

---

## 🎯 Siguiente Paso

Una vez configuradas las 3 variables:

1. ✅ Verifica el health check
2. ✅ Ve a la app y haz click en "Verificar Servidor y Salir"
3. ✅ Intenta hacer login

Si todo funciona:
- ✅ El banner amarillo desaparecerá
- ✅ Podrás iniciar sesión
- ✅ Los datos se guardarán en Supabase

---

## 🆘 ¿Problemas?

Si después de configurar las secrets aún ves errores:

1. **Revisa los logs**:
   ```
   https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/logs/edge-functions-logs
   ```

2. **Espera más tiempo**: A veces toma 2-3 minutos aplicar los cambios

3. **Redespliega manualmente**:
   - Ve a Functions → server
   - Click en "Redeploy"
   - Espera 2 minutos

4. **Limpia caché del navegador**:
   ```javascript
   // En la consola (F12)
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

---

## 🎉 Resumen

**Pasos simples:**
1. Ve al dashboard de Edge Functions
2. Agrega las 3 variables (sobrescribe si ya existen)
3. Click "Save" o "Redeploy"
4. Espera 1-2 minutos
5. Verifica el health check
6. ¡Listo!

**Recuerda**: No necesitas CLI, todo se hace desde el navegador.
