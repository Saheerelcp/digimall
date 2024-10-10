const Customer = require('../model/Customer');

// Function to handle customer sign-up (with Email)
const signupCustomer = (req, res) => {
  const { password, email } = req.body; // Only take email and password

  // Validate input fields
  if (!password || !email) {
    return res.status(400).json({ error: 'Both email and password are required' });
  }

  // Create a new customer instance, including the email
  const newCustomer = new Customer({
    password,  // Save password (consider hashing in real-world scenarios)
    email,     // Save email in the customer document
  });

  newCustomer.save()
    .then(() => {
      res.status(201).json({ message: 'Customer registered successfully' });
    })
    .catch(err => {
      if (err.code === 11000) {
        // Handle duplicate email error
        res.status(400).json({ error: 'Email is already taken' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    });
};

// Login controller function (only email and password)
const loginCustomer = async (req, res) => {
  const { email, password } = req.body;  // Use email instead of username

  try {
    // Find the customer by email
    const customer = await Customer.findOne({ email });

    // If no customer is found
    if (!customer) {
      return res.status(404).send("Email not found. Please sign up.");
    }

    // Check if the password matches
    if (customer.password !== password) {
      return res.status(401).send("Incorrect password. Try again or reset your password.");
    }

    // If everything is correct, send success response
    return res.status(200).send("Login successful.");
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred. Please try again.");
  }
};

module.exports = {
  signupCustomer,
  loginCustomer,
};
