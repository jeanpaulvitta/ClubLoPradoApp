# 🔧 Solución: Missing authorization header

## ❌ Error Específico

```
Test de Registro (Signup): ✗ Error
Error específico: Missing authorization header
```

## 🎯 Causa del Problema

El error "Missing authorization header" ocurre porque la **Edge Function** de Supabase no tiene acceso a las variables de entorno necesarias, específicamente `SUPABASE_SERVICE_ROLE_KEY`.

Cuando el código del servidor intenta ejecutar:

```typescript
const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  // ...
});
```

Supabase necesita el **SERVICE_ROLE_KEY** para poder crear usuarios con permisos de administrador.

## ✅ Solución: Configurar Variables de Entorno en Supabase

### Paso 1: Ir al Dashboard de Supabase

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto (Club Natación Lo Prado)

### Paso 2: Obtener las Keys

1. En el menú lateral, ve a **Settings** (⚙️)
2. Haz clic en **API**
3. Verás dos keys importantes:
   - **Project URL**: `https://[tu-project-id].supabase.co`
   - **anon/public key**: Empieza con `eyJhbGc...`
   - **service_role key** (⚠️ Secret): Empieza con `eyJhbGc...`

⚠️ **MUY IMPORTANTE**: El `service_role` key es secreto y tiene permisos completos de administrador.

### Paso 3: Configurar Variables de Entorno en la Edge Function

Hay dos formas de hacer esto:

#### Opción A: Desde el Dashboard de Supabase (Recomendado)

1. En Supabase Dashboard, ve a **Edge Functions**
2. Selecciona la función **`server`**
3. Haz clic en **Settings** o **Environment Variables**
4. Agrega estas variables:

```
SUPABASE_URL=https://[tu-project-id].supabase.co
SUPABASE_ANON_KEY=[tu-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[tu-service-role-key]
```

5. **Guarda los cambios**
6. **Re-despliega la función** para que tome las nuevas variables

#### Opción B: Usando Supabase CLI (Avanzado)

Si tienes la CLI de Supabase instalada:

```bash
# Configurar secrets
supabase secrets set SUPABASE_URL=https://[tu-project-id].supabase.co
supabase secrets set SUPABASE_ANON_KEY=[tu-anon-key]
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=[tu-service-role-key]

# Re-desplegar la función
supabase functions deploy server
```

### Paso 4: Verificar la Configuración

1. **Espera 1-2 minutos** para que se apliquen los cambios
2. Ve a la pestaña **"Diagnóstico"** en tu app
3. Desplázate hasta **"🔍 Diagnóstico de Supabase"**
4. Haz clic en **"Ejecutar Tests"**

**Resultado esperado:**
```
1. Conexión API: ✓ OK
2. Edge Function Health: ✓ OK
3. Test de Registro (Signup): ✓ OK
```

---

## 🔍 Si NO tienes acceso al Dashboard

Si estás usando Vercel o no tienes acceso directo al Dashboard de Supabase:

### En Vercel:

1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. Settings → Environment Variables
3. Agrega las variables (asegúrate de que estén también para el entorno de producción):

```
SUPABASE_URL=https://[tu-project-id].supabase.co
SUPABASE_ANON_KEY=[tu-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[tu-service-role-key]
```

4. **Re-despliega** la aplicación para que tome las nuevas variables

⚠️ **NOTA**: Las variables en Vercel son para el FRONTEND. Las variables en Supabase Edge Functions son para el BACKEND. Necesitas configurar AMBAS.

---

## 📋 Verificación de Variables de Entorno

Las variables deben estar configuradas en DOS lugares:

### 1. Frontend (Vercel o tu hosting)
- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_ANON_KEY`

### 2. Backend (Supabase Edge Function)
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY` ← **Esta es la clave**

---

## 🧪 Test Manual (Después de Configurar)

Intenta crear un usuario nuevamente:

1. Ve a **"Usuarios"** → **"Nuevo Usuario"**
2. Llena el formulario:
   - Nombre: "Test Coach"
   - Email: "test.coach@ejemplo.com"
   - Rol: "Entrenador"
3. Click en **"Crear Usuario"**

**Resultado esperado:**
```
✅ Usuario creado exitosamente
Credenciales generadas:
Email: test.coach@ejemplo.com
Contraseña: [contraseña temporal]
```

**Si SIGUE fallando:**
```
❌ Error al registrar usuario
```

Entonces revisa la consola del navegador (F12) para ver el error ESPECÍFICO que ahora será más detallado.

---

## 🔄 Diagrama del Flujo

```
Frontend (Vercel)
    ↓
    | Usa VITE_SUPABASE_ANON_KEY
    |
    ↓
Edge Function (Supabase)
    ↓
    | Usa SUPABASE_SERVICE_ROLE_KEY ← Aquí está el problema
    |
    ↓
Supabase Auth
    ↓
    | Crea el usuario
    |
    ✅ Usuario creado
```

Sin `SUPABASE_SERVICE_ROLE_KEY`, la Edge Function no puede autenticarse con Supabase Auth como administrador, por eso dice "Missing authorization header".

---

## 📞 Próximos Pasos

1. **Configura las variables de entorno** en Supabase Edge Functions
2. **Re-despliega** la función (o espera 1-2 minutos)
3. **Ejecuta el diagnóstico** nuevamente desde la app
4. **Intenta crear un usuario**

Si después de esto SIGUE fallando, copia el error COMPLETO de la consola del navegador (F12) y el error específico del diagnóstico.

---

## 🎓 Información Adicional

### ¿Por qué necesitamos el SERVICE_ROLE_KEY?

El `service_role` key bypasa todas las políticas de seguridad (RLS) y permite:
- Crear usuarios sin autenticación previa
- Modificar cualquier dato en la base de datos
- Acceso completo a todas las funciones de admin

Es como tener una "llave maestra" del sistema.

### ¿Es seguro?

Sí, **SOLO** si:
- ✅ La key está en las variables de entorno del SERVIDOR (Edge Function)
- ✅ NUNCA se expone en el código del frontend
- ✅ NUNCA se commitea en Git
- ✅ NUNCA se comparte públicamente

El código que escribimos solo usa esta key en el BACKEND (Edge Function), por lo que es seguro.

---

**Fecha**: 10 de Febrero, 2026  
**Sistema**: Club Natación Lo Prado  
**Error**: Missing authorization header → Falta SERVICE_ROLE_KEY
