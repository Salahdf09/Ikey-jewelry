const router = require('express').Router();
const { listOrders, getOrder, updateOrderStatus } = require('../controllers/admin.orders.controller');
const { requireAdmin } = require('../middleware/auth.middleware');

router.use(requireAdmin);

router.get('/', listOrders);
router.get('/:id', getOrder);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;
