# 🚀 Guía Rápida de Deployment

## 🎯 Error Actual
```
❌ Servidor no alcanzable: TypeError: Failed to fetch
```

**Causa:** Las Edge Functions de Supabase no están desplegadas.

---

## ✅ 3 Formas de Solucionarlo

### 🥇 **Opción 1: Asistente Automático** (MÁS FÁCIL)

```bash
npm run deploy
```

Este comando ejecuta un asistente interactivo que:
- ✅ Verifica si tienes Supabase CLI instalado
- ✅ Te ayuda a hacer login
- ✅ Conecta tu proyecto
- ✅ Despliega las funciones
- ✅ Configura las variables de entorno
- ✅ Verifica que todo funcione

**Solo sigue las instrucciones en pantalla.**

---

### 🥈 **Opción 2: Comandos Manuales** (RÁPIDO)

```bash
# 1. Instalar CLI de Supabase
npm install -g supabase

# 2. Login en Supabase
supabase login

# 3. Conectar al proyecto
supabase link --project-ref tvkrvozifmbgkaztwxib

# 4. Desplegar funciones
supabase functions deploy

# 5. Configurar variables de entorno
supabase secrets set SUPABASE_URL=https://tvkrvozifmbgkaztwxib.supabase.co
supabase secrets set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2a3J2b3ppZm1iZ2thenR3eGliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NjY1MTIsImV4cCI6MjA4MzE0MjUxMn0.2cKgDYsSTn5I-Rpy_MPuvuvyY-_uzyIKkkO9qskzrro
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=TU_KEY_AQUI

# 6. Verificar
npm run check-server
```

**⚠️ IMPORTANTE:** Necesitas obtener el `service_role_key`:
1. Ve a: https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/settings/api
2. Busca "service_role secret"
3. Haz clic en "Reveal"
4. Copia la key

---

### 🥉 **Opción 3: Guía Detallada Paso a Paso**

Lee el archivo: **`DESPLIEGUE_PASO_A_PASO.md`**

Incluye:
- Screenshots y ejemplos
- Explicación de cada paso
- Solución a problemas comunes
- Enlaces directos al dashboard

---

## 🔍 Verificar el Deployment

### Verificación Rápida:
```bash
npm run check-server
```

### Verificación Completa:
```bash
npm run verify
```

Este comando verifica:
- ✅ Health endpoint
- ✅ Auth endpoints
- ✅ API endpoints
- ✅ Configuración correcta

**Resultado Esperado:**
```
✅ ¡SERVIDOR FUNCIONANDO!

📦 Respuesta:
{
  "status": "ok",
  "timestamp": "2026-02-06T...",
  "version": "2.0.1"
}
```

---

## 🎯 Después del Deployment

### 1. Iniciar la Aplicación
```bash
npm run dev
```

### 2. Crear Usuario Administrador

**Opción A: Desde la Web**
1. Abre: http://localhost:5173
2. Haz clic en "Crear Usuario Administrador Ahora"

**Opción B: Desde Terminal**
```bash
curl -X POST https://tvkrvozifmbgkaztwxib.supabase.co/functions/v1/make-server-4909a0bc/auth/init-admin \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2a3J2b3ppZm1iZ2thenR3eGliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NjY1MTIsImV4cCI6MjA4MzE0MjUxMn0.2cKgDYsSTn5I-Rpy_MPuvuvyY-_uzyIKkkO9qskzrro"
```

### 3. Iniciar Sesión
- **Email:** `admin@loprado.cl`
- **Password:** `admin123`

⚠️ **IMPORTANTE:** Cambia la contraseña inmediatamente después del primer login.

---

## 🔄 Comandos Útiles

```bash
# Ver logs en tiempo real
supabase functions logs server --follow

# Ver todas las funciones desplegadas
supabase functions list

# Ver secrets configurados
supabase secrets list

# Redesplegar después de cambios
supabase functions deploy server

# Verificar estado
npm run verify
```

---

## 🆘 Problemas Comunes

### ❌ "No project linked"
```bash
supabase link --project-ref tvkrvozifmbgkaztwxib
```

### ❌ "Missing secrets"
```bash
supabase secrets list
```
Debe mostrar:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Si falta alguno, configúralo:
```bash
supabase secrets set NOMBRE_SECRET=valor
```

### ❌ "Invalid project ref"
1. Verifica que estés usando la cuenta correcta
2. Intenta logout y login:
   ```bash
   supabase logout
   supabase login
   ```

### ❌ Servidor desplegado pero no responde
1. Verifica secrets: `supabase secrets list`
2. Revisa logs: `supabase functions logs server`
3. Redesplega: `supabase functions deploy server`

---

## 📚 Documentación Completa

| Archivo | Descripción |
|---------|-------------|
| `SOLUCION_RAPIDA.md` | Comandos rápidos y soluciones |
| `DESPLIEGUE_PASO_A_PASO.md` | Guía detallada con ejemplos |
| `SUPABASE_DEPLOYMENT.md` | Documentación técnica completa |
| `CHECKLIST.md` | Checklist de verificación |

---

## 🔗 Enlaces Importantes

- **Dashboard:** https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib
- **Functions:** https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/functions
- **API Settings:** https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/settings/api
- **Database:** https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/settings/database

---

## ✅ Checklist Rápido

- [ ] Supabase CLI instalado (`npm install -g supabase`)
- [ ] Login exitoso (`supabase login`)
- [ ] Proyecto conectado (`supabase link --project-ref tvkrvozifmbgkaztwxib`)
- [ ] Funciones desplegadas (`supabase functions deploy`)
- [ ] Secrets configurados (3 secrets: URL, ANON_KEY, SERVICE_ROLE_KEY)
- [ ] Verificación exitosa (`npm run verify`)
- [ ] Usuario admin creado
- [ ] Login exitoso en la app

---

## 📞 ¿Necesitas Ayuda?

1. **Ejecuta el diagnóstico:**
   ```bash
   npm run verify
   ```

2. **Revisa los logs:**
   ```bash
   supabase functions logs server
   ```

3. **Consulta la documentación detallada:**
   - `DESPLIEGUE_PASO_A_PASO.md`
   - `TROUBLESHOOTING.md`

---

**💡 Tip:** Si es tu primera vez, usa `npm run deploy` y sigue las instrucciones del asistente.

---

**🎉 ¡Todo listo! Una vez completado el deployment, tu aplicación estará funcionando al 100%.**
