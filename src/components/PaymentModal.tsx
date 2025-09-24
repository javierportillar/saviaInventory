import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { COLORS } from '../data/menu';
import { CartItem, Order, PaymentAllocation, PaymentMethod } from '../types';
import {
  formatPaymentSummary,
  getAllocationsTotal,
  getOrderAllocations,
  mergeAllocations,
  PAYMENT_METHODS,
  sanitizeAllocations,
} from '../utils/payments';
import { formatCOP } from '../utils/format';
import { getCartItemEffectiveUnitPrice } from '../utils/cart';

interface PaymentModalProps {
  order: Order;
  onClose: () => void;
  onSubmit: (allocations: PaymentAllocation[]) => Promise<void> | void;
  isSubmitting?: boolean;
  title?: string;
}

type PaymentMode = 'single' | 'split';

interface AssignableItem {
  key: string;
  label: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  details: string[];
}

interface SplitPersonState {
  id: string;
  name: string;
  method: PaymentMethod;
  itemQuantities: Record<string, number>;
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

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
  nequi: 'Nequi',
};

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

const buildItemDetails = (cartItem: CartItem): string[] => {
  const details: string[] = [];

  if (cartItem.bowlCustomization) {
    const { bases, toppings, proteina } = cartItem.bowlCustomization;
    if (bases && bases.length > 0) {
      details.push(`Bases: ${bases.join(', ')}`);
    }
    if (proteina) {
      details.push(`Proteína: ${proteina}`);
    }
    if (toppings && toppings.length > 0) {
      details.push(`Toppings: ${toppings.join(', ')}`);
    }
  }

  if (cartItem.notas) {
    details.push(`Notas: ${cartItem.notas}`);
  }

  if (cartItem.studentDiscount) {
    details.push('Incluye descuento estudiante');
  }

  return details;
};

const applySplitQuantityChange = (
  persons: SplitPersonState[],
  personId: string,
  itemKey: string,
  desiredQuantity: number,
  itemsByKey: Record<string, AssignableItem>
): SplitPersonState[] => {
  const item = itemsByKey[itemKey];
  if (!item) {
    return persons;
  }

  const sanitizedDesired = Number.isFinite(desiredQuantity) ? Math.floor(desiredQuantity) : 0;
  const assignedByOthers = persons.reduce((sum, person) => {
    if (person.id === personId) {
      return sum;
    }
    return sum + (person.itemQuantities[itemKey] ?? 0);
  }, 0);

  const maxForPerson = Math.max(0, item.quantity - assignedByOthers);
  const clamped = Math.max(0, Math.min(sanitizedDesired, maxForPerson));

  return persons.map((person) => {
    if (person.id !== personId) {
      return person;
    }

    const nextQuantities = { ...person.itemQuantities };
    if (clamped <= 0) {
      delete nextQuantities[itemKey];
    } else {
      nextQuantities[itemKey] = clamped;
    }

    return {
      ...person,
      itemQuantities: nextQuantities,
    };
  });
};

export function PaymentModal({ order, onClose, onSubmit, isSubmitting = false, title }: PaymentModalProps) {
  const total = useMemo(() => Math.round(order.total), [order.total]);
  const assignableItems = useMemo<AssignableItem[]>(() => {
    return order.items.map((cartItem, index) => {
      const quantity = Math.max(0, Math.round(cartItem.cantidad));
      const unitPrice = Math.round(getCartItemEffectiveUnitPrice(cartItem));
      const key = `${index}-${cartItem.item.id}-${cartItem.customKey ?? 'default'}`;
      return {
        key,
        label: cartItem.item.nombre,
        quantity,
        unitPrice,
        subtotal: unitPrice * quantity,
        details: buildItemDetails(cartItem),
      };
    });
  }, [order.items]);

  const assignableItemsByKey = useMemo(() => {
    return assignableItems.reduce<Record<string, AssignableItem>>((map, item) => {
      map[item.key] = item;
      return map;
    }, {});
  }, [assignableItems]);

  const personCounterRef = useRef(1);
  const createSplitPerson = useCallback(
    (options?: { name?: string; method?: PaymentMethod; itemQuantities?: Record<string, number> }) => {
      const index = personCounterRef.current++;
      return {
        id: `persona-${index}`,
        name: options?.name ?? `Persona ${index}`,
        method: options?.method ?? 'efectivo',
        itemQuantities: options?.itemQuantities ?? {},
      };
    },
    []
  );

  const existingAllocations = useMemo(() => getOrderAllocations(order), [order]);

  const [mode, setMode] = useState<PaymentMode>('single');
  const [selectedMethods, setSelectedMethods] = useState<Record<PaymentMethod, boolean>>(emptySelection);
  const [methodAmounts, setMethodAmounts] = useState<Record<PaymentMethod, string>>(emptyAmounts);
  const [feedback, setFeedback] = useState<string | null>(null);

  const buildInitialSplitState = useCallback((): SplitPersonState[] => {
    personCounterRef.current = 1;
    const baseAssignments = assignableItems.reduce<Record<string, number>>((map, item) => {
      if (item.quantity > 0) {
        map[item.key] = item.quantity;
      }
      return map;
    }, {});

    const primaryMethod = existingAllocations[0]?.metodo ?? 'efectivo';
    const secondaryMethod = existingAllocations[1]?.metodo ?? primaryMethod;

    return [
      createSplitPerson({ name: 'Persona 1', method: primaryMethod, itemQuantities: baseAssignments }),
      createSplitPerson({ name: 'Persona 2', method: secondaryMethod }),
    ];
  }, [assignableItems, createSplitPerson, existingAllocations]);

  const [splitPersons, setSplitPersons] = useState<SplitPersonState[]>(buildInitialSplitState);

  useEffect(() => {
    setSplitPersons(buildInitialSplitState());
  }, [buildInitialSplitState]);

  useEffect(() => {
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
  }, [existingAllocations, total]);

  const previousOrderIdRef = useRef(order.id);
  useEffect(() => {
    if (previousOrderIdRef.current !== order.id) {
      previousOrderIdRef.current = order.id;
      setMode('single');
      setFeedback(null);
    }
  }, [order.id]);

  const handleModeChange = (nextMode: PaymentMode) => {
    setMode(nextMode);
    setFeedback(null);
  };

  const selectedList = useMemo(
    () => PAYMENT_METHODS.filter((method) => selectedMethods[method]),
    [selectedMethods]
  );

  const singleAllocations: PaymentAllocation[] = useMemo(
    () =>
      selectedList.map((method) => ({
        metodo: method,
        monto: toPositiveInteger(methodAmounts[method]),
      })),
    [methodAmounts, selectedList]
  );

  const singlePaidTotal = useMemo(() => getAllocationsTotal(singleAllocations), [singleAllocations]);
  const singleRemaining = total - singlePaidTotal;
  const singleHasEmptyAmounts = singleAllocations.some((allocation) => allocation.monto <= 0);
  const singleHasSelection = selectedList.length > 0;
  const singleIsExactAmount = Math.abs(singleRemaining) <= 1;
  const singleCanSubmit = singleHasSelection && !singleHasEmptyAmounts && singleIsExactAmount && total > 0;

  const splitItemStatus = useMemo(() => {
    return assignableItems.reduce<Record<string, { assigned: number; remaining: number }>>((acc, item) => {
      const assigned = splitPersons.reduce((sum, person) => sum + (person.itemQuantities[item.key] ?? 0), 0);
      acc[item.key] = {
        assigned,
        remaining: item.quantity - assigned,
      };
      return acc;
    }, {});
  }, [assignableItems, splitPersons]);

  const splitTotalsByPerson = useMemo(() => {
    return splitPersons.reduce<Record<string, number>>((acc, person) => {
      const totalForPerson = assignableItems.reduce((sum, item) => {
        const quantity = person.itemQuantities[item.key] ?? 0;
        return sum + quantity * item.unitPrice;
      }, 0);
      acc[person.id] = Math.round(totalForPerson);
      return acc;
    }, {});
  }, [assignableItems, splitPersons]);

  const splitAllocations = useMemo(() => {
    return splitPersons
      .map((person) => {
        const amount = splitTotalsByPerson[person.id] ?? 0;
        if (amount <= 0) {
          return null;
        }
        return { metodo: person.method, monto: amount } as PaymentAllocation;
      })
      .filter((entry): entry is PaymentAllocation => entry !== null);
  }, [splitPersons, splitTotalsByPerson]);

  const splitPaidTotal = useMemo(() => getAllocationsTotal(splitAllocations), [splitAllocations]);
  const splitAllItemsAssigned = useMemo(
    () => assignableItems.every((item) => (splitItemStatus[item.key]?.assigned ?? 0) === item.quantity),
    [assignableItems, splitItemStatus]
  );
  const splitHasAssignments = splitAllocations.length > 0;
  const splitTotalsMatch = Math.abs(splitPaidTotal - total) <= 1;

  const paidTotal = mode === 'split' ? splitPaidTotal : singlePaidTotal;
  const remaining = total - paidTotal;

  const summary = useMemo(
    () => formatPaymentSummary(mode === 'split' ? splitAllocations : singleAllocations, formatCOP),
    [mode, singleAllocations, splitAllocations]
  );

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

      setFeedback(null);
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
    setFeedback(null);
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
    setFeedback(null);
  };

  const handleAddSplitPerson = () => {
    setSplitPersons((prev) => [...prev, createSplitPerson()]);
    setFeedback(null);
  };

  const handleRemoveSplitPerson = (personId: string) => {
    setSplitPersons((prev) => {
      if (prev.length <= 1) {
        return prev;
      }
      return prev.filter((person) => person.id !== personId);
    });
    setFeedback(null);
  };

  const handleSplitPersonNameChange = (personId: string, value: string) => {
    setSplitPersons((prev) =>
      prev.map((person) => (person.id === personId ? { ...person, name: value } : person))
    );
    setFeedback(null);
  };

  const handleSplitPersonMethodChange = (personId: string, method: PaymentMethod) => {
    setSplitPersons((prev) =>
      prev.map((person) => (person.id === personId ? { ...person, method } : person))
    );
    setFeedback(null);
  };

  const handleSplitQuantityInputChange = (personId: string, itemKey: string, value: string) => {
    if (value === '') {
      setSplitPersons((prev) => applySplitQuantityChange(prev, personId, itemKey, 0, assignableItemsByKey));
      setFeedback(null);
      return;
    }

    if (!/^[0-9]+$/.test(value)) {
      return;
    }

    const numeric = Number(value);
    setSplitPersons((prev) => applySplitQuantityChange(prev, personId, itemKey, numeric, assignableItemsByKey));
    setFeedback(null);
  };

  const handleSplitQuantityAdjust = (personId: string, itemKey: string, delta: number) => {
    setSplitPersons((prev) => {
      const current = prev.find((person) => person.id === personId)?.itemQuantities[itemKey] ?? 0;
      return applySplitQuantityChange(prev, personId, itemKey, current + delta, assignableItemsByKey);
    });
    setFeedback(null);
  };

  const handleSplitAssignRemaining = (personId: string, itemKey: string) => {
    setSplitPersons((prev) => {
      const item = assignableItemsByKey[itemKey];
      if (!item) {
        return prev;
      }
      const assignedByOthers = prev.reduce((sum, person) => {
        if (person.id === personId) {
          return sum;
        }
        return sum + (person.itemQuantities[itemKey] ?? 0);
      }, 0);
      const desired = item.quantity - assignedByOthers;
      return applySplitQuantityChange(prev, personId, itemKey, desired, assignableItemsByKey);
    });
    setFeedback(null);
  };

  const handleSubmit = async () => {
    if (mode === 'split') {
      if (!splitHasAssignments) {
        setFeedback('Asigna al menos un producto y método de pago para continuar.');
        return;
      }
      if (!splitAllItemsAssigned) {
        setFeedback('Distribuye todos los productos entre las personas antes de confirmar.');
        return;
      }
      if (!splitTotalsMatch) {
        setFeedback('Los montos asignados no coinciden con el total del pedido.');
        return;
      }
    } else if (!singleCanSubmit) {
      setFeedback('Asegúrate de seleccionar al menos un método y que los montos sumen el total.');
      return;
    }

    const allocationsToSubmit = mode === 'split' ? splitAllocations : singleAllocations;
    const sanitized = mergeAllocations(sanitizeAllocations(allocationsToSubmit));
    const resultTotal = getAllocationsTotal(sanitized);
    if (Math.abs(resultTotal - total) > 1) {
      setFeedback('Los montos registrados no coinciden con el total del pedido.');
      return;
    }

    setFeedback(null);
    await onSubmit(sanitized);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
            <div className="grid grid-cols-2 bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => handleModeChange('single')}
                className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  mode === 'single' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pago completo
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('split')}
                className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  mode === 'split' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dividir cuenta
              </button>
            </div>
          </div>

          {mode === 'single' ? (
            <>
              <div>
                <h4 className="text-sm font-semibold mb-2" style={{ color: COLORS.dark }}>
                  Selecciona los métodos de pago
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map((method) => {
                    const isActive = selectedMethods[method];
                    const label = PAYMENT_METHOD_LABELS[method];
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
                    const label = PAYMENT_METHOD_LABELS[method];
                    return (
                      <div key={method} className="flex flex-col gap-2 p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium" style={{ color: COLORS.dark }}>
                            {label}
                          </span>
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
            </>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                    Personas
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddSplitPerson}
                    className="text-xs font-medium text-gray-600 hover:text-gray-900"
                  >
                    Agregar persona
                  </button>
                </div>
                <div className="space-y-3">
                  {splitPersons.map((person, index) => {
                    const displayName = person.name.trim() ? person.name : `Persona ${index + 1}`;
                    const amount = splitTotalsByPerson[person.id] ?? 0;
                    return (
                      <div
                        key={person.id}
                        className="border border-gray-200 rounded-lg bg-gray-50 p-3 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex-1 flex items-center gap-2">
                            <input
                              type="text"
                              value={person.name}
                              onChange={(event) => handleSplitPersonNameChange(person.id, event.target.value)}
                              placeholder={`Persona ${index + 1}`}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:border-transparent"
                              style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                            />
                            {splitPersons.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSplitPerson(person.id)}
                                className="text-xs text-red-600 hover:text-red-700"
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold uppercase text-gray-500">Pago con</span>
                            <select
                              value={person.method}
                              onChange={(event) =>
                                handleSplitPersonMethodChange(person.id, event.target.value as PaymentMethod)
                              }
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:border-transparent"
                              style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                            >
                              {PAYMENT_METHODS.map((method) => (
                                <option key={method} value={method}>
                                  {PAYMENT_METHOD_LABELS[method]}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Total asignado:{' '}
                          <span className="font-semibold" style={{ color: COLORS.dark }}>
                            {formatCOP(amount)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2" style={{ color: COLORS.dark }}>
                  Asignar productos
                </h4>
                <div className="space-y-4">
                  {assignableItems.map((item) => {
                    const status = splitItemStatus[item.key];
                    const assigned = status?.assigned ?? 0;
                    const remainingQty = status?.remaining ?? 0;
                    return (
                      <div key={item.key} className="border border-gray-200 rounded-lg p-3 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium" style={{ color: COLORS.dark }}>
                              {item.label}
                            </p>
                            <p className="text-xs text-gray-500">
                              Cantidad: {item.quantity} · Precio unidad: {formatCOP(item.unitPrice)} · Subtotal:{' '}
                              {formatCOP(item.subtotal)}
                            </p>
                            {item.details.map((detail, detailIndex) => (
                              <p key={detailIndex} className="text-xs text-gray-500">
                                {detail}
                              </p>
                            ))}
                          </div>
                          <div className="text-xs font-medium text-gray-600">
                            Asignado: {assigned}/{item.quantity}
                            {remainingQty > 0 && <span className="text-red-600"> · Pendiente: {remainingQty}</span>}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {splitPersons.map((person, index) => {
                            const personAssigned = person.itemQuantities[item.key] ?? 0;
                            const statusForItem = splitItemStatus[item.key];
                            const assignedForItem = statusForItem?.assigned ?? 0;
                            const othersAssigned = Math.max(0, assignedForItem - personAssigned);
                            const maxForPerson = Math.max(0, item.quantity - othersAssigned);
                            const amount = personAssigned * item.unitPrice;
                            const displayName = person.name.trim() ? person.name : `Persona ${index + 1}`;
                            const remainingQuantity = statusForItem?.remaining ?? 0;
                            const canTakeRemaining = remainingQuantity > 0 || maxForPerson > personAssigned;
                            return (
                              <div
                                key={person.id}
                                className="flex flex-col border border-gray-200 rounded-md p-2 gap-2 bg-white"
                              >
                                <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
                                  <span className="truncate">{displayName}</span>
                                  <span>{formatCOP(amount)}</span>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                    <button
                                      type="button"
                                      onClick={() => handleSplitQuantityAdjust(person.id, item.key, -1)}
                                      className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900"
                                    >
                                      −
                                    </button>
                                    <input
                                      type="number"
                                      min="0"
                                      max={maxForPerson}
                                      value={personAssigned}
                                      onChange={(event) =>
                                        handleSplitQuantityInputChange(person.id, item.key, event.target.value)
                                      }
                                      className="w-16 px-2 py-1 text-center text-sm border-l border-r border-gray-300 focus:outline-none focus:ring-1"
                                      style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleSplitQuantityAdjust(person.id, item.key, 1)}
                                      className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900"
                                    >
                                      +
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleSplitAssignRemaining(person.id, item.key)}
                                    className="text-xs text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                                    disabled={!canTakeRemaining}
                                  >
                                    Tomar restante
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {!splitAllItemsAssigned && (
                  <p className="text-xs text-red-600">Aún hay productos sin asignar.</p>
                )}
              </div>
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
