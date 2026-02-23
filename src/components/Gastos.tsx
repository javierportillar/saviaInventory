import React, { useEffect, useMemo, useState } from 'react';
import { FocusDateRequest, Gasto, GastoInventarioItem, MenuItem, PaymentMethod } from '../types';
import { Receipt, Plus, Edit3, Trash2, Calendar, TrendingDown, Filter, ArrowDown, ArrowUp, X } from 'lucide-react';
import { COLORS } from '../data/menu';
import {
  formatCOP,
  formatDateTime,
  formatDateInputValue,
  getTodayDateInputValue,
  parseDateInputValue,
} from '../utils/format';
import dataService from '../lib/dataService';
import { EXPENSE_PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from '../utils/payments';

interface GastosProps {
  focusRequest?: FocusDateRequest | null;
  onInventoryChanged?: () => Promise<void> | void;
}

type TipoRegistro = 'operativo' | 'inventariable';

type GastoForm = {
  descripcion: string;
  monto: number;
  categoria: string;
  fecha: string;
  metodoPago: PaymentMethod;
  tipoRegistro: TipoRegistro;
  lugarCompra: string;
};

type DraftInventoryItem = {
  menuItemId: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  inventarioTipo?: 'cantidad' | 'peso';
  unidadInventario?: string;
  costoUnitarioNormalizado: number;
  requiereLugarCompra: boolean;
  lugarCompra?: string;
};

type InventoryPriceStat = {
  lastTotalPrice: number;
  lastUnitPrice: number;
  bestUnitPrice: number;
  lastPlace?: string;
  bestPlace?: string;
};

const DEFAULT_FORM: GastoForm = {
  descripcion: '',
  monto: 0,
  categoria: '',
  fecha: getTodayDateInputValue(),
  metodoPago: 'efectivo',
  tipoRegistro: 'operativo',
  lugarCompra: '',
};

const getInventoryTypeLabel = (item?: MenuItem): 'cantidad' | 'peso' | undefined => {
  if (!item) {
    return undefined;
  }
  if (item.inventarioTipo === 'cantidad') {
    return 'cantidad';
  }
  return 'peso';
};

const getQuantityStep = (
  inventarioTipo?: 'cantidad' | 'peso'
): string => {
  return inventarioTipo === 'cantidad' ? '1' : '1';
};

const normalizeTypedQuantity = (
  value: number,
  inventarioTipo?: 'cantidad' | 'peso'
): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.round(value));
};

const getQuantityUnitLabel = (item: { inventarioTipo?: 'cantidad' | 'peso'; unidadInventario?: string }) => {
  if (item.inventarioTipo === 'cantidad') {
    return 'unidades';
  }
  return 'g';
};

const getDraftItemSubtotal = (item: Pick<DraftInventoryItem, 'cantidad' | 'precioUnitario' | 'inventarioTipo'>): number => {
  if (item.inventarioTipo === 'peso') {
    return item.precioUnitario;
  }
  return item.cantidad * item.precioUnitario;
};

const getNormalizedDraftUnitCost = (item: Pick<DraftInventoryItem, 'cantidad' | 'precioUnitario' | 'inventarioTipo'>): number => {
  if (item.inventarioTipo === 'peso') {
    const qty = Math.max(0, Number(item.cantidad ?? 0));
    const total = Math.max(0, Number(item.precioUnitario ?? 0));
    if (qty <= 0) {
      return 0;
    }
    return total / qty;
  }
  return Math.max(0, Number(item.precioUnitario ?? 0));
};

const getGastoInventarioItemSubtotal = (item: GastoInventarioItem): number => {
  const price = Math.max(0, Number(item.precioUnitario ?? 0));
  if (item.inventarioTipo === 'peso') {
    return price;
  }
  return Math.max(0, Number(item.cantidad ?? 0)) * price;
};

const formatGastoInventarioItemDetail = (item: GastoInventarioItem): string => {
  const quantity = Math.max(0, Number(item.cantidad ?? 0));
  const unit = item.inventarioTipo === 'cantidad' ? 'unid' : (item.unidadInventario || 'g');
  const subtotal = getGastoInventarioItemSubtotal(item);
  const price = Math.max(0, Number(item.precioUnitario ?? 0));

  if (item.inventarioTipo === 'peso') {
    return `${item.nombre}: ${quantity} ${unit} · ${formatCOP(subtotal)}`;
  }

  return `${item.nombre}: ${quantity} ${unit} x ${formatCOP(price)} = ${formatCOP(subtotal)}`;
};

export function Gastos({ focusRequest, onInventoryChanged }: GastosProps) {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [inventariables, setInventariables] = useState<MenuItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'diario' | 'semanal' | 'mensual'>('diario');
  const [selectedDate, setSelectedDate] = useState(getTodayDateInputValue());
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [formData, setFormData] = useState<GastoForm>(DEFAULT_FORM);

  const [inventorySearch, setInventorySearch] = useState('');
  const [pendingMenuItemId, setPendingMenuItemId] = useState('');
  const [pendingCantidad, setPendingCantidad] = useState(1);
  const [pendingPrecio, setPendingPrecio] = useState<number | ''>('');
  const [selectedInventoryItems, setSelectedInventoryItems] = useState<DraftInventoryItem[]>([]);
  const [inventoryPriceStats, setInventoryPriceStats] = useState<Record<string, InventoryPriceStat>>({});

  const paymentMethods: PaymentMethod[] = EXPENSE_PAYMENT_METHODS;
  const paymentLabels: Record<PaymentMethod, string> = PAYMENT_METHOD_LABELS;

  const categoriasOperativas = [
    'Productos Limpieza',
    'Carnes',
    'Frutas/Verduras',
    'Lacteos',
    'Servicios públicos',
    'Arriendo',
    'Salarios',
    'Papelería',
    'Marketing',
    'Transporte',
    'Otros',
  ];

  const pendingItem = useMemo(
    () => inventariables.find((item) => item.id === pendingMenuItemId),
    [inventariables, pendingMenuItemId]
  );

  const inventorySuggestions = useMemo(() => {
    const query = inventorySearch.trim().toLowerCase();
    if (!query) {
      return inventariables.slice(0, 10);
    }
    return inventariables
      .filter((item) => item.nombre.toLowerCase().includes(query))
      .slice(0, 10);
  }, [inventariables, inventorySearch]);

  const inventarioTotal = useMemo(
    () => selectedInventoryItems.reduce((acc, item) => acc + getDraftItemSubtotal(item), 0),
    [selectedInventoryItems]
  );

  const fetchInventario = async () => {
    const [items, stats] = await Promise.all([
      dataService.fetchMenuItems(),
      dataService.fetchInventoryPriceStats(),
    ]);
    const allInventariables = items
      .filter((item) => item.inventarioCategoria === 'Inventariables')
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));
    setInventariables(allInventariables);
    setInventoryPriceStats(stats);
  };

  const fetchGastos = async () => {
    const data = await dataService.fetchGastos();
    const normalized = data.map((gasto) => ({
      ...gasto,
      fecha: parseDateInputValue(gasto.fecha),
      created_at: gasto.created_at
        ? gasto.created_at instanceof Date
          ? new Date(gasto.created_at.getTime())
          : new Date(gasto.created_at)
        : undefined,
      metodoPago: gasto.metodoPago ?? 'efectivo',
      esInventariable: Boolean(gasto.esInventariable),
      cantidadInventario:
        typeof gasto.cantidadInventario === 'number' ? gasto.cantidadInventario : Number(gasto.cantidadInventario ?? 0),
    }));
    setGastos(normalized);
  };

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchGastos(), fetchInventario()]);
    };
    load();
  }, []);

  useEffect(() => {
    if (!focusRequest) {
      return;
    }

    const { dateKey } = focusRequest;
    if (!dateKey) {
      return;
    }

    setViewMode('diario');
    setSelectedDate(dateKey);
  }, [focusRequest]);

  const resetForm = () => {
    setFormData(DEFAULT_FORM);
    setInventorySearch('');
    setPendingMenuItemId('');
    setPendingCantidad(1);
    setPendingPrecio('');
    setSelectedInventoryItems([]);
    setEditingId(null);
    setShowForm(false);
  };

  const refreshAfterInventoryChange = async () => {
    if (onInventoryChanged) {
      await onInventoryChanged();
    }
    await fetchInventario();
  };

  const handleSelectPendingItem = (item: MenuItem) => {
    setPendingMenuItemId(item.id);
    setInventorySearch(item.nombre);
    const latestReference = inventoryPriceStats[item.id]?.lastTotalPrice;
    setPendingPrecio(typeof latestReference === 'number' && latestReference > 0
      ? latestReference
      : item.precio > 0
        ? item.precio
        : '');
  };

  const evaluateDraftPriceFlags = (item: DraftInventoryItem): DraftInventoryItem => {
    const normalizedUnitCost = getNormalizedDraftUnitCost(item);
    const stats = inventoryPriceStats[item.menuItemId];
    const bestKnown = stats?.bestUnitPrice;
    const requiresPlace = Number.isFinite(bestKnown) && bestKnown > 0 && normalizedUnitCost > 0 && normalizedUnitCost < bestKnown;

    return {
      ...item,
      costoUnitarioNormalizado: normalizedUnitCost,
      requiereLugarCompra: requiresPlace,
    };
  };

  const handleAddInventoryItem = () => {
    const item = inventariables.find((entry) => entry.id === pendingMenuItemId)
      ?? inventariables.find((entry) => entry.nombre.toLowerCase() === inventorySearch.trim().toLowerCase());

    if (!item) {
      alert('Selecciona un inventariable válido de la lista.');
      return;
    }

    const typedKind = getInventoryTypeLabel(item);
    const cantidad = normalizeTypedQuantity(Number(pendingCantidad || 0), typedKind);
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      alert('La cantidad debe ser mayor a 0.');
      return;
    }

    const precioBase = item.precio > 0 ? item.precio : 0;
    const precioCapturado = Number(pendingPrecio === '' ? precioBase : pendingPrecio);
    const precioUnitario = Number.isFinite(precioCapturado) && precioCapturado >= 0 ? precioCapturado : precioBase;
    const draftBase: DraftInventoryItem = {
      menuItemId: item.id,
      nombre: item.nombre,
      cantidad,
      precioUnitario,
      inventarioTipo: getInventoryTypeLabel(item),
      unidadInventario: item.inventarioTipo === 'cantidad' ? undefined : 'g',
      costoUnitarioNormalizado: 0,
      requiereLugarCompra: false,
      lugarCompra: undefined,
    };
    const nextItem = evaluateDraftPriceFlags(draftBase);

    setSelectedInventoryItems((prev) => {
      const index = prev.findIndex((entry) => entry.menuItemId === item.id);

      if (index >= 0) {
        const copy = [...prev];
        copy[index] = evaluateDraftPriceFlags({
          ...copy[index],
          cantidad: copy[index].cantidad + cantidad,
          precioUnitario,
          inventarioTipo: nextItem.inventarioTipo,
          unidadInventario: nextItem.unidadInventario,
        });
        return copy;
      }

      return [...prev, nextItem];
    });

    setInventorySearch('');
    setPendingMenuItemId('');
    setPendingCantidad(1);
    setPendingPrecio('');
  };

  const updateDraftItem = (menuItemId: string, patch: Partial<DraftInventoryItem>) => {
    setSelectedInventoryItems((prev) =>
      prev.map((item) => {
        if (item.menuItemId !== menuItemId) {
          return item;
        }
        const maybeCantidad = patch.cantidad;
        if (typeof maybeCantidad === 'number') {
          return evaluateDraftPriceFlags({
            ...item,
            ...patch,
            cantidad: normalizeTypedQuantity(maybeCantidad, item.inventarioTipo),
          });
        }
        return evaluateDraftPriceFlags({ ...item, ...patch });
      })
    );
  };

  const removeDraftItem = (menuItemId: string) => {
    setSelectedInventoryItems((prev) => prev.filter((item) => item.menuItemId !== menuItemId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fecha = parseDateInputValue(formData.fecha);
      const isInventariable = formData.tipoRegistro === 'inventariable';

      if (isInventariable) {
        if (selectedInventoryItems.length === 0) {
          alert('Agrega al menos un producto inventariable.');
          return;
        }

        const hasInvalidRow = selectedInventoryItems.some((row) => row.cantidad <= 0 || row.precioUnitario < 0);
        if (hasInvalidRow) {
          alert('Revisa cantidades y precios en la lista de productos.');
          return;
        }

      const missingPlaceOnCheaperPrice = selectedInventoryItems.find(
        (row) => row.requiereLugarCompra && !(row.lugarCompra && row.lugarCompra.trim()) && !(formData.lugarCompra && formData.lugarCompra.trim())
      );
        if (missingPlaceOnCheaperPrice) {
          alert(`"${missingPlaceOnCheaperPrice.nombre}" tiene un precio más económico que el histórico. Indica el lugar de compra.`);
          return;
        }

        if (editingId) {
          alert('La edición de gastos inventariables con múltiples productos aún no está habilitada. Crea uno nuevo.');
          return;
        }

        const payload: Gasto = {
          id: crypto.randomUUID(),
          descripcion: formData.descripcion,
          monto: inventarioTotal,
          categoria: 'Inventario',
          fecha,
          metodoPago: formData.metodoPago,
          created_at: new Date(),
          esInventariable: true,
          lugarCompra: formData.lugarCompra.trim() || undefined,
        };

        await dataService.createGastoWithInventarioItems(
          payload,
          selectedInventoryItems.map((item) => ({
            menuItemId: item.menuItemId,
            cantidad: item.cantidad,
            inventarioTipo: item.inventarioTipo,
            unidadInventario: item.unidadInventario,
            precioUnitario: item.precioUnitario,
            lugarCompra: item.lugarCompra || formData.lugarCompra,
          }))
        );

        await refreshAfterInventoryChange();
        await fetchGastos();
        resetForm();
        return;
      }

      const monto = parseFloat(formData.monto.toString()) || 0;

      const payload: Gasto = {
        id: editingId ?? crypto.randomUUID(),
        descripcion: formData.descripcion,
        monto,
        categoria: formData.categoria,
        fecha,
        metodoPago: formData.metodoPago,
        created_at: editingId ? undefined : new Date(),
        esInventariable: false,
        lugarCompra: formData.lugarCompra.trim() || undefined,
      };

      if (editingId) {
        await dataService.updateGasto(payload);
      } else {
        await dataService.createGasto(payload);
      }

      await fetchGastos();
      resetForm();
    } catch (error) {
      console.error('Error guardando gasto:', error);
      alert('No se pudo guardar el gasto. Inténtalo nuevamente.');
    }
  };

  const handleEdit = (gasto: Gasto) => {
    if (gasto.esInventariable) {
      alert('Para gastos inventariables en múltiples productos, crea un nuevo registro.');
      return;
    }

    setFormData({
      descripcion: gasto.descripcion,
      monto: gasto.monto,
      categoria: gasto.categoria,
      fecha: formatDateInputValue(gasto.fecha instanceof Date ? gasto.fecha : new Date(gasto.fecha)),
      metodoPago: gasto.metodoPago ?? 'efectivo',
      tipoRegistro: 'operativo',
      lugarCompra: gasto.lugarCompra ?? '',
    });
    setEditingId(gasto.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este gasto?')) {
      return;
    }

    const target = gastos.find((gasto) => gasto.id === id);
    await dataService.deleteGasto(id);
    if (target?.esInventariable) {
      await refreshAfterInventoryChange();
    }
    await fetchGastos();
  };

  const getFilteredGastos = () => {
    const today = parseDateInputValue(selectedDate);

    const getSortTimestamp = (gasto: Gasto) => {
      const createdAtTime = gasto.created_at instanceof Date ? gasto.created_at.getTime() : NaN;
      if (!Number.isNaN(createdAtTime)) {
        return createdAtTime;
      }

      const fechaDate = gasto.fecha instanceof Date ? gasto.fecha : parseDateInputValue(gasto.fecha);
      return Number.isNaN(fechaDate.getTime()) ? 0 : fechaDate.getTime();
    };

    const filtered = gastos.filter((gasto) => {
      const gastoDate = parseDateInputValue(gasto.fecha);

      switch (viewMode) {
        case 'diario':
          return gastoDate.toDateString() === today.toDateString();
        case 'semanal': {
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return gastoDate >= startOfWeek && gastoDate <= endOfWeek;
        }
        case 'mensual':
          return gastoDate.getMonth() === today.getMonth() && gastoDate.getFullYear() === today.getFullYear();
        default:
          return true;
      }
    });

    return filtered.sort((a, b) => {
      const diff = getSortTimestamp(a) - getSortTimestamp(b);
      return sortDirection === 'asc' ? diff : -diff;
    });
  };

  const filteredGastos = getFilteredGastos();
  const totalGastos = filteredGastos.reduce((sum, gasto) => sum + gasto.monto, 0);

  const gastosPorCategoria = filteredGastos.reduce((acc, gasto) => {
    acc[gasto.categoria] = (acc[gasto.categoria] || 0) + gasto.monto;
    return acc;
  }, {} as Record<string, number>);

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt size={24} style={{ color: COLORS.dark }} />
          <h2 className="text-xl lg:text-2xl font-bold" style={{ color: COLORS.dark }}>
            Control de Gastos
          </h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 text-sm"
          style={{ backgroundColor: COLORS.dark }}
        >
          <Plus size={16} />
          <span className="hidden lg:inline">Agregar Gasto</span>
          <span className="lg:hidden">Agregar</span>
        </button>
      </div>

      <div className="ui-card ui-card-pad">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <span className="text-sm font-medium">Vista:</span>
            </div>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              {(['diario', 'semanal', 'mensual'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 lg:px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === mode ? 'text-white' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{
                    backgroundColor: viewMode === mode ? COLORS.dark : 'transparent',
                  }}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm w-full lg:w-auto"
              style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown size={20} style={{ color: COLORS.accent }} />
            <span className="text-base lg:text-lg font-semibold">Total {viewMode}:</span>
          </div>
          <span className="text-lg lg:text-2xl font-bold" style={{ color: COLORS.accent }}>
            {formatCOP(totalGastos)}
          </span>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.dark }}>
              {editingId ? 'Editar Gasto' : 'Nuevo Gasto'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de gasto *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        tipoRegistro: 'operativo',
                        categoria: prev.categoria === 'Inventario' ? '' : prev.categoria,
                      }));
                    }}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                      formData.tipoRegistro === 'operativo'
                        ? 'border-transparent text-white'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    style={{ backgroundColor: formData.tipoRegistro === 'operativo' ? COLORS.dark : 'transparent' }}
                  >
                    Operativo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, tipoRegistro: 'inventariable', categoria: 'Inventario' }));
                    }}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                      formData.tipoRegistro === 'inventariable'
                        ? 'border-transparent text-white'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    style={{ backgroundColor: formData.tipoRegistro === 'inventariable' ? COLORS.dark : 'transparent' }}
                  >
                    Inventariable
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descripción *</label>
                <input
                  type="text"
                  required
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                  placeholder="Ej. Compra de frutas para producción"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Monto *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    value={formData.tipoRegistro === 'inventariable' ? inventarioTotal : formData.monto}
                    readOnly={formData.tipoRegistro === 'inventariable'}
                    onChange={(e) => setFormData({ ...formData, monto: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                    placeholder="Valor total (COP)"
                  />
                  {formData.tipoRegistro === 'inventariable' && (
                    <p className="text-xs text-gray-500 mt-1">Se calcula automáticamente con los ítems agregados.</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                  />
                </div>
              </div>

              {formData.tipoRegistro === 'operativo' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Categoría *</label>
                  <select
                    required
                    value={formData.categoria}
                    onChange={(e) => setFormData((prev) => ({ ...prev, categoria: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categoriasOperativas.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.tipoRegistro === 'inventariable' && (
                <div className="space-y-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <h4 className="text-sm font-semibold text-gray-700">Agregar productos inventariables</h4>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                    <div className="md:col-span-6">
                      <input
                        type="text"
                        value={inventorySearch}
                        onChange={(e) => {
                          const value = e.target.value;
                          setInventorySearch(value);
                          const exact = inventariables.find((item) => item.nombre.toLowerCase() === value.trim().toLowerCase());
                          setPendingMenuItemId(exact?.id ?? '');
                          if (exact) {
                            const latestReference = inventoryPriceStats[exact.id]?.lastTotalPrice;
                            setPendingPrecio(
                              typeof latestReference === 'number' && latestReference > 0
                                ? latestReference
                                : exact.precio > 0
                                  ? exact.precio
                                  : ''
                            );
                          }
                        }}
                        placeholder="Buscar en todos los inventariables"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="number"
                        min="1"
                        step={getQuantityStep(getInventoryTypeLabel(pendingItem))}
                        value={pendingCantidad === 0 ? '' : pendingCantidad}
                        onChange={(e) =>
                          setPendingCantidad(
                            normalizeTypedQuantity(
                              Math.max(0, parseFloat(e.target.value) || 0),
                              getInventoryTypeLabel(pendingItem)
                            )
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                        placeholder={`Cantidad (${pendingItem ? getQuantityUnitLabel({
                          inventarioTipo: getInventoryTypeLabel(pendingItem),
                          unidadInventario: pendingItem.inventarioTipo === 'cantidad' ? undefined : 'g',
                        }) : 'unidad'})`}
                        title={`Cantidad (${pendingItem ? getQuantityUnitLabel({
                          inventarioTipo: getInventoryTypeLabel(pendingItem),
                          unidadInventario: pendingItem.inventarioTipo === 'cantidad' ? undefined : 'g',
                        }) : 'unidad'})`}
                      />
                      <p className="mt-1 text-[11px] text-gray-500">
                        {pendingItem
                              ? `Tipo: ${getInventoryTypeLabel(pendingItem)} · Unidad: ${getQuantityUnitLabel({
                                  inventarioTipo: getInventoryTypeLabel(pendingItem),
                                  unidadInventario: pendingItem.inventarioTipo === 'cantidad' ? undefined : 'g',
                                })}`
                          : 'Selecciona un producto para tipar la cantidad'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={pendingPrecio === 0 ? '' : pendingPrecio}
                        onChange={(e) => setPendingPrecio(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                        title="Precio"
                      />
                      <p className="mt-1 text-[11px] text-gray-500">
                        {pendingItem && getInventoryTypeLabel(pendingItem) === 'peso'
                          ? 'Precio total del peso ingresado (COP)'
                          : 'Precio por unidad (COP)'}
                      </p>
                      {pendingItem && inventoryPriceStats[pendingItem.id] && (
                        <p className="mt-1 text-[11px] text-gray-500">
                          Último valor registrado: {formatCOP(inventoryPriceStats[pendingItem.id].lastTotalPrice)}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <button
                        type="button"
                        onClick={handleAddInventoryItem}
                        className="w-full px-3 py-2 rounded-lg text-white font-medium"
                        style={{ backgroundColor: COLORS.dark }}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>

                  <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-200 bg-white">
                    {inventorySuggestions.length === 0 ? (
                      <p className="px-3 py-2 text-xs text-gray-500">Sin coincidencias.</p>
                    ) : (
                      inventorySuggestions.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectPendingItem(item)}
                          className="w-full text-left px-3 py-2 text-sm border-b last:border-b-0 hover:bg-gray-50"
                        >
                          {item.nombre}
                          <span className="ml-2 text-xs text-gray-500">{formatCOP(item.precio)}</span>
                          <span className="ml-2 text-xs text-gray-400">
                            · {getInventoryTypeLabel(item)} {item.unidadMedida ? `(${item.unidadMedida})` : ''}
                          </span>
                        </button>
                      ))
                    )}
                  </div>

                  <div className="space-y-2">
                    {selectedInventoryItems.length === 0 ? (
                      <p className="text-xs text-gray-500">No has agregado productos todavía.</p>
                    ) : (
                      selectedInventoryItems.map((item) => (
                        <div key={item.menuItemId} className="grid grid-cols-12 gap-2 items-center bg-white border border-gray-200 rounded-lg p-2">
                          <div className="col-span-12 md:col-span-4">
                            <p className="text-sm font-medium text-gray-800">{item.nombre}</p>
                            <p className="text-xs text-gray-500">
                              {item.inventarioTipo ?? 'cantidad'} · {getQuantityUnitLabel(item)}
                            </p>
                          </div>
                          <div className="col-span-4 md:col-span-2">
                            <input
                              type="number"
                              min="1"
                              step={getQuantityStep(item.inventarioTipo)}
                              value={item.cantidad === 0 ? '' : item.cantidad}
                              onChange={(e) =>
                                updateDraftItem(item.menuItemId, {
                                  cantidad: normalizeTypedQuantity(
                                    Math.max(0, parseFloat(e.target.value) || 0),
                                    item.inventarioTipo
                                  ),
                                })
                              }
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                              placeholder={`Cantidad (${getQuantityUnitLabel(item)})`}
                            />
                            <p className="mt-1 text-[10px] text-gray-500">{getQuantityUnitLabel(item)}</p>
                          </div>
                          <div className="col-span-4 md:col-span-2">
                            <input
                              type="number"
                              min="0"
                              step="100"
                              value={item.precioUnitario === 0 ? '' : item.precioUnitario}
                              onChange={(e) => updateDraftItem(item.menuItemId, { precioUnitario: Math.max(0, parseFloat(e.target.value) || 0) })}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                            />
                            <p className="mt-1 text-[10px] text-gray-500">
                              {item.inventarioTipo === 'peso' ? 'Precio del peso (COP)' : 'Precio por unidad (COP)'}
                            </p>
                          </div>
                          <div className="col-span-3 md:col-span-3 text-right text-sm font-semibold" style={{ color: COLORS.accent }}>
                            {formatCOP(getDraftItemSubtotal(item))}
                            <p className="text-[10px] font-normal text-gray-500 mt-1">
                              Precio ref. {item.inventarioTipo === 'peso' ? 'por g' : 'por unidad'}: {formatCOP(item.costoUnitarioNormalizado)}
                            </p>
                          </div>
                          <div className="col-span-1 md:col-span-1 text-right">
                            <button type="button" onClick={() => removeDraftItem(item.menuItemId)} className="text-red-600 hover:text-red-800">
                              <X size={16} />
                            </button>
                          </div>
                          {item.requiereLugarCompra && (
                            <div className="col-span-12 md:col-span-12">
                              <label className="text-[11px] font-medium text-amber-700">
                                Precio más económico detectado. ¿Dónde lo compraste?
                              </label>
                              <input
                                type="text"
                                value={item.lugarCompra ?? ''}
                                onChange={(e) => updateDraftItem(item.menuItemId, { lugarCompra: e.target.value })}
                                className="mt-1 w-full px-2 py-1.5 border border-amber-300 rounded text-sm focus:ring-2 focus:border-transparent"
                                style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                                placeholder="Ej. Plaza central, Proveedor X"
                              />
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Lugar de compra</label>
                <input
                  type="text"
                  value={formData.lugarCompra}
                  onChange={(e) => setFormData({ ...formData, lugarCompra: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                  placeholder="Ej. Plaza central, Proveedor X"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Se guarda en el gasto y se usa como respaldo en el histórico de compras.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Método de pago *</label>
                <div className="grid grid-cols-3 gap-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setFormData({ ...formData, metodoPago: method })}
                      className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                        formData.metodoPago === method
                          ? 'border-transparent text-white'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      style={{ backgroundColor: formData.metodoPago === method ? COLORS.dark : 'transparent' }}
                    >
                      {paymentLabels[method]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: COLORS.dark }}
                >
                  {editingId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {Object.keys(gastosPorCategoria).length > 0 && (
        <div className="ui-card ui-card-pad">
          <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.dark }}>
            Gastos por categoría
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {Object.entries(gastosPorCategoria)
              .sort(([a], [b]) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
              .map(([categoria, monto]) => (
                <div key={categoria} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">{categoria}</span>
                  <span className="font-bold" style={{ color: COLORS.accent }}>
                    {formatCOP(monto)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="ui-card">
        <div className="ui-card-pad ui-table-wrapper">
          <table className="ui-table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                    className="flex items-center gap-1"
                  >
                    Fecha
                    {sortDirection === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                  </button>
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Categoría
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Método
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGastos.map((gasto) => (
                <tr key={gasto.id} className="hover:bg-gray-50">
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">
                    {(() => {
                      const displayDate =
                        gasto.created_at instanceof Date && !Number.isNaN(gasto.created_at.getTime())
                          ? gasto.created_at
                          : gasto.fecha instanceof Date
                            ? gasto.fecha
                            : parseDateInputValue(gasto.fecha);
                      return formatDateTime(displayDate);
                    })()}
                  </td>
                  <td className="px-3 lg:px-6 py-4 text-xs lg:text-sm text-gray-900">
                    <p>{gasto.descripcion}</p>
                    {gasto.esInventariable && <p className="text-[11px] text-gray-500 mt-1">Inventariable (multi-ítem)</p>}
                    {gasto.lugarCompra && (
                      <p className="text-[11px] text-gray-500 mt-1">
                        Lugar: {gasto.lugarCompra}
                      </p>
                    )}
                    {gasto.esInventariable && Array.isArray(gasto.inventarioItems) && gasto.inventarioItems.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {gasto.inventarioItems.map((item, index) => (
                          <p key={`${gasto.id}-${item.id ?? item.menuItemId}-${index}`} className="text-[11px] text-gray-600">
                            {formatGastoInventarioItemDetail(item)}
                          </p>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{gasto.categoria}</span>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {paymentLabels[(gasto.metodoPago ?? 'efectivo') as PaymentMethod]}
                    </span>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm font-medium" style={{ color: COLORS.accent }}>
                    {formatCOP(gasto.monto)}
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(gasto)} className="text-indigo-600 hover:text-indigo-900">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(gasto.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredGastos.length === 0 && (
          <div className="text-center py-12">
            <Receipt size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay gastos para el período seleccionado</h3>
            <p className="text-gray-500">Los gastos aparecerán aquí cuando los registres</p>
          </div>
        )}
      </div>
    </section>
  );
}
