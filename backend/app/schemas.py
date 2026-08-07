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