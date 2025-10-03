import { MenuItem } from '../types';

export const BOWL_SALADO_ID = 'bowlssalados-0';
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
] as const;
export const BOWL_PROTEIN_OPTIONS = ['Pechuga de pollo', 'Jamón de cerdo', 'Carne desmechada', 'Champiñones','Carne Molida'] as const;
export const BOWL_BASE_MIN = 1;
export const BOWL_BASE_LIMIT = 2;
export const BOWL_TOPPING_MIN = 2;
export const BOWL_TOPPING_LIMIT = 4;

export const isBowlSalado = (item: Pick<MenuItem, 'id' | 'nombre'>) => {
  return item.id === BOWL_SALADO_ID || item.nombre.toLowerCase() === 'bowl salado';
};
