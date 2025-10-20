import React, { useEffect, useMemo, useState } from 'react';
import { CalendarCheck, CalendarRange, Calculator, ShoppingBag, TrendingUp, Trophy, PieChart } from 'lucide-react';
import { Gasto, Order } from '../types';
import { COLORS } from '../data/menu';
import { formatCOP, formatDateInputValue, parseDateInputValue } from '../utils/format';
import dataService from '../lib/dataService';

interface AnaliticaProps {
  orders: Order[];
}

type FilterMode = 'range' | 'single';

const PAYMENT_LABELS: Record<string, string> = {
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
  nequi: 'Nequi',
  provision_caja: 'Provisión caja',
  credito_empleados: 'Crédito empleados',
  sin_registro: 'Sin registro',
};

type HourlyChartEntry = {
  hour: number;
  label: string;
  orders: number;
  total: number;
};

type FinancialChartPoint = {
  date: Date;
  label: string;
  sales: number;
  expenses: number;
  balance: number;
  historicalBalance: number;
};

const GRID_COLOR = '#e5e7eb';
const SALES_COLOR = '#16a34a';
const EXPENSES_COLOR = '#ef4444';
const BALANCE_COLOR = '#2563eb';
const HISTORICAL_BALANCE_COLOR = '#000000';

const compactNumberFormatter = new Intl.NumberFormat('es-CO', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
});

const FINANCIAL_ZOOM_OPTIONS = [
  { id: '7', label: 'Semana' },
  { id: '30', label: 'Mes' },
  { id: '90', label: '3 meses' },
  { id: 'all', label: 'Todo' },
] as const;

const HourlyOrdersChart = ({ data, maxOrders }: { data: HourlyChartEntry[]; maxOrders: number }) => {
  if (data.length === 0) {
    return null;
  }

  const width = 720;
  const height = 260;
  const margin = { top: 16, right: 24, bottom: 48, left: 64 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const safeMaxOrders = Math.max(maxOrders, 1);
  const xStep = data.length > 1 ? innerWidth / (data.length - 1) : innerWidth;

  const points = data.map((entry, index) => {
    const x = margin.left + index * xStep;
    const y = margin.top + innerHeight - (entry.orders / safeMaxOrders) * innerHeight;
    return { x, y, entry, index };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`)
    .join(' ');

  const areaPath =
    points
      .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`)
      .join(' ') +
    ` L ${margin.left + innerWidth},${margin.top + innerHeight}` +
    ` L ${margin.left},${margin.top + innerHeight} Z`;

  const yTickCount = 4;
  const yTicks = Array.from({ length: yTickCount + 1 }, (_, index) =>
    Math.round((safeMaxOrders / yTickCount) * index),
  );
  const xTickEvery = Math.max(1, Math.ceil(data.length / 8));
  const xTicks = points.filter(point => point.index % xTickEvery === 0 || point.index === points.length - 1);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64">
      <defs>
        <linearGradient id="hourlyArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.accent} stopOpacity={0.3} />
          <stop offset="100%" stopColor={COLORS.accent} stopOpacity={0.05} />
        </linearGradient>
      </defs>
      <rect
        x={margin.left}
        y={margin.top}
        width={innerWidth}
        height={innerHeight}
        fill="url(#hourlyArea)"
        opacity={0.1}
      />
      {yTicks.map((tick, index) => {
        const y = margin.top + innerHeight - (tick / safeMaxOrders) * innerHeight;
        return (
          <g key={`y-grid-${tick}`}>
            <line x1={margin.left} x2={margin.left + innerWidth} y1={y} y2={y} stroke={GRID_COLOR} strokeDasharray="4 4" />
            <text x={margin.left - 12} y={y + 4} textAnchor="end" className="text-xs fill-gray-500">
              {tick}
            </text>
          </g>
        );
      })}
      {xTicks.map(point => (
        <line
          key={`x-grid-${point.index}`}
          x1={point.x}
          x2={point.x}
          y1={margin.top}
          y2={margin.top + innerHeight}
          stroke={GRID_COLOR}
          strokeDasharray="4 4"
        />
      ))}
      <path d={areaPath} fill="url(#hourlyArea)" />
      <path d={linePath} fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      {points.map(point => (
        <circle
          key={`point-${point.index}`}
          cx={point.x}
          cy={point.y}
          r={4}
          fill="#fff"
          stroke={COLORS.accent}
          strokeWidth={2}
        />
      ))}
      <line
        x1={margin.left}
        x2={margin.left + innerWidth}
        y1={margin.top + innerHeight}
        y2={margin.top + innerHeight}
        stroke="#9ca3af"
        strokeWidth={1.5}
      />
      <line x1={margin.left} x2={margin.left} y1={margin.top} y2={margin.top + innerHeight} stroke="#9ca3af" strokeWidth={1.5} />
      <text
        x={margin.left / 2}
        y={margin.top + innerHeight / 2}
        transform={`rotate(-90 ${margin.left / 2} ${margin.top + innerHeight / 2})`}
        className="text-xs font-medium fill-gray-600"
      >
        Pedidos
      </text>
      <text
        x={margin.left + innerWidth / 2}
        y={height - 12}
        textAnchor="middle"
        className="text-xs font-medium fill-gray-600"
      >
        Hora del día
      </text>
      {xTicks.map(point => (
        <text key={`x-label-${point.index}`} x={point.x} y={margin.top + innerHeight + 20} textAnchor="middle" className="text-xs fill-gray-500">
          {point.entry.label}
        </text>
      ))}
    </svg>
  );
};

const FinancialPerformanceChart = ({ data }: { data: FinancialChartPoint[] }) => {
  if (data.length === 0) {
    return <p className="text-sm text-gray-500">No hay datos suficientes para mostrar la gráfica.</p>;
  }

  const width = 720;
  const height = 320;
  const margin = { top: 24, right: 32, bottom: 56, left: 80 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const values = data.flatMap(point => [point.sales, point.expenses, point.balance, point.historicalBalance]);
  const maxValue = Math.max(...values, 0);
  const minValue = Math.min(...values, 0);
  const range = maxValue - minValue || 1;
  const xStep = data.length > 1 ? innerWidth / (data.length - 1) : innerWidth;

  const buildPoints = (selector: (point: FinancialChartPoint) => number) =>
    data.map((point, index) => {
      const x = margin.left + index * xStep;
      const value = selector(point);
      const y = margin.top + innerHeight - ((value - minValue) / range) * innerHeight;
      return { x, y, value, index, label: point.label };
    });

  const buildPath = (points: { x: number; y: number }[]) =>
    points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`).join(' ');

  const salesPoints = buildPoints(point => point.sales);
  const expensesPoints = buildPoints(point => point.expenses);
  const balancePoints = buildPoints(point => point.balance);
  const historicalBalancePoints = buildPoints(point => point.historicalBalance);

  const yTickCount = 5;
  const yTicks = Array.from({ length: yTickCount }, (_, index) => minValue + (range / (yTickCount - 1)) * index);
  const xTickEvery = Math.max(1, Math.ceil(data.length / 6));
  const xTicks = salesPoints.filter(point => point.index % xTickEvery === 0 || point.index === salesPoints.length - 1);

  const zeroY = margin.top + innerHeight - ((0 - minValue) / range) * innerHeight;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-80">
      {yTicks.map((tick, index) => {
        const y = margin.top + innerHeight - ((tick - minValue) / range) * innerHeight;
        return (
          <g key={`y-financial-${index}`}>
            <line x1={margin.left} x2={margin.left + innerWidth} y1={y} y2={y} stroke={GRID_COLOR} strokeDasharray="4 4" />
            <text x={margin.left - 12} y={y + 4} textAnchor="end" className="text-xs fill-gray-500">
              {compactNumberFormatter.format(Math.round(tick))}
            </text>
          </g>
        );
      })}
      <line x1={margin.left} x2={margin.left + innerWidth} y1={zeroY} y2={zeroY} stroke="#9ca3af" strokeWidth={1.5} />
      {xTicks.map(point => (
        <line
          key={`x-financial-${point.index}`}
          x1={point.x}
          x2={point.x}
          y1={margin.top}
          y2={margin.top + innerHeight}
          stroke={GRID_COLOR}
          strokeDasharray="4 4"
        />
      ))}
      <path d={buildPath(expensesPoints)} fill="none" stroke={EXPENSES_COLOR} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d={buildPath(salesPoints)} fill="none" stroke={SALES_COLOR} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <path d={buildPath(balancePoints)} fill="none" stroke={BALANCE_COLOR} strokeWidth={2.5} strokeDasharray="6 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d={buildPath(historicalBalancePoints)} fill="none" stroke={HISTORICAL_BALANCE_COLOR} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {salesPoints.map(point => (
        <circle key={`sales-${point.index}`} cx={point.x} cy={point.y} r={4} fill="#fff" stroke={SALES_COLOR} strokeWidth={2} />
      ))}
      {expensesPoints.map(point => (
        <circle key={`expenses-${point.index}`} cx={point.x} cy={point.y} r={4} fill="#fff" stroke={EXPENSES_COLOR} strokeWidth={2} />
      ))}
      {balancePoints.map(point => (
        <circle key={`balance-${point.index}`} cx={point.x} cy={point.y} r={4} fill="#fff" stroke={BALANCE_COLOR} strokeWidth={2} />
      ))}
      {historicalBalancePoints.map(point => (
        <circle
          key={`historical-balance-${point.index}`}
          cx={point.x}
          cy={point.y}
          r={4}
          fill="#fff"
          stroke={HISTORICAL_BALANCE_COLOR}
          strokeWidth={2}
        />
      ))}
      <line
        x1={margin.left}
        x2={margin.left + innerWidth}
        y1={margin.top + innerHeight}
        y2={margin.top + innerHeight}
        stroke="#9ca3af"
        strokeWidth={1.5}
      />
      <line x1={margin.left} x2={margin.left} y1={margin.top} y2={margin.top + innerHeight} stroke="#9ca3af" strokeWidth={1.5} />
      <text
        x={margin.left / 2}
        y={margin.top + innerHeight / 2}
        transform={`rotate(-90 ${margin.left / 2} ${margin.top + innerHeight / 2})`}
        className="text-xs font-medium fill-gray-600"
      >
        Valor (COP)
      </text>
      <text
        x={margin.left + innerWidth / 2}
        y={height - 12}
        textAnchor="middle"
        className="text-xs font-medium fill-gray-600"
      >
        Días analizados
      </text>
      {xTicks.map(point => (
        <text key={`label-${point.index}`} x={point.x} y={margin.top + innerHeight + 20} textAnchor="middle" className="text-xs fill-gray-500">
          {point.label}
        </text>
      ))}
    </svg>
  );
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
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [financialZoom, setFinancialZoom] = useState<'7' | '30' | '90' | 'all'>('30');

  useEffect(() => {
    let isMounted = true;

    const loadGastos = async () => {
      try {
        const expenses = await dataService.fetchGastos();
        if (isMounted) {
          setGastos(expenses);
        }
      } catch (error) {
        console.error('[Analitica] Error cargando gastos:', error);
      }
    };

    loadGastos();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const filteredExpenses = useMemo(() => {
    if (gastos.length === 0) {
      return [] as Gasto[];
    }

    if (filterMode === 'single') {
      const dateKey = singleDate;
      return gastos.filter(gasto => formatDateInputValue(gasto.fecha) === dateKey);
    }

    return gastos.filter(gasto => {
      const expenseDate = gasto.fecha instanceof Date ? gasto.fecha : new Date(gasto.fecha);
      const timestamp = expenseDate.getTime();
      return timestamp >= rangeStart.getTime() && timestamp <= rangeEnd.getTime();
    });
  }, [gastos, filterMode, singleDate, rangeStart, rangeEnd]);

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

  const activeHourlyEntries = useMemo(
    () => hourlyBreakdown.dataset.filter(entry => entry.orders > 0 || entry.total > 0),
    [hourlyBreakdown],
  );

  const averageOrdersPerActiveHour = useMemo(
    () => (activeHourlyEntries.length > 0 ? orderCount / activeHourlyEntries.length : 0),
    [activeHourlyEntries, orderCount],
  );

  const topSalesHour = useMemo(() => {
    if (activeHourlyEntries.length === 0) {
      return undefined;
    }

    return activeHourlyEntries.reduce<HourlyChartEntry | undefined>((best, entry) => {
      if (!best || entry.total > best.total) {
        return entry;
      }
      return best;
    }, undefined);
  }, [activeHourlyEntries]);

  const dailyFinancialPerformance = useMemo(() => {
    if (filteredOrders.length === 0 && filteredExpenses.length === 0) {
      return [] as FinancialChartPoint[];
    }

    const summary = new Map<string, { sales: number; expenses: number }>();

    filteredOrders.forEach(order => {
      const dateKey = formatDateInputValue(order.timestamp);
      const entry = summary.get(dateKey) ?? { sales: 0, expenses: 0 };
      entry.sales += order.total;
      summary.set(dateKey, entry);
    });

    filteredExpenses.forEach(gasto => {
      const expenseDate = gasto.fecha instanceof Date ? gasto.fecha : new Date(gasto.fecha);
      const dateKey = formatDateInputValue(expenseDate);
      const entry = summary.get(dateKey) ?? { sales: 0, expenses: 0 };
      entry.expenses += gasto.monto;
      summary.set(dateKey, entry);
    });

    const sortedByDate = Array.from(summary.entries())
      .map(([dateKey, { sales, expenses }]) => {
        const date = parseDateInputValue(dateKey);
        const label = date.toLocaleDateString('es-CO', {
          day: '2-digit',
          month: 'short',
        });

        return {
          date,
          label,
          sales,
          expenses,
          balance: sales - expenses,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    let cumulativeBalance = 0;

    return sortedByDate.map(entry => {
      cumulativeBalance += entry.balance;
      return {
        ...entry,
        historicalBalance: cumulativeBalance,
      } satisfies FinancialChartPoint;
    });
  }, [filteredOrders, filteredExpenses]);

  const zoomedFinancialData = useMemo(() => {
    if (financialZoom === 'all') {
      return dailyFinancialPerformance;
    }

    const days = Number(financialZoom);
    return dailyFinancialPerformance.slice(-days);
  }, [dailyFinancialPerformance, financialZoom]);

  const zoomedFinancialTotals = useMemo(
    () =>
      zoomedFinancialData.reduce(
        (acc, point) => {
          acc.sales += point.sales;
          acc.expenses += point.expenses;
          acc.balance += point.balance;
          return acc;
        },
        { sales: 0, expenses: 0, balance: 0 },
      ),
    [zoomedFinancialData],
  );

  const financialRangeLabel = useMemo(() => {
    if (zoomedFinancialData.length === 0) {
      return '';
    }

    const start = zoomedFinancialData[0].date;
    const end = zoomedFinancialData[zoomedFinancialData.length - 1].date;
    return formatRangeLabel(start, end);
  }, [zoomedFinancialData]);

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
    <section className="space-y-6 sm:space-y-8">
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
        <div className="ui-card p-3 text-right">
          <p className="text-xs uppercase tracking-wide text-gray-500">Total histórico registrado</p>
          <p className="text-lg font-semibold mt-1" style={{ color: COLORS.dark }}>
            {formatCOP(historicalTotal)}
          </p>
        </div>
      </div>

      <section className="ui-card ui-card-pad space-y-4">
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
            className="ui-card p-4 lg:p-6"
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
        <section className="xl:col-span-2 ui-card ui-card-pad">
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

        <section className="ui-card ui-card-pad">
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

      <section className="ui-card ui-card-pad">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
              Evolución financiera por día
            </h3>
            <p className="text-sm text-gray-500">
              Visualiza cómo se comportan las ventas, los gastos y el balance en el período seleccionado.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wide text-gray-500">Zoom:</span>
            {FINANCIAL_ZOOM_OPTIONS.map(option => (
              <button
                key={option.id}
                type="button"
                onClick={() => setFinancialZoom(option.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  financialZoom === option.id
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        {zoomedFinancialData.length > 0 ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <FinancialPerformanceChart data={zoomedFinancialData} />
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: SALES_COLOR }} /> Ventas
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: EXPENSES_COLOR }} /> Gastos
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 border-t-2 border-dashed" style={{ borderColor: BALANCE_COLOR }} /> Balance diario
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 border-t-2" style={{ borderColor: HISTORICAL_BALANCE_COLOR }} /> Balance histórico
                </div>
                {financialRangeLabel && (
                  <div className="ml-auto text-xs text-gray-500">
                    {financialRangeLabel}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Ventas acumuladas</p>
                <p className="text-lg font-semibold text-gray-800">{formatCOP(Math.round(zoomedFinancialTotals.sales))}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Gastos acumulados</p>
                <p className="text-lg font-semibold text-gray-800">{formatCOP(Math.round(zoomedFinancialTotals.expenses))}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Balance</p>
                <p className={`text-lg font-semibold ${zoomedFinancialTotals.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCOP(Math.round(zoomedFinancialTotals.balance))}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No hay datos suficientes para visualizar ventas y gastos.</p>
        )}
      </section>

      <section className="ui-card ui-card-pad">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
            Comportamiento por hora
          </h3>
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Total pedidos en el periodo:{' '}
            <span className="font-semibold text-gray-700">{orderCount}</span>
          </div>
        </div>
        {hourlyBreakdown.dataset.some(entry => entry.orders > 0) ? (
          <div className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-3">
                <HourlyOrdersChart data={hourlyBreakdown.dataset} maxOrders={hourlyBreakdown.maxOrders} />
                <p className="text-xs text-gray-500 text-center">
                  Eje Y: cantidad de pedidos · Eje X: hora del día.
                </p>
              </div>
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Resumen</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                      <p className="text-xs uppercase tracking-wide text-gray-500">Horas con actividad</p>
                      <p className="text-lg font-semibold text-gray-800">{activeHourlyEntries.length}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                      <p className="text-xs uppercase tracking-wide text-gray-500">Promedio por hora</p>
                      <p className="text-lg font-semibold text-gray-800">{averageOrdersPerActiveHour.toFixed(1)}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 sm:col-span-2">
                      <p className="text-xs uppercase tracking-wide text-gray-500">Hora más rentable</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {topSalesHour ? `${topSalesHour.label} · ${formatCOP(topSalesHour.total)}` : '—'}
                      </p>
                    </div>
                  </div>
                </div>
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
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Detalle por hora</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">Hora</th>
                      <th className="px-3 py-2 text-right font-medium text-gray-600">Pedidos</th>
                      <th className="px-3 py-2 text-right font-medium text-gray-600">Ventas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {activeHourlyEntries.map((entry) => (
                      <tr key={entry.hour} className="hover:bg-gray-50">
                        <td className="px-3 py-2 font-medium text-gray-700">{entry.label}</td>
                        <td className="px-3 py-2 text-right text-gray-600">{entry.orders}</td>
                        <td className="px-3 py-2 text-right font-semibold text-gray-700">
                          {entry.total > 0 ? formatCOP(entry.total) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No se registran pedidos en el periodo seleccionado.</p>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="ui-card ui-card-pad">
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

        <section className="ui-card ui-card-pad">
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
    </section>
  );
}
