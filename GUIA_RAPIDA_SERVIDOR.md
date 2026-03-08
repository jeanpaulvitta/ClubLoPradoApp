# 🚀 Guía Rápida: Configurar Servidor Edge Function

> **Error que soluciona:** `Missing authorization header (401)`  
> **Tiempo estimado:** 5-10 minutos

---

## ✅ Checklist Rápido

Completa estos 4 pasos en orden:

### □ Paso 1: Verificar Despliegue
- Ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions
- Confirma que existe la función **"server"**
- Confirma que hay un deployment **"Active"** (verde)

### □ Paso 2: Configurar Variables de Entorno
- En la página de la función, ve a **"Settings"** → **"Secrets"**
- Agrega estas 3 variables:

```
SUPABASE_URL=https://vrclozhgaacehojbnpuo.supabase.co
SUPABASE_ANON_KEY=[copia desde Dashboard → Settings → API → anon]
SUPABASE_SERVICE_ROLE_KEY=[copia desde Dashboard → Settings → API → service_role]
```

### □ Paso 3: Redesplegar
- En la página de la función, haz clic en **"Deploy"**
- Espera 1-2 minutos

### □ Paso 4: Verificar
- Abre: https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health
- Deberías ver: `{"status":"ok","message":"Server is running",...}`
- O bien, en la app, ve a **"Usuarios"** y verifica el estado

---

## 🔗 Enlaces Rápidos

| Acción | URL |
|--------|-----|
| Edge Functions | https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions |
| API Settings | https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/settings/api |
| Function Logs | https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions/server/logs |
| Test Health | https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health |

---

## 🆘 Si no funciona

1. **Revisa los logs** en Supabase Dashboard → Functions → server → Logs
2. **Verifica las variables** en Settings → Secrets (deben ser exactamente 3)
3. **Fuerza un redespliegue** haciendo clic en "Deploy" nuevamente
4. **Consulta la guía completa** en `/SOLUCION_MISSING_AUTHORIZATION_HEADER.md`

---

## ✨ Resultado Esperado

Cuando todo esté configurado correctamente:
- ✅ La app mostrará "Servidor configurado correctamente" (verde)
- ✅ Podrás aprobar solicitudes de acceso sin errores
- ✅ Todas las funcionalidades del sistema estarán disponibles

---

**Última actualización:** 8 de Marzo de 2026
