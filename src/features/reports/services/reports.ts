import { reportRepository } from '../repositories/reports';
import { reportQuerySchema } from '../schemas';
import type { ReportFilters } from '../types';
import type {
  BookingReport,
  RevenueReport,
  OccupancyReport,
  RoomsReport,
  CustomersReport,
  PaymentsReport,
  InvoicesReport,
  ReportSummary,
} from '../types';

function parseFilters(raw: ReportFilters): ReportFilters {
  const parsed = reportQuerySchema.parse(raw);
  return {
    dateFrom: parsed.dateFrom,
    dateTo: parsed.dateTo,
    period: parsed.period,
  };
}

export const reportService = {
  async getBookingReport(raw: ReportFilters): Promise<BookingReport> {
    const filters = parseFilters(raw);
    return reportRepository.getBookingReport(filters);
  },

  async getRevenueReport(raw: ReportFilters): Promise<RevenueReport> {
    const filters = parseFilters(raw);
    return reportRepository.getRevenueReport(filters);
  },

  async getOccupancyReport(raw: ReportFilters): Promise<OccupancyReport> {
    const filters = parseFilters(raw);
    return reportRepository.getOccupancyReport(filters);
  },

  async getRoomsReport(raw: ReportFilters): Promise<RoomsReport> {
    const filters = parseFilters(raw);
    return reportRepository.getRoomsReport(filters);
  },

  async getCustomersReport(raw: ReportFilters): Promise<CustomersReport> {
    const filters = parseFilters(raw);
    return reportRepository.getCustomersReport(filters);
  },

  async getPaymentsReport(raw: ReportFilters): Promise<PaymentsReport> {
    const filters = parseFilters(raw);
    return reportRepository.getPaymentsReport(filters);
  },

  async getInvoicesReport(raw: ReportFilters): Promise<InvoicesReport> {
    const filters = parseFilters(raw);
    return reportRepository.getInvoicesReport(filters);
  },

  async getReportSummary(): Promise<ReportSummary> {
    return reportRepository.getReportSummary();
  },
};
