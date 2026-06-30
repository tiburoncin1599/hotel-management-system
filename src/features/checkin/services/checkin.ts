import { checkinRepository } from '../repositories/checkin';
import { checkInSchema, checkOutSchema } from '../schemas';
import type {
  StayDetail,
  BookingWithRelations,
  CheckInWithEmployee,
  CheckOutWithEmployee,
} from '../types';

function calculateNights(checkIn: Date, checkOut: Date): number {
  const diff = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export const checkinService = {
  async getPendingCheckIns() {
    return checkinRepository.findPendingCheckIns();
  },

  async getActiveGuests() {
    return checkinRepository.findActiveGuests();
  },

  async getReadyForCheckOut() {
    return checkinRepository.findReadyForCheckOut();
  },

  async checkInGuest(data: unknown, userId: string, userEmail: string) {
    const parsed = checkInSchema.parse(data);

    const booking = await checkinRepository.findBookingById(parsed.bookingId);
    if (!booking) {
      throw new Error('La reserva no existe');
    }
    if (booking.status.code !== 'confirmed') {
      throw new Error('La reserva debe estar confirmada para realizar el check-in');
    }
    if (booking.checkIn) {
      throw new Error('Esta reserva ya tiene un check-in registrado');
    }
    if (booking.room.status.code === 'occupied') {
      throw new Error('La habitación ya está ocupada');
    }

    let employee = await checkinRepository.findEmployeeByUserId(userId);
    if (!employee) {
      employee = await checkinRepository.createEmployee(userId, userEmail);
    }

    const checkedInStatus = await checkinRepository.findBookingStatusByCode('checked_in');
    if (!checkedInStatus) {
      throw new Error("No se encontró el estado de reserva 'checked_in'");
    }

    const occupiedStatus = await checkinRepository.findRoomStatusByCode('occupied');
    if (!occupiedStatus) {
      throw new Error("No se encontró el estado de habitación 'occupied'");
    }

    return checkinRepository.createCheckInTransaction({
      bookingId: parsed.bookingId,
      employeeId: employee.id,
      idCardVerified: parsed.idCardVerified,
      notes: parsed.notes || undefined,
      bookingStatusId: checkedInStatus.id,
      previousBookingStatusId: booking.statusId,
      roomStatusId: occupiedStatus.id,
      roomId: booking.roomId,
      userId,
    });
  },

  async checkOutGuest(data: unknown, userId: string, userEmail: string) {
    const parsed = checkOutSchema.parse(data);

    const booking = await checkinRepository.findBookingById(parsed.bookingId);
    if (!booking) {
      throw new Error('La reserva no existe');
    }
    if (!booking.checkIn) {
      throw new Error('La reserva no tiene un check-in registrado');
    }
    if (booking.checkOut) {
      throw new Error('Esta reserva ya tiene un check-out registrado');
    }
    if (booking.status.code !== 'checked_in') {
      throw new Error("La reserva debe estar en estado 'checked_in' para realizar el check-out");
    }

    let employee = await checkinRepository.findEmployeeByUserId(userId);
    if (!employee) {
      employee = await checkinRepository.createEmployee(userId, userEmail);
    }

    const checkedOutStatus = await checkinRepository.findBookingStatusByCode('checked_out');
    if (!checkedOutStatus) {
      throw new Error("No se encontró el estado de reserva 'checked_out'");
    }

    const cleaningStatus = await checkinRepository.findRoomStatusByCode('cleaning');
    if (!cleaningStatus) {
      throw new Error("No se encontró el estado de habitación 'cleaning'");
    }

    return checkinRepository.createCheckOutTransaction({
      bookingId: parsed.bookingId,
      employeeId: employee.id,
      damageCharges: parsed.damageCharges || undefined,
      notes: parsed.notes || undefined,
      bookingStatusId: checkedOutStatus.id,
      previousBookingStatusId: booking.statusId,
      roomStatusId: cleaningStatus.id,
      roomId: booking.roomId,
      userId,
    });
  },

  async getStayDetail(bookingId: string): Promise<StayDetail | null> {
    const booking = await checkinRepository.findBookingById(bookingId);
    if (!booking) return null;

    const checkInDate = new Date(booking.checkInDate);
    const checkOutDate = new Date(booking.checkOutDate);
    const plannedNights = calculateNights(checkInDate, checkOutDate);

    const actualCheckOut = booking.checkOut?.checkOutDateTime
      ? new Date(booking.checkOut.checkOutDateTime)
      : checkOutDate;
    const actualCheckIn = booking.checkIn?.checkInDateTime
      ? new Date(booking.checkIn.checkInDateTime)
      : checkInDate;
    const actualNights = Math.max(1, calculateNights(actualCheckIn, actualCheckOut));

    const pricePerNight = Number(booking.room.roomType.basePricePerNight.toString());
    const subtotal = actualNights * pricePerNight;
    const paidAmount = Number(booking.paidAmount.toString());
    const pendingAmount = Math.max(0, Number(booking.totalAmount.toString()) - paidAmount);

    return {
      booking: booking as unknown as BookingWithRelations,
      checkIn: booking.checkIn as unknown as CheckInWithEmployee | null,
      checkOut: booking.checkOut as unknown as CheckOutWithEmployee | null,
      nights: plannedNights,
      actualNights,
      pricePerNight,
      subtotal,
      paidAmount,
      pendingAmount,
    };
  },
};
