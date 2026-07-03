'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createRoomAction, updateRoomAction } from '../actions';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import type { RoomWithRelations } from '../types';

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

interface RoomFormProps {
  statuses: { id: string; code: string; name: string }[];
  types: { id: string; name: string }[];
  room?: RoomWithRelations;
}

export function RoomForm({ statuses, types, room }: RoomFormProps) {
  const isEditing = !!room;
  const action = isEditing ? updateRoomAction : createRoomAction;
  const [state, formAction] = useActionState(action, { success: false, message: '' });

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-slide-up">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/habitaciones"
          className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Volver"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Editar habitación' : 'Nueva habitación'}
          </h1>
          <p className="text-sm text-gray-500">
            {isEditing
              ? `Editando habitación #${room.roomNumber}`
              : 'Registrar una nueva habitación en el sistema'}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <form action={formAction} className="space-y-5">
          {isEditing && <input type="hidden" name="id" value={room.id} />}

          <div>
            <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">
              Número de habitación
            </label>
            <input
              id="roomNumber"
              name="roomNumber"
              type="text"
              defaultValue={room?.roomNumber ?? ''}
              required
              placeholder="Ej: 101"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
              Piso
            </label>
            <input
              id="floor"
              name="floor"
              type="number"
              min={0}
              defaultValue={room?.floor ?? ''}
              placeholder="Ej: 1"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label htmlFor="roomTypeId" className="block text-sm font-medium text-gray-700">
              Tipo de habitación
            </label>
            <select
              id="roomTypeId"
              name="roomTypeId"
              required
              defaultValue={room?.roomTypeId ?? ''}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Seleccionar tipo</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="statusId" className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              id="statusId"
              name="statusId"
              required
              defaultValue={room?.statusId ?? ''}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Seleccionar estado</option>
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {room && (
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-700">Información del tipo</h3>
              <div className="mt-2 grid grid-cols-2 gap-3 text-sm text-gray-600">
                <div>
                  <span className="text-gray-400">Precio base:</span> $
                  {Number(room.roomType.basePricePerNight).toFixed(2)}
                </div>
                <div>
                  <span className="text-gray-400">Capacidad:</span> {room.roomType.maxOccupancy}{' '}
                  personas
                </div>
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
              href="/dashboard/habitaciones"
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <SubmitButton label={isEditing ? 'Actualizar' : 'Crear habitación'} />
          </div>
        </form>
      </div>
    </div>
  );
}
