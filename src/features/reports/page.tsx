import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth/helpers';
import { ReportFilters } from './components/report-filters';
import { BookingReportView } from './components/booking-report';
import { RevenueReportView } from './components/revenue-report';
import { OccupancyReportView } from './components/occupancy-report';
import { RoomsReportView } from './components/rooms-report';
import { CustomersReportView } from './components/customers-report';
import { PaymentsReportView } from './components/payments-report';
import { InvoicesReportView } from './components/invoices-report';
import {
  getBookingReportAction,
  getRevenueReportAction,
  getOccupancyReportAction,
  getRoomsReportAction,
  getCustomersReportAction,
  getPaymentsReportAction,
  getInvoicesReportAction,
} from './actions';
import type { ReportFilters as ReportFiltersType } from './types';

export const metadata: Metadata = {
  title: 'Reportes | Hotel Management System',
  description: 'Reportes y estadísticas del hotel',
};

interface Props {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function parseFilters(params: Record<string, string | string[] | undefined>): ReportFiltersType {
  const period =
    typeof params.period === 'string' ? (params.period as ReportFiltersType['period']) : 'monthly';
  const dateFrom = typeof params.dateFrom === 'string' ? params.dateFrom : undefined;
  const dateTo = typeof params.dateTo === 'string' ? params.dateTo : undefined;

  const isValidPeriod = ['daily', 'weekly', 'monthly', 'annual', 'range'].includes(period);

  return {
    period: isValidPeriod ? period : 'monthly',
    ...(dateFrom ? { dateFrom } : {}),
    ...(dateTo ? { dateTo } : {}),
  };
}

export default async function ReportsPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  const params = (await searchParams) ?? {};
  const filters = parseFilters(params);

  const [
    bookingReport,
    revenueReport,
    occupancyReport,
    roomsReport,
    customersReport,
    paymentsReport,
    invoicesReport,
  ] = await Promise.all([
    getBookingReportAction(filters),
    getRevenueReportAction(filters),
    getOccupancyReportAction(filters),
    getRoomsReportAction(filters),
    getCustomersReportAction(filters),
    getPaymentsReportAction(filters),
    getInvoicesReportAction(filters),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reportes</h1>
        <p className="mt-1 text-sm text-gray-500">
          Estadísticas y reportes del hotel
          {user?.email && <span className="ml-2 text-xs text-gray-400">— {user.email}</span>}
        </p>
      </div>

      <ReportFilters />

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6 overflow-x-auto" role="tablist" aria-label="Reportes">
          {TABS.map((tab) => (
            <a
              key={tab.id}
              href={tab.href}
              className="whitespace-nowrap border-b-2 border-transparent px-1 py-3 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all duration-200"
              role="tab"
              aria-selected={tab.selected}
            >
              {tab.label}
            </a>
          ))}
        </nav>
      </div>

      <Suspense fallback={<ReportSkeleton />}>
        <ReportContent
          bookingReport={bookingReport}
          revenueReport={revenueReport}
          occupancyReport={occupancyReport}
          roomsReport={roomsReport}
          customersReport={customersReport}
          paymentsReport={paymentsReport}
          invoicesReport={invoicesReport}
          activeTab={params.tab as string}
        />
      </Suspense>
    </div>
  );
}

interface ReportContentProps {
  bookingReport: Awaited<ReturnType<typeof getBookingReportAction>>;
  revenueReport: Awaited<ReturnType<typeof getRevenueReportAction>>;
  occupancyReport: Awaited<ReturnType<typeof getOccupancyReportAction>>;
  roomsReport: Awaited<ReturnType<typeof getRoomsReportAction>>;
  customersReport: Awaited<ReturnType<typeof getCustomersReportAction>>;
  paymentsReport: Awaited<ReturnType<typeof getPaymentsReportAction>>;
  invoicesReport: Awaited<ReturnType<typeof getInvoicesReportAction>>;
  activeTab?: string;
}

function ReportContent({
  bookingReport,
  revenueReport,
  occupancyReport,
  roomsReport,
  customersReport,
  paymentsReport,
  invoicesReport,
  activeTab,
}: ReportContentProps) {
  const tab = activeTab ?? 'bookings';

  switch (tab) {
    case 'revenue':
      return <RevenueReportView data={revenueReport} />;
    case 'occupancy':
      return <OccupancyReportView data={occupancyReport} />;
    case 'rooms':
      return <RoomsReportView data={roomsReport} />;
    case 'customers':
      return <CustomersReportView data={customersReport} />;
    case 'payments':
      return <PaymentsReportView data={paymentsReport} />;
    case 'invoices':
      return <InvoicesReportView data={invoicesReport} />;
    default:
      return <BookingReportView data={bookingReport} />;
  }
}

function ReportSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-xl bg-gray-100" />
      <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
    </div>
  );
}

const TABS = [
  { id: 'bookings', label: 'Reservas', href: '?tab=bookings', selected: false },
  { id: 'revenue', label: 'Ingresos', href: '?tab=revenue', selected: false },
  { id: 'occupancy', label: 'Ocupación', href: '?tab=occupancy', selected: false },
  { id: 'rooms', label: 'Habitaciones', href: '?tab=rooms', selected: false },
  { id: 'customers', label: 'Clientes', href: '?tab=customers', selected: false },
  { id: 'payments', label: 'Pagos', href: '?tab=payments', selected: false },
  { id: 'invoices', label: 'Facturas', href: '?tab=invoices', selected: false },
];
