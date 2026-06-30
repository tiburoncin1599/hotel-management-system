'use server';

import { requireAuth, getCurrentUser } from '@/lib/auth/helpers';
import { paymentService } from '../services/payments';
import { logger } from '@/lib/logger';
import { revalidatePath } from 'next/cache';
import type { PaymentFilters } from '../types';

export type ActionState<T = unknown> = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: T;
};

export async function getPaymentsAction(filters: PaymentFilters) {
  await requireAuth();
  return paymentService.getPayments(filters);
}

export async function getPaymentByIdAction(id: string) {
  await requireAuth();
  return paymentService.getPaymentById(id);
}

export async function getBookingPaymentsAction(bookingId: string) {
  await requireAuth();
  return paymentService.getBookingPayments(bookingId);
}

export async function getBookingFinancialSummaryAction(bookingId: string) {
  await requireAuth();
  return paymentService.getBookingFinancialSummary(bookingId);
}

export async function createPaymentAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();
  const user = await getCurrentUser();
  const userEmail = user?.email ?? 'unknown@example.com';
  const userId = user?.id ?? '';

  try {
    const input: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      input[key] = value;
    }
    await paymentService.createPayment(input, userId, userEmail);
    revalidatePath('/dashboard/pagos');
    return { success: true, message: 'Pago creado exitosamente' };
  } catch (e) {
    logger.error('Error al crear pago', { error: e instanceof Error ? e.message : e });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al crear el pago',
    };
  }
}

export async function updatePaymentAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const input: Record<string, unknown> = {};
  let paymentId = '';
  for (const [key, value] of formData.entries()) {
    if (key === 'id') {
      paymentId = value as string;
    } else {
      input[key] = value;
    }
  }

  try {
    await paymentService.updatePayment(paymentId, input);
    revalidatePath('/dashboard/pagos');
    return { success: true, message: 'Pago actualizado exitosamente' };
  } catch (e) {
    logger.error('Error al actualizar pago', {
      paymentId,
      error: e instanceof Error ? e.message : e,
    });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al actualizar el pago',
    };
  }
}

export async function cancelPaymentAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const paymentId = formData.get('id') as string;

  try {
    const reason = formData.get('reason') as string | undefined;
    await paymentService.cancelPayment(paymentId, reason);
    revalidatePath('/dashboard/pagos');
    return { success: true, message: 'Pago cancelado exitosamente' };
  } catch (e) {
    logger.error('Error al cancelar pago', {
      paymentId,
      error: e instanceof Error ? e.message : e,
    });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al cancelar el pago',
    };
  }
}

export async function getPaymentMethodsAction() {
  await requireAuth();
  return paymentService.getPaymentMethods();
}

export async function getCurrenciesAction() {
  await requireAuth();
  return paymentService.getCurrencies();
}
