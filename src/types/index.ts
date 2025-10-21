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

export type PaymentMethod = 'efectivo' | 'tarjeta' | 'nequi' | 'provision_caja' | 'credito_empleados';

export interface CajaPocket {
  codigo: string;
  nombre: string;
  descripcion?: string;
  metodoPago: PaymentMethod;
  esPrincipal: boolean;
  created_at?: Date;
}

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

export interface FocusDateRequest {
  dateKey: string;
  requestId: number;
  orderId?: string;
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
  paymentRegisteredAt?: Date;
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

export type DayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export const DAY_KEYS: DayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export interface DaySchedule {
  active: boolean;
  hours: number;
}

export type WeeklySchedule = Record<DayKey, DaySchedule>;

export type WeeklyHours = Record<DayKey, number>;

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
  horario_base?: WeeklySchedule | null;
}

export interface EmployeeCreditHistoryEntry {
  id: string;
  empleadoId: string;
  empleadoNombre?: string;
  orderId?: string;
  orderNumero?: number;
  monto: number;
  tipo: 'cargo' | 'abono';
  timestamp: string;
  balanceAfter?: number;
}

export interface EmployeeCreditRecord {
  empleadoId: string;
  empleadoNombre?: string;
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

export type ProvisionTransferOrigin = Extract<PaymentMethod, 'efectivo' | 'nequi' | 'tarjeta'>;

export interface ProvisionTransfer {
  id: string;
  monto: number;
  descripcion?: string;
  fecha: Date;
  origen: ProvisionTransferOrigin;
  created_at?: Date;
  bolsilloOrigen?: string;
  bolsilloDestino?: string;
  origenNombre?: string;
  destinoNombre?: string;
  destinoMetodo?: PaymentMethod;
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
  ingresosProvisionCaja?: number;
  egresosProvisionCaja?: number;
  saldoProvisionCajaDia?: number;
  saldoProvisionCajaAcumulado?: number;
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
  | 'contabilidad'
  | 'novedades'
  | 'creditoEmpleados'
  | 'analitica';

export type UserRole = 'admin' | 'employee';

export interface User {
  username: string;
  role: UserRole;
}
