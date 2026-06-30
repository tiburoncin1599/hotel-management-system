import {
  getBookingByIdAction,
  getCustomersAction,
  getRoomsAction,
} from '@/features/bookings/actions';
import { bookingService } from '@/features/bookings/services/bookings';
import { BookingDetail } from '@/features/bookings/components/booking-detail';
import { BookingForm } from '@/features/bookings/components/booking-form';
import { getBookingFinancialSummaryAction } from '@/features/payments/actions';
import { getInvoiceByBookingIdAction } from '@/features/invoices/actions';
import { requireAuth } from '@/lib/auth/helpers';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BookingDetailPage({ params, searchParams }: Props) {
  await requireAuth();
  const { id } = await params;
  const sp = (await searchParams) ?? {};

  const booking = await getBookingByIdAction(id);
  if (!booking) notFound();

  if (sp.edit === '1') {
    const [customers, rooms] = await Promise.all([getCustomersAction(), getRoomsAction()]);
    return <BookingForm customers={customers} rooms={rooms} booking={booking} />;
  }

  const [detail, financialSummary, invoice] = await Promise.all([
    bookingService.getBookingDetail(booking),
    getBookingFinancialSummaryAction(id),
    getInvoiceByBookingIdAction(id).catch(() => null),
  ]);

  return (
    <BookingDetail
      booking={booking}
      detail={detail}
      financialSummary={financialSummary}
      invoice={invoice}
    />
  );
}
