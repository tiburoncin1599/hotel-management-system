'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, Ban, Search, FileText, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import type { InvoiceWithRelations, PaginatedResult } from '../types';
import { useState } from 'react';
import { CancelInvoiceDialog } from './cancel-invoice-dialog';

interface InvoicesTableProps {
  data: PaginatedResult<InvoiceWithRelations>;
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  ISSUED: 'bg-blue-100 text-blue-700',
  PAID: 'bg-green-100 text-green-700',
  PARTIALLY_PAID: 'bg-yellow-100 text-yellow-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-purple-100 text-purple-700',
};

const statusLabels: Record<string, string> = {
  DRAFT: 'Borrador',
  ISSUED: 'Emitida',
  PAID: 'Pagada',
  PARTIALLY_PAID: 'Pago parcial',
  CANCELLED: 'Anulada',
  REFUNDED: 'Reembolsada',
};

export function InvoicesTable({ data }: InvoicesTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [cancelId, setCancelId] = useState<string | null>(null);

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    router.push(`/dashboard/facturas?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setParam('search', search);
  }

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/dashboard/facturas?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <label htmlFor="invoice-search" className="sr-only">
            Buscar por cliente, número o reserva
          </label>
          <input
            id="invoice-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente, número o reserva..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={searchParams.get('status') ?? ''}
          onChange={(e) => setParam('status', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-all duration-200 focus:border-blue-500 focus:outline-none"
          aria-label="Filtrar por estado"
        >
          <option value="">Todos los estados</option>
          {Object.entries(statusLabels).map(([code, label]) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Factura
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Cliente
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Reserva
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Total
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
          <tbody className="divide-y divide-gray-200">
            {data.data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">No se encontraron facturas</p>
                    <p className="text-xs text-gray-500">
                      Intenta ajustar los filtros o términos de búsqueda
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.data.map((invoice) => (
                <tr key={invoice.id} className="transition-colors duration-150 hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {invoice.customer.firstName} {invoice.customer.lastName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    #{invoice.booking.id.slice(0, 8)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-900">
                    {invoice.currency ? invoice.currency.symbol : '$'}
                    {Number(invoice.totalAmount).toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[invoice.status] ?? 'bg-gray-100 text-gray-700'}`}
                    >
                      {statusLabels[invoice.status] ?? invoice.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/dashboard/facturas/${invoice.id}`}
                        className="rounded-md p-1.5 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-blue-600"
                        aria-label="Ver factura"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/dashboard/facturas/${invoice.id}/pdf`}
                        className="rounded-md p-1.5 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-green-600"
                        aria-label="Descargar PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Link>
                      {invoice.status !== 'CANCELLED' && invoice.status !== 'REFUNDED' && (
                        <button
                          onClick={() => setCancelId(invoice.id)}
                          className="rounded-md p-1.5 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-red-600"
                          aria-label="Anular factura"
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
              className="rounded-md border border-gray-300 p-1.5 text-gray-500 transition-all duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => goToPage(data.page + 1)}
              disabled={data.page >= data.totalPages}
              className="rounded-md border border-gray-300 p-1.5 text-gray-500 transition-all duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Página siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <CancelInvoiceDialog invoiceId={cancelId} onClose={() => setCancelId(null)} />
    </div>
  );
}
