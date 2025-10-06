import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Clock, RefreshCcw, Save, RotateCcw, AlertTriangle, CheckCircle2, Users } from 'lucide-react';
import { Empleado, WeeklyHours, WeeklySchedule, DayKey } from '../types';
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
  formatWeekRange
} from '../utils/employeeHours';

interface SaveState {
  status: 'idle' | 'saving' | 'success' | 'error';
  message?: string;
}

const weeklyHoursEqual = (a: WeeklyHours, b: WeeklyHours): boolean =>
  DAY_ORDER.every(day => Math.abs((a[day] ?? 0) - (b[day] ?? 0)) < 0.01);

const cloneWeeklyHours = (source: WeeklyHours): WeeklyHours => {
  const clone = {} as WeeklyHours;
  DAY_ORDER.forEach(day => {
    clone[day] = Number(source[day]) || 0;
  });
  return clone;
};

export function HistoricoEmpleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [baseSchedules, setBaseSchedules] = useState<Record<string, WeeklySchedule>>({});
  const [weeklyHours, setWeeklyHours] = useState<Record<string, WeeklyHours>>({});
  const [selectedWeek, setSelectedWeek] = useState<string>(getCurrentWeekKey());
  const [editedHours, setEditedHours] = useState<Record<string, WeeklyHours>>({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [weekLoading, setWeekLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<Record<string, SaveState>>({});
  const timeoutsRef = useRef<Record<string, number>>({});

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
    let isMounted = true;

    const loadWeek = async () => {
      if (!selectedWeek) {
        return;
      }

      try {
        setWeekLoading(true);
        setLoadError(null);
        const records = await dataService.fetchEmployeeWeeklyHoursForWeek(selectedWeek);
        if (!isMounted) return;
        setWeeklyHours(records);
        setEditedHours({});
        setSaveState({});
      } catch (error) {
        console.error('No se pudieron cargar las horas de la semana seleccionada:', error);
        if (isMounted) {
          setLoadError('No se pudo cargar la información de la semana.');
          setWeeklyHours({});
        }
      } finally {
        if (isMounted) {
          setWeekLoading(false);
        }
      }
    };

    void loadWeek();

    return () => {
      isMounted = false;
    };
  }, [selectedWeek]);

  useEffect(() => {
    if (empleados.length === 0) {
      setWeeklyHours({});
      setEditedHours({});
      setSaveState({});
    }
  }, [empleados]);

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

  const handleResetToBase = (empleadoId: string, baseHours: WeeklyHours) => {
    setEditedHours(prev => ({
      ...prev,
      [empleadoId]: cloneWeeklyHours(baseHours)
    }));
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
      return { totalBase: 0, totalWorked: 0, diff: 0 };
    }

    let totalBase = 0;
    let totalWorked = 0;

    empleados.forEach(empleado => {
      const baseSchedule = ensureSchedule(empleado, baseSchedules[empleado.id]);
      const baseHours = buildWeeklyHoursFromBase(baseSchedule);
      const storedHours = weeklyHours[empleado.id] ?? baseHours;
      const pending = editedHours[empleado.id];
      const effective = pending ?? storedHours;
      totalBase += sumWeeklyHours(baseHours);
      totalWorked += sumWeeklyHours(effective);
    });

    return {
      totalBase,
      totalWorked,
      diff: totalWorked - totalBase
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                const canSave = hasPending && rowSaveState !== 'saving';
                const rowSaveState = saveState[empleado.id]?.status ?? 'idle';
                const rowMessage = saveState[empleado.id]?.message;

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
                      return (
                        <td key={day} className="px-3 py-3 text-center align-top">
                          <div className="flex flex-col items-center gap-1">
                            <input
                              type="number"
                              min={0}
                              step={0.5}
                              value={workingHours[day] ?? 0}
                              onChange={(event) =>
                                handleHourChange(empleado.id, day, parseFloat(event.target.value), reference)
                              }
                              className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-transparent focus:ring-2"
                              style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                            />
                            <span className="text-[11px] text-gray-400">Base: {formatHours(baseHours[day] ?? 0)} h</span>
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
