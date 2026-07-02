import { z } from 'zod';

export const reportPeriodSchema = z.enum(['daily', 'weekly', 'monthly', 'annual', 'range']);

export const reportQuerySchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  period: reportPeriodSchema.default('monthly'),
});

export const exportSchema = z.object({
  format: z.enum(['pdf', 'excel']),
  reportType: z.string().min(1, 'El tipo de reporte es requerido'),
  filters: reportQuerySchema,
});

export type ReportQueryInput = z.infer<typeof reportQuerySchema>;
export type ExportInput = z.infer<typeof exportSchema>;
