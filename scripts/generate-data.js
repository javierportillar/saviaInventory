// @ts-check
/**
 * Generador de datos semilla para saviaInventory
 * Produce src/data/seedData.ts con datos inventados para 2024-2026
 *
 * Los datos están optimizados para caber en localStorage (~4-5 MB minificado)
 * en lugar de generar órdenes para cada día, concentra datos en fechas
 * estratégicas para dar una buena experiencia demo en analítica.
 *
 * Uso: node scripts/generate-data.js
 */

import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, '..', 'src', 'data', 'seedData.ts');

// ─── HELPERS ─────────────────────────────────────────────────
const slugify = (v) => String(v || '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[randomInt(0, arr.length - 1)];
const pickN = (arr, n) => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
};
const toISO = (d) => d.toISOString();
const dayOfWeek = (d) => d.getDay();
const sameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

// ─── MENU ITEMS (copiado de localData.ts) ────────────────────
const ALL_MENU_ITEMS = buildMenuItems();

function buildMenuItems() {
  const sections = [
    {
      id: "sanduches", titulo: "Sandwiches",
      items: [
        { nombre: "Jamón artesano", precio: 18500, descripcion: "Salsa verde, queso doble crema, jamón de cerdo, rúgula, tomates horneados, parmesano." },
        { nombre: "Del huerto", precio: 15500, descripcion: "Mayonesa de rostizados, queso feta, rúgula, tomates horneados, champiñones, parmesano." },
        { nombre: "Pollo Green", precio: 16500, descripcion: "Mayonesa de rostizados y verde, jamón de pollo, guacamole, tomate horneado." },
        { nombre: "Pollo Toscano", precio: 18500, descripcion: "Salsa verde, Jamón de Pollo, lechuga, rúgula, champiñones, tomates horneados." },
        { nombre: "Mexicano", precio: 19000, descripcion: "Frijol refrito, pollo desmechado, pico de gallo, queso crema tajado, guacamole." },
      ]
    },
    {
      id: "bowlssalados", titulo: "Bowls Salados",
      items: [
        { nombre: "Bowl Salado", precio: 15000, descripcion: "Personaliza tu bowl: 2 bases, 4 toppings y 1 proteína. Incluye bebida." },
      ]
    },
    {
      id: "calientes", titulo: "Bebidas calientes",
      items: [
        { nombre: "Capuccino", precio: 6000 },
        { nombre: "Latte", precio: 5500 },
        { nombre: "Americano", precio: 5500 },
        { nombre: "Cocoa", precio: 6000 },
        { nombre: "Pitaya latte", precio: 8500 },
        { nombre: "Infusión de frutos rojos", precio: 6000 },
      ]
    },
    {
      id: "acompanamientos", titulo: "Acompañamientos",
      items: [
        { nombre: "Torta del día", precio: 8000 },
        { nombre: "Galletas de avena", precio: 4000 },
        { nombre: "Muffin de queso", precio: 4500 },
        { nombre: "Tapitas", precio: 10000, descripcion: "Pan acompañado de queso feta, tomate al horno y albahaca." },
      ]
    },
    {
      id: "bowlsfrutales", titulo: "Bowls Frutales",
      items: [
        { nombre: "Açaí supremo", precio: 14500 },
        { nombre: "Tropical", precio: 12000 },
        { nombre: "Vital", precio: 12000 },
      ]
    },
    {
      id: "refrescantes", titulo: "Batidos refrescantes",
      items: [
        { nombre: "Amanecer", precio: 9500 },
        { nombre: "Sandía salvaje", precio: 9500 },
        { nombre: "Piña rosa", precio: 9500 },
      ]
    },
    {
      id: "funcionales", titulo: "Batidos funcionales",
      items: [
        { nombre: "Golden milk", precio: 10500 },
        { nombre: "Digest", precio: 10500 },
        { nombre: "Antioxidante", precio: 10500 },
        { nombre: "Saciante", precio: 10500 },
        { nombre: "Detox", precio: 10500 },
      ]
    },
    {
      id: "especiales", titulo: "Batidos especiales",
      items: [
        { nombre: "Pink", precio: 12000 },
        { nombre: "Mocha energy", precio: 12000 },
        { nombre: "Matcha protein", precio: 16000 },
      ]
    },
    {
      id: "frias", titulo: "Bebidas frías",
      items: [
        { nombre: "Matcha latte helado", precio: 11000 },
        { nombre: "Blue latte helado", precio: 10500 },
        { nombre: "Limonada azul", precio: 10000 },
        { nombre: "Café Pitaya", precio: 10500 },
      ]
    },
  ];

  const inventario = [
    { id: 'inv-mango', nombre: 'Mango', categoria: 'Frutas' },
    { id: 'inv-pina', nombre: 'Piña', categoria: 'Frutas' },
    { id: 'inv-banano', nombre: 'Banano', categoria: 'Frutas' },
    { id: 'inv-fresa', nombre: 'Fresa', categoria: 'Frutas' },
    { id: 'inv-kiwi', nombre: 'Kiwi', categoria: 'Frutas' },
    { id: 'inv-sandia', nombre: 'Sandía', categoria: 'Frutas' },
    { id: 'inv-arandanos', nombre: 'Arándanos', categoria: 'Frutas' },
    { id: 'inv-acai', nombre: 'Açaí', categoria: 'Frutas' },
    { id: 'inv-pitaya', nombre: 'Pitaya', categoria: 'Frutas' },
    { id: 'inv-yogurt', nombre: 'Yogurt natural', categoria: 'Lácteos' },
    { id: 'inv-leche', nombre: 'Leche', categoria: 'Lácteos' },
    { id: 'inv-queso-feta', nombre: 'Queso feta', categoria: 'Lácteos' },
    { id: 'inv-queso-crema', nombre: 'Queso doble crema', categoria: 'Lácteos' },
    { id: 'inv-jamon-cerdo', nombre: 'Jamón de cerdo', categoria: 'Proteínas' },
    { id: 'inv-jamon-pollo', nombre: 'Jamón de pollo', categoria: 'Proteínas' },
    { id: 'inv-pollo-desmechado', nombre: 'Pollo desmechado', categoria: 'Proteínas' },
    { id: 'inv-tocineta', nombre: 'Tocineta', categoria: 'Proteínas' },
    { id: 'inv-rugula', nombre: 'Rúgula', categoria: 'Vegetales' },
    { id: 'inv-lechuga', nombre: 'Lechuga', categoria: 'Vegetales' },
    { id: 'inv-champinones', nombre: 'Champiñones', categoria: 'Vegetales' },
    { id: 'inv-tomate', nombre: 'Tomate', categoria: 'Vegetales' },
    { id: 'inv-espinaca', nombre: 'Espinaca', categoria: 'Vegetales' },
    { id: 'inv-apio', nombre: 'Apio', categoria: 'Vegetales' },
    { id: 'inv-pepino', nombre: 'Pepino', categoria: 'Vegetales' },
    { id: 'inv-chia', nombre: 'Semillas de chía', categoria: 'Semillas' },
    { id: 'inv-granola', nombre: 'Granola', categoria: 'Semillas' },
    { id: 'inv-avena', nombre: 'Avena', categoria: 'Semillas' },
    { id: 'inv-coco', nombre: 'Coco rallado', categoria: 'Semillas' },
    { id: 'inv-crema-mani', nombre: 'Crema de maní', categoria: 'Semillas' },
    { id: 'inv-curcuma', nombre: 'Cúrcuma', categoria: 'Especias' },
    { id: 'inv-jengibre', nombre: 'Jengibre', categoria: 'Especias' },
    { id: 'inv-maca', nombre: 'Maca', categoria: 'Especias' },
    { id: 'inv-miel', nombre: 'Miel', categoria: 'Especias' },
    { id: 'inv-cafe', nombre: 'Café', categoria: 'Bebidas' },
    { id: 'inv-te-matcha', nombre: 'Té matcha', categoria: 'Bebidas' },
    { id: 'inv-cacao', nombre: 'Cacao puro', categoria: 'Bebidas' },
    { id: 'inv-proteina', nombre: 'Proteína whey', categoria: 'Bebidas' },
  ];

  const items = [];
  for (const section of sections) {
    for (const [i, item] of section.items.entries()) {
      const codigo = [slugify(section.id), slugify(item.nombre)].filter(Boolean).join('-');
      items.push({
        id: `${section.id}-${i}`,
        codigo,
        nombre: item.nombre,
        precio: item.precio,
        descripcion: item.descripcion,
        categoria: section.titulo,
        stock: randomInt(10, 50),
        inventarioCategoria: 'No inventariables',
      });
    }
  }
  for (const seed of inventario) {
    items.push({
      id: seed.id,
      codigo: `inv-${slugify(seed.nombre)}`,
      nombre: seed.nombre,
      precio: 0,
      categoria: seed.categoria,
      stock: randomInt(100, 5000),
      inventarioCategoria: 'Inventariables',
      inventarioTipo: 'gramos',
      unidadMedida: 'g',
    });
  }
  return items;
}

// ─── CUSTOMERS ────────────────────────────────────────────────
const CUSTOMERS = [
  { id: 'cust-01', nombre: 'María García', telefono: '3001234567', direccion: 'Cra 15 #45-23', edad: 28 },
  { id: 'cust-02', nombre: 'Carlos López', telefono: '3107654321', direccion: 'Cll 72 #20-15', edad: 35 },
  { id: 'cust-03', nombre: 'Ana Martínez', telefono: '3209876543', direccion: 'Av 68 #30-10', edad: 42 },
  { id: 'cust-04', nombre: 'Pedro Sánchez', telefono: '3012345678', direccion: 'Cra 7 #80-50', edad: 31 },
  { id: 'cust-05', nombre: 'Laura Rodríguez', telefono: '3158765432', direccion: 'Cll 100 #15-30', edad: 25 },
  { id: 'cust-06', nombre: 'Diego Ramírez', telefono: '3176543210', direccion: 'Av Cra 30 #55-12', edad: 39 },
  { id: 'cust-07', nombre: 'Valentina Ortiz', telefono: '3223456789', direccion: 'Cra 50 #70-25', edad: 22 },
  { id: 'cust-08', nombre: 'Andrés Morales', telefono: '3110987654', direccion: 'Cll 26 #10-40', edad: 45 },
  { id: 'cust-09', nombre: 'Camila Vargas', telefono: '3045678901', direccion: 'Av 19 #85-60', edad: 33 },
  { id: 'cust-10', nombre: 'Felipe Castillo', telefono: '3190123456', direccion: 'Cra 45 #60-18', edad: 29 },
  { id: 'cust-11', nombre: 'Sofía Jiménez', telefono: '3023456789', direccion: 'Cll 34 #22-08', edad: 27 },
  { id: 'cust-12', nombre: 'Javier Torres', telefono: '3134567890', direccion: 'Av Suba #120-45', edad: 38 },
  { id: 'cust-13', nombre: 'Daniela Rojas', telefono: '3215678901', direccion: 'Cra 11 #93-70', edad: 24 },
  { id: 'cust-14', nombre: 'Miguel Herrera', telefono: '3056789012', direccion: 'Cll 53 #27-15', edad: 41 },
  { id: 'cust-15', nombre: 'Carolina Méndez', telefono: '3167890123', direccion: 'Av 1ro de Mayo #40-22', edad: 36 },
  { id: 'cust-16', nombre: 'Sebastián Navarro', telefono: '3238901234', direccion: 'Cra 27 #38-50', edad: 26 },
  { id: 'cust-17', nombre: 'Isabella Pardo', telefono: '3129012345', direccion: 'Cll 6 #5-33', edad: 30 },
  { id: 'cust-18', nombre: 'Ricardo Gutiérrez', telefono: '3180123456', direccion: 'Av Boyacá #55-12', edad: 44 },
  { id: 'cust-19', nombre: 'Gabriela Ríos', telefono: '3014567890', direccion: 'Cra 19 #90-28', edad: 23 },
  { id: 'cust-20', nombre: 'Oscar Medina', telefono: '3145678902', direccion: 'Cll 80 #12-65', edad: 37 },
];

// ─── EMPLOYEES ────────────────────────────────────────────────
const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const EMPLEADOS = [
  { id: 'emp-01', nombre: 'Luis Fernando Pérez', telefono: '3011112233', tipo_contrato: 'salario_fijo', horas_dia: 8, dias_semana: 6, salario_mensual: 1750905, activo: true },
  { id: 'emp-02', nombre: 'María Elena Gómez', telefono: '3102223344', tipo_contrato: 'por_horas', horas_dia: 6, dias_semana: 5, salario_hora: 12000, salario_mensual: 0, activo: true },
  { id: 'emp-03', nombre: 'Jorge Arturo Rincón', telefono: '3203334455', tipo_contrato: 'por_horas', horas_dia: 8, dias_semana: 6, salario_hora: 11000, salario_mensual: 0, activo: true },
  { id: 'emp-04', nombre: 'Diana Patricia Vega', telefono: '3154445566', tipo_contrato: 'salario_fijo', horas_dia: 8, dias_semana: 5, salario_mensual: 1750905, activo: true },
  { id: 'emp-05', nombre: 'Carlos Andrés Mora', telefono: '3175556677', tipo_contrato: 'por_horas', horas_dia: 4, dias_semana: 3, salario_hora: 13000, salario_mensual: 0, activo: false },
  { id: 'emp-06', nombre: 'Angela Patricia Rojas', telefono: '3226667788', tipo_contrato: 'salario_fijo', horas_dia: 8, dias_semana: 6, salario_mensual: 1950000, activo: true },
].map(e => {
  const schedule = {};
  for (let d = 0; d < 7; d++) {
    schedule[DAY_KEYS[d]] = { active: d < e.dias_semana, hours: d < e.dias_semana ? e.horas_dia : 0 };
  }
  return { ...e, incluye_auxilio_transporte: true, horario_base: schedule };
});

// ─── CAJA BOLSILLOS ──────────────────────────────────────────
const CAJA_BOLSILLOS = [
  { codigo: 'efectivo-principal', nombre: 'Caja principal', metodoPago: 'efectivo', esPrincipal: true },
  { codigo: 'nequi-principal', nombre: 'Nequi Savia', metodoPago: 'nequi', esPrincipal: true },
  { codigo: 'tarjeta-principal', nombre: 'Datafono', metodoPago: 'tarjeta', esPrincipal: true },
  { codigo: 'provision-caja', nombre: 'Provision Caja', metodoPago: 'provision_caja', esPrincipal: false },
];

// ─── ORDER GENERATION ────────────────────────────────────────

const mainDishes = ALL_MENU_ITEMS.filter(i => i.categoria === 'Sandwiches' || i.categoria === 'Bowls Salados' || i.categoria === 'Bowls Frutales');
const drinks = ALL_MENU_ITEMS.filter(i => i.categoria.includes('Bebidas') || i.categoria.includes('Batidos'));
const sides = ALL_MENU_ITEMS.filter(i => i.categoria === 'Acompañamientos');

const generateOrderItems = () => {
  const count = randomInt(1, 5);
  const items = [];
  const main = pick(mainDishes);
  items.push({ item: main, cantidad: main.categoria === 'Bowls Salados' || main.categoria === 'Bowls Frutales' ? 1 : randomInt(1, 2) });
  if (count >= 2 && Math.random() < 0.7) items.push({ item: pick(drinks), cantidad: randomInt(1, 2) });
  if (count >= 3 && Math.random() < 0.4) items.push({ item: pick(sides), cantidad: randomInt(1, 2) });
  if (count >= 4 && Math.random() < 0.3) items.push({ item: pick([...mainDishes, ...drinks]), cantidad: 1 });
  if (count >= 5 && Math.random() < 0.5) items.push({ item: pick(sides), cantidad: 1 });
  return items;
};

const calculateTotal = (items) => items.reduce((sum, ci) => sum + (ci.item.precio * ci.cantidad), 0);

const generatePaymentAllocations = (total, methodType) => {
  if (methodType === 'efectivo') return [{ metodo: 'efectivo', monto: Math.ceil(total / 1000) * 1000 }];
  if (methodType === 'tarjeta') return [{ metodo: 'tarjeta', monto: total }];
  if (methodType === 'nequi') return [{ metodo: 'nequi', monto: total }];
  if (methodType === 'credito_empleados') {
    const emp = pick(EMPLEADOS.filter(e => e.activo));
    return [{ metodo: 'credito_empleados', monto: total, empleadoId: emp.id, empleadoNombre: emp.nombre }];
  }
  if (methodType === 'split') {
    const efectivoPortion = Math.round(total * randomFloat(0.3, 0.7) / 1000) * 1000;
    const tarjetaPortion = total - efectivoPortion;
    const allocs = [{ metodo: 'efectivo', monto: efectivoPortion }];
    if (tarjetaPortion > 0) allocs.push({ metodo: 'tarjeta', monto: tarjetaPortion });
    return allocs;
  }
  return [{ metodo: 'efectivo', monto: total }];
};

const CREDIT_EMPLOYEE_IDS = ['emp-01', 'emp-03', 'emp-06'];

// Generar órdenes para un día específico
function generateOrdersForDay(date) {
  const dow = dayOfWeek(date);
  let numOrders;
  if (dow === 0) numOrders = Math.random() < 0.3 ? randomInt(2, 5) : 0;
  else if (dow === 6) numOrders = randomInt(6, 14);
  else if (dow === 5) numOrders = randomInt(6, 12);
  else numOrders = randomInt(4, 10);

  const orders = [];
  for (let i = 0; i < numOrders; i++) {
    const items = generateOrderItems();
    const total = calculateTotal(items);
    const methodRoll = Math.random() * 100;
    let methodType;
    if (methodRoll < 45) methodType = 'efectivo';
    else if (methodRoll < 70) methodType = 'tarjeta';
    else if (methodRoll < 85) methodType = 'nequi';
    else if (methodRoll < 92) methodType = 'split';
    else methodType = 'credito_empleados';

    const allocations = generatePaymentAllocations(total, methodType);

    const statusRand = Math.random();
    let estado, paymentStatus, paymentRegisteredAt;
    if (statusRand < 0.82) {
      estado = 'entregado';
      paymentStatus = 'pagado';
      paymentRegisteredAt = new Date(date);
      paymentRegisteredAt.setHours(randomInt(7, 21), randomInt(0, 59));
    } else if (statusRand < 0.88) {
      estado = 'cancelado';
      paymentStatus = 'pendiente';
    } else if (statusRand < 0.94) {
      estado = 'preparando';
      paymentStatus = 'pendiente';
    } else {
      estado = 'listo';
      paymentStatus = 'pagado';
      paymentRegisteredAt = new Date(date);
      paymentRegisteredAt.setHours(randomInt(7, 21), randomInt(0, 59));
    }

    const orderTime = new Date(date);
    orderTime.setHours(randomInt(8, 21), randomInt(0, 59));

    const customer = Math.random() < 0.4 ? pick(CUSTOMERS) : null;
    const order = {
      id: `ord-${0}`, // placeholder, will be set later
      numero: 0, // placeholder
      items,
      total,
      estado,
      timestamp: orderTime,
      paymentAllocations: allocations,
      paymentStatus,
      paymentRegisteredAt: paymentRegisteredAt || undefined,
    };
    if (customer) {
      order.cliente_id = customer.id;
      order.cliente = customer.nombre;
    }
    if (methodType === 'credito_empleados') {
      const creditAlloc = allocations.find(a => a.metodo === 'credito_empleados');
      if (creditAlloc?.empleadoId) {
        order.creditInfo = {
          type: 'empleados',
          amount: creditAlloc.monto,
          assignedAt: orderTime,
          employeeId: creditAlloc.empleadoId,
          employeeName: creditAlloc.empleadoNombre,
        };
      }
    }
    orders.push(order);
  }
  return orders;
}

// Generar todas las órdenes — fechas estratégicas para demo
function generateAllOrders() {
  const allOrders = [];
  let orderNum = 0;

  // Para cada mes, generar órdenes en fechas específicas
  for (let year = 2024; year <= 2026; year++) {
    const startMonth = year === 2024 ? 0 : 0; // January
    const endMonth = year === 2026 ? 5 : 11; // May for 2026, December otherwise

    for (let month = startMonth; month <= endMonth; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      // Determinar cuántos días generar este mes
      let daysToGenerate;
      if (year === 2024) {
        // Early 2024: sparse (5-8 days), late 2024: more (8-12 days)
        daysToGenerate = month < 6 ? randomInt(5, 8) : randomInt(8, 12);
      } else if (year === 2025) {
        daysToGenerate = randomInt(10, 15);
      } else {
        // 2026: denso para que se vea bien en analítica
        daysToGenerate = randomInt(12, 18);
      }

      // Seleccionar días aleatorios del mes
      const days = new Set();
      for (let attempt = 0; attempt < daysToGenerate * 3 && days.size < daysToGenerate; attempt++) {
        days.add(randomInt(1, daysInMonth));
      }

      for (const day of days) {
        const date = new Date(year, month, day);
        // Skip Sundays with some probability (less activity)
        if (dayOfWeek(date) === 0 && Math.random() < 0.6) continue;
        const dayOrders = generateOrdersForDay(date);
        for (const order of dayOrders) {
          orderNum++;
          order.id = `ord-${orderNum}`;
          order.numero = orderNum;
        }
        allOrders.push(...dayOrders);
      }
    }
  }

  // Generate daily orders for the last 14 days so dashboard and "Últimos 7 días" show data
  const today = new Date();
  for (let daysAgo = 0; daysAgo <= 14; daysAgo++) {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    if (dayOfWeek(d) === 0) continue;
    const recentOrders = generateOrdersForDay(d);
    for (const order of recentOrders) {
      orderNum++;
      order.id = `ord-${orderNum}`;
      order.numero = orderNum;
    }
    allOrders.push(...recentOrders);
  }

  return allOrders;
}

console.log('Generando órdenes demo...');
const ALL_ORDERS = generateAllOrders();
console.log(`  → ${ALL_ORDERS.length} órdenes generadas`);

// ─── ORDER METADATA ──────────────────────────────────────────
const ORDER_METADATA = {};
for (const order of ALL_ORDERS) {
  const entry = {};
  if (order.paymentStatus) entry.paymentStatus = order.paymentStatus;
  if (order.paymentAllocations?.length) entry.paymentAllocations = order.paymentAllocations;
  if (order.paymentRegisteredAt) entry.paymentRegisteredAt = order.paymentRegisteredAt.toISOString();
  if (order.creditInfo) {
    entry.credit = {
      type: 'empleados',
      amount: Math.round(order.creditInfo.amount),
      assignedAt: order.creditInfo.assignedAt.toISOString(),
      employeeId: order.creditInfo.employeeId,
      employeeName: order.creditInfo.employeeName,
    };
  }
  ORDER_METADATA[order.id] = entry;
}

// ─── EMPLOYEE CREDIT HISTORY ────────────────────────────────
const EMPLOYEE_CREDIT_HISTORY = [];
for (const employeeId of CREDIT_EMPLOYEE_IDS) {
  const emp = EMPLEADOS.find(e => e.id === employeeId);
  const empName = emp?.nombre || '';
  const creditOrders = ALL_ORDERS.filter(o => o.creditInfo?.employeeId === employeeId);
  for (const order of creditOrders) {
    if (order.creditInfo) {
      EMPLOYEE_CREDIT_HISTORY.push({
        id: `cred-${order.id}`,
        empleadoId: employeeId,
        empleadoNombre: empName,
        orderId: order.id,
        orderNumero: order.numero,
        monto: Math.round(order.creditInfo.amount),
        tipo: 'cargo',
        timestamp: order.timestamp.toISOString(),
      });
    }
  }
  // Add abonos
  const totalCredit = creditOrders.reduce((sum, o) => sum + Math.round(o.creditInfo?.amount || 0), 0);
  if (totalCredit > 0) {
    let abonoAmount;
    if (employeeId === 'emp-01') abonoAmount = Math.round(totalCredit * randomFloat(0.7, 0.9));
    else if (employeeId === 'emp-03') abonoAmount = Math.round(totalCredit * randomFloat(0.4, 0.6));
    else abonoAmount = 0;
    if (abonoAmount > 0) {
      EMPLOYEE_CREDIT_HISTORY.push({
        id: `abono-${employeeId}-liquidacion`,
        empleadoId: employeeId,
        empleadoNombre: empName,
        monto: abonoAmount,
        tipo: 'abono',
        timestamp: new Date('2026-03-15T10:00:00').toISOString(),
      });
    }
  }
}
console.log(`  → ${EMPLOYEE_CREDIT_HISTORY.length} movimientos de crédito`);

// ─── GASTOS ──────────────────────────────────────────────────
const GASTO_CATEGORIES = ['Insumos', 'Servicios', 'Aseo', 'Empaque', 'Transporte', 'Mantenimiento', 'Otros'];
const GASTO_DESCS = {
  Insumos: ['Compra de frutas', 'Compra de lácteos', 'Compra de proteínas', 'Compra de vegetales', 'Compra de semillas', 'Compra de café'],
  Servicios: ['Recibo de luz', 'Recibo de agua', 'Internet', 'Arriendo local'],
  Aseo: ['Jabón líquido', 'Desinfectante', 'Papel higiénico', 'Servilletas'],
  Empaque: ['Empaque para llevar', 'Bolsas', 'Vasos térmicos'],
  Transporte: ['Domicilio proveedor', 'Transporte insumos'],
  Mantenimiento: ['Mantenimiento licuadora', 'Mantenimiento cafetera', 'Cambio de filtro'],
  Otros: ['Mercadeo', 'Decoración', 'Gastos varios'],
};

const GASTOS = [];
let gastoId = 0;

// Generate monthly gastos
for (let year = 2024; year <= 2026; year++) {
  const endMonth = year === 2026 ? 5 : 11;
  for (let month = 0; month <= endMonth; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // 1-3 insumos gastos
    const numInsumos = randomInt(1, 3);
    for (let i = 0; i < numInsumos; i++) {
      gastoId++;
      const day = randomInt(1, daysInMonth);
      const invItem = pick(ALL_MENU_ITEMS.filter(it => it.inventarioCategoria === 'Inventariables'));
      GASTOS.push({
        id: `gasto-${gastoId}`,
        descripcion: pick(GASTO_DESCS['Insumos']),
        monto: randomInt(50000, 350000),
        categoria: 'Insumos',
        fecha: new Date(year, month, day, randomInt(8, 12)),
        metodoPago: pick(['efectivo', 'nequi', 'tarjeta']),
        esInventariable: true,
        menuItemId: invItem.id,
        cantidadInventario: randomInt(1000, 5000),
        inventarioTipo: 'gramos',
        unidadInventario: 'g',
        lugarCompra: pick(['Corabastos', 'Mercado local', 'Carulla', 'Proveedor directo']),
      });
    }
    // 1 other expense
    const otherCat = pick(GASTO_CATEGORIES.filter(c => c !== 'Insumos'));
    gastoId++;
    GASTOS.push({
      id: `gasto-${gastoId}`,
      descripcion: pick(GASTO_DESCS[otherCat] || ['Gasto general']),
      monto: randomInt(20000, 200000),
      categoria: otherCat,
      fecha: new Date(year, month, randomInt(1, daysInMonth), randomInt(8, 17)),
      metodoPago: pick(['efectivo', 'nequi', 'tarjeta']),
      esInventariable: false,
    });
  }
}
console.log(`  → ${GASTOS.length} gastos generados`);

// ─── GASTO INVENTARIO ITEMS ─────────────────────────────────
const GASTO_INVENTARIO_ITEMS = {};
for (const gasto of GASTOS.filter(g => g.esInventariable && g.menuItemId)) {
  const invItem = ALL_MENU_ITEMS.find(i => i.id === gasto.menuItemId);
  if (!invItem) continue;
  GASTO_INVENTARIO_ITEMS[gasto.id] = [{
    menuItemId: invItem.id,
    nombre: invItem.nombre,
    cantidad: gasto.cantidadInventario || randomInt(500, 5000),
    inventarioTipo: 'cantidad',
    unidadInventario: 'g',
    precioUnitario: Math.round((gasto.monto || 0) / (gasto.cantidadInventario || 1000)),
  }];
}

// ─── INVENTORY PRICE HISTORY ─────────────────────────────────
const INVENTORY_PRICE_HISTORY = [];
let iphId = 0;
const invItems = ALL_MENU_ITEMS.filter(i => i.inventarioCategoria === 'Inventariables');
for (const item of invItems) {
  const basePrice = randomInt(2000, 25000);
  for (let q = 0; q < 10; q++) {
    iphId++;
    const quarterMonth = q * 3;
    const y = 2024 + Math.floor(quarterMonth / 12);
    const m = quarterMonth % 12;
    const price = Math.round(basePrice * randomFloat(0.8, 1.2));
    INVENTORY_PRICE_HISTORY.push({
      id: `iph-${iphId}`,
      menuItemId: item.id,
      cantidad: randomInt(1000, 10000),
      unidadTipo: 'peso',
      unidad: 'g',
      precioTotal: price,
      precioUnitario: Math.round(price / (item.stock || 100)),
      lugarCompra: pick(['Corabastos', 'Mercado local', 'Carulla', 'Proveedor']),
      menuItemNombre: item.nombre,
      createdAt: new Date(y, m, randomInt(1, 28)).toISOString(),
    });
  }
}

// ─── PROVISION TRANSFERS ─────────────────────────────────────
const PROVISION_TRANSFERS = [];
let transId = 0;
// Generate ~20 transfers spread across the period
for (let i = 0; i < 20; i++) {
  transId++;
  const year = pick([2024, 2024, 2025, 2025, 2026]);
  const month = randomInt(0, year === 2026 ? 5 : 11);
  const day = randomInt(1, 28);
  PROVISION_TRANSFERS.push({
    id: `trans-${transId}`,
    monto: randomInt(100000, 800000),
    descripcion: pick(['Traslado a provisión', 'Abastecimiento caja', 'Retiro Nequi', 'Provision quincenal']),
    fecha: new Date(year, month, day, randomInt(9, 18)),
    origen: pick(['efectivo', 'nequi']),
    bolsilloOrigen: pick(['efectivo-principal', 'nequi-principal']),
    bolsilloDestino: 'provision-caja',
    destinoMetodo: 'provision_caja',
  });
}

// ─── AI STRATEGIES ───────────────────────────────────────────
const AI_STRATEGIES = [
  {
    id: 'strat-001',
    createdAt: '2026-05-20T14:30:00.000Z',
    analysisStartDate: '2026-05-01',
    analysisEndDate: '2026-05-15',
    applyStartDate: '2026-05-21',
    applyEndDate: '2026-06-04',
    model: 'gemini-2.0-flash-001',
    orderCount: 0,
    totalSales: 0,
    content: `## Estrategias para aumentar ventas en horas de la tarde

Basado en el análisis de ventas de las últimas dos semanas, identificamos que las horas entre 2:00 PM y 5:00 PM tienen un flujo reducido de clientes. Para mejorar este período, proponemos:

### 1. Happy Hour de Batidos (3:00 PM - 5:00 PM)
- Descuento del 15% en batidos funcionales (Golden milk, Digest, Antioxidante)
- Precio promocional: $8,900 en lugar de $10,500
- Beneficio esperado: Aumentar ticket promedio en horas bajas

### 2. Combo Merienda
- Bowl pequeño + bebida caliente por $12,000
- Ideal para clientes que buscan algo ligero entre comidas

### 3. Programa de Fidelización
- Tarjeta digital: cada 10 compras, una bebida gratis
- Implementación con código QR en el tiquete de compra

### Resultados esperados
- Incremento del 20% en ventas de la tarde
- Mayor rotación de productos de menor movimiento
- Fidelización de clientes recurrentes`,
  },
  {
    id: 'strat-002',
    createdAt: '2026-04-10T10:00:00.000Z',
    analysisStartDate: '2026-03-15',
    analysisEndDate: '2026-04-05',
    applyStartDate: '2026-04-12',
    applyEndDate: '2026-05-12',
    model: 'gemini-2.0-flash-001',
    orderCount: 0,
    totalSales: 0,
    content: `## Estrategia para aumentar ticket promedio

### Diagnóstico
El ticket promedio actual de $28,500 puede incrementarse mediante ventas cruzadas y combos inteligentes.

### Estrategias

#### 1. Upgrade de Bowl a Combo
- Al comprar un bowl salado, ofrecer bebida + acompañamiento por $4,500 adicionales
- Incremento del ticket en un 25%

#### 2. Sandwich + Postre
- Combinar cualquier sándwich con torta del día o muffin por $3,000 adicionales
- Promoción visible en el punto de venta y redes sociales

#### 3. Descuento por volumen
- 10% de descuento en pedidos superiores a $50,000
- Incentivar pedidos compartidos entre compañeros de trabajo u oficina

### Proyección
- Aumento del ticket promedio a $35,000 (22% de mejora)
- Incremento estimado en ingresos mensuales: 15-18%`,
  },
  {
    id: 'strat-003',
    createdAt: '2026-03-01T09:00:00.000Z',
    analysisStartDate: '2026-02-01',
    analysisEndDate: '2026-02-25',
    applyStartDate: '2026-03-05',
    applyEndDate: '2026-04-05',
    model: 'gemini-2.0-flash-001',
    orderCount: 0,
    totalSales: 0,
    content: `## Estrategia de lanzamiento: Bowl Frutal de temporada

### Contexto
Marzo trae frutas de temporada con excelente calidad y precio. Proponemos una edición limitada.

### Estrategia

#### 1. Bowl Frutal "Primavera"
- Base: mango, maracuyá, banano
- Toppings: kiwi, fresas, granola, coco, chía
- Precio lanzamiento: $13,500 (vs $14,500 del Açaí supremo)
- Decoración especial con flores comestibles

#### 2. Campaña de expectativa en redes
- 3 días antes: historias mostrando "algo nuevo se prepara"
- Día 1: video del proceso de creación
- Día 2: testimonio de clientes
- Sorteo: 5 bowls gratis por compartir la publicación

### Métricas objetivo
- 30 bowls vendidos por día durante la primera semana
- 50 nuevos seguidores en Instagram
- 15% de incremento en ventas de bowls frutales`,
  },
  {
    id: 'strat-004',
    createdAt: '2026-02-15T11:00:00.000Z',
    analysisStartDate: '2026-01-20',
    analysisEndDate: '2026-02-10',
    applyStartDate: '2026-02-18',
    applyEndDate: '2026-03-18',
    model: 'gemini-2.0-flash-001',
    orderCount: 0,
    totalSales: 0,
    content: `## Estrategia de retención de clientes

### Análisis
Identificamos que el 40% de los clientes no regresan después de su primera visita. Para mejorar la retención, proponemos:

### Estrategias

#### 1. "Savia Pass" - Tarjeta de fidelización digital
- Cada compra acumula puntos
- 1 punto por cada $1,000 gastados
- 100 puntos = $10,000 de descuento
- Registro sencillo con nombre y teléfono

#### 2. Cumpleaños Savia
- Descuento del 20% en la semana del cumpleaños
- Bowl pequeño de cortesía

#### 3. Programa de referidos
- Trae a un amigo y ambos reciben 10% de descuento
- El amigo recibe bienvenida con café de cortesía

### Medición
- Tasa de retención actual: 60%
- Meta: 75% en 3 meses
- Clientes registrados en Savia Pass: 200 en primer mes`,
  },
  {
    id: 'strat-005',
    createdAt: '2026-06-01T08:30:00.000Z',
    analysisStartDate: '2026-05-15',
    analysisEndDate: '2026-05-30',
    applyStartDate: '2026-06-05',
    applyEndDate: '2026-07-05',
    model: 'gemini-2.0-flash-001',
    orderCount: 0,
    totalSales: 0,
    content: `## Estrategia para temporada de verano

### Contexto
Junio trae temperaturas más altas. Es el momento ideal para impulsar bebidas frías y bowls frutales.

### Estrategias

#### 1. Línea "Verano Savia"
- Nuevos batidos refrescantes: Coco Limón, Maracuyá Menta
- Bowls frutales con hidratación: agua de coco en la base
- Precios promocionales: $8,500 batidos, $11,000 bowls frutales

#### 2. Combos de hidratación
- Batido + botella de agua natural: $12,000
- Bowl frutal + limonada: $18,000

#### 3. Presencia en eventos
- Stand en eventos deportivos locales
- Muestra gratis de batidos en parques cercanos los sábados
- Alianza con gimnasios de la zona

### KPI's
- Incremento del 30% en ventas de batidos
- 100 nuevos clientes en el mes
- Posicionar Savia como opción saludable para el verano`,
  },
];

console.log(`  → ${AI_STRATEGIES.length} estrategias IA generadas`);

// ─── NEXT ORDER NUMBER ──────────────────────────────────────
const NEXT_ORDER_NUMBER = ALL_ORDERS.length > 0
  ? Math.max(...ALL_ORDERS.map(o => o.numero)) + 1
  : 1;

// ─── OTHER SEED DATA ────────────────────────────────────────
const HORARIOS_BASE = {};
for (const emp of EMPLEADOS) {
  if (emp.horario_base) HORARIOS_BASE[emp.id] = emp.horario_base;
}

const HORARIOS_SEMANALES = {};
for (const emp of EMPLEADOS.filter(e => e.activo)) {
  const records = {};
  for (let w = 0; w < 10; w++) {
    const baseDate = new Date(2025, 0, 6 + w * 7);
    const weekKey = `${baseDate.getFullYear()}-W${String(w + 1).padStart(2, '0')}`;
    const dayHours = {};
    for (const dayKey of DAY_KEYS) {
      dayHours[dayKey] = emp.horario_base?.[dayKey]?.active
        ? (emp.horario_base[dayKey].hours + (Math.random() < 0.3 ? randomInt(-1, 1) : 0))
        : 0;
    }
    records[weekKey] = dayHours;
  }
  HORARIOS_SEMANALES[emp.id] = records;
}

// ─── SERIALIZE ────────────────────────────────────────────────
const serialize = (data) => {
  return JSON.stringify(data, (key, value) => {
    if (value instanceof Date) return value.toISOString();
    return value;
  }, 1);
};

// ─── BUILD OUTPUT FILE ──────────────────────────────────────
const buildFile = () => {
  const lines = [
    `// Auto-generated by scripts/generate-data.js`,
    `// DO NOT EDIT — Regenerate with: node scripts/generate-data.js`,
    `// Generated: ${new Date().toISOString()}`,
    `// Contains ${ALL_ORDERS.length} orders, ${CUSTOMERS.length} customers, ${EMPLEADOS.length} employees, ${GASTOS.length} gastos, ${AI_STRATEGIES.length} AI strategies`,
    ``,
    `import type { MenuItem, Order, Customer, Empleado, CajaPocket, Gasto, ProvisionTransfer, InventoryPriceHistoryEntry, EmployeeCreditHistoryEntry, WeeklySchedule, MarketingStrategyRecord } from '../types';`,
    ``,
    `export const SEED_MENU_ITEMS: MenuItem[] = ${serialize(ALL_MENU_ITEMS)};`,
    ``,
    `export const SEED_CUSTOMERS: Customer[] = ${serialize(CUSTOMERS)};`,
    ``,
    `export const SEED_EMPLEADOS: Empleado[] = ${serialize(EMPLEADOS)};`,
    ``,
    `export const SEED_CAJA_BOLSILLOS: CajaPocket[] = ${serialize(CAJA_BOLSILLOS)};`,
    ``,
    `export const SEED_HORARIOS_BASE: Record<string, WeeklySchedule> = ${serialize(HORARIOS_BASE)};`,
    ``,
    `export const SEED_HORARIOS_SEMANALES: Record<string, Record<string, Record<string, number>>> = ${serialize(HORARIOS_SEMANALES)};`,
    ``,
    `export const SEED_NEXT_ORDER_NUMBER: number = ${NEXT_ORDER_NUMBER};`,
    ``,
    `export const SEED_ORDERS: Order[] = ${serialize(ALL_ORDERS)};`,
    ``,
    `export const SEED_ORDER_METADATA: Record<string, any> = ${serialize(ORDER_METADATA)};`,
    ``,
    `export const SEED_GASTOS: Gasto[] = ${serialize(GASTOS)};`,
    ``,
    `export const SEED_GASTO_INVENTARIO_ITEMS: Record<string, any[]> = ${serialize(GASTO_INVENTARIO_ITEMS)};`,
    ``,
    `export const SEED_PROVISION_TRANSFERS: ProvisionTransfer[] = ${serialize(PROVISION_TRANSFERS)};`,
    ``,
    `export const SEED_INVENTORY_PRICE_HISTORY: InventoryPriceHistoryEntry[] = ${serialize(INVENTORY_PRICE_HISTORY)};`,
    ``,
    `export const SEED_EMPLOYEE_CREDIT_HISTORY: EmployeeCreditHistoryEntry[] = ${serialize(EMPLOYEE_CREDIT_HISTORY)};`,
    ``,
    `export const SEED_AI_STRATEGIES: MarketingStrategyRecord[] = ${serialize(AI_STRATEGIES)};`,
    ``,
  ];
  return lines.join('\n');
};

// ─── WRITE OUTPUT ────────────────────────────────────────────
console.log('Generando archivo seedData.ts...');
const content = buildFile();
writeFileSync(OUTPUT, content, 'utf-8');
const sizeMB = (Buffer.byteLength(content, 'utf-8') / 1024 / 1024);
console.log(`✓ Archivo generado: ${OUTPUT}`);
console.log(`  Tamaño: ${sizeMB.toFixed(2)} MB (minificado ~${(sizeMB * 0.75).toFixed(2)} MB)`);
console.log('¡Listo!');
