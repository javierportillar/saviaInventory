import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Empleado, DayKey, DaySchedule, WeeklySchedule, WeeklyHours } from '../types';
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
  formatDifference
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

export function Empleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    horas_dia: 8,
    dias_semana: 5,
    salario_hora: 0,
    activo: true
  });
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
      horas_dia: empleado.horas_dia,
      dias_semana: empleado.dias_semana,
      salario_hora: empleado.salario_hora,
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
      horas_dia: 8,
      dias_semana: 5,
      salario_hora: 0,
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

  const calcularHorasMes = (schedule: WeeklySchedule) => calcularHorasSemana(schedule) * 4.33; // Promedio de semanas por mes

  const calcularSalarioMensual = (schedule: WeeklySchedule, salario_hora: number) => {
    return calcularHorasMes(schedule) * salario_hora;
  };

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

      {showGeneralHistory && (
        <div className="ui-card ui-card-pad">
          <HistoricoEmpleados />
        </div>
      )}

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
                <label className="block text-sm font-medium mb-1">Salario por hora</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.salario_hora}
                  onChange={(e) => setFormData({ ...formData, salario_hora: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                />
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

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-gray-500" />
                      <span className="text-sm">Salario/hora</span>
                    </div>
                    <span className="text-sm font-medium">{formatCOP(empleado.salario_hora)}</span>
                  </div>
                  <div className="text-center p-2 rounded" style={{ backgroundColor: `${COLORS.accent}20` }}>
                    <p className="text-sm text-gray-600">Salario mensual estimado</p>
                    <p className="font-bold" style={{ color: COLORS.dark }}>
                      {formatCOP(calcularSalarioMensual(baseSchedule, empleado.salario_hora))}
                    </p>
                  </div>
                </div>
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
    </section>
  );
}
