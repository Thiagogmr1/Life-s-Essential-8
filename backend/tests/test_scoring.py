# backend/tests/test_scoring.py
import pytest
from app.scoring import (
    clamp,
    score_diet,
    score_physical_activity,
    score_nicotine,
    score_sleep,
    calculate_bmi,
    score_bmi,
    score_blood_lipids,
    score_blood_glucose,
    score_blood_pressure,
    calculate_composite_score,
    classify_score,
    calculate_full_assessment,
    DadosInsuficientesError,
)


# ==============================================================================
# 0. Testes da Função Utilitária Clamp
# ==============================================================================
def test_clamp_within_range():
    assert clamp(50, 0, 100) == 50


def test_clamp_below_min():
    assert clamp(-15, 0, 100) == 0


def test_clamp_above_max():
    assert clamp(120, 0, 100) == 100


# ==============================================================================
# 1. Testes do Domínio: Dieta (score_diet)
# ==============================================================================
def test_score_diet_ideal():
    # 8 itens com nota 2 = 16 pontos (>= 15 -> 100)
    answers = {
        "fruitsVeggies": 2,
        "wholeGrains": 2,
        "fish": 2,
        "sodium": 2,
        "sugaryDrinks": 2,
        "redMeat": 2,
        "nutsLegumes": 2,
        "fatType": 2,
    }
    assert score_diet(answers) == 100


def test_score_diet_thresholds():
    # min 15 -> 100 pontos
    assert score_diet({"fruitsVeggies": 2, "wholeGrains": 2, "fish": 2, "sodium": 2, "sugaryDrinks": 2, "redMeat": 2, "nutsLegumes": 2, "fatType": 1}) == 100  # soma 15
    # min 12 -> 80 pontos (soma 12, 13, 14)
    assert score_diet({"fruitsVeggies": 2, "wholeGrains": 2, "fish": 2, "sodium": 2, "sugaryDrinks": 2, "redMeat": 2}) == 80  # soma 12
    # min 8 -> 50 pontos (soma 8 a 11)
    assert score_diet({"fruitsVeggies": 2, "wholeGrains": 2, "fish": 2, "sodium": 2}) == 50  # soma 8
    # min 4 -> 25 pontos (soma 4 a 7)
    assert score_diet({"fruitsVeggies": 2, "wholeGrains": 2}) == 25  # soma 4
    # min 0 -> 0 pontos (soma < 4)
    assert score_diet({"fruitsVeggies": 1}) == 0  # soma 1
    assert score_diet({}) == 0  # vazio


# ==============================================================================
# 2. Testes do Domínio: Atividade Física (score_physical_activity)
# ==============================================================================
@pytest.mark.parametrize(
    "minutes, expected_points",
    [
        (200, 100),
        (150, 100),
        (149, 90),
        (120, 90),
        (119, 80),
        (90, 80),
        (89, 60),
        (60, 60),
        (59, 40),
        (30, 40),
        (29, 20),
        (1, 20),
        (0, 0),
        (-5, 0),
    ],
)
def test_score_physical_activity_thresholds(minutes, expected_points):
    assert score_physical_activity(minutes) == expected_points


# ==============================================================================
# 3. Testes do Domínio: Nicotina / Tabagismo (score_nicotine)
# ==============================================================================
@pytest.mark.parametrize(
    "option, expected_points",
    [
        ("never", 100),
        ("quit_5y", 75),
        ("quit_1_5y", 50),
        ("quit_1y_or_vape", 25),
        ("smoker", 0),
        ("opcao_invalida", 0),
        ("", 0),
    ],
)
def test_score_nicotine_options(option, expected_points):
    assert score_nicotine(option) == expected_points


# ==============================================================================
# 4. Testes do Domínio: Sono (score_sleep)
# ==============================================================================
@pytest.mark.parametrize(
    "hours, expected_points",
    [
        (8.0, 100),   # 7 <= h < 9
        (7.0, 100),
        (8.9, 100),
        (9.0, 90),    # 9 <= h < 10
        (9.5, 90),
        (6.5, 90),    # 6 <= h < 7
        (6.0, 90),
        (5.5, 70),    # 5 <= h < 6
        (5.0, 70),
        (10.0, 70),   # >= 10
        (12.0, 70),
        (4.5, 40),    # 4 <= h < 5
        (4.0, 40),
        (3.0, 20),    # 0 <= h < 4
        (0.0, 20),
    ],
)
def test_score_sleep_thresholds(hours, expected_points):
    assert score_sleep(hours) == expected_points


# ==============================================================================
# 5. Testes do Domínio: IMC (calculate_bmi e score_bmi)
# ==============================================================================
def test_calculate_bmi_success():
    # 70 kg, 1.75 m -> 70 / (1.75^2) = 22.857...
    bmi = calculate_bmi(70, 1.75)
    assert round(bmi, 2) == 22.86


def test_calculate_bmi_missing_values():
    with pytest.raises(DadosInsuficientesError):
        calculate_bmi(None, 1.75)
    with pytest.raises(DadosInsuficientesError):
        calculate_bmi(70, None)
    with pytest.raises(DadosInsuficientesError):
        calculate_bmi(0, 1.75)
    with pytest.raises(DadosInsuficientesError):
        calculate_bmi(70, 0)


@pytest.mark.parametrize(
    "bmi, expected_points",
    [
        (22.0, 100),  # < 25
        (24.9, 100),
        (25.0, 70),   # < 30
        (29.9, 70),
        (30.0, 30),   # < 35
        (34.9, 30),
        (35.0, 15),   # < 40
        (39.9, 15),
        (40.0, 0),    # >= 40
        (45.0, 0),
    ],
)
def test_score_bmi_thresholds(bmi, expected_points):
    assert score_bmi(bmi) == expected_points


# ==============================================================================
# 6. Testes do Domínio: Colesterol não-HDL (score_blood_lipids)
# ==============================================================================
@pytest.mark.parametrize(
    "non_hdl, on_medication, expected_points",
    [
        (120, False, 100),  # < 130
        (120, True, 80),    # 100 - 20 (penalidade)
        (140, False, 60),   # < 160
        (140, True, 40),    # 60 - 20
        (170, False, 40),   # < 190
        (170, True, 20),    # 40 - 20
        (200, False, 20),   # < 220
        (200, True, 0),     # 20 - 20
        (230, False, 0),    # >= 220
        (230, True, 0),     # 0 - 20 = 0 (graças ao clamp)
    ],
)
def test_score_blood_lipids_thresholds(non_hdl, on_medication, expected_points):
    assert score_blood_lipids(non_hdl, is_on_medication=on_medication) == expected_points


# ==============================================================================
# 7. Testes do Domínio: Glicemia (score_blood_glucose)
# ==============================================================================
def test_score_blood_glucose_fasting():
    # Via glicemia de jejum (< 100 -> 100 pts)
    assert score_blood_glucose(fasting_glucose=90, hba1c=None, is_on_medication=False) == 100
    assert score_blood_glucose(fasting_glucose=90, hba1c=None, is_on_medication=True) == 80  # 100 - 20
    # < 126 -> 60 pts
    assert score_blood_glucose(fasting_glucose=110, hba1c=None, is_on_medication=False) == 60
    assert score_blood_glucose(fasting_glucose=110, hba1c=None, is_on_medication=True) == 40  # 60 - 20


def test_score_blood_glucose_hba1c():
    # Via HbA1c (< 5.7 -> 100 pts)
    assert score_blood_glucose(fasting_glucose=None, hba1c=5.4, is_on_medication=False) == 100
    # < 6.5 -> 60 pts
    assert score_blood_glucose(fasting_glucose=None, hba1c=6.0, is_on_medication=False) == 60
    # < 7.0 -> 40 pts
    assert score_blood_glucose(fasting_glucose=None, hba1c=6.8, is_on_medication=False) == 40
    # < 8.0 -> 30 pts
    assert score_blood_glucose(fasting_glucose=None, hba1c=7.5, is_on_medication=False) == 30
    # < 9.0 -> 20 pts
    assert score_blood_glucose(fasting_glucose=None, hba1c=8.5, is_on_medication=False) == 20
    # < 10.0 -> 10 pts
    assert score_blood_glucose(fasting_glucose=None, hba1c=9.5, is_on_medication=False) == 10
    # >= 10.0 -> 0 pts
    assert score_blood_glucose(fasting_glucose=None, hba1c=11.0, is_on_medication=False) == 0
    # Com medicação e clamp em 0
    assert score_blood_glucose(fasting_glucose=None, hba1c=11.0, is_on_medication=True) == 0


def test_score_blood_glucose_precedence():
    # Quando ambos são informados, HbA1c tem precedência
    assert score_blood_glucose(fasting_glucose=90, hba1c=6.8, is_on_medication=False) == 40


# ==============================================================================
# 8. Testes do Domínio: Pressão Arterial (score_blood_pressure)
# ==============================================================================
@pytest.mark.parametrize(
    "sys, dia, expected_points",
    [
        (115, 75, 100),  # < 120 e < 80
        (120, 75, 75),   # sys >= 120, cai pra < 130 e < 80
        (125, 78, 75),
        (135, 85, 50),   # < 140 e < 90
        (125, 85, 50),   # dia >= 80, cai pra < 90
        (150, 95, 25),   # < 160 e < 100
        (170, 105, 0),   # >= 160 ou >= 100
        (170, 75, 0),    # sys >= 160
    ],
)
def test_score_blood_pressure_thresholds(sys, dia, expected_points):
    assert score_blood_pressure(sys, dia) == expected_points


# ==============================================================================
# 9. Testes de Agregação: Score Composto e Classificação
# ==============================================================================
def test_calculate_composite_score():
    domain_scores = {
        "diet": 100,
        "physicalActivity": 100,
        "nicotineExposure": 100,
        "sleep": 100,
        "bmi": 100,
        "bloodLipids": 100,
        "bloodGlucose": 100,
        "bloodPressure": 100,
    }
    assert calculate_composite_score(domain_scores) == 100

    heterogeneous_scores = {
        "diet": 80,
        "physicalActivity": 60,
        "nicotineExposure": 100,
        "sleep": 90,
        "bmi": 70,
        "bloodLipids": 60,
        "bloodGlucose": 80,
        "bloodPressure": 75,
    }
    # Soma: 80+60+100+90+70+60+80+75 = 615. 615 / 8 = 76.875 -> arredonda para 77
    assert calculate_composite_score(heterogeneous_scores) == 77


@pytest.mark.parametrize(
    "score, expected_label",
    [
        (0, "baixa"),
        (49, "baixa"),
        (50, "moderada"),
        (79, "moderada"),
        (80, "alta"),
        (100, "alta"),
    ],
)
def test_classify_score(score, expected_label):
    assert classify_score(score) == expected_label


# ==============================================================================
# 10. Teste de Avaliação Completa de Ponta a Ponta (calculate_full_assessment)
# ==============================================================================
def test_calculate_full_assessment_ideal_profile():
    raw_answers = {
        "weightKg": 65,
        "heightM": 1.75,
        "diet": {
            "fruitsVeggies": 2,
            "wholeGrains": 2,
            "fish": 2,
            "sodium": 2,
            "sugaryDrinks": 2,
            "redMeat": 2,
            "nutsLegumes": 2,
            "fatType": 2,
        },
        "physicalActivityMinutes": 180,
        "nicotineStatus": "never",
        "sleepHours": 8,
        "nonHdlCholesterol": 110,
        "lipidsMedication": False,
        "fastingGlucose": 85,
        "glucoseMedication": False,
        "systolic": 115,
        "diastolic": 75,
    }

    result = calculate_full_assessment(raw_answers)
    assert round(result["bmi"], 2) == 21.22
    assert result["domain_scores"]["diet"] == 100
    assert result["domain_scores"]["physicalActivity"] == 100
    assert result["domain_scores"]["nicotineExposure"] == 100
    assert result["domain_scores"]["sleep"] == 100
    assert result["domain_scores"]["bmi"] == 100
    assert result["domain_scores"]["bloodLipids"] == 100
    assert result["domain_scores"]["bloodGlucose"] == 100
    assert result["domain_scores"]["bloodPressure"] == 100
    assert result["composite_score"] == 100
    assert result["classification"] == "alta"


def test_calculate_full_assessment_missing_bmi_raises_error():
    raw_answers = {
        "weightKg": None,
        "heightM": 1.75,
    }
    with pytest.raises(DadosInsuficientesError):
        calculate_full_assessment(raw_answers)
