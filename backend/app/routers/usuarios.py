# backend/app/routers/usuarios.py
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlmodel import Session, select
from app.database import get_session
from app.models import Usuario
from app.schemas import (
    UsuarioCadastro,
    UsuarioLogin,
    TokenResposta,
    UsuarioResposta,
    EsqueciSenhaRequisicao,
    RedefinirSenhaRequisicao,
)
from app.dependencies import get_usuario_atual
from app.limiter import limiter
from app.auth import (
    hash_senha,
    verificar_senha,
    criar_token,
    criar_token_reset_senha,
    decodificar_token_reset_senha,
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
@limiter.limit("5/minute")
def cadastrar(
    request: Request,
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
        data_nascimento=dados.data_nascimento,
        sexo=dados.sexo,
        estado=dados.estado,
        cidade=dados.cidade,
        email=dados.email,
        senha_hash=hash_senha(dados.senha),
    )
    session.add(usuario)
    session.commit()
    session.refresh(usuario)

    _setar_cookie_auth(response, str(usuario.id))
    return TokenResposta(usuario=usuario)


@router.post("/login", response_model=TokenResposta)
@limiter.limit("5/minute")
def login(
    request: Request,
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


@router.get("/me", response_model=UsuarioResposta)
def obter_usuario_atual(usuario_atual: Usuario = Depends(get_usuario_atual)):
    return usuario_atual


@router.post("/forgot-password")
@limiter.limit("3/minute")
def esqueci_senha(
    request: Request,
    dados: EsqueciSenhaRequisicao,
    session: Session = Depends(get_session),
):
    usuario = session.exec(
        select(Usuario).where(Usuario.email == dados.email)
    ).first()

    if usuario:
        token = criar_token_reset_senha(str(usuario.id))
        link = f"http://localhost:5173/redefinir-senha/{token}"
        print(f"\n{'='*50}\n🔗 [Mock Email] Acesse para resetar a senha de {usuario.email}:\n{link}\n{'='*50}\n")

    return {"detail": "Se o e-mail estiver cadastrado, você receberá um link de recuperação."}


@router.post("/reset-password/{token}")
@limiter.limit("5/minute")
def redefinir_senha(
    request: Request,
    token: str,
    dados: RedefinirSenhaRequisicao,
    session: Session = Depends(get_session),
):
    usuario_id = decodificar_token_reset_senha(token)
    if not usuario_id:
        raise HTTPException(
            status_code=400, detail="Token de recuperação inválido ou expirado."
        )

    usuario = session.get(Usuario, usuario_id)
    if not usuario:
        raise HTTPException(
            status_code=400, detail="Usuário não encontrado."
        )

    usuario.senha_hash = hash_senha(dados.nova_senha)
    session.add(usuario)
    session.commit()

    return {"detail": "Senha redefinida com sucesso."}