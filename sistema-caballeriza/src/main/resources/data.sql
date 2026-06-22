-- Datos semilla (quemados) para desarrollo/demo.
-- Se ejecuta automaticamente al levantar el backend (ver spring.sql.init.mode
-- y spring.jpa.defer-datasource-initialization en application.properties).
--
-- Usa INSERT ... WHERE NOT EXISTS sobre una clave natural (email,
-- identificador, nombre) en vez de ids fijos, para poder sumarse a datos que
-- ya existan en la base sin chocar ni duplicar, sin importar que ids estén
-- ocupados en cada entorno.

INSERT INTO users (active, created_at, email, nombre, password, role)
SELECT true, '2026-06-21 22:33:01.539331', 'xxgabriel528xx@gmail.com', 'GABRIEL MURILLO RUIZ', '$2a$10$h/uxFW5Ry.fjeNhB5i9nOeQ2svlggNdA.WC4ZPqijZT70/EMcupl.', 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'xxgabriel528xx@gmail.com');

INSERT INTO employees (active, created_at, email, nombre, rol, telefono)
SELECT true, '2026-06-22 20:01:13.559031', 'Lucas@gmail.com', 'Lucas', 'CUIDADOR', '00000000'
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE email = 'Lucas@gmail.com');

INSERT INTO horses (active, created_at, edad, foto_url, identificador, nombre, peso, raza, sexo)
SELECT true, '2026-06-22 19:13:10.192622', 2, '/uploads/horses/3249028d-fa7e-4993-99c8-fba6e2f843b7_images.jpg', 'L001', 'Loki', 425.00, 'Cuarto de milla', 'MACHO'
WHERE NOT EXISTS (SELECT 1 FROM horses WHERE identificador = 'L001');

INSERT INTO feeding_plans (active, created_at, descripcion, nombre, horse_id)
SELECT true, '2026-06-22 19:14:43.912365',
       'Ración diaria para caballo adulto en mantenimiento:
heno de pasto (8kg), concentrado (2kg) y agua fresca
ad libitum. Dividido en 2 tomas: mañana y tarde.',
       'Plan Alimentación Básico Adulto',
       (SELECT id FROM horses WHERE identificador = 'L001')
WHERE NOT EXISTS (SELECT 1 FROM feeding_plans WHERE nombre = 'Plan Alimentación Básico Adulto')
  AND EXISTS (SELECT 1 FROM horses WHERE identificador = 'L001');

INSERT INTO inventory (cantidad, created_at, descripcion, nombre, stock_minimo, tipo, unidad, updated_at)
SELECT 500.00, '2026-06-22 20:03:10.949212', 'Heno seco para alimentación diaria de caballos adultos', 'Heno de pasto', 100.00, 'ALIMENTO', 'kg', '2026-06-22 20:03:10.949345'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE nombre = 'Heno de pasto');

INSERT INTO appointments (created_at, cupo_actual, cupo_maximo, estado, fecha_fin, fecha_inicio, notas, tipo, cliente_id, employee_id, horse_id)
SELECT '2026-06-22 20:07:48.299442', 0, NULL, 'CANCELADA', '2026-06-26 17:10:00', '2026-06-25 16:15:00', 'Proceso de alimentación', 'VETERINARIO', NULL,
       (SELECT id FROM employees WHERE email = 'Lucas@gmail.com'),
       (SELECT id FROM horses WHERE identificador = 'L001')
WHERE NOT EXISTS (
  SELECT 1 FROM appointments WHERE fecha_inicio = '2026-06-25 16:15:00' AND notas = 'Proceso de alimentación'
) AND EXISTS (SELECT 1 FROM employees WHERE email = 'Lucas@gmail.com')
  AND EXISTS (SELECT 1 FROM horses WHERE identificador = 'L001');

INSERT INTO appointments (created_at, cupo_actual, cupo_maximo, estado, fecha_fin, fecha_inicio, notas, tipo, cliente_id, employee_id, horse_id)
SELECT '2026-06-22 20:29:50.00353', 0, NULL, 'PENDIENTE', '2026-06-25 16:30:00', '2026-06-23 15:30:00', 'Alimentación ', 'VETERINARIO', NULL,
       (SELECT id FROM employees WHERE email = 'Lucas@gmail.com'),
       (SELECT id FROM horses WHERE identificador = 'L001')
WHERE NOT EXISTS (
  SELECT 1 FROM appointments WHERE fecha_inicio = '2026-06-23 15:30:00' AND notas = 'Alimentación '
) AND EXISTS (SELECT 1 FROM employees WHERE email = 'Lucas@gmail.com')
  AND EXISTS (SELECT 1 FROM horses WHERE identificador = 'L001');
