'use client';

import dynamic from 'next/dynamic';
import {
  BedDouble,
  Users,
  CalendarCheck,
  LogIn,
  LogOut,
  DollarSign,
  CreditCard,
  TrendingUp,
} from 'lucide-react';
import { StatCard } from '@/components/ui/card';
import { ChartSkeleton } from '@/components/ui/skeleton';
import { RecentActivityView } from './recent-activity';
import type { DashboardData } from '../types';

const DashboardChartsView = dynamic(
  () => import('./dashboard-charts').then((m) => m.DashboardChartsView),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    ),
  },
);

interface DashboardClientProps {
  userEmail: string;
  data: DashboardData;
}

export function DashboardClient({ userEmail, data }: DashboardClientProps) {
  const { metrics, charts, recentActivity } = data;
  const userName = userEmail.split('@')[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Bienvenido, {userName}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Panel de control del sistema de gestión hotelera
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Habitaciones disponibles"
          value={`${metrics.rooms.available} / ${metrics.rooms.total}`}
          icon={BedDouble}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
        />
        <StatCard
          title="Habitaciones ocupadas"
          value={metrics.rooms.occupied}
          icon={BedDouble}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatCard
          title="Check-ins hoy"
          value={metrics.today.checkIns}
          icon={LogIn}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
        />
        <StatCard
          title="Check-outs hoy"
          value={metrics.today.checkOuts}
          icon={LogOut}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50"
        />
        <StatCard
          title="Reservas de hoy"
          value={metrics.today.bookings}
          icon={CalendarCheck}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatCard
          title="Ingresos del día"
          value={`$${metrics.revenue.today.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
        />
        <StatCard
          title="Ingresos del mes"
          value={`$${metrics.revenue.month.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
        <StatCard
          title="Clientes registrados"
          value={metrics.customers.total}
          icon={Users}
          iconColor="text-teal-600"
          iconBgColor="bg-teal-50"
        />
      </div>

      <div className="flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-yellow-600" />
        <span className="text-sm text-gray-500">
          <strong className="text-yellow-700">{metrics.revenue.pending}</strong> pago(s)
          pendiente(s) por cobrar
        </span>
      </div>

      <div>
        <DashboardChartsView charts={charts} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivityView activities={recentActivity} />
        <OccupancyCard
          occupancyRate={charts.occupancyRate}
          total={metrics.rooms.total}
          occupied={metrics.rooms.occupied}
        />
      </div>
    </div>
  );
}

function OccupancyCard({
  occupancyRate,
  total,
  occupied,
}: {
  occupancyRate: number;
  total: number;
  occupied: number;
}) {
  const circleColor =
    occupancyRate > 75
      ? 'text-green-500'
      : occupancyRate > 50
        ? 'text-yellow-500'
        : 'text-blue-500';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Ocupación del hotel</h3>
      <div className="flex items-center gap-6">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <svg className="h-28 w-28 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${occupancyRate} ${100 - occupancyRate}`}
              strokeLinecap="round"
              className={circleColor}
            />
          </svg>
          <span className="absolute text-2xl font-bold text-gray-900">{occupancyRate}%</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-gray-600">Disponibles:</span>
            <span className="font-medium text-gray-900">{total - occupied}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-gray-600">Ocupadas:</span>
            <span className="font-medium text-gray-900">{occupied}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-full bg-gray-300" />
            <span className="text-gray-600">Total:</span>
            <span className="font-medium text-gray-900">{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
