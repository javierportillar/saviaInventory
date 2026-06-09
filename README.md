# 🥗 Savia Inventory

**Sistema de punto de venta, inventario, cocina y analítica** para la cadena de restaurantes **Savia** — construido como SPA con React, TypeScript y Supabase.

| Categoría | Tecnologías |
|----------|-------------|
| **Frontend** | React 18, TypeScript 5, Vite 5, Tailwind CSS 3 |
| **Backend & DB** | Supabase (PostgreSQL + Auth + Realtime) |
| **AI** | Google Generative AI (`@google/genai`, `@google/generative-ai`) |
| **Testing** | Vitest, Testing Library, jsdom (setup listo, sin tests escritos) |
| **Deploy** | GitHub Pages (`gh-pages` → `docs/`) |
| **Íconos** | Lucide React |

---

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Arquitectura](#arquitectura)
- [Módulos](#módulos)
- [Lógica de Negocio Destacada](#lógica-de-negocio-destacada)
- [Esquema de Base de Datos](#esquema-de-base-de-datos)
- [Desarrollo Local](#desarrollo-local)
- [Variables de Entorno](#variables-de-entorno)
- [Despliegue](#despliegue)
- [Testing](#testing)
- [Roadmap Técnico](#roadmap-técnico)

---

## Descripción General

**Savia Inventory** es una aplicación web integral para la gestión operativa de restaurantes Savia. Cubre el ciclo completo:

1. **Caja (POS)** — registro de pedidos con menú completo, bowls personalizables, combos, descuentos
2. **Cocina** — despliegue de pedidos en tiempo real para producción
3. **Inventario** — control de insumos con alertas de stock mínimo
4. **Clientes & Crédito** — registro de clientes, crédito empleado con liquidación
5. **Gastos & Contabilidad** — registro de egresos con historial de precios
6. **Analítica** — visualización de ventas, rentabilidad, tendencias + estrategias AI generadas
7. **Configuración** — descuentos dinámicos (estudiante, seguidor, combo)

> **Estado actual:** Producción. Desplegado en GitHub Pages con backend Supabase.

---

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                    GitHub Pages                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │              React SPA (Vite build)              │ │
│  │                                                   │ │
│  │  App.tsx ─── Auth (local creds + 13h session)    │ │
│  │     │                                              │ │
│  │     ├── Dashboard (visión general del día)        │ │
│  │     ├── Caja (POS + carrito + bowls + pagos)      │ │
│  │     ├── Cocina (pedidos activos)                  │ │
│  │     ├── Inventario (insumos + stock)              │ │
│  │     ├── Comandas (historial de pedidos)           │ │
│  │     ├── Clientes / Empleados / Gastos             │ │
│  │     ├── Contabilidad / Analitica / Novedades      │ │
│  │     ├── CreditoEmpleados / Configuracion          │ │
│  │     └── AIStrategyModal (Gemini)                  │ │
│  │                                                   │ │
│  │  lib/dataService.ts ──── capa de acceso a datos   │ │
│  │       │                                            │ │
│  │       ├── Supabase client (prod)                   │ │
│  │       └── LocalData (fallback + localStorage)      │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────┐
│              Supabase (Backend as a Service)          │
│  ┌─────────────┐ ┌──────────────┐ ┌───────────────┐ │
│  │  PostgreSQL  │ │    Auth      │ │   Realtime    │ │
│  │  (8 migs)    │ │  (anon key)  │ │  (suscriptions)│ │
│  └─────────────┘ └──────────────┘ └───────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Flujo de datos

```
Usuario → React Component → dataService.ts → ¿Supabase online?
                                                  ├── Sí → CRUD a Supabase
                                                  └── No → localStorage (offline)
```

La aplicación funciona en modo **offline-first**: si Supabase no responde, lee y escribe desde `localStorage` usando los datos semilla en `src/data/localData.ts`.

---

## Módulos

| Módulo | Archivo | Descripción |
|--------|---------|-------------|
| **Dashboard** | `Dashboard.tsx` | Resumen del día: ventas, pedidos activos, alertas de stock, comisiones |
| **Caja (POS)** | `Caja.tsx` (~1200 lines) | Punto de venta completo: carrito, constructor de bowls, combos, descuentos, pago dividido en múltiples métodos |
| **Cocina** | `Cocina.tsx` | Display de pedidos entrantes para preparación |
| **Comandas** | `Comandas.tsx` | Historial de pedidos con filtros y búsqueda |
| **Inventario** | `Inventario.tsx` | CRUD de insumos, control de stock, alertas de mínimo, entrada/salida |
| **Clientes** | `Clientes.tsx` | CRUD de clientes, historial de compras |
| **Empleados** | `Empleados.tsx` | Gestión de empleados |
| **Gastos** | `Gastos.tsx` | Registro de egresos, historial de precios por insumo |
| **Contabilidad** | `Contabilidad.tsx` | Corte de caja, resumen financiero |
| **Analítica** | `Analitica.tsx` | Gráficos de ventas, rentabilidad por producto, tendencias temporales |
| **AI Strategy** | `AIStrategyModal.tsx` | Estrategias de marketing generadas por Google Gemini basadas en datos de ventas |
| **Crédito Empleados** | `CreditoEmpleados.tsx` | Asignación y liquidación de crédito para empleados |
| **Novedades** | `Novedades.tsx` | Registro de novedades operativas |
| **Configuración** | `Configuracion.tsx` | Descuentos: combo, estudiante, seguidor de redes |
| **Login** | `Login.tsx` | Autenticación con credenciales locales + sesión por localStorage |
| **Navigation** | `Navigation.tsx` | Sidebar de navegación principal |

---

## Lógica de Negocio Destacada

### Bowls personalizables (`constants/bowl.ts`)

Dos tipos de bowl — **Salado** y **Frutal** — cada uno con:
- Base, proteína, toppings, aderezos y extras
- Precio dinámico según opciones seleccionadas
- Reglas de negocio: proteína extra tiene costo adicional, ciertos toppings solo aplican a un tipo de bowl

### Sistema de descuentos (`constants/drinkDiscount.ts`, `Configuracion.tsx`)

Tres tipos de descuento configurables desde la UI:
| Descuento | Lógica |
|-----------|--------|
| **Combo** | Porcentaje fijo sobre combos (comida + bebida) |
| **Estudiante** | Porcentaje sobre total, requiere identificación |
| **Seguidor** | Porcentaje por seguir redes sociales |

### Pago dividido (multi-método) (`Caja.tsx`, `payments.ts`)

Un pedido puede pagarse con **hasta 5 métodos distintos** simultáneamente:

| Método | Descripción |
|--------|-------------|
| `efectivo` | Pago en efectivo, calcula cambio |
| `tarjeta` | Pago con tarjeta débito/crédito |
| `nequi` | Transferencia Nequi |
| `provision` | Cargo a provisión interna |
| `credito_empleados` | Cargo a crédito de empleado (requiere liquidación posterior) |

El modal de pago valúa que los montos asignados sumen exactamente el total.

### Crédito empleados con liquidación (`CreditoEmpleados.tsx`)

- Los empleados pueden consumir a crédito
- Cada consumo se registra contra el empleado
- La liquidación paga total o parcialmente la deuda
- Historial completo de cargos y abonos (migración `credito_empleados_pagos`)

### Analítica con IA generativa (`Analitica.tsx`, `AIStrategyModal.tsx`)

- Dashboard con gráficos de ventas diarias/semanales/mensuales
- Top productos por ingresos y cantidad
- Rentabilidad por ítem
- Estrategias de marketing generadas por **Google Gemini** basadas en los datos de ventas del período seleccionado

### Mesa de ayuda / WhatsApp

El sidebar incluye enlaces directos a:
- WhatsApp de la mesa de ayuda
- Llamada telefónica a soporte

---

## Esquema de Base de Datos

El esquema completo está definido en 8 migraciones de Supabase (`supabase/migrations/`) más un archivo de exportación `unified_schema_and_seed_v4.sql`.

### Tablas principales

| Tabla | Propósito |
|-------|-----------|
| `menu_items` | Catálogo de productos (platos, bowls, bebidas, extras) |
| `bowl_options` | Opciones configurables para bowls salados y frutales |
| `combos` | Definición de combos (items + descuento) |
| `orders` | Pedidos con estado, total, método de pago, items |
| `order_items` | Items individuales dentro de cada pedido |
| `order_payments` | Desglose de pagos por método |
| `inventario` | Insumos con cantidad actual y stock mínimo |
| `inventario_movimientos` | Historial de entradas/salidas de inventario |
| `inventario_precios` | Historial de precios por insumo |
| `gastos` | Registro de egresos operativos |
| `clients` | Datos de clientes e historial |
| `empleados` | Gestión de empleados |
| `credito_empleados` | Línea de crédito por empleado |
| `credito_empleados_pagos` | Abonos y liquidaciones de crédito |
| `novedades` | Registro de novedades |
| `daily_summary` | Resumen diario de operaciones |

### Seguridad

- **Row Level Security (RLS)** habilitado en todas las tablas
- Acceso público vía anon key con políticas restrictivas por operación

---

## Desarrollo Local

### Requisitos

- Node.js ≥ 18
- npm ≥ 9
- Una cuenta de Supabase (gratuita)

### Instalación

```bash
git clone https://github.com/javierportillar/saviaInventory.git
cd saviaInventory
npm install
```

### Variables de entorno

Crea un archivo `.env` en la raíz:

```env
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<tu-anon-key>
```

> Las migraciones están en `supabase/migrations/`. Puedes aplicar el esquema completo desde `unified_schema_and_seed_v4.sql` directamente en el SQL Editor de Supabase.

### Ejecutar en desarrollo

```bash
npm run dev
# → http://localhost:5173
```

### Usuarios de prueba

Los usuarios están definidos en `src/data/users.ts`. Las credenciales se cargan al iniciar sesión. No hay registro público — la aplicación espera que un administrador cree los usuarios localmente.

---

## Despliegue

```bash
npm run build    # → tsc + vite build → output en docs/
npm run deploy   # → gh-pages -d docs → publica a GitHub Pages
```

El `base` path se configura automáticamente:
- **Producción**: usa `VITE_BASE_PATH` del entorno o `./` por defecto
- **Desarrollo**: siempre `/`

> **Importante**: El directorio `docs/` está versionado en git y es el artefacto de deploy. Es la salida del build.

---

## Testing

El proyecto tiene **Vitest** configurado con jsdom y Testing Library (`@testing-library/react`, `@testing-library/jest-dom`), pero **no hay tests escritos** aún.

```bash
npm test         # → vitest (0 tests)
npm run coverage # → vitest run --coverage
```

### Pendiente

- Tests unitarios para `dataService.ts` (~58 KB de lógica crítica)
- Tests de componentes para Caja (flujo de carrito, bowls, pagos)
- Tests de integración para el flujo POS → Cocina → Comandas
- Tests E2E con Playwright para el ciclo completo de caja

---

## Roadmap Técnico

- [ ] **Tests**: cobertura mínima del 60% en lógica de negocio y componentes críticos
- [ ] **Autenticación real**: migrar de credenciales locales a Supabase Auth con magic links
- [ ] **WebSockets**: pedidos en tiempo real para Cocina (hoy usa polling/peticiones)
- [ ] **PWA**: service worker para offline completo + instalable en home screen
- [ ] **Multi-sede**: soporte para múltiples restaurantes con datos aislados
- [ ] **Reportes**: exportación de reportes contables en PDF/Excel

---

## Licencia

ISC — ver [LICENSE](LICENSE) para más detalles.

---

## Enlaces

| Recurso | URL |
|---------|-----|
| App en producción | [javierportillar.github.io/saviaInventory](https://javierportillar.github.io/saviaInventory/) |
| Repositorio | [github.com/javierportillar/saviaInventory](https://github.com/javierportillar/saviaInventory) |
| Issues | [github.com/javierportillar/saviaInventory/issues](https://github.com/javierportillar/saviaInventory/issues) |
| Supabase Dashboard | [Supabase Console](https://supabase.com/dashboard/project/nrpzetdjwayaxzbcgeba) |
