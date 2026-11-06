const { body } = require('express-validator');
const { WILAYAS, DELIVERY_TYPES, DELIVERY_SPEEDS } = require('../utils/wilayas');

const createOrderValidator = [
  body('customerName').trim().notEmpty().withMessage('Le nom complet est requis.').isLength({ max: 120 }),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Le numéro de téléphone est requis.')
    .matches(/^(0)(5|6|7)[0-9]{8}$/)
    .withMessage('Numéro de téléphone algérien invalide.'),
  body('email').optional({ values: 'falsy' }).trim().isEmail().withMessage('Email invalide.'),
  body('wilaya')
    .trim()
    .notEmpty()
    .withMessage('La wilaya est requise.')
    .custom((value) => WILAYAS.includes(value))
    .withMessage('Wilaya invalide.'),
  body('commune').trim().notEmpty().withMessage('La commune est requise.').isLength({ max: 120 }),
  body('deliveryType').optional().trim().isIn(DELIVERY_TYPES).withMessage('Mode de livraison invalide.'),
  body('deliverySpeed').optional().trim().isIn(DELIVERY_SPEEDS).withMessage('Vitesse de livraison invalide.'),
  body('address').trim().notEmpty().withMessage("L'adresse de livraison est requise.").isLength({ max: 500 }),
  body('note').optional({ values: 'falsy' }).trim().isLength({ max: 500 }),
  body('items').isArray({ min: 1 }).withMessage('Le panier ne peut pas être vide.'),
  body('items.*.productId').isString().notEmpty().withMessage('Produit invalide.'),
  body('items.*.variantId').optional({ values: 'falsy' }).isString(),
  body('items.*.quantity').isInt({ min: 1, max: 50 }).withMessage('Quantité invalide.'),
];

module.exports = { createOrderValidator };
