# backend/app/models.py
import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Column
from sqlalchemy.dialects.postgresql import JSONB


class Usuario(SQLModel, table=True):
    __tablename__ = "usuarios"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    nome: str
    idade: int
    email: str = Field(unique=True, index=True)
    senha_hash: str
    criado_em: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Avaliacao(SQLModel, table=True):
    __tablename__ = "avaliacoes"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    usuario_id: uuid.UUID = Field(
        foreign_key="usuarios.id", ondelete="CASCADE", index=True
    )
    data: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), index=True)
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
    respostas_brutas: dict = Field(sa_column=Column(JSONB))