INSERT INTO usuarios
(username, email, password_hash, nombre, id_rol, activo)
VALUES
('admin', 'admin@sirest.com', '123456', 'Administrador General', 1, TRUE),
('mesero1', 'juan@sirest.com', '123456', 'Juan Pérez', 2, TRUE),
('mesero2', 'maria@sirest.com', '123456', 'María Gómez', 2, TRUE),
('cajero1', 'ana@sirest.com', '123456', 'Ana Torres', 3, TRUE);


INSERT INTO producto
(nombre, descripcion, id_categoria, precio, disponible, stock_critico, stock_actual)
VALUES
('Hamburguesa Clásica', 'Pan artesanal con carne y queso', 1, 18000, TRUE, 5, 30),

('Pizza Pepperoni', 'Pizza mediana pepperoni', 1, 32000, TRUE, 5, 20),

('Coca Cola 400ml', 'Bebida gaseosa', 2, 5000, TRUE, 10, 50),

('Papas Francesas', 'Porción grande de papas', 1, 8000, TRUE, 5, 40),

('Jugo Natural', 'Jugo de naranja natural', 3, 7000, TRUE, 5, 25);


INSERT INTO mesa
(numero, estado, capacidad)
VALUES
(1, 'LIBRE', 4),
(2, 'OCUPADA', 2),
(3, 'RESERVADA', 6),
(4, 'LIBRE', 8),
(5, 'OCUPADA', 4);


INSERT INTO pedido
(tipo_pedido, id_mesa, id_mesero, estado, subtotal, impuestos, total)
VALUES
('SALA', 2, 2, 'PENDIENTE', 37000, 7030, 44030),

('SALA', 5, 3, 'ENTREGADO', 50000, 9500, 59500),

('DOMICILIO', NULL, 3, 'PREPARANDO', 25000, 4750, 29750);


INSERT INTO detalle_pedido
(id_producto, id_pedido, cantidad, precio_unitario)
VALUES
(1, 1, 1, 18000),
(3, 1, 1, 5000),
(4, 1, 1, 8000),
(2, 2, 1, 32000),
(5, 2, 2, 7000),
(1, 3, 1, 18000),
(3, 3, 1, 5000);


INSERT INTO reserva
(id_mesa, nombre_cliente, telefono_cliente,
 fecha_reserva, hora_reserva,
 num_personas, estado, id_usuario_registro)
VALUES
(3, 'Carlos Ramírez', '3001234567',
 '2025-05-20', '19:00:00',
 5, 'CONFIRMADA', 1),

(4, 'Laura Fernández', '3019876543',
 '2025-05-21', '20:30:00',
 6, 'PENDIENTE', 1),

(1, 'Pedro Martínez', '3102223344',
 '2025-05-22', '18:00:00',
 2, 'CONFIRMADA', 2);