# backend/app/routers/avaliacoes.py
from typing import List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.database import get_session
from app.models import Avaliacao, Usuario
from app.schemas import AvaliacaoCriar, AvaliacaoResposta
from app.dependencies import get_usuario_atual

router = APIRouter(prefix="/avaliacoes", tags=["avaliacoes"])


@router.post("", response_model=AvaliacaoResposta)
def criar_avaliacao(
    dados: AvaliacaoCriar,
    usuario_atual: Usuario = Depends(get_usuario_atual),
    session: Session = Depends(get_session),
):
    avaliacao = Avaliacao(
        usuario_id=usuario_atual.id,
        **dados.model_dump(),
    )
    session.add(avaliacao)
    session.commit()
    session.refresh(avaliacao)
    return avaliacao


@router.get("", response_model=List[AvaliacaoResposta])
def listar_avaliacoes(
    usuario_atual: Usuario = Depends(get_usuario_atual),
    session: Session = Depends(get_session),
):
    avaliacoes = session.exec(
        select(Avaliacao)
        .where(Avaliacao.usuario_id == usuario_atual.id)
        .order_by(Avaliacao.data.desc())
    ).all()
    return avaliacoes