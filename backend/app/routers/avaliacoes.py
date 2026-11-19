# backend/app/routers/avaliacoes.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Avaliacao, Usuario
from app.schemas import AvaliacaoCriar, AvaliacaoResposta
from app.dependencies import get_usuario_atual
from app.scoring import calculate_full_assessment, DadosInsuficientesError

router = APIRouter(prefix="/avaliacoes", tags=["avaliacoes"])


@router.post("", response_model=AvaliacaoResposta)
def criar_avaliacao(
    dados: AvaliacaoCriar,
    usuario_atual: Usuario = Depends(get_usuario_atual),
    session: Session = Depends(get_session),
):
    try:
        resultado = calculate_full_assessment(dados.respostas_brutas)
    except DadosInsuficientesError as e:
        raise HTTPException(status_code=422, detail=str(e))

    domain_scores = resultado["domain_scores"]

    avaliacao = Avaliacao(
        usuario_id=usuario_atual.id,
        score_total=resultado["composite_score"],
        classificacao=resultado["classification"],
        score_dieta=domain_scores["diet"],
        score_atividade_fisica=domain_scores["physicalActivity"],
        score_tabagismo=domain_scores["nicotineExposure"],
        score_sono=domain_scores["sleep"],
        score_imc=domain_scores["bmi"],
        score_colesterol=domain_scores["bloodLipids"],
        score_glicemia=domain_scores["bloodGlucose"],
        score_pressao=domain_scores["bloodPressure"],
        respostas_brutas=dados.respostas_brutas,
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