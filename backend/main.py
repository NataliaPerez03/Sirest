from fastapi import FastAPI, HTTPException
from backend.schemas.mesa_schema import CambiarEstadoRequest, MesaActualizadaResponse
from backend.schemas.producto_schema import ProductoCreateRequest, ProductoCreateResponse
from backend.repositories.mesa_repository import MesaRepository
from backend.repositories.pedido_repository import PedidoRepository
from backend.repositories.producto_repository import ProductoRepository
from backend.services.mesa_service import MesaService, MesaConPedidoActivoError, MesaNoEncontradaError
from backend.services.producto_service import ProductoService, PrecioInvalidoError, StockInvalidoError
from backend.database.connection import get_connection

app = FastAPI(
    title="SIREST API",
    description="Sistema de Información para Gestión de Restaurante, Reservas y Domicilios",
    version="1.0.0"
)

# ─── ENDPOINTS DE MESAS ───────────────────────────────

# Retorna todas las mesas y su estado actual
@app.get("/mesas")
def obtener_mesas():
    connection = get_connection()
    mesa_repo = MesaRepository(connection)
    return mesa_repo.obtener_todas()

# Cambia el estado de una mesa aplicando reglas de negocio
@app.patch("/mesas/{id_mesa}/estado", response_model=MesaActualizadaResponse)
def cambiar_estado_mesa(id_mesa: int, body: CambiarEstadoRequest):
    connection = get_connection()
    mesa_repo = MesaRepository(connection)
    pedido_repo = PedidoRepository(connection)
    service = MesaService(mesa_repo, pedido_repo)

    try:
        return service.cambiar_estado(id_mesa, body.estado)
    except MesaNoEncontradaError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except MesaConPedidoActivoError as e:
        raise HTTPException(status_code=409, detail=str(e))

# ─── ENDPOINTS DE MENÚ ───────────────────────────────

# Retorna todos los productos del menú
@app.get("/menu")
def obtener_menu():
    connection = get_connection()
    producto_repo = ProductoRepository(connection)
    service = ProductoService(producto_repo)
    return service.obtener_menu()

# Registra un nuevo producto en el menú
@app.post("/menu", response_model=ProductoCreateResponse, status_code=201)
def registrar_producto(body: ProductoCreateRequest):
    connection = get_connection()
    producto_repo = ProductoRepository(connection)
    service = ProductoService(producto_repo)

    try:
        return service.registrar_producto(
            nombre=body.nombre,
            id_categoria=body.id_categoria,
            precio=body.precio,
            stock_actual=body.stock_actual,
            stock_critico=body.stock_critico,
            descripcion=body.descripcion
        )
    except PrecioInvalidoError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except StockInvalidoError as e:
        raise HTTPException(status_code=400, detail=str(e))