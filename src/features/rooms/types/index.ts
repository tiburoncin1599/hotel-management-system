import type { Room, RoomType, RoomStatus, RoomImage, Amenity } from '@/generated/prisma/client';

export interface RoomWithRelations extends Room {
  roomType: RoomType & { roomTypeAmenities?: { amenity: Amenity }[] };
  status: RoomStatus;
  images: RoomImage[];
}

export interface RoomFilters {
  statusId?: string;
  roomTypeId?: string;
  search?: string;
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
