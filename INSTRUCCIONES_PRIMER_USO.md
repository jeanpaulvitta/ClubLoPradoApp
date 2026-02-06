# 🎯 Instrucciones para Primer Uso - Club Natación Lo Prado

## 🔐 Sistema Migrado a Supabase Auth

El sistema ahora usa **autenticación real** con Supabase. Todos los datos se almacenan en el servidor.

---

## 📝 Pasos para Configuración Inicial

### 1. Crear el Primer Usuario Administrador

Tienes dos opciones:

#### Opción A: Desde Supabase Dashboard (Recomendado)

1. Ve a **Supabase Dashboard** → **Authentication** → **Users**
2. Click en **"Add user"** → **"Create new user"**
3. Completa:
   - **Email**: `admin@loprado.cl` (o tu email)
   - **Password**: Elige una contraseña segura
   - **Auto Confirm User**: ✅ (activar)
   - **User Metadata**: Agregar este JSON:
     ```json
     {
       "name": "Administrador",
       "role": "admin"
     }
     ```
4. Click en **"Create user"**

#### Opción B: Desde la API (Avanzado)

Ejecuta este comando `curl` (reemplaza los valores):

```bash
curl -X POST \
  https://[TU-PROYECTO].supabase.co/functions/v1/make-server-4909a0bc/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@loprado.cl",
    "password": "TuContraseñaSegura123",
    "name": "Administrador",
    "role": "admin"
  }'
```

---

### 2. Primer Login

1. Abre la aplicación en tu navegador
2. En la pantalla de login, ingresa:
   - **Email**: El email que creaste
   - **Password**: La contraseña que configuraste
3. Click en **"Iniciar Sesión"**

✅ Si todo está correcto, serás redirigido al dashboard principal.

---

### 3. Crear Usuarios para Nadadores y Entrenadores

Una vez logueado como administrador:

1. Ve a la pestaña **"⚙️ Gestión de Usuarios"**
2. Click en **"Crear Usuario"**
3. Completa el formulario:
   - **Nombre**: Nombre del usuario
   - **Email**: Email único (ej: `nadador1@loprado.cl`)
   - **Rol**: Selecciona `Nadador` o `Entrenador`
4. Click en **"Crear Usuario"**
5. **IMPORTANTE**: Se generará una contraseña temporal que debes copiar y entregar al usuario

---

## 🔑 Gestión de Contraseñas

### Cambiar Contraseña (Usuario)

1. Click en tu nombre (esquina superior derecha)
2. Selecciona **"Cambiar Contraseña"**
3. Ingresa:
   - Contraseña actual
   - Nueva contraseña
   - Confirmar nueva contraseña
4. Click en **"Cambiar Contraseña"**

### Resetear Contraseña (Administrador)

Si un usuario olvidó su contraseña:

1. Ve a **Supabase Dashboard** → **Authentication** → **Users**
2. Busca al usuario
3. Click en los "..." → **"Reset password"**
4. Supabase enviará un email (o puedes asignar una nueva contraseña manualmente)

---

## 🏊 Gestión de Nadadores

### Asociar Usuario con Nadador

Cuando creas un usuario con rol "Nadador", el sistema automáticamente:
1. Crea el usuario en Supabase Auth
2. Crea un perfil de nadador en la base de datos
3. Asocia ambos mediante `userId`

### Agregar Nadador Manualmente

1. Ve a la pestaña **"👥 Nadadores"**
2. Click en **"Agregar Nadador"**
3. Completa todos los datos del nadador
4. Click en **"Guardar"**

---

## ⚠️ Problemas Comunes

### "Error al iniciar sesión"
- ✅ Verifica que el email y contraseña sean correctos
- ✅ Asegúrate de que el usuario esté creado en Supabase
- ✅ Verifica que el servidor backend esté activo

### "No se puede conectar al servidor"
- ✅ Verifica la URL del proyecto en `/utils/supabase/info`
- ✅ Revisa los logs del Edge Function en Supabase Dashboard
- ✅ Verifica que las credenciales estén configuradas

### "Token expirado"
- ✅ Cierra sesión y vuelve a iniciar sesión
- ✅ El sistema debería renovar el token automáticamente

---

## 🔧 Verificación del Sistema

### Verificar Salud del Backend

Puedes verificar que el backend esté funcionando:

```bash
curl https://[TU-PROYECTO].supabase.co/functions/v1/make-server-4909a0bc/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-29T..."
}
```

### Ver Diagnóstico del Sistema

1. Inicia sesión como administrador
2. En el menú principal, busca **"Diagnóstico del Sistema"**
3. Click en **"Verificar"** para ejecutar todas las pruebas

---

## 📊 Estructura de Roles

### Admin (Administrador)
- ✅ Acceso completo a todas las funciones
- ✅ Puede crear/editar/eliminar usuarios
- ✅ Puede gestionar nadadores, competencias, entrenamientos
- ✅ Puede ver todas las estadísticas

### Coach (Entrenador)
- ✅ Puede ver información de nadadores
- ✅ Puede registrar asistencia
- ✅ Puede ver estadísticas
- ❌ No puede crear/eliminar usuarios
- ❌ No puede eliminar nadadores

### Swimmer (Nadador)
- ✅ Puede ver su propia información
- ✅ Puede ver sus marcas personales
- ✅ Puede ver su historial de asistencia
- ❌ No puede ver información de otros nadadores
- ❌ No puede editar datos

---

## 🎯 Próximos Pasos

1. **Crear usuarios** para todos los nadadores y entrenadores
2. **Configurar categorías** según año de nacimiento
3. **Registrar marcas mínimas** para competencias
4. **Planificar entrenamientos** usando el sistema de mesociclos
5. **Registrar asistencia** regularmente
6. **Actualizar marcas personales** después de cada competencia

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa los **logs del navegador** (F12 → Console)
2. Revisa los **logs del Edge Function** en Supabase Dashboard
3. Ejecuta el **"Diagnóstico del Sistema"** en la aplicación
4. Verifica la **documentación de migración** en `/MIGRACION_SUPABASE.md`

---

**Versión del Sistema**: 2.0.0 (Supabase Auth)
**Fecha**: Enero 29, 2026
**Estado**: ✅ Producción
