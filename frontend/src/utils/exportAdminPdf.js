// src/utils/exportAdminPdf.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SEXO_LABELS = {
  masculino: "Masculino",
  feminino: "Feminino",
};

const CLASSIFICACAO_LABELS = {
  alta: "Alta",
  moderada: "Moderada",
  baixa: "Baixa",
};

const DOMINIO_LABELS = {
  score_dieta: "Dieta",
  score_atividade_fisica: "Atividade física",
  score_tabagismo: "Tabagismo",
  score_sono: "Sono",
  score_imc: "IMC",
  score_colesterol: "Colesterol",
  score_glicemia: "Glicemia",
  score_pressao: "Pressão arterial",
};

function drawHeader(doc, title, subtitle) {
  doc.setFontSize(16);
  doc.setTextColor(20, 35, 63);
  doc.setFont(undefined, "bold");
  doc.text(title, 14, 20);

  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.setTextColor(100);
  doc.text("UniEVANGÉLICA — Universidade Evangélica de Goiás", 14, 27);
  if (subtitle) {
    doc.text(subtitle, 14, 33);
  }
}

export function exportEstatisticasToPdf(resumo, usuarios) {
  const doc = new jsPDF();
  const hoje = new Date().toLocaleDateString("pt-BR");

  drawHeader(
    doc,
    "Relatório Administrativo — Life's Essential 8",
    `Gerado em: ${hoje}`
  );

  // Resumo geral
  doc.setFontSize(11);
  doc.setTextColor(20, 35, 63);
  doc.setFont(undefined, "bold");
  doc.text("Resumo geral", 14, 44);

  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.setTextColor(60);
  doc.text(`Usuários cadastrados: ${resumo.total_usuarios}`, 14, 51);
  doc.text(`Avaliações realizadas: ${resumo.total_avaliacoes}`, 14, 57);
  doc.text(
    `Score médio geral: ${resumo.score_medio_geral ?? "—"}`,
    14,
    63
  );

  let ultimaLinhaY = 63;

  if (resumo.total_avaliacoes > 0) {
    // Média por domínio
    const dominioRows = Object.entries(resumo.media_por_dominio).map(
      ([chave, valor]) => [DOMINIO_LABELS[chave] || chave, valor]
    );

    autoTable(doc, {
      startY: 72,
      head: [["Domínio", "Média"]],
      body: dominioRows,
      headStyles: { fillColor: [22, 35, 63] },
      styles: { fontSize: 9 },
      margin: { left: 14, right: 110 },
      tableWidth: 90,
    });

    // Classificação e sexo — tabela ao lado
    const classificacaoRows = resumo.distribuicao_classificacao.map((item) => [
      CLASSIFICACAO_LABELS[item.classificacao] || item.classificacao,
      item.quantidade,
    ]);

    autoTable(doc, {
      startY: 72,
      head: [["Classificação", "Qtd."]],
      body: classificacaoRows,
      headStyles: { fillColor: [22, 35, 63] },
      styles: { fontSize: 9 },
      margin: { left: 110 },
      tableWidth: 86,
    });

    const sexoRows = resumo.media_por_sexo.map((item) => [
      SEXO_LABELS[item.sexo] || item.sexo,
      item.score_medio,
      item.quantidade,
    ]);

    const y2 = Math.max(
      doc.lastAutoTable.finalY,
      doc.previousAutoTable?.finalY || 0
    );

    autoTable(doc, {
      startY: y2 + 8,
      head: [["Sexo", "Score médio", "Quantidade"]],
      body: sexoRows,
      headStyles: { fillColor: [22, 35, 63] },
      styles: { fontSize: 9 },
      margin: { left: 14 },
      tableWidth: 90,
    });

    ultimaLinhaY = doc.lastAutoTable.finalY;
  }

  // Lista de usuários — nova página
  doc.addPage();
  drawHeader(
    doc,
    "Usuários cadastrados",
    `${usuarios.length} usuário(s) — gerado em ${hoje}`
  );

  const usuarioRows = usuarios.map((u) => [
    u.nome,
    SEXO_LABELS[u.sexo] || u.sexo,
    u.idade,
    `${u.cidade}/${u.estado}`,
    u.total_avaliacoes,
    u.ultimo_score ?? "—",
    u.ultima_classificacao
      ? CLASSIFICACAO_LABELS[u.ultima_classificacao] || u.ultima_classificacao
      : "—",
  ]);

  autoTable(doc, {
    startY: 42,
    head: [["Nome", "Sexo", "Idade", "Cidade/UF", "Avaliações", "Último score", "Classificação"]],
    body: usuarioRows,
    headStyles: { fillColor: [22, 35, 63] },
    styles: { fontSize: 8 },
  });

  doc.save(`relatorio-admin-le8-${hoje.replace(/\//g, "-")}.pdf`);
}