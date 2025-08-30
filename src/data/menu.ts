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
    id: "calientes",
    titulo: "Bebidas calientes",
    items: [
      { nombre: "Capuccino", precio: 6000, keywords: "capuccino" },
      { nombre: "Latte", precio: 5500, keywords: "latte" },
      { nombre: "Americano", precio: 5500, keywords: "americano" },
      { nombre: "Cocoa", precio: 6000, keywords: "cocoa" },
      { nombre: "Matcha latte", precio: 10000, keywords: "matcha latte" },
      { nombre: "Pitaya latte", precio: 8500, keywords: "pitaya latte" },
      { nombre: "Blue latte", precio: 8500, keywords: "blue latte" },
      { nombre: "Infusión de frutos rojos", precio: 6000, keywords: "infusión frutos rojos" },
      { nombre: "Infusión mariposa", precio: 6500, keywords: "infusión mariposa" },
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
      { nombre: "Galletas de avena", precio: 4500, keywords: "galletas de avena" },
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
    id: "bowls",
    titulo: "Bowls",
    subtitulo: "16 oz",
    items: [
      {
        nombre: "Açaí supremo",
        precio: 18500,
        descripcion: "Base: Açaí, banano, mora, yogurt natural, leche o bebida vegetal. Toppings: Fresa, mango, banano, chía, arándanos, coco, crema de maní, yogurt griego con matcha.",
        keywords: "açaí supremo açaí banano mora yogurt natural leche bebida vegetal fresa mango chía arándanos coco crema de maní yogurt griego matcha",
      },
      {
        nombre: "Berry Love",
        precio: 14500,
        descripcion: "Base: Açaí, fresa, banano, yogurt natural, leche o bebida vegetal. Toppings: Kiwi, fresa, coco, semillas, crema de maní.",
        keywords: "berry love açaí fresa banano yogurt leche bebida vegetal kiwi coco semillas crema de maní",
      },
      {
        nombre: "Tropical",
        precio: 12000,
        descripcion: "Base: Mango, piña, banano, yogurt natural, leche o bebida vegetal. Toppings: Kiwi, mango, granola, semillas de girasol, coco.",
        keywords: "tropical mango piña banano yogurt leche kiwi granola semillas de girasol coco",
      },
      {
        nombre: "Vital",
        precio: 12000,
        descripcion: "Base: Mango, banano, piña, espinaca, yogurt natural, leche o bebida vegetal. Toppings: Kiwi, arándano, chía latte, coco.",
        keywords: "vital mango banano piña espinaca yogurt leche kiwi arándano chía latte coco",
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
        precio: 10500,
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
      { nombre: "Choco avocado", precio: 12000, descripcion: "Banano, aguacate, leche, miel, cacao puro, avena.", keywords: "choco avocado banano aguacate leche miel cacao puro avena" },
      { nombre: "Berries", precio: 13000, descripcion: "Arándano, yogurt natural, leche, avena, semillas de calabaza.", keywords: "berries arándano yogurt leche avena semillas de calabaza" },
      { nombre: "Matcha energy", precio: 12000, descripcion: "Banano, yogurt natural, leche, miel, matcha, semillas de calabaza, avena.", keywords: "matcha energy banano yogurt leche miel matcha semillas de calabaza avena" },
      { nombre: "Matcha protein", precio: 16000, descripcion: "Té matcha, scoop de proteína whey pure (30 g).", keywords: "matcha protein té matcha proteína whey 30g" },
    ],
    side: "right" as const,
  },
  {
    id: "frias",
    titulo: "Bebidas frías",
    items: [
      { nombre: "Ice matcha latte", precio: 12500, descripcion: "Té matcha en leche o bebida vegetal con hielo.", keywords: "ice matcha latte té matcha leche bebida vegetal hielo" },
      { nombre: "Ice blue latte", precio: 12000, descripcion: "Té azul en leche o bebida vegetal con hielo.", keywords: "ice blue latte té azul leche bebida vegetal hielo" },
      { nombre: "Ice coffee latte", precio: 11500, descripcion: "Hielos de café, en leche o bebida vegetal.", keywords: "ice coffee latte café leche bebida vegetal hielo" },
      { nombre: "Limonada azul", precio: 12500, descripcion: "Mezcla de limón y té azul.", keywords: "limonada azul limón té azul" },
      { nombre: "Blue coffee", precio: 10500, descripcion: "Café y té azul.", keywords: "blue coffee café té azul" },
      { nombre: "Pink coffee", precio: 10500, descripcion: "Café y pitaya rosa.", keywords: "pink coffee café pitaya rosa" },
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
  }))
);

export const COLORS = {
  dark: "#0B1C14",
  beige: "#FEFCED", 
  accent: "#C9C326",
  pink: "#E58EB2",
} as const;