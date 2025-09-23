import React, { useState, useEffect } from 'react';
import { MenuItem, CartItem, Order, ModuleType, Customer, PaymentMethod, BowlSaladoCustomization } from '../types';
import { Plus, Minus, Trash2, Search, ShoppingCart, Edit2, Check } from 'lucide-react';
import { COLORS } from '../data/menu';
import { formatCOP, generateOrderNumber } from '../utils/format';
import {
  calculateCartTotal,
  getCartItemBaseUnitPrice,
  getCartItemEffectiveUnitPrice,
  getCartItemSubtotal,
  isSandwichItem,
  STUDENT_DISCOUNT_NOTE,
} from '../utils/cart';
import dataService from '../lib/dataService';
import {
  BOWL_BASE_LIMIT,
  BOWL_BASE_OPTIONS,
  BOWL_PROTEIN_OPTIONS,
  BOWL_TOPPING_LIMIT,
  BOWL_TOPPING_OPTIONS,
  isBowlSalado,
} from '../constants/bowl';

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
  const [bowlModalItem, setBowlModalItem] = useState<MenuItem | null>(null);
  const [selectedBowlBases, setSelectedBowlBases] = useState<string[]>([]);
  const [selectedBowlToppings, setSelectedBowlToppings] = useState<string[]>([]);
  const [selectedBowlProtein, setSelectedBowlProtein] = useState<string | null>(null);

  const resetBowlSelections = () => {
    setSelectedBowlBases([]);
    setSelectedBowlToppings([]);
    setSelectedBowlProtein(null);
  };

  const handleAddToCart = (item: MenuItem) => {
    if (isBowlSalado(item)) {
      resetBowlSelections();
      setBowlModalItem(item);
      return;
    }
    addToCart(item);
  };

  const toggleBowlOption = (
    option: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>,
    limit: number
  ) => {
    setSelected(prev => {
      if (prev.includes(option)) {
        return prev.filter(value => value !== option);
      }
      if (prev.length >= limit) {
        return prev;
      }
      return [...prev, option];
    });
  };

  const confirmBowlSelection = () => {
    if (!bowlModalItem || !selectedBowlProtein) return;

    if (
      selectedBowlBases.length !== BOWL_BASE_LIMIT ||
      selectedBowlToppings.length !== BOWL_TOPPING_LIMIT
    ) {
      return;
    }

    const notas = [
      `Bases: ${selectedBowlBases.join(', ')}`,
      `Toppings: ${selectedBowlToppings.join(', ')}`,
      `Proteína: ${selectedBowlProtein}`,
    ].join('\n');

    const customKey = [
      bowlModalItem.id,
      [...selectedBowlBases].sort().join('-'),
      [...selectedBowlToppings].sort().join('-'),
      selectedBowlProtein,
    ].join('|');

    addToCart(bowlModalItem, {
      notas,
      customKey,
      bowlCustomization: {
        bases: selectedBowlBases,
        toppings: selectedBowlToppings,
        proteina: selectedBowlProtein,
      },
    });

    setBowlModalItem(null);
    resetBowlSelections();
  };

  const closeBowlModal = () => {
    setBowlModalItem(null);
    resetBowlSelections();
  };

  const handleProteinSelection = (protein: string) => {
    setSelectedBowlProtein(prev => (prev === protein ? null : protein));
  };

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

  const nonInventariableCategories = menuItems
    .filter(item => item.inventarioCategoria !== 'Inventariables')
    .map(item => item.categoria);
  const categories = Array.from(new Set(nonInventariableCategories));
  
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = !searchQuery ||
      item.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.keywords && item.keywords.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || item.categoria === selectedCategory;
    const isNonInventariable = item.inventarioCategoria !== 'Inventariables';
    return matchesSearch && matchesCategory && isNonInventariable;
  });

  const getCartQuantity = (itemId: string) => {
    return cart
      .filter(({ item }) => item.id === itemId)
      .reduce((sum, cartItem) => sum + cartItem.cantidad, 0);
  };

  const addToCart = (
    item: MenuItem,
    options?: {
      notas?: string;
      customKey?: string;
      bowlCustomization?: BowlSaladoCustomization;
    }
  ) => {
    setCart(prev => {
      const existing = prev.find(
        cartItem =>
          cartItem.item.id === item.id &&
          cartItem.customKey === options?.customKey
      );

      if (existing) {
        return prev.map(cartItem =>
          cartItem.item.id === item.id && cartItem.customKey === options?.customKey
            ? { ...cartItem, cantidad: cartItem.cantidad + 1 }
            : cartItem
        );
      }

      return [
        ...prev,
        {
          item,
          cantidad: 1,
          notas: options?.notas,
          customKey: options?.customKey,
          bowlCustomization: options?.bowlCustomization,
          precioUnitario: item.precio,
          studentDiscount: false,
        },
      ];
    });
  };

  const updateQuantity = (
    itemId: string,
    customKey: string | undefined,
    cantidad: number
  ) => {
    if (cantidad <= 0) {
      setCart(prev =>
        prev.filter(
          cartItem =>
            !(cartItem.item.id === itemId && cartItem.customKey === customKey)
        )
      );
    } else {
      setCart(prev =>
        prev.map(cartItem =>
          cartItem.item.id === itemId && cartItem.customKey === customKey
            ? { ...cartItem, cantidad }
            : cartItem
        )
      );
    }
  };

  const removeFromCart = (itemId: string, customKey: string | undefined) => {
    setCart(prev =>
      prev.filter(
        cartItem =>
          !(cartItem.item.id === itemId && cartItem.customKey === customKey)
      )
    );
  };

  const toggleStudentDiscount = (itemId: string, customKey: string | undefined) => {
    setCart(prev =>
      prev.map(cartItem =>
        cartItem.item.id === itemId && cartItem.customKey === customKey
          ? { ...cartItem, studentDiscount: !cartItem.studentDiscount }
          : cartItem
      )
    );
  };

  const baseLimitReached = selectedBowlBases.length >= BOWL_BASE_LIMIT;
  const toppingLimitReached = selectedBowlToppings.length >= BOWL_TOPPING_LIMIT;
  const isBowlSelectionValid =
    selectedBowlBases.length === BOWL_BASE_LIMIT &&
    selectedBowlToppings.length === BOWL_TOPPING_LIMIT &&
    !!selectedBowlProtein;

  const total = calculateCartTotal(cart);

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
        <div className="order-2 lg:order-1 lg:col-span-2 space-y-6">
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
            {filteredItems.map((item) => {
              const quantity = getCartQuantity(item.id);
              const isSelected = quantity > 0;

              return (
                <div
                  key={item.id}
                  className={`relative rounded-lg lg:rounded-xl p-3 lg:p-4 shadow-sm hover:shadow-md transition-all duration-200 border ${
                    isSelected ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-100'
                  }`}
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
                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <span
                          className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-2 text-xs font-semibold text-white shadow-sm"
                          style={{ backgroundColor: COLORS.accent }}
                        >
                          {quantity}
                        </span>
                      )}
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={item.inventarioCategoria === 'Inventariables' && item.stock === 0}
                        className="px-3 lg:px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        style={{ backgroundColor: COLORS.dark }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel del carrito */}
        <div className="order-1 lg:order-2 space-y-6">
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
                    <div
                      key={`${cartItem.item.id}-${cartItem.customKey ?? 'default'}`}
                      className="bg-gray-50 rounded-lg p-3 space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-sm">{cartItem.item.nombre}</h4>
                            <span className="text-xs font-semibold text-gray-700">
                              Subtotal: {formatCOP(getCartItemSubtotal(cartItem))}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">
                            Precio unidad:{' '}
                            {cartItem.studentDiscount ? (
                              <>
                                <span className="line-through text-gray-400 mr-2">
                                  {formatCOP(getCartItemBaseUnitPrice(cartItem))}
                                </span>
                                <span className="font-semibold text-green-600">
                                  {formatCOP(getCartItemEffectiveUnitPrice(cartItem))}
                                </span>
                              </>
                            ) : (
                              <span>{formatCOP(getCartItemBaseUnitPrice(cartItem))}</span>
                            )}
                          </div>
                          {cartItem.studentDiscount && (
                            <span className="inline-flex items-center text-[11px] font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                              {STUDENT_DISCOUNT_NOTE}
                            </span>
                          )}
                          {cartItem.notas && (
                            <p className="text-xs text-gray-500 whitespace-pre-line">
                              {cartItem.notas}
                            </p>
                          )}
                          {isSandwichItem(cartItem.item) && (
                            <button
                              onClick={() => toggleStudentDiscount(cartItem.item.id, cartItem.customKey)}
                              className={`mt-1 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                                cartItem.studentDiscount
                                  ? 'bg-green-600 text-white hover:bg-green-700'
                                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              }`}
                            >
                              {cartItem.studentDiscount ? 'Quitar descuento' : 'Aplicar descuento estudiante'}
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2 self-start">
                          <button
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.customKey, cartItem.cantidad - 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center font-medium">{cartItem.cantidad}</span>
                          <button
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.customKey, cartItem.cantidad + 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white hover:opacity-90"
                            style={{ backgroundColor: COLORS.dark }}
                          >
                            <Plus size={12} />
                          </button>
                          <button
                            onClick={() => removeFromCart(cartItem.item.id, cartItem.customKey)}
                            className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
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

      {/* Modal personalización Bowl Salado */}
      {bowlModalItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg lg:text-xl font-bold" style={{ color: COLORS.dark }}>
                  Personaliza tu Bowl Salado
                </h3>
                <p className="text-sm text-gray-600">
                  Selecciona {BOWL_BASE_LIMIT} bases, {BOWL_TOPPING_LIMIT} toppings y 1 proteína.
                </p>
              </div>
              <button
                onClick={closeBowlModal}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                    Elige tu base
                  </h4>
                  <span className="text-xs text-gray-500">
                    {selectedBowlBases.length}/{BOWL_BASE_LIMIT}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {BOWL_BASE_OPTIONS.map((base) => {
                    const selected = selectedBowlBases.includes(base);
                    const disabled = !selected && baseLimitReached;
                    return (
                      <button
                        key={base}
                        type="button"
                        onClick={() => toggleBowlOption(base, selectedBowlBases, setSelectedBowlBases, BOWL_BASE_LIMIT)}
                        disabled={disabled}
                        className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                          selected
                            ? 'border-transparent shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={selected ? { backgroundColor: COLORS.beige, color: COLORS.dark, borderColor: COLORS.accent } : undefined}
                      >
                        <span>{base}</span>
                        {selected && (
                          <span
                            className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full text-white"
                            style={{ backgroundColor: COLORS.accent, color: COLORS.dark }}
                          >
                            <Check size={16} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                    Elige tus toppings
                  </h4>
                  <span className="text-xs text-gray-500">
                    {selectedBowlToppings.length}/{BOWL_TOPPING_LIMIT}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BOWL_TOPPING_OPTIONS.map((topping) => {
                    const selected = selectedBowlToppings.includes(topping);
                    const disabled = !selected && toppingLimitReached;
                    return (
                      <button
                        key={topping}
                        type="button"
                        onClick={() => toggleBowlOption(topping, selectedBowlToppings, setSelectedBowlToppings, BOWL_TOPPING_LIMIT)}
                        disabled={disabled}
                        className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                          selected
                            ? 'border-transparent shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={selected ? { backgroundColor: COLORS.beige, color: COLORS.dark, borderColor: COLORS.accent } : undefined}
                      >
                        <span>{topping}</span>
                        {selected && (
                          <span
                            className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full text-white"
                            style={{ backgroundColor: COLORS.accent, color: COLORS.dark }}
                          >
                            <Check size={16} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                    Elige tu proteína
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {BOWL_PROTEIN_OPTIONS.map((protein) => {
                    const selected = selectedBowlProtein === protein;
                    return (
                      <button
                        key={protein}
                        type="button"
                        onClick={() => handleProteinSelection(protein)}
                        className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                          selected
                            ? 'border-transparent shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={selected ? { backgroundColor: COLORS.beige, color: COLORS.dark, borderColor: COLORS.accent } : undefined}
                      >
                        <span>{protein}</span>
                        {selected && (
                          <span
                            className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full text-white"
                            style={{ backgroundColor: COLORS.accent, color: COLORS.dark }}
                          >
                            <Check size={16} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end border-t pt-4">
              <button
                onClick={closeBowlModal}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmBowlSelection}
                disabled={!isBowlSelectionValid}
                className="px-4 py-2 rounded-lg text-white font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: COLORS.dark }}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      )}

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
