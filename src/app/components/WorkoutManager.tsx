import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Plus, Edit, Trash2, Dumbbell, Calendar, Users, Filter, Calculator, ChevronUp, ChevronDown } from "lucide-react";
import type { Workout } from "../data/workouts";
import { useAuth } from "../contexts/AuthContext";
import { getGroupName } from "../utils/swimmerUtils";
import { Badge } from "./ui/badge";

interface WorkoutManagerProps {
  workouts: Workout[];
  onAddWorkout: (workout: Omit<Workout, "id">) => void;
  onEditWorkout: (id: string, workout: Omit<Workout, "id">) => void;
  onDeleteWorkout: (id: string) => void;
  defaultGroup?: 1 | 2; // Nuevo prop opcional para establecer el grupo por defecto
  preselectedMesociclo?: string; // Nuevo prop para pre-seleccionar mesociclo desde los bloques
  autoOpenDialog?: boolean; // Nuevo prop para abrir automáticamente el diálogo
}

export function WorkoutManager({ 
  workouts, 
  onAddWorkout, 
  onEditWorkout, 
  onDeleteWorkout, 
  defaultGroup,
  preselectedMesociclo,
  autoOpenDialog = false
}: WorkoutManagerProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "coach";
  
  const [dialogOpen, setDialogOpen] = useState(autoOpenDialog);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [multiDayMode, setMultiDayMode] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(["Lunes"]);
  const [multiScheduleMode, setMultiScheduleMode] = useState(false);
  const [selectedSchedules, setSelectedSchedules] = useState<("AM" | "PM")[]>(["AM"]);
  const [groupFilter, setGroupFilter] = useState<"all" | 1 | 2>(defaultGroup || "all");
  const [formData, setFormData] = useState<Omit<Workout, "id">>({
    week: 1,
    date: "",
    day: "Lunes",
    schedule: "AM",
    mesociclo: preselectedMesociclo || "Bloque 1",
    distance: 1500,
    duration: 60,
    warmup: "",
    mainSet: [""],
    cooldown: "",
    intensity: "Media",
    group: defaultGroup || 1,
  });

  // Sincronizar el filtro de grupo cuando cambie defaultGroup
  useEffect(() => {
    if (defaultGroup) {
      setGroupFilter(defaultGroup);
    }
  }, [defaultGroup]);

  // Actualizar el grupo por defecto del formulario cuando cambie defaultGroup
  useEffect(() => {
    if (defaultGroup && !editingWorkout) {
      setFormData(prev => ({
        ...prev,
        group: defaultGroup
      }));
    }
  }, [defaultGroup, editingWorkout]);

  // Calcular automáticamente el día de la semana cuando cambia la fecha
  useEffect(() => {
    if (formData.date) {
      const date = new Date(formData.date + 'T00:00:00'); // Añadir hora para evitar problemas de zona horaria
      const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      const dayName = dayNames[date.getDay()];
      setFormData(prev => ({ ...prev, day: dayName }));
    }
  }, [formData.date]);

  const availableDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const availableSchedules: ("AM" | "PM")[] = ["AM", "PM"];

  // Función para calcular la distancia total del entrenamiento
  const calculateTotalDistance = () => {
    let total = 0;
    
    // Calcular metros del calentamiento
    const warmupMeters = extractMeters(formData.warmup);
    total += warmupMeters;
    
    // Calcular metros de las series principales
    formData.mainSet.forEach(set => {
      const setMeters = extractMeters(set);
      total += setMeters;
    });
    
    // Calcular metros del enfriamiento
    const cooldownMeters = extractMeters(formData.cooldown);
    total += cooldownMeters;
    
    return total;
  };

  // Función para calcular el tiempo estimado del entrenamiento
  const calculateEstimatedTime = () => {
    // Ritmos base por intensidad (segundos por 100m)
    const paceByIntensity: Record<string, number> = {
      "Baja": 120,      // 2:00 por 100m (ritmo suave)
      "Media": 105,     // 1:45 por 100m (ritmo moderado)
      "Alta": 90,       // 1:30 por 100m (ritmo fuerte)
      "Muy alta": 75    // 1:15 por 100m (ritmo intenso)
    };

    const baseTime = paceByIntensity[formData.intensity] || 105;
    
    // Calcular tiempo nadando (en minutos)
    const warmupMeters = extractMeters(formData.warmup);
    const warmupTime = (warmupMeters / 100) * (baseTime + 15) / 60; // Más lento para calentamiento
    
    let mainSetTime = 0;
    formData.mainSet.forEach(set => {
      const setMeters = extractMeters(set);
      const restTime = extractRestTime(set);
      const swimTime = (setMeters / 100) * baseTime / 60;
      mainSetTime += swimTime + restTime;
    });
    
    const cooldownMeters = extractMeters(formData.cooldown);
    const cooldownTime = (cooldownMeters / 100) * (baseTime + 20) / 60; // Más lento para enfriamiento
    
    // Sumar tiempos + tiempo de transición (3-5 minutos entre secciones)
    const totalTime = warmupTime + mainSetTime + cooldownTime + 5;
    
    return Math.round(totalTime);
  };

  // Función auxiliar para extraer tiempo de descanso de una serie (en minutos)
  const extractRestTime = (text: string): number => {
    if (!text) return 0;
    
    // Buscar descanso en segundos (ej: "descanso 20s", "rec 30s", "@ 1:30")
    const secondsMatch = text.match(/(?:descanso|rec|rest|@)\s*(\d+)\s*s/i);
    if (secondsMatch) {
      const seconds = parseInt(secondsMatch[1]);
      
      // Calcular número de repeticiones para multiplicar el descanso
      const seriesMatch = text.match(/(\d+)\s*[x×]/i);
      const repetitions = seriesMatch ? parseInt(seriesMatch[1]) : 1;
      
      return (seconds * repetitions) / 60; // Convertir a minutos
    }
    
    // Buscar descanso en minutos (ej: "descanso 2min", "rec 1:30")
    const minutesMatch = text.match(/(?:descanso|rec|rest|@)\s*(\d+)(?::(\d+))?\s*m/i);
    if (minutesMatch) {
      const minutes = parseInt(minutesMatch[1]);
      const seconds = minutesMatch[2] ? parseInt(minutesMatch[2]) : 0;
      
      const seriesMatch = text.match(/(\d+)\s*[x×]/i);
      const repetitions = seriesMatch ? parseInt(seriesMatch[1]) : 1;
      
      return (minutes + seconds / 60) * repetitions;
    }
    
    // Si hay series pero no se especifica descanso, asumir 15 segundos por repetición
    const seriesMatch = text.match(/(\d+)\s*[x×]/i);
    if (seriesMatch) {
      const repetitions = parseInt(seriesMatch[1]);
      return (repetitions * 15) / 60; // 15 segundos de descanso por repetición
    }
    
    return 0;
  };

  // Función auxiliar para extraer metros de una cadena de texto
  const extractMeters = (text: string): number => {
    if (!text) return 0;
    
    let totalMeters = 0;
    
    // Primero buscar series (ej: "4 x 100m")
    const seriesMatch = text.match(/(\d+)\s*[x×]\s*(\d+)\s*m/gi);
    if (seriesMatch) {
      seriesMatch.forEach(match => {
        const parts = match.match(/(\d+)\s*[x×]\s*(\d+)/i);
        if (parts) {
          const repetitions = parseInt(parts[1]);
          const distance = parseInt(parts[2]);
          totalMeters += repetitions * distance;
          console.log(`📊 Serie detectada: ${repetitions} x ${distance}m = ${repetitions * distance}m`);
        }
      });
      return totalMeters;
    }
    
    // Si no hay series, buscar metros simples (ej: "400m" o "400 m")
    const simpleMatch = text.match(/(\d+)\s*m/gi);
    if (simpleMatch) {
      simpleMatch.forEach(match => {
        const meters = parseInt(match.replace(/\D/g, ''));
        totalMeters += meters;
        console.log(`📊 Distancia simple detectada: ${meters}m`);
      });
    }
    
    console.log(`📊 Total extraído de "${text}": ${totalMeters}m`);
    return totalMeters;
  };

  // Actualizar distancia automáticamente cuando cambian los sets
  useEffect(() => {
    const calculatedDistance = calculateTotalDistance();
    if (calculatedDistance > 0) {
      setFormData(prev => ({ ...prev, distance: calculatedDistance }));
    }
  }, [formData.warmup, JSON.stringify(formData.mainSet), formData.cooldown]);

  // Filtrar entrenamientos
  const filteredWorkouts = workouts.filter((workout) => {
    // Ignorar entrenamientos eliminados
    if (workout.deleted) {
      return false;
    }
    
    // Mostrar todos si el filtro es "all"
    if (groupFilter === "all") {
      return true;
    }
    
    // Comparar convirtiendo ambos a string para evitar problemas de tipo
    return String(workout.group) === String(groupFilter);
  });

  // Agrupar entrenamientos por mesociclo y grupo
  const workoutsByMesocicloAndGroup = filteredWorkouts.reduce((acc, workout) => {
    const key = `${workout.mesociclo}-${workout.group || 1}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(workout);
    return acc;
  }, {} as Record<string, Workout[]>);

  const toggleDaySelection = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const toggleScheduleSelection = (schedule: "AM" | "PM") => {
    setSelectedSchedules(prev => 
      prev.includes(schedule) 
        ? prev.filter(s => s !== schedule)
        : [...prev, schedule]
    );
  };

  const handleSubmit = () => {
    if (editingWorkout && editingWorkout.id) {
      onEditWorkout(editingWorkout.id, formData);
    } else {
      // Determinar qué días y horarios usar
      const daysToUse = multiDayMode && selectedDays.length > 0 ? selectedDays : [formData.day];
      const schedulesToUse = multiScheduleMode && selectedSchedules.length > 0 ? selectedSchedules : [formData.schedule || "AM"];
      
      // Crear un entrenamiento para cada combinación de día y horario
      daysToUse.forEach(day => {
        schedulesToUse.forEach(schedule => {
          onAddWorkout({
            ...formData,
            day: day,
            schedule: schedule
          });
        });
      });
    }
    setDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      week: 1,
      date: "",
      day: "Lunes",
      schedule: "AM",
      mesociclo: preselectedMesociclo || "Bloque 1",
      distance: 1500,
      duration: 60,
      warmup: "",
      mainSet: [""],
      cooldown: "",
      intensity: "Media",
      group: defaultGroup || 1,
    });
    setEditingWorkout(null);
    setMultiDayMode(false);
    setSelectedDays(["Lunes"]);
    setMultiScheduleMode(false);
    setSelectedSchedules(["AM"]);
  };

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout);
    setFormData({
      week: workout.week,
      date: workout.date,
      day: workout.day,
      schedule: workout.schedule || "AM",
      mesociclo: workout.mesociclo,
      distance: workout.distance,
      duration: workout.duration,
      warmup: workout.warmup,
      mainSet: workout.mainSet,
      cooldown: workout.cooldown,
      intensity: workout.intensity,
      group: workout.group, // Incluir el grupo al editar
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este entrenamiento?")) {
      onDeleteWorkout(id);
    }
  };

  const updateMainSet = (index: number, value: string) => {
    const newMainSet = [...formData.mainSet];
    newMainSet[index] = value;
    setFormData({ ...formData, mainSet: newMainSet });
  };

  const addMainSetItem = () => {
    setFormData({ ...formData, mainSet: [...formData.mainSet, ""] });
  };

  const removeMainSetItem = (index: number) => {
    const newMainSet = formData.mainSet.filter((_, i) => i !== index);
    setFormData({ ...formData, mainSet: newMainSet });
  };

  const moveMainSetItemUp = (index: number) => {
    if (index === 0) return; // No se puede mover el primer elemento hacia arriba
    const newMainSet = [...formData.mainSet];
    [newMainSet[index - 1], newMainSet[index]] = [newMainSet[index], newMainSet[index - 1]];
    setFormData({ ...formData, mainSet: newMainSet });
  };

  const moveMainSetItemDown = (index: number) => {
    if (index === formData.mainSet.length - 1) return; // No se puede mover el último elemento hacia abajo
    const newMainSet = [...formData.mainSet];
    [newMainSet[index], newMainSet[index + 1]] = [newMainSet[index + 1], newMainSet[index]];
    setFormData({ ...formData, mainSet: newMainSet });
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-blue-600" />
            <CardTitle>Gestionar Entrenamientos</CardTitle>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 px-2">
                <Plus className="w-3 h-3 mr-1" />
                Agregar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingWorkout ? "Editar Entrenamiento" : "Nuevo Entrenamiento"}
                </DialogTitle>
                <DialogDescription>
                  {editingWorkout ? "Modifica los detalles del entrenamiento existente." : "Añade un nuevo entrenamiento a tu plan."}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Fecha del Entrenamiento
                  </Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    📅 El día de la semana se calcula automáticamente
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Horario</Label>
                  <Select value={formData.schedule} onValueChange={(value) => setFormData({ ...formData, schedule: value as "AM" | "PM" })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">🌅 Mañana (AM)</SelectItem>
                      <SelectItem value="PM">🌆 Tarde (PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Mesociclo</Label>
                  {preselectedMesociclo && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-md mb-2">
                      <p className="text-xs font-semibold text-red-600">
                        🎯 Creando entrenamiento para: {preselectedMesociclo}
                      </p>
                    </div>
                  )}
                  <select 
                    value={formData.mesociclo} 
                    onChange={(e) => setFormData({ ...formData, mesociclo: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Bloque 1">Bloque 1 - Velocidad (9 Feb - 21 Mar)</option>
                    <option value="Bloque 2">Bloque 2 - Fondo (23 Mar - 19 Abr)</option>
                    <option value="Bloque 3">Bloque 3 - Medio Fondo (20 Abr - 17 May)</option>
                    <option value="Bloque 4">Bloque 4 - Competitivo (18 May - 5 Jul)</option>
                    <option value="Bloque 5">Bloque 5 - Internacional (6 Jul - 16 Ago)</option>
                    <option value="Bloque 6">Bloque 6 - Velocidad (17 Ago - 13 Sep)</option>
                    <option value="Bloque 7">Bloque 7 - Fondo (14 Sep - 4 Oct)</option>
                    <option value="Bloque 8">Bloque 8 - Medio Fondo (5 Oct - 8 Nov)</option>
                    <option value="Bloque 9">Bloque 9 - Preparación (9 Nov - 9 Ene)</option>
                    <option value="Bloque 10">Bloque 10 - Pico Competitivo (10 Ene - 7 Feb)</option>
                  </select>
                </div>

                {/* Selector de Grupo de Entrenamiento */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-red-600" />
                    Grupo de Entrenamiento
                  </Label>
                  <Select 
                    value={String(formData.group)} 
                    onValueChange={(value) => setFormData({ 
                      ...formData, 
                      group: parseInt(value) as 1 | 2 
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">👶 Grupo 1: Menores hasta Inf A</SelectItem>
                      <SelectItem value="2">🏅 Grupo 2: Inf B hasta Mayores</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    {formData.group === 1 && "Inf E, Inf D, Inf C, Inf A"}
                    {formData.group === 2 && "Inf B1, Inf B2, Juv A1, Juv A2, Juv B1, Juv B2, Juv B3, Mayores"}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-green-600" />
                      Distancia Total (m)
                    </Label>
                    <Input
                      type="number"
                      min="1000"
                      step="100"
                      value={formData.distance}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 1500 : parseInt(e.target.value) || 1500;
                        setFormData({ ...formData, distance: value });
                      }}
                      className="bg-green-50 border-green-300"
                    />
                    {!editingWorkout && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <Calculator className="w-3 h-3" />
                        Calculado automáticamente
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Duración (min)</Label>
                    <Input
                      type="number"
                      min="30"
                      step="5"
                      value={formData.duration}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 60 : parseInt(e.target.value) || 60;
                        setFormData({ ...formData, duration: value });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Intensidad</Label>
                    <Select value={formData.intensity} onValueChange={(value) => setFormData({ ...formData, intensity: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baja">Baja</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Muy alta">Muy alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Información del cálculo de distancia */}
                {calculateTotalDistance() > 0 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="w-4 h-4 text-green-600" />
                      <p className="text-sm font-semibold text-green-800">Cálculo Automático de Distancia</p>
                    </div>
                    <div className="text-xs text-green-700 space-y-1">
                      <p>• Calentamiento: {extractMeters(formData.warmup)}m</p>
                      <p>• Series principales: {formData.mainSet.reduce((sum, set) => sum + extractMeters(set), 0)}m</p>
                      <p>• Enfriamiento: {extractMeters(formData.cooldown)}m</p>
                      <p className="font-semibold pt-1 border-t border-green-300">Total: {calculateTotalDistance()}m</p>
                    </div>
                  </div>
                )}

                {/* Información del cálculo de tiempo */}
                {calculateEstimatedTime() > 0 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-blue-600" />
                        <p className="text-sm font-semibold text-blue-800">Tiempo Estimado de Sesión</p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs bg-white hover:bg-blue-100"
                        onClick={() => {
                          const estimatedTime = calculateEstimatedTime();
                          setFormData({ ...formData, duration: estimatedTime });
                        }}
                      >
                        Aplicar tiempo estimado
                      </Button>
                    </div>
                    <div className="text-xs text-blue-700 space-y-1">
                      <p>• Basado en intensidad: <strong>{formData.intensity}</strong></p>
                      <p>• Incluye tiempo de nado + descansos + transiciones</p>
                      <p className="font-semibold pt-1 border-t border-blue-300 text-base">
                        ⏱️ Tiempo Total Estimado: <span className="text-blue-900">{calculateEstimatedTime()} minutos</span>
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Calentamiento</Label>
                  <Input
                    placeholder="Ej: 300m estilo libre suave + 200m técnica"
                    value={formData.warmup}
                    onChange={(e) => setFormData({ ...formData, warmup: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Series Principales</Label>
                  {formData.mainSet.map((item, index) => (
                    <div key={`mainset-${index}`} className="flex gap-2 items-center">
                      <div className="flex-1">
                        <Input
                          placeholder="Ej: 4 x 100m estilo libre (descanso 20s)"
                          value={item}
                          onChange={(e) => updateMainSet(index, e.target.value)}
                        />
                      </div>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveMainSetItemUp(index)}
                          disabled={index === 0}
                          className="px-2"
                          title="Mover arriba"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveMainSetItemDown(index)}
                          disabled={index === formData.mainSet.length - 1}
                          className="px-2"
                          title="Mover abajo"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                        {formData.mainSet.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeMainSetItem(index)}
                            className="px-2"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addMainSetItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Serie
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Enfriamiento</Label>
                  <Input
                    placeholder="Ej: 200m estilo libre suave"
                    value={formData.cooldown}
                    onChange={(e) => setFormData({ ...formData, cooldown: e.target.value })}
                  />
                </div>

                {/* Modo Multi-Día - Solo visible cuando NO estamos editando */}
                {!editingWorkout && (
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Checkbox
                        id="multi-day-mode"
                        checked={multiDayMode}
                        onCheckedChange={(checked) => {
                          setMultiDayMode(checked as boolean);
                          if (checked) {
                            setSelectedDays([formData.day]); // Incluir el día actual como seleccionado
                          }
                        }}
                      />
                      <Label 
                        htmlFor="multi-day-mode" 
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold">Crear para múltiples días</span>
                      </Label>
                    </div>
                    
                    {multiDayMode && (
                      <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-700 mb-2">
                          Selecciona los días para los cuales crear este entrenamiento:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {availableDays.map(day => (
                            <Button
                              key={day}
                              type="button"
                              size="sm"
                              variant={selectedDays.includes(day) ? "default" : "outline"}
                              onClick={() => toggleDaySelection(day)}
                              className={selectedDays.includes(day) ? 'bg-blue-600 hover:bg-blue-700' : ''}
                            >
                              {day}
                            </Button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          {selectedDays.length > 0 
                            ? `Se crearán ${selectedDays.length} entrenamiento(s): ${selectedDays.join(', ')}`
                            : 'Selecciona al menos un día'}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Modo Multi-Horario - Solo visible cuando NO estamos editando */}
                {!editingWorkout && (
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Checkbox
                        id="multi-schedule-mode"
                        checked={multiScheduleMode}
                        onCheckedChange={(checked) => {
                          setMultiScheduleMode(checked as boolean);
                          if (checked) {
                            setSelectedSchedules([formData.schedule || "AM"]); // Incluir el horario actual como seleccionado
                          }
                        }}
                      />
                      <Label 
                        htmlFor="multi-schedule-mode" 
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold">Crear para múltiples horarios</span>
                      </Label>
                    </div>
                    
                    {multiScheduleMode && (
                      <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-700 mb-2">
                          Selecciona los horarios para los cuales crear este entrenamiento:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {availableSchedules.map(schedule => (
                            <Button
                              key={schedule}
                              type="button"
                              size="sm"
                              variant={selectedSchedules.includes(schedule) ? "default" : "outline"}
                              onClick={() => toggleScheduleSelection(schedule)}
                              className={selectedSchedules.includes(schedule) ? 'bg-blue-600 hover:bg-blue-700' : ''}
                            >
                              {schedule}
                            </Button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          {selectedSchedules.length > 0 
                            ? `Se crearán ${selectedSchedules.length} entrenamiento(s): ${selectedSchedules.join(', ')}`
                            : 'Selecciona al menos un horario'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
                  {editingWorkout ? "Guardar Cambios" : "Crear Entrenamiento"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4 space-y-3">
          <div className="text-sm text-gray-600">
            Total de entrenamientos: <span className="font-semibold text-red-600">{filteredWorkouts.length}</span>
          </div>
          
          {/* Vista rápida de entrenamientos por bloque */}
          {filteredWorkouts.length > 0 && (
            <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <p className="text-xs font-semibold text-gray-700 mb-2">📊 Distribución por Bloque:</p>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(filteredWorkouts.map(w => w.mesociclo))).sort((a, b) => {
                  // Extraer número del bloque para ordenar correctamente
                  const numA = parseInt(a.match(/\d+/)?.[0] || '0');
                  const numB = parseInt(b.match(/\d+/)?.[0] || '0');
                  return numA - numB;
                }).map(mesociclo => {
                  const count = filteredWorkouts.filter(w => w.mesociclo === mesociclo).length;
                  return (
                    <Badge key={mesociclo} variant="outline" className="text-xs bg-white">
                      {mesociclo}: <span className="font-bold ml-1">{count}</span>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {filteredWorkouts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Dumbbell className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 font-semibold mb-2">No hay entrenamientos disponibles</p>
            <p className="text-sm text-gray-500 mb-4">
              {workouts.length === 0 
                ? "Aún no se han creado entrenamientos. Haz clic en 'Agregar' para crear el primero."
                : `No hay entrenamientos para ${defaultGroup === 1 ? 'Grupo 1' : 'Grupo 2'}. Cambia de grupo o crea nuevos entrenamientos.`
              }
            </p>
            <p className="text-xs text-gray-400">
              💡 Los entrenamientos se organizan automáticamente por bloque y grupo
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {/* Agrupar por mesociclo */}
              {Array.from(new Set(filteredWorkouts.map(w => w.mesociclo))).sort((a, b) => {
                const numA = parseInt(a.match(/\d+/)?.[0] || '0');
                const numB = parseInt(b.match(/\d+/)?.[0] || '0');
                return numA - numB;
              }).map(mesociclo => {
                const bloqueWorkouts = filteredWorkouts.filter(w => w.mesociclo === mesociclo);
                const bloqueNumber = parseInt(mesociclo.match(/\d+/)?.[0] || '0');

                // Colores por bloque
                const bloqueColors: Record<number, { bg: string; border: string; header: string }> = {
                  1: { bg: 'bg-red-50', border: 'border-red-200', header: 'bg-red-500' },
                  2: { bg: 'bg-orange-50', border: 'border-orange-200', header: 'bg-orange-500' },
                  3: { bg: 'bg-yellow-50', border: 'border-yellow-200', header: 'bg-yellow-500' },
                  4: { bg: 'bg-green-50', border: 'border-green-200', header: 'bg-green-500' },
                  5: { bg: 'bg-teal-50', border: 'border-teal-200', header: 'bg-teal-500' },
                  6: { bg: 'bg-cyan-50', border: 'border-cyan-200', header: 'bg-cyan-500' },
                  7: { bg: 'bg-blue-50', border: 'border-blue-200', header: 'bg-blue-500' },
                  8: { bg: 'bg-indigo-50', border: 'border-indigo-200', header: 'bg-indigo-500' },
                  9: { bg: 'bg-purple-50', border: 'border-purple-200', header: 'bg-purple-500' },
                  10: { bg: 'bg-pink-50', border: 'border-pink-200', header: 'bg-pink-500' }
                };

                const colors = bloqueColors[bloqueNumber] || { bg: 'bg-gray-50', border: 'border-gray-200', header: 'bg-gray-500' };

                return (
                  <div key={mesociclo} className="flex-shrink-0 w-80">
                    <div className={`${colors.bg} border ${colors.border} rounded-lg h-full flex flex-col`}>
                      {/* Header de la columna */}
                      <div className={`${colors.header} text-white px-4 py-3 rounded-t-lg`}>
                        <h3 className="font-bold text-sm">{mesociclo}</h3>
                        <p className="text-xs opacity-90">{bloqueWorkouts.length} entrenamientos</p>
                      </div>

                      {/* Lista de entrenamientos */}
                      <div className="p-3 space-y-2 overflow-y-auto max-h-96 flex-1">
                        {bloqueWorkouts.sort((a, b) => a.date.localeCompare(b.date)).map((workout) => (
                          <div
                            key={workout.id}
                            className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all"
                          >
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-sm truncate">
                                    {workout.day}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {workout.date}
                                  </div>
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => handleEdit(workout)}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => workout.id && handleDelete(workout.id)}
                                  >
                                    <Trash2 className="w-3 h-3 text-red-600" />
                                  </Button>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {workout.schedule && (
                                  <Badge className="text-xs h-5 bg-blue-100 text-blue-700 border-blue-200">
                                    {workout.schedule === "AM" ? "🌅" : "🌆"}
                                  </Badge>
                                )}
                                {workout.group && (
                                  <Badge className={`text-xs h-5 ${
                                    workout.group === 1 ? "bg-purple-100 text-purple-700 border-purple-200" :
                                    "bg-green-100 text-green-700 border-green-200"
                                  }`}>
                                    G{workout.group}
                                  </Badge>
                                )}
                              </div>

                              <div className="text-xs text-gray-600 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span>Distancia:</span>
                                  <span className="font-semibold text-red-600">{workout.distance}m</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Intensidad:</span>
                                  <span className="font-semibold">{workout.intensity}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}