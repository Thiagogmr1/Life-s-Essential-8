# backend/app/limiter.py
"""
Configuração central de Rate Limiting da aplicação NATSA usando slowapi.
Limita requisições por endereço IP para prevenir ataques de força bruta.
"""
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
