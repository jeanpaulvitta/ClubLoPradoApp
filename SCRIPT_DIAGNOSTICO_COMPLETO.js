// ═══════════════════════════════════════════════════════════════
// 🔍 SCRIPT DE DIAGNÓSTICO COMPLETO
// ═══════════════════════════════════════════════════════════════
// 
// CÓMO USAR:
// 1. Abre la consola del navegador (F12)
// 2. Copia y pega TODO este archivo
// 3. Presiona Enter
// 4. Lee los resultados y sigue las instrucciones
//
// ═══════════════════════════════════════════════════════════════

console.clear();
console.log('%c═══════════════════════════════════════════════════════════════', 'color: #EF4444; font-weight: bold');
console.log('%c🏊 CLUB NATACIÓN LO PRADO - DIAGNÓSTICO DEL SISTEMA', 'color: #EF4444; font-weight: bold; font-size: 16px');
console.log('%c═══════════════════════════════════════════════════════════════', 'color: #EF4444; font-weight: bold');
console.log('');

const projectId = 'vrclozhgaacehojbnpuo';
const baseUrl = `https://${projectId}.supabase.co`;

// URLs a verificar
const healthCheckUrls = [
  `${baseUrl}/functions/v1/make-server-4909a0bc/health`,
  `${baseUrl}/functions/v1/server/health`
];

// Función para hacer diagnóstico completo
async function diagnosticoCompleto() {
  console.log('%c📋 INICIANDO DIAGNÓSTICO...', 'color: #3B82F6; font-weight: bold');
  console.log('');
  
  // ═══════════════════════════════════════════════════════════
  // 1. VERIFICAR MODO OFFLINE
  // ═══════════════════════════════════════════════════════════
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6B7280');
  console.log('%c1️⃣ MODO OFFLINE', 'color: #F59E0B; font-weight: bold');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6B7280');
  
  const offlineMode = localStorage.getItem('backend_offline_mode');
  
  if (offlineMode) {
    console.log('%c⚠️  MODO OFFLINE ACTIVADO', 'color: #F59E0B; font-weight: bold');
    console.log('   Valor:', offlineMode);
    console.log('');
    console.log('%c🔧 ACCIÓN REQUERIDA:', 'color: #EF4444; font-weight: bold');
    console.log('   Ejecuta este comando para salir:');
    console.log('%c   localStorage.removeItem("backend_offline_mode"); location.reload();', 'background: #1F2937; color: #10B981; padding: 4px 8px; border-radius: 4px');
  } else {
    console.log('%c✅ Modo offline NO activado', 'color: #10B981; font-weight: bold');
  }
  
  console.log('');
  
  // ═══════════════════════════════════════════════════════════
  // 2. VERIFICAR AUTENTICACIÓN LOCAL
  // ═══════════════════════════════════════════════════════════
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6B7280');
  console.log('%c2️⃣ AUTENTICACIÓN LOCAL', 'color: #F59E0B; font-weight: bold');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6B7280');
  
  const authToken = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');
  
  console.log('   Token existe:', authToken ? '✅ Sí' : '❌ No');
  console.log('   User ID:', userId || '❌ No configurado');
  console.log('   Rol:', userRole || '❌ No configurado');
  
  if (authToken) {
    console.log('   Token preview:', authToken.substring(0, 50) + '...');
  }
  
  console.log('');
  
  // ═══════════════════════════════════════════════════════════
  // 3. VERIFICAR CONECTIVIDAD DEL SERVIDOR
  // ═══════════════════════════════════════════════════════════
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6B7280');
  console.log('%c3️⃣ CONECTIVIDAD DEL SERVIDOR', 'color: #F59E0B; font-weight: bold');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6B7280');
  console.log('');
  console.log('⏳ Probando health checks...');
  console.log('');
  
  const resultados = [];
  
  for (const url of healthCheckUrls) {
    console.log(`   📡 Probando: ${url}`);
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      resultados.push({
        url,
        success: true,
        status: response.status,
        data
      });
      
      console.log(`   ✅ Respuesta (${response.status}):`, data);
    } catch (error) {
      resultados.push({
        url,
        success: false,
        error: error.message
      });
      
      console.log(`   ❌ Error:`, error.message);
    }
    console.log('');
  }
  
  // ═══════════════════════════════════════════════════════════
  // 4. ANÁLISIS DE RESULTADOS
  // ═══════════════════════════════════════════════════════════
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6B7280');
  console.log('%c4️⃣ ANÁLISIS DE RESULTADOS', 'color: #F59E0B; font-weight: bold');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6B7280');
  console.log('');
  
  // Buscar un servidor que funcione correctamente
  const servidorFuncionando = resultados.find(r => 
    r.success && 
    r.data.status === 'ok' && 
    r.data.valid === true
  );
  
  // Buscar un servidor con configuración incorrecta
  const servidorMalConfigurado = resultados.find(r => 
    r.success && 
    r.data.status === 'misconfigured'
  );
  
  // ═══════════════════════════════════════════════════════════
  // ESCENARIO 1: SERVIDOR FUNCIONANDO CORRECTAMENTE
  // ═══════════════════════════════════════════════════════════
  if (servidorFuncionando) {
    console.log('%c✅ SERVIDOR FUNCIONANDO CORRECTAMENTE', 'color: #10B981; font-weight: bold; font-size: 14px');
    console.log('');
    console.log('   URL:', servidorFuncionando.url);
    console.log('   Estado:', servidorFuncionando.data.status);
    console.log('   Configurado:', servidorFuncionando.data.configured);
    console.log('   Válido:', servidorFuncionando.data.valid);
    console.log('');
    
    if (offlineMode) {
      console.log('%c🔧 SIGUIENTE PASO:', 'color: #EF4444; font-weight: bold');
      console.log('   El servidor funciona pero estás en modo offline.');
      console.log('   Ejecuta este comando para salir:');
      console.log('');
      console.log('%c   localStorage.removeItem("backend_offline_mode"); location.reload();', 'background: #1F2937; color: #10B981; padding: 4px 8px; border-radius: 4px');
    } else {
      console.log('%c🎉 TODO ESTÁ PERFECTO', 'color: #10B981; font-weight: bold');
      console.log('   El sistema está completamente funcional.');
      console.log('');
      if (!authToken) {
        console.log('%c💡 TIP:', 'color: #3B82F6; font-weight: bold');
        console.log('   No has iniciado sesión. Ve a la página de login.');
      }
    }
  }
  
  // ═══════════════════════════════════════════════════════════
  // ESCENARIO 2: SERVIDOR MAL CONFIGURADO (SECRETS INVÁLIDOS)
  // ═══════════════════════════════════════════════════════════
  else if (servidorMalConfigurado) {
    console.log('%c❌ SERVIDOR MAL CONFIGURADO - SECRETS INVÁLIDOS', 'color: #EF4444; font-weight: bold; font-size: 14px');
    console.log('');
    console.log('   URL:', servidorMalConfigurado.url);
    console.log('   Estado:', servidorMalConfigurado.data.status);
    console.log('   Mensaje:', servidorMalConfigurado.data.message);
    console.log('');
    
    if (servidorMalConfigurado.data.validationErrors) {
      console.log('%c📊 Errores de validación:', 'color: #F59E0B; font-weight: bold');
      servidorMalConfigurado.data.validationErrors.forEach(err => {
        console.log('   ' + err);
      });
      console.log('');
    }
    
    if (servidorMalConfigurado.data.diagnostics) {
      console.log('%c🔍 Diagnóstico:', 'color: #F59E0B; font-weight: bold');
      console.log('   SUPABASE_URL length:', servidorMalConfigurado.data.diagnostics.urlLength, 
        servidorMalConfigurado.data.diagnostics.urlLength > 40 ? '✅' : '❌');
      console.log('   SERVICE_ROLE_KEY length:', servidorMalConfigurado.data.diagnostics.serviceKeyLength,
        servidorMalConfigurado.data.diagnostics.serviceKeyLength > 100 ? '✅' : '❌');
      console.log('   SERVICE_ROLE_KEY preview:', servidorMalConfigurado.data.diagnostics.serviceKeyPreview);
      console.log('   ANON_KEY length:', servidorMalConfigurado.data.diagnostics.anonKeyLength,
        servidorMalConfigurado.data.diagnostics.anonKeyLength > 100 ? '✅' : '❌');
      console.log('   ANON_KEY preview:', servidorMalConfigurado.data.diagnostics.anonKeyPreview);
      console.log('');
    }
    
    console.log('%c🚨 PROBLEMA DETECTADO:', 'color: #EF4444; font-weight: bold');
    console.log('   Las keys parecen ser HASHES (SHA-256) en lugar de JWT tokens!');
    console.log('');
    console.log('%c✅ SOLUCIÓN:', 'color: #10B981; font-weight: bold');
    console.log('   1. Ve a Supabase Dashboard → Functions → make-server-4909a0bc → Configuration/Secrets');
    console.log('   2. ELIMINA las variables SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY si aparecen');
    console.log('   3. NO las vuelvas a crear manualmente - Supabase las proporciona automáticamente');
    console.log('   4. Redeploy la función');
    console.log('   5. Espera 2-3 minutos y vuelve a ejecutar este diagnóstico');
    console.log('');
    console.log('%c📖 Guía detallada:', 'color: #3B82F6; font-weight: bold');
    console.log('   /RESUMEN_EJECUTIVO_PROBLEMA_SECRETS.md');
    console.log('   /INSTRUCCIONES_ELIMINAR_SECRETS.md');
    console.log('   /SOLUCION_URGENTE_SECRETS_INVALIDOS.md');
  }
  
  // ═══════════════════════════════════════════════════════════
  // ESCENARIO 3: SERVIDOR NO RESPONDE
  // ═══════════════════════════════════════════════════════════
  else {
    console.log('%c❌ SERVIDOR NO DISPONIBLE', 'color: #EF4444; font-weight: bold; font-size: 14px');
    console.log('');
    console.log('%c🔧 POSIBLES CAUSAS:', 'color: #F59E0B; font-weight: bold');
    console.log('   1. La Edge Function no está desplegada');
    console.log('   2. Hay un error en el código del servidor');
    console.log('   3. Las variables de entorno no están configuradas');
    console.log('');
    console.log('%c📋 SIGUIENTE PASO:', 'color: #3B82F6; font-weight: bold');
    console.log('   1. Ve a: https://supabase.com/dashboard/project/' + projectId + '/functions');
    console.log('   2. Verifica que exista la función "server" o "make-server-4909a0bc" con estado "Active"');
    console.log('   3. Si no existe, revisa GitHub Actions para ver si hay errores de despliegue');
    console.log('   4. Si existe pero falla, revisa los logs de Edge Functions');
    console.log('');
    console.log('   Logs: https://supabase.com/dashboard/project/' + projectId + '/logs/edge-functions-logs');
  }
  
  // ═══════════════════════════════════════════════════════════
  // 5. INFORMACIÓN ADICIONAL
  // ═══════════════════════════════════════════════════════════
  console.log('');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6B7280');
  console.log('%c5️⃣ INFORMACIÓN ADICIONAL', 'color: #F59E0B; font-weight: bold');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6B7280');
  console.log('');
  console.log('   Project ID:', projectId);
  console.log('   Base URL:', baseUrl);
  console.log('   URLs probadas:', healthCheckUrls.length);
  console.log('   localStorage keys:', Object.keys(localStorage).length);
  console.log('   sessionStorage keys:', Object.keys(sessionStorage).length);
  console.log('');
  
  // Mostrar datos relevantes de localStorage
  console.log('%c📦 Datos en localStorage:', 'color: #3B82F6; font-weight: bold');
  const relevantKeys = ['backend_offline_mode', 'authToken', 'userRole', 'userId', 'userName'];
  relevantKeys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      const preview = value.length > 50 ? value.substring(0, 50) + '...' : value;
      console.log(`   ${key}:`, preview);
    } else {
      console.log(`   ${key}:`, '❌ No configurado');
    }
  });
  
  // ═══════════════════════════════════════════════════════════
  // 6. COMANDOS ÚTILES
  // ═══════════════════════════════════════════════════════════
  console.log('');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6B7280');
  console.log('%c6️⃣ COMANDOS ÚTILES', 'color: #F59E0B; font-weight: bold');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6B7280');
  console.log('');
  console.log('%cSalir del modo offline:', 'color: #10B981; font-weight: bold');
  console.log('%c   localStorage.removeItem("backend_offline_mode"); location.reload();', 'background: #1F2937; color: #10B981; padding: 4px 8px; border-radius: 4px');
  console.log('');
  console.log('%cCerrar sesión:', 'color: #10B981; font-weight: bold');
  console.log('%c   localStorage.removeItem("authToken"); localStorage.removeItem("userId"); localStorage.removeItem("userRole"); location.reload();', 'background: #1F2937; color: #10B981; padding: 4px 8px; border-radius: 4px');
  console.log('');
  console.log('%cLimpiar TODO (reset completo):', 'color: #EF4444; font-weight: bold');
  console.log('%c   localStorage.clear(); sessionStorage.clear(); location.reload();', 'background: #1F2937; color: #EF4444; padding: 4px 8px; border-radius: 4px');
  console.log('');
  
  // ═══════════════════════════════════════════════════════════
  // RESUMEN FINAL
  // ═══════════════════════════════════════════════════════════
  console.log('%c═══════════════════════════════════════════════════════════════', 'color: #EF4444; font-weight: bold');
  console.log('%c📊 RESUMEN DEL DIAGNÓSTICO', 'color: #EF4444; font-weight: bold; font-size: 14px');
  console.log('%c═══════════════════════════════════════════════════════════════', 'color: #EF4444; font-weight: bold');
  console.log('');
  
  console.log('   Modo offline:', offlineMode ? '⚠️ ACTIVADO' : '✅ Desactivado');
  console.log('   Autenticado:', authToken ? '✅ Sí' : '❌ No');
  console.log('   Servidor:', servidorFuncionando ? '✅ Funcionando' : servidorMalConfigurado ? '⚠️ Mal configurado' : '❌ No disponible');
  console.log('');
  
  if (servidorFuncionando && !offlineMode) {
    console.log('%c🎉 ESTADO: TODO FUNCIONANDO CORRECTAMENTE', 'color: #10B981; font-weight: bold; font-size: 14px');
  } else if (offlineMode) {
    console.log('%c⚠️ ESTADO: EN MODO OFFLINE - SAL DEL MODO OFFLINE', 'color: #F59E0B; font-weight: bold; font-size: 14px');
  } else if (servidorMalConfigurado) {
    console.log('%c❌ ESTADO: SERVIDOR MAL CONFIGURADO - ELIMINA LOS SECRETS', 'color: #EF4444; font-weight: bold; font-size: 14px');
  } else {
    console.log('%c❌ ESTADO: SERVIDOR NO DISPONIBLE - VERIFICA DESPLIEGUE', 'color: #EF4444; font-weight: bold; font-size: 14px');
  }
  
  console.log('');
  console.log('%c═══════════════════════════════════════════════════════════════', 'color: #EF4444; font-weight: bold');
  console.log('');
}

// Ejecutar el diagnóstico
diagnosticoCompleto().catch(error => {
  console.error('❌ Error en el diagnóstico:', error);
});
