-- 20250924194500_unified_schema_and_seed.sql
-- Migración unificada SAVIA (local/ci): esquema + RLS + triggers + vista + seeds mínimos
-- Integra: creación de gastos y policies, seed de menú adaptado, normalización de metodoPago y balance_caja

BEGIN;

-- =========
-- Extensiones / utilidades
-- =========
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========
-- Tablas base (orden por dependencias)
-- =========

-- 1) users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can read own data'
  ) THEN
    CREATE POLICY "Users can read own data"
      ON users FOR SELECT TO authenticated USING (auth.uid() = id);
  END IF;
END $$;

-- 2) customers (antes de orders para resolver FK)
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  telefono text NOT NULL
);
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'customers' AND policyname = 'Authenticated users can perform all actions'
  ) THEN
    CREATE POLICY "Authenticated users can perform all actions"
      ON customers FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 3) menu_items
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text UNIQUE,                         -- slug/código de ítem
  nombre text NOT NULL,
  precio numeric NOT NULL,
  descripcion text,
  keywords text,
  categoria text NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  inventarioCategoria text NOT NULL,          -- "Inventariables" / "No inventariables"
  inventarioTipo text,                        -- "unidad", "peso", "volumen", etc.
  unidadMedida text                           -- "unidad", "g", "ml", "taza", etc.
);
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'menu_items' AND policyname = 'Authenticated users can perform CRUD operations'
  ) THEN
    CREATE POLICY "Authenticated users can perform CRUD operations"
      ON menu_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 4) orders (depende de customers)
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero integer NOT NULL,
  total numeric NOT NULL,
  estado text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  cliente_id uuid NULL REFERENCES customers(id),
  metodoPago text NULL
);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Authenticated users can perform all actions'
  ) THEN
    CREATE POLICY "Authenticated users can perform all actions"
      ON orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 5) order_items (depende de orders y menu_items)
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id),
  menu_item_id uuid NOT NULL REFERENCES menu_items(id),
  cantidad integer NOT NULL,
  notas text
);
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'Authenticated users can perform all actions'
  ) THEN
    CREATE POLICY "Authenticated users can perform all actions"
      ON order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 6) empleados
CREATE TABLE IF NOT EXISTS empleados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  telefono text,
  email text,
  horas_dia integer DEFAULT 8,
  dias_semana integer DEFAULT 5,
  salario_hora numeric DEFAULT 0,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE empleados ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='empleados' AND policyname='Usuarios autenticados pueden ver empleados') THEN
    CREATE POLICY "Usuarios autenticados pueden ver empleados" ON empleados FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='empleados' AND policyname='Usuarios autenticados pueden insertar empleados') THEN
    CREATE POLICY "Usuarios autenticados pueden insertar empleados" ON empleados FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='empleados' AND policyname='Usuarios autenticados pueden actualizar empleados') THEN
    CREATE POLICY "Usuarios autenticados pueden actualizar empleados" ON empleados FOR UPDATE TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='empleados' AND policyname='Usuarios autenticados pueden eliminar empleados') THEN
    CREATE POLICY "Usuarios autenticados pueden eliminar empleados" ON empleados FOR DELETE TO authenticated USING (true);
  END IF;
END $$;
DROP TRIGGER IF EXISTS update_empleados_updated_at ON empleados;
CREATE TRIGGER update_empleados_updated_at
  BEFORE UPDATE ON empleados
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7) gastos (tomado y adaptado; luego se normaliza metodoPago más abajo)
CREATE TABLE IF NOT EXISTS gastos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  descripcion text NOT NULL,
  monto numeric NOT NULL,
  categoria text NOT NULL,
  fecha date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='gastos' AND policyname='Usuarios autenticados pueden ver gastos') THEN
    CREATE POLICY "Usuarios autenticados pueden ver gastos" ON gastos FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='gastos' AND policyname='Usuarios autenticados pueden insertar gastos') THEN
    CREATE POLICY "Usuarios autenticados pueden insertar gastos" ON gastos FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='gastos' AND policyname='Usuarios autenticados pueden actualizar gastos') THEN
    CREATE POLICY "Usuarios autenticados pueden actualizar gastos" ON gastos FOR UPDATE TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='gastos' AND policyname='Usuarios autenticados pueden eliminar gastos') THEN
    CREATE POLICY "Usuarios autenticados pueden eliminar gastos" ON gastos FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- 8) caja_movimientos (depende de orders y gastos)
DROP TABLE IF EXISTS caja_movimientos CASCADE;
CREATE TABLE caja_movimientos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha date DEFAULT CURRENT_DATE,
  tipo text CHECK (tipo IN ('INGRESO','EGRESO')) NOT NULL,
  concepto text NOT NULL,
  monto numeric NOT NULL,
  metodoPago text NOT NULL DEFAULT 'efectivo' CHECK (metodoPago IN ('efectivo','tarjeta','nequi')),
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  gasto_id uuid REFERENCES gastos(id) ON DELETE SET NULL
);
ALTER TABLE caja_movimientos ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'caja_movimientos' AND policyname = 'Usuarios autenticados pueden gestionar caja'
  ) THEN
    CREATE POLICY "Usuarios autenticados pueden gestionar caja"
      ON caja_movimientos FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- =========
-- Normalización de metodoPago + checks (orders, gastos, caja_movimientos)
-- =========
-- orders
ALTER TABLE orders ALTER COLUMN metodoPago SET DEFAULT 'efectivo';
UPDATE orders SET metodoPago = 'nequi' WHERE metodoPago = 'transferencia';
UPDATE orders SET metodoPago = COALESCE(metodoPago, 'efectivo');
ALTER TABLE orders ALTER COLUMN metodoPago SET NOT NULL;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='orders_metodopago_check') THEN
    EXECUTE $SQL$
      ALTER TABLE orders
      ADD CONSTRAINT orders_metodopago_check
      CHECK (metodoPago IN ('efectivo','tarjeta','nequi'))
    $SQL$;
  END IF;
END $$;

-- gastos
ALTER TABLE gastos ADD COLUMN IF NOT EXISTS metodoPago text;
UPDATE gastos SET metodoPago = 'nequi' WHERE metodoPago = 'transferencia';
UPDATE gastos SET metodoPago = COALESCE(metodoPago, 'efectivo');
ALTER TABLE gastos ALTER COLUMN metodoPago SET DEFAULT 'efectivo';
ALTER TABLE gastos ALTER COLUMN metodoPago SET NOT NULL;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='gastos_metodopago_check') THEN
    EXECUTE $SQL$
      ALTER TABLE gastos
      ADD CONSTRAINT gastos_metodopago_check
      CHECK (metodoPago IN ('efectivo','tarjeta','nequi'))
    $SQL$;
  END IF;
END $$;

-- caja_movimientos (columna ya creada arriba con DEFAULT+CHECK)

-- =========
-- Triggers (orders → caja, gastos → caja)
-- =========
CREATE OR REPLACE FUNCTION insertar_ingreso_desde_order()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO caja_movimientos (tipo, concepto, monto, fecha, metodoPago, order_id)
  VALUES ('INGRESO', 'Venta #' || NEW.numero, NEW.total, NEW.timestamp::date, COALESCE(NEW.metodoPago,'efectivo'), NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_order_to_caja ON orders;
CREATE TRIGGER trg_order_to_caja
AFTER INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION insertar_ingreso_desde_order();

CREATE OR REPLACE FUNCTION insertar_egreso_desde_gasto()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO caja_movimientos (tipo, concepto, monto, fecha, metodoPago, gasto_id)
  VALUES ('EGRESO', NEW.categoria || ': ' || NEW.descripcion, NEW.monto, NEW.fecha, COALESCE(NEW.metodoPago,'efectivo'), NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_gasto_to_caja ON gastos;
CREATE TRIGGER trg_gasto_to_caja
AFTER INSERT ON gastos
FOR EACH ROW EXECUTE FUNCTION insertar_egreso_desde_gasto();

-- =========
-- Vista balance_caja (diaria, con desgloses y acumulados)
-- =========
CREATE OR REPLACE VIEW balance_caja AS
WITH resumen AS (
  SELECT
    fecha,
    SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE 0 END) AS ingresos_totales,
    SUM(CASE WHEN tipo = 'EGRESO' THEN monto ELSE 0 END) AS egresos_totales,
    SUM(CASE WHEN tipo = 'INGRESO' AND metodoPago = 'efectivo' THEN monto ELSE 0 END) AS ingresos_efectivo,
    SUM(CASE WHEN tipo = 'EGRESO' AND metodoPago = 'efectivo' THEN monto ELSE 0 END) AS egresos_efectivo,
    SUM(CASE WHEN tipo = 'INGRESO' AND metodoPago = 'nequi' THEN monto ELSE 0 END) AS ingresos_nequi,
    SUM(CASE WHEN tipo = 'EGRESO' AND metodoPago = 'nequi' THEN monto ELSE 0 END) AS egresos_nequi,
    SUM(CASE WHEN tipo = 'INGRESO' AND metodoPago = 'tarjeta' THEN monto ELSE 0 END) AS ingresos_tarjeta,
    SUM(CASE WHEN tipo = 'EGRESO' AND metodoPago = 'tarjeta' THEN monto ELSE 0 END) AS egresos_tarjeta
  FROM caja_movimientos
  GROUP BY fecha
)
SELECT
  fecha,
  ingresos_totales,
  egresos_totales,
  ingresos_totales - egresos_totales AS balance_diario,
  ingresos_efectivo,
  egresos_efectivo,
  ingresos_nequi,
  egresos_nequi,
  ingresos_tarjeta,
  egresos_tarjeta,
  (ingresos_efectivo - egresos_efectivo) AS saldo_efectivo_dia,
  (ingresos_nequi - egresos_nequi)       AS saldo_nequi_dia,
  (ingresos_tarjeta - egresos_tarjeta)   AS saldo_tarjeta_dia,
  SUM(ingresos_totales - egresos_totales) OVER (ORDER BY fecha)        AS saldo_total_acumulado,
  SUM(ingresos_efectivo - egresos_efectivo) OVER (ORDER BY fecha)      AS saldo_efectivo_acumulado,
  SUM(ingresos_nequi - egresos_nequi) OVER (ORDER BY fecha)            AS saldo_nequi_acumulado,
  SUM(ingresos_tarjeta - egresos_tarjeta) OVER (ORDER BY fecha)        AS saldo_tarjeta_acumulado
FROM resumen
ORDER BY fecha DESC;

-- =========
-- Seed mínimo (catálogo adaptado a columnas camelCase)
-- (Toma referencias del seed que compartiste; mapeado a codigo + camelCase)
-- =========

-- Limpieza opcional para entorno local de desarrollo:
-- DELETE FROM menu_items;

-- Sandwiches
INSERT INTO menu_items (codigo, nombre, precio, descripcion, keywords, categoria, stock, inventarioCategoria, inventarioTipo, unidadMedida) VALUES
('sand-jamon-artesano','Jamón artesano',18500,'Salsa verde, queso doble crema, jamón de cerdo, rúgula, tomates horneados, parmesano.','jamón artesano jamón de cerdo miel de uvilla cebolla tomate horneado rúgula queso tajado queso parmesano salsa verde','Sandwiches',0,'No inventariables','unidad','unidad'),
('sand-del-huerto','Del huerto',15500,'Mayonesa de rostizados, queso feta, rúgula, tomates horneados, champiñones, parmesano, mix de semillas, chips de arracacha.','del huerto champiñones mayonesa rostizada queso feta arracacha tomate horneado semillas calabaza queso tajado','Sandwiches',0,'No inventariables','unidad','unidad'),
('sand-pollo-green','Pollo Green',16500,'Mayonesa de rostizados y verde, jamón de pollo, guacamole, tomate horneado, semillas de girasol, lechuga, tocineta.','pollo green jamón pollo rúgula champiñones parmesano guacamole salsa verde salsa rostizada lechuga tomate horneado semillas','Sandwiches',0,'No inventariables','unidad','unidad'),
('sand-pollo-toscano','Pollo Toscano',18500,'Salsa verde, jamón de pollo, lechuga, rúgula, champiñones, tomates horneados, parmesano, queso doble crema, tocineta, miel de uvilla.','pollo toscano jamón pollo lechuga rúgula champiñones tomate horneado queso tajado parmesano tocineta','Sandwiches',0,'No inventariables','unidad','unidad'),
('sand-mexicano','Mexicano',19000,'Frijol refrito, pollo desmechado, pico de gallo, queso crema tajado, guacamole, sour cream, salsa brava.','mexicano pollo desmechado guacamole pico de gallo frijol refrito salsa brava sour cream queso tajado','Sandwiches',0,'No inventariables','unidad','unidad');

-- Bowls salados
INSERT INTO menu_items (codigo, nombre, precio, descripcion, categoria, stock, inventarioCategoria, inventarioTipo, unidadMedida) VALUES
('bowl-salado','Bowl Salado',15000,'Personaliza tu bowl con 2 bases, 4 toppings y 1 proteína. Incluye bebida.','Bowls Salados',0,'No inventariables','unidad','unidad');

-- Bowls frutales
INSERT INTO menu_items (codigo, nombre, precio, descripcion, keywords, categoria, stock, inventarioCategoria, inventarioTipo, unidadMedida) VALUES
('bowl-acai-supremo','Açaí Supremo',14500,'Base de açaí, fresa, banano, yogurt; toppings kiwi, coco, arándanos, semillas, crema de maní.','açaí fresa banano yogurt leche kiwi coco arándanos semillas crema de maní','Bowls Frutales',0,'No inventariables','unidad','unidad'),
('bowl-tropical','Tropical',12000,'Mango, piña, banano, yogurt; toppings kiwi, granola, semillas de girasol, coco.','tropical mango piña banano yogurt leche kiwi granola semillas coco','Bowls Frutales',0,'No inventariables','unidad','unidad'),
('bowl-vital','Vital',12000,'Mango, banano, piña, espinaca, yogurt/leche; toppings arándano, granola, chía, coco.','vital mango banano piña espinaca yogurt leche arándano granola chía coco','Bowls Frutales',0,'No inventariables','unidad','unidad');

-- Bebidas calientes
INSERT INTO menu_items (codigo, nombre, precio, keywords, categoria, stock, inventarioCategoria, inventarioTipo, unidadMedida) VALUES
('beb-capuccino','Capuccino',6000,'capuccino','Bebidas Calientes',0,'No inventariables','unidad','taza'),
('beb-latte','Latte',5500,'latte','Bebidas Calientes',0,'No inventariables','unidad','taza'),
('beb-americano','Americano',5500,'americano','Bebidas Calientes',0,'No inventariables','unidad','taza'),
('beb-cocoa','Cocoa',6000,'cocoa','Bebidas Calientes',0,'No inventariables','unidad','taza'),
('beb-pitaya-latte','Pitaya Latte',8500,'pitaya latte','Bebidas Calientes',0,'No inventariables','unidad','taza'),
('beb-infusion-frutos','Infusión de frutos rojos',6000,'infusión frutos rojos','Bebidas Calientes',0,'No inventariables','unidad','taza');

-- Acompañamientos
INSERT INTO menu_items (codigo, nombre, precio, keywords, categoria, stock, inventarioCategoria, inventarioTipo, unidadMedida) VALUES
('acomp-torta-dia','Torta del día',8000,'torta del día zanahoria arándanos naranja coco yogurt griego','Acompañamientos',0,'No inventariables','unidad','unidad'),
('acomp-galletas-avena','Galletas de avena',4000,'galletas de avena','Acompañamientos',0,'No inventariables','unidad','unidad'),
('acomp-muffin-queso','Muffin de queso',4500,'muffin de queso','Acompañamientos',0,'No inventariables','unidad','unidad'),
('acomp-tapitas','Tapitas',10000,'pan queso feta tomate al horno albahaca','Acompañamientos',0,'No inventariables','unidad','unidad');

-- Batidos especiales
INSERT INTO menu_items (codigo, nombre, precio, descripcion, keywords, categoria, stock, inventarioCategoria, inventarioTipo, unidadMedida) VALUES
('batido-pink','Pink',12000,'Fresa, banano, yogurt, leche, chía, avena.','pink fresa banano yogurt leche chía avena','Batidos especiales',0,'No inventariables','unidad','unidad'),
('batido-moca-energy','Moca Energy',12000,'Banano, café frío, leche, cacao puro, crema de maní, avena.','moca energy banano café frío leche cacao puro crema de maní avena','Batidos especiales',0,'No inventariables','unidad','unidad'),
('batido-matcha-protein','Matcha Protein',16000,'Té matcha + 1 scoop proteína whey (30 g).','matcha protein té matcha proteína whey 30 g','Batidos especiales',0,'No inventariables','unidad','unidad');

-- Insumos inventariables (ejemplos)
INSERT INTO menu_items (codigo, nombre, precio, categoria, stock, inventarioCategoria, inventarioTipo, unidadMedida) VALUES
('inv-mango','Mango',0,'Frutas',5000,'Inventariables','peso','g'),
('inv-pina','Piña',0,'Frutas',3000,'Inventariables','peso','g'),
('inv-banano','Banano',0,'Frutas',2000,'Inventariables','peso','g'),
('inv-fresa','Fresa',0,'Frutas',1500,'Inventariables','peso','g'),
('inv-kiwi','Kiwi',0,'Frutas',1000,'Inventariables','peso','g'),
('inv-sandia','Sandía',0,'Frutas',4000,'Inventariables','peso','g'),
('inv-acai','Açaí',0,'Frutas',500,'Inventariables','peso','g'),
('inv-pitaya','Pitaya',0,'Frutas',300,'Inventariables','peso','g'),
('inv-arandanos','Arándanos',0,'Frutas',800,'Inventariables','peso','g'),
('inv-yogurt','Yogurt natural',0,'Lácteos',2000,'Inventariables','peso','g'),
('inv-leche','Leche',0,'Lácteos',3000,'Inventariables','volumen','ml'),
('inv-queso-feta','Queso feta',0,'Lácteos',1000,'Inventariables','peso','g'),
('inv-jamon-pollo','Jamón de pollo',0,'Proteínas',1500,'Inventariables','peso','g'),
('inv-jamon-cerdo','Jamón de cerdo',0,'Proteínas',1200,'Inventariables','peso','g'),
('inv-granola','Granola',0,'Cereales',2000,'Inventariables','peso','g'),
('inv-avena','Avena',0,'Cereales',3000,'Inventariables','peso','g'),
('inv-chia','Chía',0,'Semillas',500,'Inventariables','peso','g'),
('inv-cafe','Café',0,'Bebidas',1000,'Inventariables','peso','g'),
('inv-te-matcha','Té matcha',0,'Bebidas',200,'Inventariables','peso','g');

COMMIT;
