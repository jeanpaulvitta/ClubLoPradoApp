import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Target, BookOpen, Users, Filter } from "lucide-react";
import { minimumTimesByCategory } from "../data/minimumTimes";

export function MinimumTimesReference() {
  const [selectedGender, setSelectedGender] = useState<"female" | "male">("male");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { key: "infE", label: "Inf E", fullLabel: "Inf E 2018" },
    { key: "infD", label: "Inf D", fullLabel: "Inf D 2017" },
    { key: "infC", label: "Inf C", fullLabel: "Inf C 2016" },
    { key: "infA", label: "Inf A", fullLabel: "Inf A 2015" },
    { key: "infB1", label: "Inf B1", fullLabel: "Inf B1 2014" },
    { key: "infB2", label: "Inf B2", fullLabel: "Inf B2 2013" },
    { key: "juvA1", label: "Juv A1", fullLabel: "Juv A1 2012" },
    { key: "juvA2", label: "Juv A2", fullLabel: "Juv A2 2011" },
    { key: "juvB", label: "Juv B", fullLabel: "Juv B 2010-2008" },
    { key: "mayores", label: "Mayores", fullLabel: "Mayores 2007" },
  ];

  const formatTime = (time: string | undefined) => {
    if (!time) return "-";
    if (time === "S/MM") return "Sin MM";
    return time.replace(/,/g, ".").replace(/:/g, ":");
  };

  const getCategoryColor = (category: string) => {
    if (category.startsWith("infE") || category.startsWith("infD") || category.startsWith("infC") || category.startsWith("infA")) {
      return "bg-green-100 text-green-800 border-green-300";
    }
    if (category.startsWith("infB")) {
      return "bg-blue-100 text-blue-800 border-blue-300";
    }
    if (category.startsWith("juv")) {
      return "bg-purple-100 text-purple-800 border-purple-300";
    }
    return "bg-orange-100 text-orange-800 border-orange-300";
  };

  const times = minimumTimesByCategory[selectedGender];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-blue-600" />
            Tabla de Marcas Mínimas por Categoría
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Consulta las marcas mínimas oficiales para cada categoría y prueba
          </p>
        </CardHeader>
      </Card>

      {/* Selector de género */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Seleccionar Género</h3>
          </div>
          <div className="flex gap-3">
            <Button
              variant={selectedGender === "male" ? "default" : "outline"}
              onClick={() => setSelectedGender("male")}
              className={selectedGender === "male" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              Varones
            </Button>
            <Button
              variant={selectedGender === "female" ? "default" : "outline"}
              onClick={() => setSelectedGender("female")}
              className={selectedGender === "female" ? "bg-pink-600 hover:bg-pink-700" : ""}
            >
              Damas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selector de categoría */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-gray-800">Filtrar por Categoría (opcional)</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-red-600 hover:bg-red-700" : ""}
            >
              Todas las Categorías
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.key}
                variant={selectedCategory === cat.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.key)}
                className={selectedCategory === cat.key ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabla de marcas mínimas */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="px-4 py-3 text-left font-bold text-gray-800 sticky left-0 bg-gray-100 z-10">
                    Prueba
                  </th>
                  {categories
                    .filter(cat => !selectedCategory || cat.key === selectedCategory)
                    .map((cat) => (
                      <th key={cat.key} className="px-4 py-3 text-center font-bold text-gray-800 min-w-[100px]">
                        <Badge className={getCategoryColor(cat.key)}>
                          {cat.label}
                        </Badge>
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {times.map((eventData, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-semibold text-gray-800 border-r sticky left-0 bg-inherit z-10">
                      {eventData.event}
                    </td>
                    {categories
                      .filter(cat => !selectedCategory || cat.key === selectedCategory)
                      .map((cat) => {
                        const time = eventData[cat.key as keyof typeof eventData];
                        const hasTime = time && time !== "S/MM";
                        return (
                          <td
                            key={cat.key}
                            className={`px-4 py-3 text-center ${
                              hasTime ? "font-semibold text-blue-700" : "text-gray-400"
                            }`}
                          >
                            {formatTime(time as string)}
                          </td>
                        );
                      })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Leyenda */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-2">Información importante:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>"Sin MM"</strong> indica que no hay marca mínima establecida para esa prueba en esa categoría</li>
                  <li><strong>"-"</strong> indica que la categoría no participa en esa prueba</li>
                  <li>Las marcas mínimas pueden variar según la competencia específica</li>
                  <li>Estas son marcas de referencia del Club Natación Lo Prado</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Target className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                ¿Cómo usar esta tabla?
              </h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  <strong>1. Identifica tu categoría:</strong> Busca la columna con tu categoría (según tu año de nacimiento).
                </p>
                <p>
                  <strong>2. Encuentra tu prueba:</strong> Busca la fila con la distancia y estilo que nadas.
                </p>
                <p>
                  <strong>3. Lee el tiempo:</strong> El tiempo que aparece es la marca mínima que debes alcanzar o superar.
                </p>
                <p>
                  <strong>4. Compara con tus marcas:</strong> Revisa tus marcas personales en tu perfil para ver tu progreso.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
