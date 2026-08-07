// src/utils/exportExcel.js
import * as XLSX from "xlsx";
import { LE8_DOMAINS, DIET_ITEMS, NICOTINE_OPTIONS } from "../data/le8Criteria";
import { calculateBmi, DadosInsuficientesError } from "./scoring";

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

// O backend guarda só a pontuação do IMC (score_imc), não o valor
// numérico calculado — recalculamos aqui, localmente, só para exibição
// na planilha. Não decide nenhum score, é puramente informativo.
function calcularImcParaExibicao(raw) {
  try {
    return calculateBmi(raw.weightKg, raw.heightM);
  } catch (err) {
    if (err instanceof DadosInsuficientesError) return null;
    throw err; // erro inesperado não deveria ser engolido
  }
}

export function exportHistoryToExcel(history) {
  const rows = history.map((entry) => {
    const raw = entry.rawAnswers || {};
    const bmi = calcularImcParaExibicao(raw);

    const row = {
      Data: new Date(entry.date).toLocaleDateString("pt-BR"),
      "Score Total": entry.compositeScore,
      Classificação: entry.classification.label,
    };

    LE8_DOMAINS.forEach((domain) => {
      row[`Score — ${domain.label}`] = entry.domainScores[domain.id];
    });

    DIET_ITEMS.forEach((item) => {
      row[`Dieta — ${item.label}`] = dietItemLabel(item.id, raw.diet?.[item.id]);
    });

    row["Atividade Física (min/semana)"] = raw.physicalActivityMinutes ?? "";
    row["Tabagismo"] = nicotineLabel(raw.nicotineStatus);
    row["Sono (horas/noite)"] = raw.sleepHours ?? "";
    row["Peso (kg)"] = raw.weightKg ?? "";
    row["Altura (m)"] = raw.heightM ?? "";
    row["IMC calculado"] = bmi !== null ? bmi.toFixed(1) : "";
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