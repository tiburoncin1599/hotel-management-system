import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  User,
  BedDouble,
  DollarSign,
  Clock,
  FileText,
  Tag,
  Percent,
  Pencil,
  TrendingUp,
  AlertCircle,
  CreditCard,
} from 'lucide-react';
import type { BookingWithRelations, BookingDetailData } from '../types';
import type { BookingFinancialSummary } from '@/features/payments/types';
import type { InvoiceWithRelations } from '@/features/invoices/types';
import { InvoiceHistory } from '@/features/invoices/components/invoice-history';
import { CancelBookingButton } from './cancel-button';

const paymentStatusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-green-100 text-green-700',
  REFUNDED: 'bg-purple-100 text-purple-700',
  FAILED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-700',
};

const paymentStatusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completado',
  REFUNDED: 'Reembolsado',
  FAILED: 'Fallido',
  CANCELLED: 'Cancelado',
};

interface BookingDetailProps {
  booking: BookingWithRelations;
  detail: BookingDetailData;
  financialSummary?: BookingFinancialSummary;
  invoice?: InvoiceWithRelations | null;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  checked_in: 'bg-green-100 text-green-700',
  checked_out: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
  no_show: 'bg-orange-100 text-orange-700',
};

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function formatDateTime(date: Date | string) {
  return new Date(date).toLocaleString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function BookingDetail({ booking, detail, financialSummary, invoice }: BookingDetailProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/reservas"
            className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            aria-label="Volver a reservas"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Reserva #{booking.id.slice(0, 8)}
            </h1>
            <p className="text-sm text-gray-500">
              {booking.customer.firstName} {booking.customer.lastName} — Hab #
              {booking.room.roomNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/reservas/${booking.id}?edit=1`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Link>
          {booking.status.code !== 'cancelled' && <CancelBookingButton bookingId={booking.id} />}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Información de la reserva</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-gray-400" />
                <div>
                  <dt className="text-xs text-gray-500">Cliente</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {booking.customer.firstName} {booking.customer.lastName}
                  </dd>
                  {booking.customer.email && (
                    <dd className="text-xs text-gray-500">{booking.customer.email}</dd>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BedDouble className="mt-0.5 h-4 w-4 text-gray-400" />
                <div>
                  <dt className="text-xs text-gray-500">Habitación</dt>
                  <dd className="text-sm font-medium text-gray-900">#{booking.room.roomNumber}</dd>
                  <dd className="text-xs text-gray-500">
                    {booking.room.roomType.name} — Piso {booking.room.floor ?? '—'}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-gray-400" />
                <div>
                  <dt className="text-xs text-gray-500">Entrada</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {formatDate(booking.checkInDate)}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-gray-400" />
                <div>
                  <dt className="text-xs text-gray-500">Salida</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {formatDate(booking.checkOutDate)}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-gray-400" />
                <div>
                  <dt className="text-xs text-gray-500">Noches</dt>
                  <dd className="text-sm font-medium text-gray-900">{detail.nights}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-gray-400" />
                <div>
                  <dt className="text-xs text-gray-500">Huéspedes</dt>
                  <dd className="text-sm font-medium text-gray-900">{booking.numberOfGuests}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 text-gray-400" />
                <div>
                  <dt className="text-xs text-gray-500">Origen</dt>
                  <dd className="text-sm font-medium text-gray-900">{booking.source}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Tag className="mt-0.5 h-4 w-4 text-gray-400" />
                <div>
                  <dt className="text-xs text-gray-500">Estado</dt>
                  <dd className="mt-1">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        statusColors[booking.status.code] ?? 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {booking.status.name}
                    </span>
                  </dd>
                </div>
              </div>
            </dl>

            {booking.specialRequests && (
              <div className="mt-4 rounded-lg bg-gray-50 p-3">
                <dt className="text-xs text-gray-500">Observaciones</dt>
                <dd className="mt-1 text-sm text-gray-900">{booking.specialRequests}</dd>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Historial de estados</h2>
            <div className="mt-4 space-y-4">
              {booking.statusHistories.length === 0 ? (
                <p className="text-sm text-gray-500">Sin historial disponible</p>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200" />
                  {booking.statusHistories.map((history) => (
                    <div key={history.id} className="relative flex gap-4 pb-4">
                      <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <div className="h-2 w-2 rounded-full bg-blue-600" />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            {history.fromStatus ? history.fromStatus.name : '—'}
                          </span>
                          <span className="text-xs text-gray-400">→</span>
                          <span className="text-sm font-medium text-gray-900">
                            {history.toStatus.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatDateTime(history.changedAt)}
                          {history.changedBy && ` por ${history.changedBy.email}`}
                        </p>
                        {history.notes && (
                          <p className="mt-1 text-xs text-gray-600">{history.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Resumen financiero</h2>
              {financialSummary && (
                <Link
                  href={`/dashboard/pagos/nuevo?bookingId=${booking.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  Registrar pago
                </Link>
              )}
            </div>

            {financialSummary ? (
              <>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-lg font-bold text-gray-900">
                      ${financialSummary.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-3">
                    <p className="text-xs text-green-600">Pagado</p>
                    <p className="text-lg font-bold text-green-700">
                      ${financialSummary.paidAmount.toFixed(2)}
                    </p>
                  </div>
                  <div
                    className={`rounded-lg p-3 ${financialSummary.isFullyPaid ? 'bg-green-50' : 'bg-orange-50'}`}
                  >
                    <p
                      className={`text-xs ${financialSummary.isFullyPaid ? 'text-green-600' : 'text-orange-600'}`}
                    >
                      {financialSummary.isFullyPaid ? 'Pagado' : 'Pendiente'}
                    </p>
                    <p
                      className={`text-lg font-bold ${financialSummary.isFullyPaid ? 'text-green-700' : 'text-orange-700'}`}
                    >
                      ${financialSummary.pendingAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {financialSummary.isFullyPaid && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                    <TrendingUp className="h-4 w-4" />
                    Reserva completamente pagada
                  </div>
                )}

                <div className="space-y-2">
                  {financialSummary.payments.length === 0 ? (
                    <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-3 text-sm text-gray-500">
                      <AlertCircle className="h-4 w-4" />
                      No hay pagos registrados
                    </div>
                  ) : (
                    financialSummary.payments.map((payment) => (
                      <Link
                        key={payment.id}
                        href={`/dashboard/pagos/${payment.id}`}
                        className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 hover:bg-gray-100 transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-blue-500/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                            <DollarSign className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              ${payment.amount.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {payment.paymentMethod.name}
                              {payment.referenceNumber && ` · ${payment.referenceNumber}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${paymentStatusColors[payment.status] ?? 'bg-gray-100 text-gray-700'}`}
                          >
                            {paymentStatusLabels[payment.status] ?? payment.status}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(payment.transactionDate).toLocaleDateString()}
                          </span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Precio por noche</p>
                    <p className="text-sm font-medium text-gray-900">
                      ${detail.pricePerNight.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Noches</p>
                    <p className="text-sm font-medium text-gray-900">{detail.nights}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Subtotal</p>
                    <p className="text-sm font-medium text-gray-900">
                      ${detail.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
                {detail.discountAmount > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                      {booking.promotion?.discountType === 'PERCENTAGE' ? (
                        <Percent className="h-4 w-4" />
                      ) : (
                        <Tag className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        Descuento {detail.discountLabel ? `(${detail.discountLabel})` : ''}
                      </p>
                      <p className="text-sm font-medium text-green-600">
                        -${detail.discountAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
                <div className="border-t pt-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-base font-bold text-gray-900">${detail.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <InvoiceHistory
            invoice={invoice ?? null}
            bookingId={booking.id}
            canGenerate={
              !invoice &&
              booking.status.code === 'checked_out' &&
              (financialSummary?.isFullyPaid ?? false)
            }
          />
          {booking.promotion && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-blue-500" />
                <h2 className="text-base font-semibold text-gray-900">Promoción aplicada</h2>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900">{booking.promotion.name}</p>
              <p className="text-sm text-gray-500">
                {booking.promotion.discountType === 'PERCENTAGE'
                  ? `${Number(booking.promotion.discountValue)}% de descuento`
                  : `$${Number(booking.promotion.discountValue).toFixed(2)} de descuento`}
              </p>
              {booking.promotion.code && (
                <p className="text-xs text-gray-400 mt-1">Código: {booking.promotion.code}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
