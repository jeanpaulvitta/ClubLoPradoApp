import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Activity, 
  Dumbbell, 
  Heart, 
  Zap, 
  Timer, 
  TrendingUp,
  Target,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export function PhysicalPreparation() {
  const [selectedCategory, setSelectedCategory] = useState<"strength" | "flexibility" | "core" | "cardio">("strength");

  // Ejercicios de Fuerza
  const strengthExercises = [
    {
      name: "Sentadillas",
      sets: "3-4 series",
      reps: "12-15 repeticiones",
      rest: "60-90 seg",
      focus: "Cuádriceps, glúteos, core",
      level: "Todos los niveles"
    },
    {
      name: "Plancha",
      sets: "3-4 series",
      reps: "30-60 seg",
      rest: "45-60 seg",
      focus: "Core, estabilidad",
      level: "Todos los niveles"
    },
    {
      name: "Flexiones",
      sets: "3 series",
      reps: "10-15 repeticiones",
      rest: "60 seg",
      focus: "Pectorales, tríceps, hombros",
      level: "Intermedio-Avanzado"
    },
    {
      name: "Dominadas/Pull-ups",
      sets: "3-4 series",
      reps: "6-12 repeticiones",
      rest: "90-120 seg",
      focus: "Dorsales, bíceps",
      level: "Avanzado"
    },
    {
      name: "Peso muerto",
      sets: "3 series",
      reps: "8-12 repeticiones",
      rest: "90-120 seg",
      focus: "Cadena posterior completa",
      level: "Intermedio-Avanzado"
    }
  ];

  // Ejercicios de Flexibilidad
  const flexibilityExercises = [
    {
      name: "Estiramiento de hombros",
      duration: "30-45 seg por lado",
      focus: "Movilidad de hombros",
      when: "Pre y post entrenamiento"
    },
    {
      name: "Estiramiento de tobillos",
      duration: "20-30 seg por lado",
      focus: "Movilidad de tobillos",
      when: "Pre entrenamiento"
    },
    {
      name: "Cat-Cow (Gato-Vaca)",
      duration: "10-15 repeticiones",
      focus: "Movilidad de columna",
      when: "Pre entrenamiento"
    },
    {
      name: "Estiramiento de isquiotibiales",
      duration: "30-45 seg por pierna",
      focus: "Flexibilidad de piernas",
      when: "Post entrenamiento"
    },
    {
      name: "Rotaciones de cadera",
      duration: "10 repeticiones por lado",
      focus: "Movilidad de cadera",
      when: "Pre entrenamiento"
    }
  ];

  // Ejercicios de Core
  const coreExercises = [
    {
      name: "Plancha frontal",
      sets: "3-4 series",
      duration: "30-60 seg",
      focus: "Core anterior",
      level: "Todos los niveles"
    },
    {
      name: "Plancha lateral",
      sets: "3 series",
      duration: "20-45 seg por lado",
      focus: "Oblicuos",
      level: "Intermedio"
    },
    {
      name: "Dead bug",
      sets: "3 series",
      reps: "10-15 por lado",
      focus: "Estabilidad core",
      level: "Todos los niveles"
    },
    {
      name: "Bicicleta abdominal",
      sets: "3 series",
      reps: "20-30 repeticiones",
      focus: "Oblicuos, recto abdominal",
      level: "Intermedio"
    },
    {
      name: "Superman",
      sets: "3 series",
      reps: "12-15 repeticiones",
      focus: "Lumbar, glúteos",
      level: "Todos los niveles"
    }
  ];

  // Ejercicios Cardiovasculares complementarios
  const cardioExercises = [
    {
      name: "Carrera continua",
      duration: "20-30 min",
      intensity: "60-70% FC máx",
      benefit: "Resistencia aeróbica base",
      frequency: "1-2 veces/semana"
    },
    {
      name: "Saltos de cuerda",
      duration: "3-5 series de 2-3 min",
      intensity: "Alta",
      benefit: "Coordinación, resistencia",
      frequency: "2-3 veces/semana"
    },
    {
      name: "Burpees",
      duration: "3-4 series de 30-45 seg",
      intensity: "Alta",
      benefit: "Potencia, resistencia",
      frequency: "2 veces/semana"
    },
    {
      name: "Ciclismo",
      duration: "30-45 min",
      intensity: "Moderada",
      benefit: "Resistencia, recuperación activa",
      frequency: "1-2 veces/semana"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Activity className="w-7 h-7 text-orange-600" />
            Preparación Física
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Ejercicios complementarios para mejorar el rendimiento en natación
          </p>
        </CardHeader>
      </Card>

      {/* Información importante */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-2">Recomendaciones generales:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Realizar calentamiento previo de 5-10 minutos</li>
                <li>Mantener una técnica correcta en cada ejercicio</li>
                <li>Progresar gradualmente en intensidad y volumen</li>
                <li>Integrar estos ejercicios 2-3 veces por semana fuera del agua</li>
                <li>Consultar al entrenador antes de iniciar cualquier programa</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selector de categorías */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedCategory === "strength" ? "default" : "outline"}
              onClick={() => setSelectedCategory("strength")}
              className={`gap-2 ${selectedCategory === "strength" ? "bg-orange-600 hover:bg-orange-700" : ""}`}
            >
              <Dumbbell className="w-4 h-4" />
              Fuerza
            </Button>
            <Button
              variant={selectedCategory === "core" ? "default" : "outline"}
              onClick={() => setSelectedCategory("core")}
              className={`gap-2 ${selectedCategory === "core" ? "bg-orange-600 hover:bg-orange-700" : ""}`}
            >
              <Target className="w-4 h-4" />
              Core
            </Button>
            <Button
              variant={selectedCategory === "flexibility" ? "default" : "outline"}
              onClick={() => setSelectedCategory("flexibility")}
              className={`gap-2 ${selectedCategory === "flexibility" ? "bg-orange-600 hover:bg-orange-700" : ""}`}
            >
              <Zap className="w-4 h-4" />
              Flexibilidad
            </Button>
            <Button
              variant={selectedCategory === "cardio" ? "default" : "outline"}
              onClick={() => setSelectedCategory("cardio")}
              className={`gap-2 ${selectedCategory === "cardio" ? "bg-orange-600 hover:bg-orange-700" : ""}`}
            >
              <Heart className="w-4 h-4" />
              Cardio
            </Button>
          </div>

          {/* Contenido según categoría */}
          {selectedCategory === "strength" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-bold text-gray-800">Ejercicios de Fuerza</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {strengthExercises.map((exercise, idx) => (
                  <Card key={idx} className="border-orange-200 hover:shadow-lg transition-shadow">
                    <CardContent className="pt-4">
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        {exercise.name}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-gray-600 min-w-[80px]">Series:</span>
                          <span className="text-gray-700">{exercise.sets}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-gray-600 min-w-[80px]">Reps:</span>
                          <span className="text-gray-700">{exercise.reps}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-gray-600 min-w-[80px]">Descanso:</span>
                          <span className="text-gray-700">{exercise.rest}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-gray-600 min-w-[80px]">Enfoque:</span>
                          <span className="text-gray-700">{exercise.focus}</span>
                        </div>
                        <div className="mt-3">
                          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                            {exercise.level}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {selectedCategory === "core" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-bold text-gray-800">Ejercicios de Core</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coreExercises.map((exercise, idx) => (
                  <Card key={idx} className="border-orange-200 hover:shadow-lg transition-shadow">
                    <CardContent className="pt-4">
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        {exercise.name}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-gray-600 min-w-[80px]">Series:</span>
                          <span className="text-gray-700">{exercise.sets}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-gray-600 min-w-[80px]">
                            {exercise.reps ? "Reps:" : "Duración:"}
                          </span>
                          <span className="text-gray-700">{exercise.reps || exercise.duration}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-gray-600 min-w-[80px]">Enfoque:</span>
                          <span className="text-gray-700">{exercise.focus}</span>
                        </div>
                        <div className="mt-3">
                          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                            {exercise.level}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {selectedCategory === "flexibility" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-bold text-gray-800">Ejercicios de Flexibilidad y Movilidad</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {flexibilityExercises.map((exercise, idx) => (
                  <Card key={idx} className="border-orange-200 hover:shadow-lg transition-shadow">
                    <CardContent className="pt-4">
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        {exercise.name}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-gray-600 min-w-[80px]">Duración:</span>
                          <span className="text-gray-700">{exercise.duration}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-gray-600 min-w-[80px]">Enfoque:</span>
                          <span className="text-gray-700">{exercise.focus}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-gray-600 min-w-[80px]">Cuándo:</span>
                          <span className="text-gray-700">{exercise.when}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {selectedCategory === "cardio" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-bold text-gray-800">Ejercicios Cardiovasculares Complementarios</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cardioExercises.map((exercise, idx) => (
                  <Card key={idx} className="border-orange-200 hover:shadow-lg transition-shadow">
                    <CardContent className="pt-4">
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        {exercise.name}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-gray-600 min-w-[90px]">Duración:</span>
                          <span className="text-gray-700">{exercise.duration}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-gray-600 min-w-[90px]">Intensidad:</span>
                          <span className="text-gray-700">{exercise.intensity}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-gray-600 min-w-[90px]">Beneficio:</span>
                          <span className="text-gray-700">{exercise.benefit}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-gray-600 min-w-[90px]">Frecuencia:</span>
                          <span className="text-gray-700">{exercise.frequency}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Beneficios de la preparación física */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <TrendingUp className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Beneficios de la Preparación Física en Natación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Mejora la fuerza y potencia muscular</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Prevención de lesiones</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Aumenta la estabilidad del core</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Mejora la flexibilidad y movilidad</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Optimiza el rendimiento en el agua</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Fortalece la resistencia cardiovascular</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
