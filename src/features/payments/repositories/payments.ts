import { prisma } from '@/lib/prisma';
import { Prisma, PaymentStatus } from '@/generated/prisma/client';
import type {
  PaymentWithRelations,
  PaginatedResult,
  PaymentFilters,
  PaymentDetailData,
} from '../types';

const paymentInclude = {
  booking: {
    select: {
      id: true,
      totalAmount: true,
      paidAmount: true,
      checkInDate: true,
      checkOutDate: true,
      numberOfGuests: true,
      status: { select: { id: true, code: true, name: true } },
      customer: { select: { id: true, firstName: true, lastName: true, email: true } },
      room: {
        select: {
          id: true,
          roomNumber: true,
          roomType: { select: { name: true } },
        },
      },
    },
  },
  paymentMethod: { select: { id: true, code: true, name: true } },
  currency: { select: { id: true, code: true, name: true, symbol: true } },
  processedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
} satisfies Prisma.PaymentInclude;

export const paymentRepository = {
  async findAll(filters: PaymentFilters): Promise<PaginatedResult<PaymentWithRelations>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const where: Prisma.PaymentWhereInput = {};

    if (filters.search) {
      where.OR = [
        { referenceNumber: { contains: filters.search } },
        { booking: { customer: { firstName: { contains: filters.search } } } },
        { booking: { customer: { lastName: { contains: filters.search } } } },
        { notes: { contains: filters.search } },
      ];
    }

    if (filters.status) {
      where.status = filters.status as Prisma.EnumPaymentStatusFilter['equals'];
    }

    if (filters.paymentMethodId) {
      where.paymentMethodId = filters.paymentMethodId;
    }

    if (filters.currencyId) {
      where.currencyId = filters.currencyId;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.transactionDate = {};
      if (filters.dateFrom) where.transactionDate.gte = new Date(filters.dateFrom);
      if (filters.dateTo) {
        const end = new Date(filters.dateTo);
        end.setHours(23, 59, 59, 999);
        where.transactionDate.lte = end;
      }
    }

    const orderBy: Prisma.PaymentOrderByWithRelationInput = {};
    const sortField =
      filters.sortBy === 'amount'
        ? 'amount'
        : filters.sortBy === 'transactionDate'
          ? 'transactionDate'
          : 'createdAt';
    orderBy[sortField] = filters.sortOrder ?? 'desc';

    const [data, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: paymentInclude,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.payment.count({ where }),
    ]);

    return {
      data: data as unknown as PaymentWithRelations[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async findById(id: string): Promise<PaymentDetailData | null> {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: paymentInclude,
    });

    return payment as unknown as PaymentDetailData | null;
  },

  async findByBookingId(bookingId: string): Promise<PaymentWithRelations[]> {
    const payments = await prisma.payment.findMany({
      where: { bookingId },
      include: paymentInclude,
      orderBy: { transactionDate: 'desc' },
    });

    return payments as unknown as PaymentWithRelations[];
  },

  async create(data: Prisma.PaymentCreateInput): Promise<PaymentDetailData> {
    const payment = await prisma.payment.create({
      data,
      include: paymentInclude,
    });

    return payment as unknown as PaymentDetailData;
  },

  async update(id: string, data: Prisma.PaymentUpdateInput): Promise<PaymentDetailData> {
    const payment = await prisma.payment.update({
      where: { id },
      data,
      include: paymentInclude,
    });

    return payment as unknown as PaymentDetailData;
  },

  async updateStatus(id: string, status: string): Promise<PaymentDetailData> {
    const payment = await prisma.payment.update({
      where: { id },
      data: { status: status as PaymentStatus },
      include: paymentInclude,
    });

    return payment as unknown as PaymentDetailData;
  },

  async cancelPaymentWithBookingUpdate(
    paymentId: string,
    status: string,
    bookingId: string,
    amount: string,
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: paymentId },
        data: { status: status as PaymentStatus },
      });

      await tx.booking.update({
        where: { id: bookingId },
        data: { paidAmount: { decrement: amount } },
      });
    });
  },

  async createPaymentWithBookingUpdate(
    paymentData: Prisma.PaymentCreateInput,
    bookingId: string,
    amount: string,
  ): Promise<PaymentDetailData> {
    const payment = await prisma.$transaction(async (tx) => {
      const created = await tx.payment.create({
        data: paymentData as Prisma.PaymentCreateInput,
        include: paymentInclude,
      });
      await tx.booking.update({
        where: { id: bookingId },
        data: { paidAmount: { increment: amount } },
      });
      return created;
    });
    return payment as unknown as PaymentDetailData;
  },

  async updatePaymentWithBookingUpdate(
    paymentId: string,
    paymentData: Prisma.PaymentUpdateInput,
    bookingId: string,
    amountDiff: number,
  ): Promise<PaymentDetailData> {
    const payment = await prisma.$transaction(async (tx) => {
      const updated = await tx.payment.update({
        where: { id: paymentId },
        data: paymentData,
        include: paymentInclude,
      });
      await tx.booking.update({
        where: { id: bookingId },
        data: { paidAmount: { increment: amountDiff } },
      });
      return updated;
    });
    return payment as unknown as PaymentDetailData;
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

  async getPaymentMethods(): Promise<{ id: string; code: string; name: string }[]> {
    return prisma.paymentMethod.findMany({
      where: { isActive: true },
      select: { id: true, code: true, name: true },
      orderBy: { name: 'asc' },
    });
  },

  async getCurrencies(): Promise<{ id: string; code: string; name: string; symbol: string }[]> {
    return prisma.currency.findMany({
      where: { isActive: true },
      select: { id: true, code: true, name: true, symbol: true },
      orderBy: { code: 'asc' },
    });
  },
};
