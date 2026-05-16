class PedidoRepository:

    def __init__(self, connection):
        self.connection = connection

    def tiene_pedido_activo(self, id_mesa: int) -> bool:
        cursor = self.connection.cursor()
        cursor.execute(
            """SELECT COUNT(*) FROM pedido 
               WHERE id_mesa = %s 
               AND estado IN ('PENDIENTE', 'PREPARANDO')""",
            (id_mesa,)
        )
        count = cursor.fetchone()[0]
        return count > 0