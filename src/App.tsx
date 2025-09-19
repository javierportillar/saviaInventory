import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Balance } from './components/Balance';
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
import { initializeLocalData } from './data/localData';
import * as dataService from './lib/dataService';

const SESSION_STORAGE_KEY = 'savia-user-session';
const SESSION_DURATION_MS = 4 * 60 * 60 * 1000; // 4 horas

interface StoredSession {
  user: User;
  timestamp: number;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [module, setModule] = useState<ModuleType>('dashboard');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    initializeLocalData();

    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!stored) {
        return;
      }

      const parsed: StoredSession = JSON.parse(stored);
      const isValidUser = parsed && parsed.user && typeof parsed.timestamp === 'number';
      if (!isValidUser) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        return;
      }

      const isExpired = Date.now() - parsed.timestamp > SESSION_DURATION_MS;
      if (isExpired) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        return;
      }

      setUser(parsed.user);
    } catch (error) {
      console.error('[App] No se pudo restaurar la sesión guardada.', error);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    let isActive = true;

    const fetchMenuItems = async () => {
      const data = await dataService.fetchMenuItems();
      if (isActive) {
        setMenuItems(data);
      }
    };

    fetchMenuItems();

    return () => {
      isActive = false;
    };
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    let isActive = true;

    const fetchOrders = async () => {
      const data = await dataService.fetchOrders();
      if (isActive) {
        setOrders(data);
      }
    };

    fetchOrders();

    return () => {
      isActive = false;
    };
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    let isActive = true;

    const fetchCustomers = async () => {
      const data = await dataService.fetchCustomers();
      if (isActive) {
        setCustomers(data);
      }
    };

    fetchCustomers();

    return () => {
      isActive = false;
    };
  }, [user]);

  const handleLogin = (user: User) => {
    setUser(user);

    try {
      const payload: StoredSession = { user, timestamp: Date.now() };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.error('[App] No se pudo guardar la sesión del usuario.', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setModule('dashboard');
    setMenuItems([]);
    setOrders([]);
    setCustomers([]);

    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (error) {
      console.error('[App] No se pudo limpiar la sesión guardada.', error);
    }
  };

  const handleModuleChange = (module: ModuleType) => {
    setModule(module);
  };

  const handleCreateMenuItem = async (newItem: MenuItem) => {
    const data = await dataService.createMenuItem(newItem);
    setMenuItems([...menuItems, data]);
  };

  const handleUpdateMenuItem = async (updatedItem: MenuItem) => {
    const savedItem = await dataService.updateMenuItem(updatedItem);
    setMenuItems(
      menuItems.map(item => (item.id === savedItem.id ? savedItem : item))
    );
  };

  const handleDeleteMenuItem = async (id: string) => {
    await dataService.deleteMenuItem(id);
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const handleCreateOrder = async (newOrder: Order) => {
    const data = await dataService.createOrder(newOrder);
    setOrders([...orders, data]);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['estado']) => {
    await dataService.updateOrderStatus(orderId, status);
    setOrders(
      orders.map(order => (order.id === orderId ? { ...order, estado: status } : order))
    );
  };

  const handleAddCustomer = async (newCustomer: Customer) => {
    const data = await dataService.createCustomer(newCustomer);
    setCustomers([...customers, data]);
  };

  const handleUpdateCustomer = async (updatedCustomer: Customer) => {
    await dataService.updateCustomer(updatedCustomer);
    setCustomers(
      customers.map(customer =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
  };

  const handleDeleteCustomer = async (id: string) => {
    await dataService.deleteCustomer(id);
    setCustomers(customers.filter(customer => customer.id !== id));
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
        {module === 'balance' && <Balance />}
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
