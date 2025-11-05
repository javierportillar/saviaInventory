import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Gasto, PaymentMethod, FocusDateRequest, MenuItem, InventoryAdjustment } from '../types';
import { Receipt, Plus, Edit3, Trash2, Calendar, TrendingDown, Filter, ArrowDown, ArrowUp } from 'lucide-react';
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
import { normalizeText } from '../utils/strings';
import { normalizeQuantityForItem, SUPPORTED_UNITS } from '../utils/inventory';

interface GastosProps {
  focusRequest?: FocusDateRequest | null;
  menuItems?: MenuItem[];
  onInventoryItemsUpdated?: (items: MenuItem[]) => void;
}

export function Gastos({ focusRequest, menuItems = [], onInventoryItemsUpdated }: GastosProps) {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'diario' | 'semanal' | 'mensual'>('diario');
  const [selectedDate, setSelectedDate] = useState(getTodayDateInputValue());
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [formData, setFormData] = useState<{
    descripcion: string;
    monto: number;
    categoria: string;
    fecha: string;
    metodoPago: PaymentMethod;
  }>({
    descripcion: '',
    monto: 0,
    categoria: '',
    fecha: getTodayDateInputValue(),
    metodoPago: 'efectivo'
  });
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<MenuItem | null>(null);
  const [inventoryQuantity, setInventoryQuantity] = useState<string>('');
  const [inventoryUnit, setInventoryUnit] = useState<MenuItem['unidadMedida']>('g');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionTimeoutRef = useRef<number | null>(null);

  const paymentMethods: PaymentMethod[] = EXPENSE_PAYMENT_METHODS;
  const paymentLabels: Record<PaymentMethod, string> = PAYMENT_METHOD_LABELS;

  const categorias = [
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
    'Otros'
  ];

  const inventariableItems = useMemo(
    () => menuItems.filter((item) => item.inventarioCategoria === 'Inventariables'),
    [menuItems],
  );

  const menuItemsById = useMemo(
    () => new Map(menuItems.map((item) => [item.id, item])),
    [menuItems],
  );

  const filteredInventorySuggestions = useMemo(() => {
    if (!inventariableItems.length) {
      return [] as MenuItem[];
    }

    const query = formData.descripcion.trim();
    if (!query) {
      return inventariableItems.slice(0, 8);
    }

    const normalizedQuery = normalizeText(query);
    return inventariableItems
      .filter((item) => normalizeText(item.nombre).includes(normalizedQuery))
      .slice(0, 8);
  }, [formData.descripcion, inventariableItems]);

  useEffect(() => {
    fetchGastos();
  }, []);

  useEffect(() => () => {
    if (suggestionTimeoutRef.current) {
      window.clearTimeout(suggestionTimeoutRef.current);
    }
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

  const fetchGastos = async () => {
    setIsLoading(true);
    try {
      const data = await dataService.fetchGastos();
      const normalized = data.map((gasto) => ({
        ...gasto,
        fecha: parseDateInputValue(gasto.fecha),
        created_at: gasto.created_at
          ? gasto.created_at instanceof Date
            ? new Date(gasto.created_at.getTime())
            : new Date(gasto.created_at)
          : undefined,
        metodoPago: gasto.metodoPago ?? 'efectivo'
      }));
      setGastos(normalized);
    } catch (error) {
      console.error('[Gastos] Error cargando los gastos.', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openSuggestions = () => {
    if (suggestionTimeoutRef.current) {
      window.clearTimeout(suggestionTimeoutRef.current);
      suggestionTimeoutRef.current = null;
    }
    setShowSuggestions(true);
  };

  const scheduleCloseSuggestions = () => {
    if (suggestionTimeoutRef.current) {
      window.clearTimeout(suggestionTimeoutRef.current);
    }
    suggestionTimeoutRef.current = window.setTimeout(() => {
      setShowSuggestions(false);
    }, 120);
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, descripcion: value }));
    openSuggestions();

    if (selectedInventoryItem && normalizeText(value) !== normalizeText(selectedInventoryItem.nombre)) {
      setSelectedInventoryItem(null);
      setInventoryQuantity('');
      setInventoryUnit('g');
    }
  };

  const handleSelectInventoryItem = (item: MenuItem) => {
    setSelectedInventoryItem(item);
    setFormData((prev) => ({
      ...prev,
      descripcion: item.nombre,
      categoria: prev.categoria || item.categoria,
    }));
    setInventoryQuantity('');
    setInventoryUnit(item.inventarioTipo === 'gramos' ? item.unidadMedida ?? 'g' : 'g');
    setShowSuggestions(false);
  };

  const handleClearInventorySelection = () => {
    setSelectedInventoryItem(null);
    setInventoryQuantity('');
    setInventoryUnit('g');
  };

  const availableUnits = useMemo(() => {
    if (!selectedInventoryItem || selectedInventoryItem.inventarioTipo !== 'gramos') {
      return [] as MenuItem['unidadMedida'][];
    }

    if (selectedInventoryItem.unidadMedida === 'ml') {
      return ['ml'];
    }

    return (SUPPORTED_UNITS.filter((unit) => unit !== 'ml') as MenuItem['unidadMedida'][]);
  }, [selectedInventoryItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const monto = Number(formData.monto);
    if (!Number.isFinite(monto) || monto <= 0) {
      alert('Ingresa un monto válido para el gasto.');
      return;
    }

    if (selectedInventoryItem) {
      const qtyValue = Number(inventoryQuantity);
      if (!Number.isFinite(qtyValue) || qtyValue <= 0) {
        alert('Ingresa una cantidad válida para el inventario.');
        return;
      }
    }

    const fecha = parseDateInputValue(formData.fecha);
    const gastoPayload: Omit<Gasto, 'id' | 'created_at'> = {
      descripcion: formData.descripcion,
      monto,
      categoria: formData.categoria,
      fecha,
      metodoPago: formData.metodoPago,
      inventarioItemId: undefined,
      inventarioCantidad: undefined,
      inventarioTipo: undefined,
      inventarioUnidad: undefined,
    };

    const inventoryAdjustments: InventoryAdjustment[] = [];

    if (selectedInventoryItem && selectedInventoryItem.inventarioCategoria === 'Inventariables') {
      const rawCantidad = Number(inventoryQuantity);
      gastoPayload.inventarioItemId = selectedInventoryItem.id;
      gastoPayload.inventarioCantidad = rawCantidad;

      const tipo = selectedInventoryItem.inventarioTipo ?? 'cantidad';
      gastoPayload.inventarioTipo = tipo;

      if (tipo === 'gramos') {
        const defaultUnit = selectedInventoryItem.unidadMedida ?? 'g';
        const resolvedUnit = inventoryUnit ?? defaultUnit;
        gastoPayload.inventarioUnidad = resolvedUnit;
      }

      const addedDelta = normalizeQuantityForItem({
        cantidad: rawCantidad,
        tipo,
        unidad: gastoPayload.inventarioUnidad ?? selectedInventoryItem.unidadMedida,
        item: selectedInventoryItem,
      });

      if (addedDelta !== 0) {
        inventoryAdjustments.push({ itemId: selectedInventoryItem.id, delta: addedDelta, reason: 'gasto' });
      }
    }

    if (editingId) {
      const previous = gastos.find((gasto) => gasto.id === editingId);
      if (previous?.inventarioItemId) {
        const previousItem = menuItemsById.get(previous.inventarioItemId);
        if (previousItem) {
          const previousDelta = normalizeQuantityForItem({
            cantidad: previous.inventarioCantidad,
            tipo: previous.inventarioTipo ?? previousItem.inventarioTipo,
            unidad: previous.inventarioUnidad ?? previousItem.unidadMedida,
            item: previousItem,
          });

          if (previousDelta !== 0) {
            inventoryAdjustments.push({ itemId: previousItem.id, delta: -previousDelta, reason: 'gasto' });
          }
        }
      }

      await dataService.updateGasto({ ...gastoPayload, id: editingId, fecha });
    } else {
      const newGasto: Gasto = {
        ...gastoPayload,
        id: crypto.randomUUID(),
        created_at: new Date(),
      };
      await dataService.createGasto(newGasto);
    }

    if (inventoryAdjustments.length) {
      const updatedItems = await dataService.applyInventoryAdjustments(inventoryAdjustments);
      if (updatedItems.length && onInventoryItemsUpdated) {
        onInventoryItemsUpdated(updatedItems);
      }
    }

    fetchGastos();
    resetForm();
  };

  const handleEdit = (gasto: Gasto) => {
    setFormData({
      descripcion: gasto.descripcion,
      monto: gasto.monto,
      categoria: gasto.categoria,
      fecha: formatDateInputValue(gasto.fecha instanceof Date ? gasto.fecha : new Date(gasto.fecha)),
      metodoPago: gasto.metodoPago ?? 'efectivo'
    });
    const inventoryItem = gasto.inventarioItemId ? menuItemsById.get(gasto.inventarioItemId) ?? null : null;
    setSelectedInventoryItem(inventoryItem);
    setInventoryQuantity(
      gasto.inventarioCantidad !== undefined && gasto.inventarioCantidad !== null
        ? String(gasto.inventarioCantidad)
        : ''
    );
    setInventoryUnit(gasto.inventarioUnidad ?? inventoryItem?.unidadMedida ?? 'g');
    setShowSuggestions(false);
    setEditingId(gasto.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const target = gastos.find((gasto) => gasto.id === id);
    if (confirm('¿Estás seguro de eliminar este gasto?')) {
      await dataService.deleteGasto(id);

      if (target?.inventarioItemId) {
        const inventoryItem = menuItemsById.get(target.inventarioItemId);
        if (inventoryItem) {
          const delta = normalizeQuantityForItem({
            cantidad: target.inventarioCantidad,
            tipo: target.inventarioTipo ?? inventoryItem.inventarioTipo,
            unidad: target.inventarioUnidad ?? inventoryItem.unidadMedida,
            item: inventoryItem,
          });

          if (delta !== 0) {
            const updatedItems = await dataService.applyInventoryAdjustments([
              { itemId: inventoryItem.id, delta: -delta, reason: 'gasto' },
            ]);
            if (updatedItems.length && onInventoryItemsUpdated) {
              onInventoryItemsUpdated(updatedItems);
            }
          }
        }
      }

      fetchGastos();
    }
  };

  const resetForm = () => {
    setFormData({
      descripcion: '',
      monto: 0,
      categoria: '',
      fecha: getTodayDateInputValue(),
      metodoPago: 'efectivo'
    });
    setEditingId(null);
    setShowForm(false);
    setSelectedInventoryItem(null);
    setInventoryQuantity('');
    setInventoryUnit('g');
    setShowSuggestions(false);
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

    const filtered = gastos.filter(gasto => {
      const gastoDate = parseDateInputValue(gasto.fecha);
      
      switch (viewMode) {
        case 'diario':
          return gastoDate.toDateString() === today.toDateString();
        case 'semanal':
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return gastoDate >= startOfWeek && gastoDate <= endOfWeek;
        case 'mensual':
          return gastoDate.getMonth() === today.getMonth() && 
                 gastoDate.getFullYear() === today.getFullYear();
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
                    viewMode === mode
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{
                    backgroundColor: viewMode === mode ? COLORS.dark : 'transparent'
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

      {/* Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.dark }}>
              {editingId ? 'Editar Gasto' : 'Nuevo Gasto'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium mb-1">Descripción *</label>
                <input
                  type="text"
                  required
                  value={formData.descripcion}
                  onFocus={openSuggestions}
                  onBlur={scheduleCloseSuggestions}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                  placeholder="Ej. Compra de tomates"
                />
                {showSuggestions && filteredInventorySuggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 z-30 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
                    {filteredInventorySuggestions.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => handleSelectInventoryItem(item)}
                          className={`flex w-full flex-col px-3 py-2 text-sm transition-colors ${
                            selectedInventoryItem?.id === item.id ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                          }`}
                        >
                          <span>{item.nombre}</span>
                          <span className="text-xs text-gray-500">
                            {item.categoria}
                            {item.unidadMedida ? ` · ${item.unidadMedida}` : ''}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {selectedInventoryItem && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-2 py-1 text-xs text-green-700">
                    <span className="font-medium">{selectedInventoryItem.nombre}</span>
                    <button
                      type="button"
                      onClick={handleClearInventorySelection}
                      className="underline-offset-2 hover:underline"
                    >
                      Quitar
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Monto *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    value={formData.monto}
                    onChange={(e) => setFormData({ ...formData, monto: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                  />
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

              {selectedInventoryItem && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Cantidad comprada *</label>
                    <input
                      type="number"
                      min="0"
                      step={selectedInventoryItem.inventarioTipo === 'gramos' ? 'any' : 1}
                      inputMode={selectedInventoryItem.inventarioTipo === 'gramos' ? 'decimal' : 'numeric'}
                      value={inventoryQuantity}
                      onChange={(e) => setInventoryQuantity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                      placeholder={selectedInventoryItem.inventarioTipo === 'gramos' ? 'Ej. 500' : 'Ej. 2'}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Este valor se sumará al stock del inventario seleccionado.
                    </p>
                  </div>
                  {selectedInventoryItem.inventarioTipo === 'gramos' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Unidad</label>
                      <select
                        value={inventoryUnit ?? selectedInventoryItem.unidadMedida ?? 'g'}
                        onChange={(e) => setInventoryUnit(e.target.value as MenuItem['unidadMedida'])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                      >
                        {availableUnits.map((unit) => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Categoría *</label>
                <select
                  required
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
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
                      style={{
                        backgroundColor: formData.metodoPago === method ? COLORS.dark : 'transparent'
                      }}
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

      {/* Resumen por categorías */}
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

      {/* Lista de gastos */}
      <div className="ui-card">
        <div className="ui-card-pad ui-table-wrapper">
          <table className="ui-table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setSortDirection(prev => (prev === 'desc' ? 'asc' : 'desc'))}
                    className="flex items-center gap-1">
                    Fecha
                    {sortDirection === 'desc' ? (
                      <ArrowDown size={14} />
                    ) : (
                      <ArrowUp size={14} />
                    )}
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-3 lg:px-6 py-6 text-center text-sm text-gray-500">
                    Cargando gastos...
                  </td>
                </tr>
              ) : (
                filteredGastos.map((gasto) => (
                  <tr key={gasto.id} className="hover:bg-gray-50">
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">
                      {(() => {
                        const displayDate = (gasto.created_at instanceof Date && !Number.isNaN(gasto.created_at.getTime()))
                          ? gasto.created_at
                          : gasto.fecha instanceof Date
                          ? gasto.fecha
                          : parseDateInputValue(gasto.fecha);
                      return formatDateTime(displayDate);
                    })()}
                  </td>
                  <td className="px-3 lg:px-6 py-4 text-xs lg:text-sm text-gray-900">
                    <div className="flex flex-col gap-1">
                      <span>{gasto.descripcion}</span>
                      {gasto.inventarioItemId && (
                        <span className="text-[11px] text-green-700">
                          Inventario: {menuItemsById.get(gasto.inventarioItemId)?.nombre ?? '—'}
                          {gasto.inventarioCantidad
                            ? ` · +${gasto.inventarioCantidad}${gasto.inventarioUnidad ? ` ${gasto.inventarioUnidad}` : ''}`
                            : ''}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {gasto.categoria}
                    </span>
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
                        <button
                          onClick={() => handleEdit(gasto)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(gasto.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredGastos.length === 0 && (
          <div className="text-center py-12">
            <Receipt size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No hay gastos para el período seleccionado
            </h3>
            <p className="text-gray-500">
              Los gastos aparecerán aquí cuando los registres
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
