#!/usr/bin/env node

/**
 * Script de limpieza de caché para desarrollo local
 * Compatible con Windows, Linux y macOS
 */

const fs = require('fs');
const path = require('path');

// Directorios a limpiar
const dirsToClean = [
  'node_modules/.vite',
  'dist',
  '.vite'
];

function removeDir(dirPath) {
  const fullPath = path.join(process.cwd(), dirPath);
  
  if (fs.existsSync(fullPath)) {
    console.log(`🗑️  Eliminando: ${dirPath}`);
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`✅ Eliminado: ${dirPath}`);
  } else {
    console.log(`ℹ️  No existe: ${dirPath}`);
  }
}

console.log('🧹 Limpiando cachés de desarrollo...\n');

dirsToClean.forEach(removeDir);

console.log('\n✨ Limpieza completa!');
console.log('👉 Ahora puedes ejecutar: npm run dev');
