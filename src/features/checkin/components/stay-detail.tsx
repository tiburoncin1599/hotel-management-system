import Link from 'next/link';
import { ArrowLeft, Calendar, DollarSign, Clock, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import type { StayDetail } from '../types';

interface StayDetailProps {
  detail: StayDetail;
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

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function StayDetailPage({ detail }: StayDetailProps) {
  const { booking, checkIn, checkOut } = detail;
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    checked_in: 'bg-green-100 text-green-700',
    checked_out: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-slide-up">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/check"
          className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
          aria-label="Volver a check-in"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Estadía - {booking.customer.firstName} {booking.customer.lastName}
          </h1>
          <p className="text-sm text-gray-500">
            Hab #{booking.room.roomNumber} — {booking.room.roomType.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Línea de tiempo</h2>
            <div className="mt-4 space-y-0">
              <div className="relative pb-8">
                <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200" />

                <div className="relative flex gap-4 pb-8">
                  <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-medium text-gray-900">Reserva creada</p>
                    <p className="text-xs text-gray-500">{formatDateTime(booking.createdAt)}</p>
                  </div>
                </div>

                <div className="relative flex gap-4 pb-8">
                  <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <LogIn className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-medium text-gray-900">Check-In</p>
                    {checkIn ? (
                      <>
                        <p className="text-xs text-gray-500">
                          {formatDateTime(checkIn.checkInDateTime)}
                        </p>
                        <p className="text-xs text-gray-400">
                          por {checkIn.employee.firstName} {checkIn.employee.lastName}
                          {checkIn.idCardVerified ? ' — ID verificado' : ' — ID no verificado'}
                        </p>
                        {checkIn.notes && (
                          <p className="mt-1 text-xs text-gray-500">{checkIn.notes}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-yellow-600">Pendiente</p>
                    )}
                  </div>
                </div>

                <div className="relative flex gap-4">
                  <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <LogOut className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-medium text-gray-900">Check-Out</p>
                    {checkOut ? (
                      <>
                        <p className="text-xs text-gray-500">
                          {formatDateTime(checkOut.checkOutDateTime)}
                        </p>
                        <p className="text-xs text-gray-400">
                          por {checkOut.employee.firstName} {checkOut.employee.lastName}
                        </p>
                        {checkOut.notes && (
                          <p className="mt-1 text-xs text-gray-500">{checkOut.notes}</p>
                        )}
                        {checkOut.damageCharges && Number(checkOut.damageCharges) > 0 && (
                          <p className="mt-1 text-xs text-red-500">
                            Cargos por daños: ${Number(checkOut.damageCharges).toFixed(2)}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-yellow-600">Pendiente</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Información de la reserva</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-gray-500">Cliente</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">
                  {booking.customer.firstName} {booking.customer.lastName}
                </dd>
                {booking.customer.email && (
                  <dd className="text-xs text-gray-500">{booking.customer.email}</dd>
                )}
              </div>
              <div>
                <dt className="text-xs text-gray-500">Habitación</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">
                  #{booking.room.roomNumber}
                </dd>
                <dd className="text-xs text-gray-400">{booking.room.roomType.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Fecha de entrada</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(booking.checkInDate)}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Fecha de salida</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(booking.checkOutDate)}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Noches planificadas</dt>
                <dd className="mt-1 text-sm text-gray-900">{detail.nights}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Huéspedes</dt>
                <dd className="mt-1 text-sm text-gray-900">{booking.numberOfGuests}</dd>
              </div>
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
            </dl>
            {booking.specialRequests && (
              <div className="mt-4 rounded-lg bg-gray-50 p-3">
                <dt className="text-xs text-gray-500">Observaciones de la reserva</dt>
                <dd className="mt-1 text-sm text-gray-900">{booking.specialRequests}</dd>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Resumen financiero</h2>
            <div className="mt-4 space-y-3">
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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Noches reales</p>
                  <p className="text-sm font-medium text-gray-900">{detail.actualNights}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">${detail.subtotal.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pagado</p>
                  <p className="text-sm font-medium text-gray-900">
                    ${detail.paidAmount.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="border-t pt-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pendiente</p>
                  <p className="text-base font-bold text-red-600">
                    ${detail.pendingAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">Módulo de pagos próximamente</p>
                </div>
              </div>
            </div>
          </div>

          {checkIn && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <h2 className="text-base font-semibold text-gray-900">Check-In</h2>
              </div>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Fecha</span>
                  <span className="font-medium text-gray-900">
                    {formatDateTime(checkIn.checkInDateTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Empleado</span>
                  <span className="font-medium text-gray-900">
                    {checkIn.employee.firstName} {checkIn.employee.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ID verificado</span>
                  <span
                    className={`font-medium ${checkIn.idCardVerified ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {checkIn.idCardVerified ? 'Sí' : 'No'}
                  </span>
                </div>
              </dl>
            </div>
          )}

          {checkOut && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <LogOut className="h-5 w-5 text-blue-500" />
                <h2 className="text-base font-semibold text-gray-900">Check-Out</h2>
              </div>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Fecha</span>
                  <span className="font-medium text-gray-900">
                    {formatDateTime(checkOut.checkOutDateTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Empleado</span>
                  <span className="font-medium text-gray-900">
                    {checkOut.employee.firstName} {checkOut.employee.lastName}
                  </span>
                </div>
                {checkOut.damageCharges && Number(checkOut.damageCharges) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Daños</span>
                    <span className="font-medium text-red-600">
                      ${Number(checkOut.damageCharges).toFixed(2)}
                    </span>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
