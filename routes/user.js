const express = require('express');
const { Signup, emailverify, signin } = require('../controllers/user');
const { userValidator, validate } = require('../middlewares/validator');
const router = express.Router();

router.post("/user/signup",userValidator, validate, Signup);
router.post("/user/verifyemail", emailverify);
router.post("/user/signin", signin)

module.exports = router;