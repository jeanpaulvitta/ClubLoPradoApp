# Club Natación Lo Prado - Sistema de Gestión

Sistema completo de gestión para el Club Natación Lo Prado con entrenamientos, asistencia, competencias, y análisis de rendimiento.

## 🚀 Deployment en Vercel

### Prerequisitos

1. Cuenta en [Vercel](https://vercel.com)
2. Proyecto de Supabase configurado
3. Git instalado

### Pasos para Deploy

#### 1. Configurar Supabase

Ya tienes un proyecto de Supabase configurado con:
- **Project ID:** `tvkrvozifmbgkaztwxib`
- **URL:** `https://tvkrvozifmbgkaztwxib.supabase.co`

#### 2. Preparar el Repositorio

```bash
# Inicializar git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit - Club Natación Lo Prado"

# Crear repositorio en GitHub y conectarlo
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

#### 3. Deploy en Vercel

1. Ve a [Vercel](https://vercel.com) e inicia sesión
2. Click en **"Add New Project"**
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Vite
5. **NO necesitas configurar variables de entorno** porque ya están en `/utils/supabase/info.tsx`
6. Click en **"Deploy"**

#### 4. Inicializar Admin (Después del Deploy)

Una vez desplegado:

1. Visita tu aplicación en Vercel
2. En la página de login, busca el botón **"Inicializar Admin"** (ícono de escudo en la esquina superior derecha)
3. Haz clic para crear el usuario administrador
4. Credenciales por defecto:
   - **Email:** `admin@loprado.cl`
   - **Password:** `admin123`

⚠️ **IMPORTANTE:** Cambia la contraseña del administrador inmediatamente después del primer login.

### 5. Configurar Dominio Personalizado (Opcional)

En Vercel:
1. Ve a tu proyecto → Settings → Domains
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar DNS

## 🏊 Características

- ✅ Gestión de nadadores
- ✅ Control de asistencia con alertas proactivas
- ✅ Registro de marcas personales y récords
- ✅ Gestión de competencias con PDFs
- ✅ Sistema de logros y medallas
- ✅ Análisis estadístico con gráficos
- ✅ Autenticación por roles (Admin, Coach, Nadador)
- ✅ Sistema de solicitud de contraseñas
- ✅ Modo offline con fallback a localStorage
- ✅ Exportación de datos a PDF

## 🔧 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📝 Notas Técnicas

- **Frontend:** React + TypeScript + Vite
- **UI:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (Auth, Functions, Storage)
- **Gráficos:** Recharts
- **Estado:** React Context + localStorage fallback
- **Deploy:** Vercel

## 🎨 Branding

- **Colores principales:** 
  - Rojo: `#EF4444`
  - Negro: `#1F2937`
  - Blanco: `#FFFFFF`
- **Slogan:** "Haz que todo sea posible"

## 📧 Soporte

Para cualquier problema con el deployment, verifica:
1. Los logs en Vercel (Runtime Logs)
2. Los logs del servidor en Supabase (Edge Functions)
3. La consola del navegador (F12)
