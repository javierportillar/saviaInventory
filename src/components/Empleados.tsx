import React, { useState, useEffect } from 'react';
import { Empleado } from '../types';
import {
  Users,
  Edit3,
  Trash2,
  Plus,
  Clock,
  DollarSign,
  CalendarDays,
  RefreshCcw,
  X
} from 'lucide-react';
import { COLORS } from '../data/menu';
import { formatCOP } from '../utils/format';
import dataService from '../lib/dataService';

type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

interface DaySchedule {
  active: boolean;
  hours: number;
}

type WeeklySchedule = Record<DayKey, DaySchedule>;
type WeeklyHours = Record<DayKey, number>;
type EmployeeWeeklyRecords = Record<string, WeeklyHours>;

const DAY_ORDER: DayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const DAY_LABELS: Record<DayKey, string> = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo'
};

const BASE_SCHEDULE_STORAGE_KEY = 'savia-horarios-base';
const WEEKLY_SCHEDULE_STORAGE_KEY = 'savia-horarios-semanales';

const calculateIsoWeekKey = (date: Date): string => {
  const tmp = new Date(date.getTime());
  tmp.setHours(0, 0, 0, 0);
  const dayNum = tmp.getDay() || 7;
  tmp.setDate(tmp.getDate() + 4 - dayNum);
  const yearStart = new Date(tmp.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${tmp.getFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
};

const getCurrentWeekKey = () => calculateIsoWeekKey(new Date());

const getStartOfWeek = (weekKey: string): Date => {
  const [yearStr, weekStr] = weekKey.split('-W');
  const year = Number(yearStr);
  const week = Number(weekStr);
  const simple = new Date(year, 0, 4);
  const day = simple.getDay() || 7;
  const monday = new Date(simple);
  monday.setDate(simple.getDate() + (week - 1) * 7 - (day - 1));
  monday.setHours(0, 0, 0, 0);
  return monday;
};

const getEndOfWeek = (start: Date): Date => {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
};

const formatWeekRange = (weekKey: string): string => {
  try {
    const start = getStartOfWeek(weekKey);
    const end = getEndOfWeek(start);
    const formatter = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' });
    return `${formatter.format(start)} - ${formatter.format(end)}`;
  } catch (error) {
    console.warn('No se pudo formatear la semana seleccionada', error);
    return weekKey;
  }
};

const schedulesAreEqual = (a: WeeklySchedule, b: WeeklySchedule) =>
  DAY_ORDER.every(day => a[day]?.active === b[day]?.active && Number(a[day]?.hours ?? 0) === Number(b[day]?.hours ?? 0));

const buildDefaultSchedule = (empleado: Empleado): WeeklySchedule => {
  const schedule = {} as WeeklySchedule;
  DAY_ORDER.forEach((day, index) => {
    const active = index < empleado.dias_semana;
    schedule[day] = {
      active,
      hours: active ? empleado.horas_dia : 0
    };
  });
  return schedule;
};

const ensureSchedule = (empleado: Empleado, stored?: WeeklySchedule): WeeklySchedule => {
  const base = buildDefaultSchedule(empleado);
  if (!stored) return base;
  const ensured = {} as WeeklySchedule;
  DAY_ORDER.forEach(day => {
    const existing = stored[day];
    if (existing) {
      ensured[day] = {
        active: Boolean(existing.active),
        hours: existing.active ? Math.max(0, Number(existing.hours) || 0) : 0
      };
    } else {
      ensured[day] = base[day];
    }
  });
  return ensured;
};

const buildWeeklyHoursFromBase = (schedule: WeeklySchedule): WeeklyHours => {
  const hours = {} as WeeklyHours;
  DAY_ORDER.forEach(day => {
    hours[day] = schedule[day].active ? schedule[day].hours : 0;
  });
  return hours;
};

const sumWeeklyHours = (hours: WeeklyHours) => DAY_ORDER.reduce((acc, day) => acc + (Number(hours[day]) || 0), 0);

const persistBaseSchedules = (schedules: Record<string, WeeklySchedule>) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BASE_SCHEDULE_STORAGE_KEY, JSON.stringify(schedules));
  } catch (error) {
    console.warn('No se pudieron guardar los horarios base', error);
  }
};

const persistWeeklySchedules = (records: Record<string, EmployeeWeeklyRecords>) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WEEKLY_SCHEDULE_STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.warn('No se pudieron guardar los registros semanales', error);
  }
};

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

  useEffect(() => {
    fetchEmpleados();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedBase = localStorage.getItem(BASE_SCHEDULE_STORAGE_KEY);
      if (storedBase) {
        const parsed = JSON.parse(storedBase) as Record<string, WeeklySchedule>;
        setHorariosBase(parsed);
      }
    } catch (error) {
      console.warn('No se pudieron cargar los horarios base', error);
    }

    try {
      const storedWeekly = localStorage.getItem(WEEKLY_SCHEDULE_STORAGE_KEY);
      if (storedWeekly) {
        const parsed = JSON.parse(storedWeekly) as Record<string, EmployeeWeeklyRecords>;
        setHorariosSemanales(parsed);
      }
    } catch (error) {
      console.warn('No se pudieron cargar los registros semanales', error);
    }
  }, []);

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

      if (changed) {
        persistBaseSchedules(updated);
        return updated;
      }

      return prev;
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

      if (changed) {
        persistWeeklySchedules(updated);
        return updated;
      }

      return prev;
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

  const getWeeklyHoursForEmpleado = (empleadoId: string, weekKey: string, base: WeeklySchedule): WeeklyHours => {
    const weeklyRecords = horariosSemanales[empleadoId];
    if (!weeklyRecords) {
      return buildWeeklyHoursFromBase(base);
    }
    const stored = weeklyRecords[weekKey];
    if (!stored) {
      return buildWeeklyHoursFromBase(base);
    }
    const hours = buildWeeklyHoursFromBase(base);
    DAY_ORDER.forEach(day => {
      const value = stored[day];
      if (typeof value === 'number' && !Number.isNaN(value)) {
        hours[day] = value;
      }
    });
    return hours;
  };

  const openScheduleModal = (empleado: Empleado) => {
    const baseSchedule = ensureSchedule(empleado, horariosBase[empleado.id]);
    const currentWeek = getCurrentWeekKey();
    setScheduleEmpleado(empleado);
    setScheduleWeek(currentWeek);
    setModalBaseSchedule(baseSchedule);
    setModalWeeklyHours(getWeeklyHoursForEmpleado(empleado.id, currentWeek, baseSchedule));
  };

  const closeScheduleModal = () => {
    setScheduleEmpleado(null);
    setModalBaseSchedule(null);
    setModalWeeklyHours(null);
  };

  const handleScheduleWeekChange = (value: string) => {
    if (!value) return;
    setScheduleWeek(value);
    if (!scheduleEmpleado || !modalBaseSchedule) return;
    setModalWeeklyHours(getWeeklyHoursForEmpleado(scheduleEmpleado.id, value, modalBaseSchedule));
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

  const formatHours = (hours: number) => {
    const normalized = Number.isNaN(hours) ? 0 : hours;
    if (Math.abs(normalized % 1) < 0.01) {
      return `${Math.round(normalized)}`;
    }
    return normalized.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  };

  const formatDifference = (value: number) => {
    if (Math.abs(value) < 0.01) {
      return 'Sin variación';
    }
    const formatted = formatHours(Math.abs(value));
    return `${value > 0 ? '+' : '-'}${formatted} h vs base`;
  };

  const handleSaveBaseSchedule = () => {
    if (!scheduleEmpleado || !modalBaseSchedule) return;
    const sanitized = {} as WeeklySchedule;
    DAY_ORDER.forEach(day => {
      const data = modalBaseSchedule[day];
      sanitized[day] = {
        active: Boolean(data.active),
        hours: data.active ? Math.max(0, Number(data.hours) || 0) : 0
      };
    });
    setHorariosBase(prev => {
      const updated = { ...prev, [scheduleEmpleado.id]: sanitized };
      persistBaseSchedules(updated);
      return updated;
    });
  };

  const handleSaveWeeklyHours = () => {
    if (!scheduleEmpleado || !modalWeeklyHours) return;
    const sanitized = {} as WeeklyHours;
    DAY_ORDER.forEach(day => {
      sanitized[day] = Math.max(0, Number(modalWeeklyHours[day]) || 0);
    });

    setHorariosSemanales(prev => {
      const employeeWeeks: EmployeeWeeklyRecords = {
        ...(prev[scheduleEmpleado.id] || {})
      };
      employeeWeeks[scheduleWeek] = sanitized;
      const updated = { ...prev, [scheduleEmpleado.id]: employeeWeeks };
      persistWeeklySchedules(updated);
      return updated;
    });
  };

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
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={24} style={{ color: COLORS.dark }} />
          <h2 className="text-xl lg:text-2xl font-bold" style={{ color: COLORS.dark }}>
            Gestión de Empleados
          </h2>
        </div>
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

      {/* Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
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
                  onChange={(e) => handleScheduleWeekChange(e.target.value)}
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
                  onClick={handleSaveBaseSchedule}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Guardar horario base
                </button>
                <button
                  type="button"
                  onClick={handleSaveWeeklyHours}
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
                      onClick={() => openScheduleModal(empleado)}
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
    </div>
  );
}