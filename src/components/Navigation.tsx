import React from 'react';
import { ModuleType, User } from '../types';
import {
  Home,
  ShoppingCart,
  ClipboardList,
  Package,
  ChefHat,
  Users,
  UserCheck,
  Receipt,
  LogOut
} from 'lucide-react';
import { COLORS } from '../data/menu';

interface NavigationProps {
  activeModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
  user: User;
  onLogout: () => void;
}

const modules = [
  { id: 'dashboard' as ModuleType, label: 'Dashboard', icon: Home },
  { id: 'caja' as ModuleType, label: 'Caja', icon: ShoppingCart },
  { id: 'comandas' as ModuleType, label: 'Comandas', icon: ClipboardList },
  { id: 'inventario' as ModuleType, label: 'Inventario', icon: Package },
  { id: 'cocina' as ModuleType, label: 'Cocina', icon: ChefHat },
  { id: 'clientes' as ModuleType, label: 'Clientes', icon: Users },
  { id: 'empleados' as ModuleType, label: 'Empleados', icon: UserCheck },
  { id: 'gastos' as ModuleType, label: 'Gastos', icon: Receipt },
];

export function Navigation({ activeModule, onModuleChange, user, onLogout }: NavigationProps) {
  const allowedModules =
    user.role === 'admin'
      ? modules
      : modules.filter(m => ['caja', 'comandas', 'cocina', 'clientes', 'empleados'].includes(m.id));

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: COLORS.accent }}
            >
              S
            </div>
            <h1 className="text-xl font-bold" style={{ color: COLORS.dark }}>
              SAVIA Gestión
            </h1>
          </div>
          
          <div className="flex space-x-1 items-center">
            {allowedModules.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onModuleChange(id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                  ${activeModule === id 
                    ? 'text-white shadow-md transform scale-105' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
                style={{
                  backgroundColor: activeModule === id ? COLORS.dark : 'transparent'
                }}
              >
                <Icon size={18} />
                <span className="font-medium hidden sm:inline">{label}</span>
              </button>
            ))}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <LogOut size={18} />
              <span className="font-medium hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
