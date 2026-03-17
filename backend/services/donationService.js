const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middlewares/errorHandler');

const prisma = new PrismaClient();

async function createDonationRequest(userId, data) {
    return prisma.bookDonation.create({
        data: { userId, ...data },
        include: { user: { select: { id: true, name: true, email: true } } },
    });
}

async function getUserDonations(userId) {
    return prisma.bookDonation.findMany({
        where: { userId },
        include: { donatedBook: { select: { id: true, title: true } } },
        orderBy: { createdAt: 'desc' },
    });
}

async function getUserDonationById(userId, id) {
    const donation = await prisma.bookDonation.findUnique({
        where: { id },
        include: {
            user: { select: { id: true, name: true, email: true } },
            donatedBook: true,
        },
    });
    if (!donation) throw new AppError('Donation not found.', 404);
    if (donation.userId !== userId) throw new AppError('Access denied.', 403);
    return donation;
}

async function getAllDonations(query = {}) {
    const { status, page = 1, limit = 50 } = query;
    const where = {};
    if (status) where.status = status;

    const [donations, total] = await Promise.all([
        prisma.bookDonation.findMany({
            where,
            include: { user: { select: { id: true, name: true, email: true } } },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.bookDonation.count({ where }),
    ]);

    return { donations, total, page, limit };
}

async function getDonationStats() {
    const stats = await prisma.bookDonation.groupBy({
        by: ['status'],
        _count: { id: true },
    });
    return stats.map(s => ({ status: s.status, count: s._count.id }));
}

async function getDonationById(id) {
    const donation = await prisma.bookDonation.findUnique({
        where: { id },
        include: {
            user: { select: { id: true, name: true, email: true } },
            processedBy: { select: { id: true, name: true } },
            donatedBook: true,
        },
    });
    if (!donation) throw new AppError('Donation not found.', 404);
    return donation;
}

async function approveDonation(id, adminId) {
    const donation = await prisma.bookDonation.findUnique({ where: { id } });
    if (!donation) throw new AppError('Donation not found.', 404);
    if (donation.status !== 'PENDING') throw new AppError('Only pending donations can be approved.', 400);

    return prisma.bookDonation.update({
        where: { id },
        data: { status: 'APPROVED', processedById: adminId, processedAt: new Date() },
    });
}

async function rejectDonation(id, adminId, adminNotes) {
    const donation = await prisma.bookDonation.findUnique({ where: { id } });
    if (!donation) throw new AppError('Donation not found.', 404);
    if (donation.status !== 'PENDING') throw new AppError('Only pending donations can be rejected.', 400);

    return prisma.bookDonation.update({
        where: { id },
        data: { status: 'REJECTED', processedById: adminId, processedAt: new Date(), adminNotes },
    });
}

async function completeDonation(id, adminId) {
    const donation = await prisma.bookDonation.findUnique({ where: { id } });
    if (!donation) throw new AppError('Donation not found.', 404);
    if (donation.status !== 'APPROVED') throw new AppError('Only approved donations can be completed.', 400);

    // Create the book in inventory
    const book = await prisma.book.create({
        data: {
            isbn: donation.isbn || `DON-${Date.now()}`,
            title: donation.title,
            author: donation.author,
            genre: donation.genre,
            year: donation.publicationYear,
            description: donation.description,
            physicalCount: 1,
            status: 'AVAILABLE',
        },
    });

    return prisma.bookDonation.update({
        where: { id },
        data: { status: 'COMPLETED', donatedBookId: book.id, processedById: adminId, processedAt: new Date() },
        include: { donatedBook: true },
    });
}

module.exports = {
    createDonationRequest, getUserDonations, getUserDonationById,
    getAllDonations, getDonationStats, getDonationById,
    approveDonation, rejectDonation, completeDonation,
};
