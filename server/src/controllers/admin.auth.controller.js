const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const cookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.cookieSameSite,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } });

  // Same generic error whether the email exists or the password is wrong —
  // never reveal which one failed.
  const genericError = () => ApiError.unauthorized('Email ou mot de passe incorrect.');

  if (!admin) throw genericError();

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) throw genericError();

  const token = jwt.sign({ sub: admin.id }, env.jwtSecret, { expiresIn: '7d' });
  res.cookie(env.cookieName, token, cookieOptions);

  res.json({ success: true, data: { id: admin.id, name: admin.name, email: admin.email } });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie(env.cookieName, { ...cookieOptions, maxAge: undefined });
  res.json({ success: true, data: null });
});

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.admin });
});

module.exports = { login, logout, me };
