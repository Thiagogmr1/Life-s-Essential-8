// src/data/questionnaireSteps.js
// Define a ORDEM e o TIPO de cada tela do questionário (wizard).
// Não contém lógica de pontuação — isso é responsabilidade do scoring.js.

import { DIET_ITEMS, NICOTINE_OPTIONS } from "./le8Criteria";

const dietSteps = DIET_ITEMS.map((item) => ({
  id: `diet-${item.id}`,
  domain: "diet",
  type: "dietItem",
  itemId: item.id,
  label: item.label,
  options: item.options,
}));

export const QUESTIONNAIRE_STEPS = [
  ...dietSteps,
  {
    id: "physicalActivity",
    domain: "physicalActivity",
    type: "number",
    field: "physicalActivityMinutes",
    label: "Quantos minutos de atividade física moderada a vigorosa você pratica por semana?",
    placeholder: "Ex: 150",
    unit: "minutos/semana",
    min: 0,
    max: 2000,
  },
  {
    id: "nicotine",
    domain: "nicotineExposure",
    type: "radio",
    field: "nicotineStatus",
    label: "Qual sua situação em relação ao tabagismo?",
    options: NICOTINE_OPTIONS,
  },
  {
    id: "sleep",
    domain: "sleep",
    type: "number",
    field: "sleepHours",
    label: "Em média, quantas horas você dorme por noite?",
    placeholder: "Ex: 7",
    unit: "horas",
    min: 0,
    max: 24,
    step: 0.5,
  },
  {
    id: "bmi",
    domain: "bmi",
    type: "bmi",
    label: "Informe seu peso e altura",
  },
  {
    id: "bloodLipids",
    domain: "bloodLipids",
    type: "lipids",
    label: "Informe seu colesterol não-HDL",
  },
  {
    id: "bloodGlucose",
    domain: "bloodGlucose",
    type: "glucose",
    label: "Informe sua glicemia",
  },
  {
    id: "bloodPressure",
    domain: "bloodPressure",
    type: "bloodPressure",
    label: "Informe sua pressão arterial",
  },
];