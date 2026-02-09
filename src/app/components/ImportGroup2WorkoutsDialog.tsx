import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Upload, AlertTriangle, CheckCircle, Loader2, Trash2, BarChart3, Users } from 'lucide-react';
import { 
  importGroup2Workouts, 
  checkGroup2WorkoutsExist, 
  deleteAllGroup2Workouts,
  getGroup2WorkoutsStats 
} from '../utils/importGroup2Workouts';
import { toast } from 'sonner';

interface ImportGroup2WorkoutsDialogProps {
  onImportComplete?: () => void;
}

export function ImportGroup2WorkoutsDialog({ onImportComplete }: ImportGroup2WorkoutsDialogProps) {
  const [open, setOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [checkingStats, setCheckingStats] = useState(false);
  const [workoutsExist, setWorkoutsExist] = useState(false);
  const [stats, setStats] = useState<{
    total: number;
    byBloque: Record<string, number>;
    totalDistance: number;
    averageDistance: number;
    totalDuration: number;
    averageDuration: number;
  } | null>(null);

  const handleCheckStatus = async () => {
    setCheckingStats(true);
    try {
      const exist = await checkGroup2WorkoutsExist();
      setWorkoutsExist(exist);
      
      if (exist) {
        const workoutStats = await getGroup2WorkoutsStats();
        setStats(workoutStats);
      } else {
        setStats(null);
      }
    } catch (error) {
      console.error('Error checking status:', error);
      toast.error('Error al verificar estado');
    } finally {
      setCheckingStats(false);
    }
  };

  const handleImport = async () => {
    if (!confirm('¿Estás seguro de importar los entrenamientos del Grupo 2? Esta operación puede tomar varios minutos.')) {
      return;
    }
    
    setImporting(true);
    try {
      toast.info('Iniciando importación de entrenamientos...');
      
      const result = await importGroup2Workouts();
      
      if (result.failed === 0) {
        toast.success(`¡Importación exitosa! ${result.success} entrenamientos importados`);
      } else {
        toast.warning(`Importación completada con errores: ${result.success} exitosos, ${result.failed} fallidos`);
        if (result.errors.length > 0) {
          console.error('Errores de importación:', result.errors);
        }
      }
      
      // Actualizar estado
      await handleCheckStatus();
      
      // Notificar a componente padre
      if (onImportComplete) {
        onImportComplete();
      }
      
      setOpen(false);
    } catch (error) {
      console.error('Error importing workouts:', error);
      toast.error('Error al importar entrenamientos');
    } finally {
      setImporting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('⚠️ ADVERTENCIA: ¿Estás COMPLETAMENTE SEGURO de eliminar TODOS los entrenamientos del Grupo 2? Esta acción NO se puede deshacer.')) {
      return;
    }
    
    if (!confirm('Última confirmación: ¿Eliminar todos los entrenamientos del Grupo 2?')) {
      return;
    }
    
    setDeleting(true);
    try {
      toast.info('Eliminando entrenamientos del Grupo 2...');
      
      const deletedCount = await deleteAllGroup2Workouts();
      
      toast.success(`${deletedCount} entrenamientos del Grupo 2 eliminados`);
      
      // Actualizar estado
      await handleCheckStatus();
      
      // Notificar a componente padre
      if (onImportComplete) {
        onImportComplete();
      }
    } catch (error) {
      console.error('Error deleting workouts:', error);
      toast.error('Error al eliminar entrenamientos');
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      handleCheckStatus();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Users className="w-4 h-4" />
          Importar Grupo 2
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-red-600" />
            Importar Entrenamientos Grupo 2 (Mayores)
          </DialogTitle>
          <DialogDescription>
            Importa los entrenamientos predefinidos para el Grupo 2 (Inf B - Juveniles - Mayores) a la base de datos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Estado actual */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Estado Actual
                </h4>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCheckStatus}
                  disabled={checkingStats}
                >
                  {checkingStats ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    'Actualizar'
                  )}
                </Button>
              </div>

              {checkingStats ? (
                <div className="text-center py-8 text-gray-500">
                  <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
                  <p>Verificando estado...</p>
                </div>
              ) : stats ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-xs text-green-600 mb-1">Total Entrenamientos</p>
                      <p className="text-2xl font-bold text-green-700">{stats.total}</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-600 mb-1">Distancia Promedio</p>
                      <p className="text-2xl font-bold text-blue-700">{stats.averageDistance}m</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <p className="text-xs text-purple-600 mb-1">Distancia Total</p>
                      <p className="text-lg font-bold text-purple-700">{(stats.totalDistance / 1000).toFixed(1)}km</p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-xs text-orange-600 mb-1">Duración Promedio</p>
                      <p className="text-lg font-bold text-orange-700">{stats.averageDuration} min</p>
                    </div>
                  </div>

                  {Object.keys(stats.byBloque).length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2">Por Bloque:</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(stats.byBloque).map(([bloque, count]) => (
                          <Badge key={bloque} variant="outline" className="bg-gray-50">
                            {bloque}: {count}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      Los entrenamientos del Grupo 2 ya están importados en la base de datos
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-700">
                    No hay entrenamientos del Grupo 2 en la base de datos. Usa el botón "Importar Entrenamientos" para cargarlos.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Información de importación */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Información de Importación
              </h4>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p>📋 <strong>Temporada:</strong> 2026-2027 (52 semanas)</p>
                <p>👥 <strong>Categorías:</strong> Inf B1-B2, Juv A1-A2, Juv B1-B2-B3, Mayores</p>
                <p>📅 <strong>Frecuencia:</strong> 6 días/semana (Lun-Vie PM, Sáb AM)</p>
                <p>⏱️ <strong>Duración:</strong> 90-120 minutos por sesión</p>
                <p>🎯 <strong>Bloques:</strong> 10 bloques especializados</p>
                <p>📊 <strong>Entrenamientos:</strong> 60 entrenamientos detallados (Bloques 1-2)</p>
              </div>
            </CardContent>
          </Card>

          {/* Advertencias */}
          {workoutsExist && (
            <Alert className="bg-orange-50 border-orange-200">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <AlertDescription className="text-orange-700">
                <strong>Nota:</strong> Ya existen entrenamientos del Grupo 2. Si importas nuevamente, se duplicarán los entrenamientos.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            {workoutsExist && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting || importing}
                className="flex-1 sm:flex-initial"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar Todo
                  </>
                )}
              </Button>
            )}
            
            <Button
              onClick={handleImport}
              disabled={importing || deleting}
              className="flex-1 sm:flex-initial bg-red-600 hover:bg-red-700"
            >
              {importing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Importar Entrenamientos
                </>
              )}
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={importing || deleting}
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
