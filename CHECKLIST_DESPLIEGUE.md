# ✅ CHECKLIST DE DESPLIEGUE

Usa esta lista para verificar cada paso del despliegue.

---

## 📋 ANTES DE EMPEZAR

- [ ] Tengo acceso al proyecto en Supabase Dashboard
- [ ] Puedo abrir una terminal/línea de comandos
- [ ] Sé dónde está la carpeta de mi proyecto en mi computadora

---

## 🔧 PASO 1: INSTALAR CLI (2 minutos)

**Mac:**
- [ ] Abrir Terminal
- [ ] Ejecutar: `brew install supabase/tap/supabase`
- [ ] Verificar: `supabase --version` (debe mostrar la versión)

**Windows:**
- [ ] Descargar: https://github.com/supabase/cli/releases/latest/download/supabase_windows_amd64.msi
- [ ] Hacer doble clic en el archivo descargado
- [ ] Seguir el instalador (Next → Next → Install)
- [ ] Abrir una NUEVA terminal PowerShell
- [ ] Verificar: `supabase --version` (debe mostrar la versión)

**Linux:**
- [ ] Abrir Terminal
- [ ] Ejecutar: `brew install supabase/tap/supabase`
- [ ] Verificar: `supabase --version` (debe mostrar la versión)

---

## 🚀 PASO 2: DESPLEGAR CÓDIGO (3 minutos)

### 2.1 Navegar a la carpeta del proyecto
- [ ] Abrir terminal
- [ ] Ejecutar: `cd [ruta-a-tu-proyecto]`
  
  **Ejemplos:**
  - Mac: `cd ~/Documents/club-natacion-lo-prado`
  - Windows: `cd C:\Users\TuNombre\Documents\club-natacion-lo-prado`

- [ ] Verificar que estás en la carpeta correcta:
  - Mac/Linux: `ls` (debe mostrar carpetas como `src`, `supabase`, etc.)
  - Windows: `dir` (debe mostrar carpetas como `src`, `supabase`, etc.)

### 2.2 Login a Supabase
- [ ] Ejecutar: `supabase login`
- [ ] Se abre el navegador automáticamente
- [ ] Iniciar sesión con tu cuenta de Supabase
- [ ] Ver mensaje de confirmación en la terminal
- [ ] Regresar a la terminal

### 2.3 Conectar proyecto
- [ ] Ejecutar: `supabase link --project-ref vrclozhgaacehojbnpuo`
- [ ] Ver mensaje: "Linked project"
- [ ] No hay errores

### 2.4 Desplegar función
- [ ] Ejecutar: `supabase functions deploy make-server-4909a0bc`
- [ ] Esperar 30-60 segundos
- [ ] Ver mensaje: "✅ Deployed Function make-server-4909a0bc"
- [ ] No hay errores

---

## 🔐 PASO 3: CONFIGURAR VARIABLES (2 minutos)

### 3.1 Obtener las claves
- [ ] Ir a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/settings/api
- [ ] Copiar **Project URL** (ejemplo: `https://vrclozhgaacehojbnpuo.supabase.co`)
- [ ] Copiar **anon public key** (empieza con `eyJhbGciOi...`, es muy largo)
- [ ] Copiar **service_role key** (también empieza con `eyJhbGciOi...`, es diferente al anon)

### 3.2 Configurar en Edge Function
- [ ] Ir a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions/make-server-4909a0bc
- [ ] Click en pestaña **"Secrets"** (o "Settings" → "Secrets")
- [ ] Agregar primera variable:
  - Nombre: `SUPABASE_URL`
  - Valor: [pegar la Project URL]
  - [ ] Click "Add Secret" o "Save"
  
- [ ] Agregar segunda variable:
  - Nombre: `SUPABASE_ANON_KEY`
  - Valor: [pegar el anon public key completo]
  - [ ] Click "Add Secret" o "Save"
  
- [ ] Agregar tercera variable:
  - Nombre: `SUPABASE_SERVICE_ROLE_KEY`
  - Valor: [pegar el service_role key completo]
  - [ ] Click "Add Secret" o "Save"

- [ ] Verificar que las 3 variables aparecen en la lista
- [ ] Esperar 10 segundos

---

## ✅ PASO 4: VERIFICAR (1 minuto)

### 4.1 Abrir la aplicación
- [ ] Recargar la página de tu aplicación (F5)
- [ ] Ir a pestaña **"Análisis"**
- [ ] Hacer scroll hasta encontrar **"Diagnóstico de Supabase"**

### 4.2 Ejecutar diagnóstico
- [ ] Click en botón **"Ejecutar Tests"**
- [ ] Esperar 10-15 segundos
- [ ] Verificar resultados:
  - [ ] ✅ **1. Conexión API** - OK
  - [ ] ✅ **2. Edge Function Health** - OK
  - [ ] ✅ **3. Test de Registro** - OK

### 4.3 Verificar funcionalidades
- [ ] Ir a pestaña **"Nadadores"**
- [ ] La lista carga sin errores
- [ ] Ir a pestaña **"Competencias"**
- [ ] La lista carga sin errores
- [ ] Ir a pestaña **"Entrenamientos"**
- [ ] Los entrenamientos cargan sin errores

---

## 🎉 RESULTADO ESPERADO

Si TODO está ✅:

1. No hay errores en la consola del navegador
2. Los 3 tests del diagnóstico están en verde
3. Todas las pestañas cargan datos correctamente
4. Puedes agregar nadadores, competencias, etc.

**¡FELICIDADES! El sistema está desplegado correctamente.** 🎊

---

## ❌ SI ALGO FALLÓ

### Error: "supabase: command not found"
- Cerrar la terminal y abrir una nueva
- Verificar instalación: `supabase --version`
- Si sigue fallando, reinstalar CLI

### Error: "Invalid project ref"
- Verificar que usas: `vrclozhgaacehojbnpuo` (sin espacios)
- Verificar que hiciste login: `supabase login`

### Error en diagnóstico: "Missing authorization header"
- Las variables de entorno NO están configuradas o faltan
- Volver a Paso 3 y verificar las 3 variables
- Esperar 20 segundos y volver a probar

### Error en diagnóstico: "Health check failed"
- La función no se desplegó correctamente
- Volver a Paso 2.4 y ejecutar: `supabase functions deploy make-server-4909a0bc`

### Error: "Permission denied"
- No tienes permisos en el proyecto de Supabase
- Verificar que estás logueado con la cuenta correcta

---

## 📞 AYUDA ADICIONAL

Si ninguna solución funciona:

1. Abre la consola del navegador (F12)
2. Copia todos los errores que veas (en rojo)
3. Ve a la pestaña "Network" y verifica qué peticiones fallan
4. Reporta los errores exactos

---

**Fecha de última actualización:** 2026-02-10
**Versión del servidor:** 2.0.6-inline
