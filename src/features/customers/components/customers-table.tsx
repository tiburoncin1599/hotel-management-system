'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { CustomerWithCountry, PaginatedResult } from '../types';
import { useState } from 'react';
import { DeleteCustomerDialog } from './delete-dialog';

interface CustomersTableProps {
  data: PaginatedResult<CustomerWithCountry>;
  countries: { id: string; code: string; name: string }[];
}

export function CustomersTable({ data, countries }: CustomersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/dashboard/clientes?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setParam('search', search);
  }

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/dashboard/clientes?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <label htmlFor="customer-search" className="sr-only">
            Buscar por nombre, email o documento
          </label>
          <input
            id="customer-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o documento..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
          />
        </form>

        <Link
          href="/dashboard/clientes/nuevo"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Nuevo cliente
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={searchParams.get('countryId') ?? ''}
          onChange={(e) => setParam('countryId', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none transition-all duration-200"
          aria-label="Filtrar por país"
        >
          <option value="">Todos los países</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Documento
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                País
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Teléfono
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
                <td colSpan={7} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">No se encontraron clientes</p>
                    <p className="text-xs text-gray-500">
                      Intenta ajustar los filtros o términos de búsqueda
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.data.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                    {customer.firstName} {customer.lastName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {customer.email ?? '—'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {customer.documentType && customer.documentNumber
                      ? `${customer.documentType} ${customer.documentNumber}`
                      : '—'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {customer.country?.name ?? '—'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {customer.phone ?? '—'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        customer.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {customer.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/dashboard/clientes/${customer.id}`}
                        className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200"
                        aria-label="Ver detalle"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/dashboard/clientes/${customer.id}?edit=1`}
                        className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200"
                        aria-label="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(customer.id)}
                        className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-all duration-200"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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

      <DeleteCustomerDialog customerId={deleteId} onClose={() => setDeleteId(null)} />
    </div>
  );
}
