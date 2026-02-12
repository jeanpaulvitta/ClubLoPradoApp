# 🚨 SOLUCIÓN INMEDIATA AL ERROR "Missing authorization header"

## ❌ PROBLEMA ACTUAL:
El servidor Edge Function en Supabase tiene código de ejemplo ("Hello {name}!") en lugar del código real.

## ✅ SOLUCIÓN:
Desplegar el código correcto. **HAY 2 FORMAS:**

---

# 🟢 OPCIÓN 1: VIA CLI (RECOMENDADO - 5 MINUTOS)

Despliega TODO el código completo (1777 líneas, todas las funcionalidades).

## PASO 1: Instalar CLI

### Si tienes Mac:
```bash
brew install supabase/tap/supabase
```

### Si tienes Windows:
1. Descarga: https://github.com/supabase/cli/releases/latest/download/supabase_windows_amd64.msi
2. Doble clic → Instalar
3. Abre una nueva terminal PowerShell

### Si tienes Linux:
```bash
brew install supabase/tap/supabase
```

---

## PASO 2: Abrir terminal en la carpeta del proyecto

**CRÍTICO:** Debes estar en la carpeta raíz de tu proyecto (donde está `/src`, `/supabase`, etc.)

```bash
cd [ruta-completa-a-tu-proyecto]
```

**Ejemplo Mac:**
```bash
cd ~/Documents/club-natacion-lo-prado
```

**Ejemplo Windows:**
```bash
cd C:\Users\TuNombre\Documents\club-natacion-lo-prado
```

---

## PASO 3: Ejecutar estos 3 comandos

### 3.1 Login a Supabase:
```bash
supabase login
```
*(Se abrirá el navegador - haz login con tu cuenta de Supabase)*

### 3.2 Conectar tu proyecto:
```bash
supabase link --project-ref vrclozhgaacehojbnpuo
```

### 3.3 Desplegar el código:
```bash
supabase functions deploy make-server-4909a0bc
```

**Espera 30-60 segundos hasta que veas:**
```
✅ Deployed Function make-server-4909a0bc
```

---

## PASO 4: Configurar variables de entorno

1. Ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/settings/api

2. Copia estas 3 claves:
   - **Project URL:** Debe ser `https://vrclozhgaacehojbnpuo.supabase.co`
   - **anon public:** Empieza con `eyJhbGciOi...` (un JWT muy largo)
   - **service_role:** Empieza con `eyJhbGciOi...` (otro JWT muy largo, DIFERENTE al anon)

3. Ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions/make-server-4909a0bc

4. Click en pestaña **"Secrets"** (o "Settings")

5. Agrega estas 3 variables:
   ```
   SUPABASE_URL = https://vrclozhgaacehojbnpuo.supabase.co
   SUPABASE_ANON_KEY = [pega el anon key completo]
   SUPABASE_SERVICE_ROLE_KEY = [pega el service_role key completo]
   ```

6. **Guarda** y espera 10 segundos

---

## PASO 5: Verificar

1. Abre tu app
2. Ve a **Análisis** → **Diagnóstico**
3. Click en **"Ejecutar Diagnóstico Completo"**

Deberías ver:
```
✅ Health Check - OK
✅ Signup Test - OK
✅ Swimmers API - OK
```

---

# 🟡 OPCIÓN 2: VIA EDITOR (ALTERNATIVA - SOLO AUTENTICACIÓN)

**⚠️ IMPORTANTE:** Esta opción solo despliega las rutas de autenticación. Te faltarán nadadores, competencias, entrenamientos, etc.

## PASO 1: Copiar código

1. Ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions/make-server-4909a0bc

2. Click en **"Edit Function"** o el botón de editar

3. **BORRA TODO** el contenido actual

4. Abre el archivo `/supabase/functions/make-server-4909a0bc/index.tsx` en tu proyecto local

5. **COPIA TODO** el contenido (líneas 1-471)

6. **PEGA** en el editor de Supabase

7. Click **"Deploy"** o **"Save"**

---

## PASO 2: Configurar variables de entorno

*(Mismo proceso que Opción 1 - Paso 4)*

---

## PASO 3: Verificar

*(Mismo proceso que Opción 1 - Paso 5)*

**NOTA:** Solo funcionará autenticación. Para nadadores, competencias, etc., necesitas usar la OPCIÓN 1 (CLI).

---

# 🔍 SI SIGUES CON ERRORES

## Error: "supabase: command not found"
- Cierra la terminal y abre una nueva
- Verifica instalación: `supabase --version`

## Error: "Invalid project ref"
- Verifica que estás usando: `vrclozhgaacehojbnpuo`
- Verifica que estás logueado: `supabase login`

## Error: "Missing environment variables"
- Verifica que agregaste las 3 variables en Supabase Dashboard → Functions → Secrets
- Espera 10-20 segundos después de guardar
- Recarga la página de tu app

## Error: "Function not found" en el diagnóstico
- El servidor se desplegó pero las variables de entorno faltan
- Ve a Paso 4 y configura las variables

---

# ✅ RESULTADO ESPERADO

Después de desplegar correctamente:

1. **Health Check:** 200 OK con version "2.0.6-inline"
2. **Signup Test:** Usuario creado exitosamente
3. **Login:** Funciona con admin@loprado.cl
4. **Nadadores:** Carga la lista
5. **Competencias:** Funciona
6. **Entrenamientos:** Funciona

---

# 📞 ¿NECESITAS AYUDA?

Dime:
1. ¿Qué sistema operativo tienes? (Mac/Windows/Linux)
2. ¿En qué paso estás?
3. ¿Qué error exacto te aparece?

Te guiaré paso a paso. 🚀
