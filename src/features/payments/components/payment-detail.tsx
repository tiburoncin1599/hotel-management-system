'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Pencil,
  Ban,
  DollarSign,
  User,
  Building,
  CreditCard,
  Hash,
  Calendar,
  FileText,
  ClipboardList,
} from 'lucide-react';
import type { PaymentDetailData } from '../types';

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

interface PaymentDetailProps {
  payment: PaymentDetailData;
}

export function PaymentDetail({ payment }: PaymentDetailProps) {
  const canEdit = payment.status === 'PENDING' || payment.status === 'COMPLETED';
  const canCancel = payment.status !== 'CANCELLED' && payment.status !== 'REFUNDED';

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/pagos"
            className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-900">
                Pago {payment.referenceNumber ? `#${payment.referenceNumber}` : ''}
              </h1>
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[payment.status] ?? 'bg-gray-100 text-gray-700'}`}
              >
                {statusLabels[payment.status] ?? payment.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {new Date(payment.transactionDate).toLocaleDateString()} a las{' '}
              {new Date(payment.transactionDate).toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <Link
              href={`/dashboard/pagos/${payment.id}?edit=1`}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            >
              <Pencil className="h-4 w-4" />
              Editar
            </Link>
          )}
          {canCancel && (
            <Link
              href={`/dashboard/pagos/${payment.id}?cancel=1`}
              className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            >
              <Ban className="h-4 w-4" />
              Cancelar
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">Información del pago</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Monto</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {payment.currency ? payment.currency.symbol : '$'}
                    {Number(payment.amount).toFixed(2)}
                    {payment.currency && (
                      <span className="text-xs text-gray-400 ml-1">{payment.currency.code}</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Método de pago</p>
                  <p className="text-sm font-medium text-gray-900">{payment.paymentMethod.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <Hash className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Referencia</p>
                  <p className="text-sm font-medium text-gray-900">
                    {payment.referenceNumber ?? 'Sin referencia'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Fecha de transacción</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(payment.transactionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Procesado por</p>
                  <p className="text-sm font-medium text-gray-900">
                    {payment.processedBy?.firstName} {payment.processedBy?.lastName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {payment.notes && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <h2 className="text-base font-semibold text-gray-900">Notas</h2>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{payment.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Building className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">Reserva asociada</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Cliente</p>
                  <p className="text-sm font-medium text-gray-900">
                    {payment.booking.customer.firstName} {payment.booking.customer.lastName}
                  </p>
                  {payment.booking.customer.email && (
                    <p className="text-xs text-gray-400">{payment.booking.customer.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                  <Building className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Habitación</p>
                  <p className="text-sm font-medium text-gray-900">
                    {payment.booking.room.roomNumber} - {payment.booking.room.roomType.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <ClipboardList className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Estado de reserva</p>
                  <p className="text-sm font-medium text-gray-900">{payment.booking.status.name}</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Link
                href={`/dashboard/reservas/${payment.booking.id}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              >
                Ver detalle de reserva
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">Estadía</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Check-In</span>
                <span className="font-medium text-gray-900">
                  {new Date(payment.booking.checkInDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Check-Out</span>
                <span className="font-medium text-gray-900">
                  {new Date(payment.booking.checkOutDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Huéspedes</span>
                <span className="font-medium text-gray-900">{payment.booking.numberOfGuests}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
