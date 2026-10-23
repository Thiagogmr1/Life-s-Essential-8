<p align="center">
  <img src="public/Natsa_logo.png" alt="NATSA" width="120" />
</p>

<h1 align="center">NATSA — Frontend</h1>

<p align="center">
  Interface web para avaliação de saúde cardiovascular baseada na metodologia
  <strong>Life's Essential 8 (LE8)</strong>, da American Heart Association.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React_Router-7.18-CA4245?logo=reactrouter&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/jsPDF-4.2-E44D26" alt="jsPDF" />
  <img src="https://img.shields.io/badge/SheetJS-0.18-217346" alt="SheetJS" />
</p>

> [!WARNING]
> Este sistema é uma ferramenta **orientativa** e **não realiza diagnóstico**.
> Não substitui avaliação médica profissional.

---

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Build tool | **Vite 8.1** |
| Framework | **React 19.2** |
| Roteamento | React Router 7 (`react-router-dom`) |
| Estado global | Context API (nativo do React) |
| Exportação PDF | jsPDF 4.2 + jspdf-autotable 5.0 |
| Exportação Excel | SheetJS (xlsx 0.18) |
| Ícones | Lucide React 1.46 |
| Acessibilidade (Libras) | VLibras (widget do Governo Federal / LAViD-UFPB) |
| Testes unitários | Vitest 5.0 |
| Tipografia | Montserrat (títulos) · Inter (corpo) · IBM Plex Mono (dados numéricos) |

---

## Pré-requisitos

- Node.js 18+
- npm

---

## Instalação e Execução

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`.

### Variáveis de Ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | URL base da API backend |

Crie um arquivo `.env` na raiz de `frontend/` se precisar apontar para outro endereço:

```dotenv
VITE_API_URL=http://localhost:8000
```

### Scripts Disponíveis

| Script | Comando | Descrição |
|---|---|---|
| `dev` | `npm run dev` | Servidor de desenvolvimento (Vite) |
| `build` | `npm run build` | Build de produção |
| `preview` | `npm run preview` | Preview local do build de produção |
| `lint` | `npm run lint` | Verificação de código (ESLint) |
| `test` | `npm test` | Testes unitários (Vitest) — executa uma vez |
| `test:watch` | `npm run test:watch` | Testes em modo watch (re-executa ao salvar) |

---

## Estrutura do Projeto

```
frontend/
├── public/
│   ├── Natsa_logo.png / .svg        # Logo do projeto
│   ├── assets/
│   │   ├── logo-unievangelica.png   # Logo institucional
│   │   └── logos/
│   ├── images/
│   │   └── login.png                # Imagem da tela de login
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── components/
│   │   ├── AdminRoute/       # Guard de rota — exige role "admin"
│   │   ├── PrivateRoute/     # Guard de rota — exige autenticação
│   │   ├── PublicRoute/      # Guard de rota — redireciona se já logado
│   │   ├── Header/           # Cabeçalho fixo (logo UniEVANGÉLICA + navegação)
│   │   ├── Button/           # Botão reutilizável
│   │   ├── QuestionCard/     # Container de cada pergunta do wizard
│   │   ├── ProgressTracker/  # Barra de progresso do questionário
│   │   ├── ScoreBadge/       # Círculo com score final e classificação
│   │   ├── DomainBar/        # Barra de progresso por domínio (resultado)
│   │   ├── PulseLine/        # Elemento gráfico de ECG (assinatura visual)
│   │   └── LoadingOverlay/   # Overlay de carregamento
│   │
│   ├── pages/
│   │   ├── Login/            # Tela de login
│   │   ├── Cadastro/         # Tela de cadastro de conta
│   │   ├── ForgotPassword/   # Tela "Esqueci minha senha"
│   │   ├── ResetPassword/    # Tela de redefinição de senha (via token)
│   │   ├── Home/             # Landing page — explica o LE8, botão de iniciar
│   │   ├── Questionnaire/    # Wizard das 20 perguntas (8 domínios)
│   │   ├── Results/          # Score final, breakdown por domínio, exportar PDF
│   │   ├── History/          # Histórico de avaliações do usuário
│   │   ├── HistoryDetail/    # Detalhe de uma avaliação específica
│   │   ├── AdminEstatisticas/ # Painel administrativo com estatísticas
│   │   └── auth-shared.css   # CSS compartilhado (Login, Cadastro, ForgotPassword, ResetPassword)
│   │
│   ├── context/
│   │   ├── AuthContext.jsx       # Estado de autenticação (login/logout/cadastro)
│   │   └── AssessmentContext.jsx # Estado do questionário, resultado e histórico
│   │
│   ├── data/
│   │   ├── le8Criteria.js        # Critérios e faixas de pontuação da AHA
│   │   └── questionnaireSteps.js # Definição e ordem das 20 etapas do wizard
│   │
│   ├── utils/
│   │   ├── api.js                # Client HTTP centralizado (fetch + cookies)
│   │   ├── scoring.js            # Cálculo dos 8 scores + score composto
│   │   ├── mapAvaliacao.js       # Mapper: resposta da API → formato do front
│   │   ├── exportPdf.js          # PDF do resultado individual e do histórico
│   │   ├── exportExcel.js        # Planilha Excel do histórico do usuário
│   │   ├── exportAdminPdf.js     # PDF do relatório administrativo
│   │   ├── exportAdminExcel.js   # Excel da listagem de usuários (admin)
│   │   └── scoring.test.js      # Testes unitários (Vitest) das funções de pontuação
│   │
│   ├── hooks/
│   │   └── useVLibrasRefresh.js  # Hook para re-scan do VLibras (comentado)
│   │
│   ├── styles/
│   │   └── variables.css         # Design tokens (cores, tipografia, radii)
│   │
│   ├── App.jsx                   # Rotas + providers
│   ├── App.css
│   ├── main.jsx                  # Entry point (BrowserRouter + providers)
│   └── index.css
│
├── vercel.json          # Rewrite para SPA (todas as rotas → index.html)
├── vite.config.js
└── package.json
```

---

## Rotas da Aplicação

| Rota | Página | Proteção | Descrição |
|---|---|---|---|
| `/` | Login | PublicRoute | Tela de login (redireciona para /home se logado) |
| `/login` | Login | PublicRoute | Alias de login |
| `/cadastro` | Cadastro | PublicRoute | Cadastro de conta |
| `/esqueci-senha` | ForgotPassword | PublicRoute | Solicita link de recuperação de senha |
| `/redefinir-senha/:token` | ResetPassword | PublicRoute | Redefine a senha via token JWT temporário |
| `/home` | Home | PrivateRoute | Landing — explica o LE8, inicia avaliação |
| `/questionario` | Questionnaire | PrivateRoute | Wizard com as 20 perguntas |
| `/resultado/:id?` | Results | PrivateRoute | Score final e breakdown por domínio |
| `/historico` | History | PrivateRoute | Lista de avaliações do usuário |
| `/historico/:id` | HistoryDetail | PrivateRoute | Detalhe de uma avaliação específica |
| `/admin/estatisticas` | AdminEstatisticas | AdminRoute | Painel administrativo |

---

## Sistema de Design

### Paleta de Cores (Identidade UniEVANGÉLICA)

Todas as cores estão centralizadas em `src/styles/variables.css` como CSS custom properties:

| Token | Cor | Uso |
|---|---|---|
| `--uni-navy` | `#16223F` | Navy principal — cabeçalho, títulos |
| `--uni-navy-deep` | `#0E1830` | Navy escuro — rodapé, barra superior |
| `--uni-red` | `#C4202F` | Vermelho da logo / acento vital (ECG) |
| `--uni-gold` | `#D9A441` | Dourado — CTAs, destaques, score moderado |
| `--uni-sky` | `#2DA9E0` | Azul-céu — acentos gráficos |
| `--paper` | `#F3F5F9` | Fundo geral (tom azulado institucional) |
| `--surface` | `#FFFFFF` | Fundo de cards |
| `--score-high` | `#1F7A5C` | Verde — saúde cardiovascular alta |
| `--score-mid` | `var(--uni-gold)` | Dourado — saúde cardiovascular moderada |
| `--score-low` | `var(--uni-red)` | Vermelho — saúde cardiovascular baixa |

### Tipografia

| Token | Fonte | Uso |
|---|---|---|
| `--font-display` | Montserrat (500/600/700) | Títulos e destaques |
| `--font-body` | Inter (400/500/600) | Corpo de texto |
| `--font-mono` | IBM Plex Mono (500/600) | Dados numéricos e scores |

---

## Questionário — Wizard de 20 Etapas

O questionário é um **wizard** (uma pergunta por vez) definido em `src/data/questionnaireSteps.js`. Os 20 passos cobrem os **8 domínios** do LE8:

| # | Domínio | Tipo | Campo | Instrumento / Referência |
|---|---|---|---|---|
| 1–11 | Dieta | Seleção (6 opções, 0–5 pts cada) | 11 itens do questionário mediterrâneo | Panagiotakos et al., 2006 (Anexo 1) |
| 12 | Atividade Física (moderada) | Número | `moderateActivityMinutes` (min/semana) | IPAQ — forma curta |
| 13 | Atividade Física (vigorosa) | Número | `vigorousActivityMinutes` (min/semana) | IPAQ — forma curta |
| 14 | Tabagismo | Rádio (5 opções) | `nicotineStatus` | — |
| 15 | Exposição passiva ao tabagismo | Rádio (Sim/Não) | `livesWithSmoker` | Protocolo do grupo |
| 16 | Sono | Número | `sleepHours` (horas/noite) | — |
| 17 | IMC | Peso + Altura | `weightKg` + `heightM` | — |
| 18 | Colesterol não-HDL | Número + Checkbox medicação | `nonHdlCholesterol` + `lipidsMedication` | — |
| 19 | Glicemia | Glicemia de jejum e/ou HbA1c + Checkbox | `fastingGlucose` / `hba1c` + `glucoseMedication` | Quadro 5 do protocolo |
| 20 | Pressão Arterial | Sistólica + Diastólica + Checkbox medicação | `systolic` + `diastolic` + `bloodPressureMedication` | — |

### Fluxo de Dados

```
questionnaireSteps.js (definição) → Questionnaire.jsx (UI)
        ↓ usuário responde
AssessmentContext.answers (estado global)
        ↓ submitAssessment()
    ┌───────────────────────┐
    │ scoring.js (validação │ ← cálculo LOCAL (só validação — resultado é descartado)
    │ client-side)          │
    └──────────┬────────────┘
               ↓
    API → POST /avaliacoes (respostas brutas)
               ↓
    Backend scoring.py recalcula (FONTE DA VERDADE)
               ↓
    AssessmentContext.result + history
               ↓
    Results.jsx / History.jsx
               ↓ (opcional)
    exportPdf.js / exportExcel.js
```

> [!NOTE]
> O frontend chama `calculateFullAssessment()` no momento do envio **apenas para validação** — por exemplo, lança `DadosInsuficientesError` se peso ou altura estiverem vazios. O retorno dessa chamada é **descartado**; o resultado exibido na tela e persistido no banco vem **sempre do backend** (`scoring.py`), que é a fonte da verdade.

---

## Lógica de Pontuação

Definida em `src/utils/scoring.js` + `src/data/le8Criteria.js`:

- **Cada domínio** recebe um score de **0 a 100** pontos, baseado em faixas (thresholds) definidas pela diretriz oficial da AHA, adaptadas pelo protocolo do grupo de pesquisa (CNPq 2025).
- **Dieta**: soma dos 11 itens do questionário mediterrâneo (0–55 pts) → faixas (≥ 45 → 100, ≥ 35 → 80, ≥ 23 → 50, ≥ 12 → 25, < 12 → 0).
- **Atividade Física**: minutos equivalentes = moderada + 2 × vigorosa (equivalência OMS/AHA).
- **Tabagismo**: pontuação direta por opção − 20 pontos de penalidade se `livesWithSmoker` (`SECONDHAND_SMOKE_PENALTY`), mínimo 0.
- **Penalidades de medicação** (−20 pts, `MEDICATION_PENALTY`, mínimo 0): aplicadas em **colesterol**, **glicemia** e **pressão arterial**.
- O **score composto** é a **média aritmética** dos 8 scores de domínio, arredondada com `Math.round()`.
- **Classificação final**: Baixa (0–49), Moderada (50–79), Alta (80–100).
- O cálculo de **IMC** lança erro (`DadosInsuficientesError`) se peso ou altura não forem preenchidos. O valor numérico do IMC (kg/m²) **não é persistido** no banco — apenas o `score_imc` (0–100).

---

## Gerenciamento de Estado (Context API)

### `AuthContext`

Gerencia o ciclo de autenticação:
- `usuario` — dados do usuário logado (ou `null`)
- `loading` — `true` enquanto valida sessão existente via `GET /usuarios/me`
- `login(email, senha)` / `cadastrar(dados)` / `logout()`
- `emTransicaoCadastro` — flag para impedir redirecionamento prematuro após cadastro

### `AssessmentContext`

Gerencia o estado do questionário e resultados:
- `answers` — respostas acumuladas durante o wizard (inclui `diet`, `moderateActivityMinutes`, `vigorousActivityMinutes`, `livesWithSmoker`, `bloodPressureMedication`, entre outros)
- `setField(field, value)` / `setDietItem(itemId, points)` — atualizam respostas
- `resetAnswers()` — restaura todas as respostas para o estado inicial
- `submitAssessment()` — chama `calculateFullAssessment()` para validação (descarta o resultado), envia `respostas_brutas` para a API e armazena o resultado recalculado pelo backend
- `result` — resultado da última avaliação (sempre vindo do backend)
- `history` / `carregarHistorico()` — histórico carregado do backend
- `enviando` / `erro` — estados de loading e erro

---

## Exportação

### Usuário Comum

| Formato | Arquivo | Conteúdo |
|---|---|---|
| PDF | `exportPdf.js` | Resultado individual (score + breakdown) ou histórico completo com páginas detalhadas |
| Excel | `exportExcel.js` | Planilha com todas as avaliações, incluindo respostas brutas decodificadas |

### Administrador

| Formato | Arquivo | Conteúdo |
|---|---|---|
| PDF | `exportAdminPdf.js` | Relatório com resumo geral, médias por domínio/sexo, classificação + listagem de usuários |
| Excel | `exportAdminExcel.js` | Planilha com dados demográficos, total de avaliações e últimos scores dos usuários |

---

## Acessibilidade — VLibras

O widget VLibras (tradução para Libras) é integrado via script no `index.html`. Algumas notas técnicas:

- Inicializado **uma única vez** no carregamento da página.
- Roda sobre uma engine Unity WebGL e **não suporta reinicialização** a cada troca de tela.
- O hook `useVLibrasRefresh.js` está **comentado** — tentar recriar o widget causa o erro `Widget is not a constructor`.
- Para traduzir o conteúdo da tela atual, o usuário deve clicar novamente no ícone flutuante do avatar.

---

## Testes Automatizados

O frontend conta com uma suíte de testes unitários com **Vitest** cobrindo todas as funções de pontuação em `src/utils/scoring.js`, garantindo paridade com as regras do backend.

Para rodar os testes:

```bash
# Executar todos os testes uma vez:
npm test

# Executar em modo watch (re-executa ao salvar):
npm run test:watch
```

---

## Deploy

O frontend é publicado na **Vercel**, com `Root Directory` configurado como `frontend`. O arquivo `vercel.json` configura um rewrite para que todas as rotas do React Router funcionem corretamente em refresh de página:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

> [!NOTE]
> O deploy público ainda está em desenvolvimento.

---

## Limitações Conhecidas / Próximos Passos

- [x] Testes unitários de pontuação (Vitest)
- [x] Exportação PDF e Excel (usuário + admin)
- [x] Telas de recuperação de senha (ForgotPassword + ResetPassword) — email ainda mockado no backend
- [ ] Deploy público do frontend
- [ ] Envio real de email para recuperação de senha
- [ ] Persistir valor numérico do IMC (kg/m²), não só o score
- [ ] Fonte única de verdade para critérios LE8 (hoje duplicado entre front e back)
- [x] Termo de consentimento / conformidade LGPD para dados sensíveis de saúde

---

## Referências Científicas

- Lloyd-Jones, D.M. et al. *Life's Essential 8: Updating and Enhancing the American Heart Association's Construct of Cardiovascular Health*. Circulation, 2022;146:e18–e43.
- Panagiotakos, D.B. et al. *Adherence to the Mediterranean food pattern predicts the prevalence of hypertension, hypercholesterolemia, diabetes and obesity, among healthy adults; the accuracy of the MedDietScore*. Preventive Medicine, 2007;44(4):335–340.