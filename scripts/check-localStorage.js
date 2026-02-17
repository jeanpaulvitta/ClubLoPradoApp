/**
 * Script para verificar datos en localStorage
 * 
 * CÓMO USAR:
 * 1. Abre la aplicación en el navegador
 * 2. Presiona F12 para abrir DevTools
 * 3. Ve a la pestaña "Console"
 * 4. Escribe: allow pasting
 * 5. Copia y pega este script completo
 * 6. Presiona Enter
 */

console.log('🔍 VERIFICANDO DATOS EN LOCALSTORAGE');
console.log('=====================================\n');

const STORAGE_KEYS = {
  SWIMMERS: 'swimming_app_swimmers',
  COMPETITIONS: 'swimming_app_competitions',
  SWIMMER_COMPETITIONS: 'swimming_app_swimmer_competitions',
  WORKOUTS: 'swimming_app_workouts',
  CHALLENGES: 'swimming_app_challenges',
  HOLIDAYS: 'swimming_app_holidays',
  TEST_CONTROLS: 'swimming_app_test_controls',
  TEST_RESULTS: 'swimming_app_test_results',
  ATTENDANCE: 'swimming_app_attendance',
};

let totalRecords = 0;
const results = {};

Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
  const data = localStorage.getItem(key);
  
  if (data) {
    try {
      const parsed = JSON.parse(data);
      const count = Array.isArray(parsed) 
        ? parsed.length 
        : (typeof parsed === 'object' ? Object.keys(parsed).length : 1);
      
      results[name] = count;
      totalRecords += count;
      
      console.log(`📊 ${name.padEnd(20)} : ${count} registros`);
      
      // Mostrar un ejemplo si hay datos
      if (count > 0 && Array.isArray(parsed) && parsed.length > 0) {
        console.log(`   → Ejemplo:`, parsed[0]);
      }
    } catch (error) {
      console.error(`❌ Error parseando ${name}:`, error);
      results[name] = 0;
    }
  } else {
    results[name] = 0;
    console.log(`⚪ ${name.padEnd(20)} : Sin datos`);
  }
});

console.log('\n=====================================');
console.log(`📈 TOTAL DE REGISTROS: ${totalRecords}`);
console.log('=====================================\n');

if (totalRecords > 0) {
  console.log('✅ Hay datos en localStorage listos para migrar');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Inicia sesión como administrador');
  console.log('2. Ve a la pestaña "Migración"');
  console.log('3. Haz clic en "Migrar a Supabase"');
  console.log('4. Verifica que los datos se cargaron correctamente');
  console.log('5. Opcionalmente, limpia localStorage');
} else {
  console.log('ℹ️ No hay datos en localStorage para migrar');
  console.log('\nPosibles razones:');
  console.log('• Los datos ya fueron migrados a Supabase');
  console.log('• Esta es una instalación nueva');
  console.log('• Los datos están guardados con diferentes keys');
}

console.log('\n');

// Retornar objeto con resultados para referencia
results;
