const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middlewares/errorHandler');
const prisma = new PrismaClient();

// Get reviews for a standard book
exports.getBookReviews = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const reviews = await prisma.review.findMany({
            where: { bookId },
            include: { user: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'desc' }
        });
        
        // Compute average directly
        const avgRating = reviews.length > 0 
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
            : 0;

        res.json({ success: true, count: reviews.length, avgRating, data: reviews });
    } catch (err) {
        next(err);
    }
};

// Create a review
exports.createReview = async (req, res, next) => {
    try {
        const { bookId, rating, comment } = req.body;
        const userId = req.user.id;

        // Ensure user hasn't already reviewed this book
        const existing = await prisma.review.findFirst({ where: { bookId, userId } });
        if (existing) {
            return next(new AppError('You have already reviewed this book.', 400));
        }

        const review = await prisma.review.create({
            data: { bookId, userId, rating: parseInt(rating, 10), comment }
        });

        res.status(201).json({ success: true, data: review });
    } catch (err) {
        next(err);
    }
};

// Update review
exports.updateReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const review = await prisma.review.findUnique({ where: { id: req.params.id } });
        
        if (!review) return next(new AppError('Review not found', 404));
        if (review.userId !== req.user.id && req.user.role !== 'ADMIN') {
            return next(new AppError('Not authorized', 403));
        }

        const updated = await prisma.review.update({
            where: { id: req.params.id },
            data: { rating: parseInt(rating, 10), comment }
        });

        res.json({ success: true, data: updated });
    } catch (err) {
        next(err);
    }
};

// Delete review
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await prisma.review.findUnique({ where: { id: req.params.id } });
        
        if (!review) return next(new AppError('Review not found', 404));
        if (review.userId !== req.user.id && req.user.role !== 'ADMIN') {
            return next(new AppError('Not authorized', 403));
        }

        await prisma.review.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Review deleted' });
    } catch (err) {
        next(err);
    }
};
