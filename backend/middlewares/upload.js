const multer = require('multer');
const path = require('path');
const { AppError } = require('./errorHandler');

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (_req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${unique}${ext}`);
    },
});

const pdfFilter = (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new AppError('Only PDF files are allowed.', 400), false);
    }
};

const imageFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new AppError('Only image files are allowed.', 400), false);
    }
};

const upload = multer({
    storage,
    fileFilter: pdfFilter,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

const uploadImage = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB for images
});

module.exports = { upload, uploadImage };
