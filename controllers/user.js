const User = require('../models/user');
const { sendError } = require('../utils/helper');


exports.Signup = async (req, res) => {
    const { name, email, mobile, password } = req.body;

    try {

        const oldemail = await User.findOne({ email: email });

        if (oldemail) {
            return sendError(res, "Email Id already in use !");
        }

        const oldmobile = await User.findOne({ mobile: mobile });

        if (oldmobile) {
            return sendError(res, "Mobile no. already in use !");
        }

        const newUser = new User({ name, email, mobile, password });

        const response = await newUser.save();

        res.status(201).json({
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                mobile: newUser.mobile
            },
            message: "Account Created Successfully.",
        });

    } catch (err) {
        console.error("Error in signup", err.message);
        return sendError(res, "Internal Server Error", 500)
    }

}