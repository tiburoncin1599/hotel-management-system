'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, Pencil, Ban, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaymentWithRelations, PaginatedResult } from '../types';
import { useState } from 'react';
import { CancelPaymentDialog } from './cancel-payment-dialog';

interface PaymentsTableProps {
  data: PaginatedResult<PaymentWithRelations>;
  paymentMethods: { id: string; code: string; name: string }[];
  currencies: { id: string; code: string; name: string; symbol: string }[];
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-green-100 text-green-700',
  REFUNDED: 'bg-purple-100 text-purple-700',
  FAILED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-700',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completado',
  REFUNDED: 'Reembolsado',
  FAILED: 'Fallido',
  CANCELLED: 'Cancelado',
};

export function PaymentsTable({ data, paymentMethods, currencies }: PaymentsTableProps) {
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
    router.push(`/dashboard/pagos?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setParam('search', search);
  }

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/dashboard/pagos?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <label htmlFor="payment-search" className="sr-only">
            Buscar por referencia, cliente o nota
          </label>
          <input
            id="payment-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por referencia, cliente..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
          />
        </form>

        <Link
          href="/dashboard/pagos/nuevo"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Nuevo pago
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={searchParams.get('status') ?? ''}
          onChange={(e) => setParam('status', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none transition-all duration-200"
        >
          <option value="">Todos los estados</option>
          {Object.entries(statusLabels).map(([code, label]) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get('paymentMethodId') ?? ''}
          onChange={(e) => setParam('paymentMethodId', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none transition-all duration-200"
        >
          <option value="">Todos los métodos</option>
          {paymentMethods.map((pm) => (
            <option key={pm.id} value={pm.id}>
              {pm.name}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get('currencyId') ?? ''}
          onChange={(e) => setParam('currencyId', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none transition-all duration-200"
        >
          <option value="">Todas las monedas</option>
          {currencies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code}
            </option>
          ))}
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
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Monto
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Método
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Fecha
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">No se encontraron pagos</p>
                    <p className="text-xs text-gray-500">
                      Intenta ajustar los filtros o términos de búsqueda
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.data.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                    {payment.booking.customer.firstName} {payment.booking.customer.lastName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {payment.booking.room.roomNumber}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-900">
                    {payment.currency ? payment.currency.symbol : '$'}
                    {Number(payment.amount).toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {payment.paymentMethod.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[payment.status] ?? 'bg-gray-100 text-gray-700'}`}
                    >
                      {statusLabels[payment.status] ?? payment.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                    {new Date(payment.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/dashboard/pagos/${payment.id}`}
                        className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200"
                        aria-label="Ver detalle del pago"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      {(payment.status === 'PENDING' || payment.status === 'COMPLETED') && (
                        <Link
                          href={`/dashboard/pagos/${payment.id}?edit=1`}
                          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200"
                          aria-label="Editar pago"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      )}
                      {payment.status !== 'CANCELLED' && payment.status !== 'REFUNDED' && (
                        <button
                          onClick={() => setCancelId(payment.id)}
                          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-all duration-200"
                          aria-label="Cancelar pago"
                        >
                          <Ban className="h-4 w-4" />
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

      <CancelPaymentDialog paymentId={cancelId} onClose={() => setCancelId(null)} />
    </div>
  );
}
