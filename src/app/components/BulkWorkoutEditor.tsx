import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Edit3, CheckSquare, Sparkles, AlertCircle } from "lucide-react";
import type { Workout } from "../data/workouts";

interface BulkWorkoutEditorProps {
  workouts: Workout[];
  onBulkUpdate: (workoutIds: string[], updates: Partial<Workout>) => void;
}

export function BulkWorkoutEditor({ workouts, onBulkUpdate }: BulkWorkoutEditorProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);
  const [selectedBloque, setSelectedBloque] = useState<string>("Bloque 1");
  const [selectedGroup, setSelectedGroup] = useState<1 | 2 | "Ambos">("Ambos");
  const [filterWeek, setFilterWeek] = useState<number | "all">("all");
  const [isUpdating, setIsUpdating] = useState(false);

  // Definición de bloques con sus rangos de semanas
  const bloqueDefinitions = [
    { name: "Bloque 1", weekStart: 1, weekEnd: 6, label: "Bloque 1 - Velocidad (9 Feb - 22 Mar)" },
    { name: "Bloque 2", weekStart: 7, weekEnd: 10, label: "Bloque 2 - Fondo (23 Mar - 19 Abr)" },
    { name: "Bloque 3", weekStart: 11, weekEnd: 14, label: "Bloque 3 - Medio Fondo (20 Abr - 17 May)" },
    { name: "Bloque 4", weekStart: 15, weekEnd: 20, label: "Bloque 4 - Competitivo (18 May - 5 Jul)" },
    { name: "Bloque 5", weekStart: 21, weekEnd: 26, label: "Bloque 5 - Internacional (6 Jul - 16 Ago)" },
    { name: "Bloque 6", weekStart: 27, weekEnd: 30, label: "Bloque 6 - Velocidad (17 Ago - 13 Sep)" },
    { name: "Bloque 7", weekStart: 31, weekEnd: 34, label: "Bloque 7 - Fondo (14 Sep - 4 Oct)" },
    { name: "Bloque 8", weekStart: 35, weekEnd: 39, label: "Bloque 8 - Medio Fondo (5 Oct - 8 Nov)" },
    { name: "Bloque 9", weekStart: 40, weekEnd: 48, label: "Bloque 9 - Preparación (9 Nov - 9 Ene)" },
    { name: "Bloque 10", weekStart: 49, weekEnd: 52, label: "Bloque 10 - Pico Competitivo (10 Ene - 7 Feb)" },
  ];

  // Filtrar entrenamientos activos (no eliminados)
  const activeWorkouts = workouts.filter(w => !w.deleted);

  // Aplicar filtro de semana
  const filteredWorkouts = filterWeek === "all" 
    ? activeWorkouts 
    : activeWorkouts.filter(w => w.week === filterWeek);

  // Función para auto-asignar bloques basándose en la semana
  const autoAssignBloques = async () => {
    const updates: { [key: string]: { bloque: string; mesociclo: string } } = {};
    
    activeWorkouts.forEach(workout => {
      if (!workout.id) return;
      
      const week = workout.week;
      const bloqueDef = bloqueDefinitions.find(
        b => week >= b.weekStart && week <= b.weekEnd
      );
      
      if (bloqueDef) {
        updates[workout.id] = {
          bloque: bloqueDef.name,
          mesociclo: bloqueDef.name
        };
      }
    });

    // Aplicar todas las actualizaciones
    const workoutIds = Object.keys(updates);
    if (workoutIds.length > 0) {
      // Asumimos que todos tienen el mismo bloque/mesociclo si estamos haciendo esto por semana
      // Pero en realidad necesitamos hacer múltiples actualizaciones
      // Por ahora, vamos a hacerlo de manera simple: agrupar por bloque
      const updatesByBloque: { [key: string]: string[] } = {};
      
      workoutIds.forEach(id => {
        const bloque = updates[id].bloque;
        if (!updatesByBloque[bloque]) {
          updatesByBloque[bloque] = [];
        }
        updatesByBloque[bloque].push(id);
      });

      // Ejecutar actualizaciones por bloque
      for (const [bloque, ids] of Object.entries(updatesByBloque)) {
        console.log(`🔄 Asignando ${bloque} a ${ids.length} entrenamientos...`);
        await onBulkUpdate(ids, { bloque, mesociclo: bloque });
      }

      alert(`✅ Se asignaron bloques automáticamente a ${workoutIds.length} entrenamientos. Recargando datos...`);
      setDialogOpen(false);
    } else {
      alert('⚠️ No hay entrenamientos para actualizar');
    }
  };

  // Toggle selección de entrenamiento individual
  const toggleWorkout = (id: string) => {
    setSelectedWorkouts(prev =>
      prev.includes(id) ? prev.filter(wid => wid !== id) : [...prev, id]
    );
  };

  // Seleccionar/deseleccionar todos los filtrados
  const toggleSelectAll = () => {
    const filteredIds = filteredWorkouts.map(w => w.id).filter((id): id is string => !!id);
    if (selectedWorkouts.length === filteredIds.length) {
      setSelectedWorkouts([]);
    } else {
      setSelectedWorkouts(filteredIds);
    }
  };

  // Aplicar cambios a entrenamientos seleccionados
  const applyBulkChanges = () => {
    if (selectedWorkouts.length === 0) {
      alert("⚠️ Selecciona al menos un entrenamiento");
      return;
    }

    onBulkUpdate(selectedWorkouts, {
      bloque: selectedBloque,
      mesociclo: selectedBloque,
      group: selectedGroup
    });

    alert(`✅ Se actualizaron ${selectedWorkouts.length} entrenamientos`);
    setSelectedWorkouts([]);
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Edit3 className="w-4 h-4" />
          Edición Masiva
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edición Masiva de Entrenamientos</DialogTitle>
          <DialogDescription>
            Asigna bloques y grupos a múltiples entrenamientos a la vez
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4 p-4">
            {/* Opciones de asignación automática */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Asignación Automática
                </CardTitle>
                <CardDescription>
                  Asigna bloques automáticamente según las semanas de entrenamiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-700 mb-2 font-semibold">
                      📋 Mapeo automático por semanas:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {bloqueDefinitions.map(def => (
                        <div key={def.name} className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Sem {def.weekStart}-{def.weekEnd}
                          </Badge>
                          <span className="text-gray-600">→ {def.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button 
                    onClick={autoAssignBloques} 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Auto-asignar Bloques por Semana
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Edición manual */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckSquare className="w-5 h-5 text-red-600" />
                  Edición Manual
                </CardTitle>
                <CardDescription>
                  Selecciona entrenamientos individuales y asigna bloque/grupo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filtros */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Filtrar por Semana</Label>
                    <Select 
                      value={String(filterWeek)} 
                      onValueChange={(v) => setFilterWeek(v === "all" ? "all" : parseInt(v))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las semanas</SelectItem>
                        {Array.from({ length: 52 }, (_, i) => i + 1).map(week => (
                          <SelectItem key={week} value={String(week)}>
                            Semana {week}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Controles de selección */}
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedWorkouts.length === filteredWorkouts.length && filteredWorkouts.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                    <span className="text-sm font-medium">
                      Seleccionar todos ({filteredWorkouts.length})
                    </span>
                  </div>
                  <Badge variant="outline">
                    {selectedWorkouts.length} seleccionados
                  </Badge>
                </div>

                {/* Lista de entrenamientos */}
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredWorkouts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      No hay entrenamientos para mostrar
                    </div>
                  ) : (
                    filteredWorkouts.map(workout => (
                      <div
                        key={workout.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                          selectedWorkouts.includes(workout.id || '')
                            ? 'bg-blue-50 border-blue-300'
                            : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                        }`}
                      >
                        <Checkbox
                          checked={selectedWorkouts.includes(workout.id || '')}
                          onCheckedChange={() => workout.id && toggleWorkout(workout.id)}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            Semana {workout.week} - {workout.day}
                          </div>
                          <div className="text-xs text-gray-600">
                            {workout.mesociclo || workout.bloque || "Sin bloque"} • {workout.distance}m
                            {workout.group && (
                              <span className="ml-2">
                                • Grupo {workout.group === "Ambos" ? "Ambos" : workout.group}
                              </span>
                            )}
                          </div>
                        </div>
                        {workout.bloque && (
                          <Badge className="bg-green-100 text-green-700 border-green-300">
                            {workout.bloque}
                          </Badge>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Opciones de actualización */}
                {selectedWorkouts.length > 0 && (
                  <div className="border-t pt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Asignar Bloque</Label>
                        <Select value={selectedBloque} onValueChange={setSelectedBloque}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {bloqueDefinitions.map(def => (
                              <SelectItem key={def.name} value={def.name}>
                                {def.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Asignar Grupo</Label>
                        <Select 
                          value={String(selectedGroup)} 
                          onValueChange={(v) => setSelectedGroup(v === "Ambos" ? "Ambos" : parseInt(v) as 1 | 2)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ambos">🏊 Ambos Grupos</SelectItem>
                            <SelectItem value="1">👶 Grupo 1</SelectItem>
                            <SelectItem value="2">🏅 Grupo 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button onClick={applyBulkChanges} className="w-full bg-red-600 hover:bg-red-700">
                      <CheckSquare className="w-4 h-4 mr-2" />
                      Aplicar a {selectedWorkouts.length} entrenamientos
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}