# 🔐 Instrucciones para Primer Login

## 📋 **Información Importante**

La aplicación del Club Natación Lo Prado ahora tiene un sistema de auto-creación del usuario administrador principal.

---

## 🚀 **Primer Login - Usuario Administrador**

### **Credenciales por Defecto:**

```
Email: admin@loprado.cl
Contraseña: (la que elijas en el primer intento de login)
```

### **Flujo de Primer Login:**

1. **Abre la aplicación** en tu navegador
2. **Ingresa las credenciales:**
   - Email: `admin@loprado.cl`
   - Contraseña: Elige una contraseña segura (mínimo 6 caracteres)
3. **Click en "Iniciar Sesión"**

### **¿Qué sucede automáticamente?**

```
1. Sistema detecta que admin@loprado.cl no existe
           ↓
2. Llama al backend para crear el usuario automáticamente
           ↓
3. Backend crea usuario con:
   - Email: admin@loprado.cl
   - Contraseña: la que ingresaste
   - Rol: admin
   - Nombre: Administrador
   - Email confirmado: ✅ Sí
           ↓
4. Sistema autentica automáticamente
           ↓
5. ✅ Login exitoso - Ya estás dentro!
```

---

## 🔧 **Logs que Verás (Consola del Navegador):**

### **Primer Login Exitoso:**

```console
🔐 LOGIN - Autenticando: admin@loprado.cl
🔗 API URL: https://[tu-proyecto].supabase.co/functions/v1/make-server-4909a0bc
🔄 Intentando autenticación con Supabase...
❌ Error de autenticación: Invalid login credentials
👑 Usuario admin no existe, intentando crear automáticamente...
✅ Usuario admin creado y autenticado
✅ Login completado: admin@loprado.cl Rol: admin
```

### **Logins Siguientes:**

```console
🔐 LOGIN - Autenticando: admin@loprado.cl
🔗 API URL: https://[tu-proyecto].supabase.co/functions/v1/make-server-4909a0bc
🔄 Intentando autenticación con Supabase...
✅ Autenticación exitosa: admin@loprado.cl
✅ Login completado: admin@loprado.cl Rol: admin
```

---

## ⚠️ **Solución de Problemas**

### **Problema 1: "Invalid login credentials" después del primer login**

**Causa:** Ya creaste el usuario pero la contraseña es incorrecta

**Solución:**
```
1. Intenta recordar la contraseña que usaste la primera vez
2. Si no la recuerdas:
   - Opción A: Usar "Olvidé mi contraseña" (si está configurado el email)
   - Opción B: Contactar al desarrollador para reset manual
   - Opción C: Eliminar el usuario desde Supabase Dashboard y volver a crear
```

### **Problema 2: "Invalid JWT" al cambiar contraseña**

**Causa:** El token de sesión expiró

**Solución:**
```
1. Cerrar sesión
2. Volver a iniciar sesión
3. Intentar cambiar contraseña nuevamente
```

**Nota:** El sistema ahora maneja esto automáticamente refrescando el token

### **Problema 3: No se puede crear el admin automáticamente**

**Logs de error:**
```
❌ Error al crear admin: Error al crear usuario admin
```

**Solución Manual desde Supabase Dashboard:**

1. **Ir a Supabase Dashboard**
2. **Authentication → Users → Add user**
3. **Ingresar:**
   - Email: `admin@loprado.cl`
   - Password: (elige una contraseña)
   - Auto-confirm: ✅ Yes
   - User Metadata (JSON):
     ```json
     {
       "name": "Administrador",
       "role": "admin"
     }
     ```
4. **Create user**
5. **Volver a la app e iniciar sesión**

---

## 🔐 **Cambiar Contraseña después del Primer Login**

### **Pasos:**

1. **Login exitoso** como admin@loprado.cl
2. **Click en tu avatar** (esquina superior derecha)
3. **Click en "Cambiar Contraseña"**
4. **Ingresar:**
   - Contraseña actual: (la que usaste en el login)
   - Nueva contraseña: (tu nueva contraseña segura)
   - Confirmar nueva contraseña: (repetir)
5. **Click "Cambiar Contraseña"**
6. ✅ **Listo!**

### **Logs Esperados:**

```console
🔑 Cambiando contraseña...
🔄 Obteniendo sesión actual de Supabase...
✅ Token obtenido de sesión actual
⏰ Token expira en 3600 segundos
🔐 Enviando solicitud de cambio de contraseña...
🔐 Change password request received
📋 Getting user data for: [user-id]
✅ User found: admin@loprado.cl
🔍 Verifying current password...
✅ Current password verified
🔄 Updating password...
✅ Password changed successfully
✅ Contraseña cambiada exitosamente
🔄 Refrescando sesión después del cambio...
✅ Sesión actualizada después del cambio de contraseña
```

---

## 👥 **Crear Otros Usuarios (Entrenadores, Nadadores)**

### **Desde el Panel de Administración:**

1. **Login como admin**
2. **Ir a la pestaña "Nadadores"**
3. **Click en "Solicitudes de Acceso"**
4. **Aprobar solicitudes pendientes** o **crear usuarios directamente**

### **Roles Disponibles:**

| Rol | Permisos |
|-----|----------|
| **admin** | Acceso completo - Gestión total del sistema |
| **coach** | Entrenador - Ver y editar entrenamientos, nadadores, competencias |
| **swimmer** | Nadador - Ver su progreso, entrenamientos, competencias |

---

## 📊 **Verificar Usuario Admin desde Supabase**

### **Pasos:**

1. **Ir a Supabase Dashboard**
2. **Authentication → Users**
3. **Buscar:** `admin@loprado.cl`
4. **Verificar:**
   - ✅ Email: admin@loprado.cl
   - ✅ Email confirmed: true
   - ✅ User Metadata → role: "admin"
   - ✅ User Metadata → name: "Administrador"

---

## 🔍 **Debugging - Verificar Configuración**

### **Health Check del Backend:**

```
GET https://[tu-proyecto].supabase.co/functions/v1/make-server-4909a0bc/health
```

**Respuesta Esperada:**

```json
{
  "status": "ok",
  "timestamp": "2026-02-17T...",
  "version": "2.0.4",
  "environment": {
    "SUPABASE_URL": true,
    "SUPABASE_SERVICE_ROLE_KEY": true,
    "SUPABASE_ANON_KEY": true
  },
  "message": "✅ All environment variables configured correctly"
}
```

---

## 🎯 **Resumen Rápido**

### **Para Primer Login:**

```bash
1. Abrir app
2. Email: admin@loprado.cl
3. Contraseña: (la que quieras)
4. Click "Iniciar Sesión"
5. ✅ Usuario creado automáticamente
6. ✅ Ya estás dentro!
```

### **Para Logins Siguientes:**

```bash
1. Abrir app
2. Email: admin@loprado.cl
3. Contraseña: (la que elegiste)
4. Click "Iniciar Sesión"
5. ✅ Login exitoso
```

---

## 📞 **Soporte**

Si tienes problemas:

1. **Revisar logs de consola** del navegador (F12 → Console)
2. **Revisar logs del backend** en Supabase Dashboard → Edge Functions → server → Logs
3. **Verificar que las variables de entorno estén configuradas** (Health check)
4. **Contactar al desarrollador** con capturas de pantalla de los logs

---

**Fecha:** 17 de febrero de 2026  
**Sistema:** Club Natación Lo Prado  
**Versión:** 2.0.4
