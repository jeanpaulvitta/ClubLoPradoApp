import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users, Calendar, Target, TrendingUp, CalendarDays, Trophy, Info } from "lucide-react";

interface SeasonStructureInfoProps {
  selectedGroup: "group1" | "group2";
}

export function SeasonStructureInfo({ selectedGroup }: SeasonStructureInfoProps) {
  const group1Info = {
    name: "Grupo 1 (Menores)",
    categories: ["Inf E '18", "Inf D '17", "Inf C '16", "Inf A '15"],
    totalWeeks: 20,
    structure: [
      { name: "Base", weeks: 6, focus: "Resistencia aeróbica y técnica fundamental", color: "bg-blue-100 text-blue-800" },
      { name: "Desarrollo", weeks: 6, focus: "Aumento progresivo de volumen e intensidad", color: "bg-purple-100 text-purple-800" },
      { name: "Pre-competitivo", weeks: 4, focus: "Trabajo específico de competencia y velocidad", color: "bg-orange-100 text-orange-800" },
      { name: "Competitivo", weeks: 4, focus: "Puesta a punto y campeonatos", color: "bg-red-100 text-red-800" },
    ],
    objectives: [
      "Construcción sólida de técnica de nado",
      "Desarrollo gradual de capacidad aeróbica",
      "Introducción progresiva a competencias",
      "Mayor énfasis en volumen que en intensidad"
    ]
  };

  const group2Info = {
    name: "Grupo 2 (Mayores)",
    categories: ["Inf B1 '14", "Inf B2 '13", "Juv A1 '12", "Juv A2 '11", "Juv B1 '10", "Juv B2 '09", "Juv B3 '08", "Mayores '07"],
    totalWeeks: 20,
    structure: [
      { name: "Base", weeks: 5, focus: "Resistencia aeróbica y capacidad", color: "bg-blue-100 text-blue-800" },
      { name: "Desarrollo", weeks: 5, focus: "Intensidad, velocidad y potencia", color: "bg-purple-100 text-purple-800" },
      { name: "Pre-competitivo", weeks: 5, focus: "Trabajo específico y ritmo de carrera", color: "bg-orange-100 text-orange-800" },
      { name: "Competitivo", weeks: 5, focus: "Puesta a punto, tapering y campeonato", color: "bg-red-100 text-red-800" },
    ],
    objectives: [
      "Desarrollo avanzado de capacidad aeróbica",
      "Mayor énfasis en velocidad e intensidad",
      "Preparación específica para competencias",
      "Implementación de tapering estratégico"
    ]
  };

  const currentInfo = selectedGroup === "group1" ? group1Info : group2Info;

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-white border-2 border-red-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-base sm:text-lg">
          <Info className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="break-words">Información de la Estructura: {currentInfo.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Categorías */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-red-600 flex-shrink-0" />
            Categorías Incluidas
          </h4>
          <div className="flex flex-wrap gap-2">
            {currentInfo.categories.map((cat) => (
              <Badge key={cat} variant="outline" className="bg-red-50 border-red-200 text-red-700 text-xs sm:text-sm">
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* Estructura de Mesociclos */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="break-words">Estructura de Mesociclos ({currentInfo.totalWeeks} semanas totales)</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {currentInfo.structure.map((phase) => (
              <div key={phase.name} className="bg-white rounded-lg border p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm flex-1 min-w-0 break-words">{phase.name}</span>
                  <Badge className={`${phase.color} flex-shrink-0`}>{phase.weeks} sem</Badge>
                </div>
                <p className="text-xs text-gray-600 break-words">{phase.focus}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Objetivos */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-red-600 flex-shrink-0" />
            Objetivos Principales
          </h4>
          <ul className="space-y-1.5">
            {currentInfo.objectives.map((obj, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-red-500 mt-0.5 flex-shrink-0">•</span>
                <span className="break-words">{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Diferencias Clave */}
        {selectedGroup === "group1" ? (
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
            <p className="text-xs sm:text-sm text-blue-900 break-words">
              <strong>💡 Enfoque Grupo 1:</strong> Mayor duración en fases Base y Desarrollo (6 semanas c/u) 
              para construir fundamentos sólidos. Fases competitivas más cortas (4 semanas) adaptadas a la 
              madurez deportiva de nadadores menores.
            </p>
          </div>
        ) : (
          <div className="bg-purple-50 rounded-lg p-3 sm:p-4 border border-purple-200">
            <p className="text-xs sm:text-sm text-purple-900 break-words">
              <strong>💡 Enfoque Grupo 2:</strong> Distribución equilibrada de 5 semanas por fase, 
              permitiendo mayor intensidad y especificidad. Incluye tapering estratégico en fase competitiva 
              para nadadores con mayor experiencia.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}