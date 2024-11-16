const Seller = require('../model/Seller');

// Function to handle seller sign-up
const signupSeller = async (req, res) => {
  const { email, password, sellerName, shopName, contactNumber, shopAddress } = req.body;

  // Check if any required fields are missing
  if (!email || !password || !sellerName || !shopName || !contactNumber || !shopAddress) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if the email already exists in the database
    const existingSellerByEmail = await Seller.findOne({ email });
    if (existingSellerByEmail) {
      return res.status(400).json({ error: 'Email already associated with another seller' });
    }

    // Create a new seller instance with all the provided details
    const newSeller = new Seller({
      email,
      password,
      sellerName,
      shopName,
      contactNumber,
      shopAddress
    });

    await newSeller.save();
    res.status(201).json({ message: 'Seller registered successfully!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Modified login controller function to include sellerId
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

    // Return sellerId with the login success message
    return res.status(200).json({
      message: "Login successful.",
      sellerId: seller._id // Include sellerId in the response
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred. Please try again." });
  }
};

module.exports = { signupSeller, loginSeller };
