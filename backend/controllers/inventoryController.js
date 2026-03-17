const inventoryService = require('../services/inventoryService');

async function createIssue(req, res, next) {
    try {
        const issue = await inventoryService.createInventoryIssue(req.user.id, req.body);
        res.status(201).json({ success: true, data: issue });
    } catch (err) { next(err); }
}

async function listIssues(req, res, next) {
    try {
        const issues = await inventoryService.listInventoryIssues(req.query);
        res.json({ success: true, data: issues });
    } catch (err) { next(err); }
}

async function resolveIssue(req, res, next) {
    try {
        const issue = await inventoryService.resolveInventoryIssue(req.params.id, req.user.id);
        res.json({ success: true, data: issue });
    } catch (err) { next(err); }
}

module.exports = { createIssue, listIssues, resolveIssue };
