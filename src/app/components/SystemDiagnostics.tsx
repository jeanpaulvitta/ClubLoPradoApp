import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { OfflineModeChecker } from './OfflineModeChecker';
import { ServerConfigGuide } from './ServerConfigGuide';
import { 
  Activity, 
  Settings, 
  Info,
  Database,
  Server
} from 'lucide-react';

export function SystemDiagnostics() {
  const [activeTab, setActiveTab] = useState('status');

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <Activity className="w-6 h-6" />
            Diagnóstico del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="status" className="flex items-center gap-2">
                <Server className="w-4 h-4" />
                Estado del Servidor
              </TabsTrigger>
              <TabsTrigger value="config" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configuración
              </TabsTrigger>
              <TabsTrigger value="info" className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                Información
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Estado del Servidor */}
            <TabsContent value="status" className="space-y-4">
              <OfflineModeChecker />
            </TabsContent>

            {/* Tab 2: Guía de Configuración */}
            <TabsContent value="config" className="space-y-4">
              <ServerConfigGuide />
            </TabsContent>

            {/* Tab 3: Información del Sistema */}
            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Info className="w-5 h-5" />
                    Información del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-gray-800">Club Natación Lo Prado</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Versión:</span>
                        <code className="bg-gray-200 px-2 py-1 rounded">2.0.4</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Temporada:</span>
                        <span className="font-medium">2026-2027</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Backend:</span>
                        <span className="font-medium">Supabase Edge Functions</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base de Datos:</span>
                        <span className="font-medium">Supabase PostgreSQL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Autenticación:</span>
                        <span className="font-medium">Supabase Auth</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-blue-900">Características del Sistema</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">✓</span>
                        <span>Gestión completa de nadadores y entrenamientos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">✓</span>
                        <span>Sistema de asistencia y control de progreso</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">✓</span>
                        <span>Registro de marcas personales y récords del club</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">✓</span>
                        <span>Gestión de competencias y resultados</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">✓</span>
                        <span>Sistema de logros y medallas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">✓</span>
                        <span>Análisis estadístico y reportes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">✓</span>
                        <span>PWA instalable (funciona offline)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">✓</span>
                        <span>Estructura de 10 bloques de entrenamiento</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-green-900">Roles de Usuario</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-green-700">Admin:</span>
                        <span className="text-gray-700">Acceso completo a todas las funcionalidades</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-green-700">Coach:</span>
                        <span className="text-gray-700">Gestión de entrenamientos, asistencia y nadadores</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-green-700">Nadador:</span>
                        <span className="text-gray-700">Visualización de progreso personal y competencias</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-yellow-900">Documentación</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <code className="text-xs bg-black/10 px-2 py-1 rounded block">
                          /GUIA_CONEXION_SUPABASE.md
                        </code>
                        <p className="text-xs text-gray-600 mt-1 ml-1">
                          Guía completa de configuración del servidor
                        </p>
                      </div>
                      <div>
                        <code className="text-xs bg-black/10 px-2 py-1 rounded block">
                          /README_CONEXION_SUPABASE.md
                        </code>
                        <p className="text-xs text-gray-600 mt-1 ml-1">
                          Referencia rápida de conexión
                        </p>
                      </div>
                      <div>
                        <code className="text-xs bg-black/10 px-2 py-1 rounded block">
                          /INSTRUCCIONES_PRIMER_USO.md
                        </code>
                        <p className="text-xs text-gray-600 mt-1 ml-1">
                          Instrucciones para el primer uso del sistema
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
