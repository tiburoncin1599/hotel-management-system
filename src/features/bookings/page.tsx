import { getBookingsAction, getBookingStatusesAction } from './actions';
import { BookingsTable } from './components/bookings-table';
import type { BookingFilters } from './types';

interface Props {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BookingsPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const filters: BookingFilters = {
    statusId: typeof params.statusId === 'string' ? params.statusId : undefined,
    search: typeof params.search === 'string' ? params.search : undefined,
    dateFrom: typeof params.dateFrom === 'string' ? params.dateFrom : undefined,
    dateTo: typeof params.dateTo === 'string' ? params.dateTo : undefined,
    sortBy: typeof params.sortBy === 'string' ? params.sortBy : 'createdAt',
    sortOrder: typeof params.sortOrder === 'string' ? (params.sortOrder as 'asc' | 'desc') : 'desc',
    page: typeof params.page === 'string' ? Number(params.page) : 1,
    limit: 10,
  };

  const [data, statuses] = await Promise.all([
    getBookingsAction(filters),
    getBookingStatusesAction(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reservas</h1>
        <p className="mt-1 text-sm text-gray-500">Gestiona las reservas del hotel</p>
      </div>

      <BookingsTable data={data} statuses={statuses} />
    </div>
  );
}
