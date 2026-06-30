import { getInvoiceByIdAction } from '@/features/invoices/actions';
import { InvoicePdf } from '@/features/invoices/components/invoice-pdf';
import { requireAuth } from '@/lib/auth/helpers';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InvoicePdfPage({ params }: Props) {
  await requireAuth();
  const { id } = await params;

  const invoice = await getInvoiceByIdAction(id);
  if (!invoice) notFound();

  return <InvoicePdf invoice={invoice} />;
}
