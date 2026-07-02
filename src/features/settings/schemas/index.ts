import { z } from 'zod';

export const hotelInfoSchema = z.object({
  name: z.string().min(1, 'El nombre del hotel es requerido').max(200),
  logo: z.string().max(500).optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  phone: z.string().max(30).optional().or(z.literal('')),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  website: z.string().max(200).optional().or(z.literal('')),
  currency: z.string().min(1, 'La moneda es requerida'),
  timezone: z.string().min(1, 'La zona horaria es requerida'),
});

export const generalConfigSchema = z.object({
  taxRate: z
    .string()
    .transform((v) => parseFloat(v))
    .pipe(z.number().min(0).max(100)),
  defaultCurrency: z.string().min(1, 'La moneda predeterminada es requerida'),
  dateFormat: z.string().min(1, 'El formato de fecha es requerido'),
  timeFormat: z.string().min(1, 'El formato de hora es requerido'),
});

export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  roleId: z.string().uuid('Rol inválido'),
});

export const updateUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email('Email inválido').optional(),
  roleId: z.string().uuid('Rol inválido').optional(),
  isActive: z
    .string()
    .optional()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
});

export const createRoleSchema = z.object({
  name: z.string().min(1, 'El nombre del rol es requerido').max(100),
  description: z.string().max(300).optional().or(z.literal('')),
});

export const updateRoleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'El nombre del rol es requerido').max(100),
  description: z.string().max(300).optional().or(z.literal('')),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
    newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmar contraseña es requerido'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export const notificationConfigSchema = z.object({
  emailNotifications: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
  pushNotifications: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
  bookingAlerts: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
  paymentAlerts: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
  systemAlerts: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
});

export type HotelInfoInput = z.infer<typeof hotelInfoSchema>;
export type GeneralConfigInput = z.infer<typeof generalConfigSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type NotificationConfigInput = z.infer<typeof notificationConfigSchema>;
