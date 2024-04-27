const express = require("express");
const { uploadBlogPdf, createBlog } = require("../controllers/blog");
const { uploadPdf, uploadImage } = require("../middlewares/multer");
const { isAuth, isAdmin } = require("../middlewares/auth");
const { parseData } = require("../utils/helper");
const { validate, validateBlog } = require("../middlewares/validator");

const router = express.Router();

router.post(
  "/upload-pdf",
  isAuth,
  isAdmin,
  uploadPdf.single("pdf"),
  uploadBlogPdf
);
router.post(
  "/create",
  uploadImage.single("thumbnail"),
  parseData,
    // validateBlog,
    // validate,
  createBlog
);

module.exports = router;
