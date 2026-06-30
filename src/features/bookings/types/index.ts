import type {
  Booking,
  BookingStatus,
  BookingStatusHistory,
  Customer,
  Room,
  RoomType,
  RoomStatus,
  Promotion,
  User,
} from '@/generated/prisma/client';

export interface RoomWithDetails extends Room {
  roomType: RoomType;
  status: RoomStatus;
}

export interface BookingWithRelations extends Booking {
  customer: Customer;
  room: Room & { roomType: RoomType; status: RoomStatus };
  status: BookingStatus;
  promotion: (Promotion & { promotionRoomTypes: { roomType: RoomType }[] }) | null;
  statusHistories: (BookingStatusHistory & {
    fromStatus: BookingStatus | null;
    toStatus: BookingStatus;
    changedBy: User;
  })[];
}

export interface BookingFilters {
  search?: string;
  statusId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BookingDetailData {
  nights: number;
  pricePerNight: number;
  subtotal: number;
  discountAmount: number;
  discountLabel: string | null;
  total: number;
}
