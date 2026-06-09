// @ts-check
/**
 * Generador de datos semilla para saviaInventory
 * Produce src/data/seedData.ts con datos inventados para 2024-2026
 *
 * Uso: node scripts/generate-data.js
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── CONFIGURACIÓN ───────────────────────────────────────────
const START_DATE = '2024-01-01';
const END_DATE = '2026-06-08';
const OUTPUT = resolve(__dirname, '..', 'src', 'data', 'seedData.ts');

// ─── MENU ITEMS (copiado de localData.ts) ────────────────────
const LEFT_SECTIONS = [
  {
    id: "sanduches", titulo: "Sandwiches",
    items: [
      { nombre: "Jamón artesano", precio: 18500, descripcion: "Salsa verde, queso doble crema, jamón de cerdo, rúgula, tomates horneados, parmesano.", keywords: "jamón artesano jamón de cerdo, miel de uvilla, cebolla, tomate horneado, rúgula, queso tajado, queso parmesano, salsa verde." },
      { nombre: "Del huerto", precio: 15500, descripcion: "Mayonesa de rostizados, queso feta, rúgula, tomates horneados, champiñones, parmesano, mix de semillas, chips de arracacha.", keywords: "del huerto champiñones, mayonesa rostizada, queso feta, crocantes de arracacha, tomate horneado, semillas de calabaza, queso tajado." },
      { nombre: "Pollo Green", precio: 16500, descripcion: "Mayonesa de rostizados y verde, jamón de pollo, guacamole, tomate horneado, semillas de girasol, lechuga, tocineta.", keywords: "pollo green jamón de pollo, rúgula, champiñones, parmesano, guacamole, salsa verde, salsa rostizada, lechuga, tomate horneado, semillas." },
      { nombre: "Pollo Toscano", precio: 18500, descripcion: "Salsa verde, Jamón de Pollo, lechuga, rúgula, champiñones, tomates horneados, parmesano, queso doble crema, tocineta, miel de uvilla.", keywords: "pollo toscano jamón de pollo, lechuga, rúgula, champiñones, tomate horneado, queso tajado, queso parmesano, tocineta." },
      { nombre: "Mexicano", precio: 19000, descripcion: "Frijol refrito, pollo desmechado, pico de gallo, queso crema tajado, guacamole, sour cream, salsa brava.", keywords: "mexicano pollo desmechado, guacamole, pico de gallo, frijol refrito, salsa brava, sour cream, queso tajado." },
    ]
  },
  {
    id: "bowlssalados", titulo: "Bowls Salados", subtitulo: "26 oz",
    items: [
      { nombre: "Bowl Salado", precio: 15000, descripcion: "Personaliza tu bowl: 2 bases, 4 toppings y 1 proteína. Incluye bebida." },
    ]
  },
  {
    id: "calientes", titulo: "Bebidas calientes",
    items: [
      { nombre: "Capuccino", precio: 6000, keywords: "capuccino" },
      { nombre: "Latte", precio: 5500, keywords: "latte" },
      { nombre: "Americano", precio: 5500, keywords: "americano" },
      { nombre: "Cocoa", precio: 6000, keywords: "cocoa" },
      { nombre: "Pitaya latte", precio: 8500, keywords: "pitaya latte" },
      { nombre: "Infusión de frutos rojos", precio: 6000, keywords: "infusión frutos rojos" },
    ]
  },
  {
    id: "acompanamientos", titulo: "Acompañamientos",
    items: [
      { nombre: "Torta del día", precio: 8000, keywords: "torta del día zanahoria arándanos" },
      { nombre: "Galletas de avena", precio: 4000, keywords: "galletas de avena" },
      { nombre: "Muffin de queso", precio: 4500, keywords: "muffin de queso" },
      { nombre: "Tapitas", precio: 10000, descripcion: "Pan acompañado de queso feta, tomate al horno y albahaca." },
    ]
  },
];

const RIGHT_SECTIONS = [
  {
    id: "bowlsfrutales", titulo: "Bowls Frutales", subtitulo: "16 oz",
    items: [
      { nombre: "Açaí supremo", precio: 14500, descripcion: "Base: Açaí, fresa, banano, yogurt natural, leche o bebida vegetal. Toppings: Kiwi, fresa, banano, coco, arándanos, semillas, crema de maní." },
      { nombre: "Tropical", precio: 12000, descripcion: "Base: Mango, piña, banano, yogurt natural, leche o bebida vegetal. Toppings: Kiwi, mango, granola, semillas de girasol, coco." },
      { nombre: "Vital", precio: 12000, descripcion: "Base: Mango, banano, piña, espinaca, yogurt natural, leche o bebida vegetal. Toppings: Kiwi, arándano, granola, chía latte, coco." },
    ]
  },
  {
    id: "refrescantes", titulo: "Batidos refrescantes",
    items: [
      { nombre: "Amanecer", precio: 9500, descripcion: "Mango, piña, menta, semillas de chía." },
      { nombre: "Sandía salvaje", precio: 9500, descripcion: "Sandía, fresa, hierbabuena, limón, kiwi." },
      { nombre: "Piña rosa", precio: 9500, descripcion: "Hierbabuena, pitaya rosada, piña, limón." },
    ]
  },
  {
    id: "funcionales", titulo: "Batidos funcionales",
    items: [
      { nombre: "Golden milk", precio: 10500, descripcion: "Mango, banano, yogurt natural, leche, miel, chía, cúrcuma, maca." },
      { nombre: "Digest", precio: 10500, descripcion: "Sábila, piña, kiwi, chía, naranja, miel." },
      { nombre: "Antioxidante", precio: 10500, descripcion: "Sandía, remolacha, jengibre, mora, limón, chía." },
      { nombre: "Saciante", precio: 10500, descripcion: "Arándano, fresa, banano, leche, chía, avena." },
      { nombre: "Detox", precio: 10500, descripcion: "Jengibre, apio, perejil, menta fresca, manzana verde, kiwi, pepino, naranja, miel." },
    ]
  },
  {
    id: "especiales", titulo: "Batidos especiales",
    items: [
      { nombre: "Pink", precio: 12000, descripcion: "Fresa, banano, yogurt natural, leche, chía, avena." },
      { nombre: "Mocha energy", precio: 12000, descripcion: "Banano, café frío, leche, cacao puro, crema de maní, avena." },
      { nombre: "Matcha protein", precio: 16000, descripcion: "Té matcha, scoop de proteína whey pure (30 g)." },
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

const INVENTARIABLE_SEED = [
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
const formatDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
const formatTime = (d) => {
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
};
const toISO = (d) => `${formatDate(d)}T${formatTime(d)}.000Z`;
const dayOfWeek = (d) => d.getDay(); // 0=Sun, 1=Mon, ...

// ─── BUILD MENU ITEMS ────────────────────────────────────────
const buildMenuItems = () => {
  const items = [];
  for (const section of [...LEFT_SECTIONS, ...RIGHT_SECTIONS]) {
    for (const [i, item] of section.items.entries()) {
      const codigo = [slugify(section.id), slugify(item.nombre)].filter(Boolean).join('-');
      items.push({
        id: `${section.id}-${i}`,
        codigo,
        nombre: item.nombre,
        precio: item.precio,
        descripcion: item.descripcion,
        keywords: item.keywords,
        categoria: section.titulo,
        stock: randomInt(10, 50),
        inventarioCategoria: 'No inventariables',
      });
    }
  }
  for (const seed of INVENTARIABLE_SEED) {
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
};

const ALL_MENU_ITEMS = buildMenuItems();

// ─── CUSTOMERS ────────────────────────────────────────────────
const CUSTOMER_DATA = [
  { nombre: 'María García', telefono: '3001234567', direccion: 'Cra 15 #45-23', edad: 28 },
  { nombre: 'Carlos López', telefono: '3107654321', direccion: 'Cll 72 #20-15', edad: 35 },
  { nombre: 'Ana Martínez', telefono: '3209876543', direccion: 'Av 68 #30-10', edad: 42 },
  { nombre: 'Pedro Sánchez', telefono: '3012345678', direccion: 'Cra 7 #80-50', edad: 31 },
  { nombre: 'Laura Rodríguez', telefono: '3158765432', direccion: 'Cll 100 #15-30', edad: 25 },
  { nombre: 'Diego Ramírez', telefono: '3176543210', direccion: 'Av Cra 30 #55-12', edad: 39 },
  { nombre: 'Valentina Ortiz', telefono: '3223456789', direccion: 'Cra 50 #70-25', edad: 22 },
  { nombre: 'Andrés Morales', telefono: '3110987654', direccion: 'Cll 26 #10-40', edad: 45 },
  { nombre: 'Camila Vargas', telefono: '3045678901', direccion: 'Av 19 #85-60', edad: 33 },
  { nombre: 'Felipe Castillo', telefono: '3190123456', direccion: 'Cra 45 #60-18', edad: 29 },
  { nombre: 'Sofía Jiménez', telefono: '3023456789', direccion: 'Cll 34 #22-08', edad: 27 },
  { nombre: 'Javier Torres', telefono: '3134567890', direccion: 'Av Suba #120-45', edad: 38 },
  { nombre: 'Daniela Rojas', telefono: '3215678901', direccion: 'Cra 11 #93-70', edad: 24 },
  { nombre: 'Miguel Ángel Herrera', telefono: '3056789012', direccion: 'Cll 53 #27-15', edad: 41 },
  { name: 'Carolina Méndez', telefono: '3167890123', direccion: 'Av 1ro de Mayo #40-22', edad: 36 },
  { nombre: 'Sebastián Navarro', telefono: '3238901234', direccion: 'Cra 27 #38-50', edad: 26 },
  { nombre: 'Isabella Pardo', telefono: '3129012345', direccion: 'Cll 6 #5-33', edad: 30 },
  { nombre: 'Ricardo Gutiérrez', telefono: '3180123456', direccion: 'Av Boyacá #55-12', edad: 44 },
  { nombre: 'Gabriela Ríos', telefono: '3014567890', direccion: 'Cra 19 #90-28', edad: 23 },
  { nombre: 'Oscar Medina', telefono: '3145678902', direccion: 'Cll 80 #12-65', edad: 37 },
  { nombre: 'Manuela Duque', telefono: '3206789012', direccion: 'Av Chile #25-14', edad: 21 },
  { nombre: 'Cristian Arias', telefono: '3247890123', direccion: 'Cra 60 #75-30', edad: 34 },
  { nombre: 'Paola Restrepo', telefono: '3058901234', direccion: 'Cll 42 #18-07', edad: 32 },
  { nombre: 'Fernando Suárez', telefono: '3179012345', direccion: 'Av Caracas #44-55', edad: 46 },
  { nombre: 'Liliana Franco', telefono: '3220123456', direccion: 'Cra 14 #96-12', edad: 29 },
];

const buildCustomers = () => {
  return CUSTOMER_DATA.map((c, i) => ({
    id: `cust-${String(i + 1).padStart(2, '0')}`,
    nombre: c.nombre || c.name,
    telefono: c.telefono,
    direccion: c.direccion,
    edad: c.edad,
  }));
};

const CUSTOMERS = buildCustomers();

// ─── EMPLOYEES ────────────────────────────────────────────────
const EMPLOYEE_DATA = [
  { nombre: 'Luis Fernando Pérez', telefono: '3011112233', tipo_contrato: 'salario_fijo', horas_dia: 8, dias_semana: 6, salario_mensual: 1750905, activo: true },
  { nombre: 'María Elena Gómez', telefono: '3102223344', tipo_contrato: 'por_horas', horas_dia: 6, dias_semana: 5, salario_hora: 12000, salario_mensual: 0, activo: true },
  { nombre: 'Jorge Arturo Rincón', telefono: '3203334455', tipo_contrato: 'por_horas', horas_dia: 8, dias_semana: 6, salario_hora: 11000, salario_mensual: 0, activo: true },
  { nombre: 'Diana Patricia Vega', telefono: '3154445566', tipo_contrato: 'salario_fijo', horas_dia: 8, dias_semana: 5, salario_mensual: 1750905, activo: true },
  { nombre: 'Carlos Andrés Mora', telefono: '3175556677', tipo_contrato: 'por_horas', horas_dia: 4, dias_semana: 3, salario_hora: 13000, salario_mensual: 0, activo: false },
  { nombre: 'Angela Patricia Rojas', telefono: '3226667788', tipo_contrato: 'salario_fijo', horas_dia: 8, dias_semana: 6, salario_mensual: 1950000, activo: true },
];

const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const buildEmpleados = () => {
  return EMPLOYEE_DATA.map((e, i) => {
    const schedule = {};
    const activeDays = e.dias_semana;
    for (let d = 0; d < 7; d++) {
      schedule[DAY_KEYS[d]] = { active: d < activeDays, hours: d < activeDays ? e.horas_dia : 0 };
    }
    return {
      id: `emp-${String(i + 1).padStart(2, '0')}`,
      nombre: e.nombre,
      telefono: e.telefono,
      tipo_contrato: e.tipo_contrato,
      horas_dia: e.horas_dia,
      dias_semana: e.dias_semana,
      salario_hora: e.salario_hora || 0,
      salario_mensual: e.salario_mensual || 0,
      incluye_auxilio_transporte: true,
      activo: e.activo,
      horario_base: schedule,
    };
  });
};

const EMPLEADOS = buildEmpleados();

// ─── CAJA BOLSILLOS ──────────────────────────────────────────
const buildCajaBolsillos = () => [
  { codigo: 'efectivo-principal', nombre: 'Caja principal', metodoPago: 'efectivo', esPrincipal: true },
  { codigo: 'nequi-principal', nombre: 'Nequi Savia', metodoPago: 'nequi', esPrincipal: true },
  { codigo: 'tarjeta-principal', nombre: 'Datafono', metodoPago: 'tarjeta', esPrincipal: true },
  { codigo: 'provision-caja', nombre: 'Provision Caja', metodoPago: 'provision_caja', esPrincipal: false },
];

const CAJA_BOLSILLOS = buildCajaBolsillos();

// ─── ORDER GENERATION ────────────────────────────────────────

// Categorize menu items for varied order composition
const mainDishes = ALL_MENU_ITEMS.filter(i => i.categoria === 'Sandwiches' || i.categoria === 'Bowls Salados' || i.categoria === 'Bowls Frutales');
const drinks = ALL_MENU_ITEMS.filter(i => i.categoria.includes('Bebidas') || i.categoria.includes('Batidos'));
const sides = ALL_MENU_ITEMS.filter(i => i.categoria === 'Acompañamientos');

const PAYMENT_METHODS = ['efectivo', 'tarjeta', 'nequi', 'credito_empleados', 'provision_caja'];

// Distribución de métodos de pago (pesos para selección aleatoria)
const PAYMENT_WEIGHTS = { efectivo: 45, tarjeta: 25, nequi: 15, credito_empleados: 5, split: 10 };

const pickPaymentMethod = () => {
  const r = Math.random() * 100;
  let acc = 0;
  for (const [method, weight] of Object.entries(PAYMENT_WEIGHTS)) {
    acc += weight;
    if (r < acc) return method;
  }
  return 'efectivo';
};

const generateOrderItems = () => {
  const count = randomInt(1, 5);
  const items = [];

  // Always at least one main dish
  const main = pick(mainDishes);
  const mainQty = main.categoria === 'Bowls Salados' || main.categoria === 'Bowls Frutales' ? 1 : randomInt(1, 2);
  items.push({
    item: main,
    cantidad: mainQty,
  });

  // Sometimes add a drink
  if (count >= 2 && Math.random() < 0.7) {
    const drink = pick(drinks);
    items.push({
      item: drink,
      cantidad: randomInt(1, 2),
    });
  }

  // Sometimes add sides
  if (count >= 3 && Math.random() < 0.4) {
    const side = pick(sides);
    items.push({
      item: side,
      cantidad: randomInt(1, 2),
    });
  }

  // Extra main or drink for larger orders
  if (count >= 4 && Math.random() < 0.3) {
    const extra = pick([...mainDishes, ...drinks]);
    items.push({
      item: extra,
      cantidad: 1,
    });
  }

  // 5th item
  if (count >= 5 && Math.random() < 0.5) {
    items.push({
      item: pick(sides),
      cantidad: 1,
    });
  }

  return items;
};

const calculateTotal = (items) => {
  return items.reduce((sum, cartItem) => {
    return sum + (cartItem.item.precio * cartItem.cantidad);
  }, 0);
};

const generatePaymentAllocations = (total, methodType) => {
  if (methodType === 'efectivo') {
    // Redondear a miles para simular pago en efectivo
    const roundedTotal = Math.ceil(total / 1000) * 1000;
    return [{ metodo: 'efectivo', monto: roundedTotal }];
  }
  if (methodType === 'tarjeta') {
    return [{ metodo: 'tarjeta', monto: total }];
  }
  if (methodType === 'nequi') {
    return [{ metodo: 'nequi', monto: total }];
  }
  if (methodType === 'credito_empleados') {
    const emp = pick(EMPLEADOS.filter(e => e.activo));
    return [{
      metodo: 'credito_empleados',
      monto: total,
      empleadoId: emp.id,
      empleadoNombre: emp.nombre,
    }];
  }
  if (methodType === 'split') {
    // Split between efectivo and tarjeta
    const efectivoPortion = Math.round(total * randomFloat(0.3, 0.7) / 1000) * 1000;
    const tarjetaPortion = total - efectivoPortion;
    const allocations = [{ metodo: 'efectivo', monto: efectivoPortion }];
    if (tarjetaPortion > 0) {
      allocations.push({ metodo: 'tarjeta', monto: tarjetaPortion });
    }
    return allocations;
  }
  return [{ metodo: 'efectivo', monto: total }];
};

// EMPLOYEES WITH CREDIT
const CREDIT_EMPLOYEE_IDS = ['emp-01', 'emp-03', 'emp-06'];

const generateOrdersForDay = (date, startOrderNum) => {
  const dow = dayOfWeek(date);
  let numOrders;
  if (dow === 0) { // Sunday - fewer orders or closed
    numOrders = Math.random() < 0.3 ? randomInt(2, 6) : 0;
  } else if (dow === 6) { // Saturday - busy
    numOrders = randomInt(8, 18);
  } else if (dow === 5) { // Friday - busy
    numOrders = randomInt(8, 16);
  } else { // Weekdays
    numOrders = randomInt(5, 12);
  }

  const orders = [];
  let orderNum = startOrderNum;

  for (let i = 0; i < numOrders; i++) {
    orderNum++;
    const items = generateOrderItems();
    const total = calculateTotal(items);
    const methodType = pickPaymentMethod();
    const allocations = generatePaymentAllocations(total, methodType);

    // 85% of orders are delivered, 10% in progress, 5% cancelled
    const statusRand = Math.random();
    let estado, paymentStatus, paymentRegisteredAt;
    if (statusRand < 0.85) {
      estado = 'entregado';
      paymentStatus = 'pagado';
      paymentRegisteredAt = new Date(date);
      paymentRegisteredAt.setHours(randomInt(7, 21), randomInt(0, 59));
    } else if (statusRand < 0.90) {
      estado = 'cancelado';
      paymentStatus = 'pendiente';
      paymentRegisteredAt = undefined;
    } else if (statusRand < 0.96) {
      estado = 'preparando';
      paymentStatus = 'pendiente';
      paymentRegisteredAt = undefined;
    } else {
      estado = 'listo';
      paymentStatus = 'pagado';
      paymentRegisteredAt = new Date(date);
      paymentRegisteredAt.setHours(randomInt(7, 21), randomInt(0, 59));
    }

    const orderTime = new Date(date);
    orderTime.setHours(randomInt(8, 21), randomInt(0, 59));

    const orderId = `ord-${orderNum}`;
    const customer = Math.random() < 0.4 ? pick(CUSTOMERS) : null;

    const order = {
      id: orderId,
      numero: orderNum,
      items,
      total,
      estado,
      timestamp: orderTime,
      paymentAllocations: allocations,
      paymentStatus: paymentStatus,
      paymentRegisteredAt: paymentRegisteredAt,
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

  return { orders, lastOrderNum: orderNum };
};

// ─── GENERATE ALL ORDERS ─────────────────────────────────────
const generateAllOrders = () => {
  const start = new Date(START_DATE);
  const end = new Date(END_DATE);
  const allOrders = [];
  let orderNum = 0;

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const { orders, lastOrderNum } = generateOrdersForDay(new Date(d), orderNum);
    allOrders.push(...orders);
    orderNum = lastOrderNum;
  }

  return allOrders;
};

console.log('Generando órdenes 2024-2026...');
const ALL_ORDERS = generateAllOrders();
console.log(`  → ${ALL_ORDERS.length} órdenes generadas`);

// ─── GENERATE ORDER METADATA ────────────────────────────────
const generateOrderMetadata = (orders) => {
  const metadata = {};
  for (const order of orders) {
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
    metadata[order.id] = entry;
  }
  return metadata;
};

const ORDER_METADATA = generateOrderMetadata(ALL_ORDERS);

// ─── GENERATE EMPLOYEE CREDIT HISTORY ───────────────────────
const generateEmployeeCreditHistory = (orders) => {
  const history = [];

  for (const employeeId of CREDIT_EMPLOYEE_IDS) {
    const emp = EMPLEADOS.find(e => e.id === employeeId);
    const empName = emp?.nombre || '';

    // Get orders with credit for this employee
    const creditOrders = orders.filter(o =>
      o.creditInfo?.employeeId === employeeId
    );

    for (const order of creditOrders) {
      if (order.creditInfo) {
        history.push({
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

    // Add some abonos (payments) for these employees
    const totalCredit = creditOrders.reduce((sum, o) => sum + Math.round(o.creditInfo?.amount || 0), 0);
    if (totalCredit > 0) {
      // Employee 1 pays most of their credit
      // Employee 3 pays half
      // Employee 6 pays nothing (all pending)
      let abonoAmount;
      if (employeeId === 'emp-01') abonoAmount = Math.round(totalCredit * randomFloat(0.7, 0.9));
      else if (employeeId === 'emp-03') abonoAmount = Math.round(totalCredit * randomFloat(0.4, 0.6));
      else abonoAmount = 0;

      if (abonoAmount > 0) {
        history.push({
          id: `abono-${employeeId}-liquidacion`,
          empleadoId: employeeId,
          empleadoNombre: empName,
          orderId: undefined,
          orderNumero: undefined,
          monto: abonoAmount,
          tipo: 'abono',
          timestamp: new Date('2026-03-15T10:00:00').toISOString(),
        });
      }
    }
  }

  return history;
};

const EMPLOYEE_CREDIT_HISTORY = generateEmployeeCreditHistory(ALL_ORDERS);
console.log(`  → ${EMPLOYEE_CREDIT_HISTORY.length} movimientos de crédito`);

// ─── GENERATE GASTOS ─────────────────────────────────────────
const GASTO_CATEGORIES = ['Insumos', 'Servicios', 'Aseo', 'Empaque', 'Transporte', 'Mantenimiento', 'Otros'];
const GASTO_DESCRIPTIONS = {
  Insumos: ['Compra de frutas', 'Compra de lácteos', 'Compra de proteínas', 'Compra de vegetales', 'Compra de semillas', 'Compra de café', 'Compra de leche', 'Compra de pan'],
  Servicios: ['Recibo de luz', 'Recibo de agua', 'Internet', 'Plan de datos', 'Arriendo local'],
  Aseo: ['Jabón líquido', 'Desinfectante', 'Papel higiénico', 'Servilletas', 'Limpieza general'],
  Empaque: ['Empaque para llevar', 'Bolsas', 'Vasos térmicos', 'Cubiertos desechables'],
  Transporte: ['Domicilio proveedor', 'Transporte insumos', 'Taxi'],
  Mantenimiento: ['Mantenimiento licuadora', 'Mantenimiento cafetera', 'Reparación menor', 'Cambio de filtro'],
  Otros: ['Mercadeo', 'Suscripción música', 'Decoración', 'Gastos varios'],
};

const generateGastos = (orders) => {
  const gastos = [];
  let gastoId = 0;

  // Get unique months from orders
  const months = new Set();
  for (const order of ALL_ORDERS) {
    const key = `${order.timestamp.getFullYear()}-${order.timestamp.getMonth()}`;
    months.add(key);
  }

  for (const monthKey of months) {
    const [year, month] = monthKey.split('-').map(Number);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 1-3 gastos per month for insumos
    const numInsumos = randomInt(2, 4);
    for (let i = 0; i < numInsumos; i++) {
      gastoId++;
      const day = randomInt(1, daysInMonth);
      const date = new Date(year, month, day, randomInt(8, 12));
      const categoria = 'Insumos';
      const desc = pick(GASTO_DESCRIPTIONS[categoria]);
      const invItem = pick(ALL_MENU_ITEMS.filter(it => it.inventarioCategoria === 'Inventariables'));
      gastos.push({
        id: `gasto-${gastoId}`,
        descripcion: desc,
        monto: randomInt(50000, 350000),
        categoria,
        fecha: date,
        metodoPago: pick(['efectivo', 'nequi', 'tarjeta']),
        esInventariable: true,
        menuItemId: invItem.id,
        cantidadInventario: randomInt(1000, 5000),
        inventarioTipo: 'gramos',
        unidadInventario: 'g',
        lugarCompra: pick(['Corabastos', 'Mercado local', 'Carulla', 'Éxito', 'Proveedor directo']),
      });
    }

    // 1-2 other gastos
    const numOther = randomInt(1, 2);
    for (let i = 0; i < numOther; i++) {
      gastoId++;
      const day = randomInt(1, daysInMonth);
      const date = new Date(year, month, day, randomInt(8, 17));
      const nonInsumos = GASTO_CATEGORIES.filter(c => c !== 'Insumos');
      const categoria = pick(nonInsumos);
      gastos.push({
        id: `gasto-${gastoId}`,
        descripcion: pick(GASTO_DESCRIPTIONS[categoria] || ['Gasto general']),
        monto: randomInt(20000, 200000),
        categoria,
        fecha: date,
        metodoPago: pick(['efectivo', 'nequi', 'tarjeta']),
        esInventariable: false,
      });
    }
  }

  return gastos;
};

const GASTOS = generateGastos(ALL_ORDERS);
console.log(`  → ${GASTOS.length} gastos generados`);

// ─── INVENTORY PRICE HISTORY ─────────────────────────────────
const generateInventoryPriceHistory = () => {
  const history = [];
  let id = 0;
  const invItems = ALL_MENU_ITEMS.filter(i => i.inventarioCategoria === 'Inventariables');

  // Generate quarterly price records
  for (const item of invItems) {
    const basePrice = randomInt(2000, 25000);
    for (let q = 0; q < 10; q++) { // 2024 Q1 through 2026 Q2
      id++;
      const quarterMonth = q * 3;
      const year = 2024 + Math.floor(quarterMonth / 12);
      const month = quarterMonth % 12;
      const day = randomInt(1, 28);
      const priceVariation = randomFloat(0.8, 1.2);
      const price = Math.round(basePrice * priceVariation);
      history.push({
        id: `iph-${id}`,
        menuItemId: item.id,
        cantidad: randomInt(1000, 10000),
        unidadTipo: 'peso',
        unidad: 'g',
        precioTotal: price,
        precioUnitario: Math.round(price / (item.stock || 100)),
        lugarCompra: pick(['Corabastos', 'Mercado local', 'Carulla', 'Proveedor']),
        menuItemNombre: item.nombre,
        createdAt: new Date(year, month, day).toISOString(),
      });
    }
  }
  return history;
};

const INVENTORY_PRICE_HISTORY = generateInventoryPriceHistory();

// ─── PROVISION TRANSFERS ─────────────────────────────────────
const generateProvisionTransfers = () => {
  const transfers = [];
  let id = 0;
  const months = new Set();
  for (const order of ALL_ORDERS.slice(0, ALL_ORDERS.length / 2)) { // Sample half
    const key = `${order.timestamp.getFullYear()}-${order.timestamp.getMonth()}`;
    months.add(key);
  }
  for (const monthKey of months) {
    if (Math.random() < 0.4) { // 40% of months have a transfer
      id++;
      const [year, month] = monthKey.split('-').map(Number);
      const day = randomInt(1, 28);
      transfers.push({
        id: `trans-${id}`,
        monto: randomInt(100000, 800000),
        descripcion: pick(['Traslado a provisión', 'Abastecimiento caja', 'Retiro Nequi', 'Provision quincenal']),
        fecha: new Date(year, month, day, randomInt(9, 18)),
        origen: pick(['efectivo', 'nequi']),
        bolsilloOrigen: pick(['efectivo-principal', 'nequi-principal']),
        bolsilloDestino: 'provision-caja',
        destinoMetodo: 'provision_caja',
      });
    }
  }
  return transfers;
};

const PROVISION_TRANSFERS = generateProvisionTransfers();

// ─── GASTO INVENTARIO ITEMS ─────────────────────────────────
const generateGastoInventarioItems = () => {
  const items = {};
  for (const gasto of GASTOS.filter(g => g.esInventariable && g.menuItemId)) {
    const invItem = ALL_MENU_ITEMS.find(i => i.id === gasto.menuItemId);
    if (!invItem) continue;
    if (!items[gasto.id]) items[gasto.id] = [];
    items[gasto.id].push({
      menuItemId: invItem.id,
      nombre: invItem.nombre,
      cantidad: gasto.cantidadInventario || randomInt(500, 5000),
      inventarioTipo: 'cantidad',
      unidadInventario: 'g',
      precioUnitario: Math.round((gasto.monto || 0) / (gasto.cantidadInventario || 1000)),
    });
  }
  return items;
};

const GASTO_INVENTARIO_ITEMS = generateGastoInventarioItems();

// ─── EMPLOYEE SCHEDULES ─────────────────────────────────────
const generateHorariosBase = () => {
  const horarios = {};
  for (const emp of EMPLEADOS) {
    if (!emp.horario_base) continue;
    horarios[emp.id] = emp.horario_base;
  }
  return horarios;
};

const HORARIOS_BASE = generateHorariosBase();

// ─── WEEKLY HOURS ────────────────────────────────────────────
const generateWeeklyHours = () => {
  const hours = {};
  for (const emp of EMPLEADOS.filter(e => e.activo)) {
    const weeklyRecords = {};
    // Generate a few weeks of hours records
    for (let w = 0; w < 10; w++) {
      const baseDate = new Date(2025, 0, 6 + w * 7); // Start from Jan 6, 2025
      const weekKey = `${baseDate.getFullYear()}-W${String(w + 1).padStart(2, '0')}`;
      const dayHours = {};
      for (const dayKey of DAY_KEYS) {
        dayHours[dayKey] = emp.horario_base?.[dayKey]?.active
          ? (emp.horario_base[dayKey].hours + (Math.random() < 0.3 ? randomInt(-1, 1) : 0))
          : 0;
      }
      weeklyRecords[weekKey] = dayHours;
    }
    hours[emp.id] = weeklyRecords;
  }
  return hours;
};

const HORARIOS_SEMANALES = generateWeeklyHours();

// ─── NEXT ORDER NUMBER ──────────────────────────────────────
const NEXT_ORDER_NUMBER = ALL_ORDERS.length > 0
  ? Math.max(...ALL_ORDERS.map(o => o.numero)) + 1
  : 1;

// ─── SERIALIZE ────────────────────────────────────────────────
const serialize = (data) => {
  return JSON.stringify(data, (key, value) => {
    if (value instanceof Date) return value.toISOString();
    return value;
  }, 1);
};

const buildFile = () => {
  let output = `// Auto-generated by scripts/generate-data.js
// DO NOT EDIT — Regenerate with: node scripts/generate-data.js
// Generated: ${new Date().toISOString()}
// Contains ${ALL_ORDERS.length} orders, ${CUSTOMERS.length} customers, ${EMPLEADOS.length} employees, ${GASTOS.length} gastos

import type { MenuItem, Order, Customer, Empleado, CajaPocket, Gasto, ProvisionTransfer, InventoryPriceHistoryEntry, EmployeeCreditHistoryEntry, WeeklySchedule } from '../types';

export const SEED_MENU_ITEMS: MenuItem[] = ${serialize(ALL_MENU_ITEMS)};

export const SEED_CUSTOMERS: Customer[] = ${serialize(CUSTOMERS)};

export const SEED_EMPLEADOS: Empleado[] = ${serialize(EMPLEADOS)};

export const SEED_CAJA_BOLSILLOS: CajaPocket[] = ${serialize(CAJA_BOLSILLOS)};

export const SEED_HORARIOS_BASE: Record<string, WeeklySchedule> = ${serialize(HORARIOS_BASE)};

export const SEED_HORARIOS_SEMANALES: Record<string, Record<string, Record<string, number>>> = ${serialize(HORARIOS_SEMANALES)};

export const SEED_NEXT_ORDER_NUMBER: number = ${NEXT_ORDER_NUMBER};

export const SEED_ORDERS: Order[] = ${serialize(ALL_ORDERS)};

export const SEED_ORDER_METADATA: Record<string, any> = ${serialize(ORDER_METADATA)};

export const SEED_GASTOS: Gasto[] = ${serialize(GASTOS)};

export const SEED_GASTO_INVENTARIO_ITEMS: Record<string, any[]> = ${serialize(GASTO_INVENTARIO_ITEMS)};

export const SEED_PROVISION_TRANSFERS: ProvisionTransfer[] = ${serialize(PROVISION_TRANSFERS)};

export const SEED_INVENTORY_PRICE_HISTORY: InventoryPriceHistoryEntry[] = ${serialize(INVENTORY_PRICE_HISTORY)};

export const SEED_EMPLOYEE_CREDIT_HISTORY: EmployeeCreditHistoryEntry[] = ${serialize(EMPLOYEE_CREDIT_HISTORY)};
`;

  return output;
};

// ─── WRITE OUTPUT ────────────────────────────────────────────
console.log('Generando archivo seedData.ts...');
const content = buildFile();
writeFileSync(OUTPUT, content, 'utf-8');
console.log(`✓ Archivo generado: ${OUTPUT}`);
console.log(`  Tamaño: ${(Buffer.byteLength(content) / 1024 / 1024).toFixed(2)} MB`);
console.log('¡Listo!');
