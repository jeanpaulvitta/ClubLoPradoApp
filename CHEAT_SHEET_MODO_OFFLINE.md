# ⚡ Cheat Sheet - Modo Offline

## 🚀 Salir del Modo Offline - Ultra Rápido

### Método 1: Un comando (Más rápido)
```javascript
// Copia y pega en la consola del navegador (F12)
localStorage.removeItem('backend_offline_mode'); location.reload();
```

### Método 2: Desde la app
1. Click en **"🔄 Verificar Servidor y Salir"** (banner amarillo)
2. O: Click en **"🔧 Diagnóstico"** (login) → **"Verificar"**

---

## ✅ Verificar Servidor

### Health Check
```
https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health
```

**Respuesta OK:**
```json
{"status": "ok", "message": "Server is running"}
```

---

## 🔧 Variables de Entorno

```bash
SUPABASE_URL=https://vrclozhgaacehojbnpuo.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=<obtener en Dashboard → API → service_role>
```

---

## 🚨 Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| 401 Unauthorized | Variables no configuradas | Agregar variables → Redeploy |
| 404 Not Found | Función no desplegada | Deploy la función "server" |
| Timeout | Servidor no responde | Verificar deployment activo |
| Banner persiste | Flag no limpiado | Usar Método 1 arriba |

---

## 📍 Links Rápidos

- **Edge Functions**: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions
- **API Keys**: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/settings/api
- **Logs**: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/logs/edge-functions-logs

---

## 💡 Comandos Útiles

### Limpiar localStorage completo
```javascript
localStorage.clear(); sessionStorage.clear(); location.reload();
```

### Ver localStorage
```javascript
console.log(localStorage.getItem('backend_offline_mode'));
```

### Health check desde consola
```javascript
fetch('https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/health')
  .then(r => r.json())
  .then(console.log);
```

---

## 📚 Docs Completas

- **Inicio rápido**: `/COMO_SALIR_DEL_MODO_OFFLINE.md`
- **Verificación**: `/VERIFICACION_RAPIDA.md`
- **Guía completa**: `/SALIR_MODO_OFFLINE.md`
- **Índice**: `/INDICE_MODO_OFFLINE.md`

---

**TL;DR:** Copia el Método 1, pégalo en la consola (F12), presiona Enter. ✅
