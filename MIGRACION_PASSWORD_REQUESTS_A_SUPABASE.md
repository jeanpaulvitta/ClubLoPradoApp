# 🚀 Migración de Password Requests a Supabase KV Store

## ✅ Cambios Implementados

He migrado el sistema de solicitudes de contraseña desde `localStorage` a **Supabase KV Store**, igual que funciona en tu proyecto de Universidad de Chile.

### 🔧 Backend - Nuevas Rutas API

Agregadas en `/supabase/functions/server/index.tsx`:

#### 1. **GET `/password-requests`** (Admin solo)
Obtiene todas las solicitudes de contraseña almacenadas en `password-requests:list`

#### 2. **POST `/password-requests`** (Público)
Crea una nueva solicitud de acceso. Cualquier usuario puede solicitar acceso.

```typescript
// Ejemplo de solicitud
{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "role": "swimmer"
}
```

#### 3. **POST `/password-requests/:id/approve`** (Admin solo)
Aprueba una solicitud y crea la cuenta de usuario usando `supabase.auth.signUp()`.

**IMPORTANTE:** El usuario queda con `status: 'pending_approval'` y debe ser aprobado manualmente en el Dashboard de Supabase.

#### 4. **POST `/password-requests/:id/reject`** (Admin solo)
Rechaza una solicitud sin crear cuenta.

#### 5. **DELETE `/password-requests/:id`** (Admin solo)
Elimina una solicitud del sistema.

---

### 📱 Frontend - Nuevo Servicio

Creado `/src/app/services/passwordRequests.ts`:

```typescript
// Funciones disponibles:
getPasswordRequests()         // Obtener todas las solicitudes
createPasswordRequest()       // Crear nueva solicitud
approvePasswordRequest()      // Aprobar solicitud
rejectPasswordRequest()       // Rechazar solicitud
deletePasswordRequest()       // Eliminar solicitud
```

---

## 🔄 Componente `PasswordRequestsManager`

### Cambios Necesarios

El componente actual usa localStorage. Para completar la migración, necesitas actualizar:

#### 1. Actualizar imports
```typescript
import * as passwordRequestsApi from '../services/passwordRequests';
import type { PasswordRequest } from '../services/passwordRequests';
```

#### 2. Actualizar `loadRequests()`
```typescript
const loadRequests = async () => {
  try {
    setLoading(true);
    const allRequests = await passwordRequestsApi.getPasswordRequests();
    setRequests(allRequests);
  } catch (error) {
    console.error('Error cargando solicitudes:', error);
    toast.error('Error al cargar solicitudes');
    setRequests([]);
  } finally {
    setLoading(false);
  }
};
```

#### 3. Actualizar `handleApproveRequest()`
```typescript
const handleApproveRequest = async (request: PasswordRequest) => {
  setLoading(true);
  try {
    const credentials = await passwordRequestsApi.approvePasswordRequest(request.id);
    
    // Recargar solicitudes
    await loadRequests();
    
    // Mostrar credenciales
    setApprovedCredentials(credentials);
    setShowApproveDialog(true);
    
    toast.success('Usuario creado - Aprueba en Dashboard de Supabase');
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error';
    toast.error(msg);
  } finally {
    setLoading(false);
  }
};
```

#### 4. Actualizar `handleRejectRequest()`
```typescript
const handleRejectRequest = async (requestId: string) => {
  try {
    await passwordRequestsApi.rejectPasswordRequest(requestId);
    await loadRequests();
    toast.success('Solicitud rechazada');
  } catch (error) {
    toast.error('Error al rechazar solicitud');
  }
};
```

---

## 🎯 Ventajas del Nuevo Sistema

✅ **Persistente** - No se pierde al limpiar navegador  
✅ **Centralizado** - Todos los admins ven las mismas solicitudes  
✅ **Sin Service Role Key** - Usa `signUp()` del cliente  
✅ **Sincronizado** - Cambios reflejados en tiempo real  
✅ **Profesional** - Base de datos real vs localStorage  
✅ **Igual que U de Chile** - Mismo sistema que funciona bien  

---

## 📋 Flujo Completo

### Solicitar Acceso (Usuario)

1. Usuario abre app → "Solicitar Acceso"
2. Completa formulario (nombre, email, rol)
3. Sistema llama `POST /password-requests`
4. Solicitud guardada en `password-requests:list`
5. Usuario ve mensaje: "Solicitud enviada"

### Aprobar Solicitud (Admin)

1. Admin ve lista de solicitudes pendientes
2. Click en "Aprobar"
3. Sistema llama `POST /password-requests/:id/approve`
4. Backend crea usuario con `signUp()` y `status: 'pending_approval'`
5. Admin recibe credenciales
6. **PASO MANUAL:** Admin va a Supabase Dashboard
7. Authentication → Users → Edit → Cambiar status a `"approved"`
8. Admin comparte credenciales con usuario
9. Usuario puede iniciar sesión ✅

---

## 🔑 Datos Almacenados en KV Store

```typescript
// Clave: "password-requests:list"
[
  {
    id: "pr_1234567890_abc123",
    name: "Juan Pérez",
    email: "juan@ejemplo.com",
    role: "swimmer",
    requestedAt: "2026-03-10T12:00:00.000Z",
    status: "pending", // "approved" | "rejected"
    approvedAt?: "2026-03-10T12:30:00.000Z",
    approvedBy?: "admin@loprado.cl",
    generatedPassword?: "NP1234567890!abc123def" // Temporal
  }
]
```

---

## ⚠️ Migración de Datos Existentes

Si ya tienes solicitudes en localStorage que quieres migrar:

### Opción 1: Script Manual (Recomendado)

```typescript
// Ejecutar en consola del navegador
async function migratePasswordRequests() {
  const old = localStorage.getItem('natacion_master_password_requests');
  if (!old) {
    console.log('No hay solicitudes para migrar');
    return;
  }
  
  const requests = JSON.parse(old);
  console.log(`Migrando ${requests.length} solicitudes...`);
  
  for (const req of requests) {
    if (req.status === 'pending') {
      try {
        await fetch('https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/password-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: req.name,
            email: req.email,
            role: req.role
          })
        });
        console.log('✅ Migrado:', req.email);
      } catch (error) {
        console.error('❌ Error:', req.email, error);
      }
    }
  }
  
  console.log('✅ Migración completada');
}

migratePasswordRequests();
```

### Opción 2: Borrar y Empezar de Cero

```javascript
// Borrar datos viejos de localStorage
localStorage.removeItem('natacion_master_password_requests');
console.log('✅ Datos viejos eliminados');
```

---

## 🧪 Testing

### 1. Crear Solicitud (Sin autenticación)

```bash
curl -X POST \
  https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/password-requests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@ejemplo.com",
    "role": "swimmer"
  }'
```

### 2. Ver Solicitudes (Con autenticación)

```bash
curl -X GET \
  https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/password-requests \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Aprobar Solicitud (Con autenticación)

```bash
curl -X POST \
  https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/password-requests/pr_123/approve \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
```

---

## ✅ Checklist de Migración

- [x] Backend: Rutas API creadas
- [x] Frontend: Servicio `passwordRequests.ts` creado  
- [ ] Frontend: Actualizar `PasswordRequestsManager` para usar API
- [ ] Frontend: Actualizar `LoginPage` para usar API
- [ ] Testing: Probar creación de solicitud
- [ ] Testing: Probar aprobación de solicitud
- [ ] Testing: Probar rechazo de solicitud
- [ ] Migrar: Datos existentes de localStorage (opcional)
- [ ] Documentar: Flujo para usuarios finales

---

## 📖 Próximos Pasos

1. **Actualizar `PasswordRequestsManager.tsx`** para usar la nueva API
2. **Actualizar `LoginPage.tsx`** para crear solicitudes via API
3. **Probar el flujo completo** end-to-end
4. **Migrar datos viejos** (si es necesario)
5. **Desplegar** a producción

---

## 🆘 Troubleshooting

### Error: "No hay sesión activa"
- El admin debe estar logueado para ver/aprobar solicitudes
- Verificar que el token JWT esté vigente

### Error: "Solo administradores pueden aprobar"
- Verificar que el usuario tenga `role: 'admin'` en su metadata

### Error: "Usuario ya existe"
- El email ya está registrado en Supabase Auth
- Marcar la solicitud como aprobada sin crear usuario nuevo

### Solicitudes no se sincronizan
- Verificar que la Edge Function esté desplegada
- Revisar que el KV store tenga la clave `password-requests:list`

---

¡Tu sistema ahora es más robusto y profesional! 🎉
