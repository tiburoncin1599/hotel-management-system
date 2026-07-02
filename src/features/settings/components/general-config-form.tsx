'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateGeneralConfigAction } from '../actions';
import { Save } from 'lucide-react';
import type { GeneralConfig } from '../types';

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

const DATE_FORMATS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY' },
];

const TIME_FORMATS = [
  { value: 'HH:mm', label: '24 horas (HH:mm)' },
  { value: 'hh:mm A', label: '12 horas (hh:mm AM/PM)' },
  { value: 'HH:mm:ss', label: '24 horas con segundos' },
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

interface GeneralConfigFormProps {
  config: GeneralConfig;
}

export function GeneralConfigForm({ config }: GeneralConfigFormProps) {
  const [state, formAction] = useActionState(updateGeneralConfigAction, {
    success: false,
    message: '',
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <form action={formAction} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">
              Tasa de impuesto (%)
            </label>
            <input
              id="taxRate"
              name="taxRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              required
              defaultValue={config.taxRate}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label htmlFor="defaultCurrency" className="block text-sm font-medium text-gray-700">
              Moneda predeterminada
            </label>
            <select
              id="defaultCurrency"
              name="defaultCurrency"
              required
              defaultValue={config.defaultCurrency}
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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
              Formato de fecha
            </label>
            <select
              id="dateFormat"
              name="dateFormat"
              required
              defaultValue={config.dateFormat}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            >
              {DATE_FORMATS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700">
              Formato de hora
            </label>
            <select
              id="timeFormat"
              name="timeFormat"
              required
              defaultValue={config.timeFormat}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            >
              {TIME_FORMATS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
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
