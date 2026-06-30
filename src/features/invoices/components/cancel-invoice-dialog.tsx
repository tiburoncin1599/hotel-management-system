'use client';

import { useActionState, useEffect } from 'react';
import { cancelInvoiceAction } from '../actions';
import { AlertTriangle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';

function CancelButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-red-700 disabled:opacity-50"
    >
      {pending ? 'Anulando...' : 'Anular factura'}
    </button>
  );
}

interface CancelInvoiceDialogProps {
  invoiceId: string | null;
  onClose: () => void;
}

export function CancelInvoiceDialog({ invoiceId, onClose }: CancelInvoiceDialogProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(cancelInvoiceAction, {
    success: false,
    message: '',
  });

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  if (!invoiceId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-md animate-scale-in rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Anular factura</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 transition-all duration-200 hover:text-gray-600"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          ¿Estás seguro de anular esta factura? Esta acción no se puede deshacer.
        </p>

        {state.message && (
          <p className={`mt-3 text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}

        <form action={formAction} className="mt-4 space-y-4">
          <input type="hidden" name="id" value={invoiceId} />
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
              Motivo de anulación
            </label>
            <textarea
              id="reason"
              name="reason"
              rows={2}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Describa el motivo de la anulación..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50"
            >
              Volver
            </button>
            <CancelButton />
          </div>
        </form>
      </div>
    </div>
  );
}
