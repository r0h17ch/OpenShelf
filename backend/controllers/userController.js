const userService = require('../services/userService');

async function getAllUsers(req, res, next) {
    try {
        const users = await userService.getAllUsers();
        res.json({ success: true, data: users });
    } catch (err) { next(err); }
}

async function addUser(req, res, next) {
    try {
        const user = await userService.addUser(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (err) { next(err); }
}

async function addAdmin(req, res, next) {
    try {
        const user = await userService.addAdmin(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (err) { next(err); }
}

async function updateProfile(req, res, next) {
    try {
        const user = await userService.updateProfile(req.user.id, req.body);
        res.json({ success: true, data: user });
    } catch (err) { next(err); }
}

module.exports = { getAllUsers, addUser, addAdmin, updateProfile };
