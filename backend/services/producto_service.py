class PrecioInvalidoError(Exception):
    pass

class StockInvalidoError(Exception):
    pass

class ProductoNoEncontradoError(Exception):
    pass


class ProductoService:

    def __init__(self, producto_repository):
        self.producto_repository = producto_repository

    def registrar_producto(self, nombre: str, id_categoria: int,
                           precio: float, stock_actual: int,
                           stock_critico: int, descripcion: str = None):
        if precio <= 0:
            raise PrecioInvalidoError("El precio debe ser mayor a cero.")
        if stock_actual < 0 or stock_critico < 0:
            raise StockInvalidoError("El stock no puede ser negativo.")

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
            "alerta_stock_critico": alerta_stock_critico,
        }

    def obtener_menu(self):
        productos = self.producto_repository.obtener_todos()
        for p in productos:
            p["alerta_stock_critico"] = p["stock_actual"] <= p["stock_critico"]
        return productos

    def actualizar_producto(self, id_producto: int, datos):
        producto = self.producto_repository.obtener_por_id(id_producto)
        if not producto:
            raise ProductoNoEncontradoError(
                f"Producto con id {id_producto} no encontrado"
            )
        if datos.precio is not None and datos.precio <= 0:
            raise PrecioInvalidoError("El precio debe ser mayor a cero.")
        if datos.stock_actual is not None and datos.stock_actual < 0:
            raise StockInvalidoError("El stock no puede ser negativo.")

        campos = {k: v for k, v in datos.model_dump().items() if v is not None}
        self.producto_repository.actualizar(id_producto, campos)

        return {"mensaje": "Producto actualizado correctamente", "id_producto": id_producto}

    def eliminar_producto(self, id_producto: int):
        producto = self.producto_repository.obtener_por_id(id_producto)
        if not producto:
            raise ProductoNoEncontradoError(
                f"Producto con id {id_producto} no encontrado"
            )
        self.producto_repository.desactivar(id_producto)
        return {"mensaje": "Plato eliminado"}
