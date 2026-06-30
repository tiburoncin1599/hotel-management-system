'use client';

import { useState } from 'react';
import { XCircle } from 'lucide-react';
import { CancelBookingDialog } from './cancel-dialog';

interface CancelButtonProps {
  bookingId: string;
}

export function CancelBookingButton({ bookingId }: CancelButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        <XCircle className="h-4 w-4" />
        Cancelar
      </button>
      <CancelBookingDialog bookingId={open ? bookingId : null} onClose={() => setOpen(false)} />
    </>
  );
}
