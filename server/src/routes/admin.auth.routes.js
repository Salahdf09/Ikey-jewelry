const router = require('express').Router();
const { login, logout, me } = require('../controllers/admin.auth.controller');
const { loginValidator } = require('../validators/auth.validator');
const validate = require('../middleware/validate.middleware');
const { loginLimiter } = require('../middleware/rateLimit.middleware');
const { requireAdmin } = require('../middleware/auth.middleware');

router.post('/login', loginLimiter, loginValidator, validate, login);
router.post('/logout', logout);
router.get('/me', requireAdmin, me);

module.exports = router;
