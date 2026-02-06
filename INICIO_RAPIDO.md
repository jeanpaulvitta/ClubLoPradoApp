# ⚡ Inicio Rápido - Solución Error Development Local

## 🎯 Tu Problema

Error: `Rollup failed to resolve import "figma:asset/..."`

## ✅ Solución en 3 Pasos

### Paso 1: Detén el servidor
Si el servidor está corriendo, presiona `Ctrl+C` en la terminal

### Paso 2: Limpia el caché
```bash
npm run clean
```

Verás algo como:
```
🧹 Limpiando cachés de desarrollo...

🗑️  Eliminando: node_modules/.vite
✅ Eliminado: node_modules/.vite
🗑️  Eliminando: dist
✅ Eliminado: dist
ℹ️  No existe: .vite

✨ Limpieza completa!
👉 Ahora puedes ejecutar: npm run dev
```

### Paso 3: Inicia el servidor
```bash
npm run dev
```

## 🚀 O Todo en Un Comando

```bash
npm run dev:clean
```

Este comando hace la limpieza y luego inicia el servidor automáticamente.

---

## ✅ Verificación

Después de ejecutar estos pasos:

1. ✅ El servidor debe iniciar sin errores
2. ✅ Deberías ver: `VITE v6.x.x ready in X ms`
3. ✅ La app estará en: `http://localhost:5173`
4. ✅ El logo debe aparecer correctamente

---

## 📱 Próximos Pasos

Una vez que la aplicación esté corriendo localmente:

1. **Ir a la aplicación:** http://localhost:5173
2. **Ver el banner de bienvenida** (morado/azul con animación)
3. **Hacer clic en:** "Crear Usuario Administrador Ahora"
4. **Usar el Panel de Diagnóstico** para verificar la conectividad
5. **Crear el administrador** con un clic

---

## 🆘 Si Aún No Funciona

### Opción A: Limpieza Manual

```bash
# Windows (PowerShell)
Remove-Item -Recurse -Force node_modules\.vite, dist, .vite -ErrorAction SilentlyContinue

# Linux/Mac
rm -rf node_modules/.vite dist .vite
```

### Opción B: Reinstalar dependencias

```bash
# Eliminar node_modules
rm -rf node_modules

# Reinstalar
npm install

# Limpiar y ejecutar
npm run dev:clean
```

### Opción C: Cerrar todos los procesos de Node

```bash
# Linux/Mac
killall node

# Windows (PowerShell como Administrador)
Get-Process node | Stop-Process -Force
```

Luego intenta nuevamente:
```bash
npm run dev:clean
```

---

## 🎉 Estado del Proyecto

- ✅ **Producción (Vercel):** Funcionando perfectamente en https://clubnatacionloprado-bzxkjy9d9-jean-paul-vittas-projects.vercel.app/
- ⏳ **Desarrollo Local:** Requiere limpieza de caché (solo una vez)
- ✅ **Logo:** Convertido a SVG real en `/public/logo.svg`
- ✅ **Código:** Sin referencias a `figma:asset`

---

## 📚 Documentación Adicional

- **Solución Detallada:** [DEV_LOCAL_FIX.md](./DEV_LOCAL_FIX.md)
- **Troubleshooting Completo:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **README Principal:** [README.md](./README.md)
