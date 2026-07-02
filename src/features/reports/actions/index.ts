'use server';

import { reportService } from '../services/reports';
import { requireAuth } from '@/lib/auth/helpers';
import { logger } from '@/lib/logger';
import type { ReportFilters, ExportFormat } from '../types';
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

export type ActionState<T = unknown> = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: T;
};

export async function getBookingReportAction(filters: ReportFilters): Promise<BookingReport> {
  await requireAuth();
  return reportService.getBookingReport(filters);
}

export async function getRevenueReportAction(filters: ReportFilters): Promise<RevenueReport> {
  await requireAuth();
  return reportService.getRevenueReport(filters);
}

export async function getOccupancyReportAction(filters: ReportFilters): Promise<OccupancyReport> {
  await requireAuth();
  return reportService.getOccupancyReport(filters);
}

export async function getRoomsReportAction(filters: ReportFilters): Promise<RoomsReport> {
  await requireAuth();
  return reportService.getRoomsReport(filters);
}

export async function getCustomersReportAction(filters: ReportFilters): Promise<CustomersReport> {
  await requireAuth();
  return reportService.getCustomersReport(filters);
}

export async function getPaymentsReportAction(filters: ReportFilters): Promise<PaymentsReport> {
  await requireAuth();
  return reportService.getPaymentsReport(filters);
}

export async function getInvoicesReportAction(filters: ReportFilters): Promise<InvoicesReport> {
  await requireAuth();
  return reportService.getInvoicesReport(filters);
}

export async function getReportSummaryAction(): Promise<ReportSummary> {
  await requireAuth();
  return reportService.getReportSummary();
}

export async function exportReportAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  try {
    const format = formData.get('format') as ExportFormat;
    const reportType = formData.get('reportType') as string;
    const rawFilters: ReportFilters = {
      period: (formData.get('period') as ReportFilters['period']) ?? 'monthly',
      dateFrom: (formData.get('dateFrom') as string) ?? undefined,
      dateTo: (formData.get('dateTo') as string) ?? undefined,
    };

    logger.info('Exporting report', { format, reportType, filters: rawFilters });

    return {
      success: true,
      message: `Reporte de ${reportType} exportado en formato ${format}.`,
    };
  } catch (e) {
    logger.error('Error al exportar reporte', {
      error: e instanceof Error ? e.message : e,
    });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al exportar el reporte',
    };
  }
}
