const circulationService = require('../services/circulationService');

async function borrow(req, res, next) {
    try {
        const { bookId } = req.body;
        if (!bookId) return res.status(400).json({ success: false, message: 'bookId is required.' });
        const result = await circulationService.borrowBook(req.user.id, bookId);
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

async function returnBook(req, res, next) {
    try {
        const { circulationId } = req.body;
        if (!circulationId) return res.status(400).json({ success: false, message: 'circulationId is required.' });
        const result = await circulationService.returnBook(req.user.id, circulationId);
        res.json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

async function rent(req, res, next) {
    try {
        const { bookId } = req.body;
        if (!bookId) return res.status(400).json({ success: false, message: 'bookId is required.' });
        const result = await circulationService.rentBook(req.user.id, bookId);
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

async function buy(req, res, next) {
    try {
        const { bookId } = req.body;
        if (!bookId) return res.status(400).json({ success: false, message: 'bookId is required.' });
        const result = await circulationService.buyBook(req.user.id, bookId);
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

async function myCirculations(req, res, next) {
    try {
        const records = await circulationService.getUserCirculations(req.user.id);
        res.json({ success: true, data: records });
    } catch (err) {
        next(err);
    }
}

async function renew(req, res, next) {
    try {
        const result = await circulationService.renewBook(req.user.id, req.params.id);
        res.json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

async function adminBorrow(req, res, next) {
    try {
        const { email, bookId } = req.body;
        if (!email || !bookId) return res.status(400).json({ success: false, message: 'email and bookId are required.' });
        const result = await circulationService.adminBorrowBook(email, bookId);
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

async function adminReturn(req, res, next) {
    try {
        const result = await circulationService.adminReturnBook(req.params.id);
        res.json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

async function extendDue(req, res, next) {
    try {
        const { email, bookId, days } = req.body;
        if (!email || !bookId) return res.status(400).json({ success: false, message: 'email and bookId are required.' });
        const result = await circulationService.extendDueDate(email, bookId, days || 7);
        res.json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

async function allCirculations(req, res, next) {
    try {
        const records = await circulationService.getAllActiveCirculations();
        res.json({ success: true, data: records });
    } catch (err) {
        next(err);
    }
}

module.exports = { borrow, returnBook, rent, buy, myCirculations, renew, adminBorrow, adminReturn, extendDue, allCirculations };
