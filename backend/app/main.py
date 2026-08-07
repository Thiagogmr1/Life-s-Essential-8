# backend/app/main.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from app.database import get_session
from app.models import Usuario
from app.routers import usuarios, avaliacoes

app = FastAPI(title="Life's Essential 8 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(usuarios.router)
app.include_router(avaliacoes.router)


@app.get("/")
def read_root():
    return {"status": "API do Life's Essential 8 no ar"}


@app.get("/health/db")
def check_database(session: Session = Depends(get_session)):
    usuarios_lista = session.exec(select(Usuario)).all()
    return {"conexao": "ok", "total_usuarios": len(usuarios_lista)}