import { z } from 'zod';

export const createBookingSchema = z.object({
  customerId: z.string().uuid('Cliente inválido'),
  roomId: z.string().uuid('Habitación inválida'),
  checkInDate: z.string().min(1, 'La fecha de entrada es requerida'),
  checkOutDate: z.string().min(1, 'La fecha de salida es requerida'),
  numberOfGuests: z.coerce.number().int().min(1, 'Debe haber al menos 1 huésped'),
  source: z.string().optional().default('DIRECT'),
  specialRequests: z.string().max(500).optional().or(z.literal('')),
});

export const updateBookingSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid('Cliente inválido'),
  roomId: z.string().uuid('Habitación inválida'),
  checkInDate: z.string().min(1, 'La fecha de entrada es requerida'),
  checkOutDate: z.string().min(1, 'La fecha de salida es requerida'),
  numberOfGuests: z.coerce.number().int().min(1, 'Debe haber al menos 1 huésped'),
  source: z.string().optional().default('DIRECT'),
  specialRequests: z.string().max(500).optional().or(z.literal('')),
});

export const cancelBookingSchema = z.object({
  id: z.string().uuid(),
  reason: z.string().max(500).optional().or(z.literal('')),
});

export const bookingQuerySchema = z.object({
  search: z.string().optional(),
  statusId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.enum(['createdAt', 'checkInDate']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
export type BookingQueryInput = z.infer<typeof bookingQuerySchema>;
