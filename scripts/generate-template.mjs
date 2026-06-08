/**
 * Generates Plantilla_Atletas.xlsx → public/Plantilla_Atletas.xlsx
 * Run: node scripts/generate-template.mjs
 *
 * Structure:
 *   Row 1  — Column headers (row 1 = headers so parser finds them immediately)
 *   Row 2  — Example row (italic, light-blue) with formulas for Año/Categoria/Edad
 *   Rows 3–102 — Empty data rows with formulas for Año/Categoria/Edad
 *
 * Auto-calculated columns (yellow background):
 *   I  = Año       → =IF(H_="";"";AÑO(H_))
 *   J  = Categoria → nested IF on YEAR(H_)
 *   K  = Edad      → =IF(H_="";"";AÑO(HOY())-AÑO(H_))
 */

import ExcelJS from "exceljs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.join(__dirname, "..", "public", "Plantilla_Atletas.xlsx");

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  headerBg:    "1A5276",   // navy — editable columns
  headerAuto:  "B7770D",   // amber — auto-calculated columns
  headerFont:  "FFFFFF",
  exampleBg:   "EBF5FB",   // light blue row
  autoBg:      "FFFDE7",   // light yellow — auto-calculated cells
  altRow:      "F8F9FA",   // alternating row
  border:      "AED6F1",
};

// ─── Column definitions ───────────────────────────────────────────────────────
// auto: true  → formula-driven (yellow), no dropdown
// auto: false → user-editable
const COLS = [
  { header: "Nombre corto",         key: "nombreCorto",     width: 14,  auto: false },
  { header: "CARACTERISTICA",       key: "caracteristica",  width: 16,  auto: false },
  { header: "Rut",                  key: "rut",             width: 15,  auto: false },
  { header: "Apellido P",           key: "apellidoP",       width: 14,  auto: false },
  { header: "Apellido M",           key: "apellidoM",       width: 14,  auto: false },
  { header: "Nombre",               key: "nombre",          width: 16,  auto: false },
  { header: "Genero",               key: "genero",          width: 12,  auto: false },
  { header: "Fecha de Nacimiento",  key: "fechaNac",        width: 20,  auto: false },
  { header: "Año",                  key: "anio",            width: 8,   auto: true  }, // col I (9)
  { header: "Categoria",            key: "categoria",       width: 13,  auto: true  }, // col J (10)
  { header: "Edad",                 key: "edad",            width: 8,   auto: true  }, // col K (11)
  { header: "Situación",            key: "situacion",       width: 12,  auto: false },
  { header: "Colegio",              key: "colegio",         width: 24,  auto: false },
  { header: "Nacionalidad",         key: "nacionalidad",    width: 14,  auto: false },
  { header: "Comuna",               key: "comuna",          width: 14,  auto: false },
  { header: "Direccion Particular", key: "direccion",       width: 28,  auto: false },
  { header: "Fono deportista",      key: "fonoDeportista",  width: 16,  auto: false },
  { header: "Nombre apoderado",     key: "nombreApoderado", width: 24,  auto: false },
  { header: "Fono Apoderado",       key: "fonoApoderado",   width: 16,  auto: false },
  { header: "Email tutor",          key: "emailTutor",      width: 26,  auto: false },
];

const GENEROS    = ["Masculino", "Femenino", "Otro"];
const SITUACIONES = ["Activo", "Inactivo", "Suspendido", "Egresado"];

// ─── Formula builders ─────────────────────────────────────────────────────────

/** =IF(Hrow="","",YEAR(Hrow)) */
function formulaAnio(row) {
  return { formula: `IF(H${row}="","",YEAR(H${row}))` };
}

/** =IF(Hrow="","",YEAR(TODAY())-YEAR(Hrow)) */
function formulaEdad(row) {
  return { formula: `IF(H${row}="","",YEAR(TODAY())-YEAR(H${row}))` };
}

/**
 * Nested IF: maps birth year → category string
 * Matches the app's calculateCategoryFromBirthDate() in swimmerUtils.ts
 */
function formulaCategoria(row) {
  const h = `H${row}`;
  const f =
    `IF(${h}="","",` +
    `IF(YEAR(${h})>=2018,"INF E",` +
    `IF(YEAR(${h})=2017,"INF D",` +
    `IF(YEAR(${h})=2016,"INF C",` +
    `IF(YEAR(${h})=2015,"INF A",` +
    `IF(YEAR(${h})=2014,"INF BI",` +
    `IF(YEAR(${h})=2013,"INF BII",` +
    `IF(YEAR(${h})=2012,"JUV AI",` +
    `IF(YEAR(${h})=2011,"JUV AII",` +
    `IF(YEAR(${h})=2010,"JUV BI",` +
    `IF(YEAR(${h})=2009,"JUV BII",` +
    `IF(YEAR(${h})=2008,"JUV BIII",` +
    `"MAYORES"))))))))))))`;
  return { formula: f };
}

// ─── Static example values (non-formula columns) ──────────────────────────────
const EXAMPLE = {
  nombreCorto:     "GARCIA J",
  caracteristica:  "Velocista",
  rut:             "15.234.567-8",
  apellidoP:       "García",
  apellidoM:       "López",
  nombre:          "Juan",
  genero:          "Masculino",
  fechaNac:        new Date(2010, 2, 15), // 15 Mar 2010 — must be a real Date for YEAR() to work
  situacion:       "Activo",
  colegio:         "Liceo Politécnico de Santiago",
  nacionalidad:    "Chilena",
  comuna:          "Santiago",
  direccion:       "Av. Las Flores 123, Dpto 4B",
  fonoDeportista:  "+56 9 1234 5678",
  nombreApoderado: "María García Rojas",
  fonoApoderado:   "+56 9 8765 4321",
  emailTutor:      "m.garcia@email.com",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function border() {
  const s = { style: "thin", color: { argb: C.border } };
  return { top: s, left: s, bottom: s, right: s };
}

function addDropdown(ws, colIdx, startRow, endRow, list) {
  const letter = ws.getColumn(colIdx).letter;
  for (let r = startRow; r <= endRow; r++) {
    ws.getCell(`${letter}${r}`).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [`"${list.join(",")}"`],
      showErrorMessage: true,
      errorStyle: "warning",
      errorTitle: "Valor no válido",
      error: `Elige: ${list.join(", ")}`,
    };
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function generate() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Club Lo Prado";
  wb.created = new Date();

  const ws = wb.addWorksheet("Atletas", {
    // Freeze only the header row — row 1 = headers
    views: [{ state: "frozen", ySplit: 1 }],
    pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1 },
  });

  // Set column widths
  ws.columns = COLS.map((c) => ({ key: c.key, width: c.width }));

  // ── ROW 1: Headers ───────────────────────────────────────────────────────────
  const hRow = ws.getRow(1);
  hRow.height = 30;
  COLS.forEach((col, idx) => {
    const cell = hRow.getCell(idx + 1);
    cell.value = col.header;
    cell.font  = { name: "Calibri", size: 10, bold: true, color: { argb: C.headerFont } };
    cell.fill  = {
      type: "pattern", pattern: "solid",
      fgColor: { argb: col.auto ? C.headerAuto : C.headerBg },
    };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = border();
  });

  // ── ROW 2: Example row ───────────────────────────────────────────────────────
  const exRow = ws.getRow(2);
  exRow.height = 20;
  COLS.forEach((col, idx) => {
    const cell = exRow.getCell(idx + 1);

    if (col.auto) {
      // Auto-calculated columns get formulas referencing row 2
      if (col.key === "anio")      cell.value = formulaAnio(2);
      if (col.key === "categoria") cell.value = formulaCategoria(2);
      if (col.key === "edad")      cell.value = formulaEdad(2);
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.autoBg } };
    } else {
      const val = EXAMPLE[col.key] ?? "";
      cell.value = val;
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.exampleBg } };
      // Apply date format to Fecha de Nacimiento
      if (col.key === "fechaNac") cell.numFmt = "DD/MM/YYYY";
    }

    cell.font      = { name: "Calibri", size: 9, italic: true, color: { argb: "5D6D7E" } };
    cell.alignment = { vertical: "middle" };
    cell.border    = border();
  });

  // ── ROWS 3–102: Data rows ────────────────────────────────────────────────────
  for (let r = 3; r <= 102; r++) {
    const row = ws.getRow(r);
    row.height = 18;
    COLS.forEach((col, idx) => {
      const cell = row.getCell(idx + 1);
      cell.font      = { name: "Calibri", size: 10 };
      cell.alignment = { vertical: "middle" };
      cell.border    = border();

      if (col.auto) {
        if (col.key === "anio")      cell.value = formulaAnio(r);
        if (col.key === "categoria") cell.value = formulaCategoria(r);
        if (col.key === "edad")      cell.value = formulaEdad(r);
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.autoBg } };
        cell.font = { name: "Calibri", size: 10, color: { argb: "7D6608" } }; // amber text
      } else if (r % 2 === 0) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.altRow } };
      }

      // Date format on Fecha de Nacimiento column
      if (col.key === "fechaNac") cell.numFmt = "DD/MM/YYYY";
    });
  }

  // ── Dropdowns (only on editable columns) ─────────────────────────────────────
  // Col 7 = Genero, Col 12 = Situación  (data rows 2–102)
  addDropdown(ws, 7,  2, 102, GENEROS);
  addDropdown(ws, 12, 2, 102, SITUACIONES);

  // Input hints for Fecha de Nacimiento (col 8) and Rut (col 3)
  const fechaLetter = ws.getColumn(8).letter;
  const rutLetter   = ws.getColumn(3).letter;
  for (let r = 3; r <= 102; r++) {
    ws.getCell(`${fechaLetter}${r}`).dataValidation = {
      type: "textLength", operator: "greaterThan", allowBlank: true, formulae: [0],
      showInputMessage: true,
      promptTitle: "Fecha de Nacimiento",
      prompt: "Formato: DD/MM/YYYY  (ej: 15/03/2010)",
    };
    ws.getCell(`${rutLetter}${r}`).dataValidation = {
      type: "textLength", operator: "greaterThan", allowBlank: true, formulae: [0],
      showInputMessage: true,
      promptTitle: "RUT",
      prompt: "Formato: 12.345.678-K  (sin espacios)",
    };
  }

  // ── Reference sheet ───────────────────────────────────────────────────────────
  const refWs = wb.addWorksheet("Valores Válidos");
  refWs.columns = [
    { header: "Géneros",     key: "gen", width: 14 },
    { header: "Situaciones", key: "sit", width: 14 },
  ];
  const rh = refWs.getRow(1);
  [1, 2].forEach((c) => {
    rh.getCell(c).font  = { name: "Calibri", size: 10, bold: true, color: { argb: C.headerFont } };
    rh.getCell(c).fill  = { type: "pattern", pattern: "solid", fgColor: { argb: C.headerBg } };
    rh.getCell(c).alignment = { horizontal: "center" };
  });
  GENEROS.forEach((g, i)    => { refWs.getRow(i + 2).getCell(1).value = g; });
  SITUACIONES.forEach((s, i) => { refWs.getRow(i + 2).getCell(2).value = s; });

  await wb.xlsx.writeFile(OUTPUT);
  console.log(`✅  Plantilla generada → ${OUTPUT}`);
  console.log(`   Filas: 1 encabezado + 1 ejemplo (fila 2) + 100 datos (filas 3-102)`);
  console.log(`   Columnas auto-calculadas: I=Año  J=Categoría  K=Edad`);
}

generate().catch((err) => {
  console.error("❌  Error:", err);
  process.exit(1);
});
