const express = require("express");
const router = express.Router();
const Customer = require("../model/Customer");
const CustomerBill = require("../model/customerBill");

// Route to save or update address
router.post("/save-address", async (req, res) => {
  try {
    const { customerId, address } = req.body;
    console.log(`address of the customer:${address}`);

    // Validate input
    if (!customerId || !address) {
      return res.status(400).send("Customer ID and address are required.");
    }

    // Find the customer by ID and update their address
    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { address },
      { new: true } // Return the updated document
    );

    if (!customer) {
      return res.status(404).send("Customer not found.");
    }

    res.status(200).send("Address updated successfully.");
  } catch (error) {
    console.error("Error updating address:", error.message);
    res.status(500).send("Error updating address: " + error.message);
  }
});

router.post("/create-customer-bill" , async (req, res) => {
  try {
    const { customerId, sellerId, items, totalAmount } = req.body;

    // Validate the request data
    if (!customerId || !sellerId || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new customer bill
    const customerBill = new CustomerBill({
      customerId,
      sellerId,
      items,
      totalAmount,
      
    });

    // Save the bill to the database
    await customerBill.save();

    // Send a success response
    res.status(201).json({ message: "Customer bill sent to seller successfully!", customerBill });
  } catch (error) {
    console.error("Error creating customer bill:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
