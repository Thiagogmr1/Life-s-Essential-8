// src/utils/exportAdminExcel.js
import * as XLSX from "xlsx";

const SEXO_LABELS = {
  masculino: "Masculino",
  feminino: "Feminino",
};

const CLASSIFICACAO_LABELS = {
  alta: "Alta",
  moderada: "Moderada",
  baixa: "Baixa",
};

export function exportUsuariosAdminToExcel(usuarios) {
  const rows = usuarios.map((u) => ({
    Nome: u.nome,
    Sexo: SEXO_LABELS[u.sexo] || u.sexo,
    Idade: u.idade,
    "Data de nascimento": new Date(u.data_nascimento).toLocaleDateString("pt-BR"),
    Estado: u.estado,
    Cidade: u.cidade,
    Email: u.email,
    "Total de avaliações": u.total_avaliacoes,
    "Último score": u.ultimo_score ?? "",
    "Última classificação": u.ultima_classificacao
      ? CLASSIFICACAO_LABELS[u.ultima_classificacao] || u.ultima_classificacao
      : "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Usuários LE8");

  const colWidths = Object.keys(rows[0] || {}).map((key) => ({
    wch: Math.max(key.length, 14),
  }));
  worksheet["!cols"] = colWidths;

  XLSX.writeFile(workbook, `usuarios-le8-${Date.now()}.xlsx`);
}