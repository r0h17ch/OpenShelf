const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middlewares/auth');
const userController = require('../controllers/userController');

router.use(authenticate);

// User routes
router.put('/update-profile', userController.updateProfile);

// Admin routes
router.get('/all', requireAdmin, userController.getAllUsers);
router.post('/add-user', requireAdmin, userController.addUser);
router.post('/add-admin', requireAdmin, userController.addAdmin);

module.exports = router;
