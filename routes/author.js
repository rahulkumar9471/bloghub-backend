const express = require('express');
const { create, updateAuthor, deleteAuthor, searchAuthor, latestAuthor, author } = require('../controllers/author');
const { uploadImage } = require('../middlewares/multer');
const { authorInfoValidator, validate } = require('../middlewares/validator');
const { isAuth, isAdmin } = require('../middlewares/auth');
const router = express.Router();

router.post('/author/create', isAuth, isAdmin, uploadImage.single('avater'), authorInfoValidator, validate, create);
router.post('/author/update/:authorId', isAuth, isAdmin, uploadImage.single('avater'), authorInfoValidator, validate, updateAuthor);
router.delete('/author/delete/:authorId', isAuth, isAdmin, deleteAuthor);
router.get('/author/search', searchAuthor);
router.get('/author/latest', latestAuthor);
router.get('/author/:id', author);

module.exports = router;