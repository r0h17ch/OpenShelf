const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middlewares/auth');
const suggestionController = require('../controllers/suggestionController');

router.use(authenticate);

// User routes
router.post('/', suggestionController.createSuggestion);
router.get('/all', suggestionController.getAllSuggestions);
router.get('/my', suggestionController.getMySuggestions);
router.post('/vote/:id', suggestionController.voteForSuggestion);

// Admin routes
router.post('/approve/:id', requireAdmin, suggestionController.approveSuggestion);
router.post('/reject/:id', requireAdmin, suggestionController.rejectSuggestion);
router.delete('/:id', requireAdmin, suggestionController.deleteSuggestion);
router.get('/stats', requireAdmin, suggestionController.getVotingStats);

module.exports = router;
