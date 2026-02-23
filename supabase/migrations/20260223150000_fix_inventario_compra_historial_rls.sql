BEGIN;

ALTER TABLE public.inventario_compra_historial ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_all_inventario_compra_historial" ON public.inventario_compra_historial;

CREATE POLICY "public_all_inventario_compra_historial"
  ON public.inventario_compra_historial
  FOR ALL
  USING (true)
  WITH CHECK (true);

GRANT ALL ON TABLE public.inventario_compra_historial TO anon;
GRANT ALL ON TABLE public.inventario_compra_historial TO authenticated;
GRANT ALL ON TABLE public.inventario_compra_historial TO service_role;

COMMIT;
