const { body, validationResult } = require('express-validator/check');

var emptyString = function(value, { req }) {
  return value;
};

module.exports = [
  body('username')
    .custom(emptyString)
    .withMessage('Username Cannot be Empty')
    .isLength({
      min: 6,
      max: 50
    })
    .withMessage('Username Must be between 6 and 50 Characters Inclusive'),
  body('password')
    .custom(emptyString)
    .withMessage('Password Cannot be Empty')
    .isLength({
      min: 8,
      max: 100
    })
    .withMessage('Password Must be between 8 and 100 Characters Inclusive')
];
