import { z } from 'zod';

export const createCustomerSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido').max(100),
  lastName: z.string().min(1, 'El apellido es requerido').max(100),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().max(30).optional().or(z.literal('')),
  documentType: z.string().max(20).optional().or(z.literal('')),
  documentNumber: z.string().max(30).optional().or(z.literal('')),
  countryId: z.string().uuid('País inválido').optional().or(z.literal('')),
  address: z.string().max(200).optional().or(z.literal('')),
});

export const updateCustomerSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1, 'El nombre es requerido').max(100),
  lastName: z.string().min(1, 'El apellido es requerido').max(100),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().max(30).optional().or(z.literal('')),
  documentType: z.string().max(20).optional().or(z.literal('')),
  documentNumber: z.string().max(30).optional().or(z.literal('')),
  countryId: z.string().uuid('País inválido').optional().or(z.literal('')),
  address: z.string().max(200).optional().or(z.literal('')),
});

export const customerQuerySchema = z.object({
  search: z.string().optional(),
  countryId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type CustomerQueryInput = z.infer<typeof customerQuerySchema>;
