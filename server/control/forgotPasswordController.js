// controllers/forgotPasswordController.js
const Seller = require('../model/Seller');
const Customer = require('../model/Customer');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

// EmailJS API endpoint
const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

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

    // Save OTP and expiration
    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save();

    // Prepare EmailJS payload
    const emailPayload = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_USER_ID,
      template_params: {
        to_email: email,
        otp: otp,
        user_type: userType.charAt(0).toUpperCase() + userType.slice(1), // Capitalize
      },
    };

    // Send OTP via EmailJS
    const emailResponse = await axios.post(EMAILJS_ENDPOINT, emailPayload, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (emailResponse.status === 200) {
      return res.status(200).json({ message: 'OTP sent to your email.' });
    } else {
      throw new Error('Failed to send OTP email.');
    }
  } catch (error) {
    console.error('Error in forgotPassword:', error.message);
    return res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = forgotPassword;
