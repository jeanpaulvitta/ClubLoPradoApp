import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Target, TrendingUp, CalendarDays, Trophy, Users, BarChart3, Calendar, Award } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import type { Workout } from "../data/workouts";

interface GroupBloqueManagerProps {
  workouts: Workout[];
}

// Definición de los 10 bloques de la temporada 2026-2027
const bloques = [
  {
    name: "Bloque 1",
    shortName: "Bloque 1",
    weeks: 6,
    dateRange: "9 Feb - 22 Mar 2026",
    description: "Velocidad",
    competition: "Copa Chile 1 - 50m",
    icon: Target,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    name: "Bloque 2",
    shortName: "Bloque 2",
    weeks: 4,
    dateRange: "23 Mar - 19 Abr 2026",
    description: "Fondo",
    competition: "Copa Chile 2 - 800-1500m",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    name: "Bloque 3",
    shortName: "Bloque 3",
    weeks: 4,
    dateRange: "20 Abr - 17 May 2026",
    description: "Medio Fondo",
    competition: "Copa Chile 3 - 100-400m",
    icon: CalendarDays,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    name: "Bloque 4",
    shortName: "Bloque 4",
    weeks: 6,
    dateRange: "18 May - 5 Jul 2026",
    description: "Competitivo Mayor",
    competition: "Nacionales Jun-Jul",
    icon: Trophy,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  {
    name: "Bloque 5",
    shortName: "Bloque 5",
    weeks: 6,
    dateRange: "6 Jul - 16 Ago 2026",
    description: "Internacional",
    competition: "Brasil + Nac. Desarrollo",
    icon: Target,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    name: "Bloque 6",
    shortName: "Bloque 6",
    weeks: 4,
    dateRange: "17 Ago - 13 Sep 2026",
    description: "Velocidad 2",
    competition: "Copa Chile 1 - Velocidad",
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    name: "Bloque 7",
    shortName: "Bloque 7",
    weeks: 4,
    dateRange: "14 Sep - 4 Oct 2026",
    description: "Fondo 2",
    competition: "Copa Chile 2 - Fondo",
    icon: CalendarDays,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    name: "Bloque 8",
    shortName: "Bloque 8",
    weeks: 5,
    dateRange: "5 Oct - 8 Nov 2026",
    description: "Medio Fondo 2",
    competition: "Copa Chile 3 - Medio Fondo",
    icon: Trophy,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    name: "Bloque 9",
    shortName: "Bloque 9",
    weeks: 9,
    dateRange: "9 Nov 2026 - 9 Ene 2027",
    description: "Preparación",
    competition: "Prep. Campeonatos",
    icon: Target,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    name: "Bloque 10",
    shortName: "Bloque 10",
    weeks: 4,
    dateRange: "10 Ene - 7 Feb 2027",
    description: "Pico Competitivo",
    competition: "Nacionales Verano",
    icon: Trophy,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
];

export function GroupBloqueManager({ workouts }: GroupBloqueManagerProps) {
  // Calcular estadísticas por grupo y bloque
  const getStatsForGroupAndBloque = (group: 1 | 2 | "Ambos", bloqueName: string) => {
    const filteredWorkouts = workouts.filter(w => {
      if (!w.deleted) {
        const matchesBloque = w.bloque === bloqueName;
        const matchesGroup = w.group === group || w.group === "Ambos";
        return matchesBloque && matchesGroup;
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

  const renderBloqueCard = (bloque: typeof bloques[0], group: 1 | 2) => {
    const stats = getStatsForGroupAndBloque(group, bloque.name);
    const Icon = bloque.icon;

    return (
      <Card key={`${group}-${bloque.name}`} className={`${bloque.borderColor} border-l-4 hover:shadow-lg transition-all`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${bloque.color}`} />
            <div className="flex-1">
              <CardTitle className="text-sm font-bold">{bloque.shortName}</CardTitle>
              <p className="text-xs text-gray-500">{bloque.dateRange}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Descripción del bloque */}
          <div className={`${bloque.bgColor} rounded-lg p-2`}>
            <p className="text-xs font-semibold text-gray-700">{bloque.description}</p>
            <p className="text-xs text-gray-600 mt-1">
              <Award className="w-3 h-3 inline mr-1" />
              {bloque.competition}
            </p>
          </div>

          {/* Estadísticas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Entrenamientos:</span>
              <Badge variant="secondary" className="text-xs">{stats.count}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Semanas prog:</span>
              <Badge variant="secondary" className="text-xs">{stats.weeks}/{bloque.weeks}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Distancia total:</span>
              <Badge className="bg-blue-100 text-blue-700 text-xs">
                {(stats.totalDistance / 1000).toFixed(1)} km
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Promedio/sesión:</span>
              <Badge className="bg-purple-100 text-purple-700 text-xs">
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
    
    // Contar entrenamientos por bloque
    const byBloque: Record<string, number> = {};
    bloques.forEach(bloque => {
      byBloque[bloque.shortName] = groupWorkouts.filter(w => w.bloque === bloque.name).length;
    });

    return {
      total: groupWorkouts.length,
      totalDistance: groupWorkouts.reduce((sum, w) => sum + w.distance, 0),
      avgDistance: groupWorkouts.length > 0 
        ? Math.round(groupWorkouts.reduce((sum, w) => sum + w.distance, 0) / groupWorkouts.length)
        : 0,
      byBloque,
    };
  };

  const group1Stats = getGroupStats(1);
  const group2Stats = getGroupStats(2);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-red-600" />
          <CardTitle>Resumen de Entrenamientos por Bloques</CardTitle>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Estructura de 10 bloques - Temporada 2026-2027 (52 semanas)
        </p>
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
                    <p className="text-3xl font-bold text-orange-600">10 bloques</p>
                  </div>
                </div>

                {/* Distribución por bloques */}
                <div className="mt-6 pt-4 border-t border-purple-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Entrenamientos por Bloque:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {bloques.map((bloque, idx) => (
                      <Badge 
                        key={idx}
                        className={`${bloque.bgColor} ${bloque.color} justify-center border ${bloque.borderColor}`}
                        variant="outline"
                      >
                        B{idx + 1}: {group1Stats.byBloque[bloque.shortName] || 0}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cards de bloques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {bloques.map(bloque => renderBloqueCard(bloque, 1))}
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
                    <p className="text-3xl font-bold text-orange-600">10 bloques</p>
                  </div>
                </div>

                {/* Distribución por bloques */}
                <div className="mt-6 pt-4 border-t border-green-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Entrenamientos por Bloque:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {bloques.map((bloque, idx) => (
                      <Badge 
                        key={idx}
                        className={`${bloque.bgColor} ${bloque.color} justify-center border ${bloque.borderColor}`}
                        variant="outline"
                      >
                        B{idx + 1}: {group2Stats.byBloque[bloque.shortName] || 0}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cards de bloques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {bloques.map(bloque => renderBloqueCard(bloque, 2))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
