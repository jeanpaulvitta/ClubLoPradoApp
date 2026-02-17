# 🔧 Solución Rápida: Error al Cambiar Contraseña

## ❌ Problema

Al intentar cambiar la contraseña, recibes uno de estos errores:
- `Invalid JWT`
- `JWT verification failed`  
- `Unauthorized`
- `Token inválido`

## ✅ Solución en 3 Pasos

### Paso 1: Confirmar que el problema es JWT

1. Abre la aplicación
2. Inicia sesión como administrador
3. Abre DevTools (F12) → Console
4. Intenta cambiar tu contraseña
5. Revisa los mensajes de error en la consola

Si ves mensajes como `❌ Auth middleware - Token validation error`, continúa con el Paso 2.

### Paso 2: Verificar Variables de Entorno en Supabase

**La causa más común es que falta configurar JWT_SECRET en el Edge Function.**

#### A. Ir a Supabase Dashboard

1. Ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo
2. Navega a: **Edge Functions** → **make-server-4909a0bc**
3. Haz clic en **Settings**
4. Ve a la sección **Secrets**

#### B. Verificar Secrets Existentes

Debes tener estas 3 variables (como mínimo):

| Variable | ¿Configurada? |
|----------|---------------|
| `SUPABASE_URL` | ✅ Debe estar |
| `SUPABASE_ANON_KEY` | ✅ Debe estar |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Debe estar |

#### C. Agregar JWT_SECRET (si no existe)

1. En la página de Secrets, haz clic en **Add secret**
2. Nombre: `SUPABASE_JWT_SECRET`
3. Valor: Ve a **Settings** → **API** → **JWT Settings** → copia el **JWT Secret**
4. Pega el valor (es un string largo como `super-secret-jwt-token-...`)
5. Haz clic en **Save**

### Paso 3: Redesplegar Edge Function

Después de agregar el secret, necesitas redesplegar:

#### Opción A: Desde el Dashboard (Más Fácil)

1. Ve a Edge Functions → make-server-4909a0bc
2. Haz clic en los tres puntos (⋮)
3. Selecciona **Redeploy**
4. Espera a que complete

#### Opción B: Desde la Terminal

```bash
cd /ruta/a/tu/proyecto
supabase functions deploy make-server-4909a0bc
```

---

## 🧪 Verificar que Funcionó

### Test Rápido

1. Cierra sesión en la aplicación
2. Vuelve a iniciar sesión
3. Ve al menú de usuario (esquina superior derecha)
4. Selecciona "Cambiar Contraseña"
5. Ingresa contraseña actual y nueva
6. Haz clic en "Cambiar Contraseña"

Si todo está correcto, verás: **"✅ Contraseña actualizada exitosamente"**

### Test con Script de Diagnóstico

1. Abre DevTools (F12) → Console
2. Escribe: `allow pasting`
3. Copia y pega el contenido de `/scripts/test-jwt-auth.js`
4. Presiona Enter
5. Revisa los resultados

Deberías ver:
```
✅ Sesión encontrada
✅ JWT decodificado
✅ Token JWT válido (no ha expirado)
✅ Autenticación exitosa!
```

---

## ❓ ¿Aún No Funciona?

### Problema: "Token has expired"

**Causa:** Tu sesión expiró  
**Solución:**
1. Cierra sesión
2. Vuelve a iniciar sesión
3. Intenta cambiar contraseña inmediatamente

### Problema: "Invalid JWT" persiste

**Causa:** El JWT_SECRET configurado no es correcto  
**Solución:**
1. Ve a Settings → API → JWT Settings
2. **COPIA EXACTAMENTE** el JWT Secret (sin espacios, sin comillas)
3. Ve a Edge Functions → Secrets
4. **EDITA** el secret `SUPABASE_JWT_SECRET`
5. Pega el valor correcto
6. Guarda y redespliega

### Problema: "Unauthorized - No token provided"

**Causa:** La sesión no está guardada correctamente  
**Solución:**
1. Abre DevTools → Application → Local Storage
2. Busca items que contengan "supabase"
3. Bórralos todos
4. Refresca la página (F5)
5. Vuelve a iniciar sesión

---

## 📋 Checklist de Solución

Marca cada paso a medida que lo completas:

- [ ] Verifiqué que SUPABASE_URL está configurado
- [ ] Verifiqué que SUPABASE_ANON_KEY está configurado
- [ ] Verifiqué que SUPABASE_SERVICE_ROLE_KEY está configurado
- [ ] **Agregué SUPABASE_JWT_SECRET** (clave nueva)
- [ ] Copié el JWT Secret exactamente desde Settings → API
- [ ] Redespliegué el Edge Function
- [ ] Esperé 1-2 minutos después del deploy
- [ ] Cerré sesión y volví a iniciar sesión
- [ ] Probé cambiar la contraseña nuevamente

---

## 🆘 Contactar Soporte

Si después de seguir todos los pasos aún tienes problemas:

1. **Toma screenshots de:**
   - La consola con los errores
   - La página de Secrets en Supabase (ocultando los valores)
   - El resultado del script de diagnóstico

2. **Recopila esta información:**
   - ¿Qué paso exactamente estás siguiendo cuando falla?
   - ¿Qué mensaje de error ves?
   - ¿Cuándo fue la última vez que funcionó?

3. **Envía al equipo técnico con:**
   - Los screenshots
   - La información recopilada
   - Los logs de la consola (F12)

---

**Última actualización:** Febrero 2026  
**Versión:** 1.0  
**Para:** Club Natación Lo Prado

**Documentación relacionada:**
- 📄 `/CONFIGURACION_JWT_SUPABASE.md` - Guía completa de JWT
- 📄 `/scripts/test-jwt-auth.js` - Script de diagnóstico
