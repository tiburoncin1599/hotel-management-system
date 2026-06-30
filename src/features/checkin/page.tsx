import {
  getPendingCheckInsAction,
  getActiveGuestsAction,
  getReadyForCheckOutAction,
} from './actions';
import { CheckInOutPage } from './components/checkin-table';

export default async function CheckInPage() {
  const [pendingCheckIns, activeGuests, readyForCheckOut] = await Promise.all([
    getPendingCheckInsAction(),
    getActiveGuestsAction(),
    getReadyForCheckOutAction(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Check-In / Check-Out</h1>
        <p className="mt-1 text-sm text-gray-500">Gestiona la entrada y salida de huéspedes</p>
      </div>

      <CheckInOutPage
        pendingCheckIns={pendingCheckIns}
        activeGuests={activeGuests}
        readyForCheckOut={readyForCheckOut}
      />
    </div>
  );
}
