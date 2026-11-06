const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const VALID_STATUSES = ['PENDING', 'DELIVERED', 'CANCELLED'];

const listOrders = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const { status, q } = req.query;

  const where = {
    ...(status && VALID_STATUSES.includes(status) ? { status } : {}),
    ...(q
      ? {
          OR: [
            { orderNumber: { contains: q, mode: 'insensitive' } },
            { customerName: { contains: q, mode: 'insensitive' } },
            { phone: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  res.json({ success: true, data: { items, total, page, limit, totalPages: Math.ceil(total / limit) || 1 } });
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: true },
  });
  if (!order) throw ApiError.notFound('Commande introuvable.');
  res.json({ success: true, data: order });
});

// Stock is taken when an order is placed (see order.service), so cancelling
// hands it back; reactivating a cancelled order would have to take it again,
// which isn't allowed, so it's blocked instead.
async function restoreStock(tx, items) {
  for (const item of items) {
    const product = await tx.product.findUnique({ where: { id: item.productId }, select: { trackStock: true } });
    if (!product?.trackStock) continue;

    if (item.variantId) {
      await tx.productVariant.update({ where: { id: item.variantId }, data: { stock: { increment: item.quantity } } });
    } else {
      await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
    }
  }
}

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) throw ApiError.badRequest('Statut invalide.');

  const order = await prisma.$transaction(async (tx) => {
    const existing = await tx.order.findUnique({ where: { id: req.params.id }, include: { items: true } });
    if (!existing) throw ApiError.notFound('Commande introuvable.');

    if (existing.status === 'CANCELLED' && status !== 'CANCELLED') {
      throw ApiError.badRequest('Une commande annulée ne peut pas être réactivée.');
    }
    if (status === 'CANCELLED' && existing.status !== 'CANCELLED') {
      await restoreStock(tx, existing.items);
    }

    return tx.order.update({
      where: { id: existing.id },
      data: { status },
      include: { items: true },
    });
  });

  res.json({ success: true, data: order });
});

module.exports = { listOrders, getOrder, updateOrderStatus, VALID_STATUSES };
