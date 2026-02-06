#!/usr/bin/env node

/**
 * 🚀 Asistente de Deployment para Edge Functions de Supabase
 * Este script te guía paso a paso en el proceso de deployment
 */

const { execSync } = require('child_process');
const readline = require('readline');

const projectId = 'tvkrvozifmbgkaztwxib';
const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2a3J2b3ppZm1iZ2thenR3eGliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NjY1MTIsImV4cCI6MjA4MzE0MjUxMn0.2cKgDYsSTn5I-Rpy_MPuvuvyY-_uzyIKkkO9qskzrro';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function exec(command, silent = false) {
  try {
    const result = execSync(command, { 
      encoding: 'utf8',
      stdio: silent ? 'pipe' : 'inherit'
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function checkCLI() {
  console.log('\n📋 PASO 1: Verificando Supabase CLI...\n');
  
  const result = exec('supabase --version', true);
  
  if (result.success) {
    console.log('✅ Supabase CLI instalado:', result.output.trim());
    return true;
  } else {
    console.log('❌ Supabase CLI no está instalado.\n');
    console.log('🔧 Instalando Supabase CLI...\n');
    
    const install = exec('npm install -g supabase');
    
    if (install.success) {
      console.log('\n✅ Supabase CLI instalado correctamente.');
      return true;
    } else {
      console.log('\n❌ Error al instalar Supabase CLI.');
      console.log('Por favor, instálalo manualmente:');
      console.log('   npm install -g supabase\n');
      return false;
    }
  }
}

async function checkLogin() {
  console.log('\n📋 PASO 2: Verificando login en Supabase...\n');
  
  const result = exec('supabase projects list', true);
  
  if (result.success) {
    console.log('✅ Ya estás autenticado en Supabase.\n');
    return true;
  } else {
    console.log('❌ No estás autenticado.\n');
    console.log('🔐 Por favor, inicia sesión en Supabase.\n');
    console.log('Se abrirá tu navegador para autenticarte...\n');
    
    await question('Presiona ENTER para continuar...');
    
    const login = exec('supabase login');
    
    if (login.success) {
      console.log('\n✅ Login exitoso.\n');
      return true;
    } else {
      console.log('\n❌ Error al hacer login.\n');
      return false;
    }
  }
}

async function linkProject() {
  console.log('\n📋 PASO 3: Conectando al proyecto...\n');
  console.log(`Project ID: ${projectId}\n`);
  
  // Check if already linked
  const check = exec('supabase projects list', true);
  if (check.success && check.output.includes(projectId)) {
    console.log('✅ Proyecto ya está conectado.\n');
    return true;
  }
  
  console.log('🔗 Conectando al proyecto...\n');
  console.log('Se te pedirá la contraseña de la base de datos.\n');
  console.log('Si no la recuerdas, ve a:');
  console.log(`   https://supabase.com/dashboard/project/${projectId}/settings/database\n`);
  
  await question('Presiona ENTER cuando estés listo...');
  
  const link = exec(`supabase link --project-ref ${projectId}`);
  
  if (link.success) {
    console.log('\n✅ Proyecto conectado correctamente.\n');
    return true;
  } else {
    console.log('\n❌ Error al conectar el proyecto.\n');
    return false;
  }
}

async function deployFunctions() {
  console.log('\n📋 PASO 4: Desplegando Edge Functions...\n');
  
  console.log('🚀 Iniciando deployment...\n');
  
  const deploy = exec('supabase functions deploy');
  
  if (deploy.success) {
    console.log('\n✅ Edge Functions desplegadas correctamente.\n');
    return true;
  } else {
    console.log('\n❌ Error al desplegar Edge Functions.\n');
    return false;
  }
}

async function configureSecrets() {
  console.log('\n📋 PASO 5: Configurando variables de entorno (secrets)...\n');
  
  // Set SUPABASE_URL
  console.log('1️⃣ Configurando SUPABASE_URL...');
  const url = exec(`supabase secrets set SUPABASE_URL=https://${projectId}.supabase.co`, true);
  if (url.success) {
    console.log('   ✅ SUPABASE_URL configurado\n');
  } else {
    console.log('   ❌ Error configurando SUPABASE_URL\n');
  }
  
  // Set SUPABASE_ANON_KEY
  console.log('2️⃣ Configurando SUPABASE_ANON_KEY...');
  const anon = exec(`supabase secrets set SUPABASE_ANON_KEY=${publicAnonKey}`, true);
  if (anon.success) {
    console.log('   ✅ SUPABASE_ANON_KEY configurado\n');
  } else {
    console.log('   ❌ Error configurando SUPABASE_ANON_KEY\n');
  }
  
  // Set SUPABASE_SERVICE_ROLE_KEY
  console.log('3️⃣ Configurando SUPABASE_SERVICE_ROLE_KEY...\n');
  console.log('⚠️  IMPORTANTE: Necesitas el service_role key de tu proyecto.\n');
  console.log('📍 Donde obtenerlo:');
  console.log(`   https://supabase.com/dashboard/project/${projectId}/settings/api\n`);
  console.log('👉 Busca "service_role secret" y haz clic en "Reveal"\n');
  
  const serviceKey = await question('Pega aquí tu service_role key: ');
  
  if (serviceKey && serviceKey.trim().length > 0) {
    console.log('\n⏳ Configurando...');
    const service = exec(`supabase secrets set SUPABASE_SERVICE_ROLE_KEY=${serviceKey.trim()}`, true);
    if (service.success) {
      console.log('   ✅ SUPABASE_SERVICE_ROLE_KEY configurado\n');
    } else {
      console.log('   ❌ Error configurando SUPABASE_SERVICE_ROLE_KEY\n');
      return false;
    }
  } else {
    console.log('   ❌ No se proporcionó el service_role key\n');
    return false;
  }
  
  // Verify all secrets
  console.log('🔍 Verificando secrets configurados...\n');
  const list = exec('supabase secrets list', true);
  if (list.success) {
    console.log('✅ Secrets configurados correctamente:\n');
    console.log(list.output);
    return true;
  } else {
    console.log('⚠️  No se pudieron listar los secrets\n');
    return true; // Continue anyway
  }
}

async function verifyDeployment() {
  console.log('\n📋 PASO 6: Verificando deployment...\n');
  
  const healthUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc/health`;
  
  console.log('⏳ Probando health endpoint...\n');
  
  try {
    const response = await fetch(healthUrl, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ ¡SERVIDOR FUNCIONANDO!\n');
      console.log('📦 Respuesta:');
      console.log(JSON.stringify(data, null, 2));
      console.log('\n');
      return true;
    } else {
      console.log(`❌ Error HTTP ${response.status}\n`);
      const text = await response.text();
      console.log('Respuesta:', text);
      console.log('\n');
      return false;
    }
  } catch (error) {
    console.log('❌ No se pudo conectar al servidor\n');
    console.log('Error:', error.message);
    console.log('\n');
    return false;
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  🚀 ASISTENTE DE DEPLOYMENT - SUPABASE EDGE FUNCTIONS    ║');
  console.log('║  Club Natación Lo Prado                                   ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  console.log('Este asistente te guiará paso a paso en el deployment.\n');
  
  await question('Presiona ENTER para comenzar...');
  
  // Step 1: Check CLI
  const cliOk = await checkCLI();
  if (!cliOk) {
    rl.close();
    process.exit(1);
  }
  
  // Step 2: Check login
  const loginOk = await checkLogin();
  if (!loginOk) {
    rl.close();
    process.exit(1);
  }
  
  // Step 3: Link project
  const linkOk = await linkProject();
  if (!linkOk) {
    rl.close();
    process.exit(1);
  }
  
  // Step 4: Deploy functions
  const deployOk = await deployFunctions();
  if (!deployOk) {
    rl.close();
    process.exit(1);
  }
  
  // Step 5: Configure secrets
  const secretsOk = await configureSecrets();
  if (!secretsOk) {
    console.log('⚠️  Hubo un problema configurando los secrets.');
    console.log('Puedes configurarlos manualmente más tarde.\n');
  }
  
  // Step 6: Verify
  const verifyOk = await verifyDeployment();
  
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  if (verifyOk) {
    console.log('║  ✅ ¡DEPLOYMENT COMPLETADO EXITOSAMENTE!                  ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    console.log('🎉 Próximos pasos:\n');
    console.log('1. Ejecuta tu aplicación:');
    console.log('   npm run dev\n');
    console.log('2. Abre: http://localhost:5173\n');
    console.log('3. Crea el usuario administrador:\n');
    console.log('   - Haz clic en "Crear Usuario Administrador Ahora"');
    console.log('   - O hazlo desde la terminal:');
    console.log(`     curl -X POST https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc/auth/init-admin \\\n       -H "Authorization: Bearer ${publicAnonKey}"\n`);
    console.log('4. Inicia sesión con:');
    console.log('   - Email: admin@loprado.cl');
    console.log('   - Password: admin123\n');
  } else {
    console.log('║  ⚠️  DEPLOYMENT COMPLETADO CON ADVERTENCIAS               ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    console.log('🔧 El servidor fue desplegado pero no responde.\n');
    console.log('Posibles soluciones:\n');
    console.log('1. Verifica los logs:');
    console.log('   supabase functions logs server\n');
    console.log('2. Verifica los secrets:');
    console.log('   supabase secrets list\n');
    console.log('3. Intenta redesplegar:');
    console.log('   supabase functions deploy server\n');
    console.log('4. Consulta la guía: DESPLIEGUE_PASO_A_PASO.md\n');
  }
  
  rl.close();
}

main().catch(error => {
  console.error('\n❌ Error inesperado:', error);
  rl.close();
  process.exit(1);
});
