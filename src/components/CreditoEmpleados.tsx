import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarRange,
  Users,
  ClipboardList,
  CheckCircle,
  Loader2,
  History,
  X,
} from 'lucide-react';
import { EmployeeCreditRecord, Order, PaymentMethod } from '../types';
import { COLORS } from '../data/menu';
import { formatCOP, formatDateInputValue, parseDateInputValue } from '../utils/format';
import { formatPaymentSummary, getOrderAllocations, isOrderPaid } from '../utils/payments';
import dataService, { EMPLOYEE_CREDIT_UPDATED_EVENT } from '../lib/dataService';

const UNASSIGNED_EMPLOYEE_KEY = '__sin_empleado__';

type SettlementPaymentMethod = Extract<PaymentMethod, 'efectivo' | 'nequi' | 'tarjeta'>;

const SETTLEMENT_METHODS: { value: SettlementPaymentMethod; label: string; description: string }[] = [
  { value: 'efectivo', label: 'Efectivo', description: 'Pago recibido en caja.' },
  { value: 'nequi', label: 'Nequi', description: 'Transferencia recibida a Nequi.' },
  { value: 'tarjeta', label: 'Tarjeta', description: 'Pago con datafono o tarjeta.' },
];

interface CreditoEmpleadosProps {
  orders: Order[];
  onSettleCredit: (order: Order, options: { metodo: PaymentMethod }) => Promise<void>;
}

interface CreditOrderView {
  order: Order;
  assignedAt: Date;
  amount: number;
  employeeLabel: string;
  employeeId?: string;
}

const normalizeDateStart = (value: Date) => {
  const next = new Date(value);
  next.setHours(0, 0, 0, 0);
  return next;
};

const normalizeDateEnd = (value: Date) => {
  const next = new Date(value);
  next.setHours(23, 59, 59, 999);
  return next;
};

const formatAssignedAt = (value: Date) => {
  return value.toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const formatHistoryTimestamp = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Fecha desconocida';
  }
  return date.toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const buildEmployeeLabel = (id: string, nombre?: string) => {
  if (nombre && nombre.trim().length > 0) {
    return nombre.trim();
  }
  return `Empleado ${id.slice(0, 6)}`;
};

const normalizeSettlementMethod = (method: SettlementPaymentMethod): SettlementPaymentMethod => {
  if (SETTLEMENT_METHODS.some((option) => option.value === method)) {
    return method;
  }
  return 'efectivo';
};

export function CreditoEmpleados({ orders, onSettleCredit }: CreditoEmpleadosProps) {
  const [creditRecords, setCreditRecords] = useState<EmployeeCreditRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const defaultStartDate = useMemo(() => {
    const now = new Date();
    now.setDate(1);
    return formatDateInputValue(now);
  }, []);

  const today = useMemo(() => formatDateInputValue(new Date()), []);

  const [startDate, setStartDate] = useState<string>(defaultStartDate);
  const [endDate, setEndDate] = useState<string>(today);
  const [specificDate, setSpecificDate] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'cargo' | 'abono'>('todos');

  const [settlingOrderId, setSettlingOrderId] = useState<string | null>(null);
  const [settlementOrder, setSettlementOrder] = useState<CreditOrderView | null>(null);
  const [settlementMethod, setSettlementMethod] = useState<SettlementPaymentMethod>('efectivo');
  const [settlementError, setSettlementError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadHistory = async () => {
      setHistoryLoading(true);
      setHistoryError(null);
      try {
        const records = await dataService.fetchEmployeeCredits();
        if (!active) {
          return;
        }
        setCreditRecords(records);
      } catch (error) {
        console.error('Error cargando el historial de crédito de empleados:', error);
        if (!active) {
          return;
        }
        setHistoryError('No se pudo cargar el historial de créditos de empleados.');
      } finally {
        if (active) {
          setHistoryLoading(false);
        }
      }
    };

    loadHistory();

    const handleUpdate = () => {
      loadHistory();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(EMPLOYEE_CREDIT_UPDATED_EVENT, handleUpdate);
    }

    return () => {
      active = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener(EMPLOYEE_CREDIT_UPDATED_EVENT, handleUpdate);
      }
    };
  }, []);

  const pendingCreditOrders = useMemo<CreditOrderView[]>(() => {
    return orders
      .filter((order) => {
        const creditInfo = order.creditInfo;
        if (!creditInfo || creditInfo.type !== 'empleados') {
          return false;
        }
        return !isOrderPaid(order);
      })
      .map((order) => {
        const creditInfo = order.creditInfo!;
        const assignedAt = creditInfo.assignedAt ?? order.timestamp;
        const amount = Math.max(0, Math.round(creditInfo.amount ?? order.total));
        const rawName = creditInfo.employeeName?.trim();
        const employeeId = creditInfo.employeeId ?? undefined;
        const employeeLabel = rawName && rawName.length > 0
          ? rawName
          : employeeId
            ? `Empleado ${employeeId}`
            : 'Empleado sin asignar';
        return {
          order,
          assignedAt,
          amount,
          employeeLabel,
          employeeId,
        };
      })
      .sort((a, b) => b.assignedAt.getTime() - a.assignedAt.getTime());
  }, [orders]);

  const dateRange = useMemo(() => {
    const baseStart = normalizeDateStart(parseDateInputValue(startDate));
    const baseEnd = normalizeDateEnd(parseDateInputValue(endDate));

    if (specificDate) {
      const exact = parseDateInputValue(specificDate);
      const exactStart = normalizeDateStart(exact);
      const exactEnd = normalizeDateEnd(exact);
      return {
        start: exactStart.getTime(),
        end: exactEnd.getTime(),
        isExact: true,
      } as const;
    }

    return {
      start: baseStart.getTime(),
      end: baseEnd.getTime(),
      isExact: false,
    } as const;
  }, [startDate, endDate, specificDate]);

  const availableEmployees = useMemo(() => {
    const entries = new Map<string, string>();

    creditRecords.forEach((record) => {
      const label = buildEmployeeLabel(record.empleadoId, record.empleadoNombre);
      entries.set(record.empleadoId, label);
    });

    pendingCreditOrders.forEach(({ employeeId, employeeLabel }) => {
      if (employeeId) {
        if (!entries.has(employeeId)) {
          entries.set(employeeId, employeeLabel);
        }
      }
    });

    if (pendingCreditOrders.some((entry) => !entry.employeeId)) {
      entries.set(UNASSIGNED_EMPLOYEE_KEY, 'Créditos sin empleado asignado');
    }

    return Array.from(entries.entries())
      .map(([key, label]) => ({ key, label }))
      .sort((a, b) => a.label.localeCompare(b.label, 'es'));
  }, [creditRecords, pendingCreditOrders]);

  useEffect(() => {
    if (selectedEmployee === 'todos') {
      return;
    }
    const exists =
      availableEmployees.findIndex((entry) => entry.key === selectedEmployee) !== -1 ||
      (selectedEmployee === UNASSIGNED_EMPLOYEE_KEY &&
        pendingCreditOrders.some((entry) => !entry.employeeId));
    if (!exists) {
      setSelectedEmployee('todos');
    }
  }, [availableEmployees, pendingCreditOrders, selectedEmployee]);

  const filteredCreditOrders = useMemo(() => {
    const start = dateRange.start;
    const end = dateRange.end;

    return pendingCreditOrders.filter(({ assignedAt, employeeId }) => {
      const assignedTime = assignedAt.getTime();
      if (assignedTime < start || assignedTime > end) {
        return false;
      }

      if (selectedEmployee === 'todos') {
        return true;
      }

      if (selectedEmployee === UNASSIGNED_EMPLOYEE_KEY) {
        return !employeeId;
      }

      return employeeId === selectedEmployee;
    });
  }, [pendingCreditOrders, dateRange, selectedEmployee]);

  const filteredPendingTotal = useMemo(
    () => filteredCreditOrders.reduce((sum, entry) => sum + entry.amount, 0),
    [filteredCreditOrders]
  );

  const outstandingTotal = useMemo(
    () => creditRecords.reduce((sum, record) => sum + Math.round(record.total), 0),
    [creditRecords]
  );

  const historyEntries = useMemo(() => {
    return creditRecords
      .flatMap((record) =>
        record.history.map((entry) => ({
          ...entry,
          empleadoId: record.empleadoId,
          empleadoNombre: entry.empleadoNombre ?? record.empleadoNombre ?? buildEmployeeLabel(record.empleadoId),
        }))
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [creditRecords]);

  const filteredHistoryEntries = useMemo(() => {
    const start = dateRange.start;
    const end = dateRange.end;

    return historyEntries.filter((entry) => {
      const movementTime = new Date(entry.timestamp).getTime();
      if (Number.isNaN(movementTime) || movementTime < start || movementTime > end) {
        return false;
      }

      if (selectedEmployee !== 'todos' && entry.empleadoId !== selectedEmployee) {
        return false;
      }

      if (statusFilter !== 'todos' && entry.tipo !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [dateRange, historyEntries, selectedEmployee, statusFilter]);

  const totalCargos = useMemo(
    () => filteredHistoryEntries.filter((entry) => entry.tipo === 'cargo').reduce((sum, entry) => sum + entry.monto, 0),
    [filteredHistoryEntries]
  );

  const totalAbonos = useMemo(
    () => filteredHistoryEntries.filter((entry) => entry.tipo === 'abono').reduce((sum, entry) => sum + entry.monto, 0),
    [filteredHistoryEntries]
  );

  const netoFiltrado = useMemo(() => totalCargos - totalAbonos, [totalCargos, totalAbonos]);

  const totalsByEmployee = useMemo(() => {
    return creditRecords
      .map((record) => ({
        key: record.empleadoId,
        label: buildEmployeeLabel(record.empleadoId, record.empleadoNombre),
        total: Math.round(record.total),
      }))
      .sort((a, b) => b.total - a.total);
  }, [creditRecords]);

  const handleOpenSettlement = (entry: CreditOrderView) => {
    setSettlementOrder(entry);
    setSettlementMethod('efectivo');
    setSettlementError(null);
  };

  const handleCloseSettlement = () => {
    if (settlingOrderId) {
      return;
    }
    setSettlementOrder(null);
    setSettlementError(null);
  };

  const handleConfirmSettlement = async () => {
    if (!settlementOrder) {
      return;
    }

    const method = normalizeSettlementMethod(settlementMethod);
    try {
      setSettlementError(null);
      setSettlingOrderId(settlementOrder.order.id);
      await onSettleCredit(settlementOrder.order, { metodo: method });
      setSettlementOrder(null);
    } catch (error) {
      console.error('Error registrando el pago del crédito del empleado:', error);
      setSettlementError('No se pudo registrar el pago. Inténtalo nuevamente.');
    } finally {
      setSettlingOrderId(null);
    }
  };
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold" style={{ color: COLORS.dark }}>
          Crédito empleados
        </h2>
        <p className="text-sm text-gray-600">
          Consulta los créditos asignados a colaboradores, revisa el historial de movimientos y liquida los pendientes directamente desde la plataforma.
        </p>
        {historyError && (
          <div className="mt-2 px-3 py-2 rounded-md bg-red-50 border border-red-200 text-sm text-red-600">
            {historyError}
          </div>
        )}
      </header>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="ui-card ui-card-pad space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <CalendarRange size={18} />
            <span>Rango de fechas</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label className="flex flex-col text-xs font-medium text-gray-600 gap-1">
              Desde
              <input
                type="date"
                value={startDate}
                max={endDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-gray-600 gap-1">
              Hasta
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
              />
            </label>
          </div>
          <label className="flex flex-col text-xs font-medium text-gray-600 gap-1">
            Fecha exacta (opcional)
            <input
              type="date"
              value={specificDate}
              max={today}
              onChange={(event) => setSpecificDate(event.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
            />
          </label>
          {specificDate && (
            <p className="text-[11px] text-gray-500">
              Al seleccionar una fecha exacta se ignora el rango indicado arriba.
            </p>
          )}
        </div>

        <div className="ui-card ui-card-pad space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <Users size={18} />
            <span>Filtrar resultados</span>
          </div>
          <div className="space-y-2">
            <select
              value={selectedEmployee}
              onChange={(event) => setSelectedEmployee(event.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
            >
              <option value="todos">Todos los empleados</option>
              {availableEmployees.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'todos' | 'cargo' | 'abono')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
            >
              <option value="todos">Todos los movimientos</option>
              <option value="cargo">Solo cargos (créditos otorgados)</option>
              <option value="abono">Solo abonos (pagos)</option>
            </select>
          </div>
        </div>

        <div className="ui-card ui-card-pad space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <ClipboardList size={18} />
            <span>Resumen del período</span>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              Total pendiente (global):{' '}
              <span className="font-semibold" style={{ color: COLORS.dark }}>
                {formatCOP(outstandingTotal)}
              </span>
            </p>
            <p>
              Créditos pendientes filtrados:{' '}
              <span className="font-semibold" style={{ color: COLORS.accent }}>
                {formatCOP(filteredPendingTotal)}
              </span>
            </p>
            <p>
              Cargos filtrados:{' '}
              <span className="font-semibold text-rose-600">
                {formatCOP(totalCargos)}
              </span>
            </p>
            <p>
              Abonos filtrados:{' '}
              <span className="font-semibold text-green-600">
                {formatCOP(totalAbonos)}
              </span>
            </p>
            <p>
              Neto del período:{' '}
              <span
                className="font-semibold"
                style={{ color: netoFiltrado >= 0 ? COLORS.dark : '#047857' }}
              >
                {formatCOP(netoFiltrado)}
              </span>
            </p>
            <p>
              Movimientos filtrados:{' '}
              <span className="font-semibold" style={{ color: COLORS.dark }}>
                {filteredHistoryEntries.length}
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 ui-card">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
              Créditos pendientes por pedido
            </h3>
            <p className="text-xs text-gray-500">
              Pedidos asignados como crédito de empleados dentro del filtro seleccionado.
            </p>
          </div>
          <div className="ui-card-pad ui-table-wrapper">
            <table className="ui-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha asignación
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empleado
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Pedido
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Estado actual
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor pendiente
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredCreditOrders.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 lg:px-6 py-8 text-center text-xs lg:text-sm text-gray-500"
                    >
                      No hay créditos de empleados para el filtro seleccionado.
                    </td>
                  </tr>
                )}
                {filteredCreditOrders.map((entry) => {
                  const { order, assignedAt, amount, employeeLabel } = entry;
                  const paymentSummary = order.creditInfo
                    ? 'Crédito empleados pendiente'
                    : formatPaymentSummary(getOrderAllocations(order), formatCOP);
                  const isSettling = settlingOrderId === order.id;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-3 lg:px-6 py-3 text-xs text-gray-600">
                        {formatAssignedAt(assignedAt)}
                      </td>
                      <td className="px-3 lg:px-6 py-3 text-xs text-gray-600">
                        {employeeLabel}
                      </td>
                      <td className="px-3 lg:px-6 py-3 text-xs text-gray-600 hidden md:table-cell">
                        {order.numero ? `#${order.numero}` : order.id}
                      </td>
                      <td className="px-3 lg:px-6 py-3 text-xs text-gray-500 hidden lg:table-cell">
                        {paymentSummary}
                      </td>
                      <td className="px-3 lg:px-6 py-3 text-xs font-semibold" style={{ color: COLORS.accent }}>
                        {formatCOP(amount)}
                      </td>
                      <td className="px-3 lg:px-6 py-3 text-xs">
                        <button
                          type="button"
                          onClick={() => handleOpenSettlement(entry)}
                          disabled={isSettling}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {isSettling ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <CheckCircle size={14} />
                          )}
                          {isSettling ? 'Procesando...' : 'Registrar pago'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ui-card">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
              Saldo por empleado
            </h3>
            <p className="text-xs text-gray-500">
              Total de créditos pendientes acumulados por colaborador.
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {totalsByEmployee.length === 0 && (
              <p className="px-4 py-6 text-xs lg:text-sm text-gray-500 text-center">
                No hay créditos pendientes registrados.
              </p>
            )}
            {totalsByEmployee.map(({ key, label, total }) => (
              <div key={key} className="px-4 py-3 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-600">{label}</span>
                <span className="font-semibold" style={{ color: COLORS.dark }}>
                  {formatCOP(total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="ui-card">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
              Historial de movimientos
            </h3>
            <p className="text-xs text-gray-500">
              Registros de cargos (créditos asignados) y abonos (pagos) según los filtros seleccionados.
            </p>
          </div>
          <History size={18} className="text-gray-400" />
        </div>
        <div className="ui-card-pad ui-table-wrapper">
          <table className="ui-table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empleado
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Movimiento
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Pedido relacionado
                </th>
                <th className="px-3 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-3 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Saldo acumulado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {historyLoading && (
                <tr>
                  <td colSpan={6} className="px-3 lg:px-6 py-8 text-center text-xs lg:text-sm text-gray-500">
                    Cargando historial de movimientos...
                  </td>
                </tr>
              )}
              {!historyLoading && filteredHistoryEntries.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 lg:px-6 py-8 text-center text-xs lg:text-sm text-gray-500">
                    No hay movimientos registrados para los filtros seleccionados.
                  </td>
                </tr>
              )}
              {!historyLoading &&
                filteredHistoryEntries.map((entry) => {
                  const badgeClasses =
                    entry.tipo === 'cargo'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-emerald-100 text-emerald-700';

                  return (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-3 lg:px-6 py-3 text-xs text-gray-600">
                        {formatHistoryTimestamp(entry.timestamp)}
                      </td>
                      <td className="px-3 lg:px-6 py-3 text-xs text-gray-600">
                        {entry.empleadoNombre ?? buildEmployeeLabel(entry.empleadoId)}
                      </td>
                      <td className="px-3 lg:px-6 py-3 text-xs">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold ${badgeClasses}`}>
                          {entry.tipo === 'cargo' ? 'Cargo' : 'Abono'}
                        </span>
                      </td>
                      <td className="px-3 lg:px-6 py-3 text-xs text-gray-600 hidden md:table-cell">
                        {typeof entry.orderNumero === 'number'
                          ? `#${entry.orderNumero}`
                          : entry.orderId
                            ? entry.orderId.slice(0, 8)
                            : '—'}
                      </td>
                      <td className="px-3 lg:px-6 py-3 text-xs text-right font-semibold" style={{ color: entry.tipo === 'cargo' ? COLORS.accent : '#047857' }}>
                        {formatCOP(entry.monto)}
                      </td>
                      <td className="px-3 lg:px-6 py-3 text-xs text-right text-gray-600 hidden lg:table-cell">
                        {typeof entry.balanceAfter === 'number' ? formatCOP(entry.balanceAfter) : '—'}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>

      {settlementOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="ui-card ui-card-pad w-full max-w-lg shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
                  Registrar pago del crédito
                </h3>
                <p className="text-xs text-gray-500">
                  Selecciona el método con el que el colaborador liquida el crédito pendiente.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseSettlement}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>
                Pedido:{' '}
                <span className="font-semibold" style={{ color: COLORS.dark }}>
                  {settlementOrder.order.numero ? `#${settlementOrder.order.numero}` : settlementOrder.order.id}
                </span>
              </p>
              <p>
                Empleado:{' '}
                <span className="font-semibold" style={{ color: COLORS.dark }}>
                  {settlementOrder.employeeLabel}
                </span>
              </p>
              <p>
                Monto pendiente:{' '}
                <span className="font-semibold text-green-600">
                  {formatCOP(settlementOrder.amount)}
                </span>
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-gray-600">Método de pago recibido</p>
              <div className="space-y-2">
                {SETTLEMENT_METHODS.map((option) => {
                  const isSelected = settlementMethod === option.value;
                  return (
                    <label
                      key={option.value}
                      className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer transition-colors ${
                        isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-200'
                      }`}
                    >
                      <input
                        type="radio"
                        className="mt-1"
                        checked={isSelected}
                        onChange={() => setSettlementMethod(option.value)}
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{option.label}</p>
                        <p className="text-xs text-gray-500">{option.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {settlementError && (
              <p className="mt-3 text-sm text-red-600">
                {settlementError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseSettlement}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmSettlement}
                disabled={settlingOrderId === settlementOrder.order.id}
                className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {settlingOrderId === settlementOrder.order.id ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Procesando
                  </span>
                ) : (
                  'Registrar pago'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
