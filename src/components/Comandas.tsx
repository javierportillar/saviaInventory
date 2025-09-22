import React, { useState, useEffect } from 'react';
import { Order, MenuItem, CartItem } from '../types';
import { Clock, CheckCircle, User, CreditCard, Edit3, Plus, Minus, Trash2, Save, X } from 'lucide-react';
import { COLORS } from '../data/menu';
import { formatCOP, formatDateTime } from '../utils/format';
import dataService from '../lib/dataService';

interface ComandasProps {
  orders: Order[];
  onUpdateOrderStatus: (order: Order, status: Order['estado']) => void;
  onSaveOrderChanges: (orderId: string, updates: { items: CartItem[]; total: number }) => Promise<void>;
}

interface EditingOrder {
  orderId: string;
  items: CartItem[];
  total: number;
}

export function Comandas({ orders, onUpdateOrderStatus, onSaveOrderChanges }: ComandasProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingOrder, setEditingOrder] = useState<EditingOrder | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const data = await dataService.fetchMenuItems();
    setMenuItems(data);
  };

  const sortedOrders = [...orders].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const getStatusColor = (status: Order['estado']) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparando': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'listo': return 'bg-green-100 text-green-800 border-green-200';
      case 'entregado': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Order['estado']) => {
    switch (status) {
      case 'pendiente': return <Clock size={16} />;
      case 'preparando': return <Clock size={16} className="animate-pulse" />;
      case 'listo': return <CheckCircle size={16} />;
      case 'entregado': return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const startEditingOrder = (order: Order) => {
    setEditingOrder({
      orderId: order.id,
      items: [...order.items],
      total: order.total
    });
  };

  const updateItemPrice = (itemIndex: number, newPrice: number) => {
    if (!editingOrder) return;
    
    const updatedItems = [...editingOrder.items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      item: {
        ...updatedItems[itemIndex].item,
        precio: newPrice
      }
    };
    
    const newTotal = updatedItems.reduce((sum, cartItem) => 
      sum + (cartItem.item.precio * cartItem.cantidad), 0
    );
    
    setEditingOrder({
      ...editingOrder,
      items: updatedItems,
      total: newTotal
    });
  };

  const updateItemQuantity = (itemIndex: number, newQuantity: number) => {
    if (!editingOrder) return;
    
    if (newQuantity <= 0) {
      removeItem(itemIndex);
      return;
    }
    
    const updatedItems = [...editingOrder.items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      cantidad: newQuantity
    };
    
    const newTotal = updatedItems.reduce((sum, cartItem) => 
      sum + (cartItem.item.precio * cartItem.cantidad), 0
    );
    
    setEditingOrder({
      ...editingOrder,
      items: updatedItems,
      total: newTotal
    });
  };

  const removeItem = (itemIndex: number) => {
    if (!editingOrder) return;
    
    const updatedItems = editingOrder.items.filter((_, index) => index !== itemIndex);
    const newTotal = updatedItems.reduce((sum, cartItem) => 
      sum + (cartItem.item.precio * cartItem.cantidad), 0
    );
    
    setEditingOrder({
      ...editingOrder,
      items: updatedItems,
      total: newTotal
    });
  };

  const addProductToOrder = (menuItem: MenuItem) => {
    if (!editingOrder) return;
    
    const existingItemIndex = editingOrder.items.findIndex(
      item => item.item.id === menuItem.id
    );
    
    let updatedItems;
    if (existingItemIndex >= 0) {
      updatedItems = [...editingOrder.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        cantidad: updatedItems[existingItemIndex].cantidad + 1
      };
    } else {
      updatedItems = [...editingOrder.items, {
        item: menuItem,
        cantidad: 1
      }];
    }
    
    const newTotal = updatedItems.reduce((sum, cartItem) => 
      sum + (cartItem.item.precio * cartItem.cantidad), 0
    );
    
    setEditingOrder({
      ...editingOrder,
      items: updatedItems,
      total: newTotal
    });
    
    setShowAddProduct(false);
    setSearchQuery('');
  };

  const saveOrderChanges = async () => {
    if (!editingOrder) return;
    
    try {
      await onSaveOrderChanges(editingOrder.orderId, {
        items: editingOrder.items,
        total: editingOrder.total
      });

      setEditingOrder(null);
      setShowAddProduct(false);
      setSearchQuery('');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error al actualizar la orden');
    }
  };

  const cancelEditing = () => {
    setEditingOrder(null);
    setShowAddProduct(false);
    setSearchQuery('');
  };

  const filteredMenuItems = menuItems.filter(item =>
    item.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.keywords && item.keywords.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2" style={{ color: COLORS.dark }}>
          Gestión de Comandas
        </h2>
        <p className="text-sm lg:text-base text-gray-600">
          Control de pedidos y estado de preparación
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg lg:rounded-xl p-8 lg:p-12 text-center shadow-sm border border-gray-100">
          <Clock size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg lg:text-xl font-semibold text-gray-600 mb-2">No hay comandas</h3>
          <p className="text-sm lg:text-base text-gray-500">Los pedidos aparecerán aquí cuando se procesen desde caja</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {sortedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 space-y-2 lg:space-y-0">
                <div className="flex-1">
                  <h3 className="text-lg lg:text-xl font-bold mb-1" style={{ color: COLORS.dark }}>
                    #{order.numero}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-500">{formatDateTime(order.timestamp)}</p>
                </div>
                <span className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium border flex items-center gap-1 self-start ${getStatusColor(order.estado)}`}>
                  {getStatusIcon(order.estado)}
                  <span className="hidden lg:inline">{order.estado}</span>
                </span>
              </div>

              {order.cliente && (
                <div className="flex items-center gap-2 mb-3 text-xs lg:text-sm text-gray-600">
                  <User size={14} />
                  <span>{order.cliente}</span>
                </div>
              )}

              {order.metodoPago && (
                <div className="flex items-center gap-2 mb-4 text-xs lg:text-sm text-gray-600">
                  <CreditCard size={14} />
                  <span className="capitalize">{order.metodoPago}</span>
                </div>
              )}

              {editingOrder?.orderId === order.id ? (
                <div className="space-y-3 mb-4">
                  <h4 className="font-semibold text-sm">Editando pedido:</h4>
                  {editingOrder.items.map((cartItem, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm">{cartItem.item.nombre}</span>
                          <button
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        
                        <div className="flex flex-col lg:flex-row gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-xs text-gray-600">Cant:</span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => updateItemQuantity(index, cartItem.cantidad - 1)}
                                className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center text-sm">{cartItem.cantidad}</span>
                              <button
                                onClick={() => updateItemQuantity(index, cartItem.cantidad + 1)}
                                className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-xs text-gray-600">Precio:</span>
                            <input
                              type="number"
                              value={cartItem.item.precio}
                              onChange={(e) => updateItemPrice(index, Number(e.target.value))}
                              className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
                            />
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className="text-sm font-medium">
                            Subtotal: {formatCOP(cartItem.item.precio * cartItem.cantidad)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex flex-col lg:flex-row gap-2">
                    <button
                      onClick={() => setShowAddProduct(true)}
                      className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-1"
                    >
                      <Plus size={14} />
                      Agregar producto
                    </button>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold">Nuevo Total:</span>
                      <span className="font-bold text-lg" style={{ color: COLORS.accent }}>
                        {formatCOP(editingOrder.total)}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={saveOrderChanges}
                        className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-1"
                      >
                        <Save size={14} />
                        Guardar
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="flex-1 py-2 bg-gray-400 text-white rounded-lg text-sm font-medium hover:bg-gray-500 flex items-center justify-center gap-1"
                      >
                        <X size={14} />
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  {order.items.map((cartItem, index) => (
                    <div key={index} className="flex justify-between items-center text-xs lg:text-sm">
                      <span>{cartItem.cantidad}x {cartItem.item.nombre}</span>
                      <span className="font-medium">{formatCOP(cartItem.item.precio * cartItem.cantidad)}</span>
                    </div>
                  ))}
                </div>
              )}

              {editingOrder?.orderId !== order.id && (
                <>
                  <div className="border-t pt-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold text-lg" style={{ color: COLORS.accent }}>
                        {formatCOP(order.total)}
                      </span>
                    </div>
                  </div>

                  {order.estado !== 'entregado' && (
                    <div className="space-y-2">
                      {order.estado === 'pendiente' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order, 'preparando')}
                          className="w-full py-2 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 text-sm"
                          style={{ backgroundColor: COLORS.dark }}
                        >
                          Iniciar preparación
                        </button>
                      )}
                      {order.estado === 'preparando' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order, 'listo')}
                          className="w-full py-2 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 text-sm"
                          style={{ backgroundColor: COLORS.accent, color: COLORS.dark }}
                        >
                          Marcar como listo
                        </button>
                      )}
                      {order.estado === 'listo' && (
                        <div className="space-y-2">
                          <button
                            onClick={() => startEditingOrder(order)}
                            className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 text-sm flex items-center justify-center gap-1"
                          >
                            <Edit3 size={14} />
                            Modificar pedido
                          </button>
                          <button
                            onClick={() => onUpdateOrderStatus(order, 'entregado')}
                            className="w-full py-2 bg-green-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 text-sm"
                          >
                            Entregar pedido
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal para agregar productos */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            <h3 className="text-lg lg:text-xl font-bold mb-4" style={{ color: COLORS.dark }}>
              Agregar Producto
            </h3>
            
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent mb-4 text-sm"
              style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
            />
            
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {filteredMenuItems.slice(0, 10).map((item) => (
                <button
                  key={item.id}
                  onClick={() => addProductToOrder(item)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.nombre}</h4>
                      <p className="text-xs text-gray-600">{item.categoria}</p>
                    </div>
                    <span className="font-bold text-sm" style={{ color: COLORS.accent }}>
                      {formatCOP(item.precio)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => {
                setShowAddProduct(false);
                setSearchQuery('');
              }}
              className="w-full py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}