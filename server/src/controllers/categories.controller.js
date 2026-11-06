const prisma = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

const listCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { position: 'asc' },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });

  res.json({
    success: true,
    data: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      productCount: c._count.products,
    })),
  });
});

module.exports = { listCategories };
