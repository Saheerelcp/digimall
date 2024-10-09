const Customer = require('../model/Customer');

// Function to handle customer sign-up
const signupCustomer = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newCustomer = new Customer({
    username,
    password, // In a real-world app, you should hash passwords before saving
  });

  newCustomer.save()
    .then(() => {
      res.status(201).json({ message: 'Customer registered successfully' });
    })
    .catch(err => {
      if (err.code === 11000) {
        // Handle duplicate username error
        res.status(400).json({ error: 'Username is already taken' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    });
};
//Login controller function
const loginCustomer = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the customer by username
    const customer = await Customer.findOne({ username });

    // If no customer is found
    if (!customer) {
      return res.status(404).send("Username not found. Please sign up.");
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
  signupCustomer,loginCustomer
};
