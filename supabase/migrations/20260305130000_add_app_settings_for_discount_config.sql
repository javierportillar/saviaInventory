-- Configuración global de la app (descuento bebidas por combo bowl/sandwich)

CREATE TABLE IF NOT EXISTS public.app_settings (
  key text PRIMARY KEY,
  value_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS public_all_app_settings ON public.app_settings;
CREATE POLICY public_all_app_settings
  ON public.app_settings
  USING (true)
  WITH CHECK (true);

DROP TRIGGER IF EXISTS update_app_settings_updated_at ON public.app_settings;
CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.app_settings (key, value_json)
VALUES ('caja_combo_descuento_bebidas', '{"drinkComboDiscountPercent":10}'::jsonb)
ON CONFLICT (key) DO NOTHING;

GRANT ALL ON TABLE public.app_settings TO anon;
GRANT ALL ON TABLE public.app_settings TO authenticated;
GRANT ALL ON TABLE public.app_settings TO service_role;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'app_settings'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.app_settings';
  END IF;
END
$$;
