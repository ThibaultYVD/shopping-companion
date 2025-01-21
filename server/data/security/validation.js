const { body, validationResult } = require('express-validator');

function escapeData(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    } catch (error) {
        console.error(error)
    }
}
const validate = {
    escapeData
}
module.exports = validate