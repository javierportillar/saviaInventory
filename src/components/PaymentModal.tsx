import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { COLORS } from '../data/menu';
import { CartItem, Empleado, Order, PaymentAllocation, PaymentMethod } from '../types';
import {
  formatPaymentSummary,
  getAllocationsTotal,
  getOrderAllocations,
  mergeAllocations,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  sanitizeAllocations,
} from '../utils/payments';
import { formatCOP } from '../utils/format';
import { getCartItemEffectiveUnitPrice } from '../utils/cart';
import dataService, { EMPLOYEE_CREDIT_UPDATED_EVENT } from '../lib/dataService';

interface PaymentModalProps {
  order: Order;
  onClose: () => void;
  onSubmit: (allocations: PaymentAllocation[]) => Promise<void> | void;
  isSubmitting?: boolean;
  title?: string;
  onAssignCredit?: (options: { employeeId: string; amount: number; employeeName?: string }) => Promise<void> | void;
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
  employeeId?: string;
}

interface DragState {
  personId: string;
  personName: string;
}

const emptySelection = (): Record<PaymentMethod, boolean> => ({
  efectivo: false,
  tarjeta: false,
  nequi: false,
  credito_empleados: false,
});

const emptyAmounts = (): Record<PaymentMethod, string> => ({
  efectivo: '',
  tarjeta: '',
  nequi: '',
  credito_empleados: '',
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

export function PaymentModal({
  order,
  onClose,
  onSubmit,
  isSubmitting = false,
  title,
  onAssignCredit,
}: PaymentModalProps) {
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

  const [employees, setEmployees] = useState<Empleado[]>([]);
  const [employeeCredits, setEmployeeCredits] = useState<Record<string, number>>({});
  const [selectedCreditEmployeeId, setSelectedCreditEmployeeId] = useState<string>('');

  const activeEmployees = useMemo(
    () => employees.filter((employee) => employee.activo),
    [employees]
  );

  const hasActiveEmployees = activeEmployees.length > 0;

  const getEmployeeNameById = useCallback(
    (employeeId?: string) => {
      if (!employeeId) {
        return '';
      }
      const match = activeEmployees.find((employee) => employee.id === employeeId);
      return match ? match.nombre : '';
    },
    [activeEmployees]
  );

  const getEmployeeOptionLabel = useCallback(
    (employee: Empleado) => {
      const total = employeeCredits[employee.id] ?? 0;
      if (total > 0) {
        return `${employee.nombre} · ${formatCOP(total)} pendientes`;
      }
      return employee.nombre;
    },
    [employeeCredits]
  );

  const personCounterRef = useRef(1);
  const createSplitPerson = useCallback(
    (
      options?: {
        name?: string;
        method?: PaymentMethod;
        itemQuantities?: Record<string, number>;
        employeeId?: string;
      }
    ) => {
      const index = personCounterRef.current++;
      return {
        id: `persona-${index}`,
        name: options?.name ?? `Persona ${index}`,
        method: options?.method ?? 'efectivo',
        itemQuantities: options?.itemQuantities ?? {},
        employeeId: options?.employeeId,
      };
    },
    []
  );

  const existingAllocations = useMemo(() => getOrderAllocations(order), [order]);

  useEffect(() => {
    let active = true;

    const loadEmployeeData = async () => {
      try {
        const [employeeData, creditData] = await Promise.all([
          dataService.fetchEmpleados(),
          dataService.fetchEmployeeCredits().catch(() => []),
        ]);

        if (!active) {
          return;
        }

        setEmployees(employeeData);
        const creditMap = (creditData ?? []).reduce<Record<string, number>>((map, entry) => {
          map[entry.empleadoId] = Math.max(0, Math.round(entry.total));
          return map;
        }, {});
        setEmployeeCredits(creditMap);
      } catch (error) {
        console.error('No se pudieron cargar los empleados o créditos.', error);
      }
    };

    loadEmployeeData();

    const handleCreditUpdate = () => {
      loadEmployeeData();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(EMPLOYEE_CREDIT_UPDATED_EVENT, handleCreditUpdate);
    }

    return () => {
      active = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener(EMPLOYEE_CREDIT_UPDATED_EVENT, handleCreditUpdate);
      }
    };
  }, []);

  const [mode, setMode] = useState<PaymentMode>('single');
  const [selectedMethods, setSelectedMethods] = useState<Record<PaymentMethod, boolean>>(() => emptySelection());
  const [methodAmounts, setMethodAmounts] = useState<Record<PaymentMethod, string>>(() => emptyAmounts());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<DragState | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const buildInitialSplitState = useCallback((): SplitPersonState[] => {
    personCounterRef.current = 1;

    const primaryAllocation = existingAllocations[0];
    const secondaryAllocation = existingAllocations[1];

    const primaryMethod = primaryAllocation?.metodo ?? 'efectivo';
    const secondaryMethod = secondaryAllocation?.metodo ?? primaryMethod;

    const primaryEmployeeId =
      primaryAllocation?.metodo === 'credito_empleados' ? primaryAllocation.empleadoId : undefined;
    const secondaryEmployeeId =
      secondaryAllocation?.metodo === 'credito_empleados' ? secondaryAllocation.empleadoId : undefined;

    return [
      createSplitPerson({
        name: 'Persona 1',
        method: primaryMethod,
        itemQuantities: {},
        employeeId: primaryEmployeeId,
      }),
      createSplitPerson({
        name: 'Persona 2',
        method: secondaryMethod,
        itemQuantities: {},
        employeeId: secondaryEmployeeId,
      }),
    ];
  }, [createSplitPerson, existingAllocations]);

  const [splitPersons, setSplitPersons] = useState<SplitPersonState[]>(buildInitialSplitState);

  useEffect(() => {
    setSplitPersons(buildInitialSplitState());
  }, [buildInitialSplitState]);

  useEffect(() => {
    if (existingAllocations.length === 0) {
      const baseSelected = emptySelection();
      baseSelected.efectivo = true;
      const baseAmounts = emptyAmounts();
      baseAmounts.efectivo = total > 0 ? String(total) : '';
      setSelectedMethods(baseSelected);
      setMethodAmounts(baseAmounts);
      setSelectedCreditEmployeeId('');
      setFeedback(null);
      return;
    }

    const nextSelected = emptySelection();
    const nextAmounts = emptyAmounts();
    let creditEmployeeId: string | undefined;
    existingAllocations.forEach((allocation) => {
      nextSelected[allocation.metodo] = true;
      nextAmounts[allocation.metodo] = String(Math.round(allocation.monto));
      if (allocation.metodo === 'credito_empleados' && allocation.empleadoId) {
        creditEmployeeId = allocation.empleadoId;
      }
    });
    setSelectedMethods(nextSelected);
    setMethodAmounts(nextAmounts);
    setSelectedCreditEmployeeId(creditEmployeeId ?? '');
    setFeedback(null);
  }, [existingAllocations, total]);

  useEffect(() => {
    if (!selectedMethods['credito_empleados']) {
      if (selectedCreditEmployeeId) {
        setSelectedCreditEmployeeId('');
      }
      return;
    }

    if (!hasActiveEmployees) {
      if (selectedCreditEmployeeId) {
        setSelectedCreditEmployeeId('');
      }
      return;
    }

    if (
      selectedCreditEmployeeId &&
      activeEmployees.some((employee) => employee.id === selectedCreditEmployeeId)
    ) {
      return;
    }

    const fallbackId = activeEmployees[0]?.id ?? '';
    setSelectedCreditEmployeeId(fallbackId);
  }, [selectedMethods, selectedCreditEmployeeId, activeEmployees, hasActiveEmployees]);

  useEffect(() => {
    setSplitPersons((prev) => {
      let hasChanges = false;
      const next = prev.map((person) => {
        if (person.method !== 'credito_empleados') {
          if (person.employeeId !== undefined) {
            hasChanges = true;
            return { ...person, employeeId: undefined };
          }
          return person;
        }

        if (!hasActiveEmployees) {
          if (person.employeeId !== undefined) {
            hasChanges = true;
            return { ...person, employeeId: undefined };
          }
          return person;
        }

        if (
          person.employeeId &&
          activeEmployees.some((employee) => employee.id === person.employeeId)
        ) {
          return person;
        }

        hasChanges = true;
        return { ...person, employeeId: activeEmployees[0]?.id };
      });

      return hasChanges ? next : prev;
    });
  }, [activeEmployees, hasActiveEmployees]);

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
      selectedList.map((method) => {
        const allocation: PaymentAllocation = {
          metodo: method,
          monto: toPositiveInteger(methodAmounts[method]),
        };
        if (method === 'credito_empleados' && selectedCreditEmployeeId) {
          allocation.empleadoId = selectedCreditEmployeeId;
          const employeeName = getEmployeeNameById(selectedCreditEmployeeId);
          if (employeeName) {
            allocation.empleadoNombre = employeeName;
          }
        }
        return allocation;
      }),
    [methodAmounts, selectedList, selectedCreditEmployeeId, getEmployeeNameById]
  );

  const singlePaidTotal = useMemo(() => getAllocationsTotal(singleAllocations), [singleAllocations]);
  const singleRemaining = total - singlePaidTotal;
  const singleHasEmptyAmounts = singleAllocations.some((allocation) => allocation.monto <= 0);
  const singleHasSelection = selectedList.length > 0;
  const singleIsExactAmount = Math.abs(singleRemaining) <= 1;
  const singleCreditMissingEmployee = selectedList.some(
    (method) => method === 'credito_empleados' && !selectedCreditEmployeeId
  );
  const singleCanSubmit =
    singleHasSelection &&
    !singleHasEmptyAmounts &&
    singleIsExactAmount &&
    total > 0 &&
    !singleCreditMissingEmployee;

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
        const allocation: PaymentAllocation = { metodo: person.method, monto: amount };
        if (person.method === 'credito_empleados' && person.employeeId) {
          allocation.empleadoId = person.employeeId;
          const employeeName = getEmployeeNameById(person.employeeId);
          if (employeeName) {
            allocation.empleadoNombre = employeeName;
          }
        }
        return allocation;
      })
      .filter((entry): entry is PaymentAllocation => entry !== null);
  }, [splitPersons, splitTotalsByPerson, getEmployeeNameById]);

  const splitPaidTotal = useMemo(() => getAllocationsTotal(splitAllocations), [splitAllocations]);
  const splitAllItemsAssigned = useMemo(
    () => assignableItems.every((item) => (splitItemStatus[item.key]?.assigned ?? 0) === item.quantity),
    [assignableItems, splitItemStatus]
  );
  const splitHasAssignments = splitAllocations.length > 0;
  const splitTotalsMatch = Math.abs(splitPaidTotal - total) <= 1;
  const splitHasMissingEmployee = useMemo(
    () => splitPersons.some((person) => person.method === 'credito_empleados' && !person.employeeId),
    [splitPersons]
  );

  const paidTotal = mode === 'split' ? splitPaidTotal : singlePaidTotal;
  const remaining = total - paidTotal;

  const summary = useMemo(
    () => formatPaymentSummary(mode === 'split' ? splitAllocations : singleAllocations, formatCOP),
    [mode, singleAllocations, splitAllocations]
  );

  const isCreditOrder = !!order.creditInfo;
  const creditAmount = order.creditInfo?.amount ?? total;
  const creditAssignedAtLabel = useMemo(() => {
    if (!order.creditInfo) {
      return '';
    }
    return order.creditInfo.assignedAt.toLocaleString('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }, [order.creditInfo]);

  const handleToggleMethod = (method: PaymentMethod) => {
    setSelectedMethods((prevSelected) => {
      const isCurrentlySelected = !!prevSelected[method];
      if (!isCurrentlySelected && method === 'credito_empleados' && !hasActiveEmployees) {
        setFeedback('No hay empleados activos para registrar créditos.');
        return prevSelected;
      }

      if (prevSelected['credito_empleados'] && method !== 'credito_empleados' && !isCurrentlySelected) {
        setFeedback('No puedes combinar el crédito de empleados con otros métodos.');
        return prevSelected;
      }

      if (method === 'credito_empleados') {
        if (!isCurrentlySelected) {
          setMethodAmounts(() => ({
            efectivo: '',
            tarjeta: '',
            nequi: '',
            credito_empleados: total > 0 ? String(total) : '',
          }));

          if (
            !selectedCreditEmployeeId ||
            !activeEmployees.some((employee) => employee.id === selectedCreditEmployeeId)
          ) {
            setSelectedCreditEmployeeId(activeEmployees[0]?.id ?? '');
          }

          setFeedback(null);
          return {
            efectivo: false,
            tarjeta: false,
            nequi: false,
            credito_empleados: true,
          };
        }

        setMethodAmounts((prev) => ({ ...prev, credito_empleados: '' }));
        setSelectedCreditEmployeeId('');
        setFeedback(null);
        return {
          ...prevSelected,
          credito_empleados: false,
        };
      }

      const nextSelected = { ...prevSelected, [method]: !isCurrentlySelected };

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
    if (method === 'credito_empleados' && !hasActiveEmployees) {
      setFeedback('No hay empleados activos para registrar créditos.');
      return;
    }
    setSplitPersons((prev) =>
      prev.map((person) => {
        if (person.id !== personId) {
          return person;
        }

        if (method === 'credito_empleados') {
          const validEmployeeId =
            person.employeeId &&
            activeEmployees.some((employee) => employee.id === person.employeeId)
              ? person.employeeId
              : activeEmployees[0]?.id;
          return {
            ...person,
            method,
            employeeId: validEmployeeId,
          };
        }

        if (person.employeeId !== undefined) {
          return { ...person, method, employeeId: undefined };
        }

        return { ...person, method };
      })
    );
    setFeedback(null);
  };

  const handleSplitPersonEmployeeChange = (personId: string, employeeId: string) => {
    setSplitPersons((prev) =>
      prev.map((person) => {
        if (person.id !== personId) {
          return person;
        }
        return {
          ...person,
          employeeId: employeeId ? employeeId : undefined,
        };
      })
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

  const handlePersonDragStart = (personId: string, personName: string) => {
    setDraggedItem({ personId, personName });
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDropTarget(null);
  };

  const handleItemDragOver = (event: React.DragEvent, itemKey: string) => {
    event.preventDefault();
    if (!draggedItem) {
      return;
    }
    const status = splitItemStatus[itemKey];
    const remaining = status?.remaining ?? 0;
    if (remaining > 0) {
      setDropTarget(itemKey);
    }
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleItemDrop = (event: React.DragEvent, itemKey: string) => {
    event.preventDefault();
    if (!draggedItem) {
      return;
    }

    const item = assignableItemsByKey[itemKey];
    if (!item) {
      setDraggedItem(null);
      setDropTarget(null);
      return;
    }

    const status = splitItemStatus[itemKey];
    const remaining = status?.remaining ?? 0;

    if (remaining <= 0) {
      setFeedback(`No hay unidades pendientes de ${item.label} para asignar.`);
      setDraggedItem(null);
      setDropTarget(null);
      return;
    }

    setSplitPersons((prev) => {
      const person = prev.find((p) => p.id === draggedItem.personId);
      if (!person) {
        return prev;
      }

      const currentQuantity = person.itemQuantities[itemKey] ?? 0;
      const newQuantity = currentQuantity + 1;

      return applySplitQuantityChange(prev, draggedItem.personId, itemKey, newQuantity, assignableItemsByKey);
    });

    setDraggedItem(null);
    setDropTarget(null);
    setFeedback(null);
  };

  const assignCredit = async (options: { employeeId: string; amount: number; employeeName?: string }) => {
    if (!onAssignCredit || isSubmitting) {
      return;
    }
    setFeedback(null);
    await onAssignCredit(options);
  };

  const handleSubmit = async () => {
    const isSingleCreditSelection =
      mode === 'single' && selectedList.length === 1 && selectedList[0] === 'credito_empleados';

    if (isSingleCreditSelection && onAssignCredit && !isCreditOrder) {
      if (singleCreditMissingEmployee) {
        setFeedback('Selecciona el empleado al registrar un crédito.');
        return;
      }

      const employeeId = selectedCreditEmployeeId;
      const creditAmount = Math.max(
        0,
        toPositiveInteger(methodAmounts['credito_empleados']) || total
      );

      if (!employeeId) {
        setFeedback('Selecciona el empleado al registrar un crédito.');
        return;
      }

      if (creditAmount <= 0) {
        setFeedback('El monto a crédito debe ser mayor a cero.');
        return;
      }

      await assignCredit({
        employeeId,
        amount: creditAmount,
        employeeName: getEmployeeNameById(employeeId) || undefined,
      });
      return;
    }

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
      if (splitHasMissingEmployee) {
        setFeedback('Selecciona el empleado correspondiente para cada pago por crédito.');
        return;
      }
    } else if (!singleCanSubmit) {
      if (singleCreditMissingEmployee) {
        setFeedback('Selecciona el empleado al registrar un crédito.');
      } else {
        setFeedback('Asegúrate de seleccionar al menos un método y que los montos sumen el total.');
      }
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {PAYMENT_METHODS.map((method) => {
                    const isActive = selectedMethods[method];
                    const label = PAYMENT_METHOD_LABELS[method];
                    const disableMethod =
                      (selectedMethods['credito_empleados'] && method !== 'credito_empleados') ||
                      isSubmitting;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => handleToggleMethod(method)}
                        disabled={disableMethod}
                        className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                          isActive
                            ? 'border-transparent text-white'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
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
                        {method === 'credito_empleados' && (
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-gray-600" htmlFor={`credit-employee-${method}`}>
                              Empleado
                            </label>
                            {hasActiveEmployees ? (
                              <select
                                id={`credit-employee-${method}`}
                                value={selectedCreditEmployeeId}
                                onChange={(event) => setSelectedCreditEmployeeId(event.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:border-transparent"
                                style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                              >
                                <option value="">Selecciona un empleado</option>
                                {activeEmployees.map((employee) => (
                                  <option key={employee.id} value={employee.id}>
                                    {getEmployeeOptionLabel(employee)}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <p className="text-xs text-red-600">
                                No hay empleados activos disponibles para crédito.
                              </p>
                            )}
                          </div>
                        )}
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
                        draggable={true}
                        onDragStart={() => handlePersonDragStart(person.id, displayName)}
                        onDragEnd={handleDragEnd}
                        className="border border-gray-200 rounded-lg bg-gray-50 p-3 space-y-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
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
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2">
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
                          {person.method === 'credito_empleados' && (
                            hasActiveEmployees ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold uppercase text-gray-500">Empleado</span>
                                <select
                                  value={person.employeeId ?? ''}
                                  onChange={(event) =>
                                    handleSplitPersonEmployeeChange(person.id, event.target.value)
                                  }
                                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:border-transparent"
                                  style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                                >
                                  <option value="">Selecciona un empleado</option>
                                  {activeEmployees.map((employee) => (
                                    <option key={employee.id} value={employee.id}>
                                      {getEmployeeOptionLabel(employee)}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <span className="text-xs text-red-600">
                                No hay empleados activos
                              </span>
                            )
                          )}
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
                    const canReceiveDrop = remainingQty > 0;
                    const isDropTarget = dropTarget === item.key;
                    return (
                      <div
                        key={item.key}
                        onDragOver={(e) => handleItemDragOver(e, item.key)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleItemDrop(e, item.key)}
                        className={`border rounded-lg p-3 space-y-3 transition-all ${
                          isDropTarget && canReceiveDrop
                            ? 'border-2 border-green-500 bg-green-50 shadow-lg'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium" style={{ color: COLORS.dark }}>
                                {item.label}
                              </p>
                              {canReceiveDrop && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                  Suelta persona aquí
                                </span>
                              )}
                              {isDropTarget && draggedItem && (
                                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded font-medium animate-pulse">
                                  Asignar a {draggedItem.personName}
                                </span>
                              )}
                            </div>
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
                        <div className="flex flex-wrap gap-2">
                          {splitPersons.map((person, index) => {
                            const personAssigned = person.itemQuantities[item.key] ?? 0;
                            if (personAssigned === 0) {
                              return null;
                            }
                            const amount = personAssigned * item.unitPrice;
                            const displayName = person.name.trim() ? person.name : `Persona ${index + 1}`;
                            return (
                              <div
                                key={person.id}
                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full"
                              >
                                <span className="text-sm font-medium text-blue-900">{displayName}</span>
                                <span className="text-xs text-blue-700">×{personAssigned}</span>
                                <span className="text-xs text-blue-600">({formatCOP(amount)})</span>
                                <button
                                  type="button"
                                  onClick={() => handleSplitQuantityAdjust(person.id, item.key, -personAssigned)}
                                  className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                                  title="Quitar asignación"
                                >
                                  ×
                                </button>
                              </div>
                            );
                          })}
                          {assigned === 0 && (
                            <span className="text-xs text-gray-400 italic py-1.5">Sin asignar - arrastra una persona aquí</span>
                          )}
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

          {isCreditOrder ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
              <p className="font-semibold mb-1">Pedido asignado como crédito de empleados.</p>
              <p>Monto pendiente: {formatCOP(Math.round(creditAmount))}</p>
              <p>Asignado el: {creditAssignedAtLabel}</p>
              <p className="mt-1">Registra el pago cuando el crédito sea cancelado para reflejarlo en el balance.</p>
            </div>
          ) : (
            onAssignCredit && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
                <p className="font-semibold mb-1">Crédito de empleados disponible.</p>
                <p>Usa la opción "Crédito empleados" en los métodos de pago para enviar este pedido a crédito.</p>
                <p className="mt-1">El monto no se sumará al balance hasta registrar el pago.</p>
              </div>
            )
          )}

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
