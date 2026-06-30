import { getRoomStatusesAction, getRoomTypesAction, getRoomsAction } from './actions';
import { RoomsTable } from './components/rooms-table';
import type { RoomFilters } from './types';

interface Props {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function RoomsPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const filters: RoomFilters = {
    statusId: typeof params.statusId === 'string' ? params.statusId : undefined,
    roomTypeId: typeof params.roomTypeId === 'string' ? params.roomTypeId : undefined,
    search: typeof params.search === 'string' ? params.search : undefined,
    page: typeof params.page === 'string' ? Number(params.page) : 1,
    limit: 10,
  };

  const [data, statuses, types] = await Promise.all([
    getRoomsAction(filters),
    getRoomStatusesAction(),
    getRoomTypesAction(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Habitaciones</h1>
        <p className="mt-1 text-sm text-gray-500">Gestiona las habitaciones del hotel</p>
      </div>

      <RoomsTable data={data} statuses={statuses} types={types} />
    </div>
  );
}
