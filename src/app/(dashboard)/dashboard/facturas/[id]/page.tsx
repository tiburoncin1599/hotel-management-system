import { getInvoiceByIdAction } from '@/features/invoices/actions';
import { InvoiceDetail } from '@/features/invoices/components/invoice-detail';
import { CancelInvoiceDialog } from '@/features/invoices/components/cancel-invoice-dialog';
import { requireAuth } from '@/lib/auth/helpers';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function InvoiceDetailPage({ params, searchParams }: Props) {
  await requireAuth();
  const { id } = await params;
  const sp = (await searchParams) ?? {};

  const invoice = await getInvoiceByIdAction(id);
  if (!invoice) notFound();

  return (
    <div>
      <InvoiceDetail invoice={invoice} />
      {sp.cancel === '1' && <CancelInvoiceDialog invoiceId={id} onClose={() => {}} />}
    </div>
  );
}
