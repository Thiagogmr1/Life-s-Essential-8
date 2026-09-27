# backend/app/le8_criteria.py
"""
Critérios de pontuação do Life's Essential 8 (AHA).

Baseado em: Lloyd-Jones, D.M. et al. Life's Essential 8: Updating and
Enhancing the American Heart Association's Construct of Cardiovascular
Health. Circulation, 2022;146:e18-e43.

Adaptado conforme o protocolo do grupo de pesquisa (proposta CNPq 2025,
Quadros 1-5): este projeto usa apenas glicemia de jejum (não HbA1c)
para o domínio Glicemia, e prevê o questionário de frequência
alimentar da dieta do Mediterrâneo adaptado (Panagiotakos et al.,
2006) para o domínio Dieta.

Espelha 1:1 os valores de src/data/le8Criteria.js do front-end.
Qualquer alteração aqui DEVE ser replicada no front, e vice-versa,
até que exista uma fonte única de verdade compartilhada.

LIMITAÇÃO METODOLÓGICA (documentar no TCC):
O domínio "Dieta" (DIET_ITEMS, 8 perguntas, 0-16 pontos) é um PROXY
SIMPLIFICADO inspirado nos princípios DASH/Mediterrâneo — NÃO é o
instrumento validado de 11 itens (0-55 pontos) do protocolo (Quadro 3).
Reprodução fiel do instrumento validado ainda está pendente.
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

# Exposição passiva: subtrai 20 pontos se o participante mora com
# fumante(s) em casa (metodologia do protocolo, texto corrido — não
# estava em nenhuma tabela). Aplicado sobre o resultado de
# score_nicotine, nunca abaixo de zero.
SECONDHAND_SMOKE_PENALTY = 20

# CORRIGIDO: as faixas de 6-7h e 9-10h estavam com a mesma pontuação
# (90), e 5-6h/>=10h estavam em 70 em vez de 40 — deslocamento de um
# tier inteiro. Faltava também o tier de 0 pontos para <4h. O
# comentário antigo dizia "não reordenar, a ordem é significativa" —
# isso documentava o bug como se fosse intencional; removido.
SLEEP_THRESHOLDS = [
    {"min": 7, "max": 9, "points": 100},
    {"min": 9, "max": 10, "points": 90},
    {"min": 6, "max": 7, "points": 70},
    {"min": 5, "max": 6, "points": 40},
    {"min": 10, "max": float("inf"), "points": 40},
    {"min": 4, "max": 5, "points": 20},
    {"min": 0, "max": 4, "points": 0},
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

# CORRIGIDO: max_fbg era infinito a partir do 3º tier — qualquer
# glicemia de jejum >= 126 caía sempre em 40 pontos, nunca alcançando
# 30/20/10/0. Agora usa as faixas reais de FBG do Quadro 5 do
# protocolo (que usa só glicemia de jejum, sem HbA1c). Mantido o
# ramo max_a1c por compatibilidade, com o corte de pré-diabetes
# corrigido de 6.5 para 6.4 (era inconsistente com o Quadro 5).
GLUCOSE_THRESHOLDS = [
    {"max_fbg": 100, "max_a1c": 5.7, "points": 100},
    {"max_fbg": 126, "max_a1c": 6.4, "points": 60},
    {"max_fbg": 154, "max_a1c": 7.0, "points": 40},
    {"max_fbg": 170, "max_a1c": 8.0, "points": 30},
    {"max_fbg": 188, "max_a1c": 9.0, "points": 20},
    {"max_fbg": 227, "max_a1c": 10.0, "points": 10},
    {"max_fbg": float("inf"), "max_a1c": float("inf"), "points": 0},
]

BLOOD_PRESSURE_THRESHOLDS = [
    {"sys": 120, "dia": 80, "points": 100},
    {"sys": 130, "dia": 80, "points": 75},
    {"sys": 140, "dia": 90, "points": 50},
    {"sys": 160, "dia": 100, "points": 25},
    {"sys": float("inf"), "dia": float("inf"), "points": 0},
]

MEDICATION_PENALTY = 20  # pontos descontados se em tratamento (lipídeos e pressão arterial)

SCORE_CLASSIFICATION = [
    {"max": 49, "label": "baixa"},
    {"max": 79, "label": "moderada"},
    {"max": 100, "label": "alta"},
]