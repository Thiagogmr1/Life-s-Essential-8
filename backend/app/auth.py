# backend/app/auth.py
import os
import bcrypt
from datetime import datetime, timedelta
import jwt

SECRET_KEY = os.getenv("DB_SECRET_KEY")
ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 60 * 24 * 7


def hash_senha(senha: str) -> str:
    senha_bytes = senha.encode("utf-8")[:72]  # limite real do bcrypt
    hash_bytes = bcrypt.hashpw(senha_bytes, bcrypt.gensalt())
    return hash_bytes.decode("utf-8")


def verificar_senha(senha_texto: str, senha_hash: str) -> bool:
    senha_bytes = senha_texto.encode("utf-8")[:72]
    return bcrypt.checkpw(senha_bytes, senha_hash.encode("utf-8"))


def criar_token(usuario_id: str) -> str:
    expira_em = datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    payload = {"sub": usuario_id, "exp": expira_em}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decodificar_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except jwt.PyJWTError:
        return None