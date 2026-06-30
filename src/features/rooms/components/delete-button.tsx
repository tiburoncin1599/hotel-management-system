'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { DeleteRoomDialog } from './delete-dialog';

interface DeleteButtonProps {
  roomId: string;
}

export function DeleteRoomButton({ roomId }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
        Eliminar
      </button>
      <DeleteRoomDialog roomId={open ? roomId : null} onClose={() => setOpen(false)} />
    </>
  );
}
