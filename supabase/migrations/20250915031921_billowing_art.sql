/*
  # Poblar tabla menu_items con productos fijos

  1. Insertar productos del menú
    - Sandwiches
    - Bowls salados y frutales
    - Bebidas calientes y frías
    - Batidos
    - Acompañamientos
    - Ingredientes inventariables
*/

-- Limpiar tabla primero
DELETE FROM menu_items;

-- Sandwiches
INSERT INTO menu_items (id, nombre, precio, descripcion, keywords, categoria, stock, inventario_categoria, inventario_tipo, unidad_medida) VALUES
('sand-jamon-artesano', 'Jamón artesano', 18500, 'Salsa verde, queso doble crema, jamón de cerdo, rúgula, tomates horneados, parmesano.', 'jamón artesano jamón de cerdo, miel de uvilla, cebolla, tomate horneado, rúgula, queso tajado, queso parmesano, salsa verde.', 'Sandwiches', 50, 'No inventariables', 'cantidad', 'kg'),
('sand-del-huerto', 'Del huerto', 15500, 'Mayonesa de rostizados, queso feta, rúgula, tomates horneados, champiñones, parmesano, mix de semillas, chips de arracacha.', 'del huerto champiñones, mayonesa rostizada, queso feta, crocantes de arracacha, tomate horneado, semillas de calabaza, queso tajado.', 'Sandwiches', 50, 'No inventariables', 'cantidad', 'kg'),
('sand-pollo-green', 'Pollo Green', 16500, 'Mayonesa de rostizados y verde, jamón de pollo, guacamole, tomate horneado, semillas de girasol, lechuga, tocineta.', 'pollo green jamón de pollo, rúgula, champiñones, parmesano, guacamole, salsa verde, salsa rostizada, lechuga, tomate horneado, semillas.', 'Sandwiches', 50, 'No inventariables', 'cantidad', 'kg'),
('sand-pollo-toscano', 'Pollo Toscano', 18500, 'Salsa verde, Jamón de Pollo, lechuga, rúgula, champiñones, tomates horneados, parmesano, queso doble crema, tocineta, miel de uvilla.', 'pollo toscano jamón de pollo, lechuga, rúgula, champiñones, tomate horneado, queso tajado, queso parmesano, tocineta.', 'Sandwiches', 50, 'No inventariables', 'cantidad', 'kg'),
('sand-mexicano', 'Mexicano', 19000, 'Frijol refrito, pollo desmechado, pico de gallo, queso crema tajado, guacamole, sour cream, salsa brava.', 'mexicano pollo desmechado, guacamole, pico de gallo, frijol refrito, salsa brava, sour cream, queso tajado.', 'Sandwiches', 50, 'No inventariables', 'cantidad', 'kg');

-- Bowls Salados
INSERT INTO menu_items (id, nombre, precio, descripcion, categoria, stock, inventario_categoria, inventario_tipo, unidad_medida) VALUES
('bowl-salado', 'Bowl Salado', 15000, 'Personaliza tu bowl: 2 bases (arroz, pasta, quinua), 4 toppings (maíz tierno, champiñones, pico de gallo, guacamole, tocineta, chips de arracacha, queso feta, zanahoria, pepino) y 1 proteína (pechuga de pollo, jamón de cerdo, carne desmechada). Incluye bebida.', 'Bowls Salados', 30, 'No inventariables', 'cantidad', 'kg');

-- Bowls Frutales
INSERT INTO menu_items (id, nombre, precio, descripcion, keywords, categoria, stock, inventario_categoria, inventario_tipo, unidad_medida) VALUES
('bowl-acai-supremo', 'Açaí supremo', 14500, 'Base: Açaí, fresa, banano, yogurt natural, leche o bebida vegetal. Toppings: Kiwi, fresa, banano, coco, arándanos, semillas, crema de maní.', 'açaí supremo açaí fresa banano yogurt leche bebida vegetal kiwi coco arándanos semillas crema de maní', 'Bowls Frutales', 25, 'No inventariables', 'cantidad', 'kg'),
('bowl-tropical', 'Tropical', 12000, 'Base: Mango, piña, banano, yogurt natural, leche o bebida vegetal. Toppings: Kiwi, mango, granola, semillas de girasol, coco.', 'tropical mango piña banano yogurt leche kiwi granola semillas de girasol coco', 'Bowls Frutales', 25, 'No inventariables', 'cantidad', 'kg'),
('bowl-vital', 'Vital', 12000, 'Base: Mango, banano, piña, espinaca, yogurt natural, leche o bebida vegetal. Toppings: Kiwi, arándano, granola, chía latte, coco.', 'vital mango banano piña espinaca yogurt leche kiwi arándano granola chía latte coco', 'Bowls Frutales', 25, 'No inventariables', 'cantidad', 'kg');

-- Bebidas Calientes
INSERT INTO menu_items (id, nombre, precio, keywords, categoria, stock, inventario_categoria, inventario_tipo, unidad_medida) VALUES
('beb-capuccino', 'Capuccino', 6000, 'capuccino', 'Bebidas calientes', 100, 'No inventariables', 'cantidad', 'kg'),
('beb-latte', 'Latte', 5500, 'latte', 'Bebidas calientes', 100, 'No inventariables', 'cantidad', 'kg'),
('beb-americano', 'Americano', 5500, 'americano', 'Bebidas calientes', 100, 'No inventariables', 'cantidad', 'kg'),
('beb-cocoa', 'Cocoa', 6000, 'cocoa', 'Bebidas calientes', 100, 'No inventariables', 'cantidad', 'kg'),
('beb-pitaya-latte', 'Pitaya latte', 8500, 'pitaya latte', 'Bebidas calientes', 50, 'No inventariables', 'cantidad', 'kg'),
('beb-infusion-frutos', 'Infusión de frutos rojos', 6000, 'infusión frutos rojos', 'Bebidas calientes', 50, 'No inventariables', 'cantidad', 'kg');

-- Batidos Refrescantes
INSERT INTO menu_items (id, nombre, precio, descripcion, keywords, categoria, stock, inventario_categoria, inventario_tipo, unidad_medida) VALUES
('bat-amanecer', 'Amanecer', 9500, 'Mango, piña, menta, semillas de chía.', 'amanecer mango piña menta chía', 'Batidos refrescantes', 30, 'No inventariables', 'cantidad', 'kg'),
('bat-sandia-salvaje', 'Sandía salvaje', 9500, 'Sandía, fresa, hierbabuena, limón, kiwi.', 'sandía salvaje sandía fresa hierbabuena limón kiwi', 'Batidos refrescantes', 30, 'No inventariables', 'cantidad', 'kg'),
('bat-pina-rosa', 'Piña rosa', 9500, 'Hierbabuena, pitaya rosada, piña, limón.', 'piña rosa hierbabuena pitaya rosada piña limón', 'Batidos refrescantes', 30, 'No inventariables', 'cantidad', 'kg');

-- Batidos Funcionales
INSERT INTO menu_items (id, nombre, precio, descripcion, keywords, categoria, stock, inventario_categoria, inventario_tipo, unidad_medida) VALUES
('bat-golden-milk', 'Golden milk', 10500, 'Mango, banano, yogurt natural, leche, miel, chía, cúrcuma, maca.', 'golden milk mango banano yogurt leche miel chía cúrcuma maca', 'Batidos funcionales', 25, 'No inventariables', 'cantidad', 'kg'),
('bat-digest', 'Digest', 10500, 'Sábila, piña, kiwi, chía, naranja, miel.', 'digest sábila piña kiwi chía naranja miel', 'Batidos funcionales', 25, 'No inventariables', 'cantidad', 'kg'),
('bat-antioxidante', 'Antioxidante', 10500, 'Sandía, remolacha, jengibre, mora, limón, chía.', 'antioxidante sandía remolacha jengibre mora limón chía', 'Batidos funcionales', 25, 'No inventariables', 'cantidad', 'kg'),
('bat-saciante', 'Saciante', 10500, 'Arándano, fresa, banano, leche, chía, avena.', 'saciante arándano fresa banano leche chía avena', 'Batidos funcionales', 25, 'No inventariables', 'cantidad', 'kg'),
('bat-detox', 'Detox', 10500, 'Jengibre, apio, perejil, menta fresca, manzana verde, kiwi, pepino, naranja, miel.', 'detox jengibre apio perejil menta fresca manzana verde kiwi pepino naranja miel', 'Batidos funcionales', 25, 'No inventariables', 'cantidad', 'kg');

-- Batidos Especiales
INSERT INTO menu_items (id, nombre, precio, descripcion, keywords, categoria, stock, inventario_categoria, inventario_tipo, unidad_medida) VALUES
('bat-pink', 'Pink', 12000, 'Fresa, banano, yogurt natural, leche, chía, avena.', 'pink fresa banano yogurt leche chía avena', 'Batidos especiales', 20, 'No inventariables', 'cantidad', 'kg'),
('bat-mocha-energy', 'Mocha energy', 12000, 'Banano, café frío, leche, cacao puro, crema de maní, avena.', 'mocha energy banano café frío leche cacao puro crema de maní avena', 'Batidos especiales', 20, 'No inventariables', 'cantidad', 'kg'),
('bat-matcha-protein', 'Matcha protein', 16000, 'Té matcha, scoop de proteína whey pure (30 g).', 'matcha protein té matcha proteína whey 30g', 'Batidos especiales', 15, 'No inventariables', 'cantidad', 'kg');

-- Bebidas Frías
INSERT INTO menu_items (id, nombre, precio, descripcion, keywords, categoria, stock, inventario_categoria, inventario_tipo, unidad_medida) VALUES
('beb-matcha-helado', 'Matcha latte helado', 11000, 'Té matcha con leche y hielo.', 'matcha latte helado té matcha leche hielo', 'Bebidas frías', 30, 'No inventariables', 'cantidad', 'kg'),
('beb-blue-latte', 'Blue latte helado', 10500, 'Té azul en leche o bebida vegetal con hielo.', 'blue latte helado té azul leche bebida vegetal hielo', 'Bebidas frías', 30, 'No inventariables', 'cantidad', 'kg'),
('beb-limonada-azul', 'Limonada azul', 10000, 'Mezcla de limón y té azul.', 'limonada azul limón té azul', 'Bebidas frías', 40, 'No inventariables', 'cantidad', 'kg'),
('beb-cafe-pitaya', 'Café Pitaya', 10500, 'Café y pitaya rosa.', 'café pitaya café pitaya rosa', 'Bebidas frías', 30, 'No inventariables', 'cantidad', 'kg');

-- Acompañamientos
INSERT INTO menu_items (id, nombre, precio, keywords, categoria, stock, inventario_categoria, inventario_tipo, unidad_medida) VALUES
('acomp-torta-dia', 'Torta del día', 8000, 'torta del día zanahoria arándanos naranja harina de almendra coco endulzada con banano cubierta yogurt griego', 'Acompañamientos', 10, 'No inventariables', 'cantidad', 'kg'),
('acomp-galletas-avena', 'Galletas de avena', 4000, 'galletas de avena', 'Acompañamientos', 20, 'No inventariables', 'cantidad', 'kg'),
('acomp-muffin-queso', 'Muffin de queso', 4500, 'muffin de queso', 'Acompañamientos', 15, 'No inventariables', 'cantidad', 'kg'),
('acomp-tapitas', 'Tapitas', 10000, 'Pan acompañado de queso feta, tomate al horno y albahaca.', 'tapitas pan queso feta tomate al horno albahaca', 'Acompañamientos', 25, 'No inventariables', 'cantidad', 'kg');

-- Ingredientes Inventariables
INSERT INTO menu_items (id, nombre, precio, categoria, stock, inventario_categoria, inventario_tipo, unidad_medida) VALUES
('inv-mango', 'Mango', 0, 'Frutas', 5000, 'Inventariables', 'gramos', 'g'),
('inv-pina', 'Piña', 0, 'Frutas', 3000, 'Inventariables', 'gramos', 'g'),
('inv-banano', 'Banano', 0, 'Frutas', 2000, 'Inventariables', 'gramos', 'g'),
('inv-fresa', 'Fresa', 0, 'Frutas', 1500, 'Inventariables', 'gramos', 'g'),
('inv-kiwi', 'Kiwi', 0, 'Frutas', 1000, 'Inventariables', 'gramos', 'g'),
('inv-sandia', 'Sandía', 0, 'Frutas', 4000, 'Inventariables', 'gramos', 'g'),
('inv-acai', 'Açaí', 0, 'Frutas', 500, 'Inventariables', 'gramos', 'g'),
('inv-pitaya', 'Pitaya', 0, 'Frutas', 300, 'Inventariables', 'gramos', 'g'),
('inv-arandanos', 'Arándanos', 0, 'Frutas', 800, 'Inventariables', 'gramos', 'g'),
('inv-yogurt', 'Yogurt natural', 0, 'Lácteos', 2000, 'Inventariables', 'gramos', 'g'),
('inv-leche', 'Leche', 0, 'Lácteos', 3000, 'Inventariables', 'gramos', 'ml'),
('inv-queso-feta', 'Queso feta', 0, 'Lácteos', 1000, 'Inventariables', 'gramos', 'g'),
('inv-jamon-pollo', 'Jamón de pollo', 0, 'Proteínas', 1500, 'Inventariables', 'gramos', 'g'),
('inv-jamon-cerdo', 'Jamón de cerdo', 0, 'Proteínas', 1200, 'Inventariables', 'gramos', 'g'),
('inv-pan', 'Pan', 0, 'Panadería', 50, 'Inventariables', 'cantidad', 'unidad'),
('inv-granola', 'Granola', 0, 'Cereales', 2000, 'Inventariables', 'gramos', 'g'),
('inv-avena', 'Avena', 0, 'Cereales', 3000, 'Inventariables', 'gramos', 'g'),
('inv-chia', 'Chía', 0, 'Semillas', 500, 'Inventariables', 'gramos', 'g'),
('inv-cafe', 'Café', 0, 'Bebidas', 1000, 'Inventariables', 'gramos', 'g'),
('inv-te-matcha', 'Té matcha', 0, 'Bebidas', 200, 'Inventariables', 'gramos', 'g');