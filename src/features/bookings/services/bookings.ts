import { bookingRepository } from '../repositories/bookings';
import {
  createBookingSchema,
  updateBookingSchema,
  cancelBookingSchema,
  bookingQuerySchema,
} from '../schemas';
import type {
  BookingFilters,
  PaginatedResult,
  BookingWithRelations,
  BookingDetailData,
  RoomWithDetails,
} from '../types';
import type { BookingStatus, Customer } from '@/generated/prisma/client';
import { DiscountType } from '@/generated/prisma/client';

function calculateNights(checkIn: Date, checkOut: Date): number {
  const diff = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function calculateBookingDetails(
  checkIn: Date,
  checkOut: Date,
  room: RoomWithDetails,
  activePromotions: {
    id: string;
    discountType: string;
    discountValue: { toString: () => string };
    minNights?: number | null;
    minAmount?: { toString: () => string } | null;
  }[],
): {
  nights: number;
  pricePerNight: number;
  subtotal: number;
  discountAmount: number;
  discountLabel: string | null;
  total: number;
  promotionId: string | null;
} {
  const nights = calculateNights(checkIn, checkOut);
  if (nights <= 0) throw new Error('La fecha de salida debe ser posterior a la fecha de entrada');

  const pricePerNight = Number(room.roomType.basePricePerNight.toString());
  const subtotal = nights * pricePerNight;

  let discountAmount = 0;
  let discountLabel: string | null = null;
  let promotionId: string | null = null;

  const validPromotion = activePromotions.find((p) => {
    if (p.minNights && nights < p.minNights) return false;
    if (p.minAmount && subtotal < Number(p.minAmount.toString())) return false;
    return true;
  });

  if (validPromotion) {
    promotionId = validPromotion.id;
    const discVal = Number(validPromotion.discountValue.toString());
    discountLabel =
      validPromotion.discountType === DiscountType.PERCENTAGE
        ? `${discVal}%`
        : `$${discVal.toFixed(2)}`;

    if (validPromotion.discountType === DiscountType.PERCENTAGE) {
      discountAmount = Math.round(((subtotal * discVal) / 100) * 100) / 100;
    } else {
      discountAmount = discVal;
    }
  }

  const total = Math.max(0, subtotal - discountAmount);

  return { nights, pricePerNight, subtotal, discountAmount, discountLabel, total, promotionId };
}

export const bookingService = {
  async getBookings(filters: BookingFilters): Promise<PaginatedResult<BookingWithRelations>> {
    const parsed = bookingQuerySchema.parse({
      page: filters.page ?? 1,
      limit: filters.limit ?? 10,
      search: filters.search,
      statusId: filters.statusId,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    });
    return bookingRepository.findAll(parsed);
  },

  async getBookingById(id: string): Promise<BookingWithRelations | null> {
    if (!id) return null;
    return bookingRepository.findById(id);
  },

  async getBookingDetail(booking: BookingWithRelations): Promise<BookingDetailData> {
    const nights = calculateNights(new Date(booking.checkInDate), new Date(booking.checkOutDate));
    const pricePerNight = Number(booking.room.roomType.basePricePerNight.toString());
    const subtotal = nights * pricePerNight;
    const total = Number(booking.totalAmount.toString());
    const discountAmount = subtotal - total;
    const discountLabel = booking.promotion
      ? booking.promotion.discountType === DiscountType.PERCENTAGE
        ? `${Number(booking.promotion.discountValue.toString())}%`
        : `$${Number(booking.promotion.discountValue.toString()).toFixed(2)}`
      : null;

    return { nights, pricePerNight, subtotal, discountAmount, discountLabel, total };
  },

  async createBooking(data: unknown, userId: string) {
    const parsed = createBookingSchema.parse(data);

    const checkIn = new Date(parsed.checkInDate);
    const checkOut = new Date(parsed.checkOutDate);

    if (checkOut <= checkIn) {
      throw new Error('La fecha de salida debe ser posterior a la fecha de entrada');
    }

    const room = await bookingRepository.findRoomById(parsed.roomId);
    if (!room) {
      throw new Error('La habitación no existe');
    }

    if (parsed.numberOfGuests > room.roomType.maxOccupancy) {
      throw new Error(
        `La capacidad máxima de la habitación es de ${room.roomType.maxOccupancy} huéspedes`,
      );
    }

    const overlapping = await bookingRepository.findOverlapping(parsed.roomId, checkIn, checkOut);
    if (overlapping.length > 0) {
      throw new Error('La habitación no está disponible en el rango de fechas seleccionado');
    }

    const status = await bookingRepository.findStatusByCode('confirmed');
    if (!status) {
      throw new Error("No se encontró el estado de reserva 'confirmed' en el sistema");
    }

    const activePromotions = await bookingRepository.findActivePromotionsForRoomType(
      room.roomTypeId,
    );
    const details = calculateBookingDetails(
      checkIn,
      checkOut,
      room as unknown as RoomWithDetails,
      activePromotions,
    );

    return bookingRepository.createBookingWithHistory(
      {
        customerId: parsed.customerId,
        roomId: parsed.roomId,
        statusId: status.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: parsed.numberOfGuests,
        totalAmount: details.total,
        source: parsed.source || 'DIRECT',
        promotionId: details.promotionId || undefined,
        specialRequests: parsed.specialRequests,
        createdById: userId,
      },
      {
        bookingId: '', // Will be set by transaction
        fromStatusId: null,
        toStatusId: status.id,
        changedById: userId,
      },
    );
  },

  async updateBooking(id: string, data: unknown, userId: string) {
    const parsed = updateBookingSchema.parse({ id, ...(data as object) });

    const existing = await bookingRepository.findById(id);
    if (!existing) {
      throw new Error('La reserva no existe');
    }

    const checkIn = new Date(parsed.checkInDate);
    const checkOut = new Date(parsed.checkOutDate);

    if (checkOut <= checkIn) {
      throw new Error('La fecha de salida debe ser posterior a la fecha de entrada');
    }

    const room = await bookingRepository.findRoomById(parsed.roomId);
    if (!room) {
      throw new Error('La habitación no existe');
    }

    if (parsed.numberOfGuests > room.roomType.maxOccupancy) {
      throw new Error(
        `La capacidad máxima de la habitación es de ${room.roomType.maxOccupancy} huéspedes`,
      );
    }

    const overlapping = await bookingRepository.findOverlapping(
      parsed.roomId,
      checkIn,
      checkOut,
      id,
    );
    if (overlapping.length > 0) {
      throw new Error('La habitación no está disponible en el rango de fechas seleccionado');
    }

    const activePromotions = await bookingRepository.findActivePromotionsForRoomType(
      room.roomTypeId,
    );
    const details = calculateBookingDetails(
      checkIn,
      checkOut,
      room as unknown as RoomWithDetails,
      activePromotions,
    );

    const needsStatusHistory = existing.roomId !== parsed.roomId;

    return bookingRepository.updateBookingWithHistory(
      id,
      {
        customerId: parsed.customerId,
        roomId: parsed.roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: parsed.numberOfGuests,
        totalAmount: details.total,
        source: parsed.source,
        promotionId: details.promotionId || undefined,
        specialRequests: parsed.specialRequests,
        updatedById: userId,
      },
      needsStatusHistory
        ? {
            bookingId: id,
            fromStatusId: existing.statusId,
            toStatusId: existing.statusId,
            notes: 'Habitación cambiada',
            changedById: userId,
          }
        : undefined,
    );
  },

  async cancelBooking(id: string, reason: string | undefined, userId: string) {
    const parsed = cancelBookingSchema.parse({ id, reason });

    const existing = await bookingRepository.findById(parsed.id);
    if (!existing) {
      throw new Error('La reserva no existe');
    }

    if (existing.status.code === 'cancelled') {
      throw new Error('La reserva ya está cancelada');
    }

    const cancelledStatus = await bookingRepository.findStatusByCode('cancelled');
    if (!cancelledStatus) {
      throw new Error('No se encontró el estado de cancelación');
    }

    return bookingRepository.cancelBookingWithHistory(parsed.id, cancelledStatus.id, userId, {
      bookingId: parsed.id,
      fromStatusId: existing.statusId,
      toStatusId: cancelledStatus.id,
      notes: parsed.reason || undefined,
      changedById: userId,
    });
  },

  async getCustomers(): Promise<Customer[]> {
    return bookingRepository.findCustomers();
  },

  async getRooms(): Promise<RoomWithDetails[]> {
    return bookingRepository.findRooms();
  },

  async getBookingStatuses(): Promise<BookingStatus[]> {
    return bookingRepository.findStatuses();
  },
};
