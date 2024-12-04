const express = require("express");
const router = express.Router();
const Customer = require("../model/Customer");

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

module.exports = router;
