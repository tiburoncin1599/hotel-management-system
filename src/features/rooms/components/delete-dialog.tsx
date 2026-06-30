'use client';

import { useActionState, useEffect } from 'react';
import { deleteRoomAction } from '../actions';
import { AlertTriangle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-all duration-200"
    >
      {pending ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}

interface DeleteDialogProps {
  roomId: string | null;
  onClose: () => void;
}

export function DeleteRoomDialog({ roomId, onClose }: DeleteDialogProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(deleteRoomAction, {
    success: false,
    message: '',
  });

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  if (!roomId) return null;

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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Eliminar habitación</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-all duration-200"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          ¿Estás seguro de eliminar esta habitación? Esta acción no se puede deshacer.
        </p>

        {state.message && (
          <p className={`mt-3 text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}

        <form action={formAction} className="mt-6 flex justify-end gap-3">
          <input type="hidden" name="id" value={roomId} />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            Cancelar
          </button>
          <DeleteButton />
        </form>
      </div>
    </div>
  );
}
