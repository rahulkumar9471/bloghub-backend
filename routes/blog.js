const express = require('express');
const { uploadBlogPdf, createBlog } = require('../controllers/blog'); 
const { uploadPdf, uploadImage } = require('../middlewares/multer');
const { isAuth, isAdmin } = require('../middlewares/auth');
 
const router = express.Router();

router.post('/upload-pdf', isAuth, isAdmin, uploadPdf.single('pdf'), uploadBlogPdf);
router.post('/create', isAuth, isAdmin, uploadImage.single('thumbnail'), createBlog);
 

module.exports = router;