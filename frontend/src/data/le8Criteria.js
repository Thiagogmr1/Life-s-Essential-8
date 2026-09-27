// src/data/le8Criteria.js

// Baseado em: Lloyd-Jones, D.M. et al. Life's Essential 8: Updating and
// Enhancing the American Heart Association's Construct of Cardiovascular
// Health. Circulation, 2022;146:e18–e43.
//
// Adaptado conforme o protocolo do grupo de pesquisa (proposta CNPq
// 2025, Quadros 1, 2, 3, 4 e 5): este projeto usa apenas glicemia de
// jejum (não HbA1c) para o domínio Glicemia, e o questionário de
// frequência alimentar da dieta do Mediterrâneo adaptado (Panagiotakos
// et al., 2006) para o domínio Dieta.
//
// LIMITAÇÃO METODOLÓGICA (documentar no TCC):
// O domínio "Dieta" implementado abaixo (DIET_ITEMS, 8 perguntas, 0-16
// pontos) é um PROXY SIMPLIFICADO inspirado nos princípios DASH/
// Mediterrâneo — NÃO é o instrumento validado de 11 itens (0-55 pontos)
// que consta no protocolo do grupo (Quadro 3, Panagiotakos et al.,
// 2006). Reprodução fiel do instrumento validado ainda está pendente de
// implementação. Ver DIET_SCORE_THRESHOLDS abaixo para os dois mapeamentos.

export const CATEGORIES = {
  BEHAVIOR: "behavior",
  FACTOR: "factor",
};

export const LE8_DOMAINS = [
  { id: "diet", order: 1, category: CATEGORIES.BEHAVIOR, label: "Dieta", unit: null,
    description: "Proxy simplificado baseado nos princípios DASH/Mediterrâneo (ver limitação metodológica no topo do arquivo)." },
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

// ---- Dieta: itens do proxy simplificado (cada um vale 0, 1 ou 2 pontos) ----
// ATENÇÃO: ver limitação metodológica no topo do arquivo — isto NÃO é
// o instrumento de 11 itens do protocolo (Quadro 3). Mantido como está
// até decisão do grupo sobre substituir pelo questionário validado.
export const DIET_ITEMS = [
  { id: "fruitsVeggies", label: "Quantas porções de frutas e vegetais você consome por dia?",
    options: [{ value: 2, points: 2, label: "4 ou mais" }, { value: 1, points: 1, label: "2-3" }, { value: 0, points: 0, label: "0-1" }] },
  { id: "wholeGrains", label: "Com que frequência você consome grãos integrais (aveia, arroz integral, pão integral)?",
    options: [{ value: 2, points: 2, label: "Diariamente" }, { value: 1, points: 1, label: "Algumas vezes por semana" }, { value: 0, points: 0, label: "Raramente" }] },
  { id: "fish", label: "Com que frequência você consome peixe?",
    options: [{ value: 2, points: 2, label: "2x ou mais por semana" }, { value: 1, points: 1, label: "1x por semana" }, { value: 0, points: 0, label: "Quase nunca" }] },
  { id: "sodium", label: "Você costuma adicionar sal extra às refeições ou consumir alimentos ultraprocessados?",
    options: [{ value: 2, points: 2, label: "Raramente" }, { value: 1, points: 1, label: "Às vezes" }, { value: 0, points: 0, label: "Frequentemente" }] },
  { id: "sugaryDrinks", label: "Com que frequência você consome bebidas açucaradas (refrigerante, suco industrializado)?",
    options: [{ value: 2, points: 2, label: "Raramente ou nunca" }, { value: 1, points: 1, label: "Algumas vezes por semana" }, { value: 0, points: 0, label: "Diariamente" }] },
  { id: "redMeat", label: "Com que frequência você consome carne vermelha ou processada (embutidos)?",
    options: [{ value: 2, points: 2, label: "Raramente" }, { value: 1, points: 1, label: "Algumas vezes por semana" }, { value: 0, points: 0, label: "Diariamente" }] },
  { id: "nutsLegumes", label: "Com que frequência você consome castanhas, nozes ou leguminosas (feijão, lentilha, grão de bico)?",
    options: [{ value: 2, points: 2, label: "Quase todos os dias" }, { value: 1, points: 1, label: "Algumas vezes por semana" }, { value: 0, points: 0, label: "Raramente" }] },
  { id: "fatType", label: "Que tipo de gordura você mais usa para cozinhar?",
    options: [{ value: 2, points: 2, label: "Azeite de oliva" }, { value: 1, points: 1, label: "Óleo vegetal comum" }, { value: 0, points: 0, label: "Manteiga / banha / gordura animal" }] },
];
// Soma máxima possível: 16 pontos (8 itens x 2)

export const DIET_SCORE_THRESHOLDS = [
  { min: 15, points: 100 },
  { min: 12, points: 80 },
  { min: 8, points: 50 },
  { min: 4, points: 25 },
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
// fumante(s) em casa (metodologia do protocolo, texto corrido — não
// estava em nenhuma tabela). Aplicado sobre o resultado de scoreNicotine,
// nunca abaixo de zero.
export const SECONDHAND_SMOKE_PENALTY = 20;

// CORRIGIDO: as faixas de 6-7h e 9-10h estavam com a mesma pontuação
// (90), e 5-6h/≥10h estavam em 70 em vez de 40 — deslocamento de um
// tier inteiro. Faltava também o tier de 0 pontos para <4h.
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

// CORRIGIDO: maxFbg era Infinity a partir do 3º tier — qualquer
// glicemia de jejum >= 126 caía sempre em 40 pontos, nunca alcançando
// 30/20/10/0. Agora usa as faixas reais de FBG do Quadro 5 do
// protocolo (que usa só glicemia de jejum, sem HbA1c). Mantido o
// ramo maxA1c por compatibilidade, com o corte de pré-diabetes
// corrigido de 6.5 para 6.4 (era inconsistente com o Quadro 5).
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