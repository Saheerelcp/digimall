const express = require('express');
const router = express.Router();
const customerController = require('../control/customerController');

// Route for customer sign-up
router.post('/SignupCustomer', customerController.signupCustomer);
// Customer login route
router.post('/CustomerLogin', customerController.loginCustomer);
router.post("/add-address", async (req, res) => {
    const { email, address } = req.body;
  
    try {
      const customer = await Customer.findOne({ email });
      if (!customer) return res.status(404).json({ message: "Customer not found" });
  
      customer.address = address;
      await customer.save();
      res.status(200).json({ message: "Address added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
module.exports = router;
