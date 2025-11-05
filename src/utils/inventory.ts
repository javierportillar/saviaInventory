import { MenuItem, InventoryAdjustment } from '../types';

type InventoryUnit = NonNullable<MenuItem['unidadMedida']>;

const WEIGHT_FACTORS: Record<Exclude<InventoryUnit, 'ml'>, number> = {
  mg: 0.001,
  g: 1,
  kg: 1000,
};

const isWeightUnit = (unit: InventoryUnit): unit is Exclude<InventoryUnit, 'ml'> => unit !== 'ml';

export const SUPPORTED_UNITS: InventoryUnit[] = ['mg', 'g', 'kg', 'ml'];

const clampQuantity = (value: number): number => {
  if (!Number.isFinite(value) || Number.isNaN(value)) {
    return 0;
  }
  return value;
};

const normalizeUnit = (unit: InventoryUnit | undefined, fallback: InventoryUnit): InventoryUnit => {
  if (!unit || !SUPPORTED_UNITS.includes(unit)) {
    return fallback;
  }
  return unit;
};

const convertBetweenUnits = (value: number, from: InventoryUnit, to: InventoryUnit): number => {
  if (from === to) {
    return value;
  }

  if (from === 'ml' || to === 'ml') {
    // No reliable conversion between weight and volume; assume same unit type required.
    if (from !== to) {
      console.warn(
        '[inventory] Conversión entre unidades incompatibles. Se conserva el valor original.',
        { from, to }
      );
      return value;
    }
    return value;
  }

  const fromFactor = WEIGHT_FACTORS[from as Exclude<InventoryUnit, 'ml'>];
  const toFactor = WEIGHT_FACTORS[to as Exclude<InventoryUnit, 'ml'>];

  return (value * fromFactor) / toFactor;
};

interface NormalizeQuantityOptions {
  cantidad?: number | null;
  tipo?: MenuItem['inventarioTipo'];
  unidad?: MenuItem['unidadMedida'];
  item?: MenuItem | null;
}

export const normalizeQuantityForItem = ({
  cantidad,
  tipo,
  unidad,
  item,
}: NormalizeQuantityOptions): number => {
  const safeCantidad = clampQuantity(Number(cantidad ?? 0));
  if (!item || item.inventarioCategoria !== 'Inventariables' || safeCantidad === 0) {
    return 0;
  }

  const resolvedTipo = tipo ?? item.inventarioTipo ?? 'cantidad';

  if (resolvedTipo !== 'gramos') {
    return Math.round(safeCantidad);
  }

  const itemUnit = normalizeUnit(item.unidadMedida ?? 'g', 'g');
  const fromUnit = normalizeUnit(unidad ?? itemUnit, itemUnit);

  if (itemUnit === 'ml') {
    if (fromUnit !== 'ml') {
      console.warn('[inventory] No se puede convertir a mililitros desde la unidad especificada.', {
        fromUnit,
        itemUnit,
      });
      return Math.round(safeCantidad);
    }
    return safeCantidad;
  }

  if (!isWeightUnit(fromUnit) || !isWeightUnit(itemUnit)) {
    return Math.round(safeCantidad);
  }

  const converted = convertBetweenUnits(safeCantidad, fromUnit, itemUnit);
  return Math.round(converted);
};

export const applyInventoryAdjustmentsToMenuItems = (
  menuItems: MenuItem[],
  adjustments: InventoryAdjustment[],
): MenuItem[] => {
  if (!adjustments.length) {
    return menuItems;
  }

  const deltaByItem = adjustments.reduce<Record<string, number>>((acc, adjustment) => {
    if (!Number.isFinite(adjustment.delta) || adjustment.delta === 0) {
      return acc;
    }
    acc[adjustment.itemId] = (acc[adjustment.itemId] ?? 0) + adjustment.delta;
    return acc;
  }, {});

  if (Object.keys(deltaByItem).length === 0) {
    return menuItems;
  }

  return menuItems.map((item) => {
    const delta = deltaByItem[item.id];
    if (delta === undefined) {
      return item;
    }

    const currentStock = Number.isFinite(item.stock) ? item.stock : 0;
    const updatedStock = Math.max(0, Math.round(currentStock + delta));
    if (updatedStock === currentStock) {
      return item;
    }

    return {
      ...item,
      stock: updatedStock,
    };
  });
};
