const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const reviewController = require('../controllers/reviewController');
const { validateBody, z } = require('../middlewares/validate');

// Validation schema for creation and updates
const reviewSchema = z.object({
  bookId: z.string().uuid().optional(), // optional for updates
  rating: z.number().min(1).max(5),
  comment: z.string().optional()
});

router.get('/book/:bookId', reviewController.getBookReviews);
router.post('/', authenticate, validateBody(reviewSchema), reviewController.createReview);
router.put('/:id', authenticate, validateBody(reviewSchema), reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);

module.exports = router;
