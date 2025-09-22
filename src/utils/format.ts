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
