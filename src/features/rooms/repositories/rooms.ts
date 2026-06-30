import { prisma } from '@/lib/prisma';
import type { RoomFilters, PaginatedResult, RoomWithRelations } from '../types';
import type { Prisma, RoomStatus, RoomType } from '@/generated/prisma/client';

function buildWhere(filters: RoomFilters): Prisma.RoomWhereInput {
  const where: Prisma.RoomWhereInput = { deletedAt: null };

  if (filters.statusId) {
    where.statusId = filters.statusId;
  }
  if (filters.roomTypeId) {
    where.roomTypeId = filters.roomTypeId;
  }
  if (filters.search) {
    where.OR = [{ roomNumber: { contains: filters.search, mode: 'insensitive' } }];
  }

  return where;
}

const roomInclude = {
  roomType: {
    include: {
      roomTypeAmenities: {
        include: { amenity: true },
      },
    },
  },
  status: true,
  images: { orderBy: { sortOrder: 'asc' as const } },
} satisfies Prisma.RoomInclude;

export const roomRepository = {
  async findAll(filters: RoomFilters): Promise<PaginatedResult<RoomWithRelations>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;
    const where = buildWhere(filters);

    const [data, total] = await Promise.all([
      prisma.room.findMany({
        where,
        include: roomInclude,
        skip,
        take: limit,
        orderBy: { roomNumber: 'asc' },
      }),
      prisma.room.count({ where }),
    ]);

    return {
      data: data as unknown as RoomWithRelations[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async findById(id: string): Promise<RoomWithRelations | null> {
    const room = await prisma.room.findFirst({
      where: { id, deletedAt: null },
      include: roomInclude,
    });
    return room as unknown as RoomWithRelations | null;
  },

  async create(data: {
    roomNumber: string;
    floor: number | null;
    roomTypeId: string;
    statusId: string;
    createdById: string;
  }) {
    return prisma.room.create({
      data: {
        roomNumber: data.roomNumber,
        floor: data.floor,
        roomTypeId: data.roomTypeId,
        statusId: data.statusId,
        createdById: data.createdById,
      },
      include: roomInclude,
    });
  },

  async update(
    id: string,
    data: {
      roomNumber?: string;
      floor?: number | null;
      roomTypeId?: string;
      statusId?: string;
      updatedById: string;
    },
  ) {
    const { updatedById, ...rest } = data;
    return prisma.room.update({
      where: { id },
      data: { ...rest, updatedById },
      include: roomInclude,
    });
  },

  async softDelete(id: string, deletedById: string) {
    return prisma.room.update({
      where: { id },
      data: { deletedAt: new Date(), deletedById, isActive: false },
    });
  },

  async findStatuses() {
    return prisma.roomStatus.findMany({
      where: { isActive: true },
      select: { id: true, code: true, name: true, description: true },
      orderBy: { name: 'asc' },
    }) as unknown as RoomStatus[];
  },

  async findTypes() {
    return prisma.roomType.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        basePricePerNight: true,
        maxOccupancy: true,
        description: true,
      },
      orderBy: { name: 'asc' },
    }) as unknown as RoomType[];
  },

  async findByRoomNumber(roomNumber: string, excludeId?: string) {
    return prisma.room.findFirst({
      where: {
        roomNumber,
        deletedAt: null,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
  },
};
