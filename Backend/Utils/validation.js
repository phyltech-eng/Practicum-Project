const { body, validationResult } = require('express-validator');

// Reusable validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  };
};

// Validation rules
const registrationValidationRules = [
  body('username')
    .trim()
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
    .isAlphanumeric().withMessage('Username must contain only letters and numbers'),
  
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('Password must include uppercase, lowercase, number, and special character')
];

const clubCreationValidationRules = [
  body('name')
    .trim()
    .isLength({ min: 3 }).withMessage('Club name must be at least 3 characters long')
    .matches(/^[a-zA-Z0-9 ]+$/).withMessage('Club name can only contain letters, numbers, and spaces'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
];

module.exports = {
  validate,
  registrationValidationRules,
  clubCreationValidationRules
};
