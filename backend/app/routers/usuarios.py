# backend/app/routers/usuarios.py
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlmodel import Session, select
from app.database import get_session
from app.models import Usuario
from app.schemas import UsuarioCadastro, UsuarioLogin, TokenResposta
from app.auth import (
    hash_senha,
    verificar_senha,
    criar_token,
    COOKIE_NAME,
    COOKIE_MAX_AGE,
    COOKIE_SECURE,
    COOKIE_SAMESITE,
)

router = APIRouter(prefix="/usuarios", tags=["usuarios"])

_HASH_DUMMY = hash_senha("senha_dummy_para_igualar_tempo_de_resposta")


def _setar_cookie_auth(response: Response, usuario_id: str) -> None:
    token = criar_token(usuario_id)
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        max_age=COOKIE_MAX_AGE,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        path="/",
    )


@router.post("/cadastro", response_model=TokenResposta)
def cadastrar(
    dados: UsuarioCadastro,
    response: Response,
    session: Session = Depends(get_session),
):
    existente = session.exec(
        select(Usuario).where(Usuario.email == dados.email)
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Este email já está cadastrado")

    usuario = Usuario(
        nome=dados.nome,
        idade=dados.idade,
        email=dados.email,
        senha_hash=hash_senha(dados.senha),
    )
    session.add(usuario)
    session.commit()
    session.refresh(usuario)

    _setar_cookie_auth(response, str(usuario.id))
    return TokenResposta(usuario=usuario)


@router.post("/login", response_model=TokenResposta)
def login(
    dados: UsuarioLogin,
    response: Response,
    session: Session = Depends(get_session),
):
    usuario = session.exec(
        select(Usuario).where(Usuario.email == dados.email)
    ).first()

    erro_generico = HTTPException(status_code=401, detail="Email ou senha incorretos")

    if not usuario:
        verificar_senha(dados.senha, _HASH_DUMMY)
        raise erro_generico

    if not verificar_senha(dados.senha, usuario.senha_hash):
        raise erro_generico

    _setar_cookie_auth(response, str(usuario.id))
    return TokenResposta(usuario=usuario)


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key=COOKIE_NAME, path="/")
    return {"detail": "Logout realizado com sucesso"}