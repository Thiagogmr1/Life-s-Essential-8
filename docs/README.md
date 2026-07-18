# Limitações metodológicas — para validação com orientação

Este documento lista as simplificações adotadas na implementação atual do
score LE8, em relação à diretriz oficial da AHA. Cada item aqui precisa de
validação (ou ajuste) pela orientadora antes de qualquer publicação ou
divulgação de resultados do sistema.

## 1. Domínio "Dieta" — proxy simplificado

A AHA utiliza o **MEPA** (Mediterranean-style Eating Pattern), um
instrumento validado de frequência alimentar com processo próprio de
validação psicométrica. Implementá-lo integralmente estaria fora do escopo
de um projeto de TRL5 com cronograma de 12 meses — seria, na prática, um
estudo de validação de instrumento à parte.

**O que foi implementado:** um proxy de 8 perguntas (frutas/vegetais, grãos
integrais, peixe, sódio, bebidas açucaradas, carne vermelha/processada,
castanhas/leguminosas, tipo de gordura usada), cada uma valendo de 0 a 2
pontos, somando no máximo 16 pontos — mapeados nas mesmas faixas oficiais
da AHA (0–3 = 0 pts, 4–7 = 25 pts, 8–11 = 50 pts, 12–14 = 80 pts, 15–16 =
100 pts).

**Necessita validação:** as 8 perguntas escolhidas cobrem os princípios
gerais das dietas DASH/Mediterrânea, mas não foram validadas como
instrumento. Recomenda-se discutir se essa abordagem é aceitável para os
fins do TCC/artigo, ou se algum ajuste nos itens é necessário.

## 2. Ajuste por tratamento medicamentoso

A diretriz original desconta pontos de colesterol e glicemia quando o
paciente já está em tratamento medicamentoso (já que o valor medido reflete
o efeito da medicação, não o estado metabólico real sem intervenção).

**O que foi implementado:** desconto fixo de 20 pontos quando o usuário
indica uso de medicação para colesterol ou para diabetes/glicemia,
independente da dose ou do tempo de tratamento.

**Necessita validação:** o valor de 20 pontos foi adotado como aproximação
razoável, mas não há granularidade por tipo/dose de medicação. Avaliar se
isso é suficiente para os fins do estudo.

## 3. Estadiamento de glicemia sem HbA1c

Quando o usuário informa apenas a glicemia de jejum (sem HbA1c), o sistema
não consegue aplicar o estadiamento completo de diabetes previsto na
diretriz (que depende de HbA1c para diferenciar estágios de gravidade).

**O que foi implementado:** uma classificação conservadora simplificada
(< 100 mg/dL = 100 pts; 100–125 mg/dL = 60 pts; ≥ 126 mg/dL = 40 pts) quando
só a glicemia de jejum está disponível.

**Necessita validação:** essa simplificação subestima a granularidade da
diretriz original para casos de diabetes já diagnosticado. Avaliar se vale
exigir HbA1c como campo obrigatório, ou manter esse fallback.

## 4. Persistência de dados

**Estado atual:** o histórico de avaliações existe apenas em memória, durante
a sessão do navegador — não sobrevive a um refresh de página nem persiste
entre visitas. Isso é esperado nesta fase (front-end desenvolvido antes do
back-end, por decisão de cronograma), mas precisa ser resolvido antes de
qualquer uso com usuários reais.

**Pendente:** banco de dados (etapa de back-end), autenticação de usuários,
termo de consentimento e conformidade com a LGPD para dados de saúde
(dados sensíveis, conforme Art. 5º, II da LGPD).

## 5. Caráter não-diagnóstico

O sistema inclui avisos explícitos na interface (tela de Resultado e Home)
de que o resultado é orientativo e não substitui avaliação médica. Isso
está alinhado com a proposta original do plano de trabalho, mas vale
confirmar se a redação desses avisos está adequada do ponto de vista ético
antes de qualquer teste com participantes reais.