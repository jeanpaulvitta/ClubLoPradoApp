import { useState, useCallback, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Users,
  Trophy,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Swimmer, Competition } from "../data/swimmers";
import {
  parseTeamManagerFile,
  matchSwimmer,
  normalizeTime,
  generateTemplateCSV,
  type TeamManagerRow,
  type MatchResult,
  type MatchStatus,
} from "../utils/teamManagerParser";
import { importTournamentResults } from "../services/api";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ProcessedRow extends TeamManagerRow {
  match: MatchResult;
  skip: boolean;      // user toggled
  resolvedSwimmerId?: string; // manually resolved from ambiguous match
}

interface ImportResultRow {
  rowIndex: number;
  status: "imported" | "skipped" | "error" | "no_time";
  swimmerName: string;
  event: string;
  time?: string;
  isPersonalBest?: boolean;
  message?: string;
}

interface ImportSummary {
  total: number;
  imported: number;
  skipped: number;
  errors: number;
  personalBests: number;
  results: ImportResultRow[];
}

type ImportStep = "upload" | "preview" | "importing" | "done";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingSwimmers: Swimmer[];
  existingCompetitions: Competition[];
  onImportComplete?: () => void;
}

// ─── Status badge helpers ─────────────────────────────────────────────────────

const MATCH_LABELS: Record<MatchStatus, string> = {
  matched_rut:     "RUT",
  matched_name:    "Nombre",
  matched_partial: "Parcial",
  not_found:       "No encontrado",
  ambiguous:       "Ambiguo",
};

const MATCH_COLORS: Record<MatchStatus, string> = {
  matched_rut:     "bg-green-100 text-green-800 border-green-200",
  matched_name:    "bg-blue-100 text-blue-800 border-blue-200",
  matched_partial: "bg-yellow-100 text-yellow-800 border-yellow-200",
  not_found:       "bg-red-100 text-red-800 border-red-200",
  ambiguous:       "bg-orange-100 text-orange-800 border-orange-200",
};

function MatchBadge({ status }: { status: MatchStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${MATCH_COLORS[status]}`}
    >
      {MATCH_LABELS[status]}
    </span>
  );
}

// ─── Row detail (expandable) ──────────────────────────────────────────────────

function RowDetail({ row }: { row: ProcessedRow }) {
  const [open, setOpen] = useState(false);
  const hasDetail =
    row.errors.length > 0 ||
    row.warnings.length > 0 ||
    row.match.status === "ambiguous";

  return (
    <div className="text-xs text-gray-500">
      {hasDetail && (
        <button
          className="flex items-center gap-1 text-blue-600 hover:underline"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          Detalle
        </button>
      )}
      {open && (
        <div className="mt-1 space-y-0.5">
          {row.errors.map((e, i) => (
            <div key={i} className="text-red-600">✗ {e}</div>
          ))}
          {row.warnings.map((w, i) => (
            <div key={i} className="text-yellow-600">⚠ {w}</div>
          ))}
          {row.match.status === "ambiguous" && row.match.candidates && (
            <div className="text-orange-600">
              Posibles coincidencias:{" "}
              {row.match.candidates.map((c) => c.name).join(", ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function ImportTournamentResultsDialog({
  open,
  onOpenChange,
  existingSwimmers,
  existingCompetitions,
  onImportComplete,
}: Props) {
  const [step, setStep] = useState<ImportStep>("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [globalWarnings, setGlobalWarnings] = useState<string[]>([]);

  const [processedRows, setProcessedRows] = useState<ProcessedRow[]>([]);
  const [detectedMeetName, setDetectedMeetName] = useState("");
  const [detectedDate, setDetectedDate] = useState("");

  // Competition linkage (user selects existing or enters a name for a new one)
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string>("__new__");
  const [newCompetitionName, setNewCompetitionName] = useState("");

  const [importProgress, setImportProgress] = useState(0);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [showAllResults, setShowAllResults] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset on open/close
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep("upload");
        setProcessedRows([]);
        setParseError(null);
        setGlobalWarnings([]);
        setDetectedMeetName("");
        setDetectedDate("");
        setSelectedCompetitionId("__new__");
        setNewCompetitionName("");
        setImportProgress(0);
        setImportSummary(null);
        setShowAllResults(false);
      }, 300);
    }
  }, [open]);

  // ── File processing ──

  const processFile = useCallback(
    async (file: File) => {
      if (!file.name.match(/\.(csv|xls|xlsx)$/i)) {
        setParseError("Formato no soportado. Usa archivos .csv, .xls o .xlsx.");
        return;
      }

      setIsParsingFile(true);
      setParseError(null);

      try {
        const result = await parseTeamManagerFile(file);

        if (result.globalErrors.length > 0) {
          setParseError(result.globalErrors.join(" | "));
          setIsParsingFile(false);
          return;
        }

        setGlobalWarnings(result.globalWarnings);
        setDetectedMeetName(result.detectedMeetName ?? "");
        setDetectedDate(result.detectedDate ?? "");

        if (result.detectedMeetName) {
          setNewCompetitionName(result.detectedMeetName);
        }

        // Match each row against existing swimmers
        const processed: ProcessedRow[] = result.rows.map((row) => {
          const matchResult = matchSwimmer(
            { name: row.name, normalizedRut: row.normalizedRut },
            existingSwimmers
          );
          const effectiveSwimmerId =
            matchResult.status !== "not_found" && matchResult.status !== "ambiguous"
              ? matchResult.swimmerId
              : undefined;
          return {
            ...row,
            match: matchResult,
            skip: matchResult.status === "not_found" || matchResult.status === "ambiguous",
            resolvedSwimmerId: effectiveSwimmerId,
          };
        });

        setProcessedRows(processed);
        setStep("preview");
      } catch (err) {
        setParseError(
          `Error al procesar el archivo: ${err instanceof Error ? err.message : String(err)}`
        );
      } finally {
        setIsParsingFile(false);
      }
    },
    [existingSwimmers]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      e.target.value = "";
    },
    [processFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  // ── Toggle row skip ──

  const toggleSkip = (rowIndex: number) => {
    setProcessedRows((prev) =>
      prev.map((r) => (r.rowIndex === rowIndex ? { ...r, skip: !r.skip } : r))
    );
  };

  const toggleAllUnmatched = (skip: boolean) => {
    setProcessedRows((prev) =>
      prev.map((r) =>
        r.match.status === "not_found" || r.match.status === "ambiguous"
          ? { ...r, skip }
          : r
      )
    );
  };

  // ── Import ──

  const handleImport = async () => {
    const competitionName =
      selectedCompetitionId === "__new__"
        ? newCompetitionName.trim()
        : existingCompetitions.find((c) => c.id === selectedCompetitionId)?.name ?? "";

    if (!competitionName && selectedCompetitionId === "__new__") {
      setParseError("Ingresa el nombre del torneo antes de importar.");
      return;
    }

    const toImport = processedRows.filter((r) => !r.skip && r.resolvedSwimmerId);

    if (toImport.length === 0) {
      setParseError("No hay registros válidos para importar.");
      return;
    }

    setParseError(null);
    setStep("importing");
    setImportProgress(0);

    const payload = {
      competitionId:
        selectedCompetitionId !== "__new__" ? selectedCompetitionId : undefined,
      competitionName,
      competitionDate: detectedDate || undefined,
      results: toImport.map((r) => ({
        swimmerId: r.resolvedSwimmerId!,
        name: r.name,
        rut: r.rut,
        event: r.parsedEvent
          ? `${r.parsedEvent.distance} ${r.parsedEvent.style}`
          : r.event,
        time: r.time || undefined,
        position: r.position,
        points: r.points,
      })),
    };

    try {
      // Simulate incremental progress while waiting for the server
      const progressInterval = setInterval(() => {
        setImportProgress((p) => Math.min(p + 8, 85));
      }, 200);

      const summary = await importTournamentResults(payload);

      clearInterval(progressInterval);
      setImportProgress(100);
      setImportSummary(summary);
      setStep("done");

      onImportComplete?.();
    } catch (err) {
      setParseError(
        `Error al importar: ${err instanceof Error ? err.message : String(err)}`
      );
      setStep("preview");
    }
  };

  // ── Derived stats for preview ──

  const matchedCount = processedRows.filter(
    (r) => r.match.status !== "not_found" && r.match.status !== "ambiguous"
  ).length;
  const notFoundCount = processedRows.filter((r) => r.match.status === "not_found").length;
  const ambiguousCount = processedRows.filter((r) => r.match.status === "ambiguous").length;
  const skippedCount = processedRows.filter((r) => r.skip).length;
  const willImportCount = processedRows.filter((r) => !r.skip && r.resolvedSwimmerId).length;
  const withErrors = processedRows.filter((r) => r.errors.length > 0).length;

  // ── Template download ──

  const downloadTemplate = () => {
    const csv = generateTemplateCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla_resultados_torneo.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy size={20} className="text-yellow-600" />
            Importar Resultados de Torneo
          </DialogTitle>
          <DialogDescription>
            Importa tiempos y posiciones desde archivos CSV o XLS exportados de
            Team Manager.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* ── Step: Upload ── */}
          {step === "upload" && (
            <div className="space-y-4">
              {/* Drop zone */}
              <div
                className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors cursor-pointer ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xls,.xlsx"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {isParsingFile ? (
                  <div className="flex flex-col items-center gap-2 text-blue-600">
                    <RefreshCw size={36} className="animate-spin" />
                    <span className="font-medium">Procesando archivo…</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <FileSpreadsheet size={40} />
                    <p className="text-sm font-medium text-gray-700">
                      Arrastra un archivo aquí o haz clic para seleccionar
                    </p>
                    <p className="text-xs">Soporta .csv, .xls y .xlsx</p>
                  </div>
                )}
              </div>

              {parseError && (
                <Alert variant="destructive">
                  <XCircle size={16} />
                  <AlertDescription>{parseError}</AlertDescription>
                </Alert>
              )}

              {/* Template download */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">¿Primera vez importando?</p>
                  <p className="text-xs text-gray-500">
                    Descarga la plantilla CSV con el formato esperado.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  <Download size={14} className="mr-1" />
                  Plantilla CSV
                </Button>
              </div>

              {/* Expected columns guide */}
              <div className="text-xs text-gray-500 space-y-1 p-3 bg-gray-50 rounded-lg border">
                <p className="font-medium text-gray-700 mb-1">
                  Columnas reconocidas (mayúsculas/minúsculas indiferente):
                </p>
                <div className="grid grid-cols-2 gap-x-4">
                  <div><span className="font-mono bg-white px-1 rounded">Nombre</span> — requerido</div>
                  <div><span className="font-mono bg-white px-1 rounded">RUT</span> — opcional (mejora el matching)</div>
                  <div><span className="font-mono bg-white px-1 rounded">Prueba</span> — ej: "50 Libre", "100 Espalda"</div>
                  <div><span className="font-mono bg-white px-1 rounded">Tiempo</span> — ej: "25.12", "1:05.34", "DQ"</div>
                  <div><span className="font-mono bg-white px-1 rounded">Posicion</span> — opcional</div>
                  <div><span className="font-mono bg-white px-1 rounded">Puntos</span> — FINA, opcional</div>
                  <div><span className="font-mono bg-white px-1 rounded">Torneo</span> — opcional</div>
                  <div><span className="font-mono bg-white px-1 rounded">Fecha</span> — YYYY-MM-DD, opcional</div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step: Preview ── */}
          {step === "preview" && (
            <div className="space-y-4">
              {/* Global warnings */}
              {globalWarnings.map((w, i) => (
                <Alert key={i}>
                  <AlertCircle size={16} />
                  <AlertDescription>{w}</AlertDescription>
                </Alert>
              ))}

              {parseError && (
                <Alert variant="destructive">
                  <XCircle size={16} />
                  <AlertDescription>{parseError}</AlertDescription>
                </Alert>
              )}

              {/* Stats bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-700">{matchedCount}</p>
                  <p className="text-xs text-green-600">Encontrados</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-red-700">{notFoundCount}</p>
                  <p className="text-xs text-red-600">No encontrados</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-orange-700">{ambiguousCount}</p>
                  <p className="text-xs text-orange-600">Ambiguos</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-700">{willImportCount}</p>
                  <p className="text-xs text-blue-600">A importar</p>
                </div>
              </div>

              {/* Competition selector */}
              <div className="p-3 bg-gray-50 rounded-lg border space-y-2">
                <p className="text-sm font-medium flex items-center gap-1">
                  <Trophy size={14} className="text-yellow-600" />
                  Vincular al torneo
                </p>
                <select
                  className="w-full text-sm border rounded px-2 py-1.5 bg-white"
                  value={selectedCompetitionId}
                  onChange={(e) => setSelectedCompetitionId(e.target.value)}
                >
                  <option value="__new__">+ Crear nuevo torneo</option>
                  {existingCompetitions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.startDate})
                    </option>
                  ))}
                </select>
                {selectedCompetitionId === "__new__" && (
                  <input
                    type="text"
                    placeholder="Nombre del torneo (ej: Campeonato Regional 2026)"
                    className="w-full text-sm border rounded px-2 py-1.5"
                    value={newCompetitionName}
                    onChange={(e) => setNewCompetitionName(e.target.value)}
                  />
                )}
                {detectedDate && (
                  <p className="text-xs text-gray-500">
                    Fecha detectada en el archivo: <strong>{detectedDate}</strong>
                  </p>
                )}
              </div>

              {/* Skip controls for unmatched */}
              {(notFoundCount > 0 || ambiguousCount > 0) && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Nadadores no encontrados / ambiguos:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAllUnmatched(true)}
                    className="h-7 text-xs"
                  >
                    Saltar todos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAllUnmatched(false)}
                    className="h-7 text-xs"
                  >
                    Incluir todos
                  </Button>
                </div>
              )}

              {/* Rows table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-100 text-gray-600 uppercase tracking-wide">
                    <tr>
                      <th className="px-2 py-2 text-left">Nadador (archivo)</th>
                      <th className="px-2 py-2 text-left">Coincidencia</th>
                      <th className="px-2 py-2 text-left">Prueba</th>
                      <th className="px-2 py-2 text-center">Tiempo</th>
                      <th className="px-2 py-2 text-center">Pos.</th>
                      <th className="px-2 py-2 text-center">Saltar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedRows.map((row) => (
                      <tr
                        key={`${row.rowIndex}-${row.event}`}
                        className={`border-t transition-colors ${
                          row.skip
                            ? "bg-gray-50 text-gray-400"
                            : row.errors.length > 0
                            ? "bg-red-50"
                            : ""
                        }`}
                      >
                        <td className="px-2 py-1.5 max-w-[160px]">
                          <div className="font-medium truncate" title={row.name}>
                            {row.name}
                          </div>
                          {row.rut && (
                            <div className="text-gray-400 text-[10px]">{row.rut}</div>
                          )}
                          {row.match.swimmerName &&
                            row.match.swimmerName !== row.name && (
                              <div className="text-blue-500 text-[10px] truncate">
                                → {row.match.swimmerName}
                              </div>
                            )}
                          <RowDetail row={row} />
                        </td>
                        <td className="px-2 py-1.5">
                          <MatchBadge status={row.match.status} />
                        </td>
                        <td className="px-2 py-1.5">
                          {row.parsedEvent ? (
                            <span className="font-mono">{row.parsedEvent.label}</span>
                          ) : (
                            <span className="text-gray-400 italic">{row.event || "—"}</span>
                          )}
                        </td>
                        <td className="px-2 py-1.5 text-center font-mono">
                          {row.isInvalidTime ? (
                            <span className="text-gray-400 text-[10px] uppercase">
                              {String(row.time || "N/T")}
                            </span>
                          ) : row.time ? (
                            row.time
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-2 py-1.5 text-center text-gray-500">
                          {row.position ?? "—"}
                        </td>
                        <td className="px-2 py-1.5 text-center">
                          <input
                            type="checkbox"
                            checked={row.skip}
                            onChange={() => toggleSkip(row.rowIndex)}
                            className="h-3.5 w-3.5 cursor-pointer accent-blue-600"
                            title={row.skip ? "Incluir esta fila" : "Omitir esta fila"}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {withErrors > 0 && (
                <Alert>
                  <AlertCircle size={16} />
                  <AlertDescription>
                    {withErrors} fila(s) con errores de validación (se mostrarán en rojo).
                    Puedes saltarlas o corregir el archivo y volver a cargar.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* ── Step: Importing ── */}
          {step === "importing" && (
            <div className="flex flex-col items-center justify-center gap-6 py-10">
              <RefreshCw size={48} className="animate-spin text-blue-500" />
              <div className="w-full max-w-xs space-y-2">
                <p className="text-center font-medium">Importando resultados…</p>
                <Progress value={importProgress} className="h-2" />
                <p className="text-center text-sm text-gray-500">
                  {importProgress < 100
                    ? `${Math.round(importProgress)}% completado`
                    : "Finalizando…"}
                </p>
              </div>
            </div>
          )}

          {/* ── Step: Done ── */}
          {step === "done" && importSummary && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 size={28} className="text-green-600 shrink-0" />
                <div>
                  <p className="font-semibold text-green-800">Importación completada</p>
                  <p className="text-sm text-green-700">
                    {importSummary.imported} resultado(s) importado(s) exitosamente.
                    {importSummary.personalBests > 0 &&
                      ` ${importSummary.personalBests} marca(s) personal(es) actualizada(s).`}
                  </p>
                </div>
              </div>

              {/* Summary stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-700">
                    {importSummary.imported}
                  </p>
                  <p className="text-xs text-green-600">Importados</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-700">
                    {importSummary.personalBests}
                  </p>
                  <p className="text-xs text-yellow-600">Marcas personales</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gray-700">
                    {importSummary.skipped}
                  </p>
                  <p className="text-xs text-gray-600">Saltados</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-red-700">
                    {importSummary.errors}
                  </p>
                  <p className="text-xs text-red-600">Errores</p>
                </div>
              </div>

              {/* Result rows */}
              {importSummary.results.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Detalle por fila</p>
                    <button
                      className="text-xs text-blue-600 hover:underline"
                      onClick={() => setShowAllResults((v) => !v)}
                    >
                      {showAllResults ? "Mostrar menos" : "Mostrar todos"}
                    </button>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-100 text-gray-600">
                        <tr>
                          <th className="px-2 py-1.5 text-left">Nadador</th>
                          <th className="px-2 py-1.5 text-left">Prueba</th>
                          <th className="px-2 py-1.5 text-center">Tiempo</th>
                          <th className="px-2 py-1.5 text-center">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(showAllResults
                          ? importSummary.results
                          : importSummary.results.slice(0, 10)
                        ).map((r, i) => (
                          <tr key={i} className="border-t">
                            <td className="px-2 py-1 font-medium">{r.swimmerName}</td>
                            <td className="px-2 py-1 font-mono">{r.event}</td>
                            <td className="px-2 py-1 text-center font-mono">
                              {r.time ?? "—"}
                            </td>
                            <td className="px-2 py-1 text-center">
                              {r.status === "imported" ? (
                                <span className={`inline-flex items-center gap-0.5 ${r.isPersonalBest ? "text-yellow-600 font-semibold" : "text-green-600"}`}>
                                  <CheckCircle2 size={11} />
                                  {r.isPersonalBest ? "¡Marca!" : "OK"}
                                </span>
                              ) : r.status === "no_time" ? (
                                <span className="text-gray-400">Sin tiempo</span>
                              ) : r.status === "skipped" ? (
                                <span className="text-gray-400">Saltado</span>
                              ) : (
                                <span className="text-red-500" title={r.message}>
                                  Error
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!showAllResults && importSummary.results.length > 10 && (
                      <div className="px-3 py-1.5 text-xs text-gray-500 bg-gray-50 border-t text-center">
                        +{importSummary.results.length - 10} resultados más
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer buttons ── */}
        <div className="flex justify-between pt-3 border-t mt-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => {
              if (step === "preview") {
                setStep("upload");
                setProcessedRows([]);
                setParseError(null);
              } else {
                onOpenChange(false);
              }
            }}
          >
            {step === "preview" ? "← Volver" : "Cerrar"}
          </Button>

          {step === "preview" && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {willImportCount} de {processedRows.length} filas se importarán
              </span>
              <Button
                onClick={handleImport}
                disabled={willImportCount === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Upload size={14} className="mr-1" />
                Importar {willImportCount} resultado(s)
              </Button>
            </div>
          )}

          {step === "done" && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setStep("upload");
                  setProcessedRows([]);
                  setImportSummary(null);
                }}
              >
                Importar otro archivo
              </Button>
              <Button onClick={() => onOpenChange(false)}>Listo</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ImportTournamentResultsDialog;
