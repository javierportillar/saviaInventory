export interface MenuItem {
  id: string;
  nombre: string;
  precio: number;
  descripcion?: string;
  keywords?: string;
  categoria: string;
  stock: number;
  inventarioCategoria: 'Inventariables' | 'No inventariables';
  inventarioTipo?: 'cantidad' | 'gramos';
  unidadMedida?: 'kg' | 'g' | 'mg';
}

export interface CartItem {
  item: MenuItem;
  cantidad: number;
  notas?: string;
}

export interface Order {
  id: string;
  numero: number;
  items: CartItem[];
  total: number;
  estado: 'pendiente' | 'preparando' | 'listo' | 'entregado';
  timestamp: Date;
  cliente?: string;
  metodoPago?: 'efectivo' | 'tarjeta' | 'transferencia';
}

export interface InventoryAlert {
  item: MenuItem;
  stockActual: number;
  stockMinimo: number;
}

export interface Customer {
  id: string;
  nombre: string;
  telefono: string;
}

export type ModuleType = 'dashboard' | 'caja' | 'comandas' | 'inventario' | 'cocina' | 'clientes';

export type UserRole = 'admin' | 'employee';

export interface User {
  username: string;
  role: UserRole;
}
