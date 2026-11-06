const jwt = require('jsonwebtoken');
const env = require('../config/env');
const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Verifies the admin session cookie and attaches `req.admin`. Applied to
// every admin API route except /admin/login.
const requireAdmin = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.[env.cookieName];
  if (!token) throw ApiError.unauthorized();

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw ApiError.unauthorized();
  }

  const admin = await prisma.adminUser.findUnique({ where: { id: payload.sub } });
  if (!admin) throw ApiError.unauthorized();

  req.admin = { id: admin.id, name: admin.name, email: admin.email };
  next();
});

module.exports = { requireAdmin };
