const router = require('express').Router();
const { getStats } = require('../controllers/admin.dashboard.controller');
const { requireAdmin } = require('../middleware/auth.middleware');

router.use(requireAdmin);
router.get('/stats', getStats);

module.exports = router;
