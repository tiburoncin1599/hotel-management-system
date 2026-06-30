import { prisma } from '@/lib/prisma';
import { Prisma, InvoiceStatus } from '@/generated/prisma/client';
import type { InvoiceWithRelations, InvoiceFilters, PaginatedResult } from '../types';

const invoiceInclude = {
  customer: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      documentType: true,
      documentNumber: true,
      phone: true,
      address: true,
      countryId: true,
    },
  },
  booking: {
    select: {
      id: true,
      checkInDate: true,
      checkOutDate: true,
      numberOfGuests: true,
      totalAmount: true,
      paidAmount: true,
      room: { select: { roomNumber: true, roomType: { select: { name: true } } } },
      status: { select: { code: true, name: true } },
      promotion: { select: { id: true, name: true, discountType: true, discountValue: true } },
    },
  },
  currency: { select: { id: true, code: true, name: true, symbol: true } },
  details: {
    include: {
      serviceConsumption: { include: { service: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'asc' as const },
  },
} satisfies Prisma.InvoiceInclude;

export const invoiceRepository = {
  async findAll(filters: InvoiceFilters): Promise<PaginatedResult<InvoiceWithRelations>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const where: Prisma.InvoiceWhereInput = { deletedAt: null };

    if (filters.search) {
      where.OR = [
        { invoiceNumber: { contains: filters.search } },
        { customer: { firstName: { contains: filters.search } } },
        { customer: { lastName: { contains: filters.search } } },
        { booking: { id: { contains: filters.search } } },
      ];
    }

    if (filters.status) {
      where.status = filters.status as InvoiceStatus;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.issueDate = {};
      if (filters.dateFrom) where.issueDate.gte = new Date(filters.dateFrom);
      if (filters.dateTo) {
        const end = new Date(filters.dateTo);
        end.setHours(23, 59, 59, 999);
        where.issueDate.lte = end;
      }
    }

    const orderBy: Prisma.InvoiceOrderByWithRelationInput = {};
    const sortField =
      filters.sortBy === 'totalAmount'
        ? 'totalAmount'
        : filters.sortBy === 'issueDate'
          ? 'issueDate'
          : 'createdAt';
    orderBy[sortField] = filters.sortOrder ?? 'desc';

    const [data, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: invoiceInclude,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    return {
      data: data as unknown as InvoiceWithRelations[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async findById(id: string): Promise<InvoiceWithRelations | null> {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: invoiceInclude,
    });
    return invoice as unknown as InvoiceWithRelations | null;
  },

  async findByBookingId(bookingId: string): Promise<InvoiceWithRelations | null> {
    const invoice = await prisma.invoice.findUnique({
      where: { bookingId },
      include: invoiceInclude,
    });
    return invoice as unknown as InvoiceWithRelations | null;
  },

  async findNextInvoiceNumber(year: number): Promise<string> {
    const lastInvoice = await prisma.invoice.findFirst({
      where: { invoiceNumber: { startsWith: `FAC-${year}-` } },
      orderBy: { invoiceNumber: 'desc' },
      select: { invoiceNumber: true },
    });

    if (!lastInvoice) return `FAC-${year}-0001`;

    const parts = lastInvoice.invoiceNumber.split('-');
    const lastNum = parseInt(parts[parts.length - 1], 10);
    const nextNum = lastNum + 1;
    return `FAC-${year}-${String(nextNum).padStart(4, '0')}`;
  },

  async createInvoiceTransaction(
    data: Prisma.InvoiceCreateInput,
    details: Prisma.InvoiceDetailCreateWithoutInvoiceInput[],
  ): Promise<InvoiceWithRelations> {
    const invoice = await prisma.$transaction(async (tx) => {
      const created = await tx.invoice.create({
        data: {
          ...data,
          details: { create: details },
        },
        include: invoiceInclude,
      });
      return created;
    });
    return invoice as unknown as InvoiceWithRelations;
  },

  async updateStatus(id: string, status: InvoiceStatus): Promise<InvoiceWithRelations> {
    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status },
      include: invoiceInclude,
    });
    return invoice as unknown as InvoiceWithRelations;
  },

  async cancelInvoiceTransaction(id: string, status: InvoiceStatus): Promise<void> {
    await prisma.invoice.update({
      where: { id },
      data: { status },
    });
  },

  async findBookingForInvoice(bookingId: string) {
    return prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        totalAmount: true,
        paidAmount: true,
        checkInDate: true,
        checkOutDate: true,
        numberOfGuests: true,
        customerId: true,
        promotionId: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            documentType: true,
            documentNumber: true,
            phone: true,
            address: true,
            countryId: true,
          },
        },
        promotion: {
          select: { id: true, name: true, discountType: true, discountValue: true },
        },
        room: {
          select: {
            roomNumber: true,
            roomType: { select: { name: true, basePricePerNight: true } },
          },
        },
        checkIn: { select: { id: true } },
        checkOut: { select: { id: true } },
        invoice: { select: { id: true } },
        payments: {
          where: { status: 'COMPLETED' },
          select: { amount: true },
        },
      },
    });
  },

  async getCountries() {
    return prisma.country.findMany({
      select: { id: true, code: true, name: true },
      orderBy: { name: 'asc' },
    });
  },
};
