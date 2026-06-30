import { prisma } from '@/lib/prisma';
import type {
  BookingFilters,
  PaginatedResult,
  BookingWithRelations,
  RoomWithDetails,
} from '../types';
import type { Prisma, BookingSource, BookingStatus } from '@/generated/prisma/client';
import type { Customer } from '@/generated/prisma/client';

function buildWhere(filters: BookingFilters): Prisma.BookingWhereInput {
  const where: Prisma.BookingWhereInput = { deletedAt: null };

  if (filters.statusId) {
    where.statusId = filters.statusId;
  }

  if (filters.dateFrom) {
    where.checkInDate = {
      ...((where.checkInDate as object) || {}),
      gte: new Date(filters.dateFrom),
    };
  }

  if (filters.dateTo) {
    where.checkOutDate = {
      ...((where.checkOutDate as object) || {}),
      lte: new Date(filters.dateTo),
    };
  }

  if (filters.search) {
    where.OR = [
      { customer: { firstName: { contains: filters.search, mode: 'insensitive' } } },
      { customer: { lastName: { contains: filters.search, mode: 'insensitive' } } },
      { room: { roomNumber: { contains: filters.search, mode: 'insensitive' } } },
      { id: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return where;
}

function buildOrderBy(
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc',
): Prisma.BookingOrderByWithRelationInput {
  return { [sortBy]: sortOrder };
}

const bookingInclude = {
  customer: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      documentType: true,
      documentNumber: true,
    },
  },
  room: {
    include: { roomType: true, status: true },
  },
  status: true,
  promotion: {
    include: { promotionRoomTypes: { include: { roomType: true } } },
  },
  statusHistories: {
    include: { fromStatus: true, toStatus: true, changedBy: true },
    orderBy: { changedAt: 'desc' as const },
  },
} satisfies Prisma.BookingInclude;

export const bookingRepository = {
  async findAll(filters: BookingFilters): Promise<PaginatedResult<BookingWithRelations>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;
    const where = buildWhere(filters);
    const orderBy = buildOrderBy(filters.sortBy, filters.sortOrder);

    const [data, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: bookingInclude,
        skip,
        take: limit,
        orderBy,
      }),
      prisma.booking.count({ where }),
    ]);

    return {
      data: data as unknown as BookingWithRelations[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async findById(id: string): Promise<BookingWithRelations | null> {
    const booking = await prisma.booking.findFirst({
      where: { id, deletedAt: null },
      include: bookingInclude,
    });
    return booking as unknown as BookingWithRelations | null;
  },

  async create(data: {
    customerId: string;
    roomId: string;
    statusId: string;
    checkInDate: Date;
    checkOutDate: Date;
    numberOfGuests: number;
    totalAmount: number;
    source: string;
    promotionId?: string;
    specialRequests?: string;
    createdById: string;
  }) {
    const { createdById, ...rest } = data;
    return prisma.booking.create({
      data: {
        ...rest,
        totalAmount: rest.totalAmount,
        source: rest.source as BookingSource,
        promotionId: rest.promotionId || undefined,
        specialRequests: rest.specialRequests || undefined,
        createdById,
      },
      include: bookingInclude,
    });
  },

  async update(
    id: string,
    data: {
      customerId?: string;
      roomId?: string;
      checkInDate?: Date;
      checkOutDate?: Date;
      numberOfGuests?: number;
      totalAmount?: number;
      source?: string;
      promotionId?: string | null;
      specialRequests?: string;
      updatedById: string;
    },
  ) {
    const { updatedById, ...rest } = data;
    return prisma.booking.update({
      where: { id },
      data: {
        ...rest,
        source: rest.source as BookingSource,
        updatedById,
      },
      include: bookingInclude,
    });
  },

  async findOverlapping(roomId: string, checkIn: Date, checkOut: Date, excludeId?: string) {
    return prisma.booking.findMany({
      where: {
        roomId,
        deletedAt: null,
        status: { code: { not: 'cancelled' } },
        checkInDate: { lt: checkOut },
        checkOutDate: { gt: checkIn },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      include: { status: true },
    });
  },

  async findStatusByCode(code: string) {
    return prisma.bookingStatus.findFirst({
      where: { code, isActive: true },
    });
  },

  async findStatuses() {
    return prisma.bookingStatus.findMany({
      where: { isActive: true },
      select: { id: true, code: true, name: true, color: true },
      orderBy: { name: 'asc' },
    }) as unknown as BookingStatus[];
  },

  async findCustomers() {
    return prisma.customer.findMany({
      where: { isActive: true, deletedAt: null },
      select: { id: true, firstName: true, lastName: true, email: true, documentNumber: true },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    }) as unknown as Customer[];
  },

  async findRooms() {
    return prisma.room.findMany({
      where: { isActive: true, deletedAt: null },
      select: {
        id: true,
        roomNumber: true,
        roomType: { select: { id: true, name: true, basePricePerNight: true, maxOccupancy: true } },
        status: { select: { id: true, code: true, name: true } },
      },
      orderBy: { roomNumber: 'asc' },
    }) as unknown as RoomWithDetails[];
  },

  async findRoomById(id: string) {
    return prisma.room.findFirst({
      where: { id, deletedAt: null },
      include: { roomType: true, status: true },
    });
  },

  async findActivePromotionsForRoomType(roomTypeId: string) {
    const now = new Date();
    return prisma.promotion.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
        deletedAt: null,
        promotionRoomTypes: {
          some: { roomTypeId },
        },
      },
      include: { promotionRoomTypes: true },
    });
  },

  async cancelBooking(id: string, statusId: string, updatedById: string) {
    return prisma.booking.update({
      where: { id },
      data: { statusId, updatedById },
      include: bookingInclude,
    });
  },

  async createStatusHistory(data: {
    bookingId: string;
    fromStatusId: string | null;
    toStatusId: string;
    notes?: string;
    changedById: string;
  }) {
    return prisma.bookingStatusHistory.create({
      data: {
        bookingId: data.bookingId,
        fromStatusId: data.fromStatusId,
        toStatusId: data.toStatusId,
        notes: data.notes,
        changedById: data.changedById,
      },
      include: {
        fromStatus: true,
        toStatus: true,
        changedBy: true,
      },
    });
  },

  async createBookingWithHistory(
    createData: {
      customerId: string;
      roomId: string;
      statusId: string;
      checkInDate: Date;
      checkOutDate: Date;
      numberOfGuests: number;
      totalAmount: number;
      source: string;
      promotionId?: string;
      specialRequests?: string;
      createdById: string;
    },
    statusHistoryData: {
      bookingId: string;
      fromStatusId: string | null;
      toStatusId: string;
      changedById: string;
    },
  ) {
    return prisma.$transaction(async (tx) => {
      const { createdById, ...rest } = createData;
      const booking = await tx.booking.create({
        data: {
          ...rest,
          totalAmount: rest.totalAmount,
          source: rest.source as BookingSource,
          promotionId: rest.promotionId || undefined,
          specialRequests: rest.specialRequests || undefined,
          createdById,
        },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId: booking.id,
          fromStatusId: statusHistoryData.fromStatusId,
          toStatusId: statusHistoryData.toStatusId,
          changedById: statusHistoryData.changedById,
        },
      });

      return booking;
    });
  },

  async updateBookingWithHistory(
    id: string,
    updateData: {
      customerId?: string;
      roomId?: string;
      checkInDate?: Date;
      checkOutDate?: Date;
      numberOfGuests?: number;
      totalAmount?: number;
      source?: string;
      promotionId?: string | null;
      specialRequests?: string;
      updatedById: string;
    },
    statusHistoryData?: {
      bookingId: string;
      fromStatusId: string;
      toStatusId: string;
      notes?: string;
      changedById: string;
    },
  ) {
    return prisma.$transaction(async (tx) => {
      const { updatedById, ...rest } = updateData;
      const booking = await tx.booking.update({
        where: { id },
        data: {
          ...rest,
          source: rest.source as BookingSource,
          updatedById,
        },
      });

      if (statusHistoryData) {
        await tx.bookingStatusHistory.create({
          data: {
            bookingId: statusHistoryData.bookingId,
            fromStatusId: statusHistoryData.fromStatusId,
            toStatusId: statusHistoryData.toStatusId,
            notes: statusHistoryData.notes,
            changedById: statusHistoryData.changedById,
          },
        });
      }

      return booking;
    });
  },

  async cancelBookingWithHistory(
    id: string,
    statusId: string,
    updatedById: string,
    statusHistoryData: {
      bookingId: string;
      fromStatusId: string;
      toStatusId: string;
      notes?: string;
      changedById: string;
    },
  ) {
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.update({
        where: { id },
        data: { statusId, updatedById },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId: statusHistoryData.bookingId,
          fromStatusId: statusHistoryData.fromStatusId,
          toStatusId: statusHistoryData.toStatusId,
          notes: statusHistoryData.notes,
          changedById: statusHistoryData.changedById,
        },
      });

      return booking;
    });
  },
};
