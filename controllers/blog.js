const cloudinary = require("../cloud");
const Blog = require("../models/blog");
const { sendError } = require("../utils/helper");

exports.uploadBlogPdf = async (req, res) => {
  const { file } = req;

  if (!file) return sendError(res, "PDF file is Missing!");

  try {
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        resource_type: "auto",
      }
    );
    res.status(201).json({ url, public_id });
  } catch (error) {
    console.error("Error in upload Blog Pdf ", error.message);
    return sendError(res, "Internal Server Error", 500);
  }
};

exports.createBlog = (req, res) => {
  const { file, body } = req;

  const {
    title,
    description,
    author,
    publishDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    thumbnail,
    pdf,
  } = body;
};
