# 🚀 Cómo Conectar el Servidor - Guía Definitiva

> **TL;DR**: Las variables de Supabase ya están disponibles automáticamente. Solo necesitas desplegar la función y salir del modo offline.

---

## ✅ Lo Que Debes Saber

1. **NO necesitas crear secrets** con prefijo `SUPABASE_` - ya están automáticas
2. **Tu flujo de trabajo es**: Figma Make → GitHub → Supabase → Vercel
3. **GitHub Actions** desplegará automáticamente la Edge Function cuando hagas push

---

## 🎯 Pasos para Conectar el Servidor

### Paso 1: Verificar GitHub Actions Secret

Tu GitHub Actions necesita un token de acceso de Supabase.

1. **Ve a GitHub**: https://github.com/TU_USUARIO/TU_REPO/settings/secrets/actions
2. **Verifica que exista el secret**: `SUPABASE_ACCESS_TOKEN`
   - **SI existe** ✅ → Continúa al Paso 2
   - **NO existe** ❌ → Necesitas crearlo:

#### Cómo crear SUPABASE_ACCESS_TOKEN:

1. **Genera el token en Supabase**:
   - Ve a: https://supabase.com/dashboard/account/tokens
   - Click en **"Generate New Token"**
   - Nombre: `GitHub Actions Deploy`
   - Scopes: Selecciona **"All"** o al menos **"Functions: Write"**
   - Click **"Generate Token"**
   - **COPIA EL TOKEN INMEDIATAMENTE** (solo se muestra una vez)

2. **Agrégalo a GitHub**:
   - Ve a: https://github.com/TU_USUARIO/TU_REPO/settings/secrets/actions
   - Click **"New repository secret"**
   - Name: `SUPABASE_ACCESS_TOKEN`
   - Value: [PEGA EL TOKEN DE SUPABASE]
   - Click **"Add secret"**

---

### Paso 2: Desplegar la Edge Function

Tienes 2 opciones:

#### Opción A: Automático (Recomendado - Usando GitHub)

1. **Haz cualquier cambio menor en el código** (ya lo hice - actualicé el workflow)
2. **Haz commit y push**:
   - En Figma Make, los cambios se sincronizan automáticamente con GitHub
   - GitHub Actions detectará el cambio en `/workflows/deploy-supabase.yml`
   - Desplegará automáticamente la función `server`

3. **Verifica el despliegue**:
   - Ve a: https://github.com/TU_USUARIO/TU_REPO/actions
   - Busca el workflow **"Deploy to Supabase"**
   - Verifica que tenga un ✅ verde (puede tardar 2-3 minutos)

#### Opción B: Forzar un Redeploy Manual

Si la función ya está desplegada pero no funciona:

1. Ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions
2. Busca la función `server`
3. Click en los 3 puntos **"..."** → **"Redeploy"**
4. Espera 1-2 minutos

---

### Paso 3: Verificar que el Servidor Funciona

Abre en tu navegador:
```
https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/server/health
```

O también:
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

**Si ves 404** → La función no está desplegada (vuelve al Paso 2)

**Si ves error 503 o "configured: false"** → Revisa los logs:
```
https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/logs/edge-functions-logs
```

---

### Paso 4: Salir del Modo Offline

Una vez que el health check funcione:

#### Opción 1: Desde la Consola del Navegador
```javascript
// Abre la consola (F12)
localStorage.removeItem('backend_offline_mode');
location.reload();
```

#### Opción 2: Desde la Interfaz
1. En la app, busca el **banner amarillo**
2. Click en **"🔄 Verificar Servidor y Salir"**

#### Opción 3: Desde el Diagnóstico
1. En la página de login, click en **"🔧 Diagnóstico del Sistema"**
2. Pestaña **"Estado del Servidor"**
3. Click en **"Verificar Servidor"**
4. Si está OK, click en **"Salir del Modo Offline"**

---

### Paso 5: Verificar que Todo Funciona

- [ ] ✅ NO aparece el banner amarillo "MODO OFFLINE ACTIVADO"
- [ ] ✅ Puedes iniciar sesión con las credenciales del admin
- [ ] ✅ Puedes ver la lista de nadadores
- [ ] ✅ Los cambios se guardan correctamente

---

## 🔧 Troubleshooting

### Error: "404 Not Found" en Health Check

**Causa**: La Edge Function no está desplegada

**Solución**:
1. Verifica GitHub Actions: https://github.com/TU_USUARIO/TU_REPO/actions
2. Si hay errores, revisa que `SUPABASE_ACCESS_TOKEN` esté configurado
3. Si no hay workflow ejecutado, haz un push al repositorio

---

### Error: "configured: false" en Health Check

**Causa**: Las variables de entorno no están disponibles (raro, porque son automáticas)

**Solución**:
1. Redespliega la función desde el dashboard
2. Espera 2-3 minutos
3. Vuelve a probar el health check

---

### GitHub Actions falla con "Error: Unauthorized"

**Causa**: El token `SUPABASE_ACCESS_TOKEN` es inválido o no existe

**Solución**:
1. Genera un nuevo token en: https://supabase.com/dashboard/account/tokens
2. Actualiza el secret en GitHub
3. Re-ejecuta el workflow

---

### La función se despliega pero no responde

**Causa**: Error en el código del servidor

**Solución**:
1. Revisa los logs: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/logs/edge-functions-logs
2. Busca errores en rojo
3. Si ves errores, repórtalos para corregir el código

---

## 📊 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────┐
│ 1. Verificar SUPABASE_ACCESS_TOKEN en GitHub           │
└───────────────────┬─────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Hacer push → GitHub Actions despliega `server`      │
└───────────────────┬─────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Verificar health check                               │
│    https://...supabase.co/functions/v1/server/health    │
└───────────────────┬─────────────────────────────────────┘
                    ↓
              ¿Funciona?
                /    \
               Sí    No
               ↓      ↓
    ┌──────────────────────┐  ┌────────────────────────┐
    │ 4. Salir del modo    │  │ Troubleshooting:       │
    │    offline           │  │ - Ver logs             │
    │                      │  │ - Redesplegar          │
    │ localStorage.remove  │  │ - Verificar GitHub     │
    │ ('backend_offline..) │  └────────────────────────┘
    └──────────────────────┘
              ↓
    ┌──────────────────────┐
    │ 5. ✅ ¡Listo!        │
    │    Sistema conectado │
    └──────────────────────┘
```

---

## 🎯 Resumen Ultra-Rápido

```bash
# 1. Verifica el secret en GitHub
https://github.com/TU_USUARIO/TU_REPO/settings/secrets/actions
# Debe existir: SUPABASE_ACCESS_TOKEN

# 2. Los cambios en el código ya se hicieron → Push automático → GitHub Actions despliega

# 3. Espera 2-3 minutos

# 4. Verifica health check
https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/server/health

# 5. Si responde OK → Sal del modo offline
localStorage.removeItem('backend_offline_mode');
location.reload();

# 6. ✅ Listo
```

---

## 💡 Información Adicional

### ¿Qué cambié en el código?

Actualicé `/workflows/deploy-supabase.yml` para desplegar la función correcta (`server` en lugar de `make-server-4909a0bc`).

### ¿Por qué hay 2 carpetas de funciones?

Tienes:
- `/supabase/functions/server/` ← **La correcta**
- `/supabase/functions/make-server-4909a0bc/` ← Duplicado/legacy

El workflow ahora despliega la correcta.

### ¿Necesito hacer algo más con las variables de entorno?

**NO.** Las variables `SUPABASE_URL`, `SUPABASE_ANON_KEY`, y `SUPABASE_SERVICE_ROLE_KEY` están automáticamente disponibles en todas las Edge Functions de Supabase.

---

## ✅ Checklist Final

- [ ] Secret `SUPABASE_ACCESS_TOKEN` existe en GitHub
- [ ] Workflow de GitHub Actions ejecutado exitosamente
- [ ] Health check responde con `"configured": true`
- [ ] Modo offline desactivado
- [ ] Login funcional
- [ ] Datos se guardan en Supabase

---

## 🆘 ¿Necesitas Ayuda?

Si algo no funciona, necesito que me proporciones:

1. **Resultado del health check** (copia la respuesta completa)
2. **Estado de GitHub Actions** (¿hay algún error?)
3. **Logs de Supabase** (si hay errores en el health check)

Con esa información, puedo darte una solución específica.

---

## 🎉 Siguiente Paso

**Ahora mismo**: 
1. Verifica si existe `SUPABASE_ACCESS_TOKEN` en GitHub
2. Si no existe, créalo siguiendo el Paso 1
3. Espera que GitHub Actions despliegue (o haz un push manual)
4. Prueba el health check
5. ¡Sal del modo offline y disfruta la app! 🏊‍♂️
