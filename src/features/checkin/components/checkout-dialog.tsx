'use client';

import { useActionState, useEffect, useState } from 'react';
import { checkOutGuestAction } from '../actions';
import { LogOut, X, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
    >
      <LogOut className="h-4 w-4" />
      {pending ? 'Procesando...' : 'Confirmar Check-Out'}
    </button>
  );
}

interface CheckOutDialogProps {
  bookingId: string | null;
  onClose: () => void;
}

export function CheckOutDialog({ bookingId, onClose }: CheckOutDialogProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(checkOutGuestAction, {
    success: false,
    message: '',
  });
  const [damageCharges, setDamageCharges] = useState('');

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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <LogOut className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Check-Out</h2>
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
          Confirma la salida del huésped y registra los cargos adicionales si los hay.
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

            <div>
              <label htmlFor="damageCharges" className="block text-sm font-medium text-gray-700">
                Cargos por daños <span className="text-gray-400">(opcional)</span>
              </label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="damageCharges"
                  name="damageCharges"
                  type="number"
                  min={0}
                  step={0.01}
                  value={damageCharges}
                  onChange={(e) => setDamageCharges(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 bg-white focus:border-blue-500 focus:outline-none"
                  placeholder="0.00"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Ingresa cualquier cargo adicional por daños en la habitación.
              </p>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Observaciones <span className="text-gray-400">(opcional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Notas sobre el check-out..."
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
