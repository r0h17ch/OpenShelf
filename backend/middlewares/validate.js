const { z } = require('zod');
const { AppError } = require('./errorHandler');

/**
 * Middleware factory that takes a Zod schema and validates the request body.
 */
function validateBody(schema) {
    return (req, res, next) => {
        try {
            // Strip unknown properties out or enforce STRICT validation
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Map the error into a readable structure
                const errors = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
                return next(new AppError(`Validation Error: ${errors}`, 400));
            }
            next(error);
        }
    };
}

module.exports = { validateBody, z };
