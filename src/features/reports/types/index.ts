export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'annual' | 'range';
export type ExportFormat = 'pdf' | 'excel';

export interface ReportFilters {
  dateFrom?: string;
  dateTo?: string;
  period: ReportPeriod;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondary?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BookingTotals {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  completed: number;
  noShow: number;
}

export interface BookingStats {
  averageNights: number;
  averageValue: number;
  totalRevenue: number;
  cancellationRate: number;
}

export interface BookingReport {
  dataPoints: ChartDataPoint[];
  totals: BookingTotals;
  stats: BookingStats;
}

export interface RevenueTotals {
  totalCollected: number;
  pending: number;
  refunded: number;
  averagePerBooking: number;
}

export interface RevenueStats {
  byMethod: ChartDataPoint[];
  byPeriod: ChartDataPoint[];
  totalBookings: number;
}

export interface RevenueReport {
  dataPoints: ChartDataPoint[];
  totals: RevenueTotals;
  stats: RevenueStats;
}

export interface OccupancyStats {
  currentRate: number;
  available: number;
  occupied: number;
  maintenance: number;
  outOfOrder: number;
  total: number;
}

export interface OccupancyByType {
  roomType: string;
  total: number;
  occupied: number;
  available: number;
  rate: number;
}

export interface OccupancyReport {
  stats: OccupancyStats;
  byRoomType: OccupancyByType[];
  dataPoints: ChartDataPoint[];
}

export interface RoomsByStatus {
  status: string;
  statusCode: string;
  count: number;
}

export interface RoomsByType {
  roomType: string;
  count: number;
  basePrice: number;
}

export interface RoomsReport {
  total: number;
  byStatus: RoomsByStatus[];
  byType: RoomsByType[];
  byFloor: ChartDataPoint[];
  dataPoints: ChartDataPoint[];
}

export interface CustomersStats {
  total: number;
  newThisPeriod: number;
  returning: number;
  topCountries: ChartDataPoint[];
}

export interface CustomersReport {
  stats: CustomersStats;
  dataPoints: ChartDataPoint[];
}

export interface PaymentsByMethod {
  method: string;
  count: number;
  total: number;
}

export interface PaymentsByStatus {
  status: string;
  count: number;
  total: number;
}

export interface PaymentsReport {
  totalCollected: number;
  totalPending: number;
  totalRefunded: number;
  byMethod: PaymentsByMethod[];
  byStatus: PaymentsByStatus[];
  dataPoints: ChartDataPoint[];
}

export interface InvoicesByStatus {
  status: string;
  count: number;
  total: number;
}

export interface InvoicesReport {
  totalIssued: number;
  totalPaid: number;
  totalPending: number;
  totalCancelled: number;
  totalAmount: number;
  paidAmount: number;
  byStatus: InvoicesByStatus[];
  dataPoints: ChartDataPoint[];
}

export interface ReportSummary {
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  averageBookingValue: number;
  totalCustomers: number;
  pendingInvoices: number;
  pendingPayments: number;
}

export interface ExportPayload {
  format: ExportFormat;
  reportType: string;
  filters: ReportFilters;
}
