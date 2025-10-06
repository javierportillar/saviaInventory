import {
  MenuItem,
  Order,
  Customer,
  Empleado,
  Gasto,
  BalanceResumen,
  PaymentMethod,
  CartItem,
  PaymentAllocation,
  PaymentStatus,
  DatabaseConnectionState,
  EmployeeCreditRecord,
  EmployeeCreditHistoryEntry,
  WeeklySchedule,
  WeeklyHours,
  DAY_KEYS,
} from '../types';
import { supabase } from './supabaseClient';
import { getLocalData, setLocalData } from '../data/localData';
import { formatDateInputValue, parseDateInputValue } from '../utils/format';
import { slugify, generateMenuItemCode } from '../utils/strings';
import {
  buildNotesWithStudentDiscount,
  extractStudentDiscountFromNotes,
  getCartItemSubtotal,
  normalizeCartTotal,
} from '../utils/cart';
import {
  determinePaymentStatus,
  getAllocationsTotal,
  getOrderAllocations,
  getPrimaryMethodFromAllocations,
  mergeAllocations,
  sanitizeAllocations,
} from '../utils/payments';

// Verificar si Supabase está disponible
const isSupabaseAvailable = () => {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
};

const ensureSupabaseReady = async (): Promise<boolean> => {
  if (!isSupabaseAvailable()) {
    return false;
  }
  return true;
};

export const checkDatabaseConnection = async (): Promise<DatabaseConnectionState> => {
  if (!(await ensureSupabaseReady())) {
    return 'local';
  }

  try {
    const { error } = await supabase
      .from('orders')
      .select('id', { head: true })
      .limit(1);

    if (error) {
      throw error;
    }

    return 'online';
  } catch (error) {
    console.warn('Supabase connection check failed, falling back to local mode:', error);
    return 'local';
  }
};

const PAYMENT_METHODS: PaymentMethod[] = ['efectivo', 'tarjeta', 'nequi', 'credito_empleados'];

export const EMPLOYEE_CREDIT_UPDATED_EVENT = 'savia-employee-credit-updated';

const BASE_SCHEDULE_STORAGE_KEY = 'savia-horarios-base';
const WEEKLY_HOURS_STORAGE_KEY = 'savia-horarios-semanales';

const notifyEmployeeCreditUpdate = () => {
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent(EMPLOYEE_CREDIT_UPDATED_EVENT));
  }
};

type EmployeeWeeklyRecords = Record<string, WeeklyHours>;

const normalizeWeeklySchedule = (value: unknown): WeeklySchedule | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const input = value as Record<string, unknown>;
  const sanitized: Partial<WeeklySchedule> = {};
  let hasValidEntry = false;

  DAY_KEYS.forEach(day => {
    const rawDay = input[day];
    if (rawDay && typeof rawDay === 'object') {
      hasValidEntry = true;
      const dayData = rawDay as Record<string, unknown>;
      const active = Boolean(dayData.active);
      const hoursValue = Number(dayData.hours);
      const hours = active ? (Number.isFinite(hoursValue) ? Math.max(0, hoursValue) : 0) : 0;
      sanitized[day] = { active, hours };
    } else {
      sanitized[day] = { active: false, hours: 0 };
    }
  });

  if (!hasValidEntry) {
    return null;
  }

  return sanitized as WeeklySchedule;
};

const normalizeWeeklyHours = (value: unknown): WeeklyHours | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const input = value as Record<string, unknown>;
  const sanitized: Partial<WeeklyHours> = {};
  let hasValidEntry = false;

  DAY_KEYS.forEach(day => {
    const rawValue = input[day];
    if (rawValue !== undefined && rawValue !== null) {
      hasValidEntry = true;
    }
    const numericValue = Number(rawValue);
    sanitized[day] = Number.isFinite(numericValue) ? Math.max(0, numericValue) : 0;
  });

  if (!hasValidEntry) {
    return null;
  }

  return sanitized as WeeklyHours;
};

const ensureWeeklyScheduleShape = (schedule: WeeklySchedule): WeeklySchedule => {
  const normalized: Partial<WeeklySchedule> = {};
  DAY_KEYS.forEach(day => {
    const entry = schedule[day];
    const active = Boolean(entry?.active);
    const hoursValue = Number(entry?.hours);
    normalized[day] = {
      active,
      hours: active ? (Number.isFinite(hoursValue) ? Math.max(0, hoursValue) : 0) : 0,
    };
  });
  return normalized as WeeklySchedule;
};

const ensureWeeklyHoursShape = (hours: WeeklyHours): WeeklyHours => {
  const normalized: Partial<WeeklyHours> = {};
  DAY_KEYS.forEach(day => {
    const value = Number(hours?.[day]);
    normalized[day] = Number.isFinite(value) ? Math.max(0, value) : 0;
  });
  return normalized as WeeklyHours;
};

const readLocalBaseSchedules = (): Record<string, WeeklySchedule> => {
  const stored = getLocalData<Record<string, WeeklySchedule>>(BASE_SCHEDULE_STORAGE_KEY, {});
  const sanitized: Record<string, WeeklySchedule> = {};
  Object.entries(stored || {}).forEach(([empleadoId, schedule]) => {
    const normalized = normalizeWeeklySchedule(schedule);
    if (normalized) {
      sanitized[empleadoId] = normalized;
    }
  });
  return sanitized;
};

const persistLocalBaseSchedule = (empleadoId: string, schedule: WeeklySchedule) => {
  const current = readLocalBaseSchedules();
  current[empleadoId] = ensureWeeklyScheduleShape(schedule);
  setLocalData(BASE_SCHEDULE_STORAGE_KEY, current);
};

const readLocalWeeklyHours = (): Record<string, EmployeeWeeklyRecords> => {
  const stored = getLocalData<Record<string, EmployeeWeeklyRecords>>(WEEKLY_HOURS_STORAGE_KEY, {});
  const sanitized: Record<string, EmployeeWeeklyRecords> = {};

  Object.entries(stored || {}).forEach(([empleadoId, weeks]) => {
    const sanitizedWeeks: EmployeeWeeklyRecords = {};
    Object.entries(weeks || {}).forEach(([weekKey, value]) => {
      const normalized = normalizeWeeklyHours(value);
      if (normalized) {
        sanitizedWeeks[weekKey] = normalized;
      }
    });
    if (Object.keys(sanitizedWeeks).length > 0) {
      sanitized[empleadoId] = sanitizedWeeks;
    }
  });

  return sanitized;
};

const persistLocalWeeklyHours = (empleadoId: string, weekKey: string, hours: WeeklyHours) => {
  const current = readLocalWeeklyHours();
  const employeeWeeks: EmployeeWeeklyRecords = {
    ...(current[empleadoId] || {}),
    [weekKey]: ensureWeeklyHoursShape(hours),
  };
  current[empleadoId] = employeeWeeks;
  setLocalData(WEEKLY_HOURS_STORAGE_KEY, current);
};

const mapSupabaseCreditHistoryEntry = (record: any): EmployeeCreditHistoryEntry | null => {
  if (!record || typeof record !== 'object') {
    return null;
  }

  const id = typeof record.id === 'string' ? record.id : record.id?.toString?.();
  const empleadoId =
    typeof record.empleado_id === 'string'
      ? record.empleado_id
      : typeof record.empleadoId === 'string'
        ? record.empleadoId
        : undefined;

  if (!id || !empleadoId) {
    return null;
  }

  const rawTimestamp = record.timestamp ?? record.created_at ?? new Date().toISOString();
  const timestamp = new Date(rawTimestamp).toISOString();
  const monto = Math.max(0, Math.round(Number(record.monto) || 0));
  const tipo: 'cargo' | 'abono' = record.tipo === 'abono' ? 'abono' : 'cargo';
  const empleadoNombre =
    record?.empleado?.nombre ?? record?.empleado_nombre ?? record?.empleadoNombre ?? undefined;
  const orderId = typeof record.order_id === 'string' ? record.order_id : record.orderId;
  const orderNumero =
    typeof record.order_numero === 'number'
      ? record.order_numero
      : typeof record.orderNumero === 'number'
        ? record.orderNumero
        : undefined;

  return {
    id,
    empleadoId,
    empleadoNombre,
    orderId: typeof orderId === 'string' ? orderId : undefined,
    orderNumero,
    monto,
    tipo,
    timestamp,
  };
};

export const fetchEmployeeCredits = async (): Promise<EmployeeCreditRecord[]> => {
  if (!(await ensureSupabaseReady())) {
    return [];
  }

  const { data, error } = await supabase
    .from('employee_credit_history')
    .select(`
      id,
      empleado_id,
      order_id,
      order_numero,
      monto,
      tipo,
      timestamp,
      empleado:empleados ( id, nombre )
    `)
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('[dataService] No se pudo obtener el historial de crédito de empleados.', error);
    throw error;
  }

  const records = new Map<string, { empleadoId: string; empleadoNombre?: string; saldo: number; history: EmployeeCreditHistoryEntry[] }>();

  for (const entry of data ?? []) {
    const normalized = mapSupabaseCreditHistoryEntry(entry);
    if (!normalized) {
      continue;
    }

    const key = normalized.empleadoId;
    let target = records.get(key);
    if (!target) {
      target = {
        empleadoId: key,
        empleadoNombre: normalized.empleadoNombre,
        saldo: 0,
        history: [],
      };
      records.set(key, target);
    }

    target.saldo += normalized.tipo === 'cargo' ? normalized.monto : -normalized.monto;
    const balanceAfter = target.saldo;
    target.history.push({ ...normalized, balanceAfter });
    if (!target.empleadoNombre && normalized.empleadoNombre) {
      target.empleadoNombre = normalized.empleadoNombre;
    }
  }

  return Array.from(records.values())
    .map((record) => ({
      empleadoId: record.empleadoId,
      empleadoNombre: record.empleadoNombre,
      total: Math.round(record.saldo),
      history: record.history
        .slice()
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    }))
    .sort((a, b) => b.total - a.total);
};

interface AddEmployeeCreditOptions {
  empleadoId: string;
  monto: number;
  orderId?: string;
  orderNumero?: number;
}

export const addEmployeeCredit = async ({ empleadoId, monto, orderId, orderNumero }: AddEmployeeCreditOptions): Promise<void> => {
  const amount = Math.max(0, Math.round(Number(monto) || 0));
  if (!empleadoId || amount <= 0) {
    return;
  }

  if (!(await ensureSupabaseReady())) {
    throw new Error('No se pudo registrar el crédito de empleado porque la base de datos no está disponible.');
  }

  const payload = {
    empleado_id: empleadoId,
    order_id: orderId ?? null,
    order_numero: orderNumero ?? null,
    monto: amount,
    tipo: 'cargo' as const,
  };

  const { error } = await supabase.from('employee_credit_history').insert(payload);
  if (error) {
    console.error('[dataService] Error registrando crédito de empleado.', error);
    throw error;
  }

  notifyEmployeeCreditUpdate();
};

interface SettleEmployeeCreditBalanceOptions {
  empleadoId: string;
  monto: number;
  orderId?: string;
  orderNumero?: number;
}

const settleEmployeeCreditBalance = async ({ empleadoId, monto, orderId, orderNumero }: SettleEmployeeCreditBalanceOptions): Promise<void> => {
  const amount = Math.max(0, Math.round(Number(monto) || 0));
  if (!empleadoId || amount <= 0) {
    return;
  }

  if (!(await ensureSupabaseReady())) {
    throw new Error('No se pudo registrar el abono del crédito porque la base de datos no está disponible.');
  }

  const payload = {
    empleado_id: empleadoId,
    order_id: orderId ?? null,
    order_numero: orderNumero ?? null,
    monto: amount,
    tipo: 'abono' as const,
  };

  const { error } = await supabase.from('employee_credit_history').insert(payload);
  if (error) {
    console.error('[dataService] Error registrando abono de crédito de empleado.', error);
    throw error;
  }

  notifyEmployeeCreditUpdate();
};

const toOptionalPaymentMethod = (method?: string | null): PaymentMethod | undefined => {
  if (method && PAYMENT_METHODS.includes(method as PaymentMethod)) {
    return method as PaymentMethod;
  }
  return undefined;
};

const normalizePaymentMethod = (method?: string | null, fallback: PaymentMethod = 'efectivo'): PaymentMethod => {
  return toOptionalPaymentMethod(method) ?? fallback;
};

const extractPaymentMethodValue = (record: any): string | null => {
  if (!record || typeof record !== 'object') {
    return null;
  }
  if (typeof record.metodoPago === 'string') {
    return record.metodoPago;
  }
  if (typeof record.metodopago === 'string') {
    return record.metodopago;
  }
  return null;
};

const SUPABASE_GASTOS_PAYMENT_COLUMN = 'metodopago';

const SUPABASE_ORDER_PAYMENT_METHODS = ['efectivo', 'nequi', 'tarjeta'] as const;
type SupabaseOrderPaymentMethod = typeof SUPABASE_ORDER_PAYMENT_METHODS[number];

const SUPABASE_ORDER_PAYMENT_COLUMNS: Record<SupabaseOrderPaymentMethod, string> = {
  efectivo: 'pago_efectivo',
  nequi: 'pago_nequi',
  tarjeta: 'pago_tarjeta',
};

const parseSupabasePaymentAmount = (value: any): number => {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount) || amount <= 0) {
    return 0;
  }
  return Math.round(amount);
};

const extractSupabasePaymentAllocations = (record: any): PaymentAllocation[] => {
  if (!record || typeof record !== 'object') {
    return [];
  }

  const allocations: PaymentAllocation[] = [];
  for (const method of SUPABASE_ORDER_PAYMENT_METHODS) {
    const column = SUPABASE_ORDER_PAYMENT_COLUMNS[method];
    const value = parseSupabasePaymentAmount(record[column]);
    if (value > 0) {
      allocations.push({ metodo: method, monto: value });
    }
  }
  return allocations;
};

const buildSupabaseOrderPaymentPayload = (allocations: PaymentAllocation[]): Record<string, number> => {
  const totals: Record<SupabaseOrderPaymentMethod, number> = {
    efectivo: 0,
    nequi: 0,
    tarjeta: 0,
  };

  allocations.forEach((allocation) => {
    if (SUPABASE_ORDER_PAYMENT_METHODS.includes(allocation.metodo as SupabaseOrderPaymentMethod)) {
      const method = allocation.metodo as SupabaseOrderPaymentMethod;
      totals[method] += Math.round(allocation.monto);
    }
  });

  return Object.fromEntries(
    SUPABASE_ORDER_PAYMENT_METHODS.map((method) => [
      SUPABASE_ORDER_PAYMENT_COLUMNS[method],
      totals[method],
    ])
  );
};

interface OrderCreditMetadata {
  type: 'empleados';
  amount: number;
  assignedAt: string;
  employeeId?: string;
  employeeName?: string;
}

interface OrderMetadata {
  paymentStatus?: PaymentStatus;
  paymentAllocations?: PaymentAllocation[];
  credit?: OrderCreditMetadata;
}

const ORDER_METADATA_KEY = 'savia-order-metadata';

const loadOrderMetadataMap = (): Record<string, OrderMetadata> => {
  return getLocalData<Record<string, OrderMetadata>>(ORDER_METADATA_KEY, {});
};

const persistOrderMetadataMap = (metadata: Record<string, OrderMetadata>): void => {
  setLocalData(ORDER_METADATA_KEY, metadata);
};

const getOrderMetadata = (orderId: string): OrderMetadata | undefined => {
  const metadata = loadOrderMetadataMap();
  return metadata[orderId];
};

const mergeOrderMetadata = (
  orderId: string,
  updates: Partial<OrderMetadata> & { credit?: OrderCreditMetadata | null }
): OrderMetadata => {
  const metadata = loadOrderMetadataMap();
  const existing = metadata[orderId] ?? {};
  const next: OrderMetadata = { ...existing };

  if (updates.paymentStatus) {
    next.paymentStatus = updates.paymentStatus;
  } else if ('paymentStatus' in updates && updates.paymentStatus === undefined) {
    delete next.paymentStatus;
  }

  if ('paymentAllocations' in updates) {
    next.paymentAllocations = sanitizeAllocations(updates.paymentAllocations ?? []);
  }

  if ('credit' in updates) {
    if (updates.credit) {
      next.credit = updates.credit;
    } else {
      delete next.credit;
    }
  }

  const hasPaymentInfo = !!next.paymentStatus || (next.paymentAllocations && next.paymentAllocations.length > 0);
  const hasCreditInfo = !!next.credit;

  if (!hasPaymentInfo && !hasCreditInfo) {
    delete metadata[orderId];
  } else {
    metadata[orderId] = next;
  }

  persistOrderMetadataMap(metadata);
  return next;
};

const clearOrderMetadata = (orderId: string): void => {
  const metadata = loadOrderMetadataMap();
  if (metadata[orderId]) {
    delete metadata[orderId];
    persistOrderMetadataMap(metadata);
  }
};

const syncOrderMetadata = (order: Order): void => {
  const updates: Partial<OrderMetadata> & { credit?: OrderCreditMetadata | null } = {
    paymentStatus: order.paymentStatus,
    paymentAllocations: order.paymentAllocations ?? [],
  };
  if (order.creditInfo) {
    updates.credit = {
      type: order.creditInfo.type,
      amount: Math.round(order.creditInfo.amount),
      assignedAt: order.creditInfo.assignedAt.toISOString(),
      employeeId: order.creditInfo.employeeId,
      employeeName: order.creditInfo.employeeName,
    };
  } else {
    updates.credit = null;
  }
  mergeOrderMetadata(order.id, updates);
};

const toLocalDateKey = (input: Date | string): string => {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ensureMenuItemCode = (
  record: Partial<MenuItem> & { nombre?: string; codigo?: string; id?: string },
  prefix?: string
): string => {
  if (record.codigo && record.codigo.trim()) {
    return record.codigo.trim();
  }

  const prefixPart = prefix ? slugify(prefix) : '';
  const namePart = record.nombre ? slugify(record.nombre) : '';
  const idPart = record.id ? slugify(record.id) : '';

  const combined = [prefixPart, namePart].filter(Boolean).join('-');
  return combined || idPart || 'item';
};

const ensureMenuItemShape = (item: MenuItem): MenuItem => {
  const codigo = item.codigo?.trim() || generateMenuItemCode(item.nombre, item.categoria);
  const precio = typeof item.precio === 'number' ? item.precio : Number(item.precio ?? 0);
  const stock = typeof item.stock === 'number' ? item.stock : Number(item.stock ?? 0);
  const inventarioCategoria = item.inventarioCategoria === 'Inventariables'
    ? 'Inventariables'
    : 'No inventariables';
  const inventarioTipo = inventarioCategoria === 'Inventariables'
    ? item.inventarioTipo
    : undefined;
  const unidadMedida = inventarioCategoria === 'Inventariables' && inventarioTipo === 'gramos'
    ? item.unidadMedida
    : undefined;

  return {
    ...item,
    codigo,
    precio: Number.isFinite(precio) ? precio : 0,
    stock: Number.isFinite(stock) ? stock : 0,
    inventarioCategoria,
    inventarioTipo,
    unidadMedida,
  };
};

const toMenuItemPayload = (item: MenuItem) => {
  const sanitized = ensureMenuItemShape(item);
  return {
    id: sanitized.id,
    codigo: sanitized.codigo,
    nombre: sanitized.nombre,
    precio: sanitized.precio,
    descripcion: sanitized.descripcion ?? null,
    keywords: sanitized.keywords ?? null,
    categoria: sanitized.categoria,
    stock: sanitized.stock,
    inventariocategoria: sanitized.inventarioCategoria,
    inventariotipo: sanitized.inventarioTipo ?? null,
    unidadmedida: sanitized.unidadMedida ?? null,
  };
};

const isValidUnidadMedida = (value: unknown): MenuItem['unidadMedida'] | undefined => {
  return value === 'kg' || value === 'g' || value === 'mg' || value === 'ml'
    ? (value as MenuItem['unidadMedida'])
    : undefined;
};

const mapMenuItemRecord = (record: any): MenuItem => {
  const id = typeof record?.id === 'string' && record.id
    ? record.id
    : typeof record?.codigo === 'string' && record.codigo
      ? record.codigo
      : `menu-${Math.random().toString(36).slice(2, 10)}`;

  const rawInventarioCategoria = record?.inventarioCategoria ?? record?.inventariocategoria;

  const inventarioCategoria = rawInventarioCategoria === 'Inventariables'
    ? 'Inventariables'
    : 'No inventariables';

  const rawInventarioTipo = record?.inventarioTipo ?? record?.inventariotipo;

  const inventarioTipo = inventarioCategoria === 'Inventariables'
    ? rawInventarioTipo === 'gramos'
      ? 'gramos'
      : rawInventarioTipo === 'cantidad'
        ? 'cantidad'
        : undefined
    : undefined;

  const rawUnidadMedida = record?.unidadMedida ?? record?.unidadmedida;

  const unidadMedida = inventarioTipo === 'gramos'
    ? isValidUnidadMedida(rawUnidadMedida)
    : undefined;

  const menuItem: MenuItem = {
    id,
    codigo: ensureMenuItemCode({ ...record, id }),
    nombre: typeof record?.nombre === 'string' ? record.nombre : '',
    precio: typeof record?.precio === 'number' ? record.precio : Number(record?.precio ?? 0),
    descripcion: record?.descripcion ?? undefined,
    keywords: record?.keywords ?? undefined,
    categoria: typeof record?.categoria === 'string' ? record.categoria : '',
    stock: typeof record?.stock === 'number' ? record.stock : Number(record?.stock ?? 0),
    inventarioCategoria,
    inventarioTipo,
    unidadMedida,
  };

  return ensureMenuItemShape(menuItem);
};

const parseUnitPrice = (value: unknown, fallback: number): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
};


const mapCartItemsFromRecord = (record: any): CartItem[] => {
  if (Array.isArray(record?.order_items)) {
    return record.order_items
      .map((item: any): CartItem | null => {
        const menuRecord = item?.menu_item ?? item?.menu_items ?? item?.item;
        if (!menuRecord) {
          return null;
        }
        const menuItem = mapMenuItemRecord(menuRecord);
        const rawQuantity = typeof item?.cantidad === 'number'
          ? item.cantidad
          : Number(item?.cantidad ?? 0);
        const cantidad = Number.isFinite(rawQuantity) ? Math.max(0, rawQuantity) : 0;
        const unitPrice = parseUnitPrice(
          item?.precio_unitario ?? item?.precioUnitario ?? item?.unitPrice ?? item?.unit_price,
          menuItem.precio
        );
        const rawNotes = typeof item?.notas === 'string' ? item.notas : undefined;
        const { studentDiscount, cleanedNotes } = extractStudentDiscountFromNotes(rawNotes);
        return {
          item: menuItem,
          cantidad: cantidad,
          notas: cleanedNotes,
          precioUnitario: unitPrice,
          studentDiscount,
        };
      })
      .filter((entry): entry is CartItem => entry !== null);
  }

  if (Array.isArray(record?.items)) {
    return record.items
      .map((item: any): CartItem | null => {
        const menuRecord = item?.item ?? item?.menu_item ?? item?.menuItem ?? item;
        if (!menuRecord) {
          return null;
        }
        const menuItem = mapMenuItemRecord(menuRecord);
        const rawNotes = typeof item?.notas === 'string' ? item.notas : undefined;
        const { studentDiscount, cleanedNotes } = extractStudentDiscountFromNotes(rawNotes);
        return {
          item: menuItem,
          cantidad: typeof item?.cantidad === 'number' ? item.cantidad : Number(item?.cantidad ?? 0),
          notas: cleanedNotes,
          precioUnitario: typeof item?.precioUnitario === 'number' ? item.precioUnitario : undefined,
          studentDiscount: typeof item?.studentDiscount === 'boolean' ? item.studentDiscount : studentDiscount,
        };
      })
      .filter((entry): entry is CartItem => entry !== null);
  }

  return [];
};

const mapOrderRecord = (record: any): Order => {
  const items = mapCartItemsFromRecord(record);
  const timestamp = record?.timestamp ? new Date(record.timestamp) : new Date();

  const id = typeof record?.id === 'string' && record.id
    ? record.id
    : typeof record?.order_id === 'string' && record.order_id
      ? record.order_id
      : `order-${Math.random().toString(36).slice(2, 10)}`;

  const metodoPagoFromRecord = toOptionalPaymentMethod(extractPaymentMethodValue(record));
  const supabaseAllocations = mergeAllocations(
    sanitizeAllocations(extractSupabasePaymentAllocations(record))
  );

  const rawComputedTotal = items.reduce((sum, cartItem) => {
    return sum + getCartItemSubtotal(cartItem);
  }, 0);
  const normalizedComputedTotal = normalizeCartTotal(rawComputedTotal);
  const rawStoredTotal = Number(record?.total ?? 0);
  const hasStoredTotal = Number.isFinite(rawStoredTotal) && rawStoredTotal > 0;

  const finalTotal = rawComputedTotal > 0
    ? normalizedComputedTotal
    : hasStoredTotal
      ? normalizeCartTotal(rawStoredTotal)
      : 0;

  const baseOrder: Order = {
    id,
    numero: typeof record?.numero === 'number' ? record.numero : Number(record?.numero ?? 0),
    items,
    total: finalTotal,
    estado: (record?.estado as Order['estado']) ?? 'pendiente',
    timestamp,
    cliente_id: record?.cliente_id ?? record?.clienteId ?? undefined,
    cliente: record?.customer?.nombre ?? record?.cliente ?? undefined,
    metodoPago: metodoPagoFromRecord,
  };

  const metadata = getOrderMetadata(baseOrder.id);
  const rawAllocations = sanitizeAllocations(record?.paymentAllocations);

  let allocations: PaymentAllocation[] = supabaseAllocations;
  if (metadata?.paymentAllocations && metadata.paymentAllocations.length > 0) {
    allocations = sanitizeAllocations(metadata.paymentAllocations);
  } else if (rawAllocations.length > 0 && allocations.length === 0) {
    allocations = rawAllocations;
  } else if (allocations.length === 0 && metodoPagoFromRecord) {
    allocations = [{ metodo: metodoPagoFromRecord, monto: Math.round(baseOrder.total) }];
  }

  if (metadata && metadata.paymentAllocations && metadata.paymentAllocations.length === 0) {
    allocations = [];
  }

  const mergedAllocations = allocations.length > 0 ? mergeAllocations(allocations) : allocations;
  const derivedMetodoPago = getPrimaryMethodFromAllocations(mergedAllocations) ?? metodoPagoFromRecord;
  const paymentStatus: PaymentStatus = metadata?.paymentStatus
    ?? (record?.paymentStatus as PaymentStatus | undefined)
    ?? (Math.abs(getAllocationsTotal(mergedAllocations) - Math.round(baseOrder.total)) <= 1
      ? 'pagado'
      : 'pendiente');

  let creditInfo: OrderCreditInfo | undefined;
  const creditMeta = metadata?.credit;
  if (creditMeta && creditMeta.type === 'empleados') {
    const assignedAtRaw = creditMeta.assignedAt ? new Date(creditMeta.assignedAt) : new Date(timestamp);
    const assignedAt = Number.isNaN(assignedAtRaw.getTime()) ? new Date(timestamp) : assignedAtRaw;
    creditInfo = {
      type: 'empleados',
      amount: Math.round(
        typeof creditMeta.amount === 'number' ? creditMeta.amount : Math.round(baseOrder.total)
      ),
      assignedAt,
      employeeId: creditMeta.employeeId,
      employeeName: creditMeta.employeeName,
    };
  }

  return {
    ...baseOrder,
    paymentAllocations: mergedAllocations,
    paymentStatus,
    creditInfo,
    metodoPago: derivedMetodoPago,
  };
};

const ORDER_SELECT_COLUMNS = `
  id,
  numero,
  total,
  estado,
  timestamp,
  cliente_id,
  ${SUPABASE_ORDER_PAYMENT_COLUMNS.efectivo},
  ${SUPABASE_ORDER_PAYMENT_COLUMNS.nequi},
  ${SUPABASE_ORDER_PAYMENT_COLUMNS.tarjeta},
  customer:customers ( id, nombre ),
  order_items (
    id,
    cantidad,
    notas,
    menu_item:menu_items (
      id,
      codigo,
      nombre,
      precio,
      descripcion,
      keywords,
      categoria,
      stock,
      inventariocategoria,
      inventariotipo,
      unidadmedida
    )
  )
`;

const loadLocalOrders = (): Order[] => {
  return getLocalData<Order[]>('savia-orders', []).map(mapOrderRecord);
};

const persistLocalOrders = (orders: Order[]): void => {
  orders.forEach(syncOrderMetadata);
  setLocalData('savia-orders', orders);
};

const upsertLocalOrder = (order: Order): void => {
  const orders = loadLocalOrders();
  const index = orders.findIndex((entry) => entry.id === order.id);
  if (index >= 0) {
    orders[index] = order;
  } else {
    orders.push(order);
  }
  persistLocalOrders(orders);
};

const normalizeGastoRecord = (gasto: any): Gasto => ({
  id: typeof gasto?.id === 'string' ? gasto.id : `gasto-${Math.random().toString(36).slice(2, 10)}`,
  descripcion: gasto?.descripcion ?? '',
  monto: typeof gasto?.monto === 'number' ? gasto.monto : Number(gasto?.monto ?? 0),
  categoria: gasto?.categoria ?? '',
  fecha: parseDateInputValue(gasto?.fecha),
  created_at: gasto?.created_at ? new Date(gasto.created_at) : undefined,
  metodoPago: normalizePaymentMethod(extractPaymentMethodValue(gasto)),
});

type MethodTotals = Record<PaymentMethod, number>;

const zeroMethodTotals = (): MethodTotals => ({
  efectivo: 0,
  tarjeta: 0,
  nequi: 0
});

interface DailyAccumulator {
  ingresosTotales: number;
  egresosTotales: number;
  ingresosPorMetodo: MethodTotals;
  egresosPorMetodo: MethodTotals;
}

const computeLocalBalance = (orders: Order[], gastos: Gasto[]): BalanceResumen[] => {
  const accumulator = new Map<string, DailyAccumulator>();

  const getAccumulator = (key: string): DailyAccumulator => {
    let entry = accumulator.get(key);
    if (!entry) {
      entry = {
        ingresosTotales: 0,
        egresosTotales: 0,
        ingresosPorMetodo: zeroMethodTotals(),
        egresosPorMetodo: zeroMethodTotals()
      };
      accumulator.set(key, entry);
    }
    return entry;
  };

  orders.forEach((order) => {
    if (determinePaymentStatus(order) !== 'pagado') {
      return;
    }

    const date = new Date(order.timestamp);
    if (Number.isNaN(date.getTime())) return;
    const key = toLocalDateKey(date);
    if (!key) return;
    const entry = getAccumulator(key);
    const allocations = getOrderAllocations(order);
    if (allocations.length === 0) {
      return;
    }

    const totalPagado = getAllocationsTotal(allocations);
    entry.ingresosTotales += totalPagado;
    allocations.forEach(({ metodo, monto }) => {
      entry.ingresosPorMetodo[metodo] += monto;
    });
  });

  gastos.forEach((gasto) => {
    const date = new Date(gasto.fecha);
    if (Number.isNaN(date.getTime())) return;
    const key = toLocalDateKey(date);
    if (!key) return;
    const entry = getAccumulator(key);
    const method = normalizePaymentMethod(gasto.metodoPago);
    entry.egresosTotales += gasto.monto;
    entry.egresosPorMetodo[method] += gasto.monto;
  });

  const sortedDates = Array.from(accumulator.keys()).sort();
  if (sortedDates.length === 0) {
    return [];
  }

  const results: BalanceResumen[] = [];
  let saldoTotal = 0;
  let acumuladoMetodo: MethodTotals = zeroMethodTotals();

  sortedDates.forEach((date) => {
    const entry = accumulator.get(date)!;
    const saldoEfectivoDia = entry.ingresosPorMetodo.efectivo - entry.egresosPorMetodo.efectivo;
    const saldoNequiDia = entry.ingresosPorMetodo.nequi - entry.egresosPorMetodo.nequi;
    const saldoTarjetaDia = entry.ingresosPorMetodo.tarjeta - entry.egresosPorMetodo.tarjeta;
    const balanceDiario = entry.ingresosTotales - entry.egresosTotales;

    saldoTotal += balanceDiario;
    acumuladoMetodo = {
      efectivo: acumuladoMetodo.efectivo + saldoEfectivoDia,
      tarjeta: acumuladoMetodo.tarjeta + saldoTarjetaDia,
      nequi: acumuladoMetodo.nequi + saldoNequiDia
    };

    results.push({
      fecha: date,
      ingresosTotales: entry.ingresosTotales,
      egresosTotales: entry.egresosTotales,
      balanceDiario,
      ingresosEfectivo: entry.ingresosPorMetodo.efectivo,
      egresosEfectivo: entry.egresosPorMetodo.efectivo,
      ingresosNequi: entry.ingresosPorMetodo.nequi,
      egresosNequi: entry.egresosPorMetodo.nequi,
      ingresosTarjeta: entry.ingresosPorMetodo.tarjeta,
      egresosTarjeta: entry.egresosPorMetodo.tarjeta,
      saldoEfectivoDia,
      saldoNequiDia,
      saldoTarjetaDia,
      saldoTotalAcumulado: saldoTotal,
      saldoEfectivoAcumulado: acumuladoMetodo.efectivo,
      saldoNequiAcumulado: acumuladoMetodo.nequi,
      saldoTarjetaAcumulado: acumuladoMetodo.tarjeta
    });
  });

  return results.sort((a, b) => (a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0));
};

const mapBalanceRow = (row: any): BalanceResumen => ({
  fecha: toLocalDateKey(row?.fecha) || String(row?.fecha ?? ''),
  ingresosTotales: Number(row.ingresos_totales ?? 0),
  egresosTotales: Number(row.egresos_totales ?? 0),
  balanceDiario: Number(row.balance_diario ?? 0),
  ingresosEfectivo: Number(row.ingresos_efectivo ?? 0),
  egresosEfectivo: Number(row.egresos_efectivo ?? 0),
  ingresosNequi: Number(row.ingresos_nequi ?? 0),
  egresosNequi: Number(row.egresos_nequi ?? 0),
  ingresosTarjeta: Number(row.ingresos_tarjeta ?? 0),
  egresosTarjeta: Number(row.egresos_tarjeta ?? 0),
  saldoEfectivoDia: Number(row.saldo_efectivo_dia ?? 0),
  saldoNequiDia: Number(row.saldo_nequi_dia ?? 0),
  saldoTarjetaDia: Number(row.saldo_tarjeta_dia ?? 0),
  saldoTotalAcumulado: Number(row.saldo_total_acumulado ?? 0),
  saldoEfectivoAcumulado: Number(row.saldo_efectivo_acumulado ?? 0),
  saldoNequiAcumulado: Number(row.saldo_nequi_acumulado ?? 0),
  saldoTarjetaAcumulado: Number(row.saldo_tarjeta_acumulado ?? 0)
});

const loadMenuItemsFromLocalCache = (reason?: string): MenuItem[] => {
  if (reason) {
    console.warn(`[dataService] Usando datos locales porque: ${reason}.`);
  }

  const localItems = getLocalData<MenuItem[]>('savia-menuItems', []);
  const mappedLocal = localItems.map(mapMenuItemRecord);
  console.info(`[dataService] Loaded ${mappedLocal.length} menu items from local cache.`);

  if (mappedLocal.length === 0) {
    console.warn('[dataService] Local cache does not contain any menu items.');
  }

  return mappedLocal;
};

// MENU ITEMS
export const fetchMenuItems = async (): Promise<MenuItem[]> => {
  console.info('[dataService] Fetching menu items…');

  if (await ensureSupabaseReady()) {
    try {
      const { data, error } = await supabase.from('menu_items').select('*').order('nombre');
      if (error) throw error;

      const mapped = (data || []).map(mapMenuItemRecord);
      if (mapped.length > 0) {
        console.info(`[dataService] Supabase returned ${mapped.length} menu items.`);
        setLocalData('savia-menuItems', mapped);
        return mapped;
      }

      console.warn('[dataService] Supabase returned 0 menu items. Falling back to local cache.');
      return loadMenuItemsFromLocalCache('Supabase devolvió una lista vacía');
    } catch (error) {
      console.error('[dataService] Supabase menu fetch failed. Falling back to local cache.', error);
      return loadMenuItemsFromLocalCache('hubo un error consultando Supabase');
    }
  }

  console.warn('[dataService] Supabase no está disponible. Usando datos locales.');
  return loadMenuItemsFromLocalCache();
};

export const createMenuItem = async (item: MenuItem): Promise<MenuItem> => {
  const sanitized = ensureMenuItemShape(item);
  if (await ensureSupabaseReady()) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([toMenuItemPayload(sanitized)])
        .select('*')
        .single();
      if (error) throw error;
      return mapMenuItemRecord(data);
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  // Local storage fallback
  const items = getLocalData<MenuItem[]>('savia-menuItems', []).map(mapMenuItemRecord);
  const newItems = [...items, sanitized];
  setLocalData('savia-menuItems', newItems);
  return sanitized;
};

export const updateMenuItem = async (item: MenuItem): Promise<MenuItem> => {
  const sanitized = ensureMenuItemShape(item);
  if (await ensureSupabaseReady()) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update(toMenuItemPayload(sanitized))
        .eq('id', sanitized.id)
        .select('*')
        .single();
      if (error) throw error;
      return mapMenuItemRecord(data);
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  // Local storage fallback
  const items = getLocalData<MenuItem[]>('savia-menuItems', []).map(mapMenuItemRecord);
  const updatedItems = items.map(i => i.id === sanitized.id ? sanitized : i);
  setLocalData('savia-menuItems', updatedItems);
  return sanitized;
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  if (await ensureSupabaseReady()) {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return;
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  // Local storage fallback
  const items = getLocalData<MenuItem[]>('savia-menuItems', []).map(mapMenuItemRecord);
  const filteredItems = items.filter(item => item.id !== id);
  setLocalData('savia-menuItems', filteredItems);
};

// ORDERS
export const fetchOrders = async (): Promise<Order[]> => {
  if (await ensureSupabaseReady()) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(ORDER_SELECT_COLUMNS)
        .order('timestamp', { ascending: false });
      if (error) throw error;
      const mapped = (data || []).map(mapOrderRecord);
      persistLocalOrders(mapped);
      return mapped;
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }
  return loadLocalOrders();
};

export const createOrder = async (order: Order): Promise<Order> => {
  const sanitizedItems = order.items.map((cartItem) => ({
    ...cartItem,
    item: ensureMenuItemShape(cartItem.item),
    precioUnitario: typeof cartItem.precioUnitario === 'number'
      ? cartItem.precioUnitario
      : cartItem.item.precio,
  }));
  const sanitizedAllocations = sanitizeAllocations(order.paymentAllocations ?? []);
  const paymentStatus: PaymentStatus = order.paymentStatus
    ?? (Math.abs(getAllocationsTotal(sanitizedAllocations) - Math.round(order.total)) <= 1
      ? 'pagado'
      : 'pendiente');

  const primaryMethod = sanitizedAllocations.length > 0
    ? sanitizedAllocations[0].metodo
    : undefined;
  const metodoPago = normalizePaymentMethod(order.metodoPago ?? primaryMethod);

  const sanitizedOrder: Order = {
    ...order,
    items: sanitizedItems,
    metodoPago,
    paymentAllocations: sanitizedAllocations,
    paymentStatus,
  };

  syncOrderMetadata(sanitizedOrder);

  const supabasePaymentPayload = buildSupabaseOrderPaymentPayload(sanitizedAllocations);

  if (await ensureSupabaseReady()) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            id: sanitizedOrder.id,
            numero: sanitizedOrder.numero,
            total: sanitizedOrder.total,
            estado: sanitizedOrder.estado,
            timestamp: sanitizedOrder.timestamp.toISOString(),
            cliente_id: sanitizedOrder.cliente_id ?? null,
            ...supabasePaymentPayload,
          },
        ])
      .select('*')
      .single();
      if (error) throw error;

      if (sanitizedOrder.items.length > 0) {
        const orderItemsPayload = sanitizedOrder.items.map((cartItem) => ({
          order_id: data.id,
          menu_item_id: cartItem.item.id,
          cantidad: cartItem.cantidad,
          notas: buildNotesWithStudentDiscount(
            cartItem.notas,
            cartItem.studentDiscount ?? false
          ) ?? null,
        }));
        const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload);
        if (itemsError) {
          await supabase.from('orders').delete().eq('id', data.id);
          throw itemsError;
        }
      }

      const createdOrder: Order = {
        ...sanitizedOrder,
        id: data.id,
        timestamp: new Date(data.timestamp),
        cliente_id: data.cliente_id ?? undefined,
        metodoPago: getPrimaryMethodFromAllocations(sanitizedAllocations)
          ?? sanitizedOrder.metodoPago,
      };
      upsertLocalOrder(createdOrder);
      return createdOrder;
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  // Local storage fallback
  const orders = loadLocalOrders();
  const newOrders = [...orders, sanitizedOrder];
  persistLocalOrders(newOrders);
  return sanitizedOrder;
};

export const recordOrderPayment = async (
  order: Order,
  allocations: PaymentAllocation[]
): Promise<Order> => {
  const sanitizedAllocations = mergeAllocations(sanitizeAllocations(allocations));

  if (sanitizedAllocations.length === 0) {
    throw new Error('Debe seleccionar al menos un método de pago.');
  }

  const paidTotal = getAllocationsTotal(sanitizedAllocations);
  const targetTotal = Math.round(order.total);
  const paymentStatus: PaymentStatus = Math.abs(paidTotal - targetTotal) <= 1
    ? 'pagado'
    : 'pendiente';

  const primaryMethod = getPrimaryMethodFromAllocations(sanitizedAllocations)
    ?? order.metodoPago
    ?? 'efectivo';

  const creditAllocations = sanitizedAllocations.filter(
    (allocation) => allocation.metodo === 'credito_empleados' && allocation.empleadoId
  );

  for (const allocation of creditAllocations) {
    await addEmployeeCredit({
      empleadoId: allocation.empleadoId!,
      monto: allocation.monto,
      orderId: order.id,
      orderNumero: order.numero,
    });
  }

  if (await ensureSupabaseReady()) {
    try {
      const supabasePaymentPayload = buildSupabaseOrderPaymentPayload(sanitizedAllocations);
      const { error } = await supabase
        .from('orders')
        .update(supabasePaymentPayload)
        .eq('id', order.id);
      if (error) throw error;
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  const updatedOrder: Order = {
    ...order,
    metodoPago: primaryMethod,
    paymentAllocations: sanitizedAllocations,
    paymentStatus,
    creditInfo: paymentStatus === 'pagado' ? undefined : order.creditInfo,
  };

  syncOrderMetadata(updatedOrder);
  upsertLocalOrder(updatedOrder);
  return updatedOrder;
};

interface AssignOrderCreditOptions {
  amount?: number;
  employeeId?: string;
  employeeName?: string;
}

export const assignOrderCredit = async (
  order: Order,
  options?: AssignOrderCreditOptions
): Promise<Order> => {
  const amount = Math.max(0, Math.round(options?.amount ?? order.total));
  const assignedAt = new Date();
  const rawEmployeeId = options?.employeeId?.trim();
  const employeeId = rawEmployeeId ? rawEmployeeId : undefined;
  const rawEmployeeName = options?.employeeName?.trim();
  const employeeName = rawEmployeeName ? rawEmployeeName : undefined;

  if (employeeId && amount > 0) {
    await addEmployeeCredit({
      empleadoId: employeeId,
      monto: amount,
      orderId: order.id,
      orderNumero: order.numero,
    });
  }

  const creditMetadata: OrderCreditMetadata = {
    type: 'empleados',
    amount,
    assignedAt: assignedAt.toISOString(),
    employeeId,
    employeeName,
  };

  if (order.estado !== 'entregado') {
    if (await ensureSupabaseReady()) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ estado: 'entregado' })
          .eq('id', order.id);
        if (error) throw error;
      } catch (error) {
        console.warn('Supabase not available al marcar crédito, se usará caché local:', error);
      }
    }
  }

  mergeOrderMetadata(order.id, {
    paymentStatus: 'pendiente',
    paymentAllocations: [],
    credit: creditMetadata,
  });

  const updatedOrder: Order = {
    ...order,
    estado: 'entregado',
    metodoPago: 'credito_empleados',
    paymentStatus: 'pendiente',
    paymentAllocations: [],
    creditInfo: {
      type: 'empleados',
      amount,
      assignedAt,
      employeeId,
      employeeName,
    },
  };

  upsertLocalOrder(updatedOrder);
  return updatedOrder;
};

type SettlementPaymentMethod = Extract<PaymentMethod, 'efectivo' | 'nequi' | 'tarjeta'>;

const normalizeSettlementMethod = (method: PaymentMethod): SettlementPaymentMethod => {
  if (['nequi', 'tarjeta'].includes(method)) {
    return method as SettlementPaymentMethod;
  }
  return 'efectivo';
};

interface SettleOrderCreditOptions {
  metodo: PaymentMethod;
}

export const settleOrderEmployeeCredit = async (
  order: Order,
  options: SettleOrderCreditOptions
): Promise<Order> => {
  if (!order.creditInfo) {
    throw new Error('La orden no tiene un crédito de empleados pendiente.');
  }

  const amount = Math.max(0, Math.round(order.creditInfo.amount ?? order.total));
  const employeeId = order.creditInfo.employeeId;
  const metodo = normalizeSettlementMethod(options.metodo);

  if (employeeId && amount > 0) {
    await settleEmployeeCreditBalance({
      empleadoId: employeeId,
      monto: amount,
      orderId: order.id,
      orderNumero: order.numero,
    });
  }

  const paymentAllocations: PaymentAllocation[] = amount > 0
    ? [{ metodo, monto: amount }]
    : [];

  if (await ensureSupabaseReady()) {
    try {
      const updatePayload = {
        estado: 'entregado',
        ...buildSupabaseOrderPaymentPayload(paymentAllocations),
      };
      const { error } = await supabase
        .from('orders')
        .update(updatePayload)
        .eq('id', order.id);
      if (error) throw error;
    } catch (error) {
      console.warn('Supabase no disponible al registrar el pago del crédito, se usará caché local:', error);
    }
  }

  mergeOrderMetadata(order.id, {
    paymentStatus: 'pagado',
    paymentAllocations,
    credit: null,
  });

  const updatedOrder: Order = {
    ...order,
    estado: 'entregado',
    metodoPago: metodo,
    paymentStatus: 'pagado',
    paymentAllocations,
    creditInfo: undefined,
  };

  upsertLocalOrder(updatedOrder);
  return updatedOrder;
};

export const updateOrderStatus = async (order: Order, status: Order['estado']): Promise<Order> => {
  const localOrders = loadLocalOrders();

  if (await ensureSupabaseReady()) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ estado: status })
        .eq('id', order.id)
        .select(ORDER_SELECT_COLUMNS)
        .maybeSingle();
      if (error) throw error;

      let supabaseOrder = data;

      if (!supabaseOrder && typeof order.numero === 'number') {
        const { data: numeroData, error: numeroError } = await supabase
          .from('orders')
          .update({ estado: status })
          .eq('numero', order.numero)
          .select(ORDER_SELECT_COLUMNS)
          .maybeSingle();
        if (numeroError) throw numeroError;
        supabaseOrder = numeroData ?? undefined;
      }

      if (supabaseOrder) {
        const updatedOrder = mapOrderRecord(supabaseOrder);
        upsertLocalOrder(updatedOrder);
        return updatedOrder;
      }

      console.warn(`[dataService] No se encontró la orden ${order.id} en Supabase. Se usará la caché local.`);
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  const index = localOrders.findIndex((entry) => entry.id === order.id);
  if (index === -1) {
    throw new Error(`No se encontró la orden con id ${order.id} para actualizar su estado.`);
  }

  const updatedOrder = { ...localOrders[index], estado: status };
  localOrders[index] = updatedOrder;
  persistLocalOrders(localOrders);
  return updatedOrder;
};

export const updateOrder = async (orderId: string, updates: { items?: CartItem[]; total?: number }): Promise<void> => {
  if (await ensureSupabaseReady()) {
    try {
      // Actualizar la orden principal
      if (updates.total !== undefined) {
        const { error } = await supabase
          .from('orders')
          .update({ total: updates.total })
          .eq('id', orderId);
        if (error) throw error;
      }

      // Si hay items para actualizar, primero eliminar los existentes y luego insertar los nuevos
      if (updates.items) {
        // Eliminar items existentes
        const { error: deleteError } = await supabase
          .from('order_items')
          .delete()
          .eq('order_id', orderId);
        if (deleteError) throw deleteError;

        // Insertar nuevos items
        if (updates.items.length > 0) {
          const orderItemsPayload = updates.items.map((cartItem) => ({
            order_id: orderId,
            menu_item_id: cartItem.item.id,
            cantidad: cartItem.cantidad,
            notas: buildNotesWithStudentDiscount(
              cartItem.notas,
              cartItem.studentDiscount ?? false
            ) ?? null,
          }));
          const { error: insertError } = await supabase.from('order_items').insert(orderItemsPayload);
          if (insertError) throw insertError;
      }
    }
    mergeOrderMetadata(orderId, { paymentStatus: 'pendiente', paymentAllocations: [] });
    return;
  } catch (error) {
    console.warn('Supabase not available, using local data:', error);
  }
}

  // Local storage fallback
  const orders = getLocalData<Order[]>('savia-orders', []).map(mapOrderRecord);
  const updatedOrders = orders.map(order => {
    if (order.id === orderId) {
      return {
        ...order,
        ...(updates.items && { items: updates.items }),
        ...(updates.total !== undefined && { total: updates.total })
      };
    }
    return order;
  });
  setLocalData('savia-orders', updatedOrders);
  mergeOrderMetadata(orderId, { paymentStatus: 'pendiente', paymentAllocations: [] });
};

export const deleteOrder = async (orderId: string): Promise<void> => {
  if (await ensureSupabaseReady()) {
    try {
      const { error: deleteItemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId);
      if (deleteItemsError) throw deleteItemsError;

      const { error: deleteOrderError } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
      if (deleteOrderError) throw deleteOrderError;
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  clearOrderMetadata(orderId);
  const remainingOrders = loadLocalOrders().filter(order => order.id !== orderId);
  persistLocalOrders(remainingOrders);
};

// CUSTOMERS
export const fetchCustomers = async (): Promise<Customer[]> => {
  if (await ensureSupabaseReady()) {
    try {
      const { data, error } = await supabase.from('customers').select('*');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }
  return getLocalData<Customer[]>('savia-customers', []);
};

export const createCustomer = async (customer: Customer): Promise<Customer> => {
  if (await ensureSupabaseReady()) {
    try {
      const { data, error } = await supabase.from('customers').insert([customer]).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  // Local storage fallback
  const customers = getLocalData<Customer[]>('savia-customers', []);
  const newCustomers = [...customers, customer];
  setLocalData('savia-customers', newCustomers);
  return customer;
};

export const updateCustomer = async (customer: Customer): Promise<Customer> => {
  if (await ensureSupabaseReady()) {
    try {
      const { error } = await supabase
        .from('customers')
        .update(customer)
        .eq('id', customer.id);
      if (error) throw error;
      return customer;
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  // Local storage fallback
  const customers = getLocalData<Customer[]>('savia-customers', []);
  const updatedCustomers = customers.map(c => c.id === customer.id ? customer : c);
  setLocalData('savia-customers', updatedCustomers);
  return customer;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  if (await ensureSupabaseReady()) {
    try {
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (error) throw error;
      return;
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  // Local storage fallback
  const customers = getLocalData<Customer[]>('savia-customers', []);
  const filteredCustomers = customers.filter(customer => customer.id !== id);
  setLocalData('savia-customers', filteredCustomers);
};

// EMPLEADOS
export const fetchEmpleados = async (): Promise<Empleado[]> => {
  if (await ensureSupabaseReady()) {
    try {
      const { data, error } = await supabase.from('empleados').select('*').order('nombre');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }
  return getLocalData<Empleado[]>('savia-empleados', []);
};

export const createEmpleado = async (empleado: Empleado): Promise<Empleado> => {
  if (await ensureSupabaseReady()) {
    try {
      const { data, error } = await supabase.from('empleados').insert([empleado]).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  // Local storage fallback
  const empleados = getLocalData<Empleado[]>('savia-empleados', []);
  const newEmpleados = [...empleados, empleado];
  setLocalData('savia-empleados', newEmpleados);
  return empleado;
};

export const updateEmpleado = async (empleado: Empleado): Promise<Empleado> => {
  if (await ensureSupabaseReady()) {
    try {
      const { error } = await supabase
        .from('empleados')
        .update(empleado)
        .eq('id', empleado.id);
      if (error) throw error;
      return empleado;
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  // Local storage fallback
  const empleados = getLocalData<Empleado[]>('savia-empleados', []);
  const updatedEmpleados = empleados.map(e => e.id === empleado.id ? empleado : e);
  setLocalData('savia-empleados', updatedEmpleados);
  return empleado;
};

export const deleteEmpleado = async (id: string): Promise<void> => {
  if (await ensureSupabaseReady()) {
    try {
      const { error } = await supabase.from('empleados').delete().eq('id', id);
      if (error) throw error;
      return;
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  // Local storage fallback
  const empleados = getLocalData<Empleado[]>('savia-empleados', []);
  const filteredEmpleados = empleados.filter(empleado => empleado.id !== id);
  setLocalData('savia-empleados', filteredEmpleados);
};

export const fetchEmployeeBaseSchedules = async (): Promise<Record<string, WeeklySchedule>> => {
  if (await ensureSupabaseReady()) {
    try {
      const { data, error } = await supabase.from('empleados').select('id, horario_base');
      if (error) throw error;

      const result: Record<string, WeeklySchedule> = {};
      for (const record of data ?? []) {
        const empleadoId = typeof record?.id === 'string' ? record.id : undefined;
        if (!empleadoId) continue;
        const normalized = normalizeWeeklySchedule(record?.horario_base);
        if (normalized) {
          result[empleadoId] = normalized;
        }
      }

      if (Object.keys(result).length > 0) {
        return result;
      }
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  return readLocalBaseSchedules();
};

export const saveEmployeeBaseSchedule = async (
  empleadoId: string,
  schedule: WeeklySchedule
): Promise<void> => {
  const sanitized = ensureWeeklyScheduleShape(schedule);
  let lastError: unknown = null;

  if (await ensureSupabaseReady()) {
    try {
      const { error } = await supabase
        .from('empleados')
        .update({ horario_base: sanitized })
        .eq('id', empleadoId);
      if (error) throw error;
    } catch (error) {
      console.error('Error updating employee base schedule in Supabase:', error);
      lastError = error;
    }
  }

  persistLocalBaseSchedule(empleadoId, sanitized);

  if (lastError) {
    throw lastError;
  }
};

export const fetchEmployeeWeeklyHoursForWeek = async (
  weekKey: string
): Promise<Record<string, WeeklyHours>> => {
  if (await ensureSupabaseReady()) {
    try {
      const { data, error } = await supabase
        .from('employee_weekly_hours')
        .select('empleado_id, week_key, horas')
        .eq('week_key', weekKey);
      if (error) throw error;

      const result: Record<string, WeeklyHours> = {};
      for (const record of data ?? []) {
        const empleadoId = typeof record?.empleado_id === 'string' ? record.empleado_id : undefined;
        const recordWeek = typeof record?.week_key === 'string' ? record.week_key : undefined;
        if (!empleadoId || recordWeek !== weekKey) continue;
        const normalized = normalizeWeeklyHours(record?.horas);
        if (normalized) {
          result[empleadoId] = normalized;
        }
      }

      if (Object.keys(result).length > 0) {
        return result;
      }
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  const local = readLocalWeeklyHours();
  const fallback: Record<string, WeeklyHours> = {};
  Object.entries(local).forEach(([empleadoId, weeks]) => {
    const normalized = normalizeWeeklyHours(weeks?.[weekKey]);
    if (normalized) {
      fallback[empleadoId] = normalized;
    }
  });
  return fallback;
};

export const fetchEmployeeWeeklyHours = async (
  empleadoId: string,
  weekKey: string
): Promise<WeeklyHours | null> => {
  if (await ensureSupabaseReady()) {
    try {
      const { data, error } = await supabase
        .from('employee_weekly_hours')
        .select('horas')
        .eq('empleado_id', empleadoId)
        .eq('week_key', weekKey)
        .maybeSingle();
      if (error) throw error;
      const normalized = normalizeWeeklyHours(data?.horas);
      if (normalized) {
        return normalized;
      }
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  const local = readLocalWeeklyHours();
  return normalizeWeeklyHours(local?.[empleadoId]?.[weekKey]);
};

export const fetchEmployeeWeeklyHoursHistory = async (
  empleadoId: string
): Promise<Record<string, WeeklyHours>> => {
  if (await ensureSupabaseReady()) {
    try {
      const { data, error } = await supabase
        .from('employee_weekly_hours')
        .select('week_key, horas')
        .eq('empleado_id', empleadoId)
        .order('week_key', { ascending: false });

      if (error) throw error;

      const result: Record<string, WeeklyHours> = {};
      for (const record of data ?? []) {
        const weekKey = typeof record?.week_key === 'string' ? record.week_key : undefined;
        if (!weekKey) continue;
        const normalized = normalizeWeeklyHours(record?.horas);
        if (normalized) {
          result[weekKey] = normalized;
        }
      }

      if (Object.keys(result).length > 0) {
        return result;
      }
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  const local = readLocalWeeklyHours();
  const history = local?.[empleadoId];
  if (!history) {
    return {};
  }

  const sanitized: Record<string, WeeklyHours> = {};
  Object.entries(history).forEach(([weekKey, value]) => {
    const normalized = normalizeWeeklyHours(value);
    if (normalized) {
      sanitized[weekKey] = normalized;
    }
  });
  return sanitized;
};

export const saveEmployeeWeeklyHours = async (
  empleadoId: string,
  weekKey: string,
  hours: WeeklyHours
): Promise<void> => {
  const sanitized = ensureWeeklyHoursShape(hours);
  let lastError: unknown = null;

  if (await ensureSupabaseReady()) {
    try {
      const { error } = await supabase
        .from('employee_weekly_hours')
        .upsert(
          {
            empleado_id: empleadoId,
            week_key: weekKey,
            horas: sanitized,
          },
          { onConflict: 'empleado_id,week_key' }
        );
      if (error) throw error;
    } catch (error) {
      console.error('Error saving weekly hours in Supabase:', error);
      lastError = error;
    }
  }

  persistLocalWeeklyHours(empleadoId, weekKey, sanitized);

  if (lastError) {
    throw lastError;
  }
};

// GASTOS
export const fetchGastos = async (): Promise<Gasto[]> => {
  if (await ensureSupabaseReady()) {
    try {
      const { data, error } = await supabase
        .from('gastos')
        .select('*')
        .order('fecha', { ascending: false });
      if (error) throw error;
      return (data || []).map(normalizeGastoRecord);
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }
  const gastos = getLocalData<Gasto[]>('savia-gastos', []);
  return gastos.map(normalizeGastoRecord);
};

export const createGasto = async (gasto: Gasto): Promise<Gasto> => {
  const sanitized = normalizeGastoRecord(gasto);
  if (await ensureSupabaseReady()) {
    try {
      const fechaValue = formatDateInputValue(
        sanitized.fecha instanceof Date ? sanitized.fecha : new Date(sanitized.fecha)
      );

      const { data, error } = await supabase
        .from('gastos')
        .insert([
          {
            id: sanitized.id,
            descripcion: sanitized.descripcion,
            monto: sanitized.monto,
            categoria: sanitized.categoria,
            fecha: fechaValue,
            created_at: sanitized.created_at instanceof Date
              ? sanitized.created_at.toISOString()
              : sanitized.created_at ?? new Date().toISOString(),
            [SUPABASE_GASTOS_PAYMENT_COLUMN]: sanitized.metodoPago,
          },
        ])
        .select('*')
        .single();
      if (error) throw error;
      return normalizeGastoRecord(data);
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  // Local storage fallback
  const gastos = getLocalData<Gasto[]>('savia-gastos', []).map(normalizeGastoRecord);
  const newGastos = [...gastos, sanitized];
  setLocalData('savia-gastos', newGastos);
  return sanitized;
};

export const updateGasto = async (gasto: Gasto): Promise<Gasto> => {
  const sanitized = normalizeGastoRecord(gasto);
  if (await ensureSupabaseReady()) {
    try {
      const fechaValue = formatDateInputValue(
        sanitized.fecha instanceof Date ? sanitized.fecha : new Date(sanitized.fecha)
      );

      const { error } = await supabase
        .from('gastos')
        .update({
          descripcion: sanitized.descripcion,
          monto: sanitized.monto,
          categoria: sanitized.categoria,
          fecha: fechaValue,
          [SUPABASE_GASTOS_PAYMENT_COLUMN]: sanitized.metodoPago,
        })
        .eq('id', sanitized.id);
      if (error) throw error;
      return sanitized;
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  // Local storage fallback
  const gastos = getLocalData<Gasto[]>('savia-gastos', []).map(normalizeGastoRecord);
  const updatedGastos = gastos.map(g => g.id === sanitized.id ? sanitized : g);
  setLocalData('savia-gastos', updatedGastos);
  return sanitized;
};

export const deleteGasto = async (id: string): Promise<void> => {
  if (await ensureSupabaseReady()) {
    try {
      const { error } = await supabase.from('gastos').delete().eq('id', id);
      if (error) throw error;
      return;
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  // Local storage fallback
  const gastos = getLocalData<Gasto[]>('savia-gastos', []).map(normalizeGastoRecord);
  const filteredGastos = gastos.filter(gasto => gasto.id !== id);
  setLocalData('savia-gastos', filteredGastos);
};

// BALANCE
export const fetchBalanceResumen = async (): Promise<BalanceResumen[]> => {
  if (await ensureSupabaseReady()) {
    try {
      const { data, error } = await supabase
        .from('balance_caja')
        .select('*')
        .order('fecha', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapBalanceRow);
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  const localOrders = getLocalData<Order[]>('savia-orders', []).map(mapOrderRecord);
  const localGastos = getLocalData<Gasto[]>('savia-gastos', []).map(normalizeGastoRecord);
  return computeLocalBalance(localOrders, localGastos);
};

export const dataService = {
  fetchMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  fetchOrders,
  createOrder,
  recordOrderPayment,
  assignOrderCredit,
  settleOrderEmployeeCredit,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  fetchEmpleados,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
  fetchEmployeeBaseSchedules,
  saveEmployeeBaseSchedule,
  fetchEmployeeWeeklyHours,
  fetchEmployeeWeeklyHoursForWeek,
  fetchEmployeeWeeklyHoursHistory,
  saveEmployeeWeeklyHours,
  fetchEmployeeCredits,
  fetchGastos,
  createGasto,
  updateGasto,
  deleteGasto,
  fetchBalanceResumen,
  checkDatabaseConnection,
} as const;

export default dataService;
