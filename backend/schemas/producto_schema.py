from pydantic import BaseModel
from typing import Optional

class ProductoCreateRequest(BaseModel):
    nombre: str
    id_categoria: int
    precio: float
    stock_actual: int
    stock_critico: int
    descripcion: Optional[str] = None

class ProductoCreateResponse(BaseModel):
    mensaje: str
    id_producto: int
    nombre: str
    precio: float
    stock_actual: int
    stock_critico: int
    disponible: bool
    alerta_stock_critico: bool

class ProductoUpdateRequest(BaseModel):
    nombre: Optional[str] = None
    id_categoria: Optional[int] = None
    precio: Optional[float] = None
    stock_actual: Optional[int] = None
    stock_critico: Optional[int] = None
    descripcion: Optional[str] = None

class ProductoUpdateResponse(BaseModel):
    mensaje: str
    id_producto: int
