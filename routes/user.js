const express = require('express');
const { Signup } = require('../controllers/user');
const { userValidator, validate } = require('../middlewares/validator');
const router = express.Router();

router.post("/user/signup",userValidator, validate, Signup);


module.exports = router;