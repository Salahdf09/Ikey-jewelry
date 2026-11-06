const { body } = require('express-validator');

const loginValidator = [
  body('email').trim().notEmpty().isEmail().withMessage('Email invalide.'),
  body('password').notEmpty().withMessage('Mot de passe requis.'),
];

module.exports = { loginValidator };
