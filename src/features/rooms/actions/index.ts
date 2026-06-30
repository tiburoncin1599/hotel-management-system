'use server';

import { roomService } from '../services/rooms';
import { requireAuth } from '@/lib/auth/helpers';
import { logger } from '@/lib/logger';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { RoomFilters, PaginatedResult, RoomWithRelations } from '../types';
import type { RoomStatus, RoomType } from '@/generated/prisma/client';

export type ActionState<T = unknown> = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: T;
};

export async function getRoomsAction(
  filters: RoomFilters,
): Promise<PaginatedResult<RoomWithRelations>> {
  await requireAuth();
  return roomService.getRooms(filters);
}

export async function getRoomByIdAction(id: string): Promise<RoomWithRelations | null> {
  await requireAuth();
  return roomService.getRoomById(id);
}

export async function getRoomStatusesAction(): Promise<RoomStatus[]> {
  await requireAuth();
  return roomService.getRoomStatuses();
}

export async function getRoomTypesAction(): Promise<RoomType[]> {
  await requireAuth();
  return roomService.getRoomTypes();
}

export async function createRoomAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAuth();

  try {
    const raw = {
      roomNumber: formData.get('roomNumber'),
      floor: formData.get('floor'),
      roomTypeId: formData.get('roomTypeId'),
      statusId: formData.get('statusId'),
    };
    await roomService.createRoom(raw, user.id!);
    revalidatePath('/dashboard/habitaciones');
    redirect('/dashboard/habitaciones');
    return { success: true, message: 'Habitación creada exitosamente' };
  } catch (e) {
    if (e instanceof Error && e.message === 'NEXT_REDIRECT') throw e;
    logger.error('Error al crear habitación', { error: e instanceof Error ? e.message : e });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al crear la habitación',
    };
  }
}

export async function updateRoomAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAuth();

  const id = formData.get('id') as string;
  if (!id) return { success: false, message: 'ID no proporcionado' };

  try {
    const raw = {
      roomNumber: formData.get('roomNumber'),
      floor: formData.get('floor'),
      roomTypeId: formData.get('roomTypeId'),
      statusId: formData.get('statusId'),
    };
    await roomService.updateRoom(id, raw, user.id!);
    revalidatePath('/dashboard/habitaciones');
    redirect('/dashboard/habitaciones');
    return { success: true, message: 'Habitación actualizada exitosamente' };
  } catch (e) {
    if (e instanceof Error && e.message === 'NEXT_REDIRECT') throw e;
    logger.error('Error al actualizar habitación', {
      roomId: id,
      error: e instanceof Error ? e.message : e,
    });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al actualizar la habitación',
    };
  }
}

export async function deleteRoomAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAuth();

  const id = formData.get('id') as string;
  if (!id) return { success: false, message: 'ID no proporcionado' };

  try {
    await roomService.deleteRoom(id, user.id!);
    revalidatePath('/dashboard/habitaciones');
    return { success: true, message: 'Habitación eliminada exitosamente' };
  } catch (e) {
    logger.error('Error al eliminar habitación', {
      roomId: id,
      error: e instanceof Error ? e.message : e,
    });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al eliminar la habitación',
    };
  }
}
