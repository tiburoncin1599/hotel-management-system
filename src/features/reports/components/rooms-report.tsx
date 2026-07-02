'use client';

import { BedDouble, Building2, Wrench, Home } from 'lucide-react';
import { StatCard } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ReportBarChart } from './report-charts';
import type { RoomsReport } from '../types';

interface RoomsReportProps {
  data?: RoomsReport;
  loading?: boolean;
}

export function RoomsReportView({ data, loading }: RoomsReportProps) {
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
        description="Usa los filtros para generar el reporte de habitaciones"
      />
    );
  }

  const { total, byStatus, byType, byFloor } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total habitaciones"
          value={total}
          icon={BedDouble}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        {byStatus
          .filter((s) => s.statusCode === 'available')
          .map((s) => (
            <StatCard
              key={s.statusCode}
              title="Disponibles"
              value={s.count}
              icon={Home}
              iconColor="text-green-600"
              iconBgColor="bg-green-50"
            />
          ))}
        {byStatus
          .filter((s) => s.statusCode === 'occupied')
          .map((s) => (
            <StatCard
              key={s.statusCode}
              title="Ocupadas"
              value={s.count}
              icon={Building2}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-50"
            />
          ))}
        {byStatus
          .filter((s) => s.statusCode === 'maintenance' || s.statusCode === 'out_of_order')
          .map((s) => (
            <StatCard
              key={s.statusCode}
              title={s.statusCode === 'maintenance' ? 'Mantenimiento' : 'Fuera de servicio'}
              value={s.count}
              icon={Wrench}
              iconColor="text-orange-600"
              iconBgColor="bg-orange-50"
            />
          ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ReportBarChart
          title="Habitaciones por estado"
          data={byStatus.map((s) => ({ label: s.status, value: s.count }))}
          loading={loading}
        />
        <ReportBarChart
          title="Habitaciones por tipo"
          data={byType.map((t) => ({ label: t.roomType, value: t.count }))}
          barColor="#10b981"
          loading={loading}
        />
      </div>

      {byFloor.length > 0 && (
        <ReportBarChart
          title="Habitaciones por piso"
          data={byFloor}
          barColor="#f59e0b"
          loading={loading}
        />
      )}

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Distribución por tipo de habitación
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
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Precio base
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Porcentaje
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {byType.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                    No hay tipos de habitación registrados
                  </td>
                </tr>
              ) : (
                byType.map((t) => (
                  <tr key={t.roomType} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
                      {t.roomType}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-600">{t.count}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-600">
                      ${t.basePrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-right text-sm text-gray-600">
                      {total > 0 ? ((t.count / total) * 100).toFixed(1) : '0'}%
                    </td>
                  </tr>
                ))
              )}
              <tr className="bg-gray-50/50 font-medium">
                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-900">Total</td>
                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-900">{total}</td>
                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-900">—</td>
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
