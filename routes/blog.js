const express = require('express');
const { uploadBlogPdf } = require('../controllers/blog'); 
const { uploadPdf } = require('../middlewares/multer');
 
const router = express.Router();

router.post('/upload-pdf', uploadPdf.single('pdf'), uploadBlogPdf);
 

module.exports = router;