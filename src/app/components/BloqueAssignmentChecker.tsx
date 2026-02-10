import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle2, AlertCircle, Zap, RefreshCw, Eye } from "lucide-react";
import type { Workout } from "../data/workouts";

interface BloqueAssignmentCheckerProps {
  workouts: Workout[];
  onAutoFix: () => void;
}

// Definición de bloques con sus rangos de semanas
const bloqueDefinitions = [
  { name: "Bloque 1", weekStart: 1, weekEnd: 6, label: "Bloque 1 - Velocidad" },
  { name: "Bloque 2", weekStart: 7, weekEnd: 10, label: "Bloque 2 - Fondo" },
  { name: "Bloque 3", weekStart: 11, weekEnd: 14, label: "Bloque 3 - Medio Fondo" },
  { name: "Bloque 4", weekStart: 15, weekEnd: 20, label: "Bloque 4 - Competitivo" },
  { name: "Bloque 5", weekStart: 21, weekEnd: 26, label: "Bloque 5 - Internacional" },
  { name: "Bloque 6", weekStart: 27, weekEnd: 30, label: "Bloque 6 - Velocidad" },
  { name: "Bloque 7", weekStart: 31, weekEnd: 34, label: "Bloque 7 - Fondo" },
  { name: "Bloque 8", weekStart: 35, weekEnd: 39, label: "Bloque 8 - Medio Fondo" },
  { name: "Bloque 9", weekStart: 40, weekEnd: 48, label: "Bloque 9 - Preparación" },
  { name: "Bloque 10", weekStart: 49, weekEnd: 52, label: "Bloque 10 - Pico Competitivo" },
];

export function BloqueAssignmentChecker({ workouts, onAutoFix }: BloqueAssignmentCheckerProps) {
  const [open, setOpen] = useState(false);

  // Función para obtener el bloque correcto según la semana
  const getExpectedBloque = (week: number): string | null => {
    const bloque = bloqueDefinitions.find(
      b => week >= b.weekStart && week <= b.weekEnd
    );
    return bloque ? bloque.name : null;
  };

  // Analizar entrenamientos
  const activeWorkouts = workouts.filter(w => !w.deleted);
  
  // Clasificar entrenamientos
  const correctWorkouts = activeWorkouts.filter(w => {
    const expected = getExpectedBloque(w.week);
    return w.bloque === expected || w.mesociclo === expected;
  });

  const incorrectWorkouts = activeWorkouts.filter(w => {
    const expected = getExpectedBloque(w.week);
    const current = w.bloque || w.mesociclo;
    return expected && current !== expected;
  });

  const missingBloqueWorkouts = activeWorkouts.filter(w => {
    return !w.bloque && !w.mesociclo;
  });

  const totalIssues = incorrectWorkouts.length + missingBloqueWorkouts.length;
  const healthPercentage = activeWorkouts.length > 0 
    ? Math.round((correctWorkouts.length / activeWorkouts.length) * 100) 
    : 0;

  // Agrupar problemas por semana
  const issuesByWeek: { [week: number]: Workout[] } = {};
  [...incorrectWorkouts, ...missingBloqueWorkouts].forEach(w => {
    if (!issuesByWeek[w.week]) {
      issuesByWeek[w.week] = [];
    }
    issuesByWeek[w.week].push(w);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={totalIssues > 0 ? "destructive" : "outline"}
          className="gap-2"
        >
          <Eye className="w-4 h-4" />
          Verificar Bloques
          {totalIssues > 0 && (
            <Badge variant="secondary" className="ml-1">
              {totalIssues}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Diagnóstico de Asignación de Bloques
          </DialogTitle>
          <DialogDescription>
            Verifica y corrige la asignación automática de bloques según las semanas de entrenamiento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Estado General */}
          <Card className={`${
            healthPercentage >= 90 
              ? "bg-green-50 border-green-200" 
              : healthPercentage >= 50 
              ? "bg-yellow-50 border-yellow-200" 
              : "bg-red-50 border-red-200"
          }`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">Estado del Sistema</h3>
                  <p className="text-sm text-gray-600">
                    {activeWorkouts.length} entrenamientos activos
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold ${
                    healthPercentage >= 90 
                      ? "text-green-600" 
                      : healthPercentage >= 50 
                      ? "text-yellow-600" 
                      : "text-red-600"
                  }`}>
                    {healthPercentage}%
                  </div>
                  <p className="text-sm text-gray-600">Correctos</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-3 border">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-gray-700">Correctos</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {correctWorkouts.length}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 border">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-semibold text-gray-700">Incorrectos</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {incorrectWorkouts.length}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 border">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-semibold text-gray-700">Sin Bloque</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {missingBloqueWorkouts.length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acción de Auto-corrección */}
          {totalIssues > 0 && (
            <Alert className="bg-blue-50 border-blue-200">
              <Zap className="w-4 h-4 text-blue-600" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-sm">
                  Se detectaron {totalIssues} entrenamientos con problemas de asignación de bloque
                </span>
                <Button
                  size="sm"
                  onClick={() => {
                    onAutoFix();
                    setOpen(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className="w-3 h-3 mr-2" />
                  Corregir Automáticamente
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Detalle de Problemas por Semana */}
          {totalIssues > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detalle de Problemas por Semana</CardTitle>
                <CardDescription>
                  Entrenamientos que necesitan corrección
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.keys(issuesByWeek)
                  .map(Number)
                  .sort((a, b) => a - b)
                  .map(week => {
                    const expectedBloque = getExpectedBloque(week);
                    const weekWorkouts = issuesByWeek[week];

                    return (
                      <div key={week} className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">Semana {week}</h4>
                            <p className="text-xs text-gray-600">
                              Bloque esperado: {expectedBloque || "No definido"}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-red-100 text-red-700">
                            {weekWorkouts.length} problema{weekWorkouts.length > 1 ? 's' : ''}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          {weekWorkouts.map(w => (
                            <div 
                              key={w.id} 
                              className="flex items-center justify-between bg-white rounded p-2 text-sm border"
                            >
                              <div>
                                <span className="font-medium">{w.day}</span>
                                <span className="text-gray-500 ml-2">
                                  {w.distance}m
                                </span>
                                {w.group && (
                                  <span className="text-gray-500 ml-2">
                                    • Grupo {w.group === "Ambos" ? "Ambos" : w.group}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-red-50 text-red-700 text-xs">
                                  Actual: {w.bloque || w.mesociclo || "Sin asignar"}
                                </Badge>
                                <span className="text-gray-400">→</span>
                                <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                                  Debe ser: {expectedBloque}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          )}

          {/* Estado OK */}
          {totalIssues === 0 && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-8 pb-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-green-700 mb-2">
                  ¡Todo Perfecto!
                </h3>
                <p className="text-gray-600">
                  Todos los entrenamientos tienen su bloque correctamente asignado
                </p>
              </CardContent>
            </Card>
          )}

          {/* Referencia de Bloques */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Referencia de Bloques</CardTitle>
              <CardDescription>
                Mapeo de semanas a bloques de entrenamiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {bloqueDefinitions.map(def => (
                  <div key={def.name} className="flex items-center justify-between bg-gray-50 rounded-lg p-2 text-sm">
                    <span className="font-medium">{def.label}</span>
                    <Badge variant="outline" className="text-xs">
                      Sem {def.weekStart}-{def.weekEnd}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}