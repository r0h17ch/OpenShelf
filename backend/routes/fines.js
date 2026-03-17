const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middlewares/auth');
const fineController = require('../controllers/fineController');

// All fine routes require authentication
router.use(authenticate);

// User routes
router.get('/my', fineController.myFines);
router.post('/calculate', fineController.calculate);
router.post('/:id/pay', fineController.pay);

// Admin routes
router.get('/all', requireAdmin, fineController.allFines);
router.put('/mark-paid/:id', requireAdmin, fineController.markPaid);

module.exports = router;

