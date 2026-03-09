# 🔧 Instrucciones para Eliminar Secrets Problemáticos

## 🎯 Objetivo

Eliminar los secrets manuales que están sobrescribiendo las variables automáticas de Supabase.

---

## 📍 Paso 1: Ir al Dashboard de Edge Functions

Abre en tu navegador:

```
https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions
```

---

## 🔍 Paso 2: Identificar las Funciones Desplegadas

Deberías ver una lista de funciones. Busca:

- ✅ `server` (la función correcta)
- ❓ `make-server-4909a0bc` (función legacy, puede existir)

**Click en cada una** para verificar sus secrets.

---

## 🗑️ Paso 3: Eliminar Secrets (Si Existen)

### Para la función `make-server-4909a0bc`:

1. **Click en `make-server-4909a0bc`**

2. **Busca la pestaña "Configuration" o "Secrets"**  
   Puede estar en:
   - Una pestaña lateral
   - Un botón "Manage secrets"
   - Un menú desplegable

3. **Identifica si hay secrets configurados**:
   - Busca variables con nombres: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - Si aparecen, probablemente verás:
     - Un icono de basura (🗑️)
     - Un botón "Delete"
     - Un menú con opción "Remove"

4. **Elimina cada secret**:
   - Click en el icono 🗑️ o botón "Delete"
   - Confirma la eliminación
   - Repite para cada una de las 3 variables

5. **Guarda los cambios** (si hay un botón "Save")

### Para la función `server`:

1. **Click en `server`**

2. **Repite el proceso anterior**:
   - Busca la pestaña "Configuration" o "Secrets"
   - Verifica si hay secrets configurados
   - Elimina los que encuentres

---

## 🚀 Paso 4: Redesplegar las Funciones

Después de eliminar los secrets:

### Opción A: Desde el Dashboard

Para cada función (`make-server-4909a0bc` y `server`):

1. En la página de la función, busca el botón **"Deploy"** o **"Redeploy"**
2. Click en el botón
3. Espera 1-2 minutos

### Opción B: Desde GitHub Actions (Automático)

Si configuraste GitHub Actions:

1. Ve a: https://github.com/[TU_REPO]/actions
2. Busca el workflow "Deploy to Supabase"
3. Click en "Run workflow" → "Run workflow"
4. Espera 2-3 minutos

---

## ✅ Paso 5: Verificar que Funcionó

Abre en tu navegador:

```
https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health
```

**Respuesta esperada**:
```json
{
  "status": "ok",
  "valid": true,
  "message": "✅ All environment variables configured correctly"
}
```

**Si sigue fallando**:
```json
{
  "status": "misconfigured",
  "valid": false,
  "message": "❌ KEYS CONFIGURADAS PERO INVÁLIDAS!"
}
```
→ Los secrets aún no se eliminaron correctamente. Revisa el Paso 3.

---

## 🎨 Cómo Se Ve la Interfaz

La interfaz de Supabase puede variar, pero busca algo similar a:

### Variante 1: Pestaña "Secrets"

```
┌─────────────────────────────────────────┐
│ make-server-4909a0bc                    │
├─────────────────────────────────────────┤
│ [Details] [Secrets] [Logs]              │
├─────────────────────────────────────────┤
│                                         │
│ Secrets                                 │
│ ┌─────────────────────────────────────┐ │
│ │ SUPABASE_URL             [Delete]   │ │
│ │ SUPABASE_ANON_KEY        [Delete]   │ │
│ │ SUPABASE_SERVICE_ROLE... [Delete]   │ │
│ └─────────────────────────────────────┘ │
│ [+ Add secret]                          │
└─────────────────────────────────────────┘
```

### Variante 2: Botón "Manage Secrets"

```
┌─────────────────────────────────────────┐
│ make-server-4909a0bc                    │
├─────────────────────────────────────────┤
│ [Details] [Configuration] [Logs]        │
├─────────────────────────────────────────┤
│                                         │
│ Environment Variables                   │
│ [Manage secrets] ← CLICK AQUÍ           │
│                                         │
└─────────────────────────────────────────┘

(Click abre modal)
┌─────────────────────────────────────────┐
│ Manage Secrets              [X]         │
├─────────────────────────────────────────┤
│ • SUPABASE_URL             [🗑️]        │
│ • SUPABASE_ANON_KEY        [🗑️]        │
│ • SUPABASE_SERVICE_ROLE... [🗑️]        │
│                                         │
│ [+ Add new secret]                      │
│                          [Close] [Save] │
└─────────────────────────────────────────┘
```

### Variante 3: Tabla de Variables

```
┌───────────────────────────────────────────────┐
│ Configuration                                 │
├───────────────────────────────────────────────┤
│ Name                      Value      Actions  │
├───────────────────────────────────────────────┤
│ SUPABASE_URL              ******     [🗑️]    │
│ SUPABASE_ANON_KEY         ******     [🗑️]    │
│ SUPABASE_SERVICE_ROLE_KEY ******     [🗑️]    │
└───────────────────────────────────────────────┘
```

---

## ⚠️ Notas Importantes

### 1. NO Puedes Ver los Valores

Una vez que un secret está configurado, **NO puedes ver su valor** en el dashboard.
Solo puedes:
- Ver que existe
- Eliminarlo
- Sobrescribirlo

### 2. Las Variables Automáticas NO Aparecen

Las variables que Supabase proporciona automáticamente **NO aparecen** en la lista de secrets.

Por eso, si ves alguna variable con prefijo `SUPABASE_*` en la lista, **es un secret manual que debe eliminarse**.

### 3. Después de Eliminar, NO las Vuelvas a Crear

Una vez que elimines los secrets:
- ❌ NO agregues nuevos secrets con los mismos nombres
- ❌ NO copies las keys desde Settings → API
- ✅ Deja que Supabase las proporcione automáticamente

### 4. Puede Haber 2 Funciones

Es posible que tengas 2 funciones desplegadas:
- `server` (nueva)
- `make-server-4909a0bc` (legacy)

**Revisa ambas** y elimina los secrets de las 2.

---

## 🚨 Si NO Ves la Opción de Eliminar

Si no encuentras la opción para eliminar secrets:

### Posibilidad 1: No Hay Secrets Configurados

Esto es **BUENO**. Significa que no hay secrets manuales interfiriendo.

En este caso, el problema podría ser otro:
- La función no está desplegada
- Hay un error en el código
- Las variables automáticas no están disponibles (raro)

### Posibilidad 2: La Interfaz Es Diferente

Supabase actualiza su interfaz frecuentemente. Busca:
- Menú de 3 puntos (**...**) en la función
- Opción "Settings" o "Configuration"
- Sección "Environment" o "Variables"

### Posibilidad 3: Permisos Insuficientes

Verifica que tengas permisos de Owner o Admin en el proyecto de Supabase.

---

## 🔄 Flujo Completo

```
1. Dashboard de Supabase
   ↓
2. Functions → make-server-4909a0bc
   ↓
3. Configuration/Secrets
   ↓
4. ¿Ves secrets SUPABASE_*?
   ├─ SÍ → Elimínalos (🗑️ Delete)
   └─ NO → ¡Bien! No hay secrets problemáticos
   ↓
5. Redeploy la función
   ↓
6. Espera 2-3 minutos
   ↓
7. Verifica health check
   ↓
8. ¿Status "ok"?
   ├─ SÍ → ¡Listo! ✅
   └─ NO → Repite desde paso 2
```

---

## 📋 Checklist de Verificación

Marca cada paso a medida que lo completes:

- [ ] Abrí el dashboard de Supabase
- [ ] Encontré la sección de Functions
- [ ] Click en la función `make-server-4909a0bc`
- [ ] Busqué la pestaña "Configuration" o "Secrets"
- [ ] Identifiqué si hay secrets SUPABASE_*
- [ ] Eliminé todos los secrets encontrados
- [ ] Redespliegué la función
- [ ] Esperé 2-3 minutos
- [ ] Verifiqué el health check
- [ ] El health check responde "ok"

---

## 🆘 Si Necesitas Ayuda

Si no encuentras cómo eliminar los secrets, proporciona:

1. **Captura de pantalla** de la página de la función
2. **Descripción** de qué opciones ves (¿qué pestañas? ¿qué botones?)
3. **Resultado del health check** (copia la respuesta completa)

Con esa información, puedo darte instrucciones específicas para tu interfaz.

---

## ✅ Resultado Esperado

Después de completar estos pasos:

```json
{
  "status": "ok",
  "valid": true,
  "message": "✅ All environment variables configured correctly",
  "debug": {
    "urlValid": true,
    "serviceKeyValid": true,
    "anonKeyValid": true
  }
}
```

¡Esto significa que el servidor está correctamente configurado y listo para usar! 🎉

---

## 📞 Siguiente Paso

Una vez que el health check pase:

1. **Sal del modo offline**:
   ```javascript
   localStorage.removeItem('backend_offline_mode');
   location.reload();
   ```

2. **Inicia sesión** en la aplicación

3. **Verifica** que todo funcione correctamente

¡Éxito! 🏊‍♂️🚀
