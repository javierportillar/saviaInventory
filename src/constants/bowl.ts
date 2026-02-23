import { MenuItem } from '../types';

export const BOWL_SALADO_ID = 'bowlssalados-0';
export const BOWL_FRUTAL_ID = 'bowlsfrutales-0';
export const BOWL_BASE_OPTIONS = ['Arroz', 'Pasta', 'Quinua'] as const;
export const BOWL_TOPPING_OPTIONS = [
  'Maíz tierno',
  'Champiñones',
  'Pico de gallo',
  'Guacamole',
  'Tocineta',
  'Chips de arracacha',
  'Queso feta',
  'Zanahoria',
  'Pepino',
  'Maíz tostado',
  'Cebolla encurtida',
] as const;
export const BOWL_PROTEIN_OPTIONS = ['Atún', 'Pechuga de pollo', 'Jamón de cerdo', 'Carne desmechada'] as const;
export const BOWL_BASE_MIN = 2;
export const BOWL_BASE_LIMIT = 2;
export const BOWL_TOPPING_MIN = 4;
export const BOWL_TOPPING_LIMIT = 4;

export const BOWL_FRUTAL_BASE_OPTIONS = ['Frutos Rojos', 'Frutos Amarillos', 'Vital'] as const;
export const BOWL_FRUTAL_TOPPING_OPTIONS = [
  'Mango',
  'Fresa',
  'Crema de maní',
  'Banano',
  'Manzana',
  'Granola',
  'Piña',
  'Coco Rallado',
  'Arándanos',
  'Semillas',
] as const;
export const BOWL_FRUTAL_BASE_PRICES: Record<(typeof BOWL_FRUTAL_BASE_OPTIONS)[number], number> = {
  'Frutos Rojos': 13500,
  'Frutos Amarillos': 13500,
  Vital: 13500,
};
export const BOWL_FRUTAL_BASE_MIN = 1;
export const BOWL_FRUTAL_BASE_LIMIT = 1;
export const BOWL_FRUTAL_TOPPING_MIN = 4;
export const BOWL_FRUTAL_TOPPING_INCLUDED = 4;
export const BOWL_FRUTAL_TOPPING_EXTRA_COST = 2000;
export const BOWL_FRUTAL_YOGURT_COST = 3000;

export const isBowlSalado = (item: Pick<MenuItem, 'id' | 'nombre'>) => {
  return item.id === BOWL_SALADO_ID || item.nombre.toLowerCase() === 'bowl salado';
};

export const isBowlFrutal = (item: Pick<MenuItem, 'id' | 'nombre' | 'categoria'>) => {
  const normalizedName = item.nombre.toLowerCase();
  const normalizedCategory = item.categoria.toLowerCase();
  return (
    item.id === BOWL_FRUTAL_ID ||
    normalizedName.includes('bowl frutal') ||
    normalizedCategory.includes('bowls frutales') ||
    normalizedName.includes('açaí') ||
    normalizedName.includes('acai') ||
    normalizedName.includes('tropical') ||
    normalizedName.includes('vital')
  );
};
