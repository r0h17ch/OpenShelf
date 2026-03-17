const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middlewares/auth');
const circulationController = require('../controllers/circulationController');

// All circulation routes require authentication
router.use(authenticate);

// User routes
router.post('/borrow', circulationController.borrow);
router.post('/return', circulationController.returnBook);
router.post('/rent', circulationController.rent);
router.post('/buy', circulationController.buy);
router.get('/my', circulationController.myCirculations);
router.put('/renew/:id', circulationController.renew);

// Admin routes
router.get('/all', requireAdmin, circulationController.allCirculations);
router.post('/admin-borrow', requireAdmin, circulationController.adminBorrow);
router.put('/admin-return/:id', requireAdmin, circulationController.adminReturn);
router.post('/extend-due', requireAdmin, circulationController.extendDue);

module.exports = router;

