const Seller = require('../model/Seller');
const Customer = require('../model/Customer');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();
console.log(process.env.EMAIL_USER);  // Should output your email address
console.log(process.env.EMAIL_PASS);  // Should output your app passwor
// Configure Nodemailer transporter

const transporter = nodemailer.createTransport({
  service: 'gmail',  // You can use other email service providers
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    let user;
    let userType;

    // Check if the email belongs to a seller or customer
    user = await Seller.findOne({ email });
    if (user) {
      userType = 'seller';
    } else {
      user = await Customer.findOne({ email });
      if (user) {
        userType = 'customer';
      }
    }

    if (!user) {
      return res.status(404).json({ error: 'User with this email does not exist.' });
    }

    // Generate OTP (6-digit)
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiration = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save OTP and expiration in the database
    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save();

    // Prepare the email content
    const mailOptions = {
      from: process.env.EMAIL_USER,  // Your email address
      to: email,  // Recipient's email address
      subject: 'Password Reset OTP',
      text: `Hello ${userType.charAt(0).toUpperCase() + userType.slice(1)},\n\nYour OTP for password reset is ${otp}.\nThis OTP is valid for 10 minutes.\n\nThank you!`,
    };

    // Send the OTP email using Nodemailer
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send OTP email.' });
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ message: 'OTP sent to your email.' });
      }
    });
  } catch (error) {
    console.error('Error in forgotPassword:', error.message);
    return res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = forgotPassword;
