import React, { useState, useEffect } from 'react';
import { Gasto, PaymentMethod, FocusDateRequest } from '../types';
import { Receipt, Plus, Edit3, Trash2, Calendar, TrendingDown, Filter } from 'lucide-react';
import { COLORS } from '../data/menu';
import {
  formatCOP,
  formatDateInputValue,
  getTodayDateInputValue,
  parseDateInputValue,
} from '../utils/format';
import dataService from '../lib/dataService';

interface GastosProps {
  focusRequest?: FocusDateRequest | null;
}

export function Gastos({ focusRequest }: GastosProps) {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'diario' | 'semanal' | 'mensual'>('diario');
  const [selectedDate, setSelectedDate] = useState(getTodayDateInputValue());
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

  const paymentMethods: PaymentMethod[] = ['efectivo', 'tarjeta', 'nequi', 'provision_caja'];
  const paymentLabels: Record<PaymentMethod, string> = {
    efectivo: 'Efectivo',
    tarjeta: 'Tarjeta',
    nequi: 'Nequi',
    provision_caja: 'Provisión caja',
    credito_empleados: 'Crédito empleados'
  };

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

  useEffect(() => {
    fetchGastos();
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const gastoData = {
      ...formData,
      monto: parseFloat(formData.monto.toString())
    };

    const fecha = parseDateInputValue(gastoData.fecha);

    if (editingId) {
      await dataService.updateGasto({ ...gastoData, id: editingId, fecha });
      fetchGastos();
      resetForm();
    } else {
      const newGasto = {
        ...gastoData,
        id: crypto.randomUUID(),
        fecha,
        created_at: new Date()
      };
      await dataService.createGasto(newGasto);
      fetchGastos();
      resetForm();
    }
  };

  const handleEdit = (gasto: Gasto) => {
    setFormData({
      descripcion: gasto.descripcion,
      monto: gasto.monto,
      categoria: gasto.categoria,
      fecha: formatDateInputValue(gasto.fecha instanceof Date ? gasto.fecha : new Date(gasto.fecha)),
      metodoPago: gasto.metodoPago ?? 'efectivo'
    });
    setEditingId(gasto.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este gasto?')) {
      await dataService.deleteGasto(id);
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
  };

  const getFilteredGastos = () => {
    const today = parseDateInputValue(selectedDate);

    return gastos.filter(gasto => {
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
              <div>
                <label className="block text-sm font-medium mb-1">Descripción *</label>
                <input
                  type="text"
                  required
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
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
            {Object.entries(gastosPorCategoria).map(([categoria, monto]) => (
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
                  Fecha
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
                    {gasto.fecha.toLocaleDateString('es-CO')}
                  </td>
                  <td className="px-3 lg:px-6 py-4 text-xs lg:text-sm text-gray-900">
                    {gasto.descripcion}
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
              ))}
            </tbody>
          </table>
        </div>

        {filteredGastos.length === 0 && (
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
