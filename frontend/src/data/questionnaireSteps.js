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
    // Definição e exemplos exatos do Anexo 2 do protocolo (IPAQ —
    // forma curta, questões 2a/2b): esforço que faz suar leve e
    // respirar um pouco mais forte que o normal. O IPAQ original
    // exclui caminhada deste bloco de propósito (ela tem uma seção
    // própria, 3a/3b, que este app ainda não implementa — ver aviso).
    helperText: "São atividades que fazem você suar leve e respirar um pouco mais forte que o normal. NÃO inclua caminhada aqui.",
    examples: [
      "Pedalar leve na bicicleta",
      "Nadar",
      "Dançar",
      "Ginástica aeróbica leve",
      "Vôlei recreativo",
      "Carregar pesos leves",
      "Serviços domésticos (varrer, aspirar, cuidar do jardim)",
    ],
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
    // Anexo 2 do protocolo (IPAQ — forma curta, questões 1a/1b).
    helperText: "São atividades que fazem você suar bastante e respirar muito mais forte que o normal.",
    examples: [
      "Correr",
      "Ginástica aeróbica",
      "Jogar futebol",
      "Pedalar rápido na bicicleta",
      "Jogar basquete",
      "Serviços domésticos pesados (casa, quintal ou jardim)",
      "Carregar pesos elevados",
    ],
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
  // Usa "radio" com Sim/Não explícitos (a pedido da orientadora) em vez
  // de checkbox solto — obriga a pessoa a escolher, não deixa "passar
  // direto" sem responder.
  {
    id: "secondhandSmoke",
    domain: "nicotineExposure",
    type: "radio",
    field: "livesWithSmoker",
    label: "Você mora com alguém que fuma dentro de casa?",
    options: [
      { value: true, label: "Sim, moro com fumante(s) em casa" },
      { value: false, label: "Não, não moro com fumante" },
    ],
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