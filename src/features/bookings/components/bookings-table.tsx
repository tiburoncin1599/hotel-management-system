'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, Pencil, XCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { BookingWithRelations, PaginatedResult } from '../types';
import { useState } from 'react';
import { CancelBookingDialog } from './cancel-dialog';

interface BookingsTableProps {
  data: PaginatedResult<BookingWithRelations>;
  statuses: { id: string; code: string; name: string; color?: string | null }[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  checked_in: 'bg-green-100 text-green-700',
  checked_out: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
  no_show: 'bg-orange-100 text-orange-700',
};

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function computeNights(checkIn: Date | string, checkOut: Date | string): number {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function BookingsTable({ data, statuses }: BookingsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [cancelId, setCancelId] = useState<string | null>(null);

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/dashboard/reservas?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setParam('search', search);
  }

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/dashboard/reservas?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <label htmlFor="booking-search" className="sr-only">
            Buscar por cliente, habitación o ID
          </label>
          <input
            id="booking-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente, habitación o ID..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
          />
        </form>

        <Link
          href="/dashboard/reservas/nuevo"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Nueva reserva
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={searchParams.get('statusId') ?? ''}
          onChange={(e) => setParam('statusId', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none transition-all duration-200"
          aria-label="Filtrar por estado"
        >
          <option value="">Todos los estados</option>
          {statuses.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="date-from">
          Fecha entrada desde
        </label>
        <input
          id="date-from"
          type="date"
          value={searchParams.get('dateFrom') ?? ''}
          onChange={(e) => setParam('dateFrom', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
        />

        <label className="sr-only" htmlFor="date-to">
          Fecha entrada hasta
        </label>
        <input
          id="date-to"
          type="date"
          value={searchParams.get('dateTo') ?? ''}
          onChange={(e) => setParam('dateTo', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
        />

        <select
          value={searchParams.get('sortBy') ?? 'createdAt'}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('sortBy', e.target.value);
            params.set('page', '1');
            router.push(`/dashboard/reservas?${params.toString()}`);
          }}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none transition-all duration-200"
          aria-label="Ordenar por"
        >
          <option value="createdAt">Creación</option>
          <option value="checkInDate">Fecha de llegada</option>
        </select>
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
                Noches
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Estado
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.data.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">No se encontraron reservas</p>
                    <p className="text-xs text-gray-500">
                      Intenta ajustar los filtros o términos de búsqueda
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.data.map((booking) => {
                const nights = computeNights(booking.checkInDate, booking.checkOutDate);
                return (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {booking.customer.firstName} {booking.customer.lastName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      #{booking.room.roomNumber}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {formatDate(booking.checkInDate)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {formatDate(booking.checkOutDate)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{nights}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      ${Number(booking.totalAmount).toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          statusColors[booking.status.code] ?? 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {booking.status.name}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/dashboard/reservas/${booking.id}`}
                          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200"
                          aria-label="Ver detalle"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/dashboard/reservas/${booking.id}?edit=1`}
                          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200"
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        {booking.status.code !== 'cancelled' && (
                          <button
                            onClick={() => setCancelId(booking.id)}
                            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-all duration-200"
                            aria-label="Cancelar"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Página {data.page} de {data.totalPages} ({data.total} registros)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(data.page - 1)}
              disabled={data.page <= 1}
              className="rounded-md border border-gray-300 p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => goToPage(data.page + 1)}
              disabled={data.page >= data.totalPages}
              className="rounded-md border border-gray-300 p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Página siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <CancelBookingDialog bookingId={cancelId} onClose={() => setCancelId(null)} />
    </div>
  );
}
