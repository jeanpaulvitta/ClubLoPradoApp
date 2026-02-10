import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { testWorkoutsGroup2System, getWeekWorkouts, getBlockWorkouts, getAllCompetitions } from '../utils/testWorkoutsGroup2';
import { FileText, Play, CheckCircle, XCircle, TrendingUp, Calendar, Trophy, Info, Eye, Upload, Database, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import * as api from '../services/api';

export function DiagnosticPanel() {
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [dbStats, setDbStats] = useState<any>(null);
  const [loadingDb, setLoadingDb] = useState(false);

  // Cargar estadísticas de la BD al montar
  useEffect(() => {
    loadDatabaseStats();
  }, []);

  const loadDatabaseStats = async () => {
    setLoadingDb(true);
    try {
      const workouts = await api.fetchWorkouts();
      
      // Calcular estadísticas
      const total = workouts.length;
      const byBloque: Record<string, number> = {};
      const byGroup: Record<string, number> = {};
      const withBloque = workouts.filter(w => w.bloque || w.mesociclo).length;
      const withoutBloque = total - withBloque;
      
      workouts.forEach(w => {
        const bloque = w.bloque || w.mesociclo || 'Sin asignar';
        byBloque[bloque] = (byBloque[bloque] || 0) + 1;
        
        const group = w.group ? String(w.group) : 'Sin asignar';
        byGroup[group] = (byGroup[group] || 0) + 1;
      });
      
      setDbStats({
        total,
        withBloque,
        withoutBloque,
        byBloque,
        byGroup,
        lastUpdate: new Date().toLocaleTimeString('es-CL')
      });
      
      toast.success('Estadísticas de BD actualizadas', { duration: 2000 });
    } catch (error) {
      console.error('Error cargando stats de BD:', error);
      toast.error('Error al cargar estadísticas de BD');
    } finally {
      setLoadingDb(false);
    }
  };

  const runTest = () => {
    setIsRunning(true);
    toast.info('Ejecutando test del sistema...', { duration: 2000 });
    
    try {
      const results = testWorkoutsGroup2System();
      setTestResults(results);
      
      if (results.validation.isValid) {
        toast.success('✅ Test completado exitosamente', { duration: 3000 });
      } else {
        toast.warning('⚠️ Test completado con advertencias', { duration: 3000 });
      }
    } catch (error) {
      console.error('Error ejecutando test:', error);
      toast.error('❌ Error ejecutando el test');
    } finally {
      setIsRunning(false);
    }
  };

  const showWeekExample = () => {
    const week1 = getWeekWorkouts(1);
    console.log('📅 Entrenamientos de la Semana 1:', week1);
    toast.success(`Semana 1: ${week1.length} entrenamientos (Ver consola F12)`, { duration: 3000 });
  };

  const showBlockExample = () => {
    const block3 = getBlockWorkouts(3);
    console.log('📋 Entrenamientos del Bloque 3:', block3);
    toast.success(`Bloque 3: ${block3.length} entrenamientos (Ver consola F12)`, { duration: 3000 });
  };

  const showCompetitions = () => {
    const competitions = getAllCompetitions();
    console.log('🏆 Todas las competencias:', competitions);
    toast.success(`${competitions.length} competencias encontradas (Ver consola F12)`, { duration: 3000 });
  };

  return (
    <div className="space-y-6">
      {/* Instrucciones de uso */}
      <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertDescription>
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                ¿Cómo visualizar los entrenamientos del Grupo 2 en la interfaz?
              </p>
              <ol className="text-sm text-blue-800 space-y-2 ml-4 list-decimal">
                <li>
                  <strong>Importa los entrenamientos:</strong> Ve a la pestaña <strong>"Entrenamientos"</strong> 
                  y haz clic en el botón <Upload className="h-3 w-3 inline mx-1" /><strong>"Importar Grupo 2"</strong> 
                  (esquina superior derecha)
                </li>
                <li>
                  <strong>Confirma la importación:</strong> En el diálogo que aparece, 
                  haz clic en <strong>"Importar Entrenamientos"</strong> y espera a que termine
                </li>
                <li>
                  <strong>Visualiza los bloques:</strong> Desplázate hacia abajo en la misma pestaña 
                  hasta <strong>"📊 Resumen de Entrenamientos por Bloques"</strong>
                </li>
                <li>
                  <strong>Selecciona Grupo 2:</strong> Haz clic en la pestaña 
                  <strong>"Grupo 2: Inf B hasta Mayores"</strong>
                </li>
                <li>
                  <strong>Explora:</strong> Verás los 10 bloques con todos sus entrenamientos, 
                  estadísticas y detalles
                </li>
              </ol>
            </div>
            <div className="pt-2 border-t border-blue-200">
              <p className="text-xs text-blue-700">
                💡 <strong>Este panel de diagnóstico</strong> solo verifica que los datos están correctos en el código. 
                Para verlos en la interfaz visual, debes importarlos a la base de datos siguiendo los pasos anteriores.
              </p>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Test del Sistema de Entrenamientos - Grupo 2
          </CardTitle>
          <CardDescription>
            Verifica que todos los entrenamientos estén correctamente cargados y validados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button 
              onClick={runTest} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Ejecutando...' : 'Ejecutar Test Completo'}
            </Button>
            
            <Button 
              onClick={showWeekExample} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Ver Semana 1
            </Button>
            
            <Button 
              onClick={showBlockExample} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Ver Bloque 3
            </Button>
            
            <Button 
              onClick={showCompetitions} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Trophy className="h-4 w-4" />
              Ver Competencias
            </Button>
          </div>

          {testResults && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-red-600">
                      {testResults.total}
                    </div>
                    <p className="text-xs text-gray-600">Total Entrenamientos</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-red-600">
                      {testResults.stats.totalBlocks}
                    </div>
                    <p className="text-xs text-gray-600">Bloques</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-red-600">
                      {testResults.stats.totalWeeks}
                    </div>
                    <p className="text-xs text-gray-600">Semanas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-red-600">
                      {testResults.stats.competitions.length}
                    </div>
                    <p className="text-xs text-gray-600">Competencias</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Estadísticas del Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Distancia Promedio:</span>
                    <span className="font-semibold">{testResults.stats.averageDistance}m</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Distancia Total:</span>
                    <span className="font-semibold">
                      {(testResults.stats.totalDistance / 1000).toFixed(1)}km
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    {testResults.validation.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-yellow-600" />
                    )}
                    Validación de Datos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Entrenamientos sin semana:</span>
                    <Badge variant={testResults.validation.withoutWeek === 0 ? "default" : "destructive"}>
                      {testResults.validation.withoutWeek}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Entrenamientos sin distancia:</span>
                    <Badge variant={testResults.validation.withoutDistance === 0 ? "default" : "destructive"}>
                      {testResults.validation.withoutDistance}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Entrenamientos sin grupo:</span>
                    <Badge variant={testResults.validation.withoutGroup === 0 ? "default" : "destructive"}>
                      {testResults.validation.withoutGroup}
                    </Badge>
                  </div>
                  
                  {testResults.validation.isValid && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-800 font-medium flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        ¡Todos los datos son válidos!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Competencias Programadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {testResults.stats.competitions.map((comp: any, idx: number) => (
                      <div 
                        key={idx}
                        className="flex items-start justify-between p-2 bg-gray-50 rounded-md"
                      >
                        <div className="flex items-start gap-2">
                          <Trophy className="h-4 w-4 text-red-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">{comp.name}</p>
                            <p className="text-xs text-gray-600">{comp.date}</p>
                          </div>
                        </div>
                        <Badge variant="outline">Bloque {comp.block}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Abre la consola del navegador (F12) para ver el informe completo con todos los detalles del test.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Estadísticas de la Base de Datos
          </CardTitle>
          <CardDescription>
            Revisa las estadísticas actuales de los entrenamientos en la base de datos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button 
              onClick={loadDatabaseStats} 
              disabled={loadingDb}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {loadingDb ? 'Actualizando...' : 'Actualizar Estadísticas'}
            </Button>
          </div>

          {dbStats && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-red-600">
                      {dbStats.total}
                    </div>
                    <p className="text-xs text-gray-600">Total Entrenamientos</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-red-600">
                      {dbStats.withBloque}
                    </div>
                    <p className="text-xs text-gray-600">Con Bloque/Mesociclo</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-red-600">
                      {dbStats.withoutBloque}
                    </div>
                    <p className="text-xs text-gray-600">Sin Bloque/Mesociclo</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-red-600">
                      {Object.keys(dbStats.byGroup).length}
                    </div>
                    <p className="text-xs text-gray-600">Grupos Únicos</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Distribución por Bloque/Mesociclo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(dbStats.byBloque).map(([bloque, count]) => (
                    <div key={bloque} className="flex justify-between text-sm">
                      <span className="text-gray-600">{bloque}:</span>
                      <span className="font-semibold">{count} entrenamientos</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Distribución por Grupo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(dbStats.byGroup).map(([group, count]) => (
                    <div key={group} className="flex justify-between text-sm">
                      <span className="text-gray-600">{group}:</span>
                      <span className="font-semibold">{count} entrenamientos</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Última Actualización:</strong> {dbStats.lastUpdate}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}