'use client';

import { BedDouble, Building2, Wrench, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { ReportBarChart, ReportPieChart } from './report-charts';
import type { OccupancyReport } from '../types';

interface OccupancyReportProps {
  data?: OccupancyReport;
  loading?: boolean;
}

export function OccupancyReportView({ data, loading }: OccupancyReportProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-72 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-72 animate-pulse rounded-xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon={BedDouble}
        title="Selecciona un período"
        description="Usa los filtros para generar el reporte de ocupación"
      />
    );
  }

  const { stats, byRoomType } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Ocupación actual</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-gray-900">
                  {stats.currentRate}%
                </span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform duration-200 group-hover:scale-110">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-gray-100">
            <div
              className={`h-2 rounded-full transition-all ${
                stats.currentRate > 75
                  ? 'bg-green-500'
                  : stats.currentRate > 50
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
              }`}
              style={{ width: `${stats.currentRate}%` }}
            />
          </div>
        </div>
        <StatCard
          title="Disponibles"
          value={stats.available}
          icon={BedDouble}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
        />
        <StatCard
          title="Ocupadas"
          value={stats.occupied}
          icon={Building2}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatCard
          title="En mantenimiento"
          value={stats.maintenance + stats.outOfOrder}
          icon={Wrench}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ReportPieChart
          title="Distribución de ocupación"
          data={[
            { label: 'Disponibles', value: stats.available },
            { label: 'Ocupadas', value: stats.occupied },
            { label: 'Mantenimiento', value: stats.maintenance },
            { label: 'Fuera de servicio', value: stats.outOfOrder },
          ]}
          innerRadius={50}
          outerRadius={90}
          loading={loading}
        />

        <ReportBarChart
          title="Ocupación por tipo de habitación"
          data={byRoomType.map((r) => ({ label: r.roomType, value: r.rate }))}
          barColor="#8b5cf6"
          loading={loading}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Estadísticas por tipo de habitación
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ocupadas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Disponibles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ocupación
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {byRoomType.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                    No hay tipos de habitación registrados
                  </td>
                </tr>
              ) : (
                byRoomType.map((rt) => (
                  <tr key={rt.roomType} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
                      {rt.roomType}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-600">
                      {rt.total}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-600">
                      {rt.occupied}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-600">
                      {rt.available}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-sm">
                      <Badge
                        variant={rt.rate > 75 ? 'success' : rt.rate > 50 ? 'warning' : 'default'}
                      >
                        {rt.rate}%
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
              <tr className="bg-gray-50/50 font-medium">
                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-900">Total</td>
                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-900">{stats.total}</td>
                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-900">
                  {stats.occupied}
                </td>
                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-900">
                  {stats.available}
                </td>
                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-900">
                  {stats.currentRate}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
