const prisma = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

const getStats = asyncHandler(async (req, res) => {
  const [
    totalOrders,
    pending,
    delivered,
    cancelled,
    totalProducts,
    activeProducts,
    recentOrders,
    revenueAgg,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: 'DELIVERED' } }),
    prisma.order.count({ where: { status: 'CANCELLED' } }),
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 8, include: { items: true } }),
    prisma.order.aggregate({
      where: { status: 'DELIVERED' },
      _sum: { total: true },
    }),
  ]);

  // Last 14 days of order volume, for a simple trend chart. Bucketed by
  // UTC calendar day throughout (not the server's local timezone) so the
  // day keys always line up with createdAt.toISOString() below — mixing
  // local-time arithmetic with UTC-sliced keys drops "today" from the
  // chart whenever the server runs ahead of UTC (e.g. Africa/Algiers).
  const now = new Date();
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const since = new Date(todayUTC - 13 * 24 * 60 * 60 * 1000);

  const recentForChart = await prisma.order.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true, total: true },
  });

  const byDay = {};
  for (let i = 0; i < 14; i += 1) {
    const key = new Date(since.getTime() + i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    byDay[key] = { date: key, orders: 0, revenue: 0 };
  }
  for (const o of recentForChart) {
    const key = o.createdAt.toISOString().slice(0, 10);
    if (byDay[key]) {
      byDay[key].orders += 1;
      byDay[key].revenue += o.total;
    }
  }

  res.json({
    success: true,
    data: {
      orders: { total: totalOrders, pending, delivered, cancelled },
      products: { total: totalProducts, active: activeProducts },
      revenue: revenueAgg._sum.total || 0,
      recentOrders,
      chart: Object.values(byDay),
    },
  });
});

module.exports = { getStats };
