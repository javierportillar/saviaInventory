import React, { useState } from 'react';
import { Order, MenuItem, ModuleType, Client } from './types';
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
  const [menuItems, setMenuItems] = useLocalStorage<MenuItem[]>('savia-inventory', MENU_ITEMS);
  const [clients, setClients] = useLocalStorage<Client[]>('savia-clients', []);

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

  const addClient = (client: Client) => {
    setClients(prev => [...prev, client]);
  };

  const updateClient = (client: Client) => {
    setClients(prev => prev.map(c => c.id === client.id ? client : c));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <Dashboard 
            orders={orders} 
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
            clients={clients}
            onAddClient={addClient}
          />
        );
      case 'comandas':
        return (
          <Comandas 
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        );
      case 'inventario':
        return (
          <Inventario 
            menuItems={menuItems}
            onUpdateStock={handleUpdateStock}
          />
        );
      case 'cocina':
        return (
          <Cocina
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        );
      case 'clientes':
        return (
          <Clientes
            clients={clients}
            onAddClient={addClient}
            onUpdateClient={updateClient}
            onDeleteClient={deleteClient}
          />
        );
      default:
        return <Dashboard orders={orders} menuItems={menuItems} onModuleChange={setActiveModule} />;
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