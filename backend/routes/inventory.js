const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middlewares/auth');
const inventoryController = require('../controllers/inventoryController');

router.use(authenticate);

router.post('/', requireAdmin, inventoryController.createIssue);
router.get('/', requireAdmin, inventoryController.listIssues);
router.put('/resolve/:id', requireAdmin, inventoryController.resolveIssue);

module.exports = router;
