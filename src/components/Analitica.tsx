import React, { useMemo, useState } from 'react';
import { CalendarCheck, CalendarRange, Calculator, ShoppingBag, TrendingUp, Trophy, PieChart } from 'lucide-react';
import { Order } from '../types';
import { COLORS } from '../data/menu';
import { formatCOP, formatDateInputValue, parseDateInputValue } from '../utils/format';

interface AnaliticaProps {
  orders: Order[];
}

type FilterMode = 'range' | 'single';

const PAYMENT_LABELS: Record<string, string> = {
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
  nequi: 'Nequi',
  credito_empleados: 'Crédito empleados',
  sin_registro: 'Sin registro',
};

const formatRangeLabel = (start: Date, end: Date): string => {
  const startLabel = start.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const endLabel = end.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  if (startLabel === endLabel) {
    return start.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    });
  }

  return `${startLabel} – ${endLabel}`;
};

const getNormalizedRange = (startInput: string, endInput: string) => {
  const startDate = parseDateInputValue(startInput);
  const endDate = parseDateInputValue(endInput);

  const startMs = startDate.getTime();
  const endMs = endDate.getTime();

  const minMs = Math.min(startMs, endMs);
  const maxMs = Math.max(startMs, endMs);

  const normalizedStart = new Date(minMs);
  normalizedStart.setHours(0, 0, 0, 0);
  const normalizedEnd = new Date(maxMs);
  normalizedEnd.setHours(23, 59, 59, 999);

  return { start: normalizedStart, end: normalizedEnd };
};

export function Analitica({ orders }: AnaliticaProps) {
  const today = useMemo(() => {
    const now = new Date();
    return formatDateInputValue(now);
  }, []);

  const defaultStart = useMemo(() => {
    const now = new Date();
    now.setDate(now.getDate() - 6);
    return formatDateInputValue(now);
  }, []);

  const [filterMode, setFilterMode] = useState<FilterMode>('range');
  const [startDate, setStartDate] = useState<string>(defaultStart);
  const [endDate, setEndDate] = useState<string>(today);
  const [singleDate, setSingleDate] = useState<string>(today);

  const historicalTotal = useMemo(
    () => orders.reduce((sum, order) => sum + order.total, 0),
    [orders]
  );

  const rangeBoundaries = useMemo(
    () => getNormalizedRange(startDate, endDate),
    [startDate, endDate]
  );
  const rangeStart = rangeBoundaries.start;
  const rangeEnd = rangeBoundaries.end;

  const filteredOrders = useMemo(() => {
    if (orders.length === 0) {
      return [] as Order[];
    }

    if (filterMode === 'single') {
      const dateKey = singleDate;
      return orders.filter(order => formatDateInputValue(order.timestamp) === dateKey);
    }

    return orders.filter(order => {
      const timestamp = order.timestamp.getTime();
      return timestamp >= rangeStart.getTime() && timestamp <= rangeEnd.getTime();
    });
  }, [orders, filterMode, rangeStart, rangeEnd, singleDate]);

  const sortedOrders = useMemo(
    () => [...filteredOrders].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    [filteredOrders]
  );

  const totalSales = useMemo(
    () => filteredOrders.reduce((sum, order) => sum + order.total, 0),
    [filteredOrders]
  );

  const orderCount = filteredOrders.length;
  const averageTicket = orderCount > 0 ? totalSales / orderCount : 0;
  const highestSale = filteredOrders.reduce(
    (max, order) => (order.total > max ? order.total : max),
    0
  );

  const hourlyBreakdown = useMemo(() => {
    const summary = new Map<number, { orders: number; total: number }>();

    filteredOrders.forEach(order => {
      const hour = order.timestamp.getHours();
      const current = summary.get(hour) ?? { orders: 0, total: 0 };
      current.orders += 1;
      current.total += order.total;
      summary.set(hour, current);
    });

    const dataset = Array.from({ length: 24 }, (_, hour) => {
      const label = `${hour.toString().padStart(2, '0')}:00`;
      const entry = summary.get(hour);
      return {
        hour,
        label,
        orders: entry?.orders ?? 0,
        total: entry?.total ?? 0,
      };
    });

    const busiest = dataset
      .filter(entry => entry.orders > 0)
      .sort((a, b) => {
        if (b.orders === a.orders) {
          return b.total - a.total;
        }
        return b.orders - a.orders;
      })
      .slice(0, 3);

    const maxOrders = dataset.reduce((max, entry) => (entry.orders > max ? entry.orders : max), 0);
    const maxTotal = dataset.reduce((max, entry) => (entry.total > max ? entry.total : max), 0);

    return { dataset, busiest, maxOrders, maxTotal };
  }, [filteredOrders]);

  const paymentBreakdown = useMemo(() => {
    const summary: Record<string, number> = {};

    filteredOrders.forEach(order => {
      const allocations = (order.paymentAllocations && order.paymentAllocations.length > 0)
        ? order.paymentAllocations
        : order.metodoPago
          ? [{ metodo: order.metodoPago, monto: Math.round(order.total) }]
          : [];

      if (allocations.length === 0) {
        summary.sin_registro = (summary.sin_registro ?? 0) + order.total;
        return;
      }

      allocations.forEach(({ metodo, monto }) => {
        summary[metodo] = (summary[metodo] ?? 0) + monto;
      });
    });

    return Object.entries(summary)
      .map(([method, amount]) => ({
        method,
        label: PAYMENT_LABELS[method] ?? method,
        amount,
        percentage: totalSales > 0 ? (amount / totalSales) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredOrders, totalSales]);

  const dailySummary = useMemo(() => {
    const summaryMap = new Map<string, { total: number; orders: number }>();

    filteredOrders.forEach(order => {
      const dateKey = formatDateInputValue(order.timestamp);
      const entry = summaryMap.get(dateKey) ?? { total: 0, orders: 0 };
      entry.total += order.total;
      entry.orders += 1;
      summaryMap.set(dateKey, entry);
    });

    return Array.from(summaryMap.entries())
      .map(([dateKey, { total, orders }]) => {
        const displayDate = parseDateInputValue(dateKey).toLocaleDateString('es-CO', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
        return { dateKey, displayDate, total, orders };
      })
      .sort((a, b) => (a.dateKey < b.dateKey ? 1 : -1));
  }, [filteredOrders]);

  const topItems = useMemo(() => {
    const totals = new Map<string, { name: string; quantity: number; amount: number }>();

    filteredOrders.forEach(order => {
      order.items.forEach(({ item, cantidad, precioUnitario }) => {
        const key = item.id || item.nombre;
        const unitPrice = typeof precioUnitario === 'number' ? precioUnitario : item.precio;
        const itemTotal = cantidad * unitPrice;

        const entry = totals.get(key) ?? { name: item.nombre, quantity: 0, amount: 0 };
        entry.name = item.nombre;
        entry.quantity += cantidad;
        entry.amount += itemTotal;
        totals.set(key, entry);
      });
    });

    return Array.from(totals.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [filteredOrders]);

  const periodDescription = useMemo(() => {
    if (filterMode === 'single') {
      return parseDateInputValue(singleDate).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        weekday: 'long',
      });
    }

    return formatRangeLabel(rangeStart, rangeEnd);
  }, [filterMode, singleDate, rangeStart, rangeEnd]);

  const handlePresetRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));

    setFilterMode('range');
    setStartDate(formatDateInputValue(start));
    setEndDate(formatDateInputValue(end));
  };

  const handleCurrentMonth = () => {
    const end = new Date();
    const start = new Date(end.getFullYear(), end.getMonth(), 1);
    setFilterMode('range');
    setStartDate(formatDateInputValue(start));
    setEndDate(formatDateInputValue(end));
  };

  const handleToday = () => {
    const todayValue = formatDateInputValue(new Date());
    setFilterMode('single');
    setSingleDate(todayValue);
  };

  const infoCards = [
    {
      label: 'Ventas en el periodo',
      value: formatCOP(totalSales),
      description: 'Total facturado en el intervalo seleccionado',
      icon: TrendingUp,
    },
    {
      label: 'Pedidos registrados',
      value: orderCount.toString(),
      description: 'Cantidad de pedidos capturados',
      icon: ShoppingBag,
    },
    {
      label: 'Ticket promedio',
      value: orderCount > 0 ? formatCOP(Math.round(averageTicket)) : 'Sin datos',
      description: 'Promedio por pedido',
      icon: Calculator,
    },
    {
      label: 'Venta más alta',
      value: orderCount > 0 ? formatCOP(highestSale) : 'Sin datos',
      description: 'Pedido de mayor valor en el periodo',
      icon: Trophy,
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-6 space-y-6 lg:space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2
            className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2"
            style={{ color: COLORS.dark }}
          >
            Analítica de Ventas
          </h2>
          <p className="text-sm text-gray-600">
            Analiza el desempeño histórico y descubre tendencias por rangos personalizados o fechas específicas.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm text-right">
          <p className="text-xs uppercase tracking-wide text-gray-500">Total histórico registrado</p>
          <p className="text-lg font-semibold mt-1" style={{ color: COLORS.dark }}>
            {formatCOP(historicalTotal)}
          </p>
        </div>
      </div>

      <section className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="inline-flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setFilterMode('range')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filterMode === 'range'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarRange size={18} />
              Rango de fechas
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('single')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filterMode === 'single'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarCheck size={18} />
              Fecha exacta
            </button>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-700">Periodo analizado:</span>{' '}
            {periodDescription}
          </div>
        </div>

        {filterMode === 'range' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <label className="flex flex-col text-sm text-gray-700">
                <span className="mb-2 font-medium">Fecha inicial</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              <label className="flex flex-col text-sm text-gray-700">
                <span className="mb-2 font-medium">Fecha final</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              <div className="sm:col-span-2 flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-wide text-gray-500">Atajos rápidos:</span>
                <button
                  type="button"
                  onClick={() => handlePresetRange(7)}
                  className="px-3 py-2 text-xs font-medium rounded-md border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300"
                >
                  Últimos 7 días
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetRange(30)}
                  className="px-3 py-2 text-xs font-medium rounded-md border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300"
                >
                  Últimos 30 días
                </button>
                <button
                  type="button"
                  onClick={handleCurrentMonth}
                  className="px-3 py-2 text-xs font-medium rounded-md border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300"
                >
                  Este mes
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <label className="flex flex-col text-sm text-gray-700 w-full sm:w-auto">
              <span className="mb-2 font-medium">Selecciona la fecha</span>
              <input
                type="date"
                value={singleDate}
                onChange={(event) => setSingleDate(event.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
            <button
              type="button"
              onClick={handleToday}
              className="px-4 py-2 text-sm font-medium rounded-md border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 self-start"
            >
              Ir a hoy
            </button>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {infoCards.map(({ label, value, description, icon: Icon }) => (
          <div
            key={label}
            className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${COLORS.accent}15` }}>
                <Icon size={18} style={{ color: COLORS.dark }} />
              </div>
            </div>
            <div className="text-xl font-semibold" style={{ color: COLORS.dark }}>
              {value}
            </div>
            <p className="text-xs text-gray-500 mt-2">{description}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.dark }}>
            Desempeño diario
          </h3>
          {dailySummary.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Fecha</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">Pedidos</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">Ventas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dailySummary.map((entry) => (
                    <tr key={entry.dateKey} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-700">{entry.displayDate}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{entry.orders}</td>
                      <td className="px-4 py-3 text-right font-semibold" style={{ color: COLORS.dark }}>
                        {formatCOP(entry.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hay datos en el periodo seleccionado.</p>
          )}
        </section>

        <section className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: COLORS.dark }}>
            <PieChart size={18} /> Distribución por método de pago
          </h3>
          {paymentBreakdown.length > 0 ? (
            <div className="space-y-4">
              {paymentBreakdown.map((entry) => (
                <div key={entry.method}>
                  <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                    <span>{entry.label}</span>
                    <span>{formatCOP(entry.amount)}</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${entry.percentage}%`,
                        backgroundColor: COLORS.accent,
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{entry.percentage.toFixed(1)}% del periodo</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hay información de métodos de pago para este periodo.</p>
          )}
        </section>
      </div>

      <section className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.dark }}>
          Comportamiento por hora
        </h3>
        {hourlyBreakdown.dataset.some(entry => entry.orders > 0) ? (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Horas con mayor actividad</h4>
              {hourlyBreakdown.busiest.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {hourlyBreakdown.busiest.map((entry) => (
                    <li key={entry.hour} className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">{entry.label}</span>
                      <div className="text-right text-xs text-gray-500">
                        <div className="font-semibold text-gray-700">{entry.orders} pedidos</div>
                        <div>Ventas {formatCOP(entry.total)}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No hay suficientes datos para identificar las horas pico.</p>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs uppercase tracking-wide text-gray-500 mb-3">
                  <span>Pedidos por hora</span>
                  <span>Total: {orderCount}</span>
                </div>
                <div className="space-y-2">
                  {hourlyBreakdown.dataset.map((entry) => (
                    <div key={`orders-${entry.hour}`} className="flex items-center gap-3">
                      <span className="w-12 text-xs text-gray-500">{entry.label}</span>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width:
                              hourlyBreakdown.maxOrders > 0
                                ? `${(entry.orders / hourlyBreakdown.maxOrders) * 100}%`
                                : '0%',
                            backgroundColor: COLORS.accent,
                          }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs font-medium text-gray-600">{entry.orders}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs uppercase tracking-wide text-gray-500 mb-3">
                  <span>Ventas por hora</span>
                  <span>Total: {formatCOP(totalSales)}</span>
                </div>
                <div className="space-y-2">
                  {hourlyBreakdown.dataset.map((entry) => (
                    <div key={`sales-${entry.hour}`} className="flex items-center gap-3">
                      <span className="w-12 text-xs text-gray-500">{entry.label}</span>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width:
                              hourlyBreakdown.maxTotal > 0
                                ? `${(entry.total / hourlyBreakdown.maxTotal) * 100}%`
                                : '0%',
                            backgroundColor: COLORS.dark,
                          }}
                        />
                      </div>
                      <span className="w-24 text-right text-xs font-medium text-gray-600">
                        {entry.total > 0 ? formatCOP(entry.total) : '-'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No se registran pedidos en el periodo seleccionado.</p>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.dark }}>
            Productos más vendidos
          </h3>
          {topItems.length > 0 ? (
            <ul className="space-y-3 text-sm">
              {topItems.map((item) => (
                <li key={item.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.quantity} unidades</p>
                  </div>
                  <span className="font-semibold" style={{ color: COLORS.dark }}>
                    {formatCOP(item.amount)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No hay ventas registradas para calcular este ranking.</p>
          )}
        </section>

        <section className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.dark }}>
            Pedidos del periodo
          </h3>
          {sortedOrders.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {sortedOrders.map((order) => (
                <div key={order.id} className="border border-gray-100 rounded-lg p-3 text-sm hover:border-gray-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">Pedido #{order.numero}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
                      {order.estado}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>{order.timestamp.toLocaleDateString('es-CO', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}</span>
                    <span>{order.metodoPago ? PAYMENT_LABELS[order.metodoPago] ?? order.metodoPago : 'Sin método'}</span>
                  </div>
                  <div className="text-right font-semibold mt-2" style={{ color: COLORS.dark }}>
                    {formatCOP(order.total)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hay pedidos en el periodo seleccionado.</p>
          )}
        </section>
      </div>
    </div>
  );
}
