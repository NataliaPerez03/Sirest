from pydantic import BaseModel
from enum import Enum
from datetime import datetime
from typing import Optional

# Define los únicos valores válidos para el estado de una mesa
class EstadoMesa(str, Enum):
    LIBRE = "LIBRE"
    OCUPADA = "OCUPADA"
    RESERVADA = "RESERVADA"
    MANTENIMIENTO = "MANTENIMIENTO"

# Lo que el usuario envía al API
class CambiarEstadoRequest(BaseModel):
    estado: EstadoMesa

# Lo que el API responde cuando todo sale bien
class MesaActualizadaResponse(BaseModel):
    mensaje: str
    id_mesa: int
    estado_anterior: str
    estado_nuevo: str
    actualizado_en: datetime