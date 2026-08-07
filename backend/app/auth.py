# backend/app/auth.py
import os
from datetime import datetime, timedelta, timezone
import bcrypt
import jwt

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError(
        "JWT_SECRET_KEY não configurada. Defina essa variável de ambiente "
        "antes de iniciar a aplicação."
    )

ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 dias

COOKIE_NAME = "access_token"
COOKIE_MAX_AGE = TOKEN_EXPIRE_MINUTES * 60  # em segundos
# Em produção (front e back em domínios diferentes, ex: Vercel + Railway),
# cookies cross-site exigem SameSite=None + Secure=True.
# Em dev local (localhost:5173 -> localhost:8000), front e back são
# "same-site" (mesmo domínio, portas diferentes), então SameSite=Lax
# já funciona e não exige HTTPS.
COOKIE_SECURE = os.getenv("ENV", "dev") == "production"
COOKIE_SAMESITE = "none" if COOKIE_SECURE else "lax"


def hash_senha(senha: str) -> str:
    senha_bytes = senha.encode("utf-8")[:72]
    hash_bytes = bcrypt.hashpw(senha_bytes, bcrypt.gensalt())
    return hash_bytes.decode("utf-8")


def verificar_senha(senha_texto: str, senha_hash: str) -> bool:
    senha_bytes = senha_texto.encode("utf-8")[:72]
    return bcrypt.checkpw(senha_bytes, senha_hash.encode("utf-8"))


def criar_token(usuario_id: str) -> str:
    expira_em = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    payload = {"sub": usuario_id, "exp": expira_em}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decodificar_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except jwt.PyJWTError:
        return None