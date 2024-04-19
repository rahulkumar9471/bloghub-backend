const express = require('express');
const { create, updateAuthor, deleteAuthor, searchAuthor, latestAuthor, author } = require('../controllers/author');
const { uploadImage } = require('../middlewares/multer');
const { authorInfoValidator, validate } = require('../middlewares/validator');
const { isAuth, isAdmin } = require('../middlewares/auth');
const router = express.Router();

router.post('/create', isAuth, isAdmin, uploadImage.single('avater'), authorInfoValidator, validate, create);
router.post('/update/:authorId', isAuth, isAdmin, uploadImage.single('avatar'), authorInfoValidator, validate, updateAuthor);
router.delete('/delete/:authorId', isAuth, isAdmin, deleteAuthor);
router.get('/search', searchAuthor);
router.get('/latest', latestAuthor);
router.get('/:id', author);

module.exports = router;