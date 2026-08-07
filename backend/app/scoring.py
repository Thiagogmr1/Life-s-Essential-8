# backend/app/scoring.py
"""
Motor de cálculo do Life's Essential 8 — espelha src/utils/scoring.js.

Diferente do front-end, este módulo é a FONTE DA VERDADE dos scores
salvos no banco. O front pode continuar calculando localmente (para
feedback instantâneo na UI), mas o que é persistido vem sempre daqui.
"""
from app.le8_criteria import (
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
)


class DadosInsuficientesError(ValueError):
    """Levantado quando um campo obrigatório para o cálculo está ausente."""


def clamp(value: float, min_value: float = 0, max_value: float = 100) -> float:
    return min(max_value, max(min_value, value))


def score_diet(answers: dict) -> int:
    total = sum((answers.get(item["id"]) or 0) for item in DIET_ITEMS)
    tier = next((t for t in DIET_SCORE_THRESHOLDS if total >= t["min"]), None)
    return tier["points"] if tier else 0


def score_physical_activity(minutes_per_week: float) -> int:
    tier = next(
        (t for t in PHYSICAL_ACTIVITY_THRESHOLDS if t["min"] <= minutes_per_week < t["max"]),
        None,
    )
    return tier["points"] if tier else 0


def score_nicotine(option_value: str) -> int:
    opt = next((o for o in NICOTINE_OPTIONS if o["value"] == option_value), None)
    return opt["points"] if opt else 0


def score_sleep(hours_per_night: float) -> int:
    # A ordem de SLEEP_THRESHOLDS é significativa — não reordenar.
    tier = next(
        (t for t in SLEEP_THRESHOLDS if t["min"] <= hours_per_night < t["max"]),
        None,
    )
    return tier["points"] if tier else 0


def calculate_bmi(weight_kg: float | None, height_m: float | None) -> float:
    # Diferente do front (que retorna None e deixa isso "vazar" pro
    # cálculo seguinte, gerando 100 pontos indevidos — ver bug reportado),
    # aqui peso e altura são OBRIGATÓRIOS para o cálculo.
    if not weight_kg or not height_m:
        raise DadosInsuficientesError("Peso e altura são obrigatórios para calcular o IMC")
    return weight_kg / (height_m ** 2)


def score_bmi(bmi: float) -> int:
    tier = next((t for t in BMI_THRESHOLDS if bmi < t["max"]), None)
    return tier["points"] if tier else 0


def score_blood_lipids(non_hdl_mg_dl: float, is_on_medication: bool = False) -> int:
    tier = next((t for t in NON_HDL_THRESHOLDS if non_hdl_mg_dl < t["max"]), None)
    base = tier["points"] if tier else 0
    return clamp(base - MEDICATION_PENALTY) if is_on_medication else base


def score_blood_glucose(
    fasting_glucose: float | None,
    hba1c: float | None,
    is_on_medication: bool = False,
) -> int:
    def matches(t):
        if hba1c is not None:
            return hba1c < t["max_a1c"]
        if fasting_glucose is not None:
            return fasting_glucose < t["max_fbg"]
        return False

    tier = next((t for t in GLUCOSE_THRESHOLDS if matches(t)), None)
    base = tier["points"] if tier else 0
    return clamp(base - MEDICATION_PENALTY) if is_on_medication else base


def score_blood_pressure(systolic: float, diastolic: float) -> int:
    tier = next(
        (t for t in BLOOD_PRESSURE_THRESHOLDS if systolic < t["sys"] and diastolic < t["dia"]),
        None,
    )
    return tier["points"] if tier else 0


def calculate_composite_score(domain_scores: dict) -> int:
    values = list(domain_scores.values())
    return round(sum(values) / len(values))


def classify_score(composite_score: int) -> str:
    tier = next((t for t in SCORE_CLASSIFICATION if composite_score <= t["max"]), None)
    return tier["label"] if tier else SCORE_CLASSIFICATION[-1]["label"]


def calculate_full_assessment(raw_answers: dict) -> dict:
    """
    Recebe respostas_brutas (mesmo formato que o front envia) e devolve
    o resultado completo: bmi, os 8 scores de domínio, score composto
    e classificação. Levanta DadosInsuficientesError se faltar campo
    obrigatório.
    """
    bmi = calculate_bmi(raw_answers.get("weightKg"), raw_answers.get("heightM"))

    domain_scores = {
        "diet": score_diet(raw_answers.get("diet", {})),
        "physicalActivity": score_physical_activity(raw_answers.get("physicalActivityMinutes", 0)),
        "nicotineExposure": score_nicotine(raw_answers.get("nicotineStatus")),
        "sleep": score_sleep(raw_answers.get("sleepHours", 0)),
        "bmi": score_bmi(bmi),
        "bloodLipids": score_blood_lipids(
            raw_answers.get("nonHdlCholesterol"),
            raw_answers.get("lipidsMedication", False),
        ),
        "bloodGlucose": score_blood_glucose(
            raw_answers.get("fastingGlucose"),
            raw_answers.get("hba1c"),
            raw_answers.get("glucoseMedication", False),
        ),
        "bloodPressure": score_blood_pressure(
            raw_answers.get("systolic"),
            raw_answers.get("diastolic"),
        ),
    }

    composite_score = calculate_composite_score(domain_scores)
    classification = classify_score(composite_score)

    return {
        "bmi": bmi,
        "domain_scores": domain_scores,
        "composite_score": composite_score,
        "classification": classification,
    }