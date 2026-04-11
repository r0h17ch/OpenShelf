const { PrismaClient } = require('@prisma/client');
const { supabaseAdmin } = require('../config/supabaseClient');
const { AppError } = require('./errorHandler');

const prisma = new PrismaClient();

async function authenticate(req, _res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Authentication required. Please provide a valid token.', 401);
        }

        const token = authHeader.split(' ')[1];
        const { data, error } = await supabaseAdmin.auth.getUser(token);

        if (error || !data?.user) {
            throw new AppError('Invalid or expired token.', 401);
        }

        req.user = data.user;
        next();
    } catch (err) {
        if (err instanceof AppError) return next(err);
        next(new AppError('Invalid or expired token.', 401));
    }
}

async function requireAdmin(req, _res, next) {
    try {
        if (!req.user?.id) {
            return next(new AppError('Authentication required.', 401));
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { role: true },
        });

        if (!user || user.role !== 'ADMIN') {
            return next(new AppError('Admin access required.', 403));
        }

        next();
    } catch (err) {
        next(err);
    }
}

module.exports = { authenticate, requireAdmin };
