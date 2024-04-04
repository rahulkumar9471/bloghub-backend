const emailVarificationToken = require('../models/emailVarificationToken');
const User = require('../models/user');
const { sendError } = require('../utils/helper');
const { generateOTP } = require('../utils/mail');


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

        let otp = generateOTP();

        const newEmailVarificationToken = new emailVarificationToken({
            owner: newUser._id,
            token: otp
        })

        await newEmailVarificationToken.save();


    } catch (err) {
        console.error("Error in signup", err.message);
        return sendError(res, "Internal Server Error", 500)
    }

}