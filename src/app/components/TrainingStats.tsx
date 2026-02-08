import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Activity, Zap, TrendingUp, Target, Wind, Waves, Hand, Footprints, Anchor, Download, PieChart as PieChartIcon, BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, RadialBarChart, RadialBar } from "recharts";
import { toast } from "sonner";
import { generateTrainingStatsPDF } from "../utils/pdfStatsGenerator";

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

interface TrainingStatsProps {
  sessions: SessionType[];
  mesociclo?: string;
}

export function TrainingStats({ sessions, mesociclo }: TrainingStatsProps) {
  // Filtrar sesiones si hay mesociclo seleccionado
  const filteredSessions = mesociclo && mesociclo !== "Todos"
    ? sessions.filter(s => s.mesociclo === mesociclo)
    : sessions;

  // Función para descargar PDF
  const handleDownloadPDF = () => {
    try {
      generateTrainingStatsPDF(filteredSessions);
      toast.success("PDF descargado exitosamente");
    } catch (error) {
      toast.error("Error al generar el PDF");
    }
  };

  // Calcular volumen por intensidad
  const intensityVolumes: { [key: string]: number } = {
    "Baja": 0,
    "Media": 0,
    "Alta": 0,
    "Muy alta": 0
  };

  filteredSessions.forEach(session => {
    const intensity = session.intensity || "Media";
    if (intensityVolumes[intensity] !== undefined) {
      intensityVolumes[intensity] += session.distance;
    }
  });

  // Calcular volumen en técnica (estimación basada en palabras clave)
  let techniqueVolume = 0;
  let techniqueCount = 0;

  // Calcular volumen por estilo en técnica
  const techniqueByStyle: { [key: string]: number } = {
    "Crol": 0,
    "Espalda": 0,
    "Pecho": 0,
    "Mariposa": 0
  };

  // Calcular volumen por equipamiento
  const equipmentVolumes: { [key: string]: number } = {
    "Pull Buoy": 0,
    "Aletas": 0,
    "Paletas": 0,
    "Patada": 0,
    "Paracaídas": 0
  };

  const equipmentSessionCount: { [key: string]: number } = {
    "Pull Buoy": 0,
    "Aletas": 0,
    "Paletas": 0,
    "Patada": 0,
    "Paracaídas": 0
  };

  filteredSessions.forEach(session => {
    const warmup = session.warmup?.toLowerCase() || "";
    const mainSet = Array.isArray(session.mainSet) 
      ? session.mainSet.join(" ").toLowerCase() 
      : (session.mainSet?.toLowerCase() || "");
    const cooldown = session.cooldown?.toLowerCase() || "";
    const focus = session.focus?.toLowerCase() || "";
    const description = session.description?.toLowerCase() || "";
    
    const combinedText = `${warmup} ${mainSet} ${cooldown} ${focus} ${description}`;
    
    // Palabras clave SOLO para identificar trabajo técnico
    const techniqueKeywords = ["técnica", "tecnica", "drill", "drills"];
    
    // Si contiene palabras clave de técnica
    const hasTechnique = techniqueKeywords.some(keyword => 
      combinedText.includes(keyword)
    );
    
    if (hasTechnique) {
      // Estimación conservadora: 35% del entrenamiento es técnica
      const sessionTechniqueVolume = Math.round(session.distance * 0.35);
      techniqueVolume += sessionTechniqueVolume;
      techniqueCount++;

      // Detectar estilo específico
      const styleKeywords = {
        "Crol": ["crol", "crawl", "libre", "free", "freestyle"],
        "Espalda": ["espalda", "back", "backstroke", "dorso"],
        "Pecho": ["pecho", "breast", "breaststroke", "braza"],
        "Mariposa": ["mariposa", "butterfly", "fly", "delfín", "delfin"]
      };

      let styleDetected = false;
      Object.entries(styleKeywords).forEach(([style, keywords]) => {
        const hasStyle = keywords.some(keyword => combinedText.includes(keyword));
        if (hasStyle) {
          techniqueByStyle[style] += sessionTechniqueVolume;
          styleDetected = true;
        }
      });

      // Si no se detectó estilo específico, distribuir equitativamente
      if (!styleDetected) {
        const volumePerStyle = Math.round(sessionTechniqueVolume / 4);
        Object.keys(techniqueByStyle).forEach(style => {
          techniqueByStyle[style] += volumePerStyle;
        });
      }
    }

    // Detectar equipamiento específico
    const equipmentKeywords = {
      "Pull Buoy": ["pull", "pullbuoy", "pull buoy", "pull-buoy"],
      "Aletas": ["aletas", "fins", "con aletas"],
      "Paletas": ["paletas", "paddles", "manos", "palas"],
      "Patada": ["patada", "kick", "piernas", "pies"],
      "Paracaídas": ["paracaidas", "paracaídas", "resistance", "arrastre", "parachute"]
    };

    Object.entries(equipmentKeywords).forEach(([equipment, keywords]) => {
      const hasEquipment = keywords.some(keyword => combinedText.includes(keyword));
      if (hasEquipment) {
        // Estimación: 25% del entrenamiento usa ese equipamiento
        equipmentVolumes[equipment] += Math.round(session.distance * 0.25);
        equipmentSessionCount[equipment]++;
      }
    });
  });

  // Calcular totales
  const totalDistance = filteredSessions.reduce((sum, s) => sum + s.distance, 0);
  const totalWorkouts = filteredSessions.filter(s => s.type === 'workout').length;

  // Calcular porcentajes
  const techniquePercentage = totalDistance > 0 
    ? Math.round((techniqueVolume / totalDistance) * 100) 
    : 0;

  // Preparar datos para gráficos
  const intensityChartData = Object.entries(intensityVolumes)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value: Math.round(value / 1000 * 10) / 10,
      percentage: totalDistance > 0 ? Math.round((value / totalDistance) * 100) : 0
    }));

  const techniqueStyleData = Object.entries(techniqueByStyle)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value: Math.round(value / 1000 * 10) / 10,
      percentage: techniqueVolume > 0 ? Math.round((value / techniqueVolume) * 100) : 0
    }));

  const equipmentChartData = Object.entries(equipmentVolumes)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value: Math.round(value / 1000 * 10) / 10,
      sessions: equipmentSessionCount[name],
      percentage: totalDistance > 0 ? Math.round((value / totalDistance) * 100) : 0
    }))
    .sort((a, b) => b.value - a.value);

  const COLORS_INTENSITY = {
    'Baja': '#10b981',
    'Media': '#3b82f6',
    'Alta': '#f97316',
    'Muy alta': '#ef4444'
  };

  const COLORS_STYLE = {
    'Crol': '#3b82f6',
    'Espalda': '#a855f7',
    'Pecho': '#10b981',
    'Mariposa': '#ec4899'
  };

  const COLORS_EQUIPMENT = ['#3b82f6', '#06b6d4', '#6366f1', '#14b8a6', '#64748b'];

  const getStyleColor = (style: string) => {
    switch (style) {
      case "Crol": return "text-blue-600 bg-blue-50";
      case "Espalda": return "text-purple-600 bg-purple-50";
      case "Pecho": return "text-green-600 bg-green-50";
      case "Mariposa": return "text-pink-600 bg-pink-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con botón de descarga */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600">
            Análisis detallado de volumen, intensidades y equipamiento
          </p>
        </div>
        <Button
          onClick={handleDownloadPDF}
          variant="outline"
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Descargar PDF de Ritmo
        </Button>
      </div>

      {/* Estadísticas Resumen */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Volumen Total</p>
              <p className="text-3xl font-bold text-blue-600">{(totalDistance / 1000).toFixed(1)} km</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Entrenamientos</p>
              <p className="text-3xl font-bold text-purple-600">{totalWorkouts}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Volumen Técnica</p>
              <p className="text-3xl font-bold text-green-600">{(techniqueVolume / 1000).toFixed(1)} km</p>
              <Badge className="bg-green-100 text-green-700 text-xs mt-1">
                {techniquePercentage}%
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Promedio/Sesión</p>
              <p className="text-3xl font-bold text-orange-600">
                {totalWorkouts > 0 ? Math.round(totalDistance / totalWorkouts) : 0}m
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Intensidades */}
      {intensityChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-blue-600" />
              Distribución por Intensidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Torta */}
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={intensityChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {intensityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_INTENSITY[entry.name as keyof typeof COLORS_INTENSITY]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => `${value} km`}
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Tabla de datos */}
              <div className="space-y-3">
                {intensityChartData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: COLORS_INTENSITY[item.name as keyof typeof COLORS_INTENSITY] }}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{item.percentage}%</Badge>
                      <span className="font-bold text-lg">{item.value} km</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráfico de Técnica por Estilo */}
      {techniqueStyleData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Volumen en Técnica por Estilo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Barras */}
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={techniqueStyleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" style={{ fontSize: '12px' }} />
                    <YAxis label={{ value: 'km', angle: -90, position: 'insideLeft' }} style={{ fontSize: '12px' }} />
                    <Tooltip 
                      formatter={(value: number) => `${value} km`}
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px' }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {techniqueStyleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_STYLE[entry.name as keyof typeof COLORS_STYLE]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Grid de estilos */}
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(techniqueByStyle).map(([style, volume]) => {
                  const color = getStyleColor(style);
                  const percentage = techniqueVolume > 0 
                    ? Math.round((volume / techniqueVolume) * 100) 
                    : 0;
                  
                  return (
                    <div 
                      key={style} 
                      className={`p-4 rounded-lg border-2 ${
                        volume > 0 ? 'border-current' : 'border-gray-200'
                      } ${volume > 0 ? color : 'bg-gray-50'}`}
                    >
                      <p className={`text-sm font-semibold mb-2 ${volume > 0 ? '' : 'text-gray-500'}`}>
                        {style}
                      </p>
                      <p className={`text-2xl font-bold ${volume > 0 ? color.split(' ')[0] : 'text-gray-400'}`}>
                        {(volume / 1000).toFixed(1)} km
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full transition-all ${volume > 0 ? color : ''}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      {volume > 0 && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {percentage}%
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info adicional */}
            <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Técnica</p>
                <p className="text-2xl font-bold text-purple-600">{(techniqueVolume / 1000).toFixed(1)} km</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Sesiones</p>
                <p className="text-2xl font-bold text-blue-600">{techniqueCount}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Promedio/Sesión</p>
                <p className="text-2xl font-bold text-green-600">
                  {techniqueCount > 0 ? Math.round(techniqueVolume / techniqueCount) : 0}m
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center pt-4 border-t mt-4">
              * Solo sesiones con palabras clave: técnica o drills
            </p>
          </CardContent>
        </Card>
      )}

      {/* Gráfico de Equipamiento */}
      {equipmentChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Uso de Equipamiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Gráfico de Barras Horizontal */}
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={equipmentChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" label={{ value: 'km', position: 'insideBottom' }} style={{ fontSize: '12px' }} />
                  <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '12px' }} />
                  <Tooltip 
                    formatter={(value: number) => `${value} km`}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {equipmentChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_EQUIPMENT[index % COLORS_EQUIPMENT.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Tabla de equipamiento */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2 px-3 font-semibold">Equipamiento</th>
                      <th className="text-center py-2 px-3 font-semibold">Sesiones</th>
                      <th className="text-right py-2 px-3 font-semibold">Volumen (km)</th>
                      <th className="text-right py-2 px-3 font-semibold">%</th>
                      <th className="text-right py-2 px-3 font-semibold">Promedio/Sesión</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipmentChartData.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium">{item.name}</td>
                        <td className="text-center py-2 px-3">{item.sessions}</td>
                        <td className="text-right py-2 px-3 font-bold">{item.value}</td>
                        <td className="text-right py-2 px-3">
                          <Badge variant="outline">{item.percentage}%</Badge>
                        </td>
                        <td className="text-right py-2 px-3 text-gray-600">
                          {Math.round((item.value * 1000) / item.sessions)}m
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 text-center pt-4 mt-4 border-t">
              * Estimación basada en palabras clave detectadas en las descripciones de entrenamientos
            </p>
          </CardContent>
        </Card>
      )}

      {equipmentChartData.length === 0 && techniqueStyleData.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-gray-500">
              No hay suficientes datos para mostrar gráficos detallados
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}