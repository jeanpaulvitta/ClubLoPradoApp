# 🚨 CONFIGURACIÓN CRÍTICA REQUERIDA

## ❌ Errores Actuales

Actualmente la aplicación del Club Natación Lo Prado presenta dos errores críticos relacionados:

1. **Error al actualizar entrenamientos**: `Error: Internal server error (Cloudflare 500)`
2. **Error al registrar usuarios**: `Missing authorization header`

**Ambos errores tienen la misma causa raíz**: Faltan variables de entorno en Supabase Edge Functions.

---

## 🎯 Causa del Problema

El servidor backend (Edge Function de Supabase) **NO** tiene configuradas las variables de entorno necesarias para conectarse a la base de datos y al sistema de autenticación.

Cuando intentas:
- ✏️ **Actualizar un entrenamiento** → El servidor intenta leer de `kv_store` → Falla porque no puede conectarse a Supabase
- 👤 **Crear un usuario** → El servidor intenta usar `supabase.auth.admin.createUser()` → Falla porque no tiene credenciales

---

## ✅ SOLUCIÓN (5 minutos)

### Paso 1: Acceder al Dashboard de Supabase

1. Ve a **https://supabase.com/dashboard**
2. Inicia sesión con tu cuenta
3. Selecciona el proyecto del **Club Natación Lo Prado**

### Paso 2: Obtener las Keys Necesarias

1. En el menú lateral izquierdo, click en **⚙️ Settings** (Configuración)
2. Click en **API**
3. Verás esta información:

```
Project URL:          https://vrclozhgaacehojbnpuo.supabase.co
anon / public key:    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key:     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [SHOW]
```

4. **Copia estas tres cosas:**
   - ✅ **Project URL** (completo)
   - ✅ **anon / public key** (completo, es largo ~300 caracteres)
   - ✅ **service_role key** (haz click en "SHOW" o el ícono de ojo 👁️ para verlo, también es largo)

⚠️ **IMPORTANTE**: El `service_role key` es **secreto**. Nunca lo compartas públicamente.

### Paso 3: Configurar Variables de Entorno en Edge Function

Hay dos maneras de hacer esto:

#### 🅰️ Opción A: Desde el Dashboard (RECOMENDADO - Más Fácil)

1. En el menú lateral, ve a **Edge Functions** (Funciones Edge)
2. Verás una función llamada **`server`** → Click en ella
3. Click en la pestaña **Settings** o **Environment Variables** (Variables de Entorno)
4. Agrega estas **3 variables**:

```
Nombre: SUPABASE_URL
Valor:  https://vrclozhgaacehojbnpuo.supabase.co
```

```
Nombre: SUPABASE_ANON_KEY
Valor:  [pega aquí el anon/public key que copiaste]
```

```
Nombre: SUPABASE_SERVICE_ROLE_KEY
Valor:  [pega aquí el service_role key que copiaste]
```

5. **GUARDA** los cambios (botón "Save" o "Update")

6. **RE-DESPLIEGA la función**:
   - Puede haber un botón "Redeploy" o "Deploy"
   - Si no lo ves, las variables se aplicarán en el próximo despliegue automático
   - **Espera 1-2 minutos** para que se apliquen los cambios

#### 🅱️ Opción B: Usando Supabase CLI (Avanzado)

Si tienes la CLI instalada:

```bash
# Configurar las variables
supabase secrets set SUPABASE_URL=https://vrclozhgaacehojbnpuo.supabase.co
supabase secrets set SUPABASE_ANON_KEY=[tu-anon-key]
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=[tu-service-role-key]

# Re-desplegar la función
supabase functions deploy server
```

### Paso 4: Verificar la Configuración

**Opción 1: Usar la herramienta de diagnóstico integrada** (MÁS FÁCIL)

1. Abre tu aplicación del Club Natación Lo Prado
2. Inicia sesión como **Administrador**
3. Ve a la pestaña **"Diagnóstico"** (última pestaña)
4. Desplázate hasta la sección **"🔍 Diagnóstico de Supabase"**
5. Haz click en **"Ejecutar Tests"**
6. Espera 10-15 segundos

**✅ Resultado Esperado (TODO FUNCIONA):**
```
1. Conexión API               ✓ OK
2. Edge Function Health       ✓ OK
   Variables de Entorno del Servidor:
   SUPABASE_URL:              ✓ Configurada
   SUPABASE_SERVICE_ROLE_KEY: ✓ Configurada
   SUPABASE_ANON_KEY:         ✓ Configurada
3. Test de Registro (Signup)  ✓ OK

✅ Todos los tests pasaron. El sistema está funcionando correctamente.
```

**❌ Si SIGUE fallando:**
```
Variables de Entorno del Servidor:
SUPABASE_URL:              ✗ Falta
SUPABASE_SERVICE_ROLE_KEY: ✗ Falta
SUPABASE_ANON_KEY:         ✗ Falta
```

Significa que aún no se han aplicado. **Espera 2-3 minutos más** y vuelve a ejecutar el test.

**Opción 2: Verificación Manual**

Intenta crear un usuario nuevamente:

1. Ve a **"Nadadores"**
2. Click en **"Nuevo Usuario"**
3. Llena el formulario:
   - Nombre: "Test Nadador"
   - Email: "test@clubnatacion.cl"
   - Rol: "Nadador"
4. Click en **"Crear Usuario"**

**✅ Si funciona:**
```
✅ Usuario creado exitosamente
Credenciales generadas:
Email: test@clubnatacion.cl
Contraseña: [contraseña temporal]
```

**✅ Ahora intenta actualizar un entrenamiento:**

1. Ve a **"Entrenamientos"** → **"Grupo 1 - Menores"**
2. Selecciona un entrenamiento existente
3. Click en **✏️ Editar**
4. Cambia algo (por ejemplo, el título)
5. Click en **"Guardar"**

Si se guarda sin errores → **TODO ESTÁ ARREGLADO** ✅

---

## 🔍 Explicación Técnica

### ¿Por qué se necesitan estas variables?

```
Frontend (React App)
    ↓
    | Hace request HTTP con ANON_KEY
    |
    ↓
Edge Function (Servidor Hono en Deno)
    ↓
    | Necesita SERVICE_ROLE_KEY para:
    | - Leer/escribir en la base de datos (kv_store)
    | - Crear usuarios (auth.admin.createUser)
    | - Gestionar autenticación
    |
    ↓
Supabase (Base de Datos + Auth)
    ↓
    | Valida las credenciales
    |
    ✅ Operación exitosa
```

### Variables explicadas:

| Variable | Propósito | Ubicación |
|----------|-----------|-----------|
| `SUPABASE_URL` | URL base del proyecto Supabase | Backend (Edge Function) |
| `SUPABASE_ANON_KEY` | Key pública para llamadas desde el frontend | Frontend Y Backend |
| `SUPABASE_SERVICE_ROLE_KEY` | Key privada con permisos de admin | **SOLO Backend** |

⚠️ **NUNCA** expongas el `SERVICE_ROLE_KEY` en el código del frontend. Solo debe estar en las variables de entorno del servidor.

---

## 📋 Checklist de Verificación

Marca cada item cuando lo completes:

- [ ] Accedí al Dashboard de Supabase
- [ ] Copié el `SUPABASE_URL`
- [ ] Copié el `SUPABASE_ANON_KEY`
- [ ] Copié el `SUPABASE_SERVICE_ROLE_KEY` (clickeé en "SHOW")
- [ ] Abrí Edge Functions → server → Environment Variables
- [ ] Agregué las 3 variables de entorno
- [ ] Guardé los cambios
- [ ] Esperé 1-2 minutos
- [ ] Ejecuté el diagnóstico desde la app
- [ ] Todos los tests pasaron (✓ OK)
- [ ] Pude crear un usuario de prueba
- [ ] Pude editar un entrenamiento sin errores

---

## 🆘 Si SIGUE sin funcionar

Si después de configurar las variables de entorno y esperar 2-3 minutos el diagnóstico SIGUE fallando:

1. **Verifica que copiaste las keys COMPLETAS**
   - El `ANON_KEY` tiene ~300+ caracteres
   - El `SERVICE_ROLE_KEY` también tiene ~300+ caracteres
   - Asegúrate de no dejar espacios al inicio/final

2. **Verifica el Project URL**
   - Debe ser EXACTAMENTE: `https://vrclozhgaacehojbnpuo.supabase.co`
   - Sin barra al final (`/`)

3. **Re-despliega la función manualmente**
   - En Edge Functions → server
   - Busca un botón "Redeploy" o "Deploy"
   - Espera a que termine el despliegue

4. **Revisa los logs del servidor**
   - En Edge Functions → server → Logs
   - Busca mensajes de error
   - Si ves `❌ CRITICAL ERROR: Missing required environment variables!` significa que las variables AÚN no están configuradas

5. **Contacta con soporte**
   - Copia el resultado completo del diagnóstico
   - Copia los logs del servidor (si hay errores)
   - Incluye capturas de pantalla de la configuración de variables de entorno

---

## 📚 Documentos Relacionados

- 📄 `/SOLUCION_MISSING_AUTHORIZATION_HEADER.md` - Guía detallada del error "Missing authorization header"
- 📄 `/SOLUCION_ERROR_SIGNUP.md` - Guía original del sistema de diagnóstico
- 📄 `/DIAGNOSTICO_ENTRENADOR_ENTRENAMIENTOS.md` - Documentación de permisos de entrenadores

---

## ✅ Confirmación Final

Cuando TODO esté funcionando, deberías poder:

1. ✅ Crear nuevos usuarios (nadadores, entrenadores, admins)
2. ✅ Iniciar sesión con cualquier usuario
3. ✅ Crear entrenamientos
4. ✅ Editar entrenamientos
5. ✅ Eliminar entrenamientos
6. ✅ Registrar asistencia
7. ✅ Ver estadísticas
8. ✅ Subir resultados de competencias
9. ✅ Ver análisis de rendimiento

**Fecha**: 10 de Febrero, 2026  
**Sistema**: Club Natación Lo Prado  
**Versión del Servidor**: 2.0.3  
**Estado**: ⚠️ CONFIGURACIÓN PENDIENTE
