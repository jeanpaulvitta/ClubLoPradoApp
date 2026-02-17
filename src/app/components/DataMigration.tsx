import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Database, Upload, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import * as localStorage from '../services/localStorage';
import { projectId } from '../../../utils/supabase/info';

interface MigrationStatus {
  swimmers?: 'pending' | 'success' | 'error';
  workouts?: 'pending' | 'success' | 'error';
  competitions?: 'pending' | 'success' | 'error';
  attendance?: 'pending' | 'success' | 'error';
  holidays?: 'pending' | 'success' | 'error';
  testControls?: 'pending' | 'success' | 'error';
}

export function DataMigration() {
  const [migrating, setMigrating] = useState(false);
  const [status, setStatus] = useState<MigrationStatus>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc`;

  const getAuthToken = (): string => {
    try {
      const sessionStr = window.localStorage.getItem('supabase.auth.token');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        return session.access_token;
      }
    } catch (error) {
      console.warn('Error getting auth token:', error);
    }
    return '';
  };

  const getHeaders = (): HeadersInit => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No estás autenticado. Por favor inicia sesión primero.');
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const migrateData = async () => {
    setMigrating(true);
    setStatus({});
    setErrors({});

    try {
      const headers = getHeaders();

      // 1. Migrar Nadadores
      setStatus(prev => ({ ...prev, swimmers: 'pending' }));
      try {
        const swimmers = localStorage.getSwimmers();
        console.log('📤 Migrando nadadores:', swimmers.length);
        
        for (const swimmer of swimmers) {
          const response = await fetch(`${API_URL}/swimmers`, {
            method: 'POST',
            headers,
            body: JSON.stringify(swimmer),
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al migrar nadador');
          }
        }
        
        setStatus(prev => ({ ...prev, swimmers: 'success' }));
        toast.success(`✅ ${swimmers.length} nadadores migrados`);
      } catch (error) {
        setStatus(prev => ({ ...prev, swimmers: 'error' }));
        setErrors(prev => ({ ...prev, swimmers: error instanceof Error ? error.message : String(error) }));
        toast.error('Error migrando nadadores');
      }

      // 2. Migrar Entrenamientos
      setStatus(prev => ({ ...prev, workouts: 'pending' }));
      try {
        const workouts = localStorage.getWorkouts();
        console.log('📤 Migrando entrenamientos:', workouts.length);
        
        // Migrar en lotes de 50 para no saturar
        const batchSize = 50;
        for (let i = 0; i < workouts.length; i += batchSize) {
          const batch = workouts.slice(i, i + batchSize);
          
          for (const workout of batch) {
            const response = await fetch(`${API_URL}/workouts`, {
              method: 'POST',
              headers,
              body: JSON.stringify(workout),
            });
            
            if (!response.ok) {
              const error = await response.json();
              console.warn('Error en workout:', error);
              // Continuar con los demás en lugar de fallar
            }
          }
          
          console.log(`Migrados ${Math.min(i + batchSize, workouts.length)}/${workouts.length} entrenamientos`);
        }
        
        setStatus(prev => ({ ...prev, workouts: 'success' }));
        toast.success(`✅ ${workouts.length} entrenamientos migrados`);
      } catch (error) {
        setStatus(prev => ({ ...prev, workouts: 'error' }));
        setErrors(prev => ({ ...prev, workouts: error instanceof Error ? error.message : String(error) }));
        toast.error('Error migrando entrenamientos');
      }

      // 3. Migrar Competencias
      setStatus(prev => ({ ...prev, competitions: 'pending' }));
      try {
        const competitions = localStorage.getCompetitions();
        console.log('📤 Migrando competencias:', competitions.length);
        
        for (const competition of competitions) {
          const response = await fetch(`${API_URL}/competitions`, {
            method: 'POST',
            headers,
            body: JSON.stringify(competition),
          });
          
          if (!response.ok) {
            const error = await response.json();
            console.warn('Error en competencia:', error);
          }
        }
        
        setStatus(prev => ({ ...prev, competitions: 'success' }));
        toast.success(`✅ ${competitions.length} competencias migradas`);
      } catch (error) {
        setStatus(prev => ({ ...prev, competitions: 'error' }));
        setErrors(prev => ({ ...prev, competitions: error instanceof Error ? error.message : String(error) }));
        toast.error('Error migrando competencias');
      }

      // 4. Migrar Asistencia
      setStatus(prev => ({ ...prev, attendance: 'pending' }));
      try {
        const attendance = localStorage.getAttendance();
        console.log('📤 Migrando asistencia:', attendance.length);
        
        // Migrar en lotes
        const batchSize = 100;
        for (let i = 0; i < attendance.length; i += batchSize) {
          const batch = attendance.slice(i, i + batchSize);
          
          const response = await fetch(`${API_URL}/attendance/bulk`, {
            method: 'POST',
            headers,
            body: JSON.stringify(batch),
          });
          
          if (!response.ok) {
            const error = await response.json();
            console.warn('Error en asistencia batch:', error);
          }
        }
        
        setStatus(prev => ({ ...prev, attendance: 'success' }));
        toast.success(`✅ ${attendance.length} registros de asistencia migrados`);
      } catch (error) {
        setStatus(prev => ({ ...prev, attendance: 'error' }));
        setErrors(prev => ({ ...prev, attendance: error instanceof Error ? error.message : String(error) }));
        toast.error('Error migrando asistencia');
      }

      // 5. Migrar Feriados
      setStatus(prev => ({ ...prev, holidays: 'pending' }));
      try {
        const holidays = localStorage.getHolidays();
        console.log('📤 Migrando feriados:', holidays.length);
        
        for (const holiday of holidays) {
          const response = await fetch(`${API_URL}/holidays`, {
            method: 'POST',
            headers,
            body: JSON.stringify(holiday),
          });
          
          if (!response.ok) {
            const error = await response.json();
            console.warn('Error en feriado:', error);
          }
        }
        
        setStatus(prev => ({ ...prev, holidays: 'success' }));
        toast.success(`✅ ${holidays.length} feriados migrados`);
      } catch (error) {
        setStatus(prev => ({ ...prev, holidays: 'error' }));
        setErrors(prev => ({ ...prev, holidays: error instanceof Error ? error.message : String(error) }));
        toast.error('Error migrando feriados');
      }

      // 6. Migrar Test Controls
      setStatus(prev => ({ ...prev, testControls: 'pending' }));
      try {
        const testControls = localStorage.getTestControls();
        console.log('📤 Migrando test controls:', testControls.length);
        
        for (const testControl of testControls) {
          const response = await fetch(`${API_URL}/test-controls`, {
            method: 'POST',
            headers,
            body: JSON.stringify(testControl),
          });
          
          if (!response.ok) {
            const error = await response.json();
            console.warn('Error en test control:', error);
          }
        }
        
        setStatus(prev => ({ ...prev, testControls: 'success' }));
        toast.success(`✅ ${testControls.length} test controls migrados`);
      } catch (error) {
        setStatus(prev => ({ ...prev, testControls: 'error' }));
        setErrors(prev => ({ ...prev, testControls: error instanceof Error ? error.message : String(error) }));
        toast.error('Error migrando test controls');
      }

      // Verificar si todo fue exitoso
      const allSuccess = Object.values(status).every(s => s === 'success');
      if (allSuccess) {
        toast.success('🎉 ¡Migración completada exitosamente!', { duration: 5000 });
      } else {
        toast.warning('⚠️ Migración completada con algunos errores', { duration: 5000 });
      }

    } catch (error) {
      console.error('Error en migración:', error);
      toast.error(error instanceof Error ? error.message : 'Error en la migración');
    } finally {
      setMigrating(false);
    }
  };

  const getStatusIcon = (status?: 'pending' | 'success' | 'error') => {
    if (!status) return null;
    if (status === 'pending') return <Loader2 className="w-4 h-4 animate-spin text-blue-600" />;
    if (status === 'success') return <CheckCircle className="w-4 h-4 text-green-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  const getStatusBadge = (status?: 'pending' | 'success' | 'error') => {
    if (!status) return <Badge variant="outline">Pendiente</Badge>;
    if (status === 'pending') return <Badge className="bg-blue-600">Migrando...</Badge>;
    if (status === 'success') return <Badge className="bg-green-600">✓ OK</Badge>;
    return <Badge className="bg-red-600">✗ Error</Badge>;
  };

  // Contar datos actuales
  const counts = {
    swimmers: localStorage.getSwimmers().length,
    workouts: localStorage.getWorkouts().length,
    competitions: localStorage.getCompetitions().length,
    attendance: localStorage.getAttendance().length,
    holidays: localStorage.getHolidays().length,
    testControls: localStorage.getTestControls().length,
  };

  const totalRecords = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return (
    <Card className="border-2 border-red-500">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6 text-red-500" />
          <CardTitle>Migración de Datos a Supabase</CardTitle>
        </div>
        <CardDescription>
          Migra todos tus datos locales a Supabase en un solo click
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>IMPORTANTE:</strong> Asegúrate de haber creado la tabla <code className="bg-gray-100 px-1 rounded">kv_store_4909a0bc</code> en Supabase antes de migrar.
            <br />
            Ver instrucciones en: <code className="bg-gray-100 px-1 rounded">/MIGRACION_DATOS_SUPABASE.md</code>
          </AlertDescription>
        </Alert>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Datos Actuales en LocalStorage:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>• Nadadores: <strong>{counts.swimmers}</strong></div>
            <div>• Entrenamientos: <strong>{counts.workouts}</strong></div>
            <div>• Competencias: <strong>{counts.competitions}</strong></div>
            <div>• Asistencia: <strong>{counts.attendance}</strong></div>
            <div>• Feriados: <strong>{counts.holidays}</strong></div>
            <div>• Test Controls: <strong>{counts.testControls}</strong></div>
          </div>
          <div className="mt-2 pt-2 border-t font-semibold">
            Total: <strong>{totalRecords}</strong> registros
          </div>
        </div>

        {Object.keys(status).length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">Estado de Migración:</h4>
            {[
              { key: 'swimmers', label: 'Nadadores' },
              { key: 'workouts', label: 'Entrenamientos' },
              { key: 'competitions', label: 'Competencias' },
              { key: 'attendance', label: 'Asistencia' },
              { key: 'holidays', label: 'Feriados' },
              { key: 'testControls', label: 'Test Controls' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  {getStatusIcon(status[key as keyof MigrationStatus])}
                  <span>{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(status[key as keyof MigrationStatus])}
                </div>
              </div>
            ))}
            
            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive">
                <AlertDescription>
                  <strong>Errores:</strong>
                  <ul className="mt-2 list-disc list-inside">
                    {Object.entries(errors).map(([key, error]) => (
                      <li key={key}><strong>{key}:</strong> {error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <Button
          onClick={migrateData}
          disabled={migrating || totalRecords === 0}
          className="w-full bg-red-500 hover:bg-red-600"
          size="lg"
        >
          {migrating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Migrando Datos...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5" />
              Migrar {totalRecords} Registros a Supabase
            </>
          )}
        </Button>

        {totalRecords === 0 && (
          <Alert>
            <AlertDescription>
              No hay datos para migrar en LocalStorage.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
