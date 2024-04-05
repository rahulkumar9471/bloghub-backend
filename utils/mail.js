const nodemailer = require('nodemailer');
require('dotenv').config();

exports.generateOTP = (otp_length = 6) => {

    let otp = "";
    for (let i = 1; i <= otp_length; i++) {
        const randomval = Math.round(Math.random() * 9);
        otp += randomval;
    }
    return otp;
}

exports.generateMailTransport = () =>
    nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.MAIL_TRAP_USER,
            pass: process.env.MAIL_TRAP_PASSWORD
        }
    })
