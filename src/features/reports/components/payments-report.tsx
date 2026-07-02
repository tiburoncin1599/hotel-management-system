'use client';

import { DollarSign, CreditCard, Ban, Clock, Download } from 'lucide-react';
import { StatCard } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { ReportBarChart, ReportPieChart } from './report-charts';
import type { PaymentsReport } from '../types';

interface PaymentsReportProps {
  data?: PaymentsReport;
  loading?: boolean;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

export function PaymentsReportView({
  data,
  loading,
  onExportPDF,
  onExportExcel,
}: PaymentsReportProps) {
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
        icon={CreditCard}
        title="Selecciona un período"
        description="Usa los filtros para generar el reporte de pagos"
      />
    );
  }

  const { totalCollected, totalPending, totalRefunded, byMethod, byStatus, dataPoints } = data;

  if (totalCollected === 0 && totalPending === 0) {
    return (
      <div className="space-y-4">
        <EmptyState
          icon={CreditCard}
          title="Sin pagos en este período"
          description="No se encontraron pagos para el período seleccionado"
        />
      </div>
    );
  }

  const fmt = (v: number) => `$${v.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total cobrado"
          value={fmt(totalCollected)}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
        />
        <StatCard
          title="Pendiente"
          value={fmt(totalPending)}
          icon={Clock}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-50"
        />
        <StatCard
          title="Reembolsado"
          value={fmt(totalRefunded)}
          icon={Ban}
          iconColor="text-red-600"
          iconBgColor="bg-red-50"
        />
        <StatCard
          title="Métodos usados"
          value={byMethod.length}
          icon={CreditCard}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ReportBarChart
          title="Pagos por período"
          data={dataPoints}
          loading={loading}
          formatter={(v) => fmt(v)}
        />
        <ReportPieChart
          title="Por método de pago"
          data={byMethod.map((m) => ({ label: m.method, value: m.total }))}
          loading={loading}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-900">Detalle de pagos por método</h3>
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
                  Método
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Transacciones
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {byMethod.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-sm text-gray-500">
                    No hay pagos registrados
                  </td>
                </tr>
              ) : (
                byMethod.map((m) => (
                  <tr key={m.method} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
                      {m.method}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-600">{m.count}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-right text-sm font-medium text-gray-900">
                      {fmt(m.total)}
                    </td>
                  </tr>
                ))
              )}
              <tr className="bg-gray-50/50 font-medium">
                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-900">Total</td>
                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-900">
                  {byMethod.reduce((a, b) => a + b.count, 0)}
                </td>
                <td className="whitespace-nowrap px-6 py-3 text-right text-sm text-gray-900">
                  {fmt(totalCollected)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {byStatus.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-sm font-semibold text-gray-900">Distribución por estado</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Transacciones
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {byStatus.map((s) => (
                  <tr key={s.status} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="whitespace-nowrap px-6 py-3 text-sm">
                      <Badge
                        variant={
                          s.status === 'COMPLETED'
                            ? 'success'
                            : s.status === 'PENDING'
                              ? 'warning'
                              : s.status === 'REFUNDED'
                                ? 'danger'
                                : 'default'
                        }
                      >
                        {s.status === 'COMPLETED'
                          ? 'Completado'
                          : s.status === 'PENDING'
                            ? 'Pendiente'
                            : s.status === 'REFUNDED'
                              ? 'Reembolsado'
                              : s.status === 'FAILED'
                                ? 'Fallido'
                                : s.status === 'CANCELLED'
                                  ? 'Cancelado'
                                  : s.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-600">{s.count}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-right text-sm font-medium text-gray-900">
                      {fmt(s.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
