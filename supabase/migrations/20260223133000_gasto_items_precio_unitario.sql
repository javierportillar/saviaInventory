BEGIN;

ALTER TABLE public.gasto_inventario_items
  ADD COLUMN IF NOT EXISTS precio_unitario numeric(12,2);

UPDATE public.gasto_inventario_items gi
SET precio_unitario = COALESCE(mi.precio, 0)
FROM public.menu_items mi
WHERE gi.menu_item_id = mi.id
  AND gi.precio_unitario IS NULL;

COMMIT;
