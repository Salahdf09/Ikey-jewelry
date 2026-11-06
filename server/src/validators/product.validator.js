const { body } = require('express-validator');

const productValidator = [
  body('name').trim().notEmpty().withMessage('Le nom est requis.').isLength({ max: 150 }),
  body('description').trim().notEmpty().withMessage('La description est requise.'),
  body('price').isInt({ min: 0 }).withMessage('Le prix doit être un nombre positif.'),
  body('compareAtPrice').optional({ values: 'falsy' }).isInt({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('trackStock').optional().isBoolean(),
  body('isActive').optional().isBoolean(),
  body('isFeatured').optional().isBoolean(),
  body('isNew').optional().isBoolean(),
  body('categoryId').trim().notEmpty().withMessage('La catégorie est requise.'),
  body('images').optional().isArray(),
  body('images.*.url').optional().isString().notEmpty(),
  body('variants').optional().isArray(),
  body('variants.*.name').optional().isString().notEmpty(),
  body('variants.*.priceDelta').optional().isInt(),
  body('variants.*.stock').optional().isInt({ min: 0 }),
];

// Updates are partial (the active toggle sends only `isActive`), so every
// field is optional here but still checked when present.
const productUpdateValidator = [
  body('name').optional().trim().notEmpty().withMessage('Le nom est requis.').isLength({ max: 150 }),
  body('description').optional().trim().notEmpty().withMessage('La description est requise.'),
  body('price').optional().isInt({ min: 0 }).withMessage('Le prix doit être un nombre positif.'),
  body('compareAtPrice').optional({ values: 'falsy' }).isInt({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('trackStock').optional().isBoolean(),
  body('isActive').optional().isBoolean(),
  body('isFeatured').optional().isBoolean(),
  body('isNew').optional().isBoolean(),
  body('categoryId').optional().trim().notEmpty(),
  body('images').optional().isArray(),
  body('images.*.url').optional().isString().notEmpty(),
  body('variants').optional().isArray(),
  body('variants.*.id').optional().isString(),
  body('variants.*.name').optional().isString().notEmpty(),
  body('variants.*.priceDelta').optional().isInt(),
  body('variants.*.stock').optional().isInt({ min: 0 }),
];

module.exports = { productValidator, productUpdateValidator };
