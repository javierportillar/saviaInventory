import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { NOVEDAD_CATEGORY_STYLES, NovedadCategoria } from '../data/novedades';
import dataService from '../lib/dataService';
import { Gasto, Order, WeeklyHours } from '../types';
import { formatCOP } from '../utils/format';
import { calculateIsoWeekKey, DAY_ORDER, getStartOfWeek } from '../utils/employeeHours';

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getMonthLabel(date: Date) {
  const monthNames = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

function addMonths(baseDate: Date, months: number) {
  return new Date(baseDate.getFullYear(), baseDate.getMonth() + months, 1);
}

function generateCalendarDays(currentDate: Date) {
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const startDay = (startOfMonth.getDay() + 6) % 7; // Iniciar la semana en lunes
  const endDay = (endOfMonth.getDay() + 6) % 7;

  const startDate = new Date(startOfMonth);
  startDate.setDate(startOfMonth.getDate() - startDay);

  const endDate = new Date(endOfMonth);
  endDate.setDate(endOfMonth.getDate() + (6 - endDay));

  const days: Date[] = [];
  const iterator = new Date(startDate);

  while (iterator <= endDate) {
    days.push(new Date(iterator));
    iterator.setDate(iterator.getDate() + 1);
  }

  return days;
}

const weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const CATEGORY_ORDER: Record<NovedadCategoria, number> = {
  gastos: 0,
  horarios: 1,
  ventas: 2,
};

type WeeklyHoursByWeek = Record<string, Record<string, WeeklyHours>>;

interface NovedadesProps {
  onNavigateToComandas?: (dateKey: string) => void;
  onNavigateToGastos?: (dateKey: string) => void;
}

interface DaySummary {
  ventasTotal: number;
  ventasCount: number;
  gastosTotal: number;
  gastosCount: number;
  horariosCount: number;
}

export function Novedades({ onNavigateToComandas, onNavigateToGastos }: NovedadesProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [gastosData, setGastosData] = useState<Gasto[]>([]);
  const [horariosPorSemana, setHorariosPorSemana] = useState<WeeklyHoursByWeek>({});
  const loadedWeeksRef = useRef<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const days = useMemo(() => generateCalendarDays(currentMonth), [currentMonth]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const [ordersData, gastos] = await Promise.all([
          dataService.fetchOrders(),
          dataService.fetchGastos(),
        ]);

        if (!isMounted) {
          return;
        }

        setOrders(ordersData);
        setGastosData(gastos);
        setError(null);
      } catch (err) {
        console.error('[Novedades] No se pudieron cargar todas las novedades.', err);
        if (isMounted) {
          setError('No se pudieron cargar todas las novedades.');
        }
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

  useEffect(() => {
    if (days.length === 0) {
      return;
    }

    const weekKeys = Array.from(new Set(days.map((day) => calculateIsoWeekKey(day))));

    weekKeys.forEach((weekKey) => {
      if (!weekKey || loadedWeeksRef.current.has(weekKey)) {
        return;
      }

      loadedWeeksRef.current.add(weekKey);

      dataService
        .fetchEmployeeWeeklyHoursForWeek(weekKey)
        .then((records) => {
          setHorariosPorSemana((prev) => ({ ...prev, [weekKey]: records }));
        })
        .catch((err) => {
          console.error(`[Novedades] Error cargando horas semanales para ${weekKey}.`, err);
        });
    });
  }, [days]);

  const summariesByDate = useMemo(() => {
    const summaries: Record<string, DaySummary> = {};

    const ensureSummary = (dateKey: string) => {
      if (!summaries[dateKey]) {
        summaries[dateKey] = {
          ventasTotal: 0,
          ventasCount: 0,
          gastosTotal: 0,
          gastosCount: 0,
          horariosCount: 0,
        };
      }
      return summaries[dateKey];
    };

    orders.forEach((order) => {
      const timestamp = order.timestamp instanceof Date ? order.timestamp : new Date(order.timestamp);
      if (Number.isNaN(timestamp.getTime())) {
        return;
      }

      const fecha = formatDateKey(timestamp);
      const summary = ensureSummary(fecha);
      const total = Math.max(0, Math.round(Number(order.total) || 0));
      summary.ventasTotal += total;
      summary.ventasCount += 1;
    });

    gastosData.forEach((gasto) => {
      const fechaValue = gasto.fecha instanceof Date ? gasto.fecha : new Date(gasto.fecha);
      if (Number.isNaN(fechaValue.getTime())) {
        return;
      }

      const fecha = formatDateKey(fechaValue);
      const summary = ensureSummary(fecha);
      const monto = Math.max(0, Math.round(Number(gasto.monto) || 0));
      summary.gastosTotal += monto;
      summary.gastosCount += 1;
    });

    Object.entries(horariosPorSemana).forEach(([weekKey, records]) => {
      if (!records) {
        return;
      }

      const weekStart = getStartOfWeek(weekKey);
      if (Number.isNaN(weekStart.getTime())) {
        return;
      }

      DAY_ORDER.forEach((dayKey, index) => {
        const dayDate = new Date(weekStart);
        dayDate.setDate(weekStart.getDate() + index);
        const fecha = formatDateKey(dayDate);

        Object.values(records).forEach((hours) => {
          const value = Number(hours?.[dayKey]);
          if (!Number.isFinite(value) || value <= 0) {
            return;
          }

          const summary = ensureSummary(fecha);
          summary.horariosCount += 1;
        });
      });
    });

    return summaries;
  }, [gastosData, horariosPorSemana, orders]);

  const todayKey = formatDateKey(new Date());

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="flex flex-col gap-6 pb-8 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gray-900 text-white shadow-sm">
                <CalendarIcon size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Novedades</p>
                <h1 className="text-3xl font-semibold text-gray-900">Calendario de novedades</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentMonth(prev => addMonths(prev, -1))}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-lg font-semibold text-gray-900 capitalize min-w-[140px] text-center">
                {getMonthLabel(currentMonth)}
              </span>
              <button
                type="button"
                onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {Object.entries(NOVEDAD_CATEGORY_STYLES).map(([key, style]) => (
              <div
                key={key}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border ${style.bg} ${style.border}`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                <span className={`text-sm font-medium ${style.text}`}>{style.label}</span>
              </div>
            ))}
          </div>
        </header>

      <div className="pt-8">
        {loading && (
          <p className="mb-4 text-sm text-gray-500">Cargando novedades...</p>
        )}
        {error && !loading && (
          <p className="mb-4 text-sm text-red-500">{error}</p>
        )}
        <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-500 uppercase tracking-wide">
          {weekdays.map(day => (
            <div key={day} className="py-2">
              {day}
            </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-xl overflow-hidden shadow-sm">
            {days.map((day) => {
              const dateKey = formatDateKey(day);
              const daySummary = summariesByDate[dateKey];
              const summaryItems: Array<{ key: NovedadCategoria; label: string; onClick?: () => void }> = [];

              if (daySummary?.ventasCount) {
                summaryItems.push({
                  key: 'ventas',
                  label: `Ventas · ${formatCOP(daySummary.ventasTotal)}`,
                  onClick: onNavigateToComandas
                    ? () => onNavigateToComandas(dateKey)
                    : undefined,
                });
              }

              if (daySummary?.gastosCount) {
                summaryItems.push({
                  key: 'gastos',
                  label: `Gastos · ${formatCOP(daySummary.gastosTotal)}`,
                  onClick: onNavigateToGastos
                    ? () => onNavigateToGastos(dateKey)
                    : undefined,
                });
              }

              if (daySummary?.horariosCount) {
                const count = daySummary.horariosCount;
                summaryItems.push({
                  key: 'horarios',
                  label: `Horarios · ${count} ${count === 1 ? 'novedad' : 'novedades'}`,
                });
              }

              summaryItems.sort(
                (a, b) => CATEGORY_ORDER[a.key] - CATEGORY_ORDER[b.key]
              );

              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isToday = dateKey === todayKey;

              return (
                <div
                  key={dateKey + day.getDate()}
                  className={`bg-white p-3 min-h-[140px] flex flex-col gap-2 transition-colors ${
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  } ${isToday ? 'ring-2 ring-gray-900 ring-offset-2 ring-offset-white' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${isToday ? 'text-gray-900' : ''}`}>
                      {day.getDate()}
                    </span>
                  </div>
                  <div className="flex-1 space-y-2 overflow-hidden">
                    {summaryItems.length === 0 ? (
                      <p className="text-xs text-gray-300 font-medium">Sin novedades</p>
                    ) : (
                      <ul className="space-y-2">
                        {summaryItems.map((item) => {
                          const styles = NOVEDAD_CATEGORY_STYLES[item.key];
                          const content = (
                            <div className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
                              <span className={`text-xs font-semibold ${styles.text} truncate`}>
                                {item.label}
                              </span>
                            </div>
                          );

                          return (
                            <li key={item.key}>
                              {item.onClick ? (
                                <button
                                  type="button"
                                  onClick={item.onClick}
                                  className={`w-full text-left rounded-lg border ${styles.bg} ${styles.border} px-3 py-2 transition-shadow hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900`}
                                >
                                  {content}
                                </button>
                              ) : (
                                <div className={`rounded-lg border ${styles.bg} ${styles.border} px-3 py-2`}>
                                  {content}
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
