import { useState, useCallback, useRef } from "react";
import * as XLSX from "xlsx";
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
  BookOpen,
} from "lucide-react";
import type { Swimmer } from "../data/swimmers";
import { calculateCategoryFromBirthDate } from "../utils/swimmerUtils";
import { generateGuiaPDF } from "../utils/generateGuiaPDF";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ParsedSwimmer {
  name: string;
  email: string;
  rut?: string;
  gender?: "Masculino" | "Femenino" | "Otro";
  dateOfBirth: string;
  calculatedCategory: string;
  excelCategory?: string;
}

interface ParsedRow {
  rowIndex: number;
  rawData: Record<string, unknown>;
  swimmer?: ParsedSwimmer;
  errors: string[];
  warnings: string[];
  isDuplicate: boolean;
}

type ImportStep = "upload" | "preview" | "importing" | "done";

interface ImportSwimmersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingSwimmers: Swimmer[];
  onImport: (swimmer: Omit<Swimmer, "id">) => Promise<Swimmer>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeRut(rut: string): string {
  return rut.replace(/[.\-\s]/g, "").toLowerCase();
}

function normalizeGender(raw: unknown): "Masculino" | "Femenino" | "Otro" {
  const val = String(raw ?? "").trim().toUpperCase();
  if (["M", "MASCULINO", "MALE", "HOMBRE", "H"].includes(val)) return "Masculino";
  if (["F", "FEMENINO", "FEMALE", "MUJER"].includes(val)) return "Femenino";
  return "Otro";
}

// Excel serial date → YYYY-MM-DD
function excelSerialToDate(serial: number): string {
  // Excel incorrectly treats 1900 as a leap year; offset by 25569 days to Unix epoch
  const utcDays = serial - 25569;
  const utcMs = utcDays * 86400 * 1000;
  const d = new Date(utcMs);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseDateOfBirth(raw: unknown): string | null {
  if (raw == null || raw === "") return null;

  // Already a JS Date (XLSX with cellDates:true)
  if (raw instanceof Date) {
    if (isNaN(raw.getTime())) return null;
    const yyyy = raw.getFullYear();
    const mm = String(raw.getMonth() + 1).padStart(2, "0");
    const dd = String(raw.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  // Numeric (Excel serial)
  if (typeof raw === "number") {
    if (raw < 1 || raw > 2958465) return null; // valid range 1900–9999
    return excelSerialToDate(raw);
  }

  const str = String(raw).trim();

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  // DD/MM/YYYY or DD-MM-YYYY
  const dmy = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) {
    const [, dd, mm, yyyy] = dmy;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }

  // MM/DD/YYYY (less likely but handle it)
  const mdy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mdy) {
    // Heuristic: if first part > 12, it must be DD/MM
    const [, a, b, yyyy] = mdy;
    if (Number(a) > 12) {
      return `${yyyy}-${b.padStart(2, "0")}-${a.padStart(2, "0")}`;
    }
    return `${yyyy}-${a.padStart(2, "0")}-${b.padStart(2, "0")}`;
  }

  return null;
}

function findColumn(row: Record<string, unknown>, candidates: string[]): unknown {
  for (const key of Object.keys(row)) {
    const normalized = key.trim().toLowerCase();
    if (candidates.some((c) => normalized === c.toLowerCase())) {
      return row[key];
    }
  }
  return undefined;
}

function parseRow(
  rawRow: Record<string, unknown>,
  rowIndex: number,
  existingRuts: Set<string>
): ParsedRow {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Extract fields
  const nombre = String(findColumn(rawRow, ["Nombre", "NOMBRE"]) ?? "").trim();
  const apellidoP = String(findColumn(rawRow, ["Apellido P", "APELLIDO P", "APELLIDO_P", "Apellido1"]) ?? "").trim();
  const apellidoM = String(findColumn(rawRow, ["Apellido M", "APELLIDO M", "APELLIDO_M", "Apellido2"]) ?? "").trim();
  const rutRaw = findColumn(rawRow, ["Rut", "RUT", "RUN"]);
  const generoRaw = findColumn(rawRow, ["Genero", "Género", "GENERO", "GÉNERO", "Sexo", "SEXO"]);
  const fechaNacRaw = findColumn(rawRow, [
    "Fecha de Nacimiento",
    "Fecha Nacimiento",
    "FECHA DE NACIMIENTO",
    "FECHA_NACIMIENTO",
    "Fecha nacimiento",
  ]);
  const emailRaw = findColumn(rawRow, [
    "Email tutor",
    "EMAIL TUTOR",
    "email tutor",
    "Email",
    "EMAIL",
    "Correo",
  ]);
  const categoriaRaw = findColumn(rawRow, ["Categoria", "Categoría", "CATEGORIA"]);

  // Full name
  const parts = [nombre, apellidoP, apellidoM].filter(Boolean);
  const fullName = parts.join(" ").trim();
  if (!fullName) {
    errors.push("Nombre completo vacío (se requiere al menos Nombre o Apellido P)");
  }

  // Date of birth
  const dateOfBirth = parseDateOfBirth(fechaNacRaw);
  if (!dateOfBirth) {
    errors.push(`Fecha de nacimiento inválida: "${fechaNacRaw}"`);
  } else {
    const year = parseInt(dateOfBirth.split("-")[0]);
    if (year < 1950 || year > new Date().getFullYear()) {
      errors.push(`Año de nacimiento fuera de rango: ${year}`);
    }
  }

  // Email (optional)
  const email = emailRaw != null ? String(emailRaw).trim() : "";

  // RUT
  const rut = rutRaw != null ? String(rutRaw).trim() : undefined;
  let isDuplicate = false;
  if (rut) {
    const normalizedRut = normalizeRut(rut);
    if (existingRuts.has(normalizedRut)) {
      isDuplicate = true;
      warnings.push(`RUT ${rut} ya existe en el sistema (se omitirá)`);
    }
  }

  // Gender
  const gender = generoRaw != null ? normalizeGender(generoRaw) : undefined;
  if (generoRaw == null || String(generoRaw).trim() === "") {
    warnings.push("Género no especificado, se usará 'Otro'");
  }

  // Category cross-check
  let calculatedCategory = "";
  let excelCategory: string | undefined;
  if (dateOfBirth) {
    calculatedCategory = calculateCategoryFromBirthDate(dateOfBirth);
    if (categoriaRaw) {
      excelCategory = String(categoriaRaw).trim();
      const excelNorm = excelCategory.replace(/\s+/g, " ").trim();
      const calcNorm = calculatedCategory.replace(/\s+/g, " ").trim();
      // Loose match (Excel uses "INF E", system uses "Inf E")
      if (excelNorm.toUpperCase() !== calcNorm.toUpperCase()) {
        warnings.push(
          `Categoría Excel "${excelCategory}" difiere de la calculada "${calculatedCategory}"`
        );
      }
    }
  }

  const swimmer: ParsedSwimmer | undefined =
    errors.length === 0
      ? {
          name: fullName,
          email: email || `${rut ? normalizeRut(rut) : fullName.toLowerCase().replace(/\s+/g, ".")}@sin-email.local`,
          rut: rut || undefined,
          gender: gender ?? "Otro",
          dateOfBirth: dateOfBirth!,
          calculatedCategory,
          excelCategory,
        }
      : undefined;

  return { rowIndex, rawData: rawRow, swimmer, errors, warnings, isDuplicate };
}

function parseExcelFile(file: File, existingRuts: Set<string>): Promise<ParsedRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary", cellDates: true });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
          defval: null,
          raw: false,
        });

        if (rows.length === 0) {
          reject(new Error("El archivo está vacío o no contiene datos"));
          return;
        }

        // Filter out completely empty rows
        const nonEmptyRows = rows.filter((row) =>
          Object.values(row).some((v) => v != null && String(v).trim() !== "")
        );

        const parsed = nonEmptyRows.map((row, i) =>
          parseRow(row, i + 2, existingRuts) // +2: header is row 1, data starts row 2
        );
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Error al leer el archivo"));
    reader.readAsBinaryString(file);
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ImportSwimmersDialog({
  open,
  onOpenChange,
  existingSwimmers,
  onImport,
}: ImportSwimmersDialogProps) {
  const [step, setStep] = useState<ImportStep>("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [importResults, setImportResults] = useState<{
    success: number;
    skipped: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const existingRuts = new Set(
    existingSwimmers
      .filter((s) => s.rut)
      .map((s) => normalizeRut(s.rut!))
  );

  const validRows = parsedRows.filter((r) => r.errors.length === 0 && !r.isDuplicate);
  const invalidRows = parsedRows.filter((r) => r.errors.length > 0);
  const duplicateRows = parsedRows.filter((r) => r.isDuplicate && r.errors.length === 0);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.match(/\.(xlsx|xls|ods|csv)$/i)) {
        setParseError("Formato no soportado. Usa un archivo .xlsx, .xls o .csv");
        return;
      }
      setParseError(null);
      setFileName(file.name);
      try {
        const rows = await parseExcelFile(file, existingRuts);
        setParsedRows(rows);
        setStep("preview");
      } catch (err) {
        setParseError(err instanceof Error ? err.message : "Error al procesar el archivo");
      }
    },
    [existingRuts]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleImport = async () => {
    setStep("importing");
    setProgress(0);
    const results = { success: 0, skipped: 0, failed: 0, errors: [] as string[] };

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      try {
        await onImport({
          name: row.swimmer!.name,
          email: row.swimmer!.email,
          rut: row.swimmer!.rut,
          gender: row.swimmer!.gender,
          dateOfBirth: row.swimmer!.dateOfBirth,
          schedule: "7am",
          joinDate: new Date().toISOString().split("T")[0],
          personalBests: [],
          personalBestsHistory: [],
          goals: [],
        });
        results.success++;
      } catch (err) {
        results.failed++;
        results.errors.push(
          `Fila ${row.rowIndex} (${row.swimmer!.name}): ${err instanceof Error ? err.message : "Error desconocido"}`
        );
      }
      setProgress(Math.round(((i + 1) / validRows.length) * 100));
    }

    results.skipped = duplicateRows.length;
    setImportResults(results);
    setStep("done");
  };

  const handleReset = () => {
    setStep("upload");
    setFileName("");
    setParsedRows([]);
    setParseError(null);
    setProgress(0);
    setImportResults(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
            Importar Nadadores desde Excel
          </DialogTitle>
          <DialogDescription>
            Carga un archivo .xlsx con los datos de los atletas. Las columnas esperadas son:
            Nombre, Apellido P, Apellido M, Rut, Genero, Fecha de Nacimiento, Email tutor.
          </DialogDescription>
        </DialogHeader>

        {/* ── UPLOAD ── */}
        {step === "upload" && (
          <div className="space-y-4">
            {/* Download helpers */}
            <div className="flex flex-wrap gap-2 pb-1 border-b border-gray-100">
              <a
                href="/Plantilla_Atletas.xlsx"
                download="Plantilla_Atletas.xlsx"
                className="inline-flex items-center gap-2 text-sm font-medium text-green-700 border border-green-300 rounded-md px-3 py-1.5 hover:bg-green-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Descargar plantilla Excel
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateGuiaPDF()}
                className="gap-2 text-blue-700 border-blue-300 hover:bg-blue-50"
              >
                <BookOpen className="w-4 h-4" />
                Descargar guía de columnas (PDF)
              </Button>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
              <p className="text-sm font-medium text-gray-700">
                Arrastra tu archivo aquí o haz clic para seleccionarlo
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Formatos aceptados: .xlsx, .xls, .csv
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.ods,.csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </div>

            {parseError && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{parseError}</AlertDescription>
              </Alert>
            )}

            <div className="text-xs text-gray-500 bg-gray-50 rounded p-3 space-y-1">
              <p className="font-medium">Columnas reconocidas automáticamente:</p>
              <p>• <strong>Obligatorias:</strong> Nombre, Apellido P, Fecha de Nacimiento</p>
              <p>• <strong>Opcionales:</strong> Apellido M, Rut, Genero, Email tutor, Categoria</p>
              <p>• Los nadadores con RUT ya registrado se omitirán automáticamente.</p>
            </div>
          </div>
        )}

        {/* ── PREVIEW ── */}
        {step === "preview" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <FileSpreadsheet className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{fileName}</span>
              <span className="text-gray-400">·</span>
              <span>{parsedRows.length} filas procesadas</span>
            </div>

            {/* Summary badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {validRows.length} listas para importar
              </Badge>
              {duplicateRows.length > 0 && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {duplicateRows.length} duplicadas (se omitirán)
                </Badge>
              )}
              {invalidRows.length > 0 && (
                <Badge className="bg-red-100 text-red-800">
                  <XCircle className="w-3 h-3 mr-1" />
                  {invalidRows.length} con errores
                </Badge>
              )}
            </div>

            {/* Row table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-72 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">Fila</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">Nombre</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">RUT</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">Categoría</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {parsedRows.map((row) => (
                      <tr
                        key={row.rowIndex}
                        className={
                          row.errors.length > 0
                            ? "bg-red-50"
                            : row.isDuplicate
                            ? "bg-yellow-50"
                            : ""
                        }
                      >
                        <td className="px-3 py-2 text-gray-500">{row.rowIndex}</td>
                        <td className="px-3 py-2 font-medium">
                          {row.swimmer?.name ||
                            String(
                              row.rawData["Nombre"] ?? row.rawData["NOMBRE"] ?? "—"
                            )}
                        </td>
                        <td className="px-3 py-2 text-gray-500">
                          {row.swimmer?.rut || "—"}
                        </td>
                        <td className="px-3 py-2">
                          {row.swimmer?.calculatedCategory || "—"}
                        </td>
                        <td className="px-3 py-2">
                          {row.errors.length > 0 ? (
                            <span className="text-red-600 flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              {row.errors[0]}
                            </span>
                          ) : row.isDuplicate ? (
                            <span className="text-yellow-700 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Duplicado
                            </span>
                          ) : (
                            <span className="text-green-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              {row.warnings.length > 0 ? row.warnings[0] : "OK"}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {validRows.length === 0 && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  No hay filas válidas para importar. Revisa los errores arriba y corrige el archivo.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Cargar otro archivo
              </Button>
              <Button
                onClick={handleImport}
                disabled={validRows.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                Importar {validRows.length} nadador{validRows.length !== 1 ? "es" : ""}
              </Button>
            </div>
          </div>
        )}

        {/* ── IMPORTING ── */}
        {step === "importing" && (
          <div className="space-y-6 py-6">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 mx-auto mb-3 text-blue-500 animate-spin" />
              <p className="font-medium">Importando nadadores…</p>
              <p className="text-sm text-gray-500 mt-1">
                {Math.round((progress / 100) * validRows.length)} de {validRows.length}
              </p>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        )}

        {/* ── DONE ── */}
        {step === "done" && importResults && (
          <div className="space-y-4 py-2">
            <div className="text-center">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-500" />
              <p className="text-lg font-semibold">Importación completada</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1">
                ✓ {importResults.success} importados
              </Badge>
              {importResults.skipped > 0 && (
                <Badge className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1">
                  ⊘ {importResults.skipped} omitidos (duplicados)
                </Badge>
              )}
              {importResults.failed > 0 && (
                <Badge className="bg-red-100 text-red-800 text-sm px-3 py-1">
                  ✗ {importResults.failed} fallidos
                </Badge>
              )}
            </div>

            {importResults.errors.length > 0 && (
              <div className="border border-red-200 rounded-lg p-3 bg-red-50">
                <p className="text-sm font-medium text-red-700 mb-2">Errores al guardar:</p>
                <ul className="text-xs text-red-600 space-y-1">
                  {importResults.errors.map((e, i) => (
                    <li key={i}>• {e}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              {importResults.failed > 0 && (
                <Button variant="outline" onClick={handleReset}>
                  Importar otro archivo
                </Button>
              )}
              <Button onClick={handleClose} className="bg-green-600 hover:bg-green-700">
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
