# backend/app/dependencies.py
import uuid
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session
from app.database import get_session
from app.models import Usuario
from app.auth import decodificar_token

security = HTTPBearer()


def get_usuario_atual(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session),
) -> Usuario:
    token = credentials.credentials
    usuario_id = decodificar_token(token)

    if not usuario_id:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

    usuario = session.get(Usuario, uuid.UUID(usuario_id))
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")

    return usuario