import {
  getPaymentsAction,
  getPaymentMethodsAction,
  getCurrenciesAction,
} from '@/features/payments/actions';
import { PaymentsTable } from '@/features/payments/components/payments-table';
import type { PaymentFilters } from '@/features/payments/types';

interface Props {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PaymentsPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const filters: PaymentFilters = {
    search: typeof params.search === 'string' ? params.search : undefined,
    status: typeof params.status === 'string' ? params.status : undefined,
    paymentMethodId:
      typeof params.paymentMethodId === 'string' ? params.paymentMethodId : undefined,
    currencyId: typeof params.currencyId === 'string' ? params.currencyId : undefined,
    dateFrom: typeof params.dateFrom === 'string' ? params.dateFrom : undefined,
    dateTo: typeof params.dateTo === 'string' ? params.dateTo : undefined,
    sortBy: typeof params.sortBy === 'string' ? params.sortBy : 'transactionDate',
    sortOrder: typeof params.sortOrder === 'string' ? (params.sortOrder as 'asc' | 'desc') : 'desc',
    page: typeof params.page === 'string' ? Number(params.page) : 1,
    limit: 10,
  };

  const [data, paymentMethods, currencies] = await Promise.all([
    getPaymentsAction(filters),
    getPaymentMethodsAction(),
    getCurrenciesAction(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Pagos</h1>
        <p className="mt-1 text-sm text-gray-500">Gestiona los pagos realizados en el hotel</p>
      </div>

      <PaymentsTable data={data} paymentMethods={paymentMethods} currencies={currencies} />
    </div>
  );
}
