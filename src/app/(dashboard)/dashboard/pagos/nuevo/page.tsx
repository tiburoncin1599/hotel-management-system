import { getPaymentMethodsAction, getCurrenciesAction } from '@/features/payments/actions';
import { PaymentForm } from '@/features/payments/components/payment-form';
import { requireAuth } from '@/lib/auth/helpers';

interface Props {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function NewPaymentPage({ searchParams }: Props) {
  await requireAuth();
  const sp = (await searchParams) ?? {};
  const bookingId = typeof sp.bookingId === 'string' ? sp.bookingId : undefined;

  const [paymentMethods, currencies] = await Promise.all([
    getPaymentMethodsAction(),
    getCurrenciesAction(),
  ]);

  return (
    <PaymentForm
      paymentMethods={paymentMethods}
      currencies={currencies}
      defaultBookingId={bookingId}
    />
  );
}
