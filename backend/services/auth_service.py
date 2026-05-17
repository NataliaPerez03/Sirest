import bcrypt
from datetime import datetime, timedelta, timezone
from jose import jwt
import os

SECRET_KEY = os.getenv("SECRET_KEY", "sirest-dev-secret-change-in-production")
ALGORITHM = "HS256"
TOKEN_EXPIRY_HOURS = 8


class CredencialesInvalidasError(Exception):
    pass


class AuthService:
    def __init__(self, usuario_repository):
        self.usuario_repository = usuario_repository

    def login(self, username: str, password: str):
        usuario = self.usuario_repository.obtener_por_username(username)
        if not usuario:
            raise CredencialesInvalidasError("Credenciales inválidas")

        stored_hash = usuario["password_hash"]
        if isinstance(stored_hash, str):
            stored_hash = stored_hash.encode()

        if not bcrypt.checkpw(password.encode(), stored_hash):
            raise CredencialesInvalidasError("Credenciales inválidas")

        payload = {
            "sub": username,
            "id_usuario": usuario["id_usuario"],
            "id_rol": usuario["id_rol"],
            "exp": datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRY_HOURS),
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

        return {
            "access_token": token,
            "token_type": "bearer",
            "nombre": usuario["nombre"],
            "id_rol": usuario["id_rol"],
        }
