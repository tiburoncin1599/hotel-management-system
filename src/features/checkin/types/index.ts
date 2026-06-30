import type {
  Booking,
  BookingStatus,
  Customer,
  Room,
  RoomType,
  RoomStatus,
  CheckIn,
  CheckOut,
  Employee,
} from '@/generated/prisma/client';

export interface BookingWithRelations extends Booking {
  customer: Customer;
  room: Room & { roomType: RoomType; status: RoomStatus };
  status: BookingStatus;
  checkIn: CheckIn | null;
  checkOut: CheckOut | null;
}

export interface CheckInWithEmployee extends CheckIn {
  employee: Employee;
}

export interface CheckOutWithEmployee extends CheckOut {
  employee: Employee;
}

export interface StayDetail {
  booking: BookingWithRelations;
  checkIn: CheckInWithEmployee | null;
  checkOut: CheckOutWithEmployee | null;
  nights: number;
  actualNights: number;
  pricePerNight: number;
  subtotal: number;
  paidAmount: number;
  pendingAmount: number;
}
