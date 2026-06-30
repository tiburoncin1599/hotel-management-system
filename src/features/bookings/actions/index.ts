'use server';

import { bookingService } from '../services/bookings';
import { requireAuth } from '@/lib/auth/helpers';
import { logger } from '@/lib/logger';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type {
  BookingFilters,
  PaginatedResult,
  BookingWithRelations,
  RoomWithDetails,
} from '../types';
import type { BookingStatus, Customer } from '@/generated/prisma/client';

export type ActionState<T = unknown> = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: T;
};

export async function getBookingsAction(
  filters: BookingFilters,
): Promise<PaginatedResult<BookingWithRelations>> {
  await requireAuth();
  return bookingService.getBookings(filters);
}

export async function getBookingByIdAction(id: string): Promise<BookingWithRelations | null> {
  await requireAuth();
  return bookingService.getBookingById(id);
}

export async function getBookingStatusesAction(): Promise<BookingStatus[]> {
  await requireAuth();
  return bookingService.getBookingStatuses();
}

export async function getCustomersAction(): Promise<Customer[]> {
  await requireAuth();
  return bookingService.getCustomers();
}

export async function getRoomsAction(): Promise<RoomWithDetails[]> {
  await requireAuth();
  return bookingService.getRooms();
}

export async function createBookingAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAuth();

  try {
    const raw = {
      customerId: formData.get('customerId'),
      roomId: formData.get('roomId'),
      checkInDate: formData.get('checkInDate'),
      checkOutDate: formData.get('checkOutDate'),
      numberOfGuests: formData.get('numberOfGuests'),
      source: formData.get('source'),
      specialRequests: formData.get('specialRequests'),
    };
    const booking = await bookingService.createBooking(raw, user.id!);
    revalidatePath('/dashboard/reservas');
    redirect(`/dashboard/reservas/${booking.id}`);
    return { success: true, message: 'Reserva creada exitosamente' };
  } catch (e) {
    if (e instanceof Error && e.message === 'NEXT_REDIRECT') throw e;
    logger.error('Error al crear reserva', { error: e instanceof Error ? e.message : e });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al crear la reserva',
    };
  }
}

export async function updateBookingAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAuth();

  const id = formData.get('id') as string;
  if (!id) return { success: false, message: 'ID no proporcionado' };

  try {
    const raw = {
      customerId: formData.get('customerId'),
      roomId: formData.get('roomId'),
      checkInDate: formData.get('checkInDate'),
      checkOutDate: formData.get('checkOutDate'),
      numberOfGuests: formData.get('numberOfGuests'),
      source: formData.get('source'),
      specialRequests: formData.get('specialRequests'),
    };
    await bookingService.updateBooking(id, raw, user.id!);
    revalidatePath('/dashboard/reservas');
    redirect('/dashboard/reservas');
    return { success: true, message: 'Reserva actualizada exitosamente' };
  } catch (e) {
    if (e instanceof Error && e.message === 'NEXT_REDIRECT') throw e;
    logger.error('Error al actualizar reserva', {
      bookingId: id,
      error: e instanceof Error ? e.message : e,
    });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al actualizar la reserva',
    };
  }
}

export async function cancelBookingAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAuth();

  const id = formData.get('id') as string;
  if (!id) return { success: false, message: 'ID no proporcionado' };

  try {
    const reason = formData.get('reason') as string | undefined;
    await bookingService.cancelBooking(id, reason, user.id!);
    revalidatePath('/dashboard/reservas');
    return { success: true, message: 'Reserva cancelada exitosamente' };
  } catch (e) {
    logger.error('Error al cancelar reserva', {
      bookingId: id,
      error: e instanceof Error ? e.message : e,
    });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al cancelar la reserva',
    };
  }
}
