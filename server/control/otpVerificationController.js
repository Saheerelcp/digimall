// controllers/otpVerificationController.js
const Seller = require('../model/Seller');
const Customer = require('../model/Customer');

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    let user;
    // Check if the email belongs to a seller or customer
    user = await Seller.findOne({ email });
    if (!user) {
      user = await Customer.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Validate OTP and expiration
    console.log(`otp${otp}`);
    console.log(`user otp:${user.otp}`);
    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP.' });
    }

    if (user.otpExpiration < Date.now()) {
      return res.status(400).json({ error: 'OTP has expired.' });
    }

    // Clear OTP and expiration after successful verification
    user.otp = null;
    user.otpExpiration = null;
    await user.save();

    return res.status(200).json({ message: 'OTP verified successfully.' });
  } catch (error) {
    console.error('Error in verifyOtp:', error.message);
    return res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = verifyOtp;
