import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';

const bookingIncludeForCheckin = {
  customer: true,
  room: {
    include: { roomType: true, status: true },
  },
  status: true,
  checkIn: { include: { employee: true } },
  checkOut: { include: { employee: true } },
} satisfies Prisma.BookingInclude;

export const checkinRepository = {
  async findPendingCheckIns() {
    return prisma.booking.findMany({
      where: {
        status: { code: 'confirmed', isActive: true },
        deletedAt: null,
        checkInDate: { lte: new Date() },
      },
      include: bookingIncludeForCheckin,
      orderBy: { checkInDate: 'asc' },
    });
  },

  async findActiveGuests() {
    return prisma.booking.findMany({
      where: {
        status: { code: 'checked_in', isActive: true },
        deletedAt: null,
      },
      include: bookingIncludeForCheckin,
      orderBy: { checkOutDate: 'asc' },
    });
  },

  async findReadyForCheckOut() {
    return prisma.booking.findMany({
      where: {
        status: { code: 'checked_in', isActive: true },
        deletedAt: null,
        checkOutDate: { lte: new Date() },
      },
      include: bookingIncludeForCheckin,
      orderBy: { checkOutDate: 'asc' },
    });
  },

  async findBookingById(id: string) {
    return prisma.booking.findFirst({
      where: { id, deletedAt: null },
      include: bookingIncludeForCheckin,
    });
  },

  async findEmployeeByUserId(userId: string) {
    return prisma.employee.findFirst({
      where: { userId, isActive: true },
    });
  },

  async createEmployee(userId: string, email: string) {
    return prisma.employee.create({
      data: {
        userId,
        email,
        firstName: 'Staff',
        lastName: 'User',
        position: 'Receptionist',
        isActive: true,
      },
    });
  },

  async findBookingStatusByCode(code: string) {
    return prisma.bookingStatus.findFirst({
      where: { code, isActive: true },
    });
  },

  async findRoomStatusByCode(code: string) {
    return prisma.roomStatus.findFirst({
      where: { code, isActive: true },
    });
  },

  async createCheckIn(data: {
    bookingId: string;
    employeeId: string;
    idCardVerified: boolean;
    notes?: string;
  }) {
    return prisma.checkIn.create({
      data: {
        bookingId: data.bookingId,
        employeeId: data.employeeId,
        idCardVerified: data.idCardVerified,
        notes: data.notes || undefined,
      },
      include: { employee: true },
    });
  },

  async createCheckOut(data: {
    bookingId: string;
    employeeId: string;
    damageCharges?: number;
    notes?: string;
  }) {
    return prisma.checkOut.create({
      data: {
        bookingId: data.bookingId,
        employeeId: data.employeeId,
        damageCharges: data.damageCharges || undefined,
        notes: data.notes || undefined,
      },
      include: { employee: true },
    });
  },

  async updateBookingStatus(bookingId: string, statusId: string, updatedById: string) {
    return prisma.booking.update({
      where: { id: bookingId },
      data: { statusId, updatedById },
    });
  },

  async updateRoomStatus(roomId: string, statusId: string) {
    return prisma.room.update({
      where: { id: roomId },
      data: { statusId },
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
    });
  },

  async createCheckInTransaction(data: {
    bookingId: string;
    employeeId: string;
    idCardVerified: boolean;
    notes?: string;
    bookingStatusId: string;
    previousBookingStatusId: string;
    roomStatusId: string;
    roomId: string;
    userId: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const checkIn = await tx.checkIn.create({
        data: {
          bookingId: data.bookingId,
          employeeId: data.employeeId,
          idCardVerified: data.idCardVerified,
          notes: data.notes,
        },
        include: { employee: true },
      });

      await tx.booking.update({
        where: { id: data.bookingId },
        data: { statusId: data.bookingStatusId, updatedById: data.userId },
      });

      await tx.room.update({
        where: { id: data.roomId },
        data: { statusId: data.roomStatusId },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId: data.bookingId,
          fromStatusId: data.previousBookingStatusId,
          toStatusId: data.bookingStatusId,
          notes: 'Check-in realizado',
          changedById: data.userId,
        },
      });

      return checkIn;
    });
  },

  async createCheckOutTransaction(data: {
    bookingId: string;
    employeeId: string;
    damageCharges?: number;
    notes?: string;
    bookingStatusId: string;
    previousBookingStatusId: string;
    roomStatusId: string;
    roomId: string;
    userId: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const checkOut = await tx.checkOut.create({
        data: {
          bookingId: data.bookingId,
          employeeId: data.employeeId,
          damageCharges: data.damageCharges,
          notes: data.notes,
        },
        include: { employee: true },
      });

      await tx.booking.update({
        where: { id: data.bookingId },
        data: { statusId: data.bookingStatusId, updatedById: data.userId },
      });

      await tx.room.update({
        where: { id: data.roomId },
        data: { statusId: data.roomStatusId },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId: data.bookingId,
          fromStatusId: data.previousBookingStatusId,
          toStatusId: data.bookingStatusId,
          notes: 'Check-out realizado',
          changedById: data.userId,
        },
      });

      return checkOut;
    });
  },
};
