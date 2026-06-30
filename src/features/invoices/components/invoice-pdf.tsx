'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Printer } from 'lucide-react';
import type { InvoiceWithRelations } from '../types';
import { Hotel } from 'lucide-react';

interface InvoicePdfProps {
  invoice: InvoiceWithRelations;
}

export function InvoicePdf({ invoice }: InvoicePdfProps) {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('print') === '1') {
      setTimeout(() => window.print(), 500);
    }
  }, []);

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
    <div className="min-h-screen bg-gray-100 p-4 print:bg-white print:p-0">
      <div className="mx-auto max-w-[210mm]">
        <div className="mb-4 flex justify-center gap-4 print:hidden">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700"
          >
            <Printer className="h-4 w-4" />
            Imprimir / Guardar PDF
          </button>
          <button
            onClick={() => router.push(`/dashboard/facturas/${invoice.id}`)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50"
          >
            Volver
          </button>
        </div>

        <div
          ref={printRef}
          className="rounded-xl bg-white p-8 shadow-lg print:rounded-none print:shadow-none"
          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-300 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                  <Hotel className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Hotel Management</h1>
                  <p className="text-sm text-gray-500">Sistema de Gestión Hotelera</p>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                <p>RFC: HMG-123456-XYZ</p>
                <p>Av. Principal 123, Col. Centro</p>
                <p>Ciudad de México, CP 06600</p>
                <p>Tel: +52 55 1234 5678</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-900">FACTURA</h2>
              <p className="mt-1 text-sm font-medium text-blue-600">{invoice.invoiceNumber}</p>
              <p className="mt-1 text-xs text-gray-500">
                Fecha de emisión: {new Date(invoice.issueDate).toLocaleDateString('es-MX')}
              </p>
              {invoice.dueDate && (
                <p className="text-xs text-gray-500">
                  Fecha de vencimiento: {new Date(invoice.dueDate).toLocaleDateString('es-MX')}
                </p>
              )}
            </div>
          </div>

          {/* Customer */}
          <div className="mt-6">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              Datos del cliente
            </h3>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-900">
                {invoice.customer.firstName} {invoice.customer.lastName}
              </p>
              <p className="text-xs text-gray-600">{invoice.customer.email}</p>
              {(invoice.customerDocAtIssue ?? invoice.customer.documentNumber) && (
                <p className="text-xs text-gray-600">
                  Documento: {invoice.customerDocAtIssue ?? invoice.customer.documentNumber}
                </p>
              )}
              {invoice.customer.address && (
                <p className="text-xs text-gray-600">Dirección: {invoice.customer.address}</p>
              )}
            </div>
          </div>

          {/* Stay info */}
          <div className="mt-4">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              Información de la estadía
            </h3>
            <div className="grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4 text-sm">
              <div>
                <p className="text-xs text-gray-500">Habitación</p>
                <p className="font-medium text-gray-900">#{invoice.booking.room.roomNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tipo</p>
                <p className="font-medium text-gray-900">{invoice.booking.room.roomType.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Huéspedes</p>
                <p className="font-medium text-gray-900">{invoice.booking.numberOfGuests}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Check-In</p>
                <p className="font-medium text-gray-900">
                  {new Date(invoice.booking.checkInDate).toLocaleDateString('es-MX')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Check-Out</p>
                <p className="font-medium text-gray-900">
                  {new Date(invoice.booking.checkOutDate).toLocaleDateString('es-MX')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Noches</p>
                <p className="font-medium text-gray-900">
                  {Math.max(
                    1,
                    Math.ceil(
                      (new Date(invoice.booking.checkOutDate).getTime() -
                        new Date(invoice.booking.checkInDate).getTime()) /
                        (1000 * 60 * 60 * 24),
                    ),
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Detail table */}
          <div className="mt-6">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              Detalle de cargos
            </h3>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Concepto
                  </th>
                  <th className="pb-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                    Cant.
                  </th>
                  <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    P. Unitario
                  </th>
                  <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.details.map((detail, idx) => (
                  <tr
                    key={detail.id}
                    className={idx < invoice.details.length - 1 ? 'border-b border-gray-100' : ''}
                  >
                    <td className="py-2.5 text-gray-900">
                      <p className="font-medium">{detail.description}</p>
                      <p className="text-xs text-gray-400 capitalize">{detail.lineType}</p>
                    </td>
                    <td className="py-2.5 text-center text-gray-600">{detail.quantity}</td>
                    <td className="py-2.5 text-right text-gray-600">
                      $ {Number(detail.unitPrice).toFixed(2)}
                    </td>
                    <td className="py-2.5 text-right font-medium text-gray-900">
                      $ {Number(detail.totalAmount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">$ {Number(invoice.subtotal).toFixed(2)}</span>
              </div>
              {totals.discounts > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Descuentos</span>
                  <span className="text-green-600">-$ {totals.discounts.toFixed(2)}</span>
                </div>
              )}
              {totals.taxes > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-orange-600">Impuestos</span>
                  <span className="text-orange-600">$ {totals.taxes.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-300 pt-2 text-base font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">
                  {invoice.currency ? invoice.currency.symbol : '$'}{' '}
                  {Number(invoice.totalAmount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* QR and footer */}
          <div className="mt-8 flex items-end justify-between border-t border-gray-300 pt-6">
            <div>
              <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                <div className="text-center">
                  <div className="grid grid-cols-5 gap-0.5">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 w-1.5 rounded-sm ${i % 3 === 0 || i % 7 === 0 ? 'bg-gray-800' : 'bg-transparent'}`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-[6px] text-gray-400">QR</p>
                </div>
              </div>
              <p className="mt-1 text-[8px] text-gray-400">Código de verificación</p>
            </div>
            <div className="text-right text-xs text-gray-400">
              <p>Factura generada electrónicamente</p>
              <p>{invoice.invoiceNumber}</p>
              <p className="mt-1">Hotel Management System v1.0</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 border-t border-gray-200 pt-4 text-center text-xs text-gray-400">
            <p>
              Hotel Management System — Av. Principal 123, Col. Centro, Ciudad de México — RFC:
              HMG-123456-XYZ
            </p>
            <p className="mt-1">Tel: +52 55 1234 5678 | Email: facturacion@hotelms.com</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            margin: 0;
            padding: 0;
          }
          @page {
            margin: 15mm;
            size: A4;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:bg-white {
            background: white !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
