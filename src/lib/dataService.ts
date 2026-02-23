import {
  MenuItem,
  Order,
  Customer,
  Empleado,
  Gasto,
  GastoInventarioItem,
  BalanceResumen,
  PaymentMethod,
  ProvisionTransfer,
  CajaPocket,
  CartItem,
  PaymentAllocation,
  PaymentStatus,
  DatabaseConnectionState,
  EmployeeCreditRecord,
  EmployeeCreditHistoryEntry,
  InventoryPriceHistoryRecord,
  WeeklySchedule,
  WeeklyHours,
  DAY_KEYS,
} from '../types';
import { supabase } from './supabaseClient';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { getLocalData, setLocalData } from '../data/localData';
import { formatDateInputValue, parseDateInputValue } from '../utils/format';
import { slugify, generateMenuItemCode } from '../utils/strings';
import {
  buildNotesWithStudentDiscount,
  extractStudentDiscountFromNotes,
  getCartItemBaseUnitPrice,
  getCartItemSubtotal,
  normalizeCartTotal,
} from '../utils/cart';
import {
  determinePaymentStatus,
  getAllocationsTotal,
  getOrderAllocations,
  getOrderPaymentDate,
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

const PAYMENT_METHODS: PaymentMethod[] = ['efectivo', 'tarjeta', 'nequi', 'provision_caja', 'credito_empleados'];

export const EMPLOYEE_CREDIT_UPDATED_EVENT = 'savia-employee-credit-updated';

const BASE_SCHEDULE_STORAGE_KEY = 'savia-horarios-base';
const WEEKLY_HOURS_STORAGE_KEY = 'savia-horarios-semanales';
const PROVISION_TRANSFERS_STORAGE_KEY = 'savia-provision-transfers';
const CAJA_POCKETS_STORAGE_KEY = 'savia-caja-bolsillos';
const GASTO_INVENTARIO_ITEMS_STORAGE_KEY = 'savia-gasto-inventario-items';
const INVENTORY_PRICE_HISTORY_STORAGE_KEY = 'savia-inventory-price-history';

const notifyEmployeeCreditUpdate = () => {
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent(EMPLOYEE_CREDIT_UPDATED_EVENT));
  }
};

type EmployeeWeeklyRecords = Record<string, WeeklyHours>;
type GastoInventarioItemDraft = {
  menuItemId: string;
  cantidad: number;
  inventarioTipo?: 'cantidad' | 'peso' | 'volumen';
  unidadInventario?: string;
  precioUnitario?: number;
  lugarCompra?: string;
};

type InventoryPriceHistoryEntry = InventoryPriceHistoryRecord;

type InventoryPriceStat = {
  lastTotalPrice: number;
  lastUnitPrice: number;
  bestUnitPrice: number;
  lastPlace?: string;
  bestPlace?: string;
};

const normalizeGastoInventarioItemRecord = (item: any): GastoInventarioItem | null => {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const menuItemIdRaw = item.menuItemId ?? item.menu_item_id;
  const menuItemId = typeof menuItemIdRaw === 'string' ? menuItemIdRaw : undefined;
  if (!menuItemId) {
    return null;
  }

  const rawCantidad = item.cantidad;
  const cantidad = typeof rawCantidad === 'number' ? rawCantidad : Number(rawCantidad ?? 0);
  if (!Number.isFinite(cantidad) || cantidad <= 0) {
    return null;
  }

  const rawTipo = item.inventarioTipo ?? item.inventario_tipo;
  const inventarioTipo = rawTipo === 'cantidad' || rawTipo === 'peso' || rawTipo === 'volumen'
    ? rawTipo
    : undefined;

  const nombre = (() => {
    if (typeof item?.nombre === 'string' && item.nombre.trim()) {
      return item.nombre.trim();
    }
    if (typeof item?.menu_item?.nombre === 'string' && item.menu_item.nombre.trim()) {
      return item.menu_item.nombre.trim();
    }
    if (typeof item?.menuItem?.nombre === 'string' && item.menuItem.nombre.trim()) {
      return item.menuItem.nombre.trim();
    }
    return 'Producto';
  })();

  const rawPrice = item.precioUnitario ?? item.precio_unitario ?? item?.menu_item?.precio ?? item?.menuItem?.precio;
  const priceValue = typeof rawPrice === 'number' ? rawPrice : Number(rawPrice ?? 0);
  const precioUnitario = Number.isFinite(priceValue) && priceValue >= 0 ? priceValue : undefined;

  const gastoIdRaw = item.gastoId ?? item.gasto_id;
  const gastoId = typeof gastoIdRaw === 'string' ? gastoIdRaw : undefined;
  const id = typeof item.id === 'string' ? item.id : undefined;
  const unidadRaw = item.unidadInventario ?? item.unidad_inventario;
  const unidadInventario = typeof unidadRaw === 'string' ? unidadRaw : undefined;

  return {
    id,
    gastoId,
    menuItemId,
    nombre,
    cantidad,
    inventarioTipo,
    unidadInventario,
    precioUnitario,
  };
};

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

const normalizeMethodAlias = (method?: string | null): string | null => {
  if (typeof method !== 'string') {
    return null;
  }
  const trimmed = method.trim();
  if (!trimmed) {
    return null;
  }
  const normalized = trimmed.toLowerCase();
  if (normalized === 'transferencia') {
    return 'nequi';
  }
  return normalized;
};

const toOptionalPaymentMethod = (method?: string | null): PaymentMethod | undefined => {
  const alias = normalizeMethodAlias(method);
  if (alias && PAYMENT_METHODS.includes(alias as PaymentMethod)) {
    return alias as PaymentMethod;
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
  paymentRegisteredAt?: string;
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

  if (typeof updates.paymentRegisteredAt === 'string') {
    next.paymentRegisteredAt = updates.paymentRegisteredAt;
  } else if ('paymentRegisteredAt' in updates && updates.paymentRegisteredAt === undefined) {
    delete next.paymentRegisteredAt;
  }

  if ('credit' in updates) {
    if (updates.credit) {
      next.credit = updates.credit;
    } else {
      delete next.credit;
    }
  }

  const hasPaymentInfo =
    !!next.paymentStatus ||
    (next.paymentAllocations && next.paymentAllocations.length > 0) ||
    !!next.paymentRegisteredAt;
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
    paymentRegisteredAt: order.paymentRegisteredAt
      ? order.paymentRegisteredAt.toISOString()
      : undefined,
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

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isUuid = (value: string | undefined | null): value is string => {
  return typeof value === 'string' && UUID_PATTERN.test(value.trim());
};

const CUSTOM_UNIT_PRICE_NOTE_PREFIX = '__unit_price__:';

const extractCustomUnitPriceFromNotes = (notes?: string | null): { price?: number; cleanedNotes?: string } => {
  if (!notes) {
    return { price: undefined, cleanedNotes: undefined };
  }
  const lines = notes.split('\n');
  let detectedPrice: number | undefined;
  const cleanedLines = lines.filter((line) => {
    const trimmed = line.trim();
    if (!trimmed.toLowerCase().startsWith(CUSTOM_UNIT_PRICE_NOTE_PREFIX)) {
      return true;
    }
    const raw = trimmed.slice(CUSTOM_UNIT_PRICE_NOTE_PREFIX.length).trim();
    const value = Number(raw);
    if (Number.isFinite(value) && value >= 0) {
      detectedPrice = value;
    }
    return false;
  });
  const cleanedNotes = cleanedLines.join('\n').trim();
  return { price: detectedPrice, cleanedNotes: cleanedNotes || undefined };
};

const appendCustomUnitPriceToNotes = (notes: string | undefined, unitPrice: number, fallbackPrice: number): string | undefined => {
  if (!Number.isFinite(unitPrice) || unitPrice < 0) {
    return notes;
  }
  if (Math.abs(unitPrice - fallbackPrice) < 1) {
    return notes;
  }
  const priceLine = `${CUSTOM_UNIT_PRICE_NOTE_PREFIX}${Math.round(unitPrice)}`;
  return notes ? `${notes}\n${priceLine}` : priceLine;
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
    ? 'g'
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
  return value === 'g' ? 'g' : undefined;
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
    ? isValidUnidadMedida(rawUnidadMedida) ?? 'g'
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

const createFallbackMenuItem = (menuItemId: string, rawName?: string): MenuItem => {
  return ensureMenuItemShape({
    id: menuItemId,
    codigo: ensureMenuItemCode({ id: menuItemId, nombre: rawName ?? 'producto' }, 'fallback'),
    nombre: rawName && rawName.trim() ? rawName : 'Producto no disponible',
    precio: 0,
    categoria: 'Sin categoría',
    stock: 0,
    inventarioCategoria: 'No inventariables',
  });
};

const normalizeLookupKey = (value: string | undefined | null): string => {
  if (!value) {
    return '';
  }
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ');
};

const resolveOrderItemsForSupabase = async (items: CartItem[]): Promise<CartItem[]> => {
  const unresolved = items.filter((cartItem) => !isUuid(cartItem.item.id));
  if (unresolved.length === 0) {
    return items;
  }

  const { data, error } = await supabase
    .from('menu_items')
    .select('id, codigo, nombre, categoria');
  if (error) {
    throw error;
  }

  const byCode = new Map<string, string>();
  const byNameAndCategory = new Map<string, string>();
  (data ?? []).forEach((row) => {
    const id = typeof row?.id === 'string' ? row.id : undefined;
    if (!isUuid(id)) {
      return;
    }
    const code = normalizeLookupKey(typeof row?.codigo === 'string' ? row.codigo : '');
    const name = normalizeLookupKey(typeof row?.nombre === 'string' ? row.nombre : '');
    const category = normalizeLookupKey(typeof row?.categoria === 'string' ? row.categoria : '');
    if (code) {
      byCode.set(code, id);
    }
    if (name) {
      byNameAndCategory.set(`${name}|${category}`, id);
      byNameAndCategory.set(`${name}|`, id);
    }
  });

  const mappedItems = items.map((cartItem) => {
    if (isUuid(cartItem.item.id)) {
      return cartItem;
    }
    const codeKey = normalizeLookupKey(cartItem.item.codigo ?? '');
    const nameKey = normalizeLookupKey(cartItem.item.nombre ?? '');
    const categoryKey = normalizeLookupKey(cartItem.item.categoria ?? '');
    const mappedId = byCode.get(codeKey)
      ?? byNameAndCategory.get(`${nameKey}|${categoryKey}`)
      ?? byNameAndCategory.get(`${nameKey}|`);
    if (!mappedId) {
      return cartItem;
    }
    return {
      ...cartItem,
      item: {
        ...cartItem.item,
        id: mappedId,
      },
    };
  });

  const stillUnresolved = mappedItems.filter((cartItem) => !isUuid(cartItem.item.id));
  if (stillUnresolved.length === 0) {
    return mappedItems;
  }

  const toUpsert = Array.from(
    new Map(
      stillUnresolved.map((cartItem) => {
        const codigo = ensureMenuItemCode(cartItem.item);
        return [
          codigo,
          {
            codigo,
            nombre: cartItem.item.nombre?.trim() || 'Producto',
            precio: Math.max(0, Math.round(cartItem.precioUnitario ?? cartItem.item.precio ?? 0)),
            categoria: cartItem.item.categoria?.trim() || 'Sin categoría',
            stock: 0,
            inventariocategoria: 'No inventariables',
            inventariotipo: null,
            unidadmedida: null,
            descripcion: cartItem.item.descripcion ?? null,
            keywords: cartItem.item.keywords ?? null,
          },
        ];
      })
    ).values()
  );

  if (toUpsert.length > 0) {
    const { data: upserted, error: upsertError } = await supabase
      .from('menu_items')
      .upsert(toUpsert, { onConflict: 'codigo' })
      .select('id, codigo, nombre, categoria');
    if (upsertError) {
      throw upsertError;
    }

    (upserted ?? []).forEach((row) => {
      const id = typeof row?.id === 'string' ? row.id : undefined;
      if (!isUuid(id)) {
        return;
      }
      const code = normalizeLookupKey(typeof row?.codigo === 'string' ? row.codigo : '');
      const name = normalizeLookupKey(typeof row?.nombre === 'string' ? row.nombre : '');
      const category = normalizeLookupKey(typeof row?.categoria === 'string' ? row.categoria : '');
      if (code) {
        byCode.set(code, id);
      }
      if (name) {
        byNameAndCategory.set(`${name}|${category}`, id);
        byNameAndCategory.set(`${name}|`, id);
      }
    });
  }

  return mappedItems.map((cartItem) => {
    if (isUuid(cartItem.item.id)) {
      return cartItem;
    }
    const codeKey = normalizeLookupKey(cartItem.item.codigo ?? '');
    const nameKey = normalizeLookupKey(cartItem.item.nombre ?? '');
    const categoryKey = normalizeLookupKey(cartItem.item.categoria ?? '');
    const mappedId = byCode.get(codeKey)
      ?? byNameAndCategory.get(`${nameKey}|${categoryKey}`)
      ?? byNameAndCategory.get(`${nameKey}|`);
    if (!mappedId) {
      return cartItem;
    }
    return {
      ...cartItem,
      item: {
        ...cartItem.item,
        id: mappedId,
      },
    };
  });
};


const mapCartItemsFromRecord = (record: any): CartItem[] => {
  if (Array.isArray(record?.order_items)) {
    return record.order_items
      .map((item: any): CartItem | null => {
        const menuRecord = item?.menu_item ?? item?.menu_items ?? item?.item;
        const menuItem = menuRecord
          ? mapMenuItemRecord(menuRecord)
          : (() => {
              const rawMenuItemId = typeof item?.menu_item_id === 'string' ? item.menu_item_id : undefined;
              if (rawMenuItemId && isUuid(rawMenuItemId)) {
                const localMatch = getLocalData<MenuItem[]>('savia-menuItems', [])
                  .map(mapMenuItemRecord)
                  .find((entry) => entry.id === rawMenuItemId);
                if (localMatch) {
                  return localMatch;
                }
                return createFallbackMenuItem(rawMenuItemId);
              }
              return createFallbackMenuItem(`missing-${Math.random().toString(36).slice(2, 8)}`);
            })();
        const rawQuantity = typeof item?.cantidad === 'number'
          ? item.cantidad
          : Number(item?.cantidad ?? 0);
        const cantidad = Number.isFinite(rawQuantity) ? Math.max(0, rawQuantity) : 0;
        const unitPrice = parseUnitPrice(
          item?.precio_unitario ?? item?.precioUnitario ?? item?.unitPrice ?? item?.unit_price,
          menuItem.precio
        );
        const rawNotes = typeof item?.notas === 'string' ? item.notas : undefined;
        const { price: notesPrice, cleanedNotes: cleanedPriceNotes } = extractCustomUnitPriceFromNotes(rawNotes);
        const { studentDiscount, cleanedNotes } = extractStudentDiscountFromNotes(cleanedPriceNotes);
        return {
          item: menuItem,
          cantidad: cantidad,
          notas: cleanedNotes,
          precioUnitario: typeof notesPrice === 'number' ? notesPrice : unitPrice,
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
        const { price: notesPrice, cleanedNotes: cleanedPriceNotes } = extractCustomUnitPriceFromNotes(rawNotes);
        const { studentDiscount, cleanedNotes } = extractStudentDiscountFromNotes(cleanedPriceNotes);
        return {
          item: menuItem,
          cantidad: typeof item?.cantidad === 'number' ? item.cantidad : Number(item?.cantidad ?? 0),
          notas: cleanedNotes,
          precioUnitario: typeof notesPrice === 'number'
            ? notesPrice
            : typeof item?.precioUnitario === 'number'
              ? item.precioUnitario
              : undefined,
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
  const remoteAllocations = supabaseAllocations;
  const remoteHasAllocations = remoteAllocations.length > 0;
  const metadataAllocations = metadata?.paymentAllocations
    ? sanitizeAllocations(metadata.paymentAllocations)
    : undefined;
  const metadataExplicitClear = metadata
    ? Array.isArray(metadata.paymentAllocations) && metadata.paymentAllocations.length === 0
    : false;

  let allocations: PaymentAllocation[] = remoteAllocations;
  if (!remoteHasAllocations) {
    if (metadataAllocations && metadataAllocations.length > 0) {
      allocations = metadataAllocations;
    } else if (rawAllocations.length > 0) {
      allocations = rawAllocations;
    } else if (metadataExplicitClear) {
      allocations = [];
    }
  }

  if (allocations.length === 0 && metodoPagoFromRecord) {
    allocations = [{ metodo: metodoPagoFromRecord, monto: Math.round(baseOrder.total) }];
  }

  const mergedAllocations = allocations.length > 0 ? mergeAllocations(allocations) : allocations;
  const derivedMetodoPago = getPrimaryMethodFromAllocations(mergedAllocations) ?? metodoPagoFromRecord;

  const remotePaymentStatus: PaymentStatus | undefined = (() => {
    const rawStatus = record?.paymentStatus ?? record?.payment_status;
    if (rawStatus === 'pagado' || rawStatus === 'pendiente') {
      return rawStatus;
    }
    if (remoteHasAllocations) {
      const paidTotal = getAllocationsTotal(remoteAllocations);
      const targetTotal = Math.round(baseOrder.total);
      return Math.abs(paidTotal - targetTotal) <= 1 ? 'pagado' : 'pendiente';
    }
    return undefined;
  })();

  const fallbackStatus: PaymentStatus = Math.abs(
    getAllocationsTotal(mergedAllocations) - Math.round(baseOrder.total)
  ) <= 1
    ? 'pagado'
    : 'pendiente';

  const paymentStatus: PaymentStatus = remotePaymentStatus
    ?? metadata?.paymentStatus
    ?? fallbackStatus;

  let paymentRegisteredAt: Date | undefined;
  const remotePaidAt =
    (typeof record?.paymentRegisteredAt === 'string' ? record.paymentRegisteredAt : undefined)
    ?? (typeof record?.paid_at === 'string' ? record.paid_at : undefined);
  if (remotePaidAt) {
    const parsed = new Date(remotePaidAt);
    if (!Number.isNaN(parsed.getTime())) {
      paymentRegisteredAt = parsed;
    }
  } else if (metadata?.paymentRegisteredAt) {
    const parsed = new Date(metadata.paymentRegisteredAt);
    if (!Number.isNaN(parsed.getTime())) {
      paymentRegisteredAt = parsed;
    }
  }

  if (!paymentRegisteredAt && paymentStatus === 'pagado') {
    paymentRegisteredAt = new Date(timestamp);
  }

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
    paymentRegisteredAt,
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
    menu_item_id,
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
  metodoPago: (() => {
    const metodo = normalizePaymentMethod(extractPaymentMethodValue(gasto));
    return metodo === 'provision_caja' ? 'efectivo' : metodo;
  })(),
  esInventariable: Boolean(gasto?.esInventariable ?? gasto?.es_inventariable),
  menuItemId: typeof (gasto?.menuItemId ?? gasto?.menu_item_id) === 'string'
    ? (gasto?.menuItemId ?? gasto?.menu_item_id)
    : undefined,
  cantidadInventario: (() => {
    const raw = gasto?.cantidadInventario ?? gasto?.cantidad_inventario;
    const value = typeof raw === 'number' ? raw : Number(raw ?? 0);
    return Number.isFinite(value) && value > 0 ? value : undefined;
  })(),
  inventarioTipo: (() => {
    const raw = gasto?.inventarioTipo ?? gasto?.inventario_tipo;
    if (raw === 'cantidad' || raw === 'peso' || raw === 'volumen') {
      return raw;
    }
    return undefined;
  })(),
  unidadInventario: typeof (gasto?.unidadInventario ?? gasto?.unidad_inventario) === 'string'
    ? (gasto?.unidadInventario ?? gasto?.unidad_inventario)
    : undefined,
  lugarCompra: (() => {
    const raw = gasto?.lugarCompra ?? gasto?.lugar_compra;
    return typeof raw === 'string' && raw.trim() ? raw.trim() : undefined;
  })(),
  inventarioItems: Array.isArray(gasto?.inventarioItems)
    ? gasto.inventarioItems
        .map(normalizeGastoInventarioItemRecord)
        .filter((item): item is GastoInventarioItem => item !== null)
    : Array.isArray(gasto?.gasto_inventario_items)
      ? gasto.gasto_inventario_items
          .map(normalizeGastoInventarioItemRecord)
          .filter((item): item is GastoInventarioItem => item !== null)
      : undefined,
});

const applyLocalInventoryDeltaFromGasto = (gasto: Gasto, direction: 1 | -1) => {
  if (!gasto.esInventariable || !gasto.menuItemId) {
    return;
  }

  const rawQty = Number(gasto.cantidadInventario ?? 0);
  const quantity = Number.isFinite(rawQty) ? Math.max(0, rawQty) : 0;
  if (quantity <= 0) {
    return;
  }

  const items = getLocalData<MenuItem[]>('savia-menuItems', []).map(mapMenuItemRecord);
  const updatedItems = items.map((item) => {
    if (item.id !== gasto.menuItemId) {
      return item;
    }
    const nextStock = Math.max(0, Number(item.stock ?? 0) + (quantity * direction));
    return ensureMenuItemShape({
      ...item,
      stock: nextStock,
    });
  });

  setLocalData('savia-menuItems', updatedItems);
};

const readLocalGastoInventarioItemsMap = (): Record<string, GastoInventarioItemDraft[]> => {
  return getLocalData<Record<string, GastoInventarioItemDraft[]>>(GASTO_INVENTARIO_ITEMS_STORAGE_KEY, {});
};

const persistLocalGastoInventarioItemsMap = (value: Record<string, GastoInventarioItemDraft[]>) => {
  setLocalData(GASTO_INVENTARIO_ITEMS_STORAGE_KEY, value);
};

const readLocalInventoryPriceHistory = (): InventoryPriceHistoryEntry[] => {
  return getLocalData<InventoryPriceHistoryEntry[]>(INVENTORY_PRICE_HISTORY_STORAGE_KEY, [])
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry) => ({
      id: typeof entry.id === 'string' ? entry.id : undefined,
      gastoId: typeof entry.gastoId === 'string' ? entry.gastoId : undefined,
      menuItemId: typeof entry.menuItemId === 'string' ? entry.menuItemId : '',
      cantidad: Number(entry.cantidad ?? 0),
      unidadTipo: entry.unidadTipo === 'cantidad' ? 'cantidad' : 'peso',
      unidad: typeof entry.unidad === 'string' && entry.unidad.trim()
        ? entry.unidad.trim()
        : (entry.unidadTipo === 'cantidad' ? 'unidad' : 'g'),
      precioTotal: Number(entry.precioTotal ?? 0),
      precioUnitario: Number(entry.precioUnitario ?? 0),
      lugarCompra: typeof entry.lugarCompra === 'string' && entry.lugarCompra.trim()
        ? entry.lugarCompra.trim()
        : undefined,
      createdAt: typeof entry.createdAt === 'string' && entry.createdAt
        ? entry.createdAt
        : new Date().toISOString(),
    }))
    .filter((entry) =>
      !!entry.menuItemId
      && Number.isFinite(entry.cantidad)
      && entry.cantidad > 0
      && Number.isFinite(entry.precioTotal)
      && entry.precioTotal >= 0
      && Number.isFinite(entry.precioUnitario)
      && entry.precioUnitario > 0
    );
};

const persistLocalInventoryPriceHistory = (entries: InventoryPriceHistoryEntry[]) => {
  setLocalData(INVENTORY_PRICE_HISTORY_STORAGE_KEY, entries);
};

const normalizePricePerUnit = (entry: GastoInventarioItemDraft): number => {
  const quantity = Math.max(0, Number(entry.cantidad ?? 0));
  const value = Math.max(0, Number(entry.precioUnitario ?? 0));
  if (quantity <= 0) {
    return 0;
  }
  if (entry.inventarioTipo === 'peso') {
    return value / quantity;
  }
  return value;
};

const getInventoryItemTotalPrice = (entry: GastoInventarioItemDraft): number => {
  const quantity = Math.max(0, Number(entry.cantidad ?? 0));
  const value = Math.max(0, Number(entry.precioUnitario ?? 0));
  if (entry.inventarioTipo === 'peso') {
    return value;
  }
  return quantity * value;
};

const buildInventoryPriceStats = (
  entries: InventoryPriceHistoryEntry[],
  filterIds?: Set<string>
): Record<string, InventoryPriceStat> => {
  const sorted = [...entries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const stats: Record<string, InventoryPriceStat> = {};

  sorted.forEach((entry) => {
    if (filterIds && !filterIds.has(entry.menuItemId)) {
      return;
    }
    const current = stats[entry.menuItemId];
    if (!current) {
      stats[entry.menuItemId] = {
        lastTotalPrice: entry.precioTotal,
        lastUnitPrice: entry.precioUnitario,
        bestUnitPrice: entry.precioUnitario,
        lastPlace: entry.lugarCompra,
        bestPlace: entry.lugarCompra,
      };
      return;
    }

    if (entry.precioUnitario < current.bestUnitPrice) {
      current.bestUnitPrice = entry.precioUnitario;
      current.bestPlace = entry.lugarCompra;
    }
  });

  return stats;
};

const applyLocalInventoryDeltaFromItems = (items: GastoInventarioItemDraft[], direction: 1 | -1) => {
  if (!Array.isArray(items) || items.length === 0) {
    return;
  }

  const menuItems = getLocalData<MenuItem[]>('savia-menuItems', []).map(mapMenuItemRecord);
  const byId = new Map(menuItems.map((item) => [item.id, item]));

  items.forEach((entry) => {
    const target = byId.get(entry.menuItemId);
    if (!target) {
      return;
    }
    const rawQty = Number(entry.cantidad ?? 0);
    const qty = Number.isFinite(rawQty) ? Math.max(0, rawQty) : 0;
    if (qty <= 0) {
      return;
    }

    const maybePrice = Number(entry.precioUnitario ?? 0);
    const shouldUpdatePrice = Number.isFinite(maybePrice) && maybePrice > 0;
    const updated = ensureMenuItemShape({
      ...target,
      stock: Math.max(0, Number(target.stock ?? 0) + qty * direction),
      precio: shouldUpdatePrice ? maybePrice : target.precio,
    });
    byId.set(target.id, updated);
  });

  setLocalData('savia-menuItems', Array.from(byId.values()));
};

const normalizeCajaPocket = (raw: any): CajaPocket | null => {
  if (!raw) {
    return null;
  }

  const codigo = typeof raw.codigo === 'string' && raw.codigo.trim() ? raw.codigo.trim() : null;
  if (!codigo) {
    return null;
  }

  const nombre = typeof raw.nombre === 'string' && raw.nombre.trim() ? raw.nombre.trim() : codigo;
  const descripcion = typeof raw.descripcion === 'string' && raw.descripcion.trim() ? raw.descripcion.trim() : undefined;
  const metodo = normalizePaymentMethod(raw.metodoPago ?? raw.metodo_pago ?? raw.metodo);
  const esPrincipal = Boolean(raw.esPrincipal ?? raw.es_principal);
  const createdAtValue = raw.created_at ?? raw.createdAt;
  const created_at = createdAtValue ? new Date(createdAtValue) : undefined;

  return {
    codigo,
    nombre,
    descripcion,
    metodoPago: metodo,
    esPrincipal,
    created_at,
  };
};

const DEFAULT_POCKET_NAMES: Record<string, string> = {
  caja_principal: 'Caja principal',
  provision_caja: 'Provisión de caja',
};

const serializeCajaPocket = (pocket: CajaPocket) => ({
  codigo: pocket.codigo,
  nombre: pocket.nombre,
  descripcion: pocket.descripcion ?? null,
  metodoPago: pocket.metodoPago,
  esPrincipal: pocket.esPrincipal,
  created_at: pocket.created_at ? pocket.created_at.toISOString() : null,
});

const sortCajaPockets = (a: CajaPocket, b: CajaPocket) => {
  if (a.esPrincipal && !b.esPrincipal) return -1;
  if (!a.esPrincipal && b.esPrincipal) return 1;
  return a.nombre.localeCompare(b.nombre, 'es');
};

const readLocalCajaPockets = (): CajaPocket[] => {
  const stored = getLocalData<any[]>(CAJA_POCKETS_STORAGE_KEY, []);
  return (stored ?? [])
    .map(normalizeCajaPocket)
    .filter((entry): entry is CajaPocket => entry !== null)
    .sort(sortCajaPockets);
};

const persistLocalCajaPockets = (pockets: CajaPocket[]) => {
  const serialized = pockets.map(serializeCajaPocket);
  setLocalData(CAJA_POCKETS_STORAGE_KEY, serialized);
};

const mapSupabaseCajaPocket = (row: any): CajaPocket | null => normalizeCajaPocket({
  codigo: row?.codigo,
  nombre: row?.nombre,
  descripcion: row?.descripcion,
  metodoPago: row?.metodo_pago,
  esPrincipal: row?.es_principal,
  created_at: row?.created_at,
});

const fetchCajaBolsillos = async (): Promise<CajaPocket[]> => {
  if (await ensureSupabaseReady()) {
    try {
      const { data, error } = await supabase
        .from('caja_bolsillos')
        .select('codigo, nombre, descripcion, metodo_pago, es_principal, created_at')
        .order('es_principal', { ascending: false })
        .order('nombre', { ascending: true });

      if (error) {
        throw error;
      }

      const mapped = (data ?? [])
        .map(mapSupabaseCajaPocket)
        .filter((entry): entry is CajaPocket => entry !== null)
        .sort(sortCajaPockets);

      persistLocalCajaPockets(mapped);
      return mapped;
    } catch (error) {
      console.warn('[dataService] No se pudieron obtener los bolsillos de caja desde Supabase.', error);
    }
  }

  return readLocalCajaPockets();
};

const pickString = (value: unknown): string | undefined => (typeof value === 'string' && value.trim() ? value.trim() : undefined);

const PROVISION_ORIGINS: ProvisionTransfer['origen'][] = ['efectivo', 'nequi', 'tarjeta'];

const normalizeProvisionTransfer = (raw: any): ProvisionTransfer | null => {
  if (!raw) {
    return null;
  }

  const amount = Math.max(0, Math.round(Number(raw.monto) || 0));
  if (amount <= 0) {
    return null;
  }

  const fecha = parseDateInputValue(raw.fecha);
  if (!(fecha instanceof Date) || Number.isNaN(fecha.getTime())) {
    return null;
  }

  const id = pickString(raw.id) ?? `transfer-${Math.random().toString(36).slice(2, 10)}`;
  const descripcion = pickString(raw.descripcion);

  const originCandidate = normalizeMethodAlias(
    pickString(raw.origen) ??
    pickString(raw.origenMetodo) ??
    pickString(raw.metodo_origen) ??
    pickString(raw.metodo)
  );
  const origen: ProvisionTransfer['origen'] = originCandidate && PROVISION_ORIGINS.includes(originCandidate as ProvisionTransfer['origen'])
    ? (originCandidate as ProvisionTransfer['origen'])
    : 'efectivo';

  const bolsilloOrigen = pickString(raw.bolsilloOrigen) ?? pickString(raw.bolsillo_origen);
  const bolsilloDestino = pickString(raw.bolsilloDestino) ?? pickString(raw.bolsillo_destino);
  const origenNombre = pickString(raw.origenNombre) ?? pickString(raw.origen_nombre);
  const destinoNombre = pickString(raw.destinoNombre) ?? pickString(raw.destino_nombre);
  const destinoMetodoCandidate = pickString(raw.destinoMetodo) ?? pickString(raw.destino_metodo) ?? pickString(raw.destinoMetodoPago) ?? pickString(raw.destino_metodo_pago);
  const destinoMetodo = toOptionalPaymentMethod(destinoMetodoCandidate) ?? undefined;

  const createdAtValue = raw.created_at ?? raw.createdAt;
  const created_at = createdAtValue ? new Date(createdAtValue) : undefined;

  return {
    id,
    monto: amount,
    descripcion,
    fecha,
    origen,
    created_at,
    bolsilloOrigen,
    bolsilloDestino,
    origenNombre,
    destinoNombre,
    destinoMetodo,
  };
};

const serializeProvisionTransfer = (transfer: ProvisionTransfer) => ({
  id: transfer.id,
  monto: transfer.monto,
  descripcion: transfer.descripcion ?? null,
  fecha: formatDateInputValue(transfer.fecha instanceof Date ? transfer.fecha : new Date(transfer.fecha)),
  origen: transfer.origen,
  bolsilloOrigen: transfer.bolsilloOrigen ?? null,
  bolsilloDestino: transfer.bolsilloDestino ?? null,
  origenNombre: transfer.origenNombre ?? null,
  destinoNombre: transfer.destinoNombre ?? null,
  destinoMetodo: transfer.destinoMetodo ?? null,
  created_at: transfer.created_at ? transfer.created_at.toISOString() : new Date().toISOString(),
});

const readLocalProvisionTransfers = (): ProvisionTransfer[] => {
  const stored = getLocalData<any[]>(PROVISION_TRANSFERS_STORAGE_KEY, []);
  const normalized = (stored ?? [])
    .map(normalizeProvisionTransfer)
    .filter((entry): entry is ProvisionTransfer => entry !== null)
    .sort(sortProvisionTransfersDesc);
  return normalized;
};

const persistLocalProvisionTransfers = (transfers: ProvisionTransfer[]) => {
  const serialized = transfers.map(serializeProvisionTransfer);
  setLocalData(PROVISION_TRANSFERS_STORAGE_KEY, serialized);
};

const sortProvisionTransfersDesc = (a: ProvisionTransfer, b: ProvisionTransfer) =>
  b.fecha.getTime() - a.fecha.getTime() || (b.created_at?.getTime() ?? 0) - (a.created_at?.getTime() ?? 0);

const PROVISION_TRANSFER_SELECT = `
  id,
  fecha,
  monto,
  descripcion,
  bolsillo_origen,
  bolsillo_destino,
  created_at,
  origen_bolsillo:caja_bolsillos!caja_transferencias_bolsillo_origen_fkey (codigo, nombre, metodo_pago),
  destino_bolsillo:caja_bolsillos!caja_transferencias_bolsillo_destino_fkey (codigo, nombre, metodo_pago)
`;

const mapSupabaseProvisionTransfer = (row: any): ProvisionTransfer | null => {
  if (!row) {
    return null;
  }

  const candidate = normalizeProvisionTransfer({
    id: row.id,
    monto: row.monto,
    descripcion: row.descripcion,
    fecha: row.fecha,
    origen: row.origen_bolsillo?.metodo_pago ?? row.origen ?? row.metodo_pago ?? 'efectivo',
    created_at: row.created_at,
    bolsillo_origen: row.bolsillo_origen,
    bolsillo_destino: row.bolsillo_destino,
    origen_nombre: row.origen_bolsillo?.nombre,
    destino_nombre: row.destino_bolsillo?.nombre,
    destino_metodo: row.destino_bolsillo?.metodo_pago,
  });

  if (!candidate) {
    return null;
  }

  const origenNormalizado: ProvisionTransfer['origen'] = PROVISION_ORIGINS.includes(candidate.origen)
    ? candidate.origen
    : 'efectivo';

  return {
    ...candidate,
    origen: origenNormalizado,
    bolsilloOrigen: candidate.bolsilloOrigen ?? pickString(row.origen_bolsillo?.codigo) ?? pickString(row.bolsillo_origen),
    bolsilloDestino: candidate.bolsilloDestino ?? pickString(row.destino_bolsillo?.codigo) ?? pickString(row.bolsillo_destino),
    origenNombre: candidate.origenNombre ?? pickString(row.origen_bolsillo?.nombre),
    destinoNombre: candidate.destinoNombre ?? pickString(row.destino_bolsillo?.nombre),
    destinoMetodo: candidate.destinoMetodo ?? toOptionalPaymentMethod(row.destino_bolsillo?.metodo_pago) ?? undefined,
  };
};

type MethodTotals = Record<PaymentMethod, number>;

const zeroMethodTotals = (): MethodTotals => ({
  efectivo: 0,
  tarjeta: 0,
  nequi: 0,
  provision_caja: 0,
  credito_empleados: 0
});

interface DailyAccumulator {
  ingresosTotales: number;
  egresosTotales: number;
  ingresosPorMetodo: MethodTotals;
  egresosPorMetodo: MethodTotals;
}

interface SupabaseCreditHistoryRow {
  order_id?: string | null;
  order_numero?: number | null;
  monto?: number | null;
  tipo?: 'cargo' | 'abono' | null;
  timestamp?: string | null;
  empleado_id?: string | null;
  empleado?: { id?: string | null; nombre?: string | null } | null;
  empleado_nombre?: string | null;
}

interface OutstandingCreditInfo {
  amount: number;
  assignedAt?: string;
  employeeId?: string;
  employeeName?: string;
}

const buildOutstandingCreditMap = (rows: SupabaseCreditHistoryRow[]): Map<string, OutstandingCreditInfo> => {
  const credits = new Map<string, OutstandingCreditInfo>();

  rows.forEach((row) => {
    const orderId = typeof row.order_id === 'string' ? row.order_id : undefined;
    if (!orderId) {
      return;
    }
    const amount = Math.max(0, Math.round(Number(row.monto) || 0));
    if (amount <= 0) {
      return;
    }

    let record = credits.get(orderId);
    if (!record) {
      record = { amount: 0 };
      credits.set(orderId, record);
    }

    if (row.tipo === 'cargo') {
      record.amount += amount;
      const ts = typeof row.timestamp === 'string' ? row.timestamp : undefined;
      if (ts) {
        const currentTs = record.assignedAt ? new Date(record.assignedAt).getTime() : Number.NEGATIVE_INFINITY;
        const nextTs = new Date(ts).getTime();
        if (!Number.isNaN(nextTs) && nextTs >= currentTs) {
          record.assignedAt = ts;
        }
      }
      const employeeId = typeof row.empleado_id === 'string' ? row.empleado_id : row.empleado?.id ?? undefined;
      if (employeeId) {
        record.employeeId = employeeId;
      }
      const employeeName = row.empleado?.nombre ?? row.empleado_nombre ?? undefined;
      if (employeeName) {
        record.employeeName = employeeName;
      }
    } else if (row.tipo === 'abono') {
      record.amount -= amount;
      if (record.amount < 0) {
        record.amount = 0;
      }
    }
  });

  const outstanding = new Map<string, OutstandingCreditInfo>();
  credits.forEach((record, orderId) => {
    if (record.amount > 0) {
      outstanding.set(orderId, record);
    }
  });
  return outstanding;
};

const hydrateOrdersWithEmployeeCredit = async (orders: Order[]): Promise<Order[]> => {
  if (orders.length === 0) {
    return orders;
  }

  const orderIds = orders.map((order) => order.id).filter((id): id is string => typeof id === 'string' && id.length > 0);
  if (orderIds.length === 0) {
    return orders;
  }

  try {
    const { data, error } = await supabase
      .from('employee_credit_history')
      .select(`
        order_id,
        order_numero,
        monto,
        tipo,
        timestamp,
        empleado_id,
        empleado:empleados ( id, nombre )
      `)
      .in('order_id', orderIds)
      .order('timestamp', { ascending: true });
    if (error) {
      throw error;
    }

    const outstanding = buildOutstandingCreditMap(data ?? []);

    return orders.map((order) => {
      const credit = outstanding.get(order.id);
      if (!credit) {
        if (order.creditInfo && order.metodoPago === 'credito_empleados') {
          return {
            ...order,
            creditInfo: undefined,
            metodoPago: order.metodoPago === 'credito_empleados' && order.paymentAllocations?.length
              ? getPrimaryMethodFromAllocations(order.paymentAllocations) ?? order.metodoPago
              : order.metodoPago,
          };
        }
        return order;
      }

      const assignedAt = credit.assignedAt ? new Date(credit.assignedAt) : order.timestamp;
      const safeAssignedAt = Number.isNaN(assignedAt.getTime()) ? order.timestamp : assignedAt;

      return {
        ...order,
        metodoPago: 'credito_empleados',
        paymentStatus: 'pendiente',
        paymentAllocations: [],
        paymentRegisteredAt: undefined,
        creditInfo: {
          type: 'empleados',
          amount: credit.amount,
          assignedAt: safeAssignedAt,
          employeeId: credit.employeeId,
          employeeName: credit.employeeName,
        },
      };
    });
  } catch (error) {
    console.warn('[dataService] No se pudo obtener el estado de créditos de empleados.', error);
    return orders;
  }
};

const computeLocalBalance = (orders: Order[], gastos: Gasto[], transfers: ProvisionTransfer[]): BalanceResumen[] => {
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

    const date = getOrderPaymentDate(order);
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

  transfers.forEach((transfer) => {
    if (!(transfer.fecha instanceof Date)) {
      return;
    }
    const key = toLocalDateKey(transfer.fecha);
    if (!key) {
      return;
    }

    const entry = getAccumulator(key);
    const originMethod = PROVISION_ORIGINS.includes(transfer.origen) ? transfer.origen : 'efectivo';
    const destinationMethod = transfer.destinoMetodo && PAYMENT_METHODS.includes(transfer.destinoMetodo)
      ? transfer.destinoMetodo
      : undefined;

    if (transfer.bolsilloDestino === 'provision_caja') {
      entry.ingresosPorMetodo.provision_caja += transfer.monto;
      if (entry.egresosPorMetodo[originMethod] !== undefined) {
        entry.egresosPorMetodo[originMethod] += transfer.monto;
      }
      return;
    }

    if (transfer.bolsilloOrigen === 'provision_caja') {
      entry.egresosPorMetodo.provision_caja += transfer.monto;
      if (destinationMethod && entry.ingresosPorMetodo[destinationMethod] !== undefined) {
        entry.ingresosPorMetodo[destinationMethod] += transfer.monto;
      }
      return;
    }

    if (entry.egresosPorMetodo[originMethod] !== undefined) {
      entry.egresosPorMetodo[originMethod] += transfer.monto;
    }

    if (destinationMethod && entry.ingresosPorMetodo[destinationMethod] !== undefined) {
      entry.ingresosPorMetodo[destinationMethod] += transfer.monto;
    }
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
    const saldoProvisionCajaDia = entry.ingresosPorMetodo.provision_caja - entry.egresosPorMetodo.provision_caja;
    const saldoCreditoEmpleadosDia = entry.ingresosPorMetodo.credito_empleados - entry.egresosPorMetodo.credito_empleados;
    const balanceDiario = entry.ingresosTotales - entry.egresosTotales;

    saldoTotal += balanceDiario;
    acumuladoMetodo = {
      efectivo: acumuladoMetodo.efectivo + saldoEfectivoDia,
      tarjeta: acumuladoMetodo.tarjeta + saldoTarjetaDia,
      nequi: acumuladoMetodo.nequi + saldoNequiDia,
      provision_caja: acumuladoMetodo.provision_caja + saldoProvisionCajaDia,
      credito_empleados: acumuladoMetodo.credito_empleados + saldoCreditoEmpleadosDia
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
      ingresosProvisionCaja: entry.ingresosPorMetodo.provision_caja,
      egresosProvisionCaja: entry.egresosPorMetodo.provision_caja,
      saldoEfectivoDia,
      saldoNequiDia,
      saldoTarjetaDia,
      saldoProvisionCajaDia,
      saldoTotalAcumulado: saldoTotal,
      saldoEfectivoAcumulado: acumuladoMetodo.efectivo,
      saldoNequiAcumulado: acumuladoMetodo.nequi,
      saldoTarjetaAcumulado: acumuladoMetodo.tarjeta,
      saldoProvisionCajaAcumulado: acumuladoMetodo.provision_caja
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
  ingresosProvisionCaja: Number(row.ingresos_provision_caja ?? row.ingresos_provision ?? 0),
  egresosProvisionCaja: Number(row.egresos_provision_caja ?? row.egresos_provision ?? 0),
  saldoEfectivoDia: Number(row.saldo_efectivo_dia ?? 0),
  saldoNequiDia: Number(row.saldo_nequi_dia ?? 0),
  saldoTarjetaDia: Number(row.saldo_tarjeta_dia ?? 0),
  saldoProvisionCajaDia: Number(row.saldo_provision_caja_dia ?? 0),
  saldoTotalAcumulado: Number(row.saldo_total_acumulado ?? 0),
  saldoEfectivoAcumulado: Number(row.saldo_efectivo_acumulado ?? 0),
  saldoNequiAcumulado: Number(row.saldo_nequi_acumulado ?? 0),
  saldoTarjetaAcumulado: Number(row.saldo_tarjeta_acumulado ?? 0),
  saldoProvisionCajaAcumulado: Number(row.saldo_provision_caja_acumulado ?? 0)
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
      let mapped = (data || []).map(mapOrderRecord);
      mapped = await hydrateOrdersWithEmployeeCredit(mapped);
      persistLocalOrders(mapped);
      return mapped;
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }
  return loadLocalOrders();
};

type OrdersSubscriptionHandler = () => void | Promise<void>;

interface OrdersSubscriptionOptions {
  onChange?: OrdersSubscriptionHandler;
  debounceMs?: number;
}

export const subscribeToOrders = async (
  options: OrdersSubscriptionOptions = {}
): Promise<() => void> => {
  if (!(await ensureSupabaseReady())) {
    return () => {};
  }

  const { onChange, debounceMs = 250 } = options;

  if (!onChange) {
    return () => {};
  }

  let timeout: ReturnType<typeof setTimeout> | undefined;

  const scheduleRefresh = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      onChange();
    }, debounceMs);
  };

  const channel = supabase
    .channel('orders-sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, scheduleRefresh)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, scheduleRefresh);

  let realtimeChannel: RealtimeChannel | undefined;

  try {
    realtimeChannel = await channel.subscribe();
  } catch (error) {
    console.warn('No se pudo suscribir a cambios de comandas en Supabase:', error);
    if (timeout) {
      clearTimeout(timeout);
    }
    return () => {};
  }

  return () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    realtimeChannel?.unsubscribe();
  };
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
      const itemsForPersistence = await resolveOrderItemsForSupabase(sanitizedOrder.items);
      const invalidItems = itemsForPersistence.filter((cartItem) => !isUuid(cartItem.item.id));
      if (invalidItems.length > 0) {
        const detail = invalidItems.map((item) => item.item.nombre || item.item.codigo || item.item.id).join(', ');
        throw new Error(`No se pudo mapear menu_item_id para: ${detail}`);
      }
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

      if (itemsForPersistence.length > 0) {
        const orderItemsPayload = itemsForPersistence.map((cartItem) => ({
          order_id: data.id,
          menu_item_id: cartItem.item.id,
          cantidad: cartItem.cantidad,
          notas: appendCustomUnitPriceToNotes(
            buildNotesWithStudentDiscount(
              cartItem.notas,
              cartItem.studentDiscount ?? false
            ),
            getCartItemBaseUnitPrice(cartItem),
            cartItem.item.precio
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
        items: itemsForPersistence,
        id: data.id,
        timestamp: new Date(data.timestamp),
        cliente_id: data.cliente_id ?? undefined,
        metodoPago: getPrimaryMethodFromAllocations(sanitizedAllocations)
          ?? sanitizedOrder.metodoPago,
      };
      upsertLocalOrder(createdOrder);
      return createdOrder;
    } catch (error) {
      console.error('[dataService] No se pudo guardar la orden en Supabase.', error);
      throw error;
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

  const now = new Date();
  const paymentRegisteredAt = paymentStatus === 'pagado'
    ? now
    : order.paymentRegisteredAt;

  const updatedOrder: Order = {
    ...order,
    metodoPago: primaryMethod,
    paymentAllocations: sanitizedAllocations,
    paymentStatus,
    paymentRegisteredAt,
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
    paymentRegisteredAt: undefined,
    credit: creditMetadata,
  });

  const updatedOrder: Order = {
    ...order,
    estado: 'entregado',
    metodoPago: 'credito_empleados',
    paymentStatus: 'pendiente',
    paymentAllocations: [],
    paymentRegisteredAt: undefined,
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

  const now = new Date();

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
    paymentRegisteredAt: now.toISOString(),
    credit: null,
  });

  const updatedOrder: Order = {
    ...order,
    estado: 'entregado',
    metodoPago: metodo,
    paymentStatus: 'pagado',
    paymentAllocations,
    paymentRegisteredAt: now,
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

export const updateOrder = async (orderId: string, updates: { items?: CartItem[]; total?: number }): Promise<Order> => {
  const localOrdersSnapshot = loadLocalOrders();
  const existingOrder = localOrdersSnapshot.find((entry) => entry.id === orderId);
  if (!existingOrder) {
    throw new Error(`No se encontró la orden ${orderId} para actualizar.`);
  }

  const nextItems = updates.items ?? existingOrder.items;
  const nextTotal = typeof updates.total === 'number' ? updates.total : existingOrder.total;
  const metadataAllocations = sanitizeAllocations(getOrderMetadata(orderId)?.paymentAllocations);
  const orderAllocations = getOrderAllocations(existingOrder);
  const persistedAllocations = orderAllocations.length > 0 ? orderAllocations : metadataAllocations;
  const paidAmount = getAllocationsTotal(persistedAllocations);
  const nextPaymentStatus: PaymentStatus = Math.abs(paidAmount - Math.round(nextTotal)) <= 1
    ? 'pagado'
    : 'pendiente';
  const nextMetodoPago = getPrimaryMethodFromAllocations(persistedAllocations) ?? existingOrder.metodoPago;

  const updatedOrder: Order = {
    ...existingOrder,
    items: nextItems,
    total: nextTotal,
    metodoPago: nextMetodoPago,
    paymentAllocations: persistedAllocations,
    paymentStatus: nextPaymentStatus,
  };

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
        const itemsForPersistence = await resolveOrderItemsForSupabase(updates.items);
        const invalidItems = itemsForPersistence.filter((cartItem) => !isUuid(cartItem.item.id));
        if (invalidItems.length > 0) {
          const detail = invalidItems.map((item) => item.item.nombre || item.item.codigo || item.item.id).join(', ');
          throw new Error(`No se pudo mapear menu_item_id para: ${detail}`);
        }
        // Eliminar items existentes
        const { error: deleteError } = await supabase
          .from('order_items')
          .delete()
          .eq('order_id', orderId);
        if (deleteError) throw deleteError;

        // Insertar nuevos items
        if (itemsForPersistence.length > 0) {
          const orderItemsPayload = itemsForPersistence.map((cartItem) => ({
            order_id: orderId,
            menu_item_id: cartItem.item.id,
            cantidad: cartItem.cantidad,
            notas: appendCustomUnitPriceToNotes(
              buildNotesWithStudentDiscount(
                cartItem.notas,
                cartItem.studentDiscount ?? false
              ),
              getCartItemBaseUnitPrice(cartItem),
              cartItem.item.precio
            ) ?? null,
          }));
          const { error: insertError } = await supabase.from('order_items').insert(orderItemsPayload);
          if (insertError) throw insertError;
        }
      }

      mergeOrderMetadata(orderId, {
        paymentStatus: nextPaymentStatus,
        paymentAllocations: persistedAllocations,
        paymentRegisteredAt: existingOrder.paymentRegisteredAt
          ? existingOrder.paymentRegisteredAt.toISOString()
          : undefined,
      });
      upsertLocalOrder(updatedOrder);
      return updatedOrder;
    } catch (error) {
      console.error('[dataService] No se pudo actualizar la orden en Supabase.', error);
      throw error;
    }
  }

  // Local storage fallback
  const orders = getLocalData<Order[]>('savia-orders', []).map(mapOrderRecord);
  const updatedOrders = orders.map(order => {
    if (order.id === orderId) {
      return {
        ...order,
        items: nextItems,
        total: nextTotal,
        metodoPago: nextMetodoPago,
        paymentAllocations: persistedAllocations,
        paymentStatus: nextPaymentStatus,
      };
    }
    return order;
  });
  setLocalData('savia-orders', updatedOrders);
  mergeOrderMetadata(orderId, {
    paymentStatus: nextPaymentStatus,
    paymentAllocations: persistedAllocations,
    paymentRegisteredAt: existingOrder.paymentRegisteredAt
      ? existingOrder.paymentRegisteredAt.toISOString()
      : undefined,
  });
  return updatedOrder;
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
export const fetchInventoryPriceHistory = async (menuItemId: string): Promise<InventoryPriceHistoryRecord[]> => {
  if (!menuItemId) {
    return [];
  }

  if (await ensureSupabaseReady()) {
    try {
      const { data, error } = await supabase
        .from('inventario_compra_historial')
        .select(`
          id,
          gasto_id,
          menu_item_id,
          cantidad,
          unidad_tipo,
          unidad,
          precio_total,
          precio_unitario,
          lugar_compra,
          created_at
        `)
        .eq('menu_item_id', menuItemId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data ?? [])
        .map((row) => {
          const id = typeof row?.id === 'string' ? row.id : undefined;
          const gastoId = typeof row?.gasto_id === 'string' ? row.gasto_id : undefined;
          const cantidad = Number(row?.cantidad ?? 0);
          const unidadTipo = row?.unidad_tipo === 'cantidad' ? 'cantidad' : 'peso';
          const unidad = typeof row?.unidad === 'string' && row.unidad.trim()
            ? row.unidad.trim()
            : (unidadTipo === 'cantidad' ? 'unidad' : 'g');
          const precioTotal = Number(row?.precio_total ?? 0);
          const precioUnitario = Number(row?.precio_unitario ?? 0);
          const lugarCompra = typeof row?.lugar_compra === 'string' && row.lugar_compra.trim()
            ? row.lugar_compra.trim()
            : undefined;
          const createdAt = typeof row?.created_at === 'string'
            ? row.created_at
            : new Date().toISOString();

          if (!Number.isFinite(cantidad) || cantidad <= 0 || !Number.isFinite(precioUnitario) || precioUnitario <= 0) {
            return null;
          }

          return {
            id,
            gastoId,
            menuItemId,
            cantidad,
            unidadTipo,
            unidad,
            precioTotal: Number.isFinite(precioTotal) ? Math.max(0, precioTotal) : 0,
            precioUnitario,
            lugarCompra,
            createdAt,
          } as InventoryPriceHistoryRecord;
        })
        .filter((entry): entry is InventoryPriceHistoryRecord => entry !== null);
    } catch (error) {
      console.warn('[dataService] No se pudo obtener el histórico de compras del inventario desde Supabase.', error);
    }
  }

  return readLocalInventoryPriceHistory()
    .filter((entry) => entry.menuItemId === menuItemId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const fetchInventoryPriceHistorySummary = async (limit = 200): Promise<InventoryPriceHistoryRecord[]> => {
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(Math.round(limit), 1000) : 200;

  if (await ensureSupabaseReady()) {
    try {
      const { data, error } = await supabase
        .from('inventario_compra_historial')
        .select(`
          id,
          gasto_id,
          menu_item_id,
          cantidad,
          unidad_tipo,
          unidad,
          precio_total,
          precio_unitario,
          lugar_compra,
          created_at,
          menu_item:menu_items (
            nombre
          )
        `)
        .order('created_at', { ascending: false })
        .limit(safeLimit);

      if (error) throw error;

      return (data ?? [])
        .map((row) => {
          const menuItemId = typeof row?.menu_item_id === 'string' ? row.menu_item_id : '';
          if (!menuItemId) {
            return null;
          }
          const cantidad = Number(row?.cantidad ?? 0);
          const unidadTipo = row?.unidad_tipo === 'cantidad' ? 'cantidad' : 'peso';
          const unidad = typeof row?.unidad === 'string' && row.unidad.trim()
            ? row.unidad.trim()
            : unidadTipo === 'cantidad' ? 'unidad' : 'g';
          const precioTotal = Number(row?.precio_total ?? 0);
          const precioUnitario = Number(row?.precio_unitario ?? 0);
          if (!Number.isFinite(cantidad) || cantidad <= 0 || !Number.isFinite(precioUnitario) || precioUnitario <= 0) {
            return null;
          }

          return {
            id: typeof row?.id === 'string' ? row.id : undefined,
            gastoId: typeof row?.gasto_id === 'string' ? row.gasto_id : undefined,
            menuItemId,
            menuItemNombre: typeof row?.menu_item?.nombre === 'string' ? row.menu_item.nombre : undefined,
            cantidad,
            unidadTipo,
            unidad,
            precioTotal: Number.isFinite(precioTotal) ? Math.max(0, precioTotal) : 0,
            precioUnitario,
            lugarCompra: typeof row?.lugar_compra === 'string' && row.lugar_compra.trim()
              ? row.lugar_compra.trim()
              : undefined,
            createdAt: typeof row?.created_at === 'string' ? row.created_at : new Date().toISOString(),
          } as InventoryPriceHistoryRecord;
        })
        .filter((entry): entry is InventoryPriceHistoryRecord => entry !== null);
    } catch (error) {
      console.warn('[dataService] No se pudo obtener el resumen histórico de compras desde Supabase.', error);
    }
  }

  const menuItemsById = new Map(
    getLocalData<MenuItem[]>('savia-menuItems', [])
      .map(mapMenuItemRecord)
      .map((item) => [item.id, item.nombre])
  );

  return readLocalInventoryPriceHistory()
    .map((entry) => ({
      ...entry,
      menuItemNombre: menuItemsById.get(entry.menuItemId),
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, safeLimit);
};

export const fetchInventoryPriceStats = async (menuItemIds?: string[]): Promise<Record<string, InventoryPriceStat>> => {
  const filterSet = menuItemIds && menuItemIds.length > 0 ? new Set(menuItemIds) : undefined;

  if (await ensureSupabaseReady()) {
    try {
      let query = supabase
        .from('inventario_compra_historial')
        .select('menu_item_id, precio_total, precio_unitario, lugar_compra, created_at')
        .order('created_at', { ascending: false });

      if (filterSet && filterSet.size > 0) {
        query = query.in('menu_item_id', Array.from(filterSet));
      }

      const { data, error } = await query;
      if (error) throw error;

      const entries: InventoryPriceHistoryEntry[] = (data ?? [])
        .map((row) => {
          const menuItemId = typeof row?.menu_item_id === 'string' ? row.menu_item_id : '';
          const precioTotal = Number(row?.precio_total ?? 0);
          const precioUnitario = Number(row?.precio_unitario ?? 0);
          if (!menuItemId || !Number.isFinite(precioUnitario) || precioUnitario <= 0) {
            return null;
          }
          return {
            menuItemId,
            cantidad: 1,
            unidadTipo: 'cantidad',
            unidad: 'unidad',
            precioTotal: Number.isFinite(precioTotal) ? Math.max(0, precioTotal) : 0,
            precioUnitario,
            lugarCompra: typeof row?.lugar_compra === 'string' ? row.lugar_compra : undefined,
            createdAt: typeof row?.created_at === 'string' ? row.created_at : new Date().toISOString(),
          } as InventoryPriceHistoryEntry;
        })
        .filter((entry): entry is InventoryPriceHistoryEntry => entry !== null);

      return buildInventoryPriceStats(entries, filterSet);
    } catch (error) {
      console.warn('[dataService] No se pudo obtener el histórico de precios de inventario desde Supabase.', error);
    }
  }

  return buildInventoryPriceStats(readLocalInventoryPriceHistory(), filterSet);
};

const persistInventoryPriceHistoryEntries = async (
  gastoId: string,
  items: GastoInventarioItemDraft[],
  defaultLugarCompra?: string
): Promise<void> => {
  const entries = items
    .map((entry) => {
      const quantity = Math.max(0, Number(entry.cantidad ?? 0));
      const unitPrice = normalizePricePerUnit(entry);
      const totalPrice = getInventoryItemTotalPrice(entry);
      if (!entry.menuItemId || quantity <= 0 || unitPrice <= 0) {
        return null;
      }

      return {
        gasto_id: gastoId,
        menu_item_id: entry.menuItemId,
        cantidad: quantity,
        unidad_tipo: entry.inventarioTipo === 'cantidad' ? 'cantidad' : 'peso',
        unidad: entry.inventarioTipo === 'cantidad' ? 'unidad' : (entry.unidadInventario || 'g'),
        precio_total: totalPrice,
        precio_unitario: unitPrice,
        lugar_compra: entry.lugarCompra?.trim() || defaultLugarCompra?.trim() || null,
      };
    })
    .filter((entry): entry is {
      gasto_id: string;
      menu_item_id: string;
      cantidad: number;
      unidad_tipo: 'cantidad' | 'peso';
      unidad: string;
      precio_total: number;
      precio_unitario: number;
      lugar_compra: string | null;
    } => entry !== null);

  if (entries.length === 0) {
    return;
  }

  const current = readLocalInventoryPriceHistory();
  const now = new Date().toISOString();
  const next = [
    ...current,
    ...entries.map((entry) => ({
      gastoId: entry.gasto_id,
      menuItemId: entry.menu_item_id,
      cantidad: entry.cantidad,
      unidadTipo: entry.unidad_tipo,
      unidad: entry.unidad,
      precioTotal: entry.precio_total,
      precioUnitario: entry.precio_unitario,
      lugarCompra: entry.lugar_compra ?? undefined,
      createdAt: now,
    })),
  ];
  persistLocalInventoryPriceHistory(next);

  if (await ensureSupabaseReady()) {
    try {
      const { error } = await supabase.from('inventario_compra_historial').insert(entries);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.warn('[dataService] No se pudo guardar el histórico de compra en Supabase. Se guardó localmente.', error);
    }
  }
};

export const fetchGastos = async (): Promise<Gasto[]> => {
  if (await ensureSupabaseReady()) {
    try {
      const { data, error } = await supabase
        .from('gastos')
        .select(`
          *,
          gasto_inventario_items (
            id,
            gasto_id,
            menu_item_id,
            cantidad,
            inventario_tipo,
            unidad_inventario,
            precio_unitario,
            menu_item:menu_items (
              id,
              nombre,
              precio
            )
          )
        `)
        .order('fecha', { ascending: false });
      if (error) throw error;
      return (data || []).map(normalizeGastoRecord);
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }
  const gastos = getLocalData<Gasto[]>('savia-gastos', []).map(normalizeGastoRecord);
  const itemsMap = readLocalGastoInventarioItemsMap();
  const itemsByMenuId = new Map(
    getLocalData<MenuItem[]>('savia-menuItems', [])
      .map(mapMenuItemRecord)
      .map((item) => [item.id, item])
  );

  return gastos.map((gasto) => {
    const localItems = itemsMap[gasto.id] ?? [];
    if (localItems.length === 0) {
      return gasto;
    }
    const inventarioItems = localItems
      .map((entry) => {
        const matched = itemsByMenuId.get(entry.menuItemId);
        return normalizeGastoInventarioItemRecord({
          gasto_id: gasto.id,
          menu_item_id: entry.menuItemId,
          nombre: matched?.nombre ?? 'Producto',
          cantidad: entry.cantidad,
          inventario_tipo: entry.inventarioTipo,
          unidad_inventario: entry.unidadInventario,
          precio_unitario: entry.precioUnitario ?? matched?.precio ?? 0,
        });
      })
      .filter((item): item is GastoInventarioItem => item !== null);

    return { ...gasto, inventarioItems };
  });
};

export const createGasto = async (gasto: Gasto): Promise<Gasto> => {
  const sanitized = normalizeGastoRecord(gasto);
  const normalizedQuantity = Number(sanitized.cantidadInventario ?? 0);
  const isInventariable = Boolean(sanitized.esInventariable && sanitized.menuItemId && normalizedQuantity > 0);
  const gastoToPersist: Gasto = {
    ...sanitized,
    esInventariable: isInventariable,
    menuItemId: isInventariable ? sanitized.menuItemId : undefined,
    cantidadInventario: isInventariable ? normalizedQuantity : undefined,
    inventarioTipo: isInventariable ? sanitized.inventarioTipo : undefined,
    unidadInventario: isInventariable ? sanitized.unidadInventario : undefined,
  };
  if (await ensureSupabaseReady()) {
    try {
      const fechaValue = formatDateInputValue(
        gastoToPersist.fecha instanceof Date ? gastoToPersist.fecha : new Date(gastoToPersist.fecha)
      );

      const { data, error } = await supabase
        .from('gastos')
        .insert([
          {
            id: gastoToPersist.id,
            descripcion: gastoToPersist.descripcion,
            monto: gastoToPersist.monto,
            categoria: gastoToPersist.categoria,
            fecha: fechaValue,
            created_at: gastoToPersist.created_at instanceof Date
              ? gastoToPersist.created_at.toISOString()
              : gastoToPersist.created_at ?? new Date().toISOString(),
            [SUPABASE_GASTOS_PAYMENT_COLUMN]: gastoToPersist.metodoPago,
            lugar_compra: gastoToPersist.lugarCompra ?? null,
            es_inventariable: Boolean(gastoToPersist.esInventariable),
            menu_item_id: gastoToPersist.menuItemId ?? null,
            cantidad_inventario: gastoToPersist.cantidadInventario ?? null,
            inventario_tipo: gastoToPersist.inventarioTipo ?? null,
            unidad_inventario: gastoToPersist.unidadInventario ?? null,
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
  const newGastos = [...gastos, gastoToPersist];
  setLocalData('savia-gastos', newGastos);
  applyLocalInventoryDeltaFromGasto(gastoToPersist, 1);
  return gastoToPersist;
};

export const createGastoWithInventarioItems = async (
  gasto: Gasto,
  items: GastoInventarioItemDraft[]
): Promise<Gasto> => {
  const sanitized = normalizeGastoRecord(gasto);
  const sanitizedItems = items
    .map((entry) => ({
      menuItemId: entry.menuItemId,
      cantidad: Math.max(0, Number(entry.cantidad ?? 0)),
      inventarioTipo: entry.inventarioTipo,
      unidadInventario: entry.unidadInventario,
      precioUnitario: Number(entry.precioUnitario ?? 0),
      lugarCompra: typeof entry.lugarCompra === 'string' ? entry.lugarCompra.trim() : undefined,
    }))
    .filter((entry) => entry.menuItemId && entry.cantidad > 0);

  if (sanitizedItems.length === 0) {
    throw new Error('Debes seleccionar al menos un producto inventariable con cantidad válida.');
  }

  const gastoToPersist: Gasto = {
    ...sanitized,
    esInventariable: true,
    menuItemId: undefined,
    cantidadInventario: undefined,
    inventarioTipo: undefined,
    unidadInventario: undefined,
  };

  if (await ensureSupabaseReady()) {
    try {
      const fechaValue = formatDateInputValue(
        gastoToPersist.fecha instanceof Date ? gastoToPersist.fecha : new Date(gastoToPersist.fecha)
      );

      const { data, error } = await supabase
        .from('gastos')
        .insert([
          {
            id: gastoToPersist.id,
            descripcion: gastoToPersist.descripcion,
            monto: gastoToPersist.monto,
            categoria: gastoToPersist.categoria,
            fecha: fechaValue,
            created_at: gastoToPersist.created_at instanceof Date
              ? gastoToPersist.created_at.toISOString()
              : gastoToPersist.created_at ?? new Date().toISOString(),
            [SUPABASE_GASTOS_PAYMENT_COLUMN]: gastoToPersist.metodoPago,
            lugar_compra: gastoToPersist.lugarCompra ?? null,
            es_inventariable: true,
            menu_item_id: null,
            cantidad_inventario: null,
            inventario_tipo: null,
            unidad_inventario: null,
          },
        ])
        .select('*')
        .single();

      if (error) throw error;

      const gastoId = data.id;
      const detailPayload = sanitizedItems.map((entry) => ({
        gasto_id: gastoId,
        menu_item_id: entry.menuItemId,
        cantidad: entry.cantidad,
        inventario_tipo: entry.inventarioTipo ?? null,
        unidad_inventario: entry.unidadInventario ?? null,
        precio_unitario: Number.isFinite(entry.precioUnitario) ? entry.precioUnitario : 0,
      }));

      const { error: detailError } = await supabase
        .from('gasto_inventario_items')
        .insert(detailPayload);
      if (detailError) throw detailError;

      await persistInventoryPriceHistoryEntries(gastoId, sanitizedItems, gastoToPersist.lugarCompra);

      const priceUpdates = sanitizedItems
        .map((entry) => ({ id: entry.menuItemId, precio: Number(entry.precioUnitario ?? 0) }))
        .filter((entry) => Number.isFinite(entry.precio) && entry.precio > 0);

      for (const update of priceUpdates) {
        const { error: menuUpdateError } = await supabase
          .from('menu_items')
          .update({ precio: update.precio })
          .eq('id', update.id);
        if (menuUpdateError) {
          throw menuUpdateError;
        }
      }

      return normalizeGastoRecord(data);
    } catch (error) {
      console.warn('[dataService] No se pudo guardar gasto con items en Supabase. Usando modo local.', error);
    }
  }

  const gastos = getLocalData<Gasto[]>('savia-gastos', []).map(normalizeGastoRecord);
  const newGastos = [...gastos, gastoToPersist];
  setLocalData('savia-gastos', newGastos);

  const itemsMap = readLocalGastoInventarioItemsMap();
  itemsMap[gastoToPersist.id] = sanitizedItems;
  persistLocalGastoInventarioItemsMap(itemsMap);
  applyLocalInventoryDeltaFromItems(sanitizedItems, 1);
  await persistInventoryPriceHistoryEntries(gastoToPersist.id, sanitizedItems, gastoToPersist.lugarCompra);

  return gastoToPersist;
};

export const updateGasto = async (gasto: Gasto): Promise<Gasto> => {
  const sanitized = normalizeGastoRecord(gasto);
  const normalizedQuantity = Number(sanitized.cantidadInventario ?? 0);
  const isInventariable = Boolean(sanitized.esInventariable && sanitized.menuItemId && normalizedQuantity > 0);
  const gastoToPersist: Gasto = {
    ...sanitized,
    esInventariable: isInventariable,
    menuItemId: isInventariable ? sanitized.menuItemId : undefined,
    cantidadInventario: isInventariable ? normalizedQuantity : undefined,
    inventarioTipo: isInventariable ? sanitized.inventarioTipo : undefined,
    unidadInventario: isInventariable ? sanitized.unidadInventario : undefined,
  };
  if (await ensureSupabaseReady()) {
    try {
      const fechaValue = formatDateInputValue(
        gastoToPersist.fecha instanceof Date ? gastoToPersist.fecha : new Date(gastoToPersist.fecha)
      );

      const { error } = await supabase
        .from('gastos')
        .update({
          descripcion: gastoToPersist.descripcion,
          monto: gastoToPersist.monto,
          categoria: gastoToPersist.categoria,
          fecha: fechaValue,
          [SUPABASE_GASTOS_PAYMENT_COLUMN]: gastoToPersist.metodoPago,
          lugar_compra: gastoToPersist.lugarCompra ?? null,
          es_inventariable: Boolean(gastoToPersist.esInventariable),
          menu_item_id: gastoToPersist.menuItemId ?? null,
          cantidad_inventario: gastoToPersist.cantidadInventario ?? null,
          inventario_tipo: gastoToPersist.inventarioTipo ?? null,
          unidad_inventario: gastoToPersist.unidadInventario ?? null,
        })
        .eq('id', gastoToPersist.id);
      if (error) throw error;
      return gastoToPersist;
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  // Local storage fallback
  const gastos = getLocalData<Gasto[]>('savia-gastos', []).map(normalizeGastoRecord);
  const previous = gastos.find((entry) => entry.id === gastoToPersist.id);
  if (previous) {
    applyLocalInventoryDeltaFromGasto(previous, -1);
  }
  applyLocalInventoryDeltaFromGasto(gastoToPersist, 1);
  const updatedGastos = gastos.map(g => g.id === gastoToPersist.id ? gastoToPersist : g);
  setLocalData('savia-gastos', updatedGastos);
  return gastoToPersist;
};

export const deleteGasto = async (id: string): Promise<void> => {
  if (await ensureSupabaseReady()) {
    try {
      const { error: deleteHistoryError } = await supabase
        .from('inventario_compra_historial')
        .delete()
        .eq('gasto_id', id);
      if (deleteHistoryError) throw deleteHistoryError;

      const { error } = await supabase.from('gastos').delete().eq('id', id);
      if (error) throw error;
      return;
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  // Local storage fallback
  const gastos = getLocalData<Gasto[]>('savia-gastos', []).map(normalizeGastoRecord);
  const itemsMap = readLocalGastoInventarioItemsMap();
  const multiItems = itemsMap[id] ?? [];
  if (multiItems.length > 0) {
    applyLocalInventoryDeltaFromItems(multiItems, -1);
    delete itemsMap[id];
    persistLocalGastoInventarioItemsMap(itemsMap);
  }
  const deleted = gastos.find((gasto) => gasto.id === id);
  if (deleted && multiItems.length === 0) {
    applyLocalInventoryDeltaFromGasto(deleted, -1);
  }
  const localHistory = readLocalInventoryPriceHistory();
  const filteredHistory = localHistory.filter((entry) => entry.gastoId !== id);
  if (filteredHistory.length !== localHistory.length) {
    persistLocalInventoryPriceHistory(filteredHistory);
  }
  const filteredGastos = gastos.filter(gasto => gasto.id !== id);
  setLocalData('savia-gastos', filteredGastos);
};

// PROVISIÓN DE CAJA
type ProvisionTransferDraft = {
  id?: string;
  monto: number;
  descripcion?: string;
  fecha: Date;
  origen?: ProvisionTransfer['origen'];
  origenMetodo?: ProvisionTransfer['origen'];
  destinoMetodo?: PaymentMethod;
  bolsilloOrigen?: string;
  bolsilloDestino?: string;
  origenNombre?: string;
  destinoNombre?: string;
};

export const fetchProvisionTransfers = async (): Promise<ProvisionTransfer[]> => {
  if (await ensureSupabaseReady()) {
    try {
      const { data, error } = await supabase
        .from('caja_transferencias')
        .select(PROVISION_TRANSFER_SELECT)
        .order('fecha', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped = (data ?? [])
        .map(mapSupabaseProvisionTransfer)
        .filter((transfer): transfer is ProvisionTransfer => transfer !== null)
        .filter((transfer) => {
          if (!transfer.bolsilloOrigen && !transfer.bolsilloDestino) {
            return true;
          }
          return transfer.bolsilloDestino === 'provision_caja' || transfer.bolsilloOrigen === 'provision_caja';
        })
        .sort(sortProvisionTransfersDesc);

      persistLocalProvisionTransfers(mapped);

      return mapped;
    } catch (error) {
      console.warn('[dataService] No se pudo obtener las provisiones desde Supabase.', error);
    }
  }
  return readLocalProvisionTransfers().filter((transfer) => {
    if (!transfer.bolsilloOrigen && !transfer.bolsilloDestino) {
      return true;
    }
    return transfer.bolsilloDestino === 'provision_caja' || transfer.bolsilloOrigen === 'provision_caja';
  });
};

export const createProvisionTransfer = async (draft: ProvisionTransferDraft): Promise<ProvisionTransfer> => {
  const amount = Math.max(0, Math.round(Number(draft.monto) || 0));
  if (amount <= 0) {
    throw new Error('El monto de la provisión debe ser mayor a cero.');
  }

  const fecha = draft.fecha instanceof Date ? new Date(draft.fecha.getTime()) : new Date(draft.fecha);
  if (Number.isNaN(fecha.getTime())) {
    throw new Error('La fecha del movimiento de provisión no es válida.');
  }
  fecha.setHours(0, 0, 0, 0);

  const descripcion = draft.descripcion?.trim() || undefined;
  const supabaseReady = await ensureSupabaseReady();

  const originCode = pickString(draft.bolsilloOrigen) ?? 'caja_principal';
  const destinationCode = pickString(draft.bolsilloDestino) ?? 'provision_caja';

  if (originCode === destinationCode) {
    throw new Error('Selecciona bolsillos diferentes para origen y destino.');
  }

  let pockets = readLocalCajaPockets();
  let originPocket = pockets.find((pocket) => pocket.codigo === originCode);
  let destinationPocket = pockets.find((pocket) => pocket.codigo === destinationCode);

  if ((!originPocket || !destinationPocket) && supabaseReady) {
    try {
      pockets = await fetchCajaBolsillos();
      originPocket = pockets.find((pocket) => pocket.codigo === originCode) ?? originPocket;
      destinationPocket = pockets.find((pocket) => pocket.codigo === destinationCode) ?? destinationPocket;
    } catch (error) {
      console.warn('[dataService] No se pudieron refrescar los bolsillos antes de crear la transferencia.', error);
    }
  }

  const originMethodCandidate = normalizeMethodAlias(draft.origenMetodo ?? draft.origen ?? originPocket?.metodoPago);
  const origen: ProvisionTransfer['origen'] = originMethodCandidate && PROVISION_ORIGINS.includes(originMethodCandidate as ProvisionTransfer['origen'])
    ? (originMethodCandidate as ProvisionTransfer['origen'])
    : 'efectivo';

  const destinoMetodo = toOptionalPaymentMethod(draft.destinoMetodo ?? destinationPocket?.metodoPago ?? undefined) ?? undefined;
  const origenNombre = pickString(draft.origenNombre) ?? originPocket?.nombre ?? DEFAULT_POCKET_NAMES[originCode] ?? originCode;
  const destinoNombre = pickString(draft.destinoNombre) ?? destinationPocket?.nombre ?? DEFAULT_POCKET_NAMES[destinationCode] ?? destinationCode;

  if (supabaseReady) {
    try {
      const { data, error } = await supabase
        .from('caja_transferencias')
        .insert({
          fecha: formatDateInputValue(fecha),
          monto: amount,
          descripcion: descripcion ?? null,
          bolsillo_origen: originCode,
          bolsillo_destino: destinationCode,
        })
        .select(PROVISION_TRANSFER_SELECT)
        .single();

      if (error) throw error;

      const mapped = mapSupabaseProvisionTransfer(data);
      if (mapped) {
        const current = readLocalProvisionTransfers().filter((transfer) => transfer.id !== mapped.id);
        persistLocalProvisionTransfers([mapped, ...current].sort(sortProvisionTransfersDesc));
        return mapped;
      }
    } catch (error) {
      console.warn('[dataService] No se pudo registrar la provisión en Supabase. Usando modo local.', error);
    }
  }

  const id = draft.id && draft.id.trim() ? draft.id.trim() : (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `transfer-${Math.random().toString(36).slice(2, 10)}`);

  const transfer: ProvisionTransfer = {
    id,
    monto: amount,
    descripcion,
    fecha,
    origen,
    created_at: new Date(),
    bolsilloOrigen: originCode,
    bolsilloDestino: destinationCode,
    origenNombre,
    destinoNombre,
    destinoMetodo,
  };

  const current = readLocalProvisionTransfers();
  const next = [transfer, ...current].sort(sortProvisionTransfersDesc);
  persistLocalProvisionTransfers(next);
  return transfer;
};

export const deleteProvisionTransfer = async (id: string): Promise<void> => {
  if (!id) {
    return;
  }

  if (await ensureSupabaseReady()) {
    const { error } = await supabase
      .from('caja_transferencias')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }

  const current = readLocalProvisionTransfers();
  const next = current.filter((transfer) => transfer.id !== id);
  persistLocalProvisionTransfers(next);
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
  const localTransfers = readLocalProvisionTransfers();
  return computeLocalBalance(localOrders, localGastos, localTransfers);
};

export const dataService = {
  fetchMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  fetchOrders,
  subscribeToOrders,
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
  fetchInventoryPriceHistory,
  fetchInventoryPriceHistorySummary,
  fetchInventoryPriceStats,
  fetchGastos,
  createGasto,
  createGastoWithInventarioItems,
  updateGasto,
  deleteGasto,
  fetchCajaBolsillos,
  fetchProvisionTransfers,
  createProvisionTransfer,
  deleteProvisionTransfer,
  fetchBalanceResumen,
  checkDatabaseConnection,
} as const;

export default dataService;
