// validation.js
const { body, validationResult } = require('express-validator');

const signupValidationRules = () => [
  body('stateName').notEmpty().withMessage('State name is required'),
  body('officialEmail').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('contactName').notEmpty().withMessage('Contact name is required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
];

const loginValidationRules = () => [
  body('officialEmail').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  return res.status(422).json({ errors: errors.array() });
};

module.exports = {
  signupValidationRules,
  loginValidationRules,
  validate,
};
