import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Competition } from "../data/swimmers";

interface BloqueInfo {
  num: number;
  weeks: number;
  name: string;
  competition: string;
  date: string;
}

const bloques: BloqueInfo[] = [
  { num: 1, weeks: 6, name: "Velocidad Inicial", competition: "Copa Chile 1 - 50m", date: "21-22 Mar 2026" },
  { num: 2, weeks: 4, name: "Fondo", competition: "Copa Chile 2 - 800-1500m", date: "17-19 Abr 2026" },
  { num: 3, weeks: 4, name: "Medio Fondo", competition: "Copa Chile 3 - 100-400m", date: "15-17 May 2026" },
  { num: 4, weeks: 6, name: "Competitivo Mayor", competition: "Nacionales (Jun-Jul)", date: "6 Jun - 5 Jul 2026" },
  { num: 5, weeks: 6, name: "Internacional", competition: "Brasil + Nacional Des.", date: "20 Jul - 16 Ago 2026" },
  { num: 6, weeks: 4, name: "Velocidad 2", competition: "Copa Chile 1", date: "12-13 Sep 2026" },
  { num: 7, weeks: 4, name: "Fondo 2", competition: "Copa Chile 2", date: "2-4 Oct 2026" },
  { num: 8, weeks: 5, name: "Medio Fondo 2", competition: "Copa Chile 3", date: "6-8 Nov 2026" },
  { num: 9, weeks: 9, name: "Preparación", competition: "Preparación Nacionales", date: "Nov-Dic 2026" },
  { num: 10, weeks: 4, name: "Pico Competitivo", competition: "Nacionales Verano 2027", date: "9 Ene - 7 Feb 2027" }
];

export function generateCalendarPDF(
  competitions: Competition[] = [],
  selectedGroup: "group1" | "group2" = "group1"
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  let yPosition = 20;

  // Título principal
  doc.setFontSize(20);
  doc.setTextColor(220, 38, 38); // Red-600
  doc.text("Club Natacion Lo Prado", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 10;

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Calendario Temporada 2026-2027", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 8;

  // Subtítulo sin grupo específico (ya que muestra ambos grupos)
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text("Todos los Grupos", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 5;

  doc.setFontSize(10);
  doc.text("9 Febrero 2026 - 7 Febrero 2027", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 12;

  // Línea separadora
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 10;

  // Sección 1: Bloques de Entrenamiento
  doc.setFontSize(14);
  doc.setTextColor(220, 38, 38);
  doc.text("Bloques de Entrenamiento", 20, yPosition);
  yPosition += 8;

  // Tabla de bloques
  const bloquesData = bloques.map((bloque) => [
    `Bloque ${bloque.num}`,
    bloque.name,
    `${bloque.weeks} semanas`,
    bloque.date,
    bloque.competition
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [["Bloque", "Nombre", "Duracion", "Fechas", "Competencia Asociada"]],
    body: bloquesData,
    theme: "grid",
    headStyles: {
      fillColor: [220, 38, 38],
      textColor: 255,
      fontSize: 9,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [50, 50, 50],
    },
    alternateRowStyles: {
      fillColor: [252, 231, 231], // Red-50
    },
    columnStyles: {
      0: { cellWidth: 20, fontStyle: "bold" },
      1: { cellWidth: 35 },
      2: { cellWidth: 25, halign: "center" },
      3: { cellWidth: 35, halign: "center" },
      4: { cellWidth: 'auto' },
    },
    margin: { left: 20, right: 20 },
  });

  // @ts-ignore
  yPosition = doc.lastAutoTable.finalY + 12;

  // Verificar si necesitamos una nueva página
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 20;
  }

  // Sección 2: Competencias Programadas
  doc.setFontSize(14);
  doc.setTextColor(220, 38, 38);
  doc.text("Competencias Programadas", 20, yPosition);
  yPosition += 8;

  if (competitions.length > 0) {
    // Ordenar competencias por fecha
    const sortedCompetitions = [...competitions].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    const competitionsData = sortedCompetitions.map((comp) => {
      const startDate = new Date(comp.startDate);
      const endDate = new Date(comp.endDate);
      const dateRange = startDate.toLocaleDateString("es-ES", { 
        day: "2-digit", 
        month: "short", 
        year: "numeric" 
      }) + (startDate.getTime() !== endDate.getTime() 
        ? " - " + endDate.toLocaleDateString("es-ES", { 
            day: "2-digit", 
            month: "short", 
            year: "numeric" 
          })
        : "");

      // Obtener categorías resumidas
      let categoriesText = "Todas";
      if (comp.categories && comp.categories.length > 0) {
        if (comp.categories.length === 1) {
          categoriesText = comp.categories[0];
        } else {
          // Mostrar rango: primera - última
          categoriesText = `${comp.categories[0]} - ${comp.categories[comp.categories.length - 1]}`;
        }
      }

      return [
        comp.name,
        dateRange,
        comp.location || "-",
        comp.poolType || "-",
        comp.cost || "-",
        categoriesText
      ];
    });

    autoTable(doc, {
      startY: yPosition,
      head: [["Competencia", "Fechas", "Lugar", "Piscina", "Inscripcion", "Categorias"]],
      body: competitionsData,
      theme: "grid",
      headStyles: {
        fillColor: [234, 179, 8], // Yellow-600
        textColor: 255,
        fontSize: 9,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [50, 50, 50],
      },
      alternateRowStyles: {
        fillColor: [254, 252, 232], // Yellow-50
      },
      columnStyles: {
        0: { cellWidth: 48, fontStyle: "bold" },
        1: { cellWidth: 35, halign: "center" },
        2: { cellWidth: 30 },
        3: { cellWidth: 16, halign: "center" },
        4: { cellWidth: 20, halign: "center" },
        5: { cellWidth: 30, halign: "center" },
      },
      margin: { left: 20, right: 20 },
    });

    // @ts-ignore
    yPosition = doc.lastAutoTable.finalY + 12;
  } else {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("No hay competencias programadas en el sistema.", 20, yPosition);
    yPosition += 12;
  }

  // Verificar si necesitamos una nueva página para el resumen
  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = 20;
  }

  // Sección 3: Resumen de Temporada
  doc.setFontSize(14);
  doc.setTextColor(220, 38, 38);
  doc.text("Resumen de Temporada", 20, yPosition);
  yPosition += 8;

  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);

  const totalWeeks = bloques.reduce((sum, b) => sum + b.weeks, 0);
  
  const summaryLines = [
    `• Total de bloques: 10`,
    `• Total de semanas: ${totalWeeks}`,
    `• Competencias principales: ${bloques.filter(b => b.competition).length}`,
    `• Competencias registradas en el sistema: ${competitions.length}`,
    `• Periodo: 9 Febrero 2026 - 7 Febrero 2027`,
    "",
    "Enfoque Grupo 1 (Menores):",
    "• Desarrollo tecnico en los 4 estilos",
    "• Construccion de capacidad aerobica",
    "• Experiencia competitiva en diferentes distancias",
    "• Preparacion para Festival de Menores y Nacional Infantil",
    "",
    "Enfoque Grupo 2 (Mayores):",
    "• Desarrollo avanzado de capacidad aerobica y potencia",
    "• Mayor enfasis en velocidad e intensidad",
    "• Preparacion para competencias internacionales",
    "• Tapering estrategico en bloques competitivos"
  ];

  summaryLines.forEach((line) => {
    if (yPosition > pageHeight - 15) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(line, 20, yPosition);
    yPosition += line === "" ? 3 : 5;
  });

  // Footer
  const totalPages = doc.internal.pages.length - 1; // -1 porque pages incluye una página vacía al inicio
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Pagina ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    doc.text(
      `Generado el ${new Date().toLocaleDateString("es-ES", { 
        day: "2-digit", 
        month: "long", 
        year: "numeric" 
      })}`,
      pageWidth - 20,
      pageHeight - 10,
      { align: "right" }
    );
  }

  // Guardar el PDF
  const fileName = `Calendario_Temporada_2026-2027_Todos_los_Grupos.pdf`;
  doc.save(fileName);
}

// Función para generar PDF solo con los bloques (versión simplificada)
export function generateBloquesOnlyPDF(selectedGroup: "group1" | "group2" = "group1"): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  let yPosition = 20;

  // Título principal
  doc.setFontSize(20);
  doc.setTextColor(220, 38, 38);
  doc.text("Club Natacion Lo Prado", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 10;

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Bloques de Entrenamiento 2026-2027", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 8;

  const groupName = selectedGroup === "group1" ? "Grupo 1 (Menores)" : "Grupo 2 (Mayores)";
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(groupName, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 12;

  // Línea separadora
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 10;

  // Tabla de bloques detallada
  const bloquesData = bloques.map((bloque) => [
    `Bloque ${bloque.num}`,
    bloque.name,
    `${bloque.weeks} semanas`,
    bloque.date,
    bloque.competition
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [["#", "Bloque", "Duracion", "Fechas", "Competencia"]],
    body: bloquesData,
    theme: "striped",
    headStyles: {
      fillColor: [220, 38, 38],
      textColor: 255,
      fontSize: 10,
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [50, 50, 50],
    },
    alternateRowStyles: {
      fillColor: [252, 231, 231],
    },
    columnStyles: {
      0: { cellWidth: 20, halign: "center", fontStyle: "bold" },
      1: { cellWidth: 40 },
      2: { cellWidth: 25, halign: "center" },
      3: { cellWidth: 40, halign: "center" },
      4: { cellWidth: 'auto' },
    },
    margin: { left: 20, right: 20 },
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Generado el ${new Date().toLocaleDateString("es-ES", { 
      day: "2-digit", 
      month: "long", 
      year: "numeric" 
    })}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  // Guardar el PDF
  const fileName = `Bloques_Entrenamiento_${groupName.replace(/\s+/g, "_")}.pdf`;
  doc.save(fileName);
}