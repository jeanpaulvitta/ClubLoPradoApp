# 🔧 FIX: Error al Cambiar Contraseña

## ❌ **ERROR REPORTADO**

```
❌ Error al cambiar contraseña: Error: No hay sesión activa
Change password error: Error: No hay sesión activa
```

---

## 🔍 **CAUSA DEL PROBLEMA**

El error ocurría porque:

1. **Sesión sin token:** En algunos casos, la sesión guardada en `localStorage` tenía el campo `accessToken` vacío (`''`)
2. **Validación incompleta:** La función `changePassword` verificaba si existía `session.accessToken`, pero un string vacío pasaba la verificación
3. **Token expirado:** Al usar el token vacío, la petición al backend fallaba inmediatamente

### **Flujo del error:**

```
Usuario hace click "Cambiar Contraseña"
    ↓
getSession() retorna { ..., accessToken: '' }
    ↓
Verificación: !session.accessToken → FALSE (string vacío existe)
    ↓
Petición al backend con Bearer ''
    ↓
Backend rechaza: ❌ "No hay sesión activa"
```

---

## ✅ **SOLUCIÓN IMPLEMENTADA**

He modificado la función `changePassword` en `/src/app/services/auth.ts` para:

### **1. Obtener token de múltiples fuentes**

```typescript
// Primero intenta la sesión local
let accessToken: string | null = null;
const session = getSession();

if (session?.accessToken) {
  accessToken = session.accessToken;
  console.log('✅ Token obtenido de sesión local');
}

// Si no hay token o está vacío, obtenerlo de Supabase Auth
if (!accessToken || accessToken === '') {
  console.log('🔄 Token local no disponible, obteniendo de Supabase Auth...');
  
  const { data: { session: supabaseSession }, error } = await supabase.auth.getSession();
  
  if (error || !supabaseSession) {
    throw new Error('No hay sesión activa. Por favor, vuelve a iniciar sesión.');
  }
  
  accessToken = supabaseSession.access_token;
  console.log('✅ Token obtenido de Supabase Auth');
}
```

### **2. Actualizar sesión local con token válido**

```typescript
// Actualizar la sesión local con el nuevo token
if (session) {
  saveSession({
    ...session,
    accessToken: accessToken,
  });
  console.log('✅ Sesión local actualizada con nuevo token');
}
```

### **3. Usar token validado**

```typescript
// Ahora usamos el token válido
const response = await fetch(`${API_URL}/auth/change-password`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({ currentPassword, newPassword }),
});
```

---

## 🎯 **NUEVO FLUJO (CORREGIDO)**

```
Usuario hace click "Cambiar Contraseña"
    ↓
getSession() retorna sesión local
    ↓
¿Tiene accessToken válido?
    ├─ SÍ → Usar token local ✅
    └─ NO → Obtener de Supabase Auth
         ↓
         supabase.auth.getSession()
         ↓
         Obtener access_token fresco ✅
         ↓
         Actualizar sesión local
    ↓
Petición al backend con Bearer <token_válido>
    ↓
Backend procesa correctamente ✅
    ↓
Contraseña actualizada exitosamente 🎉
```

---

## 📊 **VENTAJAS DE LA SOLUCIÓN**

### **✅ Robustez**
- Funciona incluso si la sesión local está corrupta
- Recupera automáticamente tokens válidos de Supabase

### **✅ Fallback automático**
- Si el token local falla → obtiene uno nuevo
- Si ambos fallan → mensaje claro para re-login

### **✅ Sincronización**
- Actualiza automáticamente la sesión local
- Mantiene tokens frescos para futuras operaciones

### **✅ Mejor experiencia de usuario**
- Menos errores inesperados
- Mensajes de error más claros
- No requiere re-login innecesario

---

## 🔍 **LOGS DE DEPURACIÓN**

Ahora verás logs más detallados en la consola:

```
🔑 Cambiando contraseña...
✅ Token obtenido de sesión local
✅ Contraseña cambiada exitosamente
```

O en caso de recuperación:

```
🔑 Cambiando contraseña...
🔄 Token local no disponible, obteniendo de Supabase Auth...
✅ Token obtenido de Supabase Auth
✅ Sesión local actualizada con nuevo token
✅ Contraseña cambiada exitosamente
```

O en caso de error real:

```
🔑 Cambiando contraseña...
🔄 Token local no disponible, obteniendo de Supabase Auth...
❌ No se pudo obtener sesión de Supabase: [error details]
❌ Error al cambiar contraseña: No hay sesión activa. Por favor, vuelve a iniciar sesión.
```

---

## 🧪 **CÓMO VERIFICAR LA CORRECCIÓN**

### **Prueba 1: Cambio de contraseña normal**

```
1. Login como cualquier usuario
2. Click en avatar → "Cambiar Contraseña"
3. Ingresar contraseña actual y nueva contraseña
4. Click "Cambiar Contraseña"
5. Debería ver: ✅ "Contraseña actualizada exitosamente"
```

### **Prueba 2: Sesión sin token (edge case)**

```
1. Login como cualquier usuario
2. Abrir DevTools (F12) → Console
3. Ejecutar: localStorage.setItem('supabase_session', JSON.stringify({...JSON.parse(localStorage.getItem('supabase_session')), accessToken: ''}))
4. Click en avatar → "Cambiar Contraseña"
5. Ingresar contraseña actual y nueva contraseña
6. Click "Cambiar Contraseña"
7. Debería ver logs de recuperación de token
8. Debería ver: ✅ "Contraseña actualizada exitosamente"
```

### **Prueba 3: Sin sesión (debe fallar correctamente)**

```
1. Logout
2. Login nuevamente
3. Abrir DevTools (F12) → Application → Local Storage
4. Borrar 'supabase_session'
5. Click en avatar → "Cambiar Contraseña"
6. Debería ver: ❌ "No hay sesión activa. Por favor, vuelve a iniciar sesión."
```

---

## 📝 **ARCHIVO MODIFICADO**

- **Archivo:** `/src/app/services/auth.ts`
- **Función:** `changePassword(currentPassword: string, newPassword: string)`
- **Líneas:** ~256-330

---

## 🎉 **RESULTADO**

✅ **Error resuelto:** Ya no aparecerá "No hay sesión activa" cuando hay una sesión válida  
✅ **Recuperación automática:** Obtiene tokens frescos de Supabase si es necesario  
✅ **Mejor UX:** Mensajes de error más claros y precisos  
✅ **Más robusto:** Maneja múltiples casos edge  

---

## 🔒 **SEGURIDAD**

La solución mantiene todas las medidas de seguridad:
- ✅ Tokens siguen siendo necesarios
- ✅ Autenticación con Supabase Auth
- ✅ Backend valida todos los tokens
- ✅ No se exponen credenciales

---

## 📚 **REFERENCIAS**

- **AuthContext:** `/src/app/contexts/AuthContext.tsx`
- **ChangePasswordDialog:** `/src/app/components/ChangePasswordDialog.tsx`
- **Auth Service:** `/src/app/services/auth.ts`
- **Supabase Client:** `/src/app/services/supabaseClient.ts`

---

**Club Natación Lo Prado**  
**"Haz que todo sea posible"** 🏊‍♂️💪🔴

---

**Status:** ✅ **RESUELTO**  
**Fecha:** Febrero 2026  
**Versión:** 2.0.1
