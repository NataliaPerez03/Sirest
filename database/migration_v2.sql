-- =========================================
-- Migración v2: agregar tabla categoria y FK
-- Ejecutar sobre la BD existente en Railway
-- =========================================

-- 1. Crear tabla categoria
CREATE TABLE IF NOT EXISTS categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(80) NOT NULL UNIQUE
);

-- 2. Poblar categorias que ya usa el seed
INSERT IGNORE INTO categoria (id_categoria, nombre) VALUES
(1, 'Platos Principales'),
(2, 'Bebidas'),
(3, 'Jugos y Naturales');

-- 3. Agregar FK en producto (solo si no existe)
ALTER TABLE producto
    ADD CONSTRAINT fk_producto_categoria
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria);

-- 4. Actualizar contraseñas a bcrypt
--    Roles: 1=ADMIN  2=CHEF  3=MESERO
--    Contraseñas: admin → admin123 | chef → chef123 | meseros → 123456
UPDATE usuarios SET
    password_hash = '$2b$12$Cnm1UEgEi/5rUgphSdYHNO4WG.vLHPylUiwojup1kYAAA/ykxmzpa',
    id_rol = 1
WHERE username = 'admin';

UPDATE usuarios SET
    password_hash = '$2b$12$XKiO6sEFZrcVkQAuGfQ5ue.qcDsnOY3EqjS/r7tKgtA4XvSJc6DKe',
    id_rol = 3
WHERE username IN ('mesero1', 'mesero2', 'cajero1');

-- 5. Insertar usuario chef si no existe
INSERT IGNORE INTO usuarios (username, email, password_hash, nombre, id_rol, activo)
VALUES ('chef1', 'chef@sirest.com',
        '$2b$12$tlOk8pTQQ1rrAsXRO3X0L.DvcE0avzT3hHgbSSrQjh87bVcLzf.gq',
        'Chef Principal', 2, TRUE);

-- 6. Agregar SECRET_KEY en .env del servidor (no se hace por SQL)
--    SECRET_KEY=<genera con: python3 -c "import secrets; print(secrets.token_hex(32))")
