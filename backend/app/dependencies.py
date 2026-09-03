# backend/app/dependencies.py
import uuid
from fastapi import Depends, HTTPException, Request
from sqlmodel import Session
from app.database import get_session
from app.models import Usuario, RoleEnum
from app.auth import decodificar_token, COOKIE_NAME


def get_usuario_atual(
    request: Request,
    session: Session = Depends(get_session),
) -> Usuario:
    token = request.cookies.get(COOKIE_NAME)

    if not token:
        raise HTTPException(status_code=401, detail="Não autenticado")

    usuario_id = decodificar_token(token)
    if not usuario_id:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

    try:
        usuario_uuid = uuid.UUID(usuario_id)
    except ValueError:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

    usuario = session.get(Usuario, usuario_uuid)
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")

    return usuario


def get_usuario_admin(
    usuario: Usuario = Depends(get_usuario_atual),
) -> Usuario:
    if usuario.role != RoleEnum.ADMIN:
        raise HTTPException(status_code=403, detail="Acesso restrito a administradores")

    return usuario