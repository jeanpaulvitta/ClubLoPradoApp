# 🔍 Diagnóstico: Entrenador no puede ver entrenamientos

## 🎯 Problema Reportado

Un entrenador reporta que no puede ver los entrenamientos en su cuenta.

## ✅ Verificación del Sistema

El código está configurado correctamente:

### 1. **Verificación de permisos en WorkoutManager.tsx**

```tsx
const isAdmin = user?.role === "admin" || user?.role === "coach";
```

✅ Los entrenamientos están permitidos para roles: `admin` y `coach`

### 2. **Verificación de visualización en App.tsx (línea 1287)**

```tsx
{(user?.role === "admin" || user?.role === "coach") && (
  <div className="space-y-4">
    {/* Gestión de Entrenamientos */}
    <WorkoutManager ... />
  </div>
)}
```

✅ La sección de entrenamientos está habilitada para `admin` y `coach`

### 3. **Verificación del servidor**

El endpoint `GET /workouts` NO filtra por rol - devuelve todos los entrenamientos activos a cualquier usuario autenticado.

✅ El servidor está funcionando correctamente

---

## 🔍 Pasos para Diagnosticar el Problema

### Paso 1: Verificar el rol del usuario en la base de datos

**Como administrador:**

1. Ve a la pestaña **"Usuarios"** (solo visible para admin)
2. Busca al entrenador en la lista
3. Verifica que su rol sea **"coach"**

**Síntomas posibles:**
- ❌ Si el rol es "swimmer" → El usuario fue creado con rol incorrecto
- ❌ Si no aparece en la lista → El usuario no existe en el sistema

### Paso 2: Verificar el rol en el navegador del entrenador

**Pídele al entrenador que:**

1. Abra la aplicación
2. Haga clic en su **avatar** (círculo con iniciales) en la esquina superior derecha
3. Verifique el badge de rol que aparece

**Roles esperados:**
- 🔴 **Administrador** (rojo) → Puede ver todo
- 🔵 **Entrenador** (azul) → Puede ver entrenamientos
- 🟢 **Nadador** (verde) → NO puede ver gestión de entrenamientos

### Paso 3: Verificar en la consola del navegador

**Pídele al entrenador que:**

1. Presione **F12** para abrir las herramientas de desarrollo
2. Vaya a la pestaña **"Console"**
3. Escriba este comando y presione Enter:

```javascript
JSON.parse(localStorage.getItem('supabase_session'))
```

4. **Envíate una captura de pantalla** del resultado

**Lo que deberías ver:**
```json
{
  "id": "...",
  "email": "entrenador@email.com",
  "role": "coach",  ← ⚠️ ESTE DEBE SER "coach"
  "name": "Nombre del Entrenador",
  "accessToken": "..."
}
```

**Si el `role` NO es "coach":**
- ❌ El usuario tiene el rol incorrecto asignado

---

## 🛠️ Soluciones según el Problema

### Problema 1: El rol es "swimmer" en lugar de "coach"

**Solución A: Crear una nueva cuenta con rol correcto**

1. Como admin, ve a **"Usuarios"**
2. Crea una nueva cuenta para el entrenador
3. **IMPORTANTE**: Selecciona rol **"Entrenador"**
4. Envía las credenciales al entrenador
5. Elimina la cuenta antigua (opcional)

**Solución B: Corregir el rol en Supabase directamente**

Necesitarías acceso al Dashboard de Supabase:

1. Ve a [supabase.com](https://supabase.com) → Tu proyecto
2. Authentication → Users
3. Encuentra al usuario por email
4. Edita el campo `user_metadata` → `role` → cambia a `"coach"`
5. Guarda los cambios
6. Pídele al entrenador que **cierre sesión y vuelva a iniciar sesión**

### Problema 2: El usuario no existe

Si el usuario no aparece en la lista de usuarios:

1. Solicita al entrenador que solicite acceso desde el formulario de login
2. Como admin, aprueba la solicitud con rol "Entrenador"
3. Envía las credenciales generadas

### Problema 3: La sesión está desactualizada

Si el rol en localStorage no coincide con el rol en la base de datos:

**Pídele al entrenador que:**

1. Cierre sesión completamente
2. **Borre el caché** del navegador (Ctrl + Shift + Delete)
3. Vuelva a iniciar sesión

**O desde la consola (F12):**

```javascript
// Limpiar sesión
localStorage.removeItem('supabase_session');
localStorage.clear();

// Recargar página
location.reload();
```

Luego que vuelva a iniciar sesión.

---

## 📋 Checklist de Verificación

Marca cada item que hayas verificado:

- [ ] ✅ El entrenador tiene rol "coach" en la base de datos
- [ ] ✅ El entrenador ve badge azul "Entrenador" en su avatar
- [ ] ✅ localStorage muestra `"role": "coach"`
- [ ] ✅ El entrenador ha cerrado y vuelto a iniciar sesión
- [ ] ✅ El caché del navegador ha sido limpiado
- [ ] ✅ Los entrenamientos existen en el sistema (hay al menos 1 entrenamiento creado)

---

## 🎯 Si TODO está correcto y AÚN no ve los entrenamientos

### Prueba Final: Verificar que hay entrenamientos

**Como admin:**

1. Ve a la pestaña **"Entrenamientos"**
2. Verifica que hay entrenamientos creados
3. Verifica el mensaje en la parte superior:
   - ✅ "✅ Sistema de Entrenamientos Activo - X entrenamientos cargados"
   - ❌ "⚠️ No hay entrenamientos en la base de datos"

**Si NO hay entrenamientos:**
- Los entrenadores (coaches) pueden ver la sección pero estará vacía
- Necesitas importar o crear entrenamientos primero

**Como entrenador debe ver:**
- La sección "Entrenamientos" en el menú de pestañas
- Los bloques de la temporada
- El botón para cambiar entre Grupo 1 y Grupo 2
- La lista de entrenamientos organizados por mesociclo

**Como entrenador NO debe ver (solo admin):**
- Botones de "Importar Grupo 2"
- Botón de "Editor Masivo"
- Botón de "Verificador de Bloques"

---

## 📞 Información para Soporte

Si ninguna de estas soluciones funciona, necesitarás:

### Del entrenador:
1. Captura de pantalla del avatar con el badge visible
2. Captura de pantalla de la pestaña "Entrenamientos" (lo que ve)
3. Resultado de `localStorage.getItem('supabase_session')` en consola

### Del admin:
1. Captura de pantalla de la lista de usuarios mostrando al entrenador
2. Confirmar que hay entrenamientos creados en el sistema
3. Captura del mensaje de estado en la pestaña "Entrenamientos"

---

## 🔄 Script de Emergencia: Forzar Actualización de Rol

Si necesitas forzar la actualización del rol del entrenador, puedes ejecutar esto como administrador en la consola (F12) mientras estás en la pestaña "Usuarios":

```javascript
// NOTA: Esto requiere que implementes esta funcionalidad en el servidor
// Por ahora, la única forma segura es recrear el usuario
```

---

## ✅ Solución Más Probable

**En el 90% de los casos, el problema es uno de estos:**

1. ✅ **Rol incorrecto** - El usuario fue creado como "swimmer" en vez de "coach"
   - **Solución**: Recrear cuenta con rol "Entrenador"

2. ✅ **Sesión desactualizada** - El rol se corrigió pero el navegador tiene caché antiguo
   - **Solución**: Cerrar sesión, limpiar caché, volver a iniciar sesión

3. ✅ **No hay entrenamientos** - El sistema está vacío
   - **Solución**: Importar entrenamientos del Grupo 2 o crear manualmente

---

## 📝 Notas Técnicas

### Estructura de Roles en el Sistema

```typescript
type UserRole = 'admin' | 'coach' | 'swimmer';

// Permisos de la sección "Entrenamientos":
- admin: ✅ Ver y gestionar (todos los controles)
- coach: ✅ Ver y gestionar (controles limitados)
- swimmer: ❌ No puede acceder a esta sección
```

### Dónde se almacena el rol

1. **Supabase Auth** (`user_metadata.role`)
2. **localStorage** (`supabase_session.role`)
3. **Contexto de React** (`AuthContext.user.role`)

Los tres deben estar sincronizados. Si no lo están, hay un problema de autenticación.

---

**Fecha**: 10 de Febrero, 2026  
**Sistema**: Club Natación Lo Prado - App de Entrenamientos  
**Versión**: 2.0 (Supabase Migration)
