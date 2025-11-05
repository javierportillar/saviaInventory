# Ajustes de base de datos para control de inventario desde gastos

Para que la nueva integración entre gastos e inventario funcione correctamente es necesario actualizar la base de datos. A continuación se describen los cambios mínimos esperados por la aplicación.

## Tabla `gastos`

Agregar las columnas que permiten enlazar un gasto con un ítem de inventario y registrar la cantidad movida:

```sql
ALTER TABLE public.gastos
  ADD COLUMN IF NOT EXISTS inventario_item_id uuid REFERENCES public.menu_items(id),
  ADD COLUMN IF NOT EXISTS inventario_cantidad numeric,
  ADD COLUMN IF NOT EXISTS inventario_tipo text CHECK (inventario_tipo IN ('cantidad', 'gramos')),
  ADD COLUMN IF NOT EXISTS inventario_unidad text CHECK (inventario_unidad IN ('kg', 'g', 'mg', 'ml'));
```

Recomendaciones adicionales:

- Crear un índice para acelerar las consultas por `inventario_item_id`:

  ```sql
  CREATE INDEX IF NOT EXISTS gastos_inventario_item_idx
    ON public.gastos (inventario_item_id);
  ```
- Si los gastos existentes deben asociarse a inventario, realizar una actualización manual identificando el producto y la cantidad correspondiente.

## Tabla `menu_items`

Asegúrate de que los ítems inventariables tengan definidos `inventario_tipo` (`'cantidad'` o `'gramos'`) y, cuando aplique, `unidadMedida` (`'kg'`, `'g'`, `'mg'`, `'ml'`). Estos campos son utilizados para normalizar consumos y reposiciones.

## Disparadores y consistencia

Si se gestiona el stock directamente en la base de datos, considera crear un disparador que aplique la cantidad de `gastos` en `inventario` cuando se inserte o elimine un registro con `inventario_item_id` no nulo. En caso contrario, la aplicación manejará los ajustes localmente y sincronizará usando `applyInventoryAdjustments` cuando haya conexión.

## Consideraciones de migración

1. Ejecuta los `ALTER TABLE` en todos los entornos (producción y pruebas) antes de desplegar el frontend.
2. Verifica que las políticas de seguridad (RLS) permitan leer y escribir las nuevas columnas para los roles utilizados por la aplicación.
3. Si existen vistas o funciones que lean de `gastos`, actualízalas para que propaguen los nuevos campos cuando corresponda.

Con estos cambios, la aplicación podrá registrar compras de inventario desde el módulo de gastos y reflejar los ajustes de stock en tiempo real.
