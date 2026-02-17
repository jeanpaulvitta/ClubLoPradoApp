/**
 * Panel de Migración de Datos
 * 
 * Herramienta administrativa para migrar datos de localStorage a Supabase
 */

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Database, Upload, Trash2, Info } from 'lucide-react';
import { 
  migrateAllDataToSupabase, 
  clearAllLegacyData, 
  hasLegacyData,
  getLocalStorageStats,
  checkBackendHealth 
} from '../services/migration';
import { supabase } from '../services/supabaseClient';

interface DataMigrationPanelProps {}

export function DataMigrationPanel({}: DataMigrationPanelProps) {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<any>(null);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [backendHealthy, setBackendHealthy] = useState<boolean | null>(null);
  const [accessToken, setAccessToken] = useState<string>('');

  // Cargar estadísticas y token al montar
  useEffect(() => {
    refreshStats();
    checkHealth();
    loadAccessToken();
  }, []);

  const loadAccessToken = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setAccessToken(data.session.access_token);
    }
  };

  const refreshStats = () => {
    const localStats = getLocalStorageStats();
    setStats(localStats);
  };

  const checkHealth = async () => {
    const healthy = await checkBackendHealth();
    setBackendHealthy(healthy);
  };

  const handleMigrate = async () => {
    if (!accessToken) {
      alert('⚠️ Debes estar autenticado como administrador para migrar datos');
      return;
    }

    if (!hasLegacyData()) {
      alert('ℹ️ No hay datos en localStorage para migrar');
      return;
    }

    const confirmMigrate = window.confirm(
      '🔄 ¿Iniciar migración de datos a Supabase?\n\n' +
      'Esto copiará todos los datos de localStorage al servidor.\n' +
      'Los datos locales NO se eliminarán automáticamente.\n\n' +
      '¿Continuar?'
    );

    if (!confirmMigrate) return;

    setIsMigrating(true);
    setMigrationResult(null);

    try {
      const result = await migrateAllDataToSupabase(accessToken);
      setMigrationResult(result);
      refreshStats();
      
      if (result.success) {
        // Preguntar si quiere limpiar localStorage
        const confirmClear = window.confirm(
          '✅ Migración completada exitosamente!\n\n' +
          `${result.message}\n\n` +
          '¿Deseas limpiar los datos de localStorage ahora?\n' +
          '(Recomendado después de verificar que los datos están en Supabase)'
        );

        if (confirmClear) {
          handleClearLocalStorage();
        }
      }
    } catch (error) {
      console.error('Error durante migración:', error);
      setMigrationResult({
        success: false,
        message: 'Error inesperado durante la migración',
        details: error,
      });
    } finally {
      setIsMigrating(false);
    }
  };

  const handleClearLocalStorage = () => {
    const confirmClear = window.confirm(
      '⚠️ ¿Eliminar todos los datos de localStorage?\n\n' +
      'Esta acción NO se puede deshacer.\n' +
      'Asegúrate de que los datos ya están migrados a Supabase.\n\n' +
      '¿Continuar?'
    );

    if (!confirmClear) return;

    clearAllLegacyData();
    refreshStats();
    alert('✅ Datos de localStorage eliminados exitosamente');
  };

  const totalLocalRecords = Object.values(stats).reduce((sum, count) => sum + count, 0);
  const hasData = hasLegacyData();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Database className="w-6 h-6" />
          Migración de Datos
        </h2>
        <p className="text-gray-600 mt-2">
          Herramienta para migrar datos de localStorage a Supabase
        </p>
      </div>

      {/* Estado del Backend */}
      <div className="mb-6 p-4 border rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Estado del Backend</h3>
        </div>
        <div className="flex items-center gap-2">
          {backendHealthy === null ? (
            <>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
              <span className="text-gray-600">Verificando...</span>
            </>
          ) : backendHealthy ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">Backend funcionando correctamente</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 font-medium">Backend no responde</span>
              <button
                onClick={checkHealth}
                className="ml-auto text-sm text-blue-600 hover:underline"
              >
                Reintentar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Estadísticas de localStorage */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">
          Datos en localStorage
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(stats).map(([key, count]) => (
            <div
              key={key}
              className={`p-3 rounded-lg ${
                count > 0 ? 'bg-blue-100 border border-blue-300' : 'bg-white border border-gray-200'
              }`}
            >
              <div className="text-sm text-gray-600 capitalize">
                {key.replace(/_/g, ' ').toLowerCase()}
              </div>
              <div className={`text-2xl font-bold ${count > 0 ? 'text-blue-700' : 'text-gray-400'}`}>
                {count}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-300">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total de registros:</span>
            <span className="text-2xl font-bold text-blue-700">{totalLocalRecords}</span>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={handleMigrate}
          disabled={isMigrating || !hasData || !backendHealthy}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
            isMigrating || !hasData || !backendHealthy
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          <Upload className="w-5 h-5" />
          {isMigrating ? 'Migrando...' : 'Migrar a Supabase'}
        </button>

        <button
          onClick={handleClearLocalStorage}
          disabled={!hasData}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
            !hasData
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          <Trash2 className="w-5 h-5" />
          Limpiar localStorage
        </button>
      </div>

      {/* Resultado de migración */}
      {migrationResult && (
        <div
          className={`p-4 rounded-lg border ${
            migrationResult.success
              ? 'bg-green-50 border-green-300'
              : 'bg-red-50 border-red-300'
          }`}
        >
          <div className="flex items-start gap-2">
            {migrationResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            )}
            <div className="flex-1">
              <h4
                className={`font-semibold ${
                  migrationResult.success ? 'text-green-900' : 'text-red-900'
                }`}
              >
                {migrationResult.message}
              </h4>
              
              {migrationResult.details && (
                <div className="mt-2 text-sm">
                  {migrationResult.details.swimmers !== undefined && (
                    <div className="space-y-1 mt-2">
                      <p className="text-gray-700">📊 Resultados de migración:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        {migrationResult.details.swimmers > 0 && (
                          <li>Nadadores: {migrationResult.details.swimmers}</li>
                        )}
                        {migrationResult.details.competitions > 0 && (
                          <li>Competencias: {migrationResult.details.competitions}</li>
                        )}
                        {migrationResult.details.workouts > 0 && (
                          <li>Entrenamientos: {migrationResult.details.workouts}</li>
                        )}
                        {migrationResult.details.holidays > 0 && (
                          <li>Días feriados: {migrationResult.details.holidays}</li>
                        )}
                        {migrationResult.details.testControls > 0 && (
                          <li>Controles de prueba: {migrationResult.details.testControls}</li>
                        )}
                        {migrationResult.details.testResults > 0 && (
                          <li>Resultados de prueba: {migrationResult.details.testResults}</li>
                        )}
                        {migrationResult.details.attendance > 0 && (
                          <li>Registros de asistencia: {migrationResult.details.attendance}</li>
                        )}
                      </ul>
                      
                      {migrationResult.details.errors && migrationResult.details.errors.length > 0 && (
                        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-300 rounded">
                          <p className="font-semibold text-yellow-900">⚠️ Errores:</p>
                          <ul className="list-disc list-inside text-sm space-y-1 ml-2 mt-1">
                            {migrationResult.details.errors.slice(0, 5).map((error: string, idx: number) => (
                              <li key={idx} className="text-yellow-800">{error}</li>
                            ))}
                            {migrationResult.details.errors.length > 5 && (
                              <li className="text-yellow-800">
                                ... y {migrationResult.details.errors.length - 5} errores más
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instrucciones */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">📋 Instrucciones</h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
          <li>Verifica que el backend esté funcionando (indicador verde arriba)</li>
          <li>Revisa las estadísticas de datos en localStorage</li>
          <li>Haz clic en "Migrar a Supabase" para copiar los datos al servidor</li>
          <li>Verifica en las pestañas de la app que los datos se cargaron correctamente</li>
          <li>Una vez verificado, puedes limpiar localStorage para liberar espacio</li>
        </ol>
      </div>
    </div>
  );
}
