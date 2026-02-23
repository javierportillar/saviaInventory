BEGIN;

CREATE TABLE IF NOT EXISTS public.gasto_inventario_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gasto_id uuid NOT NULL REFERENCES public.gastos(id) ON DELETE CASCADE,
  menu_item_id uuid NOT NULL REFERENCES public.menu_items(id),
  cantidad integer NOT NULL CHECK (cantidad > 0),
  inventario_tipo text CHECK (inventario_tipo IS NULL OR inventario_tipo IN ('cantidad', 'peso', 'volumen')),
  unidad_inventario text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gasto_inventario_items_gasto_id
  ON public.gasto_inventario_items(gasto_id);

CREATE INDEX IF NOT EXISTS idx_gasto_inventario_items_menu_item_id
  ON public.gasto_inventario_items(menu_item_id);

ALTER TABLE public.gastos DROP CONSTRAINT IF EXISTS gastos_inventariable_payload_check;

ALTER TABLE public.gastos
  ADD CONSTRAINT gastos_inventariable_payload_check
  CHECK (
    (es_inventariable = false AND menu_item_id IS NULL AND cantidad_inventario IS NULL)
    OR
    (
      es_inventariable = true
      AND (
        (menu_item_id IS NOT NULL AND cantidad_inventario IS NOT NULL AND cantidad_inventario > 0)
        OR
        (menu_item_id IS NULL AND cantidad_inventario IS NULL)
      )
    )
  );

CREATE OR REPLACE FUNCTION public.sync_gasto_item_inventory_stock()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.apply_gasto_inventory_delta(NEW.menu_item_id, NEW.cantidad, 1);
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    PERFORM public.apply_gasto_inventory_delta(OLD.menu_item_id, OLD.cantidad, -1);
    PERFORM public.apply_gasto_inventory_delta(NEW.menu_item_id, NEW.cantidad, 1);
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    PERFORM public.apply_gasto_inventory_delta(OLD.menu_item_id, OLD.cantidad, -1);
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_gasto_items_inventory_stock ON public.gasto_inventario_items;

CREATE TRIGGER trg_gasto_items_inventory_stock
AFTER INSERT OR UPDATE OR DELETE ON public.gasto_inventario_items
FOR EACH ROW EXECUTE FUNCTION public.sync_gasto_item_inventory_stock();

COMMIT;
