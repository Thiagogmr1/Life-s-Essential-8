// src/utils/scoring.js
// Funções puras: recebem respostas cruas do questionário, devolvem pontos (0-100).
// Nenhuma função aqui manipula estado ou UI — só cálculo.

import {
    DIET_ITEMS,
    DIET_SCORE_THRESHOLDS,
    NICOTINE_OPTIONS,
    SLEEP_THRESHOLDS,
    PHYSICAL_ACTIVITY_THRESHOLDS,
    BMI_THRESHOLDS,
    NON_HDL_THRESHOLDS,
    GLUCOSE_THRESHOLDS,
    BLOOD_PRESSURE_THRESHOLDS,
    MEDICATION_PENALTY,
    SCORE_CLASSIFICATION,
  } from "../data/le8Criteria";
  
  function clamp(value, min = 0, max = 100) {
    return Math.min(max, Math.max(min, value));
  }
  
  export function scoreDiet(answers) {
    // answers: { fruitsVeggies: 0-2, wholeGrains: 0-2, ... } (8 itens)
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
  
  export function scoreNicotine(optionValue) {
    const opt = NICOTINE_OPTIONS.find((o) => o.value === optionValue);
    return opt ? opt.points : 0;
  }
  
  export function scoreSleep(hoursPerNight) {
    const tier = SLEEP_THRESHOLDS.find(
      (t) => hoursPerNight >= t.min && hoursPerNight < t.max
    );
    return tier ? tier.points : 0;
  }
  
  export function calculateBmi(weightKg, heightM) {
    if (!weightKg || !heightM) return null;
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
    // Prioriza HbA1c se ambos forem informados (mais estável clinicamente)
    const tier = GLUCOSE_THRESHOLDS.find((t) => {
      if (hba1c != null) return hba1c < t.maxA1c;
      if (fastingGlucose != null) return fastingGlucose < t.maxFbg;
      return false;
    });
    const base = tier ? tier.points : 0;
    return isOnMedication ? clamp(base - MEDICATION_PENALTY) : base;
  }
  
  export function scoreBloodPressure(systolic, diastolic) {
    const tier = BLOOD_PRESSURE_THRESHOLDS.find(
      (t) => systolic < t.sys && diastolic < t.dia
    );
    return tier ? tier.points : 0;
  }
  
  // ---- Score composto ----
  // Recebe um objeto com os 8 scores já calculados individualmente
  export function calculateCompositeScore(domainScores) {
    const values = Object.values(domainScores);
    const sum = values.reduce((acc, v) => acc + v, 0);
    return Math.round(sum / values.length);
  }
  
  export function classifyScore(compositeScore) {
    const tier = SCORE_CLASSIFICATION.find((t) => compositeScore <= t.max);
    return tier ?? SCORE_CLASSIFICATION[SCORE_CLASSIFICATION.length - 1];
  }
  
  // ---- Função orquestradora: recebe todas as respostas do questionário
  // e devolve o objeto completo de resultado ----
  export function calculateFullAssessment(rawAnswers) {
    const bmi = calculateBmi(rawAnswers.weightKg, rawAnswers.heightM);
  
    const domainScores = {
      diet: scoreDiet(rawAnswers.diet),
      physicalActivity: scorePhysicalActivity(rawAnswers.physicalActivityMinutes),
      nicotineExposure: scoreNicotine(rawAnswers.nicotineStatus),
      sleep: scoreSleep(rawAnswers.sleepHours),
      bmi: scoreBmi(bmi),
      bloodLipids: scoreBloodLipids(rawAnswers.nonHdlCholesterol, rawAnswers.lipidsMedication),
      bloodGlucose: scoreBloodGlucose({
        fastingGlucose: rawAnswers.fastingGlucose,
        hba1c: rawAnswers.hba1c,
        isOnMedication: rawAnswers.glucoseMedication,
      }),
      bloodPressure: scoreBloodPressure(rawAnswers.systolic, rawAnswers.diastolic),
    };
  
    const compositeScore = calculateCompositeScore(domainScores);
    const classification = classifyScore(compositeScore);
  
    return { bmi, domainScores, compositeScore, classification };
  }