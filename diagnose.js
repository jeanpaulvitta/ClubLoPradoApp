#!/usr/bin/env node

/**
 * Script de diagnóstico para la app Club Natación Lo Prado
 * Ejecutar con: node diagnose.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 DIAGNÓSTICO DE LA APLICACIÓN\n');
console.log('═══════════════════════════════════════════════════\n');

let issues = 0;
let warnings = 0;

// Verificar archivos críticos
const criticalFiles = [
  'src/app/App.tsx',
  'src/app/contexts/AuthContext.tsx',
  'src/app/components/LoginPage.tsx',
  'index.html',
  'package.json',
  'vite.config.ts',
];

console.log('📁 Verificando archivos críticos...\n');
criticalFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  if (exists) {
    const stats = fs.statSync(path.join(__dirname, file));
    console.log(`✅ ${file} (${stats.size} bytes)`);
  } else {
    console.log(`❌ ${file} - NO ENCONTRADO`);
    issues++;
  }
});

// Verificar archivos públicos
console.log('\n📁 Verificando archivos públicos...\n');
const publicFiles = [
  'public/manifest.json',
  'public/sw.js',
  'public/logo.svg',
];

publicFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  if (exists) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`⚠️  ${file} - NO ENCONTRADO (puede afectar PWA)`);
    warnings++;
  }
});

// Verificar package.json
console.log('\n📦 Verificando dependencias...\n');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  
  const criticalDeps = [
    'react',
    '@supabase/supabase-js',
    'lucide-react',
    'recharts',
  ];
  
  criticalDeps.forEach(dep => {
    if (packageJson.dependencies?.[dep] || packageJson.peerDependencies?.[dep]) {
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} - NO INSTALADO`);
      issues++;
    }
  });
} catch (error) {
  console.log(`❌ Error leyendo package.json: ${error.message}`);
  issues++;
}

// Verificar node_modules
console.log('\n📚 Verificando node_modules...\n');
if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
  const modulesCount = fs.readdirSync(path.join(__dirname, 'node_modules')).length;
  console.log(`✅ node_modules existe (${modulesCount} paquetes)`);
} else {
  console.log(`❌ node_modules NO EXISTE - ejecuta: npm install`);
  issues++;
}

// Verificar configuración de Vite
console.log('\n⚙️  Verificando configuración de Vite...\n');
try {
  const viteConfig = fs.readFileSync(path.join(__dirname, 'vite.config.ts'), 'utf8');
  
  if (viteConfig.includes('@tailwindcss/vite')) {
    console.log('✅ Plugin de Tailwind configurado');
  } else {
    console.log('⚠️  Plugin de Tailwind no encontrado');
    warnings++;
  }
  
  if (viteConfig.includes('@vitejs/plugin-react')) {
    console.log('✅ Plugin de React configurado');
  } else {
    console.log('❌ Plugin de React no encontrado');
    issues++;
  }
  
  if (viteConfig.includes('publicDir')) {
    console.log('✅ publicDir configurado');
  } else {
    console.log('⚠️  publicDir no configurado explícitamente');
    warnings++;
  }
} catch (error) {
  console.log(`❌ Error leyendo vite.config.ts: ${error.message}`);
  issues++;
}

// Verificar estructura de archivos TypeScript
console.log('\n📝 Verificando estructura de código...\n');
try {
  const appTsx = fs.readFileSync(path.join(__dirname, 'src/app/App.tsx'), 'utf8');
  
  if (appTsx.includes('export default')) {
    console.log('✅ App.tsx tiene export default');
  } else {
    console.log('❌ App.tsx no tiene export default');
    issues++;
  }
  
  if (appTsx.includes('AuthProvider')) {
    console.log('✅ AuthProvider importado');
  } else {
    console.log('❌ AuthProvider no encontrado');
    issues++;
  }
  
  if (appTsx.includes('ErrorBoundary')) {
    console.log('✅ ErrorBoundary implementado');
  } else {
    console.log('⚠️  ErrorBoundary no encontrado');
    warnings++;
  }
  
  if (appTsx.includes('QuickFix')) {
    console.log('✅ QuickFix implementado');
  } else {
    console.log('⚠️  QuickFix no encontrado (herramienta de diagnóstico)');
    warnings++;
  }
} catch (error) {
  console.log(`❌ Error leyendo App.tsx: ${error.message}`);
  issues++;
}

// Verificar index.html
console.log('\n🌐 Verificando index.html...\n');
try {
  const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  
  if (indexHtml.includes('viewport')) {
    console.log('✅ Meta viewport configurado');
  } else {
    console.log('❌ Meta viewport no encontrado');
    issues++;
  }
  
  if (indexHtml.includes('manifest.json')) {
    console.log('✅ Manifest.json enlazado');
  } else {
    console.log('⚠️  Manifest.json no enlazado');
    warnings++;
  }
  
  if (indexHtml.includes('src/app/App.tsx')) {
    console.log('✅ Script de App.tsx enlazado');
  } else {
    console.log('❌ Script de App.tsx no encontrado');
    issues++;
  }
} catch (error) {
  console.log(`❌ Error leyendo index.html: ${error.message}`);
  issues++;
}

// Resumen
console.log('\n═══════════════════════════════════════════════════');
console.log('\n📊 RESUMEN DEL DIAGNÓSTICO\n');

if (issues === 0 && warnings === 0) {
  console.log('✅ TODO ESTÁ BIEN - No se encontraron problemas\n');
  console.log('Si la app aún no funciona:');
  console.log('1. Ejecuta: npm install');
  console.log('2. Ejecuta: npm run dev');
  console.log('3. Abre el navegador en http://localhost:5173');
  console.log('4. Revisa la consola del navegador (F12) para ver errores');
  console.log('5. Ver: SOLUCION_INMEDIATA.md\n');
} else {
  console.log(`❌ Se encontraron ${issues} problema(s) crítico(s)`);
  console.log(`⚠️  Se encontraron ${warnings} advertencia(s)\n`);
  
  console.log('🔧 ACCIONES RECOMENDADAS:\n');
  
  if (issues > 0) {
    console.log('1. Verifica que todos los archivos críticos existan');
    console.log('2. Ejecuta: npm install (para restaurar dependencias)');
    console.log('3. Revisa los errores específicos arriba');
  }
  
  if (warnings > 0) {
    console.log('4. Las advertencias no son críticas pero pueden mejorar la funcionalidad');
  }
  
  console.log('\n📚 DOCUMENTACIÓN ÚTIL:');
  console.log('- SOLUCION_INMEDIATA.md - Soluciones rápidas');
  console.log('- DIAGNOSTICO_RAPIDO.md - Diagnóstico detallado');
  console.log('- README.md - Información general\n');
}

console.log('═══════════════════════════════════════════════════\n');

// Exit code
process.exit(issues > 0 ? 1 : 0);
