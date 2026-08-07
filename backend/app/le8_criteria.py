# backend/app/le8_criteria.py
"""
Critérios de pontuação do Life's Essential 8 (AHA).

Baseado em: Lloyd-Jones, D.M. et al. Life's Essential 8: Updating and
Enhancing the American Heart Association's Construct of Cardiovascular
Health. Circulation, 2022;146:e18-e43.

Espelha 1:1 os valores de src/data/le8Criteria.js do front-end.
Qualquer alteração aqui DEVE ser replicada no front, e vice-versa,
até que exista uma fonte única de verdade compartilhada.

LIMITAÇÃO METODOLÓGICA (documentar no TCC):
O domínio "Dieta" usa um proxy simplificado inspirado nos princípios
DASH/Mediterrâneo, e NÃO o instrumento validado MEPA usado pela AHA.
"""

DIET_ITEMS = [
    {"id": "fruitsVeggies"},
    {"id": "wholeGrains"},
    {"id": "fish"},
    {"id": "sodium"},
    {"id": "sugaryDrinks"},
    {"id": "redMeat"},
    {"id": "nutsLegumes"},
    {"id": "fatType"},
]
# Soma máxima possível: 16 pontos (8 itens x 2)

DIET_SCORE_THRESHOLDS = [
    {"min": 15, "points": 100},
    {"min": 12, "points": 80},
    {"min": 8, "points": 50},
    {"min": 4, "points": 25},
    {"min": 0, "points": 0},
]

NICOTINE_OPTIONS = [
    {"value": "never", "points": 100},
    {"value": "quit_5y", "points": 75},
    {"value": "quit_1_5y", "points": 50},
    {"value": "quit_1y_or_vape", "points": 25},
    {"value": "smoker", "points": 0},
]

# ATENÇÃO: a ordem desta lista é significativa (ver nota no scoring.py).
# NÃO reordenar por 'min' crescente — isso mudaria o resultado.
SLEEP_THRESHOLDS = [
    {"min": 7, "max": 9, "points": 100},
    {"min": 9, "max": 10, "points": 90},
    {"min": 6, "max": 7, "points": 90},
    {"min": 5, "max": 6, "points": 70},
    {"min": 10, "max": float("inf"), "points": 70},
    {"min": 4, "max": 5, "points": 40},
    {"min": 0, "max": 4, "points": 20},
]

PHYSICAL_ACTIVITY_THRESHOLDS = [
    {"min": 150, "max": float("inf"), "points": 100},
    {"min": 120, "max": 150, "points": 90},
    {"min": 90, "max": 120, "points": 80},
    {"min": 60, "max": 90, "points": 60},
    {"min": 30, "max": 60, "points": 40},
    {"min": 1, "max": 30, "points": 20},
    {"min": 0, "max": 1, "points": 0},
]

BMI_THRESHOLDS = [
    {"max": 25, "points": 100},
    {"max": 30, "points": 70},
    {"max": 35, "points": 30},
    {"max": 40, "points": 15},
    {"max": float("inf"), "points": 0},
]

NON_HDL_THRESHOLDS = [
    {"max": 130, "points": 100},
    {"max": 160, "points": 60},
    {"max": 190, "points": 40},
    {"max": 220, "points": 20},
    {"max": float("inf"), "points": 0},
]

GLUCOSE_THRESHOLDS = [
    {"max_fbg": 100, "max_a1c": 5.7, "points": 100},
    {"max_fbg": 126, "max_a1c": 6.5, "points": 60},
    {"max_fbg": float("inf"), "max_a1c": 7.0, "points": 40},
    {"max_fbg": float("inf"), "max_a1c": 8.0, "points": 30},
    {"max_fbg": float("inf"), "max_a1c": 9.0, "points": 20},
    {"max_fbg": float("inf"), "max_a1c": 10.0, "points": 10},
    {"max_fbg": float("inf"), "max_a1c": float("inf"), "points": 0},
]

BLOOD_PRESSURE_THRESHOLDS = [
    {"sys": 120, "dia": 80, "points": 100},
    {"sys": 130, "dia": 80, "points": 75},
    {"sys": 140, "dia": 90, "points": 50},
    {"sys": 160, "dia": 100, "points": 25},
    {"sys": float("inf"), "dia": float("inf"), "points": 0},
]

MEDICATION_PENALTY = 20

SCORE_CLASSIFICATION = [
    {"max": 49, "label": "baixa"},
    {"max": 79, "label": "moderada"},
    {"max": 100, "label": "alta"},
]