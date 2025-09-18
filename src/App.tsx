import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Caja } from './components/Caja';
import { Comandas } from './components/Comandas';
import { Inventario } from './components/Inventario';
import { Cocina } from './components/Cocina';
import { Clientes } from './components/Clientes';
import { Empleados } from './components/Empleados';
import { Gastos } from './components/Gastos';
import { Login } from './components/Login';
import { Navigation } from './components/Navigation';
import { ModuleType, User, MenuItem, Order, Customer } from './types';
import { supabase } from './lib/supabaseClient';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [module, setModule] = useState<ModuleType>('dashboard');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const { data, error } = await supabase.from('menu_items').select('*');
      if (error) {
        console.error('Error fetching menu items:', error);
      } else {
        setMenuItems(data || []);
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase.from('orders').select('*');
      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data || []);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase.from('customers').select('*');
      if (error) {
        console.error('Error fetching customers:', error);
      } else {
        setCustomers(data || []);
      }
    };

    fetchCustomers();
  }, []);

  const handleLogin = (user: User) => {
    setUser(user);
  };

  const handleLogout = () => {
    setUser(null);
    setModule('dashboard');
  };

  const handleModuleChange = (module: ModuleType) => {
    setModule(module);
  };

  const handleCreateMenuItem = async (newItem: MenuItem) => {
    const { data, error } = await supabase
      .from('menu_items')
      .insert([newItem])
      .select()
      .single();

    if (error) {
      console.error('Error creating menu item:', error);
    } else {
      setMenuItems([...menuItems, data]);
    }
  };

  const handleUpdateMenuItem = async (updatedItem: MenuItem) => {
    const { data, error } = await supabase
      .from('menu_items')
      .update(updatedItem)
      .eq('id', updatedItem.id);

    if (error) {
      console.error('Error updating menu item:', error);
    } else {
      setMenuItems(
        menuItems.map(item => (item.id === updatedItem.id ? updatedItem : item))
      );
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting menu item:', error);
    } else {
      setMenuItems(menuItems.filter(item => item.id !== id));
    }
  };

  const handleCreateOrder = async (newOrder: Order) => {
    const { data, error } = await supabase.from('orders').insert([newOrder]);
    if (error) {
      console.error('Error creating order:', error);
    } else {
      setOrders([...orders, newOrder]);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['estado']) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ estado: status })
      .eq('id', orderId);
    if (error) {
      console.error('Error updating order status:', error);
    } else {
      setOrders(
        orders.map(order => (order.id === orderId ? { ...order, estado: status } : order))
      );
    }
  };

  const handleAddCustomer = async (newCustomer: Customer) => {
    const { data, error } = await supabase.from('customers').insert([newCustomer]);
    if (error) {
      console.error('Error adding customer:', error);
    } else {
      setCustomers([...customers, newCustomer]);
    }
  };

  const handleUpdateCustomer = async (updatedCustomer: Customer) => {
    const { data, error } = await supabase
      .from('customers')
      .update(updatedCustomer)
      .eq('id', updatedCustomer.id);
    if (error) {
      console.error('Error updating customer:', error);
    } else {
      setCustomers(
        customers.map(customer =>
          customer.id === updatedCustomer.id ? updatedCustomer : customer
        )
      );
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    const { data, error } = await supabase.from('customers').delete().eq('id', id);
    if (error) {
      console.error('Error deleting customer:', error);
    } else {
      setCustomers(customers.filter(customer => customer.id !== id));
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        activeModule={module}
        onModuleChange={handleModuleChange}
        user={user}
        onLogout={handleLogout}
      />
      
      <main>
        {module === 'dashboard' && (
          <Dashboard
            orders={orders}
            menuItems={menuItems}
            onModuleChange={handleModuleChange}
          />
        )}
        {module === 'caja' && (
          <Caja
            onModuleChange={handleModuleChange}
          />
        )}
        {module === 'comandas' && (
          <Comandas
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
        {module === 'inventario' && (
          <Inventario
            menuItems={menuItems}
            onUpdateMenuItem={handleUpdateMenuItem}
            onCreateMenuItem={handleCreateMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
          />
        )}
        {module === 'cocina' && (
          <Cocina 
            orders={orders} 
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
        {module === 'clientes' && (
          <Clientes
            customers={customers}
            onAddCustomer={handleAddCustomer}
            onUpdateCustomer={handleUpdateCustomer}
            onDeleteCustomer={handleDeleteCustomer}
          />
        )}
        {module === 'empleados' && <Empleados />}
        {module === 'gastos' && <Gastos />}
      </main>
    </div>
  );
}

export default App;
