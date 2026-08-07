# backend/app/routers/usuarios.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Usuario
from app.schemas import UsuarioCadastro, UsuarioLogin, TokenResposta
from app.auth import hash_senha, verificar_senha, criar_token

router = APIRouter(prefix="/usuarios", tags=["usuarios"])


@router.post("/cadastro", response_model=TokenResposta)
def cadastrar(dados: UsuarioCadastro, session: Session = Depends(get_session)):
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

    token = criar_token(str(usuario.id))
    return TokenResposta(access_token=token, usuario=usuario)


@router.post("/login", response_model=TokenResposta)
def login(dados: UsuarioLogin, session: Session = Depends(get_session)):
    usuario = session.exec(
        select(Usuario).where(Usuario.email == dados.email)
    ).first()

    # Mensagem de erro idêntica pros dois casos (email não existe / senha errada)
    # — isso é proposital, evita que alguém descubra quais emails estão
    # cadastrados só testando o login (boa prática de segurança básica)
    erro_generico = HTTPException(status_code=401, detail="Email ou senha incorretos")

    if not usuario:
        raise erro_generico
    if not verificar_senha(dados.senha, usuario.senha_hash):
        raise erro_generico

    token = criar_token(str(usuario.id))
    return TokenResposta(access_token=token, usuario=usuario)