@echo off
echo 🧹 Limpiando caches de desarrollo...
echo.

if exist "node_modules\.vite" (
    echo 🗑️  Eliminando: node_modules\.vite
    rmdir /s /q "node_modules\.vite"
    echo ✅ Eliminado: node_modules\.vite
) else (
    echo ℹ️  No existe: node_modules\.vite
)

if exist "dist" (
    echo 🗑️  Eliminando: dist
    rmdir /s /q "dist"
    echo ✅ Eliminado: dist
) else (
    echo ℹ️  No existe: dist
)

if exist ".vite" (
    echo 🗑️  Eliminando: .vite
    rmdir /s /q ".vite"
    echo ✅ Eliminado: .vite
) else (
    echo ℹ️  No existe: .vite
)

echo.
echo ✨ Limpieza completa!
echo 👉 Ahora puedes ejecutar: npm run dev
pause
