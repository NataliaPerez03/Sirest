class ProductoRepository:
    def __init__(self, connection):
        self.connection = connection

    # Inserta un nuevo producto en la base de datos
    def guardar(self, nombre: str, id_categoria: int, precio: float,
                stock_actual: int, stock_critico: int, descripcion: str,
                disponible: bool):
        cursor = self.connection.cursor()
        cursor.execute(
            """INSERT INTO producto 
               (nombre, descripcion, id_categoria, precio, 
                disponible, stock_critico, stock_actual)
               VALUES (%s, %s, %s, %s, %s, %s, %s)""",
            (nombre, descripcion, id_categoria, precio,
             disponible, stock_critico, stock_actual)
        )
        self.connection.commit()
        return cursor.lastrowid

    # Retorna todos los productos del menú
    def obtener_todos(self):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM producto")
        return cursor.fetchall()

    # Busca un producto por su id
    def obtener_por_id(self, id_producto: int):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM producto WHERE id_producto = %s",
            (id_producto,)
        )
        return cursor.fetchone()