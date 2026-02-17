# 🚀 DESPLEGAR SERVIDOR ACTUALIZADO

## ✅ CAMBIO REALIZADO:
- El endpoint `GET /workouts` ahora es **PÚBLICO** (no requiere autenticación)
- Esto corrige el error "Invalid JWT" al cargar entrenamientos

---

## 📝 INSTRUCCIONES PARA REDESPLEGAR:

### OPCIÓN 1: Usando Supabase CLI (RECOMENDADO) ⭐

```bash
# 1. Navegar al directorio del proyecto
cd /path/to/your/project

# 2. Desplegar la función actualizada
supabase functions deploy make-server-4909a0bc

# 3. Esperar confirmación
# Deberías ver: "Deployed Function make-server-4909a0bc"
```

---

### OPCIÓN 2: Usando el Dashboard de Supabase (MÁS FÁCIL) 🌐

#### PASO 1: Ir a Edge Functions
1. Abre: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions
2. Busca la función `make-server-4909a0bc`
3. Click en el nombre para abrirla

#### PASO 2: Actualizar el código
1. En el editor, **BORRA TODO** el código actual
2. **COPIA** el contenido del archivo `/supabase/functions/make-server-4909a0bc/index.tsx`
3. **PEGA** en el editor
4. Click en **"Deploy"** (botón verde arriba a la derecha)
5. Espera 30-60 segundos

#### PASO 3: Verificar
1. Vuelve a tu aplicación
2. Recarga la página (F5)
3. Los entrenamientos deberían cargarse sin errores

---

### OPCIÓN 3: Copiar y Pegar Manual (SI NO TIENES CLI) 📋

Si no tienes Supabase CLI instalado:

1. **Abre** el archivo `/supabase/functions/make-server-4909a0bc/index.tsx` en tu editor
2. **Copia TODO** el contenido (Ctrl+A, Ctrl+C)
3. **Ve a**: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions/make-server-4909a0bc/details
4. Click en la pestaña **"Code"** o **"Editor"**
5. **Selecciona todo** el código existente (Ctrl+A)
6. **Borra** (Delete)
7. **Pega** el nuevo código (Ctrl+V)
8. Click en **"Deploy"** o **"Save"**
9. Espera que aparezca la confirmación verde

---

## ✨ RESULTADO ESPERADO:

**ANTES:**
```
❌ Error fetching workouts: Invalid JWT (Status: 401)
```

**DESPUÉS:**
```
✅ Workouts fetched from server: 0 entrenamientos
📦 Workouts cargados desde cache: X entrenamientos
```

---

## 🔍 CÓMO VERIFICAR QUE FUNCIONÓ:

### Método 1: Health Check
```bash
curl https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health
```

Deberías ver:
```json
{
  "status": "ok",
  "version": "3.0.0-COMPLETO",
  "message": "✅ Servidor completo - Club Natación Lo Prado"
}
```

### Método 2: Test de Workouts
```bash
curl https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/workouts
```

Deberías ver:
```json
[]
```
(Un array vacío, NO un error 401)

### Método 3: En la App
1. Recarga la aplicación (F5)
2. Abre la consola (F12)
3. Busca el log:
   ```
   ✅ Workouts fetched from server: 0
   ```

---

## 🆘 SI ALGO SALE MAL:

**Error: "Function not found"**
→ El nombre de la función debe ser exactamente `make-server-4909a0bc`

**Error: "Missing environment variables"**
→ Ve a: Functions → make-server-4909a0bc → Secrets
→ Asegúrate de tener:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

**Error: "Deployment failed"**
→ Revisa que el código no tenga errores de sintaxis
→ Copia nuevamente todo el archivo `index.tsx`

---

## ⏱️ TIEMPO TOTAL: 2-3 MINUTOS

1. Abrir dashboard de Supabase - 15 segundos
2. Ir a la función - 10 segundos
3. Copiar código actualizado - 30 segundos
4. Pegar y desplegar - 30 segundos
5. Esperar despliegue - 60 segundos
6. Verificar en la app - 15 segundos

**¡Listo! El error desaparecerá.** ✨

---

## 📚 SIGUIENTE PASO:

Una vez que el servidor esté desplegado y funcionando:
1. ✅ Los errores desaparecerán
2. ✅ Podrás cargar entrenamientos sin estar logueado
3. ✅ Podrás usar el componente de migración para transferir datos

**¿Necesitas ayuda con el despliegue? Avísame!** 🚀
