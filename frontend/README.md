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
│   │   ├── Home/             # Landing page — explica o LE8, botão de iniciar
│   │   ├── Questionnaire/    # Wizard das 15 perguntas (8 domínios)
│   │   ├── Results/          # Score final, breakdown por domínio, exportar PDF
│   │   ├── History/          # Histórico de avaliações do usuário
│   │   ├── HistoryDetail/    # Detalhe de uma avaliação específica
│   │   └── AdminEstatisticas/ # Painel administrativo com estatísticas
│   │
│   ├── context/
│   │   ├── AuthContext.jsx       # Estado de autenticação (login/logout/cadastro)
│   │   └── AssessmentContext.jsx # Estado do questionário, resultado e histórico
│   │
│   ├── data/
│   │   ├── le8Criteria.js        # Critérios e faixas de pontuação da AHA
│   │   └── questionnaireSteps.js # Definição e ordem das 15 etapas do wizard
│   │
│   ├── utils/
│   │   ├── api.js                # Client HTTP centralizado (fetch + cookies)
│   │   ├── scoring.js            # Cálculo dos 8 scores + score composto
│   │   ├── mapAvaliacao.js       # Mapper: resposta da API → formato do front
│   │   ├── exportPdf.js          # PDF do resultado individual e do histórico
│   │   ├── exportExcel.js        # Planilha Excel do histórico do usuário
│   │   ├── exportAdminPdf.js     # PDF do relatório administrativo
│   │   └── exportAdminExcel.js   # Excel da listagem de usuários (admin)
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
| `/home` | Home | PrivateRoute | Landing — explica o LE8, inicia avaliação |
| `/questionario` | Questionnaire | PrivateRoute | Wizard com as 15 perguntas |
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

## Questionário — Wizard de 15 Etapas

O questionário é um **wizard** (uma pergunta por vez) definido em `src/data/questionnaireSteps.js`. Os 15 passos cobrem os **8 domínios** do LE8:

| # | Domínio | Tipo | Campo |
|---|---|---|---|
| 1–8 | Dieta | Seleção (3 opções, 0/1/2 pts cada) | 8 itens alimentares |
| 9 | Atividade Física | Número | `physicalActivityMinutes` (min/semana) |
| 10 | Tabagismo | Rádio (5 opções) | `nicotineStatus` |
| 11 | Sono | Número | `sleepHours` (horas/noite) |
| 12 | IMC | Peso + Altura | `weightKg` + `heightM` |
| 13 | Colesterol não-HDL | Número + Checkbox medicação | `nonHdlCholesterol` + `lipidsMedication` |
| 14 | Glicemia | Glicemia jejum e/ou HbA1c + Checkbox | `fastingGlucose` / `hba1c` + `glucoseMedication` |
| 15 | Pressão Arterial | Sistólica + Diastólica | `systolic` + `diastolic` |

### Fluxo de Dados

```
questionnaireSteps.js (definição) → Questionnaire.jsx (UI)
        ↓ usuário responde
AssessmentContext.answers (estado global)
        ↓ submitAssessment()
    ┌───────────────────────┐
    │ scoring.js (validação │ ← cálculo LOCAL (preview, verifica campos obrigatórios)
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
> O scoring é executado **duas vezes**: o frontend calcula localmente para validar campos obrigatórios antes do envio, mas o resultado que é exibido e persistido vem **sempre do backend** (fonte da verdade).

---

## Lógica de Pontuação

Definida em `src/utils/scoring.js` + `src/data/le8Criteria.js`:

- **Cada domínio** recebe um score de **0 a 100** pontos, baseado em faixas (thresholds) definidas pela diretriz oficial da AHA.
- O **score composto** é a **média aritmética** dos 8 scores de domínio.
- **Classificação final**: Baixa (0–49), Moderada (50–79), Alta (80–100).
- Domínios de colesterol e glicemia sofrem um **desconto de 20 pontos** se o usuário está em tratamento medicamentoso.
- O cálculo de **IMC** lança erro (`DadosInsuficientesError`) se peso ou altura não forem preenchidos.

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
- `answers` — respostas acumuladas durante o wizard
- `setField(field, value)` / `setDietItem(itemId, points)` — atualizam respostas
- `submitAssessment()` — valida localmente + envia para API + armazena resultado
- `result` — resultado da última avaliação
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

## Referência Científica

Lloyd-Jones, D.M. et al. *Life's Essential 8: Updating and Enhancing the American Heart Association's Construct of Cardiovascular Health*. Circulation, 2022;146:e18–e43.