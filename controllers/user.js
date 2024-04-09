const { isValidObjectId } = require("mongoose");
const jwt = require("jsonwebtoken");
const EmailVerificationToken = require("../models/emailVerificationToken");
const User = require("../models/user");
const { sendError, generateRandomByte } = require("../utils/helper");
const { generateOTP, generateMailTransport } = require("../utils/mail"); 
const passwordResetToken = require("../models/passwordResetToken");

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

    const newEmailVerificationToken = new EmailVerificationToken({
      owner: newUser._id,
      token: otp,
    });

    await newEmailVerificationToken.save();

    var transport = generateMailTransport();

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

exports.emailVerify = async (req, res) => {
  const { userId, otp } = req.body;

  try{

    if(!isValidObjectId(userId)) return sendError(res, "Invalid User !");

    const user = await User.findById(userId);

    if(!user) return sendError(res, "User Not Found", 404);

    if(user.isVerified) return sendError(res, "User already verified", 404);

    const token = await EmailVerificationToken.findOne({ owner: userId });

    if(!token) return sendError(res, "TOken not found", 404);

    const isMatched = await token.compareToken(otp);

    if(!isMatched) return sendError(res, "Please Submit a Vaild OTP !");

    user.isVerified = true;

    await user.save();

    await EmailVerificationToken.findByIdAndDelete(token._id);

    var transport = generateMailTransport();

    transport.sendMail({
      from: "bloghub.co",
      to: user.email,
      subject: "Welcome Email",
      html: `Hi ${user.name},<br><br><h1>Welcome to our App and Thanks for choosing us. </h1></b><br><br>If you did not make this request, please Inform BlogHub Team and reset your password.<br><br>Regards,<br>BlogHub Team`,
    })

    const jwtToken = jwt.sign({userId: user._id}, process.env.JWT_SECRET);
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        token: jwtToken
      },
      message: "Your Account has been successfully verified."
    })

  }catch (error) {
    console.error("Error in verifyEmail:", error);
    return sendError(res, "Internal server error", 500);
  }
}

exports.resendEmailVerificationToken = async (req, res) => {
  const { userId } = req.body;

  try{

    if(!isValidObjectId(userId)) return sendError(res, "Invalid User !");

    const user = await User.findById(userId);

    if(!user) return sendError(res, "User not found", 404);

    if(user.isVerified) return sendError(res, "This email has already been verified");

    const alreadyHasToken = await EmailVerificationToken.findOne({
      owner: userId
    });

    if(alreadyHasToken) return sendError(res, "Only after 60 minutes you can request for another token");

    let otp = generateOTP();

    const newEmailVerificationToken = new EmailVerificationToken({
      owner: user._id,
      token: otp,
    })

    await newEmailVerificationToken.save();

    var transport = generateMailTransport();

    transport.sendMail({
      from: "bloghub.co",
      to: user.email,
      subject: "BlogHub OTP Verification",
      html: `Hi ${user.name},<br><br>Your OTP is <b>${otp}</b><br><br>If you did not make this request, please ignore this email.<br><br>Regards,<br>BlogHub Team`,
    })

    res.status(201).json({
      message: "New OTP has been sent to your registered email account."
    })

  }catch (error) {
    console.error("Error in Resend token:", error);
    return sendError(res, "Internal server error", 500);
  }
}

exports.signIn = async (req, res) => {
  
  const { email, password } = req.body;

  try{

    const user = await User.findOne({ email });

    if(!user) return sendError(res, "User Not Found", 404);

    const matched = await user.comparePassword(password);

    if(!matched) return sendError(res, "Invalid Credentials", 401);

    const { _id } = user;

    const jwtToken = jwt.sign({userId: _id}, process.env.JWT_SECRET);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        token: jwtToken
      },
      message: "Your Account has been successfully signed."
    })

  }catch(err){
    console.error("Error in signin:", err);
    return sendError(res, "Internal server error", 500);
  }

}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if(!email) return sendError(res, "Email is required");

    const user = await User.findOne({ email: email});

    if(!user) return sendError(res, "User not found", 404);

    const alreadyHasToken = await passwordResetToken.findOne({
      owner: user._id
    })

    if(alreadyHasToken) return sendError(res, "Only after 60 minutes you can request for another token");

    const token = await generateRandomByte();

    const newPasswordResetToken = await passwordResetToken({
      owner: user._id,
      token,
    });

    await newPasswordResetToken.save();

    const resetPasswordUrl = `http://localhost:3000/auth/reset-password?token=${token}&id=${user._id}`;

    const transport = generateMailTransport();

    transport.sendMail({
      from: "bloghub.co",
      to: user.email,
      subject: "BlogHub Password Reset",
      html: `Hi ${user.name},<br><br>You are receiving this email because you (or someone else) have requested the reset of the password for your account.<br><br>Please click on the following link, or paste this into your browser to complete the process:<br><br><a href="${resetPasswordUrl}">change password</a><br><br>If you did not make this request, please ignore this email.<br><br>Regards,<br>BlogHub Team`,
    })

    res.status(201).json({
      message: "Link sent to your registered email account."
    })

  } catch (error) {
    console.error("Error in forgetPassword:", error);
    return sendError(res, "Internal server error", 500);
  }
}

exports.sendResetPasswordTokenStatus = (req, res) => {
  res.json({ valid: true});
}