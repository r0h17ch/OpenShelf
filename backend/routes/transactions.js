const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middlewares/auth');
const transactionController = require('../controllers/transactionController');

router.use(authenticate);

// User routes
router.get('/my', transactionController.myTransactions);

// Admin routes
router.get('/all', requireAdmin, transactionController.allTransactions);
router.post('/record', requireAdmin, transactionController.recordTransaction);
router.get('/stats', requireAdmin, transactionController.stats);

module.exports = router;
