import { MenuItem, Order, Customer, Empleado, Gasto } from '../types';
import { slugify } from '../utils/strings';

type MenuItemSeed = Omit<MenuItem, 'codigo'> & { codigo?: string };

const ensureMenuItemCodigo = (seed: MenuItemSeed, prefix?: string): string => {
  if (seed.codigo && seed.codigo.trim()) {
    return seed.codigo.trim();
  }

  const prefixPart = prefix ? slugify(prefix) : '';
  const namePart = slugify(seed.nombre);
  const idPart = slugify(seed.id);

  const combined = [prefixPart, namePart].filter(Boolean).join('-');
  return combined || idPart || 'item';
};

const buildMenuItem = (seed: MenuItemSeed, prefix?: string): MenuItem => ({
  ...seed,
  codigo: ensureMenuItemCodigo(seed, prefix),
});

// Datos del menú organizados por secciones
const LEFT_SECTIONS = [
  {
    id: "sanduches",
    titulo: "Sandwiches",
    items: [
      {
        nombre: "Jamón artesano",
        precio: 18500,
        descripcion: "Salsa verde, queso doble crema, jamón de cerdo, rúgula, tomates horneados, parmesano.",
        keywords: "jamón artesano jamón de cerdo, miel de uvilla, cebolla, tomate horneado, rúgula, queso tajado, queso parmesano, salsa verde.",
      },
      {
        nombre: "Del huerto",
        precio: 15500,
        descripcion: "Mayonesa de rostizados, queso feta, rúgula, tomates horneados, champiñones, parmesano, mix de semillas, chips de arracacha.",
        keywords: "del huerto champiñones, mayonesa rostizada, queso feta, crocantes de arracacha, tomate horneado, semillas de calabaza, queso tajado.",
      },
      {
        nombre: "Pollo Green",
        precio: 16500,
        descripcion: "Mayonesa de rostizados y verde, jamón de pollo, guacamole, tomate horneado, semillas de girasol, lechuga, tocineta.",
        keywords: "pollo green jamón de pollo, rúgula, champiñones, parmesano, guacamole, salsa verde, salsa rostizada, lechuga, tomate horneado, semillas.",
      },
      {
        nombre: "Pollo Toscano",
        precio: 18500,
        descripcion: "Salsa verde, Jamón de Pollo, lechuga, rúgula, champiñones, tomates horneados, parmesano, queso doble crema, tocineta, miel de uvilla.",
        keywords: "pollo toscano jamón de pollo, lechuga, rúgula, champiñones, tomate horneado, queso tajado, queso parmesano, tocineta.",
      },
      {
        nombre: "Mexicano",
        precio: 19000,
        descripcion: "Frijol refrito, pollo desmechado, pico de gallo, queso crema tajado, guacamole, sour cream, salsa brava.",
        keywords: "mexicano pollo desmechado, guacamole, pico de gallo, frijol refrito, salsa brava, sour cream, queso tajado.",
      },
    ],
    side: "left" as const,
  },
  {
    id: "bowlssalados",
    titulo: "Bowls Salados",
    subtitulo: "26 oz",
    items: [
      {
        nombre: "Bowl Salado",
        precio: 15000,
        descripcion:
          "Personaliza tu bowl: 2 bases (arroz, pasta, quinua), 4 toppings (maíz tierno, champiñones, pico de gallo, guacamole, tocineta, chips de arracacha, queso feta, zanahoria, pepino) y 1 proteína (pechuga de pollo, jamón de cerdo, carne desmechada). Incluye bebida.",
      },
    ],
    side: "left" as const,
  },
  {
    id: "calientes",
    titulo: "Bebidas calientes",
    items: [
      { nombre: "Capuccino", precio: 6000, keywords: "capuccino" },
      { nombre: "Latte", precio: 5500, keywords: "latte" },
      { nombre: "Americano", precio: 5500, keywords: "americano" },
      { nombre: "Cocoa", precio: 6000, keywords: "cocoa" },
      { nombre: "Pitaya latte", precio: 8500, keywords: "pitaya latte" },
      { nombre: "Infusión de frutos rojos", precio: 6000, keywords: "infusión frutos rojos" },
    ],
    side: "left" as const,
  },
  {
    id: "acompanamientos",
    titulo: "Acompañamientos",
    items: [
      {
        nombre: "Torta del día",
        precio: 8000,
        keywords: "torta del día zanahoria arándanos naranja harina de almendra coco endulzada con banano cubierta yogurt griego",
      },
      { nombre: "Galletas de avena", precio: 4000, keywords: "galletas de avena" },
      { nombre: "Muffin de queso", precio: 4500, keywords: "muffin de queso" },
      {
        nombre: "Tapitas",
        precio: 10000,
        descripcion: "Pan acompañado de queso feta, tomate al horno y albahaca.",
        keywords: "tapitas pan queso feta tomate al horno albahaca",
      },
    ],
    side: "left" as const,
  },
];

const RIGHT_SECTIONS = [
  {
    id: "bowlsfrutales",
    titulo: "Bowls Frutales",
    subtitulo: "16 oz",
    items: [
      {
        nombre: "Açaí supremo",
        precio: 14500,
        descripcion:
          "Base: Açaí, fresa, banano, yogurt natural, leche o bebida vegetal. Toppings: Kiwi, fresa, banano, coco, arándanos, semillas, crema de maní.",
        keywords: "açaí supremo açaí fresa banano yogurt leche bebida vegetal kiwi coco arándanos semillas crema de maní",
      },
      {
        nombre: "Tropical",
        precio: 12000,
        descripcion:
          "Base: Mango, piña, banano, yogurt natural, leche o bebida vegetal. Toppings: Kiwi, mango, granola, semillas de girasol, coco.",
        keywords: "tropical mango piña banano yogurt leche kiwi granola semillas de girasol coco",
      },
      {
        nombre: "Vital",
        precio: 12000,
        descripcion:
          "Base: Mango, banano, piña, espinaca, yogurt natural, leche o bebida vegetal. Toppings: Kiwi, arándano, granola, chía latte, coco.",
        keywords: "vital mango banano piña espinaca yogurt leche kiwi arándano granola chía latte coco",
      },
    ],
    side: "right" as const,
  },
  {
    id: "refrescantes",
    titulo: "Batidos refrescantes",
    items: [
      {
        nombre: "Amanecer",
        precio: 9500,
        descripcion: "Mango, piña, menta, semillas de chía.",
        keywords: "amanecer mango piña menta chía",
      },
      {
        nombre: "Sandía salvaje",
        precio: 9500,
        descripcion: "Sandía, fresa, hierbabuena, limón, kiwi.",
        keywords: "sandía salvaje sandía fresa hierbabuena limón kiwi",
      },
      {
        nombre: "Piña rosa",
        precio: 9500,
        descripcion: "Hierbabuena, pitaya rosada, piña, limón.",
        keywords: "piña rosa hierbabuena pitaya rosada piña limón",
      },
    ],
    side: "right" as const,
  },
  {
    id: "funcionales",
    titulo: "Batidos funcionales",
    items: [
      {
        nombre: "Golden milk",
        precio: 10500,
        descripcion: "Mango, banano, yogurt natural, leche, miel, chía, cúrcuma, maca.",
        keywords: "golden milk mango banano yogurt leche miel chía cúrcuma maca",
      },
      {
        nombre: "Digest",
        precio: 10500,
        descripcion: "Sábila, piña, kiwi, chía, naranja, miel.",
        keywords: "digest sábila piña kiwi chía naranja miel",
      },
      {
        nombre: "Antioxidante",
        precio: 10500,
        descripcion: "Sandía, remolacha, jengibre, mora, limón, chía.",
        keywords: "antioxidante sandía remolacha jengibre mora limón chía",
      },
      {
        nombre: "Saciante",
        precio: 10500,
        descripcion: "Arándano, fresa, banano, leche, chía, avena.",
        keywords: "saciante arándano fresa banano leche chía avena",
      },
      {
        nombre: "Detox",
        precio: 10500,
        descripcion: "Jengibre, apio, perejil, menta fresca, manzana verde, kiwi, pepino, naranja, miel.",
        keywords: "detox jengibre apio perejil menta fresca manzana verde kiwi pepino naranja miel",
      },
    ],
    side: "right" as const,
  },
  {
    id: "especiales",
    titulo: "Batidos especiales",
    items: [
      { nombre: "Pink", precio: 12000, descripcion: "Fresa, banano, yogurt natural, leche, chía, avena.", keywords: "pink fresa banano yogurt leche chía avena" },
      { nombre: "Mocha energy", precio: 12000, descripcion: "Banano, café frío, leche, cacao puro, crema de maní, avena.", keywords: "mocha energy banano café frío leche cacao puro crema de maní avena" },
      { nombre: "Matcha protein", precio: 16000, descripcion: "Té matcha, scoop de proteína whey pure (30 g).", keywords: "matcha protein té matcha proteína whey 30g" },
    ],
    side: "right" as const,
  },
  {
    id: "frias",
    titulo: "Bebidas frías",
    items: [
      { nombre: "Matcha latte helado", precio: 11000, descripcion: "Té matcha con leche y hielo.", keywords: "matcha latte helado té matcha leche hielo" },
      { nombre: "Blue latte helado", precio: 10500, descripcion: "Té azul en leche o bebida vegetal con hielo.", keywords: "blue latte helado té azul leche bebida vegetal hielo" },
      { nombre: "Limonada azul", precio: 10000, descripcion: "Mezcla de limón y té azul.", keywords: "limonada azul limón té azul" },
      { nombre: "Café Pitaya", precio: 10500, descripcion: "Café y pitaya rosa.", keywords: "café pitaya café pitaya rosa" },
    ],
    side: "right" as const,
  },
];

// Convertir datos del menú a productos (NO INVENTARIABLES)
const MENU_ITEMS: MenuItem[] = [...LEFT_SECTIONS, ...RIGHT_SECTIONS].flatMap((section) =>
  section.items.map((item, index) =>
    buildMenuItem(
      {
        id: `${section.id}-${index}`,
        ...item,
        categoria: section.titulo,
        stock: Math.floor(Math.random() * 50) + 10,
        inventarioCategoria: 'No inventariables',
      },
      section.id
    )
  )
);

// Ingredientes inventariables
const INVENTARIABLE_SEED: MenuItemSeed[] = [
  // Frutas
  { id: 'inv-mango', nombre: 'Mango', precio: 0, categoria: 'Frutas', stock: 5000, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-pina', nombre: 'Piña', precio: 0, categoria: 'Frutas', stock: 3000, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-banano', nombre: 'Banano', precio: 0, categoria: 'Frutas', stock: 2000, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-fresa', nombre: 'Fresa', precio: 0, categoria: 'Frutas', stock: 1500, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-kiwi', nombre: 'Kiwi', precio: 0, categoria: 'Frutas', stock: 800, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-sandia', nombre: 'Sandía', precio: 0, categoria: 'Frutas', stock: 4000, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-arandanos', nombre: 'Arándanos', precio: 0, categoria: 'Frutas', stock: 500, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-acai', nombre: 'Açaí', precio: 0, categoria: 'Frutas', stock: 300, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-pitaya', nombre: 'Pitaya', precio: 0, categoria: 'Frutas', stock: 400, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },

  // Lácteos
  { id: 'inv-yogurt', nombre: 'Yogurt natural', precio: 0, categoria: 'Lácteos', stock: 2000, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-leche', nombre: 'Leche', precio: 0, categoria: 'Lácteos', stock: 3000, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'ml' },
  { id: 'inv-queso-feta', nombre: 'Queso feta', precio: 0, categoria: 'Lácteos', stock: 500, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-queso-crema', nombre: 'Queso doble crema', precio: 0, categoria: 'Lácteos', stock: 800, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },

  // Proteínas
  { id: 'inv-jamon-cerdo', nombre: 'Jamón de cerdo', precio: 0, categoria: 'Proteínas', stock: 1000, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-jamon-pollo', nombre: 'Jamón de pollo', precio: 0, categoria: 'Proteínas', stock: 1200, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-pollo-desmechado', nombre: 'Pollo desmechado', precio: 0, categoria: 'Proteínas', stock: 800, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-tocineta', nombre: 'Tocineta', precio: 0, categoria: 'Proteínas', stock: 400, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  
  // Vegetales
  { id: 'inv-rugula', nombre: 'Rúgula', precio: 0, categoria: 'Vegetales', stock: 300, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-lechuga', nombre: 'Lechuga', precio: 0, categoria: 'Vegetales', stock: 500, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-champinones', nombre: 'Champiñones', precio: 0, categoria: 'Vegetales', stock: 600, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-tomate', nombre: 'Tomate', precio: 0, categoria: 'Vegetales', stock: 1000, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-espinaca', nombre: 'Espinaca', precio: 0, categoria: 'Vegetales', stock: 400, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-apio', nombre: 'Apio', precio: 0, categoria: 'Vegetales', stock: 300, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-pepino', nombre: 'Pepino', precio: 0, categoria: 'Vegetales', stock: 800, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  
  // Semillas y frutos secos
  { id: 'inv-chia', nombre: 'Semillas de chía', precio: 0, categoria: 'Semillas', stock: 200, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-granola', nombre: 'Granola', precio: 0, categoria: 'Semillas', stock: 500, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-avena', nombre: 'Avena', precio: 0, categoria: 'Semillas', stock: 1000, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-coco', nombre: 'Coco rallado', precio: 0, categoria: 'Semillas', stock: 300, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-crema-mani', nombre: 'Crema de maní', precio: 0, categoria: 'Semillas', stock: 400, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  
  // Especias y condimentos
  { id: 'inv-curcuma', nombre: 'Cúrcuma', precio: 0, categoria: 'Especias', stock: 100, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-jengibre', nombre: 'Jengibre', precio: 0, categoria: 'Especias', stock: 200, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-maca', nombre: 'Maca', precio: 0, categoria: 'Especias', stock: 150, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-miel', nombre: 'Miel', precio: 0, categoria: 'Especias', stock: 500, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  
  // Bebidas base
  { id: 'inv-cafe', nombre: 'Café', precio: 0, categoria: 'Bebidas', stock: 1000, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-te-matcha', nombre: 'Té matcha', precio: 0, categoria: 'Bebidas', stock: 200, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-cacao', nombre: 'Cacao puro', precio: 0, categoria: 'Bebidas', stock: 300, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
  { id: 'inv-proteina', nombre: 'Proteína whey', precio: 0, categoria: 'Bebidas', stock: 500, inventarioCategoria: 'Inventariables', inventarioTipo: 'gramos', unidadMedida: 'g' },
];

const INVENTARIABLE_ITEMS: MenuItem[] = INVENTARIABLE_SEED.map((seed) =>
  buildMenuItem(seed, 'inv')
);

// Combinar todos los items
export const ALL_MENU_ITEMS: MenuItem[] = [...MENU_ITEMS, ...INVENTARIABLE_ITEMS];

// Datos iniciales para localStorage
export const INITIAL_DATA = {
  menuItems: ALL_MENU_ITEMS,
  orders: [] as Order[],
  customers: [] as Customer[],
  empleados: [] as Empleado[],
  gastos: [] as Gasto[],
};

// Funciones para manejo de localStorage
export const getLocalData = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const setLocalData = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

type SeedStatus = 'missing' | 'invalid' | 'ok';

const readLocalEntry = (key: string): { status: SeedStatus; value: unknown } => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return { status: 'missing', value: undefined };
    }
    return { status: 'ok', value: JSON.parse(item) };
  } catch (error) {
    console.warn(`[localData] Error parsing localStorage key "${key}".`, error);
    return { status: 'invalid', value: undefined };
  }
};

const isArray = (value: unknown): value is unknown[] => Array.isArray(value);
const isNonEmptyArray = (value: unknown): value is unknown[] => Array.isArray(value) && value.length > 0;

const ensureSeeded = <T>(
  key: string,
  fallback: T,
  validator: (value: unknown) => boolean,
  description: string
): void => {
  const { status, value } = readLocalEntry(key);

  if (status !== 'ok') {
    const reason =
      status === 'missing'
        ? 'no se encontraron datos previos.'
        : 'los datos existentes están corruptos.';
    console.info(`[localData] ${description}: ${reason} Se inicializan los valores predeterminados.`);
    setLocalData(key, fallback);
    return;
  }

  if (!validator(value)) {
    console.info(`[localData] ${description}: la estructura encontrada es inválida. Se restauran los valores iniciales.`);
    setLocalData(key, fallback);
    return;
  }

  if (Array.isArray(value)) {
    console.info(`[localData] ${description}: se encontraron ${value.length} registros en localStorage.`);
  } else {
    console.info(`[localData] ${description}: datos válidos detectados en localStorage.`);
  }
};

// Inicializar datos garantizando datos base consistentes
export const initializeLocalData = (): void => {
  ensureSeeded('savia-menuItems', INITIAL_DATA.menuItems, isNonEmptyArray, 'Productos del menú');
  ensureSeeded('savia-orders', INITIAL_DATA.orders, isArray, 'Órdenes');
  ensureSeeded('savia-customers', INITIAL_DATA.customers, isArray, 'Clientes');
  ensureSeeded('savia-empleados', INITIAL_DATA.empleados, isArray, 'Empleados');
  ensureSeeded('savia-gastos', INITIAL_DATA.gastos, isArray, 'Gastos');
};