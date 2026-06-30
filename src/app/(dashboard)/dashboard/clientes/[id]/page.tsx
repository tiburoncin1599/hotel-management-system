import { getCustomerByIdAction, getCountriesAction } from '@/features/customers/actions';
import { CustomerDetail } from '@/features/customers/components/customer-detail';
import { CustomerForm } from '@/features/customers/components/customer-form';
import { requireAuth } from '@/lib/auth/helpers';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CustomerDetailPage({ params, searchParams }: Props) {
  await requireAuth();
  const { id } = await params;
  const sp = (await searchParams) ?? {};

  const customer = await getCustomerByIdAction(id);
  if (!customer) notFound();

  if (sp.edit === '1') {
    const countries = await getCountriesAction();
    return <CustomerForm countries={countries} customer={customer} />;
  }

  return <CustomerDetail customer={customer} />;
}
