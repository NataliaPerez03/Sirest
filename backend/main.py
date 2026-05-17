import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from backend.schemas.mesa_schema import CambiarEstadoRequest, MesaActualizadaResponse
from backend.schemas.producto_schema import (
    ProductoCreateRequest, ProductoCreateResponse,
    ProductoUpdateRequest, ProductoUpdateResponse,
)
from backend.schemas.auth_schema import LoginRequest, TokenResponse
from backend.repositories.mesa_repository import MesaRepository
from backend.repositories.pedido_repository import PedidoRepository
from backend.repositories.producto_repository import ProductoRepository
from backend.repositories.usuario_repository import UsuarioRepository
from backend.repositories.categoria_repository import CategoriaRepository
from backend.services.mesa_service import MesaService, MesaConPedidoActivoError, MesaNoEncontradaError
from backend.services.producto_service import (
    ProductoService, PrecioInvalidoError, StockInvalidoError, ProductoNoEncontradoError,
)
from backend.services.auth_service import AuthService, CredencialesInvalidasError
from backend.database.connection import get_connection

SECRET_KEY = os.getenv("SECRET_KEY", "sirest-dev-secret-change-in-production")
ALGORITHM = "HS256"

app = FastAPI(
    title="SIREST API",
    description="Sistema de Información para Gestión de Restaurante, Reservas y Domicilios",
    version="2.0.0",
)

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:4173",
    os.getenv("FRONTEND_URL", "https://sirest-nu.vercel.app"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

_security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(_security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")


def require_admin_or_chef(user: dict = Depends(get_current_user)):
    if user.get("id_rol") not in (1, 2):
        raise HTTPException(status_code=403, detail="Se requiere rol de Administrador o Chef")
    return user


# ─── HEALTH ───────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok"}


# ─── AUTH ─────────────────────────────────────────────

@app.post("/auth/login", response_model=TokenResponse)
def login(body: LoginRequest):
    connection = get_connection()
    try:
        usuario_repo = UsuarioRepository(connection)
        service = AuthService(usuario_repo)
        try:
            return service.login(body.username, body.password)
        except CredencialesInvalidasError as e:
            raise HTTPException(status_code=401, detail=str(e))
    finally:
        connection.close()


# ─── MESAS ────────────────────────────────────────────

@app.get("/mesas")
def obtener_mesas(user: dict = Depends(get_current_user)):
    connection = get_connection()
    try:
        return MesaRepository(connection).obtener_todas()
    finally:
        connection.close()


@app.patch("/mesas/{id_mesa}/estado", response_model=MesaActualizadaResponse)
def cambiar_estado_mesa(id_mesa: int, body: CambiarEstadoRequest,
                        user: dict = Depends(get_current_user)):
    connection = get_connection()
    try:
        service = MesaService(MesaRepository(connection), PedidoRepository(connection))
        try:
            return service.cambiar_estado(id_mesa, body.estado)
        except MesaNoEncontradaError as e:
            raise HTTPException(status_code=404, detail=str(e))
        except MesaConPedidoActivoError as e:
            raise HTTPException(status_code=409, detail=str(e))
    finally:
        connection.close()


# ─── MENÚ ─────────────────────────────────────────────

@app.get("/menu")
def obtener_menu(user: dict = Depends(get_current_user)):
    connection = get_connection()
    try:
        return ProductoService(ProductoRepository(connection)).obtener_menu()
    finally:
        connection.close()


@app.post("/menu", response_model=ProductoCreateResponse, status_code=201)
def registrar_producto(body: ProductoCreateRequest,
                       user: dict = Depends(require_admin_or_chef)):
    connection = get_connection()
    try:
        service = ProductoService(ProductoRepository(connection))
        try:
            return service.registrar_producto(
                nombre=body.nombre,
                id_categoria=body.id_categoria,
                precio=body.precio,
                stock_actual=body.stock_actual,
                stock_critico=body.stock_critico,
                descripcion=body.descripcion,
            )
        except PrecioInvalidoError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except StockInvalidoError as e:
            raise HTTPException(status_code=400, detail=str(e))
    finally:
        connection.close()


@app.put("/menu/{id_producto}", response_model=ProductoUpdateResponse)
def actualizar_producto(id_producto: int, body: ProductoUpdateRequest,
                        user: dict = Depends(require_admin_or_chef)):
    connection = get_connection()
    try:
        service = ProductoService(ProductoRepository(connection))
        try:
            return service.actualizar_producto(id_producto, body)
        except ProductoNoEncontradoError as e:
            raise HTTPException(status_code=404, detail=str(e))
        except PrecioInvalidoError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except StockInvalidoError as e:
            raise HTTPException(status_code=400, detail=str(e))
    finally:
        connection.close()


@app.delete("/menu/{id_producto}")
def eliminar_producto(id_producto: int,
                      user: dict = Depends(require_admin_or_chef)):
    connection = get_connection()
    try:
        service = ProductoService(ProductoRepository(connection))
        try:
            return service.eliminar_producto(id_producto)
        except ProductoNoEncontradoError as e:
            raise HTTPException(status_code=404, detail=str(e))
    finally:
        connection.close()


# ─── CATEGORÍAS ───────────────────────────────────────

@app.get("/categorias")
def obtener_categorias(user: dict = Depends(get_current_user)):
    connection = get_connection()
    try:
        return CategoriaRepository(connection).obtener_todas()
    finally:
        connection.close()
