import {
  getPaymentByIdAction,
  getPaymentMethodsAction,
  getCurrenciesAction,
} from '@/features/payments/actions';
import { PaymentDetail } from '@/features/payments/components/payment-detail';
import { PaymentForm } from '@/features/payments/components/payment-form';
import { CancelPaymentDialog } from '@/features/payments/components/cancel-payment-dialog';
import { requireAuth } from '@/lib/auth/helpers';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PaymentDetailPage({ params, searchParams }: Props) {
  await requireAuth();
  const { id } = await params;
  const sp = (await searchParams) ?? {};

  const payment = await getPaymentByIdAction(id);
  if (!payment) notFound();

  if (sp.edit === '1') {
    const [paymentMethods, currencies] = await Promise.all([
      getPaymentMethodsAction(),
      getCurrenciesAction(),
    ]);
    return (
      <PaymentForm paymentMethods={paymentMethods} currencies={currencies} payment={payment} />
    );
  }

  return (
    <div>
      <PaymentDetail payment={payment} />
      {sp.cancel === '1' && <CancelPaymentDialog paymentId={id} onClose={() => {}} />}
    </div>
  );
}
