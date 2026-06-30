'use server';

import { requireAuth } from '@/lib/auth/helpers';
import { dashboardService } from '../services/dashboard';

export async function getDashboardDataAction() {
  await requireAuth();
  return dashboardService.getDashboardData();
}
