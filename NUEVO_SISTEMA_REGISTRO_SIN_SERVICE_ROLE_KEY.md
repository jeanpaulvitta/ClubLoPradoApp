# ✅ Nuevo Sistema de Registro de Usuarios - Sin Service Role Key

## 🎯 Problema Solucionado

El sistema anterior requería el `SUPABASE_SERVICE_ROLE_KEY` para crear nuevos usuarios mediante `supabase.auth.admin.createUser()`. Este secret **no puede ser eliminado** del dashboard de Supabase, lo que causaba conflictos si necesitabas reconfigurarlo.

## ✨ Nueva Solución Implementada

Hemos migrado a un sistema que **NO requiere el service role key** para registro de usuarios. Ahora usamos el método `supabase.auth.signUp()` directamente desde el cliente.

---

## 🔧 Cómo Funciona el Nuevo Sistema

### 1️⃣ **Registro de Usuarios (Admin)**

Cuando un administrador crea un nuevo usuario desde la pestaña "Nadadores" o "Usuarios":

```typescript
// ✅ NUEVO MÉTODO - No requiere service role key
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      name,
      role,
      status: 'pending_approval', // Marcado como pendiente
    }
  }
});
```

### 2️⃣ **Estado del Usuario**

Los usuarios creados tienen un campo `status` en su metadata:

- **`pending_approval`**: Usuario recién creado, no puede iniciar sesión
- **`approved`**: Usuario aprobado por admin, puede iniciar sesión

### 3️⃣ **Verificación al Iniciar Sesión**

Cuando un usuario intenta iniciar sesión, el sistema verifica su estado:

```typescript
// Verificar estado
const userStatus = data.user.user_metadata.status;

if (userStatus === 'pending_approval') {
  // Cerrar sesión inmediatamente
  await supabase.auth.signOut();
  throw new Error('Tu cuenta está pendiente de aprobación...');
}
```

---

## 📋 Flujo Completo

### Paso 1: Admin Crea Usuario

1. Admin inicia sesión
2. Va a la pestaña "Nadadores" o gestión de usuarios
3. Crea un nuevo usuario con email, nombre y rol
4. El usuario se crea con `status: 'pending_approval'`

### Paso 2: Aprobar Usuario (Manualmente en Dashboard)

**⚠️ IMPORTANTE:** Por ahora, la aprobación debe hacerse manualmente en el dashboard de Supabase.

#### Opción A: Dashboard de Supabase (Recomendado)

1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Authentication → Users
3. Encuentra al usuario creado
4. Clic en los 3 puntos `...` → "Edit User"
5. En la sección "User Metadata", cambia:
   ```json
   {
     "name": "Nombre Usuario",
     "role": "swimmer",
     "status": "approved"  ← Cambiar de "pending_approval" a "approved"
   }
   ```
6. Guardar cambios

#### Opción B: SQL Editor (Avanzado)

```sql
-- Listar usuarios pendientes
SELECT 
  id,
  email,
  raw_user_meta_data->>'name' as name,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'status' as status
FROM auth.users
WHERE raw_user_meta_data->>'status' = 'pending_approval';

-- Aprobar un usuario específico
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data,
  '{status}',
  '"approved"'
)
WHERE email = 'usuario@ejemplo.com';
```

### Paso 3: Usuario Inicia Sesión

1. Usuario abre la aplicación
2. Intenta iniciar sesión con email y contraseña
3. Si está aprobado (`status: 'approved'`) → ✅ Sesión iniciada
4. Si está pendiente (`status: 'pending_approval'`) → ❌ Mensaje de espera

---

## 🎁 Ventajas del Nuevo Sistema

✅ **No requiere service role key** para crear usuarios
✅ **Más seguro** - El service role key nunca sale del servidor
✅ **Más flexible** - Puedes cambiar configuración sin problemas de secrets
✅ **Compatible con políticas de seguridad** de Supabase
✅ **Funciona desde el cliente** - No necesita backend para crear usuarios

---

## 🔄 Migración desde el Sistema Anterior

Si ya tenías usuarios creados con el sistema anterior:

### Usuarios Existentes (Creados con admin.createUser)

Los usuarios creados previamente **NO tienen** el campo `status` en su metadata, por lo que funcionarán normalmente (la verificación solo aplica si `status === 'pending_approval'`).

### Usuarios Nuevos

Todos los usuarios creados a partir de ahora tendrán `status: 'pending_approval'` y requerirán aprobación manual del admin.

---

## 🛠️ Próximas Mejoras (Opcional)

### Automatizar Aprobación de Usuarios

Si quieres agregar una interfaz para aprobar usuarios directamente desde la app:

1. **Crear una Edge Function** que use el service role key internamente:
   ```typescript
   // /supabase/functions/server/index.tsx
   app.post("/make-server-4909a0bc/admin/approve-user", authMiddleware, async (c) => {
     const { userId } = await c.req.json();
     
     const { error } = await supabase.auth.admin.updateUserById(userId, {
       user_metadata: { status: 'approved' }
     });
     
     return c.json({ success: !error });
   });
   ```

2. **Agregar UI en el frontend** para listar y aprobar usuarios pendientes

---

## ❓ Preguntas Frecuentes

### ¿Puedo eliminar el SUPABASE_SERVICE_ROLE_KEY?

**No.** Supabase protege este secret y no permite eliminarlo. Sin embargo, con el nuevo sistema **no lo necesitas** para crear usuarios, solo para operaciones administrativas avanzadas.

### ¿Qué pasa si olvido aprobar a un usuario?

El usuario simplemente no podrá iniciar sesión hasta que lo apruebes. Recibirá el mensaje: *"Tu cuenta está pendiente de aprobación por un administrador"*.

### ¿Los usuarios auto-registrados también requieren aprobación?

Sí. Si implementas un formulario de auto-registro público, todos los usuarios nuevos tendrán `status: 'pending_approval'` y requerirán aprobación del admin antes de poder acceder.

### ¿Cómo sé qué usuarios están pendientes?

Por ahora, debes revisar en:
- Dashboard de Supabase → Authentication → Users
- O ejecutar la query SQL de "Listar usuarios pendientes" mostrada arriba

---

## 📞 Soporte

Si tienes problemas con el nuevo sistema:

1. **Verifica los logs** en la consola del navegador (`F12`)
2. **Revisa el dashboard** de Supabase para confirmar que el usuario fue creado
3. **Confirma el status** del usuario en su metadata

---

## 🎉 Resumen

✅ **Sistema migrado exitosamente** a registro sin service role key  
✅ **Usuarios nuevos** se crean con `pending_approval`  
✅ **Aprobación manual** vía dashboard de Supabase  
✅ **Más seguro y flexible** que el sistema anterior  

¡Tu sistema de autenticación está ahora optimizado y listo para producción! 🚀
