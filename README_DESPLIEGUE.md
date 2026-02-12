# 🚨 ERROR: "Missing authorization header"

## ✅ SOLUCIÓN RÁPIDA (5 MINUTOS)

El servidor Edge Function NO está desplegado. Sigue estos 3 pasos:

---

## PASO 1: Instalar CLI

**Mac:**
```bash
brew install supabase/tap/supabase
```

**Windows:**
Descarga: https://github.com/supabase/cli/releases/latest/download/supabase_windows_amd64.msi

---

## PASO 2: Desplegar (ejecuta estos 3 comandos)

```bash
# En la terminal, dentro de la carpeta del proyecto:

supabase login
supabase link --project-ref vrclozhgaacehojbnpuo
supabase functions deploy make-server-4909a0bc
```

Espera hasta ver: `✅ Deployed Function`

---

## PASO 3: Configurar variables

1. Ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/settings/api
2. Copia las 3 claves (URL, anon key, service_role key)
3. Ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions/make-server-4909a0bc
4. Click "Secrets"
5. Agrega:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

---

## ✅ VERIFICAR

Abre tu app → **Análisis** → **Diagnóstico** → **Ejecutar Tests**

Deberías ver TODO en verde (✅).

---

## 📄 MÁS AYUDA

- **Instrucciones detalladas:** `/DESPLIEGUE_EN_3_PASOS.md`
- **Checklist completo:** `/CHECKLIST_DESPLIEGUE.md`
- **Instrucciones extensas:** `/INSTRUCCIONES_DESPLIEGUE_URGENTE.md`

---

**¿Sigues con problemas?** Dime en qué paso estás y qué error ves. 🚀
