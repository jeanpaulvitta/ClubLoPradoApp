import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── Column reference data ────────────────────────────────────────────────────

interface ColumnInfo {
  nombre: string;
  tipo: string;
  obligatoria: string;
  ejemplos: string;
  notas: string;
}

const COLUMNS: ColumnInfo[] = [
  {
    nombre: "Nombre corto",
    tipo: "Texto",
    obligatoria: "No",
    ejemplos: "GARCIA J, ROJAS M",
    notas: "Abreviatura del atleta. Máx. 10 caracteres. Útil para listas y dorsales.",
  },
  {
    nombre: "CARACTERISTICA",
    tipo: "Texto",
    obligatoria: "No",
    ejemplos: "Velocista, Fondista, Espalda",
    notas: "Especialidad o característica técnica del nadador según criterio del entrenador.",
  },
  {
    nombre: "Rut",
    tipo: "Texto",
    obligatoria: "No",
    ejemplos: "15.234.567-8, 7.890.123-K",
    notas:
      "Formato chileno con puntos y guión. Se usa para detectar duplicados en la importación. Sin espacios.",
  },
  {
    nombre: "Apellido P",
    tipo: "Texto",
    obligatoria: "Sí",
    ejemplos: "García, Martínez, Rojas",
    notas: "Primer apellido. Al menos Nombre o Apellido P son requeridos para crear el registro.",
  },
  {
    nombre: "Apellido M",
    tipo: "Texto",
    obligatoria: "No",
    ejemplos: "López, Fuentes",
    notas: "Segundo apellido (materno). Se puede dejar vacío.",
  },
  {
    nombre: "Nombre",
    tipo: "Texto",
    obligatoria: "Sí",
    ejemplos: "Juan, Sofía, Diego",
    notas: "Nombre(s) de pila del atleta.",
  },
  {
    nombre: "Genero",
    tipo: "Lista",
    obligatoria: "No",
    ejemplos: "Masculino, Femenino, Otro",
    notas: "Seleccionar de la lista desplegable. Si se deja vacío se asignará 'Otro'.",
  },
  {
    nombre: "Fecha de Nacimiento",
    tipo: "Fecha",
    obligatoria: "Sí",
    ejemplos: "15/03/2010, 01/12/2008",
    notas:
      "Formato DD/MM/YYYY. Es el campo clave para calcular la categoría automáticamente. No usar otros formatos.",
  },
  {
    nombre: "Año",
    tipo: "Número entero",
    obligatoria: "No",
    ejemplos: "2010, 2008, 2015",
    notas:
      "Año de nacimiento. Puede dejarse vacío; se extrae de Fecha de Nacimiento. Si se completa debe coincidir.",
  },
  {
    nombre: "Categoria",
    tipo: "Lista",
    obligatoria: "No",
    ejemplos: "INF E, JUV BI, MAYORES",
    notas:
      "La app calcula la categoría desde la fecha de nacimiento. Este campo es de referencia; " +
      "si difiere de la calculada se mostrará una advertencia pero no bloqueará la importación.",
  },
  {
    nombre: "Edad",
    tipo: "Número entero",
    obligatoria: "No",
    ejemplos: "8, 12, 16, 25",
    notas: "Edad actual en años. Campo informativo; la app la recalcula automáticamente.",
  },
  {
    nombre: "Situación",
    tipo: "Lista",
    obligatoria: "No",
    ejemplos: "Activo, Inactivo, Suspendido",
    notas: "Estado del atleta en el club. Seleccionar de la lista desplegable.",
  },
  {
    nombre: "Colegio",
    tipo: "Texto",
    obligatoria: "No",
    ejemplos: "Liceo Politécnico, Colegio San José",
    notas: "Establecimiento educacional donde estudia el atleta.",
  },
  {
    nombre: "Nacionalidad",
    tipo: "Texto",
    obligatoria: "No",
    ejemplos: "Chilena, Peruana, Venezolana",
    notas: "Nacionalidad del atleta.",
  },
  {
    nombre: "Comuna",
    tipo: "Texto",
    obligatoria: "No",
    ejemplos: "Lo Prado, Pudahuel, Santiago",
    notas: "Comuna de residencia.",
  },
  {
    nombre: "Direccion Particular",
    tipo: "Texto",
    obligatoria: "No",
    ejemplos: "Av. Las Flores 123, Dpto 4B",
    notas: "Dirección completa de residencia.",
  },
  {
    nombre: "Fono deportista",
    tipo: "Texto",
    obligatoria: "No",
    ejemplos: "+56 9 1234 5678",
    notas: "Teléfono de contacto del atleta. Incluir código de país (+56 para Chile).",
  },
  {
    nombre: "Nombre apoderado",
    tipo: "Texto",
    obligatoria: "No",
    ejemplos: "María García Rojas",
    notas: "Nombre completo del padre/madre o tutor legal.",
  },
  {
    nombre: "Fono Apoderado",
    tipo: "Texto",
    obligatoria: "No",
    ejemplos: "+56 9 8765 4321",
    notas: "Teléfono de contacto del apoderado. Incluir código de país.",
  },
  {
    nombre: "Email tutor",
    tipo: "Correo electrónico",
    obligatoria: "No",
    ejemplos: "m.garcia@email.com",
    notas:
      "Correo del apoderado o tutor. Si no se proporciona, el sistema asigna un email interno temporal.",
  },
];

// ─── Error reference table ────────────────────────────────────────────────────

const ERRORES = [
  {
    error: "Nombre vacío",
    causa: "No se completó Nombre ni Apellido P",
    solucion: "Completar al menos uno de los dos campos de nombre",
  },
  {
    error: "Fecha de nacimiento inválida",
    causa: "Formato incorrecto o fecha fuera de rango",
    solucion: "Usar DD/MM/YYYY (ej: 15/03/2010). No usar guiones ni formatos distintos",
  },
  {
    error: "Fila marcada como duplicada",
    causa: "El RUT ya existe en el sistema",
    solucion: "Verificar si el atleta ya está registrado. Las filas duplicadas se omiten automáticamente",
  },
  {
    error: "Categoría no coincide",
    causa: "La columna Categoria difiere de la calculada por fecha de nacimiento",
    solucion:
      "Advertencia no bloqueante. Revisar si la fecha de nacimiento es correcta. La app usa la fecha, no la columna",
  },
  {
    error: "RUT con formato incorrecto",
    causa: "Se incluyeron espacios o el guión falta",
    solucion: "Usar formato 12.345.678-9 sin espacios. El dígito verificador puede ser número o K",
  },
  {
    error: "Archivo no reconocido",
    causa: "Se cargó un formato distinto a .xlsx, .xls o .csv",
    solucion: "Guardar el archivo como Excel (.xlsx) antes de importar",
  },
];

// ─── Categories reference ─────────────────────────────────────────────────────

const CATEGORIAS = [
  { cat: "INF E",    grupo: "1 — Menores", nacimiento: "2018 o posterior" },
  { cat: "INF D",    grupo: "1 — Menores", nacimiento: "2017" },
  { cat: "INF C",    grupo: "1 — Menores", nacimiento: "2016" },
  { cat: "INF A",    grupo: "1 — Menores", nacimiento: "2015" },
  { cat: "INF BI",   grupo: "2 — Mayores", nacimiento: "2014" },
  { cat: "INF BII",  grupo: "2 — Mayores", nacimiento: "2013" },
  { cat: "JUV AI",   grupo: "2 — Mayores", nacimiento: "2012" },
  { cat: "JUV AII",  grupo: "2 — Mayores", nacimiento: "2011" },
  { cat: "JUV BI",   grupo: "2 — Mayores", nacimiento: "2010" },
  { cat: "JUV BII",  grupo: "2 — Mayores", nacimiento: "2009" },
  { cat: "JUV BIII", grupo: "2 — Mayores", nacimiento: "2008" },
  { cat: "MAYORES",  grupo: "2 — Mayores", nacimiento: "2007 o anterior" },
];

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateGuiaPDF() {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const PAGE_W = 210;
  const MARGIN = 14;
  const CONTENT_W = PAGE_W - MARGIN * 2;

  const NAVY = [26, 82, 118] as [number, number, number];
  const LIGHT_BLUE = [214, 234, 248] as [number, number, number];
  const WHITE = [255, 255, 255] as [number, number, number];
  const GRAY = [149, 165, 166] as [number, number, number];
  const LIGHT_GRAY = [248, 249, 250] as [number, number, number];
  const DARK = [44, 62, 80] as [number, number, number];

  let y = MARGIN;

  // ── Cover header ────────────────────────────────────────────────────────────
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, PAGE_W, 38, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...WHITE);
  doc.text("Guía de Referencia — Importación de Atletas", MARGIN, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Club Lo Prado  ·  Módulo de carga masiva de nadadores", MARGIN, 27);
  doc.text(`Versión 1.0  ·  ${new Date().toLocaleDateString("es-CL")}`, MARGIN, 34);

  y = 46;

  // ── Section 1: Intro ────────────────────────────────────────────────────────
  doc.setFillColor(...LIGHT_BLUE);
  doc.rect(MARGIN, y, CONTENT_W, 18, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  doc.text("¿Cómo usar esta guía?", MARGIN + 3, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...DARK);
  doc.text(
    "Descarga la plantilla Plantilla_Atletas.xlsx desde la app y completa los datos de cada atleta.\n" +
    "Consulta la tabla de columnas a continuación para entender qué va en cada campo.\n" +
    "Una vez completa, sube el archivo desde Nadadores → Importar Excel.",
    MARGIN + 3,
    y + 12
  );
  y += 24;

  // ── Section 2: Column reference table ──────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...NAVY);
  doc.text("1. Referencia de columnas", MARGIN, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [["Columna", "Tipo", "Req.", "Ejemplos válidos", "Notas"]],
    body: COLUMNS.map((c) => [c.nombre, c.tipo, c.obligatoria, c.ejemplos, c.notas]),
    styles: {
      font: "helvetica",
      fontSize: 7.5,
      cellPadding: 2.5,
      valign: "top",
      textColor: DARK,
      lineColor: [174, 214, 241],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: NAVY,
      textColor: WHITE,
      fontStyle: "bold",
      fontSize: 8,
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 30, fontStyle: "bold" },
      1: { cellWidth: 22, halign: "center" },
      2: { cellWidth: 10, halign: "center" },
      3: { cellWidth: 36 },
      4: { cellWidth: "auto" },
    },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 2) {
        data.cell.styles.textColor = data.cell.raw === "Sí"
          ? [39, 174, 96]
          : [149, 165, 166];
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  // ── Section 3: Category table (new page) ────────────────────────────────────
  doc.addPage();
  y = MARGIN;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...NAVY);
  doc.text("2. Categorías válidas y años de nacimiento", MARGIN, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [["Categoría Excel", "Grupo de entrenamiento", "Año de nacimiento"]],
    body: CATEGORIAS.map((c) => [c.cat, c.grupo, c.nacimiento]),
    styles: { font: "helvetica", fontSize: 9, cellPadding: 2.5, textColor: DARK },
    headStyles: { fillColor: NAVY, textColor: WHITE, fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: "bold", halign: "center" },
      1: { cellWidth: 60 },
      2: { cellWidth: "auto" },
    },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    didParseCell: (data) => {
      if (data.section === "body") {
        const grupo = String(data.row.cells[1]?.raw ?? "");
        if (data.column.index === 1) {
          data.cell.styles.textColor = grupo.includes("1")
            ? [108, 52, 131]   // purple for Grupo 1
            : [39, 174, 96];   // green for Grupo 2
        }
      }
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // ── Section 4: Error common table ─────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...NAVY);
  doc.text("3. Errores comunes y cómo resolverlos", MARGIN, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [["Error mostrado", "Causa probable", "Cómo resolverlo"]],
    body: ERRORES.map((e) => [e.error, e.causa, e.solucion]),
    styles: { font: "helvetica", fontSize: 8.5, cellPadding: 2.5, textColor: DARK },
    headStyles: { fillColor: [192, 57, 43], textColor: WHITE, fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 42, fontStyle: "bold" },
      1: { cellWidth: 52 },
      2: { cellWidth: "auto" },
    },
    alternateRowStyles: { fillColor: [253, 237, 236] },
  });

  y = (doc as any).lastAutoTable.finalY + 12;

  // ── Section 5: Complete example row ───────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...NAVY);
  doc.text("4. Ejemplo de fila completamente llena", MARGIN, y);
  y += 5;

  const exampleFields = [
    ["Nombre corto", "GARCIA J"],
    ["CARACTERISTICA", "Velocista"],
    ["Rut", "15.234.567-8"],
    ["Apellido P", "García"],
    ["Apellido M", "López"],
    ["Nombre", "Juan"],
    ["Genero", "Masculino"],
    ["Fecha de Nacimiento", "15/03/2010"],
    ["Año", "2010"],
    ["Categoria", "JUV BI"],
    ["Edad", "15"],
    ["Situación", "Activo"],
    ["Colegio", "Liceo Politécnico de Santiago"],
    ["Nacionalidad", "Chilena"],
    ["Comuna", "Santiago"],
    ["Direccion Particular", "Av. Las Flores 123, Dpto 4B"],
    ["Fono deportista", "+56 9 1234 5678"],
    ["Nombre apoderado", "María García Rojas"],
    ["Fono Apoderado", "+56 9 8765 4321"],
    ["Email tutor", "m.garcia@email.com"],
  ];

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [["Campo", "Valor de ejemplo"]],
    body: exampleFields,
    styles: { font: "helvetica", fontSize: 9, cellPadding: 2.5, textColor: DARK },
    headStyles: { fillColor: NAVY, textColor: WHITE, fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 52, fontStyle: "bold" },
      1: { cellWidth: "auto" },
    },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
  });

  y = (doc as any).lastAutoTable.finalY + 12;

  // ── Section 6: Process notes ───────────────────────────────────────────────
  if (y > 240) {
    doc.addPage();
    y = MARGIN;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...NAVY);
  doc.text("5. Proceso de importación paso a paso", MARGIN, y);
  y += 7;

  const steps = [
    ["1", "Descarga", "Descarga la plantilla Plantilla_Atletas.xlsx desde el botón en el módulo de importación."],
    ["2", "Completa", "Rellena las filas desde la fila 4 en adelante. No modifiques encabezados ni la fila de ejemplo."],
    ["3", "Valida", "Usa las listas desplegables para Género, Categoría y Situación. Respeta el formato DD/MM/YYYY en fechas."],
    ["4", "Sube", "Ve a Nadadores → Importar Excel, arrastra el archivo o selecciónalo. La app muestra una vista previa."],
    ["5", "Revisa", "En la vista previa verás filas ✓ OK, ⚠ con advertencias y ✗ con errores. Los errores deben corregirse antes de subir."],
    ["6", "Importa", "Haz clic en 'Importar N nadadores'. Una barra de progreso muestra el avance fila por fila."],
    ["7", "Confirma", "Al terminar, verás el resumen: cuántos se importaron, cuántos se omitieron y cuántos fallaron."],
  ];

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    body: steps.map(([num, title, desc]) => [`${num}. ${title}`, desc]),
    styles: { font: "helvetica", fontSize: 9, cellPadding: 3, textColor: DARK },
    columnStyles: {
      0: { cellWidth: 28, fontStyle: "bold", fillColor: LIGHT_BLUE, textColor: NAVY },
      1: { cellWidth: "auto" },
    },
  });

  // ── Footer on all pages ────────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...GRAY);
    doc.text(
      `Club Lo Prado — Guía de Importación de Atletas   ·   Pág. ${p} / ${totalPages}`,
      PAGE_W / 2,
      294,
      { align: "center" }
    );
    doc.setDrawColor(...GRAY);
    doc.line(MARGIN, 290, PAGE_W - MARGIN, 290);
  }

  doc.save("Guia_Columnas_Atletas.pdf");
}
