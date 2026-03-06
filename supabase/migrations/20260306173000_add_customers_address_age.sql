ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS direccion text;

ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS edad integer;

ALTER TABLE public.customers
  DROP CONSTRAINT IF EXISTS customers_edad_check;

ALTER TABLE public.customers
  ADD CONSTRAINT customers_edad_check
  CHECK (edad IS NULL OR (edad >= 0 AND edad <= 120));
