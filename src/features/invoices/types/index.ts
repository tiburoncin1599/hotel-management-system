import type {
  Invoice,
  InvoiceDetail,
  InvoiceStatus,
  Customer,
  Currency,
  ServiceConsumption,
} from '@/generated/prisma/client';

export interface InvoiceWithRelations extends Invoice {
  customer: Pick<
    Customer,
    | 'id'
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'documentType'
    | 'documentNumber'
    | 'phone'
    | 'address'
    | 'countryId'
  >;
  country?: { id: string; code: string; name: string } | null;
  booking: {
    id: string;
    checkInDate: Date;
    checkOutDate: Date;
    numberOfGuests: number;
    room: { roomNumber: string; roomType: { name: string } };
    status: { code: string; name: string };
    promotion: { id: string; name: string; discountType: string; discountValue: unknown } | null;
    totalAmount: { toString(): string };
    paidAmount: { toString(): string };
  };
  currency: Pick<Currency, 'id' | 'code' | 'name' | 'symbol'> | null;
  details: InvoiceDetailWithService[];
}

export interface InvoiceDetailWithService extends InvoiceDetail {
  serviceConsumption: (ServiceConsumption & { service: { name: string } }) | null;
}

export interface InvoiceFilters {
  search?: string;
  status?: string;
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

export type { InvoiceStatus };
