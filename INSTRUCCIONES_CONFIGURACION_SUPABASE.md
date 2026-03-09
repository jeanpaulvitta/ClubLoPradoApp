# 🔧 INSTRUCCIONES: Configurar Variables de Entorno en Supabase

## ❌ PROBLEMA DETECTADO

Tu Edge Function está leyendo **placeholders** en lugar de las keys reales:
- `SUPABASE_URL`: `sb_secret_...` (40 chars) ❌
- `SUPABASE_SERVICE_ROLE_KEY`: `sb_secret_...` (41 chars) ❌  
- `SUPABASE_ANON_KEY`: `sb_publish...` (46 chars) ❌

**Estos NO son las keys JWT. Son referencias que Supabase no está resolviendo.**

---

## ✅ SOLUCIÓN PASO A PASO

### PASO 1: Obtener tus KEYS REALES

1. **Abre Supabase Dashboard**: https://supabase.com/dashboard
2. **Selecciona tu proyecto**: `vrclozhgaacehojbnpuo`
3. **Ve a**: `Settings` (⚙️ en el sidebar izquierdo) → `API`
4. **Copia estas 3 keys**:

#### 📋 Keys a copiar:

**A) Project URL**
- Está en la sección "Project URL"
- Debe verse así: `https://vrclozhgaacehojbnpuo.supabase.co`
- **Longitud esperada**: ~50 caracteres

**B) anon public (ANON KEY)**
- Está en la sección "Project API keys"
- Dice: "This key is safe to use in a browser..."
- Empieza con: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Longitud esperada**: ~200-300 caracteres
- **Tu key que me mostraste está bien**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyY2xvemhnYWFjZWhvamJucHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MDc1OTEsImV4cCI6MjA4NTk4MzU5MX0.efL3mUq8zFgaqAY92FWiwGTBxlPmzkVq9kDjVXbjeVQ`

**C) service_role secret (SERVICE ROLE KEY)**
- Está en la misma sección "Project API keys"  
- Dice: "This key has the ability to bypass Row Level Security..."
- Empieza con: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Longitud esperada**: ~200-300 caracteres
- ⚠️ **IMPORTANTE**: Esta key es DIFERENTE a la anon key

---

### PASO 2: Configurar las Variables en la Edge Function

**IMPORTANTE**: Las variables deben ir en la **FUNCIÓN ESPECÍFICA**, NO en la configuración global del proyecto.

1. **Ve a**: `Edge Functions` (en el sidebar izquierdo)
2. **Click en**: `make-server-4909a0bc`
3. **Click en**: Pestaña `Settings` (arriba, al lado de "Deployments")
4. **Busca la sección**: "Secrets" o "Function Secrets"

---

### PASO 3: BORRAR las variables actuales

**Si ya existen variables con estos nombres, BÓRRALAS primero:**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

### PASO 4: AGREGAR las variables CORRECTAMENTE

**Agrega estas 3 variables UNA POR UNA:**

#### Variable 1:
- **Name**: `SUPABASE_URL` (exactamente así, sin espacios)
- **Value**: `https://vrclozhgaacehojbnpuo.supabase.co` (copia la URL completa, SIN comillas)

#### Variable 2:
- **Name**: `SUPABASE_ANON_KEY` (exactamente así, sin espacios)
- **Value**: Pega la key que empieza con `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (anon public)
  - ✅ Debe tener ~205 caracteres
  - ✅ Empieza con `eyJ`
  - ✅ Termina con algo como `...VXbjeVQ`
  - ❌ NO pongas comillas
  - ❌ NO pongas espacios antes/después

#### Variable 3:
- **Name**: `SUPABASE_SERVICE_ROLE_KEY` (exactamente así, sin espacios)
- **Value**: Pega la service_role key que empieza con `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  - ✅ Debe tener ~200-300 caracteres
  - ✅ Empieza con `eyJ`
  - ✅ Es DIFERENTE a la ANON_KEY
  - ❌ NO pongas comillas
  - ❌ NO pongas espacios antes/después

---

### PASO 5: REDEPLOY la función

**CRÍTICO**: Las variables solo se aplican cuando haces un NUEVO deploy.

1. **Ve a la pestaña**: `Deployments` (en la función `make-server-4909a0bc`)
2. **Click en el botón**: `Deploy function` (verde, arriba a la derecha)
3. **Espera**: Hasta que veas "Deployment successful" (1-2 minutos)

---

### PASO 6: VERIFICAR que funcionó

**Opción A: Abrir el health endpoint directamente**
```
https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health
```

**Debes ver:**
```json
{
  "status": "ok",
  "valid": true,
  "message": "✅ All environment variables configured correctly",
  "debug": {
    "urlLength": 50,
    "urlValid": true,
    "serviceKeyLength": 205,
    "serviceKeyValid": true,
    "anonKeyLength": 205,
    "anonKeyValid": true
  }
}
```

**Opción B: En tu aplicación**
1. Recarga la página (F5)
2. Abre la consola (F12)
3. Ve a la pestaña "Usuarios"
4. Debes ver: `✅ SERVIDOR CONFIGURADO CORRECTAMENTE`

---

## 🚨 ERRORES COMUNES

### Error 1: "sb_secret_xxx" en lugar de la key
❌ **Incorrecto**: Poner `sb_secret_SUPABASE_ANON_KEY`
✅ **Correcto**: Pegar la key COMPLETA que empieza con `eyJ...`

### Error 2: Variables en el lugar equivocado
❌ **Incorrecto**: Project Settings → Edge Functions → Environment Variables (global)
✅ **Correcto**: Edge Functions → make-server-4909a0bc → Settings → Secrets (específico de la función)

### Error 3: No hacer redeploy
❌ **Incorrecto**: Agregar variables y solo guardar
✅ **Correcto**: Agregar variables + Deploy function

### Error 4: Copiar la key incompleta
❌ **Incorrecto**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (con "..." al final)
✅ **Correcto**: Copiar TODA la key hasta el último carácter

---

## 📸 CAPTURAS DE PANTALLA (lo que debes ver)

### En Settings → API:
```
Project URL
https://vrclozhgaacehojbnpuo.supabase.co

Project API keys
┌─────────────────────────────────────────┐
│ anon public                             │
│ eyJhbGciOiJIUzI1NiIsInR5cC...VXbjeVQ    │ ← Esta es ANON_KEY
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ service_role secret                     │
│ eyJhbGciOiJIUzI1NiIsInR5cC...xxxxxxxx   │ ← Esta es SERVICE_ROLE_KEY
└─────────────────────────────────────────┘
```

### En Edge Functions → make-server-4909a0bc → Settings:
```
Function Secrets
┌───────────────────────────────┬──────────────────────────┐
│ Name                          │ Value                    │
├───────────────────────────────┼──────────────────────────┤
│ SUPABASE_URL                  │ https://vrclozhgaa...    │
│ SUPABASE_ANON_KEY             │ eyJhbGciOiJIUzI1...      │
│ SUPABASE_SERVICE_ROLE_KEY     │ eyJhbGciOiJIUzI1...      │
└───────────────────────────────┴──────────────────────────┘
```

---

## 🆘 SI SIGUE SIN FUNCIONAR

**Envíame una captura de pantalla de:**

1. La sección "Project API keys" en Settings → API
2. La sección "Function Secrets" en Edge Functions → make-server-4909a0bc → Settings
3. El resultado de abrir: https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health

**NO compartas las keys completas públicamente. Solo dime:**
- ✅ Primera key empieza con: `eyJh...`
- ✅ Longitud: 205 caracteres
- ❌ Si ves `sb_secret_xxx` o similar

---

## ✅ CHECKLIST FINAL

Antes de continuar, verifica:

- [ ] Copié las 3 keys desde Settings → API
- [ ] Las keys empiezan con `eyJ` (no con `sb_secret`)
- [ ] Las keys tienen ~200-300 caracteres (no 40-50)
- [ ] Agregué las variables en Edge Functions → make-server-4909a0bc → Settings
- [ ] Hice redeploy después de agregar las variables
- [ ] Esperé 1-2 minutos después del deploy
- [ ] El /health endpoint muestra "valid": true
