import React, { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { COLORS } from '../data/menu';
import { Order, PaymentAllocation, PaymentMethod } from '../types';
import {
  formatPaymentSummary,
  getAllocationsTotal,
  getOrderAllocations,
  mergeAllocations,
  PAYMENT_METHODS,
  sanitizeAllocations,
} from '../utils/payments';
import { formatCOP } from '../utils/format';

interface PaymentModalProps {
  order: Order;
  onClose: () => void;
  onSubmit: (allocations: PaymentAllocation[]) => Promise<void> | void;
  isSubmitting?: boolean;
  title?: string;
}

const emptySelection = (): Record<PaymentMethod, boolean> => ({
  efectivo: false,
  tarjeta: false,
  nequi: false,
});

const emptyAmounts = (): Record<PaymentMethod, string> => ({
  efectivo: '',
  tarjeta: '',
  nequi: '',
});

const toPositiveInteger = (value: string): number => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return 0;
  }
  return Math.round(numeric);
};

const computeSelectedTotal = (
  selected: Record<PaymentMethod, boolean>,
  amounts: Record<PaymentMethod, string>
): number => {
  return PAYMENT_METHODS.reduce((sum, method) => {
    if (!selected[method]) {
      return sum;
    }
    return sum + toPositiveInteger(amounts[method]);
  }, 0);
};

export function PaymentModal({ order, onClose, onSubmit, isSubmitting = false, title }: PaymentModalProps) {
  const total = useMemo(() => Math.round(order.total), [order.total]);
  const [selectedMethods, setSelectedMethods] = useState<Record<PaymentMethod, boolean>>(emptySelection);
  const [methodAmounts, setMethodAmounts] = useState<Record<PaymentMethod, string>>(emptyAmounts);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const existingAllocations = getOrderAllocations(order);
    if (existingAllocations.length === 0) {
      setSelectedMethods({ efectivo: true, tarjeta: false, nequi: false });
      setMethodAmounts({
        efectivo: total > 0 ? String(total) : '',
        tarjeta: '',
        nequi: '',
      });
      setFeedback(null);
      return;
    }

    const nextSelected = emptySelection();
    const nextAmounts = emptyAmounts();
    existingAllocations.forEach((allocation) => {
      nextSelected[allocation.metodo] = true;
      nextAmounts[allocation.metodo] = String(Math.round(allocation.monto));
    });
    setSelectedMethods(nextSelected);
    setMethodAmounts(nextAmounts);
    setFeedback(null);
  }, [order, total]);

  const selectedList = useMemo(
    () => PAYMENT_METHODS.filter((method) => selectedMethods[method]),
    [selectedMethods]
  );

  const parsedAllocations: PaymentAllocation[] = selectedList.map((method) => ({
    metodo: method,
    monto: toPositiveInteger(methodAmounts[method]),
  }));

  const paidTotal = useMemo(() => getAllocationsTotal(parsedAllocations), [parsedAllocations]);
  const remaining = total - paidTotal;
  const hasEmptyAmounts = parsedAllocations.some((allocation) => allocation.monto <= 0);
  const hasSelection = selectedList.length > 0;
  const isExactAmount = Math.abs(remaining) <= 1;
  const canSubmit = hasSelection && !hasEmptyAmounts && isExactAmount && total > 0;

  const handleToggleMethod = (method: PaymentMethod) => {
    setSelectedMethods((prevSelected) => {
      const nextSelected = { ...prevSelected };
      const isCurrentlySelected = !!prevSelected[method];
      nextSelected[method] = !isCurrentlySelected;

      setMethodAmounts((prevAmounts) => {
        const nextAmounts = { ...prevAmounts };
        if (!isCurrentlySelected) {
          const used = computeSelectedTotal(prevSelected, prevAmounts);
          const available = Math.max(0, total - used);
          nextAmounts[method] = available > 0 ? String(available) : '';
        } else {
          nextAmounts[method] = '';
        }
        return nextAmounts;
      });

      return nextSelected;
    });
  };

  const handleAmountChange = (method: PaymentMethod, value: string) => {
    if (!/^[0-9]*$/.test(value)) {
      return;
    }
    setMethodAmounts((prev) => ({
      ...prev,
      [method]: value,
    }));
  };

  const applyRemainingToMethod = (method: PaymentMethod) => {
    const usedByOthers = selectedList
      .filter((entry) => entry !== method)
      .reduce((sum, entry) => sum + toPositiveInteger(methodAmounts[entry]), 0);
    const available = Math.max(0, total - usedByOthers);
    setSelectedMethods((prevSelected) => ({ ...prevSelected, [method]: true }));
    setMethodAmounts((prev) => ({
      ...prev,
      [method]: available > 0 ? String(available) : '',
    }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      setFeedback('Asegúrate de seleccionar al menos un método y que los montos sumen el total.');
      return;
    }

    const sanitized = mergeAllocations(sanitizeAllocations(parsedAllocations));
    const resultTotal = getAllocationsTotal(sanitized);
    if (Math.abs(resultTotal - total) > 1) {
      setFeedback('Los montos registrados no coinciden con el total del pedido.');
      return;
    }

    setFeedback(null);
    await onSubmit(sanitized);
  };

  const summary = useMemo(() => formatPaymentSummary(parsedAllocations, formatCOP), [parsedAllocations]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg lg:text-xl font-bold" style={{ color: COLORS.dark }}>
              {title ?? 'Registrar pago'}
            </h3>
            <p className="text-sm text-gray-500">Pedido #{order.numero} · Total {formatCOP(total)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold mb-2" style={{ color: COLORS.dark }}>
              Selecciona los métodos de pago
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((method) => {
                const isActive = selectedMethods[method];
                const label =
                  method === 'efectivo'
                    ? 'Efectivo'
                    : method === 'tarjeta'
                      ? 'Tarjeta'
                      : 'Nequi';
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => handleToggleMethod(method)}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                      isActive ? 'border-transparent text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    style={{
                      backgroundColor: isActive ? COLORS.dark : 'transparent',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedList.length > 0 && (
            <div className="space-y-3">
              {selectedList.map((method) => {
                const label =
                  method === 'efectivo'
                    ? 'Efectivo'
                    : method === 'tarjeta'
                      ? 'Tarjeta'
                      : 'Nequi';
                return (
                  <div key={method} className="flex flex-col gap-2 p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: COLORS.dark }}>{label}</span>
                      <button
                        type="button"
                        onClick={() => applyRemainingToMethod(method)}
                        className="text-xs text-gray-600 hover:text-gray-900"
                      >
                        Usar restante
                      </button>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={methodAmounts[method]}
                      onChange={(event) => handleAmountChange(method, event.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                      style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                      placeholder="Monto"
                    />
                  </div>
                );
              })}
            </div>
          )}

          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between font-medium">
              <span>Total registrado</span>
              <span>{formatCOP(paidTotal)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Restante</span>
              <span className={remaining === 0 ? 'text-green-600' : 'text-red-600'}>
                {formatCOP(Math.abs(remaining))}
              </span>
            </div>
            <p className="text-xs text-gray-500">{summary}</p>
            {feedback && <p className="text-xs text-red-600">{feedback}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 text-sm"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 py-2 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: COLORS.dark }}
              disabled={isSubmitting}
            >
              Confirmar pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
