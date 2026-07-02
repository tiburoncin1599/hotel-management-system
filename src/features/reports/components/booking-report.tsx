'use client';

import { CalendarCheck, Ban, Clock, DollarSign, Download } from 'lucide-react';
import { StatCard } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { ReportBarChart } from './report-charts';
import type { BookingReport } from '../types';

interface BookingReportProps {
  data?: BookingReport;
  loading?: boolean;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

export function BookingReportView({
  data,
  loading,
  onExportPDF,
  onExportExcel,
}: BookingReportProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-xl bg-gray-100" />
        <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon={CalendarCheck}
        title="Selecciona un período"
        description="Usa los filtros para generar el reporte de reservas"
      />
    );
  }

  const { totals, stats, dataPoints } = data;

  if (totals.total === 0) {
    return (
      <div className="space-y-4">
        <EmptyState
          icon={CalendarCheck}
          title="Sin reservas en este período"
          description="No se encontraron reservas para el período seleccionado"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total reservas"
          value={totals.total}
          icon={CalendarCheck}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatCard
          title="Valor promedio"
          value={`$${stats.averageValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
        />
        <StatCard
          title="Noches promedio"
          value={stats.averageNights}
          icon={Clock}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
        <StatCard
          title="Cancelaciones"
          value={`${stats.cancellationRate}%`}
          icon={Ban}
          iconColor="text-red-600"
          iconBgColor="bg-red-50"
          trend={{ value: `${totals.cancelled} reservas`, positive: stats.cancellationRate < 20 }}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReportBarChart title="Reservas por período" data={dataPoints} loading={loading} />
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Resumen de estados</h3>
            <div className="space-y-3">
              <StatusRow
                label="Confirmadas"
                count={totals.confirmed}
                total={totals.total}
                color="bg-green-500"
              />
              <StatusRow
                label="Pendientes"
                count={totals.pending}
                total={totals.total}
                color="bg-yellow-500"
              />
              <StatusRow
                label="Completadas"
                count={totals.completed}
                total={totals.total}
                color="bg-blue-500"
              />
              <StatusRow
                label="Canceladas"
                count={totals.cancelled}
                total={totals.total}
                color="bg-red-500"
              />
              <StatusRow
                label="No show"
                count={totals.noShow}
                total={totals.total}
                color="bg-gray-500"
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Ingresos</h3>
            <p className="text-2xl font-bold text-gray-900">
              ${stats.totalRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
            <p className="mt-1 text-xs text-gray-500">Ingreso total generado por reservas</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-900">Detalle de reservas</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onExportPDF}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              <Download className="h-3.5 w-3.5" />
              PDF
            </button>
            <button
              onClick={onExportExcel}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              <Download className="h-3.5 w-3.5" />
              Excel
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Porcentaje
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {[
                { label: 'Confirmadas', count: totals.confirmed, color: 'success' },
                { label: 'Pendientes', count: totals.pending, color: 'warning' },
                { label: 'Completadas', count: totals.completed, color: 'info' },
                { label: 'Canceladas', count: totals.cancelled, color: 'danger' },
                { label: 'No show', count: totals.noShow, color: 'default' },
              ].map((row) => (
                <tr key={row.label} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="whitespace-nowrap px-6 py-3 text-sm">
                    <Badge
                      variant={row.color as 'success' | 'warning' | 'info' | 'danger' | 'default'}
                    >
                      {row.label}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
                    {row.count}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-600">
                    {totals.total > 0 ? ((row.count / totals.total) * 100).toFixed(1) : '0'}%
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50/50 font-medium">
                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-900">Total</td>
                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-900">
                  {totals.total}
                </td>
                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-900">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{count}</span>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
