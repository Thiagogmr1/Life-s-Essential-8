# backend/app/schemas.py
import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UsuarioCadastro(BaseModel):
    nome: str
    idade: int = Field(gt=0, lt=130)
    email: EmailStr
    senha: str = Field(min_length=8, max_length=72)


class UsuarioLogin(BaseModel):
    email: EmailStr
    senha: str


class UsuarioResposta(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    nome: str
    idade: int
    email: str
    criado_em: datetime


class TokenResposta(BaseModel):
    # Sem access_token aqui — o token vai só no cookie httpOnly,
    # nunca no corpo JSON (senão o front poderia salvar em localStorage
    # por engano e reintroduzir o risco de XSS que o cookie evita).
    token_type: str = "bearer"
    usuario: UsuarioResposta


class AvaliacaoCriar(BaseModel):
    respostas_brutas: dict


class AvaliacaoResposta(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    data: datetime
    score_total: int
    classificacao: str
    score_dieta: int
    score_atividade_fisica: int
    score_tabagismo: int
    score_sono: int
    score_imc: int
    score_colesterol: int
    score_glicemia: int
    score_pressao: int
    respostas_brutas: dict