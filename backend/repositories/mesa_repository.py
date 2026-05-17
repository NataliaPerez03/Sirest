class MesaRepository:

    def __init__(self, connection):
        self.connection = connection

    def obtener_por_id(self, id_mesa: int):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM mesa WHERE id_mesa = %s",
            (id_mesa,)
        )
        return cursor.fetchone()

    def actualizar_estado(self, id_mesa: int, nuevo_estado: str):
        cursor = self.connection.cursor()
        cursor.execute(
            "UPDATE mesa SET estado = %s WHERE id_mesa = %s",
            (nuevo_estado, id_mesa)
        )
        self.connection.commit()

    def obtener_todas(self):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM mesa")
        return cursor.fetchall()