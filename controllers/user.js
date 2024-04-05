const EmailVerificationToken = require("../models/emailVerificationToken");
const User = require("../models/user");
const { sendError } = require("../utils/helper");
const { generateOTP } = require("../utils/mail");
const nodemailer = require('nodemailer');

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

    console.log(otp);

    const newEmailVerificationToken = new EmailVerificationToken({
      owner: newUser._id,
      token: otp,
    });

    console.log(newEmailVerificationToken);

    await newEmailVerificationToken.save();

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.MAIL_TRAP_USER,
            pass: process.env.MAIL_TRAP_PASSWORD
        }
    })
    console.log(transport);
    transport.sendMail({
      from: "bloghub.co",
      to: newUser.email,
      subject: "BlogHub OTP Verification",
      html: `Hi ${newUser.name},<br><br>Your OTP is <b>${otp}</b><br><br>If you did not make this request, please ignore this email.<br><br>Regards,<br>BlogHub Team`,
    });

    res.status(201).json({
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
      },
    });

  } catch (err) {
    console.error("Error in signup", err.message);
    return sendError(res, "Internal Server Error", 500);
  }
};
