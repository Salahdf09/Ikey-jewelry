const { waitUntil } = require('@vercel/functions');
const orderService = require('../services/order.service');
const emailService = require('../services/email.service');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.body);

  // Never let a slow/broken SMTP server delay the customer's response.
  // waitUntil keeps a serverless function (Vercel) alive until the email is
  // sent — otherwise it's frozen right after the response. No-op elsewhere.
  waitUntil(emailService.sendNewOrderEmail(order));

  res.status(201).json({ success: true, data: order });
});

// Used by the order-success page — looked up by the unguessable order
// number only, no customer-listing endpoint is exposed publicly.
const getOrderByNumber = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderByNumber(req.params.orderNumber);
  if (!order) throw ApiError.notFound('Commande introuvable.');
  res.json({ success: true, data: order });
});

module.exports = { createOrder, getOrderByNumber };
