from pydantic import BaseModel
from typing import Optional

# Lo que el usuario envía al API para crear un producto
class ProductoCreateRequest(BaseModel):
    nombre: str
    id_categoria: int
    precio: float
    stock_actual: int
    stock_critico: int
    descripcion: Optional[str] = None

# Lo que el API responde cuando el producto se crea exitosamente
class ProductoCreateResponse(BaseModel):
    mensaje: str
    id_producto: int
    nombre: str
    precio: float
    stock_actual: int
    stock_critico: int
    disponible: bool
    alerta_stock_critico: bool