# backend/app/routers/estatisticas.py
from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select, func
from app.database import get_session
from app.models import Usuario, Avaliacao, SexoEnum, RoleEnum
from app.dependencies import get_usuario_admin
from app.schemas import (
    ListaUsuariosAdminResposta,
    UsuarioListaAdmin,
    EstatisticasResumoResposta,
    DistribuicaoClassificacao,
    MediaPorSexo,
)

router = APIRouter(
    prefix="/admin/estatisticas",
    tags=["admin"],
    dependencies=[Depends(get_usuario_admin)],  # protege TODAS as rotas deste router
)


def _data_nascimento_limite(idade: int) -> date:
    """Converte uma idade em anos na data de nascimento correspondente,
    para permitir filtrar no banco (que só tem data_nascimento, não idade)."""
    hoje = date.today()
    return date(hoje.year - idade, hoje.month, hoje.day)


@router.get("/usuarios", response_model=ListaUsuariosAdminResposta)
def listar_usuarios(
    sexo: Optional[SexoEnum] = None,
    estado: Optional[str] = None,
    cidade: Optional[str] = None,
    idade_min: Optional[int] = Query(None, ge=0, le=130),
    idade_max: Optional[int] = Query(None, ge=0, le=130),
    pagina: int = Query(1, ge=1),
    limite: int = Query(20, ge=1, le=100),
    session: Session = Depends(get_session),
):
    query = select(Usuario)

    if sexo:
        query = query.where(Usuario.sexo == sexo)
    if estado:
        query = query.where(Usuario.estado == estado.upper())
    if cidade:
        query = query.where(Usuario.cidade == cidade)
    if idade_min is not None:
        # pessoa mais nova que idade_min anos tem data_nascimento MAIOR
        # que o limite -> queremos o oposto: nasceu ANTES ou igual ao limite
        query = query.where(Usuario.data_nascimento <= _data_nascimento_limite(idade_min))
    if idade_max is not None:
        query = query.where(Usuario.data_nascimento >= _data_nascimento_limite(idade_max))

    total = len(session.exec(query).all())

    usuarios = session.exec(
        query.offset((pagina - 1) * limite).limit(limite)
    ).all()

    resultado = []
    for usuario in usuarios:
        avaliacoes = session.exec(
            select(Avaliacao)
            .where(Avaliacao.usuario_id == usuario.id)
            .order_by(Avaliacao.data.desc())
        ).all()

        ultima = avaliacoes[0] if avaliacoes else None

        resultado.append(
            UsuarioListaAdmin(
                id=usuario.id,
                nome=usuario.nome,
                sexo=usuario.sexo,
                data_nascimento=usuario.data_nascimento,
                estado=usuario.estado,
                cidade=usuario.cidade,
                email=usuario.email,
                total_avaliacoes=len(avaliacoes),
                ultimo_score=ultima.score_total if ultima else None,
                ultima_classificacao=ultima.classificacao if ultima else None,
            )
        )

    return ListaUsuariosAdminResposta(
        total=total, pagina=pagina, limite=limite, usuarios=resultado
    )


@router.get("/resumo", response_model=EstatisticasResumoResposta)
def resumo_estatisticas(session: Session = Depends(get_session)):
    total_usuarios = session.exec(select(func.count()).select_from(Usuario)).one()
    avaliacoes = session.exec(select(Avaliacao)).all()
    total_avaliacoes = len(avaliacoes)

    if total_avaliacoes == 0:
        return EstatisticasResumoResposta(
            total_usuarios=total_usuarios,
            total_avaliacoes=0,
            score_medio_geral=None,
            media_por_dominio={},
            distribuicao_classificacao=[],
            media_por_sexo=[],
        )

    score_medio_geral = sum(a.score_total for a in avaliacoes) / total_avaliacoes

    dominios = [
        "score_dieta", "score_atividade_fisica", "score_tabagismo", "score_sono",
        "score_imc", "score_colesterol", "score_glicemia", "score_pressao",
    ]
    media_por_dominio = {
        dominio: sum(getattr(a, dominio) for a in avaliacoes) / total_avaliacoes
        for dominio in dominios
    }

    classificacoes = {}
    for a in avaliacoes:
        classificacoes[a.classificacao] = classificacoes.get(a.classificacao, 0) + 1
    distribuicao_classificacao = [
        DistribuicaoClassificacao(classificacao=c, quantidade=q)
        for c, q in classificacoes.items()
    ]

    media_por_sexo = []
    for sexo in SexoEnum:
        usuarios_ids = session.exec(
            select(Usuario.id).where(Usuario.sexo == sexo)
        ).all()
        avaliacoes_sexo = [a for a in avaliacoes if a.usuario_id in usuarios_ids]
        if avaliacoes_sexo:
            media_por_sexo.append(
                MediaPorSexo(
                    sexo=sexo,
                    score_medio=sum(a.score_total for a in avaliacoes_sexo) / len(avaliacoes_sexo),
                    quantidade=len(avaliacoes_sexo),
                )
            )

    return EstatisticasResumoResposta(
        total_usuarios=total_usuarios,
        total_avaliacoes=total_avaliacoes,
        score_medio_geral=round(score_medio_geral, 1),
        media_por_dominio={k: round(v, 1) for k, v in media_por_dominio.items()},
        distribuicao_classificacao=distribuicao_classificacao,
        media_por_sexo=media_por_sexo,
    )