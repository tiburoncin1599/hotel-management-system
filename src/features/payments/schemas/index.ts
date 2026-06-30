import { z } from 'zod';

export const createPaymentSchema = z.object({
  bookingId: z.string().uuid('Reserva inválida'),
  paymentMethodId: z.string().uuid('Método de pago inválido'),
  currencyId: z.string().uuid('Moneda inválida').optional().or(z.literal('')),
  amount: z
    .string()
    .transform((v) => parseFloat(v))
    .pipe(z.number().positive('El monto debe ser mayor a cero').max(9999999.99)),
  transactionDate: z.string().min(1, 'La fecha es requerida'),
  referenceNumber: z.string().max(100).optional().or(z.literal('')),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export const updatePaymentSchema = z.object({
  id: z.string().uuid(),
  paymentMethodId: z.string().uuid('Método de pago inválido'),
  currencyId: z.string().uuid('Moneda inválida').optional().or(z.literal('')),
  amount: z
    .string()
    .transform((v) => parseFloat(v))
    .pipe(z.number().positive('El monto debe ser mayor a cero').max(9999999.99)),
  transactionDate: z.string().min(1, 'La fecha es requerida'),
  referenceNumber: z.string().max(100).optional().or(z.literal('')),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export const cancelPaymentSchema = z.object({
  id: z.string().uuid(),
  reason: z.string().max(500).optional().or(z.literal('')),
});

export const paymentQuerySchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  paymentMethodId: z.string().optional(),
  currencyId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.enum(['transactionDate', 'amount', 'createdAt']).optional().default('transactionDate'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type CancelPaymentInput = z.infer<typeof cancelPaymentSchema>;
export type PaymentQueryInput = z.infer<typeof paymentQuerySchema>;
