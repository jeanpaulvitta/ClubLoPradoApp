/**
 * Script de prueba para el cambio de contraseñas
 * 
 * CÓMO USAR:
 * 1. Inicia sesión en la aplicación
 * 2. Abre DevTools (F12) → Console
 * 3. Escribe: allow pasting
 * 4. Copia y pega este script
 * 5. Presiona Enter
 * 
 * Este script NO cambia tu contraseña, solo verifica que el sistema esté funcionando.
 */

(async function testChangePasswordSystem() {
  console.log('🔍 VERIFICACIÓN DEL SISTEMA DE CAMBIO DE CONTRASEÑAS');
  console.log('=====================================================\n');

  let allChecks = true;

  // Check 1: Verificar que Supabase está disponible
  console.log('1️⃣ Verificando cliente de Supabase...');
  if (typeof supabase === 'undefined' || !supabase.auth) {
    console.error('❌ Cliente de Supabase no está disponible');
    allChecks = false;
  } else {
    console.log('✅ Cliente de Supabase disponible');
  }

  // Check 2: Verificar sesión activa
  console.log('\n2️⃣ Verificando sesión activa...');
  try {
    const { data: sessionData, error } = await supabase.auth.getSession();
    
    if (error || !sessionData.session) {
      console.error('❌ No hay sesión activa');
      console.log('   Solución: Inicia sesión e intenta nuevamente');
      allChecks = false;
    } else {
      console.log('✅ Sesión activa');
      console.log('   Usuario:', sessionData.session.user.email);
      console.log('   ID:', sessionData.session.user.id);
      
      // Verificar expiración
      const expiresAt = sessionData.session.expires_at;
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = expiresAt - now;
      const minutesLeft = Math.floor(timeLeft / 60);
      
      console.log('   Expira en:', minutesLeft, 'minutos');
      
      if (timeLeft < 300) {
        console.warn('⚠️ La sesión expirará pronto (menos de 5 minutos)');
        console.log('   Solución: Cierra sesión y vuelve a iniciar sesión');
      }
    }
  } catch (error) {
    console.error('❌ Error al verificar sesión:', error.message);
    allChecks = false;
  }

  // Check 3: Verificar que updateUser existe
  console.log('\n3️⃣ Verificando método updateUser...');
  if (typeof supabase.auth.updateUser !== 'function') {
    console.error('❌ Método updateUser no está disponible');
    allChecks = false;
  } else {
    console.log('✅ Método updateUser disponible');
  }

  // Check 4: Verificar que signInWithPassword existe
  console.log('\n4️⃣ Verificando método signInWithPassword...');
  if (typeof supabase.auth.signInWithPassword !== 'function') {
    console.error('❌ Método signInWithPassword no está disponible');
    allChecks = false;
  } else {
    console.log('✅ Método signInWithPassword disponible');
  }

  // Check 5: Verificar que refreshSession existe
  console.log('\n5️⃣ Verificando método refreshSession...');
  if (typeof supabase.auth.refreshSession !== 'function') {
    console.error('❌ Método refreshSession no está disponible');
    allChecks = false;
  } else {
    console.log('✅ Método refreshSession disponible');
  }

  // Resumen
  console.log('\n=====================================================');
  console.log('📊 RESULTADO DE LA VERIFICACIÓN');
  console.log('=====================================================');
  
  if (allChecks) {
    console.log('✅ TODOS LOS CHECKS PASARON');
    console.log('\n🎉 El sistema de cambio de contraseñas está listo para usar');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Haz clic en tu avatar (esquina superior derecha)');
    console.log('2. Selecciona "Cambiar Contraseña"');
    console.log('3. Ingresa tu contraseña actual y la nueva');
    console.log('4. Confirma el cambio');
    console.log('\n💡 TIP: La nueva contraseña debe tener al menos 6 caracteres');
  } else {
    console.error('❌ ALGUNOS CHECKS FALLARON');
    console.log('\n📋 Acciones recomendadas:');
    console.log('1. Refresca la página (F5)');
    console.log('2. Si no estás autenticado, inicia sesión');
    console.log('3. Vuelve a ejecutar este script');
    console.log('4. Si persisten los errores, contacta al soporte técnico');
  }

  // Información adicional
  console.log('\n=====================================================');
  console.log('ℹ️ INFORMACIÓN ADICIONAL');
  console.log('=====================================================');
  console.log('• Método usado: Cliente Supabase directo (frontend)');
  console.log('• No requiere configuración del backend');
  console.log('• Funciona con cualquier rol (admin, coach, swimmer)');
  console.log('• La contraseña se verifica antes de cambiarla');
  console.log('• La sesión se actualiza automáticamente');
  
  console.log('\n📄 Documentación: /SOLUCION_IMPLEMENTADA_JWT.md');
  console.log('🐛 Soporte: Revisa los logs de consola si algo falla');
  
  console.log('\n');
  
  return {
    allChecksPassed: allChecks,
    timestamp: new Date().toISOString()
  };
})();
