import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CheckCircle2, XCircle, Clock, Users, Filter, ChevronRight, Table as TableIcon } from "lucide-react";
import type { Swimmer, PersonalBest } from "../data/swimmers";
import { calculateAge, calculateCategoryFromBirthDate } from "../utils/swimmerUtils";
import { getMinimumTimeForCategory, timeToSeconds, minimumTimesByCategory } from "../data/minimumTimes";

interface MinimumTimesCheckerProps {
  swimmers: Swimmer[];
}

interface SwimmerStatus {
  swimmer: Swimmer;
  category: string;
  age: number;
  events: EventStatus[];
}

interface EventStatus {
  event: string;
  personalBest: string | null;
  minimumTime: string | null;
  meetsMinimum: boolean | null;
  difference: number | null;
}

export function MinimumTimesChecker({ swimmers }: MinimumTimesCheckerProps) {
  const [filterGender, setFilterGender] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedSwimmer, setSelectedSwimmer] = useState<SwimmerStatus | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Función para convertir evento a distance y style
  const parseEvent = (event: string): { distance: number; style: string } | null => {
    const parts = event.split(" ");
    if (parts.length < 2) return null;
    
    const distance = parseInt(parts[0]);
    const style = parts.slice(1).join(" ");
    
    // Mapear nombres de estilos
    const styleMap: Record<string, string> = {
      "LIBRE": "Libre",
      "ESPALDA": "Espalda",
      "PECHO": "Pecho",
      "MARIPOSA": "Mariposa",
      "COMBINADO": "Combinado"
    };
    
    return {
      distance,
      style: styleMap[style] || style
    };
  };

  // Función para formatear diferencia de tiempo
  const formatTimeDifference = (seconds: number): string => {
    const absSeconds = Math.abs(seconds);
    
    if (absSeconds >= 60) {
      const minutes = Math.floor(absSeconds / 60);
      const remainingSeconds = absSeconds % 60;
      return `${minutes}:${remainingSeconds.toFixed(2).padStart(5, '0')}`;
    }
    
    return `${absSeconds.toFixed(2)}s`;
  };

  // Eventos disponibles
  const events = [
    "50 LIBRE",
    "100 LIBRE",
    "200 LIBRE",
    "400 LIBRE",
    "800 LIBRE",
    "1500 LIBRE",
    "50 ESPALDA",
    "100 ESPALDA",
    "200 ESPALDA",
    "50 PECHO",
    "100 PECHO",
    "200 PECHO",
    "50 MARIPOSA",
    "100 MARIPOSA",
    "200 MARIPOSA",
    "200 COMBINADO",
    "400 COMBINADO",
  ];

  // Procesar nadadores
  const swimmersStatus = useMemo(() => {
    return swimmers
      .filter(swimmer => swimmer.gender && swimmer.gender !== "Otro")
      .map(swimmer => {
        const age = calculateAge(swimmer.dateOfBirth);
        const category = calculateCategoryFromBirthDate(swimmer.dateOfBirth);
        const gender = swimmer.gender as "Masculino" | "Femenino";

        const eventsStatus: EventStatus[] = events.map(event => {
          // Parsear el evento para obtener distance y style
          const parsed = parseEvent(event);
          
          // Buscar marca personal
          const personalBests = Array.isArray(swimmer.personalBests) ? swimmer.personalBests : [];
          const pb = parsed 
            ? personalBests.find(
                (pb: PersonalBest) => pb.distance === parsed.distance && pb.style === parsed.style
              )
            : null;

          const minimumTime = getMinimumTimeForCategory(event, category, gender);
          
          let meetsMinimum: boolean | null = null;
          let difference: number | null = null;

          if (pb && pb.time && minimumTime && minimumTime !== "S/MM") {
            const pbSeconds = timeToSeconds(pb.time);
            const minSeconds = timeToSeconds(minimumTime);
            
            if (pbSeconds !== Infinity && minSeconds !== Infinity) {
              meetsMinimum = pbSeconds <= minSeconds;
              difference = pbSeconds - minSeconds;
            }
          }

          return {
            event,
            personalBest: pb?.time || null,
            minimumTime,
            meetsMinimum,
            difference,
          };
        });

        return {
          swimmer,
          category,
          age,
          events: eventsStatus,
        };
      });
  }, [swimmers]);

  // Filtrar nadadores
  const filteredSwimmers = swimmersStatus.filter(status => {
    // Filtro por género
    if (filterGender !== "all" && status.swimmer.gender !== filterGender) {
      return false;
    }

    // Filtro por categoría
    if (filterCategory !== "all" && status.category !== filterCategory) {
      return false;
    }

    // Filtro por estado
    if (filterStatus !== "all") {
      const eventsWithMinimum = status.events.filter(e => e.minimumTime && e.minimumTime !== "S/MM");
      
      if (filterStatus === "all-met") {
        // Todos los eventos con marca mínima deben estar cumplidos
        const allMet = eventsWithMinimum.every(e => e.meetsMinimum === true);
        if (!allMet) return false;
      } else if (filterStatus === "some-met") {
        // Al menos un evento cumplido
        const someMet = eventsWithMinimum.some(e => e.meetsMinimum === true);
        if (!someMet) return false;
      } else if (filterStatus === "none-met") {
        // Ningún evento cumplido
        const noneMet = eventsWithMinimum.every(e => e.meetsMinimum === false || e.meetsMinimum === null);
        if (!noneMet) return false;
      }
    }

    return true;
  });

  // Obtener categorías únicas
  const uniqueCategories = Array.from(new Set(swimmersStatus.map(s => s.category))).sort();

  // Estadísticas generales
  const totalSwimmers = filteredSwimmers.length;
  const totalEvents = filteredSwimmers.reduce((sum, s) => {
    return sum + s.events.filter(e => e.minimumTime && e.minimumTime !== "S/MM").length;
  }, 0);
  const eventsMet = filteredSwimmers.reduce((sum, s) => {
    return sum + s.events.filter(e => e.meetsMinimum === true).length;
  }, 0);
  const eventsNotMet = filteredSwimmers.reduce((sum, s) => {
    return sum + s.events.filter(e => e.meetsMinimum === false).length;
  }, 0);

  // Función para abrir el diálogo con el nadador seleccionado
  const handleSwimmerClick = (status: SwimmerStatus) => {
    setSelectedSwimmer(status);
    setDialogOpen(true);
  };

  return (
    <Tabs defaultValue="swimmers" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="swimmers" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Verificador de Nadadores
        </TabsTrigger>
        <TabsTrigger value="table" className="flex items-center gap-2">
          <TableIcon className="w-4 h-4" />
          Tabla de Marcas Mínimas
        </TabsTrigger>
      </TabsList>

      {/* Pestaña 1: Verificador de Nadadores */}
      <TabsContent value="swimmers" className="space-y-6">
        {/* Header con estadísticas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-red-600" />
              Verificador de Marcas Mínimas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-600">Nadadores</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{totalSwimmers}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-600">Cumplidas</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{eventsMet}</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-red-600">No Cumplidas</span>
                </div>
                <p className="text-2xl font-bold text-red-600">{eventsNotMet}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-600">% Cumplimiento</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {totalEvents > 0 ? Math.round((eventsMet / totalEvents) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro por género */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Género</label>
                <Select value={filterGender} onValueChange={setFilterGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por categoría */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Categoría</label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {uniqueCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por estado */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Estado</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="all-met">Todas las marcas cumplidas</SelectItem>
                    <SelectItem value="some-met">Algunas marcas cumplidas</SelectItem>
                    <SelectItem value="none-met">Sin marcas cumplidas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista compacta de nadadores */}
        {filteredSwimmers.length === 0 ? (
          <Card>
            <CardContent className="pt-6 pb-6">
              <p className="text-center text-gray-500">
                No hay nadadores que coincidan con los filtros seleccionados.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSwimmers.map(status => {
              const eventsWithMinimum = status.events.filter(e => e.minimumTime && e.minimumTime !== "S/MM");
              const eventsMet = eventsWithMinimum.filter(e => e.meetsMinimum === true).length;
              const totalWithMinimum = eventsWithMinimum.length;
              const percentage = totalWithMinimum > 0 ? Math.round((eventsMet / totalWithMinimum) * 100) : 0;

              return (
                <Card
                  key={status.swimmer.id}
                  className="cursor-pointer hover:shadow-lg hover:border-red-300 transition-all duration-200"
                  onClick={() => handleSwimmerClick(status)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      {status.swimmer.profileImage ? (
                        <img
                          src={status.swimmer.profileImage}
                          alt={status.swimmer.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-xl border-2 border-gray-200">
                          {status.swimmer.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 leading-tight">{status.swimmer.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">{status.category}</Badge>
                          <Badge variant="outline" className="text-xs">{status.swimmer.gender}</Badge>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>

                    {/* Barra de progreso */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Cumplimiento</span>
                        <span className="text-lg font-bold text-red-600">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            percentage >= 80 ? "bg-green-500" : percentage >= 50 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{eventsMet} cumplidas</span>
                        <span>{totalWithMinimum - eventsMet} pendientes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Diálogo con detalles del nadador */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedSwimmer && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-4">
                    {selectedSwimmer.swimmer.profileImage ? (
                      <img
                        src={selectedSwimmer.swimmer.profileImage}
                        alt={selectedSwimmer.swimmer.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-red-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-2xl border-4 border-red-200">
                        {selectedSwimmer.swimmer.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h2 className="text-2xl font-bold">{selectedSwimmer.swimmer.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{selectedSwimmer.category}</Badge>
                        <Badge variant="outline">{selectedSwimmer.swimmer.gender}</Badge>
                        <span className="text-sm text-gray-600">{selectedSwimmer.age} años</span>
                      </div>
                    </div>
                  </DialogTitle>
                  <DialogDescription>
                    Detalles de las marcas mínimas cumplidas y no cumplidas para {selectedSwimmer.swimmer.name}.
                  </DialogDescription>
                </DialogHeader>

                {/* Estadísticas del nadador */}
                <div className="grid grid-cols-3 gap-4 my-4">
                  {(() => {
                    const eventsWithMinimum = selectedSwimmer.events.filter(e => e.minimumTime && e.minimumTime !== "S/MM");
                    const eventsMet = eventsWithMinimum.filter(e => e.meetsMinimum === true).length;
                    const eventsNotMet = eventsWithMinimum.filter(e => e.meetsMinimum === false).length;
                    const totalWithMinimum = eventsWithMinimum.length;
                    const percentage = totalWithMinimum > 0 ? Math.round((eventsMet / totalWithMinimum) * 100) : 0;

                    return (
                      <>
                        <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                          <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-1" />
                          <p className="text-2xl font-bold text-green-600">{eventsMet}</p>
                          <p className="text-xs text-green-700">Cumplidas</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
                          <XCircle className="w-6 h-6 text-red-600 mx-auto mb-1" />
                          <p className="text-2xl font-bold text-red-600">{eventsNotMet}</p>
                          <p className="text-xs text-red-700">No Cumplidas</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                          <Clock className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                          <p className="text-2xl font-bold text-blue-600">{percentage}%</p>
                          <p className="text-xs text-blue-700">Cumplimiento</p>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Grid de pruebas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedSwimmer.events
                    .filter(e => e.minimumTime && e.minimumTime !== "S/MM")
                    .map(event => (
                      <div
                        key={event.event}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                          event.meetsMinimum === true
                            ? "bg-green-50 border-green-300"
                            : event.meetsMinimum === false
                            ? "bg-red-50 border-red-300"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {event.meetsMinimum === true ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                          ) : event.meetsMinimum === false ? (
                            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                          ) : (
                            <Clock className="w-6 h-6 text-gray-400 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">{event.event}</p>
                            <p className="text-sm text-gray-600">
                              Mínimo: <span className="font-semibold">{event.minimumTime}</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          {event.personalBest ? (
                            <>
                              <p className="text-lg font-bold text-gray-900">
                                {event.personalBest}
                              </p>
                              {event.difference !== null && (
                                <p
                                  className={`text-sm font-semibold ${
                                    event.difference <= 0 ? "text-green-600" : "text-red-600"
                                  }`}
                                >
                                  {event.difference > 0 
                                    ? `Falta: ${formatTimeDifference(event.difference)}` 
                                    : `Supera por: ${formatTimeDifference(Math.abs(event.difference))}`
                                  }
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-sm text-gray-500 italic">Sin marca</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </TabsContent>

      {/* Pestaña 2: Tabla de Marcas Mínimas */}
      <TabsContent value="table" className="space-y-6">
        {/* Header con estadísticas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-red-600" />
              Verificador de Marcas Mínimas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-600">Nadadores</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{totalSwimmers}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-600">Cumplidas</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{eventsMet}</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-red-600">No Cumplidas</span>
                </div>
                <p className="text-2xl font-bold text-red-600">{eventsNotMet}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-600">% Cumplimiento</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {totalEvents > 0 ? Math.round((eventsMet / totalEvents) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro por género */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Género</label>
                <Select value={filterGender} onValueChange={setFilterGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por categoría */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Categoría</label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {uniqueCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por estado */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Estado</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="all-met">Todas las marcas cumplidas</SelectItem>
                    <SelectItem value="some-met">Algunas marcas cumplidas</SelectItem>
                    <SelectItem value="none-met">Sin marcas cumplidas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de marcas mínimas */}
        {filteredSwimmers.length === 0 ? (
          <Card>
            <CardContent className="pt-6 pb-6">
              <p className="text-center text-gray-500">
                No hay nadadores que coincidan con los filtros seleccionados.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Tabla Completa de Marcas Mínimas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300">
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Nadador</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Categoría</th>
                      <th className="px-4 py-3 text-center font-bold text-gray-700">Edad</th>
                      <th className="px-4 py-3 text-center font-bold text-gray-700">Género</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Prueba</th>
                      <th className="px-4 py-3 text-center font-bold text-gray-700">Marca Personal</th>
                      <th className="px-4 py-3 text-center font-bold text-gray-700">Marca Mínima</th>
                      <th className="px-4 py-3 text-center font-bold text-gray-700">Estado</th>
                      <th className="px-4 py-3 text-center font-bold text-gray-700">Diferencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSwimmers.flatMap(status => {
                      return status.events
                        .filter(e => e.minimumTime && e.minimumTime !== "S/MM")
                        .map(event => (
                          <tr
                            key={`${status.swimmer.id}-${event.event}`}
                            className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                              event.meetsMinimum === true
                                ? "bg-green-50/30"
                                : event.meetsMinimum === false
                                ? "bg-red-50/30"
                                : "bg-white"
                            }`}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {status.swimmer.profileImage ? (
                                  <img
                                    src={status.swimmer.profileImage}
                                    alt={status.swimmer.name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-sm border-2 border-gray-200">
                                    {status.swimmer.name.charAt(0)}
                                  </div>
                                )}
                                <span className="font-medium text-gray-900">{status.swimmer.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="secondary" className="text-xs">{status.category}</Badge>
                            </td>
                            <td className="px-4 py-3 text-center text-gray-700">{status.age}</td>
                            <td className="px-4 py-3 text-center">
                              <Badge variant="outline" className="text-xs">{status.swimmer.gender}</Badge>
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-900">{event.event}</td>
                            <td className="px-4 py-3 text-center font-semibold text-gray-900">
                              {event.personalBest || <span className="text-gray-400 italic text-xs">Sin marca</span>}
                            </td>
                            <td className="px-4 py-3 text-center font-semibold text-blue-600">{event.minimumTime}</td>
                            <td className="px-4 py-3 text-center">
                              {event.meetsMinimum === true ? (
                                <div className="flex items-center justify-center gap-1">
                                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                                  <span className="text-xs font-semibold text-green-600">Sí</span>
                                </div>
                              ) : event.meetsMinimum === false ? (
                                <div className="flex items-center justify-center gap-1">
                                  <XCircle className="w-5 h-5 text-red-600" />
                                  <span className="text-xs font-semibold text-red-600">No</span>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-1">
                                  <Clock className="w-5 h-5 text-gray-400" />
                                  <span className="text-xs font-semibold text-gray-400">N/A</span>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {event.difference !== null && event.personalBest ? (
                                <span
                                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                                    event.difference <= 0 
                                      ? "bg-green-100 text-green-700" 
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {event.difference > 0 
                                    ? `↓ ${formatTimeDifference(event.difference)}` 
                                    : `↑ ${formatTimeDifference(Math.abs(event.difference))}`
                                  }
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">-</span>
                              )}
                            </td>
                          </tr>
                        ));
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}