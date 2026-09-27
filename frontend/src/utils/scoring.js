// src/utils/scoring.js
// Funções puras: recebem respostas cruas do questionário, devolvem pontos (0-100).
// Nenhuma função aqui manipula estado ou UI — só cálculo.

import {
  DIET_ITEMS,
  DIET_SCORE_THRESHOLDS,
  NICOTINE_OPTIONS,
  SECONDHAND_SMOKE_PENALTY,
  SLEEP_THRESHOLDS,
  PHYSICAL_ACTIVITY_THRESHOLDS,
  BMI_THRESHOLDS,
  NON_HDL_THRESHOLDS,
  GLUCOSE_THRESHOLDS,
  BLOOD_PRESSURE_THRESHOLDS,
  MEDICATION_PENALTY,
  SCORE_CLASSIFICATION,
} from "../data/le8Criteria";

// Erro específico para dado obrigatório ausente — espelha
// DadosInsuficientesError do backend (scoring.py). Telas de formulário
// podem capturar isso e apontar exatamente o que falta preencher.
export class DadosInsuficientesError extends Error {}

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function scoreDiet(answers) {
  const total = DIET_ITEMS.reduce((sum, item) => sum + (answers[item.id] ?? 0), 0);
  const tier = DIET_SCORE_THRESHOLDS.find((t) => total >= t.min);
  return tier ? tier.points : 0;
}

export function scorePhysicalActivity(minutesPerWeek) {
  const tier = PHYSICAL_ACTIVITY_THRESHOLDS.find(
    (t) => minutesPerWeek >= t.min && minutesPerWeek < t.max
  );
  return tier ? tier.points : 0;
}

// CORRIGIDO: adicionado parâmetro livesWithSmoker — desconto de
// SECONDHAND_SMOKE_PENALTY (20 pontos) para quem mora com fumante(s)
// em casa, conforme o texto do protocolo (não estava implementado).
export function scoreNicotine(optionValue, livesWithSmoker = false) {
  const opt = NICOTINE_OPTIONS.find((o) => o.value === optionValue);
  const base = opt ? opt.points : 0;
  return livesWithSmoker ? clamp(base - SECONDHAND_SMOKE_PENALTY) : base;
}

export function scoreSleep(hoursPerNight) {
  const tier = SLEEP_THRESHOLDS.find(
    (t) => hoursPerNight >= t.min && hoursPerNight < t.max
  );
  return tier ? tier.points : 0;
}

// Antes: retornava null silenciosamente se peso/altura ausentes, e isso
// se propagava pra scoreBmi(null), que dava 100 pontos por coerção de
// tipo (null < 25 é true em JS). Agora lança erro explícito.
export function calculateBmi(weightKg, heightM) {
  if (!weightKg || !heightM) {
    throw new DadosInsuficientesError(
      "Peso e altura são obrigatórios para calcular o IMC"
    );
  }
  return weightKg / (heightM * heightM);
}

export function scoreBmi(bmi) {
  const tier = BMI_THRESHOLDS.find((t) => bmi < t.max);
  return tier ? tier.points : 0;
}

export function scoreBloodLipids(nonHdlMgDl, isOnMedication = false) {
  const tier = NON_HDL_THRESHOLDS.find((t) => nonHdlMgDl < t.max);
  const base = tier ? tier.points : 0;
  return isOnMedication ? clamp(base - MEDICATION_PENALTY) : base;
}

export function scoreBloodGlucose({ fastingGlucose, hba1c, isOnMedication = false }) {
  const tier = GLUCOSE_THRESHOLDS.find((t) => {
    if (hba1c != null) return hba1c < t.maxA1c;
    if (fastingGlucose != null) return fastingGlucose < t.maxFbg;
    return false;
  });
  const base = tier ? tier.points : 0;
  return isOnMedication ? clamp(base - MEDICATION_PENALTY) : base;
}

// CORRIGIDO: adicionado parâmetro isOnMedication — desconto de
// MEDICATION_PENALTY (20 pontos) para quem está em tratamento
// anti-hipertensivo, conforme o protocolo ("Se estiver em tratamento
// subtrair 20 pontos"). Antes não existia esse desconto aqui, embora
// já existisse para lipídeos e glicemia.
export function scoreBloodPressure(systolic, diastolic, isOnMedication = false) {
  const tier = BLOOD_PRESSURE_THRESHOLDS.find(
    (t) => systolic < t.sys && diastolic < t.dia
  );
  const base = tier ? tier.points : 0;
  return isOnMedication ? clamp(base - MEDICATION_PENALTY) : base;
}

export function calculateCompositeScore(domainScores) {
  const values = Object.values(domainScores);
  const sum = values.reduce((acc, v) => acc + v, 0);
  return Math.round(sum / values.length);
}

export function classifyScore(compositeScore) {
  const tier = SCORE_CLASSIFICATION.find((t) => compositeScore <= t.max);
  return tier ?? SCORE_CLASSIFICATION[SCORE_CLASSIFICATION.length - 1];
}

export function calculateFullAssessment(rawAnswers) {
  // Deixa o DadosInsuficientesError propagar — quem chama decide como
  // exibir isso (ex: AssessmentContext.submitAssessment).
  const bmi = calculateBmi(rawAnswers.weightKg, rawAnswers.heightM);

  const domainScores = {
    diet: scoreDiet(rawAnswers.diet),
    physicalActivity: scorePhysicalActivity(rawAnswers.physicalActivityMinutes),
    nicotineExposure: scoreNicotine(rawAnswers.nicotineStatus, rawAnswers.livesWithSmoker),
    sleep: scoreSleep(rawAnswers.sleepHours),
    bmi: scoreBmi(bmi),
    bloodLipids: scoreBloodLipids(rawAnswers.nonHdlCholesterol, rawAnswers.lipidsMedication),
    bloodGlucose: scoreBloodGlucose({
      fastingGlucose: rawAnswers.fastingGlucose,
      hba1c: rawAnswers.hba1c,
      isOnMedication: rawAnswers.glucoseMedication,
    }),
    bloodPressure: scoreBloodPressure(
      rawAnswers.systolic,
      rawAnswers.diastolic,
      rawAnswers.bloodPressureMedication
    ),
  };

  const compositeScore = calculateCompositeScore(domainScores);
  const classification = classifyScore(compositeScore);

  return { bmi, domainScores, compositeScore, classification };
}