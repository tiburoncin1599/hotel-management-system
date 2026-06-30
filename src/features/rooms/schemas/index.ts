import { z } from 'zod';

export const createRoomSchema = z.object({
  roomNumber: z.string().min(1, 'El número de habitación es requerido').max(10),
  floor: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : null))
    .pipe(z.number().int().min(0).max(100).nullable()),
  roomTypeId: z.string().uuid('Tipo de habitación inválido'),
  statusId: z.string().uuid('Estado inválido'),
});

export const updateRoomSchema = z.object({
  id: z.string().uuid(),
  roomNumber: z.string().min(1, 'El número de habitación es requerido').max(10),
  floor: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : null))
    .pipe(z.number().int().min(0).max(100).nullable()),
  roomTypeId: z.string().uuid('Tipo de habitación inválido'),
  statusId: z.string().uuid('Estado inválido'),
});

export const roomQuerySchema = z.object({
  statusId: z.string().optional(),
  roomTypeId: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type RoomQueryInput = z.infer<typeof roomQuerySchema>;
