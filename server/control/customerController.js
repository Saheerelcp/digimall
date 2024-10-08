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

module.exports = {
  signupCustomer
};
