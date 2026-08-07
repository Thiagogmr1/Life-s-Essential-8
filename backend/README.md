# Life's Essential 8 — Back-end

API REST em Python (FastAPI) responsável pela autenticação de usuários e
persistência das avaliações de saúde cardiovascular, baseada na metodologia
Life's Essential 8 (AHA).

> Este back-end roda localmente por decisão de escopo do projeto

## Stack técnica

| Camada | Tecnologia |
|---|---|
| Framework | FastAPI |
| Servidor | Uvicorn |
| ORM / Validação | SQLModel (SQLAlchemy + Pydantic) |
| Banco de dados | PostgreSQL |
| Driver do banco | psycopg2 |
| Hash de senha | bcrypt |
| Autenticação | JWT (PyJWT) |

## Pré-requisitos

- Python 3.12+
- PostgreSQL instalado e rodando localmente
- Banco de dados `life8_db` criado (ver `database/schema.sql`)

## Setup do ambiente

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
```

Cria um arquivo `.env` na raiz de `backend/` (nunca versionado — já está no `.gitignore`):

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_NAME=life8_db
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
DB_SECRET_KEY=uma_string_aleatoria_longa_e_secreta
```

## Rodando o servidor

```powershell
uvicorn app.main:app --reload
```

- API: `http://127.0.0.1:8000`
- Documentação interativa (Swagger): `http://127.0.0.1:8000/docs`

## Estrutura do projeto

backend/
├── app/
│ ├── main.py # ponto de entrada, registra as rotas e o CORS
│ ├── database.py # conexão com o PostgreSQL
│ ├── models.py # tabelas do banco (SQLModel) — usuarios, avaliacoes
│ ├── schemas.py # formatos de entrada/saída da API (Pydantic)
│ ├── auth.py # hash de senha (bcrypt) e geração/validação de JWT
│ ├── dependencies.py # extrai o usuário logado a partir do token
│ └── routers/
│ ├── usuarios.py # POST /usuarios/cadastro, POST /usuarios/login
│ └── avaliacoes.py # POST /avaliacoes, GET /avaliacoes
├── database/
│ └── schema.sql # SQL para recriar as tabelas do zero
├── requirements.txt
└── .env # não versionado

## Endpoints

### Autenticação — `/usuarios`

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| POST | `/usuarios/cadastro` | Não | Cria uma conta (nome, idade, email, senha) e retorna um token |
| POST | `/usuarios/login` | Não | Autentica com email/senha e retorna um token |

**Corpo de `/usuarios/cadastro`:**
```json
{
  "nome": "string",
  "idade": 0,
  "email": "usuario@exemplo.com",
  "senha": "mínimo 8 caracteres"
}
```

**Resposta (ambas as rotas):**
```json
{
  "access_token": "jwt...",
  "token_type": "bearer",
  "usuario": {
    "id": "uuid",
    "nome": "string",
    "idade": 0,
    "email": "string",
    "criado_em": "timestamp"
  }
}
```

### Avaliações — `/avaliacoes`

Todas as rotas exigem o header `Authorization: Bearer <token>`.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/avaliacoes` | Salva uma nova avaliação, vinculada ao usuário do token |
| GET | `/avaliacoes` | Lista o histórico de avaliações do usuário logado, mais recente primeiro |

**Corpo de `POST /avaliacoes`:** os 8 scores por domínio (0-100), score total, classificação, e um objeto `respostas_brutas` com as respostas originais do questionário.

## Segurança — decisões implementadas

- Senhas nunca são armazenadas em texto puro — hash via `bcrypt`, truncado em 72 bytes (limite do algoritmo)
- Tokens JWT expiram em 7 dias
- `GET /avaliacoes` filtra por `usuario_id` do token — um usuário nunca acessa avaliações de outro
- Mensagens de erro de login idênticas para "email não existe" e "senha incorreta" — evita enumeração de contas cadastradas

## Limitações conhecidas / próximos passos

- Front-end ainda não está integrado a esta API — o `AssessmentContext.jsx` continua operando apenas em memória
- Sem endpoint de recuperação de senha
- Sem rate limiting nas rotas de login/cadastro
- CORS liberado apenas para `http://localhost:5173` (ambiente de desenvolvimento do front-end)