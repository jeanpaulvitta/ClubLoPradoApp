# 🚀 Guía Rápida: Aprobar Nuevos Usuarios

## ⚡ Proceso Simplificado

Cuando creas un nuevo usuario desde la aplicación, este queda **pendiente de aprobación**. Aquí te mostramos cómo aprobarlo en 3 pasos:

---

## 📝 Método 1: Dashboard de Supabase (Más Fácil)

### Paso 1: Ir a Authentication

1. Abre [supabase.com](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. En el menú lateral, clic en **"Authentication"**
4. Clic en **"Users"**

### Paso 2: Encontrar el Usuario

- Verás una lista de todos los usuarios
- Encuentra al usuario recién creado por su email

### Paso 3: Aprobar el Usuario

1. Clic en los **3 puntos** `...` al lado derecho del usuario
2. Selecciona **"Edit User"**
3. En la sección **"User Metadata"**, verás algo como:
   ```json
   {
     "name": "Juan Pérez",
     "role": "swimmer",
     "status": "pending_approval"
   }
   ```

4. Cambia **`"pending_approval"`** por **`"approved"`**:
   ```json
   {
     "name": "Juan Pérez",
     "role": "swimmer",
     "status": "approved"
   }
   ```

5. Clic en **"Save"**

✅ **¡Listo!** El usuario ya puede iniciar sesión.

---

## 💻 Método 2: SQL Editor (Más Rápido para Múltiples Usuarios)

### Ver Usuarios Pendientes

1. En Supabase Dashboard, ve a **"SQL Editor"**
2. Copia y pega este query:

```sql
-- Ver usuarios pendientes de aprobación
SELECT 
  id,
  email,
  raw_user_meta_data->>'name' as nombre,
  raw_user_meta_data->>'role' as rol,
  raw_user_meta_data->>'status' as estado,
  created_at
FROM auth.users
WHERE raw_user_meta_data->>'status' = 'pending_approval'
ORDER BY created_at DESC;
```

3. Clic en **"Run"**
4. Verás una tabla con todos los usuarios pendientes

### Aprobar un Usuario Específico

```sql
-- Aprobar un usuario por email
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data,
  '{status}',
  '"approved"'
)
WHERE email = 'usuario@ejemplo.com';  -- ⚠️ Cambiar por el email real
```

### Aprobar TODOS los Usuarios Pendientes (⚠️ Usar con Cuidado)

```sql
-- Aprobar todos los usuarios pendientes
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data,
  '{status}',
  '"approved"'
)
WHERE raw_user_meta_data->>'status' = 'pending_approval';
```

---

## 🔍 Verificar que Funcionó

Después de aprobar un usuario, puedes verificar con este query:

```sql
-- Ver todos los usuarios aprobados
SELECT 
  email,
  raw_user_meta_data->>'name' as nombre,
  raw_user_meta_data->>'role' as rol,
  raw_user_meta_data->>'status' as estado
FROM auth.users
WHERE raw_user_meta_data->>'status' = 'approved'
ORDER BY created_at DESC;
```

---

## 📱 Flujo Completo de Usuario

### 1. Admin Crea Usuario
- Admin va a "Nadadores" → "Agregar Nadador"
- Completa datos: email, nombre, etc.
- Usuario se crea con `status: "pending_approval"`

### 2. Admin Aprueba Usuario
- Sigue los pasos de esta guía (Dashboard o SQL)
- Cambia status a `"approved"`

### 3. Usuario Inicia Sesión
- Usuario abre la app
- Ingresa email y contraseña
- ✅ Acceso concedido

---

## ⚠️ Errores Comunes

### Error: "Tu cuenta está pendiente de aprobación"

**Causa:** El usuario aún tiene `status: "pending_approval"`

**Solución:** Aprobar el usuario siguiendo esta guía

### Error: No veo al usuario en la lista

**Causa:** El usuario podría no haberse creado correctamente

**Solución:** 
1. Revisa los logs de la consola del navegador (`F12`)
2. Intenta crear el usuario nuevamente
3. Verifica que el email no esté duplicado

### Error al editar metadata en Dashboard

**Causa:** JSON inválido en el campo User Metadata

**Solución:**
- Asegúrate de usar comillas dobles `"` no simples `'`
- No olvides las comas entre propiedades
- Formato correcto:
  ```json
  {
    "name": "Juan",
    "role": "swimmer",
    "status": "approved"
  }
  ```

---

## 🎯 Tips Pro

### Aprobar Usuarios en Lote

Si tienes muchos usuarios pendientes, usa el SQL Editor:

```sql
-- Ver cuántos usuarios están pendientes
SELECT COUNT(*) as total_pendientes
FROM auth.users
WHERE raw_user_meta_data->>'status' = 'pending_approval';

-- Aprobar todos de una vez
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data,
  '{status}',
  '"approved"'
)
WHERE raw_user_meta_data->>'status' = 'pending_approval';
```

### Crear un Usuario ya Aprobado

Si quieres que un usuario específico sea aprobado automáticamente al crearlo:

1. Después de crearlo en la app
2. Inmediatamente ejecuta este SQL:
   ```sql
   UPDATE auth.users
   SET raw_user_meta_data = jsonb_set(
     raw_user_meta_data,
     '{status}',
     '"approved"'
   )
   WHERE email = 'usuario@ejemplo.com';
   ```

---

## ✅ Checklist Rápido

- [ ] Usuario creado desde la aplicación
- [ ] Ir a Supabase Dashboard → Authentication → Users
- [ ] Encontrar al usuario por email
- [ ] Edit User → User Metadata
- [ ] Cambiar `"pending_approval"` → `"approved"`
- [ ] Guardar cambios
- [ ] Usuario puede iniciar sesión ✨

---

## 📞 ¿Necesitas Ayuda?

Si sigues teniendo problemas:

1. **Revisa los logs** en la consola del navegador
2. **Verifica el email** del usuario en Supabase
3. **Confirma el formato** del User Metadata
4. **Intenta el método SQL** si el dashboard no funciona

---

**¡Listo!** Con esta guía podrás aprobar usuarios en segundos. 🎉
