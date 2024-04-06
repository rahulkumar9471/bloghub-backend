const express = require('express');
const { Signup, emailverify, signin, resendEmailVerificationToken } = require('../controllers/user');
const { userValidator, validate, signInValidator } = require('../middlewares/validator');
const router = express.Router();

router.post("/user/signup",userValidator, validate, Signup);
router.post("/user/verifyemail", emailverify);
router.post("/user/signin", signInValidator, validate, signin);
router.post("/user/resend-token", resendEmailVerificationToken)

module.exports = router;