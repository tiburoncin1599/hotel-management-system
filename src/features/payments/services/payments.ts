import { paymentRepository } from '../repositories/payments';
import {
  createPaymentSchema,
  updatePaymentSchema,
  cancelPaymentSchema,
  paymentQuerySchema,
} from '../schemas';
import { Prisma } from '@/generated/prisma/client';
import type {
  PaymentWithRelations,
  PaymentFilters,
  PaginatedResult,
  PaymentDetailData,
  BookingFinancialSummary,
} from '../types';

export const paymentService = {
  async getPayments(filters: PaymentFilters): Promise<PaginatedResult<PaymentWithRelations>> {
    const parsed = paymentQuerySchema.parse({
      page: filters.page ?? 1,
      limit: filters.limit ?? 10,
      search: filters.search,
      status: filters.status,
      paymentMethodId: filters.paymentMethodId,
      currencyId: filters.currencyId,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    });
    return paymentRepository.findAll(parsed);
  },

  async getPaymentById(id: string): Promise<PaymentDetailData | null> {
    if (!id) return null;
    return paymentRepository.findById(id);
  },

  async getBookingPayments(bookingId: string): Promise<PaymentWithRelations[]> {
    if (!bookingId) return [];
    return paymentRepository.findByBookingId(bookingId);
  },

  async createPayment(
    input: Record<string, unknown>,
    userId: string,
    userEmail: string,
  ): Promise<PaymentDetailData> {
    const parsed = createPaymentSchema.parse(input);
    const bookingId = parsed.bookingId;

    let employee = await paymentRepository.findEmployeeByUserId(userId);
    if (!employee) {
      employee = await paymentRepository.createEmployee(userId, userEmail);
    }

    const paymentData: Prisma.PaymentCreateInput = {
      booking: { connect: { id: bookingId } },
      paymentMethod: { connect: { id: parsed.paymentMethodId } },
      amount: parsed.amount.toString(),
      transactionDate: new Date(parsed.transactionDate),
      referenceNumber: parsed.referenceNumber || null,
      notes: parsed.notes || null,
      processedBy: { connect: { id: employee.id } },
    };

    if (parsed.currencyId) {
      paymentData.currency = { connect: { id: parsed.currencyId } };
    }

    return paymentRepository.createPaymentWithBookingUpdate(
      paymentData,
      bookingId,
      parsed.amount.toString(),
    );
  },

  async updatePayment(id: string, input: Record<string, unknown>): Promise<PaymentDetailData> {
    const parsed = updatePaymentSchema.parse({ id, ...input });
    const current = await paymentRepository.findById(id);
    if (!current) throw new Error('Pago no encontrado');
    if (current.status !== 'PENDING' && current.status !== 'COMPLETED') {
      throw new Error('Solo se pueden editar pagos pendientes o completados');
    }

    const oldAmount = Number(current.amount.toString());
    const newAmount = parsed.amount;
    const amountDiff = newAmount - oldAmount;

    const paymentData: Prisma.PaymentUpdateInput = {
      paymentMethod: { connect: { id: parsed.paymentMethodId } },
      amount: parsed.amount.toString(),
      transactionDate: new Date(parsed.transactionDate),
      referenceNumber: parsed.referenceNumber || null,
      notes: parsed.notes || null,
    };

    if (parsed.currencyId) {
      paymentData.currency = { connect: { id: parsed.currencyId } };
    } else {
      paymentData.currency = { disconnect: true };
    }

    return paymentRepository.updatePaymentWithBookingUpdate(
      id,
      paymentData,
      current.booking.id,
      amountDiff,
    );
  },

  async cancelPayment(id: string, reason?: string): Promise<PaymentDetailData> {
    const parsed = cancelPaymentSchema.parse({ id, reason: reason || '' });
    const current = await paymentRepository.findById(parsed.id);
    if (!current) throw new Error('Pago no encontrado');
    if (current.status === 'CANCELLED' || current.status === 'REFUNDED') {
      throw new Error('El pago ya fue cancelado o reembolsado');
    }

    await paymentRepository.cancelPaymentWithBookingUpdate(
      parsed.id,
      'CANCELLED',
      current.booking.id,
      current.amount.toString(),
    );

    return paymentRepository.findById(parsed.id) as unknown as Promise<PaymentDetailData>;
  },

  async getBookingFinancialSummary(bookingId: string): Promise<BookingFinancialSummary> {
    const payments = await paymentRepository.findByBookingId(bookingId);
    const firstPayment = payments[0];
    if (!firstPayment) {
      return {
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        isFullyPaid: false,
        payments: [],
      };
    }

    const booking = firstPayment.booking;
    const totalAmount = Number(booking.totalAmount.toString());
    const paidAmount = Number(booking.paidAmount.toString());
    const pendingAmount = Math.max(0, totalAmount - paidAmount);

    return {
      totalAmount,
      paidAmount,
      pendingAmount,
      isFullyPaid: paidAmount >= totalAmount,
      payments: payments.map((p) => ({
        id: p.id,
        amount: Number(p.amount.toString()),
        status: p.status,
        paymentMethod: { name: p.paymentMethod.name },
        transactionDate: p.transactionDate,
        referenceNumber: p.referenceNumber,
      })),
    };
  },

  async getPaymentMethods(): Promise<{ id: string; code: string; name: string }[]> {
    return paymentRepository.getPaymentMethods();
  },

  async getCurrencies(): Promise<{ id: string; code: string; name: string; symbol: string }[]> {
    return paymentRepository.getCurrencies();
  },
};
