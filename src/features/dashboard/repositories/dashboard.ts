import { prisma } from '@/lib/prisma';
import type {
  DashboardMetrics,
  DashboardCharts,
  RecentActivity,
  MonthlyDataPoint,
  ChartDataPoint,
} from '../types';

export const dashboardRepository = {
  async getMetrics(): Promise<DashboardMetrics> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      rooms,
      roomStatuses,
      todayCheckIns,
      todayCheckOuts,
      todayBookings,
      todayPayments,
      monthPayments,
      customerCount,
      customersToday,
      pendingPayments,
    ] = await Promise.all([
      prisma.room.count({ where: { deletedAt: null } }),
      prisma.room.groupBy({
        by: ['statusId'],
        where: { deletedAt: null },
        _count: { id: true },
      }),
      prisma.checkIn.count({
        where: { createdAt: { gte: today, lt: tomorrow } },
      }),
      prisma.checkOut.count({
        where: { createdAt: { gte: today, lt: tomorrow } },
      }),
      prisma.booking.count({
        where: { createdAt: { gte: today, lt: tomorrow }, deletedAt: null },
      }),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED', transactionDate: { gte: today, lt: tomorrow } },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED', transactionDate: { gte: thisMonthStart } },
        _sum: { amount: true },
      }),
      prisma.customer.count({ where: { deletedAt: null } }),
      prisma.customer.count({
        where: { createdAt: { gte: today, lt: tomorrow }, deletedAt: null },
      }),
      prisma.payment.count({ where: { status: 'PENDING' } }),
    ]);

    const statusIds = rooms > 0 ? roomStatuses.map((r) => r.statusId) : [];
    const statusCodes =
      statusIds.length > 0
        ? await prisma.roomStatus.findMany({
            where: { id: { in: statusIds } },
            select: { id: true, code: true },
          })
        : [];

    const statusMap = new Map(statusCodes.map((s) => [s.id, s.code]));

    let available = 0;
    let occupied = 0;
    let maintenance = 0;

    for (const rs of roomStatuses) {
      const code = statusMap.get(rs.statusId);
      if (code === 'available' || code === 'cleaning') available += rs._count.id;
      else if (code === 'occupied') occupied += rs._count.id;
      else if (code === 'maintenance' || code === 'out_of_order') maintenance += rs._count.id;
    }

    return {
      rooms: { total: rooms, available, occupied, maintenance },
      today: { checkIns: todayCheckIns, checkOuts: todayCheckOuts, bookings: todayBookings },
      revenue: {
        today: Number(todayPayments._sum.amount?.toString() ?? '0'),
        month: Number(monthPayments._sum.amount?.toString() ?? '0'),
        pending: pendingPayments,
      },
      customers: { total: customerCount, newToday: customersToday },
    };
  },

  async getCharts(): Promise<DashboardCharts> {
    const today = new Date();
    const twelveMonthsAgo = new Date(today.getFullYear() - 1, today.getMonth(), 1);

    const [bookings, payments, rooms, paymentMethodCounts, bookingRoomStats] = await Promise.all([
      prisma.booking.findMany({
        where: {
          createdAt: { gte: twelveMonthsAgo },
          deletedAt: null,
        },
        select: { createdAt: true, totalAmount: true },
      }),
      prisma.payment.findMany({
        where: {
          status: 'COMPLETED',
          transactionDate: { gte: twelveMonthsAgo },
        },
        select: { amount: true, transactionDate: true, paymentMethod: { select: { name: true } } },
      }),
      prisma.room.findMany({
        where: { deletedAt: null },
        select: { status: { select: { code: true } } },
      }),
      prisma.payment.groupBy({
        by: ['paymentMethodId'],
        where: { status: 'COMPLETED', transactionDate: { gte: twelveMonthsAgo } },
        _count: { id: true },
      }),
      prisma.booking.groupBy({
        by: ['roomId'],
        where: { deletedAt: null },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
    ]);

    const monthNames = [
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

    const bookingsByMonth: MonthlyDataPoint[] = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - 11 + i, 1);
      return { month: `${monthNames[d.getMonth()]} ${d.getFullYear()}`, value: 0 };
    });

    const revenueByMonth: MonthlyDataPoint[] = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - 11 + i, 1);
      return { month: `${monthNames[d.getMonth()]} ${d.getFullYear()}`, value: 0 };
    });

    for (const b of bookings) {
      const monthIdx =
        (b.createdAt.getFullYear() - twelveMonthsAgo.getFullYear()) * 12 +
        (b.createdAt.getMonth() - twelveMonthsAgo.getMonth());
      if (monthIdx >= 0 && monthIdx < 12) {
        bookingsByMonth[monthIdx].value++;
      }
    }

    for (const p of payments) {
      const monthIdx =
        (p.transactionDate.getFullYear() - twelveMonthsAgo.getFullYear()) * 12 +
        (p.transactionDate.getMonth() - twelveMonthsAgo.getMonth());
      if (monthIdx >= 0 && monthIdx < 12) {
        revenueByMonth[monthIdx].value += Number(p.amount.toString());
      }
    }

    const occupiedRooms = rooms.filter((r) => r.status.code === 'occupied').length;
    const occupancyRate = rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0;

    const paymentMethodIds = paymentMethodCounts.map((p) => p.paymentMethodId);
    const paymentMethodsInfo =
      paymentMethodIds.length > 0
        ? await prisma.paymentMethod.findMany({
            where: { id: { in: paymentMethodIds } },
            select: { id: true, name: true },
          })
        : [];

    const pmMap = new Map(paymentMethodsInfo.map((pm) => [pm.id, pm.name]));
    const paymentMethods: ChartDataPoint[] = paymentMethodCounts.map((pmc) => ({
      label: pmMap.get(pmc.paymentMethodId) ?? 'Desconocido',
      value: pmc._count.id,
    }));

    const roomIds = bookingRoomStats.map((b) => b.roomId);
    const roomsInfo =
      roomIds.length > 0
        ? await prisma.room.findMany({
            where: { id: { in: roomIds } },
            select: { id: true, roomNumber: true },
          })
        : [];

    const roomMap = new Map(roomsInfo.map((r) => [r.id, r.roomNumber]));
    const topRooms: ChartDataPoint[] = bookingRoomStats.map((brs) => ({
      label: `Hab #${roomMap.get(brs.roomId) ?? brs.roomId.slice(0, 8)}`,
      value: brs._count.id,
    }));

    return { bookingsByMonth, revenueByMonth, occupancyRate, paymentMethods, topRooms };
  },

  async getRecentActivity(): Promise<RecentActivity[]> {
    const activities: RecentActivity[] = [];

    const [recentBookings, recentCheckIns, recentCheckOuts, recentPayments, recentCustomers] =
      await Promise.all([
        prisma.booking.findMany({
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            createdAt: true,
            customer: { select: { firstName: true, lastName: true } },
            room: { select: { roomNumber: true } },
          },
        }),
        prisma.checkIn.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            createdAt: true,
            booking: {
              select: {
                id: true,
                customer: { select: { firstName: true, lastName: true } },
                room: { select: { roomNumber: true } },
              },
            },
          },
        }),
        prisma.checkOut.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            createdAt: true,
            booking: {
              select: {
                id: true,
                customer: { select: { firstName: true, lastName: true } },
                room: { select: { roomNumber: true } },
              },
            },
          },
        }),
        prisma.payment.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            createdAt: true,
            amount: true,
            booking: { select: { customer: { select: { firstName: true, lastName: true } } } },
          },
        }),
        prisma.customer.findMany({
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: { id: true, createdAt: true, firstName: true, lastName: true },
        }),
      ]);

    for (const b of recentBookings) {
      activities.push({
        id: `booking-${b.id}`,
        type: 'booking',
        description: `Nueva reserva de ${b.customer.firstName} ${b.customer.lastName}`,
        detail: `Hab. ${b.room.roomNumber}`,
        date: b.createdAt,
        href: `/dashboard/reservas/${b.id}`,
      });
    }

    for (const ci of recentCheckIns) {
      activities.push({
        id: `checkin-${ci.id}`,
        type: 'checkin',
        description: `Check-in: ${ci.booking.customer.firstName} ${ci.booking.customer.lastName}`,
        detail: `Hab. ${ci.booking.room.roomNumber}`,
        date: ci.createdAt,
        href: `/dashboard/check/${ci.booking.id}`,
      });
    }

    for (const co of recentCheckOuts) {
      activities.push({
        id: `checkout-${co.id}`,
        type: 'checkout',
        description: `Check-out: ${co.booking.customer.firstName} ${co.booking.customer.lastName}`,
        detail: `Hab. ${co.booking.room.roomNumber}`,
        date: co.createdAt,
        href: `/dashboard/check/${co.booking.id}`,
      });
    }

    for (const p of recentPayments) {
      activities.push({
        id: `payment-${p.id}`,
        type: 'payment',
        description: `Pago de $${Number(p.amount).toFixed(2)} de ${p.booking.customer.firstName} ${p.booking.customer.lastName}`,
        detail: 'Completado',
        date: p.createdAt,
        href: `/dashboard/pagos/${p.id}`,
      });
    }

    for (const c of recentCustomers) {
      activities.push({
        id: `customer-${c.id}`,
        type: 'customer',
        description: `Nuevo cliente: ${c.firstName} ${c.lastName}`,
        detail: 'Registrado',
        date: c.createdAt,
        href: `/dashboard/clientes/${c.id}`,
      });
    }

    activities.sort((a, b) => b.date.getTime() - a.date.getTime());

    return activities.slice(0, 10);
  },
};
