# Convenciones del Código

## Estructura de Carpetas

```
src/
  app/                          → Rutas de Next.js App Router
    (dashboard)/dashboard/X/    → Ruta para cada módulo
  components/
    layout/                     → Sidebar, Navbar
    ui/                         → Componentes reutilizables (StatCard, Badge, Skeleton)
  features/
    X/                          → Módulo de feature
      types/index.ts            → Interfaces y tipos
      schemas/index.ts          → Schemas Zod
      repositories/X.ts         → Acceso a BD (solo Prisma)
      services/X.ts             → Lógica de negocio
      actions/index.ts          → Server Actions
      components/               → Componentes React del módulo
  lib/
    prisma.ts                   → Cliente singleton de Prisma
    auth/                       → Configuración de NextAuth
      config.ts                 → Config principal
      helpers.ts                → requireAuth(), getCurrentUser()
      middleware.ts              → Config para edge middleware
    logger.ts                   → Logger centralizado
  middleware.ts                 → Edge middleware de auth
```

## Convenciones de Código

### Nombrado

- **Archivos**: `kebab-case.ts` (ej. `booking-detail.tsx`)
- **Componentes**: PascalCase (ej. `BookingDetail`)
- **Funciones**: camelCase (ej. `getBookingsAction`)
- **Tipos/Interfaces**: PascalCase con prefijo (ej. `BookingWithRelations`)
- **Schemas Zod**: camelCase + `Schema` (ej. `createBookingSchema`)

### Server Actions

- Archivo único `actions/index.ts` por módulo
- Prefijo `get*` para consultas, verbo para mutaciones
- Siempre llamar `requireAuth()` al inicio
- Envolver mutaciones en try/catch
- Revalidar ruta después de mutaciones exitosas
- `redirect()` debe ir después de `revalidatePath()`
- Las acciones que hacen redirect deben relanzar `NEXT_REDIRECT` en catch

### Servicios

- Objeto literal exportado (`export const service = { ... }`)
- Validar input con Zod antes de procesar
- Llamar a repositorios, nunca a Prisma directamente
- Lanzar `Error` con mensajes descriptivos

### Repositorios

- Objeto literal exportado (`export const repository = { ... }`)
- Solo consultas Prisma, sin lógica de negocio
- Transacciones con `prisma.$transaction()` para multi-write
- Usar `select` mínimo en dropdowns y catálogos
- Incluir relaciones con `include` tipado

### Prisma

- Cliente: `import { prisma } from "@/lib/prisma"`
- Decimal: convertir con `.toString()` luego `Number()`
- Soft delete: filtrar `deletedAt: null` en consultas
- Tipos: importar de `@/generated/prisma/client`

### TailwindCSS v4

- No hay `tailwind.config.js`
- Tema personalizado en `globals.css` con `@theme inline`
- Animaciones: `fade-in`, `slide-up`, `scale-in`
- Sombras: `shadow-sm` en cards y tablas
- Bordes: `rounded-xl` en cards y contenedores principales

### Zod

- Schemas definidos en `features/X/schemas/index.ts`
- Validación estricta: `.parse()` en lugar de `.safeParse()` en services
- Los schemas de formulario reflejan los nombres de los campos HTML

### Componentes

- Estados: loading (Skeleton), empty (EmptyState), error, success
- Tablas con paginación, búsqueda y filtros
- Diálogos modales con `role="dialog"` y `aria-modal="true"`
- Inputs con `<label>` (sr-only si es necesario)
- Botones de solo ícono requieren `aria-label`
