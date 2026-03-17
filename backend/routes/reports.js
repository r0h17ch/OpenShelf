const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middlewares/auth');
const reportController = require('../controllers/reportController');

// All report routes require admin
router.use(authenticate, requireAdmin);

router.get('/library-stats', reportController.libraryStats);
router.get('/borrowing', reportController.borrowingReport);
router.get('/popular-books', reportController.popularBooks);
router.get('/user-activity', reportController.userActivity);
router.get('/financial', reportController.financialReport);
router.get('/overdue', reportController.overdueReport);
router.get('/category', reportController.categoryReport);

module.exports = router;
