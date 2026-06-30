'use server';

import { requireAuth } from '@/lib/auth/helpers';
import { invoiceService } from '../services/invoices';
import { logger } from '@/lib/logger';
import { revalidatePath } from 'next/cache';
import type { InvoiceFilters } from '../types';

export type ActionState<T = unknown> = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: T;
};

export async function getInvoicesAction(filters: InvoiceFilters) {
  await requireAuth();
  return invoiceService.getInvoices(filters);
}

export async function getInvoiceByIdAction(id: string) {
  await requireAuth();
  return invoiceService.getInvoiceById(id);
}

export async function getInvoiceByBookingIdAction(bookingId: string) {
  await requireAuth();
  return invoiceService.getInvoiceByBookingId(bookingId);
}

export async function generateInvoiceAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAuth();

  try {
    const input: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      input[key] = value;
    }
    await invoiceService.generateInvoice(input, user.id!);
    revalidatePath('/dashboard/facturas');
    return { success: true, message: 'Factura generada exitosamente' };
  } catch (e) {
    logger.error('Error al generar factura', { error: e instanceof Error ? e.message : e });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al generar la factura',
    };
  }
}

export async function cancelInvoiceAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const invoiceId = formData.get('id') as string;

  try {
    const reason = formData.get('reason') as string;
    await invoiceService.cancelInvoice(invoiceId, reason);
    revalidatePath('/dashboard/facturas');
    return { success: true, message: 'Factura anulada exitosamente' };
  } catch (e) {
    logger.error('Error al anular factura', {
      invoiceId,
      error: e instanceof Error ? e.message : e,
    });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al anular la factura',
    };
  }
}
