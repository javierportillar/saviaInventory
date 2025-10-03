import React, { useMemo, useState } from 'react';
import { CalendarRange, Users, ClipboardList } from 'lucide-react';
import { Order } from '../types';
import { COLORS } from '../data/menu';
import { formatCOP, formatDateInputValue, parseDateInputValue } from '../utils/format';
import { formatPaymentSummary, getOrderAllocations, isOrderPaid } from '../utils/payments';

interface CreditoClientesProps {
  orders: Order[];
}

interface CreditOrderView {
  order: Order;
  assignedAt: Date;
  amount: number;
  customerLabel: string;
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

export function CreditoClientes({ orders }: CreditoClientesProps) {
  const pendingCreditOrders = useMemo<CreditOrderView[]>(() => {
    return orders
      .filter((order) => order.creditInfo && !isOrderPaid(order))
      .map((order) => {
        const assignedAt = order.creditInfo?.assignedAt ?? order.timestamp;
        const amount = Math.round(order.creditInfo?.amount ?? order.total);
        const customerLabel = order.cliente?.trim() ? order.cliente : 'Sin cliente registrado';
        return {
          order,
          assignedAt,
          amount,
          customerLabel,
        };
      })
      .sort((a, b) => b.assignedAt.getTime() - a.assignedAt.getTime());
  }, [orders]);

  const allOutstandingTotal = useMemo(
    () => pendingCreditOrders.reduce((sum, entry) => sum + entry.amount, 0),
    [pendingCreditOrders]
  );

  const defaultStartDate = useMemo(() => {
    const now = new Date();
    now.setDate(1);
    return formatDateInputValue(now);
  }, []);

  const today = useMemo(() => formatDateInputValue(new Date()), []);

  const [startDate, setStartDate] = useState<string>(defaultStartDate);
  const [endDate, setEndDate] = useState<string>(today);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('todos');

  const availableCustomers = useMemo(() => {
    const labels = new Set<string>();
    pendingCreditOrders.forEach((entry) => labels.add(entry.customerLabel));
    return Array.from(labels).sort((a, b) => a.localeCompare(b, 'es'));
  }, [pendingCreditOrders]);

  const filteredCreditOrders = useMemo(() => {
    if (pendingCreditOrders.length === 0) {
      return [] as CreditOrderView[];
    }

    const normalizedStart = normalizeDateStart(parseDateInputValue(startDate));
    const normalizedEnd = normalizeDateEnd(parseDateInputValue(endDate));
    const startTime = normalizedStart.getTime();
    const endTime = normalizedEnd.getTime();

    return pendingCreditOrders.filter((entry) => {
      const assignedTime = entry.assignedAt.getTime();
      if (assignedTime < startTime || assignedTime > endTime) {
        return false;
      }
      if (selectedCustomer !== 'todos' && entry.customerLabel !== selectedCustomer) {
        return false;
      }
      return true;
    });
  }, [pendingCreditOrders, startDate, endDate, selectedCustomer]);

  const filteredTotal = useMemo(
    () => filteredCreditOrders.reduce((sum, entry) => sum + entry.amount, 0),
    [filteredCreditOrders]
  );

  const totalsByCustomer = useMemo(() => {
    const map = new Map<string, number>();
    pendingCreditOrders.forEach((entry) => {
      const current = map.get(entry.customerLabel) ?? 0;
      map.set(entry.customerLabel, current + entry.amount);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [pendingCreditOrders]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold" style={{ color: COLORS.dark }}>
          Crédito Clientes
        </h2>
        <p className="text-sm text-gray-600">
          Consulta y gestiona los pedidos asignados como crédito de empleados. Estos valores no se reflejan en el balance hasta que se registre su pago.
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
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
        </div>

        <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <Users size={18} />
            <span>Filtrar por cliente</span>
          </div>
          <select
            value={selectedCustomer}
            onChange={(event) => setSelectedCustomer(event.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:border-transparent"
            style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
          >
            <option value="todos">Todos los clientes</option>
            {availableCustomers.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <ClipboardList size={18} />
            <span>Resumen del período</span>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              Total pendiente (todas las fechas):{' '}
              <span className="font-semibold" style={{ color: COLORS.dark }}>
                {formatCOP(allOutstandingTotal)}
              </span>
            </p>
            <p>
              Total filtrado:{' '}
              <span className="font-semibold" style={{ color: COLORS.accent }}>
                {formatCOP(filteredTotal)}
              </span>
            </p>
            <p>
              Pedidos filtrados:{' '}
              <span className="font-semibold" style={{ color: COLORS.dark }}>
                {filteredCreditOrders.length}
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
              Detalle de créditos pendientes
            </h3>
            <p className="text-xs text-gray-500">
              Pedidos marcados como crédito de empleados dentro del rango seleccionado.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha asignación
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredCreditOrders.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 lg:px-6 py-8 text-center text-xs lg:text-sm text-gray-500"
                    >
                      No hay créditos registrados para el filtro seleccionado.
                    </td>
                  </tr>
                )}
                {filteredCreditOrders.map(({ order, assignedAt, amount, customerLabel }) => {
                  const paymentSummary = formatPaymentSummary(getOrderAllocations(order), formatCOP);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-3 lg:px-6 py-3 text-xs text-gray-600">
                        {formatAssignedAt(assignedAt)}
                      </td>
                      <td className="px-3 lg:px-6 py-3 text-xs text-gray-600">
                        {customerLabel}
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
              Total por cliente
            </h3>
            <p className="text-xs text-gray-500">
              Sumatoria de créditos pendientes agrupados por cliente.
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {totalsByCustomer.length === 0 && (
              <p className="px-4 py-6 text-xs lg:text-sm text-gray-500 text-center">
                No hay créditos pendientes registrados.
              </p>
            )}
            {totalsByCustomer.map(([customerLabel, total]) => (
              <div key={customerLabel} className="px-4 py-3 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-600">{customerLabel}</span>
                <span className="font-semibold" style={{ color: COLORS.dark }}>
                  {formatCOP(total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
