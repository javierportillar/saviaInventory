import React, { useState } from 'react';
import { ModuleType, User } from '../types';
import {
  Home,
  PiggyBank,
  ShoppingCart,
  ClipboardList,
  Package,
  ChefHat,
  Users,
  UserCheck,
  Receipt,
  LogOut,
  Menu,
  X
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
  { id: 'balance' as ModuleType, label: 'Balance', icon: PiggyBank },
  { id: 'caja' as ModuleType, label: 'Caja', icon: ShoppingCart },
  { id: 'comandas' as ModuleType, label: 'Comandas', icon: ClipboardList },
  { id: 'inventario' as ModuleType, label: 'Inventario', icon: Package },
  { id: 'cocina' as ModuleType, label: 'Cocina', icon: ChefHat },
  { id: 'clientes' as ModuleType, label: 'Clientes', icon: Users },
  { id: 'empleados' as ModuleType, label: 'Empleados', icon: UserCheck },
  { id: 'gastos' as ModuleType, label: 'Gastos', icon: Receipt },
];

export function Navigation({ activeModule, onModuleChange, user, onLogout }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const allowedModules =
    user.role === 'admin'
      ? modules
      : modules.filter(m => ['caja', 'comandas', 'cocina', 'clientes','inventario','gastos'].includes(m.id));

  const handleModuleClick = (moduleId: ModuleType) => {
    onModuleChange(moduleId);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-base"
                style={{ backgroundColor: COLORS.accent }}
              >
                S
              </div>
              <h1 className="text-xl font-bold hidden sm:block" style={{ color: COLORS.dark }}>
                SAVIA Gestión
              </h1>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1">
              {allowedModules.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleModuleClick(id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap
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
                  <span className="font-medium">{label}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 whitespace-nowrap"
              >
                <LogOut size={18} />
                <span className="font-medium">Salir</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-base"
                  style={{ backgroundColor: COLORS.accent }}
                >
                  S
                </div>
                <h1 className="text-xl font-bold" style={{ color: COLORS.dark }}>
                  SAVIA Gestión
                </h1>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="py-4">
              {allowedModules.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleModuleClick(id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                    ${activeModule === id 
                      ? 'text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  style={{
                    backgroundColor: activeModule === id ? COLORS.dark : 'transparent'
                  }}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
              
              <div className="border-t border-gray-200 mt-4 pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Salir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}