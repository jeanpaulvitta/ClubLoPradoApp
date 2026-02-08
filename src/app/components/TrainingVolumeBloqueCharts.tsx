import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, Activity, BarChart3 } from "lucide-react";
import { Badge } from "./ui/badge";

type SessionType = {
  type: 'workout' | 'challenge';
  mesociclo?: string;
  bloque?: string;
  week: number;
  date: string;
  day: string;
  distance: number;
  warmup?: string;
  mainSet?: string[] | string;
  cooldown?: string;
  intensity?: string;
  focus?: string;
  description?: string;
};

interface TrainingVolumeBloqueChartsProps {
  sessions: SessionType[];
}

// Definición de los 10 bloques
const bloques = [
  { name: "Bloque 1", shortName: "B1", color: "#3b82f6" },
  { name: "Bloque 2", shortName: "B2", color: "#10b981" },
  { name: "Bloque 3", shortName: "B3", color: "#a855f7" },
  { name: "Bloque 4", shortName: "B4", color: "#ef4444" },
  { name: "Bloque 5", shortName: "B5", color: "#f97316" },
  { name: "Bloque 6", shortName: "B6", color: "#3b82f6" },
  { name: "Bloque 7", shortName: "B7", color: "#10b981" },
  { name: "Bloque 8", shortName: "B8", color: "#a855f7" },
  { name: "Bloque 9", shortName: "B9", color: "#f97316" },
  { name: "Bloque 10", shortName: "B10", color: "#ef4444" },
];

export function TrainingVolumeBloqueCharts({ sessions }: TrainingVolumeBloqueChartsProps) {
  // Calcular volúmenes e intensidades por bloque
  const bloqueData = bloques.map(bloque => {
    const bloqueSessions = sessions.filter(s => s.bloque === bloque.name);
    
    const intensityVolumes: { [key: string]: number } = {
      "Baja": 0,
      "Media": 0,
      "Alta": 0,
      "Muy alta": 0
    };

    bloqueSessions.forEach(session => {
      const intensity = session.intensity || "Media";
      if (intensityVolumes[intensity] !== undefined) {
        intensityVolumes[intensity] += session.distance;
      }
    });

    return {
      name: bloque.shortName,
      fullName: bloque.name,
      'Baja': Math.round(intensityVolumes['Baja'] / 1000 * 10) / 10,
      'Media': Math.round(intensityVolumes['Media'] / 1000 * 10) / 10,
      'Alta': Math.round(intensityVolumes['Alta'] / 1000 * 10) / 10,
      'Muy alta': Math.round(intensityVolumes['Muy alta'] / 1000 * 10) / 10,
      total: Math.round((intensityVolumes['Baja'] + intensityVolumes['Media'] + intensityVolumes['Alta'] + intensityVolumes['Muy alta']) / 1000 * 10) / 10,
      sessions: bloqueSessions.length,
    };
  });

  // Calcular volumen total por bloque (para gráfico de línea)
  const volumeTrendData = bloqueData.map(item => ({
    name: item.name,
    volumen: item.total,
  }));

  const COLORS_INTENSITY = {
    'Baja': '#10b981',
    'Media': '#3b82f6',
    'Alta': '#f97316',
    'Muy alta': '#ef4444'
  };

  // Calcular estadísticas generales
  const totalVolume = bloqueData.reduce((sum, item) => sum + item.total, 0);
  const totalSessions = bloqueData.reduce((sum, item) => sum + item.sessions, 0);
  const avgVolumePerBlock = totalSessions > 0 ? Math.round(totalVolume / bloques.length * 10) / 10 : 0;
  const maxVolumeBlock = bloqueData.reduce((max, item) => item.total > max.total ? item : max, bloqueData[0]);
  const minVolumeBlock = bloqueData.reduce((min, item) => item.total > 0 && item.total < min.total ? item : min, bloqueData.find(b => b.total > 0) || bloqueData[0]);

  return (
    <div className="space-y-6">
      {/* Estadísticas Resumen */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-blue-600" />
            Resumen de Volumen por Bloques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Volumen Total</p>
              <p className="text-2xl font-bold text-blue-600">{totalVolume.toFixed(1)} km</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Sesiones Totales</p>
              <p className="text-2xl font-bold text-purple-600">{totalSessions}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Promedio/Bloque</p>
              <p className="text-2xl font-bold text-green-600">{avgVolumePerBlock.toFixed(1)} km</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Bloque Más Intenso</p>
              <div className="flex flex-col items-center gap-1">
                <p className="text-2xl font-bold text-red-600">{maxVolumeBlock.name}</p>
                <Badge className="bg-red-100 text-red-700 text-xs">
                  {maxVolumeBlock.total.toFixed(1)} km
                </Badge>
              </div>
            </div>
          </div>

          {/* Mini leyenda de bloques */}
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">Bloques de la Temporada 2026-2027:</p>
            <div className="grid grid-cols-5 gap-2">
              {bloques.map((bloque, idx) => (
                <Badge 
                  key={idx}
                  variant="outline"
                  className="justify-center text-xs"
                  style={{ 
                    borderColor: bloque.color,
                    color: bloque.color,
                  }}
                >
                  {bloque.shortName}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Barras Apiladas - Volumen por Intensidad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Volumen e Intensidad por Bloque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={bloqueData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                label={{ value: 'Volumen (km)', angle: -90, position: 'insideLeft' }} 
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                formatter={(value: number) => `${value} km`}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px' }}
                labelFormatter={(label) => {
                  const item = bloqueData.find(b => b.name === label);
                  return item ? `${item.fullName} (${item.sessions} sesiones)` : label;
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Baja" stackId="a" fill={COLORS_INTENSITY['Baja']} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Media" stackId="a" fill={COLORS_INTENSITY['Media']} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Alta" stackId="a" fill={COLORS_INTENSITY['Alta']} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Muy alta" stackId="a" fill={COLORS_INTENSITY['Muy alta']} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600 text-center">
            Distribución de volumen de entrenamiento por intensidad en cada bloque de la temporada
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Línea - Tendencia de Volumen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Tendencia de Volumen a través de los Bloques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={volumeTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                label={{ value: 'Volumen Total (km)', angle: -90, position: 'insideLeft' }} 
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                formatter={(value: number) => `${value} km`}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px' }}
                labelFormatter={(label) => {
                  const item = bloqueData.find(b => b.name === label);
                  return item ? item.fullName : label;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="volumen" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600 text-center">
            Progresión del volumen total de entrenamiento a través de los 10 bloques de la temporada
          </div>
        </CardContent>
      </Card>

      {/* Tabla Detallada por Bloque */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detalle por Bloque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2 px-3 font-semibold">Bloque</th>
                  <th className="text-center py-2 px-3 font-semibold">Sesiones</th>
                  <th className="text-right py-2 px-3 font-semibold">Baja (km)</th>
                  <th className="text-right py-2 px-3 font-semibold">Media (km)</th>
                  <th className="text-right py-2 px-3 font-semibold">Alta (km)</th>
                  <th className="text-right py-2 px-3 font-semibold">Muy Alta (km)</th>
                  <th className="text-right py-2 px-3 font-semibold">Total (km)</th>
                </tr>
              </thead>
              <tbody>
                {bloqueData.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-2 px-3">
                      <Badge 
                        variant="outline"
                        style={{ 
                          borderColor: bloques[idx].color,
                          color: bloques[idx].color,
                        }}
                      >
                        {item.fullName}
                      </Badge>
                    </td>
                    <td className="text-center py-2 px-3">{item.sessions}</td>
                    <td className="text-right py-2 px-3 text-green-600 font-medium">{item['Baja']}</td>
                    <td className="text-right py-2 px-3 text-blue-600 font-medium">{item['Media']}</td>
                    <td className="text-right py-2 px-3 text-orange-600 font-medium">{item['Alta']}</td>
                    <td className="text-right py-2 px-3 text-red-600 font-medium">{item['Muy alta']}</td>
                    <td className="text-right py-2 px-3 font-bold">{item.total}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-300 font-bold bg-gray-50">
                  <td className="py-3 px-3">TOTAL</td>
                  <td className="text-center py-3 px-3">{totalSessions}</td>
                  <td className="text-right py-3 px-3 text-green-600">
                    {bloqueData.reduce((sum, item) => sum + item['Baja'], 0).toFixed(1)}
                  </td>
                  <td className="text-right py-3 px-3 text-blue-600">
                    {bloqueData.reduce((sum, item) => sum + item['Media'], 0).toFixed(1)}
                  </td>
                  <td className="text-right py-3 px-3 text-orange-600">
                    {bloqueData.reduce((sum, item) => sum + item['Alta'], 0).toFixed(1)}
                  </td>
                  <td className="text-right py-3 px-3 text-red-600">
                    {bloqueData.reduce((sum, item) => sum + item['Muy alta'], 0).toFixed(1)}
                  </td>
                  <td className="text-right py-3 px-3">{totalVolume.toFixed(1)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
