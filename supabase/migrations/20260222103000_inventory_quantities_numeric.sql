BEGIN;

ALTER TABLE public.gastos
  ALTER COLUMN cantidad_inventario TYPE numeric(12,3)
  USING cantidad_inventario::numeric;

ALTER TABLE public.gasto_inventario_items
  ALTER COLUMN cantidad TYPE numeric(12,3)
  USING cantidad::numeric;

ALTER TABLE public.gasto_inventario_items
  DROP CONSTRAINT IF EXISTS gasto_inventario_items_cantidad_check;

ALTER TABLE public.gasto_inventario_items
  ADD CONSTRAINT gasto_inventario_items_cantidad_check CHECK (cantidad > 0::numeric);

CREATE OR REPLACE FUNCTION public.apply_gasto_inventory_delta(
  p_menu_item_id uuid,
  p_quantity numeric,
  p_direction integer
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_menu_item_id IS NULL OR COALESCE(p_quantity, 0) <= 0 THEN
    RETURN;
  END IF;

  UPDATE public.menu_items
  SET stock = GREATEST(0, COALESCE(stock, 0) + (p_quantity * p_direction))
  WHERE id = p_menu_item_id;
END;
$$;

COMMIT;
