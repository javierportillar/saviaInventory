export interface DrinkDiscountCategoryOption {
  key: string;
  label: string;
}

export const DRINK_DISCOUNT_CATEGORY_OPTIONS: DrinkDiscountCategoryOption[] = [
  { key: 'batidos refrescantes', label: 'Batidos refrescantes' },
  { key: 'funcionales', label: 'Funcionales' },
  { key: 'especiales', label: 'Especiales' },
  { key: 'bebidas frias', label: 'Bebidas frías' },
  { key: 'bebidas calientes', label: 'Bebidas calientes' },
];

export const DRINK_DISCOUNT_CATEGORY_KEYS = DRINK_DISCOUNT_CATEGORY_OPTIONS.map((option) => option.key);

export const DEFAULT_DRINK_DISCOUNT_PERCENT = 10;

export const normalizeDrinkDiscountCategory = (value?: string): string => {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

export const isManagedDrinkDiscountCategory = (value?: string): boolean => {
  const normalized = normalizeDrinkDiscountCategory(value);
  return DRINK_DISCOUNT_CATEGORY_KEYS.includes(normalized);
};
