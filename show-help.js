#!/usr/bin/env node

/**
 * 📚 Mostrar ayuda rápida y archivos de documentación disponibles
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function printHeader() {
  console.log('\n' + colors.cyan + colors.bright);
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         📚 CLUB NATACIÓN LO PRADO - AYUDA RÁPIDA         ║');
  console.log('║              "Haz que todo sea posible"                   ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(colors.reset);
}

function printSection(title, items, color = colors.cyan) {
  console.log('\n' + color + colors.bright + title + colors.reset);
  console.log(color + '─'.repeat(60) + colors.reset);
  items.forEach(item => {
    console.log(color + '  ' + item.icon + colors.reset + '  ' + colors.bright + item.title + colors.reset);
    console.log('     ' + item.desc);
    if (item.command) {
      console.log('     ' + colors.yellow + '$ ' + item.command + colors.reset);
    }
  });
}

function printCommands() {
  printSection('⚡ COMANDOS RÁPIDOS', [
    {
      icon: '🚀',
      title: 'Desplegar servidor (Asistente)',
      desc: 'Ejecuta un asistente interactivo para deployment',
      command: 'npm run deploy'
    },
    {
      icon: '🔍',
      title: 'Verificar servidor (rápido)',
      desc: 'Verifica si el health endpoint responde',
      command: 'npm run check-server'
    },
    {
      icon: '✅',
      title: 'Verificar servidor (completo)',
      desc: 'Verifica todos los endpoints del servidor',
      command: 'npm run verify'
    },
    {
      icon: '💻',
      title: 'Iniciar aplicación',
      desc: 'Inicia el servidor de desarrollo',
      command: 'npm run dev'
    },
    {
      icon: '🧹',
      title: 'Limpiar cache + iniciar',
      desc: 'Limpia el cache de Vite y luego inicia',
      command: 'npm run dev:clean'
    }
  ], colors.green);
}

function printDocs() {
  printSection('📖 DOCUMENTACIÓN DE DEPLOYMENT', [
    {
      icon: '⭐',
      title: 'LEEME_DEPLOYMENT.md',
      desc: 'EMPIEZA AQUÍ - Guía completa con todas las opciones'
    },
    {
      icon: '⚡',
      title: 'SOLUCION_RAPIDA.md',
      desc: 'Comandos directos para solución rápida (2 min)'
    },
    {
      icon: '📝',
      title: 'DESPLIEGUE_PASO_A_PASO.md',
      desc: 'Guía detallada con explicaciones paso a paso'
    },
    {
      icon: '🔧',
      title: 'SUPABASE_DEPLOYMENT.md',
      desc: 'Documentación técnica completa del backend'
    },
    {
      icon: '⚡',
      title: 'QUICK_START.md',
      desc: 'Inicio súper rápido en 1 página'
    }
  ], colors.blue);
}

function printUserDocs() {
  printSection('📚 GUÍAS DE USUARIO', [
    {
      icon: '🚀',
      title: 'INICIO_RAPIDO.md',
      desc: 'Primeros pasos usando la aplicación'
    },
    {
      icon: '📖',
      title: 'INSTRUCCIONES_PRIMER_USO.md',
      desc: 'Configuración inicial y primer uso'
    },
    {
      icon: '🏊',
      title: 'GUIA_GESTION_ENTRENAMIENTOS_GRUPOS.md',
      desc: 'Cómo gestionar entrenamientos y grupos'
    }
  ], colors.magenta);
}

function printTechnicalDocs() {
  printSection('🔧 DOCUMENTACIÓN TÉCNICA', [
    {
      icon: '🆘',
      title: 'TROUBLESHOOTING.md',
      desc: 'Solución a problemas comunes'
    },
    {
      icon: '📋',
      title: 'CHECKLIST.md',
      desc: 'Lista de verificación del deployment'
    },
    {
      icon: '🔄',
      title: 'MIGRACION_SUPABASE.md',
      desc: 'Detalles técnicos de la migración'
    },
    {
      icon: '💻',
      title: 'DEV_LOCAL_FIX.md',
      desc: 'Soluciones para desarrollo local'
    },
    {
      icon: '📚',
      title: 'INDICE_DOCUMENTACION.md',
      desc: 'Índice completo de toda la documentación'
    }
  ], colors.cyan);
}

function printError() {
  console.log('\n' + colors.red + colors.bright);
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  🚨 ¿VES EL ERROR "Servidor no alcanzable"?');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(colors.reset);
  console.log(colors.red + '\n  Error típico:' + colors.reset);
  console.log('  ❌ Servidor no alcanzable: TypeError: Failed to fetch\n');
  console.log(colors.green + '  Solución rápida:' + colors.reset);
  console.log(colors.yellow + '  $ npm run deploy' + colors.reset);
  console.log('\n  O lee: ' + colors.bright + 'LEEME_DEPLOYMENT.md' + colors.reset + '\n');
}

function printLinks() {
  printSection('🔗 ENLACES IMPORTANTES', [
    {
      icon: '🌐',
      title: 'App en Producción',
      desc: 'https://clubnatacionloprado-bzxkjy9d9-jean-paul-vittas-projects.vercel.app/'
    },
    {
      icon: '📊',
      title: 'Dashboard Supabase',
      desc: 'https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib'
    },
    {
      icon: '⚡',
      title: 'Edge Functions',
      desc: 'https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/functions'
    },
    {
      icon: '🔑',
      title: 'API Keys',
      desc: 'https://supabase.com/dashboard/project/tvkrvozifmbgkaztwxib/settings/api'
    }
  ], colors.blue);
}

function printCredentials() {
  console.log('\n' + colors.yellow + colors.bright);
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  🔐 CREDENCIALES DEL ADMINISTRADOR');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(colors.reset);
  console.log(colors.yellow + '\n  Después de ejecutar ' + colors.bright + 'npm run deploy' + colors.reset + colors.yellow + ':' + colors.reset);
  console.log('\n  Email:    ' + colors.bright + 'admin@loprado.cl' + colors.reset);
  console.log('  Password: ' + colors.bright + 'admin123' + colors.reset);
  console.log('\n  ' + colors.red + '⚠️  CAMBIAR contraseña después del primer login' + colors.reset + '\n');
}

function printSupport() {
  printSection('🆘 SOPORTE Y DIAGNÓSTICO', [
    {
      icon: '🔍',
      title: 'Verificar estado completo',
      desc: 'Ejecuta diagnóstico de todos los endpoints',
      command: 'npm run verify'
    },
    {
      icon: '📋',
      title: 'Ver logs del servidor',
      desc: 'Ver logs en tiempo real de Edge Functions',
      command: 'supabase functions logs server --follow'
    },
    {
      icon: '🔑',
      title: 'Ver configuración',
      desc: 'Ver todos los secrets configurados',
      command: 'supabase secrets list'
    },
    {
      icon: '🔄',
      title: 'Redesplegar',
      desc: 'Redesplegar Edge Functions después de cambios',
      command: 'supabase functions deploy server'
    }
  ], colors.cyan);
}

function printFooter() {
  console.log('\n' + colors.green + colors.bright);
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  💡 TIP: Guarda este comando para referencia futura:');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(colors.reset);
  console.log(colors.yellow + '\n  $ node show-help.js' + colors.reset);
  console.log('  ' + colors.cyan + 'o simplemente:' + colors.reset);
  console.log(colors.yellow + '  $ npm run help' + colors.reset);
  console.log('\n' + colors.cyan + '  📌 Para empezar: ' + colors.bright + 'LEEME_DEPLOYMENT.md' + colors.reset);
  console.log('  🆘 ¿Problemas?: ' + colors.bright + 'TROUBLESHOOTING.md' + colors.reset);
  console.log('  📚 Ver todo:    ' + colors.bright + 'INDICE_DOCUMENTACION.md' + colors.reset + '\n');
}

// Main
printHeader();
printError();
printCommands();
printDocs();
printUserDocs();
printTechnicalDocs();
printLinks();
printCredentials();
printSupport();
printFooter();
