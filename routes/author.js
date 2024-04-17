const express = require('express');
const { create } = require('../controllers/author');
const router = express.Router();

router.post('/author/create', create);

module.exports = router;