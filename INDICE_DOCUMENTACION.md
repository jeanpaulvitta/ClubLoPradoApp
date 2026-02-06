# 📚 Índice de Documentación - Club Natación Lo Prado

## 🚀 Deployment y Configuración

### 🎯 **Error: "Servidor no alcanzable"**

Si ves el error `TypeError: Failed to fetch`, consulta estos archivos **en orden de prioridad**:

1. **`LEEME_DEPLOYMENT.md`** 📖 ⭐ **EMPIEZA AQUÍ**
   - Resumen completo con 3 opciones
   - La guía más completa y fácil de seguir
   - Incluye todos los comandos necesarios

2. **`SOLUCION_RAPIDA.md`** ⚡
   - Comandos directos y rápidos
   - Solución en 2 minutos
   - Para usuarios experimentados

3. **`DESPLIEGUE_PASO_A_PASO.md`** 📝
   - Guía detallada con explicaciones
   - Perfecta para principiantes
   - Incluye screenshots y ejemplos

4. **`SUPABASE_DEPLOYMENT.md`** 🔧
   - Documentación técnica completa
   - Troubleshooting avanzado
   - Referencias a comandos útiles

---

## 🛠️ Scripts y Comandos Disponibles

### Comandos de Deployment

```bash
# Asistente interactivo (RECOMENDADO)
npm run deploy

# Verificar estado del servidor
npm run check-server

# Verificación completa de endpoints
npm run verify
```

### Comandos de Desarrollo

```bash
# Iniciar aplicación en desarrollo
npm run dev

# Limpiar cache y reiniciar
npm run dev:clean

# Compilar para producción
npm run build

# Preview de producción
npm run preview
```

### Comandos de Supabase (después de instalar CLI)

```bash
# Ver logs en tiempo real
supabase functions logs server --follow

# Ver funciones desplegadas
supabase functions list

# Ver secrets configurados
supabase secrets list

# Redesplegar después de cambios
supabase functions deploy server
```

---

## 📖 Guías de Usuario

### Inicio Rápido

- **`INICIO_RAPIDO.md`**
  - Primeros pasos con la aplicación
  - Cómo navegar por el sistema
  - Funcionalidades principales

- **`INSTRUCCIONES_PRIMER_USO.md`**
  - Configuración inicial
  - Crear primer nadador
  - Programar primer entrenamiento

### Gestión de Entrenamientos

- **`GUIA_GESTION_ENTRENAMIENTOS_GRUPOS.md`**
  - Sistema de grupos de entrenamiento
  - Creación de mesociclos
  - Planificación semanal
  - Gestión de asistencia

### Estructura de Temporada

- **`SeasonStructureInfo.tsx`** (componente en la app)
  - Visualización de macrociclos
  - Planificación de temporada
  - Fechas importantes

---

## 🔧 Documentación Técnica

### Migración y Backend

- **`MIGRACION_SUPABASE.md`**
  - Detalles de la migración a Supabase
  - Arquitectura del sistema
  - API endpoints disponibles

- **`RESUMEN_MIGRACION.md`**
  - Resumen ejecutivo de la migración
  - Cambios principales
  - Estado actual del sistema

### Solución de Problemas

- **`TROUBLESHOOTING.md`**
  - Problemas comunes y soluciones
  - Errores de conectividad
  - Problemas de autenticación
  - Issues con la base de datos

- **`DEV_LOCAL_FIX.md`**
  - Soluciones específicas para desarrollo local
  - Configuración de entorno
  - Variables de entorno

### Checklist

- **`CHECKLIST.md`**
  - Lista de verificación del deployment
  - Pasos de configuración
  - Estado de implementación

---

## 🎨 Información del Proyecto

### Branding y Atribuciones

- **`ATTRIBUTIONS.md`**
  - Créditos del proyecto
  - Librerías utilizadas
  - Licencias

- **Branding Actual:**
  - Club Natación Lo Prado
  - Color principal: Rojo (#EF4444)
  - Slogan: "Haz que todo sea posible"

---

## 📊 Estructura de Datos

### Datos de Ejemplo y Referencia

- **`/src/app/data/`**
  - `achievements.ts` - Sistema de logros
  - `challenges.ts` - Desafíos y metas
  - `holidays.ts` - Días festivos
  - `minimumTimes.ts` - Tiempos mínimos por categoría
  - `swimmers.ts` - Datos de nadadores
  - `testControl.ts` - Controles de test
  - `workouts.ts` - Entrenamientos programados

---

## 🔐 Autenticación y Seguridad

### Sistema de Roles

La aplicación tiene 3 roles:

1. **Admin** (Administrador)
   - Acceso completo al sistema
   - Gestión de usuarios
   - Configuración general

2. **Coach** (Entrenador)
   - Gestión de entrenamientos
   - Registro de asistencia
   - Visualización de estadísticas
   - Gestión de competencias

3. **Swimmer** (Nadador)
   - Visualización de entrenamientos propios
   - Historial de asistencia
   - Marcas personales
   - Competencias participadas

### Credenciales del Administrador

**⚠️ IMPORTANTE:** Después del deployment:

- **Email:** `admin@loprado.cl`
- **Password:** `admin123`

**🔒 Cambiar contraseña inmediatamente después del primer login.**

---

## 🌐 URLs Importantes

### Producción
- **App en Vercel:** https://clubnatacionloprado-bzxkjy9d9-jean-paul-vittas-projects.vercel.app/

### Supabase Dashboard
- **Dashboard Principal:** https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib
- **Edge Functions:** https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/functions
- **API Keys:** https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/settings/api
- **Database:** https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/settings/database
- **Logs:** https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/logs

### API Endpoints
- **Health Check:** `https://tvkrvozifmbgkaztwxib.supabase.co/functions/v1/make-server-4909a0bc/health`
- **Init Admin:** `https://tvkrvozifmbgkaztwxib.supabase.co/functions/v1/make-server-4909a0bc/auth/init-admin`

---

## 📦 Tecnologías Utilizadas

### Frontend
- **React 18.3.1**
- **Vite 6.3.5**
- **Tailwind CSS 4.1.12**
- **Radix UI** - Componentes accesibles
- **Recharts** - Gráficos y estadísticas
- **Lucide React** - Iconos
- **Motion (Framer Motion)** - Animaciones
- **React Hook Form** - Formularios
- **Sonner** - Notificaciones

### Backend
- **Supabase** - Backend as a Service
- **PostgreSQL** - Base de datos
- **Edge Functions (Deno)** - API serverless
- **Hono** - Framework web para Deno
- **Supabase Auth** - Autenticación

### Storage
- **Supabase Storage** - Archivos PDF de competencias
- **KV Store** - Almacenamiento clave-valor para datos
- **LocalStorage** - Fallback automático offline

---

## 🚦 Estado del Proyecto

### ✅ Completado
- ✅ Migración completa a Supabase
- ✅ Sistema de autenticación con roles
- ✅ Gestión de nadadores y entrenamientos
- ✅ Sistema de asistencia
- ✅ Gestión de competencias con PDFs
- ✅ Marcas personales y récords
- ✅ Sistema de logros y medallas
- ✅ Estadísticas y gráficos
- ✅ Análisis de asistencia con alertas
- ✅ Branding Club Natación Lo Prado
- ✅ Sistema de fallback a localStorage
- ✅ Deploy en Vercel (producción)

### ⚠️ Pendiente
- ⚠️ Deploy de Edge Functions (necesita configuración manual)
- ⚠️ Creación de usuario administrador inicial

### 🔄 En Progreso
- Ninguno (sistema estable)

---

## 🆘 ¿Por Dónde Empiezo?

### Si ves el error "Servidor no alcanzable":
1. **Lee:** `LEEME_DEPLOYMENT.md`
2. **Ejecuta:** `npm run deploy`
3. **Verifica:** `npm run verify`

### Si es tu primera vez usando la app:
1. **Lee:** `INSTRUCCIONES_PRIMER_USO.md`
2. **Lee:** `INICIO_RAPIDO.md`

### Si necesitas gestionar entrenamientos:
1. **Lee:** `GUIA_GESTION_ENTRENAMIENTOS_GRUPOS.md`

### Si tienes problemas:
1. **Lee:** `TROUBLESHOOTING.md`
2. **Ejecuta:** `npm run verify`
3. **Revisa:** Logs de Supabase

---

## 📞 Soporte

### Auto-diagnóstico
```bash
# Verificar estado completo
npm run verify

# Ver logs del servidor
supabase functions logs server

# Ver configuración
supabase secrets list
```

### Documentación
- Consulta el archivo correspondiente según tu necesidad
- Todos los archivos `.md` tienen ejemplos y comandos

### Links Útiles
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de React](https://react.dev)
- [Documentación de Tailwind CSS](https://tailwindcss.com)

---

**💡 Tip:** Guarda este índice como referencia rápida para encontrar la documentación que necesites.

**📌 Recuerda:** Para cualquier problema de deployment, empieza siempre por `LEEME_DEPLOYMENT.md`.
