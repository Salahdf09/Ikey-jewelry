const router = require('express').Router();
const { listDeliveryFees } = require('../controllers/delivery.controller');

router.get('/', listDeliveryFees);

module.exports = router;
