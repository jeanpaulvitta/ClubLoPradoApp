# 🚀 Despliegue del Nuevo Sistema de Password Requests

## 📋 Checklist Pre-Despliegue

Antes de desplegar, verifica que tengas:

- [ ] Cuenta de GitHub activa
- [ ] Proyecto en Supabase configurado
- [ ] Edge Function desplegada
- [ ] Variables de entorno configuradas
- [ ] Proyecto conectado a Vercel

---

## 🔧 Paso 1: Actualizar Backend (Edge Function)

### Opción A: Desde Figma Make

1. Los cambios ya están en tu código local
2. El archivo `/supabase/functions/server/index.tsx` ya tiene las nuevas rutas
3. ✅ Listo para push a GitHub

### Opción B: Verificar Código

Asegúrate de que `/supabase/functions/server/index.tsx` tenga estas rutas:

```typescript
// ==================== PASSWORD REQUESTS ROUTES ====================

app.get("/make-server-4909a0bc/password-requests", authMiddleware, async (c) => {
  // ... código para obtener solicitudes
});

app.post("/make-server-4909a0bc/password-requests", async (c) => {
  // ... código para crear solicitud
});

app.post("/make-server-4909a0bc/password-requests/:id/approve", authMiddleware, async (c) => {
  // ... código para aprobar solicitud
});

app.post("/make-server-4909a0bc/password-requests/:id/reject", authMiddleware, async (c) => {
  // ... código para rechazar solicitud
});

app.delete("/make-server-4909a0bc/password-requests/:id", authMiddleware, async (c) => {
  // ... código para eliminar solicitud
});
```

✅ Si están presentes, continúa al siguiente paso.

---

## 📤 Paso 2: Push a GitHub

### Desde Figma Make (Automatizado)

1. Figma Make detectará los cambios
2. Commit automático a GitHub
3. Espera confirmación de push exitoso

### Manual (Si usas Git localmente)

```bash
git add .
git commit -m "feat: migrar password requests a Supabase KV store"
git push origin main
```

---

## ☁️ Paso 3: Desplegar Edge Function a Supabase

### Opción 1: Supabase Dashboard (Recomendado para este proyecto)

1. **Ir a Supabase Dashboard**
   - https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo

2. **Edge Functions → `make-server-4909a0bc`**
   - Click en la función
   - Click en "Deploy"

3. **Verificar Deployment**
   - Espera a que el status sea "Active"
   - Debería ver versión actualizada

### Opción 2: GitHub Actions (Si está configurado)

1. El push a GitHub activa deployment automático
2. Ve a tu repositorio → Actions
3. Verifica que el workflow se ejecute correctamente

### Opción 3: Supabase CLI (Avanzado - no recomendado para tu flujo)

```bash
# NO uses esto si trabajas solo con Figma Make
supabase functions deploy make-server-4909a0bc
```

---

## 🧪 Paso 4: Probar las Nuevas Rutas

### Test 1: Health Check

```bash
# Verifica que la función esté desplegada
curl https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-10T...",
  "env": {
    "url": "https://vrclozhgaacehojbnpuo.supabase.co",
    "anon_key": "***"
  }
}
```

### Test 2: Crear Solicitud (Sin autenticación)

```bash
curl -X POST \
  https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/password-requests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Usuario",
    "email": "test@prueba.com",
    "role": "swimmer"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "request": {
    "id": "pr_...",
    "name": "Test Usuario",
    "email": "test@prueba.com",
    "role": "swimmer",
    "status": "pending",
    "requestedAt": "..."
  },
  "message": "Solicitud enviada exitosamente..."
}
```

### Test 3: Ver Solicitudes (Como Admin)

1. Inicia sesión en la app como admin
2. Abre DevTools (F12)
3. En Console, ejecuta:

```javascript
// Obtener token
const { data } = await supabase.auth.getSession();
const token = data.session.access_token;

// Llamar API
const response = await fetch(
  'https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/password-requests',
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
);

const data = await response.json();
console.log('📋 Solicitudes:', data.requests);
```

**Resultado esperado:**  
Lista de solicitudes incluyendo la de "Test Usuario"

---

## 🌐 Paso 5: Desplegar Frontend a Vercel

### Despliegue Automático

Si tu proyecto está conectado a Vercel:

1. El push a GitHub activa deployment automático
2. Ve a https://vercel.com/tu-proyecto
3. Verifica que el deployment esté en progreso
4. Espera a que complete (2-5 minutos)
5. ✅ Click en "Visit" para ver tu app actualizada

### Despliegue Manual

Si el automático falla:

1. Ve a https://vercel.com/tu-proyecto
2. Click en "Deployments"
3. Click en "..." del último deployment
4. Click en "Redeploy"

---

## ✅ Paso 6: Verificación Post-Despliegue

### 1. Probar Solicitud de Acceso (Usuario)

1. Abre tu app en producción (Vercel URL)
2. **NO inicies sesión**
3. Pestaña "Solicitar Acceso"
4. Completa:
   - Nombre: "Usuario Prueba"
   - Email: "prueba@test.com"
   - Rol: Nadador
5. Click "Enviar Solicitud"
6. ✅ Deberías ver: "Solicitud enviada exitosamente"

### 2. Verificar en Supabase KV Store

1. Ve a Supabase Dashboard → SQL Editor
2. Ejecuta:

```sql
SELECT value 
FROM kv_store_4909a0bc 
WHERE key = 'password-requests:list';
```

3. ✅ Deberías ver la solicitud de "Usuario Prueba"

### 3. Aprobar Solicitud (Admin)

1. Inicia sesión como admin
2. Ve a gestión de Password Requests
3. ✅ Deberías ver "Usuario Prueba" en la lista
4. Click "Aprobar"
5. ✅ Recibe credenciales
6. Ve a Supabase Dashboard → Authentication → Users
7. Encuentra a "prueba@test.com"
8. Edit → User Metadata → Cambiar status a "approved"
9. ✅ Usuario puede iniciar sesión

---

## 🐛 Troubleshooting

### Error: "Failed to fetch"

**Causa:** La Edge Function no está desplegada o hay error de CORS

**Solución:**
1. Verifica que la Edge Function esté "Active" en Supabase
2. Redespliega la Edge Function
3. Verifica que el código incluya `cors()` middleware

### Error: "Invalid JWT" o "Missing authorization header"

**Causa:** Variables de entorno mal configuradas

**Solución:**
1. Ve a Supabase Dashboard
2. Edge Functions → make-server-4909a0bc → Settings
3. Verifica que estén configuradas:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Error: "Solo administradores pueden ver solicitudes"

**Causa:** El usuario no tiene rol de admin

**Solución:**
1. Verifica en Supabase Auth que tu usuario tenga `role: 'admin'` en user_metadata
2. Cierra sesión y vuelve a iniciar sesión

### Solicitudes no aparecen

**Causa:** No se están guardando en KV store

**Solución:**
1. Verifica logs de la Edge Function en Supabase
2. Revisa que la función tenga acceso al KV store
3. Prueba crear solicitud y revisa logs

---

## 📊 Monitoring Post-Despliegue

### Ver Logs de Edge Function

1. Supabase Dashboard → Edge Functions
2. Click en `make-server-4909a0bc`
3. Tab "Logs"
4. Filtra por "password-request"
5. ✅ Deberías ver logs de creación/aprobación

### Ver Solicitudes en DB

```sql
-- Ver todas las solicitudes
SELECT value 
FROM kv_store_4909a0bc 
WHERE key = 'password-requests:list';

-- Contar solicitudes pendientes
SELECT 
  jsonb_array_length(value) as total,
  (
    SELECT COUNT(*) 
    FROM jsonb_array_elements(value) AS req 
    WHERE req->>'status' = 'pending'
  ) as pendientes
FROM kv_store_4909a0bc 
WHERE key = 'password-requests:list';
```

---

## 🎉 Despliegue Completado

Si todos los pasos anteriores funcionaron:

✅ Backend desplegado con nuevas rutas  
✅ Frontend actualizado en Vercel  
✅ Password requests funcionando con Supabase KV  
✅ Flujo completo probado end-to-end  

**¡Tu sistema está en producción!** 🚀

---

## 📅 Próximos Pasos Opcionales

### 1. Migrar Datos Viejos

Si tienes solicitudes en localStorage:

```javascript
// Ejecutar en consola del navegador como admin
const oldRequests = JSON.parse(
  localStorage.getItem('natacion_master_password_requests') || '[]'
);

for (const req of oldRequests) {
  if (req.status === 'pending') {
    await fetch(
      'https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/password-requests',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: req.name,
          email: req.email,
          role: req.role
        })
      }
    );
  }
}

// Limpiar localStorage viejo
localStorage.removeItem('natacion_master_password_requests');
```

### 2. Configurar Notificaciones

Considera agregar notificaciones por email cuando:
- Usuario solicita acceso → Email al admin
- Admin aprueba solicitud → Email al usuario con credenciales

### 3. Dashboard de Estadísticas

Crear vista para admins con:
- Total de solicitudes
- Pendientes vs aprobadas
- Gráfico de solicitudes por mes
- Tiempos de respuesta promedio

---

**¡Felicitaciones! Tu sistema está desplegado y funcionando.** 🎊
