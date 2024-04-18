const { isValidObjectId } = require("mongoose");
const Author = require("../models/author");
const { sendError, uploadImageToCloud } = require("../utils/helper")
const cloudinary = require("../cloud");


exports.create = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req
  try {
    const newAuthor = new Author({ name, about, gender });
    if (file) {
      const { url, public_id } = await uploadImageToCloud(file.path)
      newAuthor.avatar = { url, public_id };
    }
    await newAuthor.save();
    res.status(200).json({
      id: newAuthor._id,
      name,
      about,
      gender,
      avatar: newAuthor.avatar?.url
    });
  } catch (error) {
    console.error("Error in Author creating", error.message);
    return sendError(res, "Internal Server Error", 500);
  }
};

exports.updateAuthor = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;
  const { authorId } = req.params;
  try {
    if (!isValidObjectId(authorId)) return sendError(res, "Invalid Request", 500);
    const author = await Author.findById(authorId);

    if (!author) return sendError(res, "Invalid Request, record not Found.", 404);

    const public_id = author.avatar?.public_id;

    if (public_id && file) {
      const { result } = await cloudinary.uploader.destroy(public_id);
      if (result !== 'ok') {
        return sendError(res, "Could not remove image from cloud!", 404);
      }
    }

    if (file) {
      const { url, public_id } = await uploadImageToCloud(file.path)
      author.avatar = { url, public_id };
    }

    author.name = name;
    author.about = about;
    author.gender = gender;

    await author.save();
    res.status(200).json({
      id: author._id,
      name,
      about,
      gender,
      avatar: author.avatar?.url
    });

  } catch (error) {
    console.error("Error in Author Updating", error.message);
    return sendError(res, "Internal Server Error", 500);
  }
}


exports.deleteAuthor = async (req, res) => {
  const { authorId } = req.params;
  try {
    if (!isValidObjectId(authorId)) return sendError(res, "Invalid Request", 500);
    const author = await Author.findById(authorId);

    if (!author) return sendError(res, "Invalid Request, record not Found.", 404);

    const public_id = author.avatar?.public_id;

    if (public_id) {
      const { result } = await cloudinary.uploader.destroy(public_id);
      if (result !== 'ok') {
        return sendError(res, "Could not remove image from cloud!", 404);
      }
    }

    await Author.findByIdAndDelete(authorId);

    res.json({ message: "Record deleted successfully" })

  } catch (error) {
    console.error("Error in Author Deleteing", error.message);
    return sendError(res, "Internal Server Error", 500);
  }
}

exports.searchAuthor = async (req, res) => {
  const { query } = req;
  try {
    const result = await Author.find({ $text: { $search: `"${query.name}"` } })
    res.json(result)

  } catch (error) {
    console.error("Error in Search Author", error.message);
    return sendError(res, "Internal Server Error", 500);
  }
}

exports.latestAuthor = async (req, res) => {
  try {
    const result = await Author.find().sort({ createdAt: -1 }).limit(12);
    res.json(result);
  } catch (error) {
    console.error("Error in latest Author", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.author = async (req, res) => {
  const { id } = req.params;
  try {
    if (!isValidObjectId(id)) return sendError(res, "Invalid Request", 500);
    const author = await Author.findById(id);

    if (!author) return sendError(res, "Invalid Request, Author not Found.", 404);

    res.json(author);

  } catch (error) {
    console.error("Error in Author", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}