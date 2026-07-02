import { Suspense } from 'react';
import { requireAuth } from '@/lib/auth/helpers';
import ReportsPage from '@/features/reports/page';

export default async function ReportsRoute() {
  await requireAuth();
  return (
    <Suspense fallback={<ReportsFallback />}>
      <ReportsPage />
    </Suspense>
  );
}

function ReportsFallback() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-gray-200" />
      <div className="h-4 w-72 rounded-lg bg-gray-100" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-gray-100" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-80 rounded-xl bg-gray-100" />
        ))}
      </div>
    </div>
  );
}
