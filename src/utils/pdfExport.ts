import { jsPDF } from 'jspdf';
import { Player, InformeJugador } from '../types';

export function exportarResumenEstadisticoPDF(players: Player[], informes: InformeJugador[]) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = 14;

  // Helper for adding footer
  const addFooter = (pageNum: number) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text(
      'SD GERNIKA CLUB · Departamento de Metodología y Rendimiento Deportivo · Temporada 2025-2026',
      margin,
      pageHeight - 8
    );
    doc.text(`Página ${pageNum}`, pageWidth - margin - 15, pageHeight - 8);
  };

  // Header Banner (Black background with white text)
  doc.setFillColor(15, 15, 15);
  doc.rect(margin, y, pageWidth - margin * 2, 22, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('SD GERNIKA CLUB — RESUMEN ESTADÍSTICO', margin + 6, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  doc.text(
    'INFORME TÉCNICO DE RENDIMIENTO DE LA PLANTILLA · SEGUNDA FEDERACIÓN 25-26',
    margin + 6,
    y + 16
  );

  y += 28;

  // Metadata block
  const fechaHoy = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text(`Fecha de emisión: ${fechaHoy}`, margin, y);
  doc.text(`Estadio: Urbieta (Gernika-Lumo)`, margin + 70, y);
  doc.text(`Plantilla: ${players.length} futbolistas`, pageWidth - margin - 45, y);
  y += 7;

  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Calculate Averages
  const totalInformes = informes.length;
  const avg = (fn: (i: InformeJugador) => number) =>
    totalInformes > 0 ? (informes.reduce((acc, i) => acc + fn(i), 0) / totalInformes).toFixed(1) : '-';

  const avgTec = avg((i) => i.tecnica);
  const avgTac = avg((i) => i.tactica);
  const avgCon = avg((i) => i.condicional);
  const avgDec = avg((i) => i.tomaDecision);
  const avgAct = avg((i) => i.actitud);
  const avgWel = avg((i) => i.wellness);
  const avgRpe = avg((i) => i.rpe);

  // Section 1: Global KPIs
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(10, 10, 10);
  doc.text('1. MEDIAS GLOBALES DEL EQUIPO (ESCALA 1-5 / RPE 1-10)', margin, y);
  y += 6;

  const kpis = [
    { label: 'TÉCNICA', val: avgTec, scale: '/ 5' },
    { label: 'TÁCTICA', val: avgTac, scale: '/ 5' },
    { label: 'CONDICIONAL', val: avgCon, scale: '/ 5' },
    { label: 'T. DECISIÓN', val: avgDec, scale: '/ 5' },
    { label: 'ACTITUD', val: avgAct, scale: '/ 5' },
    { label: 'WELLNESS', val: avgWel, scale: '/ 5' },
    { label: 'CARGA RPE', val: avgRpe, scale: '/ 10' },
  ];

  const colWidth = (pageWidth - margin * 2) / kpis.length;
  kpis.forEach((kpi, idx) => {
    const boxX = margin + idx * colWidth;
    doc.setFillColor(245, 245, 245);
    doc.rect(boxX, y, colWidth - 2, 16, 'F');
    doc.setDrawColor(210, 210, 210);
    doc.rect(boxX, y, colWidth - 2, 16, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.text(kpi.label, boxX + (colWidth - 2) / 2, y + 5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 15, 15);
    doc.text(kpi.val, boxX + (colWidth - 2) / 2, y + 12, { align: 'center' });

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text(kpi.scale, boxX + (colWidth - 2) / 2 + 7, y + 12);
  });

  y += 22;

  // Section 2: Player Breakdown Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(10, 10, 10);
  doc.text('2. RENDIMIENTO INDIVIDUALIZADO POR JUGADOR', margin, y);
  y += 5;

  // Table Headers
  const tableHeaders = [
    { name: '#', w: 10, align: 'center' as const },
    { name: 'JUGADOR', w: 45, align: 'left' as const },
    { name: 'POSICIÓN', w: 35, align: 'left' as const },
    { name: 'TÉC', w: 12, align: 'center' as const },
    { name: 'TÁC', w: 12, align: 'center' as const },
    { name: 'CON', w: 12, align: 'center' as const },
    { name: 'DEC', w: 12, align: 'center' as const },
    { name: 'ACT', w: 12, align: 'center' as const },
    { name: 'RPE', w: 14, align: 'center' as const },
    { name: 'INF.', w: 18, align: 'center' as const },
  ];

  doc.setFillColor(30, 30, 30);
  doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);

  let currentX = margin;
  tableHeaders.forEach((h) => {
    const textX = h.align === 'center' ? currentX + h.w / 2 : currentX + 2;
    doc.text(h.name, textX, y + 4.8, { align: h.align });
    currentX += h.w;
  });

  y += 7;

  // Sorted players by dorsal
  const sortedPlayers = [...players].sort((a, b) => a.dorsal - b.dorsal);

  let pageNumber = 1;

  sortedPlayers.forEach((p, idx) => {
    // Check if we need a new page
    if (y > pageHeight - 25) {
      addFooter(pageNumber);
      doc.addPage();
      pageNumber++;
      y = margin;

      // Repeat table header on next page
      doc.setFillColor(30, 30, 30);
      doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      let repeatX = margin;
      tableHeaders.forEach((h) => {
        const textX = h.align === 'center' ? repeatX + h.w / 2 : repeatX + 2;
        doc.text(h.name, textX, y + 4.8, { align: h.align });
        repeatX += h.w;
      });
      y += 7;
    }

    // Player reports
    const playerInfs = informes.filter(
      (inf) => String(inf.jugadorId) === String(p.id) || inf.jugadorDorsal === p.dorsal
    );
    const pAvg = (fn: (i: InformeJugador) => number, defaultVal: number | undefined) => {
      if (playerInfs.length > 0) {
        return (playerInfs.reduce((a, b) => a + fn(b), 0) / playerInfs.length).toFixed(1);
      }
      return defaultVal ? defaultVal.toFixed(1) : '-';
    };

    const tecVal = pAvg((i) => i.tecnica, p.tecnica);
    const tacVal = pAvg((i) => i.tactica, p.tactica);
    const conVal = pAvg((i) => i.condicional, p.condicional);
    const decVal = pAvg((i) => i.tomaDecision, 4);
    const actVal = pAvg((i) => i.actitud, 5);
    const rpeVal = pAvg((i) => i.rpe, 7);

    // Row zebra striping
    if (idx % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, y, pageWidth - margin * 2, 6, 'F');
    }

    doc.setDrawColor(230, 230, 230);
    doc.line(margin, y + 6, pageWidth - margin, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(20, 20, 20);

    let rowX = margin;

    // Dorsal
    doc.setFont('helvetica', 'bold');
    doc.text(String(p.dorsal), rowX + 5, y + 4.2, { align: 'center' });
    rowX += 10;

    // Nombre
    const cleanName = p.nombre.length > 24 ? p.nombre.substring(0, 22) + '...' : p.nombre;
    doc.setFont('helvetica', 'bold');
    doc.text(cleanName, rowX + 2, y + 4.2);
    rowX += 45;

    // Posición
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(80, 80, 80);
    const cleanPos = (p.posicion || 'Futbolista').substring(0, 20);
    doc.text(cleanPos, rowX + 2, y + 4.2);
    rowX += 35;

    // Metrics
    doc.setFontSize(8);
    doc.setTextColor(20, 20, 20);

    doc.text(tecVal, rowX + 6, y + 4.2, { align: 'center' });
    rowX += 12;

    doc.text(tacVal, rowX + 6, y + 4.2, { align: 'center' });
    rowX += 12;

    doc.text(conVal, rowX + 6, y + 4.2, { align: 'center' });
    rowX += 12;

    doc.text(decVal, rowX + 6, y + 4.2, { align: 'center' });
    rowX += 12;

    doc.text(actVal, rowX + 6, y + 4.2, { align: 'center' });
    rowX += 12;

    doc.text(rpeVal, rowX + 7, y + 4.2, { align: 'center' });
    rowX += 14;

    doc.setFont('helvetica', 'bold');
    doc.text(`${playerInfs.length} inf.`, rowX + 9, y + 4.2, { align: 'center' });

    y += 6;
  });

  y += 6;

  // Section 3: Recent Technician Reports Observations (if space permits or on new page)
  if (informes.length > 0) {
    if (y > pageHeight - 50) {
      addFooter(pageNumber);
      doc.addPage();
      pageNumber++;
      y = margin;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(10, 10, 10);
    doc.text('3. OBSERVACIONES TÉCNICAS RECIENTES REGISTRADAS', margin, y);
    y += 5;

    const recentInfs = [...informes]
      .filter((inf) => inf.observaciones && inf.observaciones.trim().length > 0)
      .slice(0, 6);

    if (recentInfs.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text('Sin observaciones adicionales registradas.', margin, y);
      y += 6;
    } else {
      recentInfs.forEach((inf) => {
        if (y > pageHeight - 20) {
          addFooter(pageNumber);
          doc.addPage();
          pageNumber++;
          y = margin;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(15, 15, 15);
        doc.text(
          `• ${inf.fecha} [${inf.tipo.toUpperCase()}] — #${inf.jugadorDorsal} ${inf.jugadorNombre}:`,
          margin + 2,
          y
        );

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(70, 70, 70);
        const splitText = doc.splitTextToSize(inf.observaciones || '', pageWidth - margin * 2 - 8);
        doc.text(splitText, margin + 6, y + 4);
        y += 4 + splitText.length * 3.6 + 2;
      });
    }
  }

  addFooter(pageNumber);

  // Trigger download
  doc.save('SD_Gernika_Resumen_Estadistico_25-26.pdf');
}
