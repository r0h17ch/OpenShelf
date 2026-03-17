const suggestionService = require('../services/suggestionService');

async function createSuggestion(req, res, next) {
    try {
        const suggestion = await suggestionService.createSuggestion(req.user.id, req.body);
        res.status(201).json({ success: true, data: suggestion });
    } catch (err) { next(err); }
}

async function getAllSuggestions(req, res, next) {
    try {
        const suggestions = await suggestionService.getAllSuggestions();
        res.json({ success: true, data: suggestions });
    } catch (err) { next(err); }
}

async function getMySuggestions(req, res, next) {
    try {
        const suggestions = await suggestionService.getMySuggestions(req.user.id);
        res.json({ success: true, data: suggestions });
    } catch (err) { next(err); }
}

async function voteForSuggestion(req, res, next) {
    try {
        const result = await suggestionService.voteForSuggestion(req.user.id, req.params.id);
        res.json({ success: true, data: result });
    } catch (err) { next(err); }
}

async function approveSuggestion(req, res, next) {
    try {
        const suggestion = await suggestionService.approveSuggestion(req.params.id, req.user.id, req.body.adminNotes);
        res.json({ success: true, data: suggestion });
    } catch (err) { next(err); }
}

async function rejectSuggestion(req, res, next) {
    try {
        const suggestion = await suggestionService.rejectSuggestion(req.params.id, req.user.id, req.body.adminNotes);
        res.json({ success: true, data: suggestion });
    } catch (err) { next(err); }
}

async function deleteSuggestion(req, res, next) {
    try {
        await suggestionService.deleteSuggestion(req.params.id);
        res.json({ success: true, message: 'Suggestion deleted.' });
    } catch (err) { next(err); }
}

async function getVotingStats(req, res, next) {
    try {
        const stats = await suggestionService.getVotingStats();
        res.json({ success: true, data: stats });
    } catch (err) { next(err); }
}

module.exports = {
    createSuggestion, getAllSuggestions, getMySuggestions,
    voteForSuggestion, approveSuggestion, rejectSuggestion,
    deleteSuggestion, getVotingStats,
};
