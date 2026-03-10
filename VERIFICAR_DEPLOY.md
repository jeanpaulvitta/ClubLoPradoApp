# Verificar Estado del Despliegue

## 🔍 Verificar si la Edge Function está actualizada

Abre esta URL en tu navegador:

```
https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/debug/password-requests-status
```

**Si está actualizada, deberías ver:**
```json
{
  "message": "Password requests routes are registered",
  "routes": {
    "POST /password-requests/create": "Create new request (PUBLIC - NO AUTH) ⭐",
    "GET /password-requests": "List all requests (admin only)",
    "POST /password-requests/:id/approve": "Approve request (admin only)",
    "POST /password-requests/:id/reject": "Reject request (admin only)",
    "DELETE /password-requests/:id": "Delete request (admin only)"
  },
  "timestamp": "...",
  "serverConfigured": true,
  "supabaseReady": true,
  "note": "POST /password-requests/create does NOT require authentication - it's a public endpoint"
}
```

**Si NO está actualizada, verás un error 404 o un endpoint diferente**

---

## 🚀 Después de Desplegar

Una vez que despliegues, prueba el endpoint directamente:

```bash
curl -X POST https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc/password-requests/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Usuario",
    "email": "test@example.com",
    "role": "swimmer"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "request": {
    "id": "pr_1234567890_abcdef",
    "name": "Test Usuario",
    "email": "test@example.com",
    "role": "swimmer",
    "requestedAt": "2026-03-10T...",
    "status": "pending"
  },
  "message": "Solicitud enviada exitosamente. El administrador la revisará pronto."
}
```

---

## ⚠️ Si sigue fallando después del deploy

1. **Verifica los logs de la Edge Function:**
   - Ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions
   - Haz clic en `make-server-4909a0bc`
   - Ve a la pestaña "Logs"
   - Busca errores

2. **Limpia el caché del navegador:**
   ```
   Ctrl + Shift + Delete
   ```
   Y selecciona "Clear cached images and files"

3. **Verifica que el archivo kv_store.tsx también existe:**
   ```
   /supabase/functions/make-server-4909a0bc/kv_store.tsx
   ```
