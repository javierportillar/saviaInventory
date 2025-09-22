import React, { useState, useEffect } from 'react';
import { MenuItem, CartItem, Order, ModuleType, Customer, PaymentMethod } from '../types';
import { Plus, Minus, Trash2, Search, ShoppingCart, Edit2 } from 'lucide-react';
import { COLORS } from '../data/menu';
import { formatCOP, generateOrderNumber } from '../utils/format';
import dataService from '../lib/dataService';

interface CajaProps {
  onModuleChange: (module: ModuleType) => void;
  onCreateOrder: (order: Order) => Promise<void>;
}

export function Caja({ onModuleChange, onCreateOrder }: CajaProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [customerName, setCustomerName] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchMenuItems();
    fetchCustomers();
  }, []);

  const fetchMenuItems = async () => {
    const data = await dataService.fetchMenuItems();
    setMenuItems(data);
  };

  const fetchCustomers = async () => {
    const data = await dataService.fetchCustomers();
    setCustomers(data);
  };

  const categories = Array.from(new Set(menuItems.map(item => item.categoria)));
  
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = !searchQuery ||
      item.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.keywords && item.keywords.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || item.categoria === selectedCategory;
    const isNonInventariable = item.inventarioCategoria !== 'Inventariables';
    return matchesSearch && matchesCategory && isNonInventariable;
  });

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.item.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, cantidad: cartItem.cantidad + 1 }
            : cartItem
        );
      }
      return [...prev, { item, cantidad: 1 }];
    });
  };

  const updateQuantity = (itemId: string, cantidad: number) => {
    if (cantidad <= 0) {
      setCart(prev => prev.filter(cartItem => cartItem.item.id !== itemId));
    } else {
      setCart(prev =>
        prev.map(cartItem =>
          cartItem.item.id === itemId
            ? { ...cartItem, cantidad }
            : cartItem
        )
      );
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(cartItem => cartItem.item.id !== itemId));
  };

  const total = cart.reduce((sum, cartItem) => sum + (cartItem.item.precio * cartItem.cantidad), 0);

  const processPayment = async () => {
    if (cart.length === 0) return;

    let customer = selectedCustomer;
    let customerId: string | undefined;
    const trimmedCustomerName = customerName.trim();

    if (!customer && trimmedCustomerName) {
      const existing = customers.find(
        c => c.nombre.toLowerCase() === trimmedCustomerName.toLowerCase()
      );
      if (existing) {
        customer = existing;
        customerId = existing.id;
      } else {
        const telefono = window.prompt('Ingrese teléfono del cliente');
        if (!telefono) {
          alert('Debe ingresar un teléfono para continuar');
          return;
        }

        const newCustomer: Customer = {
          id: crypto.randomUUID(),
          nombre: trimmedCustomerName,
          telefono: telefono.trim(),
        };

        const newCustomerData = await dataService.createCustomer(newCustomer);
        customer = newCustomerData;
        customerId = newCustomerData.id;
        setCustomers(prevCustomers => [...prevCustomers, newCustomerData]);
      }
    } else if (customer) {
      customerId = customer.id;
    }

    const orderCustomerName = customer?.nombre ?? (trimmedCustomerName || undefined);

    const order: Order = {
      id: crypto.randomUUID(),
      numero: generateOrderNumber(),
      items: cart,
      total,
      estado: 'pendiente',
      timestamp: new Date(),
      cliente_id: customerId,
      cliente: orderCustomerName,
      metodoPago: paymentMethod,
    };

    await onCreateOrder(order);

    setCart([]);
    setShowPayment(false);
    setCustomerName('');
    setSelectedCustomer(null);
    onModuleChange('comandas');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Panel de productos */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold mb-4" style={{ color: COLORS.dark }}>
              Punto de Venta
            </h2>
            
            {/* Búsqueda y filtros */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                  style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm w-full lg:w-auto"
                style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg lg:rounded-xl p-3 lg:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm lg:text-base" style={{ color: COLORS.dark }}>
                    {item.nombre}
                  </h3>
                  <span className="font-bold text-sm lg:text-base" style={{ color: COLORS.accent }}>
                    {formatCOP(item.precio)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{item.categoria}</p>
                {item.descripcion && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.descripcion}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Stock: {item.stock}</span>
                  <button
                    onClick={() => addToCart(item)}
                    disabled={item.inventarioCategoria === 'Inventariables' && item.stock === 0}
                    className="px-3 lg:px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    style={{ backgroundColor: COLORS.dark }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel del carrito */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 lg:sticky lg:top-24">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart size={24} style={{ color: COLORS.dark }} />
              <h3 className="text-lg lg:text-xl font-bold" style={{ color: COLORS.dark }}>
                Carrito
              </h3>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-6 lg:py-8 text-sm">Carrito vacío</p>
            ) : (
              <>
                <div className="space-y-3 mb-4 lg:mb-6 max-h-80 lg:max-h-96 overflow-y-auto">
                  {cart.map((cartItem) => (
                    <div key={cartItem.item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{cartItem.item.nombre}</h4>
                        <p className="text-xs text-gray-600">{formatCOP(cartItem.item.precio)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(cartItem.item.id, cartItem.cantidad - 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center font-medium">{cartItem.cantidad}</span>
                        <button
                          onClick={() => updateQuantity(cartItem.item.id, cartItem.cantidad + 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white hover:opacity-90"
                          style={{ backgroundColor: COLORS.dark }}
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => removeFromCart(cartItem.item.id)}
                          className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 ml-2"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-xl lg:text-2xl font-bold" style={{ color: COLORS.accent }}>
                      {formatCOP(total)}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setShowPayment(true)}
                    className="w-full py-3 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105 text-base"
                    style={{ backgroundColor: COLORS.dark }}
                  >
                    Procesar Pago
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de pago */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg lg:text-xl font-bold mb-4" style={{ color: COLORS.dark }}>
              Procesar Pago
            </h3>
            
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium mb-2">Cliente (opcional)</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      setSelectedCustomer(null);
                    }}
                    placeholder="Nombre del cliente"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent pr-10 text-sm"
                    readOnly={!!selectedCustomer}
                  />
                  {selectedCustomer && (
                    <button
                      type="button"
                      onClick={() => setSelectedCustomer(null)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  {customerName && !selectedCustomer && (
                    <div
                      className="absolute z-10 bg-white border border-gray-200 rounded-lg mt-1 w-full max-h-32 sm:max-h-40 overflow-y-auto"
                    >
                      {customers
                        .filter(c =>
                          c.nombre.toLowerCase().includes(customerName.toLowerCase())
                        )
                        .map(c => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setCustomerName(c.nombre);
                              setSelectedCustomer(c);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                          >
                            {c.nombre}
                          </button>
                        ))}
                    </div>
                  )}
                </div>

              <div>
                <label className="block text-sm font-medium mb-2">Método de pago</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['efectivo', 'tarjeta', 'nequi'] as PaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                        paymentMethod === method
                          ? 'border-transparent text-white'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      style={{
                        backgroundColor: paymentMethod === method ? COLORS.dark : 'transparent'
                      }}
                    >
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold">Total a pagar:</span>
                  <span className="text-xl lg:text-2xl font-bold" style={{ color: COLORS.accent }}>
                    {formatCOP(total)}
                  </span>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPayment(false)}
                    className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={processPayment}
                    className="flex-1 py-3 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105 text-sm"
                    style={{ backgroundColor: COLORS.dark }}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
