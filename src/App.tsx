import React, { useState, useEffect, useRef } from 'react';
import { Dashboard } from './components/Dashboard';
import { Balance } from './components/Balance';
import { Caja } from './components/Caja';
import { Comandas } from './components/Comandas';
import { Inventario } from './components/Inventario';
import { Cocina } from './components/Cocina';
import { Clientes } from './components/Clientes';
import { Empleados } from './components/Empleados';
import { Gastos } from './components/Gastos';
import { Contabilidad } from './components/Contabilidad';
import { Login } from './components/Login';
import { Navigation } from './components/Navigation';
import { Analitica } from './components/Analitica';
import { CreditoEmpleados } from './components/CreditoEmpleados';
import { Novedades } from './components/Novedades';
import {
  ModuleType,
  User,
  MenuItem,
  Order,
  Customer,
  CartItem,
  PaymentAllocation,
  DatabaseConnectionState,
  PaymentMethod,
  FocusDateRequest,
} from './types';
import { initializeLocalData } from './data/localData';
import dataService from './lib/dataService';

const SESSION_STORAGE_KEY = 'savia-user-session';
const SESSION_DURATION_MS = 13 * 60 * 60 * 1000; // 13 horas

const MODULE_ROUTE_SEGMENTS: Record<ModuleType, string> = {
  dashboard: 'dashboard',
  balance: 'balance',
  caja: 'caja',
  comandas: 'comandas',
  inventario: 'inventario',
  cocina: 'cocina',
  clientes: 'clientes',
  empleados: 'empleados',
  gastos: 'gastos',
  contabilidad: 'contabilidad',
  novedades: 'novedades',
  creditoEmpleados: 'credito-empleados',
  analitica: 'analitica',
};

const MODULE_ROUTE_LOOKUP: Record<string, ModuleType> = Object.entries(MODULE_ROUTE_SEGMENTS).reduce(
  (acc, [module, segment]) => {
    acc[segment] = module as ModuleType;
    return acc;
  },
  {} as Record<string, ModuleType>
);

const getModuleFromHash = (): ModuleType => {
  if (typeof window === 'undefined') {
    return 'dashboard';
  }
  const cleaned = window.location.hash.replace(/^#\/?/, '').split(/[?#]/)[0].trim().toLowerCase();
  if (!cleaned) {
    return 'dashboard';
  }
  return MODULE_ROUTE_LOOKUP[cleaned] ?? 'dashboard';
};

const writeModuleHash = (module: ModuleType, replace = false) => {
  if (typeof window === 'undefined') {
    return;
  }
  const targetHash = `#/${MODULE_ROUTE_SEGMENTS[module]}`;
  if (window.location.hash === targetHash) {
    return;
  }
  if (replace) {
    const newUrl = `${window.location.pathname}${window.location.search}${targetHash}`;
    window.history.replaceState(null, '', newUrl);
    return;
  }
  window.location.hash = targetHash;
};

interface StoredSession {
  user: User;
  timestamp: number;
}

const readStoredSession = (): StoredSession | null => {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<StoredSession>;
    const hasValidShape =
      parsed &&
      typeof parsed === 'object' &&
      parsed.user &&
      typeof parsed.timestamp === 'number';
    if (!hasValidShape) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    const isExpired = Date.now() - parsed.timestamp > SESSION_DURATION_MS;
    if (isExpired) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return parsed as StoredSession;
  } catch (error) {
    console.error('[App] No se pudo leer la sesión guardada.', error);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [module, setModule] = useState<ModuleType>(() => getModuleFromHash());
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<DatabaseConnectionState>('checking');
  const [comandasFocus, setComandasFocus] = useState<FocusDateRequest | null>(null);
  const [gastosFocus, setGastosFocus] = useState<FocusDateRequest | null>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingMenuItems, setIsLoadingMenuItems] = useState(false);
  const [isSyncingOrders, setIsSyncingOrders] = useState(false);
  const hasLoadedCoreDataRef = useRef(false);

  const clearStoredSession = () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (error) {
      console.error('[App] No se pudo limpiar la sesión guardada.', error);
    }
  };

  const logoutToLogin = () => {
    setUser(null);
    setModule('dashboard');
    writeModuleHash('dashboard', true);
    setMenuItems([]);
    setOrders([]);
    setCustomers([]);
    clearStoredSession();
  };

  const ensureValidActiveSession = (): boolean => {
    const storedSession = readStoredSession();
    if (!storedSession) {
      if (user) {
        logoutToLogin();
      }
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const syncFromHash = () => {
      const targetModule = getModuleFromHash();
      if (user && !ensureValidActiveSession()) {
        return;
      }
      setModule(targetModule);
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => {
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, [user]);

  useEffect(() => {
    initializeLocalData();

    const storedSession = readStoredSession();
    if (storedSession) {
      setUser(storedSession.user);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setIsLoadingMenuItems(false);
      setIsLoadingOrders(false);
      setIsSyncingOrders(false);
      hasLoadedCoreDataRef.current = false;
      return;
    }

    if (module === 'caja' && hasLoadedCoreDataRef.current) {
      return;
    }

    let isActive = true;
    let isRefreshing = false;

    const refreshCoreData = async () => {
      if (!isActive || isRefreshing) {
        return;
      }
      if (!ensureValidActiveSession()) {
        return;
      }

      isRefreshing = true;
      setIsLoadingMenuItems(true);
      setIsLoadingOrders(true);

      try {
        const [menuItemsResult, ordersResult, customersResult] = await Promise.allSettled([
          dataService.fetchMenuItems(),
          dataService.fetchOrders(),
          dataService.fetchCustomers(),
        ]);

        if (!isActive) {
          return;
        }

        if (menuItemsResult.status === 'fulfilled') {
          setMenuItems(menuItemsResult.value);
        } else {
          console.error('[App] Error obteniendo inventario.', menuItemsResult.reason);
        }

        if (ordersResult.status === 'fulfilled') {
          setOrders(ordersResult.value);
        } else {
          console.error('[App] Error obteniendo comandas.', ordersResult.reason);
        }

        if (customersResult.status === 'fulfilled') {
          setCustomers(customersResult.value);
        } else {
          console.error('[App] Error obteniendo clientes.', customersResult.reason);
        }
      } finally {
        if (isActive) {
          setIsLoadingMenuItems(false);
          setIsLoadingOrders(false);
          hasLoadedCoreDataRef.current = true;
        }
        isRefreshing = false;
      }
    };

    refreshCoreData();

    return () => {
      isActive = false;
    };
  }, [user, module]);

  useEffect(() => {
    let isMounted = true;

    const checkConnection = async () => {
      try {
        const status = await dataService.checkDatabaseConnection();
        if (isMounted) {
          setConnectionStatus(status);
        }
      } catch (error) {
        console.error('[App] Error verificando la conexión con la base de datos.', error);
        if (isMounted) {
          setConnectionStatus('local');
        }
      }
    };

    checkConnection();
    const intervalId = window.setInterval(checkConnection, 30_000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    let isMounted = true;
    let unsubscribe: (() => void) | undefined;
    let isFetching = false;

    const refreshOrders = async () => {
      if (!isMounted || isFetching) {
        return;
      }
      isFetching = true;
      setIsSyncingOrders(true);
      try {
        const data = await dataService.fetchOrders();
        if (isMounted) {
          setOrders(data);
        }
      } catch (error) {
        console.error('[App] Error actualizando comandas tras cambios remotos.', error);
      } finally {
        if (isMounted) {
          setIsSyncingOrders(false);
        }
        isFetching = false;
      }
    };

    const setupSubscription = async () => {
      try {
        unsubscribe = await dataService.subscribeToOrders({
          onChange: refreshOrders,
          debounceMs: 400,
        });
      } catch (error) {
        console.error('[App] No se pudo suscribir a los cambios de comandas.', error);
      }
    };

    setupSubscription();

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
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
    logoutToLogin();
  };

  const canAccessModule = (targetModule: ModuleType, targetUser: User | null): boolean => {
    if ((targetModule === 'analitica' || targetModule === 'contabilidad') && targetUser?.role !== 'admin') {
      return false;
    }
    return true;
  };

  const navigateToModule = (
    targetModule: ModuleType,
    options?: { clearComandasFocus?: boolean; clearGastosFocus?: boolean; replaceHash?: boolean }
  ) => {
    if (user && !ensureValidActiveSession()) {
      return;
    }
    if (!canAccessModule(targetModule, user)) {
      return;
    }
    if (options?.clearComandasFocus) {
      setComandasFocus(null);
    }
    if (options?.clearGastosFocus) {
      setGastosFocus(null);
    }
    setModule(targetModule);
    writeModuleHash(targetModule, options?.replaceHash ?? false);
  };

  const handleModuleChange = (targetModule: ModuleType) => {
    navigateToModule(targetModule, {
      clearComandasFocus: targetModule === 'comandas',
      clearGastosFocus: targetModule === 'gastos',
    });
  };

  const getDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const createFocusRequest = (dateKey: string, orderId?: string): FocusDateRequest => ({
    dateKey,
    orderId,
    requestId: Date.now(),
  });

  const handleNavigateToComandasFromNovedades = (dateKey: string) => {
    setComandasFocus(createFocusRequest(dateKey));
    navigateToModule('comandas');
  };

  const handleNavigateToComandasFromCredit = (order: Order) => {
    const dateKey = getDateKey(order.timestamp);
    setComandasFocus(createFocusRequest(dateKey, order.id));
    navigateToModule('comandas');
  };

  const handleNavigateToGastosFromNovedades = (dateKey: string) => {
    setGastosFocus(createFocusRequest(dateKey));
    navigateToModule('gastos');
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    if (canAccessModule(module, user)) {
      writeModuleHash(module, true);
      return;
    }
    const fallback: ModuleType = user.role === 'admin' ? 'dashboard' : 'caja';
    setModule(fallback);
    writeModuleHash(fallback, true);
  }, [module, user]);

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

  const handleRefreshMenuItems = async () => {
    const data = await dataService.fetchMenuItems();
    setMenuItems(data);
  };

  const handleCreateOrder = async (newOrder: Order) => {
    const data = await dataService.createOrder(newOrder);
    setOrders((prev) => [...prev, data]);
  };

  const handleRecordOrderPayment = async (order: Order, allocations: PaymentAllocation[]) => {
    try {
      const updatedOrder = await dataService.recordOrderPayment(order, allocations);
      setOrders((prevOrders) =>
        prevOrders.map((entry) =>
          entry.id === updatedOrder.id ? updatedOrder : entry
        )
      );
    } catch (error) {
      console.error('Error registrando el pago del pedido:', error);
      throw error;
    }
  };

  const handleAssignOrderCredit = async (
    order: Order,
    options: { employeeId: string; amount: number; employeeName?: string }
  ) => {
    try {
      const updatedOrder = await dataService.assignOrderCredit(order, options);
      setOrders((prevOrders) =>
        prevOrders.map((entry) =>
          entry.id === updatedOrder.id ? updatedOrder : entry
        )
      );
    } catch (error) {
      console.error('Error asignando el pedido a crédito de empleados:', error);
      throw error;
    }
  };

  const handleSettleOrderCredit = async (order: Order, options: { metodo: PaymentMethod }) => {
    try {
      const updatedOrder = await dataService.settleOrderEmployeeCredit(order, options);
      setOrders((prevOrders) =>
        prevOrders.map((entry) =>
          entry.id === updatedOrder.id ? updatedOrder : entry
        )
      );
    } catch (error) {
      console.error('Error marcando el crédito de empleados como pagado:', error);
      throw error;
    }
  };

  const handleUpdateOrderStatus = async (targetOrder: Order, status: Order['estado']) => {
    try {
      const updatedOrder = await dataService.updateOrderStatus(targetOrder, status);
      setOrders((prevOrders) => {
        const index = prevOrders.findIndex(order => order.id === updatedOrder.id);
        if (index === -1) {
          return prevOrders;
        }
        const next = [...prevOrders];
        next[index] = updatedOrder;
        return next;
      });
    } catch (error) {
      console.error('Error actualizando el estado del pedido:', error);
      alert('No se pudo actualizar el estado del pedido. Inténtalo nuevamente.');
    }
  };

  const handleSaveOrderChanges = async (
    orderId: string,
    updates: { items: CartItem[]; total: number }
  ) => {
    try {
      const updatedOrder = await dataService.updateOrder(orderId, updates);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? updatedOrder
            : order
        )
      );
    } catch (error) {
      console.error('Error actualizando la orden:', error);
      throw error;
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await dataService.deleteOrder(orderId);
      const refreshedOrders = await dataService.fetchOrders();
      setOrders(refreshedOrders);
    } catch (error) {
      console.error('Error eliminando la comanda:', error);
      throw error;
    }
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
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Navigation
        activeModule={module}
        onModuleChange={handleModuleChange}
        user={user}
        onLogout={handleLogout}
        connectionStatus={connectionStatus}
      />
      <main className="ui-page py-6">
        <div className="ui-page-stack">
          {module === 'dashboard' && (
            <Dashboard
              orders={orders}
              menuItems={menuItems}
              onModuleChange={handleModuleChange}
              isLoading={isLoadingOrders || isLoadingMenuItems}
            />
          )}
          {module === 'balance' && <Balance />}
          {module === 'caja' && (
            <Caja
              orders={orders}
              onModuleChange={handleModuleChange}
              onCreateOrder={handleCreateOrder}
              onRecordOrderPayment={handleRecordOrderPayment}
              onAssignOrderCredit={handleAssignOrderCredit}
            />
          )}
          {module === 'comandas' && (
            <Comandas
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onSaveOrderChanges={handleSaveOrderChanges}
              onRecordOrderPayment={handleRecordOrderPayment}
              onDeleteOrder={handleDeleteOrder}
              isAdmin={user.role === 'admin'}
              onAssignOrderCredit={handleAssignOrderCredit}
              focusRequest={comandasFocus}
              isLoading={isLoadingOrders}
              isSyncing={isSyncingOrders}
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
          {module === 'gastos' && (
            <Gastos
              focusRequest={gastosFocus}
              onInventoryChanged={handleRefreshMenuItems}
            />
          )}
          {module === 'contabilidad' && user.role === 'admin' && <Contabilidad />}
          {module === 'novedades' && (
            <Novedades
              onNavigateToComandas={handleNavigateToComandasFromNovedades}
              onNavigateToGastos={handleNavigateToGastosFromNovedades}
            />
          )}
          {module === 'creditoEmpleados' && (
            <CreditoEmpleados
              orders={orders}
              onSettleCredit={handleSettleOrderCredit}
              onViewOrder={handleNavigateToComandasFromCredit}
            />
          )}
          {module === 'analitica' && user.role === 'admin' && (
            <Analitica orders={orders} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
