BEGIN;

ALTER TABLE public.gastos
  ADD COLUMN IF NOT EXISTS lugar_compra text;

COMMIT;
