SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: app_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."app_settings" ("key", "value_json", "created_at", "updated_at") FROM stdin;
caja_combo_descuento_bebidas	{"drinkComboDiscountEnabled": false, "drinkComboDiscountPercent": 10, "drinkComboDiscountCategories": ["batidos refrescantes", "funcionales", "especiales", "bebidas frias", "bebidas calientes"], "drinkComboDiscountProductIds": ["bbe7a283-40e4-4d35-bac2-1aa7423a4058", "84ce9a61-d186-47cb-92b4-afa4d5847dab", "890a38ce-311d-45f0-b602-f10798189185", "a6180a54-dcea-4af5-a873-455b03618324", "fa107d92-d59b-4686-b51f-7df33766c361", "522d937d-7d2d-4c3a-b785-f692a09b8a37", "fe196a9f-e68f-4df6-ab98-5a2c58ad9b16", "3bb93296-c6c5-456a-b165-73c1a20a3134", "2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f", "d4f6e89a-8cbe-4ecd-b524-b731b1223b24", "f3e97ba3-6dc6-4847-becf-7f84e94873f2", "996be55c-5666-42fd-bb8b-4ef44cd82194", "35a41129-ef96-43e6-8ebc-7c14c4d26605"], "followerOrderDiscountEnabled": true, "followerOrderDiscountPercent": 5, "sandwichComboDiscountEnabled": false, "sandwichComboDiscountPercent": 10, "studentProductDiscountEnabled": true, "studentProductDiscountPercent": 10}	2026-03-05 20:19:03.619245+00	2026-03-13 21:43:16.179528+00
empleados_nomina_config	{"smmlv": 1750905, "diasMesBase": 30, "horasMesBase": 220, "auxilioTransporte": 250000, "limiteAuxilioSmmlv": 2}	2026-03-06 02:47:03.857914+00	2026-03-06 15:04:57.734581+00
\.


--
-- Data for Name: caja_bolsillos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."caja_bolsillos" ("codigo", "nombre", "descripcion", "metodo_pago", "es_principal", "created_at") FROM stdin;
caja_principal	Caja principal	Bolsillo principal de efectivo disponible	efectivo	t	2025-10-21 00:17:35.487084+00
provision_caja	Provisión de caja	Reservas de efectivo apartadas del punto de venta	efectivo	f	2025-10-21 00:17:35.487084+00
\.


--
-- Data for Name: caja_transferencias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."caja_transferencias" ("id", "fecha", "monto", "descripcion", "bolsillo_origen", "bolsillo_destino", "created_at") FROM stdin;
7994b2d9-c6b2-4ec6-bb91-a861b26c559b	2026-02-25	202000	Movimiento de Caja a Provision caja	caja_principal	provision_caja	2026-02-26 01:55:46.776909+00
17be5198-eed3-40b1-b9b6-cf4ae38d302b	2026-02-26	25000	\N	caja_principal	provision_caja	2026-02-27 01:14:57.567913+00
0bb743aa-0c33-4b19-8237-9a2b60bcb1f5	2026-03-02	30000	\N	caja_principal	provision_caja	2026-03-03 00:50:09.125134+00
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."customers" ("id", "nombre", "telefono", "direccion", "edad") FROM stdin;
eaa07600-d0f1-452a-ae7b-6ad8b58f24c4	Javier	3105046328	\N	\N
ebd3c2f8-065f-4a44-8d53-330d736d9647	Briyith	3046319664	\N	\N
0cf14e74-a586-47c8-8d24-52547bdd464b	Miguel	3014853312	\N	\N
1f21b2a6-02db-41be-95ec-4e13a6cb6942	Gloria Rosero	3014128705	\N	\N
445fa2d2-94bc-4ec1-9ae8-928be375b5b7	Karol Bastidas Mora	3116280277	\N	\N
deecc8eb-6346-4154-a540-79462d987083	belen	3103908144	\N	\N
7ee086b5-a58a-4dd5-bb7a-a44a7b81b3c2	Savia Col	3103908144	\N	\N
ebc0df13-9e4e-4ab4-b389-4ce9820a3006	Yaneth Hernandez	3154459281	\N	\N
8d89e933-7d00-4a69-b11f-8c80f7fc550c	Mateo Romero	3113613284	\N	\N
9d300a46-8032-4ef3-b906-5f1348667868	Jesus pozo	3182070155	\N	\N
91301b42-be86-438a-8fe1-dfdee23a49f7	Victoria	3174084166	\N	\N
f5b1ba1b-8463-41af-81b9-6a8c8573d4ad	Marilyn Peña	3138246060	\N	\N
\.


--
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."menu_items" ("id", "codigo", "nombre", "precio", "descripcion", "keywords", "categoria", "stock", "inventariocategoria", "inventariotipo", "unidadmedida") FROM stdin;
ed348c8c-f11a-401a-8865-5ede23240268	bowl-tropical	Tropical	12000	Mango, piña, banano, yogurt natural y toppings.	tropical, mango, piña, banano, yogurt, granola, coco, semillas	Bowls Frutales	9999	No inventariables	\N	\N
563a5528-8afd-4131-aae9-97bf22abf715	inv-arandanos	Arándanos	6000	\N	arándanos fruta fresca	Frutas	2	Inventariables	\N	\N
b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	sand-pollo-toscano	Pollo Toscano	19000	Salsa verde, jamón de pollo, lechuga, rúgula, champiñones, tomates horneados, parmesano, queso doble crema, tocineta, miel de uvilla.	pollo toscano, jamón de pollo, lechuga, rúgula, champiñones, tomate horneado, queso tajado, queso parmesano, tocineta	Sandwiches	99	No inventariables	\N	\N
f0dfa128-82ba-4fe5-8a08-e008775f713e	inv-tocineta	Tocineta	15000	paquete de tocineta de 500 Gr	tocineta	Proteínas	2	Inventariables	cantidad	\N
8ac5c2ab-fa3c-4001-bb5a-dd5436f88d0b	inv-lechuga	Lechuga	3000	3k la unidad	lechuga	Vegetales	1	Inventariables	cantidad	\N
3e64c708-2249-42ab-b25d-1961379a35b3	inv-fresa	Fresa	0	\N	fresa fruta fresca	Frutas	0	Inventariables	\N	\N
0aa7128a-f7bb-49b6-8076-5353da9d8b36	inv-avena	Avena	0	\N	avena	Semillas	0	Inventariables	\N	\N
0b7f6082-d353-4b88-88f6-f9c38cf8a236	inv-banano	Banano	2500	2500 el kilogramo	banano fruta fresca	Frutas	20000	Inventariables	gramos	g
a551c5fe-bf6e-4d9d-a396-22d2147c309d	bowl-acai-supremo	Açaí Supremo	14500	Base de açaí, fresa, banano, yogurt y toppings variados.	açaí supremo, fresa, banano, yogurt, kiwi, coco, arándanos, semillas, crema de maní	Bowls Frutales	99	No inventariables	\N	\N
36d50cac-2255-4963-b89a-6d7e29450faf	acomp-torta-dia	Torta del día	8800	\N	torta, zanahoria, arándanos, naranja, coco, yogurt griego	Acompañamientos	99	No inventariables	\N	\N
c8d3d813-2118-4791-a0e5-69b951cfb7f1	inv-sandia	Sandía	6000	6k el kilo	sandía fruta fresca	Frutas	0	Inventariables	cantidad	\N
d25e85bb-2f7c-4162-8217-a7f063bcdd50	inv-granola	Granola	0	\N	granola	Semillas	0	Inventariables	\N	\N
56362b50-3801-4686-aed2-a483b9960532	inv-pepino	Pepino	1500	\N	pepino	Vegetales	2	Inventariables	cantidad	\N
f16c3e67-8372-411d-a0ab-98454d87dc35	inv-queso-crema	Queso doble crema	0	una taja y medio empaquetadas en triángulos	queso crema	Lácteos	80	Inventariables	cantidad	\N
d91e4dd0-47a5-46fc-bf29-35b764305016	acomp-galleta-avena	Galletas de avena	4000	\N	galletas avena	Acompañamientos	99	No inventariables	\N	\N
0d145a50-a0e9-4b6e-a72c-ae6f62869358	inv-pina	Piña	0	\N	piña fruta fresca	Frutas	0	Inventariables	\N	\N
2311e08c-dde0-4cd2-b9f7-1ba355a8e7f1	inv-pitaya	Pitaya	0	\N	pitaya fruta fresca	Frutas	0	Inventariables	\N	\N
9e53b412-3e52-460d-b1be-430fc49b42d2	inv-leche	Leche	0	\N	leche líquida	Lácteos	0	Inventariables	cantidad	\N
3439660a-0c97-4849-82e3-13d222bbf131	inv-chia	Semillas de chía	0	\N	chía	Semillas	0	Inventariables	\N	\N
7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	acomp-muffin-queso	Muffin de queso	4500	\N	muffin queso	Acompañamientos	99	No inventariables	\N	\N
28edafa3-ac74-41f0-ae95-a4ea8efc5f33	acomp-tapitas	Tapitas	10000	Pan con queso feta, tomate al horno y albahaca.	tapitas, pan, queso feta, tomate al horno, albahaca	Acompañamientos	99	No inventariables	\N	\N
84ce9a61-d186-47cb-92b4-afa4d5847dab	beb-americano	Americano	5500	\N	americano	Bebidas Calientes	99	No inventariables	\N	\N
65772588-ca95-4f79-9ed8-416773cc698b	inv-yogurt	Yogurt natural	0	\N	yogurt natural	Lácteos	0	Inventariables	\N	\N
7d3fef49-18f7-4513-862c-26e3fcf98c64	inv-mango	Mango	3600	4k el kilo	mango fruta fresca	Frutas	3	Inventariables	cantidad	\N
fa107d92-d59b-4686-b51f-7df33766c361	beb-capuccino	Capuccino	6000	\N	capuccino	Bebidas Calientes	99	No inventariables	\N	\N
9570e5a7-af90-4277-91a0-dd6a3de80bd7	bowl-vital	Vital	12000	Mango, banano, piña, espinaca, yogurt, leche y toppings.	vital, mango, banano, piña, espinaca, yogurt, granola, chía, coco	Bowls Frutales	99	No inventariables	\N	\N
522d937d-7d2d-4c3a-b785-f692a09b8a37	beb-cocoa	Cocoa	6000	\N	cocoa	Bebidas Calientes	99	No inventariables	\N	\N
fe196a9f-e68f-4df6-ab98-5a2c58ad9b16	beb-infusion-frutos	Infusión de frutos rojos	6000	\N	infusión frutos rojos	Bebidas Calientes	99	No inventariables	\N	\N
3bb93296-c6c5-456a-b165-73c1a20a3134	beb-latte	Latte	5500	\N	latte	Bebidas Calientes	99	No inventariables	\N	\N
996be55c-5666-42fd-bb8b-4ef44cd82194	beb-pitaya-latte	Pitaya Latte	8500	\N	pitaya latte	Bebidas Calientes	99	No inventariables	\N	\N
114e2c84-cf03-47a9-abae-b3edd6911ded	bowl-salado	Bowl Salado	16000	Personaliza tu bowl con 2 bases, 4 toppings y 1 proteína.	bowl salado, arroz, pasta, quinua, pollo, cerdo, carne, toppings	Bowls Salados	99	No inventariables	\N	\N
60c3451b-db1a-45f4-8480-585e01fe2242	sand-mexicano	Mexicano	19000	Frijol refrito, pollo desmechado, pico de gallo, queso crema tajado, guacamole, sour cream, salsa brava.	mexicano, pollo desmechado, guacamole, pico de gallo, frijol refrito, salsa brava, sour cream, queso tajado	Sandwiches	99	No inventariables	\N	\N
b68386e8-b73e-422b-a5b6-47d622faac19	sand-pollo-green	Pollo Green	17000	Mayonesa de rostizados y verde, jamón de pollo, guacamole, tomate horneado, semillas de girasol, lechuga, tocineta.	pollo green, jamón de pollo, rúgula, champiñones, parmesano, guacamole, salsa verde, salsa rostizada, lechuga, tomate horneado, semillas	Sandwiches	99	No inventariables	\N	\N
7c59e7d8-e7dc-4dc5-9bf4-c0e1e879b99d	inv-champinones	Champiñones	29500	1 paquete de kilo: 29500	champiñones	Vegetales	3	Inventariables	cantidad	\N
5b128ddb-0463-4551-8409-68a5b26c32bb	inv-tomate	Tomate	9000	5000 el kilo	tomate	Vegetales	2000	Inventariables	gramos	g
f0970c1d-9ee1-4a8e-a946-58c01aa22b33	desayunos-desayuno-improvisado-sh00	Desayuno Improvisado	13000	Huevo Revuelto con 2 panes integrales y topings de bowls salados y bebida caliente	\N	Desayunos	99	No inventariables	\N	\N
31a6d560-88e6-45ec-9177-0625136ffe22	batido-matcha-protein	Matcha Protein	16000	Té matcha con 1 scoop de proteína whey (30 g).	matcha protein, té matcha, proteína, whey, 30 g, batido especial, alto en proteína	Batidos especiales	99	No inventariables	\N	\N
0fbc16e4-ff90-46bc-bb85-971c3617df7f	acompanamientos-jugo-extra-gq3f	Jugo extra	2000	Jugo del día extra	\N	Acompañamientos	0	No inventariables	\N	\N
7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	acompanamientos-adicion-proteina-4if7	Adición Proteina	5000	Pechuga de pollo, Jamón de cerdo o Carne desmechada	\N	Acompañamientos	99	No inventariables	\N	\N
26512d4f-4da0-4f68-9df9-a325cf972beb	acompanamientos-adicion-proteina-polvo-65cw	Adición Proteina Polvo	6000	Proteina en polvo para batidos.	\N	Acompañamientos	99	No inventariables	\N	\N
a1a2c0c2-0779-46b4-87cc-f47473361928	acompanamientos-adicion-granola-x65h	Adición Granola	3000	Adición Granola Para batidos y bowls	\N	Acompañamientos	99	No inventariables	\N	\N
41255860-00f8-4653-b288-4cc4d9412cff	inv-cacao	Cacao puro	0	\N	cacao puro	Bebidas	0	Inventariables	\N	\N
a46047fe-38ef-45ec-91e9-9caaa9134ea6	inv-coco	Coco rallado	0	\N	coco	Semillas	0	Inventariables	\N	\N
6daad8c7-a56b-41bb-aac2-39865602fde4	inv-cafe	Café	0	\N	café	Bebidas	0	Inventariables	\N	\N
22750722-2b13-402d-9644-071a9a40409a	inv-curcuma	Cúrcuma	0	\N	cúrcuma	Especias	0	Inventariables	\N	\N
c260a933-f796-416a-9d0c-ab2b4e769e33	acompanamientos-adicion-chia-lt6u	Adición Chía	3000	Adición de Chia para bowls y batidos 	\N	Acompañamientos	99	No inventariables	\N	\N
c45b5d0d-73bd-4ea1-a6c0-5aff86a3df34	inv-miel	Miel	0	\N	miel	Especias	0	Inventariables	\N	\N
170a8ba1-1e9c-4927-a83b-77818855e328	inv-maca	Maca	0	\N	maca	Especias	0	Inventariables	\N	\N
2486b0c9-520c-48fd-ad05-d7f5b506bb21	inv-proteina	Proteína whey	0	\N	proteína whey	Bebidas	0	Inventariables	\N	\N
55a58658-65cd-43dd-a160-6449b3f38a1c	acompanamientos-adicion-topping-ew1q	Adición Topping para bowls frutales	2000		\N	Acompañamientos	99	No inventariables	\N	\N
fb87265d-4925-4fc3-be32-7c55e611f5e6	acompanamientos-scoop-de-proteina-7wfh	Scoop de Proteina	5000	Scoop de proteina para batidos	\N	Acompañamientos	99	No inventariables	\N	\N
e4ef84e9-7c50-44dc-9b75-8dc2705fd748	salsas-salsa-verde-ehsv	Salsa Verde	0		\N	Salsas	1	Inventariables	cantidad	\N
d4f6e89a-8cbe-4ecd-b524-b731b1223b24	matcha-latte-helado	Matcha latte helado	11000	Té matcha con leche y hielo.	matcha latte helado, té matcha, leche, hielo, bebida fría	Bebidas frías	99	No inventariables	\N	\N
275ac6ba-66d3-4158-9fd1-0cc031c35a8f	acompanamientos-adicion-de-salsa-vs3h	Adición de Salsa	3000	Adición de Salsa para Sandwich o Bowl	\N	Acompañamientos	99	No inventariables	\N	\N
05d9250c-df43-4f67-9fc5-f2e70f3b49ea	acompanamientos-granola-vtiz	Granola	7000	Granola de diferentes sabores	\N	Acompañamientos	99	No inventariables	\N	\N
fc11776c-aef5-449a-9fcf-1e982a0b35ab	acompanamientos-leche-vegetal-niu0	Leche vegetal	3000	Leche de almendras o leche de avena	\N	Acompañamientos	99	No inventariables	\N	\N
bbe7a283-40e4-4d35-bac2-1aa7423a4058	batidos-refrescantes-amanecer-9o4k	Amanecer	9500	Mango, piña, menta, semillas de chía.	\N	Batidos refrescantes	99	No inventariables	\N	\N
f3e97ba3-6dc6-4847-becf-7f84e94873f2	batidos-refrescantes-pina-rosa-pgde	Piña rosa	9500	Hierbabuena, pitaya rosada, piña, limón.	\N	Batidos refrescantes	99	No inventariables	\N	\N
35a41129-ef96-43e6-8ebc-7c14c4d26605	batidos-refrescantes-sandia-salvaje-qmn2	Sandía salvaje	9500	Sandía, fresa, hierbabuena, limón, kiwi.	\N	Batidos refrescantes	99	No inventariables	\N	\N
2f8a28bd-4987-4e33-995f-932f31d24255	batidos-funcionales-antioxidante-n3p2	Antioxidante	10500	Sandía, remolacha, jengibre, mora, limón, chía.	\N	Batidos funcionales	99	No inventariables	\N	\N
1926274b-2765-4f72-810f-6e79ad575a91	batidos-funcionales-detox-pt8p	Detox	10500	Jengibre, apio, perejil, menta fresca, manzana verde, kiwi, pepino, naranja, miel.	\N	Batidos funcionales	99	No inventariables	\N	\N
16325ab3-d934-4d9d-9573-056bded27d08	batidos-funcionales-digest-f7d4	Digest	10500	Sábila, piña, kiwi, chía, naranja, miel.	\N	Batidos funcionales	99	No inventariables	\N	\N
a923676d-77da-4843-9df2-8eb637965cb4	batidos-funcionales-golden-milk-ty5b	Golden milk	10500	Mango, banano, yogurt natural, leche, miel, chía, cúrcuma, maca.	\N	Batidos funcionales	99	No inventariables	\N	\N
febcfb4f-bc51-4719-89dd-765ed174f19b	batidos-funcionales-saciante-plp7	Saciante	10500	Arándano, fresa, banano, leche, chía, avena.	\N	Batidos funcionales	99	No inventariables	\N	\N
890a38ce-311d-45f0-b602-f10798189185	blue-latte-helado	Blue latte helado	10500	Té azul en leche o bebida vegetal con hielo.	blue latte, té azul, bebida vegetal, leche, hielo, bebida fría	Bebidas frías	99	No inventariables	\N	\N
a6180a54-dcea-4af5-a873-455b03618324	cafe-pitaya	Café Pitaya	10500	Café y pitaya rosa.	café pitaya, pitaya rosa, café frío, bebida fría	Bebidas frías	99	No inventariables	\N	\N
2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	limonada-azul	Limonada azul	10000	Mezcla de limón y té azul.	limonada azul, limón, té azul, bebida fría, refrescante	Bebidas frías	99	No inventariables	\N	\N
c7572bb3-01f8-4c66-a3e3-0c262093761c	acompanamientos-bolsa-vgbf	Bolsa para paquetes regulares	1000	Bolsa para llevar	\N	Acompañamientos	99	No inventariables	\N	\N
20cc1e0f-330e-42b7-b8b9-05c1069d7682	sand-jamon-artesano	Jamón artesano	19000	Salsa verde, queso doble crema, jamón de cerdo, rúgula, tomates horneados, parmesano.	jamón artesano, jamón de cerdo, miel de uvilla, cebolla, tomate horneado, rúgula, queso tajado, queso parmesano, salsa verde	Sandwiches	99	No inventariables	\N	\N
153a1ea3-1420-4d88-b427-c23254b00bde	batido-moca-energy	Moca Energy	12000	Banano, café frío y leche con cacao puro, crema de maní y avena.	moca energy, banano, café frío, leche, cacao puro, crema de maní, avena, batido especial, energía	Batidos especiales	99	No inventariables	\N	\N
c3704705-037f-40c4-976c-d0576e944b21	batido-pink	Pink	12000	Fresa y banano con yogurt natural y leche; chía y avena.	pink, fresa, banano, yogurt natural, leche, chía, avena, batido especial	Batidos especiales	99	No inventariables	\N	\N
290b77dc-ac81-48e0-bb33-70fefbe3273b	acompanamientos-chips-de-arracacha-e88x	Chips de arracacha	6000	Chips	\N	Acompañamientos	2	Inventariables	cantidad	\N
a60362be-1697-427a-9786-5463366d338a	acompanamientos-cupcake-de-avena-y-nueces-1flj	Cupcake de avena y nueces 	6800		\N	Acompañamientos	99	No inventariables	\N	\N
1bee1de0-2321-4e6e-a97e-05fd409ec1bc	acompanamientos-porcion-de-cheeseecake-nlgk	porción de cheeseecake	6000	cheesecake del día	\N	Acompañamientos	99	No inventariables	\N	\N
d926114a-0a5e-4e7d-891a-3d99d3545f44	salsas-salsa-brava-i2qp	Salsa Brava	0		\N	Salsas	0	Inventariables	cantidad	\N
46abd0cc-6601-4bac-906f-386b1224e2c6	salsas-salsa-sour-cream-3r30	Salsa Sour Cream	0		\N	Salsas	10	Inventariables	cantidad	\N
33564f53-bafd-4853-b33b-28e67e19f29f	inv-te-matcha	Té matcha	0	\N	té matcha	Bebidas	0	Inventariables	\N	\N
f8e85d01-41b6-4ad5-8430-19a2406317f2	frutas-uvillas-xph8	Uvillas	0		\N	Frutas	0	Inventariables	\N	\N
fb3263d0-06b3-436c-be4e-1acac2ef9dba	acompanamientos-cupcakes-de-banano-offy	Cupcakes de banano	6800		\N	Acompañamientos	99	No inventariables	\N	\N
0b5fba44-5262-4675-9109-054cd8048c6a	vegetales-rugula-j4xu	Rugula	3000	1 paquete de rúgala	\N	Vegetales	1	Inventariables	cantidad	\N
88978ae9-896d-4c45-9681-d35431e96957	limpieza-vinagre-auaa	Vinagre	7900	vinagre en 3 litros	\N	limpieza 	3000	Inventariables	gramos	g
82872f5a-f0a4-4cb9-a28e-3c18d8e89613	porciones-de-carne-porcion-de-jamon-de-cerdo-5d1m	Porción de jamón de cerdo	0	jamón de cerdo por unidad de 55g cada una	\N	Porciones de carne	13	Inventariables	cantidad	\N
9f74032d-fb07-419a-94b3-162a3413aee4	preparados-cupcakes-de-avena-y-nueces-que-entran-ishq	Cupcakes de avena y nueces que entran	5000		\N	Preparados	6	Inventariables	cantidad	\N
87eb7166-053d-4739-9511-ff90b826ada6	bebidas-frias-hatsu-400ml-y18c	Hatsu 400ml	6000		\N	Bebidas frías	99	No inventariables	\N	\N
054aac2c-295e-4f36-8c32-445ca1757b0d	vegetales-sabila-8nwn	Sábila	1500	hoja de sábila 	\N	Vegetales	1	Inventariables	cantidad	\N
92eb415e-32bb-4638-a66e-941862fa4cbf	especias-hierbabuena-huvj	Hierbabuena	1000	Paquete = unidad	\N	Especias	1	Inventariables	cantidad	\N
306e7110-d1b7-4ee7-940d-1514e0eac0f6	pan-pan-perro-h3wa	Pan blanco	1100		\N	Pan	25	Inventariables	cantidad	\N
0a9fb586-45eb-49ce-a175-736c13281eb2	especias-menta-0l19	Menta	1000	paquetes = unidades	\N	Especias	1	Inventariables	cantidad	\N
848bb078-749a-44a9-9033-12d7ee668b1f	especias-mani-tostado-rkk9	Maní tostado	3000	unidad = paquete	\N	Especias	2	Inventariables	cantidad	\N
a4776793-7d1f-4d4c-a91f-92b01f028fda	pan-pan-ciabatta-jdvm	Pan Ciabatta 	1400		\N	Pan	24	Inventariables	cantidad	\N
fdb97896-5ff0-4219-8610-52a462ff5553	vegetales-maiz-dulce-td03	Maiz Dulce	6000	cada unidad es de 500 gramos	\N	Vegetales	3	Inventariables	cantidad	\N
2f5d3870-d1c1-4ef5-bf62-fad318e063d3	preparados-torta-del-dia-jfxn	Torta del dia	55000	torta del día que se divide en 8 porciones 	\N	Preparados	1	Inventariables	cantidad	\N
f6210b5d-028a-4c51-9d0d-defd10ee4632	frutas-limon-ahvj	limon	6000	3000 el kilo	\N	Frutas	2000	Inventariables	gramos	g
4f71ade6-f116-44ac-bda4-9e0b0dabe21a	frutas-aguacate-vb4u	Aguacate	12000	6k el kilo	\N	Frutas	2000	Inventariables	gramos	g
6376dec9-6f45-4e48-8d5b-69ecad92d799	especias-romero-t5te	romero	1000	paquete = unidad	\N	Especias	1	Inventariables	cantidad	\N
eeeef988-13e3-4c20-a92b-77a93ad0e651	preparados-cheeseecake-de-8-porciones-qiz1	cheeseecake de 8 porciones	36000		\N	Preparados	1	Inventariables	cantidad	\N
7f4f6823-2bee-4de1-a248-c574f68bba72	bebidas-frias-botella-de-agua-gt3t	Botella de agua 	2500		\N	Bebidas frías	99	No inventariables	\N	\N
dc76d303-d641-47c9-9bc1-5dd40dd55ad0	limpieza-toallas-para-manos-l6nk	toallas para manos	4800	paquete de toallas para manos	\N	limpieza 	1	Inventariables	cantidad	\N
5e1d7b13-3a8b-4e20-adad-bcd7e58ec6d2	carne-desmechada-oaz1	Porción de carne desmechada	0	carne desmechada por unidad de 55g cada una	\N	Porciones de carne	35	Inventariables	cantidad	\N
2223f69e-9ba7-433b-9162-88080d3903c3	limpieza-bolsas-de-basura-lwyr	Bolsas de basura	1900	Paquete de bolsas de basura	\N	limpieza 	2	Inventariables	cantidad	\N
43d1bcff-0798-43db-beea-f7c8873acc3c	especias-cilantro-jooe	Cilantro	1000	paquete de cilantro a 1000	\N	Especias	1	Inventariables	cantidad	\N
b8140789-e463-4b8f-a0a2-543f30c60770	especias-sal-de-cocina-d1g1	Sal de cocina	2700		\N	Especias	1	Inventariables	gramos	g
8516b407-739b-4141-8377-9bab3b8d447c	cafeteria-aromatica-otxm	Aromatica	2000	caja de aromatica	\N	cafetería 	2	Inventariables	cantidad	\N
29178b97-7251-475b-8541-076d4ae96889	lacteos-cuajada-3mfr	Cuajada	13000		\N	Lácteos	1	Inventariables	cantidad	\N
18ae90eb-250c-4dff-bee2-7a5bfe3a30ff	vegetales-zanahoria-p7c2	Zanahoria	2500	2500 el kilo	\N	Vegetales	1000	Inventariables	gramos	g
f0a8c6a6-1f9b-41a0-97b0-d9ad4a9c3022	cafeteria-azucar-czvi	Azucar	3800		\N	cafetería 	1000	Inventariables	gramos	g
2798ad2f-73f8-4a2d-b37f-79f780b32eeb	acompanamientos-domicilio-pjsg	domicilio	7000		\N	Acompañamientos	99	No inventariables	\N	\N
e839d48b-abd3-497e-ab9b-cb4aa78eb773	acompanamientos-domicilio-o9gt	domicilio 	6500		\N	Acompañamientos	99	No inventariables	\N	\N
f4eeb7cc-c281-44ab-92ff-e0cd4a9ec8ed	acompanamientos-empanada-argentina-9toa	Empanada Argentina	5500	Espinaca y ricota. Tomate, mozarella y albahaca. Choclo, salsa blanca y queso. Atún y cebolla. Carne, huevo duro y aceitunas. Jamón, mozarella y orégano. Pollo al verdeo y tocineta	\N	Acompañamientos	99	No inventariables	\N	\N
6a561a5e-1a59-41b5-9a6d-eb8dae2eaeef	acompanamientos-empanada-argentina-vegetal-5hd4	Empanada Argentina Vegetal	5000		\N	Acompañamientos	99	No inventariables	\N	\N
43804c87-d964-44ea-83cf-8e56b58a1c92	bebidas-frias-botella-de-agua-pequena-5n3h	Botella de agua pequeña	1000		\N	Bebidas frías	99	No inventariables	\N	\N
bed3342f-2b63-4270-81fe-4d37d1b8f929	sandwiches-cajita-de-hatsu-adicional-con-sandwiches-ff69	Cajita de hatsu adicional con sandwiches	1000	Promocion de de hatsu para sandwiches	\N	Bebidas frías	99	No inventariables	\N	\N
28e2dfa3-3e2b-4ff4-bc17-ab4dcd35c956	bowls-salados-domicilio-7500-zd01	domicilio 7500	7500	7500	\N	Bowls Salados	99	No inventariables	\N	\N
ed74f62f-d2d3-4cf1-a688-dc615363f8c9	sand-del-huerto	Del huerto	16000	Mayonesa de rostizados, queso feta, rúgula, tomates horneados, champiñones, parmesano, mix de semillas, chips de arracacha.	del huerto, champiñones, mayonesa rostizada, queso feta, crocantes de arracacha, tomate horneado, semillas de calabaza, queso tajado	Sandwiches	99	No inventariables	\N	\N
8c01b1af-7386-4e63-ad93-f08cc8bf8522	preparados-cupcakes-de-banano-que-entran-dv9d	Cupcakes de banano que entran	5000		\N	Preparados	6	Inventariables	cantidad	\N
816ee519-8242-429e-be28-835e60746135	porciones-de-carne-porcion-de-pollo-wykq	Porción de pollo	0	pechuga de pollo por unidad de 55g cada una	\N	Porciones de carne	35	Inventariables	cantidad	\N
1e5cc21c-d84b-43b8-af49-db76e1ce5a28	especias-ajo-49l1	Ajo	500	500 la cabeza de ajo	\N	Especias	6	Inventariables	cantidad	\N
438dd0c6-70f4-4fa5-b1d5-cba96dcbd8a3	bowl-frutal-armable	Bowl Frutal	13500	Bowl frutal personalizable: base + toppings.	bowl frutal personalizable frutos rojos frutos amarillos vital toppings yogurt griego	Bowls Frutales	99	No inventariables	\N	\N
23e07c8e-29a2-4a0b-9456-c340810b3fe8	acompanamientos-bolsa-para-tortas-4op0	bolsa para tortas	500		\N	Acompañamientos	99	No inventariables	\N	\N
23c954f3-1c76-434e-873c-4a53392ca14d	especias-cebolla-eif7	Cebolla	6000	kilo de cebolla 3000	\N	Especias	2000	Inventariables	gramos	g
33e79d05-54a4-4e56-9333-4193025a9d36	proteinas-pollo-chicken-ih22	Pollo Chicken	73600		\N	Proteínas	1251	Inventariables	gramos	g
fb899fb1-a8fc-4382-afc0-ad42a4dcc056	proteinas-carne-desmechada-tjl2	Carne Desmechada	78000	Carne para bowls	\N	Proteínas	5101	Inventariables	gramos	g
7ee3523f-4f61-4481-8fd6-4a4b54f4f071	proteinas-carne-de-cerdo-yfss	Carne de Cerdo	29000	Carne de cerdo para bowls - sandwiches	\N	Proteínas	1001	Inventariables	gramos	g
\.


--
-- Data for Name: gastos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."gastos" ("id", "descripcion", "monto", "categoria", "fecha", "metodopago", "created_at", "es_inventariable", "menu_item_id", "cantidad_inventario", "inventario_tipo", "unidad_inventario", "lugar_compra") FROM stdin;
6db8a875-8b34-4c08-b3a1-df3acb049c1b	domicilio carne	5000	Transporte	2025-09-30	efectivo	2025-09-30 22:02:51.329+00	f	\N	\N	\N	\N	\N
c2166ac5-28ef-4823-98e4-6fb3387e1fb6	aguacates	5000	Ingredientes	2025-09-30	efectivo	2025-09-30 22:22:59.459+00	f	\N	\N	\N	\N	\N
0af4f833-ddf0-454b-a7c3-740789e97475	huevos	10000	Ingredientes	2025-09-30	efectivo	2025-09-30 22:35:32.056+00	f	\N	\N	\N	\N	\N
e3e1a1d9-46be-422f-bf81-10e61f164647	Mayonesa Verde	30800	Ingredientes	2025-10-01	efectivo	2025-10-01 21:38:18.667+00	f	\N	\N	\N	\N	\N
f7b7bdc4-4a31-40ec-aea4-286ba870a6e4	noemi	378000	Ingredientes	2025-09-30	nequi	2025-09-30 22:56:29.942+00	f	\N	\N	\N	\N	\N
786efe72-4b29-4a12-8e2a-e1bcb4d5baac	Uvillas	3800	Ingredientes	2025-09-23	efectivo	2025-09-23 16:15:56.054+00	f	\N	\N	\N	\N	\N
c5b7b0c0-9409-4c07-ab55-d16be77c8091	Panela	2900	Ingredientes	2025-09-23	efectivo	2025-09-23 16:16:22.3+00	f	\N	\N	\N	\N	\N
b82e5b20-bbe7-448b-be66-e363cc409a36	Champiñones	28000	Ingredientes	2025-09-23	efectivo	2025-09-23 16:42:57.777+00	f	\N	\N	\N	\N	\N
b9a97ba9-60c1-4898-bdfb-22f1b4da4446	Aguacates	12000	Ingredientes	2025-09-23	efectivo	2025-09-23 20:16:30.334+00	f	\N	\N	\N	\N	\N
5f05c3e1-2cf2-4808-bc86-946cf5917809	tocino	56000	Ingredientes	2025-09-23	efectivo	2025-09-23 21:14:21.525+00	f	\N	\N	\N	\N	\N
da87fdde-20a3-427f-83e6-df461b56e6dc	kiwi	11500	Ingredientes	2025-09-23	efectivo	2025-09-23 21:29:44.268+00	f	\N	\N	\N	\N	\N
729fd5d2-8d73-4035-8237-0e6de80f91e8	leche andi	24900	Ingredientes	2025-09-23	efectivo	2025-09-23 22:54:53.109+00	f	\N	\N	\N	\N	\N
9ac3936a-d9e1-4e86-9bee-ef53da1dfe82	Quajada	12000	Ingredientes	2025-09-23	efectivo	2025-09-24 00:45:47.668+00	f	\N	\N	\N	\N	\N
1f5ecb57-fa8c-4c33-9df3-bbdd20b6cd27	Cilantro	1000	Ingredientes	2025-09-23	efectivo	2025-09-24 00:46:12.594+00	f	\N	\N	\N	\N	\N
3927a6f7-c003-49af-bfe4-19f537b10f2e	Pan Sandwich	19600	Ingredientes	2025-09-24	efectivo	2025-09-24 16:29:44.727+00	f	\N	\N	\N	\N	\N
b960b12c-e282-4469-9a47-64dc29f813ec	Aguacate	12000	Ingredientes	2025-09-24	efectivo	2025-09-24 16:29:56.847+00	f	\N	\N	\N	\N	\N
1d5e34ad-9dce-4ebd-887d-2e519e5bb99a	Champiñones	17600	Ingredientes	2025-09-24	efectivo	2025-09-24 16:42:13.324+00	f	\N	\N	\N	\N	\N
4e2b6c5a-f72a-48b1-825f-fbde0061c282	Toalla Cocina	3600	Ingredientes	2025-09-24	efectivo	2025-09-24 17:00:30.732+00	f	\N	\N	\N	\N	\N
cbe0a98e-aec8-4d57-9e96-de8d09a60318	Servilletas	4500	Equipos	2025-09-24	efectivo	2025-09-24 17:05:56.868+00	f	\N	\N	\N	\N	\N
4236d432-643a-442a-9e08-2eb3c91bc998	Desengrasante	6300	Equipos	2025-09-24	efectivo	2025-09-24 17:06:34.546+00	f	\N	\N	\N	\N	\N
6b1e2490-4125-46a4-917f-56d548641bbd	Aceite	12600	Equipos	2025-09-24	efectivo	2025-09-24 17:06:56.866+00	f	\N	\N	\N	\N	\N
7534af85-7297-4a68-8412-765381d91c52	Domicilio	6000	Transporte	2025-09-24	efectivo	2025-09-24 20:22:09.817+00	f	\N	\N	\N	\N	\N
46d89c96-3208-413a-8247-4f6e96d25016	Queso Crema	13200	Ingredientes	2025-09-24	efectivo	2025-09-24 20:37:06.07+00	f	\N	\N	\N	\N	\N
1e81aa05-d1c8-478e-a033-d75529542c08	Champiñones, Limón Taití	26600	Ingredientes	2025-09-24	efectivo	2025-09-24 16:31:29.077+00	f	\N	\N	\N	\N	\N
a7a967dc-07d8-401e-baaf-7ed1aa9ada65	Quesillo	12000	Ingredientes	2025-09-24	efectivo	2025-09-24 16:31:53.753+00	f	\N	\N	\N	\N	\N
8091d6bc-85c8-481c-b646-4c888d050415	Pollo Belén	56000	Salarios	2025-09-24	efectivo	2025-09-24 16:42:50.877+00	f	\N	\N	\N	\N	\N
71a698a0-ed2d-4ddd-86fa-b4e087c7eda3	Carne	56000	Ingredientes	2025-09-24	efectivo	2025-09-25 01:02:35.389+00	f	\N	\N	\N	\N	\N
21eae36a-9489-4253-ac0b-ac59cfd907b1	lacteos 	48500	Ingredientes	2025-09-25	efectivo	2025-09-25 17:44:44.164+00	f	\N	\N	\N	\N	\N
5925198c-5cd6-46a4-a4bd-1073ed51165e	frutas	31500	Ingredientes	2025-09-25	efectivo	2025-09-25 17:45:29.583+00	f	\N	\N	\N	\N	\N
59370c05-e520-4f30-85db-a67fc040a3ab	coco rallado	8500	Ingredientes	2025-09-25	efectivo	2025-09-25 21:46:22.319+00	f	\N	\N	\N	\N	\N
40a1c3d3-f7c2-463d-8e59-3a9486f8f788	tocino 	56000	Ingredientes	2025-09-25	efectivo	2025-09-25 21:55:37.771+00	f	\N	\N	\N	\N	\N
f3db0e55-18fd-43b6-8055-bb6399070601	chips de vege	21000	Ingredientes	2025-09-25	efectivo	2025-09-25 21:57:29.059+00	f	\N	\N	\N	\N	\N
9898a360-4a61-4042-a0c3-77d37d2fdd37	carnes	310700	Ingredientes	2025-09-25	efectivo	2025-09-25 22:58:12.165+00	f	\N	\N	\N	\N	\N
3e338c8b-a400-4913-bdbb-4ec1726f23a1	pastelería	364000	Ingredientes	2025-09-25	nequi	2025-09-25 22:58:49.043+00	f	\N	\N	\N	\N	\N
aa368303-a654-42d7-b6ed-ac19f1a43b0b	energía 	118600	Servicios públicos	2025-09-25	nequi	2025-09-25 23:03:31.165+00	f	\N	\N	\N	\N	\N
29c0f0f1-f1f0-435f-b30e-9d5d8a07eb14	agua	83500	Servicios públicos	2025-09-25	nequi	2025-09-25 23:07:15.637+00	f	\N	\N	\N	\N	\N
61c25838-ef44-4458-a4ff-f257b509a636	carnes 	235500	Ingredientes	2025-09-21	nequi	2025-09-25 23:12:15.522+00	f	\N	\N	\N	\N	\N
564957bd-fc85-40bf-998b-99e8cc12db30	internet	77300	Servicios públicos	2025-09-24	nequi	2025-09-25 23:21:25.132+00	f	\N	\N	\N	\N	\N
b0949a81-d435-4216-9cb2-526d53af8ba0	Andres David devolver a Bri	371000	Salarios	2025-09-21	nequi	2025-09-25 23:24:17.338+00	f	\N	\N	\N	\N	\N
85fb5b87-02fc-4deb-b4d2-9b5f471ded10	champiñones	56000	Ingredientes	2025-09-26	efectivo	2025-09-26 15:10:12.409+00	f	\N	\N	\N	\N	\N
537aa832-0c59-4ecd-a225-d5187da0967b	semillas de girasol	6000	Ingredientes	2025-09-26	efectivo	2025-09-26 15:59:04.704+00	f	\N	\N	\N	\N	\N
5670d8e9-e839-4c45-99c0-bbee4c023361	atomizador	6000	Otros	2025-09-26	efectivo	2025-09-26 17:39:03.764+00	f	\N	\N	\N	\N	\N
3594fd5b-a896-4776-985b-0aa9ecd839d8	aguacate	30000	Ingredientes	2025-09-26	nequi	2025-09-26 18:03:01.441+00	f	\N	\N	\N	\N	\N
d77ef232-c5c8-4fa1-af23-57d4d896455a	Bananos	4800	Ingredientes	2025-09-26	efectivo	2025-09-26 19:39:25.984+00	f	\N	\N	\N	\N	\N
d24c6375-e447-473e-b6d9-2e0e019825fd	Guantes	2000	Equipos	2025-09-27	efectivo	2025-09-27 15:22:29.113+00	f	\N	\N	\N	\N	\N
504e4ab2-b7f1-432c-b7ef-713757fda634	Bambas	500	Equipos	2025-09-29	efectivo	2025-09-29 15:03:29.422+00	f	\N	\N	\N	\N	\N
7fd5cb22-1b5e-466c-84b3-2d32319faae0	Matcha	20000	Ingredientes	2025-09-29	efectivo	2025-09-29 15:39:05.614+00	f	\N	\N	\N	\N	\N
eb1c9a77-8977-446a-b5dc-ee5e97ec2a4e	Aguacates	10000	Ingredientes	2025-09-29	efectivo	2025-09-29 15:39:22.247+00	f	\N	\N	\N	\N	\N
fc0f6907-c47e-4feb-ab70-c9cfd65aafa0	Leche	68800	Ingredientes	2025-09-29	efectivo	2025-09-29 17:23:45.664+00	f	\N	\N	\N	\N	\N
80edfe2f-a564-4f29-9d35-acfeed6a8828	Quesillo	12000	Ingredientes	2025-09-29	efectivo	2025-09-29 20:32:22.068+00	f	\N	\N	\N	\N	\N
9e4d2ab0-a3a0-4e79-be4a-0890c5860515	Romero	1000	Ingredientes	2025-09-29	efectivo	2025-09-29 20:32:44.657+00	f	\N	\N	\N	\N	\N
9e861a48-3e9c-4ebe-8d26-a1410978c9ed	panes	48000	Ingredientes	2025-09-29	efectivo	2025-09-29 21:17:50.651+00	f	\N	\N	\N	\N	\N
3a3ec5fe-351c-42e6-9168-c5fb32622e7b	yogurt griego 16 briyith	32000	Ingredientes	2025-09-29	efectivo	2025-09-29 23:16:42.813+00	f	\N	\N	\N	\N	\N
6dc3b77c-1977-4ef8-81b5-d51f8100bcb8	Abono Belen 	54000	Salarios	2025-09-29	efectivo	2025-09-29 23:40:51.496+00	f	\N	\N	\N	\N	\N
2086c40e-df64-4f6a-8726-9037280b8db1	carnes Belen	116000	Ingredientes	2025-09-29	efectivo	2025-09-30 00:19:42.475+00	f	\N	\N	\N	\N	\N
716e8392-3cbe-41c3-9865-5d9cdedd343d	Esponjas	12900	Equipos	2025-09-30	efectivo	2025-09-30 17:05:21.57+00	f	\N	\N	\N	\N	\N
1fbfb477-6fe1-4c17-8b71-2f49447e7b4c	Sarten Inducción	199000	Equipos	2025-09-30	nequi	2025-09-30 17:06:11.135+00	f	\N	\N	\N	\N	\N
5818a5a7-342d-4a96-8a75-39290bf470a8	Datiles	7900	Ingredientes	2025-09-30	efectivo	2025-09-30 17:07:09.388+00	f	\N	\N	\N	\N	\N
7a0bb736-8281-4f06-97b1-499c512e3e00	Pasta	7300	Ingredientes	2025-09-30	efectivo	2025-09-30 17:07:34.643+00	f	\N	\N	\N	\N	\N
f341aa20-376a-4963-9e33-cf47e2aad3e0	Sandia	8000	Ingredientes	2025-09-30	efectivo	2025-09-30 07:33:27.76+00	f	\N	\N	\N	\N	\N
5aa509dc-1567-41d3-98db-12b945af5ad4	Pepinos	6000	Ingredientes	2025-09-30	efectivo	2025-09-30 07:37:16.922+00	f	\N	\N	\N	\N	\N
ffd93d66-b0ef-412d-8bb0-c8aed04330ea	Zanahorias	2000	Ingredientes	2025-09-30	efectivo	2025-09-30 07:37:42.754+00	f	\N	\N	\N	\N	\N
c75a6402-2f13-4228-95d5-6d5b9f0a21bd	Bananos	3000	Ingredientes	2025-09-30	efectivo	2025-09-30 07:37:59.511+00	f	\N	\N	\N	\N	\N
2d57e4c5-b763-4123-a449-bd156f7c98bd	Abono Belen	54000	Salarios	2025-09-30	efectivo	2025-10-01 01:57:58.965+00	f	\N	\N	\N	\N	\N
9bf47e53-bf52-4fcf-942a-0d7de8f02b24	chips	20900	Ingredientes	2025-10-01	efectivo	2025-10-01 17:28:14.787+00	f	\N	\N	\N	\N	\N
77439bad-e108-4cba-901c-8cc99015f5be	fruver	64300	Ingredientes	2025-10-01	efectivo	2025-10-01 17:28:36.881+00	f	\N	\N	\N	\N	\N
aafbca94-1dc3-43af-afb9-8835f459cbdb	Tomates	9000	Ingredientes	2025-10-01	efectivo	2025-10-01 19:57:49.117+00	f	\N	\N	\N	\N	\N
da675df9-c588-4b94-baae-afd97199cb32	Tocineta	56000	Ingredientes	2025-10-01	efectivo	2025-10-01 20:44:46.412+00	f	\N	\N	\N	\N	\N
d1663903-a062-46d6-bea5-1eb23b8e9238	Jamon de Cerdo	37000	Ingredientes	2025-10-01	efectivo	2025-10-01 21:37:33.749+00	f	\N	\N	\N	\N	\N
20ddcf87-f0b9-4656-8ac7-42b986dfb076	pilas	6000	Mantenimiento	2025-10-01	efectivo	2025-10-01 23:54:40.819+00	f	\N	\N	\N	\N	\N
16c2594f-ad1f-4149-8661-16e320da6c6d	Notas	4000	Equipos	2025-10-02	efectivo	2025-10-02 14:15:41+00	f	\N	\N	\N	\N	\N
dca5abe2-f0f4-407e-b1dc-29a75c3906f5	Guantes	2000	Mantenimiento	2025-10-02	efectivo	2025-10-02 18:26:21.01+00	f	\N	\N	\N	\N	\N
3ff1d902-c8fb-48e0-8900-eb17ade04bc5	Frutas	28000	Ingredientes	2025-10-02	efectivo	2025-10-02 18:33:08.781+00	f	\N	\N	\N	\N	\N
71a48242-5150-4f42-9b01-4083e2c67225	Rugula	6000	Ingredientes	2025-10-02	efectivo	2025-10-02 19:34:15.815+00	f	\N	\N	\N	\N	\N
4778d1bc-266c-4e05-80ca-bbe61313591c	Bolsas Libra	4400	Equipos	2025-10-02	efectivo	2025-10-02 19:35:19.13+00	f	\N	\N	\N	\N	\N
afa1b394-2804-4b0f-ac5f-65d6d61b84ea	Fresas	20000	Ingredientes	2025-10-03	efectivo	2025-10-03 16:33:44.033+00	f	\N	\N	\N	\N	\N
53049c42-1083-452e-97a9-c6fc0f63f1b8	Champiñones	28000	Ingredientes	2025-10-03	efectivo	2025-10-03 16:34:00.238+00	f	\N	\N	\N	\N	\N
89f40a69-3a46-46d1-8312-a51f0ab74bfa	Pasta tornillo	8400	Ingredientes	2025-10-03	efectivo	2025-10-03 16:34:39.245+00	f	\N	\N	\N	\N	\N
503b6540-2320-42d6-94b3-b0d67b6fcfae	Jabon	2900	Mantenimiento	2025-10-03	efectivo	2025-10-03 19:11:13.126+00	f	\N	\N	\N	\N	\N
c4599a12-50ef-45cb-af61-60895d0bd8fb	Guantes	3000	Equipos	2025-10-06	efectivo	2025-10-06 15:03:20.724+00	f	\N	\N	\N	\N	\N
c9e5970b-988c-4c7b-af05-026274b94843	Queso Parmesano	37500	Ingredientes	2025-10-06	efectivo	2025-10-06 15:32:45.343+00	f	\N	\N	\N	\N	\N
a9c85c91-2a85-4554-8866-73a1d991f4a5	Champiñones	17600	Ingredientes	2025-10-06	efectivo	2025-10-06 15:51:49.525+00	f	\N	\N	\N	\N	\N
325a6800-bc57-47a9-9726-76e89089782a	Kiwi	12500	Ingredientes	2025-10-06	efectivo	2025-10-06 15:52:08.484+00	f	\N	\N	\N	\N	\N
4995a0bd-904f-4250-bfcc-096b2a9fbf04	Quesillo	12000	Ingredientes	2025-10-06	efectivo	2025-10-06 15:52:20.739+00	f	\N	\N	\N	\N	\N
f80e51e4-db19-4b14-9ac3-d964298ca5d5	Maní Tostado	9000	Ingredientes	2025-10-01	efectivo	2025-10-01 19:57:15.678+00	f	\N	\N	\N	\N	\N
e16c6154-e073-4bb0-ad89-2ca8a142f6c9	Champiñones	56000	Ingredientes	2025-10-07	efectivo	2025-10-07 19:08:26.224+00	f	\N	\N	\N	\N	\N
12edd37f-a7d3-4665-9376-a22ede7102b0	Pepino	6000	Ingredientes	2025-10-07	efectivo	2025-10-07 19:43:27.123+00	f	\N	\N	\N	\N	\N
16822dd2-de2b-4dae-bbc7-e007ed66a4e4	Zanahoria	2000	Ingredientes	2025-10-07	efectivo	2025-10-07 19:43:45.267+00	f	\N	\N	\N	\N	\N
190e03f5-d325-40dd-941d-ab3afebca16d	Quesillo	24000	Ingredientes	2025-10-07	efectivo	2025-10-07 19:44:17.589+00	f	\N	\N	\N	\N	\N
2e5a1c9f-f415-4c91-b1ce-ecc4bdee0f2a	Piña	7000	Ingredientes	2025-10-07	efectivo	2025-10-07 19:44:33.746+00	f	\N	\N	\N	\N	\N
adaa3b1a-c11c-4c80-bfb8-463fbe2f7888	Maiz Tierno	25000	Ingredientes	2025-10-07	efectivo	2025-10-07 19:45:41.843+00	f	\N	\N	\N	\N	\N
eb849861-090c-4ae9-82ea-4cf6efb6783e	quinoa	6500	Ingredientes	2025-10-07	efectivo	2025-10-07 21:30:03.492+00	f	\N	\N	\N	\N	\N
39ab647a-9209-40f4-a7ef-94e13d39f2fb	domicilio	6000	Transporte	2025-10-07	efectivo	2025-10-07 22:00:31.107+00	f	\N	\N	\N	\N	\N
332c958f-92ea-4d36-9d15-ca201932a437	tocino	56000	Ingredientes	2025-10-08	efectivo	2025-10-08 18:55:08.219+00	f	\N	\N	\N	\N	\N
a150c1e2-bed4-485d-a4f6-7cc08bf1e2db	vasos y tapas	8800	Otros	2025-10-08	efectivo	2025-10-08 19:08:26.812+00	f	\N	\N	\N	\N	\N
4b8ff80e-9169-4c50-bd92-1379ed804b31	domicilio fallido	7000	Transporte	2025-10-08	efectivo	2025-10-08 19:08:53.537+00	f	\N	\N	\N	\N	\N
36ebeac4-ee04-4b2b-a0ca-543f98efda50	Leche 	31900	Ingredientes	2025-10-08	efectivo	2025-10-08 19:42:37.296+00	f	\N	\N	\N	\N	\N
68ddea8e-4b3f-44c5-8214-669f4a3dd331	Yogurt sin Azucar	24800	Ingredientes	2025-10-08	efectivo	2025-10-08 19:44:52.666+00	f	\N	\N	\N	\N	\N
cbc678d2-d8a3-4fc0-8d33-5abb15e29b47	Bolsa	300	Ingredientes	2025-10-08	efectivo	2025-10-08 19:45:08.465+00	f	\N	\N	\N	\N	\N
e8e5ca55-6102-49fe-871f-7c4e24edf69e	Notas	5000	Equipos	2025-10-08	efectivo	2025-10-08 20:21:06.831+00	f	\N	\N	\N	\N	\N
af6edfa1-def8-4f30-bbad-a0fae0a0376b	albahaca	4000	Ingredientes	2025-10-08	efectivo	2025-10-08 22:57:33.694+00	f	\N	\N	\N	\N	\N
cb51636d-dc5c-4269-8f1f-c27c6c817a01	pan andi 	2900	Ingredientes	2025-10-08	efectivo	2025-10-08 23:04:50.289+00	f	\N	\N	\N	\N	\N
efde9ed7-37b8-4c92-92f4-9c8d8e9cc0e6	Romero	2000	Ingredientes	2025-10-09	efectivo	2025-10-09 18:41:46.014+00	f	\N	\N	\N	\N	\N
2e083c4a-3b56-4aaf-b903-6c6ee1fa16d4	Curitas	2000	Ingredientes	2025-10-09	efectivo	2025-10-09 18:41:56.476+00	f	\N	\N	\N	\N	\N
562cd6f0-9cd9-462b-af18-8d39a70e34a0	calabaza tostada	14000	Ingredientes	2025-10-09	efectivo	2025-10-09 21:31:37.299+00	f	\N	\N	\N	\N	\N
fff78388-ca6a-48b2-856d-e25f01bce9e1	coco	7500	Ingredientes	2025-10-09	efectivo	2025-10-09 21:32:06.128+00	f	\N	\N	\N	\N	\N
bd497a58-b0dd-4a87-84d2-6e8afdaf96c2	chips de vegetales	35900	Ingredientes	2025-10-09	efectivo	2025-10-09 21:47:56.695+00	f	\N	\N	\N	\N	\N
50dc24ca-6a7a-46de-acf9-726d00cc6532	maíz dulce y bolsa 	30300	Ingredientes	2025-10-09	efectivo	2025-10-09 21:49:40.045+00	f	\N	\N	\N	\N	\N
ad14659f-a28c-472c-a1a4-e9c6c0c7d9c4	Frutas	64500	Ingredientes	2025-10-10	efectivo	2025-10-10 17:44:05.012+00	f	\N	\N	\N	\N	\N
2dede0f2-73d1-4a0a-b8a3-38bc18650d71	Quesillo	12000	Ingredientes	2025-10-10	efectivo	2025-10-10 17:44:25.959+00	f	\N	\N	\N	\N	\N
b801c523-5c40-44f6-aa8d-fd0c434ca332	Comino	2800	Ingredientes	2025-10-10	efectivo	2025-10-10 18:36:34.353+00	f	\N	\N	\N	\N	\N
f79dd650-a512-4660-8563-f8aaca7da42f	Maggi Gallina	1000	Ingredientes	2025-10-10	efectivo	2025-10-10 18:37:02.454+00	f	\N	\N	\N	\N	\N
b854cb6c-012a-4a02-a47e-60120f0b2004	Tomillo	2800	Ingredientes	2025-10-10	efectivo	2025-10-10 18:37:20.162+00	f	\N	\N	\N	\N	\N
480bfb35-bbe8-4957-9d55-5e0c8409ee10	Pimienta	3200	Ingredientes	2025-10-10	efectivo	2025-10-10 18:37:50.689+00	f	\N	\N	\N	\N	\N
cbf2b811-6e5c-476a-8573-7d07ad8c456d	Oregano	1800	Ingredientes	2025-10-10	efectivo	2025-10-10 18:38:13.279+00	f	\N	\N	\N	\N	\N
a7abb89a-0794-4332-9c38-53918a610c33	Tocineta	56000	Ingredientes	2025-10-10	efectivo	2025-10-10 22:34:17.13+00	f	\N	\N	\N	\N	\N
12b9d7a7-d72f-406f-bb97-337361840214	Frutas	92000	Ingredientes	2025-10-11	efectivo	2025-10-11 20:03:02.586+00	f	\N	\N	\N	\N	\N
7b973a7f-e089-4a71-a02a-663823ad5c85	DANIEL Adelanto semana hasta 11 OCT	100000	Salarios	2025-10-11	efectivo	2025-10-11 20:36:19.34+00	f	\N	\N	\N	\N	\N
f120c485-05fc-4ab0-a363-c1b42fc0429e	Arandanos	6000	Ingredientes	2025-10-11	efectivo	2025-10-11 20:54:57.044+00	f	\N	\N	\N	\N	\N
9409f20a-7333-42e0-9e32-b2a23fa9436f	Aguacate	5000	Ingredientes	2025-10-11	efectivo	2025-10-11 20:56:18.74+00	f	\N	\N	\N	\N	\N
3f6c9295-148e-4666-8d0f-81c97c05351c	Panaderia	30000	Ingredientes	2025-10-14	efectivo	2025-10-14 23:52:12.081+00	f	\N	\N	\N	\N	\N
8f29b855-bc8b-4122-bb74-e05a8765403a	Fruver	4000	Ingredientes	2025-10-14	efectivo	2025-10-14 23:52:26.448+00	f	\N	\N	\N	\N	\N
9cf4d504-f351-4040-b727-0b85fa9c8674	Pilas	3000	Mantenimiento	2025-10-14	efectivo	2025-10-14 23:52:38.444+00	f	\N	\N	\N	\N	\N
378fcd0c-6891-4c88-86f0-6b1ce609bda6	Impresion	20000	Equipos	2025-10-14	efectivo	2025-10-14 23:54:13.268+00	f	\N	\N	\N	\N	\N
9f9952d2-1fd4-43ec-b9b1-05c2afdd41d7	Salario Daniel 06 OCT - 11 OCT	266000	Salarios	2025-10-14	efectivo	2025-10-14 23:55:25.404+00	f	\N	\N	\N	\N	\N
a370a678-25e5-4121-9ce9-3c7a9ca4f20e	Desechables	6800	Ingredientes	2025-10-14	efectivo	2025-10-14 23:55:48.426+00	f	\N	\N	\N	\N	\N
cbc19fb6-14c9-460f-a451-cd3af35148d6	Fruver	62000	Ingredientes	2025-10-15	efectivo	2025-10-16 00:29:52.882+00	f	\N	\N	\N	\N	\N
2e87d994-2708-4060-a79b-ad2ad8f9e951	Desengrasante	6300	Mantenimiento	2025-10-16	efectivo	2025-10-16 16:57:18.599+00	f	\N	\N	\N	\N	\N
37d3a905-38b5-4936-b020-94fdcbfe911a	Fruver	22000	Ingredientes	2025-10-16	efectivo	2025-10-16 16:57:41.618+00	f	\N	\N	\N	\N	\N
860db682-6b23-410d-b5ce-90bd348e6d3c	Aguacates	11000	Ingredientes	2025-10-16	efectivo	2025-10-16 16:58:10.738+00	f	\N	\N	\N	\N	\N
385c39ad-b887-46fc-8e8a-7ff6a3d66665	Tocineta	84000	Ingredientes	2025-10-16	efectivo	2025-10-16 22:34:24.17+00	f	\N	\N	\N	\N	\N
48ad5b03-faab-4da7-b8a8-870165c21e24	Quinua	6500	Ingredientes	2025-10-16	efectivo	2025-10-16 22:34:45.401+00	f	\N	\N	\N	\N	\N
4e65ca69-04e5-4a69-bd3a-2b019eeeaeef	Cafe y Bizcochos	28300	Ingredientes	2025-10-16	efectivo	2025-10-16 23:15:49.714+00	f	\N	\N	\N	\N	\N
8df65e00-e749-423b-8679-ae7c7c1777fb	Salario Miguel	324100	Salarios	2025-10-16	nequi	2025-10-16 23:35:51.813+00	f	\N	\N	\N	\N	\N
b559be9d-b68f-4af8-83c6-63b757fc39d4	Panadería	222000	Ingredientes	2025-10-16	nequi	2025-10-17 00:01:31.449+00	f	\N	\N	\N	\N	\N
ab427a33-ff84-43e0-b64c-523b3fafa587	Fruver	36200	Ingredientes	2025-10-16	efectivo	2025-10-17 01:15:54.394+00	f	\N	\N	\N	\N	\N
6647df1b-d51d-40ac-8c20-be82023ea128	Domicilio	7000	Transporte	2025-10-16	efectivo	2025-10-17 01:33:31.124+00	f	\N	\N	\N	\N	\N
827e4c09-3128-45b6-9c6e-5d71ebe05791	Fabuloso	2200	Equipos	2025-10-16	efectivo	2025-10-17 01:37:31.986+00	f	\N	\N	\N	\N	\N
280c26c9-cd31-44ab-b983-ebde74e83097	Aguacates, cilantro	10300	Ingredientes	2025-10-17	efectivo	2025-10-17 23:16:02.274+00	f	\N	\N	\N	\N	\N
9761f170-4fd5-4638-9bb2-903d637b12ad	Pan Sandwich	66000	Ingredientes	2025-10-17	efectivo	2025-10-17 23:32:12.811+00	f	\N	\N	\N	\N	\N
7957dbc7-e5cb-473f-ae73-81ca4dcc23dd	Arroz Cab Rev	5000	Ingredientes	2025-10-17	efectivo	2025-10-17 23:48:34.529+00	f	\N	\N	\N	\N	\N
4151b84d-0764-4664-b470-da676d1ff610	Chips de arracacha	40000	Ingredientes	2025-10-18	efectivo	2025-10-18 21:33:38.596+00	f	\N	\N	\N	\N	\N
5bce4b30-9965-467f-a8fb-b5e7bd03174a	D1	55400	Ingredientes	2025-10-18	efectivo	2025-10-18 21:56:47.168+00	f	\N	\N	\N	\N	\N
34a9c389-e265-4718-81cf-3095e19722f6	Jabón	11000	Ingredientes	2025-10-18	efectivo	2025-10-18 22:04:26.038+00	f	\N	\N	\N	\N	\N
6609ba5b-03b7-4931-96b8-c6a9d5dc9c07	Aguacates	11000	Frutas/Verduras	2025-10-20	efectivo	2025-10-20 18:25:43.203+00	f	\N	\N	\N	\N	\N
9779b6ec-b4e1-46a5-830e-ce07f678f4e9	Champiñones	17600	Frutas/Verduras	2025-10-20	efectivo	2025-10-21 00:14:59.423+00	f	\N	\N	\N	\N	\N
c71dbb16-8bec-4d6d-a316-7200b0cef1ec	Quesillo	12000	Lacteos	2025-10-20	efectivo	2025-10-21 01:20:06.182+00	f	\N	\N	\N	\N	\N
370e49e9-b622-4956-bcb5-c32b31127561	Fruver	24300	Frutas/Verduras	2025-10-20	efectivo	2025-10-21 01:21:23.981+00	f	\N	\N	\N	\N	\N
9e37bc6e-9acd-450e-9d0e-e939bea52705	Carne	91000	Carnes	2025-10-20	efectivo	2025-10-21 01:25:18.768+00	f	\N	\N	\N	\N	\N
eecd41a2-e1a9-43f9-98d6-270ec63b935c	Quinua	13000	Frutas/Verduras	2025-10-20	efectivo	2025-10-21 01:25:44.669+00	f	\N	\N	\N	\N	\N
e2507066-38b9-4c7a-ba72-a7f109a1f6e1	Maíz 	30200	Frutas/Verduras	2025-10-22	efectivo	2025-10-22 18:35:22.356+00	f	\N	\N	\N	\N	\N
2e0f2e78-3d9b-4847-b177-2b744c783e72	Papel anotar 	5000	Papelería	2025-10-22	efectivo	2025-10-22 18:38:49.336+00	f	\N	\N	\N	\N	\N
3b190735-38c2-4b43-8d7d-81987b4b909e	Fresas	15000	Frutas/Verduras	2025-10-22	efectivo	2025-10-22 22:50:02.354+00	f	\N	\N	\N	\N	\N
5a467515-c9cd-4828-9f22-17423071b17d	domicilio	3000	Transporte	2025-10-22	efectivo	2025-10-22 23:01:37.898+00	f	\N	\N	\N	\N	\N
e0e382d5-175e-41b1-b051-8b2641791ed2	Frutas	19000	Frutas/Verduras	2025-10-22	efectivo	2025-10-22 23:37:19.997+00	f	\N	\N	\N	\N	\N
e5c7d1f6-9730-4f8d-8baa-3ad3056e5f7d	fruver	56500	Frutas/Verduras	2025-10-23	efectivo	2025-10-23 18:41:23.202+00	f	\N	\N	\N	\N	\N
fc56f31b-f788-4ae9-a5b9-2e22310794b5	Panela	4400	Frutas/Verduras	2025-10-23	efectivo	2025-10-23 18:41:37.289+00	f	\N	\N	\N	\N	\N
b3498579-46dc-497b-8a4a-069da0e9a577	Tocineta	56000	Carnes	2025-10-23	efectivo	2025-10-23 21:54:08.88+00	f	\N	\N	\N	\N	\N
fd6a3df9-6eae-45a5-8c50-d9d16789aeba	Domicilio	6500	Transporte	2025-10-23	efectivo	2025-10-23 21:55:27.054+00	f	\N	\N	\N	\N	\N
325985ee-008e-499b-97d0-a1d40a687562	Fruver	9000	Frutas/Verduras	2025-10-23	efectivo	2025-10-23 23:28:54.18+00	f	\N	\N	\N	\N	\N
b3384424-aa55-4c69-82dd-8f599045f762	Palillos	3200	Productos Limpieza	2025-10-23	efectivo	2025-10-23 23:30:01.39+00	f	\N	\N	\N	\N	\N
9eb20230-4d7f-49a6-b2dc-cc91d14c2be1	Balance	1400	Servicios públicos	2025-10-23	efectivo	2025-10-24 02:12:23.216+00	f	\N	\N	\N	\N	\N
18b37243-a4e0-4047-8376-e1f35bf180e5	Crema limpiadora	5000	Productos Limpieza	2025-10-24	efectivo	2025-10-24 17:25:15.01+00	f	\N	\N	\N	\N	\N
b1564097-79b4-4b26-9fa9-040a9ea38797	Fruver	14500	Frutas/Verduras	2025-10-24	efectivo	2025-10-24 17:27:50.093+00	f	\N	\N	\N	\N	\N
38c5e870-7a4a-491f-a982-7a460bcd782c	Granos	11500	Frutas/Verduras	2025-10-24	efectivo	2025-10-24 17:28:40.286+00	f	\N	\N	\N	\N	\N
a75f9232-d0bc-40e9-8e6d-d86d21f31295	Aguacates	12000	Frutas/Verduras	2025-10-24	efectivo	2025-10-24 17:29:10.491+00	f	\N	\N	\N	\N	\N
6ab1a9ec-6a48-4662-b05b-6ddc26348d21	Aceite	37900	Frutas/Verduras	2025-10-24	efectivo	2025-10-24 20:26:46.274+00	f	\N	\N	\N	\N	\N
39bb6a9c-9d4b-4d6f-9c6c-9a0ba8fc890c	Matcha	40000	Frutas/Verduras	2025-10-24	efectivo	2025-10-25 01:20:11.217+00	f	\N	\N	\N	\N	\N
99d0641e-9487-48f5-8a82-8e4ae06f7968	Aguacates	9000	Frutas/Verduras	2025-10-24	efectivo	2025-10-25 01:36:35.1+00	f	\N	\N	\N	\N	\N
111b6092-a0a0-475a-baca-57a5b30bc3ba	Adelanto Daniel	30000	Salarios	2025-10-24	efectivo	2025-10-25 13:42:16.117+00	f	\N	\N	\N	\N	\N
d5cf1b9b-42ea-4377-8b02-1d1aa5974d66	Jabon de loza 	4800	Productos Limpieza	2025-10-24	efectivo	2025-10-25 13:51:17.739+00	f	\N	\N	\N	\N	\N
94e1962c-2d93-4139-91f0-5920d93c7acb	Fresas 	5000	Frutas/Verduras	2025-10-24	efectivo	2025-10-25 13:54:08.664+00	f	\N	\N	\N	\N	\N
f3786687-56d7-4f32-af5d-9f1151eebbcf	Quesos	20000	Lacteos	2025-10-27	efectivo	2025-10-28 00:04:04.19+00	f	\N	\N	\N	\N	\N
c4820003-375e-4313-a23c-ff00dc12d537	Pasta	2400	Frutas/Verduras	2025-10-28	efectivo	2025-10-28 15:44:50.07+00	f	\N	\N	\N	\N	\N
315f0c13-e04b-49e7-9cc8-96953e6c5231	Pago Daniel	580000	Salarios	2025-11-03	efectivo	2025-11-03 14:38:58.235+00	f	\N	\N	\N	\N	\N
be2f36f9-f739-4d56-9bd4-e3e265b54891	Fruver	26000	Frutas/Verduras	2025-11-04	efectivo	2025-11-04 17:56:23.319+00	f	\N	\N	\N	\N	\N
3aacd01f-c528-4efa-bd4b-e94346fd7b2f	Champiñones	56000	Frutas/Verduras	2025-11-04	efectivo	2025-11-04 21:16:36.603+00	f	\N	\N	\N	\N	\N
b7cafcf5-db66-4dc4-b878-0667edc4c0e8	Queso y fruver 	15000	Frutas/Verduras	2025-11-04	efectivo	2025-11-04 21:17:47.83+00	f	\N	\N	\N	\N	\N
3edfcece-0b69-427d-b810-1948002851d7	Hierbas aromáticas	3000	Frutas/Verduras	2025-11-04	efectivo	2025-11-04 21:18:14.75+00	f	\N	\N	\N	\N	\N
bd40605a-8cc8-4238-92d4-504195e8c7b8	Envío Andrés	2000	Otros	2025-11-04	efectivo	2025-11-04 21:18:42.963+00	f	\N	\N	\N	\N	\N
b6eb1022-d5ed-4ed5-b7f4-3b060d6c37fe	Pan	5500	Otros	2025-11-04	efectivo	2025-11-04 21:19:07.541+00	f	\N	\N	\N	\N	\N
96bffef6-8c2e-4cb1-839b-21c3fe249766	Prestamo Yaneth	54200	Otros	2025-11-04	efectivo	2025-11-04 21:20:20.231+00	f	\N	\N	\N	\N	\N
cf7a6940-42f6-4a9c-91af-30302b64e0bb	Inyeccion 	57000	Otros	2025-11-04	efectivo	2025-11-04 21:58:39.796+00	f	\N	\N	\N	\N	\N
51dc104d-2a4a-4627-ae16-c4a1a1849d84	Pasta	6000	Frutas/Verduras	2025-11-05	tarjeta	2025-11-05 17:22:34.531+00	f	\N	\N	\N	\N	\N
534966b8-9dd3-473e-9ad9-292fe7f025b0	Queso	13700	Lacteos	2025-11-05	tarjeta	2025-11-05 17:25:02.751+00	f	\N	\N	\N	\N	\N
2f2eb150-a5bc-47ef-b305-e22140cc43b5	Préstamo Briyith 	2800	Otros	2025-11-05	tarjeta	2025-11-05 17:26:03.309+00	f	\N	\N	\N	\N	\N
9f5bfcb4-e810-4129-9b4d-ea6fd9301593	Tocineta	28000	Carnes	2025-11-05	efectivo	2025-11-05 22:20:50.08+00	f	\N	\N	\N	\N	\N
2e9f3da8-30a7-4808-832a-4fa9d634414a	Banano	50000	Frutas/Verduras	2026-01-31	efectivo	2026-01-31 21:19:49.008+00	f	\N	\N	\N	\N	\N
34f5ef8b-743b-443b-b10d-62ac99216181	Pollo	30000	Carnes	2026-01-31	nequi	2026-01-31 21:21:02.834+00	f	\N	\N	\N	\N	\N
ac1124bd-8a1a-41d2-a955-72a1bc6c4062	Domicilio orden 3425	6000	Transporte	2026-01-31	efectivo	2026-01-31 21:52:03.596+00	f	\N	\N	\N	\N	\N
b5dc23d2-1cf5-4f1a-99ba-8c10bbc5864d	hojas de menu	24000	Papelería	2026-02-23	efectivo	2026-02-23 17:54:29.051+00	f	\N	\N	\N	\N	\N
59d375e2-3dff-4844-b7d1-84f5e0dacd5c	paquete de tarrinas 25 UND 24 OZ	14000	Otros	2026-02-23	efectivo	2026-02-23 21:25:14.661+00	f	\N	\N	\N	\N	DESEPLAST MP
c97c7f3a-993d-4880-8ae8-dc18d7eb5960	paquete de tarrinas 25 UND 14 OZ	12000	Otros	2026-02-23	efectivo	2026-02-23 21:26:25.938+00	f	\N	\N	\N	\N	DESEPLAST MP
50840a65-4605-472f-8057-8d3d1f4f578e	Sábila	1500	Inventario	2026-02-24	efectivo	2026-02-24 19:03:31.92+00	t	\N	\N	\N	\N	Verdulería de conveniencia
1063f5d2-c3a5-4126-ba1a-cff3588f1a6e	Hierba buena	1000	Inventario	2026-02-24	efectivo	2026-02-24 19:04:01.653+00	t	\N	\N	\N	\N	Verdulería de conveniencia
fb5dc2db-1137-4373-a52d-2e6a8b0cea86	Sandia por kilo	12000	Inventario	2026-02-24	efectivo	2026-02-24 19:04:44.66+00	t	\N	\N	\N	\N	Verdulería de conveniencia
3eb652d8-5894-4407-a609-1d00670defc8	Menta Por Paquete	1000	Inventario	2026-02-24	efectivo	2026-02-24 19:06:10.947+00	t	\N	\N	\N	\N	Verdulería de conveniencia
1edac636-33a5-4f74-a511-826089598f60	Banano	7500	Inventario	2026-02-24	efectivo	2026-02-24 21:08:33.799+00	t	\N	\N	\N	\N	Verdulería de conveniencia
6989a039-dd30-4175-aa2b-80c286125669	Mani tostado por paquete	6000	Inventario	2026-02-24	efectivo	2026-02-24 21:09:21.364+00	t	\N	\N	\N	\N	Verdulería de conveniencia
510809fa-054b-4e14-a72f-9cd1e48be85d	Mango por kilo	10800	Inventario	2026-02-24	efectivo	2026-02-24 21:11:37.626+00	t	\N	\N	\N	\N	Verdulería de conveniencia
93988eab-619e-44a9-9dec-3f792648275e	Aguacate	7000	Inventario	2026-02-24	efectivo	2026-02-24 21:15:41.046+00	t	\N	\N	\N	\N	Verdulería de conveniencia
fc954d0d-dbd3-46e0-968c-6acecd499d3a	Lechuga crespa	3000	Inventario	2026-02-24	efectivo	2026-02-24 21:16:14.422+00	t	\N	\N	\N	\N	Verdulería de conveniencia
87fe906e-e64c-418e-b10e-6f3b3d1cb19f	Variado para inventario, no es legible la factura	39500	Otros	2026-02-18	efectivo	2026-02-24 21:41:20.932+00	f	\N	\N	\N	\N	FRUVER MARIDIAZ
b3a9cfb0-1652-40ab-b234-2ceb2217987f	Pan perro	22000	Inventario	2026-02-18	efectivo	2026-02-24 21:59:50.315+00	t	\N	\N	\N	\N	\N
27e9f5df-8750-45fe-8a58-5f15cc4b4a61	Pan Ciabatta	28000	Inventario	2026-02-24	efectivo	2026-02-24 22:41:00.243+00	t	\N	\N	\N	\N	Produccion GL
ec742f07-ae88-439f-8113-688a73c20898	Transporte pan Ciabatta	7000	Transporte	2026-02-24	efectivo	2026-02-24 22:41:23.656+00	f	\N	\N	\N	\N	\N
9989fc70-9084-4a89-a576-acd2a42297d2	Toallas de cocina, paquete de 3	21900	Productos Limpieza	2026-02-24	efectivo	2026-02-24 16:47:41.855+00	f	\N	\N	\N	\N	\N
fe0da855-eb56-44aa-ad7d-282299b873a0	Queso parmesano	11200	Lacteos	2026-02-24	nequi	2026-02-25 00:08:55.094+00	f	\N	\N	\N	\N	Colacteos
7f0ca73f-c033-4b1d-a18b-3b3660c02769	yogur sin azúcar	8400	Lacteos	2026-02-24	nequi	2026-02-25 00:09:33.326+00	f	\N	\N	\N	\N	colacteos
ea195757-65eb-46a4-8629-232af20e5a5a	Queso crema	6000	Lacteos	2026-02-24	nequi	2026-02-25 00:10:04.884+00	f	\N	\N	\N	\N	colacteos
6d9ccb9e-bf2f-4ee9-b822-cf18224c9036	IVA lácteos del dia	3800	Otros	2026-02-24	nequi	2026-02-25 00:10:35.149+00	f	\N	\N	\N	\N	colacteos
e7e4ccdd-6cfe-4b42-a1b6-4e6d45dfef99	2 und gorros cabello	1200	Otros	2026-02-23	efectivo	2026-02-25 01:10:18.116+00	f	\N	\N	\N	\N	\N
8467886a-5a44-4da2-ab9f-dcd03f971ee8	2 und lapicero	2000	Papelería	2026-02-23	efectivo	2026-02-25 01:11:10.906+00	f	\N	\N	\N	\N	\N
1ef82a65-e41c-4232-9b62-fec59bb8a1a7	impresiones recetas	2500	Papelería	2026-02-23	efectivo	2026-02-25 01:11:53.362+00	f	\N	\N	\N	\N	\N
43f537b3-23ec-465a-b47c-24f335fbb6cd	menu adicional	6000	Papelería	2026-02-23	efectivo	2026-02-25 01:12:26.105+00	f	\N	\N	\N	\N	\N
a79dcd87-64dc-4642-b455-d88287d8691f	leche	51400	Inventario	2026-02-23	efectivo	2026-02-25 01:05:43.305+00	t	\N	\N	\N	\N	\N
1fe9ac7e-9ca7-4919-927b-ec5f711dd89f	romero	1000	Inventario	2026-02-23	efectivo	2026-02-25 01:09:34.311+00	t	\N	\N	\N	\N	\N
88cc3adb-e40f-4e9b-a9ee-aa7289f20fca	protector hojas	1300	Papelería	2026-02-23	efectivo	2026-02-25 01:13:09.905+00	f	\N	\N	\N	\N	\N
87b7fa0a-9e7c-4d83-90f5-e908d7eb5d83	regla. bisturi, facturero	5100	Papelería	2026-02-23	efectivo	2026-02-25 01:14:03.888+00	f	\N	\N	\N	\N	\N
00823a02-00cc-45e0-a15a-c80592b49d91	copias de llaves	6000	Papelería	2026-02-25	efectivo	2026-02-25 16:15:30.205+00	f	\N	\N	\N	\N	\N
004db8e5-a5a6-49fe-b05e-8c30949b0dd4	esponjas 4 Unds	2200	Productos Limpieza	2026-02-25	efectivo	2026-02-25 16:15:57.082+00	f	\N	\N	\N	\N	\N
ad8ad035-2bba-4e22-863e-197ac8cb8ffd	copias formas para temperatura	1200	Papelería	2026-02-25	efectivo	2026-02-25 20:32:05.672+00	f	\N	\N	\N	\N	\N
3b20da86-e016-47fa-b0e1-13b0c15d0ce7	corrector	3500	Papelería	2026-02-25	efectivo	2026-02-25 20:32:20.685+00	f	\N	\N	\N	\N	\N
01c3c718-6b60-4d22-ae63-28790d513b03	Curcuma	3000	Otros	2026-02-25	nequi	2026-02-25 20:35:00.326+00	f	\N	\N	\N	\N	\N
79e4d786-8dcd-400b-a4bd-ab1fb9ec1a3b	Hatsu 200ml X24	45600	Otros	2026-02-25	nequi	2026-02-25 20:54:02.777+00	f	\N	\N	\N	\N	\N
6f34f17e-525b-48cb-a13b-837d6fbef948	hatsu 400ml X6	27000	Otros	2026-02-25	nequi	2026-02-25 20:54:36.905+00	f	\N	\N	\N	\N	\N
358b0036-97a1-49c7-aaf3-ba392d0cb776	aguacate	7000	Inventario	2026-02-25	efectivo	2026-02-26 00:52:26.658+00	t	\N	\N	\N	\N	\N
1d9ec5e7-a99c-435d-9a54-373beaf97d9c	2kg de carne de res	57700	Carnes	2026-02-25	nequi	2026-02-26 01:43:14.716+00	f	\N	\N	\N	\N	La favorita 16
34974e9d-ebb7-4d10-a558-1586665ca107	5 pechugas pollo 	64500	Carnes	2026-02-25	nequi	2026-02-26 01:43:45.097+00	f	\N	\N	\N	\N	PAD
46404b95-11ae-4313-837b-28935627494e	lonchera electrica	40000	Otros	2026-02-26	nequi	2026-02-26 16:31:53.739+00	f	\N	\N	\N	\N	\N
7abe33bc-9c24-4781-b442-0957a16aab0a	Adaptador	12000	Otros	2026-02-26	nequi	2026-02-26 16:34:16.169+00	f	\N	\N	\N	\N	\N
bfc4a2f0-155f-4367-a94f-43c89f442ce6	cilantro 	1000	Otros	2026-02-26	efectivo	2026-02-26 16:36:33.999+00	f	\N	\N	\N	\N	\N
f3c88b44-5172-4c0f-bb30-c531042dfb80	ajo 	2000	Otros	2026-02-26	efectivo	2026-02-26 16:36:44.519+00	f	\N	\N	\N	\N	\N
fe74b623-103d-43ff-a185-8964468e5649	aguacate	6000	Otros	2026-02-26	efectivo	2026-02-26 16:37:04.51+00	f	\N	\N	\N	\N	\N
ee34b62b-ac99-40a1-a58c-b98fd6ef0fe8	tomates	8000	Frutas/Verduras	2026-02-26	efectivo	2026-02-26 17:03:04.962+00	f	\N	\N	\N	\N	\N
e560d19b-ead1-4e07-92b4-439a49602e6c	avena	5400	Frutas/Verduras	2026-02-26	efectivo	2026-02-26 17:32:36.426+00	f	\N	\N	\N	\N	\N
f5bddf4b-1073-4fb3-b431-6adf3f7f492f	Protector de hojas	1000	Papelería	2026-02-26	efectivo	2026-02-26 20:28:37.757+00	f	\N	\N	\N	\N	\N
dd08b223-7b84-41dc-b4d1-3a9f2493cf13	cinta 	3500	Papelería	2026-02-26	efectivo	2026-02-26 20:29:00.862+00	f	\N	\N	\N	\N	\N
703f3fd6-f729-4a54-9a49-0a1136426424	Copias	800	Papelería	2026-02-26	efectivo	2026-02-26 20:29:25.933+00	f	\N	\N	\N	\N	\N
72562d83-9592-4917-8f6b-e76597f1b58a	libra de cafe	38000	Otros	2026-02-26	efectivo	2026-02-26 22:22:11.913+00	f	\N	\N	\N	\N	\N
e281d056-941a-4507-a8e4-6edb76289fa5	hierba buena	2000	Otros	2026-02-26	efectivo	2026-02-26 23:43:07.796+00	f	\N	\N	\N	\N	\N
29382603-8193-4a52-a5e5-619fc711607a	copias	1000	Papelería	2026-02-26	efectivo	2026-02-26 23:43:20.067+00	f	\N	\N	\N	\N	\N
116e5983-5971-450f-9b9b-602c520e5713	Empanadas	36000	Otros	2026-02-26	nequi	2026-02-27 00:02:21.88+00	f	\N	\N	\N	\N	\N
acd39e04-f254-411b-9234-a2f00212a0e0	Condimentos para carne	3500	Otros	2026-02-26	nequi	2026-02-27 00:03:12.815+00	f	\N	\N	\N	\N	\N
e5c498a4-bb24-44d7-917c-722467df27c0	carnes	82000	Carnes	2026-02-26	nequi	2026-02-27 00:02:50.367+00	f	\N	\N	\N	\N	\N
33574f8f-e201-4e7e-b179-316271820338	gorros para pelo	1200	Papelería	2026-02-27	efectivo	2026-02-27 16:37:46.93+00	f	\N	\N	\N	\N	\N
57e4bf68-4679-409f-8d7c-26d4da6d4cc8	champiñones	59000	Frutas/Verduras	2026-02-27	efectivo	2026-02-27 16:38:16.551+00	f	\N	\N	\N	\N	\N
5cf63b3a-e3dc-450b-bb25-f457f3fe4e6a	tomate	4000	Frutas/Verduras	2026-02-27	efectivo	2026-02-27 16:56:29.689+00	f	\N	\N	\N	\N	\N
0e68eca3-4a5d-4417-a7f6-ab97e90b75b7	limones	2500	Frutas/Verduras	2026-02-27	efectivo	2026-02-27 16:56:48.705+00	f	\N	\N	\N	\N	\N
1f10e8d3-5694-49a6-b757-ebac81cf0897	zanahoria	2500	Frutas/Verduras	2026-02-27	efectivo	2026-02-27 16:57:03.72+00	f	\N	\N	\N	\N	\N
0bb21e48-1af9-43fb-8c81-4d3a697a3a61	cilantro	5000	Otros	2026-02-27	efectivo	2026-02-27 20:24:13.099+00	f	\N	\N	\N	\N	\N
397eec67-8277-4aae-a03b-ea394afe7b3b	Tocino	30000	Carnes	2026-02-27	efectivo	2026-02-27 21:51:54.893+00	f	\N	\N	\N	\N	\N
6b9dc564-4a60-4b21-b05b-85189954e3b0	lechuga	3000	Frutas/Verduras	2026-02-28	efectivo	2026-02-28 18:09:43.287+00	f	\N	\N	\N	\N	\N
50998f70-b629-46b0-b24a-a7ae8f1e7696	fresas	5000	Frutas/Verduras	2026-02-28	efectivo	2026-02-28 18:10:12.925+00	f	\N	\N	\N	\N	\N
74c0c421-96a3-40a6-8dc4-a771e5322fd8	Aguacate	6000	Frutas/Verduras	2026-02-28	efectivo	2026-02-28 18:10:40.821+00	f	\N	\N	\N	\N	\N
3303105c-fa0c-4641-8182-e5b195172214	arándanos	6500	Frutas/Verduras	2026-02-28	efectivo	2026-02-28 18:11:10.133+00	f	\N	\N	\N	\N	\N
32ef78ab-3db7-463b-884c-8e2267b4cc49	2 chequeras	4600	Papelería	2026-02-28	efectivo	2026-02-28 18:53:04.228+00	f	\N	\N	\N	\N	\N
04460a08-b40e-4541-9233-cfeb5e3627d6	Pan	1000	Otros	2026-02-28	efectivo	2026-02-28 21:54:00.178+00	f	\N	\N	\N	\N	\N
bf1e3de7-b965-4439-879b-ebd48ccfd1af	cuajada	13000	Lacteos	2026-03-02	efectivo	2026-03-02 17:38:02.037+00	f	\N	\N	\N	\N	\N
4dcd3835-0e79-4664-850c-c83e5a9ae89e	ajo	2000	Frutas/Verduras	2026-03-02	efectivo	2026-03-02 17:56:09.958+00	f	\N	\N	\N	\N	\N
3f1b40a4-749f-4b4a-8126-75873a97d88f	tomate	10000	Frutas/Verduras	2026-03-02	efectivo	2026-03-02 17:56:24.591+00	f	\N	\N	\N	\N	\N
441483e9-da67-4351-a3ea-d50d1641c373	aromática	2000	Otros	2026-03-02	efectivo	2026-03-02 19:12:35.657+00	f	\N	\N	\N	\N	\N
2fb65ed7-75e0-41e2-b2e1-5b410b86d80a	pan del dia	2000	Otros	2026-03-02	efectivo	2026-03-02 19:12:49.456+00	f	\N	\N	\N	\N	\N
6f9b2c9e-6048-4973-9cc1-d42a6e03db04	carpeta 	6000	Papelería	2026-03-02	efectivo	2026-03-02 21:19:11.716+00	f	\N	\N	\N	\N	\N
02bb4712-1a6c-479c-a665-9eb33233da97	servilletas	4000	Productos Limpieza	2026-03-02	nequi	2026-03-02 17:34:55.938+00	f	\N	\N	\N	\N	\N
a8d159a3-5270-4e23-bb21-1224318e5f67	vinipel 100m	7000	Productos Limpieza	2026-03-02	nequi	2026-03-02 17:35:40.558+00	f	\N	\N	\N	\N	\N
fac721b9-3d8f-43c1-8d24-699df0f57987	2 Paquetes de tapas para caliente	38600	Papelería	2026-03-02	nequi	2026-03-02 17:36:19.069+00	f	\N	\N	\N	\N	\N
d1aece2a-1275-4e1b-a3f1-bf2e7ce20d2b	rollo toallas de cocina	35800	Papelería	2026-03-02	nequi	2026-03-02 17:37:23.42+00	f	\N	\N	\N	\N	\N
3c918559-1a4b-4062-9dbb-489528eb5a66	caja de guantes	18000	Productos Limpieza	2026-03-02	nequi	2026-03-02 17:37:42.46+00	f	\N	\N	\N	\N	\N
373a9348-8891-4a13-8bda-f5590e23f868	Tarrina 32 Oz	22500	Papelería	2026-02-28	provision_caja	2026-02-28 18:45:09.09+00	f	\N	\N	\N	\N	\N
d71559fe-e5df-4860-a943-4c916e295cb6	Domo superior	5400	Papelería	2026-02-28	provision_caja	2026-02-28 18:44:37.994+00	f	\N	\N	\N	\N	\N
c9a791e8-085d-49bd-9cfe-41d5b147fafd	domo bajo	2600	Papelería	2026-02-28	provision_caja	2026-02-28 18:44:07.619+00	f	\N	\N	\N	\N	\N
9e2e7fbb-441d-4aa9-924c-f0d7922e3b0a	bolsa medianas	22500	Papelería	2026-02-28	provision_caja	2026-02-28 18:43:28.342+00	f	\N	\N	\N	\N	\N
8855e4b3-810d-4df1-88a8-f79ba571cf2f	empanadas de emergencia	16000	Otros	2026-03-03	nequi	2026-03-03 16:35:34.983+00	f	\N	\N	\N	\N	\N
dde88d29-8f58-4ba5-af50-7a471c52166b	3 Hatsu surtido x3	14400	Otros	2026-03-03	nequi	2026-03-03 17:52:53.849+00	f	\N	\N	\N	\N	\N
5e0e826b-9cc3-4078-84fe-2726a347f976	2 paquetes maíz dulce	12000	Frutas/Verduras	2026-03-03	nequi	2026-03-03 17:51:19.338+00	f	\N	\N	\N	\N	\N
2b7a5518-0a05-4590-b6be-045d01b69398	champiñones	59000	Frutas/Verduras	2026-03-03	efectivo	2026-03-03 19:22:51.433+00	f	\N	\N	\N	\N	\N
65e5727a-cbda-4af0-932b-88a773eeaac8	Domicilio orden 4025	6500	Transporte	2026-03-03	efectivo	2026-03-04 00:26:02.186+00	f	\N	\N	\N	\N	\N
9930e81d-3d7f-4846-bd51-d74ee2652a33	Aguacates del dìa	12000	Inventario	2026-03-03	efectivo	2026-03-04 00:34:04.179+00	t	\N	\N	\N	\N	\N
397cf515-fa98-49ae-a9ef-c1e6f0cf1a28	esponjas	1600	Productos Limpieza	2026-03-03	efectivo	2026-03-04 01:11:34.707+00	f	\N	\N	\N	\N	\N
113d1349-9288-47ac-b704-b01f294ce07e	pan del dia	2000	Otros	2026-03-03	efectivo	2026-03-04 01:11:47.106+00	f	\N	\N	\N	\N	\N
c9885bc3-8a5a-468e-a4a8-a2cb392a39a2	cheeseecake	36000	Otros	2026-03-04	efectivo	2026-03-04 17:28:09.759+00	f	\N	\N	\N	\N	\N
fd72504d-a16e-4b69-a6bf-b2d20e3fc45e	empanadas	40000	Otros	2026-03-04	efectivo	2026-03-04 17:28:27.71+00	f	\N	\N	\N	\N	\N
316d436f-07a3-4995-8680-f6703b1b92a5	9 unidades de hatsu	14400	Otros	2026-03-04	nequi	2026-03-04 18:10:49.278+00	f	\N	\N	\N	\N	\N
7fa081a3-2515-496b-9baf-2b4aefac5b13	bolsa	200	Papelería	2026-03-04	nequi	2026-03-04 18:11:11.582+00	f	\N	\N	\N	\N	\N
2d468a8f-d30d-4ad9-b93a-599350078580	Pepinos	2000	Inventario	2026-03-04	efectivo	2026-03-04 18:22:24.5+00	t	\N	\N	\N	\N	Verdulería de confianza
715bc4a5-6732-4f6a-8848-b0be51119a6a	Aguacates	12000	Inventario	2026-03-04	efectivo	2026-03-04 18:24:25.867+00	t	\N	\N	\N	\N	verdulería de confianza
a8f71cfe-7132-4136-a4cc-d7ada1d1c3e0	tocineta	30000	Inventario	2026-03-04	efectivo	2026-03-04 20:50:04.626+00	t	\N	\N	\N	\N	Carnes Frías MACARDI
8ec92899-fbf9-4951-8b9d-bc00d7cf17da	domicilio cheeseecake y empanadas	4000	Transporte	2026-03-04	efectivo	2026-03-04 17:29:00.638+00	f	\N	\N	\N	\N	\N
e3a0302e-17d2-4b64-ae0d-446bb60ada7e	Pan del dia	2000	Otros	2026-03-04	efectivo	2026-03-04 21:53:24.585+00	f	\N	\N	\N	\N	\N
0a4de6c4-7c40-47f9-a110-4ee42133298c	Domicilio orden #	6500	Transporte	2026-03-04	efectivo	2026-03-05 00:20:25.75+00	f	\N	\N	\N	\N	\N
a9accfb4-28d4-4b16-9dc5-8fa37e8f3d4a	cambio efectivo a nequi Miguel	4000	Otros	2026-03-04	efectivo	2026-03-05 01:07:14.643+00	f	\N	\N	\N	\N	\N
765efd94-2923-4291-9496-7ba8b2b5d5c2	pan del día	2000	Otros	2026-03-05	efectivo	2026-03-05 18:02:24.626+00	f	\N	\N	\N	\N	\N
b43ceef4-8b08-4863-b334-11363a2634bc	Pan blanco	22000	Inventario	2026-03-05	efectivo	2026-03-05 23:08:02.573+00	t	\N	\N	\N	\N	Produccion GL
c0619397-cce0-43d5-b057-dbc9d8103ca2	Pan ciabatta	28000	Inventario	2026-03-05	efectivo	2026-03-05 23:08:51.344+00	t	\N	\N	\N	\N	Producción GL
f29dc9b8-5336-48ed-a56e-3d1721f75483	domicilio pan	4500	Transporte	2026-03-05	efectivo	2026-03-05 23:09:13.32+00	f	\N	\N	\N	\N	\N
5172350c-ddcf-4d69-abe6-1a3b47a7e479	domicilio #6766	7000	Transporte	2026-03-05	efectivo	2026-03-06 00:03:31.437+00	f	\N	\N	\N	\N	\N
f38bea84-aa74-4868-8323-57fd7f139bec	Adelanto Jonathan	50000	Salarios	2026-03-04	nequi	2026-03-06 01:56:08.95+00	f	\N	\N	\N	\N	\N
11eeda16-9dc5-47d4-8e7b-5a325898933b	Fotocopias	3000	Papelería	2026-03-06	efectivo	2026-03-06 16:51:24.993+00	f	\N	\N	\N	\N	\N
04b3c08b-679a-4277-9899-791b09033313	Limon	3000	Inventario	2026-03-06	efectivo	2026-03-06 18:45:40.657+00	t	\N	\N	\N	\N	\N
28065be2-058f-4fd3-9650-351607654a53	domicilio madelinne	7500	Transporte	2026-03-06	efectivo	2026-03-06 18:58:45.406+00	f	\N	\N	\N	\N	\N
8057e1f1-3d65-4225-96e0-1710ae3b7a8e	Pan del dia	2000	Otros	2026-03-06	efectivo	2026-03-06 20:16:18.634+00	f	\N	\N	\N	\N	\N
b5837f04-9174-4a26-b8c3-886d738c12b5	Rúgala	3000	Inventario	2026-03-06	efectivo	2026-03-06 20:29:41.467+00	t	\N	\N	\N	\N	\N
478fb543-9e48-4145-980c-95f57c17fdc0	Cuajada	13000	Inventario	2026-03-06	efectivo	2026-03-06 20:31:29.785+00	t	\N	\N	\N	\N	\N
828f3305-1584-4441-8377-d2db09129809	domicilio	14500	Transporte	2026-02-24	efectivo	2026-02-25 01:22:12.899+00	f	\N	\N	\N	\N	\N
e32e4138-83b6-4267-9e0a-1ee6a55355ee	bolsas plásticas 	10000	Papelería	2026-03-07	efectivo	2026-03-07 14:51:28.242+00	f	\N	\N	\N	\N	\N
3068b1a0-4d93-488e-8182-36eddd9717db	Pan del dia	2000	Otros	2026-03-07	efectivo	2026-03-07 16:26:48.661+00	f	\N	\N	\N	\N	\N
1679801c-11fb-4e16-89ad-65dde3ed0aa0	Pan del dia	2000	Otros	2026-03-09	efectivo	2026-03-09 19:54:53.679+00	f	\N	\N	\N	\N	\N
7fc49935-ff22-4744-9ce4-293172c9916c	compra de cupcakes	25000	Inventario	2026-03-09	nequi	2026-03-09 20:56:53.352+00	t	\N	\N	\N	\N	\N
b669ea1c-2af6-44ea-98f9-621ce1fcaa0d	compra de cupcakes	25000	Inventario	2026-03-09	nequi	2026-03-09 20:57:27.771+00	t	\N	\N	\N	\N	\N
a63052f8-5d56-4037-bfc7-7cdbcacefed4	compra de Torta del dia	55000	Inventario	2026-03-09	nequi	2026-03-09 20:57:59.906+00	t	\N	\N	\N	\N	\N
db2673eb-16c9-4513-a7bd-9e384e899476	compra de cheeseecake	36000	Inventario	2026-03-09	nequi	2026-03-09 20:58:59.026+00	t	\N	\N	\N	\N	\N
554402c1-7949-4913-994b-94d5514c5945	Vinagre	7900	Inventario	2026-03-09	nequi	2026-03-09 21:06:41.046+00	t	\N	\N	\N	\N	D1
5dd39f8e-5a7f-458f-9da4-97d45063fd42	Guantes de cocina	3400	Otros	2026-03-09	nequi	2026-03-09 21:08:01.875+00	f	\N	\N	\N	\N	D1
036a0342-bf96-469a-88f4-a19a62c647d1	Maíz dulce	18000	Inventario	2026-03-09	nequi	2026-03-09 21:11:00.633+00	t	\N	\N	\N	\N	D1
90c3679a-8750-4ddf-b5d1-6f15ee3a0cae	caja de aromática 	4000	Inventario	2026-03-09	nequi	2026-03-09 21:13:17.616+00	t	\N	\N	\N	\N	D1
4021997b-34fe-4bc5-ae11-7ddb6c9a0db0	toallas para manos	4800	Inventario	2026-03-09	nequi	2026-03-09 21:14:51.614+00	t	\N	\N	\N	\N	D1
b1fd0eb9-ad9d-430e-899a-7497d06afdd4	Bolsas de basura 	3800	Inventario	2026-03-09	nequi	2026-03-09 21:17:25.916+00	t	\N	\N	\N	\N	D1
cdb304c9-4c00-4e75-9c39-c40053b09134	Sal de cocina	2700	Inventario	2026-03-09	nequi	2026-03-09 21:20:57.045+00	t	\N	\N	\N	\N	D1
3d4996e9-4b49-4496-8685-f06d21ea2e3b	Azucar de cocina	3800	Inventario	2026-03-09	nequi	2026-03-09 21:21:30.496+00	t	\N	\N	\N	\N	D1
31daa5c2-f8ab-4b99-8204-1d27eef4c22c	Tomates	10000	Inventario	2026-03-10	efectivo	2026-03-10 16:38:17.78+00	t	\N	\N	\N	\N	\N
08e45ef9-4bde-42d9-954c-470a0e35aaa8	Aguacates	12000	Inventario	2026-03-10	efectivo	2026-03-10 16:47:01.309+00	t	\N	\N	\N	\N	\N
b74a30bf-25f3-41f2-bee4-716cbac0b035	Romero	1000	Inventario	2026-03-10	efectivo	2026-03-10 16:47:25.817+00	t	\N	\N	\N	\N	\N
def04271-7552-4c5e-8f89-ff80c0b7fe27	Limones	6000	Inventario	2026-03-10	efectivo	2026-03-10 16:47:49.578+00	t	\N	\N	\N	\N	\N
1ee55a0d-a25b-4829-b346-505d4354c9ff	Gorro para el pelo	3000	Papelería	2026-03-10	efectivo	2026-03-10 16:48:20.153+00	f	\N	\N	\N	\N	\N
b27b0712-a784-4d65-97ba-9687e3197ca8	Champiñones	59000	Inventario	2026-03-10	efectivo	2026-03-10 17:48:44.014+00	t	\N	\N	\N	\N	\N
17281f60-001f-4954-be1c-73a5df946e0b	tocineta	30000	Inventario	2026-03-10	efectivo	2026-03-10 20:53:46.58+00	t	\N	\N	\N	\N	\N
48721a85-6514-4eb7-9275-2a3260f65810	Pasta	18000	Otros	2026-03-10	nequi	2026-03-10 21:27:10.256+00	f	\N	\N	\N	\N	\N
5f23112c-7dfd-48f7-b2af-6f37b77bac1d	Cuajada para queso feta	13000	Inventario	2026-03-11	efectivo	2026-03-11 17:58:05.27+00	t	\N	\N	\N	\N	\N
48166ee6-7bf4-4533-ba11-5c0af911ffdf	Pitillos de papel x200	15000	Papelería	2026-03-11	efectivo	2026-03-11 18:07:13.592+00	f	\N	\N	\N	\N	\N
7d3d5d9e-9e1b-4ab7-a894-82b4f39ce55a	Guantes para manipulación de comida	2500	Papelería	2026-03-11	efectivo	2026-03-11 18:07:41.359+00	f	\N	\N	\N	\N	\N
5e96857a-aae1-4667-99b3-d82ca99f24ad	Colador	10500	Otros	2026-03-11	efectivo	2026-03-11 18:08:13.647+00	f	\N	\N	\N	\N	\N
99c11058-ef24-4db9-afef-7f29ecc8b2c6	Lechuga	3000	Inventario	2026-03-11	efectivo	2026-03-11 19:36:39.438+00	t	\N	\N	\N	\N	\N
8be58bdc-6eb3-449e-a8d2-872030ea7331	aguacate	12000	Inventario	2026-03-12	efectivo	2026-03-12 17:37:40.489+00	t	\N	\N	\N	\N	\N
97baf608-4a7b-4405-8dfd-73795cc77c74	Cilantro	2000	Inventario	2026-03-12	efectivo	2026-03-12 17:39:49.425+00	t	\N	\N	\N	\N	\N
b8ec9e43-4ae5-4f9d-8663-f8990b2ea1fc	Zanahoria 	2500	Inventario	2026-03-12	efectivo	2026-03-12 17:41:49.983+00	t	\N	\N	\N	\N	\N
0adfb505-81a3-4ba0-a60d-e4ba55637fa1	Ajo	2000	Inventario	2026-03-12	efectivo	2026-03-12 17:43:23.404+00	t	\N	\N	\N	\N	\N
612d98ae-e4df-47b4-8260-deb76b3af641	Jabón de loza crema	5200	Productos Limpieza	2026-03-12	efectivo	2026-03-12 17:44:40.009+00	f	\N	\N	\N	\N	\N
378f4f8f-dd0c-4e9e-91ea-f0e1350c80dd	Pan de ayer y de hoy	4000	Otros	2026-03-12	efectivo	2026-03-12 18:12:55.764+00	f	\N	\N	\N	\N	\N
34225dac-976f-4763-b514-e67af0592287	facturero	4600	Papelería	2026-03-12	efectivo	2026-03-12 19:53:09.135+00	f	\N	\N	\N	\N	\N
3ce4cd20-e3da-40cc-a600-29955884cb92	fotocopias	2000	Otros	2026-03-13	efectivo	2026-03-13 19:48:49.232+00	f	\N	\N	\N	\N	\N
97c285c1-9bcc-4f3a-baee-577ac77053a0	aguacate	12000	Inventario	2026-03-16	efectivo	2026-03-16 17:43:52.795+00	t	\N	\N	\N	\N	\N
176a3e77-0299-4ca3-8f9b-fbaa726a06cd	tomate	9000	Inventario	2026-03-16	efectivo	2026-03-16 17:44:35.794+00	t	\N	\N	\N	\N	\N
fd31149f-9e97-4264-8542-751c805c28cc	Pepino	3000	Inventario	2026-03-16	efectivo	2026-03-16 17:45:40.202+00	t	\N	\N	\N	\N	\N
c92dc4a1-3a32-477e-9f7a-702ae5a91b9a	Limones	6000	Inventario	2026-03-16	efectivo	2026-03-16 17:46:13.602+00	t	\N	\N	\N	\N	\N
f4ecafb2-ba33-4f60-848a-683d24a6eac1	Leche de almendras	8000	Lacteos	2026-03-16	efectivo	2026-03-16 17:47:46.905+00	f	\N	\N	\N	\N	D1
56b42ecc-b19c-4758-bfcb-c1c4026fd761	Chips de arracacha	12000	Inventario	2026-03-16	efectivo	2026-03-16 17:49:18.97+00	t	\N	\N	\N	\N	D1
d9bd62a1-ad1b-423d-ae13-ca7668b86214	Cupcakes de avena	30000	Inventario	2026-03-16	efectivo	2026-03-16 19:02:28.65+00	t	\N	\N	\N	\N	\N
c5ec61e4-50a1-4531-a8fc-cab572796417	Cupcakes de banano	30000	Inventario	2026-03-16	efectivo	2026-03-16 19:02:54.166+00	t	\N	\N	\N	\N	\N
be9974b1-e0b8-411d-8418-a960623a9af9	pan del dia	2000	Otros	2026-03-16	efectivo	2026-03-16 19:45:03.428+00	f	\N	\N	\N	\N	\N
6a8dbc03-80ef-409e-a0fc-d14aa46e195c	Tocineta	30000	Inventario	2026-03-16	efectivo	2026-03-16 20:05:18.049+00	t	\N	\N	\N	\N	\N
b7997f6a-b827-4b57-8868-88ffc24b7c7e	facturera	2300	Papelería	2026-03-16	efectivo	2026-03-16 21:12:49.336+00	f	\N	\N	\N	\N	\N
f99c1c28-cc55-404f-9719-f3b2e6749c65	Adelanto Jonathan	50000	Salarios	2026-03-16	efectivo	2026-03-17 00:17:23.776+00	f	\N	\N	\N	\N	\N
6d47d7ed-0898-4b66-be13-f501e6540c6b	Champiñones	29500	Inventario	2026-03-17	efectivo	2026-03-17 18:45:36.149+00	t	\N	\N	\N	\N	\N
91446825-c5c1-40f6-9e9b-e23b49a3037f	Cebolla	6000	Inventario	2026-03-17	efectivo	2026-03-17 19:05:50.982+00	t	\N	\N	\N	\N	\N
daf5eecc-fd72-4323-a646-effd2f5d5bde	Ajo	2000	Inventario	2026-03-17	efectivo	2026-03-17 19:06:10.858+00	t	\N	\N	\N	\N	\N
fbec2661-5b7e-4d13-abc1-1c455bc628e7	Pago Erica (23 Feb - 28 Feb)	470500	Salarios	2026-03-06	efectivo	2026-03-06 21:49:27+00	f	\N	\N	\N	\N	\N
22ba3afd-98db-45db-9a29-11fe58ad6218	Pago Johnnatan (23 Feb - 28 Feb)	433000	Salarios	2026-03-06	nequi	2026-03-06 21:48:59+00	f	\N	\N	\N	\N	\N
b3dabf78-b43b-4e27-a279-3f03730aa346	Pago Tania (23 Feb - 28 Feb)	192800	Salarios	2026-03-06	nequi	2026-03-06 21:48:07+00	f	\N	\N	\N	\N	\N
dc6459e2-409a-4fe3-82f9-4cd2a1624051	Pago Johnathan (1Mar - 15Mar)	50000	Salarios	2026-03-16	efectivo	2026-03-16 22:18:13+00	f	\N	\N	\N	\N	\N
77303d88-28b8-4c65-b8e5-72f446895845	Adelanto Pago Johnathan (1 Mar - 15 Mar)	50000	Salarios	2026-03-04	nequi	2026-03-04 22:17:43+00	f	\N	\N	\N	\N	\N
9a704157-d0a9-4e6e-bb63-9e6dd35d7ae3	Pan del dia	2000	Otros	2026-03-17	efectivo	2026-03-17 22:34:34.327+00	f	\N	\N	\N	\N	\N
218b9ee9-80cf-46dc-a47e-57d6a08c3903	Compra Carne desmechada	58000	Inventario	2026-03-06	nequi	2026-03-17 22:38:19.399+00	t	\N	\N	\N	\N	Carnes la 16
10e90ae8-4c16-488b-b657-893d6fc1e3ed	Cerdo y Pollo	180600	Inventario	2026-03-14	provision_caja	2026-03-17 22:45:14.252+00	t	\N	\N	\N	\N	\N
4e31b27a-dcba-447b-b064-468077403739	Carnes Pollo, cerdo y res	180600	Inventario	2026-03-08	provision_caja	2026-03-17 22:48:54.645+00	t	\N	\N	\N	\N	\N
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."orders" ("id", "numero", "total", "estado", "timestamp", "cliente_id", "pago_efectivo", "pago_nequi", "pago_tarjeta", "metodo_pago") FROM stdin;
28ed2905-b7b7-4cba-b29a-c6ec7a3cae9a	10005	1000	entregado	2026-03-09 20:31:21.821+00	0cf14e74-a586-47c8-8d24-52547bdd464b	0	0	0	credito_empleados
42755f79-6c52-43ad-9cf5-03128e83898e	8215	19000	entregado	2026-03-04 21:02:30.52+00	\N	19000	0	0	efectivo
b23a6d32-fe51-46a4-8a89-a97230318293	4227	47000	entregado	2026-03-02 23:57:30.127+00	\N	0	47000	0	nequi
7c5ea64b-e701-41cc-bbe8-beb448eadfec	4498	5500	entregado	2026-03-05 01:17:54.207+00	\N	0	0	0	credito_empleados
59c54231-7a88-4445-8887-302b87ed99d0	4705	40500	entregado	2026-03-03 18:38:29.796+00	\N	0	40500	0	nequi
ce50bc6e-5954-4272-ad93-d2c1949a55f9	10066	16000	entregado	2026-03-13 17:30:25.308+00	\N	0	16000	0	nequi
0fc60b67-bf6e-4567-906a-22b9831d57f2	2807	6000	entregado	2026-03-03 21:01:50.137+00	\N	0	0	0	credito_empleados
dffd52dd-5a57-43e0-b89b-b18b7c66db64	6810	6000	entregado	2026-02-27 00:24:03.271+00	\N	0	0	0	credito_empleados
6033bade-c1c7-4c55-9a12-437b90aa95aa	10016	32000	entregado	2026-03-10 18:21:36.031+00	\N	32000	0	0	efectivo
1e990bf7-14b9-435e-97cb-1411f39e1c56	5369	16000	entregado	2026-03-04 17:11:20.124+00	\N	0	16000	0	nequi
25caf478-78c1-4240-89c4-b4dd00e00eae	1697	16000	entregado	2026-03-04 17:12:23.22+00	\N	16000	0	0	efectivo
8ad24428-1911-4b99-817f-5d9afce04e75	2551	21400	entregado	2026-03-05 23:49:12.48+00	\N	21400	0	0	efectivo
f16660d3-0e29-4d3d-bc76-7c7cecce0c19	10026	28600	entregado	2026-03-10 22:12:46.855+00	\N	0	0	28600	tarjeta
1d6685c3-89b3-4122-b1d8-01a0f254762b	7818	20000	entregado	2026-03-06 19:06:32.984+00	\N	0	20000	0	nequi
1f4a4893-f04a-4e3c-8be7-94a94069cb6d	1	16000	entregado	2026-03-06 23:41:07.809+00	\N	0	0	0	credito_empleados
98f8a408-c48f-4484-bebe-dd0e89e8d479	10067	9300	entregado	2026-03-13 17:53:34.443+00	\N	0	9300	0	nequi
46891027-13a9-428e-900c-62367f8aa74e	10000	46000	entregado	2026-03-09 19:01:36.704+00	\N	0	46000	0	nequi
5036e4d6-ad1a-41ae-b07e-eca906087ffc	10036	16000	entregado	2026-03-11 19:38:40.992+00	\N	16000	0	0	efectivo
018b1c5f-73cf-410e-9ea1-73ecd9dbead4	10077	16000	entregado	2026-03-14 18:33:54.046+00	\N	0	0	0	credito_empleados
57f8275c-3e96-42fb-8a01-f90aeea5453c	10046	18000	entregado	2026-03-11 23:06:16.348+00	\N	0	0	0	credito_empleados
e5787a0e-0aa9-4dde-ac36-e87458c15bbd	10056	10500	entregado	2026-03-12 22:39:36.322+00	\N	0	10500	0	nequi
1e0cfa1a-49bc-4d67-810e-582d0c60c85d	10087	22000	entregado	2026-03-17 17:22:04.397+00	\N	0	22000	0	nequi
c813534d-5c15-4ee3-95d6-d9ec53ebbbdf	10006	8800	entregado	2026-03-09 20:36:11.818+00	\N	0	0	0	credito_empleados
d099c56a-46d2-410a-a9c2-ac86eb6b69f9	5975	43000	entregado	2026-03-04 21:20:34.098+00	\N	0	43000	0	nequi
8d60485b-4b1c-44b3-b000-590f1c6eb29b	2069	10500	entregado	2026-03-03 19:05:38.454+00	\N	0	10500	0	nequi
341de0da-d51a-4eb2-a1ef-3a342a94ea4b	6148	17000	entregado	2026-03-03 21:44:13.479+00	\N	0	17000	0	nequi
d0281347-b23a-47db-8984-257752c09ae5	10017	6800	entregado	2026-03-10 18:25:25.827+00	\N	6800	0	0	efectivo
018a97d9-84d1-4be5-a416-69b5323df9e7	6736	22000	entregado	2026-03-04 19:42:41.022+00	\N	22000	0	0	efectivo
b18be600-73a6-4c1e-9439-a183c7b8344b	10068	48000	entregado	2026-03-13 18:25:26.972+00	\N	16000	32000	0	nequi
4841f5f4-ef68-4a82-a82c-083db8b15c21	1213	16000	entregado	2026-03-05 23:51:11.007+00	\N	0	16000	0	nequi
5c81b4ab-cbda-4cac-a46f-832775d3dafa	10027	18600	entregado	2026-03-10 22:25:56.715+00	\N	18600	0	0	efectivo
d63129da-c7c5-4960-8bc1-fe0bd73d7ef6	10037	16000	entregado	2026-03-11 19:43:10.049+00	\N	0	16000	0	nequi
b4135434-f66e-4b1b-b56c-4dad189ea565	2	6000	entregado	2026-03-06 23:57:06.733+00	\N	0	6000	0	nequi
3aae4e92-7e4a-405b-b856-f56247207203	3757	6000	entregado	2026-02-26 00:27:43.085+00	\N	0	0	0	credito_empleados
aecf9d96-0efb-4500-8388-bd303f31b702	10078	26000	entregado	2026-03-14 18:37:30.398+00	\N	26000	0	0	efectivo
f4670570-8083-45b7-8c15-dc485e2bdf2f	10001	6000	entregado	2026-03-09 19:52:57.413+00	\N	0	0	0	credito_empleados
48ca3642-d9dd-4b67-a1fd-d8df25df8656	10047	9800	entregado	2026-03-12 00:22:10.915+00	\N	9800	0	0	efectivo
3b953c72-e6ad-42ad-b7d0-415e608e2b8c	10088	38500	entregado	2026-03-17 17:53:22.18+00	\N	38500	0	0	efectivo
c26bf666-0181-46b8-92a3-daf0c5f0acdb	10057	6000	entregado	2026-03-12 22:48:02.756+00	\N	0	6000	0	nequi
623c6eb9-c383-4674-92c8-808c9547540b	3948	30000	entregado	2025-10-03 18:38:09.135+00	\N	15000	15000	0	efectivo
7ebed9da-08cb-40ed-b966-be35b58dedfd	10007	8800	entregado	2026-03-09 20:37:07.541+00	\N	0	0	0	credito_empleados
88af7b38-b896-46ec-93dc-5bae8f15083f	1865	46000	entregado	2026-03-04 22:37:32.125+00	\N	0	46000	0	nequi
d4c814bf-c9b4-439e-99ef-79c672f2f7dd	5840	17000	pendiente	2026-02-28 02:15:18.902+00	\N	0	0	0	\N
b9cd2141-c2a9-41bd-a81d-9335ae154f14	7773	34000	entregado	2026-03-02 17:22:03.768+00	\N	34000	0	0	efectivo
ee62c8e1-8eae-412b-bf0f-4db8fa44203b	2583	5000	entregado	2026-03-05 23:52:07.453+00	\N	0	5000	0	nequi
51764198-f413-49f5-a758-dbbc421ed1f6	10069	21000	entregado	2026-03-13 18:57:03.249+00	\N	0	0	21000	tarjeta
f1ba1eb8-d882-4cd4-a528-7d1e0dd69557	10018	17000	entregado	2026-03-10 18:45:22.975+00	\N	17000	0	0	efectivo
2011c616-19f8-45be-98c6-7623be70f00d	7966	9500	entregado	2026-03-03 19:21:09.77+00	\N	0	9500	0	nequi
f0471a9f-6da1-4b7c-a7b6-b10ba959d623	10028	33000	entregado	2026-03-10 23:57:42.083+00	\N	0	0	0	credito_empleados
376370ce-dbca-4c09-ada9-7e7ed0d56b17	3	19000	entregado	2026-03-07 16:51:55.377+00	\N	19000	0	0	efectivo
db3f9b03-b164-489c-bb5a-2dcc91f8307b	2134	12000	entregado	2026-03-03 21:50:26.531+00	\N	0	12000	0	nequi
2751e5a4-f7b9-47f2-bdb3-096a898e3aab	2118	40500	entregado	2026-03-04 19:55:28.845+00	\N	0	40500	0	nequi
03e02dbd-a6c4-4255-babe-04ffc6070c76	10002	16000	entregado	2026-03-09 20:14:35.521+00	\N	0	0	0	credito_empleados
2aa345e7-e029-4c79-8978-d4b4dfb684dc	10038	16000	entregado	2026-03-11 19:46:00.565+00	\N	16000	0	0	efectivo
27601b6a-30e6-48a0-86f7-87b13bae3fa2	10079	48000	entregado	2026-03-14 19:27:57.01+00	\N	48000	0	0	efectivo
e79fd162-f352-40d5-af82-6630ad928fc4	10048	57000	entregado	2026-03-12 18:36:08.987+00	\N	57000	0	0	efectivo
70f29d82-64c2-4f98-aefd-54f9ee9d1300	10058	13600	entregado	2026-03-12 23:48:22.349+00	\N	0	0	0	credito_empleados
cd7fde0c-8a2e-46ec-b471-94ed17e3fc2e	5574	49500	entregado	2025-10-08 00:29:04.491+00	\N	19500	30000	0	nequi
0735f4c1-3ba2-4b0b-a864-8cb242ff4773	10089	17000	entregado	2026-03-17 18:01:12.622+00	\N	0	17000	0	nequi
03f9f53a-60ef-452e-93a0-82e9b7b448c6	1458	60000	entregado	2025-10-07 18:18:54.775+00	\N	15000	45000	0	nequi
edc57912-351d-4c1a-b9e3-443d72f40504	4381	16000	entregado	2026-03-04 23:18:02.942+00	\N	0	16000	0	nequi
994c1774-d5bf-4fc2-b0ea-813910dfa628	2014	18000	entregado	2026-03-02 17:30:40.657+00	\N	0	18000	0	nequi
97e8ec60-7c5e-495f-b480-3ed622693759	10070	16000	entregado	2026-03-13 20:04:14.829+00	\N	0	0	0	credito_empleados
08291555-9d1f-45ed-83e1-81340203a6eb	10008	28900	entregado	2026-03-09 23:01:20.529+00	\N	28900	0	0	efectivo
57866140-8280-46b8-b0ad-dff48341dd84	3882	16000	entregado	2026-03-05 17:38:21.321+00	\N	16000	0	0	efectivo
a597b15c-8887-4c7b-873d-80cf0c5733b6	8294	33000	entregado	2026-03-03 19:48:09.989+00	\N	0	33000	0	nequi
9c55c61f-a3c9-4d2b-995c-4dde837cb1d5	10080	4000	entregado	2026-03-14 20:16:42.599+00	\N	0	0	0	credito_empleados
05884f8a-d296-4434-9564-4269a5ec50fe	5945	22000	entregado	2026-03-05 23:53:16.293+00	\N	0	22000	0	nequi
6aca7e58-b823-44b5-9af3-271e4051d474	10019	6000	entregado	2026-03-10 19:35:29.126+00	\N	0	0	0	credito_empleados
e5745e4a-6282-403e-9d0f-687c2c8a3cfb	9162	6000	entregado	2026-03-04 20:03:43.659+00	\N	0	0	0	credito_empleados
e8f1a985-a8e8-4b9e-9666-1a498383b9bb	10029	1000	entregado	2026-03-11 00:10:06.256+00	\N	0	0	0	credito_empleados
b1c0565f-11e8-4bb8-a9c1-247ce2653593	2837	34000	entregado	2026-03-06 19:28:36.873+00	\N	0	0	34000	tarjeta
1187b756-67ff-4b80-880a-ec101dc51c3c	4	16000	entregado	2026-03-07 18:28:19.662+00	\N	0	16000	0	nequi
fecf2df4-b7e5-4789-bdb7-7d974f912402	10003	8800	entregado	2026-03-09 20:26:09.856+00	\N	0	0	0	credito_empleados
d1bd9e76-2d4d-4113-b6a7-efc73b9ea725	10039	9800	entregado	2026-03-11 19:57:10.695+00	\N	0	9800	0	nequi
f11c357b-914d-4ffb-a17b-df5b971eec82	10090	20000	entregado	2026-03-17 18:08:02.838+00	\N	20000	0	0	efectivo
8d6a5325-6871-42a0-a7ec-622f5637e7cb	10049	77500	entregado	2026-03-12 18:49:48.134+00	\N	0	77500	0	nequi
8555f6f7-16cb-4b8a-9ece-b8c2e8419c3b	10059	40000	entregado	2026-03-12 23:52:24.122+00	\N	0	40000	0	nequi
6f1e1cd3-cc88-4843-8382-da8e2e02642e	8297	3000	entregado	2026-03-01 04:11:54.76+00	\N	0	0	0	credito_empleados
60b2a83a-e350-460c-a943-9cafff7723cb	10009	6800	entregado	2026-03-09 23:26:06.592+00	\N	0	0	0	credito_empleados
a4cca9b9-8f0f-44ee-b2a1-62c2388d57f1	8148	34000	entregado	2026-03-02 18:43:23.704+00	\N	17000	17000	0	efectivo
ffba5fa5-7db3-4a62-ab0b-3cf097c81580	1926	18000	entregado	2026-03-04 23:26:52.561+00	\N	18000	0	0	efectivo
b94bbf17-cc90-4a21-8584-12ce0159b65c	3711	17000	entregado	2026-03-03 19:49:31.491+00	\N	0	0	17000	tarjeta
4a4a6432-17d1-405f-a0b6-f81c079f5cf7	10020	6000	entregado	2026-03-10 19:38:59.931+00	\N	0	0	0	credito_empleados
eb9bb209-fc08-42bd-927a-b4834d763153	6766	35500	entregado	2026-03-05 23:54:40.572+00	\N	0	35500	0	nequi
df7ca570-eb64-48dc-95b0-0b522c89f215	9612	19000	entregado	2026-03-03 23:11:22.466+00	\N	0	19000	0	nequi
57f5398d-1efd-44d5-a141-a6f14cf30f1e	10071	6000	entregado	2026-03-13 20:20:27.16+00	\N	0	0	0	credito_empleados
922c83c7-3d21-4bcd-b57d-4db562d52855	9182	29000	entregado	2026-03-04 20:40:48.944+00	\N	0	29000	0	nequi
bebbf72d-0001-422d-819d-39e6ad03be34	1605	30000	entregado	2026-03-06 19:45:42.361+00	\N	30000	0	0	efectivo
14b8a0d3-4e57-47c3-95c2-9e9953253a06	10030	48000	entregado	2026-03-11 17:21:53.679+00	\N	0	48000	0	nequi
cc81b2e7-6643-40b6-871a-16b6bcdc93d3	5	35000	entregado	2026-03-07 18:34:55.866+00	\N	0	0	0	credito_empleados
29410a76-8b20-408c-b760-2bf3b1978f28	10040	16000	entregado	2026-03-11 20:02:00.711+00	\N	0	0	0	credito_empleados
0fe8eec9-3b82-4cf2-b44c-85ce29018b00	10081	22000	entregado	2026-03-16 18:13:33.785+00	\N	0	22000	0	nequi
7959fe81-c0ce-4097-a473-ca4554179590	10050	19000	entregado	2026-03-12 19:17:47.814+00	\N	19000	0	0	efectivo
bd9a0c41-19f0-4db9-88dc-a666cf207342	10060	16000	entregado	2026-03-13 00:14:35.985+00	\N	0	0	0	credito_empleados
2b12b070-78de-472d-b41a-4696f10f3924	10091	16000	entregado	2026-03-17 18:21:29.839+00	\N	16000	0	0	efectivo
ba2b0c1f-87af-4481-8659-d8ae48fc6954	5796	16000	entregado	2026-03-05 00:00:29.787+00	\N	0	16000	0	nequi
f725ddbf-2a16-4c58-b0ac-81cd3d148c94	8812	48000	entregado	2026-03-02 18:54:01.726+00	\N	0	48000	0	nequi
5c696ffe-3a25-4a89-b51b-d6525973935f	10010	34000	entregado	2026-03-10 17:23:37.054+00	\N	0	34000	0	nequi
11067034-8408-4b3b-8c1d-e7d00061a487	4480	18000	entregado	2026-03-03 17:33:25.808+00	\N	0	18000	0	nequi
53e2df0e-4a01-4209-a5d5-8371f2219bfe	1086	22000	entregado	2026-03-05 18:01:05.943+00	f5b1ba1b-8463-41af-81b9-6a8c8573d4ad	0	0	22000	tarjeta
ce9c540d-26e2-414d-9515-5d5ae8f589b5	10072	28000	entregado	2026-03-13 21:16:34.028+00	\N	0	28000	0	nequi
7fcec3a4-88cc-4b77-8769-1c8bbaf21e6e	5850	16000	entregado	2026-03-06 00:00:28.903+00	\N	0	0	0	credito_empleados
b929eb2d-98b0-44b6-9fe2-2a43ba614b2c	6732	22000	entregado	2026-03-03 19:52:37+00	\N	0	0	22000	tarjeta
7503cb10-42bf-448d-88fb-aaa6186d2480	5449	43000	entregado	2026-03-03 23:55:24.122+00	\N	0	43000	0	nequi
e6982d0b-53a0-4dce-b98d-45c8f56ade88	10021	22000	entregado	2026-03-10 19:45:12.542+00	\N	22000	0	0	efectivo
ca874ee6-78c1-4817-bfea-8705ee4c4259	5553	33500	entregado	2026-03-06 19:47:49.769+00	\N	0	33500	0	nequi
37290857-cd85-4bab-8831-9a03a17d7fb4	1998	5000	entregado	2026-03-04 20:44:12.757+00	\N	5000	0	0	efectivo
353e0ca6-531d-48a9-a911-4c65f43e434b	6	12000	entregado	2026-03-07 19:15:09.946+00	\N	0	0	0	credito_empleados
05633695-a81f-42ab-bf74-6ddfd8068467	10082	32000	entregado	2026-03-16 18:15:53.602+00	\N	0	32000	0	nequi
1aa55f02-eebf-4a32-8f23-5ca4e8d33b67	10031	32000	entregado	2026-03-11 17:26:00.869+00	\N	16000	16000	0	nequi
51488d76-f244-48cc-9e9a-9b38e8b99911	10041	6000	entregado	2026-03-11 20:04:50.364+00	\N	0	6000	0	nequi
e0a91e3b-682d-4667-9023-8b324dcaf8c8	10051	16000	entregado	2026-03-12 19:21:05.319+00	\N	0	0	0	credito_empleados
b4f19e2f-7582-4cab-a2b1-ee3d25b59013	10092	17000	entregado	2026-03-17 18:23:32.972+00	\N	0	17000	0	nequi
cba2133d-aacf-4854-a8df-bae2b26d221a	10061	6000	entregado	2026-03-13 00:17:08.527+00	\N	0	6000	0	nequi
792bcf28-75dd-48e6-a8fd-155dd69e7609	3703	16000	entregado	2026-03-05 00:14:12.584+00	\N	0	0	0	credito_empleados
51b0e86d-8087-4845-b0f2-51ebcf3b660f	3935	17000	entregado	2026-03-02 20:10:22.93+00	\N	0	0	0	credito_empleados
c2204cb6-2a33-46e6-a364-9b5507a5081e	8100	17000	entregado	2026-03-06 00:01:49.031+00	\N	0	0	0	credito_empleados
d3a287cd-96ed-4d14-82c3-e23433ab2119	9493	16000	entregado	2026-03-06 20:12:26.54+00	\N	0	0	0	credito_empleados
227b7efc-4d75-4c63-b622-bccf4c44c64b	9678	33000	entregado	2026-03-03 17:39:02.756+00	\N	17000	16000	0	efectivo
92a348b0-ac4e-492c-9dc6-bae3f8254a7b	10011	16000	entregado	2026-03-10 17:27:20.968+00	\N	0	16000	0	nequi
b220b21d-57b4-4485-90d2-00d102a13bd5	1966	5500	entregado	2026-03-03 19:59:24.435+00	\N	0	0	0	credito_empleados
31e9410d-faa8-4bd1-97db-75e95f2293e2	10073	76500	entregado	2026-03-13 21:43:49.115+00	\N	76500	0	0	efectivo
ed0fb156-f5c4-42da-970f-95bf45e06240	10022	17000	entregado	2026-03-10 19:48:26.626+00	\N	0	0	0	credito_empleados
1a0caa2a-5de7-4f62-8b1f-ab9c8477b8af	10032	22500	entregado	2026-03-11 17:37:03.127+00	\N	0	22500	0	nequi
75e49461-39d8-495d-ad51-ab7ec90c57f7	10083	6800	entregado	2026-03-16 20:19:12.551+00	\N	6800	0	0	efectivo
b94d57cc-07f5-4404-a15f-e4d7fe04d3f7	10042	36000	entregado	2026-03-11 20:12:37.263+00	\N	0	0	0	credito_empleados
d43135f2-0fee-4f0e-92ab-f69cfc4bb15a	10052	10500	entregado	2026-03-12 20:37:30.957+00	\N	0	0	0	credito_empleados
2cb28d84-4321-4994-aff6-a0f5cbffa23c	10062	9300	entregado	2026-03-13 16:52:59.731+00	\N	0	0	0	credito_empleados
74375328-042d-483c-a89e-f887c8818daf	10093	17000	entregado	2026-03-17 18:34:41.875+00	\N	0	17000	0	nequi
68f500ad-bb4e-4328-9d2a-9bcda8a7d6b0	1316	15000	entregado	2025-09-23 02:42:31.889+00	\N	15000	0	0	efectivo
ae9b4a21-6777-4cbc-9210-f5de90f6a6ba	4788	6000	entregado	2026-03-05 00:46:16.264+00	\N	0	6000	0	nequi
edccc54d-a6c3-403e-b230-a0ff48f54a14	9449	27000	entregado	2026-03-02 21:22:51.616+00	\N	27000	0	0	efectivo
73861636-7584-4d05-bb21-a817284dec3c	10012	18000	entregado	2026-03-10 17:41:17.072+00	\N	18000	0	0	efectivo
42d9a69e-54ee-45ac-ad88-efaea35c5db1	9518	10500	entregado	2026-03-05 18:04:50.471+00	\N	0	0	10500	tarjeta
2629bab1-88ef-4810-b834-9f089b98854b	2858	32000	entregado	2026-03-03 17:43:30.072+00	\N	32000	0	0	efectivo
dfc3d669-7245-45ff-b720-33581d7f270e	9929	16000	entregado	2026-03-03 20:14:09.711+00	\N	0	0	0	credito_empleados
fc45e897-a785-4ebe-81c1-3ab20e6644b0	3876	25500	entregado	2026-02-26 16:33:56.838+00	\N	0	0	0	credito_empleados
d4562f5a-3ce8-4678-9caa-c696468a5463	3802	17000	entregado	2026-03-04 00:54:12.904+00	\N	0	0	0	credito_empleados
886907f5-46c2-4aca-bfb5-e5c3207dd2da	10074	26500	entregado	2026-03-13 23:34:59.755+00	\N	26500	0	0	efectivo
8ec91978-274c-4e0e-860b-f6b27c1ba961	10013	32000	entregado	2026-03-10 17:43:11.032+00	\N	32000	0	0	efectivo
a0da5289-da4f-4e89-b83b-3f54f9c3ae14	1257	17000	entregado	2026-03-06 20:27:12.993+00	\N	17000	0	0	efectivo
676047eb-8275-47f0-a2a8-07f51ef78354	10084	16000	entregado	2026-03-16 20:20:24.367+00	\N	0	0	0	credito_empleados
997730fc-a9a4-4da2-834c-b7d990ccfced	10023	17000	entregado	2026-03-10 20:16:48.985+00	\N	0	0	17000	tarjeta
f44d40bc-5a5b-4a34-ba51-fe6faa781665	10094	16000	entregado	2026-03-17 19:43:17.791+00	\N	0	0	0	credito_empleados
7da4d87b-2602-42a7-818e-36e424a65234	10033	9800	entregado	2026-03-11 17:39:24.314+00	\N	0	9800	0	nequi
b31ef09a-a3a0-467f-9e8c-bb30adf05f13	10043	6000	entregado	2026-03-11 21:26:05.181+00	\N	0	6000	0	nequi
30d52eb4-3acd-453e-a9f4-f89bb269c87e	10053	12000	entregado	2026-03-12 21:33:39.765+00	\N	0	0	0	credito_empleados
e42017fb-1432-4173-a704-d3121a3f6ed8	10063	9500	entregado	2026-03-13 17:05:21.551+00	\N	9500	0	0	efectivo
e2a4ed14-5a5e-42bd-b3d2-37e7fc51c40b	3372	30000	entregado	2025-10-06 18:10:18.214+00	\N	15000	15000	0	efectivo
ed82fde7-ddf6-437e-81ef-aa295e7f93d5	4596	15000	entregado	2025-10-04 19:05:50.016+00	\N	15000	0	0	efectivo
01b39d71-2638-4329-804b-153fb7ab5cea	1157	23000	entregado	2025-10-08 17:06:36.086+00	\N	0	0	23000	tarjeta
7347603e-a84b-4186-9b7a-959d2ffb2c6d	6803	28500	entregado	2025-10-07 19:58:03.753+00	\N	0	28500	0	nequi
29ce2099-a354-4d5b-9d47-69a51187536d	10064	16000	entregado	2026-03-13 17:15:57.478+00	\N	0	16000	0	nequi
5e631e64-3edc-4b4f-92de-73d7278e6627	10014	27000	entregado	2026-03-10 18:01:55.375+00	\N	0	27000	0	nequi
35614ecd-87c9-449d-8a75-8c914b5b6216	5515	17500	entregado	2025-10-03 23:18:31.637+00	\N	17500	0	0	efectivo
cc4ee3c8-fc98-4f79-8db2-c2c3db251317	2677	17000	entregado	2026-03-02 21:27:52.724+00	\N	0	17000	0	nequi
02138fc1-f29b-4c80-90fb-a7c324f110b2	5177	16000	entregado	2026-03-03 20:35:19.903+00	\N	0	0	0	credito_empleados
b51e7e68-0282-4d18-b159-f18b74c1db37	2837	26400	entregado	2026-03-05 21:40:49.701+00	\N	0	26400	0	nequi
dbd1e1a4-abb7-4774-878a-c79ba65fd1a2	6731	19000	entregado	2026-03-04 01:43:50.792+00	\N	0	19000	0	nequi
b6f72ece-dde3-4ea9-ae2d-f9adcab8ac6d	10024	38000	entregado	2026-03-10 21:50:58.861+00	\N	38000	0	0	efectivo
fb1d57b3-a86a-4dd9-aa4e-39968e1c610f	10075	17000	entregado	2026-03-14 17:49:46.534+00	\N	17000	0	0	efectivo
bce93cab-b4ae-4f56-84c2-258428392c98	2142	22000	entregado	2026-03-06 17:11:07.374+00	\N	0	22000	0	nequi
f6b7a3ff-1eb3-45a8-9016-421a2ea40578	10034	21000	entregado	2026-03-11 17:45:28.885+00	\N	21000	0	0	efectivo
550f4249-3658-4580-8e06-82b40534831e	5485	6000	entregado	2026-03-06 20:38:37.784+00	\N	0	0	0	credito_empleados
7e01ca38-774f-4f3c-b368-746fc320e3ca	9997	17000	entregado	2026-03-09 18:46:53.041+00	\N	0	17000	0	nequi
b27137dc-ef39-4545-83a5-7f40ae2397aa	10044	21000	entregado	2026-03-11 21:36:56.856+00	\N	21000	0	0	efectivo
332c0914-2aa5-4c71-be97-ef1f0d8d8ac8	10085	10800	entregado	2026-03-16 21:09:17.164+00	\N	10800	0	0	efectivo
28b971dd-0e71-4f7a-ae85-c35acfe90a91	10054	17300	entregado	2026-03-12 22:27:33.044+00	\N	0	0	0	credito_empleados
e5c25b37-e228-4aea-9c72-0735b963cd6d	10095	36000	entregado	2026-03-17 21:37:38.628+00	\N	36000	0	0	efectivo
3c90dcdf-0d37-41e2-9b25-50cda3493ad5	8289	38000	entregado	2025-10-06 19:14:51.93+00	\N	38000	0	0	efectivo
7903a752-459e-4f1d-b0b2-756db524dee5	2932	0	entregado	2025-10-10 01:06:30.149+00	\N	0	0	0	credito_empleados
6272d566-8a1d-4d79-84fc-458ce730f2bc	3096	4500	entregado	2025-10-07 21:33:27.209+00	\N	4500	0	0	efectivo
6db66dd3-3e21-42a0-8c9d-163c11e50ed9	7006	16500	entregado	2025-10-08 18:09:19.112+00	\N	16500	0	0	efectivo
836ccca0-70cf-4247-a088-e7e84514cb2a	9712	60000	entregado	2025-10-07 17:27:31.306+00	\N	30000	30000	0	efectivo
316cd9e8-bc4c-4eea-8a6b-07a8c4170cf6	9054	11000	entregado	2025-10-20 22:03:16.781+00	\N	11000	0	0	efectivo
4036fa1f-4313-4c70-aeeb-7aa309590fdc	3719	23000	entregado	2025-10-09 17:03:16.374+00	\N	23000	0	0	efectivo
9bf5f289-b464-4b38-a5a3-6637223128d8	8857	28200	entregado	2025-10-07 23:18:36.102+00	\N	28200	0	0	efectivo
42a61ba0-4069-4ec1-8f35-d2be8cc60a36	3125	20400	entregado	2025-10-07 18:16:17.824+00	\N	0	20400	0	nequi
4ac1e117-2480-477c-b3e6-e5d69b74ce7b	7868	15000	entregado	2025-10-09 17:03:52.62+00	\N	0	15000	0	nequi
e0e2ef54-e04f-4b33-8e38-1ded2af76770	7965	16000	entregado	2025-10-16 17:25:41.226+00	\N	16000	0	0	efectivo
523a633e-a4fb-46b3-8f2c-a8d86adfd1f1	5102	22000	entregado	2025-10-07 23:56:45.248+00	\N	0	22000	0	nequi
1924a0a8-c9d0-465b-96f4-04942e41ebf1	8383	29000	entregado	2025-10-08 18:45:25.79+00	\N	0	29000	0	nequi
3f2e8aea-dbaf-44ad-8417-19a934e8eb21	9785	15000	entregado	2025-10-10 18:21:26.359+00	\N	0	0	15000	tarjeta
b5796c09-5ebc-4053-8725-2b4d5fad45dd	8478	31000	entregado	2025-10-09 17:36:12.296+00	\N	31000	0	0	efectivo
789aa7ab-b534-461c-8aab-84a3ff95f46c	8627	61000	entregado	2025-10-08 19:39:09.55+00	\N	61000	0	0	efectivo
6227c222-7e7a-4085-bf14-5f0643e6c042	8825	30000	entregado	2025-10-09 18:02:01.82+00	\N	30000	0	0	efectivo
82b44b60-67f9-4858-883e-830940e16298	9764	18500	entregado	2025-10-15 00:27:22.586+00	\N	0	18500	0	nequi
3e07ab61-6b05-43a7-ad66-f713d9c2886d	8651	71300	entregado	2025-10-08 21:56:48.356+00	\N	14800	56500	0	nequi
f1d9fb19-9cda-4fcf-8b12-86c34a1b2b7f	8551	15000	entregado	2025-10-09 18:22:27.001+00	\N	15000	0	0	efectivo
9976924b-6e66-4820-a418-6b9d2baa54ca	3981	8000	entregado	2025-10-18 17:58:16.496+00	\N	8000	0	0	efectivo
c7f9357f-2f77-48e1-8575-bdef13c24e3f	6076	35000	entregado	2025-10-08 22:52:19.812+00	\N	35000	0	0	efectivo
5c65573e-1f98-4bdf-a066-444e7c3002bc	2368	15000	entregado	2025-10-16 17:54:10.938+00	\N	0	15000	0	nequi
28a03697-9484-4783-979d-6e30b0037eca	7999	30000	entregado	2025-10-09 19:50:27.328+00	\N	30000	0	0	efectivo
b37ccff6-b3a5-4808-9b4c-a56fe101f236	9076	15000	entregado	2025-10-15 17:02:50.657+00	\N	0	0	15000	tarjeta
e0331f13-f6bc-4154-b7da-72a37345f832	6979	21000	entregado	2025-10-10 20:42:10.181+00	\N	21000	0	0	efectivo
6c0b3c2f-677d-44ba-aa76-ab497ede08a7	7296	8000	entregado	2025-10-09 21:40:43.58+00	\N	8000	0	0	efectivo
dc4971ce-f8ad-427e-88ae-e2941ea64c1e	4572	15000	entregado	2025-10-10 19:39:59.28+00	\N	0	15000	0	nequi
6a34a3ea-152f-448f-bb25-435425a4eb2b	3509	38000	entregado	2025-10-09 22:32:55.224+00	\N	19000	19000	0	efectivo
cd359fb2-1e03-45c9-982d-8eb7c222ba90	1868	30000	entregado	2025-10-17 22:17:36.416+00	\N	30000	0	0	efectivo
721483bf-3b01-49f6-9ae3-246490a698f3	9875	11000	entregado	2025-10-10 22:45:38.584+00	\N	0	11000	0	nequi
fff6ba48-a929-4f60-ab68-b47a2156d7d9	8799	49000	entregado	2025-10-09 23:32:15.345+00	\N	0	0	49000	tarjeta
7b1c2577-c168-4800-a7af-629f9b73338b	2104	30000	entregado	2025-10-15 18:02:52.404+00	\N	0	30000	0	nequi
4291cf9a-2df6-4536-af02-44b22b44f86d	4260	37500	entregado	2025-10-11 00:45:59.653+00	\N	0	37500	0	nequi
ebb87bf9-3db2-4e0c-983d-c3477e97a646	9794	30000	entregado	2025-10-16 18:32:03.922+00	\N	30000	0	0	efectivo
91949f52-fc48-466a-a78d-578bec96f729	7365	18000	entregado	2025-10-11 17:32:54.14+00	\N	18000	0	0	efectivo
4f1cce1f-4085-4e62-80b0-582ed711a4c4	7604	53000	entregado	2025-10-20 17:43:35.945+00	\N	53000	0	0	efectivo
feec82aa-5abd-4a4a-abfe-9b7550a46f4d	6018	45000	entregado	2025-10-15 18:40:48.247+00	\N	0	45000	0	nequi
5e94ba31-47f3-421d-9b00-3da132649e9d	6679	17000	entregado	2025-10-14 22:49:56.489+00	\N	17000	0	0	efectivo
35734079-38c8-4b0a-966f-284e1f1239f0	1578	56000	entregado	2025-10-16 22:30:18.009+00	\N	0	56000	0	nequi
64c72e4e-36e6-44c1-8c61-2c7068250f4d	8464	31000	entregado	2025-10-14 23:38:56.44+00	\N	0	31000	0	nequi
9d52ded6-ca55-42a4-8dfd-8664f6e0b356	7522	6000	entregado	2025-10-15 20:37:11.061+00	\N	6000	0	0	efectivo
5bcaa0bb-b4fa-4971-9690-27eacdd68ae6	8300	15000	entregado	2025-10-22 01:35:02.208+00	\N	0	15000	0	nequi
17f5b545-d61b-4fef-b8c1-ff78ae877fe6	3808	30500	entregado	2025-10-17 23:33:02.779+00	\N	0	30500	0	nequi
9fac0c78-13d6-40df-a077-f91fd1e284f4	8496	50000	entregado	2025-10-18 19:12:21.66+00	\N	0	50000	0	nequi
681c46a9-9740-4f63-8caf-fccdd1f02913	5593	28500	entregado	2025-10-15 23:11:29.272+00	\N	0	28500	0	nequi
ff3e92a3-2087-423a-bbb3-88a1e6f0af0d	5840	18500	entregado	2025-10-17 22:10:10.947+00	\N	18500	0	0	efectivo
c41ba611-48a6-40d1-85db-5ec766ec4cc2	5732	33000	entregado	2025-10-17 01:32:31.455+00	\N	0	33000	0	nequi
75eabd19-3958-453a-9424-5253c648ad35	8931	15000	entregado	2025-10-17 21:30:57.07+00	\N	15000	0	0	efectivo
7dc26a59-aff9-4772-add0-68585c439036	3496	27500	entregado	2025-10-17 21:16:05.083+00	\N	27500	0	0	efectivo
4d514193-0ee8-435a-bf4e-bec126f97aff	8301	54000	entregado	2025-10-20 23:48:59.357+00	\N	28500	25500	0	efectivo
cd1f8aea-183c-4a08-9323-72d466d3aece	5440	15000	entregado	2025-10-18 01:32:27.029+00	\N	15000	0	0	efectivo
840f3214-c02d-435a-9b2d-b492ba9649cd	3071	15000	entregado	2025-10-20 18:29:28.216+00	\N	15000	0	0	efectivo
ceac8fbd-f6c7-4077-b332-15e07b3e1453	1728	43000	entregado	2025-10-20 17:21:56.148+00	\N	43000	0	0	efectivo
584efed4-2734-418c-8c44-84e057812587	4379	16000	entregado	2025-10-22 01:34:15.318+00	\N	16000	0	0	efectivo
324001dd-8939-41d1-b6e8-78e8179dbd93	2644	25000	entregado	2025-10-23 00:01:50.598+00	\N	25000	0	0	efectivo
da6bbcf9-bbdf-44d1-a0c3-9cfda228a399	3785	29500	entregado	2025-10-22 01:28:26.239+00	\N	0	29500	0	nequi
f5b06656-f831-460e-b229-0e8db189072d	5402	15000	entregado	2025-10-22 23:17:29.815+00	\N	0	0	15000	tarjeta
822d2939-44ca-4e23-9d81-fd21ec0e1ddf	3573	15000	entregado	2025-10-22 23:06:17.15+00	\N	15000	0	0	efectivo
8e30181f-937b-4526-ad62-0cd20a7521d2	5035	46000	entregado	2025-10-23 00:00:32.848+00	\N	0	46000	0	nequi
559c774e-528d-42a0-8642-23a3dd580262	2402	15000	entregado	2025-10-23 00:19:52.735+00	\N	15000	0	0	efectivo
452a212a-a361-4441-b90d-622e3b105e38	6518	33000	entregado	2025-10-23 17:27:04.675+00	\N	0	33000	0	nequi
17c67c4a-54f8-4999-9580-be9c80dff1f6	6416	15000	entregado	2025-10-23 18:08:12.686+00	\N	0	15000	0	nequi
309249b4-8a38-4dfc-a6d2-727b3c18306a	5733	52000	entregado	2025-10-23 18:45:28.143+00	\N	18500	33500	0	nequi
aa6d1520-8381-4aaf-bd3c-8e8f053f1845	9192	30000	entregado	2025-10-23 22:02:32.71+00	\N	30000	0	0	efectivo
a9def3b9-a285-4ff4-80e8-dc8712c4712c	2618	23000	entregado	2025-10-23 23:26:46.858+00	\N	23000	0	0	efectivo
e8a56078-333e-40be-a234-0c584600bae8	6755	78600	entregado	2025-10-24 00:56:13.572+00	\N	0	0	78600	tarjeta
dd3e6281-a901-4f68-876e-3ab7d9982e0a	7660	62000	entregado	2025-10-24 02:02:08.626+00	\N	62000	0	0	efectivo
fafe1c35-c451-49a3-9cc6-b97da1ac4e59	4438	16000	entregado	2025-10-24 17:35:01.813+00	\N	16000	0	0	efectivo
d55c84b1-915f-45a9-b1de-cb57bf842df2	5849	16000	entregado	2025-10-07 18:21:26.975+00	\N	16000	0	0	efectivo
a95b6603-e103-4f91-800a-da40c38c82e0	1083	0	entregado	2025-10-04 12:55:55.496+00	\N	0	0	0	\N
c9737740-368d-4079-8e07-9da6a238db5a	4388	0	entregado	2025-10-08 17:21:14.792+00	\N	0	0	0	\N
865f52ae-beaf-42d4-9139-adb41292ed6a	8728	15000	entregado	2025-10-06 18:27:38.011+00	\N	0	15000	0	nequi
e5763291-0471-4103-b0b3-0217d887d70b	7877	71500	entregado	2025-10-04 19:07:31.966+00	\N	71500	0	0	efectivo
d2f21c00-d9a8-48a9-b313-c8a3b7f580a7	9260	11000	entregado	2025-10-07 20:20:47.721+00	\N	0	11000	0	nequi
66439bf0-533a-417c-a2ff-70f1c2c0dd1d	4483	30000	entregado	2025-10-17 22:20:20.507+00	\N	30000	0	0	efectivo
18785cf6-65f1-4a29-84ff-782eeae35e98	6073	29500	entregado	2025-10-03 23:19:53.896+00	\N	29500	0	0	efectivo
ee2c5520-35a6-4502-8444-f5aede2b1a28	9556	40000	entregado	2025-10-17 22:10:59.938+00	\N	0	40000	0	nequi
408c2600-f1a6-4d89-9bfe-eaf048b11006	5256	38000	entregado	2025-10-09 17:04:44.236+00	\N	30000	8000	0	efectivo
fb60945a-bbe0-4693-ba76-2486d661f3c6	5447	18500	entregado	2025-10-07 21:42:35.825+00	\N	0	18500	0	nequi
937bb9e8-aa27-455f-af4a-2d83a43109ae	8589	21000	entregado	2025-10-08 18:12:11.627+00	\N	0	0	21000	tarjeta
904364e6-4648-47dc-b113-cc16b8e028ca	5313	0	entregado	2025-10-07 22:24:54.494+00	\N	0	0	0	credito_empleados
218f9a95-0586-40ca-852c-16fb0d050445	7308	9500	entregado	2025-10-06 20:50:23.254+00	\N	0	9500	0	nequi
9091a4f4-89d9-4a9e-950f-b126c8e95ef1	8547	15000	entregado	2025-10-10 17:24:28.963+00	\N	15000	0	0	efectivo
a54ce571-b5a1-470a-be77-95ff870c4d8b	5131	19500	entregado	2025-10-07 17:40:06.695+00	\N	19500	0	0	efectivo
cb36be9e-bbc6-432a-bca1-1cb4ec107a82	6169	6000	entregado	2025-10-07 23:25:46.794+00	\N	6000	0	0	efectivo
11bb9e81-f5ec-4336-9f20-116e3489c89d	3478	15000	entregado	2025-10-08 18:46:17.233+00	\N	0	15000	0	nequi
9a069c9b-fa33-46fd-b2c3-f6327bc0e116	4510	15000	entregado	2025-10-14 23:39:27.158+00	\N	15000	0	0	efectivo
bff01748-134d-40d4-b05c-94f268031d72	1251	10500	entregado	2025-10-08 00:21:44.629+00	\N	10500	0	0	efectivo
5dfae957-294d-4a76-a0c9-a82e9a82ee76	4231	16000	entregado	2025-10-09 17:50:44.708+00	\N	0	16000	0	nequi
665d440e-2475-4605-aa4b-4036568c93de	6687	19000	entregado	2025-10-08 20:24:07.503+00	\N	19000	0	0	efectivo
d0158ec1-082f-47ad-b74b-9e7a98e48af2	6284	28500	entregado	2025-10-10 18:27:33.692+00	\N	0	28500	0	nequi
bf939dd9-fbc1-4489-a4ab-7a040dfe2ac5	1394	45000	entregado	2025-10-09 18:07:14.193+00	\N	45000	0	0	efectivo
2fb57344-ea5c-4d12-abd3-e8c7c567c822	8483	50000	entregado	2025-10-22 01:40:10.033+00	\N	25000	25000	0	efectivo
88c0f77d-1480-4712-90a9-444a35527b3e	1934	14500	entregado	2025-10-08 22:13:58.439+00	\N	14500	0	0	efectivo
feaf8600-a8c0-4ed6-b80a-62da533b98f5	9610	23000	entregado	2025-10-16 17:26:49.43+00	\N	23000	0	0	efectivo
ec863fd9-648a-4d4c-b448-1b08d0bb83bc	7581	0	entregado	2025-10-10 19:44:27.184+00	\N	0	0	0	credito_empleados
5b707867-ca89-49aa-b3eb-b031f60de6e3	9421	15000	entregado	2025-10-09 18:41:04.076+00	\N	0	15000	0	nequi
7e792309-d5bc-4a31-aecd-5664c15e90c2	9445	32500	entregado	2025-10-08 22:59:57.602+00	\N	0	32500	0	nequi
90b69657-6feb-4e5d-8ff2-506f14cf9e22	1067	27000	entregado	2025-10-15 16:48:40.249+00	\N	0	0	27000	tarjeta
9fc02ffb-00fa-4b9b-8cc3-4305828a936a	2808	0	entregado	2025-10-09 20:25:59.828+00	\N	0	0	0	credito_empleados
dc290b73-e075-4793-a0d7-8ad969b1aef5	4402	0	entregado	2025-10-09 22:01:21.718+00	\N	0	0	0	credito_empleados
20fc4224-e17d-437f-99a7-83deab25f137	8848	15000	entregado	2025-10-17 21:18:18.621+00	\N	15000	0	0	efectivo
8e7cc1cc-35a6-4eb8-b9d5-3f377b820a92	2549	34500	entregado	2025-10-10 21:06:40.295+00	\N	0	34500	0	nequi
144ab9c9-3a84-4421-a746-073524df4daa	6559	0	entregado	2025-10-09 22:52:55.894+00	\N	0	0	0	credito_empleados
fb6a33b6-6994-4d7d-b086-ed9f26c83e1d	3084	8000	entregado	2025-10-15 17:06:29.351+00	\N	0	8000	0	nequi
68ddec63-f15f-4787-8c94-dacedb329d55	4933	47500	entregado	2025-10-23 18:55:46.232+00	\N	0	47500	0	nequi
b87c518c-cbba-460f-aad2-d797c41daac8	7043	46000	entregado	2025-10-10 23:23:43.015+00	\N	0	46000	0	nequi
d628d702-fb9e-4c50-bbd0-fcc0eba25cda	6573	31000	entregado	2025-10-16 18:02:48.898+00	\N	1000	30000	0	nequi
fbd4807a-6b48-4cb9-949c-9eda121250f9	6148	11000	entregado	2025-10-15 18:06:03.162+00	\N	0	11000	0	nequi
5af67d61-8bf8-4334-b1a0-6d931166273e	9622	75500	entregado	2025-10-11 16:23:01.325+00	\N	75500	0	0	efectivo
b946f040-5de8-48cc-b33a-757354b0841a	6617	30000	entregado	2025-10-18 18:00:39.749+00	\N	30000	0	0	efectivo
385f9ae0-0223-416a-8a39-ea2add229fad	8183	43000	entregado	2025-10-11 18:24:14.964+00	\N	0	43000	0	nequi
dd20112a-26e2-4fa6-a692-4d540843a698	8167	15000	entregado	2025-10-15 18:41:19.288+00	\N	15000	0	0	efectivo
b52c4187-f0f1-4605-99dc-96acd48e01dc	7905	37500	entregado	2025-10-14 22:58:33.459+00	\N	0	37500	0	nequi
0218811f-374c-421f-9a32-44e8cb3bca14	6918	31500	entregado	2025-10-22 01:37:48.894+00	\N	0	31500	0	nequi
e52bef0e-4eb5-49b8-89e2-64a10cbb0031	7982	35000	entregado	2025-10-15 21:10:12.989+00	\N	35000	0	0	efectivo
2185a0a7-43e5-4cbd-8403-90d6a139d9ca	4760	34000	entregado	2025-10-18 20:53:30.833+00	\N	0	0	34000	tarjeta
3f8cb8fc-aad9-4f42-8201-179f73423f41	3951	33000	entregado	2025-10-15 23:37:48.487+00	\N	33000	0	0	efectivo
51416047-f8bc-4768-b323-1d7231bee7ab	5491	32500	entregado	2025-10-16 22:40:20.48+00	\N	32500	0	0	efectivo
83435164-9963-4b15-a2b8-6aa3b44705a1	4576	31700	entregado	2025-10-17 22:11:49.556+00	\N	15050	0	16650	tarjeta
ce3806b0-5842-4250-8f49-392adc564cba	7267	21000	entregado	2025-10-17 20:45:12.246+00	\N	21000	0	0	efectivo
236ede02-2147-4556-8cf6-4f7b5828893e	3185	30000	entregado	2025-10-23 00:20:43.687+00	\N	30000	0	0	efectivo
981fffe5-2124-42dd-b366-6b0c31bfaf87	4860	30000	entregado	2025-10-21 00:21:53.512+00	\N	30000	0	0	efectivo
4fa6ca2c-ca03-4984-bcb6-00f658e50145	6529	60500	entregado	2025-10-22 01:30:47.632+00	\N	60500	0	0	efectivo
096b3a8e-882f-4455-9c0c-03e0e9cd6d45	4503	30000	entregado	2025-10-20 17:24:37.413+00	\N	30000	0	0	efectivo
712782a1-c931-4682-a2ae-9164cf71f33a	1031	21500	entregado	2025-10-18 17:08:36.913+00	\N	0	21500	0	nequi
10ee65b2-0fb0-4af2-9e6e-1f22d2cad83c	8765	63500	entregado	2025-10-22 01:39:27.265+00	\N	0	63500	0	nequi
447358dd-3493-4ff3-869b-f8ee635fa054	7290	38000	entregado	2025-10-20 23:22:14.112+00	\N	0	38000	0	nequi
79c4711c-2298-4078-9aad-5a897f924c9e	9111	23000	entregado	2025-10-23 00:06:16.904+00	\N	0	23000	0	nequi
00e34b58-7895-40b6-b19c-2c2fdc75bbc3	1702	22500	entregado	2025-10-22 23:21:19.832+00	\N	0	22500	0	nequi
2d3ba6d1-6be5-4a20-8f5f-c78a788942e8	8710	8000	entregado	2025-10-22 23:06:58.906+00	\N	8000	0	0	efectivo
cbd90709-c717-44dc-9019-6a4f91dfa9c5	1632	33500	entregado	2025-10-23 17:39:26.634+00	\N	33500	0	0	efectivo
d051553c-c91c-4d9c-a0d5-83b004c01a6f	6244	45000	entregado	2025-10-23 18:26:43.496+00	\N	0	0	45000	tarjeta
fbeb958e-f82a-4de4-bc5e-c640766bf1af	7796	15000	entregado	2025-10-23 22:04:05.909+00	\N	0	15000	0	nequi
64a630d4-3fcb-47d8-8101-8033799d5494	3015	54000	entregado	2025-10-24 00:06:05.072+00	\N	54000	0	0	efectivo
8f1545c9-5d18-466b-b437-b0fcbd2f7f9f	7137	14500	entregado	2025-10-24 00:03:48.135+00	\N	14500	0	0	efectivo
0df7ad45-5e5d-481c-b2bb-310b899bb182	6032	59500	entregado	2025-10-23 01:59:44.232+00	\N	0	59500	0	nequi
706a1eb1-aaf5-49da-b949-4509854cb24c	7853	15000	entregado	2025-10-24 18:04:34.212+00	\N	15000	0	0	efectivo
3ea38e77-4d17-4c4c-9ebb-171b5eb8a71e	4610	30000	entregado	2025-10-24 17:33:12.304+00	\N	0	30000	0	nequi
a0029610-2852-4911-a754-76903e515c41	8483	75000	entregado	2025-10-24 17:41:24.637+00	\N	75000	0	0	efectivo
6f8e2b32-ff5e-49f8-bf1a-f2790fdf0e0b	4305	43000	entregado	2025-10-24 18:36:13.618+00	\N	43000	0	0	efectivo
cef40a4d-7168-48db-9b3a-7b526d8e865f	2013	10000	entregado	2025-10-10 00:09:27.163+00	\N	10000	0	0	efectivo
7931ff3c-0c3e-4c9a-a3b4-ed4459207f90	8685	46500	entregado	2025-10-24 18:51:25.6+00	\N	0	46500	0	nequi
a2aac2b1-c407-48d7-8073-fea7d0528b14	3474	15000	entregado	2025-09-27 19:38:37.963+00	\N	15000	0	0	efectivo
d713d336-09db-4ef1-bfc4-241b33dd7cc1	7102	34000	entregado	2025-10-03 18:02:49.614+00	\N	34000	0	0	efectivo
528705f2-163c-4abe-9610-ed0a055bd2d7	5018	15000	entregado	2025-10-06 17:24:29.174+00	\N	0	15000	0	nequi
1f6ff01a-f782-4583-bdd0-65cf473ca6c0	4173	30000	entregado	2025-10-07 18:36:14.284+00	\N	0	30000	0	nequi
14d90650-852f-49f1-b49c-9c1ba7efa929	6861	15000	entregado	2025-10-06 18:00:48.202+00	\N	15000	0	0	efectivo
4c42a58a-55dc-4ff7-91f3-943b3066a2ca	5736	30000	entregado	2025-10-08 17:28:31.74+00	\N	30000	0	0	efectivo
73e519fb-574f-4291-b8fb-02824682bf00	9820	11000	entregado	2025-10-04 19:01:16.299+00	\N	0	11000	0	nequi
f9fbee80-e2a6-41f8-9446-4454b29b2a29	8073	14500	entregado	2025-10-04 19:01:56.204+00	\N	0	14500	0	nequi
aecd419d-31a6-4742-919e-57026ef8abb5	6032	16000	entregado	2025-10-07 18:38:11.802+00	\N	0	0	16000	tarjeta
215a053e-2b88-4985-a877-79e592b42982	9751	33000	entregado	2025-10-06 15:23:21.803+00	\N	33000	0	0	efectivo
7b8be6a5-ca93-4bdc-9871-5292e3ee1e26	5480	30000	entregado	2025-10-18 18:04:14.117+00	\N	30000	0	0	efectivo
e059640c-43da-4003-af95-224bfa2bb948	1662	16000	entregado	2025-10-09 17:16:42.112+00	\N	16000	0	0	efectivo
222021f8-141f-4e54-a2fb-d0f6d514a86c	2964	0	entregado	2025-10-07 20:42:42.137+00	\N	0	0	0	credito_empleados
0b4fd783-d1d7-4d51-9f05-2eddac37c831	8671	34500	entregado	2025-10-08 18:13:58.399+00	\N	34500	0	0	efectivo
0b6f6eda-9bb8-45e7-9565-eeeec3d6214e	5643	11000	entregado	2025-10-07 22:12:25.272+00	\N	0	11000	0	nequi
a96c1c68-51c3-4f97-a9d8-13231fe4e0a3	3365	8500	entregado	2025-10-07 16:41:01.157+00	\N	8500	0	0	efectivo
1fe6d248-5533-47a2-aebc-a443ae59a525	6379	49000	entregado	2025-10-11 19:59:40.243+00	\N	0	49000	0	nequi
0b63fdf9-6663-4753-8739-90574dcd2cda	7980	8000	entregado	2025-10-07 22:29:27.048+00	\N	0	8000	0	nequi
4782c728-6d4e-4550-a3b3-f2d476fddab5	5377	4000	entregado	2025-10-08 18:47:42.043+00	445fa2d2-94bc-4ec1-9ae8-928be375b5b7	0	4000	0	nequi
136ea37c-8354-47af-8fdb-2a151b3bd313	6617	11000	entregado	2025-10-07 23:31:34.017+00	\N	11000	0	0	efectivo
b3570bd4-141c-4b81-91d1-354154f08fc9	9033	18500	entregado	2025-10-10 17:38:36.239+00	\N	0	18500	0	nequi
064950d2-3700-407e-b417-6e0a1edca83e	2344	18500	entregado	2025-10-08 20:39:02.071+00	\N	0	18500	0	nequi
302decea-a9ca-41c2-b8b8-a7196ce88a47	4662	60000	entregado	2025-10-10 17:38:09.505+00	\N	30000	30000	0	efectivo
c3b92593-1d37-483f-8718-0cbdd56f0af7	2605	15000	entregado	2025-10-09 18:14:56.115+00	\N	0	0	15000	tarjeta
f56fa94d-44bf-42e4-8262-4da3240b0548	9077	34300	entregado	2025-10-09 17:54:11.115+00	\N	0	34300	0	nequi
4f06b9e2-64e1-42fd-af71-b963f149a5ad	9164	37000	entregado	2025-10-17 20:48:03.441+00	\N	37000	0	0	efectivo
1a8ebeed-11e9-48f8-9a01-3a3c98b4eb26	1757	18500	entregado	2025-10-08 22:28:45.419+00	8d89e933-7d00-4a69-b11f-8c80f7fc550c	10500	8000	0	efectivo
c8010942-05e3-40b9-a150-e7f7a776aaf4	2842	11000	entregado	2025-10-09 19:00:51.288+00	\N	11000	0	0	efectivo
a3fe8a79-2d7d-4e80-94c8-e296021543a8	6177	33500	entregado	2025-10-08 23:53:52.339+00	\N	33500	0	0	efectivo
6e56e64c-57d6-45e8-a257-92729389fe81	1960	31000	entregado	2025-10-14 22:59:44.683+00	\N	31000	0	0	efectivo
5ec1d814-3309-4a92-ba34-10ee9653752c	1567	15000	entregado	2025-10-10 19:30:57.031+00	\N	15000	0	0	efectivo
1de7ebd1-8394-434e-bb72-e78b47ca3c85	9312	8000	entregado	2025-10-09 21:22:37.028+00	\N	0	8000	0	nequi
effe837e-074e-48f3-a95e-07b5acc5b398	9376	68000	entregado	2025-10-16 18:05:50.413+00	\N	68000	0	0	efectivo
8a2dbc99-7bd2-486c-82f1-c524e8fb0364	3672	23000	entregado	2025-10-09 22:16:59.462+00	\N	23000	0	0	efectivo
e21cffb5-b2ba-4c72-99fa-b44b2033ad34	4022	30000	entregado	2025-10-10 20:13:32.39+00	\N	0	30000	0	nequi
3eacbd18-f932-4dfb-8ffd-e757b535421c	3845	56000	entregado	2025-10-15 21:57:13.989+00	\N	56000	0	0	efectivo
b0ea8556-35f0-4bf7-a26f-3ecb33fab9aa	5907	27000	entregado	2025-10-09 22:57:51.873+00	\N	0	27000	0	nequi
6a16b610-8ff7-4838-af69-aae695a1a7c4	2304	8000	entregado	2025-10-15 19:00:50.912+00	\N	8000	0	0	credito_empleados
e09306a2-5ff9-4cda-9d59-53a415e1d625	2250	20000	entregado	2025-10-14 23:47:47.799+00	\N	0	20000	0	nequi
a4a108f5-974a-429b-95b6-dec30b93134e	1543	30000	entregado	2025-10-11 00:13:04.052+00	\N	0	30000	0	nequi
9d29fee5-3b95-4132-9c2a-b7a840eea99d	7893	64000	entregado	2025-10-18 17:26:38.235+00	\N	45000	19000	0	efectivo
1e80ffa0-18a6-4b21-b2d2-3396005cfd19	4103	38000	entregado	2025-10-15 16:49:46.61+00	\N	38000	0	0	efectivo
f65519fa-23a9-4390-af5b-2e53f51a1aab	8420	53000	entregado	2025-10-15 17:35:53.734+00	\N	0	53000	0	nequi
d2366761-67f2-4928-a529-141985d22803	8935	33500	entregado	2025-10-11 17:22:45.191+00	\N	0	33500	0	nequi
cf6bebdc-221e-4c22-aa51-853b241412d2	6552	0	entregado	2025-10-17 21:18:28.556+00	\N	0	0	0	credito_empleados
d872eeba-4aa2-4810-96e8-b255e8a9f4c4	9821	50500	entregado	2025-10-16 00:50:31.832+00	\N	0	50500	0	nequi
12d8875e-65b7-4c73-a086-76ed536f14c4	8651	15000	entregado	2025-10-15 18:13:27.797+00	\N	15000	0	0	efectivo
f516ddeb-fe7e-49ac-b3f2-ee4dd8063267	1193	15000	entregado	2025-10-17 22:14:46.425+00	\N	15000	0	0	efectivo
41660d72-e709-4209-b6b0-6b0d20cf6741	7231	10500	entregado	2025-10-17 22:22:54.998+00	\N	10500	0	0	efectivo
6a35b079-183b-4c9a-bcc1-c49f0175e130	7946	15000	entregado	2025-10-16 17:27:21.594+00	\N	0	0	15000	tarjeta
1366d1e2-43e2-490b-ada7-82b1be5774b2	1659	4000	entregado	2025-10-16 22:44:53.632+00	\N	4000	0	0	efectivo
4e012306-8246-486d-bb19-491b953180c2	5786	30000	entregado	2025-10-20 17:48:48.609+00	\N	30000	0	0	efectivo
9e8e5305-fcf3-4b2a-996c-9d5d2e06cdc9	1522	16500	entregado	2025-10-17 21:35:39.041+00	\N	16500	0	0	efectivo
b1b3434b-f6b9-4045-a703-2b6afc7e8099	7152	33000	entregado	2025-10-20 17:37:04.954+00	\N	33000	0	0	efectivo
0a4e9e30-bc10-4a6f-9494-a7fa96801623	7289	97500	entregado	2025-10-17 23:39:02.71+00	\N	0	97500	0	nequi
ee206d66-3a3f-4a16-84df-5910b63ab08f	8667	47000	entregado	2025-10-22 01:31:38.614+00	\N	0	47000	0	nequi
94cdc010-483c-4b5c-8831-e417432d3b15	8008	30000	entregado	2025-10-18 20:54:24.936+00	\N	30000	0	0	efectivo
7eb62012-a12b-4b81-9fb7-8dd02624e86d	1855	61500	entregado	2025-10-20 23:23:24.928+00	\N	43000	0	18500	efectivo
a43d1c09-c962-49e8-ba42-b995cd6bcdd4	8266	18500	entregado	2025-10-21 01:37:14.073+00	\N	18500	0	0	efectivo
934db0f4-13d7-4ed5-a226-8e167aab9c30	6461	24000	entregado	2025-10-22 01:41:07.262+00	\N	0	24000	0	nequi
86028dcc-720e-4759-9e12-22a0ed949bd8	7106	24000	entregado	2025-10-22 01:38:33.065+00	\N	24000	0	0	efectivo
476609b6-4783-440d-95fe-926d318ccaeb	7081	25000	entregado	2025-10-22 23:08:43.294+00	\N	0	25000	0	nequi
357686e0-91a4-4c93-a002-e7b339074e6c	1677	37000	entregado	2025-10-22 23:34:07.08+00	\N	37000	0	0	efectivo
e097abf9-c8eb-4e7e-a765-4d1022b82082	5292	17500	entregado	2025-10-23 00:13:11.84+00	\N	0	17500	0	nequi
fa67201a-549b-44b9-9b86-ff8858229c65	8503	30000	entregado	2025-10-23 17:22:21.559+00	\N	0	30000	0	nequi
292df706-db42-4f23-a9e9-435a8de54b33	2854	53000	entregado	2025-10-23 17:40:11.15+00	\N	53000	0	0	efectivo
2a8a331c-4548-40bc-ae13-e4ebd2099468	4536	23000	entregado	2025-10-23 18:37:10.721+00	\N	0	23000	0	nequi
043465aa-61d7-42f4-aa38-337c730d4746	5877	34000	entregado	2025-10-23 21:50:53.322+00	\N	0	0	34000	tarjeta
069bb11f-ba33-4b7e-afb9-756a929c237b	6464	0	entregado	2025-10-23 22:58:15.52+00	\N	0	0	0	credito_empleados
38db0837-8713-4a95-a486-e3adf85879d1	4615	8000	entregado	2025-10-10 21:49:56.541+00	\N	8000	0	0	efectivo
106cdfa7-16bc-4ca5-8cda-286ef6fbe8cd	4569	15000	entregado	2025-10-03 18:09:08.864+00	\N	15000	0	0	efectivo
0bab0a6d-612a-4bdc-b385-e88b1a894ff6	8475	13000	entregado	2025-10-03 18:03:24.78+00	445fa2d2-94bc-4ec1-9ae8-928be375b5b7	0	13000	0	nequi
6023ff83-959d-449c-9fe6-4216a8c71ba6	8678	46650	entregado	2025-10-01 00:48:39.026+00	\N	46650	0	0	efectivo
8ca5a800-7ff7-4e7d-bbc5-8c6e831655a9	9461	20000	entregado	2025-10-03 18:07:22.386+00	ebc0df13-9e4e-4ab4-b389-4ce9820a3006	20000	0	0	efectivo
6a18e10b-a5d3-43ac-abe1-b29c3a372048	1141	30000	entregado	2025-09-30 17:53:21.015+00	\N	30000	0	0	efectivo
4157c111-1cd4-4731-9e23-79474160c9e8	4075	15000	entregado	2025-09-23 02:44:54.501+00	ebd3c2f8-065f-4a44-8d53-330d736d9647	15000	0	0	efectivo
32369dfb-eef0-4209-9ced-9e6b6f1e381e	7020	24500	entregado	2025-09-23 19:41:06.891+00	\N	24500	0	0	efectivo
b88ba1fa-6f2a-4a1a-bbeb-1ef46feb7dcf	8658	15000	entregado	2025-09-23 02:49:22.582+00	\N	15000	0	0	efectivo
ae2bebca-571e-4c07-8670-757db996718d	4082	30000	entregado	2025-09-23 18:18:46.906+00	\N	30000	0	0	efectivo
9cda329f-736a-45a1-b779-94967eef478f	5496	19000	entregado	2025-09-23 15:21:31.422+00	\N	19000	0	0	efectivo
23eb2329-0c5e-4088-8fb3-36715c1d1f4c	5828	23000	entregado	2025-09-23 02:50:09.688+00	\N	23000	0	0	efectivo
dea8fbf9-2118-4343-ac86-f71661501468	1849	11000	entregado	2025-09-23 22:14:30.902+00	\N	11000	0	0	efectivo
5d597deb-c39d-48b8-bb7c-d6e593929397	1486	14850	entregado	2025-09-23 02:53:28.179+00	\N	14850	0	0	efectivo
4ace7a39-1bb7-4837-b544-20479ecfaac2	4153	18500	entregado	2025-09-23 02:33:48.579+00	\N	18500	0	0	efectivo
d6a104ee-86fe-47e2-976d-47a99d172ced	8055	15000	entregado	2025-09-23 02:39:52.207+00	\N	15000	0	0	efectivo
0e99f28d-a472-4ab9-b6f9-0c898b40ba88	2822	13000	entregado	2025-09-23 03:00:33.433+00	\N	13000	0	0	efectivo
c8cde86a-df1e-47ef-8c13-d8468a25f3eb	2931	8000	entregado	2025-09-23 02:39:01.637+00	\N	8000	0	0	efectivo
de7f4770-191d-4b57-ad9c-6468b2a0d51a	4041	14500	entregado	2025-09-23 02:38:12.886+00	\N	14500	0	0	efectivo
9040b73f-77bf-427b-b0c2-1bb2526c0086	6654	8000	entregado	2025-09-23 17:56:15.141+00	\N	8000	0	0	efectivo
842fbc54-bda1-4b20-957e-85d656cc4a3e	1008	44650	entregado	2025-09-23 03:05:44.733+00	\N	44650	0	0	efectivo
9d69b9cb-eda1-4d32-83a8-2a602a794389	3278	18500	entregado	2025-09-23 02:30:25.898+00	\N	18500	0	0	efectivo
9570fce9-c17a-479b-a87c-40d2bcf40312	5956	39000	entregado	2025-09-23 16:22:06.936+00	\N	39000	0	0	efectivo
5cb52fcb-f91e-49c0-939a-a4dfe0d1cb58	6555	8500	entregado	2025-09-23 03:07:18.259+00	\N	8500	0	0	efectivo
63195593-a2c9-41a3-887c-a129e1cdd976	7325	4000	entregado	2025-09-23 02:40:09.265+00	\N	4000	0	0	efectivo
270cb9c3-9278-47e2-89b9-36492b584e9c	5954	10500	entregado	2025-09-23 02:40:01.078+00	\N	10500	0	0	efectivo
c0b4015d-a729-4c9e-a220-cd6bb9b002f7	7287	15000	entregado	2025-09-23 02:41:36.806+00	\N	15000	0	0	efectivo
7d385443-f410-4453-8e1d-9133ccfc279f	3468	18500	entregado	2025-09-23 02:41:45.515+00	\N	18500	0	0	efectivo
507f5e77-20a2-4f77-8394-6bccf0eff0a2	9099	15000	entregado	2025-09-23 02:42:00.462+00	\N	15000	0	0	efectivo
c816883c-1811-416f-bb80-92ac3ff8d711	6424	28500	entregado	2025-09-23 02:31:16.703+00	\N	28500	0	0	efectivo
529b3152-2ab2-4e97-9e1d-bd9a3ab0975e	1539	16000	entregado	2025-09-23 16:54:26.033+00	\N	16000	0	0	efectivo
15cbe337-b663-447c-86e5-c1cca381e249	7311	30000	entregado	2025-09-23 18:55:31.63+00	\N	30000	0	0	efectivo
1ca8ba41-cc65-425c-b4f1-3ddae293522d	6564	15000	entregado	2025-09-23 20:05:51.711+00	\N	15000	0	0	efectivo
3d487325-f935-4c40-9e2a-236592e67b56	3767	34500	entregado	2025-09-23 02:41:11.974+00	\N	34500	0	0	efectivo
9c872a93-c09f-4346-9c46-0883e8fdf576	4070	30000	entregado	2025-09-23 17:30:14.34+00	\N	30000	0	0	efectivo
25cecc96-c8e5-4e72-a78c-58fc76f1230e	3840	76000	entregado	2025-09-24 15:40:52.49+00	\N	76000	0	0	efectivo
7535363c-d10d-4d35-abdc-4eae97bd274f	3087	17100	entregado	2025-09-23 19:18:31.092+00	\N	17100	0	0	efectivo
f361c481-118d-4e72-8658-058715d72db2	7940	40000	entregado	2025-09-23 17:33:56.797+00	\N	40000	0	0	efectivo
9a09e837-cc60-4521-bdfb-790fe3ec15f1	9507	15000	entregado	2025-09-23 02:44:54.992+00	ebd3c2f8-065f-4a44-8d53-330d736d9647	15000	0	0	efectivo
b4d33059-dfdb-43af-94b8-c04e0a270161	1581	16000	entregado	2025-09-23 02:50:41.825+00	\N	16000	0	0	efectivo
615f8381-992b-4d15-8313-899413b973fb	9788	56500	entregado	2025-09-23 02:51:15.847+00	\N	56500	0	0	efectivo
0168c10e-c788-426c-b706-3c57300c52f1	9573	12000	entregado	2025-09-23 02:51:34.408+00	\N	12000	0	0	efectivo
c5be6c87-d4d6-40a4-afa5-edb12ae9365f	4875	6000	entregado	2025-09-23 02:51:44.157+00	\N	6000	0	0	efectivo
6b96efb7-0e92-4bc4-87fe-0e95a4e561da	4479	41000	entregado	2025-09-23 19:55:01.813+00	\N	41000	0	0	efectivo
1529133b-90d2-498e-a089-11ee20022e23	8794	31500	entregado	2025-09-23 02:52:47.7+00	\N	31500	0	0	efectivo
a064c078-e503-4588-9f1a-5833ab74af57	2777	18500	entregado	2025-09-23 02:53:09.171+00	\N	18500	0	0	efectivo
c26ad814-d661-426f-905b-9e1d7db637c2	4598	29850	entregado	2025-09-23 19:02:33.313+00	\N	29850	0	0	efectivo
5879eaea-d972-4277-a405-30978f25166e	7065	8000	entregado	2025-09-23 18:01:20.697+00	\N	8000	0	0	efectivo
64fa9dbc-f255-415a-b34f-a27d3332157b	2356	54000	entregado	2025-09-23 21:58:03.026+00	\N	54000	0	0	efectivo
c83d1ab6-6390-4786-848a-094e60de15cd	1008	32000	entregado	2025-09-23 17:48:10.079+00	\N	32000	0	0	efectivo
d2c2ebe9-f796-4351-9134-5b03641020e9	2120	23500	entregado	2025-09-24 00:24:15.887+00	\N	23500	0	0	efectivo
c84e0bb3-b3d4-478b-b76f-b27a105878ba	8914	21000	entregado	2025-09-23 20:23:18.243+00	\N	21000	0	0	efectivo
b0d9be7c-102e-4bfb-a027-33a1cd9996ea	9353	26500	entregado	2025-09-23 03:31:33.253+00	\N	26500	0	0	efectivo
fd5de209-af3b-4a6e-8bb8-f0876ae61b11	1941	15000	entregado	2025-09-23 17:47:16.815+00	\N	15000	0	0	efectivo
eeff4778-0520-48ff-8e11-55787643ec39	4686	11500	entregado	2025-09-23 22:17:54.69+00	\N	11500	0	0	efectivo
cb353b71-1ebb-4704-88e2-e1bc53cbe1cb	8991	69500	entregado	2025-09-24 01:21:35.432+00	\N	69500	0	0	efectivo
75f77883-a796-4df2-9bd8-d4bd423c0c1f	4795	16000	entregado	2025-09-23 19:28:08.654+00	\N	16000	0	0	efectivo
00778b23-695c-48f2-92ab-b3742b61b855	6262	14850	entregado	2025-09-23 19:38:05.199+00	0cf14e74-a586-47c8-8d24-52547bdd464b	14850	0	0	efectivo
7022e0a3-2a51-4cb6-beb7-4e6587e0eb9d	9775	27500	entregado	2025-09-24 16:02:40.922+00	\N	27500	0	0	efectivo
cee5fc2e-f3c2-4cc1-afd8-686b6d303a7c	7139	54500	entregado	2025-09-24 00:22:08.627+00	\N	54500	0	0	efectivo
4dcdbf9e-9136-491c-986f-401f60bdaf58	9692	8000	entregado	2025-09-23 21:55:38.929+00	\N	8000	0	0	efectivo
07fdd121-94d2-43e8-b856-44e10ae325a8	1768	14000	entregado	2025-09-23 22:49:31.422+00	\N	14000	0	0	efectivo
311ae63b-e7c6-4022-98ff-f059b7255029	5584	8000	entregado	2025-09-24 01:34:07.282+00	ebd3c2f8-065f-4a44-8d53-330d736d9647	8000	0	0	efectivo
6d5ced47-a91b-4990-963f-0fd31d3fe824	8011	38500	entregado	2025-09-23 21:13:05.326+00	\N	38500	0	0	efectivo
003acb1f-0db0-40e0-83e4-e23529ff6a60	9129	20000	entregado	2025-09-23 22:43:09.127+00	\N	20000	0	0	efectivo
bc32d274-8c58-4591-8669-e76fa7b6a1f7	5916	40000	entregado	2025-09-24 01:02:15.878+00	\N	40000	0	0	efectivo
1e035429-2e7a-47d0-8bbc-73bf2a403e23	7104	67500	entregado	2025-09-24 14:36:19.927+00	\N	67500	0	0	efectivo
02194b42-3755-4374-a2b7-f099a74381d6	5524	60000	entregado	2025-09-24 22:42:13.018+00	\N	60000	0	0	efectivo
f86ca3e2-2fc5-4918-b3d1-78c2255ba587	9675	35000	entregado	2025-09-24 16:57:38.85+00	\N	35000	0	0	efectivo
f14569f9-5d32-49bd-a92e-53da5226951a	1612	17000	entregado	2025-09-24 18:53:59.799+00	\N	17000	0	0	efectivo
0ef7b910-3764-4969-8787-6557dc8e0162	7905	21150	entregado	2025-09-24 20:47:30.941+00	\N	21150	0	0	efectivo
abdb000c-7707-43ab-bff2-f11d298473b1	3817	18500	entregado	2025-09-24 21:27:45.487+00	\N	18500	0	0	efectivo
db7fd491-754a-4b36-aed2-c7a6dafd4b9b	1999	4500	entregado	2025-09-24 20:41:28.984+00	\N	4500	0	0	efectivo
93b9a4a6-52d6-4729-ab9e-c058cf38e2d2	7086	48500	entregado	2025-09-24 18:55:18.308+00	\N	48500	0	0	efectivo
6e341b21-50c3-43fc-a256-d21a50eb6f7a	3131	20000	entregado	2025-09-24 20:03:19.902+00	\N	20000	0	0	efectivo
625d0891-e934-4f39-b94a-5f83beb50503	7843	16000	entregado	2025-09-24 17:12:34.085+00	\N	16000	0	0	efectivo
611df515-c40a-46aa-b953-d1c79416902f	6691	29000	entregado	2025-09-24 16:36:32.735+00	\N	29000	0	0	efectivo
86cd8216-cc20-44ca-9fd2-fff78e8bbb9a	4029	15000	entregado	2025-09-24 20:42:05.198+00	\N	15000	0	0	efectivo
64609646-ea6b-48cb-ad69-6f9b570ca387	6971	10500	entregado	2025-09-24 22:13:22.987+00	ebd3c2f8-065f-4a44-8d53-330d736d9647	10500	0	0	efectivo
137155b2-2f48-46f2-ad0b-9d7517875112	7191	47500	entregado	2025-09-24 21:20:36.926+00	\N	47500	0	0	efectivo
cad9ac26-00bf-479e-8805-56adbb11cd7e	2194	31000	entregado	2025-09-24 23:09:42.541+00	\N	31000	0	0	efectivo
7655b835-6a78-4b29-bc57-1b80ceeab56e	1732	8000	entregado	2025-09-24 22:45:22.954+00	ebd3c2f8-065f-4a44-8d53-330d736d9647	8000	0	0	efectivo
21872caf-7ab4-442c-a678-02fbe00879f9	6812	14000	entregado	2025-09-24 23:41:27.893+00	eaa07600-d0f1-452a-ae7b-6ad8b58f24c4	14000	0	0	efectivo
ce08628a-6482-492d-b876-0a6b1e4673e0	8507	26500	entregado	2025-09-24 23:49:04.54+00	\N	26500	0	0	efectivo
7f8fb50e-b18d-4239-8663-6d9c3f553052	9978	15500	entregado	2025-09-25 14:08:18.305+00	1f21b2a6-02db-41be-95ec-4e13a6cb6942	15500	0	0	efectivo
17ccdcf3-5e51-4d1f-8e43-f7f46dfb728f	4934	8000	entregado	2025-09-25 14:29:17.337+00	\N	8000	0	0	efectivo
40bb8986-bf67-46c2-8bbf-1696fce069dc	8906	10500	entregado	2025-09-25 15:01:45.408+00	\N	10500	0	0	efectivo
0abc1107-2f6b-4924-979f-acb1c5a2ac39	9469	4000	entregado	2025-09-25 15:46:09.895+00	445fa2d2-94bc-4ec1-9ae8-928be375b5b7	4000	0	0	efectivo
39881f31-5bc0-4c79-8daf-95a1a220733e	3254	22500	entregado	2025-09-25 16:46:12.688+00	\N	22500	0	0	efectivo
62a18460-3c21-4aae-9c9a-85b55942e8cd	5398	53000	entregado	2025-09-25 18:32:54.796+00	\N	53000	0	0	efectivo
bd456dd0-e17e-4027-8a48-42c8642bed5e	6803	30000	entregado	2025-09-25 18:42:17.521+00	\N	30000	0	0	efectivo
bcc0a152-00b3-40fd-ab14-e511365a7573	7768	11000	entregado	2025-09-25 22:40:34.343+00	\N	11000	0	0	efectivo
d91aa98a-666c-49f6-8201-007f30fb283a	8639	44500	entregado	2025-09-25 22:30:58.277+00	\N	44500	0	0	efectivo
4531779c-3b51-465e-b13b-da604123444b	7120	22000	entregado	2025-09-27 17:21:03.663+00	\N	22000	0	0	efectivo
8960b373-f72e-4801-8554-bb96e12fcbad	3490	61500	entregado	2025-09-25 18:47:34.107+00	\N	61500	0	0	efectivo
0d088a22-dae2-4606-b02e-831fb5095977	3669	9500	entregado	2025-09-27 17:17:38.967+00	\N	9500	0	0	efectivo
c3eaf608-af3f-4779-a8d8-09a95531e3bf	5848	31500	entregado	2025-09-26 20:30:35.623+00	\N	31500	0	0	efectivo
6a956be1-abcb-42ce-85cd-1f4737c9faa6	9720	49000	entregado	2025-09-25 18:46:03.046+00	\N	49000	0	0	efectivo
75b049fd-9437-482e-98b5-bdee58ea9736	7630	4500	entregado	2025-09-26 00:07:25.456+00	deecc8eb-6346-4154-a540-79462d987083	4500	0	0	efectivo
50835f25-7aaa-4838-9e03-a0c2974fbe0f	3378	21000	entregado	2025-09-26 20:07:59.12+00	\N	21000	0	0	efectivo
4a798f19-a186-4806-8cd9-d7e21a5ac611	2872	15000	entregado	2025-09-25 18:52:10.893+00	\N	15000	0	0	efectivo
938c755c-ce35-4e70-945c-beb8b738caa5	6262	15000	entregado	2025-09-25 23:49:36.083+00	\N	15000	0	0	efectivo
ac4f60b8-e38c-448b-b3ba-3367e9205963	1514	32000	entregado	2025-09-26 18:04:04.923+00	445fa2d2-94bc-4ec1-9ae8-928be375b5b7	32000	0	0	efectivo
8b28c63b-b7a2-4ffe-85d3-0ffdda92c425	5579	15500	entregado	2025-09-25 19:52:38.904+00	\N	15500	0	0	efectivo
3e60d411-6149-457b-a6bd-bf62b3efe5b9	5262	14850	entregado	2025-09-26 00:39:57.419+00	0cf14e74-a586-47c8-8d24-52547bdd464b	14850	0	0	efectivo
752926a2-263a-4df1-8020-9ad62a38612f	8944	8000	entregado	2025-09-25 20:32:52.204+00	\N	8000	0	0	efectivo
ffecc9b9-a793-4e81-b2f0-264ec27229e1	6629	26500	entregado	2025-09-26 23:45:50.595+00	\N	26500	0	0	efectivo
8a1d67aa-6d2f-4e4e-8f41-a1f6932cff60	9365	10000	entregado	2025-09-26 21:42:24.051+00	\N	10000	0	0	efectivo
2cd67630-cc8e-46f7-a0c7-7ae817e4d999	2753	34000	entregado	2025-09-26 18:07:51.83+00	\N	34000	0	0	efectivo
19ddf036-cf1e-4e5b-aa22-575b61fd5d07	3023	45000	entregado	2025-09-26 17:41:52.196+00	\N	45000	0	0	efectivo
5922ba0d-9d78-465f-a4e6-5129e6eb5a8c	5355	5500	entregado	2025-09-26 13:37:07.131+00	\N	5500	0	0	efectivo
d2f08b77-b59c-4747-b618-80922eb9595b	7196	20000	entregado	2025-09-25 20:28:41.376+00	\N	20000	0	0	efectivo
59f3531f-f178-4f8d-812c-1e873ef0d5cf	1473	8000	entregado	2025-09-25 20:58:57.052+00	ebd3c2f8-065f-4a44-8d53-330d736d9647	8000	0	0	efectivo
fd386411-5f43-401a-803c-062a135e7796	2118	26000	entregado	2025-09-26 18:20:25.996+00	\N	26000	0	0	efectivo
5171d0d9-51cf-4a66-928c-28260ade997b	6912	8000	entregado	2025-09-25 21:21:36.615+00	445fa2d2-94bc-4ec1-9ae8-928be375b5b7	8000	0	0	efectivo
f46c5e1d-9105-4e81-aaeb-b5aec4291c34	1273	18500	entregado	2025-09-27 00:10:51.09+00	\N	18500	0	0	efectivo
eca4d05d-183e-43c5-af90-5a7f8a000bb0	9706	70500	entregado	2025-09-26 14:17:30.598+00	\N	70500	0	0	efectivo
88a07553-c5e5-4433-97c2-e1f9ac5d204f	6846	49000	entregado	2025-09-25 21:29:29.177+00	\N	49000	0	0	efectivo
379dd81b-f12e-42b2-a05d-c8ea1f2e6b09	1283	1000	entregado	2025-09-26 18:21:39.559+00	ebd3c2f8-065f-4a44-8d53-330d736d9647	1000	0	0	efectivo
79bc39d6-88d6-4aa3-8193-340423f2f90c	8948	41500	entregado	2025-09-26 23:48:15.831+00	\N	41500	0	0	efectivo
32a4b5da-dab6-4957-a8c3-b7652cf21b11	2797	15000	entregado	2025-09-26 15:03:02.543+00	\N	15000	0	0	efectivo
31dd0943-ee42-4452-89db-30a674a3a566	8321	26000	entregado	2025-09-26 21:47:33.279+00	\N	26000	0	0	efectivo
225062c4-12c9-497a-8240-bdf580b7d4ab	2766	24000	entregado	2025-09-25 22:19:59.741+00	\N	24000	0	0	efectivo
af800575-7c8f-43d8-8892-af4b2ef67f98	7223	4000	entregado	2025-09-26 18:27:41.64+00	\N	4000	0	0	efectivo
7fa3054b-bd50-46cc-8d67-d9a85513f801	5746	1000	entregado	2025-09-26 15:04:01.218+00	445fa2d2-94bc-4ec1-9ae8-928be375b5b7	1000	0	0	efectivo
b1a3a135-4128-4da2-af1c-e30d7a5b2b38	9601	12500	entregado	2025-09-26 21:58:23.003+00	\N	12500	0	0	efectivo
6a1de093-9ed0-405b-adb6-da2912cb2c4a	9184	4500	entregado	2025-09-26 15:09:20.326+00	\N	4500	0	0	efectivo
cbb64822-2388-4f5c-83c3-094d9458b14f	5150	30000	entregado	2025-09-27 17:44:43.587+00	\N	30000	0	0	efectivo
bf0e1bad-f3b9-47d0-b4f6-c76c3a6db48b	7331	18500	entregado	2025-09-26 15:29:57.801+00	\N	18500	0	0	efectivo
699c3091-60f3-4ebd-9e7a-eae5761cf886	6335	23000	entregado	2025-09-26 21:48:54.774+00	\N	23000	0	0	efectivo
a55611c1-1b2b-490a-bf1e-55a1bf4814cb	9161	33500	entregado	2025-09-26 21:22:34.805+00	\N	33500	0	0	efectivo
bdf830c7-987a-461a-8451-8de8a48eb804	2505	16000	entregado	2025-09-26 16:49:58.487+00	\N	16000	0	0	efectivo
a2c47dd5-d797-4244-8ee0-c902fa2b6ed9	3118	15000	entregado	2025-09-26 19:47:50.655+00	0cf14e74-a586-47c8-8d24-52547bdd464b	15000	0	0	efectivo
0effebc6-07f6-4442-853b-687471a63aef	6998	9500	entregado	2025-09-27 14:42:33.154+00	\N	9500	0	0	efectivo
61ebd998-1fbe-4382-b2b4-bad5bbe8c122	5294	19000	entregado	2025-09-27 17:23:26.901+00	\N	19000	0	0	efectivo
393b94f0-50b8-4809-90a5-f558b3207b4c	3593	10500	entregado	2025-09-26 19:48:30.277+00	ebd3c2f8-065f-4a44-8d53-330d736d9647	10500	0	0	efectivo
c9c96e5f-702e-4be9-b984-9b95782cf82d	2541	15000	entregado	2025-09-26 18:55:28.983+00	\N	15000	0	0	efectivo
a79f3aa9-fe31-4cd6-851d-4214af87b733	7887	10500	entregado	2025-09-27 14:42:56.6+00	\N	10500	0	0	efectivo
3ef182d4-d4cf-46cb-b375-3738ac2e8f08	2919	14000	entregado	2025-09-27 14:42:46.047+00	\N	14000	0	0	efectivo
c3fc8389-3132-4ad8-b208-a0f1e24f1805	8026	29500	entregado	2025-09-26 22:24:09.475+00	\N	29500	0	0	efectivo
f65a580d-f2d9-47ad-807a-5350b844aa8e	8780	2000	entregado	2025-09-29 13:58:47.346+00	445fa2d2-94bc-4ec1-9ae8-928be375b5b7	2000	0	0	efectivo
4a9860a0-4f38-4b97-9c13-3de185de14d0	2788	31500	entregado	2025-09-27 15:25:23.119+00	ebd3c2f8-065f-4a44-8d53-330d736d9647	31500	0	0	efectivo
8c5e7c78-3cb9-44fa-bbd0-bf7ff1317a4f	8504	37500	entregado	2025-09-27 18:14:42.635+00	\N	37500	0	0	efectivo
4e87192e-804f-4ec5-8034-76886d92810d	6902	15000	entregado	2025-09-29 17:18:30.451+00	\N	15000	0	0	efectivo
91704602-0a09-4ff5-bb99-501f9161bd3a	8018	11000	entregado	2025-09-29 15:41:22.978+00	\N	11000	0	0	efectivo
2c3c4da6-4e94-4591-abd8-dfd018f45bb0	9813	15000	entregado	2025-09-27 17:46:09.116+00	\N	15000	0	0	efectivo
740dbcef-bbd0-4913-8028-931694ff4839	5043	13500	entregado	2025-09-27 14:42:21.543+00	\N	13500	0	0	efectivo
2f4c1c0f-17fe-477c-bd3f-e88d15807699	9453	15000	entregado	2025-09-27 19:18:29.307+00	\N	15000	0	0	efectivo
84a96e20-cade-4099-82fc-b3a81f59338e	9460	6000	entregado	2025-09-29 14:20:10.036+00	\N	6000	0	0	efectivo
7778d92c-20cf-475a-97d4-60282845ac1f	4484	47500	entregado	2025-09-27 17:55:11.283+00	7ee086b5-a58a-4dd5-bb7a-a44a7b81b3c2	47500	0	0	efectivo
5a362269-ce7c-4822-b901-2902f577b450	9056	15000	entregado	2025-09-29 17:26:27.813+00	\N	15000	0	0	efectivo
90fc67d5-699d-4607-9000-76309dbb73e5	5311	38100	entregado	2025-09-29 16:23:26.364+00	\N	38100	0	0	efectivo
f56d9d47-36a3-47f0-b889-190a744ad7b2	4008	15000	entregado	2025-09-27 19:37:34.312+00	deecc8eb-6346-4154-a540-79462d987083	15000	0	0	efectivo
b95938f5-d891-4243-970c-124705c5637c	9996	20000	entregado	2025-09-29 14:53:47.235+00	\N	20000	0	0	efectivo
2171f7f9-f1fd-4b83-8b11-adb19cd7f7ee	9773	15000	entregado	2025-09-29 16:47:56.361+00	\N	15000	0	0	efectivo
9dc0af81-1471-46c3-b1f8-a8d9e23c50fb	3165	15000	entregado	2025-09-29 17:49:10.032+00	\N	15000	0	0	efectivo
02af5abc-6627-434c-aa51-1ee78142d007	7915	17500	entregado	2025-09-29 21:26:59.991+00	\N	17500	0	0	efectivo
b3772ec1-dee9-45cf-bb2d-6456a5a89ad6	3224	15000	entregado	2025-09-29 19:13:34.876+00	0cf14e74-a586-47c8-8d24-52547bdd464b	15000	0	0	efectivo
1845e715-ec34-41ef-a919-292bab911d24	1316	49500	entregado	2025-09-29 18:04:30.22+00	\N	49500	0	0	efectivo
7ffb487b-e602-4633-af0d-8cd14eac6dc2	6492	15000	entregado	2025-09-29 18:12:20.446+00	\N	15000	0	0	efectivo
e5dc709c-ec25-496d-ab33-eb7eb086d85b	6485	15000	entregado	2025-09-29 19:12:49.034+00	deecc8eb-6346-4154-a540-79462d987083	15000	0	0	efectivo
a20074fc-e85a-470e-a897-60900df5f9b5	5161	13000	entregado	2025-09-29 23:07:28.997+00	\N	13000	0	0	efectivo
a10f76e1-3f8a-48c1-ab93-fa1884274c5d	7724	12000	entregado	2025-09-29 22:48:03.155+00	\N	12000	0	0	efectivo
d0d61f26-ed3c-41ad-8410-b96f1c8078a1	5642	4500	entregado	2025-09-30 00:12:32.535+00	\N	4500	0	0	efectivo
0c3a4f67-5c4a-4c38-a696-5d7f1ab777ec	8464	14000	entregado	2025-09-30 00:20:32.041+00	ebd3c2f8-065f-4a44-8d53-330d736d9647	14000	0	0	efectivo
7e2da855-7198-4cfc-b243-054659e9488e	8461	59500	entregado	2025-09-30 01:37:21.52+00	eaa07600-d0f1-452a-ae7b-6ad8b58f24c4	59500	0	0	efectivo
5c1ec0c3-6782-4a78-afcc-a15a6312ee44	7135	11000	entregado	2025-09-30 16:01:41.939+00	\N	11000	0	0	efectivo
8298a070-12b7-426f-ac9f-45e2d6a57824	1384	34000	entregado	2025-09-30 14:16:02.385+00	\N	34000	0	0	efectivo
692231e5-77f7-4489-b3bd-10e0b43d6f24	2425	4500	entregado	2025-09-30 14:26:59.269+00	445fa2d2-94bc-4ec1-9ae8-928be375b5b7	4500	0	0	efectivo
852b5297-d297-4510-b255-96c2a8c9563e	7220	10500	entregado	2025-09-30 15:05:09.873+00	\N	10500	0	0	efectivo
ebc4a867-f3b4-4117-9936-6900208864f1	2670	29000	entregado	2025-09-30 15:50:07.985+00	\N	29000	0	0	efectivo
31a755e6-2467-4ba8-9a97-ae50ede85ddc	8848	14000	entregado	2025-09-30 15:57:41.932+00	\N	14000	0	0	efectivo
56a6dc5d-a5da-44f9-90c3-09d2362176cc	1420	8000	entregado	2025-09-30 22:17:00.022+00	eaa07600-d0f1-452a-ae7b-6ad8b58f24c4	8000	0	0	efectivo
6d28089b-4b53-40d6-b8fb-d7953e75dc1c	1340	15000	entregado	2025-10-01 19:13:43.227+00	\N	15000	0	0	efectivo
a363c763-8698-4cf9-a397-31019c16c1ba	3096	8000	entregado	2025-09-30 22:17:40.719+00	445fa2d2-94bc-4ec1-9ae8-928be375b5b7	8000	0	0	efectivo
2cad9473-8a42-4a5b-bbd1-7925a84d2700	3947	15000	entregado	2025-09-30 18:07:48.974+00	\N	15000	0	0	efectivo
26b18556-6b80-44d4-8a96-45b816d41f6e	1481	41750	entregado	2025-09-30 18:05:37.345+00	\N	41750	0	0	efectivo
e2ac12eb-dbf8-428d-86cb-25623fd85c93	7464	23500	entregado	2025-09-30 22:09:28.662+00	\N	23500	0	0	efectivo
902fac33-16c9-4c02-b4ea-9f118bef5218	5903	16650	entregado	2025-09-30 17:53:34.45+00	\N	16650	0	0	efectivo
26dd1b4e-bd4c-4d68-aaef-632cc1f0556f	6418	30000	entregado	2025-09-30 18:05:03.75+00	\N	30000	0	0	efectivo
d93b26a7-a9a7-4d32-a8b3-2f10348eed3b	3162	15000	entregado	2025-10-01 22:18:16.417+00	\N	15000	0	0	efectivo
ef588b19-e91f-46f4-bed2-907115ea5481	2140	31000	entregado	2025-10-01 17:07:25.293+00	\N	31000	0	0	efectivo
84e3780a-1408-414f-a3f9-8b697212dee8	9693	15000	entregado	2025-10-01 19:15:21.248+00	deecc8eb-6346-4154-a540-79462d987083	15000	0	0	efectivo
790f8f62-0524-48f1-8b39-4b75ad9b4dc4	2521	19000	entregado	2025-10-01 21:46:54.41+00	\N	19000	0	0	efectivo
8a3b24ca-a91a-44e4-ad94-b32a1eaa5be2	3705	46000	entregado	2025-09-30 21:48:40.238+00	\N	46000	0	0	efectivo
df35a376-51e5-47d9-aadf-f2ffa9a8ddb5	1086	56000	entregado	2025-09-30 22:29:19.065+00	\N	56000	0	0	efectivo
cc9565d7-9aea-4646-adaf-57f47d028f27	9932	21000	entregado	2025-10-02 00:24:49.454+00	\N	21000	0	0	efectivo
54121bcd-7e68-4f0f-985c-caa1849182ba	6123	10500	entregado	2025-09-30 07:16:49.681+00	\N	10500	0	0	efectivo
d9448d14-a177-48ff-b059-93c9c592771a	4442	33500	entregado	2025-09-30 07:17:39.502+00	\N	33500	0	0	efectivo
8c0a6d5d-a44f-4e77-a58f-1ed3aa46e2f8	1961	15000	entregado	2025-10-01 19:17:45.262+00	\N	15000	0	0	efectivo
e681a677-61ba-45a3-8955-db19f49533e9	1376	29000	entregado	2025-09-30 23:27:33.521+00	\N	29000	0	0	efectivo
4ce55b09-9571-4580-9c81-f5118309c47e	2715	11000	entregado	2025-09-30 08:01:02.047+00	\N	11000	0	0	efectivo
8ce8bca1-ae93-4cc9-bf25-ee50375c879a	8109	23500	entregado	2025-10-01 23:58:39.312+00	\N	23500	0	0	efectivo
27243e81-0567-4e2d-9860-56020bc3701e	5508	30000	entregado	2025-10-01 18:02:56.344+00	\N	30000	0	0	efectivo
95609c92-8fde-4ef6-ab9c-67d4e6022ae0	6616	15000	entregado	2025-09-30 08:30:18.725+00	\N	15000	0	0	efectivo
293431ff-23ff-4392-8745-f4cd2897e691	1443	45000	entregado	2025-10-01 17:53:03.146+00	\N	45000	0	0	efectivo
d08b9e44-3645-4e0c-8b59-d34ac3b9966b	3609	34000	entregado	2025-09-30 23:06:43.516+00	\N	34000	0	0	efectivo
e42515f8-2c16-436e-ad0c-2ca8d5c253c9	1276	13000	entregado	2025-09-30 08:43:49.394+00	\N	13000	0	0	efectivo
2b544ab7-4578-49c2-b9a1-e30b7cc74e9c	9067	11000	entregado	2025-10-01 22:25:11.13+00	\N	11000	0	0	efectivo
a9c4d9c3-9fd0-4a5d-a596-49391c8b6e97	6979	32500	entregado	2025-10-01 19:40:12.246+00	\N	32500	0	0	efectivo
5a844205-06a3-4285-bad7-7cb53dbc0bfe	3234	6000	entregado	2025-09-30 09:06:34.161+00	ebd3c2f8-065f-4a44-8d53-330d736d9647	6000	0	0	efectivo
4c8b954f-c40d-4e04-af52-af6e2c3b5e4f	6115	15000	entregado	2025-09-30 23:41:59.545+00	deecc8eb-6346-4154-a540-79462d987083	15000	0	0	efectivo
c87a1b8b-77fa-4559-b07e-bf70bd6a1f48	6264	24000	entregado	2025-10-01 18:30:53.355+00	\N	24000	0	0	efectivo
11bee7cd-e6bd-4566-9dbb-66bcd20d4229	2201	32000	entregado	2025-09-30 21:35:25.814+00	\N	32000	0	0	efectivo
194abf03-548f-479b-a7cc-3b935d0e39c6	1182	43000	entregado	2025-10-01 00:11:14.698+00	\N	43000	0	0	efectivo
7413bd53-ad97-4fd6-a381-6df3834ed854	3510	16650	entregado	2025-09-30 21:51:47.37+00	\N	16650	0	0	efectivo
878a38aa-f19a-4cae-adfa-4e584f331fc3	9645	29000	entregado	2025-10-01 18:53:47.395+00	eaa07600-d0f1-452a-ae7b-6ad8b58f24c4	29000	0	0	efectivo
53f3db87-88a3-46f1-86eb-ce772d633522	1314	4500	entregado	2025-10-02 15:33:34.48+00	\N	4500	0	0	efectivo
b48cac54-831c-4c03-af93-ba8e2e4a4196	1267	30000	entregado	2025-10-01 00:37:18.158+00	\N	30000	0	0	efectivo
8375d937-7e14-4b3c-b288-b8662564ecd9	2701	19000	entregado	2025-10-01 22:31:37.806+00	\N	19000	0	0	efectivo
caca36b8-a1a5-4231-89c1-e505ebce8327	6728	15000	entregado	2025-10-01 18:55:03.061+00	ebd3c2f8-065f-4a44-8d53-330d736d9647	15000	0	0	efectivo
372c271f-a9f8-475c-a435-9ad38cfe8452	2783	15000	entregado	2025-10-01 20:07:15.337+00	\N	15000	0	0	efectivo
7471c3f7-6b99-4d86-b242-ffa9b6471e04	7657	62000	entregado	2025-10-01 00:22:43.116+00	\N	62000	0	0	efectivo
4e05d997-957b-4228-bf4f-dd52586599c7	2480	38000	entregado	2025-10-01 00:41:43.946+00	\N	38000	0	0	efectivo
5e6d7fc1-4fed-4b27-b375-448b3f377b94	8611	31150	entregado	2025-10-02 01:16:32.677+00	\N	31150	0	0	efectivo
17dbc7e0-6098-47bb-b838-d3dccf3eef5d	6822	16650	entregado	2025-10-01 18:59:30.136+00	0cf14e74-a586-47c8-8d24-52547bdd464b	16650	0	0	efectivo
1e7903f4-5f1f-4014-900b-2aaf89e3335c	9716	41500	entregado	2025-10-01 20:02:17.591+00	\N	41500	0	0	efectivo
8841efbe-6ac4-432a-8942-eee5a39a9707	1992	19000	entregado	2025-10-01 22:53:23.123+00	\N	19000	0	0	efectivo
885f25fe-e467-448a-aee5-6c431457131d	5936	16000	entregado	2025-10-02 18:01:02.295+00	\N	16000	0	0	efectivo
4b370a21-06c8-4866-a723-c5d3e26f984f	4535	42500	entregado	2025-10-02 13:56:08.956+00	\N	42500	0	0	efectivo
b768eee7-05f8-4d6b-8354-2467dce62a33	7604	8500	entregado	2025-10-02 16:13:10.239+00	445fa2d2-94bc-4ec1-9ae8-928be375b5b7	8500	0	0	efectivo
84fd6b62-e81a-42c9-aba6-c7e4b7c346b9	8304	21000	entregado	2025-10-01 22:16:34.712+00	\N	21000	0	0	efectivo
74881c76-1128-42b6-b4b3-bef2d0b373fc	8519	19000	entregado	2025-10-01 20:45:52.485+00	\N	19000	0	0	efectivo
3947d778-450a-46ba-ab24-e479d68f153a	1855	31500	entregado	2025-10-02 16:13:27.373+00	\N	31500	0	0	efectivo
9c6f9d35-e162-424e-9ad4-f7f82a85091c	4446	14500	entregado	2025-10-02 14:27:15.599+00	\N	14500	0	0	efectivo
def5fbaa-aaa3-4dfb-bb85-fbf226d33742	7647	30000	entregado	2025-10-01 23:31:31.468+00	\N	30000	0	0	efectivo
26fd1d3c-b792-4152-861b-0d28e7b03eff	7236	16650	entregado	2025-10-02 18:10:04.156+00	\N	16650	0	0	efectivo
effe1e6c-0162-44da-8c7f-3ee141684312	4598	16000	entregado	2025-10-02 17:35:57.628+00	\N	16000	0	0	efectivo
2526a849-2df8-45f4-8759-fcc9fccc5879	2542	20500	entregado	2025-10-02 17:15:59.753+00	\N	20500	0	0	efectivo
eee81f51-c7e3-449d-94d9-f1a8eac8d7c5	8507	14500	entregado	2025-10-02 14:45:30.653+00	\N	14500	0	0	efectivo
7639b042-a383-4fe1-9bec-ca43644f6964	3836	12000	entregado	2025-10-02 19:48:00.151+00	\N	12000	0	0	efectivo
80af7c80-e1a5-41d6-854f-89c30d7370b0	7341	8000	entregado	2025-10-02 17:33:21.079+00	\N	8000	0	0	efectivo
2ab7a9ff-7cec-4359-9d88-9b0c1ac4b889	6578	32500	entregado	2025-10-02 19:02:09.93+00	\N	32500	0	0	efectivo
9279c262-1011-4f28-833b-f2d622f84b96	1065	30000	entregado	2025-10-02 17:38:25.916+00	\N	30000	0	0	efectivo
aa2ab64d-4ae1-43f0-9fd2-6c2fe9b7b81e	8118	30000	entregado	2025-10-02 17:41:22.529+00	\N	30000	0	0	efectivo
27205744-eba1-47ca-8ccf-53bbece06870	6287	45300	entregado	2025-10-02 17:17:33.822+00	\N	45300	0	0	efectivo
74ca0fac-19e0-413c-9652-128576a71930	4468	18500	entregado	2025-10-02 19:17:06.383+00	0cf14e74-a586-47c8-8d24-52547bdd464b	18500	0	0	efectivo
229c6e19-de1a-4e2b-bb27-68f040a4ced7	7257	15000	entregado	2025-10-02 19:16:48.779+00	\N	15000	0	0	efectivo
ab4edcbd-8ea8-4aa5-a3de-7c2f6271e83c	5789	10000	entregado	2025-10-02 22:45:03.854+00	\N	10000	0	0	efectivo
6c9ad3e1-a7f2-4517-bc32-d1cacaa7a749	4578	14500	entregado	2025-10-03 00:19:43.703+00	\N	14500	0	0	efectivo
469710ef-38d1-42f7-9394-67c6d1c8cc54	8675	46000	entregado	2025-10-02 20:43:15.096+00	\N	46000	0	0	efectivo
725c724a-163f-45a2-afb3-83f4ae55f354	3752	21000	entregado	2025-10-02 21:13:29.642+00	\N	21000	0	0	efectivo
b34d281c-e033-4f8d-817b-5b785e334483	4484	16000	entregado	2025-10-02 21:36:36.44+00	\N	16000	0	0	efectivo
be065d1f-309c-4856-8144-d869edcf2e28	5579	11000	entregado	2025-10-02 21:35:45.992+00	\N	11000	0	0	efectivo
880329d3-dbc3-4da2-99a1-727a8ab0ec81	2948	16500	entregado	2025-10-02 22:22:59.19+00	\N	16500	0	0	efectivo
299b4299-7d59-4277-aa73-0fc42e0f5586	1189	19500	entregado	2025-10-03 15:15:11+00	\N	19500	0	0	efectivo
19974827-30ec-485c-955b-a6cf9d26bd06	3416	20000	entregado	2025-10-03 15:13:42.394+00	\N	20000	0	0	efectivo
3043bd93-98af-49a4-b479-a5c2b3d0ff4a	3727	14000	entregado	2025-10-03 15:19:28.254+00	\N	14000	0	0	efectivo
1d11dfbc-0ca8-4ffa-9101-4716e9891ce6	6831	40500	entregado	2025-10-03 15:12:54.754+00	\N	40500	0	0	efectivo
511e15b9-de72-4734-b88b-64898106ee35	3448	33500	entregado	2025-10-08 00:30:26.743+00	\N	33500	0	0	efectivo
4501b99f-51c4-49e4-957a-37418b546b37	6983	38000	entregado	2025-10-06 17:38:00.499+00	\N	0	38000	0	nequi
cea79f22-91e7-4e83-a9b8-3746e8953730	7932	30000	entregado	2025-10-07 18:40:46.394+00	\N	30000	0	0	efectivo
1e986bc3-4cbe-4ea3-ad49-a671e9befc49	7278	15000	entregado	2025-10-07 18:41:30.952+00	\N	0	15000	0	nequi
d15db397-84b7-4a94-bc24-32f9e22211ae	6576	19500	entregado	2025-10-06 16:20:31.987+00	\N	19500	0	0	efectivo
e3d2054e-e4c5-4710-81f3-a8d46400d101	3144	15000	entregado	2025-10-08 17:46:01.193+00	\N	15000	0	0	efectivo
cbf48c47-026a-49b4-a73e-aa3ce87503c0	2753	16000	entregado	2025-10-04 19:02:24.732+00	\N	16000	0	0	efectivo
fa3bbccf-1112-4f5d-a81c-c9f6e2d48879	7158	9500	entregado	2025-10-04 19:02:36.199+00	\N	9500	0	0	efectivo
6a196e1c-8716-49fd-8d4a-869aa979b274	8402	20000	entregado	2025-10-09 17:24:36.457+00	\N	20000	0	0	efectivo
6edf70e4-9127-430f-9e20-f29374d814e0	8328	4000	entregado	2025-10-06 19:53:45.264+00	\N	4000	0	0	efectivo
026e702c-c8e1-4ee2-8ad9-d7147cb4b8c7	9446	17000	entregado	2025-10-15 20:32:47.931+00	\N	17000	0	0	efectivo
fda19aa9-a78e-4f12-ad0a-df0a93b4e5cf	9385	31000	entregado	2025-10-07 17:19:19.81+00	\N	1000	30000	0	nequi
4c42393a-5742-47bf-8bcc-647cb4ec01b0	3944	48000	entregado	2025-10-07 21:29:25.043+00	\N	0	48000	0	nequi
9517a4bc-0871-497e-b9c5-499b665f44cb	4033	16000	entregado	2025-10-08 18:19:13.196+00	\N	0	16000	0	nequi
a69bb848-0251-4109-9d4f-c4c9d8a66ed7	7802	16000	entregado	2025-10-07 18:00:21.275+00	\N	0	16000	0	nequi
51fdcd89-3403-4329-8d30-1a5f1a91ff84	1867	72000	entregado	2025-10-04 19:37:15.002+00	\N	72000	0	0	efectivo
d6c0d96f-3329-4c5e-aaf0-1fb17d7c527e	7058	30000	entregado	2025-10-09 17:56:37.723+00	\N	15000	15000	0	efectivo
eea156f8-928e-4e79-b9e5-64ff8fe6b51f	8036	33500	entregado	2025-10-08 18:26:51.897+00	\N	18500	15000	0	efectivo
90909866-bf2f-438f-9234-f1170a2615e1	9730	25500	entregado	2025-10-07 22:36:02.773+00	\N	0	25500	0	nequi
05967053-6d4f-4aa1-8941-d76316f44ca7	3963	30000	entregado	2025-10-10 17:40:02.269+00	\N	15000	15000	0	efectivo
a8428a4c-f9cb-4d76-b0f1-a3793eddd73a	6387	10500	entregado	2025-10-07 22:47:35.452+00	\N	10500	0	0	efectivo
1a74627d-6f06-47dc-a7ee-2e071f0ed53f	1252	30000	entregado	2025-10-08 18:53:07.951+00	\N	30000	0	0	efectivo
93c9ecca-c6e3-43c9-b0e5-da23a06d9fbe	9010	16700	entregado	2025-10-07 23:54:00.447+00	\N	16700	0	0	efectivo
3064e1d5-8acb-49ee-8eef-d7a56dab61f0	7901	15000	entregado	2025-10-09 18:21:55.285+00	\N	15000	0	0	efectivo
778c92a4-42cd-4e81-927e-8c881ce490e6	9161	0	entregado	2025-10-08 20:41:45.114+00	\N	0	0	0	credito_empleados
b3c318c5-c42f-4ad4-9cee-123873df0881	8796	16000	entregado	2025-10-14 23:01:00.345+00	\N	16000	0	0	efectivo
59b97f38-4d81-499d-b764-bea462ccbb5b	8424	0	entregado	2025-10-10 19:38:58.389+00	\N	0	0	0	credito_empleados
d00ce29d-4b32-4121-b9fb-836e19d64358	1136	10500	entregado	2025-10-08 22:31:43.467+00	\N	10500	0	0	efectivo
53e73adb-fc4a-409f-bc9f-68f22e9ce838	7093	21000	entregado	2025-10-09 19:40:30.242+00	\N	21000	0	0	efectivo
6ba8c949-0de8-458a-99a0-2f7e10d28ec4	5004	32500	entregado	2025-10-09 00:24:06.864+00	\N	32500	0	0	efectivo
605330b5-521f-4874-9752-a12c30d94820	2957	16000	entregado	2025-10-09 21:27:41.191+00	\N	0	16000	0	nequi
d86045e8-5369-4810-b814-68289ff207bd	1832	30000	entregado	2025-10-18 17:51:26.178+00	\N	0	30000	0	nequi
c0030c55-b7c1-403e-a713-f37f6e25e499	1288	25000	entregado	2025-10-10 20:38:29.22+00	\N	25000	0	0	efectivo
2f188242-bcad-43f3-a5c8-9aadeced92e1	1469	39500	entregado	2025-10-09 22:27:21.537+00	\N	39500	0	0	efectivo
639d3d4f-cd06-4a92-a435-80e5ae8bc584	2251	10500	entregado	2025-10-14 23:48:19.432+00	\N	10500	0	0	efectivo
518fd497-a168-4570-ac28-162117d5c50b	7879	54300	entregado	2025-10-10 20:32:40.617+00	\N	0	0	54300	tarjeta
3227adc9-3699-4228-9b7e-d87615909bf4	2798	8000	entregado	2025-10-09 23:05:51.698+00	\N	0	8000	0	nequi
2864874a-a004-498b-b13d-51b3ecf1a6e1	6832	0	entregado	2025-10-17 22:36:14.923+00	\N	0	0	0	credito_empleados
d6cb5aa3-6910-47be-bccf-956bd5e28c7e	2690	34000	entregado	2025-10-16 22:29:58.733+00	\N	0	34000	0	nequi
7cbd0abe-f34b-4acc-8ab9-6f7dc8702255	7044	72000	entregado	2025-10-15 22:01:06.691+00	\N	0	72000	0	nequi
106be778-0d93-4b68-b306-b427ea436301	1827	42000	entregado	2025-10-10 22:46:04.286+00	\N	28000	14000	0	efectivo
41ed69b5-e614-4e05-9b6d-b158b2e82d9a	5948	22500	entregado	2025-10-15 16:52:00.928+00	\N	0	22500	0	nequi
a9530e36-320d-46ac-bf36-55f353304fe4	1495	30000	entregado	2025-10-17 21:24:20.661+00	\N	30000	0	0	efectivo
9de25180-22dc-4306-83f5-73805d4b1eec	3848	21000	entregado	2025-10-11 00:19:39.076+00	\N	0	21000	0	nequi
31519378-21eb-4b0a-84d6-af0a86b44a13	7112	30500	entregado	2025-10-11 00:20:06.239+00	\N	30500	0	0	efectivo
f0583fc6-2e1b-4d56-bfaf-c3102eed84a9	3767	9500	entregado	2025-10-15 17:50:46.888+00	\N	9500	0	0	efectivo
2a81149e-de9e-4da9-bba8-d6c22e3e6853	9959	23000	entregado	2025-10-11 17:33:26.559+00	\N	23000	0	0	efectivo
3546cd76-00f6-4b13-951b-19c44f61985b	3895	32000	entregado	2025-10-16 17:02:48.015+00	\N	0	32000	0	nequi
e5bfef01-9be6-42de-b72e-bd26047e3cb2	4344	8000	entregado	2025-10-21 18:50:35.569+00	\N	8000	0	0	credito_empleados
5e442e9a-8748-4087-b3d4-105b19bf5079	4445	30000	entregado	2025-10-15 18:14:39.889+00	\N	30000	0	0	efectivo
adb2a053-e787-4aef-8d8e-0737d8186204	4696	15000	entregado	2025-10-16 17:41:50.921+00	\N	15000	0	0	efectivo
96d55639-5f15-46c9-a652-84c0683e1599	5610	16000	entregado	2025-10-17 22:08:56.233+00	\N	0	16000	0	nequi
1aacd7d1-81ef-4bd5-a704-914991978fd7	6708	38000	entregado	2025-10-16 18:17:34.163+00	\N	38000	0	0	efectivo
b9accae5-bf3d-42e4-9e99-84f8203b3291	9566	58000	entregado	2025-10-17 21:05:09.479+00	\N	58000	0	0	efectivo
f01a316c-c4c5-42af-b879-260bcf9c7c81	5124	8000	entregado	2025-10-18 22:26:25.857+00	\N	8000	0	0	efectivo
08a9dfd9-3aad-4400-953e-d2730c93f61f	4113	30000	entregado	2025-10-18 01:12:47.929+00	\N	30000	0	0	efectivo
fc5268f2-5e8f-4a04-b882-7144a88dddfe	3740	54000	entregado	2025-10-17 22:16:16.304+00	\N	54000	0	0	efectivo
56c056e7-f3d4-4d37-b5a3-d02c6a281b1b	9875	19000	entregado	2025-10-18 19:05:29.273+00	\N	19000	0	0	efectivo
ed038003-2129-4d6a-8bb6-d6682742a465	8724	15000	entregado	2025-10-22 01:35:47.825+00	\N	0	15000	0	nequi
9af2254f-4b75-48f3-9da6-782e79589e2b	9736	33500	entregado	2025-10-20 21:45:17.804+00	\N	0	33500	0	nequi
f87388df-9013-4143-b941-740e97ff4be9	5611	30000	entregado	2025-10-20 18:06:04.9+00	\N	30000	0	0	efectivo
789980f2-4a33-4506-a6c6-f33d6c40b1ad	5717	8000	entregado	2025-10-20 23:34:49.308+00	\N	8000	0	0	efectivo
fdf92425-e5f4-46ea-a655-125bae7819d3	5232	18500	entregado	2025-10-22 01:33:35.52+00	\N	18500	0	0	efectivo
3498ec04-0b01-4880-8eb8-af14ea1f1da6	4701	15000	entregado	2025-10-22 01:36:58.854+00	\N	0	15000	0	nequi
a8f58bdf-db08-4b49-b6c0-dabb35212b1c	9578	30500	entregado	2025-10-22 22:54:05.217+00	\N	22500	8000	0	efectivo
bbd89a91-d526-4068-b009-00142e7158f3	8433	8000	entregado	2025-10-16 22:58:16.051+00	\N	8000	0	0	credito_empleados
6212f02d-dde8-40d4-bdcf-46d12c554857	1256	22000	entregado	2025-10-22 23:11:52.755+00	\N	11000	11000	0	efectivo
e8c7a67f-3701-4147-b068-de7e16622988	1193	30000	entregado	2025-10-22 23:14:30.785+00	\N	0	30000	0	nequi
089ac70f-fb54-4530-ba77-cb3d0661815e	9919	30000	entregado	2025-10-22 23:59:24.127+00	\N	0	0	30000	tarjeta
55bb2cd2-98da-4e56-b5eb-5a187740c5fe	1869	11000	entregado	2025-10-23 00:02:58.544+00	\N	0	11000	0	nequi
05a411a4-2ad9-42e6-885a-1098dea32e3d	5965	47000	entregado	2025-10-23 00:03:54.836+00	\N	30000	17000	0	efectivo
5f0eb9c6-66ce-4d3a-9bd2-123a1727d78a	6004	58000	entregado	2025-11-01 19:19:43.054+00	\N	58000	0	0	efectivo
aad0905b-6511-47f0-9711-627fd17800cd	4003	15000	entregado	2025-10-27 20:49:43.836+00	\N	0	15000	0	nequi
ba1afc01-52cc-4162-b5ec-fdbdaaba8beb	1154	16000	entregado	2025-10-30 23:24:29.017+00	\N	16000	0	0	efectivo
f7fd57bf-71e0-4373-8a9d-6317af92a619	9141	15000	entregado	2025-10-24 18:53:25.808+00	\N	0	0	15000	tarjeta
60182d4f-6dbe-4cfd-bb87-0de1933505f4	8316	25000	entregado	2025-10-27 21:36:54.069+00	\N	0	25000	0	nequi
66344c96-7de9-446f-bd57-9bcf6f1e000f	4422	67000	entregado	2025-10-24 20:03:03.128+00	\N	67000	0	0	efectivo
f8e97aa0-b0a2-4a44-a619-c6088c1881fe	1192	16700	entregado	2025-10-24 20:48:46.868+00	\N	0	16700	0	nequi
78bd6ce0-0611-4bd1-a2dd-74b33a7a4010	7849	15000	entregado	2025-10-24 19:16:33.007+00	\N	15000	0	0	efectivo
ea4a4afb-57df-4a6f-a296-80a24ac44eb4	3304	40000	entregado	2025-11-04 17:57:53.978+00	\N	40000	0	0	efectivo
058ffd3a-0ac6-4bd0-a624-1898cf7a0023	2625	24500	entregado	2025-10-24 21:04:48.531+00	\N	0	24500	0	nequi
48267f01-932b-46b7-8d02-2c14185ecf36	1531	9000	entregado	2025-10-31 16:32:25.364+00	\N	9000	0	0	efectivo
b0d40aff-4a16-4bf3-b0ff-006d19f93034	8295	15000	entregado	2025-11-04 19:15:51.43+00	\N	15000	0	0	efectivo
cdadd3d9-5023-4b11-96de-b91871571446	2816	33800	entregado	2025-10-27 22:44:58.608+00	\N	33800	0	0	efectivo
8916ea5d-cdfd-4454-b5d6-2c7ea2ca0f4a	5640	58000	entregado	2025-10-25 01:23:53.633+00	\N	58000	0	0	efectivo
51a4fd5b-2786-47d8-b3b1-91ca7bda4929	6922	0	entregado	2025-11-05 00:17:47.63+00	ebd3c2f8-065f-4a44-8d53-330d736d9647	0	0	0	credito_empleados
aeaa4aad-fd16-4b47-9260-59c5cece27a5	3858	39700	entregado	2025-10-25 17:50:57.905+00	\N	39700	0	0	efectivo
f5c18aa5-0c10-4985-a25e-f3b0ab6c3190	1418	30000	entregado	2025-11-04 18:21:19.696+00	\N	30000	0	0	efectivo
2d569753-fad3-466f-a899-cf559bf9f50c	9125	28700	entregado	2025-10-27 23:04:47.731+00	\N	28700	0	0	efectivo
b0d14edf-8a2a-4131-888d-145e84eaf559	9089	32000	entregado	2025-10-25 17:59:44.757+00	\N	16000	16000	0	efectivo
0265b312-dcdf-4f6f-b384-464320cc1d64	9302	0	entregado	2025-10-31 23:57:15.07+00	\N	0	0	0	credito_empleados
f9f1c2fc-05c9-4eee-a339-14a1a267f0d8	7315	38000	entregado	2025-10-27 23:13:41.833+00	\N	38000	0	0	efectivo
eb3550e2-aa45-44ab-b8d7-4909c31d300b	7960	37000	entregado	2025-11-05 18:09:09.407+00	\N	0	37000	0	nequi
161f677d-c022-42bc-8a49-efd9f08eb712	8661	43000	entregado	2025-10-25 18:02:17.84+00	\N	43000	0	0	efectivo
4f75b14f-5d20-4a07-bb07-b6cdd2aea03f	7663	30000	entregado	2025-10-27 23:32:11.676+00	\N	30000	0	0	efectivo
01c3b3b3-fa72-4a63-bdf0-eac0e5680272	4853	0	listo	2025-10-25 18:11:33.928+00	\N	0	0	0	\N
e7ca65b7-4a90-4a62-a687-ec7da13b1554	2991	16000	entregado	2025-11-04 19:16:52.275+00	\N	16000	0	0	efectivo
b6be93d5-84fb-4207-933a-94e0ad412cfe	6788	30000	entregado	2025-10-25 19:25:08.425+00	\N	0	30000	0	nequi
91636a1a-1518-48b7-8ce7-585adbd72a0c	7064	15000	entregado	2025-10-27 17:25:29.98+00	\N	15000	0	0	efectivo
96f2c4dd-2469-4e35-bbd0-a2eb36cc7bff	9934	15000	entregado	2025-10-30 19:11:29.437+00	\N	15000	0	0	efectivo
a4f0b6c3-0511-4ef2-881b-fc66edb58c43	2810	0	listo	2025-10-27 21:00:27.813+00	\N	0	0	0	\N
96bca2ef-be2b-4a71-93fe-d5425f848d0e	9576	60000	entregado	2025-10-30 18:45:51.05+00	\N	60000	0	0	efectivo
91e2c6b5-fdff-4a4f-a34e-785cd79e79c5	6007	40500	entregado	2025-11-04 18:30:12.474+00	\N	0	0	40500	tarjeta
9128986a-4851-4bcd-9ef6-00cf36a32215	3305	18500	entregado	2025-10-27 18:26:24.804+00	\N	18500	0	0	efectivo
547a458a-ae69-42bf-b17e-80cffc146b5b	7664	0	entregado	2025-11-05 00:18:48.378+00	\N	0	0	0	credito_empleados
7a81388b-4be1-43a5-a544-ee8684504fad	8135	8000	entregado	2025-10-27 20:21:10.82+00	\N	8000	0	0	efectivo
cc49dfe6-d1ae-4c50-9c7d-8256c14ac20c	7517	15000	entregado	2025-10-31 18:08:10.261+00	\N	15000	0	0	efectivo
3e99801f-090c-4f79-b983-03d1951b1361	6446	39500	entregado	2025-10-31 18:03:13.239+00	\N	39500	0	0	efectivo
78b9064d-53d9-466a-af2e-06f6d7f82b54	1676	15000	entregado	2025-10-31 16:35:12.115+00	\N	15000	0	0	efectivo
571af64b-4c58-4d26-8427-da20219dffe4	1539	12000	entregado	2025-11-01 16:44:27.269+00	\N	12000	0	0	efectivo
39eb5131-40f7-440b-8c2e-52de15ee6359	9500	10500	entregado	2025-10-31 16:16:53.549+00	\N	10500	0	0	efectivo
788c5253-d9d0-46b8-acb9-77ddc42a74b6	7030	11000	entregado	2025-10-31 16:16:25.713+00	\N	11000	0	0	efectivo
3a5cb2a5-075d-4045-86f8-93ea6705795e	1278	15000	entregado	2025-10-30 20:41:59.311+00	\N	15000	0	0	efectivo
83c6da1c-9329-40a2-871f-c3347d6bbb54	6121	16000	entregado	2025-10-30 19:48:04.142+00	\N	0	16000	0	nequi
a68eca9f-98d0-4f35-a1fe-358bf5ab44d3	5324	15000	entregado	2025-10-30 19:13:34.206+00	\N	15000	0	0	efectivo
803ba716-50b5-4c4d-9736-b7b8d643f03a	4882	31000	entregado	2025-11-04 18:16:30.455+00	\N	31000	0	0	efectivo
ecda85c8-0978-4a97-bc53-25dda5dc885f	6757	15000	entregado	2025-11-01 16:45:54.2+00	\N	15000	0	0	efectivo
ecb92c2c-8bf5-408c-85b2-2075cee5effd	5517	13500	entregado	2025-11-04 23:54:35.316+00	\N	13500	0	0	efectivo
321378ce-f6b9-4064-9966-0162319ab8bf	9076	0	listo	2025-10-28 16:55:30.936+00	\N	0	0	0	\N
eaebb77e-bd1e-45a1-a647-b810fcfee34c	5725	15000	entregado	2025-11-01 17:45:06.713+00	\N	15000	0	0	efectivo
bf9ba776-2531-4bd7-a865-295c6de6ae15	8176	15000	entregado	2025-11-01 17:44:18.341+00	\N	15000	0	0	efectivo
a8699136-d9bf-486f-a932-5946edcbfa0e	5582	11000	entregado	2025-11-04 20:56:39.734+00	\N	0	11000	0	nequi
7ccc13e3-3d95-4576-83d9-35b645a564c1	7394	34000	entregado	2025-11-04 18:14:42.15+00	\N	0	34000	0	nequi
39a623e4-4d45-4250-a091-f263f16b7b8e	6135	29700	entregado	2025-11-04 22:18:03.537+00	\N	14850	14850	0	efectivo
032e047a-7120-400b-9820-0c02523530e4	1352	5500	entregado	2025-11-04 22:52:26.171+00	\N	5500	0	0	efectivo
bf123321-a8fc-42ba-8ef5-b9a7535e9df1	6486	15000	entregado	2025-11-05 17:28:23.263+00	\N	15000	0	0	efectivo
9571da12-ad4f-4e47-9cbd-d56073c2536c	2176	15000	entregado	2025-11-04 18:17:30.725+00	\N	0	0	15000	tarjeta
54f5086f-3cf8-4082-92e1-35ecc4454ef0	8558	15000	entregado	2025-11-05 18:53:39.367+00	\N	15000	0	0	efectivo
bd9050e2-3cb2-4374-8481-e38184350215	5614	40500	entregado	2025-11-04 22:35:55.765+00	\N	0	40500	0	nequi
7b2d7052-1674-435c-8f08-30051420d9e3	9042	0	entregado	2025-11-05 00:04:39.665+00	ebd3c2f8-065f-4a44-8d53-330d736d9647	0	0	0	credito_empleados
4d8bace4-8a76-4ec3-96f9-5345af591dd8	5531	0	entregado	2025-11-05 17:13:10.403+00	ebd3c2f8-065f-4a44-8d53-330d736d9647	0	0	0	credito_empleados
27037d91-b1fd-483a-889b-3606c7de41bc	6431	30000	entregado	2025-11-05 17:12:45.806+00	\N	0	30000	0	nequi
6f9782fe-6564-4909-9f5c-5ea8ada31c6c	6210	30000	entregado	2025-11-05 18:48:39.767+00	\N	0	30000	0	nequi
33dc030a-80e4-4284-9ccd-c4167647fcef	2843	16500	entregado	2025-11-05 18:56:52.492+00	\N	0	16500	0	nequi
d9655f35-27a9-4e34-931c-9223991a60be	1881	11000	entregado	2025-11-05 17:55:36.373+00	\N	11000	0	0	efectivo
197a8813-c8d0-4ffb-ac9d-29f80358f92c	7613	31000	entregado	2025-11-05 18:54:55.042+00	\N	31000	0	0	efectivo
1c8f6d67-8bec-4982-9afc-35674d699ffe	7115	30000	entregado	2025-11-05 20:22:29.112+00	\N	30000	0	0	efectivo
ae0d8651-aaee-4fcf-a4d9-68686b136fad	1908	15500	entregado	2025-11-05 20:57:39.668+00	\N	15500	0	0	efectivo
b3f07c90-80a0-4d29-bb40-d26e1738e7a8	9639	20000	entregado	2025-11-05 20:43:14.133+00	\N	20000	0	0	efectivo
95155441-542b-44bb-bcf3-a14d35f3eb4e	3707	16000	entregado	2025-11-05 21:10:02.56+00	\N	0	16000	0	nequi
f916cb22-4940-4605-afc8-883a8a340004	9992	44600	entregado	2025-11-05 21:36:56.895+00	\N	15000	29600	0	nequi
7ff5898c-b595-4077-8218-eff38c17985b	6093	34000	entregado	2025-11-05 21:21:24.025+00	\N	34000	0	0	efectivo
57f5e534-f8fa-408f-a664-679ee25677ef	4325	7000	entregado	2025-11-06 00:53:19.156+00	\N	7000	0	0	efectivo
cd615437-eeb3-40ee-8811-e9cc4e5c01fb	2592	31500	entregado	2025-11-06 00:58:15.842+00	\N	31500	0	0	efectivo
ef0c65d9-7756-4db7-8ab6-7f4a0e0f8cbe	6474	0	listo	2025-11-06 21:39:35.402+00	\N	0	0	0	\N
995e7b91-dcf7-4a70-ba00-f109b8bdafc5	2361	15000	entregado	2025-11-05 19:19:26.906+00	\N	15000	0	0	credito_empleados
44398031-6cb3-471e-9832-4d6426ad2e75	5286	19000	listo	2026-01-05 20:58:51.038+00	eaa07600-d0f1-452a-ae7b-6ad8b58f24c4	15000	0	4000	efectivo
52488e05-4f87-4318-9a1b-84ae8e91dfea	1977	0	listo	2026-01-31 04:14:47.003+00	\N	0	0	0	\N
7f33db4f-503f-4f3d-9675-1ef2d8d1abc2	7154	5000	entregado	2026-02-26 01:26:17.936+00	\N	5000	0	0	efectivo
ab3e3bbb-4b80-45fe-9bcd-32b39f452ca9	9546	17000	entregado	2026-02-26 18:11:18.344+00	\N	17000	0	0	efectivo
3776281b-b10f-4af8-86b1-7d6dd088b589	5262	38000	entregado	2026-02-23 23:07:42.005+00	\N	20000	18000	0	efectivo
50df1309-7bba-4c64-9940-8b7912f35426	9445	16500	entregado	2026-02-26 01:25:25.508+00	\N	16500	0	0	efectivo
2c5d3b4a-d3b7-4137-a2fc-7433ed989576	1187	67500	entregado	2026-02-25 23:36:08.7+00	\N	20000	47500	0	nequi
e66a8ca4-cac3-4aa9-b4c2-914bf3760f56	2857	32000	entregado	2026-02-25 20:00:22.679+00	\N	0	0	32000	tarjeta
aa908598-9498-4a1e-b057-217e34f74b33	9548	11000	entregado	2026-02-24 23:39:09.247+00	\N	11000	0	0	efectivo
2731592d-56d1-4767-926e-e1a4263f87f6	9066	16000	entregado	2026-02-24 00:31:45.599+00	ebd3c2f8-065f-4a44-8d53-330d736d9647	0	0	0	credito_empleados
6f42e2d4-def4-4345-9f15-0ae0e52ae0db	5650	93500	entregado	2026-02-23 23:11:12.368+00	\N	0	93500	0	nequi
b3d83639-2a1d-48b1-966c-5245ced9a98a	6853	11000	entregado	2026-02-24 23:13:41.996+00	\N	11000	0	0	efectivo
b9e977e5-3cbd-4bae-b26b-87da91b55747	2538	85000	entregado	2026-02-24 00:48:54.923+00	\N	0	0	0	credito_empleados
57f1688f-77f0-4619-831f-f25ce90c8d08	4761	17000	entregado	2026-02-25 20:03:29.565+00	\N	17000	0	0	efectivo
6b97d0d8-72ca-4f19-8a87-f88824a9cfb6	9708	5000	entregado	2026-02-24 00:53:18.928+00	\N	0	0	0	credito_empleados
dc262236-2666-4bef-828c-b31b69e6bd6f	7675	27000	entregado	2026-02-24 22:33:42.284+00	\N	27000	0	0	efectivo
e50047c4-bef0-4cad-a7be-3db5a7268210	3676	5500	entregado	2026-02-24 16:22:46.003+00	\N	0	5500	0	nequi
59a65cec-0f0a-4095-acb1-23a4e3f544b6	8198	16000	entregado	2026-02-25 00:18:00.798+00	\N	0	0	0	credito_empleados
d2d00877-f50d-46ad-9fe1-29b95cf1bb56	5793	37000	entregado	2026-02-25 23:48:58.035+00	\N	37000	0	0	efectivo
30ee46b4-7d4f-41d4-8106-d8c9d14ca69c	5143	9500	entregado	2026-02-23 17:56:11.385+00	\N	0	0	0	credito_empleados
e06ed70e-e7e3-44b7-9779-c9b8f0e4ca09	7167	29500	entregado	2026-02-24 19:12:56.421+00	\N	0	29500	0	nequi
eb87a882-bddc-4481-ae3b-fe4675d8740c	9156	17000	entregado	2026-02-23 19:29:39.003+00	\N	0	0	0	credito_empleados
6b93c345-bd05-47c4-820b-f1fc329416d9	4174	34000	entregado	2026-02-24 18:21:56.679+00	\N	0	34000	0	nequi
20c9e2a3-35f6-4886-9edf-b163830266b4	6860	16000	entregado	2026-02-26 17:40:17.873+00	\N	16000	0	0	efectivo
c4a98bd4-97f1-45f6-aab3-1ed1a0e9c6fc	5279	17000	entregado	2026-02-23 19:55:40.013+00	\N	17000	0	0	efectivo
4bcf8ba6-de7c-475f-b99f-420fc026e223	9385	17000	entregado	2026-02-24 18:12:55.543+00	\N	17000	0	0	efectivo
7acc3310-730f-4069-a033-16bf5f95fc9b	5298	51000	entregado	2026-02-25 18:01:53.981+00	\N	34000	17000	0	efectivo
f6618feb-9e20-44d9-80f0-7212b797da10	9422	5500	entregado	2026-02-23 21:06:10.483+00	\N	5500	0	0	efectivo
acb74a3b-0112-4ccd-aa1a-ac4a8a0981b0	9637	49000	entregado	2026-02-25 19:54:09.461+00	\N	49000	0	0	efectivo
06e73484-23b3-4767-a771-8d7b5ff0c6e0	1398	17000	entregado	2026-02-24 18:35:28.869+00	\N	17000	0	0	efectivo
7570385b-25e8-409c-93fb-34250d054aa3	9901	33000	entregado	2026-02-24 18:12:49.456+00	\N	0	33000	0	nequi
4c7598f6-f7fb-498b-b5b7-2718af77fff2	1071	10000	entregado	2026-02-26 00:04:40.589+00	\N	0	10000	0	nequi
88ed64c9-402e-484c-81dc-3dbcfddc3dc6	6236	45000	entregado	2026-02-25 18:54:06.108+00	\N	0	45000	0	nequi
ab0e1f61-6d50-402c-b261-9008e018621f	2805	18500	entregado	2026-02-25 20:13:11.389+00	\N	18500	0	0	efectivo
22644531-45a1-47e8-92b3-91da436436f4	1409	19000	entregado	2026-02-25 20:11:32.702+00	\N	0	19000	0	nequi
5b0e9f48-76df-466b-8f86-a6348e86f3a3	9552	38000	entregado	2026-02-24 18:53:35.693+00	\N	0	38000	0	nequi
c02a6727-54cc-4266-91fe-cfcbc016ffca	7527	17000	entregado	2026-02-25 18:55:56.066+00	\N	0	17000	0	nequi
fd5faf4b-3fa3-4321-80d4-97bec23a5f3b	5265	17000	entregado	2026-02-25 23:16:24.657+00	\N	17000	0	0	efectivo
af74bd65-6fd5-41e8-847d-77f1243e1b80	1481	21000	entregado	2026-02-25 20:18:04.657+00	\N	21000	0	0	efectivo
fdcabf41-17ad-4d2c-9a6c-8c8781fb80ba	7280	34000	entregado	2026-02-25 18:57:39.6+00	\N	34000	0	0	efectivo
f21d2435-7ff3-4be3-b521-20876522aa88	7865	19000	entregado	2026-02-26 00:11:24.58+00	\N	19000	0	0	efectivo
7e57451d-f8a3-4f84-b92c-479eb19bedc0	8908	11000	entregado	2026-02-26 21:54:50.125+00	\N	11000	0	0	efectivo
531ede53-207b-4665-9e6e-7d403d23cc24	7277	74500	entregado	2026-02-26 17:17:37.624+00	\N	0	74500	0	nequi
71d6172e-a893-4e18-8358-f54ab98a32cf	2620	22000	entregado	2026-02-25 21:46:08.338+00	\N	0	22000	0	nequi
1e1b93a1-d9fd-4bd7-9d0f-402bef4c32bd	8418	54000	entregado	2026-02-25 19:41:57.311+00	\N	27000	27000	0	efectivo
5555592f-75df-4392-9542-23d7c0e31466	1374	6000	entregado	2026-02-26 02:11:45.956+00	eaa07600-d0f1-452a-ae7b-6ad8b58f24c4	0	6000	0	nequi
9fa84ec0-3712-42d5-805e-2ceed9f09619	7847	22000	entregado	2026-02-27 19:22:23.605+00	f5b1ba1b-8463-41af-81b9-6a8c8573d4ad	0	0	22000	tarjeta
476cfdeb-178b-4d45-be59-bb1dc1c73473	3854	51000	entregado	2026-02-26 17:20:02.011+00	\N	0	51000	0	nequi
3a3112ec-1f79-483e-a275-7d2065c2c988	9229	25500	entregado	2026-02-26 17:39:04.635+00	\N	0	25500	0	nequi
f3e72a86-2d4f-4531-b90d-010bfe35610a	1478	20000	entregado	2026-02-26 23:46:46.144+00	\N	20000	0	0	efectivo
87adf049-b73e-434e-80d0-09f65b356138	8265	0	entregado	2026-02-26 16:42:51.698+00	\N	0	0	0	credito_empleados
23ddc409-9409-4dfc-9dde-c5ee605b4073	1395	28000	entregado	2026-02-27 22:38:34.751+00	\N	0	28000	0	nequi
869e9281-cdf3-408d-8d7a-60247e15ddd5	5865	11000	entregado	2026-02-26 17:53:15.519+00	\N	11000	0	0	efectivo
62eea85d-6709-4092-8852-2062514d6842	2188	20000	entregado	2026-02-26 22:29:13.377+00	\N	20000	0	0	efectivo
fe854d7a-e7c5-4e6c-8ec0-b137e5bf0e94	8583	25500	entregado	2026-02-26 19:54:19.426+00	\N	25500	0	0	credito_empleados
ac8112be-4313-418d-a5e0-dabbe8d18e3f	5871	16000	entregado	2026-03-06 21:52:57.457+00	\N	0	16000	0	nequi
63270235-dcc8-421e-afd1-de37f259b857	9998	23800	entregado	2026-03-09 18:53:52.268+00	\N	0	23800	0	nequi
f9247b21-6266-4eb8-a973-7e54f7c82fe2	2468	34500	entregado	2026-02-26 21:40:01.137+00	\N	0	34500	0	nequi
12faaac0-0094-4bae-b539-e06281b943ec	8256	16000	entregado	2026-02-27 19:44:13.099+00	\N	0	0	0	credito_empleados
aaa83596-7c95-46a2-bf81-ebf1bed3f1cd	5111	10500	entregado	2026-02-27 16:30:23.782+00	\N	0	10500	0	nequi
37ef47e5-d2d2-4f05-a8c6-fabba4ef99fe	7739	20000	entregado	2026-02-26 22:18:47.91+00	\N	0	20000	0	nequi
79f976ad-93ef-401d-8e8b-483cd3d6bb09	7821	35000	entregado	2026-02-27 20:46:45.112+00	9d300a46-8032-4ef3-b906-5f1348667868	35000	0	0	efectivo
93fcffe3-7dc4-48ad-858d-7304144dd414	3475	34000	entregado	2026-02-28 00:36:37.841+00	91301b42-be86-438a-8fe1-dfdee23a49f7	0	34000	0	nequi
8db617e0-d976-4c40-8402-63e273feedb5	7053	6000	entregado	2026-02-27 20:03:28.811+00	0cf14e74-a586-47c8-8d24-52547bdd464b	0	0	0	credito_empleados
e5a15063-4667-41dd-a03b-e19481a7955e	5980	17000	entregado	2026-02-28 17:24:44.081+00	\N	17000	0	0	efectivo
55385d16-553a-4bb8-a910-fb5a7df769bd	8567	17000	entregado	2026-02-27 23:41:11.789+00	\N	0	0	0	credito_empleados
a618bb69-d63c-4f75-afcd-1bd165e2e0dd	6793	33000	entregado	2026-02-28 17:26:07.064+00	\N	33000	0	0	efectivo
6b36de44-426f-467c-b8f5-7c1017423348	7276	17000	entregado	2026-02-28 17:23:52.523+00	\N	0	17000	0	nequi
1a3e9c16-34dd-489b-b277-d65a7c4ad26d	7945	17000	entregado	2026-02-28 17:54:15.164+00	\N	0	0	17000	tarjeta
45e7b405-d78d-4d64-9743-489c2b9bcaf0	7613	11000	entregado	2026-02-28 20:13:19.275+00	\N	11000	0	0	efectivo
231ec8f1-cf2f-415a-8b95-0efb5d748fa1	8909	16000	entregado	2026-03-02 23:33:26.345+00	\N	0	0	0	credito_empleados
ddfd1d56-0436-4bb3-95a0-1d0aecfa42fd	7586	4000	entregado	2026-03-05 01:13:29.971+00	\N	0	4000	0	nequi
b44c8f76-8a82-4137-881c-868ebb5dd744	6924	27500	entregado	2026-03-03 18:29:00.012+00	\N	27500	0	0	efectivo
c4658b79-0323-4117-9df3-8e1abf29be1c	10015	17000	entregado	2026-03-10 18:08:15.395+00	\N	0	17000	0	nequi
5a58477e-3d7e-4b3c-9dc7-64c0fc80fc83	7966	6000	entregado	2026-02-27 00:22:07.355+00	\N	0	0	0	credito_empleados
826c4c3b-b34a-47a1-ac89-abb687426236	1111	11000	entregado	2026-03-03 20:36:41.624+00	\N	11000	0	0	efectivo
4ca32d17-67b9-4f47-be28-7a3d16497d58	5912	5500	entregado	2026-03-04 02:24:10.864+00	\N	0	0	0	credito_empleados
0a25155b-77b3-47f6-ae3d-ce030f0e018d	10076	16000	entregado	2026-03-14 17:58:39.741+00	\N	0	16000	0	nequi
784891fc-8270-47eb-88fd-06772fe2d0d7	1164	5500	entregado	2026-03-05 23:46:46.682+00	\N	5500	0	0	efectivo
4d19d789-9613-4d62-921e-6b2795b8b001	6080	34000	entregado	2026-03-06 17:17:46.293+00	\N	0	34000	0	nequi
c3162195-9dcf-46b0-8256-be9e0247f069	10025	8800	entregado	2026-03-10 21:54:25.946+00	\N	8800	0	0	efectivo
7b9b4a5c-d84b-453c-9d5f-c7106f321302	6974	16000	entregado	2026-03-06 21:26:52.035+00	\N	16000	0	0	efectivo
900b99b6-0f75-4a4d-a363-c96049966079	9999	22000	entregado	2026-03-09 18:59:23.847+00	\N	22000	0	0	efectivo
051dbcfd-8188-4bf1-96fc-1e3f2401116c	10035	11000	entregado	2026-03-11 19:28:34.613+00	\N	11000	0	0	efectivo
384dc9b7-d882-4590-88da-c4d5e63e743c	10086	42000	entregado	2026-03-16 23:34:11.867+00	\N	0	42000	0	nequi
e4b0564d-b370-4d3b-99c3-8be220bfcf6e	10045	8800	entregado	2026-03-11 22:29:09.627+00	\N	0	0	0	credito_empleados
404ae363-5bcd-475c-95c6-9962a034945c	10055	24000	entregado	2026-03-12 22:31:08.753+00	\N	0	24000	0	nequi
f62be11e-248a-4bcd-928a-8b61e4fc52ae	10096	4000	entregado	2026-03-17 21:50:38.543+00	\N	0	4000	0	nequi
3e4623ea-c50e-427d-9c0b-0ba369aace49	10065	22000	entregado	2026-03-13 17:20:19.381+00	\N	0	22000	0	nequi
\.


--
-- Data for Name: caja_movimientos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."caja_movimientos" ("id", "fecha", "tipo", "concepto", "monto", "metodopago", "order_id", "gasto_id", "bolsillo", "transferencia_id") FROM stdin;
7801a332-8dd4-4dc1-8f6c-40e6aa55ef17	2025-09-22	EGRESO	Ingredientes: hola	10000	efectivo	\N	\N	caja_principal	\N
101e77af-03e0-4d5a-845f-e8eb4b5caf1e	2025-09-22	INGRESO	Venta #6848	5500	efectivo	\N	\N	caja_principal	\N
8293c678-98f4-4d74-8d4e-75ba59c46642	2025-09-22	INGRESO	Venta #4418	5500	nequi	\N	\N	caja_principal	\N
4b11e696-163b-4aa2-995b-6583f2ab0c7e	2025-09-22	INGRESO	Venta #2267	5500	efectivo	\N	\N	caja_principal	\N
461a70ba-091f-4582-8fff-cfcdfc0227b7	2025-09-22	INGRESO	Venta #5486	6000	efectivo	\N	\N	caja_principal	\N
88177133-ae7d-475f-8141-fa2f0793c758	2025-09-22	INGRESO	Venta #1861	11500	efectivo	\N	\N	caja_principal	\N
b37e407a-e67e-46e3-ac98-efe1b1ea44bc	2025-09-22	INGRESO	Venta #9105	15000	efectivo	\N	\N	caja_principal	\N
89a51248-c412-427e-88bc-1f102de18f43	2025-09-22	INGRESO	Venta #4680	6000	efectivo	\N	\N	caja_principal	\N
249c65b5-2f8a-450e-ad52-3d1ac5db1248	2025-09-22	INGRESO	Venta #5638	14500	efectivo	\N	\N	caja_principal	\N
9ad7cb5f-f4c9-459e-8d6a-6a7038e9b37d	2025-09-22	INGRESO	Venta #3840	5500	efectivo	\N	\N	caja_principal	\N
bf6bebbc-248c-44f3-8c4b-20a78558fb48	2025-09-22	INGRESO	Venta #4538	29000	efectivo	\N	\N	caja_principal	\N
582d0844-4eeb-4fad-92c7-9cb055a5e279	2025-09-22	INGRESO	Venta #1869	27500	efectivo	\N	\N	caja_principal	\N
06ed7c7b-c076-4888-9d83-983363a34b84	2025-09-22	INGRESO	Venta #9831	15000	efectivo	\N	\N	caja_principal	\N
812ffb40-a6a6-46d0-8327-35e4ea78e428	2025-09-22	INGRESO	Venta #6231	5500	efectivo	\N	\N	caja_principal	\N
216d64f0-7c17-4b04-9657-2639c1580246	2025-09-22	INGRESO	Venta #5006	15500	efectivo	\N	\N	caja_principal	\N
52602dd9-e3e8-465b-adde-3cf52558a96a	2025-09-22	INGRESO	Venta #1754	36500	efectivo	\N	\N	caja_principal	\N
36d91f43-aa75-41d7-84f7-c77d931e12c6	2025-09-22	INGRESO	Venta #4942	12000	efectivo	\N	\N	caja_principal	\N
db142b30-66c4-46a4-a548-e539890ca741	2025-09-23	INGRESO	Venta #8420	18500	nequi	\N	\N	caja_principal	\N
dfa25b3f-4fa2-43ec-bddd-264fab687592	2025-09-23	INGRESO	Venta #5674	18500	efectivo	\N	\N	caja_principal	\N
67a68df4-9c15-44a6-bf9c-c4aab48c666e	2025-09-23	INGRESO	Venta #8161	9500	efectivo	\N	\N	caja_principal	\N
41f62a4c-8dff-4a91-afe9-a7576bc19f9b	2025-09-23	INGRESO	Venta #8039	9500	efectivo	\N	\N	caja_principal	\N
36015222-c5a2-4953-ae04-c65332311e0d	2025-09-23	INGRESO	Venta #3278	18500	efectivo	9d69b9cb-eda1-4d32-83a8-2a602a794389	\N	caja_principal	\N
29eca59a-b8c6-4006-9e97-cf30dab788fa	2025-09-23	INGRESO	Venta #6424	28500	efectivo	c816883c-1811-416f-bb80-92ac3ff8d711	\N	caja_principal	\N
c7e82afa-fed4-45be-8377-21f5b650bc03	2025-09-23	INGRESO	Venta #4153	18500	efectivo	4ace7a39-1bb7-4837-b544-20479ecfaac2	\N	caja_principal	\N
eecbf37c-4525-453f-9431-42451b159daf	2025-09-23	INGRESO	Venta #4041	14500	efectivo	de7f4770-191d-4b57-ad9c-6468b2a0d51a	\N	caja_principal	\N
7a164aab-9bcd-484c-9a57-0361309ffdfe	2025-09-23	INGRESO	Venta #2931	8000	efectivo	c8cde86a-df1e-47ef-8c13-d8468a25f3eb	\N	caja_principal	\N
4d18b05a-8939-45db-8b72-40a11b77253c	2025-09-23	INGRESO	Venta #8055	15000	efectivo	d6a104ee-86fe-47e2-976d-47a99d172ced	\N	caja_principal	\N
c92c2c1e-4d29-4476-ac63-718b4bcfdc65	2025-09-23	INGRESO	Venta #5954	10500	efectivo	270cb9c3-9278-47e2-89b9-36492b584e9c	\N	caja_principal	\N
e28d4f70-cb88-4cb7-8d3d-df0d0672bb12	2025-09-23	INGRESO	Venta #7325	4000	efectivo	63195593-a2c9-41a3-887c-a129e1cdd976	\N	caja_principal	\N
99fb8ece-2671-4121-b091-b376b4b4e29c	2025-09-23	INGRESO	Venta #3767	34500	efectivo	3d487325-f935-4c40-9e2a-236592e67b56	\N	caja_principal	\N
a9d3ae44-e134-4450-b9a0-23a8cebb4bc1	2025-09-23	INGRESO	Venta #7287	15000	efectivo	c0b4015d-a729-4c9e-a220-cd6bb9b002f7	\N	caja_principal	\N
d7581812-f0c4-4f93-b5b5-671100c9a804	2025-09-23	INGRESO	Venta #3468	18500	efectivo	7d385443-f410-4453-8e1d-9133ccfc279f	\N	caja_principal	\N
60eaa81f-d645-4347-9037-67effceeacfb	2025-09-23	INGRESO	Venta #9099	15000	efectivo	507f5e77-20a2-4f77-8394-6bccf0eff0a2	\N	caja_principal	\N
6bd6e7dc-ccf5-4e5a-8327-5a4209d040af	2025-09-23	INGRESO	Venta #1316	15000	efectivo	68f500ad-bb4e-4328-9d2a-9bcda8a7d6b0	\N	caja_principal	\N
9b34a362-b4f8-4fd0-ac74-41521ac9ee25	2025-09-23	INGRESO	Venta #4075	15000	efectivo	4157c111-1cd4-4731-9e23-79474160c9e8	\N	caja_principal	\N
1435936f-7200-4b7b-858c-62e5d8a3cf86	2025-09-23	INGRESO	Venta #9507	15000	efectivo	9a09e837-cc60-4521-bdfb-790fe3ec15f1	\N	caja_principal	\N
5f39c949-43c4-4b7a-8676-2bcf4d3dbf6f	2025-09-23	INGRESO	Venta #8658	15000	efectivo	b88ba1fa-6f2a-4a1a-bbeb-1ef46feb7dcf	\N	caja_principal	\N
f85c3bb6-fe39-4223-b256-a1992e3f45be	2025-09-23	INGRESO	Venta #5828	23000	efectivo	23eb2329-0c5e-4088-8fb3-36715c1d1f4c	\N	caja_principal	\N
3a639750-bfaf-492f-81c8-5a5abfa328a4	2025-09-23	INGRESO	Venta #1581	16000	efectivo	b4d33059-dfdb-43af-94b8-c04e0a270161	\N	caja_principal	\N
440f149f-5bec-4531-a869-f4e5dc8f4166	2025-09-23	INGRESO	Venta #9788	56500	efectivo	615f8381-992b-4d15-8313-899413b973fb	\N	caja_principal	\N
e75dbab1-6e06-4616-aea5-6c166ee03da7	2025-09-23	INGRESO	Venta #9573	12000	efectivo	0168c10e-c788-426c-b706-3c57300c52f1	\N	caja_principal	\N
0740d249-c524-43a2-9d90-c56ce5fe0aac	2025-09-23	INGRESO	Venta #4875	6000	efectivo	c5be6c87-d4d6-40a4-afa5-edb12ae9365f	\N	caja_principal	\N
1c79ec1d-a7f6-410c-9a35-07ad42876bc8	2025-09-23	INGRESO	Venta #8794	31500	efectivo	1529133b-90d2-498e-a089-11ee20022e23	\N	caja_principal	\N
c80abaca-3021-4312-833b-b2d48f401976	2025-09-23	INGRESO	Venta #2777	18500	efectivo	a064c078-e503-4588-9f1a-5833ab74af57	\N	caja_principal	\N
b43f76c8-83bf-4084-b530-0f7ffd4e7973	2025-09-23	INGRESO	Venta #1486	14850	efectivo	5d597deb-c39d-48b8-bb7c-d6e593929397	\N	caja_principal	\N
c54550b8-ae6f-4d20-8742-27dff5f988cc	2025-09-23	INGRESO	Venta #2822	13000	efectivo	0e99f28d-a472-4ab9-b6f9-0c898b40ba88	\N	caja_principal	\N
bc5f5b75-3832-46ab-aa61-7dcc9903a6a4	2025-09-23	INGRESO	Venta #1008	44650	efectivo	842fbc54-bda1-4b20-957e-85d656cc4a3e	\N	caja_principal	\N
656d1fd4-d8ec-4d66-b084-437e762d09c1	2025-09-23	INGRESO	Venta #6555	8500	efectivo	5cb52fcb-f91e-49c0-939a-a4dfe0d1cb58	\N	caja_principal	\N
e0ba5e93-42b4-48dd-a1d4-34fcc0f15424	2025-09-23	INGRESO	Venta #1657	14500	efectivo	\N	\N	caja_principal	\N
16a62904-8373-4b6d-904a-9e76b84bedf4	2025-09-23	INGRESO	Venta #5996	26500	nequi	\N	\N	caja_principal	\N
bcd709d1-e277-4020-864e-268cc1205f25	2025-09-23	INGRESO	Venta #9353	26500	efectivo	b0d9be7c-102e-4bfb-a027-33a1cd9996ea	\N	caja_principal	\N
b86124e8-bdee-4b1f-a26c-770820260049	2025-09-23	INGRESO	Venta #4142	19000	efectivo	\N	\N	caja_principal	\N
c4d5171d-401f-49f9-ab7d-6de2c2243138	2025-09-23	INGRESO	Venta #5496	19000	efectivo	9cda329f-736a-45a1-b779-94967eef478f	\N	caja_principal	\N
a577a899-b57d-4ae2-9c77-cdd83c00034e	2025-09-23	EGRESO	Ingredientes: Uvillas	3800	efectivo	\N	\N	caja_principal	\N
affdf207-0cd2-463c-8c12-737c4c92ef8d	2025-09-22	EGRESO	Ingredientes: Apio	2500	efectivo	\N	\N	caja_principal	\N
1c2bc831-0307-495c-958c-032bdfec9f9b	2025-09-22	EGRESO	Ingredientes: Uvillas	3800	efectivo	\N	\N	caja_principal	\N
caf8aa6a-ee95-4ff1-a4ad-cc97a8239eb4	2025-09-22	EGRESO	Ingredientes: Uvillas	3800	efectivo	\N	\N	caja_principal	\N
ffc72c0e-6aa6-46f1-a5b9-5f02fa73084f	2025-09-22	EGRESO	Ingredientes: HOLA	2000	efectivo	\N	\N	caja_principal	\N
00a1bd4e-4db6-49ae-8086-6ac7ff5579d4	2025-09-22	EGRESO	Ingredientes: hola2	3000	efectivo	\N	\N	caja_principal	\N
aa2521f2-fb44-4453-80d4-024bebd7953d	2025-09-23	EGRESO	Ingredientes: Uvillas	3800	efectivo	\N	786efe72-4b29-4a12-8e2a-e1bcb4d5baac	caja_principal	\N
37319b1a-b637-43ac-a120-99e5f5877ee0	2025-09-23	EGRESO	Ingredientes: Panela	2900	efectivo	\N	c5b7b0c0-9409-4c07-ab55-d16be77c8091	caja_principal	\N
560896f3-a379-4a2a-ad6e-cc9f60d9a081	2025-09-23	INGRESO	Venta #5956	39000	efectivo	9570fce9-c17a-479b-a87c-40d2bcf40312	\N	caja_principal	\N
6d159d48-8af7-4865-9695-d75967a3c2f5	2025-09-23	EGRESO	Ingredientes: Champiñones	28000	efectivo	\N	b82e5b20-bbe7-448b-be66-e363cc409a36	caja_principal	\N
e2682dc6-09d4-4ce2-9d80-57b0d3c6b742	2025-09-23	INGRESO	Venta #3716	1000	efectivo	\N	\N	caja_principal	\N
9b6b6eb2-bd1c-4c17-9e4f-a0f0a9ecff8d	2025-09-23	INGRESO	Venta #1539	16000	efectivo	529b3152-2ab2-4e97-9e1d-bd9a3ab0975e	\N	caja_principal	\N
54019c0a-fa8e-46a6-a4a8-a1609309fb85	2025-09-23	INGRESO	Venta #4070	30000	efectivo	9c872a93-c09f-4346-9c46-0883e8fdf576	\N	caja_principal	\N
fa23839c-a48d-4ba1-871a-c534dfc6dc2e	2025-09-23	INGRESO	Venta #7940	40000	efectivo	f361c481-118d-4e72-8658-058715d72db2	\N	caja_principal	\N
d15138af-73f8-4b9b-b584-09efc6611fbe	2025-09-23	INGRESO	Venta #1941	15000	efectivo	fd5de209-af3b-4a6e-8bb8-f0876ae61b11	\N	caja_principal	\N
842abd50-4707-47e7-8470-2cd981f6080e	2025-09-23	INGRESO	Venta #1008	32000	efectivo	c83d1ab6-6390-4786-848a-094e60de15cd	\N	caja_principal	\N
b8b62eeb-9649-42c9-a038-33fe9ee98ce9	2025-09-23	INGRESO	Venta #6654	8000	efectivo	9040b73f-77bf-427b-b0c2-1bb2526c0086	\N	caja_principal	\N
103261aa-dc05-4c50-a25c-2ff9387b89ea	2025-09-23	INGRESO	Venta #7065	8000	efectivo	5879eaea-d972-4277-a405-30978f25166e	\N	caja_principal	\N
5f7c9527-d8e4-4b48-bcc8-76f3f7c21b1a	2025-09-23	INGRESO	Venta #4082	30000	efectivo	ae2bebca-571e-4c07-8670-757db996718d	\N	caja_principal	\N
5b5cf757-944f-4767-8536-209493780389	2025-09-23	INGRESO	Venta #7311	30000	efectivo	15cbe337-b663-447c-86e5-c1cca381e249	\N	caja_principal	\N
01c6d160-c16e-4445-8512-559ef47fc9ad	2025-09-23	INGRESO	Venta #4598	29850	efectivo	c26ad814-d661-426f-905b-9e1d7db637c2	\N	caja_principal	\N
eb541a4a-7b32-4606-b542-698a94493cb5	2025-09-23	INGRESO	Venta #8870	18500	efectivo	\N	\N	caja_principal	\N
f9a2e4d8-28d0-4c76-85ec-6c554c7a80fe	2025-10-20	EGRESO	Frutas/Verduras: Champiñones	17600	efectivo	\N	9779b6ec-b4e1-46a5-830e-ce07f678f4e9	caja_principal	\N
51042fac-0c4b-43df-90bb-951c360fc842	2025-10-22	EGRESO	Papelería: Papel anotar 	5000	efectivo	\N	2e0f2e78-3d9b-4847-b177-2b744c783e72	caja_principal	\N
e81b1489-aa6a-4d56-8d4d-d48206b8a980	2025-10-23	EGRESO	Carnes: Tocineta	56000	efectivo	\N	b3498579-46dc-497b-8a4a-069da0e9a577	caja_principal	\N
291e7137-c627-4f60-bcc1-ae6eb01057a0	2025-10-24	EGRESO	Productos Limpieza: Crema limpiadora	5000	efectivo	\N	18b37243-a4e0-4047-8376-e1f35bf180e5	caja_principal	\N
f8eb86f3-1905-43f2-b0eb-7bf6067ec775	2025-10-24	EGRESO	Frutas/Verduras: Aceite	37900	efectivo	\N	6ab1a9ec-6a48-4662-b05b-6ddc26348d21	caja_principal	\N
3358d801-a807-4173-be93-890b8875426e	2025-10-24	EGRESO	Productos Limpieza: Jabon de loza 	4800	efectivo	\N	d5cf1b9b-42ea-4377-8b02-1d1aa5974d66	caja_principal	\N
b14061bb-ccfc-4362-8835-3c44b4e060f6	2025-09-23	INGRESO	Venta #3087	17100	efectivo	7535363c-d10d-4d35-abdc-4eae97bd274f	\N	caja_principal	\N
d9b77f83-7a85-47c7-8563-a6cbc2802803	2025-09-23	INGRESO	Venta #5304	5500	efectivo	\N	\N	caja_principal	\N
b9937c7b-5a77-49f1-b0f9-aca6ce65d970	2025-09-23	INGRESO	Venta #4795	16000	efectivo	75f77883-a796-4df2-9bd8-d4bd423c0c1f	\N	caja_principal	\N
77aea1bf-9cc0-4a40-bc1e-fca35e8d525b	2025-09-23	INGRESO	Venta #6262	14850	efectivo	00778b23-695c-48f2-92ab-b3742b61b855	\N	caja_principal	\N
7b029927-ccef-473d-8436-fe103e5362cd	2025-09-23	INGRESO	Venta #7020	24500	efectivo	32369dfb-eef0-4209-9ced-9e6b6f1e381e	\N	caja_principal	\N
0317761c-061b-4b1a-81af-87791d3373d6	2025-09-23	INGRESO	Venta #4479	41000	efectivo	6b96efb7-0e92-4bc4-87fe-0e95a4e561da	\N	caja_principal	\N
d74e6d7f-5db4-442b-a8d8-b664594d2671	2025-09-23	INGRESO	Venta #6564	15000	efectivo	1ca8ba41-cc65-425c-b4f1-3ddae293522d	\N	caja_principal	\N
4d0f9713-3c0e-48f6-8555-cb92a3bdc818	2025-09-23	EGRESO	Ingredientes: Aguacates	12000	efectivo	\N	b9a97ba9-60c1-4898-bdfb-22f1b4da4446	caja_principal	\N
623d30db-c00f-4b4b-a4bc-5daacc773956	2025-09-23	INGRESO	Venta #8914	21000	efectivo	c84e0bb3-b3d4-478b-b76f-b27a105878ba	\N	caja_principal	\N
54d51133-a595-4031-8d81-d8243bbefa39	2025-09-23	INGRESO	Venta #8011	38500	efectivo	6d5ced47-a91b-4990-963f-0fd31d3fe824	\N	caja_principal	\N
2cb663f9-9d81-4992-b12a-2e16c4db8d68	2025-09-23	EGRESO	Ingredientes: tocino	56000	efectivo	\N	5f05c3e1-2cf2-4808-bc86-946cf5917809	caja_principal	\N
c35db7e5-ad16-47ec-90f2-ff4476777575	2025-09-23	EGRESO	Ingredientes: kiwi	11500	efectivo	\N	da87fdde-20a3-427f-83e6-df461b56e6dc	caja_principal	\N
e33bef64-e8a3-451a-83f1-61ac803a96eb	2025-09-23	INGRESO	Venta #3713	4000	efectivo	\N	\N	caja_principal	\N
12cd6e0f-ac04-47e1-8f9b-4a521d671c9a	2025-09-23	INGRESO	Venta #9692	8000	efectivo	4dcdbf9e-9136-491c-986f-401f60bdaf58	\N	caja_principal	\N
90a7d199-a7f2-4f28-8fcd-7331757348ac	2025-09-23	INGRESO	Venta #2356	54000	efectivo	64fa9dbc-f255-415a-b34f-a27d3332157b	\N	caja_principal	\N
aa44c814-00c1-4265-a1dc-13fd5b80bf57	2025-09-23	INGRESO	Venta #1849	11000	efectivo	dea8fbf9-2118-4343-ac86-f71661501468	\N	caja_principal	\N
c08ce32f-97f7-44ec-93db-b8044e9a522b	2025-09-23	INGRESO	Venta #4686	11500	efectivo	eeff4778-0520-48ff-8e11-55787643ec39	\N	caja_principal	\N
7de87cfc-ea6e-4254-8357-7e3d4303e8dd	2025-09-23	INGRESO	Venta #9129	20000	efectivo	003acb1f-0db0-40e0-83e4-e23529ff6a60	\N	caja_principal	\N
51b66d0a-0852-4bfa-9da3-86378019be55	2025-09-23	INGRESO	Venta #1768	14000	efectivo	07fdd121-94d2-43e8-b856-44e10ae325a8	\N	caja_principal	\N
012c67e1-447f-42ee-9fd1-31b5e92a83cb	2025-09-23	EGRESO	Ingredientes: leche andi	24900	efectivo	\N	729fd5d2-8d73-4035-8237-0e6de80f91e8	caja_principal	\N
5ccd6d7d-871e-4a50-90dd-3d704053257b	2025-09-24	INGRESO	Venta #7139	54500	efectivo	cee5fc2e-f3c2-4cc1-afd8-686b6d303a7c	\N	caja_principal	\N
836a3a18-1b9a-4b5b-8d53-06d2ce507433	2025-09-24	INGRESO	Venta #2120	23500	efectivo	d2c2ebe9-f796-4351-9134-5b03641020e9	\N	caja_principal	\N
23fc5af4-8a81-4d04-9e2b-574b9e50bd85	2025-09-23	INGRESO	Venta #2189	28000	efectivo	\N	\N	caja_principal	\N
50809f24-95a4-4ebe-92e6-1a70af39a0b6	2025-09-23	EGRESO	Ingredientes: Quajada	12000	efectivo	\N	9ac3936a-d9e1-4e86-9bee-ef53da1dfe82	caja_principal	\N
0e372966-4747-4c93-a3d8-9554b94d4b1d	2025-09-23	EGRESO	Ingredientes: Cilantro	1000	efectivo	\N	1f5ecb57-fa8c-4c33-9df3-bbdd20b6cd27	caja_principal	\N
6d6acd03-e442-4e33-a060-128b5397f7ba	2025-09-24	INGRESO	Venta #5916	40000	efectivo	bc32d274-8c58-4591-8669-e76fa7b6a1f7	\N	caja_principal	\N
c5643ba8-b706-4408-9efc-15387f789ad6	2025-09-24	INGRESO	Venta #2960	40500	efectivo	\N	\N	caja_principal	\N
f1f7d2a2-9fa4-4857-9ba2-5298df840566	2025-09-24	INGRESO	Venta #3343	69500	efectivo	\N	\N	caja_principal	\N
694ebd92-1b27-453a-a201-38c3e2c34da4	2025-09-24	INGRESO	Venta #8991	69500	efectivo	cb353b71-1ebb-4704-88e2-e1bc53cbe1cb	\N	caja_principal	\N
c12e3ced-7cea-4bcf-b2d3-1d3bc8919d69	2025-09-24	INGRESO	Venta #5584	8000	efectivo	311ae63b-e7c6-4022-98ff-f059b7255029	\N	caja_principal	\N
15d9adee-4281-48c9-a851-0f6bc92857b7	2025-09-24	INGRESO	Venta #7104	67500	efectivo	1e035429-2e7a-47d0-8bbc-73bf2a403e23	\N	caja_principal	\N
b3de1031-f444-44a3-92a2-384164204123	2025-09-24	INGRESO	Venta #3840	76000	efectivo	25cecc96-c8e5-4e72-a78c-58fc76f1230e	\N	caja_principal	\N
28d11a6a-0fee-43ef-b830-263f395a093a	2025-09-24	INGRESO	Venta #4928	76000	efectivo	\N	\N	caja_principal	\N
0193e9a7-f935-4a92-beba-0245bafd3bb9	2025-09-24	INGRESO	Venta #9775	27500	efectivo	7022e0a3-2a51-4cb6-beb7-4e6587e0eb9d	\N	caja_principal	\N
9903f921-c1b4-4b81-bd02-13cdfe18bc2a	2025-09-24	INGRESO	Venta #7702	14500	efectivo	\N	\N	caja_principal	\N
b8364e9b-b492-49cf-bcd5-7786eb1d4f05	2025-09-24	EGRESO	Ingredientes: Pan Sandwich	19600	efectivo	\N	3927a6f7-c003-49af-bfe4-19f537b10f2e	caja_principal	\N
6eb4d040-5f1f-4b03-b006-2c4616cab884	2025-09-24	EGRESO	Ingredientes: Aguacate	12000	efectivo	\N	b960b12c-e282-4469-9a47-64dc29f813ec	caja_principal	\N
833122a5-33aa-4665-b6ef-2375ae4298da	2025-09-24	EGRESO	Ingredientes: Champiñones, Limón Taití	26600	nequi	\N	1e81aa05-d1c8-478e-a033-d75529542c08	caja_principal	\N
a22224cc-6a03-49b2-8913-5447031b3c40	2025-09-24	EGRESO	Ingredientes: Quesillo	12000	nequi	\N	a7a967dc-07d8-401e-baaf-7ed1aa9ada65	caja_principal	\N
9d089b86-6c5c-45e4-9c5e-40183d6500f6	2025-09-24	INGRESO	Venta #6691	29000	efectivo	611df515-c40a-46aa-b953-d1c79416902f	\N	caja_principal	\N
492e0472-7966-464b-a139-321d0b6ca39a	2025-09-24	EGRESO	Ingredientes: Champiñones	17600	efectivo	\N	1d5e34ad-9dce-4ebd-887d-2e519e5bb99a	caja_principal	\N
17014397-3967-45df-bc52-9f6c673817ea	2025-09-24	EGRESO	Salarios: PRESTAMO BELEN	60000	efectivo	\N	8091d6bc-85c8-481c-b646-4c888d050415	caja_principal	\N
a614f94f-a4ed-41f0-911e-f45c884c4fab	2025-09-24	INGRESO	Venta #9675	35000	efectivo	f86ca3e2-2fc5-4918-b3d1-78c2255ba587	\N	caja_principal	\N
760afb48-7629-446e-badf-58b54f96c487	2025-09-24	EGRESO	Ingredientes: Toalla Cocina	3600	efectivo	\N	4e2b6c5a-f72a-48b1-825f-fbde0061c282	caja_principal	\N
a9b71418-ccdf-48d8-a81a-cf1dd5ed2314	2025-09-24	EGRESO	Equipos: Servilletas	4500	efectivo	\N	cbe0a98e-aec8-4d57-9e96-de8d09a60318	caja_principal	\N
c4310732-32a2-4850-9458-fae6e8a12194	2025-09-24	EGRESO	Equipos: Desengrasante	6300	efectivo	\N	4236d432-643a-442a-9e08-2eb3c91bc998	caja_principal	\N
512efad4-f78d-4383-87f7-b50f92b67e1a	2025-09-24	EGRESO	Equipos: Aceite	12600	efectivo	\N	6b1e2490-4125-46a4-917f-56d548641bbd	caja_principal	\N
a9f754d3-817f-4932-a78a-aa9d7e04bcf6	2025-09-24	INGRESO	Venta #7843	16000	efectivo	625d0891-e934-4f39-b94a-5f83beb50503	\N	caja_principal	\N
25216943-7650-44b7-832f-fedb4973e416	2025-09-24	INGRESO	Venta #2484	33500	efectivo	\N	\N	caja_principal	\N
ce899b71-af2b-4917-8c69-c047f2f8484c	2025-09-24	INGRESO	Venta #1612	17000	efectivo	f14569f9-5d32-49bd-a92e-53da5226951a	\N	caja_principal	\N
959d8c07-a21b-4584-92e6-b994af879e6d	2025-09-24	INGRESO	Venta #7086	48500	efectivo	93b9a4a6-52d6-4729-ab9e-c058cf38e2d2	\N	caja_principal	\N
95461af7-e5a8-449e-b14f-3f818b1a7da7	2025-09-24	INGRESO	Venta #4312	14500	efectivo	\N	\N	caja_principal	\N
43f41770-1437-4803-a0ad-50d37e357fcc	2025-09-24	INGRESO	Venta #3131	20000	efectivo	6e341b21-50c3-43fc-a256-d21a50eb6f7a	\N	caja_principal	\N
84c2345c-bb8b-4a63-8ca0-dfa54648c217	2025-09-24	EGRESO	Transporte: Domicilio	6000	efectivo	\N	7534af85-7297-4a68-8412-765381d91c52	caja_principal	\N
4594d67e-e72a-49ef-bb4b-a9a6ddc94d8f	2025-09-24	EGRESO	Ingredientes: Queso Crema	13200	efectivo	\N	46d89c96-3208-413a-8247-4f6e96d25016	caja_principal	\N
556b1493-c566-4e21-b390-8dd8a5dac01b	2025-09-24	INGRESO	Venta #1999	4500	efectivo	db7fd491-754a-4b36-aed2-c7a6dafd4b9b	\N	caja_principal	\N
bc211df6-fde8-4d8e-90ec-00f15e94f465	2025-09-24	INGRESO	Venta #4029	15000	efectivo	86cd8216-cc20-44ca-9fd2-fff78e8bbb9a	\N	caja_principal	\N
a0a89ce7-643d-477a-ae4f-05d691cdbfe2	2025-09-24	INGRESO	Venta #7905	21150	efectivo	0ef7b910-3764-4969-8787-6557dc8e0162	\N	caja_principal	\N
c039f91e-2c55-499c-aab4-ac2eef209081	2025-09-24	INGRESO	Venta #7191	47500	efectivo	137155b2-2f48-46f2-ad0b-9d7517875112	\N	caja_principal	\N
eef8d7df-1057-45ef-bf93-76305739c51d	2025-09-24	INGRESO	Venta #3817	18500	efectivo	abdb000c-7707-43ab-bff2-f11d298473b1	\N	caja_principal	\N
16e52c82-645a-4dd0-b4fc-a6f1bb2b219b	2025-09-24	INGRESO	Venta #6971	10500	efectivo	64609646-ea6b-48cb-ad69-6f9b570ca387	\N	caja_principal	\N
3f6ce7f1-2725-4f81-a760-1a299a941f98	2025-09-24	INGRESO	Venta #5524	60000	efectivo	02194b42-3755-4374-a2b7-f099a74381d6	\N	caja_principal	\N
1bca2a81-4065-40a5-b01b-2d7c209a8028	2025-09-24	INGRESO	Venta #1732	8000	efectivo	7655b835-6a78-4b29-bc57-1b80ceeab56e	\N	caja_principal	\N
bdf9d971-d010-430e-8c88-8f6baf0a045b	2025-09-24	INGRESO	Venta #2194	31000	efectivo	cad9ac26-00bf-479e-8805-56adbb11cd7e	\N	caja_principal	\N
53490284-3975-4ae7-a9f6-d7a41552760c	2025-09-24	INGRESO	Venta #6812	14000	efectivo	21872caf-7ab4-442c-a678-02fbe00879f9	\N	caja_principal	\N
5424d0c0-52bd-45c1-bac8-11ce4dddb40d	2025-09-24	INGRESO	Venta #8507	26500	efectivo	ce08628a-6482-492d-b876-0a6b1e4673e0	\N	caja_principal	\N
a4de54d3-ad5f-49d0-bde7-cb52c3bd9d5b	2025-09-24	EGRESO	Ingredientes: Carne	56000	efectivo	\N	71a698a0-ed2d-4ddd-86fa-b4e087c7eda3	caja_principal	\N
4354835d-9f33-42b4-966a-fe82aacf5485	2025-09-25	INGRESO	Venta #9978	15500	efectivo	7f8fb50e-b18d-4239-8663-6d9c3f553052	\N	caja_principal	\N
7cab83e6-791e-4fd2-8f0e-4f9f4a0a95b1	2025-09-25	INGRESO	Venta #4934	8000	efectivo	17ccdcf3-5e51-4d1f-8e43-f7f46dfb728f	\N	caja_principal	\N
1bc9ed56-93c3-4497-ab1a-186fa90cc4ef	2025-09-25	INGRESO	Venta #8906	10500	efectivo	40bb8986-bf67-46c2-8bbf-1696fce069dc	\N	caja_principal	\N
95ec1748-6e87-4cda-b1cd-b0f70791799b	2025-09-25	INGRESO	Venta #9469	4000	efectivo	0abc1107-2f6b-4924-979f-acb1c5a2ac39	\N	caja_principal	\N
bb32ee17-ae80-458a-bd21-db5cf4d3b036	2025-09-25	INGRESO	Venta #3254	22500	efectivo	39881f31-5bc0-4c79-8daf-95a1a220733e	\N	caja_principal	\N
70265efa-560c-4b63-8639-ff7a937ebd29	2025-09-25	EGRESO	Ingredientes: lacteos 	48500	efectivo	\N	21eae36a-9489-4253-ac0b-ac59cfd907b1	caja_principal	\N
9fed45a1-b904-4930-af1c-cda9056ebd61	2025-09-25	EGRESO	Ingredientes: frutas	31500	efectivo	\N	5925198c-5cd6-46a4-a4bd-1073ed51165e	caja_principal	\N
8398cad8-320d-4d45-90c7-b09c613a4479	2025-09-25	INGRESO	Venta #5398	53000	efectivo	62a18460-3c21-4aae-9c9a-85b55942e8cd	\N	caja_principal	\N
cf656d08-65c6-402d-8360-9f0636ec296f	2025-09-25	INGRESO	Venta #6803	30000	efectivo	bd456dd0-e17e-4027-8a48-42c8642bed5e	\N	caja_principal	\N
d6d0172e-260c-4bd2-9758-1d2547a28056	2025-09-25	INGRESO	Venta #9720	49000	efectivo	6a956be1-abcb-42ce-85cd-1f4737c9faa6	\N	caja_principal	\N
919b3000-f6fa-4342-aad9-067ac2f19958	2025-09-25	INGRESO	Venta #3490	61500	efectivo	8960b373-f72e-4801-8554-bb96e12fcbad	\N	caja_principal	\N
0cab3a20-f214-4c18-9412-43aab277ce86	2025-09-25	INGRESO	Venta #2872	15000	efectivo	4a798f19-a186-4806-8cd9-d7e21a5ac611	\N	caja_principal	\N
d36094db-e490-49aa-a9dc-9f6af7cf68c5	2025-09-25	INGRESO	Venta #5579	15500	efectivo	8b28c63b-b7a2-4ffe-85d3-0ffdda92c425	\N	caja_principal	\N
316b975f-5be5-4d14-93f4-6cb92f875dd4	2025-09-25	INGRESO	Venta #7196	20000	efectivo	d2f08b77-b59c-4747-b618-80922eb9595b	\N	caja_principal	\N
7ed6036a-5d34-4514-830a-b44bffe6aed2	2025-09-25	INGRESO	Venta #8944	8000	efectivo	752926a2-263a-4df1-8020-9ad62a38612f	\N	caja_principal	\N
1dfcb79e-b2ec-496a-aa55-47293e94899d	2025-09-25	INGRESO	Venta #7291	8000	efectivo	\N	\N	caja_principal	\N
be1ee401-1899-44a3-bde8-16e4215aa2e6	2025-09-25	INGRESO	Venta #1473	8000	efectivo	59f3531f-f178-4f8d-812c-1e873ef0d5cf	\N	caja_principal	\N
0fde8dde-c08d-4756-a25f-7d615756a224	2025-09-25	INGRESO	Venta #6912	8000	efectivo	5171d0d9-51cf-4a66-928c-28260ade997b	\N	caja_principal	\N
76148b2d-aefa-43f4-b9ef-bd23688e6f38	2025-09-25	INGRESO	Venta #6846	49000	efectivo	88a07553-c5e5-4433-97c2-e1f9ac5d204f	\N	caja_principal	\N
a93aabab-1a5a-4e72-afb9-2eff9e652aaf	2025-09-25	EGRESO	Ingredientes: coco rallado	8500	efectivo	\N	59370c05-e520-4f30-85db-a67fc040a3ab	caja_principal	\N
fa7632a4-2065-42e9-940f-96d5edfb58cd	2025-09-25	EGRESO	Ingredientes: tocino 	56000	efectivo	\N	40a1c3d3-f7c2-463d-8e59-3a9486f8f788	caja_principal	\N
edda495b-aff1-4d9a-921c-e369d09bed09	2025-09-25	EGRESO	Ingredientes: chips de vege	21000	efectivo	\N	f3db0e55-18fd-43b6-8055-bb6399070601	caja_principal	\N
64299228-518c-4a49-ac7c-3e38585fd285	2025-09-25	INGRESO	Venta #2766	24000	efectivo	225062c4-12c9-497a-8240-bdf580b7d4ab	\N	caja_principal	\N
e4705c04-1460-47a3-a936-ee0b1a5f2aa8	2025-09-25	INGRESO	Venta #8639	44500	efectivo	d91aa98a-666c-49f6-8201-007f30fb283a	\N	caja_principal	\N
ada6a22d-6455-40cd-ba13-edd88ce448ed	2025-09-25	INGRESO	Venta #6625	2500	efectivo	\N	\N	caja_principal	\N
00cda2f9-75c7-422b-9f4a-9f80dd05f888	2025-09-25	INGRESO	Venta #7768	11000	efectivo	bcc0a152-00b3-40fd-ab14-e511365a7573	\N	caja_principal	\N
08e4644e-3419-4056-b298-bace4d929706	2025-09-25	EGRESO	Ingredientes: carnes	310700	efectivo	\N	9898a360-4a61-4042-a0c3-77d37d2fdd37	caja_principal	\N
76751bf3-dd64-4446-ac0a-40119d647deb	2025-09-25	EGRESO	Ingredientes: pastelería	364000	nequi	\N	3e338c8b-a400-4913-bdbb-4ec1726f23a1	caja_principal	\N
25de6a5f-72bc-443b-b900-c4740f846d13	2025-09-25	EGRESO	Servicios públicos: energía 	118600	nequi	\N	aa368303-a654-42d7-b6ed-ac19f1a43b0b	caja_principal	\N
ccc7d982-8030-49bf-849e-1a83880c444f	2025-09-25	EGRESO	Servicios públicos: agua	83500	nequi	\N	29c0f0f1-f1f0-435f-b30e-9d5d8a07eb14	caja_principal	\N
e363a052-bbb0-4bd4-9c88-cfe7dda515da	2025-09-21	EGRESO	Ingredientes: carnes 	235500	nequi	\N	61c25838-ef44-4458-a4ff-f257b509a636	caja_principal	\N
0f8b3b10-ed85-4606-9e5c-ed6fa5c36e56	2025-09-24	EGRESO	Servicios públicos: internet	77300	nequi	\N	564957bd-fc85-40bf-998b-99e8cc12db30	caja_principal	\N
1ca6b28e-abcc-4bd6-bd0f-ff97ddfc5a5a	2025-09-21	EGRESO	Salarios: Andres David devolver a Bri	371000	nequi	\N	b0949a81-d435-4216-9cb2-526d53af8ba0	caja_principal	\N
bb1f9921-136e-4ac2-98c0-2132d46b3d10	2025-09-25	INGRESO	Venta #6262	15000	efectivo	938c755c-ce35-4e70-945c-beb8b738caa5	\N	caja_principal	\N
132842f3-1e3b-4073-99d7-3022673697fa	2025-09-26	INGRESO	Venta #7630	4500	efectivo	75b049fd-9437-482e-98b5-bdee58ea9736	\N	caja_principal	\N
1d6ae9ac-920e-4804-96e9-e29c480047a8	2025-09-25	INGRESO	Venta #8407	14850	efectivo	\N	\N	caja_principal	\N
4eb97f72-1903-49d0-b9ae-11e7ef6d090a	2025-09-26	INGRESO	Venta #5262	14850	efectivo	3e60d411-6149-457b-a6bd-bf62b3efe5b9	\N	caja_principal	\N
c4519537-b1e7-4f47-a301-5ea8b68a8770	2025-09-26	INGRESO	Venta #5355	5500	efectivo	5922ba0d-9d78-465f-a4e6-5129e6eb5a8c	\N	caja_principal	\N
45890a91-77cf-4928-94e1-6dd37e7db674	2025-09-26	INGRESO	Venta #1324	70500	efectivo	\N	\N	caja_principal	\N
4ca4bfdd-69ed-4552-b4ac-1283c9c0584e	2025-09-26	INGRESO	Venta #9706	70500	efectivo	eca4d05d-183e-43c5-af90-5a7f8a000bb0	\N	caja_principal	\N
cde2a918-274f-461e-9bab-b0061b49653f	2025-09-26	INGRESO	Venta #2797	15000	efectivo	32a4b5da-dab6-4957-a8c3-b7652cf21b11	\N	caja_principal	\N
013d8528-9616-45ba-85ad-2ab1150e386e	2025-09-26	INGRESO	Venta #5746	1000	efectivo	7fa3054b-bd50-46cc-8d67-d9a85513f801	\N	caja_principal	\N
7ae59469-333d-41ec-a7a6-40a8029a0a7d	2025-09-26	INGRESO	Venta #9184	4500	efectivo	6a1de093-9ed0-405b-adb6-da2912cb2c4a	\N	caja_principal	\N
a2c789ac-693f-4fac-82f5-66a8d55cf677	2025-09-26	EGRESO	Ingredientes: champiñones	56000	efectivo	\N	85fb5b87-02fc-4deb-b4d2-9b5f471ded10	caja_principal	\N
7f3c9b06-9f29-4605-aea4-6aac24c54f08	2025-09-26	INGRESO	Venta #7331	18500	efectivo	bf0e1bad-f3b9-47d0-b4f6-c76c3a6db48b	\N	caja_principal	\N
b65bdd7d-232a-4e15-908f-bb6bfb2af28e	2025-09-26	EGRESO	Ingredientes: semillas de girasol	6000	efectivo	\N	537aa832-0c59-4ecd-a225-d5187da0967b	caja_principal	\N
9f63044f-9f09-49ae-bf18-3392d70eb436	2025-09-26	INGRESO	Venta #2505	16000	efectivo	bdf830c7-987a-461a-8451-8de8a48eb804	\N	caja_principal	\N
62c25045-4277-4b39-a2b7-178712bbeff0	2025-09-26	EGRESO	Otros: atomizador	6000	efectivo	\N	5670d8e9-e839-4c45-99c0-bbee4c023361	caja_principal	\N
869298ae-421b-4297-bd4e-83bddb0a43a3	2025-09-26	INGRESO	Venta #3023	45000	efectivo	19ddf036-cf1e-4e5b-aa22-575b61fd5d07	\N	caja_principal	\N
737ea3be-6a4c-44bd-8770-5402c58dcc7d	2025-09-26	EGRESO	Ingredientes: aguacate	30000	nequi	\N	3594fd5b-a896-4776-985b-0aa9ecd839d8	caja_principal	\N
c8b42f71-27b5-40df-8028-543d2d373b58	2025-09-26	INGRESO	Venta #1514	32000	efectivo	ac4f60b8-e38c-448b-b3ba-3367e9205963	\N	caja_principal	\N
d58153a8-1112-43e3-8df8-dcf5bf726438	2025-09-26	INGRESO	Venta #2753	34000	efectivo	2cd67630-cc8e-46f7-a0c7-7ae817e4d999	\N	caja_principal	\N
2b7329f4-c187-4bc5-816b-16dd29e11982	2025-09-26	INGRESO	Venta #2118	26000	efectivo	fd386411-5f43-401a-803c-062a135e7796	\N	caja_principal	\N
67cbd787-58be-4fea-8a01-85ab51a7ebd9	2025-09-26	INGRESO	Venta #1283	1000	efectivo	379dd81b-f12e-42b2-a05d-c8ea1f2e6b09	\N	caja_principal	\N
2e4f6b13-b3a9-4243-8b02-d9b95cae72fa	2025-09-26	INGRESO	Venta #7223	4000	efectivo	af800575-7c8f-43d8-8892-af4b2ef67f98	\N	caja_principal	\N
40a78acc-ce9b-455a-b929-3d93076edb8e	2025-09-26	INGRESO	Venta #3499	15000	efectivo	\N	\N	caja_principal	\N
3e71f54e-d180-4f06-8b4d-ab21a0c1ea75	2025-09-26	INGRESO	Venta #2541	15000	efectivo	c9c96e5f-702e-4be9-b984-9b95782cf82d	\N	caja_principal	\N
2d6added-a69e-44cc-add1-d15fb4385dbb	2025-09-26	EGRESO	Ingredientes: Bananos	4800	efectivo	\N	d77ef232-c5c8-4fa1-af23-57d4d896455a	caja_principal	\N
9b37ccd7-6866-439f-ae90-0209a4e091b1	2025-09-26	INGRESO	Venta #3118	15000	efectivo	a2c47dd5-d797-4244-8ee0-c902fa2b6ed9	\N	caja_principal	\N
65061cf0-c133-4b81-8e77-029449419926	2025-09-26	INGRESO	Venta #3593	10500	efectivo	393b94f0-50b8-4809-90a5-f558b3207b4c	\N	caja_principal	\N
b615c23a-228b-4f16-b1bd-9ec5451b5f38	2025-09-26	INGRESO	Venta #3378	21000	efectivo	50835f25-7aaa-4838-9e03-a0c2974fbe0f	\N	caja_principal	\N
894f93b4-308c-4949-8d69-ea94add1544c	2025-09-26	INGRESO	Venta #5848	31500	efectivo	c3eaf608-af3f-4779-a8d8-09a95531e3bf	\N	caja_principal	\N
0b0269c4-c5fe-4471-a5cd-7a6b699cc233	2025-09-26	INGRESO	Venta #9161	33500	efectivo	a55611c1-1b2b-490a-bf1e-55a1bf4814cb	\N	caja_principal	\N
1b1d0ad6-b061-497f-bb67-b1648b41a5a9	2025-09-26	INGRESO	Venta #9365	10000	efectivo	8a1d67aa-6d2f-4e4e-8f41-a1f6932cff60	\N	caja_principal	\N
0574a8f2-9b0f-469b-83d4-67904e5ca037	2025-09-26	INGRESO	Venta #8321	26000	efectivo	31dd0943-ee42-4452-89db-30a674a3a566	\N	caja_principal	\N
f8219979-907a-40f9-9df0-b2a68490efc8	2025-09-26	INGRESO	Venta #6335	23000	efectivo	699c3091-60f3-4ebd-9e7a-eae5761cf886	\N	caja_principal	\N
42bcd767-dc76-42e1-af85-a96e1bfd90bf	2025-09-26	INGRESO	Venta #9601	12500	efectivo	b1a3a135-4128-4da2-af1c-e30d7a5b2b38	\N	caja_principal	\N
1696eb73-a755-461f-b276-a69ff9c4d6eb	2025-09-26	INGRESO	Venta #8026	29500	efectivo	c3fc8389-3132-4ad8-b208-a0f1e24f1805	\N	caja_principal	\N
1a9c92c1-5ecb-4556-9d4c-a9ab2dc3b999	2025-09-26	INGRESO	Venta #6629	26500	efectivo	ffecc9b9-a793-4e81-b2f0-264ec27229e1	\N	caja_principal	\N
bbdbb003-942d-4d90-b12c-00ee52d777ba	2025-09-26	INGRESO	Venta #8948	41500	efectivo	79bc39d6-88d6-4aa3-8193-340423f2f90c	\N	caja_principal	\N
69d673a5-b432-44e3-9e0a-80b07a8ccbdd	2025-09-27	INGRESO	Venta #1273	18500	efectivo	f46c5e1d-9105-4e81-aaeb-b5aec4291c34	\N	caja_principal	\N
8bf17706-be8d-4989-a576-a91226bf954f	2025-09-27	INGRESO	Venta #5043	13500	efectivo	740dbcef-bbd0-4913-8028-931694ff4839	\N	caja_principal	\N
2d9bfd90-0f34-48ac-be05-b9041c45f9b1	2025-09-27	INGRESO	Venta #6998	9500	efectivo	0effebc6-07f6-4442-853b-687471a63aef	\N	caja_principal	\N
aa1d4ee9-6e10-455b-936a-829174f84572	2025-09-27	INGRESO	Venta #2919	14000	efectivo	3ef182d4-d4cf-46cb-b375-3738ac2e8f08	\N	caja_principal	\N
2ec1256d-edca-4e5e-ae62-120b4c6e00c7	2025-09-27	INGRESO	Venta #7887	10500	efectivo	a79f3aa9-fe31-4cd6-851d-4214af87b733	\N	caja_principal	\N
72da02bc-f4be-4392-b2ed-41e053eb467d	2025-09-27	EGRESO	Equipos: Guantes	2000	efectivo	\N	d24c6375-e447-473e-b6d9-2e0e019825fd	caja_principal	\N
179e398b-485a-4b57-9f92-c9e8015f7449	2025-09-27	INGRESO	Venta #2788	31500	efectivo	4a9860a0-4f38-4b97-9c13-3de185de14d0	\N	caja_principal	\N
d4aca166-46d0-4e9c-b6c0-26edfd741dff	2025-09-27	INGRESO	Venta #3669	9500	efectivo	0d088a22-dae2-4606-b02e-831fb5095977	\N	caja_principal	\N
351731ac-cbf8-4aaf-8a80-5a60c0d4d312	2025-09-27	INGRESO	Venta #7120	22000	efectivo	4531779c-3b51-465e-b13b-da604123444b	\N	caja_principal	\N
6dee62e4-d66e-473c-a270-07910f5f91d7	2025-09-27	INGRESO	Venta #5294	19000	efectivo	61ebd998-1fbe-4382-b2b4-bad5bbe8c122	\N	caja_principal	\N
52827768-80e1-41c9-8979-814b2442067c	2025-09-27	INGRESO	Venta #5150	30000	efectivo	cbb64822-2388-4f5c-83c3-094d9458b14f	\N	caja_principal	\N
7decc50c-3fba-42bd-a7b7-4e21a966349f	2025-09-27	INGRESO	Venta #9813	15000	efectivo	2c3c4da6-4e94-4591-abd8-dfd018f45bb0	\N	caja_principal	\N
98906510-bf14-43a6-9e48-f8269c6ef312	2025-09-27	INGRESO	Venta #4484	47500	efectivo	7778d92c-20cf-475a-97d4-60282845ac1f	\N	caja_principal	\N
08bd9771-ea1f-4251-90e4-b5878c0f07bd	2025-09-27	INGRESO	Venta #8504	37500	efectivo	8c5e7c78-3cb9-44fa-bbd0-bf7ff1317a4f	\N	caja_principal	\N
6c84df08-bb2f-40ef-aff4-c125672dd654	2025-09-27	INGRESO	Venta #9453	15000	efectivo	2f4c1c0f-17fe-477c-bd3f-e88d15807699	\N	caja_principal	\N
bfc4e897-511c-4d55-9437-4f207281c518	2025-09-27	INGRESO	Venta #4008	15000	efectivo	f56d9d47-36a3-47f0-b889-190a744ad7b2	\N	caja_principal	\N
50d38283-5ac1-4dc2-9059-09eb3b0af2c7	2025-09-27	INGRESO	Venta #3474	15000	efectivo	a2aac2b1-c407-48d7-8073-fea7d0528b14	\N	caja_principal	\N
14ff3dbf-8705-4eca-b33c-fb83e2d6a395	2025-09-29	INGRESO	Venta #8780	2000	efectivo	f65a580d-f2d9-47ad-807a-5350b844aa8e	\N	caja_principal	\N
233acef3-c78b-41e0-b4f2-a3828f1b879a	2025-10-20	EGRESO	Lacteos: Quesillo	12000	efectivo	\N	c71dbb16-8bec-4d6d-a316-7200b0cef1ec	caja_principal	\N
85a0531f-8134-41e1-9ef7-4ca23c669a32	2025-10-22	EGRESO	Frutas/Verduras: Fresas	15000	efectivo	\N	3b190735-38c2-4b43-8d7d-81987b4b909e	caja_principal	\N
a91d4a4a-1563-43e6-95d3-badd6b987553	2025-10-23	EGRESO	Transporte: Domicilio	6500	efectivo	\N	fd6a3df9-6eae-45a5-8c50-d9d16789aeba	caja_principal	\N
c85fde88-0e1f-4f4a-8951-e0033ad548cb	2025-09-29	INGRESO	Venta #9460	6000	efectivo	84a96e20-cade-4099-82fc-b3a81f59338e	\N	caja_principal	\N
ea165bee-6956-4e5b-ba00-ee059ef17f90	2025-09-29	INGRESO	Venta #1902	20000	efectivo	\N	\N	caja_principal	\N
eb7fa38b-ce51-4471-befc-d4ff26110b15	2025-09-29	INGRESO	Venta #9996	20000	efectivo	b95938f5-d891-4243-970c-124705c5637c	\N	caja_principal	\N
25e202c9-ff4e-49e3-9af3-e14b6ff6a834	2025-09-29	EGRESO	Equipos: Bambas	500	efectivo	\N	504e4ab2-b7f1-432c-b7ef-713757fda634	caja_principal	\N
36bb9833-442e-4bb7-8081-4f2e1d473fe2	2025-09-29	EGRESO	Ingredientes: Matcha	20000	efectivo	\N	7fd5cb22-1b5e-466c-84b3-2d32319faae0	caja_principal	\N
2e1c427e-e66e-4bc8-b02b-edc22604e534	2025-09-29	EGRESO	Ingredientes: Aguacates	10000	efectivo	\N	eb1c9a77-8977-446a-b5dc-ee5e97ec2a4e	caja_principal	\N
233d3168-6b9f-43bd-af09-44e3850bcf20	2025-09-29	INGRESO	Venta #8018	11000	efectivo	91704602-0a09-4ff5-bb99-501f9161bd3a	\N	caja_principal	\N
d6c0cf26-3827-42dd-a218-d603aaa20440	2025-09-29	INGRESO	Venta #5311	38100	efectivo	90fc67d5-699d-4607-9000-76309dbb73e5	\N	caja_principal	\N
f6480c1e-374b-4027-9212-21f06bb201c7	2025-09-29	INGRESO	Venta #9773	15000	efectivo	2171f7f9-f1fd-4b83-8b11-adb19cd7f7ee	\N	caja_principal	\N
1300fb16-81c1-45bc-b02a-367c475f929a	2025-09-29	INGRESO	Venta #6902	15000	efectivo	4e87192e-804f-4ec5-8034-76886d92810d	\N	caja_principal	\N
93d3e60f-8578-4b43-9f77-2fcdb8a75cce	2025-09-29	EGRESO	Ingredientes: Leche	68800	efectivo	\N	fc0f6907-c47e-4feb-ab70-c9cfd65aafa0	caja_principal	\N
1a43fa64-9ebd-41b8-ac81-f36273ed730c	2025-09-29	INGRESO	Venta #9056	15000	efectivo	5a362269-ce7c-4822-b901-2902f577b450	\N	caja_principal	\N
daa4db3d-5895-4dfc-b1a1-39d9d3c6cdc7	2025-09-29	INGRESO	Venta #1772	15000	efectivo	\N	\N	caja_principal	\N
77ca4bf4-3b7c-4de9-a6d1-4a76f9be0241	2025-09-29	INGRESO	Venta #7193	40000	efectivo	\N	\N	caja_principal	\N
b34dc7f8-f54b-4dda-9fb4-f68369a94e09	2025-09-29	INGRESO	Venta #3165	15000	efectivo	9dc0af81-1471-46c3-b1f8-a8d9e23c50fb	\N	caja_principal	\N
52a818a3-ef76-403e-8875-0ac42015f865	2025-09-29	INGRESO	Venta #1316	49500	efectivo	1845e715-ec34-41ef-a919-292bab911d24	\N	caja_principal	\N
ae085337-b493-4dd8-b4c3-430f3afe1753	2025-09-29	INGRESO	Venta #6492	15000	efectivo	7ffb487b-e602-4633-af0d-8cd14eac6dc2	\N	caja_principal	\N
65504cf5-f0d8-4b35-a17f-b042cee25657	2025-09-29	INGRESO	Venta #4942	2500	efectivo	\N	\N	caja_principal	\N
260ab340-458e-4c90-bd63-f7d54730c802	2025-09-29	INGRESO	Venta #2521	14500	efectivo	\N	\N	caja_principal	\N
d259b589-babf-4f39-bc6d-4b8063995295	2025-09-29	INGRESO	Venta #3213	14500	efectivo	\N	\N	caja_principal	\N
c9d6795f-a9cb-4a58-8552-82b2f42487a9	2025-09-29	INGRESO	Venta #6004	14500	efectivo	\N	\N	caja_principal	\N
81c97ff0-2cc0-4bd3-ac7b-e6b428cd330a	2025-09-29	INGRESO	Venta #8436	14500	efectivo	\N	\N	caja_principal	\N
fed54b7e-4121-4939-a663-257140534630	2025-09-29	INGRESO	Venta #6485	15000	efectivo	e5dc709c-ec25-496d-ab33-eb7eb086d85b	\N	caja_principal	\N
31536262-9481-4d45-b847-c41354d7ebdb	2025-09-29	INGRESO	Venta #3224	15000	efectivo	b3772ec1-dee9-45cf-bb2d-6456a5a89ad6	\N	caja_principal	\N
27ccb208-996f-4805-8086-14032b79791b	2025-09-29	EGRESO	Ingredientes: Quesillo	12000	efectivo	\N	80edfe2f-a564-4f29-9d35-acfeed6a8828	caja_principal	\N
ae114680-7b54-444b-b220-4d83c09c1633	2025-09-29	EGRESO	Ingredientes: Romero	1000	efectivo	\N	9e4d2ab0-a3a0-4e79-be4a-0890c5860515	caja_principal	\N
f5345841-6af0-4aa8-a3d6-0d99ef20fef8	2025-09-29	EGRESO	Ingredientes: panes	48000	efectivo	\N	9e861a48-3e9c-4ebe-8d26-a1410978c9ed	caja_principal	\N
2f344bf7-47de-4b50-ac0a-d16534fbe876	2025-09-29	INGRESO	Venta #7915	17500	efectivo	02af5abc-6627-434c-aa51-1ee78142d007	\N	caja_principal	\N
8f536cc0-b523-44d4-937b-35faeea2b680	2025-09-29	INGRESO	Venta #7724	12000	efectivo	a10f76e1-3f8a-48c1-ab93-fa1884274c5d	\N	caja_principal	\N
777aa675-fcca-4808-baf8-5c416dc00f01	2025-09-29	INGRESO	Venta #5161	13000	efectivo	a20074fc-e85a-470e-a897-60900df5f9b5	\N	caja_principal	\N
143b7614-a9cf-432e-a630-de059f7109da	2025-09-29	EGRESO	Ingredientes: yogurt griego 16 briyith	32000	efectivo	\N	3a3ec5fe-351c-42e6-9168-c5fb32622e7b	caja_principal	\N
0aa9d533-ba38-4fd0-82ba-d18da27c0a22	2025-09-29	EGRESO	Salarios: Abono Belen 	54000	efectivo	\N	6dc3b77c-1977-4ef8-81b5-d51f8100bcb8	caja_principal	\N
3265a56e-4692-4752-8987-57accd2ceb3c	2025-09-30	INGRESO	Venta #5642	4500	efectivo	d0d61f26-ed3c-41ad-8410-b96f1c8078a1	\N	caja_principal	\N
c89522e0-2427-4f9f-80e5-756fbb628ffd	2025-09-29	EGRESO	Ingredientes: carnes Belen	116000	efectivo	\N	2086c40e-df64-4f6a-8726-9037280b8db1	caja_principal	\N
09cf35b2-8b81-4e21-b45c-612eec694324	2025-09-30	INGRESO	Venta #8464	14000	efectivo	0c3a4f67-5c4a-4c38-a696-5d7f1ab777ec	\N	caja_principal	\N
e563144a-5a53-4404-8ca6-57663c300529	2025-09-30	INGRESO	Venta #8461	59500	efectivo	7e2da855-7198-4cfc-b243-054659e9488e	\N	caja_principal	\N
fb682c34-98f1-4083-86b0-92763eecfc05	2025-09-30	INGRESO	Venta #9152	14500	efectivo	\N	\N	caja_principal	\N
5eb466e1-3778-4cd2-a5f6-fc16b3d69c5b	2025-09-30	INGRESO	Venta #1384	34000	efectivo	8298a070-12b7-426f-ac9f-45e2d6a57824	\N	caja_principal	\N
431b4225-7e6f-4b6f-9da6-d1e72aa72f15	2025-09-30	INGRESO	Venta #2425	4500	efectivo	692231e5-77f7-4489-b3bd-10e0b43d6f24	\N	caja_principal	\N
45c68600-4508-48e9-898a-da0cbe3173e4	2025-09-30	INGRESO	Venta #7220	10500	efectivo	852b5297-d297-4510-b255-96c2a8c9563e	\N	caja_principal	\N
5009d731-5fcb-4606-911e-e8608ba30687	2025-09-30	INGRESO	Venta #2670	29000	efectivo	ebc4a867-f3b4-4117-9936-6900208864f1	\N	caja_principal	\N
de9c1b36-30d1-445c-8abf-7689e7f57482	2025-09-30	INGRESO	Venta #8848	14000	efectivo	31a755e6-2467-4ba8-9a97-ae50ede85ddc	\N	caja_principal	\N
3f5c0703-4b4d-4f35-aab8-f67858bc0680	2025-09-30	INGRESO	Venta #7135	11000	efectivo	5c1ec0c3-6782-4a78-afcc-a15a6312ee44	\N	caja_principal	\N
b89739d3-51e4-4d13-bfbb-e60286d3c4a2	2025-09-30	EGRESO	Equipos: Esponjas	12900	efectivo	\N	716e8392-3cbe-41c3-9865-5d9cdedd343d	caja_principal	\N
bfa11b03-4721-430c-88af-17973c6cbd7b	2025-09-30	EGRESO	Equipos: Sarten Inducción	199000	nequi	\N	1fbfb477-6fe1-4c17-8b71-2f49447e7b4c	caja_principal	\N
15bd5706-3a81-44e9-8855-84c78beb1d3a	2025-09-30	EGRESO	Ingredientes: Datiles	7900	efectivo	\N	5818a5a7-342d-4a96-8a75-39290bf470a8	caja_principal	\N
5941a837-33a3-414d-a352-e13fd558ff91	2025-09-30	EGRESO	Ingredientes: Pasta	7300	efectivo	\N	7a0bb736-8281-4f06-97b1-499c512e3e00	caja_principal	\N
06d49857-e327-483a-b4c4-2c871238ccc0	2025-09-30	INGRESO	Venta #1141	30000	efectivo	6a18e10b-a5d3-43ac-abe1-b29c3a372048	\N	caja_principal	\N
898df5bc-262d-424d-ae48-742e61d1874b	2025-09-30	INGRESO	Venta #5903	16650	efectivo	902fac33-16c9-4c02-b4ea-9f118bef5218	\N	caja_principal	\N
a2b34223-b374-46f4-abf2-b366b6d20ff8	2025-09-30	INGRESO	Venta #6418	30000	efectivo	26dd1b4e-bd4c-4d68-aaef-632cc1f0556f	\N	caja_principal	\N
a196f770-02f2-4288-8757-c5823bbd1aab	2025-09-30	INGRESO	Venta #1481	41750	efectivo	26b18556-6b80-44d4-8a96-45b816d41f6e	\N	caja_principal	\N
7bc108de-5b75-4793-80c1-c65a66128632	2025-09-30	INGRESO	Venta #3947	15000	efectivo	2cad9473-8a42-4a5b-bbd1-7925a84d2700	\N	caja_principal	\N
9e1b3f37-1e6b-462a-9ad4-9d80d29ae20e	2025-09-30	INGRESO	Venta #6123	10500	efectivo	54121bcd-7e68-4f0f-985c-caa1849182ba	\N	caja_principal	\N
046c2983-988c-4cb0-98ae-3e1973cda5c3	2025-09-30	INGRESO	Venta #3862	29500	efectivo	\N	\N	caja_principal	\N
4ee8efcd-8ecd-4be0-a0eb-28f5f1df668d	2025-09-30	INGRESO	Venta #4442	33500	efectivo	d9448d14-a177-48ff-b059-93c9c592771a	\N	caja_principal	\N
30b7177e-e540-4ca9-bf27-90b9e5a37019	2025-09-30	EGRESO	Ingredientes: Sandia	8000	efectivo	\N	f341aa20-376a-4963-9e33-cf47e2aad3e0	caja_principal	\N
b7e781c6-9098-45af-8b5a-1afb079ca362	2025-09-30	EGRESO	Ingredientes: Pepinos	6000	efectivo	\N	5aa509dc-1567-41d3-98db-12b945af5ad4	caja_principal	\N
fde26b39-8316-4685-a849-2de6ecf87690	2025-09-30	EGRESO	Ingredientes: Zanahorias	2000	efectivo	\N	ffd93d66-b0ef-412d-8bb0-c8aed04330ea	caja_principal	\N
890d84c4-e380-4aed-b253-a17c8c8c29c7	2025-09-30	EGRESO	Ingredientes: Bananos	3000	efectivo	\N	c75a6402-2f13-4228-95d5-6d5b9f0a21bd	caja_principal	\N
91f1e167-879c-4a84-9b50-e4fb0ef66082	2025-09-30	INGRESO	Venta #2715	11000	efectivo	4ce55b09-9571-4580-9c81-f5118309c47e	\N	caja_principal	\N
3fb57d1f-9259-4ad0-bb85-73db9591ca72	2025-09-30	INGRESO	Venta #6616	15000	efectivo	95609c92-8fde-4ef6-ab9c-67d4e6022ae0	\N	caja_principal	\N
cf04ba32-b30a-4ef4-a652-eb0a4c4f16ea	2025-09-30	INGRESO	Venta #1276	13000	efectivo	e42515f8-2c16-436e-ad0c-2ca8d5c253c9	\N	caja_principal	\N
3543bd0d-54ee-4d2f-ab5c-41bb2b6c6efd	2025-09-30	INGRESO	Venta #3234	6000	efectivo	5a844205-06a3-4285-bad7-7cb53dbc0bfe	\N	caja_principal	\N
1e0a1f5d-10a7-431e-ae16-e0dd672f99fd	2025-09-30	INGRESO	Venta #2201	32000	efectivo	11bee7cd-e6bd-4566-9dbb-66bcd20d4229	\N	caja_principal	\N
42eb5574-700e-4659-b22a-8654307837f1	2025-09-30	INGRESO	Venta #3705	46000	efectivo	8a3b24ca-a91a-44e4-ad94-b32a1eaa5be2	\N	caja_principal	\N
3be4df61-c0e9-4d6b-b091-56752d26ba6d	2025-09-30	INGRESO	Venta #3510	16650	efectivo	7413bd53-ad97-4fd6-a381-6df3834ed854	\N	caja_principal	\N
a0c7d59d-519e-48b1-a725-322ecbf42d23	2025-09-30	EGRESO	Transporte: domicilio carne	5000	efectivo	\N	6db8a875-8b34-4c08-b3a1-df3acb049c1b	caja_principal	\N
1298a201-85d7-485a-809e-1515f68ae561	2025-09-30	INGRESO	Venta #7464	23500	efectivo	e2ac12eb-dbf8-428d-86cb-25623fd85c93	\N	caja_principal	\N
4ed69fb7-308e-4452-abfe-8b6767d8c5c1	2025-09-30	INGRESO	Venta #1420	8000	efectivo	56a6dc5d-a5da-44f9-90c3-09d2362176cc	\N	caja_principal	\N
8dfd2edf-ffa6-465d-bcc0-1afd608dc4d0	2025-09-30	INGRESO	Venta #9164	15000	efectivo	\N	\N	caja_principal	\N
a080b070-5ccb-48bd-9e24-90be3de212e0	2025-10-20	EGRESO	Frutas/Verduras: Fruver	24300	efectivo	\N	370e49e9-b622-4956-bcb5-c32b31127561	caja_principal	\N
6c2293be-9c4c-46b3-bfec-9367279abaa7	2025-10-22	EGRESO	Transporte: domicilio	3000	efectivo	\N	5a467515-c9cd-4828-9f22-17423071b17d	caja_principal	\N
3fce93f2-be62-474a-9895-f589f966be18	2025-10-23	EGRESO	Frutas/Verduras: Fruver	9000	efectivo	\N	325985ee-008e-499b-97d0-a1d40a687562	caja_principal	\N
60dd8e19-d5f2-48b5-a31e-c91edfc9f731	2025-10-24	EGRESO	Frutas/Verduras: Fruver	14500	efectivo	\N	b1564097-79b4-4b26-9fa9-040a9ea38797	caja_principal	\N
015e84cf-5d6b-4661-83d8-ccb001221180	2025-10-24	EGRESO	Frutas/Verduras: Matcha	40000	efectivo	\N	39bb6a9c-9d4b-4d6f-9c6c-9a0ba8fc890c	caja_principal	\N
0a965016-08ed-4fc1-803f-9c3698cd9b42	2025-10-24	EGRESO	Frutas/Verduras: Fresas 	5000	efectivo	\N	94e1962c-2d93-4139-91f0-5920d93c7acb	caja_principal	\N
adc44c8f-1d6e-498c-855c-9ec636c025be	2025-11-03	EGRESO	Salarios: Pago Daniel	580000	efectivo	\N	315f0c13-e04b-49e7-9cc8-96953e6c5231	caja_principal	\N
64aa0cd2-dd05-4f59-a4e5-477b203364a5	2025-09-30	INGRESO	Venta #3096	8000	efectivo	a363c763-8698-4cf9-a397-31019c16c1ba	\N	caja_principal	\N
d7d5eeb6-6c81-4d80-9a5a-82047e67f450	2025-09-30	EGRESO	Ingredientes: aguacates	5000	efectivo	\N	c2166ac5-28ef-4823-98e4-6fb3387e1fb6	caja_principal	\N
e9ecc8e7-d717-4e6a-9590-99b9385731e9	2025-09-30	INGRESO	Venta #1086	56000	efectivo	df35a376-51e5-47d9-aadf-f2ffa9a8ddb5	\N	caja_principal	\N
f1752bd8-92ab-4d27-870e-0fba719a5f22	2025-09-30	EGRESO	Ingredientes: huevos	10000	efectivo	\N	0af4f833-ddf0-454b-a7c3-740789e97475	caja_principal	\N
e00e8e35-a7ce-4d3f-80fc-cf2cc421f80f	2025-09-30	EGRESO	Ingredientes: 378000	0	nequi	\N	f7b7bdc4-4a31-40ec-aea4-286ba870a6e4	caja_principal	\N
9cda65e2-cd7b-417d-af93-1789b0e3a340	2025-09-30	INGRESO	Venta #3609	34000	efectivo	d08b9e44-3645-4e0c-8b59-d34ac3b9966b	\N	caja_principal	\N
67c69d78-4ac5-4ac9-97e9-d0c922468b38	2025-09-30	INGRESO	Venta #1376	29000	efectivo	e681a677-61ba-45a3-8955-db19f49533e9	\N	caja_principal	\N
f0d2b1a3-ee24-48b5-9d9c-ffa5ff4f854f	2025-09-30	INGRESO	Venta #6115	15000	efectivo	4c8b954f-c40d-4e04-af52-af6e2c3b5e4f	\N	caja_principal	\N
c7c26214-44af-4f8b-bc3d-e7a98d639dbb	2025-09-30	EGRESO	Ingredientes: huevos	10000	efectivo	\N	\N	caja_principal	\N
2c108877-76a8-4a6f-9834-a499b19d1475	2025-09-30	EGRESO	Salarios: phi	20000	efectivo	\N	\N	caja_principal	\N
0fa9dd50-e68c-4553-a864-525a410250d6	2025-10-01	INGRESO	Venta #1182	43000	efectivo	194abf03-548f-479b-a7cc-3b935d0e39c6	\N	caja_principal	\N
81c7fdcf-27b2-4593-979c-c572cffe2784	2025-10-01	INGRESO	Venta #7657	62000	efectivo	7471c3f7-6b99-4d86-b242-ffa9b6471e04	\N	caja_principal	\N
77061871-bb33-4c2e-8bd8-c9faef441968	2025-10-01	INGRESO	Venta #1267	30000	efectivo	b48cac54-831c-4c03-af93-ba8e2e4a4196	\N	caja_principal	\N
49807a1d-bdc6-4767-8466-765741a6f2a0	2025-10-01	INGRESO	Venta #2480	38000	efectivo	4e05d997-957b-4228-bf4f-dd52586599c7	\N	caja_principal	\N
17b7d735-c0be-4625-bbb0-44b878ea91bb	2025-10-01	INGRESO	Venta #8678	46650	efectivo	6023ff83-959d-449c-9fe6-4216a8c71ba6	\N	caja_principal	\N
0b66d600-c301-4b64-a998-7618857baf47	2025-09-30	EGRESO	Salarios: Abono Belen	54000	efectivo	\N	2d57e4c5-b763-4123-a449-bd156f7c98bd	caja_principal	\N
6dfcbf7e-2a8b-4c99-812f-8065f9e808bf	2025-10-01	INGRESO	Venta #2140	31000	efectivo	ef588b19-e91f-46f4-bed2-907115ea5481	\N	caja_principal	\N
1fb1f88f-a458-4dc8-bbd1-f45bd70c2d75	2025-10-01	EGRESO	Ingredientes: chips	20900	efectivo	\N	9bf47e53-bf52-4fcf-942a-0d7de8f02b24	caja_principal	\N
db3edcfd-040a-4f4a-b677-ddf5d67f7dee	2025-10-01	EGRESO	Ingredientes: fruver	64300	efectivo	\N	77439bad-e108-4cba-901c-8cc99015f5be	caja_principal	\N
199737b8-f8b5-4ecd-8f1b-b89f1cd36e0d	2025-10-01	INGRESO	Venta #1443	45000	efectivo	293431ff-23ff-4392-8745-f4cd2897e691	\N	caja_principal	\N
f69b889f-62e7-4be8-b4da-86107a19f612	2025-10-01	INGRESO	Venta #3243	30000	efectivo	\N	\N	caja_principal	\N
9c9e4023-e32c-4679-82f6-9ba76286c790	2025-10-01	INGRESO	Venta #5508	30000	efectivo	27243e81-0567-4e2d-9860-56020bc3701e	\N	caja_principal	\N
f047f1d5-bdca-43d8-95aa-480d882abd48	2025-10-01	INGRESO	Venta #6264	24000	efectivo	c87a1b8b-77fa-4559-b07e-bf70bd6a1f48	\N	caja_principal	\N
1256f6cf-025f-4edd-920d-5779f1405654	2025-10-01	INGRESO	Venta #9645	29000	efectivo	878a38aa-f19a-4cae-adfa-4e584f331fc3	\N	caja_principal	\N
477f8c40-34a7-4465-ae74-ee8d65db55bf	2025-10-01	INGRESO	Venta #6728	15000	efectivo	caca36b8-a1a5-4231-89c1-e505ebce8327	\N	caja_principal	\N
9b06dafc-a5c6-4a06-a136-c266f45b5a22	2025-10-01	INGRESO	Venta #5284	18500	efectivo	\N	\N	caja_principal	\N
a3cc72ce-da74-4bd9-a0ba-b0d46662adc0	2025-10-01	INGRESO	Venta #6822	16650	efectivo	17dbc7e0-6098-47bb-b838-d3dccf3eef5d	\N	caja_principal	\N
5639bc25-8681-44df-887c-9f2dcfe994b6	2025-10-01	INGRESO	Venta #1340	15000	efectivo	6d28089b-4b53-40d6-b8fb-d7953e75dc1c	\N	caja_principal	\N
622b1026-4ddd-4151-baf9-7e6b84ebac6a	2025-10-01	INGRESO	Venta #9693	15000	efectivo	84e3780a-1408-414f-a3f9-8b697212dee8	\N	caja_principal	\N
dc8d2238-480f-483b-bb47-cd6d2ae9ad8f	2025-10-01	INGRESO	Venta #1961	15000	efectivo	8c0a6d5d-a44f-4e77-a58f-1ed3aa46e2f8	\N	caja_principal	\N
555f0789-04a4-4e08-86ab-2c9a32f37dcd	2025-10-01	INGRESO	Venta #6979	32500	efectivo	a9c4d9c3-9fd0-4a5d-a596-49391c8b6e97	\N	caja_principal	\N
094a5967-c78c-4876-844c-ea869eec77be	2025-10-01	EGRESO	Ingredientes: Maní Tostado	9000	efectivo	\N	f80e51e4-db19-4b14-9ac3-d964298ca5d5	caja_principal	\N
26af13bd-4b02-4196-a849-2d552403b303	2025-10-01	EGRESO	Ingredientes: Tomates	9000	efectivo	\N	aafbca94-1dc3-43af-afb9-8835f459cbdb	caja_principal	\N
9abac0a8-fd96-4609-acf6-8e3024e86d29	2025-10-01	INGRESO	Venta #9716	41500	efectivo	1e7903f4-5f1f-4014-900b-2aaf89e3335c	\N	caja_principal	\N
7721a98b-7d90-41b4-a8a9-4803434d7722	2025-10-01	INGRESO	Venta #2783	15000	efectivo	372c271f-a9f8-475c-a435-9ad38cfe8452	\N	caja_principal	\N
5bbbdebe-27d9-4093-9745-effe6d38f9da	2025-10-01	EGRESO	Ingredientes: Tocineta	56000	efectivo	\N	da675df9-c588-4b94-baae-afd97199cb32	caja_principal	\N
1c95e2b1-bb29-4b0c-a6d7-63eb4f3c00e5	2025-10-01	INGRESO	Venta #8519	19000	efectivo	74881c76-1128-42b6-b4b3-bef2d0b373fc	\N	caja_principal	\N
dae0f4f4-cfc0-4b98-9b9e-d46e5560bc88	2025-10-01	EGRESO	Ingredientes: Jamon de Cerdo	37000	efectivo	\N	d1663903-a062-46d6-bea5-1eb23b8e9238	caja_principal	\N
32d9a109-c855-4cc0-8017-ec966f2d5bbc	2025-10-01	EGRESO	Ingredientes: Mayonesa Verde	30800	efectivo	\N	e3e1a1d9-46be-422f-bf81-10e61f164647	caja_principal	\N
e749ec7d-6723-458c-b2c5-3052d5d40496	2025-10-01	INGRESO	Venta #2521	19000	efectivo	790f8f62-0524-48f1-8b39-4b75ad9b4dc4	\N	caja_principal	\N
e6ca49b7-8d81-4609-8bf5-b71cd613fc0b	2025-10-01	INGRESO	Venta #8304	21000	efectivo	84fd6b62-e81a-42c9-aba6-c7e4b7c346b9	\N	caja_principal	\N
17613db1-ad85-4283-b20e-b7d459dd4534	2025-10-01	INGRESO	Venta #3162	15000	efectivo	d93b26a7-a9a7-4d32-a8b3-2f10348eed3b	\N	caja_principal	\N
b45994bf-8702-4079-8ce6-ba8e647d5e0a	2025-10-01	INGRESO	Venta #9067	11000	efectivo	2b544ab7-4578-49c2-b9a1-e30b7cc74e9c	\N	caja_principal	\N
fe264cde-c1e3-42b7-bb2a-807ccaa76f7b	2025-10-01	INGRESO	Venta #2701	19000	efectivo	8375d937-7e14-4b3c-b288-b8662564ecd9	\N	caja_principal	\N
4e13a487-1595-41e5-b0f5-1f97d6321467	2025-10-01	INGRESO	Venta #1992	19000	efectivo	8841efbe-6ac4-432a-8942-eee5a39a9707	\N	caja_principal	\N
a0b5e696-8a7d-4e13-8cb2-f823f4199fa4	2025-10-01	INGRESO	Venta #7647	30000	efectivo	def5fbaa-aaa3-4dfb-bb85-fbf226d33742	\N	caja_principal	\N
bcbf925c-e0ea-422d-a910-39c5acebe547	2025-10-01	EGRESO	Mantenimiento: pilas	6000	efectivo	\N	20ddcf87-f0b9-4656-8ac7-42b986dfb076	caja_principal	\N
56b74ecb-44eb-4ff3-a95f-0f155a187a22	2025-10-01	INGRESO	Venta #8109	23500	efectivo	8ce8bca1-ae93-4cc9-bf25-ee50375c879a	\N	caja_principal	\N
820bf627-1566-45dc-9839-a7b334c7406a	2025-10-02	INGRESO	Venta #9932	21000	efectivo	cc9565d7-9aea-4646-adaf-57f47d028f27	\N	caja_principal	\N
c9d70993-e1c6-4a5d-9d71-15b66742140c	2025-10-01	INGRESO	Venta #5469	33000	efectivo	\N	\N	caja_principal	\N
451f2d1b-1ebd-4779-ad86-4e82576cabe0	2025-10-02	INGRESO	Venta #8611	31150	efectivo	5e6d7fc1-4fed-4b27-b375-448b3f377b94	\N	caja_principal	\N
bfcf34af-1b2d-4d66-8430-39ec4895ced7	2025-10-02	INGRESO	Venta #4535	42500	efectivo	4b370a21-06c8-4866-a723-c5d3e26f984f	\N	caja_principal	\N
45a961e6-e2b0-459a-9d05-30bbfe167159	2025-10-02	EGRESO	Equipos: Notas	4000	efectivo	\N	16c2594f-ad1f-4149-8661-16e320da6c6d	caja_principal	\N
615f5e04-a4ee-481d-9150-8d4a5237ef3e	2025-10-02	INGRESO	Venta #4446	14500	efectivo	9c6f9d35-e162-424e-9ad4-f7f82a85091c	\N	caja_principal	\N
d58c8e5c-c6bd-42f8-8d7a-0e62c94021e6	2025-10-02	INGRESO	Venta #8507	14500	efectivo	eee81f51-c7e3-449d-94d9-f1a8eac8d7c5	\N	caja_principal	\N
92a09558-539a-426a-805c-1cf626ffe5b9	2025-10-02	INGRESO	Venta #1314	4500	efectivo	53f3db87-88a3-46f1-86eb-ce772d633522	\N	caja_principal	\N
66dd36af-dfd4-4c78-9b4d-9a78de5869b2	2025-10-02	INGRESO	Venta #7604	8500	efectivo	b768eee7-05f8-4d6b-8354-2467dce62a33	\N	caja_principal	\N
bff40b66-4237-4c18-9702-b1282ee43baf	2025-10-02	INGRESO	Venta #1855	31500	efectivo	3947d778-450a-46ba-ab24-e479d68f153a	\N	caja_principal	\N
e560ed6f-7c93-4aaa-9b85-3391659e6dc6	2025-10-02	INGRESO	Venta #2542	20500	efectivo	2526a849-2df8-45f4-8759-fcc9fccc5879	\N	caja_principal	\N
4ca25961-2549-484e-8372-3361dc69e347	2025-10-02	INGRESO	Venta #6287	45300	efectivo	27205744-eba1-47ca-8ccf-53bbece06870	\N	caja_principal	\N
b8124559-9a91-48a9-b8ff-dcd413ef8a20	2025-10-02	INGRESO	Venta #7341	8000	efectivo	80af7c80-e1a5-41d6-854f-89c30d7370b0	\N	caja_principal	\N
8b2d99af-3cf9-4ae7-b3cd-e8d8de779856	2025-10-02	INGRESO	Venta #4598	16000	efectivo	effe1e6c-0162-44da-8c7f-3ee141684312	\N	caja_principal	\N
5848ad18-9adf-4598-b00a-2866ad9f3ded	2025-10-02	INGRESO	Venta #1065	30000	efectivo	9279c262-1011-4f28-833b-f2d622f84b96	\N	caja_principal	\N
c4477ce1-1e6c-4c5a-b086-5b1cbddd61a1	2025-10-02	INGRESO	Venta #8118	30000	efectivo	aa2ab64d-4ae1-43f0-9fd2-6c2fe9b7b81e	\N	caja_principal	\N
298d3b0d-1da8-4968-8ee3-ad5deaec248f	2025-10-02	INGRESO	Venta #5936	16000	efectivo	885f25fe-e467-448a-aee5-6c431457131d	\N	caja_principal	\N
b3c843f4-c611-4673-a714-e645afe63e7a	2025-10-02	INGRESO	Venta #7236	16650	efectivo	26fd1d3c-b792-4152-861b-0d28e7b03eff	\N	caja_principal	\N
96ac0bea-2d9c-431f-b586-3c8bbb56500b	2025-10-02	INGRESO	Venta #8517	14500	efectivo	\N	\N	caja_principal	\N
c1963e03-48ad-448f-a0e8-89fb37e61205	2025-10-02	EGRESO	Mantenimiento: Guantes	2000	efectivo	\N	dca5abe2-f0f4-407e-b1dc-29a75c3906f5	caja_principal	\N
afbb98e8-b4d6-4c80-ad80-4445a9dc2adf	2025-10-02	INGRESO	Venta #9222	2500	efectivo	\N	\N	caja_principal	\N
8b612907-8812-4bf6-a458-15bd88cfb205	2025-10-02	EGRESO	Ingredientes: Frutas	28000	efectivo	\N	3ff1d902-c8fb-48e0-8900-eb17ade04bc5	caja_principal	\N
7c11db2e-7bf6-47b5-8989-e7a271e819f5	2025-10-02	INGRESO	Venta #2360	14500	efectivo	\N	\N	caja_principal	\N
b8e3f9de-3d1b-4328-9c44-8e0f82b2d7af	2025-10-02	INGRESO	Venta #2338	2500	efectivo	\N	\N	caja_principal	\N
8fdeda55-31f5-4e90-af70-f0bdeadfcdcb	2025-10-02	INGRESO	Venta #9897	14500	efectivo	\N	\N	caja_principal	\N
4884b052-c8aa-4d14-809a-3d12546bc5cd	2025-10-02	INGRESO	Venta #6578	32500	efectivo	2ab7a9ff-7cec-4359-9d88-9b0c1ac4b889	\N	caja_principal	\N
c0a24c00-5f47-46c7-8d16-bef20b6a8311	2025-10-02	INGRESO	Venta #2042	14500	efectivo	\N	\N	caja_principal	\N
3606b582-8483-448a-8488-79458139ca3d	2025-10-02	INGRESO	Venta #7257	15000	efectivo	229c6e19-de1a-4e2b-bb27-68f040a4ced7	\N	caja_principal	\N
d651db02-a168-46ed-9f27-799876fc7e5d	2025-10-02	INGRESO	Venta #4468	18500	efectivo	74ca0fac-19e0-413c-9652-128576a71930	\N	caja_principal	\N
93ad3e2f-92e7-4090-bc15-55caeae957ca	2025-10-02	EGRESO	Ingredientes: Rugula	6000	efectivo	\N	71a48242-5150-4f42-9b01-4083e2c67225	caja_principal	\N
63ab0bae-908b-41c5-b6a5-a4bd92e37088	2025-10-02	EGRESO	Equipos: Bolsas Libra	4400	efectivo	\N	4778d1bc-266c-4e05-80ca-bbe61313591c	caja_principal	\N
d67f97b1-b9f9-4d0f-9e07-ce2e9b241dc6	2025-10-02	INGRESO	Venta #3836	12000	efectivo	7639b042-a383-4fe1-9bec-ca43644f6964	\N	caja_principal	\N
9e50f39b-a014-4076-b07e-53bf5cfb7adf	2025-10-02	INGRESO	Venta #8675	46000	efectivo	469710ef-38d1-42f7-9394-67c6d1c8cc54	\N	caja_principal	\N
316ab27f-8c8f-4bc2-8057-479b1d95ada4	2025-10-02	INGRESO	Venta #4180	14500	efectivo	\N	\N	caja_principal	\N
6488636e-764b-43f4-a577-2f25dada1c7b	2025-10-02	INGRESO	Venta #3752	21000	efectivo	725c724a-163f-45a2-afb3-83f4ae55f354	\N	caja_principal	\N
0c390de8-1046-4d42-8038-3cb61a3a2443	2025-10-02	INGRESO	Venta #5579	11000	efectivo	be065d1f-309c-4856-8144-d869edcf2e28	\N	caja_principal	\N
9d2d8315-b966-42f0-b6fb-8e284e9a20a0	2025-10-02	INGRESO	Venta #4484	16000	efectivo	b34d281c-e033-4f8d-817b-5b785e334483	\N	caja_principal	\N
b8fefbd4-cb99-4510-8a06-4d91f1a5952f	2025-10-02	INGRESO	Venta #4672	14500	efectivo	\N	\N	caja_principal	\N
8e54a78d-2d49-49c4-bcbe-d99e4439375a	2025-10-02	INGRESO	Venta #2948	16500	efectivo	880329d3-dbc3-4da2-99a1-727a8ab0ec81	\N	caja_principal	\N
ecf3d5fb-f17b-4eb1-8a17-fa0780e957aa	2025-10-02	INGRESO	Venta #2651	14500	efectivo	\N	\N	caja_principal	\N
116a0694-65a5-46aa-865b-bd9ec37eadc4	2025-10-02	INGRESO	Venta #5780	14500	efectivo	\N	\N	caja_principal	\N
1f7fe672-d23f-4a28-89ea-22f435df332a	2025-10-02	INGRESO	Venta #6554	14500	efectivo	\N	\N	caja_principal	\N
44c58133-0d51-4ca1-876a-4db9543b4abf	2025-10-02	INGRESO	Venta #5298	14500	efectivo	\N	\N	caja_principal	\N
adaa4068-bb0e-4d03-b021-b2c4a4100788	2025-10-02	INGRESO	Venta #9085	14500	efectivo	\N	\N	caja_principal	\N
534b19de-8a91-4daf-9e82-232ba45d778f	2025-10-02	INGRESO	Venta #3193	14500	efectivo	\N	\N	caja_principal	\N
ce805918-5284-4a11-b5d9-34065a548588	2025-10-02	INGRESO	Venta #4146	14500	efectivo	\N	\N	caja_principal	\N
78d7b1f6-e6be-4b8a-bde3-901f58f650cd	2025-10-02	INGRESO	Venta #1816	14500	efectivo	\N	\N	caja_principal	\N
d4d144df-97d8-4064-9d46-17b30bb4f172	2025-10-02	INGRESO	Venta #6951	14500	efectivo	\N	\N	caja_principal	\N
2b9b1199-3cba-4eb9-9f74-1f09cedbf4a6	2025-10-02	INGRESO	Venta #2062	14500	efectivo	\N	\N	caja_principal	\N
c7f63027-8c6e-40c9-8c38-b29a3fa77601	2025-10-02	INGRESO	Venta #5789	10000	efectivo	ab4edcbd-8ea8-4aa5-a3de-7c2f6271e83c	\N	caja_principal	\N
4159d571-8e72-46a1-b7d0-b5d4904aece6	2025-10-02	INGRESO	Venta #1078	14500	efectivo	\N	\N	caja_principal	\N
e231c834-2bdc-4d1d-8175-4aee6ec4fb49	2025-10-03	INGRESO	Venta #4819	14500	efectivo	\N	\N	caja_principal	\N
6df706b4-0cf9-4afb-9b56-e4314b884124	2025-10-02	INGRESO	Venta #5389	14500	efectivo	\N	\N	caja_principal	\N
195c2a05-e0b1-4f63-a2fc-79d46e3ba8be	2025-10-03	INGRESO	Venta #4578	14500	efectivo	6c9ad3e1-a7f2-4517-bc32-d1cacaa7a749	\N	caja_principal	\N
a59f13d5-6334-4b7d-8e10-64919a371d59	2025-10-03	INGRESO	Venta #6831	40500	efectivo	1d11dfbc-0ca8-4ffa-9101-4716e9891ce6	\N	caja_principal	\N
34f5348c-03f6-4883-9ae5-30acd7bbba30	2025-10-03	INGRESO	Venta #3416	20000	efectivo	19974827-30ec-485c-955b-a6cf9d26bd06	\N	caja_principal	\N
252abbbd-5db4-48ca-b901-2e6db4767dc7	2025-10-03	INGRESO	Venta #1189	19500	efectivo	299b4299-7d59-4277-aa73-0fc42e0f5586	\N	caja_principal	\N
e08926b7-d74a-4a8c-8fa4-1547744cf6ce	2025-10-03	INGRESO	Venta #3727	14000	efectivo	3043bd93-98af-49a4-b479-a5c2b3d0ff4a	\N	caja_principal	\N
3eab9194-5cd6-4e42-95e8-8860dc0a4682	2025-10-03	INGRESO	Venta #7625	13000	efectivo	\N	\N	caja_principal	\N
5082f26e-916b-4f7a-a2cf-4c31b83be077	2025-10-03	EGRESO	Ingredientes: Fresas	20000	efectivo	\N	afa1b394-2804-4b0f-ac5f-65d6d61b84ea	caja_principal	\N
48c336a8-8bd3-457b-affd-b8bbda4dc372	2025-10-03	EGRESO	Ingredientes: Champiñones	28000	efectivo	\N	53049c42-1083-452e-97a9-c6fc0f63f1b8	caja_principal	\N
4a304e38-26c4-44d1-9834-2afd1296bfd3	2025-10-03	EGRESO	Ingredientes: Pasta tornillo	8400	efectivo	\N	89f40a69-3a46-46d1-8312-a51f0ab74bfa	caja_principal	\N
d6d793fd-c3c0-46b6-8177-30a10172cfca	2025-10-03	EGRESO	Mantenimiento: Jabon	2900	efectivo	\N	503b6540-2320-42d6-94b3-b0d67b6fcfae	caja_principal	\N
b2feda31-a9be-4517-af84-29e6f71f7dc5	2025-10-06	EGRESO	Equipos: Guantes	3000	efectivo	\N	c4599a12-50ef-45cb-af61-60895d0bd8fb	caja_principal	\N
84091588-505a-479b-93eb-03bc18aa7b71	2025-10-06	EGRESO	Ingredientes: Queso Parmesano	37500	efectivo	\N	c9e5970b-988c-4c7b-af05-026274b94843	caja_principal	\N
45a31e44-a312-4148-8ddb-b75696e7ad1a	2025-10-06	EGRESO	Ingredientes: Champiñones	17600	efectivo	\N	a9c85c91-2a85-4554-8866-73a1d991f4a5	caja_principal	\N
b7292805-b5ce-463b-ad75-92a4c79be0d4	2025-10-06	EGRESO	Ingredientes: Kiwi	12500	efectivo	\N	325a6800-bc57-47a9-9726-76e89089782a	caja_principal	\N
f70e9172-1266-4085-8796-c2452fb8112c	2025-10-06	EGRESO	Ingredientes: Quesillo	12000	efectivo	\N	4995a0bd-904f-4250-bfcc-096b2a9fbf04	caja_principal	\N
4bc9cf03-5188-466f-9b92-01cc41f6e990	2025-10-07	EGRESO	Ingredientes: Champiñones	56000	efectivo	\N	e16c6154-e073-4bb0-ad89-2ca8a142f6c9	caja_principal	\N
a516545b-5f0b-457f-a47f-b10ba544b7af	2025-10-07	EGRESO	Ingredientes: Pepino	6000	efectivo	\N	12edd37f-a7d3-4665-9376-a22ede7102b0	caja_principal	\N
58318c67-8b09-417a-a101-e995e52c828f	2025-10-07	EGRESO	Ingredientes: Zanahoria	2000	efectivo	\N	16822dd2-de2b-4dae-bbc7-e007ed66a4e4	caja_principal	\N
8588bbc4-f4d4-4c7d-b137-44273fa611b8	2025-10-07	EGRESO	Ingredientes: Quesillo	24000	efectivo	\N	190e03f5-d325-40dd-941d-ab3afebca16d	caja_principal	\N
16ffbab3-b955-43d6-9f02-ba58e38240a0	2025-10-07	EGRESO	Ingredientes: Piña	7000	efectivo	\N	2e5a1c9f-f415-4c91-b1ce-ecc4bdee0f2a	caja_principal	\N
1248c957-7918-4125-9e72-565bb076d878	2025-10-07	EGRESO	Ingredientes: Maiz Tierno	25000	efectivo	\N	adaa3b1a-c11c-4c80-bfb8-463fbe2f7888	caja_principal	\N
ee0b9d8a-523e-4a17-bbc6-82d9195b2e85	2025-10-07	EGRESO	Ingredientes: quinoa	6500	efectivo	\N	eb849861-090c-4ae9-82ea-4cf6efb6783e	caja_principal	\N
0bd0c6a6-19f7-4376-a356-4d62bced4f34	2025-10-07	EGRESO	Transporte: domicilio	6000	efectivo	\N	39ab647a-9209-40f4-a7ef-94e13d39f2fb	caja_principal	\N
540a61e9-7130-41b8-a985-b496a0ee8139	2025-10-07	EGRESO	Transporte: domicilio	6000	efectivo	\N	\N	caja_principal	\N
5951ec42-1c14-4624-99c9-d2ee7b93c3e0	2025-10-07	EGRESO	Transporte: domicilio	6000	efectivo	\N	\N	caja_principal	\N
cc8489f3-9451-488e-abda-2ac2769e9a1e	2025-10-07	EGRESO	Transporte: domicilio	6000	efectivo	\N	\N	caja_principal	\N
bb448e73-ae53-47cb-808e-18244d1e0cf3	2025-10-08	EGRESO	Ingredientes: tocino	56000	efectivo	\N	332c958f-92ea-4d36-9d15-ca201932a437	caja_principal	\N
0cfb4ce2-ead3-4ddf-9edc-08d0ecec65d9	2025-10-08	EGRESO	Otros: vasos y tapas	8800	efectivo	\N	a150c1e2-bed4-485d-a4f6-7cc08bf1e2db	caja_principal	\N
52ac7bcc-c11e-4b16-8109-186fe45f82ad	2025-10-08	EGRESO	Transporte: domicilio fallido	7000	efectivo	\N	4b8ff80e-9169-4c50-bd92-1379ed804b31	caja_principal	\N
0b175606-f68b-495b-aa60-4fdb022d771b	2025-10-08	EGRESO	Ingredientes: Leche 	31900	efectivo	\N	36ebeac4-ee04-4b2b-a0ca-543f98efda50	caja_principal	\N
ed37b08f-8f60-45ff-b9d1-4ff7fa9c5baa	2025-10-08	EGRESO	Ingredientes: Yogurt sin Azucar	24800	efectivo	\N	68ddea8e-4b3f-44c5-8214-669f4a3dd331	caja_principal	\N
ecbd9cf6-ac6e-4535-b6cb-edd07bbcfe24	2025-10-08	EGRESO	Ingredientes: Bolsa	300	efectivo	\N	cbc678d2-d8a3-4fc0-8d33-5abb15e29b47	caja_principal	\N
47c5ed7a-a557-4809-8c59-db0945e97cf8	2025-10-08	EGRESO	Equipos: Notas	5000	efectivo	\N	e8e5ca55-6102-49fe-871f-7c4e24edf69e	caja_principal	\N
1bb7826f-fc9d-44f7-984c-fec5703f43e9	2025-10-08	EGRESO	Ingredientes: albahaca	4000	efectivo	\N	af6edfa1-def8-4f30-bbad-a0fae0a0376b	caja_principal	\N
556fc345-f1db-4759-87d8-e69cc2ee00cb	2025-10-08	EGRESO	Ingredientes: pan andi 	2900	efectivo	\N	cb51636d-dc5c-4269-8f1f-c27c6c817a01	caja_principal	\N
bf124ef4-df1c-42b1-baa1-4c8d26f44155	2025-10-09	EGRESO	Ingredientes: Romero	2000	efectivo	\N	efde9ed7-37b8-4c92-92f4-9c8d8e9cc0e6	caja_principal	\N
dc00f87f-1eeb-4deb-9af4-8722700bcd3f	2025-10-09	EGRESO	Ingredientes: Curitas	2000	efectivo	\N	2e083c4a-3b56-4aaf-b903-6c6ee1fa16d4	caja_principal	\N
dc4559d4-a974-4206-a758-b2bcc6cabb64	2025-10-09	EGRESO	Ingredientes: calabaza tostada	14000	efectivo	\N	562cd6f0-9cd9-462b-af18-8d39a70e34a0	caja_principal	\N
7b8f6bd4-3b83-47a1-8b3f-0e98165370f2	2025-10-09	EGRESO	Ingredientes: coco	7500	efectivo	\N	fff78388-ca6a-48b2-856d-e25f01bce9e1	caja_principal	\N
a90fc74c-1bb9-4a50-8f83-4c1510380b30	2025-10-09	EGRESO	Ingredientes: chips de vegetales	35900	efectivo	\N	bd497a58-b0dd-4a87-84d2-6e8afdaf96c2	caja_principal	\N
48e93c66-710c-4b1d-9c12-92f27a1e304a	2025-10-20	EGRESO	Carnes: Carne	91000	efectivo	\N	9e37bc6e-9acd-450e-9d0e-e939bea52705	caja_principal	\N
03090dd7-88ec-4637-a118-04bdeae7af0d	2025-10-20	EGRESO	Frutas/Verduras: Quinua	13000	efectivo	\N	eecd41a2-e1a9-43f9-98d6-270ec63b935c	caja_principal	\N
c152b403-8d39-4557-b780-339b2c3fbb55	2025-10-22	EGRESO	Frutas/Verduras: Frutas	19000	efectivo	\N	e0e382d5-175e-41b1-b051-8b2641791ed2	caja_principal	\N
71967de1-8129-42e3-b9be-298919f1f7f6	2025-10-23	EGRESO	Productos Limpieza: Palillos	3200	efectivo	\N	b3384424-aa55-4c69-82dd-8f599045f762	caja_principal	\N
e1248e53-c846-4e82-9732-f523bdd7376f	2025-10-24	EGRESO	Frutas/Verduras: Granos	11500	efectivo	\N	38c5e870-7a4a-491f-a982-7a460bcd782c	caja_principal	\N
5391242a-baae-41c3-b03f-b4eff082eac1	2025-10-24	EGRESO	Frutas/Verduras: Aguacates	9000	efectivo	\N	99d0641e-9487-48f5-8a82-8e4ae06f7968	caja_principal	\N
bbd13b41-3fe4-4b75-9627-b2aed21dccfb	2025-10-27	EGRESO	Lacteos: Quesos	20000	efectivo	\N	f3786687-56d7-4f32-af5d-9f1151eebbcf	caja_principal	\N
a192fef1-ac8a-4104-aff8-192ad13b1764	2025-11-04	EGRESO	Frutas/Verduras: Fruver	26000	efectivo	\N	be2f36f9-f739-4d56-9bd4-e3e265b54891	caja_principal	\N
17428c18-1d38-4eec-ac1c-33aa0dd0db8d	2025-11-04	EGRESO	Frutas/Verduras: Queso y fruver 	15000	efectivo	\N	b7cafcf5-db66-4dc4-b878-0667edc4c0e8	caja_principal	\N
f4f01b0b-14ce-41a5-a4e6-1a1a3e73a24e	2025-11-04	EGRESO	Otros: Envío Andrés	2000	efectivo	\N	bd40605a-8cc8-4238-92d4-504195e8c7b8	caja_principal	\N
1f789f8d-81e7-4486-aa9b-bdcc6424adb5	2025-11-04	EGRESO	Otros: Prestamo Yaneth	54200	efectivo	\N	96bffef6-8c2e-4cb1-839b-21c3fe249766	caja_principal	\N
99ce807f-0a30-4c94-9652-c44654991aa4	2025-11-04	EGRESO	Otros: Pan	5500	efectivo	\N	\N	caja_principal	\N
caa798b2-4e5f-4215-a594-e33c8873ef00	2025-11-05	EGRESO	Frutas/Verduras: Pasta	6000	tarjeta	\N	51dc104d-2a4a-4627-ae16-c4a1a1849d84	caja_principal	\N
a575d872-a743-4f92-9658-7def932306eb	2025-11-05	EGRESO	Carnes: Tocineta	28000	efectivo	\N	9f5bfcb4-e810-4129-9b4d-ea6fd9301593	caja_principal	\N
541741a0-8715-4f01-aeb0-9183f04c71c4	2025-10-09	EGRESO	Ingredientes: maíz dulce y bolsa 	30300	efectivo	\N	50dc24ca-6a7a-46de-acf9-726d00cc6532	caja_principal	\N
5c8e62cc-9839-46ff-b108-94d19d0f665d	2025-10-10	EGRESO	Ingredientes: Frutas	64500	efectivo	\N	ad14659f-a28c-472c-a1a4-e9c6c0c7d9c4	caja_principal	\N
200c0a13-b460-446d-ae9f-6db2fc4370a8	2025-10-10	EGRESO	Ingredientes: Quesillo	12000	efectivo	\N	2dede0f2-73d1-4a0a-b8a3-38bc18650d71	caja_principal	\N
8edd3872-23eb-4d26-9c7e-04182f5a913e	2025-10-10	EGRESO	Ingredientes: Comino	2800	efectivo	\N	b801c523-5c40-44f6-aa8d-fd0c434ca332	caja_principal	\N
2a8d90b9-f01b-4281-9eae-b1fc0e3e77e7	2025-10-10	EGRESO	Ingredientes: Maggi Gallina	1000	efectivo	\N	f79dd650-a512-4660-8563-f8aaca7da42f	caja_principal	\N
299a53d2-86ee-4cc8-89ae-d03c98bf410d	2025-10-10	EGRESO	Ingredientes: Tomillo	2800	efectivo	\N	b854cb6c-012a-4a02-a47e-60120f0b2004	caja_principal	\N
5ca42c1d-c3c2-4325-9424-e71109ba4aa7	2025-10-10	EGRESO	Ingredientes: Pimienta	3200	efectivo	\N	480bfb35-bbe8-4957-9d55-5e0c8409ee10	caja_principal	\N
da348757-4679-4307-9481-3e11c269aa87	2025-10-10	EGRESO	Ingredientes: Oregano	1800	efectivo	\N	cbf2b811-6e5c-476a-8573-7d07ad8c456d	caja_principal	\N
3389f108-a966-4fd2-86d3-bbeb968204c8	2025-10-10	EGRESO	Ingredientes: Tocineta	56000	efectivo	\N	a7abb89a-0794-4332-9c38-53918a610c33	caja_principal	\N
eb1c804c-7d24-4d6f-bfa5-560f8cfe6278	2025-10-11	EGRESO	Ingredientes: Frutas	92000	efectivo	\N	12b9d7a7-d72f-406f-bb97-337361840214	caja_principal	\N
4ac8ebae-f0e3-48a3-9c11-f310d4a4dee0	2025-10-11	EGRESO	Salarios: DANIEL Adelanto semana hasta 11 OCT	100000	efectivo	\N	7b973a7f-e089-4a71-a02a-663823ad5c85	caja_principal	\N
eae8cad7-84ce-4f1c-8ac7-3a08cb2e4cae	2025-10-11	EGRESO	Ingredientes: Arandanos	6000	efectivo	\N	f120c485-05fc-4ab0-a363-c1b42fc0429e	caja_principal	\N
0348f114-a7bc-4cdb-8724-60cfaaa5e87a	2025-10-11	EGRESO	Ingredientes: Aguacate	5000	efectivo	\N	9409f20a-7333-42e0-9e32-b2a23fa9436f	caja_principal	\N
cece4ec4-f664-465c-9807-404b51991310	2025-10-14	EGRESO	Ingredientes: Panaderia	30000	efectivo	\N	3f6c9295-148e-4666-8d0f-81c97c05351c	caja_principal	\N
de14a373-2eb0-42bd-9f08-b80c6d9dfb13	2025-10-14	EGRESO	Ingredientes: Fruver	4000	efectivo	\N	8f29b855-bc8b-4122-bb74-e05a8765403a	caja_principal	\N
1037d6c7-762c-4c78-b223-2e123ac7e947	2025-10-14	EGRESO	Mantenimiento: Pilas	3000	efectivo	\N	9cf4d504-f351-4040-b727-0b85fa9c8674	caja_principal	\N
b7030f6b-7329-4855-810a-8e68707ec33d	2025-10-14	EGRESO	Equipos: Impresion	20000	efectivo	\N	378fcd0c-6891-4c88-86f0-6b1ce609bda6	caja_principal	\N
e45fc0f9-cd2d-4942-aad6-c28f10bae183	2025-10-14	EGRESO	Salarios: Salario Daniel 06 OCT - 11 OCT	266000	efectivo	\N	9f9952d2-1fd4-43ec-b9b1-05c2afdd41d7	caja_principal	\N
cb94bea1-85f1-47e7-9fd9-45bf9da0633f	2025-10-14	EGRESO	Ingredientes: Desechables	6800	efectivo	\N	a370a678-25e5-4121-9ce9-3c7a9ca4f20e	caja_principal	\N
758188eb-2527-4a09-a906-ce9eaa934f62	2025-10-15	EGRESO	Ingredientes: Champiñones	56000	efectivo	\N	cbc19fb6-14c9-460f-a451-cd3af35148d6	caja_principal	\N
2d514e68-3190-4319-9235-851d9a158c3a	2025-10-16	EGRESO	Mantenimiento: Desengrasante	6300	efectivo	\N	2e87d994-2708-4060-a79b-ad2ad8f9e951	caja_principal	\N
cf6396c1-2b8a-4401-be89-77f731c6ab33	2025-10-16	EGRESO	Ingredientes: Fruver	22000	efectivo	\N	37d3a905-38b5-4936-b020-94fdcbfe911a	caja_principal	\N
7075fc08-f3fd-4bb6-bde2-d2f09fc02cf2	2025-10-16	EGRESO	Ingredientes: Aguacates	11000	efectivo	\N	860db682-6b23-410d-b5ce-90bd348e6d3c	caja_principal	\N
8b3137e7-0695-4974-938a-b4871b3c34a5	2025-10-16	EGRESO	Ingredientes: Tocineta	84000	efectivo	\N	385c39ad-b887-46fc-8e8a-7ff6a3d66665	caja_principal	\N
229a579f-799e-4a0e-a6fa-f5a59dc6b937	2025-10-16	EGRESO	Ingredientes: Quinua	6500	efectivo	\N	48ad5b03-faab-4da7-b8a8-870165c21e24	caja_principal	\N
322e6e19-3a16-4278-b0bd-52a90e7fb6cf	2025-10-16	EGRESO	Ingredientes: Cafe y Bizcochos	28300	efectivo	\N	4e65ca69-04e5-4a69-bd3a-2b019eeeaeef	caja_principal	\N
e7bd9a11-f164-4923-8461-7cc119d74158	2025-10-16	EGRESO	Salarios: Salario Miguel	324100	nequi	\N	8df65e00-e749-423b-8679-ae7c7c1777fb	caja_principal	\N
ce40a77e-6056-4857-b6c8-12167a6d9871	2025-10-16	EGRESO	Ingredientes: Panadería	222000	nequi	\N	b559be9d-b68f-4af8-83c6-63b757fc39d4	caja_principal	\N
f497e7de-082c-4d59-aa9c-31dbf09b220f	2025-10-16	EGRESO	Ingredientes: Fruver	36200	efectivo	\N	ab427a33-ff84-43e0-b64c-523b3fafa587	caja_principal	\N
1585e1f7-84d6-4337-8ce4-04bc6811b8e6	2025-10-16	EGRESO	Transporte: Domicilio	7000	efectivo	\N	6647df1b-d51d-40ac-8c20-be82023ea128	caja_principal	\N
8cac4b35-609b-407f-9eb4-079062ddc1f6	2025-10-16	EGRESO	Equipos: Fabuloso	2200	efectivo	\N	827e4c09-3128-45b6-9c6e-5d71ebe05791	caja_principal	\N
0a702468-8b1b-4b33-851b-471d35b1a804	2025-10-17	EGRESO	Ingredientes: Aguacates, cilantro	10300	efectivo	\N	280c26c9-cd31-44ab-b983-ebde74e83097	caja_principal	\N
53062594-bca2-4dda-bc1d-30c5aa549f19	2025-10-17	EGRESO	Ingredientes: Pan Sandwich	66000	efectivo	\N	9761f170-4fd5-4638-9bb2-903d637b12ad	caja_principal	\N
32aeee12-4012-4792-b1c5-50c02e93a094	2025-10-17	EGRESO	Ingredientes: Arroz Cab Rev	5000	efectivo	\N	7957dbc7-e5cb-473f-ae73-81ca4dcc23dd	caja_principal	\N
cb6e0ad9-0a77-4bff-b749-7c312f51a0e1	2025-10-18	EGRESO	Ingredientes: Chips de arracacha	40000	efectivo	\N	4151b84d-0764-4664-b470-da676d1ff610	caja_principal	\N
1dec1b38-51f0-49dc-a230-b9c1b59a9898	2025-10-18	EGRESO	Ingredientes: D1	55400	efectivo	\N	5bce4b30-9965-467f-a8fb-b5e7bd03174a	caja_principal	\N
0eb9186b-aa2e-434f-b5c8-713d3c336c8c	2025-10-18	EGRESO	Ingredientes: Jabón	11000	efectivo	\N	34a9c389-e265-4718-81cf-3095e19722f6	caja_principal	\N
9146ba84-5cc9-4863-bd00-2b200b0882b9	2025-10-20	EGRESO	Frutas/Verduras: Aguacates	11000	efectivo	\N	6609ba5b-03b7-4931-96b8-c6a9d5dc9c07	caja_principal	\N
50cb9794-21fe-4aae-a100-9535b115a50f	2025-10-22	EGRESO	Frutas/Verduras: Maíz 	30200	efectivo	\N	e2507066-38b9-4c7a-ba72-a7f109a1f6e1	caja_principal	\N
b6c98afc-2632-4de5-9d74-eeb43dbb19a6	2025-10-23	EGRESO	Frutas/Verduras: fruver	56500	efectivo	\N	e5c7d1f6-9730-4f8d-8baa-3ad3056e5f7d	caja_principal	\N
a571cb09-f67d-444d-b982-33b0cb5b952f	2025-10-23	EGRESO	Frutas/Verduras: Panela	4400	efectivo	\N	fc56f31b-f788-4ae9-a5b9-2e22310794b5	caja_principal	\N
4fbed1a3-8b22-42c4-947e-2bb23c6d134c	2025-10-23	EGRESO	Servicios públicos: Balance	1400	efectivo	\N	9eb20230-4d7f-49a6-b2dc-cc91d14c2be1	caja_principal	\N
377a56bd-0513-4132-88a2-4012b02338e8	2025-10-24	EGRESO	Frutas/Verduras: Aguacates	12000	efectivo	\N	a75f9232-d0bc-40e9-8e6d-d86d21f31295	caja_principal	\N
6112870e-36d8-420d-a60f-43ccdfd67631	2025-10-24	EGRESO	Salarios: Adelanto Daniel	30000	efectivo	\N	111b6092-a0a0-475a-baca-57a5b30bc3ba	caja_principal	\N
768128be-c2f4-488f-8ede-94739b9e62ce	2025-10-28	EGRESO	Frutas/Verduras: Pasta	2400	efectivo	\N	c4820003-375e-4313-a23c-ff00dc12d537	caja_principal	\N
189189ae-6a31-4d66-91f3-3fb1cc67b513	2025-11-04	EGRESO	Frutas/Verduras: Champiñones	56000	efectivo	\N	3aacd01f-c528-4efa-bd4b-e94346fd7b2f	caja_principal	\N
e06b0a96-deec-4179-b32b-53628b9389f1	2025-11-04	EGRESO	Frutas/Verduras: Hierbas aromáticas	3000	efectivo	\N	3edfcece-0b69-427d-b810-1948002851d7	caja_principal	\N
0d79166b-378a-4334-957c-f129f9426d1e	2025-11-04	EGRESO	Otros: Pan	5500	efectivo	\N	b6eb1022-d5ed-4ed5-b7f4-3b060d6c37fe	caja_principal	\N
718fe2fe-53ea-486c-9ade-dd2305e172a0	2025-11-04	EGRESO	Otros: Inyeccion 	57000	efectivo	\N	cf7a6940-42f6-4a9c-91af-30302b64e0bb	caja_principal	\N
9488c601-1389-43e0-a285-fe1b43a9f6a8	2025-11-05	EGRESO	Lacteos: Queso	13000	tarjeta	\N	534966b8-9dd3-473e-9ad9-292fe7f025b0	caja_principal	\N
af8d5d56-0cbc-49e5-891c-a9f52dae8f05	2025-11-05	EGRESO	Otros: Préstamo Briyith 	2800	tarjeta	\N	2f2eb150-a5bc-47ef-b305-e22140cc43b5	caja_principal	\N
ba4e3a97-8963-4590-8b51-afca6448438b	2026-01-31	EGRESO	Frutas/Verduras: Banano	50000	efectivo	\N	2e9f3da8-30a7-4808-832a-4fa9d634414a	caja_principal	\N
b1511046-d3cd-4747-9e55-2745b88a0962	2026-01-31	EGRESO	Carnes: Pollo	30000	nequi	\N	34f5ef8b-743b-443b-b10d-62ac99216181	caja_principal	\N
48d6e299-b177-44d8-b91d-c1a107f62f33	2026-01-31	EGRESO	Transporte: Domicilio orden 3425	6000	efectivo	\N	ac1124bd-8a1a-41d2-a955-72a1bc6c4062	caja_principal	\N
addd32f3-f845-4c30-86d0-15204679bbf3	2026-02-22	EGRESO	Inventario: Compras de la mañana	12000	efectivo	\N	\N	caja_principal	\N
9f068784-00d6-4f84-a19a-60caacd9a985	2026-02-22	EGRESO	Inventario: Compra mañana	8500	efectivo	\N	\N	caja_principal	\N
0371f167-be8a-44bd-a5d6-a878652791dd	2026-02-23	EGRESO	Inventario: Prueba Gasto	20000	efectivo	\N	\N	caja_principal	\N
dd042b88-3cbc-4e73-a10d-9469be78550e	2026-02-23	EGRESO	Inventario: Prueba Gasto	20000	efectivo	\N	\N	caja_principal	\N
98a419a5-4e2a-4cdb-8a3f-ce2f219d5c76	2026-02-23	EGRESO	Inventario: Prueba Cacao	8200	efectivo	\N	\N	caja_principal	\N
bba703e2-a35a-40d0-b836-63fdd513c1d0	2026-02-23	EGRESO	Inventario: cacao prueba	10000	efectivo	\N	\N	caja_principal	\N
4976a200-2459-41fc-afe6-e86d5a8e44b0	2026-02-23	EGRESO	Inventario: Prueba Gasto	20000	efectivo	\N	\N	caja_principal	\N
895acdc8-979f-4346-9356-f88db478edb7	2026-02-23	EGRESO	Papelería: hojas de menu	24000	efectivo	\N	b5dc23d2-1cf5-4f1a-99ba-8c10bbc5864d	caja_principal	\N
e211e62a-ab25-42c0-bd32-4b6c8876ecef	2026-02-23	EGRESO	Inventario: dos pacas de leche	51400	efectivo	\N	\N	caja_principal	\N
67904114-4b96-4259-8675-096df6e67a85	2026-02-23	EGRESO	Otros: cuchillo multiuso con funda	12000	efectivo	\N	\N	caja_principal	\N
dd3d5d95-bc8f-4e55-8e0e-b7a03feb71d1	2026-02-23	EGRESO	Papelería: bolsa reciclada	500	efectivo	\N	\N	caja_principal	\N
8030bfc5-284a-44f2-9ba5-3cb04e6e7210	2026-02-23	EGRESO	Otros: paquete de tarrinas 25 UND 54 OZ	14000	efectivo	\N	59d375e2-3dff-4844-b7d1-84f5e0dacd5c	caja_principal	\N
f042c5ed-ece6-490c-b1a6-55221e5ba591	2026-02-23	EGRESO	Otros: paquete de tarrinas 25 UND 14 OZ	12000	efectivo	\N	c97c7f3a-993d-4880-8ae8-dc18d7eb5960	caja_principal	\N
d6b5e7ab-14be-4735-bcee-985b489c72db	2026-02-21	EGRESO	Carnes: prueba	20000	efectivo	\N	\N	caja_principal	\N
aae06d0a-ca1e-4ae2-a433-e5173e97ca80	2026-02-21	EGRESO	Inventario: prueba	24100	efectivo	\N	\N	caja_principal	\N
a661864a-d03a-4ea9-95f9-7098837221c5	2026-02-23	EGRESO	Inventario: Pan perro	22000	efectivo	\N	\N	caja_principal	\N
6850f32f-9365-443c-804d-5944be0dcce4	2026-02-24	EGRESO	Productos Limpieza: Toallas de cocina, paquete de 3	21900	nequi	\N	9989fc70-9084-4a89-a576-acd2a42297d2	caja_principal	\N
cea07c73-249c-439e-a9f9-a6341eb21c1a	2026-02-24	EGRESO	Inventario: Sábila	1500	efectivo	\N	50840a65-4605-472f-8057-8d3d1f4f578e	caja_principal	\N
1474f556-bf6d-4640-a610-92520fdd47e9	2026-02-24	EGRESO	Inventario: Sábila	1500	efectivo	\N	\N	caja_principal	\N
fc34a562-eb5b-44ab-944e-a31fd197b062	2026-02-24	EGRESO	Inventario: Hierba buena	1000	efectivo	\N	1063f5d2-c3a5-4126-ba1a-cff3588f1a6e	caja_principal	\N
9cf7a59d-9393-44c2-acb3-b9ce45ece7d0	2026-02-24	EGRESO	Inventario: Sandia por kilo	12000	efectivo	\N	fb5dc2db-1137-4373-a52d-2e6a8b0cea86	caja_principal	\N
d9ba22f1-b8d0-4a9b-b636-01936102f45d	2026-02-24	EGRESO	Inventario: Menta Por Paquete	1000	efectivo	\N	3eb652d8-5894-4407-a609-1d00670defc8	caja_principal	\N
9850a45e-7a7f-4eb4-93f0-2f928de8e6ba	2026-02-24	EGRESO	Inventario: Banano	7500	efectivo	\N	1edac636-33a5-4f74-a511-826089598f60	caja_principal	\N
eb2bb14a-5f78-4f4e-b230-f6cbd1288757	2026-02-24	EGRESO	Inventario: Mani tostado por paquete	6000	efectivo	\N	6989a039-dd30-4175-aa2b-80c286125669	caja_principal	\N
3726d49f-1855-4895-996c-fc5ff10ba071	2026-02-24	EGRESO	Inventario: Mango por kilo	10800	efectivo	\N	510809fa-054b-4e14-a72f-9cd1e48be85d	caja_principal	\N
e09ba853-765e-465e-8722-f131340a75b9	2026-02-24	EGRESO	Inventario: Aguacate	7000	efectivo	\N	93988eab-619e-44a9-9dec-3f792648275e	caja_principal	\N
f26b7976-a07f-4646-ac3e-10af0178feb5	2026-02-24	EGRESO	Inventario: Lechuga crespa	3000	efectivo	\N	fc954d0d-dbd3-46e0-968c-6acecd499d3a	caja_principal	\N
989af180-eb5b-4ade-a981-d4a8aad2444d	2026-02-18	EGRESO	Otros: Variado para inventario, no es legible la factura	39500	efectivo	\N	87fe906e-e64c-418e-b10e-6f3b3d1cb19f	caja_principal	\N
f7766fa4-c2ac-44cf-9661-58b352107f81	2026-02-18	EGRESO	Inventario: Pan perro	22000	efectivo	\N	b3a9cfb0-1652-40ab-b234-2ceb2217987f	caja_principal	\N
1bc762fa-be66-42ba-8f74-f03ecfa46ab6	2026-02-24	EGRESO	Inventario: Pan Ciabatta	28000	efectivo	\N	27e9f5df-8750-45fe-8a58-5f15cc4b4a61	caja_principal	\N
66dfbc00-565c-42fe-aa96-d24abd3f92ee	2026-02-24	EGRESO	Transporte: Transporte pan Ciabatta	7000	efectivo	\N	ec742f07-ae88-439f-8113-688a73c20898	caja_principal	\N
5e5f1dc8-aab8-44ad-8f9d-6eddbdaee39c	2026-02-24	EGRESO	Lacteos: Queso parmesano	11200	nequi	\N	fe0da855-eb56-44aa-ad7d-282299b873a0	caja_principal	\N
4628acdb-d14e-47e7-a379-0e14407fc8b1	2026-02-24	EGRESO	Lacteos: yogur sin azúcar	8400	nequi	\N	7f0ca73f-c033-4b1d-a18b-3b3660c02769	caja_principal	\N
af4096b2-4a1c-46a9-8955-bdffd2892576	2026-02-24	EGRESO	Lacteos: Queso crema	6000	nequi	\N	ea195757-65eb-46a4-8629-232af20e5a5a	caja_principal	\N
a6a5ffad-137e-4e39-ab9b-e37099664c36	2026-02-24	EGRESO	Otros: IVA lácteos del dia	3800	nequi	\N	6d9ccb9e-bf2f-4ee9-b822-cf18224c9036	caja_principal	\N
26125cb9-185d-44cc-97fe-4af8ada4f9ef	2026-02-23	EGRESO	Lacteos: Bebida almendrada	2500	efectivo	\N	\N	caja_principal	\N
fea1e148-d411-4eb3-929f-d62532c14393	2026-02-23	EGRESO	Otros: Bebida energizante dark blue	5000	efectivo	\N	\N	caja_principal	\N
594e493a-c732-4e1b-919c-807dcc8917c1	2026-02-23	EGRESO	Otros: 3 bandejas para hornear	48000	efectivo	\N	\N	caja_principal	\N
394e4b86-799c-46ab-b4a3-c8bc8aed4eed	2026-02-23	EGRESO	Otros: bebida energizante 	4000	efectivo	\N	\N	caja_principal	\N
ceeddfa0-6842-405b-982c-40d19c4e2268	2026-02-23	EGRESO	Otros: set de tazas medidoras plasticas	12000	efectivo	\N	\N	caja_principal	\N
d89e1d99-1eb6-4123-b029-4da7d105bede	2026-02-23	EGRESO	Otros: 5 recipientes rectangulares grandes	50000	efectivo	\N	\N	caja_principal	\N
89bb8de5-5581-4343-999f-90d1c891958f	2026-02-23	EGRESO	Otros: frasco hermético de vidrio	8000	efectivo	\N	\N	caja_principal	\N
6c087acb-1341-4175-a490-37203c4de248	2026-02-23	EGRESO	Otros: 2 recipientes cuadrados grandes	16000	efectivo	\N	\N	caja_principal	\N
f1a48af3-679d-46f7-a1aa-1674ed71fa98	2026-02-23	EGRESO	Otros: 2 botellas de aceite de oliva 	69900	efectivo	\N	\N	caja_principal	\N
2c8eb525-7767-4cdd-aeee-7ad7a17a0099	2026-02-23	EGRESO	Lacteos: Bebida almendrada	8000	efectivo	\N	\N	caja_principal	\N
f48934fd-0858-4244-a841-8c1e24969d1e	2026-02-23	EGRESO	Otros: Hatsu 200ml X 24 unds	45600	efectivo	\N	\N	caja_principal	\N
0f9d34b9-28d0-418f-a3d9-c5dd4289765d	2026-02-23	EGRESO	Otros: Hatsu 400ml X 6 unds	27000	efectivo	\N	\N	caja_principal	\N
57949cf9-ce33-4c72-8f69-4e38d3bb6148	2026-02-21	EGRESO	Inventario: Leche UHT deslactosada 12 unidades	51400	efectivo	\N	\N	caja_principal	\N
d19a3ed9-a8ab-4bc5-92bf-fc95dff6a274	2026-02-23	EGRESO	Inventario: leche	51400	efectivo	\N	a79dcd87-64dc-4642-b455-d88287d8691f	caja_principal	\N
b7aa88ef-f9bd-47fc-8ed3-ec6a292b214f	2026-02-24	EGRESO	Otros: Gorras cabello	1200	efectivo	\N	\N	caja_principal	\N
4f3161d2-de4a-459d-81b9-df4a3b25640b	2026-02-24	EGRESO	Inventario: romero	1000	efectivo	\N	\N	caja_principal	\N
abfc873d-3475-4526-a09e-146f7db819f0	2026-02-23	EGRESO	Inventario: romero	1000	efectivo	\N	1fe9ac7e-9ca7-4919-927b-ec5f711dd89f	caja_principal	\N
d4cf8476-f36a-4cf1-b735-ed7e5085dccf	2026-02-23	EGRESO	Otros: 2 und gorros cabello	1200	efectivo	\N	e7e4ccdd-6cfe-4b42-a1b6-4e6d45dfef99	caja_principal	\N
d5b2cb01-73f8-43d4-8245-8e30793bd93d	2026-02-23	EGRESO	Papelería: 2 und lapicero	2000	efectivo	\N	8467886a-5a44-4da2-ab9f-dcd03f971ee8	caja_principal	\N
2b0801b2-f8fb-4b2d-b242-c0a9de9cd6fd	2026-02-23	EGRESO	Papelería: impresiones recetas	2500	efectivo	\N	1ef82a65-e41c-4232-9b62-fec59bb8a1a7	caja_principal	\N
78f801ba-4006-471b-873d-4adc6b87305c	2026-02-23	EGRESO	Papelería: menu adicional	6000	efectivo	\N	43f537b3-23ec-465a-b47c-24f335fbb6cd	caja_principal	\N
90ccda1b-e039-4362-a6c9-12f27870aad2	2026-02-23	EGRESO	Papelería: protector hojas	1300	efectivo	\N	88cc3adb-e40f-4e9b-a9ee-aa7289f20fca	caja_principal	\N
ec5c0010-0227-4976-a266-40f5d04a2c56	2026-02-23	EGRESO	Papelería: regla. bisturi, facturero	5100	efectivo	\N	87b7fa0a-9e7c-4d83-90f5-e908d7eb5d83	caja_principal	\N
cf515446-9a2c-4464-871d-d7042b018d62	2026-02-24	EGRESO	Otros: domicilio	14500	efectivo	\N	828f3305-1584-4441-8377-d2db09129809	caja_principal	\N
aacc3baf-ccb2-4608-a6c6-9acaf52cae79	2026-02-25	EGRESO	Papelería: copias de llaves	6000	efectivo	\N	00823a02-00cc-45e0-a15a-c80592b49d91	caja_principal	\N
dba4e539-4c0d-410b-821c-c71d4a4ecda8	2026-02-25	EGRESO	Productos Limpieza: esponjas 4 Unds	2200	efectivo	\N	004db8e5-a5a6-49fe-b05e-8c30949b0dd4	caja_principal	\N
fe595746-f74c-4fcd-ab58-aabedca16ac2	2026-02-25	EGRESO	Papelería: copias formas para temperatura	1200	efectivo	\N	ad8ad035-2bba-4e22-863e-197ac8cb8ffd	caja_principal	\N
d39fad35-77b4-41fa-9396-081f2a2e1881	2026-02-25	EGRESO	Papelería: corrector	3500	efectivo	\N	3b20da86-e016-47fa-b0e1-13b0c15d0ce7	caja_principal	\N
220decb8-8ec3-4cd3-a453-0424dc2a34e6	2026-02-25	EGRESO	Otros: Curcuma	3000	nequi	\N	01c3c718-6b60-4d22-ae63-28790d513b03	caja_principal	\N
7e26cd08-186b-418a-918c-06c689820420	2026-02-25	EGRESO	Otros: Hatsu 200ml X24	45600	nequi	\N	79e4d786-8dcd-400b-a4bd-ab1fb9ec1a3b	caja_principal	\N
7e9ad34b-6f59-4c1b-a4c1-67bcdef13936	2026-02-25	EGRESO	Otros: hatsu 400ml X6	27000	nequi	\N	6f34f17e-525b-48cb-a13b-837d6fbef948	caja_principal	\N
12f1f06d-73a7-444b-8207-5bf456cf9392	2026-02-25	EGRESO	Inventario: aguacate	7000	efectivo	\N	358b0036-97a1-49c7-aaf3-ba392d0cb776	caja_principal	\N
8f6b88ed-2f28-4950-9807-85a32cd2a8b4	2026-02-25	EGRESO	Carnes: 2kg de carne de res	57700	nequi	\N	1d9ec5e7-a99c-435d-9a54-373beaf97d9c	caja_principal	\N
5871dc39-4f32-43b0-acc1-1adb694022f9	2026-02-25	EGRESO	Carnes: 5 pechugas pollo 	64500	nequi	\N	34974e9d-ebb7-4d10-a558-1586665ca107	caja_principal	\N
6e83ac2d-0369-470f-835c-95bd3536b89c	2026-02-26	EGRESO	Otros: lonchera electrica	40000	nequi	\N	46404b95-11ae-4313-837b-28935627494e	caja_principal	\N
378ace04-080d-467a-a518-9f9bde97a3ca	2026-02-26	EGRESO	Otros: Adaptador	12000	nequi	\N	7abe33bc-9c24-4781-b442-0957a16aab0a	caja_principal	\N
7ab9cb52-449b-467b-92ae-c13b59fd51d8	2026-02-26	EGRESO	Otros: cilantro 	1000	efectivo	\N	bfc4a2f0-155f-4367-a94f-43c89f442ce6	caja_principal	\N
6ec40dc3-5eab-4c83-a823-ef31aabca682	2026-02-26	EGRESO	Otros: ajo 	2000	efectivo	\N	f3c88b44-5172-4c0f-bb30-c531042dfb80	caja_principal	\N
8ca2db47-119c-43fb-affc-6b0e60fbf47a	2026-02-26	EGRESO	Otros: aguacate	6000	efectivo	\N	fe74b623-103d-43ff-a185-8964468e5649	caja_principal	\N
6c311340-451b-4ce5-983b-6b5cac9b2dec	2026-02-26	EGRESO	Frutas/Verduras: tomates	8000	efectivo	\N	ee34b62b-ac99-40a1-a58c-b98fd6ef0fe8	caja_principal	\N
f07f8fbe-f78f-4871-9e94-6bd6de4cee39	2026-02-26	EGRESO	Frutas/Verduras: avena	5400	efectivo	\N	e560d19b-ead1-4e07-92b4-439a49602e6c	caja_principal	\N
90b54c72-591d-41c0-9a98-860cdd0fbcd2	2026-02-26	EGRESO	Papelería: Protector de hojas	1000	efectivo	\N	f5bddf4b-1073-4fb3-b431-6adf3f7f492f	caja_principal	\N
b010968d-c8ed-4b7e-8997-a33f5dafb31f	2026-02-26	EGRESO	Papelería: cinta 	3500	efectivo	\N	dd08b223-7b84-41dc-b4d1-3a9f2493cf13	caja_principal	\N
3541d39b-bb61-4dd3-aedc-120eb4df8e0f	2026-02-26	EGRESO	Papelería: Copias	800	efectivo	\N	703f3fd6-f729-4a54-9a49-0a1136426424	caja_principal	\N
b7c52378-857e-4550-80e7-c1eb8d2622ac	2026-02-26	EGRESO	Otros: libra de cafe	38000	efectivo	\N	72562d83-9592-4917-8f6b-e76597f1b58a	caja_principal	\N
82f39ff2-1b56-478e-aace-720868118c89	2026-02-26	EGRESO	Otros: hierba buena	2000	efectivo	\N	e281d056-941a-4507-a8e4-6edb76289fa5	caja_principal	\N
274d7429-474d-4fb8-82d2-ae722a5bc4a8	2026-02-26	EGRESO	Papelería: copias	1000	efectivo	\N	29382603-8193-4a52-a5e5-619fc711607a	caja_principal	\N
61301234-9b1d-46e3-b60d-83a58cf30348	2026-02-26	EGRESO	Otros: Empanadas	36000	nequi	\N	116e5983-5971-450f-9b9b-602c520e5713	caja_principal	\N
bd79ccaa-df69-4a7e-aecb-e622d6a8fa69	2026-02-26	EGRESO	Carnes: carnes	82000	efectivo	\N	e5c498a4-bb24-44d7-917c-722467df27c0	caja_principal	\N
090a18ce-be43-4d3a-8d0b-a1553aed76e2	2026-02-26	EGRESO	Otros: Condimentos para carne	3500	efectivo	\N	acd39e04-f254-411b-9234-a2f00212a0e0	caja_principal	\N
305e37b8-7678-40a7-a318-c389a6d92203	2026-02-27	EGRESO	Papelería: gorros para pelo	1200	efectivo	\N	33574f8f-e201-4e7e-b179-316271820338	caja_principal	\N
27ab371d-6ae3-48b6-8c4d-454973bf6e41	2026-02-27	EGRESO	Frutas/Verduras: champiñones	59000	efectivo	\N	57e4bf68-4679-409f-8d7c-26d4da6d4cc8	caja_principal	\N
1825d100-1564-436b-a6b8-85182f60ba63	2026-02-27	EGRESO	Frutas/Verduras: tomate	4000	efectivo	\N	5cf63b3a-e3dc-450b-bb25-f457f3fe4e6a	caja_principal	\N
215d6150-55ad-4489-873e-1abfb10c5468	2026-02-27	EGRESO	Frutas/Verduras: limones	2500	efectivo	\N	0e68eca3-4a5d-4417-a7f6-ab97e90b75b7	caja_principal	\N
9e81d532-bf83-4e15-8a8d-e70362c0de24	2026-02-27	EGRESO	Frutas/Verduras: zanahoria	2500	efectivo	\N	1f10e8d3-5694-49a6-b757-ebac81cf0897	caja_principal	\N
4ead5f4d-e86e-4c30-9ea6-5a6df38b707a	2026-02-27	EGRESO	Otros: cilantro	5000	efectivo	\N	0bb21e48-1af9-43fb-8c81-4d3a697a3a61	caja_principal	\N
979eac3f-f7d4-4cd2-9a7e-d17f19e328ad	2026-02-27	EGRESO	Carnes: Tocino	30000	efectivo	\N	397eec67-8277-4aae-a03b-ea394afe7b3b	caja_principal	\N
8b0d17a8-e791-4cc6-b259-f14156c77555	2026-02-28	EGRESO	Frutas/Verduras: lechuga	3000	efectivo	\N	6b9dc564-4a60-4b21-b05b-85189954e3b0	caja_principal	\N
e50ca10b-de8b-416d-b76d-69d112ac5218	2026-02-28	EGRESO	Frutas/Verduras: fresas	5000	efectivo	\N	50998f70-b629-46b0-b24a-a7ae8f1e7696	caja_principal	\N
75454829-118e-4c32-a64f-038c8dc36bbe	2026-02-28	EGRESO	Frutas/Verduras: Aguacate	6000	efectivo	\N	74c0c421-96a3-40a6-8dc4-a771e5322fd8	caja_principal	\N
f88eb19f-52ca-472f-9e3a-68ee2393c4bb	2026-02-28	EGRESO	Frutas/Verduras: arándanos	6000	efectivo	\N	3303105c-fa0c-4641-8182-e5b195172214	caja_principal	\N
9d12745b-f6e0-4623-ba27-de9d5557ba78	2026-02-28	EGRESO	Papelería: bolsa medianas	22500	tarjeta	\N	9e2e7fbb-441d-4aa9-924c-f0d7922e3b0a	caja_principal	\N
346c5d6c-16b5-42d2-81be-a7e1c3ceaecf	2026-02-28	EGRESO	Papelería: domo bajo	2600	tarjeta	\N	c9a791e8-085d-49bd-9cfe-41d5b147fafd	caja_principal	\N
6f54f70a-d749-4ba0-a282-11346ef0ae5d	2026-02-28	EGRESO	Papelería: Domo superior	5400	tarjeta	\N	d71559fe-e5df-4860-a943-4c916e295cb6	caja_principal	\N
89f82a79-40d3-475b-96b3-19167d574025	2026-02-28	EGRESO	Papelería: Tarrina 32 Oz	22500	tarjeta	\N	373a9348-8891-4a13-8bda-f5590e23f868	caja_principal	\N
fdac8f39-2a5f-470d-a0e2-36e992532a7a	2026-02-28	EGRESO	Papelería: 2 chequeras	4600	efectivo	\N	32ef78ab-3db7-463b-884c-8e2267b4cc49	caja_principal	\N
686034bb-cd78-4a12-a757-3b77a727a367	2026-02-28	EGRESO	Otros: Pan	1000	efectivo	\N	04460a08-b40e-4541-9233-cfeb5e3627d6	caja_principal	\N
6f56efac-47e7-4447-81b4-853b4dce79c1	2026-02-28	EGRESO	Otros: PRUEBA	1000	provision_caja	\N	\N	caja_principal	\N
c02d6bcd-c05a-4d31-a541-26b82c6a0a01	2026-02-28	EGRESO	Otros: Prueba2	1000	provision_caja	\N	\N	caja_principal	\N
8c951348-5a1e-4962-b48f-a253148a8387	2026-03-02	EGRESO	Productos Limpieza: servilletas	4000	tarjeta	\N	02bb4712-1a6c-479c-a665-9eb33233da97	caja_principal	\N
b9195a2b-fe6c-4eef-8d7b-65445c689475	2026-03-02	EGRESO	Productos Limpieza: vinipel 100m	7000	tarjeta	\N	a8d159a3-5270-4e23-bb21-1224318e5f67	caja_principal	\N
c80971c3-5aa3-4f3d-9c1a-4b013a06aa6a	2026-03-02	EGRESO	Papelería: 2 Paquetes de tapas para caliente	38600	tarjeta	\N	fac721b9-3d8f-43c1-8d24-699df0f57987	caja_principal	\N
cf84306f-af07-4f02-a108-4f3cfb1dd702	2026-03-02	EGRESO	Papelería: rollo toallas de cocina	35800	tarjeta	\N	d1aece2a-1275-4e1b-a3f1-bf2e7ce20d2b	caja_principal	\N
5b0a4e42-fce7-4d82-a218-4774f5cdee4e	2026-03-02	EGRESO	Productos Limpieza: caja de guantes	18000	tarjeta	\N	3c918559-1a4b-4062-9dbb-489528eb5a66	caja_principal	\N
d23a918b-f2e0-432a-b3a1-ba8f5b39ad1b	2026-03-02	EGRESO	Lacteos: cuajada	13000	efectivo	\N	bf1e3de7-b965-4439-879b-ebd48ccfd1af	caja_principal	\N
32c2767a-979b-40f4-a55b-9f6870569538	2026-03-02	EGRESO	Frutas/Verduras: ajo	2000	efectivo	\N	4dcd3835-0e79-4664-850c-c83e5a9ae89e	caja_principal	\N
c3db0b51-75b4-4629-81d0-a8c5c62511a4	2026-03-02	EGRESO	Frutas/Verduras: tomate	10000	efectivo	\N	3f1b40a4-749f-4b4a-8126-75873a97d88f	caja_principal	\N
c5736e71-022a-46cf-a3fc-42ab6b28c237	2026-03-02	EGRESO	Otros: aromática	2000	efectivo	\N	441483e9-da67-4351-a3ea-d50d1641c373	caja_principal	\N
83296765-1fd6-45d3-84fe-36fcb80346bd	2026-03-02	EGRESO	Otros: pan del dia	2000	efectivo	\N	2fb65ed7-75e0-41e2-b2e1-5b410b86d80a	caja_principal	\N
ff9544dd-aa78-4c48-a4f8-c2033774ab7a	2026-03-02	EGRESO	Papelería: carpeta 	6000	efectivo	\N	6f9b2c9e-6048-4973-9cc1-d42a6e03db04	caja_principal	\N
080b4272-f745-4a9f-87f5-b6b5bcfdf1ec	2026-03-03	EGRESO	Otros: empanadas de emergencia	16000	nequi	\N	8855e4b3-810d-4df1-88a8-f79ba571cf2f	caja_principal	\N
6f5a25a9-0d64-4b77-9cab-5345d4fa3de3	2026-03-03	EGRESO	Frutas/Verduras: 2 paquetes maíz dulce	12000	nequi	\N	5e0e826b-9cc3-4078-84fe-2726a347f976	caja_principal	\N
fa98ce24-19af-49c8-9416-e23b5f0b44a3	2026-03-03	EGRESO	Otros: 3 Hatsu surtido x3	14400	nequi	\N	dde88d29-8f58-4ba5-af50-7a471c52166b	caja_principal	\N
5828aba2-a826-47ff-a01d-3deab09fd496	2026-03-03	EGRESO	Frutas/Verduras: champiñones	59000	efectivo	\N	2b7a5518-0a05-4590-b6be-045d01b69398	caja_principal	\N
135cd61f-33ce-4de6-a24a-4aa75629cccd	2026-03-03	EGRESO	Transporte: Domicilio orden 4025	6500	efectivo	\N	65e5727a-cbda-4af0-932b-88a773eeaac8	caja_principal	\N
967cebe1-0a84-4be0-ae69-309c3004bb25	2026-03-03	EGRESO	Inventario: Aguacates del dìa	12000	efectivo	\N	9930e81d-3d7f-4846-bd51-d74ee2652a33	caja_principal	\N
237750ec-f0f6-4693-910c-d6679950dac2	2026-03-03	EGRESO	Frutas/Verduras: aguacate	6000	efectivo	\N	\N	caja_principal	\N
cfa78ad9-c1cf-4c1a-941d-fadb816a8f12	2026-03-03	EGRESO	Frutas/Verduras: aguacates	6000	efectivo	\N	\N	caja_principal	\N
1eb47eee-5d61-4dea-8f21-f8fe7f77ff06	2026-03-03	EGRESO	Productos Limpieza: esponjas	1600	efectivo	\N	397cf515-fa98-49ae-a9ef-c1e6f0cf1a28	caja_principal	\N
30fe22cf-327f-4775-958f-a0dceaf139a4	2026-03-03	EGRESO	Otros: pan del dia	2000	efectivo	\N	113d1349-9288-47ac-b704-b01f294ce07e	caja_principal	\N
d03175ce-9f19-4729-9916-9cdad96201a2	2026-03-04	EGRESO	Otros: cheeseecake	36000	efectivo	\N	c9885bc3-8a5a-468e-a4a8-a2cb392a39a2	caja_principal	\N
a622226d-42ff-40bb-9f90-bbb454e19274	2026-03-04	EGRESO	Otros: empanadas	40000	efectivo	\N	fd72504d-a16e-4b69-a6bf-b2d20e3fc45e	caja_principal	\N
a706bc38-1968-46da-a3e3-dd263caab761	2026-03-04	EGRESO	Transporte: domicilio	4000	efectivo	\N	8ec92899-fbf9-4951-8b9d-bc00d7cf17da	caja_principal	\N
81843d91-428d-4c3d-a4ae-86ae84b4fbc0	2026-03-04	EGRESO	Otros: 9 unidades de hatsu	14400	nequi	\N	316d436f-07a3-4995-8680-f6703b1b92a5	caja_principal	\N
dc2c8f5e-bd89-415b-b274-d96221eec767	2026-03-04	EGRESO	Papelería: bolsa	200	nequi	\N	7fa081a3-2515-496b-9baf-2b4aefac5b13	caja_principal	\N
ee331079-a04e-4406-9cc5-3bbf6d81352d	2026-03-04	EGRESO	Inventario: Pepino 	2000	efectivo	\N	\N	caja_principal	\N
23a7c48c-2082-48d9-8b1a-144237335325	2026-03-04	EGRESO	Inventario: Pepinos	2000	efectivo	\N	2d468a8f-d30d-4ad9-b93a-599350078580	caja_principal	\N
177d0453-7182-4451-acd0-ab63fff1164a	2026-03-04	EGRESO	Inventario: Pepinos	2000	efectivo	\N	\N	caja_principal	\N
7772fbae-a383-46d7-ab19-685b2124ef74	2026-03-04	EGRESO	Inventario: Aguacates	12000	efectivo	\N	715bc4a5-6732-4f6a-8848-b0be51119a6a	caja_principal	\N
4874efef-b656-4927-8520-a0dd4b99a9ff	2026-03-04	EGRESO	Inventario: tocineta	30000	efectivo	\N	a8f71cfe-7132-4136-a4cc-d7ada1d1c3e0	caja_principal	\N
9034b4a0-fc9a-4a82-8710-538d0dc0a62e	2026-03-04	EGRESO	Otros: Pan del dia	2000	efectivo	\N	e3a0302e-17d2-4b64-ae0d-446bb60ada7e	caja_principal	\N
e5070479-d693-4e1f-b231-66725ae90672	2026-03-04	EGRESO	Transporte: Domicilio orden #	6500	efectivo	\N	0a4de6c4-7c40-47f9-a110-4ee42133298c	caja_principal	\N
e5e40123-5133-42da-b4a4-bbc2026e04d2	2026-03-04	EGRESO	Otros: cambio efectivo a nequi Miguel	4000	efectivo	\N	a9accfb4-28d4-4b16-9dc5-8fa37e8f3d4a	caja_principal	\N
c697d381-a285-4bcb-aa05-7e4320f6b28d	2026-03-05	EGRESO	Otros: pan del día	2000	efectivo	\N	765efd94-2923-4291-9496-7ba8b2b5d5c2	caja_principal	\N
853ea534-4b3a-4028-8956-cf9c245d90ae	2026-03-05	EGRESO	Inventario: Pan blanco	22000	efectivo	\N	b43ceef4-8b08-4863-b334-11363a2634bc	caja_principal	\N
4822dec2-c1e3-4ba5-8129-849eda631f07	2026-03-05	EGRESO	Inventario: Pan ciabatta	28000	efectivo	\N	c0619397-cce0-43d5-b057-dbc9d8103ca2	caja_principal	\N
c1e0092e-feed-42ab-bbe8-ec8a9da0f849	2026-03-05	EGRESO	Transporte: domicilio pan	4500	efectivo	\N	f29dc9b8-5336-48ed-a56e-3d1721f75483	caja_principal	\N
110d5072-0cff-431e-a06e-d1d6261846ec	2026-03-05	EGRESO	Transporte: domicilio #6766	7000	efectivo	\N	5172350c-ddcf-4d69-abe6-1a3b47a7e479	caja_principal	\N
0ebc1700-a3c1-4305-ba94-885fa874a3a4	2026-03-04	EGRESO	Salarios: Adelanto Jonathan	50000	nequi	\N	f38bea84-aa74-4868-8323-57fd7f139bec	caja_principal	\N
c22d1c28-bb2d-4e72-a483-1c83b695d0bc	2026-03-06	EGRESO	Papelería: Fotocopias	3000	efectivo	\N	11eeda16-9dc5-47d4-8e7b-5a325898933b	caja_principal	\N
59ef960c-058d-4b52-b3bd-1f0fb85cacbb	2026-03-06	EGRESO	Inventario: Limon	3000	efectivo	\N	04b3c08b-679a-4277-9899-791b09033313	caja_principal	\N
6797fc34-c7bf-4cfb-8a1b-46e6d94d1e2c	2026-03-06	EGRESO	Transporte: domicilio madelinne	7500	efectivo	\N	28065be2-058f-4fd3-9650-351607654a53	caja_principal	\N
db316192-45ae-45a9-9e86-78236551a07f	2026-03-06	EGRESO	Otros: Pan del dia	2000	efectivo	\N	8057e1f1-3d65-4225-96e0-1710ae3b7a8e	caja_principal	\N
aca95217-4e8e-4024-a49b-5905b8266ba7	2026-03-06	EGRESO	Inventario: Rúgala	3000	efectivo	\N	b5837f04-9174-4a26-b8c3-886d738c12b5	caja_principal	\N
d944f04f-8679-4ce0-ac1b-353fa8c87676	2026-03-06	EGRESO	Inventario: Cuajada	13000	efectivo	\N	478fb543-9e48-4145-980c-95f57c17fdc0	caja_principal	\N
29cb3ea0-18a3-4b1e-b89d-08e3db06866d	2026-03-07	EGRESO	Papelería: bolsas plásticas 	10000	efectivo	\N	e32e4138-83b6-4267-9e0a-1ee6a55355ee	caja_principal	\N
4c1a567c-fe44-42e8-8260-a062f0c5ff52	2026-03-07	EGRESO	Otros: Pan del dia	2000	efectivo	\N	3068b1a0-4d93-488e-8182-36eddd9717db	caja_principal	\N
5ae2773e-fc34-47fb-803e-c32ad43ea350	2026-03-09	EGRESO	Otros: Pan del dia	2000	efectivo	\N	1679801c-11fb-4e16-89ad-65dde3ed0aa0	caja_principal	\N
aceba460-81af-415f-b3a9-945a84787cf6	2026-03-09	EGRESO	Inventario: compra de cupcakes	25000	nequi	\N	7fc49935-ff22-4744-9ce4-293172c9916c	caja_principal	\N
d72e5ba5-c234-49f9-b5dc-85cf3d728009	2026-03-09	EGRESO	Inventario: compra de cupcakes	25000	nequi	\N	b669ea1c-2af6-44ea-98f9-621ce1fcaa0d	caja_principal	\N
64ac38ae-fc73-4bf5-91ed-df6a57a6eccb	2026-03-09	EGRESO	Inventario: compra de Torta del dia	55000	nequi	\N	a63052f8-5d56-4037-bfc7-7cdbcacefed4	caja_principal	\N
7031bd5d-4627-4a2f-ba96-933c2b7868a1	2026-03-09	EGRESO	Inventario: compra de cheeseecake	36000	nequi	\N	db2673eb-16c9-4513-a7bd-9e384e899476	caja_principal	\N
62a0bfe6-b50e-4d42-b800-fe478df927f8	2026-03-09	EGRESO	Inventario: Vinagre	7900	nequi	\N	554402c1-7949-4913-994b-94d5514c5945	caja_principal	\N
714c8be9-4d5e-4ec0-8289-af6b61a9d6f3	2026-03-09	EGRESO	Otros: Guantes de cocina	3400	nequi	\N	5dd39f8e-5a7f-458f-9da4-97d45063fd42	caja_principal	\N
18b6113b-f68b-4e8d-976e-458f4f219fad	2026-03-09	EGRESO	Inventario: Maíz dulce	18000	nequi	\N	036a0342-bf96-469a-88f4-a19a62c647d1	caja_principal	\N
bbeae753-18d0-40f3-bb89-21e2403060be	2026-03-09	EGRESO	Inventario: caja de aromática 	4000	nequi	\N	90c3679a-8750-4ddf-b5d1-6f15ee3a0cae	caja_principal	\N
27db6092-2202-4f36-a90b-84aec1f210c4	2026-03-09	EGRESO	Inventario: toallas para manos	4800	nequi	\N	4021997b-34fe-4bc5-ae11-7ddb6c9a0db0	caja_principal	\N
752fb790-c969-4048-85e7-8b21de28c550	2026-03-09	EGRESO	Inventario: Bolsas de basura 	3800	nequi	\N	b1fd0eb9-ad9d-430e-899a-7497d06afdd4	caja_principal	\N
afc1ae76-4474-4054-a4d2-0df39035a3cf	2026-03-09	EGRESO	Inventario: Sal de cocina	2700	nequi	\N	cdb304c9-4c00-4e75-9c39-c40053b09134	caja_principal	\N
07155762-d3f8-401c-be78-45f0a7c7d535	2026-03-09	EGRESO	Inventario: Azucar de cocina	3800	nequi	\N	3d4996e9-4b49-4496-8685-f06d21ea2e3b	caja_principal	\N
14c8c44f-91f3-4de4-8e8d-a7583ac08fbc	2026-03-09	EGRESO	Inventario: caja de aromática 	4000	nequi	\N	\N	caja_principal	\N
419841a8-f2a0-423e-b3b9-d646ecd7b672	2026-03-10	EGRESO	Inventario: Tomates	10000	efectivo	\N	31daa5c2-f8ab-4b99-8204-1d27eef4c22c	caja_principal	\N
6cd61700-eb90-4b5f-80e9-2834c0b46ae4	2026-03-10	EGRESO	Inventario: Aguacates	12000	efectivo	\N	08e45ef9-4bde-42d9-954c-470a0e35aaa8	caja_principal	\N
b2aba2a8-85b2-45ce-a7d9-3a21ff593e30	2026-03-10	EGRESO	Inventario: Romero	1000	efectivo	\N	b74a30bf-25f3-41f2-bee4-716cbac0b035	caja_principal	\N
797243d9-31df-47fc-88cf-50206d367110	2026-03-10	EGRESO	Inventario: Limones	6000	efectivo	\N	def04271-7552-4c5e-8f89-ff80c0b7fe27	caja_principal	\N
1239c87c-7e1b-4614-b623-66d4bd6e9041	2026-03-10	EGRESO	Papelería: Gorro para el pelo	3000	efectivo	\N	1ee55a0d-a25b-4829-b346-505d4354c9ff	caja_principal	\N
cf0bd6c6-3f5d-4851-a4f3-307962862713	2026-03-10	EGRESO	Inventario: Champiñones	59000	efectivo	\N	b27b0712-a784-4d65-97ba-9687e3197ca8	caja_principal	\N
fe594c85-78cc-4019-9bfb-5f16989f8e4a	2026-03-10	EGRESO	Inventario: tocineta	30000	efectivo	\N	17281f60-001f-4954-be1c-73a5df946e0b	caja_principal	\N
bf2b13c3-ee50-4556-9802-6e2a7f82dcac	2026-03-10	EGRESO	Otros: Pasta	18000	nequi	\N	48721a85-6514-4eb7-9275-2a3260f65810	caja_principal	\N
25be7230-6121-4249-aaeb-f8caea35dbc5	2026-03-11	EGRESO	Inventario: Cuajada para queso feta	13000	efectivo	\N	5f23112c-7dfd-48f7-b2af-6f37b77bac1d	caja_principal	\N
cfad6e0e-65c2-4ac9-97e8-ba0c680a58a4	2026-03-11	EGRESO	Papelería: Pitillos de papel x200	15000	efectivo	\N	48166ee6-7bf4-4533-ba11-5c0af911ffdf	caja_principal	\N
0cc110a5-5df4-4df0-84a9-c0473ebe8215	2026-03-11	EGRESO	Papelería: Guantes para manipulación de comida	2500	efectivo	\N	7d3d5d9e-9e1b-4ab7-a894-82b4f39ce55a	caja_principal	\N
937e3ffe-6fb4-4a7e-87d4-9caa35f611a1	2026-03-11	EGRESO	Otros: Colador	10500	efectivo	\N	5e96857a-aae1-4667-99b3-d82ca99f24ad	caja_principal	\N
48616d69-0ab4-4158-bd2c-0f104353415b	2026-03-11	EGRESO	Inventario: Lechuga	3000	efectivo	\N	99c11058-ef24-4db9-afef-7f29ecc8b2c6	caja_principal	\N
ecb27d02-8df4-44fe-a269-79110fb8f501	2026-03-12	EGRESO	Inventario: aguacate	12000	efectivo	\N	8be58bdc-6eb3-449e-a8d2-872030ea7331	caja_principal	\N
fb8e5a1d-b1dc-4a20-808b-a5c62d3e6ef5	2026-03-12	EGRESO	Inventario: aguacate	12000	efectivo	\N	\N	caja_principal	\N
a483bae2-a4ea-4ddd-a0ac-ffa9949c2ea3	2026-03-12	EGRESO	Inventario: aguacate	12000	efectivo	\N	\N	caja_principal	\N
0b03dd67-9d58-4b03-9296-fa1473a4991b	2026-03-12	EGRESO	Inventario: aguacate	12000	efectivo	\N	\N	caja_principal	\N
81274de3-6d5c-4afe-8840-ad7ac7fc619a	2026-03-12	EGRESO	Inventario: Cilantro	2000	efectivo	\N	97baf608-4a7b-4405-8dfd-73795cc77c74	caja_principal	\N
174a0ed2-04c0-45a5-b58d-ba96ec3f004b	2026-03-12	EGRESO	Inventario: Cilantro	2000	efectivo	\N	\N	caja_principal	\N
afe7555b-2b09-4d94-883e-383a1b8b86ee	2026-03-12	EGRESO	Inventario: Zanahoria 	2500	efectivo	\N	b8ec9e43-4ae5-4f9d-8663-f8990b2ea1fc	caja_principal	\N
e37bb9dc-1540-43a2-af11-7876a41d5882	2026-03-12	EGRESO	Inventario: Ajo	2000	efectivo	\N	0adfb505-81a3-4ba0-a60d-e4ba55637fa1	caja_principal	\N
2f212ed7-1cfb-40a4-9d03-a444004a7542	2026-03-12	EGRESO	Productos Limpieza: Jabón de loza crema	5200	efectivo	\N	612d98ae-e4df-47b4-8260-deb76b3af641	caja_principal	\N
c7bccc74-8feb-41fe-a9f5-dc3e40440807	2026-03-12	EGRESO	Otros: Pan de ayer y de hoy	4000	efectivo	\N	378f4f8f-dd0c-4e9e-91ea-f0e1350c80dd	caja_principal	\N
e030eacb-936d-40ae-aa92-79926a034b8d	2026-03-12	EGRESO	Papelería: facturero	4600	efectivo	\N	34225dac-976f-4763-b514-e67af0592287	caja_principal	\N
a4281e3d-dc52-4be1-af46-a695e4b5e1d3	2026-03-13	EGRESO	Otros: fotocopias	2000	efectivo	\N	3ce4cd20-e3da-40cc-a600-29955884cb92	caja_principal	\N
1615b6dd-8ca4-4317-b328-a19de292bc87	2026-03-16	EGRESO	Inventario: Aguacate	12000	efectivo	\N	\N	caja_principal	\N
b450ebd5-ee6c-4708-89a8-c8bfffff90d5	2026-03-16	EGRESO	Inventario: aguacate	12000	efectivo	\N	97c285c1-9bcc-4f3a-baee-577ac77053a0	caja_principal	\N
2ce0b314-7de6-4547-8563-7d5d97a137a0	2026-03-16	EGRESO	Inventario: tomate	9000	efectivo	\N	176a3e77-0299-4ca3-8f9b-fbaa726a06cd	caja_principal	\N
f1e7b812-45b8-43d9-8ba4-2db44825ddeb	2026-03-16	EGRESO	Inventario: pepino	6000	efectivo	\N	\N	caja_principal	\N
1a58783c-0b96-4c20-bfd3-ace92bfc4edc	2026-03-16	EGRESO	Inventario: Pepino	3000	efectivo	\N	fd31149f-9e97-4264-8542-751c805c28cc	caja_principal	\N
25792e67-e4ff-4a93-812c-820f83de8d49	2026-03-16	EGRESO	Inventario: Limones	6000	efectivo	\N	c92dc4a1-3a32-477e-9f7a-702ae5a91b9a	caja_principal	\N
59c49271-43c6-4be0-b44a-452d10ea7e0c	2026-03-16	EGRESO	Lacteos: Leche de almendras	8000	efectivo	\N	f4ecafb2-ba33-4f60-848a-683d24a6eac1	caja_principal	\N
fc8a06e4-551c-4692-9a75-3df87c86d442	2026-03-16	EGRESO	Inventario: Chips de arracacha	12000	efectivo	\N	56b42ecc-b19c-4758-bfcb-c1c4026fd761	caja_principal	\N
bf721d52-ef45-4a86-a4f9-badb33e535e1	2026-03-16	EGRESO	Inventario: Cupcakes de avena	30000	efectivo	\N	d9bd62a1-ad1b-423d-ae13-ca7668b86214	caja_principal	\N
0218207e-74f4-4ba2-8a50-16e6cce0ec5d	2026-03-16	EGRESO	Inventario: Cupcakes de banano	30000	efectivo	\N	c5ec61e4-50a1-4531-a8fc-cab572796417	caja_principal	\N
e3f5ce8c-86bd-4b86-8524-64b983f816d0	2026-03-16	EGRESO	Otros: pan del dia	2000	efectivo	\N	be9974b1-e0b8-411d-8418-a960623a9af9	caja_principal	\N
df012241-085d-4456-adda-e6a0adc0a196	2026-03-16	EGRESO	Inventario: Tocineta	30000	efectivo	\N	6a8dbc03-80ef-409e-a0fc-d14aa46e195c	caja_principal	\N
36cde4ea-1379-412c-ade1-0689083950d5	2026-03-16	EGRESO	Inventario: Tocineta	30000	efectivo	\N	\N	caja_principal	\N
dab2a2b7-e011-4cf8-9358-7ccdf45251ea	2026-03-16	EGRESO	Papelería: facturera	2300	efectivo	\N	b7997f6a-b827-4b57-8868-88ffc24b7c7e	caja_principal	\N
c8908944-85b6-43e6-a4ba-f264d0d2a2f1	2026-03-16	EGRESO	Salarios: Adelanto Jonathan	50000	efectivo	\N	f99c1c28-cc55-404f-9719-f3b2e6749c65	caja_principal	\N
8b45ab09-5f7d-455f-acfa-42a1a07850d6	2026-03-17	EGRESO	Inventario: Champiñones	29500	efectivo	\N	6d47d7ed-0898-4b66-be13-f501e6540c6b	caja_principal	\N
2a4ea2a4-12ab-4d9c-8260-5e45e71692aa	2026-03-17	EGRESO	Inventario: Cebolla	6000	efectivo	\N	91446825-c5c1-40f6-9e9b-e23b49a3037f	caja_principal	\N
183d8fe3-f96f-41b8-8ee9-f5e1141a666f	2026-03-17	EGRESO	Inventario: Ajo	2000	efectivo	\N	daf5eecc-fd72-4323-a646-effd2f5d5bde	caja_principal	\N
17e78fc2-19a9-4001-b756-9b9c560dcc59	2026-03-17	EGRESO	Salarios: Pago Tania (23 Feb - 28 Feb)	192800	nequi	\N	b3dabf78-b43b-4e27-a279-3f03730aa346	caja_principal	\N
dd889e5e-290c-4b27-8127-5e490f442dde	2026-03-17	EGRESO	Salarios: Pago Johnnatan (23 Feb - 28 Feb)	433000	nequi	\N	22ba3afd-98db-45db-9a29-11fe58ad6218	caja_principal	\N
3170fc70-12b8-4ae4-83f2-ebe65d227d67	2026-03-17	EGRESO	Salarios: Pago Erica (23 Feb - 28 Feb)	470500	efectivo	\N	fbec2661-5b7e-4d13-abc1-1c455bc628e7	caja_principal	\N
729829c1-1b2c-4c70-a12e-df26ebe4d7b6	2026-03-17	EGRESO	Salarios: Adelanto Pago Johnathan (1 Mar - 15 Mar)	50000	nequi	\N	77303d88-28b8-4c65-b8e5-72f446895845	caja_principal	\N
689b3184-6b61-487f-9dc2-dc5730ad202f	2026-03-17	EGRESO	Salarios: Pago Johnathan (1Mar - 15Mar)	50000	efectivo	\N	dc6459e2-409a-4fe3-82f9-4cd2a1624051	caja_principal	\N
feefd52f-1a5e-4bd2-9a00-4d3d241beb2c	2026-03-17	EGRESO	Otros: Pan del dia	2000	efectivo	\N	9a704157-d0a9-4e6e-bb63-9e6dd35d7ae3	caja_principal	\N
06863c0b-5610-433c-898d-ae4029428b28	2026-03-06	EGRESO	Inventario: Compra Carne desmechada	58000	nequi	\N	218b9ee9-80cf-46dc-a47e-57d6a08c3903	caja_principal	\N
f613fe4e-e15a-4d12-9541-bb6401cc16a5	2026-03-14	EGRESO	Inventario: Cerdo y Pollo	180600	provision_caja	\N	10e90ae8-4c16-488b-b657-893d6fc1e3ed	caja_principal	\N
3254ea0a-2776-475b-ab1d-2c0ca9945a05	2026-03-08	EGRESO	Inventario: Carnes Pollo, cerdo y res	180600	provision_caja	\N	4e31b27a-dcba-447b-b064-468077403739	caja_principal	\N
2f8c9596-873f-45f5-92ed-784decff4c77	2026-03-17	EGRESO	Inventario: Ajo	2000	efectivo	\N	\N	caja_principal	\N
\.


--
-- Data for Name: empleados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."empleados" ("id", "nombre", "telefono", "email", "horas_dia", "dias_semana", "salario_hora", "activo", "created_at", "updated_at", "horario_base", "tipo_contrato", "salario_mensual", "incluye_auxilio_transporte") FROM stdin;
586f00ea-c4a9-4cba-8092-6643bb499056	Briyith Estrada	3046319664	brithpra@gmail.com	1	1	0	t	2025-10-03 18:08:16.752218+00	2026-03-17 22:12:17.133395+00	{"friday": {"hours": 0, "active": false}, "monday": {"hours": 0, "active": false}, "sunday": {"hours": 0, "active": false}, "tuesday": {"hours": 0, "active": false}, "saturday": {"hours": 0, "active": false}, "thursday": {"hours": 0, "active": false}, "wednesday": {"hours": 0, "active": false}}	por_horas	0	t
7bcc6f37-afc9-424e-8aa7-c15de6850131	Tania Guerrero	3184612204	a@mail.com	4	5	0	t	2026-03-03 20:10:47.04544+00	2026-03-06 03:27:46.145301+00	\N	por_horas	0	t
795b7d91-1870-44bf-8b7a-c1c0cdc797df	Jonathan David Ortega	3158278421‬	na@mail.com	8	6	0	t	2026-02-26 01:10:51.17061+00	2026-03-06 15:09:55.581022+00	\N	salario_fijo	1600000	t
a3c8dd81-9ad7-48bd-96d3-f9d10f99bddc	Erica Patiño	3155632995	na@mail.com	8	6	0	t	2026-02-26 01:09:11.76571+00	2026-03-17 21:34:55.951948+00	{"friday": {"hours": 8, "active": true}, "monday": {"hours": 8, "active": true}, "sunday": {"hours": 0, "active": false}, "tuesday": {"hours": 8, "active": true}, "saturday": {"hours": 5, "active": true}, "thursday": {"hours": 8, "active": true}, "wednesday": {"hours": 8, "active": true}}	por_horas	0	t
888efeea-7b4d-493a-bcad-46a0ddedcddc	Miguel			1	1	0	t	2025-09-22 00:31:21.349065+00	2026-03-17 22:11:46.333289+00	{"friday": {"hours": 0, "active": false}, "monday": {"hours": 0, "active": false}, "sunday": {"hours": 0, "active": false}, "tuesday": {"hours": 0, "active": false}, "saturday": {"hours": 0, "active": false}, "thursday": {"hours": 0, "active": false}, "wednesday": {"hours": 0, "active": false}}	por_horas	0	t
6609d6be-f433-4020-96f3-8185ea637b2d	Javier	3105064328	javierandres.008@hotmail.com	1	1	0	t	2025-10-06 14:41:16.025802+00	2026-03-17 22:12:03.065255+00	{"friday": {"hours": 0, "active": false}, "monday": {"hours": 0, "active": false}, "sunday": {"hours": 0, "active": false}, "tuesday": {"hours": 0, "active": false}, "saturday": {"hours": 0, "active": false}, "thursday": {"hours": 0, "active": false}, "wednesday": {"hours": 0, "active": false}}	por_horas	0	t
\.


--
-- Data for Name: employee_credit_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."employee_credit_history" ("id", "empleado_id", "order_id", "order_numero", "monto", "tipo", "timestamp") FROM stdin;
260b5f85-da53-4cde-878f-6e8719509c3e	6609d6be-f433-4020-96f3-8185ea637b2d	904364e6-4648-47dc-b113-cc16b8e028ca	5313	8000	cargo	2025-10-07 22:25:13.249394+00
252c157a-b3bc-4b67-9aa9-4a434efbe4fb	6609d6be-f433-4020-96f3-8185ea637b2d	144ab9c9-3a84-4421-a746-073524df4daa	6559	8000	cargo	2025-10-09 22:53:12.782236+00
2f26d573-2aac-4e7b-820f-fcbe7f3a7918	6609d6be-f433-4020-96f3-8185ea637b2d	7903a752-459e-4f1d-b0b2-756db524dee5	2932	8000	cargo	2025-10-10 01:13:58.97985+00
c5908015-5f61-450b-a3c3-66a2c27222aa	6609d6be-f433-4020-96f3-8185ea637b2d	59b97f38-4d81-499d-b764-bea462ccbb5b	8424	18500	cargo	2025-10-10 19:39:10.676757+00
212c878b-0aa7-494d-8e2a-bb36b38e6c6f	586f00ea-c4a9-4cba-8092-6643bb499056	6a16b610-8ff7-4838-af69-aae695a1a7c4	2304	8000	cargo	2025-10-15 19:01:22.489567+00
7f6d47a5-1095-47c4-9d9b-630ddc4a215e	586f00ea-c4a9-4cba-8092-6643bb499056	bbd89a91-d526-4068-b009-00142e7158f3	8433	8000	cargo	2025-10-16 22:58:28.158451+00
7f38fcc4-06f9-4027-aba8-2faadcbb0054	586f00ea-c4a9-4cba-8092-6643bb499056	cf6bebdc-221e-4c22-aa51-853b241412d2	6552	15500	cargo	2025-10-17 21:19:15.029637+00
4c959540-236d-4341-8f60-0381bb51893c	6609d6be-f433-4020-96f3-8185ea637b2d	2864874a-a004-498b-b13d-51b3ecf1a6e1	6832	18500	cargo	2025-10-17 22:36:27.492893+00
0fe0d87e-6a3b-4ac5-b6a9-25c3408f12b0	586f00ea-c4a9-4cba-8092-6643bb499056	e5bfef01-9be6-42de-b72e-bd26047e3cb2	4344	8000	cargo	2025-10-21 18:50:46.739491+00
55daaae6-28e5-4856-a3f3-d670d6a89f2f	586f00ea-c4a9-4cba-8092-6643bb499056	069bb11f-ba33-4b7e-afb9-756a929c237b	6464	45500	cargo	2025-10-23 22:58:33.461998+00
5d27674a-2dff-4149-9682-28f91069134d	6609d6be-f433-4020-96f3-8185ea637b2d	0265b312-dcdf-4f6f-b384-464320cc1d64	9302	95500	cargo	2025-11-03 14:52:19.666821+00
56621029-c23b-4959-b39e-a4798e56b930	586f00ea-c4a9-4cba-8092-6643bb499056	7b2d7052-1674-435c-8f08-30051420d9e3	9042	7000	cargo	2025-11-05 00:05:01.06771+00
994cd253-3740-4601-b492-921e0d5a8286	586f00ea-c4a9-4cba-8092-6643bb499056	51a4fd5b-2786-47d8-b3b1-91ca7bda4929	6922	4500	cargo	2025-11-05 00:17:56.658446+00
e7a935dc-39f1-48f1-82b0-7873dcb06e61	586f00ea-c4a9-4cba-8092-6643bb499056	547a458a-ae69-42bf-b17e-80cffc146b5b	7664	15000	cargo	2025-11-05 00:19:00.911672+00
5af32775-acd8-4b8c-9b3b-1107c0028895	586f00ea-c4a9-4cba-8092-6643bb499056	4d8bace4-8a76-4ec3-96f9-5345af591dd8	5531	8000	cargo	2025-11-05 17:13:19.504603+00
c6857bce-307a-4c66-8f2d-47b5ea65300a	586f00ea-c4a9-4cba-8092-6643bb499056	995e7b91-dcf7-4a70-ba00-f109b8bdafc5	2361	15000	cargo	2025-11-05 19:19:55.645965+00
1a5eebeb-5976-47e9-9c16-8fa7439e8bf6	586f00ea-c4a9-4cba-8092-6643bb499056	995e7b91-dcf7-4a70-ba00-f109b8bdafc5	2361	15000	abono	2026-01-31 21:29:16.213783+00
05d93e8e-d450-4e2f-8763-b2e8e2daa0d5	586f00ea-c4a9-4cba-8092-6643bb499056	30ee46b4-7d4f-41d4-8106-d8c9d14ca69c	5143	9500	cargo	2026-02-23 17:57:43.490182+00
d14a80a4-4268-42c6-91f1-b0722c627c79	888efeea-7b4d-493a-bcad-46a0ddedcddc	eb87a882-bddc-4481-ae3b-fe4675d8740c	9156	17000	cargo	2026-02-23 19:33:24.372609+00
344522a0-cfb0-4ab5-8fdf-bfea2d94881b	586f00ea-c4a9-4cba-8092-6643bb499056	2731592d-56d1-4767-926e-e1a4263f87f6	9066	16000	cargo	2026-02-24 00:33:58.500519+00
1285bb00-a8e8-4ec9-b15e-6063081d4fd0	586f00ea-c4a9-4cba-8092-6643bb499056	b9e977e5-3cbd-4bae-b26b-87da91b55747	2538	85000	cargo	2026-02-24 00:49:13.935494+00
2f83ea20-00be-4684-a395-1703fd88c8b4	586f00ea-c4a9-4cba-8092-6643bb499056	6b97d0d8-72ca-4f19-8a87-f88824a9cfb6	9708	5000	cargo	2026-02-24 00:53:30.565289+00
0f0c2d3a-fc7a-4881-88c4-b4b0081afca6	586f00ea-c4a9-4cba-8092-6643bb499056	6a16b610-8ff7-4838-af69-aae695a1a7c4	2304	8000	abono	2026-02-24 00:54:32.086175+00
1362e38e-a274-4335-afc7-be64d95656fa	586f00ea-c4a9-4cba-8092-6643bb499056	bbd89a91-d526-4068-b009-00142e7158f3	8433	8000	abono	2026-02-24 00:54:36.857106+00
f188a085-01a4-4e87-b257-131d190932d5	586f00ea-c4a9-4cba-8092-6643bb499056	e5bfef01-9be6-42de-b72e-bd26047e3cb2	4344	8000	abono	2026-02-24 00:55:13.457352+00
9477bb08-8bac-476f-9887-72eecaf92d0b	6609d6be-f433-4020-96f3-8185ea637b2d	59a65cec-0f0a-4095-acb1-23a4e3f544b6	8198	16000	cargo	2026-02-25 00:18:27.072894+00
07dd75f8-63ec-4267-803f-e40dee26a27d	888efeea-7b4d-493a-bcad-46a0ddedcddc	12faaac0-0094-4bae-b539-e06281b943ec	8256	16000	cargo	2026-02-27 19:44:53.591307+00
9861d77e-b107-41fd-9e68-224b8ddc5304	888efeea-7b4d-493a-bcad-46a0ddedcddc	8db617e0-d976-4c40-8402-63e273feedb5	7053	6000	cargo	2026-02-27 20:45:11.742528+00
de482ddd-a3d5-426e-b6af-ea97926d43ff	888efeea-7b4d-493a-bcad-46a0ddedcddc	55385d16-553a-4bb8-a910-fb5a7df769bd	8567	17000	cargo	2026-02-27 23:47:10.428297+00
f2479896-9e42-482b-913e-1091cf57a157	795b7d91-1870-44bf-8b7a-c1c0cdc797df	5a58477e-3d7e-4b3c-9dc7-64c0fc80fc83	7966	6000	cargo	2026-03-02 00:22:07.893411+00
d77f76c0-62cb-4a43-918f-56bc988a6d90	a3c8dd81-9ad7-48bd-96d3-f9d10f99bddc	dffd52dd-5a57-43e0-b89b-b18b7c66db64	6810	6000	cargo	2026-03-02 00:24:03.753487+00
e1018980-ffcb-4ab4-8bd0-5a5f313fcd0f	a3c8dd81-9ad7-48bd-96d3-f9d10f99bddc	3aae4e92-7e4a-405b-b856-f56247207203	3757	6000	cargo	2026-03-02 00:27:43.616352+00
2762a503-94df-483c-8184-653168602b28	888efeea-7b4d-493a-bcad-46a0ddedcddc	51b0e86d-8087-4845-b0f2-51ebcf3b660f	3935	17000	cargo	2026-03-02 20:11:02.059447+00
5fff8550-ea5e-419e-9df2-5f9095194526	888efeea-7b4d-493a-bcad-46a0ddedcddc	231ec8f1-cf2f-415a-8b95-0efb5d748fa1	8909	16000	cargo	2026-03-02 23:35:10.198303+00
8fc45a3c-355c-4bd7-9c13-ae3040b560e6	795b7d91-1870-44bf-8b7a-c1c0cdc797df	b220b21d-57b4-4485-90d2-00d102a13bd5	1966	5500	cargo	2026-03-03 19:59:46.245553+00
ff8099dd-4f62-4892-a42c-efe2ef91015d	888efeea-7b4d-493a-bcad-46a0ddedcddc	dfc3d669-7245-45ff-b720-33581d7f270e	9929	16000	cargo	2026-03-03 20:27:40.542221+00
f4c69ccd-f889-4f17-96ab-5d5ae72f89e6	7bcc6f37-afc9-424e-8aa7-c15de6850131	02138fc1-f29b-4c80-90fb-a7c324f110b2	5177	16000	cargo	2026-03-03 20:35:43.368696+00
5bc0b1b8-520e-479c-9723-899208e621da	a3c8dd81-9ad7-48bd-96d3-f9d10f99bddc	0fc60b67-bf6e-4567-906a-22b9831d57f2	2807	6000	cargo	2026-03-03 21:01:50.582631+00
ae7f8829-fb73-43b6-a2c9-9b865e298a90	888efeea-7b4d-493a-bcad-46a0ddedcddc	d4562f5a-3ce8-4678-9caa-c696468a5463	3802	17000	cargo	2026-03-04 00:55:30.475974+00
dab1730f-8349-4ae9-b83c-1c3f58a70814	586f00ea-c4a9-4cba-8092-6643bb499056	4ca32d17-67b9-4f47-be28-7a3d16497d58	5912	5500	cargo	2026-03-04 02:24:44.535716+00
3fdc0d86-a56d-45e7-a4ac-37515cbe20b9	a3c8dd81-9ad7-48bd-96d3-f9d10f99bddc	e5745e4a-6282-403e-9d0f-687c2c8a3cfb	9162	6000	cargo	2026-03-04 20:03:44.256202+00
7fc77fe4-fe46-4ae6-985c-8ff5580234b8	888efeea-7b4d-493a-bcad-46a0ddedcddc	792bcf28-75dd-48e6-a8fd-155dd69e7609	3703	16000	cargo	2026-03-05 00:15:03.853556+00
0fa6ceda-4139-4408-98d2-463a5e5f4acb	795b7d91-1870-44bf-8b7a-c1c0cdc797df	7c5ea64b-e701-41cc-bbe8-beb448eadfec	4498	5500	cargo	2026-03-05 01:18:32.419298+00
52a216ec-3b74-4693-8387-14ae70cb6b04	888efeea-7b4d-493a-bcad-46a0ddedcddc	7fcec3a4-88cc-4b77-8769-1c8bbaf21e6e	5850	16000	cargo	2026-03-06 00:01:06.162438+00
5e35a89c-e28e-479f-9324-fad51f287d17	888efeea-7b4d-493a-bcad-46a0ddedcddc	c2204cb6-2a33-46e6-a364-9b5507a5081e	8100	17000	cargo	2026-03-06 00:02:30.909298+00
9c62bffb-fc57-47f0-a2e6-9d82679fc69a	888efeea-7b4d-493a-bcad-46a0ddedcddc	fc45e897-a785-4ebe-81c1-3ab20e6644b0	3876	25500	cargo	2026-03-06 16:35:31.618797+00
15c5d103-ab1d-4ac1-8586-b5c8ce05410f	888efeea-7b4d-493a-bcad-46a0ddedcddc	d3a287cd-96ed-4d14-82c3-e23433ab2119	9493	16000	cargo	2026-03-06 20:13:51.769439+00
022105fc-9a7e-464b-be91-b3759998c705	a3c8dd81-9ad7-48bd-96d3-f9d10f99bddc	550f4249-3658-4580-8e06-82b40534831e	5485	6000	cargo	2026-03-06 20:38:38.132887+00
becfc079-fade-40c7-9ac4-d6610ae0b087	888efeea-7b4d-493a-bcad-46a0ddedcddc	1f4a4893-f04a-4e3c-8be7-94a94069cb6d	1	16000	cargo	2026-03-06 23:41:55.175735+00
919221d6-4782-4e7b-8802-a86a6cdee4be	586f00ea-c4a9-4cba-8092-6643bb499056	cc81b2e7-6643-40b6-871a-16b6bcdc93d3	5	19000	cargo	2026-03-07 18:36:21.419017+00
da4e00dd-a83a-4b26-995a-0352a1804fde	888efeea-7b4d-493a-bcad-46a0ddedcddc	cc81b2e7-6643-40b6-871a-16b6bcdc93d3	5	16000	cargo	2026-03-07 18:36:21.602032+00
88023fb6-240a-4407-8c7b-a6f8e3880197	a3c8dd81-9ad7-48bd-96d3-f9d10f99bddc	353e0ca6-531d-48a9-a911-4c65f43e434b	6	12000	cargo	2026-03-07 19:15:10.558092+00
8d59c86f-a42e-47d2-bdf2-529c0ed965ee	a3c8dd81-9ad7-48bd-96d3-f9d10f99bddc	f4670570-8083-45b7-8c15-dc485e2bdf2f	10001	6000	cargo	2026-03-09 19:52:57.205717+00
39dbe800-80da-4293-8395-cbdda38abd53	888efeea-7b4d-493a-bcad-46a0ddedcddc	03e02dbd-a6c4-4255-babe-04ffc6070c76	10002	16000	cargo	2026-03-09 20:24:58.389186+00
14d69038-77f9-431a-902b-854cb104e6fd	7bcc6f37-afc9-424e-8aa7-c15de6850131	fecf2df4-b7e5-4789-bdb7-7d974f912402	10003	8800	cargo	2026-03-09 20:26:45.858675+00
23b9c356-081a-4a49-801b-52286b21e512	888efeea-7b4d-493a-bcad-46a0ddedcddc	28ed2905-b7b7-4cba-b29a-c6ec7a3cae9a	10005	1000	cargo	2026-03-09 20:34:41.463053+00
4d781aa2-a352-4a62-933d-6202a2a693c7	795b7d91-1870-44bf-8b7a-c1c0cdc797df	c813534d-5c15-4ee3-95d6-d9ec53ebbbdf	10006	8800	cargo	2026-03-09 20:36:44.65969+00
9038be02-96bf-4c30-b618-458de856e16e	795b7d91-1870-44bf-8b7a-c1c0cdc797df	7ebed9da-08cb-40ed-b966-be35b58dedfd	10007	8800	cargo	2026-03-09 20:37:34.771096+00
2f084aa6-ecc2-4687-9cce-eb634dab6b47	586f00ea-c4a9-4cba-8092-6643bb499056	60b2a83a-e350-460c-a943-9cafff7723cb	10009	6800	cargo	2026-03-09 23:26:44.855788+00
69ce4db6-c4ed-42a6-b9d7-971984f52739	a3c8dd81-9ad7-48bd-96d3-f9d10f99bddc	6aca7e58-b823-44b5-9af3-271e4051d474	10019	6000	cargo	2026-03-10 19:35:29.321068+00
9c3fe06f-f2bb-4ea1-b8bc-f4ca48b4f2c5	7bcc6f37-afc9-424e-8aa7-c15de6850131	4a4a6432-17d1-405f-a0b6-f81c079f5cf7	10020	6000	cargo	2026-03-10 19:38:59.895623+00
3defc305-924f-42ec-b16e-177210780460	888efeea-7b4d-493a-bcad-46a0ddedcddc	ed0fb156-f5c4-42da-970f-95bf45e06240	10022	17000	cargo	2026-03-10 19:50:47.182231+00
48072618-4cb6-4a43-972c-bbc8b801fcbf	a3c8dd81-9ad7-48bd-96d3-f9d10f99bddc	f0471a9f-6da1-4b7c-a7b6-b10ba959d623	10028	33000	cargo	2026-03-10 23:59:24.270727+00
d389464b-5543-495d-8fed-35698b35055b	a3c8dd81-9ad7-48bd-96d3-f9d10f99bddc	e8f1a985-a8e8-4b9e-9666-1a498383b9bb	10029	1000	cargo	2026-03-11 00:17:26.661883+00
972fff66-1efe-4ff2-8215-79b620b9f431	888efeea-7b4d-493a-bcad-46a0ddedcddc	29410a76-8b20-408c-b760-2bf3b1978f28	10040	16000	cargo	2026-03-11 20:04:25.266108+00
0813aa92-beed-4745-a385-faab2c763de2	7bcc6f37-afc9-424e-8aa7-c15de6850131	b94d57cc-07f5-4404-a15f-e4d7fe04d3f7	10042	36000	cargo	2026-03-11 20:15:03.366553+00
c48c9bba-0755-4832-a7b4-04ab5597dda9	795b7d91-1870-44bf-8b7a-c1c0cdc797df	e4b0564d-b370-4d3b-99c3-8be220bfcf6e	10045	8800	cargo	2026-03-11 22:29:54.024966+00
a7518034-59de-41fc-a0d8-e78b53ad4eb4	586f00ea-c4a9-4cba-8092-6643bb499056	57f8275c-3e96-42fb-8a01-f90aeea5453c	10046	18000	cargo	2026-03-11 23:20:37.749314+00
c51a87f9-9bcc-4442-aa5d-c03a886ab9ad	888efeea-7b4d-493a-bcad-46a0ddedcddc	e0a91e3b-682d-4667-9023-8b324dcaf8c8	10051	16000	cargo	2026-03-12 19:23:57.841768+00
9ea312c1-fab9-43cd-8b2d-9485b48982be	586f00ea-c4a9-4cba-8092-6643bb499056	d43135f2-0fee-4f0e-92ab-f69cfc4bb15a	10052	10500	cargo	2026-03-12 20:53:29.61576+00
29cffa6f-5f91-4820-a08c-8eb85b13d7d5	586f00ea-c4a9-4cba-8092-6643bb499056	30d52eb4-3acd-453e-a9f4-f89bb269c87e	10053	12000	cargo	2026-03-12 22:04:10.537028+00
be9ab173-b417-4984-bc0b-0c642e4e96e6	795b7d91-1870-44bf-8b7a-c1c0cdc797df	28b971dd-0e71-4f7a-ae85-c35acfe90a91	10054	17300	cargo	2026-03-12 22:30:32.027633+00
748f6e3e-8522-4847-9b97-18fbc447e4ef	586f00ea-c4a9-4cba-8092-6643bb499056	70f29d82-64c2-4f98-aefd-54f9ee9d1300	10058	13600	cargo	2026-03-12 23:52:47.475834+00
9167eda0-7e63-446b-8aaa-6eec9f08e1e2	888efeea-7b4d-493a-bcad-46a0ddedcddc	bd9a0c41-19f0-4db9-88dc-a666cf207342	10060	16000	cargo	2026-03-13 00:15:10.983073+00
7a90a606-17e4-4187-94cb-59924b65c0a2	7bcc6f37-afc9-424e-8aa7-c15de6850131	2cb28d84-4321-4994-aff6-a0f5cbffa23c	10062	9300	cargo	2026-03-13 16:53:29.438329+00
772a2d23-e562-440b-8a5e-622d9ea29997	888efeea-7b4d-493a-bcad-46a0ddedcddc	97e8ec60-7c5e-495f-b480-3ed622693759	10070	16000	cargo	2026-03-13 20:04:46.717034+00
28a02ca9-2752-4048-a761-0a5041304060	a3c8dd81-9ad7-48bd-96d3-f9d10f99bddc	57f5398d-1efd-44d5-a141-a6f14cf30f1e	10071	6000	cargo	2026-03-13 20:20:26.928185+00
a26b8d5b-e71c-4b1a-a5ac-97ee61155177	888efeea-7b4d-493a-bcad-46a0ddedcddc	018b1c5f-73cf-410e-9ea1-73ecd9dbead4	10077	16000	cargo	2026-03-14 18:36:08.043516+00
5fc5dcff-10c7-4763-9f31-e111c96af38f	795b7d91-1870-44bf-8b7a-c1c0cdc797df	9c55c61f-a3c9-4d2b-995c-4dde837cb1d5	10080	4000	cargo	2026-03-14 20:17:10.876374+00
43f4725e-41b6-4945-8402-489b9bff73d4	888efeea-7b4d-493a-bcad-46a0ddedcddc	676047eb-8275-47f0-a2a8-07f51ef78354	10084	16000	cargo	2026-03-16 20:21:09.501297+00
f192c3a4-8148-4769-9f4d-bc36016efef6	888efeea-7b4d-493a-bcad-46a0ddedcddc	f44d40bc-5a5b-4a34-ba51-fe6faa781665	10094	16000	cargo	2026-03-17 19:43:51.070113+00
\.


--
-- Data for Name: employee_shifts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."employee_shifts" ("id", "empleado_id", "fecha", "hora_llegada", "hora_salida", "novedad", "novedad_inicio", "novedad_fin", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: employee_weekly_hours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."employee_weekly_hours" ("id", "empleado_id", "week_key", "horas", "created_at", "updated_at") FROM stdin;
b29205b1-2bca-4214-a2cb-579459e24471	6609d6be-f433-4020-96f3-8185ea637b2d	2025-W41	{"friday": 8, "monday": 10, "sunday": 0, "tuesday": 8, "saturday": 0, "thursday": 8, "wednesday": 8}	2025-10-06 15:08:33.699087+00	2025-10-06 15:08:33.699087+00
afbef5e8-ade3-4532-8ef8-c30a84e613d7	888efeea-7b4d-493a-bcad-46a0ddedcddc	2025-W41	{"friday": 4, "monday": 4, "sunday": 0, "tuesday": 4, "saturday": 0, "thursday": 4, "wednesday": 4}	2025-10-07 16:49:43.069508+00	2025-10-07 16:49:43.069508+00
b9b167e2-3739-457d-b574-e786b6e25b65	a3c8dd81-9ad7-48bd-96d3-f9d10f99bddc	2026-W12	{"friday": 8, "monday": 8, "sunday": 0, "tuesday": 8, "saturday": 5, "thursday": 8, "wednesday": 8}	2026-03-17 21:34:56.850019+00	2026-03-17 21:34:56.850019+00
b1ec2854-8a9b-48ae-8d0d-86177a6646ba	a3c8dd81-9ad7-48bd-96d3-f9d10f99bddc	2026-W09	{"friday": 8, "monday": 8, "sunday": 0, "tuesday": 8, "saturday": 5, "thursday": 8, "wednesday": 8}	2026-03-17 21:35:22.355886+00	2026-03-17 21:35:22.355886+00
6795491a-ca44-4563-a3f6-23c7a2bc9b69	a3c8dd81-9ad7-48bd-96d3-f9d10f99bddc	2026-W10	{"friday": 8, "monday": 8, "sunday": 0, "tuesday": 8, "saturday": 5, "thursday": 8, "wednesday": 8}	2026-03-04 01:17:49.223875+00	2026-03-17 21:56:40.670859+00
4b1814b8-d5ee-4036-9d68-05795f1d7b1c	a3c8dd81-9ad7-48bd-96d3-f9d10f99bddc	2026-W11	{"friday": 8, "monday": 8, "sunday": 0, "tuesday": 8, "saturday": 4, "thursday": 8, "wednesday": 8}	2026-03-17 22:02:12.036048+00	2026-03-17 22:02:12.036048+00
517bb27e-a226-4242-a1bb-d1f499d38ab9	888efeea-7b4d-493a-bcad-46a0ddedcddc	2026-W12	{"friday": 0, "monday": 0, "sunday": 0, "tuesday": 0, "saturday": 0, "thursday": 0, "wednesday": 0}	2026-03-17 22:11:34.282802+00	2026-03-17 22:11:34.282802+00
bad95f9e-c678-4da9-86a1-1cd2f33786ac	888efeea-7b4d-493a-bcad-46a0ddedcddc	2026-W09	{"friday": 0, "monday": 0, "sunday": 0, "tuesday": 0, "saturday": 0, "thursday": 0, "wednesday": 0}	2026-03-17 22:11:48.816946+00	2026-03-17 22:11:48.816946+00
\.


--
-- Data for Name: gasto_inventario_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."gasto_inventario_items" ("id", "gasto_id", "menu_item_id", "cantidad", "inventario_tipo", "unidad_inventario", "created_at", "precio_unitario") FROM stdin;
a8052f27-4495-4f0a-8c2b-56cfd77799b4	97baf608-4a7b-4405-8dfd-73795cc77c74	43d1bcff-0798-43db-beea-f7c8873acc3c	2.000	cantidad	\N	2026-03-12 17:39:49.25291+00	1000.00
3665ccfa-fb7c-49c2-8570-c6d8be40656a	50840a65-4605-472f-8057-8d3d1f4f578e	054aac2c-295e-4f36-8c32-445ca1757b0d	1.000	cantidad	\N	2026-02-24 19:03:32.77154+00	1500.00
5dee06d7-dc1b-47f1-8d5e-afbade357c2b	1063f5d2-c3a5-4126-ba1a-cff3588f1a6e	92eb415e-32bb-4638-a66e-941862fa4cbf	1.000	cantidad	\N	2026-02-24 19:04:02.312152+00	1000.00
3e5d305a-02cc-4e22-9882-51cf219bedb3	fb5dc2db-1137-4373-a52d-2e6a8b0cea86	c8d3d813-2118-4791-a0e5-69b951cfb7f1	2.000	cantidad	\N	2026-02-24 19:04:45.678583+00	6000.00
73961ce6-6d2e-4e5c-8cf3-3a919020aa31	3eb652d8-5894-4407-a609-1d00670defc8	0a9fb586-45eb-49ce-a175-736c13281eb2	1.000	cantidad	\N	2026-02-24 19:06:11.679425+00	1000.00
8e163490-2a7e-4730-ab20-a5f9e4d6cfc8	1edac636-33a5-4f74-a511-826089598f60	0b7f6082-d353-4b88-88f6-f9c38cf8a236	3.000	cantidad	\N	2026-02-24 21:08:34.691486+00	2500.00
5f622a18-4377-44c7-9c36-337c3582cfa5	6989a039-dd30-4175-aa2b-80c286125669	848bb078-749a-44a9-9033-12d7ee668b1f	2.000	cantidad	\N	2026-02-24 21:09:22.173283+00	3000.00
b672a386-c068-46ae-83fd-2b4a13a2ecfb	510809fa-054b-4e14-a72f-9cd1e48be85d	7d3fef49-18f7-4513-862c-26e3fcf98c64	3.000	cantidad	\N	2026-02-24 21:11:38.440244+00	3600.00
e07c35b1-7fda-4376-8dde-fd569d2c86eb	93988eab-619e-44a9-9dec-3f792648275e	4f71ade6-f116-44ac-bda4-9e0b0dabe21a	1.000	cantidad	\N	2026-02-24 21:15:42.28331+00	7000.00
08c835f4-725e-403a-99e0-01b1dba3fd4d	fc954d0d-dbd3-46e0-968c-6acecd499d3a	8ac5c2ab-fa3c-4001-bb5a-dd5436f88d0b	1.000	cantidad	\N	2026-02-24 21:16:15.286522+00	3000.00
64c7f0e7-bea1-401c-b8f1-790f546295ef	b3a9cfb0-1652-40ab-b234-2ceb2217987f	306e7110-d1b7-4ee7-940d-1514e0eac0f6	20.000	cantidad	\N	2026-02-24 21:59:51.148869+00	1100.00
ef4db3e0-d35b-4422-968f-946c2451dc8b	27e9f5df-8750-45fe-8a58-5f15cc4b4a61	a4776793-7d1f-4d4c-a91f-92b01f028fda	20.000	cantidad	\N	2026-02-24 22:41:01.229258+00	1400.00
b6deaa66-755b-43e2-b3ce-c364c638476d	a79dcd87-64dc-4642-b455-d88287d8691f	9e53b412-3e52-460d-b1be-430fc49b42d2	1.000	peso	g	2026-02-25 01:05:44.475147+00	51400.00
31b6e3eb-945a-4d23-aafd-0968a4591480	1fe9ac7e-9ca7-4919-927b-ec5f711dd89f	6376dec9-6f45-4e48-8d5b-69ecad92d799	1.000	cantidad	\N	2026-02-25 01:09:35.411163+00	1000.00
5b3e41cb-75fd-4676-9175-a72bf6631d25	358b0036-97a1-49c7-aaf3-ba392d0cb776	4f71ade6-f116-44ac-bda4-9e0b0dabe21a	1.000	cantidad	\N	2026-02-26 00:52:28.224565+00	7000.00
b5d9ebfc-edc5-4fbd-9947-25d4086dae7c	9930e81d-3d7f-4846-bd51-d74ee2652a33	4f71ade6-f116-44ac-bda4-9e0b0dabe21a	2000.000	peso	g	2026-03-04 00:34:04.405228+00	12000.00
a1b52e5d-4c22-43d5-90fb-9a45a210f72d	2d468a8f-d30d-4ad9-b93a-599350078580	56362b50-3801-4686-aed2-a483b9960532	2.000	cantidad	\N	2026-03-04 18:22:24.521479+00	1000.00
531fe5c8-3c21-4173-8866-14a6a34dff79	715bc4a5-6732-4f6a-8848-b0be51119a6a	4f71ade6-f116-44ac-bda4-9e0b0dabe21a	2000.000	peso	g	2026-03-04 18:24:25.923005+00	12000.00
2fa4a9e4-b8a4-4ce5-8a8b-da4b0408e25c	a8f71cfe-7132-4136-a4cc-d7ada1d1c3e0	f0dfa128-82ba-4fe5-8a08-e008775f713e	2.000	cantidad	\N	2026-03-04 20:50:04.944081+00	15000.00
ac899885-99c5-404b-a462-2aa18defa6b0	b43ceef4-8b08-4863-b334-11363a2634bc	306e7110-d1b7-4ee7-940d-1514e0eac0f6	20.000	cantidad	\N	2026-03-05 23:08:03.022316+00	1100.00
38930153-5024-4c7a-882c-d36d2a9798f1	c0619397-cce0-43d5-b057-dbc9d8103ca2	a4776793-7d1f-4d4c-a91f-92b01f028fda	20.000	cantidad	\N	2026-03-05 23:08:51.667272+00	1400.00
ef6a3c67-b7ab-435f-aaf9-6cdf61a286cc	04b3c08b-679a-4277-9899-791b09033313	f6210b5d-028a-4c51-9d0d-defd10ee4632	1000.000	peso	g	2026-03-06 18:45:40.879515+00	3000.00
042755c7-3f45-43d6-a31c-50c265fde4dc	b5837f04-9174-4a26-b8c3-886d738c12b5	0b5fba44-5262-4675-9109-054cd8048c6a	1.000	cantidad	\N	2026-03-06 20:29:41.671063+00	3000.00
33e155e3-dd97-40d8-afcc-5f17986c0597	478fb543-9e48-4145-980c-95f57c17fdc0	29178b97-7251-475b-8541-076d4ae96889	800.000	peso	g	2026-03-06 20:31:29.865836+00	13000.00
30415369-f4ce-4daa-9b0f-500bcad8e58a	7fc49935-ff22-4744-9ce4-293172c9916c	9f74032d-fb07-419a-94b3-162a3413aee4	5.000	cantidad	\N	2026-03-09 20:56:52.895247+00	5000.00
a00eb7f5-7996-4c20-a0a7-be81a21ee6d8	b669ea1c-2af6-44ea-98f9-621ce1fcaa0d	8c01b1af-7386-4e63-ad93-f08cc8bf8522	5.000	cantidad	\N	2026-03-09 20:57:27.108243+00	5000.00
cc27670f-2b2b-4327-86f5-4999d686ceaf	a63052f8-5d56-4037-bfc7-7cdbcacefed4	2f5d3870-d1c1-4ef5-bf62-fad318e063d3	1.000	cantidad	\N	2026-03-09 20:57:59.249197+00	55000.00
64c4b203-66af-4a5d-bd49-351b5e68877b	db2673eb-16c9-4513-a7bd-9e384e899476	eeeef988-13e3-4c20-a92b-77a93ad0e651	1.000	cantidad	\N	2026-03-09 20:58:58.430275+00	36000.00
81f37c4f-ce28-4f80-bc05-56d45e35c334	554402c1-7949-4913-994b-94d5514c5945	88978ae9-896d-4c45-9681-d35431e96957	3000.000	peso	g	2026-03-09 21:06:40.456145+00	7900.00
12e1b57b-96e2-4775-8578-a3b15aa6415a	036a0342-bf96-469a-88f4-a19a62c647d1	fdb97896-5ff0-4219-8610-52a462ff5553	1500.000	peso	g	2026-03-09 21:11:00.019976+00	18000.00
a5c36416-0224-4589-83bb-3da9b40caff5	90c3679a-8750-4ddf-b5d1-6f15ee3a0cae	8516b407-739b-4141-8377-9bab3b8d447c	2.000	cantidad	\N	2026-03-09 21:13:16.951769+00	2000.00
81444968-8475-4e6a-bdb7-04bc83c0fe7a	4021997b-34fe-4bc5-ae11-7ddb6c9a0db0	dc76d303-d641-47c9-9bc1-5dd40dd55ad0	1.000	cantidad	\N	2026-03-09 21:14:50.936884+00	4800.00
a808ddc6-0c3d-439f-aa87-0f262a52e7c9	b1fd0eb9-ad9d-430e-899a-7497d06afdd4	2223f69e-9ba7-433b-9162-88080d3903c3	2.000	cantidad	\N	2026-03-09 21:17:31.014986+00	1900.00
a462a408-6f53-41a5-a8b2-d99470150180	cdb304c9-4c00-4e75-9c39-c40053b09134	b8140789-e463-4b8f-a0a2-543f30c60770	1.000	peso	g	2026-03-09 21:20:56.39697+00	2700.00
2929cf8f-6ecb-48fb-857b-59f3aab59344	3d4996e9-4b49-4496-8685-f06d21ea2e3b	f0a8c6a6-1f9b-41a0-97b0-d9ad4a9c3022	1.000	peso	g	2026-03-09 21:21:29.861993+00	3800.00
86482ce7-7005-4b40-9571-f491e53f34e2	31daa5c2-f8ab-4b99-8204-1d27eef4c22c	5b128ddb-0463-4551-8409-68a5b26c32bb	2000.000	peso	g	2026-03-10 16:38:17.561517+00	10000.00
2a9a7e03-7920-4b67-bb8d-b2ac1e65bf30	08e45ef9-4bde-42d9-954c-470a0e35aaa8	4f71ade6-f116-44ac-bda4-9e0b0dabe21a	2000.000	peso	g	2026-03-10 16:47:00.999519+00	12000.00
d7684f37-1beb-496b-9889-728ec48787fd	b74a30bf-25f3-41f2-bee4-716cbac0b035	6376dec9-6f45-4e48-8d5b-69ecad92d799	1.000	cantidad	\N	2026-03-10 16:47:25.336065+00	1000.00
007c3cfd-ac90-423b-ae3d-2b0fe6f8b3fd	def04271-7552-4c5e-8f89-ff80c0b7fe27	f6210b5d-028a-4c51-9d0d-defd10ee4632	2000.000	peso	g	2026-03-10 16:47:49.157085+00	6000.00
74516602-c5ef-4b58-b3af-a54670b1d42e	b27b0712-a784-4d65-97ba-9687e3197ca8	7c59e7d8-e7dc-4dc5-9bf4-c0e1e879b99d	2.000	cantidad	\N	2026-03-10 17:48:43.973489+00	29500.00
04ffedec-d6e0-4307-ad02-c662aa09db46	17281f60-001f-4954-be1c-73a5df946e0b	f0dfa128-82ba-4fe5-8a08-e008775f713e	2.000	cantidad	\N	2026-03-10 20:53:46.732081+00	15000.00
4c92362c-7cae-406e-8fca-29a3305d620e	5f23112c-7dfd-48f7-b2af-6f37b77bac1d	29178b97-7251-475b-8541-076d4ae96889	1.000	peso	g	2026-03-11 17:58:04.726797+00	13000.00
1430853b-9a9e-48a9-8549-80d64c26dbd3	99c11058-ef24-4db9-afef-7f29ecc8b2c6	8ac5c2ab-fa3c-4001-bb5a-dd5436f88d0b	1.000	cantidad	\N	2026-03-11 19:36:39.135199+00	3000.00
2bccf403-2c8e-4564-89f9-a977d2830b58	8be58bdc-6eb3-449e-a8d2-872030ea7331	4f71ade6-f116-44ac-bda4-9e0b0dabe21a	2000.000	peso	g	2026-03-12 17:37:44.594054+00	12000.00
4faf57a3-0a19-4df0-9cf6-78f5827cf1db	b8ec9e43-4ae5-4f9d-8663-f8990b2ea1fc	18ae90eb-250c-4dff-bee2-7a5bfe3a30ff	1000.000	peso	g	2026-03-12 17:41:49.227702+00	2500.00
ddd38ac6-d023-4c67-af24-80a455c318c0	0adfb505-81a3-4ba0-a60d-e4ba55637fa1	1e5cc21c-d84b-43b8-af49-db76e1ce5a28	4.000	cantidad	\N	2026-03-12 17:43:22.520287+00	500.00
c71a3315-251a-484e-9b01-5651bc06f3d3	97c285c1-9bcc-4f3a-baee-577ac77053a0	4f71ade6-f116-44ac-bda4-9e0b0dabe21a	2000.000	peso	g	2026-03-16 17:43:51.095814+00	12000.00
f4cabe56-07ee-4f8c-a1a1-46fcc874bd9b	176a3e77-0299-4ca3-8f9b-fbaa726a06cd	5b128ddb-0463-4551-8409-68a5b26c32bb	2000.000	peso	g	2026-03-16 17:44:34.075388+00	9000.00
76e0ae63-36b3-41ee-9c68-0781a7f28777	fd31149f-9e97-4264-8542-751c805c28cc	56362b50-3801-4686-aed2-a483b9960532	2.000	cantidad	\N	2026-03-16 17:45:38.524092+00	1500.00
d31ab398-4197-4393-8dce-876fe8ae79b6	c92dc4a1-3a32-477e-9f7a-702ae5a91b9a	f6210b5d-028a-4c51-9d0d-defd10ee4632	2000.000	peso	g	2026-03-16 17:46:12.415994+00	6000.00
3a9d8314-a7a4-4273-a7fe-2857495ef402	56b42ecc-b19c-4758-bfcb-c1c4026fd761	290b77dc-ac81-48e0-bb33-70fefbe3273b	2.000	cantidad	\N	2026-03-16 17:49:17.286959+00	6000.00
da9f6e44-6a01-4a0e-bdcb-27c36739657e	d9bd62a1-ad1b-423d-ae13-ca7668b86214	9f74032d-fb07-419a-94b3-162a3413aee4	6.000	cantidad	\N	2026-03-16 19:02:27.170385+00	5000.00
ee710b1d-bb12-427b-a02e-09647f137011	c5ec61e4-50a1-4531-a8fc-cab572796417	8c01b1af-7386-4e63-ad93-f08cc8bf8522	6.000	cantidad	\N	2026-03-16 19:02:52.510312+00	5000.00
8cd99649-59d0-47d2-a741-35b1afdec3aa	6a8dbc03-80ef-409e-a0fc-d14aa46e195c	f0dfa128-82ba-4fe5-8a08-e008775f713e	2.000	cantidad	\N	2026-03-16 20:05:16.720288+00	15000.00
637bd2dc-f824-4358-8a65-5f4a26ee0cff	6d47d7ed-0898-4b66-be13-f501e6540c6b	7c59e7d8-e7dc-4dc5-9bf4-c0e1e879b99d	1.000	cantidad	\N	2026-03-17 18:45:35.712024+00	29500.00
111ed89e-17cf-4715-bc6c-fbe59e1862cb	91446825-c5c1-40f6-9e9b-e23b49a3037f	23c954f3-1c76-434e-873c-4a53392ca14d	2000.000	peso	g	2026-03-17 19:05:50.314703+00	6000.00
92a9972d-2dd6-4dc5-9c60-8bd14b2b9fd7	daf5eecc-fd72-4323-a646-effd2f5d5bde	1e5cc21c-d84b-43b8-af49-db76e1ce5a28	4.000	cantidad	\N	2026-03-17 19:06:10.421425+00	500.00
52059446-5aaf-4d18-9a69-4ce7c79d57a1	218b9ee9-80cf-46dc-a47e-57d6a08c3903	fb899fb1-a8fc-4382-afc0-ad42a4dcc056	2100.000	peso	g	2026-03-17 22:38:20.059649+00	58000.00
f54c80a7-1345-429d-9835-01673351bb0e	10e90ae8-4c16-488b-b657-893d6fc1e3ed	7ee3523f-4f61-4481-8fd6-4a4b54f4f071	1000.000	peso	g	2026-03-17 22:45:14.790413+00	29000.00
67d9d7b0-7698-4a83-9ea8-38bb7d4f153b	10e90ae8-4c16-488b-b657-893d6fc1e3ed	33e79d05-54a4-4e56-9333-4193025a9d36	1250.000	peso	g	2026-03-17 22:45:14.790413+00	73600.00
e4f448fb-a045-46f4-b7a2-de8aac6725f5	10e90ae8-4c16-488b-b657-893d6fc1e3ed	fb899fb1-a8fc-4382-afc0-ad42a4dcc056	3000.000	peso	g	2026-03-17 22:45:14.790413+00	78000.00
55b96ab7-f483-4066-ab11-24e679ff613e	4e31b27a-dcba-447b-b064-468077403739	33e79d05-54a4-4e56-9333-4193025a9d36	1.000	peso	g	2026-03-17 22:48:55.045378+00	73600.00
0ce04db5-fb4e-411c-9076-990b5728f86b	4e31b27a-dcba-447b-b064-468077403739	fb899fb1-a8fc-4382-afc0-ad42a4dcc056	1.000	peso	g	2026-03-17 22:48:55.045378+00	78000.00
a8ee2e2c-7135-4ceb-a0d9-fec1859fd06c	4e31b27a-dcba-447b-b064-468077403739	7ee3523f-4f61-4481-8fd6-4a4b54f4f071	1.000	peso	g	2026-03-17 22:48:55.045378+00	29000.00
\.


--
-- Data for Name: inventario_compra_historial; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."inventario_compra_historial" ("id", "gasto_id", "menu_item_id", "cantidad", "unidad_tipo", "unidad", "precio_total", "precio_unitario", "lugar_compra", "created_at") FROM stdin;
d29c7d3b-46ad-404d-a569-095d2b917237	99c11058-ef24-4db9-afef-7f29ecc8b2c6	8ac5c2ab-fa3c-4001-bb5a-dd5436f88d0b	1.000	cantidad	unidad	3000.00	3000.000000	\N	2026-03-11 19:36:39.498944+00
06bf97a4-b291-49ba-b124-7fa753aebd37	50840a65-4605-472f-8057-8d3d1f4f578e	054aac2c-295e-4f36-8c32-445ca1757b0d	1.000	cantidad	unidad	1500.00	1500.000000	Verdulería de conveniencia	2026-02-24 19:03:33.020492+00
34c05504-e898-44e6-99f2-b7be7e77da4f	1063f5d2-c3a5-4126-ba1a-cff3588f1a6e	92eb415e-32bb-4638-a66e-941862fa4cbf	1.000	cantidad	unidad	1000.00	1000.000000	Verdulería de conveniencia	2026-02-24 19:04:02.493508+00
0212e03f-682b-4194-9cdc-4908dd11c54f	fb5dc2db-1137-4373-a52d-2e6a8b0cea86	c8d3d813-2118-4791-a0e5-69b951cfb7f1	2.000	cantidad	unidad	12000.00	6000.000000	Verdulería de conveniencia	2026-02-24 19:04:46.002655+00
e5651b18-81bb-4372-9aa6-f3e2dced26e1	3eb652d8-5894-4407-a609-1d00670defc8	0a9fb586-45eb-49ce-a175-736c13281eb2	1.000	cantidad	unidad	1000.00	1000.000000	Verdulería de conveniencia	2026-02-24 19:06:11.89965+00
f979315f-af01-48dc-802a-678a434c7869	1edac636-33a5-4f74-a511-826089598f60	0b7f6082-d353-4b88-88f6-f9c38cf8a236	3.000	cantidad	unidad	7500.00	2500.000000	Verdulería de conveniencia	2026-02-24 21:08:34.890842+00
8ed0d1cd-215d-4eb6-bcc2-b50c1cdcffc2	6989a039-dd30-4175-aa2b-80c286125669	848bb078-749a-44a9-9033-12d7ee668b1f	2.000	cantidad	unidad	6000.00	3000.000000	Verdulería de conveniencia	2026-02-24 21:09:22.358082+00
78cbd0a6-afed-4396-a242-134372e766f0	510809fa-054b-4e14-a72f-9cd1e48be85d	7d3fef49-18f7-4513-862c-26e3fcf98c64	3.000	cantidad	unidad	10800.00	3600.000000	Verdulería de conveniencia	2026-02-24 21:11:38.663643+00
514bc175-838f-4191-909d-0a57ec26c531	93988eab-619e-44a9-9dec-3f792648275e	4f71ade6-f116-44ac-bda4-9e0b0dabe21a	1.000	cantidad	unidad	7000.00	7000.000000	Verdulería de conveniencia	2026-02-24 21:15:42.642663+00
d46761c6-ea4d-41de-8d53-75e320416466	fc954d0d-dbd3-46e0-968c-6acecd499d3a	8ac5c2ab-fa3c-4001-bb5a-dd5436f88d0b	1.000	cantidad	unidad	3000.00	3000.000000	Verdulería de conveniencia	2026-02-24 21:16:15.514421+00
4bb290e1-9999-4810-9574-b7dfee6d0af2	b3a9cfb0-1652-40ab-b234-2ceb2217987f	306e7110-d1b7-4ee7-940d-1514e0eac0f6	20.000	cantidad	unidad	22000.00	1100.000000	\N	2026-02-24 21:59:51.31958+00
8293ec39-96c2-4da7-966e-3b8138f84fa2	27e9f5df-8750-45fe-8a58-5f15cc4b4a61	a4776793-7d1f-4d4c-a91f-92b01f028fda	20.000	cantidad	unidad	28000.00	1400.000000	Produccion GL	2026-02-24 22:41:01.43963+00
8a6fd05a-e45e-4ba8-bed3-5626b842e266	a79dcd87-64dc-4642-b455-d88287d8691f	9e53b412-3e52-460d-b1be-430fc49b42d2	1.000	peso	g	51400.00	51400.000000	\N	2026-02-25 01:05:44.724066+00
53516d97-498b-4b60-ab8a-c185c59cc7cb	1fe9ac7e-9ca7-4919-927b-ec5f711dd89f	6376dec9-6f45-4e48-8d5b-69ecad92d799	1.000	cantidad	unidad	1000.00	1000.000000	\N	2026-02-25 01:09:35.607947+00
41d8fcb4-a251-4c3f-b6b2-2ae074dcbba7	358b0036-97a1-49c7-aaf3-ba392d0cb776	4f71ade6-f116-44ac-bda4-9e0b0dabe21a	1.000	cantidad	unidad	7000.00	7000.000000	\N	2026-02-26 00:52:28.580771+00
53f99d5b-c74e-4df4-8ee3-7e1e83862fa3	9930e81d-3d7f-4846-bd51-d74ee2652a33	4f71ade6-f116-44ac-bda4-9e0b0dabe21a	2000.000	peso	g	12000.00	6.000000	Verdureria de confianza	2026-03-04 00:34:04.691258+00
85adc854-81b0-45a5-a7e8-6a6a080524b6	2d468a8f-d30d-4ad9-b93a-599350078580	56362b50-3801-4686-aed2-a483b9960532	2.000	cantidad	unidad	2000.00	1000.000000	Verdulería de confianza	2026-03-04 18:22:24.707262+00
bf45ca92-c77c-44fe-a999-c5da8f9a654b	715bc4a5-6732-4f6a-8848-b0be51119a6a	4f71ade6-f116-44ac-bda4-9e0b0dabe21a	2000.000	peso	g	12000.00	6.000000	verdulería de confianza	2026-03-04 18:24:26.124952+00
8f8f8952-2cd1-41be-a29c-8a74ae537510	a8f71cfe-7132-4136-a4cc-d7ada1d1c3e0	f0dfa128-82ba-4fe5-8a08-e008775f713e	2.000	cantidad	unidad	30000.00	15000.000000	Carnes Frías MACARDI	2026-03-04 20:50:05.28141+00
7bffc36e-3337-4e0e-9136-8ad512b9a591	b43ceef4-8b08-4863-b334-11363a2634bc	306e7110-d1b7-4ee7-940d-1514e0eac0f6	20.000	cantidad	unidad	22000.00	1100.000000	Produccion GL	2026-03-05 23:08:03.329778+00
656f6678-9ca1-4430-8382-6dfdccab12a5	c0619397-cce0-43d5-b057-dbc9d8103ca2	a4776793-7d1f-4d4c-a91f-92b01f028fda	20.000	cantidad	unidad	28000.00	1400.000000	Producción GL	2026-03-05 23:08:51.85152+00
da23d838-61a7-4c0f-ba9e-9e02c6aecf24	04b3c08b-679a-4277-9899-791b09033313	f6210b5d-028a-4c51-9d0d-defd10ee4632	1000.000	peso	g	3000.00	3.000000	\N	2026-03-06 18:45:41.277156+00
d45b3c04-a061-4783-acaf-4af23d4b02a7	b5837f04-9174-4a26-b8c3-886d738c12b5	0b5fba44-5262-4675-9109-054cd8048c6a	1.000	cantidad	unidad	3000.00	3000.000000	\N	2026-03-06 20:29:42.047137+00
d0155821-f7de-48f6-9d72-522031b5530c	478fb543-9e48-4145-980c-95f57c17fdc0	29178b97-7251-475b-8541-076d4ae96889	800.000	peso	g	13000.00	16.250000	\N	2026-03-06 20:31:30.113397+00
462d66e3-2d4a-484e-b1fb-3c1272c23287	7fc49935-ff22-4744-9ce4-293172c9916c	9f74032d-fb07-419a-94b3-162a3413aee4	5.000	cantidad	unidad	25000.00	5000.000000	\N	2026-03-09 20:56:53.192203+00
e9d9c1fc-2b79-4444-813f-a08a1630705e	b669ea1c-2af6-44ea-98f9-621ce1fcaa0d	8c01b1af-7386-4e63-ad93-f08cc8bf8522	5.000	cantidad	unidad	25000.00	5000.000000	\N	2026-03-09 20:57:27.292957+00
f7543167-22ba-4adf-8829-cfab9a808f01	a63052f8-5d56-4037-bfc7-7cdbcacefed4	2f5d3870-d1c1-4ef5-bf62-fad318e063d3	1.000	cantidad	unidad	55000.00	55000.000000	\N	2026-03-09 20:57:59.453407+00
6608e2eb-7274-49c7-8583-0239dc25950a	db2673eb-16c9-4513-a7bd-9e384e899476	eeeef988-13e3-4c20-a92b-77a93ad0e651	1.000	cantidad	unidad	36000.00	36000.000000	\N	2026-03-09 20:58:58.643448+00
09c7ea71-a97a-4ace-81d8-7867715882f8	554402c1-7949-4913-994b-94d5514c5945	88978ae9-896d-4c45-9681-d35431e96957	3000.000	peso	g	7900.00	2.633333	D1	2026-03-09 21:06:40.657069+00
ce813bff-4597-4b3a-b574-de6c919ebff3	036a0342-bf96-469a-88f4-a19a62c647d1	fdb97896-5ff0-4219-8610-52a462ff5553	1500.000	peso	g	18000.00	12.000000	D1	2026-03-09 21:11:00.241689+00
7a82ea83-f5e6-4fe1-8c4f-cca4cdf36052	90c3679a-8750-4ddf-b5d1-6f15ee3a0cae	8516b407-739b-4141-8377-9bab3b8d447c	2.000	cantidad	unidad	4000.00	2000.000000	D1	2026-03-09 21:13:17.118185+00
270b3e1d-2ea4-426f-b7b6-f9b15a7ed296	4021997b-34fe-4bc5-ae11-7ddb6c9a0db0	dc76d303-d641-47c9-9bc1-5dd40dd55ad0	1.000	cantidad	unidad	4800.00	4800.000000	D1	2026-03-09 21:14:51.102507+00
7e0aa364-4617-4ce2-b352-fb0d15ed0909	b1fd0eb9-ad9d-430e-899a-7497d06afdd4	2223f69e-9ba7-433b-9162-88080d3903c3	2.000	cantidad	unidad	3800.00	1900.000000	D1	2026-03-09 21:17:31.720908+00
19bb8de3-ddc9-4298-a345-664a1bb8173e	cdb304c9-4c00-4e75-9c39-c40053b09134	b8140789-e463-4b8f-a0a2-543f30c60770	1.000	peso	g	2700.00	2700.000000	D1	2026-03-09 21:20:56.582696+00
6c0e7054-7827-42b9-98ef-2a7634f22529	3d4996e9-4b49-4496-8685-f06d21ea2e3b	f0a8c6a6-1f9b-41a0-97b0-d9ad4a9c3022	1.000	peso	g	3800.00	3800.000000	D1	2026-03-09 21:21:30.093109+00
b503a9f4-b897-4f4d-b259-6a8e69fa1c65	31daa5c2-f8ab-4b99-8204-1d27eef4c22c	5b128ddb-0463-4551-8409-68a5b26c32bb	2000.000	peso	g	10000.00	5.000000	\N	2026-03-10 16:38:17.81054+00
bb4aecc7-2766-4455-a537-c768b7390779	08e45ef9-4bde-42d9-954c-470a0e35aaa8	4f71ade6-f116-44ac-bda4-9e0b0dabe21a	2000.000	peso	g	12000.00	6.000000	\N	2026-03-10 16:47:01.215631+00
1f39d1a1-6378-473e-8c9f-9c88f4c90d9b	b74a30bf-25f3-41f2-bee4-716cbac0b035	6376dec9-6f45-4e48-8d5b-69ecad92d799	1.000	cantidad	unidad	1000.00	1000.000000	\N	2026-03-10 16:47:25.509502+00
53328c20-d19d-4012-b590-71ab1b6b10bc	def04271-7552-4c5e-8f89-ff80c0b7fe27	f6210b5d-028a-4c51-9d0d-defd10ee4632	2000.000	peso	g	6000.00	3.000000	\N	2026-03-10 16:47:49.323886+00
92c93b22-3745-467b-8c15-4ac69f85f281	b27b0712-a784-4d65-97ba-9687e3197ca8	7c59e7d8-e7dc-4dc5-9bf4-c0e1e879b99d	2.000	cantidad	unidad	59000.00	29500.000000	\N	2026-03-10 17:48:44.29444+00
5644f56c-8eec-4d68-b4f5-58a2d8354f35	17281f60-001f-4954-be1c-73a5df946e0b	f0dfa128-82ba-4fe5-8a08-e008775f713e	2.000	cantidad	unidad	30000.00	15000.000000	\N	2026-03-10 20:53:47.047161+00
71519587-0670-42b4-96fa-e586bd929d65	5f23112c-7dfd-48f7-b2af-6f37b77bac1d	29178b97-7251-475b-8541-076d4ae96889	1.000	peso	g	13000.00	13000.000000	\N	2026-03-11 17:58:04.963682+00
4faa003a-1784-4c0f-ac3f-556589698faf	8be58bdc-6eb3-449e-a8d2-872030ea7331	4f71ade6-f116-44ac-bda4-9e0b0dabe21a	2000.000	peso	g	12000.00	6.000000	\N	2026-03-12 17:37:44.811297+00
2c36c903-d3f1-4c9d-b13d-c7073e235e1c	97baf608-4a7b-4405-8dfd-73795cc77c74	43d1bcff-0798-43db-beea-f7c8873acc3c	2.000	cantidad	unidad	2000.00	1000.000000	\N	2026-03-12 17:39:49.417017+00
ed9afea1-216c-40ff-b9fd-d26b5f963314	b8ec9e43-4ae5-4f9d-8663-f8990b2ea1fc	18ae90eb-250c-4dff-bee2-7a5bfe3a30ff	1000.000	peso	g	2500.00	2.500000	\N	2026-03-12 17:41:49.452666+00
4c30bcf6-c2e1-4c71-b833-c3286e256def	0adfb505-81a3-4ba0-a60d-e4ba55637fa1	1e5cc21c-d84b-43b8-af49-db76e1ce5a28	4.000	cantidad	unidad	2000.00	500.000000	\N	2026-03-12 17:43:22.706403+00
c75c1d22-d3c9-4dba-a329-dc1174c3ba1f	97c285c1-9bcc-4f3a-baee-577ac77053a0	4f71ade6-f116-44ac-bda4-9e0b0dabe21a	2000.000	peso	g	12000.00	6.000000	\N	2026-03-16 17:43:51.308437+00
da059a42-2ef1-402d-8839-3ba0b5e14d15	176a3e77-0299-4ca3-8f9b-fbaa726a06cd	5b128ddb-0463-4551-8409-68a5b26c32bb	2000.000	peso	g	9000.00	4.500000	proveedor de confianza	2026-03-16 17:44:34.248428+00
d81b0e61-bdfa-4616-9f0c-d823aad806e3	fd31149f-9e97-4264-8542-751c805c28cc	56362b50-3801-4686-aed2-a483b9960532	2.000	cantidad	unidad	3000.00	1500.000000	\N	2026-03-16 17:45:38.672588+00
e9e5ffd2-be53-4fb7-af81-56b9e39e1c09	c92dc4a1-3a32-477e-9f7a-702ae5a91b9a	f6210b5d-028a-4c51-9d0d-defd10ee4632	2000.000	peso	g	6000.00	3.000000	\N	2026-03-16 17:46:12.579633+00
71b197ef-62aa-452a-bf55-1bfd648b193f	56b42ecc-b19c-4758-bfcb-c1c4026fd761	290b77dc-ac81-48e0-bb33-70fefbe3273b	2.000	cantidad	unidad	12000.00	6000.000000	D1	2026-03-16 17:49:17.47335+00
b14cc42e-65e3-487b-980a-8c9d10e5c5f4	d9bd62a1-ad1b-423d-ae13-ca7668b86214	9f74032d-fb07-419a-94b3-162a3413aee4	6.000	cantidad	unidad	30000.00	5000.000000	\N	2026-03-16 19:02:27.404273+00
9c2434e1-d3ea-49cc-8bcd-8f93cdafa1cd	c5ec61e4-50a1-4531-a8fc-cab572796417	8c01b1af-7386-4e63-ad93-f08cc8bf8522	6.000	cantidad	unidad	30000.00	5000.000000	\N	2026-03-16 19:02:52.658265+00
9d27deca-fb2c-4595-b45c-d8adb3425df9	6a8dbc03-80ef-409e-a0fc-d14aa46e195c	f0dfa128-82ba-4fe5-8a08-e008775f713e	2.000	cantidad	unidad	30000.00	15000.000000	\N	2026-03-16 20:05:17.038749+00
3851529c-efcb-4bd5-92be-73c609310cda	6d47d7ed-0898-4b66-be13-f501e6540c6b	7c59e7d8-e7dc-4dc5-9bf4-c0e1e879b99d	1.000	cantidad	unidad	29500.00	29500.000000	\N	2026-03-17 18:45:36.070769+00
f3132c8f-73b9-4bcf-949e-d82632ac9f2a	91446825-c5c1-40f6-9e9b-e23b49a3037f	23c954f3-1c76-434e-873c-4a53392ca14d	2000.000	peso	g	6000.00	3.000000	\N	2026-03-17 19:05:50.602423+00
fecd4e36-b658-4683-9de2-9cd79a758eda	daf5eecc-fd72-4323-a646-effd2f5d5bde	1e5cc21c-d84b-43b8-af49-db76e1ce5a28	4.000	cantidad	unidad	2000.00	500.000000	\N	2026-03-17 19:06:10.676377+00
4711eb6a-c9f2-43aa-a4b1-125d8cb0c76e	218b9ee9-80cf-46dc-a47e-57d6a08c3903	fb899fb1-a8fc-4382-afc0-ad42a4dcc056	2100.000	peso	g	58000.00	27.619048	Carnes la 16	2026-03-17 22:38:20.34823+00
18597ce5-155d-49a4-ac96-5e321974a25b	10e90ae8-4c16-488b-b657-893d6fc1e3ed	7ee3523f-4f61-4481-8fd6-4a4b54f4f071	1000.000	peso	g	29000.00	29.000000	\N	2026-03-17 22:45:15.004443+00
a844073c-8f63-4de3-b01e-067a8970193e	10e90ae8-4c16-488b-b657-893d6fc1e3ed	33e79d05-54a4-4e56-9333-4193025a9d36	1250.000	peso	g	73600.00	58.880000	\N	2026-03-17 22:45:15.004443+00
ff26b321-55ac-4418-a910-8fd1f7c96742	10e90ae8-4c16-488b-b657-893d6fc1e3ed	fb899fb1-a8fc-4382-afc0-ad42a4dcc056	3000.000	peso	g	78000.00	26.000000	La favorita	2026-03-17 22:45:15.004443+00
8b938cc4-4895-4c26-82c5-b5113cae00e7	4e31b27a-dcba-447b-b064-468077403739	33e79d05-54a4-4e56-9333-4193025a9d36	1.000	peso	g	73600.00	73600.000000	\N	2026-03-17 22:48:55.282217+00
3f882f4c-9984-4923-a349-6faa817b9b00	4e31b27a-dcba-447b-b064-468077403739	fb899fb1-a8fc-4382-afc0-ad42a4dcc056	1.000	peso	g	78000.00	78000.000000	\N	2026-03-17 22:48:55.282217+00
c40b27e5-e683-4d66-a13d-ff542dc806b3	4e31b27a-dcba-447b-b064-468077403739	7ee3523f-4f61-4481-8fd6-4a4b54f4f071	1.000	peso	g	29000.00	29000.000000	\N	2026-03-17 22:48:55.282217+00
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."order_items" ("id", "order_id", "menu_item_id", "cantidad", "notas") FROM stdin;
2a8e5ed5-1990-48dc-b887-53677d72563a	c816883c-1811-416f-bb80-92ac3ff8d711	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
e8f4e646-d21c-4ec3-ba55-5949bb73b495	c816883c-1811-416f-bb80-92ac3ff8d711	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	\N
bc54eea2-f85a-4999-8a4e-3701ee0defd4	4ace7a39-1bb7-4837-b544-20479ecfaac2	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
a381ad69-f262-4668-9a4e-70027c589e4e	de7f4770-191d-4b57-ad9c-6468b2a0d51a	bbe7a283-40e4-4d35-bac2-1aa7423a4058	1	\N
9e038b1c-4419-44c2-92dc-060bd7fbc6d0	de7f4770-191d-4b57-ad9c-6468b2a0d51a	fb87265d-4925-4fc3-be32-7c55e611f5e6	1	\N
98d4ebec-919d-49a6-a96a-8f244728b34d	c8cde86a-df1e-47ef-8c13-d8468a25f3eb	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
6aa81fce-239d-48ac-bb32-b9a248f2f669	d6a104ee-86fe-47e2-976d-47a99d172ced	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
bbcc89d9-7ac9-43da-93fe-2a824ba6216d	270cb9c3-9278-47e2-89b9-36492b584e9c	16325ab3-d934-4d9d-9573-056bded27d08	1	\N
1181c740-7ccf-40c1-a5c1-d1d5dc1d66d5	63195593-a2c9-41a3-887c-a129e1cdd976	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
231bce98-e531-4363-831e-2d35f7be6a8b	3d487325-f935-4c40-9e2a-236592e67b56	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Jamón de cerdo
90a2eaee-d32e-49fc-bcfa-b93866e2a55e	3d487325-f935-4c40-9e2a-236592e67b56	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
a3e625cf-e23e-411c-bfcd-619a54fef411	c0b4015d-a729-4c9e-a220-cd6bb9b002f7	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Jamón de cerdo
865a9d06-e7fe-429d-b864-3452bcd55808	7d385443-f410-4453-8e1d-9133ccfc279f	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
37268393-36b5-467b-82b6-57a284cfbc11	507f5e77-20a2-4f77-8394-6bccf0eff0a2	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Jamón de cerdo
06284a7a-313b-4b06-9e3f-298aef000569	68f500ad-bb4e-4328-9d2a-9bcda8a7d6b0	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua, Pasta\nToppings: Champiñones, Guacamole, Chips de arracacha, Zanahoria\nProteína: Jamón de cerdo
ec6b7082-36b7-44cf-871a-f74f39e9887d	4157c111-1cd4-4731-9e23-79474160c9e8	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Guacamole, Chips de arracacha, Zanahoria, Queso feta\nProteína: Carne desmechada
0c6e9614-6ba2-4b5b-b93b-27aae7c87935	b88ba1fa-6f2a-4a1a-bbeb-1ef46feb7dcf	febcfb4f-bc51-4719-89dd-765ed174f19b	1	\N
c6b2b2da-925b-439f-9537-b926440c9ef3	b88ba1fa-6f2a-4a1a-bbeb-1ef46feb7dcf	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
6c47c1a7-aea8-40c5-a884-28cbb312771b	23eb2329-0c5e-4088-8fb3-36715c1d1f4c	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
2b07ca8b-7d61-475d-aa0e-6b5185e69058	23eb2329-0c5e-4088-8fb3-36715c1d1f4c	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
f4e0112f-d332-4e76-ad42-b5209e32c9a0	23eb2329-0c5e-4088-8fb3-36715c1d1f4c	febcfb4f-bc51-4719-89dd-765ed174f19b	1	\N
aee09276-7b50-4ad7-9871-9e7aafb735d1	b4d33059-dfdb-43af-94b8-c04e0a270161	36d50cac-2255-4963-b89a-6d7e29450faf	2	\N
9762abdc-09f0-4c0f-a237-4b03c8ded20d	615f8381-992b-4d15-8313-899413b973fb	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
599d5958-0b21-4f77-a849-c22caadf07c1	615f8381-992b-4d15-8313-899413b973fb	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
0651fc7e-efa3-466f-af75-af10f0af8550	615f8381-992b-4d15-8313-899413b973fb	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	\N
86c95df8-e98e-4a81-b6b5-bb661a00d82c	615f8381-992b-4d15-8313-899413b973fb	febcfb4f-bc51-4719-89dd-765ed174f19b	1	\N
8caaf6d6-066c-4e74-aa62-f9f34930f19c	0168c10e-c788-426c-b706-3c57300c52f1	fa107d92-d59b-4686-b51f-7df33766c361	2	\N
1a6307bc-0a9b-4dbe-b72e-cae895dc7bce	c5be6c87-d4d6-40a4-afa5-edb12ae9365f	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
8c7c25ef-be1a-44bc-b672-d3894b2b7c40	1529133b-90d2-498e-a089-11ee20022e23	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
27c32055-db17-451b-b987-8380c360b167	1529133b-90d2-498e-a089-11ee20022e23	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua, Pasta\nToppings: Champiñones, Guacamole, Chips de arracacha, Zanahoria\nProteína: Carne desmechada
0271d0b1-5bf5-43aa-977f-12af58ba7497	a064c078-e503-4588-9f1a-5833ab74af57	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
923f090d-f9c4-47d0-96f5-ba47f5127dcc	5d597deb-c39d-48b8-bb7c-d6e593929397	b68386e8-b73e-422b-a5b6-47d622faac19	1	Descuento estudiante 10%
098ff959-9fc6-485b-97f3-2159555f599e	0e99f28d-a472-4ab9-b6f9-0c898b40ba88	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
747cc898-05cd-4d4b-8e6f-4c2b5867e926	0e99f28d-a472-4ab9-b6f9-0c898b40ba88	fc11776c-aef5-449a-9fcf-1e982a0b35ab	1	\N
0e2ea2d1-3ed7-4317-b0ad-98368fdba56d	842fbc54-bda1-4b20-957e-85d656cc4a3e	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	Descuento estudiante 10%
6e3b0d01-5242-4e45-bc92-44f77bfc5d3b	842fbc54-bda1-4b20-957e-85d656cc4a3e	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
0ee7335a-3014-4a28-924d-6944b2542be9	842fbc54-bda1-4b20-957e-85d656cc4a3e	290b77dc-ac81-48e0-bb33-70fefbe3273b	1	\N
91721f76-9185-4a88-b482-cf73173ee4a9	842fbc54-bda1-4b20-957e-85d656cc4a3e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Champiñones, Guacamole, Chips de arracacha, Zanahoria\nProteína: Jamón de cerdo
fbbcf31a-2620-4742-abe3-6446e8fa8701	5cb52fcb-f91e-49c0-939a-a4dfe0d1cb58	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
3814ad17-5ff9-458a-98a2-83abc182f4f9	5cb52fcb-f91e-49c0-939a-a4dfe0d1cb58	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
223af578-c699-4b95-b410-2a7bc575f86e	b0d9be7c-102e-4bfb-a027-33a1cd9996ea	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
8c797933-aff9-4c0f-a0ef-3a0f6c3b65ab	b0d9be7c-102e-4bfb-a027-33a1cd9996ea	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
36d355ba-a881-43dc-8291-099fe4a974a7	9cda329f-736a-45a1-b779-94967eef478f	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
3cccf0a2-165d-4fab-9106-1ec4be399154	9cda329f-736a-45a1-b779-94967eef478f	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
e78e98d7-17cf-4ea7-b861-920258d49d12	9570fce9-c17a-479b-a87c-40d2bcf40312	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	\N
7f4c364e-b048-40c2-8f09-50a08dd5e4d9	9570fce9-c17a-479b-a87c-40d2bcf40312	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
4958cde4-b3c6-4b94-b760-fa04191c73c4	9570fce9-c17a-479b-a87c-40d2bcf40312	16325ab3-d934-4d9d-9573-056bded27d08	2	\N
456ceb15-43d5-4c17-a9ac-e053b2cac854	9d69b9cb-eda1-4d32-83a8-2a602a794389	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
abedbad5-fa0a-4668-b9d3-b895531842be	529b3152-2ab2-4e97-9e1d-bd9a3ab0975e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Tocineta, Pepino, Queso feta, Maíz tierno\nProteína: Pechuga de pollo
85941b4d-c83c-419e-8d36-53f98e1dd10d	529b3152-2ab2-4e97-9e1d-bd9a3ab0975e	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
6dae744e-af37-4da6-b474-ebc65771d6a1	9c872a93-c09f-4346-9c46-0883e8fdf576	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Champiñones, Guacamole, Pepino, Pico de gallo\nProteína: Pechuga de pollo
76ad5ae7-1527-4139-870a-ccadb5ceab95	9c872a93-c09f-4346-9c46-0883e8fdf576	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Queso feta, Pico de gallo, Champiñones, Tocineta\nProteína: Pechuga de pollo
94f24fae-b3c8-4b11-b4d3-0825e50fed8d	f361c481-118d-4e72-8658-058715d72db2	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Guacamole, Pico de gallo, Maíz tierno, Queso feta\nProteína: Pechuga de pollo
19297e22-248a-43fb-9183-62057765b835	f361c481-118d-4e72-8658-058715d72db2	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Guacamole, Pico de gallo, Tocineta, Maíz tierno\nProteína: Pechuga de pollo
76a3f16c-5b1a-4d10-b563-5799cb5baa7c	f361c481-118d-4e72-8658-058715d72db2	7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	2	\N
942d52b3-e0b4-4eb3-882d-461d21e77d27	fd5de209-af3b-4a6e-8bb8-f0876ae61b11	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Jamón de cerdo
07ad096a-7750-45b9-864d-2f464760aba4	c83d1ab6-6390-4786-848a-094e60de15cd	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
3543e0ea-b4c2-4404-bdc4-7556136ef0aa	c83d1ab6-6390-4786-848a-094e60de15cd	c7572bb3-01f8-4c66-a3e3-0c262093761c	2	\N
9a3c2481-7d97-4527-95d9-4d503d841fe2	5879eaea-d972-4277-a405-30978f25166e	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
75f717e6-1b9b-4d1e-a194-63ae153a3799	9040b73f-77bf-427b-b0c2-1bb2526c0086	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
50b44135-abf0-4d52-ac3d-c313eda2ddec	9040b73f-77bf-427b-b0c2-1bb2526c0086	114e2c84-cf03-47a9-abae-b3edd6911ded	4	Bases: Pasta, Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
7e75cd49-8526-45fb-887c-bdaaae238d2b	ae2bebca-571e-4c07-8670-757db996718d	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Pasta, Quinua\nToppings: Champiñones, Chips de arracacha, Guacamole, Zanahoria\nProteína: Jamón de cerdo
d786c6db-df8d-453f-ae0b-3f29cbb5b181	15cbe337-b663-447c-86e5-c1cca381e249	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Pasta, Arroz\nToppings: Maíz tierno, Tocineta, Pico de gallo, Queso feta\nProteína: Jamón de cerdo
bb1fbd0f-81b6-4f97-a370-79a596153efa	c26ad814-d661-426f-905b-9e1d7db637c2	b68386e8-b73e-422b-a5b6-47d622faac19	1	Descuento estudiante 10%
3b71ff61-faa4-4ae9-949d-c2ef9247db02	c26ad814-d661-426f-905b-9e1d7db637c2	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Jamón de cerdo
d3e6914b-9a93-478e-9266-60e21f032d22	7535363c-d10d-4d35-abdc-4eae97bd274f	60c3451b-db1a-45f4-8480-585e01fe2242	1	Descuento estudiante 10%
b94d7310-882f-47ee-8f26-c0d66227d3c7	75f77883-a796-4df2-9bd8-d4bd423c0c1f	31a6d560-88e6-45ec-9177-0625136ffe22	1	\N
b95afc2d-9c38-42d5-ac38-ecb3eedd7192	00778b23-695c-48f2-92ab-b3742b61b855	b68386e8-b73e-422b-a5b6-47d622faac19	1	Descuento estudiante 10%
00a3303d-c75d-493e-9f97-ec25a42403bd	32369dfb-eef0-4209-9ced-9e6b6f1e381e	fe196a9f-e68f-4df6-ab98-5a2c58ad9b16	1	\N
6ad107ae-f9d3-4e69-a57f-8b134685f2fd	32369dfb-eef0-4209-9ced-9e6b6f1e381e	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
7c5a934a-0529-48ca-8900-4b9f8ebe5c33	32369dfb-eef0-4209-9ced-9e6b6f1e381e	1926274b-2765-4f72-810f-6e79ad575a91	1	\N
124b683b-afbd-4a2a-9d5f-b368c0c5b084	6b96efb7-0e92-4bc4-87fe-0e95a4e561da	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Champiñones, Tocineta, Chips de arracacha, Guacamole\nProteína: Pechuga de pollo
495bbf35-8287-483a-9e0a-7aadc75eca8d	6b96efb7-0e92-4bc4-87fe-0e95a4e561da	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Maíz tierno, Champiñones, Tocineta, Queso feta\nProteína: Carne desmechada
4c7c768c-aaed-47f5-bf76-45327d92f6f5	6b96efb7-0e92-4bc4-87fe-0e95a4e561da	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
9f526ac1-168d-4acc-832d-53287e3708d2	1ca8ba41-cc65-425c-b4f1-3ddae293522d	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Guacamole, Champiñones, Chips de arracacha, Tocineta\nProteína: Pechuga de pollo
fd3f78bb-72ce-4497-8928-39f390f7b929	137155b2-2f48-46f2-ad0b-9d7517875112	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Guacamole, Pico de gallo, Maíz tierno\nProteína: Pechuga de pollo
59a2e026-e5ed-4f94-8c31-56d6ccf0aa63	137155b2-2f48-46f2-ad0b-9d7517875112	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	3	\N
3544d83f-9207-4c70-bd24-2133a44aab99	137155b2-2f48-46f2-ad0b-9d7517875112	35a41129-ef96-43e6-8ebc-7c14c4d26605	2	\N
e21c6039-573a-4bb2-a56f-18b74995bac1	c84e0bb3-b3d4-478b-b76f-b27a105878ba	fe196a9f-e68f-4df6-ab98-5a2c58ad9b16	1	\N
b39c05f4-3b32-4024-8346-e99e9cb92f60	c84e0bb3-b3d4-478b-b76f-b27a105878ba	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
93caa478-ed5d-46a9-b6cb-79c25aa66d4a	c84e0bb3-b3d4-478b-b76f-b27a105878ba	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
d783c791-47ea-4050-98c9-d2e46d7ecff0	c84e0bb3-b3d4-478b-b76f-b27a105878ba	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
e8f04403-f5f9-4b87-9608-11dbaa49a772	137155b2-2f48-46f2-ad0b-9d7517875112	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
f8e88212-ca89-4b04-b32d-0b0cd78e85dd	02194b42-3755-4374-a2b7-f099a74381d6	c3704705-037f-40c4-976c-d0576e944b21	2	\N
f4060327-79fe-465d-ab4c-8ecf0078fc62	4dcdbf9e-9136-491c-986f-401f60bdaf58	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
05093a05-2090-4f7e-bf38-221ca6ab3672	dea8fbf9-2118-4343-ac86-f71661501468	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
64de40cd-393e-4807-8cde-6cd7dad80b3d	eeff4778-0520-48ff-8e11-55787643ec39	3bb93296-c6c5-456a-b165-73c1a20a3134	1	\N
2cd6f734-0387-4466-9209-870422d69545	eeff4778-0520-48ff-8e11-55787643ec39	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
c262e414-f8a4-4b8f-9c0b-a99cb1a3df16	6d5ced47-a91b-4990-963f-0fd31d3fe824	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
11b777aa-c7b5-47fe-aab2-0e137f737dfa	6d5ced47-a91b-4990-963f-0fd31d3fe824	ed348c8c-f11a-401a-8865-5ede23240268	1	\N
ef4ac0c3-4860-40cf-b7d3-af59b4ff28cf	6d5ced47-a91b-4990-963f-0fd31d3fe824	c3704705-037f-40c4-976c-d0576e944b21	1	\N
5b102dac-b99e-4513-ae98-3f268fc56771	6d5ced47-a91b-4990-963f-0fd31d3fe824	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
f710ac45-04e2-4a24-a861-476138f27999	6d5ced47-a91b-4990-963f-0fd31d3fe824	84ce9a61-d186-47cb-92b4-afa4d5847dab	1	\N
9949c576-5eed-45ba-9dad-970369e14900	6d5ced47-a91b-4990-963f-0fd31d3fe824	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
8571a826-be6a-4e2c-a281-d3d56bd44bfb	64fa9dbc-f255-415a-b34f-a27d3332157b	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	Descuento estudiante 10%
718e37c6-5482-4f6c-847e-3bf176f9b410	64fa9dbc-f255-415a-b34f-a27d3332157b	60c3451b-db1a-45f4-8480-585e01fe2242	1	Descuento estudiante 10%
3e8df92c-f6b1-4fe5-81b0-ce881ec1a5e5	64fa9dbc-f255-415a-b34f-a27d3332157b	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
12e51cf6-b4d2-4054-b711-b0ba62f216ed	64fa9dbc-f255-415a-b34f-a27d3332157b	16325ab3-d934-4d9d-9573-056bded27d08	1	\N
7d46fe7f-1a5a-4fe5-a144-b00036d551c6	003acb1f-0db0-40e0-83e4-e23529ff6a60	3bb93296-c6c5-456a-b165-73c1a20a3134	2	\N
2248b126-c8e3-46e2-ac4b-3f1746911c74	003acb1f-0db0-40e0-83e4-e23529ff6a60	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	2	\N
cd92fda8-e6c9-4250-a9c7-8759b671102f	07fdd121-94d2-43e8-b856-44e10ae325a8	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
7348c655-d72c-4d6a-8cce-70350229ac23	07fdd121-94d2-43e8-b856-44e10ae325a8	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
f349d12f-1011-4675-a876-84c6739d9b98	cee5fc2e-f3c2-4cc1-afd8-686b6d303a7c	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
9c0a0aaf-fb8d-479b-a118-3d291e99a79b	cee5fc2e-f3c2-4cc1-afd8-686b6d303a7c	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
49409909-4fc5-4474-8bff-242e48fa3cac	cee5fc2e-f3c2-4cc1-afd8-686b6d303a7c	3bb93296-c6c5-456a-b165-73c1a20a3134	1	\N
35ddb83c-08e0-4eda-9585-abd58e09f66b	cee5fc2e-f3c2-4cc1-afd8-686b6d303a7c	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
6105574b-6e03-4e88-881a-452e8d06fba3	cee5fc2e-f3c2-4cc1-afd8-686b6d303a7c	c260a933-f796-416a-9d0c-ab2b4e769e33	1	\N
28f065bf-7b64-4411-aee4-a3254412c350	cee5fc2e-f3c2-4cc1-afd8-686b6d303a7c	a1a2c0c2-0779-46b4-87cc-f47473361928	1	\N
671017e1-b77f-4851-b711-c7c7329ed09b	cee5fc2e-f3c2-4cc1-afd8-686b6d303a7c	290b77dc-ac81-48e0-bb33-70fefbe3273b	3	\N
3caf4990-3a3b-441d-977a-9ebabff11985	cee5fc2e-f3c2-4cc1-afd8-686b6d303a7c	bbe7a283-40e4-4d35-bac2-1aa7423a4058	1	\N
c743c070-0bf7-4efd-8af6-27fbf7a629c4	d2c2ebe9-f796-4351-9134-5b03641020e9	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
b067c627-42f3-490b-af85-a68ab54f27d5	d2c2ebe9-f796-4351-9134-5b03641020e9	35a41129-ef96-43e6-8ebc-7c14c4d26605	2	\N
e03b3beb-7c42-4861-ab8f-414f34dfcf21	bc32d274-8c58-4591-8669-e76fa7b6a1f7	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
2321621f-0939-4026-9461-3442677ad951	bc32d274-8c58-4591-8669-e76fa7b6a1f7	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
5bbfa092-972b-47b5-8ad7-d0341d9b6b8b	bc32d274-8c58-4591-8669-e76fa7b6a1f7	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
649f4b61-4543-4e5d-91a6-dbfb11bb5f19	bc32d274-8c58-4591-8669-e76fa7b6a1f7	fe196a9f-e68f-4df6-ab98-5a2c58ad9b16	1	\N
c69b27a2-d5d9-47d6-b769-dafbad4f2bb4	bc32d274-8c58-4591-8669-e76fa7b6a1f7	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
67a8fad2-d5a8-4a59-b6a1-fc11a64e1490	cb353b71-1ebb-4704-88e2-e1bc53cbe1cb	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Pasta\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Jamón de cerdo
b24d58e7-b671-4d4f-8f0c-57c26e7616eb	cb353b71-1ebb-4704-88e2-e1bc53cbe1cb	890a38ce-311d-45f0-b602-f10798189185	2	\N
dc3f23d2-8307-4968-8c6c-48856ab69693	cb353b71-1ebb-4704-88e2-e1bc53cbe1cb	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
917df360-2c51-44c9-a6af-6807711578cc	311ae63b-e7c6-4022-98ff-f059b7255029	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
fb193ab0-273b-47e8-9ecf-ff33f629dceb	1e035429-2e7a-47d0-8bbc-73bf2a403e23	f0970c1d-9ee1-4a8e-a946-58c01aa22b33	2	\N
a6f02466-e99b-4593-b598-16307c77ee3c	1e035429-2e7a-47d0-8bbc-73bf2a403e23	290b77dc-ac81-48e0-bb33-70fefbe3273b	1	\N
ae216129-32c6-4d81-8bba-acf9e801c776	1e035429-2e7a-47d0-8bbc-73bf2a403e23	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz, Pasta\nToppings: Maíz tierno, Tocineta, Queso feta, Pico de gallo\nProteína: Jamón de cerdo
a2d5da37-40d1-483f-9ed6-a003ad3e7ebe	1e035429-2e7a-47d0-8bbc-73bf2a403e23	84ce9a61-d186-47cb-92b4-afa4d5847dab	1	\N
3bf06a6e-0f9c-4a40-ab23-08dc298e70d7	1e035429-2e7a-47d0-8bbc-73bf2a403e23	fe196a9f-e68f-4df6-ab98-5a2c58ad9b16	1	\N
cc37dc47-e9e3-4284-9a86-c91da113e5ea	25cecc96-c8e5-4e72-a78c-58fc76f1230e	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
67dbb4c1-8b53-4cb5-a1db-50dba9d53a8f	25cecc96-c8e5-4e72-a78c-58fc76f1230e	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
f0327176-e515-4c93-bf3d-4de9f0e7c4c2	25cecc96-c8e5-4e72-a78c-58fc76f1230e	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
7f7f3381-8218-4f11-a675-2cd831443afe	25cecc96-c8e5-4e72-a78c-58fc76f1230e	fe196a9f-e68f-4df6-ab98-5a2c58ad9b16	1	\N
b92d10c7-1a4c-44eb-87a7-a8791969e656	25cecc96-c8e5-4e72-a78c-58fc76f1230e	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	\N
50abd227-dffa-4a05-9600-5ec0f489e18d	25cecc96-c8e5-4e72-a78c-58fc76f1230e	890a38ce-311d-45f0-b602-f10798189185	1	\N
bf844854-6937-4c45-89c8-ab32d7378574	7022e0a3-2a51-4cb6-beb7-4e6587e0eb9d	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	\N
9bf360a9-77b6-465a-997e-64af6faa79ff	7022e0a3-2a51-4cb6-beb7-4e6587e0eb9d	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
9b56395d-f9b3-4339-8c4d-01b07f47f752	7022e0a3-2a51-4cb6-beb7-4e6587e0eb9d	d91e4dd0-47a5-46fc-bf29-35b764305016	2	\N
43a71179-9b3d-460e-a6a0-410ad3795a0a	f86ca3e2-2fc5-4918-b3d1-78c2255ba587	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
17286051-6ecc-4070-b405-c24a84c1a532	f86ca3e2-2fc5-4918-b3d1-78c2255ba587	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
e4ac9675-d4ef-44dc-ab97-6406e0eac477	625d0891-e934-4f39-b94a-5f83beb50503	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua, Pasta\nToppings: Maíz tierno, Champiñones, Chips de arracacha, Queso feta\nProteína: Jamón de cerdo
2d80205f-f2a4-48dc-b3a1-18e65177fed3	625d0891-e934-4f39-b94a-5f83beb50503	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
8739776c-fc23-4441-982e-2ed22944695a	625d0891-e934-4f39-b94a-5f83beb50503	290b77dc-ac81-48e0-bb33-70fefbe3273b	1	\N
4d1a3696-59c1-4ca0-add1-567598d708ff	611df515-c40a-46aa-b953-d1c79416902f	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	2	\N
1cacd507-56e2-4a21-9933-1f9bd634ea26	611df515-c40a-46aa-b953-d1c79416902f	a923676d-77da-4843-9df2-8eb637965cb4	1	\N
07bac5b3-ddce-4b0c-bcab-762d32be8abc	f14569f9-5d32-49bd-a92e-53da5226951a	9570e5a7-af90-4277-91a0-dd6a3de80bd7	1	\N
a58ee97e-7422-4ff6-96d1-ba4a218358ec	f14569f9-5d32-49bd-a92e-53da5226951a	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
ed509c20-4e42-41f2-99f3-600e346506a8	f14569f9-5d32-49bd-a92e-53da5226951a	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
fb80a096-0084-46a3-b58a-be02931a629b	93b9a4a6-52d6-4729-ab9e-c058cf38e2d2	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
cb3c9892-683a-4979-93cc-03c316931c7d	93b9a4a6-52d6-4729-ab9e-c058cf38e2d2	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Pasta\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Jamón de cerdo
7621224d-4550-44f6-9e50-27d2e3898080	6e341b21-50c3-43fc-a256-d21a50eb6f7a	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Maíz tierno, Champiñones, Pico de gallo, Tocineta\nProteína: Pechuga de pollo
8bea673d-2c73-4d76-9ea9-f1bdd1139ee8	6e341b21-50c3-43fc-a256-d21a50eb6f7a	7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	1	\N
aa4fac5a-b275-498b-8683-b9ceed548904	6e341b21-50c3-43fc-a256-d21a50eb6f7a	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
de27f112-6bc3-4617-8feb-d5904355f52d	6e341b21-50c3-43fc-a256-d21a50eb6f7a	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	2	\N
649f0782-94c3-4453-a4e9-dedc5f04ac50	86cd8216-cc20-44ca-9fd2-fff78e8bbb9a	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Pico de gallo, Champiñones, Guacamole, Zanahoria\nProteína: Carne desmechada
33526429-b5cb-4958-906e-d2452e73ecae	64609646-ea6b-48cb-ad69-6f9b570ca387	a6180a54-dcea-4af5-a873-455b03618324	1	\N
33b12291-a812-46da-b605-2040f843daa3	0ef7b910-3764-4969-8787-6557dc8e0162	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	Descuento estudiante 10%
c3cfb92a-a017-45ab-b701-9d5770e06fa9	0ef7b910-3764-4969-8787-6557dc8e0162	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
35803dfb-e933-4ef4-a53b-ae9849a35de3	0ef7b910-3764-4969-8787-6557dc8e0162	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
57e83b20-f5b8-4870-8017-ba26181ec63f	db7fd491-754a-4b36-aed2-c7a6dafd4b9b	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
4ae168d4-a594-418e-870c-e15ed46b9c2e	db7fd491-754a-4b36-aed2-c7a6dafd4b9b	a923676d-77da-4843-9df2-8eb637965cb4	1	\N
9701a55a-31cd-4eac-8948-72be9956c6a9	02194b42-3755-4374-a2b7-f099a74381d6	31a6d560-88e6-45ec-9177-0625136ffe22	1	\N
02f4e693-48ec-4879-8e06-54b41cf901d7	02194b42-3755-4374-a2b7-f099a74381d6	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
42860cfc-c57e-4dcf-afb5-636424191877	02194b42-3755-4374-a2b7-f099a74381d6	36d50cac-2255-4963-b89a-6d7e29450faf	2	\N
35bc9018-1d65-4452-b937-a404bb7e7e9d	abdb000c-7707-43ab-bff2-f11d298473b1	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
c50c3831-9bf5-45d0-bbbc-0a4e2cd55029	7655b835-6a78-4b29-bc57-1b80ceeab56e	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
23a28a97-7f60-4064-9c90-3466607776be	cad9ac26-00bf-479e-8805-56adbb11cd7e	a551c5fe-bf6e-4d9d-a396-22d2147c309d	2	\N
29d1fe08-92c2-45a0-85b3-a8327614ddd3	cad9ac26-00bf-479e-8805-56adbb11cd7e	fc11776c-aef5-449a-9fcf-1e982a0b35ab	2	\N
3a8fb5d0-dfb5-4b6b-837c-535790239eed	21872caf-7ab4-442c-a678-02fbe00879f9	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
21e18a5c-59f1-4e97-b04d-be8335811bc2	21872caf-7ab4-442c-a678-02fbe00879f9	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
2c803c6f-3995-4e49-80fb-522b99308875	ce08628a-6482-492d-b876-0a6b1e4673e0	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
86f8adbe-82e3-4b7e-95a5-b0aed8aaf357	ce08628a-6482-492d-b876-0a6b1e4673e0	ed348c8c-f11a-401a-8865-5ede23240268	1	\N
52cae0be-aec9-4d1e-b52a-b36281a206ec	7f8fb50e-b18d-4239-8663-6d9c3f553052	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
ea8ee5d1-62d4-41fa-adb8-543de2886864	7f8fb50e-b18d-4239-8663-6d9c3f553052	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
fb0948f8-fa61-4dc4-bc03-c5e573254006	17ccdcf3-5e51-4d1f-8e43-f7f46dfb728f	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
fc3c85d6-e51a-4f10-bfce-1142bae2ad9c	0abc1107-2f6b-4924-979f-acb1c5a2ac39	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
60fe5009-88fe-4873-814c-5e72bd544545	40bb8986-bf67-46c2-8bbf-1696fce069dc	a6180a54-dcea-4af5-a873-455b03618324	1	\N
78876c50-efd8-462e-b601-adba1d427328	40bb8986-bf67-46c2-8bbf-1696fce069dc	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
037f6a35-d2e3-4939-a8ef-3a6a29d5184c	39881f31-5bc0-4c79-8daf-95a1a220733e	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	5	\N
a37838f0-57af-4efe-833b-802905d000c5	62a18460-3c21-4aae-9c9a-85b55942e8cd	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Champiñones, Tocineta, Pico de gallo, Guacamole\nProteína: Pechuga de pollo
16ddb5a1-b9cc-4978-9b7e-a5533ef4c9ed	62a18460-3c21-4aae-9c9a-85b55942e8cd	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Pico de gallo, Maíz tierno, Champiñones\nProteína: Jamón de cerdo
1efd9d1b-675f-4800-8492-1fe179b801e9	62a18460-3c21-4aae-9c9a-85b55942e8cd	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
41dd7640-d762-4eb7-88b5-1ef60585afa1	62a18460-3c21-4aae-9c9a-85b55942e8cd	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Guacamole, Pico de gallo, Maíz tierno, Tocineta\nProteína: Jamón de cerdo
d3a36ca1-b060-4bde-8da9-55da819d4533	bd456dd0-e17e-4027-8a48-42c8642bed5e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Maíz tierno, Tocineta, Champiñones, Queso feta\nProteína: Jamón de cerdo
652aa31f-210c-4bd3-9146-94f1753c786b	bd456dd0-e17e-4027-8a48-42c8642bed5e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Champiñones, Tocineta, Queso feta, Guacamole\nProteína: Jamón de cerdo
862eaed0-f894-44cc-b52a-dee3922d7da7	6a956be1-abcb-42ce-85cd-1f4737c9faa6	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
ff3404c2-9033-4c88-aac6-6bd1875f53d2	6a956be1-abcb-42ce-85cd-1f4737c9faa6	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua, Pasta\nToppings: Maíz tierno, Pico de gallo, Champiñones, Guacamole\nProteína: Pechuga de pollo
f3709e17-0a2b-4c28-a2f7-d0145bbe507e	6a956be1-abcb-42ce-85cd-1f4737c9faa6	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Tocineta, Maíz tierno, Queso feta, Guacamole\nProteína: Pechuga de pollo
551efd28-5456-4ad5-beed-99249ee6b3bb	8960b373-f72e-4801-8554-bb96e12fcbad	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	Descuento estudiante 10%
d0481954-7258-447f-959a-700c8ca3a610	8960b373-f72e-4801-8554-bb96e12fcbad	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Pico de gallo, Maíz tierno, Tocineta, Queso feta\nProteína: Jamón de cerdo
0d36eaf7-c1b7-48ed-a41f-25836d48aa18	8960b373-f72e-4801-8554-bb96e12fcbad	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	Descuento estudiante 10%
3eac3a2a-2704-436f-a8d8-da717f20bcb5	8960b373-f72e-4801-8554-bb96e12fcbad	bbe7a283-40e4-4d35-bac2-1aa7423a4058	1	\N
d442946b-283e-4113-8207-52e4752a24e5	4a798f19-a186-4806-8cd9-d7e21a5ac611	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Guacamole, Pico de gallo\nProteína: Jamón de cerdo
184824f4-3233-4c32-8eab-b033785cdd31	8b28c63b-b7a2-4ffe-85d3-0ffdda92c425	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
34f9c84f-8f4d-4b9e-a39a-00d2bad75b03	8b28c63b-b7a2-4ffe-85d3-0ffdda92c425	84ce9a61-d186-47cb-92b4-afa4d5847dab	1	\N
509a15b6-5a38-4666-a6b1-6316c78e1196	8b28c63b-b7a2-4ffe-85d3-0ffdda92c425	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
3911ca5b-618b-4de4-bac0-7a1db2000a07	d2f08b77-b59c-4747-b618-80922eb9595b	fe196a9f-e68f-4df6-ab98-5a2c58ad9b16	2	\N
24b3da3e-329a-491f-ac09-c3e2a11b6375	d2f08b77-b59c-4747-b618-80922eb9595b	d91e4dd0-47a5-46fc-bf29-35b764305016	2	\N
5117a2cf-e5f9-4e20-a54d-51bb7d09979d	752926a2-263a-4df1-8020-9ad62a38612f	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	2	\N
d7e023df-598e-47f5-a5cd-db985e0abdf2	59f3531f-f178-4f8d-812c-1e873ef0d5cf	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
b824c467-4efc-4488-8bb5-482bbe078eb8	5171d0d9-51cf-4a66-928c-28260ade997b	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
b2e0ca02-dca7-4206-959a-cd5134800ed4	88a07553-c5e5-4433-97c2-e1f9ac5d204f	a923676d-77da-4843-9df2-8eb637965cb4	2	\N
b899b5db-6e74-4594-b833-a1e7afbd9517	88a07553-c5e5-4433-97c2-e1f9ac5d204f	3bb93296-c6c5-456a-b165-73c1a20a3134	1	\N
f59d3e0e-e430-4385-83bb-ab636edb5e56	88a07553-c5e5-4433-97c2-e1f9ac5d204f	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
befabcaa-f598-41ea-89d1-8e7ec93c6871	88a07553-c5e5-4433-97c2-e1f9ac5d204f	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
67ee5070-4b01-4291-a679-3318feead02d	225062c4-12c9-497a-8240-bdf580b7d4ab	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
1675ba7f-d986-4160-a164-68b312789656	225062c4-12c9-497a-8240-bdf580b7d4ab	3bb93296-c6c5-456a-b165-73c1a20a3134	1	\N
490798ba-f27f-4510-b139-317514e4c74a	225062c4-12c9-497a-8240-bdf580b7d4ab	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
1514f847-3e72-4dff-bac8-23347b451cc4	225062c4-12c9-497a-8240-bdf580b7d4ab	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
d1299b6d-b10b-41a4-a87c-70330b3ec37b	d91aa98a-666c-49f6-8201-007f30fb283a	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
5338c0da-7038-4078-a67a-c27076fc574f	d91aa98a-666c-49f6-8201-007f30fb283a	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Tocineta, Guacamole, Queso feta\nProteína: Pechuga de pollo
69258dc1-d3ee-42c1-b512-f539f3c58483	d91aa98a-666c-49f6-8201-007f30fb283a	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Pico de gallo, Tocineta, Champiñones\nProteína: Pechuga de pollo
c0915b6f-e53b-4097-9dc8-fc399f7468d4	bcc0a152-00b3-40fd-ab14-e511365a7573	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
56902403-9188-4bd2-873f-d3595883c0bb	938c755c-ce35-4e70-945c-beb8b738caa5	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Pico de gallo, Tocineta, Maíz tierno, Guacamole\nProteína: Pechuga de pollo
d01c35f1-eb63-4c16-9e38-889f330baddf	75b049fd-9437-482e-98b5-bdee58ea9736	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
b8f2856d-ac0e-478d-82c7-10df67bd611b	3e60d411-6149-457b-a6bd-bf62b3efe5b9	b68386e8-b73e-422b-a5b6-47d622faac19	1	Descuento estudiante 10%
17eced6d-2b44-408d-a3c5-bad5b7594735	5922ba0d-9d78-465f-a4e6-5129e6eb5a8c	3bb93296-c6c5-456a-b165-73c1a20a3134	1	\N
e89e06e1-dab4-4ea4-9ff2-3fb2320714ce	eca4d05d-183e-43c5-af90-5a7f8a000bb0	b68386e8-b73e-422b-a5b6-47d622faac19	2	Descuento estudiante 10%
aecee68d-a890-4fbf-9102-07d3c4e51b17	eca4d05d-183e-43c5-af90-5a7f8a000bb0	60c3451b-db1a-45f4-8480-585e01fe2242	1	Descuento estudiante 10%
dcf80085-70f4-4498-b7d8-3fddd6b889d2	eca4d05d-183e-43c5-af90-5a7f8a000bb0	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	Descuento estudiante 10%
d106c540-ba42-4f72-9082-fc8e1953d07e	32a4b5da-dab6-4957-a8c3-b7652cf21b11	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Guacamole, Tocineta, Queso feta\nProteína: Pechuga de pollo
bb33d901-51c8-4582-8943-0d25aff2b72e	7fa3054b-bd50-46cc-8d67-d9a85513f801	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
56adac45-d4f8-42bf-9243-44324eea7d55	6a1de093-9ed0-405b-adb6-da2912cb2c4a	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
f88ca184-e32a-43f9-915a-80a66b296062	bf0e1bad-f3b9-47d0-b4f6-c76c3a6db48b	d91e4dd0-47a5-46fc-bf29-35b764305016	2	\N
38d65306-725d-40c3-8e6c-dff1d43345db	bf0e1bad-f3b9-47d0-b4f6-c76c3a6db48b	890a38ce-311d-45f0-b602-f10798189185	1	\N
c4b8bf55-71aa-4b95-ba31-5d7bbe6d6aa7	bdf830c7-987a-461a-8451-8de8a48eb804	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Champiñones, Tocineta, Maíz tierno, Queso feta\nProteína: Pechuga de pollo
1789b6d4-453d-4a7a-9577-83c1dcd4db53	bdf830c7-987a-461a-8451-8de8a48eb804	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
7e69cf73-6e62-475c-aa77-2090d7c79023	19ddf036-cf1e-4e5b-aa22-575b61fd5d07	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Champiñones, Tocineta, Guacamole\nProteína: Pechuga de pollo
e1eece63-8af7-4af6-a736-1dba616b6516	19ddf036-cf1e-4e5b-aa22-575b61fd5d07	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Champiñones, Tocineta, Guacamole\nProteína: Pechuga de pollo
263c9144-082b-40e3-a789-a7bedebbdbcb	19ddf036-cf1e-4e5b-aa22-575b61fd5d07	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Champiñones, Guacamole, Tocineta\nProteína: Pechuga de pollo
19167867-1020-4995-948c-2ca4be33915f	ac4f60b8-e38c-448b-b3ba-3367e9205963	36d50cac-2255-4963-b89a-6d7e29450faf	4	\N
3cc92555-b4c4-4554-a1e0-ca930480ddcc	2cd67630-cc8e-46f7-a0c7-7ae817e4d999	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
044a5b55-f6d4-45da-a496-7d4ec4e344ff	2cd67630-cc8e-46f7-a0c7-7ae817e4d999	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Guacamole, Tocineta, Queso feta\nProteína: Pechuga de pollo
5416c667-a812-4900-a3dc-a032b383a438	fd386411-5f43-401a-803c-062a135e7796	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
d67b7742-4173-4bd0-920f-1b1c9c2e9391	fd386411-5f43-401a-803c-062a135e7796	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Tocineta, Champiñones, Guacamole, Chips de arracacha\nProteína: Pechuga de pollo
60d4859a-f2ad-41b1-9807-4000b663033f	379dd81b-f12e-42b2-a05d-c8ea1f2e6b09	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
9343cfcb-f071-49bb-89dd-6ecd26fa3fc2	af800575-7c8f-43d8-8892-af4b2ef67f98	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
00cd7a48-780e-462d-b970-bb8e7858e900	af800575-7c8f-43d8-8892-af4b2ef67f98	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Guacamole, Champiñones, Pico de gallo, Queso feta\nProteína: Pechuga de pollo
aa842216-52eb-4e56-b079-2e67d9827b20	c9c96e5f-702e-4be9-b984-9b95782cf82d	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Maíz tierno, Zanahoria, Pepino, Chips de arracacha\nProteína: Pechuga de pollo
928f846d-1862-4620-ab8a-955cf82ac323	c9c96e5f-702e-4be9-b984-9b95782cf82d	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
e806b38f-1e55-458d-ae65-cb97d382bbb1	a2c47dd5-d797-4244-8ee0-c902fa2b6ed9	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Pico de gallo, Guacamole, Pepino\nProteína: Pechuga de pollo
d99d03ce-a1e0-44dc-91a4-6bec8dbf3218	393b94f0-50b8-4809-90a5-f558b3207b4c	890a38ce-311d-45f0-b602-f10798189185	1	\N
131cf257-e4fb-4e04-9511-032fc220e8e9	50835f25-7aaa-4838-9e03-a0c2974fbe0f	a6180a54-dcea-4af5-a873-455b03618324	2	\N
57488f45-5d82-4c0e-b94f-d079b017e452	215a053e-2b88-4985-a877-79e592b42982	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
d6c6e240-9466-47ad-9ad1-2d0ecee4bf8f	215a053e-2b88-4985-a877-79e592b42982	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
1ed419a4-e402-4ff4-adfa-dc3764c2587a	c3eaf608-af3f-4779-a8d8-09a95531e3bf	b68386e8-b73e-422b-a5b6-47d622faac19	1	Descuento estudiante 10%
a288ad1e-40f5-4e3d-90f4-77e81bade019	c3eaf608-af3f-4779-a8d8-09a95531e3bf	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Tocineta, Guacamole, Queso feta\nProteína: Pechuga de pollo
98a02987-68ca-4f93-8ae6-23a0cc8c6712	a55611c1-1b2b-490a-bf1e-55a1bf4814cb	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	\N
2f45aaa3-f6e7-410c-99fc-1f5b555b7750	a55611c1-1b2b-490a-bf1e-55a1bf4814cb	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Pico de gallo, Guacamole, Maíz tierno, Tocineta\nProteína: Pechuga de pollo
acafd0bc-6f37-4a64-927f-41e6bc371a68	31dd0943-ee42-4452-89db-30a674a3a566	31a6d560-88e6-45ec-9177-0625136ffe22	1	\N
e767e8fe-006c-4382-b46d-9333d5205472	31dd0943-ee42-4452-89db-30a674a3a566	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	\N
29b46380-96d7-4a34-8ec8-73dda484fc11	699c3091-60f3-4ebd-9e7a-eae5761cf886	bbe7a283-40e4-4d35-bac2-1aa7423a4058	1	\N
44ff7d86-7915-4fac-b90c-77ed26189b90	699c3091-60f3-4ebd-9e7a-eae5761cf886	84ce9a61-d186-47cb-92b4-afa4d5847dab	1	\N
b55aff99-f41c-4305-9707-87c8515fba9c	699c3091-60f3-4ebd-9e7a-eae5761cf886	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
d85caba8-a7a7-455f-b02f-f07b95783a30	b1a3a135-4128-4da2-af1c-e30d7a5b2b38	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
c2a37c72-3481-4227-bb44-bac0bdd8d8c2	b1a3a135-4128-4da2-af1c-e30d7a5b2b38	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
bcfe1793-6187-4123-a3ad-f17925b180a5	c3fc8389-3132-4ad8-b208-a0f1e24f1805	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
e331a74a-e5df-4d57-ab5e-60a0666c8949	c3fc8389-3132-4ad8-b208-a0f1e24f1805	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Tocineta, Maíz tierno, Guacamole, Champiñones\nProteína: Pechuga de pollo
ae1b129d-5a1f-454f-89d2-e912e3265808	8a1d67aa-6d2f-4e4e-8f41-a1f6932cff60	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	\N
763fc6cd-cfca-47d7-b6ae-95f1804e44f7	8a1d67aa-6d2f-4e4e-8f41-a1f6932cff60	ed74f62f-d2d3-4cf1-a688-dc615363f8c9	2	\N
41ec8d04-ca70-406a-b42f-9af76138093b	ffecc9b9-a793-4e81-b2f0-264ec27229e1	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
22b4d271-2220-4cc6-bba5-90f401fa2534	ffecc9b9-a793-4e81-b2f0-264ec27229e1	522d937d-7d2d-4c3a-b785-f692a09b8a37	1	\N
f66a8885-0480-462d-86b5-827864381d44	ffecc9b9-a793-4e81-b2f0-264ec27229e1	fc11776c-aef5-449a-9fcf-1e982a0b35ab	1	\N
40108223-e605-4eb6-86ad-138a57cf95da	ffecc9b9-a793-4e81-b2f0-264ec27229e1	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
579b443b-2be5-4e89-978d-b466534fa0c5	f46c5e1d-9105-4e81-aaeb-b5aec4291c34	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	Descuento estudiante 10%
936e9d90-cf7d-4d65-a811-978f657ca9eb	79bc39d6-88d6-4aa3-8193-340423f2f90c	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
6d12e5e8-f0d6-4ea0-a007-6bb32fecb4b3	79bc39d6-88d6-4aa3-8193-340423f2f90c	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
128f9633-bb94-4e0c-814a-6a2172749fe5	79bc39d6-88d6-4aa3-8193-340423f2f90c	d91e4dd0-47a5-46fc-bf29-35b764305016	2	\N
b03e6a68-0b08-4449-999e-0bebf37e640f	740dbcef-bbd0-4913-8028-931694ff4839	3bb93296-c6c5-456a-b165-73c1a20a3134	1	\N
ff329736-8f0d-4cd9-9255-d960c86c6f1b	740dbcef-bbd0-4913-8028-931694ff4839	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
830d10c7-bb9d-49d6-af3a-6673721c515e	0effebc6-07f6-4442-853b-687471a63aef	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
b9ca4ca9-aa1f-409b-b12d-890833928aba	3ef182d4-d4cf-46cb-b375-3738ac2e8f08	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
928adee7-7f9b-4b39-bccc-0ddbdd785c9b	3ef182d4-d4cf-46cb-b375-3738ac2e8f08	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
b8209eb3-a069-499e-832a-13ead34aae7d	a79f3aa9-fe31-4cd6-851d-4214af87b733	a923676d-77da-4843-9df2-8eb637965cb4	1	\N
bea46576-4e3e-4a72-9356-574152fa36d6	4a9860a0-4f38-4b97-9c13-3de185de14d0	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	Descuento estudiante 10%
6b6e1b65-de21-42b2-871f-19ea1f87c7d6	4a9860a0-4f38-4b97-9c13-3de185de14d0	b68386e8-b73e-422b-a5b6-47d622faac19	1	Descuento estudiante 10%
197ddf19-3413-43a4-bbe9-3800d918ce7f	0d088a22-dae2-4606-b02e-831fb5095977	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
103574f3-5f29-459d-8cda-230c6d54e14b	61ebd998-1fbe-4382-b2b4-bad5bbe8c122	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
25097c34-0312-4409-87f5-19fcc2c41ba1	61ebd998-1fbe-4382-b2b4-bad5bbe8c122	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
d05553ea-dc46-4a56-8570-1253b546eae4	cbb64822-2388-4f5c-83c3-094d9458b14f	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Champiñones, Maíz tierno, Guacamole, Tocineta\nProteína: Pechuga de pollo
0f5ca262-ab32-4488-97c5-93128803269a	cbb64822-2388-4f5c-83c3-094d9458b14f	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Maíz tierno, Tocineta, Guacamole, Pepino\nProteína: Pechuga de pollo
b2d8171b-653f-47d1-b690-cf3e8ae9d7a7	2c3c4da6-4e94-4591-abd8-dfd018f45bb0	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Maíz tierno, Guacamole, Zanahoria, Tocineta\nProteína: Pechuga de pollo
bd6cdb04-77db-4242-a1db-e6dd80189031	2c3c4da6-4e94-4591-abd8-dfd018f45bb0	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
7a4ff403-15ba-4109-bd6c-5a7b89f51bf7	7778d92c-20cf-475a-97d4-60282845ac1f	febcfb4f-bc51-4719-89dd-765ed174f19b	1	\N
35e2c4ff-78a8-4805-8890-a054d70d444f	7778d92c-20cf-475a-97d4-60282845ac1f	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
c8bd7ef0-1811-4e8d-b455-3df047b53de0	7778d92c-20cf-475a-97d4-60282845ac1f	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
21e5fe48-4a85-4aec-9048-8fe545054aaf	7778d92c-20cf-475a-97d4-60282845ac1f	9570e5a7-af90-4277-91a0-dd6a3de80bd7	1	\N
2f6dfc79-fd97-436f-aea4-f5e8cd5c972f	4531779c-3b51-465e-b13b-da604123444b	153a1ea3-1420-4d88-b427-c23254b00bde	1	\N
39f04a34-7835-4d6d-8108-549f9a4394d1	4531779c-3b51-465e-b13b-da604123444b	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	\N
0d7d2917-53e5-4419-9197-7ddd1d4650f7	4531779c-3b51-465e-b13b-da604123444b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Maíz tierno, Champiñones, Pico de gallo, Chips de arracacha\nProteína: Pechuga de pollo
2f2269de-05c0-4df9-bd51-2ee2693447b5	8c5e7c78-3cb9-44fa-bbd0-bf7ff1317a4f	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Guacamole, Maíz tierno, Tocineta, Pico de gallo\nProteína: Pechuga de pollo
e7305ebb-b34f-4739-aa9d-d92ceaf65ecb	8c5e7c78-3cb9-44fa-bbd0-bf7ff1317a4f	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
b840f9b6-9bf1-4571-9639-943bddb40b8d	8c5e7c78-3cb9-44fa-bbd0-bf7ff1317a4f	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
fa238aa1-cf5d-4575-963b-ab388f70e02b	8c5e7c78-3cb9-44fa-bbd0-bf7ff1317a4f	7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	1	\N
71bc8267-600c-4b5e-9c79-9deb14e7fa46	2f4c1c0f-17fe-477c-bd3f-e88d15807699	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Queso feta, Guacamole\nProteína: Pechuga de pollo
2fdc138a-d9b9-42a2-8b0d-61676258fba5	f56d9d47-36a3-47f0-b889-190a744ad7b2	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Pepino, Pico de gallo\nProteína: Pechuga de pollo
854eee23-f479-4973-85be-b766f782fd2b	a2aac2b1-c407-48d7-8073-fea7d0528b14	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Queso feta, Maíz tierno\nProteína: Pechuga de pollo
f68dc9ce-72b9-49f2-9222-e22fee84f241	f65a580d-f2d9-47ad-807a-5350b844aa8e	290b77dc-ac81-48e0-bb33-70fefbe3273b	1	\N
93dc3f63-052a-4046-a849-3496a7167d72	84a96e20-cade-4099-82fc-b3a81f59338e	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
5c10e40d-9c67-4eb0-8e2e-8d28285e0d4d	b95938f5-d891-4243-970c-124705c5637c	fe196a9f-e68f-4df6-ab98-5a2c58ad9b16	2	\N
0b17dd49-a285-4f92-b171-858a3b71cf8b	b95938f5-d891-4243-970c-124705c5637c	d91e4dd0-47a5-46fc-bf29-35b764305016	2	\N
b2016032-da75-4144-8196-fe6db0a5e9d0	91704602-0a09-4ff5-bb99-501f9161bd3a	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
d50abe3b-f250-420e-bf5f-4abb1c8f4cba	90fc67d5-699d-4607-9000-76309dbb73e5	60c3451b-db1a-45f4-8480-585e01fe2242	1	Descuento estudiante 10%
845add0a-716c-466f-ad47-998405661107	90fc67d5-699d-4607-9000-76309dbb73e5	16325ab3-d934-4d9d-9573-056bded27d08	1	\N
59583381-61ac-40cd-b179-789e601190cd	90fc67d5-699d-4607-9000-76309dbb73e5	febcfb4f-bc51-4719-89dd-765ed174f19b	1	\N
eb5cd1d8-80fb-4ba0-acf5-4a9cc4ce38d7	2171f7f9-f1fd-4b83-8b11-adb19cd7f7ee	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Guacamole, Champiñones, Zanahoria, Tocineta\nProteína: Pechuga de pollo
e558f984-a739-40e8-b109-ae7b5fb2d226	4e87192e-804f-4ec5-8034-76886d92810d	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Champiñones, Guacamole, Tocineta, Zanahoria\nProteína: Pechuga de pollo
ef611f83-ff87-476c-ba96-ec586864b678	5a362269-ce7c-4822-b901-2902f577b450	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Pico de gallo, Maíz tierno, Guacamole, Champiñones\nProteína: Pechuga de pollo
408ec280-f3c2-4bd9-9b42-de8d73e50822	9dc0af81-1471-46c3-b1f8-a8d9e23c50fb	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Guacamole, Champiñones, Pepino, Pico de gallo\nProteína: Carne desmechada
b7a02721-3cb7-4623-91a4-e3f69bab1572	1845e715-ec34-41ef-a919-292bab911d24	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Guacamole, Pico de gallo, Champiñones, Tocineta\nProteína: Carne desmechada
af078842-0757-44e2-98c9-59aff1463635	1845e715-ec34-41ef-a919-292bab911d24	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Queso feta, Guacamole, Pico de gallo\nProteína: Carne desmechada
4fbc73f9-94ce-44b5-8180-1eb7ae2dc007	1845e715-ec34-41ef-a919-292bab911d24	7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	1	\N
75f527ca-7c2c-427c-a5a2-c0564eab0671	1845e715-ec34-41ef-a919-292bab911d24	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
3d3206f5-b4bd-4d05-bc9d-5b4ffbe7bcb2	7ffb487b-e602-4633-af0d-8cd14eac6dc2	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Maíz tierno, Guacamole, Tocineta, Queso feta\nProteína: Pechuga de pollo
10277ce4-9772-4a79-81d6-dd804e7a95d8	e5dc709c-ec25-496d-ab33-eb7eb086d85b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Pico de gallo, Pepino\nProteína: Carne desmechada
6d8d18ff-d186-42dc-9249-76eb2cc07980	b3772ec1-dee9-45cf-bb2d-6456a5a89ad6	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Pico de gallo, Guacamole, Pepino\nProteína: Carne desmechada
a8277317-8053-44bf-98d5-3e82e0a8d46b	02af5abc-6627-434c-aa51-1ee78142d007	f3e97ba3-6dc6-4847-becf-7f84e94873f2	1	\N
1ca7dd8e-f8d6-4764-a5eb-79e3586bcd11	02af5abc-6627-434c-aa51-1ee78142d007	d91e4dd0-47a5-46fc-bf29-35b764305016	2	\N
982ddc85-f6f6-49e8-8d38-1e8923a86f0b	a10f76e1-3f8a-48c1-ab93-fa1884274c5d	fa107d92-d59b-4686-b51f-7df33766c361	2	\N
54279f99-ffa9-4bff-aa8b-68857cf323c3	a20074fc-e85a-470e-a897-60900df5f9b5	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
ea55b019-805f-4957-96fe-7156e11add4f	a20074fc-e85a-470e-a897-60900df5f9b5	fc11776c-aef5-449a-9fcf-1e982a0b35ab	1	\N
335af583-69a3-4f44-ba50-b1e9c0889ddd	d0d61f26-ed3c-41ad-8410-b96f1c8078a1	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
ece9e548-9ab1-49da-85cc-0527b487c2d2	0c3a4f67-5c4a-4c38-a696-5d7f1ab777ec	522d937d-7d2d-4c3a-b785-f692a09b8a37	1	\N
5b33e0a1-6428-4059-a972-cd1f29e7a8a3	0c3a4f67-5c4a-4c38-a696-5d7f1ab777ec	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
86b64415-2731-44b3-9bc8-53135750fa60	7e2da855-7198-4cfc-b243-054659e9488e	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	2	\N
5857181c-d18c-47e0-8335-6770621dd1db	7e2da855-7198-4cfc-b243-054659e9488e	ed74f62f-d2d3-4cf1-a688-dc615363f8c9	1	\N
51c9b933-8850-464d-9291-23e7ed874a3d	7e2da855-7198-4cfc-b243-054659e9488e	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
dedaa153-134e-488a-9e8c-e672c6f5a2c9	7e2da855-7198-4cfc-b243-054659e9488e	290b77dc-ac81-48e0-bb33-70fefbe3273b	3	\N
6484266c-da15-4df8-963b-44aa83c3ae5b	4501b99f-51c4-49e4-957a-37418b546b37	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta\nProteína: Pechuga de pollo
83c632c7-24a4-42fa-9f76-f5af16be11b1	8298a070-12b7-426f-ac9f-45e2d6a57824	f0970c1d-9ee1-4a8e-a946-58c01aa22b33	2	\N
02a212b9-7714-4809-8ac3-48ec3e533c50	8298a070-12b7-426f-ac9f-45e2d6a57824	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
eb554d5d-27e1-4c63-a37d-97ef46ac164c	692231e5-77f7-4489-b3bd-10e0b43d6f24	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
73abad89-1abe-4e3b-949d-c8c215b2dbcf	852b5297-d297-4510-b255-96c2a8c9563e	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
eb3e8c4e-4444-4616-b27c-94220dff8978	852b5297-d297-4510-b255-96c2a8c9563e	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
449dbd3a-5db7-491e-a473-5bc75a07f056	ebc4a867-f3b4-4117-9936-6900208864f1	a551c5fe-bf6e-4d9d-a396-22d2147c309d	2	\N
24a4253b-e17d-4320-a00a-407e9f5edaa9	31a755e6-2467-4ba8-9a97-ae50ede85ddc	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
4ecda372-2eb1-4d4f-8c8d-f82bdd083392	31a755e6-2467-4ba8-9a97-ae50ede85ddc	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
57fa809e-4b7d-471c-bae9-bac3791e3a84	4501b99f-51c4-49e4-957a-37418b546b37	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
381fa1ee-b6a1-4f1a-8590-1ec07c37d5a7	5c1ec0c3-6782-4a78-afcc-a15a6312ee44	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
d6da56f7-9417-4fa7-88d9-eb36bedbd3df	5c1ec0c3-6782-4a78-afcc-a15a6312ee44	d91e4dd0-47a5-46fc-bf29-35b764305016	2	\N
3d763fb3-e705-43de-9780-e23c0c2a8311	6a18e10b-a5d3-43ac-abe1-b29c3a372048	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Guacamole, Queso feta, Champiñones, Tocineta\nProteína: Carne desmechada
2bd75d31-75c1-4a1b-bba3-c12c41817bd1	6a18e10b-a5d3-43ac-abe1-b29c3a372048	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Guacamole, Queso feta, Tocineta, Pepino\nProteína: Carne desmechada
f41cd359-44a9-4d97-b0a1-4450849868e5	902fac33-16c9-4c02-b4ea-9f118bef5218	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	Descuento estudiante 10%
bd147d79-12d8-4eb1-9b28-c993a1423252	26dd1b4e-bd4c-4d68-aaef-632cc1f0556f	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Guacamole, Zanahoria, Queso feta, Pepino\nProteína: Pechuga de pollo
e2c513a9-3814-463b-9b59-a305e3d9e4af	26b18556-6b80-44d4-8a96-45b816d41f6e	60c3451b-db1a-45f4-8480-585e01fe2242	1	Descuento estudiante 10%
d8445ae8-0701-4d97-8c60-81b203e1f694	26b18556-6b80-44d4-8a96-45b816d41f6e	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	Descuento estudiante 10%
c932b172-92ec-41d5-badb-05c316c128a4	26b18556-6b80-44d4-8a96-45b816d41f6e	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
37450146-2a4d-4085-a5b1-feec61a5fa7b	2cad9473-8a42-4a5b-bbd1-7925a84d2700	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
c1bdf4d5-23f1-4bae-baab-803a208b88b3	e2a4ed14-5a5e-42bd-b3d2-37e7fc51c40b	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz, Quinua\nToppings: Maíz tierno, Guacamole, Queso feta, Pico de gallo\nProteína: Pechuga de pollo
6240ce63-287e-41d1-a9be-0ffb7f542764	865f52ae-beaf-42d4-9139-adb41292ed6a	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
54eca09c-ad98-4bf7-8e40-6246ee9f5c61	54121bcd-7e68-4f0f-985c-caa1849182ba	febcfb4f-bc51-4719-89dd-765ed174f19b	1	\N
1e4088ec-2711-4f1f-a440-6518f82d75bc	d9448d14-a177-48ff-b059-93c9c592771a	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
2755595f-f223-4100-a4c2-613ae2d5ad31	d9448d14-a177-48ff-b059-93c9c592771a	d91e4dd0-47a5-46fc-bf29-35b764305016	2	\N
771eee67-d854-4c35-b6a3-17fc80334c52	d9448d14-a177-48ff-b059-93c9c592771a	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
bf98702f-106d-4110-b5af-8c6efb6af814	4ce55b09-9571-4580-9c81-f5118309c47e	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
f9d5a655-bbed-4bd2-8fa3-3232d971c700	95609c92-8fde-4ef6-ab9c-67d4e6022ae0	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Guacamole, Tocineta, Maíz tierno, Queso feta\nProteína: Carne desmechada
91003cfd-9f80-4f9c-b4d8-e8a46f56ad07	e42515f8-2c16-436e-ad0c-2ca8d5c253c9	996be55c-5666-42fd-bb8b-4ef44cd82194	1	\N
919e2988-2200-4dcb-ad29-8e1e94c77090	e42515f8-2c16-436e-ad0c-2ca8d5c253c9	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
6608243f-9dc3-4a36-8725-bf4c436fbb87	5a844205-06a3-4285-bad7-7cb53dbc0bfe	522d937d-7d2d-4c3a-b785-f692a09b8a37	1	\N
58c5e794-a41a-4854-a858-c18cd4cf568b	11bee7cd-e6bd-4566-9dbb-66bcd20d4229	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
84ce3613-000e-4229-91d7-e3478d04988a	11bee7cd-e6bd-4566-9dbb-66bcd20d4229	3bb93296-c6c5-456a-b165-73c1a20a3134	1	\N
14198aa7-8f52-40f8-b8f0-11b388cf947b	11bee7cd-e6bd-4566-9dbb-66bcd20d4229	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
38d15a4b-d4be-4368-9248-e17f6c4d9ae3	7413bd53-ad97-4fd6-a381-6df3834ed854	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	Descuento estudiante 10%
d9c010eb-c7b7-462b-8a28-852f46c7069e	e2ac12eb-dbf8-428d-86cb-25623fd85c93	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
f4fe8775-652f-4db6-8b40-df586c8f6b48	e2ac12eb-dbf8-428d-86cb-25623fd85c93	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
5b763141-542c-4593-94ee-2e3a554328d6	56a6dc5d-a5da-44f9-90c3-09d2362176cc	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
f6c13892-2671-492e-9f0f-b1af17f96f13	a363c763-8698-4cf9-a397-31019c16c1ba	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
7d8c9e11-2f0c-4d2c-a39b-5da73412f5ac	8a3b24ca-a91a-44e4-ad94-b32a1eaa5be2	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
8e20a7de-f517-4fae-a04f-305fe50c530b	8a3b24ca-a91a-44e4-ad94-b32a1eaa5be2	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
5587c8ef-3b2b-474a-ba34-ebb7b681a73c	8a3b24ca-a91a-44e4-ad94-b32a1eaa5be2	84ce9a61-d186-47cb-92b4-afa4d5847dab	2	\N
7c5630c9-af8f-4746-85cf-8a98513724c8	8a3b24ca-a91a-44e4-ad94-b32a1eaa5be2	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
ad23b9dd-683d-4853-868a-a69287eb5d11	df35a376-51e5-47d9-aadf-f2ffa9a8ddb5	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
985094cc-6d05-4de8-93ee-2b3a85ce35de	df35a376-51e5-47d9-aadf-f2ffa9a8ddb5	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
1ed51ecd-d485-4069-9c94-e519761f7d09	df35a376-51e5-47d9-aadf-f2ffa9a8ddb5	a923676d-77da-4843-9df2-8eb637965cb4	1	\N
5c54038d-5ce2-419c-87e0-b6ebf56ad607	df35a376-51e5-47d9-aadf-f2ffa9a8ddb5	1926274b-2765-4f72-810f-6e79ad575a91	1	\N
ff27965d-2a17-462d-85d5-26184a988ed2	df35a376-51e5-47d9-aadf-f2ffa9a8ddb5	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
54ef8ed5-0a48-4386-ae63-aaf18ccc7a48	e681a677-61ba-45a3-8955-db19f49533e9	a6180a54-dcea-4af5-a873-455b03618324	1	\N
3e2bc96c-fd85-4835-9b75-21f6ddc6a34f	e681a677-61ba-45a3-8955-db19f49533e9	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
7fff0d7b-adde-496d-aced-c43d52ccdc1b	e681a677-61ba-45a3-8955-db19f49533e9	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
f6616691-a09f-4299-942a-de94fc3bb62e	e681a677-61ba-45a3-8955-db19f49533e9	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
bd951760-1425-447b-bbf5-2c73d89426d8	d08b9e44-3645-4e0c-8b59-d34ac3b9966b	522d937d-7d2d-4c3a-b785-f692a09b8a37	1	\N
e8e49af6-7e3d-4daa-819b-6edad6efe10c	d08b9e44-3645-4e0c-8b59-d34ac3b9966b	36d50cac-2255-4963-b89a-6d7e29450faf	2	\N
8c4d628a-ebff-4bc1-9c7f-e1c2d3277916	d08b9e44-3645-4e0c-8b59-d34ac3b9966b	153a1ea3-1420-4d88-b427-c23254b00bde	1	\N
56d26277-cdc3-42b1-8329-01888cc68222	4c8b954f-c40d-4e04-af52-af6e2c3b5e4f	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Queso feta, Tocineta\nProteína: Carne desmechada
e5a4f40e-9c08-41f0-8b05-89e253e72ee7	194abf03-548f-479b-a7cc-3b935d0e39c6	c3704705-037f-40c4-976c-d0576e944b21	1	\N
4e069dab-e5e0-4d6f-8138-43bedd1005a3	194abf03-548f-479b-a7cc-3b935d0e39c6	153a1ea3-1420-4d88-b427-c23254b00bde	1	\N
b6e88016-4912-421d-9286-3432b525de4f	194abf03-548f-479b-a7cc-3b935d0e39c6	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	4	\N
efcc5bde-3b8e-4431-a020-7c9bfb33d433	194abf03-548f-479b-a7cc-3b935d0e39c6	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
59fc80b7-7b8b-4d37-9e2f-eede160c8235	7471c3f7-6b99-4d86-b242-ffa9b6471e04	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Queso feta, Maíz tierno, Pico de gallo, Guacamole\nProteína: Pechuga de pollo
6ecc895d-f02f-4128-8fb5-ac47b3649072	7471c3f7-6b99-4d86-b242-ffa9b6471e04	114e2c84-cf03-47a9-abae-b3edd6911ded	3	Bases: Arroz, Quinua\nToppings: Maíz tierno, Champiñones, Pepino, Queso feta\nProteína: Pechuga de pollo
5501ef71-0b0f-4982-96a5-99bc8347fe67	7471c3f7-6b99-4d86-b242-ffa9b6471e04	290b77dc-ac81-48e0-bb33-70fefbe3273b	1	\N
fc8e1db2-3d9d-4841-a9c0-3763bc49a306	b48cac54-831c-4c03-af93-ba8e2e4a4196	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Pico de gallo, Maíz tierno, Queso feta, Tocineta\nProteína: Pechuga de pollo
c3f9d7f2-c436-4865-899f-1237c1116455	4e05d997-957b-4228-bf4f-dd52586599c7	20cc1e0f-330e-42b7-b8b9-05c1069d7682	2	\N
710845ec-fc3c-4e3f-b31e-e32f0356605f	4e05d997-957b-4228-bf4f-dd52586599c7	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
b15062ed-84bc-4d35-b5df-778833f24406	6023ff83-959d-449c-9fe6-4216a8c71ba6	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	Descuento estudiante 10%
4ae953e6-159b-4cdb-906e-d01c501ff20a	6023ff83-959d-449c-9fe6-4216a8c71ba6	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz, Pasta\nToppings: Champiñones, Guacamole, Queso feta, Chips de arracacha\nProteína: Carne desmechada
88cf9bd8-95cf-4f3f-b81c-f74ba9528214	ef588b19-e91f-46f4-bed2-907115ea5481	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Champiñones, Guacamole\nProteína: Pechuga de pollo
700657b5-b87a-44c7-a3ff-6a966cb40aaa	ef588b19-e91f-46f4-bed2-907115ea5481	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Pico de gallo, Queso feta, Champiñones\nProteína: Pechuga de pollo
2f71d6a1-f051-4e5d-99fc-43847e7f1fab	ef588b19-e91f-46f4-bed2-907115ea5481	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
844a1fc8-608c-4ac7-bf87-e654c959fc16	293431ff-23ff-4392-8745-f4cd2897e691	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Quinua, Pasta\nToppings: Tocineta, Pico de gallo, Chips de arracacha, Champiñones\nProteína: Carne desmechada
9d949070-98dd-42dd-8aef-ab0e801f4743	293431ff-23ff-4392-8745-f4cd2897e691	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Champiñones, Tocineta, Queso feta, Pico de gallo\nProteína: Pechuga de pollo
da504b45-fb20-41d2-9e47-9600ffc7e39d	c87a1b8b-77fa-4559-b07e-bf70bd6a1f48	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Maíz tierno, Champiñones, Queso feta, Chips de arracacha\nProteína: Pechuga de pollo
44dcf8fe-b17e-487d-9b82-a5e61b14a1f6	c87a1b8b-77fa-4559-b07e-bf70bd6a1f48	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
6ba396fe-cbe7-4f88-91ec-dfb4ec889145	c87a1b8b-77fa-4559-b07e-bf70bd6a1f48	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
fb462544-e264-4c6e-a43f-68fd6cdd2373	27243e81-0567-4e2d-9860-56020bc3701e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Guacamole, Tocineta, Pico de gallo, Maíz tierno\nProteína: Carne desmechada
30859b76-9095-43ff-ae3e-e93ce8007c9f	27243e81-0567-4e2d-9860-56020bc3701e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Tocineta, Guacamole, Queso feta, Maíz tierno\nProteína: Carne desmechada
28c32bae-6e82-43a5-832c-7a958fdfde89	878a38aa-f19a-4cae-adfa-4e584f331fc3	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
2cf3d38f-f828-4e53-8338-1754a65e1c0e	878a38aa-f19a-4cae-adfa-4e584f331fc3	a6180a54-dcea-4af5-a873-455b03618324	1	\N
edc764c7-3533-42c3-8c1b-a2acad6d852d	caca36b8-a1a5-4231-89c1-e505ebce8327	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Pepino, Champiñones, Maíz tierno, Queso feta\nProteína: Pechuga de pollo
f80f5839-efbf-4344-a42e-e6104355c301	17dbc7e0-6098-47bb-b838-d3dccf3eef5d	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	Descuento estudiante 10%
543a8db2-10cb-41d4-8a34-b255d62a8fad	6d28089b-4b53-40d6-b8fb-d7953e75dc1c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Guacamole, Maíz tierno, Chips de arracacha, Queso feta\nProteína: Pechuga de pollo
772a9b9c-e5d6-42fe-a09f-7fedea7d058a	84e3780a-1408-414f-a3f9-8b697212dee8	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Guacamole, Maíz tierno\nProteína: Carne desmechada
99f833f1-dcd6-4d19-b60a-f70f21c8599e	8c0a6d5d-a44f-4e77-a58f-1ed3aa46e2f8	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua, Pasta\nToppings: Maíz tierno, Guacamole, Tocineta, Pico de gallo\nProteína: Carne desmechada
67813fc2-19fe-43f2-af07-cb15b0378795	a9c4d9c3-9fd0-4a5d-a596-49391c8b6e97	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Pico de gallo, Champiñones, Chips de arracacha\nProteína: Carne desmechada
aa8d1b2b-0ffd-49aa-af91-f99a700f06fe	a9c4d9c3-9fd0-4a5d-a596-49391c8b6e97	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
56cdb702-a2b1-4552-8e25-90c90a29ce86	a9c4d9c3-9fd0-4a5d-a596-49391c8b6e97	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
2685593c-5f2c-454b-95ab-ce23199a1cac	372c271f-a9f8-475c-a435-9ad38cfe8452	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Champiñones, Guacamole, Pico de gallo, Tocineta\nProteína: Pechuga de pollo
a1a5328a-0e38-4836-9927-5999f9ddcc7a	1e7903f4-5f1f-4014-900b-2aaf89e3335c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Guacamole, Chips de arracacha, Tocineta\nProteína: Pechuga de pollo
e327f4bd-ad1b-4f7e-a618-41477f06731c	1e7903f4-5f1f-4014-900b-2aaf89e3335c	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
991757b6-3d0e-46ca-8bbe-f556063fa1f1	1e7903f4-5f1f-4014-900b-2aaf89e3335c	ed348c8c-f11a-401a-8865-5ede23240268	1	\N
3cb1c6a1-f23d-48bd-870d-6f7e0b79d18d	1e7903f4-5f1f-4014-900b-2aaf89e3335c	a1a2c0c2-0779-46b4-87cc-f47473361928	1	\N
99cfc5cd-746a-404c-a110-29a275b7eca1	74881c76-1128-42b6-b4b3-bef2d0b373fc	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
c43284bf-4a95-43fd-bdc9-5a403e1cd3fe	74881c76-1128-42b6-b4b3-bef2d0b373fc	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
f9e27ab2-73be-48e9-a32d-387cfb5485b3	790f8f62-0524-48f1-8b39-4b75ad9b4dc4	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
63d0a8e1-ff00-4da2-8fcd-cb1602940369	790f8f62-0524-48f1-8b39-4b75ad9b4dc4	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
bee4e097-b8bb-436d-b2a3-b48a2e483915	790f8f62-0524-48f1-8b39-4b75ad9b4dc4	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	2	\N
fbb2849d-02c8-4153-b74f-d2e833cb464d	84fd6b62-e81a-42c9-aba6-c7e4b7c346b9	c3704705-037f-40c4-976c-d0576e944b21	1	\N
154bf1fb-5e96-4c05-9c73-15ff0e910a71	84fd6b62-e81a-42c9-aba6-c7e4b7c346b9	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
48504395-9d36-4bb4-9ec1-001321e791c4	84fd6b62-e81a-42c9-aba6-c7e4b7c346b9	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
540aa0e3-1025-46f5-ae68-388594b91481	d93b26a7-a9a7-4d32-a8b3-2f10348eed3b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Champiñones, Pico de gallo, Tocineta\nProteína: Pechuga de pollo
6b34db83-7af4-4fa6-b679-1d7ff8ba005f	2b544ab7-4578-49c2-b9a1-e30b7cc74e9c	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
c9d4cc15-f951-416d-830e-a4f1a468837b	2b544ab7-4578-49c2-b9a1-e30b7cc74e9c	7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	1	\N
e1b3e5df-9536-4031-abed-17ed52750142	8375d937-7e14-4b3c-b288-b8662564ecd9	35a41129-ef96-43e6-8ebc-7c14c4d26605	2	\N
ed2a713c-2e18-44a6-ab3c-a4be4ae621a7	8841efbe-6ac4-432a-8942-eee5a39a9707	35a41129-ef96-43e6-8ebc-7c14c4d26605	2	\N
9089b23e-fb8b-4b36-bc2b-ab7b5248ba18	8841efbe-6ac4-432a-8942-eee5a39a9707	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
d0390fc7-f401-4d0d-8398-c3a31f922786	def5fbaa-aaa3-4dfb-bb85-fbf226d33742	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Maíz tierno, Guacamole, Tocineta, Queso feta\nProteína: Pechuga de pollo
64b93b42-4f1e-4429-8655-9e11c9382638	8ce8bca1-ae93-4cc9-bf25-ee50375c879a	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
c62f20bb-3a38-46d8-9e45-8b53860b4d62	8ce8bca1-ae93-4cc9-bf25-ee50375c879a	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
b72ebec0-6b0a-403d-9942-905bd1db98a1	cc9565d7-9aea-4646-adaf-57f47d028f27	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Guacamole, Pico de gallo, Zanahoria, Pepino\nProteína: Pechuga de pollo
2cec707c-8ba6-4077-b3eb-891d16f767af	cc9565d7-9aea-4646-adaf-57f47d028f27	7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	1	\N
5ac10c37-5041-47e6-b62e-037284340a89	cc9565d7-9aea-4646-adaf-57f47d028f27	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
71a622ce-6a5b-44c8-b49b-84f23aad697a	5e6d7fc1-4fed-4b27-b375-448b3f377b94	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
7c3e2606-b296-487e-9d5f-6ec8d53f9a10	5e6d7fc1-4fed-4b27-b375-448b3f377b94	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	Descuento estudiante 10%
3d30d5c8-9a06-4c3a-874a-962c5812774c	4b370a21-06c8-4866-a723-c5d3e26f984f	890a38ce-311d-45f0-b602-f10798189185	1	\N
0d9ce1f3-dc75-40a3-87cd-ab71af96f18c	4b370a21-06c8-4866-a723-c5d3e26f984f	f0970c1d-9ee1-4a8e-a946-58c01aa22b33	2	\N
3e63e0f1-a529-44bf-a0a0-0e31bdb4724c	4b370a21-06c8-4866-a723-c5d3e26f984f	55a58658-65cd-43dd-a160-6449b3f38a1c	2	\N
970cd2e5-a87f-4701-9247-9df78407ecb1	4b370a21-06c8-4866-a723-c5d3e26f984f	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
452cdc12-7261-4773-a142-0a2aaad5d9be	9c6f9d35-e162-424e-9ad4-f7f82a85091c	a923676d-77da-4843-9df2-8eb637965cb4	1	\N
cf1e2a84-232d-4351-9b61-d69f2ad74632	9c6f9d35-e162-424e-9ad4-f7f82a85091c	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
8a5507fb-b9d7-4577-8b11-026a88f8358c	eee81f51-c7e3-449d-94d9-f1a8eac8d7c5	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
9e632bac-8694-4669-8287-de1b9fdc72d1	eee81f51-c7e3-449d-94d9-f1a8eac8d7c5	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
4ddc75bc-f662-492b-a430-5946c98b4bbd	53f3db87-88a3-46f1-86eb-ce772d633522	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
034f7797-1a23-441d-854d-656ae32fec7f	b768eee7-05f8-4d6b-8354-2467dce62a33	996be55c-5666-42fd-bb8b-4ef44cd82194	1	\N
a7a0168f-21ef-418c-851e-3c895d92fdc8	3947d778-450a-46ba-ab24-e479d68f153a	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
da62b45a-3737-44e8-96bf-2a374785ef22	3947d778-450a-46ba-ab24-e479d68f153a	f0970c1d-9ee1-4a8e-a946-58c01aa22b33	1	\N
6b1ca78d-acbd-4ba1-8e23-8be30c856410	27205744-eba1-47ca-8ccf-53bbece06870	20cc1e0f-330e-42b7-b8b9-05c1069d7682	2	Descuento estudiante 10%
0d911806-7174-4e73-9dbe-664889879a2d	27205744-eba1-47ca-8ccf-53bbece06870	ed348c8c-f11a-401a-8865-5ede23240268	1	\N
e9d138b8-ef89-4148-8b43-3b38edd9453b	2526a849-2df8-45f4-8759-fcc9fccc5879	890a38ce-311d-45f0-b602-f10798189185	1	\N
78e5e31b-212b-41fe-b5b2-ecba632e0fba	2526a849-2df8-45f4-8759-fcc9fccc5879	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	\N
a1249080-d965-43cc-86e0-bd7df58872b2	2526a849-2df8-45f4-8759-fcc9fccc5879	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
ab7c08d3-1838-4630-936b-7c745db1aa03	80af7c80-e1a5-41d6-854f-89c30d7370b0	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
5610ffaa-be58-47c4-93b2-b1271ce3987d	effe1e6c-0162-44da-8c7f-3ee141684312	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Maíz tierno, Guacamole, Tocineta, Champiñones\nProteína: Carne desmechada
7e04bbfa-9c81-4ed7-9a97-2fcb8ef94536	effe1e6c-0162-44da-8c7f-3ee141684312	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
176f69f3-da94-4720-b569-c05745d354af	9279c262-1011-4f28-833b-f2d622f84b96	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz, Pasta\nToppings: Maíz tierno, Guacamole, Tocineta, Queso feta\nProteína: Carne desmechada
4ca4da5e-3336-4a65-9a9e-e8deb0b0e165	aa2ab64d-4ae1-43f0-9fd2-6c2fe9b7b81e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Maíz tierno, Pepino, Tocineta, Zanahoria\nProteína: Pechuga de pollo
c69b9a83-ba41-44d3-ad60-fdba3c847d59	aa2ab64d-4ae1-43f0-9fd2-6c2fe9b7b81e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Maíz tierno, Champiñones, Tocineta, Queso feta\nProteína: Carne desmechada
ba9c9fef-7c27-42d7-b979-b43c2682f663	885f25fe-e467-448a-aee5-6c431457131d	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Tocineta, Queso feta, Champiñones, Pico de gallo\nProteína: Pechuga de pollo
69403be7-c668-4c23-a47e-0e69159a1ee5	885f25fe-e467-448a-aee5-6c431457131d	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
13ecd076-cf1a-4d7f-9dac-87c37b3ee8e9	26fd1d3c-b792-4152-861b-0d28e7b03eff	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	Descuento estudiante 10%
4e61b630-58ab-4da2-9ebf-2ed35d2ccc36	2ab7a9ff-7cec-4359-9d88-9b0c1ac4b889	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
b8e755fd-7206-49ca-b374-9cd1a02cd151	2ab7a9ff-7cec-4359-9d88-9b0c1ac4b889	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
ec370f84-d354-4d33-bc56-1808c1d290ad	2ab7a9ff-7cec-4359-9d88-9b0c1ac4b889	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
fe7502e6-3387-4c01-9a1c-faefa6af598d	229c6e19-de1a-4e2b-bb27-68f040a4ced7	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Zanahoria, Tocineta\nProteína: Pechuga de pollo
ab452098-6c5e-438e-9619-bd79bfbfd54e	74ca0fac-19e0-413c-9652-128576a71930	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	Descuento estudiante 10%
504a42bb-b6ea-4919-90e0-cf9be3cecde0	7639b042-a383-4fe1-9bec-ca43644f6964	ed348c8c-f11a-401a-8865-5ede23240268	1	\N
12000f00-5f67-4364-8277-66aaecaa3d70	469710ef-38d1-42f7-9394-67c6d1c8cc54	b68386e8-b73e-422b-a5b6-47d622faac19	1	Descuento estudiante 10%
6efda92d-44f5-48e4-837d-9dda0e31d8b6	469710ef-38d1-42f7-9394-67c6d1c8cc54	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Tocineta, Chips de arracacha, Queso feta\nProteína: Carne desmechada
4c1aa657-73fc-4a30-8b1d-bfde4f35b3d5	469710ef-38d1-42f7-9394-67c6d1c8cc54	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
7ad161d7-fa68-4679-bce5-b1a5dc008696	725c724a-163f-45a2-afb3-83f4ae55f354	522d937d-7d2d-4c3a-b785-f692a09b8a37	1	\N
671198f2-9319-4d4e-8328-de18983fc27f	725c724a-163f-45a2-afb3-83f4ae55f354	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
90dde1ca-b04b-44eb-9d41-afefdce85218	725c724a-163f-45a2-afb3-83f4ae55f354	febcfb4f-bc51-4719-89dd-765ed174f19b	1	\N
d91938ec-f315-4c1c-abb1-77fa6ac84a22	be065d1f-309c-4856-8144-d869edcf2e28	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
fb5698f2-ec8f-4007-aab3-78ef92d2baa7	b34d281c-e033-4f8d-817b-5b785e334483	31a6d560-88e6-45ec-9177-0625136ffe22	1	\N
fb768158-08ef-477c-be6f-ad6c6753e966	880329d3-dbc3-4da2-99a1-727a8ab0ec81	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
bb0c0831-d369-4405-bebc-c23d1aad04be	880329d3-dbc3-4da2-99a1-727a8ab0ec81	153a1ea3-1420-4d88-b427-c23254b00bde	1	\N
79f85a81-1512-4322-a026-74da7654ad7b	ab4edcbd-8ea8-4aa5-a3de-7c2f6271e83c	3bb93296-c6c5-456a-b165-73c1a20a3134	1	\N
ead3b238-365e-4d91-a168-dfce0e9596ef	ab4edcbd-8ea8-4aa5-a3de-7c2f6271e83c	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
e08bba57-8a2c-4a62-9966-96d83070f278	6c9ad3e1-a7f2-4517-bc32-d1cacaa7a749	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
58817957-6455-4347-bdc9-0fbdf9297d64	19974827-30ec-485c-955b-a6cf9d26bd06	31a6d560-88e6-45ec-9177-0625136ffe22	1	\N
fb96aedf-35fc-487e-baa8-6676ec94272e	19974827-30ec-485c-955b-a6cf9d26bd06	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
e43e5ea0-af16-492a-8a3b-814917e203d2	299b4299-7d59-4277-aa73-0fc42e0f5586	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
c9a916dd-2c61-46ff-b3ff-c78c04d6fc84	299b4299-7d59-4277-aa73-0fc42e0f5586	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
eaacda64-9ad0-44ff-92e8-354434eeb18c	3043bd93-98af-49a4-b479-a5c2b3d0ff4a	522d937d-7d2d-4c3a-b785-f692a09b8a37	1	\N
41991733-2b9d-4c9e-8a22-7ed74a56b1ff	3043bd93-98af-49a4-b479-a5c2b3d0ff4a	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
68bca9f2-9356-4549-874a-704dc5040613	1d11dfbc-0ca8-4ffa-9101-4716e9891ce6	b68386e8-b73e-422b-a5b6-47d622faac19	2	Descuento estudiante 10%
4b90809e-4b54-4b54-a054-320de5f63421	1d11dfbc-0ca8-4ffa-9101-4716e9891ce6	3bb93296-c6c5-456a-b165-73c1a20a3134	2	\N
ca0d45ba-e6a2-44a2-b8fd-51956339e1b3	1d11dfbc-0ca8-4ffa-9101-4716e9891ce6	f0970c1d-9ee1-4a8e-a946-58c01aa22b33	1	\N
0dd87934-b8d3-4472-a530-7a430cfdae09	d713d336-09db-4ef1-bfc4-241b33dd7cc1	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
24b726b3-e9c8-441e-b020-a2b7807f34f5	d713d336-09db-4ef1-bfc4-241b33dd7cc1	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Tocineta, Pico de gallo, Guacamole, Queso feta\nProteína: Pechuga de pollo
5a59546f-6aef-444f-af2c-e5b0d15517d2	0bab0a6d-612a-4bdc-b385-e88b1a894ff6	f0970c1d-9ee1-4a8e-a946-58c01aa22b33	1	\N
ddbe76a3-0a45-4918-893f-00c6a441474d	8ca5a800-7ff7-4e7d-bbc5-8c6e831655a9	fe196a9f-e68f-4df6-ab98-5a2c58ad9b16	1	\N
c4e1f4eb-297c-4448-8b71-d508ff83dfda	8ca5a800-7ff7-4e7d-bbc5-8c6e831655a9	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
7be02ddd-b22e-4939-80d4-cad8963c18db	8ca5a800-7ff7-4e7d-bbc5-8c6e831655a9	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
0708ab95-4ebc-4130-88cd-8c9561ecfe8f	106cdfa7-16bc-4ca5-8cda-286ef6fbe8cd	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Pico de gallo, Queso feta, Tocineta\nProteína: Pechuga de pollo
b440f6f6-2c88-4ce9-b49d-6ff42aeb0db7	623c6eb9-c383-4674-92c8-808c9547540b	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
cf3230aa-fdd8-4c16-b3e5-98779361098b	35614ecd-87c9-449d-8a75-8c914b5b6216	b68386e8-b73e-422b-a5b6-47d622faac19	1	Descuento estudiante 10%
39e2541e-fc33-453d-a21e-849657b7397f	35614ecd-87c9-449d-8a75-8c914b5b6216	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
92f06459-245f-4411-bcbb-40ab2f0f109f	18785cf6-65f1-4a29-84ff-782eeae35e98	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
ecf6da51-ce66-4ff7-8e16-3161e57b0ee1	18785cf6-65f1-4a29-84ff-782eeae35e98	f3e97ba3-6dc6-4847-becf-7f84e94873f2	1	\N
4aa36365-d6d9-4af2-b1bf-9dd7df38d641	18785cf6-65f1-4a29-84ff-782eeae35e98	890a38ce-311d-45f0-b602-f10798189185	1	\N
af72a360-833d-4eb6-b649-13fcbfe6eb5a	73e519fb-574f-4291-b8fb-02824682bf00	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
ce1edb6c-b727-4800-82e7-90998551dbd4	f9fbee80-e2a6-41f8-9446-4454b29b2a29	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
ace389ea-ae78-4bd3-9d57-14918a0deec3	cbf48c47-026a-49b4-a73e-aa3ce87503c0	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta\nProteína: Pechuga de pollo
57925ea2-9436-4774-9bbb-a09e0dc2be26	cbf48c47-026a-49b4-a73e-aa3ce87503c0	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
0baecb67-3058-48a3-b0e1-994dae2357ea	fa3bbccf-1112-4f5d-a81c-c9f6e2d48879	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
d5fec2bf-1fc8-4884-9a7c-d3286a4e4b4a	ed82fde7-ddf6-437e-81ef-aa295e7f93d5	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Maíz tierno, Pico de gallo\nProteína: Pechuga de pollo
24d884e8-cdcc-4948-8238-cb305d0b47df	e5763291-0471-4103-b0b3-0217d887d70b	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
04ed87d1-db6f-4a44-bdd0-3a1b3a2e4028	e5763291-0471-4103-b0b3-0217d887d70b	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	\N
1ba69598-f3e6-401e-b46c-2b1432554927	e5763291-0471-4103-b0b3-0217d887d70b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Guacamole, Zanahoria, Pico de gallo\nProteína: Pechuga de pollo
7faa0cdf-f8a7-40d5-8abb-2f551a5a79f0	e5763291-0471-4103-b0b3-0217d887d70b	55a58658-65cd-43dd-a160-6449b3f38a1c	1	\N
54dda53b-3d41-4c5c-815e-03f850493174	e5763291-0471-4103-b0b3-0217d887d70b	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
95feaf21-5847-443e-8bba-dcd26eae0897	e5763291-0471-4103-b0b3-0217d887d70b	290b77dc-ac81-48e0-bb33-70fefbe3273b	1	\N
ca826f87-bec9-4738-85e5-8a85dee2f5b0	d15db397-84b7-4a94-bc24-32f9e22211ae	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
82645e21-2f48-4175-8ca9-5ac6a1f341b6	d15db397-84b7-4a94-bc24-32f9e22211ae	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
ae02ea1a-ec4c-4983-bed3-dc14009a436a	528705f2-163c-4abe-9610-ed0a055bd2d7	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
cc2ae8ba-6340-47a4-8681-cdf1510ba70d	2731592d-56d1-4767-926e-e1a4263f87f6	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Maíz tierno, Tocineta, Guacamole, Champiñones\nProteína: Pechuga de pollo
9bc7e90b-1279-4a73-8d37-a8677cf7d545	14d90650-852f-49f1-b49c-9c1ba7efa929	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta\nProteína: Pechuga de pollo
e52d4b28-5be3-438a-97b7-4033e49484bf	51fdcd89-3403-4329-8d30-1a5f1a91ff84	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Maíz tierno, Guacamole, Queso feta, Pepino\nProteína: Pechuga de pollo
17599f90-615f-4786-902b-0bdcc64c23c0	51fdcd89-3403-4329-8d30-1a5f1a91ff84	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
3062f7b7-8e32-4c7a-b25d-9ac61ad2f655	51fdcd89-3403-4329-8d30-1a5f1a91ff84	1926274b-2765-4f72-810f-6e79ad575a91	1	\N
01229b4e-7c6b-42d8-8d06-077c2dbeeb84	51fdcd89-3403-4329-8d30-1a5f1a91ff84	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
9b28a2c9-9ed8-4fd8-8246-4cdccaf10405	51fdcd89-3403-4329-8d30-1a5f1a91ff84	36d50cac-2255-4963-b89a-6d7e29450faf	2	\N
3573ceec-56e0-4e51-a018-ed63c2540e44	3c90dcdf-0d37-41e2-9b25-50cda3493ad5	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta\nProteína: Pechuga de pollo
23dcdb8c-c954-4e62-9028-88cbf2fbe4e8	3c90dcdf-0d37-41e2-9b25-50cda3493ad5	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
b0d6316e-d886-440c-857b-a166bd7f8a61	6edf70e4-9127-430f-9e20-f29374d814e0	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
a626faf0-6425-48a6-b50a-2f4ba793d6e3	218f9a95-0586-40ca-852c-16fb0d050445	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
879fd9f3-062f-422f-827b-760999931db3	a96c1c68-51c3-4f97-a9d8-13231fe4e0a3	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
121b800d-31c9-460c-b9fb-ad585b0160bc	a96c1c68-51c3-4f97-a9d8-13231fe4e0a3	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
bdb0569f-9245-48da-9c47-248d734b0f02	fda19aa9-a78e-4f12-ad0a-df0a93b4e5cf	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Champiñones, Pepino, Zanahoria\nProteína: Pechuga de pollo
246736d5-2c7c-41c3-9964-437b2ecedc3d	fda19aa9-a78e-4f12-ad0a-df0a93b4e5cf	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Tocineta, Guacamole, Champiñones, Queso feta\nProteína: Pechuga de pollo
dadceb4d-cb6c-4937-ad70-7e2faeb79a23	fda19aa9-a78e-4f12-ad0a-df0a93b4e5cf	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
e97a2047-6aa1-42e9-933c-25f6b530fa9d	836ccca0-70cf-4247-a088-e7e84514cb2a	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Maíz tierno, Guacamole, Zanahoria, Pepino\nProteína: Pechuga de pollo
fc38ab37-335e-40fb-8bf9-620a09cf5e69	836ccca0-70cf-4247-a088-e7e84514cb2a	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Guacamole, Maíz tierno, Pepino, Tocineta\nProteína: Pechuga de pollo
a88c8b74-03d6-4312-befd-d692e2c8976b	836ccca0-70cf-4247-a088-e7e84514cb2a	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Tocineta, Pico de gallo, Guacamole\nProteína: Pechuga de pollo
9c4a32e0-e661-4ff1-97a5-f16641fd6c6a	836ccca0-70cf-4247-a088-e7e84514cb2a	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Pico de gallo, Tocineta, Maíz tierno, Guacamole\nProteína: Pechuga de pollo
750b0df2-9697-46fc-a37e-ce1d33255006	a54ce571-b5a1-470a-be77-95ff870c4d8b	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	\N
21ba4b95-74c8-430d-9b8e-61338b5677a1	a54ce571-b5a1-470a-be77-95ff870c4d8b	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
ac537598-5339-42be-9774-a8753a713d80	a69bb848-0251-4109-9d4f-c4c9d8a66ed7	d91e4dd0-47a5-46fc-bf29-35b764305016	4	\N
e1c66aad-86a3-4fd7-a1f8-d52b80864003	42a61ba0-4069-4ec1-8f35-d2be8cc60a36	b68386e8-b73e-422b-a5b6-47d622faac19	1	Descuento estudiante 10%
5c34a642-20c5-473f-b8db-5fad3d30247a	42a61ba0-4069-4ec1-8f35-d2be8cc60a36	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
2b7d21ed-d139-4453-8bf8-b94f9bdff17f	42a61ba0-4069-4ec1-8f35-d2be8cc60a36	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
efee9b42-045e-4530-8cc1-4857f5dd12bd	03f9f53a-60ef-452e-93a0-82e9b7b448c6	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Champiñones, Chips de arracacha, Maíz tierno, Queso feta\nProteína: Pechuga de pollo
053a010b-6fed-4fa1-880c-c7ccd67d8660	03f9f53a-60ef-452e-93a0-82e9b7b448c6	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Champiñones, Tocineta, Zanahoria\nProteína: Pechuga de pollo
3760687f-75e1-48bf-9f63-7b5e954e3664	03f9f53a-60ef-452e-93a0-82e9b7b448c6	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Maíz tierno, Tocineta, Champiñones, Pico de gallo\nProteína: Pechuga de pollo
b1005367-f3db-470b-b910-22245f685f3b	03f9f53a-60ef-452e-93a0-82e9b7b448c6	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo\nProteína: Pechuga de pollo
4b4b59fa-2b06-4596-b807-c0798d34447f	d55c84b1-915f-45a9-b1de-cb57bf842df2	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Pepino, Zanahoria, Queso feta, Tocineta\nProteína: Pechuga de pollo
9808aba7-a3b8-4ac8-b8ca-e4a9ff4a4d68	d55c84b1-915f-45a9-b1de-cb57bf842df2	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
c5a25643-88e7-4698-b78b-99b7a07bd900	1f6ff01a-f782-4583-bdd0-65cf473ca6c0	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta, Champiñones\nProteína: Pechuga de pollo
a5fa1ee8-d0e4-45aa-b3d5-2f58b304019f	aecd419d-31a6-4742-919e-57026ef8abb5	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Champiñones, Tocineta, Pepino\nProteína: Pechuga de pollo
e0bda255-9a55-465b-8269-a2919c86720a	aecd419d-31a6-4742-919e-57026ef8abb5	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
39fe2acf-d30e-4dd1-ae00-9237eefaeb51	cea79f22-91e7-4e83-a9b8-3746e8953730	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Queso feta, Tocineta, Pico de gallo\nProteína: Pechuga de pollo
d53e95ea-a458-4509-b39a-e0f56ac60349	cea79f22-91e7-4e83-a9b8-3746e8953730	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Maíz tierno, Queso feta, Tocineta, Champiñones\nProteína: Pechuga de pollo
0446cb56-a0e4-4737-8b4c-28008bd4250f	1e986bc3-4cbe-4ea3-ad49-a671e9befc49	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Champiñones, Pico de gallo, Queso feta\nProteína: Pechuga de pollo
121784c0-a7e4-44e9-ad65-e2e24ffaba65	7347603e-a84b-4186-9b7a-959d2ffb2c6d	f3e97ba3-6dc6-4847-becf-7f84e94873f2	1	\N
8342be10-6986-4902-ac70-9ecea9f02a9f	7347603e-a84b-4186-9b7a-959d2ffb2c6d	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
eaa55728-1380-4e4d-b79b-264653202843	d2f21c00-d9a8-48a9-b313-c8a3b7f580a7	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
d76494cc-8356-44c1-a74a-2f6e45bc9640	222021f8-141f-4e54-a2fb-d0f6d514a86c	ed348c8c-f11a-401a-8865-5ede23240268	1	\N
afb64d40-2ceb-4962-b5e1-b2968a1446af	6272d566-8a1d-4d79-84fc-458ce730f2bc	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
b367c084-613c-4619-9fda-d1940a54054c	fb60945a-bbe0-4693-ba76-2486d661f3c6	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
192cc9ca-d2b6-4fa3-bd52-73191032ec1c	4c42393a-5742-47bf-8bcc-647cb4ec01b0	522d937d-7d2d-4c3a-b785-f692a09b8a37	2	\N
f4721210-5192-4950-a058-cd32ea290bea	4c42393a-5742-47bf-8bcc-647cb4ec01b0	36d50cac-2255-4963-b89a-6d7e29450faf	3	\N
bc77d7ae-b6ab-485b-887b-034d63e0e9e5	4c42393a-5742-47bf-8bcc-647cb4ec01b0	153a1ea3-1420-4d88-b427-c23254b00bde	1	\N
8b337a67-2531-492d-a8fc-e530884c84c9	0b6f6eda-9bb8-45e7-9565-eeeec3d6214e	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
76bc6c26-4566-4542-afb7-484839ae49c8	904364e6-4648-47dc-b113-cc16b8e028ca	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
bf46f777-f4b5-41d0-a47d-36813ea08404	0b63fdf9-6663-4753-8739-90574dcd2cda	d91e4dd0-47a5-46fc-bf29-35b764305016	2	\N
ae125ef2-05f7-4127-8b52-b0c630bacba7	90909866-bf2f-438f-9234-f1170a2615e1	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	2	\N
7ad504e2-f426-49ec-9f42-c2cde5586920	90909866-bf2f-438f-9234-f1170a2615e1	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
23fceeba-f0a8-4018-863f-bfae02004673	90909866-bf2f-438f-9234-f1170a2615e1	890a38ce-311d-45f0-b602-f10798189185	1	\N
042dc682-45bb-4188-9bee-728e89101291	a8428a4c-f9cb-4d76-b0f1-a3793eddd73a	1926274b-2765-4f72-810f-6e79ad575a91	1	\N
1a91a1e7-04e6-4b6e-b846-a335b8d040a0	cb36be9e-bbc6-432a-bca1-1cb4ec107a82	522d937d-7d2d-4c3a-b785-f692a09b8a37	1	\N
e22a4aa3-ab84-4a2a-b8ce-d2beba573aa6	9bf5f289-b464-4b38-a5a3-6637223128d8	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	Descuento estudiante 10%
5f87ba8a-2824-4091-b661-54c93d370645	9bf5f289-b464-4b38-a5a3-6637223128d8	16325ab3-d934-4d9d-9573-056bded27d08	1	\N
b92d0edd-514e-48a1-a54a-cbd941b6114c	9bf5f289-b464-4b38-a5a3-6637223128d8	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
00704e9c-4335-47ba-8a6e-895a66027d23	136ea37c-8354-47af-8fdb-2a151b3bd313	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
b86fc5a0-d3cd-4439-aebb-84ec4ab9892a	93c9ecca-c6e3-43c9-b0e5-da23a06d9fbe	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	Descuento estudiante 10%
3a5acea5-d73c-479d-8802-3f1df0082d5a	523a633e-a4fb-46b3-8f2c-a8d86adfd1f1	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	2	\N
512c9c26-8f5b-4b9d-bc0d-7a31825f3fed	bff01748-134d-40d4-b05c-94f268031d72	a923676d-77da-4843-9df2-8eb637965cb4	1	\N
fccc74d2-a672-4341-9329-ab04fde054bd	511e15b9-de72-4734-b88b-64898106ee35	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
e19c2d30-f0cf-4588-a0c1-2f0b87e0426a	511e15b9-de72-4734-b88b-64898106ee35	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Tocineta, Maíz tierno, Guacamole, Pico de gallo\nProteína: Pechuga de pollo
a6035b35-0f2e-4cc9-ba1c-d929c049a06d	cd7fde0c-8a2e-46ec-b471-94ed17e3fc2e	114e2c84-cf03-47a9-abae-b3edd6911ded	3	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta, Guacamole\nProteína: Pechuga de pollo
342ce686-afb0-447f-8cc7-c2040aee6517	cd7fde0c-8a2e-46ec-b471-94ed17e3fc2e	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
24c15db6-ffbe-41be-8e31-057d2e809dfe	01b39d71-2638-4329-804b-153fb7ab5cea	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Tocineta, Guacamole, Pico de gallo, Champiñones\nProteína: Pechuga de pollo
cab7962f-60cb-4fc5-8600-b1829a833b6f	01b39d71-2638-4329-804b-153fb7ab5cea	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
46757bcd-edcf-4d86-a159-2206884b9305	c9737740-368d-4079-8e07-9da6a238db5a	114e2c84-cf03-47a9-abae-b3edd6911ded	4	Bases: Arroz\nToppings: Pico de gallo, Maíz tierno, Queso feta, Guacamole\nProteína: Pechuga de pollo
c97d38f3-33c1-4a4d-bdd8-2a136bbec2e7	4c42a58a-55dc-4ff7-91f3-943b3066a2ca	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Maíz tierno, Guacamole, Pico de gallo, Champiñones\nProteína: Jamón de cerdo
814add36-5106-4be0-b2ad-27b56197ff7f	4c42a58a-55dc-4ff7-91f3-943b3066a2ca	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Guacamole, Pico de gallo, Queso feta\nProteína: Jamón de cerdo
89b8a1c4-3005-4b1b-993b-c83b7ab4b96d	e3d2054e-e4c5-4710-81f3-a8d46400d101	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Chips de arracacha, Guacamole, Champiñones, Queso feta\nProteína: Pechuga de pollo
e85fba9a-81ad-4599-a0fd-e31ac81a122a	6db66dd3-3e21-42a0-8c9d-163c11e50ed9	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
54bf375b-23db-4e81-9619-a3494faa9ffb	937bb9e8-aa27-455f-af4a-2d83a43109ae	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Champiñones, Pico de gallo, Queso feta\nProteína: Pechuga de pollo
2e6d8f2b-8731-40ad-afc7-050db113fee7	937bb9e8-aa27-455f-af4a-2d83a43109ae	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
71158f4d-4a24-4f50-90e1-58e63ffdc095	0b4fd783-d1d7-4d51-9f05-2eddac37c831	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Guacamole, Maíz tierno, Champiñones, Chips de arracacha\nProteína: Pechuga de pollo
4b0d5931-3120-4ee3-82c3-5a011931be32	0b4fd783-d1d7-4d51-9f05-2eddac37c831	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Zanahoria, Champiñones, Pepino\nProteína: Pechuga de pollo
5934e684-cd57-4ac3-92d7-76d3ea950420	0b4fd783-d1d7-4d51-9f05-2eddac37c831	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
0acddfb5-cad3-4724-bff4-3eeaee881f79	9517a4bc-0871-497e-b9c5-499b665f44cb	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Champiñones, Pico de gallo, Queso feta, Guacamole\nProteína: Pechuga de pollo
dc6fa5de-102e-4372-a551-cd2dd68c0df9	9517a4bc-0871-497e-b9c5-499b665f44cb	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
3e4a2532-8005-4b7c-96d9-2e1aae7f5835	eea156f8-928e-4e79-b9e5-64ff8fe6b51f	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
5ffdcc5b-8742-4db0-b387-b00f304c10c5	eea156f8-928e-4e79-b9e5-64ff8fe6b51f	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Chips de arracacha, Champiñones, Guacamole, Queso feta\nProteína: Pechuga de pollo
b4244bd8-2731-4725-9b21-a4122eeea021	11bb9e81-f5ec-4336-9f20-116e3489c89d	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Queso feta, Guacamole, Zanahoria, Chips de arracacha\nProteína: Pechuga de pollo
4d265408-fb9b-462e-a647-146b1120712e	4782c728-6d4e-4550-a3b3-f2d476fddab5	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
a62e5ca8-5ef2-4db6-a463-c00d86c26fe4	1a74627d-6f06-47dc-a7ee-2e071f0ed53f	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz, Pasta\nToppings: Maíz tierno, Guacamole, Pico de gallo\nProteína: Pechuga de pollo
42826388-9db9-4dc8-8e7c-f89d1f7c75b4	1924a0a8-c9d0-465b-96f4-04942e41ebf1	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Queso feta, Pepino, Guacamole\nProteína: Jamón de cerdo
4232fe25-c3d3-4772-a986-485257f7ed20	1924a0a8-c9d0-465b-96f4-04942e41ebf1	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	\N
d1cecb3d-b0f4-4411-9889-a6d53459e70b	1924a0a8-c9d0-465b-96f4-04942e41ebf1	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
3b48dcf8-4836-47d6-83cf-0ead6b531782	789aa7ab-b534-461c-8aab-84a3ff95f46c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Guacamole, Chips de arracacha, Pico de gallo\nProteína: Jamón de cerdo
8f3ed25d-4d23-4ac0-98b4-ce7a0d8ab6f6	789aa7ab-b534-461c-8aab-84a3ff95f46c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Maíz tierno, Chips de arracacha, Guacamole, Zanahoria\nProteína: Jamón de cerdo
271419e8-1b96-4492-acf2-1b5c671b564e	789aa7ab-b534-461c-8aab-84a3ff95f46c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Guacamole, Pepino, Chips de arracacha\nProteína: Pechuga de pollo
e4cce197-2312-4116-8ed6-726bf212a3fe	789aa7ab-b534-461c-8aab-84a3ff95f46c	36d50cac-2255-4963-b89a-6d7e29450faf	2	\N
c57c66bd-80d2-471b-8b42-da0c111c1f11	665d440e-2475-4605-aa4b-4036568c93de	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
e0de3176-f046-4316-85e2-43984665ff02	665d440e-2475-4605-aa4b-4036568c93de	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
fc0fd049-82fb-407d-8b00-d61a3ab9d580	064950d2-3700-407e-b417-6e0a1edca83e	febcfb4f-bc51-4719-89dd-765ed174f19b	1	\N
90b6d2eb-ab2c-4693-90a1-24e5ac834ce9	064950d2-3700-407e-b417-6e0a1edca83e	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
489ab409-8f38-40b6-9c22-bb1f655c3eb0	778c92a4-42cd-4e81-927e-8c881ce490e6	9570e5a7-af90-4277-91a0-dd6a3de80bd7	1	\N
c8b05e90-da1e-46a6-a850-708c09c7ec0e	88c0f77d-1480-4712-90a9-444a35527b3e	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	3	\N
e202a16b-1ef7-4485-aeaf-c03d1fad6f94	88c0f77d-1480-4712-90a9-444a35527b3e	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
f11da8f6-69ac-4be8-9795-d2530a998107	3e07ab61-6b05-43a7-ad66-f713d9c2886d	b68386e8-b73e-422b-a5b6-47d622faac19	1	Descuento estudiante 10%
e2bcd924-fb6c-4a43-b66b-3a67c87ab33a	3e07ab61-6b05-43a7-ad66-f713d9c2886d	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	Descuento estudiante 10%
efb85fc2-6098-42e4-b1da-35f96e2089e0	3e07ab61-6b05-43a7-ad66-f713d9c2886d	60c3451b-db1a-45f4-8480-585e01fe2242	1	Descuento estudiante 10%
098ae04a-bb11-4e66-8b2d-6f454a067d64	3e07ab61-6b05-43a7-ad66-f713d9c2886d	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	Descuento estudiante 10%
6ddad106-892c-46a9-8a32-9c0d9105a33a	3e07ab61-6b05-43a7-ad66-f713d9c2886d	fe196a9f-e68f-4df6-ab98-5a2c58ad9b16	1	\N
d82673f5-59be-4f59-a7ec-8421ff5f6265	d00ce29d-4b32-4121-b9fb-836e19d64358	890a38ce-311d-45f0-b602-f10798189185	1	\N
c0fb8c15-ca4a-4896-b6ca-a53c7a65c93c	c7f9357f-2f77-48e1-8575-bdef13c24e3f	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
db6c32ad-93d3-48a6-96f7-25fa44c699e1	c7f9357f-2f77-48e1-8575-bdef13c24e3f	ed74f62f-d2d3-4cf1-a688-dc615363f8c9	1	\N
edc0e64f-cb79-4cd4-a2a8-c08947f6691e	c7f9357f-2f77-48e1-8575-bdef13c24e3f	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
4fe7eebc-94c0-41d5-a6ce-1d01732b40e2	7e792309-d5bc-4a31-aecd-5664c15e90c2	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
fc6c83f2-0d1a-47a4-afec-797086ebbc56	7e792309-d5bc-4a31-aecd-5664c15e90c2	28edafa3-ac74-41f0-ae95-a4ea8efc5f33	1	\N
c8190cd6-8dc5-42b9-b7b2-b6053deca45d	7e792309-d5bc-4a31-aecd-5664c15e90c2	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
079422a1-f732-4116-ae48-ca1925d9f24f	1a8ebeed-11e9-48f8-9a01-3a3c98b4eb26	890a38ce-311d-45f0-b602-f10798189185	1	\N
8836a610-ced4-4599-bf83-1201afd0cd0c	1a8ebeed-11e9-48f8-9a01-3a3c98b4eb26	d91e4dd0-47a5-46fc-bf29-35b764305016	2	\N
e1c3ea86-f3f9-4006-9a85-d4087f37cc00	a3fe8a79-2d7d-4e80-94c8-e296021543a8	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
89099d76-4057-4b23-a1a8-b269e05a1f31	a3fe8a79-2d7d-4e80-94c8-e296021543a8	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Tocineta, Queso feta, Guacamole\nProteína: Jamón de cerdo
3539d07c-543b-4b39-a134-9f1b8751ed27	6ba8c949-0de8-458a-99a0-2f7e10d28ec4	fa107d92-d59b-4686-b51f-7df33766c361	2	\N
f9cc0aad-0790-4aef-a37e-2d7ac4eadc53	6ba8c949-0de8-458a-99a0-2f7e10d28ec4	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
4827fc9b-806a-419e-b3dc-f014853b460e	6ba8c949-0de8-458a-99a0-2f7e10d28ec4	d91e4dd0-47a5-46fc-bf29-35b764305016	2	\N
c332aaed-a454-4f1e-8471-2ecce7d38b4c	6ba8c949-0de8-458a-99a0-2f7e10d28ec4	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
0f200906-fec3-4219-b5ad-78e8ae9d1e56	4036fa1f-4313-4c70-aeeb-7aa309590fdc	ed348c8c-f11a-401a-8865-5ede23240268	1	\N
a80da41d-8871-4263-afc1-0dc6d04571f1	4036fa1f-4313-4c70-aeeb-7aa309590fdc	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
78be4d3a-c9b1-4306-9d6b-8ef7d41cff82	4ac1e117-2480-477c-b3e6-e5d69b74ce7b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Champiñones, Maíz tierno, Guacamole, Tocineta\nProteína: Pechuga de pollo
6b30987b-7b45-4c93-aea8-5c8349b8b182	e059640c-43da-4003-af95-224bfa2bb948	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Champiñones, Pico de gallo, Maíz tierno, Queso feta\nProteína: Pechuga de pollo
fcee3620-c667-4de2-b5ed-2fed1480f765	e059640c-43da-4003-af95-224bfa2bb948	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
2241a6bc-92e9-4aff-ae58-49074ab9e759	408c2600-f1a6-4d89-9bfe-eaf048b11006	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz, Pasta\nToppings: Guacamole, Queso feta, Tocineta, Champiñones\nProteína: Pechuga de pollo
9c5e2093-9975-4e23-9c9b-02527f7bb7be	408c2600-f1a6-4d89-9bfe-eaf048b11006	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
58d54e58-618b-416f-8a7f-adb9f138273d	6a196e1c-8716-49fd-8d4a-869aa979b274	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
27ecc997-7d08-4614-b589-12a6edf91e8a	6a196e1c-8716-49fd-8d4a-869aa979b274	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
cb853498-c185-4e3c-9e4a-6bcb3d1bd8c8	b5796c09-5ebc-4053-8725-2b4d5fad45dd	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Champiñones, Tocineta, Pico de gallo\nProteína: Pechuga de pollo
5bbd5dff-9b8c-4ffa-9dd9-8b7a34b05aa7	b5796c09-5ebc-4053-8725-2b4d5fad45dd	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
3e5f9aa7-08bb-410f-aecc-f0745df80b7d	b5796c09-5ebc-4053-8725-2b4d5fad45dd	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
a02b23c6-2753-4112-bd6f-cf75df8fc25e	b5796c09-5ebc-4053-8725-2b4d5fad45dd	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
90dfd4f7-2d9f-4b1f-8b6b-6b51e5165798	5dfae957-294d-4a76-a0c9-a82e9a82ee76	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Champiñones, Maíz tierno, Pico de gallo, Tocineta\nProteína: Pechuga de pollo
636958c4-9ce9-4293-ab3c-a98a0d5e1c00	5dfae957-294d-4a76-a0c9-a82e9a82ee76	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
2f08a9a7-4984-41e0-869b-885b512544bc	f56fa94d-44bf-42e4-8262-4da3240b0548	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	2	Descuento estudiante 10%
b3ba4ff8-e248-444b-969a-b61c92925fb7	f56fa94d-44bf-42e4-8262-4da3240b0548	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
7632fee0-79a4-47f0-82e0-2e5a2df4386a	d6c0d96f-3329-4c5e-aaf0-1fb17d7c527e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Tocineta, Champiñones, Guacamole\nProteína: Pechuga de pollo
59b81b1c-261d-49d0-9ca0-6d8cf0a7adc2	d6c0d96f-3329-4c5e-aaf0-1fb17d7c527e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Guacamole, Tocineta, Pico de gallo, Pepino\nProteína: Pechuga de pollo
251164fd-f98c-46ff-aa51-e36d6a1c9c69	6227c222-7e7a-4085-bf14-5f0643e6c042	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Champiñones, Guacamole\nProteína: Jamón de cerdo
1dfad598-5b06-439a-8115-9687ed3aeee9	6227c222-7e7a-4085-bf14-5f0643e6c042	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Tocineta\nProteína: Pechuga de pollo
6f3e8000-0ba5-4671-a088-1ebceb6dab53	bf939dd9-fbc1-4489-a4ab-7a040dfe2ac5	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Champiñones, Pico de gallo, Maíz tierno, Chips de arracacha\nProteína: Jamón de cerdo
45f3b2e1-70c8-4bbf-a2d1-a27637d40540	bf939dd9-fbc1-4489-a4ab-7a040dfe2ac5	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Maíz tierno, Tocineta, Chips de arracacha, Zanahoria\nProteína: Jamón de cerdo
4d0eced2-53ba-48b1-a4fe-e9e9677788af	bf939dd9-fbc1-4489-a4ab-7a040dfe2ac5	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Champiñones, Pico de gallo, Tocineta\nProteína: Pechuga de pollo
2c84aa3b-9316-431e-af8b-8d2cc1c8abec	c3b92593-1d37-483f-8718-0cbdd56f0af7	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Pico de gallo, Tocineta, Champiñones\nProteína: Jamón de cerdo
b2e5007a-90cc-42b9-a73c-dbbc1aac9661	3064e1d5-8acb-49ee-8eef-d7a56dab61f0	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Maíz tierno, Guacamole, Tocineta, Pico de gallo\nProteína: Jamón de cerdo
81582c51-a719-4bf0-bacd-b6fad6a6f664	f1d9fb19-9cda-4fcf-8b12-86c34a1b2b7f	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Pico de gallo, Guacamole, Tocineta, Chips de arracacha\nProteína: Jamón de cerdo
3d5ff1fb-da44-456a-bddd-1ac4a6a8bc54	5b707867-ca89-49aa-b3eb-b031f60de6e3	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Guacamole, Pico de gallo, Chips de arracacha\nProteína: Pechuga de pollo
50b1ad23-2cba-470e-91ec-f05042d81917	c8010942-05e3-40b9-a150-e7f7a776aaf4	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
d315f8da-2bc9-47f8-84af-504f32accf1e	53e73adb-fc4a-409f-bc9f-68f22e9ce838	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
e210280b-a8bd-46a2-a92d-177ba00636dd	53e73adb-fc4a-409f-bc9f-68f22e9ce838	fc11776c-aef5-449a-9fcf-1e982a0b35ab	1	\N
0c4eba3e-8ad5-407d-a9f9-f931df7b7830	53e73adb-fc4a-409f-bc9f-68f22e9ce838	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
8ee6cdbe-3e5a-44dd-a73c-86f901c55355	28a03697-9484-4783-979d-6e30b0037eca	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Champiñones, Tocineta, Pico de gallo\nProteína: Pechuga de pollo
5b4d4037-c1da-4687-80c5-f27f8b74183d	28a03697-9484-4783-979d-6e30b0037eca	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Tocineta, Champiñones, Queso feta, Maíz tierno\nProteína: Jamón de cerdo
97e35279-ba41-4812-b5fc-21a15305d858	9fc02ffb-00fa-4b9b-8cc3-4305828a936a	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
2ef03d78-cad3-4254-8a5b-6c7f8da5dc98	9fc02ffb-00fa-4b9b-8cc3-4305828a936a	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	\N
ed8de0a3-f850-4429-bf26-3895e6ff3927	1de7ebd1-8394-434e-bb72-e78b47ca3c85	d91e4dd0-47a5-46fc-bf29-35b764305016	2	\N
c813f61c-6f45-47ec-a0be-99268bbb83bf	605330b5-521f-4874-9752-a12c30d94820	31a6d560-88e6-45ec-9177-0625136ffe22	1	\N
d1582c32-98de-44a0-be8f-3405a1b63129	6c0b3c2f-677d-44ba-aa76-ab497ede08a7	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
98676eaa-6019-49f5-9117-2866769624b1	dc290b73-e075-4793-a0d7-8ad969b1aef5	a923676d-77da-4843-9df2-8eb637965cb4	1	\N
d02e887a-cbc0-4a71-a3cc-5574a4a14a6f	8a2dbc99-7bd2-486c-82f1-c524e8fb0364	522d937d-7d2d-4c3a-b785-f692a09b8a37	2	\N
59631a81-c7e2-4306-b01b-3c41814175e7	8a2dbc99-7bd2-486c-82f1-c524e8fb0364	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
f4ed771e-b999-4a2a-bbf8-8996ac201940	2f188242-bcad-43f3-a5c8-9aadeced92e1	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
59d36dfc-3665-4a28-87ab-0e2b4446f742	2f188242-bcad-43f3-a5c8-9aadeced92e1	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
f098da33-f5b8-4fff-ba0c-b65f2f7cffe8	2f188242-bcad-43f3-a5c8-9aadeced92e1	ed348c8c-f11a-401a-8865-5ede23240268	1	\N
b85362db-0ecb-40a3-8dfa-522c899308bd	6a34a3ea-152f-448f-bb25-435425a4eb2b	60c3451b-db1a-45f4-8480-585e01fe2242	2	\N
fda00560-a7fa-4060-b8f0-a9b2a1a2842d	144ab9c9-3a84-4421-a746-073524df4daa	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
0bd39b57-ff64-4264-ad8d-9271c405a46e	b0ea8556-35f0-4bf7-a26f-3ecb33fab9aa	31a6d560-88e6-45ec-9177-0625136ffe22	1	\N
7da200d4-99f2-4d64-978e-68f3284a35f2	b0ea8556-35f0-4bf7-a26f-3ecb33fab9aa	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
1ddc6f89-34d9-4648-87ec-9905454e4cb4	3227adc9-3699-4228-9b7e-d87615909bf4	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
04743fd2-c16d-4315-9839-585958e8dfcf	fff6ba48-a929-4f60-ab68-b47a2156d7d9	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
325a90de-9b86-47bd-ae8d-7f9aee195e22	fff6ba48-a929-4f60-ab68-b47a2156d7d9	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
3cf95346-7079-48d7-985e-ac843d97dbd9	fff6ba48-a929-4f60-ab68-b47a2156d7d9	bbe7a283-40e4-4d35-bac2-1aa7423a4058	1	\N
1977789b-6149-4d3e-964f-322f0bfd3059	fff6ba48-a929-4f60-ab68-b47a2156d7d9	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
d0b620fe-b0a8-4874-b43e-ff57bf8f0163	cef40a4d-7168-48db-9b3a-7b526d8e865f	28edafa3-ac74-41f0-ae95-a4ea8efc5f33	1	\N
bc0ac4ab-377b-4f8d-9963-1f62a4a74e28	7903a752-459e-4f1d-b0b2-756db524dee5	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
ce29e45e-abd0-4ca6-a073-2c6fa600f57f	9091a4f4-89d9-4a9e-950f-b126c8e95ef1	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Pico de gallo, Tocineta, Queso feta, Champiñones\nProteína: Pechuga de pollo
4ee31611-38af-4d94-9fe8-01bcfc35e9ed	302decea-a9ca-41c2-b8b8-a7196ce88a47	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Tocineta, Maíz tierno, Chips de arracacha\nProteína: Pechuga de pollo
46ab361b-39d0-45d4-b47d-393cf60b01d5	302decea-a9ca-41c2-b8b8-a7196ce88a47	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Guacamole, Champiñones, Tocineta, Pico de gallo\nProteína: Pechuga de pollo
7a9d38e6-e0d5-4392-8b8d-9b7b96fdce5c	302decea-a9ca-41c2-b8b8-a7196ce88a47	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Tocineta, Pico de gallo, Maíz tierno\nProteína: Pechuga de pollo
f3a228db-86ed-4c08-8b84-03367753b0dc	302decea-a9ca-41c2-b8b8-a7196ce88a47	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Guacamole, Maíz tierno, Tocineta, Pico de gallo\nProteína: Pechuga de pollo
2f2ae8c6-f2a1-4290-abc8-af72ef52a965	b3570bd4-141c-4b81-91d1-354154f08fc9	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	\N
a1fd195b-c449-43d4-803c-20e667ee94db	05967053-6d4f-4aa1-8941-d76316f44ca7	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Chips de arracacha, Pepino, Pico de gallo, Queso feta\nProteína: Pechuga de pollo
d9c0bd28-bcad-4612-af07-a8de132c1309	05967053-6d4f-4aa1-8941-d76316f44ca7	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Tocineta, Chips de arracacha, Queso feta, Pepino\nProteína: Pechuga de pollo
3c93762d-550c-449b-81e9-d4b083667af2	3f2e8aea-dbaf-44ad-8417-19a934e8eb21	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Jamón de cerdo
9c64b574-28f5-4486-b296-455b0ba7e7c7	d0158ec1-082f-47ad-b74b-9e7a98e48af2	84ce9a61-d186-47cb-92b4-afa4d5847dab	1	\N
bdaee625-3972-44d5-a282-f6f3f26df172	d0158ec1-082f-47ad-b74b-9e7a98e48af2	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Queso feta, Guacamole\nProteína: Pechuga de pollo
5506b682-16b5-4793-ba32-ef93a79cbd58	d0158ec1-082f-47ad-b74b-9e7a98e48af2	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
1fa36ba1-2bf3-4a00-9c60-97385d909c41	5ec1d814-3309-4a92-ba34-10ee9653752c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Pico de gallo, Guacamole, Champiñones, Tocineta\nProteína: Pechuga de pollo
24260117-2f5c-4daf-a8c9-36a7c5ec0a97	59b97f38-4d81-499d-b764-bea462ccbb5b	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
c9d0a9ec-7fc4-4459-9f39-3288d37b7b06	dc4971ce-f8ad-427e-88ae-e2941ea64c1e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Champiñones, Tocineta, Guacamole, Queso feta\nProteína: Pechuga de pollo
2505d2e4-6a28-4163-b36f-165e067e6815	ec863fd9-648a-4d4c-b448-1b08d0bb83bc	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Guacamole, Pico de gallo, Chips de arracacha, Maíz tierno\nProteína: Pechuga de pollo
d3082ccc-660a-4782-813f-382bc79042a4	c41ba611-48a6-40d1-85db-5ec766ec4cc2	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
80c868e5-a07b-47d1-bd22-8342403c2d0a	e21cffb5-b2ba-4c72-99fa-b44b2033ad34	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
4b398ef6-9b1d-49f8-a603-793b51b5a418	c0030c55-b7c1-403e-a713-f37f6e25e499	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Guacamole, Tocineta, Pico de gallo\nProteína: Pechuga de pollo
4670f479-bdce-47ed-a179-7214802d064c	c0030c55-b7c1-403e-a713-f37f6e25e499	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	2	\N
50f9dd2f-70ed-4432-b19d-243a217cf3ea	c0030c55-b7c1-403e-a713-f37f6e25e499	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
a04c1841-7a69-458d-b619-d8516908be3e	e0331f13-f6bc-4154-b7da-72a37345f832	febcfb4f-bc51-4719-89dd-765ed174f19b	2	\N
15dce1e2-3d67-4389-94d9-bc1c71309b2b	518fd497-a168-4570-ac28-162117d5c50b	60c3451b-db1a-45f4-8480-585e01fe2242	1	Descuento estudiante 10%
dd82a00a-616f-4b8c-8ce0-325fc1d4b4af	518fd497-a168-4570-ac28-162117d5c50b	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	Descuento estudiante 10%
773d2119-97c9-4650-b4fb-3ed3b1b16e93	518fd497-a168-4570-ac28-162117d5c50b	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
1b767913-1d0c-4cd2-8a37-2e423507c671	518fd497-a168-4570-ac28-162117d5c50b	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
8f1806fc-cbbc-4f61-b695-86363463e9ec	8e7cc1cc-35a6-4eb8-b9d5-3f377b820a92	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Pico de gallo, Tocineta, Guacamole, Maíz tierno\nProteína: Pechuga de pollo
ab38a1d5-bbac-4ad5-ad08-e063570290be	8e7cc1cc-35a6-4eb8-b9d5-3f377b820a92	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
605826f0-45e5-421e-97a0-ef139ad5cea6	8e7cc1cc-35a6-4eb8-b9d5-3f377b820a92	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
f126a403-fdd9-4052-b0ed-84e363abce0c	38db0837-8713-4a95-a486-e3adf85879d1	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
4e2f3a88-2d7d-4e45-bdaa-366ae93a231e	721483bf-3b01-49f6-9ae3-246490a698f3	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
409f1c0a-1bf2-4c40-92da-c357fcb350de	106be778-0d93-4b68-b306-b427ea436301	fa107d92-d59b-4686-b51f-7df33766c361	2	\N
f8eb8899-2b13-4df8-8e31-d95b41911c08	106be778-0d93-4b68-b306-b427ea436301	522d937d-7d2d-4c3a-b785-f692a09b8a37	1	\N
4cb8da83-49d5-45dc-b24f-0fe38928a602	106be778-0d93-4b68-b306-b427ea436301	36d50cac-2255-4963-b89a-6d7e29450faf	3	\N
e7b3a181-a5ec-467c-858c-6f727e39de4e	b87c518c-cbba-460f-aad2-d797c41daac8	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Guacamole, Maíz tierno, Pico de gallo, Zanahoria\nProteína: Pechuga de pollo
eaaefa43-ef52-41f9-89f0-1c9a9c8d5518	b87c518c-cbba-460f-aad2-d797c41daac8	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Champiñones, Guacamole, Tocineta\nProteína: Pechuga de pollo
301f4330-badb-47a4-892a-cde97fa2a281	b87c518c-cbba-460f-aad2-d797c41daac8	31a6d560-88e6-45ec-9177-0625136ffe22	1	\N
6fe24e34-efcf-4afb-bd4f-883f4abf6b48	a4a108f5-974a-429b-95b6-dec30b93134e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Tocineta, Queso feta, Pico de gallo\nProteína: Pechuga de pollo
c60dfdf0-6b82-4d75-a207-ad62db152d11	a4a108f5-974a-429b-95b6-dec30b93134e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Guacamole, Pico de gallo, Tocineta, Maíz tierno\nProteína: Pechuga de pollo
f7674052-1261-499a-8a26-dcbc689f830b	31519378-21eb-4b0a-84d6-af0a86b44a13	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
7e37bb42-7b0f-4aae-87f9-31e5216a8ace	31519378-21eb-4b0a-84d6-af0a86b44a13	28edafa3-ac74-41f0-ae95-a4ea8efc5f33	1	\N
103cefe7-3870-4b8b-ba99-254103e17296	31519378-21eb-4b0a-84d6-af0a86b44a13	522d937d-7d2d-4c3a-b785-f692a09b8a37	1	\N
f3214a0d-156d-461c-a40d-72f931b1a84a	9de25180-22dc-4306-83f5-73805d4b1eec	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
b948e31b-57f6-4f28-8724-fddcc61a69ee	9de25180-22dc-4306-83f5-73805d4b1eec	0fbc16e4-ff90-46bc-bb85-971c3617df7f	1	\N
30e49722-acc7-4c33-baa6-2b72a9e82e67	4291cf9a-2df6-4536-af02-44b22b44f86d	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
70be725a-f1ff-439d-a06d-d797290e5336	4291cf9a-2df6-4536-af02-44b22b44f86d	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
b6f6b895-b5d2-43e1-b6d6-4ebb26ec0418	5af67d61-8bf8-4334-b1a0-6d931166273e	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	3	\N
e17a6ef3-920e-496c-acd4-ed002cb037ba	5af67d61-8bf8-4334-b1a0-6d931166273e	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
8d06e57d-94f0-4711-89c5-50450988f1c0	5af67d61-8bf8-4334-b1a0-6d931166273e	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
6f8c84dd-dd63-4ea9-8aeb-1de9fe2ec59b	91949f52-fc48-466a-a78d-578bec96f729	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Maíz tierno, Champiñones, Chips de arracacha, Queso feta\nProteína: Jamón de cerdo
a5dc706c-9f16-4df4-b347-8c4aac9ce28c	91949f52-fc48-466a-a78d-578bec96f729	290b77dc-ac81-48e0-bb33-70fefbe3273b	1	\N
e5d474c3-34e5-48f6-9bff-7b71a46632c4	91949f52-fc48-466a-a78d-578bec96f729	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
04d7fd12-70f7-4dac-9d2e-8706b2bac568	2a81149e-de9e-4da9-bba8-d6c22e3e6853	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Pico de gallo, Maíz tierno, Tocineta, Queso feta\nProteína: Pechuga de pollo
463aa570-88d1-494e-b03a-60f580e9b49b	2a81149e-de9e-4da9-bba8-d6c22e3e6853	d91e4dd0-47a5-46fc-bf29-35b764305016	2	\N
b49c90aa-7264-4556-801d-76b27225ddc5	d2366761-67f2-4928-a529-141985d22803	36d50cac-2255-4963-b89a-6d7e29450faf	2	\N
d8e4333a-a31d-473f-88ae-a6992dcc52e3	d2366761-67f2-4928-a529-141985d22803	d91e4dd0-47a5-46fc-bf29-35b764305016	2	\N
4119538e-abc6-4c38-b023-a192467c3110	d2366761-67f2-4928-a529-141985d22803	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
d9820e68-fb87-4901-9a53-dbc737617fd7	385f9ae0-0223-416a-8a39-ea2add229fad	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
9350d7b7-46d3-48e9-bcc4-575c48de7d77	385f9ae0-0223-416a-8a39-ea2add229fad	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
a897c00f-8ba1-4416-af5d-6d553ae512c3	385f9ae0-0223-416a-8a39-ea2add229fad	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
18ed81a9-e79e-433d-8871-09ee42321ee3	1fe6d248-5533-47a2-aebc-a443ae59a525	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Tocineta, Queso feta, Pico de gallo, Guacamole\nProteína: Pechuga de pollo
50dce698-d14f-48ca-835b-c561b43498fc	1fe6d248-5533-47a2-aebc-a443ae59a525	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Tocineta, Chips de arracacha, Queso feta, Pico de gallo\nProteína: Pechuga de pollo
6a116b6a-55ab-4f27-86ea-81a1ada415b2	1fe6d248-5533-47a2-aebc-a443ae59a525	35a41129-ef96-43e6-8ebc-7c14c4d26605	2	\N
00094c54-d460-43d0-accb-e265fa34d5c5	5e94ba31-47f3-421d-9b00-3da132649e9d	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
2a3527cc-b50c-462b-bc4f-722276e77936	5e94ba31-47f3-421d-9b00-3da132649e9d	26512d4f-4da0-4f68-9df9-a325cf972beb	1	\N
493a1fcb-d6cd-4868-8e85-4a310f825e66	b52c4187-f0f1-4605-99dc-96acd48e01dc	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	\N
dc186c97-6911-4a6a-8dc5-b2fb6271dd40	b52c4187-f0f1-4605-99dc-96acd48e01dc	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
6c1ab862-89b7-4f1b-a1a5-8719ea834a66	6e56e64c-57d6-45e8-a257-92729389fe81	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Pico de gallo, Tocineta, Queso feta, Maíz tierno\nProteína: Carne desmechada
984423f1-027b-4590-b65a-e0d006b7b519	6e56e64c-57d6-45e8-a257-92729389fe81	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Tocineta, Maíz tierno, Queso feta, Zanahoria\nProteína: Pechuga de pollo
b7bf4db4-7805-47c7-8739-0e6885211af2	6e56e64c-57d6-45e8-a257-92729389fe81	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
c0a3ff0d-aacd-4aa3-9f85-23e2e408a211	b3c318c5-c42f-4ad4-9cee-123873df0881	31a6d560-88e6-45ec-9177-0625136ffe22	1	\N
08132c3a-19e8-446f-9a57-42b79cc4d7e6	64c72e4e-36e6-44c1-8c61-2c7068250f4d	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Queso feta, Tocineta\nProteína: Pechuga de pollo
804b9aa6-3e2e-4b63-8624-1622f73932d4	64c72e4e-36e6-44c1-8c61-2c7068250f4d	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
78588823-a222-45b7-a5db-a308ced5d821	9a069c9b-fa33-46fd-b2c3-f6327bc0e116	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Pico de gallo, Maíz tierno, Queso feta\nProteína: Pechuga de pollo
9f596bf5-139b-45c1-8928-2f5e000d9d07	e09306a2-5ff9-4cda-9d59-53a415e1d625	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta\nProteína: Pechuga de pollo
43583b4e-490b-42b7-91ea-92ff6c57df88	e09306a2-5ff9-4cda-9d59-53a415e1d625	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
be2ce930-be1d-4709-893f-d5f0da741508	e09306a2-5ff9-4cda-9d59-53a415e1d625	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
7851cd6e-a6ce-45c7-9b57-84d7d12c633a	639d3d4f-cd06-4a92-a435-80e5ae8bc584	890a38ce-311d-45f0-b602-f10798189185	1	\N
cb808376-60c4-4294-9237-713289d1082c	82b44b60-67f9-4858-883e-830940e16298	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
f1cb72b7-7f2c-4442-a9e4-8084463de89e	90b69657-6feb-4e5d-8ff2-506f14cf9e22	f3e97ba3-6dc6-4847-becf-7f84e94873f2	2	\N
76bdff1a-18f6-4f6a-8b7e-bcb5f21b4959	90b69657-6feb-4e5d-8ff2-506f14cf9e22	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
a551abce-793d-43d2-8929-f8618d95dc64	1e80ffa0-18a6-4b21-b2d2-3396005cfd19	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
26146388-99b5-4407-b4b1-aa8fa958f512	1e80ffa0-18a6-4b21-b2d2-3396005cfd19	84ce9a61-d186-47cb-92b4-afa4d5847dab	1	\N
130b6ebe-338a-4b2f-ab13-669038aa38d9	1e80ffa0-18a6-4b21-b2d2-3396005cfd19	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
c05e6d3c-2aca-45a3-b308-75a1fde59f80	1e80ffa0-18a6-4b21-b2d2-3396005cfd19	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
e250a2f9-8135-4e65-a56a-949bc0825d93	41ed69b5-e614-4e05-9b6d-b158b2e82d9a	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
27d365f8-77d9-4224-a00a-ee6e25e7b189	41ed69b5-e614-4e05-9b6d-b158b2e82d9a	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
265466db-c558-4256-a43b-69650a54fce1	b37ccff6-b3a5-4808-9b4c-a56fe101f236	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Tocineta, Queso feta, Guacamole\nProteína: Pechuga de pollo
24438de6-fe3b-4009-900a-b0d2110c4a68	fb6a33b6-6994-4d7d-b086-ed9f26c83e1d	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
1aba9493-da3a-47dd-9460-f29d0e33cd47	f65519fa-23a9-4390-af5b-2e53f51a1aab	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Carne desmechada
6de3538a-f5c2-411e-8dfb-8a1d981bdf21	f65519fa-23a9-4390-af5b-2e53f51a1aab	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
9879f71b-801e-41d8-8742-193fd198c5d2	f65519fa-23a9-4390-af5b-2e53f51a1aab	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Pico de gallo, Tocineta, Queso feta, Pepino\nProteína: Carne desmechada
25a25c21-6932-4199-b63a-81b5a180f7ae	f65519fa-23a9-4390-af5b-2e53f51a1aab	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
9ee5e88c-6b54-4ce3-8130-4546262c5019	f0583fc6-2e1b-4d56-bfaf-c3102eed84a9	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
832713e3-8965-4a27-b22d-9947c7d03f1a	7b1c2577-c168-4800-a7af-629f9b73338b	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta\nProteína: Pechuga de pollo
9aae3ce2-5707-4eba-ab76-6ffe22172075	fbd4807a-6b48-4cb9-949c-9eda121250f9	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
13d18839-2506-408c-9cfa-1966e34da851	12d8875e-65b7-4c73-a086-76ed536f14c4	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
c5cdc0c2-e84d-473e-9d12-d5bb88f8c115	5e442e9a-8748-4087-b3d4-105b19bf5079	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Champiñones, Tocineta, Guacamole, Chips de arracacha\nProteína: Pechuga de pollo
9f10c1dc-4154-4d68-8048-c02ee6ba2e07	5e442e9a-8748-4087-b3d4-105b19bf5079	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Tocineta, Pico de gallo, Guacamole\nProteína: Carne desmechada
6cbaefe6-8e5f-4231-a3a0-2dbe49f532df	feec82aa-5abd-4a4a-abfe-9b7550a46f4d	114e2c84-cf03-47a9-abae-b3edd6911ded	3	Bases: Arroz\nToppings: Maíz tierno, Champiñones, Guacamole, Tocineta\nProteína: Pechuga de pollo
f70827a8-acc0-420e-9369-8b1370757aad	dd20112a-26e2-4fa6-a692-4d540843a698	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
33cecb86-e0b1-4aec-843f-35c08e4660e2	6a16b610-8ff7-4838-af69-aae695a1a7c4	26512d4f-4da0-4f68-9df9-a325cf972beb	1	\N
4bab2c5b-be0c-4c9b-bcd2-137608045389	6a16b610-8ff7-4838-af69-aae695a1a7c4	fc11776c-aef5-449a-9fcf-1e982a0b35ab	1	\N
6edb0a29-e0a6-4dd3-b080-cc05985aaa71	026e702c-c8e1-4ee2-8ad9-d7147cb4b8c7	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Arroz\nToppings: Chips de arracacha, Guacamole, Champiñones, Queso feta\nProteína: Pechuga de pollo
a9214ebc-920e-4c17-bde8-d6198b3c7cb0	026e702c-c8e1-4ee2-8ad9-d7147cb4b8c7	c7572bb3-01f8-4c66-a3e3-0c262093761c	2	\N
690d0b66-bdc2-4f08-9c83-d86314954b0b	9d52ded6-ca55-42a4-8dfd-8664f6e0b356	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
e448a708-abac-4336-bacc-f11b3aa994eb	e52bef0e-4eb5-49b8-89e2-64a10cbb0031	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
acb8aa80-3737-4bd5-b188-939b0d4b083d	e52bef0e-4eb5-49b8-89e2-64a10cbb0031	f3e97ba3-6dc6-4847-becf-7f84e94873f2	1	\N
e3da0067-2382-4142-8118-db5ff27967df	e52bef0e-4eb5-49b8-89e2-64a10cbb0031	36d50cac-2255-4963-b89a-6d7e29450faf	2	\N
e37432a8-0dab-4953-8011-8c99696b7391	3eacbd18-f932-4dfb-8ffd-e757b535421c	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
9358cb37-bab4-4c5b-82f8-4493fecb8652	3eacbd18-f932-4dfb-8ffd-e757b535421c	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
ff398903-be7d-4c62-b164-4f140dedc6bc	3eacbd18-f932-4dfb-8ffd-e757b535421c	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
2d8ca66f-c562-48a8-a4b5-c1c8634b781e	3eacbd18-f932-4dfb-8ffd-e757b535421c	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	\N
656f75c1-018f-4393-8672-02821f2d6e76	7cbd0abe-f34b-4acc-8ab9-6f7dc8702255	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
a0913b81-8e02-4232-81f1-267b40adab1a	7cbd0abe-f34b-4acc-8ab9-6f7dc8702255	fe196a9f-e68f-4df6-ab98-5a2c58ad9b16	1	\N
00eec579-b1ad-49ed-823e-87d82e4e4033	7cbd0abe-f34b-4acc-8ab9-6f7dc8702255	28edafa3-ac74-41f0-ae95-a4ea8efc5f33	1	\N
0590e353-0e0b-40dd-a220-908e1d790036	7cbd0abe-f34b-4acc-8ab9-6f7dc8702255	c3704705-037f-40c4-976c-d0576e944b21	1	\N
b36591d7-0340-426e-be8d-12ca5eab9977	7cbd0abe-f34b-4acc-8ab9-6f7dc8702255	20cc1e0f-330e-42b7-b8b9-05c1069d7682	2	\N
87e2342a-1bce-4006-ba39-ef7fa728f093	7cbd0abe-f34b-4acc-8ab9-6f7dc8702255	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
d3e6a3dd-a0e6-4cbf-9c37-3cf703fb454f	681c46a9-9740-4f63-8caf-fccdd1f02913	35a41129-ef96-43e6-8ebc-7c14c4d26605	2	\N
87e49e11-cfb6-4b09-bf01-c47ffc9cfd31	681c46a9-9740-4f63-8caf-fccdd1f02913	bbe7a283-40e4-4d35-bac2-1aa7423a4058	1	\N
68751e2d-00ce-486a-bfec-f48785d5fb5f	3f8cb8fc-aad9-4f42-8201-179f73423f41	b68386e8-b73e-422b-a5b6-47d622faac19	2	\N
aef930ca-9aa1-4801-be7a-361c65f68ff4	d872eeba-4aa2-4810-96e8-b255e8a9f4c4	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Queso feta, Maíz tierno, Tocineta, Pepino\nProteína: Jamón de cerdo
b4b8942f-8fd5-4e5c-8db5-034a399b1c5d	d872eeba-4aa2-4810-96e8-b255e8a9f4c4	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Pico de gallo, Tocineta, Champiñones\nProteína: Pechuga de pollo
8363125e-27b4-4739-b2c0-560d8bcfb638	d872eeba-4aa2-4810-96e8-b255e8a9f4c4	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	\N
42bd4849-ef9e-4144-8002-e577cd144181	d872eeba-4aa2-4810-96e8-b255e8a9f4c4	a6180a54-dcea-4af5-a873-455b03618324	1	\N
467d5f48-a113-4265-8beb-f91b4d5f8294	3546cd76-00f6-4b13-951b-19c44f61985b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Tocineta, Guacamole, Queso feta, Maíz tierno\nProteína: Jamón de cerdo
e540017d-896d-47cc-a54d-5cd60637625e	3546cd76-00f6-4b13-951b-19c44f61985b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Guacamole, Champiñones, Tocineta, Pico de gallo\nProteína: Carne desmechada
30c4a450-ec76-49b5-b1d8-8150aebf2192	3546cd76-00f6-4b13-951b-19c44f61985b	290b77dc-ac81-48e0-bb33-70fefbe3273b	1	\N
c300fce4-fe88-44f4-ab77-c82b7181aae8	e0e2ef54-e04f-4b33-8e38-1ded2af76770	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Tocineta, Guacamole, Zanahoria\nProteína: Carne desmechada
e5e36fc1-bd4e-4d58-8ffd-19ba2f5fa198	e0e2ef54-e04f-4b33-8e38-1ded2af76770	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
49a76c75-77b1-4f19-b5c5-c91a80c86500	6a35b079-183b-4c9a-bcc1-c49f0175e130	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Zanahoria, Tocineta, Queso feta, Maíz tierno\nProteína: Pechuga de pollo
d9e64c4b-fdee-46a5-8569-5f7af7cd2c35	adb2a053-e787-4aef-8d8e-0737d8186204	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
86063ccb-666f-45c9-bb66-d7c5d527a7b1	feaf8600-a8c0-4ed6-b80a-62da533b98f5	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Zanahoria, Chips de arracacha, Pico de gallo\nProteína: Carne desmechada
54580dfe-9223-47ea-9a4d-06a229e3edeb	feaf8600-a8c0-4ed6-b80a-62da533b98f5	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
62d8005c-3ac1-47e9-9748-0e68a1620d25	5c65573e-1f98-4bdf-a066-444e7c3002bc	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
a1df5507-2d7c-40cd-837c-48cf7a309989	d628d702-fb9e-4c50-bbd0-fcc0eba25cda	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
ac2a3a81-7778-44fc-9643-7efa2d04ea02	d628d702-fb9e-4c50-bbd0-fcc0eba25cda	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
354c42d0-7d6d-486a-92ff-a32a4a5331a9	effe837e-074e-48f3-a95e-07b5acc5b398	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
78851fe8-0597-433e-a96e-6ccf6d8f9713	effe837e-074e-48f3-a95e-07b5acc5b398	36d50cac-2255-4963-b89a-6d7e29450faf	2	\N
f073ee03-0d29-44a8-88dc-409942aac95a	effe837e-074e-48f3-a95e-07b5acc5b398	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	\N
392f32a4-863c-4f8a-865a-1126279afda9	effe837e-074e-48f3-a95e-07b5acc5b398	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
40166cf8-22a9-4a09-9d1d-0ad33cb51d15	1aacd7d1-81ef-4bd5-a704-914991978fd7	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta\nProteína: Pechuga de pollo
bbac7800-9046-41ad-8186-cf2aeb8851ab	1aacd7d1-81ef-4bd5-a704-914991978fd7	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
47fbd805-c382-4fa9-a74c-5c0dddb6699e	ebb87bf9-3db2-4e0c-983d-c3477e97a646	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Guacamole, Queso feta, Zanahoria, Maíz tierno\nProteína: Pechuga de pollo
01fb1a53-d0e0-405d-a425-1c84868f336f	ebb87bf9-3db2-4e0c-983d-c3477e97a646	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Queso feta, Chips de arracacha, Pico de gallo\nProteína: Pechuga de pollo
0eb67d79-f6d7-44b0-a025-8a815178979d	d6cb5aa3-6910-47be-bccf-956bd5e28c7e	36d50cac-2255-4963-b89a-6d7e29450faf	2	\N
daa5b3aa-7138-437c-880f-86314e27fcbe	d6cb5aa3-6910-47be-bccf-956bd5e28c7e	fa107d92-d59b-4686-b51f-7df33766c361	3	\N
e7332d46-e1bd-4c73-af5c-750f079d4c80	35734079-38c8-4b0a-966f-284e1f1239f0	fa107d92-d59b-4686-b51f-7df33766c361	3	\N
8383cb09-6676-4485-b719-a6127fe384de	35734079-38c8-4b0a-966f-284e1f1239f0	fe196a9f-e68f-4df6-ab98-5a2c58ad9b16	1	\N
1f5d3598-cdec-4a8f-80e8-6e0a18fdad47	35734079-38c8-4b0a-966f-284e1f1239f0	36d50cac-2255-4963-b89a-6d7e29450faf	4	\N
973ad6b1-f9e5-4ed0-a9ec-8c034e632605	51416047-f8bc-4768-b323-1d7231bee7ab	ed74f62f-d2d3-4cf1-a688-dc615363f8c9	1	Descuento estudiante 10%
aafc8d09-3955-4b25-af36-b17f7634ba7c	51416047-f8bc-4768-b323-1d7231bee7ab	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
3f493c95-2325-434a-825a-cf642c5c3264	1366d1e2-43e2-490b-ada7-82b1be5774b2	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
dcfd1859-0539-4de3-9263-0d8953077da8	bbd89a91-d526-4068-b009-00142e7158f3	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
6e765d79-145f-4842-b5ab-2c7c9f12072e	c41ba611-48a6-40d1-85db-5ec766ec4cc2	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
964e9928-b030-4e98-be2b-10d56a914e0b	ce3806b0-5842-4250-8f49-392adc564cba	a6180a54-dcea-4af5-a873-455b03618324	1	\N
3ab9b778-9176-427d-bf57-18541d251b86	ce3806b0-5842-4250-8f49-392adc564cba	febcfb4f-bc51-4719-89dd-765ed174f19b	1	\N
e6c4bb59-183c-4f73-9566-e1cf1db1bcdd	4f06b9e2-64e1-42fd-af71-b963f149a5ad	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
b0985a1a-f720-47fe-9f56-9c8b0b2b0228	4f06b9e2-64e1-42fd-af71-b963f149a5ad	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	\N
ab7666d1-7e33-4e2e-ad69-fd20c01aa352	b9accae5-bf3d-42e4-9e99-84f8203b3291	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
00de3782-a053-4ab5-97eb-1df5d60b9817	b9accae5-bf3d-42e4-9e99-84f8203b3291	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
37b824fb-366e-4492-92f2-2017f4a26048	b9accae5-bf3d-42e4-9e99-84f8203b3291	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
93596ec5-3277-4c3e-9e1f-403d2a281580	b9accae5-bf3d-42e4-9e99-84f8203b3291	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
0eb4ccbd-34c8-4679-ae09-83602b190387	7dc26a59-aff9-4772-add0-68585c439036	fe196a9f-e68f-4df6-ab98-5a2c58ad9b16	1	\N
794fdc1a-8c4f-45b8-83ed-35d49c259447	7dc26a59-aff9-4772-add0-68585c439036	36d50cac-2255-4963-b89a-6d7e29450faf	2	\N
0d526145-ba12-4753-97a5-282f946b238d	7dc26a59-aff9-4772-add0-68585c439036	3bb93296-c6c5-456a-b165-73c1a20a3134	1	\N
9c5a223d-3855-49cc-8e63-f3649619b05c	20fc4224-e17d-437f-99a7-83deab25f137	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Tocineta, Queso feta, Champiñones\nProteína: Pechuga de pollo
3425499f-9ad4-40f0-b6a5-ed87d94fc26d	a9530e36-320d-46ac-bf36-55f353304fe4	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
be58a38b-0a82-436a-bce9-d1da0e325cf9	75eabd19-3958-453a-9424-5253c648ad35	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Queso feta, Guacamole, Tocineta\nProteína: Pechuga de pollo
e6f1375b-3f0e-4e12-8341-ba8ac5593533	9e8e5305-fcf3-4b2a-996c-9d5d2e06cdc9	febcfb4f-bc51-4719-89dd-765ed174f19b	1	\N
8b274e4a-c6b5-4fbb-841b-a190a31f7a17	9e8e5305-fcf3-4b2a-996c-9d5d2e06cdc9	26512d4f-4da0-4f68-9df9-a325cf972beb	1	\N
27cdb5ff-26f3-4f93-b3f0-875a32a3f638	96d55639-5f15-46c9-a652-84c0683e1599	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Champiñones, Tocineta, Queso feta\nProteína: Pechuga de pollo
25bc2a8f-75ec-4560-8202-bcb739bc7537	96d55639-5f15-46c9-a652-84c0683e1599	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
35447824-7d44-4cbe-bcd5-f9891f979987	ee2c5520-35a6-4502-8444-f5aede2b1a28	31a6d560-88e6-45ec-9177-0625136ffe22	2	\N
374e27dd-4ac2-4ca8-b7eb-6351410cdc5e	ee2c5520-35a6-4502-8444-f5aede2b1a28	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
b2db42c4-967f-4b3d-a82f-428c8a136c5d	b9e977e5-3cbd-4bae-b26b-87da91b55747	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Champiñones, Tocineta, Guacamole\nProteína: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
605f5a89-5762-405c-9e9f-af7e100a630f	b9e977e5-3cbd-4bae-b26b-87da91b55747	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Champiñones, Queso feta, Guacamole, Tocineta\nProteína: Pechuga de pollo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
7e360440-c663-48fb-8a07-acb24034b56e	b9e977e5-3cbd-4bae-b26b-87da91b55747	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Guacamole, Champiñones, Pico de gallo, Tocineta\nProteína: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
ad7ee4da-394d-49a4-ab48-46449483ef2f	fc5268f2-5e8f-4a04-b882-7144a88dddfe	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Guacamole, Tocineta\nProteína: Pechuga de pollo
85b81339-d067-44df-8ea9-bdb773f392d0	fc5268f2-5e8f-4a04-b882-7144a88dddfe	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Tocineta, Chips de arracacha, Queso feta, Guacamole\nProteína: Pechuga de pollo
0d05e5b0-3a02-46ee-bd95-b8e8418490f4	fc5268f2-5e8f-4a04-b882-7144a88dddfe	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
6fbda96c-6a05-4a85-87c6-64372d6f9671	fc5268f2-5e8f-4a04-b882-7144a88dddfe	fe196a9f-e68f-4df6-ab98-5a2c58ad9b16	1	\N
0a759ec3-6e7b-4191-a61d-86e426b9c807	fc5268f2-5e8f-4a04-b882-7144a88dddfe	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	\N
8c6810e3-7ecd-4163-841a-4c710a2a370e	cd359fb2-1e03-45c9-982d-8eb7c222ba90	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Champiñones, Guacamole, Pepino, Queso feta\nProteína: Pechuga de pollo
c49b5dab-a969-4578-9217-b9cc2425ee6c	cd359fb2-1e03-45c9-982d-8eb7c222ba90	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Guacamole, Queso feta, Chips de arracacha\nProteína: Pechuga de pollo
8942f8f1-a0de-4302-b5fb-95cb8f38dbb8	66439bf0-533a-417c-a2ff-70f1c2c0dd1d	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Pico de gallo, Champiñones\nProteína: Jamón de cerdo
f5534107-528c-4496-b291-a0a3cadd0022	66439bf0-533a-417c-a2ff-70f1c2c0dd1d	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Tocineta, Maíz tierno, Guacamole, Pico de gallo\nProteína: Jamón de cerdo
d847d81d-71ea-491a-a6bc-59d89e53af80	41660d72-e709-4209-b6b0-6b0d20cf6741	890a38ce-311d-45f0-b602-f10798189185	1	\N
9cefc336-588f-456e-9bc6-ae3d167763d7	17f5b545-d61b-4fef-b8c1-ff78ae877fe6	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Champiñones, Pico de gallo, Zanahoria, Maíz tierno\nProteína: Pechuga de pollo
10fed405-b373-433f-bb7d-64c19304fb40	17f5b545-d61b-4fef-b8c1-ff78ae877fe6	ed74f62f-d2d3-4cf1-a688-dc615363f8c9	1	\N
ec847b42-ebe5-40d0-be06-c2e2faeac8d7	0a4e9e30-bc10-4a6f-9494-a7fa96801623	36d50cac-2255-4963-b89a-6d7e29450faf	2	\N
e6bd01e2-6734-4d1d-ba3b-9ad874365017	0a4e9e30-bc10-4a6f-9494-a7fa96801623	fa107d92-d59b-4686-b51f-7df33766c361	2	\N
9472488b-8992-4ee0-b2bd-506c8bf34fe3	0a4e9e30-bc10-4a6f-9494-a7fa96801623	114e2c84-cf03-47a9-abae-b3edd6911ded	3	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta\nProteína: Pechuga de pollo
2519927e-39fe-403d-b758-82b7ea9dc866	0a4e9e30-bc10-4a6f-9494-a7fa96801623	fe196a9f-e68f-4df6-ab98-5a2c58ad9b16	1	\N
9460049e-53d3-4251-b7f1-708a8f0e8297	0a4e9e30-bc10-4a6f-9494-a7fa96801623	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
6d786dca-b302-47d9-a95d-7ae21c70d86f	ff3e92a3-2087-423a-bbb3-88a1e6f0af0d	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	\N
8d46465b-2962-49d5-9e33-ba1fc0175b75	f516ddeb-fe7e-49ac-b3f2-ee4dd8063267	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Chips de arracacha, Pico de gallo, Maíz tierno, Champiñones\nProteína: Pechuga de pollo
3ca2684f-7e34-486b-b45a-a7dfecbadf78	83435164-9963-4b15-a2b8-6aa3b44705a1	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	Descuento estudiante 10%
dc445f6c-055a-4476-ba91-c1ff23ef380c	83435164-9963-4b15-a2b8-6aa3b44705a1	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Champiñones, Tocineta, Maíz tierno, Queso feta\nProteína: Jamón de cerdo
66be1808-306b-445e-b561-42dabab2ca1e	08a9dfd9-3aad-4400-953e-d2730c93f61f	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Champiñones, Tocineta, Pico de gallo, Queso feta\nProteína: Jamón de cerdo
38483a32-b0e4-4856-8b9a-9c40b2bbbf9d	cd1f8aea-183c-4a08-9323-72d466d3aece	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta\nProteína: Pechuga de pollo
da60bb90-22b4-4192-a2d0-018b48150f56	712782a1-c931-4682-a2ae-9164cf71f33a	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
6e160a1a-3237-4d5c-bf2e-d8fc430bfe63	712782a1-c931-4682-a2ae-9164cf71f33a	a923676d-77da-4843-9df2-8eb637965cb4	1	\N
5234c751-2ba0-4673-b17d-4b4aa50b8aeb	9d29fee5-3b95-4132-9c2a-b7a840eea99d	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Guacamole, Zanahoria, Maíz tierno, Pepino\nProteína: Pechuga de pollo
16de2767-06b0-4d83-afa0-472cdc55b720	9d29fee5-3b95-4132-9c2a-b7a840eea99d	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Tocineta, Champiñones, Chips de arracacha\nProteína: Pechuga de pollo
e2457c94-2b26-424b-9a45-d22da6ee0d63	9d29fee5-3b95-4132-9c2a-b7a840eea99d	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Tocineta, Champiñones, Guacamole, Pico de gallo\nProteína: Pechuga de pollo
91cf6308-930f-4fd3-8022-e34305265e64	9d29fee5-3b95-4132-9c2a-b7a840eea99d	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
80474476-0eac-4d65-8abb-2ffdfb98553e	d86045e8-5369-4810-b814-68289ff207bd	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Champiñones, Pico de gallo, Guacamole\nProteína: Jamón de cerdo
9ece3663-5ee6-4b86-8429-a074bd2d5268	d86045e8-5369-4810-b814-68289ff207bd	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Tocineta, Champiñones, Chips de arracacha, Pico de gallo\nProteína: Pechuga de pollo
b6f9b966-aeb0-4d87-bdf5-6afb93e6ef14	9976924b-6e66-4820-a418-6b9d2baa54ca	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
331cdf47-78f9-4e3e-b133-78edc65ad4d7	7b8be6a5-ca93-4bdc-9871-5292e3ee1e26	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Guacamole, Tocineta, Zanahoria\nProteína: Pechuga de pollo
ff46e60f-1730-4e8e-8970-dff53af98c5e	7b8be6a5-ca93-4bdc-9871-5292e3ee1e26	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Champiñones, Pico de gallo, Guacamole\nProteína: Pechuga de pollo
a0c606af-6aad-4386-b6ab-aea99b7d1f34	b946f040-5de8-48cc-b33a-757354b0841a	a551c5fe-bf6e-4d9d-a396-22d2147c309d	2	\N
88d569ca-66e0-4905-8422-6bae31e7b412	b946f040-5de8-48cc-b33a-757354b0841a	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
b4b85d73-415e-4c80-9d00-35f1013161cf	56c056e7-f3d4-4d37-b5a3-d02c6a281b1b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Champiñones, Queso feta, Guacamole, Pico de gallo\nProteína: Pechuga de pollo
b2818c16-3d18-4d6c-8fd1-709b621c3298	56c056e7-f3d4-4d37-b5a3-d02c6a281b1b	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
3e54be05-b11a-4d98-8eb7-3cfb129234b0	9fac0c78-13d6-40df-a077-f91fd1e284f4	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Tocineta, Champiñones, Chips de arracacha\nProteína: Pechuga de pollo
02f31840-ead9-4fbb-acba-d509302e8836	9fac0c78-13d6-40df-a077-f91fd1e284f4	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Pico de gallo, Maíz tierno, Tocineta, Zanahoria\nProteína: Pechuga de pollo
130ec865-7e34-4874-aae7-1254a7b7513b	9fac0c78-13d6-40df-a077-f91fd1e284f4	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
b1661760-ae03-441d-9aea-9f0f5b81785b	9fac0c78-13d6-40df-a077-f91fd1e284f4	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	\N
2f6c4f9c-4d3c-4e29-9a6e-f04d996cfd80	9fac0c78-13d6-40df-a077-f91fd1e284f4	275ac6ba-66d3-4158-9fd1-0cc031c35a8f	1	\N
387525a4-b3bd-49b7-90c7-3706dbae73ae	2185a0a7-43e5-4cbd-8403-90d6a139d9ca	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Pepino, Pico de gallo, Maíz tierno, Chips de arracacha\nProteína: Pechuga de pollo
03a2f915-b181-4e58-8438-86abcdbb5ed6	2185a0a7-43e5-4cbd-8403-90d6a139d9ca	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Queso feta, Tocineta\nProteína: Jamón de cerdo
67674fad-ed58-4718-89ec-e86e83b54bed	2185a0a7-43e5-4cbd-8403-90d6a139d9ca	275ac6ba-66d3-4158-9fd1-0cc031c35a8f	2	\N
fbfb07eb-794e-40d2-9def-977a195a826a	94cdc010-483c-4b5c-8831-e417432d3b15	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Champiñones, Maíz tierno, Pico de gallo, Chips de arracacha\nProteína: Pechuga de pollo
ee52ba27-85e7-4f45-8954-692d46c7bf4a	94cdc010-483c-4b5c-8831-e417432d3b15	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Maíz tierno, Champiñones, Pepino, Chips de arracacha\nProteína: Jamón de cerdo
82d1f75f-54ec-4c29-b9ab-60ab8122a3b0	f01a316c-c4c5-42af-b879-260bcf9c7c81	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
18bd1a0d-6b0a-441f-a555-1a89379c5690	ceac8fbd-f6c7-4077-b332-15e07b3e1453	a6180a54-dcea-4af5-a873-455b03618324	1	\N
7d1e84cc-1fb3-481b-9b5d-1965499ccfe3	ceac8fbd-f6c7-4077-b332-15e07b3e1453	fc11776c-aef5-449a-9fcf-1e982a0b35ab	1	\N
5c9f487e-33ca-456a-87dc-a9f3ea34a804	ceac8fbd-f6c7-4077-b332-15e07b3e1453	ed74f62f-d2d3-4cf1-a688-dc615363f8c9	1	\N
a89b486e-587a-49a1-94b8-7dddf6f510cf	ceac8fbd-f6c7-4077-b332-15e07b3e1453	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Tocineta, Pico de gallo, Chips de arracacha, Queso feta\nProteína: Pechuga de pollo
bfd7376c-dd7b-4b6f-9989-32fd58e0fd63	096b3a8e-882f-4455-9c0c-03e0e9cd6d45	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Tocineta, Guacamole\nProteína: Pechuga de pollo
01768e40-4c93-4831-97a3-f818e2ea73c3	096b3a8e-882f-4455-9c0c-03e0e9cd6d45	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Guacamole\nProteína: Pechuga de pollo
2f42b331-53b5-404a-84e5-c0327203f26e	b1b3434b-f6b9-4045-a703-2b6afc7e8099	b68386e8-b73e-422b-a5b6-47d622faac19	2	\N
1d3f369d-1d0f-4f2e-9fe4-e2693e5d2470	4e012306-8246-486d-bb19-491b953180c2	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Maíz tierno, Tocineta\nProteína: Pechuga de pollo
88f5befb-9eca-4567-80e7-464ca0b0754f	4f1cce1f-4085-4e62-80b0-582ed711a4c4	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Maíz tierno, Guacamole, Chips de arracacha, Tocineta\nProteína: Jamón de cerdo
3f119461-e698-432b-a429-9fbaeab0d4ed	4f1cce1f-4085-4e62-80b0-582ed711a4c4	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Tocineta, Chips de arracacha, Guacamole\nProteína: Jamón de cerdo
035686fe-1904-47a4-b9fe-d5a845ec3230	4f1cce1f-4085-4e62-80b0-582ed711a4c4	d91e4dd0-47a5-46fc-bf29-35b764305016	2	\N
e429759b-2dc3-4009-86a7-d2ecafd01f29	f87388df-9013-4143-b941-740e97ff4be9	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Pico de gallo, Tocineta, Guacamole\nProteína: Carne desmechada
263d55ef-727c-4455-ac92-c36c556cccf2	f87388df-9013-4143-b941-740e97ff4be9	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Guacamole, Queso feta, Champiñones, Chips de arracacha\nProteína: Jamón de cerdo
d0799c18-6526-4035-b448-6ced2942f8be	840f3214-c02d-435a-9b2d-b492ba9649cd	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Tocineta, Queso feta, Pico de gallo\nProteína: Carne desmechada
ec9e0aed-85fb-4342-bfd5-a15772ec85f3	9af2254f-4b75-48f3-9da6-782e79589e2b	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
f397ee03-9625-4b72-a770-0a75d9278bf5	9af2254f-4b75-48f3-9da6-782e79589e2b	a923676d-77da-4843-9df2-8eb637965cb4	1	\N
fed6e79f-e13e-4cee-9100-299332b71eaa	9af2254f-4b75-48f3-9da6-782e79589e2b	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
eddb6fe0-d6f5-41fc-8ba5-1efa3e02cefa	316cd9e8-bc4c-4eea-8a6b-07a8c4170cf6	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
8a2d5968-0802-4216-a79e-5ae7bcc112ca	447358dd-3493-4ff3-869b-f8ee635fa054	20cc1e0f-330e-42b7-b8b9-05c1069d7682	2	\N
dcf7c9c0-1b15-4039-877b-a24b6bba4a7c	447358dd-3493-4ff3-869b-f8ee635fa054	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
2360366b-ac2b-45a9-9f79-e8ca95a43b48	7eb62012-a12b-4b81-9fb7-8dd02624e86d	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
42fe45df-dd33-48d3-a639-584ea8aa112f	7eb62012-a12b-4b81-9fb7-8dd02624e86d	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
c3c26c15-8e19-4a32-b023-ab25d437c75c	7eb62012-a12b-4b81-9fb7-8dd02624e86d	28edafa3-ac74-41f0-ae95-a4ea8efc5f33	1	\N
d8c04be9-cc53-424d-8e7c-16d1daa12dd1	7eb62012-a12b-4b81-9fb7-8dd02624e86d	890a38ce-311d-45f0-b602-f10798189185	1	\N
0c6fd9fd-2cc8-4f88-a9f6-4b73a0b004a2	7eb62012-a12b-4b81-9fb7-8dd02624e86d	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
7d5b9bdd-7566-4216-b83f-a8ece5f9fe24	789980f2-4a33-4506-a6c6-f33d6c40b1ad	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
697c9032-926c-47a9-9a5c-7b3ddb2b0d4c	4d514193-0ee8-435a-bf4e-bec126f97aff	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Champiñones, Guacamole, Queso feta\nProteína: Carne desmechada
38b16fab-47ba-4cf1-8260-58a0f572d713	4d514193-0ee8-435a-bf4e-bec126f97aff	ed348c8c-f11a-401a-8865-5ede23240268	1	\N
28ff1356-d4d0-4c4d-af26-6f7aa1087183	4d514193-0ee8-435a-bf4e-bec126f97aff	36d50cac-2255-4963-b89a-6d7e29450faf	2	\N
6ed8867b-241e-46eb-aa2a-e01262354708	4d514193-0ee8-435a-bf4e-bec126f97aff	3bb93296-c6c5-456a-b165-73c1a20a3134	2	\N
60ac5e6a-d98b-491c-a749-aadda2ad9b8a	981fffe5-2124-42dd-b366-6b0c31bfaf87	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Pico de gallo, Maíz tierno, Tocineta\nProteína: Jamón de cerdo
98d999f9-ed38-4cc8-8ea7-73c603b9d551	981fffe5-2124-42dd-b366-6b0c31bfaf87	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Maíz tierno, Guacamole, Tocineta, Pico de gallo\nProteína: Jamón de cerdo
15c5faf1-2692-4ee4-beb4-33fdb2e86535	a43d1c09-c962-49e8-ba42-b995cd6bcdd4	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
eb7ef705-9503-45eb-8893-8ae9a7872d24	e5bfef01-9be6-42de-b72e-bd26047e3cb2	d91e4dd0-47a5-46fc-bf29-35b764305016	2	\N
50c049b0-1aa4-404a-8153-b091e9aabb30	da6bbcf9-bbdf-44d1-a0c3-9cfda228a399	c3704705-037f-40c4-976c-d0576e944b21	1	\N
36a32d86-aee9-44f4-a615-56689d757773	da6bbcf9-bbdf-44d1-a0c3-9cfda228a399	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
cef0df5b-8ef7-42ac-84a5-71a898669023	da6bbcf9-bbdf-44d1-a0c3-9cfda228a399	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
8a6eb2a6-89a5-4e82-8f4d-e3cab42c9e39	4fa6ca2c-ca03-4984-bcb6-00f658e50145	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	2	\N
2cfe91ca-7f34-4055-8796-4db23cb7f23d	4fa6ca2c-ca03-4984-bcb6-00f658e50145	ed74f62f-d2d3-4cf1-a688-dc615363f8c9	1	\N
9faa8be1-2f40-4a9e-b5b1-416219739532	4fa6ca2c-ca03-4984-bcb6-00f658e50145	290b77dc-ac81-48e0-bb33-70fefbe3273b	3	\N
d9a036a5-8706-4849-98de-7be25d08b85f	4fa6ca2c-ca03-4984-bcb6-00f658e50145	c7572bb3-01f8-4c66-a3e3-0c262093761c	2	\N
d40db1a5-b184-4039-9301-d34dc2f2f00d	ee206d66-3a3f-4a16-84df-5910b63ab08f	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
3bbce433-a5de-4d18-abdb-67aa4117fd0f	ee206d66-3a3f-4a16-84df-5910b63ab08f	36d50cac-2255-4963-b89a-6d7e29450faf	2	\N
0d0930c8-1f25-4d4f-b151-8d1d4c8662f2	ee206d66-3a3f-4a16-84df-5910b63ab08f	f3e97ba3-6dc6-4847-becf-7f84e94873f2	1	\N
a75b3b95-fb70-4c20-a078-574b754b1fe1	ee206d66-3a3f-4a16-84df-5910b63ab08f	2f8a28bd-4987-4e33-995f-932f31d24255	1	\N
73c6b036-934f-4e73-af6c-288fc9d25165	fdf92425-e5f4-46ea-a655-125bae7819d3	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	\N
dc9da4ac-769b-42dd-b779-074a758772cc	584efed4-2734-418c-8c44-84e057812587	31a6d560-88e6-45ec-9177-0625136ffe22	1	\N
4076f383-abad-4b46-9558-3fe2623c48b8	5bcaa0bb-b4fa-4971-9690-27eacdd68ae6	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Queso feta, Champiñones, Pico de gallo, Tocineta\nProteína: Pechuga de pollo
ffac818e-269e-4274-b961-7acb22bc8be5	ed038003-2129-4d6a-8bb6-d6682742a465	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta\nProteína: Jamón de cerdo
de9dbe91-ad3d-4630-9e29-9183bdc65abd	3498ec04-0b01-4880-8eb8-af14ea1f1da6	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Champiñones, Pico de gallo, Tocineta, Guacamole\nProteína: Carne desmechada
ed4cec11-65d5-413c-8aa3-4c514c93e3f8	0218811f-374c-421f-9a32-44e8cb3bca14	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
15e8d2d9-5e1f-460a-b07d-394f5145e1fb	0218811f-374c-421f-9a32-44e8cb3bca14	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Champiñones, Queso feta, Guacamole\nProteína: Jamón de cerdo
db6b595f-10d6-4c11-be30-52f56c542dce	86028dcc-720e-4759-9e12-22a0ed949bd8	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Pico de gallo, Tocineta\nProteína: Pechuga de pollo
6e40e8d6-40a4-43f5-ba7d-f4d14372294e	86028dcc-720e-4759-9e12-22a0ed949bd8	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
87e32ea0-0f2a-4d9e-b070-4a42be1286c8	86028dcc-720e-4759-9e12-22a0ed949bd8	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
cfe07518-eefb-4fff-bfbe-35769f3bda9f	10ee65b2-0fb0-4af2-9e6e-1f22d2cad83c	a551c5fe-bf6e-4d9d-a396-22d2147c309d	2	\N
19895516-792d-4c7e-be74-01a39b0d5892	10ee65b2-0fb0-4af2-9e6e-1f22d2cad83c	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	\N
9c5cffee-8375-4ddd-8121-1710769097e5	10ee65b2-0fb0-4af2-9e6e-1f22d2cad83c	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
926475af-c0ab-4bfe-9473-87e188c0d5a4	10ee65b2-0fb0-4af2-9e6e-1f22d2cad83c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Pico de gallo, Champiñones, Guacamole\nProteína: Pechuga de pollo
f11e3cc1-9a18-4da7-a144-1d3322590346	2fb57344-ea5c-4d12-abd3-e8c7c567c822	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	2	\N
1806d4c5-f474-4d69-8694-1f454de595f7	2fb57344-ea5c-4d12-abd3-e8c7c567c822	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Guacamole, Queso feta\nProteína: Pechuga de pollo
42210861-003f-4881-a887-8b6633e6c177	934db0f4-13d7-4ed5-a226-8e167aab9c30	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	2	\N
c59e402f-e036-4a53-8a9f-7f4e96236684	934db0f4-13d7-4ed5-a226-8e167aab9c30	fc11776c-aef5-449a-9fcf-1e982a0b35ab	1	\N
99bccbf9-0ab7-46af-8c56-d0eb0a9a4ada	a8f58bdf-db08-4b49-b6c0-dabb35212b1c	1926274b-2765-4f72-810f-6e79ad575a91	1	\N
6ec86cfd-c283-4189-9175-e00af8f0005d	a8f58bdf-db08-4b49-b6c0-dabb35212b1c	c3704705-037f-40c4-976c-d0576e944b21	1	\N
8e4d62a1-cb3c-413c-92a0-f59e5088c8f1	a8f58bdf-db08-4b49-b6c0-dabb35212b1c	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
ca9c8dd0-303c-457f-b779-85b399ed1dbf	822d2939-44ca-4e23-9d81-fd21ec0e1ddf	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Pico de gallo, Maíz tierno, Guacamole, Queso feta\nProteína: Pechuga de pollo
884a8883-7e3e-4ff6-a89f-801b291d507c	2d3ba6d1-6be5-4a20-8f5f-c78a788942e8	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
7c3d7926-0a71-496b-b457-c63f30bbe832	476609b6-4783-440d-95fe-926d318ccaeb	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
556fcba9-b91e-4686-95c8-fa7dc96d9ed8	476609b6-4783-440d-95fe-926d318ccaeb	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
2126ea91-b482-47bf-b6f2-4332ec60b052	476609b6-4783-440d-95fe-926d318ccaeb	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
f939e9c2-3adf-46fc-a321-72d1a0f63886	6212f02d-dde8-40d4-bdcf-46d12c554857	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	2	\N
a1c1a5da-d33d-4299-8212-17b27ba99097	e8c7a67f-3701-4147-b068-de7e16622988	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Maíz tierno, Tocineta, Champiñones, Pico de gallo\nProteína: Carne desmechada
b839a5e7-5a6d-42b7-8513-89674436c33f	f5b06656-f831-460e-b229-0e8db189072d	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Tocineta, Queso feta, Champiñones\nProteína: Pechuga de pollo
2929c788-a356-456e-9c46-5a27b558636c	357686e0-91a4-4c93-a002-e7b339074e6c	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	2	\N
2b95a04e-f331-4928-ab10-b317f362e6dd	089ac70f-fb54-4530-ba77-cb3d0661815e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Champiñones, Tocineta, Queso feta\nProteína: Pechuga de pollo
696776c2-2a8c-4d92-b072-ceee2ff9fe30	089ac70f-fb54-4530-ba77-cb3d0661815e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Maíz tierno, Champiñones, Tocineta, Queso feta\nProteína: Carne desmechada
c26033bf-8134-4fc2-8209-4696d217a16a	00e34b58-7895-40b6-b19c-2c2fdc75bbc3	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
1f940b39-b76d-4118-adf6-ed3d59e5c0b8	00e34b58-7895-40b6-b19c-2c2fdc75bbc3	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
cc447236-c62a-4c3a-8935-5d2e8223e391	8e30181f-937b-4526-ad62-0cd20a7521d2	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
3dc0175c-f55c-47a7-8693-cf9fa97f32f3	8e30181f-937b-4526-ad62-0cd20a7521d2	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
6cb121fc-b797-440a-8305-cc7b23e9dadb	8e30181f-937b-4526-ad62-0cd20a7521d2	890a38ce-311d-45f0-b602-f10798189185	1	\N
03fae87f-3ee5-4396-97da-3291605b4efa	324001dd-8939-41d1-b6e8-78e8179dbd93	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Maíz tierno, Champiñones, Zanahoria, Pico de gallo\nProteína: Carne desmechada
f3a15b4f-fdaf-4554-9e2a-d7453790d672	324001dd-8939-41d1-b6e8-78e8179dbd93	7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	2	\N
7f1c7dfc-e3f5-433f-a28c-3472fc38986e	55bb2cd2-98da-4e56-b5eb-5a187740c5fe	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	\N
9c37da35-34fa-4d9e-a657-f198b67fd6db	55bb2cd2-98da-4e56-b5eb-5a187740c5fe	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
ff1f249a-687f-477f-9862-149b8608a79a	05a411a4-2ad9-42e6-885a-1098dea32e3d	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
a6a70cd0-8346-490a-afa6-1a10ec9f8f86	05a411a4-2ad9-42e6-885a-1098dea32e3d	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
d0fd9608-57a2-45e8-8d9c-b8d19eba93cd	05a411a4-2ad9-42e6-885a-1098dea32e3d	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
cdfe1c24-b9a6-48ef-8e5f-03d36b04232c	79c4711c-2298-4078-9aad-5a897f924c9e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Champiñones, Guacamole, Pepino, Maíz tierno\nProteína: Carne desmechada
d337d21c-8040-4065-8933-e82194476043	79c4711c-2298-4078-9aad-5a897f924c9e	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
c9124d5c-ca54-4d3c-ba88-3ffe80832849	e097abf9-c8eb-4e7e-a765-4d1022b82082	bbe7a283-40e4-4d35-bac2-1aa7423a4058	1	\N
62078a77-dadb-4fc2-a9d5-16d1c51c709c	e097abf9-c8eb-4e7e-a765-4d1022b82082	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
418af4bb-495b-4da9-b2c2-b0ec76aa0a98	559c774e-528d-42a0-8642-23a3dd580262	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Guacamole, Tocineta, Pico de gallo\nProteína: Carne desmechada
462760a1-370a-427b-a13d-0cf064ad13c4	236ede02-2147-4556-8cf6-4f7b5828893e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Maíz tierno, Tocineta, Pepino, Zanahoria\nProteína: Pechuga de pollo
1e4c4551-d0e1-42fb-b687-e377367ff073	236ede02-2147-4556-8cf6-4f7b5828893e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Champiñones, Pico de gallo, Guacamole, Queso feta\nProteína: Carne desmechada
6862d0f8-fc21-40e2-b17f-96962bd1b85b	fa67201a-549b-44b9-9b86-ff8858229c65	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Guacamole, Tocineta, Queso feta\nProteína: Carne desmechada
9b72ad4b-a7ec-40c6-bea1-b3c785b66076	fa67201a-549b-44b9-9b86-ff8858229c65	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Guacamole, Queso feta, Champiñones\nProteína: Pechuga de pollo
a56f5d0d-babf-454c-977e-236da8ab7759	452a212a-a361-4441-b90d-622e3b105e38	b68386e8-b73e-422b-a5b6-47d622faac19	2	\N
051a1795-18ed-4f7e-86f9-a788fc5c8b63	cbd90709-c717-44dc-9019-6a4f91dfa9c5	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	\N
8207a0c5-d1c3-46be-93e0-af057dfc769d	cbd90709-c717-44dc-9019-6a4f91dfa9c5	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Champiñones, Guacamole\nProteína: Carne desmechada
6b4daed5-2986-4e7b-84c1-7b67c2e8a793	17c67c4a-54f8-4999-9580-be9c80dff1f6	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
f725a806-daf3-439f-a105-a88078a9a5d5	17c67c4a-54f8-4999-9580-be9c80dff1f6	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
3925ae5f-ef40-4979-9545-ec2a1620040c	292df706-db42-4f23-a9e9-435a8de54b33	20cc1e0f-330e-42b7-b8b9-05c1069d7682	2	\N
563c75e1-42cf-42f5-b66d-5f4d0f3f721d	292df706-db42-4f23-a9e9-435a8de54b33	36d50cac-2255-4963-b89a-6d7e29450faf	2	\N
4d0dfe89-0feb-4e2c-a12d-4a6eb1c1fce8	d051553c-c91c-4d9c-a0d5-83b004c01a6f	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	2	\N
c45f90bb-df2d-47b8-9dbf-f8e2e760f68c	d051553c-c91c-4d9c-a0d5-83b004c01a6f	c7572bb3-01f8-4c66-a3e3-0c262093761c	2	\N
b7fd21df-6e8f-41a1-9aa3-bc9494328499	d051553c-c91c-4d9c-a0d5-83b004c01a6f	26512d4f-4da0-4f68-9df9-a325cf972beb	1	\N
628771f5-8be1-4994-a614-1ac187e31399	2a8a331c-4548-40bc-ae13-e4ebd2099468	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Champiñones, Guacamole, Tocineta, Zanahoria\nProteína: Carne desmechada
b07a8888-22c9-4013-a466-bfef6f0649ae	2a8a331c-4548-40bc-ae13-e4ebd2099468	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
8f69b4b0-8658-4ada-8c3a-af89e17bccae	309249b4-8a38-4dfc-a6d2-727b3c18306a	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	2	\N
0c949050-aa06-4a0c-9397-85a6ad565d7b	309249b4-8a38-4dfc-a6d2-727b3c18306a	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Guacamole, Pico de gallo\nProteína: Carne desmechada
88acbfa7-316f-405c-9f1d-50d3c67918ee	68ddec63-f15f-4787-8c94-dacedb329d55	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
9acdbeb5-947d-401f-b62c-ed5fa71adf9a	68ddec63-f15f-4787-8c94-dacedb329d55	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	2	\N
beea970e-9546-4c56-9766-d06285c3276d	68ddec63-f15f-4787-8c94-dacedb329d55	36d50cac-2255-4963-b89a-6d7e29450faf	2	\N
316c91cd-575f-4bb7-9465-8edb3f600c67	043465aa-61d7-42f4-aa38-337c730d4746	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
31662296-4132-4ebd-9316-17a14fd7ba72	043465aa-61d7-42f4-aa38-337c730d4746	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Tocineta, Guacamole, Chips de arracacha, Pico de gallo\nProteína: Carne desmechada
458d49ab-75a1-4160-b108-20fa14129fc5	aa6d1520-8381-4aaf-bd3c-8e8f053f1845	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Chips de arracacha, Maíz tierno, Tocineta, Queso feta\nProteína: Carne desmechada
79f485e9-8a62-4561-a828-f049d8c6228e	aa6d1520-8381-4aaf-bd3c-8e8f053f1845	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Chips de arracacha, Pico de gallo, Pepino, Guacamole\nProteína: Pechuga de pollo
4eb4e7af-47ac-4d8e-9d70-57f0ed28dd9e	fbeb958e-f82a-4de4-bc5e-c640766bf1af	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Queso feta, Tocineta, Pico de gallo, Maíz tierno\nProteína: Carne desmechada
95e5e252-59e4-431d-9954-628e19b1479f	069bb11f-ba33-4b7e-afb9-756a929c237b	522d937d-7d2d-4c3a-b785-f692a09b8a37	1	\N
9850d7d1-49f4-4b3c-ab2d-b65c4729dd52	069bb11f-ba33-4b7e-afb9-756a929c237b	36d50cac-2255-4963-b89a-6d7e29450faf	3	\N
f187333f-62fb-49f0-bd82-bb6088cf6acf	069bb11f-ba33-4b7e-afb9-756a929c237b	ed74f62f-d2d3-4cf1-a688-dc615363f8c9	1	\N
2dbe4c1d-8be3-4f1d-af82-4787f3aa4510	a9def3b9-a285-4ff4-80e8-dc8712c4712c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Zanahoria, Guacamole, Pico de gallo\nProteína: Pechuga de pollo
fba6521c-3096-4fa7-9230-fcbbccd52822	a9def3b9-a285-4ff4-80e8-dc8712c4712c	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
1ff62028-902d-4fcc-b51d-ae14cba588cf	8f1545c9-5d18-466b-b437-b0fcbd2f7f9f	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
955fc4fb-fe6a-4a4e-b595-b28bbe62fbff	64a630d4-3fcb-47d8-8101-8033799d5494	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Guacamole, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
107a38b3-87da-4301-a9c2-76b457c36a45	64a630d4-3fcb-47d8-8101-8033799d5494	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Maíz tierno, Queso feta, Guacamole, Zanahoria\nProteína: Pechuga de pollo
a133c561-f8f9-4b39-8366-6eb7a4dc0cd5	64a630d4-3fcb-47d8-8101-8033799d5494	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
8ee6ac91-0057-4878-b30b-df69eedb83ea	64a630d4-3fcb-47d8-8101-8033799d5494	7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	2	\N
2777f731-276f-4ced-9ea5-2d523d665e94	64a630d4-3fcb-47d8-8101-8033799d5494	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
3ea0057b-f12a-4bda-9928-763b034b2162	e8a56078-333e-40be-a234-0c584600bae8	60c3451b-db1a-45f4-8480-585e01fe2242	1	Descuento estudiante 10%
68b49d1f-9f69-4305-8a2c-d4c68efa856a	e8a56078-333e-40be-a234-0c584600bae8	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
18b7722d-cf5a-4b53-97ae-fafb1324b021	e8a56078-333e-40be-a234-0c584600bae8	7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	1	\N
19df2fce-2f32-4e55-a836-976be58fbde8	e8a56078-333e-40be-a234-0c584600bae8	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta\nProteína: Pechuga de pollo
a7fa00c1-41ce-4f99-94b8-368213212965	e8a56078-333e-40be-a234-0c584600bae8	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
43b677f4-99e5-4af6-9cf9-5a5f6227af0b	0df7ad45-5e5d-481c-b2bb-310b899bb182	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	2	\N
0fca9e68-cb9a-408a-9fe6-7d48f7c9c8af	0df7ad45-5e5d-481c-b2bb-310b899bb182	ed74f62f-d2d3-4cf1-a688-dc615363f8c9	1	\N
21deab6a-a452-4fc6-b44f-9b6ce46811e3	0df7ad45-5e5d-481c-b2bb-310b899bb182	290b77dc-ac81-48e0-bb33-70fefbe3273b	3	\N
7d71c388-b546-4588-a44b-8ef1d896514d	0df7ad45-5e5d-481c-b2bb-310b899bb182	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
22010ae7-c671-4ae3-aa4e-f3f77dc2758e	dd3e6281-a901-4f68-876e-3ab7d9982e0a	60c3451b-db1a-45f4-8480-585e01fe2242	3	\N
9bd0dab5-e30f-4057-84d4-c8ff3a4dca3c	dd3e6281-a901-4f68-876e-3ab7d9982e0a	7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	1	\N
7c924020-56b1-4f11-9071-078bea78e739	3ea38e77-4d17-4c4c-9ebb-171b5eb8a71e	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Pico de gallo, Maíz tierno, Guacamole\nProteína: Carne desmechada
e5889162-8395-4585-ab3d-a89f051b05e4	fafe1c35-c451-49a3-9cc6-b97da1ac4e59	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
087f9b69-452f-4d25-a893-f3a75887584f	fafe1c35-c451-49a3-9cc6-b97da1ac4e59	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
13b8a138-75d1-4a0f-afea-eb8120a3f415	fafe1c35-c451-49a3-9cc6-b97da1ac4e59	c7572bb3-01f8-4c66-a3e3-0c262093761c	2	\N
34507d62-8b3b-4cd5-b31d-8c7ecbceaf4e	a0029610-2852-4911-a754-76903e515c41	60c3451b-db1a-45f4-8480-585e01fe2242	2	\N
7b4cbb72-f9c2-48a9-b114-49b0db66ee43	a0029610-2852-4911-a754-76903e515c41	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	2	\N
e7c6fc72-0960-4773-852e-89d8eb905575	706a1eb1-aaf5-49da-b949-4509854cb24c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Pico de gallo, Maíz tierno, Tocineta, Guacamole\nProteína: Carne desmechada
2d5fee18-34e7-49c9-9631-402d6fff9c6c	6f8e2b32-ff5e-49f8-bf1a-f2790fdf0e0b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Maíz tierno, Queso feta, Guacamole, Chips de arracacha\nProteína: Pechuga de pollo
8326db98-d6f6-4974-8fcd-95991c6382c8	6f8e2b32-ff5e-49f8-bf1a-f2790fdf0e0b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Pico de gallo, Guacamole, Tocineta, Queso feta\nProteína: Pechuga de pollo
6ea7281a-7a6c-42ec-b8e4-21e68815a8e8	6f8e2b32-ff5e-49f8-bf1a-f2790fdf0e0b	7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	2	\N
98844d28-1402-4c48-8a6e-00e6c462ef89	6f8e2b32-ff5e-49f8-bf1a-f2790fdf0e0b	c7572bb3-01f8-4c66-a3e3-0c262093761c	3	\N
b925e26c-0839-4d2b-be63-3464f1061823	7931ff3c-0c3e-4c9a-a3b4-ed4459207f90	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Champiñones, Guacamole, Tocineta, Zanahoria\nProteína: Carne desmechada
9f5996c4-7db5-42ca-bfb0-1ebd4240cf38	7931ff3c-0c3e-4c9a-a3b4-ed4459207f90	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Maíz tierno, Guacamole, Queso feta, Champiñones\nProteína: Pechuga de pollo
593428bf-c1fd-4d60-90d3-16b583aaff9a	7931ff3c-0c3e-4c9a-a3b4-ed4459207f90	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
a72616ad-d186-48f3-a03f-9e10d05615b9	7931ff3c-0c3e-4c9a-a3b4-ed4459207f90	3bb93296-c6c5-456a-b165-73c1a20a3134	1	\N
b33bbd8c-a3f0-47c7-9a26-ac6589fbb816	f7fd57bf-71e0-4373-8a9d-6317af92a619	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Tocineta, Queso feta, Guacamole\nProteína: Pechuga de pollo
fc5dd83a-9172-46ff-be5d-c3e5d6819dbb	78bd6ce0-0611-4bd1-a2dd-74b33a7a4010	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Chips de arracacha, Pico de gallo, Guacamole, Tocineta\nProteína: Carne desmechada
5d29e908-9517-4b1b-b347-2ad2df081315	66344c96-7de9-446f-bd57-9bcf6f1e000f	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	2	\N
fdea2733-3a60-4cab-9bd4-801962e9f69a	66344c96-7de9-446f-bd57-9bcf6f1e000f	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Maíz tierno, Pico de gallo, Chips de arracacha, Tocineta\nProteína: Pechuga de pollo
ab407e27-1c08-4d02-a362-bfb01931a0b4	66344c96-7de9-446f-bd57-9bcf6f1e000f	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Guacamole, Tocineta, Pico de gallo\nProteína: Pechuga de pollo
697a812b-a0ba-40b2-b456-cb15285a5264	f8e97aa0-b0a2-4a44-a619-c6088c1881fe	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	Descuento estudiante 10%
617f7dd5-ab8a-4963-8e6d-9adff72f1786	058ffd3a-0ac6-4bd0-a624-1898cf7a0023	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Chips de arracacha, Pepino, Pico de gallo\nProteína: Jamón de cerdo
6bf42088-71ac-4e43-af59-bec24d41537d	058ffd3a-0ac6-4bd0-a624-1898cf7a0023	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
4c1f0b2c-1f0b-4d30-8cfc-b94c25b2e447	8916ea5d-cdfd-4454-b5d6-2c7ea2ca0f4a	60c3451b-db1a-45f4-8480-585e01fe2242	2	\N
96e3425a-1310-4f68-8938-36bc4860d0b9	8916ea5d-cdfd-4454-b5d6-2c7ea2ca0f4a	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
0afedb90-e33d-4f2a-b989-0bad5f58aa32	8916ea5d-cdfd-4454-b5d6-2c7ea2ca0f4a	522d937d-7d2d-4c3a-b785-f692a09b8a37	2	\N
f73c9533-e796-4115-aa13-23fb1f0aa4bd	aeaa4aad-fd16-4b47-9260-59c5cece27a5	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	Descuento estudiante 10%
7167114d-65a9-4aa4-a191-87fce91dc8ba	aeaa4aad-fd16-4b47-9260-59c5cece27a5	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
82941211-5b6c-485e-995c-4c185ddb34ad	aeaa4aad-fd16-4b47-9260-59c5cece27a5	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
5c2ce8ae-7fd9-455f-bc07-d019be1a49fa	b0d14edf-8a2a-4131-888d-145e84eaf559	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Champiñones, Tocineta, Guacamole, Pico de gallo\nProteína: Pechuga de pollo
08bc42f7-9217-459b-a5f9-6a3ff13746f9	b0d14edf-8a2a-4131-888d-145e84eaf559	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Champiñones, Pico de gallo, Tocineta\nProteína: Carne desmechada
bef8efab-e25d-4125-9dd9-cd3bd6f42d17	b0d14edf-8a2a-4131-888d-145e84eaf559	c7572bb3-01f8-4c66-a3e3-0c262093761c	2	\N
b88ebf61-2337-4308-847e-4f8ec6a1db57	161f677d-c022-42bc-8a49-efd9f08eb712	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Queso feta, Pepino, Champiñones, Pico de gallo\nProteína: Pechuga de pollo
9277b31c-b9da-497d-9e5c-87227a7f2303	161f677d-c022-42bc-8a49-efd9f08eb712	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Champiñones, Maíz tierno, Tocineta, Guacamole\nProteína: Pechuga de pollo
28f34630-914f-4011-a7c3-2be350b6b289	161f677d-c022-42bc-8a49-efd9f08eb712	7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	1	\N
2e18d04a-cf1d-4ecc-bec0-0f3fcba9cea9	161f677d-c022-42bc-8a49-efd9f08eb712	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
372b551e-89c4-4c66-a52e-d5ca2040663a	01c3b3b3-fa72-4a63-bdf0-eac0e5680272	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Tocineta, Queso feta\nProteína: Pechuga de pollo
df4038a1-bf59-47f9-979e-8ce94b160cc6	b6be93d5-84fb-4207-933a-94e0ad412cfe	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Guacamole, Tocineta, Chips de arracacha, Champiñones\nProteína: Pechuga de pollo
3c283d4c-60d9-4245-949b-11ea08d7fdba	91636a1a-1518-48b7-8ce7-585adbd72a0c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Champiñones, Pico de gallo, Guacamole\nProteína: Pechuga de pollo
120dca69-53bc-4996-b558-ea5d032ede16	7a81388b-4be1-43a5-a544-ee8684504fad	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
0fbedf91-edab-49e6-bb3a-9e225bc60a5a	aad0905b-6511-47f0-9711-627fd17800cd	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Guacamole, Pepino, Chips de arracacha, Queso feta\nProteína: Pechuga de pollo
90cb88d8-e90d-4449-8486-be415be09c13	a4f0b6c3-0511-4ef2-881b-fc66edb58c43	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
116d6361-fbcf-4007-8b8e-5f03de8a1b6a	a4f0b6c3-0511-4ef2-881b-fc66edb58c43	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
bf3fb6a6-da65-4ffd-8c90-24fe584c2fc5	60182d4f-6dbe-4cfd-bb87-0de1933505f4	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
ab436222-212d-435d-898c-e820fea104ef	60182d4f-6dbe-4cfd-bb87-0de1933505f4	fc11776c-aef5-449a-9fcf-1e982a0b35ab	1	\N
d3b6d690-f118-42e1-8621-c40102325154	60182d4f-6dbe-4cfd-bb87-0de1933505f4	ed348c8c-f11a-401a-8865-5ede23240268	1	\N
375ace0c-2e38-4ab1-9e8c-0de12f1d0efe	9128986a-4851-4bcd-9ef6-00cf36a32215	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
c0a0f47e-cfc6-4bfc-92e0-e2db0c161c10	cdadd3d9-5023-4b11-96de-b91871571446	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	Descuento estudiante 10%
cacedacf-59b7-4dd0-8467-edea05f70b10	cdadd3d9-5023-4b11-96de-b91871571446	60c3451b-db1a-45f4-8480-585e01fe2242	1	Descuento estudiante 10%
563bbd2f-bfc8-41e9-af9a-c01ce0b2e903	2d569753-fad3-466f-a899-cf559bf9f50c	ed348c8c-f11a-401a-8865-5ede23240268	1	\N
87e1385d-310c-4ea5-ab80-7d0fce98fbf0	2d569753-fad3-466f-a899-cf559bf9f50c	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	Descuento estudiante 10%
5ad07292-13ea-456a-bc62-7e398d86d232	4f75b14f-5d20-4a07-bb07-b6cdd2aea03f	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Champiñones, Guacamole, Tocineta\nProteína: Pechuga de pollo
bbd9deb0-efd5-47a0-a6af-659209013d2d	4f75b14f-5d20-4a07-bb07-b6cdd2aea03f	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Champiñones, Pico de gallo, Guacamole\nProteína: Pechuga de pollo
849f5f29-e95a-4c05-8d0e-5cf221d86235	f9f1c2fc-05c9-4eee-a339-14a1a267f0d8	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Maíz tierno, Tocineta, Zanahoria\nProteína: Jamón de cerdo
7ab2c2c9-00fb-4c5c-b484-46ed69c2c9a4	f9f1c2fc-05c9-4eee-a339-14a1a267f0d8	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Guacamole, Champiñones, Tocineta\nProteína: Jamón de cerdo
ba5916f8-f28e-4d38-9ae9-487ac2f05d59	f9f1c2fc-05c9-4eee-a339-14a1a267f0d8	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
70b685dc-d175-4e77-9e15-67f29d7e5b3b	321378ce-f6b9-4064-9966-0162319ab8bf	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Maíz tierno, Champiñones, Guacamole, Pico de gallo\nProteína: Pechuga de pollo
62cc05bc-8bfc-4f24-8f9b-b2592e23bdd9	96bca2ef-be2b-4a71-93fe-d5425f848d0e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Guacamole, Queso feta, Champiñones, Tocineta\nProteína: Pechuga de pollo
50153280-2ce0-407a-a60b-e210f7273b2a	96bca2ef-be2b-4a71-93fe-d5425f848d0e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Guacamole, Champiñones, Tocineta, Pico de gallo\nProteína: Carne desmechada
d5ad6542-1baa-4785-abde-8f03046aa2b5	96bca2ef-be2b-4a71-93fe-d5425f848d0e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Pico de gallo, Queso feta, Pepino\nProteína: Pechuga de pollo
7582eeb4-e3a0-4191-81ad-b2d0dcdd1773	96bca2ef-be2b-4a71-93fe-d5425f848d0e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Pico de gallo, Guacamole, Tocineta, Champiñones\nProteína: Pechuga de pollo
1921ca89-e74c-4fdf-8247-1dc4f0a3239f	96f2c4dd-2469-4e35-bbd0-a2eb36cc7bff	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Maíz tierno, Tocineta, Queso feta, Guacamole\nProteína: Jamón de cerdo
82bfc561-72a8-4b1b-9d0e-85d195607cf0	a68eca9f-98d0-4f35-a1fe-358bf5ab44d3	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Maíz tierno, Champiñones, Tocineta, Guacamole\nProteína: Carne desmechada
c74731f9-6f8b-43c9-9832-5858e8b0f3e1	83c6da1c-9329-40a2-871f-c3347d6bbb54	31a6d560-88e6-45ec-9177-0625136ffe22	1	\N
061a61f3-ea45-40a4-830f-6577cb37b4e7	3a5cb2a5-075d-4045-86f8-93ea6705795e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Guacamole, Tocineta, Pico de gallo\nProteína: Carne desmechada
8508ade7-7bcf-4d0f-8cfd-6552ec4b2502	ba1afc01-52cc-4162-b5ec-fdbdaaba8beb	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Guacamole, Tocineta, Queso feta\nProteína: Pechuga de pollo
c7db5654-42f1-4bfe-b6fb-9a316dd0f381	ba1afc01-52cc-4162-b5ec-fdbdaaba8beb	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
0e62c022-3fe1-4187-bc82-0fa70dcdbd38	788c5253-d9d0-46b8-acb9-77ddc42a74b6	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
9f39837a-159c-4780-a993-67c407880a15	39eb5131-40f7-440b-8c2e-52de15ee6359	febcfb4f-bc51-4719-89dd-765ed174f19b	1	\N
76acfc66-8a0e-4c85-ab20-8dc392744471	48267f01-932b-46b7-8d02-2c14185ecf36	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
28b8f4ef-a7c5-4439-9209-2ab2d10edacf	48267f01-932b-46b7-8d02-2c14185ecf36	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
8ae1e6d1-6ce7-4bb9-b233-0974e53382c5	78b9064d-53d9-466a-af2e-06f6d7f82b54	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Guacamole, Chips de arracacha, Queso feta, Pepino\nProteína: Carne desmechada
096a0b87-1da5-4635-b040-db281f7c6394	3e99801f-090c-4f79-b983-03d1951b1361	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
40239763-1e19-467c-ba27-c45a0bb5c5e0	3e99801f-090c-4f79-b983-03d1951b1361	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
22823bcd-b645-416a-b163-03b53f44e472	3e99801f-090c-4f79-b983-03d1951b1361	c7572bb3-01f8-4c66-a3e3-0c262093761c	2	\N
415a1b54-386d-43c6-9627-efc92c7ee727	cc49dfe6-d1ae-4c50-9c7d-8256c14ac20c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Maíz tierno, Guacamole, Tocineta, Pico de gallo\nProteína: Jamón de cerdo
2a6119d3-e7d2-4b8e-94ca-4ef5cdd00fec	0265b312-dcdf-4f6f-b384-464320cc1d64	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	4	\N
8b3572d1-899f-477a-a060-14cea54cf26d	0265b312-dcdf-4f6f-b384-464320cc1d64	ed74f62f-d2d3-4cf1-a688-dc615363f8c9	1	\N
c909c66e-9c8f-4c70-946f-fa23bda81b28	0265b312-dcdf-4f6f-b384-464320cc1d64	290b77dc-ac81-48e0-bb33-70fefbe3273b	3	\N
4a46d314-de5c-4b3d-86c2-e0e0e7c4f6e6	571af64b-4c58-4d26-8427-da20219dffe4	9570e5a7-af90-4277-91a0-dd6a3de80bd7	1	\N
3f921540-88db-4a09-a5ef-e7ed0cc2d777	ecda85c8-0978-4a97-bc53-25dda5dc885f	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Champiñones, Tocineta, Chips de arracacha, Maíz tierno\nProteína: Jamón de cerdo
2d25dffe-9200-45f0-9785-5ef730312281	bf9ba776-2531-4bd7-a865-295c6de6ae15	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Guacamole, Tocineta, Pico de gallo\nProteína: Pechuga de pollo
31e5c38e-b4f1-4f77-b0f6-de7ba52a1f0c	eaebb77e-bd1e-45a1-a647-b810fcfee34c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Tocineta, Queso feta, Pico de gallo\nProteína: Jamón de cerdo
a72d95f9-3a76-40be-88f0-db5e5acbf3b0	5f0eb9c6-66ce-4d3a-9bd2-123a1727d78a	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Guacamole, Queso feta, Champiñones, Tocineta\nProteína: Carne desmechada
779cca40-f077-450e-828e-06bdf0ff9c4e	5f0eb9c6-66ce-4d3a-9bd2-123a1727d78a	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
0a29dba9-e8d7-464f-9cc7-9b847fb86212	5f0eb9c6-66ce-4d3a-9bd2-123a1727d78a	31a6d560-88e6-45ec-9177-0625136ffe22	1	\N
456dd22c-d68e-465c-b151-48fed3e8ad6d	5f0eb9c6-66ce-4d3a-9bd2-123a1727d78a	890a38ce-311d-45f0-b602-f10798189185	1	\N
8d9bb719-3561-4b64-b582-305ef371abc2	7ccc13e3-3d95-4576-83d9-35b645a564c1	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Tocineta, Queso feta, Chips de arracacha, Pico de gallo\nProteína: Pechuga de pollo
bc3b8c55-f74f-40dc-b122-d814832e3d63	7ccc13e3-3d95-4576-83d9-35b645a564c1	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Tocineta, Queso feta, Pico de gallo\nProteína: Pechuga de pollo
4d6aec4e-9b46-4938-9119-8ef287f2dba5	7ccc13e3-3d95-4576-83d9-35b645a564c1	275ac6ba-66d3-4158-9fd1-0cc031c35a8f	2	\N
c63f2381-7ce5-426e-810f-2327bbc59a3e	803ba716-50b5-4c4d-9736-b7b8d643f03a	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
f5b67969-cf32-4dfe-9460-bf431efbc9fd	803ba716-50b5-4c4d-9736-b7b8d643f03a	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
77627279-9083-4fb9-9cf2-7e6ec74496a6	9571da12-ad4f-4e47-9cbd-d56073c2536c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Queso feta, Tocineta, Champiñones\nProteína: Pechuga de pollo
e24e19b4-88a5-44eb-9d4b-b99f259681af	f5c18aa5-0c10-4985-a25e-f3b0ab6c3190	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Guacamole, Queso feta, Tocineta, Champiñones\nProteína: Carne desmechada
ddd0926b-4348-4b00-8d74-08980d1e2f36	f5c18aa5-0c10-4985-a25e-f3b0ab6c3190	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Maíz tierno, Tocineta, Zanahoria, Pepino\nProteína: Pechuga de pollo
3f24eba0-a399-41bb-8d2b-353bfae5f106	ea4a4afb-57df-4a6f-a296-80a24ac44eb4	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Guacamole, Pico de gallo, Maíz tierno, Queso feta\nProteína: Pechuga de pollo
26bfab90-a3c1-4314-b073-d173aef543e9	ea4a4afb-57df-4a6f-a296-80a24ac44eb4	7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	2	\N
e61c4b67-bfec-4fdf-814b-16799a5d60b5	91e2c6b5-fdff-4a4f-a34e-785cd79e79c5	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
470ad480-4b23-4f17-b096-04d6165d6262	91e2c6b5-fdff-4a4f-a34e-785cd79e79c5	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Guacamole, Tocineta, Queso feta, Pepino\nProteína: Pechuga de pollo
6b11e080-a6ca-47ef-b0da-fd00e13a6860	91e2c6b5-fdff-4a4f-a34e-785cd79e79c5	05d9250c-df43-4f67-9fc5-f2e70f3b49ea	1	\N
183af75f-b21a-4c2b-b755-bfd841e5caea	b0d40aff-4a16-4bf3-b0ff-006d19f93034	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Chips de arracacha, Champiñones, Tocineta, Maíz tierno\nProteína: Jamón de cerdo
2141dd06-c195-4368-8c38-282c3ed508c9	e7ca65b7-4a90-4a62-a687-ec7da13b1554	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Champiñones, Maíz tierno, Tocineta, Pico de gallo\nProteína: Pechuga de pollo
016a659e-7b40-4c11-845e-5b903b31913e	e7ca65b7-4a90-4a62-a687-ec7da13b1554	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
fe43a5af-a025-4a74-be6e-cb14bf7464d1	a8699136-d9bf-486f-a932-5946edcbfa0e	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
0ebb05f6-7478-41d0-8da0-00b0cc325be7	bd9050e2-3cb2-4374-8481-e38184350215	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
404ccfe4-5479-4656-9b1c-91f2d5f29234	bd9050e2-3cb2-4374-8481-e38184350215	890a38ce-311d-45f0-b602-f10798189185	1	\N
837634d1-4334-4227-b59e-59347aa914de	bd9050e2-3cb2-4374-8481-e38184350215	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	2	\N
7e96d30c-2f92-4cc1-a668-5d59ad9a0263	bd9050e2-3cb2-4374-8481-e38184350215	28edafa3-ac74-41f0-ae95-a4ea8efc5f33	1	\N
7507588c-b14f-43fd-a3f7-dc55cf2c97b6	032e047a-7120-400b-9820-0c02523530e4	84ce9a61-d186-47cb-92b4-afa4d5847dab	1	\N
cad0fce2-a7e6-4158-9575-5d0b5dbb6aae	ecb92c2c-8bf5-408c-85b2-2075cee5effd	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
0634ac45-72e4-40b6-bad2-79abf5101a34	ecb92c2c-8bf5-408c-85b2-2075cee5effd	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
bcd0464e-54ee-4b72-91b4-204796296249	ecb92c2c-8bf5-408c-85b2-2075cee5effd	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
a15d32c8-30d2-4539-975a-910814672bf4	39a623e4-4d45-4250-a091-f263f16b7b8e	b68386e8-b73e-422b-a5b6-47d622faac19	2	Descuento estudiante 10%
f0d218ca-626f-4759-9489-deed00264591	7b2d7052-1674-435c-8f08-30051420d9e3	05d9250c-df43-4f67-9fc5-f2e70f3b49ea	1	\N
64277487-98d8-4943-a8da-fcbd5f0f6a67	51a4fd5b-2786-47d8-b3b1-91ca7bda4929	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
bf99f85e-da10-46eb-99ab-bf59dd345d2e	547a458a-ae69-42bf-b17e-80cffc146b5b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Pico de gallo, Queso feta\nProteína: Champiñones
37c0ca5b-bb3e-4384-8338-e3a76a24402e	27037d91-b1fd-483a-889b-3606c7de41bc	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz, Pasta\nToppings: Guacamole, Pico de gallo, Maíz tierno, Tocineta\nProteína: Carne desmechada
e7297ddb-0a30-464b-8568-5db1e8107d42	4d8bace4-8a76-4ec3-96f9-5345af591dd8	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
20cccccf-9e67-4efc-a5b9-b67df79ac082	bf123321-a8fc-42ba-8ef5-b9a7535e9df1	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Guacamole, Tocineta, Chips de arracacha, Queso feta\nProteína: Pechuga de pollo
014e1c55-e1d2-41da-9f25-357646ec312e	d9655f35-27a9-4e34-931c-9223991a60be	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
965dde81-9842-47af-aaf3-1b8dccb70944	b9e977e5-3cbd-4bae-b26b-87da91b55747	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Tocineta, Guacamole\nProteína: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
1a221a34-f5bb-467d-820e-284c8c80cd70	eb3550e2-aa45-44ab-b8d7-4909c31d300b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta, Guacamole\nProteína: Pechuga de pollo
43960efc-2eda-484a-aaf6-050805e49488	eb3550e2-aa45-44ab-b8d7-4909c31d300b	7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	1	\N
00eef6b4-1cc4-46a6-a3b9-1d026940dca6	eb3550e2-aa45-44ab-b8d7-4909c31d300b	31a6d560-88e6-45ec-9177-0625136ffe22	1	\N
f2c893f2-f585-47d3-be09-5b99db25a7e2	eb3550e2-aa45-44ab-b8d7-4909c31d300b	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
144c8a90-a386-4530-aa51-d7f6f0ce9087	6f9782fe-6564-4909-9f5c-5ea8ada31c6c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Maíz tierno, Champiñones, Tocineta, Queso feta\nProteína: Carne desmechada
a0b68a53-80b7-4be1-b4fb-94654021e428	6f9782fe-6564-4909-9f5c-5ea8ada31c6c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua, Arroz\nToppings: Maíz tierno, Guacamole, Tocineta, Pepino\nProteína: Carne desmechada
b4ef7b30-1685-4111-a99b-0b15b22ff7b1	54f5086f-3cf8-4082-92e1-35ecc4454ef0	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Queso feta, Chips de arracacha, Maíz tierno, Tocineta\nProteína: Pechuga de pollo
2ac3c2ce-885c-44c6-891f-5c66b26415d4	b9e977e5-3cbd-4bae-b26b-87da91b55747	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Guacamole, Queso feta, Tocineta\nProteína: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
9fbc7e8d-60c9-459d-a44c-a8942012be5b	e50047c4-bef0-4cad-a7be-3db5a7268210	f4eeb7cc-c281-44ab-92ff-e0cd4a9ec8ed	1	\N
a1073d07-ff74-4bac-8d60-62069037a014	197a8813-c8d0-4ffb-ac9d-29f80358f92c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Queso feta, Guacamole, Chips de arracacha, Pepino\nProteína: Carne desmechada
c9c24fc9-a00e-4c47-9180-792a8d5c48ec	197a8813-c8d0-4ffb-ac9d-29f80358f92c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Tocineta, Queso feta, Guacamole, Chips de arracacha\nProteína: Carne desmechada
521c7a76-7343-40b5-ad87-6618eb097e3d	197a8813-c8d0-4ffb-ac9d-29f80358f92c	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
47b3f8ef-70c4-46b5-9fa6-b7df71c4c738	33dc030a-80e4-4284-9ccd-c4167647fcef	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
57e90e17-bfa4-49e2-b4ee-cfc908e2e40b	995e7b91-dcf7-4a70-ba00-f109b8bdafc5	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Pico de gallo, Queso feta, Guacamole\nProteína: Champiñones
25ce531c-f1ac-42a5-b165-01d02f48a27f	1c8f6d67-8bec-4982-9afc-35674d699ffe	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Maíz tierno, Guacamole\nProteína: Pechuga de pollo
73be5e3c-aef4-4c73-83a1-ee5e64cf8c89	1c8f6d67-8bec-4982-9afc-35674d699ffe	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Maíz tierno, Queso feta, Tocineta\nProteína: Carne desmechada
6567ab2c-8582-4fc1-b577-c4f1ea8d81d1	b3f07c90-80a0-4d29-bb40-d26e1738e7a8	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Pico de gallo, Queso feta, Guacamole, Maíz tierno\nProteína: Carne desmechada
9a76e81e-20f3-4326-b7d6-a8b0df298af2	b3f07c90-80a0-4d29-bb40-d26e1738e7a8	7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	1	\N
49725fb4-3487-4bae-b6f6-de18005f121f	ae0d8651-aaee-4fcf-a4d9-68686b136fad	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
fad16dc2-bf16-45a8-b9be-ca34fcce2a83	ae0d8651-aaee-4fcf-a4d9-68686b136fad	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
546555c4-68e4-4603-ac30-5663fc054a9a	95155441-542b-44bb-bcf3-a14d35f3eb4e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Champiñones, Guacamole, Queso feta, Pico de gallo\nProteína: Pechuga de pollo
72b3e334-8b9d-4bf8-b0d6-2cd5e8f29860	95155441-542b-44bb-bcf3-a14d35f3eb4e	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
1a8aa310-7d7c-4257-a378-096368ae5ecb	7ff5898c-b595-4077-8218-eff38c17985b	153a1ea3-1420-4d88-b427-c23254b00bde	1	\N
c7bcf681-f481-480f-b2ff-d624afd68ada	7ff5898c-b595-4077-8218-eff38c17985b	fc11776c-aef5-449a-9fcf-1e982a0b35ab	1	\N
b7277664-dad8-455e-9a13-6f5911915f6e	7ff5898c-b595-4077-8218-eff38c17985b	c3704705-037f-40c4-976c-d0576e944b21	1	\N
58fd7511-714b-4260-9961-f30780382c89	7ff5898c-b595-4077-8218-eff38c17985b	d91e4dd0-47a5-46fc-bf29-35b764305016	2	\N
5668130e-f998-4955-8289-4b150d6138eb	4bcf8ba6-de7c-475f-b99f-420fc026e223	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Pico de gallo, Maíz tierno, Champiñones, Guacamole\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
a4a99428-9909-4a52-a0b2-92920b3d8c5c	f916cb22-4940-4605-afc8-883a8a340004	b68386e8-b73e-422b-a5b6-47d622faac19	3	Descuento estudiante 10%
5c6bd137-4609-4bf9-99d5-513960f048cb	57f5e534-f8fa-408f-a664-679ee25677ef	7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	1	\N
29eecf8f-6791-4616-acec-63055dbc14a5	57f5e534-f8fa-408f-a664-679ee25677ef	fc11776c-aef5-449a-9fcf-1e982a0b35ab	1	\N
6869c34e-0480-4698-a2e0-32c037f9ec5b	cd615437-eeb3-40ee-8811-e9cc4e5c01fb	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Guacamole, Maíz tierno, Chips de arracacha, Champiñones\nProteína: Carne desmechada
963475bc-8ec8-4f8e-8b24-8978af8069ae	cd615437-eeb3-40ee-8811-e9cc4e5c01fb	7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	1	\N
a22d0f46-1e19-4250-b362-f81461e59907	cd615437-eeb3-40ee-8811-e9cc4e5c01fb	ed348c8c-f11a-401a-8865-5ede23240268	1	\N
f346136c-02ca-44ba-94b9-4b910beb657f	06e73484-23b3-4767-a771-8d7b5ff0c6e0	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Tocineta, Guacamole, Champiñones, Maíz tierno\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
7cdd4407-7061-473f-81de-85b6cb4210f4	b3d83639-2a1d-48b1-966c-5245ced9a98a	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
20721a22-27b1-4fff-8559-83604a9431af	ef0c65d9-7756-4db7-8ab6-7f4a0e0f8cbe	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
c0137ccc-a387-4341-9565-0204de0a2254	ef0c65d9-7756-4db7-8ab6-7f4a0e0f8cbe	ed74f62f-d2d3-4cf1-a688-dc615363f8c9	1	\N
b940f456-170e-43fb-92df-494489b7dc41	ef0c65d9-7756-4db7-8ab6-7f4a0e0f8cbe	890a38ce-311d-45f0-b602-f10798189185	1	\N
6b6c062b-ec54-46f6-8bf6-8d00f6f2a09c	ef0c65d9-7756-4db7-8ab6-7f4a0e0f8cbe	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	\N
cf0081cc-d6a8-45f2-b086-7dd5f782a59c	ef0c65d9-7756-4db7-8ab6-7f4a0e0f8cbe	c7572bb3-01f8-4c66-a3e3-0c262093761c	2	\N
6b54d28d-c17c-41c2-bc1a-1a0dbe931b88	7acc3310-730f-4069-a033-16bf5f95fc9b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Chips de arracacha, Queso feta, Guacamole, Tocineta\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
6051cb45-bd25-4f6c-918c-9f0125eaffe2	7acc3310-730f-4069-a033-16bf5f95fc9b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Guacamole, Maíz tostado, Tocineta, Chips de arracacha\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
ccff6c1b-3191-4136-a83d-93883e41229b	44398031-6cb3-471e-9832-4d6426ad2e75	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
da5b26e4-fe4e-46fe-9c6d-4cf8e106de0e	44398031-6cb3-471e-9832-4d6426ad2e75	c260a933-f796-416a-9d0c-ab2b4e769e33	1	\N
54d7a221-7c74-41f4-87f0-191ec568cf30	44398031-6cb3-471e-9832-4d6426ad2e75	275ac6ba-66d3-4158-9fd1-0cc031c35a8f	1	\N
b8512394-56e0-4aeb-8513-93198ca24dd4	52488e05-4f87-4318-9a1b-84ae8e91dfea	a551c5fe-bf6e-4d9d-a396-22d2147c309d	1	\N
a2a902bb-332a-48f0-85f5-772f7ee81748	52488e05-4f87-4318-9a1b-84ae8e91dfea	c260a933-f796-416a-9d0c-ab2b4e769e33	1	\N
510840ed-95a6-4e86-9a9d-9c1e5de674f8	6f42e2d4-def4-4345-9f15-0ae0e52ae0db	fa107d92-d59b-4686-b51f-7df33766c361	2	\N
6472cb5b-817f-45f6-a1b1-9f98f5289728	6f42e2d4-def4-4345-9f15-0ae0e52ae0db	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
2d3b4867-ccb9-4c8e-9493-6023c63114d0	6f42e2d4-def4-4345-9f15-0ae0e52ae0db	a923676d-77da-4843-9df2-8eb637965cb4	2	\N
7b470e29-9b3a-4b71-85c3-208c3eaf26fc	6f42e2d4-def4-4345-9f15-0ae0e52ae0db	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	\N
34a2d835-c659-4d35-a83b-825e8807e4f6	6f42e2d4-def4-4345-9f15-0ae0e52ae0db	6a561a5e-1a59-41b5-9a6d-eb8dae2eaeef	2	\N
a11080ad-044a-4245-840a-7633b4e29423	6f42e2d4-def4-4345-9f15-0ae0e52ae0db	f4eeb7cc-c281-44ab-92ff-e0cd4a9ec8ed	3	\N
0c4da035-f529-4c82-ba03-e935ebf7890d	6f42e2d4-def4-4345-9f15-0ae0e52ae0db	1bee1de0-2321-4e6e-a97e-05fd409ec1bc	1	\N
3e8ac8f2-ddb4-49cf-8167-cbcb212c61bf	6b97d0d8-72ca-4f19-8a87-f88824a9cfb6	1bee1de0-2321-4e6e-a97e-05fd409ec1bc	1	\N
4aa90d86-581b-4df5-a087-fd47f1a532af	7570385b-25e8-409c-93fb-34250d054aa3	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Guacamole, Queso feta, Chips de arracacha\nProteínas: Carne desmechada
e58d6e54-3c8f-448b-987b-0a19c006373b	7570385b-25e8-409c-93fb-34250d054aa3	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Guacamole, Champiñones, Chips de arracacha, Maíz tierno\nProteínas: Pechuga de pollo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
051fa549-dcb0-48fc-aa6c-1b59b18da2b8	6b93c345-bd05-47c4-820b-f1fc329416d9	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz, Pasta\nToppings: Maíz tierno, Guacamole, Tocineta, Pico de gallo\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
7ebc2c7d-bc24-4a7a-bd0b-d1ceacf08fee	5b0e9f48-76df-466b-8f86-a6348e86f3a3	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
15c5efdc-f4f1-46a0-965a-07de2e27607c	5b0e9f48-76df-466b-8f86-a6348e86f3a3	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
aa7c978f-a0d3-45b7-b4e7-1360ad4546e1	5b0e9f48-76df-466b-8f86-a6348e86f3a3	bed3342f-2b63-4270-81fe-4d37d1b8f929	2	\N
b77fc18e-a144-4f71-b7d4-ffb669e9f91c	dc262236-2666-4bef-828c-b31b69e6bd6f	438dd0c6-70f4-4fa5-b1d5-cba96dcbd8a3	1	Base: Frutos Rojos\nToppings: Fresa, Banano, Coco Rallado, Arándanos
e8ce4117-87c4-47b8-896c-427859c7c1ef	dc262236-2666-4bef-828c-b31b69e6bd6f	438dd0c6-70f4-4fa5-b1d5-cba96dcbd8a3	1	Base: Frutos Rojos\nToppings: Crema de maní, Fresa, Coco Rallado, Banano
48bdef8e-dacc-4900-91e5-6b602fdc4c4f	aa908598-9498-4a1e-b057-217e34f74b33	1bee1de0-2321-4e6e-a97e-05fd409ec1bc	1	\N
647ef38a-059a-40e3-9662-544866992e01	aa908598-9498-4a1e-b057-217e34f74b33	87eb7166-053d-4739-9511-ff90b826ada6	1	\N
9fdc8bff-48fe-4609-8fef-1c5dc1dd9c09	e06ed70e-e7e3-44b7-9779-c9b8f0e4ca09	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Queso feta, Guacamole, Tocineta, Pico de gallo\nProteínas: Pechuga de pollo, Carne desmechada\nProteínas adicionales: +$ 5.000\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:22000
82c7bf92-72a8-47cb-91c1-5af39aeb9022	e06ed70e-e7e3-44b7-9779-c9b8f0e4ca09	28e2dfa3-3e2b-4ff4-bc17-ab4dcd35c956	1	\N
17db662f-018e-4cb1-b975-de2086dcc9c3	7acc3310-730f-4069-a033-16bf5f95fc9b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tostado, Guacamole, Tocineta, Pico de gallo\nProteínas: Pechuga de pollo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
2f013009-a29d-44a7-b99a-5b3c3997cdc2	88ed64c9-402e-484c-81dc-3dbcfddc3dc6	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	2	\N
ee639aa8-c86e-41ba-9b68-083513e83e03	88ed64c9-402e-484c-81dc-3dbcfddc3dc6	2798ad2f-73f8-4a2d-b37f-79f780b32eeb	1	\N
de34cd54-e427-4459-a507-c32e7b8995b5	c02a6727-54cc-4266-91fe-cfcbc016ffca	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Champiñones, Maíz tierno, Guacamole, Zanahoria\nProteínas: Pechuga de pollo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
7fe98ee3-39ac-4c96-b318-598b42834644	fdcabf41-17ad-4d2c-9a6c-8c8781fb80ba	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz, Pasta\nToppings: Tocineta, Queso feta, Guacamole, Champiñones\nProteínas: Pechuga de pollo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
40d05ffa-33f6-4f0e-a992-fae2f05453df	1e1b93a1-d9fd-4bd7-9d0f-402bef4c32bd	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tostado, Champiñones, Guacamole, Zanahoria\nProteínas: Pechuga de pollo
9feb5bcd-2f51-407b-976c-b85763597955	1e1b93a1-d9fd-4bd7-9d0f-402bef4c32bd	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tostado, Queso feta, Champiñones, Tocineta\nProteínas: Pechuga de pollo
750ca402-4ab7-46ab-9be7-67dea86fbb8a	1e1b93a1-d9fd-4bd7-9d0f-402bef4c32bd	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	2	\N
b9e0b14d-ec43-4a4a-a7d5-0454aa7364d4	acb74a3b-0112-4ccd-aa1a-ac4a8a0981b0	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Champiñones, Tocineta, Guacamole\nProteínas: Pechuga de pollo
4d1a77f9-f1e5-4e75-b9b9-087e323eb4cb	acb74a3b-0112-4ccd-aa1a-ac4a8a0981b0	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Maíz tierno, Pico de gallo, Tocineta, Guacamole\nProteínas: Pechuga de pollo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
06f9ec34-95f9-4fb3-8695-b2350bc5338a	acb74a3b-0112-4ccd-aa1a-ac4a8a0981b0	153a1ea3-1420-4d88-b427-c23254b00bde	1	\N
95ac5caf-4509-458c-a3fc-64f87e2ca760	acb74a3b-0112-4ccd-aa1a-ac4a8a0981b0	55a58658-65cd-43dd-a160-6449b3f38a1c	2	\N
f84350db-b179-4027-a2c6-b8c009447de9	e66a8ca4-cac3-4aa9-b4c2-914bf3760f56	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Pico de gallo, Champiñones, Pepino, Zanahoria\nProteínas: Pechuga de pollo, Carne desmechada\nProteínas adicionales: +$ 5.000\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:22000
4c42a827-6b02-4509-a43e-6f869dfceb98	e66a8ca4-cac3-4aa9-b4c2-914bf3760f56	1bee1de0-2321-4e6e-a97e-05fd409ec1bc	2	\N
0569e202-dc36-4251-a7b0-dfdc17549e0e	57f1688f-77f0-4619-831f-f25ce90c8d08	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Pico de gallo, Maíz tierno, Chips de arracacha\nProteínas: Jamón de cerdo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
57455030-b35c-47e8-8767-6bd735edbada	22644531-45a1-47e8-92b3-91da436436f4	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
8b715dbb-beae-4ff9-86fa-312daf579616	ab0e1f61-6d50-402c-b261-9008e018621f	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Tocineta, Pico de gallo, Maíz tierno\nProteínas: Atún\nAdición proteína (Atún): +$ 1.500\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:18500
5582f94d-05ce-4cae-89ef-6ef06eae7978	af74bd65-6fd5-41e8-847d-77f1243e1b80	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Queso feta, Guacamole\nProteínas: Pechuga de pollo, Carne desmechada\nProteínas adicionales: +$ 5.000\n__unit_price__:21000
d12d6818-b50f-4f50-9a0e-30e13e65d0c8	71d6172e-a893-4e18-8358-f54ab98a32cf	522d937d-7d2d-4c3a-b785-f692a09b8a37	2	\N
b5541930-f4b9-4538-a9a3-3e573086e422	71d6172e-a893-4e18-8358-f54ab98a32cf	1bee1de0-2321-4e6e-a97e-05fd409ec1bc	1	\N
1082f79a-5faa-4fe9-b532-7640b51227b9	71d6172e-a893-4e18-8358-f54ab98a32cf	6a561a5e-1a59-41b5-9a6d-eb8dae2eaeef	1	\N
f199c4c6-83a3-4eb2-84f0-bbe003be200f	eb87a882-bddc-4481-ae3b-fe4675d8740c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Pico de gallo, Guacamole, Pepino, Chips de arracacha\nProteína: Pechuga de pollo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
a701865f-4ee8-4ae4-8320-7f111c6cd7f6	c4a98bd4-97f1-45f6-aab3-1ed1a0e9c6fc	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Champiñones, Queso feta, Tocineta, Maíz tostado\nProteína: Pechuga de pollo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
2de6f56a-296d-4e8a-8671-69377e76a3ff	f6618feb-9e20-44d9-80f0-7212b797da10	f4eeb7cc-c281-44ab-92ff-e0cd4a9ec8ed	1	\N
853ee687-8d2a-4163-aa7c-c1840d1b039e	3776281b-b10f-4af8-86b1-7d6dd088b589	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
be507e1d-2337-42ba-8a32-c95617143a84	3776281b-b10f-4af8-86b1-7d6dd088b589	c7572bb3-01f8-4c66-a3e3-0c262093761c	2	\N
f9a9c95d-3b88-4e18-8d12-5a7794d007a0	3776281b-b10f-4af8-86b1-7d6dd088b589	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
81597761-1330-4e3a-bae9-d2517d63938b	fd5faf4b-3fa3-4321-80d4-97bec23a5f3b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Champiñones, Tocineta, Guacamole\nProteínas: Jamón de cerdo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
5bc2e975-f80d-4bfb-8289-31717bd28d1f	2c5d3b4a-d3b7-4137-a2fc-7433ed989576	60c3451b-db1a-45f4-8480-585e01fe2242	1	\N
ada069c7-3f7b-4c39-8bd4-d472f0fced43	2c5d3b4a-d3b7-4137-a2fc-7433ed989576	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	2	\N
f6e8d71f-578c-4e97-aed0-2f8a1983ceae	2c5d3b4a-d3b7-4137-a2fc-7433ed989576	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
324816a6-8771-4044-8474-5d06876a7344	2c5d3b4a-d3b7-4137-a2fc-7433ed989576	bed3342f-2b63-4270-81fe-4d37d1b8f929	1	\N
ae07f55d-18e9-4104-a04c-264f1c02b7a4	d2d00877-f50d-46ad-9fe1-29b95cf1bb56	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	\N
80d06d13-bf93-41dc-aac3-ceaf45dc712e	d2d00877-f50d-46ad-9fe1-29b95cf1bb56	bed3342f-2b63-4270-81fe-4d37d1b8f929	1	\N
8ae1bce6-55ad-4507-82a6-a0df22dd9b90	d2d00877-f50d-46ad-9fe1-29b95cf1bb56	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Guacamole, Maíz tierno, Tocineta, Pico de gallo\nProteínas: Jamón de cerdo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
62e575f8-478b-4ff6-9007-ba68c53f28c2	4c7598f6-f7fb-498b-b5b7-2718af77fff2	6a561a5e-1a59-41b5-9a6d-eb8dae2eaeef	2	\N
ce6e68bd-d2b5-4d5c-9641-7a5917c74ff3	f21d2435-7ff3-4be3-b521-20876522aa88	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	\N
2cffd5f3-3eeb-4f56-8bc8-ae5ef9ff257d	50df1309-7bba-4c64-9940-8b7912f35426	438dd0c6-70f4-4fa5-b1d5-cba96dcbd8a3	1	Base: Frutos Rojos\nToppings: Fresa, Banano\nToppings cobrados (0): +$ 0\nAdición: Yogurt Griego\n__unit_price__:16500
d0cc1da6-fdeb-4f9d-bc37-63559bea7cf8	7f33db4f-503f-4f3d-9675-1ef2d8d1abc2	438dd0c6-70f4-4fa5-b1d5-cba96dcbd8a3	1	Sin base\nToppings: Mango\nToppings cobrados (1): +$ 2.000\nAdición: Yogurt Griego\n__unit_price__:5000
93868085-3b01-4949-a1f6-c24632e224ab	5555592f-75df-4392-9542-23d7c0e31466	87eb7166-053d-4739-9511-ff90b826ada6	1	\N
852d6fdf-f0c2-45a2-bf06-edaed534a35f	531ede53-207b-4665-9e6e-7d403d23cc24	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Guacamole, Tocineta, Champiñones\nProteínas: Carne desmechada
275e8f5e-a4df-4d13-a82e-cb34b3e0b292	531ede53-207b-4665-9e6e-7d403d23cc24	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tostado, Tocineta, Pico de gallo, Zanahoria\nProteínas: Carne desmechada
93897e86-4c34-4ba7-a555-ff67ed7f7bfc	531ede53-207b-4665-9e6e-7d403d23cc24	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Maíz tierno, Champiñones, Pico de gallo, Tocineta\nProteínas: Carne desmechada
5e353c1b-121f-49c7-8c3f-50d7eabc0783	531ede53-207b-4665-9e6e-7d403d23cc24	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Tocineta, Maíz tostado, Pepino, Cebolla encurtida\nProteínas: Carne desmechada
25e59ea5-d274-499d-bd0a-0d1fe6a11905	531ede53-207b-4665-9e6e-7d403d23cc24	febcfb4f-bc51-4719-89dd-765ed174f19b	1	\N
c1386b8f-304e-4326-b2dc-53c32688ccba	476cfdeb-178b-4d45-be59-bb1dc1c73473	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Arroz\nToppings: Maíz tierno, Guacamole, Pico de gallo, Tocineta\nProteínas: Carne desmechada
91ddd9ed-10d3-4f58-97fb-674cb2d9942c	476cfdeb-178b-4d45-be59-bb1dc1c73473	35a41129-ef96-43e6-8ebc-7c14c4d26605	2	\N
b8e79cf3-c43f-4753-9d20-5849cd5fe209	476cfdeb-178b-4d45-be59-bb1dc1c73473	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Champiñones, Queso feta, Tocineta, Pico de gallo\nProteínas: Carne desmechada
0b0301d8-1137-4f0b-8d03-7e15044fa851	3a3112ec-1f79-483e-a275-7d2065c2c988	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua, Pasta\nToppings: Zanahoria, Queso feta, Champiñones, Chips de arracacha\nProteínas: Carne desmechada
00af2425-12fc-4181-afac-8eba0476f193	3a3112ec-1f79-483e-a275-7d2065c2c988	bbe7a283-40e4-4d35-bac2-1aa7423a4058	1	\N
0c66dbb5-857a-44da-bb86-5f1c1d634fac	20c9e2a3-35f6-4886-9edf-b163830266b4	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Champiñones, Pico de gallo, Guacamole, Queso feta\nProteínas: Carne desmechada
ebc4a659-f372-4d0f-8844-c00096943441	869e9281-cdf3-408d-8d7a-60247e15ddd5	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
5d1b77c8-b102-43d0-bfe8-2a36e4f1931c	ab3e3bbb-4b80-45fe-9bcd-32b39f452ca9	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Guacamole, Pico de gallo, Chips de arracacha, Pepino\nProteínas: Carne desmechada
aa8d863f-0047-4c0d-b89d-1a10b2ff4695	ab3e3bbb-4b80-45fe-9bcd-32b39f452ca9	bed3342f-2b63-4270-81fe-4d37d1b8f929	1	\N
8029b813-c949-4ba3-a059-ee178502062d	fe854d7a-e7c5-4e6c-8ec0-b137e5bf0e94	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Pico de gallo, Guacamole, Maíz tierno, Tocineta\nProteínas: Carne desmechada
4ff1ca7a-2228-4ace-a83a-337c16fdaa15	fe854d7a-e7c5-4e6c-8ec0-b137e5bf0e94	bbe7a283-40e4-4d35-bac2-1aa7423a4058	1	\N
d2a44d30-3cbb-4fa9-aff6-5aa03faf35ec	f9247b21-6266-4eb8-a973-7e54f7c82fe2	60c3451b-db1a-45f4-8480-585e01fe2242	1	Adición bebida: +$ 1.000\n__unit_price__:20000
bdc276a3-1cdc-4313-bdd3-ef76fd619ede	f9247b21-6266-4eb8-a973-7e54f7c82fe2	438dd0c6-70f4-4fa5-b1d5-cba96dcbd8a3	1	Base: Frutos Rojos\nToppings: Mango, Granola, Piña, Fresa\nToppings cobrados (0): +$ 0
7e37ed04-9199-490b-a8f7-7601a6ef05c0	f9247b21-6266-4eb8-a973-7e54f7c82fe2	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
994d504c-6ba0-43cf-91b1-7000b2b214b3	7e57451d-f8a3-4f84-b92c-479eb19bedc0	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
d74350d4-7c70-4948-9f2d-5b61046d3d1f	37ef47e5-d2d2-4f05-a8c6-fabba4ef99fe	60c3451b-db1a-45f4-8480-585e01fe2242	1	Adición bebida: +$ 1.000\n__unit_price__:20000
df8723ad-e1f6-426f-bb3f-03645aa26bc4	62eea85d-6709-4092-8852-2062514d6842	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	Adición bebida: +$ 1.000\n__unit_price__:20000
db770e79-cd5d-4692-a33c-f6b923fbca95	f3e72a86-2d4f-4531-b90d-010bfe35610a	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	\N
d0526bae-8e1c-42f1-a412-6a7aaa9bc8b5	f3e72a86-2d4f-4531-b90d-010bfe35610a	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
c0ba4226-c96c-42b5-9dad-ce5903c6572c	aaa83596-7c95-46a2-bf81-ebf1bed3f1cd	890a38ce-311d-45f0-b602-f10798189185	1	\N
6068f718-0c6f-432c-8413-a08dc69f675f	9fa84ec0-3712-42d5-805e-2ceed9f09619	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Pico de gallo, Guacamole, Maíz tierno, Champiñones\nProteínas: Carne desmechada
f9e4ca99-9dbd-43b8-85f6-b1ba41e02367	9fa84ec0-3712-42d5-805e-2ceed9f09619	7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	1	\N
3efd18f2-b4a6-42b4-b592-8fc120846ac1	9fa84ec0-3712-42d5-805e-2ceed9f09619	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
172da23e-d9ba-44b3-b7ff-c2f80cd9c52d	12faaac0-0094-4bae-b539-e06281b943ec	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Pico de gallo, Maíz tierno, Guacamole, Tocineta\nProteínas: Carne desmechada
196dca1b-f2e4-4f5b-8bd4-b2656424a4d3	8db617e0-d976-4c40-8402-63e273feedb5	87eb7166-053d-4739-9511-ff90b826ada6	1	\N
f7483b2c-ab4a-4861-97e3-49442a8ccdbf	79f976ad-93ef-401d-8e8b-483cd3d6bb09	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Tocineta, Maíz tierno, Zanahoria, Queso feta\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
f7792b2a-6824-4839-92ed-9dfa90ac4717	79f976ad-93ef-401d-8e8b-483cd3d6bb09	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Arroz\nToppings: Maíz tierno, Guacamole, Tocineta, Maíz tostado\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
f9bede7d-3913-4344-b84a-273a8f502e8f	79f976ad-93ef-401d-8e8b-483cd3d6bb09	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
c9f859f5-ddf4-4e64-90b5-b9c3f8e85434	23ddc409-9409-4dfc-9dde-c5ee605b4073	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Maíz tierno, Champiñones, Guacamole, Tocineta\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
03e4ac98-7b3b-4326-b887-59189a44ebfe	23ddc409-9409-4dfc-9dde-c5ee605b4073	3bb93296-c6c5-456a-b165-73c1a20a3134	1	\N
3f0e74bf-bda0-42cd-99c8-6c7c7f6fc6b5	23ddc409-9409-4dfc-9dde-c5ee605b4073	f4eeb7cc-c281-44ab-92ff-e0cd4a9ec8ed	1	\N
07d2c6c0-d488-45d7-9a5c-32affbe7265a	55385d16-553a-4bb8-a910-fb5a7df769bd	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
b15b22c2-21df-4434-8f6c-6ea62a60e279	93fcffe3-7dc4-48ad-858d-7304144dd414	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Guacamole, Tocineta, Pepino\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
b6c5dcb3-4473-4ed0-b012-2a218252041f	93fcffe3-7dc4-48ad-858d-7304144dd414	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Champiñones, Tocineta, Zanahoria\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
b0e05c8a-0e8e-46a1-b306-e6e15038ba25	6b36de44-426f-467c-b8f5-7c1017423348	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Tocineta, Champiñones, Pico de gallo, Guacamole\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
b8eaa8a3-d3c8-42ff-83e1-1fc1a025e6bc	e5a15063-4667-41dd-a03b-e19481a7955e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Champiñones, Tocineta\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
6cf69ce9-f91e-43fb-a075-0771d8be9c81	8d6a5325-6871-42a0-a7ec-622f5637e7cb	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
bb072a38-a4b5-4f17-a723-c274b3ab78fe	7959fe81-c0ce-4097-a473-ca4554179590	bbe7a283-40e4-4d35-bac2-1aa7423a4058	1	\N
9e913e80-851a-43ad-b5ca-68e1d8563fd9	a618bb69-d63c-4f75-afcd-1bd165e2e0dd	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Tocineta, Pico de gallo, Maíz tierno, Zanahoria\nProteínas: Carne desmechada
24728284-9e61-4df1-afd3-c263a76fb23c	a618bb69-d63c-4f75-afcd-1bd165e2e0dd	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Tocineta, Pico de gallo, Maíz tierno, Guacamole\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
026f4a36-fdcd-400c-b647-aaf14a42b4dc	1a3e9c16-34dd-489b-b277-d65a7c4ad26d	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Champiñones, Tocineta, Chips de arracacha, Guacamole\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
b1f21575-87bd-4558-92c3-af51e8199172	45e7b405-d78d-4d64-9743-489c2b9bcaf0	f4eeb7cc-c281-44ab-92ff-e0cd4a9ec8ed	2	\N
83d62e70-f55f-433d-bac2-b4a1405f1ea7	6f1e1cd3-cc88-4843-8382-da8e2e02642e	c260a933-f796-416a-9d0c-ab2b4e769e33	1	\N
27ec74fc-4773-4762-8c0c-396667fbb6da	5a58477e-3d7e-4b3c-9dc7-64c0fc80fc83	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Caja/Empleados\nBase: Pasta\nToppings: Champiñones, Chips de arracacha\nProteína: Pechuga de pollo\n__unit_price__:6000
61e9ade6-859e-4391-9105-57868c81d87b	dffd52dd-5a57-43e0-b89b-b18b7c66db64	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Caja/Empleados\nBase: Pasta\nToppings: Champiñones, Chips de arracacha\nProteína: Pechuga de pollo\n__unit_price__:6000
2229d0c7-ed77-408f-8102-b4505eca69f4	3aae4e92-7e4a-405b-b856-f56247207203	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Caja/Empleados\nBase: Pasta\nToppings: Champiñones, Zanahoria\nProteína: Pechuga de pollo\n__unit_price__:6000
11b19403-253e-434e-8e74-397cfa89a64c	b9cd2141-c2a9-41bd-a81d-9335ae154f14	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz\nToppings: Guacamole, Pico de gallo, Tocineta, Maíz tierno\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
e380d110-fc0e-4e03-86ba-78441ff43d81	994c1774-d5bf-4fc2-b0ea-813910dfa628	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Zanahoria, Maíz tierno, Guacamole, Champiñones\nProteínas: Jamón de cerdo
26c72c22-ecce-4df2-84b1-03027d146b0f	994c1774-d5bf-4fc2-b0ea-813910dfa628	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
ef1340cc-2fe4-41c7-a391-694a150beaf0	994c1774-d5bf-4fc2-b0ea-813910dfa628	bed3342f-2b63-4270-81fe-4d37d1b8f929	1	\N
6f0bf552-e45f-474e-a802-56636f2c4b9d	a4cca9b9-8f0f-44ee-b2a1-62c2388d57f1	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Tocineta, Guacamole, Chips de arracacha\nProteínas: Carne desmechada
c69bc7a4-d58c-4fe5-867c-c89a7a944452	a4cca9b9-8f0f-44ee-b2a1-62c2388d57f1	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Maíz tierno, Tocineta, Guacamole, Chips de arracacha\nProteínas: Carne desmechada
3be8627b-e9a6-400e-bf92-9e86f34dd346	a4cca9b9-8f0f-44ee-b2a1-62c2388d57f1	bed3342f-2b63-4270-81fe-4d37d1b8f929	2	\N
7bfbd25d-d76e-4437-9081-b6b493d7272f	f725ddbf-2a16-4c58-b0ac-81cd3d148c94	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Tocineta, Guacamole\nProteínas: Pechuga de pollo
4b609a47-2164-4289-9efb-205c74caab83	f725ddbf-2a16-4c58-b0ac-81cd3d148c94	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Arroz\nToppings: Maíz tierno, Tocineta, Champiñones\nProteínas: Pechuga de pollo
fc5fa963-0826-4b95-b40f-eb1179061982	51b0e86d-8087-4845-b0f2-51ebcf3b660f	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Guacamole, Pico de gallo, Tocineta\nProteínas: Pechuga de pollo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
dde753a7-4e46-43a2-aa42-98abaa968f5f	edccc54d-a6c3-403e-b230-a0ff48f54a14	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
c5829c2c-9423-4323-9c4d-7458f1cbfbe1	edccc54d-a6c3-403e-b230-a0ff48f54a14	a923676d-77da-4843-9df2-8eb637965cb4	1	\N
b7baa50b-526b-42b0-8427-1b396914788a	edccc54d-a6c3-403e-b230-a0ff48f54a14	f4eeb7cc-c281-44ab-92ff-e0cd4a9ec8ed	1	\N
26808c26-9032-4adf-8edc-d054358100d2	cc4ee3c8-fc98-4f79-8db2-c2c3db251317	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Queso feta, Pico de gallo, Tocineta\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
61295fa4-c63d-4e7b-91d1-e8d44ded21e0	231ec8f1-cf2f-415a-8b95-0efb5d748fa1	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Guacamole, Maíz tierno, Pico de gallo, Tocineta\nProteínas: Pechuga de pollo
fb325248-df06-46d4-98ed-fb7d4e38f0fe	b23a6d32-fe51-46a4-8a89-a97230318293	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	2	\N
64e60ce6-17f7-410d-919c-8ce77dd8c6af	b23a6d32-fe51-46a4-8a89-a97230318293	bed3342f-2b63-4270-81fe-4d37d1b8f929	2	\N
aa0894bb-af34-4112-ae95-dff5496408ff	b23a6d32-fe51-46a4-8a89-a97230318293	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
b449ddbe-579a-4fc6-a7a5-ee6286b6ea44	b23a6d32-fe51-46a4-8a89-a97230318293	87eb7166-053d-4739-9511-ff90b826ada6	1	\N
67b80d59-b6c0-4d5a-93cf-4d4db789cb02	11067034-8408-4b3b-8c1d-e7d00061a487	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Champiñones, Zanahoria, Tocineta\nProteínas: Jamón de cerdo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
e89bd46e-c266-4b76-8ce9-a9c164a31570	11067034-8408-4b3b-8c1d-e7d00061a487	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
067431e8-bccd-487d-9cfd-b4ac5ba668f3	2629bab1-88ef-4810-b834-9f089b98854b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Tocineta, Guacamole, Champiñones\nProteínas: Pechuga de pollo
4cb4e49e-b285-43fd-932b-97485f50ae4a	2629bab1-88ef-4810-b834-9f089b98854b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Tocineta, Guacamole, Chips de arracacha\nProteínas: Pechuga de pollo
2acd1e3d-4340-44f1-9972-653b1f2480ac	227b7efc-4d75-4c63-b622-bccf4c44c64b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Champiñones, Tocineta, Chips de arracacha, Maíz tierno\nProteínas: Pechuga de pollo
c76ee941-e689-4f2f-b059-51570f6e0921	227b7efc-4d75-4c63-b622-bccf4c44c64b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Champiñones, Guacamole, Tocineta, Maíz tierno\nProteínas: Pechuga de pollo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
def5395e-b4c7-400c-95dd-c43d5eef7680	59c54231-7a88-4445-8887-302b87ed99d0	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Tocineta, Maíz tierno, Guacamole, Queso feta\nProteínas: Pechuga de pollo
abd2a976-0a07-4418-9600-1dcc859edbd5	59c54231-7a88-4445-8887-302b87ed99d0	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Champiñones, Guacamole, Queso feta, Pepino\nProteínas: Pechuga de pollo
aacc89ea-a13b-452a-b67e-a86a2600aca5	59c54231-7a88-4445-8887-302b87ed99d0	c7572bb3-01f8-4c66-a3e3-0c262093761c	2	\N
745bb33a-4daf-490e-960a-46f6d6ca76b5	59c54231-7a88-4445-8887-302b87ed99d0	e839d48b-abd3-497e-ab9b-cb4aa78eb773	1	\N
f1742d06-3fc3-4316-90c7-9077722cca7f	8d60485b-4b1c-44b3-b000-590f1c6eb29b	a6180a54-dcea-4af5-a873-455b03618324	1	\N
f1e006d3-1bec-4c83-b16c-403db925958f	2011c616-19f8-45be-98c6-7623be70f00d	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
e80a1edd-cfe1-4b9a-a68a-c101a8cad9c4	a597b15c-8887-4c7b-873d-80cf0c5733b6	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Pico de gallo, Tocineta, Guacamole, Maíz tierno\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
ba90667f-fec6-45eb-baa2-0994448bbede	a597b15c-8887-4c7b-873d-80cf0c5733b6	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Pico de gallo, Tocineta, Guacamole, Maíz tierno\nProteínas: Carne desmechada
3e1068f2-ed48-432d-997d-42678d96f8d3	b94bbf17-cc90-4a21-8584-12ce0159b65c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Champiñones, Tocineta, Guacamole, Pico de gallo\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
f7a4bd56-6c1d-4303-a75b-7b89f8beda42	b929eb2d-98b0-44b6-9fe2-2a43ba614b2c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Pico de gallo, Champiñones, Maíz tierno\nProteínas: Carne desmechada, Pechuga de pollo\nProteínas adicionales: +$ 5.000\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:22000
22fc141f-6f14-467b-84e0-b02691ff5750	b220b21d-57b4-4485-90d2-00d102a13bd5	f4eeb7cc-c281-44ab-92ff-e0cd4a9ec8ed	1	\N
10416b5c-157f-4107-865d-c2400417bc79	b44c8f76-8a82-4137-881c-868ebb5dd744	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Champiñones, Guacamole, Tocineta, Queso feta\nProteínas: Pechuga de pollo
6b8c52d0-b33f-4e13-ab61-34f2ba093029	b44c8f76-8a82-4137-881c-868ebb5dd744	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
e4b3bd3e-d3f9-4ddc-b89a-c793668079cb	b44c8f76-8a82-4137-881c-868ebb5dd744	a923676d-77da-4843-9df2-8eb637965cb4	1	\N
61cad455-002c-41da-a10e-c5d157bafee4	dfc3d669-7245-45ff-b720-33581d7f270e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Arroz\nToppings: Maíz tierno, Guacamole, Tocineta, Pico de gallo\nProteínas: Pechuga de pollo
5fe6a806-756b-4673-ae1d-28e199d5b3aa	02138fc1-f29b-4c80-90fb-a7c324f110b2	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Arroz\nToppings: Maíz tierno, Guacamole, Tocineta, Chips de arracacha\nProteínas: Pechuga de pollo
4dfeef41-a9ec-4059-8a0d-2ec890239ab3	826c4c3b-b34a-47a1-ac89-abb687426236	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
7008d0ed-d6f9-4fe2-94f6-72314994d00a	7959fe81-c0ce-4097-a473-ca4554179590	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
8e9abe18-8006-455a-add2-c3bf83a7432b	0fc60b67-bf6e-4567-906a-22b9831d57f2	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Caja/Empleados\nBase: Pasta\nToppings: Guacamole, Queso feta\nProteína: Pechuga de pollo\n__unit_price__:6000
36b64f96-2d6d-46b6-80e3-edf7666f2171	341de0da-d51a-4eb2-a1ef-3a342a94ea4b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Queso feta, Pico de gallo, Tocineta\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
087f37e1-28fb-434f-aabe-96d95c4f3a59	db3f9b03-b164-489c-bb5a-2dcc91f8307b	c3704705-037f-40c4-976c-d0576e944b21	1	\N
220c7d00-1a68-481a-8faf-92ffddcac603	df7ca570-eb64-48dc-95b0-0b522c89f215	31a6d560-88e6-45ec-9177-0625136ffe22	1	\N
4721e4d4-952f-4517-b03c-94bd27476d19	df7ca570-eb64-48dc-95b0-0b522c89f215	fc11776c-aef5-449a-9fcf-1e982a0b35ab	1	\N
3cc62f6b-f822-4adb-a4fd-c2567a79d0d6	7503cb10-42bf-448d-88fb-aaa6186d2480	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	Adición bebida: +$ 1.000\n__unit_price__:20000
f43b1692-5903-47a3-90ff-71dd5667aabf	7503cb10-42bf-448d-88fb-aaa6186d2480	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Tocineta, Maíz tierno, Maíz tostado, Guacamole\nProteínas: Pechuga de pollo, Jamón de cerdo\nProteínas adicionales: +$ 5.000\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:22000
f2e41838-ad32-4a1b-8c74-330971cb1f0c	7503cb10-42bf-448d-88fb-aaa6186d2480	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
c2969219-a3b7-42c5-b2f9-3cfa0300bc75	d4562f5a-3ce8-4678-9caa-c696468a5463	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
4da3798a-ebd7-4907-954a-6ab6e7dbc54a	dbd1e1a4-abb7-4774-878a-c79ba65fd1a2	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
26ed05e5-d2f4-4acc-9ab7-49e4d6579b63	4ca32d17-67b9-4f47-be28-7a3d16497d58	f4eeb7cc-c281-44ab-92ff-e0cd4a9ec8ed	1	\N
ebff8636-a04b-4d36-b6d5-979f418094a5	1e990bf7-14b9-435e-97cb-1411f39e1c56	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Maíz tierno, Guacamole, Queso feta, Champiñones\nProteínas: Pechuga de pollo
c773ce38-fae2-45a6-91d5-811c5c40bd9c	25caf478-78c1-4240-89c4-b4dd00e00eae	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Pico de gallo, Guacamole, Tocineta, Cebolla encurtida\nProteínas: Carne desmechada
7b5ad255-8a5f-44db-8457-97675ea2f275	018a97d9-84d1-4be5-a416-69b5323df9e7	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Queso feta, Cebolla encurtida, Pico de gallo\nProteínas: Pechuga de pollo
98440ac6-e7aa-4df7-b89b-d1548e82e63e	018a97d9-84d1-4be5-a416-69b5323df9e7	43804c87-d964-44ea-83cf-8e56b58a1c92	1	\N
f134bf21-fd73-4833-a85d-c13dc6876725	018a97d9-84d1-4be5-a416-69b5323df9e7	1bee1de0-2321-4e6e-a97e-05fd409ec1bc	1	\N
c78da13b-3977-4b28-9b2b-a9bdfacc01fc	2751e5a4-f7b9-47f2-bdb3-096a898e3aab	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
0ef9745e-a608-496c-b327-a5b6e8b77f8d	2751e5a4-f7b9-47f2-bdb3-096a898e3aab	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Tocineta, Guacamole, Champiñones, Zanahoria\nProteínas: Pechuga de pollo
614f2d02-52d4-485e-be56-fb7860e2b7a1	2751e5a4-f7b9-47f2-bdb3-096a898e3aab	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
eaf939cf-1a45-4239-b502-39b194643626	2751e5a4-f7b9-47f2-bdb3-096a898e3aab	e839d48b-abd3-497e-ab9b-cb4aa78eb773	1	\N
7145c056-9926-493e-ab87-5e650ec4f222	e5745e4a-6282-403e-9d0f-687c2c8a3cfb	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Caja/Empleados\nBase: Arroz\nToppings: Guacamole, Queso feta\nProteína: Pechuga de pollo\n__unit_price__:6000
945214b0-db33-426e-b016-89d0a8cc4bf9	922c83c7-3d21-4bcd-b57d-4db562d52855	153a1ea3-1420-4d88-b427-c23254b00bde	2	\N
54979567-f8b1-44c5-814d-673e70b7fe74	922c83c7-3d21-4bcd-b57d-4db562d52855	1bee1de0-2321-4e6e-a97e-05fd409ec1bc	1	\N
630c7182-beb9-4d3a-a92f-6c851b113f96	37290857-cd85-4bab-8831-9a03a17d7fb4	1bee1de0-2321-4e6e-a97e-05fd409ec1bc	1	\N
f1469a4b-2a92-4271-acb8-4ab68dc50d77	42755f79-6c52-43ad-9cf5-03128e83898e	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
25ea5767-ce1f-4ea5-b0ec-933057794054	d099c56a-46d2-410a-a9c2-ac86eb6b69f9	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	\N
ab213863-9a70-431e-a5a2-84773b4f52d7	d099c56a-46d2-410a-a9c2-ac86eb6b69f9	153a1ea3-1420-4d88-b427-c23254b00bde	2	\N
ce781560-fbb4-40b4-83ae-f2185924ad28	88af7b38-b896-46ec-93dc-5bae8f15083f	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	\N
abb92ac7-fd39-4e13-ba22-32a36f319d63	88af7b38-b896-46ec-93dc-5bae8f15083f	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
4942c840-e929-44be-9c93-795564c95f5c	88af7b38-b896-46ec-93dc-5bae8f15083f	1bee1de0-2321-4e6e-a97e-05fd409ec1bc	2	\N
397a535c-84ae-4e90-bac1-67b01c9ef528	edc57912-351d-4c1a-b9e3-443d72f40504	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Queso feta, Champiñones, Tocineta, Pico de gallo\nProteínas: Jamón de cerdo
ff510690-82da-453c-ac7b-8fcc04488a0d	ffba5fa5-7db3-4a62-ab0b-3cf097c81580	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Tocineta, Guacamole, Champiñones, Pico de gallo\nProteínas: Jamón de cerdo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
b607e707-ea4a-4c8f-9233-ba9376c5a713	ffba5fa5-7db3-4a62-ab0b-3cf097c81580	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
72ab8f91-560c-484c-844c-37c8d44afec1	792bcf28-75dd-48e6-a8fd-155dd69e7609	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Guacamole, Tocineta\nProteínas: Pechuga de pollo
dc1b96dc-d531-4082-ac16-a6b776ad67db	ba2b0c1f-87af-4481-8659-d8ae48fc6954	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua, Pasta\nToppings: Queso feta, Cebolla encurtida, Tocineta, Guacamole\nProteínas: Pechuga de pollo
4581a836-f0f1-4528-b82e-3ca86fe35de6	ae9b4a21-6777-4cbc-9210-f5de90f6a6ba	87eb7166-053d-4739-9511-ff90b826ada6	1	\N
a0ff7da6-af5c-4b69-972c-b90fc8991e29	ddfd1d56-0436-4bb3-95a0-1d0aecfa42fd	c7572bb3-01f8-4c66-a3e3-0c262093761c	4	\N
2b0a39b0-67ae-4ab2-b588-926345d37814	7c5ea64b-e701-41cc-bbe8-beb448eadfec	f4eeb7cc-c281-44ab-92ff-e0cd4a9ec8ed	1	\N
8f4250db-92c5-4586-8653-28d746bbe27d	d4c814bf-c9b4-439e-99ef-79c672f2f7dd	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Champiñones, Pico de gallo, Guacamole, Queso feta\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
3c4d9a71-50ac-4091-b9d3-c34c1c367ab2	57866140-8280-46b8-b0ad-dff48341dd84	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Maíz tierno, Guacamole, Tocineta, Chips de arracacha\nProteínas: Carne desmechada
d09006a5-3311-4cb4-bced-3ab1d47089b9	53e2df0e-4a01-4209-a5d5-8371f2219bfe	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Pico de gallo, Guacamole, Maíz tierno, Champiñones\nProteínas: Pechuga de pollo, Carne desmechada\nProteínas adicionales: +$ 5.000\n__unit_price__:21000
0a3ca34d-4e6e-47ab-bae7-bd78f9e508a8	53e2df0e-4a01-4209-a5d5-8371f2219bfe	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
4f51efba-f6f3-4836-86ee-53a3f3711f40	42d9a69e-54ee-45ac-ad88-efaea35c5db1	febcfb4f-bc51-4719-89dd-765ed174f19b	1	\N
67643fab-dae6-4a19-bfd2-70c56f04cf36	b51e7e68-0282-4d18-b159-f18b74c1db37	87eb7166-053d-4739-9511-ff90b826ada6	1	__unit_price__:5400
3ed630b9-33a1-4d30-9b3a-d7bd99d55bda	b51e7e68-0282-4d18-b159-f18b74c1db37	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Champiñones, Pico de gallo, Tocineta, Guacamole\nProteínas: Pechuga de pollo
6eafbdc5-7c90-403d-8878-4b4a522882f8	b51e7e68-0282-4d18-b159-f18b74c1db37	55a58658-65cd-43dd-a160-6449b3f38a1c	2	\N
2531abbc-2c28-4059-a519-858726f5ab6d	b51e7e68-0282-4d18-b159-f18b74c1db37	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
9351dd0d-d118-47bc-ae8c-9711b48b6297	784891fc-8270-47eb-88fd-06772fe2d0d7	f4eeb7cc-c281-44ab-92ff-e0cd4a9ec8ed	1	\N
bbdf3d94-e2de-4393-8a2b-b1313a7becd6	8ad24428-1911-4b99-817f-5d9afce04e75	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Champiñones, Guacamole, Pepino, Maíz tierno\nProteínas: Jamón de cerdo
9de8dafd-e816-4250-a9be-51014bd41a3c	8ad24428-1911-4b99-817f-5d9afce04e75	fe196a9f-e68f-4df6-ab98-5a2c58ad9b16	1	__unit_price__:5400
0d418d34-e6b3-4232-9257-f06ac534e5a9	4841f5f4-ef68-4a82-a82c-083db8b15c21	31a6d560-88e6-45ec-9177-0625136ffe22	1	\N
8b46bbcd-5fd0-463f-b859-9e49de5ec8f9	ee62c8e1-8eae-412b-bf0f-4db8fa44203b	1bee1de0-2321-4e6e-a97e-05fd409ec1bc	1	\N
d0813f12-06fd-4970-afe6-06c5841315b6	05884f8a-d296-4434-9564-4269a5ec50fe	1bee1de0-2321-4e6e-a97e-05fd409ec1bc	2	\N
7d9ae836-f7ec-4fb4-b638-e871fb0fa01e	05884f8a-d296-4434-9564-4269a5ec50fe	fa107d92-d59b-4686-b51f-7df33766c361	2	\N
0c524773-54c0-451c-8d14-506a52d76913	eb9bb209-fc08-42bd-927a-b4834d763153	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
916fdb8e-bdd3-48e8-885a-4d4c2ddc2fea	eb9bb209-fc08-42bd-927a-b4834d763153	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	__unit_price__:8500
92d181c2-2833-4716-bfed-323902f840a7	eb9bb209-fc08-42bd-927a-b4834d763153	2798ad2f-73f8-4a2d-b37f-79f780b32eeb	1	\N
79965c8e-3a59-4d27-a987-c5576eb11002	eb9bb209-fc08-42bd-927a-b4834d763153	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
9bba7bba-eb7f-4134-aa2d-27695ad5f2c5	7fcec3a4-88cc-4b77-8769-1c8bbaf21e6e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Tocineta, Guacamole\nProteínas: Pechuga de pollo
f5a46d9a-0304-4d96-bb0b-dea2bbce5334	c2204cb6-2a33-46e6-a364-9b5507a5081e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Tocineta, Pico de gallo, Guacamole, Cebolla encurtida\nProteínas: Pechuga de pollo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
ab5fe5f7-5f2a-400c-8214-8b5467ae3327	fc45e897-a785-4ebe-81c1-3ab20e6644b0	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Guacamole, Maíz tierno, Pico de gallo, Tocineta\nProteínas: Carne desmechada
4ac6932e-d526-4649-87c9-20ef60001e0e	fc45e897-a785-4ebe-81c1-3ab20e6644b0	bbe7a283-40e4-4d35-bac2-1aa7423a4058	1	\N
d9a66599-eaa7-4d57-b7fb-084b1d92c6a6	bce93cab-b4ae-4f56-84c2-258428392c98	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Maíz tierno, Guacamole\nProteínas: Carne desmechada
2d4be61e-4afb-4430-8bd7-e82a8dfd8309	bce93cab-b4ae-4f56-84c2-258428392c98	87eb7166-053d-4739-9511-ff90b826ada6	1	\N
fc8a5d68-d507-401c-b84f-59b81fa4f271	4d19d789-9613-4d62-921e-6b2795b8b001	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Guacamole, Queso feta, Chips de arracacha\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
cfe9bfc2-8ff1-4aa7-a0d8-900fc9bafbc7	4d19d789-9613-4d62-921e-6b2795b8b001	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Guacamole, Tocineta, Chips de arracacha, Maíz tierno\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
ac0d34bb-a000-4007-99bd-44d838864806	1d6685c3-89b3-4122-b1d8-01a0f254762b	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	Adición bebida: +$ 1.000\n__unit_price__:20000
63f1f938-9281-4362-aa53-48ec80f1ac5f	b1c0565f-11e8-4bb8-a9c1-247ce2653593	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Pico de gallo, Guacamole, Maíz tierno, Champiñones\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
6bd18be6-2921-481b-9295-1ec44823df1b	b1c0565f-11e8-4bb8-a9c1-247ce2653593	7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	1	\N
9cb4ae76-28a0-4ffe-afd4-5622d470a414	b1c0565f-11e8-4bb8-a9c1-247ce2653593	1bee1de0-2321-4e6e-a97e-05fd409ec1bc	2	\N
15e3c582-c5ef-47ac-be40-8de2111f4703	b1c0565f-11e8-4bb8-a9c1-247ce2653593	c7572bb3-01f8-4c66-a3e3-0c262093761c	2	\N
432dc962-2e53-4ab3-9b8e-f181a59082da	bebbf72d-0001-422d-819d-39e6ad03be34	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Champiñones, Tocineta, Guacamole, Pico de gallo\nProteínas: Carne desmechada
8844ed27-341b-4e91-9894-54db26eb3ff5	bebbf72d-0001-422d-819d-39e6ad03be34	7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	1	\N
3e424330-3f48-4057-b156-5094a7558c8e	bebbf72d-0001-422d-819d-39e6ad03be34	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	__unit_price__:9000
86ba36bc-c391-4528-94c3-fac5e03436cc	ca874ee6-78c1-4817-bfea-8705ee4c4259	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Pico de gallo, Queso feta, Pepino\nProteínas: Carne desmechada
ebe5f734-0ba7-410e-8f08-82ff3d30ed97	ca874ee6-78c1-4817-bfea-8705ee4c4259	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	__unit_price__:9000
709db645-f121-4bb3-882c-03fba78d6d8b	ca874ee6-78c1-4817-bfea-8705ee4c4259	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
e62e066c-e9d2-49bf-bacf-26f3d107dbcb	ca874ee6-78c1-4817-bfea-8705ee4c4259	28e2dfa3-3e2b-4ff4-bc17-ab4dcd35c956	1	\N
29655aed-8f74-49d0-a91c-c89437863dd6	d3a287cd-96ed-4d14-82c3-e23433ab2119	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Tocineta, Guacamole\nProteínas: Carne desmechada
277f3fbf-40c2-4670-95bd-4d1c6457b714	a0da5289-da4f-4e89-b83b-3f54f9c3ae14	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Champiñones, Guacamole, Pico de gallo, Tocineta\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
c8e414ec-f843-4632-af85-19f50c176466	550f4249-3658-4580-8e06-82b40534831e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Caja/Empleados\nBase: Quinua\nToppings: Tocineta, Queso feta\nProteína: Carne desmechada\n__unit_price__:6000
5be0dc21-35a5-47d9-83ac-350e453d9d5a	7b9b4a5c-d84b-453c-9d5f-c7106f321302	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Guacamole, Tocineta, Champiñones, Maíz tierno\nProteínas: Carne desmechada
c61d5dcf-4397-4fe1-bed5-ca72547612ca	ac8112be-4313-418d-a5e0-dabbe8d18e3f	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Guacamole, Queso feta, Tocineta, Chips de arracacha\nProteínas: Carne desmechada
244e0a88-83e9-44de-8ebb-c6171b04a430	1f4a4893-f04a-4e3c-8be7-94a94069cb6d	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Guacamole, Tocineta\nProteínas: Carne desmechada
bd58fcf3-d969-4482-bc39-69b41b8d1ceb	b4135434-f66e-4b1b-b56c-4dad189ea565	87eb7166-053d-4739-9511-ff90b826ada6	1	\N
51fc7bd5-d1a0-4122-bd35-cf29b093c488	376370ce-dbca-4c09-ada9-7e7ed0d56b17	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Champiñones, Chips de arracacha, Tocineta, Maíz tostado\nProteínas: Jamón de cerdo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
6af8831d-d5b0-4342-8f74-4e6b88ca3e4b	376370ce-dbca-4c09-ada9-7e7ed0d56b17	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
15c8cf50-d24b-41b3-820d-56e763d309f8	376370ce-dbca-4c09-ada9-7e7ed0d56b17	bed3342f-2b63-4270-81fe-4d37d1b8f929	1	\N
450d1aca-aca6-444d-a61c-9fe874142789	1187b756-67ff-4b80-880a-ec101dc51c3c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Champiñones, Maíz tierno, Tocineta, Queso feta\nProteínas: Carne desmechada
a974549b-ea1b-442c-88ce-5ef66a66cce4	cc81b2e7-6643-40b6-871a-16b6bcdc93d3	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
ee65fe0e-b4c2-426c-a71c-6248a96d40e1	cc81b2e7-6643-40b6-871a-16b6bcdc93d3	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Tocineta, Guacamole\nProteínas: Carne desmechada
4e985ebf-cfbd-4954-a8a5-d44855853d7a	353e0ca6-531d-48a9-a911-4c65f43e434b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Caja/Empleados\nBase: Quinua\nToppings: Guacamole, Queso feta\nProteína: Carne desmechada\n__unit_price__:6000
a1fb142c-107a-4ae0-b1c2-3c190769d8cf	353e0ca6-531d-48a9-a911-4c65f43e434b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Caja/Empleados\nBase: Pasta\nToppings: Guacamole, Queso feta\nProteína: Carne desmechada\n__unit_price__:6000
4bef92f0-3e79-4647-940b-4cf6b18fb80e	7e01ca38-774f-4f3c-b368-746fc320e3ca	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Arroz\nToppings: Tocineta, Chips de arracacha, Queso feta, Maíz tierno\nProteínas: Pechuga de pollo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
40654046-a37f-4a71-8f8b-8df0e83b93b5	63270235-dcc8-421e-afd1-de37f259b857	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Champiñones, Guacamole, Zanahoria\nProteínas: Jamón de cerdo
fac32b8a-c82f-41df-b8fd-962a8ec57f79	63270235-dcc8-421e-afd1-de37f259b857	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
7422140b-e210-41f3-99ee-3fe9911c83ff	63270235-dcc8-421e-afd1-de37f259b857	a60362be-1697-427a-9786-5463366d338a	1	\N
e4622ab0-907e-4e13-9167-acd31c39ea1b	900b99b6-0f75-4a4d-a363-c96049966079	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Guacamole, Pico de gallo, Chips de arracacha, Champiñones\nProteínas: Pechuga de pollo, Carne desmechada\nProteínas adicionales: +$ 5.000\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:22000
90fbdde5-18c4-423d-b601-647b9158537a	46891027-13a9-428e-900c-62367f8aa74e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Guacamole, Tocineta, Pico de gallo, Maíz tostado\nProteínas: Pechuga de pollo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
9bbe4447-c9ad-41c9-893d-7983ad85c89d	46891027-13a9-428e-900c-62367f8aa74e	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	\N
13a40c90-e9d6-4ab1-8f15-936da921b06a	46891027-13a9-428e-900c-62367f8aa74e	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
66b5db59-5e27-4221-9d6c-18019fa871ad	f4670570-8083-45b7-8c15-dc485e2bdf2f	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Caja/Empleados\nBase: Arroz\nToppings: Tocineta, Queso feta\nProteína: Carne desmechada\n__unit_price__:6000
4f99cb11-5b6d-4ecf-9ccf-8277063da0e7	03e02dbd-a6c4-4255-babe-04ffc6070c76	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Guacamole, Tocineta\nProteínas: Pechuga de pollo
54442e8b-6b5e-47d5-bc77-89190d0e1c05	fecf2df4-b7e5-4789-bdb7-7d974f912402	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
268cfcdc-9ddb-4804-a5cf-c4fc4cf6dc5d	28ed2905-b7b7-4cba-b29a-c6ec7a3cae9a	bed3342f-2b63-4270-81fe-4d37d1b8f929	1	\N
be3ba073-a061-4fa7-9d91-3af014eafde5	c813534d-5c15-4ee3-95d6-d9ec53ebbbdf	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
22afc0c9-19bc-4efc-b7c3-60be895b77bc	7ebed9da-08cb-40ed-b966-be35b58dedfd	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
27593686-ef7f-4274-aa6d-085cf5efcf78	08291555-9d1f-45ed-83e1-81340203a6eb	ed74f62f-d2d3-4cf1-a688-dc615363f8c9	1	\N
5a1e0175-b5f0-4bea-b6a2-bb6c67fc0173	08291555-9d1f-45ed-83e1-81340203a6eb	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	__unit_price__:9900
65c06ac1-0f5a-48d9-ba77-a7322954556f	08291555-9d1f-45ed-83e1-81340203a6eb	fc11776c-aef5-449a-9fcf-1e982a0b35ab	1	\N
bb13ad68-093e-4c9a-99b3-26c66add3206	60b2a83a-e350-460c-a943-9cafff7723cb	a60362be-1697-427a-9786-5463366d338a	1	\N
89fcec3d-ebe0-4f02-b0c0-965361c93845	5c696ffe-3a25-4a89-b51b-d6525973935f	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Tocineta, Chips de arracacha, Guacamole\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
5722834d-a946-4741-9abb-760d903683ef	5c696ffe-3a25-4a89-b51b-d6525973935f	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Tocineta, Pico de gallo, Chips de arracacha\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
22d529df-a44e-4c85-8784-8ebe076cfe40	92a348b0-ac4e-492c-9dc6-bae3f8254a7b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Maíz tierno, Guacamole, Champiñones, Queso feta\nProteínas: Pechuga de pollo
87e831cb-845e-4880-90cb-da6d2025caaa	73861636-7584-4d05-bb21-a817284dec3c	b68386e8-b73e-422b-a5b6-47d622faac19	1	Adición bebida: +$ 1.000\n__unit_price__:18000
6f2e3c56-e2e9-4a67-8d72-6aa6b54a74c0	8ec91978-274c-4e0e-860b-f6b27c1ba961	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Zanahoria, Tocineta, Maíz tierno\nProteínas: Pechuga de pollo
4089b12c-b8e8-459e-b36d-2d0dd804dd78	8ec91978-274c-4e0e-860b-f6b27c1ba961	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Champiñones, Zanahoria, Guacamole, Maíz tierno\nProteínas: Jamón de cerdo
bbf46503-83c1-4991-8298-891a966ab7e4	5e631e64-3edc-4b4f-92de-73d7278e6627	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Maíz tierno, Queso feta, Chips de arracacha, Guacamole\nProteínas: Carne desmechada
fa9e4e64-47af-406d-8bb4-ca37b0c06d41	5e631e64-3edc-4b4f-92de-73d7278e6627	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
9a05bd47-2b57-46f2-a12e-b9ce6bab6d00	c4658b79-0323-4117-9df3-8e1abf29be1c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua, Pasta\nToppings: Guacamole, Tocineta, Queso feta, Cebolla encurtida\nProteínas: Pechuga de pollo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
229d7e43-71fa-420b-883e-002bcbc69049	6033bade-c1c7-4c55-9a12-437b90aa95aa	114e2c84-cf03-47a9-abae-b3edd6911ded	2	Bases: Arroz, Pasta\nToppings: Guacamole, Queso feta, Tocineta, Champiñones\nProteínas: Pechuga de pollo
4c117266-d7a6-4978-b178-75024f4ba328	d0281347-b23a-47db-8984-257752c09ae5	fb3263d0-06b3-436c-be4e-1acac2ef9dba	1	\N
8d6344f0-98da-483d-99b3-63ad2b0f09d9	f1ba1eb8-d882-4cd4-a528-7d1e0dd69557	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Champiñones, Pico de gallo, Tocineta, Pepino\nProteínas: Pechuga de pollo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
2a21004f-6174-49f3-884f-ec5b7f763d86	6aca7e58-b823-44b5-9af3-271e4051d474	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Caja/Empleados\nBase: Arroz\nToppings: Guacamole, Queso feta\nProteína: Carne desmechada\n__unit_price__:6000
fa3934e8-3403-4266-84d7-b3e999bf6c64	4a4a6432-17d1-405f-a0b6-f81c079f5cf7	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Caja/Empleados\nBase: Arroz\nToppings: Tocineta, Chips de arracacha\nProteína: Pechuga de pollo\n__unit_price__:6000
f2c2fc7a-7a8c-4e1c-8fd9-d674d3a0d003	e6982d0b-53a0-4dce-b98d-45c8f56ade88	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Queso feta, Cebolla encurtida, Tocineta\nProteínas: Pechuga de pollo
258176b8-455a-4d4e-ab39-90440e77a8dc	e6982d0b-53a0-4dce-b98d-45c8f56ade88	1bee1de0-2321-4e6e-a97e-05fd409ec1bc	1	\N
df0e8f89-0296-4c0a-9c26-f115dd6f1ad4	ed0fb156-f5c4-42da-970f-95bf45e06240	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Pico de gallo, Tocineta, Guacamole\nProteínas: Pechuga de pollo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
0649e0e5-9dc5-4471-95d3-3957481ff9cf	997730fc-a9a4-4da2-834c-b7d990ccfced	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Champiñones, Pico de gallo, Guacamole, Tocineta\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
eb44ebbb-d2de-46eb-a4c0-32db83b839e6	b6f72ece-dde3-4ea9-ae2d-f9adcab8ac6d	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	2	\N
236e125d-ce3a-4427-8f7d-686e9057cab4	c3162195-9dcf-46b0-8256-be9e0247f069	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
6a008228-a492-4c57-acc1-dadcdacc8eed	f16660d3-0e29-4d3d-bc76-7c7cecce0c19	36d50cac-2255-4963-b89a-6d7e29450faf	2	\N
33033808-60ea-4d4e-ac79-3438b017ded5	f16660d3-0e29-4d3d-bc76-7c7cecce0c19	84ce9a61-d186-47cb-92b4-afa4d5847dab	2	\N
96156275-2a60-4391-8eef-336b5ff260d0	5c81b4ab-cbda-4cac-a46f-832775d3dafa	36d50cac-2255-4963-b89a-6d7e29450faf	2	\N
aa201114-7bff-4522-a3de-183444495b1b	5c81b4ab-cbda-4cac-a46f-832775d3dafa	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
94db725e-c5f6-4df9-81dc-6e3998ca2699	f0471a9f-6da1-4b7c-a7b6-b10ba959d623	b68386e8-b73e-422b-a5b6-47d622faac19	1	\N
47af09d2-a1f9-4d46-8e54-1c3ff4a5fadc	f0471a9f-6da1-4b7c-a7b6-b10ba959d623	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Arroz\nToppings: Maíz tierno, Guacamole, Tocineta, Queso feta\nProteínas: Carne desmechada
56b54fe4-1541-40ab-a2c8-74bfec524f4e	e8f1a985-a8e8-4b9e-9666-1a498383b9bb	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
c82be84c-8199-4c9d-8773-b02cdc3cfcd7	14b8a0d3-4e57-47c3-95c2-9e9953253a06	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Guacamole, Tocineta, Pico de gallo\nProteínas: Carne desmechada
71e57c14-d5a3-4c13-a142-355e2700c6fa	14b8a0d3-4e57-47c3-95c2-9e9953253a06	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Chips de arracacha, Maíz tierno, Guacamole, Queso feta\nProteínas: Carne desmechada
8d22c788-c689-4438-97d1-6e078bcf3935	14b8a0d3-4e57-47c3-95c2-9e9953253a06	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Guacamole, Tocineta, Chips de arracacha, Maíz tierno\nProteínas: Carne desmechada
e700877b-8d02-43a9-a46a-aa0ff2533d97	1aa55f02-eebf-4a32-8f23-5ca4e8d33b67	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Champiñones, Tocineta, Guacamole, Queso feta\nProteínas: Pechuga de pollo
6f5211ed-2a91-4491-b34d-bbe16ea4b2f5	1aa55f02-eebf-4a32-8f23-5ca4e8d33b67	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Tocineta, Champiñones, Guacamole\nProteínas: Pechuga de pollo
2f96adbf-9d16-4e0a-a3c9-406b0c1855b0	1a0caa2a-5de7-4f62-8b1f-ab9c8477b8af	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Champiñones, Tocineta, Zanahoria, Chips de arracacha\nProteínas: Pechuga de pollo, Atún\nAdición proteína (Atún): +$ 1.500\nProteínas adicionales: +$ 5.000\n__unit_price__:22500
d6112030-e42f-4fcc-b19f-4ccb08a4eb52	7da4d87b-2602-42a7-818e-36e424a65234	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
e4fe431a-6df0-4669-bfdc-ad7fa432db66	7da4d87b-2602-42a7-818e-36e424a65234	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
17e81205-eee7-499c-87c7-5819a5621a7b	f6b7a3ff-1eb3-45a8-9016-421a2ea40578	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Champiñones, Maíz tierno, Guacamole\nProteínas: Carne desmechada, Pechuga de pollo\nProteínas adicionales: +$ 5.000\n__unit_price__:21000
a8a5f228-baf7-4cb9-a594-29e9036c3a20	051dbcfd-8188-4bf1-96fc-1e3f2401116c	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
01e322a5-4639-460a-804f-2a63fb04bee1	5036e4d6-ad1a-41ae-b07e-eca906087ffc	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Pico de gallo, Pepino, Maíz tierno\nProteínas: Pechuga de pollo
9fb8844b-74d3-40a4-8275-c02b976eee25	d63129da-c7c5-4960-8bc1-fe0bd73d7ef6	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Chips de arracacha, Tocineta, Maíz tierno\nProteínas: Carne desmechada
46fcba52-8161-4995-97ac-9400b852d313	2aa345e7-e029-4c79-8978-d4b4dfb684dc	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Guacamole, Tocineta, Chips de arracacha\nProteínas: Carne desmechada
92103523-e54e-4851-80c0-95af8570c38a	d1bd9e76-2d4d-4113-b6a7-efc73b9ea725	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
9065dd36-a608-45df-8ccd-cd12dcef7b48	d1bd9e76-2d4d-4113-b6a7-efc73b9ea725	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
ac0ba5d6-8de2-4b06-8d97-7adbf9f7b5d3	29410a76-8b20-408c-b760-2bf3b1978f28	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Guacamole, Tocineta\nProteínas: Pechuga de pollo
baaa5559-3230-488e-96a0-f98715494295	51488d76-f244-48cc-9e9a-9b38e8b99911	87eb7166-053d-4739-9511-ff90b826ada6	1	\N
310fb501-5176-47f0-867a-7732a381d2fc	b94d57cc-07f5-4404-a15f-e4d7fe04d3f7	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
02562742-3747-44d9-9afa-e1dd7a9a6f5c	b94d57cc-07f5-4404-a15f-e4d7fe04d3f7	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Tocineta, Pico de gallo, Guacamole\nProteínas: Pechuga de pollo
af472476-6da3-4eb9-ba38-de703bc59ee0	b94d57cc-07f5-4404-a15f-e4d7fe04d3f7	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
ee881ac6-abde-47d4-84f8-0bfb33f377ff	b31ef09a-a3a0-467f-9e8c-bb30adf05f13	1bee1de0-2321-4e6e-a97e-05fd409ec1bc	1	\N
3717b6e0-fc54-4226-abbb-a4752f4f53e0	b27137dc-ef39-4545-83a5-7f40ae2397aa	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Queso feta, Guacamole, Maíz tierno, Champiñones\nProteínas: Pechuga de pollo, Carne desmechada\nProteínas adicionales: +$ 5.000\n__unit_price__:21000
bd8c7de1-b618-4daf-86b4-d9cc038337e2	e4b0564d-b370-4d3b-99c3-8be220bfcf6e	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
1bf21dcc-d0bb-44bc-8f04-807ab9b2e471	57f8275c-3e96-42fb-8a01-f90aeea5453c	1bee1de0-2321-4e6e-a97e-05fd409ec1bc	1	\N
b8c90c38-6bad-4ff5-ac96-f8c6e7eba9b0	57f8275c-3e96-42fb-8a01-f90aeea5453c	fa107d92-d59b-4686-b51f-7df33766c361	2	\N
e85b5b2e-00a7-4b0c-885b-dde31b880a50	48ca3642-d9dd-4b67-a1fd-d8df25df8656	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
edf83eef-d056-4f8b-a19b-fc2b9c1627d0	48ca3642-d9dd-4b67-a1fd-d8df25df8656	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
be70349a-1bf1-4fb0-9086-a609b5c67b44	e79fd162-f352-40d5-af82-6630ad928fc4	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Guacamole, Tocineta, Pico de gallo, Chips de arracacha\nProteínas: Pechuga de pollo
e1aa6b07-2d72-4dc8-83aa-4b45704c6339	e79fd162-f352-40d5-af82-6630ad928fc4	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Pico de gallo, Guacamole, Tocineta, Champiñones\nProteínas: Carne desmechada
59c592e4-f70d-4960-b825-612687a15114	e79fd162-f352-40d5-af82-6630ad928fc4	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
b9b7462f-a432-4f92-aa66-7cc634b63c6d	e79fd162-f352-40d5-af82-6630ad928fc4	1bee1de0-2321-4e6e-a97e-05fd409ec1bc	1	\N
c5a7b658-0851-4d7b-9a4f-15d471080d1f	8d6a5325-6871-42a0-a7ec-622f5637e7cb	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Champiñones, Tocineta, Guacamole\nProteínas: Pechuga de pollo
aae11422-d8c4-4951-a400-ef2904b1df7b	8d6a5325-6871-42a0-a7ec-622f5637e7cb	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	2	\N
7da8060c-c9b3-4585-ab52-4f4e75b559c1	8d6a5325-6871-42a0-a7ec-622f5637e7cb	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Tocineta, Pico de gallo, Maíz tierno, Guacamole\nProteínas: Carne desmechada
09231ee3-2805-47f7-856b-d663ebd359cc	8d6a5325-6871-42a0-a7ec-622f5637e7cb	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Maíz tierno, Pico de gallo, Guacamole, Tocineta\nProteínas: Carne desmechada
44f3deac-6081-4a72-a8c0-e3023bebb8d3	e0a91e3b-682d-4667-9023-8b324dcaf8c8	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Tocineta, Maíz tierno, Pico de gallo, Guacamole\nProteínas: Carne desmechada
e9c28104-9697-422f-8143-60ec2d0da676	d43135f2-0fee-4f0e-92ab-f69cfc4bb15a	a6180a54-dcea-4af5-a873-455b03618324	1	\N
f8258d32-6abd-42f9-8095-0470f775e249	30d52eb4-3acd-453e-a9f4-f89bb269c87e	1bee1de0-2321-4e6e-a97e-05fd409ec1bc	1	\N
01992e79-633b-44ef-a5ae-3404ef9d1aec	30d52eb4-3acd-453e-a9f4-f89bb269c87e	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
5ad4335b-0191-411f-a3b2-1fc86f1c735d	28b971dd-0e71-4f7a-ae85-c35acfe90a91	996be55c-5666-42fd-bb8b-4ef44cd82194	1	\N
9dc6ff27-3e50-40f8-85e3-49a1a51ecf92	28b971dd-0e71-4f7a-ae85-c35acfe90a91	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
5c434331-6abd-4106-adb7-d9c168c44b9d	404ae363-5bcd-475c-95c6-9962a034945c	1bee1de0-2321-4e6e-a97e-05fd409ec1bc	2	\N
1396919a-cd0c-4ca0-a04e-861540861a8d	404ae363-5bcd-475c-95c6-9962a034945c	522d937d-7d2d-4c3a-b785-f692a09b8a37	1	\N
59df8e40-9471-445b-9c43-94dfa1eb6b45	404ae363-5bcd-475c-95c6-9962a034945c	fa107d92-d59b-4686-b51f-7df33766c361	1	\N
507d8ce4-3d0f-4c7e-a2d5-f5d1383404fb	e5787a0e-0aa9-4dde-ac36-e87458c15bbd	a923676d-77da-4843-9df2-8eb637965cb4	1	\N
1ea07157-ddec-4614-9dc9-f9350ae73701	c26bf666-0181-46b8-92a3-daf0c5f0acdb	1bee1de0-2321-4e6e-a97e-05fd409ec1bc	1	\N
bb4a1ae7-2a15-4cb9-aeed-3d7a9ae8590e	70f29d82-64c2-4f98-aefd-54f9ee9d1300	a60362be-1697-427a-9786-5463366d338a	2	\N
924e9b97-561a-467a-8edd-24de0ccb592c	8555f6f7-16cb-4b8a-9ece-b8c2e8419c3b	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	\N
c6090ad2-b939-43aa-88e0-da2a9c9ab0e2	8555f6f7-16cb-4b8a-9ece-b8c2e8419c3b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Champiñones, Zanahoria, Guacamole\nProteínas: Pechuga de pollo, Carne desmechada\nProteínas adicionales: +$ 5.000\n__unit_price__:21000
041a2d3b-b28a-4cde-8644-934f52bf6c50	bd9a0c41-19f0-4db9-88dc-a666cf207342	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Guacamole, Tocineta\nProteínas: Carne desmechada
e048ae2b-0b2f-4759-b7e9-0335b34956a7	cba2133d-aacf-4854-a8df-bae2b26d221a	87eb7166-053d-4739-9511-ff90b826ada6	1	\N
0d2f9b0c-d1d7-4e7e-8fdf-7376a3591417	2cb28d84-4321-4994-aff6-a0f5cbffa23c	23e07c8e-29a2-4a0b-9456-c340810b3fe8	1	\N
66bbe072-4e19-4836-a12d-94f552257741	2cb28d84-4321-4994-aff6-a0f5cbffa23c	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
b542f6df-72b0-45dc-a995-6673ac413ed9	e42017fb-1432-4173-a704-d3121a3f6ed8	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
a67006dd-e521-4272-88e1-32ce3cfe8c07	29ce2099-a354-4d5b-9d47-69a51187536d	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Pico de gallo, Guacamole, Champiñones, Tocineta\nProteínas: Carne desmechada
02598ee4-4219-4660-aace-626e3a27b88b	3e4623ea-c50e-427d-9c0b-0ba369aace49	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Champiñones, Guacamole, Zanahoria, Maíz tierno\nProteínas: Pechuga de pollo
c851fe88-c60e-4ce5-9d5f-af9d8e897750	3e4623ea-c50e-427d-9c0b-0ba369aace49	7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	1	\N
e0186ba0-c337-4f1f-9202-b57b7ca54a92	3e4623ea-c50e-427d-9c0b-0ba369aace49	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
c9dc76da-5ec6-46f8-bc08-0c242d90f8e4	ce50bc6e-5954-4272-ad93-d2c1949a55f9	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Guacamole, Zanahoria, Maíz tostado, Tocineta\nProteínas: Pechuga de pollo
03313518-957d-4db6-b848-37cbb1b306db	98f8a408-c48f-4484-bebe-dd0e89e8d479	36d50cac-2255-4963-b89a-6d7e29450faf	1	\N
bd9aab8a-e3de-4288-90dc-e9ffe04595f1	98f8a408-c48f-4484-bebe-dd0e89e8d479	23e07c8e-29a2-4a0b-9456-c340810b3fe8	1	\N
a11270b2-664a-4ffc-931a-4c8890b6eec6	b18be600-73a6-4c1e-9439-a183c7b8344b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Champiñones, Chips de arracacha, Tocineta\nProteínas: Carne desmechada
5a6c700d-6449-47a4-8a5a-cb44889f5045	b18be600-73a6-4c1e-9439-a183c7b8344b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Arroz\nToppings: Maíz tierno, Tocineta, Pico de gallo, Chips de arracacha\nProteínas: Carne desmechada
67086be3-dbf9-4aa6-9616-38797b17cc5b	b18be600-73a6-4c1e-9439-a183c7b8344b	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Tocineta, Pico de gallo, Maíz tostado\nProteínas: Carne desmechada
24f0804a-92a5-4e61-b0a9-95bed2f3579c	51764198-f413-49f5-a758-dbbc421ed1f6	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Champiñones, Pico de gallo, Guacamole\nProteínas: Pechuga de pollo, Carne desmechada\nProteínas adicionales: +$ 5.000\n__unit_price__:21000
920d5657-4a94-49c9-80a1-a0d71c1458e7	97e8ec60-7c5e-495f-b480-3ed622693759	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Guacamole, Tocineta\nProteínas: Carne desmechada
12f8fc5d-fce7-481c-a39d-f499744dd7d4	57f5398d-1efd-44d5-a141-a6f14cf30f1e	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Caja/Empleados\nBase: Arroz\nToppings: Guacamole, Queso feta\nProteína: Carne desmechada\n__unit_price__:6000
211d4854-3f9b-4fb2-ae93-1d03dc95c164	ce9c540d-26e2-414d-9515-5d5ae8f589b5	20cc1e0f-330e-42b7-b8b9-05c1069d7682	1	\N
9a3aadcc-9819-4d24-8215-39fef26040f1	ce9c540d-26e2-414d-9515-5d5ae8f589b5	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	__unit_price__:9000
8979f30d-43da-4e18-b450-ead388e2aab2	31e9410d-faa8-4bd1-97db-75e95f2293e2	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	3	\N
1fc3617f-65f0-4805-965a-f8e16b907230	31e9410d-faa8-4bd1-97db-75e95f2293e2	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	\N
94bce65d-5331-428a-9f62-4bdb67d2de0a	31e9410d-faa8-4bd1-97db-75e95f2293e2	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
ea01e22c-5335-4b3f-b87b-da5e75d918d1	886907f5-46c2-4aca-bfb5-e5c3207dd2da	ed74f62f-d2d3-4cf1-a688-dc615363f8c9	1	\N
082fb7ec-d52f-4b31-9502-da7141b0d346	886907f5-46c2-4aca-bfb5-e5c3207dd2da	890a38ce-311d-45f0-b602-f10798189185	1	\N
6862dd4c-e824-4fe3-8516-6e699a07764b	fb1d57b3-a86a-4dd9-aa4e-39968e1c610f	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Champiñones, Pico de gallo, Guacamole, Pepino\nProteínas: Carne desmechada
acfdcfd6-7966-4374-8bd8-31d314459955	fb1d57b3-a86a-4dd9-aa4e-39968e1c610f	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
1de68530-0920-4eae-a44c-6da555fbb71a	0a25155b-77b3-47f6-ae3d-ce030f0e018d	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Champiñones, Maíz tierno, Tocineta, Queso feta\nProteínas: Carne desmechada
fc2c8d64-0f45-4835-98b1-ea878f8aa2fd	018b1c5f-73cf-410e-9ea1-73ecd9dbead4	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Guacamole, Tocineta\nProteínas: Carne desmechada
079b2665-45ea-40be-8a55-37ea5d9c8503	aecf9d96-0efb-4500-8388-bd303f31b702	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Maíz tierno, Pepino, Zanahoria, Tocineta\nProteínas: Carne desmechada
cf2c6a17-a869-49a0-a775-501e0a354fed	aecf9d96-0efb-4500-8388-bd303f31b702	2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	1	\N
1641ccfb-6549-4e0a-9b46-43cd0e23ccd2	27601b6a-30e6-48a0-86f7-87b13bae3fa2	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Maíz tierno, Tocineta, Pico de gallo, Guacamole\nProteínas: Jamón de cerdo
ef2d913e-173b-48f1-918a-cc463243daf2	27601b6a-30e6-48a0-86f7-87b13bae3fa2	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Maíz tierno, Chips de arracacha, Pico de gallo, Queso feta\nProteínas: Jamón de cerdo
8f9a9f1e-9e66-49d5-a26b-453aedcac735	27601b6a-30e6-48a0-86f7-87b13bae3fa2	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Champiñones, Queso feta, Pico de gallo, Tocineta\nProteínas: Jamón de cerdo
3407400e-26db-492f-9f67-87c4ef15debc	9c55c61f-a3c9-4d2b-995c-4dde837cb1d5	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
3b04ed39-6afc-4902-a7f4-bbbb9735f5c0	0fe8eec9-3b82-4cf2-b44c-85ce29018b00	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Champiñones, Zanahoria, Guacamole\nProteínas: Pechuga de pollo
a494cc67-cc3f-4be5-a4f0-9912159fe7bb	0fe8eec9-3b82-4cf2-b44c-85ce29018b00	7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	1	\N
348b7a19-babb-4548-9431-fc9b1ecf4d8b	0fe8eec9-3b82-4cf2-b44c-85ce29018b00	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
7218562d-ddba-4696-b85e-939abf51c295	05633695-a81f-42ab-bf74-6ddfd8068467	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta, Quinua\nToppings: Tocineta, Maíz tierno, Chips de arracacha, Guacamole\nProteínas: Carne desmechada
7730f637-c494-486a-81e1-772821e7937d	05633695-a81f-42ab-bf74-6ddfd8068467	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Tocineta, Maíz tierno, Chips de arracacha, Guacamole\nProteínas: Carne desmechada
e29b35fb-6c58-436d-9e03-18f41b681623	75e49461-39d8-495d-ad51-ab7ec90c57f7	fb3263d0-06b3-436c-be4e-1acac2ef9dba	1	\N
8594a5ca-9a37-48cb-aabb-08c95486b9da	676047eb-8275-47f0-a2a8-07f51ef78354	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Guacamole, Tocineta\nProteínas: Carne desmechada
840ce1a0-fd43-4dad-8206-fdc4b6392a5a	332c0914-2aa5-4c71-be97-ef1f0d8d8ac8	fb3263d0-06b3-436c-be4e-1acac2ef9dba	1	\N
71822fb2-99ad-4743-a3f0-d0e9dfe60bbb	332c0914-2aa5-4c71-be97-ef1f0d8d8ac8	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
9ed8dc04-5010-4917-b497-c07c5d26d9fb	384dc9b7-d882-4590-88da-c4d5e63e743c	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
1ae4d6b1-34c8-4156-8636-bb3f0b4553c4	384dc9b7-d882-4590-88da-c4d5e63e743c	d4f6e89a-8cbe-4ecd-b524-b731b1223b24	1	\N
32d226f1-1e1b-4fe8-9035-fd5b5027afcd	384dc9b7-d882-4590-88da-c4d5e63e743c	c3704705-037f-40c4-976c-d0576e944b21	1	\N
82e81990-5241-4f42-bd36-c6150ea28bda	1e0cfa1a-49bc-4d67-810e-582d0c60c85d	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Quinua\nToppings: Champiñones, Guacamole, Maíz tostado, Pico de gallo\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
35e3d6d1-c84a-4a84-ab0e-db0274d09332	1e0cfa1a-49bc-4d67-810e-582d0c60c85d	7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	1	\N
d778f21c-8258-4f97-8e65-92b618d84fcb	3b953c72-e6ad-42ad-b7d0-415e608e2b8c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Guacamole, Tocineta, Pico de gallo, Champiñones\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
1120925b-69d5-4145-abb8-a643b67bfbcd	3b953c72-e6ad-42ad-b7d0-415e608e2b8c	3bb93296-c6c5-456a-b165-73c1a20a3134	1	\N
938e68de-9386-47b5-adc9-b2f02ccf2dbd	3b953c72-e6ad-42ad-b7d0-415e608e2b8c	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tostado, Guacamole, Pico de gallo, Tocineta\nProteínas: Carne desmechada
74b32276-7d45-400e-957f-fb2969420227	0735f4c1-3ba2-4b0b-a864-8cb242ff4773	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Champiñones, Tocineta, Guacamole, Queso feta\nProteínas: Carne desmechada
52885809-350b-43ed-a137-d26cbfa7ac79	0735f4c1-3ba2-4b0b-a864-8cb242ff4773	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
b299a15b-565b-428d-abe5-e4134255eb6d	f11c357b-914d-4ffb-a17b-df5b971eec82	b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	1	\N
e9800363-45f5-4f96-b51f-40ad55a6e807	f11c357b-914d-4ffb-a17b-df5b971eec82	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
e0d4671e-d989-441a-9797-17da6409013b	2b12b070-78de-472d-b41a-4696f10f3924	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz\nToppings: Champiñones, Pico de gallo, Guacamole, Queso feta\nProteínas: Pechuga de pollo
8890d140-75e9-4094-98c0-c8b76183540f	74375328-042d-483c-a89e-f887c8818daf	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Pasta\nToppings: Champiñones, Tocineta, Maíz tierno, Zanahoria\nProteínas: Pechuga de pollo\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
0f8f9a80-0883-4a4e-8230-6bb27a3594bc	b4f19e2f-7582-4cab-a2b1-ee3d25b59013	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Champiñones, Pico de gallo, Guacamole, Zanahoria\nProteínas: Carne desmechada\nCombo bowl (+$ 1.000): incluye bebida\n__unit_price__:17000
0742a2d7-725e-4968-962c-2fc4642a11bb	f44d40bc-5a5b-4a34-ba51-fe6faa781665	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Pasta\nToppings: Maíz tierno, Pico de gallo, Guacamole, Tocineta\nProteínas: Pechuga de pollo
78f20c9b-882b-4d56-aff0-1ce0a614f8fa	e5c25b37-e228-4aea-9c72-0735b963cd6d	114e2c84-cf03-47a9-abae-b3edd6911ded	1	Bases: Arroz, Quinua\nToppings: Zanahoria, Champiñones, Pico de gallo, Maíz tierno\nProteínas: Pechuga de pollo
321a15a1-0f8c-40c0-b50c-9626e6c8deb9	e5c25b37-e228-4aea-9c72-0735b963cd6d	bbe7a283-40e4-4d35-bac2-1aa7423a4058	1	\N
78cb2d04-5ffc-4fff-8cc9-f45cdda06394	e5c25b37-e228-4aea-9c72-0735b963cd6d	35a41129-ef96-43e6-8ebc-7c14c4d26605	1	\N
bf246439-5824-4c70-84e8-d9464cb086fa	e5c25b37-e228-4aea-9c72-0735b963cd6d	c7572bb3-01f8-4c66-a3e3-0c262093761c	1	\N
2ec12acb-3848-4d73-96e0-10919125f4f3	f62be11e-248a-4bcd-928a-8b61e4fc52ae	d91e4dd0-47a5-46fc-bf29-35b764305016	1	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."users" ("id", "username", "email", "created_at") FROM stdin;
\.


--
-- Data for Name: product_suggestions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."product_suggestions" ("id", "user_id", "product_name", "image_base64", "created_at") FROM stdin;
\.


--
-- PostgreSQL database dump complete
--

RESET ALL;
