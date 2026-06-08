/**
 * Generates Plantilla_Atletas.xlsx and places it in public/
 * Run: node scripts/generate-template.mjs
 */

import ExcelJS from "exceljs";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "..", "public", "Plantilla_Atletas.xlsx");

// ─── Palette ─────────────────────────────────────────────────────────────────

const COLORS = {
  headerBg: "1A5276",      // dark navy
  headerFont: "FFFFFF",
  instructionBg: "D6EAF8", // light blue
  instructionFont: "154360",
  exampleBg: "EBF5FB",     // very light blue
  border: "AED6F1",
  required: "FDFEFE",
  altRow: "F8F9FA",
};

// ─── Column definitions ───────────────────────────────────────────────────────

const COLUMNS = [
  { header: "Nombre corto",         key: "nombreCorto",    width: 14 },
  { header: "CARACTERISTICA",       key: "caracteristica", width: 16 },
  { header: "Rut",                  key: "rut",            width: 14 },
  { header: "Apellido P",           key: "apellidoP",      width: 14 },
  { header: "Apellido M",           key: "apellidoM",      width: 14 },
  { header: "Nombre",               key: "nombre",         width: 16 },
  { header: "Genero",               key: "genero",         width: 12 },
  { header: "Fecha de Nacimiento",  key: "fechaNac",       width: 20 },
  { header: "Año",                  key: "anio",           width: 8 },
  { header: "Categoria",            key: "categoria",      width: 12 },
  { header: "Edad",                 key: "edad",           width: 8 },
  { header: "Situación",            key: "situacion",      width: 12 },
  { header: "Colegio",              key: "colegio",        width: 22 },
  { header: "Nacionalidad",         key: "nacionalidad",   width: 14 },
  { header: "Comuna",               key: "comuna",         width: 14 },
  { header: "Direccion Particular", key: "direccion",      width: 28 },
  { header: "Fono deportista",      key: "fonoDeportista", width: 16 },
  { header: "Nombre apoderado",     key: "nombreApoderado",width: 22 },
  { header: "Fono Apoderado",       key: "fonoApoderado",  width: 16 },
  { header: "Email tutor",          key: "emailTutor",     width: 26 },
];

const CATEGORIAS = [
  "INF E","INF D","INF C","INF A",
  "INF BI","INF BII",
  "JUV AI","JUV AII",
  "JUV BI","JUV BII","JUV BIII",
  "MAYORES",
];

const GENEROS = ["Masculino", "Femenino", "Otro"];
const SITUACIONES = ["Activo", "Inactivo", "Suspendido", "Egresado"];

const EXAMPLE_ROW = {
  nombreCorto:    "GARCIA J",
  caracteristica: "Velocista",
  rut:            "15.234.567-8",
  apellidoP:      "García",
  apellidoM:      "López",
  nombre:         "Juan",
  genero:         "Masculino",
  fechaNac:       "15/03/2010",
  anio:           2010,
  categoria:      "JUV BI",
  edad:           15,
  situacion:      "Activo",
  colegio:        "Liceo Politécnico de Santiago",
  nacionalidad:   "Chilena",
  comuna:         "Santiago",
  direccion:      "Av. Las Flores 123, Dpto 4B",
  fonoDeportista: "+56 9 1234 5678",
  nombreApoderado:"María García Rojas",
  fonoApoderado:  "+56 9 8765 4321",
  emailTutor:     "m.garcia@email.com",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function headerFont(size = 10) {
  return { name: "Calibri", size, bold: true, color: { argb: COLORS.headerFont } };
}

function border() {
  const side = { style: "thin", color: { argb: COLORS.border } };
  return { top: side, left: side, bottom: side, right: side };
}

function addDropdown(sheet, col, startRow, endRow, list) {
  const colLetter = sheet.getColumn(col).letter;
  for (let r = startRow; r <= endRow; r++) {
    sheet.getCell(`${colLetter}${r}`).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [`"${list.join(",")}"`],
      showErrorMessage: true,
      errorStyle: "warning",
      errorTitle: "Valor no válido",
      error: `Selecciona una opción de la lista: ${list.join(", ")}`,
    };
  }
}

function addNumberValidation(sheet, col, startRow, endRow, min, max) {
  const colLetter = sheet.getColumn(col).letter;
  for (let r = startRow; r <= endRow; r++) {
    sheet.getCell(`${colLetter}${r}`).dataValidation = {
      type: "whole",
      operator: "between",
      allowBlank: true,
      formulae: [min, max],
      showErrorMessage: true,
      errorStyle: "warning",
      errorTitle: "Valor fuera de rango",
      error: `Debe ser un número entre ${min} y ${max}`,
    };
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function generate() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Club Lo Prado";
  wb.created = new Date();

  const ws = wb.addWorksheet("Atletas", {
    views: [{ state: "frozen", ySplit: 3 }], // freeze header rows
    pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1 },
  });

  // ── Row 1: Instruction banner ─────────────────────────────────────────────
  ws.mergeCells("A1:T1");
  const instructionCell = ws.getCell("A1");
  instructionCell.value =
    "✦  Plantilla de Importación de Atletas — Club Lo Prado  ✦   " +
    "Completa las filas vacías a partir de la fila 4. No modifiques los encabezados ni la fila de ejemplo.";
  instructionCell.font = {
    name: "Calibri", size: 10, bold: true,
    color: { argb: COLORS.instructionFont },
  };
  instructionCell.fill = {
    type: "pattern", pattern: "solid",
    fgColor: { argb: COLORS.instructionBg },
  };
  instructionCell.alignment = { vertical: "middle", horizontal: "left", wrapText: false };
  ws.getRow(1).height = 22;

  // ── Row 2: Column headers ─────────────────────────────────────────────────
  ws.columns = COLUMNS.map((c) => ({ key: c.key, width: c.width }));

  const headerRow = ws.getRow(2);
  headerRow.height = 28;
  COLUMNS.forEach((col, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = col.header;
    cell.font = headerFont(10);
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.headerBg } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = border();
  });

  // ── Row 3: Example row ────────────────────────────────────────────────────
  const exRow = ws.getRow(3);
  exRow.height = 20;
  COLUMNS.forEach((col, idx) => {
    const cell = exRow.getCell(idx + 1);
    cell.value = EXAMPLE_ROW[col.key] ?? "";
    cell.font = { name: "Calibri", size: 9, italic: true, color: { argb: "5D6D7E" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.exampleBg } };
    cell.alignment = { vertical: "middle", horizontal: "left" };
    cell.border = border();
  });

  // ── Rows 4–103: Data rows ─────────────────────────────────────────────────
  for (let r = 4; r <= 103; r++) {
    const row = ws.getRow(r);
    row.height = 18;
    COLUMNS.forEach((_, idx) => {
      const cell = row.getCell(idx + 1);
      cell.font = { name: "Calibri", size: 10 };
      cell.alignment = { vertical: "middle" };
      cell.border = border();
      if (r % 2 === 0) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.altRow } };
      }
    });
  }

  // ── Data validations ──────────────────────────────────────────────────────
  // Col index (1-based): Genero=7, FechaNac=8, Año=9, Categoria=10, Edad=11, Situacion=12

  addDropdown(ws, 7,  4, 103, GENEROS);
  addDropdown(ws, 10, 4, 103, CATEGORIAS);
  addDropdown(ws, 12, 4, 103, SITUACIONES);
  addNumberValidation(ws, 9,  4, 103, 1900, 2030); // Año
  addNumberValidation(ws, 11, 4, 103, 0, 120);      // Edad

  // Fecha de Nacimiento: text hint (date type validation not universally supported)
  const fechaCol = ws.getColumn(8).letter;
  for (let r = 4; r <= 103; r++) {
    ws.getCell(`${fechaCol}${r}`).dataValidation = {
      type: "textLength",
      operator: "greaterThan",
      allowBlank: true,
      formulae: [0],
      showInputMessage: true,
      promptTitle: "Fecha de Nacimiento",
      prompt: "Formato: DD/MM/YYYY  (ej: 15/03/2010)",
    };
  }

  // RUT: hint
  const rutCol = ws.getColumn(3).letter;
  for (let r = 4; r <= 103; r++) {
    ws.getCell(`${rutCol}${r}`).dataValidation = {
      type: "textLength",
      operator: "greaterThan",
      allowBlank: true,
      formulae: [0],
      showInputMessage: true,
      promptTitle: "RUT",
      prompt: "Formato chileno: 12.345.678-K  (sin espacios)",
    };
  }

  // ── Second sheet: valid values reference ──────────────────────────────────
  const refWs = wb.addWorksheet("Valores Válidos");
  refWs.columns = [
    { header: "Categorías", key: "cat", width: 14 },
    { header: "Géneros",    key: "gen", width: 14 },
    { header: "Situaciones",key: "sit", width: 14 },
  ];

  const refHeader = refWs.getRow(1);
  [1, 2, 3].forEach((c) => {
    refHeader.getCell(c).font = headerFont(10);
    refHeader.getCell(c).fill = {
      type: "pattern", pattern: "solid", fgColor: { argb: COLORS.headerBg },
    };
    refHeader.getCell(c).alignment = { horizontal: "center" };
  });

  CATEGORIAS.forEach((cat, i) => {
    refWs.getRow(i + 2).getCell(1).value = cat;
  });
  GENEROS.forEach((g, i) => {
    refWs.getRow(i + 2).getCell(2).value = g;
  });
  SITUACIONES.forEach((s, i) => {
    refWs.getRow(i + 2).getCell(3).value = s;
  });

  await wb.xlsx.writeFile(OUTPUT_PATH);
  console.log(`✅  Plantilla generada → ${OUTPUT_PATH}`);
}

generate().catch((err) => {
  console.error("❌  Error generando plantilla:", err);
  process.exit(1);
});
