import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Minus, Zap, Activity, BarChart3, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { useState } from "react";
import type { Workout } from "../data/workouts";

interface VolumeTrendSyncProps {
  workouts: Workout[];
  onSyncVolumes?: (suggestions: BloqueSuggestion[]) => void;
}

interface BloqueSuggestion {
  bloqueName: string;
  currentVolume: number;
  suggestedVolume: number;
  change: number;
  trend: "increase" | "maintain" | "decrease";
  sessions: number;
  description: string;
  phase: string;
}

// Definición de los 10 bloques con características de volumen
const bloqueConfig = [
  { 
    name: "Bloque 1", 
    volumeMultiplier: 1.0, 
    description: "Base - Volumen inicial",
    phase: "Base"
  },
  { 
    name: "Bloque 2", 
    volumeMultiplier: 1.15, 
    description: "Incremento gradual",
    phase: "Base"
  },
  { 
    name: "Bloque 3", 
    volumeMultiplier: 1.25, 
    description: "Acumulación de volumen",
    phase: "Build"
  },
  { 
    name: "Bloque 4", 
    volumeMultiplier: 1.30, 
    description: "Pico de volumen pre-competencia",
    phase: "Build"
  },
  { 
    name: "Bloque 5", 
    volumeMultiplier: 1.20, 
    description: "Volumen competitivo",
    phase: "Peak"
  },
  { 
    name: "Bloque 6", 
    volumeMultiplier: 1.10, 
    description: "Recuperación activa",
    phase: "Recovery"
  },
  { 
    name: "Bloque 7", 
    volumeMultiplier: 1.18, 
    description: "Segundo ciclo - Incremento",
    phase: "Build"
  },
  { 
    name: "Bloque 8", 
    volumeMultiplier: 1.28, 
    description: "Acumulación competitiva",
    phase: "Build"
  },
  { 
    name: "Bloque 9", 
    volumeMultiplier: 1.35, 
    description: "Máximo volumen anual",
    phase: "Build"
  },
  { 
    name: "Bloque 10", 
    volumeMultiplier: 1.15, 
    description: "Taper - Reducción para pico",
    phase: "Peak"
  },
];

export function VolumeTrendSync({ workouts, onSyncVolumes }: VolumeTrendSyncProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Calcular volumen actual por bloque
  const getBloqueVolume = (bloqueName: string) => {
    const bloqueWorkouts = workouts.filter(w => w.bloque === bloqueName && !w.deleted);
    const totalDistance = bloqueWorkouts.reduce((sum, w) => sum + w.distance, 0);
    const avgDistance = bloqueWorkouts.length > 0 ? totalDistance / bloqueWorkouts.length : 0;
    return {
      total: totalDistance,
      average: avgDistance,
      sessions: bloqueWorkouts.length,
    };
  };

  // Calcular volumen base (promedio del Bloque 1)
  const bloque1Data = getBloqueVolume("Bloque 1");
  const baseVolume = bloque1Data.average || 3000; // Default 3000m si no hay datos

  // Generar sugerencias para todos los bloques
  const suggestions: BloqueSuggestion[] = bloqueConfig.map((config, index) => {
    const currentData = getBloqueVolume(config.name);
    const suggestedAvgVolume = Math.round(baseVolume * config.volumeMultiplier);
    const currentAvgVolume = Math.round(currentData.average);
    const change = suggestedAvgVolume - currentAvgVolume;
    const changePercent = currentAvgVolume > 0 ? ((change / currentAvgVolume) * 100) : 0;

    let trend: "increase" | "maintain" | "decrease";
    if (changePercent > 5) trend = "increase";
    else if (changePercent < -5) trend = "decrease";
    else trend = "maintain";

    return {
      bloqueName: config.name,
      currentVolume: currentAvgVolume,
      suggestedVolume: suggestedAvgVolume,
      change: change,
      trend: trend,
      sessions: currentData.sessions,
      description: config.description,
      phase: config.phase,
    };
  });

  // Estadísticas generales
  const totalSuggestions = suggestions.length;
  const needsIncrease = suggestions.filter(s => s.trend === "increase").length;
  const needsDecrease = suggestions.filter(s => s.trend === "decrease").length;
  const isOnTrack = suggestions.filter(s => s.trend === "maintain").length;

  const getTrendIcon = (trend: string) => {
    if (trend === "increase") return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === "decrease") return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === "increase") return "text-green-600 bg-green-50 border-green-200";
    if (trend === "decrease") return "text-red-600 bg-red-50 border-red-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  const getPhaseIcon = (phase: string) => {
    switch(phase) {
      case "Base": return "🏗️";
      case "Build": return "📈";
      case "Peak": return "⚡";
      case "Recovery": return "🔄";
      default: return "📊";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <CardTitle>Sincronización de Tendencia de Volumen</CardTitle>
          </div>
          <Badge className="bg-blue-100 text-blue-700">
            Basado en Bloque 1: {Math.round(baseVolume)}m/sesión
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Ajuste automático de volúmenes según periodización de 10 bloques
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumen de Ajustes */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-4">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{totalSuggestions}</p>
                <p className="text-xs text-gray-600">Total Bloques</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-4">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{needsIncrease}</p>
                <p className="text-xs text-gray-600">Incrementar</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-4">
              <div className="text-center">
                <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">{needsDecrease}</p>
                <p className="text-xs text-gray-600">Reducir</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="pt-4">
              <div className="text-center">
                <Zap className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-600">{isOnTrack}</p>
                <p className="text-xs text-gray-600">En Objetivo</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerta informativa */}
        {bloque1Data.sessions === 0 && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <AlertDescription className="text-sm text-orange-800">
              No hay entrenamientos en Bloque 1. El volumen base está configurado en 3000m por defecto.
              Crea entrenamientos en Bloque 1 para calcular una base personalizada.
            </AlertDescription>
          </Alert>
        )}

        {/* Tabla de Sugerencias */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-3 font-semibold">Bloque</th>
                <th className="text-center py-3 px-3 font-semibold">Fase</th>
                <th className="text-center py-3 px-3 font-semibold">Sesiones</th>
                <th className="text-right py-3 px-3 font-semibold">Vol. Actual</th>
                <th className="text-right py-3 px-3 font-semibold">Vol. Sugerido</th>
                <th className="text-center py-3 px-3 font-semibold">Diferencia</th>
                <th className="text-center py-3 px-3 font-semibold">Tendencia</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.map((suggestion, idx) => {
                const config = bloqueConfig[idx];
                const changePercent = suggestion.currentVolume > 0 
                  ? Math.round((suggestion.change / suggestion.currentVolume) * 100)
                  : 0;
                
                return (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-3">
                      <div>
                        <p className="font-semibold">{suggestion.bloqueName}</p>
                        <p className="text-xs text-gray-500">{config.description}</p>
                      </div>
                    </td>
                    <td className="text-center py-3 px-3">
                      <Badge variant="outline" className="text-xs">
                        {getPhaseIcon(config.phase)} {config.phase}
                      </Badge>
                    </td>
                    <td className="text-center py-3 px-3">
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.sessions}
                      </Badge>
                    </td>
                    <td className="text-right py-3 px-3 font-medium">
                      {suggestion.currentVolume > 0 ? `${suggestion.currentVolume}m` : "-"}
                    </td>
                    <td className="text-right py-3 px-3 font-bold text-blue-600">
                      {suggestion.suggestedVolume}m
                    </td>
                    <td className="text-center py-3 px-3">
                      {suggestion.currentVolume > 0 && (
                        <div className="flex flex-col items-center gap-1">
                          <span className={`font-semibold ${
                            suggestion.change > 0 ? "text-green-600" : 
                            suggestion.change < 0 ? "text-red-600" : 
                            "text-gray-600"
                          }`}>
                            {suggestion.change > 0 ? "+" : ""}{suggestion.change}m
                          </span>
                          <span className="text-xs text-gray-500">
                            ({changePercent > 0 ? "+" : ""}{changePercent}%)
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="text-center py-3 px-3">
                      <Badge className={getTrendColor(suggestion.trend)}>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(suggestion.trend)}
                          <span className="text-xs capitalize">{suggestion.trend === "increase" ? "Subir" : suggestion.trend === "decrease" ? "Bajar" : "Mantener"}</span>
                        </div>
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Gráfico de Tendencia Visual */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base">Progresión de Volumen Sugerida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-32">
              {suggestions.map((s, idx) => {
                const maxVolume = Math.max(...suggestions.map(s => s.suggestedVolume));
                const heightPercent = (s.suggestedVolume / maxVolume) * 100;
                const config = bloqueConfig[idx];
                
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-xs font-semibold text-gray-700">
                      {Math.round(s.suggestedVolume / 1000)}k
                    </div>
                    <div
                      className={`w-full rounded-t transition-all hover:opacity-80 ${
                        config.phase === "Base" ? "bg-blue-400" :
                        config.phase === "Build" ? "bg-green-400" :
                        config.phase === "Peak" ? "bg-orange-400" :
                        "bg-purple-400"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                      title={`${s.bloqueName}: ${s.suggestedVolume}m`}
                    />
                    <div className="text-xs text-gray-500 font-medium">
                      B{idx + 1}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-400 rounded" />
                <span>Base</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-400 rounded" />
                <span>Build</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-400 rounded" />
                <span>Peak</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-400 rounded" />
                <span>Recovery</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botón de acción */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-700">Cómo usar estas sugerencias:</p>
              <p className="text-xs text-gray-600 mt-1">
                Al crear entrenamientos, usa los volúmenes sugeridos para cada bloque. La tendencia se calcula automáticamente basándose en el promedio del Bloque 1 y aplicando multiplicadores de periodización deportiva.
              </p>
            </div>
          </div>
          {onSyncVolumes && (
            <Button 
              onClick={() => onSyncVolumes(suggestions as any)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Activity className="w-4 h-4 mr-2" />
              Aplicar Sugerencias
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}