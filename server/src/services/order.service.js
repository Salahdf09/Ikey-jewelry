const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const { deliveryFeeForWilaya } = require('../utils/wilayas');

async function nextOrderNumber(tx) {
  const year = new Date().getFullYear();
  const key = `order-${year}`;

  const counter = await tx.counter.upsert({
    where: { id: key },
    update: { value: { increment: 1 } },
    create: { id: key, value: 1 },
  });

  return `ORD-${year}-${String(counter.value).padStart(6, '0')}`;
}

// Re-prices and validates the cart server-side — the client's prices/totals
// are never trusted. Throws ApiError for anything invalid (missing product,
// disabled product, out of stock, unknown variant, empty cart).
async function createOrder(input) {
  const { customerName, phone, email, wilaya, commune, address, note, items } = input;
  const deliveryType = input.deliveryType || 'domicile';
  const deliverySpeed = input.deliverySpeed || 'express';

  if (!Array.isArray(items) || items.length === 0) {
    throw ApiError.badRequest('Le panier est vide.');
  }

  const order = await prisma.$transaction(async (tx) => {
    let subtotal = 0;
    const orderItemsData = [];

    for (const line of items) {
      const product = await tx.product.findUnique({
        where: { id: line.productId },
        include: { variants: true },
      });

      if (!product || !product.isActive) {
        throw ApiError.badRequest(`Un des produits de ta commande n'est plus disponible.`);
      }

      let variant = null;
      if (line.variantId) {
        variant = product.variants.find((v) => v.id === line.variantId && v.isActive);
        if (!variant) {
          throw ApiError.badRequest(`L'option choisie pour "${product.name}" n'est plus disponible.`);
        }
      }

      const quantity = Number(line.quantity) || 0;
      if (quantity < 1) {
        throw ApiError.badRequest('La quantité doit être au moins 1.');
      }

      if (product.trackStock) {
        const availableStock = variant ? variant.stock : product.stock;
        if (availableStock < quantity) {
          throw ApiError.badRequest(`Stock insuffisant pour "${product.name}".`);
        }
      }

      const unitPrice = product.price + (variant ? variant.priceDelta : 0);
      const lineTotal = unitPrice * quantity;
      subtotal += lineTotal;

      orderItemsData.push({
        productId: product.id,
        variantId: variant ? variant.id : null,
        productName: product.name,
        variantName: variant ? variant.name : null,
        unitPrice,
        quantity,
        total: lineTotal,
      });

      if (product.trackStock) {
        if (variant) {
          await tx.productVariant.update({ where: { id: variant.id }, data: { stock: { decrement: quantity } } });
        } else {
          await tx.product.update({ where: { id: product.id }, data: { stock: { decrement: quantity } } });
        }
      }
    }

    const deliveryFee = deliveryFeeForWilaya(wilaya, deliveryType, deliverySpeed);
    const total = subtotal + deliveryFee;
    const orderNumber = await nextOrderNumber(tx);

    const created = await tx.order.create({
      data: {
        orderNumber,
        customerName,
        phone,
        email: email || null,
        wilaya,
        commune,
        address,
        note: note || null,
        deliveryType,
        deliverySpeed,
        subtotal,
        deliveryFee,
        total,
        items: { create: orderItemsData },
      },
      include: { items: true },
    });

    return created;
  });

  return order;
}

async function getOrderByNumber(orderNumber) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
}

module.exports = { createOrder, getOrderByNumber };
