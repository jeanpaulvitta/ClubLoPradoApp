import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

type TrainingSession = {
  type: 'workout' | 'challenge';
  mesociclo?: string;
  bloque?: string;
  week: number;
  date: string;
  day: string;
  distance: number;
  warmup?: string;
  mainSet?: string[] | string;
  cooldown?: string;
  intensity?: string;
  focus?: string;
  description?: string;
};

// Generar PDF completo de Estadísticas de Entrenamiento con gráficos
export function generateTrainingStatsPDF(sessions: TrainingSession[]): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Título principal
  doc.setFontSize(22);
  doc.setTextColor(239, 68, 68); // Rojo de Lo Prado
  doc.text('Estadísticas de Entrenamiento', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // Subtítulo
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text('Club Natación Lo Prado', pageWidth / 2, yPos, { align: 'center' });
  yPos += 6;
  
  doc.setFontSize(11);
  doc.text('Haz que todo sea posible', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // ========== RESUMEN GENERAL ==========
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('📊 Resumen General', 14, yPos);
  yPos += 10;

  const totalDistance = sessions.reduce((sum, s) => sum + s.distance, 0);
  const totalWorkouts = sessions.filter(s => s.type === 'workout').length;

  // Calcular técnica
  let techniqueVolume = 0;
  let techniqueCount = 0;
  sessions.forEach(session => {
    const warmup = session.warmup?.toLowerCase() || '';
    const mainSet = Array.isArray(session.mainSet) ? session.mainSet.join(' ').toLowerCase() : (session.mainSet?.toLowerCase() || '');
    const cooldown = session.cooldown?.toLowerCase() || '';
    const focus = session.focus?.toLowerCase() || '';
    const description = session.description?.toLowerCase() || '';
    const combinedText = `${warmup} ${mainSet} ${cooldown} ${focus} ${description}`;
    const hasTechnique = ['técnica', 'tecnica', 'drill', 'drills'].some(kw => combinedText.includes(kw));
    if (hasTechnique) {
      techniqueVolume += Math.round(session.distance * 0.35);
      techniqueCount++;
    }
  });

  const generalStats = [
    ['Volumen Total', `${(totalDistance / 1000).toFixed(1)} km`],
    ['Total Entrenamientos', totalWorkouts.toString()],
    ['Volumen Técnica', `${(techniqueVolume / 1000).toFixed(1)} km (${totalDistance > 0 ? Math.round((techniqueVolume / totalDistance) * 100) : 0}%)`],
    ['Promedio/Sesión', `${totalWorkouts > 0 ? Math.round(totalDistance / totalWorkouts) : 0} m`],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: generalStats,
    theme: 'grid',
    styles: { fontSize: 11, cellPadding: 4 },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: [254, 242, 242], cellWidth: 70 },
      1: { cellWidth: 110, fontSize: 12, fontStyle: 'bold', textColor: [239, 68, 68] }
    },
    margin: { left: 14, right: 14 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // ========== DISTRIBUCIÓN POR INTENSIDAD ==========
  if (yPos > 200) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('🥧 Distribución por Intensidad', 14, yPos);
  yPos += 10;

  const intensityVolumes: { [key: string]: number } = {
    'Baja': 0,
    'Media': 0,
    'Alta': 0,
    'Muy alta': 0
  };

  sessions.forEach(session => {
    const intensity = session.intensity || 'Media';
    if (intensityVolumes[intensity] !== undefined) {
      intensityVolumes[intensity] += session.distance;
    }
  });

  const intensityData = Object.entries(intensityVolumes)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => {
      const percentage = totalDistance > 0 ? Math.round((value / totalDistance) * 100) : 0;
      return [
        name,
        `${(value / 1000).toFixed(1)} km`,
        `${percentage}%`,
        '█'.repeat(Math.round(percentage / 5)) // Barra visual
      ];
    });

  autoTable(doc, {
    startY: yPos,
    head: [['Intensidad', 'Volumen', '% Total', 'Distribución Visual']],
    body: intensityData,
    theme: 'striped',
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [239, 68, 68], textColor: 255, fontSize: 11 },
    columnStyles: {
      0: { cellWidth: 35, fontStyle: 'bold' },
      1: { cellWidth: 30 },
      2: { cellWidth: 25 },
      3: { cellWidth: 80, textColor: [59, 130, 246] }
    },
    margin: { left: 14, right: 14 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // ========== TÉCNICA POR ESTILO ==========
  if (yPos > 200) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('📊 Técnica por Estilo', 14, yPos);
  yPos += 10;

  const techniqueByStyle: { [key: string]: number } = {
    'Crol': 0,
    'Espalda': 0,
    'Pecho': 0,
    'Mariposa': 0
  };

  sessions.forEach(session => {
    const warmup = session.warmup?.toLowerCase() || '';
    const mainSet = Array.isArray(session.mainSet) ? session.mainSet.join(' ').toLowerCase() : (session.mainSet?.toLowerCase() || '');
    const cooldown = session.cooldown?.toLowerCase() || '';
    const focus = session.focus?.toLowerCase() || '';
    const description = session.description?.toLowerCase() || '';
    const combinedText = `${warmup} ${mainSet} ${cooldown} ${focus} ${description}`;
    const hasTechnique = ['técnica', 'tecnica', 'drill', 'drills'].some(kw => combinedText.includes(kw));
    
    if (hasTechnique) {
      const sessionTechniqueVolume = Math.round(session.distance * 0.35);
      
      const styleKeywords = {
        'Crol': ['crol', 'crawl', 'libre', 'free', 'freestyle'],
        'Espalda': ['espalda', 'back', 'backstroke', 'dorso'],
        'Pecho': ['pecho', 'breast', 'breaststroke', 'braza'],
        'Mariposa': ['mariposa', 'butterfly', 'fly', 'delfín', 'delfin']
      };

      let styleDetected = false;
      Object.entries(styleKeywords).forEach(([style, keywords]) => {
        if (keywords.some(kw => combinedText.includes(kw))) {
          techniqueByStyle[style] += sessionTechniqueVolume;
          styleDetected = true;
        }
      });

      if (!styleDetected) {
        const volumePerStyle = Math.round(sessionTechniqueVolume / 4);
        Object.keys(techniqueByStyle).forEach(style => {
          techniqueByStyle[style] += volumePerStyle;
        });
      }
    }
  });

  const techniqueStyleData = Object.entries(techniqueByStyle)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => {
      const percentage = techniqueVolume > 0 ? Math.round((value / techniqueVolume) * 100) : 0;
      return [
        name,
        `${(value / 1000).toFixed(1)} km`,
        `${percentage}%`,
        '▓'.repeat(Math.round(percentage / 5)) // Barra visual
      ];
    });

  if (techniqueStyleData.length > 0) {
    autoTable(doc, {
      startY: yPos,
      head: [['Estilo', 'Volumen', '% del Total Técnica', 'Distribución Visual']],
      body: techniqueStyleData,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [168, 85, 247], textColor: 255, fontSize: 11 },
      columnStyles: {
        0: { cellWidth: 35, fontStyle: 'bold' },
        1: { cellWidth: 30 },
        2: { cellWidth: 35 },
        3: { cellWidth: 70, textColor: [168, 85, 247] }
      },
      margin: { left: 14, right: 14 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 5;

    // Info adicional de técnica
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    const avgPerSession = techniqueCount > 0 ? Math.round(techniqueVolume / techniqueCount) : 0;
    doc.text(`Total Técnica: ${(techniqueVolume / 1000).toFixed(1)} km | ${techniqueCount} sesiones | Promedio: ${avgPerSession}m/sesión`, 14, yPos);
    yPos += 15;
  } else {
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('No se detectaron sesiones de técnica específica por estilo', 14, yPos);
    yPos += 15;
  }

  // ========== USO DE EQUIPAMIENTO ==========
  if (yPos > 200) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('🏊 Uso de Equipamiento', 14, yPos);
  yPos += 10;

  const equipmentVolumes: { [key: string]: number } = {
    'Pull Buoy': 0,
    'Aletas': 0,
    'Paletas': 0,
    'Patada': 0,
    'Paracaídas': 0
  };

  const equipmentSessionCount: { [key: string]: number } = {
    'Pull Buoy': 0,
    'Aletas': 0,
    'Paletas': 0,
    'Patada': 0,
    'Paracaídas': 0
  };

  sessions.forEach(session => {
    const warmup = session.warmup?.toLowerCase() || '';
    const mainSet = Array.isArray(session.mainSet) ? session.mainSet.join(' ').toLowerCase() : (session.mainSet?.toLowerCase() || '');
    const cooldown = session.cooldown?.toLowerCase() || '';
    const focus = session.focus?.toLowerCase() || '';
    const description = session.description?.toLowerCase() || '';
    const combinedText = `${warmup} ${mainSet} ${cooldown} ${focus} ${description}`;
    
    const equipmentKeywords = {
      'Pull Buoy': ['pull', 'pullbuoy', 'pull buoy', 'pull-buoy'],
      'Aletas': ['aletas', 'fins', 'con aletas'],
      'Paletas': ['paletas', 'paddles', 'manos', 'palas'],
      'Patada': ['patada', 'kick', 'piernas', 'pies'],
      'Paracaídas': ['paracaidas', 'paracaídas', 'resistance', 'arrastre', 'parachute']
    };

    Object.entries(equipmentKeywords).forEach(([equipment, keywords]) => {
      if (keywords.some(kw => combinedText.includes(kw))) {
        equipmentVolumes[equipment] += Math.round(session.distance * 0.25);
        equipmentSessionCount[equipment]++;
      }
    });
  });

  const equipmentData = Object.entries(equipmentVolumes)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => {
      const percentage = totalDistance > 0 ? Math.round((value / totalDistance) * 100) : 0;
      const sessions = equipmentSessionCount[name];
      const avgPerSession = sessions > 0 ? Math.round(value / sessions) : 0;
      
      return [
        name,
        sessions.toString(),
        `${(value / 1000).toFixed(1)} km`,
        `${percentage}%`,
        `${avgPerSession} m`
      ];
    })
    .sort((a, b) => parseFloat(b[2]) - parseFloat(a[2])); // Ordenar por volumen

  if (equipmentData.length > 0) {
    autoTable(doc, {
      startY: yPos,
      head: [['Equipamiento', 'Sesiones', 'Volumen', '% Total', 'Prom/Sesión']],
      body: equipmentData,
      theme: 'striped',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold' },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30 }
      },
      margin: { left: 14, right: 14 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 5;
  } else {
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('No se detectó uso específico de equipamiento en las sesiones', 14, yPos);
    yPos += 15;
  }

  // Nota explicativa
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('* Estimación basada en palabras clave detectadas en descripciones de entrenamientos', 14, yPos);

  // Pie de página
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generado el ${new Date().toLocaleDateString('es-CL')} | Club Natación Lo Prado | Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Descargar el PDF
  const fileName = `Estadisticas_Entrenamiento_Lo_Prado_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
