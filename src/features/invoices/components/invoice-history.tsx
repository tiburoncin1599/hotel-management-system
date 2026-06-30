'use client';

import Link from 'next/link';
import { FileText, Download, AlertCircle } from 'lucide-react';
import type { InvoiceWithRelations } from '../types';

interface InvoiceHistoryProps {
  invoice: InvoiceWithRelations | null;
  bookingId: string;
  canGenerate: boolean;
  reason?: string | null;
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  ISSUED: 'bg-blue-100 text-blue-700',
  PAID: 'bg-green-100 text-green-700',
  PARTIALLY_PAID: 'bg-yellow-100 text-yellow-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-purple-100 text-purple-700',
};

const statusLabels: Record<string, string> = {
  DRAFT: 'Borrador',
  ISSUED: 'Emitida',
  PAID: 'Pagada',
  PARTIALLY_PAID: 'Pago parcial',
  CANCELLED: 'Anulada',
  REFUNDED: 'Reembolsada',
};

export function InvoiceHistory({ invoice, bookingId, canGenerate, reason }: InvoiceHistoryProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900">Facturación</h2>
        </div>
        {canGenerate && (
          <Link
            href={`/dashboard/facturas?generate=${bookingId}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            <FileText className="h-3.5 w-3.5" />
            Generar factura
          </Link>
        )}
      </div>

      {!invoice ? (
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-3 text-sm text-gray-500">
          <AlertCircle className="h-4 w-4" />
          {canGenerate
            ? 'Esta reserva está lista para facturar'
            : 'Aún no se ha generado una factura'}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</p>
                <p className="text-xs text-gray-500">
                  Emitida {new Date(invoice.issueDate).toLocaleDateString('es-MX')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[invoice.status] ?? 'bg-gray-100 text-gray-700'}`}
              >
                {statusLabels[invoice.status] ?? invoice.status}
              </span>
              <Link
                href={`/dashboard/facturas/${invoice.id}/pdf`}
                className="rounded-md p-1.5 text-gray-400 hover:bg-gray-200 hover:text-blue-600"
                aria-label="Descargar PDF"
              >
                <Download className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {reason && (
            <div className="text-xs text-gray-500 px-3">Motivo de anulación: {reason}</div>
          )}
        </div>
      )}
    </div>
  );
}
