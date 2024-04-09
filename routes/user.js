const express = require('express');
const { Signup, emailVerify, signIn, resendEmailVerificationToken, forgotPassword, sendResetPasswordTokenStatus } = require('../controllers/user');
const { userValidator, validate, signInValidator } = require('../middlewares/validator');
const { isAuth } = require('../middlewares/auth');
const { isValidPasswordResetToken } = require('../middlewares/user');
const router = express.Router();

router.post("/user/signup", userValidator, validate, Signup);
router.post("/user/verify-email", emailVerify);
router.post("/user/signin", signInValidator, validate, signIn);
router.post("/user/resend-email-verification-token", resendEmailVerificationToken);
router.post("/user/forgot-password", forgotPassword);
router.post("/user/verify-password-reset-token",isValidPasswordResetToken ,sendResetPasswordTokenStatus)
router.get("/user/isAuth", isAuth, (req, res) => {
    const { user } = req;
    res.json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    })
});

module.exports = router;