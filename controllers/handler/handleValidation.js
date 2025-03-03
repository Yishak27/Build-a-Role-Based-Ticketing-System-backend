const { validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(201).json({
            message: 'Validation Error',
            errors: errors.array()
        });
    }
    next();
};

module.exports = { handleValidation };