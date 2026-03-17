const donationService = require('../services/donationService');

async function createDonationRequest(req, res, next) {
    try {
        const donation = await donationService.createDonationRequest(req.user.id, req.body);
        res.status(201).json({ success: true, data: donation });
    } catch (err) { next(err); }
}

async function getUserDonations(req, res, next) {
    try {
        const donations = await donationService.getUserDonations(req.user.id);
        res.json({ success: true, data: donations });
    } catch (err) { next(err); }
}

async function getUserDonationById(req, res, next) {
    try {
        const donation = await donationService.getUserDonationById(req.user.id, req.params.id);
        res.json({ success: true, data: donation });
    } catch (err) { next(err); }
}

async function getAllDonations(req, res, next) {
    try {
        const result = await donationService.getAllDonations(req.query);
        res.json({ success: true, data: result });
    } catch (err) { next(err); }
}

async function getDonationStats(req, res, next) {
    try {
        const stats = await donationService.getDonationStats();
        res.json({ success: true, data: stats });
    } catch (err) { next(err); }
}

async function getDonationById(req, res, next) {
    try {
        const donation = await donationService.getDonationById(req.params.id);
        res.json({ success: true, data: donation });
    } catch (err) { next(err); }
}

async function approveDonation(req, res, next) {
    try {
        const donation = await donationService.approveDonation(req.params.id, req.user.id);
        res.json({ success: true, data: donation });
    } catch (err) { next(err); }
}

async function rejectDonation(req, res, next) {
    try {
        const donation = await donationService.rejectDonation(req.params.id, req.user.id, req.body.adminNotes);
        res.json({ success: true, data: donation });
    } catch (err) { next(err); }
}

async function completeDonation(req, res, next) {
    try {
        const donation = await donationService.completeDonation(req.params.id, req.user.id);
        res.json({ success: true, data: donation });
    } catch (err) { next(err); }
}

module.exports = {
    createDonationRequest, getUserDonations, getUserDonationById,
    getAllDonations, getDonationStats, getDonationById,
    approveDonation, rejectDonation, completeDonation,
};
