-- Sincronización robusta de crédito empleados + provisión en gastos

-- 1) Orders: persistir método de pago explícito para sincronización entre navegadores
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS metodo_pago text;

ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_metodo_pago_check;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_metodo_pago_check
  CHECK (
    metodo_pago IS NULL
    OR metodo_pago IN ('efectivo', 'tarjeta', 'nequi', 'provision_caja', 'credito_empleados')
  );

-- Backfill suave para registros existentes sin método
UPDATE public.orders o
SET metodo_pago = CASE
  WHEN EXISTS (
    SELECT 1
    FROM public.employee_credit_history ech
    WHERE ech.order_id = o.id
      AND ech.tipo = 'cargo'
  ) THEN 'credito_empleados'
  WHEN COALESCE(o.pago_efectivo, 0) >= GREATEST(COALESCE(o.pago_nequi, 0), COALESCE(o.pago_tarjeta, 0))
    AND COALESCE(o.pago_efectivo, 0) > 0 THEN 'efectivo'
  WHEN COALESCE(o.pago_nequi, 0) >= GREATEST(COALESCE(o.pago_efectivo, 0), COALESCE(o.pago_tarjeta, 0))
    AND COALESCE(o.pago_nequi, 0) > 0 THEN 'nequi'
  WHEN COALESCE(o.pago_tarjeta, 0) > 0 THEN 'tarjeta'
  ELSE o.metodo_pago
END
WHERE o.metodo_pago IS NULL;

-- 2) Índices para hidratación de crédito por id y por número de orden
CREATE INDEX IF NOT EXISTS idx_employee_credit_history_order_id
  ON public.employee_credit_history(order_id);

CREATE INDEX IF NOT EXISTS idx_employee_credit_history_order_numero
  ON public.employee_credit_history(order_numero);

-- 3) Gastos y caja_movimientos: permitir provisión de caja como método
ALTER TABLE public.gastos
  DROP CONSTRAINT IF EXISTS gastos_metodopago_check;

ALTER TABLE public.gastos
  ADD CONSTRAINT gastos_metodopago_check
  CHECK (metodopago = ANY (ARRAY['efectivo'::text, 'tarjeta'::text, 'nequi'::text, 'provision_caja'::text]));

ALTER TABLE public.caja_movimientos
  DROP CONSTRAINT IF EXISTS caja_movimientos_metodopago_check;

ALTER TABLE public.caja_movimientos
  ADD CONSTRAINT caja_movimientos_metodopago_check
  CHECK (metodopago = ANY (ARRAY['efectivo'::text, 'tarjeta'::text, 'nequi'::text, 'provision_caja'::text]));

-- 4) Balance: incluir provisión de caja en el resumen diario
CREATE OR REPLACE VIEW public.balance_caja AS
WITH resumen AS (
  SELECT
    caja_movimientos.fecha,
    SUM(CASE WHEN caja_movimientos.tipo = 'INGRESO' THEN caja_movimientos.monto ELSE 0::numeric END) AS ingresos_totales,
    SUM(CASE WHEN caja_movimientos.tipo = 'EGRESO' THEN caja_movimientos.monto ELSE 0::numeric END) AS egresos_totales,
    SUM(CASE WHEN caja_movimientos.tipo = 'INGRESO' AND caja_movimientos.metodopago = 'efectivo' THEN caja_movimientos.monto ELSE 0::numeric END) AS ingresos_efectivo,
    SUM(CASE WHEN caja_movimientos.tipo = 'EGRESO' AND caja_movimientos.metodopago = 'efectivo' THEN caja_movimientos.monto ELSE 0::numeric END) AS egresos_efectivo,
    SUM(CASE WHEN caja_movimientos.tipo = 'INGRESO' AND caja_movimientos.metodopago = 'nequi' THEN caja_movimientos.monto ELSE 0::numeric END) AS ingresos_nequi,
    SUM(CASE WHEN caja_movimientos.tipo = 'EGRESO' AND caja_movimientos.metodopago = 'nequi' THEN caja_movimientos.monto ELSE 0::numeric END) AS egresos_nequi,
    SUM(CASE WHEN caja_movimientos.tipo = 'INGRESO' AND caja_movimientos.metodopago = 'tarjeta' THEN caja_movimientos.monto ELSE 0::numeric END) AS ingresos_tarjeta,
    SUM(CASE WHEN caja_movimientos.tipo = 'EGRESO' AND caja_movimientos.metodopago = 'tarjeta' THEN caja_movimientos.monto ELSE 0::numeric END) AS egresos_tarjeta,
    SUM(CASE WHEN caja_movimientos.tipo = 'INGRESO' AND caja_movimientos.metodopago = 'provision_caja' THEN caja_movimientos.monto ELSE 0::numeric END) AS ingresos_provision_caja,
    SUM(CASE WHEN caja_movimientos.tipo = 'EGRESO' AND caja_movimientos.metodopago = 'provision_caja' THEN caja_movimientos.monto ELSE 0::numeric END) AS egresos_provision_caja
  FROM public.caja_movimientos
  GROUP BY caja_movimientos.fecha
)
SELECT
  fecha,
  ingresos_totales,
  egresos_totales,
  (ingresos_totales - egresos_totales) AS balance_diario,
  ingresos_efectivo,
  egresos_efectivo,
  ingresos_nequi,
  egresos_nequi,
  ingresos_tarjeta,
  egresos_tarjeta,
  ingresos_provision_caja,
  egresos_provision_caja,
  (ingresos_efectivo - egresos_efectivo) AS saldo_efectivo_dia,
  (ingresos_nequi - egresos_nequi) AS saldo_nequi_dia,
  (ingresos_tarjeta - egresos_tarjeta) AS saldo_tarjeta_dia,
  (ingresos_provision_caja - egresos_provision_caja) AS saldo_provision_caja_dia,
  SUM((ingresos_totales - egresos_totales)) OVER (ORDER BY fecha) AS saldo_total_acumulado,
  SUM((ingresos_efectivo - egresos_efectivo)) OVER (ORDER BY fecha) AS saldo_efectivo_acumulado,
  SUM((ingresos_nequi - egresos_nequi)) OVER (ORDER BY fecha) AS saldo_nequi_acumulado,
  SUM((ingresos_tarjeta - egresos_tarjeta)) OVER (ORDER BY fecha) AS saldo_tarjeta_acumulado,
  SUM((ingresos_provision_caja - egresos_provision_caja)) OVER (ORDER BY fecha) AS saldo_provision_caja_acumulado
FROM resumen
ORDER BY fecha DESC;

-- 5) Realtime: asegurar publicación de tablas críticas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'orders'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.orders';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'order_items'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'employee_credit_history'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.employee_credit_history';
  END IF;
END
$$;
