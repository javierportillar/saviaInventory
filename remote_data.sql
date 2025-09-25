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
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."customers" ("id", "nombre", "telefono") FROM stdin;
eaa07600-d0f1-452a-ae7b-6ad8b58f24c4	Javier	3105046328
ebd3c2f8-065f-4a44-8d53-330d736d9647	Briyith	3046319664
0cf14e74-a586-47c8-8d24-52547bdd464b	Miguel	3014853312
1f21b2a6-02db-41be-95ec-4e13a6cb6942	Gloria Rosero	3014128705
445fa2d2-94bc-4ec1-9ae8-928be375b5b7	Karol Bastidas Mora	3116280277
\.


--
-- Data for Name: gastos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."gastos" ("id", "descripcion", "monto", "categoria", "fecha", "metodopago", "created_at") FROM stdin;
786efe72-4b29-4a12-8e2a-e1bcb4d5baac	Uvillas	3800	Ingredientes	2025-09-23	efectivo	2025-09-23 16:15:56.054+00
c5b7b0c0-9409-4c07-ab55-d16be77c8091	Panela	2900	Ingredientes	2025-09-23	efectivo	2025-09-23 16:16:22.3+00
b82e5b20-bbe7-448b-be66-e363cc409a36	Champiñones	28000	Ingredientes	2025-09-23	efectivo	2025-09-23 16:42:57.777+00
b9a97ba9-60c1-4898-bdfb-22f1b4da4446	Aguacates	12000	Ingredientes	2025-09-23	efectivo	2025-09-23 20:16:30.334+00
5f05c3e1-2cf2-4808-bc86-946cf5917809	tocino	56000	Ingredientes	2025-09-23	efectivo	2025-09-23 21:14:21.525+00
da87fdde-20a3-427f-83e6-df461b56e6dc	kiwi	11500	Ingredientes	2025-09-23	efectivo	2025-09-23 21:29:44.268+00
729fd5d2-8d73-4035-8237-0e6de80f91e8	leche andi	24900	Ingredientes	2025-09-23	efectivo	2025-09-23 22:54:53.109+00
9ac3936a-d9e1-4e86-9bee-ef53da1dfe82	Quajada	12000	Ingredientes	2025-09-23	efectivo	2025-09-24 00:45:47.668+00
1f5ecb57-fa8c-4c33-9df3-bbdd20b6cd27	Cilantro	1000	Ingredientes	2025-09-23	efectivo	2025-09-24 00:46:12.594+00
3927a6f7-c003-49af-bfe4-19f537b10f2e	Pan Sandwich	19600	Ingredientes	2025-09-24	efectivo	2025-09-24 16:29:44.727+00
b960b12c-e282-4469-9a47-64dc29f813ec	Aguacate	12000	Ingredientes	2025-09-24	efectivo	2025-09-24 16:29:56.847+00
1d5e34ad-9dce-4ebd-887d-2e519e5bb99a	Champiñones	17600	Ingredientes	2025-09-24	efectivo	2025-09-24 16:42:13.324+00
4e2b6c5a-f72a-48b1-825f-fbde0061c282	Toalla Cocina	3600	Ingredientes	2025-09-24	efectivo	2025-09-24 17:00:30.732+00
cbe0a98e-aec8-4d57-9e96-de8d09a60318	Servilletas	4500	Equipos	2025-09-24	efectivo	2025-09-24 17:05:56.868+00
4236d432-643a-442a-9e08-2eb3c91bc998	Desengrasante	6300	Equipos	2025-09-24	efectivo	2025-09-24 17:06:34.546+00
6b1e2490-4125-46a4-917f-56d548641bbd	Aceite	12600	Equipos	2025-09-24	efectivo	2025-09-24 17:06:56.866+00
7534af85-7297-4a68-8412-765381d91c52	Domicilio	6000	Transporte	2025-09-24	efectivo	2025-09-24 20:22:09.817+00
46d89c96-3208-413a-8247-4f6e96d25016	Queso Crema	13200	Ingredientes	2025-09-24	efectivo	2025-09-24 20:37:06.07+00
1e81aa05-d1c8-478e-a033-d75529542c08	Champiñones, Limón Taití	26600	Ingredientes	2025-09-24	efectivo	2025-09-24 16:31:29.077+00
a7a967dc-07d8-401e-baaf-7ed1aa9ada65	Quesillo	12000	Ingredientes	2025-09-24	efectivo	2025-09-24 16:31:53.753+00
8091d6bc-85c8-481c-b646-4c888d050415	Pollo Belén	56000	Salarios	2025-09-24	efectivo	2025-09-24 16:42:50.877+00
71a698a0-ed2d-4ddd-86fa-b4e087c7eda3	Carne	56000	Ingredientes	2025-09-24	efectivo	2025-09-25 01:02:35.389+00
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."orders" ("id", "numero", "total", "estado", "timestamp", "cliente_id", "metodopago") FROM stdin;
68f500ad-bb4e-4328-9d2a-9bcda8a7d6b0	1316	11000	entregado	2025-09-23 02:42:31.889+00	\N	tarjeta
4157c111-1cd4-4731-9e23-79474160c9e8	4075	15000	entregado	2025-09-23 02:44:54.501+00	ebd3c2f8-065f-4a44-8d53-330d736d9647	tarjeta
32369dfb-eef0-4209-9ced-9e6b6f1e381e	7020	24500	entregado	2025-09-23 19:41:06.891+00	\N	nequi
b88ba1fa-6f2a-4a1a-bbeb-1ef46feb7dcf	8658	15000	entregado	2025-09-23 02:49:22.582+00	\N	nequi
ae2bebca-571e-4c07-8670-757db996718d	4082	30000	entregado	2025-09-23 18:18:46.906+00	\N	nequi
9cda329f-736a-45a1-b779-94967eef478f	5496	19000	entregado	2025-09-23 15:21:31.422+00	\N	nequi
23eb2329-0c5e-4088-8fb3-36715c1d1f4c	5828	23000	entregado	2025-09-23 02:50:09.688+00	\N	nequi
dea8fbf9-2118-4343-ac86-f71661501468	1849	11000	entregado	2025-09-23 22:14:30.902+00	\N	efectivo
5d597deb-c39d-48b8-bb7c-d6e593929397	1486	14850	entregado	2025-09-23 02:53:28.179+00	\N	nequi
4ace7a39-1bb7-4837-b544-20479ecfaac2	4153	18500	entregado	2025-09-23 02:33:48.579+00	\N	efectivo
d6a104ee-86fe-47e2-976d-47a99d172ced	8055	15000	entregado	2025-09-23 02:39:52.207+00	\N	efectivo
0e99f28d-a472-4ab9-b6f9-0c898b40ba88	2822	13000	entregado	2025-09-23 03:00:33.433+00	\N	nequi
c8cde86a-df1e-47ef-8c13-d8468a25f3eb	2931	8000	entregado	2025-09-23 02:39:01.637+00	\N	efectivo
de7f4770-191d-4b57-ad9c-6468b2a0d51a	4041	14500	entregado	2025-09-23 02:38:12.886+00	\N	efectivo
9040b73f-77bf-427b-b0c2-1bb2526c0086	6654	68000	entregado	2025-09-23 17:56:15.141+00	\N	nequi
842fbc54-bda1-4b20-957e-85d656cc4a3e	1008	44650	entregado	2025-09-23 03:05:44.733+00	\N	nequi
9d69b9cb-eda1-4d32-83a8-2a602a794389	3278	18500	entregado	2025-09-23 02:30:25.898+00	\N	nequi
9570fce9-c17a-479b-a87c-40d2bcf40312	5956	39000	entregado	2025-09-23 16:22:06.936+00	\N	nequi
5cb52fcb-f91e-49c0-939a-a4dfe0d1cb58	6555	8500	entregado	2025-09-23 03:07:18.259+00	\N	nequi
63195593-a2c9-41a3-887c-a129e1cdd976	7325	4000	entregado	2025-09-23 02:40:09.265+00	\N	efectivo
270cb9c3-9278-47e2-89b9-36492b584e9c	5954	10500	entregado	2025-09-23 02:40:01.078+00	\N	efectivo
c0b4015d-a729-4c9e-a220-cd6bb9b002f7	7287	15000	entregado	2025-09-23 02:41:36.806+00	\N	efectivo
7d385443-f410-4453-8e1d-9133ccfc279f	3468	18500	entregado	2025-09-23 02:41:45.515+00	\N	efectivo
507f5e77-20a2-4f77-8394-6bccf0eff0a2	9099	15000	entregado	2025-09-23 02:42:00.462+00	\N	efectivo
c816883c-1811-416f-bb80-92ac3ff8d711	6424	29500	entregado	2025-09-23 02:31:16.703+00	\N	nequi
529b3152-2ab2-4e97-9e1d-bd9a3ab0975e	1539	16000	entregado	2025-09-23 16:54:26.033+00	\N	efectivo
15cbe337-b663-447c-86e5-c1cca381e249	7311	30000	entregado	2025-09-23 18:55:31.63+00	\N	efectivo
1ca8ba41-cc65-425c-b4f1-3ddae293522d	6564	15000	entregado	2025-09-23 20:05:51.711+00	\N	efectivo
3d487325-f935-4c40-9e2a-236592e67b56	3767	34500	entregado	2025-09-23 02:41:11.974+00	\N	nequi
9c872a93-c09f-4346-9c46-0883e8fdf576	4070	30000	entregado	2025-09-23 17:30:14.34+00	\N	nequi
25cecc96-c8e5-4e72-a78c-58fc76f1230e	3840	76000	entregado	2025-09-24 15:40:52.49+00	\N	nequi
7535363c-d10d-4d35-abdc-4eae97bd274f	3087	17100	entregado	2025-09-23 19:18:31.092+00	\N	efectivo
f361c481-118d-4e72-8658-058715d72db2	7940	40000	entregado	2025-09-23 17:33:56.797+00	\N	nequi
9a09e837-cc60-4521-bdfb-790fe3ec15f1	9507	15000	entregado	2025-09-23 02:44:54.992+00	ebd3c2f8-065f-4a44-8d53-330d736d9647	efectivo
b4d33059-dfdb-43af-94b8-c04e0a270161	1581	16000	entregado	2025-09-23 02:50:41.825+00	\N	efectivo
615f8381-992b-4d15-8313-899413b973fb	9788	56500	entregado	2025-09-23 02:51:15.847+00	\N	efectivo
0168c10e-c788-426c-b706-3c57300c52f1	9573	12000	entregado	2025-09-23 02:51:34.408+00	\N	efectivo
c5be6c87-d4d6-40a4-afa5-edb12ae9365f	4875	6000	entregado	2025-09-23 02:51:44.157+00	\N	efectivo
6b96efb7-0e92-4bc4-87fe-0e95a4e561da	4479	41000	entregado	2025-09-23 19:55:01.813+00	\N	efectivo
1529133b-90d2-498e-a089-11ee20022e23	8794	31500	entregado	2025-09-23 02:52:47.7+00	\N	efectivo
a064c078-e503-4588-9f1a-5833ab74af57	2777	18500	entregado	2025-09-23 02:53:09.171+00	\N	efectivo
c26ad814-d661-426f-905b-9e1d7db637c2	4598	29850	entregado	2025-09-23 19:02:33.313+00	\N	nequi
5879eaea-d972-4277-a405-30978f25166e	7065	8000	entregado	2025-09-23 18:01:20.697+00	\N	efectivo
64fa9dbc-f255-415a-b34f-a27d3332157b	2356	50250	entregado	2025-09-23 21:58:03.026+00	\N	nequi
c83d1ab6-6390-4786-848a-094e60de15cd	1008	32000	entregado	2025-09-23 17:48:10.079+00	\N	nequi
d2c2ebe9-f796-4351-9134-5b03641020e9	2120	23500	entregado	2025-09-24 00:24:15.887+00	\N	tarjeta
c84e0bb3-b3d4-478b-b76f-b27a105878ba	8914	35500	entregado	2025-09-23 20:23:18.243+00	\N	nequi
b0d9be7c-102e-4bfb-a027-33a1cd9996ea	9353	26500	entregado	2025-09-23 03:31:33.253+00	\N	nequi
fd5de209-af3b-4a6e-8bb8-f0876ae61b11	1941	15000	entregado	2025-09-23 17:47:16.815+00	\N	efectivo
eeff4778-0520-48ff-8e11-55787643ec39	4686	11500	entregado	2025-09-23 22:17:54.69+00	\N	efectivo
cb353b71-1ebb-4704-88e2-e1bc53cbe1cb	8991	69500	entregado	2025-09-24 01:21:35.432+00	\N	nequi
75f77883-a796-4df2-9bd8-d4bd423c0c1f	4795	16000	entregado	2025-09-23 19:28:08.654+00	\N	efectivo
00778b23-695c-48f2-92ab-b3742b61b855	6262	14850	entregado	2025-09-23 19:38:05.199+00	0cf14e74-a586-47c8-8d24-52547bdd464b	tarjeta
7022e0a3-2a51-4cb6-beb7-4e6587e0eb9d	9775	27500	entregado	2025-09-24 16:02:40.922+00	\N	efectivo
cee5fc2e-f3c2-4cc1-afd8-686b6d303a7c	7139	54500	entregado	2025-09-24 00:22:08.627+00	\N	nequi
4dcdbf9e-9136-491c-986f-401f60bdaf58	9692	8000	entregado	2025-09-23 21:55:38.929+00	\N	nequi
07fdd121-94d2-43e8-b856-44e10ae325a8	1768	14000	entregado	2025-09-23 22:49:31.422+00	\N	nequi
311ae63b-e7c6-4022-98ff-f059b7255029	5584	8000	entregado	2025-09-24 01:34:07.282+00	ebd3c2f8-065f-4a44-8d53-330d736d9647	tarjeta
6d5ced47-a91b-4990-963f-0fd31d3fe824	8011	66500	entregado	2025-09-23 21:13:05.326+00	\N	efectivo
003acb1f-0db0-40e0-83e4-e23529ff6a60	9129	20000	entregado	2025-09-23 22:43:09.127+00	\N	nequi
bc32d274-8c58-4591-8669-e76fa7b6a1f7	5916	40000	entregado	2025-09-24 01:02:15.878+00	\N	efectivo
1e035429-2e7a-47d0-8bbc-73bf2a403e23	7104	67500	entregado	2025-09-24 14:36:19.927+00	\N	efectivo
02194b42-3755-4374-a2b7-f099a74381d6	5524	60000	entregado	2025-09-24 22:42:13.018+00	\N	nequi
f86ca3e2-2fc5-4918-b3d1-78c2255ba587	9675	35000	entregado	2025-09-24 16:57:38.85+00	\N	efectivo
f14569f9-5d32-49bd-a92e-53da5226951a	1612	17000	entregado	2025-09-24 18:53:59.799+00	\N	nequi
0ef7b910-3764-4969-8787-6557dc8e0162	7905	35650	entregado	2025-09-24 20:47:30.941+00	\N	efectivo
abdb000c-7707-43ab-bff2-f11d298473b1	3817	18500	entregado	2025-09-24 21:27:45.487+00	\N	efectivo
db7fd491-754a-4b36-aed2-c7a6dafd4b9b	1999	15000	entregado	2025-09-24 20:41:28.984+00	\N	nequi
93b9a4a6-52d6-4729-ab9e-c058cf38e2d2	7086	48500	entregado	2025-09-24 18:55:18.308+00	\N	tarjeta
6e341b21-50c3-43fc-a256-d21a50eb6f7a	3131	35000	entregado	2025-09-24 20:03:19.902+00	\N	efectivo
625d0891-e934-4f39-b94a-5f83beb50503	7843	18000	entregado	2025-09-24 17:12:34.085+00	\N	efectivo
611df515-c40a-46aa-b953-d1c79416902f	6691	47500	entregado	2025-09-24 16:36:32.735+00	\N	nequi
86cd8216-cc20-44ca-9fd2-fff78e8bbb9a	4029	15000	entregado	2025-09-24 20:42:05.198+00	\N	efectivo
64609646-ea6b-48cb-ad69-6f9b570ca387	6971	10500	entregado	2025-09-24 22:13:22.987+00	ebd3c2f8-065f-4a44-8d53-330d736d9647	tarjeta
137155b2-2f48-46f2-ad0b-9d7517875112	7191	66000	entregado	2025-09-24 21:20:36.926+00	\N	efectivo
cad9ac26-00bf-479e-8805-56adbb11cd7e	2194	33000	entregado	2025-09-24 23:09:42.541+00	\N	nequi
7655b835-6a78-4b29-bc57-1b80ceeab56e	1732	8000	entregado	2025-09-24 22:45:22.954+00	ebd3c2f8-065f-4a44-8d53-330d736d9647	tarjeta
21872caf-7ab4-442c-a678-02fbe00879f9	6812	14000	entregado	2025-09-24 23:41:27.893+00	eaa07600-d0f1-452a-ae7b-6ad8b58f24c4	nequi
ce08628a-6482-492d-b876-0a6b1e4673e0	8507	26500	entregado	2025-09-24 23:49:04.54+00	\N	nequi
7f8fb50e-b18d-4239-8663-6d9c3f553052	9978	15500	entregado	2025-09-25 14:08:18.305+00	1f21b2a6-02db-41be-95ec-4e13a6cb6942	nequi
17ccdcf3-5e51-4d1f-8e43-f7f46dfb728f	4934	8000	entregado	2025-09-25 14:29:17.337+00	\N	efectivo
40bb8986-bf67-46c2-8bbf-1696fce069dc	8906	14500	entregado	2025-09-25 15:01:45.408+00	\N	efectivo
0abc1107-2f6b-4924-979f-acb1c5a2ac39	9469	4000	entregado	2025-09-25 15:46:09.895+00	445fa2d2-94bc-4ec1-9ae8-928be375b5b7	efectivo
\.


--
-- Data for Name: caja_movimientos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."caja_movimientos" ("id", "fecha", "tipo", "concepto", "monto", "metodopago", "order_id", "gasto_id") FROM stdin;
7801a332-8dd4-4dc1-8f6c-40e6aa55ef17	2025-09-22	EGRESO	Ingredientes: hola	10000	efectivo	\N	\N
101e77af-03e0-4d5a-845f-e8eb4b5caf1e	2025-09-22	INGRESO	Venta #6848	5500	efectivo	\N	\N
8293c678-98f4-4d74-8d4e-75ba59c46642	2025-09-22	INGRESO	Venta #4418	5500	nequi	\N	\N
4b11e696-163b-4aa2-995b-6583f2ab0c7e	2025-09-22	INGRESO	Venta #2267	5500	efectivo	\N	\N
461a70ba-091f-4582-8fff-cfcdfc0227b7	2025-09-22	INGRESO	Venta #5486	6000	efectivo	\N	\N
88177133-ae7d-475f-8141-fa2f0793c758	2025-09-22	INGRESO	Venta #1861	11500	efectivo	\N	\N
b37e407a-e67e-46e3-ac98-efe1b1ea44bc	2025-09-22	INGRESO	Venta #9105	15000	efectivo	\N	\N
89a51248-c412-427e-88bc-1f102de18f43	2025-09-22	INGRESO	Venta #4680	6000	efectivo	\N	\N
249c65b5-2f8a-450e-ad52-3d1ac5db1248	2025-09-22	INGRESO	Venta #5638	14500	efectivo	\N	\N
9ad7cb5f-f4c9-459e-8d6a-6a7038e9b37d	2025-09-22	INGRESO	Venta #3840	5500	efectivo	\N	\N
bf6bebbc-248c-44f3-8c4b-20a78558fb48	2025-09-22	INGRESO	Venta #4538	29000	efectivo	\N	\N
582d0844-4eeb-4fad-92c7-9cb055a5e279	2025-09-22	INGRESO	Venta #1869	27500	efectivo	\N	\N
06ed7c7b-c076-4888-9d83-983363a34b84	2025-09-22	INGRESO	Venta #9831	15000	efectivo	\N	\N
812ffb40-a6a6-46d0-8327-35e4ea78e428	2025-09-22	INGRESO	Venta #6231	5500	efectivo	\N	\N
216d64f0-7c17-4b04-9657-2639c1580246	2025-09-22	INGRESO	Venta #5006	15500	efectivo	\N	\N
52602dd9-e3e8-465b-adde-3cf52558a96a	2025-09-22	INGRESO	Venta #1754	36500	efectivo	\N	\N
36d91f43-aa75-41d7-84f7-c77d931e12c6	2025-09-22	INGRESO	Venta #4942	12000	efectivo	\N	\N
db142b30-66c4-46a4-a548-e539890ca741	2025-09-23	INGRESO	Venta #8420	18500	nequi	\N	\N
dfa25b3f-4fa2-43ec-bddd-264fab687592	2025-09-23	INGRESO	Venta #5674	18500	efectivo	\N	\N
67a68df4-9c15-44a6-bf9c-c4aab48c666e	2025-09-23	INGRESO	Venta #8161	9500	efectivo	\N	\N
41f62a4c-8dff-4a91-afe9-a7576bc19f9b	2025-09-23	INGRESO	Venta #8039	9500	efectivo	\N	\N
36015222-c5a2-4953-ae04-c65332311e0d	2025-09-23	INGRESO	Venta #3278	18500	efectivo	9d69b9cb-eda1-4d32-83a8-2a602a794389	\N
29eca59a-b8c6-4006-9e97-cf30dab788fa	2025-09-23	INGRESO	Venta #6424	28500	efectivo	c816883c-1811-416f-bb80-92ac3ff8d711	\N
c7e82afa-fed4-45be-8377-21f5b650bc03	2025-09-23	INGRESO	Venta #4153	18500	efectivo	4ace7a39-1bb7-4837-b544-20479ecfaac2	\N
eecbf37c-4525-453f-9431-42451b159daf	2025-09-23	INGRESO	Venta #4041	14500	efectivo	de7f4770-191d-4b57-ad9c-6468b2a0d51a	\N
7a164aab-9bcd-484c-9a57-0361309ffdfe	2025-09-23	INGRESO	Venta #2931	8000	efectivo	c8cde86a-df1e-47ef-8c13-d8468a25f3eb	\N
4d18b05a-8939-45db-8b72-40a11b77253c	2025-09-23	INGRESO	Venta #8055	15000	efectivo	d6a104ee-86fe-47e2-976d-47a99d172ced	\N
c92c2c1e-4d29-4476-ac63-718b4bcfdc65	2025-09-23	INGRESO	Venta #5954	10500	efectivo	270cb9c3-9278-47e2-89b9-36492b584e9c	\N
e28d4f70-cb88-4cb7-8d3d-df0d0672bb12	2025-09-23	INGRESO	Venta #7325	4000	efectivo	63195593-a2c9-41a3-887c-a129e1cdd976	\N
99fb8ece-2671-4121-b091-b376b4b4e29c	2025-09-23	INGRESO	Venta #3767	34500	efectivo	3d487325-f935-4c40-9e2a-236592e67b56	\N
a9d3ae44-e134-4450-b9a0-23a8cebb4bc1	2025-09-23	INGRESO	Venta #7287	15000	efectivo	c0b4015d-a729-4c9e-a220-cd6bb9b002f7	\N
d7581812-f0c4-4f93-b5b5-671100c9a804	2025-09-23	INGRESO	Venta #3468	18500	efectivo	7d385443-f410-4453-8e1d-9133ccfc279f	\N
60eaa81f-d645-4347-9037-67effceeacfb	2025-09-23	INGRESO	Venta #9099	15000	efectivo	507f5e77-20a2-4f77-8394-6bccf0eff0a2	\N
6bd6e7dc-ccf5-4e5a-8327-5a4209d040af	2025-09-23	INGRESO	Venta #1316	15000	efectivo	68f500ad-bb4e-4328-9d2a-9bcda8a7d6b0	\N
9b34a362-b4f8-4fd0-ac74-41521ac9ee25	2025-09-23	INGRESO	Venta #4075	15000	efectivo	4157c111-1cd4-4731-9e23-79474160c9e8	\N
1435936f-7200-4b7b-858c-62e5d8a3cf86	2025-09-23	INGRESO	Venta #9507	15000	efectivo	9a09e837-cc60-4521-bdfb-790fe3ec15f1	\N
5f39c949-43c4-4b7a-8676-2bcf4d3dbf6f	2025-09-23	INGRESO	Venta #8658	15000	efectivo	b88ba1fa-6f2a-4a1a-bbeb-1ef46feb7dcf	\N
f85c3bb6-fe39-4223-b256-a1992e3f45be	2025-09-23	INGRESO	Venta #5828	23000	efectivo	23eb2329-0c5e-4088-8fb3-36715c1d1f4c	\N
3a639750-bfaf-492f-81c8-5a5abfa328a4	2025-09-23	INGRESO	Venta #1581	16000	efectivo	b4d33059-dfdb-43af-94b8-c04e0a270161	\N
440f149f-5bec-4531-a869-f4e5dc8f4166	2025-09-23	INGRESO	Venta #9788	56500	efectivo	615f8381-992b-4d15-8313-899413b973fb	\N
e75dbab1-6e06-4616-aea5-6c166ee03da7	2025-09-23	INGRESO	Venta #9573	12000	efectivo	0168c10e-c788-426c-b706-3c57300c52f1	\N
0740d249-c524-43a2-9d90-c56ce5fe0aac	2025-09-23	INGRESO	Venta #4875	6000	efectivo	c5be6c87-d4d6-40a4-afa5-edb12ae9365f	\N
1c79ec1d-a7f6-410c-9a35-07ad42876bc8	2025-09-23	INGRESO	Venta #8794	31500	efectivo	1529133b-90d2-498e-a089-11ee20022e23	\N
c80abaca-3021-4312-833b-b2d48f401976	2025-09-23	INGRESO	Venta #2777	18500	efectivo	a064c078-e503-4588-9f1a-5833ab74af57	\N
b43f76c8-83bf-4084-b530-0f7ffd4e7973	2025-09-23	INGRESO	Venta #1486	14850	efectivo	5d597deb-c39d-48b8-bb7c-d6e593929397	\N
c54550b8-ae6f-4d20-8742-27dff5f988cc	2025-09-23	INGRESO	Venta #2822	13000	efectivo	0e99f28d-a472-4ab9-b6f9-0c898b40ba88	\N
bc5f5b75-3832-46ab-aa61-7dcc9903a6a4	2025-09-23	INGRESO	Venta #1008	44650	efectivo	842fbc54-bda1-4b20-957e-85d656cc4a3e	\N
656d1fd4-d8ec-4d66-b084-437e762d09c1	2025-09-23	INGRESO	Venta #6555	8500	efectivo	5cb52fcb-f91e-49c0-939a-a4dfe0d1cb58	\N
e0ba5e93-42b4-48dd-a1d4-34fcc0f15424	2025-09-23	INGRESO	Venta #1657	14500	efectivo	\N	\N
16a62904-8373-4b6d-904a-9e76b84bedf4	2025-09-23	INGRESO	Venta #5996	26500	nequi	\N	\N
bcd709d1-e277-4020-864e-268cc1205f25	2025-09-23	INGRESO	Venta #9353	26500	efectivo	b0d9be7c-102e-4bfb-a027-33a1cd9996ea	\N
b86124e8-bdee-4b1f-a26c-770820260049	2025-09-23	INGRESO	Venta #4142	19000	efectivo	\N	\N
c4d5171d-401f-49f9-ab7d-6de2c2243138	2025-09-23	INGRESO	Venta #5496	19000	efectivo	9cda329f-736a-45a1-b779-94967eef478f	\N
a577a899-b57d-4ae2-9c77-cdd83c00034e	2025-09-23	EGRESO	Ingredientes: Uvillas	3800	efectivo	\N	\N
affdf207-0cd2-463c-8c12-737c4c92ef8d	2025-09-22	EGRESO	Ingredientes: Apio	2500	efectivo	\N	\N
1c2bc831-0307-495c-958c-032bdfec9f9b	2025-09-22	EGRESO	Ingredientes: Uvillas	3800	efectivo	\N	\N
caf8aa6a-ee95-4ff1-a4ad-cc97a8239eb4	2025-09-22	EGRESO	Ingredientes: Uvillas	3800	efectivo	\N	\N
ffc72c0e-6aa6-46f1-a5b9-5f02fa73084f	2025-09-22	EGRESO	Ingredientes: HOLA	2000	efectivo	\N	\N
00a1bd4e-4db6-49ae-8086-6ac7ff5579d4	2025-09-22	EGRESO	Ingredientes: hola2	3000	efectivo	\N	\N
aa2521f2-fb44-4453-80d4-024bebd7953d	2025-09-23	EGRESO	Ingredientes: Uvillas	3800	efectivo	\N	786efe72-4b29-4a12-8e2a-e1bcb4d5baac
37319b1a-b637-43ac-a120-99e5f5877ee0	2025-09-23	EGRESO	Ingredientes: Panela	2900	efectivo	\N	c5b7b0c0-9409-4c07-ab55-d16be77c8091
560896f3-a379-4a2a-ad6e-cc9f60d9a081	2025-09-23	INGRESO	Venta #5956	39000	efectivo	9570fce9-c17a-479b-a87c-40d2bcf40312	\N
6d159d48-8af7-4865-9695-d75967a3c2f5	2025-09-23	EGRESO	Ingredientes: Champiñones	28000	efectivo	\N	b82e5b20-bbe7-448b-be66-e363cc409a36
e2682dc6-09d4-4ce2-9d80-57b0d3c6b742	2025-09-23	INGRESO	Venta #3716	1000	efectivo	\N	\N
9b6b6eb2-bd1c-4c17-9e4f-a0f0a9ecff8d	2025-09-23	INGRESO	Venta #1539	16000	efectivo	529b3152-2ab2-4e97-9e1d-bd9a3ab0975e	\N
54019c0a-fa8e-46a6-a4a8-a1609309fb85	2025-09-23	INGRESO	Venta #4070	30000	efectivo	9c872a93-c09f-4346-9c46-0883e8fdf576	\N
fa23839c-a48d-4ba1-871a-c534dfc6dc2e	2025-09-23	INGRESO	Venta #7940	40000	efectivo	f361c481-118d-4e72-8658-058715d72db2	\N
d15138af-73f8-4b9b-b584-09efc6611fbe	2025-09-23	INGRESO	Venta #1941	15000	efectivo	fd5de209-af3b-4a6e-8bb8-f0876ae61b11	\N
842abd50-4707-47e7-8470-2cd981f6080e	2025-09-23	INGRESO	Venta #1008	32000	efectivo	c83d1ab6-6390-4786-848a-094e60de15cd	\N
b8b62eeb-9649-42c9-a038-33fe9ee98ce9	2025-09-23	INGRESO	Venta #6654	8000	efectivo	9040b73f-77bf-427b-b0c2-1bb2526c0086	\N
103261aa-dc05-4c50-a25c-2ff9387b89ea	2025-09-23	INGRESO	Venta #7065	8000	efectivo	5879eaea-d972-4277-a405-30978f25166e	\N
5f7c9527-d8e4-4b48-bcc8-76f3f7c21b1a	2025-09-23	INGRESO	Venta #4082	30000	efectivo	ae2bebca-571e-4c07-8670-757db996718d	\N
5b5cf757-944f-4767-8536-209493780389	2025-09-23	INGRESO	Venta #7311	30000	efectivo	15cbe337-b663-447c-86e5-c1cca381e249	\N
01c6d160-c16e-4445-8512-559ef47fc9ad	2025-09-23	INGRESO	Venta #4598	29850	efectivo	c26ad814-d661-426f-905b-9e1d7db637c2	\N
eb541a4a-7b32-4606-b542-698a94493cb5	2025-09-23	INGRESO	Venta #8870	18500	efectivo	\N	\N
b14061bb-ccfc-4362-8835-3c44b4e060f6	2025-09-23	INGRESO	Venta #3087	17100	efectivo	7535363c-d10d-4d35-abdc-4eae97bd274f	\N
d9b77f83-7a85-47c7-8563-a6cbc2802803	2025-09-23	INGRESO	Venta #5304	5500	efectivo	\N	\N
b9937c7b-5a77-49f1-b0f9-aca6ce65d970	2025-09-23	INGRESO	Venta #4795	16000	efectivo	75f77883-a796-4df2-9bd8-d4bd423c0c1f	\N
77aea1bf-9cc0-4a40-bc1e-fca35e8d525b	2025-09-23	INGRESO	Venta #6262	14850	efectivo	00778b23-695c-48f2-92ab-b3742b61b855	\N
7b029927-ccef-473d-8436-fe103e5362cd	2025-09-23	INGRESO	Venta #7020	24500	efectivo	32369dfb-eef0-4209-9ced-9e6b6f1e381e	\N
0317761c-061b-4b1a-81af-87791d3373d6	2025-09-23	INGRESO	Venta #4479	41000	efectivo	6b96efb7-0e92-4bc4-87fe-0e95a4e561da	\N
d74e6d7f-5db4-442b-a8d8-b664594d2671	2025-09-23	INGRESO	Venta #6564	15000	efectivo	1ca8ba41-cc65-425c-b4f1-3ddae293522d	\N
4d0f9713-3c0e-48f6-8555-cb92a3bdc818	2025-09-23	EGRESO	Ingredientes: Aguacates	12000	efectivo	\N	b9a97ba9-60c1-4898-bdfb-22f1b4da4446
623d30db-c00f-4b4b-a4bc-5daacc773956	2025-09-23	INGRESO	Venta #8914	21000	efectivo	c84e0bb3-b3d4-478b-b76f-b27a105878ba	\N
54d51133-a595-4031-8d81-d8243bbefa39	2025-09-23	INGRESO	Venta #8011	38500	efectivo	6d5ced47-a91b-4990-963f-0fd31d3fe824	\N
2cb663f9-9d81-4992-b12a-2e16c4db8d68	2025-09-23	EGRESO	Ingredientes: tocino	56000	efectivo	\N	5f05c3e1-2cf2-4808-bc86-946cf5917809
c35db7e5-ad16-47ec-90f2-ff4476777575	2025-09-23	EGRESO	Ingredientes: kiwi	11500	efectivo	\N	da87fdde-20a3-427f-83e6-df461b56e6dc
e33bef64-e8a3-451a-83f1-61ac803a96eb	2025-09-23	INGRESO	Venta #3713	4000	efectivo	\N	\N
12cd6e0f-ac04-47e1-8f9b-4a521d671c9a	2025-09-23	INGRESO	Venta #9692	8000	efectivo	4dcdbf9e-9136-491c-986f-401f60bdaf58	\N
90a7d199-a7f2-4f28-8fcd-7331757348ac	2025-09-23	INGRESO	Venta #2356	54000	efectivo	64fa9dbc-f255-415a-b34f-a27d3332157b	\N
aa44c814-00c1-4265-a1dc-13fd5b80bf57	2025-09-23	INGRESO	Venta #1849	11000	efectivo	dea8fbf9-2118-4343-ac86-f71661501468	\N
c08ce32f-97f7-44ec-93db-b8044e9a522b	2025-09-23	INGRESO	Venta #4686	11500	efectivo	eeff4778-0520-48ff-8e11-55787643ec39	\N
7de87cfc-ea6e-4254-8357-7e3d4303e8dd	2025-09-23	INGRESO	Venta #9129	20000	efectivo	003acb1f-0db0-40e0-83e4-e23529ff6a60	\N
51b66d0a-0852-4bfa-9da3-86378019be55	2025-09-23	INGRESO	Venta #1768	14000	efectivo	07fdd121-94d2-43e8-b856-44e10ae325a8	\N
012c67e1-447f-42ee-9fd1-31b5e92a83cb	2025-09-23	EGRESO	Ingredientes: leche andi	24900	efectivo	\N	729fd5d2-8d73-4035-8237-0e6de80f91e8
5ccd6d7d-871e-4a50-90dd-3d704053257b	2025-09-24	INGRESO	Venta #7139	54500	efectivo	cee5fc2e-f3c2-4cc1-afd8-686b6d303a7c	\N
836a3a18-1b9a-4b5b-8d53-06d2ce507433	2025-09-24	INGRESO	Venta #2120	23500	efectivo	d2c2ebe9-f796-4351-9134-5b03641020e9	\N
23fc5af4-8a81-4d04-9e2b-574b9e50bd85	2025-09-23	INGRESO	Venta #2189	28000	efectivo	\N	\N
50809f24-95a4-4ebe-92e6-1a70af39a0b6	2025-09-23	EGRESO	Ingredientes: Quajada	12000	efectivo	\N	9ac3936a-d9e1-4e86-9bee-ef53da1dfe82
0e372966-4747-4c93-a3d8-9554b94d4b1d	2025-09-23	EGRESO	Ingredientes: Cilantro	1000	efectivo	\N	1f5ecb57-fa8c-4c33-9df3-bbdd20b6cd27
6d6acd03-e442-4e33-a060-128b5397f7ba	2025-09-24	INGRESO	Venta #5916	40000	efectivo	bc32d274-8c58-4591-8669-e76fa7b6a1f7	\N
c5643ba8-b706-4408-9efc-15387f789ad6	2025-09-24	INGRESO	Venta #2960	40500	efectivo	\N	\N
f1f7d2a2-9fa4-4857-9ba2-5298df840566	2025-09-24	INGRESO	Venta #3343	69500	efectivo	\N	\N
694ebd92-1b27-453a-a201-38c3e2c34da4	2025-09-24	INGRESO	Venta #8991	69500	efectivo	cb353b71-1ebb-4704-88e2-e1bc53cbe1cb	\N
c12e3ced-7cea-4bcf-b2d3-1d3bc8919d69	2025-09-24	INGRESO	Venta #5584	8000	efectivo	311ae63b-e7c6-4022-98ff-f059b7255029	\N
15d9adee-4281-48c9-a851-0f6bc92857b7	2025-09-24	INGRESO	Venta #7104	67500	efectivo	1e035429-2e7a-47d0-8bbc-73bf2a403e23	\N
b3de1031-f444-44a3-92a2-384164204123	2025-09-24	INGRESO	Venta #3840	76000	efectivo	25cecc96-c8e5-4e72-a78c-58fc76f1230e	\N
28d11a6a-0fee-43ef-b830-263f395a093a	2025-09-24	INGRESO	Venta #4928	76000	efectivo	\N	\N
0193e9a7-f935-4a92-beba-0245bafd3bb9	2025-09-24	INGRESO	Venta #9775	27500	efectivo	7022e0a3-2a51-4cb6-beb7-4e6587e0eb9d	\N
9903f921-c1b4-4b81-bd02-13cdfe18bc2a	2025-09-24	INGRESO	Venta #7702	14500	efectivo	\N	\N
b8364e9b-b492-49cf-bcd5-7786eb1d4f05	2025-09-24	EGRESO	Ingredientes: Pan Sandwich	19600	efectivo	\N	3927a6f7-c003-49af-bfe4-19f537b10f2e
6eb4d040-5f1f-4b03-b006-2c4616cab884	2025-09-24	EGRESO	Ingredientes: Aguacate	12000	efectivo	\N	b960b12c-e282-4469-9a47-64dc29f813ec
833122a5-33aa-4665-b6ef-2375ae4298da	2025-09-24	EGRESO	Ingredientes: Champiñones, Limón Taití	26600	nequi	\N	1e81aa05-d1c8-478e-a033-d75529542c08
a22224cc-6a03-49b2-8913-5447031b3c40	2025-09-24	EGRESO	Ingredientes: Quesillo	12000	nequi	\N	a7a967dc-07d8-401e-baaf-7ed1aa9ada65
9d089b86-6c5c-45e4-9c5e-40183d6500f6	2025-09-24	INGRESO	Venta #6691	29000	efectivo	611df515-c40a-46aa-b953-d1c79416902f	\N
492e0472-7966-464b-a139-321d0b6ca39a	2025-09-24	EGRESO	Ingredientes: Champiñones	17600	efectivo	\N	1d5e34ad-9dce-4ebd-887d-2e519e5bb99a
17014397-3967-45df-bc52-9f6c673817ea	2025-09-24	EGRESO	Salarios: PRESTAMO BELEN	60000	efectivo	\N	8091d6bc-85c8-481c-b646-4c888d050415
a614f94f-a4ed-41f0-911e-f45c884c4fab	2025-09-24	INGRESO	Venta #9675	35000	efectivo	f86ca3e2-2fc5-4918-b3d1-78c2255ba587	\N
760afb48-7629-446e-badf-58b54f96c487	2025-09-24	EGRESO	Ingredientes: Toalla Cocina	3600	efectivo	\N	4e2b6c5a-f72a-48b1-825f-fbde0061c282
a9b71418-ccdf-48d8-a81a-cf1dd5ed2314	2025-09-24	EGRESO	Equipos: Servilletas	4500	efectivo	\N	cbe0a98e-aec8-4d57-9e96-de8d09a60318
c4310732-32a2-4850-9458-fae6e8a12194	2025-09-24	EGRESO	Equipos: Desengrasante	6300	efectivo	\N	4236d432-643a-442a-9e08-2eb3c91bc998
512efad4-f78d-4383-87f7-b50f92b67e1a	2025-09-24	EGRESO	Equipos: Aceite	12600	efectivo	\N	6b1e2490-4125-46a4-917f-56d548641bbd
a9f754d3-817f-4932-a78a-aa9d7e04bcf6	2025-09-24	INGRESO	Venta #7843	16000	efectivo	625d0891-e934-4f39-b94a-5f83beb50503	\N
25216943-7650-44b7-832f-fedb4973e416	2025-09-24	INGRESO	Venta #2484	33500	efectivo	\N	\N
ce899b71-af2b-4917-8c69-c047f2f8484c	2025-09-24	INGRESO	Venta #1612	17000	efectivo	f14569f9-5d32-49bd-a92e-53da5226951a	\N
959d8c07-a21b-4584-92e6-b994af879e6d	2025-09-24	INGRESO	Venta #7086	48500	efectivo	93b9a4a6-52d6-4729-ab9e-c058cf38e2d2	\N
95461af7-e5a8-449e-b14f-3f818b1a7da7	2025-09-24	INGRESO	Venta #4312	14500	efectivo	\N	\N
43f41770-1437-4803-a0ad-50d37e357fcc	2025-09-24	INGRESO	Venta #3131	20000	efectivo	6e341b21-50c3-43fc-a256-d21a50eb6f7a	\N
84c2345c-bb8b-4a63-8ca0-dfa54648c217	2025-09-24	EGRESO	Transporte: Domicilio	6000	efectivo	\N	7534af85-7297-4a68-8412-765381d91c52
4594d67e-e72a-49ef-bb4b-a9a6ddc94d8f	2025-09-24	EGRESO	Ingredientes: Queso Crema	13200	efectivo	\N	46d89c96-3208-413a-8247-4f6e96d25016
556b1493-c566-4e21-b390-8dd8a5dac01b	2025-09-24	INGRESO	Venta #1999	4500	efectivo	db7fd491-754a-4b36-aed2-c7a6dafd4b9b	\N
bc211df6-fde8-4d8e-90ec-00f15e94f465	2025-09-24	INGRESO	Venta #4029	15000	efectivo	86cd8216-cc20-44ca-9fd2-fff78e8bbb9a	\N
a0a89ce7-643d-477a-ae4f-05d691cdbfe2	2025-09-24	INGRESO	Venta #7905	21150	efectivo	0ef7b910-3764-4969-8787-6557dc8e0162	\N
c039f91e-2c55-499c-aab4-ac2eef209081	2025-09-24	INGRESO	Venta #7191	47500	efectivo	137155b2-2f48-46f2-ad0b-9d7517875112	\N
eef8d7df-1057-45ef-bf93-76305739c51d	2025-09-24	INGRESO	Venta #3817	18500	efectivo	abdb000c-7707-43ab-bff2-f11d298473b1	\N
16e52c82-645a-4dd0-b4fc-a6f1bb2b219b	2025-09-24	INGRESO	Venta #6971	10500	efectivo	64609646-ea6b-48cb-ad69-6f9b570ca387	\N
3f6ce7f1-2725-4f81-a760-1a299a941f98	2025-09-24	INGRESO	Venta #5524	60000	efectivo	02194b42-3755-4374-a2b7-f099a74381d6	\N
1bca2a81-4065-40a5-b01b-2d7c209a8028	2025-09-24	INGRESO	Venta #1732	8000	efectivo	7655b835-6a78-4b29-bc57-1b80ceeab56e	\N
bdf9d971-d010-430e-8c88-8f6baf0a045b	2025-09-24	INGRESO	Venta #2194	31000	efectivo	cad9ac26-00bf-479e-8805-56adbb11cd7e	\N
53490284-3975-4ae7-a9f6-d7a41552760c	2025-09-24	INGRESO	Venta #6812	14000	efectivo	21872caf-7ab4-442c-a678-02fbe00879f9	\N
5424d0c0-52bd-45c1-bac8-11ce4dddb40d	2025-09-24	INGRESO	Venta #8507	26500	efectivo	ce08628a-6482-492d-b876-0a6b1e4673e0	\N
a4de54d3-ad5f-49d0-bde7-cb52c3bd9d5b	2025-09-24	EGRESO	Ingredientes: Carne	56000	efectivo	\N	71a698a0-ed2d-4ddd-86fa-b4e087c7eda3
4354835d-9f33-42b4-966a-fe82aacf5485	2025-09-25	INGRESO	Venta #9978	15500	efectivo	7f8fb50e-b18d-4239-8663-6d9c3f553052	\N
7cab83e6-791e-4fd2-8f0e-4f9f4a0a95b1	2025-09-25	INGRESO	Venta #4934	8000	efectivo	17ccdcf3-5e51-4d1f-8e43-f7f46dfb728f	\N
1bc9ed56-93c3-4497-ab1a-186fa90cc4ef	2025-09-25	INGRESO	Venta #8906	10500	efectivo	40bb8986-bf67-46c2-8bbf-1696fce069dc	\N
95ec1748-6e87-4cda-b1cd-b0f70791799b	2025-09-25	INGRESO	Venta #9469	4000	efectivo	0abc1107-2f6b-4924-979f-acb1c5a2ac39	\N
\.


--
-- Data for Name: empleados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."empleados" ("id", "nombre", "telefono", "email", "horas_dia", "dias_semana", "salario_hora", "activo", "created_at", "updated_at") FROM stdin;
d09a0a4d-18f4-424f-a6a8-c101f1781158	Maria Belen			8	5	6500	t	2025-09-22 17:45:41.732825+00	2025-09-22 17:53:55.924492+00
888efeea-7b4d-493a-bcad-46a0ddedcddc	Miguel			8	4	6500	t	2025-09-22 00:31:21.349065+00	2025-09-22 17:55:40.418097+00
\.


--
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."menu_items" ("id", "codigo", "nombre", "precio", "descripcion", "keywords", "categoria", "stock", "inventariocategoria", "inventariotipo", "unidadmedida") FROM stdin;
b68386e8-b73e-422b-a5b6-47d622faac19	sand-pollo-green	Pollo Green	16500	Mayonesa de rostizados y verde, jamón de pollo, guacamole, tomate horneado, semillas de girasol, lechuga, tocineta.	pollo green, jamón de pollo, rúgula, champiñones, parmesano, guacamole, salsa verde, salsa rostizada, lechuga, tomate horneado, semillas	Sandwiches	0	No inventariables	unidad	unidad
b3595ec8-1cb5-4a44-9dc4-c25a65b47b0e	sand-pollo-toscano	Pollo Toscano	18500	Salsa verde, jamón de pollo, lechuga, rúgula, champiñones, tomates horneados, parmesano, queso doble crema, tocineta, miel de uvilla.	pollo toscano, jamón de pollo, lechuga, rúgula, champiñones, tomate horneado, queso tajado, queso parmesano, tocineta	Sandwiches	0	No inventariables	unidad	unidad
60c3451b-db1a-45f4-8480-585e01fe2242	sand-mexicano	Mexicano	19000	Frijol refrito, pollo desmechado, pico de gallo, queso crema tajado, guacamole, sour cream, salsa brava.	mexicano, pollo desmechado, guacamole, pico de gallo, frijol refrito, salsa brava, sour cream, queso tajado	Sandwiches	0	No inventariables	unidad	unidad
114e2c84-cf03-47a9-abae-b3edd6911ded	bowl-salado	Bowl Salado	15000	Personaliza tu bowl con 2 bases, 4 toppings y 1 proteína. Incluye bebida.	bowl salado, arroz, pasta, quinua, pollo, cerdo, carne, toppings	Bowls Salados	0	No inventariables	unidad	unidad
a551c5fe-bf6e-4d9d-a396-22d2147c309d	bowl-acai-supremo	Açaí Supremo	14500	Base de açaí, fresa, banano, yogurt y toppings variados.	açaí supremo, fresa, banano, yogurt, kiwi, coco, arándanos, semillas, crema de maní	Bowls Frutales	0	No inventariables	unidad	unidad
ed348c8c-f11a-401a-8865-5ede23240268	bowl-tropical	Tropical	12000	Mango, piña, banano, yogurt natural y toppings.	tropical, mango, piña, banano, yogurt, granola, coco, semillas	Bowls Frutales	0	No inventariables	unidad	unidad
9570e5a7-af90-4277-91a0-dd6a3de80bd7	bowl-vital	Vital	12000	Mango, banano, piña, espinaca, yogurt, leche y toppings.	vital, mango, banano, piña, espinaca, yogurt, granola, chía, coco	Bowls Frutales	0	No inventariables	unidad	unidad
fa107d92-d59b-4686-b51f-7df33766c361	beb-capuccino	Capuccino	6000	\N	capuccino	Bebidas Calientes	0	No inventariables	unidad	taza
3bb93296-c6c5-456a-b165-73c1a20a3134	beb-latte	Latte	5500	\N	latte	Bebidas Calientes	0	No inventariables	unidad	taza
84ce9a61-d186-47cb-92b4-afa4d5847dab	beb-americano	Americano	5500	\N	americano	Bebidas Calientes	0	No inventariables	unidad	taza
522d937d-7d2d-4c3a-b785-f692a09b8a37	beb-cocoa	Cocoa	6000	\N	cocoa	Bebidas Calientes	0	No inventariables	unidad	taza
996be55c-5666-42fd-bb8b-4ef44cd82194	beb-pitaya-latte	Pitaya Latte	8500	\N	pitaya latte	Bebidas Calientes	0	No inventariables	unidad	taza
fe196a9f-e68f-4df6-ab98-5a2c58ad9b16	beb-infusion-frutos	Infusión de frutos rojos	6000	\N	infusión frutos rojos	Bebidas Calientes	0	No inventariables	unidad	taza
36d50cac-2255-4963-b89a-6d7e29450faf	acomp-torta-dia	Torta del día	8000	\N	torta, zanahoria, arándanos, naranja, coco, yogurt griego	Acompañamientos	0	No inventariables	unidad	unidad
d91e4dd0-47a5-46fc-bf29-35b764305016	acomp-galleta-avena	Galletas de avena	4000	\N	galletas avena	Acompañamientos	0	No inventariables	unidad	unidad
7f82e02d-0f16-4a9d-9681-5dd06edbdc0f	acomp-muffin-queso	Muffin de queso	4500	\N	muffin queso	Acompañamientos	0	No inventariables	unidad	unidad
28edafa3-ac74-41f0-ae95-a4ea8efc5f33	acomp-tapitas	Tapitas	10000	Pan con queso feta, tomate al horno y albahaca.	tapitas, pan, queso feta, tomate al horno, albahaca	Acompañamientos	0	No inventariables	unidad	unidad
7d3fef49-18f7-4513-862c-26e3fcf98c64	inv-mango	Mango	0	\N	mango fruta fresca	Frutas	5000	Inventariables	peso	g
0d145a50-a0e9-4b6e-a72c-ae6f62869358	inv-pina	Piña	0	\N	piña fruta fresca	Frutas	3000	Inventariables	peso	g
0b7f6082-d353-4b88-88f6-f9c38cf8a236	inv-banano	Banano	0	\N	banano fruta fresca	Frutas	2000	Inventariables	peso	g
3e64c708-2249-42ab-b25d-1961379a35b3	inv-fresa	Fresa	0	\N	fresa fruta fresca	Frutas	1500	Inventariables	peso	g
9f9f516f-6122-4ac7-b3d9-2031114a3743	inv-kiwi	Kiwi	0	\N	kiwi fruta fresca	Frutas	800	Inventariables	peso	g
c8d3d813-2118-4791-a0e5-69b951cfb7f1	inv-sandia	Sandía	0	\N	sandía fruta fresca	Frutas	4000	Inventariables	peso	g
563a5528-8afd-4131-aae9-97bf22abf715	inv-arandanos	Arándanos	0	\N	arándanos fruta fresca	Frutas	500	Inventariables	peso	g
2311e08c-dde0-4cd2-b9f7-1ba355a8e7f1	inv-pitaya	Pitaya	0	\N	pitaya fruta fresca	Frutas	400	Inventariables	peso	g
65772588-ca95-4f79-9ed8-416773cc698b	inv-yogurt	Yogurt natural	0	\N	yogurt natural	Lácteos	2000	Inventariables	peso	g
9e53b412-3e52-460d-b1be-430fc49b42d2	inv-leche	Leche	0	\N	leche líquida	Lácteos	3000	Inventariables	volumen	ml
f441d7b6-e5c8-4ef3-93be-85e0d2b21617	inv-queso-feta	Queso feta	0	\N	queso feta	Lácteos	500	Inventariables	peso	g
f16c3e67-8372-411d-a0ab-98454d87dc35	inv-queso-crema	Queso doble crema	0	\N	queso crema	Lácteos	800	Inventariables	peso	g
12afc8b0-179c-4836-bb9b-f240eede2c54	inv-jamon-cerdo	Jamón de cerdo	0	\N	jamón cerdo	Proteínas	1000	Inventariables	peso	g
1ad652c5-a285-47f7-84b6-dd4f47d0c26a	inv-jamon-pollo	Jamón de pollo	0	\N	jamón pollo	Proteínas	1200	Inventariables	peso	g
07914160-255d-4643-82dd-16371cc17a89	inv-pollo-desmechado	Pollo desmechado	0	\N	pollo desmechado	Proteínas	800	Inventariables	peso	g
f0dfa128-82ba-4fe5-8a08-e008775f713e	inv-tocineta	Tocineta	0	\N	tocineta	Proteínas	400	Inventariables	peso	g
66254042-951c-4d33-85ae-7edb5a2cc4cb	inv-rugula	Rúgula	0	\N	rúgula	Vegetales	300	Inventariables	peso	g
8ac5c2ab-fa3c-4001-bb5a-dd5436f88d0b	inv-lechuga	Lechuga	0	\N	lechuga	Vegetales	500	Inventariables	peso	g
7c59e7d8-e7dc-4dc5-9bf4-c0e1e879b99d	inv-champinones	Champiñones	0	\N	champiñones	Vegetales	600	Inventariables	peso	g
5b128ddb-0463-4551-8409-68a5b26c32bb	inv-tomate	Tomate	0	\N	tomate	Vegetales	1000	Inventariables	peso	g
a55d032b-19ab-4f37-b67e-7b52b0dc757d	inv-espinaca	Espinaca	0	\N	espinaca	Vegetales	400	Inventariables	peso	g
8110892f-aa78-40a1-9920-b487b37bdcfa	inv-apio	Apio	0	\N	apio	Vegetales	300	Inventariables	peso	g
56362b50-3801-4686-aed2-a483b9960532	inv-pepino	Pepino	0	\N	pepino	Vegetales	800	Inventariables	peso	g
3439660a-0c97-4849-82e3-13d222bbf131	inv-chia	Semillas de chía	0	\N	chía	Semillas	200	Inventariables	peso	g
d25e85bb-2f7c-4162-8217-a7f063bcdd50	inv-granola	Granola	0	\N	granola	Semillas	500	Inventariables	peso	g
0aa7128a-f7bb-49b6-8076-5353da9d8b36	inv-avena	Avena	0	\N	avena	Semillas	1000	Inventariables	peso	g
3ed1dde6-64f6-4ee5-9463-8e7ffe4e38e5	inv-acai	Açaí	0	\N	açaí fruta fresca	Frutas	300	Inventariables	cantidad	\N
a46047fe-38ef-45ec-91e9-9caaa9134ea6	inv-coco	Coco rallado	0	\N	coco	Semillas	300	Inventariables	peso	g
d216d067-9759-4676-a7e2-41556f648173	inv-crema-mani	Crema de maní	0	\N	crema maní	Semillas	400	Inventariables	peso	g
22750722-2b13-402d-9644-071a9a40409a	inv-curcuma	Cúrcuma	0	\N	cúrcuma	Especias	100	Inventariables	peso	g
5ae4b944-5c82-409f-957f-2c5aac7b69f9	inv-jengibre	Jengibre	0	\N	jengibre	Especias	200	Inventariables	peso	g
170a8ba1-1e9c-4927-a83b-77818855e328	inv-maca	Maca	0	\N	maca	Especias	150	Inventariables	peso	g
c45b5d0d-73bd-4ea1-a6c0-5aff86a3df34	inv-miel	Miel	0	\N	miel	Especias	500	Inventariables	peso	g
6daad8c7-a56b-41bb-aac2-39865602fde4	inv-cafe	Café	0	\N	café	Bebidas	1000	Inventariables	peso	g
33564f53-bafd-4853-b33b-28e67e19f29f	inv-te-matcha	Té matcha	0	\N	té matcha	Bebidas	200	Inventariables	peso	g
41255860-00f8-4653-b288-4cc4d9412cff	inv-cacao	Cacao puro	0	\N	cacao puro	Bebidas	300	Inventariables	peso	g
2486b0c9-520c-48fd-ad05-d7f5b506bb21	inv-proteina	Proteína whey	0	\N	proteína whey	Bebidas	500	Inventariables	peso	g
ed74f62f-d2d3-4cf1-a688-dc615363f8c9	sand-del-huerto	Del huerto	15500	Mayonesa de rostizados, queso feta, rúgula, tomates horneados, champiñones, parmesano, mix de semillas, chips de arracacha.	del huerto, champiñones, mayonesa rostizada, queso feta, crocantes de arracacha, tomate horneado, semillas de calabaza, queso tajado	Sandwiches	0	No inventariables	\N	\N
20cc1e0f-330e-42b7-b8b9-05c1069d7682	sand-jamon-artesano	Jamón artesano	18500	Salsa verde, queso doble crema, jamón de cerdo, rúgula, tomates horneados, parmesano.	jamón artesano, jamón de cerdo, miel de uvilla, cebolla, tomate horneado, rúgula, queso tajado, queso parmesano, salsa verde	Sandwiches	0	No inventariables	unidad	unidad
05d9250c-df43-4f67-9fc5-f2e70f3b49ea	acompanamientos-granola-vtiz	Granola	7000	Granola de diferentes sabores	\N	Acompañamientos	0	No inventariables	\N	\N
bbe7a283-40e4-4d35-bac2-1aa7423a4058	batidos-refrescantes-amanecer-9o4k	Amanecer	9500	Mango, piña, menta, semillas de chía.	\N	Batidos refrescantes	0	No inventariables	\N	\N
35a41129-ef96-43e6-8ebc-7c14c4d26605	batidos-refrescantes-sandia-salvaje-qmn2	Sandía salvaje	9500	Sandía, fresa, hierbabuena, limón, kiwi.	\N	Batidos refrescantes	0	No inventariables	\N	\N
f3e97ba3-6dc6-4847-becf-7f84e94873f2	batidos-refrescantes-pina-rosa-pgde	Piña rosa	9500	Hierbabuena, pitaya rosada, piña, limón.	\N	Batidos refrescantes	0	No inventariables	\N	\N
a923676d-77da-4843-9df2-8eb637965cb4	batidos-funcionales-golden-milk-ty5b	Golden milk	10500	Mango, banano, yogurt natural, leche, miel, chía, cúrcuma, maca.	\N	Batidos funcionales	0	No inventariables	\N	\N
16325ab3-d934-4d9d-9573-056bded27d08	batidos-funcionales-digest-f7d4	Digest	10500	Sábila, piña, kiwi, chía, naranja, miel.	\N	Batidos funcionales	0	No inventariables	\N	\N
2f8a28bd-4987-4e33-995f-932f31d24255	batidos-funcionales-antioxidante-n3p2	Antioxidante	10500	Sandía, remolacha, jengibre, mora, limón, chía.	\N	Batidos funcionales	0	No inventariables	\N	\N
febcfb4f-bc51-4719-89dd-765ed174f19b	batidos-funcionales-saciante-plp7	Saciante	10500	Arándano, fresa, banano, leche, chía, avena.	\N	Batidos funcionales	0	No inventariables	\N	\N
1926274b-2765-4f72-810f-6e79ad575a91	batidos-funcionales-detox-pt8p	Detox	10500	Jengibre, apio, perejil, menta fresca, manzana verde, kiwi, pepino, naranja, miel.	\N	Batidos funcionales	0	No inventariables	\N	\N
c3704705-037f-40c4-976c-d0576e944b21	batido-pink	Pink	12000	Fresa y banano con yogurt natural y leche; chía y avena.	pink, fresa, banano, yogurt natural, leche, chía, avena, batido especial	Batidos especiales	0	No inventariables	unidad	unidad
153a1ea3-1420-4d88-b427-c23254b00bde	batido-moca-energy	Moca Energy	12000	Banano, café frío y leche con cacao puro, crema de maní y avena.	moca energy, banano, café frío, leche, cacao puro, crema de maní, avena, batido especial, energía	Batidos especiales	0	No inventariables	unidad	unidad
31a6d560-88e6-45ec-9177-0625136ffe22	batido-matcha-protein	Matcha Protein	16000	Té matcha con 1 scoop de proteína whey (30 g).	matcha protein, té matcha, proteína, whey, 30 g, batido especial, alto en proteína	Batidos especiales	0	No inventariables	unidad	unidad
d4f6e89a-8cbe-4ecd-b524-b731b1223b24	matcha-latte-helado	Matcha latte helado	11000	Té matcha con leche y hielo.	matcha latte helado, té matcha, leche, hielo, bebida fría	Bebidas frías	0	Bebidas frías	No inventariables	unidad
890a38ce-311d-45f0-b602-f10798189185	blue-latte-helado	Blue latte helado	10500	Té azul en leche o bebida vegetal con hielo.	blue latte, té azul, bebida vegetal, leche, hielo, bebida fría	Bebidas frías	0	Bebidas frías	No inventariables	unidad
2ea1c1da-ad0a-41d8-978e-8a5ab618ef6f	limonada-azul	Limonada azul	10000	Mezcla de limón y té azul.	limonada azul, limón, té azul, bebida fría, refrescante	Bebidas frías	0	Bebidas frías	No inventariables	unidad
a6180a54-dcea-4af5-a873-455b03618324	cafe-pitaya	Café Pitaya	10500	Café y pitaya rosa.	café pitaya, pitaya rosa, café frío, bebida fría	Bebidas frías	0	Bebidas frías	No inventariables	unidad
c7572bb3-01f8-4c66-a3e3-0c262093761c	acompanamientos-bolsa-vgbf	Bolsa	1000	Bolsa para llevar	\N	Acompañamientos	0	No inventariables	\N	\N
fb87265d-4925-4fc3-be32-7c55e611f5e6	acompanamientos-scoop-de-proteina-7wfh	Scoop de Proteina	5000	Scoop de proteina para batidos	\N	Acompañamientos	0	No inventariables	\N	\N
fc11776c-aef5-449a-9fcf-1e982a0b35ab	acompanamientos-leche-vegetal-niu0	Leche vegetal	2000	Leche de almendras o leche de avena	\N	Acompañamientos	0	No inventariables	\N	\N
290b77dc-ac81-48e0-bb33-70fefbe3273b	acompanamientos-chips-de-arracacha-e88x	Chips de arracacha	2000	Chips	\N	Acompañamientos	0	No inventariables	\N	\N
f8e85d01-41b6-4ad5-8430-19a2406317f2	frutas-uvillas-xph8	Uvillas	3800		\N	Frutas	1035	Inventariables	gramos	g
7e4177df-0f44-4162-b0b8-0a8a7b6bd97b	acompanamientos-adicion-proteina-4if7	Adición Proteina	5000	Pechuga de pollo, Jamón de cerdo o Carne desmechada	\N	Acompañamientos	0	No inventariables	\N	\N
a1a2c0c2-0779-46b4-87cc-f47473361928	acompanamientos-adicion-granola-x65h	Adición Granola	2500	Adición Granola Para batidos y bowls	\N	Acompañamientos	0	No inventariables	\N	\N
c260a933-f796-416a-9d0c-ab2b4e769e33	acompanamientos-adicion-chia-lt6u	Adición Chía	2500	Adición de Chia para bowls y batidos 	\N	Acompañamientos	0	No inventariables	\N	\N
f0970c1d-9ee1-4a8e-a946-58c01aa22b33	desayunos-desayuno-improvisado-sh00	Desayuno Improvisado	12000	Huevo Revuelto con 2 panes integrales y topings de bowls salados	\N	Desayunos	0	No inventariables	\N	\N
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
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."users" ("id", "username", "email", "created_at") FROM stdin;
\.


--
-- PostgreSQL database dump complete
--

RESET ALL;
