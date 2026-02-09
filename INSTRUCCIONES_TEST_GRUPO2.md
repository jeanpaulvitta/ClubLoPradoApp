# 🏊‍♂️ Instrucciones: Cómo Ejecutar el Test de Entrenamientos Grupo 2

## ✅ **MÉTODO 1: Usando la Interfaz (MÁS FÁCIL)** 

### Pasos:

1. **Inicia sesión como Administrador** en la aplicación

2. **Ve a la pestaña "Diagnóstico"** (última pestaña en el menú principal)
   - Solo visible para administradores
   - Tiene un ícono de engranaje ⚙️

3. **Ejecuta el test** haciendo clic en el botón **"Ejecutar Test Completo"**

4. **Revisa los resultados** que aparecerán en pantalla:
   - Total de entrenamientos
   - Total de bloques y semanas
   - Competencias programadas
   - Validación de datos
   - Estadísticas del sistema

5. **Botones adicionales disponibles:**
   - **Ver Semana 1**: Muestra los entrenamientos de la semana 1 en consola
   - **Ver Bloque 3**: Muestra todos los entrenamientos del Bloque 3 en consola
   - **Ver Competencias**: Lista todas las competencias programadas en consola

### 💡 TIP: 
Abre la **consola del navegador** (presiona `F12`) para ver el informe completo y detallado del test.

---

## 🔧 **MÉTODO 2: Usando la Consola del Navegador**

### Pasos:

1. **Abre la aplicación** en tu navegador

2. **Abre las herramientas de desarrollo:**
   - **Windows/Linux**: Presiona `F12` o `Ctrl + Shift + I`
   - **Mac**: Presiona `Cmd + Option + I`

3. **Ve a la pestaña "Console"** (Consola)

4. **Ejecuta uno de estos comandos:**

```javascript
// Test completo del sistema
testWorkoutsGroup2()

// Ver entrenamientos de una semana específica (ej: semana 5)
getWeekWorkouts(5)

// Ver entrenamientos de un bloque específico (ej: bloque 3)
getBlockWorkouts(3)

// Ver todas las competencias
getAllCompetitions()
```

### Ejemplo de salida esperada:

```
🏊‍♂️ ========================================
   SISTEMA ENTRENAMIENTOS GRUPO 2
   Club Natación Lo Prado 2026-2027
========================================

📊 ESTADÍSTICAS GENERALES:
   Total Bloques: 10
   Total Semanas: 52
   Total Entrenamientos: 252
   Distancia Promedio: 5200m
   Distancia Total: 1300.0km

📋 ENTRENAMIENTOS POR BLOQUE:
   Bloque 1: 36 entrenamientos
   Bloque 2: 24 entrenamientos
   Bloque 3: 24 entrenamientos
   ...

✅ VALIDACIÓN DE DATOS:
   ✓ Entrenamientos sin semana: 0
   ✓ Entrenamientos sin distancia: 0
   ✓ Entrenamientos sin group=2: 0

   🎉 ¡TODOS LOS DATOS SON VÁLIDOS!

========================================
   ✅ Test completado exitosamente
========================================
```

---

## 📊 **QUÉ VERIFICA EL TEST**

El test realiza las siguientes verificaciones:

### ✅ Validaciones:
- Todos los entrenamientos tienen número de semana asignado
- Todos los entrenamientos (excepto competencias) tienen distancia
- Todos los entrenamientos pertenecen al Grupo 2 (group: 2)
- Estructura correcta de bloques y mesociclos

### 📈 Estadísticas Calculadas:
- **Total de entrenamientos**: 252+
- **Total de bloques**: 10
- **Total de semanas**: 52
- **Distancia promedio**: ~5,200m por entrenamiento
- **Distancia total**: ~1,300km en toda la temporada
- **Total de competencias**: 9 competencias principales

### 🏆 Competencias Verificadas:
1. Copa Chile 1 - 50m (21-22 Mar 2026)
2. Copa Chile 2 - 800-1500m (17-19 Abr 2026)
3. Copa Chile 3 - 100-400m (15-17 May 2026)
4. Nacionales Jun-Jul (6 Jun - 5 Jul 2026)
5. Brasil + Nacional Desarrollo (20 Jul - 16 Ago 2026)
6. Copa Chile 1 (12-13 Sep 2026)
7. Copa Chile 2 (2-4 Oct 2026)
8. Copa Chile 3 (6-8 Nov 2026)
9. Nacionales Verano 2027 (9 Ene - 7 Feb 2027)

---

## 🚨 **SI ENCUENTRAS ERRORES**

Si el test muestra **datos inconsistentes**:

1. **Revisa la consola** para ver qué entrenamientos tienen problemas
2. **Verifica** los archivos de datos en `/src/app/data/`
3. **Comprueba** que todos los imports estén correctos
4. **Contacta** al desarrollador si persiste el problema

---

## 💡 **COMANDOS ÚTILES ADICIONALES**

### En la consola del navegador:

```javascript
// Ver estadísticas generales
import { workoutsGroup2Stats } from './data/allWorkoutsGroup2'
console.log(workoutsGroup2Stats)

// Ver todos los entrenamientos
import allWorkoutsGroup2 from './data/allWorkoutsGroup2'
console.log(allWorkoutsGroup2)

// Filtrar entrenamientos por intensidad
allWorkoutsGroup2.filter(w => w.intensity === 'Muy Alta')

// Contar entrenamientos por bloque
allWorkoutsGroup2.reduce((acc, w) => {
  acc[w.mesociclo] = (acc[w.mesociclo] || 0) + 1
  return acc
}, {})
```

---

## 🎯 **RESULTADOS ESPERADOS**

### ✅ Test Exitoso:
```
Total Entrenamientos: 252
Total Bloques: 10
Total Semanas: 52
Validación: ✓ Todos los datos son válidos
```

### ⚠️ Test con Advertencias:
```
Total Entrenamientos: 252
Validación: ⚠️ Se encontraron X entrenamientos sin semana
```

---

## 📚 **DOCUMENTACIÓN ADICIONAL**

Para más información, consulta:
- `/src/app/data/WORKOUTS_GROUP2_README.md` - Documentación completa del sistema
- `/src/app/utils/testWorkoutsGroup2.ts` - Código fuente del test
- `/src/app/components/DiagnosticPanel.tsx` - Panel de diagnóstico UI

---

## 🆘 **SOPORTE**

Si tienes problemas:
1. Verifica que estás conectado como **administrador**
2. Asegúrate de que la aplicación esté completamente cargada
3. Refresca la página (F5) y vuelve a intentar
4. Revisa la consola del navegador para ver mensajes de error

---

**¡Éxito con el test!** 🏊‍♂️💪

*Club Natación Lo Prado - "Haz que todo sea posible"*
