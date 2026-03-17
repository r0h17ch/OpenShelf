const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Create a transaction record.
 */
async function createTransaction(data) {
    return prisma.transaction.create({ data });
}

/**
 * Get transactions for a specific user.
 */
async function getUserTransactions(userId) {
    return prisma.transaction.findMany({
        where: { userId },
        include: { book: { select: { id: true, title: true, author: true, isbn: true } } },
        orderBy: { createdAt: 'desc' },
    });
}

/**
 * Get all transactions (admin).
 */
async function getAllTransactions(query = {}) {
    const { type, page = 1, limit = 50 } = query;
    const where = {};
    if (type) where.type = type;

    const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
            where,
            include: {
                user: { select: { id: true, name: true, email: true } },
                book: { select: { id: true, title: true, author: true, isbn: true } },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.transaction.count({ where }),
    ]);

    return { transactions, total, page, limit };
}

/**
 * Get transaction stats (admin).
 */
async function getTransactionStats() {
    const [byType, totalAmount] = await Promise.all([
        prisma.transaction.groupBy({
            by: ['type'],
            _count: { id: true },
            _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
            where: { paymentStatus: 'COMPLETED' },
            _sum: { amount: true },
            _count: { id: true },
        }),
    ]);

    return {
        byType: byType.map(t => ({ type: t.type, count: t._count.id, totalAmount: t._sum.amount || 0 })),
        overall: { totalAmount: totalAmount._sum.amount || 0, count: totalAmount._count.id },
    };
}

module.exports = { createTransaction, getUserTransactions, getAllTransactions, getTransactionStats };
