import { getRoomStatusesAction, getRoomTypesAction } from '@/features/rooms/actions';
import { RoomForm } from '@/features/rooms/components/room-form';
import { requireAuth } from '@/lib/auth/helpers';

export default async function NewRoomPage() {
  await requireAuth();
  const [statuses, types] = await Promise.all([getRoomStatusesAction(), getRoomTypesAction()]);

  return <RoomForm statuses={statuses} types={types} />;
}
