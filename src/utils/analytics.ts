import { formatCOP } from './format';

export type FinancialChartPoint = {
  date: Date;
  label: string;
  sales: number;
  expenses: number;
  balance: number;
  historicalBalance: number;
};

export type PeriodMetrics = {
  days: number;
  sales: number;
  expenses: number;
  balance: number;
  avgSales: number;
  avgExpenses: number;
  netMarginPct: number | null;
  bestSalesDay?: { date: Date; value: number };
  highestExpenseDay?: { date: Date; value: number };
  worstBalanceDay?: { date: Date; value: number };
  stdSales?: number;
  cvSales?: number;
  shareTopDay?: number;
};

const COST_PRESSURE_THRESHOLD = 0.4;

const percentFormatter = new Intl.NumberFormat('es-CO', {
  style: 'percent',
  maximumFractionDigits: 1,
});

const decimalPercentFormatter = new Intl.NumberFormat('es-CO', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const monthNameFormatter = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: 'short',
});

export function computePeriodMetrics(points: FinancialChartPoint[]): PeriodMetrics {
  if (!points.length) {
    return {
      days: 0,
      sales: 0,
      expenses: 0,
      balance: 0,
      avgSales: 0,
      avgExpenses: 0,
      netMarginPct: null,
    };
  }

  let sales = 0;
  let expenses = 0;
  let balance = 0;
  let bestSalesDay: PeriodMetrics['bestSalesDay'];
  let highestExpenseDay: PeriodMetrics['highestExpenseDay'];
  let worstBalanceDay: PeriodMetrics['worstBalanceDay'];
  let topSalesValue = 0;
  let topExpenseValue = 0;
  let lowestBalance = Number.POSITIVE_INFINITY;

  const salesValues: number[] = [];

  points.forEach(point => {
    sales += point.sales;
    expenses += point.expenses;
    balance += point.balance;
    salesValues.push(point.sales);

    if (point.sales > topSalesValue) {
      topSalesValue = point.sales;
      bestSalesDay = { date: point.date, value: point.sales };
    }

    if (point.expenses > topExpenseValue) {
      topExpenseValue = point.expenses;
      highestExpenseDay = { date: point.date, value: point.expenses };
    }

    if (point.balance < lowestBalance) {
      lowestBalance = point.balance;
      worstBalanceDay = { date: point.date, value: point.balance };
    }
  });

  const days = points.length;
  const avgSales = days > 0 ? sales / days : 0;
  const avgExpenses = days > 0 ? expenses / days : 0;
  const netMarginPct = sales > 0 ? (balance / sales) * 100 : null;

  let stdSales: number | undefined;
  let cvSales: number | undefined;
  if (salesValues.length >= 2) {
    const mean = avgSales;
    const variance =
      salesValues.reduce((acc, value) => acc + (value - mean) ** 2, 0) / salesValues.length;
    stdSales = Math.sqrt(variance);
    if (mean > 0 && stdSales > 0) {
      cvSales = stdSales / mean;
    }
  }

  const shareTopDay = sales > 0 && topSalesValue > 0 ? topSalesValue / sales : undefined;

  return {
    days,
    sales,
    expenses,
    balance,
    avgSales,
    avgExpenses,
    netMarginPct,
    bestSalesDay,
    highestExpenseDay,
    worstBalanceDay,
    stdSales,
    cvSales,
    shareTopDay,
  };
}

export function computePrevWindow(
  allPoints: FinancialChartPoint[],
  visiblePoints: FinancialChartPoint[],
): FinancialChartPoint[] | null {
  if (!visiblePoints.length || !allPoints.length) {
    return null;
  }

  const windowSize = visiblePoints.length;
  const firstVisible = visiblePoints[0].date.getTime();
  const firstIndex = allPoints.findIndex(point => point.date.getTime() === firstVisible);

  if (firstIndex === -1) {
    return null;
  }

  const start = firstIndex - windowSize;
  if (start < 0) {
    return null;
  }

  const prevWindow = allPoints.slice(start, firstIndex);
  return prevWindow.length === windowSize ? prevWindow : null;
}

export function percentChange(curr: number, prev: number): number | null {
  if (prev === 0 || prev === null || Number.isNaN(prev)) {
    return null;
  }

  return ((curr - prev) / prev) * 100;
}

function formatDay(date: Date): string {
  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
  });
}

function describePercentChange(value: number | null): string {
  if (value === null || Number.isNaN(value)) {
    return '—';
  }

  const formatted = value >= 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
  return formatted.replace('.', ',');
}

export function buildFinancialInsights(
  curr: FinancialChartPoint[],
  prev?: FinancialChartPoint[],
): string[] {
  if (!curr.length) {
    return [];
  }

  const insights: string[] = [];
  const currMetrics = computePeriodMetrics(curr);
  const prevMetrics = prev?.length ? computePeriodMetrics(prev) : null;

  // Trend detection for historical balance
  if (curr.length > 1) {
    let steadyIncreases = 0;
    for (let index = 1; index < curr.length; index += 1) {
      if (curr[index].historicalBalance >= curr[index - 1].historicalBalance) {
        steadyIncreases += 1;
      }
    }
    const ratio = steadyIncreases / (curr.length - 1);
    if (ratio >= 0.7) {
      const last = curr[curr.length - 1];
      insights.push(
        `El balance acumulado presenta tendencia ascendente sostenida en ${steadyIncreases} de los últimos ${curr.length - 1} días, alcanzando ${formatCOP(Math.round(last.historicalBalance))}.`,
      );
    }
  }

  if (currMetrics.bestSalesDay) {
    insights.push(
      `El mejor día de ventas fue ${formatDay(currMetrics.bestSalesDay.date)} con ${formatCOP(Math.round(currMetrics.bestSalesDay.value))}.`,
    );
  }

  if (currMetrics.worstBalanceDay) {
    insights.push(
      `El día con peor balance fue ${formatDay(currMetrics.worstBalanceDay.date)} con ${formatCOP(Math.round(currMetrics.worstBalanceDay.value))}.`,
    );
  }

  const costPressureDays = curr.filter(point => {
    if (point.sales <= 0) {
      return false;
    }
    return point.expenses / point.sales >= COST_PRESSURE_THRESHOLD;
  });

  if (costPressureDays.length >= 2) {
    insights.push(
      `Los gastos superaron el ${percentFormatter.format(COST_PRESSURE_THRESHOLD)} de las ventas en ${costPressureDays.length} días, sugiere revisar insumos críticos.`,
    );
  }

  if (prevMetrics) {
    const salesDelta = percentChange(currMetrics.sales, prevMetrics.sales);
    const marginDelta =
      currMetrics.netMarginPct !== null && prevMetrics.netMarginPct !== null
        ? currMetrics.netMarginPct - prevMetrics.netMarginPct
        : null;

    const salesText = describePercentChange(salesDelta);
    const marginText =
      marginDelta === null
        ? '—'
        : `${marginDelta >= 0 ? '+' : ''}${marginDelta.toFixed(1).replace('.', ',')} pp`;

    if (salesDelta !== null || marginDelta !== null) {
      insights.push(
        `Frente al periodo anterior, las ventas ${salesDelta === null ? 'se mantuvieron' : salesDelta >= 0 ? 'crecieron' : 'cayeron'} ${salesText} y el margen neto ${marginDelta === null ? 'no tuvo variación relevante' : marginDelta >= 0 ? `mejoró ${marginText}` : `retrocedió ${marginText}`}.`,
      );
    }
  }

  if (curr.length >= 5) {
    const lastDate = curr[curr.length - 1].date;
    const daysInMonth = new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, 0).getDate();
    const projectedSales = currMetrics.avgSales * daysInMonth;
    insights.push(
      `Con el ritmo actual, las ventas proyectadas al cierre de mes serían ${formatCOP(Math.round(projectedSales))} (estimación lineal).`,
    );
  }

  if (currMetrics.shareTopDay && currMetrics.shareTopDay > 0.35) {
    insights.push('Diversifica promociones para reducir la dependencia del día pico de ventas.');
  } else {
    insights.push('Mantén acciones comerciales enfocadas en replicar los días más rentables.');
  }

  return insights.slice(0, 5);
}

export function isCurrentMonthRange(points: FinancialChartPoint[]): boolean {
  if (!points.length) {
    return false;
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return points.every(point => {
    const date = point.date;
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
}

export function describePointTooltip(
  point: FinancialChartPoint,
  totalSales: number,
): string[] {
  const dayShare = totalSales > 0 ? (point.sales / totalSales) : 0;
  const lines = [
    `${monthNameFormatter.format(point.date)} → Ventas ${formatCOP(Math.round(point.sales))}`,
    `Gastos ${formatCOP(Math.round(point.expenses))}`,
    `Balance diario ${formatCOP(Math.round(point.balance))}`,
    `Balance histórico ${formatCOP(Math.round(point.historicalBalance))}`,
  ];

  if (dayShare > 0) {
    lines.push(`Aporta ${decimalPercentFormatter.format(dayShare * 100)}% del periodo`);
  }

  return lines;
}

export function getCostPressureThreshold(): number {
  return COST_PRESSURE_THRESHOLD;
}
