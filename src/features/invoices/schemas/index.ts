import { z } from 'zod';

export const generateInvoiceSchema = z.object({
  bookingId: z.string().uuid('Reserva inválida'),
  issueDate: z.string().min(1, 'La fecha es requerida'),
  dueDate: z.string().optional().or(z.literal('')),
  taxRate: z.string().optional().or(z.literal('')),
  notes: z.string().max(500).optional().or(z.literal('')),
  currencyId: z.string().uuid('Moneda inválida').optional().or(z.literal('')),
});

export const cancelInvoiceSchema = z.object({
  id: z.string().uuid(),
  reason: z.string().min(1, 'El motivo es requerido'),
});

export const invoiceQuerySchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.enum(['issueDate', 'totalAmount', 'createdAt']).optional().default('issueDate'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type GenerateInvoiceInput = z.infer<typeof generateInvoiceSchema>;
export type CancelInvoiceInput = z.infer<typeof cancelInvoiceSchema>;
