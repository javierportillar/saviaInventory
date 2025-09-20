import React from 'react';
import { Order } from '../types';
import { ChefHat, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { COLORS } from '../data/menu';
import { formatDateTime } from '../utils/format';

interface CocinaProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['estado']) => void;
}

export function Cocina({ orders, onUpdateOrderStatus }: CocinaProps) {
  const activeOrders = orders.filter(order => 
    order.estado === 'pendiente' || order.estado === 'preparando'
  ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const readyOrders = orders.filter(order => order.estado === 'listo')
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const getOrderAge = (timestamp: Date): string => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000);
    if (minutes < 1) return 'Recién llegado';
    if (minutes === 1) return '1 minuto';
    return `${minutes} minutos`;
  };

  const getOrderUrgency = (timestamp: Date): 'normal' | 'warning' | 'urgent' => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000);
    if (minutes > 15) return 'urgent';
    if (minutes > 10) return 'warning';
    return 'normal';
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: COLORS.dark }}>
          Módulo de Cocina
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Vista de preparación y seguimiento de pedidos
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Pedidos pendientes */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <ChefHat size={24} style={{ color: COLORS.dark }} />
              <h3 className="text-lg sm:text-xl font-bold" style={{ color: COLORS.dark }}>
                En preparación ({activeOrders.length})
              </h3>
            </div>

            {activeOrders.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <ChefHat size={48} className="mx-auto text-gray-400 mb-4" />
                <h4 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">No hay pedidos pendientes</h4>
                <p className="text-sm sm:text-base text-gray-500">Los nuevos pedidos aparecerán aquí</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {activeOrders.map((order) => {
                  const urgency = getOrderUrgency(order.timestamp);
                  return (
                    <div
                      key={order.id}
                      className={`border rounded-xl p-3 sm:p-4 transition-all duration-200 ${
                        urgency === 'urgent' ? 'border-red-300 bg-red-50' :
                        urgency === 'warning' ? 'border-yellow-300 bg-yellow-50' :
                        'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-base sm:text-lg font-bold" style={{ color: COLORS.dark }}>
                            #{order.numero}
                          </h4>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock size={14} />
                            <span>{getOrderAge(order.timestamp)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {urgency === 'urgent' && <AlertCircle size={16} className="text-red-600" />}
                          {urgency === 'warning' && <Clock size={16} className="text-yellow-600" />}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.estado === 'preparando' 
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {order.estado}
                          </span>
                        </div>
                      </div>

                      {order.cliente && (
                        <p className="text-sm text-gray-600 mb-3">Cliente: {order.cliente}</p>
                      )}

                      <div className="space-y-2 mb-4">
                        {order.items.map((cartItem, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="font-medium">{cartItem.cantidad}x {cartItem.item.nombre}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        {order.estado === 'pendiente' && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'preparando')}
                            className="w-full py-2 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 text-sm"
                            style={{ backgroundColor: COLORS.dark }}
                          >
                            Iniciar preparación
                          </button>
                        )}
                        {order.estado === 'preparando' && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'listo')}
                            className="w-full py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 text-sm"
                            style={{ backgroundColor: COLORS.accent, color: COLORS.dark }}
                          >
                            Marcar como listo
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Pedidos listos */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={24} className="text-green-600" />
              <h3 className="text-lg sm:text-xl font-bold" style={{ color: COLORS.dark }}>
                Listos ({readyOrders.length})
              </h3>
            </div>

            {readyOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-6 sm:py-8 text-sm">No hay pedidos listos</p>
            ) : (
              <div className="space-y-3">
                {readyOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-green-800 text-sm sm:text-base">#{order.numero}</h4>
                      <span className="text-xs text-green-600">
                        {formatDateTime(order.timestamp)}
                      </span>
                    </div>
                    
                    {order.cliente && (
                      <p className="text-sm text-green-700 mb-2">{order.cliente}</p>
                    )}
                    
                    <div className="text-sm text-green-700">
                      {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
