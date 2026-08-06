// src/utils/exportPdf.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { LE8_DOMAINS } from "../data/le8Criteria";

export function exportResultToPdf(result) {
  const doc = new jsPDF();
  const dateStr = new Date(result.date).toLocaleDateString("pt-BR");

  // Cabeçalho
  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.text("Relatório de Avaliação — Life's Essential 8", 14, 20);

  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.setTextColor(100);
  doc.text("UniEVANGÉLICA — Universidade Evangélica de Goiás", 14, 27);
  doc.text(`Data da avaliação: ${dateStr}`, 14, 33);

  // Score principal
  doc.setFontSize(28);
  doc.setTextColor(20, 35, 63);
  doc.setFont(undefined, "bold");
  doc.text(`${result.compositeScore} / 100`, 14, 50);

  doc.setFontSize(12);
  doc.setFont(undefined, "normal");
  doc.text(`Classificação: Saúde Cardiovascular ${result.classification.label}`, 14, 58);

  // Tabela de detalhamento por domínio
  const rows = LE8_DOMAINS.map((domain) => [
    domain.label,
    `${result.domainScores[domain.id]} / 100`,
  ]);

  autoTable(doc, {
    startY: 68,
    head: [["Domínio", "Pontuação"]],
    body: rows,
    headStyles: { fillColor: [22, 35, 63] },
    styles: { fontSize: 10 },
  });

  // Disclaimer no rodapé
  const finalY = doc.lastAutoTable.finalY || 68;
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    "Este resultado é orientativo e não substitui avaliação médica.",
    14,
    finalY + 12
  );
  doc.text(
    "Consulte um profissional de saúde para interpretação clínica.",
    14,
    finalY + 17
  );
  doc.text(
    "Baseado em: Lloyd-Jones et al., Life's Essential 8, Circulation, 2022.",
    14,
    finalY + 24
  );

  doc.save(`avaliacao-le8-${dateStr.replace(/\//g, "-")}.pdf`);
}