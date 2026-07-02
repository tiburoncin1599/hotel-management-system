'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { changePasswordAction } from '../actions';
import { Save, Shield, Monitor } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
    >
      <Save className="h-4 w-4" />
      {pending ? 'Cambiando...' : 'Cambiar contraseña'}
    </button>
  );
}

export function SecuritySection() {
  const [state, formAction] = useActionState(changePasswordAction, {
    success: false,
    message: '',
  });

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Cambiar contraseña</h3>
            <p className="text-sm text-gray-500">Actualiza tu contraseña de acceso al sistema</p>
          </div>
        </div>

        <form action={formAction} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              Contraseña actual
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              Nueva contraseña
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar nueva contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            />
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

          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <Monitor className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Sesiones activas</h3>
            <p className="text-sm text-gray-500">Dispositivos con acceso a tu cuenta</p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
          <p>La gestión de sesiones activas estará disponible próximamente.</p>
          <p className="mt-1 text-xs text-gray-400">
            Esta funcionalidad permite ver y cerrar sesiones en otros dispositivos.
          </p>
        </div>
      </div>
    </div>
  );
}
