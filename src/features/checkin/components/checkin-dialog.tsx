'use client';

import { useActionState, useEffect } from 'react';
import { checkInGuestAction } from '../actions';
import { LogIn, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-all duration-200"
    >
      <LogIn className="h-4 w-4" />
      {pending ? 'Procesando...' : 'Confirmar Check-In'}
    </button>
  );
}

interface CheckInDialogProps {
  bookingId: string | null;
  onClose: () => void;
}

export function CheckInDialog({ bookingId, onClose }: CheckInDialogProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(checkInGuestAction, {
    success: false,
    message: '',
  });

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  if (!bookingId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <LogIn className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Check-In</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-all duration-200"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-2 text-sm text-gray-500">
          Confirma el ingreso del huésped y registra los detalles del check-in.
        </p>

        {state.message && (
          <p
            className={`mt-3 rounded-lg p-3 text-sm ${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
          >
            {state.message}
          </p>
        )}

        {!state.success && (
          <form action={formAction} className="mt-4 space-y-4">
            <input type="hidden" name="bookingId" value={bookingId} />

            <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                name="idCardVerified"
                defaultChecked
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">Identificación verificada</p>
                <p className="text-xs text-gray-500">Documento de identidad del huésped revisado</p>
              </div>
            </label>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Observaciones <span className="text-gray-400">(opcional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Notas sobre el check-in..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                Cancelar
              </button>
              <SubmitButton />
            </div>
          </form>
        )}

        {state.success && (
          <div className="mt-4">
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-all duration-200"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
