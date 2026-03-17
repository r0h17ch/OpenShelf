const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middlewares/errorHandler');

const prisma = new PrismaClient();

async function createSuggestion(userId, data) {
    return prisma.bookSuggestion.create({
        data: { suggestedById: userId, ...data },
        include: { suggestedBy: { select: { id: true, name: true, email: true } } },
    });
}

async function getAllSuggestions() {
    return prisma.bookSuggestion.findMany({
        include: {
            suggestedBy: { select: { id: true, name: true, email: true } },
            votes: { select: { userId: true } },
        },
        orderBy: { voteCount: 'desc' },
    });
}

async function getMySuggestions(userId) {
    return prisma.bookSuggestion.findMany({
        where: { suggestedById: userId },
        include: { votes: { select: { userId: true } } },
        orderBy: { createdAt: 'desc' },
    });
}

async function voteForSuggestion(userId, suggestionId) {
    const suggestion = await prisma.bookSuggestion.findUnique({ where: { id: suggestionId } });
    if (!suggestion) throw new AppError('Suggestion not found.', 404);

    // Check if already voted
    const existingVote = await prisma.suggestionVote.findUnique({
        where: { userId_suggestionId: { userId, suggestionId } },
    });

    if (existingVote) {
        // Unvote
        await prisma.suggestionVote.delete({ where: { id: existingVote.id } });
        await prisma.bookSuggestion.update({
            where: { id: suggestionId },
            data: { voteCount: { decrement: 1 } },
        });
        return { voted: false };
    }

    // Vote
    await prisma.suggestionVote.create({ data: { userId, suggestionId } });
    await prisma.bookSuggestion.update({
        where: { id: suggestionId },
        data: { voteCount: { increment: 1 } },
    });
    return { voted: true };
}

async function approveSuggestion(suggestionId, adminId, adminNotes) {
    const suggestion = await prisma.bookSuggestion.findUnique({ where: { id: suggestionId } });
    if (!suggestion) throw new AppError('Suggestion not found.', 404);
    if (suggestion.status !== 'PENDING') throw new AppError('Only pending suggestions can be approved.', 400);

    return prisma.bookSuggestion.update({
        where: { id: suggestionId },
        data: { status: 'APPROVED', approvedById: adminId, approvedAt: new Date(), adminNotes },
    });
}

async function rejectSuggestion(suggestionId, adminId, adminNotes) {
    const suggestion = await prisma.bookSuggestion.findUnique({ where: { id: suggestionId } });
    if (!suggestion) throw new AppError('Suggestion not found.', 404);
    if (suggestion.status !== 'PENDING') throw new AppError('Only pending suggestions can be rejected.', 400);

    return prisma.bookSuggestion.update({
        where: { id: suggestionId },
        data: { status: 'REJECTED', approvedById: adminId, rejectedAt: new Date(), adminNotes },
    });
}

async function deleteSuggestion(suggestionId) {
    const suggestion = await prisma.bookSuggestion.findUnique({ where: { id: suggestionId } });
    if (!suggestion) throw new AppError('Suggestion not found.', 404);

    // Delete votes first (foreign key)
    await prisma.suggestionVote.deleteMany({ where: { suggestionId } });
    return prisma.bookSuggestion.delete({ where: { id: suggestionId } });
}

async function getVotingStats() {
    const suggestions = await prisma.bookSuggestion.findMany({
        include: {
            suggestedBy: { select: { id: true, name: true } },
            _count: { select: { votes: true } },
        },
        orderBy: { voteCount: 'desc' },
        take: 20,
    });
    return suggestions;
}

module.exports = {
    createSuggestion, getAllSuggestions, getMySuggestions,
    voteForSuggestion, approveSuggestion, rejectSuggestion,
    deleteSuggestion, getVotingStats,
};
