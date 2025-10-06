import { CartItem, MenuItem } from '../types';

export const STUDENT_DISCOUNT_RATE = 0.1;
export const STUDENT_DISCOUNT_NOTE = 'Descuento estudiante 10%';

const normalizeCategory = (categoria: string | undefined): string => {
  return (categoria ?? '').toLowerCase();
};

export const isSandwichItem = (item: MenuItem): boolean => {
  const normalized = normalizeCategory(item.categoria);
  return normalized.includes('sandwich') || normalized.includes('sanduch');
};

export const getCartItemBaseUnitPrice = (cartItem: CartItem): number => {
  if (typeof cartItem.precioUnitario === 'number') {
    return cartItem.precioUnitario;
  }
  return cartItem.item.precio;
};

export const getCartItemEffectiveUnitPrice = (cartItem: CartItem): number => {
  const basePrice = getCartItemBaseUnitPrice(cartItem);
  if (cartItem.studentDiscount) {
    return Math.round(basePrice * (1 - STUDENT_DISCOUNT_RATE));
  }
  return basePrice;
};

export const getCartItemSubtotal = (cartItem: CartItem): number => {
  return getCartItemEffectiveUnitPrice(cartItem) * cartItem.cantidad;
};

export const normalizeCartTotal = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  const rounded = Math.round(value);
  if (rounded % 100 === 50) {
    return rounded + 50;
  }
  return rounded;
};

export const calculateCartTotal = (cart: CartItem[]): number => {
const sum = cart.reduce((total, cartItem) => total + getCartItemSubtotal(cartItem), 0);
  return normalizeCartTotal(sum);
};

interface NotesExtractionResult {
  studentDiscount: boolean;
  cleanedNotes?: string;
}

export const extractStudentDiscountFromNotes = (
  notes: string | null | undefined
): NotesExtractionResult => {
  if (!notes) {
    return { studentDiscount: false, cleanedNotes: undefined };
  }

  const lines = notes.split('\n');
  let studentDiscount = false;

  const filteredLines = lines.filter((rawLine) => {
    const line = rawLine.trim();
    if (line.toLowerCase() === STUDENT_DISCOUNT_NOTE.toLowerCase()) {
      studentDiscount = true;
      return false;
    }
    return true;
  });

  const cleanedNotes = filteredLines.join('\n').trim();

  return {
    studentDiscount,
    cleanedNotes: cleanedNotes ? cleanedNotes : undefined,
  };
};

export const buildNotesWithStudentDiscount = (
  notes: string | undefined,
  studentDiscount: boolean
): string | undefined => {
  const { cleanedNotes } = extractStudentDiscountFromNotes(notes);

  if (!studentDiscount) {
    return cleanedNotes;
  }

  return cleanedNotes ? `${cleanedNotes}\n${STUDENT_DISCOUNT_NOTE}` : STUDENT_DISCOUNT_NOTE;
};
