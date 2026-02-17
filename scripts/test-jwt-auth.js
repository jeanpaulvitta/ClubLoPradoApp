/**
 * Script de diagnóstico para probar autenticación JWT
 * 
 * CÓMO USAR:
 * 1. Inicia sesión en la aplicación
 * 2. Abre DevTools (F12) → Console
 * 3. Escribe: allow pasting
 * 4. Copia y pega este script
 * 5. Presiona Enter
 * 
 * El script verificará:
 * - Si tienes una sesión activa
 * - Si el token JWT es válido
 * - Si el backend puede validar el token
 */

(async function testJWTAuth() {
  console.log('🔍 DIAGNÓSTICO DE AUTENTICACIÓN JWT');
  console.log('=====================================\n');

  // Paso 1: Verificar sesión en Supabase
  console.log('1️⃣ Verificando sesión de Supabase...');
  
  try {
    // Crear cliente de Supabase (asumiendo que está disponible)
    const { createClient } = supabase;
    
    if (!createClient) {
      console.error('❌ No se puede acceder a Supabase client');
      console.log('\n📋 Alternativa: Revisa la sesión en Application → Local Storage');
      return;
    }

    // Obtener proyecto ID y key desde localStorage o configuración
    const supabaseUrl = 'https://vrclozhgaacehojbnpuo.supabase.co';
    const supabaseKey = localStorage.getItem('sb-anon-key');
    
    if (!supabaseKey) {
      console.warn('⚠️ No se encontró la anon key en localStorage');
      console.log('Buscando en otras ubicaciones...');
    }

    // Intentar obtener la sesión actual
    const sessionData = await supabase?.auth?.getSession();
    
    if (!sessionData || !sessionData.data.session) {
      console.error('❌ No hay sesión activa');
      console.log('\n📋 Solución:');
      console.log('1. Cierra sesión si es posible');
      console.log('2. Vuelve a iniciar sesión');
      console.log('3. Ejecuta este script nuevamente');
      return;
    }

    const session = sessionData.data.session;
    const token = session.access_token;
    
    console.log('✅ Sesión encontrada');
    console.log('   Email:', session.user.email);
    console.log('   User ID:', session.user.id);
    console.log('   Token length:', token.length);
    console.log('   Token preview:', token.substring(0, 50) + '...');
    
    // Verificar expiración del token
    const expiresAt = session.expires_at;
    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = expiresAt - now;
    
    console.log('   Expira en:', Math.floor(timeUntilExpiry / 60), 'minutos');
    
    if (timeUntilExpiry < 300) {
      console.warn('⚠️ Token próximo a expirar (menos de 5 minutos)');
      console.log('🔄 Refrescando token...');
      
      const refreshResult = await supabase.auth.refreshSession();
      
      if (refreshResult.error) {
        console.error('❌ Error al refrescar token:', refreshResult.error.message);
      } else {
        console.log('✅ Token refrescado exitosamente');
      }
    }

    // Paso 2: Decodificar el JWT (sin verificar firma)
    console.log('\n2️⃣ Decodificando JWT...');
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('❌ Token JWT inválido (no tiene 3 partes)');
        return;
      }

      const payload = JSON.parse(atob(parts[1]));
      
      console.log('✅ JWT decodificado:');
      console.log('   Sub (User ID):', payload.sub);
      console.log('   Email:', payload.email);
      console.log('   Role:', payload.role);
      console.log('   Issued at:', new Date(payload.iat * 1000).toLocaleString());
      console.log('   Expires at:', new Date(payload.exp * 1000).toLocaleString());
      
      // Verificar si expiró
      if (payload.exp * 1000 < Date.now()) {
        console.error('❌ El token JWT ha expirado!');
        console.log('   Expiró:', new Date(payload.exp * 1000).toLocaleString());
        console.log('   Ahora es:', new Date().toLocaleString());
      } else {
        console.log('✅ Token JWT válido (no ha expirado)');
      }
    } catch (error) {
      console.error('❌ Error al decodificar JWT:', error.message);
    }

    // Paso 3: Probar el endpoint del backend
    console.log('\n3️⃣ Probando autenticación en el backend...');
    
    const API_URL = 'https://vrclozhgaacehojbnpuo.supabase.co/functions/v1/make-server-4909a0bc';
    
    // Probar el health endpoint primero
    console.log('   Probando health endpoint...');
    try {
      const healthResponse = await fetch(`${API_URL}/health`);
      const healthData = await healthResponse.json();
      
      console.log('   Health check:', healthResponse.ok ? '✅' : '❌');
      console.log('   Status:', healthResponse.status);
      console.log('   Data:', healthData);
    } catch (error) {
      console.error('   ❌ Error en health check:', error.message);
    }

    // Probar un endpoint protegido
    console.log('\n   Probando endpoint protegido (swimmers)...');
    try {
      const swimmersResponse = await fetch(`${API_URL}/swimmers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('   Swimmers endpoint:', swimmersResponse.ok ? '✅' : '❌');
      console.log('   Status:', swimmersResponse.status);
      
      if (!swimmersResponse.ok) {
        const errorData = await swimmersResponse.json();
        console.error('   Error:', errorData);
        
        // Análisis del error
        if (swimmersResponse.status === 401) {
          console.error('\n❌ PROBLEMA DE AUTENTICACIÓN DETECTADO');
          console.log('\n📋 Posibles causas:');
          console.log('1. JWT_SECRET no está configurado en el Edge Function');
          console.log('2. El token JWT está mal formado');
          console.log('3. El Edge Function no está desplegado correctamente');
          console.log('\n📄 Ver: /CONFIGURACION_JWT_SUPABASE.md');
        }
      } else {
        const data = await swimmersResponse.json();
        console.log('   ✅ Autenticación exitosa!');
        console.log('   Nadadores encontrados:', Array.isArray(data) ? data.length : 'N/A');
      }
    } catch (error) {
      console.error('   ❌ Error en swimmers endpoint:', error.message);
    }

    // Resumen final
    console.log('\n=====================================');
    console.log('📊 RESUMEN DEL DIAGNÓSTICO');
    console.log('=====================================');
    console.log('✅ = Funciona correctamente');
    console.log('⚠️ = Advertencia, puede causar problemas');
    console.log('❌ = Error crítico que debe solucionarse');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Revisa los mensajes arriba para ver qué falló');
    console.log('2. Si hay error 401, configura JWT_SECRET (ver /CONFIGURACION_JWT_SUPABASE.md)');
    console.log('3. Si el token expiró, cierra sesión y vuelve a iniciar sesión');
    console.log('4. Si persisten los errores, contacta al soporte técnico');

  } catch (error) {
    console.error('❌ Error inesperado:', error);
    console.error('   Stack:', error.stack);
  }

  console.log('\n');
})();
