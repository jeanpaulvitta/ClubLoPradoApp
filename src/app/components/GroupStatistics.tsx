import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users, Waves, TrendingUp, Activity, Target } from "lucide-react";
import type { Swimmer } from "../data/swimmers";
import { getTrainingGroupFromBirthDate } from "../utils/swimmerUtils";

interface GroupStatisticsProps {
  swimmers: Swimmer[];
  workouts: any[]; // Workouts con el campo group
}

export function GroupStatistics({ swimmers, workouts }: GroupStatisticsProps) {
  // Calcular estadísticas por grupo
  const groupStats = useMemo(() => {
    const grupo1Swimmers = swimmers.filter(s => 
      s.dateOfBirth && getTrainingGroupFromBirthDate(s.dateOfBirth) === 1
    );
    const grupo2Swimmers = swimmers.filter(s => 
      s.dateOfBirth && getTrainingGroupFromBirthDate(s.dateOfBirth) === 2
    );

    // Workouts por grupo
    const grupo1Workouts = workouts.filter(w => w.group === 1 || w.group === "Ambos");
    const grupo2Workouts = workouts.filter(w => w.group === 2 || w.group === "Ambos");

    // Distancia total por grupo
    const grupo1Distance = grupo1Workouts.reduce((sum, w) => sum + (w.distance || 0), 0);
    const grupo2Distance = grupo2Workouts.reduce((sum, w) => sum + (w.distance || 0), 0);

    // Distancia promedio por sesión
    const grupo1AvgDistance = grupo1Workouts.length > 0 ? grupo1Distance / grupo1Workouts.length : 0;
    const grupo2AvgDistance = grupo2Workouts.length > 0 ? grupo2Distance / grupo2Workouts.length : 0;

    return {
      grupo1: {
        swimmers: grupo1Swimmers.length,
        workouts: grupo1Workouts.length,
        totalDistance: grupo1Distance,
        avgDistance: Math.round(grupo1AvgDistance),
        categories: ["Inf E", "Inf D", "Inf C", "Inf A"]
      },
      grupo2: {
        swimmers: grupo2Swimmers.length,
        workouts: grupo2Workouts.length,
        totalDistance: grupo2Distance,
        avgDistance: Math.round(grupo2AvgDistance),
        categories: ["Inf B1", "Inf B2", "Juv A1", "Juv A2", "Juv B1", "Juv B2", "Juv B3", "Mayores"]
      }
    };
  }, [swimmers, workouts]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Users className="w-6 h-6 text-red-600" />
          Estadísticas por Grupo de Entrenamiento
        </h2>
        <p className="text-gray-600">
          Análisis comparativo de entrenamientos y nadadores por grupo
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Grupo 1 */}
        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">👶</span>
              <span>Grupo 1: Menores hasta Inf A</span>
            </CardTitle>
            <div className="flex flex-wrap gap-1 mt-2">
              {groupStats.grupo1.categories.map(cat => (
                <Badge key={cat} variant="outline" className="border-purple-400 text-purple-700 text-xs">
                  {cat}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-600">Nadadores</span>
                </div>
                <p className="text-3xl font-bold text-purple-700">
                  {groupStats.grupo1.swimmers}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-600">Entrenamientos</span>
                </div>
                <p className="text-3xl font-bold text-purple-700">
                  {groupStats.grupo1.workouts}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Waves className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-600">Distancia Total</span>
                </div>
                <p className="text-2xl font-bold text-purple-700">
                  {(groupStats.grupo1.totalDistance / 1000).toFixed(1)}km
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-600">Promedio/Sesión</span>
                </div>
                <p className="text-2xl font-bold text-purple-700">
                  {groupStats.grupo1.avgDistance}m
                </p>
              </div>
            </div>

            <div className="bg-purple-100 p-3 rounded-lg border border-purple-300">
              <p className="text-sm text-purple-800">
                <strong>Enfoque:</strong> Desarrollo de técnica básica y adaptación al entrenamiento estructurado
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Grupo 2 */}
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🏅</span>
              <span>Grupo 2: Inf B hasta Mayores</span>
            </CardTitle>
            <div className="flex flex-wrap gap-1 mt-2">
              {groupStats.grupo2.categories.map(cat => (
                <Badge key={cat} variant="outline" className="border-green-400 text-green-700 text-xs">
                  {cat}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Nadadores</span>
                </div>
                <p className="text-3xl font-bold text-green-700">
                  {groupStats.grupo2.swimmers}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Entrenamientos</span>
                </div>
                <p className="text-3xl font-bold text-green-700">
                  {groupStats.grupo2.workouts}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Waves className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Distancia Total</span>
                </div>
                <p className="text-2xl font-bold text-green-700">
                  {(groupStats.grupo2.totalDistance / 1000).toFixed(1)}km
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Promedio/Sesión</span>
                </div>
                <p className="text-2xl font-bold text-green-700">
                  {groupStats.grupo2.avgDistance}m
                </p>
              </div>
            </div>

            <div className="bg-green-100 p-3 rounded-lg border border-green-300">
              <p className="text-sm text-green-800">
                <strong>Enfoque:</strong> Perfeccionamiento técnico, desarrollo de resistencia y preparación competitiva avanzada
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Comparación entre Grupos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Diferencia de Distancia Promedio</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.abs(groupStats.grupo2.avgDistance - groupStats.grupo1.avgDistance)}m
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {groupStats.grupo2.avgDistance > groupStats.grupo1.avgDistance 
                  ? "Grupo 2 entrena más intenso" 
                  : "Grupos equilibrados"}
              </p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Total Nadadores</p>
              <p className="text-2xl font-bold text-blue-600">
                {groupStats.grupo1.swimmers + groupStats.grupo2.swimmers}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                G1: {groupStats.grupo1.swimmers} | G2: {groupStats.grupo2.swimmers}
              </p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Total Entrenamientos</p>
              <p className="text-2xl font-bold text-blue-600">
                {groupStats.grupo1.workouts + groupStats.grupo2.workouts}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                G1: {groupStats.grupo1.workouts} | G2: {groupStats.grupo2.workouts}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
