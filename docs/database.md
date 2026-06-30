# Base de Datos

## Tecnología

- **Motor**: PostgreSQL
- **ORM**: Prisma 7 con `@prisma/adapter-pg` (driver adaptador nativo)
- **Generador**: `prisma-client` (no `prisma-client-js`)

## Esquema

El schema se encuentra en `prisma/schema.prisma` (~875 líneas) con 21 modelos y 8 enums.

### Modelos principales

#### Seguridad y usuarios

- `User` — usuarios del sistema con email, password (bcrypt), rol
- `Role`, `Permission`, `RolePermission` — RBAC
- `Employee` — datos laborales

#### Catálogos

- `Country` — países (para clientes)
- `Currency` — monedas (para pagos y facturas)
- `RoomStatus` — estados de habitación (disponible, ocupada, etc.)
- `RoomType` — tipos de habitación con precio base
- `Amenity`, `RoomTypeAmenity` — comodidades por tipo
- `PaymentMethod` — métodos de pago
- `BookingStatus` — estados de reserva

#### Negocio

- `Customer` — clientes con documentos y dirección
- `Room` — habitaciones con número, piso, tipo y estado
- `RoomImage`, `RoomPriceHistory` — imágenes e histórico de precios
- `Promotion`, `PromotionRoomType` — promociones por tipo
- `Booking` — reservas con fechas, huéspedes, monto, referido
- `BookingStatusHistory` — auditoría de cambios de estado
- `CheckIn`, `CheckOut` — registros de entrada/salida
- `Payment` — pagos con método, moneda, referencia, estado
- `Invoice`, `InvoiceDetail` — facturación con detalle de cargos
- `Service`, `ServiceConsumption` — servicios consumidos
- `HousekeepingTask` — tareas de limpieza y mantenimiento
- `HotelConfiguration` — configuración global
- `Notification`, `AuditLog` — notificaciones y auditoría

### Convenciones

- **Soft delete**: `deletedAt DateTime?` + `deletedById String?` en modelos principales
- **Auditoría**: `createdById`, `updatedById`, `createdAt`, `updatedAt`
- **IDs**: `String @id @default(cuid())`
- **Decimales**: campos monetarios usan `Decimal` de Prisma (convertir con `.toString()` + `Number()`)
- **Enums en BD**: `InvoiceStatus`, `PaymentStatus`, `BookingSource`, etc.

### Relaciones clave

- `Booking` → `Customer` (N:1), `Room` (N:1), `Promotion?` (N:1)
- `Booking` ↔ `Invoice` (1:1, unique en bookingId)
- `Booking` → `CheckIn` (1:1), `CheckOut` (1:1)
- `Payment` → `Booking` (N:1), `PaymentMethod` (N:1), `Currency` (N:1)
- `Invoice` → `InvoiceDetail[]` (1:N)

## Migraciones

```bash
# Crear migración
npx prisma migrate dev --name descripcion

# Aplicar a producción
npx prisma migrate deploy

# Seed
npm run seed
```
