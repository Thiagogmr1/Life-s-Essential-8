# Life's Essential 8 — Front-end

Interface web para avaliação de saúde cardiovascular baseada na metodologia
**Life's Essential 8**, da American Heart Association (AHA). Aplicação em
React (SPA), desenvolvida como parte de um projeto de Iniciação Científica
em parceria com a UniEVANGÉLICA (Universidade Evangélica de Goiás).

> ⚠️ Este sistema é uma ferramenta orientativa e **não realiza diagnóstico**.
> Não substitui avaliação médica.

## Stack técnica

| Camada | Tecnologia |
|---|---|
| Build tool | Vite |
| Framework | React |
| Roteamento | React Router (`react-router-dom`) |
| Estado global | Context API (nativo do React) |
| Exportação PDF | jsPDF + jspdf-autotable |
| Exportação Excel | SheetJS (xlsx) |
| Acessibilidade (Libras) | VLibras (widget do Governo Federal / LAViD-UFPB) |
| Tipografia | Montserrat (títulos) + Inter (corpo) + IBM Plex Mono (dados numéricos) |

## Pré-requisitos

- Node.js 18+
- npm

## Setup

```powershell
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Estrutura do projeto

frontend/
├── public/
│ ├── assets/
│ │ └── logo-unievangelica.png
│ └── favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png
├── src/
│ ├── components/
│ │ ├── Header/ # cabeçalho fixo — logo UniEVANGÉLICA + título
│ │ ├── QuestionCard/ # casca de cada tela do questionário (wizard)
│ │ ├── ScoreBadge/ # círculo com o score final e classificação
│ │ ├── DomainBar/ # barra de progresso por domínio na tela de resultado
│ │ └── PulseLine/ # elemento gráfico assinatura (traço de ECG)
│ ├── pages/
│ │ ├── Home/ # landing — explica o LE8, botão de iniciar
│ │ ├── Questionnaire/ # fluxo wizard das 15 perguntas (8 domínios)
│ │ ├── Results/ # score final, breakdown por domínio, exportar PDF
│ │ └── History/ # linha do tempo das avaliações, exportar Excel
│ ├── context/
│ │ └── AssessmentContext.jsx # estado global: respostas, resultado, histórico
│ ├── data/
│ │ ├── le8Criteria.js # critérios e faixas de pontuação oficiais da AHA
│ │ └── questionnaireSteps.js # ordem e tipo de cada tela do wizard
│ ├── utils/
│ │ ├── scoring.js # cálculo dos 8 scores + score composto
│ │ ├── exportPdf.js # gera o PDF do resultado individual
│ │ └── exportExcel.js # gera a planilha do histórico completo
│ ├── styles/
│ │ └── variables.css # design tokens (cores, tipografia, radius)
│ ├── App.jsx
│ ├── index.css
│ └── main.jsx
└── index.html # inclui o script/markup do widget VLibras

## Funcionalidades implementadas

- **Questionário em wizard** — uma pergunta por vez, 15 passos cobrindo os 8 domínios do LE8, com validação (não avança sem responder)
- **Cálculo de score** — 100% client-side, seguindo as faixas de pontuação oficiais da diretriz (Lloyd-Jones et al., 2022), incluindo ajuste por uso de medicação (colesterol/glicemia)
- **Resultado detalhado** — score composto (0–100), classificação (baixa/moderada/alta) e breakdown visual por domínio
- **Histórico da sessão** — linha do tempo das avaliações realizadas (armazenado em memória via Context API)
- **Exportação PDF** — relatório individual do resultado, na tela de Resultado
- **Exportação Excel** — planilha do histórico completo, com uma coluna por resposta bruta (não só os scores), na tela de Histórico
- **Identidade visual institucional** — paleta e cabeçalho alinhados à marca da UniEVANGÉLICA
- **Acessibilidade** — widget VLibras (tradução para Libras) integrado
- **Responsivo** — testado em breakpoints de 640px e 380px

## Fluxo de dados

QUESTIONNAIRE_STEPS (data/)
↓ usuário responde
AssessmentContext.answers
↓ submitAssessment()
utils/scoring.js → calculateFullAssessment()
↓
AssessmentContext.result + history
↓
pages/Results + pages/History
↓ (opcional)
utils/exportPdf.js / utils/exportExcel.js

## Design tokens

Cores, tipografia e espaçamento centralizados em `src/styles/variables.css`
como CSS custom properties — qualquer ajuste de identidade visual (ex: nova
paleta institucional) se propaga automaticamente para todos os componentes,
sem precisar editar CSS individual de cada tela.

## VLibras — nota técnica importante

O widget é inicializado **uma única vez**, no carregamento da página
(`index.html`). Diferente de outras bibliotecas JS, o VLibras roda sobre uma
engine Unity WebGL e **não suporta reinicialização** a cada troca de tela —
tentar isso causa o erro `Widget is not a constructor`. Para traduzir o
conteúdo de uma tela específica do questionário, o usuário deve clicar
novamente no ícone flutuante do avatar — comportamento consistente com o uso
do VLibras em qualquer site.

## Limitações conhecidas

- **Persistência apenas em memória** — o histórico não sobrevive a um
  refresh de página. Isso será resolvido na integração com o back-end
  (API Python + PostgreSQL já desenvolvidos, ver `backend/README.md`),
  ainda pendente de conexão com este front-end.
- **Domínio "Dieta"** usa um proxy simplificado (não o instrumento MEPA
  validado pela AHA) — detalhado em `docs/LIMITACOES_METODOLOGICAS.md`.
- Sem tela de login/cadastro ainda — o back-end já expõe os endpoints,
  faltando conectar o front-end a eles.

## Deploy

Publicado na Vercel, com **Root Directory** configurado como `frontend`
(a Vercel ignora o restante do monorepo, incluindo `backend/`). O arquivo
`vercel.json` nesta pasta garante que rotas do React Router (ex:
`/questionario`) funcionem corretamente em refresh de página, redirecionando
todas as rotas para `index.html`.

## Referência científica

Lloyd-Jones, D.M. et al. *Life's Essential 8: Updating and Enhancing the
American Heart Association's Construct of Cardiovascular Health*.
Circulation, 2022;146:e18–e43.