import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Award,
  Info,
  ChevronDown,
  ChevronUp,
  Zap
} from "lucide-react";
import type { Swimmer, PersonalBest } from "../data/swimmers";
import { calculateAge, calculateCategoryFromBirthDate } from "../utils/swimmerUtils";
import { getMinimumTimeForCategory, timeToSeconds } from "../data/minimumTimes";

interface SwimmerMinimumTimesViewProps {
  swimmer: Swimmer;
}

interface EventComparison {
  event: string;
  distance: number;
  style: string;
  personalBest: string | null;
  minimumTime: string | null;
  meetsMinimum: boolean;
  difference: number | null; // En segundos (negativo = más rápido que mínima, positivo = más lento)
  percentageToGoal: number | null; // Porcentaje de progreso hacia la marca mínima
}

export function SwimmerMinimumTimesView({ swimmer }: SwimmerMinimumTimesViewProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["cumplidas"]));
  const [selectedStyle, setSelectedStyle] = useState<string>("all");

  const category = calculateCategoryFromBirthDate(swimmer.dateOfBirth);
  const age = calculateAge(swimmer.dateOfBirth);

  // Eventos disponibles
  const allEvents = [
    { event: "50 LIBRE", distance: 50, style: "Libre" },
    { event: "100 LIBRE", distance: 100, style: "Libre" },
    { event: "200 LIBRE", distance: 200, style: "Libre" },
    { event: "400 LIBRE", distance: 400, style: "Libre" },
    { event: "800 LIBRE", distance: 800, style: "Libre" },
    { event: "1500 LIBRE", distance: 1500, style: "Libre" },
    { event: "50 ESPALDA", distance: 50, style: "Espalda" },
    { event: "100 ESPALDA", distance: 100, style: "Espalda" },
    { event: "200 ESPALDA", distance: 200, style: "Espalda" },
    { event: "50 PECHO", distance: 50, style: "Pecho" },
    { event: "100 PECHO", distance: 100, style: "Pecho" },
    { event: "200 PECHO", distance: 200, style: "Pecho" },
    { event: "50 MARIPOSA", distance: 50, style: "Mariposa" },
    { event: "100 MARIPOSA", distance: 100, style: "Mariposa" },
    { event: "200 MARIPOSA", distance: 200, style: "Mariposa" },
    { event: "200 COMBINADO", distance: 200, style: "Combinado" },
    { event: "400 COMBINADO", distance: 400, style: "Combinado" },
  ];

  // Comparar marcas personales con marcas mínimas
  const eventComparisons = useMemo(() => {
    if (!swimmer.gender || swimmer.gender === "Otro") return [];

    return allEvents.map(({ event, distance, style }) => {
      // Buscar marca personal
      const pb = swimmer.personalBests?.find(
        (pb) => pb.distance === distance && pb.style === style
      );

      // Obtener marca mínima
      const minimumTime = getMinimumTimeForCategory(
        event,
        category,
        swimmer.gender as "Masculino" | "Femenino"
      );

      let meetsMinimum = false;
      let difference: number | null = null;
      let percentageToGoal: number | null = null;

      if (pb && minimumTime && minimumTime !== "S/MM") {
        const pbSeconds = timeToSeconds(pb.time);
        const minSeconds = timeToSeconds(minimumTime);

        if (pbSeconds !== Infinity && minSeconds !== Infinity) {
          difference = pbSeconds - minSeconds; // Negativo = mejor que mínima
          meetsMinimum = pbSeconds <= minSeconds;
          
          // Calcular porcentaje (0% = sin tiempo, 100% = cumplió marca mínima)
          if (pbSeconds > 0) {
            percentageToGoal = Math.min(100, (minSeconds / pbSeconds) * 100);
          }
        }
      }

      return {
        event,
        distance,
        style,
        personalBest: pb?.time || null,
        minimumTime: minimumTime === "S/MM" ? null : minimumTime,
        meetsMinimum,
        difference,
        percentageToGoal,
      };
    });
  }, [swimmer, category]);

  // Filtrar por estilo
  const filteredEvents = useMemo(() => {
    if (selectedStyle === "all") return eventComparisons;
    return eventComparisons.filter(e => e.style === selectedStyle);
  }, [eventComparisons, selectedStyle]);

  // Agrupar eventos
  const eventsMetMinimum = filteredEvents.filter(e => e.meetsMinimum && e.minimumTime);
  const eventsWithMinimumNotMet = filteredEvents.filter(
    e => e.minimumTime && !e.meetsMinimum && e.personalBest
  );
  const eventsWithoutTime = filteredEvents.filter(
    e => e.minimumTime && !e.personalBest
  );
  const eventsWithoutMinimum = filteredEvents.filter(e => !e.minimumTime);

  // Calcular estadísticas
  const totalEventsWithMinimum = eventComparisons.filter(e => e.minimumTime).length;
  const totalMet = eventComparisons.filter(e => e.meetsMinimum && e.minimumTime).length;
  const completionPercentage = totalEventsWithMinimum > 0 
    ? Math.round((totalMet / totalEventsWithMinimum) * 100) 
    : 0;

  const formatTime = (time: string) => {
    return time.replace(/,/g, ".").replace(/:/g, ":");
  };

  const formatDifference = (seconds: number) => {
    const absSeconds = Math.abs(seconds);
    const sign = seconds < 0 ? "-" : "+";
    
    if (absSeconds >= 60) {
      const minutes = Math.floor(absSeconds / 60);
      const remainingSeconds = absSeconds % 60;
      return `${sign}${minutes}:${remainingSeconds.toFixed(2).padStart(5, '0')}`;
    }
    
    return `${sign}${absSeconds.toFixed(2)}s`;
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const styles = ["Libre", "Espalda", "Pecho", "Mariposa", "Combinado"];

  return (
    <div className="space-y-6">
      {/* Header con información del nadador */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Target className="w-7 h-7 text-blue-600" />
                Marcas Mínimas para {swimmer.name}
              </CardTitle>
              <div className="flex flex-wrap gap-3 mt-3">
                <Badge className="bg-blue-600 text-white">
                  {category}
                </Badge>
                <Badge variant="outline" className="border-blue-300">
                  {age} años
                </Badge>
                <Badge variant="outline" className="border-blue-300">
                  {swimmer.gender}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-600">{completionPercentage}%</div>
              <div className="text-sm text-gray-600">Cumplimiento</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Resumen visual */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-green-600">{eventsMetMinimum.length}</div>
            <div className="text-sm text-gray-600">Cumplidas</div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-yellow-600">{eventsWithMinimumNotMet.length}</div>
            <div className="text-sm text-gray-600">Por Mejorar</div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6 text-center">
            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-orange-600">{eventsWithoutTime.length}</div>
            <div className="text-sm text-gray-600">Sin Tiempo</div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="pt-6 text-center">
            <Info className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-600">{eventsWithoutMinimum.length}</div>
            <div className="text-sm text-gray-600">Sin Marca Mín.</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtro por estilo */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-gray-800">Filtrar por Estilo</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedStyle === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStyle("all")}
              className={selectedStyle === "all" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              Todos los Estilos
            </Button>
            {styles.map(style => (
              <Button
                key={style}
                variant={selectedStyle === style ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStyle(style)}
                className={selectedStyle === style ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {style}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Marcas Cumplidas */}
      {eventsMetMinimum.length > 0 && (
        <Card className="border-green-200">
          <CardHeader 
            className="cursor-pointer hover:bg-green-50 transition-colors"
            onClick={() => toggleSection("cumplidas")}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Marcas Cumplidas ({eventsMetMinimum.length})
              </CardTitle>
              {expandedSections.has("cumplidas") ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </CardHeader>
          {expandedSections.has("cumplidas") && (
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Prueba</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Tu Marca</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Marca Mínima</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Diferencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventsMetMinimum.map((event) => (
                      <tr key={event.event} className="border-b hover:bg-green-50">
                        <td className="px-4 py-3 font-medium">{event.event}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge className="bg-green-600 text-white">
                            {formatTime(event.personalBest!)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600">
                          {formatTime(event.minimumTime!)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-green-600 font-semibold">
                            {formatDifference(event.difference!)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Marcas Por Mejorar */}
      {eventsWithMinimumNotMet.length > 0 && (
        <Card className="border-yellow-200">
          <CardHeader 
            className="cursor-pointer hover:bg-yellow-50 transition-colors"
            onClick={() => toggleSection("por-mejorar")}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
                Por Mejorar ({eventsWithMinimumNotMet.length})
              </CardTitle>
              {expandedSections.has("por-mejorar") ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </CardHeader>
          {expandedSections.has("por-mejorar") && (
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Prueba</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Tu Marca</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Marca Mínima</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Diferencia</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Progreso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventsWithMinimumNotMet.map((event) => (
                      <tr key={event.event} className="border-b hover:bg-yellow-50">
                        <td className="px-4 py-3 font-medium">{event.event}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant="outline" className="border-gray-300">
                            {formatTime(event.personalBest!)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge className="bg-yellow-600 text-white">
                            {formatTime(event.minimumTime!)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-red-600 font-semibold">
                            {formatDifference(event.difference!)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-500 h-2 rounded-full transition-all"
                                style={{ width: `${event.percentageToGoal}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 min-w-[45px]">
                              {event.percentageToGoal?.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Sin Tiempo Registrado */}
      {eventsWithoutTime.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader 
            className="cursor-pointer hover:bg-orange-50 transition-colors"
            onClick={() => toggleSection("sin-tiempo")}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                Sin Tiempo Registrado ({eventsWithoutTime.length})
              </CardTitle>
              {expandedSections.has("sin-tiempo") ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </CardHeader>
          {expandedSections.has("sin-tiempo") && (
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Prueba</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Marca Mínima</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventsWithoutTime.map((event) => (
                      <tr key={event.event} className="border-b hover:bg-orange-50">
                        <td className="px-4 py-3 font-medium">{event.event}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge className="bg-orange-600 text-white">
                            {formatTime(event.minimumTime!)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-orange-600 text-sm">
                            ⚠️ Registra tu primera marca en esta prueba
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Mensaje motivacional */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Award className="w-12 h-12 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-2">¡Sigue trabajando!</h3>
              <p className="text-blue-100">
                {completionPercentage === 100 
                  ? "¡Felicitaciones! Has cumplido todas las marcas mínimas de tu categoría. Ahora es momento de superarte aún más."
                  : `Has cumplido ${totalMet} de ${totalEventsWithMinimum} marcas mínimas. ${eventsWithMinimumNotMet.length > 0 ? `Enfócate en mejorar las ${eventsWithMinimumNotMet.length} pruebas restantes.` : ""}`
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
