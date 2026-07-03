# 🏨 Hotel Management System

Sistema web completo para la administración de hoteles desarrollado con Next.js.

## Demo

https://TU-PROYECTO.vercel.app

---

# Tecnologías

- Next.js 15
- React 19
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- Auth.js
- Tailwind CSS
- Zod
- Recharts

---

# Funcionalidades

- Login seguro
- Dashboard
- Gestión de habitaciones
- Gestión de clientes
- Reservas
- Check-In
- Check-Out
- Pagos
- Facturas
- Reportes
- Configuración

---

# Capturas

## Landing

![Landing](docs/images/landing.png)

## Login

![Login](docs/images/login.png)

## Dashboard

![Dashboard](docs/images/dashboard.png)

## Habitaciones

![Rooms](docs/images/rooms.png)

## Reservas

![Bookings](docs/images/bookings.png)

## Pagos

![Payments](docs/images/payments.png)

## Facturas

![Invoices](docs/images/invoice.png)

## Reportes

![Reports](docs/images/reports.png)

---

# Instalación

```bash
git clone https://github.com/TU-USUARIO/hotel-management-system.git

cd hotel-management-system

npm install
```

Crear archivo `.env`

```
DATABASE_URL=

AUTH_SECRET=

AUTH_URL=http://localhost:3000
```

Luego ejecutar

```bash
npx prisma migrate deploy

npm run seed

npm run dev
```

---

# Arquitectura

```
src/

features/

components/

lib/

prisma/

docs/
```

---

# Autor

Andrés Aguirre
