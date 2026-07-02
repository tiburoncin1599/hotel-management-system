'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, Filter, RotateCcw } from 'lucide-react';

export function ReportFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const period = searchParams.get('period') ?? 'monthly';
  const dateFrom = searchParams.get('dateFrom') ?? '';
  const dateTo = searchParams.get('dateTo') ?? '';

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/dashboard/reportes?${params.toString()}`);
  }

  function applyFilters() {
    const params = new URLSearchParams();
    params.set('period', period);
    if (period === 'range') {
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
    }
    router.push(`/dashboard/reportes?${params.toString()}`);
  }

  function clearFilters() {
    router.push('/dashboard/reportes');
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <div className="space-y-1">
        <label htmlFor="period" className="text-xs font-medium text-gray-500">
          Período
        </label>
        <select
          id="period"
          value={period}
          onChange={(e) => setParam('period', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          aria-label="Seleccionar período"
        >
          <option value="daily">Diario</option>
          <option value="weekly">Semanal</option>
          <option value="monthly">Mensual</option>
          <option value="annual">Anual</option>
          <option value="range">Personalizado</option>
        </select>
      </div>

      {period === 'range' && (
        <>
          <div className="space-y-1">
            <label htmlFor="dateFrom" className="text-xs font-medium text-gray-500">
              Desde
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setParam('dateFrom', e.target.value)}
                className="rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="dateTo" className="text-xs font-medium text-gray-500">
              Hasta
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setParam('dateTo', e.target.value)}
                className="rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </>
      )}

      <button
        onClick={applyFilters}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all duration-200"
      >
        <Filter className="h-4 w-4" />
        Aplicar
      </button>

      <button
        onClick={clearFilters}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
      >
        <RotateCcw className="h-4 w-4" />
        Limpiar
      </button>
    </div>
  );
}
