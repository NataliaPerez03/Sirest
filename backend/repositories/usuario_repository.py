class UsuarioRepository:
    def __init__(self, connection):
        self.connection = connection

    def obtener_por_username(self, username: str):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM usuarios WHERE username = %s AND activo = TRUE",
            (username,)
        )
        return cursor.fetchone()
