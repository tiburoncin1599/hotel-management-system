import { getCurrentUser } from '@/lib/auth/helpers';
import { getDashboardDataAction } from '@/features/dashboard/actions';
import { DashboardClient } from '@/features/dashboard/components/dashboard-client';
import { Suspense } from 'react';
import { CardSkeleton, ChartSkeleton } from '@/components/ui/skeleton';

async function DashboardContent() {
  const [user, data] = await Promise.all([getCurrentUser(), getDashboardDataAction()]);

  return <DashboardClient userEmail={user?.email ?? 'usuario'} data={data} />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardFallback() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-200" />
        <div className="mt-2 h-5 w-80 animate-pulse rounded-lg bg-gray-200" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}
