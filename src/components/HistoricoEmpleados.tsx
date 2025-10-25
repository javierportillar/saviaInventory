import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Clock, RefreshCcw, Save, RotateCcw, AlertTriangle, CheckCircle2, Users, Wallet } from 'lucide-react';
import { Empleado, WeeklyHours, WeeklySchedule, DayKey, EmployeeShift } from '../types';
import dataService from '../lib/dataService';
import { COLORS } from '../data/menu';
import {
  DAY_ORDER,
  DAY_LABELS,
  ensureSchedule,
  buildWeeklyHoursFromBase,
  sumWeeklyHours,
  formatDifference,
  formatHours,
  getCurrentWeekKey,
  formatWeekRange,
  getStartOfWeek
} from '../utils/employeeHours';
import { formatCOP, formatDateInputValue, formatSqlTime } from '../utils/format';

interface SaveState {
  status: 'idle' | 'saving' | 'success' | 'error';
  message?: string;
}

type WeeklyRanges = Partial<Record<DayKey, string>>;

const weeklyHoursEqual = (a: WeeklyHours, b: WeeklyHours): boolean =>
  DAY_ORDER.every(day => Math.abs((a[day] ?? 0) - (b[day] ?? 0)) < 0.01);

const cloneWeeklyHours = (source: WeeklyHours): WeeklyHours => {
  const clone = {} as WeeklyHours;
  DAY_ORDER.forEach(day => {
    clone[day] = Number(source[day]) || 0;
  });
  return clone;
};

const BASE_SALARY = 1_423_500;
const HOURS_PER_MONTH = 220;
const STANDARD_WEEKLY_HOURS = 44;
const TRANSPORT_ALLOWANCE = 200_000;
const HOURLY_RATE = BASE_SALARY / HOURS_PER_MONTH;
const OVERTIME_RATE = HOURLY_RATE * 1.25;
const TRANSPORT_DAILY_RATE = TRANSPORT_ALLOWANCE / 30;

const roundPesos = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.round(value);
};

// Parses a single 12h/24h time string ("7:30 pm" or "19:30") into decimal hours.
const parseTimeComponent = (value: string): number | null => {
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  const periodMatch = normalized.match(/\b(am|pm)\b/);
  const period = periodMatch ? periodMatch[1] : null;
  const numericPart = normalized.replace(/\b(am|pm)\b/g, '').trim();
  const timeMatch = numericPart.match(/^(\d{1,2})(?::(\d{1,2}))?$/);

  if (!timeMatch) {
    return null;
  }

  let hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2] ?? '0');

  if (Number.isNaN(hours) || Number.isNaN(minutes) || minutes >= 60) {
    return null;
  }

  if (period) {
    if (hours === 12) {
      hours = period === 'am' ? 0 : 12;
    } else if (period === 'pm') {
      hours += 12;
    }
  } else if (hours > 23) {
    return null;
  }

  return hours + minutes / 60;
};

// Converts a time range like "10:00 am - 7:30 pm" into the duration in hours.
const parseTimeRangeToHours = (value: string): number | null => {
  if (!value) {
    return null;
  }

  const sanitized = value.replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();
  const parts = sanitized.split(/\s*-\s*/);

  if (parts.length !== 2) {
    return null;
  }

  const [startInput, endInput] = parts;
  const usesPeriod = /\b(am|pm)\b/i.test(startInput) && /\b(am|pm)\b/i.test(endInput);
  const start = parseTimeComponent(startInput);
  const end = parseTimeComponent(endInput);

  if (start === null || end === null) {
    return null;
  }

  let diff = end - start;

  if (diff < 0) {
    if (usesPeriod) {
      diff += 24;
    } else {
      return null;
    }
  }

  if (diff <= 0 || diff > 24) {
    return null;
  }

  return Math.round(diff * 100) / 100;
};

const parseHoursInput = (value: string): number | null => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const rangeHours = parseTimeRangeToHours(trimmed);
  if (rangeHours !== null) {
    return rangeHours;
  }

  const numeric = Number(trimmed.replace(',', '.'));
  if (!Number.isFinite(numeric) || Number.isNaN(numeric)) {
    return null;
  }

  return Math.round(Math.max(0, numeric) * 100) / 100;
};

const calculateWeeklyPayment = (hours: WeeklyHours) => {
  const totalHours = sumWeeklyHours(hours);
  const regularHours = Math.min(totalHours, STANDARD_WEEKLY_HOURS);
  const overtimeHours = Math.max(0, totalHours - STANDARD_WEEKLY_HOURS);
  const basePay = roundPesos(regularHours * HOURLY_RATE);
  const overtimePay = roundPesos(overtimeHours * OVERTIME_RATE);
  const daysWorked = DAY_ORDER.reduce((count, day) => {
    const workedHours = Number(hours[day] ?? 0);
    return workedHours > 0 ? count + 1 : count;
  }, 0);
  const transport = roundPesos(daysWorked * TRANSPORT_DAILY_RATE);
  const totalPay = basePay + overtimePay + transport;

  return {
    totalHours,
    regularHours,
    overtimeHours,
    basePay,
    overtimePay,
    transport,
    totalPay,
    daysWorked
  };
};

export function HistoricoEmpleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [baseSchedules, setBaseSchedules] = useState<Record<string, WeeklySchedule>>({});
  const [weeklyHours, setWeeklyHours] = useState<Record<string, WeeklyHours>>({});
  const [weeklyShiftDetails, setWeeklyShiftDetails] = useState<Record<string, Record<DayKey, EmployeeShift | null>>>({});
  const [selectedWeek, setSelectedWeek] = useState<string>(getCurrentWeekKey());
  const [editedHours, setEditedHours] = useState<Record<string, WeeklyHours>>({});
  const [editedRanges, setEditedRanges] = useState<Record<string, WeeklyRanges>>({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [weekLoading, setWeekLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<Record<string, SaveState>>({});
  const timeoutsRef = useRef<Record<string, number>>({});
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const clearRowTimeout = useCallback((empleadoId: string) => {
    const timeoutId = timeoutsRef.current[empleadoId];
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      delete timeoutsRef.current[empleadoId];
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        setInitialLoading(true);
        const [employeeList, base] = await Promise.all([
          dataService.fetchEmpleados(),
          dataService.fetchEmployeeBaseSchedules()
        ]);

        if (!isMounted) return;

        setEmpleados(employeeList);

        const sanitizedBase: Record<string, WeeklySchedule> = {};
        employeeList.forEach(empleado => {
          const schedule = base?.[empleado.id];
          if (schedule) {
            sanitizedBase[empleado.id] = schedule;
          }
        });
        setBaseSchedules(sanitizedBase);
      } catch (error) {
        console.error('No se pudieron cargar los empleados o los horarios base:', error);
        if (isMounted) {
          setLoadError('No se pudo cargar la información inicial de empleados.');
        }
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    };

    void loadInitialData();

    return () => {
      isMounted = false;
      Object.values(timeoutsRef.current).forEach(id => window.clearTimeout(id));
      timeoutsRef.current = {};
    };
  }, [clearRowTimeout]);

  useEffect(() => {
    if (empleados.length === 0) {
      setWeeklyHours({});
      setEditedHours({});
      setEditedRanges({});
      setSaveState({});
      setWeeklyShiftDetails({});
    }
  }, [empleados]);

  const summarizeShift = useCallback(
    (shift?: EmployeeShift | null) => {
      if (!shift) {
        return 'Sin turno registrado';
      }
      const entrada = formatSqlTime(shift.horaLlegada);
      const salida = shift.horaSalida ? formatSqlTime(shift.horaSalida) : 'pendiente';
      let summary = `Entrada ${entrada} · Salida ${salida}`;
      if (shift.novedad && shift.novedadInicio) {
        summary += shift.novedadFin
          ? ` · Novedad ${formatSqlTime(shift.novedadInicio)}-${formatSqlTime(shift.novedadFin)}`
          : ` · Novedad ${formatSqlTime(shift.novedadInicio)} (en curso)`;
      }
      return summary;
    },
    []
  );

  const buildShiftTooltip = useCallback(
    (shift?: EmployeeShift | null) => {
      if (!shift) {
        return 'Sin turno registrado';
      }
      const lines = [
        `Entrada: ${formatSqlTime(shift.horaLlegada)}`,
        `Salida: ${shift.horaSalida ? formatSqlTime(shift.horaSalida) : 'pendiente'}`,
      ];

      if (shift.novedad && shift.novedadInicio) {
        const novelty = shift.novedadFin
          ? `${formatSqlTime(shift.novedadInicio)} – ${formatSqlTime(shift.novedadFin)}`
          : `${formatSqlTime(shift.novedadInicio)} (en curso)`;
        lines.push(`Novedad: ${novelty}`);
      }

      if (typeof shift.horasTrabajadas === 'number') {
        lines.push(`Horas: ${formatHours(shift.horasTrabajadas)} h`);
      }

      return lines.join('\n');
    },
    []
  );

  const fetchWeekShiftDetails = useCallback(
    async (weekKey: string): Promise<Record<string, Record<DayKey, EmployeeShift | null>>> => {
      if (!weekKey) {
        return {};
      }

      try {
        const weekStart = getStartOfWeek(weekKey);
        const weekEnd = new Date(weekStart.getTime());
        weekEnd.setDate(weekEnd.getDate() + 6);

        const from = formatDateInputValue(new Date(weekStart.getTime()));
        const to = formatDateInputValue(weekEnd);

        const shifts = await dataService.fetchEmployeeShiftsBetween(from, to);

        const map: Record<string, Record<DayKey, EmployeeShift | null>> = {};

        shifts.forEach(shift => {
          const [yearStr, monthStr, dayStr] = shift.fecha.split('-');
          const year = Number(yearStr);
          const monthIndex = Number(monthStr) - 1;
          const day = Number(dayStr);

          if ([year, monthIndex, day].some(value => Number.isNaN(value))) {
            return;
          }

          const shiftDate = new Date(year, monthIndex, day);
          shiftDate.setHours(0, 0, 0, 0);

          const diffDays = Math.floor((shiftDate.getTime() - weekStart.getTime()) / 86_400_000);
          if (diffDays < 0 || diffDays >= DAY_ORDER.length) {
            return;
          }

          const dayKey = DAY_ORDER[diffDays];
          const employeeMap = map[shift.empleadoId] ?? (map[shift.empleadoId] = {} as Record<DayKey, EmployeeShift | null>);
          const existing = employeeMap[dayKey];

          if (!existing) {
            employeeMap[dayKey] = shift;
            return;
          }

          const existingHasExit = Boolean(existing.horaSalida);
          const incomingHasExit = Boolean(shift.horaSalida);
          const existingArrival = existing.horaLlegada ?? '';
          const incomingArrival = shift.horaLlegada ?? '';

          if (!existingHasExit && incomingHasExit) {
            employeeMap[dayKey] = shift;
            return;
          }

          if (incomingArrival >= existingArrival) {
            employeeMap[dayKey] = shift;
          }
        });

        return map;
      } catch (error) {
        console.error('No se pudieron cargar los turnos de la semana:', error);
        return {};
      }
    },
    []
  );

  const loadWeekData = useCallback(
    async (weekKey: string, options: { preserveEdits?: boolean } = {}) => {
      if (!weekKey || !isMountedRef.current) {
        return;
      }

      const { preserveEdits = false } = options;

      if (!preserveEdits) {
        setWeekLoading(true);
        setLoadError(null);
      }

      try {
        const [hoursRecord, shiftRecord] = await Promise.all([
          dataService.fetchEmployeeWeeklyHoursForWeek(weekKey),
          fetchWeekShiftDetails(weekKey),
        ]);

        if (!isMountedRef.current) {
          return;
        }

        setWeeklyHours(hoursRecord);
        setWeeklyShiftDetails(shiftRecord);

        if (!preserveEdits) {
          setEditedHours({});
          setEditedRanges({});
          setSaveState({});
        }
      } catch (error) {
        console.error('No se pudieron cargar las horas de la semana seleccionada:', error);
        if (!preserveEdits && isMountedRef.current) {
          setLoadError('No se pudo cargar la información de la semana.');
          setWeeklyHours({});
          setWeeklyShiftDetails({});
        }
      } finally {
        if (!preserveEdits && isMountedRef.current) {
          setWeekLoading(false);
        }
      }
    },
    [fetchWeekShiftDetails]
  );

  useEffect(() => {
    void loadWeekData(selectedWeek);
  }, [selectedWeek, loadWeekData]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupSubscription = async () => {
      unsubscribe = await dataService.subscribeToEmployeeShifts({
        onChange: () => {
          void loadWeekData(selectedWeek, { preserveEdits: true });
        },
        debounceMs: 400,
      });
    };

    void setupSubscription();

    return () => {
      unsubscribe?.();
    };
  }, [loadWeekData, selectedWeek]);

  const handleWeekChange = (value: string) => {
    setSelectedWeek(value || getCurrentWeekKey());
  };

  const handleHourChange = (empleadoId: string, day: DayKey, value: number, reference: WeeklyHours) => {
    const sanitized = Number.isNaN(value) ? 0 : Math.max(0, value);
    setEditedHours(prev => {
      const current = prev[empleadoId] ? { ...prev[empleadoId] } : cloneWeeklyHours(reference);
      current[day] = sanitized;
      return { ...prev, [empleadoId]: current };
    });
    setSaveState(prev => ({
      ...prev,
      [empleadoId]: { status: 'idle' }
    }));
    clearRowTimeout(empleadoId);
  };

  const handleRangeChange = (empleadoId: string, day: DayKey, value: string) => {
    setEditedRanges(prev => {
      const next = { ...prev };
      const current = { ...(next[empleadoId] ?? {}) };
      current[day] = value;
      next[empleadoId] = current;
      return next;
    });
    setSaveState(prev => ({
      ...prev,
      [empleadoId]: { status: 'idle' }
    }));
    clearRowTimeout(empleadoId);
  };

  const handleRangeBlur = (
    empleadoId: string,
    day: DayKey,
    rawValue: string,
    reference: WeeklyHours,
    stored: WeeklyHours
  ) => {
    const trimmed = rawValue.trim();

    setEditedRanges(prev => {
      const next = { ...prev };
      const current = { ...(next[empleadoId] ?? {}) };

      if (trimmed) {
        current[day] = trimmed;
        next[empleadoId] = current;
      } else {
        delete current[day];
        if (Object.keys(current).length > 0) {
          next[empleadoId] = current;
        } else {
          delete next[empleadoId];
        }
      }

      return next;
    });

    if (!trimmed) {
      handleHourChange(empleadoId, day, stored[day] ?? 0, reference);
      return;
    }

    const parsed = parseHoursInput(trimmed);
    if (parsed !== null) {
      handleHourChange(empleadoId, day, parsed, reference);
    }
  };

  const handleResetToBase = (empleadoId: string, baseHours: WeeklyHours) => {
    setEditedHours(prev => ({
      ...prev,
      [empleadoId]: cloneWeeklyHours(baseHours)
    }));
    setEditedRanges(prev => {
      const next = { ...prev };
      delete next[empleadoId];
      return next;
    });
    setSaveState(prev => ({
      ...prev,
      [empleadoId]: { status: 'idle' }
    }));
    clearRowTimeout(empleadoId);
  };

  const handleDiscardChanges = (empleadoId: string) => {
    setEditedHours(prev => {
      if (!prev[empleadoId]) {
        return prev;
      }
      const next = { ...prev };
      delete next[empleadoId];
      return next;
    });
    setEditedRanges(prev => {
      const next = { ...prev };
      delete next[empleadoId];
      return next;
    });
    setSaveState(prev => ({
      ...prev,
      [empleadoId]: { status: 'idle' }
    }));
    clearRowTimeout(empleadoId);
  };

  const handleSave = async (empleadoId: string, hours: WeeklyHours) => {
    const sanitized = cloneWeeklyHours(hours);
    DAY_ORDER.forEach(day => {
      sanitized[day] = Math.max(0, Number(sanitized[day]) || 0);
    });

    setSaveState(prev => ({
      ...prev,
      [empleadoId]: { status: 'saving' }
    }));

    try {
      await dataService.saveEmployeeWeeklyHours(empleadoId, selectedWeek, sanitized);
      setWeeklyHours(prev => ({
        ...prev,
        [empleadoId]: sanitized
      }));
      setEditedHours(prev => {
        const next = { ...prev };
        delete next[empleadoId];
        return next;
      });
      setEditedRanges(prev => {
        const next = { ...prev };
        delete next[empleadoId];
        return next;
      });
      setSaveState(prev => ({
        ...prev,
        [empleadoId]: { status: 'success', message: 'Cambios guardados' }
      }));

      clearRowTimeout(empleadoId);
      timeoutsRef.current[empleadoId] = window.setTimeout(() => {
        setSaveState(current => ({
          ...current,
          [empleadoId]: { status: 'idle' }
        }));
        delete timeoutsRef.current[empleadoId];
      }, 3500);
    } catch (error) {
      console.error('No se pudieron guardar las horas del empleado:', error);
      setSaveState(prev => ({
        ...prev,
        [empleadoId]: { status: 'error', message: 'Error guardando los cambios' }
      }));
    }
  };

  const summary = useMemo(() => {
    if (empleados.length === 0) {
      return { totalBase: 0, totalWorked: 0, diff: 0, totalPay: 0 };
    }

    let totalBase = 0;
    let totalWorked = 0;
    let totalPay = 0;

    empleados.forEach(empleado => {
      const baseSchedule = ensureSchedule(empleado, baseSchedules[empleado.id]);
      const baseHours = buildWeeklyHoursFromBase(baseSchedule);
      const storedHours = weeklyHours[empleado.id] ?? baseHours;
      const pending = editedHours[empleado.id];
      const effective = pending ?? storedHours;
      totalBase += sumWeeklyHours(baseHours);
      totalWorked += sumWeeklyHours(effective);
      totalPay += calculateWeeklyPayment(effective).totalPay;
    });

    return {
      totalBase,
      totalWorked,
      diff: totalWorked - totalBase,
      totalPay
    };
  }, [empleados, baseSchedules, weeklyHours, editedHours]);

  const hasEmployees = empleados.length > 0;

  if (initialLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <RefreshCcw className="animate-spin" size={32} />
          <span>Cargando empleados…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Histórico semanal de empleados</h2>
          <p className="text-sm text-gray-500">
            Consulta y ajusta las horas registradas por semana para todo el equipo.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          <label className="text-sm font-medium text-gray-600" htmlFor="week-picker">
            Semana seleccionada
          </label>
          <div className="flex items-center gap-2">
            <input
              id="week-picker"
              type="week"
              value={selectedWeek}
              onChange={(event) => handleWeekChange(event.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2"
              style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
            />
            <span className="text-xs text-gray-500">
              {formatWeekRange(selectedWeek)}
            </span>
          </div>
        </div>
      </div>

      {loadError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} />
            <span>{loadError}</span>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-gray-100 bg-white/70 p-4 shadow-sm">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Total empleados</span>
            <UsersBadge count={empleados.length} />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-800">{empleados.length}</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white/70 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CalendarDays size={18} />
            <span>Horas base estimadas</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-800">{formatHours(summary.totalBase)} h</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white/70 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={18} />
            <span>Horas registradas</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-800">{formatHours(summary.totalWorked)} h</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white/70 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <RefreshCcw size={18} />
            <span>Variación vs base</span>
          </div>
          <p
            className={`mt-2 text-2xl font-bold ${
              Math.abs(summary.diff) < 0.01
                ? 'text-gray-600'
                : summary.diff > 0
                  ? 'text-green-600'
                  : 'text-orange-500'
            }`}
          >
            {formatDifference(summary.diff)}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white/70 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Wallet size={18} />
            <span>Pago semanal estimado</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-800">{formatCOP(summary.totalPay)}</p>
        </div>
      </div>

      {weekLoading && (
        <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-sm text-blue-700">
          <RefreshCcw className="h-4 w-4 animate-spin" />
          <span>Cargando información de la semana seleccionada…</span>
        </div>
      )}

      {!hasEmployees && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 p-12 text-center text-gray-500">
          No hay empleados registrados todavía.
        </div>
      )}

      {hasEmployees && (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Empleado</th>
                {DAY_ORDER.map(day => (
                  <th key={day} className="px-3 py-3 text-center font-semibold">
                    {DAY_LABELS[day]}
                  </th>
                ))}
                <th className="px-4 py-3 text-center font-semibold">Total base</th>
                <th className="px-4 py-3 text-center font-semibold">Registrado</th>
                <th className="px-4 py-3 text-center font-semibold">Variación</th>
                <th className="px-4 py-3 text-center font-semibold">Pago semanal</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {empleados.map(empleado => {
                const baseSchedule = ensureSchedule(empleado, baseSchedules[empleado.id]);
                const baseHours = buildWeeklyHoursFromBase(baseSchedule);
                const storedHours = weeklyHours[empleado.id] ?? baseHours;
                const pending = editedHours[empleado.id];
                const workingHours = pending ?? storedHours;
                const totalBase = sumWeeklyHours(baseHours);
                const totalWorked = sumWeeklyHours(workingHours);
                const variation = totalWorked - totalBase;
                const hasPending = pending ? !weeklyHoursEqual(pending, storedHours) : false;
                const rowSaveState = saveState[empleado.id]?.status ?? 'idle';
                const rowMessage = saveState[empleado.id]?.message;
                const payment = calculateWeeklyPayment(workingHours);
                const hasOvertime = payment.overtimeHours > 0.01;
                const canSave = hasPending && rowSaveState !== 'saving';

                return (
                  <tr key={empleado.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">{empleado.nombre}</span>
                        <span className="text-xs text-gray-500">
                          Jornada base: {empleado.dias_semana} días • {empleado.horas_dia} h/día
                        </span>
                      </div>
                    </td>
                    {DAY_ORDER.map(day => {
                      const reference = pending ?? storedHours;
                      const rangeValue = editedRanges[empleado.id]?.[day] ?? '';
                      const trimmedRange = rangeValue.trim();
                      const parsedPreview = trimmedRange ? parseHoursInput(trimmedRange) : null;
                      const isInvalidRange = Boolean(trimmedRange) && parsedPreview === null;
                      const ringColor = isInvalidRange ? '#F87171' : COLORS.accent;
                      const shift = weeklyShiftDetails[empleado.id]?.[day];
                      const shiftSummary = summarizeShift(shift);
                      const shiftTooltip = buildShiftTooltip(shift);
                      const hasShift = Boolean(shift);

                      return (
                        <td key={day} className="px-3 py-3 text-center align-top">
                          <div className="flex flex-col items-center gap-1.5" title={shiftTooltip}>
                            <input
                              type="text"
                              value={rangeValue}
                              placeholder="ej. 10:00 am - 7:30 pm"
                              onChange={(event) => handleRangeChange(empleado.id, day, event.target.value)}
                              onBlur={(event) =>
                                handleRangeBlur(empleado.id, day, event.target.value, reference, storedHours)
                              }
                              onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                  event.currentTarget.blur();
                                }
                              }}
                              autoComplete="off"
                              className={`w-40 rounded-lg border px-2 py-1 text-sm focus:border-transparent focus:ring-2 ${
                                isInvalidRange
                                  ? 'border-red-300 text-red-700 placeholder:text-red-300'
                                  : 'border-gray-300'
                              }`}
                              style={{ '--tw-ring-color': ringColor } as React.CSSProperties}
                            />
                            <span
                              className={`text-[11px] ${hasShift ? 'text-gray-500' : 'text-gray-400'}`}
                            >
                              {shiftSummary}
                            </span>
                            <span className="text-[11px] text-gray-500">
                              Calculadas: {formatHours(workingHours[day] ?? 0)} h
                            </span>
                            <span className="text-[11px] text-gray-400">
                              Base: {formatHours(baseHours[day] ?? 0)} h
                            </span>
                            {isInvalidRange && (
                              <span className="text-[11px] text-red-500">
                                Usa formato "10:00 am - 7:30 pm"
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-4 py-4 text-center font-medium text-gray-600">
                      {formatHours(totalBase)} h
                    </td>
                    <td className="px-4 py-4 text-center font-semibold text-gray-800">
                      {formatHours(totalWorked)} h
                    </td>
                    <td className="px-4 py-4 text-center font-medium">
                      <span
                        className={
                          Math.abs(variation) < 0.01
                            ? 'text-gray-500'
                            : variation > 0
                              ? 'text-green-600'
                              : 'text-orange-500'
                        }
                      >
                        {formatDifference(variation)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center align-top text-gray-700">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-base font-semibold text-gray-800">
                          {formatCOP(payment.totalPay)}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Base: {formatCOP(payment.basePay)}
                          {hasOvertime && ` · Extras: ${formatCOP(payment.overtimePay)}`}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Aux. transporte: {formatCOP(payment.transport)}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {formatHours(payment.regularHours)} h base
                          {hasOvertime && ` · ${formatHours(payment.overtimeHours)} h extra`}
                          {' · '}
                          {payment.daysWorked} día{payment.daysWorked === 1 ? '' : 's'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleResetToBase(empleado.id, baseHours)}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
                          >
                            <RotateCcw size={14} />
                            Base
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDiscardChanges(empleado.id)}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
                            disabled={!pending}
                          >
                            Limpiar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSave(empleado.id, workingHours)}
                            disabled={!canSave}
                            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition ${
                              canSave ? 'hover:scale-105' : 'cursor-not-allowed opacity-70'
                            }`}
                            style={{ backgroundColor: canSave ? COLORS.dark : '#CBD5F5' }}
                          >
                            {rowSaveState === 'saving' ? (
                              <RefreshCcw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save size={14} />
                            )}
                            Guardar
                          </button>
                        </div>
                        {rowSaveState === 'success' && rowMessage && (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle2 size={14} />
                            <span>{rowMessage}</span>
                          </div>
                        )}
                        {rowSaveState === 'error' && rowMessage && (
                          <div className="flex items-center gap-1 text-xs text-red-600">
                            <AlertTriangle size={14} />
                            <span>{rowMessage}</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface UsersBadgeProps {
  count: number;
}

function UsersBadge({ count }: UsersBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
    >
      <Users size={14} />
      {count}
    </span>
  );
}
