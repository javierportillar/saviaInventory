BEGIN;

ALTER TABLE public.inventario_compra_historial
  DROP CONSTRAINT IF EXISTS inventario_compra_historial_gasto_id_fkey;

ALTER TABLE public.inventario_compra_historial
  ADD CONSTRAINT inventario_compra_historial_gasto_id_fkey
  FOREIGN KEY (gasto_id)
  REFERENCES public.gastos(id)
  ON DELETE CASCADE;

COMMIT;
