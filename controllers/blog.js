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

    const {
      secure_url: url,
      public_id,
      responsive_breakpoints,
    } = await cloudinary.uploader.upload(file.path, {
      transformation: {
        width: 1200,
        height: 630,
      },
      responsive_breakpoints: {
        create_derived: true,
        max_width: 640,
        max_images: 3,
      },
    });

    const finalThumbnail = { url, public_id, responsive: [] };
    const { breakpoints } = responsive_breakpoints[0];
    if (breakpoints.length) {
      for (let imgobj of breakpoints) {
        const { secure_url } = imgobj;
        finalThumbnail.responsive.push(secure_url);
      }
    }

    newBlog.thumbnail = finalThumbnail;

    await newBlog.save();

    res.status(201).json({
      message: "Blog Created Successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error("Error in create Blog ", error.message);
    return sendError(res, "Internal Server Error", 500);
  }
};

exports.updateBlog = async (req, res) => {
  const { blogId } = req.params;
  try {
    if (!isValidObjectId(blogId)) return sendError(res, "Invalid blog ID!");

    const blog = await Blog.findById(blogId);

    if (!blog) return sendError(res, "Blog not found!", 404);

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
      pdf,
    } = req.body;

    blog.title = title;
    blog.description = description;
    blog.publishDate = publishDate;
    blog.status = status;
    blog.type = type;
    blog.genres = genres;
    blog.tags = tags;
    blog.cast = cast;
    blog.pdf = pdf;

    if (author) {
      if (!isValidObjectId(author)) return sendError(res, "Invalid author Id!");
      blog.author = author;
    }

    if (writers) {
      for (let writerId of writers) {
        if (!isValidObjectId(writers))
          return sendError(res, "Invalid writers Id!");
      }
      blog.writers = writers;
    }

    await blog.save();

    res.status(201).json({
      message: "Blog Updated Successfully",
      blog: blog,
    });
  } catch (error) {
    console.error("Error in Update Blog ", error.message);
    return sendError(res, "Internal Server Error", 500);
  }
};
exports.updateThumbnail = async (req, res) => {
  const { blogId } = req.params;
  try {
    if (!isValidObjectId(blogId)) return sendError(res, "Invalid blog ID!");

    if (!req.file) return sendError(res, "Thumbnail is Missing!");

    const blog = await Blog.findById(blogId);

    if (!blog) return sendError(res, "Blog not found!", 404);

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
      pdf,
    } = req.body;

    blog.title = title;
    blog.description = description;
    blog.publishDate = publishDate;
    blog.status = status;
    blog.type = type;
    blog.genres = genres;
    blog.tags = tags;
    blog.cast = cast;
    blog.pdf = pdf;

    if (author) {
      if (!isValidObjectId(author)) return sendError(res, "Invalid author Id!");
      blog.author = author;
    }

    if (writers) {
      for (let writerId of writers) {
        if (!isValidObjectId(writers))
          return sendError(res, "Invalid writers Id!");
      }
      blog.writers = writers;
    }

    const thumbnail_id = blog.thumbnail?.public_id;

    if (thumbnail_id) {
      const { result } = await cloudinary.uploader.destroy(thumbnail_id);
      if (result !== "ok") {
        return sendError(res, "Could not remove image from cloud!", 404);
      }
    }

    const {
      secure_url: url,
      public_id,
      responsive_breakpoints,
    } = await cloudinary.uploader.upload(req.file.path, {
      transformation: {
        width: 1200,
        height: 630,
      },
      responsive_breakpoints: {
        create_derived: true,
        max_width: 640,
        max_images: 3,
      },
    });

    const finalThumbnail = { url, public_id, responsive: [] };
    const { breakpoints } = responsive_breakpoints[0];
    if (breakpoints.length) {
      for (let imgobj of breakpoints) {
        const { secure_url } = imgobj;
        finalThumbnail.responsive.push(secure_url);
      }
    }

    blog.thumbnail = finalThumbnail;

    await blog.save();

    res.status(201).json({
      message: "Blog Updated Successfully",
      blog: blog,
    });
  } catch (error) {
    console.error("Error in Update Blog ", error.message);
    return sendError(res, "Internal Server Error", 500);
  }
};

exports.deleteBlog = async (req, res) => {
  const { blogId } = req.params;
  try {
    if (!isValidObjectId(blogId)) return sendError(res, "Invalid blog ID!");

    const blog = await Blog.findById(blogId);

    if (!blog) return sendError(res, "Blog not found!", 404);

    const thumbnail_id = blog.thumbnail?.public_id;
    console.log(thumbnail_id);
    if (thumbnail_id) {
      const { result } = cloudinary.uploader.destroy(thumbnail_id);
      if (result !== "ok")
        return sendError(res, "Could not remove image from cloud!");
    }

    const pdf_id = blog.pdf?.public_id;
    if (!pdf_id) return sendError(res, "Could not find pdf in cloud!");

    if (pdf_id) {
      const { result } = cloudinary.uploader.destroy(pdf_id);
      if (result !== "ok")
        return sendError(res, "Could not remove pdf from cloud!");
    }

    await Blog.findByIdAndDelete(blogId);

    res.json({
      message: "Blog Delete Successfully",
    });
  } catch (error) {
    console.error("Error in Delete Blog ", error.message);
    return sendError(res, "Internal Server Error", 500);
  }
};
