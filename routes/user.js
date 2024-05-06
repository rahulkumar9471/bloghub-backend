const express = require('express');
const { Signup, emailVerify, signIn, resendEmailVerificationToken, forgotPassword, sendResetPasswordTokenStatus, resetPassword } = require('../controllers/user');
const { userValidator, validate, signInValidator, validatePassword } = require('../middlewares/validator');
const { isAuth } = require('../middlewares/auth');
const { isValidPasswordResetToken } = require('../middlewares/user');
const router = express.Router();

router.post("/signup", userValidator, validate, Signup);
router.post("/verify-email", emailVerify);
router.post("/signin", signInValidator, validate, signIn);
router.post("/resend-email-verification-token", resendEmailVerificationToken);
router.post("/forgot-password", forgotPassword);
router.post("/verify-password-reset-token", isValidPasswordResetToken, sendResetPasswordTokenStatus);
router.post("/reset-password", validatePassword, validate, isValidPasswordResetToken, resetPassword);
router.get("/isAuth", isAuth, (req, res) => {
    const { user } = req;
    res.json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
            role: user.role
        }
    })
});

module.exports = router;