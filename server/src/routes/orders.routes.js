const router = require('express').Router();
const { createOrder, getOrderByNumber } = require('../controllers/orders.controller');
const { createOrderValidator } = require('../validators/order.validator');
const validate = require('../middleware/validate.middleware');
const { orderLimiter } = require('../middleware/rateLimit.middleware');

router.post('/', orderLimiter, createOrderValidator, validate, createOrder);
router.get('/:orderNumber', getOrderByNumber);

module.exports = router;
