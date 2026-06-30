'use client';

import { DollarSign, TrendingUp, CreditCard, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import type { BookingFinancialSummary } from '../types';

interface BookingFinancialSummaryProps {
  summary: BookingFinancialSummary;
  bookingId: string;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-green-100 text-green-700',
  REFUNDED: 'bg-purple-100 text-purple-700',
  FAILED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-700',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completado',
  REFUNDED: 'Reembolsado',
  FAILED: 'Fallido',
  CANCELLED: 'Cancelado',
};

export function BookingFinancialSummary({ summary, bookingId }: BookingFinancialSummaryProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900">Historial financiero</h2>
        </div>
        <Link
          href={`/dashboard/pagos/nuevo?bookingId=${bookingId}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
        >
          <CreditCard className="h-3.5 w-3.5" />
          Registrar pago
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-bold text-gray-900">${summary.totalAmount.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-green-50 p-3">
          <p className="text-xs text-green-600">Pagado</p>
          <p className="text-lg font-bold text-green-700">${summary.paidAmount.toFixed(2)}</p>
        </div>
        <div className={`rounded-lg p-3 ${summary.isFullyPaid ? 'bg-green-50' : 'bg-orange-50'}`}>
          <p className={`text-xs ${summary.isFullyPaid ? 'text-green-600' : 'text-orange-600'}`}>
            {summary.isFullyPaid ? 'Pagado' : 'Pendiente'}
          </p>
          <p
            className={`text-lg font-bold ${summary.isFullyPaid ? 'text-green-700' : 'text-orange-700'}`}
          >
            ${summary.pendingAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {summary.isFullyPaid && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          <TrendingUp className="h-4 w-4" />
          Reserva completamente pagada
        </div>
      )}

      <div className="space-y-2">
        {summary.payments.length === 0 ? (
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-3 text-sm text-gray-500">
            <AlertCircle className="h-4 w-4" />
            No hay pagos registrados para esta reserva
          </div>
        ) : (
          summary.payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">${payment.amount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">
                    {payment.paymentMethod.name}
                    {payment.referenceNumber && ` · ${payment.referenceNumber}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[payment.status] ?? 'bg-gray-100 text-gray-700'}`}
                >
                  {statusLabels[payment.status] ?? payment.status}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(payment.transactionDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {summary.payments.length > 0 && (
        <div className="mt-3 text-right">
          <Link
            href={`/dashboard/pagos?bookingId=${bookingId}`}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Ver todos los pagos
          </Link>
        </div>
      )}
    </div>
  );
}
