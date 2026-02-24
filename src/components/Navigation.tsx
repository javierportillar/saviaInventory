import React, { useEffect, useRef, useState } from 'react';
import { ModuleType, User, DatabaseConnectionState } from '../types';
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
  BarChart3,
  LogOut,
  Menu,
  X,
  CreditCard,
  CalendarDays,
  FileSpreadsheet
} from 'lucide-react';
import { COLORS } from '../data/menu';

interface NavigationProps {
  activeModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
  user: User;
  onLogout: () => void;
  connectionStatus: DatabaseConnectionState;
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
  { id: 'contabilidad' as ModuleType, label: 'Contabilidad', icon: FileSpreadsheet },
  { id: 'novedades' as ModuleType, label: 'Novedades', icon: CalendarDays },
  { id: 'creditoEmpleados' as ModuleType, label: 'Crédito empleados', icon: CreditCard },
  { id: 'analitica' as ModuleType, label: 'Analítica', icon: BarChart3 },
];

export function Navigation({ activeModule, onModuleChange, user, onLogout, connectionStatus }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuHovered, setIsDesktopMenuHovered] = useState(false);
  const [isDesktopMenuExpanded, setIsDesktopMenuExpanded] = useState(false);
  const desktopExpandTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allowedModules =
    user.role === 'admin'
      ? modules
      : modules.filter(m => ['caja', 'comandas', 'cocina', 'clientes', 'gastos', 'inventario'].includes(m.id));

  const statusConfig: Record<DatabaseConnectionState, { label: string; ringClass: string; textClass: string }> = {
    checking: {
      label: 'Verificando conexión…',
      ringClass: 'border-orange-500',
      textClass: 'text-orange-700',
    },
    online: {
      label: 'Conectado a Base de Datos',
      ringClass: 'border-green-500',
      textClass: 'text-green-700',
    },
    local: {
      label: 'Modo sin conexión (local)',
      ringClass: 'border-red-500',
      textClass: 'text-red-600',
    },
  };

  const currentStatus = statusConfig[connectionStatus];
  const showStatusTextOnIdleDesktop = connectionStatus !== 'online';

  const handleModuleClick = (moduleId: ModuleType) => {
    onModuleChange(moduleId);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsMobileMenuOpen(false);
  };

  const handleDesktopMouseEnter = () => {
    if (desktopExpandTimeoutRef.current) {
      clearTimeout(desktopExpandTimeoutRef.current);
    }
    setIsDesktopMenuHovered(true);
    desktopExpandTimeoutRef.current = setTimeout(() => {
      setIsDesktopMenuExpanded(true);
      desktopExpandTimeoutRef.current = null;
    }, 150);
  };

  const handleDesktopMouseLeave = () => {
    if (desktopExpandTimeoutRef.current) {
      clearTimeout(desktopExpandTimeoutRef.current);
      desktopExpandTimeoutRef.current = null;
    }
    setIsDesktopMenuExpanded(false);
    setIsDesktopMenuHovered(false);
  };

  useEffect(() => {
    return () => {
      if (desktopExpandTimeoutRef.current) {
        clearTimeout(desktopExpandTimeoutRef.current);
      }
    };
  }, []);

  const desktopIconSize = isDesktopMenuExpanded ? 26 : 20;
  const desktopLogoClass = isDesktopMenuExpanded ? 'w-10 h-10 text-lg' : 'w-8 h-8 text-base';

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div
          className={`ui-page transition-all duration-300 ease-out ${
            isDesktopMenuHovered ? 'mx-0 px-6' : ''
          }`}
          style={isDesktopMenuHovered ? { maxWidth: '100%' } : undefined}
        >
          <div
            className="hidden lg:block"
            onMouseEnter={handleDesktopMouseEnter}
            onMouseLeave={handleDesktopMouseLeave}
          >
            {isDesktopMenuExpanded ? (
              <div className="flex items-center justify-between gap-6 py-4">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div
                    className={`${desktopLogoClass} rounded-lg flex items-center justify-center text-white font-bold transition-all duration-300`}
                    style={{ backgroundColor: COLORS.accent }}
                  >
                    S
                  </div>
                </div>
                <div className="flex flex-1 items-end justify-center gap-3 min-w-0 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {allowedModules.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => handleModuleClick(id)}
                      className={`
                        group flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-200 flex-shrink-0
                        ${
                          activeModule === id
                            ? 'text-white shadow-md'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        }
                      `}
                      style={{
                        backgroundColor: activeModule === id ? COLORS.dark : 'transparent'
                      }}
                    >
                      <Icon
                        size={desktopIconSize}
                        className={`transition-transform duration-200 ${
                          activeModule === id ? '' : 'group-hover:scale-110'
                        }`}
                      />
                      <span className="text-[11px] font-medium uppercase tracking-wide">{label}</span>
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="group flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 flex-shrink-0"
                  >
                    <LogOut
                      size={desktopIconSize}
                      className="transition-transform duration-200 group-hover:scale-110"
                    />
                    <span className="text-[11px] font-medium uppercase tracking-wide">Salir</span>
                  </button>
                </div>
                <div className={`flex items-center gap-2 text-sm font-medium flex-shrink-0 ${currentStatus.textClass}`}>
                  <span
                    className={`inline-flex h-3.5 w-3.5 rounded-full border-2 border-t-transparent animate-spin ${currentStatus.ringClass}`}
                    aria-label={currentStatus.label}
                    title={currentStatus.label}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 py-4">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div
                    className={`${desktopLogoClass} rounded-lg flex items-center justify-center text-white font-bold transition-all duration-300`}
                    style={{ backgroundColor: COLORS.accent }}
                  >
                    S
                  </div>
                  <h1 className="text-xl font-bold hidden sm:block" style={{ color: COLORS.dark }}>
                    SAVIA Gestión
                  </h1>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 text-sm font-medium ${currentStatus.textClass}`}>
                    <span
                      className={`inline-flex h-3.5 w-3.5 rounded-full border-2 border-t-transparent animate-spin ${currentStatus.ringClass}`}
                      aria-label={currentStatus.label}
                      title={currentStatus.label}
                    />
                    {showStatusTextOnIdleDesktop && <span>{currentStatus.label}</span>}
                  </div>
                  <div className="flex items-center gap-2 flex-nowrap">
                    {allowedModules.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => handleModuleClick(id)}
                        className={`
                          group relative flex items-center justify-center rounded-lg p-2.5 transition-all duration-200
                          ${
                            activeModule === id
                              ? 'text-white shadow-md transform scale-105'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }
                        `}
                        style={{
                          backgroundColor: activeModule === id ? COLORS.dark : 'transparent'
                        }}
                        title={label}
                        aria-label={label}
                      >
                        <Icon size={desktopIconSize} className="flex-shrink-0" />
                        <span className="sr-only">{label}</span>
                        <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 translate-y-0 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-150 hidden lg:block group-hover:translate-y-1 group-hover:opacity-100 group-focus:translate-y-1 group-focus:opacity-100">
                          {label}
                        </span>
                      </button>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="group relative flex items-center justify-center rounded-lg p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      title="Salir"
                      aria-label="Salir"
                    >
                      <LogOut size={desktopIconSize} className="flex-shrink-0" />
                      <span className="sr-only">Salir</span>
                      <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 translate-y-0 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-150 hidden lg:block group-hover:translate-y-1 group-hover:opacity-100 group-focus:translate-y-1 group-focus:opacity-100">
                        Salir
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between gap-3 py-3 lg:hidden">
            <div className="flex items-center gap-3 flex-shrink-0">
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
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="fixed inset-y-0 left-0 w-full max-w-xs sm:max-w-sm bg-white shadow-xl flex flex-col h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
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

            <div className="py-4 flex-1 overflow-y-auto">
              <div className={`px-4 pb-4 text-sm font-medium flex items-center gap-2 ${currentStatus.textClass}`}>
                <span className={`inline-flex h-3.5 w-3.5 rounded-full border-2 border-t-transparent animate-spin ${currentStatus.ringClass}`} />
                <span>{currentStatus.label}</span>
              </div>
              {allowedModules.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleModuleClick(id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                    ${activeModule === id ? 'text-white' : 'text-gray-700 hover:bg-gray-100'}
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
