import { prisma } from '@/lib/prisma';
import type { ReportFilters } from '../types';
import type {
  BookingReport,
  BookingTotals,
  BookingStats,
  RevenueReport,
  RevenueTotals,
  RevenueStats,
  OccupancyReport,
  OccupancyStats,
  OccupancyByType,
  RoomsReport,
  RoomsByStatus,
  RoomsByType,
  CustomersReport,
  CustomersStats,
  PaymentsReport,
  PaymentsByMethod,
  PaymentsByStatus,
  InvoicesReport,
  InvoicesByStatus,
  ChartDataPoint,
  ReportSummary,
} from '../types';

function getDateRange(filters: ReportFilters) {
  const now = new Date();
  let dateFrom: Date;
  let dateTo = new Date(now);

  switch (filters.period) {
    case 'daily': {
      dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      dateTo = new Date(dateFrom);
      dateTo.setDate(dateTo.getDate() + 1);
      break;
    }
    case 'weekly': {
      dateFrom = new Date(now);
      dateFrom.setDate(now.getDate() - 7);
      dateFrom.setHours(0, 0, 0, 0);
      break;
    }
    case 'monthly': {
      dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
    case 'annual': {
      dateFrom = new Date(now.getFullYear() - 1, now.getMonth(), 1);
      break;
    }
    case 'range': {
      dateFrom = filters.dateFrom
        ? new Date(filters.dateFrom)
        : new Date(now.getFullYear(), now.getMonth(), 1);
      dateTo = filters.dateTo ? new Date(filters.dateTo) : new Date(now);
      break;
    }
    default: {
      dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
    }
  }

  return { dateFrom, dateTo };
}

function getMonthLabel(date: Date) {
  const months = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getDayLabel(date: Date) {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export const reportRepository = {
  async getBookingReport(filters: ReportFilters): Promise<BookingReport> {
    const { dateFrom, dateTo } = getDateRange(filters);

    const [bookings, stats] = await Promise.all([
      prisma.booking.findMany({
        where: { createdAt: { gte: dateFrom, lte: dateTo }, deletedAt: null },
        select: {
          id: true,
          createdAt: true,
          totalAmount: true,
          statusId: true,
          checkInDate: true,
          checkOutDate: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.booking.aggregate({
        where: { createdAt: { gte: dateFrom, lte: dateTo }, deletedAt: null },
        _avg: { totalAmount: true },
        _sum: { totalAmount: true },
        _count: true,
      }),
    ]);

    const statusIds = [...new Set(bookings.map((b) => b.statusId))];
    const statuses =
      statusIds.length > 0
        ? await prisma.bookingStatus.findMany({
            where: { id: { in: statusIds } },
            select: { id: true, code: true },
          })
        : [];
    const statusMap = new Map(statuses.map((s) => [s.id, s.code]));

    const totals: BookingTotals = {
      total: 0,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      completed: 0,
      noShow: 0,
    };

    let totalNights = 0;
    const spanMs = dateTo.getTime() - dateFrom.getTime();
    const spanDays = Math.ceil(spanMs / (1000 * 60 * 60 * 24));

    for (const b of bookings) {
      const code = statusMap.get(b.statusId) ?? '';
      totals.total++;
      if (code === 'confirmed') totals.confirmed++;
      else if (code === 'pending') totals.pending++;
      else if (code === 'cancelled') totals.cancelled++;
      else if (code === 'completed') totals.completed++;
      else if (code === 'no_show') totals.noShow++;

      const nights = Math.ceil(
        (b.checkOutDate.getTime() - b.checkInDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      totalNights += Math.max(1, nights);
    }

    const avgAmount = stats._avg.totalAmount ? Number(stats._avg.totalAmount.toString()) : 0;
    const totalRevenue = stats._sum.totalAmount ? Number(stats._sum.totalAmount.toString()) : 0;
    const cancellationRate =
      totals.total > 0 ? Math.round((totals.cancelled / totals.total) * 100) : 0;

    const statsResult: BookingStats = {
      averageNights: bookings.length > 0 ? Math.round(totalNights / bookings.length) : 0,
      averageValue: avgAmount,
      totalRevenue,
      cancellationRate,
    };

    let dataPoints: ChartDataPoint[];

    if (filters.period === 'daily') {
      dataPoints = [{ label: 'Hoy', value: bookings.length }];
    } else if (filters.period === 'weekly') {
      const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const dayMap = new Map<string, number>();
      for (let i = 0; i < 7; i++) {
        const d = new Date(dateFrom);
        d.setDate(d.getDate() + i);
        dayMap.set(dayNames[d.getDay()], 0);
      }
      for (const b of bookings) {
        const label = dayNames[b.createdAt.getDay()];
        dayMap.set(label, (dayMap.get(label) ?? 0) + 1);
      }
      dataPoints = Array.from(dayMap.entries()).map(([label, value]) => ({
        label,
        value,
      }));
    } else if (spanDays <= 31) {
      const dayMap = new Map<string, number>();
      for (let i = 0; i < spanDays; i++) {
        const d = new Date(dateFrom);
        d.setDate(d.getDate() + i);
        dayMap.set(getDayLabel(d), 0);
      }
      for (const b of bookings) {
        const label = getDayLabel(b.createdAt);
        dayMap.set(label, (dayMap.get(label) ?? 0) + 1);
      }
      dataPoints = Array.from(dayMap.entries()).map(([label, value]) => ({
        label,
        value,
      }));
    } else {
      const monthMap = new Map<string, number>();
      const cursor = new Date(dateFrom);
      while (cursor < dateTo) {
        monthMap.set(getMonthLabel(cursor), 0);
        cursor.setMonth(cursor.getMonth() + 1);
      }
      for (const b of bookings) {
        const label = getMonthLabel(b.createdAt);
        monthMap.set(label, (monthMap.get(label) ?? 0) + 1);
      }
      dataPoints = Array.from(monthMap.entries()).map(([label, value]) => ({
        label,
        value,
      }));
    }

    return { dataPoints, totals, stats: statsResult };
  },

  async getRevenueReport(filters: ReportFilters): Promise<RevenueReport> {
    const { dateFrom, dateTo } = getDateRange(filters);

    const [payments, methodStats, pendingAgg, bookingAgg] = await Promise.all([
      prisma.payment.findMany({
        where: { transactionDate: { gte: dateFrom, lte: dateTo } },
        select: {
          id: true,
          amount: true,
          status: true,
          transactionDate: true,
          paymentMethodId: true,
        },
        orderBy: { transactionDate: 'asc' },
      }),
      prisma.payment.groupBy({
        by: ['paymentMethodId'],
        where: { transactionDate: { gte: dateFrom, lte: dateTo }, status: 'COMPLETED' },
        _count: { id: true },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { status: 'PENDING' },
        _count: true,
        _sum: { amount: true },
      }),
      prisma.booking.aggregate({
        where: { createdAt: { gte: dateFrom, lte: dateTo }, deletedAt: null },
        _count: true,
        _sum: { totalAmount: true },
      }),
    ]);

    const methodIds = methodStats.map((m) => m.paymentMethodId);
    const methods =
      methodIds.length > 0
        ? await prisma.paymentMethod.findMany({
            where: { id: { in: methodIds } },
            select: { id: true, name: true },
          })
        : [];
    const methodMap = new Map(methods.map((m) => [m.id, m.name]));

    let totalCollected = 0;
    let totalRefunded = 0;
    const methodTotals = new Map<string, number>();

    for (const p of payments) {
      if (p.status === 'COMPLETED') {
        totalCollected += Number(p.amount.toString());
        const name = methodMap.get(p.paymentMethodId) ?? 'Desconocido';
        methodTotals.set(name, (methodTotals.get(name) ?? 0) + Number(p.amount.toString()));
      } else if (p.status === 'REFUNDED') {
        totalRefunded += Number(p.amount.toString());
      }
    }

    const totalBookings = bookingAgg._count ?? 0;
    const pendingAmount = pendingAgg._sum.amount ? Number(pendingAgg._sum.amount.toString()) : 0;

    const totals: RevenueTotals = {
      totalCollected,
      pending: pendingAmount,
      refunded: totalRefunded,
      averagePerBooking: totalBookings > 0 ? totalCollected / totalBookings : 0,
    };

    const byMethod: ChartDataPoint[] = Array.from(methodTotals.entries()).map(([label, value]) => ({
      label,
      value: Math.round(value),
    }));

    const spanMs = dateTo.getTime() - dateFrom.getTime();
    const spanDays = Math.ceil(spanMs / (1000 * 60 * 60 * 24));

    let dataPoints: ChartDataPoint[];
    let byPeriod: ChartDataPoint[];

    if (filters.period === 'daily') {
      dataPoints = [{ label: 'Hoy', value: totalCollected }];
      byPeriod = dataPoints;
    } else if (spanDays <= 31) {
      const dayMap = new Map<string, number>();
      for (let i = 0; i < spanDays; i++) {
        const d = new Date(dateFrom);
        d.setDate(d.getDate() + i);
        dayMap.set(getDayLabel(d), 0);
      }
      for (const p of payments) {
        if (p.status === 'COMPLETED') {
          const label = getDayLabel(p.transactionDate);
          dayMap.set(label, (dayMap.get(label) ?? 0) + Number(p.amount.toString()));
        }
      }
      dataPoints = Array.from(dayMap.entries()).map(([label, value]) => ({
        label,
        value: Math.round(value),
      }));
      byPeriod = dataPoints;
    } else {
      const monthMap = new Map<string, number>();
      const cursor = new Date(dateFrom);
      while (cursor < dateTo) {
        monthMap.set(getMonthLabel(cursor), 0);
        cursor.setMonth(cursor.getMonth() + 1);
      }
      for (const p of payments) {
        if (p.status === 'COMPLETED') {
          const label = getMonthLabel(p.transactionDate);
          monthMap.set(label, (monthMap.get(label) ?? 0) + Number(p.amount.toString()));
        }
      }
      dataPoints = Array.from(monthMap.entries()).map(([label, value]) => ({
        label,
        value: Math.round(value),
      }));
      byPeriod = dataPoints;
    }

    const stats: RevenueStats = {
      byMethod,
      byPeriod,
      totalBookings,
    };

    return { dataPoints, totals, stats };
  },

  async getOccupancyReport(filters: ReportFilters): Promise<OccupancyReport> {
    const { dateFrom, dateTo } = getDateRange(filters);

    const [rooms, roomStatuses, bookings, roomTypes] = await Promise.all([
      prisma.room.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          statusId: true,
          roomTypeId: true,
          roomType: { select: { name: true } },
        },
      }),
      prisma.room.groupBy({
        by: ['statusId'],
        where: { deletedAt: null },
        _count: { id: true },
      }),
      prisma.booking.findMany({
        where: {
          OR: [{ checkInDate: { lte: dateTo }, checkOutDate: { gte: dateFrom } }],
          deletedAt: null,
          status: { code: { in: ['confirmed', 'completed'] } },
        },
        select: { roomId: true },
        distinct: ['roomId'],
      }),
      prisma.roomType.findMany({
        where: { isActive: true },
        select: { id: true, name: true },
      }),
    ]);

    const statusIds = roomStatuses.map((rs) => rs.statusId);
    const statusCodes =
      statusIds.length > 0
        ? await prisma.roomStatus.findMany({
            where: { id: { in: statusIds } },
            select: { id: true, code: true },
          })
        : [];
    const statusMap = new Map(statusCodes.map((s) => [s.id, s.code]));

    const total = rooms.length;
    let available = 0;
    let maintenance = 0;
    let outOfOrder = 0;

    for (const rs of roomStatuses) {
      const code = statusMap.get(rs.statusId);
      if (code === 'available') available += rs._count.id;
      else if (code === 'maintenance') maintenance += rs._count.id;
      else if (code === 'out_of_order') outOfOrder += rs._count.id;
    }

    const occupiedRoomIds = new Set(bookings.map((b) => b.roomId));
    const currentOccupied = occupiedRoomIds.size;

    const currentRate = total > 0 ? Math.round((currentOccupied / total) * 100) : 0;

    const stats: OccupancyStats = {
      currentRate,
      available,
      occupied: currentOccupied,
      maintenance,
      outOfOrder,
      total,
    };

    const typeMap = new Map(roomTypes.map((rt) => [rt.id, rt.name]));
    const typeOccupancy = new Map<string, { total: number; occupied: number; available: number }>();

    for (const room of rooms) {
      const typeName = typeMap.get(room.roomTypeId) ?? 'Desconocido';
      if (!typeOccupancy.has(typeName)) {
        typeOccupancy.set(typeName, { total: 0, occupied: 0, available: 0 });
      }
      const entry = typeOccupancy.get(typeName)!;
      entry.total++;
      if (occupiedRoomIds.has(room.id)) {
        entry.occupied++;
      } else {
        const code = statusMap.get(room.statusId);
        if (code === 'available') entry.available++;
      }
    }

    const byRoomType: OccupancyByType[] = Array.from(typeOccupancy.entries()).map(
      ([roomType, data]) => ({
        roomType,
        total: data.total,
        occupied: data.occupied,
        available: data.available,
        rate: data.total > 0 ? Math.round((data.occupied / data.total) * 100) : 0,
      }),
    );

    const dataPoints: ChartDataPoint[] = [
      { label: 'Disponibles', value: available },
      { label: 'Ocupadas', value: currentOccupied },
      { label: 'Mantenimiento', value: maintenance },
      { label: 'Fuera de servicio', value: outOfOrder },
    ];

    return { stats, byRoomType, dataPoints };
  },

  async getRoomsReport(filters: ReportFilters): Promise<RoomsReport> {
    getDateRange(filters);

    const [rooms, statusGroups, typeGroups, floorGroups] = await Promise.all([
      prisma.room.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          floor: true,
          statusId: true,
          roomTypeId: true,
          status: { select: { code: true, name: true } },
          roomType: { select: { name: true, basePricePerNight: true } },
        },
      }),
      prisma.room.groupBy({
        by: ['statusId'],
        where: { deletedAt: null },
        _count: { id: true },
      }),
      prisma.room.groupBy({
        by: ['roomTypeId'],
        where: { deletedAt: null },
        _count: { id: true },
      }),
      prisma.room.groupBy({
        by: ['floor'],
        where: { deletedAt: null, floor: { not: null } },
        _count: { id: true },
        orderBy: { floor: 'asc' },
      }),
    ]);

    const statusIds = statusGroups.map((sg) => sg.statusId);
    const typeIds = typeGroups.map((tg) => tg.roomTypeId);

    const [statusCodes, typeInfo] = await Promise.all([
      statusIds.length > 0
        ? prisma.roomStatus.findMany({
            where: { id: { in: statusIds } },
            select: { id: true, code: true, name: true },
          })
        : Promise.resolve([]),
      typeIds.length > 0
        ? prisma.roomType.findMany({
            where: { id: { in: typeIds } },
            select: { id: true, name: true },
          })
        : Promise.resolve([]),
    ]);

    const statusMap = new Map(statusCodes.map((s) => [s.id, s]));
    const typeMap = new Map(typeInfo.map((t) => [t.id, t.name]));

    const byStatus: RoomsByStatus[] = statusGroups.map((sg) => {
      const s = statusMap.get(sg.statusId);
      return {
        status: s?.name ?? 'Desconocido',
        statusCode: s?.code ?? 'unknown',
        count: sg._count.id,
      };
    });

    const byType: RoomsByType[] = typeGroups.map((tg) => {
      const room = rooms.find((r) => r.roomTypeId === tg.roomTypeId);
      return {
        roomType: typeMap.get(tg.roomTypeId) ?? 'Desconocido',
        count: tg._count.id,
        basePrice: room ? Number(room.roomType.basePricePerNight.toString()) : 0,
      };
    });

    const byFloor: ChartDataPoint[] = floorGroups.map((fg) => ({
      label: fg.floor !== null ? `Piso ${fg.floor}` : 'Sótano',
      value: fg._count.id,
    }));

    const dataPoints: ChartDataPoint[] = byStatus.map((bs) => ({
      label: bs.status,
      value: bs.count,
    }));

    return {
      total: rooms.length,
      byStatus,
      byType,
      byFloor,
      dataPoints,
    };
  },

  async getCustomersReport(filters: ReportFilters): Promise<CustomersReport> {
    const { dateFrom, dateTo } = getDateRange(filters);

    const [total, newThisPeriod, returning, countryGroups] = await Promise.all([
      prisma.customer.count({ where: { deletedAt: null } }),
      prisma.customer.count({
        where: { createdAt: { gte: dateFrom, lte: dateTo }, deletedAt: null },
      }),
      prisma.customer.count({
        where: {
          createdAt: { lt: dateFrom },
          deletedAt: null,
          bookings: { some: { createdAt: { gte: dateFrom, lte: dateTo } } },
        },
      }),
      prisma.customer.groupBy({
        by: ['countryId'],
        where: { deletedAt: null, countryId: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
    ]);

    const countryIds = countryGroups
      .map((cg) => cg.countryId)
      .filter((id): id is string => id !== null);
    const countries =
      countryIds.length > 0
        ? await prisma.country.findMany({
            where: { id: { in: countryIds } },
            select: { id: true, name: true },
          })
        : [];
    const countryMap = new Map(countries.map((c) => [c.id, c.name]));

    const topCountries: ChartDataPoint[] = countryGroups
      .filter((cg) => cg.countryId)
      .map((cg) => ({
        label: countryMap.get(cg.countryId!) ?? 'Desconocido',
        value: cg._count.id,
      }));

    const stats: CustomersStats = {
      total,
      newThisPeriod,
      returning,
      topCountries,
    };

    const spanMs = dateTo.getTime() - dateFrom.getTime();
    const spanDays = Math.ceil(spanMs / (1000 * 60 * 60 * 24));
    let dataPoints: ChartDataPoint[];

    if (filters.period === 'daily') {
      dataPoints = [{ label: 'Hoy', value: newThisPeriod }];
    } else if (spanDays <= 31) {
      const dayMap = new Map<string, number>();
      for (let i = 0; i < spanDays; i++) {
        const d = new Date(dateFrom);
        d.setDate(d.getDate() + i);
        dayMap.set(getDayLabel(d), 0);
      }
      const customerBookings = await prisma.customer.findMany({
        where: { createdAt: { gte: dateFrom, lte: dateTo }, deletedAt: null },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      });
      for (const c of customerBookings) {
        const label = getDayLabel(c.createdAt);
        dayMap.set(label, (dayMap.get(label) ?? 0) + 1);
      }
      dataPoints = Array.from(dayMap.entries()).map(([label, value]) => ({
        label,
        value,
      }));
    } else {
      const monthMap = new Map<string, number>();
      const cursor = new Date(dateFrom);
      while (cursor < dateTo) {
        monthMap.set(getMonthLabel(cursor), 0);
        cursor.setMonth(cursor.getMonth() + 1);
      }
      const customerBookings = await prisma.customer.findMany({
        where: { createdAt: { gte: dateFrom, lte: dateTo }, deletedAt: null },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      });
      for (const c of customerBookings) {
        const label = getMonthLabel(c.createdAt);
        monthMap.set(label, (monthMap.get(label) ?? 0) + 1);
      }
      dataPoints = Array.from(monthMap.entries()).map(([label, value]) => ({
        label,
        value,
      }));
    }

    return { stats, dataPoints };
  },

  async getPaymentsReport(filters: ReportFilters): Promise<PaymentsReport> {
    const { dateFrom, dateTo } = getDateRange(filters);

    const [completedAgg, pendingAgg, refundedAgg, methodGroups, statusGroups, payments] =
      await Promise.all([
        prisma.payment.aggregate({
          where: { status: 'COMPLETED', transactionDate: { gte: dateFrom, lte: dateTo } },
          _sum: { amount: true },
          _count: true,
        }),
        prisma.payment.aggregate({
          where: { status: 'PENDING' },
          _sum: { amount: true },
          _count: true,
        }),
        prisma.payment.aggregate({
          where: { status: 'REFUNDED', transactionDate: { gte: dateFrom, lte: dateTo } },
          _sum: { amount: true },
          _count: true,
        }),
        prisma.payment.groupBy({
          by: ['paymentMethodId'],
          where: { status: 'COMPLETED', transactionDate: { gte: dateFrom, lte: dateTo } },
          _count: { id: true },
          _sum: { amount: true },
        }),
        prisma.payment.groupBy({
          by: ['status'],
          where: { transactionDate: { gte: dateFrom, lte: dateTo } },
          _count: { id: true },
          _sum: { amount: true },
        }),
        prisma.payment.findMany({
          where: { transactionDate: { gte: dateFrom, lte: dateTo } },
          select: { amount: true, transactionDate: true, status: true },
          orderBy: { transactionDate: 'asc' },
        }),
      ]);

    const methodIds = methodGroups.map((m) => m.paymentMethodId);
    const methods =
      methodIds.length > 0
        ? await prisma.paymentMethod.findMany({
            where: { id: { in: methodIds } },
            select: { id: true, name: true },
          })
        : [];
    const methodMap = new Map(methods.map((m) => [m.id, m.name]));

    const totalCollected = completedAgg._sum.amount
      ? Number(completedAgg._sum.amount.toString())
      : 0;
    const totalPending = pendingAgg._sum.amount ? Number(pendingAgg._sum.amount.toString()) : 0;
    const totalRefunded = refundedAgg._sum.amount ? Number(refundedAgg._sum.amount.toString()) : 0;

    const byMethod: PaymentsByMethod[] = methodGroups.map((mg) => ({
      method: methodMap.get(mg.paymentMethodId) ?? 'Desconocido',
      count: mg._count.id,
      total: mg._sum.amount ? Number(mg._sum.amount.toString()) : 0,
    }));

    const byStatus: PaymentsByStatus[] = statusGroups.map((sg) => ({
      status: sg.status,
      count: sg._count.id,
      total: sg._sum.amount ? Number(sg._sum.amount.toString()) : 0,
    }));

    const spanMs = dateTo.getTime() - dateFrom.getTime();
    const spanDays = Math.ceil(spanMs / (1000 * 60 * 60 * 24));
    let dataPoints: ChartDataPoint[];

    if (filters.period === 'daily') {
      dataPoints = [{ label: 'Hoy', value: totalCollected }];
    } else if (spanDays <= 31) {
      const dayMap = new Map<string, number>();
      for (let i = 0; i < spanDays; i++) {
        const d = new Date(dateFrom);
        d.setDate(d.getDate() + i);
        dayMap.set(getDayLabel(d), 0);
      }
      for (const p of payments) {
        if (p.status === 'COMPLETED') {
          const label = getDayLabel(p.transactionDate);
          dayMap.set(label, (dayMap.get(label) ?? 0) + Number(p.amount.toString()));
        }
      }
      dataPoints = Array.from(dayMap.entries()).map(([label, value]) => ({
        label,
        value: Math.round(value),
      }));
    } else {
      const monthMap = new Map<string, number>();
      const cursor = new Date(dateFrom);
      while (cursor < dateTo) {
        monthMap.set(getMonthLabel(cursor), 0);
        cursor.setMonth(cursor.getMonth() + 1);
      }
      for (const p of payments) {
        if (p.status === 'COMPLETED') {
          const label = getMonthLabel(p.transactionDate);
          monthMap.set(label, (monthMap.get(label) ?? 0) + Number(p.amount.toString()));
        }
      }
      dataPoints = Array.from(monthMap.entries()).map(([label, value]) => ({
        label,
        value: Math.round(value),
      }));
    }

    return { totalCollected, totalPending, totalRefunded, byMethod, byStatus, dataPoints };
  },

  async getInvoicesReport(filters: ReportFilters): Promise<InvoicesReport> {
    const { dateFrom, dateTo } = getDateRange(filters);

    const [invoices, statusGroups] = await Promise.all([
      prisma.invoice.findMany({
        where: { issueDate: { gte: dateFrom, lte: dateTo }, deletedAt: null },
        select: {
          id: true,
          status: true,
          totalAmount: true,
          issueDate: true,
        },
        orderBy: { issueDate: 'asc' },
      }),
      prisma.invoice.groupBy({
        by: ['status'],
        where: { issueDate: { gte: dateFrom, lte: dateTo }, deletedAt: null },
        _count: { id: true },
        _sum: { totalAmount: true },
      }),
    ]);

    let totalIssued = 0;
    let totalPaid = 0;
    let totalPending = 0;
    let totalCancelled = 0;
    let totalAmount = 0;
    let paidAmount = 0;

    const byStatus: InvoicesByStatus[] = statusGroups.map((sg) => {
      const total = sg._sum.totalAmount ? Number(sg._sum.totalAmount.toString()) : 0;
      if (sg.status === 'ISSUED') {
        totalIssued = sg._count.id;
        totalPending += total;
      } else if (sg.status === 'PAID') {
        totalPaid = sg._count.id;
        paidAmount = total;
      } else if (sg.status === 'CANCELLED') {
        totalCancelled = sg._count.id;
      } else if (sg.status === 'DRAFT') {
        totalPending += total;
      }
      totalAmount += total;
      return {
        status: sg.status,
        count: sg._count.id,
        total,
      };
    });

    const spanMs = dateTo.getTime() - dateFrom.getTime();
    const spanDays = Math.ceil(spanMs / (1000 * 60 * 60 * 24));
    let dataPoints: ChartDataPoint[];

    if (filters.period === 'daily') {
      dataPoints = [{ label: 'Hoy', value: invoices.length }];
    } else if (spanDays <= 31) {
      const dayMap = new Map<string, number>();
      for (let i = 0; i < spanDays; i++) {
        const d = new Date(dateFrom);
        d.setDate(d.getDate() + i);
        dayMap.set(getDayLabel(d), 0);
      }
      for (const inv of invoices) {
        const label = getDayLabel(inv.issueDate);
        dayMap.set(label, (dayMap.get(label) ?? 0) + 1);
      }
      dataPoints = Array.from(dayMap.entries()).map(([label, value]) => ({
        label,
        value,
      }));
    } else {
      const monthMap = new Map<string, number>();
      const cursor = new Date(dateFrom);
      while (cursor < dateTo) {
        monthMap.set(getMonthLabel(cursor), 0);
        cursor.setMonth(cursor.getMonth() + 1);
      }
      for (const inv of invoices) {
        const label = getMonthLabel(inv.issueDate);
        monthMap.set(label, (monthMap.get(label) ?? 0) + 1);
      }
      dataPoints = Array.from(monthMap.entries()).map(([label, value]) => ({
        label,
        value,
      }));
    }

    return {
      totalIssued,
      totalPaid,
      totalPending,
      totalCancelled,
      totalAmount,
      paidAmount,
      byStatus,
      dataPoints,
    };
  },

  async getReportSummary(): Promise<ReportSummary> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [
      totalBookings,
      totalRevenue,
      rooms,
      occupiedRooms,
      avgValue,
      totalCustomers,
      pendingInvoices,
      pendingPayments,
    ] = await Promise.all([
      prisma.booking.count({ where: { deletedAt: null } }),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      prisma.room.count({ where: { deletedAt: null } }),
      prisma.booking.count({
        where: {
          status: { code: { in: ['confirmed', 'completed'] } },
          checkInDate: { lte: new Date() },
          checkOutDate: { gte: new Date() },
          deletedAt: null,
        },
      }),
      prisma.booking.aggregate({
        where: { deletedAt: null },
        _avg: { totalAmount: true },
      }),
      prisma.customer.count({ where: { deletedAt: null } }),
      prisma.invoice.count({
        where: { status: { in: ['DRAFT', 'ISSUED', 'PARTIALLY_PAID'] }, deletedAt: null },
      }),
      prisma.payment.count({ where: { status: 'PENDING' } }),
    ]);

    return {
      totalBookings,
      totalRevenue: totalRevenue._sum.amount ? Number(totalRevenue._sum.amount.toString()) : 0,
      occupancyRate: rooms > 0 ? Math.round((occupiedRooms / rooms) * 100) : 0,
      averageBookingValue: avgValue._avg.totalAmount
        ? Number(avgValue._avg.totalAmount.toString())
        : 0,
      totalCustomers,
      pendingInvoices,
      pendingPayments,
    };
  },
};
