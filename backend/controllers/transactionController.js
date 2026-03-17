const transactionService = require('../services/transactionService');

async function myTransactions(req, res, next) {
    try {
        const transactions = await transactionService.getUserTransactions(req.user.id);
        res.json({ success: true, data: transactions });
    } catch (err) { next(err); }
}

async function allTransactions(req, res, next) {
    try {
        const result = await transactionService.getAllTransactions(req.query);
        res.json({ success: true, data: result });
    } catch (err) { next(err); }
}

async function recordTransaction(req, res, next) {
    try {
        const tx = await transactionService.createTransaction({ ...req.body, processedById: req.user.id });
        res.status(201).json({ success: true, data: tx });
    } catch (err) { next(err); }
}

async function stats(req, res, next) {
    try {
        const data = await transactionService.getTransactionStats();
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

module.exports = { myTransactions, allTransactions, recordTransaction, stats };
