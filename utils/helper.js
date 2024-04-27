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

exports.formatAuthor = author => {
    const { name, gender, about, _id, avatar } = author
    return {
        id: _id,
        name,
        about,
        gender,
        avatar: avatar?.url
    }
}

exports.parseData = (req, res, next) => {
    const { pdf, cast, genres, tags, writers } = req.body;
    if(pdf) req.body.pdf = JSON.parse(pdf);
    if(cast) req.body.cast = JSON.parse(cast);
    if(genres) req.body.genres = JSON.parse(genres);
    if(tags) req.body.tags = JSON.parse(tags);
    if(writers) req.body.pdf = JSON.parse(writers);
    next();
}