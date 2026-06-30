import { getCountriesAction, getCustomersAction } from './actions';
import { CustomersTable } from './components/customers-table';
import type { CustomerFilters } from './types';

interface Props {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CustomersPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const filters: CustomerFilters = {
    countryId: typeof params.countryId === 'string' ? params.countryId : undefined,
    search: typeof params.search === 'string' ? params.search : undefined,
    page: typeof params.page === 'string' ? Number(params.page) : 1,
    limit: 10,
  };

  const [data, countries] = await Promise.all([getCustomersAction(filters), getCountriesAction()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
        <p className="mt-1 text-sm text-gray-500">Gestiona los clientes del hotel</p>
      </div>

      <CustomersTable data={data} countries={countries} />
    </div>
  );
}
