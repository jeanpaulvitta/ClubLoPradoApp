import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Target, TrendingUp, CalendarDays, Trophy, ChevronRight, Users, Plus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { WorkoutCard } from "./WorkoutCard";

type SessionType = {
  type: 'workout';
  mesociclo: string;
  week: number;
  sessionNumber: number;
  date: string;
  day: string;
  distance: number;
  warmUp?: string;
  mainSet?: string;
  coolDown?: string;
  challengeType?: string;
  description?: string;
  focus?: string;
  estimatedTime?: number;
  group?: 1 | 2 | "Ambos";
};

interface MesocicloDialogProps {
  mesociclo: {
    name: string;
    weeks: number;
    description: string;
    icon: typeof Target;
    color: string;
    dateRange?: string;
    competition?: string;
    competitionDate?: string;
    bgColor?: string;
    borderColor?: string;
  };
  sessions: SessionType[];
  selectedGroup?: "group1" | "group2";
}

export function MesocicloDialog({ mesociclo, sessions, selectedGroup }: MesocicloDialogProps) {
  const [open, setOpen] = useState(false);
  const Icon = mesociclo.icon;

  // Determinar el grupo numérico según el selectedGroup
  const groupNumber = selectedGroup === "group1" ? 1 : selectedGroup === "group2" ? 2 : undefined;

  // Filtrar sesiones por mesociclo y grupo
  const mesocicloSessions = sessions.filter(s => {
    if (s.mesociclo !== mesociclo.name) return false;
    
    // Si no hay grupo seleccionado, mostrar todo
    if (!groupNumber) return true;
    
    // Mostrar si la sesión es para "Ambos" o para el grupo específico
    return s.group === "Ambos" || s.group === groupNumber;
  });


  
  // Agrupar por semana
  const sessionsByWeek: { [key: number]: SessionType[] } = {};
  mesocicloSessions.forEach((session) => {
    if (!sessionsByWeek[session.week]) {
      sessionsByWeek[session.week] = [];
    }
    sessionsByWeek[session.week].push(session);
  });

  // Calcular estadísticas
  const totalWorkouts = mesocicloSessions.length;
  const totalDistance = mesocicloSessions.reduce((sum, s) => sum + s.distance, 0);
  const avgDistance = totalWorkouts > 0 ? Math.round(totalDistance / totalWorkouts) : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <Card className={`hover:shadow-lg transition-all cursor-pointer hover:scale-105 ${mesociclo.borderColor || 'border-gray-200'} ${mesociclo.bgColor || ''}`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Icon className={`w-6 h-6 ${mesociclo.color}`} />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{mesociclo.name}</h3>
                  {mesociclo.dateRange && (
                    <p className="text-xs text-gray-500 mb-1">
                      📅 {mesociclo.dateRange}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mb-2">
                    {mesociclo.description}
                  </p>
                  {mesociclo.competition && (
                    <div className="mb-2 p-2 bg-white rounded border border-red-200">
                      <p className="text-xs font-semibold text-red-600 mb-0.5">
                        🏆 {mesociclo.competition}
                      </p>
                      {mesociclo.competitionDate && (
                        <p className="text-xs text-gray-500">
                          {mesociclo.competitionDate}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{mesociclo.weeks} semanas</Badge>
                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                      {mesocicloSessions.length} entrenamientos
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Icon className={`w-8 h-8 ${mesociclo.color}`} />
            <div>
              <DialogTitle className="text-2xl">{mesociclo.name}</DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                {mesociclo.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Estadísticas del mesociclo */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Entrenamientos</p>
                <p className="text-2xl font-bold">{totalWorkouts}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Distancia Total</p>
                <p className="text-2xl font-bold">{(totalDistance / 1000).toFixed(1)} km</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Promedio/Sesión</p>
                <p className="text-2xl font-bold">{avgDistance}m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acordeón de entrenamientos por semana */}
        <Accordion type="multiple" className="space-y-4 mt-6">
          {Object.keys(sessionsByWeek)
            .map(Number)
            .sort((a, b) => a - b)
            .map((weekNumber) => {
              const weekSessions = sessionsByWeek[weekNumber];
              
              if (!weekSessions || weekSessions.length === 0) {
                return null;
              }
              
              const weekWorkouts = weekSessions.filter(s => s.type === 'workout');
              const weekChallenge = weekSessions.find(s => s.type === 'challenge');
              const weekDistance = weekSessions.reduce((sum, s) => sum + s.distance, 0);
              
              return (
                <AccordionItem 
                  key={weekNumber} 
                  value={`week-${weekNumber}`}
                  className="border rounded-lg px-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full pr-4 gap-2 sm:gap-0">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-start">
                          <span className="font-bold text-lg">Semana {weekNumber}</span>
                          <span className="text-sm text-gray-600">{weekSessions[0]?.date || ''}</span>
                        </div>
                      </div>
                      <div className="flex gap-6 text-sm">
                        <div className="text-center">
                          <p className="text-gray-600">Entrenamientos</p>
                          <p className="font-bold">{weekWorkouts.length}</p>
                        </div>
                        {weekChallenge && (
                          <div className="text-center">
                            <p className="text-gray-600">Desafío</p>
                            <p className="font-bold">1</p>
                          </div>
                        )}
                        <div className="text-center">
                          <p className="text-gray-600">Distancia</p>
                          <p className="font-bold">{weekDistance}m</p>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex overflow-x-auto gap-4 md:gap-6 pt-6 pb-4 px-2 snap-x snap-mandatory scrollbar-thin">
                      {weekSessions.map((session, index) => (
                        <div key={`${weekNumber}-${index}`} className="flex-shrink-0 w-[85vw] sm:w-[400px] md:w-[450px] snap-start">
                          <WorkoutCard {...session} />
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}