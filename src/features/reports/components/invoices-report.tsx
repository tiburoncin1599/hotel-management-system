'use client';

import { FileText, CheckCircle, Clock, XCircle, Download } from 'lucide-react';
import { StatCard } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { ReportBarChart, ReportPieChart } from './report-charts';
import type { InvoicesReport } from '../types';

interface InvoicesReportProps {
  data?: InvoicesReport;
  loading?: boolean;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

export function InvoicesReportView({
  data,
  loading,
  onExportPDF,
  onExportExcel,
}: InvoicesReportProps) {
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
        icon={FileText}
        title="Selecciona un período"
        description="Usa los filtros para generar el reporte de facturas"
      />
    );
  }

  const {
    totalIssued,
    totalPaid,
    totalPending,
    totalCancelled,
    totalAmount,
    byStatus,
    dataPoints,
  } = data;

  if (totalAmount === 0 && totalIssued === 0 && totalPaid === 0) {
    return (
      <div className="space-y-4">
        <EmptyState
          icon={FileText}
          title="Sin facturas en este período"
          description="No se encontraron facturas para el período seleccionado"
        />
      </div>
    );
  }

  const fmt = (v: number) => `$${v.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total emitidas"
          value={totalIssued + totalPaid}
          icon={FileText}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatCard
          title="Pagadas"
          value={totalPaid}
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
        />
        <StatCard
          title="Pendientes"
          value={totalPending}
          icon={Clock}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-50"
        />
        <StatCard
          title="Canceladas"
          value={totalCancelled}
          icon={XCircle}
          iconColor="text-red-600"
          iconBgColor="bg-red-50"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ReportBarChart title="Facturas por período" data={dataPoints} loading={loading} />
        <ReportPieChart
          title="Distribución por estado"
          data={byStatus.map((s) => ({
            label:
              s.status === 'PAID'
                ? 'Pagadas'
                : s.status === 'ISSUED'
                  ? 'Emitidas'
                  : s.status === 'DRAFT'
                    ? 'Borrador'
                    : s.status === 'CANCELLED'
                      ? 'Canceladas'
                      : s.status === 'PARTIALLY_PAID'
                        ? 'Pago parcial'
                        : s.status === 'REFUNDED'
                          ? 'Reembolsadas'
                          : s.status,
            value: s.count,
          }))}
          loading={loading}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-900">Detalle de facturas por estado</h3>
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
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Porcentaje
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {byStatus.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                    No hay facturas registradas
                  </td>
                </tr>
              ) : (
                byStatus.map((s) => (
                  <tr key={s.status} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="whitespace-nowrap px-6 py-3 text-sm">
                      <Badge
                        variant={
                          s.status === 'PAID'
                            ? 'success'
                            : s.status === 'ISSUED'
                              ? 'info'
                              : s.status === 'DRAFT'
                                ? 'default'
                                : s.status === 'CANCELLED'
                                  ? 'danger'
                                  : s.status === 'PARTIALLY_PAID'
                                    ? 'warning'
                                    : 'default'
                        }
                      >
                        {s.status === 'PAID'
                          ? 'Pagada'
                          : s.status === 'ISSUED'
                            ? 'Emitida'
                            : s.status === 'DRAFT'
                              ? 'Borrador'
                              : s.status === 'CANCELLED'
                                ? 'Cancelada'
                                : s.status === 'PARTIALLY_PAID'
                                  ? 'Pago parcial'
                                  : s.status === 'REFUNDED'
                                    ? 'Reembolsada'
                                    : s.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-600">{s.count}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-right text-sm font-medium text-gray-900">
                      {fmt(s.total)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-right text-sm text-gray-600">
                      {totalAmount > 0 ? ((s.total / totalAmount) * 100).toFixed(1) : '0'}%
                    </td>
                  </tr>
                ))
              )}
              <tr className="bg-gray-50/50 font-medium">
                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-900">Total</td>
                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-900">
                  {byStatus.reduce((a, b) => a + b.count, 0)}
                </td>
                <td className="whitespace-nowrap px-6 py-3 text-right text-sm text-gray-900">
                  {fmt(totalAmount)}
                </td>
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
