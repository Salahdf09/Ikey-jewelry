const rateLimit = require('express-rate-limit');

// General API traffic
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

// Order creation — generous enough for real shoppers, tight enough to blunt spam/bots
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Trop de commandes envoyées. Merci de réessayer plus tard.' },
});

// Admin login — slow down brute-force attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Trop de tentatives. Merci de réessayer plus tard.' },
});

module.exports = { apiLimiter, orderLimiter, loginLimiter };
