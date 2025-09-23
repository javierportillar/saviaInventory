export const formatCOP = (value: number): string => {
  try {
    return new Intl.NumberFormat("es-CO", { 
      style: "currency", 
      currency: "COP", 
      maximumFractionDigits: 0 
    }).format(value || 0);
  } catch {
    return `$${value.toLocaleString()}`;
  }
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
};

export const formatDate = (date: Date): string => {
  const formatted = new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    weekday: "long"
  }).format(date);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export const generateOrderNumber = (): number => {
  return Math.floor(Math.random() * 9000) + 1000;
};

export const formatDateInputValue = (date: Date): string => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const parseDateInputValue = (
  value: string | Date | null | undefined,
): Date => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value.getTime());
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (DATE_INPUT_PATTERN.test(trimmed)) {
      const [year, month, day] = trimmed.split("-").map(Number);
      return new Date(year, month - 1, day);
    }

    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const getTodayDateInputValue = (): string => {
  return formatDateInputValue(new Date());
};
