import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { AlertCircle, RefreshCw, Trash2, CheckCircle, XCircle } from 'lucide-react';

export function QuickFix() {
  const [fixing, setFixing] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [showFix, setShowFix] = useState(false);

  // Detectar si hay problemas comunes
  const hasServiceWorker = 'serviceWorker' in navigator && navigator.serviceWorker.controller;
  const hasCachedData = localStorage.length > 0;

  const quickFix = async () => {
    setFixing(true);
    setResults([]);
    const logs: string[] = [];

    try {
      // 1. Desregistrar Service Workers
      logs.push('🔄 Desregistrando Service Workers...');
      setResults([...logs]);
      
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
          logs.push(`✅ Service Worker desregistrado: ${registration.scope}`);
          setResults([...logs]);
        }
      } else {
        logs.push('ℹ️ Service Worker no soportado en este navegador');
        setResults([...logs]);
      }

      // 2. Limpiar cachés
      logs.push('🔄 Limpiando cachés...');
      setResults([...logs]);
      
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          await caches.delete(cacheName);
          logs.push(`✅ Caché eliminado: ${cacheName}`);
          setResults([...logs]);
        }
      } else {
        logs.push('ℹ️ Cache API no soportado');
        setResults([...logs]);
      }

      // 3. Limpiar localStorage (excepto datos críticos de sesión temporalmente)
      logs.push('🔄 Limpiando localStorage...');
      setResults([...logs]);
      
      const sessionData = localStorage.getItem('auth_session');
      localStorage.clear();
      if (sessionData) {
        localStorage.setItem('auth_session', sessionData);
        logs.push('✅ localStorage limpiado (sesión preservada)');
      } else {
        logs.push('✅ localStorage limpiado completamente');
      }
      setResults([...logs]);

      // 4. Limpiar sessionStorage
      logs.push('🔄 Limpiando sessionStorage...');
      setResults([...logs]);
      sessionStorage.clear();
      logs.push('✅ sessionStorage limpiado');
      setResults([...logs]);

      logs.push('');
      logs.push('✅ ¡Limpieza completa!');
      logs.push('🔄 Recargando la página en 3 segundos...');
      setResults([...logs]);

      // Recargar después de 3 segundos
      setTimeout(() => {
        window.location.reload();
      }, 3000);

    } catch (error) {
      logs.push(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setResults([...logs]);
    } finally {
      setFixing(false);
    }
  };

  const nuclearOption = async () => {
    if (!confirm('⚠️ ADVERTENCIA: Esto eliminará TODOS los datos locales incluyendo tu sesión actual. Tendrás que volver a iniciar sesión. ¿Continuar?')) {
      return;
    }

    setFixing(true);
    setResults([]);
    const logs: string[] = [];

    try {
      logs.push('💣 Iniciando limpieza nuclear...');
      setResults([...logs]);

      // 1. Desregistrar todo
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
        logs.push('✅ Todos los Service Workers eliminados');
        setResults([...logs]);
      }

      // 2. Limpiar todos los cachés
      if ('caches' in window) {
        const keys = await caches.keys();
        for (const key of keys) {
          await caches.delete(key);
        }
        logs.push('✅ Todos los cachés eliminados');
        setResults([...logs]);
      }

      // 3. Limpiar TODO el storage
      localStorage.clear();
      sessionStorage.clear();
      logs.push('✅ Todo el storage limpiado');
      setResults([...logs]);

      // 4. Limpiar cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });
      logs.push('✅ Cookies limpiadas');
      setResults([...logs]);

      logs.push('');
      logs.push('✅ Limpieza nuclear completa');
      logs.push('🔄 Recargando en 2 segundos...');
      setResults([...logs]);

      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      logs.push(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setResults([...logs]);
    } finally {
      setFixing(false);
    }
  };

  return (
    <>
      {/* Botón flotante de emergencia */}
      {!showFix && (hasServiceWorker || hasCachedData) && (
        <div className="fixed bottom-20 right-4 z-50">
          <Button
            onClick={() => setShowFix(true)}
            variant="destructive"
            size="sm"
            className="rounded-full shadow-lg animate-pulse"
            title="¿Problemas con la app? Click aquí"
          >
            <AlertCircle className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Panel de arreglo rápido */}
      {showFix && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-6 h-6" />
                    Solución Rápida de Problemas
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Si la app no funciona correctamente, prueba estas soluciones
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFix(false)}
                  disabled={fixing}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Estado actual */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-sm text-gray-700">Estado Actual:</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    {hasServiceWorker ? (
                      <>
                        <XCircle className="w-4 h-4 text-orange-500" />
                        <span>Service Worker activo (puede causar problemas)</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Sin Service Worker</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {hasCachedData ? (
                      <>
                        <XCircle className="w-4 h-4 text-orange-500" />
                        <span>Datos en caché ({localStorage.length} items)</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Sin datos en caché</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Solución 1: Arreglo Rápido */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Solución 1: Arreglo Rápido (Recomendado)</h3>
                <p className="text-sm text-gray-600">
                  Limpia Service Worker y caché, pero preserva tu sesión actual.
                  No tendrás que volver a iniciar sesión.
                </p>
                <Button
                  onClick={quickFix}
                  disabled={fixing}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {fixing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Limpiando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Ejecutar Arreglo Rápido
                    </>
                  )}
                </Button>
              </div>

              {/* Solución 2: Reset Nuclear */}
              <div className="space-y-2">
                <h3 className="font-semibold text-red-600">Solución 2: Reset Completo (Último Recurso)</h3>
                <p className="text-sm text-gray-600">
                  ⚠️ Elimina TODO incluyendo tu sesión. Tendrás que volver a iniciar sesión.
                  Úsalo solo si el Arreglo Rápido no funciona.
                </p>
                <Button
                  onClick={nuclearOption}
                  disabled={fixing}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Reset Completo
                </Button>
              </div>

              {/* Resultados */}
              {results.length > 0 && (
                <div className="bg-gray-900 text-white rounded-lg p-4 space-y-1 max-h-60 overflow-auto font-mono text-xs">
                  {results.map((result, index) => (
                    <div key={index}>{result}</div>
                  ))}
                </div>
              )}

              {/* Instrucciones adicionales */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 text-sm mb-2">💡 Si el problema persiste:</h4>
                <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                  <li>Cierra todas las pestañas de la app</li>
                  <li>Cierra completamente el navegador</li>
                  <li>Abre el navegador de nuevo</li>
                  <li>Prueba en modo incógnito</li>
                  <li>Revisa la consola (F12) para ver errores específicos</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
