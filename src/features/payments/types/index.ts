import type { Payment } from '@/generated/prisma/client';

export interface PaymentWithRelations extends Payment {
  booking: {
    id: string;
    customer: { id: string; firstName: string; lastName: string; email?: string | null };
    room: { id: string; roomNumber: string; roomType: { name: string } };
    totalAmount: { toString(): string };
    paidAmount: { toString(): string };
  };
  paymentMethod: { id: string; code: string; name: string };
  currency: { id: string; code: string; name: string; symbol: string } | null;
  processedBy: { id: string; firstName: string; lastName: string; email: string };
}

export interface PaymentFilters {
  search?: string;
  status?: string;
  paymentMethodId?: string;
  currencyId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaymentDetailData extends PaymentWithRelations {
  booking: PaymentWithRelations['booking'] & {
    checkInDate: Date;
    checkOutDate: Date;
    numberOfGuests: number;
    status: { id: string; code: string; name: string };
  };
}

export interface BookingFinancialSummary {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  isFullyPaid: boolean;
  payments: {
    id: string;
    amount: number;
    status: string;
    paymentMethod: { name: string };
    transactionDate: Date;
    referenceNumber: string | null;
  }[];
}
