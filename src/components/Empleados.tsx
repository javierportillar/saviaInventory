import React, { useState, useEffect } from 'react';
import { Empleado } from '../types';
import { Users, Edit3, Trash2, Plus, Clock, DollarSign } from 'lucide-react';
import { COLORS } from '../data/menu';
import { formatCOP } from '../utils/format';
import dataService from '../lib/dataService';

export function Empleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    horas_dia: 8,
    dias_semana: 5,
    salario_hora: 0,
    activo: true
  });

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    const data = await dataService.fetchEmpleados();
    setEmpleados(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      await dataService.updateEmpleado({ ...formData, id: editingId });
      fetchEmpleados();
      resetForm();
    } else {
      const newEmpleado = { ...formData, id: crypto.randomUUID() };
      await dataService.createEmpleado(newEmpleado);
      fetchEmpleados();
      resetForm();
    }
  };

  const handleEdit = (empleado: Empleado) => {
    setFormData({
      nombre: empleado.nombre,
      telefono: empleado.telefono || '',
      email: empleado.email || '',
      horas_dia: empleado.horas_dia,
      dias_semana: empleado.dias_semana,
      salario_hora: empleado.salario_hora,
      activo: empleado.activo
    });
    setEditingId(empleado.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
      await dataService.deleteEmpleado(id);
      fetchEmpleados();
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      telefono: '',
      email: '',
      horas_dia: 8,
      dias_semana: 5,
      salario_hora: 0,
      activo: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const calcularHorasSemana = (horas_dia: number, dias_semana: number) => {
    return horas_dia * dias_semana;
  };

  const calcularHorasMes = (horas_dia: number, dias_semana: number) => {
    return horas_dia * dias_semana * 4.33; // Promedio de semanas por mes
  };

  const calcularSalarioMensual = (horas_dia: number, dias_semana: number, salario_hora: number) => {
    return calcularHorasMes(horas_dia, dias_semana) * salario_hora;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={24} style={{ color: COLORS.dark }} />
          <h2 className="text-2xl font-bold" style={{ color: COLORS.dark }}>
            Gestión de Empleados
          </h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105"
          style={{ backgroundColor: COLORS.dark }}
        >
          <Plus size={16} />
          Agregar Empleado
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.dark }}>
              {editingId ? 'Editar Empleado' : 'Nuevo Empleado'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Horas por día</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={formData.horas_dia}
                    onChange={(e) => setFormData({ ...formData, horas_dia: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Días por semana</label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={formData.dias_semana}
                    onChange={(e) => setFormData({ ...formData, dias_semana: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Salario por hora</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.salario_hora}
                  onChange={(e) => setFormData({ ...formData, salario_hora: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="activo" className="text-sm font-medium">Empleado activo</label>
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

      {/* Lista de empleados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {empleados.map((empleado) => (
          <div
            key={empleado.id}
            className={`bg-white rounded-xl p-6 shadow-sm border transition-all duration-200 hover:shadow-md ${
              empleado.activo ? 'border-gray-100' : 'border-gray-300 bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
                  {empleado.nombre}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    empleado.activo 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {empleado.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(empleado)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(empleado.id)}
                  className="p-1 rounded hover:bg-gray-100 text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {(empleado.telefono || empleado.email) && (
              <div className="space-y-1 mb-4 text-sm text-gray-600">
                {empleado.telefono && <p>📞 {empleado.telefono}</p>}
                {empleado.email && <p>✉️ {empleado.email}</p>}
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" />
                  <span className="text-sm">Horario</span>
                </div>
                <span className="text-sm font-medium">
                  {empleado.horas_dia}h/día • {empleado.dias_semana} días/sem
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-gray-600">Horas/semana</p>
                  <p className="font-semibold">{calcularHorasSemana(empleado.horas_dia, empleado.dias_semana)}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-gray-600">Horas/mes</p>
                  <p className="font-semibold">{Math.round(calcularHorasMes(empleado.horas_dia, empleado.dias_semana))}</p>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-gray-500" />
                    <span className="text-sm">Salario/hora</span>
                  </div>
                  <span className="text-sm font-medium">{formatCOP(empleado.salario_hora)}</span>
                </div>
                <div className="text-center p-2 rounded" style={{ backgroundColor: `${COLORS.accent}20` }}>
                  <p className="text-sm text-gray-600">Salario mensual estimado</p>
                  <p className="font-bold" style={{ color: COLORS.dark }}>
                    {formatCOP(calcularSalarioMensual(empleado.horas_dia, empleado.dias_semana, empleado.salario_hora))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {empleados.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay empleados registrados</h3>
          <p className="text-gray-500">Agrega tu primer empleado para comenzar</p>
        </div>
      )}
    </div>
  );
}