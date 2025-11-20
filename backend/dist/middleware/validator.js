"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
function validate(schema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (err) {
            return res.status(400).json({
                error: "Dados inválidos",
                details: err.errors
            });
        }
    };
}
