const Customer = require('../model/Customer');

// Function to handle customer sign-up (with Email)
const signupCustomer = async (req, res) => {
  const { email, password } = req.body; // Only take email and password

  // Validate input fields
  if (!email || !password) {
    return res.status(400).json({ error: 'Both email and password are required' });
  }

  try {
    // Check if the email already exists in the database
    const existingCustomerByEmail = await Customer.findOne({ email });
    if (existingCustomerByEmail) {
      return res.status(400).json({ error: 'Email already associated with another customer' });
    }

    // Create a new customer instance with the provided details
    const newCustomer = new Customer({
      email,
      password, // Save password (consider hashing in real-world scenarios)
    });

    // Save the customer to the database
    const savedCustomer = await newCustomer.save();

    // Return the customerId and a success message
    res.status(201).json({ customerId: savedCustomer._id, message: 'Customer registered successfully!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
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
    return res.status(200).json({
      message: "Login successful.",
      customerId: customer._id // Include sellerId in the response
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred. Please try again.");
  }
};

module.exports = {
  signupCustomer,
  loginCustomer,
};
