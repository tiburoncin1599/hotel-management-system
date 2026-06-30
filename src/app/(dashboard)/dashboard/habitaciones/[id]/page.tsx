import {
  getRoomByIdAction,
  getRoomStatusesAction,
  getRoomTypesAction,
} from '@/features/rooms/actions';
import { RoomDetail } from '@/features/rooms/components/room-detail';
import { RoomForm } from '@/features/rooms/components/room-form';
import { requireAuth } from '@/lib/auth/helpers';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function RoomDetailPage({ params, searchParams }: Props) {
  await requireAuth();
  const { id } = await params;
  const sp = (await searchParams) ?? {};

  const room = await getRoomByIdAction(id);
  if (!room) notFound();

  if (sp.edit === '1') {
    const [statuses, types] = await Promise.all([getRoomStatusesAction(), getRoomTypesAction()]);
    return <RoomForm statuses={statuses} types={types} room={room} />;
  }

  return <RoomDetail room={room} />;
}
