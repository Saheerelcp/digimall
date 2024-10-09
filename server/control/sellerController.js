const Seller = require('../model/Seller');

// Function to handle seller sign-up
const signupSeller = async (req, res) => {
  const { username, password, shopAddress } = req.body;

  if (!username || !password || !shopAddress) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingSeller = await Seller.findOne({ username });
    if (existingSeller) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const newSeller = new Seller({
      username,
      password,
      shopAddress,
    });

    await newSeller.save();
    res.status(201).json({ message: 'Seller registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login controller function
const loginSeller = async (req, res) => {
  const { username, password } = req.body;

  try {
    const seller = await Seller.findOne({ username });

    if (!seller) {
      return res.status(404).json({ error: "Username not found. Please sign up." });
    }

    if (seller.password !== password) {
      return res.status(401).json({ error: "Incorrect password. Try again or reset your password." });
    }

    return res.status(200).json({ message: "Login successful." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred. Please try again." });
  }
};

module.exports = { signupSeller, loginSeller };  // Correct export
