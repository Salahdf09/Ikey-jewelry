const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const publicProductInclude = {
  category: { select: { id: true, name: true, slug: true } },
  images: { orderBy: { position: 'asc' } },
  variants: { where: { isActive: true }, orderBy: { createdAt: 'asc' } },
};

const listProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(48, Math.max(1, Number(req.query.limit) || 12));
  const { category, q, featured, isNew } = req.query;

  const where = {
    isActive: true,
    ...(category ? { category: { slug: category } } : {}),
    ...(featured === 'true' ? { isFeatured: true } : {}),
    ...(isNew === 'true' ? { isNew: true } : {}),
    ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: publicProductInclude,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    success: true,
    data: { items, total, page, limit, totalPages: Math.ceil(total / limit) || 1 },
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;

  const product = await prisma.product.findFirst({
    where: { isActive: true, OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    include: publicProductInclude,
  });

  if (!product) throw ApiError.notFound('Produit introuvable.');

  res.json({ success: true, data: product });
});

module.exports = { listProducts, getProduct };
