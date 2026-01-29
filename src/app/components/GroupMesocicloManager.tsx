import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Target, TrendingUp, CalendarDays, Trophy, Users, BarChart3 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import type { Workout } from "../data/workouts";

interface GroupMesocicloManagerProps {
  workouts: Workout[];
}

const mesociclos = [
  { name: "Base", icon: Target, color: "text-blue-600" },
  { name: "Desarrollo", icon: TrendingUp, color: "text-purple-600" },
  { name: "Pre-competitivo", icon: CalendarDays, color: "text-orange-600" },
  { name: "Competitivo", icon: Trophy, color: "text-red-600" },
];

export function GroupMesocicloManager({ workouts }: GroupMesocicloManagerProps) {
  // Calcular estadísticas por grupo y mesociclo
  const getStatsForGroupAndMesociclo = (group: 1 | 2 | "Ambos", mesociclo: string) => {
    const filteredWorkouts = workouts.filter(w => {
      if (!w.deleted) {
        const matchesMesociclo = w.mesociclo === mesociclo;
        const matchesGroup = w.group === group || w.group === "Ambos";
        return matchesMesociclo && matchesGroup;
      }
      return false;
    });

    return {
      count: filteredWorkouts.length,
      totalDistance: filteredWorkouts.reduce((sum, w) => sum + w.distance, 0),
      avgDistance: filteredWorkouts.length > 0 
        ? Math.round(filteredWorkouts.reduce((sum, w) => sum + w.distance, 0) / filteredWorkouts.length)
        : 0,
      weeks: [...new Set(filteredWorkouts.map(w => w.week))].length,
    };
  };

  const renderMesocicloCard = (mesociclo: typeof mesociclos[0], group: 1 | 2) => {
    const stats = getStatsForGroupAndMesociclo(group, mesociclo.name);
    const Icon = mesociclo.icon;

    return (
      <Card key={`${group}-${mesociclo.name}`} className="hover:shadow-lg transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${mesociclo.color}`} />
            <CardTitle className="text-lg">{mesociclo.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Entrenamientos:</span>
              <Badge variant="secondary">{stats.count}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Semanas cubiertas:</span>
              <Badge variant="secondary">{stats.weeks}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Distancia total:</span>
              <Badge className="bg-blue-100 text-blue-700">
                {(stats.totalDistance / 1000).toFixed(1)} km
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Promedio/sesión:</span>
              <Badge className="bg-purple-100 text-purple-700">
                {stats.avgDistance}m
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Estadísticas generales por grupo
  const getGroupStats = (group: 1 | 2) => {
    const groupWorkouts = workouts.filter(w => 
      !w.deleted && (w.group === group || w.group === "Ambos")
    );
    
    return {
      total: groupWorkouts.length,
      totalDistance: groupWorkouts.reduce((sum, w) => sum + w.distance, 0),
      avgDistance: groupWorkouts.length > 0 
        ? Math.round(groupWorkouts.reduce((sum, w) => sum + w.distance, 0) / groupWorkouts.length)
        : 0,
      byMesociclo: {
        Base: groupWorkouts.filter(w => w.mesociclo === "Base").length,
        Desarrollo: groupWorkouts.filter(w => w.mesociclo === "Desarrollo").length,
        "Pre-competitivo": groupWorkouts.filter(w => w.mesociclo === "Pre-competitivo").length,
        Competitivo: groupWorkouts.filter(w => w.mesociclo === "Competitivo").length,
      },
    };
  };

  const group1Stats = getGroupStats(1);
  const group2Stats = getGroupStats(2);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-red-600" />
          <CardTitle>Resumen de Entrenamientos por Grupo y Mesociclo</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="group1" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="group1" className="gap-2">
              <Users className="w-4 h-4" />
              Grupo 1: Menores hasta Inf A
            </TabsTrigger>
            <TabsTrigger value="group2" className="gap-2">
              <Users className="w-4 h-4" />
              Grupo 2: Inf B hasta Mayores
            </TabsTrigger>
          </TabsList>

          {/* Grupo 1 */}
          <TabsContent value="group1" className="space-y-6">
            {/* Estadísticas generales */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Total Entrenamientos</p>
                    <p className="text-3xl font-bold text-purple-600">{group1Stats.total}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Distancia Total</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {(group1Stats.totalDistance / 1000).toFixed(1)} km
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Promedio/Sesión</p>
                    <p className="text-3xl font-bold text-green-600">{group1Stats.avgDistance}m</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Estructura</p>
                    <p className="text-3xl font-bold text-orange-600">20 sem</p>
                  </div>
                </div>

                {/* Distribución por mesociclo */}
                <div className="mt-6 pt-4 border-t border-purple-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Distribución por Mesociclo:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Badge className="bg-blue-100 text-blue-700 justify-center">
                      Base: {group1Stats.byMesociclo.Base}
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-700 justify-center">
                      Desarrollo: {group1Stats.byMesociclo.Desarrollo}
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-700 justify-center">
                      Pre-comp: {group1Stats.byMesociclo["Pre-competitivo"]}
                    </Badge>
                    <Badge className="bg-red-100 text-red-700 justify-center">
                      Competitivo: {group1Stats.byMesociclo.Competitivo}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cards de mesociclos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mesociclos.map(mesociclo => renderMesocicloCard(mesociclo, 1))}
            </div>
          </TabsContent>

          {/* Grupo 2 */}
          <TabsContent value="group2" className="space-y-6">
            {/* Estadísticas generales */}
            <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Total Entrenamientos</p>
                    <p className="text-3xl font-bold text-green-600">{group2Stats.total}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Distancia Total</p>
                    <p className="text-3xl font-bold text-teal-600">
                      {(group2Stats.totalDistance / 1000).toFixed(1)} km
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Promedio/Sesión</p>
                    <p className="text-3xl font-bold text-blue-600">{group2Stats.avgDistance}m</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Estructura</p>
                    <p className="text-3xl font-bold text-orange-600">20 sem</p>
                  </div>
                </div>

                {/* Distribución por mesociclo */}
                <div className="mt-6 pt-4 border-t border-green-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Distribución por Mesociclo:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Badge className="bg-blue-100 text-blue-700 justify-center">
                      Base: {group2Stats.byMesociclo.Base}
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-700 justify-center">
                      Desarrollo: {group2Stats.byMesociclo.Desarrollo}
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-700 justify-center">
                      Pre-comp: {group2Stats.byMesociclo["Pre-competitivo"]}
                    </Badge>
                    <Badge className="bg-red-100 text-red-700 justify-center">
                      Competitivo: {group2Stats.byMesociclo.Competitivo}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cards de mesociclos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mesociclos.map(mesociclo => renderMesocicloCard(mesociclo, 2))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}