import { z } from 'zod';

export const checkInSchema = z.object({
  bookingId: z.string().uuid('Reserva inválida'),
  idCardVerified: z.coerce.boolean().optional().default(false),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export const checkOutSchema = z.object({
  bookingId: z.string().uuid('Reserva inválida'),
  damageCharges: z
    .string()
    .optional()
    .transform((v) => (v ? parseFloat(v) : 0))
    .pipe(z.number().min(0).max(100000)),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export type CheckInInput = z.infer<typeof checkInSchema>;
export type CheckOutInput = z.infer<typeof checkOutSchema>;
