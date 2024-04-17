const Author = require("../models/author");
const cloudinary = require('cloudinary').v2;
exports.create = (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req
};
