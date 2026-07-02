import { Suspense } from 'react';
import { requireAuth } from '@/lib/auth/helpers';
import { CardSkeleton } from '@/components/ui/skeleton';
import SettingsPage from '@/features/settings/page';

export default async function SettingsRoute() {
  await requireAuth();
  return (
    <Suspense fallback={<SettingsFallback />}>
      <SettingsPage />
    </Suspense>
  );
}

function SettingsFallback() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-gray-200" />
      <div className="h-4 w-72 rounded-lg bg-gray-100" />
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 w-32 rounded-lg bg-gray-100" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
