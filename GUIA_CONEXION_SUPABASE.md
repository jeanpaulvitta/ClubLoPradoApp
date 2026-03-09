# 🚀 Guía de Conexión a Supabase Edge Functions

## ✨ **Estado Actual**
Tu aplicación del Club Natación Lo Prado tiene un sistema inteligente de **modo offline** que te permite:
- ✅ Iniciar sesión automáticamente como admin (`admin@loprado.cl`)
- ✅ Ver la aplicación funcionando con datos locales
- ✅ Explorar todas las pestañas y funcionalidades
- ⚠️ **PERO NO** guardar datos ni crear usuarios reales

---

## 🎯 **¿Qué significa "Conectar a Supabase"?**

Para que tu aplicación tenga funcionalidad completa (crear nadadores, guardar asistencias, etc.), necesitas:

1. **Desplegar el servidor backend** (Edge Function) en Supabase
2. **Configurar 3 variables de entorno** en Supabase Dashboard
3. **Redesplegar** la función para aplicar los cambios

---

## 📋 **Paso a Paso - Configuración Completa**

### **PASO 1: Verificar Despliegue de Edge Function**

1. Ve a tu proyecto de Supabase:
   ```
   https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo
   ```

2. En el menú lateral, haz clic en **"Edge Functions"**

3. **Verifica que exista una función llamada "server"**:
   - Si NO existe → necesitas desplegarla primero
   - Si existe → verifica que tenga estado **"Active" (verde)**

4. **Si NO está desplegada**, tienes 2 opciones:

   **Opción A: Desde GitHub (Recomendada)**
   - Si tu código está en GitHub, puedes configurar CI/CD automático
   - Ve a: Settings → Integrations → GitHub
   - Conecta tu repositorio
   
   **Opción B: Desde CLI local**
   ```bash
   # Instalar Supabase CLI
   npm install -g supabase
   
   # Login
   supabase login
   
   # Link al proyecto
   supabase link --project-ref vrclozhgaacehojbnpuo
   
   # Desplegar la función
   supabase functions deploy server --project-ref vrclozhgaacehojbnpuo
   ```

---

### **PASO 2: Configurar Variables de Entorno**

Las Edge Functions en Supabase necesitan estas 3 variables:

1. **Ve a la función "server"**:
   ```
   https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions/server
   ```

2. **Haz clic en "Settings" o "Environment Variables"**

3. **Agrega estas 3 variables** (una por una):

   #### **Variable 1: SUPABASE_URL**
   ```
   Nombre: SUPABASE_URL
   Valor:  https://vrclozhgaacehojbnpuo.supabase.co
   ```
   ✅ Haz clic en **"Copy"** desde el botón en el banner naranja de la app

   ---

   #### **Variable 2: SUPABASE_ANON_KEY**
   ```
   Nombre: SUPABASE_ANON_KEY
   Valor:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyY2xvemhnYWFjZWhvamJucHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MDc1OTEsImV4cCI6MjA4NTk4MzU5MX0.efL3mUq8zFgaqAY92FWiwGTBxlPmzkVq9kDjVXbjeVQ
   ```
   ✅ También puedes copiarla desde el banner naranja

   ---

   #### **Variable 3: SUPABASE_SERVICE_ROLE_KEY** ⚠️ SECRETO
   ```
   Nombre: SUPABASE_SERVICE_ROLE_KEY
   Valor:  [Obtener desde Dashboard]
   ```
   
   **¿Cómo obtener la SERVICE_ROLE_KEY?**
   
   a. Ve a: Settings → API
      ```
      https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/settings/api
      ```
   
   b. Busca la sección **"Project API keys"**
   
   c. Encuentra **"service_role"** (tiene un candado 🔒)
   
   d. Haz clic en **"Reveal"** para ver la key
   
   e. **Copia la key completa** (empieza con `eyJ...`)
   
   f. Pégala como valor de `SUPABASE_SERVICE_ROLE_KEY`
   
   ⚠️ **MUY IMPORTANTE**: Esta key es **SECRETA**. NUNCA la compartas públicamente ni la subas a GitHub.

---

### **PASO 3: Redesplegar la Función**

Después de configurar las 3 variables de entorno:

1. **Ve a la función "server"**:
   ```
   https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions/server
   ```

2. **Haz clic en el botón "Deploy" o "Redeploy"**

3. **Espera 1-2 minutos** a que el despliegue termine

4. Verifica que aparezca **"Active"** en verde

---

### **PASO 4: Verificar Conexión**

1. **Regresa a tu aplicación** en el navegador

2. **Haz clic en "Verificar"** en el banner naranja

3. **Si todo está correcto**, verás:
   ```
   ✅ Configurado Correctamente
   El servidor está funcionando perfectamente
   ```

4. **Si sigue fallando**, verifica:
   - ✅ Las 3 variables están escritas **exactamente** como se indica
   - ✅ La función se redesplego **después** de agregar las variables
   - ✅ No hay espacios extras al copiar/pegar las keys
   - ✅ La SERVICE_ROLE_KEY es la correcta (la que tiene 🔒)

---

### **PASO 5: Salir del Modo Offline**

Una vez que el servidor esté configurado:

1. **Haz clic en el botón amarillo**:
   ```
   "Ya Configuré el Backend ✅"
   ```

2. La aplicación se recargará

3. El **banner amarillo desaparecerá**

4. Ahora puedes:
   - ✅ Crear nadadores reales
   - ✅ Registrar asistencias
   - ✅ Guardar marcas y entrenamientos
   - ✅ Crear usuarios (coach, nadador)

---

## 🔧 **Solución de Problemas**

### ❌ Error: "Missing authorization header"
**Causa**: Las variables de entorno NO están configuradas.

**Solución**:
1. Verifica que las 3 variables existan en la función
2. Verifica que NO contengan espacios extras
3. Redesplega la función

---

### ❌ Error: "Invalid JWT"
**Causa**: La `SUPABASE_SERVICE_ROLE_KEY` es incorrecta.

**Solución**:
1. Ve a Settings → API
2. Copia la key **"service_role"** (la que tiene 🔒)
3. **NO uses** la "anon" key aquí
4. Actualiza la variable
5. Redesplega la función

---

### ❌ Error: "Server not responding" / Timeout
**Causa**: La función NO está desplegada.

**Solución**:
1. Ve a Edge Functions
2. Verifica que "server" esté **Active** (verde)
3. Si no está, despliégala usando CLI o GitHub

---

### ❌ Banner amarillo no desaparece
**Causa**: El localStorage mantiene el flag de modo offline.

**Solución**:
1. Haz clic en "Ya Configuré el Backend ✅"
2. O manualmente:
   - Abre DevTools (F12)
   - Console → escribe: `localStorage.removeItem('backend_offline_mode')`
   - Recarga la página

---

## 📊 **Verificación Visual**

### ✅ **Servidor Configurado Correctamente**
Verás un banner **VERDE** con:
```
✅ Configurado Correctamente
El servidor está funcionando perfectamente
```

### ❌ **Servidor NO configurado**
Verás un banner **ROJO** con:
```
❌ Servidor NO configurado
Missing authorization header
```

### ⚠️ **Modo Offline Activo**
Verás un banner **AMARILLO** con:
```
⚠️ MODO OFFLINE ACTIVADO
La aplicación está funcionando con datos locales
```

---

## 🎓 **Resumen de Comandos CLI (Opcional)**

Si prefieres usar CLI local en lugar del Dashboard:

```bash
# 1. Instalar Supabase CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Link al proyecto
supabase link --project-ref vrclozhgaacehojbnpuo

# 4. Configurar secretos
supabase secrets set SUPABASE_URL=https://vrclozhgaacehojbnpuo.supabase.co
supabase secrets set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 5. Desplegar función
supabase functions deploy server --project-ref vrclozhgaacehojbnpuo
```

---

## 🌐 **Links Útiles**

- **Dashboard Principal**: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo
- **Edge Functions**: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions
- **API Keys**: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/settings/api
- **Función "server"**: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions/server

---

## ✨ **¿Necesitas Ayuda?**

1. **Lee los archivos de documentación**:
   - `/SOLUCION_MISSING_AUTHORIZATION_HEADER.md`
   - `/SOLUCION_INVALID_JWT.md`
   - `/INSTRUCCIONES_DESPLIEGUE_URGENTE.md`

2. **Revisa los logs en Supabase**:
   - Edge Functions → server → Logs
   - Aquí verás los errores específicos del servidor

3. **Usa el componente de diagnóstico**:
   - El banner naranja en la app tiene botones para copiar valores
   - Links directos al Supabase Dashboard

---

## 🎯 **Checklist Final**

Antes de considerar que está todo listo:

- [ ] ✅ Edge Function "server" desplegada y Active
- [ ] ✅ Variable `SUPABASE_URL` configurada
- [ ] ✅ Variable `SUPABASE_ANON_KEY` configurada
- [ ] ✅ Variable `SUPABASE_SERVICE_ROLE_KEY` configurada (la secreta con 🔒)
- [ ] ✅ Función redesplegada después de agregar variables
- [ ] ✅ Banner verde "✅ Configurado Correctamente" visible
- [ ] ✅ Banner amarillo de modo offline ELIMINADO
- [ ] ✅ Puedes crear nadadores sin errores
- [ ] ✅ Puedes registrar asistencias
- [ ] ✅ Los datos se guardan en Supabase

---

**¡Listo!** 🎉 Una vez completados todos los pasos, tu aplicación estará **100% funcional** con backend completo.

Si tienes dudas, el sistema te guiará visualmente con los banners de colores.
