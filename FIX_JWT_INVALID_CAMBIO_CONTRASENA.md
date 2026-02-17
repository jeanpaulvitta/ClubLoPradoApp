# 🔧 FIX: Error "Invalid JWT" al Cambiar Contraseña

## ❌ **ERROR REPORTADO**

```
❌ Error al cambiar contraseña: Error: Invalid JWT
Change password error: Error: Invalid JWT
```

---

## 🔍 **CAUSA DEL PROBLEMA**

El error ocurría por **tres problemas principales**:

### 1. **Token Expirado o Inválido**
- Los JWT tokens de Supabase tienen un tiempo de expiración
- Si un usuario ha estado logueado por mucho tiempo, el token puede haber expirado
- El frontend no estaba refrescando el token antes de hacer la petición

### 2. **Uso Incorrecto del Cliente de Supabase en el Middleware**
- El middleware usaba `supabase.auth.getUser(token)` con el SERVICE_ROLE_KEY
- Debería usar `supabaseAuth.auth.getUser(token)` con el ANON_KEY
- Esto causaba problemas de validación del token

### 3. **Falta de Logging Detallado**
- No había suficientes logs para diagnosticar dónde fallaba exactamente
- Los mensajes de error eran genéricos

---

## ✅ **SOLUCIONES IMPLEMENTADAS**

### **1. Mejorado el AuthMiddleware del Backend**

**Archivo:** `/supabase/functions/server/index.tsx`

**Cambios:**

```typescript
// ANTES: Usaba supabase (SERVICE_ROLE_KEY)
const { data: { user }, error } = await supabase.auth.getUser(token);

// DESPUÉS: Usa supabaseAuth (ANON_KEY) - más apropiado para tokens de usuario
const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
```

**Mejoras adicionales:**
- ✅ Validación de token vacío
- ✅ Logging detallado de errores
- ✅ Mensajes de error más descriptivos

---

### **2. Refresh Automático de Token en el Frontend**

**Archivo:** `/src/app/services/auth.ts` - función `changePassword()`

**Cambios principales:**

```typescript
// ANTES: Solo obtenía el token de la sesión local
const session = getSession();
accessToken = session?.accessToken;

// DESPUÉS: Refresca la sesión antes de usar el token
const { data: { session: supabaseSession }, error } = await supabase.auth.refreshSession();
accessToken = supabaseSession.access_token;
```

**Flujo mejorado:**

1. **Intenta refrescar la sesión** con `refreshSession()`
   - ✅ Si tiene éxito: Usa el nuevo token refrescado
   - ✅ Actualiza la sesión local con el nuevo token

2. **Si falla el refresh:** Intenta obtener la sesión actual con `getSession()`
   - ✅ Si hay sesión: Usa ese token
   - ❌ Si no hay sesión: Error claro "Tu sesión ha expirado"

3. **Validación estricta:**
   - Verifica que el token no esté vacío
   - Verifica con `.trim()` para evitar strings con espacios

---

### **3. Logging Completo en el Endpoint de Cambio de Contraseña**

**Archivo:** `/supabase/functions/server/index.tsx` - ruta `/auth/change-password`

**Mejoras:**

```typescript
console.log('🔐 Change password request received');
console.log('📋 Getting user data for:', userId);
console.log('✅ User found:', userData.user.email);
console.log('🔍 Verifying current password...');
console.log('✅ Current password verified');
console.log('🔄 Updating password...');
console.log('✅ Password changed successfully for user:', userId);
```

**Validaciones agregadas:**
- ✅ Verifica que se envíen ambas contraseñas
- ✅ Verifica longitud mínima de la nueva contraseña (6 caracteres)
- ✅ Usa `supabaseAuth` (ANON_KEY) para verificar la contraseña actual
- ✅ Mensajes de error específicos según el tipo de problema

---

### **4. Mejores Mensajes de Error en el UI**

**Archivo:** `/src/app/components/ChangePasswordDialog.tsx`

**Cambios:**

```typescript
// Detecta diferentes tipos de errores y da sugerencias
if (errorMessage.includes('sesión ha expirado') || errorMessage.includes('vuelve a iniciar sesión')) {
  setError(`${errorMessage}\n\nSugerencia: Cierra esta ventana, haz logout y vuelve a iniciar sesión.`);
} else if (errorMessage.includes('contraseña actual es incorrecta')) {
  setError('La contraseña actual es incorrecta. Por favor, verifica e intenta nuevamente.');
} else {
  setError(errorMessage);
}
```

---

## 🎯 **NUEVO FLUJO (CORREGIDO)**

```
Usuario hace click "Cambiar Contraseña"
    ↓
Frontend: refreshSession() con Supabase
    ↓
¿Refresh exitoso?
    ├─ SÍ → Usa token refrescado ✅
    │        Actualiza sesión local
    │        Envía petición al backend
    │            ↓
    │        Backend: authMiddleware valida token con supabaseAuth (ANON_KEY)
    │            ↓
    │        ¿Token válido?
    │            ├─ SÍ → Obtiene userId del contexto
    │            │        Verifica contraseña actual
    │            │        Actualiza a nueva contraseña
    │            │        ✅ Éxito
    │            │
    │            └─ NO → ❌ Error: "Unauthorized - Invalid token"
    │
    └─ NO → Intenta getSession()
             ↓
         ¿Hay sesión?
             ├─ SÍ → Usa ese token
             │        (mismo flujo que arriba)
             │
             └─ NO → ❌ Error: "Tu sesión ha expirado. Por favor, vuelve a iniciar sesión."
```

---

## 🧪 **CÓMO VERIFICAR LA CORRECCIÓN**

### **Prueba 1: Cambio normal de contraseña**

```
1. Login como cualquier usuario
2. Click en avatar → "Cambiar Contraseña"
3. Ingresar contraseña actual y nueva contraseña
4. Click "Cambiar Contraseña"
5. ✅ Debería ver: "Contraseña actualizada exitosamente"
```

**Logs esperados en consola:**

```
🔑 Cambiando contraseña...
🔄 Refrescando sesión de Supabase...
✅ Token obtenido de sesión refrescada
✅ Sesión local actualizada con token refrescado
🔐 Enviando solicitud de cambio de contraseña...
✅ Contraseña cambiada exitosamente
```

---

### **Prueba 2: Sesión expirada (simulado)**

```
1. Login como cualquier usuario
2. Abrir DevTools (F12) → Application → Local Storage
3. Modificar 'supabase_session' para simular token expirado
4. Click en avatar → "Cambiar Contraseña"
5. ❌ Debería ver: "Tu sesión ha expirado. Por favor, vuelve a iniciar sesión."
```

**Solución para el usuario:**
1. Cerrar el diálogo
2. Hacer Logout
3. Volver a hacer Login
4. Intentar cambiar contraseña nuevamente

---

### **Prueba 3: Contraseña actual incorrecta**

```
1. Login como cualquier usuario
2. Click en avatar → "Cambiar Contraseña"
3. Ingresar una contraseña actual INCORRECTA
4. Click "Cambiar Contraseña"
5. ❌ Debería ver: "La contraseña actual es incorrecta"
```

---

## 📋 **ARCHIVOS MODIFICADOS**

| Archivo | Cambios |
|---------|---------|
| `/supabase/functions/server/index.tsx` | • Mejorado authMiddleware<br>• Usa supabaseAuth (ANON_KEY)<br>• Logging detallado<br>• Validaciones en endpoint |
| `/src/app/services/auth.ts` | • Refresh automático de token<br>• Fallback a getSession()<br>• Validación de token vacío<br>• Mensajes de error claros |
| `/src/app/components/ChangePasswordDialog.tsx` | • Mensajes de error mejorados<br>• Sugerencias contextuales |

---

## 🎉 **RESULTADO**

### **Antes:**
- ❌ Error genérico "Invalid JWT"
- ❌ No se sabía por qué fallaba
- ❌ Usuario confundido sin solución

### **Después:**
- ✅ Refresh automático de token
- ✅ Logging completo para debugging
- ✅ Mensajes de error claros
- ✅ Sugerencias de cómo resolver el problema
- ✅ Validaciones robustas

---

## 💡 **MEJORES PRÁCTICAS IMPLEMENTADAS**

1. ✅ **Refresh de tokens antes de operaciones críticas**
2. ✅ **Usar el cliente correcto según el contexto** (ANON_KEY vs SERVICE_ROLE_KEY)
3. ✅ **Logging detallado** para debugging
4. ✅ **Validaciones exhaustivas** de entrada
5. ✅ **Mensajes de error descriptivos** con sugerencias
6. ✅ **Manejo de casos edge** (token vacío, sesión expirada, etc.)

---

## 🔐 **SEGURIDAD**

- ✅ Se verifica la contraseña actual antes de cambiar
- ✅ Se valida el token JWT en cada petición
- ✅ Se usa SERVICE_ROLE_KEY solo para operaciones administrativas
- ✅ Se usa ANON_KEY para validación de tokens de usuario
- ✅ Longitud mínima de contraseña validada (6 caracteres)

---

## 📚 **REFERENCIAS**

- **Supabase Auth Docs:** https://supabase.com/docs/guides/auth
- **JWT Best Practices:** https://supabase.com/docs/guides/auth/sessions
- **Refresh Tokens:** https://supabase.com/docs/reference/javascript/auth-refreshsession

---

**Fecha de fix:** 17 de febrero de 2026  
**Versión:** 2.1.0  
**Estado:** ✅ Resuelto y probado
