'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Ban,
  Download,
  Printer,
  FileText,
  Building,
  User,
  Hash,
  Calendar,
  DollarSign,
} from 'lucide-react';
import type { InvoiceWithRelations } from '../types';

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

const lineTypeLabels: Record<string, string> = {
  room: 'Hospedaje',
  service: 'Servicios',
  discount: 'Descuentos',
  tax: 'Impuestos',
};

const lineTypeColors: Record<string, string> = {
  room: 'bg-blue-50 text-blue-700',
  service: 'bg-purple-50 text-purple-700',
  discount: 'bg-green-50 text-green-700',
  tax: 'bg-orange-50 text-orange-700',
};

interface InvoiceDetailProps {
  invoice: InvoiceWithRelations;
}

export function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  const canCancel = invoice.status !== 'CANCELLED' && invoice.status !== 'REFUNDED';

  const totals = invoice.details.reduce(
    (acc, d) => {
      const amount = Number(d.totalAmount.toString());
      if (d.lineType === 'room') acc.room += amount;
      else if (d.lineType === 'service') acc.services += amount;
      else if (d.lineType === 'discount') acc.discounts += Math.abs(amount);
      else if (d.lineType === 'tax') acc.taxes += amount;
      return acc;
    },
    { room: 0, services: 0, discounts: 0, taxes: 0 },
  );

  return (
    <div className="mx-auto max-w-4xl animate-slide-up space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/facturas"
            className="rounded-md p-2 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Volver a facturas"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-900">
                Factura {invoice.invoiceNumber}
              </h1>
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[invoice.status] ?? 'bg-gray-100 text-gray-700'}`}
              >
                {statusLabels[invoice.status] ?? invoice.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Emitida el {new Date(invoice.issueDate).toLocaleDateString('es-MX')}
              {invoice.dueDate &&
                ` — Vence ${new Date(invoice.dueDate).toLocaleDateString('es-MX')}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/facturas/${invoice.id}/pdf`}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            PDF
          </Link>
          <Link
            href={`/dashboard/facturas/${invoice.id}/pdf?print=1`}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50"
          >
            <Printer className="h-4 w-4" />
            Imprimir
          </Link>
          {canCancel && (
            <Link
              href={`/dashboard/facturas/${invoice.id}?cancel=1`}
              className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition-all duration-200 hover:bg-red-50"
            >
              <Ban className="h-4 w-4" />
              Anular
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">Detalle de la factura</h2>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-4 border-b border-gray-100 pb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                <div className="col-span-5">Concepto</div>
                <div className="col-span-2 text-center">Cant.</div>
                <div className="col-span-2 text-right">P. Unitario</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              {invoice.details.map((detail) => (
                <div key={detail.id} className="grid grid-cols-12 gap-4 py-2">
                  <div className="col-span-5">
                    <p className="text-sm font-medium text-gray-900">{detail.description}</p>
                    <span
                      className={`inline-block mt-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${lineTypeColors[detail.lineType] ?? 'bg-gray-100 text-gray-700'}`}
                    >
                      {lineTypeLabels[detail.lineType] ?? detail.lineType}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-center text-sm text-gray-600">
                    {detail.quantity}
                  </div>
                  <div className="col-span-2 flex items-center justify-end text-sm text-gray-600">
                    {invoice.currency ? invoice.currency.symbol : '$'}
                    {Number(detail.unitPrice).toFixed(2)}
                  </div>
                  <div className="col-span-3 flex items-center justify-end text-sm font-medium text-gray-900">
                    {invoice.currency ? invoice.currency.symbol : '$'}
                    {Number(detail.totalAmount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Reserva asociada</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Building className="mt-0.5 h-4 w-4 text-gray-400" />
                <div>
                  <dt className="text-xs text-gray-500">Habitación</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    #{invoice.booking.room.roomNumber} — {invoice.booking.room.roomType.name}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-gray-400" />
                <div>
                  <dt className="text-xs text-gray-500">Estadía</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {new Date(invoice.booking.checkInDate).toLocaleDateString()} —{' '}
                    {new Date(invoice.booking.checkOutDate).toLocaleDateString()}
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Cliente</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {invoice.customer.firstName} {invoice.customer.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{invoice.customer.email}</p>
                </div>
              </div>
              {(invoice.customerDocAtIssue || invoice.customer.documentNumber) && (
                <div className="flex items-center gap-3">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Documento</p>
                    <p className="text-sm font-medium text-gray-900">
                      {invoice.customerDocAtIssue ?? invoice.customer.documentNumber}
                    </p>
                  </div>
                </div>
              )}
              {invoice.customer.address && (
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Dirección</p>
                    <p className="text-sm font-medium text-gray-900">{invoice.customer.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">Totales</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Hospedaje</span>
                <span className="font-medium text-gray-900">${totals.room.toFixed(2)}</span>
              </div>
              {totals.services > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Servicios</span>
                  <span className="font-medium text-gray-900">${totals.services.toFixed(2)}</span>
                </div>
              )}
              {totals.discounts > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Descuentos</span>
                  <span className="font-medium text-green-600">
                    -${totals.discounts.toFixed(2)}
                  </span>
                </div>
              )}
              {totals.taxes > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-orange-600">Impuestos</span>
                  <span className="font-medium text-orange-600">${totals.taxes.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-3">
                <span className="text-base font-semibold text-gray-900">Total</span>
                <span className="text-base font-bold text-gray-900">
                  {invoice.currency ? invoice.currency.symbol : '$'}
                  {Number(invoice.totalAmount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">Notas</h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Cancel dialog inline */}
    </div>
  );
}
