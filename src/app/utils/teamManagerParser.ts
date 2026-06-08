/**
 * teamManagerParser.ts
 *
 * Parses CSV and XLS/XLSX files exported from Hytek Team Manager (or compatible
 * swimming-meet software) into a normalized structure ready for import.
 *
 * Supported column headers (case-insensitive, any order):
 *   Nombre | Name | Atleta | Nadador | Swimmer
 *   RUT | RUT/RUN | Run | DNI | ID
 *   Prueba | Event | Evento | Distancia
 *   Tiempo | Time | Marca | Resultado
 *   Posicion | Position | Lugar | Place | Pos | Puesto
 *   Puntos | Points | FINA | FINA Pts | Pts
 *   Torneo | Meet | Competencia | Campeonato | Competicion | Nombre Torneo
 *   Fecha | Date | Fecha Competencia | Meet Date
 *
 * Time formats accepted:
 *   "25.12"    → 0:25.12
 *   "1:05.34"  → 1:05.34
 *   "DQ" / "NS" / "NT" / "DNF" → null (no time recorded)
 *
 * Event formats accepted (English and Spanish):
 *   "50 Libre", "100m Espalda", "200 Free", "400 IM", "1500 Freestyle"
 */

import * as XLSX from "xlsx";

// ─── Domain types ─────────────────────────────────────────────────────────────

export type SwimStyle = "Libre" | "Espalda" | "Pecho" | "Mariposa" | "Combinado";

export const VALID_DISTANCES = [50, 100, 200, 400, 800, 1500] as const;
export type Distance = (typeof VALID_DISTANCES)[number];

export interface ParsedEvent {
  distance: Distance;
  style: SwimStyle;
  label: string; // "50 Libre"
}

export interface TeamManagerRow {
  rowIndex: number;      // 1-based row number in the file
  name: string;
  rut?: string;          // raw RUT as read from file
  normalizedRut?: string; // normalized for matching (no dots/dashes, lowercase)
  event: string;         // raw event string from file
  parsedEvent?: ParsedEvent;
  time: string;          // normalized "M:SS.ss" or "" if DQ/NS/NT
  timeInSeconds?: number;
  isInvalidTime: boolean; // DQ, NS, NT, DNF – row is recorded but time is absent
  position?: number;
  points?: number;
  meetName?: string;
  date?: string;         // YYYY-MM-DD
  errors: string[];
  warnings: string[];
}

export interface ParseFileResult {
  rows: TeamManagerRow[];
  globalErrors: string[];
  globalWarnings: string[];
  detectedMeetName?: string;
  detectedDate?: string;
  totalRawRows: number;  // before filtering blank rows
}

// ─── Internal constants ───────────────────────────────────────────────────────

const INVALID_TIME_TOKENS = new Set([
  "DQ", "NS", "NT", "DNF", "DNS", "DSQ", "DFS", "---", "--", "-",
  "N/T", "N/A", "NA", "NO TIME",
]);

// Each key is a canonical field name; the array contains accepted header variants.
const COLUMN_ALIASES: Record<string, string[]> = {
  name:     ["nombre", "name", "atleta", "nadador", "swimmer", "deportista", "apellido nombre"],
  rut:      ["rut", "rut/run", "run", "dni", "documento", "id", "rut nadador"],
  event:    ["prueba", "event", "evento", "distancia", "distance", "prueba/distancia"],
  time:     ["tiempo", "time", "marca", "resultado", "result", "tiempo final", "final time"],
  position: ["posicion", "position", "lugar", "place", "pos", "puesto", "pos."],
  points:   ["puntos", "points", "fina", "fina pts", "fina points", "pts", "puntos fina"],
  meetName: ["torneo", "meet", "competencia", "campeonato", "competicion",
             "nombre torneo", "meet name", "tournament", "nombre competencia"],
  date:     ["fecha", "date", "fecha competencia", "meet date", "fecha torneo"],
};

// Maps raw style tokens (lowercased) to canonical SwimStyle
const STYLE_MAP: Record<string, SwimStyle> = {
  // Spanish
  libre: "Libre", l: "Libre",
  espalda: "Espalda", esp: "Espalda", e: "Espalda",
  pecho: "Pecho", pe: "Pecho", pc: "Pecho", p: "Pecho",
  mariposa: "Mariposa", mar: "Mariposa", m: "Mariposa", mp: "Mariposa",
  combinado: "Combinado", comb: "Combinado", ci: "Combinado", cm: "Combinado",
  // English
  free: "Libre", freestyle: "Libre", fr: "Libre",
  back: "Espalda", backstroke: "Espalda", bk: "Espalda",
  breast: "Pecho", breaststroke: "Pecho", br: "Pecho",
  fly: "Mariposa", butterfly: "Mariposa", fl: "Mariposa",
  im: "Combinado", medley: "Combinado", "individual medley": "Combinado",
  "ind. medley": "Combinado", "ind medley": "Combinado",
};

// ─── Public helpers ───────────────────────────────────────────────────────────

/** Removes dots, dashes, and spaces from a RUT; lowercases the check digit. */
export function normalizeRut(rut: string): string {
  return String(rut).replace(/[.\-\s]/g, "").toLowerCase();
}

/**
 * Normalizes a swimmer name for fuzzy comparison:
 * strips accents, uppercases, collapses whitespace.
 */
export function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Returns true when every word in `needle` appears in `haystack`
 * (after name normalization). Used for partial name matching.
 */
export function nameContainsAll(needle: string, haystack: string): boolean {
  const needleWords = normalizeName(needle).split(" ");
  const haystackNorm = normalizeName(haystack);
  return needleWords.every((w) => haystackNorm.includes(w));
}

/**
 * Parses a raw time string into a canonical "M:SS.ss" format.
 * Returns null for DQ/NS/NT/DNF.
 *
 * Accepted inputs:
 *   "25.12"     → "0:25.12"
 *   "1:05.34"   → "1:05.34"
 *   "63.5"      → "1:03.50"  (raw seconds > 60)
 *   "25,12"     → "0:25.12"  (comma decimal separator)
 */
export function normalizeTime(raw: unknown): string | null {
  const str = String(raw ?? "")
    .trim()
    .toUpperCase()
    .replace(",", ".");

  if (!str || INVALID_TIME_TOKENS.has(str)) return null;

  // Already in M:SS.ss format (e.g. "1:05.34" or "12:34.56")
  const colonMatch = str.match(/^(\d+):(\d{1,2})\.(\d{1,2})$/);
  if (colonMatch) {
    const min = parseInt(colonMatch[1], 10);
    const sec = parseInt(colonMatch[2], 10);
    const dec = colonMatch[3].padEnd(2, "0");
    const secStr = `${String(sec).padStart(2, "0")}.${dec}`;
    return `${min}:${secStr}`;
  }

  // Raw seconds: "25.12" or "125.3"
  const rawSec = parseFloat(str);
  if (!isNaN(rawSec) && rawSec > 0) {
    const min = Math.floor(rawSec / 60);
    const sec = rawSec % 60;
    const secFixed = sec.toFixed(2).padStart(5, "0"); // "05.34" or "25.12"
    return `${min}:${secFixed}`;
  }

  return null; // unparseable
}

/** Converts a normalized "M:SS.ss" time string to total seconds. */
export function timeToSeconds(time: string): number {
  const parts = time.split(":");
  if (parts.length === 2) {
    return parseInt(parts[0], 10) * 60 + parseFloat(parts[1]);
  }
  return parseFloat(time);
}

/**
 * Parses an event string like "50 Libre", "100m Back", "400 IM".
 * Returns null if the string cannot be parsed.
 */
export function parseEvent(raw: string): ParsedEvent | null {
  // Match patterns: "50 Libre", "100m Espalda", "200 M Pecho", "1500 Free"
  const match = String(raw).match(/^(\d+)\s*m?\s+(.+)$/i);
  if (!match) return null;

  const distance = parseInt(match[1], 10) as Distance;
  if (!(VALID_DISTANCES as readonly number[]).includes(distance)) return null;

  const styleRaw = match[2].trim().toLowerCase();
  const style = STYLE_MAP[styleRaw];
  if (!style) return null;

  return { distance, style, label: `${distance} ${style}` };
}

// ─── Column detection ─────────────────────────────────────────────────────────

type ColumnMap = Partial<Record<keyof typeof COLUMN_ALIASES, number>>;

function detectColumns(headers: string[]): ColumnMap {
  const result: ColumnMap = {};

  headers.forEach((rawHeader, idx) => {
    const h = String(rawHeader ?? "").toLowerCase().trim();
    for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
      if (aliases.includes(h) && !(field in result)) {
        (result as Record<string, number>)[field] = idx;
      }
    }
  });

  return result;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

/** Excel serial date → YYYY-MM-DD */
function excelSerialToDate(serial: number): string {
  const utcMs = (serial - 25569) * 86400 * 1000;
  return new Date(utcMs).toISOString().slice(0, 10);
}

function parseDate(raw: unknown): string | undefined {
  if (raw == null || String(raw).trim() === "") return undefined;

  // Excel numeric serial
  if (typeof raw === "number") {
    try {
      return excelSerialToDate(raw);
    } catch {
      return undefined;
    }
  }

  const str = String(raw).trim();

  // Already ISO
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);

  // DD/MM/YYYY or DD-MM-YYYY
  const dmy = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;

  return undefined;
}

// ─── Row processing ───────────────────────────────────────────────────────────

function processRow(
  raw: Record<string, unknown>,
  colMap: ColumnMap,
  rowIndex: number,
  fallbackMeet?: string,
  fallbackDate?: string
): TeamManagerRow | null {
  const cell = (field: keyof typeof COLUMN_ALIASES): unknown => {
    const idx = colMap[field];
    if (idx === undefined) return undefined;
    // raw may be indexed by column number string OR by header string
    const byIndex = Object.values(raw)[idx];
    return byIndex;
  };

  const nameRaw = String(cell("name") ?? "").trim();
  if (!nameRaw) return null; // blank row

  const errors: string[] = [];
  const warnings: string[] = [];

  // ── Name ──
  const name = nameRaw;

  // ── RUT ──
  const rutRaw = cell("rut");
  const rut = rutRaw != null && String(rutRaw).trim() !== ""
    ? String(rutRaw).trim()
    : undefined;
  const normalizedRut = rut ? normalizeRut(rut) : undefined;

  // ── Event ──
  const eventRaw = String(cell("event") ?? "").trim();
  if (!eventRaw) errors.push("Prueba vacía");
  const parsedEvent = eventRaw ? parseEvent(eventRaw) : undefined;
  if (eventRaw && !parsedEvent) {
    warnings.push(`Prueba no reconocida: "${eventRaw}"`);
  }

  // ── Time ──
  const timeRaw = cell("time");
  const normalizedTimeStr = normalizeTime(timeRaw);
  const isInvalidTime =
    normalizedTimeStr === null &&
    timeRaw != null &&
    String(timeRaw).trim() !== "" &&
    INVALID_TIME_TOKENS.has(String(timeRaw).trim().toUpperCase());

  const time = normalizedTimeStr ?? "";
  const timeInSeconds =
    normalizedTimeStr ? timeToSeconds(normalizedTimeStr) : undefined;

  if (!normalizedTimeStr && !isInvalidTime && timeRaw != null && String(timeRaw).trim() !== "") {
    warnings.push(`Tiempo no reconocido: "${timeRaw}"`);
  }

  // ── Position ──
  const posRaw = cell("position");
  const position =
    posRaw != null && String(posRaw).trim() !== ""
      ? parseInt(String(posRaw), 10) || undefined
      : undefined;

  // ── Points ──
  const ptsRaw = cell("points");
  const points =
    ptsRaw != null && String(ptsRaw).trim() !== ""
      ? parseFloat(String(ptsRaw)) || undefined
      : undefined;

  // ── Meet name ──
  const meetRaw = cell("meetName");
  const meetName =
    meetRaw != null && String(meetRaw).trim() !== ""
      ? String(meetRaw).trim()
      : fallbackMeet;

  // ── Date ──
  const dateRaw = cell("date");
  const date = parseDate(dateRaw) ?? fallbackDate;

  return {
    rowIndex,
    name,
    rut,
    normalizedRut,
    event: eventRaw,
    parsedEvent,
    time,
    timeInSeconds,
    isInvalidTime,
    position,
    points,
    meetName,
    date,
    errors,
    warnings,
  };
}

// ─── Main parser entry points ─────────────────────────────────────────────────

/** Internal: processes a 2-D array of cells (first row = headers). */
function processSheetData(
  sheetData: unknown[][],
  fallbackMeet?: string,
  fallbackDate?: string
): ParseFileResult {
  const globalErrors: string[] = [];
  const globalWarnings: string[] = [];
  const rows: TeamManagerRow[] = [];

  if (sheetData.length < 2) {
    globalErrors.push("El archivo no contiene filas de datos (solo encabezado o vacío).");
    return { rows, globalErrors, globalWarnings, totalRawRows: 0 };
  }

  const headerRow = sheetData[0].map((h) => String(h ?? "").toLowerCase().trim());
  const colMap = detectColumns(headerRow);

  if (!("name" in colMap)) {
    globalErrors.push(
      "No se encontró columna de nombre del nadador. " +
        "Asegúrate de incluir una columna 'Nombre' o 'Name'."
    );
  }
  if (!("event" in colMap)) {
    globalWarnings.push(
      "No se encontró columna de prueba/evento. Se intentará leer filas de todas formas."
    );
  }
  if (!("time" in colMap)) {
    globalWarnings.push("No se encontró columna de tiempo/marca.");
  }

  // Detect global meet name / date from header metadata rows (rows before headers
  // with no matching columns) – Team Manager sometimes includes a meet title row.
  let detectedMeetName = fallbackMeet;
  let detectedDate = fallbackDate;

  const totalRawRows = sheetData.length - 1;

  for (let i = 1; i < sheetData.length; i++) {
    const rowArr = sheetData[i];
    if (rowArr.every((c) => c == null || String(c).trim() === "")) continue;

    // Build a keyed record using column indices
    const raw: Record<string, unknown> = {};
    rowArr.forEach((val, idx) => {
      raw[String(idx)] = val;
    });

    const processed = processRow(raw, colMap, i, detectedMeetName, detectedDate);
    if (!processed) continue;

    // Capture first detected meet name to use as global fallback
    if (!detectedMeetName && processed.meetName) {
      detectedMeetName = processed.meetName;
    }
    if (!detectedDate && processed.date) {
      detectedDate = processed.date;
    }

    rows.push(processed);
  }

  return { rows, globalErrors, globalWarnings, detectedMeetName, detectedDate, totalRawRows };
}

/**
 * Parses a File object (CSV, XLS, or XLSX) into TeamManagerRows.
 * This is the main entry point for the browser import UI.
 */
export async function parseTeamManagerFile(file: File): Promise<ParseFileResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array", cellDates: false });

        if (!workbook.SheetNames.length) {
          resolve({
            rows: [],
            globalErrors: ["El archivo no contiene hojas de cálculo."],
            globalWarnings: [],
            totalRawRows: 0,
          });
          return;
        }

        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        // header: 1 → returns array of arrays
        const sheetData = XLSX.utils.sheet_to_json<unknown[]>(firstSheet, {
          header: 1,
          defval: null,
          blankrows: false,
        });

        resolve(processSheetData(sheetData as unknown[][]));
      } catch (err) {
        resolve({
          rows: [],
          globalErrors: [
            `Error al leer el archivo: ${err instanceof Error ? err.message : String(err)}`,
          ],
          globalWarnings: [],
          totalRawRows: 0,
        });
      }
    };

    reader.onerror = () => {
      resolve({
        rows: [],
        globalErrors: ["No se pudo leer el archivo."],
        globalWarnings: [],
        totalRawRows: 0,
      });
    };

    reader.readAsArrayBuffer(file);
  });
}

// ─── Swimmer matching ─────────────────────────────────────────────────────────

export type MatchStatus =
  | "matched_rut"       // exact RUT match
  | "matched_name"      // exact normalized name match
  | "matched_partial"   // all words of one name found in the other
  | "not_found"         // no match
  | "ambiguous";        // multiple candidates (name match, no RUT)

export interface MatchResult {
  status: MatchStatus;
  swimmerId?: string;
  swimmerName?: string;
  candidates?: { id: string; name: string }[];
}

/**
 * Matches a parsed row against an array of existing swimmers.
 * Priority: RUT > exact name > partial name.
 */
export function matchSwimmer(
  row: Pick<TeamManagerRow, "name" | "normalizedRut">,
  swimmers: Array<{ id: string; name: string; rut?: string }>
): MatchResult {
  // 1. Exact RUT match
  if (row.normalizedRut) {
    const byRut = swimmers.filter(
      (s) => s.rut && normalizeRut(s.rut) === row.normalizedRut
    );
    if (byRut.length === 1) {
      return { status: "matched_rut", swimmerId: byRut[0].id, swimmerName: byRut[0].name };
    }
    if (byRut.length > 1) {
      return {
        status: "ambiguous",
        candidates: byRut.map((s) => ({ id: s.id, name: s.name })),
      };
    }
  }

  // 2. Exact normalized name match
  const normRow = normalizeName(row.name);
  const byExactName = swimmers.filter(
    (s) => normalizeName(s.name) === normRow
  );
  if (byExactName.length === 1) {
    return { status: "matched_name", swimmerId: byExactName[0].id, swimmerName: byExactName[0].name };
  }
  if (byExactName.length > 1) {
    return {
      status: "ambiguous",
      candidates: byExactName.map((s) => ({ id: s.id, name: s.name })),
    };
  }

  // 3. Partial name match (all words of the shorter name appear in the longer)
  const partial = swimmers.filter(
    (s) =>
      nameContainsAll(row.name, s.name) || nameContainsAll(s.name, row.name)
  );
  if (partial.length === 1) {
    return { status: "matched_partial", swimmerId: partial[0].id, swimmerName: partial[0].name };
  }
  if (partial.length > 1) {
    return {
      status: "ambiguous",
      candidates: partial.map((s) => ({ id: s.id, name: s.name })),
    };
  }

  return { status: "not_found" };
}

// ─── Export format validation ─────────────────────────────────────────────────

/**
 * Returns a summary of how many rows have each status after full parsing.
 * Useful for the import dialog summary line.
 */
export interface ParseSummary {
  total: number;
  withErrors: number;
  withWarnings: number;
  invalidTime: number;   // DQ/NS/NT
  unparsedEvent: number;
  missingName: number;
}

export function summarize(rows: TeamManagerRow[]): ParseSummary {
  return {
    total: rows.length,
    withErrors: rows.filter((r) => r.errors.length > 0).length,
    withWarnings: rows.filter((r) => r.warnings.length > 0).length,
    invalidTime: rows.filter((r) => r.isInvalidTime).length,
    unparsedEvent: rows.filter((r) => r.event && !r.parsedEvent).length,
    missingName: rows.filter((r) => !r.name).length,
  };
}

// ─── Example CSV template ─────────────────────────────────────────────────────

/** Returns a CSV string that can be downloaded as a template. */
export function generateTemplateCSV(): string {
  const headers = [
    "Nombre", "RUT", "Prueba", "Tiempo", "Posicion", "Puntos", "Torneo", "Fecha",
  ];
  const examples = [
    ["Juan Pérez González", "12345678-9", "50 Libre", "25.12", "3", "570", "Campeonato Regional", "2026-05-15"],
    ["María Silva Rojas", "98765432-1", "100 Espalda", "1:05.34", "2", "620", "Campeonato Regional", "2026-05-15"],
    ["Carlos López", "", "200 Pecho", "2:34.56", "", "", "Campeonato Regional", "2026-05-15"],
    ["Ana Torres", "11223344-5", "400 Combinado", "DQ", "", "", "Campeonato Regional", "2026-05-15"],
  ];
  const lines = [headers, ...examples].map((row) =>
    row.map((c) => (c.includes(",") ? `"${c}"` : c)).join(",")
  );
  return lines.join("\n");
}
