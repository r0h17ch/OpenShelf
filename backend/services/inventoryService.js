const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middlewares/errorHandler');

const prisma = new PrismaClient();

async function createInventoryIssue(reportedById, data) {
    const { bookId, status, note } = data;

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new AppError('Book not found.', 404);

    if (!['MISSING', 'STOLEN'].includes(status)) {
        throw new AppError('Status must be MISSING or STOLEN.', 400);
    }

    const issue = await prisma.inventoryIssue.create({
        data: { bookId, status, note: note || '', reportedById },
        include: {
            book: { select: { id: true, title: true, isbn: true, author: true } },
            reportedBy: { select: { id: true, name: true, email: true } },
        },
    });

    return issue;
}

async function listInventoryIssues(query = {}) {
    const { status, active } = query;
    const where = {};
    if (status && ['MISSING', 'STOLEN'].includes(status)) where.status = status;
    if (active === 'true') where.resolved = false;
    if (active === 'false') where.resolved = true;

    return prisma.inventoryIssue.findMany({
        where,
        include: {
            book: { select: { id: true, title: true, isbn: true, author: true } },
            reportedBy: { select: { id: true, name: true, email: true } },
            resolvedBy: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
    });
}

async function resolveInventoryIssue(id, resolvedById) {
    const issue = await prisma.inventoryIssue.findUnique({ where: { id } });
    if (!issue) throw new AppError('Issue not found.', 404);
    if (issue.resolved) throw new AppError('Issue already resolved.', 400);

    return prisma.inventoryIssue.update({
        where: { id },
        data: { resolved: true, resolvedAt: new Date(), resolvedById },
    });
}

module.exports = { createInventoryIssue, listInventoryIssues, resolveInventoryIssue };
