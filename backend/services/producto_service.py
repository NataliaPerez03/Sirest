class PrecioInvalidoError(Exception):
    pass

class StockInvalidoError(Exception):
    pass

class ProductoService:

    def __init__(self, producto_repository):
        self.producto_repository = producto_repository

    def registrar_producto(self, nombre: str, id_categoria: int,
                           precio: float, stock_actual: int,
                           stock_critico: int, descripcion: str = None):

        if precio <= 0:
            raise PrecioInvalidoError(
                "El precio debe ser mayor a cero."
            )

        if stock_actual < 0 or stock_critico < 0:
            raise StockInvalidoError(
                "El stock no puede ser negativo."
            )

        disponible = stock_actual > 0
        alerta_stock_critico = stock_actual <= stock_critico

        id_producto = self.producto_repository.guardar(
            nombre, id_categoria, precio,
            stock_actual, stock_critico,
            descripcion, disponible
        )

        return {
            "mensaje": "Producto registrado correctamente",
            "id_producto": id_producto,
            "nombre": nombre,
            "precio": precio,
            "stock_actual": stock_actual,
            "stock_critico": stock_critico,
            "disponible": disponible,
            "alerta_stock_critico": alerta_stock_critico
        }

    def obtener_menu(self):
        productos = self.producto_repository.obtener_todos()
        for producto in productos:
            producto["alerta_stock_critico"] = (
                producto["stock_actual"] <= producto["stock_critico"]
            )
        return productos