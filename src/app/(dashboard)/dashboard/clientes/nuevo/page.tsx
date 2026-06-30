import { getCountriesAction } from '@/features/customers/actions';
import { CustomerForm } from '@/features/customers/components/customer-form';
import { requireAuth } from '@/lib/auth/helpers';

export default async function NewCustomerPage() {
  await requireAuth();
  const countries = await getCountriesAction();
  return <CustomerForm countries={countries} />;
}
