const Seller = require('../model/Seller');
const Customer = require('../model/Customer');

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  // Validate input
  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password are required.' });
  }

  try {
    // Check if the email belongs to a seller
    const user = await Seller.findOneAndUpdate(
      { email },
      { password: newPassword },
      { new: true } // Return the updated document
    );

    // If a seller was found and updated
    if (user) {
      console.log('Updated Seller:', user); // Log the updated seller
      return res.status(200).json({ message: 'Password reset successfully for seller.' });
    }

    // If no seller was found, check for a customer
    const customer = await Customer.findOneAndUpdate(
      { email },
      { password: newPassword },
      { new: true } // Return the updated document
    );

    // Check if a customer was found and updated
    if (customer) {
      console.log('Updated Customer:', customer); // Log the updated customer
      return res.status(200).json({ message: 'Password reset successfully for customer.' });
    }

    // If no seller or customer was found
    return res.status(404).json({ error: 'User not found.' });
  } catch (error) {
    console.error('Error in resetPassword:', error.message);
    return res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = resetPassword;
