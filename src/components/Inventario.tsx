import React, { useEffect, useMemo, useState } from 'react';
import { InventoryPriceHistoryRecord, MenuItem } from '../types';
import { Package, AlertTriangle, Plus, Minus, Search, Edit3, Trash, Filter, Clock3, MapPin } from 'lucide-react';
import { COLORS } from '../data/menu';
import { formatCOP, formatDateTime } from '../utils/format';
import { generateMenuItemCode } from '../utils/strings';
import dataService from '../lib/dataService';

interface InventarioProps {
  menuItems: MenuItem[];
  onUpdateMenuItem: (item: MenuItem) => void;
  onCreateMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (id: string) => void;
}

export function Inventario({ menuItems, onUpdateMenuItem, onCreateMenuItem, onDeleteMenuItem }: InventarioProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'inventariables' | 'no-inventariables'>('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showHistorySummary, setShowHistorySummary] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyRows, setHistoryRows] = useState<InventoryPriceHistoryRecord[]>([]);
  const [newItem, setNewItem] = useState<{
    nombre: string;
    precio: number | null;
    categoria: string;
    inventarioCategoria: 'Inventariables' | 'No inventariables';
    inventarioTipo: 'cantidad' | 'gramos';
    unidadMedida: 'g';
    stock: number | null;
    descripcion?: string;
  } | null>(null);

  const inventariableCategories = useMemo(
    () =>
      Array.from(
        new Set(
          menuItems
            .filter(item => item.inventarioCategoria === 'Inventariables')
            .map(item => item.categoria)
        )
      ),
    [menuItems]
  );

  const nonInventariableCategories = useMemo(
    () =>
      Array.from(
        new Set(
          menuItems
            .filter(item => item.inventarioCategoria !== 'Inventariables')
            .map(item => item.categoria)
        )
      ),
    [menuItems]
  );

  useEffect(() => {
    if (selectedCategory && !nonInventariableCategories.includes(selectedCategory)) {
      setSelectedCategory('');
    }
  }, [nonInventariableCategories, selectedCategory]);

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = !searchQuery || item.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.categoria === selectedCategory;
    const matchesInventory = inventoryFilter === 'all' || 
      (inventoryFilter === 'inventariables' && item.inventarioCategoria === 'Inventariables') ||
      (inventoryFilter === 'no-inventariables' && item.inventarioCategoria === 'No inventariables');
    return matchesSearch && matchesCategory && matchesInventory;
  });

  const inventariableItems = filteredItems.filter(
    (item) => item.inventarioCategoria === 'Inventariables'
  );
  const nonInventariableItems = filteredItems.filter(
    (item) => item.inventarioCategoria !== 'Inventariables'
  );

  const lowStockItems = filteredItems.filter((item) => (item.stock ?? 0) < 10);
  const outOfStockItems = filteredItems.filter((item) => (item.stock ?? 0) === 0);

  const groupedHistory = useMemo(() => {
    const byProduct = new Map<string, { productName: string; rows: InventoryPriceHistoryRecord[] }>();

    historyRows.forEach((row) => {
      const productName = row.menuItemNombre?.trim() || row.menuItemId;
      const key = `${row.menuItemId}::${productName}`;
      const current = byProduct.get(key);
      if (current) {
        current.rows.push(row);
      } else {
        byProduct.set(key, { productName, rows: [row] });
      }
    });

    return Array.from(byProduct.values())
      .map((product) => {
        const rows = [...product.rows].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const places = new Map<string, InventoryPriceHistoryRecord[]>();
        rows.forEach((row) => {
          const placeKey = row.lugarCompra?.trim() || 'Sin lugar';
          const current = places.get(placeKey);
          if (current) {
            current.push(row);
          } else {
            places.set(placeKey, [row]);
          }
        });

        const placeComparison = Array.from(places.entries()).map(([place, placeRows]) => {
          const sortedByDate = [...placeRows].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          const unitPrices = sortedByDate.map((row) => row.precioUnitario);
          const bestUnitPrice = Math.min(...unitPrices);
          const lastUnitPrice = sortedByDate[0]?.precioUnitario ?? bestUnitPrice;
          const avgUnitPrice = unitPrices.reduce((acc, value) => acc + value, 0) / unitPrices.length;
          const previousPrices = unitPrices.slice(1);
          const previousAvgUnitPrice = previousPrices.length > 0
            ? previousPrices.reduce((acc, value) => acc + value, 0) / previousPrices.length
            : avgUnitPrice;
          const lastPurchase = sortedByDate[0];
          const lastPurchaseTime = new Date(lastPurchase?.createdAt ?? 0).getTime();
          const previousGlobalPurchase = rows
            .filter((row) => new Date(row.createdAt).getTime() < lastPurchaseTime)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
          const previousGlobalUnitPrice = Number(previousGlobalPurchase?.precioUnitario ?? 0);
          // Variación en clave de ahorro: positivo (verde) = más barato, negativo (rojo) = más caro.
          const variationVsPreviousAvg = previousGlobalUnitPrice > 0
            ? ((previousGlobalUnitPrice - lastUnitPrice) / previousGlobalUnitPrice) * 100
            : 0;

          return {
            place,
            count: sortedByDate.length,
            bestUnitPrice,
            lastUnitPrice,
            avgUnitPrice,
            previousAvgUnitPrice,
            variationVsPreviousAvg,
            previousGlobalUnitPrice,
            lastDate: sortedByDate[0]?.createdAt,
            lastQuantity: Number(lastPurchase?.cantidad ?? 0),
            lastQuantityUnit: lastPurchase?.unidad || (lastPurchase?.unidadTipo === 'cantidad' ? 'unidad' : 'g'),
            lastPurchaseTotal: Number(lastPurchase?.precioTotal ?? 0),
          };
        });

        placeComparison.sort((a, b) => a.bestUnitPrice - b.bestUnitPrice);

        const globalBest = placeComparison.length > 0
          ? Math.min(...placeComparison.map((entry) => entry.bestUnitPrice))
          : 0;

        return {
          productName: product.productName,
          rows,
          placeComparison,
          globalBest,
          unitLabel: rows[0]?.unidadTipo === 'cantidad' ? 'unidad' : 'g',
        };
      })
      .sort((a, b) => a.productName.localeCompare(b.productName, 'es', { sensitivity: 'base' }));
  }, [historyRows]);

  const quickAdjustStock = (itemId: string, adjustment: number) => {
    const item = menuItems.find((i) => i.id === itemId);
    if (item) {
      const newStock = Math.max(0, (item.stock ?? 0) + adjustment);
      onUpdateMenuItem({ ...item, stock: newStock });
    }
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      const normalizedEditingItem: MenuItem = {
        ...editingItem,
        unidadMedida:
          editingItem.inventarioCategoria === 'Inventariables' && editingItem.inventarioTipo === 'gramos'
            ? 'g'
            : undefined,
      };
      onUpdateMenuItem(normalizedEditingItem);
      setEditingItem(null);
      return;
    }
  };

  const getItemTypeLabel = (item: Pick<MenuItem, 'inventarioCategoria' | 'inventarioTipo'>) => {
    if (item.inventarioCategoria !== 'Inventariables') {
      return 'No inventariable';
    }
    return item.inventarioTipo === 'cantidad' ? 'Unidad' : 'Peso (g)';
  };

  const getStockUnitLabel = (item: Pick<MenuItem, 'inventarioCategoria' | 'inventarioTipo'>) => {
    if (item.inventarioCategoria !== 'Inventariables') {
      return '';
    }
    return item.inventarioTipo === 'cantidad' ? 'unidades' : 'g';
  };

  const handleSaveNew = () => {
    if (newItem) {
      const codigo = generateMenuItemCode(newItem.nombre, newItem.categoria);
      onCreateMenuItem({
        id: crypto.randomUUID(),
        codigo,
        nombre: newItem.nombre,
        precio: newItem.precio ?? 0,
        categoria: newItem.categoria,
        stock: newItem.stock ?? 0,
        descripcion: newItem.descripcion,
        inventarioCategoria: newItem.inventarioCategoria,
        inventarioTipo: newItem.inventarioCategoria === 'Inventariables' ? newItem.inventarioTipo : undefined,
        unidadMedida:
          newItem.inventarioCategoria === 'Inventariables' && newItem.inventarioTipo === 'gramos'
            ? 'g'
            : undefined,
      });
      setNewItem(null);
    }
  };

  const openHistorySummary = async () => {
    setShowHistorySummary(true);
    setHistoryRows([]);
    setHistoryLoading(true);
    try {
      const rows = await dataService.fetchInventoryPriceHistorySummary(300);
      setHistoryRows(rows);
    } finally {
      setHistoryLoading(false);
    }
  };

  const closeHistorySummary = () => {
    setShowHistorySummary(false);
    setHistoryRows([]);
    setHistoryLoading(false);
  };

  const renderItemCard = (item: MenuItem) => (
    <div
      key={item.id}
      className={`ui-card ui-card-pad transition-all duration-200 hover:shadow-md border ${
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
              list={
                editingItem.inventarioCategoria === 'Inventariables'
                  ? 'inventariable-category-options'
                  : 'non-inventariable-category-options'
              }
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
                      unidadMedida: e.target.value === 'gramos' ? 'g' : undefined,
                    })
                  }
                >
                  <option value="cantidad">Cantidad</option>
                  <option value="gramos">Gramos</option>
                </select>
                {editingItem.inventarioTipo === 'gramos' && (
                  <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50 text-sm text-gray-600">
                    Unidad fija: gramos (g)
                  </div>
                )}
                <input
                  type="number"
                  min={0}
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder={editingItem.inventarioTipo === 'gramos' ? 'Peso en gramos (ej. 500)' : 'Cantidad (ej. 10)'}
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
              <p className="text-xs text-gray-500 mb-1">
                Tipo: {getItemTypeLabel(item)}
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
                  {getStockUnitLabel(item) ? ` ${getStockUnitLabel(item)}` : ''}
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
                onClick={() => onDeleteMenuItem(item.id)}
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
    <section className="space-y-4 sm:space-y-6">
      <datalist id="inventariable-category-options">
        {inventariableCategories.map(category => (
          <option key={`inventariable-${category}`} value={category} />
        ))}
      </datalist>
      <datalist id="non-inventariable-category-options">
        {nonInventariableCategories.map(category => (
          <option key={`non-inventariable-${category}`} value={category} />
        ))}
      </datalist>
      <div className="text-center px-2 sm:px-0">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2" style={{ color: COLORS.dark }}>
          Control de Inventario
        </h2>
        <p className="text-sm lg:text-base text-gray-600">Gestión de stock y alertas de productos</p>
      </div>

      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outOfStockItems.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg lg:rounded-xl p-3 lg:p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={20} className="text-red-600" />
                <h3 className="font-semibold text-red-800 text-sm lg:text-base">Sin stock ({outOfStockItems.length})</h3>
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
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg lg:rounded-xl p-3 lg:p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={20} className="text-yellow-600" />
                <h3 className="font-semibold text-yellow-800 text-sm lg:text-base">Stock bajo ({lowStockItems.length})</h3>
              </div>
              <div className="space-y-1">
                {lowStockItems.slice(0,3).map(item => (
                  <p key={item.id} className="text-sm text-yellow-700">
                    {item.nombre} ({item.stock}
                    {getStockUnitLabel(item) ? ` ${getStockUnitLabel(item)}` : ''})
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
      <div className="ui-card ui-card-pad space-y-4">
        <div className="relative">
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

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-600">
            <Filter size={16} className="text-gray-500" />
            <span>Tipo:</span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
            <select
              value={inventoryFilter}
              onChange={(e) => setInventoryFilter(e.target.value as 'all' | 'inventariables' | 'no-inventariables')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm w-full sm:w-auto"
              style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
            >
              <option value="all">Todos</option>
              <option value="inventariables">Inventariables</option>
              <option value="no-inventariables">No inventariables</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm w-full sm:w-auto"
              style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
            >
              <option value="">Todas las categorías</option>
              {nonInventariableCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="sm:ml-auto w-full sm:w-auto">
            <div className="flex w-full sm:w-auto gap-2">
              <button
                onClick={openHistorySummary}
                className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Clock3 size={16} /> Historial general
              </button>
              <button
                onClick={() =>
                  setNewItem({
                    nombre: '',
                    precio: null,
                    categoria: '',
                    inventarioCategoria: 'No inventariables',
                    inventarioTipo: 'cantidad',
                    unidadMedida: 'g',
                    stock: null,
                    descripcion: '',
                  })
                }
                className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm"
                style={{ backgroundColor: COLORS.accent }}
              >
                <Plus size={16} /> Agregar producto
              </button>
            </div>
          </div>
        </div>
      </div>

      {newItem && (
        <div className="ui-card ui-card-pad">
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
              list={
                newItem.inventarioCategoria === 'Inventariables'
                  ? 'inventariable-category-options'
                  : 'non-inventariable-category-options'
              }
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
                      unidadMedida: 'g',
                    })
                  }
                >
                  <option value="cantidad">Cantidad</option>
                  <option value="gramos">Gramos</option>
                </select>
                {newItem.inventarioTipo === 'gramos' && (
                  <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50 text-sm text-gray-600">
                    Unidad fija: gramos (g)
                  </div>
                )}
                <input
                  type="number"
                  min={0}
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder={newItem.inventarioTipo === 'gramos' ? 'Peso en gramos (ej. 500)' : 'Cantidad (ej. 10)'}
                  value={newItem.stock ?? ''}
                  onChange={e => {
                    const value = parseInt(e.target.value, 10);
                    setNewItem({ ...newItem, stock: isNaN(value) ? null : value });
                  }}
                />
              </>
            )}
            <textarea
              className="border border-gray-300 rounded px-3 py-2 lg:col-span-2" placeholder="Descripción (opcional)"
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

      {showHistorySummary && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl border border-gray-200 max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
                  Historial general de compras
                </h3>
                <p className="text-sm text-gray-600">
                  Registros históricos de inventariables
                </p>
              </div>
              <button
                onClick={closeHistorySummary}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>

            <div className="p-4 overflow-auto max-h-[calc(85vh-72px)]">
              {historyLoading ? (
                <p className="text-sm text-gray-500">Cargando historial...</p>
              ) : historyRows.length === 0 ? (
                <p className="text-sm text-gray-500">No hay compras registradas todavía.</p>
              ) : (
                <div className="space-y-4">
                  {groupedHistory.map((group) => (
                    <div key={group.productName} className="rounded-xl border border-slate-200 overflow-hidden">
                      <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <h4 className="text-base font-semibold" style={{ color: COLORS.dark }}>
                            {group.productName}
                          </h4>
                          <div className="text-xs text-slate-500">
                            Mejor referencia: <span className="font-semibold text-emerald-700">{formatCOP(group.globalBest)} / {group.unitLabel}</span>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-3 overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="text-left text-slate-500 border-b border-slate-200">
                              <th className="py-2 pr-3">Lugar</th>
                              <th className="py-2 pr-3">Mejor precio</th>
                              <th className="py-2 pr-3">Último precio</th>
                              <th className="py-2 pr-3">Promedio</th>
                              <th className="py-2 pr-3">Compra reciente</th>
                              <th className="py-2 pr-3">Variación</th>
                              <th className="py-2">Fecha compra</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.placeComparison.map((place) => {
                              const delta = place.variationVsPreviousAvg;
                              const deltaLabel = `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}%`;
                              const deltaClass = delta < 0
                                ? 'text-rose-700'
                                : delta > 0
                                  ? 'text-emerald-700'
                                  : 'text-slate-500';
                              const isBest = Math.abs(place.bestUnitPrice - group.globalBest) < 0.0001;

                              return (
                                <tr key={`${group.productName}-${place.place}`} className="border-b border-slate-100 last:border-b-0">
                                  <td className="py-2 pr-3">
                                    <span className="inline-flex items-center gap-1">
                                      <MapPin size={13} className="text-slate-400" />
                                      <span>{place.place}</span>
                                      {isBest && (
                                        <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                          Mejor
                                        </span>
                                      )}
                                    </span>
                                  </td>
                                  <td className="py-2 pr-3 font-medium">{formatCOP(place.bestUnitPrice)} / {group.unitLabel}</td>
                                  <td className="py-2 pr-3">{formatCOP(place.lastUnitPrice)} / {group.unitLabel}</td>
                                  <td className="py-2 pr-3">{formatCOP(place.avgUnitPrice)} / {group.unitLabel}</td>
                                  <td className="py-2 pr-3 whitespace-nowrap text-slate-700">
                                    {place.lastQuantity} {place.lastQuantityUnit} por {formatCOP(place.lastPurchaseTotal)}
                                  </td>
                                  <td className={`py-2 pr-3 font-medium ${deltaClass}`}>{deltaLabel}</td>
                                  <td className="py-2 text-slate-600 whitespace-nowrap">
                                    {place.lastDate ? formatDateTime(new Date(place.lastDate)) : '-'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lista de productos */}
      <div className="space-y-8">
        {inventariableItems.length > 0 && (inventoryFilter === 'all' || inventoryFilter === 'inventariables') && (
          <div>
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.dark }}>
              Inventariables ({inventariableItems.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inventariableItems.map(renderItemCard)}
            </div>
          </div>
        )}
        {nonInventariableItems.length > 0 && (inventoryFilter === 'all' || inventoryFilter === 'no-inventariables') && (
          <div>
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.dark }}>
              No inventariables ({nonInventariableItems.length})
            </h3>
            
            {/* Agrupar por categoría */}
            {Array.from(new Set(nonInventariableItems.map(item => item.categoria))).map(categoria => {
              const itemsInCategory = nonInventariableItems.filter(item => item.categoria === categoria);
              return (
                <div key={categoria} className="mb-8">
                  <h4 className="text-lg font-medium mb-3 text-gray-700 border-b border-gray-200 pb-2">
                    {categoria} ({itemsInCategory.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {itemsInCategory.map(renderItemCard)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-500">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
