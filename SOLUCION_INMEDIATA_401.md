# ⚡ SOLUCIÓN INMEDIATA - Error 401

## 🚨 TL;DR (Demasiado largo, no lo leí)

**Problema:** Las keys que agregaste son INCORRECTAS.

**Solución Rápida (5 minutos):**

1. **Borra las 3 variables** en Edge Functions → make-server-4909a0bc → Settings → Secrets
2. **Ve a:** Settings ⚙️ → API → Project API keys
3. **Copia las keys haciendo click en "Copy" 📋** (NO selecciones manualmente)
4. **Las keys DEBEN empezar con `eyJ` y tener ~300 caracteres**
5. **Agrega las 3 variables de nuevo**
6. **REDEPLOY** (botón "Deploy")
7. **Espera 2 minutos**
8. **Recarga tu app**

---

## 🔍 Diagnóstico Rápido

### ❌ Lo que agregaste (INCORRECTO):

```
SUPABASE_ANON_KEY = 301fd969f77c128a6773714e0c14c019b7d3def89ad759a908062cee62504854
```

**Problema:** Esto es un hash SHA-256, NO es una key JWT de Supabase.

### ✅ Cómo debe verse (CORRECTO):

```
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyY2xvemhnYWFjZWhvamJucHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5ODEyNjEsImV4cCI6MjA1MDU1NzI2MX0.xxx...
```

**Características:**
- ✅ Empieza con `eyJ`
- ✅ Tiene puntos (`.`)
- ✅ ~300-400 caracteres
- ✅ Es un token JWT

---

## 📍 Dónde Copiar las Keys CORRECTAS

### Paso 1: Ir a Settings → API

```
Supabase Dashboard
  → Settings ⚙️ (menú lateral, ABAJO)
    → API
      → Scroll hacia abajo
        → "Project API keys"
```

### Paso 2: Copiar las keys

Verás una tabla con 2 filas:

```
┌──────────────────────────────────────────┐
│ anon • public                    [Copy] │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ service_role • secret            [Copy] │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │
└──────────────────────────────────────────┘
```

**HAZ CLICK EN "Copy" 📋**, NO selecciones el texto manualmente.

### Paso 3: Verificar antes de pegar

Pega en un bloc de notas y verifica:
- ✅ Empieza con `eyJ`
- ✅ Tiene ~300-400 caracteres
- ✅ Tiene 2 puntos (`.`)
- ❌ NO es hexadecimal (0-9, a-f)
- ❌ NO tiene exactamente 64 caracteres

---

## ✅ Variables a Agregar

### Variable 1: SUPABASE_URL
```
Name:  SUPABASE_URL
Value: https://vrclozhgaacehojbnpuo.supabase.co
```

### Variable 2: SUPABASE_ANON_KEY
```
Name:  SUPABASE_ANON_KEY
Value: [Pega la key de "anon • public"]
```
**Debe empezar con:** `eyJ`

### Variable 3: SUPABASE_SERVICE_ROLE_KEY
```
Name:  SUPABASE_SERVICE_ROLE_KEY
Value: [Pega la key de "service_role • secret"]
```
**Debe empezar con:** `eyJ`

---

## 🔄 Después de Agregar las Variables

### ⚡ REDEPLOY (IMPORTANTE)

1. Click en **"Deploy"** o **"Redeploy"**
2. **Espera 1-2 minutos**
3. Verifica que el status sea **"Active"**

### 🧪 Verificar que funciona

**Opción 1:** Abre esta URL en tu navegador:
```
https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health
```

**Deberías ver:**
```json
{
  "status": "ok",
  "configured": true,
  "message": "✅ All environment variables configured correctly"
}
```

**Opción 2:** En tu app:
1. Recarga la página (F5)
2. Ve a "Usuarios"
3. Click en "Verificar de Nuevo"
4. Deberías ver: ✅ **"Servidor Configurado"** (verde)

---

## 🆘 ¿Sigue sin funcionar?

### Si ves Error 401:

1. **Verifica que las keys empiecen con `eyJ`**
   - Si NO empiezan con `eyJ`, son INCORRECTAS
   - Bórralas y cópialas de nuevo desde Settings → API

2. **Verifica que hiciste REDEPLOY**
   - Las variables NO se aplican automáticamente
   - DEBES hacer REDEPLOY

3. **Verifica que el status sea "Active"**
   - Si dice "Failed", hay un error
   - Mira los logs: Edge Functions → make-server-4909a0bc → Logs

### Si ves `"status": "misconfigured"`:

1. Las variables NO se aplicaron
2. Haz **REDEPLOY** de nuevo
3. Espera 2 minutos
4. Prueba de nuevo

### Si NO carga (timeout):

1. La función NO está desplegada
2. O está en estado "Failed"
3. Ve a: Edge Functions → make-server-4909a0bc
4. Verifica el status y los logs

---

## 📖 Recursos Adicionales

- [Diagnóstico Completo Error 401](/DIAGNOSTICO_ERROR_401.md)
- [Guía de Variables de Entorno](/CONFIGURAR_VARIABLES_ENTORNO.md)
- [Test del Health Check](/TEST_HEALTH_CHECK.md)

---

## ✅ Checklist Final

Antes de decir "no funciona", verifica:

- [ ] Fui a **Settings** ⚙️ → **API** (NO otra sección)
- [ ] Copié las keys haciendo click en **"Copy"** 📋
- [ ] Las keys empiezan con `eyJ` (verifiqué en un bloc de notas)
- [ ] Las keys tienen ~300 caracteres (NO 64)
- [ ] Las 2 keys son DIFERENTES entre sí
- [ ] Agregué las 3 variables con nombres EXACTOS
- [ ] Hice **REDEPLOY** después de agregar las variables
- [ ] Esperé al menos 2 minutos después del redeploy
- [ ] El status de la función es **"Active"**
- [ ] Recargué la app (F5)
- [ ] Abrí la consola (F12) para ver los mensajes

---

🚀 **Avísame cuando hayas copiado las keys CORRECTAS y redesplegado!** 🚀

**Tiempo estimado:** 5 minutos
