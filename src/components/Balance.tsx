import React, { useEffect, useMemo, useState } from 'react';
import { Gasto, Order, PaymentMethod } from '../types';
import dataService from '../lib/dataService';
import { COLORS } from '../data/menu';
import { formatCOP } from '../utils/format';
import { Wallet, TrendingUp, TrendingDown, CalendarDays, PiggyBank } from 'lucide-react';
import { formatPaymentSummary, getOrderAllocations, isOrderPaid } from '../utils/payments';

type MethodSummary = {
  id: PaymentMethod;
  label: string;
  ventas: number;
  gastos: number;
  balance: number;
  balanceHistorico: number;
};

const methodLabels: Record<PaymentMethod, string> = {
  efectivo: 'Efectivo',
  nequi: 'Nequi',
  tarjeta: 'Tarjeta',
  credito_empleados: 'Crédito empleados',
};

const methodOrder: PaymentMethod[] = ['efectivo', 'nequi', 'tarjeta', 'credito_empleados'];

const valueColor = (value: number) => (value >= 0 ? 'text-green-600' : 'text-red-600');

const normalizeDate = (value: Date) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const formatDateTime = (value: Date) => {
  const date = new Date(value);
  return date.toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

type MethodTotalsDetail = Record<PaymentMethod, { ingresos: number; egresos: number }>;

const emptyMethodTotals = (): MethodTotalsDetail => ({
  efectivo: { ingresos: 0, egresos: 0 },
  nequi: { ingresos: 0, egresos: 0 },
  tarjeta: { ingresos: 0, egresos: 0 },
  credito_empleados: { ingresos: 0, egresos: 0 },
});

const computeMethodTotals = (orders: Order[], gastos: Gasto[]): MethodTotalsDetail => {
  const totals = emptyMethodTotals();

  orders.forEach((order) => {
    if (!isOrderPaid(order)) {
      return;
    }

    const allocations = getOrderAllocations(order);
    allocations.forEach(({ metodo, monto }) => {
      totals[metodo].ingresos += monto;
    });
  });

  gastos.forEach((gasto) => {
    const method = gasto.metodoPago ?? 'efectivo';
    totals[method].egresos += gasto.monto;
  });

  return totals;
};

const endOfDay = (value: Date) => {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
};

const formatDateInput = (value: Date) => {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, '0');
  const day = `${value.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const parseDateInput = (value?: string) => {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
};

const filterAndSortByDateRange = <T,>(
  items: T[],
  startDate: string,
  endDate: string,
  getDate: (item: T) => Date,
) => {
  const sorted = [...items].sort((a, b) => getDate(b).getTime() - getDate(a).getTime());

  const parsedStart = parseDateInput(startDate);
  const parsedEnd = parseDateInput(endDate);

  if (!parsedStart && !parsedEnd) {
    return sorted;
  }

  const startBoundary = parsedStart ? normalizeDate(parsedStart).getTime() : null;
  const endBoundary = parsedEnd ? endOfDay(parsedEnd).getTime() : null;

  return sorted.filter((item) => {
    const itemTime = getDate(item).getTime();

    if (startBoundary !== null && itemTime < startBoundary) {
      return false;
    }

    if (endBoundary !== null && itemTime > endBoundary) {
      return false;
    }

    return true;
  });
};

export function Balance() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);
  const [startDate, setStartDate] = useState(() => formatDateInput(today));
  const [endDate, setEndDate] = useState(() => formatDateInput(today));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const [ordersData, gastosData] = await Promise.all([
          dataService.fetchOrders(),
          dataService.fetchGastos(),
        ]);

        if (!isMounted) {
          return;
        }

        setOrders(ordersData);
        setGastos(gastosData);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredOrders = useMemo(
    () => filterAndSortByDateRange(orders, startDate, endDate, (order) => order.timestamp),
    [orders, startDate, endDate],
  );
  const filteredGastos = useMemo(
    () => filterAndSortByDateRange(gastos, startDate, endDate, (gasto) => gasto.fecha),
    [gastos, startDate, endDate],
  );

  const totals = useMemo(() => {
    const paidOrders = filteredOrders.filter(isOrderPaid);
    const ventas = paidOrders.reduce((acc, order) => acc + order.total, 0);
    const gastosTotal = filteredGastos.reduce((acc, gasto) => acc + gasto.monto, 0);

    return {
      ventas,
      gastos: gastosTotal,
      balance: ventas - gastosTotal,
    };
  }, [filteredOrders, filteredGastos]);

  const overallTotals = useMemo(() => {
    const paidOrders = orders.filter(isOrderPaid);
    const ventas = paidOrders.reduce((acc, order) => acc + order.total, 0);
    const gastosTotal = gastos.reduce((acc, gasto) => acc + gasto.monto, 0);

    return {
      ventas,
      gastos: gastosTotal,
      balance: ventas - gastosTotal,
    };
  }, [orders, gastos]);

  const hasAnyData = orders.length > 0 || gastos.length > 0;
  const hasFilteredData = filteredOrders.length > 0 || filteredGastos.length > 0;

  const lastMovementDate = useMemo(() => {
    const latestOrder = filteredOrders[0]?.timestamp;
    const latestExpense = filteredGastos[0]?.fecha;

    if (latestOrder && latestExpense) {
      return new Date(Math.max(latestOrder.getTime(), latestExpense.getTime()));
    }
    if (latestOrder) {
      return latestOrder;
    }
    if (latestExpense) {
      return latestExpense;
    }
    return null;
  }, [filteredOrders, filteredGastos]);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
      }),
    [],
  );

  const selectedRangeLabel = useMemo(() => {
    const start = parseDateInput(startDate);
    const end = parseDateInput(endDate);

    if (start && end) {
      return `${dateFormatter.format(start)} - ${dateFormatter.format(end)}`;
    }

    if (start) {
      return `Desde ${dateFormatter.format(start)}`;
    }

    if (end) {
      return `Hasta ${dateFormatter.format(end)}`;
    }

    return 'Todo el histórico';
  }, [dateFormatter, startDate, endDate]);

  const periodSummaryLabel = hasFilteredData
    ? `Movimientos en el período (${selectedRangeLabel}): ${filteredOrders.length + filteredGastos.length}`
    : `No hay movimientos en el período seleccionado (${selectedRangeLabel}).`;

  const closingLabel = lastMovementDate
    ? `Último movimiento: ${formatDateTime(lastMovementDate)}`
    : hasAnyData
      ? `No hay movimientos en el rango (${selectedRangeLabel}).`
      : 'Sin registros disponibles.';

  const rangeMethodTotals = useMemo(
    () => computeMethodTotals(filteredOrders, filteredGastos),
    [filteredOrders, filteredGastos],
  );
  const overallMethodTotals = useMemo(
    () => computeMethodTotals(orders, gastos),
    [orders, gastos],
  );

  const methodBreakdown: MethodSummary[] = useMemo(
    () =>
      methodOrder.map((method) => ({
        id: method,
        label: methodLabels[method],
        ventas: rangeMethodTotals[method].ingresos,
        gastos: rangeMethodTotals[method].egresos,
        balance: rangeMethodTotals[method].ingresos - rangeMethodTotals[method].egresos,
        balanceHistorico:
          overallMethodTotals[method].ingresos - overallMethodTotals[method].egresos,
      })),
    [overallMethodTotals, rangeMethodTotals],
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
      <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ color: COLORS.dark }}>
            Balance de Caja
          </h2>
          <p className="text-sm lg:text-base text-gray-600">
            Ventas, gastos y saldo final por método de pago
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-gray-500" size={18} />
            <span className="text-sm text-gray-600">Filtrar por fecha</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <label className="flex flex-col text-xs text-gray-500 uppercase tracking-wide">
              Desde
              <input
                type="date"
                value={startDate}
                max={endDate}
                onChange={(event) => {
                  const value = event.target.value;
                  setStartDate(value);
                  if (value && endDate && value > endDate) {
                    setEndDate(value);
                  }
                }}
                className="mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
              />
            </label>
            <label className="flex flex-col text-xs text-gray-500 uppercase tracking-wide">
              Hasta
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(event) => {
                  const value = event.target.value;
                  setEndDate(value);
                  if (value && startDate && value < startDate) {
                    setStartDate(value);
                  }
                }}
                className="mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
              />
            </label>
            <button
              type="button"
              onClick={() => {
                const todayFormatted = formatDateInput(today);
                setStartDate(todayFormatted);
                setEndDate(todayFormatted);
              }}
              className="px-3 py-2 text-sm font-medium text-white rounded-lg"
              style={{ backgroundColor: COLORS.accent }}
            >
              Hoy
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 text-center text-gray-500 text-sm">
          Cargando balance...
        </div>
      )}

      {!loading && !hasAnyData && (
        <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 text-center text-gray-500 text-sm">
          Aún no hay movimientos registrados en la caja.
        </div>
      )}

      {!loading && hasAnyData && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <div className="bg-white rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Ventas</p>
                <TrendingUp className="text-green-600" size={20} />
              </div>
              <p className="text-sm sm:text-lg lg:text-2xl font-bold" style={{ color: COLORS.dark }}>
                {formatCOP(totals.ventas)}
              </p>
            </div>
            <div className="bg-white rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Gastos</p>
                <TrendingDown className="text-red-600" size={20} />
              </div>
              <p className="text-sm sm:text-lg lg:text-2xl font-bold text-red-600">
                {formatCOP(totals.gastos)}
              </p>
            </div>
            <div className="bg-white rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Balance</p>
                <Wallet className={valueColor(totals.balance)} size={20} />
              </div>
              <p className={`text-sm sm:text-lg lg:text-2xl font-bold ${valueColor(totals.balance)}`}>
                {formatCOP(totals.balance)}
              </p>
            </div>
            <div className="bg-white rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-5 shadow-sm border border-gray-100 col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Histórico</p>
                <PiggyBank className="text-indigo-600" size={20} />
              </div>
              <p className="text-xs text-gray-500 mb-1 hidden sm:block">{periodSummaryLabel}</p>
              <p className="text-xs text-gray-500 mb-1 hidden sm:block">{closingLabel}</p>
              <p className="text-sm sm:text-lg lg:text-2xl font-bold" style={{ color: COLORS.dark }}>
                {formatCOP(overallTotals.balance)}
              </p>
            </div>
          </div>

          {methodBreakdown.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {methodBreakdown.map((method) => (
                <div key={method.id} className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-5 shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-600 mb-1">{method.label}</p>
                  <p className="text-xs text-gray-500">Ventas en el período</p>
                  <p className="text-base lg:text-xl font-semibold" style={{ color: COLORS.dark }}>
                    {formatCOP(method.ventas)}
                  </p>
                  <p className="text-xs text-gray-500 mt-3">Gastos en el período</p>
                  <p className="text-sm lg:text-lg font-semibold text-red-600">
                    {formatCOP(method.gastos)}
                  </p>
                  <p className="text-xs text-gray-500 mt-3">Balance del período</p>
                  <p className={`text-sm lg:text-lg font-semibold ${valueColor(method.balance)}`}>
                    {formatCOP(method.balance)}
                  </p>
                  <p className="text-xs text-gray-500 mt-3">
                    Balance histórico: {formatCOP(method.balanceHistorico)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
            <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
                  Ventas por comanda
                </h3>
                <p className="text-xs text-gray-500">
                  Detalle de cada comanda registrada en el período seleccionado.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Comanda
                      </th>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Cliente
                      </th>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Método de pago
                      </th>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-3 lg:px-6 py-8 text-center text-xs lg:text-sm text-gray-500"
                        >
                          No hay ventas registradas en el rango seleccionado.
                        </td>
                      </tr>
                    )}
                    {filteredOrders.map((order) => {
                      const allocations = getOrderAllocations(order);
                      const paymentSummary = formatPaymentSummary(allocations, formatCOP);
                      const paid = isOrderPaid(order);

                      return (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                            {formatDateTime(order.timestamp)}
                          </td>
                          <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs font-medium" style={{ color: COLORS.dark }}>
                            {order.numero ? `#${order.numero}` : order.id}
                          </td>
                          <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs text-gray-600 hidden sm:table-cell">
                            {order.cliente ?? '—'}
                          </td>
                          <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs text-gray-600 hidden lg:table-cell">
                            <div className="flex flex-col gap-1">
                              <span>{paymentSummary}</span>
                              <span className={`w-max px-2 py-0.5 rounded-full text-[11px] font-medium ${paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>
                                {paid ? 'Pago registrado' : 'Pago pendiente'}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs font-semibold text-green-600">
                            {formatCOP(order.total)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
                  Gastos del período
                </h3>
                <p className="text-xs text-gray-500">
                  Desglose de cada gasto registrado en el período seleccionado.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Categoría
                      </th>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Método de pago
                      </th>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredGastos.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-3 lg:px-6 py-8 text-center text-xs lg:text-sm text-gray-500"
                        >
                          No hay gastos registrados en el rango seleccionado.
                        </td>
                      </tr>
                    )}
                    {filteredGastos.map((gasto) => (
                      <tr key={gasto.id} className="hover:bg-gray-50">
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                          {formatDateTime(gasto.fecha)}
                        </td>
                        <td className="px-3 lg:px-6 py-4 text-xs text-gray-600">
                          {gasto.descripcion || '—'}
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs text-gray-600 hidden sm:table-cell">
                          {gasto.categoria || '—'}
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs text-gray-600 hidden lg:table-cell">
                          {methodLabels[gasto.metodoPago ?? 'efectivo']}
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs font-semibold text-red-600">
                          {formatCOP(gasto.monto)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
