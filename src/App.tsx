import React, { useMemo, useState } from 'react';
import { Order, MenuItem, ModuleType, Customer } from './types';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { Caja } from './components/Caja';
import { Comandas } from './components/Comandas';
import { Inventario } from './components/Inventario';
import { Cocina } from './components/Cocina';
import { Clientes } from './components/Clientes';
import { MENU_ITEMS, COLORS } from './data/menu';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');
  const [orders, setOrders] = useLocalStorage<Order[]>('savia-orders', []);
  const parsedOrders = useMemo(
    () =>
      orders.map((order) => ({
        ...order,
        timestamp: new Date(order.timestamp),
      })),
    [orders]
  );
  const [menuItems, setMenuItems] = useLocalStorage<MenuItem[]>('savia-inventory', MENU_ITEMS);
  const [customers, setCustomers] = useLocalStorage<Customer[]>('savia-customers', []);

  const handleCreateOrder = (order: Order) => {
    setOrders(prev => [...prev, order]);
    
    // Actualizar stock
    setMenuItems(prev => 
      prev.map(item => {
        const cartItem = order.items.find(ci => ci.item.id === item.id);
        if (cartItem) {
          return { ...item, stock: Math.max(0, item.stock - cartItem.cantidad) };
        }
        return item;
      })
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['estado']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, estado: status } : order
      )
    );
  };

  const handleUpdateStock = (itemId: string, newStock: number) => {
    setMenuItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, stock: newStock } : item
      )
    );
  };

  const handleAddItem = (item: MenuItem) => {
    setMenuItems(prev => [...prev, item]);
  };

  const handleUpdateItem = (updated: MenuItem) => {
    setMenuItems(prev =>
      prev.map(item => (item.id === updated.id ? updated : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
  };

  const handleUpdateCustomer = (customer: Customer) => {
    setCustomers(prev => prev.map(c => (c.id === customer.id ? customer : c)));
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <Dashboard
            orders={parsedOrders}
            menuItems={menuItems}
            onModuleChange={setActiveModule}
          />
        );
      case 'caja':
        return (
          <Caja
            menuItems={menuItems}
            onCreateOrder={handleCreateOrder}
            onModuleChange={setActiveModule}
            customers={customers}
            onAddCustomer={handleAddCustomer}
          />
        );
      case 'comandas':
        return (
          <Comandas
            orders={parsedOrders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        );
      case 'inventario':
        return (
          <Inventario
            menuItems={menuItems}
            onUpdateStock={handleUpdateStock}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        );
      case 'cocina':
        return (
          <Cocina
            orders={parsedOrders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        );
      case 'clientes':
        return (
          <Clientes
            customers={customers}
            onAddCustomer={handleAddCustomer}
            onUpdateCustomer={handleUpdateCustomer}
            onDeleteCustomer={handleDeleteCustomer}
          />
        );
      default:
        return <Dashboard orders={parsedOrders} menuItems={menuItems} onModuleChange={setActiveModule} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.beige }}>
      <Navigation 
        activeModule={activeModule} 
        onModuleChange={setActiveModule} 
      />
      
      <main className="transition-all duration-300 ease-in-out">
        {renderModule()}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-600">
          SAVIA | Sistema de gestión integral | 📍 Frente a la Universidad Mariana – Pasto, Nariño
        </div>
      </footer>
    </div>
  );
}

export default App;