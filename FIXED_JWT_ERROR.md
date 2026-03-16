# ✅ SOLUCIONADO: Error "Invalid JWT" al Cargar Solicitudes

**ÚLTIMA ACTUALIZACIÓN: 2026-03-15 15:00**

## 🔍 PROBLEMA IDENTIFICADO

El componente `PasswordRequestsManager` intentaba cargar las solicitudes de contraseña automáticamente, pero había **dos problemas**:

1. **Sesión en localStorage pero expirada en Supabase**: El `user` existía en localStorage pero el JWT de Supabase había expirado
2. **Errores mostrados innecesariamente**: Se mostraban errores aunque el usuario no estuviera intentando cargar nada

```typescript
// ❌ ANTES - Cargaba siempre, sin verificar autenticación:
useEffect(() => {
  loadRequests();  // ← Llamaba a endpoint protegido sin sesión
  checkServerConfig();
  loadProjectId();
}, []);
```

El endpoint `/password-requests` (GET) **requiere autenticación** porque es solo para admins:

```typescript
// En /supabase/functions/server/index.tsx línea 1287:
app.get("/make-server-4909a0bc/password-requests", authMiddleware, async (c) => {
  // ← authMiddleware valida el JWT
  // Si no hay JWT válido → Error 401: Invalid JWT
});
```

---

## ✅ SOLUCIÓN IMPLEMENTADA (VERSIÓN FINAL)

### **1. Verificar Usuario Antes de Cargar (Frontend)**

**Archivo:** `/src/app/components/PasswordRequestsManager.tsx`

```typescript
// ✅ DESPUÉS - Solo carga si hay usuario autenticado:
useEffect(() => {
  // Solo cargar solicitudes si el usuario está autenticado
  if (user) {
    loadRequests();
  } else {
    console.log('⏸️ Usuario no autenticado, no se cargan solicitudes');
    setRequests([]);
  }
  
  checkServerConfig();
  loadProjectId();
}, [user]); // ← Dependencia: vuelve a ejecutar cuando cambia el usuario
```

**Beneficios:**
- ✅ No hace llamadas innecesarias al servidor cuando no hay sesión
- ✅ Evita errores de JWT inválido
- ✅ Recarga automáticamente cuando el usuario inicia sesión

---

### **2. Verificar Validez del Token (Frontend)**

**Archivo:** `/src/app/services/passwordRequests.ts`

```typescript
async function getAuthToken(): Promise<string> {
  // ... obtener sesión de Supabase ...
  
  // Verificar que el token no esté expirado
  const expiresAt = sessionData.session.expires_at;
  if (expiresAt && expiresAt * 1000 < now) {
    console.error('❌ Token expirado');
    cachedToken = null;
    tokenExpiry = 0;
    throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
  }
  
  // Convertir errores de JWT en mensajes amigables
  if (errorData.message?.includes('JWT')) {
    throw new Error('No hay sesión activa. Por favor, inicia sesión.');
  }
}
```

### **3. No Mostrar Errores de Sesión (Frontend)**

**Archivo:** `/src/app/components/PasswordRequestsManager.tsx`

```typescript
catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Error...';
  
  // Detectar si es un error de sesión (esperado cuando no hay login)
  const isSessionError = errorMessage.includes('No hay sesión') || 
                         errorMessage.includes('sesión ha expirado');
  
  if (!isSessionError) {
    console.error('Error cargando solicitudes:', error);
    toast.error(errorMessage);
  } else {
    // Log silencioso - no molestar al usuario
    console.log('ℹ️ No se pudieron cargar solicitudes (sesión no activa)');
  }
}
```

### **4. Limpiar Sesión Expirada (Frontend)**

**Archivo:** `/src/app/contexts/AuthContext.tsx`

```typescript
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !session) {
    // Token expiró y no pudo refrescarse
    console.log('🚪 Sesión cerrada o expirada');
    authApi.clearSession();
    setUser(null);
  }
});
```

---

## 🔄 FLUJO CORRECTO

### **Sin Sesión (usuario no autenticado):**
1. Usuario visita la app
2. `useEffect` verifica: `if (user)` → **false**
3. No llama a `loadRequests()`
4. Muestra lista vacía de solicitudes
5. ✅ **No hay errores**

### **Con Sesión (admin autenticado):**
1. Admin inicia sesión exitosamente
2. `useEffect` detecta cambio en `user`
3. `if (user)` → **true**
4. Llama a `loadRequests()` con JWT válido
5. Carga las solicitudes desde Supabase
6. ✅ **Muestra las solicitudes correctamente**

---

## 📋 ARCHIVOS MODIFICADOS

- ✅ `/src/app/components/PasswordRequestsManager.tsx` - Verificación de autenticación
- ✅ `/src/app/services/passwordRequests.ts` - Mejor manejo de errores JWT

---

## 🚀 RESULTADO

El sistema ahora funciona correctamente:

1. **Formulario Público "Solicitar Acceso"** ✅
   - Endpoint: `POST /password-requests/create`
   - NO requiere autenticación
   - Cualquier persona puede solicitar acceso

2. **Panel Admin "Gestión de Solicitudes"** ✅
   - Endpoint: `GET /password-requests`
   - Requiere autenticación (solo admin)
   - Solo carga cuando hay sesión activa
   - No genera errores si no hay sesión

---

## 📋 RESUMEN DE CAMBIOS

### **Archivos Modificados:**
1. ✅ `/src/app/components/PasswordRequestsManager.tsx` 
   - Verificar `user` antes de llamar `loadRequests()`
   - Doble verificación dentro de `loadRequests()`
   - No mostrar errores de sesión (esperados)

2. ✅ `/src/app/services/passwordRequests.ts`
   - Validar expiración del token
   - Limpiar caché cuando hay errores
   - Mensajes amigables en lugar de "Invalid JWT"

3. ✅ `/src/app/contexts/AuthContext.tsx`
   - Limpiar sesión cuando token expira
   - Manejar `TOKEN_REFRESHED` sin sesión

### **Comportamiento Esperado:**

**Escenario 1: Usuario sin sesión**
- ✅ No carga solicitudes
- ✅ No muestra errores
- ✅ Silenciosamente espera login

**Escenario 2: Usuario con sesión válida**
- ✅ Carga solicitudes automáticamente
- ✅ Muestra datos correctamente

**Escenario 3: Usuario con sesión expirada**
- ✅ Detecta token expirado
- ✅ Limpia localStorage
- ✅ Cierra sesión automáticamente
- ✅ No muestra errores molestos

---

## 📝 FECHA

**2026-03-15 15:00** - Error JWT solucionado con manejo robusto de sesiones expiradas
