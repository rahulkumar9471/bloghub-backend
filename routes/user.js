const express = require('express');
const { Signup, emailverify, signin, resendEmailVerificationToken } = require('../controllers/user');
const { userValidator, validate, signInValidator } = require('../middlewares/validator');
const { isAuth } = require('../middlewares/auth');
const router = express.Router();

router.post("/user/signup", userValidator, validate, Signup);
router.post("/user/verifyemail", emailverify);
router.post("/user/signin", signInValidator, validate, signin);
router.post("/user/resend-token", resendEmailVerificationToken);
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