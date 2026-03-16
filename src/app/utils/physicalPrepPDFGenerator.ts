import jsPDF from "jspdf";

interface WeeklySession {
  name: string;
  exercises: string[];
}

interface BlockExercise {
  groupName: string;
  ageRange: string;
  sessionsPerWeek: number;
  focus: string;
  objectives: string[];
  benefit: string;
  sessions: WeeklySession[];
}

interface TrainingBlock {
  number: number;
  name: string;
  color: string;
  group1: BlockExercise;
  group2: BlockExercise;
}

interface Swimmer {
  id: string;
  name: string;
  group?: number | string;
}

interface TestControl {
  id: string;
  name: string;
  date: string;
  description?: string;
  mesociclo?: string;
}

interface TestResult {
  id: string;
  testId: string;
  swimmerId: string;
  testItemId: string;
  time: string;
  date: string;
}

export function generatePhysicalPrepPDF(
  blocks: TrainingBlock[],
  selectedGroup: "group1" | "group2",
  selectedBlock?: number,
  testControls?: TestControl[],
  testResults?: TestResult[],
  swimmers?: Swimmer[]
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPos = margin;

  // Función para agregar nueva página si es necesario
  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // Título principal
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Club Natación Lo Prado", pageWidth / 2, yPos, { align: "center" });
  yPos += 10;

  doc.setFontSize(14);
  doc.text("Preparación Física - Temporada 2026-2027", pageWidth / 2, yPos, { align: "center" });
  yPos += 8;

  // Información del filtro
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const groupText = selectedGroup === "group1" 
    ? "Grupo 1 - Menores (7-10 años)" 
    : "Grupo 2 - Mayores (11-17 años)";
  doc.text(`Grupo: ${groupText}`, margin, yPos);
  yPos += 6;

  if (selectedBlock) {
    const block = blocks.find(b => b.number === selectedBlock);
    if (block) {
      doc.text(`Bloque: ${block.number} - ${block.name}`, margin, yPos);
      yPos += 6;
    }
  } else {
    doc.text("Todos los bloques incluidos", margin, yPos);
    yPos += 6;
  }

  doc.text(`Fecha de generación: ${new Date().toLocaleDateString("es-CL")}`, margin, yPos);
  yPos += 12;

  // Filtrar bloques
  const filteredBlocks = selectedBlock 
    ? blocks.filter(b => b.number === selectedBlock)
    : blocks;

  // Generar contenido para cada bloque
  filteredBlocks.forEach((block, blockIndex) => {
    const blockData = selectedGroup === "group1" ? block.group1 : block.group2;

    // Verificar espacio para el título del bloque
    checkPageBreak(25);

    // Título del bloque
    doc.setFillColor(34, 197, 94); // Verde
    doc.rect(margin, yPos, pageWidth - 2 * margin, 8, "F");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(`Bloque ${block.number}: ${block.name}`, margin + 2, yPos + 5.5);
    doc.setTextColor(0, 0, 0);
    yPos += 12;

    // Información del bloque
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    doc.text(`• Edad: ${blockData.ageRange}`, margin + 2, yPos);
    yPos += 5;
    
    doc.text(`• Sesiones por semana: ${blockData.sessionsPerWeek}`, margin + 2, yPos);
    yPos += 5;
    
    doc.text(`• Enfoque: ${blockData.focus}`, margin + 2, yPos);
    yPos += 5;
    
    doc.text(`• Beneficio: ${blockData.benefit}`, margin + 2, yPos);
    yPos += 8;

    // Objetivos
    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.text("Objetivos:", margin + 2, yPos);
    yPos += 5;
    
    doc.setFont("helvetica", "normal");
    blockData.objectives.forEach((obj) => {
      checkPageBreak(6);
      doc.text(`  - ${obj}`, margin + 4, yPos);
      yPos += 5;
    });
    yPos += 3;

    // Sesiones
    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.text("Sesiones de Entrenamiento:", margin + 2, yPos);
    yPos += 6;

    blockData.sessions.forEach((session) => {
      checkPageBreak(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(session.name, margin + 4, yPos);
      yPos += 5;

      doc.setFont("helvetica", "normal");
      session.exercises.forEach((exercise) => {
        checkPageBreak(5);
        doc.text(`  • ${exercise}`, margin + 6, yPos);
        yPos += 4.5;
      });
      yPos += 3;
    });

    // Test Controls relacionados (si existen)
    if (testControls && testControls.length > 0) {
      const blockTestControls = testControls.filter(tc => 
        tc.mesociclo === `Bloque ${block.number}`
      );

      if (blockTestControls.length > 0) {
        checkPageBreak(25);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Test de Control Asociados:", margin + 2, yPos);
        yPos += 6;

        blockTestControls.forEach((tc) => {
          checkPageBreak(10);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.text(`• ${tc.name} - ${new Date(tc.date).toLocaleDateString("es-CL")}`, margin + 4, yPos);
          yPos += 5;
        });
        yPos += 3;
      }
    }

    // Separador entre bloques
    if (blockIndex < filteredBlocks.length - 1) {
      yPos += 5;
      checkPageBreak(2);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;
    }
  });

  // Estadísticas de nadadores por grupo (si están disponibles)
  if (swimmers && swimmers.length > 0) {
    const groupSwimmers = swimmers.filter(s => {
      const swimmerGroup = String(s.group);
      const targetGroup = selectedGroup === "group1" ? "1" : "2";
      return swimmerGroup === targetGroup;
    });

    if (groupSwimmers.length > 0) {
      checkPageBreak(30);
      yPos += 10;
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Nadadores en este Grupo", margin, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Total: ${groupSwimmers.length} nadadores`, margin, yPos);
      yPos += 8;

      // Lista de nadadores en columnas
      const columnWidth = (pageWidth - 2 * margin) / 2;
      let col = 0;
      let colYPos = yPos;

      groupSwimmers.forEach((swimmer, idx) => {
        if (colYPos + 5 > pageHeight - margin) {
          doc.addPage();
          colYPos = margin;
          col = 0;
        }

        const xPos = margin + (col * columnWidth);
        doc.text(`${idx + 1}. ${swimmer.name}`, xPos, colYPos);
        
        colYPos += 5;
        
        // Cambiar de columna
        if (col === 0 && colYPos > pageHeight / 2) {
          col = 1;
          colYPos = yPos;
        } else if (col === 1) {
          col = 0;
        }
      });
    }
  }

  // Pie de página en la última página
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    doc.text(
      "Club Natación Lo Prado - Preparación Física 2026-2027",
      pageWidth / 2,
      pageHeight - 5,
      { align: "center" }
    );
  }

  // Generar nombre del archivo
  const groupName = selectedGroup === "group1" ? "Grupo1" : "Grupo2";
  const blockName = selectedBlock ? `_Bloque${selectedBlock}` : "_TodosBloques";
  const fileName = `PrepFisica_${groupName}${blockName}_${new Date().toISOString().split('T')[0]}.pdf`;

  // Descargar PDF
  doc.save(fileName);
}
