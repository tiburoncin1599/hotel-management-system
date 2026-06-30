import { invoiceRepository } from '../repositories/invoices';
import { generateInvoiceSchema, cancelInvoiceSchema, invoiceQuerySchema } from '../schemas';
import { Prisma } from '@/generated/prisma/client';
import type { InvoiceWithRelations, InvoiceFilters, PaginatedResult } from '../types';

export const invoiceService = {
  async getInvoices(filters: InvoiceFilters): Promise<PaginatedResult<InvoiceWithRelations>> {
    const parsed = invoiceQuerySchema.parse({
      page: filters.page ?? 1,
      limit: filters.limit ?? 10,
      search: filters.search,
      status: filters.status,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    });
    return invoiceRepository.findAll(parsed);
  },

  async getInvoiceById(id: string): Promise<InvoiceWithRelations | null> {
    if (!id) return null;
    return invoiceRepository.findById(id);
  },

  async generateInvoice(
    input: Record<string, unknown>,
    userId: string,
  ): Promise<InvoiceWithRelations> {
    const parsed = generateInvoiceSchema.parse(input);
    const bookingId = parsed.bookingId;

    const booking = await invoiceRepository.findBookingForInvoice(bookingId);
    if (!booking) throw new Error('Reserva no encontrada');
    if (!booking.checkOut) throw new Error('La reserva no tiene check-out registrado');
    if (booking.invoice) throw new Error('La reserva ya tiene una factura generada');

    const totalAmount = Number(booking.totalAmount.toString());
    const paidAmount = Number(booking.paidAmount.toString());

    if (paidAmount < totalAmount) {
      throw new Error('No se puede facturar una reserva con saldo pendiente');
    }

    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    const nights = Math.max(
      1,
      Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const basePricePerNight = Number(booking.room.roomType.basePricePerNight.toString());
    const subtotal = nights * basePricePerNight;

    const taxRate = parsed.taxRate ? parseFloat(parsed.taxRate) / 100 : 0;
    let discountAmount = 0;
    if (booking.promotion) {
      const discountValue = Number(booking.promotion.discountValue.toString());
      discountAmount =
        booking.promotion.discountType === 'PERCENTAGE'
          ? subtotal * (discountValue / 100)
          : Math.min(discountValue, subtotal);
    }

    const afterDiscount = Math.max(0, subtotal - discountAmount);
    const taxAmount = afterDiscount * taxRate;
    const finalTotal = afterDiscount + taxAmount;

    const year = new Date().getFullYear();
    const invoiceNumber = await invoiceRepository.findNextInvoiceNumber(year);

    const invoiceData: Prisma.InvoiceCreateInput = {
      invoiceNumber,
      booking: { connect: { id: bookingId } },
      customer: { connect: { id: booking.customerId } },
      customerNameAtIssue: `${booking.customer.firstName} ${booking.customer.lastName}`,
      customerDocAtIssue: booking.customer.documentNumber ?? undefined,
      issueDate: new Date(parsed.issueDate),
      dueDate: parsed.dueDate ? new Date(parsed.dueDate) : undefined,
      status: 'ISSUED',
      subtotal: subtotal.toString(),
      taxAmount: taxAmount.toString(),
      discountAmount: discountAmount.toString(),
      totalAmount: finalTotal.toString(),
      notes: parsed.notes || undefined,
      createdBy: { connect: { id: userId } },
    };

    if (parsed.currencyId) {
      invoiceData.currency = { connect: { id: parsed.currencyId } };
    }

    const details: Prisma.InvoiceDetailCreateWithoutInvoiceInput[] = [
      {
        description: `Alojamiento - ${booking.room.roomType.name} (Hab. ${booking.room.roomNumber})`,
        quantity: nights,
        unitPrice: basePricePerNight.toString(),
        totalAmount: subtotal.toString(),
        lineType: 'room',
      },
    ];

    if (discountAmount > 0 && booking.promotion) {
      details.push({
        description: `Descuento: ${booking.promotion.name}`,
        quantity: 1,
        unitPrice: `-${discountAmount.toString()}`,
        totalAmount: `-${discountAmount.toString()}`,
        lineType: 'discount',
      });
    }

    if (taxAmount > 0) {
      details.push({
        description: `IVA/Impuesto (${(taxRate * 100).toFixed(0)}%)`,
        quantity: 1,
        unitPrice: taxAmount.toString(),
        totalAmount: taxAmount.toString(),
        lineType: 'tax',
      });
    }

    return invoiceRepository.createInvoiceTransaction(invoiceData, details);
  },

  async cancelInvoice(id: string, reason: string): Promise<InvoiceWithRelations> {
    const parsed = cancelInvoiceSchema.parse({ id, reason });
    const current = await invoiceRepository.findById(parsed.id);
    if (!current) throw new Error('Factura no encontrada');
    if (current.status === 'CANCELLED') throw new Error('La factura ya está anulada');

    await invoiceRepository.cancelInvoiceTransaction(parsed.id, 'CANCELLED');

    return invoiceRepository.findById(parsed.id) as unknown as Promise<InvoiceWithRelations>;
  },

  async getInvoiceByBookingId(bookingId: string): Promise<InvoiceWithRelations | null> {
    if (!bookingId) return null;
    return invoiceRepository.findByBookingId(bookingId);
  },
};
