import { Order, PaymentAllocation, PaymentMethod, PaymentStatus } from '../types';

export const PAYMENT_METHODS: PaymentMethod[] = ['efectivo', 'tarjeta', 'nequi'];

const roundToCOP = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.round(value);
};

export const sanitizeAllocations = (allocations?: PaymentAllocation[] | null): PaymentAllocation[] => {
  if (!Array.isArray(allocations)) {
    return [];
  }

  return allocations
    .map((entry): PaymentAllocation | null => {
      if (!entry) return null;
      if (!PAYMENT_METHODS.includes(entry.metodo)) {
        return null;
      }
      const amount = roundToCOP(Number(entry.monto ?? 0));
      if (amount <= 0) {
        return null;
      }
      return { metodo: entry.metodo, monto: amount };
    })
    .filter((entry): entry is PaymentAllocation => entry !== null);
};

export const mergeAllocations = (allocations: PaymentAllocation[]): PaymentAllocation[] => {
  const totals = new Map<PaymentMethod, number>();
  allocations.forEach((entry) => {
    const current = totals.get(entry.metodo) ?? 0;
    totals.set(entry.metodo, current + entry.monto);
  });
  return Array.from(totals.entries()).map(([metodo, monto]) => ({ metodo, monto: roundToCOP(monto) }));
};

export const getAllocationsTotal = (allocations: PaymentAllocation[]): number => {
  return allocations.reduce((sum, entry) => sum + entry.monto, 0);
};

export const getOrderAllocations = (order: Order): PaymentAllocation[] => {
  const normalized = sanitizeAllocations(order.paymentAllocations);
  if (normalized.length > 0) {
    return mergeAllocations(normalized);
  }

  if (order.paymentStatus === 'pagado' && order.metodoPago) {
    return [{ metodo: order.metodoPago, monto: roundToCOP(order.total) }];
  }

  return [];
};

export const determinePaymentStatus = (order: Order): PaymentStatus => {
  if (order.paymentStatus) {
    return order.paymentStatus;
  }

  const allocations = getOrderAllocations(order);
  const total = getAllocationsTotal(allocations);
  return Math.abs(total - roundToCOP(order.total)) <= 1 ? 'pagado' : 'pendiente';
};

export const isOrderPaid = (order: Order): boolean => determinePaymentStatus(order) === 'pagado';

export const getPrimaryMethodFromAllocations = (allocations: PaymentAllocation[]): PaymentMethod | undefined => {
  if (allocations.length === 0) {
    return undefined;
  }

  return allocations
    .slice()
    .sort((a, b) => b.monto - a.monto)[0]?.metodo;
};

export const formatPaymentSummary = (
  allocations: PaymentAllocation[],
  formatCurrency: (value: number) => string
): string => {
  if (allocations.length === 0) {
    return 'Pago pendiente';
  }

  const parts = allocations.map((entry) => {
    const label =
      entry.metodo === 'efectivo'
        ? 'Efectivo'
        : entry.metodo === 'tarjeta'
          ? 'Tarjeta'
          : 'Nequi';
    return `${label}: ${formatCurrency(entry.monto)}`;
  });

  return parts.join(' · ');
};

export const buildUpdatedOrderPayment = (
  order: Order,
  allocations: PaymentAllocation[],
  status: PaymentStatus
): Order => {
  const merged = mergeAllocations(sanitizeAllocations(allocations));
  return {
    ...order,
    paymentAllocations: merged,
    paymentStatus: status,
  };
};
