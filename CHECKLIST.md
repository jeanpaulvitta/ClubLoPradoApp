# ✅ Checklist de Configuración - Club Natación Lo Prado

## 📋 Estado Actual

### ✅ Completado
- [x] Aplicación desplegada en Vercel
- [x] Logo convertido a SVG
- [x] Branding actualizado (Universidad de Chile → Club Natación Lo Prado)
- [x] Código sin referencias a `figma:asset`
- [x] Configuración de deployment lista
- [x] Scripts de limpieza creados

### ⏳ Pendiente
- [ ] **Servidor Edge Functions desplegado en Supabase**
- [ ] Usuario administrador creado
- [ ] Primera sesión iniciada

---

## 🎯 Próximo Paso: Desplegar Servidor

### Comando Rápido de Verificación
```bash
npm run check-server
```

**Resultado esperado:**
- ❌ Si falla → El servidor NO está desplegado (necesitas seguir los pasos)
- ✅ Si funciona → El servidor está OK, puedes crear el admin

---

## 🚀 Pasos para Desplegar (Solo si el check falla)

### 1. Instalar Supabase CLI
```bash
npm install -g supabase
```

**Verificar instalación:**
```bash
supabase --version
```
Deberías ver: `Supabase CLI 1.x.x`

---

### 2. Login en Supabase
```bash
supabase login
```

**¿Qué esperar?**
- Se abre tu navegador
- Te pide autorizar el CLI
- Recibes confirmación en la terminal

---

### 3. Conectar al Proyecto
```bash
supabase link --project-ref tvkrvozifmbgkaztwxib
```

**Te pedirá:**
- Password de la base de datos (la que usaste al crear el proyecto)

**Confirmación:**
```
Linked project: tvkrvozifmbgkaztwxib
```

---

### 4. Obtener API Keys

Ve a: https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/settings/api

**Copia estas 3 keys:**

1. **Project URL:**
   ```
   https://tvkrvozifmbgkaztwxib.supabase.co
   ```

2. **anon public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2a3J2b3ppZm1iZ2thenR3eGliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NjY1MTIsImV4cCI6MjA4MzE0MjUxMn0.2cKgDYsSTn5I-Rpy_MPuvuvyY-_uzyIKkkO9qskzrro
   ```

3. **service_role key:** (haz clic en "Reveal")
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

### 5. Configurar Secrets
```bash
# SUPABASE_URL
supabase secrets set SUPABASE_URL=https://tvkrvozifmbgkaztwxib.supabase.co

# SUPABASE_ANON_KEY (pega tu key)
supabase secrets set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# SUPABASE_SERVICE_ROLE_KEY (pega tu key - ¡SECRETO!)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Verificar:**
```bash
supabase secrets list
```

Deberías ver:
```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

---

### 6. Desplegar Edge Functions
```bash
supabase functions deploy server
```

**Output esperado:**
```
Deploying Functions...
  - server
✓ Deployed function server
  https://tvkrvozifmbgkaztwxib.supabase.co/functions/v1/server
```

---

### 7. Verificar que Funcionó
```bash
npm run check-server
```

**Resultado esperado:**
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

## 🎉 Una Vez que el Servidor Esté Funcionando

### 1. Abrir la Aplicación

**Producción:**
https://clubnatacionloprado-bzxkjy9d9-jean-paul-vittas-projects.vercel.app/

**Local:**
```bash
npm run dev:clean
```
Luego: http://localhost:5173

---

### 2. Crear Usuario Administrador

1. En la página de login, busca el **banner morado/azul** con animación
2. Haz clic en: **"Crear Usuario Administrador Ahora"**
3. El Panel de Diagnóstico debería mostrar:
   - ✅ Servidor alcanzable
   - ✅ Health endpoint
   - ✅ Auth endpoint
4. Haz clic en: **"Crear Administrador"**
5. Guarda las credenciales:
   - Email: `admin@loprado.cl`
   - Password: `admin123`

---

### 3. Iniciar Sesión

1. Ve a la pestaña **"Iniciar Sesión"**
2. Ingresa:
   - Email: `admin@loprado.cl`
   - Password: `admin123`
3. ¡Listo! Tendrás acceso completo al sistema

---

## 🆘 Troubleshooting

### Error: "supabase: command not found"
```bash
npm install -g supabase
```

### Error: "No project linked"
```bash
supabase link --project-ref tvkrvozifmbgkaztwxib
```

### Error: "Missing secrets"
Vuelve al Paso 5 y configura los secrets.

### Error: "Deploy failed"
```bash
# Ver logs
supabase functions logs server

# Intentar de nuevo
supabase functions deploy server --no-verify-jwt
```

### El servidor no responde después de desplegar
```bash
# Verificar logs
supabase functions logs server --follow

# Probar endpoint manualmente
curl https://tvkrvozifmbgkaztwxib.supabase.co/functions/v1/make-server-4909a0bc/health
```

---

## 📚 Documentación Adicional

- **Solución Urgente:** [SOLUCION_URGENTE.md](./SOLUCION_URGENTE.md)
- **Deployment Supabase:** [SUPABASE_DEPLOYMENT.md](./SUPABASE_DEPLOYMENT.md)
- **Fix Desarrollo Local:** [DEV_LOCAL_FIX.md](./DEV_LOCAL_FIX.md)
- **Troubleshooting General:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Inicio Rápido:** [INICIO_RAPIDO.md](./INICIO_RAPIDO.md)
- **README Principal:** [README.md](./README.md)

---

## 🎯 Comandos Útiles de Referencia

```bash
# Verificar estado del servidor
npm run check-server

# Limpiar caché de desarrollo
npm run clean

# Desarrollo con limpieza automática
npm run dev:clean

# Ver logs del servidor
supabase functions logs server --follow

# Listar secrets configurados
supabase secrets list

# Listar funciones desplegadas
supabase functions list

# Redesplegar después de cambios
supabase functions deploy server
```

---

## ✨ Estado Final Esperado

Cuando todo esté funcionando:

- ✅ `npm run check-server` → Servidor OK
- ✅ `npm run dev` → Aplicación corriendo sin errores
- ✅ Usuario admin creado
- ✅ Login exitoso
- ✅ Dashboard accesible
- ✅ Todas las funcionalidades operativas

---

**¡Éxito!** 🎉 Si llegaste hasta aquí, tu aplicación está completamente configurada y lista para usar.
