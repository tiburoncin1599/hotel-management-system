'use client';

import { useState } from 'react';
import { Calendar, User, BedDouble, Clock, LogIn, LogOut, Eye, Search } from 'lucide-react';
import { CheckInDialog } from './checkin-dialog';
import { CheckOutDialog } from './checkout-dialog';
import Link from 'next/link';

interface BookingLike {
  id: string;
  customer: { firstName: string; lastName: string; email?: string | null };
  room: { roomNumber: string; roomType: { name: string } };
  status: { code: string; name: string };
  checkInDate: Date | string;
  checkOutDate: Date | string;
  numberOfGuests: number;
  checkIn: { id: string; employee: { firstName: string; lastName: string } } | null;
  checkOut: { id: string } | null;
}

interface CheckInOutPageProps {
  pendingCheckIns: BookingLike[];
  activeGuests: BookingLike[];
  readyForCheckOut: BookingLike[];
}

type Tab = 'pending' | 'active' | 'checkout';

function formatDateShort(date: Date | string) {
  return new Date(date).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function CheckInOutPage({
  pendingCheckIns,
  activeGuests,
  readyForCheckOut,
}: CheckInOutPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [checkInBooking, setCheckInBooking] = useState<string | null>(null);
  const [checkOutBooking, setCheckOutBooking] = useState<string | null>(null);

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count: number; color: string }[] = [
    {
      key: 'pending',
      label: 'Pendientes Check-In',
      icon: <LogIn className="h-4 w-4" />,
      count: pendingCheckIns.length,
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      key: 'active',
      label: 'Huéspedes Actuales',
      icon: <User className="h-4 w-4" />,
      count: activeGuests.length,
      color: 'text-green-600 bg-green-50',
    },
    {
      key: 'checkout',
      label: 'Listos para Check-Out',
      icon: <LogOut className="h-4 w-4" />,
      count: readyForCheckOut.length,
      color: 'text-blue-600 bg-blue-50',
    },
  ];

  function getCurrentData() {
    switch (activeTab) {
      case 'pending':
        return pendingCheckIns;
      case 'active':
        return activeGuests;
      case 'checkout':
        return readyForCheckOut;
    }
  }

  const data = getCurrentData();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-gray-200" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            role="tab"
            aria-selected={activeTab === tab.key}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-medium ${tab.color}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Cliente
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Habitación
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Entrada
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Salida
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Huéspedes
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    {activeTab === 'pending' && (
                      <>
                        <p className="text-sm font-medium text-gray-900">
                          No hay reservas pendientes de check-in
                        </p>
                        <p className="text-xs text-gray-500">
                          Las reservas confirmadas aparecerán aquí
                        </p>
                      </>
                    )}
                    {activeTab === 'active' && (
                      <>
                        <p className="text-sm font-medium text-gray-900">
                          No hay huéspedes hospedados actualmente
                        </p>
                        <p className="text-xs text-gray-500">
                          Los huéspedes con check-in completado aparecerán aquí
                        </p>
                      </>
                    )}
                    {activeTab === 'checkout' && (
                      <>
                        <p className="text-sm font-medium text-gray-900">
                          No hay reservas listas para check-out
                        </p>
                        <p className="text-xs text-gray-500">
                          Las reservas próximas a su fecha de salida aparecerán aquí
                        </p>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                    {booking.customer.firstName} {booking.customer.lastName}
                    {booking.customer.email && (
                      <div className="text-xs text-gray-500">{booking.customer.email}</div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <BedDouble className="h-3.5 w-3.5 text-gray-400" />#{booking.room.roomNumber}
                    </div>
                    <div className="text-xs text-gray-400">{booking.room.roomType.name}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      {formatDateShort(booking.checkInDate)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      {formatDateShort(booking.checkOutDate)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-gray-400" />
                      {booking.numberOfGuests}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center text-sm">
                    <div className="flex items-center justify-center gap-2">
                      {activeTab === 'pending' && (
                        <button
                          onClick={() => setCheckInBooking(booking.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition-all duration-200"
                        >
                          <LogIn className="h-3.5 w-3.5" />
                          Check-In
                        </button>
                      )}
                      {activeTab === 'active' && (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                            <Clock className="h-3 w-3" />
                            Hospedado
                          </span>
                          <Link
                            href={`/dashboard/check/${booking.id}`}
                            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200"
                            aria-label="Ver estancia"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </div>
                      )}
                      {activeTab === 'checkout' && (
                        <button
                          onClick={() => setCheckOutBooking(booking.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-all duration-200"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Check-Out
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CheckInDialog bookingId={checkInBooking} onClose={() => setCheckInBooking(null)} />

      <CheckOutDialog bookingId={checkOutBooking} onClose={() => setCheckOutBooking(null)} />
    </div>
  );
}
