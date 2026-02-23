BEGIN;

ALTER TABLE public.gastos
  ADD COLUMN IF NOT EXISTS es_inventariable boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS menu_item_id uuid,
  ADD COLUMN IF NOT EXISTS cantidad_inventario integer,
  ADD COLUMN IF NOT EXISTS inventario_tipo text,
  ADD COLUMN IF NOT EXISTS unidad_inventario text;

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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'gastos_menu_item_id_fkey'
      AND conrelid = 'public.gastos'::regclass
  ) THEN
    ALTER TABLE public.gastos
      ADD CONSTRAINT gastos_menu_item_id_fkey
      FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'gastos_inventario_tipo_check'
      AND conrelid = 'public.gastos'::regclass
  ) THEN
    ALTER TABLE public.gastos
      ADD CONSTRAINT gastos_inventario_tipo_check
      CHECK (inventario_tipo IS NULL OR inventario_tipo IN ('cantidad', 'peso', 'volumen'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'gastos_inventariable_payload_check'
      AND conrelid = 'public.gastos'::regclass
  ) THEN
    ALTER TABLE public.gastos
      ADD CONSTRAINT gastos_inventariable_payload_check
      CHECK (
        (es_inventariable = false AND menu_item_id IS NULL AND cantidad_inventario IS NULL)
        OR
        (es_inventariable = true AND menu_item_id IS NOT NULL AND cantidad_inventario IS NOT NULL AND cantidad_inventario > 0)
      );
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.apply_gasto_inventory_delta(
  p_menu_item_id uuid,
  p_quantity integer,
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

CREATE OR REPLACE FUNCTION public.sync_gasto_inventory_stock()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Compatibilidad: si hay items detalle, el stock se mueve desde ese detalle (trigger aparte).
  -- Este trigger queda como respaldo para registros legados de 1 solo ítem en la tabla gastos.
  IF TG_OP = 'INSERT' THEN
    IF NEW.es_inventariable
      AND NEW.menu_item_id IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM public.gasto_inventario_items gi WHERE gi.gasto_id = NEW.id)
    THEN
      PERFORM public.apply_gasto_inventory_delta(NEW.menu_item_id, NEW.cantidad_inventario, 1);
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF OLD.es_inventariable
      AND OLD.menu_item_id IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM public.gasto_inventario_items gi WHERE gi.gasto_id = OLD.id)
    THEN
      PERFORM public.apply_gasto_inventory_delta(OLD.menu_item_id, OLD.cantidad_inventario, -1);
    END IF;

    IF NEW.es_inventariable
      AND NEW.menu_item_id IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM public.gasto_inventario_items gi WHERE gi.gasto_id = NEW.id)
    THEN
      PERFORM public.apply_gasto_inventory_delta(NEW.menu_item_id, NEW.cantidad_inventario, 1);
    END IF;

    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    IF OLD.es_inventariable
      AND OLD.menu_item_id IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM public.gasto_inventario_items gi WHERE gi.gasto_id = OLD.id)
    THEN
      PERFORM public.apply_gasto_inventory_delta(OLD.menu_item_id, OLD.cantidad_inventario, -1);
    END IF;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$;

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

DROP TRIGGER IF EXISTS trg_gastos_inventory_stock ON public.gastos;

CREATE TRIGGER trg_gastos_inventory_stock
AFTER INSERT OR UPDATE OR DELETE ON public.gastos
FOR EACH ROW EXECUTE FUNCTION public.sync_gasto_inventory_stock();

DROP TRIGGER IF EXISTS trg_gasto_items_inventory_stock ON public.gasto_inventario_items;

CREATE TRIGGER trg_gasto_items_inventory_stock
AFTER INSERT OR UPDATE OR DELETE ON public.gasto_inventario_items
FOR EACH ROW EXECUTE FUNCTION public.sync_gasto_item_inventory_stock();

COMMIT;
