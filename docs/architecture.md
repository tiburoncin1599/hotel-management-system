# Arquitectura del Sistema

## Stack Tecnológico

| Capa          | Tecnología                      |
| ------------- | ------------------------------- |
| Framework     | Next.js 15.5 (App Router)       |
| UI            | React 19, TypeScript 5          |
| Estilos       | TailwindCSS v4                  |
| Base de datos | PostgreSQL + Prisma 7 ORM       |
| Autenticación | NextAuth v5 (Credentials + JWT) |
| Validación    | Zod 4                           |
| Charts        | Recharts                        |
| Testing       | Vitest + Playwright             |

## Patrón Arquitectónico

El proyecto sigue una **arquitectura modular basada en features** con separación estricta de capas:

```
app/ (rutas)
  └── features/X/
        ├── types/        → Tipos e interfaces
        ├── schemas/      → Schemas Zod de validación
        ├── repositories/ → Consultas Prisma (solo BD)
        ├── services/     → Lógica de negocio
        ├── actions/      → Server Actions ("use server")
        └── components/   → Componentes React
```

### Flujo de datos

```
Petición HTTP
    ↓
app/page.tsx (Server Component)
    ↓
features/X/actions/ (Server Action — "use server")
    ├── requireAuth() — verifica sesión
    ↓
features/X/services/ — lógica de negocio + validación Zod
    ↓
features/X/repositories/ — consultas Prisma
    ↓
Prisma ORM → PostgreSQL
    ↓
Respuesta → actions → componente
```

### Principios

- **Sin imports entre features**: cada módulo es independiente
- **Lógica de negocio solo en services/**: nunca en actions ni componentes
- **BD solo en repositories/**: los services nunca llaman a Prisma directamente
- **Server Actions como orquestadores**: validan auth, llaman a services, revalidan caché
- **Multi-write en transactions**: `prisma.$transaction()` en repository
- **Soft delete**: `deletedAt` + `deletedById` en lugar de borrado físico

## Módulos Implementados

| Módulo        | Funcionalidad                                          |
| ------------- | ------------------------------------------------------ |
| Dashboard     | Métricas en tiempo real, gráficos, actividad reciente  |
| Habitaciones  | CRUD, tipos, estados, precios, mantenimiento           |
| Clientes      | CRUD, países, documentos, búsqueda                     |
| Reservas      | CRUD, promociones, historial de estados, superposición |
| Check-In/Out  | Check-in transaccional, check-out, detalle de estadía  |
| Pagos         | CRUD, métodos, monedas, cancelación/reenbolso          |
| Facturas      | Generación desde reserva, PDF imprimible, cancelación  |
| Autenticación | Login con credenciales, JWT, middleware de protección  |
