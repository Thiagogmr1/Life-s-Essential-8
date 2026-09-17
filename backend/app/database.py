# backend/app/database.py
import os
from urllib.parse import quote_plus
from dotenv import load_dotenv
from sqlmodel import create_engine, Session

load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
_raw_password = os.getenv("DB_PASSWORD")

campos_faltantes = [
    nome
    for nome, val in [
        ("DB_HOST", DB_HOST),
        ("DB_NAME", DB_NAME),
        ("DB_USER", DB_USER),
        ("DB_PASSWORD", _raw_password),
    ]
    if not val
]

if campos_faltantes:
    raise RuntimeError(
        f"Configurações de banco ausentes no .env: {', '.join(campos_faltantes)}. "
        "Consulte backend/.env.example para configurar."
    )

DB_PASSWORD = quote_plus(_raw_password)  # escapa caracteres especiais (@, /, #, etc.)

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False)


def get_session():
    with Session(engine) as session:
        yield session