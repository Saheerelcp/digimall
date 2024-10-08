const Seller = require('../model/Seller');

// Function to handle seller sign-up
const signupSeller = async (req, res) => {
  const { username, password, shopAddress } = req.body;

  // Check if all fields are provided
  if (!username || !password || !shopAddress) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if seller already exists
    const existingSeller = await Seller.findOne({ username });
    if (existingSeller) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Create a new seller
    const newSeller = new Seller({
      username,
      password, // In real scenarios, hash the password before saving
      shopAddress,
    });

    // Save the new seller to the database
    await newSeller.save();

    // Respond with success
    res.status(201).json({ message: 'Seller registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { signupSeller };
