class ProductoRepository:
    def __init__(self, connection):
        self.connection = connection

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

    def obtener_todos(self):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM producto")
        return cursor.fetchall()

    def obtener_por_id(self, id_producto: int):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM producto WHERE id_producto = %s",
            (id_producto,)
        )
        return cursor.fetchone()

    def actualizar(self, id_producto: int, campos: dict) -> bool:
        if not campos:
            return False
        if "stock_actual" in campos:
            campos["disponible"] = campos["stock_actual"] > 0
        set_clause = ", ".join(f"{k} = %s" for k in campos)
        values = list(campos.values()) + [id_producto]
        cursor = self.connection.cursor()
        cursor.execute(
            f"UPDATE producto SET {set_clause} WHERE id_producto = %s",
            values,
        )
        self.connection.commit()
        return cursor.rowcount > 0

    def desactivar(self, id_producto: int) -> bool:
        cursor = self.connection.cursor()
        cursor.execute(
            "UPDATE producto SET disponible = FALSE, stock_actual = 0 WHERE id_producto = %s",
            (id_producto,),
        )
        self.connection.commit()
        return cursor.rowcount > 0
