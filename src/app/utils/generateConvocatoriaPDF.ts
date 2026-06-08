import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Competition, Swimmer, SwimmerCompetition } from "../data/swimmers";
import { calculateCategoryFromBirthDate } from "./swimmerUtils";

const NAVY  = [26, 82, 118]  as [number, number, number];
const WHITE = [255, 255, 255] as [number, number, number];
const LIGHT = [214, 234, 248] as [number, number, number];
const GRAY  = [127, 140, 141] as [number, number, number];
const DARK  = [44, 62, 80]   as [number, number, number];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export function generateConvocatoriaPDF(
  competition: Competition,
  swimmers: Swimmer[],
  swimmerCompetitions: SwimmerCompetition[]
) {
  // Collect selected swimmers for this competition
  const participantIds = new Set(
    swimmerCompetitions
      .filter(sc => sc.competitionId === competition.id && sc.participates)
      .map(sc => sc.swimmerId)
  );
  const participants = swimmers
    .filter(s => participantIds.has(s.id))
    .sort((a, b) => {
      const catA = calculateCategoryFromBirthDate(a.dateOfBirth);
      const catB = calculateCategoryFromBirthDate(b.dateOfBirth);
      if (catA !== catB) return catA.localeCompare(catB);
      return a.name.localeCompare(b.name);
    });

  if (participants.length === 0) {
    alert("No hay nadadores seleccionados para esta competencia.");
    return;
  }

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, M = 14, CW = W - M * 2;
  let y = M;

  // ── Header ──────────────────────────────────────────────────────────────────
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, 42, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...WHITE);
  doc.text("Club Lo Prado — Natación", M, 14);

  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  doc.text("NÓMINA OFICIAL DE CONVOCADOS", M, 23);

  doc.setFontSize(9);
  doc.text(competition.name.toUpperCase(), M, 31);
  doc.text(
    `${fmtDate(competition.startDate)}  ·  ${competition.location}  ·  Piscina ${competition.poolType}`,
    M, 37
  );

  y = 50;

  // ── Competition info strip ──────────────────────────────────────────────────
  doc.setFillColor(...LIGHT);
  doc.rect(M, y, CW, 18, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...NAVY);
  const infoItems = [
    `Tipo: ${competition.type}`,
    `Fecha: ${fmtDate(competition.startDate)}${competition.startDate !== competition.endDate ? ` al ${fmtDate(competition.endDate)}` : ""}`,
    `Horario: ${competition.schedule}`,
    `Costo inscripción: ${competition.cost}`,
    `Categorías: ${competition.categories?.length ? competition.categories.join(", ") : "Todas"}`,
  ];
  doc.text(infoItems[0], M + 4, y + 6);
  doc.text(infoItems[1], M + 4, y + 11);
  doc.text(infoItems[2], M + 70, y + 6);
  doc.text(infoItems[3], M + 70, y + 11);
  doc.text(infoItems[4], M + 70, y + 16);
  doc.text(`Total convocados: ${participants.length}`, W - M - 4, y + 6, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(39, 174, 96);
  doc.text(String(participants.length), W - M - 4, y + 16, { align: "right" });

  y += 24;

  // ── Swimemr table ───────────────────────────────────────────────────────────
  const rows = participants.map((s, i) => {
    const sc = swimmerCompetitions.find(
      x => x.swimmerId === s.id && x.competitionId === competition.id
    );
    const events = sc?.events?.map(e => e.event).join(", ") || "—";
    const year = new Date(s.dateOfBirth).getFullYear();
    return [
      String(i + 1),
      s.name,
      s.rut || "—",
      calculateCategoryFromBirthDate(s.dateOfBirth),
      s.gender?.[0] ?? "—",
      String(year),
      events,
    ];
  });

  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M },
    head: [["N°", "Apellidos y Nombre", "RUT", "Categoría", "G", "Año Nac.", "Pruebas"]],
    body: rows,
    styles: {
      font: "helvetica", fontSize: 8.5, cellPadding: 2.5,
      textColor: DARK, lineColor: [174, 214, 241], lineWidth: 0.2,
    },
    headStyles: {
      fillColor: NAVY, textColor: WHITE, fontStyle: "bold",
      fontSize: 9, halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 8,  halign: "center" },
      1: { cellWidth: 48, fontStyle: "bold" },
      2: { cellWidth: 25 },
      3: { cellWidth: 20, halign: "center" },
      4: { cellWidth: 8,  halign: "center" },
      5: { cellWidth: 16, halign: "center" },
      6: { cellWidth: "auto" },
    },
    alternateRowStyles: { fillColor: [248, 249, 250] },
    // Group by category with a separator row
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 3) {
        const cat = String(data.cell.raw ?? "");
        if (["Inf E","Inf D","Inf C","Inf A"].includes(cat)) {
          data.cell.styles.textColor = [108, 52, 131]; // purple Grupo 1
        } else {
          data.cell.styles.textColor = [39, 174, 96]; // green Grupo 2
        }
      }
    },
  });

  // ── Events reference ─────────────────────────────────────────────────────────
  if (competition.events.length > 0) {
    const fy = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...NAVY);
    doc.text("Pruebas disponibles en esta competencia:", M, fy);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...DARK);
    const eventsText = competition.events.join("  ·  ");
    const lines = doc.splitTextToSize(eventsText, CW);
    doc.text(lines, M, fy + 6);
  }

  // ── Footer on all pages ──────────────────────────────────────────────────────
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...GRAY);
    doc.setDrawColor(...GRAY);
    doc.line(M, 289, W - M, 289);
    doc.text(
      `Club Lo Prado — Nómina de Convocados · ${competition.name} · Generado: ${new Date().toLocaleDateString("es-CL")}   Pág. ${p}/${total}`,
      W / 2, 294, { align: "center" }
    );
  }

  const safeName = competition.name.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30);
  doc.save(`Convocados_${safeName}.pdf`);
}
