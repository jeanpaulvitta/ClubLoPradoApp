# 🔄 Salir del Modo Offline - README

> **Ya configuraste las variables de entorno en Supabase Edge Functions.**  
> Ahora necesitas salir del modo offline y verificar que todo funcione.

---

## 🎯 Objetivo

Salir del modo offline y activar todas las funcionalidades del sistema.

---

## ⚡ Solución Rápida (30 segundos)

### Opción 1: Un Comando
```javascript
// Abre la consola del navegador (F12)
// Copia y pega esto:
localStorage.removeItem('backend_offline_mode');
location.reload();
```

### Opción 2: Desde la App
1. Si ves el **banner amarillo**, click en **"🔄 Verificar Servidor y Salir"**
2. Si estás en **login**, click en **"🔧 Diagnóstico del Sistema"** → **"Verificar"**

---

## 📋 Checklist de Verificación

Después de salir del modo offline:

- [ ] ✅ NO ves el banner amarillo "MODO OFFLINE ACTIVADO"
- [ ] ✅ Puedes iniciar sesión con las credenciales del admin
- [ ] ✅ Puedes ver la lista de nadadores
- [ ] ✅ Puedes crear/editar nadadores
- [ ] ✅ Los cambios se guardan correctamente en el servidor

---

## 🔍 Verificar el Servidor

### Health Check
Abre en el navegador:
```
https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health
```

**Respuesta esperada (✅):**
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2026-03-09T..."
}
```

**Si ves un error (❌):**
- **401 Unauthorized**: Faltan variables de entorno
- **404 Not Found**: La función no está desplegada
- **Timeout**: El servidor no responde

👉 **Solución**: Ve a `/SALIR_MODO_OFFLINE.md` → "Solución de Problemas"

---

## 🛠️ Herramientas Implementadas

### 1. Banner Amarillo (App Principal)
- Aparece cuando estás en modo offline
- Botón: **"🔄 Verificar Servidor y Salir"** (verifica automáticamente)
- Botón: **"Salir Sin Verificar"** (salida directa)

### 2. Diagnóstico del Sistema (Página de Login)
- Click en **"🔧 Diagnóstico del Sistema"**
- 3 pestañas:
  - **Estado del Servidor**: Verificación en tiempo real
  - **Configuración**: Guía paso a paso
  - **Información**: Datos del sistema

### 3. Componentes Nuevos
- `OfflineModeChecker`: Verificador automático de conexión
- `SystemDiagnostics`: Interfaz completa de diagnóstico
- `ServerConfigGuide`: Guía de configuración mejorada

---

## 📚 Documentación Disponible

### Para Usuarios
| Documento | Descripción | Cuándo Usar |
|-----------|-------------|-------------|
| **`/SIGUIENTE_PASO_AHORA.md`** | Instrucciones inmediatas | **LEE ESTO PRIMERO** |
| **`/COMO_SALIR_DEL_MODO_OFFLINE.md`** | 3 opciones simples | Salida rápida |
| **`/CHEAT_SHEET_MODO_OFFLINE.md`** | Referencia ultra-rápida | Consulta rápida |
| **`/VERIFICACION_RAPIDA.md`** | Checklist y verificación | Después de salir |

### Para Desarrolladores
| Documento | Descripción |
|-----------|-------------|
| **`/RESUMEN_CAMBIOS_MODO_OFFLINE.md`** | Cambios técnicos implementados |
| **`/INDICE_MODO_OFFLINE.md`** | Índice completo de docs |

### Para Configuración
| Documento | Descripción |
|-----------|-------------|
| **`/GUIA_CONEXION_SUPABASE.md`** | Configuración completa de Edge Functions |
| **`/README_CONEXION_SUPABASE.md`** | Referencia rápida |

---

## 🚨 Errores Comunes y Soluciones

### Error: "Missing authorization header"
**Causa**: Variables de entorno no configuradas

**Solución**:
1. Ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions/server
2. Click en "Configuration" → "Secrets"
3. Agrega las 3 variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Click en "Deploy" o "Redeploy"

---

### Error: "Request timeout"
**Causa**: Servidor no responde

**Solución**:
1. Ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions
2. Verifica que "server" tenga deployment "Active" (verde)
3. Si no, click en "Deploy"
4. Espera 2 minutos

---

### Problema: "El banner amarillo sigue apareciendo"
**Causa**: Flag de modo offline no se limpió

**Solución**:
```javascript
// En la consola del navegador (F12)
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

## 🎯 Flujo Recomendado

```
1. Verificar Health Check
   ↓
2. Si OK → Salir del Modo Offline (Opción 1 o 2)
   ↓
3. Verificar Checklist
   ↓
4. ✅ LISTO - Sistema funcionando
```

**Si algo falla:**
```
Error
   ↓
Identificar tipo de error
   ↓
Buscar en "Errores Comunes"
   ↓
Aplicar solución
   ↓
Volver al paso 1
```

---

## 💡 Tips

1. **Siempre verifica el health check primero** antes de intentar salir del modo offline
2. **Usa el diagnóstico integrado** (🔧) para verificar paso a paso
3. **Revisa los logs** en Supabase si algo no funciona
4. **Limpia la caché** si los cambios no se reflejan

---

## 📞 Soporte

Si después de seguir esta guía aún tienes problemas:

1. **Revisa los logs del servidor**:
   ```
   https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/logs/edge-functions-logs
   ```

2. **Consulta la documentación completa**:
   - Lee `/INDICE_MODO_OFFLINE.md` para encontrar el documento adecuado
   - Busca tu error específico en `/SALIR_MODO_OFFLINE.md`

3. **Usa el diagnóstico** desde la aplicación para identificar el problema

---

## ✅ Estado Final Esperado

Al completar estos pasos, deberías tener:

- ✅ Servidor respondiendo correctamente
- ✅ No hay modo offline activado
- ✅ Login funcional
- ✅ Todas las funcionalidades disponibles
- ✅ Datos guardándose en Supabase

---

## 🎉 ¡Listo!

Una vez completados todos los pasos, tu sistema estará **100% funcional** y podrás usar todas las características:

- Gestión de nadadores
- Registro de asistencia
- Entrenamientos
- Competencias
- Análisis y estadísticas
- Y mucho más...

---

**¿Listo para empezar?** 👉 `/SIGUIENTE_PASO_AHORA.md`
