import { roomRepository } from '../repositories/rooms';
import { createRoomSchema, updateRoomSchema, roomQuerySchema } from '../schemas';
import type { RoomFilters, PaginatedResult, RoomWithRelations } from '../types';
import type { RoomStatus, RoomType } from '@/generated/prisma/client';

export const roomService = {
  async getRooms(filters: RoomFilters): Promise<PaginatedResult<RoomWithRelations>> {
    const parsed = roomQuerySchema.parse({
      page: filters.page ?? 1,
      limit: filters.limit ?? 10,
      statusId: filters.statusId,
      roomTypeId: filters.roomTypeId,
      search: filters.search,
    });
    return roomRepository.findAll(parsed);
  },

  async getRoomById(id: string): Promise<RoomWithRelations | null> {
    if (!id) return null;
    return roomRepository.findById(id);
  },

  async createRoom(data: unknown, userId: string) {
    const parsed = createRoomSchema.parse(data);

    const existing = await roomRepository.findByRoomNumber(parsed.roomNumber);
    if (existing) {
      throw new Error('Ya existe una habitación con ese número');
    }

    return roomRepository.create({
      ...parsed,
      floor: parsed.floor,
      createdById: userId,
    });
  },

  async updateRoom(id: string, data: unknown, userId: string) {
    const parsed = updateRoomSchema.parse({ id, ...(data as object) });

    const existing = await roomRepository.findByRoomNumber(parsed.roomNumber, id);
    if (existing) {
      throw new Error('Ya existe otra habitación con ese número');
    }

    return roomRepository.update(id, {
      roomNumber: parsed.roomNumber,
      floor: parsed.floor,
      roomTypeId: parsed.roomTypeId,
      statusId: parsed.statusId,
      updatedById: userId,
    });
  },

  async deleteRoom(id: string, userId: string) {
    return roomRepository.softDelete(id, userId);
  },

  async getRoomStatuses(): Promise<RoomStatus[]> {
    return roomRepository.findStatuses();
  },

  async getRoomTypes(): Promise<RoomType[]> {
    return roomRepository.findTypes();
  },
};
