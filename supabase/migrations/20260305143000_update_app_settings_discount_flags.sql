-- Amplía configuración de descuentos de bebidas: habilitado + categorías seleccionadas

INSERT INTO public.app_settings (key, value_json)
VALUES (
  'caja_combo_descuento_bebidas',
  jsonb_build_object(
    'drinkComboDiscountEnabled', true,
    'drinkComboDiscountPercent', 10,
    'drinkComboDiscountCategories', jsonb_build_array(
      'batidos refrescantes',
      'funcionales',
      'especiales',
      'bebidas frias',
      'bebidas calientes'
    )
  )
)
ON CONFLICT (key) DO NOTHING;

UPDATE public.app_settings
SET value_json =
  jsonb_set(
    jsonb_set(
      jsonb_set(
        COALESCE(value_json, '{}'::jsonb),
        '{drinkComboDiscountEnabled}',
        COALESCE(value_json->'drinkComboDiscountEnabled', 'true'::jsonb),
        true
      ),
      '{drinkComboDiscountPercent}',
      COALESCE(value_json->'drinkComboDiscountPercent', '10'::jsonb),
      true
    ),
    '{drinkComboDiscountCategories}',
    COALESCE(
      value_json->'drinkComboDiscountCategories',
      jsonb_build_array(
        'batidos refrescantes',
        'funcionales',
        'especiales',
        'bebidas frias',
        'bebidas calientes'
      )
    ),
    true
  )
WHERE key = 'caja_combo_descuento_bebidas';
