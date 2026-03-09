# 🏊‍♂️ Club Natación Lo Prado - Sistema de Gestión

## 📌 Resumen Ejecutivo

Tu aplicación está **funcionando correctamente en modo offline**, pero necesita conectarse a **Supabase Edge Functions** para tener funcionalidad completa.

### ✅ Lo que YA funciona (Modo Offline):
- ✅ Auto-login como administrador (`admin@loprado.cl`)
- ✅ Navegación por todas las pestañas
- ✅ Visualización de la interfaz completa
- ✅ Datos de demostración locales

### ❌ Lo que NO funciona sin backend:
- ❌ Crear nadadores reales
- ❌ Registrar asistencias
- ❌ Guardar marcas y entrenamientos
- ❌ Crear usuarios (coach, nadador)
- ❌ Persistencia de datos en la nube

---

## 🎯 ¿Qué necesitas hacer?

### Configuración en 4 pasos:

#### **PASO 1: Desplegar Edge Function**
```
https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions
```
- Verifica que exista una función llamada **"server"**
- Debe estar **Active** (verde)

#### **PASO 2: Configurar 3 Variables de Entorno**
En: `Edge Functions → server → Settings → Environment Variables`

**Variable 1:**
```
SUPABASE_URL = https://vrclozhgaacehojbnpuo.supabase.co
```

**Variable 2:**
```
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyY2xvemhnYWFjZWhvamJucHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MDc1OTEsImV4cCI6MjA4NTk4MzU5MX0.efL3mUq8zFgaqAY92FWiwGTBxlPmzkVq9kDjVXbjeVQ
```

**Variable 3:**
```
SUPABASE_SERVICE_ROLE_KEY = [Obtener desde Dashboard → Settings → API]
```
⚠️ **Esta es la key SECRETA** (tiene icono 🔒). Obtenla en:
```
https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/settings/api
```

#### **PASO 3: Redesplegar**
Después de agregar las variables:
- Ve a: `Edge Functions → server`
- Click en **"Deploy"** o **"Redeploy"**
- Espera 1-2 minutos

#### **PASO 4: Verificar**
- Abre la aplicación
- Haz clic en **"Verificar"** en el banner naranja
- Deberías ver: ✅ **"Configurado Correctamente"**

---

## 🎨 Guías Visuales en la Aplicación

### **Banner Rojo** (Diagnóstico)
Aparece automáticamente cuando el servidor NO está configurado.
- Muestra el estado del servidor
- Incluye botones para copiar valores
- Links directos al Supabase Dashboard

### **Banner Amarillo** (Modo Offline)
Aparece cuando estás en modo offline.
- Informa sobre limitaciones
- Botón para desactivar modo offline después de configurar

### **Banner Verde** (Todo OK)
Aparece cuando el servidor está configurado correctamente.
- Confirma que todas las funcionalidades están disponibles

---

## 📚 Documentación Completa

### Guía Principal (español):
```
/GUIA_CONEXION_SUPABASE.md
```
- Instrucciones detalladas paso a paso
- Solución de problemas comunes
- Checklist de verificación

### Guías Técnicas:
```
/SOLUCION_MISSING_AUTHORIZATION_HEADER.md
/SOLUCION_INVALID_JWT.md
/INSTRUCCIONES_DESPLIEGUE_URGENTE.md
```

---

## 🔧 Comandos CLI (Opcional)

Si prefieres usar terminal local:

```bash
# 1. Instalar Supabase CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Link proyecto
supabase link --project-ref vrclozhgaacehojbnpuo

# 4. Configurar secretos
supabase secrets set SUPABASE_URL=https://vrclozhgaacehojbnpuo.supabase.co
supabase secrets set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=[TU_KEY_SECRETA]

# 5. Desplegar
supabase functions deploy server --project-ref vrclozhgaacehojbnpuo
```

---

## 🚨 Errores Comunes y Soluciones

### Error: "Missing authorization header"
**Causa**: Variables de entorno NO configuradas.
**Solución**: Agrega las 3 variables y redesplega.

### Error: "Invalid JWT"
**Causa**: `SUPABASE_SERVICE_ROLE_KEY` incorrecta.
**Solución**: Usa la key **"service_role"** (con 🔒), NO la "anon".

### Error: "Server not responding"
**Causa**: Edge Function NO desplegada.
**Solución**: Despliega la función desde el Dashboard o CLI.

### Banner amarillo no desaparece
**Solución**: Click en **"Ya Configuré el Backend ✅"** o ejecuta:
```javascript
localStorage.removeItem('backend_offline_mode');
location.reload();
```

---

## ✨ Funcionalidades Post-Configuración

Una vez configurado el backend, podrás:

### 👥 Gestión de Usuarios
- ✅ Crear nadadores con sus fichas completas
- ✅ Crear entrenadores y administradores
- ✅ Sistema de solicitudes de contraseña

### 📊 Gestión de Entrenamientos
- ✅ Crear y editar entrenamientos por grupo
- ✅ Asignar bloques de temporada
- ✅ Calcular volúmenes de entrenamiento

### 📅 Control de Asistencia
- ✅ Registrar asistencias diarias
- ✅ Generar alertas de ausentismo
- ✅ Estadísticas de asistencia por nadador

### 🏆 Competencias y Marcas
- ✅ Registrar competencias
- ✅ Guardar marcas personales
- ✅ Sistema de récords del club

### 📈 Análisis y Reportes
- ✅ Gráficos de progresión
- ✅ Estadísticas de grupo
- ✅ Exportación de reportes PDF

---

## 🔐 Seguridad

### Variables Públicas (OK compartir):
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ Project ID

### Variables SECRETAS (NUNCA compartir):
- ❌ `SUPABASE_SERVICE_ROLE_KEY`
- ❌ Cualquier key con icono 🔒

---

## 🌐 Links Importantes

- **Dashboard**: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo
- **Edge Functions**: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions
- **API Keys**: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/settings/api
- **Logs**: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions/server/logs

---

## 📱 Aplicación PWA

La aplicación es instalable como PWA:
- 📱 En móvil: Botón "Agregar a pantalla de inicio"
- 💻 En desktop: Ícono de instalación en la barra de direcciones

---

## 🎓 Arquitectura del Sistema

```
┌─────────────────────────────────────────┐
│         Frontend (React + Vite)         │
│  - Tailwind CSS v4                      │
│  - Supabase Auth Client                 │
│  - Estado global con Context API        │
└────────────┬────────────────────────────┘
             │
             │ HTTPS + JWT Auth
             │
┌────────────▼────────────────────────────┐
│    Supabase Edge Function (Hono)        │
│  - /make-server-4909a0bc/*              │
│  - Middleware de autenticación          │
│  - Validación de JWT                    │
└────────────┬────────────────────────────┘
             │
             │ SQL + Service Role Key
             │
┌────────────▼────────────────────────────┐
│       Supabase PostgreSQL DB            │
│  - Tabla: kv_store_4909a0bc             │
│  - Supabase Auth (usuarios)             │
│  - Supabase Storage (archivos)          │
└─────────────────────────────────────────┘
```

---

## 🎯 Checklist de Verificación

Antes de considerar completa la configuración:

- [ ] Edge Function "server" desplegada
- [ ] Variable `SUPABASE_URL` configurada
- [ ] Variable `SUPABASE_ANON_KEY` configurada
- [ ] Variable `SUPABASE_SERVICE_ROLE_KEY` configurada
- [ ] Función redesplegada después de variables
- [ ] Banner verde visible en la app
- [ ] Banner amarillo eliminado
- [ ] Puedes crear un nadador de prueba
- [ ] La asistencia se guarda correctamente
- [ ] Los datos persisten después de recargar

---

## 💡 Próximos Pasos

1. **Configura el backend** siguiendo esta guía
2. **Verifica** que todo funcione con el checklist
3. **Crea usuarios reales** para entrenadores y nadadores
4. **Importa datos** existentes si los tienes
5. **Capacita** a los usuarios en el sistema
6. **¡Disfruta** de la aplicación completa! 🎉

---

## 🆘 ¿Necesitas Ayuda?

1. **Revisa la guía detallada**: `/GUIA_CONEXION_SUPABASE.md`
2. **Consulta los logs**: Dashboard → Functions → server → Logs
3. **Usa el diagnóstico integrado**: Banner naranja en la app
4. **Revisa la documentación técnica**: Archivos `/SOLUCION_*.md`

---

**¡Éxito con tu configuración!** 🏊‍♂️🏊‍♀️

*Club Natación Lo Prado - Haz que todo sea posible*
