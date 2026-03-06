import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Empleado, DayKey, DaySchedule, WeeklySchedule, WeeklyHours, PayrollSettings, User } from '../types';
import {
  Users,
  Edit3,
  Trash2,
  Plus,
  Clock,
  DollarSign,
  CalendarDays,
  RefreshCcw,
  X,
  CreditCard,
  History
} from 'lucide-react';
import { COLORS } from '../data/menu';
import { formatCOP } from '../utils/format';
import {
  DAY_ORDER,
  DAY_LABELS,
  calculateIsoWeekKey,
  getCurrentWeekKey,
  getStartOfWeek,
  formatWeekRange,
  schedulesAreEqual,
  ensureSchedule,
  buildWeeklyHoursFromBase,
  sumWeeklyHours,
  formatHours,
  formatDifference,
  DEFAULT_PAYROLL_SETTINGS,
  normalizePayrollSettings,
  calculateEmployeeWeeklyPayment,
} from '../utils/employeeHours';
import dataService, { EMPLOYEE_CREDIT_UPDATED_EVENT } from '../lib/dataService';
import { HistoricoEmpleados } from './HistoricoEmpleados';

type EmployeeWeeklyRecords = Record<string, WeeklyHours>;
type HistoryState = {
  expanded: boolean;
  loading: boolean;
  loaded: boolean;
  error: string | null;
};

const createHistoryState = (): HistoryState => ({ expanded: false, loading: false, loaded: false, error: null });

const compareWeeksDesc = (a: string, b: string) => getStartOfWeek(b).getTime() - getStartOfWeek(a).getTime();

const toDateInputValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getCurrentQuincenaRange = (): { start: string; end: string } => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  const monthLastDay = new Date(year, month + 1, 0).getDate();
  const start = new Date(year, month, day <= 15 ? 1 : 16);
  const end = new Date(year, month, day <= 15 ? 15 : monthLastDay);
  return { start: toDateInputValue(start), end: toDateInputValue(end) };
};

interface EmpleadosProps {
  user: User;
}

export function Empleados({ user }: EmpleadosProps) {
  const canViewPayroll = ['javier', 'briyith'].includes(user.username?.toLowerCase?.() ?? '');
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    tipo_contrato: 'por_horas' as Empleado['tipo_contrato'],
    horas_dia: 8,
    dias_semana: 5,
    salario_hora: 0,
    salario_mensual: 0,
    incluye_auxilio_transporte: true,
    activo: true
  });
  const [payrollSettings, setPayrollSettings] = useState<PayrollSettings>(DEFAULT_PAYROLL_SETTINGS);
  const [payrollSaving, setPayrollSaving] = useState(false);
  const [employeeHoursHistory, setEmployeeHoursHistory] = useState<Record<string, Record<string, WeeklyHours>>>({});
  const [payrollView, setPayrollView] = useState<'gestion' | 'pago_nomina'>('gestion');
  const [payrollLoading, setPayrollLoading] = useState(false);
  const [quincenaRange, setQuincenaRange] = useState<{ start: string; end: string }>(getCurrentQuincenaRange());
  const [horariosBase, setHorariosBase] = useState<Record<string, WeeklySchedule>>({});
  const [horariosSemanales, setHorariosSemanales] = useState<Record<string, EmployeeWeeklyRecords>>({});
  const [scheduleEmpleado, setScheduleEmpleado] = useState<Empleado | null>(null);
  const [scheduleWeek, setScheduleWeek] = useState<string>(getCurrentWeekKey());
  const [modalBaseSchedule, setModalBaseSchedule] = useState<WeeklySchedule | null>(null);
  const [modalWeeklyHours, setModalWeeklyHours] = useState<WeeklyHours | null>(null);
  const [employeeCredits, setEmployeeCredits] = useState<Record<string, number>>({});
  const [historyState, setHistoryState] = useState<Record<string, HistoryState>>({});
  const loadedWeeksRef = useRef<Set<string>>(new Set());
  const [showGeneralHistory, setShowGeneralHistory] = useState(false);

  const refreshEmployeeCredits = useCallback(async () => {
    try {
      const credits = await dataService.fetchEmployeeCredits();
      const map = credits.reduce<Record<string, number>>((acc, entry) => {
        acc[entry.empleadoId] = Math.max(0, Math.round(entry.total));
        return acc;
      }, {});
      setEmployeeCredits(map);
    } catch (error) {
      console.error('Error cargando créditos de empleados:', error);
    }
  }, []);

  useEffect(() => {
    fetchEmpleados();
    void loadPayrollSettings();
  }, []);

  const loadPayrollSettings = useCallback(async () => {
    try {
      const settings = await dataService.fetchPayrollSettings();
      setPayrollSettings(normalizePayrollSettings(settings));
    } catch (error) {
      console.error('Error cargando configuración de nómina:', error);
    }
  }, []);

  useEffect(() => {
    refreshEmployeeCredits();

    const handleUpdate = () => {
      refreshEmployeeCredits();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(EMPLOYEE_CREDIT_UPDATED_EVENT, handleUpdate);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(EMPLOYEE_CREDIT_UPDATED_EVENT, handleUpdate);
      }
    };
  }, [refreshEmployeeCredits]);

  useEffect(() => {
    if (payrollView !== 'pago_nomina' || empleados.length === 0) {
      return;
    }

    let active = true;
    const loadAllHistory = async () => {
      try {
        setPayrollLoading(true);
        const entries = await Promise.all(
          empleados.map(async (empleado) => {
            const history = await dataService.fetchEmployeeWeeklyHoursHistory(empleado.id);
            return [empleado.id, history] as const;
          })
        );
        if (!active) return;
        const next: Record<string, Record<string, WeeklyHours>> = {};
        entries.forEach(([id, history]) => {
          next[id] = history || {};
        });
        setEmployeeHoursHistory(next);
      } catch (error) {
        console.error('Error cargando historial de horas para nómina:', error);
      } finally {
        if (active) {
          setPayrollLoading(false);
        }
      }
    };

    void loadAllHistory();
    return () => {
      active = false;
    };
  }, [payrollView, empleados]);

  useEffect(() => {
    if (!canViewPayroll && payrollView === 'pago_nomina') {
      setPayrollView('gestion');
    }
  }, [canViewPayroll, payrollView]);

  const loadBaseSchedules = useCallback(async (employeeList: Empleado[]) => {
    try {
      const baseSchedules = await dataService.fetchEmployeeBaseSchedules();
      setHorariosBase(prev => {
        const updated: Record<string, WeeklySchedule> = { ...prev };
        const validIds = new Set(employeeList.map(emp => emp.id));
        let changed = false;

        Object.keys(updated).forEach(id => {
          if (!validIds.has(id)) {
            delete updated[id];
            changed = true;
          }
        });

        employeeList.forEach(empleado => {
          const schedule = baseSchedules[empleado.id];
          if (schedule) {
            if (!updated[empleado.id] || !schedulesAreEqual(updated[empleado.id], schedule)) {
              updated[empleado.id] = schedule;
              changed = true;
            }
          } else if (updated[empleado.id]) {
            delete updated[empleado.id];
            changed = true;
          }
        });

        return changed ? updated : prev;
      });
    } catch (error) {
      console.error('Error cargando horarios base de empleados:', error);
    }
  }, []);

  const loadWeeklyHoursForWeek = useCallback(
    async (weekKey: string): Promise<Record<string, WeeklyHours>> => {
      if (!weekKey) return {};

      if (loadedWeeksRef.current.has(weekKey)) {
        const existing: Record<string, WeeklyHours> = {};
        Object.entries(horariosSemanales).forEach(([empleadoId, weeks]) => {
          const record = weeks?.[weekKey];
          if (record) {
            existing[empleadoId] = record;
          }
        });
        return existing;
      }

      try {
        const records = await dataService.fetchEmployeeWeeklyHoursForWeek(weekKey);
        loadedWeeksRef.current.add(weekKey);
        setHorariosSemanales(prev => {
          const updated: Record<string, EmployeeWeeklyRecords> = { ...prev };
          Object.entries(records).forEach(([empleadoId, hours]) => {
            updated[empleadoId] = { ...(updated[empleadoId] || {}), [weekKey]: hours };
          });
          return updated;
        });
        return records;
      } catch (error) {
        console.error('Error cargando horas semanales:', error);
        return {};
      }
    },
    [horariosSemanales]
  );

  const ensureEmployeeWeekLoaded = useCallback(
    async (empleadoId: string, weekKey: string): Promise<WeeklyHours | undefined> => {
      const existing = horariosSemanales[empleadoId]?.[weekKey];
      if (existing) {
        return existing;
      }

      const records = await loadWeeklyHoursForWeek(weekKey);
      return records[empleadoId] ?? horariosSemanales[empleadoId]?.[weekKey];
    },
    [horariosSemanales, loadWeeklyHoursForWeek]
  );

  useEffect(() => {
    if (empleados.length === 0) return;
    loadBaseSchedules(empleados);
    void loadWeeklyHoursForWeek(getCurrentWeekKey());
  }, [empleados, loadBaseSchedules, loadWeeklyHoursForWeek]);

  useEffect(() => {
    if (empleados.length === 0) return;
    setHorariosBase(prev => {
      const updated: Record<string, WeeklySchedule> = { ...prev };
      const validIds = new Set(empleados.map(emp => emp.id));
      let changed = false;

      Object.keys(updated).forEach(id => {
        if (!validIds.has(id)) {
          delete updated[id];
          changed = true;
        }
      });

      empleados.forEach(empleado => {
        const ensured = ensureSchedule(empleado, updated[empleado.id]);
        if (!updated[empleado.id]) {
          updated[empleado.id] = ensured;
          changed = true;
        } else if (!schedulesAreEqual(updated[empleado.id], ensured)) {
          updated[empleado.id] = ensured;
          changed = true;
        }
      });

      return changed ? updated : prev;
    });
  }, [empleados]);

  useEffect(() => {
    setHorariosSemanales(prev => {
      const updated: Record<string, EmployeeWeeklyRecords> = { ...prev };
      const validIds = new Set(empleados.map(emp => emp.id));
      let changed = false;

      Object.keys(updated).forEach(id => {
        if (!validIds.has(id)) {
          delete updated[id];
          changed = true;
        }
      });

      return changed ? updated : prev;
    });
  }, [empleados]);

  useEffect(() => {
    setHistoryState(prev => {
      const updated = { ...prev };
      const validIds = new Set(empleados.map(emp => emp.id));
      let changed = false;

      Object.keys(updated).forEach(id => {
        if (!validIds.has(id)) {
          delete updated[id];
          changed = true;
        }
      });

      return changed ? updated : prev;
    });
  }, [empleados]);

  const fetchEmpleados = async () => {
    const data = await dataService.fetchEmpleados();
    setEmpleados(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      await dataService.updateEmpleado({ ...formData, id: editingId });
      fetchEmpleados();
      resetForm();
    } else {
      const newEmpleado = { ...formData, id: crypto.randomUUID() };
      await dataService.createEmpleado(newEmpleado);
      fetchEmpleados();
      resetForm();
    }
  };

  const handleEdit = (empleado: Empleado) => {
    setFormData({
      nombre: empleado.nombre,
      telefono: empleado.telefono || '',
      email: empleado.email || '',
      tipo_contrato: empleado.tipo_contrato || 'por_horas',
      horas_dia: empleado.horas_dia,
      dias_semana: empleado.dias_semana,
      salario_hora: empleado.salario_hora,
      salario_mensual: empleado.salario_mensual || 0,
      incluye_auxilio_transporte: empleado.incluye_auxilio_transporte ?? true,
      activo: empleado.activo
    });
    setEditingId(empleado.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
      await dataService.deleteEmpleado(id);
      fetchEmpleados();
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      telefono: '',
      email: '',
      tipo_contrato: 'por_horas',
      horas_dia: 8,
      dias_semana: 5,
      salario_hora: 0,
      salario_mensual: 0,
      incluye_auxilio_transporte: true,
      activo: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getBaseScheduleForEmpleado = (empleado: Empleado) => ensureSchedule(empleado, horariosBase[empleado.id]);

  const getWeeklyHoursForEmpleado = (
    empleadoId: string,
    weekKey: string,
    base: WeeklySchedule,
    override?: WeeklyHours | null
  ): WeeklyHours => {
    const hours = buildWeeklyHoursFromBase(base);
    const weeklyRecords = horariosSemanales[empleadoId];
    const stored = override ?? weeklyRecords?.[weekKey];
    if (!stored) {
      return hours;
    }
    DAY_ORDER.forEach(day => {
      const value = stored[day];
      if (typeof value === 'number' && !Number.isNaN(value)) {
        hours[day] = value;
      }
    });
    return hours;
  };

  const updateHistoryState = useCallback((empleadoId: string, updater: (prev: HistoryState) => HistoryState) => {
    setHistoryState(prev => {
      const previous = prev[empleadoId] ?? createHistoryState();
      return { ...prev, [empleadoId]: updater(previous) };
    });
  }, []);

  const openScheduleModal = async (empleado: Empleado, targetWeek?: string) => {
    const baseSchedule = ensureSchedule(empleado, horariosBase[empleado.id]);
    const currentWeek = targetWeek || getCurrentWeekKey();
    setScheduleEmpleado(empleado);
    setScheduleWeek(currentWeek);
    setModalBaseSchedule(baseSchedule);
    const override = await ensureEmployeeWeekLoaded(empleado.id, currentWeek);
    setModalWeeklyHours(getWeeklyHoursForEmpleado(empleado.id, currentWeek, baseSchedule, override));
  };

  const closeScheduleModal = () => {
    setScheduleEmpleado(null);
    setModalBaseSchedule(null);
    setModalWeeklyHours(null);
  };

  const handleScheduleWeekChange = async (value: string) => {
    if (!value) return;
    setScheduleWeek(value);
    if (!scheduleEmpleado || !modalBaseSchedule) return;
    const empleadoId = scheduleEmpleado.id;
    const baseSchedule = modalBaseSchedule;
    const override = await ensureEmployeeWeekLoaded(empleadoId, value);
    if (!scheduleEmpleado || scheduleEmpleado.id !== empleadoId || !modalBaseSchedule) {
      return;
    }
    setModalWeeklyHours(getWeeklyHoursForEmpleado(empleadoId, value, baseSchedule, override));
  };

  const updateDayInWeeklyHours = (day: DayKey, updater: (previous: number) => number) => {
    setModalWeeklyHours(prev => {
      if (!prev) return prev;
      const updated = { ...prev };
      updated[day] = Math.max(0, updater(prev[day] ?? 0));
      return updated;
    });
  };

  const toggleBaseDay = (day: DayKey) => {
    if (!modalBaseSchedule || !scheduleEmpleado) return;
    setModalBaseSchedule(prev => {
      if (!prev) return prev;
      const previousDay = prev[day];
      const newActive = !previousDay.active;
      const defaultHours = previousDay.hours || scheduleEmpleado.horas_dia;
      const updatedDay: DaySchedule = {
        active: newActive,
        hours: newActive ? defaultHours : 0
      };
      const updated = { ...prev, [day]: updatedDay };
      setModalWeeklyHours(weeklyPrev => {
        if (!weeklyPrev) return weeklyPrev;
        const currentValue = weeklyPrev[day] ?? 0;
        const shouldSync = !previousDay.active || Math.abs(currentValue - previousDay.hours) < 0.01;
        const nextValue = newActive ? (shouldSync ? updatedDay.hours : currentValue) : 0;
        return { ...weeklyPrev, [day]: Math.max(0, nextValue) };
      });
      return updated;
    });
  };

  const updateBaseDayHours = (day: DayKey, value: number) => {
    if (!modalBaseSchedule) return;
    const sanitized = Number.isNaN(value) ? 0 : Math.max(0, value);
    setModalBaseSchedule(prev => {
      if (!prev) return prev;
      const previousDay = prev[day];
      const updatedDay: DaySchedule = {
        active: previousDay.active,
        hours: previousDay.active ? sanitized : 0
      };
      const updated = { ...prev, [day]: updatedDay };
      setModalWeeklyHours(weeklyPrev => {
        if (!weeklyPrev) return weeklyPrev;
        const currentValue = weeklyPrev[day] ?? 0;
        const shouldSync = previousDay.active && Math.abs(currentValue - previousDay.hours) < 0.01;
        if (shouldSync) {
          return { ...weeklyPrev, [day]: sanitized };
        }
        return weeklyPrev;
      });
      return updated;
    });
  };

  const handleWeeklyHoursChange = (day: DayKey, value: number) => {
    const sanitized = Number.isNaN(value) ? 0 : Math.max(0, value);
    setModalWeeklyHours(prev => {
      if (!prev) return prev;
      return { ...prev, [day]: sanitized };
    });
  };

  const markAbsence = (day: DayKey) => updateDayInWeeklyHours(day, () => 0);

  const resetDayToBase = (day: DayKey) => {
    if (!modalBaseSchedule) return;
    const baseHours = modalBaseSchedule[day]?.hours ?? 0;
    updateDayInWeeklyHours(day, () => baseHours);
  };

  const resetWeekToBase = () => {
    if (!modalBaseSchedule) return;
    setModalWeeklyHours(buildWeeklyHoursFromBase(modalBaseSchedule));
  };

  const handleSaveBaseSchedule = async () => {
    if (!scheduleEmpleado || !modalBaseSchedule) return;
    const empleadoId = scheduleEmpleado.id;
    const sanitized = {} as WeeklySchedule;
    DAY_ORDER.forEach(day => {
      const data = modalBaseSchedule[day];
      sanitized[day] = {
        active: Boolean(data.active),
        hours: data.active ? Math.max(0, Number(data.hours) || 0) : 0
      };
    });

    try {
      await dataService.saveEmployeeBaseSchedule(empleadoId, sanitized);
    } catch (error) {
      console.error('No se pudo guardar el horario base del empleado:', error);
    }

    setHorariosBase(prev => ({ ...prev, [empleadoId]: sanitized }));
    setModalBaseSchedule(prev => (prev ? sanitized : prev));
  };

  const handleSaveWeeklyHours = async () => {
    if (!scheduleEmpleado || !modalWeeklyHours) return;
    const empleadoId = scheduleEmpleado.id;
    const weekKey = scheduleWeek;
    const sanitized = {} as WeeklyHours;
    DAY_ORDER.forEach(day => {
      sanitized[day] = Math.max(0, Number(modalWeeklyHours[day]) || 0);
    });

    try {
      await dataService.saveEmployeeWeeklyHours(empleadoId, weekKey, sanitized);
      loadedWeeksRef.current.add(weekKey);
    } catch (error) {
      console.error('No se pudieron guardar las horas semanales del empleado:', error);
    }

    setHorariosSemanales(prev => {
      const employeeWeeks: EmployeeWeeklyRecords = {
        ...(prev[empleadoId] || {})
      };
      employeeWeeks[weekKey] = sanitized;
      return { ...prev, [empleadoId]: employeeWeeks };
    });

    setModalWeeklyHours(sanitized);

    closeScheduleModal();
  };

  const handleToggleHistory = useCallback(
    async (empleado: Empleado) => {
      const empleadoId = empleado.id;
      const current = historyState[empleadoId] ?? createHistoryState();
      const willExpand = !current.expanded;

      if (!willExpand) {
        updateHistoryState(empleadoId, prev => ({ ...prev, expanded: false }));
        return;
      }

      updateHistoryState(empleadoId, prev => ({ ...prev, expanded: true, error: null }));

      if (current.loaded) {
        return;
      }

      updateHistoryState(empleadoId, prev => ({ ...prev, loading: true, expanded: true, error: null }));

      try {
        const history = await dataService.fetchEmployeeWeeklyHoursHistory(empleadoId);
        setHorariosSemanales(prev => {
          const updated: Record<string, EmployeeWeeklyRecords> = { ...prev };
          const employeeWeeks = { ...(updated[empleadoId] || {}) };
          Object.entries(history).forEach(([weekKey, value]) => {
            employeeWeeks[weekKey] = value;
            loadedWeeksRef.current.add(weekKey);
          });
          updated[empleadoId] = employeeWeeks;
          return updated;
        });

        updateHistoryState(empleadoId, prev => ({ ...prev, loading: false, loaded: true, expanded: true, error: null }));
      } catch (error) {
        console.error('Error cargando histórico de horas del empleado:', error);
        updateHistoryState(empleadoId, prev => ({ ...prev, loading: false, expanded: true, error: 'No se pudo cargar el histórico' }));
      }
    },
    [historyState, updateHistoryState]
  );

  const calcularHorasSemana = (schedule: WeeklySchedule) => sumWeeklyHours(buildWeeklyHoursFromBase(schedule));

  const handleSavePayrollSettings = async () => {
    try {
      setPayrollSaving(true);
      const saved = await dataService.savePayrollSettings(payrollSettings);
      setPayrollSettings(normalizePayrollSettings(saved));
    } catch (error) {
      console.error('No se pudo guardar configuración de nómina:', error);
    } finally {
      setPayrollSaving(false);
    }
  };

  const parseRangeDate = (value: string): Date | null => {
    if (!value) return null;
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return null;
    return date;
  };

  const getDailyWorkedHours = (empleado: Empleado, date: Date): number => {
    const weekKey = calculateIsoWeekKey(date);
    const weeklyOverride = employeeHoursHistory[empleado.id]?.[weekKey];
    const startOfWeek = getStartOfWeek(weekKey);
    const dayOffset = Math.floor((date.getTime() - startOfWeek.getTime()) / 86400000);
    const dayKey = DAY_ORDER[dayOffset] as DayKey | undefined;
    if (!dayKey) return 0;

    if (weeklyOverride) {
      return Math.max(0, Number(weeklyOverride[dayKey]) || 0);
    }

    const baseSchedule = ensureSchedule(empleado, horariosBase[empleado.id]);
    const baseDay = baseSchedule[dayKey];
    if (!baseDay?.active) return 0;
    return Math.max(0, Number(baseDay.hours) || 0);
  };

  const payrollRows = useMemo(() => {
    const start = parseRangeDate(quincenaRange.start);
    const end = parseRangeDate(quincenaRange.end);
    if (!start || !end || start > end) {
      return [];
    }
    const daysInPeriod = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;

    return empleados.map((empleado) => {
      const weeklyHours = {} as WeeklyHours;
      DAY_ORDER.forEach(day => { weeklyHours[day] = 0; });

      let hoursInPeriod = 0;
      let daysWorked = 0;

      const cursor = new Date(start);
      while (cursor <= end) {
        const worked = getDailyWorkedHours(empleado, cursor);
        hoursInPeriod += worked;
        if (worked > 0) {
          daysWorked += 1;
        }

        const weekKey = calculateIsoWeekKey(cursor);
        const startOfWeek = getStartOfWeek(weekKey);
        const dayOffset = Math.floor((cursor.getTime() - startOfWeek.getTime()) / 86400000);
        const dayKey = DAY_ORDER[dayOffset] as DayKey | undefined;
        if (dayKey) {
          weeklyHours[dayKey] = (weeklyHours[dayKey] || 0) + worked;
        }

        cursor.setDate(cursor.getDate() + 1);
      }

      const simulatedWeeklyHours = {} as WeeklyHours;
      DAY_ORDER.forEach(day => {
        // Escala al equivalente de una semana para reutilizar cálculo existente de salario por horas.
        simulatedWeeklyHours[day] = weeklyHours[day];
      });

      const payroll = calculateEmployeeWeeklyPayment(empleado, simulatedWeeklyHours, payrollSettings);
      const salarioDiario = payroll.salarioMensualBase / payrollSettings.diasMesBase;
      const salarioQuincenalFijo = payroll.salarioMensualBase / 2;
      const useFixedQuincenaForFixedContract = empleado.tipo_contrato === 'salario_fijo' && daysInPeriod === 15;
      const salaryByContract = empleado.tipo_contrato === 'salario_fijo'
        ? Math.round(useFixedQuincenaForFixedContract ? salarioQuincenalFijo : salarioDiario * daysWorked)
        : Math.round(payroll.salarioHora * hoursInPeriod);
      const auxilioDiario = payrollSettings.auxilioTransporte / payrollSettings.diasMesBase;
      const auxilio = payroll.qualifiesTransport
        ? Math.round(auxilioDiario * daysWorked)
        : 0;
      const total = salaryByContract + auxilio;

      return {
        empleado,
        hoursInPeriod,
        daysInPeriod,
        daysWorked,
        salarioMensual: payroll.salarioMensualBase,
        salarioHora: payroll.salarioHora,
        salarioDiario: Math.round(salarioDiario),
        salarioQuincenalFijo: Math.round(salarioQuincenalFijo),
        auxilioDiario: Math.round(auxilioDiario),
        useFixedQuincenaForFixedContract,
        qualifiesTransport: payroll.qualifiesTransport,
        salaryByContract,
        auxilio,
        total,
      };
    });
  }, [empleados, quincenaRange, payrollSettings, employeeHoursHistory, horariosBase]);

  const payrollTotals = useMemo(() => {
    return payrollRows.reduce((acc, row) => {
      acc.salary += row.salaryByContract;
      acc.auxilio += row.auxilio;
      acc.total += row.total;
      return acc;
    }, { salary: 0, auxilio: 0, total: 0 });
  }, [payrollRows]);

  const modalBaseWeekHours = modalBaseSchedule ? calcularHorasSemana(modalBaseSchedule) : 0;
  const modalWeekRegisteredHours = modalWeeklyHours ? sumWeeklyHours(modalWeeklyHours) : 0;
  const modalWeekDiff = modalWeekRegisteredHours - modalBaseWeekHours;
  const modalDiffClass = Math.abs(modalWeekDiff) < 0.01 ? 'text-gray-600' : modalWeekDiff > 0 ? 'text-green-600' : 'text-orange-500';

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users size={24} style={{ color: COLORS.dark }} />
          <h2 className="text-xl lg:text-2xl font-bold" style={{ color: COLORS.dark }}>
            Gestión de Empleados
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGeneralHistory(prev => !prev)}
            className={`flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
              showGeneralHistory
                ? 'text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            style={{ backgroundColor: showGeneralHistory ? COLORS.dark : 'transparent', borderColor: showGeneralHistory ? COLORS.dark : '#E5E7EB' }}
          >
            <History size={16} />
            <span className="hidden md:inline">{showGeneralHistory ? 'Ocultar histórico' : 'Histórico semanal'}</span>
            <span className="md:hidden">{showGeneralHistory ? 'Ocultar' : 'Histórico'}</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 text-sm"
            style={{ backgroundColor: COLORS.dark }}
          >
            <Plus size={16} />
            <span className="hidden lg:inline">Agregar Empleado</span>
            <span className="lg:hidden">Agregar</span>
          </button>
        </div>
      </div>

      <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1">
        <button
          type="button"
          onClick={() => setPayrollView('gestion')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            payrollView === 'gestion' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
          style={{ backgroundColor: payrollView === 'gestion' ? COLORS.dark : 'transparent' }}
        >
          Gestión
        </button>
        {canViewPayroll && (
          <button
            type="button"
            onClick={() => setPayrollView('pago_nomina')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              payrollView === 'pago_nomina' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
            style={{ backgroundColor: payrollView === 'pago_nomina' ? COLORS.dark : 'transparent' }}
          >
            Pago nómina
          </button>
        )}
      </div>

      {payrollView === 'gestion' && showGeneralHistory && (
        <div className="ui-card ui-card-pad">
          <HistoricoEmpleados />
        </div>
      )}

      {canViewPayroll && payrollView === 'gestion' && (
      <div className="ui-card ui-card-pad space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold" style={{ color: COLORS.dark }}>
            Parámetros de nómina
          </h3>
          <button
            type="button"
            onClick={() => void handleSavePayrollSettings()}
            disabled={payrollSaving}
            className="px-4 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-70"
            style={{ backgroundColor: COLORS.dark }}
          >
            {payrollSaving ? 'Guardando...' : 'Guardar parámetros'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">SMMLV</label>
            <input
              type="number"
              min="0"
              step="100"
              value={payrollSettings.smmlv}
              onChange={(e) => setPayrollSettings(prev => normalizePayrollSettings({ ...prev, smmlv: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Auxilio transporte</label>
            <input
              type="number"
              min="0"
              step="100"
              value={payrollSettings.auxilioTransporte}
              onChange={(e) => setPayrollSettings(prev => normalizePayrollSettings({ ...prev, auxilioTransporte: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Horas mes base</label>
            <input
              type="number"
              min="1"
              value={payrollSettings.horasMesBase}
              onChange={(e) => setPayrollSettings(prev => normalizePayrollSettings({ ...prev, horasMesBase: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Días mes base</label>
            <input
              type="number"
              min="1"
              value={payrollSettings.diasMesBase}
              onChange={(e) => setPayrollSettings(prev => normalizePayrollSettings({ ...prev, diasMesBase: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Tope auxilio (x SMMLV)</label>
            <input
              type="number"
              min="1"
              step="0.1"
              value={payrollSettings.limiteAuxilioSmmlv}
              onChange={(e) => setPayrollSettings(prev => normalizePayrollSettings({ ...prev, limiteAuxilioSmmlv: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>
      )}

      {payrollView === 'gestion' && (
      <>
      {/* Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="ui-card ui-card-pad w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.dark }}>
              {editingId ? 'Editar Empleado' : 'Nuevo Empleado'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de contrato</label>
                  <select
                    value={formData.tipo_contrato}
                    onChange={(e) => setFormData({ ...formData, tipo_contrato: e.target.value as Empleado['tipo_contrato'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                  >
                    <option value="por_horas">Por horas</option>
                    <option value="salario_fijo">Salario fijo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Horas por día</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={formData.horas_dia}
                    onChange={(e) => setFormData({ ...formData, horas_dia: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Días por semana</label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={formData.dias_semana}
                    onChange={(e) => setFormData({ ...formData, dias_semana: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Salario mensual</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.salario_mensual}
                  onChange={(e) => setFormData({ ...formData, salario_mensual: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Salario por hora (opcional)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.salario_hora}
                  onChange={(e) => setFormData({ ...formData, salario_hora: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="incluye_auxilio_transporte"
                  checked={formData.incluye_auxilio_transporte}
                  onChange={(e) => setFormData({ ...formData, incluye_auxilio_transporte: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="incluye_auxilio_transporte" className="text-sm font-medium">Aplica auxilio transporte</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="activo" className="text-sm font-medium">Empleado activo</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: COLORS.dark }}
                >
                  {editingId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {scheduleEmpleado && modalBaseSchedule && modalWeeklyHours && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b px-6 py-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Gestión semanal de horarios</h3>
                <p className="text-sm text-gray-500">
                  {scheduleEmpleado.nombre} • Semana {formatWeekRange(scheduleWeek)}
                </p>
              </div>
              <button
                onClick={closeScheduleModal}
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
              >
                <span className="sr-only">Cerrar</span>
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto px-6 py-5 space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Selecciona la semana que deseas ajustar</p>
                  <p className="text-xs text-gray-500">Puedes modificar horas específicas si hubo ausencias o cambios.</p>
                </div>
                <input
                  type="week"
                  value={scheduleWeek}
                  onChange={(e) => void handleScheduleWeekChange(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 sm:w-auto"
                  style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                      <th className="px-4 py-3 font-semibold">Día</th>
                      <th className="px-4 py-3 font-semibold">Horario base</th>
                      <th className="px-4 py-3 font-semibold">Horas trabajadas</th>
                      <th className="px-4 py-3 font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {DAY_ORDER.map(day => {
                      const baseData = modalBaseSchedule[day];
                      const workedHours = modalWeeklyHours[day] ?? 0;
                      return (
                        <tr key={day} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-700">{DAY_LABELS[day]}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                <input
                                  type="checkbox"
                                  checked={baseData.active}
                                  onChange={() => toggleBaseDay(day)}
                                  className="rounded"
                                />
                                Activo
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={baseData.active ? baseData.hours : 0}
                                onChange={(e) => updateBaseDayHours(day, parseFloat(e.target.value))}
                                disabled={!baseData.active}
                                className="w-24 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-transparent focus:ring-2 disabled:bg-gray-100"
                                style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                              />
                              <span className="text-xs text-gray-500">horas</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={workedHours}
                                onChange={(e) => handleWeeklyHoursChange(day, parseFloat(e.target.value))}
                                className="w-24 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-transparent focus:ring-2"
                                style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                              />
                              <span className="text-xs text-gray-500">horas</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => resetDayToBase(day)}
                                className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
                              >
                                Usar base
                              </button>
                              <button
                                type="button"
                                onClick={() => markAbsence(day)}
                                className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
                              >
                                Ausencia
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 rounded-xl bg-gray-50 p-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-gray-500">Horas base de la semana</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {formatHours(modalBaseWeekHours)} h
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Horas registradas</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {formatHours(modalWeekRegisteredHours)} h
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Diferencia semanal</p>
                  <p className={`text-lg font-semibold ${modalDiffClass}`}>
                    {formatDifference(modalWeekDiff)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={resetWeekToBase}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                >
                  <RefreshCcw size={16} />
                  Restablecer semana
                </button>
                <button
                  type="button"
                  onClick={() => void handleSaveBaseSchedule()}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Guardar horario base
                </button>
                <button
                  type="button"
                  onClick={() => void handleSaveWeeklyHours()}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: COLORS.dark }}
                >
                  Guardar horas de la semana
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de empleados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {empleados.map((empleado) => {
          const baseSchedule = getBaseScheduleForEmpleado(empleado);
          const baseWeeklyHours = calcularHorasSemana(baseSchedule);
          const currentWeekKey = getCurrentWeekKey();
          const weeklyHoursRecord = getWeeklyHoursForEmpleado(empleado.id, currentWeekKey, baseSchedule);
          const workedWeeklyHours = sumWeeklyHours(weeklyHoursRecord);
          const diff = workedWeeklyHours - baseWeeklyHours;
          const diffClass = Math.abs(diff) < 0.01 ? 'text-gray-500' : diff > 0 ? 'text-green-600' : 'text-orange-500';
          const weekLabel = formatWeekRange(currentWeekKey);
          const weeklyPayroll = calculateEmployeeWeeklyPayment(empleado, weeklyHoursRecord, payrollSettings);
          const historyStatus = historyState[empleado.id] ?? createHistoryState();
          const savedRecords = horariosSemanales[empleado.id] || {};
          const historyRecords: Record<string, WeeklyHours> = { ...savedRecords };
          if (!historyRecords[currentWeekKey]) {
            historyRecords[currentWeekKey] = weeklyHoursRecord;
          }
          const sortedHistoryEntries = Object.entries(historyRecords).sort((a, b) => compareWeeksDesc(a[0], b[0]));
          const hasStoredWeeks = Object.keys(savedRecords).length > 0;

          return (
            <div
              key={empleado.id}
              className={`bg-white rounded-xl p-6 shadow-sm border transition-all duration-200 hover:shadow-md ${
                empleado.activo ? 'border-gray-100' : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
                    {empleado.nombre}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      empleado.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {empleado.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(empleado)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(empleado.id)}
                    className="p-1 rounded hover:bg-gray-100 text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {(empleado.telefono || empleado.email) && (
                <div className="space-y-1 mb-4 text-sm text-gray-600">
                  {empleado.telefono && <p>📞 {empleado.telefono}</p>}
                  {empleado.email && <p>✉️ {empleado.email}</p>}
                </div>
              )}

              <div className="space-y-4">
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={18} className="text-gray-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Horario base semanal</p>
                        <p className="text-xs text-gray-500">
                          Horas estimadas:{' '}
                          <span className="font-semibold text-gray-700">{formatHours(baseWeeklyHours)} h</span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => void openScheduleModal(empleado)}
                      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100"
                    >
                      <Clock size={16} />
                      <span>Gestionar semana</span>
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    {DAY_ORDER.map(day => {
                      const dayData = baseSchedule[day];
                      return (
                        <div
                          key={day}
                          className={`flex items-center justify-between rounded-md px-2 py-1 ${
                            dayData.active
                              ? 'bg-white text-gray-700 shadow-sm'
                              : 'text-gray-400'
                          }`}
                        >
                          <span className="font-medium">{DAY_LABELS[day]}</span>
                          <span>{dayData.active ? `${formatHours(dayData.hours)} h` : 'Descanso'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      <span>Horas programadas</span>
                    </div>
                    <p className="mt-2 text-2xl font-semibold" style={{ color: COLORS.dark }}>
                      {formatHours(baseWeeklyHours)} h
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <CalendarDays size={16} />
                      <span>Semana actual ({weekLabel})</span>
                    </div>
                    <p className="mt-2 text-2xl font-semibold" style={{ color: COLORS.dark }}>
                      {formatHours(workedWeeklyHours)} h
                    </p>
                    <p className={`mt-1 text-xs font-medium ${diffClass}`}>
                      {formatDifference(diff)}
                    </p>
                  </div>
                </div>

                {canViewPayroll && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-gray-500" />
                        <span className="text-sm">
                          {empleado.tipo_contrato === 'salario_fijo' ? 'Salario mensual' : 'Salario/hora'}
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {empleado.tipo_contrato === 'salario_fijo'
                          ? formatCOP(weeklyPayroll.salarioMensualBase)
                          : formatCOP(weeklyPayroll.salarioHora)}
                      </span>
                    </div>
                    <div className="text-center p-2 rounded" style={{ backgroundColor: `${COLORS.accent}20` }}>
                      <p className="text-sm text-gray-600">Pago semanal estimado</p>
                      <p className="font-bold" style={{ color: COLORS.dark }}>
                        {formatCOP(weeklyPayroll.totalSemanal)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Base: {formatCOP(weeklyPayroll.salarioSemanal)} · Auxilio: {formatCOP(weeklyPayroll.auxilioSemanal)}
                      </p>
                    </div>
                  </div>
                )}
                <div className="mt-4 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <CreditCard size={16} />
                      <span>Crédito acumulado</span>
                    </div>
                    <span className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                      {formatCOP(employeeCredits[empleado.id] ?? 0)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Registra abonos desde la caja con el método "Crédito empleados".
                  </p>
                </div>
                <div className="mt-4 rounded-lg border border-gray-100 bg-white/60 p-4">
                  <button
                    type="button"
                    onClick={() => void handleToggleHistory(empleado)}
                    className="flex w-full items-center justify-between text-left text-sm font-medium text-gray-700"
                  >
                    <span className="flex items-center gap-2">
                      <History size={16} className="text-gray-500" />
                      Histórico de horas trabajadas
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      {historyStatus.expanded ? 'Ocultar' : 'Ver historial'}
                    </span>
                  </button>

                  {historyStatus.expanded && (
                    <div className="mt-3 space-y-3">
                      {historyStatus.error && (
                        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
                          {historyStatus.error}
                        </div>
                      )}

                      {historyStatus.loading ? (
                        <p className="text-xs text-gray-500">Cargando histórico...</p>
                      ) : (
                        <div className="overflow-x-auto">
                          {sortedHistoryEntries.length === 0 ? (
                            <p className="text-xs text-gray-500">Aún no hay semanas registradas.</p>
                          ) : (
                            <table className="w-full min-w-[400px] text-xs">
                              <thead>
                                <tr className="text-left text-[11px] uppercase tracking-wide text-gray-500">
                                  <th className="px-3 py-2 font-semibold">Semana</th>
                                  <th className="px-3 py-2 font-semibold">Horas trabajadas</th>
                                  <th className="px-3 py-2 font-semibold">Variación</th>
                                  <th className="px-3 py-2 font-semibold text-right">Acciones</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {sortedHistoryEntries.map(([weekKey, hours]) => {
                                  const totalHours = sumWeeklyHours(hours);
                                  const diffVsBase = totalHours - baseWeeklyHours;
                                  const isCurrentWeek = weekKey === currentWeekKey;
                                  return (
                                    <tr key={weekKey} className={isCurrentWeek ? 'bg-gray-50' : undefined}>
                                      <td className="px-3 py-2">
                                        <div className="flex flex-col">
                                          <span className="font-semibold text-gray-700">{formatWeekRange(weekKey)}</span>
                                          {isCurrentWeek && <span className="text-[11px] text-gray-500">Semana actual</span>}
                                        </div>
                                      </td>
                                      <td className="px-3 py-2">
                                        <span className="font-medium text-gray-700">{formatHours(totalHours)} h</span>
                                      </td>
                                      <td className={`px-3 py-2 font-medium text-[11px] ${
                                        Math.abs(diffVsBase) < 0.01
                                          ? 'text-gray-500'
                                          : diffVsBase > 0
                                            ? 'text-green-600'
                                            : 'text-orange-500'
                                      }`}>
                                        {formatDifference(diffVsBase)}
                                      </td>
                                      <td className="px-3 py-2 text-right">
                                        <button
                                          type="button"
                                          onClick={() => void openScheduleModal(empleado, weekKey)}
                                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-[11px] font-medium text-gray-600 transition hover:bg-gray-100"
                                        >
                                          <Edit3 size={14} />
                                          Ajustar
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          )}
                        </div>
                      )}

                      {!historyStatus.loading && !hasStoredWeeks && (
                        <p className="text-[11px] text-gray-500">
                          Los registros guardados aparecerán aquí. Usa "Gestionar semana" para almacenar ajustes.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {empleados.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay empleados registrados</h3>
          <p className="text-gray-500">Agrega tu primer empleado para comenzar</p>
        </div>
      )}
      </>
      )}

      {canViewPayroll && payrollView === 'pago_nomina' && (
        <div className="space-y-4">
          <div className="ui-card ui-card-pad">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Inicio quincena</label>
                <input
                  type="date"
                  value={quincenaRange.start}
                  onChange={(e) => setQuincenaRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Fin quincena</label>
                <input
                  type="date"
                  value={quincenaRange.end}
                  onChange={(e) => setQuincenaRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Subtotal salarios</p>
                <p className="text-lg font-bold" style={{ color: COLORS.dark }}>{formatCOP(payrollTotals.salary)}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Total quincena</p>
                <p className="text-lg font-bold" style={{ color: COLORS.dark }}>{formatCOP(payrollTotals.total)}</p>
                <p className="text-xs text-gray-500">Incluye auxilio: {formatCOP(payrollTotals.auxilio)}</p>
              </div>
            </div>
          </div>

          <div className="ui-card overflow-hidden">
            {payrollLoading ? (
              <div className="p-6 text-sm text-gray-500">Cargando información de horas y pagos...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Empleado</th>
                      <th className="px-4 py-3 text-left font-semibold">Contrato</th>
                      <th className="px-4 py-3 text-right font-semibold">Horas quincena</th>
                      <th className="px-4 py-3 text-right font-semibold">Días trabajados</th>
                      <th className="px-4 py-3 text-right font-semibold">Salario base</th>
                      <th className="px-4 py-3 text-right font-semibold">Auxilio transporte</th>
                      <th className="px-4 py-3 text-right font-semibold">Total a pagar</th>
                      <th className="px-4 py-3 text-left font-semibold">Detalle cálculo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payrollRows.map((row) => (
                      <tr key={row.empleado.id}>
                        <td className="px-4 py-3 font-medium text-gray-800">{row.empleado.nombre}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {row.empleado.tipo_contrato === 'salario_fijo' ? 'Salario fijo' : 'Por horas'}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700">{formatHours(row.hoursInPeriod)} h</td>
                        <td className="px-4 py-3 text-right text-gray-700">{row.daysWorked}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{formatCOP(row.salaryByContract)}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{formatCOP(row.auxilio)}</td>
                        <td className="px-4 py-3 text-right font-semibold" style={{ color: COLORS.dark }}>
                          {formatCOP(row.total)}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600 align-top">
                          {row.empleado.tipo_contrato === 'por_horas' ? (
                            <div className="space-y-1">
                              <p>
                                Valor hora = {formatCOP(row.salarioMensual)} / {payrollSettings.horasMesBase} = <b>{formatCOP(row.salarioHora)}</b>
                              </p>
                              <p>
                                Salario = {formatCOP(row.salarioHora)} x {formatHours(row.hoursInPeriod)}h = <b>{formatCOP(row.salaryByContract)}</b>
                              </p>
                              <p>
                                Auxilio diario = {formatCOP(payrollSettings.auxilioTransporte)} / {payrollSettings.diasMesBase} = <b>{formatCOP(row.auxilioDiario)}</b>
                              </p>
                              <p>
                                Auxilio = {row.qualifiesTransport ? `${formatCOP(row.auxilioDiario)} x ${row.daysWorked} días = ${formatCOP(row.auxilio)}` : 'No aplica (sin auxilio o supera tope)'}
                              </p>
                              <p className="font-semibold">Total = {formatCOP(row.salaryByContract)} + {formatCOP(row.auxilio)} = {formatCOP(row.total)}</p>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p>
                                Valor día = {formatCOP(row.salarioMensual)} / {payrollSettings.diasMesBase} = <b>{formatCOP(row.salarioDiario)}</b>
                              </p>
                              <p>
                                Salario base = {row.useFixedQuincenaForFixedContract
                                  ? `${formatCOP(row.salarioMensual)} / 2 = ${formatCOP(row.salaryByContract)} (quincena fija)`
                                  : `${formatCOP(row.salarioDiario)} x ${row.daysWorked} días = ${formatCOP(row.salaryByContract)}`}
                              </p>
                              <p>
                                Auxilio diario = {formatCOP(payrollSettings.auxilioTransporte)} / {payrollSettings.diasMesBase} = <b>{formatCOP(row.auxilioDiario)}</b>
                              </p>
                              <p>
                                Auxilio = {row.qualifiesTransport ? `${formatCOP(row.auxilioDiario)} x ${row.daysWorked} días = ${formatCOP(row.auxilio)}` : 'No aplica (sin auxilio o supera tope)'}
                              </p>
                              <p className="font-semibold">Total = {formatCOP(row.salaryByContract)} + {formatCOP(row.auxilio)} = {formatCOP(row.total)}</p>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {payrollRows.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-6 text-center text-sm text-gray-500">
                          Ajusta un rango válido para calcular la nómina.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
