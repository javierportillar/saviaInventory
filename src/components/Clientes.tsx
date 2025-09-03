import React, { useState } from 'react';
import { Client } from '../types';
import { COLORS } from '../data/menu';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';

interface ClientesProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}

export function Clientes({ clients, onAddClient, onUpdateClient, onDeleteClient }: ClientesProps) {
  const [newName, setNewName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editContact, setEditContact] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddClient({ id: `client-${Date.now()}`, nombre: newName, contacto: newContact });
    setNewName('');
    setNewContact('');
  };

  const startEdit = (client: Client) => {
    setEditingId(client.id);
    setEditName(client.nombre);
    setEditContact(client.contacto);
  };

  const saveEdit = () => {
    if (editingId) {
      onUpdateClient({ id: editingId, nombre: editName, contacto: editContact });
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2" style={{ color: COLORS.dark }}>
          Clientes
        </h2>
        <p className="text-gray-600">Gestión de clientes frecuentes</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Contacto"
            value={newContact}
            onChange={(e) => setNewContact(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
            style={{ backgroundColor: COLORS.dark }}
          >
            <Plus size={18} /> Agregar
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {clients.length === 0 && (
          <p className="text-gray-500 text-center">No hay clientes registrados</p>
        )}
        {clients.map((client) => (
          <div key={client.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            {editingId === client.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={editContact}
                  onChange={(e) => setEditContact(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={saveEdit}
                  className="p-2 rounded-lg text-white"
                  style={{ backgroundColor: COLORS.accent }}
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={cancelEdit}
                  className="p-2 rounded-lg text-white bg-gray-400"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <p className="font-medium" style={{ color: COLORS.dark }}>{client.nombre}</p>
                  <p className="text-sm text-gray-600">{client.contacto}</p>
                </div>
                <button
                  onClick={() => startEdit(client)}
                  className="p-2 rounded-lg text-white"
                  style={{ backgroundColor: COLORS.accent }}
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => onDeleteClient(client.id)}
                  className="p-2 rounded-lg text-white bg-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
