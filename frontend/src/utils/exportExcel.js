// src/utils/exportExcel.js
import * as XLSX from "xlsx";
import { LE8_DOMAINS, DIET_ITEMS, NICOTINE_OPTIONS } from "../data/le8Criteria";

// Traduz o valor bruto de um item de dieta (pontos: 0, 1 ou 2) de volta
// para o texto da opção que o usuário selecionou (ex: "4 ou mais")
function dietItemLabel(itemId, points) {
  const item = DIET_ITEMS.find((i) => i.id === itemId);
  if (!item) return "";
  const option = item.options.find((opt) => opt.points === points);
  return option ? option.label : "";
}

function nicotineLabel(value) {
  const opt = NICOTINE_OPTIONS.find((o) => o.value === value);
  return opt ? opt.label : "";
}

export function exportHistoryToExcel(history) {
  const rows = history.map((entry) => {
    const raw = entry.rawAnswers || {};

    const row = {
      Data: new Date(entry.date).toLocaleDateString("pt-BR"),
      "Score Total": entry.compositeScore,
      Classificação: entry.classification.label,
    };

    // Scores calculados por domínio
    LE8_DOMAINS.forEach((domain) => {
      row[`Score — ${domain.label}`] = entry.domainScores[domain.id];
    });

    // Respostas brutas — Dieta (uma coluna por item)
    DIET_ITEMS.forEach((item) => {
      row[`Dieta — ${item.label}`] = dietItemLabel(item.id, raw.diet?.[item.id]);
    });

    // Respostas brutas — demais domínios
    row["Atividade Física (min/semana)"] = raw.physicalActivityMinutes ?? "";
    row["Tabagismo"] = nicotineLabel(raw.nicotineStatus);
    row["Sono (horas/noite)"] = raw.sleepHours ?? "";
    row["Peso (kg)"] = raw.weightKg ?? "";
    row["Altura (m)"] = raw.heightM ?? "";
    row["IMC calculado"] = entry.bmi ? entry.bmi.toFixed(1) : "";
    row["Colesterol não-HDL (mg/dL)"] = raw.nonHdlCholesterol ?? "";
    row["Em tratamento (colesterol)"] = raw.lipidsMedication ? "Sim" : "Não";
    row["Glicemia de jejum (mg/dL)"] = raw.fastingGlucose ?? "";
    row["HbA1c (%)"] = raw.hba1c ?? "";
    row["Em tratamento (glicemia)"] = raw.glucoseMedication ? "Sim" : "Não";
    row["Pressão sistólica (mmHg)"] = raw.systolic ?? "";
    row["Pressão diastólica (mmHg)"] = raw.diastolic ?? "";

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Histórico LE8");

  const colWidths = Object.keys(rows[0] || {}).map((key) => ({
    wch: Math.max(key.length, 14),
  }));
  worksheet["!cols"] = colWidths;

  XLSX.writeFile(workbook, `historico-le8-${Date.now()}.xlsx`);
}