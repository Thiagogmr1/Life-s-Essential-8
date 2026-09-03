// src/data/le8Criteria.js

// Baseado em: Lloyd-Jones, D.M. et al. Life's Essential 8: Updating and
// Enhancing the American Heart Association's Construct of Cardiovascular
// Health. Circulation, 2022;146:e18–e43.
//
// LIMITAÇÃO METODOLÓGICA (documentar no TCC):
// O domínio "Dieta" usa um proxy simplificado inspirado nos princípios
// DASH/Mediterrâneo, e NÃO o instrumento validado MEPA (Mediterranean
// Eating Pattern for Americans) usado pela AHA. Reprodução fiel do MEPA
// exigiria validação psicométrica própria, fora do escopo deste TRL5.

export const CATEGORIES = {
    BEHAVIOR: "behavior",
    FACTOR: "factor",
  };
  
  export const LE8_DOMAINS = [
    { id: "diet", order: 1, category: CATEGORIES.BEHAVIOR, label: "Dieta", unit: null,
      description: "Proxy simplificado baseado nos princípios DASH/Mediterrâneo." },
    { id: "physicalActivity", order: 2, category: CATEGORIES.BEHAVIOR, label: "Atividade Física", unit: "min/semana",
      description: "Minutos semanais de atividade física moderada a vigorosa." },
    { id: "nicotineExposure", order: 3, category: CATEGORIES.BEHAVIOR, label: "Exposição ao Tabagismo", unit: null,
      description: "Situação atual em relação ao uso de tabaco/nicotina." },
    { id: "sleep", order: 4, category: CATEGORIES.BEHAVIOR, label: "Sono", unit: "horas/noite",
      description: "Média de horas de sono por noite." },
    { id: "bmi", order: 5, category: CATEGORIES.FACTOR, label: "Índice de Massa Corporal", unit: "kg/m²",
      description: "Calculado a partir de peso e altura informados." },
    { id: "bloodLipids", order: 6, category: CATEGORIES.FACTOR, label: "Colesterol não-HDL", unit: "mg/dL",
      description: "Colesterol total menos o HDL." },
    { id: "bloodGlucose", order: 7, category: CATEGORIES.FACTOR, label: "Glicemia", unit: null,
      description: "Glicemia de jejum (mg/dL) ou hemoglobina glicada (HbA1c %)." },
    { id: "bloodPressure", order: 8, category: CATEGORIES.FACTOR, label: "Pressão Arterial", unit: "mmHg",
      description: "Pressão sistólica e diastólica." },
  ];
  
  // ---- Dieta: itens do proxy (cada um vale 0, 1 ou 2 pontos) ----
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
  
  export const SLEEP_THRESHOLDS = [
    { min: 7, max: 9, points: 100 },
    { min: 9, max: 10, points: 90 },
    { min: 6, max: 7, points: 90 },
    { min: 5, max: 6, points: 70 },
    { min: 10, max: Infinity, points: 70 },
    { min: 4, max: 5, points: 40 },
    { min: 0, max: 4, points: 20 },
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
  
  // Glicemia — jejum (mg/dL) ou HbA1c (%), sujeito a desconto se em tratamento
  export const GLUCOSE_THRESHOLDS = [
    { maxFbg: 100, maxA1c: 5.7, points: 100 },
    { maxFbg: 126, maxA1c: 6.5, points: 60 },
    { maxFbg: Infinity, maxA1c: 7.0, points: 40 },
    { maxFbg: Infinity, maxA1c: 8.0, points: 30 },
    { maxFbg: Infinity, maxA1c: 9.0, points: 20 },
    { maxFbg: Infinity, maxA1c: 10.0, points: 10 },
    { maxFbg: Infinity, maxA1c: Infinity, points: 0 },
  ];
  
  export const BLOOD_PRESSURE_THRESHOLDS = [
    { sys: 120, dia: 80, points: 100 },
    { sys: 130, dia: 80, points: 75 },
    { sys: 140, dia: 90, points: 50 },
    { sys: 160, dia: 100, points: 25 },
    { sys: Infinity, dia: Infinity, points: 0 },
  ];
  
  export const MEDICATION_PENALTY = 20; // pontos descontados se em tratamento
  
  export const SCORE_CLASSIFICATION = [
    { max: 49, label: "Baixa", colorToken: "score-low" },
    { max: 79, label: "Moderada", colorToken: "score-mid" },
    { max: 100, label: "Alta", colorToken: "score-high" },
  ];