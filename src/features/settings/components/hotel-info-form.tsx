'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateHotelInfoAction } from '../actions';
import { Save } from 'lucide-react';
import type { HotelInfo } from '../types';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'MXN', name: 'Mexican Peso' },
  { code: 'COP', name: 'Colombian Peso' },
  { code: 'ARS', name: 'Argentine Peso' },
  { code: 'BRL', name: 'Brazilian Real' },
  { code: 'PEN', name: 'Peruvian Sol' },
  { code: 'CLP', name: 'Chilean Peso' },
];

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Mexico_City',
  'America/Bogota',
  'America/Sao_Paulo',
  'America/Argentina/Buenos_Aires',
  'America/Lima',
  'America/Santiago',
  'Europe/London',
  'Europe/Madrid',
  'Europe/Paris',
  'Europe/Berlin',
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
    >
      <Save className="h-4 w-4" />
      {pending ? 'Guardando...' : 'Guardar cambios'}
    </button>
  );
}

interface HotelInfoFormProps {
  hotelInfo: HotelInfo;
}

export function HotelInfoForm({ hotelInfo }: HotelInfoFormProps) {
  const [state, formAction] = useActionState(updateHotelInfoAction, {
    success: false,
    message: '',
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <form action={formAction} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre del hotel
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={hotelInfo.name}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
              URL del logo
            </label>
            <input
              id="logo"
              name="logo"
              type="text"
              defaultValue={hotelInfo.logo}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Dirección
          </label>
          <textarea
            id="address"
            name="address"
            rows={2}
            defaultValue={hotelInfo.address}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              defaultValue={hotelInfo.phone}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={hotelInfo.email}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Sitio web
            </label>
            <input
              id="website"
              name="website"
              type="text"
              defaultValue={hotelInfo.website}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
              Moneda
            </label>
            <select
              id="currency"
              name="currency"
              required
              defaultValue={hotelInfo.currency}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
            Zona horaria
          </label>
          <select
            id="timezone"
            name="timezone"
            required
            defaultValue={hotelInfo.timezone}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>

        {state.message && (
          <p
            className={`rounded-lg p-3 text-sm ${
              state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {state.message}
          </p>
        )}

        <div className="flex items-center justify-end">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
