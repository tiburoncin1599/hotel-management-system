'use server';

import { checkinService } from '../services/checkin';
import { requireAuth } from '@/lib/auth/helpers';
import { logger } from '@/lib/logger';
import { revalidatePath } from 'next/cache';

export type ActionState<T = unknown> = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: T;
};

export async function getPendingCheckInsAction() {
  await requireAuth();
  return checkinService.getPendingCheckIns();
}

export async function getActiveGuestsAction() {
  await requireAuth();
  return checkinService.getActiveGuests();
}

export async function getReadyForCheckOutAction() {
  await requireAuth();
  return checkinService.getReadyForCheckOut();
}

export async function getStayDetailAction(bookingId: string) {
  await requireAuth();
  return checkinService.getStayDetail(bookingId);
}

export async function checkInGuestAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAuth();

  try {
    const raw = {
      bookingId: formData.get('bookingId'),
      idCardVerified: formData.get('idCardVerified') === 'on',
      notes: formData.get('notes'),
    };
    await checkinService.checkInGuest(raw, user.id!, user.email!);
    revalidatePath('/dashboard/check');
    return { success: true, message: 'Check-in realizado exitosamente' };
  } catch (e) {
    logger.error('Error en check-in', { error: e instanceof Error ? e.message : e });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al realizar el check-in',
    };
  }
}

export async function checkOutGuestAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAuth();

  try {
    const raw = {
      bookingId: formData.get('bookingId'),
      damageCharges: formData.get('damageCharges'),
      notes: formData.get('notes'),
    };
    await checkinService.checkOutGuest(raw, user.id!, user.email!);
    revalidatePath('/dashboard/check');
    return { success: true, message: 'Check-out realizado exitosamente' };
  } catch (e) {
    logger.error('Error en check-out', { error: e instanceof Error ? e.message : e });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al realizar el check-out',
    };
  }
}
