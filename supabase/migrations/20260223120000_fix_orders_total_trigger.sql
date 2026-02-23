BEGIN;

CREATE OR REPLACE FUNCTION public.calc_total_pago()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  pagos_total numeric;
BEGIN
  pagos_total := COALESCE(NEW.pago_efectivo, 0) + COALESCE(NEW.pago_nequi, 0) + COALESCE(NEW.pago_tarjeta, 0);

  -- Si no hay pagos registrados aún, conservar el total enviado por la orden.
  IF pagos_total <= 0 THEN
    NEW.total := COALESCE(NEW.total, 0);
  ELSE
    NEW.total := pagos_total;
  END IF;

  RETURN NEW;
END;
$$;

COMMIT;
