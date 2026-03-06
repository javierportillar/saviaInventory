-- Nómina empleados: tipo de contrato + configuración global de parámetros

ALTER TABLE public.empleados
  ADD COLUMN IF NOT EXISTS tipo_contrato text NOT NULL DEFAULT 'por_horas';

ALTER TABLE public.empleados
  DROP CONSTRAINT IF EXISTS empleados_tipo_contrato_check;

ALTER TABLE public.empleados
  ADD CONSTRAINT empleados_tipo_contrato_check
  CHECK (tipo_contrato IN ('por_horas', 'salario_fijo'));

ALTER TABLE public.empleados
  ADD COLUMN IF NOT EXISTS salario_mensual numeric NOT NULL DEFAULT 0;

ALTER TABLE public.empleados
  ADD COLUMN IF NOT EXISTS incluye_auxilio_transporte boolean NOT NULL DEFAULT true;

-- Valores base para filas existentes
UPDATE public.empleados
SET
  tipo_contrato = COALESCE(NULLIF(tipo_contrato, ''), 'por_horas'),
  salario_mensual = COALESCE(salario_mensual, 0),
  incluye_auxilio_transporte = COALESCE(incluye_auxilio_transporte, true)
WHERE tipo_contrato IS NULL
   OR tipo_contrato = ''
   OR salario_mensual IS NULL
   OR incluye_auxilio_transporte IS NULL;

-- Parámetros globales de nómina en app_settings
INSERT INTO public.app_settings (key, value_json)
VALUES (
  'empleados_nomina_config',
  jsonb_build_object(
    'smmlv', 1750905,
    'auxilioTransporte', 249095,
    'horasMesBase', 220,
    'diasMesBase', 30,
    'limiteAuxilioSmmlv', 2
  )
)
ON CONFLICT (key) DO NOTHING;
