const router = require('express').Router();

router.use('/products', require('./products.routes'));
router.use('/categories', require('./categories.routes'));
router.use('/orders', require('./orders.routes'));
router.use('/delivery-fees', require('./delivery.routes'));

router.use('/admin', require('./admin.auth.routes'));
router.use('/admin/products', require('./admin.products.routes'));
router.use('/admin/orders', require('./admin.orders.routes'));
router.use('/admin/dashboard', require('./admin.dashboard.routes'));
router.use('/admin/upload', require('./upload.routes'));

module.exports = router;
