import React, { useState } from 'react';
import { Customer } from '../types';
import { Users, Edit3, Trash2 } from 'lucide-react';
import { COLORS } from '../data/menu';

interface ClientesProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
}

export function Clientes({ customers, onAddCustomer, onUpdateCustomer, onDeleteCustomer }: ClientesProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) return;
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    if (editingId) {
      onUpdateCustomer({ id: editingId, nombre: trimmedName, telefono: trimmedPhone });
    } else {
      onAddCustomer({ id: crypto.randomUUID(), nombre: trimmedName, telefono: trimmedPhone });
    }
    setName('');
    setPhone('');
    setEditingId(null);
  };

  const startEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setName(customer.nombre);
    setPhone(customer.telefono);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setPhone('');
  };

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2">
        <Users size={24} style={{ color: COLORS.dark }} />
        <h2 className="text-xl lg:text-2xl font-bold" style={{ color: COLORS.dark }}>
          Clientes
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
            style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
          />
        </div>
        <div className="flex-1">
          <input
            type="tel"
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
            style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <button
            onClick={handleSubmit}
            className="px-3 lg:px-4 py-2 rounded-lg text-white font-medium text-sm w-full"
            style={{ backgroundColor: COLORS.dark }}
          >
            {editingId ? 'Actualizar' : 'Agregar'}
          </button>
          {editingId && (
            <button
              onClick={cancelEdit}
              className="px-3 lg:px-4 py-2 rounded-lg border border-gray-300 text-sm w-full"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="ui-card">
        <div className="ui-card-pad ui-table-wrapper">
          <table className="ui-table border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 lg:px-4 py-2 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-3 lg:px-4 py-2 text-left text-sm font-semibold text-gray-700">Teléfono</th>
                <th className="px-3 lg:px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-3 lg:px-4 py-2 text-sm">{c.nombre}</td>
                  <td className="px-3 lg:px-4 py-2 text-sm">{c.telefono}</td>
                  <td className="px-3 lg:px-4 py-2 flex gap-2">
                    <button
                      onClick={() => startEdit(c)}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteCustomer(c.id)}
                      className="p-1 rounded hover:bg-gray-100 text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-3 lg:px-4 py-4 text-center text-gray-500 text-sm">
                    No hay clientes registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
