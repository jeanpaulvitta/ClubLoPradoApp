import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Trophy,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Waves,
  Trash2,
  Users,
  ChevronDown,
  ChevronUp,
  Search,
  Edit2,
  Filter,
  FileText,
  Download,
} from "lucide-react";
import { AddCompetitionDialog } from "./AddCompetitionDialog";
import { EditCompetitionDialog } from "./EditCompetitionDialog";
import { ImportTournamentResultsDialog } from "./ImportTournamentResultsDialog";
import type { Competition, Swimmer } from "../data/swimmers";

interface CompetitionManagerProps {
  competitions: Competition[];
  swimmers?: Swimmer[];
  onAddCompetition: (competition: Omit<Competition, "id">) => void;
  onEditCompetition: (id: string, competition: Omit<Competition, "id">) => void;
  onDeleteCompetition: (id: string) => void;
  weeks: number;
}

export function CompetitionManager({
  competitions,
  swimmers = [],
  onAddCompetition,
  onEditCompetition,
  onDeleteCompetition,
  weeks,
}: CompetitionManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCompetitions, setExpandedCompetitions] = useState<Set<string>>(new Set());
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<"todos" | "menores" | "infantiles" | "juveniles" | "mayores">("todos");

  // Definir las categorías por grupo
  const categoryGroups = {
    menores: ["Inf E 2018", "Inf D 2017", "Inf C 2016", "Inf A 2015"],
    infantiles: ["Inf B1 2014", "Inf B2 2013"],
    juveniles: ["Juv A1 2012", "Juv A2 2011", "Juv B1 2010", "Juv B2 2009", "Juv B3 2008"],
    mayores: ["Mayores 2007"],
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-CL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getMonthYear = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-CL", {
      month: "long",
      year: "numeric",
    });
  };

  const getCompetitionTypeColor = (type: Competition["type"]) => {
    switch (type) {
      case "Local":
        return "bg-green-100 text-green-800 border-green-200";
      case "Regional":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Nacional":
        return "bg-red-100 text-red-800 border-red-200";
      case "Internacional":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getMesocicloInfo = (week: number) => {
    if (week <= 5) return { name: "Base", color: "bg-blue-500" };
    if (week <= 10) return { name: "Desarrollo", color: "bg-purple-500" };
    if (week <= 15) return { name: "Pre-competitivo", color: "bg-orange-500" };
    return { name: "Competitivo", color: "bg-red-500" };
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedCompetitions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCompetitions(newExpanded);
  };

  const handleEdit = (competition: Competition) => {
    setEditingCompetition(competition);
    setEditDialogOpen(true);
  };

  // Filtrar y ordenar competencias
  const filteredCompetitions = competitions
    .filter((comp) =>
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((comp) => {
      // Si el filtro es "todos", mostrar todas
      if (categoryFilter === "todos") return true;
      
      // Si la competencia no tiene categorías especificadas, está abierta a todos
      if (!comp.categories || comp.categories.length === 0) return true;
      
      // Verificar si alguna de las categorías de la competencia está en el grupo seleccionado
      const selectedGroup = categoryGroups[categoryFilter];
      return comp.categories.some(cat => 
        selectedGroup.some(groupCat => cat.includes(groupCat.split(" ")[0] + " " + groupCat.split(" ")[1]))
      );
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  // Agrupar competencias por mes
  const competitionsByMonth = filteredCompetitions.reduce((acc, comp) => {
    const monthYear = getMonthYear(comp.startDate);
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(comp);
    return acc;
  }, {} as Record<string, Competition[]>);

  const monthKeys = Object.keys(competitionsByMonth);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-600" />
            Calendario de Competencias
          </h2>
          <p className="text-gray-600 mt-2">
            Gestiona todas las competencias de la temporada
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-1"
          >
            <Download className="w-4 h-4" />
            Importar resultados
          </Button>
          <AddCompetitionDialog
            onAddCompetition={onAddCompetition}
            weekNumber={1}
          />
        </div>
      </div>

      {/* Filtro de Categorías */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-gray-800">Filtrar por Categoría</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={categoryFilter === "todos" ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter("todos")}
              className={categoryFilter === "todos" 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "hover:bg-red-50 hover:text-red-700 hover:border-red-300"}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Todas las Categorías
            </Button>
            <Button
              variant={categoryFilter === "menores" ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter("menores")}
              className={categoryFilter === "menores" 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "hover:bg-green-50 hover:text-green-700 hover:border-green-300"}
            >
              <Users className="w-4 h-4 mr-2" />
              Menores
            </Button>
            <Button
              variant={categoryFilter === "infantiles" ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter("infantiles")}
              className={categoryFilter === "infantiles" 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"}
            >
              <Users className="w-4 h-4 mr-2" />
              Infantiles
            </Button>
            <Button
              variant={categoryFilter === "juveniles" ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter("juveniles")}
              className={categoryFilter === "juveniles" 
                ? "bg-purple-600 hover:bg-purple-700 text-white" 
                : "hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"}
            >
              <Users className="w-4 h-4 mr-2" />
              Juveniles
            </Button>
            <Button
              variant={categoryFilter === "mayores" ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter("mayores")}
              className={categoryFilter === "mayores" 
                ? "bg-orange-600 hover:bg-orange-700 text-white" 
                : "hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300"}
            >
              <Users className="w-4 h-4 mr-2" />
              Mayores
            </Button>
          </div>
          {categoryFilter !== "todos" && (
            <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
              <Badge variant="outline" className="bg-white border-red-200 text-red-700">
                Mostrando: {categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}
              </Badge>
              <span>•</span>
              <span>Categorías: {categoryGroups[categoryFilter].map(c => c.split(" ").slice(0, 2).join(" ")).join(", ")}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">{competitions.length}</div>
            <div className="text-sm text-gray-600 mt-1">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {competitions.filter(c => c.type === "Local").length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Locales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {competitions.filter(c => c.type === "Regional").length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Regionales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-red-600">
              {competitions.filter(c => c.type === "Nacional").length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Nacionales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {competitions.filter(c => c.type === "Internacional").length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Internacionales</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      {competitions.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar por nombre o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Competition Timeline by Month */}
      {filteredCompetitions.length === 0 ? (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
          <CardContent className="pt-12 pb-12 text-center">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? "No se encontraron competencias" : "No hay competencias programadas"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? "Intenta con otro término de búsqueda"
                : "Agrega competencias usando el botón de arriba"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {monthKeys.map((monthYear) => (
            <div key={monthYear}>
              {/* Month Header */}
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-800 capitalize">{monthYear}</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
                <Badge variant="outline" className="text-sm">
                  {competitionsByMonth[monthYear].length} {competitionsByMonth[monthYear].length === 1 ? "competencia" : "competencias"}
                </Badge>
              </div>

              {/* Competitions in this month */}
              <div className="space-y-4">
                {competitionsByMonth[monthYear].map((competition) => {
                  const mesociclo = getMesocicloInfo(competition.week);
                  const isExpanded = expandedCompetitions.has(competition.id);

                  return (
                    <Card
                      key={competition.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow border-l-4"
                      style={{ borderLeftColor: mesociclo.color.replace('bg-', '#').replace('500', '') }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Trophy className="w-5 h-5 text-yellow-600" />
                              <CardTitle className="text-xl">{competition.name}</CardTitle>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge className={getCompetitionTypeColor(competition.type)}>
                                {competition.type}
                              </Badge>
                              <Badge variant="outline" className="border-gray-300">
                                Semana {competition.week} · {mesociclo.name}
                              </Badge>
                              <Badge variant="outline" className="border-gray-300">
                                <Waves className="w-3 h-3 mr-1" />
                                {competition.poolType}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpanded(competition.id)}
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(competition)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (
                                  confirm(
                                    `¿Estás seguro de que deseas eliminar "${competition.name}"?`
                                  )
                                ) {
                                  onDeleteCompetition(competition.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        {/* Info básica siempre visible */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <div>
                              <div className="font-semibold text-gray-700">
                                {formatDate(competition.startDate)}
                              </div>
                              {competition.endDate && competition.endDate !== competition.startDate && (
                                <div className="text-gray-500 text-xs">
                                  hasta {formatDate(competition.endDate)}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{competition.location}</span>
                          </div>

                          {competition.cost && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">{competition.cost}</span>
                            </div>
                          )}
                        </div>

                        {/* Botón de PDF si existe */}
                        {competition.pdfUrl && (
                          <div className="mt-3">
                            <a
                              href={competition.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                            >
                              <FileText className="w-4 h-4" />
                              Ver Información Oficial (PDF)
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        )}

                        {/* Detalles expandibles */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t space-y-4">
                            {competition.schedule && (
                              <div className="flex items-start gap-2">
                                <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
                                <div>
                                  <div className="text-sm font-semibold text-gray-700">Horario</div>
                                  <div className="text-sm text-gray-600">{competition.schedule}</div>
                                </div>
                              </div>
                            )}

                            {competition.description && (
                              <div className="bg-blue-50 rounded-lg p-3">
                                <div className="text-sm font-semibold text-gray-700 mb-1">
                                  Descripción
                                </div>
                                <div className="text-sm text-gray-600">{competition.description}</div>
                              </div>
                            )}

                            {competition.events && competition.events.length > 0 && (
                              <div>
                                <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  Pruebas Disponibles ({competition.events.length})
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {competition.events.map((event, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="bg-white border-blue-200 text-blue-700"
                                    >
                                      {event}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Categorías Permitidas */}
                            <div>
                              <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Users className="w-4 h-4 text-red-600" />
                                Categorías Permitidas
                              </div>
                              {competition.categories && competition.categories.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {competition.categories.map((category, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="bg-red-50 border-red-200 text-red-700"
                                    >
                                      {category.replace(" 20", " '")}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                  <p className="text-sm text-gray-600">
                                    🏊 Todas las categorías pueden participar
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      {editingCompetition && (
        <EditCompetitionDialog
          competition={editingCompetition}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onEditCompetition={onEditCompetition}
        />
      )}

      {/* Import Tournament Results Dialog */}
      <ImportTournamentResultsDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        existingSwimmers={swimmers}
        existingCompetitions={competitions}
      />
    </div>
  );
}