/*
  # Ajustes de balance y métodos de pago

  1. Normaliza el método de pago en pedidos, gastos y movimientos de caja
  2. Actualiza los triggers que sincronizan ventas y gastos con la caja
  3. Renueva la vista `balance_caja` con desglose por método de pago y saldos acumulados
*/

-- Normalizar metodoPago en orders
ALTER TABLE orders ALTER COLUMN metodoPago SET DEFAULT 'efectivo';
UPDATE orders SET metodoPago = 'nequi' WHERE metodoPago = 'transferencia';
UPDATE orders SET metodoPago = COALESCE(metodoPago, 'efectivo');
ALTER TABLE orders ALTER COLUMN metodoPago SET NOT NULL;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_metodopago_check'
  ) THEN
    EXECUTE 'ALTER TABLE orders
      ADD CONSTRAINT orders_metodopago_check
      CHECK (metodoPago IN (''efectivo'',''tarjeta'',''nequi''))';
  END IF;
END $$;

-- Añadir metodoPago en gastos
ALTER TABLE gastos ADD COLUMN IF NOT EXISTS metodoPago text;
UPDATE gastos SET metodoPago = 'nequi' WHERE metodoPago = 'transferencia';
UPDATE gastos SET metodoPago = COALESCE(metodoPago, 'efectivo');
ALTER TABLE gastos ALTER COLUMN metodoPago SET DEFAULT 'efectivo';
ALTER TABLE gastos ALTER COLUMN metodoPago SET NOT NULL;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'gastos_metodopago_check'
  ) THEN
    EXECUTE 'ALTER TABLE gastos
      ADD CONSTRAINT gastos_metodopago_check
      CHECK (metodoPago IN (''efectivo'',''tarjeta'',''nequi''))';
  END IF;
END $$;

-- Añadir metodoPago en caja_movimientos
ALTER TABLE caja_movimientos ADD COLUMN IF NOT EXISTS metodoPago text;
UPDATE caja_movimientos SET metodoPago = 'nequi' WHERE metodoPago = 'transferencia';
UPDATE caja_movimientos SET metodoPago = COALESCE(metodoPago, 'efectivo');
ALTER TABLE caja_movimientos ALTER COLUMN metodoPago SET DEFAULT 'efectivo';
ALTER TABLE caja_movimientos ALTER COLUMN metodoPago SET NOT NULL;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'caja_movimientos_metodopago_check'
  ) THEN
    EXECUTE 'ALTER TABLE caja_movimientos
      ADD CONSTRAINT caja_movimientos_metodopago_check
      CHECK (metodoPago IN (''efectivo'',''tarjeta'',''nequi''))';
  END IF;
END $$;

-- Actualizar triggers para reflejar metodoPago
CREATE OR REPLACE FUNCTION insertar_ingreso_desde_order()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO caja_movimientos (tipo, concepto, monto, fecha, metodoPago)
  VALUES ('INGRESO', 'Venta ID ' || NEW.id, NEW.total, NEW.timestamp::date, NEW.metodoPago);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insertar_egreso_desde_gasto()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO caja_movimientos (tipo, concepto, monto, fecha, metodoPago)
  VALUES ('EGRESO', NEW.categoria || ': ' || NEW.descripcion, NEW.monto, NEW.fecha, NEW.metodoPago);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Vista de balance diaria con desgloses y acumulados
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
