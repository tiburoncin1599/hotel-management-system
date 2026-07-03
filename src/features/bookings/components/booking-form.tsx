'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createBookingAction, updateBookingAction } from '../actions';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import type { BookingWithRelations, RoomWithDetails } from '../types';
import type { Customer } from '@/generated/prisma/client';

const sourceOptions = [
  { value: 'DIRECT', label: 'Directa' },
  { value: 'BOOKING_COM', label: 'Booking.com' },
  { value: 'EXPEDIA', label: 'Expedia' },
  { value: 'AIRBNB', label: 'Airbnb' },
  { value: 'PHONE', label: 'Teléfono' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'OTHER', label: 'Otro' },
];

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

interface BookingFormProps {
  customers: Customer[];
  rooms: RoomWithDetails[];
  booking?: BookingWithRelations;
}

export function BookingForm({ customers, rooms, booking }: BookingFormProps) {
  const isEditing = !!booking;
  const action = isEditing ? updateBookingAction : createBookingAction;
  const [state, formAction] = useActionState(action, { success: false, message: '' });

  const [selectedRoomId, setSelectedRoomId] = useState(booking?.roomId ?? '');
  const [checkIn, setCheckIn] = useState(
    booking ? new Date(booking.checkInDate).toISOString().split('T')[0] : '',
  );
  const [checkOut, setCheckOut] = useState(
    booking ? new Date(booking.checkOutDate).toISOString().split('T')[0] : '',
  );

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  function computePreview() {
    if (!selectedRoom || !checkIn || !checkOut) return null;
    const ci = new Date(checkIn);
    const co = new Date(checkOut);
    if (co <= ci) return null;
    const diff = co.getTime() - ci.getTime();
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const pricePerNight = Number(selectedRoom.roomType?.basePricePerNight ?? 0);
    const subtotal = nights * pricePerNight;
    return { nights, pricePerNight, subtotal, total: subtotal };
  }

  const preview = computePreview();

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-slide-up">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/reservas"
          className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Volver"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Editar reserva' : 'Nueva reserva'}
          </h1>
          <p className="text-sm text-gray-500">
            {isEditing
              ? `Editando reserva de ${booking.customer.firstName} ${booking.customer.lastName}`
              : 'Registrar una nueva reserva en el sistema'}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <form action={formAction} className="space-y-5">
          {isEditing && <input type="hidden" name="id" value={booking.id} />}

          <div>
            <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
              Cliente
            </label>
            <select
              id="customerId"
              name="customerId"
              required
              defaultValue={booking?.customerId ?? ''}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Seleccionar cliente</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} {c.email ? `(${c.email})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
              Habitación
            </label>
            <select
              id="roomId"
              name="roomId"
              required
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Seleccionar habitación</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  #{r.roomNumber} - {r.roomType?.name ?? '—'}
                </option>
              ))}
            </select>
            {selectedRoom && (
              <p className="mt-1 text-xs text-gray-500">
                Capacidad máxima: {selectedRoom.roomType?.maxOccupancy ?? '—'} personas
                {' | '}
                Precio por noche: $
                {Number(selectedRoom.roomType?.basePricePerNight ?? 0).toFixed(2)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700">
                Fecha de entrada
              </label>
              <input
                id="checkInDate"
                name="checkInDate"
                type="date"
                required
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700">
                Fecha de salida
              </label>
              <input
                id="checkOutDate"
                name="checkOutDate"
                type="date"
                required
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="numberOfGuests" className="block text-sm font-medium text-gray-700">
                Número de huéspedes
              </label>
              <input
                id="numberOfGuests"
                name="numberOfGuests"
                type="number"
                required
                min={1}
                max={selectedRoom ? (selectedRoom.roomType?.maxOccupancy ?? 99) : 99}
                defaultValue={booking?.numberOfGuests ?? 1}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                Origen
              </label>
              <select
                id="source"
                name="source"
                defaultValue={booking?.source ?? 'DIRECT'}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              >
                {sourceOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">
              Observaciones
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              rows={3}
              defaultValue={booking?.specialRequests ?? ''}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Solicitudes especiales, observaciones..."
            />
          </div>

          {preview && (
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-700">Resumen de precios</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Noches</span>
                  <span className="font-medium">{preview.nights}</span>
                </div>
                <div className="flex justify-between">
                  <span>Precio por noche</span>
                  <span className="font-medium">${preview.pricePerNight.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">${preview.subtotal.toFixed(2)}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-medium text-gray-900">
                  <span>Total estimado</span>
                  <span>${preview.total.toFixed(2)}</span>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  * Los descuentos por promociones se aplicarán automáticamente al guardar.
                </p>
              </div>
            </div>
          )}

          {state.message && (
            <p
              className={`rounded-lg p-3 text-sm ${
                state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {state.message}
            </p>
          )}

          <div className="flex items-center justify-end gap-3">
            <Link
              href="/dashboard/reservas"
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <SubmitButton label={isEditing ? 'Actualizar' : 'Crear reserva'} />
          </div>
        </form>
      </div>
    </div>
  );
}
