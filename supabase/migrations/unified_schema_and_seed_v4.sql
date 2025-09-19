
-- unified_schema_and_seed.sql (v4)
-- Incluye: users, customers, menu_items, orders, order_items, empleados, gastos
-- Añade: caja_movimientos + triggers + vista balance_caja
-- Ejecuta en una sola transacción

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Función utilitaria para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- users
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

-- customers
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

-- menu_items (UUID + codigo slug)
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text UNIQUE NOT NULL,
  nombre text NOT NULL,
  precio numeric NOT NULL,
  descripcion text,
  keywords text,
  categoria text NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  inventarioCategoria text NOT NULL,
  inventarioTipo text,
  unidadMedida text
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

-- orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero integer NOT NULL,
  total numeric NOT NULL,
  estado text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  cliente_id uuid REFERENCES customers(id),
  metodoPago text
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

-- order_items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  menu_item_id uuid REFERENCES menu_items(id),
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

-- empleados
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
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'empleados' AND policyname = 'Usuarios autenticados pueden ver empleados'
  ) THEN
    CREATE POLICY "Usuarios autenticados pueden ver empleados"
      ON empleados FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'empleados' AND policyname = 'Usuarios autenticados pueden insertar empleados'
  ) THEN
    CREATE POLICY "Usuarios autenticados pueden insertar empleados"
      ON empleados FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'empleados' AND policyname = 'Usuarios autenticados pueden actualizar empleados'
  ) THEN
    CREATE POLICY "Usuarios autenticados pueden actualizar empleados"
      ON empleados FOR UPDATE TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'empleados' AND policyname = 'Usuarios autenticados pueden eliminar empleados'
  ) THEN
    CREATE POLICY "Usuarios autenticados pueden eliminar empleados"
      ON empleados FOR DELETE TO authenticated USING (true);
  END IF;
END $$;
DROP TRIGGER IF EXISTS update_empleados_updated_at ON empleados;
CREATE TRIGGER update_empleados_updated_at
  BEFORE UPDATE ON empleados
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- gastos
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
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'gastos' AND policyname = 'Usuarios autenticados pueden ver gastos'
  ) THEN
    CREATE POLICY "Usuarios autenticados pueden ver gastos"
      ON gastos FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'gastos' AND policyname = 'Usuarios autenticados pueden insertar gastos'
  ) THEN
    CREATE POLICY "Usuarios autenticados pueden insertar gastos"
      ON gastos FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'gastos' AND policyname = 'Usuarios autenticados pueden actualizar gastos'
  ) THEN
    CREATE POLICY "Usuarios autenticados pueden actualizar gastos"
      ON gastos FOR UPDATE TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'gastos' AND policyname = 'Usuarios autenticados pueden eliminar gastos'
  ) THEN
    CREATE POLICY "Usuarios autenticados pueden eliminar gastos"
      ON gastos FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- caja_movimientos
CREATE TABLE IF NOT EXISTS caja_movimientos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha date DEFAULT CURRENT_DATE,
  tipo text CHECK (tipo IN ('INGRESO','EGRESO')) NOT NULL,
  concepto text NOT NULL,
  monto numeric NOT NULL
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

-- Triggers
CREATE OR REPLACE FUNCTION insertar_ingreso_desde_order()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO caja_movimientos (tipo, concepto, monto, fecha)
  VALUES ('INGRESO', 'Venta ID ' || NEW.id, NEW.total, NEW.timestamp::date);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_order_to_caja ON orders;
CREATE TRIGGER trg_order_to_caja
AFTER INSERT ON orders FOR EACH ROW EXECUTE FUNCTION insertar_ingreso_desde_order();

CREATE OR REPLACE FUNCTION insertar_egreso_desde_gasto()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO caja_movimientos (tipo, concepto, monto, fecha)
  VALUES ('EGRESO', NEW.categoria || ': ' || NEW.descripcion, NEW.monto, NEW.fecha);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_gasto_to_caja ON gastos;
CREATE TRIGGER trg_gasto_to_caja
AFTER INSERT ON gastos FOR EACH ROW EXECUTE FUNCTION insertar_egreso_desde_gasto();

-- Vista balance_caja
CREATE OR REPLACE VIEW balance_caja AS
SELECT
    COALESCE(SUM(o.total), 0) AS ingresos,
    COALESCE((SELECT SUM(g.monto) FROM gastos g), 0) AS gastos,
    COALESCE(SUM(o.total), 0) - COALESCE((SELECT SUM(g.monto) FROM gastos g), 0) AS balance
FROM orders o;

-- Seed menu_items (ejemplo)
INSERT INTO menu_items (codigo, nombre, precio, descripcion, keywords, categoria, stock, inventarioCategoria, inventarioTipo, unidadMedida) VALUES
('sand-jamon-artesano', 'Jamón artesano', 18500, 'Salsa verde, queso doble crema...', 'jamón artesano...', 'Sandwiches', 50, 'No inventariables', 'cantidad', 'kg');

COMMIT;

-- unified_schema_and_seed.sql (v5)
-- Basado en v4, se agregan relaciones explícitas en caja_movimientos hacia orders y gastos

BEGIN;

-- =============
-- Caja Movimientos (ajustada con relaciones)
-- =============
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
      ON caja_movimientos FOR ALL TO authenticated
      USING (true) WITH CHECK (true);
  END IF;
END $$;

-- =============
-- Trigger para ingresos (orders → caja_movimientos)
-- =============
CREATE OR REPLACE FUNCTION insertar_ingreso_desde_order()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO caja_movimientos (tipo, concepto, monto, fecha, metodoPago, order_id)
  VALUES ('INGRESO', 'Venta #' || NEW.numero, NEW.total, NEW.timestamp::date, NEW.metodoPago, NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_order_to_caja ON orders;
CREATE TRIGGER trg_order_to_caja
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION insertar_ingreso_desde_order();

-- =============
-- Trigger para egresos (gastos → caja_movimientos)
-- =============
CREATE OR REPLACE FUNCTION insertar_egreso_desde_gasto()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO caja_movimientos (tipo, concepto, monto, fecha, metodoPago, gasto_id)
  VALUES ('EGRESO', NEW.categoria || ': ' || NEW.descripcion, NEW.monto, NEW.fecha, NEW.metodoPago, NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_gasto_to_caja ON gastos;
CREATE TRIGGER trg_gasto_to_caja
AFTER INSERT ON gastos
FOR EACH ROW
EXECUTE FUNCTION insertar_egreso_desde_gasto();

-- =============
-- Vista balance_caja (igual a v4, pero ahora datos vienen enlazados)
-- =============
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
  ingresos_efectivo - egresos_efectivo AS saldo_efectivo_dia,
  ingresos_nequi - egresos_nequi AS saldo_nequi_dia,
  ingresos_tarjeta - egresos_tarjeta AS saldo_tarjeta_dia,
  SUM(ingresos_totales - egresos_totales) OVER (ORDER BY fecha) AS saldo_total_acumulado,
  SUM(ingresos_efectivo - egresos_efectivo) OVER (ORDER BY fecha) AS saldo_efectivo_acumulado,
  SUM(ingresos_nequi - egresos_nequi) OVER (ORDER BY fecha) AS saldo_nequi_acumulado,
  SUM(ingresos_tarjeta - egresos_tarjeta) OVER (ORDER BY fecha) AS saldo_tarjeta_acumulado
FROM resumen
ORDER BY fecha DESC;

COMMIT;

