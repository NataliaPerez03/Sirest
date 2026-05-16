from datetime import datetime

# Errores personalizados para cada situación
class MesaConPedidoActivoError(Exception):
    pass

class MesaNoEncontradaError(Exception):
    pass

class MesaService:
    def __init__(self, mesa_repository, pedido_repository):
        self.mesa_repository = mesa_repository
        self.pedido_repository = pedido_repository

    def cambiar_estado(self, id_mesa: int, nuevo_estado: str):
        # 1. Verificar que la mesa existe
        mesa = self.mesa_repository.obtener_por_id(id_mesa)
        if not mesa:
            raise MesaNoEncontradaError(
                f"Mesa con id {id_mesa} no encontrada"
            )

        estado_anterior = mesa["estado"]

        # 2. REGLA DE NEGOCIO: no se puede liberar una mesa
        # si tiene un pedido activo asociado
        if nuevo_estado == "LIBRE":
            if self.pedido_repository.tiene_pedido_activo(id_mesa):
                raise MesaConPedidoActivoError(
                    "No se puede liberar la mesa. "
                    "Tiene un pedido activo asociado."
                )

        # 3. Si pasa las validaciones, actualizar el estado
        self.mesa_repository.actualizar_estado(id_mesa, nuevo_estado)

        return {
            "mensaje": "Estado de mesa actualizado",
            "id_mesa": id_mesa,
            "estado_anterior": estado_anterior,
            "estado_nuevo": nuevo_estado,
            "actualizado_en": datetime.now()
        }