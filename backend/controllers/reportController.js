const reportService = require('../services/reportService');

async function libraryStats(req, res, next) {
    try {
        const stats = await reportService.getLibraryStats();
        res.json({ success: true, data: stats });
    } catch (err) { next(err); }
}

async function borrowingReport(req, res, next) {
    try {
        const data = await reportService.getBorrowingReport(req.query.period);
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

async function popularBooks(req, res, next) {
    try {
        const data = await reportService.getPopularBooksReport(parseInt(req.query.limit) || 10);
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

async function userActivity(req, res, next) {
    try {
        const data = await reportService.getUserActivityReport();
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

async function financialReport(req, res, next) {
    try {
        const data = await reportService.getFinancialReport(req.query.startDate, req.query.endDate);
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

async function overdueReport(req, res, next) {
    try {
        const data = await reportService.getOverdueReport();
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

async function categoryReport(req, res, next) {
    try {
        const data = await reportService.getCategoryReport();
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

module.exports = { libraryStats, borrowingReport, popularBooks, userActivity, financialReport, overdueReport, categoryReport };
