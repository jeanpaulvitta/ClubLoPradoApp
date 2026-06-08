import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import {
  Trophy, Search, Users, FileDown, Save, CheckSquare, Square,
  AlertCircle, Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import type { Competition, Swimmer, SwimmerCompetition } from "../data/swimmers";
import { calculateCategoryFromBirthDate } from "../utils/swimmerUtils";
import { generateConvocatoriaPDF } from "../utils/generateConvocatoriaPDF";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ConvocatoriaManagerProps {
  competitions: Competition[];
  swimmers: Swimmer[];
  swimmerCompetitions: SwimmerCompetition[];
  onToggleParticipation: (
    swimmerId: string,
    competitionId: string,
    participates: boolean
  ) => Promise<void>;
}

// ─── Category order for sorting ───────────────────────────────────────────────
const CAT_ORDER = [
  "Inf E","Inf D","Inf C","Inf A",
  "Inf B1","Inf B2",
  "Juv A1","Juv A2","Juv B1","Juv B2","Juv B3","Mayores",
];

// ─── Component ────────────────────────────────────────────────────────────────

export function ConvocatoriaManager({
  competitions,
  swimmers,
  swimmerCompetitions,
  onToggleParticipation,
}: ConvocatoriaManagerProps) {
  const [selectedCompId, setSelectedCompId] = useState<string>("");
  const [search, setSearch]           = useState("");
  const [filterCat, setFilterCat]     = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [saving, setSaving]           = useState(false);
  // local selection state: swimmerId → participating
  const [localSel, setLocalSel]       = useState<Record<string, boolean>>({});

  const competition = competitions.find(c => c.id === selectedCompId) ?? null;

  // Sync local selection with persisted data whenever competition changes
  useEffect(() => {
    if (!selectedCompId) { setLocalSel({}); return; }
    const persisted: Record<string, boolean> = {};
    swimmerCompetitions
      .filter(sc => sc.competitionId === selectedCompId)
      .forEach(sc => { persisted[sc.swimmerId] = sc.participates; });
    setLocalSel(persisted);
  }, [selectedCompId, swimmerCompetitions]);

  // Filtered swimmers
  const sorted = useMemo(() => {
    return [...swimmers].sort((a, b) => {
      const ca = CAT_ORDER.indexOf(calculateCategoryFromBirthDate(a.dateOfBirth));
      const cb = CAT_ORDER.indexOf(calculateCategoryFromBirthDate(b.dateOfBirth));
      if (ca !== cb) return ca - cb;
      return a.name.localeCompare(b.name);
    });
  }, [swimmers]);

  const filtered = useMemo(() => {
    return sorted.filter(s => {
      const cat = calculateCategoryFromBirthDate(s.dateOfBirth);
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterCat !== "all" && cat !== filterCat) return false;
      if (filterGender !== "all" && s.gender !== filterGender) return false;
      return true;
    });
  }, [sorted, search, filterCat, filterGender]);

  const selectedCount = Object.values(localSel).filter(Boolean).length;
  const allSelected   = filtered.length > 0 && filtered.every(s => localSel[s.id]);

  // Count changes vs. persisted
  const changes = useMemo(() => {
    const result: Array<{ swimmerId: string; participates: boolean }> = [];
    swimmers.forEach(s => {
      const current = localSel[s.id] ?? false;
      const existing = swimmerCompetitions.find(
        sc => sc.swimmerId === s.id && sc.competitionId === selectedCompId
      );
      const persisted = existing?.participates ?? false;
      if (current !== persisted) result.push({ swimmerId: s.id, participates: current });
    });
    return result;
  }, [localSel, selectedCompId, swimmers, swimmerCompetitions]);

  const handleToggle = (swimmerId: string) => {
    setLocalSel(prev => ({ ...prev, [swimmerId]: !prev[swimmerId] }));
  };

  const handleSelectAll = () => {
    const update: Record<string, boolean> = { ...localSel };
    filtered.forEach(s => { update[s.id] = !allSelected; });
    setLocalSel(update);
  };

  const handleSave = async () => {
    if (!selectedCompId || changes.length === 0) return;
    setSaving(true);
    try {
      await Promise.all(
        changes.map(c => onToggleParticipation(c.swimmerId, selectedCompId, c.participates))
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePDF = () => {
    if (!competition) return;
    generateConvocatoriaPDF(competition, swimmers, swimmerCompetitions);
  };

  const uniqueCategories = useMemo(() => {
    return [...new Set(swimmers.map(s => calculateCategoryFromBirthDate(s.dateOfBirth)))]
      .sort((a, b) => CAT_ORDER.indexOf(a) - CAT_ORDER.indexOf(b));
  }, [swimmers]);

  // Sort competitions by date descending (upcoming first)
  const sortedCompetitions = useMemo(() => {
    return [...competitions].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }, [competitions]);

  return (
    <div className="space-y-6">
      {/* Competition selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="w-5 h-5 text-amber-500" />
            Seleccionar Competencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          {competitions.length === 0 ? (
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                No hay competencias registradas. Agrega una en Gestión de Competencias.
              </AlertDescription>
            </Alert>
          ) : (
            <Select value={selectedCompId} onValueChange={setSelectedCompId}>
              <SelectTrigger className="max-w-lg">
                <SelectValue placeholder="Elige una competencia…" />
              </SelectTrigger>
              <SelectContent>
                {sortedCompetitions.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    <span className="font-medium">{c.name}</span>
                    <span className="text-gray-400 ml-2 text-xs">
                      {new Date(c.startDate).toLocaleDateString("es-CL")} · {c.location}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {competition && (
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
              <Badge variant="outline">{competition.type}</Badge>
              <Badge variant="outline">Piscina {competition.poolType}</Badge>
              <Badge variant="outline">
                {new Date(competition.startDate).toLocaleDateString("es-CL")}
              </Badge>
              <Badge variant="outline">{competition.location}</Badge>
              {competition.categories?.length ? (
                competition.categories.map(cat => (
                  <Badge key={cat} className="bg-blue-100 text-blue-800">{cat}</Badge>
                ))
              ) : (
                <Badge className="bg-green-100 text-green-800">Todas las categorías</Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Swimmer selection */}
      {selectedCompId && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-blue-500" />
                Seleccionar Nadadores
                <Badge className="bg-blue-100 text-blue-800 ml-1">
                  {selectedCount} seleccionados
                </Badge>
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="gap-1"
                >
                  {allSelected
                    ? <><Square className="w-3.5 h-3.5" /> Deseleccionar todo</>
                    : <><CheckSquare className="w-3.5 h-3.5" /> Seleccionar todo</>
                  }
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePDF}
                  disabled={selectedCount === 0}
                  className="gap-1 text-green-700 border-green-300 hover:bg-green-50"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Generar PDF
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving || changes.length === 0}
                  className="gap-1 bg-blue-600 hover:bg-blue-700"
                >
                  {saving
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando…</>
                    : <><Save className="w-3.5 h-3.5" /> Guardar convocatoria ({changes.length} cambio{changes.length !== 1 ? "s" : ""})</>
                  }
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2 mt-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar nadador…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterCat} onValueChange={setFilterCat}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {uniqueCategories.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterGender} onValueChange={setFilterGender}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Femenino">Femenino</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                No hay nadadores que coincidan con los filtros
              </p>
            ) : (
              <div className="divide-y divide-gray-100">
                {filtered.map(swimmer => {
                  const cat = calculateCategoryFromBirthDate(swimmer.dateOfBirth);
                  const isG1 = ["Inf E","Inf D","Inf C","Inf A"].includes(cat);
                  const checked = localSel[swimmer.id] ?? false;
                  return (
                    <label
                      key={swimmer.id}
                      className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                        checked ? "bg-blue-50" : ""
                      }`}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => handleToggle(swimmer.id)}
                        className="shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm truncate ${checked ? "text-blue-900" : ""}`}>
                          {swimmer.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {swimmer.rut ?? "Sin RUT"} · {swimmer.gender ?? "—"}
                        </p>
                      </div>
                      <Badge
                        className={`shrink-0 text-xs ${
                          isG1
                            ? "bg-purple-100 text-purple-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {cat}
                      </Badge>
                      <span className="text-xs text-gray-400 shrink-0">
                        {new Date(swimmer.dateOfBirth).getFullYear()}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
