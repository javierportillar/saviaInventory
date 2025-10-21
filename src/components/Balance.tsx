import React, { useEffect, useMemo, useState } from 'react';
import { Gasto, Order, PaymentMethod, ProvisionTransfer } from '../types';
import dataService from '../lib/dataService';
import { COLORS } from '../data/menu';
import { formatCOP } from '../utils/format';
import { Wallet, TrendingUp, TrendingDown, CalendarDays, PiggyBank } from 'lucide-react';
import { formatPaymentSummary, getOrderAllocations, getOrderPaymentDate, isOrderPaid, PAYMENT_METHOD_LABELS } from '../utils/payments';

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
  provision_caja: 'Provisión caja',
  credito_empleados: 'Crédito empleados',
};

const methodOrder: PaymentMethod[] = ['efectivo', 'provision_caja', 'nequi', 'tarjeta', 'credito_empleados'];

const valueColor = (value: number) => (value >= 0 ? 'text-green-600' : 'text-red-600');

const normalizeDate = (value: Date) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const formatPocketName = (codigo?: string | null) => {
  if (!codigo) {
    return '—';
  }
  if (codigo === 'caja_principal') {
    return 'Caja principal';
  }
  if (codigo === 'provision_caja') {
    return 'Provisión de caja';
  }
  return codigo.replace(/_/g, ' ');
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
  provision_caja: { ingresos: 0, egresos: 0 },
  credito_empleados: { ingresos: 0, egresos: 0 },
});

const computeMethodTotals = (orders: Order[], gastos: Gasto[], transfers: ProvisionTransfer[]): MethodTotalsDetail => {
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

  transfers.forEach((transfer) => {
    if (transfer.bolsilloDestino === 'provision_caja') {
      totals.provision_caja.ingresos += transfer.monto;
      totals[transfer.origen].egresos += transfer.monto;
      return;
    }

    if (transfer.bolsilloOrigen === 'provision_caja') {
      totals.provision_caja.egresos += transfer.monto;
      if (transfer.destinoMetodo) {
        totals[transfer.destinoMetodo].ingresos += transfer.monto;
      }
      return;
    }

    totals[transfer.origen].egresos += transfer.monto;
    if (transfer.destinoMetodo) {
      totals[transfer.destinoMetodo].ingresos += transfer.monto;
    }
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
  const [transfers, setTransfers] = useState<ProvisionTransfer[]>([]);
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
        const [ordersData, gastosData, transfersData] = await Promise.all([
          dataService.fetchOrders(),
          dataService.fetchGastos(),
          dataService.fetchProvisionTransfers(),
        ]);

        if (!isMounted) {
          return;
        }

        setOrders(ordersData);
        setGastos(gastosData);
        setTransfers(transfersData);
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
    () => filterAndSortByDateRange(orders, startDate, endDate, (order) => getOrderPaymentDate(order)),
    [orders, startDate, endDate],
  );
  const filteredGastos = useMemo(
    () => filterAndSortByDateRange(gastos, startDate, endDate, (gasto) => gasto.fecha),
    [gastos, startDate, endDate],
  );
  const filteredTransfers = useMemo(
    () => filterAndSortByDateRange(transfers, startDate, endDate, (transfer) => transfer.fecha),
    [transfers, startDate, endDate],
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
    () => computeMethodTotals(filteredOrders, filteredGastos, filteredTransfers),
    [filteredGastos, filteredOrders, filteredTransfers],
  );
  const overallMethodTotals = useMemo(
    () => computeMethodTotals(orders, gastos, transfers),
    [gastos, orders, transfers],
  );

  const totalProvisionDepositsRange = useMemo(
    () => filteredTransfers
      .filter((transfer) => transfer.bolsilloDestino === 'provision_caja')
      .reduce((sum, transfer) => sum + transfer.monto, 0),
    [filteredTransfers],
  );

  const totalProvisionDepositsOverall = useMemo(
    () => transfers
      .filter((transfer) => transfer.bolsilloDestino === 'provision_caja')
      .reduce((sum, transfer) => sum + transfer.monto, 0),
    [transfers],
  );

  const totalProvisionWithdrawalsRange = useMemo(
    () => filteredTransfers
      .filter((transfer) => transfer.bolsilloOrigen === 'provision_caja')
      .reduce((sum, transfer) => sum + transfer.monto, 0),
    [filteredTransfers],
  );

  const totalProvisionWithdrawalsOverall = useMemo(
    () => transfers
      .filter((transfer) => transfer.bolsilloOrigen === 'provision_caja')
      .reduce((sum, transfer) => sum + transfer.monto, 0),
    [transfers],
  );

  const provisionBalanceRange = totalProvisionDepositsRange - totalProvisionWithdrawalsRange;
  const provisionBalanceOverall = totalProvisionDepositsOverall - totalProvisionWithdrawalsOverall;
  const provisionBalanceRangeClass = valueColor(provisionBalanceRange);
  const provisionBalanceOverallClass = valueColor(provisionBalanceOverall);

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
    <section className="space-y-4 sm:space-y-6">
      <div className="ui-card ui-card-pad flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
        <div className="ui-card ui-card-pad text-center text-gray-500 text-sm">
          Cargando balance...
        </div>
      )}

      {!loading && !hasAnyData && (
        <div className="ui-card ui-card-pad text-center text-gray-500 text-sm">
          Aún no hay movimientos registrados en la caja.
        </div>
      )}

      {!loading && hasAnyData && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <div className="ui-card p-3 sm:p-4 lg:p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Ventas</p>
                <TrendingUp className="text-green-600" size={20} />
              </div>
              <p className="text-sm sm:text-lg lg:text-2xl font-bold" style={{ color: COLORS.dark }}>
                {formatCOP(totals.ventas)}
              </p>
            </div>
            <div className="ui-card p-3 sm:p-4 lg:p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Gastos</p>
                <TrendingDown className="text-red-600" size={20} />
              </div>
              <p className="text-sm sm:text-lg lg:text-2xl font-bold text-red-600">
                {formatCOP(totals.gastos)}
              </p>
            </div>
            <div className="ui-card p-3 sm:p-4 lg:p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Balance</p>
                <Wallet className={valueColor(totals.balance)} size={20} />
              </div>
              <p className={`text-sm sm:text-lg lg:text-2xl font-bold ${valueColor(totals.balance)}`}>
                {formatCOP(totals.balance)}
              </p>
            </div>
            <div className="ui-card p-3 sm:p-4 lg:p-5 col-span-2 lg:col-span-1">
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
                <div key={method.id} className="ui-card p-4 lg:p-5">
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

          <div className="ui-card ui-card-pad space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <PiggyBank size={18} style={{ color: COLORS.dark }} />
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
                    Movimientos de provisión de caja
                  </h3>
                  <p className="text-xs text-gray-500">
                    Depósitos desde caja y gastos realizados usando la provisión en el período filtrado.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase text-gray-500 font-medium">Saldo histórico</p>
                <p className={`text-sm font-semibold ${provisionBalanceOverallClass}`}>
                  {formatCOP(provisionBalanceOverall)}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="bg-gray-50 rounded-lg px-3 py-3">
                <p className="text-[11px] uppercase text-gray-500 font-medium">Depósitos en el período</p>
                <p className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                  {formatCOP(totalProvisionDepositsRange)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-3">
                <p className="text-[11px] uppercase text-gray-500 font-medium">Retiros en el período</p>
                <p className="text-sm font-semibold text-red-600">
                  {formatCOP(totalProvisionWithdrawalsRange)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-3">
                <p className="text-[11px] uppercase text-gray-500 font-medium">Saldo del período</p>
                <p className={`text-sm font-semibold ${provisionBalanceRangeClass}`}>
                  {formatCOP(provisionBalanceRange)}
                </p>
              </div>
            </div>

            <div className="ui-table-wrapper">
              <table className="ui-table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Desde
                    </th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Hacia
                    </th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransfers.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 lg:px-6 py-6 text-center text-xs lg:text-sm text-gray-500"
                      >
                        No hay movimientos de provisión en el rango seleccionado.
                      </td>
                    </tr>
                  )}
                  {filteredTransfers.map((transfer) => (
                    <tr key={transfer.id} className="hover:bg-gray-50">
                      <td className="px-3 lg:px-6 py-3 whitespace-nowrap text-xs text-gray-900">
                        {dateFormatter.format(transfer.fecha)}
                      </td>
                      <td className="px-3 lg:px-6 py-3 text-xs text-gray-600">
                        {transfer.descripcion ?? '—'}
                      </td>
                      <td className="px-3 lg:px-6 py-3 text-xs text-gray-600 hidden sm:table-cell">
                        <div className="flex flex-col">
                          <span className="font-medium" style={{ color: COLORS.dark }}>
                            {formatPocketName(transfer.bolsilloOrigen)}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {PAYMENT_METHOD_LABELS[transfer.origen] ?? transfer.origen}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 lg:px-6 py-3 text-xs text-gray-600 hidden sm:table-cell">
                        <div className="flex flex-col">
                          <span className="font-medium" style={{ color: COLORS.dark }}>
                            {formatPocketName(transfer.bolsilloDestino)}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {transfer.destinoMetodo ? (PAYMENT_METHOD_LABELS[transfer.destinoMetodo] ?? transfer.destinoMetodo) : '—'}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 lg:px-6 py-3 whitespace-nowrap text-xs font-semibold" style={{ color: transfer.bolsilloDestino === 'provision_caja' ? '#15803d' : '#dc2626' }}>
                        {transfer.bolsilloDestino === 'provision_caja' ? '+' : '-'}
                        {formatCOP(transfer.monto)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
            <div className="ui-card">
              <div className="px-4 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
                  Ventas por comanda
                </h3>
                <p className="text-xs text-gray-500">
                  Detalle de cada comanda registrada en el período seleccionado.
                </p>
              </div>
              <div className="ui-card-pad ui-table-wrapper">
                <table className="ui-table">
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
                            {formatDateTime(getOrderPaymentDate(order))}
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

            <div className="ui-card">
              <div className="px-4 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
                  Gastos del período
                </h3>
                <p className="text-xs text-gray-500">
                  Desglose de cada gasto registrado en el período seleccionado.
                </p>
              </div>
              <div className="ui-card-pad ui-table-wrapper">
                <table className="ui-table">
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
    </section>
  );
}
