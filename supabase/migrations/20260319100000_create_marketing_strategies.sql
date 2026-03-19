CREATE TABLE IF NOT EXISTS public.marketing_strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_start_date date NOT NULL,
  analysis_end_date date NOT NULL,
  apply_start_date date NOT NULL,
  apply_end_date date NOT NULL,
  model text NOT NULL,
  order_count integer NOT NULL DEFAULT 0,
  total_sales bigint NOT NULL DEFAULT 0,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.marketing_strategies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS public_all_marketing_strategies ON public.marketing_strategies;
CREATE POLICY public_all_marketing_strategies
  ON public.marketing_strategies
  USING (true)
  WITH CHECK (true);

DROP TRIGGER IF EXISTS update_marketing_strategies_updated_at ON public.marketing_strategies;
CREATE TRIGGER update_marketing_strategies_updated_at
  BEFORE UPDATE ON public.marketing_strategies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_marketing_strategies_created_at
  ON public.marketing_strategies(created_at DESC);

GRANT ALL ON TABLE public.marketing_strategies TO anon;
GRANT ALL ON TABLE public.marketing_strategies TO authenticated;
GRANT ALL ON TABLE public.marketing_strategies TO service_role;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'marketing_strategies'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.marketing_strategies';
  END IF;
END
$$;
