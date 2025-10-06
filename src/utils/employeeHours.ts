import { Empleado, DayKey, WeeklySchedule, WeeklyHours, DAY_KEYS } from '../types';

export const DAY_ORDER: DayKey[] = [...DAY_KEYS];

export const DAY_LABELS: Record<DayKey, string> = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo'
};

export const calculateIsoWeekKey = (date: Date): string => {
  const tmp = new Date(date.getTime());
  tmp.setHours(0, 0, 0, 0);
  const dayNum = tmp.getDay() || 7;
  tmp.setDate(tmp.getDate() + 4 - dayNum);
  const yearStart = new Date(tmp.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${tmp.getFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
};

export const getCurrentWeekKey = () => calculateIsoWeekKey(new Date());

export const getStartOfWeek = (weekKey: string): Date => {
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

export const getEndOfWeek = (start: Date): Date => {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
};

export const formatWeekRange = (weekKey: string): string => {
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

export const schedulesAreEqual = (a: WeeklySchedule, b: WeeklySchedule): boolean =>
  DAY_ORDER.every(day => a[day]?.active === b[day]?.active && Number(a[day]?.hours ?? 0) === Number(b[day]?.hours ?? 0));

export const buildDefaultSchedule = (empleado: Empleado): WeeklySchedule => {
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

export const ensureSchedule = (empleado: Empleado, stored?: WeeklySchedule): WeeklySchedule => {
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

export const buildWeeklyHoursFromBase = (schedule: WeeklySchedule): WeeklyHours => {
  const hours = {} as WeeklyHours;
  DAY_ORDER.forEach(day => {
    hours[day] = schedule[day].active ? schedule[day].hours : 0;
  });
  return hours;
};

export const sumWeeklyHours = (hours: WeeklyHours) =>
  DAY_ORDER.reduce((acc, day) => acc + (Number(hours[day]) || 0), 0);

export const formatHours = (hours: number) => {
  const normalized = Number.isNaN(hours) ? 0 : hours;
  if (Math.abs(normalized % 1) < 0.01) {
    return `${Math.round(normalized)}`;
  }
  return normalized.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
};

export const formatDifference = (value: number) => {
  if (Math.abs(value) < 0.01) {
    return 'Sin variación';
  }
  const formatted = formatHours(Math.abs(value));
  return `${value > 0 ? '+' : '-'}${formatted} h vs base`;
};
