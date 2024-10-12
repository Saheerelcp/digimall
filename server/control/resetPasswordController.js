// controllers/resetPasswordController.js
const Seller = require('../model/Seller');
const Customer = require('../model/Customer');
const bcrypt = require('bcrypt'); // For password hashing

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

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

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Error in resetPassword:', error.message);
    return res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = resetPassword;
