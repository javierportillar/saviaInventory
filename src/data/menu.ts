import { MenuItem } from '../types';

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

// Convertir datos del menú a productos con inventario
export const MENU_ITEMS: MenuItem[] = [...LEFT_SECTIONS, ...RIGHT_SECTIONS].flatMap(section =>
  section.items.map((item, index) => ({
    id: `${section.id}-${index}`,
    ...item,
    categoria: section.titulo,
    stock: Math.floor(Math.random() * 50) + 10, // Stock inicial aleatorio
    inventarioCategoria: 'No inventariables',
  }))
).concat([
  {
    id: 'inv-mango',
    nombre: 'Mango',
    precio: 0,
    categoria: 'Frutas',
    stock: 0,
    inventarioCategoria: 'Inventariables',
    inventarioTipo: 'gramos',
    unidadMedida: 'kg',
  },
  {
    id: 'inv-pina',
    nombre: 'Piña',
    precio: 0,
    categoria: 'Frutas',
    stock: 0,
    inventarioCategoria: 'Inventariables',
    inventarioTipo: 'gramos',
    unidadMedida: 'kg',
  },
  {
    id: 'inv-banano',
    nombre: 'Banano',
    precio: 0,
    categoria: 'Frutas',
    stock: 0,
    inventarioCategoria: 'Inventariables',
    inventarioTipo: 'gramos',
    unidadMedida: 'kg',
  },
  {
    id: 'inv-fresa',
    nombre: 'Fresa',
    precio: 0,
    categoria: 'Frutas',
    stock: 0,
    inventarioCategoria: 'Inventariables',
    inventarioTipo: 'gramos',
    unidadMedida: 'kg',
  },
  {
    id: 'inv-kiwi',
    nombre: 'Kiwi',
    precio: 0,
    categoria: 'Frutas',
    stock: 0,
    inventarioCategoria: 'Inventariables',
    inventarioTipo: 'gramos',
    unidadMedida: 'kg',
  },
]);

export const COLORS = {
  dark: "#0B1C14",
  beige: "#FEFCED", 
  accent: "#C9C326",
  pink: "#E58EB2",
} as const;