-- Agrega soporte de selección por productos de bebida para descuento combo

UPDATE public.app_settings
SET value_json = jsonb_set(
  COALESCE(value_json, '{}'::jsonb),
  '{drinkComboDiscountProductIds}',
  COALESCE(value_json->'drinkComboDiscountProductIds', '[]'::jsonb),
  true
)
WHERE key = 'caja_combo_descuento_bebidas';
