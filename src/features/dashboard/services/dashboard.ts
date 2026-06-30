import { dashboardRepository } from '../repositories/dashboard';
import type { DashboardData } from '../types';

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    const [metrics, charts, recentActivity] = await Promise.all([
      dashboardRepository.getMetrics(),
      dashboardRepository.getCharts(),
      dashboardRepository.getRecentActivity(),
    ]);

    return { metrics, charts, recentActivity };
  },
};
