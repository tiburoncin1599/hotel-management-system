'use client';

import { DollarSign, TrendingUp, Download, Ban, Clock } from 'lucide-react';
import { StatCard } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ReportLineChart, ReportPieChart } from './report-charts';
import type { RevenueReport } from '../types';

interface RevenueReportProps {
  data?: RevenueReport;
  loading?: boolean;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

export function RevenueReportView({
  data,
  loading,
  onExportPDF,
  onExportExcel,
}: RevenueReportProps) {
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
        icon={DollarSign}
        title="Selecciona un período"
        description="Usa los filtros para generar el reporte de ingresos"
      />
    );
  }

  const { totals, stats, dataPoints } = data;

  if (totals.totalCollected === 0 && totals.pending === 0) {
    return (
      <div className="space-y-4">
        <EmptyState
          icon={DollarSign}
          title="Sin ingresos en este período"
          description="No se encontraron ingresos para el período seleccionado"
        />
      </div>
    );
  }

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Ingresos totales"
          value={formatCurrency(totals.totalCollected)}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
        />
        <StatCard
          title="Promedio por reserva"
          value={formatCurrency(totals.averagePerBooking)}
          icon={TrendingUp}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatCard
          title="Pendiente de cobro"
          value={formatCurrency(totals.pending)}
          icon={Clock}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-50"
        />
        <StatCard
          title="Reembolsado"
          value={formatCurrency(totals.refunded)}
          icon={Ban}
          iconColor="text-red-600"
          iconBgColor="bg-red-50"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReportLineChart
            title="Tendencia de ingresos"
            data={dataPoints}
            loading={loading}
            formatter={(v) => `$${(v / 1000).toFixed(1)}k`}
          />
        </div>
        <ReportPieChart title="Por método de pago" data={stats.byMethod} loading={loading} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-900">Detalle de ingresos por período</h3>
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
                  Período
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ingresos
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {dataPoints.map((dp) => (
                <tr key={dp.label} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-900">{dp.label}</td>
                  <td className="whitespace-nowrap px-6 py-3 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(dp.value)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50/50 font-medium">
                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-900">Total</td>
                <td className="whitespace-nowrap px-6 py-3 text-right text-sm text-gray-900">
                  {formatCurrency(totals.totalCollected)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
