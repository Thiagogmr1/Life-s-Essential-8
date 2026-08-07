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
    model_config = ConfigDict(from_attributes=True)  # permite ler direto de um objeto Usuario (SQLModel)

    id: uuid.UUID
    nome: str
    idade: int
    email: str
    criado_em: datetime


class TokenResposta(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioResposta

    # adicionar em backend/app/schemas.py

class AvaliacaoCriar(BaseModel):
    score_total: int = Field(ge=0, le=100)
    classificacao: str
    score_dieta: int = Field(ge=0, le=100)
    score_atividade_fisica: int = Field(ge=0, le=100)
    score_tabagismo: int = Field(ge=0, le=100)
    score_sono: int = Field(ge=0, le=100)
    score_imc: int = Field(ge=0, le=100)
    score_colesterol: int = Field(ge=0, le=100)
    score_glicemia: int = Field(ge=0, le=100)
    score_pressao: int = Field(ge=0, le=100)
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