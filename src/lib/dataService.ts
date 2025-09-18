import { MenuItem, Order, Customer, Empleado, Gasto } from '../types';
import { supabase } from './supabaseClient';
import { getLocalData, setLocalData } from '../data/localData';

// Verificar si Supabase está disponible
const isSupabaseAvailable = () => {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
};

// MENU ITEMS
export const fetchMenuItems = async (): Promise<MenuItem[]> => {
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await supabase.from('menu_items').select('*');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }
  return getLocalData('savia-menuItems', []);
};

export const createMenuItem = async (item: MenuItem): Promise<MenuItem> => {
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([item])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }
  
  // Local storage fallback
  const items = getLocalData('savia-menuItems', []);
  const newItems = [...items, item];
  setLocalData('savia-menuItems', newItems);
  return item;
};

export const updateMenuItem = async (item: MenuItem): Promise<MenuItem> => {
  if (isSupabaseAvailable()) {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update(item)
        .eq('id', item.id);
      if (error) throw error;
      return item;
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }
  
  // Local storage fallback
  const items = getLocalData('savia-menuItems', []);
  const updatedItems = items.map(i => i.id === item.id ? item : i);
  setLocalData('savia-menuItems', updatedItems);
  return item;
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
  const items = getLocalData('savia-menuItems', []);
  const filteredItems = items.filter(item => item.id !== id);
  setLocalData('savia-menuItems', filteredItems);
};

// ORDERS
export const fetchOrders = async (): Promise<Order[]> => {
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await supabase.from('orders').select('*');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }
  return getLocalData('savia-orders', []);
};

export const createOrder = async (order: Order): Promise<Order> => {
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await supabase.from('orders').insert([order]).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }
  
  // Local storage fallback
  const orders = getLocalData('savia-orders', []);
  const newOrders = [...orders, order];
  setLocalData('savia-orders', newOrders);
  return order;
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
  const orders = getLocalData('savia-orders', []);
  const updatedOrders = orders.map(order => 
    order.id === orderId ? { ...order, estado: status } : order
  );
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
  return getLocalData('savia-customers', []);
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
  const customers = getLocalData('savia-customers', []);
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
  const customers = getLocalData('savia-customers', []);
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
  const customers = getLocalData('savia-customers', []);
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
  return getLocalData('savia-empleados', []);
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
  const empleados = getLocalData('savia-empleados', []);
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
  const empleados = getLocalData('savia-empleados', []);
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
  const empleados = getLocalData('savia-empleados', []);
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
      return data?.map(gasto => ({
        ...gasto,
        fecha: new Date(gasto.fecha),
        created_at: gasto.created_at ? new Date(gasto.created_at) : undefined
      })) || [];
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }
  return getLocalData('savia-gastos', []);
};

export const createGasto = async (gasto: Gasto): Promise<Gasto> => {
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await supabase.from('gastos').insert([gasto]).select().single();
      if (error) throw error;
      return {
        ...data,
        fecha: new Date(data.fecha),
        created_at: data.created_at ? new Date(data.created_at) : undefined
      };
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }
  
  // Local storage fallback
  const gastos = getLocalData('savia-gastos', []);
  const newGastos = [...gastos, gasto];
  setLocalData('savia-gastos', newGastos);
  return gasto;
};

export const updateGasto = async (gasto: Gasto): Promise<Gasto> => {
  if (isSupabaseAvailable()) {
    try {
      const { error } = await supabase
        .from('gastos')
        .update(gasto)
        .eq('id', gasto.id);
      if (error) throw error;
      return gasto;
    } catch (error) {
      console.warn('Supabase not available, using local data:', error);
    }
  }
  
  // Local storage fallback
  const gastos = getLocalData('savia-gastos', []);
  const updatedGastos = gastos.map(g => g.id === gasto.id ? gasto : g);
  setLocalData('savia-gastos', updatedGastos);
  return gasto;
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
  const gastos = getLocalData('savia-gastos', []);
  const filteredGastos = gastos.filter(gasto => gasto.id !== id);
  setLocalData('savia-gastos', filteredGastos);
};