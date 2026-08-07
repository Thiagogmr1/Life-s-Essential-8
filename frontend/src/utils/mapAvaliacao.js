// src/utils/mapAvaliacao.js
import { SCORE_CLASSIFICATION } from "../data/le8Criteria";

// Backend manda a classificação em minúsculo ("baixa"), o front usa
// capitalizado como label ("Baixa") — ver SCORE_CLASSIFICATION.
const CLASSIFICATION_LABEL_MAP = {
  baixa: "Baixa",
  moderada: "Moderada",
  alta: "Alta",
};

function getClassificationInfo(classificacao) {
  const label = CLASSIFICATION_LABEL_MAP[classificacao] ?? classificacao;
  const info = SCORE_CLASSIFICATION.find((c) => c.label === label);
  return {
    label,
    colorToken: info?.colorToken ?? "score-mid",
  };
}

// Nomes dos campos no backend (português, snake_case) → nomes que os
// componentes do front já esperam (inglês, camelCase, ver LE8_DOMAINS)
const DOMAIN_FIELD_MAP = {
  diet: "score_dieta",
  physicalActivity: "score_atividade_fisica",
  nicotineExposure: "score_tabagismo",
  sleep: "score_sono",
  bmi: "score_imc",
  bloodLipids: "score_colesterol",
  bloodGlucose: "score_glicemia",
  bloodPressure: "score_pressao",
};

// Converte uma Avaliacao vinda da API (AvaliacaoResposta) para o
// formato que Results.jsx, History.jsx, exportPdf.js e exportExcel.js
// já foram escritos para consumir.
export function mapAvaliacaoFromApi(avaliacao) {
  const domainScores = Object.fromEntries(
    Object.entries(DOMAIN_FIELD_MAP).map(([key, apiField]) => [
      key,
      avaliacao[apiField],
    ])
  );

  return {
    id: avaliacao.id,
    date: avaliacao.data,
    compositeScore: avaliacao.score_total,
    classification: getClassificationInfo(avaliacao.classificacao),
    domainScores,
    rawAnswers: avaliacao.respostas_brutas,
    // Não disponível: o backend guarda só a pontuação do IMC
    // (score_imc), não o valor numérico calculado (ex: 24.3).
    bmi: null,
  };
}