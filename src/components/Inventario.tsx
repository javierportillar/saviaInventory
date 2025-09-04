import React, { useState } from 'react';
import { MenuItem } from '../types';
import { Package, AlertTriangle, Plus, Minus, Search, Edit3, Trash } from 'lucide-react';
import { COLORS } from '../data/menu';
import { formatCOP } from '../utils/format';

interface InventarioProps {
  menuItems: MenuItem[];
  onUpdateStock: (itemId: string, newStock: number) => void;
  onAddItem: (item: MenuItem) => void;
  onUpdateItem: (item: MenuItem) => void;
  onDeleteItem: (id: string) => void;
}

export function Inventario({ menuItems, onUpdateStock, onAddItem, onUpdateItem, onDeleteItem }: InventarioProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<{
    nombre: string;
    precio: number | null;
    categoria: string;
    inventarioCategoria: 'Inventariables' | 'No inventariables';
    inventarioTipo: 'cantidad' | 'gramos';
    unidadMedida: 'kg' | 'g' | 'mg';
    stock: number | null;
    descripcion?: string;
  } | null>(null);

  const categories = Array.from(new Set(menuItems.map(item => item.categoria)));

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = !searchQuery || item.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const inventariableItems = filteredItems.filter(
    (item) => item.inventarioCategoria === 'Inventariables'
  );
  const nonInventariableItems = filteredItems.filter(
    (item) => item.inventarioCategoria !== 'Inventariables'
  );

  const lowStockItems = filteredItems.filter((item) => (item.stock ?? 0) < 10);
  const outOfStockItems = filteredItems.filter((item) => (item.stock ?? 0) === 0);

  const quickAdjustStock = (itemId: string, adjustment: number) => {
    const item = menuItems.find((i) => i.id === itemId);
    if (item) {
      const newStock = Math.max(0, (item.stock ?? 0) + adjustment);
      onUpdateStock(itemId, newStock);
    }
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      onUpdateItem(editingItem);
      setEditingItem(null);
    }
  };

  const handleSaveNew = () => {
    if (newItem) {
      onAddItem({
        id: crypto.randomUUID(),
        nombre: newItem.nombre,
        precio: newItem.precio ?? 0,
        categoria: newItem.categoria,
        stock: newItem.stock ?? 0,
        descripcion: newItem.descripcion,
        inventarioCategoria: newItem.inventarioCategoria,
        inventarioTipo: newItem.inventarioTipo,
        unidadMedida: newItem.unidadMedida,
      });
      setNewItem(null);
    }
  };

  const renderItemCard = (item: MenuItem) => (
    <div
      key={item.id}
      className={`bg-white rounded-xl p-6 shadow-sm border transition-all duration-200 hover:shadow-md ${
        item.stock === 0 ? 'border-red-200' :
        item.stock < 10 ? 'border-yellow-200' :
        'border-gray-100'
      }`}
    >
      {editingItem?.id === item.id ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border border-gray-300 rounded px-3 py-2" placeholder="Nombre"
              value={editingItem.nombre}
              onChange={e => setEditingItem({ ...editingItem, nombre: e.target.value })}
            />
            <input
              type="number"
              min={0}
              className="border border-gray-300 rounded px-3 py-2"
              placeholder="Precio (ej. 8500)"
              value={editingItem.precio === 0 ? '' : editingItem.precio}
              onChange={e => {
                const value = parseInt(e.target.value, 10);
                setEditingItem({ ...editingItem, precio: isNaN(value) ? 0 : value });
              }}
            />
            <input
              list="category-options"
              className="border border-gray-300 rounded px-3 py-2"
              placeholder="Categoría (selecciona o crea)"
              value={editingItem.categoria}
              onChange={e => setEditingItem({ ...editingItem, categoria: e.target.value })}
            />
            <select
              className="border border-gray-300 rounded px-3 py-2"
              value={editingItem.inventarioCategoria}
              onChange={e =>
                setEditingItem({
                  ...editingItem,
                  inventarioCategoria: e.target.value as 'Inventariables' | 'No inventariables',
                })
              }
            >
              <option value="Inventariables">Inventariables</option>
              <option value="No inventariables">No inventariables</option>
            </select>
            {editingItem.inventarioCategoria === 'Inventariables' && (
              <>
                <select
                  className="border border-gray-300 rounded px-3 py-2"
                  value={editingItem.inventarioTipo ?? 'cantidad'}
                  onChange={e =>
                    setEditingItem({
                      ...editingItem,
                      inventarioTipo: e.target.value as 'cantidad' | 'gramos',
                    })
                  }
                >
                  <option value="cantidad">Cantidad</option>
                  <option value="gramos">Gramos</option>
                </select>
                {editingItem.inventarioTipo === 'gramos' && (
                  <select
                    className="border border-gray-300 rounded px-3 py-2"
                    value={editingItem.unidadMedida ?? 'kg'}
                    onChange={e =>
                      setEditingItem({
                        ...editingItem,
                        unidadMedida: e.target.value as 'kg' | 'g' | 'mg',
                      })
                    }
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="mg">mg</option>
                  </select>
                )}
                <input
                  type="number"
                  min={0}
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder={editingItem.inventarioTipo === 'gramos' ? 'Peso (ej. 10)' : 'Cantidad (ej. 10)'}
                  value={editingItem.stock === 0 ? '' : editingItem.stock}
                  onChange={e => {
                    const value = parseInt(e.target.value, 10);
                    setEditingItem({ ...editingItem, stock: isNaN(value) ? 0 : value });
                  }}
                />
              </>
            )}
            <textarea
              className="border border-gray-300 rounded px-3 py-2 md:col-span-2" placeholder="Descripción (opcional)"
              value={editingItem.descripcion || ''}
              onChange={e => setEditingItem({ ...editingItem, descripcion: e.target.value })}
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleSaveEdit} className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">Guardar</button>
            <button onClick={() => setEditingItem(null)} className="px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500">Cancelar</button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1" style={{ color: COLORS.dark }}>
                {item.nombre}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                {item.categoria} • {item.inventarioCategoria ?? 'No inventariables'}
              </p>
              <p className="text-sm font-medium" style={{ color: COLORS.accent }}>
                {formatCOP(item.precio)}
              </p>
            </div>
            <div className="text-right">
              <div
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  item.stock === 0 ? 'bg-red-100 text-red-800' :
                  item.stock < 10 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}
                title="Stock disponible"
              >
                <Package size={12} />
                <span>
                  Stock: {item.stock ?? 0}
                  {item.inventarioTipo === 'gramos' && item.unidadMedida ? ` ${item.unidadMedida}` : ''}
                </span>
              </div>
            </div>
          </div>

          {item.descripcion && (
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.descripcion}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => quickAdjustStock(item.id, -1)}
                disabled={(item.stock ?? 0) === 0}
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditingItem(item)}
                className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                <Edit3 size={14} /> Editar
              </button>
              <button
                onClick={() => onDeleteItem(item.id)}
                className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-800"
              >
                <Trash size={14} /> Eliminar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <datalist id="category-options">
        {categories.map(category => (
          <option key={category} value={category} />
        ))}
      </datalist>
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2" style={{ color: COLORS.dark }}>
          Control de Inventario
        </h2>
        <p className="text-gray-600">Gestión de stock y alertas de productos</p>
      </div>

      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outOfStockItems.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={20} className="text-red-600" />
                <h3 className="font-semibold text-red-800">Sin stock ({outOfStockItems.length})</h3>
              </div>
              <div className="space-y-1">
                {outOfStockItems.slice(0,3).map(item => (
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
                {lowStockItems.slice(0,3).map(item => (
                  <p key={item.id} className="text-sm text-yellow-700">
                    {item.nombre} ({item.stock}
                    {item.inventarioTipo === 'gramos' && item.unidadMedida ? ` ${item.unidadMedida}` : ''})
                  </p>
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

      <div className="flex justify-end">
        <button
          onClick={() =>
            setNewItem({
              nombre: '',
              precio: null,
              categoria: '',
              inventarioCategoria: 'No inventariables',
              inventarioTipo: 'cantidad',
              unidadMedida: 'kg',
              stock: null,
              descripcion: '',
            })
          }
          className="flex items-center gap-1 px-4 py-2 rounded-lg text-white hover:opacity-90"
          style={{ backgroundColor: COLORS.accent }}
        >
          <Plus size={16} /> Agregar producto
        </button>
      </div>

      {newItem && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border border-gray-300 rounded px-3 py-2" placeholder="Nombre"
              value={newItem.nombre}
              onChange={e => setNewItem({ ...newItem, nombre: e.target.value })}
            />
            <input
              type="number"
              min={0}
              className="border border-gray-300 rounded px-3 py-2"
              placeholder="Precio (ej. 8500)"
              value={newItem.precio ?? ''}
              onChange={e => {
                const value = parseInt(e.target.value, 10);
                setNewItem({ ...newItem, precio: isNaN(value) ? null : value });
              }}
            />
            <input
              list="category-options"
              className="border border-gray-300 rounded px-3 py-2"
              placeholder="Categoría (selecciona o crea)"
              value={newItem.categoria}
              onChange={e => setNewItem({ ...newItem, categoria: e.target.value })}
            />
            <select
              className="border border-gray-300 rounded px-3 py-2"
              value={newItem.inventarioCategoria}
              onChange={e =>
                setNewItem({
                  ...newItem,
                  inventarioCategoria: e.target.value as 'Inventariables' | 'No inventariables',
                })
              }
            >
              <option value="Inventariables">Inventariables</option>
              <option value="No inventariables">No inventariables</option>
            </select>
            {newItem.inventarioCategoria === 'Inventariables' && (
              <>
                <select
                  className="border border-gray-300 rounded px-3 py-2"
                  value={newItem.inventarioTipo}
                  onChange={e =>
                    setNewItem({
                      ...newItem,
                      inventarioTipo: e.target.value as 'cantidad' | 'gramos',
                    })
                  }
                >
                  <option value="cantidad">Cantidad</option>
                  <option value="gramos">Gramos</option>
                </select>
                {newItem.inventarioTipo === 'gramos' && (
                  <select
                    className="border border-gray-300 rounded px-3 py-2"
                    value={newItem.unidadMedida}
                    onChange={e =>
                      setNewItem({
                        ...newItem,
                        unidadMedida: e.target.value as 'kg' | 'g' | 'mg',
                      })
                    }
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="mg">mg</option>
                  </select>
                )}
                <input
                  type="number"
                  min={0}
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder={newItem.inventarioTipo === 'gramos' ? 'Peso (ej. 10)' : 'Cantidad (ej. 10)'}
                  value={newItem.stock ?? ''}
                  onChange={e => {
                    const value = parseInt(e.target.value, 10);
                    setNewItem({ ...newItem, stock: isNaN(value) ? null : value });
                  }}
                />
              </>
            )}
            <textarea
              className="border border-gray-300 rounded px-3 py-2 md:col-span-2" placeholder="Descripción (opcional)"
              value={newItem.descripcion || ''}
              onChange={e => setNewItem({ ...newItem, descripcion: e.target.value })}
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleSaveNew} className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">Guardar</button>
            <button onClick={() => setNewItem(null)} className="px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500">Cancelar</button>
          </div>
        </div>
      )}

      {/* Lista de productos */}
      <div className="space-y-8">
        {inventariableItems.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.dark }}>
              Inventariables
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {inventariableItems.map(renderItemCard)}
            </div>
          </div>
        )}
        {nonInventariableItems.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.dark }}>
              No inventariables
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {nonInventariableItems.map(renderItemCard)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
