import React, { useState } from 'react';
import { MenuItem } from '../types';
import { Package, AlertTriangle, Plus, Minus, Search, Edit3 } from 'lucide-react';
import { COLORS } from '../data/menu';
import { formatCOP } from '../utils/format';

interface InventarioProps {
  menuItems: MenuItem[];
  onUpdateStock: (itemId: string, newStock: number) => void;
}

export function Inventario({ menuItems, onUpdateStock }: InventarioProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [tempStock, setTempStock] = useState<number>(0);

  const categories = Array.from(new Set(menuItems.map(item => item.categoria)));
  
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = filteredItems.filter(item => item.stock < 10);
  const outOfStockItems = filteredItems.filter(item => item.stock === 0);

  const startEditing = (item: MenuItem) => {
    setEditingItem(item.id);
    setTempStock(item.stock);
  };

  const saveStock = () => {
    if (editingItem) {
      onUpdateStock(editingItem, tempStock);
      setEditingItem(null);
    }
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setTempStock(0);
  };

  const quickAdjustStock = (itemId: string, adjustment: number) => {
    const item = menuItems.find(i => i.id === itemId);
    if (item) {
      const newStock = Math.max(0, item.stock + adjustment);
      onUpdateStock(itemId, newStock);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2" style={{ color: COLORS.dark }}>
          Control de Inventario
        </h2>
        <p className="text-gray-600">
          Gestión de stock y alertas de productos
        </p>
      </div>

      {/* Alertas */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outOfStockItems.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={20} className="text-red-600" />
                <h3 className="font-semibold text-red-800">Sin stock ({outOfStockItems.length})</h3>
              </div>
              <div className="space-y-1">
                {outOfStockItems.slice(0, 3).map(item => (
                  <p key={item.id} className="text-sm text-red-700">{item.nombre}</p>
                ))}
                {outOfStockItems.length > 3 && (
                  <p className="text-sm text-red-600">y {outOfStockItems.length - 3} más...</p>
                )}
              </div>
            </div>
          )}

          {lowStockItems.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={20} className="text-yellow-600" />
                <h3 className="font-semibold text-yellow-800">Stock bajo ({lowStockItems.length})</h3>
              </div>
              <div className="space-y-1">
                {lowStockItems.slice(0, 3).map(item => (
                  <p key={item.id} className="text-sm text-yellow-700">{item.nombre} ({item.stock})</p>
                ))}
                {lowStockItems.length > 3 && (
                  <p className="text-sm text-yellow-600">y {lowStockItems.length - 3} más...</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
          style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
        >
          <option value="">Todas las categorías</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-xl p-6 shadow-sm border transition-all duration-200 hover:shadow-md ${
              item.stock === 0 ? 'border-red-200' : 
              item.stock < 10 ? 'border-yellow-200' : 
              'border-gray-100'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1" style={{ color: COLORS.dark }}>
                  {item.nombre}
                </h3>
                <p className="text-sm text-gray-600 mb-1">{item.categoria}</p>
                <p className="text-sm font-medium" style={{ color: COLORS.accent }}>
                  {formatCOP(item.precio)}
                </p>
              </div>
              
              <div className="text-right">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  item.stock === 0 ? 'bg-red-100 text-red-800' :
                  item.stock < 10 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  <Package size={12} />
                  {item.stock}
                </div>
              </div>
            </div>

            {item.descripcion && (
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.descripcion}</p>
            )}

            <div className="flex items-center justify-between">
              {editingItem === item.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="number"
                    value={tempStock}
                    onChange={(e) => setTempStock(parseInt(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                    min="0"
                  />
                  <button
                    onClick={saveStock}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => quickAdjustStock(item.id, -1)}
                      disabled={item.stock === 0}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
                    >
                      <Minus size={14} />
                    </button>
                    <button
                      onClick={() => quickAdjustStock(item.id, 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:opacity-90"
                      style={{ backgroundColor: COLORS.dark }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => startEditing(item)}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    <Edit3 size={14} />
                    Editar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}