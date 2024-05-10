const express = require("express");
const {
  uploadBlogPdf,
  createBlog,
  updateBlog,
  updateThumbnail,
  deleteBlog,
} = require("../controllers/blog");
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
  isAuth,
  isAdmin,
  uploadImage.single("thumbnail"),
  parseData,
  validateBlog,
  validate,
  createBlog
);
router.patch(
  "/update-info/:blogId",
  isAuth,
  isAdmin,
  parseData,
  validateBlog,
  validate,
  updateBlog
);
router.patch(
  "/update-thumbnail/:blogId",
  isAuth,
  isAdmin,
  uploadImage.single("thumbnail"),
  parseData,
  validateBlog,
  validate,
  updateThumbnail
);

router.delete("/delete/:blogId", deleteBlog)

module.exports = router;
