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

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [module, setModule] = useState<ModuleType>('dashboard');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    // Inicializar datos locales
    initializeLocalData();
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const data = await dataService.fetchMenuItems();
      setMenuItems(data);
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await dataService.fetchOrders();
      setOrders(data);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      const data = await dataService.fetchCustomers();
      setCustomers(data);
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
