import { MenuItem, Order, Customer, Empleado, Gasto, BalanceResumen, PaymentMethod, CartItem } from '../types';
import { supabase } from './supabaseClient';
import { getLocalData, setLocalData } from '../data/localData';
import { slugify, generateMenuItemCode } from '../utils/strings';

// Verificar si Supabase está disponible
const isSupabaseAvailable = () => {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
};

const PAYMENT_METHODS: PaymentMethod[] = ['efectivo', 'tarjeta', 'nequi'];

const normalizePaymentMethod = (method?: string | null): PaymentMethod => {
  if (method && PAYMENT_METHODS.includes(method as PaymentMethod)) {
    return method as PaymentMethod;
  }
  return 'efectivo';
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
    inventarioCategoria: sanitized.inventarioCategoria,
    inventarioTipo: sanitized.inventarioTipo ?? null,
    unidadMedida: sanitized.unidadMedida ?? null,
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

  const inventarioCategoria = record?.inventarioCategoria === 'Inventariables'
    ? 'Inventariables'
    : 'No inventariables';

  const inventarioTipo = inventarioCategoria === 'Inventariables'
    ? record?.inventarioTipo === 'gramos'
      ? 'gramos'
      : record?.inventarioTipo === 'cantidad'
        ? 'cantidad'
        : undefined
    : undefined;

  const unidadMedida = inventarioTipo === 'gramos'
    ? isValidUnidadMedida(record?.unidadMedida)
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
        return {
          item: menuItem,
          cantidad: cantidad,
          notas: item?.notas ?? undefined,
          precioUnitario: unitPrice,
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
        return {
          item: menuItem,
          cantidad: typeof item?.cantidad === 'number' ? item.cantidad : Number(item?.cantidad ?? 0),
          notas: item?.notas ?? undefined,
        };
      })
      .filter((entry): entry is CartItem => entry !== null);
  }

  return [];
};

const mapOrderRecord = (record: any): Order => {
  const items = mapCartItemsFromRecord(record);
  const timestamp = record?.timestamp ? new Date(record.timestamp) : new Date();

  return {
    id: typeof record?.id === 'string' && record.id
      ? record.id
      : typeof record?.order_id === 'string' && record.order_id
        ? record.order_id
        : `order-${Math.random().toString(36).slice(2, 10)}`,
    numero: typeof record?.numero === 'number' ? record.numero : Number(record?.numero ?? 0),
    items,
    total: typeof record?.total === 'number' ? record.total : Number(record?.total ?? 0),
    estado: (record?.estado as Order['estado']) ?? 'pendiente',
    timestamp,
    cliente_id: record?.cliente_id ?? record?.clienteId ?? undefined,
    cliente: record?.customer?.nombre ?? record?.cliente ?? undefined,
    metodoPago: normalizePaymentMethod(record?.metodoPago),
  };
};

const normalizeGastoRecord = (gasto: any): Gasto => ({
  id: typeof gasto?.id === 'string' ? gasto.id : `gasto-${Math.random().toString(36).slice(2, 10)}`,
  descripcion: gasto?.descripcion ?? '',
  monto: typeof gasto?.monto === 'number' ? gasto.monto : Number(gasto?.monto ?? 0),
  categoria: gasto?.categoria ?? '',
  fecha: gasto?.fecha ? new Date(gasto.fecha) : new Date(),
  created_at: gasto?.created_at ? new Date(gasto.created_at) : undefined,
  metodoPago: normalizePaymentMethod(gasto?.metodoPago),
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
    const date = new Date(order.timestamp);
    if (Number.isNaN(date.getTime())) return;
    const key = toLocalDateKey(date);
    if (!key) return;
    const entry = getAccumulator(key);
    const method = normalizePaymentMethod(order.metodoPago);
    entry.ingresosTotales += order.total;
    entry.ingresosPorMetodo[method] += order.total;
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

  if (isSupabaseAvailable()) {
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
  } else {
    console.warn('[dataService] Supabase credentials are not configured. Using local cache.');
  }

  console.warn('[dataService] Supabase credentials are not configured. Using local cache.');
  return loadMenuItemsFromLocalCache();
};

export const createMenuItem = async (item: MenuItem): Promise<MenuItem> => {
  const sanitized = ensureMenuItemShape(item);
  if (isSupabaseAvailable()) {
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
  if (isSupabaseAvailable()) {
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
  if (isSupabaseAvailable()) {
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
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          numero,
          total,
          estado,
          timestamp,
          cliente_id,
          metodoPago,
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
              inventarioCategoria,
              inventarioTipo,
              unidadMedida
            )
          )
        `)
        .order('timestamp', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapOrderRecord);
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }
  const localOrders = getLocalData<Order[]>('savia-orders', []);
  return localOrders.map(mapOrderRecord);
};

export const createOrder = async (order: Order): Promise<Order> => {
  const sanitizedItems = order.items.map((cartItem) => ({
    ...cartItem,
    item: ensureMenuItemShape(cartItem.item),
  }));
  const sanitizedOrder: Order = {
    ...order,
    items: sanitizedItems,
    metodoPago: normalizePaymentMethod(order.metodoPago),
  };

  if (isSupabaseAvailable()) {
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
            metodoPago: sanitizedOrder.metodoPago,
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
          notas: cartItem.notas ?? null,
        }));
        const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload);
        if (itemsError) {
          await supabase.from('orders').delete().eq('id', data.id);
          throw itemsError;
        }
      }

      return {
        ...sanitizedOrder,
        id: data.id,
        timestamp: new Date(data.timestamp),
        cliente_id: data.cliente_id ?? undefined,
        metodoPago: normalizePaymentMethod(data.metodoPago),
      };
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  // Local storage fallback
  const orders = getLocalData<Order[]>('savia-orders', []).map(mapOrderRecord);
  const newOrders = [...orders, sanitizedOrder];
  setLocalData('savia-orders', newOrders);
  return sanitizedOrder;
};

export const updateOrderStatus = async (orderId: string, status: Order['estado']): Promise<void> => {
  if (isSupabaseAvailable()) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ estado: status })
        .eq('id', orderId);
      if (error) throw error;
      return;
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }

  // Local storage fallback
  const orders = getLocalData<Order[]>('savia-orders', []).map(mapOrderRecord);
  const updatedOrders = orders.map(order =>
    order.id === orderId ? { ...order, estado: status } : order
  );
  setLocalData('savia-orders', updatedOrders);
};

export const updateOrder = async (orderId: string, updates: { items?: CartItem[]; total?: number }): Promise<void> => {
  if (isSupabaseAvailable()) {
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
            notas: cartItem.notas ?? null,
          }));
          const { error: insertError } = await supabase.from('order_items').insert(orderItemsPayload);
          if (insertError) throw insertError;
        }
      }
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
};

// CUSTOMERS
export const fetchCustomers = async (): Promise<Customer[]> => {
  if (isSupabaseAvailable()) {
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
  if (isSupabaseAvailable()) {
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
  if (isSupabaseAvailable()) {
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
  if (isSupabaseAvailable()) {
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
  if (isSupabaseAvailable()) {
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
  if (isSupabaseAvailable()) {
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
  if (isSupabaseAvailable()) {
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
  if (isSupabaseAvailable()) {
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

// GASTOS
export const fetchGastos = async (): Promise<Gasto[]> => {
  if (isSupabaseAvailable()) {
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
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await supabase
        .from('gastos')
        .insert([
          {
            id: sanitized.id,
            descripcion: sanitized.descripcion,
            monto: sanitized.monto,
            categoria: sanitized.categoria,
            fecha: sanitized.fecha instanceof Date ? sanitized.fecha.toISOString().split('T')[0] : sanitized.fecha,
            created_at: sanitized.created_at ?? new Date().toISOString(),
            metodoPago: sanitized.metodoPago,
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
  if (isSupabaseAvailable()) {
    try {
      const { error } = await supabase
        .from('gastos')
        .update({
          descripcion: sanitized.descripcion,
          monto: sanitized.monto,
          categoria: sanitized.categoria,
          fecha: sanitized.fecha instanceof Date ? sanitized.fecha.toISOString().split('T')[0] : sanitized.fecha,
          metodoPago: sanitized.metodoPago,
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
  if (isSupabaseAvailable()) {
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
  if (isSupabaseAvailable()) {
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
  updateOrder,
  updateOrderStatus,
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  fetchEmpleados,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
  fetchGastos,
  createGasto,
  updateGasto,
  deleteGasto,
  fetchBalanceResumen,
} as const;

export default dataService;
