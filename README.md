# Club Natación Lo Prado - Sistema de Gestión

> **Haz que todo sea posible** 🏊‍♂️

Sistema completo de gestión para el Club Natación Lo Prado con entrenamientos, asistencia, competencias, y análisis de rendimiento.

---

## 🚨 ¿Ves el error "Servidor no alcanzable"?

```
❌ Servidor no alcanzable: TypeError: Failed to fetch
```

### ✅ Solución Rápida (1 comando):

```bash
npm run deploy
```

Este comando ejecuta un asistente interactivo que te guiará paso a paso.

### 📚 Documentación Completa de Deployment:

- **`LEEME_DEPLOYMENT.md`** ⭐ **EMPIEZA AQUÍ** - Guía completa con todas las opciones
- **`SOLUCION_RAPIDA.md`** - Comandos directos (2 minutos)
- **`DESPLIEGUE_PASO_A_PASO.md`** - Guía detallada para principiantes
- **`INDICE_DOCUMENTACION.md`** - Índice completo de toda la documentación

### 🔍 Comandos de Diagnóstico:

```bash
npm run check-server    # Verificar estado rápido
npm run verify          # Verificación completa de endpoints
```

---

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

### Primera vez o después de cambios importantes

Si obtienes errores de `figma:asset` en desarrollo local, limpia el caché primero:

```bash
# Limpiar caché y ejecutar
npm run dev:clean
```

### Desarrollo normal

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Limpiar solo el caché (sin iniciar servidor)
npm run clean
```

### 🔧 Solución de Problemas en Desarrollo Local

Si ves el error `Rollup failed to resolve import "figma:asset/..."`:

1. **Detén el servidor** (Ctrl+C)
2. **Limpia el caché:**
   ```bash
   npm run clean
   ```
3. **Reinicia el servidor:**
   ```bash
   npm run dev
   ```

O usa el comando combinado:
```bash
npm run dev:clean
```

📖 Para más detalles, consulta [DEV_LOCAL_FIX.md](./DEV_LOCAL_FIX.md)

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