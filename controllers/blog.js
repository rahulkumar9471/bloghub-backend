const { isValidObjectId } = require("mongoose");
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

exports.createBlog = async (req, res) => {
  const { file, body } = req;
  try {
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

    const newBlog = new Blog({
      title,
      description,
      publishDate,
      status,
      type,
      genres,
      tags,
      cast,
      thumbnail,
      pdf,
    });

    if (author) {
      if (!isValidObjectId(author)) return sendError(res, "Invalid author Id!");
      newBlog.author = author;
    }

    if (writers) {
      for (let writerId of writers) {
        if (!isValidObjectId(writers))
          return sendError(res, "Invalid writers Id!");
      }
      newBlog.writers = writers;
    }

    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      file.path,{
        transformation:{
          width: 500,
          height: 500,
        },
        responsive_breakpoints:{
          create_d
        }
      }
    );
  } catch (error) {
    console.error("Error in create Blog ", error.message);
    return sendError(res, "Internal Server Error", 500);
  }
};
