import { getInvoicesAction } from '@/features/invoices/actions';
import { InvoicesTable } from '@/features/invoices/components/invoices-table';
import type { InvoiceFilters } from '@/features/invoices/types';

interface Props {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function InvoicesPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const filters: InvoiceFilters = {
    search: typeof params.search === 'string' ? params.search : undefined,
    status: typeof params.status === 'string' ? params.status : undefined,
    dateFrom: typeof params.dateFrom === 'string' ? params.dateFrom : undefined,
    dateTo: typeof params.dateTo === 'string' ? params.dateTo : undefined,
    sortBy: typeof params.sortBy === 'string' ? params.sortBy : 'issueDate',
    sortOrder: typeof params.sortOrder === 'string' ? (params.sortOrder as 'asc' | 'desc') : 'desc',
    page: typeof params.page === 'string' ? Number(params.page) : 1,
    limit: 10,
  };

  const data = await getInvoicesAction(filters);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Facturas</h1>
        <p className="mt-1 text-sm text-gray-500">Gestiona las facturas emitidas en el hotel</p>
      </div>

      <InvoicesTable data={data} />
    </div>
  );
}
