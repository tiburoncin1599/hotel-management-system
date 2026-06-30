import { getCustomersAction, getRoomsAction } from '@/features/bookings/actions';
import { BookingForm } from '@/features/bookings/components/booking-form';
import { requireAuth } from '@/lib/auth/helpers';

export default async function NewBookingPage() {
  await requireAuth();
  const [customers, rooms] = await Promise.all([getCustomersAction(), getRoomsAction()]);
  return <BookingForm customers={customers} rooms={rooms} />;
}
