BEGIN;

UPDATE public.menu_items
SET unidadmedida = 'g'
WHERE inventariocategoria = 'Inventariables'
  AND inventariotipo = 'gramos'
  AND (unidadmedida IS NULL OR unidadmedida <> 'g');

ALTER TABLE public.menu_items
  DROP CONSTRAINT IF EXISTS menu_items_grams_unit_check;

ALTER TABLE public.menu_items
  ADD CONSTRAINT menu_items_grams_unit_check
  CHECK (
    inventariotipo IS DISTINCT FROM 'gramos'
    OR unidadmedida = 'g'
  );

COMMIT;
