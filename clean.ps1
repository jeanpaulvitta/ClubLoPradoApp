# Script de limpieza de caché para Windows PowerShell

Write-Host "🧹 Limpiando cachés de desarrollo...`n" -ForegroundColor Cyan

$dirsToClean = @(
    "node_modules\.vite",
    "dist",
    ".vite"
)

foreach ($dir in $dirsToClean) {
    if (Test-Path $dir) {
        Write-Host "🗑️  Eliminando: $dir" -ForegroundColor Yellow
        Remove-Item -Recurse -Force $dir -ErrorAction SilentlyContinue
        Write-Host "✅ Eliminado: $dir" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  No existe: $dir" -ForegroundColor Gray
    }
}

Write-Host "`n✨ Limpieza completa!" -ForegroundColor Green
Write-Host "👉 Ahora puedes ejecutar: npm run dev" -ForegroundColor Cyan
