/*
  # Ajuste de zona horaria y enlaces para el balance diario

  - Sincroniza los triggers de caja para registrar los movimientos con la fecha local (America/Bogota)
  - Rellena los enlaces faltantes entre movimientos y sus pedidos/gastos asociados
  - Corrige las fechas históricas de caja_movimientos usando la hora local de cada pedido
  - Refresca la vista balance_caja para reflejar los cambios
*/

-- Trigger de ingresos: usa la hora local y conserva el enlace con el pedido
CREATE OR REPLACE FUNCTION insertar_ingreso_desde_order()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO caja_movimientos (tipo, concepto, monto, fecha, metodoPago, order_id)
  VALUES (
    'INGRESO',
    'Venta #' || NEW.numero,
    NEW.total,
    (NEW.timestamp AT TIME ZONE 'America/Bogota')::date,
    NEW.metodoPago,
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger de egresos: mantiene el enlace con el gasto
CREATE OR REPLACE FUNCTION insertar_egreso_desde_gasto()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO caja_movimientos (tipo, concepto, monto, fecha, metodoPago, gasto_id)
  VALUES (
    'EGRESO',
    NEW.categoria || ': ' || NEW.descripcion,
    NEW.monto,
    NEW.fecha,
    NEW.metodoPago,
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Vincular movimientos existentes con sus pedidos correspondientes cuando sea posible
UPDATE caja_movimientos cm
SET
  order_id = COALESCE(cm.order_id, o.id),
  metodoPago = COALESCE(cm.metodoPago, o.metodoPago),
  fecha = CASE
    WHEN cm.tipo = 'INGRESO' THEN (o.timestamp AT TIME ZONE 'America/Bogota')::date
    ELSE cm.fecha
  END
FROM orders o
WHERE cm.tipo = 'INGRESO'
  AND (
    cm.order_id = o.id
    OR (cm.order_id IS NULL AND (cm.concepto = 'Venta #' || o.numero OR cm.concepto = 'Venta ID ' || o.id))
  )
  AND (
    cm.order_id IS DISTINCT FROM o.id
    OR cm.metodoPago IS DISTINCT FROM o.metodoPago
    OR cm.fecha IS DISTINCT FROM (o.timestamp AT TIME ZONE 'America/Bogota')::date
  );

-- Vincular movimientos existentes con sus gastos asociados
UPDATE caja_movimientos cm
SET
  gasto_id = COALESCE(cm.gasto_id, g.id),
  metodoPago = COALESCE(cm.metodoPago, g.metodoPago),
  fecha = CASE
    WHEN cm.tipo = 'EGRESO' THEN g.fecha
    ELSE cm.fecha
  END
FROM gastos g
WHERE cm.tipo = 'EGRESO'
  AND (
    cm.gasto_id = g.id
    OR (cm.gasto_id IS NULL AND cm.concepto = g.categoria || ': ' || g.descripcion)
  )
  AND (
    cm.gasto_id IS DISTINCT FROM g.id
    OR cm.metodoPago IS DISTINCT FROM g.metodoPago
    OR cm.fecha IS DISTINCT FROM g.fecha
  );

-- Vista balance_caja actualizada (mismo cálculo, se recrea para asegurar consistencia)
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
