# API

El sistema no expone una API REST tradicional. Toda la comunicación con el backend se realiza mediante **Server Actions** de Next.js.

## Patrón de Server Actions

Cada módulo expone acciones en `features/X/actions/index.ts` con el patrón:

```typescript
'use server';

import { requireAuth } from '@/lib/auth/helpers';
import { service } from '../services/X';
import { revalidatePath } from 'next/cache';

export async function listAction(filters) {
  await requireAuth();
  return service.list(filters);
}

export async function mutateAction(prevState, formData): Promise<ActionState> {
  const user = await requireAuth();
  try {
    // procesar formData
    await service.mutate(input, user.id!);
    revalidatePath('/dashboard/X');
    return { success: true, message: 'Operación exitosa' };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : 'Error' };
  }
}
```

## Acciones por módulo

### Dashboard

- `getDashboardDataAction()` — métricas, charts, actividad reciente

### Habitaciones (`/dashboard/habitaciones`)

- `getRoomsAction(filters)` — lista paginada
- `getRoomByIdAction(id)` — detalle
- `getRoomStatusesAction()` — catálogo de estados
- `getRoomTypesAction()` — catálogo de tipos
- `createRoomAction(prevState, formData)` — crear
- `updateRoomAction(prevState, formData)` — actualizar
- `deleteRoomAction(prevState, formData)` — eliminar (soft delete)

### Clientes (`/dashboard/clientes`)

- `getCustomersAction(filters)` — lista paginada
- `getCustomerByIdAction(id)` — detalle
- `getCountriesAction()` — catálogo de países
- `createCustomerAction(prevState, formData)` — crear
- `updateCustomerAction(prevState, formData)` — actualizar
- `deleteCustomerAction(prevState, formData)` — eliminar (soft delete)

### Reservas (`/dashboard/reservas`)

- `getBookingsAction(filters)` — lista paginada
- `getBookingByIdAction(id)` — detalle
- `getBookingStatusesAction()` — catálogo
- `getCustomersAction()` — para selector
- `getRoomsAction()` — para selector
- `createBookingAction(prevState, formData)` — crear
- `updateBookingAction(prevState, formData)` — actualizar
- `cancelBookingAction(prevState, formData)` — cancelar

### Check-In/Out (`/dashboard/check`)

- `getPendingCheckInsAction()` — reservas pendientes de check-in
- `getActiveGuestsAction()` — huéspedes activos
- `getReadyForCheckOutAction()` — listos para check-out
- `getStayDetailAction(bookingId)` — detalle de estadía
- `checkInGuestAction(prevState, formData)` — check-in
- `checkOutGuestAction(prevState, formData)` — check-out

### Pagos (`/dashboard/pagos`)

- `getPaymentsAction(filters)` — lista paginada
- `getPaymentByIdAction(id)` — detalle
- `getBookingPaymentsAction(bookingId)` — pagos de reserva
- `getBookingFinancialSummaryAction(bookingId)` — resumen financiero
- `getPaymentMethodsAction()` — catálogo
- `getCurrenciesAction()` — catálogo
- `createPaymentAction(prevState, formData)` — crear
- `updatePaymentAction(prevState, formData)` — actualizar
- `cancelPaymentAction(prevState, formData)` — cancelar

### Facturas (`/dashboard/facturas`)

- `getInvoicesAction(filters)` — lista paginada
- `getInvoiceByIdAction(id)` — detalle
- `getInvoiceByBookingIdAction(bookingId)` — por reserva
- `generateInvoiceAction(prevState, formData)` — generar
- `cancelInvoiceAction(prevState, formData)` — anular

## Formato de respuesta (ActionState)

```typescript
type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: T;
};
```

## Errores comunes

- `401` — `requireAuth()` redirige a `/login`
- `400` — validación Zod falla (errores en `errors`)
- `409` — conflicto (ej. superposición de reservas)
- `500` — error interno (mensaje genérico al usuario)
