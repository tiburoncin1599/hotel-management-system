import { getStayDetailAction } from '@/features/checkin/actions';
import { StayDetailPage } from '@/features/checkin/components/stay-detail';
import { requireAuth } from '@/lib/auth/helpers';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StayDetailRoute({ params }: Props) {
  await requireAuth();
  const { id } = await params;

  const detail = await getStayDetailAction(id);
  if (!detail) notFound();

  return <StayDetailPage detail={detail} />;
}
