import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Trophy, Calendar, MapPin, Waves, Plus, Check, Award, TrendingUp, Clock } from "lucide-react";
import type { Competition, SwimmerCompetition, Swimmer } from "../data/swimmers";

interface CompetitionResultsProps {
  swimmer: Swimmer;
  competitions: Competition[];
  swimmerCompetitions: SwimmerCompetition[];
  onUpdateResults: (
    competitionId: string,
    events: { event: string; time?: string; position?: number; points?: number }[]
  ) => Promise<void>;
}

// Función auxiliar para convertir tiempo MM:SS.SS a segundos
function timeToSeconds(time: string): number {
  const parts = time.split(':');
  if (parts.length === 2) {
    const minutes = parseInt(parts[0]);
    const seconds = parseFloat(parts[1]);
    return minutes * 60 + seconds;
  }
  return parseFloat(time);
}

// Función para extraer distancia y estilo del nombre del evento
function parseEvent(eventName: string): { distance: number; style: string } | null {
  // Ejemplos: "50m Libre", "100m Espalda", "200m Combinado"
  const match = eventName.match(/(\d+)m?\s+(.+)/i);
  if (match) {
    const distance = parseInt(match[1]);
    const style = match[2].trim();
    
    // Normalizar estilos
    const styleMap: Record<string, string> = {
      'Libre': 'Libre',
      'Espalda': 'Espalda',
      'Pecho': 'Pecho',
      'Mariposa': 'Mariposa',
      'Combinado': 'Combinado',
      'IM': 'Combinado',
      'Medley': 'Combinado'
    };
    
    const normalizedStyle = styleMap[style] || style;
    
    return { distance, style: normalizedStyle };
  }
  return null;
}

export function CompetitionResults({
  swimmer,
  competitions,
  swimmerCompetitions,
  onUpdateResults,
}: CompetitionResultsProps) {
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventResults, setEventResults] = useState<Record<string, { time: string; position: string; points: string }>>({});

  // Obtener competencias donde el nadador participa
  const myCompetitions = competitions.filter((comp) => {
    const participation = swimmerCompetitions.find(
      (sc) => sc.competitionId === comp.id && sc.swimmerId === swimmer.id
    );
    return participation?.participates;
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getCompetitionTypeColor = (type: Competition["type"]) => {
    switch (type) {
      case "Regional":
        return "bg-blue-100 text-blue-800";
      case "Nacional":
        return "bg-red-100 text-red-800";
      case "Internacional":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleOpenDialog = (competition: Competition) => {
    setSelectedCompetition(competition);
    
    // Cargar resultados existentes si los hay
    const participation = swimmerCompetitions.find(
      (sc) => sc.competitionId === competition.id && sc.swimmerId === swimmer.id
    );
    
    if (participation?.events) {
      const existingResults: Record<string, { time: string; position: string; points: string }> = {};
      participation.events.forEach((evt) => {
        existingResults[evt.event] = {
          time: evt.time || "",
          position: evt.position?.toString() || "",
          points: evt.points?.toString() || "",
        };
      });
      setEventResults(existingResults);
    } else {
      setEventResults({});
    }
    
    setDialogOpen(true);
  };

  const handleSaveResults = async () => {
    if (!selectedCompetition) return;

    // Convertir los resultados al formato correcto
    const events = Object.entries(eventResults)
      .filter(([_, result]) => result.time) // Solo incluir eventos con tiempo registrado
      .map(([event, result]) => ({
        event,
        time: result.time,
        position: result.position ? parseInt(result.position) : undefined,
        points: result.points ? parseInt(result.points) : undefined,
      }));

    try {
      await onUpdateResults(selectedCompetition.id, events);
      setDialogOpen(false);
      setSelectedCompetition(null);
      setEventResults({});
    } catch (error) {
      console.error("Error saving results:", error);
    }
  };

  const handleEventChange = (event: string, field: 'time' | 'position' | 'points', value: string) => {
    setEventResults(prev => ({
      ...prev,
      [event]: {
        ...(prev[event] || { time: '', position: '', points: '' }),
        [field]: value,
      },
    }));
  };

  // Verificar si el resultado es una mejora personal
  const isPersonalBest = (eventName: string, time: string): boolean => {
    if (!time || !swimmer.personalBests) return false;
    
    const parsed = parseEvent(eventName);
    if (!parsed) return false;
    
    const { distance, style } = parsed;
    const currentBest = swimmer.personalBests.find(
      pb => pb.distance === distance && pb.style === style
    );
    
    if (!currentBest) return true; // Es la primera marca
    
    const newTimeSeconds = timeToSeconds(time);
    const currentBestSeconds = timeToSeconds(currentBest.time);
    
    return newTimeSeconds < currentBestSeconds;
  };

  // Ordenar competencias por fecha
  const sortedCompetitions = [...myCompetitions].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            Mis Competencias
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Registra tus resultados y mejora tus marcas
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-600">Competencias</div>
          <div className="text-xl sm:text-2xl font-bold text-yellow-600">{myCompetitions.length}</div>
        </div>
      </div>

      {sortedCompetitions.length === 0 ? (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
          <CardContent className="pt-8 pb-8 text-center">
            <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              No hay competencias programadas
            </h3>
            <p className="text-sm text-gray-600">
              Aún no estás registrado en ninguna competencia. Consulta con tu entrenador.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {sortedCompetitions.map((competition) => {
            const participation = swimmerCompetitions.find(
              (sc) => sc.competitionId === competition.id && sc.swimmerId === swimmer.id
            );
            
            const hasResults = participation?.events && participation.events.some(e => e.time);
            const totalEvents = participation?.events?.length || 0;
            const completedEvents = participation?.events?.filter(e => e.time).length || 0;

            return (
              <Card
                key={competition.id}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3 space-y-2">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0" />
                        <CardTitle className="text-base sm:text-lg truncate">{competition.name}</CardTitle>
                        <Badge className={`${getCompetitionTypeColor(competition.type)} text-xs`}>
                          {competition.type}
                        </Badge>
                        {hasResults && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Registrado
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs sm:text-sm text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-gray-500 flex-shrink-0" />
                          <span className="truncate">{formatDate(competition.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-gray-500 flex-shrink-0" />
                          <span className="truncate">{competition.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Waves className="w-3 h-3 text-gray-500 flex-shrink-0" />
                          <span>Piscina {competition.poolType}</span>
                        </div>
                        {totalEvents > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Award className="w-3 h-3 text-gray-500 flex-shrink-0" />
                            <span>{completedEvents}/{totalEvents} pruebas</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Dialog open={dialogOpen && selectedCompetition?.id === competition.id} onOpenChange={(open) => {
                      if (!open) {
                        setDialogOpen(false);
                        setSelectedCompetition(null);
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant={hasResults ? "outline" : "default"}
                          onClick={() => handleOpenDialog(competition)}
                          className="flex-shrink-0"
                        >
                          {hasResults ? (
                            <>
                              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                              <span className="hidden sm:inline">Actualizar</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                              <span className="hidden sm:inline">Registrar</span>
                            </>
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                            Registrar Resultados - {selectedCompetition?.name}
                          </DialogTitle>
                          <DialogDescription className="text-xs sm:text-sm">
                            Ingresa tus tiempos y posiciones. Los tiempos se actualizarán automáticamente en tu ficha personal si son mejoras.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-3 py-4">
                          {selectedCompetition?.events && selectedCompetition.events.length > 0 ? (
                            selectedCompetition.events.map((event) => {
                              const currentResult = eventResults[event] || { time: '', position: '', points: '' };
                              const isPB = currentResult.time && isPersonalBest(event, currentResult.time);
                              
                              return (
                                <Card key={event} className={isPB ? "border-2 border-green-400 bg-green-50" : ""}>
                                  <CardContent className="pt-3 space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                      <h4 className="font-semibold text-sm sm:text-base">{event}</h4>
                                      {isPB && (
                                        <Badge className="bg-green-600 text-white text-xs">
                                          <Award className="w-3 h-3 mr-1" />
                                          ¡Mejora!
                                        </Badge>
                                      )}
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-2">
                                      <div className="space-y-1">
                                        <Label htmlFor={`time-${event}`} className="flex items-center gap-1 text-xs">
                                          <Clock className="w-3 h-3" />
                                          Tiempo
                                        </Label>
                                        <Input
                                          id={`time-${event}`}
                                          placeholder="MM:SS.SS"
                                          value={currentResult.time}
                                          onChange={(e) => handleEventChange(event, 'time', e.target.value)}
                                          className="h-8 text-sm"
                                        />
                                      </div>
                                      
                                      <div className="space-y-1">
                                        <Label htmlFor={`position-${event}`} className="text-xs">Posición</Label>
                                        <Input
                                          id={`position-${event}`}
                                          type="number"
                                          placeholder="1, 2..."
                                          value={currentResult.position}
                                          onChange={(e) => handleEventChange(event, 'position', e.target.value)}
                                          className="h-8 text-sm"
                                        />
                                      </div>
                                      
                                      <div className="space-y-1">
                                        <Label htmlFor={`points-${event}`} className="text-xs">Puntos</Label>
                                        <Input
                                          id={`points-${event}`}
                                          type="number"
                                          placeholder="Opcional"
                                          value={currentResult.points}
                                          onChange={(e) => handleEventChange(event, 'points', e.target.value)}
                                          className="h-8 text-sm"
                                        />
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })
                          ) : (
                            <div className="text-center py-6 text-gray-500">
                              <Trophy className="w-10 h-10 mx-auto mb-2 opacity-30" />
                              <p className="text-sm">No hay pruebas definidas para esta competencia.</p>
                            </div>
                          )}
                        </div>

                        <DialogFooter className="gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setDialogOpen(false);
                              setSelectedCompetition(null);
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button size="sm" onClick={handleSaveResults}>
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Guardar</span>
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>

                {hasResults && (
                  <CardContent className="pt-0">
                    <div className="space-y-1.5">
                      <h4 className="font-semibold text-xs sm:text-sm text-gray-700 mb-2">Mis Resultados:</h4>
                      {participation?.events?.filter(e => e.time).map((evt) => (
                        <div
                          key={evt.event}
                          className="flex items-center justify-between bg-white rounded-lg p-2 border text-xs sm:text-sm gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <Award className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 flex-shrink-0" />
                            <span className="font-medium truncate">{evt.event}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-500" />
                              <span className="font-semibold text-blue-600">{evt.time}</span>
                            </div>
                            {evt.position && (
                              <Badge variant="outline" className="text-xs">
                                {evt.position}°
                              </Badge>
                            )}
                            {evt.points && (
                              <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                                {evt.points} pts
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}