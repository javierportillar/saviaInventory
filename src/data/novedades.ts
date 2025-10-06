export type NovedadCategoria = 'gastos' | 'horarios' | 'ventas';

export interface NovedadItem {
  id: string;
  fecha: string; // Formato YYYY-MM-DD
  titulo: string;
  categoria: NovedadCategoria;
  descripcion?: string;
}

export const NOVEDAD_CATEGORY_STYLES: Record<
  NovedadCategoria,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  gastos: {
    label: 'Gastos',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-400',
  },
  horarios: {
    label: 'Horarios',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-400',
  },
  ventas: {
    label: 'Ventas',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-400',
  },
};

export const novedades: NovedadItem[] = [
  {
    id: '1',
    fecha: '2024-10-06',
    titulo: 'Cancelar Arcadia',
    categoria: 'gastos',
    descripcion: 'Pago de suscripción mensual cancelado.',
  },
  {
    id: '2',
    fecha: '2024-10-06',
    titulo: 'Turno extra Ana',
    categoria: 'horarios',
    descripcion: 'Cobertura de turno matutino.',
  },
  {
    id: '3',
    fecha: '2024-10-08',
    titulo: 'Venta corporativa',
    categoria: 'ventas',
    descripcion: 'Evento para empresa Acme.',
  },
  {
    id: '4',
    fecha: '2024-10-14',
    titulo: 'Pago proveedores',
    categoria: 'gastos',
    descripcion: 'Ingredientes frescos.',
  },
  {
    id: '5',
    fecha: '2024-10-21',
    titulo: 'Capacitación baristas',
    categoria: 'horarios',
  },
  {
    id: '6',
    fecha: '2024-10-25',
    titulo: 'Lanzamiento menú otoño',
    categoria: 'ventas',
  },
];
