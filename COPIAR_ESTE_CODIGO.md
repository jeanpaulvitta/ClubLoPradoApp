# 🚀 CÓDIGO LISTO PARA COPIAR - SIN CLI

## 📋 INSTRUCCIONES (5 MINUTOS):

### PASO 1: Crear tabla en base de datos

1. Ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/sql/new

2. Copia TODO el contenido del archivo `/CREATE_TABLE.sql`

3. Pégalo y haz clic en "RUN"

---

### PASO 2: Obtener claves API

1. Ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/settings/api

2. **COPIA** estas 3 claves:
   - **URL:** `https://vrclozhgaacehojbnpuo.supabase.co`
   - **anon public key:** (empieza con `eyJhbGci...`)
   - **service_role key:** (empieza con `eyJhbGci...`, está más abajo)

3. Guárdalas en un archivo temporal

---

### PASO 3: Desplegar el código

1. Ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions/make-server-4909a0bc

2. Haz clic en **"Edit Function"**

3. **ELIMINA TODO** el código actual (el "Hello {name}!")

4. Abre el archivo: `/supabase/functions/make-server-4909a0bc/index.tsx`

5. **COPIA TODO** el código de ese archivo

6. **PÉGALO** en el editor de Supabase

7. Haz clic en **"Deploy"**

---

### PASO 4: Configurar variables de entorno

1. En la misma página, busca la pestaña **"Secrets"** o **"Environment Variables"**

2. Agrega estas 3 variables (usa los valores que copiaste en el Paso 2):

   ```
   Nombre: SUPABASE_URL
   Valor: https://vrclozhgaacehojbnpuo.supabase.co
   ```

   ```
   Nombre: SUPABASE_ANON_KEY
   Valor: [pega el JWT anon que copiaste]
   ```

   ```
   Nombre: SUPABASE_SERVICE_ROLE_KEY
   Valor: [pega el JWT service_role que copiaste]
   ```

3. **Guarda**

4. Haz clic en **"Deploy"** o **"Redeploy"** nuevamente

---

### PASO 5: Verificar

1. Abre tu aplicación del Club Natación Lo Prado

2. Ejecuta el "Diagnóstico de Supabase"

3. Deberías ver:
   ✅ Health Check - OK
   ✅ Signup Test - OK

---

## ⚠️ NOTA IMPORTANTE

Este archivo incluye SOLO las rutas de autenticación para que funcione el registro.

Para tener TODAS las funcionalidades (nadadores, competencias, entrenamientos, etc.), necesitarás:
- Usar Supabase CLI
- O agregar las rutas manualmente una por una

Pero con esto ya NO verás el error "Missing authorization header" ✅

---

## ¿NECESITAS AYUDA?

Si hay errores, dime:
1. En qué paso estás
2. El error exacto que ves
3. Captura de pantalla

Y lo arreglamos INMEDIATAMENTE.

---

**El archivo está en:** `/supabase/functions/make-server-4909a0bc/index.tsx`

**¡CÓPIALO AHORA!** 🚀
