# backend/app/main.py
import os
from fastapi import FastAPI, Depends, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, func, select
from slowapi.errors import RateLimitExceeded
from app.database import get_session
from app.models import Usuario
from app.limiter import limiter
from app.routers import usuarios, avaliacoes, estatisticas

app = FastAPI(title="NATSA API")
app.state.limiter = limiter


@app.exception_handler(RateLimitExceeded)
def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Muitas tentativas em pouco tempo. Aguarde um momento antes de tentar novamente."},
    )


# ENV deve ser "production" quando a universidade fizer o deploy —
# controla CORS e a flag Secure do cookie de autenticação (ver auth.py).
ENV = os.getenv("ENV", "dev")

FRONTEND_ORIGINS = (
    os.getenv("FRONTEND_URL", "").split(",")
    if ENV == "production"
    else ["http://localhost:5173"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin for origin in FRONTEND_ORIGINS if origin],
    allow_credentials=True,  # obrigatório para o cookie httpOnly funcionar cross-origin
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(usuarios.router)
app.include_router(avaliacoes.router)
app.include_router(estatisticas.router)


@app.get("/")
def read_root():
    return {"status": "API do NATSA no ar"}


@app.get("/health/db")
def check_database(session: Session = Depends(get_session)):
    total = session.exec(select(func.count()).select_from(Usuario)).one()
    return {"conexao": "ok"}