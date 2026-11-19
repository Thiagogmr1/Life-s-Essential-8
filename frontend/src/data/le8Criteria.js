// src/data/le8Criteria.js

// Baseado em: Lloyd-Jones, D.M. et al. Life's Essential 8: Updating and
// Enhancing the American Heart Association's Construct of Cardiovascular
// Health. Circulation, 2022;146:e18–e43.
//
// Adaptado conforme o protocolo do grupo de pesquisa (proposta CNPq
// 2025, Quadros 1, 2, 3, 4 e 5): este projeto usa apenas glicemia de
// jejum (não HbA1c) para o domínio Glicemia, e o questionário de
// frequência alimentar da dieta do Mediterrâneo adaptado (Panagiotakos
// et al., 2006, Anexo 1) para o domínio Dieta.

export const CATEGORIES = {
  BEHAVIOR: "behavior",
  FACTOR: "factor",
};

export const LE8_DOMAINS = [
  { id: "diet", order: 1, category: CATEGORIES.BEHAVIOR, label: "Dieta", unit: null,
    description: "Questionário de frequência alimentar da dieta do Mediterrâneo, adaptado (Panagiotakos et al., 2006, Anexo 1)." },
  { id: "physicalActivity", order: 2, category: CATEGORIES.BEHAVIOR, label: "Atividade Física", unit: "min/semana",
    description: "Minutos semanais de atividade física moderada a vigorosa." },
  { id: "nicotineExposure", order: 3, category: CATEGORIES.BEHAVIOR, label: "Exposição ao Tabagismo", unit: null,
    description: "Situação atual em relação ao uso de tabaco/nicotina, incluindo exposição passiva em casa." },
  { id: "sleep", order: 4, category: CATEGORIES.BEHAVIOR, label: "Sono", unit: "horas/noite",
    description: "Média de horas de sono por noite." },
  { id: "bmi", order: 5, category: CATEGORIES.FACTOR, label: "Índice de Massa Corporal", unit: "kg/m²",
    description: "Calculado a partir de peso e altura informados." },
  { id: "bloodLipids", order: 6, category: CATEGORIES.FACTOR, label: "Colesterol não-HDL", unit: "mg/dL",
    description: "Colesterol total menos o HDL." },
  { id: "bloodGlucose", order: 7, category: CATEGORIES.FACTOR, label: "Glicemia", unit: "mg/dL",
    description: "Glicemia de jejum (mg/dL) — este protocolo não utiliza HbA1c." },
  { id: "bloodPressure", order: 8, category: CATEGORIES.FACTOR, label: "Pressão Arterial", unit: "mmHg",
    description: "Pressão sistólica e diastólica." },
];

// ---- Dieta: Questionário de Frequência Alimentar da Dieta do Mediterrâneo ----
// (Panagiotakos et al., 2006 — Anexo 1 do protocolo do grupo)
//
// 11 itens, cada um pontuado de 0 a 5 conforme a frequência de consumo
// mensal (ou semanal, no caso do azeite; ou ml/dia, no caso do álcool).
// Soma máxima: 55 pontos (11 itens x 5).
//
// Itens "bons" (mais consumo = mais pontos): cereais não-refinados,
// batatas, frutas, verduras, legumes, peixe.
// Itens "ruins" (mais consumo = menos pontos — escala invertida):
// carne vermelha e derivados, aves, leite integral e derivados.
// Azeite: mais uso = mais pontos (escala própria, por semana).
// Álcool: pergunta única "bebidas alcoólicas em geral" (vinho e
// cerveja combinados) — escala em "J": consumo moderado pontua mais
// alto que tanto abstinência total quanto consumo excessivo.

const FREQUENCY_OPTIONS_NORMAL = [
  { value: 0, points: 0, label: "Nunca" },
  { value: 1, points: 1, label: "1-4 vezes/mês" },
  { value: 2, points: 2, label: "5-8 vezes/mês" },
  { value: 3, points: 3, label: "9-12 vezes/mês" },
  { value: 4, points: 4, label: "13-18 vezes/mês" },
  { value: 5, points: 5, label: "Mais de 18 vezes/mês" },
];

const FREQUENCY_OPTIONS_REVERSE = [
  { value: 0, points: 5, label: "Nunca" },
  { value: 1, points: 4, label: "1-4 vezes/mês" },
  { value: 2, points: 3, label: "5-8 vezes/mês" },
  { value: 3, points: 2, label: "9-12 vezes/mês" },
  { value: 4, points: 1, label: "13-18 vezes/mês" },
  { value: 5, points: 0, label: "Mais de 18 vezes/mês" },
];

export const DIET_ITEMS = [
  { id: "cereaisNaoRefinados", label: "Com que frequência você consome cereais não-refinados (pão, massa, arroz etc. integrais)?",
    options: FREQUENCY_OPTIONS_NORMAL },
  { id: "batatas", label: "Com que frequência você consome batatas?",
    options: FREQUENCY_OPTIONS_NORMAL },
  { id: "frutas", label: "Com que frequência você consome frutas?",
    options: FREQUENCY_OPTIONS_NORMAL },
  { id: "verduras", label: "Com que frequência você consome verduras?",
    options: FREQUENCY_OPTIONS_NORMAL },
  { id: "legumes", label: "Com que frequência você consome legumes?",
    options: FREQUENCY_OPTIONS_NORMAL },
  { id: "peixe", label: "Com que frequência você consome peixe?",
    options: FREQUENCY_OPTIONS_NORMAL },
  { id: "carneVermelha", label: "Com que frequência você consome carne vermelha e derivados?",
    options: FREQUENCY_OPTIONS_REVERSE },
  { id: "aves", label: "Com que frequência você consome aves?",
    options: FREQUENCY_OPTIONS_REVERSE },
  { id: "leiteIntegral", label: "Com que frequência você consome leite integral e derivados (queijo, iogurte e leite)?",
    options: FREQUENCY_OPTIONS_REVERSE },
  { id: "azeite", label: "Com que frequência você usa azeite de oliva para cozinhar?",
    options: [
      { value: 0, points: 0, label: "Nunca" },
      { value: 1, points: 1, label: "Raramente" },
      { value: 2, points: 2, label: "Menos de 1 vez/semana" },
      { value: 3, points: 3, label: "1 a 3 vezes/semana" },
      { value: 4, points: 4, label: "3 a 5 vezes/semana" },
      { value: 5, points: 5, label: "Diariamente" },
    ] },
  { id: "alcool", label: "Quanto você consome de bebidas alcoólicas (vinho, cerveja etc.) por dia, em média?",
    options: [
      { value: 0, points: 5, label: "Menos que 300 ml" },
      { value: 1, points: 4, label: "300 ml" },
      { value: 2, points: 3, label: "400 ml" },
      { value: 3, points: 2, label: "500 ml" },
      { value: 4, points: 1, label: "600 ml" },
      { value: 5, points: 0, label: "Mais de 700 ml, ou não bebo" },
    ] },
];
// Soma máxima possível: 55 pontos (11 itens x 5)

export const DIET_SCORE_THRESHOLDS = [
  { min: 45, points: 100 },
  { min: 35, points: 80 },
  { min: 23, points: 50 },
  { min: 12, points: 25 },
  { min: 0, points: 0 },
];

export const NICOTINE_OPTIONS = [
  { value: "never", label: "Nunca fumei", points: 100 },
  { value: "quit_5y", label: "Parei de fumar há mais de 5 anos", points: 75 },
  { value: "quit_1_5y", label: "Parei de fumar entre 1 e 5 anos", points: 50 },
  { value: "quit_1y_or_vape", label: "Parei há menos de 1 ano, ou uso cigarro eletrônico", points: 25 },
  { value: "smoker", label: "Fumo atualmente", points: 0 },
];

// Exposição passiva: subtrai 20 pontos se o participante mora com
// fumante(s) em casa (metodologia do protocolo, texto corrido).
// Aplicado sobre o resultado de scoreNicotine, nunca abaixo de zero.
export const SECONDHAND_SMOKE_PENALTY = 20;

export const SLEEP_THRESHOLDS = [
  { min: 7, max: 9, points: 100 },
  { min: 9, max: 10, points: 90 },
  { min: 6, max: 7, points: 70 },
  { min: 5, max: 6, points: 40 },
  { min: 10, max: Infinity, points: 40 },
  { min: 4, max: 5, points: 20 },
  { min: 0, max: 4, points: 0 },
];

export const PHYSICAL_ACTIVITY_THRESHOLDS = [
  { min: 150, max: Infinity, points: 100 },
  { min: 120, max: 150, points: 90 },
  { min: 90, max: 120, points: 80 },
  { min: 60, max: 90, points: 60 },
  { min: 30, max: 60, points: 40 },
  { min: 1, max: 30, points: 20 },
  { min: 0, max: 1, points: 0 },
];

export const BMI_THRESHOLDS = [
  { max: 25, points: 100 },
  { max: 30, points: 70 },
  { max: 35, points: 30 },
  { max: 40, points: 15 },
  { max: Infinity, points: 0 },
];

// Colesterol não-HDL — sujeito a desconto de 20 pontos se em tratamento
export const NON_HDL_THRESHOLDS = [
  { max: 130, points: 100 },
  { max: 160, points: 60 },
  { max: 190, points: 40 },
  { max: 220, points: 20 },
  { max: Infinity, points: 0 },
];

// Glicemia — faixas de FBG do Quadro 5 do protocolo (só glicemia de
// jejum; ramo maxA1c mantido por compatibilidade, sem uso previsto)
export const GLUCOSE_THRESHOLDS = [
  { maxFbg: 100, maxA1c: 5.7, points: 100 },
  { maxFbg: 126, maxA1c: 6.4, points: 60 },
  { maxFbg: 154, maxA1c: 7.0, points: 40 },
  { maxFbg: 170, maxA1c: 8.0, points: 30 },
  { maxFbg: 188, maxA1c: 9.0, points: 20 },
  { maxFbg: 227, maxA1c: 10.0, points: 10 },
  { maxFbg: Infinity, maxA1c: Infinity, points: 0 },
];

export const BLOOD_PRESSURE_THRESHOLDS = [
  { sys: 120, dia: 80, points: 100 },
  { sys: 130, dia: 80, points: 75 },
  { sys: 140, dia: 90, points: 50 },
  { sys: 160, dia: 100, points: 25 },
  { sys: Infinity, dia: Infinity, points: 0 },
];

export const MEDICATION_PENALTY = 20; // pontos descontados se em tratamento (lipídeos e pressão arterial)

export const SCORE_CLASSIFICATION = [
  { max: 49, label: "Baixa", colorToken: "score-low" },
  { max: 79, label: "Moderada", colorToken: "score-mid" },
  { max: 100, label: "Alta", colorToken: "score-high" },
];