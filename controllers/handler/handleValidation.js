const { validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    let errorMessage = {};  
    if (!errors.isEmpty()) {
        errors.errors.forEach(error => {
            errorMessage = error.msg
        });
        return res.status(201).json({
            status:"failed",
            message: errorMessage
        });
    }
    next();
};

module.exports = { handleValidation };