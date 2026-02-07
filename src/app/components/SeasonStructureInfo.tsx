import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users, Calendar, Target, Trophy, Info } from "lucide-react";

interface SeasonStructureInfoProps {
  selectedGroup: "group1" | "group2";
}

export function SeasonStructureInfo({ selectedGroup }: SeasonStructureInfoProps) {
  const group1Info = {
    name: "Grupo 1 (Menores)",
    categories: ["Inf E '18", "Inf D '17", "Inf C '16", "Inf A '15"],
    totalWeeks: 52,
    description: "Planificación completa temporada 2026-2027 enfocada en desarrollo técnico y progresión gradual",
    keyCompetitions: [
      "Festival de Menores (Jun 2026 y Ene 2027)",
      "Campeonato Nacional Infantil (Jun 2026 y Ene 2027)",
      "Copas Chile (velocidad, fondo y medio fondo)"
    ],
    objectives: [
      "Construcción sólida de técnica en los 4 estilos",
      "Desarrollo progresivo de capacidad aeróbica y velocidad",
      "Experiencia competitiva en diferentes distancias (50m a 1500m)",
      "Preparación específica para campeonatos nacionales de verano",
      "Énfasis en formación integral y fundamentos del alto rendimiento"
    ],
    focus: "Mayor énfasis en volumen y técnica durante bloques base. Exposición gradual a competencias de velocidad, fondo y medio fondo. Preparación específica para Festival de Menores y Nacional Infantil."
  };

  const group2Info = {
    name: "Grupo 2 (Mayores)",
    categories: ["Inf B1 '14", "Inf B2 '13", "Juv A1 '12", "Juv A2 '11", "Juv B1 '10", "Juv B2 '09", "Juv B3 '08", "Mayores '07"],
    totalWeeks: 52,
    description: "Planificación avanzada temporada 2026-2027 con enfoque en rendimiento competitivo internacional",
    keyCompetitions: [
      "Campeonato Nacional Infantil B1 y B2 (Jun 2026 y Ene 2027)",
      "Campeonato Internacional Brasil (Julio 2026)",
      "Campeonato Nacional de Categorías Juv-Mayores (Jul 2026 y Ene 2027)",
      "Nacional de Desarrollo (Ago 2026 y Ene 2027)",
      "Copas Chile en todas las distancias"
    ],
    objectives: [
      "Desarrollo avanzado de capacidad aeróbica y potencia anaeróbica",
      "Mayor énfasis en velocidad, intensidad y ritmo de competencia",
      "Preparación específica para competencias internacionales",
      "Implementación de tapering estratégico en bloques competitivos",
      "Control técnico en acumulación de pruebas múltiples",
      "Consolidación de rendimiento bajo presión competitiva"
    ],
    focus: "Distribución equilibrada entre volumen e intensidad. Experiencia internacional en Brasil. Mayor exposición competitiva y control de múltiples eventos. Preparación para picos de rendimiento en campeonatos nacionales."
  };

  const currentInfo = selectedGroup === "group1" ? group1Info : group2Info;

  // Bloques de la temporada 2026-2027
  const bloques = [
    { num: 1, weeks: 6, name: "Velocidad Inicial", competition: "Copa Chile 1 - 50m", date: "21-22 Mar" },
    { num: 2, weeks: 4, name: "Fondo", competition: "Copa Chile 2 - 800-1500m", date: "17-19 Abr" },
    { num: 3, weeks: 4, name: "Medio Fondo", competition: "Copa Chile 3 - 100-400m", date: "15-17 May" },
    { num: 4, weeks: 6, name: "Competitivo Mayor", competition: "Nacionales (Jun-Jul)", date: "6 Jun - 5 Jul" },
    { num: 5, weeks: 6, name: "Internacional", competition: "Brasil + Nacional Des.", date: "20 Jul - 16 Ago" },
    { num: 6, weeks: 4, name: "Velocidad 2", competition: "Copa Chile 1", date: "12-13 Sep" },
    { num: 7, weeks: 4, name: "Fondo 2", competition: "Copa Chile 2", date: "2-4 Oct" },
    { num: 8, weeks: 5, name: "Medio Fondo 2", competition: "Copa Chile 3", date: "6-8 Nov" },
    { num: 9, weeks: 9, name: "Preparación", competition: "Preparación Nacionales", date: "Nov-Dic" },
    { num: 10, weeks: 4, name: "Pico Competitivo", competition: "Nacionales Verano 2027", date: "9 Ene - 7 Feb" }
  ];

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-white border-2 border-red-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-base sm:text-lg">
          <Info className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="break-words">Información del {currentInfo.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Descripción */}
        <div className="bg-red-50 rounded-lg p-3 sm:p-4 border border-red-100">
          <p className="text-xs sm:text-sm text-red-900 break-words">
            <strong>📅 Temporada 2026-2027:</strong> {currentInfo.description}
          </p>
        </div>

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

        {/* Estructura de 10 Bloques */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="break-words">Estructura de 10 Bloques ({currentInfo.totalWeeks} semanas totales)</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {bloques.map((bloque) => (
              <div key={bloque.num} className="bg-white rounded-lg border p-2 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-semibold text-xs">Bloque {bloque.num}</span>
                  <Badge variant="outline" className="text-xs">{bloque.weeks}s</Badge>
                </div>
                <p className="text-xs text-gray-600 font-medium">{bloque.name}</p>
                <div className="text-xs text-red-600 space-y-0.5">
                  <p className="font-semibold">🏆 {bloque.competition}</p>
                  <p className="text-gray-500">{bloque.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competencias Clave */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-red-600 flex-shrink-0" />
            Competencias Clave
          </h4>
          <ul className="space-y-1.5">
            {currentInfo.keyCompetitions.map((comp, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-red-500 mt-0.5 flex-shrink-0">🏅</span>
                <span className="break-words">{comp}</span>
              </li>
            ))}
          </ul>
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

        {/* Enfoque Específico del Grupo */}
        {selectedGroup === "group1" ? (
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
            <p className="text-xs sm:text-sm text-blue-900 break-words">
              <strong>💡 Enfoque Grupo 1:</strong> {currentInfo.focus}
            </p>
          </div>
        ) : (
          <div className="bg-purple-50 rounded-lg p-3 sm:p-4 border border-purple-200">
            <p className="text-xs sm:text-sm text-purple-900 break-words">
              <strong>💡 Enfoque Grupo 2:</strong> {currentInfo.focus}
            </p>
          </div>
        )}

        {/* Nota sobre competencias específicas */}
        {selectedGroup === "group1" && (
          <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 border border-yellow-200">
            <p className="text-xs sm:text-sm text-yellow-900 break-words">
              <strong>⚠️ Nota:</strong> Festival de Menores y competencias en categorías E-D-C-A solo para Grupo 1 según indicación en Bloques 4 y 10.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}