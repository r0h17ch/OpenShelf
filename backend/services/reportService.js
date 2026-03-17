const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getLibraryStats() {
    const [totalBooks, totalUsers, totalAdmins, activeBorrows, overdueCount, fineStats] = await Promise.all([
        prisma.book.count(),
        prisma.user.count({ where: { role: 'USER' } }),
        prisma.user.count({ where: { role: 'ADMIN' } }),
        prisma.circulation.count({ where: { type: 'BORROW', returnDate: null } }),
        prisma.circulation.count({
            where: { type: 'BORROW', returnDate: null, dueDate: { lt: new Date() } },
        }),
        prisma.fine.aggregate({
            _sum: { amount: true },
            _count: { id: true },
        }),
    ]);

    const paidFines = await prisma.fine.aggregate({
        where: { isPaid: true },
        _sum: { amount: true },
    });

    const unpaidFines = await prisma.fine.aggregate({
        where: { isPaid: false },
        _sum: { amount: true },
    });

    const availableBooks = await prisma.book.count({ where: { status: 'AVAILABLE' } });

    return {
        books: { total: totalBooks, available: availableBooks, borrowed: totalBooks - availableBooks },
        users: { total: totalUsers, admins: totalAdmins },
        borrows: { active: activeBorrows, overdue: overdueCount },
        fines: {
            totalFines: fineStats._sum.amount || 0,
            paidFines: paidFines._sum.amount || 0,
            unpaidFines: unpaidFines._sum.amount || 0,
        },
    };
}

async function getBorrowingReport(period = 'monthly') {
    // Use raw SQL for date-based grouping as Prisma doesn't natively support it
    let dateExpr;
    switch (period) {
        case 'daily':
            dateExpr = `DATE("borrowDate")`;
            break;
        case 'weekly':
            dateExpr = `DATE_TRUNC('week', "borrowDate")`;
            break;
        case 'monthly':
        default:
            dateExpr = `DATE_TRUNC('month', "borrowDate")`;
    }

    const trends = await prisma.$queryRawUnsafe(`
        SELECT ${dateExpr} as period,
               COUNT(*) as count,
               SUM(CASE WHEN "returnDate" IS NOT NULL THEN 1 ELSE 0 END) as returned,
               SUM(CASE WHEN "returnDate" IS NULL AND "dueDate" < NOW() THEN 1 ELSE 0 END) as overdue
        FROM circulations
        WHERE type = 'BORROW'
        GROUP BY period
        ORDER BY period DESC
        LIMIT 12
    `);

    return { period, trends: trends.map(t => ({
        period: t.period,
        count: Number(t.count),
        returned: Number(t.returned),
        overdue: Number(t.overdue),
    })) };
}

async function getPopularBooksReport(limit = 10) {
    const popular = await prisma.circulation.groupBy({
        by: ['bookId'],
        where: { type: 'BORROW' },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: limit,
    });

    const bookIds = popular.map(p => p.bookId);
    const books = await prisma.book.findMany({
        where: { id: { in: bookIds } },
        select: { id: true, title: true, author: true, isbn: true, genre: true },
    });

    const bookMap = {};
    books.forEach(b => { bookMap[b.id] = b; });

    return popular.map(p => ({
        book: bookMap[p.bookId],
        borrowCount: p._count.id,
    }));
}

async function getUserActivityReport() {
    // Active users (distinct borrowers)
    const activeUsers = await prisma.circulation.findMany({
        where: { type: 'BORROW' },
        select: { userId: true },
        distinct: ['userId'],
    });

    // Top borrowers
    const topBorrowers = await prisma.circulation.groupBy({
        by: ['userId'],
        where: { type: 'BORROW' },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
    });

    const userIds = topBorrowers.map(t => t.userId);
    const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, email: true },
    });
    const userMap = {};
    users.forEach(u => { userMap[u.id] = u; });

    return {
        activeUsersCount: activeUsers.length,
        topBorrowers: topBorrowers.map(t => ({
            user: userMap[t.userId],
            borrowCount: t._count.id,
        })),
    };
}

async function getFinancialReport(startDate, endDate) {
    const dateFilter = {};
    if (startDate || endDate) {
        dateFilter.createdAt = {};
        if (startDate) dateFilter.createdAt.gte = new Date(startDate);
        if (endDate) dateFilter.createdAt.lte = new Date(endDate);
    }

    const [fineRevenue, pendingFines] = await Promise.all([
        prisma.transaction.aggregate({
            where: { ...dateFilter, type: 'FINE_PAYMENT', paymentStatus: 'COMPLETED' },
            _sum: { amount: true },
            _count: { id: true },
        }),
        prisma.fine.aggregate({
            where: { isPaid: false },
            _sum: { amount: true },
            _count: { id: true },
        }),
    ]);

    return {
        fineRevenue: { total: fineRevenue._sum.amount || 0, count: fineRevenue._count.id },
        pendingFines: { total: pendingFines._sum.amount || 0, count: pendingFines._count.id },
    };
}

async function getOverdueReport() {
    const overdueCirculations = await prisma.circulation.findMany({
        where: { type: 'BORROW', returnDate: null, dueDate: { lt: new Date() } },
        include: {
            book: { select: { id: true, title: true, author: true, isbn: true } },
            user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { dueDate: 'asc' },
    });

    return { count: overdueCirculations.length, overdueBooks: overdueCirculations };
}

async function getCategoryReport() {
    const booksByGenre = await prisma.book.groupBy({
        by: ['genre'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
    });

    return {
        booksByGenre: booksByGenre.map(g => ({
            genre: g.genre || 'Uncategorized',
            count: g._count.id,
        })),
    };
}

module.exports = {
    getLibraryStats, getBorrowingReport, getPopularBooksReport,
    getUserActivityReport, getFinancialReport, getOverdueReport, getCategoryReport,
};
