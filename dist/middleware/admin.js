"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = admin;
function admin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: 'Não autenticado.' });
    }
    if (req.user.role !== 'admin') {
        return res
            .status(403)
            .json({ error: 'Acesso negado. Apenas administradores.' });
    }
    return next();
}
