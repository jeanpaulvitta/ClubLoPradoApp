#!/usr/bin/env node

/**
 * Script para verificar si el servidor de Supabase está desplegado
 */

const projectId = 'tvkrvozifmbgkaztwxib';
const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2a3J2b3ppZm1iZ2thenR3eGliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NjY1MTIsImV4cCI6MjA4MzE0MjUxMn0.2cKgDYsSTn5I-Rpy_MPuvuvyY-_uzyIKkkO9qskzrro';

async function checkServer() {
  console.log('🔍 Verificando servidor de Supabase...\n');
  console.log(`📍 Project ID: ${projectId}`);
  console.log(`🔗 Base URL: https://${projectId}.supabase.co\n`);

  const healthUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc/health`;

  try {
    console.log('⏳ Consultando health endpoint...');
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
      console.log('\n✨ El servidor está correctamente desplegado y funcionando.');
      console.log('👉 Puedes crear el usuario administrador desde la aplicación.');
      process.exit(0);
    } else {
      console.log(`❌ Error HTTP ${response.status}`);
      const text = await response.text();
      console.log('📄 Respuesta:', text);
      console.log('\n⚠️  El servidor respondió con un error.');
      console.log('👉 Verifica los logs en Supabase Dashboard.');
      process.exit(1);
    }
  } catch (error) {
    console.log('❌ ERROR: No se pudo conectar al servidor\n');
    console.error(error.message);
    console.log('\n🔧 SOLUCIÓN:');
    console.log('El servidor de Edge Functions NO está desplegado en Supabase.\n');
    console.log('Pasos para desplegar:');
    console.log('1. Instala Supabase CLI:');
    console.log('   npm install -g supabase\n');
    console.log('2. Haz login:');
    console.log('   supabase login\n');
    console.log('3. Conecta al proyecto:');
    console.log(`   supabase link --project-ref ${projectId}\n`);
    console.log('4. Despliega las funciones:');
    console.log('   supabase functions deploy\n');
    console.log('5. Configura las variables de entorno (secrets)');
    console.log('   supabase secrets set SUPABASE_URL=https://tvkrvozifmbgkaztwxib.supabase.co');
    console.log('   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=tu_key_aqui');
    console.log('   supabase secrets set SUPABASE_ANON_KEY=tu_key_aqui\n');
    console.log('📖 Para más detalles, consulta: SUPABASE_DEPLOYMENT.md');
    process.exit(1);
  }
}

checkServer();
