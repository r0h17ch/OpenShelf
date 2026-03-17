const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middlewares/auth');
const donationController = require('../controllers/donationController');

router.use(authenticate);

// User routes
router.post('/request', donationController.createDonationRequest);
router.get('/my', donationController.getUserDonations);
router.get('/my/:id', donationController.getUserDonationById);

// Admin routes
router.get('/all', requireAdmin, donationController.getAllDonations);
router.get('/stats', requireAdmin, donationController.getDonationStats);
router.get('/:id', requireAdmin, donationController.getDonationById);
router.put('/approve/:id', requireAdmin, donationController.approveDonation);
router.put('/reject/:id', requireAdmin, donationController.rejectDonation);
router.put('/complete/:id', requireAdmin, donationController.completeDonation);

module.exports = router;
