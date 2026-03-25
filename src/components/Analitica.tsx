import React, { useEffect, useMemo, useState } from 'react';
import { CalendarCheck, CalendarRange, Calculator, ShoppingBag, TrendingUp, Trophy, PieChart, X, Sparkles } from 'lucide-react';
import { Gasto, Order } from '../types';
import { COLORS } from '../data/menu';
import { formatCOP, formatDateInputValue, parseDateInputValue } from '../utils/format';
import { getOrderAllocations } from '../utils/payments';
import dataService from '../lib/dataService';
import { AIStrategyModal } from './AIStrategyModal';

interface AnaliticaProps {
  orders: Order[];
  onViewOrder?: (order: Order) => void;
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

type PaymentBreakdownEntry = {
  method: string;
  label: string;
  amount: number;
  percentage: number;
};

type PaymentMethodOrderEntry = {
  order: Order;
  amount: number;
};

type MarketingInsight = {
  title: string;
  detail: string;
  action: string;
};

type CategorySummary = {
  category: string;
  amount: number;
  quantity: number;
};

type AnalyticsAlert = {
  title: string;
  detail: string;
  tone: 'positive' | 'warning' | 'neutral';
};

const GRID_COLOR = '#e5e7eb';
const BALANCE_COLOR = '#2563eb';
const HISTORICAL_BALANCE_COLOR = '#000000';
const CANDLE_GAIN_COLOR = '#16a34a';
const CANDLE_LOSS_COLOR = '#ef4444';

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

const DailyPerformanceChart = ({
  data,
}: {
  data: Array<{ dateKey: string; displayDate: string; total: number; orders: number }>;
}) => {
  if (data.length === 0) {
    return null;
  }

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const width = 760;
  const height = 320;
  const margin = { top: 20, right: 72, bottom: 64, left: 72 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const maxSales = Math.max(...data.map((entry) => entry.total), 1);
  const maxOrders = Math.max(...data.map((entry) => entry.orders), 1);
  const step = data.length > 1 ? innerWidth / (data.length - 1) : innerWidth;
  const barWidth = Math.max(16, Math.min(36, step * 0.52));

  const salesBars = data.map((entry, index) => {
    const x = margin.left + index * step;
    const heightValue = (entry.total / maxSales) * innerHeight;
    const y = margin.top + innerHeight - heightValue;
    return { x, y, height: heightValue, entry, index };
  });

  const orderPoints = data.map((entry, index) => {
    const x = margin.left + index * step;
    const y = margin.top + innerHeight - (entry.orders / maxOrders) * innerHeight;
    return { x, y, entry, index };
  });

  const orderPath = orderPoints
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`)
    .join(' ');

  const ySalesTicks = Array.from({ length: 5 }, (_, index) => Math.round((maxSales / 4) * index));
  const yOrdersTicks = Array.from({ length: 5 }, (_, index) => Math.round((maxOrders / 4) * index));
  const xTickEvery = Math.max(1, Math.ceil(data.length / 8));
  const xTicks = salesBars.filter((_, index) => index % xTickEvery === 0 || index === salesBars.length - 1);
  const activeBar = activeIndex !== null ? salesBars[activeIndex] : null;
  const activePoint = activeIndex !== null ? orderPoints[activeIndex] : null;
  const tooltipX = activePoint ? Math.max(margin.left + 8, Math.min(activePoint.x + 12, width - 180)) : 0;
  const tooltipY = activePoint ? Math.max(margin.top + 8, activePoint.y - 70) : 0;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-80">
      {ySalesTicks.map((tick) => {
        const y = margin.top + innerHeight - (tick / maxSales) * innerHeight;
        return (
          <g key={`sales-tick-${tick}`}>
            <line x1={margin.left} x2={margin.left + innerWidth} y1={y} y2={y} stroke={GRID_COLOR} strokeDasharray="4 4" />
            <text x={margin.left - 12} y={y + 4} textAnchor="end" className="text-xs fill-gray-500">
              {compactNumberFormatter.format(tick)}
            </text>
          </g>
        );
      })}
      {xTicks.map((point) => (
        <line
          key={`daily-x-${point.index}`}
          x1={point.x}
          x2={point.x}
          y1={margin.top}
          y2={margin.top + innerHeight}
          stroke={GRID_COLOR}
          strokeDasharray="4 4"
        />
      ))}
      {salesBars.map((bar) => (
        <rect
          key={`interactive-band-${bar.index}`}
          x={bar.x - Math.max(barWidth, step * 0.7) / 2}
          y={margin.top}
          width={Math.max(barWidth, step * 0.7)}
          height={innerHeight}
          fill="transparent"
          onMouseEnter={() => setActiveIndex(bar.index)}
          onMouseMove={() => setActiveIndex(bar.index)}
          onMouseLeave={() => setActiveIndex(null)}
          onClick={() => setActiveIndex((current) => (current === bar.index ? null : bar.index))}
        />
      ))}
      {salesBars.map((bar) => (
        <rect
          key={`bar-${bar.index}`}
          x={bar.x - barWidth / 2}
          y={bar.y}
          width={barWidth}
          height={bar.height}
          rx={6}
          fill={COLORS.accent}
          fillOpacity={activeIndex === bar.index ? 1 : 0.85}
        />
      ))}
      <path d={orderPath} fill="none" stroke={BALANCE_COLOR} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      {orderPoints.map((point) => (
        <circle
          key={`daily-point-${point.index}`}
          cx={point.x}
          cy={point.y}
          r={activeIndex === point.index ? 5 : 4}
          fill="#fff"
          stroke={BALANCE_COLOR}
          strokeWidth={2}
        />
      ))}
      {activeBar && activePoint && (
        <>
          <line
            x1={activePoint.x}
            x2={activePoint.x}
            y1={margin.top}
            y2={margin.top + innerHeight}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
          <g transform={`translate(${tooltipX},${tooltipY})`}>
            <rect width={168} height={70} rx={10} fill="#111827" fillOpacity={0.96} />
            <text x={10} y={20} className="text-[11px] fill-white font-semibold">
              {activeBar.entry.displayDate}
            </text>
            <text x={10} y={40} className="text-[10px] fill-blue-200">
              Pedidos: {activeBar.entry.orders}
            </text>
            <text x={10} y={56} className="text-[10px] fill-emerald-200">
              Ventas: {formatCOP(activeBar.entry.total)}
            </text>
          </g>
        </>
      )}
      <line x1={margin.left} x2={margin.left + innerWidth} y1={margin.top + innerHeight} y2={margin.top + innerHeight} stroke="#9ca3af" strokeWidth={1.5} />
      <line x1={margin.left} x2={margin.left} y1={margin.top} y2={margin.top + innerHeight} stroke="#9ca3af" strokeWidth={1.5} />
      <line x1={margin.left + innerWidth} x2={margin.left + innerWidth} y1={margin.top} y2={margin.top + innerHeight} stroke="#9ca3af" strokeWidth={1.5} />
      {xTicks.map((point) => (
        <text key={`daily-label-${point.index}`} x={point.x} y={margin.top + innerHeight + 22} textAnchor="middle" className="text-xs fill-gray-500">
          {point.entry.displayDate.split(',')[0]}
        </text>
      ))}
      {yOrdersTicks.map((tick) => {
        const y = margin.top + innerHeight - (tick / maxOrders) * innerHeight;
        return (
          <text key={`orders-tick-${tick}`} x={margin.left + innerWidth + 12} y={y + 4} textAnchor="start" className="text-xs fill-blue-600">
            {tick}
          </text>
        );
      })}
      <text x={margin.left / 2} y={margin.top + innerHeight / 2} transform={`rotate(-90 ${margin.left / 2} ${margin.top + innerHeight / 2})`} className="text-xs font-medium fill-gray-600">
        Ventas (COP)
      </text>
      <text x={margin.left + innerWidth + 44} y={margin.top + innerHeight / 2} transform={`rotate(-90 ${margin.left + innerWidth + 44} ${margin.top + innerHeight / 2})`} className="text-xs font-medium fill-blue-600">
        Pedidos
      </text>
    </svg>
  );
};

const FinancialPerformanceChart = ({ data }: { data: FinancialChartPoint[] }) => {
  if (data.length === 0) {
    return <p className="text-sm text-gray-500">No hay datos suficientes para mostrar la gráfica.</p>;
  }

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  const balancePoints = buildPoints(point => point.balance);
  const historicalBalancePoints = buildPoints(point => point.historicalBalance);
  const barPoints = data.map((point, index) => {
    const x = margin.left + index * xStep;
    const salesValue = point.sales;
    const expensesValue = point.expenses;
    const salesY = margin.top + innerHeight - ((salesValue - minValue) / range) * innerHeight;
    const expensesY = margin.top + innerHeight - ((expensesValue - minValue) / range) * innerHeight;
    return {
      x,
      salesY,
      expensesY,
      label: point.label,
      sales: salesValue,
      expenses: expensesValue,
    };
  });

  const yTickCount = 5;
  const yTicks = Array.from({ length: yTickCount }, (_, index) => minValue + (range / (yTickCount - 1)) * index);
  const xTickEvery = Math.max(1, Math.ceil(data.length / 6));
  const xTicks = barPoints.filter((point, index) => index % xTickEvery === 0 || index === barPoints.length - 1);
  const hoverBandWidth = data.length > 1 ? xStep : innerWidth;

  const zeroY = margin.top + innerHeight - ((0 - minValue) / range) * innerHeight;
  const hoveredPoint = hoveredIndex !== null ? barPoints[hoveredIndex] : null;
  const hoveredData = hoveredIndex !== null ? data[hoveredIndex] : null;

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
      {xTicks.map((point, index) => (
        <line
          key={`x-financial-${index}`}
          x1={point.x}
          x2={point.x}
          y1={margin.top}
          y2={margin.top + innerHeight}
          stroke={GRID_COLOR}
          strokeDasharray="4 4"
        />
      ))}
      {barPoints.map((point, index) => (
        <rect
          key={`hover-band-${index}`}
          x={point.x - hoverBandWidth / 2}
          y={margin.top}
          width={hoverBandWidth}
          height={innerHeight}
          fill="transparent"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseMove={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        />
      ))}
      {barPoints.map((point, index) => {
        const barWidth = Math.max(5, Math.min(14, xStep * 0.28));
        const salesBarX = point.x - barWidth - 1.5;
        const expensesBarX = point.x + 1.5;
        const salesBarY = Math.min(zeroY, point.salesY);
        const expensesBarY = Math.min(zeroY, point.expensesY);
        const salesBarHeight = Math.abs(zeroY - point.salesY);
        const expensesBarHeight = Math.abs(zeroY - point.expensesY);

        return (
          <g key={`bars-${index}`}>
            <rect
              x={salesBarX}
              y={salesBarY}
              width={barWidth}
              height={salesBarHeight}
              rx={2}
              fill={CANDLE_GAIN_COLOR}
              fillOpacity={0.9}
            />
            <rect
              x={expensesBarX}
              y={expensesBarY}
              width={barWidth}
              height={expensesBarHeight}
              rx={2}
              fill={CANDLE_LOSS_COLOR}
              fillOpacity={0.9}
            />
          </g>
        );
      })}
      {hoveredPoint && (
        <line
          x1={hoveredPoint.x}
          x2={hoveredPoint.x}
          y1={margin.top}
          y2={margin.top + innerHeight}
          stroke="#9ca3af"
          strokeDasharray="3 3"
          strokeWidth={1.5}
        />
      )}
      <path d={buildPath(balancePoints)} fill="none" stroke={BALANCE_COLOR} strokeWidth={2.5} strokeDasharray="6 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d={buildPath(historicalBalancePoints)} fill="none" stroke={HISTORICAL_BALANCE_COLOR} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
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
      {xTicks.map((point, index) => (
        <text key={`label-${index}`} x={point.x} y={margin.top + innerHeight + 20} textAnchor="middle" className="text-xs fill-gray-500">
          {point.label}
        </text>
      ))}
      {hoveredPoint && hoveredData && (
        <g transform={`translate(${Math.max(margin.left + 6, Math.min(hoveredPoint.x + 10, width - 190))},${margin.top + 10})`}>
          <rect width={180} height={92} rx={8} fill="#111827" fillOpacity={0.96} />
          <text x={10} y={18} className="text-[11px] fill-white font-semibold">
            {hoveredData.date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
          </text>
          <text x={10} y={36} className="text-[10px] fill-emerald-300">Ventas: {formatCOP(Math.round(hoveredData.sales))}</text>
          <text x={10} y={50} className="text-[10px] fill-rose-300">Gastos: {formatCOP(Math.round(hoveredData.expenses))}</text>
          <text x={10} y={66} className="text-[10px] fill-blue-300">Balance diario: {formatCOP(Math.round(hoveredData.balance))}</text>
          <text x={10} y={82} className="text-[10px] fill-gray-200">Balance histórico: {formatCOP(Math.round(hoveredData.historicalBalance))}</text>
        </g>
      )}
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

const getPreviousRange = (start: Date, end: Date) => {
  const rangeMs = end.getTime() - start.getTime();
  const previousEnd = new Date(start.getTime() - 1);
  previousEnd.setHours(23, 59, 59, 999);
  const previousStart = new Date(previousEnd.getTime() - rangeMs);
  previousStart.setHours(0, 0, 0, 0);
  return { start: previousStart, end: previousEnd };
};

const getPercentChange = (current: number, previous: number) => {
  if (previous <= 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
};

const getOrdersInRange = (orders: Order[], start: Date, end: Date) =>
  orders.filter((order) => {
    const timestamp = order.timestamp.getTime();
    return timestamp >= start.getTime() && timestamp <= end.getTime();
  });

const getExpensesInRange = (expenses: Gasto[], start: Date, end: Date) =>
  expenses.filter((gasto) => {
    const expenseDate = gasto.fecha instanceof Date ? gasto.fecha : new Date(gasto.fecha);
    const timestamp = expenseDate.getTime();
    return timestamp >= start.getTime() && timestamp <= end.getTime();
  });

const summarizeCategories = (orders: Order[]) => {
  const totals = new Map<string, CategorySummary>();

  orders.forEach((order) => {
    order.items.forEach(({ item, cantidad, precioUnitario }) => {
      const category = item.categoria?.trim() || 'Sin categoría';
      const unitPrice = typeof precioUnitario === 'number' ? precioUnitario : item.precio;
      const itemTotal = cantidad * unitPrice;
      const entry = totals.get(category) ?? { category, amount: 0, quantity: 0 };
      entry.amount += itemTotal;
      entry.quantity += cantidad;
      totals.set(category, entry);
    });
  });

  return Array.from(totals.values()).sort((a, b) => b.amount - a.amount);
};

const summarizeItems = (orders: Order[]) => {
  const totals = new Map<string, { name: string; quantity: number; amount: number }>();

  orders.forEach((order) => {
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

  return Array.from(totals.values()).sort((a, b) => b.amount - a.amount);
};

const getRealIncomeFromOrder = (order: Order): number => {
  const allocations = getOrderAllocations(order);
  if (allocations.length > 0) {
    return allocations.reduce((sum, entry) => {
      if (entry.metodo === 'credito_empleados') {
        return sum;
      }
      return sum + entry.monto;
    }, 0);
  }

  if (order.metodoPago === 'credito_empleados') {
    return 0;
  }

  return order.total;
};

export function Analitica({ orders, onViewOrder }: AnaliticaProps) {
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
  const [comparisonStartDate, setComparisonStartDate] = useState<string>(defaultStart);
  const [marketingStartDate, setMarketingStartDate] = useState<string>(defaultStart);
  const [marketingEndDate, setMarketingEndDate] = useState<string>(today);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [financialZoom, setFinancialZoom] = useState<'7' | '30' | '90' | 'all'>('30');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

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
    () => orders.reduce((sum, order) => sum + getRealIncomeFromOrder(order), 0),
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

  const comparisonEndDate = useMemo(() => {
    const currentStart = filterMode === 'single'
      ? parseDateInputValue(singleDate)
      : rangeStart;
    const previousEnd = new Date(currentStart);
    previousEnd.setDate(previousEnd.getDate() - 1);
    return formatDateInputValue(previousEnd);
  }, [filterMode, singleDate, rangeStart]);

  useEffect(() => {
    const currentStart = filterMode === 'single'
      ? parseDateInputValue(singleDate)
      : rangeStart;
    const currentEnd = filterMode === 'single'
      ? parseDateInputValue(singleDate)
      : rangeEnd;
    const automaticPreviousRange = getPreviousRange(currentStart, currentEnd);
    setComparisonStartDate(formatDateInputValue(automaticPreviousRange.start));
  }, [filterMode, singleDate, rangeStart, rangeEnd]);

  const comparisonWindow = useMemo(() => {
    const currentStart = filterMode === 'single'
      ? parseDateInputValue(singleDate)
      : rangeStart;
    const currentEnd = filterMode === 'single'
      ? parseDateInputValue(singleDate)
      : rangeEnd;
    currentStart.setHours(0, 0, 0, 0);
    currentEnd.setHours(23, 59, 59, 999);

    const previousStart = parseDateInputValue(comparisonStartDate);
    previousStart.setHours(0, 0, 0, 0);
    const previousEnd = parseDateInputValue(comparisonEndDate);
    previousEnd.setHours(23, 59, 59, 999);

    return {
      currentStart,
      currentEnd,
      previousStart,
      previousEnd,
    };
  }, [filterMode, singleDate, rangeStart, rangeEnd, comparisonStartDate, comparisonEndDate]);

  const sortedOrders = useMemo(
    () => [...filteredOrders].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    [filteredOrders]
  );

  const totalSales = useMemo(
    () => filteredOrders.reduce((sum, order) => sum + getRealIncomeFromOrder(order), 0),
    [filteredOrders]
  );
  const totalExpenses = useMemo(
    () => filteredExpenses.reduce((sum, gasto) => sum + gasto.monto, 0),
    [filteredExpenses]
  );
  const periodBalance = totalSales - totalExpenses;

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
      const realIncome = getRealIncomeFromOrder(order);
      current.orders += 1;
      current.total += realIncome;
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
      entry.sales += getRealIncomeFromOrder(order);
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

  const previousComparisonMetrics = useMemo(() => {
    const previousOrders = getOrdersInRange(orders, comparisonWindow.previousStart, comparisonWindow.previousEnd);
    const previousExpenses = getExpensesInRange(gastos, comparisonWindow.previousStart, comparisonWindow.previousEnd);
    const previousSales = previousOrders.reduce((sum, order) => sum + getRealIncomeFromOrder(order), 0);
    const previousExpenseTotal = previousExpenses.reduce((sum, gasto) => sum + gasto.monto, 0);
    const previousOrderCount = previousOrders.length;
    const previousAverageTicket = previousOrderCount > 0 ? previousSales / previousOrderCount : 0;
    const previousBalance = previousSales - previousExpenseTotal;

    return {
      previousSales,
      previousExpenseTotal,
      previousOrderCount,
      previousAverageTicket,
      previousBalance,
      salesChangePct: getPercentChange(totalSales, previousSales),
      expensesChangePct: getPercentChange(totalExpenses, previousExpenseTotal),
      ordersChangePct: getPercentChange(orderCount, previousOrderCount),
      ticketChangePct: getPercentChange(averageTicket, previousAverageTicket),
      balanceChangePct: getPercentChange(periodBalance, previousBalance),
    };
  }, [orders, gastos, comparisonWindow, totalSales, totalExpenses, orderCount, averageTicket, periodBalance]);

  const comparisonLabel = useMemo(() => {
    return formatRangeLabel(comparisonWindow.previousStart, comparisonWindow.previousEnd);
  }, [comparisonWindow]);

  const analyticsAlerts = useMemo(() => {
    const alerts: AnalyticsAlert[] = [];
    if (previousComparisonMetrics.salesChangePct <= -10) {
      alerts.push({
        title: 'Caída relevante de ventas',
        detail: `Las ventas cayeron ${Math.abs(previousComparisonMetrics.salesChangePct).toFixed(1)}% frente al período anterior equivalente. Revisa si faltó tráfico, oferta o ejecución en horas fuertes.`,
        tone: 'warning',
      });
    } else if (previousComparisonMetrics.salesChangePct >= 10) {
      alerts.push({
        title: 'Ventas creciendo sobre la referencia',
        detail: `Las ventas subieron ${previousComparisonMetrics.salesChangePct.toFixed(1)}% frente al período anterior. Vale la pena repetir la oferta o franja que está funcionando.`,
        tone: 'positive',
      });
    }

    if (previousComparisonMetrics.ticketChangePct <= -8) {
      alerts.push({
        title: 'El ticket promedio perdió fuerza',
        detail: `El ticket promedio bajó ${Math.abs(previousComparisonMetrics.ticketChangePct).toFixed(1)}%. Estás vendiendo menos valor por pedido aunque entre tráfico.`,
        tone: 'warning',
      });
    }

    if (previousComparisonMetrics.ordersChangePct >= 8 && previousComparisonMetrics.ticketChangePct < 0) {
      alerts.push({
        title: 'Suben pedidos pero no el valor por pedido',
        detail: 'Entró más volumen, pero cada compra está dejando menos dinero. Aquí hay oportunidad de combo, postre o bebida adicional.',
        tone: 'neutral',
      });
    }

    if (totalExpenses > totalSales) {
      alerts.push({
        title: 'Los gastos superaron las ventas del período',
        detail: 'El período cerró con presión fuerte en caja. Revisa qué gasto extraordinario afectó el balance antes de tomar decisiones de compra.',
        tone: 'warning',
      });
    }

    if (topSalesHour && topSalesHour.total > 0) {
      alerts.push({
        title: 'Hay una hora comercial para explotar',
        detail: `${topSalesHour.label} fue la hora con más venta acumulada. Publica y empuja oferta 60-90 minutos antes de esa franja.`,
        tone: 'positive',
      });
    }
    return alerts.slice(0, 4);
  }, [previousComparisonMetrics, totalExpenses, totalSales, topSalesHour]);

  const paymentMethodOrders = useMemo(() => {
    const grouped: Record<string, PaymentMethodOrderEntry[]> = {};

    filteredOrders.forEach((order) => {
      const allocations = (order.paymentAllocations && order.paymentAllocations.length > 0)
        ? order.paymentAllocations
        : order.metodoPago
          ? [{ metodo: order.metodoPago, monto: Math.round(order.total) }]
          : [];

      if (allocations.length === 0) {
        grouped.sin_registro = [...(grouped.sin_registro ?? []), { order, amount: order.total }];
        return;
      }

      allocations.forEach(({ metodo, monto }) => {
        grouped[metodo] = [...(grouped[metodo] ?? []), { order, amount: monto }];
      });
    });

    return grouped;
  }, [filteredOrders]);

  const paymentBreakdown = useMemo(() => {
    const summary: Record<string, number> = {};

    Object.entries(paymentMethodOrders).forEach(([method, entries]) => {
      summary[method] = entries.reduce((sum, entry) => sum + entry.amount, 0);
    });

    return Object.entries(summary)
      .map(([method, amount]) => ({
        method,
        label: PAYMENT_LABELS[method] ?? method,
        amount,
        percentage: totalSales > 0 ? (amount / totalSales) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [paymentMethodOrders, totalSales]);

  const selectedPaymentMethodEntry = useMemo(
    () => paymentBreakdown.find((entry) => entry.method === selectedPaymentMethod),
    [paymentBreakdown, selectedPaymentMethod],
  );

  const selectedPaymentMethodOrders = useMemo(() => {
    if (!selectedPaymentMethod) {
      return [] as PaymentMethodOrderEntry[];
    }
    const entries = paymentMethodOrders[selectedPaymentMethod] ?? [];
    return [...entries].sort((a, b) => b.order.timestamp.getTime() - a.order.timestamp.getTime());
  }, [paymentMethodOrders, selectedPaymentMethod]);

  const dailySummary = useMemo(() => {
    const summaryMap = new Map<string, { total: number; orders: number }>();

    filteredOrders.forEach(order => {
      const dateKey = formatDateInputValue(order.timestamp);
      const entry = summaryMap.get(dateKey) ?? { total: 0, orders: 0 };
      entry.total += getRealIncomeFromOrder(order);
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

  const dailySummaryChartData = useMemo(
    () => [...dailySummary].reverse(),
    [dailySummary]
  );

  const bestSalesDay = useMemo(
    () => dailySummary.reduce<(typeof dailySummary)[number] | null>((best, entry) => {
      if (!best || entry.total > best.total) {
        return entry;
      }
      return best;
    }, null),
    [dailySummary]
  );

  const bestOrdersDay = useMemo(
    () => dailySummary.reduce<(typeof dailySummary)[number] | null>((best, entry) => {
      if (!best || entry.orders > best.orders) {
        return entry;
      }
      return best;
    }, null),
    [dailySummary]
  );

  const topItems = useMemo(() => {
    return summarizeItems(filteredOrders).slice(0, 5);
  }, [filteredOrders]);

  const lowItems = useMemo(() => {
    return summarizeItems(filteredOrders)
      .filter((item) => item.quantity > 0 && item.quantity <= 3)
      .sort((a, b) => {
        if (a.quantity === b.quantity) {
          return a.amount - b.amount;
        }
        return a.quantity - b.quantity;
      });
  }, [filteredOrders]);

  const topCategories = useMemo(() => {
    return summarizeCategories(filteredOrders).slice(0, 4);
  }, [filteredOrders]);

  const historicalCategoryTotals = useMemo(() => {
    return summarizeCategories(orders);
  }, [orders]);

  const marketingRangeBoundaries = useMemo(
    () => getNormalizedRange(marketingStartDate, marketingEndDate),
    [marketingStartDate, marketingEndDate]
  );
  const marketingRangeStart = marketingRangeBoundaries.start;
  const marketingRangeEnd = marketingRangeBoundaries.end;

  const marketingFilteredOrders = useMemo(
    () => getOrdersInRange(orders, marketingRangeStart, marketingRangeEnd),
    [orders, marketingRangeStart, marketingRangeEnd]
  );

  const marketingTotalSales = useMemo(
    () => marketingFilteredOrders.reduce((sum, order) => sum + getRealIncomeFromOrder(order), 0),
    [marketingFilteredOrders]
  );
  const marketingOrderCount = marketingFilteredOrders.length;
  const marketingAverageTicket = marketingOrderCount > 0 ? marketingTotalSales / marketingOrderCount : 0;
  const marketingTopCategories = useMemo(
    () => summarizeCategories(marketingFilteredOrders).slice(0, 4),
    [marketingFilteredOrders]
  );
  const marketingTopItems = useMemo(
    () => summarizeItems(marketingFilteredOrders).slice(0, 5),
    [marketingFilteredOrders]
  );
  const marketingHourlyBreakdown = useMemo(() => {
    const summary = new Map<number, { orders: number; total: number }>();

    marketingFilteredOrders.forEach((order) => {
      const hour = order.timestamp.getHours();
      const current = summary.get(hour) ?? { orders: 0, total: 0 };
      current.orders += 1;
      current.total += getRealIncomeFromOrder(order);
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
      .filter((entry) => entry.orders > 0)
      .sort((a, b) => {
        if (b.orders === a.orders) {
          return b.total - a.total;
        }
        return b.orders - a.orders;
      })
      .slice(0, 3);

    return { busiest };
  }, [marketingFilteredOrders]);

  const marketingPaymentBreakdown = useMemo(() => {
    const summary: Record<string, number> = {};
    marketingFilteredOrders.forEach((order) => {
      const allocations = getOrderAllocations(order);
      if (allocations.length === 0) {
        summary.sin_registro = (summary.sin_registro ?? 0) + order.total;
        return;
      }
      allocations.forEach((allocation) => {
        summary[allocation.metodo] = (summary[allocation.metodo] ?? 0) + allocation.monto;
      });
    });

    return Object.entries(summary).map(([method, amount]) => ({ method, amount }));
  }, [marketingFilteredOrders]);

  const marketingComparisonWindow = useMemo(() => {
    const previousRange = getPreviousRange(marketingRangeStart, marketingRangeEnd);
    return {
      currentStart: marketingRangeStart,
      currentEnd: marketingRangeEnd,
      previousStart: previousRange.start,
      previousEnd: previousRange.end,
    };
  }, [marketingRangeStart, marketingRangeEnd]);

  const marketingComparisonMetrics = useMemo(() => {
    const previousOrders = getOrdersInRange(orders, marketingComparisonWindow.previousStart, marketingComparisonWindow.previousEnd);
    const previousSales = previousOrders.reduce((sum, order) => sum + getRealIncomeFromOrder(order), 0);
    const previousOrderCount = previousOrders.length;
    const previousAverageTicket = previousOrderCount > 0 ? previousSales / previousOrderCount : 0;
    const previousTopCategories = summarizeCategories(previousOrders);
    const previousTopItems = summarizeItems(previousOrders);

    return {
      previousOrders,
      previousSales,
      previousOrderCount,
      previousAverageTicket,
      previousTopCategories,
      previousTopItems,
      salesChangePct: getPercentChange(marketingTotalSales, previousSales),
      orderChangePct: getPercentChange(marketingOrderCount, previousOrderCount),
      ticketChangePct: getPercentChange(marketingAverageTicket, previousAverageTicket),
    };
  }, [orders, marketingComparisonWindow, marketingTotalSales, marketingOrderCount, marketingAverageTicket]);

  const nextPeriodLabel = useMemo(() => {
    const days = Math.max(1, Math.floor((marketingRangeEnd.getTime() - marketingRangeStart.getTime()) / 86400000) + 1);
    if (days <= 8) {
      return 'la próxima semana';
    }
    if (days <= 31) {
      return 'el próximo tramo del mes';
    }
    return 'el siguiente periodo';
  }, [marketingRangeStart, marketingRangeEnd]);

  const marketingPeriodDescription = useMemo(
    () => formatRangeLabel(marketingRangeStart, marketingRangeEnd),
    [marketingRangeStart, marketingRangeEnd]
  );

  const marketingInsights = useMemo(() => {
    const insights: MarketingInsight[] = [];

    if (marketingOrderCount === 0) {
      return insights;
    }

    const topCategory = marketingTopCategories[0];
    const secondCategory = marketingTopCategories[1];
    const topItem = marketingTopItems[0];
    const lowTicketThreshold = 22000;
    const hasEmployeeCreditSales = marketingPaymentBreakdown.some((entry) => entry.method === 'credito_empleados' && entry.amount > 0);
    const historicalAveragePerOrder = orders.length > 0 ? historicalTotal / orders.length : 0;
    const historicalTopCategory = historicalCategoryTotals[0];
    const currentVsHistoricalTicketDelta = historicalAveragePerOrder > 0
      ? ((marketingAverageTicket - historicalAveragePerOrder) / historicalAveragePerOrder) * 100
      : 0;
    const currentTopCategory = marketingTopCategories[0];
    const previousTopCategory = marketingComparisonMetrics.previousTopCategories[0];
    const currentTopItem = marketingTopItems[0];
    const previousTopItem = marketingComparisonMetrics.previousTopItems[0];

    insights.push({
      title: `Objetivo comercial para ${nextPeriodLabel}`,
      detail: `Ventas ${marketingComparisonMetrics.salesChangePct >= 0 ? 'subieron' : 'cayeron'} ${Math.abs(marketingComparisonMetrics.salesChangePct).toFixed(1)}% frente al periodo anterior equivalente. Los pedidos ${marketingComparisonMetrics.orderChangePct >= 0 ? 'variaron al alza' : 'bajaron'} ${Math.abs(marketingComparisonMetrics.orderChangePct).toFixed(1)}%.`,
      action:
        marketingComparisonMetrics.salesChangePct < 0
          ? `La próxima semana enfoca la campaña en recuperar volumen: una oferta principal, una franja horaria clara y seguimiento diario al número de pedidos.`
          : `La próxima semana enfoca la campaña en sostener el volumen y mejorar margen con upselling sobre lo que ya está funcionando.`,
    });

    if (currentTopCategory) {
      const topCategoryHistorical = historicalCategoryTotals.find((entry) => entry.category === currentTopCategory.category);
      const topCategoryShareInHistory = topCategoryHistorical && historicalTopCategory
        ? (topCategoryHistorical.amount / historicalTopCategory.amount) * 100
        : 0;
      insights.push({
        title: `Define el ancla comercial de ${nextPeriodLabel}`,
        detail: `${currentTopCategory.category} lidera el periodo actual con ${formatCOP(Math.round(currentTopCategory.amount))}${previousTopCategory ? `, mientras que en el periodo anterior lideró ${previousTopCategory.category}.` : '.'}`,
        action: `Para ${nextPeriodLabel}, pon ${currentTopCategory.category} como frente de campaña y acompáñala con un combo visible. ${topCategoryShareInHistory > 80 ? 'Es una línea estable, así que puedes repetirla sin riesgo alto.' : 'Úsala como prueba controlada y mide si repite la tracción actual.'}`,
      });
    }

    if (currentTopItem) {
      insights.push({
        title: `Usa ${currentTopItem.name} como gancho para la siguiente campaña`,
        detail: `${currentTopItem.name} es el producto más vendido del periodo con ${currentTopItem.quantity} unidades${previousTopItem ? `; en el periodo anterior lideró ${previousTopItem.name}` : ''}.`,
        action: `Promociónalo la próxima semana en Instagram, estados y caja como "el más pedido". No lo anuncies solo: súmale bebida, postre o topping para que arrastre ticket.`,
      });
    }

    if (averageTicket > 0) {
      insights.push({
        title: marketingAverageTicket < historicalAveragePerOrder ? 'La próxima semana debe enfocarse en subir ticket' : 'La próxima semana puede enfocarse en mantener ticket y aumentar volumen',
        detail: `El ticket promedio actual es ${formatCOP(Math.round(marketingAverageTicket))}, el histórico general es ${formatCOP(Math.round(historicalAveragePerOrder))} y el periodo anterior equivalente fue ${formatCOP(Math.round(marketingComparisonMetrics.previousAverageTicket))}.`,
        action:
          marketingAverageTicket < lowTicketThreshold || currentVsHistoricalTicketDelta < 0 || marketingComparisonMetrics.ticketChangePct < 0
            ? `Para ${nextPeriodLabel}, activa combos cerrados y guion de venta en caja para bebida/postre. La meta debe ser recuperar al menos ${Math.abs(Math.min(currentVsHistoricalTicketDelta, marketingComparisonMetrics.ticketChangePct)).toFixed(1)}% del ticket perdido.`
            : `Para ${nextPeriodLabel}, conserva el combo actual y mueve más tráfico en horas valle, porque el ticket ya está por encima o cerca del histórico.`,
      });
    }

    if (marketingHourlyBreakdown.busiest.length > 0) {
      const busiestHour = marketingHourlyBreakdown.busiest[0];
      insights.push({
        title: `Programa la comunicación antes de la hora que más convierte`,
        detail: `${busiestHour.label} fue la franja más activa del periodo con ${busiestHour.orders} pedidos.`,
        action: `Para ${nextPeriodLabel}, publica contenido y recordatorios entre 60 y 90 minutos antes de ${busiestHour.label}. Esa es la ventana más probable para convertir mejor.`,
      });
    }

    if (secondCategory) {
      insights.push({
        title: `Planea venta cruzada con las dos familias más activas`,
        detail: `${currentTopCategory?.category ?? 'La categoría principal'} y ${secondCategory.category} son las categorías con mejor movimiento en el periodo.`,
        action: `Diseña la estrategia de ${nextPeriodLabel} alrededor de una dupla: producto principal de ${currentTopCategory?.category ?? 'la línea líder'} + complemento de ${secondCategory.category}. Usa esa combinación en caja y redes.`,
      });
    }

    if (hasEmployeeCreditSales) {
      insights.push({
        title: 'No confundas venta con caja para la estrategia siguiente',
        detail: 'En el periodo hubo crédito empleados, así que parte de la venta no es ingreso inmediato.',
        action: `Para ${nextPeriodLabel}, define promociones e inventario usando ventas reales cobradas, no solo la venta bruta. Así evitas sobreestimar caja disponible.`,
      });
    }

    return insights.slice(0, 6);
  }, [marketingOrderCount, marketingTopCategories, marketingTopItems, marketingAverageTicket, marketingPaymentBreakdown, marketingHourlyBreakdown, orders.length, historicalTotal, historicalCategoryTotals, nextPeriodLabel, marketingComparisonMetrics]);

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

  const handleOpenPaymentMethod = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handleClosePaymentMethodModal = () => {
    setSelectedPaymentMethod(null);
  };

  const handleViewOrderFromPaymentMethod = (order: Order) => {
    onViewOrder?.(order);
    setSelectedPaymentMethod(null);
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
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow"
          >
            <Sparkles size={18} />
            Estrategia IA
          </button>
          <div className="ui-card p-3 text-right">
            <p className="text-xs uppercase tracking-wide text-gray-500">Total histórico registrado</p>
            <p className="text-lg font-semibold mt-1" style={{ color: COLORS.dark }}>
              {formatCOP(historicalTotal)}
            </p>
          </div>
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

      <section className="ui-card ui-card-pad space-y-5">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
              Comparativo del período
            </h3>
            <p className="text-sm text-gray-500">
              Compara el rango actual contra el período anterior equivalente: {comparisonLabel}.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col text-sm text-gray-700">
            <span className="mb-2 font-medium">Inicio período equivalente</span>
            <input
              type="date"
              value={comparisonStartDate}
              max={comparisonEndDate}
              onChange={(event) => setComparisonStartDate(event.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">Fin período equivalente</p>
            <p className="mt-1 text-base font-semibold text-gray-900">{comparisonEndDate}</p>
            <p className="mt-1 text-xs text-gray-500">
              Esta fecha se fija automáticamente como el día anterior al inicio del rango filtrado actual.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {[
            {
              label: 'Ventas',
              current: totalSales,
              previous: previousComparisonMetrics.previousSales,
              change: previousComparisonMetrics.salesChangePct,
              format: formatCOP,
            },
            {
              label: 'Pedidos',
              current: orderCount,
              previous: previousComparisonMetrics.previousOrderCount,
              change: previousComparisonMetrics.ordersChangePct,
              format: (value: number) => `${Math.round(value)}`,
            },
            {
              label: 'Ticket promedio',
              current: averageTicket,
              previous: previousComparisonMetrics.previousAverageTicket,
              change: previousComparisonMetrics.ticketChangePct,
              format: (value: number) => formatCOP(Math.round(value)),
            },
            {
              label: 'Gastos',
              current: totalExpenses,
              previous: previousComparisonMetrics.previousExpenseTotal,
              change: previousComparisonMetrics.expensesChangePct,
              format: formatCOP,
            },
            {
              label: 'Balance',
              current: periodBalance,
              previous: previousComparisonMetrics.previousBalance,
              change: previousComparisonMetrics.balanceChangePct,
              format: (value: number) => formatCOP(Math.round(value)),
            },
          ].map((metric) => {
            const positive = metric.change >= 0;
            const toneClass =
              metric.label === 'Gastos'
                ? positive ? 'text-rose-600' : 'text-emerald-600'
                : positive ? 'text-emerald-600' : 'text-rose-600';

            return (
              <div key={metric.label} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">{metric.label}</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{metric.format(metric.current)}</p>
                <p className="mt-1 text-xs text-gray-500">Anterior: {metric.format(metric.previous)}</p>
                <p className={`mt-2 text-sm font-semibold ${toneClass}`}>
                  {positive ? '+' : '-'}{Math.abs(metric.change).toFixed(1)}%
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {analyticsAlerts.map((alert) => (
            <article
              key={alert.title}
              className={`rounded-xl border p-4 ${
                alert.tone === 'warning'
                  ? 'border-amber-200 bg-amber-50'
                  : alert.tone === 'positive'
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-blue-200 bg-blue-50'
              }`}
            >
              <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
              <p className="mt-2 text-sm text-gray-700">{alert.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 ui-card ui-card-pad">
          <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.dark }}>
            Desempeño diario
          </h3>
          {dailySummary.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Mejor día en ventas</p>
                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {bestSalesDay?.displayDate ?? '—'}
                  </p>
                  <p className="mt-1 text-lg font-semibold" style={{ color: COLORS.dark }}>
                    {bestSalesDay ? formatCOP(bestSalesDay.total) : '—'}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Día con más pedidos</p>
                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {bestOrdersDay?.displayDate ?? '—'}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-blue-600">
                    {bestOrdersDay ? `${bestOrdersDay.orders} pedidos` : '—'}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Lectura del gráfico</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Barras: ventas por día. Línea azul: cantidad de pedidos. Así ves si el crecimiento viene por más tráfico o por mayor ticket.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <DailyPerformanceChart data={dailySummaryChartData} />
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.accent }} /> Ventas por día
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 border-t-2" style={{ borderColor: BALANCE_COLOR }} /> Pedidos por día
                  </div>
                </div>
              </div>

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
                <button
                  key={entry.method}
                  type="button"
                  onClick={() => handleOpenPaymentMethod(entry.method)}
                  className="w-full text-left rounded-lg border border-gray-100 p-3 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
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
                  <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                    <span>{entry.percentage.toFixed(1)}% del periodo</span>
                    <span className="font-medium text-gray-600">Ver órdenes</span>
                  </div>
                </button>
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
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: CANDLE_GAIN_COLOR }} /> Ventas (barra)
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: CANDLE_LOSS_COLOR }} /> Gastos (barra)
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
            <div className="space-y-6">
              <ul className="space-y-3 text-sm">
                {topItems.map((item) => (
                  <li key={`top-${item.name}`} className="flex items-center justify-between">
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

              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Productos menos vendidos
                </h4>
                {lowItems.length > 0 ? (
                  <ul className="space-y-3 text-sm">
                    {lowItems.map((item) => (
                      <li key={`low-${item.name}`} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-700">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.quantity} unidades</p>
                        </div>
                        <span className="font-semibold text-gray-500">
                          {formatCOP(item.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">
                    No hay suficientes ventas para identificar productos de baja rotación.
                  </p>
                )}
              </div>
            </div>
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

      {selectedPaymentMethod && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden border border-gray-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Órdenes por método: {selectedPaymentMethodEntry?.label ?? selectedPaymentMethod}
                </h4>
                <p className="text-xs text-gray-500">
                  {selectedPaymentMethodOrders.length} órdenes · {formatCOP(Math.round(selectedPaymentMethodEntry?.amount ?? 0))}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClosePaymentMethodModal}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[70vh] space-y-2">
              {selectedPaymentMethodOrders.length > 0 ? (
                selectedPaymentMethodOrders.map((entry) => (
                  <div
                    key={`${selectedPaymentMethod}-${entry.order.id}-${entry.amount}`}
                    className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                  >
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => handleViewOrderFromPaymentMethod(entry.order)}
                        className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline"
                      >
                        Comanda #{entry.order.numero}
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        {entry.order.timestamp.toLocaleDateString('es-CO', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{formatCOP(Math.round(entry.amount))}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No hay órdenes asociadas a este método para el periodo.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <AIStrategyModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        orders={orders}
      />
    </section>
  );
}
