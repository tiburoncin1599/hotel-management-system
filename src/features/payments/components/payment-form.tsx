'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createPaymentAction, updatePaymentAction } from '../actions';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import type { PaymentDetailData } from '../types';

interface BookingOption {
  id: string;
  customer: { firstName: string; lastName: string };
  room: { roomNumber: string };
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
    >
      <Save className="h-4 w-4" />
      {pending ? 'Guardando...' : label}
    </button>
  );
}

interface PaymentFormProps {
  paymentMethods: { id: string; code: string; name: string }[];
  currencies: { id: string; code: string; name: string; symbol: string }[];
  bookings?: BookingOption[];
  payment?: PaymentDetailData;
  defaultBookingId?: string;
}

export function PaymentForm({
  paymentMethods,
  currencies,
  bookings,
  payment,
  defaultBookingId,
}: PaymentFormProps) {
  const isEditing = !!payment;
  const action = isEditing ? updatePaymentAction : createPaymentAction;
  const [state, formAction] = useActionState(action, { success: false, message: '' });

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-slide-up">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/pagos"
          className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Volver"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Editar pago' : 'Nuevo pago'}
          </h1>
          <p className="text-sm text-gray-500">
            {isEditing
              ? `Editando pago #${payment.referenceNumber ?? payment.id.slice(0, 8)}`
              : 'Registrar un nuevo pago en el sistema'}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <form action={formAction} className="space-y-5">
          {isEditing && <input type="hidden" name="id" value={payment.id} />}

          <div>
            <label htmlFor="bookingId" className="block text-sm font-medium text-gray-700">
              Reserva
            </label>
            {defaultBookingId ? (
              <>
                <input type="hidden" name="bookingId" value={defaultBookingId} />
                <p className="mt-1 text-sm text-gray-500">
                  {bookings?.find((b) => b.id === defaultBookingId)?.customer.firstName}{' '}
                  {bookings?.find((b) => b.id === defaultBookingId)?.customer.lastName} - Hab.{' '}
                  {bookings?.find((b) => b.id === defaultBookingId)?.room.roomNumber}
                </p>
              </>
            ) : (
              <select
                id="bookingId"
                name="bookingId"
                required
                defaultValue={payment?.booking.id ?? ''}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Seleccionar reserva</option>
                {bookings?.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.customer.firstName} {b.customer.lastName} - Hab. {b.room.roomNumber}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="paymentMethodId" className="block text-sm font-medium text-gray-700">
                Método de pago
              </label>
              <select
                id="paymentMethodId"
                name="paymentMethodId"
                required
                defaultValue={payment?.paymentMethod.id ?? ''}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Seleccionar método</option>
                {paymentMethods.map((pm) => (
                  <option key={pm.id} value={pm.id}>
                    {pm.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="currencyId" className="block text-sm font-medium text-gray-700">
                Moneda <span className="text-gray-400">(opcional)</span>
              </label>
              <select
                id="currencyId"
                name="currencyId"
                defaultValue={payment?.currency?.id ?? ''}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Moneda por defecto</option>
                {currencies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Monto
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                max="9999999.99"
                required
                defaultValue={payment ? Number(payment.amount).toFixed(2) : ''}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700">
                Fecha de transacción
              </label>
              <input
                id="transactionDate"
                name="transactionDate"
                type="date"
                required
                defaultValue={
                  payment
                    ? new Date(payment.transactionDate).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0]
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="referenceNumber" className="block text-sm font-medium text-gray-700">
              Número de referencia <span className="text-gray-400">(opcional)</span>
            </label>
            <input
              id="referenceNumber"
              name="referenceNumber"
              type="text"
              maxLength={100}
              defaultValue={payment?.referenceNumber ?? ''}
              placeholder="Ej: TRANS-001, Recibo #123..."
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notas <span className="text-gray-400">(opcional)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              maxLength={500}
              defaultValue={payment?.notes ?? ''}
              placeholder="Notas adicionales sobre el pago..."
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {state.message && (
            <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
              {state.message}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <Link
              href="/dashboard/pagos"
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <SubmitButton label={isEditing ? 'Actualizar pago' : 'Crear pago'} />
          </div>
        </form>
      </div>
    </div>
  );
}
