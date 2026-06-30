# Hotel Management System

Sistema de gestión hotelera integral con módulos de reservas, check-in/check-out, pagos y facturación. Construido con Next.js 15, Prisma 7 y PostgreSQL.

## 🏗️ Stack

| Frontend                  | Backend             | BD                 | Auth              |
| ------------------------- | ------------------- | ------------------ | ----------------- |
| Next.js 15.5 (App Router) | Server Actions      | PostgreSQL 15      | NextAuth v5       |
| React 19 + TypeScript 5   | Prisma 7 ORM        | @prisma/adapter-pg | Credentials + JWT |
| TailwindCSS v4            | Zod 4               | Migraciones        | bcryptjs          |
| Recharts                  | Vitest + Playwright | —                  | Middleware Edge   |

## 📁 Estructura

```
src/
  app/                        → Rutas (App Router)
    (dashboard)/dashboard/X/  → Páginas por módulo
  components/
    layout/                   → Sidebar, Navbar
    ui/                       → StatCard, Badge, Skeleton, EmptyState
  features/
    X/                        → Módulo con capas:
      types/                  →   Interfaces
      schemas/                →   Validación Zod
      repositories/           →   Consultas Prisma
      services/               →   Lógica de negocio
      actions/                →   Server Actions
      components/             →   Componentes React
  lib/
    prisma.ts                 → Cliente Prisma singleton
    auth/                     → NextAuth config + helpers
    logger.ts                 → Logger centralizado
  middleware.ts               → Edge auth middleware
```

## ✨ Funcionalidades

### Dashboard

- Métricas en tiempo real: habitaciones, ingresos, ocupación
- 4 gráficos interactivos (Recharts): reservas por mes, ingresos, métodos de pago, top habitaciones
- Feed de actividad reciente
- Anillo de ocupación SVG

### Habitaciones

- CRUD completo con tipos, estados y precios
- Historial de precios por habitación
- Soft delete con auditoría
- Búsqueda y filtros

### Clientes

- CRUD con documentos (DNI, pasaporte, etc.)
- Selección de país
- Búsqueda por nombre, email o documento
- Soft delete

### Reservas

- CRUD con detección de superposición de fechas
- Promociones y descuentos
- Historial de cambios de estado
- Cancelación con motivo
- Cálculo automático de noches y totales

### Check-In / Check-Out

- Check-in transaccional (bloquea habitación)
- Check-out con cargos por daños
- Timeline de estadía
- Sección por estados (pendientes, activos, salida)

### Pagos

- CRUD con métodos de pago y monedas
- Resumen financiero por reserva
- Cancelación/reembolso con ajuste de saldo
- Transacciones atómicas (pago + actualización de booking)

### Facturación (PDF)

- Generación automática desde reserva
- Número secuencial `FAC-{año}-{0001}`
- PDF imprimible con `@media print`
- Anulación con motivo
- Integración en detalle de reserva

## 🚀 Instalación

```bash
# 1. Clonar
git clone https://github.com/tuusuario/hotel-management-system.git
cd hotel-management-system

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar DATABASE_URL y AUTH_SECRET

# 4. Migrar BD
npx prisma migrate dev

# 5. Seed (datos demo)
npm run seed

# 6. Iniciar
npm run dev
```

## 🔧 Scripts

| Comando            | Descripción                    |
| ------------------ | ------------------------------ |
| `npm run dev`      | Desarrollo en `localhost:3000` |
| `npm run build`    | Build de producción            |
| `npm run start`    | Iniciar servidor producción    |
| `npm run lint`     | ESLint                         |
| `npm run format`   | Prettier                       |
| `npm test`         | Vitest (watch)                 |
| `npm run test:run` | Vitest (run)                   |
| `npm run test:e2e` | Playwright E2E                 |
| `npm run seed`     | Poblar BD con datos demo       |

## 🌐 Variables de Entorno

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/hotel_management?schema=public"
AUTH_SECRET="openssl rand -hex 32"
AUTH_URL="http://localhost:3000"
```

## 📸 Capturas

> _(Agregar capturas de pantalla aquí)_

<!--
![Dashboard](docs/screenshots/dashboard.png)
![Habitaciones](docs/screenshots/rooms.png)
![Reservas](docs/screenshots/bookings.png)
![Factura PDF](docs/screenshots/invoice-pdf.png)
-->

## 📦 Despliegue

### Vercel

1. Conectar repositorio a Vercel
2. Añadir variables de entorno
3. Migrar BD: `npx prisma migrate deploy`
4. Seed: `npm run seed`

### Requisitos

- Node.js 20+
- PostgreSQL 15+
- Cuenta Vercel

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e
```

## 📚 Documentación

- [Arquitectura](docs/architecture.md)
- [Base de datos](docs/database.md)
- [API (Server Actions)](docs/api.md)
- [Despliegue](docs/deployment.md)
- [Convenciones](docs/conventions.md)

## 🗺️ Roadmap

- [x] Dashboard con métricas reales y gráficos
- [x] Módulo de habitaciones
- [x] Módulo de clientes
- [x] Módulo de reservas con promociones
- [x] Check-In / Check-Out transaccional
- [x] Módulo de pagos con resumen financiero
- [x] Facturación con vista PDF
- [ ] Housekeeping (limpieza y mantenimiento)
- [ ] Servicios y consumos (room service)
- [ ] Reportes exportables (CSV/Excel)
- [ ] Notificaciones email
- [ ] Modo oscuro
- [ ] API REST pública

## 📄 Licencia

MIT
