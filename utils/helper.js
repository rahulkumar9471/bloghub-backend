const crypto = require('crypto');
const cloudinary = require('../cloud')

exports.sendError = (res, error, statusCode = 401) => {
    res.status(statusCode).json({ error });
}

exports.generateRandomByte = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(30, (err, buff) => {
            if (err) reject(err);
            const buffString = buff.toString('hex');
            resolve(buffString);
        })
    })
}

exports.uploadImageToCloud = async (file) => {
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(file, { gravity: "face", height: 500, width: 500, crop: "thumb" });
    return { url, public_id };
}