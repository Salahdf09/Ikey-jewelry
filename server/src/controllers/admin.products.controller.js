const slugify = require('slugify');
const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const adminInclude = {
  category: { select: { id: true, name: true, slug: true } },
  images: { orderBy: { position: 'asc' } },
  variants: { orderBy: { createdAt: 'asc' } },
};

async function uniqueSlug(name, ignoreId) {
  const base = slugify(name, { lower: true, strict: true, locale: 'fr' }) || 'produit';
  let slug = base;
  let i = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    i += 1;
    slug = `${base}-${i}`;
  }
}

const listProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const { q, category, status } = req.query;

  const where = {
    ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}),
    ...(category ? { categoryId: category } : {}),
    ...(status === 'active' ? { isActive: true } : {}),
    ...(status === 'inactive' ? { isActive: false } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: adminInclude,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  res.json({ success: true, data: { items, total, page, limit, totalPages: Math.ceil(total / limit) || 1 } });
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: adminInclude });
  if (!product) throw ApiError.notFound('Produit introuvable.');
  res.json({ success: true, data: product });
});

const createProduct = asyncHandler(async (req, res) => {
  const body = req.body;

  const category = await prisma.category.findUnique({ where: { id: body.categoryId } });
  if (!category) throw ApiError.badRequest('Catégorie invalide.');

  const slug = await uniqueSlug(body.name);

  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug,
      description: body.description,
      price: body.price,
      compareAtPrice: body.compareAtPrice || null,
      stock: body.stock ?? 0,
      trackStock: body.trackStock ?? true,
      isActive: body.isActive ?? true,
      isFeatured: body.isFeatured ?? false,
      isNew: body.isNew ?? false,
      categoryId: body.categoryId,
      images: body.images?.length
        ? { create: body.images.map((img, i) => ({ url: img.url, position: img.position ?? i })) }
        : undefined,
      variants: body.variants?.length
        ? {
            create: body.variants.map((v) => ({
              name: v.name,
              priceDelta: v.priceDelta ?? 0,
              stock: v.stock ?? 0,
              isActive: v.isActive ?? true,
            })),
          }
        : undefined,
    },
    include: adminInclude,
  });

  res.status(201).json({ success: true, data: product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Produit introuvable.');

  if (body.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: body.categoryId } });
    if (!category) throw ApiError.badRequest('Catégorie invalide.');
  }

  const slug = body.name && body.name !== existing.name ? await uniqueSlug(body.name, id) : undefined;

  const product = await prisma.$transaction(async (tx) => {
    if (body.images) {
      await tx.productImage.deleteMany({ where: { productId: id } });
    }

    // Variants are edited in place so their ids stay stable: a customer's cart
    // and past orders reference them by id.
    if (body.variants) {
      const keepIds = body.variants.map((v) => v.id).filter(Boolean);
      await tx.productVariant.deleteMany({ where: { productId: id, id: { notIn: keepIds } } });

      for (const v of body.variants) {
        const data = {
          name: v.name,
          priceDelta: v.priceDelta ?? 0,
          stock: v.stock ?? 0,
          isActive: v.isActive ?? true,
        };
        if (v.id) {
          await tx.productVariant.updateMany({ where: { id: v.id, productId: id }, data });
        } else {
          await tx.productVariant.create({ data: { ...data, productId: id } });
        }
      }
    }

    return tx.product.update({
      where: { id },
      data: {
        ...(body.name ? { name: body.name } : {}),
        ...(slug ? { slug } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.price !== undefined ? { price: body.price } : {}),
        ...(body.compareAtPrice !== undefined ? { compareAtPrice: body.compareAtPrice || null } : {}),
        ...(body.stock !== undefined ? { stock: body.stock } : {}),
        ...(body.trackStock !== undefined ? { trackStock: body.trackStock } : {}),
        ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
        ...(body.isFeatured !== undefined ? { isFeatured: body.isFeatured } : {}),
        ...(body.isNew !== undefined ? { isNew: body.isNew } : {}),
        ...(body.categoryId ? { categoryId: body.categoryId } : {}),
        ...(body.images
          ? { images: { create: body.images.map((img, i) => ({ url: img.url, position: img.position ?? i })) } }
          : {}),
      },
      include: adminInclude,
    });
  });

  res.json({ success: true, data: product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Produit introuvable.');

  try {
    await prisma.product.delete({ where: { id } });
  } catch (err) {
    if (err.code === 'P2003') {
      throw ApiError.conflict(
        'Ce produit a des commandes associées et ne peut pas être supprimé — désactive-le à la place.'
      );
    }
    throw err;
  }

  res.json({ success: true, data: null });
});

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
