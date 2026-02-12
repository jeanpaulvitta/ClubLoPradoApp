# 🚀 DESPLIEGUE EN 3 PASOS (5 MINUTOS)

## 📋 LO QUE VAS A HACER:

1. Instalar CLI de Supabase (2 min)
2. Ejecutar 3 comandos (2 min)
3. Configurar 3 variables (1 min)

---

## PASO 1: INSTALAR CLI

### Mac:
```bash
brew install supabase/tap/supabase
```

### Windows:
Descarga: https://github.com/supabase/cli/releases/latest/download/supabase_windows_amd64.msi

Doble clic → Instalar → Abrir nueva terminal PowerShell

### Linux:
```bash
brew install supabase/tap/supabase
```

---

## PASO 2: EJECUTAR 3 COMANDOS

Abre una terminal en la carpeta de tu proyecto y ejecuta:

```bash
# 1. Login
supabase login

# 2. Conectar proyecto
supabase link --project-ref vrclozhgaacehojbnpuo

# 3. Desplegar
supabase functions deploy make-server-4909a0bc
```

Espera hasta ver: `✅ Deployed Function make-server-4909a0bc`

---

## PASO 3: CONFIGURAR VARIABLES

1. Ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/settings/api

2. Copia:
   - Project URL
   - anon public key
   - service_role key

3. Ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions/make-server-4909a0bc

4. Click **"Secrets"**

5. Agrega:
   ```
   SUPABASE_URL = [pega URL]
   SUPABASE_ANON_KEY = [pega anon key]
   SUPABASE_SERVICE_ROLE_KEY = [pega service_role key]
   ```

6. Guarda

---

## ✅ VERIFICAR

Abre tu app → Análisis → Diagnóstico → Ejecutar

Deberías ver TODO en verde (✅).

---

## ❌ SI HAY ERRORES

Dime en qué paso estás y qué error ves. Te ayudo. 🚀
