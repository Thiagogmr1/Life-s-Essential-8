// frontend/src/utils/scoring.test.js
import { describe, it, expect } from "vitest";
import {
  scoreDiet,
  scorePhysicalActivity,
  scoreNicotine,
  scoreSleep,
  calculateBmi,
  scoreBmi,
  scoreBloodLipids,
  scoreBloodGlucose,
  scoreBloodPressure,
  calculateCompositeScore,
  classifyScore,
  calculateFullAssessment,
  DadosInsuficientesError,
} from "./scoring";

describe("Motor de Cálculo do Life's Essential 8 — Frontend", () => {
  // ============================================================================
  // 1. Dieta (scoreDiet) — Questionário do Mediterrâneo, 11 itens, 0-55 pontos
  // ============================================================================
  describe("scoreDiet", () => {
    it("deve retornar 100 pontos para dieta ideal (55 pontos somados)", () => {
      const answers = {
        cereaisNaoRefinados: 5,
        batatas: 5,
        frutas: 5,
        verduras: 5,
        legumes: 5,
        peixe: 5,
        carneVermelha: 5, // item invertido: "Nunca" = 5 pontos
        aves: 5,
        leiteIntegral: 5,
        azeite: 5,
        alcool: 5, // "menos que 300ml" = 5 pontos
      };
      expect(scoreDiet(answers)).toBe(100);
    });

    it("deve mapear corretamente os pontos para cada faixa de corte (Quadro 3)", () => {
      // scoreDiet só soma o que vier em cada id — não valida contra as
      // opções reais, então os testes de fronteira usam valores
      // arbitrários por item só para fechar o total desejado.
      const answersWithTotal = (total, itemCount = 11) => {
        const ids = [
          "cereaisNaoRefinados", "batatas", "frutas", "verduras", "legumes",
          "peixe", "carneVermelha", "aves", "leiteIntegral", "azeite", "alcool",
        ];
        const answers = {};
        let remaining = total;
        for (let i = 0; i < itemCount; i++) {
          const points = Math.min(5, remaining);
          answers[ids[i]] = points;
          remaining -= points;
        }
        return answers;
      };

      expect(scoreDiet(answersWithTotal(45))).toBe(100); // 45-55 -> 100
      expect(scoreDiet(answersWithTotal(44))).toBe(80); // 35-44 -> 80
      expect(scoreDiet(answersWithTotal(35))).toBe(80);
      expect(scoreDiet(answersWithTotal(34))).toBe(50); // 23-34 -> 50
      expect(scoreDiet(answersWithTotal(23))).toBe(50);
      expect(scoreDiet(answersWithTotal(22))).toBe(25); // 12-22 -> 25
      expect(scoreDiet(answersWithTotal(12))).toBe(25);
      expect(scoreDiet(answersWithTotal(11))).toBe(0); // 0-11 -> 0
      expect(scoreDiet({})).toBe(0);
    });

    it("itens invertidos (carne vermelha, aves, laticínios) pontuam ao contrário da frequência", () => {
      // "Nunca" consumir carne vermelha/aves/laticínios = 5 pontos (bom);
      // consumir "mais de 18x/mês" = 0 pontos (ruim) — oposto dos itens normais.
      const nuncaConsome = { carneVermelha: 5, aves: 5, leiteIntegral: 5 };
      const consomeMuito = { carneVermelha: 0, aves: 0, leiteIntegral: 0 };
      expect(scoreDiet(nuncaConsome)).toBeGreaterThan(scoreDiet(consomeMuito));
    });
  });

  // ============================================================================
  // 2. Atividade Física (scorePhysicalActivity)
  // ============================================================================
  describe("scorePhysicalActivity", () => {
    it("deve atribuir notas de acordo com os minutos de exercício semanais", () => {
      expect(scorePhysicalActivity(200)).toBe(100);
      expect(scorePhysicalActivity(150)).toBe(100);
      expect(scorePhysicalActivity(149)).toBe(90);
      expect(scorePhysicalActivity(120)).toBe(90);
      expect(scorePhysicalActivity(119)).toBe(80);
      expect(scorePhysicalActivity(90)).toBe(80);
      expect(scorePhysicalActivity(89)).toBe(60);
      expect(scorePhysicalActivity(60)).toBe(60);
      expect(scorePhysicalActivity(59)).toBe(40);
      expect(scorePhysicalActivity(30)).toBe(40);
      expect(scorePhysicalActivity(29)).toBe(20);
      expect(scorePhysicalActivity(1)).toBe(20);
      expect(scorePhysicalActivity(0)).toBe(0);
      expect(scorePhysicalActivity(-10)).toBe(0);
    });
  });

  // ============================================================================
  // 3. Nicotina / Tabagismo (scoreNicotine)
  // ============================================================================
  describe("scoreNicotine", () => {
    it("deve retornar a nota exata para cada opção de tabagismo", () => {
      expect(scoreNicotine("never")).toBe(100);
      expect(scoreNicotine("quit_5y")).toBe(75);
      expect(scoreNicotine("quit_1_5y")).toBe(50);
      expect(scoreNicotine("quit_1y_or_vape")).toBe(25);
      expect(scoreNicotine("smoker")).toBe(0);
      expect(scoreNicotine("invalido")).toBe(0);
      expect(scoreNicotine("")).toBe(0);
    });

    // NOVO: cobertura da exposição passiva (não existia nenhum teste antes)
    it("deve descontar 20 pontos por exposição passiva (mora com fumante)", () => {
      expect(scoreNicotine("never", true)).toBe(80); // 100 - 20
      expect(scoreNicotine("quit_5y", true)).toBe(55); // 75 - 20
      expect(scoreNicotine("smoker", true)).toBe(0); // 0 - 20, clamp em 0
      expect(scoreNicotine("never", false)).toBe(100); // sem desconto
    });
  });

  // ============================================================================
  // 4. Sono (scoreSleep)
  // ============================================================================
  describe("scoreSleep", () => {
    it("deve calcular a pontuação respeitando as faixas de horas por noite", () => {
      // 7 <= h < 9 -> 100
      expect(scoreSleep(8)).toBe(100);
      expect(scoreSleep(7)).toBe(100);
      expect(scoreSleep(8.9)).toBe(100);

      // 9 <= h < 10 -> 90
      expect(scoreSleep(9)).toBe(90);
      expect(scoreSleep(9.5)).toBe(90);

      // 6 <= h < 7 -> 70 (corrigido; era 90 no bug anterior)
      expect(scoreSleep(6.5)).toBe(70);
      expect(scoreSleep(6)).toBe(70);

      // 5 <= h < 6 -> 40 (corrigido; era 70 no bug anterior)
      expect(scoreSleep(5.5)).toBe(40);
      expect(scoreSleep(5)).toBe(40);

      // >= 10 -> 40 (corrigido; era 70 no bug anterior)
      expect(scoreSleep(10)).toBe(40);
      expect(scoreSleep(12)).toBe(40);

      // 4 <= h < 5 -> 20 (corrigido; era 40 no bug anterior)
      expect(scoreSleep(4.5)).toBe(20);
      expect(scoreSleep(4)).toBe(20);

      // 0 <= h < 4 -> 0 (corrigido; era 20 no bug anterior, e esse tier nem existia)
      expect(scoreSleep(3)).toBe(0);
      expect(scoreSleep(0)).toBe(0);
    });
  });

  // ============================================================================
  // 5. IMC (calculateBmi e scoreBmi)
  // ============================================================================
  describe("calculateBmi e scoreBmi", () => {
    it("deve calcular o IMC corretamente a partir de peso e altura", () => {
      const bmi = calculateBmi(70, 1.75);
      expect(bmi).toBeCloseTo(22.86, 2);
    });

    it("deve lançar DadosInsuficientesError se peso ou altura faltarem", () => {
      expect(() => calculateBmi(null, 1.75)).toThrow(DadosInsuficientesError);
      expect(() => calculateBmi(70, null)).toThrow(DadosInsuficientesError);
      expect(() => calculateBmi(0, 1.75)).toThrow(DadosInsuficientesError);
      expect(() => calculateBmi(70, 0)).toThrow(DadosInsuficientesError);
    });

    it("deve pontuar o IMC de acordo com as faixas da AHA", () => {
      expect(scoreBmi(22.0)).toBe(100); // < 25
      expect(scoreBmi(24.9)).toBe(100);
      expect(scoreBmi(25.0)).toBe(70); // < 30
      expect(scoreBmi(29.9)).toBe(70);
      expect(scoreBmi(30.0)).toBe(30); // < 35
      expect(scoreBmi(34.9)).toBe(30);
      expect(scoreBmi(35.0)).toBe(15); // < 40
      expect(scoreBmi(39.9)).toBe(15);
      expect(scoreBmi(40.0)).toBe(0); // >= 40
      expect(scoreBmi(48.0)).toBe(0);
    });
  });

  // ============================================================================
  // 6. Colesterol não-HDL (scoreBloodLipids)
  // ============================================================================
  describe("scoreBloodLipids", () => {
    it("deve pontuar corretamente sem medicação", () => {
      expect(scoreBloodLipids(120, false)).toBe(100); // < 130
      expect(scoreBloodLipids(140, false)).toBe(60); // < 160
      expect(scoreBloodLipids(170, false)).toBe(40); // < 190
      expect(scoreBloodLipids(200, false)).toBe(20); // < 220
      expect(scoreBloodLipids(230, false)).toBe(0); // >= 220
    });

    it("deve aplicar penalidade de 20 pontos se fizer uso de medicação", () => {
      expect(scoreBloodLipids(120, true)).toBe(80); // 100 - 20
      expect(scoreBloodLipids(140, true)).toBe(40); // 60 - 20
      expect(scoreBloodLipids(170, true)).toBe(20); // 40 - 20
      expect(scoreBloodLipids(200, true)).toBe(0); // 20 - 20
      expect(scoreBloodLipids(230, true)).toBe(0); // clamp em 0
    });
  });

  // ============================================================================
  // 7. Glicemia (scoreBloodGlucose)
  // ============================================================================
  describe("scoreBloodGlucose", () => {
    it("deve pontuar via glicemia de jejum com e sem medicação (faixas baixas)", () => {
      expect(scoreBloodGlucose({ fastingGlucose: 90, isOnMedication: false })).toBe(100);
      expect(scoreBloodGlucose({ fastingGlucose: 90, isOnMedication: true })).toBe(80);
      expect(scoreBloodGlucose({ fastingGlucose: 110, isOnMedication: false })).toBe(60);
      expect(scoreBloodGlucose({ fastingGlucose: 110, isOnMedication: true })).toBe(40);
    });

    // NOVO: cobertura acima de 126 mg/dL — era exatamente a zona onde o
    // bug do maxFbg=Infinity em cascata escondia o problema. Antes,
    // TODOS esses casos retornavam 40.
    it("deve pontuar via glicemia de jejum em todas as faixas acima de 126 mg/dL", () => {
      expect(scoreBloodGlucose({ fastingGlucose: 140, isOnMedication: false })).toBe(40); // 126-153
      expect(scoreBloodGlucose({ fastingGlucose: 160, isOnMedication: false })).toBe(30); // 154-169
      expect(scoreBloodGlucose({ fastingGlucose: 180, isOnMedication: false })).toBe(20); // 170-187
      expect(scoreBloodGlucose({ fastingGlucose: 200, isOnMedication: false })).toBe(10); // 188-226
      expect(scoreBloodGlucose({ fastingGlucose: 230, isOnMedication: false })).toBe(0); // >= 227
    });

    it("deve pontuar via HbA1c com todas as faixas", () => {
      expect(scoreBloodGlucose({ hba1c: 5.4 })).toBe(100);
      expect(scoreBloodGlucose({ hba1c: 6.0 })).toBe(60);
      // NOVO: caso de fronteira 6.4 vs 6.5 — o corte correto do
      // protocolo é 6.4%, não 6.5% (valor antigo era inconsistente
      // com o Quadro 5)
      expect(scoreBloodGlucose({ hba1c: 6.4 })).toBe(60);
      expect(scoreBloodGlucose({ hba1c: 6.45 })).toBe(40);
      expect(scoreBloodGlucose({ hba1c: 6.8 })).toBe(40);
      expect(scoreBloodGlucose({ hba1c: 7.5 })).toBe(30);
      expect(scoreBloodGlucose({ hba1c: 8.5 })).toBe(20);
      expect(scoreBloodGlucose({ hba1c: 9.5 })).toBe(10);
      expect(scoreBloodGlucose({ hba1c: 11.0 })).toBe(0);
      expect(scoreBloodGlucose({ hba1c: 11.0, isOnMedication: true })).toBe(0); // clamp em 0
    });

    it("deve dar precedência à HbA1c quando ambos são informados", () => {
      expect(
        scoreBloodGlucose({
          fastingGlucose: 90,
          hba1c: 6.8,
          isOnMedication: false,
        })
      ).toBe(40);
    });
  });

  // ============================================================================
  // 8. Pressão Arterial (scoreBloodPressure)
  // ============================================================================
  describe("scoreBloodPressure", () => {
    it("deve pontuar com base nos patamares sistólico e diastólico, sem medicação", () => {
      expect(scoreBloodPressure(115, 75)).toBe(100); // < 120 e < 80
      expect(scoreBloodPressure(120, 75)).toBe(75); // sys >= 120
      expect(scoreBloodPressure(125, 78)).toBe(75);
      expect(scoreBloodPressure(135, 85)).toBe(50); // < 140 e < 90
      expect(scoreBloodPressure(125, 85)).toBe(50); // dia >= 80
      expect(scoreBloodPressure(150, 95)).toBe(25); // < 160 e < 100
      expect(scoreBloodPressure(170, 105)).toBe(0); // >= 160 ou >= 100
      expect(scoreBloodPressure(170, 75)).toBe(0); // sys >= 160
    });

    // NOVO: cobertura do desconto por tratamento anti-hipertensivo —
    // não existia nenhum teste antes, e o parâmetro nem existia na função.
    it("deve aplicar penalidade de 20 pontos se em tratamento anti-hipertensivo", () => {
      expect(scoreBloodPressure(115, 75, true)).toBe(80); // 100 - 20
      expect(scoreBloodPressure(125, 78, true)).toBe(55); // 75 - 20
      expect(scoreBloodPressure(135, 85, true)).toBe(30); // 50 - 20
      expect(scoreBloodPressure(150, 95, true)).toBe(5); // 25 - 20
      expect(scoreBloodPressure(170, 105, true)).toBe(0); // clamp em 0
    });
  });

  // ============================================================================
  // 9. Score Composto e Classificação
  // ============================================================================
  describe("calculateCompositeScore e classifyScore", () => {
    it("deve calcular a média aritmética e arredondar", () => {
      const all100 = {
        diet: 100,
        physicalActivity: 100,
        nicotineExposure: 100,
        sleep: 100,
        bmi: 100,
        bloodLipids: 100,
        bloodGlucose: 100,
        bloodPressure: 100,
      };
      expect(calculateCompositeScore(all100)).toBe(100);

      const mixed = {
        diet: 80,
        physicalActivity: 60,
        nicotineExposure: 100,
        sleep: 90,
        bmi: 70,
        bloodLipids: 60,
        bloodGlucose: 80,
        bloodPressure: 75,
      };
      // Soma: 615 / 8 = 76.875 -> 77
      expect(calculateCompositeScore(mixed)).toBe(77);
    });

    it("deve classificar adequadamente nas faixas Baixa, Moderada e Alta", () => {
      expect(classifyScore(0).label).toBe("Baixa");
      expect(classifyScore(49).label).toBe("Baixa");
      expect(classifyScore(50).label).toBe("Moderada");
      expect(classifyScore(79).label).toBe("Moderada");
      expect(classifyScore(80).label).toBe("Alta");
      expect(classifyScore(100).label).toBe("Alta");
    });
  });

  // ============================================================================
  // 10. Avaliação Completa de Ponta a Ponta (calculateFullAssessment)
  // ============================================================================
  describe("calculateFullAssessment", () => {
    it("deve processar uma avaliação completa sem erros", () => {
      const rawAnswers = {
        weightKg: 65,
        heightM: 1.75,
        diet: {
          cereaisNaoRefinados: 5,
          batatas: 5,
          frutas: 5,
          verduras: 5,
          legumes: 5,
          peixe: 5,
          carneVermelha: 5,
          aves: 5,
          leiteIntegral: 5,
          azeite: 5,
          alcool: 5,
        },
        physicalActivityMinutes: 180,
        nicotineStatus: "never",
        livesWithSmoker: false,
        sleepHours: 8,
        nonHdlCholesterol: 110,
        lipidsMedication: false,
        fastingGlucose: 85,
        glucoseMedication: false,
        systolic: 115,
        diastolic: 75,
        bloodPressureMedication: false,
      };

      const result = calculateFullAssessment(rawAnswers);
      expect(result.bmi).toBeCloseTo(21.22, 2);
      expect(result.domainScores.diet).toBe(100);
      expect(result.domainScores.physicalActivity).toBe(100);
      expect(result.domainScores.nicotineExposure).toBe(100);
      expect(result.domainScores.sleep).toBe(100);
      expect(result.domainScores.bmi).toBe(100);
      expect(result.domainScores.bloodLipids).toBe(100);
      expect(result.domainScores.bloodGlucose).toBe(100);
      expect(result.domainScores.bloodPressure).toBe(100);
      expect(result.compositeScore).toBe(100);
      expect(result.classification.label).toBe("Alta");
    });

    it("deve propagar DadosInsuficientesError quando peso ou altura faltarem", () => {
      expect(() =>
        calculateFullAssessment({
          weightKg: null,
          heightM: 1.75,
        })
      ).toThrow(DadosInsuficientesError);
    });

    // NOVO: cobertura de ponta a ponta com os campos de desconto ativos
    it("deve aplicar todos os descontos (fumante passivo, medicação PA/lipídeos/glicemia) no fluxo completo", () => {
      const rawAnswers = {
        weightKg: 65,
        heightM: 1.75,
        diet: {},
        physicalActivityMinutes: 0,
        nicotineStatus: "never",
        livesWithSmoker: true,
        sleepHours: 8,
        nonHdlCholesterol: 110,
        lipidsMedication: true,
        fastingGlucose: 85,
        glucoseMedication: true,
        systolic: 115,
        diastolic: 75,
        bloodPressureMedication: true,
      };

      const result = calculateFullAssessment(rawAnswers);
      expect(result.domainScores.nicotineExposure).toBe(80); // 100 - 20 (passivo)
      expect(result.domainScores.bloodLipids).toBe(80); // 100 - 20 (medicação)
      expect(result.domainScores.bloodGlucose).toBe(80); // 100 - 20 (medicação)
      expect(result.domainScores.bloodPressure).toBe(80); // 100 - 20 (medicação)
    });
  });
});