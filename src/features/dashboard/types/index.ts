export interface DashboardMetrics {
  rooms: { total: number; available: number; occupied: number; maintenance: number };
  today: { checkIns: number; checkOuts: number; bookings: number };
  revenue: { today: number; month: number; pending: number };
  customers: { total: number; newToday: number };
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface MonthlyDataPoint {
  month: string;
  value: number;
  secondary?: number;
}

export interface DashboardCharts {
  bookingsByMonth: MonthlyDataPoint[];
  revenueByMonth: MonthlyDataPoint[];
  occupancyRate: number;
  paymentMethods: ChartDataPoint[];
  topRooms: ChartDataPoint[];
}

export interface RecentActivity {
  id: string;
  type: 'booking' | 'checkin' | 'checkout' | 'payment' | 'customer';
  description: string;
  detail: string;
  date: Date;
  href: string;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  charts: DashboardCharts;
  recentActivity: RecentActivity[];
}
