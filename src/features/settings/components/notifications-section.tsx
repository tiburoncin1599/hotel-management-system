'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { markNotificationReadAction } from '../actions';
import { Bell, CheckCheck, Mail, MailOpen } from 'lucide-react';
import type { Notification } from '@/generated/prisma/client';

interface NotificationsSectionProps {
  notifications: Notification[];
}

export function NotificationsSection({ notifications }: NotificationsSectionProps) {
  const router = useRouter();
  const [markingId, setMarkingId] = useState<string | null>(null);

  async function handleMarkRead(id: string) {
    setMarkingId(id);
    await markNotificationReadAction(id);
    setMarkingId(null);
    router.refresh();
  }

  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);

  function renderNotificationList(items: Notification[], emptyText: string) {
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Bell className="h-12 w-12 mb-3" />
          <p className="text-sm font-medium text-gray-500">{emptyText}</p>
        </div>
      );
    }

    return (
      <div className="divide-y divide-gray-100">
        {items.map((n) => (
          <div
            key={n.id}
            className={`flex items-start gap-3 px-4 py-3 transition-colors duration-150 ${
              !n.isRead ? 'bg-blue-50/50' : 'hover:bg-gray-50'
            }`}
          >
            <div className="mt-0.5">
              {n.isRead ? (
                <MailOpen className="h-4 w-4 text-gray-400" />
              ) : (
                <Mail className="h-4 w-4 text-blue-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm ${!n.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}
              >
                {n.title}
              </p>
              {n.message && (
                <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{n.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
            {!n.isRead && (
              <button
                onClick={() => handleMarkRead(n.id)}
                disabled={markingId === n.id}
                className="rounded-md p-1.5 text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 disabled:opacity-50"
                aria-label="Marcar como leída"
                title="Marcar como leída"
              >
                <CheckCheck className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">No leídas ({unread.length})</h3>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          {renderNotificationList(unread, 'No tienes notificaciones sin leer')}
        </div>
      </div>

      {read.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Leídas ({read.length})</h3>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            {renderNotificationList(read, '')}
          </div>
        </div>
      )}
    </div>
  );
}
