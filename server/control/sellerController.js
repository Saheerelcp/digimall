const Seller = require('../model/Seller');

// Function to handle seller sign-up
const signupSeller = async (req, res) => {
  const { password, email } = req.body; // Only email and password are needed

  // Check if any required fields are missing
  if (!password || !email) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if the email already exists in the database
    const existingSellerByEmail = await Seller.findOne({ email });
    if (existingSellerByEmail) {
      return res.status(400).json({ error: 'Email already associated with another seller' });
    }

    // Create a new seller instance
    const newSeller = new Seller({
      email,  // Save email in the database
      password,  // Save password in the database
    });

    await newSeller.save();
    res.status(201).json({ message: 'Seller registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login controller function (unchanged)
const loginSeller = async (req, res) => {
  const { email, password } = req.body;  // Use email instead of username

  try {
    const seller = await Seller.findOne({ email });  // Find by email instead of username

    if (!seller) {
      return res.status(404).json({ error: "Email not found. Please sign up." });
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

module.exports = { signupSeller, loginSeller }; // Correct export
