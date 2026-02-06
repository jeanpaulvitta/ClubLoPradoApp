# 🔧 Solución para Desarrollo Local

## Problema
Error en desarrollo local: `Rollup failed to resolve import "figma:asset/..."`

## ✅ Solución Rápida

### Opción 1: Limpiar caché y reiniciar (Recomendado)

#### Para todos los sistemas operativos:
```bash
# Detén el servidor de desarrollo si está corriendo (Ctrl+C)

# Limpia todos los cachés
npm run clean

# Inicia el servidor nuevamente
npm run dev
```

#### Alternativas por sistema operativo:

**Windows (PowerShell):**
```powershell
.\clean.ps1
npm run dev
```

**Windows (CMD):**
```cmd
clean.bat
npm run dev
```

**Linux/Mac:**
```bash
./clean.js
npm run dev
```

### Opción 2: Usar el comando con limpieza automática

```bash
npm run dev:clean
```

Este comando limpia automáticamente los cachés antes de iniciar el servidor.

---

## 🔍 Por qué sucede esto

El error ocurre porque:

1. **`figma:asset` es un esquema virtual** que solo funciona en el entorno de Figma Make
2. **Vite en desarrollo local** no puede resolver estos imports
3. **El caché de Vite** puede mantener referencias antiguas incluso después de actualizar el código

---

## ✅ Verificación

Después de limpiar el caché, verifica que:

1. El servidor inicie sin errores
2. La aplicación cargue en `http://localhost:5173`
3. El logo aparezca correctamente (ahora usa `/public/logo.svg`)
4. No haya errores en la consola del navegador

---

## 🚀 Comandos Útiles

```bash
# Desarrollo normal
npm run dev

# Desarrollo con limpieza de caché
npm run dev:clean

# Solo limpiar caché (sin iniciar servidor)
npm run clean

# Build para producción
npm run build

# Preview del build de producción
npm run preview
```

---

## 📝 Nota Importante

- ✅ **Producción (Vercel):** Funciona perfectamente
- ✅ **Desarrollo local:** Requiere limpieza de caché una vez
- ✅ **El logo ahora es un archivo SVG real** en `/public/logo.svg`

---

## 🆘 Si el problema persiste

1. Asegúrate de haber detenido completamente el servidor (Ctrl+C)
2. Cierra la terminal y ábrela nuevamente
3. Verifica que no haya procesos de Node corriendo:
   ```bash
   # En Linux/Mac
   killall node
   
   # En Windows (PowerShell)
   Get-Process node | Stop-Process
   ```
4. Ejecuta nuevamente:
   ```bash
   npm run dev:clean
   ```

---

## ✨ Estado Actual

- ✅ Código actualizado (sin referencias a `figma:asset`)
- ✅ Logo convertido a SVG real
- ✅ Funcionando en producción (Vercel)
- ✅ Scripts de limpieza agregados
- ⏳ Requiere limpieza de caché en desarrollo local