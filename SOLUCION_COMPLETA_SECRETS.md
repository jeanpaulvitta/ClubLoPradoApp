# ✅ Solución Completa - Error de Secrets de Supabase

---

## 🎯 Problema Identificado

**Error al intentar crear secrets:**
```
❌ Name must not start with the SUPABASE_ prefix
```

---

## ✅ Explicación

**Supabase proporciona automáticamente** las siguientes variables de entorno en **TODAS** las Edge Functions:

- `SUPABASE_URL` ✅ Automática
- `SUPABASE_ANON_KEY` ✅ Automática  
- `SUPABASE_SERVICE_ROLE_KEY` ✅ Automática
- `SUPABASE_DB_URL` ✅ Automática (si usas Postgres)

**NO necesitas (ni puedes) crearlas manualmente como secrets.**

Por eso el dashboard te impide crear secrets con prefijo `SUPABASE_`.

---

## 🚀 Solución Implementada

He corregido y preparado todo:

### ✅ 1. Error de importación corregido
- **Archivo**: `/src/app/App.tsx` línea 88
- **Cambio**: Ruta incorrecta `../../../utils/supabase/info` → ruta correcta `/utils/supabase/info`
- **Estado**: ✅ Corregido

### ✅ 2. GitHub Actions actualizado
- **Archivo**: `/workflows/deploy-supabase.yml`
- **Cambio**: Despliega `server` (correcto) en lugar de `make-server-4909a0bc` (legacy)
- **Estado**: ✅ Actualizado

### ✅ 3. Documentación creada
- ✅ `/SUPABASE_SECRETS_AUTOMATICOS.md` - Explicación de secrets automáticos
- ✅ `/COMO_CONECTAR_SERVIDOR_AHORA.md` - Guía completa paso a paso
- ✅ `/SCRIPT_VERIFICACION_RAPIDA.md` - Scripts para diagnosticar en consola
- ✅ `/VALORES_EDGE_FUNCTIONS_SECRETS.md` - Referencia (ahora obsoleto, pero útil)
- ✅ `/SOLUCION_COMPLETA_SECRETS.md` - Este documento

---

## 🎯 Lo Que Debes Hacer AHORA

### Paso 1: Verificar GitHub Actions Secret

**Necesitas un solo secret en GitHub** para que GitHub Actions pueda desplegar:

1. Ve a: https://github.com/[TU_USUARIO]/[TU_REPO]/settings/secrets/actions

2. Verifica si existe: `SUPABASE_ACCESS_TOKEN`
   - **SI existe** ✅ → Continúa al Paso 2
   - **NO existe** ❌ → Créalo:

#### Cómo crear SUPABASE_ACCESS_TOKEN:

**En Supabase:**
1. Ve a: https://supabase.com/dashboard/account/tokens
2. Click **"Generate New Token"**
3. Name: `GitHub Actions Deploy`
4. Scopes: **"All"** o **"Functions: Write"**
5. Click **"Generate Token"**
6. **COPIA EL TOKEN** (se muestra solo una vez)

**En GitHub:**
1. Ve a: https://github.com/[TU_USUARIO]/[TU_REPO]/settings/secrets/actions
2. Click **"New repository secret"**
3. Name: `SUPABASE_ACCESS_TOKEN`
4. Value: [PEGA EL TOKEN]
5. Click **"Add secret"**

---

### Paso 2: Desplegar la Edge Function

Como trabajas completamente online (Figma Make → GitHub → Supabase):

1. **Los cambios ya están hechos** en el código
2. **Se sincronizarán automáticamente** con GitHub (Figma Make lo hace)
3. **GitHub Actions detectará el cambio** y desplegará automáticamente
4. **Espera 2-3 minutos**

#### Verificar el despliegue:
```
https://github.com/[TU_USUARIO]/[TU_REPO]/actions
```

Busca el workflow **"Deploy to Supabase"** - debe tener un ✅ verde.

---

### Paso 3: Verificar Health Check

Abre en tu navegador:
```
https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/server/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2026-03-09T...",
  "configured": true
}
```

**Si ves 404** → Espera un poco más o revisa GitHub Actions

**Si ves error 503** → Revisa logs de Supabase:
```
https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/logs/edge-functions-logs
```

---

### Paso 4: Salir del Modo Offline

Una vez que el health check responda correctamente:

#### Opción A: Desde la consola (F12)
```javascript
localStorage.removeItem('backend_offline_mode');
location.reload();
```

#### Opción B: Desde la interfaz
1. Click en el banner amarillo → **"🔄 Verificar Servidor y Salir"**
2. O desde login → **"🔧 Diagnóstico del Sistema"** → **"Verificar"**

---

### Paso 5: ¡Listo! Verificar que funciona

- [ ] ✅ NO aparece banner amarillo
- [ ] ✅ Puedes hacer login
- [ ] ✅ Ves la lista de nadadores
- [ ] ✅ Los cambios se guardan

---

## 🔍 Script de Verificación Rápida

Abre la consola del navegador (F12) y pega:

```javascript
// Verificación completa
const check = async () => {
  console.log('🔍 Verificando sistema...\n');
  
  // 1. Modo offline
  const offline = localStorage.getItem('backend_offline_mode');
  console.log('1. Modo offline:', offline ? '⚠️ ACTIVADO' : '✅ Desactivado');
  
  // 2. Servidor
  try {
    const r = await fetch('https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/server/health');
    const data = await r.json();
    console.log('2. Servidor:', data.status === 'ok' ? '✅ Funcionando' : '❌ Error');
    console.log('   Configurado:', data.configured ? '✅ Sí' : '❌ No');
  } catch (e) {
    console.log('2. Servidor: ❌ No responde -', e.message);
  }
  
  // 3. Autenticación
  const hasToken = !!localStorage.getItem('authToken');
  console.log('3. Autenticado:', hasToken ? '✅ Sí' : '❌ No');
  
  // Resumen
  console.log('\n📊 RESUMEN:');
  if (!offline && hasToken) {
    console.log('   🎉 TODO BIEN - Sistema funcionando');
  } else if (offline) {
    console.log('   🔧 Sal del modo offline primero');
  } else {
    console.log('   🔑 Inicia sesión');
  }
};

check();
```

---

## 📊 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                  FIGMA MAKE                         │
│          (Editor de código online)                  │
└────────────────────┬────────────────────────────────┘
                     │ Sincronización automática
                     ↓
┌─────────────────────────────────────────────────────┐
│                    GITHUB                           │
│              (Repositorio de código)                │
│                                                     │
│  Secrets:                                           │
│  - SUPABASE_ACCESS_TOKEN (NECESARIO) ←─────┐       │
└────────────────────┬────────────────────────│───────┘
                     │                        │
                     │ GitHub Actions         │
                     │ (Workflow automático)  │
                     ↓                        │
┌─────────────────────────────────────────────│───────┐
│                  SUPABASE                   │       │
│           (Backend + Database)              │       │
│                                             │       │
│  Edge Functions:                            │       │
│  - server/ (desplegada por GitHub Actions) ←┘       │
│                                                     │
│  Variables automáticas (NO crear):                  │
│  - SUPABASE_URL                                     │
│  - SUPABASE_ANON_KEY                                │
│  - SUPABASE_SERVICE_ROLE_KEY                        │
│  - SUPABASE_DB_URL                                  │
└────────────────────┬────────────────────────────────┘
                     │
                     │ API Calls
                     ↓
┌─────────────────────────────────────────────────────┐
│                    VERCEL                           │
│          (Hosting del frontend)                     │
│                                                     │
│  Frontend React + PWA                               │
└─────────────────────────────────────────────────────┘
```

---

## ⚙️ Variables de Entorno - Resumen

### ❌ NO Crear en Supabase Edge Functions Secrets:
- ~~`SUPABASE_URL`~~ → Automática ✅
- ~~`SUPABASE_ANON_KEY`~~ → Automática ✅
- ~~`SUPABASE_SERVICE_ROLE_KEY`~~ → Automática ✅
- ~~`SUPABASE_DB_URL`~~ → Automática ✅

### ✅ SÍ Crear en GitHub Secrets:
- `SUPABASE_ACCESS_TOKEN` → Para GitHub Actions (despliegue)

### 📝 Disponibles en el código frontend:
- `projectId` → En `/utils/supabase/info.tsx`
- `publicAnonKey` → En `/utils/supabase/info.tsx`

---

## 🚨 Errores Comunes y Soluciones

### "Name must not start with the SUPABASE_ prefix"
✅ **Normal** - No necesitas crear esas variables, ya existen automáticamente

### "404 Not Found" en health check
❌ La función no está desplegada  
✅ Verifica GitHub Actions o redespliega manualmente

### "configured: false" en health check
❌ Variables no disponibles (raro)  
✅ Redespliega la función y espera 2-3 minutos

### "Unauthorized" en GitHub Actions
❌ Falta o es inválido `SUPABASE_ACCESS_TOKEN`  
✅ Genera nuevo token y actualiza el secret en GitHub

---

## 📚 Documentación Relacionada

| Documento | Para Qué |
|-----------|----------|
| `/COMO_CONECTAR_SERVIDOR_AHORA.md` | Guía completa paso a paso |
| `/SCRIPT_VERIFICACION_RAPIDA.md` | Scripts de diagnóstico |
| `/SUPABASE_SECRETS_AUTOMATICOS.md` | Explicación de secrets |
| `/README_SALIR_MODO_OFFLINE.md` | Cómo salir del modo offline |
| `/SIGUIENTE_PASO_AHORA.md` | Próximos pasos |

---

## ✅ Checklist Final

### Pre-requisitos:
- [ ] GitHub tiene el secret `SUPABASE_ACCESS_TOKEN`
- [ ] El código se sincronizó desde Figma Make a GitHub
- [ ] GitHub Actions ejecutó el workflow exitosamente

### Verificación:
- [ ] Health check responde con `"status": "ok"`
- [ ] Health check responde con `"configured": true`
- [ ] No aparece el banner amarillo en la app

### Funcionalidad:
- [ ] Login funciona
- [ ] Se pueden ver nadadores
- [ ] Se pueden crear/editar nadadores
- [ ] Los cambios se guardan en Supabase

---

## 🎯 Resumen Ultra-Corto

1. **NO crees** secrets con `SUPABASE_` → Ya existen automáticamente
2. **SÍ crea** `SUPABASE_ACCESS_TOKEN` en GitHub Secrets
3. **Espera** que GitHub Actions despliegue la función
4. **Verifica** el health check
5. **Sal** del modo offline
6. **¡Listo!** 🎉

---

## 🆘 Si Necesitas Ayuda

Ejecuta el script de verificación y comparte los resultados:

```javascript
// Copia esto en la consola
fetch('https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/server/health')
  .then(r => r.json())
  .then(d => console.log('Resultado:', JSON.stringify(d, null, 2)))
  .catch(e => console.log('Error:', e.message));
```

Con esa información puedo darte una solución específica.

---

## 🎉 ¡Todo Listo!

Los archivos están corregidos, la documentación está completa, y el sistema está listo para conectarse.

**Siguiente paso**: Verifica que GitHub tenga el secret `SUPABASE_ACCESS_TOKEN` y espera a que GitHub Actions despliegue la función.

¡Éxito! 🏊‍♂️🏊‍♀️
