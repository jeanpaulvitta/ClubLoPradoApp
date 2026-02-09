/**
 * Script de prueba para verificar el sistema de entrenamientos Grupo 2
 * 
 * USO EN CONSOLA:
 * import { testWorkoutsGroup2System } from './utils/testWorkoutsGroup2';
 * testWorkoutsGroup2System();
 */

import allWorkoutsGroup2, { workoutsGroup2Stats } from '../data/allWorkoutsGroup2';

export function testWorkoutsGroup2System() {
  console.log('\n🏊‍♂️ ========================================');
  console.log('   SISTEMA ENTRENAMIENTOS GRUPO 2');
  console.log('   Club Natación Lo Prado 2026-2027');
  console.log('========================================\n');

  // 1. Estadísticas generales
  console.log('📊 ESTADÍSTICAS GENERALES:');
  console.log(`   Total Bloques: ${workoutsGroup2Stats.totalBlocks}`);
  console.log(`   Total Semanas: ${workoutsGroup2Stats.totalWeeks}`);
  console.log(`   Total Entrenamientos: ${workoutsGroup2Stats.totalWorkouts}`);
  console.log(`   Distancia Promedio: ${workoutsGroup2Stats.averageDistance}m`);
  console.log(`   Distancia Total: ${(workoutsGroup2Stats.totalDistance / 1000).toFixed(1)}km`);
  
  // 2. Entrenamientos por bloque
  console.log('\n📋 ENTRENAMIENTOS POR BLOQUE:');
  const bloquesCounts: Record<string, number> = {};
  allWorkoutsGroup2.forEach(w => {
    const bloque = w.mesociclo || 'Sin bloque';
    bloquesCounts[bloque] = (bloquesCounts[bloque] || 0) + 1;
  });
  Object.entries(bloquesCounts).sort((a, b) => {
    const numA = parseInt(a[0].match(/\d+/)?.[0] || '0');
    const numB = parseInt(b[0].match(/\d+/)?.[0] || '0');
    return numA - numB;
  }).forEach(([bloque, count]) => {
    console.log(`   ${bloque}: ${count} entrenamientos`);
  });

  // 3. Entrenamientos por semana (primeras 10)
  console.log('\n📅 ENTRENAMIENTOS POR SEMANA (Primeras 10):');
  const weekCounts: Record<number, number> = {};
  allWorkoutsGroup2.forEach(w => {
    if (w.week && w.week <= 10) {
      weekCounts[w.week] = (weekCounts[w.week] || 0) + 1;
    }
  });
  Object.entries(weekCounts).sort((a, b) => Number(a[0]) - Number(b[0])).forEach(([week, count]) => {
    console.log(`   Semana ${week}: ${count} entrenamientos`);
  });

  // 4. Intensidades
  console.log('\n💪 DISTRIBUCIÓN DE INTENSIDADES:');
  const intensityCounts: Record<string, number> = {};
  allWorkoutsGroup2.forEach(w => {
    const intensity = w.intensity || 'No definida';
    intensityCounts[intensity] = (intensityCounts[intensity] || 0) + 1;
  });
  Object.entries(intensityCounts).sort((a, b) => b[1] - a[1]).forEach(([intensity, count]) => {
    const percentage = ((count / allWorkoutsGroup2.length) * 100).toFixed(1);
    console.log(`   ${intensity}: ${count} (${percentage}%)`);
  });

  // 5. Competencias
  console.log('\n🏆 COMPETENCIAS PROGRAMADAS:');
  workoutsGroup2Stats.competitions.forEach((comp, idx) => {
    console.log(`   ${idx + 1}. ${comp.name}`);
    console.log(`      Fecha: ${comp.date}`);
    console.log(`      Bloque: ${comp.block}`);
  });

  // 6. Ejemplo de entrenamientos
  console.log('\n📝 EJEMPLOS DE ENTRENAMIENTOS:');
  
  // Primera semana
  const week1 = allWorkoutsGroup2.filter(w => w.week === 1)[0];
  if (week1) {
    console.log(`\n   🔹 Semana 1 - ${week1.day}:`);
    console.log(`      Bloque: ${week1.bloque}`);
    console.log(`      Distancia: ${week1.distance}m`);
    console.log(`      Duración: ${week1.duration} min`);
    console.log(`      Intensidad: ${week1.intensity}`);
    console.log(`      Focus: ${week1.focus}`);
  }

  // Primera competencia
  const firstComp = allWorkoutsGroup2.find(w => w.isChallenge);
  if (firstComp) {
    console.log(`\n   🔹 Primera Competencia:`);
    console.log(`      ${firstComp.challengeName}`);
    console.log(`      Fecha: ${firstComp.date}`);
    console.log(`      Bloque: ${firstComp.bloque}`);
  }

  // 7. Validación de datos
  console.log('\n✅ VALIDACIÓN DE DATOS:');
  const workoutsWithoutWeek = allWorkoutsGroup2.filter(w => !w.week);
  const workoutsWithoutDistance = allWorkoutsGroup2.filter(w => w.distance === undefined && !w.isChallenge);
  const workoutsWithoutGroup = allWorkoutsGroup2.filter(w => w.group !== 2);
  
  console.log(`   ✓ Entrenamientos sin semana: ${workoutsWithoutWeek.length}`);
  console.log(`   ✓ Entrenamientos sin distancia (no competencia): ${workoutsWithoutDistance.length}`);
  console.log(`   ✓ Entrenamientos sin group=2: ${workoutsWithoutGroup.length}`);

  if (workoutsWithoutWeek.length === 0 && 
      workoutsWithoutDistance.length === 0 && 
      workoutsWithoutGroup.length === 0) {
    console.log('\n   🎉 ¡TODOS LOS DATOS SON VÁLIDOS!');
  } else {
    console.log('\n   ⚠️  Se encontraron datos inconsistentes');
  }

  // 8. Rango de fechas
  console.log('\n📆 RANGO DE FECHAS:');
  const firstWorkout = allWorkoutsGroup2.find(w => w.week === 1);
  const lastWorkout = allWorkoutsGroup2.filter(w => w.week === 52).pop();
  console.log(`   Inicio: ${firstWorkout?.date || 'N/A'} (Semana 1)`);
  console.log(`   Fin: ${lastWorkout?.date || 'N/A'} (Semana 52)`);

  console.log('\n========================================');
  console.log('   ✅ Test completado exitosamente');
  console.log('========================================\n');

  return {
    total: allWorkoutsGroup2.length,
    stats: workoutsGroup2Stats,
    validation: {
      withoutWeek: workoutsWithoutWeek.length,
      withoutDistance: workoutsWithoutDistance.length,
      withoutGroup: workoutsWithoutGroup.length,
      isValid: workoutsWithoutWeek.length === 0 && 
               workoutsWithoutDistance.length === 0 && 
               workoutsWithoutGroup.length === 0
    }
  };
}

// Función auxiliar para obtener entrenamientos de una semana específica
export function getWeekWorkouts(week: number) {
  return allWorkoutsGroup2.filter(w => w.week === week);
}

// Función auxiliar para obtener entrenamientos de un bloque específico
export function getBlockWorkouts(blockNumber: number) {
  return allWorkoutsGroup2.filter(w => w.mesociclo === `Bloque ${blockNumber}`);
}

// Función auxiliar para obtener todas las competencias
export function getAllCompetitions() {
  return allWorkoutsGroup2.filter(w => w.isChallenge);
}

// Exportar para uso en consola
if (typeof window !== 'undefined') {
  (window as any).testWorkoutsGroup2 = testWorkoutsGroup2System;
  (window as any).getWeekWorkouts = getWeekWorkouts;
  (window as any).getBlockWorkouts = getBlockWorkouts;
  (window as any).getAllCompetitions = getAllCompetitions;
}
