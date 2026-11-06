const router = require('express').Router();
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/admin.products.controller');
const { productValidator, productUpdateValidator } = require('../validators/product.validator');
const validate = require('../middleware/validate.middleware');
const { requireAdmin } = require('../middleware/auth.middleware');

router.use(requireAdmin);

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', productValidator, validate, createProduct);
router.put('/:id', productUpdateValidator, validate, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
