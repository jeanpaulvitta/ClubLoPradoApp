# 🚀 DESPLIEGUE DEL SERVIDOR EN 3 PASOS

## ⏱️ Tiempo total: 5 minutos

---

## 📋 PASO 1: Instalar Supabase CLI

### En Mac:
```bash
brew install supabase/tap/supabase
```

### En Windows:

**OPCIÓN A - Usando Scoop (Recomendado):**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**OPCIÓN B - Usando NPM:**
```bash
npm install -g supabase
```

**OPCIÓN C - Descarga manual:**
1. Ve a: https://github.com/supabase/cli/releases
2. Busca la última versión
3. Descarga: `supabase_windows_amd64.zip`
4. Descomprime y agrega la carpeta al PATH

### En Linux:
```bash
brew install supabase/tap/supabase
```

**O usando NPM (cualquier sistema):**
```bash
npm install -g supabase
```

---

## 📋 PASO 2: Abrir Terminal en la Carpeta del Proyecto

1. Abre Visual Studio Code (o tu editor)
2. Abre esta carpeta del proyecto
3. Abre la terminal integrada (Terminal → New Terminal)
4. Verifica que estás en la carpeta correcta: debe contener la carpeta `supabase/`

---

## 📋 PASO 3: Ejecutar 3 Comandos

### Comando 1: Login
```bash
supabase login
```
- Se abrirá el navegador
- Haz clic en "Allow Access"
- Vuelve a la terminal

### Comando 2: Link al Proyecto
```bash
supabase link --project-ref vrclozhgaacehojbnpuo
```
- Te pedirá la contraseña de la base de datos
- Si no la sabes, presiona Enter (usará variables de entorno)

### Comando 3: Deploy
```bash
supabase functions deploy make-server-4909a0bc
```
- Espera 30-60 segundos
- Deberías ver: `✅ Deployed Function make-server-4909a0bc`

---

## ✅ VERIFICAR QUE FUNCIONÓ

1. Recarga la app (F5)
2. Abre QuickFix (botón esquina inferior derecha)
3. Clic en "Ejecutar Tests"
4. Todos los tests deben pasar (✅ OK)

---

## 🆘 SI ALGO FALLA

### Error: "command not found: supabase"
- Reinicia la terminal
- Verifica que instalaste correctamente (Paso 1)

### Error: "Failed to link project"
- Verifica que usaste el project-ref correcto: `vrclozhgaacehojbnpuo`
- Intenta con: `supabase link --project-ref vrclozhgaacehojbnpuo --password TU_PASSWORD`

### Error: "Permission denied"
- Ejecuta `supabase login` nuevamente
- Asegúrate de estar logueado en Supabase

---

## 📞 SOPORTE

Si nada funciona:
1. Copia TODO el mensaje de error
2. Toma screenshot de la terminal
3. Envíamelo para ayudarte

---

**¡Listo! Una vez desplegado, el sistema funcionará al 100%** ✨