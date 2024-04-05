const express = require('express');
const { Signup, emailverify } = require('../controllers/user');
const { userValidator, validate } = require('../middlewares/validator');
const router = express.Router();

router.post("/user/signup",userValidator, validate, Signup);
router.post("/user/verifyemail", emailverify);

module.exports = router;