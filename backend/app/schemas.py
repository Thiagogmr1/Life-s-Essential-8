import uuid
from datetime import datetime, date
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator, computed_field
from app.models import SexoEnum
from typing import Optional
from app.models import RoleEnum

class UsuarioCadastro(BaseModel):
    nome: str
    data_nascimento: date
    sexo: SexoEnum
    estado: str = Field(min_length=2, max_length=2)
    cidade: str
    email: EmailStr
    senha: str = Field(min_length=8, max_length=72)

    @field_validator("data_nascimento")
    @classmethod
    def validar_data_nascimento(cls, v: date) -> date:
        if v >= date.today():
            raise ValueError("Data de nascimento deve ser no passado")
        idade_aproximada = (date.today() - v).days / 365.25
        if idade_aproximada > 130:
            raise ValueError("Data de nascimento inválida")
        return v

    @field_validator("estado")
    @classmethod
    def validar_estado(cls, v: str) -> str:
        return v.upper()


class UsuarioLogin(BaseModel):
    email: EmailStr
    senha: str


class UsuarioResposta(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    nome: str
    data_nascimento: date
    sexo: SexoEnum
    estado: str
    cidade: str
    email: str
    role: RoleEnum
    criado_em: datetime

    @computed_field
    @property
    def idade(self) -> int:
        hoje = date.today()
        idade = hoje.year - self.data_nascimento.year
        if (hoje.month, hoje.day) < (self.data_nascimento.month, self.data_nascimento.day):
            idade -= 1
        return idade


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


class UsuarioListaAdmin(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    nome: str
    sexo: SexoEnum
    estado: str
    cidade: str
    email: str
    total_avaliacoes: int
    ultimo_score: Optional[int] = None
    ultima_classificacao: Optional[str] = None

    @computed_field
    @property
    def idade(self) -> int:
        # reaproveita o mesmo cálculo do UsuarioResposta
        hoje = date.today()
        idade = hoje.year - self.data_nascimento.year
        if (hoje.month, hoje.day) < (self.data_nascimento.month, self.data_nascimento.day):
            idade -= 1
        return idade

    data_nascimento: date  # necessário para o computed_field acima; incluído na resposta também


class ListaUsuariosAdminResposta(BaseModel):
    total: int
    pagina: int
    limite: int
    usuarios: list[UsuarioListaAdmin]


class DistribuicaoClassificacao(BaseModel):
    classificacao: str
    quantidade: int


class MediaPorSexo(BaseModel):
    sexo: SexoEnum
    score_medio: float
    quantidade: int


class EstatisticasResumoResposta(BaseModel):
    total_usuarios: int
    total_avaliacoes: int
    score_medio_geral: Optional[float]
    media_por_dominio: dict[str, float]
    distribuicao_classificacao: list[DistribuicaoClassificacao]
    media_por_sexo: list[MediaPorSexo]