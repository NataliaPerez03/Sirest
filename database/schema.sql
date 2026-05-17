CREATE DATABASE IF NOT EXISTS sirest;
USE sirest;

-- =========================================
-- Creación de tablas
-- =========================================

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario    INT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre        VARCHAR(80)  NOT NULL,
    id_rol        INT          NOT NULL,
    activo        BOOLEAN      DEFAULT TRUE,
    fecha_creacion DATETIME    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS producto (
    id_producto  INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL,
    descripcion  TEXT,
    id_categoria INT,
    precio       DECIMAL(10,2) NOT NULL,
    disponible   BOOLEAN       DEFAULT TRUE,
    stock_critico INT          DEFAULT 5,
    stock_actual  INT          DEFAULT 0,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE IF NOT EXISTS mesa (
    id_mesa   INT AUTO_INCREMENT PRIMARY KEY,
    numero    INT         NOT NULL,
    estado    VARCHAR(20) NOT NULL,
    capacidad INT         NOT NULL
);

CREATE TABLE IF NOT EXISTS pedido (
    id_pedido    BIGINT AUTO_INCREMENT PRIMARY KEY,
    tipo_pedido  VARCHAR(20) NOT NULL,
    id_mesa      INT,
    id_mesero    INT,
    estado       VARCHAR(30),
    subtotal     DECIMAL(10,2),
    impuestos    DECIMAL(10,2),
    total        DECIMAL(10,2),
    fecha_creacion DATETIME  DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_mesa)    REFERENCES mesa(id_mesa),
    FOREIGN KEY (id_mesero)  REFERENCES usuarios(id_usuario)
);

CREATE TABLE IF NOT EXISTS detalle_pedido (
    id_detalle      BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_producto     INT    NOT NULL,
    id_pedido       BIGINT NOT NULL,
    cantidad        INT    NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    FOREIGN KEY (id_pedido)   REFERENCES pedido(id_pedido)
);

CREATE TABLE IF NOT EXISTS reserva (
    id_reserva          INT AUTO_INCREMENT PRIMARY KEY,
    id_mesa             INT          NOT NULL,
    nombre_cliente      VARCHAR(100) NOT NULL,
    telefono_cliente    VARCHAR(20),
    fecha_reserva       DATE         NOT NULL,
    hora_reserva        TIME         NOT NULL,
    num_personas        INT          NOT NULL,
    estado              VARCHAR(20),
    id_usuario_registro INT,
    FOREIGN KEY (id_mesa)             REFERENCES mesa(id_mesa),
    FOREIGN KEY (id_usuario_registro) REFERENCES usuarios(id_usuario)
);
