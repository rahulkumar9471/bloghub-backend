const express = require('express');
const { create } = require('../controllers/author');
const { uploadImage } = require('../middlewares/multer');
const { authorInfoValidator, validate } = require('../middlewares/validator');
const router = express.Router();

router.post('/author/create', uploadImage.single('avater'), authorInfoValidator, validate, create);

module.exports = router;