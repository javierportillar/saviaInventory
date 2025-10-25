export const normalizeText = (value: string): string => {
  if (!value) {
    return '';
  }
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

export const slugify = (value: string): string => {
  if (!value) {
    return '';
  }
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .trim();
};

export const generateMenuItemCode = (nombre: string, categoria?: string): string => {
  const parts = [categoria, nombre]
    .filter((part): part is string => !!part && part.trim().length > 0)
    .map((part) => slugify(part));
  const base = parts.filter(Boolean).join('-') || 'item';
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
};
