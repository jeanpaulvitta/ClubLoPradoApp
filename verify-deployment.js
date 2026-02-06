#!/usr/bin/env node

/**
 * 🔍 Script de Verificación Visual del Estado del Deployment
 */

const projectId = 'tvkrvozifmbgkaztwxib';
const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2a3J2b3ppZm1iZ2thenR3eGliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NjY1MTIsImV4cCI6MjA4MzE0MjUxMn0.2cKgDYsSTn5I-Rpy_MPuvuvyY-_uzyIKkkO9qskzrro';

function printBox(title, content, status = 'info') {
  const colors = {
    success: '\x1b[32m', // Green
    error: '\x1b[31m',   // Red
    warning: '\x1b[33m', // Yellow
    info: '\x1b[36m',    // Cyan
    reset: '\x1b[0m'
  };
  
  const color = colors[status] || colors.info;
  const reset = colors.reset;
  
  console.log('\n' + color + '╔' + '═'.repeat(58) + '╗' + reset);
  console.log(color + '║ ' + title.padEnd(57) + '║' + reset);
  console.log(color + '╠' + '═'.repeat(58) + '╣' + reset);
  
  if (Array.isArray(content)) {
    content.forEach(line => {
      console.log(color + '║ ' + reset + line.padEnd(57) + color + '║' + reset);
    });
  } else {
    console.log(color + '║ ' + reset + content.padEnd(57) + color + '║' + reset);
  }
  
  console.log(color + '╚' + '═'.repeat(58) + '╝' + reset);
}

async function checkEndpoint(name, url, expectedStatus = 200) {
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      try {
        const data = await response.json();
        return { success: true, status: response.status, data };
      } catch {
        return { success: true, status: response.status, data: 'OK' };
      }
    } else {
      const text = await response.text();
      return { success: false, status: response.status, error: text };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function verify() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         🔍 VERIFICACIÓN DEL ESTADO DEL DEPLOYMENT         ║');
  console.log('║              Club Natación Lo Prado                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  // Project Info
  printBox('📋 INFORMACIÓN DEL PROYECTO', [
    `Project ID: ${projectId}`,
    `Base URL: https://${projectId}.supabase.co`,
    `Dashboard: https://supabase.com/dashboard/project/${projectId}`
  ], 'info');
  
  console.log('\n⏳ Verificando endpoints...\n');
  
  // Check Health Endpoint
  console.log('1️⃣  Health Endpoint...');
  const healthUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc/health`;
  const healthCheck = await checkEndpoint('Health', healthUrl);
  
  if (healthCheck.success) {
    console.log('    ✅ OK - Servidor funcionando');
    console.log(`    📦 Version: ${healthCheck.data?.version || 'N/A'}`);
  } else {
    console.log('    ❌ FALLO - Servidor no responde');
    console.log(`    🔴 Error: ${healthCheck.error || `HTTP ${healthCheck.status}`}`);
  }
  
  // Check Auth Init Admin Endpoint
  console.log('\n2️⃣  Auth Init Admin Endpoint...');
  const initAdminUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc/auth/init-admin`;
  const initCheck = await checkEndpoint('Init Admin', initAdminUrl);
  
  if (initCheck.success || initCheck.status === 400) {
    console.log('    ✅ OK - Endpoint accesible');
    if (initCheck.data?.message?.includes('already exists')) {
      console.log('    ℹ️  Admin ya existe (OK)');
    }
  } else {
    console.log('    ❌ FALLO - Endpoint no accesible');
  }
  
  // Check Swimmers Endpoint
  console.log('\n3️⃣  Swimmers Endpoint...');
  const swimmersUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc/swimmers`;
  const swimmersCheck = await checkEndpoint('Swimmers', swimmersUrl);
  
  if (swimmersCheck.success) {
    console.log('    ✅ OK - Endpoint funcionando');
    console.log(`    📊 Nadadores: ${swimmersCheck.data?.swimmers?.length || 0}`);
  } else {
    console.log('    ❌ FALLO - Endpoint no responde');
  }
  
  // Summary
  const allSuccess = healthCheck.success && 
                     (initCheck.success || initCheck.status === 400) && 
                     swimmersCheck.success;
  
  if (allSuccess) {
    printBox('✅ RESULTADO: DEPLOYMENT EXITOSO', [
      '',
      'Todos los endpoints están funcionando correctamente.',
      '',
      '🎯 Próximos pasos:',
      '',
      '1. Iniciar la aplicación:',
      '   npm run dev',
      '',
      '2. Abrir: http://localhost:5173',
      '',
      '3. Crear usuario administrador:',
      '   - Haz clic en "Crear Usuario Administrador Ahora"',
      '   - Email: admin@loprado.cl',
      '   - Password: admin123',
      ''
    ], 'success');
  } else {
    printBox('⚠️  RESULTADO: DEPLOYMENT INCOMPLETO', [
      '',
      'Algunos endpoints no están funcionando.',
      '',
      '🔧 Soluciones:',
      '',
      '1. Verifica que las Edge Functions estén desplegadas:',
      '   supabase functions list',
      '',
      '2. Verifica los secrets:',
      '   supabase secrets list',
      '   Debe mostrar: SUPABASE_URL, SUPABASE_ANON_KEY,',
      '                 SUPABASE_SERVICE_ROLE_KEY',
      '',
      '3. Revisa los logs:',
      '   supabase functions logs server',
      '',
      '4. Intenta redesplegar:',
      '   supabase functions deploy server',
      '',
      '5. Consulta la guía: DESPLIEGUE_PASO_A_PASO.md',
      ''
    ], 'warning');
  }
  
  // Quick Links
  printBox('🔗 ENLACES ÚTILES', [
    '',
    `Dashboard: https://supabase.com/dashboard/project/${projectId}`,
    `Functions: https://supabase.com/dashboard/project/${projectId}/functions`,
    `API Keys: https://supabase.com/dashboard/project/${projectId}/settings/api`,
    `Logs: https://supabase.com/dashboard/project/${projectId}/logs`,
    ''
  ], 'info');
  
  console.log('\n');
}

verify().catch(error => {
  console.error('\n❌ Error durante la verificación:', error.message);
  process.exit(1);
});
