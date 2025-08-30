import React from 'react';
import { Order } from '../types';
import { Clock, CheckCircle, User, CreditCard } from 'lucide-react';
import { COLORS } from '../data/menu';
import { formatCOP, formatDateTime } from '../utils/format';

interface ComandasProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['estado']) => void;
}

export function Comandas({ orders, onUpdateOrderStatus }: ComandasProps) {
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

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2" style={{ color: COLORS.dark }}>
          Gestión de Comandas
        </h2>
        <p className="text-gray-600">
          Control de pedidos y estado de preparación
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <Clock size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay comandas</h3>
          <p className="text-gray-500">Los pedidos aparecerán aquí cuando se procesen desde caja</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1" style={{ color: COLORS.dark }}>
                    #{order.numero}
                  </h3>
                  <p className="text-sm text-gray-500">{formatDateTime(order.timestamp)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1 ${getStatusColor(order.estado)}`}>
                  {getStatusIcon(order.estado)}
                  {order.estado}
                </span>
              </div>

              {order.cliente && (
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                  <User size={16} />
                  <span>{order.cliente}</span>
                </div>
              )}

              {order.metodoPago && (
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                  <CreditCard size={16} />
                  <span className="capitalize">{order.metodoPago}</span>
                </div>
              )}

              <div className="space-y-2 mb-4">
                {order.items.map((cartItem, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span>{cartItem.cantidad}x {cartItem.item.nombre}</span>
                    <span className="font-medium">{formatCOP(cartItem.item.precio * cartItem.cantidad)}</span>
                  </div>
                ))}
              </div>

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
                      onClick={() => onUpdateOrderStatus(order.id, 'preparando')}
                      className="w-full py-2 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105"
                      style={{ backgroundColor: COLORS.dark }}
                    >
                      Iniciar preparación
                    </button>
                  )}
                  {order.estado === 'preparando' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'listo')}
                      className="w-full py-2 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105"
                      style={{ backgroundColor: COLORS.accent, color: COLORS.dark }}
                    >
                      Marcar como listo
                    </button>
                  )}
                  {order.estado === 'listo' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'entregado')}
                      className="w-full py-2 bg-green-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
                    >
                      Entregar pedido
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}