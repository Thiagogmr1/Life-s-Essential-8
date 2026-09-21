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
  // 1. Dieta (scoreDiet)
  // ============================================================================
  describe("scoreDiet", () => {
    it("deve retornar 100 pontos para dieta ideal (16 pontos somados)", () => {
      const answers = {
        fruitsVeggies: 2,
        wholeGrains: 2,
        fish: 2,
        sodium: 2,
        sugaryDrinks: 2,
        redMeat: 2,
        nutsLegumes: 2,
        fatType: 2,
      };
      expect(scoreDiet(answers)).toBe(100);
    });

    it("deve mapear corretamente os pontos para cada faixa de corte", () => {
      // 15 pontos -> 100
      expect(
        scoreDiet({
          fruitsVeggies: 2,
          wholeGrains: 2,
          fish: 2,
          sodium: 2,
          sugaryDrinks: 2,
          redMeat: 2,
          nutsLegumes: 2,
          fatType: 1,
        })
      ).toBe(100);

      // 12 pontos -> 80
      expect(
        scoreDiet({
          fruitsVeggies: 2,
          wholeGrains: 2,
          fish: 2,
          sodium: 2,
          sugaryDrinks: 2,
          redMeat: 2,
        })
      ).toBe(80);

      // 8 pontos -> 50
      expect(
        scoreDiet({
          fruitsVeggies: 2,
          wholeGrains: 2,
          fish: 2,
          sodium: 2,
        })
      ).toBe(50);

      // 4 pontos -> 25
      expect(
        scoreDiet({
          fruitsVeggies: 2,
          wholeGrains: 2,
        })
      ).toBe(25);

      // < 4 pontos -> 0
      expect(scoreDiet({ fruitsVeggies: 1 })).toBe(0);
      expect(scoreDiet({})).toBe(0);
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
  });

  // ============================================================================
  // 4. Sono (scoreSleep)
  // ============================================================================
  describe("scoreSleep", () => {
    it("deve calcular a pontuação respeitando a ordem e faixas de horas por noite", () => {
      // 7 <= h < 9 -> 100
      expect(scoreSleep(8)).toBe(100);
      expect(scoreSleep(7)).toBe(100);
      expect(scoreSleep(8.9)).toBe(100);

      // 9 <= h < 10 -> 90
      expect(scoreSleep(9)).toBe(90);
      expect(scoreSleep(9.5)).toBe(90);

      // 6 <= h < 7 -> 90
      expect(scoreSleep(6.5)).toBe(90);
      expect(scoreSleep(6)).toBe(90);

      // 5 <= h < 6 -> 70
      expect(scoreSleep(5.5)).toBe(70);
      expect(scoreSleep(5)).toBe(70);

      // >= 10 -> 70
      expect(scoreSleep(10)).toBe(70);
      expect(scoreSleep(12)).toBe(70);

      // 4 <= h < 5 -> 40
      expect(scoreSleep(4.5)).toBe(40);
      expect(scoreSleep(4)).toBe(40);

      // 0 <= h < 4 -> 20
      expect(scoreSleep(3)).toBe(20);
      expect(scoreSleep(0)).toBe(20);
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
    it("deve pontuar via glicemia de jejum com e sem medicação", () => {
      expect(scoreBloodGlucose({ fastingGlucose: 90, isOnMedication: false })).toBe(100);
      expect(scoreBloodGlucose({ fastingGlucose: 90, isOnMedication: true })).toBe(80);
      expect(scoreBloodGlucose({ fastingGlucose: 110, isOnMedication: false })).toBe(60);
      expect(scoreBloodGlucose({ fastingGlucose: 110, isOnMedication: true })).toBe(40);
    });

    it("deve pontuar via HbA1c com todas as faixas", () => {
      expect(scoreBloodGlucose({ hba1c: 5.4 })).toBe(100);
      expect(scoreBloodGlucose({ hba1c: 6.0 })).toBe(60);
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
    it("deve pontuar com base nos patamares sistólico e diastólico", () => {
      expect(scoreBloodPressure(115, 75)).toBe(100); // < 120 e < 80
      expect(scoreBloodPressure(120, 75)).toBe(75); // sys >= 120
      expect(scoreBloodPressure(125, 78)).toBe(75);
      expect(scoreBloodPressure(135, 85)).toBe(50); // < 140 e < 90
      expect(scoreBloodPressure(125, 85)).toBe(50); // dia >= 80
      expect(scoreBloodPressure(150, 95)).toBe(25); // < 160 e < 100
      expect(scoreBloodPressure(170, 105)).toBe(0); // >= 160 ou >= 100
      expect(scoreBloodPressure(170, 75)).toBe(0); // sys >= 160
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
          fruitsVeggies: 2,
          wholeGrains: 2,
          fish: 2,
          sodium: 2,
          sugaryDrinks: 2,
          redMeat: 2,
          nutsLegumes: 2,
          fatType: 2,
        },
        physicalActivityMinutes: 180,
        nicotineStatus: "never",
        sleepHours: 8,
        nonHdlCholesterol: 110,
        lipidsMedication: false,
        fastingGlucose: 85,
        glucoseMedication: false,
        systolic: 115,
        diastolic: 75,
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
  });
});
