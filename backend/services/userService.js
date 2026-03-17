const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { AppError } = require('../middlewares/errorHandler');

const prisma = new PrismaClient();

async function getAllUsers() {
    return prisma.user.findMany({
        select: {
            id: true, email: true, name: true, role: true, isPremium: true,
            phone: true, address: true, fineBalance: true, totalFinesPaid: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
    });
}

async function addUser(data) {
    const { email, password, name, phone, address } = data;
    if (!email || !password || !name) throw new AppError('Email, password, and name are required.', 400);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError('Email already registered.', 409);

    const hashed = await bcrypt.hash(password, 10);
    return prisma.user.create({
        data: { email, password: hashed, name, phone, address, role: 'USER' },
        select: { id: true, email: true, name: true, role: true, phone: true, address: true, createdAt: true },
    });
}

async function addAdmin(data) {
    const { email, password, name, phone, address } = data;
    if (!email || !password || !name) throw new AppError('Email, password, and name are required.', 400);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError('Email already registered.', 409);

    const hashed = await bcrypt.hash(password, 10);
    return prisma.user.create({
        data: { email, password: hashed, name, phone, address, role: 'ADMIN' },
        select: { id: true, email: true, name: true, role: true, phone: true, address: true, createdAt: true },
    });
}

async function updateProfile(userId, data) {
    const { name, phone, address } = data;
    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    return prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
            id: true, email: true, name: true, role: true, isPremium: true,
            phone: true, address: true, fineBalance: true, totalFinesPaid: true,
        },
    });
}

module.exports = { getAllUsers, addUser, addAdmin, updateProfile };
