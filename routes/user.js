const express = require('express');
const { Signup } = require('../controllers/user');
const router = express.Router();

router.post("/user/signup", Signup);


module.exports = router;