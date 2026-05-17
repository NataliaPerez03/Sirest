class CategoriaRepository:
    def __init__(self, connection):
        self.connection = connection

    def obtener_todas(self):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM categoria ORDER BY nombre")
        return cursor.fetchall()
