'use client';

import { Users, UserPlus, UserCheck, Globe } from 'lucide-react';
import { StatCard } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ReportBarChart } from './report-charts';
import type { CustomersReport } from '../types';

interface CustomersReportProps {
  data?: CustomersReport;
  loading?: boolean;
}

export function CustomersReportView({ data, loading }: CustomersReportProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-xl bg-gray-100" />
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon={Users}
        title="Selecciona un período"
        description="Usa los filtros para generar el reporte de clientes"
      />
    );
  }

  const { stats, dataPoints } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total clientes"
          value={stats.total}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatCard
          title="Nuevos en el período"
          value={stats.newThisPeriod}
          icon={UserPlus}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
        />
        <StatCard
          title="Clientes recurrentes"
          value={stats.returning}
          icon={UserCheck}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
        <StatCard
          title="Países representados"
          value={stats.topCountries.length}
          icon={Globe}
          iconColor="text-teal-600"
          iconBgColor="bg-teal-50"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ReportBarChart title="Nuevos clientes por período" data={dataPoints} loading={loading} />

        {stats.topCountries.length > 0 && (
          <ReportBarChart
            title="Clientes por país"
            data={stats.topCountries}
            barColor="#f59e0b"
            loading={loading}
          />
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-900">Distribución por país</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  País
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Clientes
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Porcentaje
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {stats.topCountries.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-sm text-gray-500">
                    No hay datos de países disponibles
                  </td>
                </tr>
              ) : (
                stats.topCountries.map((c) => (
                  <tr key={c.label} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
                      {c.label}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-600">{c.value}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-right text-sm text-gray-600">
                      {stats.total > 0 ? ((c.value / stats.total) * 100).toFixed(1) : '0'}%
                    </td>
                  </tr>
                ))
              )}
              <tr className="bg-gray-50/50 font-medium">
                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-900">Total</td>
                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-900">{stats.total}</td>
                <td className="whitespace-nowrap px-6 py-3 text-right text-sm text-gray-900">
                  100%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
