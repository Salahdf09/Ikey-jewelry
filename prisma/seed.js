const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../server/.env') });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: 'Colliers', slug: 'colliers', position: 1 },
  { name: 'Bagues', slug: 'bagues', position: 2 },
  { name: 'Bracelets', slug: 'bracelets', position: 3 },
  { name: "Boucles d'oreilles", slug: 'boucles-oreilles', position: 4 },
];

const FINISHES = [
  { name: 'Plaqué or', priceDelta: 0 },
  { name: 'Argent', priceDelta: -300 },
];

const PRODUCTS = [
  {
    name: 'Collier Lune',
    slug: 'collier-lune',
    description:
      "Un croissant de lune délicat porté au bout d'une chaîne fine. Fait main, pensé pour se porter tous les jours. Un bijou qui accompagne les phases de ta vie avec douceur.",
    price: 3200,
    compareAtPrice: 3600,
    category: 'colliers',
    isFeatured: true,
    isNew: true,
    stock: 20,
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'],
    variants: FINISHES,
  },
  {
    name: 'Bague Perle',
    slug: 'bague-perle',
    description:
      "Une perle de culture posée sur un anneau fin et élégant. Simple, intemporelle, elle se superpose facilement à tes autres bagues préférées.",
    price: 2400,
    category: 'bagues',
    isFeatured: true,
    isNew: false,
    stock: 15,
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'],
    variants: FINISHES,
  },
  {
    name: 'Bracelet Fleur',
    slug: 'bracelet-fleur',
    description:
      "Une petite fleur ciselée à la main, montée sur une chaîne souple et légère. Le bijou parfait pour ajouter une touche florale à ton poignet.",
    price: 2800,
    category: 'bracelets',
    isFeatured: true,
    isNew: true,
    stock: 18,
    images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80'],
    variants: FINISHES,
  },
  {
    name: 'Boucles Étoile',
    slug: 'boucles-etoile',
    description:
      "Deux petites étoiles qui scintillent doucement à chaque mouvement. Légères à porter, elles illuminent le visage sans jamais en faire trop.",
    price: 2600,
    category: 'boucles-oreilles',
    isFeatured: false,
    isNew: true,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'],
    variants: FINISHES,
  },
  {
    name: 'Collier Cœur',
    slug: 'collier-coeur',
    description: "Un petit cœur suspendu, symbole discret de tendresse à porter contre soi au quotidien.",
    price: 3000,
    category: 'colliers',
    isFeatured: false,
    isNew: false,
    stock: 12,
    images: ['https://images.unsplash.com/photo-1599459183200-59c7687a0275?w=800&q=80'],
    variants: FINISHES,
  },
  {
    name: 'Bague Feuille',
    slug: 'bague-feuille',
    description: "Une feuille délicatement travaillée qui épouse le doigt. Un bijou organique et féminin.",
    price: 2200,
    category: 'bagues',
    isFeatured: false,
    isNew: false,
    stock: 0,
    images: ['https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&q=80'],
    variants: FINISHES,
  },
  {
    name: 'Bracelet Étoile Filante',
    slug: 'bracelet-etoile-filante',
    description: "Une fine chaîne ornée d'une étoile filante, à porter seule ou empilée avec tes autres bracelets.",
    price: 2900,
    compareAtPrice: 3300,
    category: 'bracelets',
    isFeatured: true,
    isNew: false,
    stock: 10,
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'],
    variants: FINISHES,
  },
  {
    name: 'Boucles Perle',
    slug: 'boucles-perle',
    description: "Des puces en perle de culture, discrètes et élégantes, pour un usage de tous les jours.",
    price: 2500,
    category: 'boucles-oreilles',
    isFeatured: false,
    isNew: false,
    stock: 22,
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'],
    variants: FINISHES,
  },
];

async function main() {
  console.log('Seeding database...');

  const categoryBySlug = {};
  for (const c of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, position: c.position },
      create: c,
    });
    categoryBySlug[c.slug] = category;
  }
  console.log(`Categories ready: ${CATEGORIES.length}`);

  for (const p of PRODUCTS) {
    const category = categoryBySlug[p.category];

    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) {
      console.log(`- skip existing product "${p.name}"`);
      continue;
    }

    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice || null,
        stock: p.stock,
        trackStock: true,
        isActive: true,
        isFeatured: !!p.isFeatured,
        isNew: !!p.isNew,
        categoryId: category.id,
        images: { create: p.images.map((url, i) => ({ url, position: i })) },
        variants: {
          create: p.variants.map((v) => ({ name: v.name, priceDelta: v.priceDelta, stock: p.stock })),
        },
      },
    });
    console.log(`- created product "${p.name}"`);
  }

  const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@ikey-store.com').toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
  const adminName = process.env.SEED_ADMIN_NAME || 'Admin ikey.';

  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.adminUser.create({
      data: { name: adminName, email: adminEmail, passwordHash },
    });
    console.log(`Admin account created: ${adminEmail} / ${adminPassword} (change this before production!)`);
  } else {
    console.log(`Admin account already exists: ${adminEmail}`);
  }

  console.log('Seed complete.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
