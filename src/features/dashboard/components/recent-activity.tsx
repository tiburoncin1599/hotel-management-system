'use client';

import Link from 'next/link';
import { CalendarCheck, LogIn, LogOut, DollarSign, UserPlus, Clock } from 'lucide-react';
import type { RecentActivity } from '../types';
import { EmptyState } from '@/components/ui/empty-state';

const activityIcons = {
  booking: CalendarCheck,
  checkin: LogIn,
  checkout: LogOut,
  payment: DollarSign,
  customer: UserPlus,
} as const;

const activityColors = {
  booking: 'text-blue-600 bg-blue-50',
  checkin: 'text-green-600 bg-green-50',
  checkout: 'text-orange-600 bg-orange-50',
  payment: 'text-purple-600 bg-purple-50',
  customer: 'text-teal-600 bg-teal-50',
} as const;

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Hace ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return new Date(date).toLocaleDateString('es-MX');
}

export function RecentActivityView({ activities }: { activities: RecentActivity[] }) {
  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Actividad reciente</h3>
        <EmptyState title="Sin actividad" description="Aún no hay actividad registrada" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-6 py-4">
        <h3 className="text-sm font-semibold text-gray-900">Actividad reciente</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {activities.map((activity) => {
          const Icon = activityIcons[activity.type];
          const colorClass = activityColors[activity.type];
          return (
            <Link
              key={activity.id}
              href={activity.href}
              className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-gray-50"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{activity.description}</p>
                <p className="text-xs text-gray-500">{activity.detail}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
                <Clock className="h-3 w-3" />
                {timeAgo(activity.date)}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
