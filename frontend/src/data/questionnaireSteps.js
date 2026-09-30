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
  // NOVO: separado em dois campos (moderada e vigorosa) a pedido da
  // orientadora. A combinação em minutos equivalentes (moderada + 2x
  // vigorosa, padrão OMS/AHA) acontece em scorePhysicalActivity —
  // aqui é só a coleta bruta de cada um.
  {
    id: "physicalActivityModerate",
    domain: "physicalActivity",
    type: "number",
    field: "moderateActivityMinutes",
    label: "Quantos minutos de atividade física MODERADA você pratica por semana?",
    placeholder: "Ex: 90",
    unit: "minutos/semana",
    min: 0,
    max: 2000,
  },
  {
    id: "physicalActivityVigorous",
    domain: "physicalActivity",
    type: "number",
    field: "vigorousActivityMinutes",
    label: "Quantos minutos de atividade física VIGOROSA você pratica por semana?",
    placeholder: "Ex: 30",
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
  // NOVO: exposição passiva ao tabagismo — desconta 20 pontos do
  // domínio Tabagismo (ver SECONDHAND_SMOKE_PENALTY em le8Criteria.js).
  // Pergunta solta, não embutida no passo de nicotina, porque usa um
  // tipo de input genérico (checkbox) reutilizável por outras perguntas
  // sim/não que possam surgir no futuro.
  {
    id: "secondhandSmoke",
    domain: "nicotineExposure",
    type: "checkbox",
    field: "livesWithSmoker",
    label: "Você mora com alguém que fuma dentro de casa?",
    checkboxLabel: "Sim, moro com fumante(s) em casa",
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