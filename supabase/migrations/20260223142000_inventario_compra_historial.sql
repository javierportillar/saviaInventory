BEGIN;

CREATE TABLE IF NOT EXISTS public.inventario_compra_historial (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gasto_id uuid REFERENCES public.gastos(id) ON DELETE SET NULL,
  menu_item_id uuid NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  cantidad numeric(12,3) NOT NULL CHECK (cantidad > 0),
  unidad_tipo text NOT NULL CHECK (unidad_tipo IN ('cantidad', 'peso')),
  unidad text NOT NULL,
  precio_total numeric(12,2) NOT NULL CHECK (precio_total >= 0),
  precio_unitario numeric(12,6) NOT NULL CHECK (precio_unitario > 0),
  lugar_compra text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inventario_compra_historial_menu_item
  ON public.inventario_compra_historial(menu_item_id);

CREATE INDEX IF NOT EXISTS idx_inventario_compra_historial_created_at
  ON public.inventario_compra_historial(created_at DESC);

ALTER TABLE public.inventario_compra_historial ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'inventario_compra_historial'
      AND policyname = 'public_all_inventario_compra_historial'
  ) THEN
    CREATE POLICY "public_all_inventario_compra_historial"
      ON public.inventario_compra_historial
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

COMMIT;
