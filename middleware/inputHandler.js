const { body } = require('express-validator');

const userCreationValidator = [
    body('userName')
        .isString().withMessage('Username must be a string.')
        .notEmpty().withMessage('Username is required.')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.'),
        
    body('password')
        .isString().withMessage('Password must be a string.')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),

    body('fullName')
        .isString().withMessage('Full name must be a string.')
        .notEmpty().withMessage('Full name is required.'),

    body('email')
        .optional()
        .isEmail().withMessage('Invalid email format.'),

    body('phoneNumber')
        .isString().withMessage('Phone number must be a string.')
        .notEmpty().withMessage('Phone number is required.')
        .isMobilePhone().withMessage('Invalid phone number format.'),

    body('address')
        .optional()
        .isString().withMessage('Address must be a string.'),

    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean.'),

    body('isLocked')
        .optional()
        .isBoolean().withMessage('isLocked must be a boolean.'),

    body('lastLogin')
        .optional()
        .isISO8601().withMessage('lastLogin must be a valid ISO 8601 date.'),
];
module.exports = { userCreationValidator };