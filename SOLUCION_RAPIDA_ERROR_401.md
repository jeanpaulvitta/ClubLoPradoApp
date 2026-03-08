# 🚨 SOLUCIÓN RÁPIDA - Error 401 (2 minutos)

## El Problema

```
❌ Error 401: El servidor respondió con error
```

**Traducción:** La Edge Function `make-server-4909a0bc` NO está desplegada o configurada.

---

## ✅ Solución Express (3 pasos)

### 1️⃣ Abre Supabase Dashboard

```
https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions
```

### 2️⃣ Verifica la función

**¿Ves `make-server-4909a0bc` en la lista?**

- ❌ **NO está:** Ve al paso 3
- ✅ **SÍ está:** Click en la función → Settings → Secrets

### 3️⃣ Configura las 3 variables

En **Settings → Secrets** de la función, agrega:

```bash
# Variable 1
SUPABASE_URL = https://vrclozhgaacehojbnpuo.supabase.co

# Variable 2 (Settings → API → anon key)
SUPABASE_ANON_KEY = eyJhbGc... [tu anon key]

# Variable 3 (Settings → API → service_role key)
SUPABASE_SERVICE_ROLE_KEY = eyJhbGc... [tu service_role key]
```

**Dónde encontrar las keys:**
- Supabase Dashboard → **Settings** ⚙️ → **API**
- Copia `anon` (public) y `service_role` (secret)

### 4️⃣ REDEPLOY (CRÍTICO)

- Después de agregar las variables → **Redeploy**
- Espera 30-60 segundos
- Status debe ser: **"Active"** ✅

---

## 🎉 Verificar que funciona

1. Regresa a tu app
2. Pestaña **Usuarios**
3. Click en **"Verificar de Nuevo"**
4. Deberías ver: ✅ **"Servidor Configurado"** (verde)

---

## 📖 ¿Primera vez desplegando?

Si la función NO existe, sigue la [**Guía Completa Paso a Paso**](/SOLUCION_ERROR_401_PASO_A_PASO.md)

---

## ❓ ¿Sigue sin funcionar?

**Checklist rápido:**

- [ ] Las 3 variables están configuradas
- [ ] Los nombres son EXACTOS (case-sensitive)
- [ ] Hice REDEPLOY después de agregar variables
- [ ] Esperé al menos 1 minuto
- [ ] El status es "Active" (no "Failed")

**Si TODO está ✅ y sigue fallando:**

- Ve a la función → **Logs**
- Busca errores en rojo
- Copia el mensaje y [ve a la guía completa](/SOLUCION_ERROR_401_PASO_A_PASO.md)

---

## 🔑 Recordatorio de Seguridad

⚠️ **SERVICE_ROLE_KEY es ultra secreto:**
- NUNCA lo compartas
- NUNCA lo subas a GitHub
- SOLO debe estar en la Edge Function

---

## ✅ Éxito confirmado cuando veas:

1. ✅ Edge Function status: **"Active"**
2. ✅ Health check: `"status": "ok"`
3. ✅ App → Usuarios: **"Servidor Configurado"** (verde)
4. ✅ Puedes aprobar solicitudes sin errores

**¡Listo! 🚀**
