# 🧪 Test del Health Check

## 🎯 Prueba Rápida

Abre este enlace en tu navegador:

```
https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health
```

---

## ✅ Respuestas Posibles

### 1️⃣ TODO BIEN ✅ (Configurado correctamente)

```json
{
  "status": "ok",
  "configured": true,
  "message": "✅ All environment variables configured correctly"
}
```

**Significado:**
- ✅ La función está desplegada
- ✅ Las variables están configuradas
- ✅ Las keys son CORRECTAS
- ✅ El sistema funcionará

**Siguiente paso:** Regresa a tu app y prueba aprobar una solicitud.

---

### 2️⃣ VARIABLES NO CONFIGURADAS ⚠️

```json
{
  "status": "misconfigured",
  "configured": false,
  "message": "Environment variables are not configured",
  "missing": ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"]
}
```

**Significado:**
- ✅ La función está desplegada
- ❌ Las variables NO están configuradas
- ❌ O las agregaste pero NO hiciste REDEPLOY

**Solución:**
1. Ve a: Edge Functions → make-server-4909a0bc → Settings → Secrets
2. Verifica que las 3 variables estén ahí
3. Si NO están, agrégalas (ver /CONFIGURAR_VARIABLES_ENTORNO.md)
4. Si SÍ están, haz **REDEPLOY**
5. Espera 1-2 minutos
6. Prueba de nuevo

---

### 3️⃣ ERROR 401 ❌

```
No se puede acceder a este sitio web
```
o
```
Unauthorized
```

**Significado:**
- ✅ La función está desplegada
- ❌ Las variables están configuradas PERO con valores INCORRECTOS
- ❌ Las keys que pusiste NO son las reales

**Solución:**
1. **BORRA las variables actuales**
2. Ve a: **Settings** ⚙️ → **API** → **Project API keys**
3. Copia las keys haciendo click en **"Copy"** 📋
4. Las keys DEBEN empezar con `eyJ` y tener ~300 caracteres
5. Agrega las variables de nuevo
6. **REDEPLOY**
7. Espera 1-2 minutos
8. Prueba de nuevo

Ver guía completa: **/DIAGNOSTICO_ERROR_401.md**

---

### 4️⃣ ERROR 404 ❌

```
{
  "message": "Function not found"
}
```

**Significado:**
- ❌ La función NO está desplegada
- ❌ O el nombre es incorrecto

**Solución:**
1. Ve a: **Edge Functions** en Supabase Dashboard
2. Verifica que exista una función llamada `make-server-4909a0bc`
3. Si NO existe, créala:
   - Click en **"New Edge Function"**
   - Name: `make-server-4909a0bc`
   - Copia el código de `/supabase/functions/server/index.tsx`
   - Click en **"Deploy"**
4. Si SÍ existe, verifica el status: debe ser **"Active"** (no "Failed")

---

### 5️⃣ ERROR 500 ❌

```
{
  "error": "Internal Server Error"
}
```

**Significado:**
- ✅ La función está desplegada
- ❌ Hay un error en el código
- ❌ O las variables tienen valores inválidos

**Solución:**
1. Ve a: Edge Functions → make-server-4909a0bc → **Logs**
2. Busca errores en rojo
3. Posibles causas:
   - Las keys son incorrectas (no empiezan con `eyJ`)
   - Las keys están truncadas o tienen espacios
   - La SUPABASE_URL está mal
4. Borra las variables y agrégalas de nuevo CORRECTAMENTE
5. **REDEPLOY**

---

### 6️⃣ TIMEOUT / NO RESPONDE ⏱️

```
(No carga nada, timeout, o error de red)
```

**Significado:**
- ❌ La función NO está desplegada
- ❌ O hay un problema de red
- ❌ O la función está en estado "Failed"

**Solución:**
1. Ve a: Edge Functions → make-server-4909a0bc
2. Verifica el status:
   - **"Active"** ✅ → Debería funcionar
   - **"Failed"** ❌ → Mira los logs, hay un error en el código
   - **"Building"** ⏱️ → Espera 1 minuto
3. Si está "Failed", haz **REDEPLOY**
4. Si sigue fallando, verifica que el código en `index.tsx` sea correcto

---

## 🧪 Test Alternativo (Consola del Navegador)

Si prefieres, abre la consola del navegador (F12) y pega este código:

```javascript
console.log('🧪 Testeando health check...');

fetch('https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health')
  .then(response => {
    console.log('📡 Status:', response.status);
    console.log('📡 Status Text:', response.statusText);
    console.log('📡 OK:', response.ok);
    return response.json();
  })
  .then(data => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ RESPUESTA DEL SERVIDOR:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(JSON.stringify(data, null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (data.status === 'ok' && data.configured === true) {
      console.log('✅✅✅ SERVIDOR CONFIGURADO CORRECTAMENTE ✅✅✅');
      console.log('El sistema está listo para crear usuarios.');
    } else if (data.status === 'misconfigured') {
      console.error('❌ VARIABLES NO CONFIGURADAS');
      console.error('Missing:', data.missing);
      console.error('Solución: Agrega las variables y haz REDEPLOY');
    } else {
      console.warn('⚠️ Respuesta inesperada:', data);
    }
  })
  .catch(error => {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ERROR AL CONECTAR CON EL SERVIDOR');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Detalles:', error);
    console.error('');
    console.error('Posibles causas:');
    console.error('1. La función NO está desplegada');
    console.error('2. Error de red (CORS, timeout, etc)');
    console.error('3. El status de la función es "Failed"');
  });
```

**Copia TODO el código de arriba, pégalo en la consola y presiona Enter.**

---

## 📋 Checklist de Interpretación

| Respuesta | Status | Significado | Acción |
|-----------|--------|-------------|--------|
| `"status": "ok"` | ✅ | Todo bien | Usar el sistema |
| `"status": "misconfigured"` | ⚠️ | Variables no configuradas | Agregar variables + REDEPLOY |
| Error 401 | ❌ | Keys incorrectas | Copiar keys correctas |
| Error 404 | ❌ | Función no existe | Desplegar función |
| Error 500 | ❌ | Error en el código | Ver logs |
| Timeout | ❌ | No responde | Verificar status |

---

## 🎯 Resultado Esperado (Cuando Todo Funciona)

Cuando abras el enlace del health check y TODO esté bien, verás:

```json
{
  "status": "ok",
  "configured": true,
  "message": "✅ All environment variables configured correctly"
}
```

Y en tu app, cuando recargues la página y vayas a "Usuarios", verás en la consola:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SERVIDOR CONFIGURADO CORRECTAMENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El sistema de creación de usuarios está listo para usarse.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

🚀 **Prueba el health check y dime qué respuesta obtuviste!** 🚀
