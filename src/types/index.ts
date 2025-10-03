export interface MenuItem {
  id: string;
  codigo: string;
  nombre: string;
  precio: number;
  descripcion?: string;
  keywords?: string;
  categoria: string;
  stock: number;
  inventarioCategoria: 'Inventariables' | 'No inventariables';
  inventarioTipo?: 'cantidad' | 'gramos';
  unidadMedida?: 'kg' | 'g' | 'mg' | 'ml';
}

export type PaymentMethod = 'efectivo' | 'tarjeta' | 'nequi' | 'credito_empleados';

export type CreditType = 'empleados';

export interface OrderCreditInfo {
  type: CreditType;
  amount: number;
  assignedAt: Date;
  employeeId?: string;
  employeeName?: string;
}

export interface PaymentAllocation {
  metodo: PaymentMethod;
  monto: number;
  empleadoId?: string;
  empleadoNombre?: string;
}

export type PaymentStatus = 'pendiente' | 'pagado';

export type DatabaseConnectionState = 'checking' | 'online' | 'local';

export interface BowlSaladoCustomization {
  bases: string[];
  toppings: string[];
  proteina: string;
}

export interface CartItem {
  item: MenuItem;
  cantidad: number;
  notas?: string;
  customKey?: string;
  bowlCustomization?: BowlSaladoCustomization;
  precioUnitario?: number;
  studentDiscount?: boolean;
}

export interface Order {
  id: string;
  numero: number;
  items: CartItem[];
  total: number;
  estado: 'pendiente' | 'preparando' | 'listo' | 'entregado';
  timestamp: Date;
  cliente_id?: string;
  cliente?: string;
  metodoPago?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  paymentAllocations?: PaymentAllocation[];
  creditInfo?: OrderCreditInfo;
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

export interface Empleado {
  id: string;
  nombre: string;
  telefono?: string;
  email?: string;
  horas_dia: number;
  dias_semana: number;
  salario_hora: number;
  activo: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface EmployeeCreditHistoryEntry {
  id: string;
  orderId?: string;
  orderNumero?: number;
  monto: number;
  tipo: 'cargo' | 'abono';
  timestamp: string;
}

export interface EmployeeCreditRecord {
  empleadoId: string;
  total: number;
  history: EmployeeCreditHistoryEntry[];
}

export interface Gasto {
  id: string;
  descripcion: string;
  monto: number;
  categoria: string;
  fecha: Date;
  created_at?: Date;
  metodoPago?: PaymentMethod;
}

export interface BalanceResumen {
  fecha: string;
  ingresosTotales: number;
  egresosTotales: number;
  balanceDiario: number;
  ingresosEfectivo: number;
  egresosEfectivo: number;
  ingresosNequi: number;
  egresosNequi: number;
  ingresosTarjeta: number;
  egresosTarjeta: number;
  saldoEfectivoDia: number;
  saldoNequiDia: number;
  saldoTarjetaDia: number;
  saldoTotalAcumulado: number;
  saldoEfectivoAcumulado: number;
  saldoNequiAcumulado: number;
  saldoTarjetaAcumulado: number;
}

export type ModuleType =
  | 'dashboard'
  | 'balance'
  | 'caja'
  | 'comandas'
  | 'inventario'
  | 'cocina'
  | 'clientes'
  | 'empleados'
  | 'gastos'
  | 'creditoEmpleados'
  | 'analitica';

export type UserRole = 'admin' | 'employee';

export interface User {
  username: string;
  role: UserRole;
}
